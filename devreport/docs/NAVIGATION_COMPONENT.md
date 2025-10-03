# Navigation Component Documentation

## Overview

The Navigation component provides a fully accessible, responsive sidebar navigation system for the Developer Report Dashboard. It includes support for expandable sub-menus, keyboard navigation, mobile drawer functionality, and persistent state management.

## Files Created

### CSS Component
- **Location**: `/css/components/navigation.css`
- **Size**: 13KB
- **Features**:
  - Sidebar navigation styles
  - Nav items (active, hover, focus states)
  - Nav groups/sections
  - Nav icons with proper sizing
  - Collapsible sub-menus with smooth animations
  - Notification badges and dots on nav items
  - Mobile navigation drawer with overlay
  - Responsive breakpoints
  - Dark mode support
  - Print styles
  - Reduced motion support

### JavaScript Component
- **Location**: `/js/components/Navigation.js`
- **Size**: 19KB
- **Features**:
  - Navigation menu management
  - Active item tracking
  - Sub-menu expand/collapse
  - Full keyboard navigation (arrow keys, Home, End, Enter, Space)
  - Comprehensive ARIA attributes
  - Mobile menu open/close
  - Scroll to active item
  - Focus trap for mobile menu
  - State persistence via localStorage
  - Custom event system
  - Destroy method for cleanup

### Example HTML
- **Location**: `/examples/navigation-example.html`
- **Size**: 15KB
- **Purpose**: Complete working demonstration of the navigation component

## Features

### 1. Sidebar Navigation
- Fixed position sidebar with configurable width
- Collapsible state for desktop (280px → 64px)
- Smooth transitions and animations
- Custom scrollbar styling
- Z-index management

### 2. Navigation Items
- **States**: Default, Hover, Focus, Active
- **Icons**: SVG icons with proper sizing (20x20px)
- **Text**: Responsive text with overflow handling
- **Badges**: Notification count badges
- **Indicators**: Active item indicator line (3px primary color)

### 3. Sub-menus (Collapsible)
- Expandable/collapsible sub-menu groups
- Animated expand/collapse (max-height transition)
- Nested support (up to 3 levels)
- Expand/collapse icon rotation
- Parent expansion when child is active

### 4. Mobile Navigation
- Off-canvas drawer navigation
- Overlay backdrop (50% black)
- Mobile toggle button with FAB styling
- Focus trap when open
- Body scroll lock
- Swipe gestures support (CSS-only)

### 5. Keyboard Navigation
- **Arrow Up/Down**: Navigate between items
- **Home/End**: Jump to first/last item
- **Enter/Space**: Activate links or expand sub-menus
- **Arrow Left/Right**: Collapse/expand sub-menus
- **Escape**: Close mobile menu
- **Tab**: Standard focus navigation
- Visible focus indicators (2px outline)

### 6. Accessibility (WCAG 2.1 AA)
- Semantic HTML with proper roles
- ARIA attributes:
  - `role="navigation"`
  - `aria-label` for context
  - `aria-expanded` for expandable items
  - `aria-current="page"` for active items
  - `aria-controls` for sub-menus
  - `aria-pressed` for toggle buttons
- Screen reader announcements
- Skip to content link
- Focus management
- Keyboard-only navigation support
- Sufficient color contrast (4.5:1+)

### 7. State Management
- Active item tracking
- Expanded sub-menus tracking
- Collapsed sidebar state
- Persistent state via localStorage
- Configurable storage key
- State restoration on page load

### 8. Notification System
- Badge counts on nav items
- Notification dots (8px, pulsing animation)
- Multiple badge variants
- Auto-hide when empty

## CSS Classes

### Layout Classes
```css
.nav-sidebar                    /* Main sidebar container */
.nav-sidebar--collapsed         /* Collapsed state */
.nav-sidebar--open              /* Mobile open state */
.nav-header                     /* Sidebar header */
.nav-container                  /* Scrollable nav container */
.nav-footer                     /* Sidebar footer */
```

### Navigation Groups
```css
.nav-group                      /* Navigation group container */
.nav-group__title               /* Group title/label */
.nav-group__list                /* Group items list */
```

### Navigation Items
```css
.nav-item                       /* Nav item wrapper */
.nav-item--active               /* Active item state */
.nav-item--expanded             /* Expanded item state */
.nav-item__link                 /* Nav link element */
.nav-item__icon                 /* Icon container */
.nav-item__text                 /* Text label */
.nav-item__badge                /* Notification badge */
.nav-item__expand               /* Expand/collapse icon */
.nav-item__notification         /* Notification dot */
```

### Sub-menus
```css
.nav-submenu                    /* Sub-menu container */
```

### Mobile
```css
.nav-overlay                    /* Mobile backdrop overlay */
.nav-overlay--visible           /* Overlay visible state */
.nav-mobile-toggle              /* Mobile menu toggle button */
```

