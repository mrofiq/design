/**
 * Developer Report Dashboard - Real-time Event Handlers
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * Handles real-time events from WebSocket:
 * - event.created (new activity)
 * - points.updated (score changes)
 * - report.approved (approval status)
 * - report.changes_requested (feedback)
 * - leaderboard.updated (rankings)
 * - notification (system messages)
 * - achievement.unlocked (badge earned)
 */

class RealTimeManager {
  constructor(options = {}) {
    this.wsManager = options.wsManager || null;
    this.debug = options.debug || false;
    this.userId = options.userId || null;

    // Event handler callbacks
    this.handlers = {
      'event.created': [],
      'points.updated': [],
      'report.approved': [],
      'report.changes_requested': [],
      'leaderboard.updated': [],
      'notification': [],
      'achievement.unlocked': []
    };

    // Animation queues
    this.animationQueue = [];
    this.isAnimating = false;

    // Initialize if WebSocket manager provided
    if (this.wsManager) {
      this.init();
    }
  }

  /**
   * Initialize real-time manager
   */
  init() {
    if (!this.wsManager) {
      this.log('No WebSocket manager provided');
      return;
    }

    // Subscribe to all event types
    Object.keys(this.handlers).forEach(eventType => {
      this.wsManager.subscribe(eventType, (data) => {
        this.handleEvent(eventType, data);
      });
    });

    // Listen to connection state changes
    this.wsManager.on('stateChange', ({ from, to }) => {
      this.handleConnectionStateChange(from, to);
    });

    this.log('Real-time manager initialized');
  }

  /**
   * Set WebSocket manager
   * @param {WebSocketManager} wsManager - WebSocket manager instance
   */
  setWebSocketManager(wsManager) {
    this.wsManager = wsManager;
    this.init();
  }

  /**
   * Set current user ID
   * @param {string} userId - User ID
   */
  setUserId(userId) {
    this.userId = userId;
  }

