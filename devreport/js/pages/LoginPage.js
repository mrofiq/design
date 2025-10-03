/**
 * Developer Report Dashboard - Login Page
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * This module handles login page functionality including:
 * - Microsoft Office 365 SSO authentication
 * - Email/password authentication
 * - Form validation
 * - Password visibility toggle
 * - Remember me functionality
 * - Loading states
 * - Error handling
 * - Session management
 */

class LoginPage {
  constructor() {
    // DOM elements
    this.loginForm = document.getElementById('loginForm');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.rememberMeCheckbox = document.getElementById('rememberMe');
    this.loginBtn = document.getElementById('loginBtn');
    this.microsoftSsoBtn = document.getElementById('microsoftSsoBtn');
    this.passwordToggle = document.getElementById('passwordToggle');
    this.forgotPasswordLink = document.getElementById('forgotPasswordLink');

    // State
    this.isLoading = false;
    this.isPasswordVisible = false;

    // Configuration
    this.config = {
      apiBaseUrl: '/api', // Update with your API base URL
      microsoftAuthUrl: '/api/auth/microsoft', // Microsoft SSO endpoint
      loginEndpoint: '/api/auth/login', // Email/password login endpoint
      redirectUrl: '/index.html', // Redirect after successful login
      maxLoginAttempts: 5,
      lockoutDuration: 900000 // 15 minutes in milliseconds
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize login page
   */
  init() {
    this.loadSavedCredentials();
    this.checkLoginAttempts();
    this.attachEventListeners();
    this.setupFormValidation();
    this.checkExistingSession();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Form submission
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));

      // Custom validation event
      this.loginForm.addEventListener('formValidated', (e) => {
        this.performLogin(e.detail.data);
      });
    }

    // Microsoft SSO button
    if (this.microsoftSsoBtn) {
      this.microsoftSsoBtn.addEventListener('click', () => this.handleMicrosoftSSO());
    }

    // Password toggle
    if (this.passwordToggle) {
      this.passwordToggle.addEventListener('click', () => this.togglePasswordVisibility());
    }

