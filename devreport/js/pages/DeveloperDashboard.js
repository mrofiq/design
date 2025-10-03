/**
 * Developer Report Dashboard - Developer Dashboard Page
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * This module handles the developer dashboard page including:
 * - Stats overview with real-time updates
 * - Activity timeline auto-refresh
 * - Report form submission
 * - Achievement unlock animations
 * - Leaderboard updates
 * - Mock API calls for data fetching
 */

class DeveloperDashboard {
  constructor() {
    // Configuration
    this.config = {
      activityRefreshInterval: 30000, // 30 seconds
      statsRefreshInterval: 60000, // 1 minute
      maxActivities: 10,
      maxAchievements: 4,
      leaderboardLimit: 5
    };

    // State
    this.state = {
      currentUser: {
        id: 'user-1',
        name: 'John Doe',
        avatar: 'JD',
        email: 'john.doe@company.com',
        stats: {
          totalPoints: 1250,
          dailyStreak: 7,
          currentRank: 3,
          currentLevel: 'Senior'
        }
      },
      activities: [],
      achievements: [],
      leaderboard: [],
      isLoading: false,
      refreshIntervals: {}
    };

    // DOM Elements
    this.elements = {
      // Stats
      totalPointsStat: document.querySelector('[data-stat="totalPoints"]'),
      dailyStreakStat: document.querySelector('[data-stat="dailyStreak"]'),
      currentRankStat: document.querySelector('[data-stat="currentRank"]'),
      currentLevelStat: document.querySelector('[data-stat="currentLevel"]'),

      // Activity Timeline
      activityTimeline: document.getElementById('activityTimeline'),
      refreshActivityBtn: document.getElementById('refreshActivityBtn'),

      // Quick Actions
      viewReportsBtn: document.getElementById('viewReportsBtn'),
      viewAchievementsBtn: document.getElementById('viewAchievementsBtn'),
      viewLeaderboardBtn: document.getElementById('viewLeaderboardBtn'),
      viewTeamBtn: document.getElementById('viewTeamBtn'),

      // Achievements Preview
      achievementsPreview: document.getElementById('achievementsPreview'),

      // Leaderboard Preview
      leaderboardPreview: document.getElementById('leaderboardPreview'),

      // Report Modal & Form
      submitReportBtn: document.getElementById('submitReportBtn'),
      reportModal: document.getElementById('reportModal'),
      reportForm: document.getElementById('reportForm'),
      submitReportFormBtn: document.getElementById('submitReportFormBtn'),
      teamRecognitionSelect: document.getElementById('teamRecognition'),
      recognitionReasonField: document.getElementById('recognitionReasonField'),

      // Toast Container
      toastContainer: document.getElementById('toastContainer')
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize the dashboard
   */
  async init() {
    console.log('Initializing Developer Dashboard...');

    // Set up event listeners
    this.setupEventListeners();

    // Load initial data
    await this.loadDashboardData();

    // Set up auto-refresh intervals
    this.setupAutoRefresh();

    console.log('Developer Dashboard initialized successfully');
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Submit Report Button
    if (this.elements.submitReportBtn) {
      this.elements.submitReportBtn.addEventListener('click', () => {
        this.openReportModal();
      });
    }

    // Refresh Activity Button
    if (this.elements.refreshActivityBtn) {
      this.elements.refreshActivityBtn.addEventListener('click', () => {
        this.refreshActivities();
      });
    }

    // Quick Action Buttons
    if (this.elements.viewReportsBtn) {
      this.elements.viewReportsBtn.addEventListener('click', () => {
        window.location.href = '/reports';
      });
    }

    if (this.elements.viewAchievementsBtn) {
      this.elements.viewAchievementsBtn.addEventListener('click', () => {
        window.location.href = '/achievements';
      });
    }

    if (this.elements.viewLeaderboardBtn) {
      this.elements.viewLeaderboardBtn.addEventListener('click', () => {
        window.location.href = '/leaderboard';
      });
    }

    if (this.elements.viewTeamBtn) {
      this.elements.viewTeamBtn.addEventListener('click', () => {
        window.location.href = '/team';
      });
    }

    // Report Form Submission
    if (this.elements.reportForm) {
      this.elements.reportForm.addEventListener('formValidated', (e) => {
        this.handleReportSubmit(e.detail.data);
      });
    }

    // Team Recognition Selection
    if (this.elements.teamRecognitionSelect) {
      this.elements.teamRecognitionSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          this.elements.recognitionReasonField.style.display = 'block';
        } else {
          this.elements.recognitionReasonField.style.display = 'none';
        }
      });
    }
  }

  /**
   * Load all dashboard data
   */
  async loadDashboardData() {
    this.state.isLoading = true;

    try {
      // Load data in parallel
      const [activities, achievements, leaderboard] = await Promise.all([
        this.fetchActivities(),
        this.fetchAchievements(),
        this.fetchLeaderboard()
      ]);

      this.state.activities = activities;
      this.state.achievements = achievements;
      this.state.leaderboard = leaderboard;

      // Render data
      this.renderActivities();
      this.renderAchievements();
      this.renderLeaderboard();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showToast('Failed to load dashboard data', 'error');
    } finally {
      this.state.isLoading = false;
    }
  }

  /**
   * Set up auto-refresh intervals
   */
  setupAutoRefresh() {
    // Auto-refresh activities
    this.state.refreshIntervals.activities = setInterval(() => {
      this.refreshActivities(true); // Silent refresh
    }, this.config.activityRefreshInterval);

    // Auto-refresh stats
    this.state.refreshIntervals.stats = setInterval(() => {
      this.refreshStats();
    }, this.config.statsRefreshInterval);
  }

  /**
   * Mock API: Fetch activities
   */
  async fetchActivities() {
    // Simulate API delay
    await this.delay(800);

    // Mock activity data
    const activities = [
      {
        id: 'act-1',
        type: 'commit',
        title: 'Pushed 3 commits to feature/user-auth',
        description: 'Implemented OAuth2 authentication flow with token refresh mechanism',
        time: '5 minutes ago',
        points: 6,
        meta: ['feature/user-auth', '3 commits'],
        variant: 'success'
      },
      {
        id: 'act-2',
        type: 'merge_request',
        title: 'Merge request approved',
        description: 'Your MR "Add user profile API endpoints" was approved and merged',
        time: '1 hour ago',
        points: 10,
        meta: ['backend', 'API'],
        variant: 'success'
      },
      {
        id: 'act-3',
        type: 'code_review',
        title: 'Completed code review',
        description: 'Reviewed pull request #245: Frontend form validation improvements',
        time: '2 hours ago',
        points: 3,
        meta: ['frontend', 'review'],
        variant: 'primary'
      },
      {
        id: 'act-4',
        type: 'task_completion',
        title: 'Task completed: Setup Redis caching',
        description: 'Successfully implemented Redis caching layer for API responses',
        time: '3 hours ago',
        points: 10,
        meta: ['backend', 'performance'],
        variant: 'success'
      },
      {
        id: 'act-5',
        type: 'quality_gate',
        title: 'Quality gate passed',
        description: 'SonarQube analysis completed with 0 critical issues',
        time: '4 hours ago',
        points: 15,
        meta: ['quality', 'sonarqube'],
        variant: 'success'
      },
      {
        id: 'act-6',
        type: 'issue_resolved',
        title: 'Issue resolved: Login timeout bug',
        description: 'Fixed session timeout issue affecting user login experience',
        time: 'Yesterday',
        points: 5,
        meta: ['bug fix', 'authentication'],
        variant: 'success'
      }
    ];

    return activities.slice(0, this.config.maxActivities);
  }

  /**
   * Mock API: Fetch achievements
   */
  async fetchAchievements() {
    await this.delay(600);

    const achievements = [
      {
        id: 'ach-1',
        badge: 'gold',
        icon: '🏆',
        title: 'Early Bird',
        date: '2 days ago'
      },
      {
        id: 'ach-2',
        badge: 'silver',
        icon: '🎯',
        title: 'Streak Master',
        date: '5 days ago'
      },
      {
        id: 'ach-3',
        badge: 'bronze',
        icon: '🌟',
        title: 'Team Player',
        date: '1 week ago'
      },
      {
        id: 'ach-4',
        badge: 'gold',
        icon: '💎',
        title: 'Quality Champion',
        date: '2 weeks ago'
      }
    ];

    return achievements.slice(0, this.config.maxAchievements);
  }

  /**
   * Mock API: Fetch leaderboard
   */
  async fetchLeaderboard() {
    await this.delay(500);

    const leaderboard = [
      {
        id: 'user-2',
        rank: 1,
        name: 'Alice Johnson',
        avatar: 'AJ',
        points: 1850,
        isCurrentUser: false
      },
      {
        id: 'user-3',
        rank: 2,
        name: 'Bob Smith',
        avatar: 'BS',
        points: 1620,
        isCurrentUser: false
      },
      {
        id: 'user-1',
        rank: 3,
        name: 'John Doe',
        avatar: 'JD',
        points: 1250,
        isCurrentUser: true
      },
      {
        id: 'user-4',
        rank: 4,
        name: 'Carol Williams',
        avatar: 'CW',
        points: 1180,
        isCurrentUser: false
      },
      {
        id: 'user-5',
        rank: 5,
        name: 'David Brown',
        avatar: 'DB',
        points: 1050,
        isCurrentUser: false
      }
    ];

    return leaderboard.slice(0, this.config.leaderboardLimit);
  }

  /**
   * Render activities timeline
   */
  renderActivities() {
    if (!this.elements.activityTimeline) return;

    if (this.state.activities.length === 0) {
      this.elements.activityTimeline.innerHTML = `
        <div class="timeline-empty">
          <div class="timeline-empty-icon">📭</div>
          <p>No activities yet. Start working to see your progress here!</p>
        </div>
      `;
      return;
    }

    const activitiesHtml = this.state.activities.map(activity => `
      <div class="timeline-item timeline-item--${activity.variant || 'primary'}">
        <span class="timeline-item-time">${activity.time}</span>
        <div class="timeline-item-content">
          <h3 class="timeline-item-title">${activity.title}</h3>
          <p class="timeline-item-description">${activity.description}</p>
          <div class="timeline-item-meta">
            ${activity.meta.map(tag => `<span class="badge badge-sm">${tag}</span>`).join('')}
            ${activity.points ? `<span class="timeline-item-points">+${activity.points} pts</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    this.elements.activityTimeline.innerHTML = activitiesHtml;
  }

  /**
   * Render achievements preview
   */
  renderAchievements() {
    if (!this.elements.achievementsPreview) return;

    if (this.state.achievements.length === 0) {
      this.elements.achievementsPreview.innerHTML = `
        <p style="text-align: center; color: var(--color-gray-500); grid-column: 1 / -1;">
          No achievements yet. Keep working to unlock badges!
        </p>
      `;
      return;
    }

    const achievementsHtml = this.state.achievements.map(achievement => `
      <div class="achievement-preview-card">
        <div class="achievement-preview-badge achievement-preview-badge--${achievement.badge}">
          <span class="achievement-preview-badge-icon">${achievement.icon}</span>
        </div>
        <h3 class="achievement-preview-title">${achievement.title}</h3>
        <p class="achievement-preview-date">${achievement.date}</p>
      </div>
    `).join('');

    this.elements.achievementsPreview.innerHTML = achievementsHtml;
  }

  /**
   * Render leaderboard preview
   */
  renderLeaderboard() {
    if (!this.elements.leaderboardPreview) return;

    if (this.state.leaderboard.length === 0) {
      this.elements.leaderboardPreview.innerHTML = `
        <p style="text-align: center; color: var(--color-gray-500);">
          Leaderboard data unavailable.
        </p>
      `;
      return;
    }

    const leaderboardHtml = this.state.leaderboard.map(user => `
      <div class="leaderboard-preview-card ${user.isCurrentUser ? 'leaderboard-preview-card--current-user' : ''}">
        <div class="leaderboard-rank leaderboard-rank--${user.rank}">${user.rank}</div>
        <div class="leaderboard-avatar">${user.avatar}</div>
        <div class="leaderboard-info">
          <h4 class="leaderboard-name">${user.name}</h4>
        </div>
        <div class="leaderboard-points">
          <div class="leaderboard-points-value">${user.points.toLocaleString()}</div>
          <div class="leaderboard-points-label">pts</div>
        </div>
      </div>
    `).join('');

    this.elements.leaderboardPreview.innerHTML = leaderboardHtml;
  }

  /**
   * Refresh activities
   */
  async refreshActivities(silent = false) {
    if (!silent) {
      this.showToast('Refreshing activities...', 'info');
    }

    try {
      const activities = await this.fetchActivities();
      this.state.activities = activities;
      this.renderActivities();

      if (!silent) {
        this.showToast('Activities updated', 'success');
      }
    } catch (error) {
      console.error('Error refreshing activities:', error);
      this.showToast('Failed to refresh activities', 'error');
    }
  }

  /**
   * Refresh stats
   */
  async refreshStats() {
    try {
      // Simulate stat update
      await this.delay(300);

      // Update stats with animation
      if (window.cardComponent) {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
          window.cardComponent.refreshStatCounter(card);
        });
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }

  /**
   * Open report modal
   */
  openReportModal() {
    if (!this.elements.reportModal) return;

    // Reset form
    if (this.elements.reportForm) {
      this.elements.reportForm.reset();
      this.elements.recognitionReasonField.style.display = 'none';
    }

    // Open modal using Modal component
    const modalInstance = new Modal(this.elements.reportModal);
    modalInstance.open();
  }

  /**
   * Handle report form submission
   */
  async handleReportSubmit(formData) {
    console.log('Submitting report:', formData);

    this.state.isLoading = true;

    // Disable submit button
    if (this.elements.submitReportFormBtn) {
      this.elements.submitReportFormBtn.disabled = true;
      this.elements.submitReportFormBtn.textContent = 'Submitting...';
    }

    try {
      // Simulate API call
      await this.delay(1500);

      // Mock successful submission
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        // Update user points
        this.state.currentUser.stats.totalPoints += 10;
        this.state.currentUser.stats.dailyStreak += 1;

        // Update stats display
        if (this.elements.totalPointsStat) {
          this.elements.totalPointsStat.textContent = this.state.currentUser.stats.totalPoints.toLocaleString();
        }
        if (this.elements.dailyStreakStat) {
          this.elements.dailyStreakStat.textContent = this.state.currentUser.stats.dailyStreak;
        }

        // Add new activity to timeline
        const newActivity = {
          id: 'act-new-' + Date.now(),
          type: 'report_submission',
          title: 'Daily report submitted',
          description: 'Successfully submitted your daily report',
          time: 'Just now',
          points: 10,
          meta: ['report'],
          variant: 'success'
        };
        this.state.activities.unshift(newActivity);
        this.renderActivities();

        // Show success message
        this.showToast('Report submitted successfully! +10 points', 'success');

        // Close modal
        const modalInstance = Modal.getInstance(this.elements.reportModal);
        if (modalInstance) {
          modalInstance.close();
        }

        // Check for achievements
        this.checkAchievements();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      this.showToast('Failed to submit report. Please try again.', 'error');
    } finally {
      this.state.isLoading = false;

      // Re-enable submit button
      if (this.elements.submitReportFormBtn) {
        this.elements.submitReportFormBtn.disabled = false;
        this.elements.submitReportFormBtn.textContent = 'Submit Report';
      }
    }
  }

  /**
   * Check for new achievements
   */
  async checkAchievements() {
    // Simulate achievement unlock (e.g., 7-day streak)
    if (this.state.currentUser.stats.dailyStreak === 7) {
      await this.delay(500);

      const newAchievement = {
        id: 'ach-new-' + Date.now(),
        badge: 'gold',
        icon: '🔥',
        title: 'Week Warrior',
        date: 'Just now'
      };

      this.state.achievements.unshift(newAchievement);
      this.renderAchievements();

      this.showToast('Achievement unlocked: Week Warrior! 🔥', 'success');
    }
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    if (!this.elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
      </div>
    `;

    this.elements.toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.remove('toast-show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      });
    }
  }

  /**
   * Utility: Delay/sleep function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup and destroy
   */
  destroy() {
    // Clear intervals
    Object.values(this.state.refreshIntervals).forEach(interval => {
      clearInterval(interval);
    });

    console.log('Developer Dashboard destroyed');
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.DeveloperDashboard = DeveloperDashboard;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeveloperDashboard;
}
