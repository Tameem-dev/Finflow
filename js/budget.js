// Initialize budgets from localStorage or use default data
let budgets = JSON.parse(localStorage.getItem('budgets')) || {
    monthlyBudget: 2350.00,
    categories: [
        {
            id: 1,
            name: 'Food & Dining',
            icon: 'fork-knife',
            color: 'blue',
            budget: 500.00,
            spent: 420.00
        },
        {
            id: 2,
            name: 'Transportation',
            icon: 'car',
            color: 'green',
            budget: 300.00,
            spent: 180.00
        },
        {
            id: 3,
            name: 'Entertainment',
            icon: 'film-slate',
            color: 'purple',
            budget: 200.00,
            spent: 250.00
        },
        {
            id: 4,
            name: 'Shopping',
            icon: 'shopping-bag',
            color: 'pink',
            budget: 400.00,
            spent: 340.00
        },
        {
            id: 5,
            name: 'Utilities',
            icon: 'lightning',
            color: 'orange',
            budget: 350.00,
            spent: 280.00
        },
        {
            id: 6,
            name: 'Healthcare',
            icon: 'first-aid',
            color: 'red',
            budget: 250.00,
            spent: 150.00
        },
        {
            id: 7,
            name: 'Education',
            icon: 'graduation-cap',
            color: 'indigo',
            budget: 200.00,
            spent: 100.00
        },
        {
            id: 8,
            name: 'Other',
            icon: 'dots-three',
            color: 'gray',
            budget: 150.00,
            spent: 80.00
        }
    ]
};

let editingCategoryId = null;

// DOM Elements
const budgetModal = document.getElementById('budgetModal');
const monthlyBudgetModal = document.getElementById('monthlyBudgetModal');
const budgetForm = document.getElementById('budgetForm');
const monthlyBudgetForm = document.getElementById('monthlyBudgetForm');
const budgetGrid = document.getElementById('budgetGrid');
const closeModalBtn = document.getElementById('closeModal');
const closeMonthlyModalBtn = document.getElementById('closeMonthlyModal');
const cancelBtn = document.getElementById('cancelBtn');
const cancelMonthlyBtn = document.getElementById('cancelMonthlyBtn');
const editMonthlyBudgetBtn = document.getElementById('editMonthlyBudget');
const closeAiBannerBtn = document.getElementById('closeAiBanner');
const aiBanner = document.getElementById('aiBanner');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderBudgets();
    updateSummary();
});

// Close AI Banner
closeAiBannerBtn.addEventListener('click', () => {
    aiBanner.classList.add('hidden');
});

// Edit Monthly Budget
editMonthlyBudgetBtn.addEventListener('click', () => {
    document.getElementById('monthlyBudgetInput').value = budgets.monthlyBudget;
    monthlyBudgetModal.classList.add('show');
});

// Close Modals
closeModalBtn.addEventListener('click', () => {
    budgetModal.classList.remove('show');
});

closeMonthlyModalBtn.addEventListener('click', () => {
    monthlyBudgetModal.classList.remove('show');
});

cancelBtn.addEventListener('click', () => {
    budgetModal.classList.remove('show');
});

cancelMonthlyBtn.addEventListener('click', () => {
    monthlyBudgetModal.classList.remove('show');
});

// Close modal when clicking outside
budgetModal.addEventListener('click', (e) => {
    if (e.target === budgetModal) {
        budgetModal.classList.remove('show');
    }
});

monthlyBudgetModal.addEventListener('click', (e) => {
    if (e.target === monthlyBudgetModal) {
        monthlyBudgetModal.classList.remove('show');
    }
});

// Submit Budget Form
budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const budget = parseFloat(document.getElementById('budgetAmount').value);
    const spent = parseFloat(document.getElementById('spentAmount').value);

    const category = budgets.categories.find(c => c.id === editingCategoryId);
    if (category) {
        category.budget = budget;
        category.spent = spent;
        
        saveBudgets();
        renderBudgets();
        updateSummary();
        budgetModal.classList.remove('show');
    }
});

// Submit Monthly Budget Form
monthlyBudgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newMonthlyBudget = parseFloat(document.getElementById('monthlyBudgetInput').value);
    budgets.monthlyBudget = newMonthlyBudget;
    
    saveBudgets();
    updateSummary();
    monthlyBudgetModal.classList.remove('show');
});

// Render Budget Categories
function renderBudgets() {
    budgetGrid.innerHTML = budgets.categories.map(category => {
        const percentage = (category.spentreturn `
        <div class="budget-category-card">
            <div class="category-header">
                <div class="category-icon ${category.color}">
                    <i class="ph-fill ph-${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <span class="category-subtitle">Monthly Budget</span>
                </div>
                <button class="edit-icon" onclick="openEditModal(${category.id})">
                    <i class="ph ph-pencil-simple"></i>
                </button>
            </div>
            <div class="category-amount">
                <span class="amount">$${category.spent.toFixed(2)}</span>
                <span class="budget-total">of $${category.budget.toFixed(2)}</span>
                <span class="remaining ${isOverBudget ? 'red' : 'green'}">
                    ${isOverBudget ? '+' : ''}$${Math.abs(remaining).toFixed(2)}
                </span>
            </div>
            <div class="category-progress">
                <div class="category-bar">
                    <div class="category-fill ${category.color}-fill" style="width: ${Math.min(percentage, 100)}%"></div>
                </div>
                ${isOverBudget ? `
                    <div class="usage-row">
                        <span class="usage-text">${percentage.toFixed(1)}% used</span>
                        <span class="over-budget">Over budget</span>
                    </div>
                ` : `
                    <span class="usage-text">${percentage.toFixed(1)}% used</span>
                `}
            </div>
        </div>
    `;
}).join('');
editingCategoryId = categoryId;
document.getElementById('modalTitle').textContent = `Edit ${category.name}`;
document.getElementById('budgetAmount').value = category.budget;
document.getElementById('spentAmount').value = category.spent;

budgetModal.classList.add('show');
