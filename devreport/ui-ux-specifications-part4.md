# Developer Report Dashboard - UI/UX Specifications (Part 4)
## Error Handling, Real-time Updates & Implementation Guide

---

## 9. Error Handling & Validation

### 9.1 Error Message Patterns

```javascript
// Centralized Error Messages
const ERROR_MESSAGES = {
  // Network Errors
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error occurred. Our team has been notified.',

  // Authentication Errors
  AUTH_REQUIRED: 'Please sign in to continue.',
  AUTH_EXPIRED: 'Your session has expired. Please sign in again.',
  AUTH_FORBIDDEN: 'You don\'t have permission to perform this action.',

  // Validation Errors
  REQUIRED_FIELD: (field) => `${field} is required`,
  MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field, max) => `${field} must be no more than ${max} characters`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_FORMAT: (field) => `${field} format is invalid`,

  // Business Logic Errors
  DUPLICATE_SUBMISSION: 'You have already submitted a report for today',
  INSUFFICIENT_EVENTS: 'You need at least 3 events to submit a report',
  SUBMISSION_WINDOW_CLOSED: 'Report submission window has closed for today',
  DEADLINE_PASSED: 'The deadline for today\'s report has passed',

  // Data Errors
  NOT_FOUND: 'The requested resource was not found',
  ALREADY_EXISTS: 'This item already exists',
  CONFLICT: 'This action conflicts with existing data',
};

// Error Display Functions
function showErrorToast(message, options = {}) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-error';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');

  toast.innerHTML = `
    <div class="toast-icon">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
      </svg>
    </div>
    <div class="toast-content">
      <div class="toast-title">Error</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close notification">
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>
  `;

  const container = document.querySelector('.toast-container');
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('toast-entering');
  });

  // Close button
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  // Auto dismiss
  const duration = options.duration || 5000;
  setTimeout(() => removeToast(toast), duration);

  // Announce to screen readers
  announceToScreenReader(message);
}

function showErrorModal(title, message, options = {}) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'error-modal-title');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="modal error-modal">
      <div class="modal-header">
        <h2 id="error-modal-title" class="modal-title">
          <svg class="icon icon-error" width="24" height="24">
            <circle cx="12" cy="12" r="10" fill="var(--color-error-500)"/>
            <path d="M12 7v6M12 15h.01" stroke="white" stroke-width="2"/>
          </svg>
          ${title}
        </h2>
        <button class="modal-close" aria-label="Close dialog">
          <svg width="20" height="20">
            <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p>${message}</p>
        ${options.details ? `<div class="error-details">${options.details}</div>` : ''}
        ${options.actions ? `
          <div class="error-actions">
            ${options.actions.map(action => `
              <button class="btn-secondary" data-action="${action.id}">
                ${action.label}
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn-primary" data-action="close">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  trapFocus(modal);

  // Close handlers
  modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
  modal.querySelector('[data-action="close"]').addEventListener('click', () => closeModal(modal));

  // Custom action handlers
  if (options.actions) {
    options.actions.forEach(action => {
      const btn = modal.querySelector(`[data-action="${action.id}"]`);
      if (btn) {
        btn.addEventListener('click', () => {
          action.handler();
          closeModal(modal);
        });
      }
    });
  }

  // Focus first element
  setTimeout(() => modal.querySelector('.modal-close').focus(), 100);
}

function showInlineError(fieldName, message) {
  const input = document.querySelector(`[name="${fieldName}"]`);
  const errorElement = document.querySelector(`#${fieldName}-error`);

  if (input) {
    input.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${fieldName}-error`);
  }

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.setAttribute('role', 'alert');
  }
}

function clearInlineError(fieldName) {
  const input = document.querySelector(`[name="${fieldName}"]`);
  const errorElement = document.querySelector(`#${fieldName}-error`);

  if (input) {
    input.classList.remove('has-error');
    input.setAttribute('aria-invalid', 'false');
  }

  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}
```

### 9.2 API Error Handling

```javascript
// API Error Handler
class APIError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}

// Centralized API Client
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle different status codes
      if (response.status === 401) {
        // Unauthorized - redirect to login
        this.handleUnauthorized();
        throw new APIError(
          ERROR_MESSAGES.AUTH_EXPIRED,
          'UNAUTHORIZED'
        );
      }

      if (response.status === 403) {
        // Forbidden
        throw new APIError(
          ERROR_MESSAGES.AUTH_FORBIDDEN,
          'FORBIDDEN'
        );
      }

      if (response.status === 404) {
        throw new APIError(
          ERROR_MESSAGES.NOT_FOUND,
          'NOT_FOUND'
        );
      }

      if (response.status === 422) {
        // Validation error
        const data = await response.json();
        throw new APIError(
          'Validation failed',
          'VALIDATION_ERROR',
          data.errors
        );
      }

      if (response.status >= 500) {
        // Server error
        throw new APIError(
          ERROR_MESSAGES.SERVER_ERROR,
          'SERVER_ERROR'
        );
      }

      if (!response.ok) {
        const data = await response.json();
        throw new APIError(
          data.message || 'Request failed',
          data.code || 'UNKNOWN_ERROR',
          data
        );
      }

      // Success - return data
      return await response.json();

    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Network errors
      if (error.name === 'TypeError') {
        throw new APIError(
          ERROR_MESSAGES.NETWORK_ERROR,
          'NETWORK_ERROR'
        );
      }

      // Timeout errors
      if (error.name === 'AbortError') {
        throw new APIError(
          ERROR_MESSAGES.TIMEOUT_ERROR,
          'TIMEOUT'
        );
      }

      // Unknown errors
      throw new APIError(
        'An unexpected error occurred',
        'UNKNOWN_ERROR',
        error
      );
    }
  }

  handleUnauthorized() {
    // Clear auth token
    localStorage.removeItem('auth_token');

    // Redirect to login
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
  }

  // HTTP Methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Usage
