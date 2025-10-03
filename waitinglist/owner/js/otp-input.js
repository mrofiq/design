/**
 * OTP INPUT COMPONENT
 * Handles OTP input boxes with auto-advance, paste support, and keyboard navigation
 */

class OTPInput {
  /**
   * Create OTP input component
   * @param {HTMLElement|string} container - Container element or selector
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) {
      throw new Error('OTP container not found');
    }

    this.length = options.length || 6;
    this.value = '';
    this.inputs = [];
    this.onComplete = options.onComplete || null;
    this.onChange = options.onChange || null;

    this.init();
  }

  /**
   * Initialize OTP input boxes
   */
  init() {
    // Create input boxes
    for (let i = 0; i < this.length; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'numeric';
      input.pattern = '[0-9]';
      input.maxLength = 1;
      input.className = 'otp-input';
      input.style.cssText = `
        width: 64px;
        height: 64px;
        font-size: 32px;
        font-weight: 700;
        text-align: center;
        border: 2px solid var(--color-neutral-200);
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        font-family: var(--font-family);
      `;

      input.setAttribute('aria-label', `Digit ${i + 1}`);
      input.setAttribute('data-index', i);

      // Event listeners
      input.addEventListener('input', (e) => this.handleInput(i, e));
      input.addEventListener('keydown', (e) => this.handleKeyDown(i, e));
      input.addEventListener('focus', (e) => this.handleFocus(i, e));
      input.addEventListener('paste', (e) => this.handlePaste(e));

      this.inputs.push(input);
      this.container.appendChild(input);
    }

    // Focus first input
    this.inputs[0].focus();

    // Add responsive styling
    this.addResponsiveStyles();
  }

  /**
   * Add responsive styles for mobile
   */
  addResponsiveStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .otp-input {
          width: 48px !important;
          height: 48px !important;
          font-size: 24px !important;
        }
      }

      .otp-input:focus {
        outline: none;
        border-color: var(--color-primary-600);
        box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
      }

      .otp-input.error {
        border-color: var(--color-error);
        animation: shake 300ms ease-in-out;
      }

      .otp-input.success {
        border-color: var(--color-success);
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Handle input event
   * @param {number} index - Input index
   * @param {Event} event - Input event
   */
  handleInput(index, event) {
    const input = this.inputs[index];
    let value = input.value;

    // Only allow digits
    value = value.replace(/\D/g, '');

    if (value.length > 1) {
      value = value.charAt(0);
    }

    input.value = value;

    // Update internal value
    this.updateValue();

    // Auto-advance to next input
    if (value && index < this.length - 1) {
      this.inputs[index + 1].focus();
    }

    // Call onChange callback
    if (this.onChange) {
      this.onChange(this.value);
    }

    // Check if complete
    if (this.value.length === this.length && this.onComplete) {
      this.onComplete(this.value);
    }
  }

  /**
   * Handle keydown event
   * @param {number} index - Input index
   * @param {Event} event - Keydown event
   */
  handleKeyDown(index, event) {
    const input = this.inputs[index];

    // Backspace: clear current and move to previous
    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        this.inputs[index - 1].focus();
        this.inputs[index - 1].value = '';
        this.updateValue();
      } else if (input.value) {
        input.value = '';
        this.updateValue();
      }
    }

    // Arrow left: move to previous
    if (event.key === 'ArrowLeft' && index > 0) {
      this.inputs[index - 1].focus();
      this.inputs[index - 1].select();
    }

    // Arrow right: move to next
    if (event.key === 'ArrowRight' && index < this.length - 1) {
      this.inputs[index + 1].focus();
      this.inputs[index + 1].select();
    }

    // Prevent non-numeric input
    if (event.key.length === 1 && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  /**
   * Handle focus event
   * @param {number} index - Input index
   * @param {Event} event - Focus event
   */
  handleFocus(index, event) {
    // Select text on focus for easy replacement
    event.target.select();
  }

  /**
   * Handle paste event
   * @param {Event} event - Paste event
   */
  handlePaste(event) {
    event.preventDefault();

    const pasteData = event.clipboardData.getData('text');
    const digits = pasteData.replace(/\D/g, '').slice(0, this.length);

    if (digits.length > 0) {
      // Fill inputs with pasted digits
      for (let i = 0; i < this.length; i++) {
        this.inputs[i].value = digits[i] || '';
      }

      // Focus last filled input or first empty input
      const focusIndex = Math.min(digits.length, this.length - 1);
      this.inputs[focusIndex].focus();

      // Update value
      this.updateValue();

      // Call onChange callback
      if (this.onChange) {
        this.onChange(this.value);
      }

      // Check if complete
      if (this.value.length === this.length && this.onComplete) {
        this.onComplete(this.value);
      }
    }
  }

  /**
   * Update internal value from inputs
   */
  updateValue() {
    this.value = this.inputs.map(input => input.value).join('');
  }

  /**
   * Get current OTP value
   * @returns {string} Current OTP value
   */
  getValue() {
    return this.value;
  }

  /**
   * Set OTP value programmatically
   * @param {string} value - OTP value to set
   */
  setValue(value) {
    const digits = value.replace(/\D/g, '').slice(0, this.length);

    for (let i = 0; i < this.length; i++) {
      this.inputs[i].value = digits[i] || '';
    }

    this.updateValue();

    // Focus last filled input
    const focusIndex = Math.min(digits.length, this.length - 1);
    this.inputs[focusIndex].focus();
  }

  /**
   * Clear all inputs
   */
  clear() {
    this.inputs.forEach(input => {
      input.value = '';
      input.classList.remove('error', 'success');
    });
    this.value = '';
    this.inputs[0].focus();

    if (this.onChange) {
      this.onChange('');
    }
  }

  /**
   * Disable all inputs
   */
  disable() {
    this.inputs.forEach(input => {
      input.disabled = true;
      input.style.opacity = '0.5';
      input.style.cursor = 'not-allowed';
    });
  }

  /**
   * Enable all inputs
   */
  enable() {
    this.inputs.forEach(input => {
      input.disabled = false;
      input.style.opacity = '';
      input.style.cursor = '';
    });
  }

  /**
   * Show error state
   */
  showError() {
    this.inputs.forEach(input => {
      input.classList.add('error');
    });

    // Shake animation
    this.container.style.animation = 'shake 300ms ease-in-out';

    setTimeout(() => {
      this.container.style.animation = '';
      this.clear();
    }, 1000);
  }

  /**
   * Show success state
   */
  showSuccess() {
    this.inputs.forEach(input => {
      input.classList.add('success');
      input.classList.remove('error');
    });
  }

  /**
   * Reset to normal state
   */
  reset() {
    this.inputs.forEach(input => {
      input.classList.remove('error', 'success');
    });
  }
}

