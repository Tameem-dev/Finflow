// ========== THREE.JS ANIMATED BACKGROUND ==========
const canvas = document.getElementById('bg-canvas');
if (canvas) {
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

    // Create floating torus knot (glass morphism effect)
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

    // Animation variables
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;

        // Rotate particles
        particlesMesh.rotation.y = time * 0.1;
        particlesMesh.rotation.x = Math.sin(time * 0.2) * 0.1;

        // Animate torus knot
        torusKnot.rotation.x = time * 0.4;
        torusKnot.rotation.y = time * 0.6;
        torusKnot.position.y = 2 + Math.sin(time * 0.8) * 0.2;

        // Animate sphere
        sphere.rotation.x = time * 0.3;
        sphere.rotation.y = time * 0.5;

        // Subtle camera movement
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
}

// ========== YOUR ORIGINAL FORGOT PASSWORD CODE (PRESERVED) ==========
// Get all steps
const emailStep = document.getElementById("email-step");
const codeStep = document.getElementById("code-step");
const passwordStep = document.getElementById("password-step");

// Get forms
const emailForm = document.getElementById("email-form");
const codeForm = document.getElementById("code-form");
const passwordForm = document.getElementById("password-form");

// Get inputs
const emailInput = document.getElementById("email");
const codeInputs = document.querySelectorAll(".code-input");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");

// Get eye icons
const eyeNew = document.getElementById("fa-eye-new");
const eyeSlashNew = document.getElementById("fa-eye-slash-new");
const eyeConfirm = document.getElementById("fa-eye-confirm");
const eyeSlashConfirm = document.getElementById("fa-eye-slash-confirm");

// Timer elements
const resendLink = document.getElementById("resend-link");
const timerText = document.getElementById("timer");
const countdownSpan = document.getElementById("countdown");

// Store user email
let userEmail = "";

// API URL
const API_URL = "http://localhost:3000";

// Initialize eye icons
if (eyeNew) eyeNew.style.display = "none";
if (eyeSlashNew) eyeSlashNew.style.display = "none";
if (eyeConfirm) eyeConfirm.style.display = "none";
if (eyeSlashConfirm) eyeSlashConfirm.style.display = "none";

// ============================================
// STEP 1: EMAIL SUBMISSION
// ============================================

if (emailForm) {
    emailForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter your email address!',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        if (!email.includes("@")) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address!',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        // Store email
        userEmail = email;
        
        // Show loading
        Swal.fire({
            title: 'Sending code...',
            text: 'Please wait while we send the code to your email',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            // Send code to backend
            const response = await fetch(`${API_URL}/api/send-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            Swal.close();
            
            if (data.success) {
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Code Sent!',
                    text: `A 6-digit verification code has been sent to ${email}. Please check your inbox.`,
                    confirmButtonColor: '#458FF6'
                }).then(() => {
                    // Move to code step
                    emailStep.classList.remove("active");
                    codeStep.classList.add("active");
                    
                    // Display email in code step
                    document.getElementById("user-email").textContent = email;
                    
                    // Focus first code input
                    codeInputs[0].focus();
                    
                    // Start countdown timer
                    startCountdown();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Failed to send code. Please try again.',
                    confirmButtonColor: '#458FF6'
                });
            }
            
        } catch (error) {
            Swal.close();
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Could not connect to server. Make sure you have a stable internet connection.',
                confirmButtonColor: '#458FF6'
            });
        }
    });
}

// ============================================
// STEP 2: CODE VERIFICATION
// ============================================

// Auto-focus next input
codeInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
        const value = e.target.value;
        
        // Only allow numbers
        if (!/^\d$/.test(value)) {
            e.target.value = "";
            return;
        }
        
        // Move to next input
        if (value && index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
        }
    });
    
    // Handle backspace
    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            codeInputs[index - 1].focus();
        }
    });
});

if (codeForm) {
    codeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Get entered code
        let enteredCode = "";
        codeInputs.forEach(input => {
            enteredCode += input.value;
        });
        
        // Validate code length
        if (enteredCode.length !== 6) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Code',
                text: 'Please enter all 6 digits!',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        // Show loading
        Swal.fire({
            title: 'Verifying...',
            text: 'Please wait',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            // Verify code with backend
            const response = await fetch(`${API_URL}/api/verify-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: userEmail, 
                    code: enteredCode 
                })
            });
            
            const data = await response.json();
            
            Swal.close();
            
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Code Verified!',
                    text: 'Now create your new password',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Move to password step
                    codeStep.classList.remove("active");
                    passwordStep.classList.add("active");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Code',
                    text: data.message || 'The code you entered is incorrect.',
                    confirmButtonColor: '#458FF6'
                });
                
                // Clear inputs
                codeInputs.forEach(input => input.value = "");
                codeInputs[0].focus();
            }
            
        } catch (error) {
            Swal.close();
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not verify code. Please try again.',
                confirmButtonColor: '#458FF6'
            });
        }
    });
}

// Countdown timer
let countdown = 60;
let countdownInterval;

function startCountdown() {
    if (resendLink) resendLink.classList.add("disabled");
    if (timerText) timerText.classList.remove("hidden");
    countdown = 60;
    
    countdownInterval = setInterval(() => {
        countdown--;
        if (countdownSpan) countdownSpan.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            if (resendLink) resendLink.classList.remove("disabled");
            if (timerText) timerText.classList.add("hidden");
        }
    }, 1000);
}

