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

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (sidebar && !sidebar.contains(e.target) && mobileToggle && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    }
});

// ========== HELPER FUNCTIONS ==========

function getCurrentUserEmail() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.email : null;
}

function getTotalExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

function getTransactionCount() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return expenses.length;
}

function getAccountType() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const transactionCount = expenses.length;
    
    if (totalExpenses > 10000 || transactionCount > 50) {
        return { type: 'Premium', class: 'highlight-blue' };
    } else if (totalExpenses > 5000 || transactionCount > 25) {
        return { type: 'Pro', class: 'highlight-purple' };
    } else if (totalExpenses > 1000 || transactionCount > 10) {
        return { type: 'Standard', class: 'highlight-green' };
    } else {
        return { type: 'Free', class: 'highlight-gray' };
    }
}

function getMemberSince() {
    let memberDate = localStorage.getItem('memberSince');
    if (!memberDate) {
        memberDate = new Date().toISOString();
        localStorage.setItem('memberSince', memberDate);
    }
    const date = new Date(memberDate);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function updateAccountStats() {
    const memberSinceEl = document.getElementById('memberSince');
    if (memberSinceEl) memberSinceEl.textContent = getMemberSince();
    
    const accountType = getAccountType();
    const accountTypeEl = document.getElementById('accountType');
    if (accountTypeEl) {
        accountTypeEl.textContent = accountType.type;
        accountTypeEl.className = `value ${accountType.class}`;
    }
    
    const aiToggle = document.getElementById('aiToggle');
    const aiStatusEl = document.getElementById('aiStatus');
    if (aiStatusEl && aiToggle) {
        aiStatusEl.textContent = aiToggle.checked ? 'Enabled' : 'Disabled';
        aiStatusEl.className = aiToggle.checked ? 'value highlight-green' : 'value highlight-gray';
    }
    
    const totalExpenses = getTotalExpenses();
    const totalExpensesEl = document.getElementById('totalExpensesCount');
    if (totalExpensesEl) {
        totalExpensesEl.textContent = `$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    const transactionCount = getTransactionCount();
    const totalTransactionsEl = document.getElementById('totalTransactionsCount');
    if (totalTransactionsEl) totalTransactionsEl.textContent = transactionCount;
}

// ========== PASSWORD TOGGLE FUNCTIONS ==========

// Generic password toggle function
function setupPasswordToggle(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    
    if (!input || !button) return;
    
    let isVisible = false;
    const eyeIcon = button.querySelector('i');
    
    button.addEventListener('click', () => {
        isVisible = !isVisible;
        
        if (isVisible) {
    input.type = 'text';
    if (eyeIcon) {
        eyeIcon.className = 'ph ph-eye';
    }
    button.style.color = '#3b82f6';  // Blue color
} else {
    input.type = 'password';
    if (eyeIcon) {
        eyeIcon.className = 'ph ph-eye-slash';
    }
    button.style.color = '#3b82f6';  // Blue color
}
    });
}

// Load user password for display
function loadUserPassword() {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return '';
    
    const users = JSON.parse(localStorage.getItem('finflow_users')) || [];
    const currentUser = users.find(u => u.email === userEmail);
    return currentUser ? currentUser.password : '';
}

function updateUserPassword(newPassword) {
    const userEmail = getCurrentUserEmail();
    if (!userEmail) return false;
    
    const users = JSON.parse(localStorage.getItem('finflow_users')) || [];
    const userIndex = users.findIndex(u => u.email === userEmail);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('finflow_users', JSON.stringify(users));
        return true;
    }
    return false;
}

// ========== SETUP ALL PASSWORD TOGGLES ==========

// Setup password display toggle
setupPasswordToggle('passwordDisplay', 'togglePasswordBtn');

// Setup current password toggle in update section
setupPasswordToggle('currentPassword', 'toggleCurrentPasswordBtn');

// Setup new password toggle in update section
setupPasswordToggle('newPassword', 'toggleNewPasswordBtn');

// Also set the actual password value for display
const passwordDisplayInput = document.getElementById('passwordDisplay');
const togglePasswordBtn = document.getElementById('togglePasswordBtn');

if (passwordDisplayInput) {
    const actualPassword = loadUserPassword();
    passwordDisplayInput.value = '••••••••';
    passwordDisplayInput.dataset.actualPassword = actualPassword;
    
    // Override the toggle for password display to show actual password
    if (togglePasswordBtn) {
        let isPasswordVisible = false;
        const eyeIcon = togglePasswordBtn.querySelector('i');
        
        togglePasswordBtn.addEventListener('click', () => {
            isPasswordVisible = !isPasswordVisible;
            
            if (isPasswordVisible) {
                passwordDisplayInput.value = passwordDisplayInput.dataset.actualPassword || '';
                passwordDisplayInput.type = 'text';
                if (eyeIcon) eyeIcon.className = 'ph ph-eye';
                togglePasswordBtn.style.color = '#4ade80';
            } else {
                passwordDisplayInput.value = '••••••••';
                passwordDisplayInput.type = 'password';
                if (eyeIcon) eyeIcon.className = 'ph ph-eye-slash';
                togglePasswordBtn.style.color = '#60a5fa';
            }
        });
    }
}

// ========== HEADER FUNCTIONALITY ==========

const headerUserName = document.getElementById('headerUserName');
const headerAvatar = document.getElementById('headerAvatar');
const storedNameHeader = localStorage.getItem('userName') || 'User';

if (headerUserName) headerUserName.textContent = storedNameHeader;
if (headerAvatar) headerAvatar.textContent = storedNameHeader.charAt(0).toUpperCase();

// Date Range Selector
const dateRangeBtn = document.getElementById('dateRangeBtn');
const selectedRangeSpan = document.getElementById('selectedRange');

if (dateRangeBtn) {
    dateRangeBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Select Date Range',
            html: `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button class="swal2-btn" data-range="Today" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">Today</button>
                    <button class="swal2-btn" data-range="This Week" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">This Week</button>
                    <button class="swal2-btn" data-range="This Month" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">This Month</button>
                    <button class="swal2-btn" data-range="This Year" style="padding: 10px; background: #1e3a5f; color: white; border: none; border-radius: 8px; cursor: pointer;">This Year</button>
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
                        Swal.fire({
                            icon: 'success',
                            title: `${range} Selected`,
                            timer: 1000,
                            showConfirmButton: false,
                            background: '#0a0e27',
                            color: '#fff',
                            iconColor: '#3b82f6'
                        });
                    });
                });
            }
        });
    });
}

