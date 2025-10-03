# Developer Report Dashboard - UI/UX Web Specification

## 1. Design System Foundation

### 1.1 Color Palette
```css
/* Primary Colors */
--color-primary-50: #EFF6FF;
--color-primary-100: #DBEAFE;
--color-primary-200: #BFDBFE;
--color-primary-300: #93C5FD;
--color-primary-400: #60A5FA;
--color-primary-500: #3B82F6;  /* Main Primary */
--color-primary-600: #2563EB;
--color-primary-700: #1D4ED8;
--color-primary-800: #1E40AF;
--color-primary-900: #1E3A8A;

/* Success Colors */
--color-success-50: #F0FDF4;
--color-success-100: #DCFCE7;
--color-success-200: #BBF7D0;
--color-success-300: #86EFAC;
--color-success-400: #4ADE80;
--color-success-500: #22C55E;  /* Main Success */
--color-success-600: #16A34A;
--color-success-700: #15803D;
--color-success-800: #166534;
--color-success-900: #14532D;

/* Warning Colors */
--color-warning-50: #FFFBEB;
--color-warning-100: #FEF3C7;
--color-warning-200: #FDE68A;
--color-warning-300: #FCD34D;
--color-warning-400: #FBBF24;
--color-warning-500: #F59E0B;  /* Main Warning */
--color-warning-600: #D97706;
--color-warning-700: #B45309;
--color-warning-800: #92400E;
--color-warning-900: #78350F;

/* Error Colors */
--color-error-50: #FEF2F2;
--color-error-100: #FEE2E2;
--color-error-200: #FECACA;
--color-error-300: #FCA5A5;
--color-error-400: #F87171;
--color-error-500: #EF4444;  /* Main Error */
--color-error-600: #DC2626;
--color-error-700: #B91C1C;
--color-error-800: #991B1B;
--color-error-900: #7F1D1D;

/* Neutral Colors */
--color-neutral-0: #FFFFFF;
--color-neutral-50: #F9FAFB;
--color-neutral-100: #F3F4F6;
--color-neutral-200: #E5E7EB;
--color-neutral-300: #D1D5DB;
--color-neutral-400: #9CA3AF;
--color-neutral-500: #6B7280;
--color-neutral-600: #4B5563;
--color-neutral-700: #374151;
--color-neutral-800: #1F2937;
--color-neutral-900: #111827;

/* Gamification Colors */
--color-gold: #FFD700;
--color-silver: #C0C0C0;
--color-bronze: #CD7F32;
--color-platinum: #E5E4E2;
```

### 1.2 Typography
```css
/* Font Family */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Letter Spacing */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.02em;
```

### 1.3 Spacing System
```css
/* Based on 8px grid */
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### 1.4 Border Radius
```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

### 1.5 Shadows
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### 1.6 Animation
```css
/* Timing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Durations */
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

## 2. Component Specifications

### 2.1 Buttons
```html
<!-- Primary Button -->
<button class="btn btn-primary">
  <span class="btn-text">Submit Report</span>
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  <span class="btn-text">Cancel</span>
</button>

<!-- Success Button -->
<button class="btn btn-success">
  <svg class="btn-icon"><!-- check icon --></svg>
  <span class="btn-text">Approve</span>
</button>

<!-- Danger Button -->
<button class="btn btn-danger">
  <svg class="btn-icon"><!-- x icon --></svg>
  <span class="btn-text">Reject</span>
</button>

<!-- Loading Button -->
<button class="btn btn-primary btn-loading" disabled>
  <svg class="btn-spinner"><!-- spinner --></svg>
  <span class="btn-text">Processing...</span>
</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  border-radius: var(--radius-lg);
  transition: all var(--duration-200) var(--ease-in-out);
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  user-select: none;
}

