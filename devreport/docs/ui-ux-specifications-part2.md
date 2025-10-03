# Developer Report Dashboard - UI/UX Specifications (Part 2)
## Continued from Part 1

---

### 4.3 Team Lead Dashboard

#### Layout Structure
```
Desktop Layout:
- Top: Team Overview Cards (4 columns)
- Main: 3 columns
  - Left (5 cols): Pending Approvals Queue
  - Center (4 cols): Team Performance Charts
  - Right (3 cols): Alerts & Quick Actions
```

#### HTML Structure
```html
<div class="dashboard-container">
  <!-- Page Header -->
  <div class="dashboard-header">
    <div>
      <h1 class="dashboard-title">Team Dashboard</h1>
      <p class="dashboard-subtitle">
        Engineering Team Alpha - 12 active members
      </p>
    </div>
    <div class="dashboard-actions">
      <div class="filter-group">
        <button class="btn-ghost">
          <svg class="icon">...</svg>
          <span>This Week</span>
          <svg class="icon-chevron">...</svg>
        </button>
      </div>
      <button class="btn-secondary">
        <svg class="icon">...</svg>
        <span>Export Report</span>
      </button>
      <button class="btn-primary">
        <svg class="icon">...</svg>
        <span>Team Settings</span>
      </button>
    </div>
  </div>

  <!-- Team Overview Stats -->
  <div class="stats-grid stats-grid-4">
    <!-- Team Average Score -->
    <div class="stat-card stat-card-gradient">
      <div class="stat-header">
        <span class="stat-label">Team Average</span>
        <button class="btn-icon-sm btn-ghost">
          <svg class="icon">...</svg>
        </button>
      </div>
      <div class="stat-value">1,284 pts</div>
      <div class="stat-comparison">
        <div class="comparison-item">
          <span class="comparison-label">Target</span>
          <span class="comparison-value">1,200</span>
        </div>
        <div class="comparison-divider"></div>
        <div class="comparison-item">
          <span class="comparison-label">Change</span>
          <span class="comparison-value is-positive">+6.8%</span>
        </div>
      </div>
      <div class="progress progress-sm progress-success" style="margin-top: 12px;">
        <div class="progress-bar" style="width: 85%"></div>
      </div>
    </div>

    <!-- Report Compliance -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Report Compliance</span>
        <span class="badge badge-success">Excellent</span>
      </div>
      <div class="stat-value">96%</div>
      <div class="stat-meta">58/60 reports this week</div>
      <div class="stat-breakdown">
        <div class="breakdown-item">
          <span class="breakdown-dot" style="background-color: var(--color-success-500);"></span>
          <span class="breakdown-label">On-time: 55</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-dot" style="background-color: var(--color-warning-500);"></span>
          <span class="breakdown-label">Late: 3</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-dot" style="background-color: var(--color-error-500);"></span>
          <span class="breakdown-label">Missing: 2</span>
        </div>
      </div>
    </div>

    <!-- Pending Approvals -->
    <div class="stat-card stat-card-warning">
      <div class="stat-header">
        <span class="stat-label">Pending Approvals</span>
        <span class="badge badge-warning">Action Needed</span>
      </div>
      <div class="stat-value">8</div>
      <div class="stat-meta">Reports awaiting review</div>
      <button class="btn-sm btn-primary" style="margin-top: 12px; width: 100%;">
        Review Now
      </button>
    </div>

    <!-- Team Mood -->
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-label">Team Health</span>
        <svg class="icon icon-help" title="Based on help requests and blockers">...</svg>
      </div>
      <div class="mood-indicator mood-good">
        <svg class="mood-icon">...</svg>
        <span class="mood-label">Good</span>
      </div>
      <div class="stat-meta">
        3 blockers reported today
      </div>
      <div class="stat-tags">
        <span class="tag tag-sm">2 Need Help</span>
        <span class="tag tag-sm">1 Critical</span>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="team-lead-grid">
    <!-- Left Column: Pending Approvals -->
    <div class="approval-queue">
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Pending Report Approvals</h3>
            <p class="card-subtitle">Review and approve team member reports</p>
          </div>
          <div class="tabs tabs-sm">
            <button class="tab is-active" data-tab="pending">
              Pending <span class="badge badge-sm badge-warning">8</span>
            </button>
            <button class="tab" data-tab="approved">
              Approved
            </button>
            <button class="tab" data-tab="flagged">
              Flagged <span class="badge badge-sm badge-error">2</span>
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="approval-list">
            <!-- Approval Item -->
            <div class="approval-item">
              <div class="approval-header">
                <div class="approval-user">
                  <div class="avatar avatar-sm">
                    <img src="user1.jpg" alt="John Smith">
                  </div>
                  <div class="approval-user-info">
                    <span class="approval-user-name">John Smith</span>
                    <span class="approval-user-meta">
                      Senior Developer • Submitted 2 hours ago
                    </span>
                  </div>
                </div>
                <div class="approval-status">
                  <span class="badge badge-dot badge-warning">Pending</span>
                </div>
              </div>

              <div class="approval-content">
                <!-- Report Summary -->
                <div class="approval-summary">
                  <div class="approval-stat">
                    <span class="approval-stat-label">Events</span>
                    <span class="approval-stat-value">12</span>
                  </div>
                  <div class="approval-stat">
                    <span class="approval-stat-label">Points</span>
                    <span class="approval-stat-value">+45</span>
                  </div>
                  <div class="approval-stat">
                    <span class="approval-stat-label">Tasks</span>
                    <span class="approval-stat-value">5</span>
                  </div>
                </div>

                <!-- Report Highlights -->
                <div class="approval-highlights">
                  <div class="approval-section">
                    <h5 class="approval-section-title">Work Completed</h5>
                    <p class="approval-section-text">
                      Implemented user authentication API endpoints with JWT token validation.
                      Completed database migration for user profiles table. Fixed critical bug
                      in payment processing module that was causing transaction failures...
                    </p>
                  </div>

                  <div class="approval-section">
                    <h5 class="approval-section-title">Blockers</h5>
                    <p class="approval-section-text">
                      Waiting for QA environment access to test payment integration.
                      Need clarification on password reset flow requirements.
                    </p>
                  </div>

                  <div class="approval-section">
                    <h5 class="approval-section-title">Team Recognition</h5>
                    <div class="recognition-item">
                      <div class="avatar avatar-xs">
                        <img src="user2.jpg" alt="Sarah">
                      </div>
                      <span class="recognition-text">
                        <strong>Sarah Williams</strong> - Helped debug the payment issue
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Auto-validation Checks -->
                <div class="validation-checks">
                  <div class="validation-check is-passed">
                    <svg class="icon icon-check">...</svg>
                    <span>Minimum activity requirement met (3+ events)</span>
                  </div>
                  <div class="validation-check is-passed">
                    <svg class="icon icon-check">...</svg>
                    <span>Word count requirements satisfied</span>
                  </div>
                  <div class="validation-check is-warning">
                    <svg class="icon icon-alert">...</svg>
                    <span>Late submission (after 9:00 PM)</span>
                  </div>
                </div>
              </div>

              <div class="approval-actions">
                <button class="btn-ghost btn-sm">
                  <svg class="icon">...</svg>
                  <span>View Full Report</span>
                </button>
                <div class="approval-buttons">
                  <button class="btn-secondary btn-sm" data-action="request-changes">
                    Request Changes
                  </button>
                  <button class="btn-primary btn-sm" data-action="approve">
                    <svg class="icon">...</svg>
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Flagged Report Item -->
            <div class="approval-item approval-item-flagged">
              <div class="approval-header">
                <div class="approval-user">
                  <div class="avatar avatar-sm">
                    <span>MJ</span>
                  </div>
                  <div class="approval-user-info">
                    <span class="approval-user-name">Mike Johnson</span>
                    <span class="approval-user-meta">
                      Junior Developer • Submitted 5 hours ago
                    </span>
                  </div>
                </div>
                <div class="approval-status">
                  <span class="badge badge-dot badge-error">Flagged</span>
                </div>
              </div>

              <div class="approval-content">
                <div class="approval-alert">
                  <svg class="icon icon-warning">...</svg>
                  <div class="approval-alert-content">
                    <strong>Validation Issues Detected</strong>
                    <p>This report has been flagged for review due to potential issues</p>
                  </div>
                </div>

                <div class="validation-checks">
                  <div class="validation-check is-failed">
                    <svg class="icon icon-x">...</svg>
                    <span>Insufficient event activity (only 2 events today)</span>
                  </div>
                  <div class="validation-check is-failed">
                    <svg class="icon icon-x">...</svg>
                    <span>Work completed section too brief (35 chars, need 50+)</span>
                  </div>
                  <div class="validation-check is-warning">
                    <svg class="icon icon-alert">...</svg>
                    <span>Possible duplicate content from previous report</span>
                  </div>
                </div>
              </div>

              <div class="approval-actions">
                <button class="btn-ghost btn-sm">
                  <svg class="icon">...</svg>
                  <span>View Details</span>
                </button>
                <div class="approval-buttons">
                  <button class="btn-error btn-sm" data-action="reject">
                    Reject
                  </button>
                  <button class="btn-secondary btn-sm" data-action="contact">
                    Contact Developer
                  </button>
                </div>
              </div>
            </div>

            <!-- More items... -->
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <button class="btn-icon btn-ghost" disabled>
              <svg class="icon">...</svg>
            </button>
            <div class="pagination-info">
              Showing <strong>1-8</strong> of <strong>8</strong> reports
            </div>
            <button class="btn-icon btn-ghost" disabled>
              <svg class="icon">...</svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Center Column: Performance Charts -->
    <div class="performance-section">
      <!-- Team Performance Chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Team Performance Trend</h3>
          <div class="chart-controls">
            <div class="btn-group">
              <button class="btn-ghost btn-sm">Week</button>
              <button class="btn-ghost btn-sm is-active">Month</button>
              <button class="btn-ghost btn-sm">Quarter</button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <!-- Chart Container -->
          <div class="chart-container" style="height: 300px;">
            <canvas id="teamPerformanceChart"></canvas>
          </div>
          <!-- Chart Legend -->
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color" style="background-color: var(--color-primary-500);"></span>
              <span class="legend-label">Points Earned</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: var(--color-success-500);"></span>
              <span class="legend-label">Target</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background-color: var(--color-accent-500);"></span>
              <span class="legend-label">Team Average</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Point Distribution -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Point Distribution</h3>
          <button class="btn-ghost btn-sm">View Details</button>
        </div>
        <div class="card-body">
          <div class="distribution-chart">
            <div class="chart-container" style="height: 200px;">
              <canvas id="pointDistributionChart"></canvas>
            </div>
          </div>
          <div class="distribution-legend">
            <div class="distribution-item">
              <div class="distribution-color" style="background-color: var(--color-success-500);"></div>
              <div class="distribution-info">
                <span class="distribution-label">GitLab</span>
                <span class="distribution-value">45%</span>
              </div>
            </div>
            <div class="distribution-item">
              <div class="distribution-color" style="background-color: var(--color-primary-500);"></div>
              <div class="distribution-info">
                <span class="distribution-label">OpenProject</span>
                <span class="distribution-value">30%</span>
              </div>
            </div>
            <div class="distribution-item">
              <div class="distribution-color" style="background-color: var(--color-warning-500);"></div>
              <div class="distribution-info">
                <span class="distribution-label">SonarQube</span>
                <span class="distribution-value">15%</span>
              </div>
            </div>
            <div class="distribution-item">
              <div class="distribution-color" style="background-color: var(--color-info-500);"></div>
              <div class="distribution-info">
                <span class="distribution-label">Reports</span>
                <span class="distribution-value">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Member Performance -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Member Performance</h3>
          <div class="card-actions">
            <div class="sort-control">
              <label class="sort-label">Sort by:</label>
              <select class="select select-sm">
                <option>Points</option>
                <option>Compliance</option>
                <option>Activity</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="member-performance-list">
            <!-- Performance Item -->
            <div class="performance-item">
              <div class="performance-rank">1</div>
              <div class="avatar avatar-sm">
                <img src="user1.jpg" alt="Sarah W">
              </div>
              <div class="performance-info">
                <span class="performance-name">Sarah Williams</span>
                <span class="performance-role">Senior Developer</span>
              </div>
              <div class="performance-stats">
                <div class="performance-stat">
                  <span class="stat-value">1,450</span>
                  <span class="stat-label">pts</span>
                </div>
                <div class="performance-stat">
                  <span class="stat-value">100%</span>
                  <span class="stat-label">reports</span>
                </div>
              </div>
              <div class="performance-chart">
                <!-- Mini sparkline chart -->
                <svg width="80" height="30" viewBox="0 0 80 30">
                  <path d="M0,15 L20,10 L40,12 L60,5 L80,8"
                        stroke="var(--color-success-500)"
                        stroke-width="2"
                        fill="none"/>
                </svg>
              </div>
              <button class="btn-icon-sm btn-ghost">
                <svg class="icon">...</svg>
              </button>
            </div>

            <!-- More performance items... -->
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Alerts & Actions -->
    <div class="alerts-sidebar">
      <!-- Alerts Panel -->
      <div class="card card-alert">
        <div class="card-header">
          <h3 class="card-title">Alerts</h3>
          <span class="badge badge-error">3</span>
        </div>
        <div class="card-body">
          <div class="alert-list">
            <!-- Alert Item -->
            <div class="alert-item alert-item-error">
              <div class="alert-icon">
                <svg>...</svg>
              </div>
              <div class="alert-content">
                <h5 class="alert-title">Missing Reports</h5>
                <p class="alert-description">
                  2 team members haven't submitted today's report
                </p>
                <span class="alert-time">30 minutes ago</span>
              </div>
              <button class="alert-action">
                Remind
              </button>
            </div>

            <div class="alert-item alert-item-warning">
              <div class="alert-icon">
                <svg>...</svg>
              </div>
              <div class="alert-content">
                <h5 class="alert-title">Critical Blocker</h5>
                <p class="alert-description">
                  Mike reported production deployment blocker
                </p>
                <span class="alert-time">1 hour ago</span>
              </div>
              <button class="alert-action">
                View
              </button>
            </div>

            <div class="alert-item alert-item-info">
              <div class="alert-icon">
                <svg>...</svg>
              </div>
              <div class="alert-content">
                <h5 class="alert-title">Quality Gate Failed</h5>
                <p class="alert-description">
                  3 quality gate failures in last 24 hours
                </p>
                <span class="alert-time">2 hours ago</span>
              </div>
              <button class="alert-action">
                Review
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Quick Actions</h3>
        </div>
        <div class="card-body">
          <div class="quick-actions">
            <button class="quick-action-btn">
              <svg class="quick-action-icon">...</svg>
              <span class="quick-action-label">Send Team Announcement</span>
            </button>

            <button class="quick-action-btn">
              <svg class="quick-action-icon">...</svg>
              <span class="quick-action-label">Schedule 1-on-1s</span>
            </button>

            <button class="quick-action-btn">
              <svg class="quick-action-icon">...</svg>
              <span class="quick-action-label">Export Weekly Report</span>
            </button>

            <button class="quick-action-btn">
              <svg class="quick-action-icon">...</svg>
              <span class="quick-action-label">Adjust Point Rules</span>
            </button>

            <button class="quick-action-btn">
              <svg class="quick-action-icon">...</svg>
              <span class="quick-action-label">View Team Calendar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Recognition Wall -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Recognition</h3>
        </div>
        <div class="card-body">
          <div class="recognition-list">
            <div class="recognition-card">
              <div class="recognition-header">
                <div class="avatar avatar-xs">
                  <img src="user1.jpg">
                </div>
                <span class="recognition-from">John</span>
                <svg class="icon icon-arrow">...</svg>
                <div class="avatar avatar-xs">
                  <img src="user2.jpg">
                </div>
                <span class="recognition-to">Sarah</span>
              </div>
              <p class="recognition-message">
                "Helped debug critical payment issue that was blocking release"
              </p>
              <span class="recognition-time">2 hours ago</span>
            </div>

            <!-- More recognition cards... -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Additional CSS for Team Lead Dashboard
```css
/* Team Lead Grid Layout */
.team-lead-grid {
  display: grid;
  grid-template-columns: 5fr 4fr 3fr;
  gap: var(--spacing-6);
}

