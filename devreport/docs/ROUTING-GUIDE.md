# Routing & Authentication Guide

Complete guide to the Developer Report Dashboard routing system and authentication flow.

## Table of Contents

- [Overview](#overview)
- [Router System](#router-system)
- [Authentication](#authentication)
- [Routes Configuration](#routes-configuration)
- [Usage Examples](#usage-examples)
- [Testing](#testing)

## Overview

The Developer Report Dashboard uses a custom lightweight client-side routing system with built-in authentication and role-based access control.

### Key Features

- **Hash-based routing** - SPA navigation without page reloads
- **Route parameters** - Dynamic route segments (e.g., `/user/:id`)
- **Query string support** - Parse and use URL query parameters
- **Navigation guards** - Protect routes with authentication checks
- **Role-based access** - Restrict routes by user role
- **Route transitions** - Smooth animations between pages
- **404 handling** - Custom not-found page
- **Event system** - Listen to route changes and auth events

## Router System

### Core Files

```
/js/router.js      # Router implementation
/js/routes.js      # Route definitions and page loaders
/js/auth.js        # Authentication manager
/js/app.js         # Main application entry point
```

### Router Class

The `Router` class handles all client-side navigation:

```javascript
// Initialize router
const router = new Router({
  mode: 'hash',          // 'hash' or 'history'
  transition: true,      // Enable route transitions
  scrollToTop: true      // Scroll to top on route change
});

// Register a route
router.register('/dashboard', async (to, from) => {
  // Route handler
  console.log('Navigating to dashboard');
}, {
  name: 'dashboard',
  meta: { requiresAuth: true }
});

// Navigate programmatically
router.navigate('/dashboard');
```

### Route Parameters

Support for dynamic route segments:

```javascript
// Define route with parameter
router.register('/user/:id', async (to, from) => {
  const userId = to.params.id;
  console.log('User ID:', userId);
});

// Navigate with parameter
router.navigate('/user/123');
```

### Query Strings

Automatic query string parsing:

```javascript
// URL: #/search?q=test&page=2
router.register('/search', async (to, from) => {
  console.log(to.query.q);      // 'test'
  console.log(to.query.page);   // '2'
});
```

### Navigation Guards

Protect routes with custom logic:

```javascript
// Global guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.check()) {
    return '/login'; // Redirect to login
  }
  return true; // Allow navigation
});

// Route-specific guard
router.register('/admin', handler, {
  guards: [
    (to, from, next) => {
      if (!auth.hasRole('admin')) {
        return '/dashboard'; // Redirect
      }
      return true;
    }
  ]
});
```

### Events

Listen to routing events:

```javascript
// Before route change
router.on('beforeRouteChange', ({ to, from }) => {
  console.log('Navigating from', from?.path, 'to', to.path);
});

// After route change
router.on('afterRouteChange', ({ to, from }) => {
  console.log('Route changed to', to.path);
});

// Route error
router.on('routeError', ({ error, to, from }) => {
  console.error('Navigation error:', error);
});
```

## Authentication

### AuthManager Class

Manages authentication state and user sessions:

```javascript
// Initialize
const auth = new AuthManager({
  storageKey: 'devreport_auth',
  tokenKey: 'devreport_token',
  rememberDuration: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Login
const result = await auth.login({
  email: 'user@example.com',
  password: 'password'
}, remember = true);

if (result.success) {
  console.log('Logged in:', result.user);
}

// Check authentication
if (auth.check()) {
  const user = auth.getUser();
  console.log('Current user:', user);
}

// Logout
auth.logout();
```

### Role-Based Access

```javascript
// Check user role
if (auth.hasRole('admin')) {
  // Admin only code
}

if (auth.hasRole(['team_lead', 'admin'])) {
  // Team lead or admin code
}

// Check permission
if (auth.hasPermission('manage_users')) {
  // Code for users with permission
}
```

### Auth Events

```javascript
// Listen to login
auth.on('login', ({ user }) => {
  console.log('User logged in:', user.name);
});

// Listen to logout
auth.on('logout', ({ user }) => {
  console.log('User logged out');
});

// Listen to auth state change
auth.on('authStateChange', ({ isAuthenticated, user }) => {
  console.log('Auth state:', isAuthenticated);
});
```

## Routes Configuration

### Available Routes

| Route | Auth Required | Roles | Description |
|-------|--------------|-------|-------------|
| `/` | No | All | Home (redirects to dashboard or login) |
| `/login` | No | All | Login page |
| `/dashboard` | Yes | All | Developer dashboard |
| `/reports` | Yes | All | Report history |
| `/leaderboard` | Yes | All | Team leaderboard |
| `/achievements` | Yes | All | User achievements |
| `/team` | Yes | Team Lead, Admin | Team management |
| `/analytics` | Yes | Team Lead, Admin | Analytics dashboard |
| `/admin` | Yes | Admin | Admin panel |
| `/profile` | Yes | All | User profile |
| `/settings` | Yes | All | User settings |

### Adding New Routes

1. Add route to `/js/routes.js`:

```javascript
{
  path: '/new-page',
  name: 'newPage',
  handler: async (to, from) => {
    await loadPage('newPage');
  },
  guards: [requireAuth],
  meta: {
    title: 'New Page - Developer Report Dashboard',
    requiresAuth: true
  }
}
```

2. Add page loader:

```javascript
window.pages.newPage = async (container) => {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">New Page</h1>
    </div>
    <div class="card">
      <div class="card-body">
        <p>Your content here...</p>
      </div>
    </div>
  `;
};
```

3. Add navigation link:

```html
<a href="#/new-page" class="nav-link">New Page</a>
```

## Usage Examples

### Basic Navigation

```javascript
// Navigate to route
window.app.router.navigate('/dashboard');

// Navigate with query params
window.app.router.navigate('/search?q=test&page=2');

// Replace current route (no history)
window.app.router.replace('/login');

// Go back
window.app.router.back();

// Go forward
window.app.router.forward();
```

### Named Routes

```javascript
// Navigate to named route with params
window.app.router.navigateToRoute('userProfile', {
  id: '123'
}, {
  tab: 'settings' // query param
});
// Results in: /user/123?tab=settings
```

### Conditional Navigation

```javascript
function navigateBasedOnRole() {
  const user = window.app.auth.getUser();

  if (user.role === 'admin') {
    window.app.router.navigate('/admin');
  } else if (user.role === 'team_lead') {
    window.app.router.navigate('/team');
  } else {
    window.app.router.navigate('/dashboard');
  }
}
```

### Custom Guards

```javascript
// Create custom guard
function requireSubscription(to, from, next) {
  const user = window.app.auth.getUser();

  if (!user.hasActiveSubscription) {
    window.app.toast.show({
      type: 'warning',
      title: 'Subscription Required',
      message: 'This feature requires an active subscription.'
    });
    return '/pricing'; // Redirect to pricing
  }

  return true; // Allow access
}

// Use in route
{
  path: '/premium-feature',
  handler: premiumHandler,
  guards: [requireAuth, requireSubscription]
}
```

### Dynamic Page Loading

```javascript
// Load external HTML
async function loadExternalPage(pageName) {
  const response = await fetch(`/pages/${pageName}.html`);
  const html = await response.text();
  document.getElementById('main-content').innerHTML = html;
}

// Use in route
{
  path: '/external',
  handler: async (to, from) => {
    await loadExternalPage('external-page');
  }
}
```

## Testing

### Demo Page

Open `/demo-router.html` to test the routing system:

1. **Test Authentication**
   - Login as Developer, Team Lead, or Admin
   - Observe different access levels
   - Try accessing protected routes while logged out

2. **Test Navigation**
   - Click navigation links
   - Test back/forward buttons
   - Try invalid routes (404 handling)

3. **Monitor Events**
   - Watch the event log for route changes
   - See auth state changes
   - Observe guard behavior

### Manual Testing

```javascript
// In browser console
window.app.router.getCurrentRoute()    // Current route info
window.app.auth.getUser()              // Current user
window.app.router.navigate('/test')    // Navigate
window.app.auth.logout()               // Logout
```

### Debug Mode

Enable debug logging in `/js/app.js`:

```javascript
this.config = {
  debug: true  // Set to true for console logs
};
```

## Best Practices

1. **Always use navigation guards** for protected routes
2. **Handle loading states** when fetching data
3. **Update page title** on route change
4. **Show error messages** for failed navigation
5. **Use named routes** for maintainability
6. **Implement proper 404 handling**
7. **Test role-based access** thoroughly
8. **Keep route handlers simple** - delegate to page loaders
9. **Use route meta** for page configuration
10. **Clean up resources** when leaving routes

## Troubleshooting

### Route Not Working

- Check route is registered in `/js/routes.js`
- Verify hash in URL matches route path
- Check browser console for errors

### Guard Blocking Navigation

- Verify user is authenticated
- Check user has required role
- Review guard logic in console

### Page Not Loading

- Check page loader exists in `window.pages`
- Verify HTML is valid
- Check network tab for failed requests

### Auth State Not Persisting

- Check localStorage/sessionStorage
- Verify "Remember me" is checked
- Review token expiration settings

## Support

For issues or questions:
- Check browser console for errors
- Review event log in demo page
- Inspect route configuration in `/js/routes.js`
- Debug with `window.app.config.debug = true`