// ============================================
// TIMER COUNTDOWN
// ============================================

/**
 * Start countdown timer
 * @param {number} duration - Duration in seconds
 * @param {Function} onTick - Callback on each tick (receives remaining seconds)
 * @param {Function} onComplete - Callback when timer completes
 * @returns {Object} Timer control object with stop() method
 */
function startTimer(duration, onTick, onComplete) {
  let remaining = duration;

  const interval = setInterval(() => {
    remaining--;

    if (onTick) {
      onTick(remaining);
    }

    if (remaining <= 0) {
      clearInterval(interval);
      if (onComplete) {
        onComplete();
      }
    }
  }, 1000);

  // Initial tick
  if (onTick) {
    onTick(remaining);
  }

  return {
    stop: () => clearInterval(interval),
    getRemaining: () => remaining
  };
}

/**
 * Format seconds to MM:SS
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time string
 */
function formatTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ============================================
// OTP VERIFICATION MOCK API
// ============================================

/**
 * Mock API call to verify OTP
 * @param {string} otp - OTP to verify
 * @returns {Promise<Object>} Verification result
 */
async function verifyOTP(otp) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock validation (accept "123456" for demo)
  if (otp === '123456') {
    return {
      success: true,
      message: 'Verifikasi berhasil'
    };
  } else {
    return {
      success: false,
      message: 'Kode OTP salah. Silakan coba lagi.',
      attemptsLeft: 2
    };
  }
}

/**
 * Mock API call to resend OTP
 * @returns {Promise<Object>} Resend result
 */
async function resendOTP() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    message: 'Kode OTP baru telah dikirim'
  };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    OTPInput,
    startTimer,
    formatTimerDisplay,
    verifyOTP,
    resendOTP
  };
}
