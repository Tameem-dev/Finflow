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

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (sidebar && !sidebar.contains(e.target) && mobileToggle && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    }
});

// ========== BUDGET MANAGEMENT LOGIC ==========
// Data
let budgets = JSON.parse(localStorage.getItem('budgets')) || {
    categories: [
        { id: 1, name: 'Food & Dining', icon: 'fork-knife', color: 'blue', budget: 500.00 },
        { id: 2, name: 'Transportation', icon: 'car', color: 'green', budget: 300.00 },
        { id: 3, name: 'Utilities', icon: 'lightning', color: 'orange', budget: 350.00 }
    ]
};

// Elements
const budgetGrid = document.getElementById('budgetGrid');
const budgetModal = document.getElementById('budgetModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const budgetForm = document.getElementById('budgetForm');
const searchInput = document.getElementById('searchInput');

// Set user name from localStorage
const userDisplay = document.getElementById("userDisplayName");
const userAvatar = document.getElementById("userAvatarIcon");
const savedName = localStorage.getItem("userName") || "User";

if (userDisplay) userDisplay.textContent = savedName;
if (userAvatar) userAvatar.textContent = savedName[0].toUpperCase();

// Check if user is logged in
const isLoggedIn = localStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
    Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please login to access your budgets',
        confirmButtonColor: '#4f46e5'
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
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out!',
                    text: 'Redirecting to login page...',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }
        });
    });
}

// Get spending for a category
function getSpending(catName) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return expenses
        .filter(e => e.category && e.category.toLowerCase().trim() === catName.toLowerCase().trim())
        .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
}

// Delete category function (global for onclick)
window.deleteCategory = function(id) {
    Swal.fire({
        title: 'Delete category?',
        text: "This will remove this budget limit.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            budgets.categories = budgets.categories.filter(c => c.id !== id);
            updateUI();
            Swal.fire('Deleted!', 'Budget category has been removed.', 'success');
        }
    });
};

// Update UI
function updateUI() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
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
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

// Render budget grid
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

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderGrid(e.target.value);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Modal functionality
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

// Close modal when clicking outside
if (budgetModal) {
    budgetModal.addEventListener('click', (e) => {
        if (e.target === budgetModal) {
            budgetModal.classList.remove('show');
        }
    });
}

// Form submission
if (budgetForm) {
    budgetForm.onsubmit = (e) => {
        e.preventDefault();
        const catName = document.getElementById('catName');
        const catAmount = document.getElementById('catAmount');
        const catColor = document.getElementById('catColor');
        
        if (!catName.value || !catAmount.value) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all fields!' });
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
        if (budgetModal) budgetModal.classList.remove('show');
        budgetForm.reset();
        Swal.fire({ icon: 'success', title: 'Added!', text: 'Budget category added successfully!', timer: 1500, showConfirmButton: false });
    };
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});

console.log('Budget page loaded with Three.js, Glass Morphism, and Mobile Responsiveness!');