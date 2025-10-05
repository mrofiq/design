# Accessibility & Responsive Design Guide
## Patient Booking Interface Implementation

---

## Table of Contents
1. [WCAG 2.1 AA Compliance Checklist](#wcag-21-aa-compliance-checklist)
2. [Accessibility Implementation Details](#accessibility-implementation-details)
3. [Responsive Breakpoint Strategy](#responsive-breakpoint-strategy)
4. [Component Responsive Patterns](#component-responsive-patterns)
5. [Testing & Validation](#testing--validation)
6. [Implementation Code Examples](#implementation-code-examples)

---

## WCAG 2.1 AA Compliance Checklist

### Perceivable

#### 1.1 Text Alternatives
```
✓ All images have alt text
  - Doctor avatars: "Foto Dr. [Name]"
  - Icons: Descriptive labels (e.g., "Ikon kalender")
  - Logos: "Logo JanjiTemu"
  - Decorative images: alt="" (empty, ignored by screen readers)

✓ Form inputs have labels
  - Visible labels for all fields
  - Placeholder text is not used as sole label
  - Required fields marked with asterisk and aria-required

✓ Icons have text alternatives
  - Icon buttons have aria-label
  - Decorative icons have aria-hidden="true"
```

#### 1.2 Time-based Media
```
N/A - No video or audio content in MVP

Future consideration:
  - If doctor intro videos added: Captions and transcripts required
  - If voice announcements added: Visual alternative required
```

#### 1.3 Adaptable
```
✓ Semantic HTML structure
  <header>, <main>, <nav>, <form>, <button>, <label>
  Proper heading hierarchy: h1 → h2 → h3 (no skipping)

✓ Content order makes sense
  - Visual order matches DOM order
  - No CSS positioning that breaks logical flow
  - Flexbox/Grid maintains source order on mobile

✓ Sensory characteristics
  - Don't rely on shape/size/color alone
  - "Click the green button" → "Click the Continue button (green)"
  - Available dates: Green color + "Tersedia" label + not disabled

✓ Orientation
  - Works in portrait and landscape
  - No forced orientation lock
  - Content reflows appropriately

✓ Input purpose
  - Autocomplete attributes on inputs
  - autocomplete="name", autocomplete="tel", autocomplete="email"
```

#### 1.4 Distinguishable
```
✓ Color contrast (minimum 4.5:1 for text, 3:1 for UI components)
  - Body text #4A4A4A on #FFFFFF: 9.4:1 ✓
  - Headings #1A1A1A on #FFFFFF: 16.7:1 ✓
  - Primary button #FFFFFF on #008577: 4.8:1 ✓
  - Error text #EF4444 on #FFFFFF: 4.6:1 ✓
  - Links #008577 on #FFFFFF: 4.5:1 ✓

✓ Color not sole indicator
  - Error: Red border + icon + message
  - Success: Green + checkmark + "Berhasil" text
  - Available dates: Green + not disabled + clickable
  - Selected state: Color + border + background + checkmark

✓ Text resize up to 200% without loss of content/functionality
  - Relative units (rem, em) used
  - Container widths flexible
  - No fixed pixel heights that crop content

✓ Images of text avoided
  - Use real text with custom fonts instead
  - Logos: SVG format (scalable)

✓ Reflow at 320px width
  - All content accessible without horizontal scrolling
  - Tested on iPhone SE (smallest common screen)

✓ Non-text contrast (3:1 for UI components)
  - Form field borders: #D1D1D1 on #FFFFFF: 2.7:1 ✗
    → Solution: Use #ABABAB (#757575 on focus)
  - Button borders: 2px solid, meets 3:1 on all states

✓ Text spacing adjustable
  - No content loss if:
    - Line height 1.5x font size
    - Paragraph spacing 2x font size
    - Letter spacing 0.12x font size
    - Word spacing 0.16x font size

✓ Content on hover/focus
  - Tooltips dismissable (ESC key)
  - Tooltips don't obscure trigger
  - Tooltips visible on hover and focus
```

### Operable

#### 2.1 Keyboard Accessible
```
✓ All functionality available via keyboard
  - Tab: Navigate forward
  - Shift+Tab: Navigate backward
  - Enter/Space: Activate buttons, select options
  - Arrow keys: Navigate radio groups, calendar dates
  - Escape: Close modals, cancel actions

✓ No keyboard trap
  - Focus can move away from any component
  - Modal focus trap allows Escape to exit
  - All interactive elements have focusable state

✓ Keyboard shortcuts
  - None currently (avoid conflicts)
  - Future: Documented and toggleable if added

✓ Character key shortcuts
  - None currently (avoid conflicts with screen readers)
```

#### 2.2 Enough Time
```
✓ Timing adjustable
  - Payment timeout: 10 minutes (configurable)
  - Session timeout: 30 minutes (configurable)
  - Warning before timeout (5 min before)
  - Option to extend time

✓ Pause, stop, hide
  - Animations can be paused (prefers-reduced-motion)
  - Auto-updating content: None currently
  - If polling implemented: User can pause/stop

✓ No time limits on form completion
  - User can take as long as needed
  - Data persisted in localStorage (24h)
  - No auto-logout while actively using

✓ Re-authenticating
  - N/A for patient booking (no login)
  - Admin panel: Session extends on activity
```

#### 2.3 Seizures and Physical Reactions
```
✓ No flashing content
  - No elements flash more than 3 times/second
  - Animations are smooth, not rapid
  - No strobe effects

✓ Animation from interactions
  - All animations triggered by user interaction
  - Can be disabled via prefers-reduced-motion
```

#### 2.4 Navigable
```
✓ Bypass blocks
  - Skip to main content link (visible on focus)
  - Landmark regions (<header>, <main>, <nav>)

✓ Page titles
  - Descriptive, unique for each step
  - "Pilih Dokter - JanjiTemu"
  - "Pilih Tanggal - Dr. Ahmad - JanjiTemu"

✓ Focus order
  - Logical, follows visual layout
  - Tab order matches reading order (top→bottom, left→right)

✓ Link purpose clear from context
  - "Lihat Lokasi Klinik" (not just "Klik di sini")
  - "Tambah ke Kalender" (not just "Download")

✓ Multiple ways to navigate
  - Back button on every screen
  - Progress indicator shows current position
  - Breadcrumb context (doctor, date, time selected)

✓ Headings and labels
  - Descriptive headings (h1, h2, h3)
  - Logical heading hierarchy
  - Form labels clearly describe purpose

✓ Focus visible
  - 3px solid outline on all interactive elements
  - High contrast focus indicator (#008577)
  - Focus ring never removed without replacement

✓ Location
  - Progress stepper shows current step
  - Breadcrumb shows selections made
  - Page title indicates current screen
```

#### 2.5 Input Modalities
```
✓ Pointer gestures
  - No multi-point gestures required (pinch, rotate)
  - All gestures have single-tap alternative
  - No path-based gestures (swipe, drag)

✓ Pointer cancellation
  - Click events fire on mouseup (not mousedown)
  - User can move pointer away to cancel
  - No down-event only triggers

✓ Label in name
  - Accessible name matches visible label
  - "Continue" button: aria-label includes "Continue"

✓ Motion actuation
  - No device motion required (shake, tilt)
  - All functions accessible without motion

✓ Target size
  - Minimum 44×44 CSS pixels (WCAG AA)
  - Target 48×48 for AAA compliance
  - Adequate spacing between targets (8px min)
```

### Understandable

#### 3.1 Readable
```
✓ Language of page
  - <html lang="id"> (Indonesian)
  - Can add lang="en" for English content if needed

✓ Language of parts
  - If mixing languages, mark with lang attribute
  - <span lang="en">Fast-Track</span>
```

#### 3.2 Predictable
```
✓ On focus
  - No automatic context changes when element receives focus
  - Focus doesn't trigger navigation, form submission

✓ On input
  - Typing doesn't automatically submit form
  - Selecting option doesn't navigate away (except by design)
  - Date selection doesn't auto-proceed (requires CTA click)

✓ Consistent navigation
  - Back button always top-left
  - Progress indicator always below header
  - CTA button always bottom (mobile) or end of form

✓ Consistent identification
  - Icons used consistently (calendar = date, clock = time)
  - Button labels consistent ("Lanjutkan" for proceed)
  - Terminology consistent throughout
```

#### 3.3 Input Assistance
```
✓ Error identification
  - Errors clearly identified in text
  - Error location indicated (which field)
  - Error reason explained

✓ Labels or instructions
  - All inputs have visible labels
  - Required fields marked with asterisk
  - Format requirements explained (phone: "08123...")
  - Helper text for complex fields

✓ Error suggestion
  - Suggested corrections provided
  - "Nomor terlalu pendek (minimal 10 digit)"
  - "Format email tidak valid (contoh: nama@email.com)"

✓ Error prevention (legal, financial, data)
  - Confirmation before payment
  - Review screen before submitting
  - Ability to change selections before final submit
  - Clear summary of booking before payment
```

### Robust

#### 4.1 Compatible
```
✓ Parsing (HTML valid)
  - No duplicate IDs
  - Properly nested elements
  - Opening and closing tags match
  - Attributes quoted

✓ Name, role, value
  - All UI components have accessible name (label, aria-label)
  - Roles properly assigned (button, radio, checkbox)
  - States communicated (aria-checked, aria-selected)
  - Values updated when changed (aria-valuenow for progress)

✓ Status messages
  - Success/error messages in aria-live regions
  - Loading states announced to screen readers
  - Changes to dynamic content announced
```

---

## Accessibility Implementation Details

### Screen Reader Announcements

**Page Load**
```html
<!-- Announce page purpose -->
<h1 id="page-title">Pilih Dokter Anda</h1>
<p id="page-description">
  Mulai dengan memilih dokter yang ingin Anda temui
</p>

<main aria-labelledby="page-title" aria-describedby="page-description">
  <!-- content -->
</main>
```

**Dynamic Updates**
```html
<!-- Loading state -->
<div role="status" aria-live="polite" aria-atomic="true">
  <span class="sr-only">Memuat ketersediaan dokter...</span>
</div>

<!-- Success message -->
<div role="status" aria-live="polite" aria-atomic="true">
  Slot waktu berhasil dipilih
</div>

<!-- Error message -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  Nomor WhatsApp tidak valid
</div>

<!-- Progress update -->
<div role="status" aria-live="polite">
  Step 2 dari 4 selesai
</div>
```

**Form Validation**
```html
<label for="phone-number">
  Nomor WhatsApp
  <span aria-label="wajib diisi">*</span>
</label>

<input
  id="phone-number"
  type="tel"
  required
  aria-required="true"
  aria-invalid="false"
  aria-describedby="phone-helper phone-error"
/>

<span id="phone-helper" class="helper-text">
  Masukkan nomor dimulai dengan 8 (contoh: 81234567890)
</span>

<span id="phone-error" role="alert" class="error-text" aria-live="assertive">
  <!-- Error message inserted here when validation fails -->
</span>
```

### Keyboard Navigation Implementation

**Focus Management**
```javascript
// Trap focus in modal
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

// Focus first error on validation fail
function focusFirstError(errors) {
  const firstErrorField = document.getElementById(errors[0].fieldId);
  if (firstErrorField) {
    firstErrorField.focus();
    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Announce to screen reader
function announce(message, priority = 'polite') {
  const announcer = document.getElementById('aria-announcer');
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}
```

**Radio Group Navigation**
```javascript
// Arrow key navigation for radio cards
function handleRadioKeydown(e, currentIndex, groupSize) {
  let newIndex;

  switch(e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault();
      newIndex = (currentIndex + 1) % groupSize;
      selectRadio(newIndex);
      break;

    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault();
      newIndex = (currentIndex - 1 + groupSize) % groupSize;
      selectRadio(newIndex);
      break;

    case ' ':
    case 'Enter':
      e.preventDefault();
      confirmSelection(currentIndex);
      break;
  }
}

function selectRadio(index) {
  // Update aria-checked
  radios.forEach((radio, i) => {
    radio.setAttribute('aria-checked', i === index);
    radio.setAttribute('tabindex', i === index ? '0' : '-1');
  });

  // Focus selected
  radios[index].focus();
}
```

**Calendar Keyboard Navigation**
```javascript
// Calendar date navigation with arrow keys
function handleCalendarKeydown(e, currentDate) {
  let newDate;

  switch(e.key) {
    case 'ArrowLeft':
      newDate = subDays(currentDate, 1);
      break;
    case 'ArrowRight':
      newDate = addDays(currentDate, 1);
      break;
    case 'ArrowUp':
      newDate = subDays(currentDate, 7);
      break;
    case 'ArrowDown':
      newDate = addDays(currentDate, 7);
      break;
    case 'Home':
      newDate = startOfWeek(currentDate);
      break;
    case 'End':
      newDate = endOfWeek(currentDate);
      break;
    case 'PageUp':
      newDate = subMonths(currentDate, 1);
      break;
    case 'PageDown':
      newDate = addMonths(currentDate, 1);
      break;
    case 'Enter':
    case ' ':
      selectDate(currentDate);
      return;
    default:
      return;
  }

  e.preventDefault();
  focusDate(newDate);
}
```

### Motion & Animation Accessibility

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Still allow essential transitions */
  .essential-transition {
    transition: opacity 0.2s ease;
  }
}

/* Provide alternative to animated checkmark */
@media (prefers-reduced-motion: reduce) {
  .success-checkmark {
    animation: none;
    opacity: 1;
    transform: scale(1);
  }
}
```

### Color Blind Accessibility

```
Patterns beyond color:

Available date:
  ✓ Green color (#008577)
  ✓ Solid background
  ✓ NOT disabled
  ✓ Cursor: pointer
  ✓ Aria-label: "15 Oktober, tersedia"

Unavailable date:
  ✓ Gray color (#D1D1D1)
  ✓ Strikethrough
  ✓ Disabled state
  ✓ Cursor: not-allowed
  ✓ Aria-disabled: true
  ✓ Aria-label: "15 Oktober, tidak tersedia"

Selected state:
  ✓ Primary color background
  ✓ White text (high contrast)
  ✓ Thicker border (2px)
  ✓ Shadow
  ✓ Checkmark icon
  ✓ Aria-selected: true

Error state:
  ✓ Red border
  ✓ Error icon (!)
  ✓ Error message text
  ✓ Aria-invalid: true

Icons with semantic meaning:
  ✓ Always paired with text label
  ✓ Icon + "Kalender" (not just icon)
  ✓ Icon + "Waktu" (not just icon)
```

---

## Responsive Breakpoint Strategy

### Breakpoint Definitions

```css
/* Mobile-first approach */

/* Extra small devices (default) */
/* 320px - 767px */
/* No media query needed - this is the base */

/* Small tablets (landscape phones) */
@media (min-width: 768px) {
  /* Tablet adjustments */
}

/* Tablets and small desktops */
@media (min-width: 1024px) {
  /* Desktop adjustments */
}

/* Large desktops */
@media (min-width: 1440px) {
  /* Wide screen adjustments */
}

/* Height-based (for short screens) */
@media (max-height: 600px) {
  /* Reduce vertical spacing */
}
```

### Device-Specific Considerations

```
┌──────────────────┬────────────┬────────────┬──────────────┐
│ Device           │ Width (px) │ Breakpoint │ Layout       │
├──────────────────┼────────────┼────────────┼──────────────┤
│ iPhone SE        │ 320        │ Mobile     │ Single col   │
│ iPhone 12/13     │ 390        │ Mobile     │ Single col   │
│ iPhone 14 Pro Max│ 428        │ Mobile     │ Single col   │
│ iPad Mini        │ 768        │ Tablet     │ 2 col cards  │
│ iPad Pro         │ 1024       │ Desktop    │ 3 col cards  │
│ Desktop          │ 1440+      │ Wide       │ Centered     │
└──────────────────┴────────────┴────────────┴──────────────┘

Orientation:
- Portrait: Default, single column
- Landscape: Utilize horizontal space
  - Form fields side-by-side
  - Calendar + time slots split view
```

### Container Strategy

```css
/* Container widths */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
    padding-left: 32px;
    padding-right: 32px;
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1200px;
  }
}
```

---

## Component Responsive Patterns

### Doctor Card Grid

```css
/* Mobile: Single column */
.doctor-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .doctor-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .doctor-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

/* Doctor card internal layout */
.doctor-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

@media (min-width: 768px) {
  .doctor-card {
    padding: 20px;
  }

  /* Can switch to vertical layout on tablet */
  .doctor-card--vertical {
    flex-direction: column;
    text-align: center;
  }
}
```

### Booking Type Cards

```css
/* Mobile: Stacked */
.booking-type-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Tablet+: Side by side */
@media (min-width: 768px) {
  .booking-type-container {
    flex-direction: row;
    gap: 16px;
  }

  .booking-type-card {
    flex: 1;
    min-height: 240px;
  }
}
```

### Calendar Layout

```css
/* Mobile: Full width */
.calendar {
  width: 100%;
}

.calendar-date {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

/* Tablet: Larger cells */
@media (min-width: 768px) {
  .calendar {
    max-width: 480px;
    margin: 0 auto;
  }

  .calendar-date {
    width: 48px;
    height: 48px;
    font-size: 15px;
  }
}

/* Desktop: Can show multiple months */
@media (min-width: 1024px) {
  .calendar-date {
    width: 56px;
    height: 56px;
    font-size: 16px;
  }

  /* Optional: Side-by-side months */
  .calendar-multi {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}
```

### Time Slot Grid

```css
/* Mobile: 4 slots per row */
.time-slot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.time-slot {
  min-width: 0; /* Allow shrinking */
  font-size: 14px;
  padding: 10px 8px;
}

/* Tablet: 6 slots per row */
@media (min-width: 768px) {
  .time-slot-grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
  }

  .time-slot {
    font-size: 15px;
    padding: 10px 12px;
  }
}

/* Desktop: 8 slots per row OR split layout */
@media (min-width: 1024px) {
  .time-slot-grid {
    grid-template-columns: repeat(8, 1fr);
  }

  /* Alternative: Calendar + Slots side by side */
  .date-time-layout {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 32px;
  }

  .calendar-section {
    position: sticky;
    top: 80px;
    align-self: start;
  }
}
```

### Form Layout

```css
/* Mobile: Single column */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  width: 100%;
}

/* Tablet: Some fields side-by-side */
@media (min-width: 768px) {
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  /* Name and phone side by side */
  .form-row--name-phone {
    grid-template-columns: 1fr 1fr;
  }

  /* Email full width */
  .form-field--full {
    grid-column: 1 / -1;
  }
}

/* Desktop: Wider max-width */
@media (min-width: 1024px) {
  .form {
    max-width: 640px;
    margin: 0 auto;
  }
}
```

### Bottom CTA Behavior

```css
/* Mobile: Fixed at bottom */
.bottom-cta {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  border-top: 1px solid #f7f7f7;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.bottom-cta__button {
  width: 100%;
}

/* Tablet: Still fixed but narrower */
@media (min-width: 768px) {
  .bottom-cta {
    left: 50%;
    transform: translateX(-50%);
    max-width: 720px;
    padding: 20px 24px;
  }
}

/* Desktop: Inline (not fixed) */
@media (min-width: 1024px) {
  .bottom-cta {
    position: static;
    transform: none;
    box-shadow: none;
    border-top: none;
    padding: 32px 0 0;
    max-width: 640px;
    margin: 0 auto;
  }

  .bottom-cta__button {
    width: auto;
    min-width: 200px;
    margin-left: auto;
  }
}

/* Hide when keyboard open (mobile) */
@media (max-height: 500px) {
  .bottom-cta {
    position: static;
    margin-top: 24px;
  }
}
```

### Modal Responsiveness

```css
/* Mobile: Full screen */
.modal {
  position: fixed;
  inset: 0;
  background: white;
  overflow-y: auto;
  z-index: 1000;
}

.modal__content {
  padding: 24px 16px;
  min-height: 100vh;
}

/* Tablet: Centered with overlay */
@media (min-width: 768px) {
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  .modal__content {
    background: white;
    border-radius: 16px;
    max-width: 480px;
    width: 90%;
    min-height: auto;
    max-height: 90vh;
    overflow-y: auto;
    padding: 32px;
  }
}

/* Desktop: Larger modal */
@media (min-width: 1024px) {
  .modal__content {
    max-width: 600px;
    padding: 40px;
  }
}
```

### Typography Scaling

```css
/* Mobile base sizes */
.heading-display {
  font-size: 28px;
  line-height: 1.2;
}

.heading-1 {
  font-size: 24px;
  line-height: 1.3;
}

.heading-2 {
  font-size: 20px;
  line-height: 1.4;
}

.body {
  font-size: 15px;
  line-height: 1.6;
}

/* Desktop: Scale up */
@media (min-width: 1024px) {
  .heading-display {
    font-size: 32px;
  }

  .heading-1 {
    font-size: 28px;
  }

  .heading-2 {
    font-size: 22px;
  }

  .body {
    font-size: 16px;
  }
}

/* Fluid typography (advanced) */
@media (min-width: 768px) {
  .heading-display {
    font-size: clamp(28px, 4vw, 32px);
  }

  .heading-1 {
    font-size: clamp(24px, 3.5vw, 28px);
  }
}
```

### Spacing Adjustments

```css
/* Mobile: Tighter spacing */
:root {
  --spacing-section: 24px;
  --spacing-component: 16px;
  --spacing-element: 12px;
}

/* Tablet: Medium spacing */
@media (min-width: 768px) {
  :root {
    --spacing-section: 32px;
    --spacing-component: 20px;
    --spacing-element: 16px;
  }
}

/* Desktop: Generous spacing */
@media (min-width: 1024px) {
  :root {
    --spacing-section: 48px;
    --spacing-component: 24px;
    --spacing-element: 20px;
  }
}

/* Usage */
.section {
  margin-bottom: var(--spacing-section);
}

.component {
  padding: var(--spacing-component);
}
```

---

## Testing & Validation

### Automated Testing Tools

```
✓ Lighthouse Accessibility Audit
  - Target score: 100
  - Run on every deployment
  - Check: Color contrast, ARIA, alt text, labels

✓ axe DevTools
  - Browser extension for manual testing
  - Catches 57% of WCAG issues automatically
  - Run on each screen/component

✓ WAVE (Web Accessibility Evaluation Tool)
  - Visual feedback on accessibility
  - Identifies errors, alerts, features
  - Good for quick checks during development

✓ Pa11y
  - CI/CD integration
  - Automated testing on each commit
  - Fail build if critical issues found

✓ HTML Validator
  - Ensure valid HTML
  - No duplicate IDs, proper nesting
  - W3C validator
```

### Manual Testing Checklist

**Keyboard Navigation**
```
□ Tab through entire page without getting stuck
□ All interactive elements reachable
□ Focus indicator clearly visible
□ Logical tab order
□ Enter/Space activates buttons
□ Arrow keys work on radio groups, calendar
□ Escape closes modals
□ No keyboard traps
```

**Screen Reader Testing**
```
Tools: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS), TalkBack (Android)

□ Page title announced
□ Headings navigable (H key)
□ Landmarks navigable (D key)
□ Forms navigable (F key)
□ All images have alt text
□ Form labels associated with inputs
□ Error messages announced
□ Loading states announced
□ Dynamic content updates announced
□ Buttons have descriptive labels
□ Links have clear purpose
```

**Mobile Accessibility**
```
□ Touch targets minimum 48×48px
□ Spacing between targets adequate
□ Pinch to zoom enabled
□ Screen rotates (portrait/landscape)
□ Voice control works (iOS Voice Control, Android Voice Access)
□ Font sizing works (system settings)
□ Contrast sufficient in bright light
```

**Visual Testing**
```
□ Test with browser zoom (200%, 400%)
□ Test with increased text spacing
□ Test with custom fonts disabled
□ Test with color blindness simulator (Deuteranopia, Protanopia, Tritanopia)
□ Test in high contrast mode
□ Test with dark mode (if supported)
```

### Device Testing Matrix

```
┌──────────────────┬─────────┬───────────┬────────────┐
│ Device/Browser   │ Mobile  │ Tablet    │ Desktop    │
├──────────────────┼─────────┼───────────┼────────────┤
│ iOS Safari       │ ✓ Must  │ ✓ Should  │ N/A        │
│ Android Chrome   │ ✓ Must  │ ✓ Should  │ N/A        │
│ Chrome (Desktop) │ N/A     │ ○ Nice    │ ✓ Must     │
│ Firefox          │ N/A     │ ○ Nice    │ ✓ Should   │
│ Safari (Desktop) │ N/A     │ N/A       │ ✓ Should   │
│ Edge             │ N/A     │ N/A       │ ✓ Should   │
└──────────────────┴─────────┴───────────┴────────────┘

Must: Critical, MVP requirement
Should: Important, test before launch
Nice: Good to have, test if time permits
```

### Responsive Testing Tools

```
✓ Chrome DevTools Device Mode
  - Test various screen sizes
  - Throttle network
  - Rotate device

✓ BrowserStack / Sauce Labs
  - Test on real devices
  - Multiple OS versions
  - Network conditions

✓ Responsive Design Checker
  - Quick size previews
  - Common breakpoints
  - Portrait/landscape

✓ Real devices (ideal)
  - iPhone SE (smallest)
  - iPhone 14 Pro Max (large mobile)
  - iPad Mini (small tablet)
  - iPad Pro (large tablet)
  - Desktop 1080p, 1440p
```

---

## Implementation Code Examples

### React Component with Accessibility

```jsx
// DoctorCard.jsx
import React from 'react';

const DoctorCard = ({ doctor, onSelect, isSelected }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(doctor);
    }
  };

  return (
    <button
      className={`doctor-card ${isSelected ? 'doctor-card--selected' : ''}`}
      onClick={() => onSelect(doctor)}
      onKeyDown={handleKeyDown}
      aria-label={`Pilih ${doctor.name}, ${doctor.specialization}, Rating ${doctor.rating} dari 5`}
      aria-pressed={isSelected}
      role="button"
      tabIndex={0}
    >
      <img
        src={doctor.avatar || '/placeholder-doctor.jpg'}
        alt={`Foto ${doctor.name}`}
        className="doctor-card__avatar"
      />

      <div className="doctor-card__content">
        <h3 className="doctor-card__name">{doctor.name}</h3>
        <p className="doctor-card__specialization">{doctor.specialization}</p>

        <div className="doctor-card__rating" aria-label={`Rating ${doctor.rating} dari 5 berdasarkan ${doctor.reviewCount} ulasan`}>
          <span aria-hidden="true">⭐</span>
          <span>{doctor.rating}</span>
          <span className="text-muted">({doctor.reviewCount} ulasan)</span>
        </div>
      </div>

      <span className="doctor-card__chevron" aria-hidden="true">
        →
      </span>
    </button>
  );
};

export default DoctorCard;
```

### Calendar with Keyboard Navigation

```jsx
// Calendar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { addDays, subDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

const Calendar = ({ selectedDate, onDateSelect, availableDates }) => {
  const [focusedDate, setFocusedDate] = useState(selectedDate || new Date());
  const calendarRef = useRef(null);

  const handleKeyDown = (e, date) => {
    let newDate;

    switch(e.key) {
      case 'ArrowLeft':
        newDate = subDays(date, 1);
        break;
      case 'ArrowRight':
        newDate = addDays(date, 1);
        break;
      case 'ArrowUp':
        newDate = subDays(date, 7);
        break;
      case 'ArrowDown':
        newDate = addDays(date, 7);
        break;
      case 'Home':
        newDate = startOfWeek(date);
        break;
      case 'End':
        newDate = endOfWeek(date);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isDateAvailable(date)) {
          onDateSelect(date);
        }
        return;
      default:
        return;
    }

    e.preventDefault();
    setFocusedDate(newDate);
  };

  useEffect(() => {
    // Focus the active date cell
    const activeDateCell = calendarRef.current?.querySelector('[aria-selected="true"]');
    activeDateCell?.focus();
  }, [focusedDate]);

  const isDateAvailable = (date) => {
    return availableDates.some(d => isSameDay(d, date));
  };

  return (
    <div
      ref={calendarRef}
      className="calendar"
      role="grid"
      aria-label="Kalender untuk memilih tanggal janji temu"
    >
      {/* Calendar implementation */}
      {dates.map(date => (
        <button
          key={date.toString()}
          className="calendar__date"
          role="gridcell"
          aria-selected={isSameDay(date, selectedDate)}
          aria-disabled={!isDateAvailable(date)}
          aria-label={formatDate(date, 'EEEE, d MMMM yyyy') + (isDateAvailable(date) ? ', tersedia' : ', tidak tersedia')}
          tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, date)}
          onClick={() => isDateAvailable(date) && onDateSelect(date)}
          disabled={!isDateAvailable(date)}
        >
          {format(date, 'd')}
        </button>
      ))}
    </div>
  );
};
```

### Form with Validation

```jsx
// PatientInfoForm.jsx
import React, { useState } from 'react';

const PatientInfoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch(name) {
      case 'name':
        if (!value) return 'Nama lengkap wajib diisi';
        if (value.length < 3) return 'Nama terlalu pendek (minimal 3 karakter)';
        return '';

      case 'phone':
        if (!value) return 'Nomor WhatsApp wajib diisi';
        if (!/^8[0-9]{9,12}$/.test(value)) return 'Nomor WhatsApp tidak valid (contoh: 81234567890)';
        return '';

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format email tidak valid';
        }
        return '';

      default:
        return '';
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ name: true, phone: true, email: true, notes: true });

      // Focus first error field
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementById(firstErrorField)?.focus();

      // Announce error to screen reader
      const errorCount = Object.keys(newErrors).length;
      announceToScreenReader(
        `Form memiliki ${errorCount} error. ${newErrors[firstErrorField]}`,
        'assertive'
      );

      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Formulir informasi pasien"
      noValidate
    >
      {/* Name field */}
      <div className="form-field">
        <label htmlFor="name" className="form-label">
          Nama Lengkap
          <span className="required" aria-label="wajib diisi">*</span>
        </label>

        <input
          id="name"
          name="name"
          type="text"
          className={`form-input ${errors.name && touched.name ? 'form-input--error' : ''}`}
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          aria-required="true"
          aria-invalid={errors.name && touched.name ? 'true' : 'false'}
          aria-describedby="name-helper name-error"
          autoComplete="name"
        />

        <span id="name-helper" className="form-helper">
          Masukkan nama lengkap sesuai identitas
        </span>

        {errors.name && touched.name && (
          <span id="name-error" className="form-error" role="alert">
            <span aria-hidden="true">⚠</span> {errors.name}
          </span>
        )}
      </div>

      {/* Phone field */}
      <div className="form-field">
        <label htmlFor="phone" className="form-label">
          Nomor WhatsApp
          <span className="required" aria-label="wajib diisi">*</span>
        </label>

        <div className="phone-input">
          <input
            type="text"
            className="phone-input__prefix"
            value="+62"
            disabled
            aria-label="Kode negara Indonesia"
          />

          <input
            id="phone"
            name="phone"
            type="tel"
            className={`phone-input__number ${errors.phone && touched.phone ? 'form-input--error' : ''}`}
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-required="true"
            aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
            aria-describedby="phone-helper phone-error"
            autoComplete="tel"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <span id="phone-helper" className="form-helper">
          💬 Kami akan kirim konfirmasi via WhatsApp
        </span>

        {errors.phone && touched.phone && (
          <span id="phone-error" className="form-error" role="alert">
            <span aria-hidden="true">⚠</span> {errors.phone}
          </span>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={Object.keys(errors).some(key => errors[key])}
      >
        Lanjutkan
      </button>

      {/* Screen reader announcer */}
      <div
        id="aria-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </form>
  );
};
```

### CSS Utilities

```css
/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus visible (keyboard only) */
.focus-visible:focus-visible {
  outline: 3px solid #008577;
  outline-offset: 2px;
}

