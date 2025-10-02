# Developer Report Dashboard - UI/UX Specifications
## Complete Design System & Implementation Guide

**Version:** 1.0
**Last Updated:** 2025-10-02
**Status:** Production Ready
**Target:** HTML/CSS/JavaScript Implementation

---

## Table of Contents

1. [Design System Foundation](#1-design-system-foundation)
2. [Layout System](#2-layout-system)
3. [Component Library](#3-component-library)
4. [Page Specifications](#4-page-specifications)
5. [User Flows](#5-user-flows)
6. [Accessibility Requirements](#6-accessibility-requirements)
7. [Animation & Interactions](#7-animation--interactions)
8. [State Management](#8-state-management)
9. [Error Handling](#9-error-handling)
10. [Real-time Updates](#10-real-time-updates)

---

## 1. Design System Foundation

### 1.1 Color System

#### Primary Palette
```css
/* Primary Brand Colors */
--color-primary-50: #E3F2FD;    /* Light background tints */
--color-primary-100: #BBDEFB;   /* Hover states */
--color-primary-200: #90CAF9;   /* Disabled states */
--color-primary-300: #64B5F6;   /* Secondary actions */
--color-primary-400: #42A5F5;   /* Hover on primary */
--color-primary-500: #2196F3;   /* Primary brand color */
--color-primary-600: #1E88E5;   /* Primary active */
--color-primary-700: #1976D2;   /* Primary pressed */
--color-primary-800: #1565C0;   /* Dark mode primary */
--color-primary-900: #0D47A1;   /* Emphasis */

/* Accent Colors */
--color-accent-50: #FFF3E0;
--color-accent-500: #FF9800;    /* Gamification highlights */
--color-accent-700: #F57C00;    /* Achievement badges */
```

#### Semantic Colors
```css
/* Success States */
--color-success-50: #E8F5E9;
--color-success-100: #C8E6C9;
--color-success-500: #4CAF50;   /* Positive points, completed tasks */
--color-success-700: #388E3C;

/* Warning States */
--color-warning-50: #FFF8E1;
--color-warning-100: #FFECB3;
--color-warning-500: #FFC107;   /* Pending actions */
--color-warning-700: #FFA000;

/* Error States */
--color-error-50: #FFEBEE;
--color-error-100: #FFCDD2;
--color-error-500: #F44336;     /* Negative points, failed actions */
--color-error-700: #D32F2F;

/* Info States */
--color-info-50: #E1F5FE;
--color-info-500: #03A9F4;
--color-info-700: #0288D1;
```

#### Neutral Palette
```css
/* Gray Scale */
--color-gray-50: #FAFAFA;       /* Page background */
--color-gray-100: #F5F5F5;      /* Card backgrounds */
--color-gray-200: #EEEEEE;      /* Dividers, borders */
--color-gray-300: #E0E0E0;      /* Disabled backgrounds */
--color-gray-400: #BDBDBD;      /* Placeholder text */
--color-gray-500: #9E9E9E;      /* Icons */
--color-gray-600: #757575;      /* Secondary text */
--color-gray-700: #616161;      /* Primary text light bg */
--color-gray-800: #424242;      /* Headers */
--color-gray-900: #212121;      /* Primary text */

/* Pure Colors */
--color-white: #FFFFFF;
--color-black: #000000;
```

#### Gamification Colors
```css
/* Point Types */
--color-points-positive: #4CAF50;
--color-points-negative: #F44336;
--color-points-neutral: #757575;

/* Badges & Achievements */
--color-badge-bronze: #CD7F32;
--color-badge-silver: #C0C0C0;
--color-badge-gold: #FFD700;
--color-badge-platinum: #E5E4E2;

/* Level Colors */
--color-level-junior: #64B5F6;
--color-level-senior: #42A5F5;
--color-level-expert: #1976D2;
--color-level-master: #7B1FA2;
```

### 1.2 Typography System

#### Font Families
```css
/* Primary Font Stack */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont,
                       'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
                       'Cantarell', 'Helvetica Neue', sans-serif;

/* Monospace for Code/Data */
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;

/* Display Font (Optional) */
--font-family-display: 'Poppins', 'Inter', sans-serif;
```

#### Font Sizes & Scale
```css
/* Type Scale (1.250 - Major Third) */
--font-size-xs: 0.75rem;        /* 12px - Captions, labels */
--font-size-sm: 0.875rem;       /* 14px - Small text, metadata */
--font-size-base: 1rem;         /* 16px - Body text */
--font-size-md: 1.125rem;       /* 18px - Large body */
--font-size-lg: 1.25rem;        /* 20px - Small headings */
--font-size-xl: 1.5rem;         /* 24px - H3 */
--font-size-2xl: 1.875rem;      /* 30px - H2 */
--font-size-3xl: 2.25rem;       /* 36px - H1 */
--font-size-4xl: 3rem;          /* 48px - Display */
--font-size-5xl: 3.75rem;       /* 60px - Hero */
```

#### Font Weights
```css
--font-weight-light: 300;
--font-weight-normal: 400;      /* Body text */
--font-weight-medium: 500;      /* Emphasized text */
--font-weight-semibold: 600;    /* Subheadings */
--font-weight-bold: 700;        /* Headings */
--font-weight-extrabold: 800;   /* Display */
```

#### Line Heights
```css
--line-height-tight: 1.25;      /* Headings */
--line-height-normal: 1.5;      /* Body text */
--line-height-relaxed: 1.75;    /* Long-form content */
--line-height-loose: 2;         /* Spacious layouts */
```

#### Letter Spacing
```css
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
```

#### Text Styles (Predefined Classes)
```css
/* Heading Styles */
.text-h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-gray-900);
}

.text-h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-gray-900);
}

.text-h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-gray-800);
}

.text-h4 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-gray-800);
}

/* Body Styles */
.text-body-lg {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-gray-700);
}

.text-body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-gray-700);
}

.text-body-sm {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-gray-600);
}

/* Utility Styles */
.text-caption {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.text-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-gray-700);
}

.text-code {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  background-color: var(--color-gray-100);
  padding: 2px 6px;
  border-radius: 4px;
}
```

### 1.3 Spacing System

#### Spacing Scale (8px Base Unit)
```css
--spacing-0: 0;
--spacing-1: 0.25rem;    /* 4px - Tight spacing */
--spacing-2: 0.5rem;     /* 8px - Base unit */
--spacing-3: 0.75rem;    /* 12px - Small gaps */
--spacing-4: 1rem;       /* 16px - Default gap */
--spacing-5: 1.25rem;    /* 20px - Medium gap */
--spacing-6: 1.5rem;     /* 24px - Large gap */
--spacing-8: 2rem;       /* 32px - Section spacing */
--spacing-10: 2.5rem;    /* 40px - Large section */
--spacing-12: 3rem;      /* 48px - Extra large */
--spacing-16: 4rem;      /* 64px - Page sections */
--spacing-20: 5rem;      /* 80px - Major sections */
--spacing-24: 6rem;      /* 96px - Hero sections */
```

#### Component Spacing
```css
/* Padding Presets */
--padding-input: var(--spacing-3) var(--spacing-4);
--padding-button-sm: var(--spacing-2) var(--spacing-4);
--padding-button-md: var(--spacing-3) var(--spacing-6);
--padding-button-lg: var(--spacing-4) var(--spacing-8);
--padding-card: var(--spacing-6);
--padding-section: var(--spacing-8) var(--spacing-6);

/* Margin Presets */
--margin-component: var(--spacing-4);
--margin-section: var(--spacing-8);
```

### 1.4 Border System

#### Border Widths
```css
--border-width-none: 0;
--border-width-thin: 1px;
--border-width-medium: 2px;
--border-width-thick: 4px;
```

#### Border Radius
```css
--radius-none: 0;
--radius-sm: 4px;       /* Input fields, tags */
--radius-md: 8px;       /* Cards, buttons */
--radius-lg: 12px;      /* Large cards, modals */
--radius-xl: 16px;      /* Feature cards */
--radius-2xl: 24px;     /* Hero sections */
--radius-full: 9999px;  /* Pills, avatars */
```

#### Border Styles
```css
/* Default Borders */
--border-default: var(--border-width-thin) solid var(--color-gray-200);
--border-focus: var(--border-width-medium) solid var(--color-primary-500);
--border-error: var(--border-width-medium) solid var(--color-error-500);
--border-success: var(--border-width-medium) solid var(--color-success-500);
```

### 1.5 Elevation System (Shadows)

```css
/* Shadow Levels */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
             0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Colored Shadows */
--shadow-primary: 0 4px 14px 0 rgba(33, 150, 243, 0.2);
--shadow-success: 0 4px 14px 0 rgba(76, 175, 80, 0.2);
--shadow-error: 0 4px 14px 0 rgba(244, 67, 54, 0.2);

/* Focus Shadow */
--shadow-focus: 0 0 0 3px rgba(33, 150, 243, 0.2);
```

### 1.6 Z-Index System

```css
/* Layering Order */
--z-index-base: 0;
--z-index-dropdown: 1000;
--z-index-sticky: 1020;
--z-index-fixed: 1030;
--z-index-modal-backdrop: 1040;
--z-index-modal: 1050;
--z-index-popover: 1060;
--z-index-tooltip: 1070;
--z-index-notification: 1080;
```

### 1.7 Animation & Transitions

#### Timing Functions
```css
/* Easing Curves */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

#### Duration
```css
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

#### Transition Presets
```css
--transition-default: all var(--duration-normal) var(--ease-out);
--transition-fast: all var(--duration-fast) var(--ease-out);
--transition-color: color var(--duration-fast) var(--ease-out),
                    background-color var(--duration-fast) var(--ease-out);
--transition-transform: transform var(--duration-normal) var(--ease-out);
```

---

## 2. Layout System

### 2.1 Breakpoint System

```css
/* Responsive Breakpoints */
--breakpoint-xs: 0;
--breakpoint-sm: 640px;      /* Mobile landscape */
--breakpoint-md: 768px;      /* Tablet portrait */
--breakpoint-lg: 1024px;     /* Tablet landscape */
--breakpoint-xl: 1280px;     /* Desktop */
--breakpoint-2xl: 1536px;    /* Large desktop */

/* Container Max Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

#### Media Query Usage
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 2.2 Grid System

#### 12-Column Grid
```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-4);
  padding-right: var(--spacing-4);
}

@media (min-width: 640px) {
  .container { max-width: 640px; padding-left: var(--spacing-6); padding-right: var(--spacing-6); }
}
@media (min-width: 768px) {
  .container { max-width: 768px; }
}
@media (min-width: 1024px) {
  .container { max-width: 1024px; padding-left: var(--spacing-8); padding-right: var(--spacing-8); }
}
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

/* Grid System */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--spacing-6);
}

/* Span Utilities */
.col-span-1 { grid-column: span 1; }
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }
.col-span-4 { grid-column: span 4; }
.col-span-6 { grid-column: span 6; }
.col-span-8 { grid-column: span 8; }
.col-span-12 { grid-column: span 12; }
```

### 2.3 Dashboard Layout Structure

#### Overall Layout Dimensions
```
Desktop (1280px+):
- Sidebar: 280px fixed width
- Main Content: calc(100% - 280px)
- Top Bar: 64px height
- Content Padding: 32px

Tablet (768px - 1279px):
- Sidebar: 240px (collapsible)
- Main Content: calc(100% - 240px)
- Top Bar: 56px height
- Content Padding: 24px

Mobile (<768px):
- Sidebar: Off-canvas (overlay)
- Main Content: 100% width
- Top Bar: 56px height
- Content Padding: 16px
```

#### Layout HTML Structure
```html
<div class="app-layout">
  <!-- Top Navigation Bar -->
  <header class="app-header">
    <!-- Header content -->
  </header>

  <!-- Sidebar Navigation -->
  <aside class="app-sidebar">
    <!-- Sidebar content -->
  </aside>

  <!-- Main Content Area -->
  <main class="app-main">
    <div class="container">
      <!-- Page content -->
    </div>
  </main>

  <!-- Toast Notifications -->
  <div class="toast-container">
    <!-- Toasts -->
  </div>
</div>
```

#### Layout CSS
```css
.app-layout {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: 280px 1fr;
  grid-template-rows: 64px 1fr;
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.app-header {
  grid-area: header;
  background-color: var(--color-white);
  border-bottom: var(--border-default);
  padding: 0 var(--spacing-8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
}

.app-sidebar {
  grid-area: sidebar;
  background-color: var(--color-gray-900);
  color: var(--color-white);
  overflow-y: auto;
  position: sticky;
  top: 0;
  height: 100vh;
}

.app-main {
  grid-area: main;
  padding: var(--spacing-8);
  overflow-y: auto;
}

/* Tablet Layout */
@media (max-width: 1023px) {
  .app-layout {
    grid-template-columns: 240px 1fr;
    grid-template-rows: 56px 1fr;
  }

  .app-main {
    padding: var(--spacing-6);
  }
}

/* Mobile Layout */
@media (max-width: 767px) {
  .app-layout {
    grid-template-areas:
      "header"
      "main";
    grid-template-columns: 1fr;
    grid-template-rows: 56px 1fr;
  }

  .app-sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    width: 280px;
    height: 100vh;
    z-index: var(--z-index-modal);
    transition: left var(--duration-normal) var(--ease-out);
  }

  .app-sidebar.is-open {
    left: 0;
  }

  .app-main {
    padding: var(--spacing-4);
  }
}
```

---

## 3. Component Library

### 3.1 Buttons

#### Button Variants & Specifications

**Primary Button**
```css
.btn-primary {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--padding-button-md);
  min-width: 120px;
  height: 44px;

  /* Typography */
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;

  /* Visual */
  background-color: var(--color-primary-500);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  user-select: none;

  /* Animation */
  transition: var(--transition-default);
}

.btn-primary:hover {
  background-color: var(--color-primary-600);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-primary:active {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.btn-primary:disabled {
  background-color: var(--color-gray-300);
  color: var(--color-gray-500);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
```

**Secondary Button**
```css
.btn-secondary {
  /* Inherits base button styles */
  background-color: transparent;
  color: var(--color-primary-500);
  border: 2px solid var(--color-primary-500);
  box-shadow: none;
}

.btn-secondary:hover {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-600);
  color: var(--color-primary-600);
}
```

**Ghost Button**
```css
.btn-ghost {
  background-color: transparent;
  color: var(--color-gray-700);
  border: none;
  box-shadow: none;
}

.btn-ghost:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}
```

**Danger Button**
```css
.btn-danger {
  background-color: var(--color-error-500);
  color: var(--color-white);
}

.btn-danger:hover {
  background-color: var(--color-error-600);
}
```

**Button Sizes**
```css
.btn-sm {
  height: 36px;
  padding: var(--padding-button-sm);
  font-size: var(--font-size-sm);
  min-width: 100px;
}

.btn-md {
  height: 44px;
  padding: var(--padding-button-md);
  font-size: var(--font-size-base);
  min-width: 120px;
}

.btn-lg {
  height: 52px;
  padding: var(--padding-button-lg);
  font-size: var(--font-size-md);
  min-width: 140px;
}
```

**Icon Buttons**
```css
.btn-icon {
  width: 44px;
  height: 44px;
  min-width: unset;
  padding: 0;
  border-radius: var(--radius-full);
}

.btn-icon-sm { width: 36px; height: 36px; }
.btn-icon-lg { width: 52px; height: 52px; }
```

**Button States**
```html
<!-- Default -->
<button class="btn-primary">Submit Report</button>

<!-- Loading -->
<button class="btn-primary is-loading" disabled>
  <span class="spinner"></span>
  <span>Submitting...</span>
</button>

<!-- With Icon -->
<button class="btn-primary">
  <svg class="icon" width="20" height="20">...</svg>
  <span>Login with Microsoft</span>
</button>

<!-- Icon Only -->
<button class="btn-icon btn-ghost">
  <svg class="icon" width="20" height="20">...</svg>
</button>
```

### 3.2 Input Fields

#### Text Input Specifications
```css
.input-field {
  /* Container */
  position: relative;
  width: 100%;
  margin-bottom: var(--spacing-4);
}

.input-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-2);
}

.input-required {
  color: var(--color-error-500);
  margin-left: var(--spacing-1);
}

.input {
  /* Layout */
  width: 100%;
  height: 44px;
  padding: var(--padding-input);

  /* Typography */
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  line-height: 1.5;
  color: var(--color-gray-900);

  /* Visual */
  background-color: var(--color-white);
  border: var(--border-default);
  border-radius: var(--radius-md);

  /* Animation */
  transition: var(--transition-default);
}

.input::placeholder {
  color: var(--color-gray-400);
  font-size: var(--font-size-sm);
}

.input:hover {
  border-color: var(--color-gray-400);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus);
}

.input:disabled {
  background-color: var(--color-gray-100);
  color: var(--color-gray-500);
  cursor: not-allowed;
  border-color: var(--color-gray-200);
}

/* Error State */
.input.has-error {
  border-color: var(--color-error-500);
}

.input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2);
}

.input-error {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-error-500);
  margin-top: var(--spacing-1);
}

