/* ========================================
   CRAFTERS - JavaScript Application Logic
   ======================================== */

// ========== DOM INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initForms();
    setActiveNavLink();
});

// ========== SIDEBAR FUNCTIONALITY ==========
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking a nav link on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// ========== NAVIGATION ACTIVE STATE ==========
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========== FORM HANDLING ==========
function initForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Basic validation
    if (validateForm(form)) {
        showNotification('Success!', 'Form submitted successfully.', 'success');
        form.reset();
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('.form-control[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('form-error');
    let errorEl = input.nextElementSibling;

    if (!errorEl || !errorEl.classList.contains('form-error-message')) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error-message';
        input.parentNode.insertBefore(errorEl, input.nextSibling);
    }

    errorEl.textContent = message;
}

function clearFieldError(input) {
    input.classList.remove('form-error');
    const errorEl = input.nextElementSibling;

    if (errorEl && errorEl.classList.contains('form-error-message')) {
        errorEl.remove();
    }
}

// ========== NOTIFICATIONS ==========
function showNotification(title, message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background-color: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        animation: slideIn 300ms ease-out;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    `;

    const content = document.createElement('div');
    content.innerHTML = `
        <strong>${title}</strong>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">${message}</p>
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    notification.appendChild(content);
    notification.appendChild(closeBtn);
    container.appendChild(notification);

    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 300ms ease-out';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 300ms ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#4caf50',
        error: '#ff6b6b',
        warning: '#ffc107',
        info: '#2196f3'
    };
    return colors[type] || colors.info;
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Add item to a list (used in friends, projects, etc.)
 */
function addItemToList(listSelector, itemHTML) {
    const list = document.querySelector(listSelector);
    if (!list) return;

    const tbody = list.querySelector('tbody');
    if (tbody) {
        const row = document.createElement('tr');
        row.innerHTML = itemHTML;
        tbody.appendChild(row);
        animateNewItem(row);
    }
}

/**
 * Remove item from a list
 */
function removeItemFromList(button) {
    const row = button.closest('tr') || button.closest('.item-card');
    if (row) {
        row.style.animation = 'slideOut 300ms ease-out';
        setTimeout(() => row.remove(), 300);
    }
}

/**
 * Animate new item appearance
 */
function animateNewItem(element) {
    element.style.animation = 'slideIn 300ms ease-out';
}

/**
 * Format date
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Get initials from name
 */
function getInitials(name) {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
}

/**
 * Toggle favorite
 */
function toggleFavorite(button) {
    button.classList.toggle('favorited');
    const isFavorited = button.classList.contains('favorited');
    button.innerHTML = isFavorited ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
}

// ========== ANIMATIONS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .sidebar {
        scrollbar-width: thin;
        scrollbar-color: rgba(212, 175, 55, 0.3) transparent;
    }

    .sidebar::-webkit-scrollbar {
        width: 8px;
    }

    .sidebar::-webkit-scrollbar-track {
        background: transparent;
    }

    .sidebar::-webkit-scrollbar-thumb {
        background-color: rgba(212, 175, 55, 0.3);
        border-radius: 4px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(212, 175, 55, 0.5);
    }

    .content-area {
        scrollbar-width: thin;
        scrollbar-color: rgba(212, 175, 55, 0.3) transparent;
    }

    .content-area::-webkit-scrollbar {
        width: 8px;
    }

    .content-area::-webkit-scrollbar-track {
        background: transparent;
    }

    .content-area::-webkit-scrollbar-thumb {
        background-color: rgba(212, 175, 55, 0.3);
        border-radius: 4px;
    }

    .content-area::-webkit-scrollbar-thumb:hover {
        background-color: rgba(212, 175, 55, 0.5);
    }
`;
document.head.appendChild(style);
