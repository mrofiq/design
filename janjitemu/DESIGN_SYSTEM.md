# JanjiTemu Design System
## Gusto-Inspired Clinical Booking Interface

---

## Design Philosophy

Clean, minimal, mobile-first design that prioritizes clarity, accessibility, and user confidence in healthcare booking. Inspired by Gusto's approachable interface while maintaining medical professionalism.

---

## Color System

### Primary Colors
```
Primary Green (Brand):     #008577  (Dark Teal/Green)
Primary Green Light:       #00A68F  (Hover state)
Primary Green Dark:        #006B5F  (Active state)
Primary Green Ultra Light: #E6F5F3  (Backgrounds, selected states)
```

### Neutral Colors
```
Neutral 900 (Headings):    #1A1A1A
Neutral 700 (Body):        #4A4A4A
Neutral 500 (Subtext):     #757575
Neutral 300 (Borders):     #D1D1D1
Neutral 100 (Backgrounds): #F7F7F7
White:                     #FFFFFF
```

### Semantic Colors
```
Success:                   #00A68F  (Same as primary)
Warning:                   #F59E0B
Error:                     #EF4444
Info:                      #3B82F6
```

### Color Usage Guidelines
- **Primary Green**: CTAs, selected states, progress indicators, active elements
- **Neutral 900**: Page titles, card headings, doctor names
- **Neutral 700**: Body text, form labels, descriptions
- **Neutral 500**: Supporting text, placeholders, metadata
- **Backgrounds**: White for cards, Neutral 100 for page backgrounds

---

## Typography

### Font Stack
```css
Primary Font:   'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Fallback:       system-ui, sans-serif
```

### Type Scale (Mobile-First)

```
Display (Page Titles):
  - Mobile: 28px / 1.2 / Bold (700)
  - Desktop: 32px / 1.2 / Bold (700)

Heading 1 (Section Headers):
  - Mobile: 24px / 1.3 / Semibold (600)
  - Desktop: 28px / 1.3 / Semibold (600)

Heading 2 (Card Titles):
  - Mobile: 20px / 1.4 / Semibold (600)
  - Desktop: 22px / 1.4 / Semibold (600)

Heading 3 (Subsections):
  - Mobile: 18px / 1.4 / Medium (500)
  - Desktop: 20px / 1.4 / Medium (500)

Body Large:
  - 16px / 1.5 / Regular (400)

Body (Default):
  - 15px / 1.6 / Regular (400)

Body Small:
  - 14px / 1.5 / Regular (400)

Caption:
  - 13px / 1.4 / Regular (400)

Button Text:
  - 15px / 1 / Medium (500)
```

### Typography Guidelines
- Maximum line length: 70 characters for readability
- Paragraph spacing: 16px
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text (WCAG AA)

---

## Spacing System

Base unit: 4px (0.25rem)

```
Spacing Scale:
  xs:   4px   (0.25rem)  - Icon padding, tight spacing
  sm:   8px   (0.5rem)   - Component internal spacing
  md:   12px  (0.75rem)  - Between related elements
  lg:   16px  (1rem)     - Between components
  xl:   24px  (1.5rem)   - Between sections
  2xl:  32px  (2rem)     - Page margins, major sections
  3xl:  48px  (3rem)     - Hero sections, large gaps
```

### Spacing Application
- **Component Padding**: 16px (mobile), 20px (desktop)
- **Card Padding**: 20px (mobile), 24px (desktop)
- **Section Gaps**: 24px minimum
- **Page Margins**: 16px (mobile), 24px (tablet), 32px (desktop)

---

## Border Radius

```
Button Radius:       8px   (Small elements)
Input Radius:        8px   (Form fields)
Card Radius:         12px  (Cards, containers)
Large Card Radius:   16px  (Feature cards, modals)
Avatar Radius:       50%   (Circular)
```

---

## Shadows

```css
/* Card Shadow - Resting */
shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08),
           0 1px 2px rgba(0, 0, 0, 0.04);

/* Card Shadow - Hover/Active */
shadow-md: 0 4px 8px rgba(0, 0, 0, 0.10),
           0 2px 4px rgba(0, 0, 0, 0.06);

/* Modal Shadow */
shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15),
           0 4px 10px rgba(0, 0, 0, 0.08);

/* Focus Ring */
focus-ring: 0 0 0 3px rgba(0, 133, 119, 0.2);
```

---

## Interactive Elements

### Touch Target Sizes (Mobile-First)
```
Minimum Touch Target:  48px × 48px (WCAG AAA)
Comfortable Target:    56px × 56px
Button Height:         48px (mobile), 44px (desktop)
Input Height:          48px (mobile), 44px (desktop)
Checkbox/Radio:        24px × 24px (visible), 48px touch area
Icon Button:           48px × 48px
```

### Button Styles

**Primary Button**
```
Background:    #008577
Text:          #FFFFFF
Padding:       12px 24px
Border Radius: 8px
Font:          15px Medium
Min Width:     120px

States:
  Hover:    background #00A68F
  Active:   background #006B5F
  Disabled: background #D1D1D1, text #757575
  Focus:    focus-ring
```

