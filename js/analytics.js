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

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1800;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 55;
    posArray[i + 1] = (Math.random() - 0.5) * 35;
    posArray[i + 2] = (Math.random() - 0.5) * 45 - 20;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ size: 0.07, color: 0x60a5fa, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Torus Knot
const knotGeometry = new THREE.TorusKnotGeometry(1.1, 0.32, 180, 24, 3, 4);
const knotMaterial = new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x312e81, roughness: 0.3, metalness: 0.7, transparent: true, opacity: 0.35 });
const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
torusKnot.position.set(3, 2, -11);
scene.add(torusKnot);

// Sphere
const sphereGeometry = new THREE.SphereGeometry(0.65, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x4c1d95, transparent: true, opacity: 0.3, roughness: 0.2, metalness: 0.8 });
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

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== MOBILE MENU ==========
const mobileToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
}
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && sidebar && !sidebar.contains(e.target) && mobileToggle && !mobileToggle.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
    }
});

// ========== HELPER FUNCTIONS ==========

function getCurrentUserEmail() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.email : null;
}

function getAllExpenses() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return [];
    const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
    return allExpenses[userEmail] || [];
}

function getExpensesByPeriod(months) {
    const expenses = getAllExpenses();
    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setMonth(now.getMonth() - months);
    return expenses.filter(exp => new Date(exp.date) >= cutoffDate);
}

function getTotalIncome(expenses) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return totalExpenses * 1.4;
}

function getMonthlyData(months) {
    const expenses = getExpensesByPeriod(months);
    const now = new Date();
    const monthlyData = {};
    
    for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const label = date.toLocaleDateString('en-US', { month: 'short' });
        monthlyData[key] = { label, expenses: 0, income: 0 };
    }
    
    expenses.forEach(exp => {
        const date = new Date(exp.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (monthlyData[key]) {
            monthlyData[key].expenses += exp.amount;
        }
    });
    
    Object.keys(monthlyData).forEach(key => {
        monthlyData[key].income = monthlyData[key].expenses * 1.4;
    });
    
    return monthlyData;
}

function getExpensesByCategory() {
    const expenses = getAllExpenses();
    const categoryTotals = {};
    expenses.forEach(exp => {
        if (categoryTotals[exp.category]) {
            categoryTotals[exp.category] += exp.amount;
        } else {
            categoryTotals[exp.category] = exp.amount;
        }
    });
    return categoryTotals;
}

function calculateStats(periodMonths) {
    const expenses = getExpensesByPeriod(periodMonths);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = totalExpenses * 1.4;
    const avgExpenses = totalExpenses / periodMonths;
    const avgIncome = totalIncome / periodMonths;
    const avgSavings = avgIncome - avgExpenses;
    const savingsRate = avgIncome > 0 ? (avgSavings / avgIncome) * 100 : 0;
    
    return { avgIncome, avgExpenses, avgSavings, savingsRate, totalExpenses, totalIncome };
}

// ========== REAL-TIME OVERALL SCORE CALCULATION ==========

