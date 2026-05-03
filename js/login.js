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
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i] = (Math.random() - 0.5) * 50;
    posArray[i + 1] = (Math.random() - 0.5) * 30;
    posArray[i + 2] = (Math.random() - 0.5) * 40 - 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create floating torus knot
const knotGeometry = new THREE.TorusKnotGeometry(1.0, 0.3, 180, 24, 3, 4);
const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0x818cf8,
    emissive: 0x312e81,
    roughness: 0.3,
    metalness: 0.7,
    transparent: true,
    opacity: 0.35
});
const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
torusKnot.position.set(3, 2, -10);
scene.add(torusKnot);

// Create floating spheres
const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xa78bfa,
    emissive: 0x4c1d95,
    transparent: true,
    opacity: 0.3,
    roughness: 0.2,
    metalness: 0.8
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-2.5, -1, -8);
scene.add(sphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const backLight = new THREE.PointLight(0x3b82f6, 0.6);
backLight.position.set(-2, 1, -6);
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

// ========== LOGIN FORM FUNCTIONALITY ==========
// Get all elements
const formWrappers = document.getElementById("form-wrappers");
const email = document.getElementById("email");
const password = document.getElementById("password");
const eye = document.getElementById("fa-eye");
const eyeslash = document.getElementById("fa-eye-slash");

// Set initial display states - HIDE ALL ICONS initially
if (eye) eye.style.display = "none";
if (eyeslash) eyeslash.style.display = "none";

// Show/hide eye icon based on password input
if (password) {
    password.addEventListener("input", () => {
        if (password.value.length > 0) {
            if (eyeslash) eyeslash.style.display = "block";
            if (eye) eye.style.display = "none";
        } else {
            if (eye) eye.style.display = "none";
            if (eyeslash) eyeslash.style.display = "none";
        }
    });
}

// Toggle password visibility
const togglePasswordIcon = () => {
    if (password.type === "password") {
        password.type = "text";
        if (eye) eye.style.display = "block";
        if (eyeslash) eyeslash.style.display = "none";
    } else {
        password.type = "password";
        if (eye) eye.style.display = "none";
        if (eyeslash) eyeslash.style.display = "block";
    }
};

// Add event listeners for eye icons
if (eye) eye.addEventListener("click", togglePasswordIcon);
if (eyeslash) eyeslash.addEventListener("click", togglePasswordIcon);

// Handle form submission
if (formWrappers) {
    formWrappers.addEventListener("submit", (e) => {
        e.preventDefault();

        const emailValue = email ? email.value.trim() : "";
        const passwordValue = password ? password.value.trim() : "";

        if (!emailValue || !passwordValue) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill in all fields!",
                confirmButtonColor: "#1e3a5f",
                background: '#0a0e27',
                color: '#fff'
            });
            return;
        }

        // Password validation - Check minimum length
        if (passwordValue.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Weak Password",
                text: "Password must be at least 6 characters long!",
                confirmButtonColor: "#1e3a5f",
                background: '#0a0e27',
                color: '#fff'
            });
            return;
        }

        // Get all users from localStorage
        const users = JSON.parse(localStorage.getItem('finflow_users')) || [];
        
        // Find user by email
        const user = users.find(u => u.email === emailValue);
        
        if (!user) {
            Swal.fire({
                icon: "error",
                title: "No Account Found",
                text: "Please sign up first!",
                confirmButtonColor: "#1e3a5f",
                background: '#0a0e27',
                color: '#fff'
            });
            return;
        }
        
        if (user.password !== passwordValue) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Invalid password. Please try again!",
                confirmButtonColor: "#1e3a5f",
                background: '#0a0e27',
                color: '#fff'
            });
            return;
        }

        // Clear ALL old data first
        localStorage.removeItem('expenses');
        localStorage.removeItem('budgets');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        
        // Store user session
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify({
            email: user.email,
            name: user.name,
            memberSince: user.memberSince
        }));
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);
        
        // Load user's specific data
        const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
        const userExpenses = allExpenses[user.email] || [];
        localStorage.setItem('expenses', JSON.stringify(userExpenses));
        
        const allBudgets = JSON.parse(localStorage.getItem('finflow_all_budgets')) || {};
        const userBudgets = allBudgets[user.email] || {
            categories: [
                { id: 1, name: 'Food & Dining', icon: 'fork-knife', color: 'blue', budget: 500.00 },
                { id: 2, name: 'Transportation', icon: 'car', color: 'green', budget: 300.00 },
                { id: 3, name: 'Utilities', icon: 'lightning', color: 'orange', budget: 350.00 }
            ]
        };
        localStorage.setItem('budgets', JSON.stringify(userBudgets));
        
        const allThemes = JSON.parse(localStorage.getItem('finflow_all_themes')) || {};
        const userTheme = allThemes[user.email] || 'light';
        localStorage.setItem('theme', userTheme);
        
        const allNotifs = JSON.parse(localStorage.getItem('finflow_all_notifications')) || {};
        const userNotifs = allNotifs[user.email] || {};
        if (userNotifs.emailNotif !== undefined) localStorage.setItem('emailNotif', userNotifs.emailNotif);
        if (userNotifs.pushNotif !== undefined) localStorage.setItem('pushNotif', userNotifs.pushNotif);
        if (userNotifs.budgetAlerts !== undefined) localStorage.setItem('budgetAlerts', userNotifs.budgetAlerts);
        if (userNotifs.spendingAlerts !== undefined) localStorage.setItem('spendingAlerts', userNotifs.spendingAlerts);
        if (userNotifs.aiEnabled !== undefined) localStorage.setItem('aiEnabled', userNotifs.aiEnabled);

        // Success!
        Swal.fire({
            icon: "success",
            title: "Login Successful!",
            text: `Welcome back, ${user.name}!`,
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            background: '#0a0e27',
            color: '#fff',
            iconColor: '#10b981'
        }).then(() => {
            window.location.href = "dashboard.html";
        });
    });
}

console.log("Login page loaded with user-specific data management!");