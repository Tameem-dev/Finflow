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

// ========== THEME MANAGEMENT (FULLY WORKING) ==========

// Theme CSS that will be applied dynamically
const themeStyles = `
    /* Light Theme (Default - Glass Morphism) */
    body.light-theme {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    body.light-theme .sidebar {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(12px);
        border-right: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    body.light-theme .logo span,
    body.light-theme .nav-item,
    body.light-theme .nav-item.active,
    body.light-theme .user-name,
    body.light-theme .page-header h1,
    body.light-theme .card-header h3,
    body.light-theme .setting-text strong,
    body.light-theme .features-title,
    body.light-theme .profile-user-name {
        color: white;
    }
    
    body.light-theme .nav-item.active {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    body.light-theme .card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    body.light-theme input {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
    }
    
    body.light-theme .btn-black {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
    
    /* Dark Theme */
    body.dark-theme {
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
    }
    
    body.dark-theme .sidebar {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(12px);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    body.dark-theme .logo span,
    body.dark-theme .nav-item,
    body.dark-theme .user-name,
    body.dark-theme .page-header h1,
    body.dark-theme .card-header h3,
    body.dark-theme .setting-text strong,
    body.dark-theme .features-title,
    body.dark-theme .profile-user-name {
        color: #f3f4f6;
    }
    
    body.dark-theme .nav-item.active {
        background-color: rgba(37, 99, 235, 0.3);
        color: #60a5fa;
    }
    
    body.dark-theme .card {
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    body.dark-theme input {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f3f4f6;
    }
    
    body.dark-theme input::placeholder {
        color: rgba(255, 255, 255, 0.3);
    }
    
    body.dark-theme .btn-black {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
    }
    
    body.dark-theme .ai-toggle-box {
        background-color: rgba(0, 0, 0, 0.3);
    }
    
    body.dark-theme .setting-item {
        border-bottom-color: rgba(255, 255, 255, 0.05);
    }
    
    body.dark-theme .danger-card {
        border-color: rgba(239, 68, 68, 0.3) !important;
    }
    
    body.dark-theme .danger-item {
        background-color: rgba(239, 68, 68, 0.1);
    }
    
    body.dark-theme .verified-badge {
        background-color: rgba(6, 78, 59, 0.3);
    }
    
    body.dark-theme .user-email,
    body.dark-theme .detail-row .label,
    body.dark-theme .setting-text p,
    body.dark-theme .ai-toggle-content p,
    body.dark-theme .page-header p,
    body.dark-theme .badge-text span {
        color: rgba(255, 255, 255, 0.6);
    }
`;

// Inject theme styles
const styleSheet = document.createElement("style");
styleSheet.textContent = themeStyles;
document.head.appendChild(styleSheet);

// Theme Management Functions
function applyTheme(theme, saveToStorage = true) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        if (saveToStorage) localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
        body.classList.add('light-theme');
        if (saveToStorage) localStorage.setItem('theme', 'light');
    } else if (theme === 'auto') {
        // Auto mode: follow system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-theme');
        } else {
            body.classList.add('light-theme');
        }
        if (saveToStorage) localStorage.setItem('theme', 'auto');
    }
    
    // Update active state on theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const optionTheme = option.getAttribute('data-theme');
        if (optionTheme === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Listen for system preference changes when in auto mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'auto') {
        if (e.matches) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }
});