const api = new APIClient('/api');

// Submit report with error handling
async function submitReport(formData) {
  try {
    state.set('loading.submission', true);

    const result = await api.post('/reports/submit', {
      workCompleted: formData.get('workCompleted'),
      incidents: formData.get('incidents'),
      helpNeeded: formData.get('helpNeeded'),
      recognitionUserId: formData.get('teamRecognition'),
      recognitionReason: formData.get('recognitionReason'),
      tomorrowPlan: formData.get('tomorrowPlan'),
    });

    // Success
    showSuccessToast('Report submitted successfully!');
    state.set('points', result.newPoints);
    state.set('reports', [...state.get('reports'), result.report]);

    // Update UI
    updateDashboard();

    return result;

  } catch (error) {
    if (error instanceof APIError) {
      if (error.code === 'VALIDATION_ERROR') {
        // Display validation errors
        Object.entries(error.details).forEach(([field, messages]) => {
          showInlineError(field, messages[0]);
        });
        showErrorToast('Please correct the errors in the form');

      } else if (error.code === 'DUPLICATE_SUBMISSION') {
        showErrorModal(
          'Report Already Submitted',
          'You have already submitted your report for today.',
          {
            actions: [
              {
                id: 'view-report',
                label: 'View Report',
                handler: () => navigateToReports()
              }
            ]
          }
        );

      } else if (error.code === 'SUBMISSION_WINDOW_CLOSED') {
        showErrorModal(
          'Submission Window Closed',
          'The submission window for today has closed. Please contact your team lead if you need to submit a late report.'
        );

      } else {
        showErrorToast(error.message);
      }
    } else {
      showErrorToast('An unexpected error occurred. Please try again.');
      console.error('Unexpected error:', error);
    }

    return null;

  } finally {
    state.set('loading.submission', false);
  }
}
```

### 9.3 Retry Mechanism

```javascript
// Retry with exponential backoff
async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    onRetry = null,
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Don't retry certain errors
      if (error instanceof APIError) {
        const nonRetryableCodes = ['VALIDATION_ERROR', 'FORBIDDEN', 'NOT_FOUND'];
        if (nonRetryableCodes.includes(error.code)) {
          throw error;
        }
      }

      // Wait before retrying
      if (onRetry) {
        onRetry(attempt + 1, delay);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  throw lastError;
}