.btn-primary {
  background-color: var(--color-primary-600);
  color: var(--color-neutral-0);
  border: 1px solid var(--color-primary-600);
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.btn-spinner {
  animation: spin 1s linear infinite;
  width: 16px;
  height: 16px;
  margin-right: var(--space-2);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 2.2 Form Inputs
```html
<!-- Text Input -->
<div class="form-group">
  <label for="email" class="form-label">Email Address</label>
  <input
    type="email"
    id="email"
    class="form-input"
    placeholder="john.doe@company.com"
    required
  />
  <span class="form-error">Please enter a valid email address</span>
</div>

<!-- Textarea -->
<div class="form-group">
  <label for="incidents" class="form-label">
    Incidents Encountered
    <span class="form-required">*</span>
  </label>
  <textarea
    id="incidents"
    class="form-textarea"
    rows="4"
    minlength="50"
    placeholder="Describe any incidents (min 50 characters)..."
  ></textarea>
  <span class="form-hint">0/50 characters minimum</span>
</div>

<!-- Select Dropdown -->
<div class="form-group">
  <label for="team-member" class="form-label">Recognize Team Member</label>
  <select id="team-member" class="form-select">
    <option value="">Select a team member...</option>
    <option value="1">John Doe</option>
    <option value="2">Jane Smith</option>
  </select>
</div>
```

```css
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
  margin-bottom: var(--space-2);
}

.form-required {
  color: var(--color-error-500);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-lg);
  background-color: var(--color-neutral-0);
  transition: all var(--duration-200) var(--ease-in-out);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:invalid,
.form-textarea:invalid {
  border-color: var(--color-error-500);
}

.form-error {
  display: none;
  font-size: var(--text-sm);
  color: var(--color-error-600);
  margin-top: var(--space-1);
}

.form-input:invalid ~ .form-error {
  display: block;
}

.form-hint {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin-top: var(--space-1);
}
```

### 2.3 Cards
```html
<!-- Stat Card -->
<div class="card card-stat">
  <div class="card-icon">
    <svg><!-- trophy icon --></svg>
  </div>
  <div class="card-content">
    <h3 class="card-value">1,234</h3>
    <p class="card-label">Total Points</p>
    <span class="card-trend card-trend-up">
      <svg><!-- arrow up --></svg>
      12.5%
    </span>
  </div>
</div>

<!-- Activity Card -->
<div class="card card-activity">
  <div class="card-header">
    <h3 class="card-title">Recent Activity</h3>
    <button class="card-action">View All</button>
  </div>
  <div class="card-body">
    <div class="activity-item">
      <div class="activity-icon activity-icon-commit">
        <svg><!-- git icon --></svg>
      </div>
      <div class="activity-content">
        <p class="activity-text">Pushed 3 commits to main branch</p>
        <span class="activity-time">2 minutes ago</span>
      </div>
      <span class="activity-points">+6</span>
    </div>
  </div>
</div>

<!-- Leaderboard Card -->
<div class="card card-leaderboard">
  <div class="card-header">
    <h3 class="card-title">Team Leaderboard</h3>
    <select class="card-filter">
      <option>This Week</option>
      <option>This Month</option>
    </select>
  </div>
  <div class="card-body">
    <div class="leaderboard-item">
      <span class="leaderboard-rank">1</span>
      <img src="avatar.jpg" class="leaderboard-avatar" alt="User">
      <div class="leaderboard-info">
        <p class="leaderboard-name">John Doe</p>
        <p class="leaderboard-team">Frontend Team</p>
      </div>
      <span class="leaderboard-score">2,450</span>
    </div>
  </div>
</div>
```

```css
.card {
  background-color: var(--color-neutral-0);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
  transition: all var(--duration-300) var(--ease-in-out);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.card-stat {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: var(--color-neutral-0);
  border-radius: var(--radius-lg);
}

.card-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  margin: 0;
}

.card-label {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin: var(--space-1) 0;
}

.card-trend {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
}

.card-trend-up {
  color: var(--color-success-700);
  background-color: var(--color-success-50);
}

.card-trend-down {
  color: var(--color-error-700);
  background-color: var(--color-error-50);
}
```

## 3. Layout Components

### 3.1 Navigation Sidebar
```html
<nav class="sidebar">
  <div class="sidebar-header">
    <img src="logo.svg" alt="DevReport" class="sidebar-logo">
    <h2 class="sidebar-title">DevReport</h2>
  </div>

  <div class="sidebar-user">
    <img src="avatar.jpg" alt="User" class="sidebar-avatar">
    <div class="sidebar-user-info">
      <p class="sidebar-user-name">John Doe</p>
      <p class="sidebar-user-role">Developer</p>
    </div>
  </div>

  <ul class="sidebar-nav">
    <li class="sidebar-item">
      <a href="#" class="sidebar-link sidebar-link-active">
        <svg class="sidebar-icon"><!-- dashboard icon --></svg>
        <span>Dashboard</span>
      </a>
    </li>
    <li class="sidebar-item">
      <a href="#" class="sidebar-link">
        <svg class="sidebar-icon"><!-- report icon --></svg>
        <span>Daily Report</span>
        <span class="sidebar-badge">!</span>
      </a>
    </li>
    <li class="sidebar-item">
      <a href="#" class="sidebar-link">
        <svg class="sidebar-icon"><!-- trophy icon --></svg>
        <span>Leaderboard</span>
      </a>
    </li>
  </ul>

  <div class="sidebar-footer">
    <div class="sidebar-points">
      <p class="sidebar-points-label">Your Points</p>
      <p class="sidebar-points-value">1,234</p>
      <div class="sidebar-points-progress">
        <div class="progress-bar" style="width: 68%"></div>
      </div>
      <p class="sidebar-points-next">366 to next level</p>
    </div>
  </div>
</nav>
```

```css
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: var(--color-neutral-900);
  color: var(--color-neutral-100);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.sidebar-header {
  padding: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid var(--color-neutral-800);
}

.sidebar-logo {
  width: 32px;
  height: 32px;
}

.sidebar-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin: 0;
}

.sidebar-user {
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background-color: var(--color-neutral-800);
}

.sidebar-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4) 0;
  list-style: none;
  margin: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  color: var(--color-neutral-400);
  text-decoration: none;
  transition: all var(--duration-200) var(--ease-in-out);
}

.sidebar-link:hover {
  background-color: var(--color-neutral-800);
  color: var(--color-neutral-100);
}

.sidebar-link-active {
  background-color: var(--color-primary-900);
  color: var(--color-primary-300);
  border-left: 3px solid var(--color-primary-500);
}
```

### 3.2 Main Dashboard Layout
```html
<div class="dashboard-container">
  <!-- Sidebar -->
  <nav class="sidebar">...</nav>

  <!-- Main Content -->
  <main class="dashboard-main">
    <!-- Top Bar -->
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="page-title">Developer Dashboard</h1>
        <p class="page-subtitle">Thursday, October 2, 2025</p>
      </div>
      <div class="header-right">
        <button class="notification-button">
          <svg><!-- bell icon --></svg>
          <span class="notification-count">3</span>
        </button>
        <button class="btn btn-primary">Submit Report</button>
      </div>
    </header>

    <!-- Dashboard Grid -->
    <div class="dashboard-grid">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="card card-stat">...</div>
        <div class="card card-stat">...</div>
        <div class="card card-stat">...</div>
        <div class="card card-stat">...</div>
      </div>

      <!-- Main Content Area -->
      <div class="content-row">
        <div class="content-main">
          <!-- Activity Feed -->
          <div class="card card-activity">...</div>
        </div>
        <div class="content-sidebar">
          <!-- Leaderboard -->
          <div class="card card-leaderboard">...</div>
          <!-- Achievements -->
          <div class="card card-achievements">...</div>
        </div>
      </div>
    </div>
  </main>
</div>
```

```css
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-neutral-50);
}

.dashboard-main {
  flex: 1;
  margin-left: 280px; /* Sidebar width */
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) var(--space-8);
  background-color: var(--color-neutral-0);
  border-bottom: 1px solid var(--color-neutral-200);
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  margin: 0;
}

.page-subtitle {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin: var(--space-1) 0 0;
}

.dashboard-grid {
  padding: var(--space-8);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.content-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-6);
}

@media (max-width: 1280px) {
  .content-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .dashboard-main {
    margin-left: 0;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }
}
```

## 4. Page Specifications

### 4.1 Login Page
```html
<div class="login-container">
  <div class="login-split login-left">
    <div class="login-content">
      <img src="logo.svg" alt="DevReport" class="login-logo">
      <h1 class="login-title">Developer Report Dashboard</h1>
      <p class="login-subtitle">Track performance. Earn points. Level up your development.</p>

      <div class="login-features">
        <div class="login-feature">
          <svg class="feature-icon"><!-- check --></svg>
          <span>Real-time activity tracking</span>
        </div>
        <div class="login-feature">
          <svg class="feature-icon"><!-- check --></svg>
          <span>Gamified achievements</span>
        </div>
        <div class="login-feature">
          <svg class="feature-icon"><!-- check --></svg>
          <span>Team collaboration tools</span>
        </div>
      </div>
    </div>
  </div>

  <div class="login-split login-right">
    <div class="login-form-container">
      <h2 class="login-form-title">Welcome Back</h2>
      <p class="login-form-subtitle">Sign in to access your dashboard</p>

      <button class="sso-button">
        <svg class="sso-icon"><!-- Microsoft logo --></svg>
        <span>Sign in with Microsoft</span>
      </button>

      <div class="login-divider">
        <span>OR</span>
      </div>

      <form class="login-form">
        <div class="form-group">
          <label for="login-email" class="form-label">Email</label>
          <input type="email" id="login-email" class="form-input" required>
        </div>
        <div class="form-group">
          <label for="login-password" class="form-label">Password</label>
          <input type="password" id="login-password" class="form-input" required>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Sign In</button>
      </form>
    </div>
  </div>
</div>
```

```css
.login-container {
  display: flex;
  min-height: 100vh;
}

.login-split {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
}

.login-left {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
  color: var(--color-neutral-0);
}

.login-right {
  background-color: var(--color-neutral-50);
}

.login-logo {
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-6);
}

.login-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
}

.sso-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  background-color: var(--color-neutral-0);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
  cursor: pointer;
  transition: all var(--duration-200) var(--ease-in-out);
}

.sso-button:hover {
  background-color: var(--color-neutral-50);
  border-color: var(--color-neutral-300);
}
```

### 4.2 Daily Report Form
```html
<div class="report-container">
  <div class="report-header">
    <h2 class="report-title">Daily Report</h2>
    <p class="report-date">Thursday, October 2, 2025</p>
  </div>

  <form class="report-form">
    <!-- Auto-populated Events -->
    <div class="report-section">
      <h3 class="section-title">Today's Activity</h3>
      <div class="events-summary">
        <div class="event-item">
          <svg class="event-icon event-icon-commit"><!-- git icon --></svg>
          <span class="event-text">5 commits pushed</span>
          <span class="event-points">+10</span>
        </div>
        <div class="event-item">
          <svg class="event-icon event-icon-review"><!-- review icon --></svg>
          <span class="event-text">2 code reviews</span>
          <span class="event-points">+6</span>
        </div>
        <div class="event-item">
          <svg class="event-icon event-icon-task"><!-- task icon --></svg>
          <span class="event-text">3 tasks completed</span>
          <span class="event-points">+30</span>
        </div>
      </div>
    </div>

    <!-- Work Summary -->
    <div class="report-section">
      <h3 class="section-title">Work Completed</h3>
      <textarea
        class="form-textarea"
        placeholder="Summarize your work for today..."
        rows="4"
        required
      ></textarea>
    </div>

    <!-- Incidents -->
    <div class="report-section">
      <h3 class="section-title">Incidents Encountered</h3>
      <textarea
        class="form-textarea"
        placeholder="Describe any blockers or issues (min 50 characters)..."
        minlength="50"
        rows="3"
        required
      ></textarea>
      <span class="character-count">0/50</span>
    </div>

    <!-- Team Recognition -->
    <div class="report-section">
      <h3 class="section-title">Team Recognition</h3>
      <select class="form-select">
        <option value="">Select team member to recognize...</option>
        <option value="1">John Doe</option>
        <option value="2">Jane Smith</option>
      </select>
      <textarea
        class="form-textarea mt-3"
        placeholder="Why are you recognizing them?"
        rows="2"
      ></textarea>
    </div>

    <!-- Tomorrow's Priorities -->
    <div class="report-section">
      <h3 class="section-title">Tomorrow's Priorities</h3>
      <div class="priority-list">
        <div class="priority-item">
          <input type="text" class="form-input" placeholder="Priority 1">
        </div>
        <div class="priority-item">
          <input type="text" class="form-input" placeholder="Priority 2">
        </div>
        <div class="priority-item">
          <input type="text" class="form-input" placeholder="Priority 3">
        </div>
      </div>
      <button type="button" class="btn btn-secondary btn-sm">Add Priority</button>
    </div>

    <!-- Submit Actions -->
    <div class="report-actions">
      <button type="button" class="btn btn-secondary">Save Draft</button>
      <button type="submit" class="btn btn-primary">Submit Report</button>
    </div>
  </form>
</div>
```

### 4.3 Leaderboard Page
```html
<div class="leaderboard-page">
  <!-- Filters -->
  <div class="leaderboard-filters">
    <div class="filter-tabs">
      <button class="tab tab-active">Individual</button>
      <button class="tab">Teams</button>
      <button class="tab">Departments</button>
    </div>
    <div class="filter-controls">
      <select class="form-select">
        <option>This Week</option>
        <option>This Month</option>
        <option>This Quarter</option>
        <option>All Time</option>
      </select>
    </div>
  </div>

  <!-- Top Performers -->
  <div class="top-performers">
    <div class="performer performer-gold">
      <div class="performer-rank">1</div>
      <img src="avatar1.jpg" alt="" class="performer-avatar">
      <h3 class="performer-name">Alice Johnson</h3>
      <p class="performer-team">Frontend Team</p>
      <p class="performer-score">4,250</p>
      <div class="performer-badges">
        <span class="badge badge-gold">Quality Champion</span>
        <span class="badge">Early Bird</span>
      </div>
    </div>
    <div class="performer performer-silver">
      <div class="performer-rank">2</div>
      <!-- Similar structure -->
    </div>
    <div class="performer performer-bronze">
      <div class="performer-rank">3</div>
      <!-- Similar structure -->
    </div>
  </div>

  <!-- Full Leaderboard Table -->
  <div class="leaderboard-table-container">
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Developer</th>
          <th>Team</th>
          <th>Points</th>
          <th>Streak</th>
          <th>Trend</th>
        </tr>
      </thead>
      <tbody>
        <tr class="leaderboard-row">
          <td class="rank">4</td>
          <td class="developer">
            <img src="avatar.jpg" alt="" class="avatar-sm">
            <span>Bob Smith</span>
          </td>
          <td>Backend Team</td>
          <td class="points">3,890</td>
          <td class="streak">
            <svg class="streak-icon"><!-- fire --></svg>
            15 days
          </td>
          <td class="trend trend-up">
            <svg><!-- arrow up --></svg>
            +12%
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

## 5. Interactive Components

### 5.1 Modal Dialog
```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">Submit Daily Report</h3>
      <button class="modal-close">
        <svg><!-- x icon --></svg>
      </button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to submit your daily report? This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Submit Report</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn var(--duration-200) var(--ease-out);
}

.modal {
  background-color: var(--color-neutral-0);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  animation: slideUp var(--duration-300) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5.2 Toast Notifications
```html
<div class="toast-container">
  <div class="toast toast-success">
    <svg class="toast-icon"><!-- check circle --></svg>
    <div class="toast-content">
      <p class="toast-title">Report Submitted</p>
      <p class="toast-message">Your daily report has been successfully submitted.</p>
    </div>
    <button class="toast-close">
      <svg><!-- x icon --></svg>
    </button>
  </div>
</div>
```

```css
.toast-container {
  position: fixed;
  top: var(--space-8);
  right: var(--space-8);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  min-width: 300px;
  max-width: 500px;
  padding: var(--space-4);
  background-color: var(--color-neutral-0);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  animation: slideInRight var(--duration-300) var(--ease-out);
}

.toast-success {
  border-left: 4px solid var(--color-success-500);
}

.toast-error {
  border-left: 4px solid var(--color-error-500);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 5.3 Progress Indicators
```html
<!-- Linear Progress -->
<div class="progress">
  <div class="progress-bar" style="width: 75%">
    <span class="progress-label">75%</span>
  </div>
</div>

<!-- Circular Progress -->
<div class="progress-circle">
  <svg class="progress-circle-svg" viewBox="0 0 100 100">
    <circle class="progress-circle-bg" cx="50" cy="50" r="45"></circle>
    <circle class="progress-circle-fill" cx="50" cy="50" r="45"
            stroke-dasharray="283" stroke-dashoffset="71"></circle>
  </svg>
  <div class="progress-circle-text">75%</div>
</div>

<!-- Step Progress -->
<div class="progress-steps">
  <div class="step step-completed">
    <div class="step-circle">1</div>
    <div class="step-label">Profile Setup</div>
  </div>
  <div class="step step-active">
    <div class="step-circle">2</div>
    <div class="step-label">Team Assignment</div>
  </div>
  <div class="step">
    <div class="step-circle">3</div>
    <div class="step-label">First Report</div>
  </div>
</div>
```

## 6. Real-time Updates

### 6.1 WebSocket Connection
```javascript
class RealtimeConnection {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.sendHeartbeat();
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.ws.onclose = () => {
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  handleMessage(data) {
    switch(data.type) {
      case 'POINTS_UPDATE':
        this.updatePoints(data.payload);
        break;
      case 'NEW_EVENT':
        this.addActivityEvent(data.payload);
        break;
      case 'LEADERBOARD_UPDATE':
        this.updateLeaderboard(data.payload);
        break;
      case 'NOTIFICATION':
        this.showNotification(data.payload);
        break;
    }
  }

  updatePoints(data) {
    const pointsElement = document.querySelector('.sidebar-points-value');
    if (pointsElement) {
      const currentPoints = parseInt(pointsElement.textContent);
      const newPoints = data.points;

      // Animate the points change
      this.animateNumber(pointsElement, currentPoints, newPoints, 1000);

      // Show point change indicator
      this.showPointChange(newPoints - currentPoints);
    }
  }

  animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.round(current).toLocaleString();
    }, 16);
  }

  showPointChange(change) {
    const indicator = document.createElement('div');
    indicator.className = `point-indicator ${change > 0 ? 'positive' : 'negative'}`;
    indicator.textContent = `${change > 0 ? '+' : ''}${change}`;
    document.body.appendChild(indicator);

    setTimeout(() => {
      indicator.remove();
    }, 3000);
  }

  sendHeartbeat() {
    setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
      }
    }, 30000); // Every 30 seconds
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      this.showConnectionError();
    }
  }

  showConnectionError() {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.innerHTML = `
      <svg class="toast-icon"><!-- error icon --></svg>
      <div class="toast-content">
        <p class="toast-title">Connection Lost</p>
        <p class="toast-message">Unable to connect to server. Please refresh the page.</p>
      </div>
    `;
    document.querySelector('.toast-container').appendChild(toast);
  }
}

