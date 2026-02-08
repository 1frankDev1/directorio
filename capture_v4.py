from playwright.sync_api import sync_playwright
import os

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        path = os.path.abspath("docs/index.html")
        page.goto(f"file://{path}")

        # Wait for data fetch
        page.wait_for_timeout(3000)

        # Scroll to results
        page.locator("#results").scroll_into_view_if_needed()
        page.screenshot(path="v4_results_functional.png")

        # Open register modal
        page.click('button[data-modal="registerModal"]')
        page.wait_for_timeout(500)
        page.screenshot(path="v4_register_modal.png")

        browser.close()

if __name__ == "__main__":
    capture()
