# Quick Start: Routing & Authentication

Get started with the Developer Report Dashboard routing system in 5 minutes.

## 🚀 Quick Demo

1. **Open the demo page:**
   ```
   /demo-router.html
   ```

2. **Try logging in:**
   - Click "Login as Developer" (or Team Lead/Admin)
   - Watch the auth status change
   - See the event log update

3. **Navigate around:**
   - Click any navigation link
   - Try protected routes
   - Test the 404 page

That's it! You now understand how routing works.

## 📁 File Structure

```
/js/
  ├── router.js        # Routing engine
  ├── auth.js          # Authentication manager
  ├── routes.js        # Route definitions
  └── app.js           # Main application

/css/
  └── auth.css         # Auth page styles

/docs/
  └── ROUTING-GUIDE.md # Full documentation
```

## 🔐 Authentication

### Login
```javascript
// Simple login
await window.app.auth.login({
  email: 'user@example.com',
  password: 'password'
}, remember = true);

// Check if logged in
if (window.app.auth.check()) {
  const user = window.app.auth.getUser();
  console.log('Logged in as:', user.name);
}
```

### Demo Accounts
- **Developer**: `developer@example.com`
- **Team Lead**: `team.lead@example.com`
- **Admin**: `admin@example.com`

Password: anything (it's a demo)

### Logout
```javascript
window.app.auth.logout();
```

## 🧭 Navigation

### HTML Links
```html
<!-- Use hash-based links -->
<a href="#/dashboard">Dashboard</a>
<a href="#/reports">Reports</a>
```

### JavaScript
```javascript
// Navigate to route
window.app.router.navigate('/dashboard');

// Go back
window.app.router.back();

// Get current route
const route = window.app.router.getCurrentRoute();
console.log('Current path:', route.path);
```

## 🛡️ Protected Routes

Routes automatically check authentication:

```javascript
// This route requires login
{
  path: '/dashboard',
  handler: dashboardHandler,
  guards: [requireAuth],  // ← Auth required
  meta: {
    requiresAuth: true,
    roles: ['developer', 'team_lead', 'admin']
  }
}

// This route requires admin role
{
  path: '/admin',
  handler: adminHandler,
  guards: [requireAuth, requireRole(['admin'])],  // ← Admin only
  meta: {
    requiresAuth: true,
    roles: ['admin']
  }
}
```

### Try It
1. Open `/demo-router.html`
2. Click "Team Dashboard" while logged out
3. You'll be redirected to login
4. Login as Team Lead or Admin
5. Now you can access Team Dashboard

## ➕ Adding a New Route

### Step 1: Add Route Definition

Edit `/js/routes.js`:

```javascript
{
  path: '/my-page',
  name: 'myPage',
  handler: async (to, from) => {
    await loadPage('myPage');
  },
  guards: [requireAuth],  // Optional: protect route
  meta: {
    title: 'My Page - Developer Report',
    requiresAuth: true
  }
}
```

### Step 2: Create Page Loader

Add to `/js/routes.js`:

```javascript
window.pages.myPage = async (container) => {
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">My Page</h1>
    </div>
    <div class="card">
      <div class="card-body">
        <p>Hello from my new page!</p>
      </div>
    </div>
  `;
};
```

### Step 3: Add Navigation Link

Edit `/index.html`:

```html
<li class="nav-item">
  <a href="#/my-page" class="nav-link">
    <svg class="nav-icon" width="20" height="20">
      <use href="#icon-star"></use>
    </svg>
    <span class="nav-text">My Page</span>
  </a>
</li>
```

Done! Navigate to `#/my-page`

## 🎯 Common Tasks

### Check User Role
```javascript
const user = window.app.auth.getUser();

if (user.role === 'admin') {
  // Admin only code
}

// Or use helper
if (window.app.auth.hasRole('admin')) {
  // Admin only code
}
```

