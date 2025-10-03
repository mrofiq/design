/**
 * Developer Report Dashboard - Timeline Component
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * Timeline component for displaying chronological activity events
 * Features:
 * - Dynamic event addition
 * - Date grouping
 * - Relative time formatting with auto-update
 * - Event filtering by type
 * - Infinite scroll support
 * - Click handlers
 * - Loading states
 */

class Timeline {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Timeline: Container with id "${containerId}" not found`);
      return;
    }

    // Configuration
    this.options = {
      compact: options.compact || false,
      enableFilters: options.enableFilters !== false,
      enableInfiniteScroll: options.enableInfiniteScroll || false,
      itemsPerPage: options.itemsPerPage || 20,
      onEventClick: options.onEventClick || null,
      onLoadMore: options.onLoadMore || null,
      autoUpdateInterval: options.autoUpdateInterval || 60000, // 1 minute
      groupByDate: options.groupByDate !== false,
      ...options
    };

    // State
    this.events = [];
    this.filteredEvents = [];
    this.activeFilters = new Set(['all']);
    this.isLoading = false;
    this.hasMore = true;
    this.currentPage = 1;
    this.timeUpdateInterval = null;
    this.intersectionObserver = null;

    // Event type configuration
    this.eventTypes = {
      commit: {
        label: 'Commits',
        icon: this.getIcon('commit'),
        color: 'info'
      },
      merge: {
        label: 'Merges',
        icon: this.getIcon('merge'),
        color: 'primary'
      },
      task: {
        label: 'Tasks',
        icon: this.getIcon('task'),
        color: 'success'
      },
      review: {
        label: 'Reviews',
        icon: this.getIcon('review'),
        color: 'accent'
      },
      quality: {
        label: 'Quality',
        icon: this.getIcon('quality'),
        color: 'quality'
      },
      error: {
        label: 'Errors',
        icon: this.getIcon('error'),
        color: 'error'
      }
    };

    this.init();
  }

  /**
   * Initialize the timeline component
   */
  init() {
    this.createStructure();
    this.setupFilters();
    this.setupInfiniteScroll();
    this.startTimeUpdates();
    this.setupAccessibility();
  }

  /**
   * Create the timeline structure
   */
  createStructure() {
    this.container.classList.add('timeline');
    if (this.options.compact) {
      this.container.classList.add('timeline--compact');
    }

    // Create filter container if enabled
    if (this.options.enableFilters) {
      this.filterContainer = document.createElement('div');
      this.filterContainer.className = 'timeline__filters';
      this.filterContainer.setAttribute('role', 'toolbar');
      this.filterContainer.setAttribute('aria-label', 'Timeline filters');
      this.container.before(this.filterContainer);
      this.renderFilters();
    }

    // Create timeline content wrapper
    this.timelineContent = document.createElement('div');
    this.timelineContent.className = 'timeline__content-wrapper';
    this.container.appendChild(this.timelineContent);

    // Create loader element for infinite scroll
    if (this.options.enableInfiniteScroll) {
      this.loaderElement = document.createElement('div');
      this.loaderElement.className = 'timeline__loader';
      this.loaderElement.style.display = 'none';
      this.loaderElement.innerHTML = `
        <div class="timeline__loader-spinner" role="status" aria-label="Loading more events"></div>
        <span class="timeline__loader-text">Loading more events...</span>
      `;
      this.container.appendChild(this.loaderElement);
    }
  }

  /**
   * Setup event type filters
   */
  setupFilters() {
    if (!this.options.enableFilters) return;

    this.filterButtons = {};
  }

  /**
   * Render filter buttons
   */
  renderFilters() {
    if (!this.filterContainer) return;

    const label = document.createElement('span');
    label.className = 'timeline__filter-label';
    label.textContent = 'Filter:';
    this.filterContainer.appendChild(label);

    // "All" filter
    this.createFilterButton('all', 'All', this.getIcon('filter'), this.events.length);

    // Event type filters
    Object.entries(this.eventTypes).forEach(([type, config]) => {
      const count = this.events.filter(e => e.type === type).length;
      this.createFilterButton(type, config.label, config.icon, count);
    });
  }

  /**
   * Create a filter button
   */
  createFilterButton(type, label, icon, count) {
    const button = document.createElement('button');
    button.className = 'timeline__filter-button';
    button.dataset.filter = type;
    button.setAttribute('role', 'button');
    button.setAttribute('aria-pressed', this.activeFilters.has(type));

    if (this.activeFilters.has(type)) {
      button.classList.add('timeline__filter-button--active');
    }

    button.innerHTML = `
      <span class="timeline__filter-icon">${icon}</span>
      <span>${label}</span>
      <span class="timeline__filter-count">${count}</span>
    `;

    button.addEventListener('click', () => this.toggleFilter(type));

    this.filterContainer.appendChild(button);
    this.filterButtons[type] = button;
  }

  /**
   * Toggle filter
   */
  toggleFilter(type) {
    if (type === 'all') {
      this.activeFilters.clear();
      this.activeFilters.add('all');
    } else {
      this.activeFilters.delete('all');
      if (this.activeFilters.has(type)) {
        this.activeFilters.delete(type);
      } else {
        this.activeFilters.add(type);
      }

      if (this.activeFilters.size === 0) {
        this.activeFilters.add('all');
      }
    }

    this.updateFilterButtons();
    this.filterEvents();
    this.render();
  }

  /**
   * Update filter button states
   */
  updateFilterButtons() {
    Object.entries(this.filterButtons).forEach(([type, button]) => {
      const isActive = this.activeFilters.has(type);
      button.classList.toggle('timeline__filter-button--active', isActive);
      button.setAttribute('aria-pressed', isActive);
    });
  }

  /**
   * Filter events based on active filters
   */
  filterEvents() {
    if (this.activeFilters.has('all')) {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event =>
        this.activeFilters.has(event.type)
      );
    }
  }

  /**
   * Add an event to the timeline
   */
  addEvent(event) {
    const eventData = {
      id: event.id || this.generateId(),
      type: event.type || 'task',
      title: event.title || 'Untitled Event',
      description: event.description || '',
      timestamp: event.timestamp || new Date(),
      points: event.points || 0,
      meta: event.meta || {},
      clickable: event.clickable !== false,
      ...event
    };

    this.events.unshift(eventData);
    this.filterEvents();
    this.updateFilterCounts();
    this.render();

    return eventData;
  }

  /**
   * Add multiple events
   */
  addEvents(events) {
    events.forEach(event => {
      const eventData = {
        id: event.id || this.generateId(),
        type: event.type || 'task',
        title: event.title || 'Untitled Event',
        description: event.description || '',
        timestamp: event.timestamp || new Date(),
        points: event.points || 0,
        meta: event.meta || {},
        clickable: event.clickable !== false,
        ...event
      };
      this.events.push(eventData);
    });

    this.events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    this.filterEvents();
    this.updateFilterCounts();
    this.render();
  }

  /**
   * Update filter counts
   */
  updateFilterCounts() {
    if (!this.options.enableFilters) return;

    // Update "All" count
    if (this.filterButtons.all) {
      const countEl = this.filterButtons.all.querySelector('.timeline__filter-count');
      if (countEl) countEl.textContent = this.events.length;
    }

    // Update type counts
    Object.keys(this.eventTypes).forEach(type => {
      if (this.filterButtons[type]) {
        const count = this.events.filter(e => e.type === type).length;
        const countEl = this.filterButtons[type].querySelector('.timeline__filter-count');
        if (countEl) countEl.textContent = count;
      }
    });
  }

  /**
   * Render the timeline
   */
  render() {
    if (this.filteredEvents.length === 0) {
      this.renderEmpty();
      return;
    }

    this.timelineContent.innerHTML = '';

    if (this.options.groupByDate) {
      this.renderGroupedByDate();
    } else {
      this.renderFlat();
    }
  }

  /**
   * Render events grouped by date
   */
  renderGroupedByDate() {
    const groupedEvents = this.groupEventsByDate(this.filteredEvents);

    Object.entries(groupedEvents).forEach(([dateKey, events]) => {
      const dateGroup = this.createDateGroup(dateKey, events);
      this.timelineContent.appendChild(dateGroup);
    });
  }

  /**
   * Render events in flat list
   */
  renderFlat() {
    this.filteredEvents.forEach(event => {
      const item = this.createTimelineItem(event);
      this.timelineContent.appendChild(item);
    });
  }

  /**
   * Group events by date
   */
  groupEventsByDate(events) {
    const groups = {};

    events.forEach(event => {
      const date = new Date(event.timestamp);
      const dateKey = date.toISOString().split('T')[0];

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return groups;
  }

  /**
   * Create a date group element
   */
  createDateGroup(dateKey, events) {
    const group = document.createElement('div');
    group.className = 'timeline__date-group';
    group.dataset.date = dateKey;

    const header = this.createDateHeader(dateKey);
    group.appendChild(header);

    events.forEach(event => {
      const item = this.createTimelineItem(event);
      group.appendChild(item);
    });

    return group;
  }

  /**
   * Create date header
   */
  createDateHeader(dateKey) {
    const header = document.createElement('div');
    header.className = 'timeline__date-header';

    const dateText = this.formatDateHeader(dateKey);
    const badge = this.getDateBadge(dateKey);

    header.innerHTML = `
      <span class="timeline__date-icon">${this.getIcon('calendar')}</span>
      <span class="timeline__date-text">${dateText}</span>
      ${badge ? `<span class="timeline__date-badge ${badge.class}">${badge.text}</span>` : ''}
    `;

    return header;
  }

  /**
   * Create timeline item element
   */
  createTimelineItem(event) {
    const item = document.createElement('div');
    item.className = 'timeline__item';
    item.dataset.eventId = event.id;
    item.dataset.eventType = event.type;

    if (event.clickable) {
      item.classList.add('timeline__item--clickable');
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('click', () => this.handleEventClick(event));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleEventClick(event);
        }
      });
    }

    const icon = this.createIcon(event.type);
    const content = this.createContent(event);

    item.appendChild(icon);
    item.appendChild(content);

    return item;
  }

  /**
   * Create icon element
   */
  createIcon(type) {
    const icon = document.createElement('div');
    icon.className = `timeline__icon timeline__icon--${type}`;
    icon.innerHTML = `
      <span class="timeline__icon-svg">${this.eventTypes[type]?.icon || this.getIcon('default')}</span>
    `;
    return icon;
  }

  /**
   * Create content element
   */
  createContent(event) {
    const content = document.createElement('div');
    content.className = 'timeline__content';

    const header = document.createElement('div');
    header.className = 'timeline__content-header';

    const title = document.createElement('h3');
    title.className = 'timeline__content-title';
    title.textContent = event.title;

    const timestamp = document.createElement('div');
    timestamp.className = 'timeline__content-timestamp';
    timestamp.dataset.timestamp = new Date(event.timestamp).getTime();
    timestamp.innerHTML = `
      <span class="timeline__content-timestamp-icon">${this.getIcon('clock')}</span>
      <span>${this.formatRelativeTime(event.timestamp)}</span>
    `;

    header.appendChild(title);
    header.appendChild(timestamp);
    content.appendChild(header);

    if (event.description) {
      const description = document.createElement('p');
      description.className = 'timeline__content-description';
      description.textContent = event.description;
      content.appendChild(description);
    }

    if (event.points !== undefined || event.meta) {
      const meta = this.createMeta(event);
      content.appendChild(meta);
    }

    return content;
  }

  /**
   * Create meta information element
   */
  createMeta(event) {
    const meta = document.createElement('div');
    meta.className = 'timeline__content-meta';

    if (event.points !== undefined && event.points !== 0) {
      const points = document.createElement('div');
      const pointClass = event.points > 0 ? 'positive' : event.points < 0 ? 'negative' : '';
      points.className = `timeline__points${pointClass ? ` timeline__points--${pointClass}` : ''}`;
      points.innerHTML = `
        <span class="timeline__points-icon">${this.getIcon('star')}</span>
        <span>${event.points > 0 ? '+' : ''}${event.points} pts</span>
      `;
      meta.appendChild(points);
    }

    if (event.meta) {
      Object.entries(event.meta).forEach(([key, value]) => {
        const item = document.createElement('div');
        item.className = 'timeline__content-meta-item';
        item.innerHTML = `
          <span class="timeline__content-meta-icon">${this.getIcon(key)}</span>
          <span>${value}</span>
        `;
        meta.appendChild(item);
      });
    }

    return meta;
  }

  /**
   * Render empty state
   */
  renderEmpty() {
    this.timelineContent.innerHTML = `
      <div class="timeline__empty">
        <div class="timeline__empty-icon">${this.getIcon('empty')}</div>
        <h3 class="timeline__empty-title">No activity yet</h3>
        <p class="timeline__empty-description">
          Activity will appear here as you work on tasks, commit code, and complete reviews.
        </p>
      </div>
    `;
  }

  /**
   * Render loading skeleton
   */
  renderSkeleton(count = 5) {
    this.timelineContent.innerHTML = '';

    const skeleton = document.createElement('div');
    skeleton.className = 'timeline__skeleton';

    for (let i = 0; i < count; i++) {
      const item = document.createElement('div');
      item.className = 'timeline__skeleton-item';
      item.innerHTML = `
        <div class="timeline__skeleton-icon"></div>
        <div class="timeline__skeleton-content">
          <div class="timeline__skeleton-line timeline__skeleton-line--long"></div>
          <div class="timeline__skeleton-line timeline__skeleton-line--medium"></div>
          <div class="timeline__skeleton-line timeline__skeleton-line--short"></div>
        </div>
      `;
      skeleton.appendChild(item);
    }

    this.timelineContent.appendChild(skeleton);
  }

  /**
   * Handle event click
   */
  handleEventClick(event) {
    if (this.options.onEventClick && typeof this.options.onEventClick === 'function') {
      this.options.onEventClick(event);
    }
  }

  /**
   * Setup infinite scroll
   */
  setupInfiniteScroll() {
    if (!this.options.enableInfiniteScroll) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoading && this.hasMore) {
          this.loadMore();
        }
      });
    }, options);

    if (this.loaderElement) {
      this.intersectionObserver.observe(this.loaderElement);
    }
  }

  /**
   * Load more events
   */
  async loadMore() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    this.showLoader();

    try {
      if (this.options.onLoadMore && typeof this.options.onLoadMore === 'function') {
        const newEvents = await this.options.onLoadMore(this.currentPage + 1);

        if (newEvents && newEvents.length > 0) {
          this.addEvents(newEvents);
          this.currentPage++;
        } else {
          this.hasMore = false;
        }
      } else {
        this.hasMore = false;
      }
    } catch (error) {
      console.error('Timeline: Error loading more events', error);
    } finally {
      this.isLoading = false;
      this.hideLoader();
    }
  }

  /**
   * Show loader
   */
  showLoader() {
    if (this.loaderElement) {
      this.loaderElement.style.display = 'flex';
    }
  }

  /**
   * Hide loader
   */
  hideLoader() {
    if (this.loaderElement) {
      this.loaderElement.style.display = 'none';
    }
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;

    return date.toLocaleDateString();
  }

  /**
   * Format date header
   */
  formatDateHeader(dateKey) {
    const date = new Date(dateKey);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateString = date.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (dateString === todayString) return 'Today';
    if (dateString === yesterdayString) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Get date badge
   */
  getDateBadge(dateKey) {
    const date = new Date(dateKey);
    const today = new Date();
    const dateString = date.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];

    if (dateString === todayString) {
      return { text: 'Today', class: 'timeline__date-badge--today' };
    }

    return null;
  }

  /**
   * Start auto-updating timestamps
   */
  startTimeUpdates() {
    if (this.options.autoUpdateInterval <= 0) return;

    this.timeUpdateInterval = setInterval(() => {
      this.updateTimestamps();
    }, this.options.autoUpdateInterval);
  }

  /**
   * Update all timestamps
   */
  updateTimestamps() {
    const timestamps = this.container.querySelectorAll('.timeline__content-timestamp');

    timestamps.forEach(el => {
      const timestamp = parseInt(el.dataset.timestamp);
      if (timestamp) {
        const span = el.querySelector('span:last-child');
        if (span) {
          span.textContent = this.formatRelativeTime(timestamp);
        }
      }
    });
  }

  /**
   * Stop time updates
   */
  stopTimeUpdates() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    this.container.setAttribute('role', 'feed');
    this.container.setAttribute('aria-label', 'Activity timeline');
  }

  /**
   * Clear all events
   */
  clear() {
    this.events = [];
    this.filteredEvents = [];
    this.currentPage = 1;
    this.hasMore = true;
    this.updateFilterCounts();
    this.render();
  }

  /**
   * Destroy the timeline
   */
  destroy() {
    this.stopTimeUpdates();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.filterContainer) {
      this.filterContainer.remove();
    }

    this.container.innerHTML = '';
    this.container.classList.remove('timeline', 'timeline--compact');
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get SVG icon
   */
  getIcon(type) {
    const icons = {
      commit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M3 12h6m6 0h6"/></svg>',
      merge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v12a4 4 0 004 4h4"/><circle cx="8" cy="3" r="2"/><circle cx="16" cy="19" r="2"/><path d="M8 9a4 4 0 004 4h4"/></svg>',
      task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
      review: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8m8 4H8m2-8H8"/></svg>',
      quality: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
      empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8m-4-4v8"/></svg>',
      default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
      branch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v12m6-6v12m6-6v6"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
    };

    return icons[type] || icons.default;
  }

  /**
   * Get event count by type
   */
  getEventCount(type) {
    return this.events.filter(e => e.type === type).length;
  }

  /**
   * Get events by type
   */
  getEventsByType(type) {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Get events by date range
   */
  getEventsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.events.filter(event => {
      const date = new Date(event.timestamp);
      return date >= start && date <= end;
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Timeline;
}