### Utilities
```css
.nav-divider                    /* Visual separator */
.nav-sr-only                    /* Screen reader only text */
.nav-skip-link                  /* Skip to content link */
```

## JavaScript API

### Initialization

```javascript
// Basic initialization
const navigation = new Navigation();

// With options
const navigation = new Navigation({
  sidebarSelector: '[data-nav-sidebar]',
  toggleSelector: '[data-nav-toggle]',
  mobileToggleSelector: '[data-nav-mobile-toggle]',
  overlaySelector: '[data-nav-overlay]',
  itemSelector: '[data-nav-item]',
  expandableSelector: '[data-nav-expandable]',
  activeClass: 'nav-item--active',
  expandedClass: 'nav-item--expanded',
  openClass: 'nav-sidebar--open',
  collapsedClass: 'nav-sidebar--collapsed',
  overlayVisibleClass: 'nav-overlay--visible',
  scrollToActiveOnInit: true,
  persistState: true,
  storageKey: 'devreport_nav_state'
});
```

### Methods

```javascript
// Expand/collapse sub-menus
navigation.expand(item);           // Expand a nav item
navigation.collapse(item);         // Collapse a nav item
navigation.toggleExpand(item);     // Toggle expand state

// Active item management
navigation.setActiveItem(item);    // Set active nav item

// Sidebar control
navigation.toggleCollapse();       // Toggle sidebar collapse (desktop)

// Mobile menu control
navigation.openMobile();           // Open mobile menu
navigation.closeMobile();          // Close mobile menu
navigation.toggleMobile();         // Toggle mobile menu

// Utility
navigation.scrollToActiveItem();   // Scroll to active item
navigation.saveState();            // Save current state
navigation.restoreState();         // Restore saved state
navigation.destroy();              // Clean up and remove listeners
```

### Events

```javascript
const sidebar = document.querySelector('[data-nav-sidebar]');

// Item expanded
sidebar.addEventListener('nav:expand', (e) => {
  console.log('Expanded item:', e.detail.item);
});

// Item collapsed
sidebar.addEventListener('nav:collapse', (e) => {
  console.log('Collapsed item:', e.detail.item);
});

// Item activated
sidebar.addEventListener('nav:activate', (e) => {
  console.log('Active item:', e.detail.item);
});

// Sidebar toggled
sidebar.addEventListener('nav:toggle', (e) => {
  console.log('Collapsed:', e.detail.collapsed);
});

// Mobile menu opened
sidebar.addEventListener('nav:open', (e) => {
  console.log('Mobile menu opened');
});

// Mobile menu closed
sidebar.addEventListener('nav:close', (e) => {
  console.log('Mobile menu closed');
});
```

## HTML Structure

### Basic Structure

```html
<!-- Mobile Toggle Button -->
<button class="nav-mobile-toggle" data-nav-mobile-toggle>
  <svg><!-- menu icon --></svg>
</button>

<!-- Navigation Sidebar -->
<nav class="nav-sidebar" id="nav-sidebar" data-nav-sidebar>
  <!-- Header -->
  <div class="nav-header">
    <a href="#" class="nav-header__logo">
      <img src="logo.svg" class="nav-header__logo-img" alt="Logo">
      <span class="nav-header__text">Brand</span>
    </a>
    <button class="nav-header__toggle" data-nav-toggle>
      <svg><!-- toggle icon --></svg>
    </button>
  </div>

  <!-- Navigation Container -->
  <div class="nav-container">
    <!-- Navigation Group -->
    <div class="nav-group">
      <span class="nav-group__title">Group Title</span>
      <ul class="nav-group__list" role="list">
        <!-- Regular Nav Item -->
        <li class="nav-item nav-item--active" data-nav-item>
          <a href="#" class="nav-item__link">
            <span class="nav-item__icon">
              <svg><!-- icon --></svg>
            </span>
            <span class="nav-item__text">Dashboard</span>
          </a>
        </li>

        <!-- Nav Item with Badge -->
        <li class="nav-item" data-nav-item>
          <a href="#" class="nav-item__link">
            <span class="nav-item__icon">
              <svg><!-- icon --></svg>
            </span>
            <span class="nav-item__text">Messages</span>
            <span class="badge nav-item__badge">5</span>
          </a>
        </li>

        <!-- Expandable Nav Item -->
        <li class="nav-item" data-nav-item data-nav-expandable>
          <a href="#" class="nav-item__link">
            <span class="nav-item__icon">
              <svg><!-- icon --></svg>
            </span>
            <span class="nav-item__text">Reports</span>
            <span class="nav-item__expand">
              <svg><!-- chevron icon --></svg>
            </span>
          </a>
          <!-- Sub-menu -->
          <ul class="nav-submenu" role="menu">
            <li class="nav-item" data-nav-item>
              <a href="#" class="nav-item__link">
                <span class="nav-item__text">Daily</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>

  <!-- Footer -->
  <div class="nav-footer">
    <button class="nav-footer__user">
      <img src="avatar.jpg" class="nav-footer__avatar" alt="User">
      <div class="nav-footer__info">
        <span class="nav-footer__name">John Doe</span>
        <span class="nav-footer__role">Developer</span>
      </div>
    </button>
  </div>
</nav>

<!-- Overlay (for mobile) -->
<div class="nav-overlay" data-nav-overlay></div>
```

