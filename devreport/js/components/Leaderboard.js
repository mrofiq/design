/**
 * Developer Report Dashboard - Leaderboard Component
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * Comprehensive leaderboard component with:
 * - Real-time data updates via WebSocket
 * - Multiple view types (Individual, Team, Department)
 * - Time period filtering (Weekly, Monthly, Quarterly)
 * - Pagination support
 * - Search functionality
 * - Smooth rank transitions
 * - Auto-refresh every 60 seconds
 */

class LeaderboardComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    // Configuration
    this.config = {
      apiEndpoint: options.apiEndpoint || '/api/leaderboard',
      wsEndpoint: options.wsEndpoint || 'ws://localhost:3000/leaderboard',
      viewType: options.viewType || 'individual', // individual, team, department
      period: options.period || 'weekly', // weekly, monthly, quarterly
      compact: options.compact || false,
      showPodium: options.showPodium !== false,
      pageSize: options.pageSize || 10,
      autoRefresh: options.autoRefresh !== false,
      refreshInterval: options.refreshInterval || 60000, // 60 seconds
      currentUserId: options.currentUserId || null,
      enableWebSocket: options.enableWebSocket !== false,
      showSearch: options.showSearch !== false,
      ...options
    };

    // State
    this.state = {
      data: [],
      filteredData: [],
      currentPage: 1,
      totalPages: 1,
      loading: false,
      searchQuery: '',
      previousRanks: new Map()
    };

    // WebSocket connection
    this.ws = null;
    this.refreshTimer = null;

    this.init();
  }

  /**
   * Initialize the leaderboard component
   */
  async init() {
    this.render();
    await this.fetchData();
    this.setupEventListeners();

    if (this.config.enableWebSocket) {
      this.connectWebSocket();
    }

    if (this.config.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  /**
   * Render the leaderboard structure
   */
  render() {
    const compactClass = this.config.compact ? 'leaderboard--compact' : '';
    const searchHtml = this.config.showSearch ? this.renderSearchHtml() : '';

    this.container.innerHTML = `
      <div class="leaderboard ${compactClass}" data-leaderboard>
        <div class="leaderboard__header">
          <h2 class="leaderboard__title">
            <svg class="leaderboard__title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            Leaderboard
          </h2>
          <div class="leaderboard__header-actions">
            ${searchHtml}
          </div>
        </div>

        <div class="leaderboard__filters">
          <div class="leaderboard__filter-group">
            <span class="leaderboard__filter-label">View:</span>
            <div class="leaderboard__filter-tabs" data-filter-tabs>
              <button class="leaderboard__filter-tab ${this.config.viewType === 'individual' ? 'leaderboard__filter-tab--active' : ''}" data-view="individual">
                Individual
              </button>
              <button class="leaderboard__filter-tab ${this.config.viewType === 'team' ? 'leaderboard__filter-tab--active' : ''}" data-view="team">
                Team
              </button>
              <button class="leaderboard__filter-tab ${this.config.viewType === 'department' ? 'leaderboard__filter-tab--active' : ''}" data-view="department">
                Department
              </button>
            </div>
          </div>

          <div class="leaderboard__filter-group">
            <span class="leaderboard__filter-label">Period:</span>
            <div class="leaderboard__period-selector" data-period-selector>
              <button class="leaderboard__period-button ${this.config.period === 'weekly' ? 'leaderboard__period-button--active' : ''}" data-period="weekly">
                Weekly
              </button>
              <button class="leaderboard__period-button ${this.config.period === 'monthly' ? 'leaderboard__period-button--active' : ''}" data-period="monthly">
                Monthly
              </button>
              <button class="leaderboard__period-button ${this.config.period === 'quarterly' ? 'leaderboard__period-button--active' : ''}" data-period="quarterly">
                Quarterly
              </button>
            </div>
          </div>
        </div>

        ${this.config.showPodium && !this.config.compact ? '<div class="leaderboard__podium" data-podium></div>' : ''}

        <div class="leaderboard__list" data-list></div>

        ${!this.config.compact ? '<div class="leaderboard__footer" data-footer></div>' : ''}

        <div class="leaderboard__loading" data-loading style="display: none;">
          <div class="leaderboard__spinner"></div>
        </div>
      </div>
    `;
  }

  /**
   * Render search HTML
   */
  renderSearchHtml() {
    return `
      <div class="leaderboard__search">
        <svg class="leaderboard__search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          type="text"
          class="leaderboard__search-input"
          placeholder="Search by name..."
          data-search-input
        />
      </div>
    `;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // View type filter tabs
    const filterTabs = this.container.querySelectorAll('[data-filter-tabs] button');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const viewType = tab.dataset.view;
        this.changeViewType(viewType);
      });
    });

    // Period selector
    const periodButtons = this.container.querySelectorAll('[data-period-selector] button');
    periodButtons.forEach(button => {
      button.addEventListener('click', () => {
        const period = button.dataset.period;
        this.changePeriod(period);
      });
    });

    // Search input
    const searchInput = this.container.querySelector('[data-search-input]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Listen for custom events
    this.container.addEventListener('leaderboard:memberClick', (e) => {
      this.handleMemberClick(e.detail);
    });
  }

  /**
   * Fetch leaderboard data from API
   */
  async fetchData() {
    this.setLoading(true);

    try {
      const url = `${this.config.apiEndpoint}?type=${this.config.viewType}&period=${this.config.period}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }

      const data = await response.json();
      this.updateData(data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      this.showError('Failed to load leaderboard data');
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Update leaderboard data
   */
  updateData(newData) {
    // Store previous ranks for animation
    this.state.data.forEach(item => {
      this.state.previousRanks.set(item.id, item.rank);
    });

    this.state.data = newData;
    this.state.filteredData = this.applySearch(newData);
    this.calculatePagination();
    this.renderContent();
  }

  /**
   * Apply search filter
   */
  applySearch(data) {
    if (!this.state.searchQuery) {
      return data;
    }

    const query = this.state.searchQuery.toLowerCase();
    return data.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.team && item.team.toLowerCase().includes(query)) ||
      (item.department && item.department.toLowerCase().includes(query))
    );
  }

  /**
   * Handle search input
   */
  handleSearch(query) {
    this.state.searchQuery = query;
    this.state.filteredData = this.applySearch(this.state.data);
    this.state.currentPage = 1;
    this.calculatePagination();
    this.renderContent();
  }

  /**
   * Calculate pagination
   */
  calculatePagination() {
    const totalItems = this.state.filteredData.length;
    this.state.totalPages = Math.ceil(totalItems / this.config.pageSize);

    // Ensure current page is valid
    if (this.state.currentPage > this.state.totalPages) {
      this.state.currentPage = Math.max(1, this.state.totalPages);
    }
  }

  /**
   * Get paginated data
   */
  getPaginatedData() {
    const start = (this.state.currentPage - 1) * this.config.pageSize;
    const end = start + this.config.pageSize;
    return this.state.filteredData.slice(start, end);
  }

  /**
   * Render leaderboard content
   */
  renderContent() {
    if (this.config.showPodium && !this.config.compact) {
      this.renderPodium();
    }
    this.renderList();

    if (!this.config.compact) {
      this.renderFooter();
    }
  }

  /**
   * Render top 3 podium
   */
  renderPodium() {
    const podiumContainer = this.container.querySelector('[data-podium]');
    if (!podiumContainer) return;

    const top3 = this.state.filteredData.slice(0, 3);

    if (top3.length === 0) {
      podiumContainer.innerHTML = this.renderEmptyState();
      return;
    }

    podiumContainer.innerHTML = top3.map((item, index) => {
      const rank = index + 1;
      const rankClass = rank === 1 ? 'first' : rank === 2 ? 'second' : 'third';
      const trendHtml = this.renderTrendIndicator(item);

      return `
        <div class="podium-winner podium-winner--${rankClass}">
          <div class="podium-winner__rank podium-winner__rank--${rank}">${rank}</div>
          <div class="podium-winner__avatar-wrapper">
            ${rank === 1 ? '<div class="podium-winner__crown">👑</div>' : ''}
            <img src="${item.avatar || this.getDefaultAvatar(item.name)}" alt="${item.name}" class="podium-winner__avatar">
            <div class="podium-winner__avatar-glow"></div>
          </div>
          <div class="podium-winner__name">${this.escapeHtml(item.name)}</div>
          ${item.team ? `<div class="podium-winner__team">${this.escapeHtml(item.team)}</div>` : ''}
          <div class="podium-winner__points">${this.formatPoints(item.points)}</div>
          <div class="podium-winner__points-label">points</div>
          ${trendHtml}
        </div>
      `;
    }).join('');
  }

  /**
   * Render leaderboard list
   */
  renderList() {
    const listContainer = this.container.querySelector('[data-list]');
    if (!listContainer) return;

    const paginatedData = this.config.compact
      ? this.state.filteredData.slice(0, 5)
      : this.getPaginatedData();

    if (paginatedData.length === 0) {
      listContainer.innerHTML = this.renderEmptyState();
      return;
    }

    const startIndex = this.config.compact ? 0 : (this.state.currentPage - 1) * this.config.pageSize;

    listContainer.innerHTML = paginatedData.map((item, index) => {
      const rank = startIndex + index + 1;
      const isCurrentUser = this.config.currentUserId && item.id === this.config.currentUserId;
      const previousRank = this.state.previousRanks.get(item.id);
      const rankChange = previousRank ? this.getRankChange(previousRank, rank) : null;
      const trendHtml = this.renderTrendIndicator(item);

      return `
        <div class="leaderboard-entry ${isCurrentUser ? 'leaderboard-entry--current-user' : ''} ${rankChange ? `leaderboard-entry--moved-${rankChange}` : ''}"
             data-user-id="${item.id}">
          <div class="leaderboard-entry__rank ${rank <= 3 ? `leaderboard-entry__rank--${rank}` : ''}">
            ${rank}
          </div>
          <img src="${item.avatar || this.getDefaultAvatar(item.name)}" alt="${item.name}" class="leaderboard-entry__avatar">
          <div class="leaderboard-entry__info">
            <div class="leaderboard-entry__name">${this.escapeHtml(item.name)}</div>
            <div class="leaderboard-entry__meta">
              ${item.team ? this.escapeHtml(item.team) : ''}
              ${item.department ? ` • ${this.escapeHtml(item.department)}` : ''}
            </div>
          </div>
          <div class="leaderboard-entry__points">
            <div class="leaderboard-entry__points-value">${this.formatPoints(item.points)}</div>
            <div class="leaderboard-entry__points-label">points</div>
          </div>
          ${trendHtml}
        </div>
      `;
    }).join('');

    // Add click handlers
    this.container.querySelectorAll('.leaderboard-entry').forEach(entry => {
      entry.addEventListener('click', () => {
        const userId = entry.dataset.userId;
        const userData = this.state.filteredData.find(u => u.id === userId);
        if (userData) {
          this.handleMemberClick(userData);
        }
      });

      // Keyboard accessibility
      entry.setAttribute('tabindex', '0');
      entry.setAttribute('role', 'button');
      entry.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          entry.click();
        }
      });
    });
  }

  /**
   * Render trend indicator
   */
  renderTrendIndicator(item) {
    if (!item.trend) return '';

    const trendType = item.trend > 0 ? 'up' : item.trend < 0 ? 'down' : 'neutral';
    const trendIcon = item.trend > 0 ? '↑' : item.trend < 0 ? '↓' : '→';
    const trendValue = Math.abs(item.trend);

    return `
      <div class="leaderboard-entry__trend leaderboard-entry__trend--${trendType}">
        <span class="leaderboard-entry__trend-icon">${trendIcon}</span>
        <span>${trendValue}</span>
      </div>
    `;
  }

  /**
   * Render footer with pagination
   */
  renderFooter() {
    const footerContainer = this.container.querySelector('[data-footer]');
    if (!footerContainer) return;

    const totalItems = this.state.filteredData.length;
    const start = (this.state.currentPage - 1) * this.config.pageSize + 1;
    const end = Math.min(start + this.config.pageSize - 1, totalItems);

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.state.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.state.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    footerContainer.innerHTML = `
      <div class="leaderboard__pagination">
        <span class="leaderboard__pagination-info">
          Showing ${start}-${end} of ${totalItems}
        </span>
        <button class="leaderboard__pagination-button" data-page="prev" ${this.state.currentPage === 1 ? 'disabled' : ''}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        ${pages.map(page => `
          <button class="leaderboard__pagination-button ${page === this.state.currentPage ? 'leaderboard__pagination-button--active' : ''}"
                  data-page="${page}">
            ${page}
          </button>
        `).join('')}
        <button class="leaderboard__pagination-button" data-page="next" ${this.state.currentPage === this.state.totalPages ? 'disabled' : ''}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      ${this.config.compact ? `
        <a href="/pages/leaderboard-page.html" class="leaderboard__view-all">
          View All
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      ` : ''}
    `;

    // Add pagination click handlers
    footerContainer.querySelectorAll('[data-page]').forEach(button => {
      button.addEventListener('click', () => {
        const page = button.dataset.page;
        if (page === 'prev') {
          this.goToPage(this.state.currentPage - 1);
        } else if (page === 'next') {
          this.goToPage(this.state.currentPage + 1);
        } else {
          this.goToPage(parseInt(page));
        }
      });
    });
  }

  /**
   * Render empty state
   */
  renderEmptyState() {
    return `
      <div class="leaderboard__empty">
        <svg class="leaderboard__empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <h3 class="leaderboard__empty-title">No Results Found</h3>
        <p class="leaderboard__empty-text">
          ${this.state.searchQuery ? 'Try adjusting your search criteria' : 'No data available for the selected period'}
        </p>
      </div>
    `;
  }

  /**
   * Change view type
   */
  async changeViewType(viewType) {
    if (this.config.viewType === viewType) return;

    this.config.viewType = viewType;

    // Update active tab
    this.container.querySelectorAll('[data-filter-tabs] button').forEach(tab => {
      tab.classList.toggle('leaderboard__filter-tab--active', tab.dataset.view === viewType);
    });

    await this.fetchData();
  }

  /**
   * Change time period
   */
  async changePeriod(period) {
    if (this.config.period === period) return;

    this.config.period = period;

    // Update active button
    this.container.querySelectorAll('[data-period-selector] button').forEach(button => {
      button.classList.toggle('leaderboard__period-button--active', button.dataset.period === period);
    });

    await this.fetchData();
  }

  /**
   * Go to specific page
   */
  goToPage(page) {
    if (page < 1 || page > this.state.totalPages || page === this.state.currentPage) {
      return;
    }

    this.state.currentPage = page;
    this.renderContent();
  }

  /**
   * Connect to WebSocket for real-time updates
   */
  connectWebSocket() {
    try {
      this.ws = new WebSocket(this.config.wsEndpoint);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (this.config.enableWebSocket) {
            this.connectWebSocket();
          }
        }, 5000);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  /**
   * Handle WebSocket message
   */
  handleWebSocketMessage(data) {
    if (data.type === 'leaderboard_update' &&
        data.viewType === this.config.viewType &&
        data.period === this.config.period) {
      this.updateData(data.leaderboard);
    }
  }

  /**
   * Start auto-refresh timer
   */
  startAutoRefresh() {
    this.refreshTimer = setInterval(() => {
      this.fetchData();
    }, this.config.refreshInterval);
  }

  /**
   * Stop auto-refresh timer
   */
  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Handle member click event
   */
  handleMemberClick(userData) {
    // Dispatch custom event
    const event = new CustomEvent('leaderboard:select', {
      bubbles: true,
      detail: userData
    });
    this.container.dispatchEvent(event);

    // Optional: Navigate to user profile
    console.log('Member clicked:', userData);
  }

  /**
   * Set loading state
   */
  setLoading(loading) {
    this.state.loading = loading;
    const loadingElement = this.container.querySelector('[data-loading]');
    const leaderboardElement = this.container.querySelector('[data-leaderboard]');

    if (loadingElement && leaderboardElement) {
      if (loading) {
        loadingElement.style.display = 'flex';
        leaderboardElement.classList.add('leaderboard--loading');
      } else {
        loadingElement.style.display = 'none';
        leaderboardElement.classList.remove('leaderboard--loading');
      }
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const listContainer = this.container.querySelector('[data-list]');
    if (listContainer) {
      listContainer.innerHTML = `
        <div class="leaderboard__empty">
          <svg class="leaderboard__empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="leaderboard__empty-title">Error</h3>
          <p class="leaderboard__empty-text">${this.escapeHtml(message)}</p>
        </div>
      `;
    }
  }

  /**
   * Get rank change direction
   */
  getRankChange(previousRank, currentRank) {
    if (previousRank > currentRank) return 'up';
    if (previousRank < currentRank) return 'down';
    return null;
  }

  /**
   * Format points with thousand separators
   */
  formatPoints(points) {
    return points.toLocaleString();
  }

  /**
   * Get default avatar based on name
   */
  getDefaultAvatar(name) {
    const firstLetter = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Refresh leaderboard data
   */
  async refresh() {
    await this.fetchData();
  }

  /**
   * Destroy the component and cleanup
   */
  destroy() {
    this.stopAutoRefresh();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Initialize leaderboards when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.LeaderboardComponent = LeaderboardComponent;
  });
} else {
  window.LeaderboardComponent = LeaderboardComponent;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LeaderboardComponent;
}
