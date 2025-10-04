# PRD: Sistem Pemesanan Janji Temu Klinik (MVP)
## Design System Revision - Modern Banking App Style

Berdasarkan referensi visual yang diberikan, berikut revisi design system mengikuti aesthetic modern, clean, dan approachable seperti aplikasi banking tersebut:

---

## Revised Design System & Color Palette

### Color Palette

#### Primary Colors
```
Primary (Cyan/Turquoise - Brand):
- primary-50:  #E0F7F7  (Lightest backgrounds)
- primary-100: #B3EFEF
- primary-200: #80E6E6
- primary-300: #4DDDDD
- primary-400: #26D5D5
- primary-500: #00CED1  (Main - Cyan/Turquoise)
- primary-600: #00B8BA
- primary-700: #009FA1
- primary-800: #008688
- primary-900: #006062

Accent (Bright Cyan - CTAs):
- accent-500: #00E5E8  (For buttons, highlights)

Usage: Primary buttons, active states, highlights, progress indicators
```

#### Secondary Colors
```
Purple/Lavender (Supporting - for illustrations, accents):
- secondary-100: #E9D5F5
- secondary-300: #C795E8
- secondary-500: #A855F7
- secondary-700: #7E22CE

Pink (Tertiary - warm accents):
- tertiary-300: #FCA5D5
- tertiary-500: #EC4899

Usage: Illustrations, gradient accents, special features like fast-track badges
```

#### Semantic Colors
```
Success:
- success-50:  #ECFDF5
- success-500: #10B981
- success-700: #047857

Warning:
- warning-50:  #FFFBEB
- warning-500: #F59E0B
- warning-700: #D97706

Error:
- error-50:  #FEF2F2
- error-500: #EF4444
- error-700: #DC2626

Info:
- info-50:  #EFF6FF
- info-500: #3B82F6
- info-700: #1D4ED8
```

#### Neutral/Gray Scale
```
Neutrals (Cooler tones):
- neutral-0:   #FFFFFF  (Pure white)
- neutral-25:  #FAFBFC  (Subtle background)
- neutral-50:  #F5F7FA  (Card backgrounds)
- neutral-100: #EDF2F7  (Dividers, disabled bg)
- neutral-200: #E2E8F0  (Borders)
- neutral-300: #CBD5E1  (Subtle borders)
- neutral-400: #94A3B8  (Disabled text)
- neutral-500: #64748B  (Placeholder)
- neutral-600: #475569  (Secondary text)
- neutral-700: #334155  (Body text)
- neutral-800: #1E293B  (Headings)
- neutral-900: #0F172A  (Pure black text)
```

#### Status Colors (Booking Status)
```
Status Pending:  #94A3B8 (neutral-400)
Status Confirmed: #00CED1 (primary-500)
Status Paid:      #10B981 (success-500)
Status Completed: #059669 (Dark green)
Status Cancelled: #EF4444 (error-500)
Status No-Show:   #F59E0B (warning-500)
```

### Typography Scale

```
Font Family:
- Primary: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif
- Alternative: 'Plus Jakarta Sans' (untuk headings yang lebih friendly)
- Monospace: 'SF Mono', 'Roboto Mono', monospace (booking numbers, amounts)

Type Scale:
Display (Hero): 3rem (48px)    | font-weight: 700 | line-height: 1.1 | letter-spacing: -1px
h1: 2.25rem (36px)  | font-weight: 700 | line-height: 1.2 | letter-spacing: -0.5px
h2: 1.875rem (30px) | font-weight: 700 | line-height: 1.25 | letter-spacing: -0.25px
h3: 1.5rem (24px)   | font-weight: 600 | line-height: 1.3
h4: 1.25rem (20px)  | font-weight: 600 | line-height: 1.4
h5: 1.125rem (18px) | font-weight: 600 | line-height: 1.45
h6: 1rem (16px)     | font-weight: 600 | line-height: 1.5

Body Large:  1.125rem (18px) | font-weight: 400 | line-height: 1.6
Body:        1rem (16px)     | font-weight: 400 | line-height: 1.5
Body Small:  0.875rem (14px) | font-weight: 400 | line-height: 1.5
Caption:     0.75rem (12px)  | font-weight: 500 | line-height: 1.4 | color: neutral-500

Button:      0.9375rem (15px) | font-weight: 600 | line-height: 1 | letter-spacing: 0.3px
Label:       0.8125rem (13px) | font-weight: 600 | line-height: 1.2 | text-transform: uppercase
```