  /**
   * Handle incoming event
   * @param {string} eventType - Event type
   * @param {Object} data - Event data
   */
  handleEvent(eventType, data) {
    this.log(`Event received: ${eventType}`, data);

    // Call built-in handler
    const handlerMethod = `handle${this.toCamelCase(eventType)}`;
    if (typeof this[handlerMethod] === 'function') {
      this[handlerMethod](data);
    }

    // Call registered callbacks
    if (this.handlers[eventType]) {
      this.handlers[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          this.log('Handler callback error:', error);
        }
      });
    }
  }

  /**
   * Handle event.created
   * @param {Object} data - Event data
   */
  handleEventCreated(data) {
    const { event, user } = data;

    // Only update if it's for current user or global event
    if (this.userId && user.id !== this.userId && !data.global) {
      return;
    }

    // Update timeline if component exists
    this.updateTimeline(event);

    // Show notification
    this.showEventNotification(event);

    // Emit custom event for other components
    this.emitCustomEvent('eventCreated', { event, user });
  }

  /**
   * Handle points.updated
   * @param {Object} data - Points data
   */
  handlePointsUpdated(data) {
    const { userId, points, change, reason, balance } = data;

    // Only update if it's for current user
    if (this.userId && userId !== this.userId) {
      return;
    }

    // Update points display
    this.updatePointsDisplay(balance, change);

    // Update progress bars
    this.updateProgressBars(balance);

    // Show points animation
    if (change !== 0) {
      this.animatePointsChange(change, reason);
    }

    // Emit custom event
    this.emitCustomEvent('pointsUpdated', data);
  }

  /**
   * Handle report.approved
   * @param {Object} data - Report data
   */
  handleReportApproved(data) {
    const { reportId, report, approvedBy } = data;

    // Only update if it's current user's report
    if (this.userId && report.userId !== this.userId) {
      return;
    }

    // Update report status in UI
    this.updateReportStatus(reportId, 'approved');

    // Show success notification
    if (window.showSuccess) {
      window.showSuccess('Your report has been approved!', {
        title: 'Report Approved',
        duration: 5000
      });
    }

    // Update report card if visible
    this.updateReportCard(reportId, {
      status: 'approved',
      approvedBy: approvedBy.name,
      approvedAt: new Date().toISOString()
    });

    // Emit custom event
    this.emitCustomEvent('reportApproved', data);
  }

  /**
   * Handle report.changes_requested
   * @param {Object} data - Report data
   */
  handleReportChangesRequested(data) {
    const { reportId, report, feedback, requestedBy } = data;

    // Only update if it's current user's report
    if (this.userId && report.userId !== this.userId) {
      return;
    }

    // Update report status in UI
    this.updateReportStatus(reportId, 'changes_requested');

    // Show warning notification
    if (window.showWarning) {
      window.showWarning('Changes requested on your report', {
        title: 'Report Feedback',
        duration: 8000
      });
    }

    // Update report card with feedback
    this.updateReportCard(reportId, {
      status: 'changes_requested',
      feedback,
      requestedBy: requestedBy.name,
      requestedAt: new Date().toISOString()
    });

    // Emit custom event
    this.emitCustomEvent('reportChangesRequested', data);
  }

  /**
   * Handle leaderboard.updated
   * @param {Object} data - Leaderboard data
   */
  handleLeaderboardUpdated(data) {
    const { leaderboard, type } = data;

    // Update leaderboard component if exists
    this.updateLeaderboard(leaderboard, type);

    // Check if current user's position changed
    if (this.userId && leaderboard) {
      const userEntry = leaderboard.find(entry => entry.userId === this.userId);
      if (userEntry) {
        this.handleUserRankChange(userEntry);
      }
    }

    // Emit custom event
    this.emitCustomEvent('leaderboardUpdated', data);
  }

  /**
   * Handle notification
   * @param {Object} data - Notification data
   */
  handleNotification(data) {
    const { type, title, message, priority, action } = data;

    // Show toast notification
    const toastType = this.getToastType(type);
    const duration = priority === 'high' ? 10000 : 5000;

    if (window.showToast) {
      window.showToast(message, toastType, {
        title,
        duration,
        action
      });
    }

    // Play notification sound if high priority
    if (priority === 'high') {
      this.playNotificationSound();
    }

    // Emit custom event
    this.emitCustomEvent('notification', data);
  }

  /**
   * Handle achievement.unlocked
   * @param {Object} data - Achievement data
   */
  handleAchievementUnlocked(data) {
    const { achievement, user } = data;

    // Only show if it's for current user
    if (this.userId && user.id !== this.userId) {
      return;
    }

    // Show achievement modal/animation
    this.showAchievementAnimation(achievement);

    // Update achievements display
    this.updateAchievementsDisplay(achievement);

    // Show congratulations notification
    if (window.showSuccess) {
      window.showSuccess(`You've unlocked: ${achievement.name}!`, {
        title: 'Achievement Unlocked!',
        duration: 8000
      });
    }

    // Play achievement sound
    this.playAchievementSound();

    // Emit custom event
    this.emitCustomEvent('achievementUnlocked', data);
  }

  /**
   * Handle connection state change
   * @param {string} from - Previous state
   * @param {string} to - New state
   */
  handleConnectionStateChange(from, to) {
    this.log(`Connection state: ${from} -> ${to}`);

    // Update connection status indicator
    this.updateConnectionStatus(to);

    // Show notification on connection status change
    if (to === 'connected' && from !== 'connecting') {
      if (window.showSuccess) {
        window.showSuccess('Real-time updates reconnected', {
          duration: 3000
        });
      }
    } else if (to === 'disconnected' && from === 'connected') {
      if (window.showWarning) {
        window.showWarning('Real-time updates disconnected', {
          duration: 5000
        });
      }
    }
  }

  /**
   * Update timeline with new event
   * @param {Object} event - Event data
   */
  updateTimeline(event) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const timelineItem = this.createTimelineItem(event);
    timeline.insertBefore(timelineItem, timeline.firstChild);

    // Animate entrance
    requestAnimationFrame(() => {
      timelineItem.classList.add('timeline-item--entering');
    });

    // Limit timeline items
    const items = timeline.querySelectorAll('.timeline-item');
    if (items.length > 20) {
      items[items.length - 1].remove();
    }
  }

  /**
   * Create timeline item element
   * @param {Object} event - Event data
   * @returns {HTMLElement} Timeline item
   */
  createTimelineItem(event) {
    const item = document.createElement('div');
    item.className = `timeline-item timeline-item--${event.type}`;
    item.innerHTML = `
      <div class="timeline-item__icon">
        ${this.getEventIcon(event.type)}
      </div>
      <div class="timeline-item__content">
        <div class="timeline-item__header">
          <span class="timeline-item__title">${this.escapeHtml(event.title)}</span>
          <span class="timeline-item__time">${this.formatTimeAgo(event.timestamp)}</span>
        </div>
        ${event.description ? `<p class="timeline-item__description">${this.escapeHtml(event.description)}</p>` : ''}
        ${event.points ? `<span class="timeline-item__points ${event.points > 0 ? 'positive' : 'negative'}">${event.points > 0 ? '+' : ''}${event.points} pts</span>` : ''}
      </div>
    `;
    return item;
  }

  /**
   * Update points display
   * @param {number} balance - New balance
   * @param {number} change - Points change
   */
  updatePointsDisplay(balance, change) {
    const pointsElement = document.querySelector('.points-display__value');
    if (pointsElement) {
      // Animate number change
      this.animateNumber(pointsElement, parseInt(pointsElement.textContent) || 0, balance);
    }
  }

  /**
   * Animate points change
   * @param {number} change - Points change amount
   * @param {string} reason - Change reason
   */
  animatePointsChange(change, reason) {
    const pointsDisplay = document.querySelector('.points-display');
    if (!pointsDisplay) return;

    const animation = document.createElement('div');
    animation.className = `points-animation ${change > 0 ? 'points-animation--positive' : 'points-animation--negative'}`;
    animation.textContent = `${change > 0 ? '+' : ''}${change}`;

    pointsDisplay.appendChild(animation);

    // Remove after animation
    setTimeout(() => {
      animation.remove();
    }, 2000);
  }

  /**
   * Update progress bars
   * @param {number} balance - Current balance
   */
  updateProgressBars(balance) {
    // Update daily goal progress
    const dailyProgress = document.querySelector('.daily-progress__bar');
    if (dailyProgress) {
      const dailyGoal = parseInt(dailyProgress.dataset.goal) || 100;
      const percentage = Math.min((balance / dailyGoal) * 100, 100);
      dailyProgress.style.width = `${percentage}%`;
      dailyProgress.setAttribute('aria-valuenow', percentage);
    }
  }

  /**
   * Update report status
   * @param {string} reportId - Report ID
   * @param {string} status - New status
   */
  updateReportStatus(reportId, status) {
    const reportCard = document.querySelector(`[data-report-id="${reportId}"]`);
    if (reportCard) {
      const statusBadge = reportCard.querySelector('.report-status');
      if (statusBadge) {
        statusBadge.className = `badge badge--${status}`;
        statusBadge.textContent = status.replace('_', ' ');
      }
    }
  }

  /**
   * Update report card
   * @param {string} reportId - Report ID
   * @param {Object} updates - Updates to apply
   */
  updateReportCard(reportId, updates) {
    const reportCard = document.querySelector(`[data-report-id="${reportId}"]`);
    if (!reportCard) return;

    // Update status
    if (updates.status) {
      const statusBadge = reportCard.querySelector('.report-status');
      if (statusBadge) {
        statusBadge.className = `badge badge--${updates.status}`;
        statusBadge.textContent = updates.status.replace('_', ' ');
      }
    }

    // Add feedback if present
    if (updates.feedback) {
      const feedbackSection = reportCard.querySelector('.report-feedback');
      if (feedbackSection) {
        feedbackSection.innerHTML = `
          <div class="feedback-message">
            <strong>Feedback from ${this.escapeHtml(updates.requestedBy)}:</strong>
            <p>${this.escapeHtml(updates.feedback)}</p>
          </div>
        `;
        feedbackSection.style.display = 'block';
      }
    }
  }

  /**
   * Update leaderboard
   * @param {Array} leaderboard - Leaderboard data
   * @param {string} type - Leaderboard type
   */
  updateLeaderboard(leaderboard, type) {
    const leaderboardElement = document.querySelector(`.leaderboard[data-type="${type}"]`);
    if (!leaderboardElement) return;

    const tbody = leaderboardElement.querySelector('tbody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    // Add new rows
    leaderboard.forEach((entry, index) => {
      const row = this.createLeaderboardRow(entry, index + 1);
      tbody.appendChild(row);
    });

    // Highlight current user
    if (this.userId) {
      const userRow = tbody.querySelector(`[data-user-id="${this.userId}"]`);
      if (userRow) {
        userRow.classList.add('leaderboard-row--current-user');
      }
    }
  }

  /**
   * Create leaderboard row
   * @param {Object} entry - Leaderboard entry
   * @param {number} rank - Rank position
   * @returns {HTMLElement} Table row
   */
  createLeaderboardRow(entry, rank) {
    const tr = document.createElement('tr');
    tr.className = 'leaderboard-row';
    tr.setAttribute('data-user-id', entry.userId);

    tr.innerHTML = `
      <td class="leaderboard-rank">#${rank}</td>
      <td class="leaderboard-user">
        <div class="user-info">
          <span class="avatar avatar--sm">${entry.name.charAt(0)}</span>
          <span class="user-name">${this.escapeHtml(entry.name)}</span>
        </div>
      </td>
      <td class="leaderboard-points">${entry.points}</td>
      <td class="leaderboard-trend">
        ${this.getTrendIndicator(entry.trend)}
      </td>
    `;

    return tr;
  }

  /**
   * Handle user rank change
   * @param {Object} userEntry - User leaderboard entry
   */
  handleUserRankChange(userEntry) {
    const previousRank = parseInt(localStorage.getItem('user_rank')) || 0;
    const currentRank = userEntry.rank;

    if (previousRank && currentRank < previousRank) {
      // Rank improved
      if (window.showSuccess) {
        window.showSuccess(`You moved up to rank #${currentRank}!`, {
          title: 'Rank Up!',
          duration: 5000
        });
      }
    }

    // Save current rank
    localStorage.setItem('user_rank', currentRank);
  }

  /**
   * Show achievement animation
   * @param {Object} achievement - Achievement data
   */
  showAchievementAnimation(achievement) {
    const modal = document.createElement('div');
    modal.className = 'achievement-modal';
    modal.innerHTML = `
      <div class="achievement-modal__overlay"></div>
      <div class="achievement-modal__content">
        <div class="achievement-icon">${achievement.icon || '🏆'}</div>
        <h2 class="achievement-title">Achievement Unlocked!</h2>
        <h3 class="achievement-name">${this.escapeHtml(achievement.name)}</h3>
        <p class="achievement-description">${this.escapeHtml(achievement.description)}</p>
        <button class="btn-primary" onclick="this.closest('.achievement-modal').remove()">
          Awesome!
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 10000);
  }

  /**
   * Update achievements display
   * @param {Object} achievement - Achievement data
   */
  updateAchievementsDisplay(achievement) {
    const achievementsGrid = document.querySelector('.achievements-grid');
    if (!achievementsGrid) return;

    const achievementCard = achievementsGrid.querySelector(`[data-achievement-id="${achievement.id}"]`);
    if (achievementCard) {
      achievementCard.classList.remove('achievement--locked');
      achievementCard.classList.add('achievement--unlocked', 'achievement--new');
    }
  }

  /**
   * Update connection status indicator
   * @param {string} status - Connection status
   */
  updateConnectionStatus(status) {
    const indicator = document.querySelector('.connection-status');
    if (!indicator) return;

    indicator.className = `connection-status connection-status--${status}`;

    const label = indicator.querySelector('.connection-status__label');
    if (label) {
      const labels = {
        connected: 'Connected',
        connecting: 'Connecting...',
        reconnecting: 'Reconnecting...',
        disconnected: 'Disconnected'
      };
      label.textContent = labels[status] || status;
    }
  }

  /**
   * Show event notification
   * @param {Object} event - Event data
   */
  showEventNotification(event) {
    if (event.points && Math.abs(event.points) >= 10) {
      const type = event.points > 0 ? 'success' : 'warning';
      if (window.showToast) {
        window.showToast(event.title, type, {
          duration: 3000
        });
      }
    }
  }

  /**
   * Register event handler
   * @param {string} eventType - Event type
   * @param {Function} callback - Callback function
   */
  on(eventType, callback) {
    if (this.handlers[eventType]) {
      this.handlers[eventType].push(callback);
    }
  }

  /**
   * Unregister event handler
   * @param {string} eventType - Event type
   * @param {Function} callback - Callback function
   */
  off(eventType, callback) {
    if (this.handlers[eventType]) {
      const index = this.handlers[eventType].indexOf(callback);
      if (index !== -1) {
        this.handlers[eventType].splice(index, 1);
      }
    }
  }

  /**
   * Emit custom DOM event
   * @param {string} eventName - Event name
   * @param {*} detail - Event detail
   */
  emitCustomEvent(eventName, detail) {
    const event = new CustomEvent(`realtime:${eventName}`, { detail });
    document.dispatchEvent(event);
  }

  /**
   * Utility: Convert to camel case
   * @param {string} str - String to convert
   * @returns {string} Camel case string
   */
  toCamelCase(str) {
    return str.replace(/[._-](\w)/g, (_, char) => char.toUpperCase());
  }

  /**
   * Utility: Escape HTML
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Utility: Format time ago
   * @param {string|Date} timestamp - Timestamp
   * @returns {string} Formatted time
   */
  formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }

  /**
   * Utility: Animate number
   * @param {HTMLElement} element - Element to animate
   * @param {number} from - Start value
   * @param {number} to - End value
   */
  animateNumber(element, from, to) {
    const duration = 1000;
    const start = Date.now();
    const range = to - from;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(from + range * progress);

      element.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /**
   * Utility: Get toast type
   * @param {string} type - Notification type
   * @returns {string} Toast type
   */
  getToastType(type) {
    const map = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return map[type] || 'info';
  }

  /**
   * Utility: Get event icon
   * @param {string} type - Event type
   * @returns {string} Icon HTML
   */
  getEventIcon(type) {
    // Return appropriate icon based on event type
    return '📌';
  }

  /**
   * Utility: Get trend indicator
   * @param {number} trend - Trend value
   * @returns {string} Trend HTML
   */
  getTrendIndicator(trend) {
    if (!trend || trend === 0) return '—';
    return trend > 0 ? `<span class="trend-up">↑ ${trend}</span>` : `<span class="trend-down">↓ ${Math.abs(trend)}</span>`;
  }

  /**
   * Utility: Play notification sound
   */
  playNotificationSound() {
    // Implement sound playing if needed
    // const audio = new Audio('/assets/sounds/notification.mp3');
    // audio.play().catch(() => {});
  }

  /**
   * Utility: Play achievement sound
   */
  playAchievementSound() {
    // Implement sound playing if needed
    // const audio = new Audio('/assets/sounds/achievement.mp3');
    // audio.play().catch(() => {});
  }

  /**
   * Logging utility
   * @param {...any} args - Arguments to log
   */
  log(...args) {
    if (this.debug) {
      console.log('[RealTime]', ...args);
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RealTimeManager;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.RealTimeManager = RealTimeManager;
}