// User menu click
const userMenuBtn = document.getElementById('userMenuBtn');
if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Search keyboard shortcut
const searchInputField = document.getElementById('searchInput');
if (searchInputField) {
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInputField.focus();
        }
    });
}

// ========== THEME MANAGEMENT ==========

const themeStyles = `
    body.light-theme { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    body.light-theme .sidebar { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); }
    body.light-theme .logo span, body.light-theme .nav-item, body.light-theme .user-name,
    body.light-theme .page-header h1, body.light-theme .card-header h3, body.light-theme .setting-text strong,
    body.light-theme .features-title, body.light-theme .profile-user-name { color: white; }
    body.light-theme .card { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(12px); }
    body.light-theme input { background: rgba(255, 255, 255, 0.1); color: white; }
    body.light-theme .btn-black { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    
    body.dark-theme { background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%); }
    body.dark-theme .sidebar { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px); }
    body.dark-theme .logo span, body.dark-theme .nav-item, body.dark-theme .user-name,
    body.dark-theme .page-header h1, body.dark-theme .card-header h3, body.dark-theme .setting-text strong,
    body.dark-theme .features-title, body.dark-theme .profile-user-name { color: #f3f4f6; }
    body.dark-theme .nav-item.active { background-color: rgba(37, 99, 235, 0.3); color: #60a5fa; }
    body.dark-theme .card { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px); }
    body.dark-theme input { background: rgba(0, 0, 0, 0.3); color: #f3f4f6; }
    body.dark-theme .btn-black { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
    
    .highlight-blue { color: #60a5fa; }
    .highlight-green { color: #4ade80; }
    .highlight-purple { color: #a855f7; }
    .highlight-gray { color: #9ca3af; }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = themeStyles;
document.head.appendChild(styleSheet);

function applyTheme(theme, saveToStorage = true) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        if (saveToStorage) localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
        body.classList.add('light-theme');
        if (saveToStorage) localStorage.setItem('theme', 'light');
    } else if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
        if (saveToStorage) localStorage.setItem('theme', 'auto');
    }
    
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const optionTheme = option.getAttribute('data-theme');
        option.classList.toggle('active', optionTheme === theme);
    });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'auto') {
        document.body.classList.toggle('dark-theme', e.matches);
        document.body.classList.toggle('light-theme', !e.matches);
    }
});

// ========== PROFILE PAGE FUNCTIONALITY ==========
document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (isLoggedIn !== "true" || !storedName || !storedEmail) {
        Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'Please login to access your profile',
            confirmButtonColor: '#4f46e5',
            background: '#0a0e27',
            color: '#fff'
        }).then(() => {
            window.location.href = "login.html";
        });
        return;
    }

    // Populate user data
    const userNameElements = document.querySelectorAll(".user-name");
    const profileUserName = document.querySelector(".profile-user-name");
    const userEmailElements = document.querySelectorAll(".user-email");
    const userAvatars = document.querySelectorAll(".user-avatar");
    const nameInput = document.getElementById("fullNameInput");
    const emailInput = document.getElementById("emailInput");

    userNameElements.forEach(el => el.textContent = storedName);
    if (profileUserName) profileUserName.textContent = storedName;
    userEmailElements.forEach(el => el.textContent = storedEmail);
    userAvatars.forEach(el => el.textContent = storedName.charAt(0).toUpperCase());
    if (nameInput) nameInput.value = storedName;
    if (emailInput) emailInput.value = storedEmail;

    updateAccountStats();

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme, false);

    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            applyTheme(theme, true);
            Swal.fire({
                icon: 'success',
                title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode Activated`,
                timer: 1200,
                showConfirmButton: false,
                background: document.body.classList.contains('dark-theme') ? '#1f2937' : '#fff',
                color: document.body.classList.contains('dark-theme') ? '#fff' : '#1f2937'
            });
        });
    });

    // Save Profile Changes
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", () => {
            const newName = nameInput.value.trim();
            const newEmail = emailInput.value.trim();

            if (newName.length < 2) {
                Swal.fire({ icon: "error", title: "Invalid Name", text: "Name must be at least 2 characters!", background: '#0a0e27', color: '#fff' });
                return;
            }
            if (!newEmail.includes("@")) {
                Swal.fire({ icon: "error", title: "Invalid Email", text: "Please enter a valid email!", background: '#0a0e27', color: '#fff' });
                return;
            }

            // Update user in users array
            const userEmail = getCurrentUserEmail();
            const users = JSON.parse(localStorage.getItem('finflow_users')) || [];
            const userIndex = users.findIndex(u => u.email === userEmail);
            
            if (userIndex !== -1) {
                users[userIndex].name = newName;
                users[userIndex].email = newEmail;
                localStorage.setItem('finflow_users', JSON.stringify(users));
            }
            
            // Update current user
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                currentUser.name = newName;
                currentUser.email = newEmail;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            localStorage.setItem("userName", newName);
            localStorage.setItem("userEmail", newEmail);

            userNameElements.forEach(el => el.textContent = newName);
            if (profileUserName) profileUserName.textContent = newName;
            userEmailElements.forEach(el => el.textContent = newEmail);
            userAvatars.forEach(el => el.textContent = newName.charAt(0).toUpperCase());

            Swal.fire({ icon: "success", title: "Profile Updated!", timer: 1500, showConfirmButton: false, background: '#0a0e27', color: '#fff' });
        });
    }

    // Update Password Button
    const updatePasswordBtn = document.getElementById("updatePasswordBtn");
    if (updatePasswordBtn) {
        updatePasswordBtn.addEventListener("click", () => {
            const currentPwd = document.getElementById("currentPassword").value;
            const newPwd = document.getElementById("newPassword").value;

            if (!currentPwd || !newPwd) {
                Swal.fire({ icon: "error", title: "Error", text: "Please fill both password fields!", background: '#0a0e27', color: '#fff' });
                return;
            }
            if (newPwd.length < 6) {
                Swal.fire({ icon: "error", title: "Weak Password", text: "Password must be at least 6 characters!", background: '#0a0e27', color: '#fff' });
                return;
            }
            
            // Verify current password
            const storedPassword = loadUserPassword();
            if (currentPwd !== storedPassword) {
                Swal.fire({ icon: "error", title: "Wrong Password", text: "Current password is incorrect!", background: '#0a0e27', color: '#fff' });
                return;
            }
            
            // Update password
            if (updateUserPassword(newPwd)) {
                // Update the displayed password in the info section
                const passwordDisplayInput = document.getElementById('passwordDisplay');
                if (passwordDisplayInput) {
                    passwordDisplayInput.dataset.actualPassword = newPwd;
                    // If password is currently visible, update the displayed value
                    if (passwordDisplayInput.type === 'text') {
                        passwordDisplayInput.value = newPwd;
                    }
                }
                
                Swal.fire({ icon: "success", title: "Password Updated!", text: "Your password has been changed.", timer: 2000, showConfirmButton: false, background: '#0a0e27', color: '#fff' });
                document.getElementById("currentPassword").value = "";
                document.getElementById("newPassword").value = "";
            } else {
                Swal.fire({ icon: "error", title: "Error", text: "Failed to update password.", background: '#0a0e27', color: '#fff' });
            }
        });
    }

    const exportBtn = document.getElementById("exportDataBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            const data = {
                userName: localStorage.getItem("userName"),
                userEmail: localStorage.getItem("userEmail"),
                memberSince: localStorage.getItem("memberSince"),
                theme: localStorage.getItem("theme"),
                expenses: JSON.parse(localStorage.getItem("expenses")) || [],
                budgets: JSON.parse(localStorage.getItem("budgets")) || []
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "finflow_data_export.json";
            a.click();
            URL.revokeObjectURL(url);
            Swal.fire({ icon: "success", title: "Exported!", text: "Your data has been downloaded.", timer: 1500, showConfirmButton: false, background: '#0a0e27', color: '#fff' });
        });
    }

    const deleteBtn = document.getElementById("deleteAccountBtn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            Swal.fire({
                title: "Delete Account?",
                text: "Type DELETE to confirm permanent deletion.",
                input: "text",
                inputPlaceholder: "DELETE",
                showCancelButton: true,
                confirmButtonColor: "#dc2626",
                confirmButtonText: "Delete Forever",
                background: '#0a0e27',
                color: '#fff',
                inputValidator: (value) => {
                    if (!value || value !== "DELETE") {
                        return "You must type DELETE in all caps to confirm.";
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    Swal.fire({ icon: "success", title: "Account Deleted", text: "Redirecting to login...", timer: 1500, showConfirmButton: false, background: '#0a0e27', color: '#fff' });
                    setTimeout(() => { window.location.href = "login.html"; }, 1500);
                }
            });
        });
    }

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
                confirmButtonText: 'Yes, logout',
                background: '#0a0e27',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('currentUser');
                    Swal.fire({ icon: 'success', title: 'Logged Out!', text: 'Redirecting...', timer: 1500, showConfirmButton: false, background: '#0a0e27', color: '#fff' });
                    setTimeout(() => { window.location.href = "login.html"; }, 1500);
                }
            });
        });
    }

    const aiToggle = document.getElementById("aiToggle");
    if (aiToggle) {
        const savedAiPref = localStorage.getItem("aiEnabled");
        if (savedAiPref !== null) aiToggle.checked = savedAiPref === "true";
        
        aiToggle.addEventListener("change", () => {
            localStorage.setItem("aiEnabled", aiToggle.checked);
            updateAccountStats();
            Swal.fire({ icon: "success", title: aiToggle.checked ? "AI Insights Enabled" : "AI Insights Disabled", timer: 1000, showConfirmButton: false, background: '#0a0e27', color: '#fff' });
        });
    }

    const emailNotif = document.getElementById("emailNotif");
    const pushNotif = document.getElementById("pushNotif");
    const budgetAlerts = document.getElementById("budgetAlerts");
    const spendingAlerts = document.getElementById("spendingAlerts");

    function saveNotifPref(key, value) {
        localStorage.setItem(key, value);
    }

    if (emailNotif) emailNotif.addEventListener("change", () => saveNotifPref("emailNotif", emailNotif.checked));
    if (pushNotif) pushNotif.addEventListener("change", () => saveNotifPref("pushNotif", pushNotif.checked));
    if (budgetAlerts) budgetAlerts.addEventListener("change", () => saveNotifPref("budgetAlerts", budgetAlerts.checked));
    if (spendingAlerts) spendingAlerts.addEventListener("change", () => saveNotifPref("spendingAlerts", spendingAlerts.checked));

    if (emailNotif && localStorage.getItem("emailNotif") !== null) emailNotif.checked = localStorage.getItem("emailNotif") === "true";
    if (pushNotif && localStorage.getItem("pushNotif") !== null) pushNotif.checked = localStorage.getItem("pushNotif") === "true";
    if (budgetAlerts && localStorage.getItem("budgetAlerts") !== null) budgetAlerts.checked = localStorage.getItem("budgetAlerts") === "true";
    if (spendingAlerts && localStorage.getItem("spendingAlerts") !== null) spendingAlerts.checked = localStorage.getItem("spendingAlerts") === "true";
});

console.log('Profile page loaded with password toggles for all fields!');