function calculateOverallScore() {
    const expenses = getAllExpenses();
    const budgetsData = JSON.parse(localStorage.getItem('budgets')) || { categories: [] };
    const budgets = budgetsData.categories;
    
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const transactionCount = expenses.length;
    const totalBudget = budgets.reduce((sum, c) => sum + c.budget, 0);
    
    // Get spending by category
    const spendingByCategory = {};
    expenses.forEach(e => {
        spendingByCategory[e.category] = (spendingByCategory[e.category] || 0) + e.amount;
    });
    
    // Calculate budget adherence score
    let budgetAdherenceScore = 100;
    budgets.forEach(budget => {
        const spent = spendingByCategory[budget.name] || 0;
        if (spent > budget.budget) {
            const overPercentage = ((spent - budget.budget) / budget.budget) * 100;
            budgetAdherenceScore -= Math.min(overPercentage, 30);
        } else if (spent > budget.budget * 0.8) {
            budgetAdherenceScore -= 5;
        }
    });
    budgetAdherenceScore = Math.max(0, Math.min(100, budgetAdherenceScore));
    
    // Calculate savings rate score
    const estimatedIncome = totalExpenses * 1.3;
    const savings = estimatedIncome - totalExpenses;
    const savingsRate = estimatedIncome > 0 ? (savings / estimatedIncome) * 100 : 0;
    
    let savingsScore = 0;
    if (savingsRate >= 30) savingsScore = 100;
    else if (savingsRate >= 20) savingsScore = 80;
    else if (savingsRate >= 15) savingsScore = 65;
    else if (savingsRate >= 10) savingsScore = 50;
    else if (savingsRate >= 5) savingsScore = 30;
    else savingsScore = 15;
    
    // Calculate consistency score
    let consistencyScore = 50;
    if (transactionCount > 0) {
        const monthsWithActivity = new Set();
        expenses.forEach(e => {
            const date = new Date(e.date);
            monthsWithActivity.add(`${date.getFullYear()}-${date.getMonth()}`);
        });
        consistencyScore = Math.min(100, (monthsWithActivity.size * 15) + 30);
    }
    
    // Calculate expense management score
    let expenseScore = 70;
    if (totalExpenses > 0) {
        if (totalExpenses < 1000) expenseScore = 95;
        else if (totalExpenses < 2000) expenseScore = 85;
        else if (totalExpenses < 3000) expenseScore = 75;
        else if (totalExpenses < 5000) expenseScore = 60;
        else expenseScore = 45;
    }
    
    // Calculate final score (0-10 scale)
    let finalScore = (
        (budgetAdherenceScore * 0.35) +
        (savingsScore * 0.25) +
        (consistencyScore * 0.20) +
        (expenseScore * 0.20)
    );
    
    finalScore = finalScore / 10;
    finalScore = Math.round(finalScore * 10) / 10;
    
    // Determine status message
    let statusMessage = "";
    if (finalScore >= 8.5) statusMessage = "Excellent financial health!";
    else if (finalScore >= 7.5) statusMessage = "Great financial progress!";
    else if (finalScore >= 6.5) statusMessage = "Good financial standing";
    else if (finalScore >= 5.5) statusMessage = "Fair - Room for improvement";
    else if (finalScore >= 4.5) statusMessage = "Needs attention";
    else statusMessage = "Critical - Review your finances";
    
    return { score: finalScore, message: statusMessage };
}

function updateOverallScore() {
    const scoreData = calculateOverallScore();
    const scoreNumberElement = document.querySelector('.score-number');
    const scoreMessageElement = document.querySelector('.score-card p');
    
    if (scoreNumberElement) {
        scoreNumberElement.textContent = scoreData.score;
    }
    
    if (scoreMessageElement) {
        scoreMessageElement.textContent = scoreData.message;
    }
}

// ========== CHART DATA BASED ON REAL EXPENSES ==========

let currentPeriod = 6;
let incomeExpensesChart, cashFlowChart;

const categoryColors = {
    'Food & Dining': '#4A90E2',
    'Transportation': '#1ABC9C',
    'Entertainment': '#9B59B6',
    'Utilities': '#FF6B35',
    'Shopping': '#FF4081',
    'Healthcare': '#E74C3C',
    'Education': '#5B7CFF',
    'Other': '#95A5A6'
};

function initCharts() {
    updateCharts(currentPeriod);
    updatePieChart();
    updateOverallScore();
}

