/**
 * UTILITY FUNCTIONS
 * Common helper functions used across the application
 */

// ============================================
// CLIPBOARD OPERATIONS
// ============================================

/**
 * Copy text to clipboard with fallback support
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showToast('Link tersalin!', 'success');
      return true;
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (success) {
        showToast('Link tersalin!', 'success');
      }
      return success;
    }
  } catch (error) {
    console.error('Failed to copy:', error);
    showToast('Gagal menyalin', 'error');
    return false;
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: info, success, warning, error
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
  // Create container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  // Icon based on type
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <div style="flex-shrink: 0; font-size: 20px;">${icons[type] || icons.info}</div>
    <div style="flex: 1;">${message}</div>
    <button class="btn-ghost btn-icon btn-sm" onclick="this.parentElement.remove()" aria-label="Close">
      ✕
    </button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  // Auto dismiss
  setTimeout(() => {
    toast.style.animation = 'fade-out 300ms ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);

  // Swipe to dismiss (mobile)
  let startX = 0;
  let currentX = 0;

  toast.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  toast.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (diff > 0) {
      toast.style.transform = `translateX(${diff}px)`;
      toast.style.opacity = 1 - (diff / 200);
    }
  });

  toast.addEventListener('touchend', () => {
    const diff = currentX - startX;
    if (diff > 100) {
      toast.remove();
    } else {
      toast.style.transform = '';
      toast.style.opacity = '';
    }
  });
}

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validate form data against schema
 * @param {Object} formData - Form data object
 * @param {Object} schema - Validation schema
 * @returns {Object} { isValid: boolean, errors: Object }
 */
function validateForm(formData, schema) {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];

    // Required check
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = rules.message || `${field} wajib diisi`;
      isValid = false;
      continue;
    }

    // Skip other validations if value is empty and not required
    if (!value && !rules.required) continue;

    // Min length
    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = rules.message || `Minimal ${rules.minLength} karakter`;
      isValid = false;
      continue;
    }

    // Max length
    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = rules.message || `Maksimal ${rules.maxLength} karakter`;
      isValid = false;
      continue;
    }

    // Pattern matching
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message || 'Format tidak valid';
      isValid = false;
      continue;
    }

    // Custom validator
    if (rules.validator && !rules.validator(value)) {
      errors[field] = rules.message || 'Validasi gagal';
      isValid = false;
      continue;
    }
  }

  return { isValid, errors };
}

/**
 * Show error message for a field
 * @param {string} fieldName - Field name/ID
 * @param {string} message - Error message
 */
function showFieldError(fieldName, message) {
  const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;

  field.classList.add('error');
  field.classList.remove('success');

  // Remove existing error message
  const existingError = field.parentElement.querySelector('.form-error');
  if (existingError) existingError.remove();

  // Add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error';
  errorDiv.innerHTML = `<span>✗</span> ${message}`;
  field.parentElement.appendChild(errorDiv);
}

/**
 * Clear error for a field
 * @param {string} fieldName - Field name/ID
 */
function clearFieldError(fieldName) {
  const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;

  field.classList.remove('error');

  const errorDiv = field.parentElement.querySelector('.form-error');
  if (errorDiv) errorDiv.remove();
}

/**
 * Show success state for a field
 * @param {string} fieldName - Field name/ID
 */
function showFieldSuccess(fieldName) {
  const field = document.getElementById(fieldName) || document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;

  field.classList.add('success');
  field.classList.remove('error');

  clearFieldError(fieldName);
}

// ============================================
// PHONE NUMBER FORMATTING
// ============================================

/**
 * Format phone number with hyphens
 * @param {string} value - Phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(value) {
  // Remove non-digit characters
  const digits = value.replace(/\D/g, '');

  // Format: 0812-3456-7890
  if (digits.length <= 4) {
    return digits;
  } else if (digits.length <= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  } else {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
  }
}

/**
 * Get unformatted phone number
 * @param {string} formatted - Formatted phone number
 * @returns {string} Digits only
 */
function unformatPhoneNumber(formatted) {
  return formatted.replace(/\D/g, '');
}