## Design Tokens Used

### Colors
- `--color-white`: Background color
- `--color-primary-*`: Active states, focus indicators
- `--color-gray-*`: Text, borders, hover states
- `--color-error-500`: Notification badges

### Spacing
- `--spacing-1` to `--spacing-8`: Padding, margins, gaps
- `--sidebar-width`: 280px (desktop)
- `--sidebar-width-collapsed`: 64px
- `--header-height`: 64px

### Typography
- `--font-family-primary`: Text font
- `--font-size-xs` to `--font-size-lg`: Font sizes
- `--font-weight-medium`, `--font-weight-semibold`, `--font-weight-bold`

### Borders & Radius
- `--border-default`: Component borders
- `--radius-sm` to `--radius-full`: Border radius

### Shadows
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`: Elevation
- `--shadow-focus`: Focus indicator

### Transitions
- `--duration-fast`: 200ms
- `--duration-normal`: 300ms
- `--ease-out`: Easing function

### Z-Index
- `--z-index-fixed`: 1030
- `--z-index-notification`: 1080

## Responsive Breakpoints

- **Mobile**: < 768px (Drawer navigation)
- **Tablet**: 768px - 1023px (Narrower sidebar: 240px)
- **Desktop**: ≥ 1024px (Full sidebar: 280px)
- **Large Desktop**: ≥ 1536px (Wider sidebar: 320px)

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

1. **CSS Transitions**: Hardware-accelerated transforms
2. **Scroll Performance**: Uses `overflow-y: auto` with custom scrollbar
3. **Focus Management**: Efficient focus trap implementation
4. **Event Delegation**: Minimal event listeners
5. **State Persistence**: Debounced localStorage writes
6. **DOM Queries**: Cached element references

## Accessibility Checklist

- ✅ Keyboard navigable (all functionality available via keyboard)
- ✅ Screen reader friendly (ARIA labels and roles)
- ✅ Focus indicators visible (2px outline, 2px offset)
- ✅ Color contrast meets WCAG AA (4.5:1 minimum)
- ✅ Reduced motion support (respects `prefers-reduced-motion`)
- ✅ Semantic HTML structure
- ✅ Skip to content link
- ✅ Focus trap in mobile menu
- ✅ Announced state changes
- ✅ Touch target size (minimum 44x44px)

## Testing

### Manual Testing Checklist

- [ ] Desktop sidebar collapse/expand
- [ ] Mobile menu open/close
- [ ] Sub-menu expand/collapse
- [ ] Active item highlighting
- [ ] Keyboard navigation (all keys)
- [ ] Focus indicators visible
- [ ] Screen reader announcements
- [ ] State persistence across page loads
- [ ] Responsive behavior at all breakpoints
- [ ] Touch interactions on mobile
- [ ] Notification badges display correctly
- [ ] Scroll to active item on load

### Automated Testing

```javascript
// Example test with Jest
describe('Navigation Component', () => {
  let navigation;

  beforeEach(() => {
    document.body.innerHTML = '...'; // Setup HTML
    navigation = new Navigation();
  });

  test('initializes correctly', () => {
    expect(navigation.sidebar).toBeTruthy();
  });

  test('expands sub-menu', () => {
    const item = document.querySelector('[data-nav-expandable]');
    navigation.expand(item);
    expect(item.classList.contains('nav-item--expanded')).toBe(true);
  });

  // More tests...
});
```

## Customization

### Custom Colors

```css
:root {
  --nav-bg: var(--color-white);
  --nav-text: var(--color-gray-700);
  --nav-hover-bg: var(--color-gray-100);
  --nav-active-bg: var(--color-primary-50);
  --nav-active-text: var(--color-primary-700);
  --nav-border: var(--color-gray-200);
}
```

### Custom Widths

```css
:root {
  --sidebar-width: 320px;
  --sidebar-width-collapsed: 80px;
}
```

### Custom Transitions

```css
:root {
  --nav-transition-duration: 400ms;
  --nav-transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Known Issues

None at this time.

## Future Enhancements

- [ ] Multi-level nested sub-menus (beyond 3 levels)
- [ ] Drag-and-drop reordering
- [ ] Custom theme variants
- [ ] Right-to-left (RTL) support
- [ ] Swipe gesture support for mobile
- [ ] Search/filter functionality
- [ ] Favorites/pinned items
- [ ] Breadcrumb integration

## Support

For issues, questions, or contributions, please contact the development team.

## License

Copyright © 2025 Developer Report Dashboard. All rights reserved.
