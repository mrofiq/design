/**
 * Developer Report Dashboard - Toast Notification System
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * Provides toast notification functionality with:
 * - Multiple toast types (success, error, warning, info)
 * - Auto-dismiss with countdown
 * - Manual dismiss
 * - Queue management
 * - Accessibility support (ARIA live regions)
 * - Responsive positioning
 */

class ToastManager {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.ariaLiveRegion = null;
    this.maxToasts = 5;
    this.position = 'top-right'; // default position
    this.idCounter = 0;

    this.init();
  }

  /**
   * Initialize the toast system
   */
  init() {
    // Create container if it doesn't exist
    if (!this.container) {
      this.createContainer();
    }

    // Create ARIA live region for screen readers
    if (!this.ariaLiveRegion) {
      this.createAriaLiveRegion();
    }
  }

  /**
   * Create the toast container element
   */
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = `toast-container toast-container--${this.position}`;
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(this.container);
  }

  /**
   * Create ARIA live region for accessibility
   */
  createAriaLiveRegion() {
    this.ariaLiveRegion = document.createElement('div');
    this.ariaLiveRegion.className = 'toast-aria-live';
    this.ariaLiveRegion.setAttribute('role', 'status');
    this.ariaLiveRegion.setAttribute('aria-live', 'polite');
    this.ariaLiveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this.ariaLiveRegion);
  }

  /**
   * Get icon SVG for toast type
   * @param {string} type - Toast type (success, error, warning, info)
   * @returns {string} SVG markup
   */
  getIcon(type) {
    const icons = {
      success: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
      `,
      error: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
        </svg>
      `,
      warning: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
      `,
      info: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
        </svg>
      `
    };
    return icons[type] || icons.info;
  }

  /**
   * Get close button SVG
   * @returns {string} SVG markup
   */
  getCloseIcon() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    `;
  }

  /**
   * Get animation direction based on container position
   * @returns {string} Animation direction
   */
  getAnimationDirection() {
    if (this.position.includes('right')) return 'right';
    if (this.position.includes('left')) return 'left';
    if (this.position.includes('top')) return 'top';
    if (this.position.includes('bottom')) return 'bottom';
    return 'right';
  }

  /**
   * Create toast element
   * @param {Object} options - Toast options
   * @returns {HTMLElement} Toast element
   */
  createToastElement(options) {
    const { id, type, message, title, duration } = options;
    const direction = this.getAnimationDirection();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type} toast--entering-${direction}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('data-toast-id', id);
    toast.setAttribute('tabindex', '0');

    // Build toast HTML
    toast.innerHTML = `
      <div class="toast__icon">
        ${this.getIcon(type)}
      </div>
      <div class="toast__content">
        ${title ? `<h3 class="toast__title">${this.escapeHtml(title)}</h3>` : ''}
        <p class="toast__message">${this.escapeHtml(message)}</p>
      </div>
      <button class="toast__close" aria-label="Close notification">
        ${this.getCloseIcon()}
      </button>
      ${duration > 0 ? `
        <div class="toast__progress">
          <div class="toast__progress-bar" style="animation-duration: ${duration}ms;"></div>
        </div>
      ` : ''}
    `;

    // Add click handlers
    const closeButton = toast.querySelector('.toast__close');
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismissToast(id);
    });

    // Make entire toast clickable to dismiss
    toast.addEventListener('click', () => {
      this.dismissToast(id);
    });

    // Keyboard support
    toast.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        this.dismissToast(id);
      }
    });

    return toast;
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {Object} options - Additional options
   * @returns {number} Toast ID
   */
  show(message, type = 'info', options = {}) {
    const id = ++this.idCounter;
    const duration = options.duration !== undefined ? options.duration : 5000;
    const title = options.title || '';
    const position = options.position || this.position;

    // Update position if different
    if (position !== this.position) {
      this.setPosition(position);
    }

    // Remove oldest toast if max limit reached
    if (this.toasts.length >= this.maxToasts) {
      const oldestToast = this.toasts[0];
      this.dismissToast(oldestToast.id, false);
    }

    const toast = {
      id,
      type,
      message,
      title,
      duration,
      element: null,
      timeout: null
    };

    // Create and add toast element
    toast.element = this.createToastElement(toast);
    this.container.appendChild(toast.element);

    // Add to toasts array
    this.toasts.push(toast);

    // Update ARIA live region for screen readers
    this.announceToast(message, type);

    // Set auto-dismiss timeout
    if (duration > 0) {
      toast.timeout = setTimeout(() => {
        this.dismissToast(id);
      }, duration);
    }

    return id;
  }

  /**
   * Announce toast to screen readers
   * @param {string} message - Toast message
   * @param {string} type - Toast type
   */
  announceToast(message, type) {
    const typeLabel = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    }[type] || 'Notification';

    this.ariaLiveRegion.textContent = `${typeLabel}: ${message}`;

    // Clear after announcement
    setTimeout(() => {
      this.ariaLiveRegion.textContent = '';
    }, 1000);
  }

  /**
   * Dismiss a toast
   * @param {number} id - Toast ID
   * @param {boolean} animate - Whether to animate the dismissal
   */
  dismissToast(id, animate = true) {
    const toastIndex = this.toasts.findIndex(t => t.id === id);
    if (toastIndex === -1) return;

    const toast = this.toasts[toastIndex];

    // Clear timeout if exists
    if (toast.timeout) {
      clearTimeout(toast.timeout);
    }

    if (animate && toast.element) {
      const direction = this.getAnimationDirection();
      toast.element.classList.remove(`toast--entering-${direction}`);
      toast.element.classList.add(`toast--exiting-${direction}`);

      // Remove after animation
      setTimeout(() => {
        if (toast.element && toast.element.parentNode) {
          toast.element.parentNode.removeChild(toast.element);
        }
        this.toasts.splice(toastIndex, 1);
      }, 300);
    } else {
      // Remove immediately
      if (toast.element && toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
      }
      this.toasts.splice(toastIndex, 1);
    }
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    const toastIds = this.toasts.map(t => t.id);
    toastIds.forEach(id => this.dismissToast(id));
  }

  /**
   * Set toast container position
   * @param {string} position - Position (top-right, bottom-right, top-center, etc.)
   */
  setPosition(position) {
    this.position = position;
    if (this.container) {
      this.container.className = `toast-container toast-container--${position}`;
    }
  }

  /**
   * Set maximum number of toasts
   * @param {number} max - Maximum number of toasts
   */
  setMaxToasts(max) {
    this.maxToasts = max;
  }

  /**
   * Get all active toasts
   * @returns {Array} Array of toast objects
   */
  getToasts() {
    return [...this.toasts];
  }

  /**
   * Check if a toast exists
   * @param {number} id - Toast ID
   * @returns {boolean} Whether toast exists
   */
  hasToast(id) {
    return this.toasts.some(t => t.id === id);
  }
}

// Create global toast manager instance
const toastManager = new ToastManager();

/**
 * Convenience functions for showing toasts
 */

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number|Object} durationOrOptions - Duration in ms or options object
 * @returns {number} Toast ID
 */
function showToast(message, type = 'info', durationOrOptions = 5000) {
  const options = typeof durationOrOptions === 'number'
    ? { duration: durationOrOptions }
    : durationOrOptions;

  return toastManager.show(message, type, options);
}

/**
 * Show a success toast
 * @param {string} message - Toast message
 * @param {number|Object} durationOrOptions - Duration in ms or options object
 * @returns {number} Toast ID
 */
function showSuccess(message, durationOrOptions = 5000) {
  return showToast(message, 'success', durationOrOptions);
}

/**
 * Show an error toast
 * @param {string} message - Toast message
 * @param {number|Object} durationOrOptions - Duration in ms or options object
 * @returns {number} Toast ID
 */
function showError(message, durationOrOptions = 5000) {
  return showToast(message, 'error', durationOrOptions);
}

/**
 * Show a warning toast
 * @param {string} message - Toast message
 * @param {number|Object} durationOrOptions - Duration in ms or options object
 * @returns {number} Toast ID
 */
function showWarning(message, durationOrOptions = 5000) {
  return showToast(message, 'warning', durationOrOptions);
}

/**
 * Show an info toast
 * @param {string} message - Toast message
 * @param {number|Object} durationOrOptions - Duration in ms or options object
 * @returns {number} Toast ID
 */
function showInfo(message, durationOrOptions = 5000) {
  return showToast(message, 'info', durationOrOptions);
}

/**
 * Dismiss a specific toast
 * @param {number} id - Toast ID
 */
function dismissToast(id) {
  toastManager.dismissToast(id);
}

/**
 * Dismiss all toasts
 */
function dismissAllToasts() {
  toastManager.dismissAll();
}

/**
 * Set toast position
 * @param {string} position - Position (top-right, bottom-right, top-center, etc.)
 */
function setToastPosition(position) {
  toastManager.setPosition(position);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ToastManager,
    toastManager,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAllToasts,
    setToastPosition
  };
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.ToastManager = ToastManager;
  window.toastManager = toastManager;
  window.showToast = showToast;
  window.showSuccess = showSuccess;
  window.showError = showError;
  window.showWarning = showWarning;
  window.showInfo = showInfo;
  window.dismissToast = dismissToast;
  window.dismissAllToasts = dismissAllToasts;
  window.setToastPosition = setToastPosition;
}