/* Success State */
.input.has-success {
  border-color: var(--color-success-500);
}

.input-success {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-success-500);
  margin-top: var(--spacing-1);
}

.input-hint {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
  margin-top: var(--spacing-1);
}
```

#### Input with Icon
```css
.input-icon-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray-400);
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.input-icon-wrapper .input {
  padding-left: 44px;
}

.input-icon-right {
  left: auto;
  right: 12px;
}

.input-icon-wrapper .input.has-icon-right {
  padding-right: 44px;
}
```

#### Textarea
```css
.textarea {
  min-height: 120px;
  resize: vertical;
  padding: var(--spacing-3) var(--spacing-4);
  line-height: var(--line-height-relaxed);
}
```

### 3.3 Select / Dropdown

```css
.select-wrapper {
  position: relative;
  width: 100%;
}

.select {
  width: 100%;
  height: 44px;
  padding: var(--padding-input);
  padding-right: 40px;
  appearance: none;
  background-color: var(--color-white);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23757575' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  border: var(--border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-default);
}

.select:hover {
  border-color: var(--color-gray-400);
}

.select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-focus);
}
```

### 3.4 Checkbox

```css
.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  user-select: none;
}

.checkbox {
  position: relative;
  width: 20px;
  height: 20px;
  appearance: none;
  border: 2px solid var(--color-gray-400);
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  cursor: pointer;
  transition: var(--transition-default);
}

