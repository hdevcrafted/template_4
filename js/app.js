/* ========================================
   CRAFTERS - JavaScript Application Logic
   ======================================== */

// ========== MODULE IMPORTS ==========
import { initPricing, initFAQ } from './modules/pricing.js';
import { initSettingsTabs } from './modules/settings-tabs.js';

// ========== DOM INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initForms();
  setActiveNavLink();
  initNotifications();
  initFavorites();

  // Initialize page-specific modules
  if (document.querySelector('input[name="billing"]')) {
    initPricing();
  }
  if (document.querySelector('.faq-question')) {
    initFAQ();
  }
  if (document.querySelector('.settings-tab')) {
    initSettingsTabs();
  }
});

// ========== SIDEBAR FUNCTIONALITY ==========
function initSidebar() {
  // Desktop toggle (if it exists)
  const sidebarToggle = document.getElementById('sidebarToggle');

  // Mobile toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebar = document.querySelector('.sidebar');

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
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
      if (!sidebar.contains(e.target) && !sidebarToggle?.contains(e.target) && !mobileToggle?.contains(e.target)) {
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

// ========== NOTIFICATIONS SYSTEM ==========
function initNotifications() {
  const notificationBtn = document.getElementById('notificationBtn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
      showNotification('New Update', 'You have 3 unread messages', 'info');
    });
  }
}

function showNotification(title, message, type = 'info') {
  // Create notification container if it doesn't exist
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;

  const content = document.createElement('div');
  content.className = 'notification-content';
  content.innerHTML = `
        <strong>${title}</strong>
        <p class="notification-message">${message}</p>
    `;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'notification-close';
  closeBtn.innerHTML = '×';

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

// ========== FAVORITES SYSTEM ==========
function initFavorites() {
  const favoriteButtons = document.querySelectorAll('[data-favorite]');
  favoriteButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      toggleFavorite(this);
    });
  });
}

function toggleFavorite(button) {
  button.classList.toggle('favorited');
  const isFavorited = button.classList.contains('favorited');
  button.innerHTML = isFavorited ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';

  const action = isFavorited ? 'added to' : 'removed from';
  showNotification('Favorite', `Item ${action} your favorites`, 'success');
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
  const row = button.closest('tr') || button.closest('.item-card') || button.closest('.project-card') || button.closest('.course-card');
  if (row) {
    row.style.animation = 'slideOut 300ms ease-out';
    setTimeout(() => {
      row.remove();
      showNotification('Deleted', 'Item removed successfully', 'success');
    }, 300);
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
 * Copy to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied', 'Text copied to clipboard', 'success');
  }).catch(() => {
    showNotification('Error', 'Failed to copy to clipboard', 'error');
  });
}

/**
 * Debounce function for optimized event listeners
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Search/Filter functionality
 */
function setupSearch(inputSelector, tableSelector) {
  const searchInput = document.querySelector(inputSelector);
  const table = document.querySelector(tableSelector);

  if (!searchInput || !table) return;

  searchInput.addEventListener('keyup', debounce(function () {
    const searchTerm = this.value.toLowerCase();
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  }, 300));
}

/**
 * Sort table by column
 */
function setupTableSort(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  const headers = table.querySelectorAll('th');
  headers.forEach((header, columnIndex) => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();

        if (!isNaN(aValue) && !isNaN(bValue)) {
          return aValue - bValue;
        }
        return aValue.localeCompare(bValue);
      });

      rows.forEach(row => tbody.appendChild(row));
    });
  });
}

/**
 * Export table to CSV
 */
function exportTableToCSV(tableSelector, filename = 'export.csv') {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  let csv = [];
  const rows = table.querySelectorAll('tr');

  rows.forEach(row => {
    let csvRow = [];
    row.querySelectorAll('td, th').forEach(cell => {
      csvRow.push('"' + cell.textContent.trim() + '"');
    });
    csv.push(csvRow.join(','));
  });

  downloadCSV(csv.join('\n'), filename);
}

function downloadCSV(csv, filename) {
  const csvFile = new Blob([csv], { type: 'text/csv' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(csvFile);
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// ========== ANIMATIONS & STYLES ==========
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

    .favorited {
        color: #ff6b6b !important;
    }
`;
document.head.appendChild(style);