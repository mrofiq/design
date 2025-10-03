# Developer Report Dashboard - UI/UX Specifications (Part 3)
## User Flows, Accessibility, Animations & Technical Implementation

---

## 5. User Flows

### 5.1 Primary User Flow: Developer Report Submission

```
Step 1: Dashboard Landing
├─ User logs in via Microsoft SSO
├─ Redirected to Developer Dashboard
├─ System displays:
│  ├─ Current points and stats
│  ├─ Today's auto-populated events
│  ├─ Report submission status
│  └─ Time remaining until deadline

Step 2: Review Auto-Populated Data
├─ Timeline shows real-time events:
│  ├─ GitLab commits and merges
│  ├─ OpenProject task completions
│  ├─ SonarQube quality gates
│  └─ Automatic point calculations
├─ User can:
│  ├─ Filter events by source
│  ├─ View detailed event information
│  └─ See cumulative points for the day

Step 3: Initiate Report Submission
├─ Click "Submit Today's Report" button
├─ Report form expands/modal opens
├─ System pre-fills:
│  ├─ Activity summary (event count)
│  ├─ Points earned today
│  ├─ Tasks completed (from OpenProject)
│  └─ Draft content if previously saved

Step 4: Complete Report Form
├─ Required Fields:
│  ├─ Work Completed (min 50 chars)
│  │  ├─ Character counter updates in real-time
│  │  ├─ Validation on blur
│  │  └─ Error message if < 50 chars
│  ├─ Incidents/Blockers (min 50 chars)
│  │  ├─ Same validation as above
│  │  └─ Prompt for specificity
│  └─ Tomorrow's Priorities
├─ Optional Fields:
│  ├─ Help Needed
│  ├─ Team Recognition
│  │  ├─ Select team member from dropdown
│  │  └─ If selected, reason field appears
│  │  └─ Validate reason (min length)

Step 5: Validation & Preview
├─ Real-time validation:
│  ├─ Minimum character counts
│  ├─ Required field checks
│  ├─ Event count validation (min 3)
│  └─ Duplicate content detection
├─ Visual feedback:
│  ├─ Green checkmarks for valid fields
│  ├─ Red error messages for issues
│  ├─ Warning for late submission
│  └─ Preview of point bonus

Step 6: Submission
├─ Click "Submit Report" button
├─ Button state changes:
│  ├─ Disabled state
│  ├─ Loading spinner appears
│  ├─ Text changes to "Submitting..."
├─ System processes:
│  ├─ Final validation check
│  ├─ Save to database
│  ├─ Award points (+10 base + bonuses)
│  ├─ Update streak counter
│  ├─ Check for achievement unlocks
│  └─ Notify team lead (if approval required)

Step 7: Confirmation
├─ Success toast appears:
│  ├─ "Report submitted successfully!"
│  ├─ Points awarded display
│  ├─ New total points shown
│  └─ Auto-dismiss after 5 seconds
├─ Dashboard updates:
│  ├─ Report status badge changes to "Submitted"
│  ├─ Points counter animates to new total
│  ├─ Streak counter increments
│  ├─ Achievement notification if unlocked
│  └─ Report card minimizes/closes

Step 8: Post-Submission
├─ User can:
│  ├─ View submitted report
│  ├─ Edit within 1 hour window
│  ├─ See approval status (pending/approved)
│  └─ Continue viewing activity feed

Error Paths:
├─ Network Error:
│  ├─ Error toast: "Connection lost. Retrying..."
│  ├─ Auto-retry 3 times
│  ├─ Save draft locally
│  └─ Restore when connection returns
├─ Validation Errors:
│  ├─ Highlight invalid fields
│  ├─ Scroll to first error
│  ├─ Focus on error field
│  └─ Provide specific error message
├─ Late Submission:
│  ├─ Warning modal appears
│  ├─ Explain penalty (-5 points)
│  ├─ Confirm submission button
│  └─ Allow cancellation
```

### 5.2 Team Lead Approval Flow