.checkbox:hover {
  border-color: var(--color-primary-500);
}

.checkbox:checked {
  background-color: var(--color-primary-500);
  border-color: var(--color-primary-500);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='9' viewBox='0 0 12 9' fill='none'%3E%3Cpath d='M1 4.5L4.5 8L11 1' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.checkbox:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.checkbox-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}
```

### 3.5 Radio Button

```css
.radio-wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  user-select: none;
}

.radio {
  position: relative;
  width: 20px;
  height: 20px;
  appearance: none;
  border: 2px solid var(--color-gray-400);
  border-radius: var(--radius-full);
  background-color: var(--color-white);
  cursor: pointer;
  transition: var(--transition-default);
}

.radio:hover {
  border-color: var(--color-primary-500);
}

.radio:checked {
  border-color: var(--color-primary-500);
  border-width: 6px;
}

.radio:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### 3.6 Switch / Toggle

```css
.switch-wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-3);
  cursor: pointer;
  user-select: none;
}

.switch {
  position: relative;
  width: 44px;
  height: 24px;
  appearance: none;
  background-color: var(--color-gray-300);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: var(--transition-default);
}

.switch::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: var(--color-white);
  border-radius: var(--radius-full);
  transition: var(--transition-transform);
  box-shadow: var(--shadow-sm);
}

.switch:checked {
  background-color: var(--color-primary-500);
}

.switch:checked::before {
  transform: translateX(20px);
}

.switch:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### 3.7 Cards

#### Base Card Component
```css
.card {
  /* Layout */
  padding: var(--padding-card);

  /* Visual */
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  border: var(--border-default);
  box-shadow: var(--shadow-sm);

  /* Animation */
  transition: var(--transition-default);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--spacing-4);
  border-bottom: var(--border-default);
  margin-bottom: var(--spacing-4);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin-top: var(--spacing-1);
}

