/**
 * Auth.js - Authentication State Management
 *
 * Features:
 * - User authentication state
 * - Login/logout handling
 * - Token management
 * - Role-based access control
 * - Session persistence
 * - Auth state events
 */

class AuthManager {
  constructor(options = {}) {
    this.config = {
      storageKey: options.storageKey || 'devreport_auth',
      tokenKey: options.tokenKey || 'devreport_token',
      rememberDuration: options.rememberDuration || 7 * 24 * 60 * 60 * 1000, // 7 days
      ...options
    };

    this.user = null;
    this.token = null;
    this.isAuthenticated = false;

    // Event listeners
    this.listeners = {
      login: [],
      logout: [],
      authStateChange: []
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize auth manager
   */
  init() {
    // Load auth state from storage
    this.loadAuthState();

    // Setup token refresh if needed
    if (this.isAuthenticated) {
      this.scheduleTokenRefresh();
    }
  }

  /**
   * Login user
   */
  async login(credentials, remember = false) {
    try {
      // In production, this would call your API
      // For now, we'll simulate authentication
      const response = await this.simulateLogin(credentials);

      if (response.success) {
        this.setAuthState(response.user, response.token, remember);
        this.emit('login', { user: response.user });
        this.emit('authStateChange', { isAuthenticated: true, user: response.user });
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout user
   */
  logout() {
    const user = this.user;
    this.clearAuthState();
    this.emit('logout', { user });
    this.emit('authStateChange', { isAuthenticated: false, user: null });
  }

  /**
   * Check if user is authenticated
   */
  check() {
    return this.isAuthenticated;
  }

  /**
   * Get current user
   */
  getUser() {
    return this.user;
  }

  /**
   * Get auth token
   */
  getToken() {
    return this.token;
  }

  /**
   * Check if user has role
   */
  hasRole(role) {
    if (!this.user || !this.user.role) return false;

    if (Array.isArray(role)) {
      return role.includes(this.user.role);
    }

    return this.user.role === role;
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission) {
    if (!this.user || !this.user.permissions) return false;
    return this.user.permissions.includes(permission);
  }

  /**
   * Update user profile
   */
  updateUser(updates) {
    if (!this.user) return;

    this.user = { ...this.user, ...updates };
    this.saveAuthState();
    this.emit('authStateChange', { isAuthenticated: true, user: this.user });
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      // In production, call your token refresh endpoint
      const response = await this.simulateTokenRefresh(this.token);

      if (response.success) {
        this.token = response.token;
        this.saveAuthState();
        this.scheduleTokenRefresh();
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Set authentication state
   */
  setAuthState(user, token, remember = false) {
    this.user = user;
    this.token = token;
    this.isAuthenticated = true;

    if (remember) {
      this.saveAuthState(true);
    } else {
      this.saveAuthState(false);
    }

    this.scheduleTokenRefresh();
  }

  /**
   * Clear authentication state
   */
  clearAuthState() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;

    localStorage.removeItem(this.config.storageKey);
    sessionStorage.removeItem(this.config.storageKey);
    localStorage.removeItem(this.config.tokenKey);
    sessionStorage.removeItem(this.config.tokenKey);

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }

  /**
   * Save auth state to storage
   */
  saveAuthState(persistent = false) {
    const authData = {
      user: this.user,
      token: this.token,
      timestamp: Date.now()
    };

    const storage = persistent ? localStorage : sessionStorage;
    storage.setItem(this.config.storageKey, JSON.stringify(authData));
  }

  /**
   * Load auth state from storage
   */
  loadAuthState() {
    // Try localStorage first (remember me)
    let authData = localStorage.getItem(this.config.storageKey);
    let storage = 'local';

    // Fall back to sessionStorage
    if (!authData) {
      authData = sessionStorage.getItem(this.config.storageKey);
      storage = 'session';
    }

    if (!authData) {
      return;
    }

    try {
      const data = JSON.parse(authData);

      // Check if token is expired (for localStorage)
      if (storage === 'local') {
        const age = Date.now() - data.timestamp;
        if (age > this.config.rememberDuration) {
          this.clearAuthState();
          return;
        }
      }

      this.user = data.user;
      this.token = data.token;
      this.isAuthenticated = true;
    } catch (error) {
      console.error('Error loading auth state:', error);
      this.clearAuthState();
    }
  }

  /**
   * Schedule token refresh
   */
  scheduleTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Refresh token 5 minutes before expiry (or every 50 minutes if no expiry)
    const refreshInterval = 50 * 60 * 1000; // 50 minutes
    this.refreshTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshInterval);
  }

  /**
   * Event handling
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
    return this;
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Simulate login (replace with actual API call)
   */
  async simulateLogin(credentials) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { email, password } = credentials;

        // Mock authentication
        if (email && password) {
          // Determine user role based on email
          let role = 'developer';
          let permissions = ['view_dashboard', 'submit_report', 'view_reports'];

          if (email.includes('lead')) {
            role = 'team_lead';
            permissions.push('view_team', 'approve_reports', 'view_analytics');
          } else if (email.includes('admin')) {
            role = 'admin';
            permissions.push('manage_users', 'manage_settings', 'view_all_data');
          }

          resolve({
            success: true,
            user: {
              id: Math.random().toString(36).substr(2, 9),
              email: email,
              name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              role: role,
              permissions: permissions,
              avatar: null,
              level: 'Junior',
              points: 0,
              streak: 0
            },
            token: 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9)
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid credentials'
          });
        }
      }, 500); // Simulate network delay
    });
  }

  /**
   * Simulate token refresh (replace with actual API call)
   */
  async simulateTokenRefresh(oldToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (oldToken) {
          resolve({
            success: true,
            token: 'refreshed_token_' + Math.random().toString(36).substr(2, 9)
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid token'
          });
        }
      }, 300);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthManager;
} else {
  window.AuthManager = AuthManager;
}