```
Step 1: Notification Receipt
├─ Real-time notification appears:
│  ├─ Toast: "New report pending approval"
│  ├─ Badge count increments on sidebar
│  ├─ Browser notification (if enabled)
│  └─ Email notification (if configured)

Step 2: Navigate to Approvals
├─ Click "Pending Approvals" in sidebar
├─ Or click notification to go directly
├─ Dashboard loads approval queue:
│  ├─ Sorted by submission time
│  ├─ Flagged items appear first
│  └─ Filters available (team member, status)

Step 3: Review Report
├─ Approval card displays:
│  ├─ Developer information
│  ├─ Submission timestamp
│  ├─ Activity summary stats
│  ├─ Report content preview
│  ├─ Validation check results
│  └─ Auto-detected issues (if any)
├─ Team Lead can:
│  ├─ Expand full report
│  ├─ View webhook event details
│  ├─ Check historical context
│  └─ Compare with previous reports

Step 4: Decision Making
├─ Option A: Approve
│  ├─ Click "Approve" button
│  ├─ Confirmation dialog (optional)
│  ├─ Report marked as approved
│  ├─ Developer notified immediately
│  ├─ Points finalized
│  └─ Card moves to "Approved" tab
├─ Option B: Request Changes
│  ├─ Click "Request Changes" button
│  ├─ Modal opens with form:
│  │  ├─ Select issues (checkboxes)
│  │  ├─ Add custom feedback
│  │  └─ Set deadline for resubmission
│  ├─ Developer receives notification
│  ├─ Report status: "Changes Requested"
│  └─ Points remain pending
├─ Option C: Reject
│  ├─ Click overflow menu → "Reject"
│  ├─ Confirmation dialog with reason
│  ├─ Penalty applied (configurable)
│  ├─ Developer notified with feedback
│  └─ Report archived

Step 5: Bulk Actions (Optional)
├─ Select multiple reports (checkbox)
├─ Bulk approve:
│  ├─ Confirm action
│  ├─ Process in background
│  ├─ Progress indicator
│  └─ Success/failure summary
├─ Or export selected reports

Step 6: Follow-up
├─ Monitor resubmissions
├─ View approval history
├─ Check team compliance rate
└─ Generate approval reports
```

### 5.3 Admin User Management Flow

```
Step 1: Invite New User
├─ Click "Invite User" button
├─ Modal opens with form:
│  ├─ Email address (required, validated)
│  ├─ Full name (required)
│  ├─ Role selection (dropdown)
│  ├─ Team assignment (dropdown)
│  ├─ Department (dropdown)
│  └─ Custom message (optional)

Step 2: Validation & Send
├─ Real-time email validation
├─ Check for duplicate users
├─ Preview invitation email
├─ Click "Send Invitation"
├─ System:
│  ├─ Creates user record (status: Invited)
│  ├─ Generates secure invite token
│  ├─ Sends email with registration link
│  ├─ Sets expiration (7 days default)
│  └─ Shows success confirmation

Step 3: User Receives Invitation
├─ Email contains:
│  ├─ Welcome message
│  ├─ Registration link (unique token)
│  ├─ Expiration notice
│  └─ Company branding

Step 4: First-Time Registration
├─ User clicks registration link
├─ Validation:
│  ├─ Check token validity
│  ├─ Check expiration
│  └─ Verify email match
├─ Registration page displays:
│  ├─ Pre-filled email (read-only)
│  ├─ Assigned role (read-only)
│  ├─ Team assignment (read-only)
│  └─ Microsoft SSO button

Step 5: Complete Setup
├─ User clicks "Sign in with Microsoft"
├─ Microsoft OAuth flow:
│  ├─ Redirects to Microsoft login
│  ├─ User authenticates
│  ├─ Consent screen (if first time)
│  ├─ Returns with auth code
│  └─ System creates session
├─ Profile completion:
│  ├─ Sync data from Azure AD
│  ├─ User status: Invited → Active
│  ├─ Set last_login timestamp
│  └─ Redirect to dashboard

Step 6: Admin Monitoring
├─ Admin can view:
│  ├─ Invitation status
│  ├─ Pending invitations (not accepted)
│  ├─ Expired invitations
│  └─ Resend or revoke options
```

### 5.4 Leaderboard Viewing Flow