// Usage
async function loadEvents() {
  try {
    const events = await retryWithBackoff(
      () => api.get('/events/today'),
      {
        maxRetries: 3,
        onRetry: (attempt, delay) => {
          console.log(`Retry attempt ${attempt}, waiting ${delay}ms`);
          showRetryToast(attempt, delay);
        }
      }
    );

    state.set('events', events);

  } catch (error) {
    showErrorToast('Failed to load events after multiple attempts');
  }
}

function showRetryToast(attempt, delay) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-info';
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">Connection Issue</div>
      <div class="toast-message">Retrying... (Attempt ${attempt})</div>
    </div>
  `;

  const container = document.querySelector('.toast-container');
  container.appendChild(toast);

  setTimeout(() => removeToast(toast), delay);
}
```

---

## 10. Real-time Updates

### 10.1 WebSocket Connection

```javascript
// WebSocket Manager
class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.handlers = new Map();
    this.heartbeatInterval = null;
    this.isIntentionallyClosed = false;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isIntentionallyClosed = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;

      // Start heartbeat
      this.startHeartbeat();

      // Authenticate
      this.send('auth', {
        token: localStorage.getItem('auth_token')
      });

      // Notify connection status
      this.emit('connection', { status: 'connected' });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.stopHeartbeat();

      if (!this.isIntentionallyClosed) {
        this.emit('connection', { status: 'disconnected' });
        this.attemptReconnect();
      }
    };
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('connection', { status: 'failed' });
      showErrorToast('Lost connection to server. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnecting... (Attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);

    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping');
      }
    }, 30000); // Every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  send(type, data = {}) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  handleMessage(message) {
    const { type, data } = message;

    // Handle pong responses
    if (type === 'pong') {
      return;
    }

    // Emit event to handlers
    this.emit(type, data);
  }

  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  emit(event, data) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
}

// Initialize WebSocket
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
const ws = new WebSocketManager(wsUrl);

// Connect on page load
ws.connect();

// Disconnect on page unload
window.addEventListener('beforeunload', () => {
  ws.disconnect();
});
```

### 10.2 Real-time Event Handlers

```javascript
// Handle real-time events
ws.on('event.created', (event) => {
  console.log('New event:', event);

  // Add event to state
  const events = state.get('events');
  state.set('events', [event, ...events]);

  // Update UI
  addEventToTimeline(event);

  // Update points
  if (event.points !== 0) {
    updatePointsWithAnimation(event.points);
  }

  // Show notification
  if (event.points > 0) {
    showSuccessToast(`+${event.points} points: ${event.title}`);
  }
});

ws.on('points.updated', (data) => {
  console.log('Points updated:', data);

  const oldPoints = state.get('points');
  state.set('points', data.newPoints);

  // Animate points change
  animatePointsChange(oldPoints, data.newPoints);

  // Check for level up
  if (data.levelUp) {
    showLevelUpNotification(data.newLevel);
  }

  // Check for achievements
  if (data.achievementsUnlocked?.length > 0) {
    data.achievementsUnlocked.forEach(achievement => {
      showAchievementNotification(achievement);
    });
  }
});

ws.on('report.approved', (data) => {
  console.log('Report approved:', data);

  showSuccessToast('Your report has been approved!');

  // Update report status in UI
  updateReportStatus(data.reportId, 'approved');
});

ws.on('report.changes_requested', (data) => {
  console.log('Changes requested:', data);

  showWarningModal(
    'Changes Requested',
    'Your team lead has requested changes to your report.',
    {
      details: data.feedback,
      actions: [
        {
          id: 'edit',
          label: 'Edit Report',
          handler: () => editReport(data.reportId)
        }
      ]
    }
  );
});

ws.on('leaderboard.updated', (data) => {
  console.log('Leaderboard updated:', data);

  // Update leaderboard data
  state.set('leaderboard', data.leaderboard);

  // If user's rank changed significantly, show notification
  const currentRank = data.leaderboard.findIndex(
    item => item.userId === state.get('user.id')
  ) + 1;

  const previousRank = state.get('user.rank');

  if (previousRank && Math.abs(currentRank - previousRank) >= 3) {
    if (currentRank < previousRank) {
      showSuccessToast(`You moved up to rank #${currentRank}!`);
    } else {
      showInfoToast(`Your rank changed to #${currentRank}`);
    }
  }

  state.set('user.rank', currentRank);
});