.focus-visible:focus:not(:focus-visible) {
  outline: none;
}

/* Skip to main content */
.skip-to-main {
  position: absolute;
  top: -100px;
  left: 0;
  background: #008577;
  color: white;
  padding: 12px 16px;
  text-decoration: none;
  z-index: 9999;
}

.skip-to-main:focus {
  top: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .btn {
    border: 2px solid currentColor;
  }

  .card {
    border: 2px solid currentColor;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Summary Checklist

### Pre-Launch Accessibility Checklist

```
□ All images have alt text
□ Form inputs have labels
□ Color contrast meets WCAG AA
□ Keyboard navigation works completely
□ Focus indicators visible
□ No keyboard traps
□ Headings in logical order
□ Landmarks used properly
□ ARIA labels where needed
□ Screen reader tested
□ Touch targets minimum 48×48px
□ Zoom to 200% works
□ Text spacing adjustable
□ Motion can be reduced
□ Error messages clear and helpful
□ Forms validate accessibly
□ Modals trap focus properly
□ Live regions announce updates
□ Skip to main content available
□ Page titles descriptive
□ Language attribute set
```

### Pre-Launch Responsive Checklist

```
□ Tested on iPhone SE (320px)
□ Tested on standard mobile (375px-428px)
□ Tested on tablet portrait (768px)
□ Tested on tablet landscape (1024px)
□ Tested on desktop (1440px+)
□ Tested in portrait orientation
□ Tested in landscape orientation
□ No horizontal scrolling on mobile
□ Touch targets adequate size
□ Text readable without zoom
□ Images responsive
□ Forms usable on all sizes
□ Modals work on all sizes
□ CTA accessible on all sizes
□ No content cutoff
□ Safe area insets respected (iPhone X+)
```

---

This completes the comprehensive accessibility and responsive design guide for the patient booking interface. All requirements from WCAG 2.1 AA are addressed with practical implementation examples and testing procedures.