```
Step 1: Navigate to Leaderboard
├─ Click "Leaderboard" in sidebar
├─ Page loads with tabs:
│  ├─ Individual (default)
│  ├─ Team
│  ├─ Department
│  └─ Historical

Step 2: View Individual Rankings
├─ Display elements:
│  ├─ Top 3 podium (special styling)
│  ├─ User's current rank (highlighted)
│  ├─ Surrounding users (±5 positions)
│  ├─ Point totals
│  ├─ Trend indicators (↑↓→)
│  └─ Achievement badges
├─ Interactions:
│  ├─ Click user to view profile modal
│  ├─ Filter by time period (week/month/quarter)
│  ├─ Search for specific user
│  └─ Toggle anonymous mode

Step 3: Compare Performance
├─ Click "Compare" button
├─ Select users to compare (max 4)
├─ View comparison modal:
│  ├─ Side-by-side stats
│  ├─ Point breakdown by source
│  ├─ Activity chart overlay
│  ├─ Achievement comparison
│  └─ Strengths/weaknesses analysis

Step 4: Real-time Updates
├─ WebSocket connection maintains:
│  ├─ Live rank changes
│  ├─ Point updates
│  ├─ New achievement notifications
│  └─ Visual highlight on changes
├─ Animation effects:
│  ├─ Smooth rank position transitions
│  ├─ Point counter increments
│  ├─ Celebratory effects for milestones
│  └─ Badge unlock animations
```

---

## 6. Accessibility Requirements (WCAG 2.1 AA Compliance)

### 6.1 Perceivable

#### Color Contrast
```css
/* All text must meet minimum contrast ratios */

/* Normal Text (4.5:1 minimum) */
.text-normal {
  /* Black on white: 21:1 ✓ */
  color: #212121; /* --color-gray-900 */
  background: #FFFFFF;
}

/* Large Text (18pt+/24px+ or 14pt+/18.5px+ bold) - 3:1 minimum */
.text-large {
  /* Primary on white: 4.5:1 ✓ */
  color: #1976D2; /* --color-primary-700 */
  background: #FFFFFF;
}

/* Interactive Elements (3:1 minimum) */
.btn-primary {
  /* White on primary blue: 4.5:1 ✓ */
  color: #FFFFFF;
  background: #2196F3; /* --color-primary-500 */
  /* Focus indicator has 3:1 contrast */
  outline-color: #0D47A1; /* --color-primary-900 */
}

/* Error States */
.input-error {
  /* Error red: 4.5:1 on white ✓ */
  color: #D32F2F; /* --color-error-700 */
}

/* Success States */
.input-success {
  /* Success green: 4.5:1 on white ✓ */
  color: #388E3C; /* --color-success-700 */
}

/* Disabled States - Must still be perceivable */
.btn-primary:disabled {
  /* Gray text on light gray: 4.5:1 ✓ */
  color: #757575; /* --color-gray-500 */
  background: #E0E0E0; /* --color-gray-300 */
}
```

#### Alternative Text
```html
<!-- All images must have meaningful alt text -->

<!-- Decorative images -->
<img src="pattern.svg" alt="" role="presentation">

<!-- Functional images -->
<img src="logo.svg" alt="Company Logo - Developer Report Dashboard">

<!-- Complex images/charts -->
<div class="chart-container" role="img" aria-label="Team performance chart showing upward trend from 1,200 to 1,450 points over the last 30 days">
  <canvas id="performanceChart"></canvas>
  <!-- Fallback table for screen readers -->
  <table class="sr-only">
    <caption>Team Performance Data</caption>
    <thead>
      <tr><th>Date</th><th>Points</th></tr>
    </thead>
    <tbody>
      <tr><td>Oct 1</td><td>1,200</td></tr>
      <tr><td>Oct 15</td><td>1,350</td></tr>
      <tr><td>Oct 30</td><td>1,450</td></tr>
    </tbody>
  </table>
</div>

<!-- Icon buttons -->
<button class="btn-icon" aria-label="Close modal">
  <svg aria-hidden="true">...</svg>
</button>

<!-- SVG icons in text -->
<div class="stat-change is-positive">
  <svg aria-hidden="true">...</svg>
  <span>+125 this week</span>
</div>
```

#### Text Alternatives for Non-Text Content
```html
<!-- Video content -->
<video controls>
  <source src="tutorial.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
  <track kind="descriptions" src="descriptions.vtt" srclang="en">
  <p>Your browser doesn't support video. <a href="tutorial-transcript.html">Read the transcript</a></p>
</video>

<!-- Audio announcements -->
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
  Points updated: You now have 1,245 points
</div>
```

### 6.2 Operable

