document.addEventListener("DOMContentLoaded", () => {
  // 1. SYNC NAME & AVATAR (Header)
  const storedName = localStorage.getItem("userName") || "User";
  const initial = storedName.charAt(0).toUpperCase();
  
  document.querySelectorAll(".user-name").forEach(el => el.textContent = storedName);
  document.querySelectorAll(".user-avatar").forEach(el => el.textContent = initial);

  // Also update header if elements exist
  const headerUserName = document.getElementById('headerUserName');
  const headerAvatar = document.getElementById('headerAvatar');
  if (headerUserName) headerUserName.textContent = storedName;
  if (headerAvatar) headerAvatar.textContent = initial;

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
        confirmButtonColor: '#1e3a5f',
        cancelButtonColor: '#475569',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Stay',
        reverseButtons: true,
        background: '#0a0e27',
        color: '#fff'
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear current session data
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('expenses');
          localStorage.removeItem('budgets');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('memberSince');
          
          Swal.fire({
            title: 'Logged Out!',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            background: '#0a0e27',
            color: '#fff'
          });

          // Redirect after timer
          setTimeout(() => {
            window.location.replace("login.html");
          }, 1000);
        }
      });
    });
  }
});