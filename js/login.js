// Get all elements
const formWrappers = document.getElementById("form-wrappers");
const email = document.getElementById("email");
const password = document.getElementById("password");
const eye = document.getElementById("fa-eye");
const eyeslash = document.getElementById("fa-eye-slash");

// Set initial display states - HIDE ALL ICONS initially
eye.style.display = "none";
eyeslash.style.display = "none";

// Show/hide eye icon based on password input
password.addEventListener("input", () => {
  if (password.value.length > 0) {
    // Show eye-slash icon when there's text (password is hidden)
    eyeslash.style.display = "block";
    eye.style.display = "none";
  } else {
    // Hide all icons when field is empty
    eye.style.display = "none";
    eyeslash.style.display = "none";
  }
});

// Toggle password visibility function
const togglePasswordIcon = () => {
  if (password.type === "password") {
    // Show password (change to text)
    password.type = "text";
    eye.style.display = "block";
    eyeslash.style.display = "none";
  } else {
    // Hide password (change to password)
    password.type = "password";
    eye.style.display = "none";
    eyeslash.style.display = "block";
  }
};


// Add event listeners for eye icons
eye.addEventListener("click", togglePasswordIcon);
eyeslash.addEventListener("click", togglePasswordIcon);

// Handle form submission
formWrappers.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default form submission

  // Handle form submission
  formWrappers.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue || !passwordValue) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
      });
      return;
    }

    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    if (!storedEmail) {
        Swal.fire({
            icon: "error",
            title: "No Account Found",
            text: "Please sign up first!",
            confirmButtonColor: "#458FF6",
        });
        return;
    }

    if (emailValue === storedEmail && passwordValue === storedPassword) {

        localStorage.setItem("isLoggedIn", "true");

      // Success!
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Redirecting to dashboard...",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      }).then(() => {
        window.location.href = "dashboard.html";
      });
    } else {
      // Fail!
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password. Please sign up if you haven't!",
        confirmButtonColor: "#458FF6",
      });
    }
  });

  // Password validation - Check minimum length
  if (passwordValue.length < 6) {
    Swal.fire({
      icon: "error",
      title: "Weak Password",
      text: "Password must be at least 6 characters long!",
      confirmButtonColor: "#458FF6",
    });
    return;
  }

  // If all validations pass
  console.log("✓ Form Submitted Successfully!");
  console.log("Email:", emailValue);
  console.log("Password:", passwordValue);

  // Show success message with SweetAlert
  Swal.fire({
    icon: "success",
    title: "Login Successful!",
    text: "Redirecting to dashboard...",
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  }).then(() => {
    // Redirect to another page
    window.location.href = "dashboard.html";
  });
});

localStorage.getItem("email");
localStorage.getItem("password");