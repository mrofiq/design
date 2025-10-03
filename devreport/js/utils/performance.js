/**
 * Performance Utilities
 * Provides lazy loading, virtual scrolling, debounce/throttle, and resource optimization
 */

/**
 * Lazy Loading for Images
 * Implements Intersection Observer for efficient image loading
 */
export class LazyImageLoader {
  constructor(options = {}) {
    this.options = {
      root: options.root || null,
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.01,
      loadingClass: options.loadingClass || 'lazy-loading',
      loadedClass: options.loadedClass || 'lazy-loaded',
      errorClass: options.errorClass || 'lazy-error',
    };

    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          root: this.options.root,
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold,
        }
      );
    }
  }

  handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        observer.unobserve(img);
      }
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (!src) return;

    img.classList.add(this.options.loadingClass);

    const tempImage = new Image();

    tempImage.onload = () => {
      img.src = src;
      if (srcset) img.srcset = srcset;

      img.classList.remove(this.options.loadingClass);
      img.classList.add(this.options.loadedClass);
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
    };

    tempImage.onerror = () => {
      img.classList.remove(this.options.loadingClass);
      img.classList.add(this.options.errorClass);
    };

    tempImage.src = src;
  }

  observe(elements) {
    if (!this.observer) {
      // Fallback for browsers without IntersectionObserver
      elements.forEach(el => this.loadImage(el));
      return;
    }

    elements.forEach(el => this.observer.observe(el));
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Virtual Scrolling Helper
 * Efficiently renders large lists by only rendering visible items
 */
export class VirtualScroller {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      itemHeight: options.itemHeight || 50,
      bufferSize: options.bufferSize || 5,
      renderItem: options.renderItem || ((item) => `<div>${item}</div>`),
    };

    this.items = [];
    this.viewport = null;
    this.content = null;
    this.scrollTop = 0;

    this.init();
  }

  init() {
    this.viewport = document.createElement('div');
    this.viewport.style.cssText = 'height: 100%; overflow-y: auto; position: relative;';

    this.content = document.createElement('div');
    this.content.style.cssText = 'position: relative;';

    this.viewport.appendChild(this.content);
    this.container.appendChild(this.viewport);

    this.viewport.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    this.scrollTop = this.viewport.scrollTop;
    this.render();
  }

  setItems(items) {
    this.items = items;
    this.content.style.height = `${items.length * this.options.itemHeight}px`;
    this.render();
  }

  render() {
    const viewportHeight = this.viewport.clientHeight;
    const startIndex = Math.max(
      0,
      Math.floor(this.scrollTop / this.options.itemHeight) - this.options.bufferSize
    );
    const endIndex = Math.min(
      this.items.length,
      Math.ceil((this.scrollTop + viewportHeight) / this.options.itemHeight) + this.options.bufferSize
    );

    const visibleItems = this.items.slice(startIndex, endIndex);
    const offset = startIndex * this.options.itemHeight;

    this.content.innerHTML = visibleItems
      .map((item, index) => {
        const actualIndex = startIndex + index;
        const top = actualIndex * this.options.itemHeight;
        return `<div style="position: absolute; top: ${top}px; left: 0; right: 0; height: ${this.options.itemHeight}px;">
          ${this.options.renderItem(item, actualIndex)}
        </div>`;
      })
      .join('');
  }

  scrollToIndex(index) {
    const targetScroll = index * this.options.itemHeight;
    this.viewport.scrollTop = targetScroll;
  }

  destroy() {
    this.viewport.removeEventListener('scroll', this.handleScroll);
  }
}

/**
 * Debounce Function
 * Delays function execution until after wait time has elapsed since last call
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle Function
 * Ensures function is called at most once per specified time period
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  let lastResult;

  return function executedFunction(...args) {
    const context = this;

    if (!inThrottle) {
      lastResult = func.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }

    return lastResult;
  };
}

/**
 * Resource Hints Helper
 * Manages preconnect, prefetch, and preload hints
 */
