// DirectorioPro - Frontend Logic (v5 - Full Supabase Integration)

// Credenciales de Supabase (Actualizadas según el proyecto solicitado)
const SUPABASE_URL = 'https://ehszvqwftqgxjggnbcmt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoc3p2cXdmdHFneGpnZ25iY210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NDI5MjAsImV4cCI6MjA4NTMxODkyMH0.wh8_Xy4_w9roFxMgbJ-J9A3r5V7duUjnStl4ZsZ0804';

let supabaseClient = null;
let allBusinesses = [];
let allCategories = [];

// Initialize Supabase
try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase initialized');
    }
} catch (err) { console.error('Supabase init error:', err); }

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DirectorioPro v5 Loaded');

    // --- 1. THEME ENGINE ---
    const html = document.documentElement;
    const setTheme = (theme) => {
        html.setAttribute('data-theme', theme);
        theme === 'dark' ? html.classList.add('dark') : html.classList.remove('dark');
        localStorage.setItem('directorio-theme', theme);
        updateThemeUI(theme);
    };

    const updateThemeUI = (theme) => {
        document.querySelectorAll('[data-theme-btn]').forEach(btn => {
            if (btn.getAttribute('data-theme-btn') === theme) {
                btn.classList.add('bg-white', 'shadow-md', 'text-pastel-blue', 'scale-110');
            } else {
                btn.classList.remove('bg-white', 'shadow-md', 'text-pastel-blue', 'scale-110');
            }
        });
    };

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-theme-btn]');
        if (btn) setTheme(btn.getAttribute('data-theme-btn'));
    });

    setTheme(localStorage.getItem('directorio-theme') || 'light');

    // --- 2. DATA FETCHING (Directory) ---
    async function fetchData() {
        let hasData = false;
        if (supabaseClient) {
            try {
                const { data: catData } = await supabaseClient.from('categories').select('*');
                const { data: busData } = await supabaseClient.from('businesses').select('*');

                if (catData && catData.length > 0) {
                    allCategories = catData;
                    hasData = true;
                }
                if (busData && busData.length > 0) {
                    allBusinesses = busData;
                    hasData = true;
                }
            } catch (e) { console.error("Fetch error, falling back to mock"); }
        }

        if (!hasData) mockData();
        else {
            renderCategories();
            renderBusinesses();
        }
    }

    function mockData() {
        allCategories = [
            { id: 1, name: 'Comida', slug: 'comida', icon_url: 'utensils' },
            { id: 2, name: 'Hogar', slug: 'hogar', icon_url: 'home' },
            { id: 3, name: 'Técnicos', slug: 'tecnicos', icon_url: 'wrench' },
            { id: 4, name: 'Salud', slug: 'salud', icon_url: 'heart' }
        ];
        allBusinesses = [
            { id: 1, name: 'Demo Biz 1', description: 'Expertos en servicios.', category_id: 1, rating: 4.5, is_featured: true },
            { id: 2, name: 'Demo Biz 2', description: 'Calidad garantizada.', category_id: 2, rating: 4.8, is_featured: false }
        ];
        renderCategories();
        renderBusinesses();
    }

    // --- 3. RENDERING (Landing) ---
    function renderCategories() {
        const grid = document.getElementById('categoryGrid');
        if (!grid) return;
        grid.innerHTML = allCategories.map(cat => `
            <div class="category-card themed-card p-10 text-center hover:-translate-y-2 transition cursor-pointer group" data-category="${cat.id}">
                <div class="w-20 h-20 bg-pastel-blue/20 text-pastel-blue rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-pastel-blue group-hover:text-white transition">
                    <span class="text-3xl font-bold">${cat.name[0]}</span>
                </div>
                <h3 class="font-black text-xl text-custom-main">${cat.name}</h3>
            </div>
        `).join('') + `
            <div class="category-card themed-card p-10 text-center hover:-translate-y-2 transition cursor-pointer group" data-category="all">
                <div class="w-20 h-20 bg-gray-200 text-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-400 group-hover:text-white transition">
                    <span class="text-3xl font-bold">*</span>
                </div>
                <h3 class="font-black text-xl text-custom-main">Todos</h3>
            </div>
        `;
    }

    function renderBusinesses(filter = null) {
        const grid = document.getElementById('businessGrid');
        if (!grid) return;

        let filtered = allBusinesses;
        if (filter) {
            filtered = allBusinesses.filter(b => b.category_id == filter || b.name.toLowerCase().includes(filter.toLowerCase()));
        }

        const countEl = document.getElementById('resultsCount');
        if (countEl) countEl.innerText = `Mostrando ${filtered.length} resultados`;

        grid.innerHTML = filtered.map(biz => `
            <div class="themed-card overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div class="h-48 bg-gray-200 relative">
                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80" class="w-full h-full object-cover">
                    ${biz.is_featured ? '<span class="absolute top-4 right-4 bg-pastel-pink text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Destacado</span>' : ''}
                </div>
                <div class="p-8">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-2xl font-black text-custom-main">${biz.name}</h3>
                        <div class="flex items-center gap-1 text-yellow-500 font-bold">
                            <span>★</span> <span>${biz.rating || '5.0'}</span>
                        </div>
                    </div>
                    <p class="text-custom-muted mb-6 line-clamp-2">${biz.description}</p>
                    <div class="flex gap-4">
                        <button class="flex-1 py-3 bg-pastel-blue/10 text-pastel-blue rounded-xl font-bold text-sm hover:bg-pastel-blue hover:text-white transition">Perfil</button>
                        <button class="px-5 py-3 border border-pastel-pink text-pastel-pink rounded-xl font-bold text-sm hover:bg-pastel-pink hover:text-white transition" onclick="alert('Llamando a ${biz.name}...')">Llamar</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- 4. DASHBOARD TOOLS (Real Supabase Integration) ---
    async function loadDashboardData() {
        if (!supabaseClient) return;
        try {
            // Load Inventory
            const { data: inv } = await supabaseClient.from('inventory').select('*').limit(5);
            const invList = document.getElementById('inventoryList');
            if (invList && inv) {
                invList.innerHTML = inv.map(i => `<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex justify-between"><span>${i.name}</span> <span class="font-bold">${i.quantity}</span></div>`).join('');
            }

            // Load Notes
            const { data: notes } = await supabaseClient.from('notes').select('*').order('created_at', { ascending: false }).limit(3);
            const notesGrid = document.getElementById('notesGrid');
            if (notesGrid && notes) {
                notesGrid.innerHTML = notes.map(n => `<div class="themed-card p-6"> <h4 class="font-bold">${n.title}</h4> <p class="text-sm opacity-70">${n.content}</p> </div>`).join('');
            }
        } catch (e) { console.warn("Dashboard fetch failed (expected if no tables yet)"); }
    }

    const noteForm = document.getElementById('noteForm');
    if (noteForm) {
        noteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = noteForm.querySelector('input').value;
            const content = noteForm.querySelector('textarea').value;

            showToast('Guardando nota...');
            if (supabaseClient) {
                const { error } = await supabaseClient.from('notes').insert([{ title, content }]);
                if (!error) {
                    showToast('Nota guardada correctamente');
                    loadDashboardData();
                } else {
                    console.error(error);
                    showToast('Error al guardar (Ver consola)');
                }
            }
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        });
    }

    const inventoryForm = document.getElementById('inventoryForm');
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = inventoryForm.querySelector('input[placeholder="Nombre del producto"]').value;
            const quantity = inventoryForm.querySelector('input[type="number"]').value;

            showToast('Actualizando inventario...');
            if (supabaseClient) {
                const { error } = await supabaseClient.from('inventory').insert([{ name, quantity: parseInt(quantity) }]);
                if (!error) {
                    showToast('Inventario actualizado');
                    loadDashboardData();
                }
            }
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        });
    }

    // --- 5. INTERACTION & AUTH ---
    document.addEventListener('click', (e) => {
        const catCard = e.target.closest('.category-card');
        if (catCard) {
            const catId = catCard.getAttribute('data-category');
            renderBusinesses(catId === 'all' ? null : catId);
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        }

        const trigger = e.target.closest('[data-modal]');
        if (trigger) {
            const modal = document.getElementById(trigger.getAttribute('data-modal'));
            if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
        }

        if (e.target.closest('.close-modal') || e.target.id === 'closeModal' || e.target.classList.contains('modal')) {
            document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
        }
    });

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            if (email === 'admin@pro.com') {
                showToast('Acceso correcto. Redirigiendo...');
                setTimeout(() => window.location.href = 'dashboard.html', 1000);
            } else {
                showToast('Modo Demo: Usa admin@pro.com / admin123');
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast('Cerrando sesión...');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }

    const tabBtns = document.querySelectorAll('[data-tab]');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            showToast(`Cambiando a: ${tab}`);
            tabBtns.forEach(b => {
                b.classList.remove('bg-pastel-blue/10', 'text-pastel-blue');
                b.classList.add('text-custom-muted');
            });
            btn.classList.add('bg-pastel-blue/10', 'text-pastel-blue');
            btn.classList.remove('text-custom-muted');
        });
    });

    function showToast(msg) {
        const t = document.createElement('div');
        t.className = 'toast fixed bottom-10 left-1/2 -translate-x-1/2 bg-custom-main text-white px-8 py-4 rounded-2xl font-black shadow-2xl z-[200] animate-fade-in';
        t.style.backgroundColor = 'var(--primary)';
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    // Init
    await fetchData();
    if (window.location.pathname.includes('dashboard.html')) {
        await loadDashboardData();
    }
});
