/**
 * Developer Report Dashboard - Modal Component
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * Accessible modal dialog with focus management, keyboard support, and stacking
 */

class Modal {
  constructor(options = {}) {
    // Configuration
    this.id = options.id || `modal-${Date.now()}`;
    this.size = options.size || 'md'; // sm, md, lg, xl, full
    this.variant = options.variant || null; // confirm, alert-success, alert-warning, alert-error, alert-info
    this.closeOnBackdrop = options.closeOnBackdrop !== false;
    this.closeOnEscape = options.closeOnEscape !== false;
    this.preventBodyScroll = options.preventBodyScroll !== false;
    this.onOpen = options.onOpen || null;
    this.onClose = options.onClose || null;
    this.onBeforeClose = options.onBeforeClose || null;

    // State
    this.isOpen = false;
    this.backdropElement = null;
    this.modalElement = null;
    this.focusedElementBeforeOpen = null;
    this.focusableElements = [];
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;

    // Bind methods
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    this.handleFocusTrap = this.handleFocusTrap.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);

    // Initialize
    this.init();
  }

  /**
   * Initialize modal
   */
  init() {
    this.create();
    this.attachEventListeners();
  }

  /**
   * Create modal DOM structure
   */
  create() {
    // Create backdrop
    this.backdropElement = document.createElement('div');
    this.backdropElement.className = 'modal-backdrop';
    this.backdropElement.setAttribute('data-modal-id', this.id);

    // Create modal
    this.modalElement = document.createElement('div');
    this.modalElement.className = `modal modal-${this.size}`;
    if (this.variant) {
      this.modalElement.classList.add(`modal-${this.variant}`);
    }
    this.modalElement.setAttribute('role', 'dialog');
    this.modalElement.setAttribute('aria-modal', 'true');
    this.modalElement.setAttribute('aria-labelledby', `${this.id}-title`);

    // Append modal to backdrop
    this.backdropElement.appendChild(this.modalElement);
  }

  /**
   * Set modal content
   */
  setContent(content) {
    if (typeof content === 'string') {
      this.modalElement.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      this.modalElement.innerHTML = '';
      this.modalElement.appendChild(content);
    } else if (content.title || content.body || content.footer) {
      this.modalElement.innerHTML = this.buildContent(content);
    }

    // Find and setup close buttons
    this.setupCloseButtons();

    // Update focusable elements
    this.updateFocusableElements();
  }

  /**
   * Build content from object
   */
  buildContent({ title, subtitle, body, footer, showClose = true }) {
    let html = '';

    // Header
    if (title || showClose) {
      html += '<div class="modal-header">';
      if (title) {
        html += `<div>`;
        html += `<h2 class="modal-title" id="${this.id}-title">${title}</h2>`;
        if (subtitle) {
          html += `<p class="modal-subtitle">${subtitle}</p>`;
        }
        html += `</div>`;
      }
      if (showClose) {
        html += `
          <button type="button" class="modal-close" data-modal-close aria-label="Close modal">
            <span class="modal-close-text">Close</span>
          </button>
        `;
      }
      html += '</div>';
    }

    // Body
    if (body) {
      html += `<div class="modal-body">${body}</div>`;
    }

    // Footer
    if (footer) {
      html += `<div class="modal-footer">${footer}</div>`;
    }

    return html;
  }

  /**
   * Setup close button event listeners
   */
  setupCloseButtons() {
    const closeButtons = this.modalElement.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(button => {
      button.addEventListener('click', this.handleCloseClick);
    });
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    if (this.closeOnBackdrop) {
      this.backdropElement.addEventListener('click', this.handleBackdropClick);
    }
  }

  /**
   * Open modal
   */
  open() {
    if (this.isOpen) return;

    // Store currently focused element
    this.focusedElementBeforeOpen = document.activeElement;

    // Add to DOM
    document.body.appendChild(this.backdropElement);

    // Get modal index for stacking
    const modalIndex = ModalManager.getModalCount();
    this.backdropElement.setAttribute('data-modal-index', modalIndex);

    // Prevent body scroll
    if (this.preventBodyScroll) {
      this.lockBodyScroll();
    }

    // Add keyboard listeners
    if (this.closeOnEscape) {
      document.addEventListener('keydown', this.handleEscapeKey);
    }
    document.addEventListener('keydown', this.handleFocusTrap);

    // Register with modal manager
    ModalManager.register(this);

    // Set state
    this.isOpen = true;

    // Update focusable elements
    this.updateFocusableElements();

    // Focus first element
    requestAnimationFrame(() => {
      if (this.firstFocusableElement) {
        this.firstFocusableElement.focus();
      } else {
        this.modalElement.focus();
      }
    });

    // Callback
    if (this.onOpen) {
      this.onOpen(this);
    }
  }

  /**
   * Close modal
   */
  async close() {
    if (!this.isOpen) return;

    // Before close callback (can prevent closing)
    if (this.onBeforeClose) {
      const shouldClose = await this.onBeforeClose(this);
      if (shouldClose === false) return;
    }

    // Add closing class for animation
    this.backdropElement.classList.add('modal-closing');

    // Wait for animation
    setTimeout(() => {
      // Remove from DOM
      if (this.backdropElement.parentNode) {
        document.body.removeChild(this.backdropElement);
      }

      // Restore body scroll
      if (this.preventBodyScroll) {
        this.unlockBodyScroll();
      }

      // Remove keyboard listeners
      document.removeEventListener('keydown', this.handleEscapeKey);
      document.removeEventListener('keydown', this.handleFocusTrap);

      // Unregister from modal manager
      ModalManager.unregister(this);

      // Set state
      this.isOpen = false;

      // Restore focus
      if (this.focusedElementBeforeOpen && this.focusedElementBeforeOpen.focus) {
        this.focusedElementBeforeOpen.focus();
      }

      // Remove closing class
      this.backdropElement.classList.remove('modal-closing');

      // Callback
      if (this.onClose) {
        this.onClose(this);
      }
    }, 200); // Match animation duration
  }

  /**
   * Handle backdrop click
   */
  handleBackdropClick(event) {
    if (event.target === this.backdropElement) {
      this.close();
    }
  }

  /**
   * Handle escape key
   */
  handleEscapeKey(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
      // Only close if this is the top-most modal
      if (ModalManager.getTopModal() === this) {
        this.close();
      }
    }
  }

  /**
   * Handle focus trap
   */
  handleFocusTrap(event) {
    // Only trap if this is the top-most modal
    if (ModalManager.getTopModal() !== this) return;

    if (event.key !== 'Tab' && event.keyCode !== 9) return;

    if (!this.firstFocusableElement || !this.lastFocusableElement) return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        event.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        event.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  }

  /**
   * Handle close button click
   */
  handleCloseClick(event) {
    event.preventDefault();
    this.close();
  }

  /**
   * Update focusable elements
   */
  updateFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    this.focusableElements = Array.from(
      this.modalElement.querySelectorAll(focusableSelectors.join(', '))
    );

    this.firstFocusableElement = this.focusableElements[0] || null;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null;

    // Make modal focusable if no focusable elements
    if (!this.firstFocusableElement) {
      this.modalElement.setAttribute('tabindex', '-1');
    }
  }

  /**
   * Lock body scroll
   */
  lockBodyScroll() {
    // Get scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Store for restoration
    this.originalBodyOverflow = document.body.style.overflow;
    this.originalBodyPaddingRight = document.body.style.paddingRight;

    // Set CSS variable for scrollbar width
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    // Lock scroll
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  /**
   * Unlock body scroll
   */
  unlockBodyScroll() {
    // Only unlock if no other modals are open
    if (ModalManager.getModalCount() === 0) {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = this.originalBodyOverflow || '';
      document.body.style.paddingRight = this.originalBodyPaddingRight || '';
      document.documentElement.style.removeProperty('--scrollbar-width');
    }
  }

  /**
   * Destroy modal
   */
  destroy() {
    if (this.isOpen) {
      this.close();
    }

    // Remove event listeners
    if (this.closeOnBackdrop) {
      this.backdropElement.removeEventListener('click', this.handleBackdropClick);
    }

    const closeButtons = this.modalElement.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(button => {
      button.removeEventListener('click', this.handleCloseClick);
    });
  }
}

