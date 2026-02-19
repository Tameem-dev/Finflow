/**
 * EXPENSE.JS
 * Handles only the expense management logic.
 * Auth and Logout are handled by logout.js
 */

let expenses = JSON.parse(localStorage.getItem('expenses')) || [
    { id: 1, description: 'Sample Expense', amount: 50.00, category: 'Food & Dining', date: '2026-02-11' }
];

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

// Event Listeners
if (addExpenseBtn) addExpenseBtn.addEventListener('click', openAddModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
if (expenseForm) expenseForm.addEventListener('submit', handleSubmit);
if (searchInput) searchInput.addEventListener('input', handleSearch);

// Close modal when clicking outside of it
if (modal) {
    modal.addEventListener('click', (e) => { 
        if (e.target === modal) closeModal(); 
    });
}

// Initial Render
renderExpenses();
updateTotals();

// --- CORE FUNCTIONS ---

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
    } else {
        const newExpense = { id: Date.now(), ...formData };
        expenses.unshift(newExpense);
    }

    saveExpenses();
    renderExpenses();
    updateTotals();
    closeModal();
}

// Global scope functions for HTML onclicks
window.deleteExpense = function(id) {
    // Using SweetAlert for Delete confirmation too!
    Swal.fire({
        title: 'Delete Expense?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // Red for delete
        cancelButtonColor: '#9ca3af',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            expenses = expenses.filter(e => e.id !== id);
            saveExpenses();
            renderExpenses();
            updateTotals();
            Swal.fire('Deleted!', 'Your expense has been removed.', 'success');
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
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td><span class="category-badge">${expense.category}</span></td>
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

function updateTotals() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalEl = document.getElementById('totalAmount');
    const countEl = document.getElementById('transactionCount');
    if (totalEl) totalEl.textContent = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
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

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}