/**
 * Developer Report Dashboard - Navigation Component
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * Navigation menu management with accessibility features.
 * Implements WCAG 2.1 AA compliant keyboard navigation and ARIA attributes.
 */

class Navigation {
  /**
   * Initialize navigation component
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      sidebarSelector: '[data-nav-sidebar]',
      toggleSelector: '[data-nav-toggle]',
      mobileToggleSelector: '[data-nav-mobile-toggle]',
      overlaySelector: '[data-nav-overlay]',
      itemSelector: '[data-nav-item]',
      expandableSelector: '[data-nav-expandable]',
      activeClass: 'nav-item--active',
      expandedClass: 'nav-item--expanded',
      openClass: 'nav-sidebar--open',
      collapsedClass: 'nav-sidebar--collapsed',
      overlayVisibleClass: 'nav-overlay--visible',
      scrollToActiveOnInit: true,
      persistState: true,
      storageKey: 'devreport_nav_state',
      ...options
    };

    this.sidebar = null;
    this.overlay = null;
    this.toggleBtn = null;
    this.mobileToggleBtn = null;
    this.navItems = [];
    this.expandableItems = [];
    this.isCollapsed = false;
    this.isMobileOpen = false;
    this.focusedItemIndex = -1;

    this.init();
  }

  /**
   * Initialize the navigation component
   */
  init() {
    this.cacheDOM();
    this.restoreState();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
    this.setupARIA();

    if (this.options.scrollToActiveOnInit) {
      this.scrollToActiveItem();
    }

    console.log('Navigation initialized');
  }

