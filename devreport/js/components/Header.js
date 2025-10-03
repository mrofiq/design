/**
 * Header Component
 * Developer Report Dashboard
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * Features:
 * - Search functionality with keyboard navigation
 * - Notification dropdown with badge updates
 * - User menu dropdown
 * - Click outside to close
 * - ARIA attributes for accessibility
 * - Mobile menu toggle
 * - Escape key to close dropdowns
 */

class Header {
  constructor(options = {}) {
    this.options = {
      searchMinChars: 2,
      searchDebounceDelay: 300,
      notificationPollInterval: 60000, // 1 minute
      maxSearchResults: 10,
      ...options
    };

    this.state = {
      searchQuery: '',
      searchResults: [],
      searchSelectedIndex: -1,
      isSearchOpen: false,
      isNotificationOpen: false,
      isUserMenuOpen: false,
      isMobileSearchOpen: false,
      notificationCount: 0,
      notifications: [],
      unreadNotifications: 0
    };

    this.searchDebounceTimer = null;
    this.notificationPollTimer = null;

    this.init();
  }

  /**
   * Initialize the header component
   */
  init() {
    this.cacheElements();
    this.attachEventListeners();
    this.setupAccessibility();
    this.loadNotifications();
    this.startNotificationPolling();
  }

  /**
   * Cache DOM elements for better performance
   */
  cacheElements() {
    // Main header elements
    this.header = document.querySelector('.header');
    this.mobileMenuToggle = document.querySelector('.header-menu-toggle');

    // Search elements
    this.searchContainer = document.querySelector('.header-search');
    this.searchInput = document.querySelector('.header-search-input');
    this.searchClearBtn = document.querySelector('.header-search-clear');
    this.searchResults = document.querySelector('.header-search-results');
    this.searchResultsList = document.querySelector('.header-search-results-list');
    this.mobileSearchContainer = document.querySelector('.header-center');

    // Notification elements
    this.notificationBtn = document.querySelector('[data-dropdown="notifications"]');
    this.notificationBadge = document.querySelector('.header-notification-badge');
    this.notificationDropdown = document.querySelector('#notifications-dropdown');
    this.notificationList = document.querySelector('#notifications-list');

    // User menu elements
    this.userMenuBtn = document.querySelector('[data-dropdown="user-menu"]');
    this.userMenuDropdown = document.querySelector('#user-menu-dropdown');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileSearch());
    }

    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
      this.searchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
      this.searchInput.addEventListener('focus', () => this.handleSearchFocus());
    }

    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => this.clearSearch());
    }

    // Notification dropdown
    if (this.notificationBtn) {
      this.notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNotificationDropdown();
      });
    }

    // User menu dropdown
    if (this.userMenuBtn) {
      this.userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleUserMenuDropdown();
      });
    }

    // Click outside to close
    document.addEventListener('click', (e) => this.handleClickOutside(e));

    // Escape key to close dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDropdowns();
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Setup accessibility attributes
   */
  setupAccessibility() {
    // Search
    if (this.searchInput) {
      this.searchInput.setAttribute('aria-autocomplete', 'list');
      this.searchInput.setAttribute('aria-controls', 'search-results');
      this.searchInput.setAttribute('aria-expanded', 'false');
    }

    if (this.searchResults) {
      this.searchResults.setAttribute('role', 'listbox');
      this.searchResults.setAttribute('id', 'search-results');
    }

    // Notification dropdown
    if (this.notificationBtn) {
      this.notificationBtn.setAttribute('aria-haspopup', 'true');
      this.notificationBtn.setAttribute('aria-expanded', 'false');
      this.notificationBtn.setAttribute('aria-label', `Notifications (${this.state.unreadNotifications} unread)`);
    }

    if (this.notificationDropdown) {
      this.notificationDropdown.setAttribute('role', 'menu');
      this.notificationDropdown.setAttribute('aria-label', 'Notifications menu');
    }

    // User menu dropdown
    if (this.userMenuBtn) {
      this.userMenuBtn.setAttribute('aria-haspopup', 'true');
      this.userMenuBtn.setAttribute('aria-expanded', 'false');
    }

    if (this.userMenuDropdown) {
      this.userMenuDropdown.setAttribute('role', 'menu');
      this.userMenuDropdown.setAttribute('aria-label', 'User menu');
    }
  }

  /**
   * Handle search input with debouncing
   */
  handleSearchInput(event) {
    const query = event.target.value.trim();
    this.state.searchQuery = query;

    // Clear previous timer
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    // Debounce search
    this.searchDebounceTimer = setTimeout(() => {
      if (query.length >= this.options.searchMinChars) {
        this.performSearch(query);
      } else {
        this.closeSearch();
      }
    }, this.options.searchDebounceDelay);
  }

  /**
   * Perform search and display results
   */
  async performSearch(query) {
    try {
      // Simulate API call - replace with actual search endpoint
      const results = await this.fetchSearchResults(query);

      this.state.searchResults = results;
      this.state.searchSelectedIndex = -1;

      this.renderSearchResults(results);
      this.openSearch();
    } catch (error) {
      console.error('Search error:', error);
      this.renderSearchError();
    }
  }

  /**
   * Fetch search results (mock implementation)
   */
  async fetchSearchResults(query) {
    // Mock data - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResults = [
          { id: 1, type: 'developer', title: 'John Doe', subtitle: 'Senior Developer', icon: 'user' },
          { id: 2, type: 'project', title: 'Project Alpha', subtitle: 'Web Application', icon: 'folder' },
          { id: 3, type: 'report', title: 'Monthly Report - September', subtitle: 'Report', icon: 'file-text' },
          { id: 4, type: 'developer', title: 'Jane Smith', subtitle: 'Junior Developer', icon: 'user' },
          { id: 5, type: 'task', title: 'Fix authentication bug', subtitle: 'Task #1234', icon: 'check-circle' }
        ].filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
        ).slice(0, this.options.maxSearchResults);

        resolve(mockResults);
      }, 300);
    });
  }

  /**
   * Render search results
   */
  renderSearchResults(results) {
    if (!this.searchResultsList) return;

    if (results.length === 0) {
      this.searchResultsList.innerHTML = `
        <div class="header-search-no-results">
          No results found for "${this.state.searchQuery}"
        </div>
      `;
      return;
    }

    const iconMap = {
      user: `<svg class="header-search-result-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`,
      folder: `<svg class="header-search-result-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`,
      'file-text': `<svg class="header-search-result-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`,
      'check-circle': `<svg class="header-search-result-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    };

    this.searchResultsList.innerHTML = results.map((result, index) => `
      <li role="option"
          aria-selected="${index === this.state.searchSelectedIndex}"
          class="header-search-result-item ${index === this.state.searchSelectedIndex ? 'is-selected' : ''}"
          data-index="${index}"
          data-id="${result.id}">
        ${iconMap[result.icon] || ''}
        <div class="header-search-result-content">
          <div class="header-search-result-title">${this.highlightQuery(result.title)}</div>
          <div class="header-search-result-subtitle">${result.subtitle}</div>
        </div>
      </li>
    `).join('');

    // Attach click handlers to results
    this.searchResultsList.querySelectorAll('.header-search-result-item').forEach(item => {
      item.addEventListener('click', () => this.selectSearchResult(parseInt(item.dataset.index)));
      item.addEventListener('mouseenter', () => {
        this.state.searchSelectedIndex = parseInt(item.dataset.index);
        this.updateSearchSelection();
      });
    });
  }

  /**
   * Highlight search query in results
   */
  highlightQuery(text) {
    const regex = new RegExp(`(${this.state.searchQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Render search error
   */
  renderSearchError() {
    if (!this.searchResultsList) return;

    this.searchResultsList.innerHTML = `
      <div class="header-search-no-results">
        An error occurred while searching. Please try again.
      </div>
    `;
  }

  /**
   * Handle keyboard navigation in search
   */
  handleSearchKeydown(event) {
    if (!this.state.isSearchOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateSearchResults('down');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateSearchResults('up');
        break;
      case 'Enter':
        event.preventDefault();
        if (this.state.searchSelectedIndex >= 0) {
          this.selectSearchResult(this.state.searchSelectedIndex);
        }
        break;
      case 'Escape':
        this.closeSearch();
        break;
    }
  }

  /**
   * Navigate through search results
   */
  navigateSearchResults(direction) {
    const maxIndex = this.state.searchResults.length - 1;

    if (direction === 'down') {
      this.state.searchSelectedIndex = Math.min(this.state.searchSelectedIndex + 1, maxIndex);
    } else {
      this.state.searchSelectedIndex = Math.max(this.state.searchSelectedIndex - 1, -1);
    }

    this.updateSearchSelection();
    this.scrollToSelectedResult();
  }

  /**
   * Update search result selection
   */
  updateSearchSelection() {
    const items = this.searchResultsList?.querySelectorAll('.header-search-result-item');
    if (!items) return;

    items.forEach((item, index) => {
      const isSelected = index === this.state.searchSelectedIndex;
      item.classList.toggle('is-selected', isSelected);
      item.setAttribute('aria-selected', isSelected);
    });
  }

  /**
   * Scroll to selected search result
   */
  scrollToSelectedResult() {
    const selectedItem = this.searchResultsList?.querySelector('.is-selected');
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /**
   * Select a search result
   */
  selectSearchResult(index) {
    const result = this.state.searchResults[index];
    if (!result) return;

    console.log('Selected search result:', result);

    // Navigate to the result or trigger action
    // Example: window.location.href = `/view/${result.type}/${result.id}`;

    this.closeSearch();
    this.clearSearch();
  }

  /**
   * Handle search focus
   */
  handleSearchFocus() {
    if (this.state.searchResults.length > 0) {
      this.openSearch();
    }
  }

  /**
   * Open search results
   */
  openSearch() {
    this.state.isSearchOpen = true;
    this.searchResults?.classList.add('is-active');
    this.searchInput?.setAttribute('aria-expanded', 'true');
  }

  /**
   * Close search results
   */
  closeSearch() {
    this.state.isSearchOpen = false;
    this.searchResults?.classList.remove('is-active');
    this.searchInput?.setAttribute('aria-expanded', 'false');
    this.state.searchSelectedIndex = -1;
  }

  /**
   * Clear search input and results
   */
  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.state.searchQuery = '';
    this.state.searchResults = [];
    this.closeSearch();
  }

  /**
   * Toggle mobile search
   */
  toggleMobileSearch() {
    this.state.isMobileSearchOpen = !this.state.isMobileSearchOpen;
    this.mobileSearchContainer?.classList.toggle('is-active', this.state.isMobileSearchOpen);

    if (this.state.isMobileSearchOpen) {
      setTimeout(() => this.searchInput?.focus(), 100);
    }
  }

  /**
   * Toggle notification dropdown
   */
  toggleNotificationDropdown() {
    this.state.isNotificationOpen = !this.state.isNotificationOpen;

    if (this.state.isUserMenuOpen) {
      this.closeUserMenu();
    }

    this.notificationDropdown?.classList.toggle('is-active', this.state.isNotificationOpen);
    this.notificationBtn?.classList.toggle('is-active', this.state.isNotificationOpen);
    this.notificationBtn?.setAttribute('aria-expanded', this.state.isNotificationOpen);

    if (this.state.isNotificationOpen) {
      this.markNotificationsAsRead();
    }
  }

  /**
   * Close notification dropdown
   */
  closeNotificationDropdown() {
    this.state.isNotificationOpen = false;
    this.notificationDropdown?.classList.remove('is-active');
    this.notificationBtn?.classList.remove('is-active');
    this.notificationBtn?.setAttribute('aria-expanded', 'false');
  }

  /**
   * Toggle user menu dropdown
   */
  toggleUserMenuDropdown() {
    this.state.isUserMenuOpen = !this.state.isUserMenuOpen;

    if (this.state.isNotificationOpen) {
      this.closeNotificationDropdown();
    }

    this.userMenuDropdown?.classList.toggle('is-active', this.state.isUserMenuOpen);
    this.userMenuBtn?.classList.toggle('is-active', this.state.isUserMenuOpen);
    this.userMenuBtn?.setAttribute('aria-expanded', this.state.isUserMenuOpen);
  }

  /**
   * Close user menu dropdown
   */
  closeUserMenu() {
    this.state.isUserMenuOpen = false;
    this.userMenuDropdown?.classList.remove('is-active');
    this.userMenuBtn?.classList.remove('is-active');
    this.userMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  /**
   * Close all dropdowns
   */
  closeAllDropdowns() {
    this.closeSearch();
    this.closeNotificationDropdown();
    this.closeUserMenu();
  }

  /**
   * Handle click outside to close dropdowns
   */
  handleClickOutside(event) {
    // Close search
    if (this.state.isSearchOpen &&
        !this.searchContainer?.contains(event.target)) {
      this.closeSearch();
    }

    // Close notification dropdown
    if (this.state.isNotificationOpen &&
        !this.notificationBtn?.contains(event.target) &&
        !this.notificationDropdown?.contains(event.target)) {
      this.closeNotificationDropdown();
    }

    // Close user menu
    if (this.state.isUserMenuOpen &&
        !this.userMenuBtn?.contains(event.target) &&
        !this.userMenuDropdown?.contains(event.target)) {
      this.closeUserMenu();
    }
  }

  /**
   * Load notifications
   */
  async loadNotifications() {
    try {
      // Mock data - replace with actual API call
      const notifications = await this.fetchNotifications();
      this.state.notifications = notifications;
      this.updateNotificationCount();
      this.renderNotifications();
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  /**
   * Fetch notifications (mock implementation)
   */
  async fetchNotifications() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            type: 'info',
            title: 'New report available',
            message: 'Monthly performance report is ready',
            time: '5 minutes ago',
            isRead: false
          },
          {
            id: 2,
            type: 'warning',
            title: 'Deadline approaching',
            message: 'Project deadline in 2 days',
            time: '1 hour ago',
            isRead: false
          },
          {
            id: 3,
            type: 'success',
            title: 'Task completed',
            message: 'Your assigned task has been completed',
            time: '3 hours ago',
            isRead: true
          }
        ]);
      }, 300);
    });
  }

  /**
   * Render notifications
   */
  renderNotifications() {
    if (!this.notificationList) return;

    if (this.state.notifications.length === 0) {
      this.notificationList.innerHTML = `
        <div class="header-dropdown-empty">
          <svg class="header-dropdown-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <h3 class="header-dropdown-empty-title">No notifications</h3>
          <p class="header-dropdown-empty-text">You're all caught up!</p>
        </div>
      `;
      return;
    }

    const typeIcons = {
      info: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
      warning: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
      success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    };

    this.notificationList.innerHTML = this.state.notifications.map(notification => `
      <button class="header-dropdown-item header-notification-item ${!notification.isRead ? 'is-unread' : ''}"
              data-notification-id="${notification.id}"
              role="menuitem">
        <div class="header-dropdown-item-icon">
          ${typeIcons[notification.type] || typeIcons.info}
        </div>
        <div class="header-dropdown-item-content">
          <div class="header-dropdown-item-title">${notification.title}</div>
          <div class="header-dropdown-item-subtitle">${notification.message}</div>
          <div class="header-notification-item-time">${notification.time}</div>
        </div>
      </button>
    `).join('');

    // Attach click handlers
    this.notificationList.querySelectorAll('.header-notification-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = parseInt(item.dataset.notificationId);
        this.handleNotificationClick(id);
      });
    });
  }

  /**
   * Handle notification click
   */
  handleNotificationClick(notificationId) {
    console.log('Notification clicked:', notificationId);
    // Handle notification click action
    this.closeNotificationDropdown();
  }

  /**
   * Update notification count
   */
  updateNotificationCount() {
    this.state.unreadNotifications = this.state.notifications.filter(n => !n.isRead).length;
    this.state.notificationCount = this.state.notifications.length;

    if (this.notificationBadge) {
      if (this.state.unreadNotifications > 0) {
        this.notificationBadge.textContent = this.state.unreadNotifications > 99 ? '99+' : this.state.unreadNotifications;
        this.notificationBadge.style.display = 'flex';
        this.notificationBadge.classList.add('is-pulse');
      } else {
        this.notificationBadge.style.display = 'none';
        this.notificationBadge.classList.remove('is-pulse');
      }
    }

    // Update ARIA label
    if (this.notificationBtn) {
      this.notificationBtn.setAttribute('aria-label', `Notifications (${this.state.unreadNotifications} unread)`);
    }
  }

  /**
   * Mark notifications as read
   */
  markNotificationsAsRead() {
    this.state.notifications.forEach(notification => {
      notification.isRead = true;
    });

    this.updateNotificationCount();
    this.renderNotifications();
  }

  /**
   * Start notification polling
   */
  startNotificationPolling() {
    this.notificationPollTimer = setInterval(() => {
      this.loadNotifications();
    }, this.options.notificationPollInterval);
  }

  /**
   * Stop notification polling
   */
  stopNotificationPolling() {
    if (this.notificationPollTimer) {
      clearInterval(this.notificationPollTimer);
      this.notificationPollTimer = null;
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Close mobile search on desktop
    if (window.innerWidth > 768 && this.state.isMobileSearchOpen) {
      this.state.isMobileSearchOpen = false;
      this.mobileSearchContainer?.classList.remove('is-active');
    }
  }

  /**
   * Destroy the component and cleanup
   */
  destroy() {
    this.stopNotificationPolling();

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    // Remove event listeners would go here if needed
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.headerInstance = new Header();
  });
} else {
  window.headerInstance = new Header();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Header;
}