// Initialize connection
const realtime = new RealtimeConnection();
realtime.connect();
```

## 7. Responsive Design

### 7.1 Breakpoints
```css
/* Mobile First Approach */

/* Small devices (phones, 640px and up) */
@media (min-width: 640px) {
  .container { max-width: 640px; }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container { max-width: 768px; }
  .sidebar { display: block; }
  .mobile-menu { display: none; }
}

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) {
  .container { max-width: 1024px; }
  .dashboard-grid { grid-template-columns: repeat(3, 1fr); }
}

/* X-Large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
  .content-row { grid-template-columns: 2fr 1fr; }
}

/* 2X-Large devices (larger desktops, 1536px and up) */
@media (min-width: 1536px) {
  .container { max-width: 1536px; }
  .stats-row { grid-template-columns: repeat(4, 1fr); }
}
```

### 7.2 Mobile Navigation
```html
<!-- Mobile Header -->
<header class="mobile-header">
  <button class="mobile-menu-toggle">
    <svg><!-- menu icon --></svg>
  </button>
  <img src="logo.svg" alt="DevReport" class="mobile-logo">
  <button class="mobile-notification">
    <svg><!-- bell icon --></svg>
    <span class="notification-count">3</span>
  </button>
</header>

<!-- Mobile Bottom Navigation -->
<nav class="mobile-nav">
  <a href="#" class="mobile-nav-item mobile-nav-item-active">
    <svg><!-- home icon --></svg>
    <span>Home</span>
  </a>
  <a href="#" class="mobile-nav-item">
    <svg><!-- report icon --></svg>
    <span>Report</span>
  </a>
  <a href="#" class="mobile-nav-item">
    <svg><!-- trophy icon --></svg>
    <span>Leaderboard</span>
  </a>
  <a href="#" class="mobile-nav-item">
    <svg><!-- user icon --></svg>
    <span>Profile</span>
  </a>