/* Approval Queue Styles */
.approval-item {
  padding: var(--spacing-6);
  border: var(--border-default);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
  background-color: var(--color-white);
  transition: var(--transition-default);
}

.approval-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-300);
}

.approval-item-flagged {
  border-left: 4px solid var(--color-error-500);
  background-color: var(--color-error-50);
}

.approval-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}

.approval-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.approval-user-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.approval-user-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.approval-user-meta {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}

.approval-summary {
  display: flex;
  gap: var(--spacing-6);
  padding: var(--spacing-4);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
}

.approval-stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.approval-stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.approval-stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.approval-section {
  margin-bottom: var(--spacing-4);
}

.approval-section-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-2);
}

.approval-section-text {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.validation-checks {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-4);
}

.validation-check {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
}

.validation-check.is-passed {
  color: var(--color-success-700);
}

.validation-check.is-warning {
  color: var(--color-warning-700);
}

.validation-check.is-failed {
  color: var(--color-error-700);
}

.approval-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: var(--border-default);
}

.approval-buttons {
  display: flex;
  gap: var(--spacing-2);
}

.approval-alert {
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background-color: var(--color-error-50);
  border: 1px solid var(--color-error-200);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-4);
}

.approval-alert-content strong {
  display: block;
  color: var(--color-error-700);
  margin-bottom: var(--spacing-1);
}

