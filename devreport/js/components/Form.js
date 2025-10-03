/**
 * Developer Report Dashboard - Form Component
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * This module handles all form interactions including:
 * - Form validation logic (real-time and on submit)
 * - Character counter for textarea
 * - Custom select dropdown behavior
 * - Toggle switch interactions
 * - Form submission handling
 * - Input masking and formatting
 */

class FormValidator {
  constructor(formElement, options = {}) {
    this.form = formElement;
    this.options = {
      validateOnBlur: true,
      validateOnInput: false,
      showSuccessState: true,
      scrollToError: true,
      ...options
    };

    this.fields = new Map();
    this.errors = new Map();

    this.init();
  }

  /**
   * Initialize form validation
   */
  init() {
    this.setupFields();
    this.attachEventListeners();
  }

  /**
   * Setup form fields and validation rules
   */
  setupFields() {
    // Get all inputs with validation attributes
    const inputs = this.form.querySelectorAll('[data-validate]');

    inputs.forEach(input => {
      const rules = this.parseValidationRules(input);
      this.fields.set(input, rules);
    });
  }

  /**
   * Parse validation rules from data attributes
   */
  parseValidationRules(input) {
    const rules = {
      required: input.hasAttribute('required'),
      pattern: input.getAttribute('pattern'),
      minLength: parseInt(input.getAttribute('minlength')) || null,
      maxLength: parseInt(input.getAttribute('maxlength')) || null,
      min: parseFloat(input.getAttribute('min')) || null,
      max: parseFloat(input.getAttribute('max')) || null,
      email: input.type === 'email',
      url: input.type === 'url',
      number: input.type === 'number',
      custom: input.getAttribute('data-validate')
    };

    return rules;
  }