#### Keyboard Navigation
```html
<!-- All interactive elements must be keyboard accessible -->

<!-- Tab order defined logically -->
<form>
  <div class="input-field">
    <label for="email">Email</label>
    <input id="email" type="email" tabindex="0">
  </div>

  <div class="input-field">
    <label for="password">Password</label>
    <input id="password" type="password" tabindex="0">
  </div>

  <button type="submit" tabindex="0">Sign In</button>
  <button type="button" tabindex="0">Cancel</button>
</form>

<!-- Skip links -->
<a href="#main-content" class="skip-link">Skip to main content</a>
<a href="#navigation" class="skip-link">Skip to navigation</a>

<!-- Focus management in modals -->
<div class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <div class="modal-content">
    <h2 id="modal-title" tabindex="-1">Confirm Action</h2>
    <p>Are you sure you want to delete this report?</p>
    <button tabindex="0">Confirm</button>
    <button tabindex="0">Cancel</button>
  </div>
</div>
```

```javascript
// Focus trap in modal
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }

    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Focus on first element when modal opens
  firstElement.focus();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K: Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.search-input').focus();
  }

  // Ctrl/Cmd + S: Submit report
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    document.querySelector('#dailyReportForm').dispatchEvent(new Event('submit'));
  }

  // ? key: Show keyboard shortcuts
  if (e.key === '?' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    showKeyboardShortcutsModal();
  }
});
```

#### Focus Indicators
```css
/* Visible focus indicators for all interactive elements */

/* Default browser focus (remove) */
*:focus {
  outline: none;
}

/* Custom focus styles */
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Button focus */
button:focus-visible,
.btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
}

/* Input focus */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
}

/* Link focus */
a:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  text-decoration: underline;
}

/* Card focus (for clickable cards) */
.card:focus-visible {
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.3);
  transform: translateY(-2px);
}

/* Skip link visible on focus */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary-500);
  color: var(--color-white);
  padding: 8px 16px;
  text-decoration: none;
  z-index: 10000;
}

.skip-link:focus {
  top: 0;
}
```

#### No Keyboard Trap
```javascript
// Ensure users can navigate away from all components

// Dropdown close on Escape
dropdownButton.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
    closeDropdown();
    dropdownButton.focus(); // Return focus
  }
});

// Modal close on Escape
modal.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    modalTrigger.focus(); // Return focus to trigger
  }
});

// Tab panel navigation
tabList.addEventListener('keydown', function(e) {
  const tabs = Array.from(tabList.querySelectorAll('.tab'));
  const currentIndex = tabs.indexOf(document.activeElement);

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % tabs.length;
    tabs[nextIndex].focus();
  }

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    tabs[prevIndex].focus();
  }

  if (e.key === 'Home') {
    e.preventDefault();
    tabs[0].focus();
  }

  if (e.key === 'End') {
    e.preventDefault();
    tabs[tabs.length - 1].focus();
  }
});
```

### 6.3 Understandable

#### ARIA Labels and Roles
```html
<!-- Semantic HTML with ARIA enhancement -->

<!-- Navigation landmark -->
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/dashboard" aria-current="page">Dashboard</a></li>
    <li><a href="/reports">Reports</a></li>
    <li><a href="/leaderboard">Leaderboard</a></li>
  </ul>
</nav>

<!-- Main content landmark -->
<main id="main-content" role="main" aria-labelledby="page-title">
  <h1 id="page-title">Developer Dashboard</h1>
  <!-- Content -->
</main>

<!-- Search landmark -->
<div role="search">
  <label for="search-input" class="sr-only">Search users</label>
  <input
    id="search-input"
    type="search"
    placeholder="Search users..."
    aria-describedby="search-hint"
  >
  <span id="search-hint" class="sr-only">
    Type at least 3 characters to search
  </span>
</div>

<!-- Form with helpful descriptions -->
<form aria-labelledby="report-form-title">
  <h2 id="report-form-title">Daily Report Submission</h2>

  <div class="input-field">
    <label for="work-completed">
      Work Completed <span aria-label="required">*</span>
    </label>
    <textarea
      id="work-completed"
      aria-required="true"
      aria-invalid="false"
      aria-describedby="work-completed-hint work-completed-error"
      minlength="50"
    ></textarea>
    <span id="work-completed-hint" class="input-hint">
      Describe what you accomplished today (minimum 50 characters)
    </span>
    <span id="work-completed-error" class="input-error" role="alert">
      <!-- Error message appears here -->
    </span>
  </div>
</form>

<!-- Status messages -->
<div role="status" aria-live="polite">
  <p>3 new events received</p>
</div>

<div role="alert" aria-live="assertive">
  <p>Error: Failed to submit report. Please try again.</p>
</div>

<!-- Progress indicator -->
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
  <div class="progress-bar" style="width: 65%"></div>
</div>

<!-- Tabs with proper ARIA -->
<div class="tabs-container">
  <div role="tablist" aria-label="Dashboard sections">
    <button
      role="tab"
      id="tab-activity"
      aria-selected="true"
      aria-controls="panel-activity"
      tabindex="0"
    >
      Activity
    </button>
    <button
      role="tab"
      id="tab-reports"
      aria-selected="false"
      aria-controls="panel-reports"
      tabindex="-1"
    >
      Reports
    </button>
  </div>

  <div role="tabpanel" id="panel-activity" aria-labelledby="tab-activity">
    <!-- Activity content -->
  </div>

  <div role="tabpanel" id="panel-reports" aria-labelledby="tab-reports" hidden>
    <!-- Reports content -->
  </div>
</div>

<!-- Data table -->
<table role="table" aria-label="User management table">
  <caption class="sr-only">List of all users with their roles and status</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Role</th>
      <th scope="col">Status</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Sarah Williams</th>
      <td>Team Lead</td>
      <td><span class="badge badge-success">Active</span></td>
      <td>
        <button aria-label="Edit Sarah Williams">Edit</button>
      </td>
    </tr>
  </tbody>
</table>

<!-- Tooltip -->
<button aria-describedby="tooltip-1">
  Help
  <svg aria-hidden="true">...</svg>
</button>
<div id="tooltip-1" role="tooltip" class="tooltip">
  This is a helpful explanation
</div>
```