function updateCharts(months) {
    const monthlyData = getMonthlyData(months);
    const labels = Object.values(monthlyData).map(d => d.label);
    const incomeData = Object.values(monthlyData).map(d => d.income);
    const expensesData = Object.values(monthlyData).map(d => d.expenses);
    const balanceData = Object.values(monthlyData).map(d => d.income - d.expenses);
    
    const stats = calculateStats(months);
    
    document.getElementById('avgIncome').textContent = `$${stats.avgIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('avgExpenses').textContent = `$${stats.avgExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('avgSavings').textContent = `$${stats.avgSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('savingsRate').textContent = `${stats.savingsRate.toFixed(1)}%`;
    
    const prevStats = calculateStats(months * 2);
    const incomeChange = prevStats.avgIncome > 0 ? ((stats.avgIncome - prevStats.avgIncome) / prevStats.avgIncome) * 100 : 0;
    const expenseChange = prevStats.avgExpenses > 0 ? ((stats.avgExpenses - prevStats.avgExpenses) / prevStats.avgExpenses) * 100 : 0;
    const savingsChange = prevStats.avgSavings > 0 ? ((stats.avgSavings - prevStats.avgSavings) / prevStats.avgSavings) * 100 : 0;
    
    document.getElementById('incomeTrend').innerHTML = `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}% vs last period`;
    document.getElementById('expenseTrend').innerHTML = `${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}% vs last period`;
    document.getElementById('savingsTrend').innerHTML = `${savingsChange >= 0 ? '+' : ''}${savingsChange.toFixed(1)}% vs last period`;
    
    let rateStatus = 'Needs improvement';
    if (stats.savingsRate >= 30) rateStatus = 'Excellent progress';
    else if (stats.savingsRate >= 20) rateStatus = 'Great progress';
    else if (stats.savingsRate >= 10) rateStatus = 'Good progress';
    else if (stats.savingsRate >= 5) rateStatus = 'On track';
    document.getElementById('rateStatus').textContent = rateStatus;
    
    const ctx1 = document.getElementById('incomeExpensesChart');
    if (ctx1) {
        if (incomeExpensesChart) incomeExpensesChart.destroy();
        incomeExpensesChart = new Chart(ctx1.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Income', data: incomeData, backgroundColor: '#4ade80', borderRadius: 6 },
                    { label: 'Expenses', data: expensesData, backgroundColor: '#f87171', borderRadius: 6 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: 'white' } } },
                scales: {
                    y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });
    }
    
    const ctx2 = document.getElementById('cashFlowChart');
    if (ctx2) {
        if (cashFlowChart) cashFlowChart.destroy();
        cashFlowChart = new Chart(ctx2.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{ label: 'Balance', data: balanceData, borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.1)', fill: true, tension: 0.4 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: 'white' } } },
                scales: {
                    y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });
    }
    
    updateOverallScore();
}

function updatePieChart() {
    const expenses = getAllExpenses();
    const categoryTotals = getExpensesByCategory();
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    const pieData = [];
    for (const [category, amount] of Object.entries(categoryTotals)) {
        if (amount > 0) {
            pieData.push({
                category: category,
                amount: amount,
                percentage: (amount / totalExpenses) * 100,
                color: categoryColors[category] || '#95A5A6'
            });
        }
    }
    
    pieData.sort((a, b) => b.amount - a.amount);
    
    const expenseSvg = document.getElementById('expensePieChart');
    const expenseTooltip = document.getElementById('expenseTooltip');
    
    if (!expenseSvg) return;
    
    while (expenseSvg.firstChild) {
        expenseSvg.removeChild(expenseSvg.firstChild);
    }
    
    if (pieData.length === 0) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', 300);
        text.setAttribute('y', 250);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'rgba(255,255,255,0.6)');
        text.setAttribute('font-size', '16');
        text.textContent = 'No expense data yet';
        expenseSvg.appendChild(text);
        return;
    }
    
    const centerX = 300, centerY = 250, radius = 100;
    let currentAngle = 0;
    
    function createPieSlice(start, end, color, category, amount, percentage) {
        const startRad = (start - 90) * Math.PI / 180;
        const endRad = (end - 90) * Math.PI / 180;
        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);
        const largeArc = end - start > 180 ? 1 : 0;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`);
        path.setAttribute('fill', color);
        path.classList.add('expense-pie-slice');
        path.addEventListener('mouseenter', () => {
            document.querySelectorAll('.expense-pie-slice').forEach(slice => slice.classList.add('faded'));
            if (expenseTooltip) {
                expenseTooltip.textContent = `${category}: $${amount.toFixed(2)} (${percentage.toFixed(1)}%)`;
                expenseTooltip.classList.add('show');
            }
        });
        path.addEventListener('mouseleave', () => {
            document.querySelectorAll('.expense-pie-slice').forEach(slice => slice.classList.remove('faded'));
            if (expenseTooltip) expenseTooltip.classList.remove('show');
        });
        return path;
    }
    
    function createLabel(angle, text, color) {
        const rad = (angle - 90) * Math.PI / 180;
        const distance = 140;
        const x = centerX + distance * Math.cos(rad);
        const y = centerY + distance * Math.sin(rad);
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.setAttribute('text-anchor', x < centerX - 20 ? 'end' : x > centerX + 20 ? 'start' : 'middle');
        textEl.setAttribute('fill', color);
        textEl.setAttribute('font-size', '11');
        textEl.classList.add('expense-label-text');
        textEl.textContent = text.length > 15 ? text.substring(0, 12) + '...' : text;
        return textEl;
    }
    
    pieData.forEach(item => {
        const sliceAngle = (item.amount / totalExpenses) * 360;
        const midAngle = currentAngle + sliceAngle / 2;
        const slice = createPieSlice(currentAngle, currentAngle + sliceAngle, item.color, item.category, item.amount, item.percentage);
        expenseSvg.appendChild(slice);
        
        if (item.percentage > 5) {
            const label = createLabel(midAngle, `${item.category} ${item.percentage.toFixed(0)}%`, item.color);
            expenseSvg.appendChild(label);
        }
        currentAngle += sliceAngle;
    });
}

