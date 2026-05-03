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

const knotGeometry = new THREE.TorusKnotGeometry(1.1, 0.32, 180, 24, 3, 4);
const knotMaterial = new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x312e81, roughness: 0.3, metalness: 0.7, transparent: true, opacity: 0.35 });
const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
torusKnot.position.set(3, 2, -11);
scene.add(torusKnot);

const sphereGeometry = new THREE.SphereGeometry(0.65, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x4c1d95, transparent: true, opacity: 0.3, roughness: 0.2, metalness: 0.8 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-2.8, -1.2, -9);
scene.add(sphere);

const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const backLight = new THREE.PointLight(0x3b82f6, 0.6);
backLight.position.set(-2, 1, -7);
scene.add(backLight);

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

function getBudgets() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return { categories: [] };
    const allBudgets = JSON.parse(localStorage.getItem('finflow_all_budgets')) || {};
    return allBudgets[userEmail] || { categories: [] };
}

// ========== AI INSIGHTS GENERATION ==========
function generateSpendingAnalysis() {
    const expenses = getAllExpenses();
    if (expenses.length === 0) {
        return '<div class="insight-item">📭 No expense data yet. Start adding expenses to get insights!</div>';
    }
    
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = {};
    expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0];
    const topPercentage = ((topCategory[1] / totalExpenses) * 100).toFixed(0);
    
    let analysis = '';
    if (topCategory[0] === 'Food & Dining') {
        analysis = `🍽️ Your largest expense is <strong>${topCategory[0]}</strong> at <strong>$${topCategory[1].toFixed(2)}</strong> (${topPercentage}% of total). Consider meal prepping to reduce dining costs.`;
    } else if (topCategory[0] === 'Shopping') {
        analysis = `🛍️ Shopping accounts for <strong>${topPercentage}%</strong> of your expenses (<strong>$${topCategory[1].toFixed(2)}</strong>). Try waiting 24 hours before making non-essential purchases.`;
    } else if (topCategory[0] === 'Entertainment') {
        analysis = `🎬 Entertainment spending is <strong>${topPercentage}%</strong> of your budget (<strong>$${topCategory[1].toFixed(2)}</strong>). Look for free local events and streaming service bundles.`;
    } else {
        analysis = `📊 Your highest spending is <strong>${topCategory[0]}</strong> at <strong>$${topCategory[1].toFixed(2)}</strong> (${topPercentage}% of total). Review if there are ways to optimize this category.`;
    }
    
    return `<div class="insight-item">💡 ${analysis}</div>
            <div class="insight-item">📊 Average daily spend: <strong>$${(totalExpenses / 30).toFixed(2)}</strong></div>
            <div class="insight-item">📈 Monthly spending trend: ${expenses.length > 10 ? 'Active spender' : 'Moderate spender'}</div>`;
}

function generateBudgetRecommendations() {
    const expenses = getAllExpenses();
    const budgets = getBudgets();
    
    if (budgets.categories.length === 0) {
        return '<div class="insight-item">📋 Set up budgets in the Budgets page to get personalized recommendations!</div>';
    }
    
    const spending = {};
    expenses.forEach(e => {
        spending[e.category] = (spending[e.category] || 0) + e.amount;
    });
    
    let recommendations = '';
    budgets.categories.forEach(budget => {
        const spent = spending[budget.name] || 0;
        const percent = (spent / budget.budget) * 100;
        
        if (percent >= 100) {
            recommendations += `<div class="insight-item">⚠️ <strong>${budget.name}</strong> is over budget by <strong>$${(spent - budget.budget).toFixed(2)}</strong>. Consider reducing spending in this category.</div>`;
        } else if (percent >= 85) {
            recommendations += `<div class="insight-item">⚡ <strong>${budget.name}</strong> is at ${percent.toFixed(0)}% of budget. You have <strong>$${(budget.budget - spent).toFixed(2)}</strong> left for the month.</div>`;
        } else if (percent < 50 && spent > 0) {
            recommendations += `<div class="insight-item">✅ <strong>${budget.name}</strong> is well under budget at ${percent.toFixed(0)}%. Great job! You could reallocate savings.</div>`;
        }
    });
    
    return recommendations || '<div class="insight-item">🎉 All categories are within budget! Great financial discipline!</div>';
}