</nav>
```

```css
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--color-neutral-0);
  border-bottom: 1px solid var(--color-neutral-200);
  padding: 0 var(--space-4);
  align-items: center;
  justify-content: space-between;
  z-index: 999;
}

.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--color-neutral-0);
  border-top: 1px solid var(--color-neutral-200);
  padding: 0 var(--space-2);
  align-items: center;
  justify-content: space-around;
  z-index: 999;
}

@media (max-width: 767px) {
  .mobile-header,
  .mobile-nav {
    display: flex;
  }

  .sidebar {
    display: none;
  }

  .dashboard-main {
    margin-left: 0;
    padding-top: 56px;
    padding-bottom: 56px;
  }
}
```

## 8. Accessibility

### 8.1 ARIA Attributes
```html
<!-- Navigation -->
<nav role="navigation" aria-label="Main navigation">
  <ul role="list">
    <li role="listitem">
      <a href="#" aria-current="page">Dashboard</a>
    </li>
  </ul>
</nav>

<!-- Forms -->
<form role="form" aria-labelledby="report-title">
  <h2 id="report-title">Daily Report</h2>
  <div class="form-group">
    <label for="incidents" id="incidents-label">
      Incidents Encountered
      <span aria-label="required">*</span>
    </label>
    <textarea
      id="incidents"
      aria-labelledby="incidents-label"
      aria-describedby="incidents-hint"
      aria-required="true"
    ></textarea>
    <span id="incidents-hint" class="form-hint">
      Minimum 50 characters required
    </span>
  </div>
