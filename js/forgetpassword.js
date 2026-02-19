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

// API URL - THIS IS THE IMPORTANT NEW LINE!
const API_URL = "http://localhost:3000";

// Initialize eye icons
eyeNew.style.display = "none";
eyeSlashNew.style.display = "none";
eyeConfirm.style.display = "none";
eyeSlashConfirm.style.display = "none";

// ============================================
// STEP 1: EMAIL SUBMISSION
// ============================================

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
        // Send code to backend - THIS IS NEW!
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
            text: 'Could not connect to server. Make sure the you have a stable internet connection.',
            confirmButtonColor: '#458FF6'
        });
    }
});

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
        // Verify code with backend - THIS IS NEW!
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

// Countdown timer
let countdown = 60;
let countdownInterval;

function startCountdown() {
    resendLink.classList.add("disabled");
    timerText.classList.remove("hidden");
    countdown = 60;
    
    countdownInterval = setInterval(() => {
        countdown--;
        countdownSpan.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            resendLink.classList.remove("disabled");
            timerText.classList.add("hidden");
        }
    }, 1000);
}

// Resend code
resendLink.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if (resendLink.classList.contains("disabled")) {
        return;
    }
    
    try {
        // THIS IS NEW - actually sends to backend!
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

// ============================================
// STEP 3: NEW PASSWORD
// ============================================

// Show/hide password icons on input
newPasswordInput.addEventListener("input", () => {
    if (newPasswordInput.value.length > 0) {
        eyeSlashNew.style.display = "block";
        eyeNew.style.display = "none";
    } else {
        eyeNew.style.display = "none";
        eyeSlashNew.style.display = "none";
    }
    
    validatePassword();
});

confirmPasswordInput.addEventListener("input", () => {
    if (confirmPasswordInput.value.length > 0) {
        eyeSlashConfirm.style.display = "block";
        eyeConfirm.style.display = "none";
    } else {
        eyeConfirm.style.display = "none";
        eyeSlashConfirm.style.display = "none";
    }
});

// Toggle new password visibility
const toggleNewPassword = () => {
    if (newPasswordInput.type === "password") {
        newPasswordInput.type = "text";
        eyeNew.style.display = "block";
        eyeSlashNew.style.display = "none";
    } else {
        newPasswordInput.type = "password";
        eyeNew.style.display = "none";
        eyeSlashNew.style.display = "block";
    }
};

// Toggle confirm password visibility
const toggleConfirmPassword = () => {
    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        eyeConfirm.style.display = "block";
        eyeSlashConfirm.style.display = "none";
    } else {
        confirmPasswordInput.type = "password";
        eyeConfirm.style.display = "none";
        eyeSlashConfirm.style.display = "block";
    }
};

// Add event listeners for eye icons
eyeNew.addEventListener("click", toggleNewPassword);
eyeSlashNew.addEventListener("click", toggleNewPassword);
eyeConfirm.addEventListener("click", toggleConfirmPassword);
eyeSlashConfirm.addEventListener("click", toggleConfirmPassword);

// Password validation with visual feedback
function validatePassword() {
    const password = newPasswordInput.value;
    
    // Check length (at least 8 characters)
    const lengthReq = document.getElementById("req-length");
    if (password.length >= 8) {
        lengthReq.classList.add("valid");
    } else {
        lengthReq.classList.remove("valid");
    }
    
    // Check uppercase
    const uppercaseReq = document.getElementById("req-uppercase");
    if (/[A-Z]/.test(password)) {
        uppercaseReq.classList.add("valid");
    } else {
        uppercaseReq.classList.remove("valid");
    }
    
    // Check lowercase
    const lowercaseReq = document.getElementById("req-lowercase");
    if (/[a-z]/.test(password)) {
        lowercaseReq.classList.add("valid");
    } else {
        lowercaseReq.classList.remove("valid");
    }
    
    // Check number
    const numberReq = document.getElementById("req-number");
    if (/[0-9]/.test(password)) {
        numberReq.classList.add("valid");
    } else {
        numberReq.classList.remove("valid");
    }
}

// Password form submission
passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
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