### Show Toast on Navigation
```javascript
window.app.router.on('afterRouteChange', ({ to }) => {
  if (to.name === 'dashboard') {
    window.app.toast.show({
      type: 'success',
      title: 'Welcome!',
      message: 'Welcome to your dashboard'
    });
  }
});
```

### Redirect After Login
```javascript
const result = await window.app.auth.login(credentials);

if (result.success) {
  // Redirect based on role
  const user = result.user;
  if (user.role === 'admin') {
    window.app.router.navigate('/admin');
  } else {
    window.app.router.navigate('/dashboard');
  }
}
```

### Get Query Parameters
```javascript
// URL: #/search?q=test&page=2

window.app.router.register('/search', async (to, from) => {
  const query = to.query.q;        // 'test'
  const page = to.query.page;      // '2'

  // Use the query params
  console.log(`Searching for: ${query}, page: ${page}`);
});
```

### Navigate with Query Params
```javascript
window.app.router.navigate('/search?q=test&page=2');
```

## 📊 Available Routes

| Route | Auth | Roles | Description |
|-------|------|-------|-------------|
| `/` | No | All | Home (auto-redirects) |
| `/login` | No | All | Login page |
| `/dashboard` | Yes | All | Main dashboard |
| `/reports` | Yes | All | Report history |
| `/leaderboard` | Yes | All | Team rankings |
| `/achievements` | Yes | All | Your achievements |
| `/profile` | Yes | All | Your profile |
| `/settings` | Yes | All | App settings |
| `/team` | Yes | Lead, Admin | Team dashboard |
| `/analytics` | Yes | Lead, Admin | Analytics |
| `/admin` | Yes | Admin | Admin panel |

## 🎨 Customizing Auth Pages

Edit `/css/auth.css` to customize:

```css
/* Change auth page background */
.app-layout.auth-layout {
  background: linear-gradient(
    135deg,
    var(--color-primary-50) 0%,
    var(--color-accent-50) 100%
  );
}

/* Customize auth card */
.auth-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
}
```

## 🐛 Debugging

### Enable Debug Mode

Edit `/js/app.js`:

```javascript
this.config = {
  debug: true  // ← Set to true
};
```

Now you'll see logs in console:
```
[App] Auth manager initialized Authenticated
[App] Router initialized
[App] Components initialized
[App] User logged in: developer@example.com
```

### Check Current State

In browser console:

```javascript
// Get current route
window.app.router.getCurrentRoute()

// Get current user
window.app.auth.getUser()

// Check if authenticated
window.app.auth.check()

// Get all routes
window.appRoutes
```

## 🔧 Troubleshooting

**Q: Routes not working?**
- Make sure URL has `#` before path: `#/dashboard`
- Check route is registered in `/js/routes.js`
- Look for errors in browser console

**Q: Can't access protected route?**
- Verify you're logged in: `window.app.auth.check()`
- Check your role: `window.app.auth.getUser().role`
- Review route guards in `/js/routes.js`

**Q: Login not persisting?**
- Check "Remember me" is enabled
- Verify localStorage is enabled
- Check for errors in console

**Q: Page not loading?**
- Verify page loader exists in `window.pages`
- Check for JavaScript errors
- Make sure HTML is valid

## 📚 Learn More

- **Full Documentation**: `/docs/ROUTING-GUIDE.md`
- **Implementation Details**: `/PHASE-3-SUMMARY.md`
- **Demo Page**: `/demo-router.html`

## 💡 Tips

1. **Always use guards** for protected routes
2. **Handle errors** gracefully with try/catch
3. **Update page titles** for better UX
4. **Show loading states** during navigation
5. **Test different roles** thoroughly
6. **Use named routes** for maintainability

## 🎉 Next Steps

Now that you understand routing:

1. Build out your page content
2. Connect to real APIs
3. Add data visualization
4. Implement forms and validation
5. Add real-time features

Happy coding! 🚀