.card-body {
  /* Content area */
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-4);
  border-top: var(--border-default);
  margin-top: var(--spacing-4);
}
```

#### Stat Card (for Dashboard Metrics)
```css
.stat-card {
  padding: var(--spacing-6);
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%);
  color: var(--color-white);
  border: none;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
}

.stat-value {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  margin-bottom: var(--spacing-2);
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.stat-change {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  margin-top: var(--spacing-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.stat-change.is-positive {
  color: var(--color-success-100);
}

.stat-change.is-negative {
  color: var(--color-error-100);
}
```

### 3.8 Badges & Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

/* Badge Variants */
.badge-primary {
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
}

.badge-success {
  background-color: var(--color-success-100);
  color: var(--color-success-700);
}

.badge-warning {
  background-color: var(--color-warning-100);
  color: var(--color-warning-700);
}

.badge-error {
  background-color: var(--color-error-100);
  color: var(--color-error-700);
}

.badge-info {
  background-color: var(--color-info-100);
  color: var(--color-info-700);
}

.badge-neutral {
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
}

/* Dot Variant */
.badge-dot {
  position: relative;
  padding-left: var(--spacing-5);
}

.badge-dot::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: currentColor;
}
```

### 3.9 Avatar

```css
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  overflow: hidden;
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Avatar Sizes */
.avatar-xs { width: 24px; height: 24px; font-size: var(--font-size-xs); }
.avatar-sm { width: 32px; height: 32px; font-size: var(--font-size-sm); }
.avatar-md { width: 40px; height: 40px; font-size: var(--font-size-base); }
.avatar-lg { width: 56px; height: 56px; font-size: var(--font-size-lg); }
.avatar-xl { width: 80px; height: 80px; font-size: var(--font-size-2xl); }

/* Avatar with Status Indicator */
.avatar-status {
  position: relative;
}

.avatar-status::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-white);
}

.avatar-status.is-online::after {
  background-color: var(--color-success-500);
}

.avatar-status.is-offline::after {
  background-color: var(--color-gray-400);
}

.avatar-status.is-busy::after {
  background-color: var(--color-error-500);
}
```

### 3.10 Modal / Dialog

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-index-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  opacity: 0;
  animation: fadeIn var(--duration-normal) var(--ease-out) forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.modal {
  position: relative;
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: var(--z-index-modal);
  transform: scale(0.9);
  animation: scaleIn var(--duration-normal) var(--ease-out) forwards;
}

@keyframes scaleIn {
  to { transform: scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6);
  border-bottom: var(--border-default);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-gray-600);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: var(--transition-default);
}

.modal-close:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  border-top: var(--border-default);
}

/* Modal Sizes */
.modal-sm { max-width: 400px; }
.modal-md { max-width: 600px; }
.modal-lg { max-width: 800px; }
.modal-xl { max-width: 1200px; }
```

### 3.11 Toast Notifications

```css
.toast-container {
  position: fixed;
  top: var(--spacing-6);
  right: var(--spacing-6);
  z-index: var(--z-index-notification);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  max-width: 400px;
  width: 100%;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid;
  animation: slideInRight var(--duration-normal) var(--ease-out);
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast.is-closing {
  animation: slideOutRight var(--duration-normal) var(--ease-in) forwards;
}

@keyframes slideOutRight {
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

.toast-success { border-left-color: var(--color-success-500); }
.toast-error { border-left-color: var(--color-error-500); }
.toast-warning { border-left-color: var(--color-warning-500); }
.toast-info { border-left-color: var(--color-info-500); }

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-1);
}

.toast-message {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  line-height: var(--line-height-normal);
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-gray-400);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: var(--transition-default);
}