// Resend code
if (resendLink) {
    resendLink.addEventListener("click", async (e) => {
        e.preventDefault();
        
        if (resendLink.classList.contains("disabled")) {
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/api/send-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail })
            });
            
            const data = await response.json();
            
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Code Resent!',
                    text: `A new verification code has been sent to ${userEmail}`,
                    confirmButtonColor: '#458FF6'
                });
                
                // Clear inputs
                codeInputs.forEach(input => input.value = "");
                codeInputs[0].focus();
                
                // Restart countdown
                startCountdown();
            }
            
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Could not resend code. Please try again.',
                confirmButtonColor: '#458FF6'
            });
        }
    });
}

// ============================================
// STEP 3: NEW PASSWORD
// ============================================

// Show/hide password icons on input
if (newPasswordInput) {
    newPasswordInput.addEventListener("input", () => {
        if (newPasswordInput.value.length > 0) {
            if (eyeSlashNew) eyeSlashNew.style.display = "block";
            if (eyeNew) eyeNew.style.display = "none";
        } else {
            if (eyeNew) eyeNew.style.display = "none";
            if (eyeSlashNew) eyeSlashNew.style.display = "none";
        }
        
        validatePassword();
    });
}

if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", () => {
        if (confirmPasswordInput.value.length > 0) {
            if (eyeSlashConfirm) eyeSlashConfirm.style.display = "block";
            if (eyeConfirm) eyeConfirm.style.display = "none";
        } else {
            if (eyeConfirm) eyeConfirm.style.display = "none";
            if (eyeSlashConfirm) eyeSlashConfirm.style.display = "none";
        }
    });
}

// Toggle new password visibility
const toggleNewPassword = () => {
    if (newPasswordInput.type === "password") {
        newPasswordInput.type = "text";
        if (eyeNew) eyeNew.style.display = "block";
        if (eyeSlashNew) eyeSlashNew.style.display = "none";
    } else {
        newPasswordInput.type = "password";
        if (eyeNew) eyeNew.style.display = "none";
        if (eyeSlashNew) eyeSlashNew.style.display = "block";
    }
};

// Toggle confirm password visibility
const toggleConfirmPassword = () => {
    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        if (eyeConfirm) eyeConfirm.style.display = "block";
        if (eyeSlashConfirm) eyeSlashConfirm.style.display = "none";
    } else {
        confirmPasswordInput.type = "password";
        if (eyeConfirm) eyeConfirm.style.display = "none";
        if (eyeSlashConfirm) eyeSlashConfirm.style.display = "block";
    }
};

// Add event listeners for eye icons
if (eyeNew) eyeNew.addEventListener("click", toggleNewPassword);
if (eyeSlashNew) eyeSlashNew.addEventListener("click", toggleNewPassword);
if (eyeConfirm) eyeConfirm.addEventListener("click", toggleConfirmPassword);
if (eyeSlashConfirm) eyeSlashConfirm.addEventListener("click", toggleConfirmPassword);

// Password validation with visual feedback
function validatePassword() {
    const password = newPasswordInput ? newPasswordInput.value : "";
    
    // Check length (at least 8 characters)
    const lengthReq = document.getElementById("req-length");
    if (lengthReq) {
        if (password.length >= 8) {
            lengthReq.classList.add("valid");
        } else {
            lengthReq.classList.remove("valid");
        }
    }
    
    // Check uppercase
    const uppercaseReq = document.getElementById("req-uppercase");
    if (uppercaseReq) {
        if (/[A-Z]/.test(password)) {
            uppercaseReq.classList.add("valid");
        } else {
            uppercaseReq.classList.remove("valid");
        }
    }
    
    // Check lowercase
    const lowercaseReq = document.getElementById("req-lowercase");
    if (lowercaseReq) {
        if (/[a-z]/.test(password)) {
            lowercaseReq.classList.add("valid");
        } else {
            lowercaseReq.classList.remove("valid");
        }
    }
    
    // Check number
    const numberReq = document.getElementById("req-number");
    if (numberReq) {
        if (/[0-9]/.test(password)) {
            numberReq.classList.add("valid");
        } else {
            numberReq.classList.remove("valid");
        }
    }
}

// Password form submission
if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const newPassword = newPasswordInput ? newPasswordInput.value.trim() : "";
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : "";
        
        // Check if fields are empty
        if (!newPassword || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in both password fields!',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        // Validate password requirements
        if (newPassword.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password must be at least 8 characters long!',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        if (!/[A-Z]/.test(newPassword)) {
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password must contain at least one uppercase letter!',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        if (!/[a-z]/.test(newPassword)) {
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password must contain at least one lowercase letter!',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        if (!/[0-9]/.test(newPassword)) {
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password must contain at least one number!',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match! Please try again.',
                confirmButtonColor: '#458FF6'
            });
            return;
        }
        
        // All validations passed
        Swal.fire({
            icon: 'success',
            title: 'Password Reset Successful!',
            text: 'Your password has been changed. Redirecting to login...',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
        }).then(() => {
            // Redirect to login page
            window.location.href = "login.html";
        });
    });
}

console.log("Forgot password page loaded with Three.js and Glass Morphism!");