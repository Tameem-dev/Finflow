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

// ========== SIGNUP FORM FUNCTIONALITY ==========
// Get all elements
const formWrapper = document.getElementById("form-wrapper");
const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmpassword");

const eye = document.getElementById("fa-eye");
const eyeSlash = document.getElementById("fa-eye-slash");
const eyes = document.getElementById("fa-eyes");
const eyesSlash = document.getElementById("fa-eyes-slash");

// Set initial display states - HIDE ALL ICONS initially
if (eye) eye.style.display = "none";
if (eyeSlash) eyeSlash.style.display = "none";
if (eyes) eyes.style.display = "none";
if (eyesSlash) eyesSlash.style.display = "none";

// Show/hide eye icon based on password input
if (password) {
    password.addEventListener("input", () => {
        if (password.value.length > 0) {
            if (eyeSlash) eyeSlash.style.display = "block";
            if (eye) eye.style.display = "none";
        } else {
            if (eye) eye.style.display = "none";
            if (eyeSlash) eyeSlash.style.display = "none";
        }
    });
}

// Show/hide eye icon based on confirm password input
if (confirmPassword) {
    confirmPassword.addEventListener("input", () => {
        if (confirmPassword.value.length > 0) {
            if (eyesSlash) eyesSlash.style.display = "block";
            if (eyes) eyes.style.display = "none";
        } else {
            if (eyes) eyes.style.display = "none";
            if (eyesSlash) eyesSlash.style.display = "none";
        }
    });
}

// Toggle password visibility
const togglePassword = () => {
    if (password.type === "password") {
        password.type = "text";
        if (eye) eye.style.display = "block";
        if (eyeSlash) eyeSlash.style.display = "none";
    } else {
        password.type = "password";
        if (eye) eye.style.display = "none";
        if (eyeSlash) eyeSlash.style.display = "block";
    }
};

// Toggle confirm password visibility
const toggleConfirmPassword = () => {
    if (confirmPassword.type === "password") {
        confirmPassword.type = "text";
        if (eyes) eyes.style.display = "block";
        if (eyesSlash) eyesSlash.style.display = "none";
    } else {
        confirmPassword.type = "password";
        if (eyes) eyes.style.display = "none";
        if (eyesSlash) eyesSlash.style.display = "block";
    }
};

// Add event listeners for eye icons
if (eye) eye.addEventListener("click", togglePassword);
if (eyeSlash) eyeSlash.addEventListener("click", togglePassword);
if (eyes) eyes.addEventListener("click", toggleConfirmPassword);
if (eyesSlash) eyesSlash.addEventListener("click", toggleConfirmPassword);

// Handle form submission
if (formWrapper) {
    formWrapper.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullnameValue = fullname ? fullname.value.trim() : "";
        const emailValue = email ? email.value.trim() : "";
        const passwordValue = password ? password.value.trim() : "";
        const confirmPasswordValue = confirmPassword ? confirmPassword.value.trim() : "";

        // Validations
        if (!fullnameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
            Swal.fire({ 
                icon: "error", 
                title: "Oops...", 
                text: "Please fill in all fields!",
                background: '#0a0e27',
                color: '#fff',
                confirmButtonColor: '#1e3a5f'
            });
            return;
        }
        if (passwordValue !== confirmPasswordValue) {
            Swal.fire({ 
                icon: "error", 
                title: "Mismatch", 
                text: "Passwords do not match!",
                background: '#0a0e27',
                color: '#fff',
                confirmButtonColor: '#1e3a5f'
            });
            return;
        }
        if (passwordValue.length < 6) {
            Swal.fire({ 
                icon: "error", 
                title: "Weak", 
                text: "Password must be 6+ characters",
                background: '#0a0e27',
                color: '#fff',
                confirmButtonColor: '#1e3a5f'
            });
            return;
        }

        // Get existing users
        const users = JSON.parse(localStorage.getItem('finflow_users')) || [];
        
        // Check if email already exists
        if (users.some(u => u.email === emailValue)) {
            Swal.fire({ 
                icon: "error", 
                title: "Email Exists", 
                text: "An account with this email already exists. Please login!",
                background: '#0a0e27',
                color: '#fff',
                confirmButtonColor: '#1e3a5f'
            });
            return;
        }

        // Create new user
        const newUser = {
            email: emailValue,
            name: fullnameValue,
            password: passwordValue,
            memberSince: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('finflow_users', JSON.stringify(users));
        
        // Initialize empty data for this user
        const allExpenses = JSON.parse(localStorage.getItem('finflow_all_expenses')) || {};
        allExpenses[emailValue] = [];
        localStorage.setItem('finflow_all_expenses', JSON.stringify(allExpenses));
        
        const allBudgets = JSON.parse(localStorage.getItem('finflow_all_budgets')) || {};
        allBudgets[emailValue] = {
            categories: [
                { id: 1, name: 'Food & Dining', icon: 'fork-knife', color: 'blue', budget: 500.00 },
                { id: 2, name: 'Transportation', icon: 'car', color: 'green', budget: 300.00 },
                { id: 3, name: 'Utilities', icon: 'lightning', color: 'orange', budget: 350.00 }
            ]
        };
        localStorage.setItem('finflow_all_budgets', JSON.stringify(allBudgets));
        
        const allThemes = JSON.parse(localStorage.getItem('finflow_all_themes')) || {};
        allThemes[emailValue] = 'light';
        localStorage.setItem('finflow_all_themes', JSON.stringify(allThemes));
        
        const allNotifs = JSON.parse(localStorage.getItem('finflow_all_notifications')) || {};
        allNotifs[emailValue] = {
            emailNotif: true,
            pushNotif: true,
            budgetAlerts: true,
            spendingAlerts: true,
            aiEnabled: true
        };
        localStorage.setItem('finflow_all_notifications', JSON.stringify(allNotifs));

        Swal.fire({
            icon: "success",
            title: "Account Created!",
            text: "Redirecting to login...",
            timer: 2000,
            showConfirmButton: false,
            background: '#0a0e27',
            color: '#fff',
            iconColor: '#10b981'
        }).then(() => {
            window.location.href = "login.html";
        });
    });
}

console.log("Signup page loaded with user-specific data management!");