function generateSavingsOpportunities() {
    const expenses = getAllExpenses();
    if (expenses.length === 0) {
        return '<div class="insight-item">💰 Add expenses to discover savings opportunities!</div>';
    }
    
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = {};
    expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    
    const potentialSavings = [];
    if (categoryTotals['Food & Dining'] > 300) {
        potentialSavings.push(`🍽️ Reduce dining out by 20% to save ~<strong>$${(categoryTotals['Food & Dining'] * 0.2).toFixed(2)}</strong> monthly`);
    }
    if (categoryTotals['Shopping'] > 200) {
        potentialSavings.push(`🛍️ Wait 48 hours before purchases to save up to <strong>$${(categoryTotals['Shopping'] * 0.15).toFixed(2)}</strong>`);
    }
    if (categoryTotals['Entertainment'] > 150) {
        potentialSavings.push(`🎬 Switch to free entertainment options to save <strong>$${(categoryTotals['Entertainment'] * 0.25).toFixed(2)}</strong>`);
    }
    if (categoryTotals['Utilities'] > 200) {
        potentialSavings.push(`💡 Reduce energy usage to save <strong>$${(categoryTotals['Utilities'] * 0.1).toFixed(2)}</strong> monthly`);
    }
    
    if (potentialSavings.length === 0) {
        return '<div class="insight-item">💪 Your spending looks balanced! Consider investing the extra cash in savings.</div>';
    }
    
    return potentialSavings.map(s => `<div class="insight-item">💰 ${s}</div>`).join('');
}

function generateTrendAlerts() {
    const expenses = getAllExpenses();
    if (expenses.length < 5) {
        return '<div class="insight-item">📊 Add more expenses (at least 5) to see spending trends and patterns!</div>';
    }
    
    const sortedByDate = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    const now = new Date();
    const lastMonth = sortedByDate.filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear();
    });
    const thisMonth = sortedByDate.filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    
    const lastMonthTotal = lastMonth.reduce((s, e) => s + e.amount, 0);
    const thisMonthTotal = thisMonth.reduce((s, e) => s + e.amount, 0);
    
    let trendMessage = '';
    if (thisMonthTotal > lastMonthTotal && lastMonthTotal > 0) {
        const increase = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(0);
        trendMessage = `📈 Your spending increased by <strong>${increase}%</strong> compared to last month. Review your expenses to identify the cause.`;
    } else if (thisMonthTotal < lastMonthTotal && lastMonthTotal > 0) {
        const decrease = ((lastMonthTotal - thisMonthTotal) / lastMonthTotal * 100).toFixed(0);
        trendMessage = `📉 Great job! Your spending decreased by <strong>${decrease}%</strong> compared to last month. Keep it up!`;
    } else {
        trendMessage = `📊 Your spending is consistent with last month. Total this month: <strong>$${thisMonthTotal.toFixed(2)}</strong>`;
    }
    
    return `<div class="insight-item">${trendMessage}</div>
            <div class="insight-item">📅 You have <strong>${expenses.length}</strong> total transactions recorded.</div>
            <div class="insight-item">📋 Average transaction: <strong>$${(totalExpenses / expenses.length).toFixed(2)}</strong></div>`;
}

