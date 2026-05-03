// ========== USER DATA VERIFICATION ==========
function getCurrentUserEmail() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.email : null;
}

function loadUserData() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return false;
    
    const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
    const userExpenses = allExpenses[userEmail] || [];
    localStorage.setItem('expenses', JSON.stringify(userExpenses));
    
    const allBudgets = JSON.parse(localStorage.getItem('finflow_all_budgets')) || {};
    const userBudgets = allBudgets[userEmail] || {
        categories: [
            { id: 1, name: 'Food & Dining', icon: 'fork-knife', color: 'blue', budget: 500.00 },
            { id: 2, name: 'Transportation', icon: 'car', color: 'green', budget: 300.00 },
            { id: 3, name: 'Utilities', icon: 'lightning', color: 'orange', budget: 350.00 }
        ]
    };
    localStorage.setItem('budgets', JSON.stringify(userBudgets));
    
    return true;
}

// Call this at the start of your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    // ... rest of your existing dashboard code
});

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
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 60;
    posArray[i + 1] = (Math.random() - 0.5) * 40;
    posArray[i + 2] = (Math.random() - 0.5) * 50 - 25;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating torus knot
const knotGeometry = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32, 3, 4);
const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    emissive: 0x312e81,
    roughness: 0.3,
    metalness: 0.7,
    transparent: true,
    opacity: 0.35
});
const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
torusKnot.position.set(3, 2, -12);
scene.add(torusKnot);

// Create floating spheres
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xa78bfa,
    emissive: 0x4c1d95,
    transparent: true,
    opacity: 0.3,
    roughness: 0.2,
    metalness: 0.8
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-3, -1.5, -10);
scene.add(sphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const backLight = new THREE.PointLight(0x3b82f6, 0.6);
backLight.position.set(-2, 1, -8);
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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== USER DATA VERIFICATION ==========
function getCurrentUserEmail() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.email : null;
}

function loadUserData() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return false;
    
    // Load user's expenses
    const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
    const userExpenses = allExpenses[userEmail] || [];
    localStorage.setItem('expenses', JSON.stringify(userExpenses));
    
    // Load user's budgets
    const allBudgets = JSON.parse(localStorage.getItem('finflow_all_budgets')) || {};
    const userBudgets = allBudgets[userEmail] || {
        categories: [
            { id: 1, name: 'Food & Dining', icon: 'fork-knife', color: 'blue', budget: 500.00 },
            { id: 2, name: 'Transportation', icon: 'car', color: 'green', budget: 300.00 },
            { id: 3, name: 'Utilities', icon: 'lightning', color: 'orange', budget: 350.00 }
        ]
    };
    localStorage.setItem('budgets', JSON.stringify(userBudgets));
    
    return true;
}

// Call this at the beginning of DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    // ... rest of your existing DOMContentLoaded code
});

// ========== MOBILE MENU ==========
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

// ========== HELPER FUNCTIONS ==========

// Get all expenses from localStorage
function getAllExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

