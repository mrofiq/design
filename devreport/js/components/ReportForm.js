/**
 * Developer Report Dashboard - Report Form Component
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * This component handles the daily report submission form including:
 * - Form initialization with today's data
 * - Auto-populate webhook events
 * - Real-time character counting
 * - Validation (min word count, required fields)
 * - Add/remove priority items
 * - Team member selection
 * - Draft auto-save (localStorage)
 * - Form submission handler
 * - Success/error handling
 * - Submission window enforcement (3 PM - 11:59 PM)
 */

class ReportForm {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    this.options = {
      submissionWindowStart: 15, // 3 PM
      submissionWindowEnd: 23, // 11:59 PM
      minEvents: 3,
      minIncidentsLength: 50,
      minWorkCompletedWords: 10,
      autoSaveInterval: 30000, // 30 seconds
      apiEndpoint: '/api/reports/submit',
      eventsEndpoint: '/api/events/today',
      teamMembersEndpoint: '/api/team/members',
      ...options
    };

    this.events = [];
    this.priorities = [];
    this.teamMembers = [];
    this.draftKey = `report_draft_${this.getTodayDate()}`;
    this.autoSaveTimer = null;
    this.isSubmitting = false;

    this.init();
  }

  /**
   * Initialize the report form
   */
  async init() {
    this.showLoading();

    try {
      // Load data in parallel
      await Promise.all([
        this.loadEvents(),
        this.loadTeamMembers()
      ]);

      // Check submission window
      const windowStatus = this.checkSubmissionWindow();

      // Render the form
      this.render(windowStatus);

      // Load draft if exists
      this.loadDraft();

      // Setup event listeners
      this.setupEventListeners();

      // Start auto-save
      this.startAutoSave();

    } catch (error) {
      console.error('Error initializing report form:', error);
      this.showError('Failed to load report form. Please refresh the page.');
    }
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Format date for display
   */
  formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  /**
   * Check if current time is within submission window
   */
  checkSubmissionWindow() {
    const now = new Date();
    const currentHour = now.getHours();

    const isWithinWindow = currentHour >= this.options.submissionWindowStart &&
                           currentHour <= this.options.submissionWindowEnd;

    const isBeforeWindow = currentHour < this.options.submissionWindowStart;
    const isAfterWindow = currentHour > this.options.submissionWindowEnd;

    return {
      isWithinWindow,
      isBeforeWindow,
      isAfterWindow,
      currentHour,
      windowStart: this.options.submissionWindowStart,
      windowEnd: this.options.submissionWindowEnd
    };
  }

  /**
   * Load today's webhook events
   */
  async loadEvents() {
    // Simulate API call - replace with actual API call
    // const response = await fetch(this.options.eventsEndpoint);
    // this.events = await response.json();

    // Mock data for demonstration
    this.events = [
      {
        id: 1,
        service: 'gitlab',
        type: 'commit',
        title: 'Implemented user authentication module',
        time: '09:30 AM',
        points: 2
      },
      {
        id: 2,
        service: 'gitlab',
        type: 'merge_request',
        title: 'Merged PR #123: Fix login validation',
        time: '10:15 AM',
        points: 10
      },
      {
        id: 3,
        service: 'openproject',
        type: 'task_completed',
        title: 'Completed TASK-456: Update user profile page',
        time: '11:45 AM',
        points: 10
      },
      {
        id: 4,
        service: 'sonarqube',
        type: 'quality_gate',
        title: 'Quality gate passed for authentication module',
        time: '02:30 PM',
        points: 15
      }
    ];
  }

  /**
   * Load team members for recognition
   */
  async loadTeamMembers() {
    // Simulate API call - replace with actual API call
    // const response = await fetch(this.options.teamMembersEndpoint);
    // this.teamMembers = await response.json();

    // Mock data for demonstration
    this.teamMembers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
      { id: 4, name: 'Alice Williams', email: 'alice@example.com' }
    ];
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.container.innerHTML = `
      <div class="report-form">
        <div class="report-form__loading">
          <div class="report-form__loading-spinner"></div>
          <p class="report-form__loading-text">Loading your daily report...</p>
        </div>
      </div>
    `;
  }

  /**
   * Show error message
   */
  showError(message) {
    this.container.innerHTML = `
      <div class="report-form">
        <div class="report-form__body">
          <div class="report-form__window-warning report-form__window-error">
            <svg class="report-form__window-warning-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
            <div class="report-form__window-warning-content">
              <h3 class="report-form__window-warning-title">Error</h3>
              <p class="report-form__window-warning-text">${message}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render the complete form
   */
  render(windowStatus) {
    const totalPoints = this.events.reduce((sum, event) => sum + event.points, 0);
    const eventsCount = this.events.length;
    const todayDate = this.getTodayDate();
    const formattedDate = this.formatDate(todayDate);

    this.container.innerHTML = `
      <div class="report-form">
        <!-- Header -->
        <div class="report-form__header">
          <h1 class="report-form__title">Daily Report</h1>
          <p class="report-form__subtitle">
            <span class="report-form__date">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
              </svg>
              ${formattedDate}
            </span>
          </p>
        </div>

        <form class="report-form__body" id="dailyReportForm" data-validate>
          ${this.renderSubmissionWindowWarning(windowStatus)}

          <!-- Events Section -->
          ${this.renderEventsSection(eventsCount, totalPoints)}

          <!-- Work Completed Section -->
          ${this.renderWorkCompletedSection()}

          <!-- Incidents Section -->
          ${this.renderIncidentsSection()}

          <!-- Help Needed Section -->
          ${this.renderHelpNeededSection()}

          <!-- Team Recognition Section -->
          ${this.renderTeamRecognitionSection()}

          <!-- Tomorrow's Priorities Section -->
          ${this.renderPrioritiesSection()}
        </form>

        <!-- Form Actions -->
        <div class="report-form__actions">
          <div class="report-form__actions-left">
            <div class="report-form__draft-status">
              <svg class="report-form__draft-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
              </svg>
              <span id="draftStatus">Draft saved</span>
            </div>
          </div>
          <div class="report-form__actions-right">
            <button type="button" class="btn btn--secondary" id="clearFormBtn">
              Clear Form
            </button>
            <button
              type="submit"
              class="btn btn--primary report-form__submit-btn"
              id="submitReportBtn"
              ${!windowStatus.isWithinWindow ? 'disabled' : ''}
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render submission window warning
   */
  renderSubmissionWindowWarning(windowStatus) {
    if (windowStatus.isWithinWindow) {
      return '';
    }

    if (windowStatus.isBeforeWindow) {
      return `
        <div class="report-form__window-warning">
          <svg class="report-form__window-warning-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
          </svg>
          <div class="report-form__window-warning-content">
            <h3 class="report-form__window-warning-title">Submission Window Not Open</h3>
            <p class="report-form__window-warning-text">
              Report submission is available from ${windowStatus.windowStart}:00 (3:00 PM) to ${windowStatus.windowEnd}:59 (11:59 PM).
              You can draft your report now, but submission will be enabled at 3:00 PM.
            </p>
          </div>
        </div>
      `;
    }

    if (windowStatus.isAfterWindow) {
      return `
        <div class="report-form__window-warning report-form__window-error">
          <svg class="report-form__window-warning-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
          <div class="report-form__window-warning-content">
            <h3 class="report-form__window-warning-title">Submission Window Closed</h3>
            <p class="report-form__window-warning-text">
              The submission window for today's report has closed (ends at 11:59 PM).
              You will be penalized -20 points for missing today's report submission.
            </p>
          </div>
        </div>
      `;
    }

    return '';
  }

  /**
   * Render events section
   */
  renderEventsSection(eventsCount, totalPoints) {
    const isValidCount = eventsCount >= this.options.minEvents;
    const countClass = !isValidCount ? 'report-form__events-count--warning' : '';

    return `
      <div class="report-form__section">
        <div class="report-form__section-header">
          <svg class="report-form__section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd" />
          </svg>
          <h2 class="report-form__section-title">Today's Activities</h2>
          <span class="report-form__section-badge">Auto-populated</span>
        </div>
        <p class="report-form__section-description">
          Activities automatically captured from GitLab, OpenProject, and SonarQube.
        </p>

        <div class="report-form__events">
          ${this.renderEventsList()}

          <div class="report-form__events-summary">
            <div class="report-form__events-count ${countClass}">
              <span>Total Events:</span>
              <strong>${eventsCount}</strong>
              ${!isValidCount ? `<span>(Minimum ${this.options.minEvents} required)</span>` : ''}
            </div>
            <div class="report-form__total-points">
              <span>Total Points:</span>
              <strong>+${totalPoints}</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render events list
   */
  renderEventsList() {
    if (this.events.length === 0) {
      return `
        <div class="report-form__events-empty">
          <svg class="report-form__events-empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="report-form__events-empty-text">No activities recorded today. Start coding!</p>
        </div>
      `;
    }

    return this.events.map(event => `
      <div class="report-form__event-item">
        <div class="report-form__event-icon report-form__event-icon--${event.service}">
          ${this.getServiceIcon(event.service)}
        </div>
        <div class="report-form__event-content">
          <h4 class="report-form__event-title">${event.title}</h4>
          <div class="report-form__event-meta">
            <span class="report-form__event-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
              </svg>
              ${event.time}
            </span>
            <span class="report-form__event-points report-form__event-points--${event.points >= 0 ? 'positive' : 'negative'}">
              ${event.points >= 0 ? '+' : ''}${event.points} points
            </span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Get service icon
   */
  getServiceIcon(service) {
    const icons = {
      gitlab: 'GL',
      openproject: 'OP',
      sonarqube: 'SQ'
    };
    return icons[service] || service.substring(0, 2).toUpperCase();
  }

  /**
   * Render work completed section
   */
  renderWorkCompletedSection() {
    return `
      <div class="report-form__section">
        <div class="report-form__section-header">
          <svg class="report-form__section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          <h2 class="report-form__section-title">Work Completed</h2>
          <span class="report-form__section-badge report-form__section-badge--required">Required</span>
        </div>
        <p class="report-form__section-description">
          Describe what you accomplished today. Be specific and include any challenges you overcame.
        </p>

        <div class="form-field">
          <div class="report-form__field-header">
            <label for="workCompleted" class="form-label form-label--required">Work Completed</label>
            <span class="report-form__char-counter" id="workCompletedCounter">0 characters</span>
          </div>
          <div class="form-textarea-wrapper">
            <textarea
              id="workCompleted"
              name="workCompleted"
              class="form-textarea"
              rows="6"
              placeholder="Describe your completed work in detail..."
              required
              data-validate="workCompleted"
              maxlength="2000"
            ></textarea>
          </div>
          <div class="report-form__word-counter" id="workCompletedWordCounter">
            <span>0 words (minimum ${this.options.minWorkCompletedWords} required)</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render incidents section
   */
  renderIncidentsSection() {
    return `
      <div class="report-form__section">
        <div class="report-form__section-header">
          <svg class="report-form__section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <h2 class="report-form__section-title">Incidents Encountered</h2>
          <span class="report-form__section-badge report-form__section-badge--required">Required</span>
        </div>
        <p class="report-form__section-description">
          Report any blockers, issues, or problems you encountered today. Include errors, bugs, or unexpected challenges.
        </p>

        <div class="form-field">
          <div class="report-form__field-header">
            <label for="incidents" class="form-label form-label--required">Incidents</label>
            <span class="report-form__char-counter" id="incidentsCounter">0 / ${this.options.minIncidentsLength} characters</span>
          </div>
          <div class="form-textarea-wrapper">
            <textarea
              id="incidents"
              name="incidents"
              class="form-textarea"
              rows="5"
              placeholder="Describe incidents, blockers, or issues..."
              required
              data-validate="incidents"
              minlength="${this.options.minIncidentsLength}"
              maxlength="1000"
            ></textarea>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render help needed section
   */
  renderHelpNeededSection() {
    return `
      <div class="report-form__section">
        <div class="report-form__section-header">
          <svg class="report-form__section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <h2 class="report-form__section-title">Help Needed</h2>
          <span class="report-form__section-badge report-form__section-badge--optional">Optional</span>
        </div>
        <p class="report-form__section-description">
          Let us know if you need assistance with anything. Be specific about what help you need.
        </p>

        <div class="form-field">
          <div class="report-form__field-header">
            <label for="helpNeeded" class="form-label form-label--optional">Help Needed</label>
            <span class="report-form__char-counter" id="helpNeededCounter">0 characters</span>
          </div>
          <div class="form-textarea-wrapper">
            <textarea
              id="helpNeeded"
              name="helpNeeded"
              class="form-textarea"
              rows="4"
              placeholder="Describe any help or support you need..."
              maxlength="1000"
            ></textarea>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render team recognition section
   */
  renderTeamRecognitionSection() {
    return `
      <div class="report-form__section">
        <div class="report-form__section-header">
          <svg class="report-form__section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
          </svg>
          <h2 class="report-form__section-title">Team Recognition</h2>
          <span class="report-form__section-badge report-form__section-badge--optional">Optional</span>
        </div>
        <p class="report-form__section-description">
          Recognize a team member who helped you today or did outstanding work.
        </p>

        <div class="report-form__recognition-group">
          <div class="form-field">
            <label for="recognizedMember" class="form-label form-label--optional">Team Member</label>
            <select id="recognizedMember" name="recognizedMember" class="form-select">
              <option value="">Select a team member</option>
              ${this.teamMembers.map(member => `
                <option value="${member.id}">${member.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="form-field">
            <label for="recognitionReason" class="form-label form-label--optional">Reason for Recognition</label>
            <textarea
              id="recognitionReason"
              name="recognitionReason"
              class="form-textarea"
              rows="3"
              placeholder="Describe why you're recognizing this team member..."
              maxlength="500"
              disabled
            ></textarea>
            <span class="form-help-text">Select a team member to enable this field</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render priorities section
   */
  renderPrioritiesSection() {
    return `
      <div class="report-form__section">
        <div class="report-form__section-header">
          <svg class="report-form__section-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          <h2 class="report-form__section-title">Tomorrow's Priorities</h2>
          <span class="report-form__section-badge report-form__section-badge--required">Required</span>
        </div>
        <p class="report-form__section-description">
          List what you plan to work on tomorrow. Add at least 3 priorities.
        </p>

        <div class="form-field">
          <div id="prioritiesList" class="report-form__priorities-list">
            ${this.priorities.length === 0 ? '<p class="report-form__priorities-empty">No priorities added yet. Click the button below to add your first priority.</p>' : ''}
          </div>
          <button type="button" class="report-form__add-priority" id="addPriorityBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Add Priority
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    const form = document.getElementById('dailyReportForm');

    // Form submission
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Clear form button
    const clearBtn = document.getElementById('clearFormBtn');
    clearBtn.addEventListener('click', () => this.clearForm());

    // Character counters
    this.setupCharacterCounters();

    // Word counters
    this.setupWordCounters();

    // Priorities
    this.setupPriorities();

    // Team recognition
    this.setupTeamRecognition();

    // Auto-save on input
    form.addEventListener('input', () => {
      this.saveDraft();
    });
  }

  /**
   * Setup character counters
   */
  setupCharacterCounters() {
    const fields = [
      { id: 'workCompleted', counterId: 'workCompletedCounter' },
      { id: 'incidents', counterId: 'incidentsCounter' },
      { id: 'helpNeeded', counterId: 'helpNeededCounter' }
    ];

    fields.forEach(field => {
      const textarea = document.getElementById(field.id);
      const counter = document.getElementById(field.counterId);

      if (textarea && counter) {
        textarea.addEventListener('input', () => {
          const length = textarea.value.length;
          const maxLength = textarea.getAttribute('maxlength');
          const minLength = textarea.getAttribute('minlength');

          if (minLength) {
            counter.textContent = `${length} / ${minLength} characters`;

            if (length < parseInt(minLength)) {
              counter.classList.add('report-form__char-counter--warning');
              counter.classList.remove('report-form__char-counter--error');
            } else {
              counter.classList.remove('report-form__char-counter--warning');
            }
          } else if (maxLength) {
            const remaining = parseInt(maxLength) - length;
            counter.textContent = `${length} characters`;

            const percentage = length / parseInt(maxLength);
            if (percentage >= 1) {
              counter.classList.add('report-form__char-counter--error');
              counter.classList.remove('report-form__char-counter--warning');
            } else if (percentage >= 0.8) {
              counter.classList.add('report-form__char-counter--warning');
              counter.classList.remove('report-form__char-counter--error');
            } else {
              counter.classList.remove('report-form__char-counter--warning', 'report-form__char-counter--error');
            }
          } else {
            counter.textContent = `${length} characters`;
          }
        });
      }
    });
  }

  /**
   * Setup word counters
   */
  setupWordCounters() {
    const workCompleted = document.getElementById('workCompleted');
    const wordCounter = document.getElementById('workCompletedWordCounter');

    if (workCompleted && wordCounter) {
      workCompleted.addEventListener('input', () => {
        const words = this.countWords(workCompleted.value);
        const minWords = this.options.minWorkCompletedWords;

        wordCounter.textContent = `${words} words (minimum ${minWords} required)`;

        if (words < minWords) {
          wordCounter.classList.add('report-form__word-counter--insufficient');
          wordCounter.classList.remove('report-form__word-counter--valid');
        } else {
          wordCounter.classList.add('report-form__word-counter--valid');
          wordCounter.classList.remove('report-form__word-counter--insufficient');
        }
      });
    }
  }

  /**
   * Count words in text
   */
  countWords(text) {
    const trimmed = text.trim();
    if (trimmed === '') return 0;
    return trimmed.split(/\s+/).length;
  }

  /**
   * Setup priorities functionality
   */
  setupPriorities() {
    const addBtn = document.getElementById('addPriorityBtn');

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        this.addPriority();
      });
    }
  }

  /**
   * Add a new priority item
   */
  addPriority(value = '') {
    const id = Date.now();
    this.priorities.push({ id, value });

    const list = document.getElementById('prioritiesList');
    const emptyMessage = list.querySelector('.report-form__priorities-empty');
    if (emptyMessage) {
      emptyMessage.remove();
    }

    const item = document.createElement('div');
    item.className = 'report-form__priority-item';
    item.setAttribute('data-priority-id', id);
    item.innerHTML = `
      <svg class="report-form__priority-handle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
      </svg>
      <input
        type="text"
        class="report-form__priority-input"
        placeholder="Enter priority task..."
        value="${value}"
        data-priority-id="${id}"
      />
      <button type="button" class="report-form__priority-remove" data-priority-id="${id}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    `;

    list.appendChild(item);

    // Focus the new input
    const input = item.querySelector('.report-form__priority-input');
    input.focus();

    // Setup remove button
    const removeBtn = item.querySelector('.report-form__priority-remove');
    removeBtn.addEventListener('click', () => {
      this.removePriority(id);
    });

    // Save on input
    input.addEventListener('input', (e) => {
      const priority = this.priorities.find(p => p.id === id);
      if (priority) {
        priority.value = e.target.value;
      }
      this.saveDraft();
    });
  }

  /**
   * Remove a priority item
   */
  removePriority(id) {
    this.priorities = this.priorities.filter(p => p.id !== id);

    const item = document.querySelector(`[data-priority-id="${id}"].report-form__priority-item`);
    if (item) {
      item.remove();
    }

    const list = document.getElementById('prioritiesList');
    if (this.priorities.length === 0 && list) {
      list.innerHTML = '<p class="report-form__priorities-empty">No priorities added yet. Click the button below to add your first priority.</p>';
    }

    this.saveDraft();
  }

  /**
   * Setup team recognition functionality
   */
  setupTeamRecognition() {
    const memberSelect = document.getElementById('recognizedMember');
    const reasonTextarea = document.getElementById('recognitionReason');

    if (memberSelect && reasonTextarea) {
      memberSelect.addEventListener('change', () => {
        if (memberSelect.value) {
          reasonTextarea.disabled = false;
          reasonTextarea.focus();
        } else {
          reasonTextarea.disabled = true;
          reasonTextarea.value = '';
        }
      });
    }
  }

  /**
   * Save draft to localStorage
   */
  saveDraft() {
    const formData = this.getFormData();
    localStorage.setItem(this.draftKey, JSON.stringify(formData));

    const draftStatus = document.getElementById('draftStatus');
    if (draftStatus) {
      draftStatus.textContent = 'Draft saved';

      // Show "saving..." temporarily
      draftStatus.textContent = 'Saving...';
      setTimeout(() => {
        draftStatus.textContent = 'Draft saved';
      }, 500);
    }
  }

  /**
   * Load draft from localStorage
   */
  loadDraft() {
    const draft = localStorage.getItem(this.draftKey);
    if (!draft) return;

    try {
      const formData = JSON.parse(draft);

      // Populate form fields
      if (formData.workCompleted) {
        document.getElementById('workCompleted').value = formData.workCompleted;
      }
      if (formData.incidents) {
        document.getElementById('incidents').value = formData.incidents;
      }
      if (formData.helpNeeded) {
        document.getElementById('helpNeeded').value = formData.helpNeeded;
      }
      if (formData.recognizedMember) {
        document.getElementById('recognizedMember').value = formData.recognizedMember;
      }
      if (formData.recognitionReason) {
        const reasonTextarea = document.getElementById('recognitionReason');
        reasonTextarea.value = formData.recognitionReason;
        reasonTextarea.disabled = false;
      }

      // Load priorities
      if (formData.priorities && formData.priorities.length > 0) {
        formData.priorities.forEach(priority => {
          this.addPriority(priority.value);
        });
      }

      // Trigger input events to update counters
      document.querySelectorAll('textarea').forEach(textarea => {
        textarea.dispatchEvent(new Event('input'));
      });

    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }

  /**
   * Clear form
   */
  clearForm() {
    if (confirm('Are you sure you want to clear the form? This will remove all unsaved data.')) {
      document.getElementById('dailyReportForm').reset();
      this.priorities = [];

      const list = document.getElementById('prioritiesList');
      if (list) {
        list.innerHTML = '<p class="report-form__priorities-empty">No priorities added yet. Click the button below to add your first priority.</p>';
      }

      // Clear draft
      localStorage.removeItem(this.draftKey);

      // Reset recognition textarea
      const reasonTextarea = document.getElementById('recognitionReason');
      if (reasonTextarea) {
        reasonTextarea.disabled = true;
      }

      // Update counters
      document.querySelectorAll('textarea').forEach(textarea => {
        textarea.dispatchEvent(new Event('input'));
      });

      showSuccess('Form cleared successfully');
    }
  }

  /**
   * Get form data
   */
  getFormData() {
    return {
      date: this.getTodayDate(),
      events: this.events,
      workCompleted: document.getElementById('workCompleted').value,
      incidents: document.getElementById('incidents').value,
      helpNeeded: document.getElementById('helpNeeded').value,
      recognizedMember: document.getElementById('recognizedMember').value,
      recognitionReason: document.getElementById('recognitionReason').value,
      priorities: this.priorities.map(p => ({
        id: p.id,
        value: document.querySelector(`input[data-priority-id="${p.id}"]`)?.value || p.value
      }))
    };
  }

  /**
   * Validate form
   */
  validateForm() {
    const errors = [];

    // Check events count
    if (this.events.length < this.options.minEvents) {
      errors.push(`You need at least ${this.options.minEvents} recorded events to submit a report.`);
    }

    // Check work completed
    const workCompleted = document.getElementById('workCompleted').value.trim();
    const workCompletedWords = this.countWords(workCompleted);
    if (workCompletedWords < this.options.minWorkCompletedWords) {
      errors.push(`Work completed section requires at least ${this.options.minWorkCompletedWords} words.`);
    }

    // Check incidents
    const incidents = document.getElementById('incidents').value.trim();
    if (incidents.length < this.options.minIncidentsLength) {
      errors.push(`Incidents section requires at least ${this.options.minIncidentsLength} characters.`);
    }

    // Check priorities
    const filledPriorities = this.priorities.filter(p => {
      const input = document.querySelector(`input[data-priority-id="${p.id}"]`);
      return input && input.value.trim() !== '';
    });

    if (filledPriorities.length < 3) {
      errors.push('You must add at least 3 priorities for tomorrow.');
    }

    // Check recognition consistency
    const recognizedMember = document.getElementById('recognizedMember').value;
    const recognitionReason = document.getElementById('recognitionReason').value.trim();

    if (recognizedMember && !recognitionReason) {
      errors.push('Please provide a reason for the team member recognition.');
    }

    return errors;
  }

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;

    // Validate form
    const errors = this.validateForm();
    if (errors.length > 0) {
      showError(errors.join(' '));
      return;
    }

    // Check submission window
    const windowStatus = this.checkSubmissionWindow();
    if (!windowStatus.isWithinWindow) {
      showError('Report submission is only available between 3:00 PM and 11:59 PM.');
      return;
    }

    this.isSubmitting = true;
    const submitBtn = document.getElementById('submitReportBtn');
    submitBtn.classList.add('report-form__submit-btn--loading');
    submitBtn.disabled = true;

    try {
      // Get form data
      const formData = this.getFormData();

      // Submit to API
      // const response = await fetch(this.options.apiEndpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear draft
      localStorage.removeItem(this.draftKey);

      // Stop auto-save
      this.stopAutoSave();

      // Show success
      this.showSuccess(formData);

    } catch (error) {
      console.error('Error submitting report:', error);
      showError('Failed to submit report. Please try again.');

      this.isSubmitting = false;
      submitBtn.classList.remove('report-form__submit-btn--loading');
      submitBtn.disabled = false;
    }
  }

  /**
   * Show success message
   */
  showSuccess(formData) {
    const totalPoints = this.events.reduce((sum, event) => sum + event.points, 0);
    const prioritiesCount = formData.priorities.filter(p => p.value.trim() !== '').length;

    this.container.innerHTML = `
      <div class="report-form">
        <div class="report-form__header">
          <h1 class="report-form__title">Report Submitted!</h1>
          <p class="report-form__subtitle">Your daily report has been successfully submitted.</p>
        </div>

        <div class="report-form__success">
          <svg class="report-form__success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>

          <h2 class="report-form__success-title">Great Job!</h2>
          <p class="report-form__success-message">
            Your daily report has been submitted and your team lead will be notified.
          </p>

          <div class="report-form__success-stats">
            <div class="report-form__success-stat">
              <span class="report-form__success-stat-value">+${totalPoints + 10}</span>
              <span class="report-form__success-stat-label">Total Points</span>
            </div>
            <div class="report-form__success-stat">
              <span class="report-form__success-stat-value">${this.events.length}</span>
              <span class="report-form__success-stat-label">Events</span>
            </div>
            <div class="report-form__success-stat">
              <span class="report-form__success-stat-value">${prioritiesCount}</span>
              <span class="report-form__success-stat-label">Priorities</span>
            </div>
          </div>

          <button class="btn btn--primary" onclick="window.location.href='dashboard.html'">
            Back to Dashboard
          </button>
        </div>
      </div>
    `;

    showSuccess('Report submitted successfully!');
  }

  /**
   * Start auto-save timer
   */
  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      this.saveDraft();
    }, this.options.autoSaveInterval);
  }

  /**
   * Stop auto-save timer
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Destroy the component
   */
  destroy() {
    this.stopAutoSave();
    this.container.innerHTML = '';
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReportForm;
}

// Make class globally available
if (typeof window !== 'undefined') {
  window.ReportForm = ReportForm;
}