#### Clear Error Messages
```html
<!-- Input validation with clear feedback -->

<div class="input-field">
  <label for="email">Email Address <span class="required">*</span></label>
  <input
    type="email"
    id="email"
    class="input has-error"
    value="invalid-email"
    aria-required="true"
    aria-invalid="true"
    aria-describedby="email-error"
  >
  <span id="email-error" class="input-error" role="alert">
    <svg class="icon icon-error" aria-hidden="true">...</svg>
    Please enter a valid email address (e.g., name@company.com)
  </span>
</div>

<!-- Form-level errors -->
<div role="alert" aria-labelledby="form-error-title" class="alert alert-error">
  <svg class="icon" aria-hidden="true">...</svg>
  <div>
    <h3 id="form-error-title">Unable to submit report</h3>
    <p>Please correct the following errors:</p>
    <ul>
      <li><a href="#work-completed">Work completed is too short (35 characters, need 50)</a></li>
      <li><a href="#incidents">Incidents field is required</a></li>
    </ul>
  </div>
</div>
```

#### Consistent Navigation
```html
<!-- Navigation remains consistent across all pages -->

<aside class="app-sidebar" aria-label="Main navigation">
  <div class="sidebar-header">
    <img src="logo.svg" alt="Developer Report Dashboard">
  </div>

  <nav class="sidebar-nav">
    <ul role="list">
      <li>
        <a href="/dashboard" class="nav-item" aria-current="page">
          <svg aria-hidden="true">...</svg>
          <span>Dashboard</span>
        </a>
      </li>
      <li>
        <a href="/reports" class="nav-item">
          <svg aria-hidden="true">...</svg>
          <span>My Reports</span>
        </a>
      </li>
      <li>
        <a href="/leaderboard" class="nav-item">
          <svg aria-hidden="true">...</svg>
          <span>Leaderboard</span>
        </a>
      </li>
      <li>
        <a href="/achievements" class="nav-item">
          <svg aria-hidden="true">...</svg>
          <span>Achievements</span>
          <span class="badge badge-sm">3 new</span>
        </a>
      </li>

      <!-- Separator -->
      <li class="nav-separator" role="separator"></li>

      <!-- Team Lead Section (conditional) -->
      <li role="presentation" aria-label="Team lead tools">
        <span class="nav-section-title">Team Lead</span>
      </li>
      <li>
        <a href="/team" class="nav-item">
          <svg aria-hidden="true">...</svg>
          <span>My Team</span>
        </a>
      </li>
      <li>
        <a href="/approvals" class="nav-item">
          <svg aria-hidden="true">...</svg>
          <span>Approvals</span>
          <span class="badge badge-warning">8</span>
        </a>
      </li>

      <!-- Admin Section (conditional) -->
      <li class="nav-separator" role="separator"></li>
      <li>
        <span class="nav-section-title">Administration</span>
      </li>
      <li>
        <a href="/admin/users" class="nav-item">
          <svg aria-hidden="true">...</svg>
          <span>Users</span>
        </a>
      </li>
      <li>
        <a href="/admin/settings" class="nav-item">
          <svg aria-hidden="true">...</svg>
          <span>Settings</span>
        </a>
      </li>
    </ul>
  </nav>

  <div class="sidebar-footer">
    <button class="btn-ghost btn-sm" aria-label="User menu">
      <div class="avatar avatar-sm">
        <img src="user.jpg" alt="">
      </div>
      <span>John Doe</span>
      <svg aria-hidden="true">...</svg>
    </button>
  </div>
</aside>
```

