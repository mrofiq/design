/**
 * Developer Report Dashboard - AppShell Component
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * This component manages the application shell including:
 * - Sidebar toggle functionality (desktop collapsed/expanded)
 * - Mobile menu handling
 * - Window resize handling
 * - Active route highlighting
 * - User menu dropdown
 * - Notification badge updates
 * - Loading overlay management
 */

class AppShell {
  constructor(options = {}) {
    // Configuration
    this.config = {
      sidebarCollapsedKey: 'sidebar-collapsed',
      breakpointMobile: 768,
      breakpointTablet: 1024,
      ...options
    };

    // DOM Elements
    this.elements = {
      layout: document.getElementById('appLayout'),
      sidebar: document.getElementById('appSidebar'),
      sidebarToggle: document.getElementById('sidebarToggle'),
      mobileMenuToggle: document.getElementById('mobileMenuToggle'),
      mobileMenuOverlay: document.getElementById('mobileMenuOverlay'),
      userMenuButton: document.getElementById('userMenuButton'),
      userMenu: document.getElementById('headerUserMenu'),
      notificationButton: document.getElementById('notificationButton'),
      notificationBadge: document.getElementById('notificationBadge'),
      loadingOverlay: document.getElementById('loadingOverlay'),
      navLinks: document.querySelectorAll('.nav-link'),
      pageTitle: document.getElementById('pageTitle'),
      pageSubtitle: document.getElementById('pageSubtitle')
    };

    // State
    this.state = {
      isSidebarCollapsed: this.getSidebarState(),
      isMobileMenuOpen: false,
      isUserMenuOpen: false,
      currentRoute: this.getCurrentRoute(),
      windowWidth: window.innerWidth,
      isMobile: window.innerWidth < this.config.breakpointMobile,
      isTablet: window.innerWidth < this.config.breakpointTablet
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize the app shell
   */
  init() {
    console.log('Initializing AppShell...');

    // Apply initial sidebar state
    this.applySidebarState();

    // Set up event listeners
    this.setupEventListeners();

    // Highlight active route
    this.updateActiveRoute();

    // Handle initial window size
    this.handleResize();

    console.log('AppShell initialized successfully');
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Sidebar toggle (desktop)
    if (this.elements.sidebarToggle) {
      this.elements.sidebarToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }

    // Mobile menu toggle
    if (this.elements.mobileMenuToggle) {
      this.elements.mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Mobile menu overlay click
    if (this.elements.mobileMenuOverlay) {
      this.elements.mobileMenuOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // User menu toggle
    if (this.elements.userMenuButton) {
      this.elements.userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleUserMenu();
      });
    }

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.state.isUserMenuOpen && this.elements.userMenu) {
        if (!this.elements.userMenu.contains(e.target)) {
          this.closeUserMenu();
        }
      }
    });

    // Window resize handler
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Keyboard navigation
    this.setupKeyboardNavigation();

