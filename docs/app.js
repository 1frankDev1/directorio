// DirectorioPro - Frontend Logic (Themed & Functional)

const SUPABASE_URL = 'https://ehszvqwftqgxjggnbcmt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoc3p2cXdmdHFneGpnZ25iY210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDI5MjAsImV4cCI6MjA4NTMxODkyMH0.wh8_Xy4_w9roFxMgbJ-J9A3r5V7duUjnStl4ZsZ0804';
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DirectorioPro Initialized');

    // --- THEME LOGIC ---
    const themes = ['light', 'intermediate', 'dark'];
    const html = document.documentElement;

    const setTheme = (theme) => {
        if (!themes.includes(theme)) return;
        html.setAttribute('data-theme', theme);
        localStorage.setItem('directorio-theme', theme);
        updateThemeButtons(theme);
    };

    const updateThemeButtons = (activeTheme) => {
        themes.forEach(t => {
            const btn = document.getElementById(`theme-${t}`);
            if (btn) {
                if (t === activeTheme) {
                    btn.classList.add('bg-white', 'shadow-sm', 'text-pastel-blue');
                    btn.classList.remove('text-gray-400');
                } else {
                    btn.classList.remove('bg-white', 'shadow-sm', 'text-pastel-blue');
                    btn.classList.add('text-gray-400');
                }
            }
        });
    };

    // Initialize Theme
    const savedTheme = localStorage.getItem('directorio-theme') || 'light';
    setTheme(savedTheme);

    // Event Listeners for Theme Buttons
    themes.forEach(t => {
        const btn = document.getElementById(`theme-${t}`);
        if (btn) btn.addEventListener('click', () => setTheme(t));
    });

    // --- MODAL LOGIC (Universal) ---

    // Open Modals
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modals
    const closeModals = () => {
        document.querySelectorAll('.modal, #loginModal').forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
        document.body.style.overflow = 'auto';
    };

    document.querySelectorAll('.close-modal, #closeModal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Close on background click
    document.querySelectorAll('.modal, #loginModal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModals();
        });
    });

    // Landing Page Specific Login Btn
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const modal = document.getElementById('loginModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });
    }

    // --- FUNCTIONAL MOCKS (SaaS Tools) ---

    // Mock Promotion Creation
    const promoForm = document.getElementById('promoForm');
    if (promoForm) {
        promoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = promoForm.querySelector('input').value;
            const type = promoForm.querySelector('select').value;

            const list = document.getElementById('promoList');
            const item = document.createElement('div');
            item.className = 'p-4 bg-gray-50 dark:bg-gray-800 border border-custom rounded-2xl flex items-center justify-between animate-fade-in';
            item.innerHTML = `
                <span class="text-sm font-bold text-custom-main">${title} (${type})</span>
                <span class="px-3 py-1 bg-gray-400 text-white text-[10px] font-black rounded-full uppercase">Borrador</span>
            `;
            list.prepend(item);
            promoForm.reset();
            closeModals();
            showToast('Promoción creada con éxito');
        });
    }

    // Mock Note Creation
    const noteForm = document.getElementById('noteForm');
    if (noteForm) {
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = noteForm.querySelector('textarea').value;

            const list = document.getElementById('noteList');
            const item = document.createElement('div');
            item.className = 'p-5 bg-pastel-pink/5 border-l-4 border-pastel-pink rounded-r-2xl animate-fade-in';
            item.innerHTML = `
                <p class="text-xs font-black text-pastel-pink mb-1 uppercase tracking-widest">Reciente</p>
                <p class="text-sm font-bold text-custom-main">${text}</p>
            `;
            list.prepend(item);
            noteForm.reset();
            closeModals();
            showToast('Nota añadida');
        });
    }

    // Mock Inventory Management
    const inventoryForm = document.getElementById('inventoryForm');
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = inventoryForm.querySelectorAll('input')[0].value;
            const qty = inventoryForm.querySelectorAll('input')[1].value;

            const preview = document.getElementById('inventoryPreview');
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 border-b border-custom animate-fade-in';
            item.innerHTML = `
                <span class="text-sm font-bold text-custom-main">${name}</span>
                <span class="text-sm font-black text-pastel-mint">${qty}</span>
            `;
            preview.prepend(item);
            inventoryForm.reset();
            closeModals();
            showToast('Inventario actualizado');
        });
    }

    // Toast Utility
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 bg-custom-main text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl z-[200] animate-fade-in';
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // --- PWA Service Worker ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('SW registered'))
                .catch(err => console.log('SW failed', err));
        });
    }
});