.toast-close:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}
```

### 3.12 Progress Bar

```css
.progress {
  width: 100%;
  height: 8px;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: progressStripes 1s linear infinite;
}

@keyframes progressStripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}

/* Progress Variants */
.progress-success .progress-bar { background-color: var(--color-success-500); }
.progress-warning .progress-bar { background-color: var(--color-warning-500); }
.progress-error .progress-bar { background-color: var(--color-error-500); }

/* Progress Sizes */
.progress-sm { height: 4px; }
.progress-md { height: 8px; }
.progress-lg { height: 12px; }
```

### 3.13 Loading Spinner

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-gray-200);
  border-top-color: var(--color-primary-500);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-sm { width: 20px; height: 20px; border-width: 2px; }
.spinner-md { width: 40px; height: 40px; border-width: 4px; }
.spinner-lg { width: 60px; height: 60px; border-width: 6px; }

/* Button Loading Spinner */
.btn-loading .spinner {
  width: 16px;
  height: 16px;
  border-width: 2px;
  border-color: currentColor;
  border-top-color: transparent;
}
```

### 3.14 Tabs

```css
.tabs {
  display: flex;
  border-bottom: var(--border-default);
  gap: var(--spacing-2);
}

.tab {
  position: relative;
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-600);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-color);
  white-space: nowrap;
}

.tab:hover {
  color: var(--color-gray-900);
  background-color: var(--color-gray-50);
}

.tab.is-active {
  color: var(--color-primary-600);
  border-bottom-color: var(--color-primary-500);
}

.tab-panel {
  padding: var(--spacing-6) 0;
  display: none;
}

.tab-panel.is-active {
  display: block;
  animation: fadeIn var(--duration-fast) var(--ease-out);
}
```

### 3.15 Dropdown Menu

```css
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: var(--border-default);
  padding: var(--spacing-2) 0;
  z-index: var(--z-index-dropdown);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out),
              visibility var(--duration-fast);
}

.dropdown.is-open .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: var(--transition-color);
}

.dropdown-item:hover {
  background-color: var(--color-gray-50);
  color: var(--color-gray-900);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-gray-200);
  margin: var(--spacing-2) 0;
}
```

### 3.16 Table

```css
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: var(--border-default);
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-white);
}

.table thead {
  background-color: var(--color-gray-50);
  border-bottom: var(--border-default);
}

.table th {
  padding: var(--spacing-4);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-700);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.table td {
  padding: var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  border-bottom: 1px solid var(--color-gray-200);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: var(--color-gray-50);
}

/* Table Variants */
.table-striped tbody tr:nth-child(even) {
  background-color: var(--color-gray-50);
}

.table-compact td,
.table-compact th {
  padding: var(--spacing-2) var(--spacing-3);
}
```

---

## 4. Page Specifications

### 4.1 Login Page

#### Layout Structure
```
Desktop: Full screen split-screen layout
- Left: 50% - Branding/illustration area
- Right: 50% - Login form area
Minimum width: 1280px optimal, 768px minimum
Height: 100vh
```

#### HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Developer Report Dashboard</title>
</head>
<body>
  <div class="login-page">
    <!-- Left Panel: Branding -->
    <div class="login-brand-panel">
      <div class="login-brand-content">
        <img src="logo.svg" alt="Company Logo" class="login-logo" width="180" height="60">
        <h1 class="login-brand-title">Developer Report Dashboard</h1>
        <p class="login-brand-description">
          Track your productivity, earn points, and celebrate achievements with your team.
        </p>

        <!-- Feature Highlights -->
        <ul class="login-features">
          <li class="login-feature">
            <svg class="feature-icon">...</svg>
            <span>Real-time activity tracking</span>
          </li>
          <li class="login-feature">
            <svg class="feature-icon">...</svg>
            <span>Gamification & achievements</span>
          </li>
          <li class="login-feature">
            <svg class="feature-icon">...</svg>
            <span>Team collaboration insights</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Right Panel: Login Form -->
    <div class="login-form-panel">
      <div class="login-form-container">
        <div class="login-form-header">
          <h2 class="login-title">Welcome Back</h2>
          <p class="login-subtitle">Sign in to continue to your dashboard</p>
        </div>

        <div class="login-form-body">
          <!-- SSO Button -->
          <button class="btn-sso" id="microsoftSignIn">
            <svg class="btn-icon" width="20" height="20">
              <!-- Microsoft Logo SVG -->
            </svg>
            <span>Sign in with Microsoft</span>
          </button>

          <div class="divider">
            <span class="divider-text">or</span>
          </div>

          <!-- Email Login Form (Fallback) -->
          <form class="login-form" id="emailLoginForm">
            <div class="input-field">
              <label class="input-label" for="email">
                Email Address <span class="input-required">*</span>
              </label>
              <div class="input-icon-wrapper">
                <svg class="input-icon">...</svg>
                <input
                  type="email"
                  id="email"
                  class="input"
                  placeholder="name@company.com"
                  required
                  autocomplete="email"
                >
              </div>
              <span class="input-error" id="emailError"></span>
            </div>

            <button type="submit" class="btn-primary btn-block">
              <span>Continue</span>
            </button>
          </form>

          <!-- Help Text -->
          <p class="login-help">
            Don't have access?
            <a href="mailto:admin@company.com" class="login-link">Contact Administrator</a>
          </p>
        </div>

        <!-- Footer -->
        <div class="login-footer">
          <p class="login-footer-text">
            By signing in, you agree to our
            <a href="/terms" class="login-link">Terms of Service</a> and
            <a href="/privacy" class="login-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

