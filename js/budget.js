// 1. Data
let budgets = JSON.parse(localStorage.getItem('budgets')) || {
    categories: [
        { id: 1, name: 'Food & Dining', icon: 'fork-knife', color: 'blue', budget: 500.00 },
        { id: 2, name: 'Transportation', icon: 'car', color: 'green', budget: 300.00 },
        { id: 3, name: 'Utilities', icon: 'lightning', color: 'orange', budget: 350.00 }
    ]
};

// 2. Elements
const budgetGrid = document.getElementById('budgetGrid');
const budgetModal = document.getElementById('budgetModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const budgetForm = document.getElementById('budgetForm');

// 3. Logic
function getSpending(catName) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return expenses
        .filter(e => e.category.toLowerCase().trim() === catName.toLowerCase().trim())
        .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
}

// DELETE FUNCTION
function deleteCategory(id) {
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
        }
    });
}

function updateUI() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const totalBudget = budgets.categories.reduce((sum, c) => sum + c.budget, 0);
    
    document.getElementById('totalBudgetDisplay').textContent = `$${totalBudget.toFixed(2)}`;
    document.getElementById('totalSpentDisplay').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('totalRemainingDisplay').textContent = `$${(totalBudget - totalSpent).toFixed(2)}`;

    const percent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const progressFill = document.querySelector('.progress-fill');
    if(progressFill) progressFill.style.width = `${Math.min(percent, 100)}%`;
    
    const progressText = document.querySelector('.progress-percentage');
    if(progressText) progressText.textContent = `${percent.toFixed(1)}%`;

    renderGrid();
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

function renderGrid() {
    budgetGrid.innerHTML = budgets.categories.map(cat => {
        const spent = getSpending(cat.name);
        const percent = (spent / cat.budget) * 100;
        return `
        <div class="budget-category-card">
            <div class="category-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="display: flex; gap: 12px;">
                    <div class="category-icon ${cat.color}">
                        <i class="ph ph-tag"></i>
                    </div>
                    <div class="category-info">
                        <h3>${cat.name}</h3>
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

// 4. Initialization
document.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem("userName") || "User";
    const userDisplay = document.getElementById("userDisplayName");
    const userAvatar = document.getElementById("userAvatarIcon");
    
    if(userDisplay) userDisplay.textContent = savedName;
    if(userAvatar) userAvatar.textContent = savedName[0].toUpperCase();

    updateUI();

    if(openModalBtn) openModalBtn.onclick = () => budgetModal.style.display = 'block';
    if(closeModalBtn) closeModalBtn.onclick = () => budgetModal.style.display = 'none';

    if(budgetForm) {
        budgetForm.onsubmit = (e) => {
            e.preventDefault();
            budgets.categories.push({
                id: Date.now(),
                name: document.getElementById('catName').value,
                budget: parseFloat(document.getElementById('catAmount').value),
                color: document.getElementById('catColor').value,
                icon: 'tag'
            });
            updateUI();
            budgetModal.style.display = 'none';
            budgetForm.reset();
            Swal.fire({ icon: 'success', title: 'Added!', timer: 1000, showConfirmButton: false });
        };
    }
});