function generateSmartTips() {
    const expenses = getAllExpenses();
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const tips = [];
    
    if (totalExpenses > 3000) {
        tips.push({ icon: 'green', title: '⚠️ High Spender Alert', text: 'Your total expenses are above average. Consider creating a stricter budget and tracking every purchase.' });
    } else if (totalExpenses < 1000) {
        tips.push({ icon: 'blue', title: '🌟 Great Saver!', text: 'You\'re spending below average. Consider investing the extra money or increasing your savings rate.' });
    } else {
        tips.push({ icon: 'green', title: '✅ On Track', text: 'Your spending is within a healthy range. Keep monitoring to maintain good financial habits.' });
    }
    
    tips.push({ icon: 'purple', title: '🏦 Emergency Fund', text: 'Aim to save 3-6 months of expenses in an emergency fund. Your target would be $${(totalExpenses * 3).toFixed(2)}.' });
    tips.push({ icon: 'green', title: '📊 50/30/20 Rule', text: 'Try to allocate 50% to needs, 30% to wants, and 20% to savings. Based on your spending, adjust accordingly.' });
    tips.push({ icon: 'blue', title: '📅 Track Weekly', text: 'Review your expenses every week to catch overspending early before it becomes a habit.' });
    
    return tips.slice(0, 4);
}

function updateAllInsights() {
    document.getElementById('spendingAnalysis').innerHTML = generateSpendingAnalysis();
    document.getElementById('budgetRecommendations').innerHTML = generateBudgetRecommendations();
    document.getElementById('savingsOpportunities').innerHTML = generateSavingsOpportunities();
    document.getElementById('trendAlerts').innerHTML = generateTrendAlerts();
    
    const tips = generateSmartTips();
    document.getElementById('smartTips').innerHTML = tips.map(tip => `
        <div class="tip-card">
            <div class="tip-icon ${tip.icon}">
                <i class="ph ${tip.icon === 'green' ? 'ph-check-circle' : tip.icon === 'blue' ? 'ph-chart-line-up' : 'ph-lightbulb'}"></i>
            </div>
            <h4>${tip.title}</h4>
            <p>${tip.text}</p>
        </div>
    `).join('');
    
    const expenses = getAllExpenses();
    const confidenceScore = Math.floor(Math.min(95, 70 + (expenses.length * 0.5)));
    document.getElementById('aiConfidenceScore').textContent = `${confidenceScore}%`;
    
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const summaryMessage = `Based on your <strong>${expenses.length}</strong> transactions totaling <strong>$${totalExpenses.toFixed(2)}</strong>, I've analyzed your spending patterns.`;
    document.getElementById('aiSummaryMessage').innerHTML = summaryMessage;
}

// ========== AUTO-REFRESH FUNCTIONALITY ==========
let autoRefreshInterval = null;
let isAutoRefreshEnabled = true;

function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(() => {
        if (isAutoRefreshEnabled && !document.hidden) {
            updateAllInsights();
            console.log('🔄 Auto-refreshed AI insights');
        }
    }, 30000);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

window.addEventListener('storage', (e) => {
    if (e.key === 'finflow_all_expenses' || e.key === 'finflow_all_budgets') {
        updateAllInsights();
        console.log('🔄 Insights refreshed due to data change');
    }
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateAllInsights();
        console.log('🔄 Insights refreshed on page visibility');
    }
});

