// ========== USER DATA MANAGEMENT ==========
function getCurrentUserEmail() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.email : null;
}

function saveUserExpenses(expensesData) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return;
    
    const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
    allExpenses[userEmail] = expensesData;
    localStorage.setItem('finflow_all_expenses', JSON.stringify(allExpenses));
    localStorage.setItem('expenses', JSON.stringify(expensesData));
}

function loadUserExpenses() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return [];
    
    const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
    return allExpenses[userEmail] || [];
}

// ========== THREE.JS ANIMATED BACKGROUND ==========
const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
document.body.insertBefore(canvas, document.body.firstChild);

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create floating particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1800;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 55;
    posArray[i + 1] = (Math.random() - 0.5) * 35;
    posArray[i + 2] = (Math.random() - 0.5) * 45 - 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.07,
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating torus knot
const knotGeometry = new THREE.TorusKnotGeometry(1.1, 0.32, 180, 24, 3, 4);
const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    emissive: 0x312e81,
    roughness: 0.3,
    metalness: 0.7,
    transparent: true,
    opacity: 0.35
});
const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
torusKnot.position.set(3, 2, -11);
scene.add(torusKnot);

// Create floating spheres
const sphereGeometry = new THREE.SphereGeometry(0.65, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xa78bfa,
    emissive: 0x4c1d95,
    transparent: true,
    opacity: 0.3,
    roughness: 0.2,
    metalness: 0.8
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-2.8, -1.2, -9);
scene.add(sphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const backLight = new THREE.PointLight(0x3b82f6, 0.6);
backLight.position.set(-2, 1, -7);
scene.add(backLight);

// Animation
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    time += 0.008;

    particlesMesh.rotation.y = time * 0.1;
    particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.1;

    torusKnot.rotation.x = time * 0.4;
    torusKnot.rotation.y = time * 0.6;
    torusKnot.position.y = 2 + Math.sin(time * 0.8) * 0.2;

    sphere.rotation.x = time * 0.3;
    sphere.rotation.y = time * 0.5;

    camera.position.x = Math.sin(time * 0.1) * 0.2;
    camera.position.y = Math.cos(time * 0.15) * 0.1;
    camera.lookAt(0, 0, -2);

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== MOBILE MENU FUNCTIONALITY ==========
const mobileToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
    });
}

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (sidebar && !sidebar.contains(e.target) && mobileToggle && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    }
});

// ========== HEADER FUNCTIONALITY ==========
const storedName = localStorage.getItem('userName') || 'User';
const headerUserName = document.getElementById('headerUserName');
const headerAvatar = document.getElementById('headerAvatar');

if (headerUserName) headerUserName.textContent = storedName;
if (headerAvatar) headerAvatar.textContent = storedName.charAt(0).toUpperCase();

const sidebarUserName = document.querySelector('.user-name');
const sidebarUserAvatar = document.getElementById('userAvatar');
if (sidebarUserName) sidebarUserName.textContent = storedName;
if (sidebarUserAvatar) sidebarUserAvatar.textContent = storedName.charAt(0).toUpperCase();

// Date Range Selector
const dateRangeBtn = document.getElementById('dateRangeBtn');
const selectedRangeSpan = document.getElementById('selectedRange');

if (dateRangeBtn) {
    dateRangeBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Select Date Range',
            html: `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="swal2-btn" data-range="Today" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">Today</button>
                    <button class="swal2-btn" data-range="This Week" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">This Week</button>
                    <button class="swal2-btn" data-range="This Month" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">This Month</button>
                    <button class="swal2-btn" data-range="This Year" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">This Year</button>
                </div>
            `,
            showConfirmButton: false,
            background: '#0a0e27',
            color: '#fff',
            didOpen: () => {
                document.querySelectorAll('.swal2-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const range = btn.dataset.range;
                        if (selectedRangeSpan) selectedRangeSpan.textContent = range;
                        Swal.close();
                        Swal.fire({
                            icon: 'success',
                            title: `${range} Selected`,
                            timer: 1000,
                            showConfirmButton: false,
                            background: '#0a0e27',
                            color: '#fff',
                            iconColor: '#3b82f6'
                        });
                    });
                });
            }
        });
    });
}

// User menu click - go to profile
const userMenuBtn = document.getElementById('userMenuBtn');
if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });
}

// Search keyboard shortcut
const searchInputField = document.getElementById('searchInput');
if (searchInputField) {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInputField.focus();
        }
    });
}

// ========== EXPENSE MANAGEMENT LOGIC ==========
// Load expenses - NO SAMPLE EXPENSE
let expenses = loadUserExpenses();