ws.on('notification', (notification) => {
  console.log('Notification received:', notification);

  // Add to notifications state
  const notifications = state.get('notifications');
  state.set('notifications', [notification, ...notifications]);

  // Show toast if important
  if (notification.priority === 'high') {
    showNotificationToast(notification);
  }

  // Update notification badge
  updateNotificationBadge();
});

ws.on('connection', (data) => {
  if (data.status === 'connected') {
    console.log('Connected to real-time updates');
    hideConnectionWarning();
  } else if (data.status === 'disconnected') {
    console.log('Disconnected from real-time updates');
    showConnectionWarning();
  } else if (data.status === 'failed') {
    console.log('Connection failed');
    showConnectionError();
  }
});
```

### 10.3 Optimistic UI Updates

```javascript
// Optimistic UI update strategy
async function submitReportOptimistic(formData) {
  // Generate temporary ID
  const tempId = `temp-${Date.now()}`;

  // Create optimistic report object
  const optimisticReport = {
    id: tempId,
    userId: state.get('user.id'),
    date: new Date().toISOString(),
    workCompleted: formData.get('workCompleted'),
    incidents: formData.get('incidents'),
    status: 'pending',
    _optimistic: true,
  };

  // Immediately update UI
  const reports = state.get('reports');
  state.set('reports', [optimisticReport, ...reports]);

  // Update UI to show success
  showSuccessToast('Report submitted successfully!');
  closeReportForm();

  try {
    // Send to server
    const result = await api.post('/reports/submit', {
      workCompleted: formData.get('workCompleted'),
      incidents: formData.get('incidents'),
      helpNeeded: formData.get('helpNeeded'),
      recognitionUserId: formData.get('teamRecognition'),
      recognitionReason: formData.get('recognitionReason'),
      tomorrowPlan: formData.get('tomorrowPlan'),
    });

    // Replace optimistic report with real data
    const updatedReports = reports.map(r =>
      r.id === tempId ? result.report : r
    );
    state.set('reports', updatedReports);

    // Update points
    state.set('points', result.newPoints);

  } catch (error) {
    // Rollback optimistic update
    const rolledBackReports = reports.filter(r => r.id !== tempId);
    state.set('reports', rolledBackReports);

    // Show error
    showErrorToast('Failed to submit report. Please try again.');
    reopenReportForm(formData);
  }
}
```

### 10.4 Connection Status Indicator

```html
<!-- Connection Status Component -->
<div class="connection-status" id="connectionStatus">
  <div class="connection-status-indicator" data-status="connected">
    <svg class="icon" width="16" height="16">
      <circle cx="8" cy="8" r="4" fill="currentColor"/>
    </svg>
    <span class="connection-status-text">Connected</span>
  </div>
</div>
```

```css
/* Connection Status Styles */
.connection-status {
  position: fixed;
  bottom: var(--spacing-4);
  right: var(--spacing-4);
  z-index: var(--z-index-notification);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.connection-status.is-visible {
  opacity: 1;
}

.connection-status-indicator {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--color-white);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  font-size: var(--font-size-sm);
}

.connection-status-indicator[data-status="connected"] {
  color: var(--color-success-700);
  border: 1px solid var(--color-success-200);
}

.connection-status-indicator[data-status="connected"] .icon {
  animation: pulse 2s infinite;
}

.connection-status-indicator[data-status="disconnected"] {
  color: var(--color-error-700);
  border: 1px solid var(--color-error-200);
  background-color: var(--color-error-50);
}