// Get total expenses amount
function getTotalExpenses() {
    const expenses = getAllExpenses();
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

// Get expenses by category
function getExpensesByCategory() {
    const expenses = getAllExpenses();
    const categoryTotals = {};
    
    expenses.forEach(expense => {
        if (categoryTotals[expense.category]) {
            categoryTotals[expense.category] += expense.amount;
        } else {
            categoryTotals[expense.category] = expense.amount;
        }
    });
    
    return categoryTotals;
}

// Get budget progress from budgets page
function getBudgets() {
    const budgets = JSON.parse(localStorage.getItem('budgets')) || {
        categories: [
            { id: 1, name: 'Food & Dining', color: 'blue', budget: 500.00 },
            { id: 2, name: 'Transportation', color: 'green', budget: 300.00 },
            { id: 3, name: 'Utilities', color: 'orange', budget: 350.00 }
        ]
    };
    return budgets.categories;
}

// Calculate spending by category for budget comparison
function getSpendingByCategory() {
    const expenses = getAllExpenses();
    const spending = {};
    
    expenses.forEach(expense => {
        if (spending[expense.category]) {
            spending[expense.category] += expense.amount;
        } else {
            spending[expense.category] = expense.amount;
        }
    });
    
    return spending;
}

// Calculate total income (sample calculation - can be enhanced)
function getTotalIncome() {
    // For demo purposes, using sample data + expense-based calculation
    // In real app, you'd have an income source
    const expenses = getAllExpenses();
    const totalExpenses = getTotalExpenses();
    // Assume income is expenses + 40% savings (sample logic)
    return totalExpenses + (totalExpenses * 0.4);
}

// Get recent transactions (last 5)
function getRecentTransactions() {
    const expenses = getAllExpenses();
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
}

// Calculate savings rate
function getSavingsRate() {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    if (totalIncome === 0) return 0;
    return ((totalIncome - totalExpenses) / totalIncome) * 100;
}

// Get percentage change (simplified for demo)
function getPercentageChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

// ========== DASHBOARD UPDATE FUNCTIONS ==========

// Update all dashboard stats in real-time
function updateDashboardStats() {
    const expenses = getAllExpenses();
    const totalExpensesAmount = getTotalExpenses();
    const totalIncomeAmount = getTotalIncome();
    const balance = totalIncomeAmount - totalExpensesAmount;
    const savingsRate = getSavingsRate();
    
    // Get previous month's expenses for comparison
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    }).reduce((sum, exp) => sum + exp.amount, 0);
    
    const lastMonthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth - 1 && expDate.getFullYear() === currentYear;
    }).reduce((sum, exp) => sum + exp.amount, 0);
    
    const expenseChange = getPercentageChange(currentMonthExpenses, lastMonthExpenses);
    
    // Update UI
    document.getElementById('totalIncome').textContent = `$${totalIncomeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('totalExpenses').textContent = `$${totalExpensesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('totalBalance').textContent = `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const savingsRateEl = document.querySelector('.stat-card:last-child .stat-value');
    if (savingsRateEl) savingsRateEl.textContent = `${savingsRate.toFixed(1)}%`;
    
    // Update trend indicators
    const expenseTrend = document.querySelector('.stat-card:nth-child(2) .stat-change');
    if (expenseTrend) {
        expenseTrend.innerHTML = expenseChange >= 0 ? `↑ ${expenseChange.toFixed(1)}% vs last month` : `↓ ${Math.abs(expenseChange).toFixed(1)}% vs last month`;
        expenseTrend.className = expenseChange >= 0 ? 'stat-change negative' : 'stat-change positive';
    }
}

// Update recent transactions
function updateRecentTransactions() {
    const recentExpenses = getRecentTransactions();
    const transactionList = document.getElementById('transactionList');
    
    if (!transactionList) return;
    
    if (recentExpenses.length === 0) {
        transactionList.innerHTML = '<div class="no-data">No transactions yet. Add your first expense!</div>';
        return;
    }
    
    const categoryIcons = {
        'Food & Dining': 'ph-fork-knife',
        'Transportation': 'ph-car',
        'Entertainment': 'ph-game-controller',
        'Utilities': 'ph-lightning',
        'Shopping': 'ph-shopping-cart',
        'Healthcare': 'ph-heart',
        'Education': 'ph-graduation-cap',
        'Other': 'ph-dots-three'
    };
    
    transactionList.innerHTML = recentExpenses.map(exp => {
        const icon = categoryIcons[exp.category] || 'ph-receipt';
        const isNegative = exp.amount > 0;
        return `
            <div class="transaction-item">
                <div class="transaction-icon ${getCategoryIconClass(exp.category)}">
                    <i class="ph ${icon}"></i>
                </div>
                <div class="transaction-details">
                    <span class="transaction-title">${escapeHtml(exp.description)}</span>
                    <span class="transaction-meta">${formatDate(exp.date)} • ${exp.category}</span>
                </div>
                <div class="transaction-amount negative">-$${exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
        `;
    }).join('');
}

function getCategoryIconClass(category) {
    const map = {
        'Food & Dining': 'grocery',
        'Transportation': 'income',
        'Entertainment': 'dining',
        'Utilities': 'utilities',
        'Shopping': 'grocery',
        'Healthcare': 'utilities',
        'Education': 'income',
        'Other': 'utilities'
    };
    return map[category] || 'grocery';
}

// Update budget overview
function updateBudgetOverview() {
    const budgets = getBudgets();
    const spending = getSpendingByCategory();
    const budgetList = document.getElementById('budgetList');
    
    if (!budgetList) return;
    
    if (budgets.length === 0) {
        budgetList.innerHTML = '<div class="no-data">No budgets set. Go to Budgets page to create one!</div>';
        return;
    }
    
    const colorMap = {
        'blue': 'blue',
        'green': 'green',
        'orange': 'red',
        'purple': 'purple',
        'red': 'red',
        'pink': 'purple',
        'indigo': 'blue'
    };
    
    budgetList.innerHTML = budgets.map(budget => {
        const spent = spending[budget.name] || 0;
        const percentage = (spent / budget.budget) * 100;
        const fillColor = colorMap[budget.color] || 'blue';
        const isOverBudget = spent > budget.budget;
        
        return `
            <div class="budget-item">
                <div class="budget-header">
                    <span>${escapeHtml(budget.name)}</span>
                    <span class="budget-values">$${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / $${budget.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${fillColor}" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                ${isOverBudget ? `<span class="over-budget">⚠️ Over budget by $${(spent - budget.budget).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>` : ''}
            </div>
        `;
    }).join('');
}

// Update AI Insight based on spending patterns
function updateAIInsight() {
    const expenses = getAllExpenses();
    const spendingByCategory = getExpensesByCategory();
    
    // Find highest spending category
    let topCategory = '';
    let topAmount = 0;
    for (const [category, amount] of Object.entries(spendingByCategory)) {
        if (amount > topAmount) {
            topAmount = amount;
            topCategory = category;
        }
    }
    
    const aiContent = document.querySelector('.ai-content p');
    if (aiContent && topCategory) {
        const savingsPotential = (topAmount * 0.15).toFixed(0);
        aiContent.innerHTML = `Your highest spending category is <strong>${topCategory}</strong> at $${topAmount.toLocaleString()}. Consider setting a stricter budget to save an extra <strong>$${savingsPotential}</strong> next month.`;
    }
}

// ========== HEADER FUNCTIONALITY ==========

// Set user info
const userName = localStorage.getItem('userName') || 'User';
const userAvatar = document.getElementById('userAvatar');
const userNameSpan = document.getElementById('userName');

if (userAvatar) userAvatar.textContent = userName.charAt(0).toUpperCase();
if (userNameSpan) userNameSpan.textContent = userName;

// Date Range Selector
const dateRangeBtn = document.getElementById('dateRangeBtn');
const selectedRangeSpan = document.getElementById('selectedRange');

if (dateRangeBtn) {
    dateRangeBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Select Date Range',
            html: `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="swal2-btn" data-range="Today" style="padding: 10px; border: none; background: #1e3a5f; color: white; border-radius: 8px; cursor: pointer;">Today</button>
                    <button class="swal2-btn" data-range="This Week" style="padding: 10px; border: none; background: #1e3a5f; color: white; border-radius: 8px; cursor: pointer;">This Week</button>
                    <button class="swal2-btn" data-range="This Month" style="padding: 10px; border: none; background: #1e3a5f; color: white; border-radius: 8px; cursor: pointer;">This Month</button>
                    <button class="swal2-btn" data-range="This Year" style="padding: 10px; border: none; background: #1e3a5f; color: white; border-radius: 8px; cursor: pointer;">This Year</button>
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
                        Swal.fire({ icon: 'success', title: `${range} Selected`, timer: 1000, showConfirmButton: false, background: '#0a0e27', color: '#fff', iconColor: '#3b82f6' });
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

// Search with keyboard shortcut
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length > 2) {
            console.log('Searching for:', query);
        }
    });
}

// ========== AUTH & LOGOUT ==========

// Check if user is logged in
const isLoggedIn = localStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
    Swal.fire({
        icon: 'warning',
        title: 'Not Logged In',
        text: 'Please login to access your dashboard',
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
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
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

// AI Insight button handlers
const setBudgetBtn = document.getElementById('setBudgetBtn');
const viewDetailsBtn = document.getElementById('viewDetailsBtn');

if (setBudgetBtn) {
    setBudgetBtn.addEventListener('click', () => {
        window.location.href = 'budget.html';
    });
}

if (viewDetailsBtn) {
    viewDetailsBtn.addEventListener('click', () => {
        window.location.href = 'analytics.html';
    });
}

// ========== INITIALIZE DASHBOARD ==========
function initDashboard() {
    updateDashboardStats();
    updateRecentTransactions();
    updateBudgetOverview();
    updateAIInsight();
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

// Listen for storage changes (when expenses are added/edited/deleted from other pages)
window.addEventListener('storage', (e) => {
    if (e.key === 'expenses' || e.key === 'budgets') {
        initDashboard();
    }
});

console.log('Dashboard loaded with real-time data from Expenses and Budgets pages!');