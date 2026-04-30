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

// ========== ANALYTICS FUNCTIONALITY ==========
document.addEventListener("DOMContentLoaded", () => {
    // 1. AUTH GUARD - Kick out if not logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
        Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'Please login to access analytics',
            confirmButtonColor: '#4f46e5'
        }).then(() => {
            window.location.href = "login.html";
        });
        return;
    }

    // 2. GET USER DATA
    const storedName = localStorage.getItem("userName") || "User";
    const initial = storedName.charAt(0).toUpperCase();

    // 3. UPDATE UI ELEMENTS
    const nameElement = document.querySelector(".user-name");
    if (nameElement) nameElement.textContent = storedName;

    const avatarElement = document.querySelector(".user-avatar");
    if (avatarElement) avatarElement.textContent = initial;

    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
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
                        window.location.href = "login.html";
                    });
                }
            });
        });
    }

    const searchInput = document.querySelector(".search-bar input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            console.log("Searching for:", e.target.value);
        });
    }
});

// 1. Income vs Expenses Bar Chart
const ctx1 = document.getElementById('incomeExpensesChart');
if (ctx1) {
    new Chart(ctx1.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Income',
                data: [4200, 4500, 4200, 4800, 4500, 5200],
                backgroundColor: '#4ade80',
                borderRadius: 6
            }, {
                label: 'Expenses',
                data: [3100, 3400, 2900, 3600, 3300, 3800],
                backgroundColor: '#f87171',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { 
                    position: 'bottom',
                    labels: { color: 'white' }
                } 
            },
            scales: {
                y: {
                    ticks: { color: 'rgba(255,255,255,0.7)' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: 'rgba(255,255,255,0.7)' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

// 2. Cash Flow Line Chart
const ctx2 = document.getElementById('cashFlowChart');
if (ctx2) {
    new Chart(ctx2.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Balance',
                data: [2100, 3200, 4500, 5800, 7000, 8400],
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#60a5fa'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { 
                    position: 'bottom',
                    labels: { color: 'white' }
                } 
            },
            scales: {
                y: {
                    ticks: { color: 'rgba(255,255,255,0.7)' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                x: {
                    ticks: { color: 'rgba(255,255,255,0.7)' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

// Expense Pie Chart
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
        if (expenseTooltip) {
            expenseTooltip.textContent = `${item.category}: $${item.amount}`;
            expenseTooltip.classList.add('show');
        }
    });

    path.addEventListener('mouseleave', () => {
        document.querySelectorAll('.expense-pie-slice').forEach(slice => {
            slice.classList.remove('faded');
        });
        if (expenseTooltip) {
            expenseTooltip.classList.remove('show');
        }
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
if (expenseSvg) {
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
}

console.log('Analytics page loaded with Three.js, Glass Morphism, and Mobile Responsiveness!');