export class ResourceHints {
  static preconnect(url, crossorigin = false) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  static prefetch(url, as = null) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    if (as) link.as = as;
    document.head.appendChild(link);
  }

  static preload(url, as, type = null) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }

  static dnsPrefetch(url) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  static prerender(url) {
    const link = document.createElement('link');
    link.rel = 'prerender';
    link.href = url;
    document.head.appendChild(link);
  }
}

/**
 * Critical CSS Inliner
 * Extracts and inlines critical CSS for above-the-fold content
 */
export class CriticalCSS {
  constructor() {
    this.criticalSelectors = new Set();
  }

  // Detect critical CSS selectors from visible elements
  detectCriticalSelectors() {
    const viewportHeight = window.innerHeight;
    const elements = document.querySelectorAll('*');

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight) {
        // Element is in viewport
        const classes = Array.from(el.classList);
        classes.forEach(cls => this.criticalSelectors.add(`.${cls}`));

        if (el.id) {
          this.criticalSelectors.add(`#${el.id}`);
        }
      }
    });

    return Array.from(this.criticalSelectors);
  }

  // Extract CSS rules for critical selectors
  extractCriticalCSS() {
    const criticalSelectors = this.detectCriticalSelectors();
    const criticalRules = [];

    Array.from(document.styleSheets).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || []).forEach(rule => {
          if (rule.selectorText) {
            const selectors = rule.selectorText.split(',').map(s => s.trim());
            const isCritical = selectors.some(selector =>
              criticalSelectors.some(critical =>
                selector.includes(critical)
              )
            );

            if (isCritical) {
              criticalRules.push(rule.cssText);
            }
          }
        });
      } catch (e) {
        // Skip external stylesheets that can't be accessed
      }
    });

    return criticalRules.join('\n');
  }

  // Inline critical CSS in the document head
  inline() {
    const criticalCSS = this.extractCriticalCSS();
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }
}

/**
 * Request Animation Frame Throttle
 * Throttles function calls to animation frames for smooth performance
 */
export function rafThrottle(callback) {
  let requestId = null;
  let lastArgs = null;

  const later = () => {
    requestId = null;
    callback(...lastArgs);
  };

  return function throttled(...args) {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later);
    }
  };
}

/**
 * Idle Callback Wrapper
 * Executes tasks during browser idle time
 */
export function runOnIdle(callback, options = {}) {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, options);
  } else {
    // Fallback to setTimeout
    return setTimeout(callback, 1);
  }
}

/**
 * Performance Monitor
 * Tracks and reports performance metrics
 */
export class PerformanceMonitor {
  constructor() {
    this.marks = new Map();
    this.measures = new Map();
  }

  mark(name) {
    const timestamp = performance.now();
    this.marks.set(name, timestamp);

    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  }

  measure(name, startMark, endMark) {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark) || performance.now();

    if (start) {
      const duration = end - start;
      this.measures.set(name, duration);

      if ('performance' in window && 'measure' in performance) {
        try {
          performance.measure(name, startMark, endMark);
        } catch (e) {
          // Ignore if marks don't exist
        }
      }

      return duration;
    }

    return null;
  }

  getMetric(name) {
    return this.measures.get(name);
  }

  getWebVitals() {
    const vitals = {};

    if ('PerformanceObserver' in window) {
      // LCP - Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {}

      // FID - First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            vitals.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {}

      // CLS - Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              vitals.cls = clsValue;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {}
    }

    return vitals;
  }

  reportMetrics() {
    const metrics = {
      marks: Object.fromEntries(this.marks),
      measures: Object.fromEntries(this.measures),
      vitals: this.getWebVitals(),
    };

    return metrics;
  }
}

/**
 * Memory Monitor
 * Monitors memory usage (Chrome only)
 */
export class MemoryMonitor {
  static getMemoryUsage() {
    if ('memory' in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        usagePercentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  }

  static monitorMemory(callback, interval = 5000) {
    return setInterval(() => {
      const usage = MemoryMonitor.getMemoryUsage();
      if (usage) callback(usage);
    }, interval);
  }
}

// Export default collection
export default {
  LazyImageLoader,
  VirtualScroller,
  debounce,
  throttle,
  rafThrottle,
  runOnIdle,
  ResourceHints,
  CriticalCSS,
  PerformanceMonitor,
  MemoryMonitor,
};
