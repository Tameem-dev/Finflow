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
eye.style.display = "none";
eyeSlash.style.display = "none";
eyes.style.display = "none";
eyesSlash.style.display = "none";

localStorage.setItem("email", email.value);
localStorage.setItem("password", password.value);
localStorage.setItem("confirmPassword", confirmPassword.value);

// Show/hide eye icon based on password input
password.addEventListener("input", () => {
  if (password.value.length > 0) {
    // Show eye-slash icon when there's text
    eyeSlash.style.display = "block";
    eye.style.display = "none";
  } else {
    // Hide all icons when field is empty
    eye.style.display = "none";
    eyeSlash.style.display = "none";
  }
});

// Show/hide eye icon based on confirm password input
confirmPassword.addEventListener("input", () => {
  if (confirmPassword.value.length > 0) {
    // Show eye-slash icon when there's text
    eyesSlash.style.display = "block";
    eyes.style.display = "none";
  } else {
    // Hide all icons when field is empty
    eyes.style.display = "none";
    eyesSlash.style.display = "none";
  }
});

// Toggle password visibility
const togglePassword = () => {
  if (password.type === "password") {
    password.type = "text";
    eye.style.display = "block";
    eyeSlash.style.display = "none";
  } else {
    password.type = "password";
    eye.style.display = "none";
    eyeSlash.style.display = "block";
  }
};

// Toggle confirm password visibility
const toggleConfirmPassword = () => {
  if (confirmPassword.type === "password") {
    confirmPassword.type = "text";
    eyes.style.display = "block";
    eyesSlash.style.display = "none";
  } else {
    confirmPassword.type = "password";
    eyes.style.display = "none";
    eyesSlash.style.display = "block";
  }
};

// Add event listeners for eye icons
eye.addEventListener("click", togglePassword);
eyeSlash.addEventListener("click", togglePassword);
eyes.addEventListener("click", toggleConfirmPassword);
eyesSlash.addEventListener("click", toggleConfirmPassword);

// Handle form submission
formWrapper.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullnameValue = fullname.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    // Validations
    if (!fullnameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
        Swal.fire({ icon: "error", title: "Oops...", text: "Please fill in all fields!" });
        return;
    }
    if (passwordValue !== confirmPasswordValue) {
        Swal.fire({ icon: "error", title: "Mismatch", text: "Passwords do not match!" });
        return;
    }
    if (passwordValue.length < 6) {
        Swal.fire({ icon: "error", title: "Weak", text: "Password must be 6+ chars" });
        return;
    }

    // --- THE FIX: Save data ONLY when validation passes ---
    localStorage.setItem("userEmail", emailValue);
    localStorage.setItem("userPassword", passwordValue);
    localStorage.setItem("userName", fullnameValue);

    Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Redirecting to login...",
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "login.html";
    });
});
localStorage.setItem("userEmail", emailValue);
localStorage.setItem("userPassword", passwordValue);
localStorage.setItem("userName", fullnameValue);

console.log("✓ Data saved to LocalStorage");
