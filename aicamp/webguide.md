# Online Training Companion — UI/UX Design Guidelines

**Version:** v1.0
**Date:** 2025-09-25
**Purpose:** Comprehensive design system for compact, professional, responsive web interface

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Typography System](#typography-system)
3. [Color System](#color-system)
4. [Spacing & Layout](#spacing--layout)
5. [Responsive Grid System](#responsive-grid-system)
6. [Component Library](#component-library)
7. [Mode-Specific Layouts](#mode-specific-layouts)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Animation & Micro-interactions](#animation--micro-interactions)
10. [Brand Integration](#brand-integration)

---

## Design Principles

### 1. Content Density First
- **Minimize whitespace** to maximize information display
- Use **tight line-heights** (1.3-1.4) for readability without waste
- **Compact padding** (8px-12px) for most components
- **Efficient use of vertical space** with strategic stacking

### 2. Professional Aesthetics
- **Clean, minimal interface** with purposeful elements only
- **Subtle shadows** and borders for depth without clutter
- **Consistent visual hierarchy** through typography and spacing
- **Professional color palette** suitable for corporate environments

### 3. Responsive Efficiency
- **Mobile-first approach** with progressive enhancement
- **Collapsible panels** to preserve screen real estate
- **Context-aware navigation** that adapts to screen size
- **Touch-optimized** interactions for all devices

---

## Typography System

### Font Stack (Priority Order)
```css
/* Primary: System UI for maximum performance */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Fallback for code/monospace */
font-family: "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace;
```

### Typography Scale
```css
/* Compact scale optimized for content density */
--text-xs: 0.75rem;    /* 12px - Helper text, labels */
--text-sm: 0.875rem;   /* 14px - Body secondary, captions */
--text-base: 1rem;     /* 16px - Body primary, default */
--text-lg: 1.125rem;   /* 18px - Subheadings, emphasis */
--text-xl: 1.25rem;    /* 20px - Card titles, section headers */
--text-2xl: 1.5rem;    /* 24px - Page titles, major headings */
--text-3xl: 1.875rem;  /* 30px - Hero titles (rare usage) */
```

### Line Heights (Compact)
```css
--leading-tight: 1.25;   /* Headlines, titles */
--leading-snug: 1.375;   /* Subheads, short text blocks */
--leading-normal: 1.4;   /* Body text, paragraphs */
--leading-relaxed: 1.5;  /* Long-form content only */
```

### Font Weights
```css
--font-normal: 400;    /* Body text, default */
--font-medium: 500;    /* Emphasis, labels */
--font-semibold: 600;  /* Headings, important UI text */
--font-bold: 700;      /* Major headings, alerts */
```

---

## Color System

### Light Mode Palette
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;  /* Primary brand color */
--primary-600: #2563eb;  /* Primary hover/active */
--primary-700: #1d4ed8;  /* Primary pressed */
--primary-900: #1e3a8a;  /* Primary text on light bg */

/* Neutral Colors (Optimized for readability) */
--neutral-50: #fafafa;   /* Background light */
--neutral-100: #f5f5f5;  /* Background secondary */
--neutral-200: #e5e5e5;  /* Borders, dividers */
--neutral-300: #d4d4d4;  /* Disabled states */
--neutral-400: #a3a3a3;  /* Placeholder text */
--neutral-500: #737373;  /* Secondary text */
--neutral-600: #525252;  /* Primary text light */
--neutral-700: #404040;  /* Headings */
--neutral-800: #262626;  /* High contrast text */
--neutral-900: #171717;  /* Maximum contrast */

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Dark Mode Palette
```css
/* Dark mode optimizations for OLED efficiency */
--dark-bg-primary: #0a0a0a;    /* True black for OLED */
--dark-bg-secondary: #1a1a1a;  /* Elevated surfaces */
--dark-bg-tertiary: #262626;   /* Cards, panels */

--dark-text-primary: #fafafa;   /* High contrast */
--dark-text-secondary: #d4d4d4; /* Medium contrast */
--dark-text-tertiary: #a3a3a3;  /* Low contrast */

/* Primary colors adjusted for dark mode */
--dark-primary: #60a5fa;       /* Lighter blue for contrast */
--dark-primary-hover: #3b82f6; /* Standard blue */
```

### WCAG 3.0 AA Compliance
- **Minimum contrast ratios**: 4.5:1 for normal text, 3:1 for large text
- **Focus indicators**: 3:1 contrast with 2px minimum thickness
- **Interactive elements**: Clear visual states for hover, focus, active, disabled

---

## Spacing & Layout

### Spacing Scale (Compact System)
```css
--space-1: 0.25rem;  /* 4px - Micro spacing */
--space-2: 0.5rem;   /* 8px - Component internal padding */
--space-3: 0.75rem;  /* 12px - Small gaps, tight layouts */
--space-4: 1rem;     /* 16px - Standard spacing unit */
--space-5: 1.25rem;  /* 20px - Section spacing */
--space-6: 1.5rem;   /* 24px - Card padding */
--space-8: 2rem;     /* 32px - Large section breaks */
--space-12: 3rem;    /* 48px - Major layout spacing */
```

### Layout Principles
- **Base unit**: 16px (1rem) for consistent rhythm
- **Tight gutters**: 12-16px between columns on mobile
- **Compact cards**: 16-24px internal padding
- **Minimal margins**: 8-16px between related elements

---

## Responsive Grid System

### Breakpoints
```css
--mobile: 320px;     /* Minimum support */
--tablet: 768px;     /* Tablet portrait */
--desktop: 1280px;   /* Desktop minimum */
--wide: 1440px;      /* Wide desktop */
```

### Grid Specifications

#### Desktop (≥1280px)
```css
.container-desktop {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 280px 1fr 320px; /* Sidebar, Main, Utility */
  gap: 24px;
  min-height: 100vh;
}
```

#### Tablet (≥768px)
```css
.container-tablet {
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Collapsible sidebar as overlay */
.sidebar-tablet {
  position: fixed;
  width: 280px;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
```

#### Mobile (<768px)
```css
.container-mobile {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Bottom navigation for mobile */
.nav-mobile {
  position: fixed;
  bottom: 0;
  height: 60px;
  background: var(--neutral-50);
  border-top: 1px solid var(--neutral-200);
}
```

---

## Component Library

### 1. Navigation Components

#### Header (All Screens)
```css
.header {
  height: 60px;
  padding: 0 var(--space-4);
  background: var(--neutral-50);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--neutral-800);
}

.header-meta {
  font-size: var(--text-sm);
  color: var(--neutral-500);
}
```

#### Sidebar (Desktop/Tablet)
```css
.sidebar {
  width: 280px;
  background: var(--neutral-100);
  padding: var(--space-4);
  border-right: 1px solid var(--neutral-200);
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: var(--space-6);
}

.sidebar-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}
```

### 2. Q&A System Components

#### QABar (Ask Input)
```css
.qa-bar {
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  padding: var(--space-3);
  margin-bottom: var(--space-4);
}

.qa-input {
  width: 100%;
  min-height: 80px;
  max-height: 120px;
  border: none;
  resize: vertical;
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  padding: var(--space-2);
}

.qa-submit {
  height: 36px;
  padding: 0 var(--space-4);
  background: var(--primary-500);
  color: white;
  border-radius: 6px;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
}
```

#### QuestionItem
```css
.question-item {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  position: relative;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.question-handle {
  font-size: var(--text-xs);
  color: var(--neutral-500);
  font-weight: var(--font-medium);
}

.question-status {
  font-size: var(--text-xs);
  padding: var(--space-1) var(--space-2);
  border-radius: 4px;
  font-weight: var(--font-medium);
}

.question-text {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--neutral-700);
  margin-bottom: var(--space-3);
}

.question-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

#### UpvoteButton
```css
.upvote-button {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--neutral-200);
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
  min-width: 44px;
  min-height: 44px;
}

.upvote-button[aria-pressed="true"] {
  background: var(--primary-50);
  border-color: var(--primary-500);
  color: var(--primary-700);
}

.upvote-button:hover {
  background: var(--neutral-50);
  border-color: var(--neutral-300);
}

.upvote-count {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}
```

### 3. Slide Viewer Components

#### SlideContainer
```css
.slide-container {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.slide-viewer {
  width: 100%;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-50);
}

.slide-controls {
  position: absolute;
  bottom: var(--space-4);
  right: var(--space-4);
  display: flex;
  gap: var(--space-2);
  background: rgba(0, 0, 0, 0.8);
  padding: var(--space-2);
  border-radius: 6px;
}

.slide-nav-button {
  width: 44px;
  height: 44px;
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}
```

### 4. Feedback Components

#### FeedbackBar
```css
.feedback-bar {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
}

.feedback-button {
  flex: 1;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral-300);
  border-radius: 6px;
  background: white;
  font-size: var(--text-lg);
  transition: all 0.2s;
}

.feedback-button:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feedback-button.active {
  border-color: var(--primary-500);
  background: var(--primary-50);
}
```

### 5. Certificate Components

#### CertificateCard
```css
.certificate-card {
  background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
  border: 2px solid var(--primary-200);
  border-radius: 12px;
  padding: var(--space-6);
  text-align: center;
  position: relative;
}

.certificate-icon {
  width: 64px;
  height: 64px;
  background: var(--primary-500);
  border-radius: 50%;
  margin: 0 auto var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--text-2xl);
}

.certificate-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--neutral-800);
  margin-bottom: var(--space-2);
}

.certificate-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-4);
}
```

---

## Mode-Specific Layouts

### Pre-Training Mode

#### Layout Structure
```css
.pre-training-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-6);
}

