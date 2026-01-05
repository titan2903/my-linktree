// ===================================
// THEME SWITCHER
// ===================================

(function() {
    'use strict';
    
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const storageKey = 'linktree-theme';
    
    // Get saved theme or default to dark
    function getSavedTheme() {
        const savedTheme = localStorage.getItem(storageKey);
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        
        return 'dark';
    }
    
    // Set theme
    function setTheme(theme) {
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
        } else {
            htmlElement.removeAttribute('data-theme');
        }
        localStorage.setItem(storageKey, theme);
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        
        // Add a subtle animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    }
    
    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getSavedTheme();
        setTheme(savedTheme);
    }
    
    // Listen for theme toggle clicks
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem(storageKey)) {
                setTheme(e.matches ? 'light' : 'dark');
            }
        });
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