.connection-status-indicator[data-status="reconnecting"] {
  color: var(--color-warning-700);
  border: 1px solid var(--color-warning-200);
  background-color: var(--color-warning-50);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

```javascript
// Connection Status Manager
function showConnectionWarning() {
  const status = document.getElementById('connectionStatus');
  const indicator = status.querySelector('.connection-status-indicator');

  indicator.setAttribute('data-status', 'disconnected');
  indicator.querySelector('.connection-status-text').textContent = 'Connection lost';

  status.classList.add('is-visible');
}

function showReconnecting() {
  const status = document.getElementById('connectionStatus');
  const indicator = status.querySelector('.connection-status-indicator');

  indicator.setAttribute('data-status', 'reconnecting');
  indicator.querySelector('.connection-status-text').textContent = 'Reconnecting...';

  status.classList.add('is-visible');
}

function hideConnectionWarning() {
  const status = document.getElementById('connectionStatus');
  const indicator = status.querySelector('.connection-status-indicator');

  indicator.setAttribute('data-status', 'connected');
  indicator.querySelector('.connection-status-text').textContent = 'Connected';

  // Hide after 3 seconds
  setTimeout(() => {
    status.classList.remove('is-visible');
  }, 3000);
}
```

---

## 11. Performance Optimization

### 11.1 Lazy Loading

```javascript
// Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.getAttribute('data-src');

      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    }
  });
}, {
  rootMargin: '50px' // Load images 50px before they enter viewport
});

// Observe all lazy images
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Lazy load components
async function loadComponent(name) {
  const module = await import(`./components/${name}.js`);
  return module.default;
}

// Usage
document.querySelector('#leaderboardTab').addEventListener('click', async () => {
  const leaderboard = await loadComponent('Leaderboard');
  leaderboard.render(document.querySelector('#leaderboardPanel'));
});
```

### 11.2 Virtual Scrolling

```javascript
// Virtual scrolling for long lists
class VirtualList {
  constructor(container, items, options = {}) {
    this.container = container;
    this.items = items;
    this.itemHeight = options.itemHeight || 60;
    this.visibleCount = Math.ceil(container.clientHeight / this.itemHeight) + 2;
    this.startIndex = 0;

    this.init();
  }

  init() {
    // Create viewport
    this.viewport = document.createElement('div');
    this.viewport.style.height = `${this.items.length * this.itemHeight}px`;
    this.viewport.style.position = 'relative';

    // Create content container
    this.content = document.createElement('div');
    this.content.style.position = 'absolute';
    this.content.style.top = '0';
    this.content.style.left = '0';
    this.content.style.right = '0';

    this.viewport.appendChild(this.content);
    this.container.appendChild(this.viewport);

    // Setup scroll listener
    this.container.addEventListener('scroll', () => this.handleScroll());

    // Initial render
    this.render();
  }

  handleScroll() {
    const scrollTop = this.container.scrollTop;
    const newStartIndex = Math.floor(scrollTop / this.itemHeight);

    if (newStartIndex !== this.startIndex) {
      this.startIndex = newStartIndex;
      this.render();
    }
  }

  render() {
    const endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.items.length
    );

    const visibleItems = this.items.slice(this.startIndex, endIndex);

    this.content.style.transform = `translateY(${this.startIndex * this.itemHeight}px)`;
    this.content.innerHTML = visibleItems.map((item, index) => {
      return this.renderItem(item, this.startIndex + index);
    }).join('');
  }

  renderItem(item, index) {
    // Override this method to customize item rendering
    return `
      <div class="list-item" style="height: ${this.itemHeight}px">
        ${item.name}
      </div>
    `;
  }

  updateItems(items) {
    this.items = items;
    this.viewport.style.height = `${items.length * this.itemHeight}px`;
    this.render();
  }
}

// Usage
const leaderboardList = new VirtualList(
  document.querySelector('#leaderboardContainer'),
  leaderboardData,
  {
    itemHeight: 72,
    renderItem: (item, index) => `
      <div class="leaderboard-item" style="height: 72px">
        <div class="leaderboard-rank">${index + 1}</div>
        <div class="avatar avatar-sm">
          <img src="${item.avatar}" alt="${item.name}">
        </div>
        <div class="leaderboard-info">
          <span class="leaderboard-name">${item.name}</span>
          <span class="leaderboard-points">${item.points} pts</span>
        </div>
      </div>
    `
  }
);
```

### 11.3 Debouncing & Throttling

```javascript
// Debounce function
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;

  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: Debounce search input
const searchInput = document.querySelector('#searchInput');
const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Usage: Throttle scroll events
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### 11.4 Resource Hints

```html
<!-- Resource Hints in HTML -->
<head>
  <!-- Preconnect to API server -->
  <link rel="preconnect" href="https://api.company.com">
  <link rel="dns-prefetch" href="https://api.company.com">

  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/css/critical.css" as="style">
  <link rel="preload" href="/js/app.js" as="script">

  <!-- Prefetch next likely navigation -->
  <link rel="prefetch" href="/dashboard">
  <link rel="prefetch" href="/reports">

  <!-- Prerender leaderboard (if user frequently visits) -->
  <link rel="prerender" href="/leaderboard">
</head>
```

---

## 12. Implementation Checklist

### 12.1 Pre-Development

- [ ] Design system tokens documented
- [ ] Component library specifications complete
- [ ] User flows mapped
- [ ] Accessibility requirements reviewed
- [ ] API endpoints documented
- [ ] Database schema finalized
- [ ] Development environment setup

### 12.2 Core Features

- [ ] Authentication & Authorization
  - [ ] Microsoft SSO integration
  - [ ] Session management
  - [ ] Role-based access control
  - [ ] Logout functionality

- [ ] User Management (Admin)
  - [ ] User invitation system
  - [ ] User listing & search
  - [ ] Role assignment
  - [ ] User deactivation

- [ ] Dashboard (Developer)
  - [ ] Points display
  - [ ] Activity feed
  - [ ] Report submission form
  - [ ] Achievements panel
  - [ ] Leaderboard preview

- [ ] Dashboard (Team Lead)
  - [ ] Team overview
  - [ ] Report approval queue
  - [ ] Team performance charts
  - [ ] Alerts panel

- [ ] Dashboard (Admin)
  - [ ] System health metrics
  - [ ] Webhook configuration
  - [ ] Point rules management
  - [ ] System logs

- [ ] Webhook Integration
  - [ ] GitLab webhook handler
  - [ ] OpenProject webhook handler
  - [ ] SonarQube webhook handler
  - [ ] Event processing queue
  - [ ] Point calculation engine

- [ ] Reporting System
  - [ ] Daily report form
  - [ ] Report validation
  - [ ] Auto-population from events
  - [ ] Report submission
  - [ ] Report history

- [ ] Leaderboards
  - [ ] Individual leaderboard
  - [ ] Team leaderboard
  - [ ] Department leaderboard
  - [ ] Time period filters
  - [ ] Real-time updates

- [ ] Gamification
  - [ ] Points calculation
  - [ ] Achievement system
  - [ ] Streak tracking
  - [ ] Level progression
  - [ ] Badge unlocks

- [ ] Notifications
  - [ ] Email notifications
  - [ ] In-app notifications
  - [ ] Real-time updates
  - [ ] Notification preferences

### 12.3 Testing

- [ ] Unit tests for components
- [ ] Integration tests for API
- [ ] End-to-end tests for user flows
- [ ] Accessibility testing (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Performance testing
- [ ] Security testing

### 12.4 Production Readiness

- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics integrated (Google Analytics, etc.)
- [ ] Performance monitoring (New Relic, etc.)
- [ ] CDN configured for static assets
- [ ] SSL/TLS certificates
- [ ] Database backups automated
- [ ] Deployment pipeline setup
- [ ] Documentation complete
- [ ] Training materials prepared

---

## 13. Browser Support

### Minimum Browser Versions
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Android 90+

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced features with JavaScript enabled
- Graceful degradation for older browsers

### Polyfills Required
- Intersection Observer (for older browsers)
- ResizeObserver (for older browsers)
- CSS Grid (IE11 if required)

---

*End of UI/UX Specifications Document*

**Document Summary:**
- Part 1: Design System Foundation & Component Library
- Part 2: Team Lead/Admin Dashboards & Advanced Components
- Part 3: User Flows & Accessibility (WCAG 2.1 AA)
- Part 4: Error Handling, Real-time Updates & Implementation Guide

This comprehensive specification provides everything needed for a frontend developer to build the Developer Report Dashboard prototype in HTML/CSS/JavaScript.
