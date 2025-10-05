/**
 * DevDaily - Main JavaScript
 * Core functionality for the application
 */

// Toast Notification System
function showToast(title, message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Icon based on type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
      break;
    case 'error':
      icon = '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>';
      break;
    case 'warning':
      icon = '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>';
      break;
    default:
      icon = '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>';
  }

  toast.innerHTML = `
    ${icon}
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-message">${message}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"></path>
        <path d="m6 6 12 12"></path>
      </svg>
    </button>
  `;

  container.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Modal System
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = 'flex';
  modal.classList.add('animate-fade-in');

  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeModal(modalId);
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('closing');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('closing', 'animate-fade-in');
  }, 300);
}

// Form Validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  // Min 8 chars, 1 uppercase, 1 number, 1 special char
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    valid: minLength && hasUpperCase && hasNumber && hasSpecialChar,
    minLength,
    hasUpperCase,
    hasNumber,
    hasSpecialChar
  };
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add('error');
  field.classList.add('error-shake');

  let errorEl = field.parentElement.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;

  setTimeout(() => field.classList.remove('error-shake'), 300);
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.remove('error');
  const errorEl = field.parentElement.querySelector('.form-error');
  if (errorEl) errorEl.remove();
}

function showFieldSuccess(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add('success');

  // Add checkmark icon if not already present
  let iconEl = field.parentElement.querySelector('.form-success-icon');
  if (!iconEl) {
    iconEl = document.createElement('span');
    iconEl.className = 'form-success-icon';
    iconEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success-600)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    iconEl.style.position = 'absolute';
    iconEl.style.right = '12px';
    iconEl.style.top = '50%';
    iconEl.style.transform = 'translateY(-50%)';
    field.parentElement.style.position = 'relative';
    field.parentElement.appendChild(iconEl);
  }
}

// Debounce utility
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

// Local Storage Helpers
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return false;
  }
}

function getFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return null;
  }
}

function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing from localStorage:', e);
    return false;
  }
}

// Format date/time utilities
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function formatDate(date, format = 'medium') {
  const options = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
  };

  return new Intl.DateTimeFormat('en-US', options[format] || options.medium).format(date);
}

// Number formatting
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

function formatPoints(points) {
  const sign = points >= 0 ? '+' : '';
  return `${sign}${formatNumber(points)}`;
}

// Tab System
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const tabs = container.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));

      // Hide all content
      contents.forEach(c => {
        c.classList.add('hidden');
        c.classList.add('switching');
      });

      // Activate clicked tab
      tab.classList.add('active');

      // Show corresponding content
      setTimeout(() => {
        if (contents[index]) {
          contents[index].classList.remove('hidden');
          contents[index].classList.remove('switching');
        }
      }, 100);
    });
  });
}

// Dropdown Menu System
function initDropdowns() {
  document.addEventListener('click', (e) => {
    const dropdown = e.target.closest('.dropdown');

    if (dropdown) {
      const menu = dropdown.querySelector('.dropdown-menu');
      if (menu) {
        menu.classList.toggle('hidden');
        e.stopPropagation();
      }
    } else {
      // Close all dropdowns when clicking outside
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden');
      });
    }
  });
}

// Copy to Clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied!', 'Text copied to clipboard', 'success', 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    showToast('Copy failed', 'Could not copy to clipboard', 'error');
  });
}

// Smooth Scroll
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Initialize all dropdowns on page load
document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
});

// Export functions for use in other scripts
window.DevDaily = {
  showToast,
  openModal,
  closeModal,
  validateEmail,
  validatePassword,
  showFieldError,
  clearFieldError,
  showFieldSuccess,
  debounce,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  formatTimeAgo,
  formatDate,
  formatNumber,
  formatPoints,
  initTabs,
  copyToClipboard,
  smoothScrollTo
};
