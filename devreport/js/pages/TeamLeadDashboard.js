/**
 * Developer Report Dashboard - Team Lead Dashboard Page
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * This module handles the team lead dashboard page including:
 * - Approval workflow (approve/reject/request changes)
 * - Team stats aggregation and real-time updates
 * - Performance chart rendering with Chart.js
 * - Alert management for missing reports
 * - Bulk approval actions
 * - Team member management
 * - Recognition wall updates
 * - Role-based access control checks
 */

class TeamLeadDashboard {
  constructor() {
    // Configuration
    this.config = {
      refreshInterval: 60000, // 1 minute
      chartRefreshInterval: 300000, // 5 minutes
      maxAlerts: 5,
      maxRecognitions: 5,
      userRole: 'team_lead' // Role-based access control
    };

    // State
    this.state = {
      currentUser: {
        id: 'tl-1',
        name: 'Team Lead',
        avatar: 'TL',
        email: 'teamlead@company.com',
        role: 'team_lead',
        teamId: 'team-1'
      },
      teamStats: {
        teamMembers: 8,
        activeToday: 5,
        pendingApprovals: 3,
        teamPoints: 9850,
        teamRank: 2
      },
      pendingApprovals: [],
      teamMembers: [],
      alerts: [],
      recognitions: [],
      selectedReport: null,
      currentFilter: 'all',
      currentChart: 'points',
      performanceChart: null,
      refreshIntervals: {}
    };

    // DOM Elements
    this.elements = {
      // Stats
      teamMembersStat: document.querySelector('[data-stat="teamMembers"]'),
      pendingApprovalsStat: document.querySelector('[data-stat="pendingApprovals"]'),
      teamPointsStat: document.querySelector('[data-stat="teamPoints"]'),
      teamRankStat: document.querySelector('[data-stat="teamRank"]'),

      // Alert Panel
      alertPanel: document.getElementById('alertPanel'),

      // Approvals
      approvalQueue: document.getElementById('approvalQueue'),
      filterBtns: document.querySelectorAll('.filter-btn'),
      bulkApproveBtn: document.getElementById('bulkApproveBtn'),

      // Charts
      chartTabs: document.querySelectorAll('.chart-tab'),
      performanceCanvas: document.getElementById('teamPerformanceCanvas'),

      // Team Members
      teamMembersGrid: document.getElementById('teamMembersGrid'),

      // Recognition Wall
      recognitionWall: document.getElementById('recognitionWall'),

      // Quick Actions
      sendReminderBtn: document.getElementById('sendReminderBtn'),
      teamMeetingBtn: document.getElementById('teamMeetingBtn'),
      recognizeTeamBtn: document.getElementById('recognizeTeamBtn'),
      exportReportBtn: document.getElementById('exportReportBtn'),
      viewAnalyticsBtn: document.getElementById('viewAnalyticsBtn'),

      // Modals
      reviewReportModal: document.getElementById('reviewReportModal'),
      requestChangesModal: document.getElementById('requestChangesModal'),
      reportReviewContent: document.getElementById('reportReviewContent'),
      requestChangesForm: document.getElementById('requestChangesForm'),

      // Modal Buttons
      approveReportBtn: document.getElementById('approveReportBtn'),
      rejectReportBtn: document.getElementById('rejectReportBtn'),
      requestChangesBtn: document.getElementById('requestChangesBtn'),
      submitChangesBtn: document.getElementById('submitChangesBtn'),

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
    console.log('Initializing Team Lead Dashboard...');

    // Check role-based access
    if (!this.checkAccess()) {
      this.showAccessDenied();
      return;
    }

    // Set up event listeners
    this.setupEventListeners();

    // Load initial data
    await this.loadDashboardData();

    // Initialize charts
    this.initializeCharts();

    // Set up auto-refresh intervals
    this.setupAutoRefresh();

    console.log('Team Lead Dashboard initialized successfully');
  }

  /**
   * Role-based access control check
   */
  checkAccess() {
    const allowedRoles = ['team_lead', 'admin'];
    return allowedRoles.includes(this.state.currentUser.role);
  }

  /**
   * Show access denied message
   */
  showAccessDenied() {
    this.showToast('Access denied. Team Lead role required.', 'error');
    setTimeout(() => {
      window.location.href = '/pages/developer-dashboard.html';
    }, 2000);
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Filter buttons
    this.elements.filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterChange(e.target.dataset.filter);
      });
    });

    // Chart tabs
    this.elements.chartTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.handleChartChange(e.target.dataset.chart);
      });
    });

    // Quick Actions
    if (this.elements.sendReminderBtn) {
      this.elements.sendReminderBtn.addEventListener('click', () => {
        this.sendReminder();
      });
    }

    if (this.elements.teamMeetingBtn) {
      this.elements.teamMeetingBtn.addEventListener('click', () => {
        this.scheduleMeeting();
      });
    }

    if (this.elements.recognizeTeamBtn) {
      this.elements.recognizeTeamBtn.addEventListener('click', () => {
        this.recognizeTeam();
      });
    }

    if (this.elements.exportReportBtn) {
      this.elements.exportReportBtn.addEventListener('click', () => {
        this.exportReport();
      });
    }

    if (this.elements.viewAnalyticsBtn) {
      this.elements.viewAnalyticsBtn.addEventListener('click', () => {
        window.location.href = '/analytics';
      });
    }

    // Bulk Approve
    if (this.elements.bulkApproveBtn) {
      this.elements.bulkApproveBtn.addEventListener('click', () => {
        this.handleBulkApprove();
      });
    }

    // Modal Actions
    if (this.elements.approveReportBtn) {
      this.elements.approveReportBtn.addEventListener('click', () => {
        this.approveReport();
      });
    }

    if (this.elements.rejectReportBtn) {
      this.elements.rejectReportBtn.addEventListener('click', () => {
        this.rejectReport();
      });
    }

    if (this.elements.requestChangesBtn) {
      this.elements.requestChangesBtn.addEventListener('click', () => {
        this.openRequestChangesModal();
      });
    }

    if (this.elements.requestChangesForm) {
      this.elements.requestChangesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitRequestChanges();
      });
    }
  }

  /**
   * Load all dashboard data
   */
  async loadDashboardData() {
    try {
      // Load data in parallel
      const [approvals, teamMembers, alerts, recognitions] = await Promise.all([
        this.fetchPendingApprovals(),
        this.fetchTeamMembers(),
        this.fetchAlerts(),
        this.fetchRecognitions()
      ]);

      this.state.pendingApprovals = approvals;
      this.state.teamMembers = teamMembers;
      this.state.alerts = alerts;
      this.state.recognitions = recognitions;

      // Render data
      this.renderAlerts();
      this.renderApprovals();
      this.renderTeamMembers();
      this.renderRecognitions();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showToast('Failed to load dashboard data', 'error');
    }
  }

  /**
   * Set up auto-refresh intervals
   */
  setupAutoRefresh() {
    // Auto-refresh approvals and alerts
    this.state.refreshIntervals.data = setInterval(() => {
      this.refreshData();
    }, this.config.refreshInterval);

    // Auto-refresh charts
    this.state.refreshIntervals.charts = setInterval(() => {
      this.updateChart();
    }, this.config.chartRefreshInterval);
  }

  /**
   * Mock API: Fetch pending approvals
   */
  async fetchPendingApprovals() {
    await this.delay(800);

    return [
      {
        id: 'report-1',
        userId: 'user-1',
        userName: 'John Doe',
        userAvatar: 'JD',
        date: '2025-10-03',
        submittedAt: '2025-10-03 16:30:00',
        status: 'pending',
        isOverdue: false,
        workCompleted: 'Implemented OAuth2 authentication flow with token refresh mechanism. Updated user profile API endpoints. Fixed session timeout issue.',
        incidents: 'Encountered issues with token expiration timing. Resolved by implementing proper refresh token rotation.',
        priorities: 'Continue working on user authentication improvements. Start on password reset functionality.',
        helpNeeded: 'Need guidance on implementing 2FA options.',
        recognition: { name: 'Alice Johnson', reason: 'Helped debug OAuth flow' },
        events: [
          { type: 'commit', title: 'Pushed 3 commits to feature/user-auth', points: 6 },
          { type: 'merge', title: 'Merged pull request #245', points: 10 },
          { type: 'task', title: 'Completed task: OAuth implementation', points: 10 }
        ]
      },
      {
        id: 'report-2',
        userId: 'user-2',
        userName: 'Alice Johnson',
        userAvatar: 'AJ',
        date: '2025-10-03',
        submittedAt: '2025-10-03 17:15:00',
        status: 'pending',
        isOverdue: false,
        workCompleted: 'Completed frontend form validation improvements. Added real-time validation feedback. Implemented error state handling.',
        incidents: 'No major incidents. Minor CSS alignment issues resolved.',
        priorities: 'Work on responsive design improvements for mobile devices.',
        helpNeeded: null,
        recognition: null,
        events: [
          { type: 'commit', title: 'Pushed 5 commits to feature/form-validation', points: 10 },
          { type: 'review', title: 'Code review completed', points: 3 }
        ]
      },
      {
        id: 'report-3',
        userId: 'user-3',
        userName: 'Bob Smith',
        userAvatar: 'BS',
        date: '2025-10-02',
        submittedAt: '2025-10-02 20:45:00',
        status: 'pending',
        isOverdue: true,
        workCompleted: 'Setup Redis caching layer for API responses. Implemented cache invalidation logic. Added monitoring for cache hit rates.',
        incidents: 'Redis connection timeout issues on production. Resolved by adjusting connection pool settings.',
        priorities: 'Optimize cache key naming strategy. Add cache warming mechanism.',
        helpNeeded: 'Need review on cache invalidation patterns.',
        recognition: { name: 'Carol Williams', reason: 'Helped with Redis configuration' },
        events: [
          { type: 'commit', title: 'Pushed 4 commits to feature/redis-cache', points: 8 },
          { type: 'task', title: 'Completed task: Redis setup', points: 10 }
        ]
      }
    ];
  }

  /**
   * Mock API: Fetch team members
   */
  async fetchTeamMembers() {
    await this.delay(600);

    return [
      {
        id: 'user-1',
        name: 'John Doe',
        avatar: 'JD',
        role: 'Senior Developer',
        status: 'online',
        points: 1250,
        streak: 7,
        reportStatus: 'submitted'
      },
      {
        id: 'user-2',
        name: 'Alice Johnson',
        avatar: 'AJ',
        role: 'Frontend Developer',
        status: 'online',
        points: 1850,
        streak: 12,
        reportStatus: 'submitted'
      },
      {
        id: 'user-3',
        name: 'Bob Smith',
        avatar: 'BS',
        role: 'Backend Developer',
        status: 'away',
        points: 1620,
        streak: 5,
        reportStatus: 'submitted'
      },
      {
        id: 'user-4',
        name: 'Carol Williams',
        avatar: 'CW',
        role: 'Full Stack Developer',
        status: 'online',
        points: 1180,
        streak: 9,
        reportStatus: 'pending'
      },
      {
        id: 'user-5',
        name: 'David Brown',
        avatar: 'DB',
        role: 'DevOps Engineer',
        status: 'offline',
        points: 1050,
        streak: 3,
        reportStatus: 'missing'
      }
    ];
  }

  /**
   * Mock API: Fetch alerts
   */
  async fetchAlerts() {
    await this.delay(400);

    return [
      {
        id: 'alert-1',
        type: 'warning',
        icon: '⚠️',
        title: 'Missing Reports',
        description: '3 team members have not submitted their daily reports yet.',
        actions: [
          { label: 'Send Reminder', action: 'sendReminder' }
        ]
      },
      {
        id: 'alert-2',
        type: 'info',
        icon: 'ℹ️',
        title: 'Overdue Approval',
        description: '1 report from yesterday requires your review.',
        actions: [
          { label: 'Review Now', action: 'reviewOverdue' }
        ]
      }
    ];
  }

  /**
   * Mock API: Fetch recognitions
   */
  async fetchRecognitions() {
    await this.delay(500);

    return [
      {
        id: 'rec-1',
        from: 'John Doe',
        to: 'Alice Johnson',
        message: 'Helped debug OAuth flow and provided excellent code review feedback.',
        time: '2 hours ago'
      },
      {
        id: 'rec-2',
        from: 'Bob Smith',
        to: 'Carol Williams',
        message: 'Assisted with Redis configuration and shared best practices.',
        time: '5 hours ago'
      },
      {
        id: 'rec-3',
        from: 'Alice Johnson',
        to: 'David Brown',
        message: 'Great work on CI/CD pipeline improvements!',
        time: 'Yesterday'
      }
    ];
  }

  /**
   * Render alerts panel
   */
  renderAlerts() {
    if (!this.elements.alertPanel) return;

    if (this.state.alerts.length === 0) {
      this.elements.alertPanel.innerHTML = '';
      this.elements.alertPanel.style.display = 'none';
      return;
    }

    this.elements.alertPanel.style.display = 'block';

    const alertsHtml = this.state.alerts.map(alert => `
      <div class="alert-item alert-item--${alert.type}">
        <span class="alert-item__icon">${alert.icon}</span>
        <div class="alert-item__content">
          <h3 class="alert-item__title">${alert.title}</h3>
          <p class="alert-item__description">${alert.description}</p>
          ${alert.actions ? `
            <div class="alert-item__actions">
              ${alert.actions.map(action => `
                <button class="btn btn-sm btn-primary" data-action="${action.action}">
                  ${action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <button class="alert-item__close" data-alert-id="${alert.id}" aria-label="Close alert">
          &times;
        </button>
      </div>
    `).join('');

    this.elements.alertPanel.innerHTML = alertsHtml;

    // Add event listeners for alert actions
    this.elements.alertPanel.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleAlertAction(e.target.dataset.action);
      });
    });

    // Add event listeners for close buttons
    this.elements.alertPanel.querySelectorAll('.alert-item__close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.dismissAlert(e.target.dataset.alertId);
      });
    });
  }

  /**
   * Render pending approvals
   */
  renderApprovals() {
    if (!this.elements.approvalQueue) return;

    // Filter approvals based on current filter
    let filteredApprovals = this.state.pendingApprovals;

    if (this.state.currentFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filteredApprovals = filteredApprovals.filter(a => a.date === today);
    } else if (this.state.currentFilter === 'overdue') {
      filteredApprovals = filteredApprovals.filter(a => a.isOverdue);
    }

    if (filteredApprovals.length === 0) {
      this.elements.approvalQueue.innerHTML = `
        <div class="approval-empty">
          <div class="approval-empty-icon">✅</div>
          <p>No pending approvals</p>
        </div>
      `;
      return;
    }

    const approvalsHtml = filteredApprovals.map(approval => `
      <div class="approval-card" data-report-id="${approval.id}">
        <div class="approval-card__header">
          <div class="approval-card__user">
            <div class="approval-card__avatar">${approval.userAvatar}</div>
            <div class="approval-card__user-info">
              <h3 class="approval-card__name">${approval.userName}</h3>
              <div class="approval-card__meta">
                <span>📅 ${approval.date}</span>
                <span>•</span>
                <span>🕒 ${approval.submittedAt.split(' ')[1]}</span>
              </div>
            </div>
          </div>
          <span class="approval-card__badge approval-card__badge--${approval.isOverdue ? 'overdue' : 'pending'}">
            ${approval.isOverdue ? 'Overdue' : 'Pending'}
          </span>
        </div>

        <div class="approval-card__content">
          <div class="approval-card__field">
            <div class="approval-card__field-label">Work Completed</div>
            <div class="approval-card__field-value">${approval.workCompleted}</div>
          </div>

          <div class="approval-card__field">
            <div class="approval-card__field-label">Events (${approval.events.length})</div>
            <div class="approval-card__field-value">
              ${approval.events.map(e => `${e.title} (+${e.points} pts)`).join(' • ')}
            </div>
          </div>
        </div>

        <div class="approval-card__actions">
          <button class="btn btn-sm btn-ghost" data-action="view" data-report-id="${approval.id}">
            View Full Report
          </button>
          <button class="btn btn-sm btn-error" data-action="reject" data-report-id="${approval.id}">
            Reject
          </button>
          <button class="btn btn-sm btn-success" data-action="approve" data-report-id="${approval.id}">
            Approve
          </button>
        </div>
      </div>
    `).join('');

    this.elements.approvalQueue.innerHTML = approvalsHtml;

    // Add event listeners for approval actions
    this.elements.approvalQueue.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const reportId = e.target.dataset.reportId;
        this.handleApprovalAction(action, reportId);
      });
    });
  }

  /**
   * Render team members grid
   */
  renderTeamMembers() {
    if (!this.elements.teamMembersGrid) return;

    const membersHtml = this.state.teamMembers.slice(0, 5).map(member => `
      <div class="team-member-card-compact" data-user-id="${member.id}">
        <div class="team-member-card-compact__avatar-wrapper">
          <div class="team-member-card-compact__avatar">${member.avatar}</div>
          <span class="team-member-card-compact__status team-member-card-compact__status--${member.status}"></span>
        </div>
        <div class="team-member-card-compact__info">
          <h3 class="team-member-card-compact__name">${member.name}</h3>
          <p class="team-member-card-compact__role">${member.role}</p>
        </div>
        <div class="team-member-card-compact__stats">
          <div class="team-member-card-compact__stat">
            <div class="team-member-card-compact__stat-value">${member.points}</div>
            <div class="team-member-card-compact__stat-label">pts</div>
          </div>
          <div class="team-member-card-compact__stat">
            <div class="team-member-card-compact__stat-value">${member.streak}</div>
            <div class="team-member-card-compact__stat-label">streak</div>
          </div>
        </div>
      </div>
    `).join('');

    this.elements.teamMembersGrid.innerHTML = membersHtml;
  }

  /**
   * Render recognition wall
   */
  renderRecognitions() {
    if (!this.elements.recognitionWall) return;

    if (this.state.recognitions.length === 0) {
      this.elements.recognitionWall.innerHTML = `
        <div class="recognition-empty">
          <p>No recent recognitions</p>
        </div>
      `;
      return;
    }

    const recognitionsHtml = this.state.recognitions.map(rec => `
      <div class="recognition-item">
        <div class="recognition-item__header">
          <span class="recognition-item__icon">🎉</span>
          <span class="recognition-item__from">${rec.from}</span>
        </div>
        <div class="recognition-item__to">recognized ${rec.to}</div>
        <div class="recognition-item__message">${rec.message}</div>
        <div class="recognition-item__time">${rec.time}</div>
      </div>
    `).join('');

    this.elements.recognitionWall.innerHTML = recognitionsHtml;
  }

  /**
   * Initialize performance charts
   */
  initializeCharts() {
    if (!this.elements.performanceCanvas) return;

    const ctx = this.elements.performanceCanvas.getContext('2d');

    this.state.performanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Team Points',
          data: [1200, 1350, 1280, 1450, 1520, 1380, 1600],
          borderColor: 'rgb(33, 150, 243)',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  /**
   * Handle filter change
   */
  handleFilterChange(filter) {
    this.state.currentFilter = filter;

    // Update active filter button
    this.elements.filterBtns.forEach(btn => {
      if (btn.dataset.filter === filter) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Re-render approvals
    this.renderApprovals();
  }

  /**
   * Handle chart tab change
   */
  handleChartChange(chart) {
    this.state.currentChart = chart;

    // Update active chart tab
    this.elements.chartTabs.forEach(tab => {
      if (tab.dataset.chart === chart) {
        tab.classList.add('is-active');
      } else {
        tab.classList.remove('is-active');
      }
    });

    // Update chart data
    this.updateChart();
  }

  /**
   * Update chart with new data
   */
  updateChart() {
    if (!this.state.performanceChart) return;

    // Mock different data based on chart type
    let data, label;

    switch (this.state.currentChart) {
      case 'activity':
        data = [45, 52, 48, 58, 62, 55, 68];
        label = 'Activities';
        break;
      case 'quality':
        data = [85, 88, 87, 92, 90, 89, 94];
        label = 'Quality Score';
        break;
      default:
        data = [1200, 1350, 1280, 1450, 1520, 1380, 1600];
        label = 'Team Points';
    }

    this.state.performanceChart.data.datasets[0].data = data;
    this.state.performanceChart.data.datasets[0].label = label;
    this.state.performanceChart.update();
  }

  /**
   * Handle approval action
   */
  handleApprovalAction(action, reportId) {
    const report = this.state.pendingApprovals.find(r => r.id === reportId);
    if (!report) return;

    this.state.selectedReport = report;

    switch (action) {
      case 'view':
        this.viewReportDetails(report);
        break;
      case 'approve':
        this.approveReport();
        break;
      case 'reject':
        this.confirmRejectReport();
        break;
    }
  }

  /**
   * View full report details
   */
  viewReportDetails(report) {
    if (!this.elements.reportReviewContent) return;

    const eventsHtml = report.events.map(event => `
      <div class="review-event-item">
        <div class="review-event-item__icon">⚡</div>
        <div class="review-event-item__content">
          <h4 class="review-event-item__title">${event.title}</h4>
        </div>
        <span class="review-event-item__points">+${event.points} pts</span>
      </div>
    `).join('');

    const content = `
      <div class="review-field">
        <div class="review-field__label">Submitted by</div>
        <div class="review-field__value">${report.userName} • ${report.submittedAt}</div>
      </div>

      <div class="review-field">
        <div class="review-field__label">Work Completed</div>
        <div class="review-field__value">${report.workCompleted}</div>
      </div>

      <div class="review-field">
        <div class="review-field__label">Incidents Encountered</div>
        <div class="review-field__value">${report.incidents}</div>
      </div>

      <div class="review-field">
        <div class="review-field__label">Tomorrow's Priorities</div>
        <div class="review-field__value">${report.priorities}</div>
      </div>

      ${report.helpNeeded ? `
        <div class="review-field">
          <div class="review-field__label">Help Needed</div>
          <div class="review-field__value">${report.helpNeeded}</div>
        </div>
      ` : ''}

      ${report.recognition ? `
        <div class="review-field">
          <div class="review-field__label">Team Recognition</div>
          <div class="review-field__value">
            Recognized ${report.recognition.name} - ${report.recognition.reason}
          </div>
        </div>
      ` : ''}

      <div class="review-field">
        <div class="review-field__label">Events (${report.events.length})</div>
        <div class="review-field__events">
          ${eventsHtml}
        </div>
      </div>
    `;

    this.elements.reportReviewContent.innerHTML = content;

    // Open modal
    const modalInstance = new Modal(this.elements.reviewReportModal);
    modalInstance.open();
  }

  /**
   * Approve report
   */
  async approveReport() {
    if (!this.state.selectedReport) return;

    try {
      // Simulate API call
      await this.delay(1000);

      // Remove from pending approvals
      this.state.pendingApprovals = this.state.pendingApprovals.filter(
        r => r.id !== this.state.selectedReport.id
      );

      // Update stats
      this.state.teamStats.pendingApprovals = this.state.pendingApprovals.length;
      if (this.elements.pendingApprovalsStat) {
        this.elements.pendingApprovalsStat.textContent = this.state.teamStats.pendingApprovals;
      }

      // Re-render approvals
      this.renderApprovals();

      // Close modal
      const modalInstance = Modal.getInstance(this.elements.reviewReportModal);
      if (modalInstance) {
        modalInstance.close();
      }

      // Show success message
      this.showToast(
        `Report from ${this.state.selectedReport.userName} approved successfully!`,
        'success'
      );

      this.state.selectedReport = null;

    } catch (error) {
      console.error('Error approving report:', error);
      this.showToast('Failed to approve report', 'error');
    }
  }

  /**
   * Confirm reject report
   */
  confirmRejectReport() {
    if (!confirm('Are you sure you want to reject this report? The user will be notified.')) {
      return;
    }
    this.rejectReport();
  }

  /**
   * Reject report
   */
  async rejectReport() {
    if (!this.state.selectedReport) return;

    try {
      // Simulate API call
      await this.delay(1000);

      // Remove from pending approvals
      this.state.pendingApprovals = this.state.pendingApprovals.filter(
        r => r.id !== this.state.selectedReport.id
      );

      // Update stats
      this.state.teamStats.pendingApprovals = this.state.pendingApprovals.length;
      if (this.elements.pendingApprovalsStat) {
        this.elements.pendingApprovalsStat.textContent = this.state.teamStats.pendingApprovals;
      }

      // Re-render approvals
      this.renderApprovals();

      // Close modal
      const modalInstance = Modal.getInstance(this.elements.reviewReportModal);
      if (modalInstance) {
        modalInstance.close();
      }

      // Show success message
      this.showToast(
        `Report from ${this.state.selectedReport.userName} rejected`,
        'warning'
      );

      this.state.selectedReport = null;

    } catch (error) {
      console.error('Error rejecting report:', error);
      this.showToast('Failed to reject report', 'error');
    }
  }

  /**
   * Open request changes modal
   */
  openRequestChangesModal() {
    // Close review modal
    const reviewModalInstance = Modal.getInstance(this.elements.reviewReportModal);
    if (reviewModalInstance) {
      reviewModalInstance.close();
    }

    // Open request changes modal
    const changesModalInstance = new Modal(this.elements.requestChangesModal);
    changesModalInstance.open();
  }

  /**
   * Submit request for changes
   */
  async submitRequestChanges() {
    if (!this.state.selectedReport) return;

    const formData = new FormData(this.elements.requestChangesForm);
    const reason = formData.get('changeReason');

    if (!reason || reason.length < 20) {
      this.showToast('Please provide a detailed reason (min 20 characters)', 'warning');
      return;
    }

    try {
      // Simulate API call
      await this.delay(1000);

      // Update report status
      const report = this.state.pendingApprovals.find(
        r => r.id === this.state.selectedReport.id
      );
      if (report) {
        report.status = 'changes_requested';
      }

      // Close modal
      const modalInstance = Modal.getInstance(this.elements.requestChangesModal);
      if (modalInstance) {
        modalInstance.close();
      }

      // Reset form
      this.elements.requestChangesForm.reset();

      // Show success message
      this.showToast(
        `Change request sent to ${this.state.selectedReport.userName}`,
        'success'
      );

      this.state.selectedReport = null;

    } catch (error) {
      console.error('Error requesting changes:', error);
      this.showToast('Failed to request changes', 'error');
    }
  }

  /**
   * Handle bulk approve
   */
  async handleBulkApprove() {
    const filteredApprovals = this.state.pendingApprovals.filter(a => {
      if (this.state.currentFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return a.date === today;
      }
      return true;
    });

    if (filteredApprovals.length === 0) {
      this.showToast('No reports to approve', 'info');
      return;
    }

    if (!confirm(`Are you sure you want to approve ${filteredApprovals.length} reports?`)) {
      return;
    }

    try {
      // Simulate API call
      await this.delay(1500);

      // Remove approved reports
      this.state.pendingApprovals = this.state.pendingApprovals.filter(
        r => !filteredApprovals.includes(r)
      );

      // Update stats
      this.state.teamStats.pendingApprovals = this.state.pendingApprovals.length;
      if (this.elements.pendingApprovalsStat) {
        this.elements.pendingApprovalsStat.textContent = this.state.teamStats.pendingApprovals;
      }

      // Re-render approvals
      this.renderApprovals();

      // Show success message
      this.showToast(
        `${filteredApprovals.length} reports approved successfully!`,
        'success'
      );

    } catch (error) {
      console.error('Error bulk approving:', error);
      this.showToast('Failed to approve reports', 'error');
    }
  }

  /**
   * Handle alert action
   */
  handleAlertAction(action) {
    switch (action) {
      case 'sendReminder':
        this.sendReminder();
        break;
      case 'reviewOverdue':
        this.handleFilterChange('overdue');
        break;
    }
  }

  /**
   * Dismiss alert
   */
  dismissAlert(alertId) {
    this.state.alerts = this.state.alerts.filter(a => a.id !== alertId);
    this.renderAlerts();
  }

  /**
   * Send reminder to team
   */
  async sendReminder() {
    try {
      await this.delay(800);
      this.showToast('Reminder sent to all team members', 'success');
    } catch (error) {
      this.showToast('Failed to send reminder', 'error');
    }
  }

  /**
   * Schedule team meeting
   */
  scheduleMeeting() {
    this.showToast('Meeting scheduler coming soon', 'info');
  }

  /**
   * Recognize team
   */
  recognizeTeam() {
    this.showToast('Team recognition feature coming soon', 'info');
  }

  /**
   * Export team report
   */
  exportReport() {
    this.showToast('Exporting team report...', 'info');
  }

  /**
   * Refresh data
   */
  async refreshData() {
    try {
      const [approvals, alerts] = await Promise.all([
        this.fetchPendingApprovals(),
        this.fetchAlerts()
      ]);

      this.state.pendingApprovals = approvals;
      this.state.alerts = alerts;

      this.renderAlerts();
      this.renderApprovals();

    } catch (error) {
      console.error('Error refreshing data:', error);
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

    // Destroy chart
    if (this.state.performanceChart) {
      this.state.performanceChart.destroy();
    }

    console.log('Team Lead Dashboard destroyed');
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.TeamLeadDashboard = TeamLeadDashboard;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TeamLeadDashboard;
}
