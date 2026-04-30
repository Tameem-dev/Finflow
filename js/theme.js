// ========== SHARED THEME MANAGEMENT - For ALL Pages ==========

// Inject theme styles dynamically (or link to theme.css)
const themeStyles = `
    /* Light Theme Base */
    body.light-theme {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    body.light-theme .sidebar {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(12px);
        border-right: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    body.light-theme .logo span,
    body.light-theme .nav-item,
    body.light-theme .nav-item.active,
    body.light-theme .user-name,
    body.light-theme .page-header h1,
    body.light-theme .card-header h3,
    body.light-theme .amount,
    body.light-theme .total-amount,
    body.light-theme .transactions-count,
    body.light-theme .stat-card h2 {
        color: white;
    }
    
    body.light-theme .nav-item.active {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    body.light-theme .card,
    body.light-theme .stat-card,
    body.light-theme .budget-category-card,
    body.light-theme .expenses-table-container {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    body.light-theme input,
    body.light-theme select,
    body.light-theme .search-bar {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
    }
    
    body.light-theme .header {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    /* Dark Theme Base */
    body.dark-theme {
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
    }
    
    body.dark-theme .sidebar {
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(12px);
        border-right: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    body.dark-theme .logo span,
    body.dark-theme .nav-item,
    body.dark-theme .user-name,
    body.dark-theme .page-header h1,
    body.dark-theme .card-header h3,
    body.dark-theme .amount,
    body.dark-theme .total-amount,
    body.dark-theme .transactions-count,
    body.dark-theme .stat-card h2 {
        color: #f3f4f6;
    }
    
    body.dark-theme .nav-item.active {
        background-color: rgba(37, 99, 235, 0.3);
        color: #60a5fa;
    }
    
    body.dark-theme .card,
    body.dark-theme .stat-card,
    body.dark-theme .budget-category-card,
    body.dark-theme .expenses-table-container {
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    body.dark-theme input,
    body.dark-theme select,
    body.dark-theme .search-bar {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #f3f4f6;
    }
    
    body.dark-theme .header {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Transitions */
    body, .sidebar, .header, .card, .nav-item, .search-bar, input {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
`;

// Apply theme styles if not already in CSS
if (!document.querySelector('#theme-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'theme-styles';
    styleSheet.textContent = themeStyles;
    document.head.appendChild(styleSheet);
}

// Theme Management Functions
function applyTheme(theme, saveToStorage = true) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        if (saveToStorage) localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
        body.classList.add('light-theme');
        if (saveToStorage) localStorage.setItem('theme', 'light');
    } else if (theme === 'auto') {
        // Auto mode: follow system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-theme');
        } else {
            body.classList.add('light-theme');
        }
        if (saveToStorage) localStorage.setItem('theme', 'auto');
    }
    
    // Update active state on theme options (if they exist on the page)
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const optionTheme = option.getAttribute('data-theme');
        if (optionTheme === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme, false);
    
    // Listen for system preference changes when in auto mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'auto') {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
            } else {
                document.body.classList.add('light-theme');
                document.body.classList.remove('dark-theme');
            }
        }
    });
}

// Add theme toggle buttons to pages that need them
function setupThemeToggle() {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            applyTheme(theme, true);
            
            // Optional: Show feedback
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode Activated`,
                    timer: 1200,
                    showConfirmButton: false,
                    background: document.body.classList.contains('dark-theme') ? '#1f2937' : '#fff',
                    color: document.body.classList.contains('dark-theme') ? '#fff' : '#1f2937'
                });
            }
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeToggle();
});

console.log('Shared theme system loaded!');