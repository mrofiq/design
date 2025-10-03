/**
 * Developer Report Dashboard - Achievements Component
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * Achievement management system with filtering, sorting, progress tracking,
 * unlock animations, and achievement notifications.
 */

class Achievements {
  /**
   * Initialize the Achievements component
   * @param {HTMLElement} element - The achievements container element
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      achievements: [],
      onAchievementClick: null,
      onFilterChange: null,
      onSortChange: null,
      confettiParticles: 50,
      toastDuration: 5000,
      animateOnMount: false,
      ...options
    };

    this.achievements = this.options.achievements;
    this.currentFilter = 'all';
    this.currentSort = 'unlock-date';
    this.filteredAchievements = [];

    this.elements = {
      grid: null,
      filterTabs: [],
      sortSelect: null,
      stats: {
        unlocked: null,
        total: null,
        progress: null
      }
    };

    this.init();
  }

  /**
   * Initialize the component
   */
  init() {
    this.render();
    this.findElements();
    this.attachEventListeners();
    this.updateStats();
    this.applyFilter(this.currentFilter);
  }

  /**
   * Find and cache DOM elements
   */
  findElements() {
    this.elements.grid = this.element.querySelector('.achievements__grid');
    this.elements.filterTabs = Array.from(
      this.element.querySelectorAll('.achievements__filter-tab')
    );
    this.elements.sortSelect = this.element.querySelector('.achievements__sort-select');

    // Stats elements
    this.elements.stats.unlocked = this.element.querySelector('[data-stat="unlocked"]');
    this.elements.stats.total = this.element.querySelector('[data-stat="total"]');
    this.elements.stats.progress = this.element.querySelector('[data-stat="progress"]');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Filter tabs
    this.elements.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        this.applyFilter(filter);
      });
    });

    // Sort select
    if (this.elements.sortSelect) {
      this.elements.sortSelect.addEventListener('change', (e) => {
        this.applySort(e.target.value);
      });
    }

    // Achievement card clicks
    this.element.addEventListener('click', (e) => {
      const card = e.target.closest('.achievement-card');
      if (card) {
        const achievementId = card.dataset.achievementId;
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && typeof this.options.onAchievementClick === 'function') {
          this.options.onAchievementClick(achievement);
        }
      }
    });
  }

  /**
   * Render the main achievements structure
   */
  render() {
    const unlockedCount = this.achievements.filter(a => a.unlocked).length;
    const totalCount = this.achievements.length;
    const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    this.element.innerHTML = `
      <div class="achievements">
        <div class="achievements__header">
          <div>
            <h2 class="achievements__title">Achievements</h2>
            <p class="achievements__subtitle">Track your progress and unlock badges</p>
          </div>
          <div class="achievements__stats">
            <div class="achievements__stat">
              <span class="achievements__stat-value" data-stat="unlocked">${unlockedCount}</span>
              <span class="achievements__stat-label">Unlocked</span>
            </div>
            <div class="achievements__stat">
              <span class="achievements__stat-value" data-stat="total">${totalCount}</span>
              <span class="achievements__stat-label">Total</span>
            </div>
            <div class="achievements__stat">
              <span class="achievements__stat-value" data-stat="progress">${progressPercent}%</span>
              <span class="achievements__stat-label">Progress</span>
            </div>
          </div>
        </div>

        <div class="achievements__filters">
          <div class="achievements__filter-tabs">
            ${this.renderFilterTabs()}
          </div>
          <div class="achievements__sort">
            <label class="achievements__sort-label" for="achievement-sort">Sort by:</label>
            <select class="achievements__sort-select" id="achievement-sort">
              <option value="unlock-date">Unlock Date</option>
              <option value="progress">Progress</option>
              <option value="tier">Tier</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        <div class="achievements__grid"></div>
      </div>
    `;
  }

  /**
   * Render filter tabs
   * @returns {string} HTML for filter tabs
   */
  renderFilterTabs() {
    const filters = [
      { id: 'all', label: 'All', count: this.achievements.length },
      { id: 'unlocked', label: 'Unlocked', count: this.achievements.filter(a => a.unlocked).length },
      { id: 'locked', label: 'Locked', count: this.achievements.filter(a => !a.unlocked).length },
      { id: 'in-progress', label: 'In Progress', count: this.achievements.filter(a => !a.unlocked && a.progress > 0).length }
    ];

    return filters.map(filter => `
      <button
        class="achievements__filter-tab ${filter.id === 'all' ? 'achievements__filter-tab--active' : ''}"
        data-filter="${filter.id}"
        aria-pressed="${filter.id === 'all'}"
      >
        ${filter.label}
        <span class="achievements__filter-tab-count">${filter.count}</span>
      </button>
    `).join('');
  }

  /**
   * Apply filter to achievements
   * @param {string} filter - Filter type (all, unlocked, locked, in-progress)
   */
  applyFilter(filter) {
    this.currentFilter = filter;

    // Update active tab
    this.elements.filterTabs.forEach(tab => {
      const isActive = tab.dataset.filter === filter;
      tab.classList.toggle('achievements__filter-tab--active', isActive);
      tab.setAttribute('aria-pressed', isActive);
    });

    // Filter achievements
    switch (filter) {
      case 'unlocked':
        this.filteredAchievements = this.achievements.filter(a => a.unlocked);
        break;
      case 'locked':
        this.filteredAchievements = this.achievements.filter(a => !a.unlocked);
        break;
      case 'in-progress':
        this.filteredAchievements = this.achievements.filter(a => !a.unlocked && a.progress > 0);
        break;
      default:
        this.filteredAchievements = [...this.achievements];
    }

    // Apply current sort
    this.sortAchievements();

    // Render filtered achievements
    this.renderAchievements();

    // Callback
    if (typeof this.options.onFilterChange === 'function') {
      this.options.onFilterChange(filter, this.filteredAchievements);
    }
  }

  /**
   * Apply sort to achievements
   * @param {string} sort - Sort type
   */
  applySort(sort) {
    this.currentSort = sort;

    if (this.elements.sortSelect) {
      this.elements.sortSelect.value = sort;
    }

    this.sortAchievements();
    this.renderAchievements();

    if (typeof this.options.onSortChange === 'function') {
      this.options.onSortChange(sort);
    }
  }

  /**
   * Sort achievements based on current sort option
   */
  sortAchievements() {
    switch (this.currentSort) {
      case 'unlock-date':
        this.filteredAchievements.sort((a, b) => {
          if (a.unlocked && b.unlocked) {
            return new Date(b.unlockedDate) - new Date(a.unlockedDate);
          }
          return a.unlocked ? -1 : 1;
        });
        break;

      case 'progress':
        this.filteredAchievements.sort((a, b) => {
          if (a.unlocked && b.unlocked) return 0;
          if (a.unlocked) return -1;
          if (b.unlocked) return 1;
          return b.progress - a.progress;
        });
        break;

      case 'tier':
        const tierOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
        this.filteredAchievements.sort((a, b) => {
          return tierOrder[a.tier] - tierOrder[b.tier];
        });
        break;

      case 'alphabetical':
        this.filteredAchievements.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
  }

  /**
   * Render achievements grid
   */
  renderAchievements() {
    if (!this.elements.grid) return;

    if (this.filteredAchievements.length === 0) {
      this.renderEmptyState();
      return;
    }

    this.elements.grid.innerHTML = this.filteredAchievements.map(achievement =>
      this.renderAchievementCard(achievement)
    ).join('');
  }

  /**
   * Render a single achievement card
   * @param {Object} achievement - Achievement data
   * @returns {string} HTML for achievement card
   */
  renderAchievementCard(achievement) {
    const {
      id,
      title,
      description,
      tier,
      icon,
      unlocked,
      unlockedDate,
      progress,
      target,
      current
    } = achievement;

    const progressPercent = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
    const isInProgress = !unlocked && progress > 0;

    return `
      <div
        class="achievement-card ${unlocked ? '' : 'achievement-card--locked'}"
        data-achievement-id="${id}"
        tabindex="0"
        role="button"
        aria-label="${title}"
      >
        <div class="achievement-card__badge-wrapper">
          ${!unlocked ? `
            <div class="achievement-card__lock-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          ` : ''}

          <div class="achievement-card__badge achievement-card__badge--${tier}">
            ${icon || this.getDefaultIcon(tier)}
          </div>

          ${unlocked ? '<div class="achievement-card__badge-glow"></div>' : ''}
        </div>

        <span class="achievement-card__tier achievement-card__tier--${tier}">
          ${tier}
        </span>

        <h3 class="achievement-card__title">${title}</h3>
        <p class="achievement-card__description">${description}</p>

        ${unlocked ? `
          <div class="achievement-card__date">
            <span class="achievement-card__date-label">Unlocked:</span>
            ${this.formatDate(unlockedDate)}
          </div>
        ` : ''}

        ${!unlocked && isInProgress ? `
          <div class="achievement-card__progress">
            <div class="achievement-card__progress-header">
              <span class="achievement-card__progress-label">Progress</span>
              <span class="achievement-card__progress-value">${current}/${target}</span>
            </div>
            <div class="achievement-card__progress-bar">
              <div
                class="achievement-card__progress-fill achievement-card__progress-fill--animated"
                style="width: ${progressPercent}%"
                role="progressbar"
                aria-valuenow="${progressPercent}"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Render empty state
   */
  renderEmptyState() {
    const messages = {
      all: {
        title: 'No Achievements Yet',
        description: 'Start completing tasks and contributing to unlock your first achievement!'
      },
      unlocked: {
        title: 'No Unlocked Achievements',
        description: 'Keep working hard to unlock achievements and earn badges!'
      },
      locked: {
        title: 'All Achievements Unlocked!',
        description: 'Congratulations! You have unlocked all available achievements.'
      },
      'in-progress': {
        title: 'No Achievements In Progress',
        description: 'Start working towards new achievements to see your progress here.'
      }
    };

    const message = messages[this.currentFilter] || messages.all;

    this.elements.grid.innerHTML = `
      <div class="achievements__empty">
        <svg class="achievements__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
        <h3 class="achievements__empty-title">${message.title}</h3>
        <p class="achievements__empty-description">${message.description}</p>
        ${this.currentFilter !== 'all' ? `
          <button class="achievements__empty-action" onclick="this.closest('.achievements').querySelector('[data-filter=\\"all\\"]').click()">
            View All Achievements
          </button>
        ` : ''}
      </div>
    `;
  }

  /**
   * Get default icon for tier
   * @param {string} tier - Achievement tier
   * @returns {string} SVG icon HTML
   */
  getDefaultIcon(tier) {
    const icons = {
      bronze: '<svg viewBox="0 0 24 24" fill="currentColor" class="achievement-card__badge-icon"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
      silver: '<svg viewBox="0 0 24 24" fill="currentColor" class="achievement-card__badge-icon"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
      gold: '<svg viewBox="0 0 24 24" fill="currentColor" class="achievement-card__badge-icon"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>',
      platinum: '<svg viewBox="0 0 24 24" fill="currentColor" class="achievement-card__badge-icon"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>'
    };
    return icons[tier] || icons.bronze;
  }

  /**
   * Format date
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  }

  /**
   * Update statistics
   */
  updateStats() {
    const unlockedCount = this.achievements.filter(a => a.unlocked).length;
    const totalCount = this.achievements.length;
    const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    if (this.elements.stats.unlocked) {
      this.elements.stats.unlocked.textContent = unlockedCount;
    }
    if (this.elements.stats.total) {
      this.elements.stats.total.textContent = totalCount;
    }
    if (this.elements.stats.progress) {
      this.elements.stats.progress.textContent = `${progressPercent}%`;
    }

    // Update filter tab counts
    this.elements.filterTabs.forEach(tab => {
      const filter = tab.dataset.filter;
      const countEl = tab.querySelector('.achievements__filter-tab-count');
      if (!countEl) return;

      let count = 0;
      switch (filter) {
        case 'all':
          count = this.achievements.length;
          break;
        case 'unlocked':
          count = this.achievements.filter(a => a.unlocked).length;
          break;
        case 'locked':
          count = this.achievements.filter(a => !a.unlocked).length;
          break;
        case 'in-progress':
          count = this.achievements.filter(a => !a.unlocked && a.progress > 0).length;
          break;
      }
      countEl.textContent = count;
    });
  }

  /**
   * Unlock an achievement with animation
   * @param {string} achievementId - Achievement ID to unlock
   */
  unlockAchievement(achievementId) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    // Update achievement data
    achievement.unlocked = true;
    achievement.unlockedDate = new Date().toISOString();
    achievement.progress = 100;
    achievement.current = achievement.target;

    // Find card element
    const card = this.element.querySelector(`[data-achievement-id="${achievementId}"]`);
    if (card) {
      // Add unlock animation
      card.classList.add('achievement-card--unlocking');

      // Trigger confetti
      this.showConfetti(card);

      // Update card after animation
      setTimeout(() => {
        card.classList.remove('achievement-card--unlocking');
        this.applyFilter(this.currentFilter);
      }, 1000);
    } else {
      // Card not visible, just update
      this.applyFilter(this.currentFilter);
    }

    // Show notification
    this.showAchievementToast(achievement);

    // Update stats
    this.updateStats();
  }

  /**
   * Show confetti animation
   * @param {HTMLElement} targetElement - Element to emit confetti from
   */
  showConfetti(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const container = document.createElement('div');
    container.className = 'achievement-confetti';
    document.body.appendChild(container);

    // Create particles
    for (let i = 0; i < this.options.confettiParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'achievement-confetti__particle';

      // Random starting position around center
      const angle = (Math.PI * 2 * i) / this.options.confettiParticles;
      const velocity = 2 + Math.random() * 3;
      const startX = centerX + Math.cos(angle) * 50;
      const startY = centerY + Math.sin(angle) * 50;

      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.animationDelay = `${Math.random() * 0.3}s`;

      container.appendChild(particle);
    }

    // Remove after animation
    setTimeout(() => {
      container.remove();
    }, 3000);
  }

  /**
   * Show achievement unlock notification
   * @param {Object} achievement - Achievement that was unlocked
   */
  showAchievementToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="achievement-card__badge achievement-card__badge--${achievement.tier} achievement-toast__badge">
        ${achievement.icon || this.getDefaultIcon(achievement.tier)}
      </div>
      <div class="achievement-toast__content">
        <div class="achievement-toast__label">Achievement Unlocked!</div>
        <h4 class="achievement-toast__title">${achievement.title}</h4>
        <p class="achievement-toast__description">${achievement.description}</p>
      </div>
      <button class="achievement-toast__close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    document.body.appendChild(toast);

    // Close button
    const closeBtn = toast.querySelector('.achievement-toast__close');
    closeBtn.addEventListener('click', () => {
      toast.classList.add('achievement-toast--hiding');
      setTimeout(() => toast.remove(), 300);
    });

    // Auto-remove after duration
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('achievement-toast--hiding');
        setTimeout(() => toast.remove(), 300);
      }
    }, this.options.toastDuration);
  }

  /**
   * Update achievement progress
   * @param {string} achievementId - Achievement ID
   * @param {number} current - Current progress value
   */
  updateProgress(achievementId, current) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    achievement.current = current;
    achievement.progress = achievement.target > 0
      ? Math.min((current / achievement.target) * 100, 100)
      : 0;

    // Check if achievement should be unlocked
    if (current >= achievement.target) {
      this.unlockAchievement(achievementId);
    } else {
      // Just update the display
      this.applyFilter(this.currentFilter);
    }
  }

  /**
   * Add new achievement
   * @param {Object} achievement - Achievement data
   */
  addAchievement(achievement) {
    this.achievements.push({
      unlocked: false,
      progress: 0,
      current: 0,
      ...achievement
    });
    this.updateStats();
    this.applyFilter(this.currentFilter);
  }

  /**
   * Load achievements from data
   * @param {Array} achievements - Array of achievement objects
   */
  loadAchievements(achievements) {
    this.achievements = achievements;
    this.updateStats();
    this.applyFilter(this.currentFilter);
  }

  /**
   * Get achievement by ID
   * @param {string} id - Achievement ID
   * @returns {Object|null} Achievement object or null
   */
  getAchievement(id) {
    return this.achievements.find(a => a.id === id) || null;
  }

  /**
   * Destroy the component
   */
  destroy() {
    this.element.innerHTML = '';
    this.achievements = [];
    this.filteredAchievements = [];
    this.elements = {};
  }
}

// Default achievements from PRD
const DEFAULT_ACHIEVEMENTS = [
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Submit your daily report before 5 PM for 5 consecutive days',
    tier: 'bronze',
    target: 5,
    current: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: 'team-player',
    title: 'Team Player',
    description: 'Receive 10 or more recognition mentions from teammates',
    tier: 'silver',
    target: 10,
    current: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: 'quality-champion',
    title: 'Quality Champion',
    description: 'Maintain zero quality gate failures for 30 consecutive days',
    tier: 'gold',
    target: 30,
    current: 0,
    unlocked: false,
    progress: 0
  },
  {
    id: 'productivity-star',
    title: 'Productivity Star',
    description: 'Achieve top 10% ranking in monthly productivity metrics',
    tier: 'platinum',
    target: 1,
    current: 0,
    unlocked: false,
    progress: 0
  }
];

// Auto-initialize achievements with data-achievements attribute
document.addEventListener('DOMContentLoaded', () => {
  const achievementsElements = document.querySelectorAll('[data-achievements]');

  achievementsElements.forEach(element => {
    const achievementsData = element.dataset.achievements
      ? JSON.parse(element.dataset.achievements)
      : DEFAULT_ACHIEVEMENTS;

    new Achievements(element, {
      achievements: achievementsData
    });
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Achievements, DEFAULT_ACHIEVEMENTS };
}