.approval-alert-content p {
  font-size: var(--font-size-sm);
  color: var(--color-error-600);
}

/* Performance Styles */
.member-performance-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.performance-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  transition: var(--transition-default);
}

.performance-item:hover {
  background-color: var(--color-gray-50);
}

.performance-rank {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-600);
  background-color: var(--color-gray-100);
  border-radius: var(--radius-md);
}

.performance-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  flex: 1;
}

.performance-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
}

.performance-role {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}

.performance-stats {
  display: flex;
  gap: var(--spacing-4);
}

.performance-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.performance-stat .stat-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
}

.performance-stat .stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}

/* Chart Styles */
.chart-container {
  position: relative;
  width: 100%;
}

.chart-legend {
  display: flex;
  gap: var(--spacing-6);
  justify-content: center;
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: var(--border-default);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
}

.legend-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

/* Alert Styles */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.alert-item {
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  border-left: 3px solid;
}

.alert-item-error {
  border-left-color: var(--color-error-500);
  background-color: var(--color-error-50);
}

.alert-item-warning {
  border-left-color: var(--color-warning-500);
  background-color: var(--color-warning-50);
}

.alert-item-info {
  border-left-color: var(--color-info-500);
  background-color: var(--color-info-50);
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-1);
}

.alert-description {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  margin-bottom: var(--spacing-1);
}

