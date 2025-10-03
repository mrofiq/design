/**
 * Developer Report Dashboard - Card Component
 * Version: 1.0
 * Last Updated: 2025-10-02
 *
 * JavaScript functionality for card components including:
 * - Scroll animations
 * - Expandable behavior
 * - Action handlers
 * - Stat counter animations
 */

class CardComponent {
  constructor() {
    this.cards = [];
    this.expandableCards = [];
    this.statCards = [];
    this.intersectionObserver = null;

    this.init();
  }

  /**
   * Initialize all card functionality
   */
  init() {
    this.setupScrollAnimations();
    this.setupExpandableCards();
    this.setupStatCounters();
    this.setupCardActions();
    this.setupAccessibility();
  }

  /**
   * Setup Intersection Observer for scroll animations
   */
  setupScrollAnimations() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card--animate-in');

          // Trigger stat counter animation if it's a stat card
          if (entry.target.classList.contains('stat-card')) {
            this.animateStatValue(entry.target);
          }

          // Unobserve after animation
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all cards
    const allCards = document.querySelectorAll('.card, .stat-card, .achievement-card, .activity-card, .team-member-card, .leaderboard-card');
    allCards.forEach((card) => {
      card.classList.add('card--animate-in-prepare');
      this.intersectionObserver.observe(card);
      this.cards.push(card);
    });
  }

  /**
   * Setup expandable card functionality
   */
  setupExpandableCards() {
    const expandableCards = document.querySelectorAll('.card--expandable');

    expandableCards.forEach((card) => {
      this.expandableCards.push({
        element: card,
        isExpanded: card.classList.contains('is-expanded')
      });

      // Add click handler
      card.addEventListener('click', (e) => {
        // Don't expand if clicking on a button or link
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button, a')) {
          return;
        }

        this.toggleCardExpansion(card);
      });

      // Add keyboard handler
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleCardExpansion(card);
        }
      });

      // Make focusable
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }

      // Set aria attributes
      card.setAttribute('aria-expanded', card.classList.contains('is-expanded'));
    });
  }

  /**
   * Toggle card expansion state
   * @param {HTMLElement} card - The card element to toggle
   */
  toggleCardExpansion(card) {
    const isExpanded = card.classList.contains('is-expanded');
    const content = card.querySelector('.card__expandable-content');

    if (!content) return;

    if (isExpanded) {
      // Collapse
      card.classList.remove('is-expanded');
      card.setAttribute('aria-expanded', 'false');

      // Dispatch custom event
      card.dispatchEvent(new CustomEvent('card:collapsed', {
        bubbles: true,
        detail: { card }
      }));
    } else {
      // Expand
      card.classList.add('is-expanded');
      card.setAttribute('aria-expanded', 'true');

      // Dispatch custom event
      card.dispatchEvent(new CustomEvent('card:expanded', {
        bubbles: true,
        detail: { card }
      }));
    }
  }

  /**
   * Setup stat counter animations
   */
  setupStatCounters() {
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach((card) => {
      const valueElement = card.querySelector('.stat-card__value');
      if (!valueElement) return;

      const value = valueElement.textContent.trim();
      const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));

      if (!isNaN(numericValue)) {
        this.statCards.push({
          element: card,
          valueElement,
          targetValue: numericValue,
          prefix: value.match(/^[^\d.-]+/)?.[0] || '',
          suffix: value.match(/[^\d.-]+$/)?.[0] || '',
          hasAnimated: false
        });

        // Store original value as data attribute
        valueElement.dataset.targetValue = numericValue;
        valueElement.dataset.prefix = this.statCards[this.statCards.length - 1].prefix;
        valueElement.dataset.suffix = this.statCards[this.statCards.length - 1].suffix;
      }
    });
  }

  /**
   * Animate stat value with counting effect
   * @param {HTMLElement} card - The stat card element
   */
  animateStatValue(card) {
    const statData = this.statCards.find(s => s.element === card);
    if (!statData || statData.hasAnimated) return;

    const { valueElement, targetValue, prefix, suffix } = statData;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = targetValue / steps;
    const stepDuration = duration / steps;

    let currentValue = 0;
    let currentStep = 0;

    const counter = setInterval(() => {
      currentStep++;
      currentValue += stepValue;

      if (currentStep >= steps) {
        currentValue = targetValue;
        clearInterval(counter);
        statData.hasAnimated = true;
      }

      // Format the value
      const formattedValue = this.formatStatValue(currentValue, targetValue);
      valueElement.textContent = prefix + formattedValue + suffix;
    }, stepDuration);
  }

  /**
   * Format stat value for display
   * @param {number} value - Current value
   * @param {number} targetValue - Target value for decimal places
   * @returns {string} Formatted value
   */
  formatStatValue(value, targetValue) {
    // Determine decimal places based on target value
    const hasDecimals = targetValue % 1 !== 0;

    if (hasDecimals) {
      return value.toFixed(1);
    }

    // For large numbers, add commas
    if (Math.abs(targetValue) >= 1000) {
      return Math.round(value).toLocaleString();
    }

    return Math.round(value).toString();
  }

  /**
   * Setup card action handlers
   */
  setupCardActions() {
    // Setup hoverable cards
    const hoverableCards = document.querySelectorAll('.card--hoverable');
    hoverableCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on a button or link
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button, a')) {
          return;
        }

        // Dispatch custom event
        card.dispatchEvent(new CustomEvent('card:click', {
          bubbles: true,
          detail: { card, event: e }
        }));
      });

      // Make focusable if not already
      if (!card.hasAttribute('tabindex') && card.tagName !== 'A' && card.tagName !== 'BUTTON') {
        card.setAttribute('tabindex', '0');
      }

      // Add keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Setup leaderboard card clicks
    const leaderboardCards = document.querySelectorAll('.leaderboard-card');
    leaderboardCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button, a')) {
          return;
        }

        card.dispatchEvent(new CustomEvent('leaderboard:memberClick', {
          bubbles: true,
          detail: {
            card,
            rank: card.querySelector('.leaderboard-card__rank')?.textContent,
            name: card.querySelector('.leaderboard-card__name')?.textContent,
            points: card.querySelector('.leaderboard-card__points-value')?.textContent
          }
        }));
      });
    });

    // Setup achievement card clicks
    const achievementCards = document.querySelectorAll('.achievement-card:not(.achievement-card--locked)');
    achievementCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button, a')) {
          return;
        }

        card.dispatchEvent(new CustomEvent('achievement:click', {
          bubbles: true,
          detail: {
            card,
            title: card.querySelector('.achievement-card__title')?.textContent,
            description: card.querySelector('.achievement-card__description')?.textContent
          }
        }));
      });

      // Make focusable
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }

      // Add keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Setup team member card actions
    const teamMemberCards = document.querySelectorAll('.team-member-card');
    teamMemberCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button, a')) {
          return;
        }

        card.dispatchEvent(new CustomEvent('team:memberClick', {
          bubbles: true,
          detail: {
            card,
            name: card.querySelector('.team-member-card__name')?.textContent,
            role: card.querySelector('.team-member-card__role')?.textContent
          }
        }));
      });
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add aria-label to cards without them
    const cards = document.querySelectorAll('.card, .stat-card, .achievement-card');
    cards.forEach((card) => {
      if (!card.hasAttribute('aria-label')) {
        const title = card.querySelector('.card__header-title, .stat-card__label, .achievement-card__title');
        if (title) {
          card.setAttribute('aria-label', title.textContent.trim());
        }
      }
    });

    // Mark interactive cards with role
    const interactiveCards = document.querySelectorAll('.card--hoverable, .card--expandable, .leaderboard-card, .achievement-card:not(.achievement-card--locked)');
    interactiveCards.forEach((card) => {
      if (!card.hasAttribute('role')) {
        card.setAttribute('role', 'button');
      }
    });
  }

  /**
   * Animate card entrance manually (useful for dynamically added cards)
   * @param {HTMLElement} card - The card element to animate
   */
  animateCard(card) {
    if (!card) return;

    card.classList.add('card--animate-in');

    // If it's a stat card, animate the counter
    if (card.classList.contains('stat-card')) {
      this.animateStatValue(card);
    }
  }

  /**
   * Refresh stat counter animation for a specific card
   * @param {HTMLElement} card - The stat card to refresh
   */
  refreshStatCounter(card) {
    const statData = this.statCards.find(s => s.element === card);
    if (statData) {
      statData.hasAnimated = false;
      this.animateStatValue(card);
    }
  }

  /**
   * Update stat card value with animation
   * @param {HTMLElement} card - The stat card
   * @param {number} newValue - New value to animate to
   * @param {string} prefix - Optional prefix (e.g., '$', '+')
   * @param {string} suffix - Optional suffix (e.g., '%', 'pts')
   */
  updateStatValue(card, newValue, prefix = '', suffix = '') {
    const valueElement = card.querySelector('.stat-card__value');
    if (!valueElement) return;

    const currentValue = parseFloat(valueElement.dataset.targetValue || 0);
    const duration = 1000;
    const steps = 30;
    const stepValue = (newValue - currentValue) / steps;
    const stepDuration = duration / steps;

    let value = currentValue;
    let currentStep = 0;

    const counter = setInterval(() => {
      currentStep++;
      value += stepValue;

      if (currentStep >= steps) {
        value = newValue;
        clearInterval(counter);
      }

      const formattedValue = this.formatStatValue(value, newValue);
      valueElement.textContent = prefix + formattedValue + suffix;
    }, stepDuration);

    // Update stored value
    valueElement.dataset.targetValue = newValue;
  }

  /**
   * Add loading state to card
   * @param {HTMLElement} card - The card element
   */
  setCardLoading(card, loading = true) {
    if (loading) {
      card.classList.add('card--loading');
    } else {
      card.classList.remove('card--loading');
    }
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.cards = [];
    this.expandableCards = [];
    this.statCards = [];
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cardComponent = new CardComponent();
  });
} else {
  window.cardComponent = new CardComponent();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CardComponent;
}