</form>

<!-- Progress -->
<div role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <span class="sr-only">75% complete</span>
</div>

<!-- Live Regions -->
<div aria-live="polite" aria-atomic="true" class="toast-container">
  <!-- Toast notifications appear here -->
</div>

<div aria-live="assertive" aria-atomic="true" class="error-container">
  <!-- Error messages appear here -->
</div>
```

### 8.2 Keyboard Navigation
```javascript
// Focus Management
class FocusManager {
  constructor() {
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape key closes modals
      if (e.key === 'Escape') {
        this.closeActiveModal();
      }

      // Tab trap for modals
      if (e.key === 'Tab' && this.isModalOpen()) {
        this.handleModalTabbing(e);
      }

      // Arrow key navigation for menus
      if (e.key.startsWith('Arrow')) {
        this.handleArrowNavigation(e);
      }
    });
  }

  handleModalTabbing(e) {
    const modal = document.querySelector('.modal');
    const focusableContent = modal.querySelectorAll(this.focusableElements);
    const firstFocusable = focusableContent[0];
    const lastFocusable = focusableContent[focusableContent.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  handleArrowNavigation(e) {
    const menu = document.activeElement.closest('[role="menu"]');
    if (!menu) return;

    const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
    const currentIndex = items.indexOf(document.activeElement);

    let nextIndex;
    switch(e.key) {
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      default:
        return;
    }

    items[nextIndex].focus();
    e.preventDefault();
  }

  closeActiveModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
      // Return focus to trigger element
      if (this.modalTrigger) {
        this.modalTrigger.focus();
      }
    }
  }
}

