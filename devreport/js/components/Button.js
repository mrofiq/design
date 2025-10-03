/**
 * Developer Report Dashboard - Button Component
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * Handles button interactions, loading states, ripple effects, and accessibility
 */

class Button {
  /**
   * Initialize button component
   * @param {HTMLElement|string} element - Button element or selector
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (!this.element) {
      console.error('Button element not found');
      return;
    }

    this.options = {
      ripple: true,
      loadingText: 'Loading...',
      disableOnClick: false,
      preventDefault: false,
      ...options
    };

    this.isLoading = false;
    this.isDisabled = false;
    this.originalContent = this.element.innerHTML;

    this.init();
  }

  /**
   * Initialize button functionality
   */
  init() {
    // Add ripple effect if enabled
    if (this.options.ripple && !this.element.classList.contains('btn-ripple')) {
      this.element.classList.add('btn-ripple');
    }

    // Set up event listeners
    this.setupEventListeners();

    // Set initial ARIA attributes
    this.setupAccessibility();
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Click handler
    this.element.addEventListener('click', this.handleClick.bind(this));

    // Keyboard handler (Enter and Space)
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));

    // Ripple effect handler
    if (this.options.ripple) {
      this.element.addEventListener('mousedown', this.createRipple.bind(this));
    }
  }

  /**
   * Set up accessibility attributes
   */
  setupAccessibility() {
    // Ensure button has proper role
    if (this.element.tagName !== 'BUTTON' && !this.element.hasAttribute('role')) {
      this.element.setAttribute('role', 'button');
    }

    // Ensure button is keyboard accessible
    if (this.element.tagName !== 'BUTTON' && !this.element.hasAttribute('tabindex')) {
      this.element.setAttribute('tabindex', '0');
    }

    // Set initial disabled state
    if (this.element.disabled || this.element.classList.contains('is-disabled')) {
      this.setDisabled(true);
    }
  }

  /**
   * Handle click events
   * @param {Event} event - Click event
   */
  handleClick(event) {
    // Prevent default if specified
    if (this.options.preventDefault) {
      event.preventDefault();
    }

    // Don't trigger if disabled or loading
    if (this.isDisabled || this.isLoading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Disable on click if specified
    if (this.options.disableOnClick) {
      this.setDisabled(true);
    }

    // Trigger custom event
    this.trigger('button:click', { originalEvent: event });
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} event - Keyboard event
   */
  handleKeydown(event) {
    // Handle Enter and Space keys
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      if (!this.isDisabled && !this.isLoading) {
        this.element.click();
      }
    }
  }

  /**
   * Create ripple effect
   * @param {MouseEvent} event - Mouse event
   */
  createRipple(event) {
    // Don't create ripple if disabled or loading
    if (this.isDisabled || this.isLoading) {
      return;
    }

    // Remove existing ripples
    const existingRipple = this.element.querySelector('.ripple-effect');
    if (existingRipple) {
      existingRipple.remove();
    }

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');

    // Get button dimensions
    const rect = this.element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    // Position ripple at click location
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    `;

    this.element.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Set loading state
   * @param {boolean} loading - Whether button is loading
   * @param {string} text - Optional loading text
   */
  setLoading(loading, text = null) {
    this.isLoading = loading;

    if (loading) {
      // Save original content
      this.originalContent = this.element.innerHTML;

      // Add loading class and disable
      this.element.classList.add('is-loading');
      this.element.disabled = true;
      this.element.setAttribute('aria-busy', 'true');

      // Update text if provided
      if (text) {
        this.element.innerHTML = `
          <span class="btn-loading-text">
            <span class="spinner"></span>
            <span>${text}</span>
          </span>
        `;
      }

      // Trigger custom event
      this.trigger('button:loading:start');
    } else {
      // Remove loading state
      this.element.classList.remove('is-loading');
      this.element.disabled = this.isDisabled;
      this.element.removeAttribute('aria-busy');

      // Restore original content
      this.element.innerHTML = this.originalContent;

      // Trigger custom event
      this.trigger('button:loading:end');
    }
  }

  /**
   * Set disabled state
   * @param {boolean} disabled - Whether button is disabled
   */
  setDisabled(disabled) {
    this.isDisabled = disabled;

    if (disabled) {
      this.element.classList.add('is-disabled');
      this.element.disabled = true;
      this.element.setAttribute('aria-disabled', 'true');

      // Set tabindex to -1 for non-button elements
      if (this.element.tagName !== 'BUTTON') {
        this.element.setAttribute('tabindex', '-1');
      }
    } else {
      this.element.classList.remove('is-disabled');
      this.element.disabled = false;
      this.element.removeAttribute('aria-disabled');

      // Restore tabindex for non-button elements
      if (this.element.tagName !== 'BUTTON') {
        this.element.setAttribute('tabindex', '0');
      }
    }

    // Trigger custom event
    this.trigger('button:disabled:change', { disabled });
  }

  /**
   * Enable button
   */
  enable() {
    this.setDisabled(false);
  }

  /**
   * Disable button
   */
  disable() {
    this.setDisabled(true);
  }

  /**
   * Start loading state
   * @param {string} text - Optional loading text
   */
  startLoading(text = null) {
    this.setLoading(true, text || this.options.loadingText);
  }

  /**
   * Stop loading state
   */
  stopLoading() {
    this.setLoading(false);
  }

  /**
   * Set button text
   * @param {string} text - New button text
   */
  setText(text) {
    if (!this.isLoading) {
      this.element.textContent = text;
      this.originalContent = this.element.innerHTML;
    }
  }

  /**
   * Add icon to button
   * @param {string} iconHTML - Icon HTML or SVG
   * @param {string} position - Icon position ('left' or 'right')
   */
  addIcon(iconHTML, position = 'left') {
    const currentText = this.element.textContent.trim();

    if (position === 'left') {
      this.element.innerHTML = `${iconHTML}<span>${currentText}</span>`;
    } else {
      this.element.innerHTML = `<span>${currentText}</span>${iconHTML}`;
    }

    this.originalContent = this.element.innerHTML;
  }

  /**
   * Trigger custom event
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail data
   */
  trigger(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail
    });

    this.element.dispatchEvent(event);
  }

  /**
   * Add event listener wrapper
   * @param {string} eventName - Event name
   * @param {Function} callback - Event callback
   */
  on(eventName, callback) {
    this.element.addEventListener(eventName, callback);
  }

  /**
   * Remove event listener wrapper
   * @param {string} eventName - Event name
   * @param {Function} callback - Event callback
   */
  off(eventName, callback) {
    this.element.removeEventListener(eventName, callback);
  }

  /**
   * Destroy button component
   */
  destroy() {
    // Remove event listeners
    this.element.removeEventListener('click', this.handleClick);
    this.element.removeEventListener('keydown', this.handleKeydown);
    this.element.removeEventListener('mousedown', this.createRipple);

    // Remove ripple class
    this.element.classList.remove('btn-ripple');

    // Remove loading state
    if (this.isLoading) {
      this.setLoading(false);
    }

    // Trigger destroy event
    this.trigger('button:destroy');
  }
}

/**
 * ButtonGroup class for managing button groups
 */
class ButtonGroup {
  /**
   * Initialize button group
   * @param {HTMLElement|string} element - Button group element or selector
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = typeof element === 'string'
      ? document.querySelector(element)
      : element;

    if (!this.element) {
      console.error('Button group element not found');
      return;
    }

    this.options = {
      selectable: false,
      multiSelect: false,
      ...options
    };

    this.buttons = [];
    this.selectedButtons = [];

    this.init();
  }

  /**
   * Initialize button group
   */
  init() {
    // Get all buttons in group
    const buttonElements = this.element.querySelectorAll('.btn');

    buttonElements.forEach(btn => {
      const button = new Button(btn);
      this.buttons.push(button);

      // Set up selection if enabled
      if (this.options.selectable) {
        btn.addEventListener('click', () => this.handleSelection(button));
      }
    });
  }

  /**
   * Handle button selection
   * @param {Button} button - Button instance
   */
  handleSelection(button) {
    if (!this.options.multiSelect) {
      // Deselect all other buttons
      this.buttons.forEach(btn => {
        if (btn !== button) {
          btn.element.classList.remove('is-selected');
          btn.element.setAttribute('aria-pressed', 'false');
        }
      });
      this.selectedButtons = [];
    }

    // Toggle selection
    const isSelected = button.element.classList.toggle('is-selected');
    button.element.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

    if (isSelected) {
      this.selectedButtons.push(button);
    } else {
      const index = this.selectedButtons.indexOf(button);
      if (index > -1) {
        this.selectedButtons.splice(index, 1);
      }
    }

    // Trigger selection event
    const event = new CustomEvent('buttongroup:selection:change', {
      bubbles: true,
      detail: {
        selected: this.selectedButtons,
        button
      }
    });

    this.element.dispatchEvent(event);
  }

  /**
   * Get selected buttons
   * @returns {Array} Selected button instances
   */
  getSelected() {
    return this.selectedButtons;
  }

  /**
   * Destroy button group
   */
  destroy() {
    this.buttons.forEach(btn => btn.destroy());
    this.buttons = [];
    this.selectedButtons = [];
  }
}

/**
 * Add ripple animation CSS if not already present
 */
if (!document.querySelector('#ripple-animation-styles')) {
  const style = document.createElement('style');
  style.id = 'ripple-animation-styles';
  style.textContent = `
    @keyframes ripple-animation {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Auto-initialize buttons with data-button attribute
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-button]').forEach(element => {
    const options = element.dataset.buttonOptions
      ? JSON.parse(element.dataset.buttonOptions)
      : {};

    new Button(element, options);
  });

  // Auto-initialize button groups
  document.querySelectorAll('[data-button-group]').forEach(element => {
    const options = element.dataset.buttonGroupOptions
      ? JSON.parse(element.dataset.buttonGroupOptions)
      : {};

    new ButtonGroup(element, options);
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Button, ButtonGroup };
}

// Export for ES6 modules
if (typeof window !== 'undefined') {
  window.Button = Button;
  window.ButtonGroup = ButtonGroup;
}