#### CSS Specifications
```css
/* Login Page Container */
.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

/* Left Panel - Branding */
.login-brand-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-16);
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  color: var(--color-white);
  position: relative;
  overflow: hidden;
}

.login-brand-panel::before {
  content: '';
  position: absolute;
  top: -100px;
  left: -100px;
  width: 400px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-full);
}

.login-brand-content {
  max-width: 500px;
  z-index: 1;
}

.login-logo {
  margin-bottom: var(--spacing-8);
  filter: brightness(0) invert(1); /* White logo */
}

.login-brand-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-4);
}

.login-brand-description {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  opacity: 0.9;
  margin-bottom: var(--spacing-12);
}

.login-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.login-feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-6);
  opacity: 0.95;
}

.feature-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  color: var(--color-accent-500);
}

/* Right Panel - Form */
.login-form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
  background-color: var(--color-white);
}

.login-form-container {
  width: 100%;
  max-width: 440px;
}

.login-form-header {
  text-align: center;
  margin-bottom: var(--spacing-10);
}

.login-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-2);
}

.login-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
}

.login-form-body {
  margin-bottom: var(--spacing-8);
}

/* SSO Button */
.btn-sso {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  width: 100%;
  height: 52px;
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
  background-color: var(--color-white);
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-default);
  box-shadow: var(--shadow-sm);
}

.btn-sso:hover {
  border-color: var(--color-primary-500);
  background-color: var(--color-primary-50);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-sso:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-8) 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-gray-200);
}

.divider-text {
  position: relative;
  display: inline-block;
  padding: 0 var(--spacing-4);
  background-color: var(--color-white);
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

/* Login Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.btn-block {
  width: 100%;
}

.login-help {
  text-align: center;
  margin-top: var(--spacing-6);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.login-link {
  color: var(--color-primary-600);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: var(--transition-color);
}

.login-link:hover {
  color: var(--color-primary-700);
  text-decoration: underline;
}

/* Footer */
.login-footer {
  padding-top: var(--spacing-8);
  border-top: var(--border-default);
}

.login-footer-text {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  text-align: center;
  line-height: var(--line-height-relaxed);
}

/* Tablet Layout */
@media (max-width: 1023px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-brand-panel {
    display: none;
  }

  .login-form-panel {
    padding: var(--spacing-6);
  }
}

/* Mobile Layout */
@media (max-width: 767px) {
  .login-form-panel {
    padding: var(--spacing-4);
  }

  .login-form-container {
    max-width: 100%;
  }

  .login-title {
    font-size: var(--font-size-2xl);
  }
}
```

#### Interaction States
1. **Initial State**: Form ready for input
2. **Focus State**: Input field focused with blue border and shadow
3. **Validation State**: Real-time email validation
4. **Loading State**: Button shows spinner after click
5. **Error State**: Display error message for invalid credentials
6. **Redirect State**: Success message before dashboard redirect

#### Accessibility Features
- ARIA labels for all form elements
- Keyboard navigation support (Tab, Enter)
- Screen reader announcements for errors
- High contrast mode support
- Focus visible indicators
- Semantic HTML structure
- Alt text for all images

---

### 4.2 Developer Dashboard

#### Layout Structure
```
Grid Layout (Desktop):
- Top Stats: 4 columns (Points, Streak, Rank, Level)
- Main Content: 2 columns (8 + 4)
  - Left (8 cols): Events Feed, Report Form
  - Right (4 cols): Achievements, Leaderboard Preview
```