### Spacing System (8px Grid)

```
Spacing Scale:
- xxs:  2px   (0.125rem)  (Micro separators)
- xs:   4px   (0.25rem)
- sm:   8px   (0.5rem)
- md:   12px  (0.75rem)
- base: 16px  (1rem)
- lg:   20px  (1.25rem)
- xl:   24px  (1.5rem)
- 2xl:  32px  (2rem)
- 3xl:  40px  (2.5rem)
- 4xl:  48px  (3rem)
- 5xl:  64px  (4rem)
- 6xl:  80px  (5rem)

Component Spacing:
- Card padding: 20px (lg)
- Button padding: 14px 28px (vertical: between md-base, horizontal: 2xl-ish)
- Input padding: 14px 16px
- Modal padding: 24px (xl)
- Section spacing: 32px (2xl)
- Page container: 20px (mobile), 24px (tablet), 40px (desktop)

Stack Gaps (vertical):
- Tight: 8px (sm)
- Default: 16px (base)
- Relaxed: 24px (xl)
- Loose: 32px (2xl)
```

### Border Radius (More Rounded)

```
Border Radius:
- none:   0
- xs:     6px   (Minimal rounding)
- sm:     10px  (Badges, small elements)
- md:     16px  (Buttons, inputs, small cards)
- lg:     20px  (Cards, larger components)
- xl:     24px  (Modals, panels)
- 2xl:    32px  (Feature cards, images)
- 3xl:    40px  (Large hero sections)
- full:   9999px (Pills, circular avatars)

Component-Specific:
- Buttons: 16px (md) - very rounded
- Input fields: 14px (between sm-md)
- Cards: 20px (lg)
- Modals: 24px (xl) on top corners only
- Bottom sheets: 24px (xl) on top corners
- Images: 16px (md)
```

### Shadows (Softer, More Subtle)

```
Elevation:
- shadow-xs:  0 1px 2px rgba(0, 0, 0, 0.04)  (Barely visible)
- shadow-sm:  0 2px 4px rgba(0, 0, 0, 0.06)  (Subtle lift)
- shadow-md:  0 4px 8px rgba(0, 0, 0, 0.08)  (Cards, buttons hover)
- shadow-lg:  0 8px 16px rgba(0, 0, 0, 0.10) (Dropdown, popovers)
- shadow-xl:  0 12px 24px rgba(0, 0, 0, 0.12) (Modals)
- shadow-2xl: 0 20px 40px rgba(0, 0, 0, 0.15) (Important overlays)

Colored Shadows (for primary elements):
- primary-shadow: 0 4px 12px rgba(0, 206, 209, 0.25)
- accent-shadow:  0 4px 16px rgba(0, 229, 232, 0.30)
```

### Component Library

#### Buttons

**Primary Button (Cyan Gradient):**
```
Background: linear-gradient(135deg, #00E5E8 0%, #00CED1 100%)
Color: #0F172A (neutral-900 - dark text for accessibility)
Padding: 14px 28px
Border-radius: 16px
Font-weight: 600
Font-size: 15px
Shadow: 0 4px 12px rgba(0, 206, 209, 0.25)
Text-transform: none (sentence case)

Hover: 
  Background: linear-gradient(135deg, #00CED1 0%, #00B8BA 100%)
  Shadow: 0 6px 16px rgba(0, 206, 209, 0.35)
  Transform: translateY(-2px)
  Transition: all 200ms ease-out

Active:
  Transform: translateY(0) scale(0.98)
  Shadow: 0 2px 8px rgba(0, 206, 209, 0.3)

Disabled:
  Background: #EDF2F7 (neutral-100)
  Color: #94A3B8 (neutral-400)
  Cursor: not-allowed
  Shadow: none
```