**Secondary Button**
```
Background:    #FFFFFF
Text:          #008577
Border:        2px solid #008577
Padding:       12px 24px
Border Radius: 8px

States:
  Hover:    background #E6F5F3
  Active:   background #D1F0EB
  Disabled: border #D1D1D1, text #757575
```

**Ghost Button**
```
Background:    transparent
Text:          #008577
Padding:       12px 16px

States:
  Hover:    background #E6F5F3
  Active:   background #D1F0EB
```

### Input Fields

**Text Input**
```
Height:        48px (mobile), 44px (desktop)
Padding:       12px 16px
Border:        1px solid #D1D1D1
Border Radius: 8px
Font:          15px Regular

States:
  Focus:     border #008577, focus-ring
  Error:     border #EF4444
  Disabled:  background #F7F7F7, text #757575

Label:
  Position:  Above input, 8px gap
  Font:      14px Medium, color #4A4A4A

Helper Text:
  Font:      13px Regular, color #757575
  Position:  Below input, 4px gap

Error Text:
  Font:      13px Regular, color #EF4444
  Icon:      Error icon before text
```

### Selection Controls

**Radio Button**
```
Size:          24px × 24px (visible)
Touch Area:    48px × 48px
Border:        2px solid #D1D1D1
Border Radius: 50%

Selected:
  Border:      2px solid #008577
  Inner Dot:   12px diameter, #008577

Label:
  Font:        15px Regular
  Position:    Right side, 12px gap
  Vertical:    Center aligned
```

**Checkbox**
```
Size:          24px × 24px (visible)
Touch Area:    48px × 48px
Border:        2px solid #D1D1D1
Border Radius: 4px

Checked:
  Background:  #008577
  Checkmark:   White, 16px icon

Label: Same as radio button
```

**Toggle Switch**
```
Width:         48px
Height:        28px
Border Radius: 14px
Thumb:         24px diameter

Off State:
  Background:  #D1D1D1
  Thumb:       #FFFFFF, left position

On State:
  Background:  #008577
  Thumb:       #FFFFFF, right position
```

---

## Cards

### Standard Card
```
Background:    #FFFFFF
Border Radius: 12px
Shadow:        shadow-sm
Padding:       20px (mobile), 24px (desktop)
Border:        1px solid #F7F7F7 (optional)

Hover State:
  Shadow:      shadow-md
  Transform:   translateY(-2px)
  Transition:  all 0.2s ease
```

### Selectable Card
```
Same as Standard Card, plus:

Default:
  Border:      2px solid transparent

Selected:
  Border:      2px solid #008577
  Background:  #E6F5F3

Focus:
  Box-shadow:  focus-ring
```

---

## Loading States

### Spinner
```
Size:          32px × 32px
Color:         #008577
Border Width:  3px
Animation:     spin 0.8s linear infinite
```

### Skeleton
```
Background:    linear-gradient(90deg,
               #F7F7F7 0%,
               #E6E6E6 50%,
               #F7F7F7 100%)
Border Radius: Matches content shape
Animation:     shimmer 1.5s infinite
```

### Progress Bar
```
Height:        4px
Background:    #E6F5F3
Fill:          #008577
Border Radius: 2px
Animation:     Smooth transition 0.3s
```

---

## Icons

### Icon System
- **Library**: Heroicons (outline for default, solid for filled states)
- **Size Scale**: 16px (small), 20px (medium), 24px (large), 32px (xlarge)
- **Color**: Inherit from parent or #4A4A4A (neutral 700)
- **Stroke Width**: 2px for outlines

### Common Icon Usage
```
Checkmark:     Success states, completed steps
X / Close:     Errors, dismissals, close actions
Calendar:      Date selection
Clock:         Time selection
User:          Patient information
CreditCard:    Payment methods
ChevronRight:  Navigation, next step
ChevronDown:   Dropdowns, expandables
Info:          Help text, tooltips
Alert:         Warnings, important info
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

Mobile (Default):    320px - 767px   (base styles)
Tablet:              768px - 1023px  (medium layouts)
Desktop:             1024px - 1439px (full features)
Wide Desktop:        1440px+         (max-width content)

/* Breakpoint Variables */
$mobile:      320px
$tablet:      768px
$desktop:     1024px
$wide:        1440px

/* Container Max Widths */
Mobile:       100% (16px margins)
Tablet:       720px
Desktop:      960px
Wide:         1200px
```

### Layout Patterns

**Mobile (Default)**
- Single column
- Full-width cards (16px margins)
- Stacked form fields
- Bottom-fixed CTAs (when appropriate)

**Tablet**
- Single or two-column layouts
- Cards with more padding
- Side-by-side form fields (when logical)

**Desktop**
- Multi-column layouts
- Wider cards with max-width
- Horizontal form layouts
- Floating CTAs return to inline

---

## Animation & Transitions

### Timing Functions
```css
ease-out:      cubic-bezier(0.0, 0.0, 0.2, 1)   /* Enter */
ease-in:       cubic-bezier(0.4, 0.0, 1, 1)     /* Exit */
ease-in-out:   cubic-bezier(0.4, 0.0, 0.2, 1)   /* Move */
```