// Initialize
const focusManager = new FocusManager();
```

## 9. Performance Optimization

### 9.1 Lazy Loading
```javascript
// Image lazy loading
class LazyLoader {
  constructor() {
    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
        }
      });
    });

    this.initializeLazyImages();
  }

  initializeLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  loadImage(img) {
    img.src = img.dataset.src;
    img.classList.add('loaded');
    this.imageObserver.unobserve(img);
  }
}

// Component lazy loading
class ComponentLoader {
  async loadLeaderboard() {
    const module = await import('./components/leaderboard.js');
    return module.default;
  }

  async loadChart() {
    const module = await import('./components/chart.js');
    return module.default;
  }
}
```

### 9.2 Virtual Scrolling
```javascript
class VirtualScroller {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 1;

    this.setupScroller();
  }

  setupScroller() {
    // Create viewport
    this.viewport = document.createElement('div');
    this.viewport.style.height = `${this.items.length * this.itemHeight}px`;

    // Create visible window
    this.window = document.createElement('div');
    this.window.style.transform = 'translateY(0)';

    this.container.appendChild(this.viewport);
    this.viewport.appendChild(this.window);

    this.container.addEventListener('scroll', () => {
      this.handleScroll();
    });

    this.render();
  }

  handleScroll() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = startIndex + this.visibleItems;

    this.renderItems(startIndex, endIndex);
    this.window.style.transform = `translateY(${startIndex * this.itemHeight}px)`;
  }

  renderItems(start, end) {
    this.window.innerHTML = '';

    for (let i = start; i < Math.min(end, this.items.length); i++) {
      const item = this.createItemElement(this.items[i]);
      this.window.appendChild(item);
    }
  }

  createItemElement(data) {
    const element = document.createElement('div');
    element.className = 'list-item';
    element.style.height = `${this.itemHeight}px`;
    element.innerHTML = `
      <span>${data.rank}</span>
      <span>${data.name}</span>
      <span>${data.points}</span>
    `;
    return element;
  }
}
```

## 10. State Management

### 10.1 Application State
```javascript
class AppState {
  constructor() {
    this.state = {
      user: null,
      points: 0,
      events: [],
      leaderboard: [],
      notifications: [],
      report: {
        draft: false,
        submitted: false,
        data: {}
      }
    };

    this.subscribers = new Map();
    this.loadFromLocalStorage();
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  setState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;

    // Notify subscribers
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        callback(value, oldValue);
      });
    }

    // Save to localStorage
    this.saveToLocalStorage();
  }

  getState(key) {
    return this.state[key];
  }

  saveToLocalStorage() {
    localStorage.setItem('appState', JSON.stringify(this.state));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('appState');
    if (saved) {
      this.state = { ...this.state, ...JSON.parse(saved) };
    }
  }
}