.pre-training-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.pre-training-content {
  display: grid;
  gap: var(--space-6);
}

.countdown-timer {
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: 12px;
  padding: var(--space-6);
  text-align: center;
}
```

#### Components
- **Session Header**: Title, trainer info, avatar (64px)
- **Agenda Section**: Compact timeline with minimal whitespace
- **Expectation Input**: Single textarea with submit button
- **Countdown**: Large numbers with minimal decoration
- **Resources**: Single download button, prominently placed

### In-Training Mode

#### Desktop Layout
```css
.in-training-desktop {
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  gap: var(--space-4);
  padding: var(--space-4);
}

.slide-main {
  grid-column: 1;
  grid-row: 2;
  position: relative;
}

.utility-panel {
  grid-column: 2;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow-y: auto;
}
```

#### Mobile Layout
```css
.in-training-mobile {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.slide-mobile {
  flex: 1;
  position: relative;
}

.mobile-tabs {
  height: 60px;
  background: var(--neutral-50);
  border-top: 1px solid var(--neutral-200);
  display: flex;
}

.mobile-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}
```

### Post-Training Mode

#### Layout Structure
```css
.post-training-layout {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  min-height: 100vh;
}

.completion-banner {
  background: var(--success);
  color: white;
  padding: var(--space-6);
  border-radius: 12px;
  text-align: center;
}

