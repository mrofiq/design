/**
 * Routes.js - Application Route Definitions
 *
 * Define all application routes and their handlers
 */

// Import will be handled by app.js
// Routes configuration
const routes = [
  {
    path: '/',
    name: 'home',
    handler: async (to, from) => {
      // Redirect to dashboard if authenticated, otherwise to login
      if (window.app && window.app.auth.check()) {
        window.app.router.navigate('/dashboard');
      } else {
        window.app.router.navigate('/login');
      }
    },
    meta: {
      title: 'Home',
      requiresAuth: false
    }
  },

  {
    path: '/login',
    name: 'login',
    handler: async (to, from) => {
      await loadPage('login');
    },
    meta: {
      title: 'Login - Developer Report Dashboard',
      requiresAuth: false,
      layout: 'auth'
    }
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    handler: async (to, from) => {
      await loadPage('dashboard');
    },
    guards: [requireAuth],
    meta: {
      title: 'Dashboard - Developer Report Dashboard',
      requiresAuth: true,
      roles: ['developer', 'team_lead', 'admin']
    }
  },

  {
    path: '/reports',
    name: 'reports',
    handler: async (to, from) => {
      await loadPage('reports');
    },
    guards: [requireAuth],
    meta: {
      title: 'Report History - Developer Report Dashboard',
      requiresAuth: true,
      roles: ['developer', 'team_lead', 'admin']
    }
  },

  {
    path: '/leaderboard',
    name: 'leaderboard',
    handler: async (to, from) => {
      await loadPage('leaderboard');
    },
    guards: [requireAuth],
    meta: {
      title: 'Leaderboard - Developer Report Dashboard',
      requiresAuth: true,
      roles: ['developer', 'team_lead', 'admin']
    }
  },

  {
    path: '/achievements',
    name: 'achievements',
    handler: async (to, from) => {
      await loadPage('achievements');
    },
    guards: [requireAuth],
    meta: {
      title: 'Achievements - Developer Report Dashboard',
      requiresAuth: true,
      roles: ['developer', 'team_lead', 'admin']
    }
  },

  {
    path: '/team',
    name: 'team',
    handler: async (to, from) => {
      await loadPage('team');
    },
    guards: [requireAuth, requireRole(['team_lead', 'admin'])],
    meta: {
      title: 'Team Dashboard - Developer Report Dashboard',
      requiresAuth: true,
      roles: ['team_lead', 'admin']
    }
  },

  {
    path: '/admin',
    name: 'admin',
    handler: async (to, from) => {
      await loadPage('admin');
    },
    guards: [requireAuth, requireRole(['admin'])],
    meta: {
      title: 'Admin Dashboard - Developer Report Dashboard',
      requiresAuth: true,
      roles: ['admin']
    }
  },

  {
    path: '/profile',
    name: 'profile',
    handler: async (to, from) => {
      await loadPage('profile');
    },
    guards: [requireAuth],
    meta: {
      title: 'Profile - Developer Report Dashboard',
      requiresAuth: true
    }
  },

  {
    path: '/settings',
    name: 'settings',
    handler: async (to, from) => {
      await loadPage('settings');
    },
    guards: [requireAuth],
    meta: {
      title: 'Settings - Developer Report Dashboard',
      requiresAuth: true
    }
  },

  {
    path: '/activities',
    name: 'activities',
    handler: async (to, from) => {
      await loadPage('activities');
    },
    guards: [requireAuth],
    meta: {
      title: 'Activities - Developer Report Dashboard',
      requiresAuth: true
    }
  },

  {
    path: '/analytics',
    name: 'analytics',
    handler: async (to, from) => {
      await loadPage('analytics');
    },
    guards: [requireAuth, requireRole(['team_lead', 'admin'])],
    meta: {
      title: 'Analytics - Developer Report Dashboard',
      requiresAuth: true,
      roles: ['team_lead', 'admin']
    }
  }
];

/**
 * Navigation Guard: Require Authentication
 */
function requireAuth(to, from, next) {
  if (!window.app || !window.app.auth.check()) {
    // Not authenticated, redirect to login
    return '/login';
  }
  return true;
}

/**
 * Navigation Guard: Require Role
 */
function requireRole(roles) {
  return (to, from, next) => {
    if (!window.app || !window.app.auth.check()) {
      return '/login';
    }

    const user = window.app.auth.getUser();
    if (!user || !roles.includes(user.role)) {
      // Unauthorized, redirect to dashboard
      if (window.app.toast) {
        window.app.toast.show({
          type: 'error',
          title: 'Access Denied',
          message: 'You do not have permission to access this page.'
        });
      }
      return '/dashboard';
    }

    return true;
  };
}

/**
 * Load page content
 */
async function loadPage(pageName) {
  const main = document.getElementById('main-content');
  if (!main) return;

  // Show loading state
  showLoading();

  try {
    // Check if page loader exists
    if (window.pages && window.pages[pageName]) {
      // Use page loader
      await window.pages[pageName](main);
    } else {
      // Load page HTML dynamically
      const response = await fetch(`/pages/${pageName}.html`);
      if (response.ok) {
        const html = await response.text();
        main.innerHTML = html;

        // Initialize page-specific scripts
        if (window[`init${capitalize(pageName)}`]) {
          window[`init${capitalize(pageName)}`]();
        }
      } else {
        throw new Error(`Page not found: ${pageName}`);
      }
    }

    // Update page title
    updatePageTitle(pageName);

    // Hide loading
    hideLoading();

  } catch (error) {
    console.error('Error loading page:', error);
    main.innerHTML = `
      <div class="error-state">
        <h2>Error Loading Page</h2>
        <p>Sorry, we couldn't load this page. Please try again.</p>
        <button class="btn-primary" onclick="location.reload()">Reload</button>
      </div>
    `;
    hideLoading();
  }
}