// ========== TIME SELECTOR ==========
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        let months = 6;
        const period = btn.getAttribute('data-period');
        if (period === '1m') months = 1;
        else if (period === '3m') months = 3;
        else if (period === '6m') months = 6;
        else if (period === '1y') months = 12;
        
        currentPeriod = months;
        updateCharts(currentPeriod);
        
        Swal.fire({ 
            icon: 'success', 
            title: `${btn.textContent} View`, 
            text: `Showing data for last ${btn.textContent}`, 
            timer: 1000, 
            showConfirmButton: false, 
            background: '#0a0e27', 
            color: '#fff', 
            iconColor: '#3b82f6' 
        });
    });
});

// ========== HEADER FUNCTIONALITY ==========
const storedName = localStorage.getItem('userName') || 'User';
document.getElementById('headerUserName').textContent = storedName;
document.getElementById('headerAvatar').textContent = storedName.charAt(0).toUpperCase();
document.querySelector('.user-name').textContent = storedName;
document.querySelector('.user-avatar').textContent = storedName.charAt(0).toUpperCase();

// Date Range Picker
document.getElementById('dateRangeBtn')?.addEventListener('click', () => {
    Swal.fire({
        title: 'Select Date Range',
        html: `<div style="display: flex; flex-direction: column; gap: 8px;">
            <button class="swal2-btn" data-range="1M" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">Last Month</button>
            <button class="swal2-btn" data-range="3M" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">Last 3 Months</button>
            <button class="swal2-btn" data-range="6M" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">Last 6 Months</button>
            <button class="swal2-btn" data-range="1Y" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">Last Year</button>
        </div>`,
        showConfirmButton: false,
        background: '#0a0e27',
        color: '#fff',
        didOpen: () => {
            document.querySelectorAll('.swal2-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const range = btn.dataset.range;
                    document.getElementById('selectedRange').textContent = btn.textContent;
                    let months = 6;
                    if (range === '1M') months = 1;
                    else if (range === '3M') months = 3;
                    else if (range === '6M') months = 6;
                    else if (range === '1Y') months = 12;
                    currentPeriod = months;
                    updateCharts(currentPeriod);
                    Swal.close();
                    Swal.fire({ icon: 'success', title: `${btn.textContent} Selected`, timer: 1000, showConfirmButton: false, background: '#0a0e27', color: '#fff', iconColor: '#3b82f6' });
                });
            });
        }
    });
});

// Notifications
document.getElementById('notificationBtn')?.addEventListener('click', () => {
    Swal.fire({
        title: 'Notifications',
        html: `<div style="text-align: left;">
            <div style="padding: 8px 0; border-bottom: 1px solid #1e3a5f;"><strong>🔔 Budget Alert</strong><p style="margin: 5px 0 0; font-size: 12px;">Food & Dining budget at 84%</p><small>2 hours ago</small></div>
            <div style="padding: 8px 0; border-bottom: 1px solid #1e3a5f;"><strong>📊 Monthly Report</strong><p style="margin: 5px 0 0; font-size: 12px;">Spending decreased by 8%</p><small>Yesterday</small></div>
            <div style="padding: 8px 0;"><strong>🏆 Achievement</strong><p style="margin: 5px 0 0; font-size: 12px;">Saved $500 this month!</p><small>3 days ago</small></div>
        </div>`,
        confirmButtonText: 'Close',
        confirmButtonColor: '#1e3a5f',
        background: '#0a0e27',
        color: '#fff'
    });
});

// User Menu Click
document.getElementById('userMenuBtn')?.addEventListener('click', () => window.location.href = 'profile.html');

// Search Shortcut
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchInput.focus(); } });
}

// ========== AUTH GUARD ==========
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
        Swal.fire({ icon: 'warning', title: 'Not Logged In', text: 'Please login to access analytics', confirmButtonColor: '#1e3a5f', background: '#0a0e27', color: '#fff' })
            .then(() => window.location.href = "login.html");
        return;
    }
    initCharts();
});

// ========== LOGOUT ==========
document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    Swal.fire({
        title: 'Logout?', text: 'Are you sure you want to logout?', icon: 'question', showCancelButton: true,
        confirmButtonColor: '#1e3a5f', cancelButtonColor: '#475569', confirmButtonText: 'Yes, logout',
        background: '#0a0e27', color: '#fff'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            Swal.fire({ icon: 'success', title: 'Logged Out!', text: 'Redirecting...', timer: 1500, showConfirmButton: false, background: '#0a0e27', color: '#fff' })
                .then(() => window.location.href = "login.html");
        }
    });
});

// Listen for storage changes
window.addEventListener('storage', (e) => {
    if (e.key === 'expenses' || e.key === 'finflow_all_expenses' || e.key === 'finflow_all_budgets') {
        updateCharts(currentPeriod);
        updatePieChart();
        updateOverallScore();
    }
});

console.log('Analytics page loaded with real-time Overall Score!');