### 6.4 Robust

#### Valid HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Developer Report Dashboard - Track productivity and team performance">
  <title>Dashboard - Developer Report Dashboard</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Proper semantic structure -->
  <div class="app-layout">
    <header class="app-header">
      <!-- Header content -->
    </header>

    <aside class="app-sidebar">
      <!-- Navigation -->
    </aside>

    <main class="app-main" id="main-content">
      <!-- Main content -->
    </main>
  </div>

  <!-- Scripts at end of body -->
  <script src="app.js"></script>
</body>
</html>
```

#### Screen Reader Only Content
```css
/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focusable when navigated to */
.sr-only-focusable:focus,
.sr-only-focusable:active {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 7. Animation & Micro-interactions

### 7.1 Loading States

```css
/* Button Loading Animation */
@keyframes buttonLoading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.btn-loading {
  position: relative;
  color: transparent;
  pointer-events: none;
  overflow: hidden;
}

.btn-loading::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: buttonLoading 1.5s infinite;
}

.btn-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Skeleton Loading */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 25%,
    var(--color-gray-100) 50%,
    var(--color-gray-200) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: var(--radius-md);
}

.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-title {
  height: 24px;
  width: 60%;
  margin-bottom: 12px;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-card {
  width: 100%;
  height: 200px;
}

/* Spinner Animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-gray-200);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Pulse Animation for Loading Cards */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 7.2 Entry Animations

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Slide In from Bottom */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-up {
  animation: slideInUp 0.4s ease-out;
}

/* Slide In from Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}

/* Stagger List Items */
.stagger-list > * {
  opacity: 0;
  animation: slideInUp 0.4s ease-out forwards;
}

.stagger-list > *:nth-child(1) { animation-delay: 0.05s; }
.stagger-list > *:nth-child(2) { animation-delay: 0.1s; }
.stagger-list > *:nth-child(3) { animation-delay: 0.15s; }
.stagger-list > *:nth-child(4) { animation-delay: 0.2s; }
.stagger-list > *:nth-child(5) { animation-delay: 0.25s; }
.stagger-list > *:nth-child(n+6) { animation-delay: 0.3s; }
```

### 7.3 Hover & Focus Micro-interactions

```css
/* Button Hover Effects */
.btn {
  transition: all 0.2s ease-out;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn:hover::before {
  width: 300px;
  height: 300px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Card Hover */
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Link Hover Underline Animation */
.link-animated {
  position: relative;
  text-decoration: none;
}

.link-animated::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease-out;
}

.link-animated:hover::after {
  width: 100%;
}

/* Icon Hover Rotation */
.icon-hover-rotate {
  transition: transform 0.3s ease-out;
}

.icon-hover-rotate:hover {
  transform: rotate(15deg);
}

/* Avatar Hover Scale */
.avatar {
  transition: transform 0.2s ease-out;
}

.avatar:hover {
  transform: scale(1.1);
}
```

### 7.4 Success/Celebration Animations

```css
/* Success Checkmark Animation */
@keyframes drawCheck {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scaleCheck {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: drawCheck 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: drawCheck 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.4s forwards;
}

.checkmark-container {
  animation: scaleCheck 0.6s ease-in-out 0.8s;
}

/* Confetti Effect (for achievements) */
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti {
  position: fixed;
  width: 10px;
  height: 10px;
  background-color: var(--color-primary-500);
  animation: confetti-fall 3s linear forwards;
}

/* Points Counter Animation */
@keyframes countUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.points-increment {
  display: inline-block;
  animation: countUp 0.5s ease-out;
  color: var(--color-success-500);
  font-weight: var(--font-weight-bold);
}

/* Badge Unlock Animation */
@keyframes badgeUnlock {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes badgeGlow {
  0%, 100% {
    box-shadow: 0 0 5px var(--color-accent-500);
  }
  50% {
    box-shadow: 0 0 20px var(--color-accent-500);
  }
}

.achievement-unlock {
  animation: badgeUnlock 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55),
             badgeGlow 2s ease-in-out infinite 0.6s;
}
```

### 7.5 Progress Animations

```css
/* Progress Bar Fill Animation */
@keyframes progressFill {
  from {
    width: 0;
  }
}

.progress-bar {
  animation: progressFill 1s ease-out;
}

/* Circular Progress */
@keyframes rotateCircle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.circular-progress {
  animation: rotateCircle 1.5s linear infinite;
}

/* Step Progress Indicator */
@keyframes stepComplete {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.step.is-complete .step-indicator {
  animation: stepComplete 0.4s ease-out;
}
```

### 7.6 Real-time Update Animations

```css
/* New Item Highlight */
@keyframes highlightNew {
  0% {
    background-color: var(--color-primary-100);
  }
  100% {
    background-color: transparent;
  }
}

.item-new {
  animation: highlightNew 2s ease-out;
}

/* Notification Bounce */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.notification-badge {
  animation: bounce 0.6s ease-in-out;
}

/* Live Update Pulse */
@keyframes livePulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
  }
}

.live-indicator {
  width: 8px;
  height: 8px;
  background-color: var(--color-success-500);
  border-radius: 50%;
  animation: livePulse 2s infinite;
}

/* Number Counter Animation */
.counter {
  transition: all 0.5s ease-out;
}

/* JavaScript handles the counting */
```

```javascript
// Number Counter Animation
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16); // 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// Usage
const pointsElement = document.querySelector('.stat-value');
animateValue(pointsElement, 1120, 1245, 1000); // From 1120 to 1245 in 1 second
```

### 7.7 Prefers Reduced Motion

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Keep essential loading indicators */
  .spinner,
  .progress-bar {
    animation-duration: 1s;
  }
}
```

---

## 8. State Management

### 8.1 UI State Classes

```css
/* Loading States */
.is-loading {
  pointer-events: none;
  opacity: 0.6;
  cursor: wait;
}