/**
 * Show loading indicator
 */
function showLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
  }
}

/**
 * Hide loading indicator
 */
function hideLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Update page title
 */
function updatePageTitle(pageName) {
  const route = routes.find(r => r.name === pageName);
  if (route && route.meta.title) {
    document.title = route.meta.title;
  }
}

/**
 * Capitalize string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Page Loaders - Define page rendering logic
 */
window.pages = {
  /**
   * Login Page
   */
  login: async (container) => {
    container.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo">
              <svg class="logo" width="48" height="48" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="8" fill="currentColor"/>
              </svg>
            </div>
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form class="auth-form" id="loginForm">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-input"
                placeholder="you@example.com"
                required
                autocomplete="email"
              >
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                class="form-input"
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              >
            </div>

            <div class="form-group form-group-horizontal">
              <label class="checkbox-label">
                <input type="checkbox" id="remember" name="remember" class="form-checkbox">
                <span>Remember me</span>
              </label>
              <a href="#/forgot-password" class="link">Forgot password?</a>
            </div>

            <button type="submit" class="btn-primary btn-block" id="loginBtn">
              Sign In
            </button>

            <div class="auth-divider">
              <span>Demo Accounts</span>
            </div>

            <div class="demo-accounts">
              <button type="button" class="btn-secondary btn-sm" data-demo="developer">
                Developer
              </button>
              <button type="button" class="btn-secondary btn-sm" data-demo="team_lead">
                Team Lead
              </button>
              <button type="button" class="btn-secondary btn-sm" data-demo="admin">
                Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Initialize login form
    initLoginForm();
  },

  /**
   * Dashboard Page
   */
  dashboard: async (container) => {
    const user = window.app.auth.getUser();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Welcome back, ${user?.name || 'Developer'}!</p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" onclick="window.app.router.navigate('/reports')">
            Submit Report
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-card-primary">
          <div class="stat-content">
            <div class="stat-label">Total Points</div>
            <div class="stat-value">${user?.points || 0}</div>
            <div class="stat-change is-positive">
              <svg class="icon" width="16" height="16">
                <path d="M12 5l-7 7-4-4" stroke="currentColor" fill="none" stroke-width="2"/>
              </svg>
              <span>Start earning points</span>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-success">
          <div class="stat-content">
            <div class="stat-label">Current Streak</div>
            <div class="stat-value">${user?.streak || 0} days</div>
            <div class="stat-change is-neutral">
              <span>Keep it going!</span>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-accent">
          <div class="stat-content">
            <div class="stat-label">Team Rank</div>
            <div class="stat-value">-</div>
            <div class="stat-change is-neutral">
              <span>Submit reports to rank</span>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-gradient">
          <div class="stat-content">
            <div class="stat-label">Level</div>
            <div class="stat-value">${user?.level || 'Junior'}</div>
            <div class="progress progress-sm">
              <div class="progress-bar" style="width: 0%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Activity</h3>
          </div>
          <div class="card-body">
            <p class="text-muted">No recent activity. Start submitting reports!</p>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Placeholder for other pages
   */
  reports: async (container) => {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Report History</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Reports page coming soon...</p>
        </div>
      </div>
    `;
  },

  leaderboard: async (container) => {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Leaderboard</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Leaderboard page coming soon...</p>
        </div>
      </div>
    `;
  },

  achievements: async (container) => {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Achievements</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Achievements page coming soon...</p>
        </div>
      </div>
    `;
  },

  team: async (container) => {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Team Dashboard</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Team dashboard page coming soon...</p>
        </div>
      </div>
    `;
  },

  admin: async (container) => {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Admin Dashboard</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Admin dashboard page coming soon...</p>
        </div>
      </div>
    `;
  },

  profile: async (container) => {
    const user = window.app.auth.getUser();
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Profile</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="profile-info">
            <div class="avatar avatar-xl">
              <span>${user?.name?.charAt(0) || 'U'}</span>
            </div>
            <h2>${user?.name || 'User'}</h2>
            <p class="text-muted">${user?.email || ''}</p>
            <p class="badge badge-primary">${user?.role || 'developer'}</p>
          </div>
        </div>
      </div>
    `;
  },

  settings: async (container) => {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Settings page coming soon...</p>
        </div>
      </div>
    `;
  },

  activities: async (container) => {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Activities</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Activities page coming soon...</p>
        </div>
      </div>
    `;
  },

  analytics: async (container) => {
    container.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Analytics</h1>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Analytics page coming soon...</p>
        </div>
      </div>
    `;
  }
};

/**
 * Initialize login form
 */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  const demoButtons = document.querySelectorAll('[data-demo]');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = form.email.value;
      const password = form.password.value;
      const remember = form.remember.checked;

      const result = await window.app.auth.login({ email, password }, remember);

      if (result.success) {
        window.app.router.navigate('/dashboard');
      } else {
        if (window.app.toast) {
          window.app.toast.show({
            type: 'error',
            title: 'Login Failed',
            message: result.error || 'Invalid credentials'
          });
        }
      }
    });
  }

  // Demo account buttons
  demoButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const role = btn.dataset.demo;
      const email = `${role}@example.com`;
      const password = 'demo123';

      const result = await window.app.auth.login({ email, password }, true);

      if (result.success) {
        window.app.router.navigate('/dashboard');
      }
    });
  });
}

// Export routes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { routes };
} else {
  window.appRoutes = routes;
}