.alert-time {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.alert-action {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border: none;
  background-color: var(--color-white);
  color: var(--color-primary-600);
  border-radius: var(--radius-sm);
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition-default);
}

.alert-action:hover {
  background-color: var(--color-primary-50);
}

/* Quick Actions */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-3);
  text-align: left;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  background: none;
  border: var(--border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-default);
}

.quick-action-btn:hover {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-300);
  color: var(--color-primary-700);
}

.quick-action-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

/* Recognition Styles */
.recognition-card {
  padding: var(--spacing-3);
  background-color: var(--color-gray-50);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-3);
}

.recognition-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.recognition-message {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  font-style: italic;
  margin-bottom: var(--spacing-2);
  line-height: var(--line-height-relaxed);
}

.recognition-time {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

/* Responsive Layout */
@media (max-width: 1279px) {
  .team-lead-grid {
    grid-template-columns: 1fr;
  }

  .approval-queue {
    order: 1;
  }

  .performance-section {
    order: 2;
  }

  .alerts-sidebar {
    order: 3;
  }
}
```

---

### 4.4 Admin Dashboard

#### Layout Structure
```
Desktop Layout:
- Top: System Health Metrics (4 columns)
- Main: Tabbed interface
  - Users Tab
  - Webhooks Tab
  - Point Rules Tab
  - System Logs Tab
  - Analytics Tab
```

#### HTML Structure
```html
<div class="dashboard-container">
  <!-- Page Header -->
  <div class="dashboard-header">
    <div>
      <h1 class="dashboard-title">System Administration</h1>
      <p class="dashboard-subtitle">
        Manage users, configure integrations, and monitor system health
      </p>
    </div>
    <div class="dashboard-actions">
      <button class="btn-secondary">
        <svg class="icon">...</svg>
        <span>System Settings</span>
      </button>
      <button class="btn-primary">
        <svg class="icon">...</svg>
        <span>Backup Data</span>
      </button>
    </div>
  </div>

  <!-- System Health Metrics -->
  <div class="stats-grid stats-grid-4">
    <div class="stat-card">
      <div class="stat-icon stat-icon-success">
        <svg>...</svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">System Status</div>
        <div class="stat-value-large">
          <span class="status-indicator status-online"></span>
          <span>Online</span>
        </div>
        <div class="stat-meta">Uptime: 99.98%</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon-primary">
        <svg>...</svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Active Users</div>
        <div class="stat-value">247</div>
        <div class="stat-change is-positive">
          +12 this month
        </div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon-warning">
        <svg>...</svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Webhook Health</div>
        <div class="stat-value">98.5%</div>
        <div class="stat-breakdown-inline">
          <span class="badge badge-success">GitLab: 100%</span>
          <span class="badge badge-warning">SQ: 95%</span>
        </div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon stat-icon-info">
        <svg>...</svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Storage Used</div>
        <div class="stat-value">245 GB</div>
        <div class="progress progress-sm" style="margin-top: 8px;">
          <div class="progress-bar" style="width: 61%"></div>
        </div>
        <div class="stat-meta">61% of 400 GB</div>
      </div>
    </div>
  </div>

  <!-- Main Admin Panel -->
  <div class="card">
    <!-- Tab Navigation -->
    <div class="admin-tabs">
      <button class="tab is-active" data-tab="users">
        <svg class="tab-icon">...</svg>
        <span>User Management</span>
        <span class="badge badge-neutral">247</span>
      </button>
      <button class="tab" data-tab="webhooks">
        <svg class="tab-icon">...</svg>
        <span>Webhook Configuration</span>
      </button>
      <button class="tab" data-tab="points">
        <svg class="tab-icon">...</svg>
        <span>Point Rules</span>
      </button>
      <button class="tab" data-tab="logs">
        <svg class="tab-icon">...</svg>
        <span>System Logs</span>
      </button>
      <button class="tab" data-tab="analytics">
        <svg class="tab-icon">...</svg>
        <span>Analytics</span>
      </button>
    </div>

    <!-- Users Tab Panel -->
    <div class="tab-panel is-active" id="users-panel">
      <div class="panel-header">
        <div class="panel-header-main">
          <h3 class="panel-title">User Management</h3>
          <p class="panel-subtitle">Manage user accounts, roles, and permissions</p>
        </div>
        <div class="panel-actions">
          <div class="search-box">
            <svg class="search-icon">...</svg>
            <input
              type="search"
              class="input input-search"
              placeholder="Search users..."
            >
          </div>
          <button class="btn-primary">
            <svg class="icon">...</svg>
            <span>Invite User</span>
          </button>
        </div>
      </div>

      <div class="panel-filters">
        <div class="filter-group">
          <label class="filter-label">Role:</label>
          <div class="btn-group btn-group-filter">
            <button class="btn-filter is-active">All</button>
            <button class="btn-filter">Developers <span class="badge badge-sm">185</span></button>
            <button class="btn-filter">Team Leads <span class="badge badge-sm">45</span></button>
            <button class="btn-filter">Admins <span class="badge badge-sm">17</span></button>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Status:</label>
          <div class="btn-group btn-group-filter">
            <button class="btn-filter is-active">All</button>
            <button class="btn-filter">Active <span class="badge badge-sm badge-success">230</span></button>
            <button class="btn-filter">Invited <span class="badge badge-sm badge-warning">12</span></button>
            <button class="btn-filter">Inactive <span class="badge badge-sm badge-neutral">5</span></button>
          </div>
        </div>

        <div class="filter-actions">
          <button class="btn-ghost btn-sm">
            <svg class="icon">...</svg>
            <span>Export CSV</span>
          </button>
          <button class="btn-ghost btn-sm">
            <svg class="icon">...</svg>
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" class="checkbox">
              </th>
              <th>User</th>
              <th>Role</th>
              <th>Team</th>
              <th>Status</th>
              <th>Points</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="checkbox" class="checkbox">
              </td>
              <td>
                <div class="table-user">
                  <div class="avatar avatar-sm avatar-status is-online">
                    <img src="user1.jpg" alt="Sarah Williams">
                  </div>
                  <div class="table-user-info">
                    <span class="table-user-name">Sarah Williams</span>
                    <span class="table-user-email">sarah.williams@company.com</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge badge-primary">Team Lead</span>
              </td>
              <td>Engineering Alpha</td>
              <td>
                <span class="badge badge-success">Active</span>
              </td>
              <td>
                <span class="font-semibold">1,450</span>
              </td>
              <td>
                <span class="text-sm text-gray-600">5 minutes ago</span>
              </td>
              <td>
                <div class="table-actions">
                  <button class="btn-icon-sm btn-ghost" title="Edit">
                    <svg class="icon">...</svg>
                  </button>
                  <button class="btn-icon-sm btn-ghost" title="View Details">
                    <svg class="icon">...</svg>
                  </button>
                  <div class="dropdown">
                    <button class="btn-icon-sm btn-ghost">
                      <svg class="icon">...</svg>
                    </button>
                    <div class="dropdown-menu">
                      <button class="dropdown-item">Edit User</button>
                      <button class="dropdown-item">Change Role</button>
                      <button class="dropdown-item">Reset Password</button>
                      <div class="dropdown-divider"></div>
                      <button class="dropdown-item text-error">Deactivate</button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- More rows... -->
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="table-pagination">
        <div class="pagination-info">
          Showing <strong>1-20</strong> of <strong>247</strong> users
        </div>
        <div class="pagination-controls">
          <button class="btn-icon btn-ghost" disabled>
            <svg class="icon">...</svg>
          </button>
          <button class="btn-ghost btn-sm is-active">1</button>
          <button class="btn-ghost btn-sm">2</button>
          <button class="btn-ghost btn-sm">3</button>
          <span>...</span>
          <button class="btn-ghost btn-sm">13</button>
          <button class="btn-icon btn-ghost">
            <svg class="icon">...</svg>
          </button>
        </div>
        <div class="pagination-size">
          <label>Show:</label>
          <select class="select select-sm">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Webhooks Tab Panel -->
    <div class="tab-panel" id="webhooks-panel">
      <div class="panel-header">
        <div class="panel-header-main">
          <h3 class="panel-title">Webhook Configuration</h3>
          <p class="panel-subtitle">Manage integrations with external tools</p>
        </div>
        <div class="panel-actions">
          <button class="btn-secondary">
            <svg class="icon">...</svg>
            <span>Test Connection</span>
          </button>
          <button class="btn-primary">
            <svg class="icon">...</svg>
            <span>Add Integration</span>
          </button>
        </div>
      </div>

      <!-- Webhook Cards -->
      <div class="webhook-grid">
        <!-- GitLab Integration -->
        <div class="webhook-card webhook-card-active">
          <div class="webhook-header">
            <div class="webhook-logo">
              <img src="gitlab-logo.svg" alt="GitLab" width="40">
            </div>
            <div class="webhook-status">
              <span class="status-indicator status-online"></span>
              <span class="webhook-status-text">Connected</span>
            </div>
          </div>

          <div class="webhook-body">
            <h4 class="webhook-title">GitLab</h4>
            <p class="webhook-description">
              Track commits, merge requests, code reviews, and pipelines
            </p>

            <div class="webhook-stats">
              <div class="webhook-stat">
                <span class="webhook-stat-value">12,450</span>
                <span class="webhook-stat-label">Events Today</span>
              </div>
              <div class="webhook-stat">
                <span class="webhook-stat-value">99.9%</span>
                <span class="webhook-stat-label">Uptime</span>
              </div>
            </div>

            <div class="webhook-details">
              <div class="webhook-detail-item">
                <span class="webhook-detail-label">Endpoint:</span>
                <code class="webhook-detail-value">/api/webhooks/gitlab</code>
                <button class="btn-icon-xs btn-ghost" title="Copy">
                  <svg class="icon">...</svg>
                </button>
              </div>

              <div class="webhook-detail-item">
                <span class="webhook-detail-label">Secret:</span>
                <code class="webhook-detail-value">••••••••••••••••</code>
                <button class="btn-icon-xs btn-ghost" title="Reveal">
                  <svg class="icon">...</svg>
                </button>
              </div>

              <div class="webhook-detail-item">
                <span class="webhook-detail-label">Last Event:</span>
                <span class="webhook-detail-value">2 minutes ago</span>
              </div>
            </div>
          </div>

          <div class="webhook-footer">
            <button class="btn-ghost btn-sm">View Logs</button>
            <button class="btn-ghost btn-sm">Configure</button>
            <button class="btn-ghost btn-sm text-error">Disconnect</button>
          </div>
        </div>

        <!-- OpenProject Integration -->
        <div class="webhook-card webhook-card-active">
          <div class="webhook-header">
            <div class="webhook-logo">
              <img src="openproject-logo.svg" alt="OpenProject" width="40">
            </div>
            <div class="webhook-status">
              <span class="status-indicator status-online"></span>
              <span class="webhook-status-text">Connected</span>
            </div>
          </div>

          <div class="webhook-body">
            <h4 class="webhook-title">OpenProject</h4>
            <p class="webhook-description">
              Track work packages, time logging, and task completion
            </p>

            <div class="webhook-stats">
              <div class="webhook-stat">
                <span class="webhook-stat-value">3,245</span>
                <span class="webhook-stat-label">Events Today</span>
              </div>
              <div class="webhook-stat">
                <span class="webhook-stat-value">100%</span>
                <span class="webhook-stat-label">Uptime</span>
              </div>
            </div>

            <div class="webhook-details">
              <div class="webhook-detail-item">
                <span class="webhook-detail-label">Endpoint:</span>
                <code class="webhook-detail-value">/api/webhooks/openproject</code>
                <button class="btn-icon-xs btn-ghost" title="Copy">
                  <svg class="icon">...</svg>
                </button>
              </div>

              <div class="webhook-detail-item">
                <span class="webhook-detail-label">Secret:</span>
                <code class="webhook-detail-value">••••••••••••••••</code>
                <button class="btn-icon-xs btn-ghost" title="Reveal">
                  <svg class="icon">...</svg>
                </button>
              </div>

              <div class="webhook-detail-item">
                <span class="webhook-detail-label">Last Event:</span>
                <span class="webhook-detail-value">5 minutes ago</span>
              </div>
            </div>
          </div>

          <div class="webhook-footer">
            <button class="btn-ghost btn-sm">View Logs</button>
            <button class="btn-ghost btn-sm">Configure</button>
            <button class="btn-ghost btn-sm text-error">Disconnect</button>
          </div>
        </div>

        <!-- SonarQube Integration -->
        <div class="webhook-card webhook-card-warning">
          <div class="webhook-header">
            <div class="webhook-logo">
              <img src="sonarqube-logo.svg" alt="SonarQube" width="40">
            </div>
            <div class="webhook-status">
              <span class="status-indicator status-warning"></span>
              <span class="webhook-status-text">Degraded</span>
            </div>
          </div>

          <div class="webhook-body">
            <h4 class="webhook-title">SonarQube</h4>
            <p class="webhook-description">
              Monitor code quality, security vulnerabilities, and coverage
            </p>

            <div class="webhook-alert">
              <svg class="icon icon-alert">...</svg>
              <span>Connection issues detected. 15 events failed in last hour.</span>
            </div>

            <div class="webhook-stats">
              <div class="webhook-stat">
                <span class="webhook-stat-value">845</span>
                <span class="webhook-stat-label">Events Today</span>
              </div>
              <div class="webhook-stat">
                <span class="webhook-stat-value webhook-stat-warning">95.2%</span>
                <span class="webhook-stat-label">Uptime</span>
              </div>
            </div>

            <div class="webhook-details">
              <div class="webhook-detail-item">
                <span class="webhook-detail-label">Endpoint:</span>
                <code class="webhook-detail-value">/api/webhooks/sonarqube</code>
                <button class="btn-icon-xs btn-ghost" title="Copy">
                  <svg class="icon">...</svg>
                </button>
              </div>

              <div class="webhook-detail-item">
                <span class="webhook-detail-label">Last Event:</span>
                <span class="webhook-detail-value text-error">Failed 15m ago</span>
              </div>
            </div>
          </div>

          <div class="webhook-footer">
            <button class="btn-warning btn-sm">Retry Failed</button>
            <button class="btn-ghost btn-sm">View Logs</button>
            <button class="btn-ghost btn-sm">Configure</button>
          </div>
        </div>

        <!-- Add New Integration Card -->
        <div class="webhook-card webhook-card-add">
          <div class="webhook-add-content">
            <svg class="webhook-add-icon">...</svg>
            <h4 class="webhook-add-title">Add Integration</h4>
            <p class="webhook-add-description">
              Connect additional tools to track developer activity
            </p>
            <button class="btn-primary btn-sm">
              <svg class="icon">...</svg>
              <span>Browse Integrations</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Point Rules Tab Panel -->
    <div class="tab-panel" id="points-panel">
      <div class="panel-header">
        <div class="panel-header-main">
          <h3 class="panel-title">Point Calculation Rules</h3>
          <p class="panel-subtitle">Configure point values for different activities</p>
        </div>
        <div class="panel-actions">
          <button class="btn-ghost">
            <svg class="icon">...</svg>
            <span>Reset to Defaults</span>
          </button>
          <button class="btn-primary">
            <svg class="icon">...</svg>
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <!-- Point Rules Accordion -->
      <div class="point-rules-container">
        <!-- GitLab Rules -->
        <div class="point-rule-section">
          <div class="point-rule-header">
            <div class="point-rule-title">
              <img src="gitlab-logo.svg" alt="GitLab" width="24" height="24">
              <h4>GitLab Events</h4>
            </div>
            <button class="btn-icon btn-ghost toggle-section">
              <svg class="icon icon-chevron">...</svg>
            </button>
          </div>

          <div class="point-rule-body">
            <div class="point-rule-list">
              <!-- Rule Item -->
              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Commit Pushed</span>
                  <span class="point-rule-description">Points awarded for each commit</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="2"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
                <div class="point-rule-actions">
                  <button class="btn-icon-sm btn-ghost" title="Reset">
                    <svg class="icon">...</svg>
                  </button>
                </div>
              </div>

              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Merge Request Created</span>
                  <span class="point-rule-description">New merge request opened</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="5"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
                <div class="point-rule-actions">
                  <button class="btn-icon-sm btn-ghost" title="Reset">
                    <svg class="icon">...</svg>
                  </button>
                </div>
              </div>

              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Merge Request Merged</span>
                  <span class="point-rule-description">MR successfully merged to main branch</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="10"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
                <div class="point-rule-actions">
                  <button class="btn-icon-sm btn-ghost" title="Reset">
                    <svg class="icon">...</svg>
                  </button>
                </div>
              </div>

              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Code Review Performed</span>
                  <span class="point-rule-description">Reviewed another developer's code</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="3"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
                <div class="point-rule-actions">
                  <button class="btn-icon-sm btn-ghost" title="Reset">
                    <svg class="icon">...</svg>
                  </button>
                </div>
              </div>

              <div class="point-rule-item point-rule-item-negative">
                <div class="point-rule-info">
                  <span class="point-rule-name">Pipeline Failed</span>
                  <span class="point-rule-description">CI/CD pipeline execution failed</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number input-negative"
                      value="-3"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
                <div class="point-rule-actions">
                  <button class="btn-icon-sm btn-ghost" title="Reset">
                    <svg class="icon">...</svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- OpenProject Rules -->
        <div class="point-rule-section">
          <div class="point-rule-header">
            <div class="point-rule-title">
              <img src="openproject-logo.svg" alt="OpenProject" width="24" height="24">
              <h4>OpenProject Events</h4>
            </div>
            <button class="btn-icon btn-ghost toggle-section">
              <svg class="icon icon-chevron">...</svg>
            </button>
          </div>

          <div class="point-rule-body">
            <div class="point-rule-list">
              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Task Completed</span>
                  <span class="point-rule-description">Work package marked as done</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="10"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>

              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Time Logged</span>
                  <span class="point-rule-description">Points per hour of logged time</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="2"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts/hr</span>
                  </div>
                </div>
              </div>

              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Comment Added</span>
                  <span class="point-rule-description">Added comment to work package</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="1"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SonarQube Rules -->
        <div class="point-rule-section">
          <div class="point-rule-header">
            <div class="point-rule-title">
              <img src="sonarqube-logo.svg" alt="SonarQube" width="24" height="24">
              <h4>SonarQube Events</h4>
            </div>
            <button class="btn-icon btn-ghost toggle-section">
              <svg class="icon icon-chevron">...</svg>
            </button>
          </div>

          <div class="point-rule-body">
            <div class="point-rule-list">
              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Quality Gate Passed</span>
                  <span class="point-rule-description">Code meets all quality standards</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="15"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>

              <div class="point-rule-item point-rule-item-negative">
                <div class="point-rule-info">
                  <span class="point-rule-name">Quality Gate Failed</span>
                  <span class="point-rule-description">Code does not meet quality standards</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number input-negative"
                      value="-10"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>

              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Security Vulnerability Fixed</span>
                  <span class="point-rule-description">Resolved security issue</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="20"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>

              <div class="point-rule-item point-rule-item-negative">
                <div class="point-rule-info">
                  <span class="point-rule-name">Critical Bug Introduced</span>
                  <span class="point-rule-description">New critical bug detected</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number input-negative"
                      value="-15"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Report Rules -->
        <div class="point-rule-section">
          <div class="point-rule-header">
            <div class="point-rule-title">
              <svg class="icon icon-report" width="24" height="24">...</svg>
              <h4>Daily Reports</h4>
            </div>
            <button class="btn-icon btn-ghost toggle-section">
              <svg class="icon icon-chevron">...</svg>
            </button>
          </div>

          <div class="point-rule-body">
            <div class="point-rule-list">
              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Report Submitted</span>
                  <span class="point-rule-description">Daily report submitted on time</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="10"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>

              <div class="point-rule-item point-rule-item-negative">
                <div class="point-rule-info">
                  <span class="point-rule-name">Missed Report</span>
                  <span class="point-rule-description">Failed to submit daily report</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number input-negative"
                      value="-20"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>

              <div class="point-rule-item">
                <div class="point-rule-info">
                  <span class="point-rule-name">Team Recognition</span>
                  <span class="point-rule-description">Recognized by team member</span>
                </div>
                <div class="point-rule-control">
                  <div class="input-field-inline">
                    <input
                      type="number"
                      class="input input-sm input-number"
                      value="5"
                      min="-100"
                      max="100"
                    >
                    <span class="input-suffix">pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

This document continues with additional sections. Would you like me to proceed with:
- System Logs Tab
- Analytics Tab
- Leaderboards Page
- User Profile & Settings
- Notification Center
- User Flows
- Accessibility Requirements
- Animation Specifications
- State Management
- Error Handling
- Real-time Updates

The complete specification will be comprehensive enough for direct HTML/CSS/JS implementation.
