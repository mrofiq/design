# Developer Report Dashboard - Quick Reference Guide

## Quick Start

```bash
# Start local server (Python 3)
python -m http.server 8000

# Or Node.js
npx http-server -p 8000

# Open browser
http://localhost:8000/index-optimized.html
```

---

## File Structure at a Glance

```
devreport/
├── index-optimized.html    # Production-ready entry point
├── manifest.json            # PWA manifest
├── service-worker.js        # Offline support
├── css/                     # All styles
│   ├── design-tokens.css    # Design system
│   ├── components/          # Component styles
│   └── pages/              # Page styles
└── js/                      # All JavaScript
    ├── components/          # UI components
    ├── pages/              # Page logic
    ├── utils/              # Utilities
    └── app.js              # Main entry point
```

---

## Common Tasks

### Add a New Component

```javascript
// 1. Create js/components/MyComponent.js
export class MyComponent {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'my-component';
    this.element.innerHTML = `<!-- HTML -->`;
  }

  mount(container) {
    container.appendChild(this.element);
  }

  destroy() {
    this.element?.remove();
  }
}
```

```css
/* 2. Create css/components/my-component.css */
.my-component {
  padding: var(--spacing-4);
  background: var(--color-background-primary);
}
```

```html
<!-- 3. Add to index-optimized.html -->
<link rel="stylesheet" href="/css/components/my-component.css">
<script src="/js/components/MyComponent.js" defer></script>
```

### Add a New Route

```javascript
// In js/routes.js
{
  path: '/my-page',
  title: 'My Page',
  component: 'MyPage',
  requiresAuth: true
}

// Create js/pages/MyPage.js
export class MyPage {
  constructor() {
    this.element = null;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = `<h1>My Page</h1>`;
  }

  mount(container) {
    container.appendChild(this.element);
  }

  destroy() {
    this.element?.remove();
  }
}
```

### Add Animation

```html
<!-- Scroll-based animation -->
<div data-animate="fadeInUp" data-delay="100">
  Animates on scroll
</div>
```

```javascript
// Programmatic animation
import { animate } from '/js/utils/animations.js';
animate(element, 'fadeInUp', { duration: 500 });
```

### Lazy Load Images

```html
<img data-src="/path/to/image.jpg" alt="Description" class="lazy">
```

```javascript
import { LazyImageLoader } from '/js/utils/performance.js';
const loader = new LazyImageLoader();
loader.observe(document.querySelectorAll('img[data-src]'));
```

### Debounce Event Handler

```javascript
import { debounce } from '/js/utils/performance.js';

const handleSearch = debounce((query) => {
  // Search logic
}, 300);

input.addEventListener('input', (e) => handleSearch(e.target.value));
```

---

## Design Tokens

### Colors

```css
/* Primary */
--color-primary-50 to --color-primary-950

/* Backgrounds */
--color-background-primary
--color-background-secondary
--color-background-tertiary

/* Text */
--color-text-primary
--color-text-secondary
--color-text-tertiary
```

### Spacing

```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-6: 24px
--spacing-8: 32px
--spacing-12: 48px
--spacing-16: 64px
```

### Typography

```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px */
--font-size-lg: 1.125rem   /* 18px */
--font-size-xl: 1.25rem    /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.875rem  /* 30px */
--font-size-4xl: 2.25rem   /* 36px */
```

### Border Radius

```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 24px
--radius-full: 9999px
```

---

## Component Quick Reference

### Button

```html
<!-- Primary button -->
<button class="btn-primary">Primary</button>

<!-- Secondary button -->
<button class="btn-secondary">Secondary</button>

<!-- Sizes -->
<button class="btn-primary btn-sm">Small</button>
<button class="btn-primary btn-lg">Large</button>

<!-- States -->
<button class="btn-primary" disabled>Disabled</button>
<button class="btn-primary is-loading">Loading</button>
```

### Card

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">
    Content
  </div>
  <div class="card-footer">
    <button class="btn-primary">Action</button>
  </div>
</div>
```

### Modal

```javascript
import { Modal } from '/js/components/Modal.js';

const modal = new Modal({
  title: 'Modal Title',
  content: '<p>Modal content</p>',
  footer: '<button class="btn-primary">Confirm</button>'
});

modal.show();
```

### Toast

```javascript
import { Toast } from '/js/components/Toast.js';

Toast.success('Success message');
Toast.error('Error message');
Toast.info('Info message');
Toast.warning('Warning message');
```

### Form

```html
<div class="form-group">
  <label class="form-label" for="input">Label</label>
  <input type="text" id="input" class="form-input" placeholder="Placeholder">
  <span class="form-help">Help text</span>
</div>
```

### Tabs

```javascript
import { Tabs } from '/js/components/Tabs.js';

const tabs = new Tabs('#tabs-container', {
  tabs: [
    { id: 'tab1', label: 'Tab 1', content: '<p>Content 1</p>' },
    { id: 'tab2', label: 'Tab 2', content: '<p>Content 2</p>' }
  ]
});
```

---

## Utility Classes

### Display

```css
.block        /* display: block */
.inline       /* display: inline */
.inline-block /* display: inline-block */
.flex         /* display: flex */
.inline-flex  /* display: inline-flex */
.grid         /* display: grid */
.hidden       /* display: none */
```

### Flexbox

```css
.flex-row            /* flex-direction: row */
.flex-col            /* flex-direction: column */
.items-start         /* align-items: flex-start */
.items-center        /* align-items: center */
.items-end           /* align-items: flex-end */
.justify-start       /* justify-content: flex-start */
.justify-center      /* justify-content: center */
.justify-between     /* justify-content: space-between */
.gap-2, .gap-4, etc  /* gap spacing */
```

### Spacing

```css
.m-0, .m-1, .m-2, etc    /* margin */
.mt-0, .mt-1, .mt-2, etc /* margin-top */
.mr-0, .mr-1, .mr-2, etc /* margin-right */
.mb-0, .mb-1, .mb-2, etc /* margin-bottom */
.ml-0, .ml-1, .ml-2, etc /* margin-left */

