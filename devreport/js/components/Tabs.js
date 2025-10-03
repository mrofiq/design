/**
 * Developer Report Dashboard - Tabs Component
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * Interactive tab navigation with keyboard support and ARIA attributes.
 * Supports horizontal and vertical layouts with various interaction patterns.
 */

class Tabs {
  /**
   * Initialize the Tabs component
   * @param {HTMLElement} element - The tabs container element
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      defaultTab: 0,
      orientation: 'horizontal', // 'horizontal' or 'vertical'
      activationMode: 'automatic', // 'automatic' or 'manual'
      onTabChange: null,
      enableHistory: false,
      historyKey: 'tab',
      ...options
    };

    this.tabList = null;
    this.tabs = [];
    this.panels = [];
    this.currentTab = this.options.defaultTab;

    this.init();
  }

  /**
   * Initialize the component
   */
  init() {
    this.findElements();
    this.setupARIA();
    this.attachEventListeners();
    this.handleInitialState();
  }

  /**
   * Find and cache DOM elements
   */
  findElements() {
    this.tabList = this.element.querySelector('[role="tablist"]');
    if (!this.tabList) {
      console.error('Tabs: No element with role="tablist" found');
      return;
    }

    this.tabs = Array.from(this.tabList.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.element.querySelectorAll('[role="tabpanel"]'));

    if (this.tabs.length === 0) {
      console.error('Tabs: No tab elements found');
    }

    if (this.tabs.length !== this.panels.length) {
      console.warn('Tabs: Number of tabs and panels do not match');
    }
  }