// ============================================
// CHARACTER COUNTER
// ============================================

/**
 * Update character counter for input
 * @param {HTMLElement} input - Input element
 * @param {number} max - Maximum characters
 */
function updateCharCounter(input, max) {
  const current = input.value.length;
  let counter = input.parentElement.querySelector('.char-counter');

  if (!counter) {
    counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = 'font-size: 12px; color: var(--color-neutral-500); text-align: right; margin-top: 4px;';
    input.parentElement.appendChild(counter);
  }

  counter.textContent = `${current}/${max}`;
  counter.style.color = current > max ? 'var(--color-error)' : 'var(--color-neutral-500)';
}

// ============================================
// MODAL/DIALOG MANAGEMENT
// ============================================

/**
 * Open modal/dialog
 * @param {string} dialogId - Dialog element ID
 */
function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  dialog.classList.remove('hidden');
  dialog.style.display = 'flex';

  // Focus trap
  const focusableElements = dialog.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  // Close on overlay click
  const overlay = dialog.querySelector('.modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeDialog(dialogId);
      }
    });
  }

  // Close on Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeDialog(dialogId);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

/**
 * Close modal/dialog
 * @param {string} dialogId - Dialog element ID
 */
function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  dialog.style.animation = 'fade-out 300ms ease-out';

  setTimeout(() => {
    dialog.classList.add('hidden');
    dialog.style.display = 'none';
    dialog.style.animation = '';
  }, 300);
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

/**
 * Set item in localStorage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Parsed value or default
 */
function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

// ============================================
// DEBOUNCE
// ============================================

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
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

// ============================================
// ANIMATION HELPERS
// ============================================

/**
 * Shake element animation
 * @param {HTMLElement} element - Element to shake
 */
function shakeElement(element) {
  element.classList.add('animate-shake');
  setTimeout(() => element.classList.remove('animate-shake'), 300);
}

/**
 * Fade in element
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Duration in milliseconds
 */
function fadeIn(element, duration = 300) {
  element.style.opacity = '0';
  element.style.display = '';
  element.classList.remove('hidden');

  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    element.style.opacity = Math.min(progress / duration, 1);

    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

/**
 * Fade out element
 * @param {HTMLElement} element - Element to fade out
 * @param {number} duration - Duration in milliseconds
 */
function fadeOut(element, duration = 300) {
  let start = null;
  const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);

  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    element.style.opacity = initialOpacity * (1 - progress / duration);

    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      element.classList.add('hidden');
      element.style.display = 'none';
    }
  }
  requestAnimationFrame(animate);
}

/**
 * Slide in element from direction
 * @param {HTMLElement} element - Element to slide in
 * @param {string} direction - Direction: top, bottom, left, right
 */
function slideIn(element, direction = 'top') {
  element.classList.remove('hidden');
  element.style.display = '';

  const animations = {
    top: 'slide-in-top',
    bottom: 'slide-in-bottom',
    left: 'slide-in-left',
    right: 'slide-in-right'
  };

  element.style.animation = `${animations[direction]} 300ms ease-out`;

  setTimeout(() => {
    element.style.animation = '';
  }, 300);
}

// ============================================
// DATE/TIME FORMATTING
// ============================================

/**
 * Format time to HH:MM
 * @param {Date|string} date - Date object or string
 * @returns {string} Formatted time
 */
function formatTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format date to DD MMM YYYY
 * @param {Date|string} date - Date object or string
 * @returns {string} Formatted date
 */
function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Get relative time string
 * @param {Date|string} date - Date object or string
 * @returns {string} Relative time (e.g., "5 menit lalu")
 */
function getTimeAgo(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'Baru saja';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;

  return formatDate(d);
}

// ============================================
// MASK PHONE NUMBER
// ============================================

/**
 * Mask phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Masked phone number
 */
function maskPhoneNumber(phone) {
  if (!phone || phone.length < 8) return phone;
  const digits = unformatPhoneNumber(phone);
  return digits.slice(0, 4) + '****' + digits.slice(-4);
}

/**
 * Mask email for display
 * @param {string} email - Email address
 * @returns {string} Masked email
 */
function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
}