// Global state instance
const appState = new AppState();

// Usage example
appState.subscribe('points', (newPoints, oldPoints) => {
  console.log(`Points changed from ${oldPoints} to ${newPoints}`);
  updatePointsDisplay(newPoints);
});

appState.setState('points', 1234);
```

## 11. Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Setup project structure
- [ ] Implement design system (colors, typography, spacing)
- [ ] Create base components (buttons, inputs, cards)
- [ ] Setup responsive grid system
- [ ] Implement login page with SSO

### Phase 2: Core Features (Week 3-4)
- [ ] Build dashboard layouts (Developer, Team Lead, Admin)
- [ ] Implement navigation system
- [ ] Create activity feed component
- [ ] Build points display system
- [ ] Setup WebSocket connection

### Phase 3: Reporting (Week 5)
- [ ] Create daily report form
- [ ] Implement form validation
- [ ] Add auto-population from webhooks
- [ ] Build submission workflow
- [ ] Add draft saving functionality

### Phase 4: Gamification (Week 6)
- [ ] Implement leaderboard views
- [ ] Create achievement system
- [ ] Add streak tracking
- [ ] Build level progression
- [ ] Create badge displays

### Phase 5: Real-time Features (Week 7)
- [ ] Setup real-time updates
- [ ] Implement notifications
- [ ] Add live point changes
- [ ] Create event streaming
- [ ] Build connection management

### Phase 6: Polish & Testing (Week 8)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Documentation

## 12. Browser Support

### Minimum Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari iOS 14+
- Chrome Android 90+

### Progressive Enhancement
```javascript
// Feature detection
if ('IntersectionObserver' in window) {
  // Use lazy loading
} else {
  // Load all images immediately
}

if ('WebSocket' in window) {
  // Use real-time updates
} else {
  // Use polling fallback
}

if (CSS.supports('display', 'grid')) {
  // Use CSS Grid
} else {
  // Use flexbox fallback
}
```

---

This specification provides a complete blueprint for implementing the Developer Report Dashboard as an HTML prototype. All measurements, colors, and interactions are precisely defined for direct implementation.