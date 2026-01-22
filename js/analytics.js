// 1. Income vs Expenses Bar Chart
const ctx1 = document.getElementById('incomeExpensesChart').getContext('2d');
new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Income',
            data: [4200, 4500, 4200, 4800, 4500, 5200],
            backgroundColor: '#10b981',
            borderRadius: 6
        }, {
            label: 'Expenses',
            data: [3100, 3400, 2900, 3600, 3300, 3800],
            backgroundColor: '#ef4444',
            borderRadius: 6
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
    }
});

// 2. Cash Flow Line Chart
const ctx2 = document.getElementById('cashFlowChart').getContext('2d');
new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Balance',
            data: [2100, 3200, 4500, 5800, 7000, 8400],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: '#3b82f6'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
    }
});



       
        // Expense Pie Chart with unique naming
const expenseData = [
    { category: 'Food & Dining', percentage: 23, color: '#4A90E2', amount: 414 },
    { category: 'Utilities', percentage: 16, color: '#FF6B35', amount: 288 },
    { category: 'Shopping', percentage: 19, color: '#FF4081', amount: 342 },
    { category: 'Entertainment', percentage: 14, color: '#9B59B6', amount: 252 },
    { category: 'Transportation', percentage: 10, color: '#1ABC9C', amount: 180 },
    { category: 'Healthcare', percentage: 8, color: '#E74C3C', amount: 144 },
    { category: 'Education', percentage: 6, color: '#5B7CFF', amount: 108 },
    { category: 'Other', percentage: 4, color: '#95A5A6', amount: 72 }
];

const expenseSvg = document.getElementById('expensePieChart');
const expenseTooltip = document.getElementById('expenseTooltip');
const expenseCenterX = 300;
const expenseCenterY = 250;
const expenseRadius = 100;

function createExpensePieSlice(startAngle, endAngle, color, index, item) {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = expenseCenterX + expenseRadius * Math.cos(startRad);
    const y1 = expenseCenterY + expenseRadius * Math.sin(startRad);
    const x2 = expenseCenterX + expenseRadius * Math.cos(endRad);
    const y2 = expenseCenterY + expenseRadius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const pathData = `M ${expenseCenterX} ${expenseCenterY} L ${x1} ${y1} A ${expenseRadius} ${expenseRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', color);
    path.classList.add('expense-pie-slice');
    path.dataset.expenseIndex = index;

    path.addEventListener('mouseenter', () => {
        document.querySelectorAll('.expense-pie-slice').forEach(slice => {
            if (slice.dataset.expenseIndex !== index.toString()) {
                slice.classList.add('faded');
            }
        });
        expenseTooltip.textContent = `${item.category}: $${item.amount}`;
        expenseTooltip.classList.add('show');
    });

    path.addEventListener('mouseleave', () => {
        document.querySelectorAll('.expense-pie-slice').forEach(slice => {
            slice.classList.remove('faded');
        });
        expenseTooltip.classList.remove('show');
    });

    return path;
}

function createExpenseLabelLine(startAngle, endAngle, color) {
    const innerRadius = 105;
    const outerRadius = 150;
    const midAngle = (startAngle + endAngle) / 2;
    const rad = (midAngle - 90) * (Math.PI / 180);

    const x1 = expenseCenterX + innerRadius * Math.cos(rad);
    const y1 = expenseCenterY + innerRadius * Math.sin(rad);
    const x2 = expenseCenterX + outerRadius * Math.cos(rad);
    const y2 = expenseCenterY + outerRadius * Math.sin(rad);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.classList.add('expense-label-line');

    return line;
}

function createExpenseLabel(angle, text, color) {
    const distance = 165;
    const rad = (angle - 90) * (Math.PI / 180);
    const x = expenseCenterX + distance * Math.cos(rad);
    const y = expenseCenterY + distance * Math.sin(rad);

    let textAnchor = 'middle';
    if (x < expenseCenterX - 20) textAnchor = 'end';
    if (x > expenseCenterX + 20) textAnchor = 'start';

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('x', x);
    textEl.setAttribute('y', y);
    textEl.setAttribute('text-anchor', textAnchor);
    textEl.setAttribute('fill', color);
    textEl.setAttribute('dominant-baseline', 'middle');
    textEl.classList.add('expense-label-text');
    textEl.textContent = text;

    return textEl;
}

// Draw the expense chart
let currentExpenseAngle = 0;

expenseData.forEach((item, index) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const midAngle = currentExpenseAngle + sliceAngle / 2;

    // Create pie slice
    const slice = createExpensePieSlice(currentExpenseAngle, currentExpenseAngle + sliceAngle, item.color, index, item);
    expenseSvg.appendChild(slice);

    // Create label line
    const line = createExpenseLabelLine(currentExpenseAngle, currentExpenseAngle + sliceAngle, item.color);
    expenseSvg.appendChild(line);

    // Create label
    const label = createExpenseLabel(midAngle, `${item.category} ${item.percentage}%`, item.color);
    expenseSvg.appendChild(label);

    currentExpenseAngle += sliceAngle;
});