  /**
   * Attach event listeners to form and fields
   */
  attachEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Field validation
    this.fields.forEach((rules, field) => {
      if (this.options.validateOnBlur) {
        field.addEventListener('blur', () => this.validateField(field));
      }

      if (this.options.validateOnInput) {
        field.addEventListener('input', () => this.validateField(field));
      }

      // Real-time validation for specific fields
      if (field.hasAttribute('data-validate-realtime')) {
        field.addEventListener('input', () => this.validateField(field));
      }
    });
  }

  /**
   * Handle form submission
   */
  handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const isValid = this.validateAll();

    if (isValid) {
      // Get form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // Trigger custom submit event
      const submitEvent = new CustomEvent('formValidated', {
        detail: { data, form: this.form }
      });
      this.form.dispatchEvent(submitEvent);

      return data;
    } else {
      // Scroll to first error
      if (this.options.scrollToError) {
        this.scrollToFirstError();
      }

      return false;
    }
  }

  /**
   * Validate all form fields
   */
  validateAll() {
    let isValid = true;

    this.fields.forEach((rules, field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate a single field
   */
  validateField(field) {
    const rules = this.fields.get(field);
    const value = field.value.trim();
    const errors = [];

    // Required validation
    if (rules.required && !value) {
      errors.push('This field is required');
    }

    // Only validate other rules if field has value
    if (value) {
      // Pattern validation
      if (rules.pattern) {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          errors.push('Invalid format');
        }
      }

      // Min length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`Minimum ${rules.minLength} characters required`);
      }

      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`Maximum ${rules.maxLength} characters allowed`);
      }

      // Email validation
      if (rules.email && !this.isValidEmail(value)) {
        errors.push('Please enter a valid email address');
      }

      // URL validation
      if (rules.url && !this.isValidUrl(value)) {
        errors.push('Please enter a valid URL');
      }

      // Number validation
      if (rules.number) {
        const num = parseFloat(value);
        if (isNaN(num)) {
          errors.push('Please enter a valid number');
        } else {
          if (rules.min !== null && num < rules.min) {
            errors.push(`Minimum value is ${rules.min}`);
          }
          if (rules.max !== null && num > rules.max) {
            errors.push(`Maximum value is ${rules.max}`);
          }
        }
      }

      // Custom validation
      if (rules.custom && this[rules.custom]) {
        const customError = this[rules.custom](value, field);
        if (customError) {
          errors.push(customError);
        }
      }
    }

    // Update field state
    if (errors.length > 0) {
      this.showError(field, errors[0]);
      return false;
    } else {
      this.showSuccess(field);
      return true;
    }
  }

  /**
   * Show error message for field
   */
  showError(field, message) {
    const formField = field.closest('.form-field');
    if (!formField) return;

    // Remove success state
    formField.classList.remove('form-field--success');

    // Add error state
    formField.classList.add('form-field--error');

    // Store error
    this.errors.set(field, message);

    // Show error message
    let errorElement = formField.querySelector('.form-error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error-message';
      errorElement.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;

    // Update ARIA attributes
    field.setAttribute('aria-invalid', 'true');
    if (!field.hasAttribute('aria-describedby')) {
      const errorId = `error-${Math.random().toString(36).substr(2, 9)}`;
      errorElement.id = errorId;
      field.setAttribute('aria-describedby', errorId);
    }
  }

  /**
   * Show success state for field
   */
  showSuccess(field) {
    if (!this.options.showSuccessState) {
      this.clearError(field);
      return;
    }

    const formField = field.closest('.form-field');
    if (!formField) return;

    // Remove error state
    formField.classList.remove('form-field--error');

    // Add success state
    formField.classList.add('form-field--success');

    // Remove error message
    const errorElement = formField.querySelector('.form-error-message');
    if (errorElement) {
      errorElement.remove();
    }

    // Remove error from map
    this.errors.delete(field);

    // Update ARIA attributes
    field.setAttribute('aria-invalid', 'false');
    field.removeAttribute('aria-describedby');
  }

  /**
   * Clear error state for field
   */
  clearError(field) {
    const formField = field.closest('.form-field');
    if (!formField) return;

    formField.classList.remove('form-field--error', 'form-field--success');

    const errorElement = formField.querySelector('.form-error-message');
    if (errorElement) {
      errorElement.remove();
    }

    this.errors.delete(field);
    field.setAttribute('aria-invalid', 'false');
    field.removeAttribute('aria-describedby');
  }

  /**
   * Scroll to first error
   */
  scrollToFirstError() {
    const firstError = this.form.querySelector('.form-field--error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = firstError.querySelector('input, textarea, select');
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    }
  }

  /**
   * Validation helpers
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reset form validation
   */
  reset() {
    this.errors.clear();
    this.fields.forEach((rules, field) => {
      this.clearError(field);
    });
  }

  /**
   * Destroy validator
   */
  destroy() {
    this.fields.clear();
    this.errors.clear();
  }
}


class CharacterCounter {
  constructor(textarea, options = {}) {
    this.textarea = textarea;
    this.options = {
      maxLength: parseInt(textarea.getAttribute('maxlength')) || null,
      warningThreshold: 0.8, // Show warning at 80%
      showRemaining: true,
      ...options
    };

    this.counter = null;
    this.init();
  }

  /**
   * Initialize character counter
   */
  init() {
    this.createCounter();
    this.attachEventListeners();
    this.updateCounter();
  }

  /**
   * Create counter element
   */
  createCounter() {
    const wrapper = this.textarea.closest('.form-textarea-wrapper') ||
                    this.wrapTextarea();

    this.counter = document.createElement('div');
    this.counter.className = 'form-textarea-counter';
    this.counter.setAttribute('aria-live', 'polite');
    this.counter.setAttribute('aria-atomic', 'true');

    wrapper.appendChild(this.counter);
  }

  /**
   * Wrap textarea if not already wrapped
   */
  wrapTextarea() {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-textarea-wrapper';
    this.textarea.parentNode.insertBefore(wrapper, this.textarea);
    wrapper.appendChild(this.textarea);
    return wrapper;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    this.textarea.addEventListener('input', () => this.updateCounter());
    this.textarea.addEventListener('paste', () => {
      setTimeout(() => this.updateCounter(), 0);
    });
  }

