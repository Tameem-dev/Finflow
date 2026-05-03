// ========== USER DATA MANAGEMENT ==========
function getCurrentUserEmail() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.email : null;
}

function saveUserBudgets(budgetsData) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return;
    
    const allBudgets = JSON.parse(localStorage.getItem('finflow_all_budgets')) || {};
    allBudgets[userEmail] = budgetsData;
    localStorage.setItem('finflow_all_budgets', JSON.stringify(allBudgets));
    localStorage.setItem('budgets', JSON.stringify(budgetsData));
}

function loadUserBudgets() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) {
        return {
            categories: [
                { id: 1, name: 'Food & Dining', icon: 'fork-knife', color: 'blue', budget: 500.00 },
                { id: 2, name: 'Transportation', icon: 'car', color: 'green', budget: 300.00 },
                { id: 3, name: 'Utilities', icon: 'lightning', color: 'orange', budget: 350.00 }
            ]
        };
    }
    
    const allBudgets = JSON.parse(localStorage.getItem('finflow_all_budgets')) || {};
    return allBudgets[userEmail] || {
        categories: [
            { id: 1, name: 'Food & Dining', icon: 'fork-knife', color: 'blue', budget: 500.00 },
            { id: 2, name: 'Transportation', icon: 'car', color: 'green', budget: 300.00 },
            { id: 3, name: 'Utilities', icon: 'lightning', color: 'orange', budget: 350.00 }
        ]
    };
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
const userDisplay = document.getElementById("userDisplayName");
const userAvatar = document.getElementById("userAvatarIcon");
const savedName = localStorage.getItem("userName") || "User";

if (userDisplay) userDisplay.textContent = savedName;
if (userAvatar) userAvatar.textContent = savedName[0].toUpperCase();

const headerUserName = document.getElementById('headerUserName');
const headerAvatar = document.getElementById('headerAvatar');
if (headerUserName) headerUserName.textContent = savedName;
if (headerAvatar) headerAvatar.textContent = savedName[0].toUpperCase();

// Date Range Selector
const dateRangeBtn = document.getElementById('dateRangeBtn');
const selectedRangeSpan = document.getElementById('selectedRange');

if (dateRangeBtn) {
    dateRangeBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Select Date Range',
            html: `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="swal2-btn" data-range="Today" style="padding: 10px; border: none; background: #1e40af; color: white; border-radius: 8px; cursor: pointer;">Today</button>
                    <button class="swal2-btn" data-range="This Week" style="padding: 10px; border: none; background: #1e40af; color: white; border-radius: 8px; cursor: pointer;">This Week</button>
                    <button class="swal2-btn" data-range="This Month" style="padding: 10px; border: none; background: #1e40af; color: white; border-radius: 8px; cursor: pointer;">This Month</button>
                    <button class="swal2-btn" data-range="This Year" style="padding: 10px; border: none; background: #1e40af; color: white; border-radius: 8px; cursor: pointer;">This Year</button>
                </div>
            `,
            showConfirmButton: false,
            background: '#0f172a',
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
                            background: '#0f172a',
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

// ========== BUDGET MANAGEMENT LOGIC ==========
let budgets = loadUserBudgets();
saveUserBudgets(budgets);

const budgetGrid = document.getElementById('budgetGrid');
const budgetModal = document.getElementById('budgetModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const budgetForm = document.getElementById('budgetForm');
const searchInput = document.getElementById('searchInput');

const isLoggedIn = localStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
    Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please login to access your budgets',
        confirmButtonColor: '#1e40af',
        background: '#0f172a',
        color: '#fff'
    }).then(() => {
        window.location.href = 'login.html';
    });
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1e40af',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Yes, logout',
            background: '#0f172a',
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
                    background: '#0f172a',
                    color: '#fff'
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }
        });
    });
}

function getSpending(catName) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return 0;
    
    const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
    const expenses = allExpenses[userEmail] || [];
    return expenses
        .filter(e => e.category && e.category.toLowerCase().trim() === catName.toLowerCase().trim())
        .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
}

window.deleteCategory = function(id) {
    Swal.fire({
        title: 'Delete category?',
        text: "This will remove this budget limit.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e40af',
        cancelButtonColor: '#475569',
        confirmButtonText: 'Yes, delete it!',
        background: '#0f172a',
        color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            budgets.categories = budgets.categories.filter(c => c.id !== id);
            updateUI();
            saveUserBudgets(budgets);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Budget category has been removed.',
                timer: 1500,
                showConfirmButton: false,
                background: '#0f172a',
                color: '#fff'
            });
        }
    });
};

