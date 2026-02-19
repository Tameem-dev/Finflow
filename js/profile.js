document.addEventListener("DOMContentLoaded", () => {
  // 1. AUTHENTICATION GUARD (Immediate check)
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const storedName = localStorage.getItem("userName");
  const storedEmail = localStorage.getItem("userEmail");

  if (isLoggedIn !== "true" || !storedName || !storedEmail) {
    window.location.href = "login.html";
  }

  // 2. INITIALIZATION ON DOM LOAD
  document.addEventListener("DOMContentLoaded", () => {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    // Populate form inputs if they exist
    const nameInput = document.querySelector(
      '.vertical-form input[type="text"]',
    );
    const emailInput = document.querySelector(
      '.vertical-form input[type="email"]',
    );
    const displayEmail = document.querySelector(".user-email");

    if (nameInput) nameInput.value = storedName;
    if (emailInput) emailInput.value = storedEmail;
    if (displayEmail) displayEmail.textContent = storedEmail;
  });

  // 3. THEME MANAGEMENT
  const themeOptions = document.querySelectorAll(".theme-option");

  function applyTheme(theme) {
    const body = document.body;
    body.classList.remove("light-theme", "dark-theme", "auto-theme");

    if (theme === "dark") {
      body.classList.add("dark-theme");
    } else if (theme === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      body.classList.add(prefersDark ? "dark-theme" : "light-theme");
    } else {
      body.classList.add("light-theme");
    }

    // Update button active states
    themeOptions.forEach((option) => {
      const label = option
        .querySelector(".theme-label")
        .textContent.toLowerCase();
      option.classList.toggle("active", label === theme);
    });
  }

  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const themeLabel = option
        .querySelector(".theme-label")
        .textContent.toLowerCase();
      applyTheme(themeLabel);
      localStorage.setItem("theme", themeLabel);
    });
  });

  // 4. PERSONAL INFORMATION FORM
  const personalInfoForm = document.querySelector(".vertical-form");
  if (personalInfoForm) {
    const saveBtn = personalInfoForm.querySelector(".btn-black");

    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const nameInput = personalInfoForm.querySelector('input[type="text"]');
      const emailInput = personalInfoForm.querySelector('input[type="email"]');

      const newName = nameInput.value.trim();
      const newEmail = emailInput.value.trim();

      if (newName.length < 3 || !newEmail.includes("@")) {
        Swal.fire({
          icon: "error",
          title: "Invalid Data",
          text: "Please provide a valid name and email.",
        });
        return;
      }

      // Save data
      localStorage.setItem("userName", newName);
      localStorage.setItem("userEmail", newEmail);

      // Sync UI manually for this page
      document
        .querySelectorAll(".user-name")
        .forEach((el) => (el.textContent = newName));
      document
        .querySelectorAll(".user-email")
        .forEach((el) => (el.textContent = newEmail));
      document
        .querySelectorAll(".user-avatar")
        .forEach((el) => (el.textContent = newName.charAt(0).toUpperCase()));

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        timer: 1500,
        showConfirmButton: false,
      });
    });
  }

  // 5. PASSWORD UPDATE (Mockup)
  const passwordForm = document.querySelectorAll(".vertical-form")[1];
  if (passwordForm) {
    passwordForm.querySelector(".btn-black").addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Updating password...",
        didOpen: () => Swal.showLoading(),
      });
      setTimeout(() => {
        Swal.fire({ icon: "success", title: "Password Updated!" });
        passwordForm.reset();
      }, 1500);
    });
  }

  // 6. DELETE ACCOUNT (Specific to Profile)
  const deleteBtn = document.querySelector(".btn-danger");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Delete Account?",
        text: "This action is permanent! Type DELETE to confirm.",
        input: "text",
        inputPlaceholder: "DELETE",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Permanently Delete",
        inputValidator: (value) => {
          if (!value || value !== "DELETE") {
            return "You must type DELETE in all caps to confirm.";
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          window.location.href = "login.html";
        }
      });
    });
  }

  // 7. EXPORT DATA
  const exportBtn = document.querySelector(".btn-white");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Export Data?",
        text: "Download your profile settings as a JSON file.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Download",
        confirmButtonColor: "#3b82f6",
      }).then((res) => {
        if (res.isConfirmed) {
          const data = {
            name: localStorage.getItem("userName"),
            email: localStorage.getItem("userEmail"),
            theme: localStorage.getItem("theme"),
            expenses: JSON.parse(localStorage.getItem("expenses")) || [],
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "finflow_data_export.json";
          a.click();
          Swal.fire("Exported!", "Your data has been downloaded.", "success");
        }
      });
    });
  }

  // 8. NOTIFICATIONS PREVIEW
  document.querySelector(".notification")?.addEventListener("click", () => {
    Swal.fire({
      title: "Notifications",
      html: `
      <div style="text-align:left; font-size: 14px;">
        <div style="margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #eee;">
            <strong>Budget Alert:</strong> Food & Dining is at 84%.<br><small style="color:gray">2 hours ago</small>
        </div>
        <div>
            <strong>System:</strong> Backup completed successfully.<br><small style="color:gray">Yesterday</small>
        </div>
      </div>`,
      confirmButtonText: "Got it",
    });
  });
});