.feedback-survey {
  background: white;
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  padding: var(--space-6);
}
```

---

## Accessibility Guidelines

### Focus Management
```css
/* High-contrast focus indicators */
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip links for screen readers */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--neutral-900);
  color: white;
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  z-index: 9999;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
- **Live regions**: Minimal, targeted announcements only
- **ARIA labels**: Descriptive, context-aware
- **Landmarks**: Proper semantic structure
- **Roving tabindex**: For complex widgets like Q&A list

### Touch Targets
- **Minimum size**: 44x44px for all interactive elements
- **Spacing**: 8px minimum between adjacent targets
- **Visual feedback**: Clear hover/active states

### Color & Contrast
- **4.5:1 contrast** minimum for all text
- **3:1 contrast** for large text and UI elements
- **Color independence**: No information conveyed by color alone

---

## Animation & Micro-interactions

### Animation Principles
- **Performance first**: Prefer transforms and opacity
- **Subtle motion**: 200-300ms duration for most transitions
- **Respectful**: Honor `prefers-reduced-motion` settings
- **Purposeful**: Enhance understanding, not decoration

### Key Animations
```css
/* Question submission feedback */
.question-submit-success {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Upvote button interaction */
.upvote-button:active {
  transform: scale(0.95);
}

/* Slide transition */
.slide-transition {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Status change notifications */
.status-update {
  animation: pulseOnce 0.6s ease-out;
}

@keyframes pulseOnce {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Brand Integration

### Customization Points
```css
:root {
  /* Brand colors (customizable) */
  --brand-primary: var(--primary-500);
  --brand-secondary: var(--neutral-600);
  --brand-accent: var(--primary-100);

  /* Logo dimensions */
  --logo-height: 32px;
  --logo-width: auto;

  /* Border radius (brand personality) */
  --brand-radius: 8px; /* Moderate rounded corners */

  /* Shadow style */
  --brand-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

/* Professional brand variants */
.brand-minimal {
  --brand-radius: 4px;
  --brand-shadow: none;
}

.brand-friendly {
  --brand-radius: 12px;
  --brand-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### Certificate Customization
```css
.certificate-custom {
  /* Organization logo placement */
  background-image: var(--org-logo-watermark);
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: 120px;

  /* Custom colors */
  border-color: var(--org-primary);
  background: linear-gradient(135deg, var(--org-primary-light) 0%, white 100%);
}
```

---

## Implementation Notes

### CSS Custom Properties Strategy
Use CSS custom properties for all themeable values to enable runtime customization without rebuild.

### Component Naming Convention
Follow BEM methodology for predictable, maintainable CSS:
```css
.component-name {}
.component-name__element {}
.component-name--modifier {}
```

### Performance Considerations
- **Critical CSS**: Inline above-the-fold styles
- **Font loading**: Use `font-display: swap` for custom fonts
- **Image optimization**: WebP with fallbacks
- **CSS containment**: Use `contain` property for isolated components

### Browser Support
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Graceful degradation**: Progressive enhancement approach
- **Polyfills**: Only for critical functionality

---

## Quality Checklist

### Visual Review
- [ ] All text meets WCAG 3.0 AA contrast ratios
- [ ] Interactive elements are minimum 44x44px
- [ ] Focus indicators are clearly visible
- [ ] Spacing is consistent with design system
- [ ] Typography hierarchy is clear and logical

### Responsive Testing
- [ ] Layout works at 320px width (minimum mobile)
- [ ] Touch targets are appropriately sized
- [ ] Content is readable without horizontal scrolling
- [ ] Navigation is accessible on all screen sizes

### Accessibility Testing
- [ ] Screen reader announces all important information
- [ ] Keyboard navigation reaches all interactive elements
- [ ] Color is not the only way information is conveyed
- [ ] Animation respects reduced motion preferences

### Performance Validation
- [ ] Page loads in under 3 seconds on 3G
- [ ] Critical path CSS is under 15KB
- [ ] No layout shifts during load (CLS < 0.1)
- [ ] Smooth animations at 60fps

---

*This design system prioritizes content density, professional aesthetics, and universal accessibility while maintaining high performance across all devices and contexts.*