// ========== AI CHAT FUNCTIONALITY ==========
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    chatMessages.innerHTML += `
        <div class="chat-message user-message">
            <div class="message-avatar"><i class="ph ph-user"></i></div>
            <div class="message-content"><p>${escapeHtml(message)}</p></div>
        </div>
    `;
    
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatMessages.innerHTML += `
        <div class="chat-message ai-message" id="typingIndicator">
            <div class="message-avatar"><i class="ph-fill ph-brain"></i></div>
            <div class="message-content"><p>🤔 Thinking<span class="typing-dots">...</span></p></div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    const expenses = getAllExpenses();
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const transactionCount = expenses.length;
    
    const categoryTotals = {};
    expenses.forEach(e => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0]?.[0] || 'No expenses yet';
    const topAmount = sortedCategories[0]?.[1] || 0;
    
    const budgets = getBudgets();
    const overBudgetCount = budgets.categories.filter(b => {
        const spent = categoryTotals[b.name] || 0;
        return spent > b.budget;
    }).length;
    
    const q = message.toLowerCase();
    let aiResponse = "";
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        aiResponse = `👋 Hello! I'm your FinFlow AI assistant. I see you have <strong>${transactionCount}</strong> transactions totaling <strong>$${totalExpenses.toFixed(2)}</strong>. How can I help you today?`;
    }
    else if (q.includes('how much') || q.includes('total') || q.includes('spent')) {
        aiResponse = `💰 Your total expenses are <strong>$${totalExpenses.toFixed(2)}</strong> across <strong>${transactionCount}</strong> transactions. Your average transaction is <strong>$${(totalExpenses / (transactionCount || 1)).toFixed(2)}</strong>.`;
    }
    else if (q.includes('biggest') || q.includes('largest') || q.includes('top') || q.includes('most')) {
        if (topCategory !== 'No expenses yet') {
            aiResponse = `📊 Your biggest spending category is <strong>${topCategory}</strong> at <strong>$${topAmount.toFixed(2)}</strong> (${((topAmount / totalExpenses) * 100).toFixed(0)}% of total). ${sortedCategories[1] ? `Your second largest is <strong>${sortedCategories[1][0]}</strong> at <strong>$${sortedCategories[1][1].toFixed(2)}</strong>.` : ''}`;
        } else {
            aiResponse = `📭 You haven't added any expenses yet. Start tracking to see your spending patterns!`;
        }
    }
    else if (q.includes('save') || q.includes('saving') || q.includes('reduce')) {
        let savingsTips = [];
        if (topCategory === 'Food & Dining') {
            savingsTips.push(`🍽️ Try meal prepping and cooking at home more often to save up to <strong>$${(topAmount * 0.25).toFixed(2)}</strong> monthly.`);
        }
        if (topCategory === 'Shopping') {
            savingsTips.push(`🛍️ Use the 24-hour rule before online purchases to avoid impulse buys. Potential savings: <strong>$${(topAmount * 0.2).toFixed(2)}</strong>.`);
        }
        if (topCategory === 'Entertainment') {
            savingsTips.push(`🎬 Look for free local events or share streaming subscriptions to save <strong>$${(topAmount * 0.3).toFixed(2)}</strong>.`);
        }
        if (overBudgetCount > 0) {
            savingsTips.push(`⚠️ You're over budget on <strong>${overBudgetCount}</strong> category(ies). Reducing these will help you save more.`);
        }
        if (savingsTips.length === 0) {
            savingsTips.push(`💡 General tip: Reduce discretionary spending by 15% to save <strong>$${(totalExpenses * 0.15).toFixed(2)}</strong> monthly.`);
        }
        aiResponse = savingsTips.join(' ');
    }
    else if (q.includes('budget')) {
        if (overBudgetCount > 0) {
            aiResponse = `⚠️ You're currently over budget on <strong>${overBudgetCount}</strong> category(ies). Consider reviewing your budget limits or reducing spending in those areas.`;
        } else {
            aiResponse = `📋 Your budgets look healthy! The 50/30/20 rule is a good framework: 50% needs, 30% wants, 20% savings. Want me to help you set up a budget?`;
        }
    }
    else if (q.includes('category') || q.includes('categories')) {
        let categoryList = Object.keys(categoryTotals).slice(0, 5);
        if (categoryList.length > 0) {
            aiResponse = `📂 Your top categories are: ${categoryList.join(', ')}. ${topCategory} is your highest at <strong>$${topAmount.toFixed(2)}</strong>.`;
        } else {
            aiResponse = `📭 You haven't added any expenses yet. Add some to see your spending categories!`;
        }
    }
    else if (q.includes('advice') || q.includes('recommend') || q.includes('tip')) {
        aiResponse = `💡 Here's my top advice: Focus on reducing your <strong>${topCategory}</strong> spending which is your largest category at <strong>$${topAmount.toFixed(2)}</strong>. Even a 10% reduction would save you <strong>$${(topAmount * 0.1).toFixed(2)}</strong>!`;
    }
    else {
        aiResponse = `💬 I can help with questions about your spending, saving money, budgets, categories, or financial advice. What would you like to know specifically about your finances?`;
    }
    
    document.getElementById('typingIndicator')?.remove();
    
    chatMessages.innerHTML += `
        <div class="chat-message ai-message">
            <div class="message-avatar"><i class="ph-fill ph-brain"></i></div>
            <div class="message-content"><p>${aiResponse}</p></div>
        </div>
    `;
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
            <button class="swal2-btn" data-range="1M" style="padding: 10px; background: #1e3a5f; color: white; border-radius: 8px;">Last Month</button>
            <button class="swal2-btn" data-range="3M" style="padding: 10px; background: #1e3a5f; color: white; border-radius: 8px;">Last 3 Months</button>
            <button class="swal2-btn" data-range="6M" style="padding: 10px; background: #1e3a5f; color: white; border-radius: 8px;">Last 6 Months</button>
            <button class="swal2-btn" data-range="1Y" style="padding: 10px; background: #1e3a5f; color: white; border-radius: 8px;">Last Year</button>
        </div>`,
        showConfirmButton: false,
        background: '#0a0e27',
        color: '#fff',
        didOpen: () => {
            document.querySelectorAll('.swal2-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.getElementById('selectedRange').textContent = btn.textContent;
                    Swal.close();
                    Swal.fire({ icon: 'success', title: `${btn.textContent} Selected`, timer: 1000, showConfirmButton: false, background: '#0a0e27', color: '#fff' });
                });
            });
        }
    });
});

// ========== NOTIFICATION CLICK HANDLER - REMOVED Swal.fire ==========
// The notification now only opens the dropdown, no popup
// The dropdown functionality is handled by notifications.js

// User menu click
document.getElementById('userMenuBtn')?.addEventListener('click', () => window.location.href = 'profile.html');

// Refresh Insights button
const refreshBtn = document.getElementById('refreshInsights');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        refreshBtn.innerHTML = '<i class="ph ph-spinner"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        setTimeout(() => {
            updateAllInsights();
            refreshBtn.innerHTML = '<i class="ph ph-arrow-clockwise"></i> Refresh Insights';
            refreshBtn.disabled = false;
            
            Swal.fire({ 
                icon: 'success', 
                title: 'Insights Refreshed!', 
                text: 'Your AI insights have been updated with the latest data.', 
                timer: 1500, 
                showConfirmButton: false,
                background: '#0a0e27',
                color: '#fff'
            });
        }, 500);
    });
}

document.getElementById('sendChatBtn')?.addEventListener('click', sendChatMessage);
document.getElementById('chatInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

// Search shortcut
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchInput.focus(); } });
}

// Typing animation CSS
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        animation: blink 1.4s infinite;
    }
    @keyframes blink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    .ph-spinner {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ========== AUTH GUARD ==========
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
        Swal.fire({ icon: 'warning', title: 'Not Logged In', text: 'Please login to access AI insights', confirmButtonColor: '#1e3a5f', background: '#0a0e27', color: '#fff' })
            .then(() => window.location.href = "login.html");
        return;
    }
    updateAllInsights();
    startAutoRefresh();
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
            stopAutoRefresh();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            Swal.fire({ icon: 'success', title: 'Logged Out!', timer: 1500, showConfirmButton: false, background: '#0a0e27', color: '#fff' })
                .then(() => window.location.href = "login.html");
        }
    });
});

console.log('AI Insights page loaded with auto-refresh enabled and notification Swal removed!');