**Secondary Button (Outlined):**
```
Background: transparent
Color: #00CED1 (primary-500)
Padding: 14px 28px
Border: 2px solid #00CED1
Border-radius: 16px
Font-weight: 600

Hover:
  Background: #E0F7F7 (primary-50)
  Border-color: #00B8BA
```

**Ghost Button:**
```
Background: transparent
Color: #334155 (neutral-700)
Padding: 14px 28px
Border-radius: 16px

Hover:
  Background: #F5F7FA (neutral-50)
```

**Icon Button (Circular):**
```
Width: 48px
Height: 48px
Border-radius: 9999px (full)
Background: #F5F7FA (neutral-50)
Icon color: #334155 (neutral-700)

Hover:
  Background: #EDF2F7 (neutral-100)
```

#### Input Fields

```
Height: 56px (mobile & desktop - consistent)
Padding: 16px 20px
Border: 2px solid #E2E8F0 (neutral-200)
Border-radius: 14px
Font-size: 16px (prevents iOS zoom)
Background: #FFFFFF
Placeholder-color: #94A3B8 (neutral-400)

Focus:
  Border: 2px solid #00CED1 (primary-500)
  Box-shadow: 0 0 0 4px rgba(0, 206, 209, 0.1)
  Outline: none

Error:
  Border: 2px solid #EF4444 (error-500)
  Background: #FEF2F2 (error-50)
  Box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1)

Success (filled correctly):
  Border: 2px solid #10B981 (success-500)
  Icon: Green checkmark on right
```

#### Cards

**Standard Card:**
```
Background: #FFFFFF
Padding: 20px
Border-radius: 20px
Border: 1px solid #EDF2F7 (neutral-100)
Shadow: 0 2px 4px rgba(0, 0, 0, 0.04)

Hover (if interactive):
  Shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
  Transform: translateY(-4px)
  Transition: all 250ms ease-out
```

**Feature Card (Highlighted - Fast-Track):**
```
Background: linear-gradient(135deg, #E9D5F5 0%, #E0F7F7 100%)
Padding: 20px
Border-radius: 20px
Border: 2px solid #00CED1
Shadow: 0 4px 12px rgba(0, 206, 209, 0.15)
Badge: "Fast-Track" in top-right with accent color
```

**Stat Card (Dashboard Metrics):**
```
Background: #FFFFFF
Padding: 24px
Border-radius: 20px
Border: none
Shadow: 0 2px 8px rgba(0, 0, 0, 0.06)

Content:
- Large number: 36px, font-weight: 700, color: neutral-900
- Label below: 13px, font-weight: 600, uppercase, color: neutral-500
- Icon: 40x40px, colored background circle
```

#### Badges/Pills

**Status Badge:**
```
Padding: 6px 14px
Border-radius: 9999px (full pill)
Font-size: 12px
Font-weight: 600
Text-transform: uppercase
Letter-spacing: 0.5px

Variants:
- Paid: Background #ECFDF5, Text #059669, Border 1px solid #10B981
- Pending: Background #F5F7FA, Text #475569, Border 1px solid #CBD5E1
- Confirmed: Background #E0F7F7, Text #008688, Border 1px solid #00CED1
- Cancelled: Background #FEF2F2, Text #DC2626, Border 1px solid #EF4444
```

**Feature Badge (e.g., "Fast-Track"):**
```
Background: linear-gradient(135deg, #00E5E8, #A855F7)
Color: #FFFFFF
Padding: 4px 12px
Border-radius: 9999px
Font-size: 11px
Font-weight: 700
Text-transform: uppercase
Shadow: 0 2px 8px rgba(0, 229, 232, 0.3)
```

