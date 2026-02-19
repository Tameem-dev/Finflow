document.addEventListener("DOMContentLoaded", () => {
  // 1. SYNC NAME & AVATAR (Header)
  const storedName = localStorage.getItem("userName") || "User";
  const initial = storedName.charAt(0).toUpperCase();
  
  document.querySelectorAll(".user-name").forEach(el => el.textContent = storedName);
  document.querySelectorAll(".user-avatar").forEach(el => el.textContent = initial);

  // 2. SWEETALERT LOGOUT
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      Swal.fire({
        title: 'Logging Out?',
        text: "Are you sure you want to end your session?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#9ca3af',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Stay',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Show a quick success message
          Swal.fire({
            title: 'Logged Out!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          });

          // Wait for timer, then redirect
          setTimeout(() => {
            localStorage.setItem("isLoggedIn", "false");
            window.location.replace("login.html");
          }, 1000);
        }
      });
    });
  }
});