    // Forgot password link
    if (this.forgotPasswordLink) {
      this.forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));
    }

    // Enter key in email field focuses password
    if (this.emailInput && this.passwordInput) {
      this.emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.passwordInput.focus();
        }
      });
    }

    // Handle browser back button
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        this.resetForm();
      }
    });
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
    // Form validator is initialized automatically by Form.js
    // Add custom validation rules if needed

    // Custom email validation
    if (this.emailInput) {
      this.emailInput.addEventListener('blur', () => {
        this.validateEmail();
      });
    }

    // Custom password validation
    if (this.passwordInput) {
      this.passwordInput.addEventListener('blur', () => {
        this.validatePassword();
      });
    }
  }

  /**
   * Validate email field
   */
  validateEmail() {
    const email = this.emailInput.value.trim();

    if (!email) {
      return false;
    }

    // Check for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showFieldError(this.emailInput, 'Please enter a valid email address');
      return false;
    }

    // Check for corporate domain (optional)
    // const corporateDomains = ['company.com', 'organization.com'];
    // const domain = email.split('@')[1];
    // if (!corporateDomains.includes(domain)) {
    //   this.showFieldError(this.emailInput, 'Please use your corporate email address');
    //   return false;
    // }

    this.clearFieldError(this.emailInput);
    return true;
  }

  /**
   * Validate password field
   */
  validatePassword() {
    const password = this.passwordInput.value;

    if (!password) {
      return false;
    }

    if (password.length < 8) {
      this.showFieldError(this.passwordInput, 'Password must be at least 8 characters');
      return false;
    }

    this.clearFieldError(this.passwordInput);
    return true;
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    const formField = field.closest('.form-field');
    if (!formField) return;

    formField.classList.add('form-field--error');

    let errorElement = formField.querySelector('.form-error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error-message';
      errorElement.setAttribute('role', 'alert');
      field.closest('.form-input-group').appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    const formField = field.closest('.form-field');
    if (!formField) return;

    formField.classList.remove('form-field--error');

    const errorElement = formField.querySelector('.form-error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Handle form submission
   */
  handleLogin(e) {
    e.preventDefault();

    // Check if account is locked
    if (this.isAccountLocked()) {
      this.showAccountLockedError();
      return;
    }

    // Validation is handled by FormValidator from Form.js
    // The formValidated event will trigger performLogin
  }

  /**
   * Perform login with email/password
   */
  async performLogin(formData) {
    if (this.isLoading) return;

    this.setLoadingState(true);

    try {
      const response = await this.makeLoginRequest({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe === 'on'
      });

      if (response.success) {
        // Store authentication token
        this.storeAuthToken(response.token, formData.rememberMe === 'on');

        // Store user data
        this.storeUserData(response.user);

        // Save credentials if remember me is checked
        if (formData.rememberMe === 'on') {
          this.saveCredentials(formData.email);
        }

        // Clear login attempts
        this.clearLoginAttempts();

        // Show success message
        showSuccess('Login successful! Redirecting...', 2000);

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = this.config.redirectUrl;
        }, 2000);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      this.handleLoginError(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Make login API request
   */
  async makeLoginRequest(credentials) {
    // This is a mock implementation
    // Replace with actual API call

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock API response
        // In production, this would be an actual fetch/axios call:
        // const response = await fetch(`${this.config.apiBaseUrl}${this.config.loginEndpoint}`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(credentials)
        // });
        // const data = await response.json();
        // resolve(data);

        // Mock validation
        if (credentials.email === 'admin@company.com' && credentials.password === 'password123') {
          resolve({
            success: true,
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 1,
              email: credentials.email,
              name: 'Admin User',
              role: 'admin'
            }
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1500); // Simulate network delay
    });
  }

  /**
   * Handle Microsoft SSO authentication
   */
  async handleMicrosoftSSO() {
    if (this.isLoading) return;

    this.setLoadingState(true, this.microsoftSsoBtn);

    try {
      // Show info message
      showInfo('Redirecting to Microsoft login...');

      // In production, this would redirect to Microsoft OAuth endpoint
      // window.location.href = `${this.config.apiBaseUrl}${this.config.microsoftAuthUrl}`;

      // For demo purposes, simulate SSO
      setTimeout(() => {
        // Mock successful SSO
        const mockUser = {
          id: 2,
          email: 'user@company.com',
          name: 'John Doe',
          role: 'developer'
        };

        this.storeAuthToken('mock-sso-token-' + Date.now(), true);
        this.storeUserData(mockUser);

        showSuccess('Microsoft SSO successful! Redirecting...', 2000);

        setTimeout(() => {
          window.location.href = this.config.redirectUrl;
        }, 2000);
      }, 2000);

    } catch (error) {
      this.setLoadingState(false, this.microsoftSsoBtn);
      showError('Microsoft SSO failed. Please try again.');
      console.error('SSO Error:', error);
    }
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;

    if (this.isPasswordVisible) {
      this.passwordInput.type = 'text';
      this.passwordToggle.querySelector('.password-show-icon').style.display = 'none';
      this.passwordToggle.querySelector('.password-hide-icon').style.display = 'block';
      this.passwordToggle.setAttribute('aria-label', 'Hide password');
    } else {
      this.passwordInput.type = 'password';
      this.passwordToggle.querySelector('.password-show-icon').style.display = 'block';
      this.passwordToggle.querySelector('.password-hide-icon').style.display = 'none';
      this.passwordToggle.setAttribute('aria-label', 'Show password');
    }
  }

  /**
   * Handle forgot password
   */
  handleForgotPassword(e) {
    e.preventDefault();

    // In production, this would open a modal or redirect to forgot password page
    showInfo('Password reset functionality coming soon. Please contact your administrator.');

    // Example: Open modal
    // const modal = new Modal({
    //   title: 'Reset Password',
    //   content: 'Enter your email to receive password reset instructions.',
    //   actions: [...]
    // });
  }

  /**
   * Set loading state
   */
  setLoadingState(loading, button = this.loginBtn) {
    this.isLoading = loading;

    if (loading) {
      button.classList.add('is-loading');
      button.disabled = true;

      // Disable form inputs
      if (button === this.loginBtn) {
        this.emailInput.disabled = true;
        this.passwordInput.disabled = true;
        this.rememberMeCheckbox.disabled = true;
        this.microsoftSsoBtn.disabled = true;
      }
    } else {
      button.classList.remove('is-loading');
      button.disabled = false;

      // Enable form inputs
      if (button === this.loginBtn) {
        this.emailInput.disabled = false;
        this.passwordInput.disabled = false;
        this.rememberMeCheckbox.disabled = false;
        this.microsoftSsoBtn.disabled = false;
      }
    }
  }

  /**
   * Handle login error
   */
  handleLoginError(error) {
    console.error('Login error:', error);

    // Increment login attempts
    this.incrementLoginAttempts();

    // Get remaining attempts
    const remainingAttempts = this.getRemainingAttempts();

    let errorMessage = error.message || 'Login failed. Please try again.';

    if (remainingAttempts <= 3 && remainingAttempts > 0) {
      errorMessage += ` (${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining)`;
    }

    showError(errorMessage, 5000);

    // Check if account should be locked
    if (remainingAttempts <= 0) {
      this.lockAccount();
      this.showAccountLockedError();
    }
  }

  /**
   * Store authentication token
   */
  storeAuthToken(token, persistent = false) {
    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem('authToken', token);
    storage.setItem('authTokenExpiry', Date.now() + (8 * 60 * 60 * 1000)); // 8 hours
  }

  /**
   * Store user data
   */
  storeUserData(user) {
    const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
    storage.setItem('userData', JSON.stringify(user));
  }

  /**
   * Save credentials for remember me
   */
  saveCredentials(email) {
    localStorage.setItem('rememberedEmail', email);
  }

  /**
   * Load saved credentials
   */
  loadSavedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberedEmail && this.emailInput) {
      this.emailInput.value = rememberedEmail;
      this.rememberMeCheckbox.checked = true;

      // Focus password field
      if (this.passwordInput) {
        this.passwordInput.focus();
      }
    }
  }

  /**
   * Check for existing session
   */
  checkExistingSession() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const expiry = localStorage.getItem('authTokenExpiry') || sessionStorage.getItem('authTokenExpiry');

    if (token && expiry && Date.now() < parseInt(expiry)) {
      // User is already logged in, redirect to dashboard
      showInfo('You are already logged in. Redirecting...');
      setTimeout(() => {
        window.location.href = this.config.redirectUrl;
      }, 1000);
    }
  }

  /**
   * Login attempts management
   */
  incrementLoginAttempts() {
    const attempts = this.getLoginAttempts();
    const newAttempts = attempts + 1;

    localStorage.setItem('loginAttempts', newAttempts);
    localStorage.setItem('lastLoginAttempt', Date.now());
  }

  getLoginAttempts() {
    return parseInt(localStorage.getItem('loginAttempts') || '0');
  }

  getRemainingAttempts() {
    return Math.max(0, this.config.maxLoginAttempts - this.getLoginAttempts());
  }

  clearLoginAttempts() {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lastLoginAttempt');
    localStorage.removeItem('accountLocked');
    localStorage.removeItem('lockoutExpiry');
  }

  checkLoginAttempts() {
    const lockoutExpiry = localStorage.getItem('lockoutExpiry');

    if (lockoutExpiry && Date.now() < parseInt(lockoutExpiry)) {
      // Account is still locked
      this.showAccountLockedError();
      this.disableLoginForm();
    } else if (lockoutExpiry) {
      // Lockout period has expired
      this.clearLoginAttempts();
    }
  }

  isAccountLocked() {
    const lockoutExpiry = localStorage.getItem('lockoutExpiry');
    return lockoutExpiry && Date.now() < parseInt(lockoutExpiry);
  }

  lockAccount() {
    const lockoutExpiry = Date.now() + this.config.lockoutDuration;
    localStorage.setItem('accountLocked', 'true');
    localStorage.setItem('lockoutExpiry', lockoutExpiry);
  }

  showAccountLockedError() {
    const lockoutExpiry = parseInt(localStorage.getItem('lockoutExpiry'));
    const remainingMinutes = Math.ceil((lockoutExpiry - Date.now()) / 60000);

    showError(
      `Too many failed login attempts. Account locked for ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}.`,
      0 // Don't auto-dismiss
    );

    this.disableLoginForm();
  }

  disableLoginForm() {
    if (this.loginBtn) this.loginBtn.disabled = true;
    if (this.microsoftSsoBtn) this.microsoftSsoBtn.disabled = true;
    if (this.emailInput) this.emailInput.disabled = true;
    if (this.passwordInput) this.passwordInput.disabled = true;
    if (this.rememberMeCheckbox) this.rememberMeCheckbox.disabled = true;
  }

  /**
   * Reset form
   */
  resetForm() {
    if (this.loginForm) {
      this.loginForm.reset();
    }

    this.setLoadingState(false);
    this.isPasswordVisible = false;

    if (this.passwordInput) {
      this.passwordInput.type = 'password';
    }

    this.clearFieldError(this.emailInput);
    this.clearFieldError(this.passwordInput);
  }

  /**
   * Destroy instance
   */
  destroy() {
    // Remove event listeners if needed
    // Clean up resources
  }
}

// Initialize login page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const loginPage = new LoginPage();

  // Make it globally accessible for debugging
  if (typeof window !== 'undefined') {
    window.loginPage = loginPage;
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoginPage;
}