#### Modal

```
Width: 92vw (mobile), 480px (desktop)
Max-width: 95%
Padding: 28px
Border-radius: 24px (top) or 24px (all corners for desktop)
Shadow: 0 20px 40px rgba(0, 0, 0, 0.15)
Background: #FFFFFF

Backdrop:
  Background: rgba(15, 23, 42, 0.6)
  Backdrop-filter: blur(8px)

Mobile (Bottom Sheet):
  Slides up from bottom
  Border-radius: 24px on top corners only
  Handle indicator: 40px wide, 4px tall, rounded, centered at top
```

#### Toast Notification

```
Width: 90% (mobile), 400px (desktop)
Padding: 16px 20px
Border-radius: 16px
Shadow: 0 8px 24px rgba(0, 0, 0, 0.12)
Position: fixed top-center (mobile), top-right (desktop)
Animation: slide-in-top 300ms ease-out

Variants:
- Success: Background #ECFDF5, Border-left 4px solid #10B981, Icon green
- Error: Background #FEF2F2, Border-left 4px solid #EF4444, Icon red
- Info: Background #EFF6FF, Border-left 4px solid #3B82F6, Icon blue
- Warning: Background #FFFBEB, Border-left 4px solid #F59E0B, Icon yellow
```

#### Navigation Bar (Bottom)

```
Height: 72px (includes safe area padding)
Background: #FFFFFF
Border-top: 1px solid #EDF2F7
Shadow: 0 -2px 8px rgba(0, 0, 0, 0.04)
Blur effect: backdrop-filter: blur(10px) (for iOS style)

Nav Items:
- Icon size: 24px
- Spacing: Equal distribution
- Active state: Icon color = #00CED1, Label color = #00CED1, Bold weight
- Inactive state: Icon color = #94A3B8, Label color = #64748B
- Active indicator: 3px dot above icon (optional) or subtle background circle

Labels: 11px, font-weight: 500 (active: 600)
```

### Icons

**Icon Library:** **Lucide Icons** (clean, consistent stroke weight)

**Icon Sizes:**
- xs: 16px (inline with text)
- sm: 20px (buttons, inputs)
- md: 24px (default, navigation)
- lg: 32px (feature icons)
- xl: 48px (hero sections)
- 2xl: 64px (empty states)

**Icon Style:**
- Stroke width: 2px (consistent)
- Rounded line caps and joins
- Color: Inherit from parent or explicit colors

**Colored Icon Backgrounds (for feature cards):**
```
Circle/Square with rounded corners: 48x48px
Background: gradient or solid color with opacity
Icon: 24px, white or contrasting color
Border-radius: 12px (soft square) or 9999px (circle)

Examples:
- Doctor icon: Background gradient #00CED1 to #00E5E8
- Calendar icon: Background gradient #A855F7 to #EC4899
- Payment icon: Background gradient #10B981 to #3B82F6
```

### Grid System

**Breakpoints:**
```
Mobile:  < 768px   (sm)
Tablet:  768px - 1024px (md)
Desktop: > 1024px  (lg)
Wide:    > 1440px  (xl)
```

**Grid Container:**
```
Max-width: 1200px (narrower for better readability)
Margin: 0 auto
Padding: 20px (mobile), 32px (tablet), 48px (desktop)
```

**Grid Columns:**
```
Mobile: 4 columns
Tablet: 8 columns
Desktop: 12 columns
Gap: 20px (larger for breathing room)
```

### Illustrations & Graphics

**Style:**
- 3D isometric or semi-flat illustrations (like in reference image)
- Gradient colors using brand palette
- Playful, friendly, approachable
- Used for: Empty states, onboarding, feature explanations

**Empty State Illustrations:**
- Size: 200-300px width
- Colors: Primary + Secondary gradients
- Style: Minimalist, geometric