// ========== PROFILE PAGE FUNCTIONALITY ==========
document.addEventListener("DOMContentLoaded", () => {
    // Auth Guard
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (isLoggedIn !== "true" || !storedName || !storedEmail) {
        Swal.fire({
            icon: 'warning',
            title: 'Not Logged In',
            text: 'Please login to access your profile',
            confirmButtonColor: '#4f46e5'
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

    // Load and apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme, false);

    // Theme option click handlers
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            applyTheme(theme, true);
            
            // Show feedback
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
                Swal.fire({ icon: "error", title: "Invalid Name", text: "Name must be at least 2 characters!" });
                return;
            }
            if (!newEmail.includes("@")) {
                Swal.fire({ icon: "error", title: "Invalid Email", text: "Please enter a valid email!" });
                return;
            }

            localStorage.setItem("userName", newName);
            localStorage.setItem("userEmail", newEmail);

            userNameElements.forEach(el => el.textContent = newName);
            if (profileUserName) profileUserName.textContent = newName;
            userEmailElements.forEach(el => el.textContent = newEmail);
            userAvatars.forEach(el => el.textContent = newName.charAt(0).toUpperCase());

            Swal.fire({ icon: "success", title: "Profile Updated!", timer: 1500, showConfirmButton: false });
        });
    }

    // Update Password
    const updatePasswordBtn = document.getElementById("updatePasswordBtn");
    if (updatePasswordBtn) {
        updatePasswordBtn.addEventListener("click", () => {
            const currentPwd = document.getElementById("currentPassword").value;
            const newPwd = document.getElementById("newPassword").value;

            if (!currentPwd || !newPwd) {
                Swal.fire({ icon: "error", title: "Error", text: "Please fill both password fields!" });
                return;
            }
            if (newPwd.length < 6) {
                Swal.fire({ icon: "error", title: "Weak Password", text: "Password must be at least 6 characters!" });
                return;
            }

            Swal.fire({ icon: "success", title: "Password Updated!", timer: 1500, showConfirmButton: false });
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
        });
    }

    // Export Data
    const exportBtn = document.getElementById("exportDataBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            const data = {
                userName: localStorage.getItem("userName"),
                userEmail: localStorage.getItem("userEmail"),
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
            Swal.fire({ icon: "success", title: "Exported!", text: "Your data has been downloaded.", timer: 1500, showConfirmButton: false });
        });
    }

    // Delete Account
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
                inputValidator: (value) => {
                    if (!value || value !== "DELETE") {
                        return "You must type DELETE in all caps to confirm.";
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    Swal.fire({ icon: "success", title: "Account Deleted", text: "Redirecting to login...", timer: 1500, showConfirmButton: false });
                    setTimeout(() => { window.location.href = "login.html"; }, 1500);
                }
            });
        });
    }

    // Logout
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
                    Swal.fire({ icon: 'success', title: 'Logged Out!', text: 'Redirecting...', timer: 1500, showConfirmButton: false });
                    setTimeout(() => { window.location.href = "login.html"; }, 1500);
                }
            });
        });
    }

    // Save AI Toggle preference
    const aiToggle = document.getElementById("aiToggle");
    if (aiToggle) {
        const savedAiPref = localStorage.getItem("aiEnabled");
        if (savedAiPref !== null) aiToggle.checked = savedAiPref === "true";
        
        aiToggle.addEventListener("change", () => {
            localStorage.setItem("aiEnabled", aiToggle.checked);
            Swal.fire({ icon: "success", title: aiToggle.checked ? "AI Insights Enabled" : "AI Insights Disabled", timer: 1000, showConfirmButton: false });
        });
    }

    // Save notification preferences
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

    // Load saved notification preferences
    if (emailNotif && localStorage.getItem("emailNotif") !== null) emailNotif.checked = localStorage.getItem("emailNotif") === "true";
    if (pushNotif && localStorage.getItem("pushNotif") !== null) pushNotif.checked = localStorage.getItem("pushNotif") === "true";
    if (budgetAlerts && localStorage.getItem("budgetAlerts") !== null) budgetAlerts.checked = localStorage.getItem("budgetAlerts") === "true";
    if (spendingAlerts && localStorage.getItem("spendingAlerts") !== null) spendingAlerts.checked = localStorage.getItem("spendingAlerts") === "true";

    // Notification bell click handler
    const notificationBell = document.querySelector(".notification");
    if (notificationBell) {
        notificationBell.addEventListener("click", () => {
            Swal.fire({
                title: "Notifications",
                html: `
                    <div style="text-align:left; font-size: 14px;">
                        <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #eee;">
                            <strong>🔔 Budget Alert:</strong> Food & Dining is at 84%
                        </div>
                        <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #eee;">
                            <strong>📊 Monthly Report:</strong> Your spending decreased by 8%
                        </div>
                        <div>
                            <strong>🏆 Achievement:</strong> You've saved $500 this month!
                        </div>
                    </div>
                `,
                confirmButtonText: "Got it",
                background: document.body.classList.contains('dark-theme') ? '#1f2937' : '#fff',
                color: document.body.classList.contains('dark-theme') ? '#fff' : '#1f2937'
            });
        });
    }
});

console.log('Profile page loaded with Three.js, Glass Morphism, and fully working Light/Dark/Auto themes!');