.p-0, .p-1, .p-2, etc    /* padding */
.pt-0, .pt-1, .pt-2, etc /* padding-top */
.pr-0, .pr-1, .pr-2, etc /* padding-right */
.pb-0, .pb-1, .pb-2, etc /* padding-bottom */
.pl-0, .pl-1, .pl-2, etc /* padding-left */
```

### Text

```css
.text-left      /* text-align: left */
.text-center    /* text-align: center */
.text-right     /* text-align: right */

.font-light     /* font-weight: 300 */
.font-normal    /* font-weight: 400 */
.font-medium    /* font-weight: 500 */
.font-semibold  /* font-weight: 600 */
.font-bold      /* font-weight: 700 */

.text-xs        /* font-size: 0.75rem */
.text-sm        /* font-size: 0.875rem */
.text-base      /* font-size: 1rem */
.text-lg        /* font-size: 1.125rem */
.text-xl        /* font-size: 1.25rem */
```

---

## Performance Tips

### Lazy Load Images

```html
<img data-src="image.jpg" alt="Description" class="lazy">
```

### Debounce Events

```javascript
import { debounce } from '/js/utils/performance.js';
const handler = debounce(() => { /* ... */ }, 300);
```

### Virtual Scrolling

```javascript
import { VirtualScroller } from '/js/utils/performance.js';
const scroller = new VirtualScroller(container, {
  itemHeight: 50,
  renderItem: (item) => `<div>${item.name}</div>`
});
```

### Monitor Performance

```javascript
import { PerformanceMonitor } from '/js/utils/performance.js';
const monitor = new PerformanceMonitor();
monitor.mark('start');
// ... code ...
monitor.mark('end');
monitor.measure('duration', 'start', 'end');
```

---

## Animation Presets

```javascript
// Available animations
'fadeIn'
'fadeInUp'
'fadeInDown'
'fadeInLeft'
'fadeInRight'
'fadeOut'
'fadeOutUp'
'fadeOutDown'
'slideUp'
'slideDown'
'scaleIn'
'scaleOut'
'zoomIn'
'zoomOut'
'bounce'
'shake'
'pulse'
'rotate'
```

---

## Common Patterns

### Show Loading State

```javascript
button.classList.add('is-loading');
button.disabled = true;

// ... async operation ...

button.classList.remove('is-loading');
button.disabled = false;
```

### Handle Form Submission

```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await api.post('/endpoint', data);
    Toast.success('Success!');
  } catch (error) {
    Toast.error('Error!');
  }
});
```

### Toggle Element Visibility

```javascript
// With animation
import { animate } from '/js/utils/animations.js';

async function toggle(element) {
  if (element.style.display === 'none') {
    element.style.display = 'block';
    await animate(element, 'fadeIn').finished;
  } else {
    await animate(element, 'fadeOut').finished;
    element.style.display = 'none';
  }
}
```

---

## Debugging

### Check Performance

```javascript
// In browser console
window.perfMonitor.reportMetrics()
```

### View Web Vitals

```javascript
window.perfMonitor.getWebVitals()
```

### Check Service Worker

```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
```

---

## Browser DevTools

### Performance Tab
1. Record page load
2. Check FCP, LCP, TTI
3. Identify bottlenecks
4. Optimize accordingly

### Network Tab
1. Monitor requests
2. Check file sizes
3. Verify caching
4. Test offline mode

### Lighthouse
1. Run audit
2. Check scores
3. Follow recommendations
4. Re-test after fixes

---

## Accessibility

### Keyboard Navigation
- Tab through interactive elements
- Enter to activate buttons/links
- Escape to close modals
- Arrow keys for navigation

### Screen Reader Support
- Use semantic HTML
- Add ARIA labels
- Provide alt text
- Test with screen reader

### ARIA Attributes

```html
<!-- Button -->
<button aria-label="Close" aria-pressed="false">

<!-- Modal -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">

<!-- Menu -->
<nav role="navigation" aria-label="Main navigation">

<!-- Live region -->
<div aria-live="polite" aria-atomic="true">
```

---

## Common Issues & Solutions

### Service Worker Not Updating
```javascript
// Force update
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.update());
});
```

### Animations Not Working
```javascript
// Check browser support
if ('animate' in Element.prototype) {
  // Use Web Animations API
} else {
  // Fallback to CSS animations
}
```

### Images Not Lazy Loading
```javascript
// Check IntersectionObserver support
if ('IntersectionObserver' in window) {
  // Use lazy loading
} else {
  // Load images immediately
}
```

---

## Testing Checklist

- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Responsive design (320px to 2560px)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Offline functionality
- [ ] Performance (Lighthouse 90+)
- [ ] Console errors (none)

---

## Deployment Commands

### Netlify
```bash
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

### GitHub Pages
```bash
git add .
git commit -m "Deploy"
git push origin main
```

---

## Resources

- **Documentation**: `/PROJECT-COMPLETE.md`
- **API Guide**: `/docs/API.md`
- **Components**: `/docs/COMPONENTS.md`
- **Examples**: `/examples/`

---

## Support

Having issues? Check:
1. Browser console for errors
2. Network tab for failed requests
3. Documentation for usage examples
4. Example files for reference code

---

**Quick Reference Version**: 1.0.0
**Last Updated**: January 2025