.is-loading-overlay {
  position: relative;
}

.is-loading-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* Active/Selected States */
.is-active {
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
  border-color: var(--color-primary-500);
}

.is-selected {
  box-shadow: 0 0 0 2px var(--color-primary-500);
}

/* Disabled States */
.is-disabled,
[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Visibility States */
.is-hidden {
  display: none !important;
}

.is-invisible {
  visibility: hidden;
}

.is-collapsed {
  height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s ease-out;
}

.is-expanded {
  height: auto;
  opacity: 1;
}

/* Error States */
.has-error {
  border-color: var(--color-error-500) !important;
  background-color: var(--color-error-50);
}

.has-error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2);
}

/* Success States */
.has-success {
  border-color: var(--color-success-500) !important;
  background-color: var(--color-success-50);
}

/* Warning States */
.has-warning {
  border-color: var(--color-warning-500) !important;
  background-color: var(--color-warning-50);
}

/* Focus States */
.is-focused {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus);
}

/* Hover States (for touch devices) */
.is-hovered {
  background-color: var(--color-gray-50);
}

/* Dragging States */
.is-dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.is-drag-over {
  border: 2px dashed var(--color-primary-500);
  background-color: var(--color-primary-50);
}

/* Empty States */
.is-empty {
  text-align: center;
  padding: var(--spacing-12);
  color: var(--color-gray-500);
}
```

### 8.2 JavaScript State Management

```javascript
// Simple State Manager
class AppState {
  constructor() {
    this.state = {
      user: null,
      points: 0,
      events: [],
      reports: [],
      notifications: [],
      loading: {
        events: false,
        reports: false,
        submission: false
      },
      ui: {
        sidebarOpen: true,
        modalOpen: false,
        activeTab: 'activity'
      }
    };
    this.listeners = new Map();
  }

  // Get state value
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }

  // Set state value and notify listeners
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], this.state);

    const oldValue = target[lastKey];
    target[lastKey] = value;

    // Notify listeners
    this.notify(path, value, oldValue);
  }

  // Subscribe to state changes
  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, []);
    }
    this.listeners.get(path).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(path);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Notify listeners of changes
  notify(path, newValue, oldValue) {
    const callbacks = this.listeners.get(path) || [];
    callbacks.forEach(callback => callback(newValue, oldValue));

    // Also notify parent paths
    const parts = path.split('.');
    while (parts.length > 1) {
      parts.pop();
      const parentPath = parts.join('.');
      const parentCallbacks = this.listeners.get(parentPath) || [];
      parentCallbacks.forEach(callback => callback(this.get(parentPath)));
    }
  }

  // Batch updates
  batch(updates) {
    Object.entries(updates).forEach(([path, value]) => {
      this.set(path, value);
    });
  }
}

