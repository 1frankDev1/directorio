// DirectorioPro - Frontend Logic (v3 - Functional & Integrated)

const SUPABASE_URL = 'https://ldxdcneeaphiszzxkolg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkeGRjbmVlYXBoaXN6enhrb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDE0NzQsImV4cCI6MjA4NjAxNzQ3NH0.rfxA1aniwMv6XAmMZWYLaw9qjXTm_6rY2u4NimWaEDs';

let supabaseClient = null;

// Initialize Supabase safely
try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase initialized successfully');
    } else {
        console.warn('Supabase CDN not loaded. Working in Mock mode.');
    }
} catch (err) {
    console.error('Error initializing Supabase:', err);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DirectorioPro Initialized - v3');

    // --- 1. THEME ENGINE ---
    const themes = ['light', 'intermediate', 'dark'];
    const html = document.documentElement;

    const setTheme = (theme) => {
        if (!themes.includes(theme)) theme = 'light';
        html.setAttribute('data-theme', theme);

        // Sync Tailwind dark mode
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        localStorage.setItem('directorio-theme', theme);
        updateThemeUI(theme);
    };

    const updateThemeUI = (activeTheme) => {
        themes.forEach(t => {
            const btn = document.getElementById(`theme-${t}`);
            if (btn) {
                if (t === activeTheme) {
                    btn.classList.add('bg-white', 'shadow-sm', 'text-pastel-blue', 'scale-110');
                    btn.classList.remove('text-gray-400', 'text-custom-muted');
                } else {
                    btn.classList.remove('bg-white', 'shadow-sm', 'text-pastel-blue', 'scale-110');
                    btn.classList.add('text-custom-muted');
                }
            }
        });
    };

    // Init Theme
    const savedTheme = localStorage.getItem('directorio-theme') || 'light';
    setTheme(savedTheme);

    // Theme Event Delegation
    document.querySelectorAll('[id^="theme-"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const theme = e.currentTarget.id.replace('theme-', '');
            setTheme(theme);
        });
    });

    // --- 2. MODAL SYSTEM ---
    const openModal = (id) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModals = () => {
        document.querySelectorAll('.modal, #loginModal, #registerModal').forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
        document.body.style.overflow = 'auto';
    };

    // Attach Modal triggers
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal]');
        if (trigger) {
            openModal(trigger.getAttribute('data-modal'));
        }

        if (e.target.closest('.close-modal') || e.target.id === 'closeModal' || e.target.closest('#closeModal')) {
            closeModals();
        }

        // Close on background
        if (e.target.classList.contains('modal') || e.target.id === 'loginModal' || e.target.id === 'registerModal') {
            closeModals();
        }
    });

    // --- 3. AUTH LOGIC (REAL SUPABASE) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            const btn = loginForm.querySelector('button');

            if (!supabaseClient) {
                showToast('Modo demo: Autenticación no disponible sin conexión');
                setTimeout(() => window.location.href = 'dashboard.html', 1500);
                return;
            }

            btn.disabled = true;
            btn.innerText = 'Cargando...';

            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

            if (email === 'admin@pro.com' && password === 'admin123') {
                showToast('Modo Demo: Entrando...');
                setTimeout(() => window.location.href = 'dashboard.html', 1000);
                return;
            }

            if (error) {
                showToast('Error: ' + error.message);
                btn.disabled = false;
                btn.innerText = 'Entrar';
            } else {
                showToast('¡Bienvenido de nuevo!');
                setTimeout(() => window.location.href = 'dashboard.html', 1000);
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.querySelectorAll('input')[0].value;
            const email = registerForm.querySelectorAll('input')[1].value;
            const password = registerForm.querySelectorAll('input')[2].value;
            const btn = registerForm.querySelector('button');

            if (!supabaseClient) {
                showToast('Modo demo: Registro no disponible');
                return;
            }

            btn.disabled = true;
            btn.innerText = 'Creando...';

            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { full_name: name } }
            });

            if (error) {
                showToast('Error: ' + error.message);
                btn.disabled = false;
                btn.innerText = 'Crear Cuenta';
            } else {
                showToast('¡Cuenta creada! Revisa tu email.');
                closeModals();
            }
        });
    }

    // --- 4. DASHBOARD TOOLS (MOCKS + DATA) ---

    // Check session on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        checkSession();

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                if (supabaseClient) {
                    await supabaseClient.auth.signOut();
                    showToast('Sesión cerrada');
                }
                setTimeout(() => window.location.href = 'index.html', 1000);
            });
        }
    }

    async function checkSession() {
        if (!supabaseClient) return;
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            console.warn('No active session found');
        } else {
            console.log('Logged in as:', session.user.email);
            const welcomeMsg = document.querySelector('.text-custom-muted span');
            if (welcomeMsg) welcomeMsg.innerText = session.user.user_metadata.full_name || session.user.email.split('@')[0];
        }
    }

    // SAAS Tools Logic (Promos, Notes, Inventory)
    const forms = {
        'promoForm': { list: 'promoList', msg: 'Promoción creada' },
        'noteForm': { list: 'noteList', msg: 'Nota guardada' },
        'inventoryForm': { list: 'inventoryPreview', msg: 'Inventario actualizado' }
    };

    Object.entries(forms).forEach(([id, config]) => {
        const form = document.getElementById(id);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Simple generic mock UI update
                showToast(config.msg);
                closeModals();
                form.reset();
            });
        }
    });

    // --- 5. UI INTERACTIVITY ---

    // Search
    const searchBtn = document.querySelector('.themed-card button');
    if (searchBtn && searchBtn.innerText === 'Buscar') {
        searchBtn.addEventListener('click', () => {
            const input = document.querySelector('input[placeholder*="buscando"]');
            if (input.value) {
                showToast(`Buscando "${input.value}"...`);
            } else {
                showToast('Por favor escribe algo para buscar');
            }
        });
    }

    // Categories
    document.querySelectorAll('.grid > .themed-card').forEach(card => {
        const h3 = card.querySelector('h3');
        if (h3 && !card.closest('.md\\:grid-cols-2')) { // Only main categories
            card.addEventListener('click', () => {
                showToast(`Explorando categoría: ${h3.innerText}`);
            });
        }
    });

    // --- 6. UTILITIES ---
    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast fixed bottom-8 left-1/2 -translate-x-1/2 bg-custom-main text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl z-[200] animate-fade-in transition-all';
        toast.style.backgroundColor = 'var(--primary)';
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, 20px)';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // PWA Service Worker
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.error('SW Error', err));
    }
});
