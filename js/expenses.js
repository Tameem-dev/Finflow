// Initialize expenses from localStorage or use default data
let expenses = JSON.parse(localStorage.getItem('expenses')) || [
    {
        id: 1,
        description: 'Gas Station',
        amount: 700.00,
        category: 'Food & Dining',
        date: '2026-01-13'
    },
    {
        id: 2,
        description: 'Gas Station',
        amount: 45.00,
        category: 'Transportation',
        date: '2024-12-27'
    },
    {
        id: 3,
        description: 'Movie Tickets',
        amount: 32.00,
        category: 'Entertainment',
        date: '2024-12-26'
    },
    {
        id: 4,
        description: 'Electric Bill',
        amount: 120.00,
        category: 'Utilities',
        date: '2024-12-24'
    },
    {
        id: 5,
        description: 'Restaurant Dinner',
        amount: 68.50,
        category: 'Food & Dining',
        date: '2024-12-23'
    },
    {
        id: 6,
        description: 'Online Shopping',
        amount: 156.99,
        category: 'Shopping',
        date: '2024-12-22'
    }
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
addExpenseBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
expenseForm.addEventListener('submit', handleSubmit);
searchInput.addEventListener('input', handleSearch);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Initialize
renderExpenses();
updateTotals();

// Functions
function openAddModal() {
    editingExpenseId = null;
    modalTitle.textContent = 'Add Expense';
    submitBtn.textContent = 'Add Expense';
    expenseForm.reset();
    
    // Set today's date as default
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
        // Update existing expense
        const index = expenses.findIndex(e => e.id === editingExpenseId);
        expenses[index] = { ...expenses[index], ...formData };
    } else {
        // Add new expense
        const newExpense = {
            id: Date.now(),
            ...formData
        };
        expenses.unshift(newExpense);
    }

    saveExpenses();
    renderExpenses();
    updateTotals();
    closeModal();
}

function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(e => e.id !== id);
        saveExpenses();
        renderExpenses();
        updateTotals();
    }
}

function renderExpenses(filteredExpenses = expenses) {
    const tbody = document.getElementById('expensesTableBody');
    const emptyState = document.getElementById('emptyState');

    if (filteredExpenses.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    tbody.innerHTML = filteredExpenses.map(expense => `
        <tr>
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>
                <span class="category-badge category-${getCategoryClass(expense.category)}">
                    ${expense.category}
                </span>
            </td>
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
    const count = expenses.length;

    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    document.getElementById('transactionCount').textContent = count;
}

function getCategoryClass(category) {
    return category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
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