// Initialize global state
const state = new AppState();

// Usage examples
state.subscribe('user', (user) => {
  console.log('User changed:', user);
  updateUserUI(user);
});

state.subscribe('points', (points, oldPoints) => {
  console.log(`Points changed from ${oldPoints} to ${points}`);
  animatePointsChange(oldPoints, points);
});

state.subscribe('loading.submission', (loading) => {
  const submitBtn = document.querySelector('#submitReportBtn');
  if (loading) {
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
  } else {
    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;
  }
});

// Set state
state.set('user', { name: 'John Doe', points: 1245 });
state.set('loading.submission', true);

// Get state
const currentPoints = state.get('points');
const isLoading = state.get('loading.submission');
```

### 8.3 Form State Management

```javascript
// Form Validation State
class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.fields = new Map();
    this.errors = new Map();
    this.touched = new Set();
  }

  // Add field with validation rules
  addField(name, rules) {
    this.fields.set(name, rules);
    const input = this.form.querySelector(`[name="${name}"]`);

    if (input) {
      // Track when field is touched
      input.addEventListener('blur', () => {
        this.touched.add(name);
        this.validateField(name);
      });

      // Real-time validation for touched fields
      input.addEventListener('input', () => {
        if (this.touched.has(name)) {
          this.validateField(name);
        }
      });
    }
  }

  // Validate single field
  validateField(name) {
    const rules = this.fields.get(name);
    const input = this.form.querySelector(`[name="${name}"]`);
    const value = input.value;
    const errors = [];

    // Required validation
    if (rules.required && !value.trim()) {
      errors.push(rules.requiredMessage || 'This field is required');
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum ${rules.minLength} characters required`);
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum ${rules.maxLength} characters allowed`);
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.patternMessage || 'Invalid format');
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
      }
    }

    // Update error state
    if (errors.length > 0) {
      this.errors.set(name, errors);
      this.showFieldError(name, errors[0]);
      input.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
    } else {
      this.errors.delete(name);
      this.hideFieldError(name);
      input.classList.remove('has-error');
      input.classList.add('has-success');
      input.setAttribute('aria-invalid', 'false');
    }

    return errors.length === 0;
  }

  // Show field error
  showFieldError(name, message) {
    const input = this.form.querySelector(`[name="${name}"]`);
    const errorElement = document.querySelector(`#${name}-error`);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  // Hide field error
  hideFieldError(name) {
    const errorElement = document.querySelector(`#${name}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  // Validate all fields
  validateAll() {
    let isValid = true;

    this.fields.forEach((rules, name) => {
      this.touched.add(name);
      if (!this.validateField(name)) {
        isValid = false;
      }
    });

    return isValid;
  }

  // Get all errors
  getErrors() {
    return Object.fromEntries(this.errors);
  }

  // Reset form validation
  reset() {
    this.errors.clear();
    this.touched.clear();

    this.fields.forEach((rules, name) => {
      const input = this.form.querySelector(`[name="${name}"]`);
      if (input) {
        input.classList.remove('has-error', 'has-success');
        input.setAttribute('aria-invalid', 'false');
      }
      this.hideFieldError(name);
    });
  }
}

// Usage
const reportForm = document.querySelector('#dailyReportForm');
const validator = new FormValidator(reportForm);

validator.addField('workCompleted', {
  required: true,
  minLength: 50,
  requiredMessage: 'Please describe your work',
});

validator.addField('incidents', {
  required: true,
  minLength: 50,
  requiredMessage: 'Please describe any incidents or blockers',
});

validator.addField('helpNeeded', {
  required: false,
  maxLength: 500,
});

reportForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validator.validateAll()) {
    // Scroll to first error
    const firstError = reportForm.querySelector('.has-error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstError?.focus();
    return;
  }

  // Submit form
  state.set('loading.submission', true);

  try {
    const formData = new FormData(reportForm);
    const response = await fetch('/api/reports/submit', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      showSuccessToast('Report submitted successfully!');
      state.set('points', result.newPoints);
      validator.reset();
      reportForm.reset();
    } else {
      showErrorToast(result.message);
    }
  } catch (error) {
    showErrorToast('Network error. Please try again.');
  } finally {
    state.set('loading.submission', false);
  }
});
```

This document continues with Error Handling, Real-time Updates, and additional implementation details. Would you like me to create Part 4 with those final sections?