/**
 * Utility functions for working with cards
 */
const CardUtils = {
  /**
   * Create a stat card element programmatically
   * @param {Object} config - Card configuration
   * @returns {HTMLElement} The created card element
   */
  createStatCard(config) {
    const {
      icon = '',
      iconColor = 'primary',
      label = 'Stat Label',
      value = '0',
      trend = null,
      description = ''
    } = config;

    const card = document.createElement('div');
    card.className = 'stat-card';

    let trendHtml = '';
    if (trend) {
      const trendClass = trend.direction === 'up' ? 'positive' : trend.direction === 'down' ? 'negative' : 'neutral';
      const trendIcon = trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→';
      trendHtml = `
        <div class="stat-card__trend stat-card__trend--${trendClass}">
          <span class="stat-card__trend-icon">${trendIcon}</span>
          <span>${trend.value}</span>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="stat-card__icon-wrapper stat-card__icon-wrapper--${iconColor}">
        <span class="stat-card__icon">${icon}</span>
      </div>
      <div class="stat-card__label">${label}</div>
      <div class="stat-card__value">${value}</div>
      ${trendHtml}
      ${description ? `<div class="stat-card__description">${description}</div>` : ''}
    `;

    return card;
  },

  /**
   * Create an achievement card element
   * @param {Object} config - Card configuration
   * @returns {HTMLElement} The created card element
   */
  createAchievementCard(config) {
    const {
      badge = 'gold',
      icon = '🏆',
      title = 'Achievement',
      description = 'Achievement description',
      progress = null,
      locked = false
    } = config;

    const card = document.createElement('div');
    card.className = `achievement-card${locked ? ' achievement-card--locked' : ''}`;

    let progressHtml = '';
    if (progress) {
      progressHtml = `
        <div class="achievement-card__progress">
          <div class="achievement-card__progress-label">
            <span>Progress</span>
            <span>${progress.current}/${progress.total}</span>
          </div>
          <div class="achievement-card__progress-bar">
            <div class="achievement-card__progress-fill" style="width: ${(progress.current / progress.total) * 100}%"></div>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="achievement-card__badge achievement-card__badge--${badge}">
        <span class="achievement-card__badge-icon">${icon}</span>
        ${!locked ? '<div class="achievement-card__badge-glow"></div>' : ''}
      </div>
      <h3 class="achievement-card__title">${title}</h3>
      <p class="achievement-card__description">${description}</p>
      ${progressHtml}
    `;

    return card;
  },

  /**
   * Create a leaderboard card element
   * @param {Object} config - Card configuration
   * @returns {HTMLElement} The created card element
   */
  createLeaderboardCard(config) {
    const {
      rank = 1,
      avatar = '',
      name = 'User Name',
      meta = '',
      points = 0,
      isCurrentUser = false
    } = config;

    const card = document.createElement('div');
    card.className = `leaderboard-card${isCurrentUser ? ' leaderboard-card--current-user' : ''}`;

    const rankClass = rank <= 3 ? ` leaderboard-card__rank--${rank}` : '';

    card.innerHTML = `
      <div class="leaderboard-card__rank${rankClass}">${rank}</div>
      <img src="${avatar}" alt="${name}" class="leaderboard-card__avatar">
      <div class="leaderboard-card__info">
        <div class="leaderboard-card__name">${name}</div>
        <div class="leaderboard-card__meta">${meta}</div>
      </div>
      <div class="leaderboard-card__points">
        <div class="leaderboard-card__points-value">${points.toLocaleString()}</div>
        <div class="leaderboard-card__points-label">points</div>
      </div>
    `;

    return card;
  },

  /**
   * Create an activity card element
   * @param {Object} config - Card configuration
   * @returns {HTMLElement} The created card element
   */
  createActivityCard(config) {
    const {
      icon = '📝',
      iconType = 'primary',
      title = 'Activity Title',
      description = 'Activity description',
      time = 'Just now',
      meta = []
    } = config;

    const card = document.createElement('div');
    card.className = `activity-card activity-card--${iconType}`;

    let metaHtml = '';
    if (meta.length > 0) {
      metaHtml = `
        <div class="activity-card__meta">
          ${meta.map(item => `<div class="activity-card__meta-item">${item}</div>`).join('')}
        </div>
      `;
    }

    card.innerHTML = `
      <div class="activity-card__icon-wrapper">
        <span class="activity-card__icon">${icon}</span>
      </div>
      <div class="activity-card__content">
        <div class="activity-card__header">
          <h4 class="activity-card__title">${title}</h4>
          <span class="activity-card__time">${time}</span>
        </div>
        <p class="activity-card__description">${description}</p>
        ${metaHtml}
      </div>
    `;

    return card;
  }
};

// Make utilities globally available
if (typeof window !== 'undefined') {
  window.CardUtils = CardUtils;
}