// Only add sample expense for NEW users (empty expenses)
if (expenses.length === 0) {
    // For new users, start with empty array - no sample expense
    expenses = [];
    saveUserExpenses(expenses);
}

let editingExpenseId = null;

// DOM Elements
const modal = document.getElementById('expenseModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const expenseForm = document.getElementById('expenseForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const searchInput = document.getElementById('searchInput');

// Check if user is logged in
const isLoggedIn = localStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
    Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please login to access your expenses',
        confirmButtonColor: '#1e3a5f',
        background: '#0a0e27',
        color: '#fff'
    }).then(() => {
        window.location.href = 'login.html';
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1e3a5f',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Yes, logout',
            background: '#0a0e27',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('expenses');
                localStorage.removeItem('budgets');
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out!',
                    text: 'Redirecting to login page...',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#0a0e27',
                    color: '#fff',
                    iconColor: '#10b981'
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }
        });
    });
}

// Event Listeners
if (addExpenseBtn) addExpenseBtn.addEventListener('click', openAddModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
if (expenseForm) expenseForm.addEventListener('submit', handleSubmit);
if (searchInput) searchInput.addEventListener('input', handleSearch);

if (modal) {
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });
}

renderExpenses();
updateTotals();

function openAddModal() {
    editingExpenseId = null;
    modalTitle.textContent = 'Add Expense';
    submitBtn.textContent = 'Add Expense';
    expenseForm.reset();
    document.getElementById('date').valueAsDate = new Date();
    modal.classList.add('show');
}

function openEditModal(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    editingExpenseId = id;
    modalTitle.textContent = 'Edit Expense';
    submitBtn.textContent = 'Update Expense';
    document.getElementById('description').value = expense.description;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('category').value = expense.category;
    document.getElementById('date').value = expense.date;
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
    expenseForm.reset();
    editingExpenseId = null;
}

function handleSubmit(e) {
    e.preventDefault();
    const formData = {
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };

    if (editingExpenseId) {
        const index = expenses.findIndex(e => e.id === editingExpenseId);
        expenses[index] = { ...expenses[index], ...formData };
        Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Your expense has been updated.',
            background: '#0a0e27',
            color: '#fff',
            iconColor: '#3b82f6'
        });
    } else {
        const newExpense = { id: Date.now(), ...formData };
        expenses.unshift(newExpense);
        Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: 'Your expense has been added.',
            background: '#0a0e27',
            color: '#fff',
            iconColor: '#3b82f6'
        });
    }

    saveUserExpenses(expenses);
    renderExpenses();
    updateTotals();
    closeModal();
}

window.deleteExpense = function(id) {
    Swal.fire({
        title: 'Delete Expense?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e3a5f',
        cancelButtonColor: '#475569',
        confirmButtonText: 'Yes, delete it!',
        background: '#0a0e27',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            expenses = expenses.filter(e => e.id !== id);
            saveUserExpenses(expenses);
            renderExpenses();
            updateTotals();
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Your expense has been removed.',
                background: '#0a0e27',
                color: '#fff',
                iconColor: '#10b981'
            });
        }
    });
};

window.openEditModal = openEditModal;

function renderExpenses(filteredExpenses = expenses) {
    const tbody = document.getElementById('expensesTableBody');
    const emptyState = document.getElementById('emptyState');
    if (!tbody) return;

    if (filteredExpenses.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.classList.add('show');
        return;
    }
    if (emptyState) emptyState.classList.remove('show');
    
    tbody.innerHTML = filteredExpenses.map(expense => `
        <tr>
            <td>${escapeHtml(expense.description)}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td><span class="category-badge category-${getCategoryClass(expense.category)}">${expense.category}</span></td>
            <td>${formatDate(expense.date)}</td>
            <td>
                <div class="actions">
                    <button class="action-btn edit" onclick="openEditModal(${expense.id})">
                        <i class="ph ph-pencil-simple"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteExpense(${expense.id})">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
              </td>
        </tr>
    `).join('');
}

function getCategoryClass(category) {
    const map = {
        'Food & Dining': 'food',
        'Transportation': 'transportation',
        'Entertainment': 'entertainment',
        'Utilities': 'utilities',
        'Shopping': 'shopping',
        'Healthcare': 'healthcare',
        'Education': 'education',
        'Other': 'other'
    };
    return map[category] || 'other';
}

function updateTotals() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalEl = document.getElementById('totalAmount');
    const countEl = document.getElementById('transactionCount');
    if (totalEl) totalEl.textContent = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (countEl) countEl.textContent = expenses.length;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = expenses.filter(expense => 
        expense.description.toLowerCase().includes(searchTerm) ||
        expense.category.toLowerCase().includes(searchTerm)
    );
    renderExpenses(filtered);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

console.log('Expenses page loaded with no sample expense!');