    // Navigation link clicks
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // If using client-side routing, prevent default and handle route change
        // e.preventDefault();
        // this.handleRouteChange(link.dataset.route);
      });
    });

    // ESC key to close menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.state.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
        if (this.state.isUserMenuOpen) {
          this.closeUserMenu();
        }
      }
    });
  }

  /**
   * Set up keyboard navigation for accessibility
   */
  setupKeyboardNavigation() {
    // Allow Tab navigation through sidebar links
    const focusableElements = this.elements.sidebar?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Trap focus in sidebar when mobile menu is open
    this.elements.sidebar?.addEventListener('keydown', (e) => {
      if (!this.state.isMobileMenuOpen || !this.state.isMobile) return;

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }

  /**
   * Toggle sidebar (desktop)
   */
  toggleSidebar() {
    this.state.isSidebarCollapsed = !this.state.isSidebarCollapsed;
    this.applySidebarState();
    this.saveSidebarState();
  }

  /**
   * Apply sidebar state (collapsed/expanded)
   */
  applySidebarState() {
    if (!this.elements.sidebar) return;

    if (this.state.isSidebarCollapsed) {
      this.elements.sidebar.classList.add('is-collapsed');
      this.elements.sidebarToggle?.setAttribute('aria-expanded', 'false');
    } else {
      this.elements.sidebar.classList.remove('is-collapsed');
      this.elements.sidebarToggle?.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * Get sidebar state from localStorage
   */
  getSidebarState() {
    try {
      const saved = localStorage.getItem(this.config.sidebarCollapsedKey);
      return saved === 'true';
    } catch (error) {
      console.warn('Could not read sidebar state from localStorage:', error);
      return false;
    }
  }

  /**
   * Save sidebar state to localStorage
   */
  saveSidebarState() {
    try {
      localStorage.setItem(
        this.config.sidebarCollapsedKey,
        this.state.isSidebarCollapsed.toString()
      );
    } catch (error) {
      console.warn('Could not save sidebar state to localStorage:', error);
    }
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    if (!this.elements.sidebar) return;

    this.state.isMobileMenuOpen = true;
    this.elements.sidebar.classList.add('is-open');
    this.elements.mobileMenuOverlay?.classList.add('is-visible');
    this.elements.mobileMenuToggle?.setAttribute('aria-expanded', 'true');

    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';

    // Focus first nav link for accessibility
    const firstNavLink = this.elements.sidebar.querySelector('.nav-link');
    if (firstNavLink) {
      setTimeout(() => firstNavLink.focus(), 100);
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    if (!this.elements.sidebar) return;

    this.state.isMobileMenuOpen = false;
    this.elements.sidebar.classList.remove('is-open');
    this.elements.mobileMenuOverlay?.classList.remove('is-visible');
    this.elements.mobileMenuToggle?.setAttribute('aria-expanded', 'false');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Toggle user menu dropdown
   */
  toggleUserMenu() {
    if (this.state.isUserMenuOpen) {
      this.closeUserMenu();
    } else {
      this.openUserMenu();
    }
  }

  /**
   * Open user menu dropdown
   */
  openUserMenu() {
    if (!this.elements.userMenu) return;

    this.state.isUserMenuOpen = true;
    this.elements.userMenu.classList.add('is-open');
    this.elements.userMenuButton?.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close user menu dropdown
   */
  closeUserMenu() {
    if (!this.elements.userMenu) return;

    this.state.isUserMenuOpen = false;
    this.elements.userMenu.classList.remove('is-open');
    this.elements.userMenuButton?.setAttribute('aria-expanded', 'false');
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const newWidth = window.innerWidth;
    const wasMobile = this.state.isMobile;
    const wasTablet = this.state.isTablet;

    this.state.windowWidth = newWidth;
    this.state.isMobile = newWidth < this.config.breakpointMobile;
    this.state.isTablet = newWidth < this.config.breakpointTablet;

    // Close mobile menu when resizing to desktop
    if (wasMobile && !this.state.isMobile) {
      this.closeMobileMenu();
    }

    // Apply sidebar state based on screen size
    if (!this.state.isMobile) {
      this.applySidebarState();
    }
  }

  /**
   * Get current route from URL or path
   */
  getCurrentRoute() {
    const path = window.location.pathname;
    const route = path.split('/').filter(Boolean)[0] || 'dashboard';
    return route;
  }

  /**
   * Update active route highlighting
   */
  updateActiveRoute(route = null) {
    const currentRoute = route || this.getCurrentRoute();
    this.state.currentRoute = currentRoute;

    // Update nav links
    this.elements.navLinks.forEach(link => {
      const linkRoute = link.dataset.route;
      if (linkRoute === currentRoute) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Handle route change (for SPA navigation)
   */
  handleRouteChange(route) {
    this.updateActiveRoute(route);

    // Close mobile menu on navigation
    if (this.state.isMobileMenuOpen) {
      this.closeMobileMenu();
    }

    // Update page title if needed
    this.updatePageTitle(route);

    // Emit custom event for other components to listen to
    const event = new CustomEvent('route-change', {
      detail: { route }
    });
    window.dispatchEvent(event);
  }

  /**
   * Update page title and subtitle
   */
  updatePageTitle(route, title = null, subtitle = null) {
    const routeTitles = {
      dashboard: { title: 'Dashboard', subtitle: 'Welcome back, John' },
      reports: { title: 'Reports', subtitle: 'View your daily reports' },
      activities: { title: 'Activities', subtitle: 'Track your activities' },
      leaderboard: { title: 'Leaderboard', subtitle: 'See team rankings' },
      achievements: { title: 'Achievements', subtitle: 'Your badges and rewards' },
      team: { title: 'Team Members', subtitle: 'Manage your team' },
      analytics: { title: 'Analytics', subtitle: 'Team performance insights' }
    };

    const routeInfo = routeTitles[route] || { title: 'Dashboard', subtitle: '' };

    if (this.elements.pageTitle) {
      this.elements.pageTitle.textContent = title || routeInfo.title;
    }

    if (this.elements.pageSubtitle) {
      this.elements.pageSubtitle.textContent = subtitle || routeInfo.subtitle;
    }

    // Update document title
    document.title = `${title || routeInfo.title} - Developer Report Dashboard`;
  }

  /**
   * Update notification badge
   */
  updateNotificationBadge(count) {
    if (!this.elements.notificationBadge) return;

    if (count > 0) {
      this.elements.notificationBadge.textContent = count > 99 ? '99+' : count.toString();
      this.elements.notificationBadge.style.display = 'block';
      this.elements.notificationButton?.setAttribute(
        'aria-label',
        `Notifications (${count} unread)`
      );
    } else {
      this.elements.notificationBadge.style.display = 'none';
      this.elements.notificationButton?.setAttribute('aria-label', 'Notifications');
    }
  }

  /**
   * Show loading overlay
   */
  showLoading(message = 'Loading...') {
    if (!this.elements.loadingOverlay) return;

    const loadingText = this.elements.loadingOverlay.querySelector('.loading-text');
    if (loadingText) {
      loadingText.textContent = message;
    }

    this.elements.loadingOverlay.setAttribute('aria-hidden', 'false');
    this.elements.loadingOverlay.style.display = 'flex';
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    if (!this.elements.loadingOverlay) return;

    this.elements.loadingOverlay.setAttribute('aria-hidden', 'true');
    this.elements.loadingOverlay.style.display = 'none';
  }

  /**
   * Debounce utility function
   */
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
  }

  /**
   * Destroy the app shell (cleanup)
   */
  destroy() {
    // Remove event listeners
    // Note: In a real implementation, you'd want to store references to bound functions
    // and remove them properly. For brevity, this is simplified.
    console.log('AppShell destroyed');
  }

  /**
   * Public API - Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Public API - Set page title programmatically
   */
  setPageTitle(title, subtitle = '') {
    this.updatePageTitle(this.state.currentRoute, title, subtitle);
  }

  /**
   * Public API - Navigate to route (for SPA)
   */
  navigate(route) {
    this.handleRouteChange(route);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppShell;
}

// Make available globally
window.AppShell = AppShell;