#### HTML Structure
```html
<div class="dashboard-container">
  <!-- Page Header -->
  <div class="dashboard-header">
    <div>
      <h1 class="dashboard-title">Welcome back, John Doe</h1>
      <p class="dashboard-subtitle">
        Here's what's happening with your productivity today
      </p>
    </div>
    <div class="dashboard-actions">
      <button class="btn-secondary">
        <svg class="icon">...</svg>
        <span>View Reports</span>
      </button>
      <button class="btn-primary" id="quickReportBtn">
        <svg class="icon">...</svg>
        <span>Submit Today's Report</span>
      </button>
    </div>
  </div>

  <!-- Top Stats Cards -->
  <div class="stats-grid">
    <!-- Points Card -->
    <div class="stat-card stat-card-primary">
      <div class="stat-icon">
        <svg>...</svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Total Points</div>
        <div class="stat-value">1,245</div>
        <div class="stat-change is-positive">
          <svg class="icon-arrow-up">...</svg>
          <span>+125 this week</span>
        </div>
      </div>
    </div>

    <!-- Streak Card -->
    <div class="stat-card stat-card-success">
      <div class="stat-icon">
        <svg>...</svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Current Streak</div>
        <div class="stat-value">15 days</div>
        <div class="stat-change is-positive">
          <svg class="icon-fire">...</svg>
          <span>Keep it up!</span>
        </div>
      </div>
    </div>

    <!-- Rank Card -->
    <div class="stat-card stat-card-accent">
      <div class="stat-icon">
        <svg>...</svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Team Rank</div>
        <div class="stat-value">#3</div>
        <div class="stat-change is-neutral">
          <span>of 12 members</span>
        </div>
      </div>
    </div>

    <!-- Level Card -->
    <div class="stat-card stat-card-gradient">
      <div class="stat-icon">
        <svg>...</svg>
      </div>
      <div class="stat-content">
        <div class="stat-label">Level</div>
        <div class="stat-value">Senior</div>
        <div class="progress progress-sm">
          <div class="progress-bar" style="width: 65%"></div>
        </div>
        <div class="stat-meta">850/1200 to Expert</div>
      </div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="dashboard-grid">
    <!-- Left Column -->
    <div class="dashboard-main">
      <!-- Today's Events Feed -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Today's Activity</h3>
            <p class="card-subtitle">Real-time updates from your tools</p>
          </div>
          <div class="card-actions">
            <button class="btn-icon btn-ghost" title="Refresh">
              <svg class="icon">...</svg>
            </button>
            <button class="btn-icon btn-ghost" title="Filter">
              <svg class="icon">...</svg>
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Events Timeline -->
          <div class="timeline">
            <!-- Event Item -->
            <div class="timeline-item">
              <div class="timeline-marker timeline-marker-success">
                <svg class="icon">...</svg>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-title">Merge Request Merged</span>
                  <span class="timeline-time">2 minutes ago</span>
                </div>
                <p class="timeline-description">
                  Feature/user-authentication merged into main
                </p>
                <div class="timeline-meta">
                  <span class="badge badge-success">+10 points</span>
                  <span class="timeline-source">GitLab</span>
                </div>
              </div>
            </div>

            <!-- Event Item -->
            <div class="timeline-item">
              <div class="timeline-marker timeline-marker-primary">
                <svg class="icon">...</svg>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-title">Code Review Completed</span>
                  <span class="timeline-time">15 minutes ago</span>
                </div>
                <p class="timeline-description">
                  Reviewed PR #234 - API endpoint optimization
                </p>
                <div class="timeline-meta">
                  <span class="badge badge-primary">+3 points</span>
                  <span class="timeline-source">GitLab</span>
                </div>
              </div>
            </div>

            <!-- Event Item -->
            <div class="timeline-item">
              <div class="timeline-marker timeline-marker-info">
                <svg class="icon">...</svg>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-title">Task Completed</span>
                  <span class="timeline-time">1 hour ago</span>
                </div>
                <p class="timeline-description">
                  Implement user authentication middleware
                </p>
                <div class="timeline-meta">
                  <span class="badge badge-info">+10 points</span>
                  <span class="timeline-source">OpenProject</span>
                </div>
              </div>
            </div>

            <!-- Event Item -->
            <div class="timeline-item">
              <div class="timeline-marker timeline-marker-warning">
                <svg class="icon">...</svg>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-title">Quality Gate Passed</span>
                  <span class="timeline-time">2 hours ago</span>
                </div>
                <p class="timeline-description">
                  Code analysis completed with 0 critical issues
                </p>
                <div class="timeline-meta">
                  <span class="badge badge-success">+15 points</span>
                  <span class="timeline-source">SonarQube</span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div class="timeline-empty" style="display: none;">
              <svg class="empty-icon">...</svg>
              <p class="empty-text">No activities yet today</p>
              <p class="empty-hint">Your events will appear here as you work</p>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn-ghost btn-sm">View All Activities</button>
        </div>
      </div>

      <!-- Quick Report Form -->
      <div class="card" id="reportCard">
        <div class="card-header">
          <div>
            <h3 class="card-title">Daily Report</h3>
            <p class="card-subtitle">
              Submission window: 3:00 PM - 11:59 PM
              <span class="badge badge-warning">Due in 4 hours</span>
            </p>
          </div>
        </div>
        <div class="card-body">
          <form id="dailyReportForm" class="report-form">
            <!-- Auto-populated Summary -->
            <div class="report-summary">
              <h4 class="report-section-title">Activity Summary</h4>
              <div class="report-stats">
                <div class="report-stat">
                  <span class="report-stat-value">8</span>
                  <span class="report-stat-label">Events</span>
                </div>
                <div class="report-stat">
                  <span class="report-stat-value">38</span>
                  <span class="report-stat-label">Points Earned</span>
                </div>
                <div class="report-stat">
                  <span class="report-stat-value">3</span>
                  <span class="report-stat-label">Tasks Completed</span>
                </div>
              </div>
            </div>

            <!-- Work Completed -->
            <div class="input-field">
              <label class="input-label" for="workCompleted">
                What did you accomplish today? <span class="input-required">*</span>
              </label>
              <textarea
                id="workCompleted"
                class="textarea"
                placeholder="Describe your completed tasks and achievements..."
                rows="4"
                required
                minlength="50"
              ></textarea>
              <span class="input-hint">
                <span id="workCompletedCount">0</span>/50 characters minimum
              </span>
            </div>

            <!-- Incidents/Blockers -->
            <div class="input-field">
              <label class="input-label" for="incidents">
                Any incidents or blockers? <span class="input-required">*</span>
              </label>
              <textarea
                id="incidents"
                class="textarea"
                placeholder="Describe any problems, blockers, or challenges you faced..."
                rows="3"
                required
                minlength="50"
              ></textarea>
              <span class="input-hint">
                Be specific about technical issues or team dependencies
              </span>
            </div>

            <!-- Help Needed -->
            <div class="input-field">
              <label class="input-label" for="helpNeeded">
                Do you need help with anything? (Optional)
              </label>
              <textarea
                id="helpNeeded"
                class="textarea"
                placeholder="Let your team know if you need assistance..."
                rows="2"
              ></textarea>
            </div>

            <!-- Team Recognition -->
            <div class="input-field">
              <label class="input-label" for="teamRecognition">
                Recognize a team member (Optional)
              </label>
              <div class="select-wrapper">
                <select id="teamRecognition" class="select">
                  <option value="">Select a team member...</option>
                  <option value="user1">Jane Smith - Frontend Developer</option>
                  <option value="user2">Mike Johnson - Backend Developer</option>
                  <option value="user3">Sarah Williams - QA Engineer</option>
                </select>
              </div>
            </div>

            <div class="input-field" id="recognitionReasonField" style="display: none;">
              <label class="input-label" for="recognitionReason">
                Why do they deserve recognition?
              </label>
              <textarea
                id="recognitionReason"
                class="textarea"
                placeholder="Describe how they helped you or the team..."
                rows="2"
              ></textarea>
            </div>

            <!-- Tomorrow's Priorities -->
            <div class="input-field">
              <label class="input-label" for="tomorrowPlan">
                What are your priorities for tomorrow?
              </label>
              <textarea
                id="tomorrowPlan"
                class="textarea"
                placeholder="List 3-5 key tasks or goals for tomorrow..."
                rows="3"
              ></textarea>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn-ghost">Save Draft</button>
              <button type="submit" class="btn-primary">
                <span>Submit Report</span>
                <span class="badge badge-success" style="margin-left: 8px;">+10 points</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Right Sidebar -->
    <div class="dashboard-sidebar">
      <!-- Achievements Panel -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Achievements</h3>
        </div>
        <div class="card-body">
          <div class="achievements-grid">
            <!-- Achievement Badge -->
            <div class="achievement achievement-unlocked" title="Early Bird">
              <div class="achievement-icon">
                <svg>...</svg>
              </div>
              <span class="achievement-name">Early Bird</span>
            </div>

            <div class="achievement achievement-unlocked" title="Team Player">
              <div class="achievement-icon">
                <svg>...</svg>
              </div>
              <span class="achievement-name">Team Player</span>
            </div>

            <div class="achievement achievement-locked" title="Quality Champion">
              <div class="achievement-icon">
                <svg>...</svg>
              </div>
              <span class="achievement-name">Quality Champion</span>
              <div class="achievement-progress">
                <span>15/30 days</span>
              </div>
            </div>

            <div class="achievement achievement-locked" title="Productivity Star">
              <div class="achievement-icon">
                <svg>...</svg>
              </div>
              <span class="achievement-name">Productivity Star</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn-ghost btn-sm">View All Achievements</button>
        </div>
      </div>

      <!-- Leaderboard Preview -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Team Leaderboard</h3>
          <button class="btn-ghost btn-sm">View All</button>
        </div>
        <div class="card-body">
          <div class="leaderboard-list">
            <!-- Leaderboard Item -->
            <div class="leaderboard-item">
              <div class="leaderboard-rank leaderboard-rank-1">1</div>
              <div class="avatar avatar-sm">
                <img src="user1.jpg" alt="Sarah Williams" class="avatar-img">
              </div>
              <div class="leaderboard-info">
                <span class="leaderboard-name">Sarah Williams</span>
                <span class="leaderboard-points">1,450 pts</span>
              </div>
              <div class="leaderboard-trend is-up">
                <svg class="icon">...</svg>
              </div>
            </div>

            <div class="leaderboard-item">
              <div class="leaderboard-rank leaderboard-rank-2">2</div>
              <div class="avatar avatar-sm">
                <img src="user2.jpg" alt="Mike Johnson" class="avatar-img">
              </div>
              <div class="leaderboard-info">
                <span class="leaderboard-name">Mike Johnson</span>
                <span class="leaderboard-points">1,320 pts</span>
              </div>
              <div class="leaderboard-trend is-up">
                <svg class="icon">...</svg>
              </div>
            </div>

            <div class="leaderboard-item is-current-user">
              <div class="leaderboard-rank">3</div>
              <div class="avatar avatar-sm">
                <img src="user-current.jpg" alt="You" class="avatar-img">
              </div>
              <div class="leaderboard-info">
                <span class="leaderboard-name">You</span>
                <span class="leaderboard-points">1,245 pts</span>
              </div>
              <div class="leaderboard-trend is-same">
                <svg class="icon">...</svg>
              </div>
            </div>

            <div class="leaderboard-item">
              <div class="leaderboard-rank">4</div>
              <div class="avatar avatar-sm">
                <span>JD</span>
              </div>
              <div class="leaderboard-info">
                <span class="leaderboard-name">Jane Doe</span>
                <span class="leaderboard-points">1,180 pts</span>
              </div>
              <div class="leaderboard-trend is-down">
                <svg class="icon">...</svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">This Week</h3>
        </div>
        <div class="card-body">
          <div class="quick-stats">
            <div class="quick-stat">
              <div class="quick-stat-label">Reports Submitted</div>
              <div class="quick-stat-value">5/5</div>
              <div class="progress progress-sm progress-success">
                <div class="progress-bar" style="width: 100%"></div>
              </div>
            </div>

            <div class="quick-stat">
              <div class="quick-stat-label">Commits</div>
              <div class="quick-stat-value">23</div>
              <div class="progress progress-sm">
                <div class="progress-bar" style="width: 76%"></div>
              </div>
            </div>

            <div class="quick-stat">
              <div class="quick-stat-label">Code Reviews</div>
              <div class="quick-stat-value">8</div>
              <div class="progress progress-sm">
                <div class="progress-bar" style="width: 53%"></div>
              </div>
            </div>

            <div class="quick-stat">
              <div class="quick-stat-label">Tasks Completed</div>
              <div class="quick-stat-value">12</div>
              <div class="progress progress-sm">
                <div class="progress-bar" style="width: 80%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

This is Part 1 of the comprehensive UI/UX specifications. The document continues with additional page specifications, component details, user flows, accessibility requirements, animations, state management, error handling, and real-time update mechanisms.

Would you like me to continue with the remaining sections?

---

*Document continues with:*
- 4.3 Team Lead Dashboard
- 4.4 Admin Dashboard
- 4.5 Leaderboards Page
- 4.6 User Profile & Settings
- 4.7 Notification Center
- Section 5: User Flows
- Section 6: Accessibility Requirements (WCAG 2.1 AA)
- Section 7: Animation & Micro-interactions
- Section 8: State Management
- Section 9: Error Handling & Validation
- Section 10: Real-time Update Mechanisms
