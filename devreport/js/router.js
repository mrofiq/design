/**
 * Router.js - Lightweight Client-Side Router
 *
 * Features:
 * - Hash-based routing for SPA
 * - Route parameters and query strings
 * - Navigation guards (authentication)
 * - Route change events
 * - 404 handling
 * - History API support
 * - Route transitions
 * - Nested routes support
 */

class Router {
  constructor(options = {}) {
    this.routes = new Map();
    this.currentRoute = null;
    this.previousRoute = null;
    this.guards = [];
    this.middlewares = [];
    this.notFoundHandler = null;
    this.errorHandler = null;

    // Configuration
    this.config = {
      mode: options.mode || 'hash', // 'hash' or 'history'
      root: options.root || '/',
      transition: options.transition || true,
      scrollToTop: options.scrollToTop !== false,
      ...options
    };

    // Event listeners storage
    this.listeners = {
      beforeRouteChange: [],
      afterRouteChange: [],
      routeError: []
    };

    // Initialize
    this.init();
  }

  /**
   * Initialize router
   */
  init() {
    // Listen for hash/history changes
    if (this.config.mode === 'hash') {
      window.addEventListener('hashchange', () => this.handleRouteChange());
    } else {
      window.addEventListener('popstate', () => this.handleRouteChange());
    }

    // Handle initial load
    this.handleRouteChange();

    // Intercept link clicks for SPA navigation
    this.interceptLinks();
  }

  /**
   * Register a route
   */
  register(path, handler, options = {}) {
    const route = {
      path: this.normalizePath(path),
      handler,
      name: options.name || null,
      meta: options.meta || {},
      guards: options.guards || [],
      children: options.children || [],
      params: this.extractParams(path)
    };

    this.routes.set(route.path, route);
    return this;
  }

  /**
   * Register multiple routes
   */
  registerRoutes(routes) {
    routes.forEach(route => {
      this.register(route.path, route.handler, route);
    });
    return this;
  }

  /**
   * Add global navigation guard
   */
  beforeEach(guard) {
    this.guards.push(guard);
    return this;
  }

  /**
   * Add middleware
   */
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  /**
   * Set 404 handler
   */
  notFound(handler) {
    this.notFoundHandler = handler;
    return this;
  }

  /**
   * Set error handler
   */
  onError(handler) {
    this.errorHandler = handler;
    return this;
  }

  /**
   * Navigate to a route
   */
  navigate(path, options = {}) {
    const fullPath = this.normalizePath(path);

    if (this.config.mode === 'hash') {
      window.location.hash = fullPath;
    } else {
      window.history.pushState(options.state || {}, '', this.config.root + fullPath);
      this.handleRouteChange();
    }

    return this;
  }

  /**
   * Replace current route (no history entry)
   */
  replace(path, options = {}) {
    const fullPath = this.normalizePath(path);

    if (this.config.mode === 'hash') {
      window.location.replace(`${window.location.pathname}${window.location.search}#${fullPath}`);
    } else {
      window.history.replaceState(options.state || {}, '', this.config.root + fullPath);
      this.handleRouteChange();
    }

    return this;
  }

  /**
   * Go back in history
   */
  back() {
    window.history.back();
    return this;
  }

  /**
   * Go forward in history
   */
  forward() {
    window.history.forward();
    return this;
  }

  /**
   * Go to specific history position
   */
  go(n) {
    window.history.go(n);
    return this;
  }

  /**
   * Get current path
   */
  getCurrentPath() {
    if (this.config.mode === 'hash') {
      return window.location.hash.slice(1) || '/';
    } else {
      return window.location.pathname.replace(this.config.root, '') || '/';
    }
  }

  /**
   * Handle route change
   */
  async handleRouteChange() {
    const path = this.getCurrentPath();
    const route = this.matchRoute(path);

    if (!route) {
      this.handle404(path);
      return;
    }

    // Parse route params and query
    const params = this.parseParams(path, route);
    const query = this.parseQuery();

    // Create route context
    const to = {
      path,
      route: route.path,
      name: route.name,
      params,
      query,
      meta: route.meta,
      hash: window.location.hash
    };

    const from = this.currentRoute;

    try {
      // Run global guards
      for (const guard of this.guards) {
        const result = await guard(to, from, (path) => {
          if (path) this.navigate(path);
        });

        if (result === false) {
          // Navigation cancelled
          return;
        } else if (typeof result === 'string') {
          // Redirect
          this.navigate(result);
          return;
        }
      }

      // Run route-specific guards
      for (const guard of route.guards) {
        const result = await guard(to, from, (path) => {
          if (path) this.navigate(path);
        });

        if (result === false) {
          return;
        } else if (typeof result === 'string') {
          this.navigate(result);
          return;
        }
      }

      // Emit before route change event
      this.emit('beforeRouteChange', { to, from });

      // Apply transition
      if (this.config.transition) {
        await this.applyTransition('out');
      }

      // Update current route
      this.previousRoute = this.currentRoute;
      this.currentRoute = to;

      // Execute route handler
      await route.handler(to, from);

      // Apply transition
      if (this.config.transition) {
        await this.applyTransition('in');
      }

      // Scroll to top if configured
      if (this.config.scrollToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update active nav links
      this.updateActiveLinks(path);

      // Emit after route change event
      this.emit('afterRouteChange', { to, from });

    } catch (error) {
      console.error('Route error:', error);
      this.handleError(error, to, from);
    }
  }

  /**
   * Match route pattern
   */
  matchRoute(path) {
    const normalizedPath = this.normalizePath(path);

    // Try exact match first
    if (this.routes.has(normalizedPath)) {
      return this.routes.get(normalizedPath);
    }

    // Try pattern matching
    for (const [pattern, route] of this.routes) {
      if (this.matchPattern(pattern, normalizedPath)) {
        return route;
      }
    }

    return null;
  }

  /**
   * Match route pattern with params
   */
  matchPattern(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) {
      return false;
    }

    return patternParts.every((part, i) => {
      if (part.startsWith(':')) {
        return true; // Parameter, always matches
      }
      return part === pathParts[i];
    });
  }

