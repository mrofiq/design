// Main JavaScript - Klinik Admin Dashboard
// Common utilities and initialization

// ============================================
// AUTHENTICATION & SESSION MANAGEMENT
// ============================================

const Auth = {
  // Check if user is authenticated
  isAuthenticated() {
    return localStorage.getItem('adminToken') !== null || sessionStorage.getItem('adminToken') !== null;
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
  },

  // Get user info
  getUser() {
    const userStr = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set authentication
  setAuth(token, user, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('adminToken', token);
    storage.setItem('adminUser', JSON.stringify(user));
  },

  // Clear authentication
  clearAuth() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
  },

  // Logout
  logout() {
    this.clearAuth();
    window.location.href = '/admin/login.html';
  },

  // Redirect to login if not authenticated
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/admin/login.html';
    }
  }
};

// ============================================
// SIDEBAR MANAGEMENT
// ============================================

const Sidebar = {
  init() {
    const hamburger = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (hamburger) {
      hamburger.addEventListener('click', () => this.toggle());
    }

    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }

    // Set active nav item
    this.setActiveNav();
  },

  toggle() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  },

  close() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  },

  setActiveNav() {
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (currentPage.includes(href)) {
        item.classList.add('active');
      }
    });
  }
};

// ============================================
// API UTILITIES
// ============================================

const API = {
  baseURL: '/api',

  async request(endpoint, options = {}) {
    const token = Auth.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        Auth.logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

// ============================================
// NOTIFICATION/TOAST SYSTEM
// ============================================

const Toast = {
  show(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${this.getIcon(type)}
        </svg>
        <span>${message}</span>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  getIcon(type) {
    const icons = {
      success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
      error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>',
      warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>',
      info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
    };
    return icons[type] || icons.info;
  },

  success(message) {
    this.show(message, 'success');
  },

  error(message) {
    this.show(message, 'error');
  },

  warning(message) {
    this.show(message, 'warning');
  },

  info(message) {
    this.show(message, 'info');
  }
};

// Add toast styles dynamically
const toastStyles = `
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10000;
    max-width: 400px;
  }
  .toast.show {
    transform: translateY(0);
    opacity: 1;
  }
  .toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .toast-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
  .toast-success {
    border-left: 4px solid #10B981;
  }
  .toast-success .toast-icon {
    color: #10B981;
  }
  .toast-error {
    border-left: 4px solid #EF4444;
  }
  .toast-error .toast-icon {
    color: #EF4444;
  }
  .toast-warning {
    border-left: 4px solid #F59E0B;
  }
  .toast-warning .toast-icon {
    color: #F59E0B;
  }
  .toast-info {
    border-left: 4px solid #3B82F6;
  }
  .toast-info .toast-icon {
    color: #3B82F6;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// ============================================
// UTILITY FUNCTIONS
// ============================================

const Utils = {
  // Format currency (IDR)
  formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  },

  // Format date
  formatDate(dateString, format = 'long') {
    const date = new Date(dateString);
    const options = {
      short: { day: 'numeric', month: 'short', year: 'numeric' },
      long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' }
    };
    return new Intl.DateTimeFormat('id-ID', options[format]).format(date);
  },

  // Format datetime
  formatDateTime(dateString) {
    return `${this.formatDate(dateString, 'short')}, ${this.formatDate(dateString, 'time')}`;
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      Toast.success('Copied to clipboard');
    } catch (err) {
      Toast.error('Failed to copy');
    }
  },

  // Get initials from name
  getInitials(name) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  },

  // Generate booking number
  generateBookingNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `BK${year}${month}${day}${random}`;
  },

  // Validate email
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  // Validate phone (Indonesian)
  isValidPhone(phone) {
    return /^(\+62|62|0)[0-9]{9,13}$/.test(phone.replace(/\s/g, ''));
  }
};

// ============================================
// LOADING SPINNER
// ============================================

const Loading = {
  show(target = 'body') {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
    `;
    container.appendChild(spinner);
  },

  hide(target = 'body') {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) {
      spinner.remove();
    }
  }
};

// Add loading styles
const loadingStyles = `
  .loading-spinner {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .spinner-container {
    text-align: center;
  }
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #E2E8F0;
    border-top-color: #00CED1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = loadingStyles;
document.head.appendChild(loadingStyleSheet);

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar on pages with sidebar
  if (document.querySelector('.sidebar')) {
    Sidebar.init();

    // Load user info in sidebar
    const user = Auth.getUser();
    if (user) {
      const userName = document.querySelector('.user-info .name');
      const userRole = document.querySelector('.user-info .role');
      if (userName) userName.textContent = user.name;
      if (userRole) userRole.textContent = user.role;
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-button');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
          Auth.logout();
        }
      });
    }
  }

  // Copy booking numbers
  document.querySelectorAll('.booking-number').forEach(el => {
    el.style.cursor = 'pointer';
    el.title = 'Click to copy';
    el.addEventListener('click', () => {
      Utils.copyToClipboard(el.textContent);
    });
  });
});

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================

window.Auth = Auth;
window.API = API;
window.Toast = Toast;
window.Utils = Utils;
window.Loading = Loading;
window.Sidebar = Sidebar;