function updateUI() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return;
    
    const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
    const expenses = allExpenses[userEmail] || [];
    const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const totalBudget = budgets.categories.reduce((sum, c) => sum + c.budget, 0);
    
    const totalBudgetDisplay = document.getElementById('totalBudgetDisplay');
    const totalSpentDisplay = document.getElementById('totalSpentDisplay');
    const totalRemainingDisplay = document.getElementById('totalRemainingDisplay');
    
    if (totalBudgetDisplay) totalBudgetDisplay.textContent = `$${totalBudget.toFixed(2)}`;
    if (totalSpentDisplay) totalSpentDisplay.textContent = `$${totalSpent.toFixed(2)}`;
    if (totalRemainingDisplay) totalRemainingDisplay.textContent = `$${(totalBudget - totalSpent).toFixed(2)}`;

    const percent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const progressFill = document.querySelector('.progress-fill');
    if(progressFill) progressFill.style.width = `${Math.min(percent, 100)}%`;
    
    const progressText = document.querySelector('.progress-percentage');
    if(progressText) progressText.textContent = `${percent.toFixed(1)}%`;

    renderGrid();
    saveUserBudgets(budgets);
}

function renderGrid(searchTerm = '') {
    if (!budgetGrid) return;
    
    let filteredCategories = budgets.categories;
    if (searchTerm) {
        filteredCategories = budgets.categories.filter(cat => 
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filteredCategories.length === 0) {
        budgetGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px; background: rgba(255,255,255,0.1); border-radius: 16px;">
            <i class="ph ph-wallet" style="font-size: 48px; color: rgba(255,255,255,0.5);"></i>
            <p style="color: rgba(255,255,255,0.7); margin-top: 16px;">No budget categories yet. Click "Add Category" to get started!</p>
        </div>`;
        return;
    }
    
    budgetGrid.innerHTML = filteredCategories.map(cat => {
        const spent = getSpending(cat.name);
        const percent = (spent / cat.budget) * 100;
        return `
        <div class="budget-category-card">
            <div class="category-header">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="category-icon ${cat.color}">
                        <i class="ph ph-tag"></i>
                    </div>
                    <div class="category-info">
                        <h3>${escapeHtml(cat.name)}</h3>
                        <span class="category-subtitle">Monthly Budget</span>
                    </div>
                </div>
                <button onclick="deleteCategory(${cat.id})" class="delete-btn-x">✕</button>
            </div>
            <div class="category-amount">
                <span class="amount">$${spent.toFixed(2)}</span>
                <span class="budget-total">of $${cat.budget.toFixed(2)}</span>
            </div>
            <div class="category-progress">
                <div class="category-bar">
                    <div class="category-fill ${cat.color}-fill" style="width: ${Math.min(percent, 100)}%"></div>
                </div>
                <span class="usage-text">${percent.toFixed(1)}% used</span>
            </div>
        </div>`;
    }).join('');
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderGrid(e.target.value);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (openModalBtn) {
    openModalBtn.onclick = () => {
        if (budgetModal) budgetModal.classList.add('show');
    };
}

if (closeModalBtn) {
    closeModalBtn.onclick = () => {
        if (budgetModal) budgetModal.classList.remove('show');
    };
}

if (budgetModal) {
    budgetModal.addEventListener('click', (e) => {
        if (e.target === budgetModal) {
            budgetModal.classList.remove('show');
        }
    });
}

if (budgetForm) {
    budgetForm.onsubmit = (e) => {
        e.preventDefault();
        const catName = document.getElementById('catName');
        const catAmount = document.getElementById('catAmount');
        const catColor = document.getElementById('catColor');
        
        if (!catName.value || !catAmount.value) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill all fields!',
                confirmButtonColor: '#1e40af',
                background: '#0f172a',
                color: '#fff'
            });
            return;
        }
        
        budgets.categories.push({
            id: Date.now(),
            name: catName.value,
            budget: parseFloat(catAmount.value),
            color: catColor.value,
            icon: 'tag'
        });
        updateUI();
        saveUserBudgets(budgets);
        if (budgetModal) budgetModal.classList.remove('show');
        budgetForm.reset();
        Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: 'Budget category added successfully!',
            timer: 1500,
            showConfirmButton: false,
            background: '#0f172a',
            color: '#fff'
        });
    };
}

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});

console.log('Budget page loaded with user-specific data!');