**Image Treatments:**
```
Doctor Photos: 
  Size: 80x80px (mobile), 96x96px (desktop)
  Border-radius: 9999px (circular)
  Border: 3px solid #FFFFFF
  Box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08)

Feature Images:
  Border-radius: 20px
  Object-fit: cover
  Aspect ratio: 16:9 or 4:3
```

### Animation/Transition Timing

```
Timing Functions:
- ease-out:    cubic-bezier(0, 0, 0.2, 1)  (Most common - natural deceleration)
- ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
- bounce:      cubic-bezier(0.68, -0.55, 0.265, 1.55) (Playful buttons)

Durations:
- instant: 100ms  (Immediate feedback)
- fast:    200ms  (Hover, focus states)
- base:    300ms  (Default transitions)
- medium:  400ms  (Modals, drawers)
- slow:    600ms  (Page transitions, complex animations)

Animation Patterns:
- Fade in: opacity 0 → 1, 300ms ease-out
- Slide up: translateY(20px) → 0, 300ms ease-out
- Scale in: scale(0.95) → 1, 200ms ease-out
- Spring bounce: scale(1) → 1.05 → 1, 400ms bounce
```

### Accessibility

**Focus Indicators:**
```
Outline: 3px solid #00CED1 (primary)
Outline-offset: 3px
Border-radius: inherit
Box-shadow alternative: 0 0 0 4px rgba(0, 206, 209, 0.3)
```