  /**
   * Cache DOM elements
   */
  cacheDOM() {
    this.sidebar = document.querySelector(this.options.sidebarSelector);
    this.overlay = document.querySelector(this.options.overlaySelector);
    this.toggleBtn = document.querySelector(this.options.toggleSelector);
    this.mobileToggleBtn = document.querySelector(this.options.mobileToggleSelector);

    if (!this.sidebar) {
      console.error('Navigation sidebar element not found');
      return;
    }

    this.navItems = Array.from(this.sidebar.querySelectorAll(this.options.itemSelector));
    this.expandableItems = Array.from(this.sidebar.querySelectorAll(this.options.expandableSelector));
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Toggle sidebar collapse (desktop)
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleCollapse());
    }

    // Toggle mobile menu
    if (this.mobileToggleBtn) {
      this.mobileToggleBtn.addEventListener('click', () => this.toggleMobile());
    }

    // Close mobile menu when overlay is clicked
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMobile());
    }

    // Handle expandable items
    this.expandableItems.forEach(item => {
      const link = item.querySelector('.nav-item__link');
      if (link) {
        link.addEventListener('click', (e) => this.handleExpandableClick(e, item));
      }
    });

    // Handle regular nav items
    this.navItems.forEach((item, index) => {
      const link = item.querySelector('.nav-item__link');
      if (link && !item.hasAttribute('data-nav-expandable')) {
        link.addEventListener('click', (e) => this.handleItemClick(e, item, index));
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileOpen) {
        this.closeMobile();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    if (!this.sidebar) return;

    this.sidebar.addEventListener('keydown', (e) => {
      const focusableItems = this.getFocusableItems();
      const currentIndex = focusableItems.findIndex(item =>
        item === document.activeElement || item.contains(document.activeElement)
      );

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.focusNextItem(focusableItems, currentIndex);
          break;

        case 'ArrowUp':
          e.preventDefault();
          this.focusPreviousItem(focusableItems, currentIndex);
          break;

        case 'Home':
          e.preventDefault();
          this.focusFirstItem(focusableItems);
          break;

        case 'End':
          e.preventDefault();
          this.focusLastItem(focusableItems);
          break;

        case 'Enter':
        case ' ':
          if (document.activeElement.hasAttribute('data-nav-expandable-trigger')) {
            e.preventDefault();
            const item = document.activeElement.closest(this.options.expandableSelector);
            if (item) {
              this.toggleExpand(item);
            }
          }
          break;

        case 'ArrowRight':
          if (document.activeElement.hasAttribute('data-nav-expandable-trigger')) {
            e.preventDefault();
            const item = document.activeElement.closest(this.options.expandableSelector);
            if (item && !item.classList.contains(this.options.expandedClass)) {
              this.expand(item);
            }
          }
          break;

        case 'ArrowLeft':
          if (document.activeElement.hasAttribute('data-nav-expandable-trigger')) {
            e.preventDefault();
            const item = document.activeElement.closest(this.options.expandableSelector);
            if (item && item.classList.contains(this.options.expandedClass)) {
              this.collapse(item);
            }
          }
          break;
      }
    });
  }

  /**
   * Setup ARIA attributes
   */
  setupARIA() {
    if (!this.sidebar) return;

    // Set sidebar role
    this.sidebar.setAttribute('role', 'navigation');
    this.sidebar.setAttribute('aria-label', 'Main navigation');

    // Set ARIA attributes for expandable items
    this.expandableItems.forEach(item => {
      const link = item.querySelector('.nav-item__link');
      const submenu = item.querySelector('.nav-submenu');
      const id = `nav-submenu-${Math.random().toString(36).substr(2, 9)}`;

      if (link && submenu) {
        link.setAttribute('aria-expanded', 'false');
        link.setAttribute('aria-controls', id);
        link.setAttribute('data-nav-expandable-trigger', '');
        submenu.setAttribute('id', id);
        submenu.setAttribute('role', 'menu');
        submenu.setAttribute('aria-label', link.textContent.trim() + ' submenu');
      }
    });

    // Set ARIA current for active items
    const activeItem = this.sidebar.querySelector(`.${this.options.activeClass} > .nav-item__link`);
    if (activeItem) {
      activeItem.setAttribute('aria-current', 'page');
    }

    // Mobile toggle ARIA
    if (this.mobileToggleBtn) {
      this.mobileToggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
      this.mobileToggleBtn.setAttribute('aria-expanded', 'false');
      this.mobileToggleBtn.setAttribute('aria-controls', this.sidebar.id || 'nav-sidebar');
    }

    // Desktop toggle ARIA
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute('aria-label', 'Toggle navigation collapse');
      this.toggleBtn.setAttribute('aria-pressed', 'false');
    }
  }

  /**
   * Get all focusable navigation items
   * @returns {Array} Array of focusable elements
   */
  getFocusableItems() {
    if (!this.sidebar) return [];

    const focusable = this.sidebar.querySelectorAll(
      '.nav-item__link:not([disabled])'
    );

    // Filter out hidden items in collapsed sub-menus
    return Array.from(focusable).filter(item => {
      const parentSubmenu = item.closest('.nav-submenu');
      if (parentSubmenu) {
        const parentItem = parentSubmenu.closest(this.options.expandableSelector);
        return parentItem && parentItem.classList.contains(this.options.expandedClass);
      }
      return true;
    });
  }

  /**
   * Focus next navigation item
   * @param {Array} items - Focusable items
   * @param {number} currentIndex - Current focused item index
   */
  focusNextItem(items, currentIndex) {
    const nextIndex = (currentIndex + 1) % items.length;
    items[nextIndex].focus();
  }

  /**
   * Focus previous navigation item
   * @param {Array} items - Focusable items
   * @param {number} currentIndex - Current focused item index
   */
  focusPreviousItem(items, currentIndex) {
    const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
    items[prevIndex].focus();
  }

  /**
   * Focus first navigation item
   * @param {Array} items - Focusable items
   */
  focusFirstItem(items) {
    if (items.length > 0) {
      items[0].focus();
    }
  }

  /**
   * Focus last navigation item
   * @param {Array} items - Focusable items
   */
  focusLastItem(items) {
    if (items.length > 0) {
      items[items.length - 1].focus();
    }
  }

  /**
   * Handle expandable item click
   * @param {Event} e - Click event
   * @param {HTMLElement} item - Nav item element
   */
  handleExpandableClick(e, item) {
    e.preventDefault();
    this.toggleExpand(item);
  }

  /**
   * Handle regular nav item click
   * @param {Event} e - Click event
   * @param {HTMLElement} item - Nav item element
   * @param {number} index - Item index
   */
  handleItemClick(e, item, index) {
    this.setActiveItem(item);

    // Close mobile menu after navigation
    if (window.innerWidth < 1024) {
      this.closeMobile();
    }

    // Allow default link navigation
  }

  /**
   * Toggle expandable item
   * @param {HTMLElement} item - Nav item element
   */
  toggleExpand(item) {
    const isExpanded = item.classList.contains(this.options.expandedClass);

    if (isExpanded) {
      this.collapse(item);
    } else {
      this.expand(item);
    }
  }

  /**
   * Expand navigation item
   * @param {HTMLElement} item - Nav item element
   */
  expand(item) {
    item.classList.add(this.options.expandedClass);

    const link = item.querySelector('.nav-item__link');
    if (link) {
      link.setAttribute('aria-expanded', 'true');
    }

    this.saveState();
    this.emit('nav:expand', { item });
  }

  /**
   * Collapse navigation item
   * @param {HTMLElement} item - Nav item element
   */
  collapse(item) {
    item.classList.remove(this.options.expandedClass);

    const link = item.querySelector('.nav-item__link');
    if (link) {
      link.setAttribute('aria-expanded', 'false');
    }

    this.saveState();
    this.emit('nav:collapse', { item });
  }

  /**
   * Set active navigation item
   * @param {HTMLElement} item - Nav item element
   */
  setActiveItem(item) {
    // Remove active class from all items
    this.navItems.forEach(navItem => {
      navItem.classList.remove(this.options.activeClass);
      const link = navItem.querySelector('.nav-item__link');
      if (link) {
        link.removeAttribute('aria-current');
      }
    });

    // Add active class to selected item
    item.classList.add(this.options.activeClass);
    const link = item.querySelector('.nav-item__link');
    if (link) {
      link.setAttribute('aria-current', 'page');
    }

    // Expand parent items if nested
    let parentItem = item.closest('.nav-submenu')?.closest(this.options.expandableSelector);
    while (parentItem) {
      this.expand(parentItem);
      parentItem = parentItem.closest('.nav-submenu')?.closest(this.options.expandableSelector);
    }

    this.saveState();
    this.emit('nav:activate', { item });
  }

  /**
   * Toggle sidebar collapse (desktop)
   */
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;

    if (this.isCollapsed) {
      this.sidebar.classList.add(this.options.collapsedClass);
      if (this.toggleBtn) {
        this.toggleBtn.setAttribute('aria-pressed', 'true');
        this.toggleBtn.setAttribute('aria-label', 'Expand navigation');
      }
    } else {
      this.sidebar.classList.remove(this.options.collapsedClass);
      if (this.toggleBtn) {
        this.toggleBtn.setAttribute('aria-pressed', 'false');
        this.toggleBtn.setAttribute('aria-label', 'Collapse navigation');
      }
    }

    this.saveState();
    this.emit('nav:toggle', { collapsed: this.isCollapsed });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobile() {
    if (this.isMobileOpen) {
      this.closeMobile();
    } else {
      this.openMobile();
    }
  }

  /**
   * Open mobile menu
   */
  openMobile() {
    this.isMobileOpen = true;
    this.sidebar.classList.add(this.options.openClass);

    if (this.overlay) {
      this.overlay.classList.add(this.options.overlayVisibleClass);
    }

    if (this.mobileToggleBtn) {
      this.mobileToggleBtn.setAttribute('aria-expanded', 'true');
      this.mobileToggleBtn.setAttribute('aria-label', 'Close navigation menu');
    }

    // Trap focus in mobile menu
    this.trapFocus(true);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    this.emit('nav:open', {});
  }

  /**
   * Close mobile menu
   */
  closeMobile() {
    this.isMobileOpen = false;
    this.sidebar.classList.remove(this.options.openClass);

    if (this.overlay) {
      this.overlay.classList.remove(this.options.overlayVisibleClass);
    }

    if (this.mobileToggleBtn) {
      this.mobileToggleBtn.setAttribute('aria-expanded', 'false');
      this.mobileToggleBtn.setAttribute('aria-label', 'Open navigation menu');
    }

    // Release focus trap
    this.trapFocus(false);

    // Restore body scroll
    document.body.style.overflow = '';

    this.emit('nav:close', {});
  }

  /**
   * Trap or release focus
   * @param {boolean} trap - Whether to trap focus
   */
  trapFocus(trap) {
    if (!this.sidebar) return;

    if (trap) {
      const focusableElements = this.sidebar.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.focusTrapHandler = (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        };

        document.addEventListener('keydown', this.focusTrapHandler);
        firstElement.focus();
      }
    } else {
      if (this.focusTrapHandler) {
        document.removeEventListener('keydown', this.focusTrapHandler);
        this.focusTrapHandler = null;
      }
    }
  }

  /**
   * Scroll to active navigation item
   */
  scrollToActiveItem() {
    const activeItem = this.sidebar?.querySelector(`.${this.options.activeClass}`);
    if (activeItem) {
      setTimeout(() => {
        activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Close mobile menu on desktop breakpoint
    if (window.innerWidth >= 1024 && this.isMobileOpen) {
      this.closeMobile();
    }
  }

  /**
   * Save navigation state to localStorage
   */
  saveState() {
    if (!this.options.persistState) return;

    const state = {
      collapsed: this.isCollapsed,
      expanded: this.expandableItems
        .filter(item => item.classList.contains(this.options.expandedClass))
        .map(item => this.getItemIdentifier(item)),
      active: this.getItemIdentifier(
        this.sidebar?.querySelector(`.${this.options.activeClass}`)
      )
    };

    try {
      localStorage.setItem(this.options.storageKey, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save navigation state:', e);
    }
  }

  /**
   * Restore navigation state from localStorage
   */
  restoreState() {
    if (!this.options.persistState) return;

    try {
      const savedState = localStorage.getItem(this.options.storageKey);
      if (!savedState) return;

      const state = JSON.parse(savedState);

      // Restore collapsed state
      if (state.collapsed && window.innerWidth >= 1024) {
        this.isCollapsed = true;
        this.sidebar?.classList.add(this.options.collapsedClass);
        if (this.toggleBtn) {
          this.toggleBtn.setAttribute('aria-pressed', 'true');
        }
      }

      // Restore expanded items
      if (state.expanded && Array.isArray(state.expanded)) {
        state.expanded.forEach(identifier => {
          const item = this.findItemByIdentifier(identifier);
          if (item) {
            this.expand(item);
          }
        });
      }
    } catch (e) {
      console.warn('Failed to restore navigation state:', e);
    }
  }

  /**
   * Get unique identifier for nav item
   * @param {HTMLElement} item - Nav item element
   * @returns {string|null} Identifier
   */
  getItemIdentifier(item) {
    if (!item) return null;

    const link = item.querySelector('.nav-item__link');
    return link?.getAttribute('href') || link?.getAttribute('data-nav-id') || null;
  }

  /**
   * Find nav item by identifier
   * @param {string} identifier - Item identifier
   * @returns {HTMLElement|null} Nav item element
   */
  findItemByIdentifier(identifier) {
    if (!identifier) return null;

    return this.navItems.find(item => {
      const link = item.querySelector('.nav-item__link');
      return link?.getAttribute('href') === identifier ||
             link?.getAttribute('data-nav-id') === identifier;
    });
  }

  /**
   * Emit custom event
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail data
   */
  emit(eventName, detail) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });

    if (this.sidebar) {
      this.sidebar.dispatchEvent(event);
    }
  }

  /**
   * Destroy navigation instance
   */
  destroy() {
    // Remove event listeners
    if (this.focusTrapHandler) {
      document.removeEventListener('keydown', this.focusTrapHandler);
    }

    // Clear references
    this.sidebar = null;
    this.overlay = null;
    this.toggleBtn = null;
    this.mobileToggleBtn = null;
    this.navItems = [];
    this.expandableItems = [];

    console.log('Navigation destroyed');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
