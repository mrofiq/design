/**
 * Developer Report Dashboard - Admin Dashboard Page
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * This module handles the admin dashboard page including:
 * - User management (CRUD operations)
 * - User invite by email
 * - Webhook configuration management
 * - Point rules editor
 * - System health monitoring
 * - Analytics overview
 * - System logs viewer with filtering
 * - Role-based access control
 */

class AdminDashboard {
  constructor() {
    // Configuration
    this.config = {
      userRole: 'admin', // Should be fetched from auth service
      usersPerPage: 10,
      logsPerPage: 50,
      refreshInterval: 60000, // 1 minute
      maxLogEntries: 1000
    };

    // State
    this.state = {
      currentUser: {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@company.com',
        role: 'admin',
        avatar: 'AD'
      },
      users: [],
      webhooks: [],
      pointRules: [],
      logs: [],
      systemMetrics: {},
      analytics: {},
      currentTab: 'users',
      filters: {
        users: { role: '', status: '', search: '' },
        logs: { level: '', service: '', search: '' }
      },
      pagination: {
        users: { page: 1, total: 0 },
        logs: { page: 1, total: 0 }
      },
      refreshInterval: null
    };

    // DOM Elements
    this.elements = {
      // Header Actions
      refreshDataBtn: document.getElementById('refreshDataBtn'),
      inviteUserBtn: document.getElementById('inviteUserBtn'),

      // Metrics
      uptimeMetric: document.querySelector('[data-metric="uptime"]'),
      activeUsersMetric: document.querySelector('[data-metric="activeUsers"]'),
      webhookEventsMetric: document.querySelector('[data-metric="webhookEvents"]'),
      responseTimeMetric: document.querySelector('[data-metric="responseTime"]'),

      // Tabs
      usersTab: document.getElementById('usersTab'),
      webhooksTab: document.getElementById('webhooksTab'),
      pointsTab: document.getElementById('pointsTab'),
      analyticsTab: document.getElementById('analyticsTab'),
      logsTab: document.getElementById('logsTab'),

      // Tab Panels
      usersPanel: document.getElementById('usersPanel'),
      webhooksPanel: document.getElementById('webhooksPanel'),
      pointsPanel: document.getElementById('pointsPanel'),
      analyticsPanel: document.getElementById('analyticsPanel'),
      logsPanel: document.getElementById('logsPanel'),

      // Users Tab
      userSearchInput: document.getElementById('userSearchInput'),
      userRoleFilter: document.getElementById('userRoleFilter'),
      userStatusFilter: document.getElementById('userStatusFilter'),
      usersTableBody: document.getElementById('usersTableBody'),
      usersShowing: document.getElementById('usersShowing'),
      usersTotal: document.getElementById('usersTotal'),
      usersPagination: document.getElementById('usersPagination'),

      // Webhooks Tab
      addWebhookBtn: document.getElementById('addWebhookBtn'),
      webhooksGrid: document.getElementById('webhooksGrid'),

      // Point Rules Tab
      addPointRuleBtn: document.getElementById('addPointRuleBtn'),
      pointRulesContainer: document.getElementById('pointRulesContainer'),

      // Analytics Tab
      reportSubmissionChart: document.getElementById('reportSubmissionChart'),
      topContributorsList: document.getElementById('topContributorsList'),
      activityTrendsChart: document.getElementById('activityTrendsChart'),

      // Logs Tab
      logsSearchInput: document.getElementById('logsSearchInput'),
      logsLevelFilter: document.getElementById('logsLevelFilter'),
      logsServiceFilter: document.getElementById('logsServiceFilter'),
      exportLogsBtn: document.getElementById('exportLogsBtn'),
      logsContainer: document.getElementById('logsContainer'),
      logsShowing: document.getElementById('logsShowing'),
      logsTotal: document.getElementById('logsTotal'),
      loadMoreLogsBtn: document.getElementById('loadMoreLogsBtn'),

      // Modals
      inviteUserModal: document.getElementById('inviteUserModal'),
      inviteUserForm: document.getElementById('inviteUserForm'),
      sendInviteBtn: document.getElementById('sendInviteBtn'),

      editUserModal: document.getElementById('editUserModal'),
      editUserForm: document.getElementById('editUserForm'),
      updateUserBtn: document.getElementById('updateUserBtn'),

      addWebhookModal: document.getElementById('addWebhookModal'),
      addWebhookForm: document.getElementById('addWebhookForm'),
      saveWebhookBtn: document.getElementById('saveWebhookBtn'),

      addPointRuleModal: document.getElementById('addPointRuleModal'),
      addPointRuleForm: document.getElementById('addPointRuleForm'),
      savePointRuleBtn: document.getElementById('savePointRuleBtn'),

      // Toast Container
      toastContainer: document.getElementById('toastContainer')
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize the admin dashboard
   */
  async init() {
    console.log('Initializing Admin Dashboard...');

    // Check admin role
    if (!this.checkAdminAccess()) {
      this.showAccessDenied();
      return;
    }

    // Set up event listeners
    this.setupEventListeners();

    // Load initial data
    await this.loadDashboardData();

    // Set up auto-refresh
    this.setupAutoRefresh();

    console.log('Admin Dashboard initialized successfully');
  }

  /**
   * Check if user has admin access
   */
  checkAdminAccess() {
    // In production, this should check against auth service
    return this.config.userRole === 'admin';
  }

  /**
   * Show access denied message
   */
  showAccessDenied() {
    const main = document.querySelector('.admin-container');
    if (main) {
      main.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔒</div>
          <h2 class="empty-state__title">Access Denied</h2>
          <p class="empty-state__description">
            You do not have permission to access the admin dashboard.
          </p>
          <button class="btn btn-primary" onclick="window.location.href='/pages/developer-dashboard.html'">
            Go to Dashboard
          </button>
        </div>
      `;
    }
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Header Actions
    if (this.elements.refreshDataBtn) {
      this.elements.refreshDataBtn.addEventListener('click', () => this.refreshAllData());
    }

    if (this.elements.inviteUserBtn) {
      this.elements.inviteUserBtn.addEventListener('click', () => this.openInviteUserModal());
    }

    // Tab Navigation
    [
      this.elements.usersTab,
      this.elements.webhooksTab,
      this.elements.pointsTab,
      this.elements.analyticsTab,
      this.elements.logsTab
    ].forEach(tab => {
      if (tab) {
        tab.addEventListener('click', (e) => this.switchTab(e.target));
      }
    });

    // Users Tab
    if (this.elements.userSearchInput) {
      this.elements.userSearchInput.addEventListener('input',
        this.debounce(() => this.filterUsers(), 300)
      );
    }

    if (this.elements.userRoleFilter) {
      this.elements.userRoleFilter.addEventListener('change', () => this.filterUsers());
    }

    if (this.elements.userStatusFilter) {
      this.elements.userStatusFilter.addEventListener('change', () => this.filterUsers());
    }

    // Webhooks Tab
    if (this.elements.addWebhookBtn) {
      this.elements.addWebhookBtn.addEventListener('click', () => this.openAddWebhookModal());
    }

    // Point Rules Tab
    if (this.elements.addPointRuleBtn) {
      this.elements.addPointRuleBtn.addEventListener('click', () => this.openAddPointRuleModal());
    }

    // Logs Tab
    if (this.elements.logsSearchInput) {
      this.elements.logsSearchInput.addEventListener('input',
        this.debounce(() => this.filterLogs(), 300)
      );
    }

    if (this.elements.logsLevelFilter) {
      this.elements.logsLevelFilter.addEventListener('change', () => this.filterLogs());
    }

    if (this.elements.logsServiceFilter) {
      this.elements.logsServiceFilter.addEventListener('change', () => this.filterLogs());
    }

    if (this.elements.exportLogsBtn) {
      this.elements.exportLogsBtn.addEventListener('click', () => this.exportLogs());
    }

    if (this.elements.loadMoreLogsBtn) {
      this.elements.loadMoreLogsBtn.addEventListener('click', () => this.loadMoreLogs());
    }

    // Form Submissions
    if (this.elements.inviteUserForm) {
      this.elements.inviteUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleInviteUser(new FormData(this.elements.inviteUserForm));
      });
    }

    if (this.elements.editUserForm) {
      this.elements.editUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUpdateUser(new FormData(this.elements.editUserForm));
      });
    }

    if (this.elements.addWebhookForm) {
      this.elements.addWebhookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddWebhook(new FormData(this.elements.addWebhookForm));
      });
    }

    if (this.elements.addPointRuleForm) {
      this.elements.addPointRuleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddPointRule(new FormData(this.elements.addPointRuleForm));
      });
    }
  }

  /**
   * Load all dashboard data
   */
  async loadDashboardData() {
    try {
      await Promise.all([
        this.loadSystemMetrics(),
        this.loadUsers(),
        this.loadWebhooks(),
        this.loadPointRules(),
        this.loadLogs()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.showToast('Failed to load dashboard data', 'error');
    }
  }

  /**
   * Load system health metrics
   */
  async loadSystemMetrics() {
    await this.delay(500);

    this.state.systemMetrics = {
      uptime: '99.9%',
      activeUsers: 248,
      webhookEvents: 1234,
      responseTime: '85ms'
    };

    // Update UI
    if (this.elements.uptimeMetric) {
      this.elements.uptimeMetric.textContent = this.state.systemMetrics.uptime;
    }
    if (this.elements.activeUsersMetric) {
      this.elements.activeUsersMetric.textContent = this.state.systemMetrics.activeUsers;
    }
    if (this.elements.webhookEventsMetric) {
      this.elements.webhookEventsMetric.textContent = this.state.systemMetrics.webhookEvents.toLocaleString();
    }
    if (this.elements.responseTimeMetric) {
      this.elements.responseTimeMetric.textContent = this.state.systemMetrics.responseTime;
    }
  }

  /**
   * Mock API: Fetch users
   */
  async loadUsers() {
    await this.delay(800);

    // Mock user data
    this.state.users = [
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'developer',
        team: 'Frontend Team',
        status: 'active',
        points: 1250,
        lastLogin: '2 hours ago'
      },
      {
        id: 'user-2',
        name: 'Alice Johnson',
        email: 'alice.johnson@company.com',
        role: 'team_lead',
        team: 'Backend Team',
        status: 'active',
        points: 1850,
        lastLogin: '30 minutes ago'
      },
      {
        id: 'user-3',
        name: 'Bob Smith',
        email: 'bob.smith@company.com',
        role: 'developer',
        team: 'Backend Team',
        status: 'active',
        points: 1620,
        lastLogin: '1 hour ago'
      },
      {
        id: 'user-4',
        name: 'Carol Williams',
        email: 'carol.williams@company.com',
        role: 'developer',
        team: 'Frontend Team',
        status: 'active',
        points: 1180,
        lastLogin: '3 hours ago'
      },
      {
        id: 'user-5',
        name: 'David Brown',
        email: 'david.brown@company.com',
        role: 'admin',
        team: 'DevOps Team',
        status: 'active',
        points: 1050,
        lastLogin: '5 hours ago'
      },
      {
        id: 'user-6',
        name: 'Emma Davis',
        email: 'emma.davis@company.com',
        role: 'developer',
        team: 'QA Team',
        status: 'invited',
        points: 0,
        lastLogin: 'Never'
      },
      {
        id: 'user-7',
        name: 'Frank Miller',
        email: 'frank.miller@company.com',
        role: 'developer',
        team: 'Frontend Team',
        status: 'inactive',
        points: 850,
        lastLogin: '2 weeks ago'
      }
    ];

    this.state.pagination.users.total = this.state.users.length;
    this.renderUsers();
  }

  /**
   * Render users table
   */
  renderUsers() {
    if (!this.elements.usersTableBody) return;

    const filteredUsers = this.getFilteredUsers();
    const paginatedUsers = this.getPaginatedUsers(filteredUsers);

    if (paginatedUsers.length === 0) {
      this.elements.usersTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="table__empty">
            <div class="empty-state">
              <div class="empty-state__icon">👥</div>
              <h3 class="empty-state__title">No users found</h3>
              <p class="empty-state__description">Try adjusting your filters or search criteria</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    const usersHtml = paginatedUsers.map(user => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-avatar">${this.getInitials(user.name)}</div>
            <div class="user-info">
              <div class="user-name">${user.name}</div>
              <div class="user-id">${user.id}</div>
            </div>
          </div>
        </td>
        <td>${user.email}</td>
        <td>
          <span class="role-badge">${this.formatRole(user.role)}</span>
        </td>
        <td>${user.team}</td>
        <td>
          <span class="status-badge status-badge--${user.status}">${this.formatStatus(user.status)}</span>
        </td>
        <td class="cell-numeric">
          <span class="points-value">${user.points.toLocaleString()}</span>
        </td>
        <td>${user.lastLogin}</td>
        <td class="text-right">
          <div class="table__actions">
            <button
              class="table__action-btn"
              title="Edit user"
              onclick="adminDashboard.openEditUserModal('${user.id}')"
              aria-label="Edit ${user.name}"
            >
              <span>✏️</span>
            </button>
            <button
              class="table__action-btn"
              title="Delete user"
              onclick="adminDashboard.deleteUser('${user.id}')"
              aria-label="Delete ${user.name}"
            >
              <span>🗑️</span>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    this.elements.usersTableBody.innerHTML = usersHtml;

    // Update pagination info
    this.updateUsersPaginationInfo(filteredUsers.length);
  }

  /**
   * Get filtered users based on current filters
   */
  getFilteredUsers() {
    let filtered = [...this.state.users];

    // Apply search filter
    if (this.state.filters.users.search) {
      const search = this.state.filters.users.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    // Apply role filter
    if (this.state.filters.users.role) {
      filtered = filtered.filter(user => user.role === this.state.filters.users.role);
    }

    // Apply status filter
    if (this.state.filters.users.status) {
      filtered = filtered.filter(user => user.status === this.state.filters.users.status);
    }

    return filtered;
  }

  /**
   * Get paginated users
   */
  getPaginatedUsers(users) {
    const start = (this.state.pagination.users.page - 1) * this.config.usersPerPage;
    const end = start + this.config.usersPerPage;
    return users.slice(start, end);
  }

  /**
   * Update users pagination info
   */
  updateUsersPaginationInfo(total) {
    const start = (this.state.pagination.users.page - 1) * this.config.usersPerPage + 1;
    const end = Math.min(start + this.config.usersPerPage - 1, total);

    if (this.elements.usersShowing) {
      this.elements.usersShowing.textContent = `${start}-${end}`;
    }
    if (this.elements.usersTotal) {
      this.elements.usersTotal.textContent = total;
    }
  }

  /**
   * Filter users
   */
  filterUsers() {
    this.state.filters.users = {
      search: this.elements.userSearchInput?.value || '',
      role: this.elements.userRoleFilter?.value || '',
      status: this.elements.userStatusFilter?.value || ''
    };

    this.state.pagination.users.page = 1;
    this.renderUsers();
  }

  /**
   * Load webhooks
   */
  async loadWebhooks() {
    await this.delay(600);

    this.state.webhooks = [
      {
        id: 'webhook-1',
        name: 'GitLab Production',
        service: 'gitlab',
        url: 'https://api.example.com/webhooks/gitlab',
        events: ['push', 'merge_request', 'issues'],
        status: 'active',
        eventsToday: 156,
        lastEvent: '2 minutes ago'
      },
      {
        id: 'webhook-2',
        name: 'OpenProject Main',
        service: 'openproject',
        url: 'https://api.example.com/webhooks/openproject',
        events: ['task_completion', 'time_logged', 'comment'],
        status: 'active',
        eventsToday: 89,
        lastEvent: '15 minutes ago'
      },
      {
        id: 'webhook-3',
        name: 'SonarQube Analyzer',
        service: 'sonarqube',
        url: 'https://api.example.com/webhooks/sonarqube',
        events: ['analysis_complete', 'quality_gate'],
        status: 'active',
        eventsToday: 12,
        lastEvent: '1 hour ago'
      }
    ];

    this.renderWebhooks();
  }

  /**
   * Render webhooks grid
   */
  renderWebhooks() {
    if (!this.elements.webhooksGrid) return;

    if (this.state.webhooks.length === 0) {
      this.elements.webhooksGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔗</div>
          <h3 class="empty-state__title">No webhooks configured</h3>
          <p class="empty-state__description">Add your first webhook to start receiving events</p>
        </div>
      `;
      return;
    }

    const webhooksHtml = this.state.webhooks.map(webhook => `
      <div class="webhook-card">
        <div class="webhook-card__header">
          <h3 class="webhook-card__title">${webhook.name}</h3>
          <span class="webhook-card__service">${webhook.service}</span>
        </div>
        <div class="webhook-card__body">
          <div class="webhook-card__url">${webhook.url}</div>
          <div class="webhook-card__events">
            ${webhook.events.map(event => `
              <span class="webhook-card__event-badge">${event}</span>
            `).join('')}
          </div>
          <div class="webhook-card__stats">
            <div class="webhook-card__stat">
              <span class="webhook-card__stat-label">Events Today</span>
              <span class="webhook-card__stat-value">${webhook.eventsToday}</span>
            </div>
            <div class="webhook-card__stat">
              <span class="webhook-card__stat-label">Last Event</span>
              <span class="webhook-card__stat-value">${webhook.lastEvent}</span>
            </div>
          </div>
        </div>
        <div class="webhook-card__footer">
          <div class="webhook-card__status">
            <span class="webhook-card__status-indicator"></span>
            <span>Active</span>
          </div>
          <div style="margin-left: auto; display: flex; gap: var(--spacing-2);">
            <button
              class="btn btn-ghost btn-sm"
              onclick="adminDashboard.editWebhook('${webhook.id}')"
            >
              Edit
            </button>
            <button
              class="btn btn-ghost btn-sm"
              onclick="adminDashboard.testWebhook('${webhook.id}')"
            >
              Test
            </button>
            <button
              class="btn btn-ghost btn-sm"
              onclick="adminDashboard.deleteWebhook('${webhook.id}')"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    `).join('');

    this.elements.webhooksGrid.innerHTML = webhooksHtml;
  }

  /**
   * Load point rules
   */
  async loadPointRules() {
    await this.delay(500);

    this.state.pointRules = [
      {
        id: 'rule-1',
        event: 'commit',
        title: 'Git Commit',
        description: 'Points awarded for each commit pushed to repository',
        points: 2,
        icon: '💾',
        enabled: true
      },
      {
        id: 'rule-2',
        event: 'merge_request',
        title: 'Merge Request',
        description: 'Points for creating and merging pull requests',
        points: 10,
        icon: '🔀',
        enabled: true
      },
      {
        id: 'rule-3',
        event: 'code_review',
        title: 'Code Review',
        description: 'Points for reviewing team members\' code',
        points: 3,
        icon: '👀',
        enabled: true
      },
      {
        id: 'rule-4',
        event: 'quality_gate',
        title: 'Quality Gate Pass',
        description: 'Bonus points for passing SonarQube quality gates',
        points: 15,
        icon: '✓',
        enabled: true
      },
      {
        id: 'rule-5',
        event: 'report_submission',
        title: 'Daily Report',
        description: 'Points for submitting daily report on time',
        points: 10,
        icon: '📝',
        enabled: true
      },
      {
        id: 'rule-6',
        event: 'missed_report',
        title: 'Missed Report',
        description: 'Penalty for missing daily report submission',
        points: -20,
        icon: '⚠️',
        enabled: true
      }
    ];

    this.renderPointRules();
  }

  /**
   * Render point rules
   */
  renderPointRules() {
    if (!this.elements.pointRulesContainer) return;

    if (this.state.pointRules.length === 0) {
      this.elements.pointRulesContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">⚙️</div>
          <h3 class="empty-state__title">No point rules configured</h3>
          <p class="empty-state__description">Add rules to define how points are awarded</p>
        </div>
      `;
      return;
    }

    const rulesHtml = this.state.pointRules.map(rule => `
      <div class="point-rule-item">
        <div class="point-rule-item__handle">⋮⋮</div>
        <div class="point-rule-item__icon">${rule.icon}</div>
        <div class="point-rule-item__content">
          <h4 class="point-rule-item__title">${rule.title}</h4>
          <p class="point-rule-item__description">${rule.description}</p>
        </div>
        <div class="point-rule-item__points ${rule.points < 0 ? 'point-rule-item__points--negative' : ''}">
          ${rule.points > 0 ? '+' : ''}${rule.points}
        </div>
        <div class="point-rule-item__actions">
          <div
            class="point-rule-item__toggle ${rule.enabled ? 'point-rule-item__toggle--active' : ''}"
            onclick="adminDashboard.togglePointRule('${rule.id}')"
            role="switch"
            aria-checked="${rule.enabled}"
            tabindex="0"
          ></div>
          <button
            class="table__action-btn"
            onclick="adminDashboard.editPointRule('${rule.id}')"
            aria-label="Edit ${rule.title}"
          >
            <span>✏️</span>
          </button>
          <button
            class="table__action-btn"
            onclick="adminDashboard.deletePointRule('${rule.id}')"
            aria-label="Delete ${rule.title}"
          >
            <span>🗑️</span>
          </button>
        </div>
      </div>
    `).join('');

    this.elements.pointRulesContainer.innerHTML = rulesHtml;
  }

  /**
   * Load system logs
   */
  async loadLogs() {
    await this.delay(700);

    // Mock log data
    this.state.logs = [
      {
        id: 'log-1',
        timestamp: '14:32:45',
        level: 'info',
        service: 'api',
        message: 'User authentication successful for john.doe@company.com'
      },
      {
        id: 'log-2',
        timestamp: '14:32:12',
        level: 'info',
        service: 'webhook',
        message: 'GitLab webhook received: push event from repository main/frontend'
      },
      {
        id: 'log-3',
        timestamp: '14:31:58',
        level: 'warning',
        service: 'database',
        message: 'Connection pool utilization at 85%, consider scaling'
      },
      {
        id: 'log-4',
        timestamp: '14:31:45',
        level: 'error',
        service: 'webhook',
        message: 'Failed to process webhook: Invalid signature from openproject.company.com'
      },
      {
        id: 'log-5',
        timestamp: '14:31:30',
        level: 'info',
        service: 'api',
        message: 'Report submitted successfully by alice.johnson@company.com'
      },
      {
        id: 'log-6',
        timestamp: '14:30:22',
        level: 'debug',
        service: 'auth',
        message: 'Token refresh executed for session abc123def456'
      },
      {
        id: 'log-7',
        timestamp: '14:29:15',
        level: 'info',
        service: 'webhook',
        message: 'SonarQube analysis completed: Quality gate passed for project backend-api'
      },
      {
        id: 'log-8',
        timestamp: '14:28:45',
        level: 'warning',
        service: 'api',
        message: 'Rate limit threshold reached for IP 192.168.1.100'
      }
    ];

    this.state.pagination.logs.total = this.state.logs.length;
    this.renderLogs();
  }

  /**
   * Render system logs
   */
  renderLogs() {
    if (!this.elements.logsContainer) return;

    const filteredLogs = this.getFilteredLogs();

    if (filteredLogs.length === 0) {
      this.elements.logsContainer.innerHTML = `
        <div style="text-align: center; padding: var(--spacing-12); color: var(--color-gray-500);">
          No log entries found
        </div>
      `;
      return;
    }

    const logsHtml = filteredLogs.map(log => `
      <div class="log-entry">
        <span class="log-entry__time">${log.timestamp}</span>
        <span class="log-entry__level log-entry__level--${log.level}">${log.level.toUpperCase()}</span>
        <span class="log-entry__service">[${log.service}]</span>
        <span class="log-entry__message">${log.message}</span>
      </div>
    `).join('');

    this.elements.logsContainer.innerHTML = logsHtml;

    // Update logs info
    if (this.elements.logsShowing) {
      this.elements.logsShowing.textContent = `1-${filteredLogs.length}`;
    }
    if (this.elements.logsTotal) {
      this.elements.logsTotal.textContent = filteredLogs.length;
    }
  }

  /**
   * Get filtered logs
   */
  getFilteredLogs() {
    let filtered = [...this.state.logs];

    // Apply search filter
    if (this.state.filters.logs.search) {
      const search = this.state.filters.logs.search.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(search)
      );
    }

    // Apply level filter
    if (this.state.filters.logs.level) {
      filtered = filtered.filter(log => log.level === this.state.filters.logs.level);
    }

    // Apply service filter
    if (this.state.filters.logs.service) {
      filtered = filtered.filter(log => log.service === this.state.filters.logs.service);
    }

    return filtered;
  }

  /**
   * Filter logs
   */
  filterLogs() {
    this.state.filters.logs = {
      search: this.elements.logsSearchInput?.value || '',
      level: this.elements.logsLevelFilter?.value || '',
      service: this.elements.logsServiceFilter?.value || ''
    };

    this.renderLogs();
  }

  /**
   * Export logs
   */
  exportLogs() {
    const filteredLogs = this.getFilteredLogs();

    // Convert to CSV format
    const csv = [
      'Timestamp,Level,Service,Message',
      ...filteredLogs.map(log =>
        `${log.timestamp},${log.level},${log.service},"${log.message}"`
      )
    ].join('\n');

    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.showToast('Logs exported successfully', 'success');
  }

  /**
   * Load more logs
   */
  async loadMoreLogs() {
    this.showToast('Loading more logs...', 'info');
    await this.delay(1000);
    this.showToast('No more logs to load', 'info');
  }

  /**
   * Switch between tabs
   */
  switchTab(tabButton) {
    const tabId = tabButton.id.replace('Tab', '');

    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    tabButton.classList.add('active');
    tabButton.setAttribute('aria-selected', 'true');

    // Update tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
      panel.setAttribute('hidden', '');
    });

    const panel = document.getElementById(`${tabId}Panel`);
    if (panel) {
      panel.classList.add('active');
      panel.removeAttribute('hidden');
    }

    this.state.currentTab = tabId;

    // Load data if needed
    if (tabId === 'analytics' && this.elements.topContributorsList) {
      this.renderTopContributors();
    }
  }

  /**
   * Render top contributors
   */
  renderTopContributors() {
    if (!this.elements.topContributorsList) return;

    const topUsers = [...this.state.users]
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);

    const html = topUsers.map((user, index) => `
      <div class="contributor-item">
        <div class="contributor-item__rank">${index + 1}</div>
        <div class="contributor-item__info">
          <h4 class="contributor-item__name">${user.name}</h4>
          <p class="contributor-item__points">${user.points.toLocaleString()} points</p>
        </div>
      </div>
    `).join('');

    this.elements.topContributorsList.innerHTML = html;
  }

  /**
   * Open invite user modal
   */
  openInviteUserModal() {
    if (!this.elements.inviteUserModal) return;

    // Reset form
    if (this.elements.inviteUserForm) {
      this.elements.inviteUserForm.reset();
    }

    const modalInstance = new Modal(this.elements.inviteUserModal);
    modalInstance.open();
  }

  /**
   * Handle invite user
   */
  async handleInviteUser(formData) {
    console.log('Inviting user:', Object.fromEntries(formData));

    try {
      // Show loading
      if (this.elements.sendInviteBtn) {
        this.elements.sendInviteBtn.disabled = true;
        this.elements.sendInviteBtn.textContent = 'Sending...';
      }

      // Simulate API call
      await this.delay(1500);

      // Mock success
      this.showToast('Invitation sent successfully!', 'success');

      // Close modal
      const modalInstance = Modal.getInstance(this.elements.inviteUserModal);
      if (modalInstance) {
        modalInstance.close();
      }

      // Reload users
      await this.loadUsers();

    } catch (error) {
      console.error('Error inviting user:', error);
      this.showToast('Failed to send invitation', 'error');
    } finally {
      if (this.elements.sendInviteBtn) {
        this.elements.sendInviteBtn.disabled = false;
        this.elements.sendInviteBtn.textContent = 'Send Invitation';
      }
    }
  }

  /**
   * Open edit user modal
   */
  openEditUserModal(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user || !this.elements.editUserModal) return;

    // Populate form
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserRole').value = user.role;
    document.getElementById('editUserTeam').value = user.team;
    document.getElementById('editUserStatus').value = user.status;

    const modalInstance = new Modal(this.elements.editUserModal);
    modalInstance.open();
  }

  /**
   * Handle update user
   */
  async handleUpdateUser(formData) {
    console.log('Updating user:', Object.fromEntries(formData));

    try {
      if (this.elements.updateUserBtn) {
        this.elements.updateUserBtn.disabled = true;
        this.elements.updateUserBtn.textContent = 'Updating...';
      }

      await this.delay(1000);

      this.showToast('User updated successfully!', 'success');

      const modalInstance = Modal.getInstance(this.elements.editUserModal);
      if (modalInstance) {
        modalInstance.close();
      }

      await this.loadUsers();

    } catch (error) {
      console.error('Error updating user:', error);
      this.showToast('Failed to update user', 'error');
    } finally {
      if (this.elements.updateUserBtn) {
        this.elements.updateUserBtn.disabled = false;
        this.elements.updateUserBtn.textContent = 'Update User';
      }
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return;

    if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
      return;
    }

    try {
      await this.delay(800);
      this.showToast('User deleted successfully', 'success');
      await this.loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      this.showToast('Failed to delete user', 'error');
    }
  }

  /**
   * Open add webhook modal
   */
  openAddWebhookModal() {
    if (!this.elements.addWebhookModal) return;

    if (this.elements.addWebhookForm) {
      this.elements.addWebhookForm.reset();
    }

    const modalInstance = new Modal(this.elements.addWebhookModal);
    modalInstance.open();
  }

  /**
   * Handle add webhook
   */
  async handleAddWebhook(formData) {
    console.log('Adding webhook:', Object.fromEntries(formData));

    try {
      if (this.elements.saveWebhookBtn) {
        this.elements.saveWebhookBtn.disabled = true;
        this.elements.saveWebhookBtn.textContent = 'Saving...';
      }

      await this.delay(1000);

      this.showToast('Webhook added successfully!', 'success');

      const modalInstance = Modal.getInstance(this.elements.addWebhookModal);
      if (modalInstance) {
        modalInstance.close();
      }

      await this.loadWebhooks();

    } catch (error) {
      console.error('Error adding webhook:', error);
      this.showToast('Failed to add webhook', 'error');
    } finally {
      if (this.elements.saveWebhookBtn) {
        this.elements.saveWebhookBtn.disabled = false;
        this.elements.saveWebhookBtn.textContent = 'Save Webhook';
      }
    }
  }

  /**
   * Edit webhook
   */
  editWebhook(webhookId) {
    console.log('Edit webhook:', webhookId);
    this.showToast('Edit webhook feature coming soon', 'info');
  }

  /**
   * Test webhook
   */
  async testWebhook(webhookId) {
    console.log('Testing webhook:', webhookId);
    this.showToast('Testing webhook...', 'info');
    await this.delay(1500);
    this.showToast('Webhook test successful!', 'success');
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId) {
    if (!confirm('Are you sure you want to delete this webhook?')) {
      return;
    }

    try {
      await this.delay(800);
      this.showToast('Webhook deleted successfully', 'success');
      await this.loadWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      this.showToast('Failed to delete webhook', 'error');
    }
  }

  /**
   * Open add point rule modal
   */
  openAddPointRuleModal() {
    if (!this.elements.addPointRuleModal) return;

    if (this.elements.addPointRuleForm) {
      this.elements.addPointRuleForm.reset();
    }

    const modalInstance = new Modal(this.elements.addPointRuleModal);
    modalInstance.open();
  }

  /**
   * Handle add point rule
   */
  async handleAddPointRule(formData) {
    console.log('Adding point rule:', Object.fromEntries(formData));

    try {
      if (this.elements.savePointRuleBtn) {
        this.elements.savePointRuleBtn.disabled = true;
        this.elements.savePointRuleBtn.textContent = 'Saving...';
      }

      await this.delay(1000);

      this.showToast('Point rule added successfully!', 'success');

      const modalInstance = Modal.getInstance(this.elements.addPointRuleModal);
      if (modalInstance) {
        modalInstance.close();
      }

      await this.loadPointRules();

    } catch (error) {
      console.error('Error adding point rule:', error);
      this.showToast('Failed to add point rule', 'error');
    } finally {
      if (this.elements.savePointRuleBtn) {
        this.elements.savePointRuleBtn.disabled = false;
        this.elements.savePointRuleBtn.textContent = 'Save Rule';
      }
    }
  }

  /**
   * Toggle point rule
   */
  togglePointRule(ruleId) {
    const rule = this.state.pointRules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = !rule.enabled;
      this.renderPointRules();
      this.showToast(
        `Rule ${rule.enabled ? 'enabled' : 'disabled'}`,
        rule.enabled ? 'success' : 'info'
      );
    }
  }

  /**
   * Edit point rule
   */
  editPointRule(ruleId) {
    console.log('Edit point rule:', ruleId);
    this.showToast('Edit point rule feature coming soon', 'info');
  }

  /**
   * Delete point rule
   */
  async deletePointRule(ruleId) {
    if (!confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    try {
      await this.delay(800);
      this.showToast('Point rule deleted successfully', 'success');
      await this.loadPointRules();
    } catch (error) {
      console.error('Error deleting point rule:', error);
      this.showToast('Failed to delete point rule', 'error');
    }
  }

  /**
   * Refresh all data
   */
  async refreshAllData() {
    this.showToast('Refreshing data...', 'info');
    await this.loadDashboardData();
    this.showToast('Data refreshed successfully', 'success');
  }

  /**
   * Set up auto-refresh
   */
  setupAutoRefresh() {
    this.state.refreshInterval = setInterval(() => {
      this.loadSystemMetrics();
    }, this.config.refreshInterval);
  }

  /**
   * Utility functions
   */

  getInitials(name) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatRole(role) {
    const roles = {
      'admin': 'Admin',
      'team_lead': 'Team Lead',
      'developer': 'Developer'
    };
    return roles[role] || role;
  }

  formatStatus(status) {
    const statuses = {
      'active': 'Active',
      'invited': 'Invited',
      'inactive': 'Inactive'
    };
    return statuses[status] || status;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);

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
   * Cleanup and destroy
   */
  destroy() {
    if (this.state.refreshInterval) {
      clearInterval(this.state.refreshInterval);
    }
    console.log('Admin Dashboard destroyed');
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.AdminDashboard = AdminDashboard;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdminDashboard;
}