  /**
   * Setup ARIA attributes and relationships
   */
  setupARIA() {
    // Set orientation
    this.tabList.setAttribute('aria-orientation', this.options.orientation);

    // Setup tabs and panels
    this.tabs.forEach((tab, index) => {
      const panel = this.panels[index];
      if (!panel) return;

      // Generate IDs if not present
      const tabId = tab.id || `tab-${this.generateId()}`;
      const panelId = panel.id || `panel-${this.generateId()}`;

      tab.id = tabId;
      panel.id = panelId;

      // Set ARIA attributes
      tab.setAttribute('aria-controls', panelId);
      panel.setAttribute('aria-labelledby', tabId);

      // Set tabindex
      tab.setAttribute('tabindex', index === this.currentTab ? '0' : '-1');

      // Set initial states
      if (index === this.currentTab) {
        tab.setAttribute('aria-selected', 'true');
        tab.classList.add('tabs__tab--active');
        panel.setAttribute('aria-hidden', 'false');
        panel.classList.add('tabs__panel--active');
      } else {
        tab.setAttribute('aria-selected', 'false');
        tab.classList.remove('tabs__tab--active');
        panel.setAttribute('aria-hidden', 'true');
        panel.classList.remove('tabs__panel--active');
      }
    });
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Click events
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.activateTab(index);
      });
    });

    // Keyboard navigation
    this.tabList.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Handle browser back/forward with history API
    if (this.options.enableHistory) {
      window.addEventListener('popstate', () => this.handleHistoryChange());
    }
  }

  /**
   * Handle initial state (URL hash or default)
   */
  handleInitialState() {
    if (this.options.enableHistory) {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get(this.options.historyKey);

      if (tabParam !== null) {
        const tabIndex = this.tabs.findIndex(tab =>
          tab.getAttribute('data-tab-key') === tabParam ||
          tab.id === tabParam
        );

        if (tabIndex !== -1) {
          this.activateTab(tabIndex, false);
          return;
        }
      }
    }

    // Use default tab
    this.activateTab(this.currentTab, false);
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyboard(e) {
    const { key } = e;
    let newIndex = this.currentTab;

    // Determine navigation based on orientation
    const nextKey = this.options.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prevKey = this.options.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    switch (key) {
      case nextKey:
        e.preventDefault();
        newIndex = this.getNextTab(this.currentTab);
        break;

      case prevKey:
        e.preventDefault();
        newIndex = this.getPreviousTab(this.currentTab);
        break;

      case 'Home':
        e.preventDefault();
        newIndex = this.getFirstEnabledTab();
        break;

      case 'End':
        e.preventDefault();
        newIndex = this.getLastEnabledTab();
        break;

      case 'Enter':
      case ' ':
        // Manual activation mode - activate on Enter/Space
        if (this.options.activationMode === 'manual') {
          e.preventDefault();
          this.activateTab(this.currentTab);
          return;
        }
        break;

      default:
        return;
    }

    // Focus the new tab
    if (newIndex !== this.currentTab) {
      this.tabs[newIndex].focus();

      // Automatic activation mode - activate on focus
      if (this.options.activationMode === 'automatic') {
        this.activateTab(newIndex);
      } else {
        // Manual mode - just move focus, don't activate
        this.currentTab = newIndex;
      }
    }
  }

  /**
   * Activate a tab
   * @param {number} index - Tab index to activate
   * @param {boolean} updateHistory - Whether to update browser history
   */
  activateTab(index, updateHistory = true) {
    // Check if tab is disabled
    const targetTab = this.tabs[index];
    if (!targetTab || targetTab.disabled || targetTab.classList.contains('tabs__tab--disabled')) {
      return;
    }

    // Deactivate all tabs
    this.tabs.forEach((tab, i) => {
      const panel = this.panels[i];
      if (!panel) return;

      if (i === index) {
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        tab.classList.add('tabs__tab--active');
        panel.setAttribute('aria-hidden', 'false');
        panel.classList.add('tabs__panel--active');
      } else {
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
        tab.classList.remove('tabs__tab--active');
        panel.setAttribute('aria-hidden', 'true');
        panel.classList.remove('tabs__panel--active');
      }
    });

    this.currentTab = index;

    // Update underline indicator position if present
    this.updateIndicator();

    // Update browser history
    if (this.options.enableHistory && updateHistory) {
      this.updateHistory(index);
    }

    // Callback
    if (typeof this.options.onTabChange === 'function') {
      this.options.onTabChange(index, targetTab, this.panels[index]);
    }

    // Dispatch custom event
    this.element.dispatchEvent(new CustomEvent('tabchange', {
      detail: { index, tab: targetTab, panel: this.panels[index] }
    }));
  }

  /**
   * Update the underline indicator position
   */
  updateIndicator() {
    if (!this.tabList.classList.contains('tabs__list--underline')) {
      return;
    }

    const activeTab = this.tabs[this.currentTab];
    if (!activeTab) return;

    // Create indicator if it doesn't exist
    let indicator = this.tabList.querySelector('.tabs__indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'tabs__indicator';
      this.tabList.appendChild(indicator);
    }

    // Update indicator position
    const { offsetLeft, offsetWidth } = activeTab;
    indicator.style.transform = `translateX(${offsetLeft}px)`;
    indicator.style.width = `${offsetWidth}px`;
  }

  /**
   * Get next enabled tab index
   * @param {number} currentIndex - Current tab index
   * @returns {number} Next tab index
   */
  getNextTab(currentIndex) {
    let nextIndex = currentIndex + 1;
    while (nextIndex < this.tabs.length) {
      if (!this.isTabDisabled(nextIndex)) {
        return nextIndex;
      }
      nextIndex++;
    }
    // Wrap around
    return this.getFirstEnabledTab();
  }

  /**
   * Get previous enabled tab index
   * @param {number} currentIndex - Current tab index
   * @returns {number} Previous tab index
   */
  getPreviousTab(currentIndex) {
    let prevIndex = currentIndex - 1;
    while (prevIndex >= 0) {
      if (!this.isTabDisabled(prevIndex)) {
        return prevIndex;
      }
      prevIndex--;
    }
    // Wrap around
    return this.getLastEnabledTab();
  }

  /**
   * Get first enabled tab index
   * @returns {number} First enabled tab index
   */
  getFirstEnabledTab() {
    for (let i = 0; i < this.tabs.length; i++) {
      if (!this.isTabDisabled(i)) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Get last enabled tab index
   * @returns {number} Last enabled tab index
   */
  getLastEnabledTab() {
    for (let i = this.tabs.length - 1; i >= 0; i--) {
      if (!this.isTabDisabled(i)) {
        return i;
      }
    }
    return this.tabs.length - 1;
  }

  /**
   * Check if tab is disabled
   * @param {number} index - Tab index
   * @returns {boolean} Whether tab is disabled
   */
  isTabDisabled(index) {
    const tab = this.tabs[index];
    return tab && (tab.disabled || tab.classList.contains('tabs__tab--disabled'));
  }

  /**
   * Update browser history
   * @param {number} index - Tab index
   */
  updateHistory(index) {
    const tab = this.tabs[index];
    const tabKey = tab.getAttribute('data-tab-key') || tab.id;

    const url = new URL(window.location);
    url.searchParams.set(this.options.historyKey, tabKey);
    window.history.pushState({ tabIndex: index }, '', url);
  }

  /**
   * Handle browser history change
   */
  handleHistoryChange() {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get(this.options.historyKey);

    if (tabParam !== null) {
      const tabIndex = this.tabs.findIndex(tab =>
        tab.getAttribute('data-tab-key') === tabParam ||
        tab.id === tabParam
      );

      if (tabIndex !== -1) {
        this.activateTab(tabIndex, false);
      }
    }
  }

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Enable a tab
   * @param {number} index - Tab index to enable
   */
  enableTab(index) {
    const tab = this.tabs[index];
    if (tab) {
      tab.disabled = false;
      tab.classList.remove('tabs__tab--disabled');
      tab.removeAttribute('aria-disabled');
    }
  }

  /**
   * Disable a tab
   * @param {number} index - Tab index to disable
   */
  disableTab(index) {
    const tab = this.tabs[index];
    if (tab) {
      tab.disabled = true;
      tab.classList.add('tabs__tab--disabled');
      tab.setAttribute('aria-disabled', 'true');

      // If current tab is being disabled, switch to next enabled tab
      if (index === this.currentTab) {
        const nextTab = this.getNextTab(index);
        if (nextTab !== index) {
          this.activateTab(nextTab);
        }
      }
    }
  }

  /**
   * Get current active tab index
   * @returns {number} Current tab index
   */
  getCurrentTab() {
    return this.currentTab;
  }

  /**
   * Destroy the component
   */
  destroy() {
    // Remove event listeners
    this.tabs.forEach(tab => {
      tab.replaceWith(tab.cloneNode(true));
    });

    if (this.options.enableHistory) {
      window.removeEventListener('popstate', this.handleHistoryChange);
    }

    // Clean up
    this.element = null;
    this.tabList = null;
    this.tabs = [];
    this.panels = [];
  }
}

// Auto-initialize tabs with data-tabs attribute
document.addEventListener('DOMContentLoaded', () => {
  const tabsElements = document.querySelectorAll('[data-tabs]');

  tabsElements.forEach(element => {
    const options = {
      orientation: element.dataset.tabsOrientation || 'horizontal',
      activationMode: element.dataset.tabsActivation || 'automatic',
      enableHistory: element.dataset.tabsHistory === 'true',
      historyKey: element.dataset.tabsHistoryKey || 'tab'
    };

    new Tabs(element, options);
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Tabs;
}