**Color Contrast:**
- Text on white: Use neutral-700 (#334155) or darker for AA compliance
- Primary button text: Use neutral-900 (#0F172A) on cyan background (passes AAA)
- Minimum ratio: 4.5:1 for body text, 3:1 for large text

**Touch Targets:**
- Minimum: 44x44px (WCAG)
- Preferred: 48x48px (iOS HIG)
- Spacing between targets: minimum 8px

**Motion Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Dark Mode (Optional for Future)

Since reference image only shows light mode, dark mode is not in MVP scope. However, color tokens should be defined with CSS variables to easily support dark mode later:

```css
:root {
  --color-primary: #00CED1;
  --color-background: #FFFFFF;
  --color-surface: #F5F7FA;
  --color-text: #334155;
  /* ... */
}

[data-theme="dark"] {
  --color-background: #0F172A;
  --color-surface: #1E293B;
  --color-text: #F1F5F9;
  /* ... */
}
```

---

## Updated Micro Interactions (Matching Modern Style)

### Patient Booking Interface

#### 1. **Doctor Selection Cards**
```
Initial State:
- White background, 20px border-radius
- Subtle shadow (shadow-sm)
- Doctor photo: 80px circle, left-aligned
- Name: 18px, font-weight: 600, neutral-900
- Specialization: 14px, neutral-500

Hover (Desktop):
  Transform: translateY(-6px)
  Shadow: shadow-lg
  Border: 2px solid primary-100 (subtle glow)
  Transition: 250ms ease-out

Active/Selected:
  Border: 3px solid primary-500
  Background: primary-50 (very light cyan)
  Checkmark icon: Top-right corner, cyan circle with white check
  Scale animation: 1 → 1.02 → 1 (bounce effect)
```

#### 2. **Date Picker Calendar**
```
Style:
- Calendar container: White card, 20px border-radius, shadow-md
- Header: Month/Year in 20px bold, neutral-900
- Date cells: 44x44px, circular
- Available dates: neutral-700 text, neutral-50 background on hover
- Selected date: primary-500 background, white text, scale(1.1) animation
- Unavailable: neutral-300 text, strikethrough, cursor: not-allowed
- Today indicator: Small cyan dot below date number

Interaction:
- Tap date → Ripple effect from center (cyan, 400ms)
- Selected → Smooth background color transition (200ms)
```

#### 3. **Time Slot Pills**
```
Style:
- Pill shape: full border-radius, 14px padding
- Available: White bg, neutral-200 border, neutral-700 text
- Selected: Gradient background (primary-500 to accent-500), white text, shadow-md
- Unavailable: neutral-100 bg, neutral-400 text, opacity 0.5
- Almost Full: Warning-50 bg, warning-600 border, "1 slot" badge

Interaction:
- Tap → Scale animation (0.95 → 1.05 → 1) with haptic feedback
- Selected → Gradient fills from left to right (300ms)
```

#### 4. **Form Inputs**
```
Style:
- Height: 56px
- Border-radius: 14px
- Border: 2px solid neutral-200
- Placeholder: neutral-400, font-weight: 400

States:
- Focus: Border → primary-500, Glow shadow (cyan, subtle)
- Filled: Border → neutral-300, Checkmark appears (right side, green)
- Error: Border → error-500, Background → error-50, Shake animation (300ms)

Label Animation:
- Placeholder moves up and shrinks when focused
- Transforms into label above input (12px, neutral-500)
- Smooth transition (200ms ease-out)
```

#### 5. **Primary CTA Button (Booking Confirmation)**
```
Style:
- Gradient: primary-500 to accent-500
- Border-radius: 16px
- Height: 56px (generous touch target)
- Font-size: 16px, font-weight: 600
- Shadow: Colored shadow (cyan, soft)

States:
- Hover: Gradient shifts slightly, shadow increases, translateY(-2px)
- Active: Scale(0.98), shadow decreases
- Loading: 
  - Spinner replaces text (white spinner, 24px)
  - Button width maintains (no jump)
  - Opacity 0.8, cursor: not-allowed

Success:
- Background → success-500 (green)
- Checkmark icon fades in with scale animation
- Confetti particles burst (300ms, cyan & purple)
```

#### 6. **Payment Method Selection**
```
Style:
- Cards: 3 columns (mobile: 1 column)
- Each card: 120x120px (mobile: full width, 80px height)
- White background, 16px border-radius, shadow-sm
- Payment logo/icon: 48x48px, centered
- Label below: 14px, neutral-600

Selected State:
- Border: 3px solid primary-500
- Background: primary-50
- Checkmark badge: Top-right, cyan circle
- Scale animation: Subtle bounce (1 → 1.05 → 1)

QR Code Display (QRIS):
- QR code: 280x280px, white background, 16px padding, 20px border-radius
- Timer: Large (24px), neutral-900, countdown animation
- Scan instruction: Below QR, 14px, neutral-600
- Copy button: Ghost style, neutral-700
```

### Admin Dashboard

#### 7. **Sidebar Navigation (Desktop)**
```
Style:
- Width: 260px
- Background: White
- Border-right: 1px solid neutral-100
- Logo at top: 48px height, 24px padding

Nav Items:
- Height: 48px, 16px padding
- Border-radius: 12px (when hovered/active)
- Icon: 20px, left-aligned with 12px margin
- Text: 15px, font-weight: 500
- Inactive: neutral-600 text, transparent bg
- Hover: neutral-50 bg, neutral-900 text
- Active: primary-50 bg, primary-700 text, font-weight: 600
- Active indicator: 3px cyan bar on left edge

Interaction:
- Smooth background color transition (200ms)
- Icon color transitions with text
```

#### 8. **Data Table (Booking List)**
```
Style:
- Header: neutral-50 bg, 14px uppercase text, neutral-500
- Row height: 64px (generous)
- Borders: 1px solid neutral-100 (horizontal only)
- Alternating rows: White and neutral-25

Row States:
- Hover: neutral-50 bg, cursor: pointer
- Fast-Track indicator: 4px cyan left border
- Selected: primary-50 bg (if multi-select)

Status Badge (inline):
- Pill shape, colored as per status colors
- 24px height, 8px padding
```

#### 9. **Stat Cards (Dashboard Metrics)**
```
Style:
- White background, 20px border-radius, shadow-sm
- Padding: 24px
- Icon: Top-left, 48x48px circle with gradient bg
- Number: Large (36px), bold, neutral-900
- Label: Below number, 13px, uppercase, neutral-500
- Trend indicator: Small arrow (up/down) with percentage

Animation on Load:
- Fade in + slide up (staggered 100ms delay per card)
- Number counts up from 0 to final value (800ms, easeOut)
```

#### 10. **Modal Dialogs**
```
Desktop:
- Center-aligned, 480px width
- 24px border-radius (all corners)
- 28px padding
- Shadow: shadow-2xl with blur backdrop

Mobile:
- Bottom sheet style
- Slides up from bottom (400ms ease-out)
- 24px border-radius (top corners only)
- Handle indicator: 40x4px, neutral-300, centered, 8px from top
- Swipe down to dismiss gesture

Close Button:
- Top-right, 40x40px circle
- neutral-100 bg, neutral-600 icon
- Hover: neutral-200 bg
```

---

## Sample Component Code (React + Tailwind)

```jsx
// Primary Button Component
const PrimaryButton = ({ children, loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="
      relative h-14 px-7 
      bg-gradient-to-br from-[#00E5E8] to-[#00CED1]
      text-neutral-900 font-semibold text-[15px]
      rounded-2xl
      shadow-[0_4px_12px_rgba(0,206,209,0.25)]
      transition-all duration-200 ease-out
      hover:shadow-[0_6px_16px_rgba(0,206,209,0.35)]
      hover:-translate-y-0.5
      active:scale-[0.98]
      disabled:bg-neutral-100 disabled:text-neutral-400 
      disabled:shadow-none disabled:cursor-not-allowed
    "
  >
    {loading ? (
      <span className="inline-block w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
    ) : (
      children
    )}
  </button>
);

// Doctor Selection Card
const DoctorCard = ({ doctor, selected, onSelect }) => (
  <div
    onClick={() => onSelect(doctor.id)}
    className={`
      relative p-5 bg-white rounded-[20px] cursor-pointer
      transition-all duration-250 ease-out
      ${selected 
        ? 'border-3 border-primary-500 bg-primary-50 scale-[1.02]' 
        : 'border border-neutral-100 hover:border-primary-100 hover:-translate-y-1.5'
      }
      ${selected ? 'shadow-md' : 'shadow-sm hover:shadow-lg'}
    `}
  >
    {selected && (
      <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
        <CheckIcon className="w-4 h-4 text-white" />
      </div>
    )}
    <div className="flex items-center gap-4">
      <img 
        src={doctor.photo} 
        alt={doctor.name}
        className="w-20 h-20 rounded-full border-3 border-white shadow-md"
      />
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">{doctor.name}</h3>
        <p className="text-sm text-neutral-500">{doctor.specialization}</p>
      </div>
    </div>
  </div>
);

// Time Slot Pill
const TimeSlot = ({ time, available, selected, onSelect }) => (
  <button
    onClick={() => available && onSelect(time)}
    disabled={!available}
    className={`
      px-5 py-3.5 rounded-full font-semibold text-sm
      transition-all duration-200
      ${available 
        ? selected
          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md scale-105'
          : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-primary-300 hover:bg-primary-50'
        : 'bg-neutral-100 text-neutral-400 opacity-50 cursor-not-allowed'
      }
    `}
  >
    {time}
  </button>
);
```

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary-500: #00CED1;
  --color-accent-500: #00E5E8;
  --color-secondary-500: #A855F7;
  
  /* Neutrals */
  --color-neutral-0: #FFFFFF;
  --color-neutral-50: #F5F7FA;
  --color-neutral-900: #0F172A;
  
  /* Semantic */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-base: 16px;
  --spacing-lg: 20px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  
  /* Border Radius */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.10);
  --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.12);
  --shadow-primary: 0 4px 12px rgba(0, 206, 209, 0.25);
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```
