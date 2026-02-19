document.addEventListener("DOMContentLoaded", () => {
  // 1. AUTH GUARD - Kick out if not logged in
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
    return;
  }

  // 2. WELCOME TEXT (Customized for Dashboard)
  const storedName = localStorage.getItem("userName") || "User";
  const pageHeaderP = document.querySelector(".page-header p");
  if (pageHeaderP) {
    // Splits the name to show only the first name (e.g., "Thaabit")
    pageHeaderP.textContent = `Welcome back, ${storedName.split(" ")[0]}! Here's your financial overview.`;
  }

  // 3. CALCULATE TOTALS FROM REAL DATA
  const allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  
  // Sum up all expenses from localStorage
  const totalSpent = allExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Placeholder Income (until you build the Income feature)
  const placeholderIncome = 10000;
  const currentBalance = placeholderIncome - totalSpent;

  // 4. UPDATE STATS CARDS
  // Based on your HTML order: 0 = Income, 1 = Expenses, 2 = Balance
  const amountDisplays = document.querySelectorAll(".summary-card .amount");

  if (amountDisplays.length >= 3) {
    // Format: $10,000
    amountDisplays[0].textContent = `$${placeholderIncome.toLocaleString()}`;
    
    // Format: $5,280.00
    amountDisplays[1].textContent = `$${totalSpent.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    })}`;
    
    // Format: $4,720.00
    amountDisplays[2].textContent = `$${currentBalance.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    })}`;
  }

  // 5. SEARCH BAR LOG (Preview feature)
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      console.log("Searching dashboard for:", e.target.value);
    });
  }
});