  /**
   * Update counter display
   */
  updateCounter() {
    const currentLength = this.textarea.value.length;
    const maxLength = this.options.maxLength;

    let counterText = `${currentLength} character${currentLength !== 1 ? 's' : ''}`;

    if (maxLength) {
      if (this.options.showRemaining) {
        const remaining = maxLength - currentLength;
        counterText = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`;
      } else {
        counterText += ` / ${maxLength}`;
      }

      // Update counter class based on threshold
      const percentage = currentLength / maxLength;

      this.counter.classList.remove('form-textarea-counter--warning', 'form-textarea-counter--error');

      if (percentage >= 1) {
        this.counter.classList.add('form-textarea-counter--error');
      } else if (percentage >= this.options.warningThreshold) {
        this.counter.classList.add('form-textarea-counter--warning');
      }
    }

    this.counter.textContent = counterText;
  }

  /**
   * Destroy counter
   */
  destroy() {
    if (this.counter) {
      this.counter.remove();
    }
  }
}


class CustomSelect {
  constructor(selectElement) {
    this.select = selectElement;
    this.container = null;
    this.trigger = null;
    this.dropdown = null;
    this.options = [];
    this.selectedIndex = this.select.selectedIndex;
    this.isOpen = false;

    this.init();
  }

  /**
   * Initialize custom select
   */
  init() {
    this.createCustomSelect();
    this.attachEventListeners();
    this.updateSelectedOption();
  }

  /**
   * Create custom select UI
   */
  createCustomSelect() {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'form-select-custom';

    // Create trigger
    this.trigger = document.createElement('button');
    this.trigger.className = 'form-select-custom__trigger';
    this.trigger.type = 'button';
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');

    const triggerText = document.createElement('span');
    triggerText.className = 'form-select-custom__trigger-text';
    this.trigger.appendChild(triggerText);

    const triggerIcon = document.createElement('span');
    triggerIcon.className = 'form-select-custom__trigger-icon';
    triggerIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 8l5 5 5-5H5z"/>
      </svg>
    `;
    this.trigger.appendChild(triggerIcon);

    // Create dropdown
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'form-select-custom__dropdown';
    this.dropdown.setAttribute('role', 'listbox');

    // Create options
    Array.from(this.select.options).forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'form-select-custom__option';
      optionElement.textContent = option.textContent;
      optionElement.setAttribute('role', 'option');
      optionElement.setAttribute('data-value', option.value);
      optionElement.setAttribute('data-index', index);

      if (option.disabled) {
        optionElement.classList.add('form-select-custom__option--disabled');
        optionElement.setAttribute('aria-disabled', 'true');
      }

      if (option.selected) {
        optionElement.classList.add('form-select-custom__option--selected');
        optionElement.setAttribute('aria-selected', 'true');
      }

      this.dropdown.appendChild(optionElement);
      this.options.push(optionElement);
    });

    // Assemble
    this.container.appendChild(this.trigger);
    this.container.appendChild(this.dropdown);

    // Hide original select
    this.select.style.display = 'none';
    this.select.parentNode.insertBefore(this.container, this.select.nextSibling);
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Trigger click
    this.trigger.addEventListener('click', () => this.toggle());

    // Option click
    this.options.forEach((option, index) => {
      option.addEventListener('click', () => {
        if (!option.classList.contains('form-select-custom__option--disabled')) {
          this.selectOption(index);
        }
      });
    });

    // Keyboard navigation
    this.trigger.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.trigger.focus();
      }
    });
  }

  /**
   * Toggle dropdown
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open dropdown
   */
  open() {
    this.isOpen = true;
    this.container.classList.add('form-select-custom--open');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.dropdown.focus();
  }

  /**
   * Close dropdown
   */
  close() {
    this.isOpen = false;
    this.container.classList.remove('form-select-custom--open');
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  /**
   * Select option
   */
  selectOption(index) {
    // Update selected index
    this.selectedIndex = index;

    // Update native select
    this.select.selectedIndex = index;

    // Trigger change event
    const changeEvent = new Event('change', { bubbles: true });
    this.select.dispatchEvent(changeEvent);

    // Update UI
    this.updateSelectedOption();

    // Close dropdown
    this.close();
    this.trigger.focus();
  }

  /**
   * Update selected option display
   */
  updateSelectedOption() {
    const selectedOption = this.select.options[this.selectedIndex];
    const triggerText = this.trigger.querySelector('.form-select-custom__trigger-text');

    if (selectedOption) {
      triggerText.textContent = selectedOption.textContent;
      triggerText.classList.remove('form-select-custom__trigger-text--placeholder');
    } else {
      triggerText.textContent = 'Select an option';
      triggerText.classList.add('form-select-custom__trigger-text--placeholder');
    }

    // Update option styles
    this.options.forEach((option, index) => {
      if (index === this.selectedIndex) {
        option.classList.add('form-select-custom__option--selected');
        option.setAttribute('aria-selected', 'true');
      } else {
        option.classList.remove('form-select-custom__option--selected');
        option.setAttribute('aria-selected', 'false');
      }
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(e) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.toggle();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (this.isOpen) {
          this.navigateOptions(1);
        } else {
          this.open();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (this.isOpen) {
          this.navigateOptions(-1);
        }
        break;
    }
  }

  /**
   * Navigate through options with keyboard
   */
  navigateOptions(direction) {
    let newIndex = this.selectedIndex + direction;

    // Skip disabled options
    while (newIndex >= 0 && newIndex < this.options.length) {
      if (!this.options[newIndex].classList.contains('form-select-custom__option--disabled')) {
        this.selectOption(newIndex);
        break;
      }
      newIndex += direction;
    }
  }

  /**
   * Destroy custom select
   */
  destroy() {
    this.container.remove();
    this.select.style.display = '';
  }
}


class ToggleSwitch {
  constructor(toggleElement) {
    this.toggle = toggleElement;
    this.init();
  }

  /**
   * Initialize toggle switch
   */
  init() {
    this.attachEventListeners();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Handle keyboard interaction
    this.toggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.toggle.click();
      }
    });

    // Dispatch custom event on change
    this.toggle.addEventListener('change', () => {
      const toggleEvent = new CustomEvent('toggleChange', {
        detail: {
          checked: this.toggle.checked,
          value: this.toggle.value
        }
      });
      this.toggle.dispatchEvent(toggleEvent);
    });
  }

  /**
   * Get toggle state
   */
  isChecked() {
    return this.toggle.checked;
  }

  /**
   * Set toggle state
   */
  setChecked(checked) {
    this.toggle.checked = checked;
    const changeEvent = new Event('change', { bubbles: true });
    this.toggle.dispatchEvent(changeEvent);
  }

  /**
   * Toggle state
   */
  toggle() {
    this.setChecked(!this.isChecked());
  }
}


/**
 * Auto-initialize forms on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize form validators
  document.querySelectorAll('form[data-validate]').forEach(form => {
    new FormValidator(form);
  });

  // Initialize character counters
  document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
    new CharacterCounter(textarea);
  });

  // Initialize custom selects
  document.querySelectorAll('.form-select[data-custom]').forEach(select => {
    new CustomSelect(select);
  });

  // Initialize toggle switches
  document.querySelectorAll('.form-toggle').forEach(toggle => {
    new ToggleSwitch(toggle);
  });

  // Handle checkbox indeterminate state
  document.querySelectorAll('[data-indeterminate]').forEach(checkbox => {
    checkbox.indeterminate = true;
  });
});


/**
 * Export classes for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FormValidator,
    CharacterCounter,
    CustomSelect,
    ToggleSwitch
  };
}
