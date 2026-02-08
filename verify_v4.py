from playwright.sync_api import sync_playwright
import os

def test_full_interactivity():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        path = os.path.abspath("docs/index.html")
        page.goto(f"file://{path}")

        print("Testing Theme Switcher...")
        # Click the 'dark' theme button
        page.click('button[data-theme-btn="dark"]')
        assert page.evaluate("document.documentElement.getAttribute('data-theme')") == 'dark'
        print("Theme Dark: OK")

        page.click('button[data-theme-btn="intermediate"]')
        assert page.evaluate("document.documentElement.getAttribute('data-theme')") == 'intermediate'
        print("Theme Intermediate: OK")

        page.click('button[data-theme-btn="light"]')
        assert page.evaluate("document.documentElement.getAttribute('data-theme')") == 'light'
        print("Theme Light: OK")

        print("Testing Modals...")
        # Click Register button
        page.click('button[data-modal="registerModal"]')
        assert page.is_visible('#registerModal')
        print("Register Modal: OK")

        page.click('#registerModal .close-modal')
        page.wait_for_timeout(500)
        assert not page.is_visible('#registerModal')
        print("Close Modal: OK")

        print("Testing Search...")
        page.fill('input[placeholder*="buscando"]', 'Test')
        page.click('button.bg-pastel-blue.text-white')
        # Check if results count updated
        assert "Mostrando" in page.inner_text('#resultsCount')
        print("Search Functional: OK")

        print("Testing Dashboard Tabs...")
        path_dash = os.path.abspath("docs/dashboard.html")
        page.goto(f"file://{path_dash}")

        page.click('button[data-tab="promos"]')
        # In my app.js it shows a toast
        page.wait_for_selector('.toast')
        assert "promos" in page.inner_text('.toast')
        print("Dashboard Tabs: OK")

        browser.close()

if __name__ == "__main__":
    try:
        test_full_interactivity()
        print("\nSUCCESS: All interactive elements are confirmed functional.")
    except Exception as e:
        print(f"\nFAILURE: {e}")
        exit(1)