  /**
   * Extract parameter names from route pattern
   */
  extractParams(pattern) {
    const params = [];
    const parts = pattern.split('/').filter(Boolean);

    parts.forEach((part, index) => {
      if (part.startsWith(':')) {
        params.push({
          name: part.slice(1),
          index
        });
      }
    });

    return params;
  }

  /**
   * Parse route parameters
   */
  parseParams(path, route) {
    const params = {};
    const pathParts = path.split('/').filter(Boolean);

    route.params.forEach(param => {
      params[param.name] = pathParts[param.index];
    });

    return params;
  }

  /**
   * Parse query string
   */
  parseQuery() {
    const query = {};
    const queryString = window.location.search.slice(1);

    if (!queryString) return query;

    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      query[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });

    return query;
  }

  /**
   * Handle 404
   */
  handle404(path) {
    if (this.notFoundHandler) {
      this.notFoundHandler(path);
    } else {
      console.warn(`Route not found: ${path}`);
      // Default 404 behavior
      const main = document.getElementById('main-content');
      if (main) {
        main.innerHTML = `
          <div class="error-page">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="#/" class="btn-primary">Go Home</a>
          </div>
        `;
      }
    }
  }

  /**
   * Handle errors
   */
  handleError(error, to, from) {
    this.emit('routeError', { error, to, from });

    if (this.errorHandler) {
      this.errorHandler(error, to, from);
    } else {
      console.error('Unhandled route error:', error);
    }
  }

  /**
   * Apply route transition
   */
  async applyTransition(direction) {
    const main = document.getElementById('main-content');
    if (!main) return;

    if (direction === 'out') {
      main.style.opacity = '0';
      main.style.transform = 'translateY(-10px)';
      await new Promise(resolve => setTimeout(resolve, 150));
    } else {
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
      main.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
  }

  /**
   * Update active navigation links
   */
  updateActiveLinks(currentPath) {
    const links = document.querySelectorAll('a[href^="#/"], a[href^="/"]');

    links.forEach(link => {
      const href = link.getAttribute('href');
      const linkPath = href.startsWith('#') ? href.slice(1) : href;

      if (this.normalizePath(linkPath) === this.normalizePath(currentPath)) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Intercept link clicks for SPA navigation
   */
  interceptLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#/"]');

      if (link && this.config.mode === 'hash') {
        // Let browser handle hash navigation naturally
        return;
      }

      if (this.config.mode === 'history') {
        const historyLink = e.target.closest('a[href^="/"]');
        if (historyLink && !historyLink.getAttribute('target')) {
          e.preventDefault();
          const path = historyLink.getAttribute('href');
          this.navigate(path);
        }
      }
    });
  }

  /**
   * Event handling
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
    return this;
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Normalize path
   */
  normalizePath(path) {
    if (!path) return '/';

    // Remove leading/trailing slashes and normalize
    path = path.replace(/^\/+|\/+$/g, '');

    return path ? `/${path}` : '/';
  }

  /**
   * Get route by name
   */
  getRoute(name) {
    for (const route of this.routes.values()) {
      if (route.name === name) {
        return route;
      }
    }
    return null;
  }

  /**
   * Navigate to named route
   */
  navigateToRoute(name, params = {}, query = {}) {
    const route = this.getRoute(name);

    if (!route) {
      console.error(`Route with name "${name}" not found`);
      return this;
    }

    let path = route.path;

    // Replace params
    Object.keys(params).forEach(key => {
      path = path.replace(`:${key}`, params[key]);
    });

    // Add query string
    const queryString = Object.keys(query)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
      .join('&');

    if (queryString) {
      path += `?${queryString}`;
    }

    return this.navigate(path);
  }

  /**
   * Check if route is active
   */
  isActive(path) {
    return this.normalizePath(path) === this.normalizePath(this.getCurrentPath());
  }

  /**
   * Get current route info
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Get previous route info
   */
  getPreviousRoute() {
    return this.previousRoute;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Router;
} else {
  window.Router = Router;
}
