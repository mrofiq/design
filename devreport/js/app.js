/**
 * App.js - Main Application Entry Point
 *
 * Initializes and coordinates all application components:
 * - Router
 * - Authentication
 * - Global event listeners
 * - Component initialization
 */

class App {
  constructor() {
    this.router = null;
    this.auth = null;
    this.toast = null;
    this.wsManager = null;
    this.rtManager = null;
    this.isInitialized = false;

    // Configuration
    this.config = {
      apiBaseUrl: '/api',
      wsUrl: this.getWebSocketUrl(),
      debug: true,
      enableRealtime: true
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * Get WebSocket URL
   * @returns {string} WebSocket URL
   */
  getWebSocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  /**
   * Initialize application
   */
  async init() {
    if (this.isInitialized) return;

    try {
      // Initialize authentication
      this.initAuth();

      // Initialize router
      this.initRouter();

      // Initialize UI components
      this.initComponents();

      // Initialize real-time features
      if (this.config.enableRealtime && this.auth.check()) {
        this.initRealtime();
      }

      // Setup global event listeners
      this.setupEventListeners();

      // Setup auth event handlers
      this.setupAuthHandlers();

      // Mark as initialized
      this.isInitialized = true;

      this.log('Application initialized successfully');

    } catch (error) {
      console.error('Application initialization error:', error);
      this.handleInitError(error);
    }
  }

  /**
   * Initialize authentication manager
   */
  initAuth() {
    this.auth = new AuthManager({
      storageKey: 'devreport_auth',
      tokenKey: 'devreport_token',
      rememberDuration: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    this.log('Auth manager initialized', this.auth.check() ? 'Authenticated' : 'Not authenticated');
  }

  /**
   * Initialize router
   */
  initRouter() {
    this.router = new Router({
      mode: 'hash',
      transition: true,
      scrollToTop: true
    });

    // Register all routes
    if (window.appRoutes) {
      this.router.registerRoutes(window.appRoutes);
    }

    // Set 404 handler
    this.router.notFound((path) => {
      const main = document.getElementById('main-content');
      if (main) {
        main.innerHTML = `
          <div class="error-page">
            <div class="error-content">
              <h1 class="error-title">404</h1>
              <h2 class="error-subtitle">Page Not Found</h2>
              <p class="error-message">The page you're looking for doesn't exist or has been moved.</p>
              <div class="error-actions">
                <button class="btn-primary" onclick="window.app.router.navigate('/dashboard')">
                  Go to Dashboard
                </button>
                <button class="btn-secondary" onclick="window.app.router.back()">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        `;
      }
    });

    // Set error handler
    this.router.onError((error, to, from) => {
      console.error('Router error:', error);
      if (this.toast) {
        this.toast.show({
          type: 'error',
          title: 'Navigation Error',
          message: 'An error occurred while navigating. Please try again.'
        });
      }
    });

    this.log('Router initialized');
  }

  /**
   * Initialize UI components
   */
  initComponents() {
    // Initialize Toast notifications
    this.initToast();

    // Initialize mobile menu
    this.initMobileMenu();

    // Initialize user dropdown
    this.initUserDropdown();

    // Update UI based on auth state
    this.updateUIForAuthState();

    this.log('Components initialized');
  }

  /**
   * Initialize toast notifications
   */
  initToast() {
    // Check if Toast component is available
    if (window.Toast) {
      this.toast = new Toast({
        position: 'top-right',
        duration: 5000,
        maxToasts: 3
      });
    }
  }

  /**
   * Initialize real-time features
   */
  initRealtime() {
    if (!window.WebSocketManager || !window.RealTimeManager) {
      this.log('Real-time components not available');
      return;
    }

    try {
      // Initialize WebSocket manager
      this.wsManager = new WebSocketManager({
        url: this.config.wsUrl,
        debug: this.config.debug,
        autoConnect: true,
        reconnectEnabled: true,
        heartbeatInterval: 30000
      });

      // Initialize real-time manager
      this.rtManager = new RealTimeManager({
        wsManager: this.wsManager,
        debug: this.config.debug,
        userId: this.auth.getUser()?.id
      });

      // Create connection status indicator
      this.createConnectionStatusIndicator();

      this.log('Real-time features initialized');

    } catch (error) {
      this.log('Real-time initialization error:', error);
    }
  }

  /**
   * Create connection status indicator
   */
  createConnectionStatusIndicator() {
    // Check if indicator already exists
    if (document.querySelector('.connection-status')) {
      return;
    }

    const indicator = document.createElement('div');
    indicator.className = 'connection-status connection-status--connecting';
    indicator.setAttribute('role', 'status');
    indicator.setAttribute('aria-live', 'polite');
    indicator.innerHTML = `
      <div class="connection-status__indicator"></div>
      <span class="connection-status__label">Connecting...</span>
    `;

    document.body.appendChild(indicator);

    // Update indicator based on connection state
    if (this.wsManager) {
      this.wsManager.on('stateChange', ({ to }) => {
        indicator.className = `connection-status connection-status--${to}`;
        const label = indicator.querySelector('.connection-status__label');
        if (label) {
          const labels = {
            connected: 'Connected',
            connecting: 'Connecting...',
            reconnecting: 'Reconnecting...',
            disconnected: 'Disconnected'
          };
          label.textContent = labels[to] || to;
        }
      });
    }
  }

  /**
   * Initialize mobile menu
   */
  initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar-nav');

    if (mobileMenuToggle && sidebar) {
      mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
        const isOpen = sidebar.classList.contains('is-open');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
      });

      // Close sidebar when clicking outside
      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          if (sidebar.classList.contains('is-open')) {
            sidebar.classList.remove('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }
  }

  /**
   * Initialize user dropdown
   */
  initUserDropdown() {
    const userMenuButton = document.getElementById('userMenuButton');

    if (userMenuButton) {
      userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = userMenuButton.closest('.user-dropdown');
        dropdown.classList.toggle('is-open');
        const isOpen = dropdown.classList.contains('is-open');
        userMenuButton.setAttribute('aria-expanded', isOpen);
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        const dropdown = userMenuButton.closest('.user-dropdown');
        if (dropdown && !dropdown.contains(e.target)) {
          dropdown.classList.remove('is-open');
          userMenuButton.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to close dropdowns/modals
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
        this.closeAllModals();
      }
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      if (this.toast) {
        this.toast.show({
          type: 'success',
          title: 'Back Online',
          message: 'Your connection has been restored.'
        });
      }
    });

    window.addEventListener('offline', () => {
      if (this.toast) {
        this.toast.show({
          type: 'warning',
          title: 'You\'re Offline',
          message: 'Some features may not be available.',
          duration: 0 // Don't auto-dismiss
        });
      }
    });
  }

  /**
   * Setup authentication event handlers
   */
  setupAuthHandlers() {
    // Handle login event
    this.auth.on('login', ({ user }) => {
      this.log('User logged in:', user.email);

      // Update UI
      this.updateUIForAuthState();

      // Initialize real-time features if not already initialized
      if (this.config.enableRealtime && !this.wsManager) {
        this.initRealtime();
      }

      // Update real-time manager user ID
      if (this.rtManager) {
        this.rtManager.setUserId(user.id);
      }

      // Show welcome toast
      if (this.toast) {
        this.toast.show({
          type: 'success',
          title: 'Welcome back!',
          message: `You're now logged in as ${user.name}`
        });
      }
    });

    // Handle logout event
    this.auth.on('logout', ({ user }) => {
      this.log('User logged out');

      // Disconnect WebSocket
      if (this.wsManager) {
        this.wsManager.disconnect();
        this.wsManager = null;
        this.rtManager = null;
      }

      // Update UI
      this.updateUIForAuthState();

      // Redirect to login
      this.router.navigate('/login');

      // Show logout toast
      if (this.toast) {
        this.toast.show({
          type: 'info',
          title: 'Logged Out',
          message: 'You have been successfully logged out.'
        });
      }
    });

    // Handle auth state change
    this.auth.on('authStateChange', ({ isAuthenticated, user }) => {
      this.updateUIForAuthState();
    });
  }

  /**
   * Update UI based on authentication state
   */
  updateUIForAuthState() {
    const isAuthenticated = this.auth.check();
    const user = this.auth.getUser();

    // Update header
    const appLayout = document.querySelector('.app-layout');
    const appHeader = document.querySelector('.app-header');
    const appSidebar = document.querySelector('.app-sidebar');

    if (appLayout) {
      if (isAuthenticated) {
        appLayout.classList.remove('auth-layout');
        if (appHeader) appHeader.style.display = '';
        if (appSidebar) appSidebar.style.display = '';
      } else {
        appLayout.classList.add('auth-layout');
        if (appHeader) appHeader.style.display = 'none';
        if (appSidebar) appSidebar.style.display = 'none';
      }
    }

    // Update user info in sidebar
    if (isAuthenticated && user) {
      const userName = document.querySelector('.sidebar-footer .user-name');
      const userRole = document.querySelector('.sidebar-footer .user-role');
      const userAvatar = document.querySelector('.sidebar-footer .avatar');

      if (userName) userName.textContent = user.name;
      if (userRole) userRole.textContent = user.role.replace('_', ' ');
      if (userAvatar) {
        userAvatar.querySelector('span').textContent = user.name.charAt(0).toUpperCase();
      }

      // Update header avatar
      const headerAvatar = document.querySelector('.header-right .avatar');
      if (headerAvatar) {
        headerAvatar.querySelector('span').textContent = user.name.charAt(0).toUpperCase();
      }

      // Show/hide navigation items based on role
      this.updateNavigationForRole(user.role);
    }
  }

  /**
   * Update navigation items based on user role
   */
  updateNavigationForRole(role) {
    const teamNav = document.querySelector('a[href="#/team"]')?.closest('.nav-item');
    const analyticsNav = document.querySelector('a[href="#/analytics"]')?.closest('.nav-item');
    const adminNav = document.querySelector('a[href="#/admin"]')?.closest('.nav-item');

    // Team Lead and Admin can see team items
    if (teamNav) {
      teamNav.style.display = ['team_lead', 'admin'].includes(role) ? '' : 'none';
    }

    if (analyticsNav) {
      analyticsNav.style.display = ['team_lead', 'admin'].includes(role) ? '' : 'none';
    }

    // Only admin can see admin items
    if (adminNav) {
      adminNav.style.display = role === 'admin' ? '' : 'none';
    }
  }

  /**
   * Handle logout
   */
  handleLogout() {
    this.auth.logout();
  }

  /**
   * Close all dropdowns
   */
  closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown.is-open');
    dropdowns.forEach(dropdown => {
      dropdown.classList.remove('is-open');
      const button = dropdown.querySelector('[aria-expanded]');
      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Close all modals
   */
  closeAllModals() {
    const modals = document.querySelectorAll('.modal.is-open');
    modals.forEach(modal => {
      const closeBtn = modal.querySelector('[data-modal-close]');
      if (closeBtn) {
        closeBtn.click();
      }
    });
  }

  /**
   * Handle initialization error
   */
  handleInitError(error) {
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = `
        <div class="error-page">
          <div class="error-content">
            <h1 class="error-title">Initialization Error</h1>
            <h2 class="error-subtitle">Something went wrong</h2>
            <p class="error-message">We couldn't initialize the application. Please refresh the page and try again.</p>
            <div class="error-actions">
              <button class="btn-primary" onclick="location.reload()">
                Reload Page
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Logging utility
   */
  log(...args) {
    if (this.config.debug) {
      console.log('[App]', ...args);
    }
  }

  /**
   * API utility methods
   */
  async api(endpoint, options = {}) {
    const url = `${this.config.apiBaseUrl}${endpoint}`;
    const token = this.auth.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

// Initialize app when script loads
window.app = new App();

// Expose utilities to window for convenience
window.addEventListener('DOMContentLoaded', () => {
  // Make router and auth available globally
  if (window.app) {
    window.router = window.app.router;
    window.auth = window.app.auth;
  }
});