/**
 * Modal Manager
 * Manages multiple modals (stacking, z-index, focus)
 */
class ModalManager {
  static modals = [];

  static register(modal) {
    this.modals.push(modal);
  }

  static unregister(modal) {
    this.modals = this.modals.filter(m => m !== modal);
  }

  static getModalCount() {
    return this.modals.length;
  }

  static getTopModal() {
    return this.modals[this.modals.length - 1] || null;
  }

  static closeAll() {
    [...this.modals].reverse().forEach(modal => modal.close());
  }
}

/**
 * Utility functions for common modal patterns
 */
const ModalHelpers = {
  /**
   * Show confirmation dialog
   */
  confirm(options = {}) {
    return new Promise((resolve) => {
      const modal = new Modal({
        size: options.size || 'sm',
        variant: 'confirm',
        closeOnBackdrop: options.closeOnBackdrop !== false,
        closeOnEscape: options.closeOnEscape !== false
      });

      modal.setContent({
        title: options.title || 'Confirm',
        body: options.message || 'Are you sure?',
        footer: `
          <button type="button" class="btn btn-secondary" data-modal-close>
            ${options.cancelText || 'Cancel'}
          </button>
          <button type="button" class="btn btn-primary" data-confirm-action>
            ${options.confirmText || 'Confirm'}
          </button>
        `,
        showClose: true
      });

      // Handle confirm button
      const confirmButton = modal.modalElement.querySelector('[data-confirm-action]');
      confirmButton.addEventListener('click', () => {
        resolve(true);
        modal.close();
      });

      // Handle cancel/close
      modal.onClose = () => {
        resolve(false);
      };

      modal.open();
    });
  },

  /**
   * Show alert dialog
   */
  alert(options = {}) {
    return new Promise((resolve) => {
      const type = options.type || 'info'; // success, warning, error, info
      const modal = new Modal({
        size: options.size || 'sm',
        variant: `alert-${type}`,
        closeOnBackdrop: options.closeOnBackdrop !== false,
        closeOnEscape: options.closeOnEscape !== false
      });

      modal.setContent({
        title: options.title || 'Alert',
        body: options.message || '',
        footer: `
          <button type="button" class="btn btn-primary" data-modal-close>
            ${options.okText || 'OK'}
          </button>
        `,
        showClose: true
      });

      modal.onClose = () => {
        resolve(true);
      };

      modal.open();
    });
  },

  /**
   * Show success alert
   */
  success(message, title = 'Success') {
    return this.alert({ type: 'success', title, message });
  },

  /**
   * Show warning alert
   */
  warning(message, title = 'Warning') {
    return this.alert({ type: 'warning', title, message });
  },

  /**
   * Show error alert
   */
  error(message, title = 'Error') {
    return this.alert({ type: 'error', title, message });
  },

  /**
   * Show info alert
   */
  info(message, title = 'Information') {
    return this.alert({ type: 'info', title, message });
  }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Modal, ModalManager, ModalHelpers };
}