### Duration Scale
```
instant:       100ms  (color changes)
fast:          200ms  (small movements, fades)
normal:        300ms  (standard transitions)
slow:          500ms  (large movements, slides)
```

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Shimmer (Loading) */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Spin (Loading) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Motion Principles
- **Purposeful**: Animations should guide attention and indicate state changes
- **Subtle**: Prefer gentle, quick animations over dramatic effects
- **Respectful**: Honor prefers-reduced-motion for accessibility
- **Consistent**: Use the same duration/easing for similar actions

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast**
- Body text: Minimum 4.5:1 (using #4A4A4A on #FFFFFF = 9.4:1)
- Large text (18px+): Minimum 3:1
- UI components: Minimum 3:1 against background

**Focus Indicators**
- Visible focus ring on all interactive elements
- Focus ring: 3px, #008577 at 20% opacity, 0px offset
- Never remove focus outline without replacement
- Skip link for keyboard navigation

**Keyboard Navigation**
- All interactive elements accessible via Tab
- Logical tab order follows visual flow
- Enter/Space activates buttons
- Arrow keys navigate radio groups, date pickers
- Escape closes modals, dropdowns

**Screen Reader Support**
- Semantic HTML (button, input, label, etc.)
- ARIA labels where needed (aria-label, aria-describedby)
- Form validation announces errors
- Loading states announced (aria-live regions)
- Progress communicated (aria-valuenow, aria-valuemax)

**Touch Accessibility**
- Minimum 48px touch targets
- Adequate spacing between interactive elements (8px minimum)
- No reliance on hover-only interactions

**Motion Sensitivity**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Empty States & Illustrations

### Empty State Pattern
```
Illustration:    Simple, friendly SVG (max 200px height)
Heading:         H3, Neutral 900
Description:     Body text, Neutral 700
CTA:             Primary or Secondary button
Spacing:         Center aligned, 24px between elements
```

### Illustration Style
- **Color Palette**: Primary green + neutrals + single accent color
- **Style**: Minimal line art or flat illustrations
- **Tone**: Friendly, approachable, non-clinical
- **Size**: Responsive, max 200px mobile, 280px desktop

### Common Empty States
- No available time slots: "All booked! Try another date"
- No doctors available: "No doctors match your search"
- Form errors: "Please check the highlighted fields"
- Payment pending: "Waiting for payment confirmation..."

---

## Component Specifications Summary

### Core Components Needed
1. **Navigation**: Progress stepper, breadcrumbs
2. **Forms**: Text input, phone input, select, radio, checkbox
3. **Cards**: Doctor card, time slot card, payment method card
4. **Buttons**: Primary, secondary, ghost, icon button
5. **Feedback**: Toast notification, inline error, success message
6. **Loading**: Spinner, skeleton, progress bar
7. **Calendar**: Date picker with disabled states
8. **Modal**: Confirmation, payment details
9. **Badge**: Status indicator, step number
10. **Avatar**: Doctor photo placeholder

---

## Design Tokens (Implementation Ready)

```javascript
// tokens.js
export const tokens = {
  colors: {
    primary: {
      DEFAULT: '#008577',
      light: '#00A68F',
      dark: '#006B5F',
      ultraLight: '#E6F5F3'
    },
    neutral: {
      900: '#1A1A1A',
      700: '#4A4A4A',
      500: '#757575',
      300: '#D1D1D1',
      100: '#F7F7F7'
    },
    semantic: {
      success: '#00A68F',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    white: '#FFFFFF'
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px'
  },

  borderRadius: {
    button: '8px',
    input: '8px',
    card: '12px',
    cardLarge: '16px',
    full: '9999px'
  },

  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    fontSize: {
      display: ['28px', '32px'],
      h1: ['24px', '28px'],
      h2: ['20px', '22px'],
      h3: ['18px', '20px'],
      bodyLarge: '16px',
      body: '15px',
      bodySmall: '14px',
      caption: '13px',
      button: '15px'
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.6
    }
  },

  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 8px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08)',
    focus: '0 0 0 3px rgba(0, 133, 119, 0.2)'
  },

  animation: {
    duration: {
      instant: '100ms',
      fast: '200ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
    }
  },

  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px'
  }
}
```

---

## Usage Guidelines

### Do's
- Use consistent spacing from the scale
- Maintain minimum touch target sizes on mobile
- Test color contrast for all text
- Provide clear focus indicators
- Use semantic HTML elements
- Write descriptive alt text for images
- Test with screen readers
- Support keyboard navigation
- Honor reduced motion preferences

### Don'ts
- Don't create custom spacing values
- Don't use colors outside the palette
- Don't rely on color alone to convey information
- Don't hide focus indicators
- Don't use placeholders as labels
- Don't create touch targets smaller than 48px
- Don't disable zoom/pinch on mobile
- Don't use auto-playing animations
- Don't skip heading levels

---

This design system provides the foundation for all patient booking interface components. Next sections will detail specific wireframes and component implementations for each booking flow screen.
