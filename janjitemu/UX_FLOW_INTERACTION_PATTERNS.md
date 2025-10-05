# UX Flow & Interaction Patterns
## Patient Booking Interface

---

## Table of Contents
1. [User Journey Maps](#user-journey-maps)
2. [Interaction Patterns](#interaction-patterns)
3. [State Management](#state-management)
4. [Error Handling Patterns](#error-handling-patterns)
5. [Performance Optimization](#performance-optimization)
6. [Accessibility Patterns](#accessibility-patterns)
7. [Mobile-Specific Patterns](#mobile-specific-patterns)
8. [Edge Cases & Scenarios](#edge-cases--scenarios)

---

## User Journey Maps

### Journey 1: Fast-Track Booking (Happy Path)

```
User Goal: Book appointment with specific time, pay online

┌─────────────────────────────────────────────────────────────┐
│ STAGE 1: DISCOVERY & SELECTION                              │
└─────────────────────────────────────────────────────────────┘

Step 1: Land on page
├─ User Action:    Opens booking link
├─ Emotion:        Curious, hopeful
├─ Touchpoint:     Landing page
├─ Duration:       5-10 seconds
└─ Success:        Sees list of doctors clearly

Step 2: Select doctor
├─ User Action:    Reviews doctors, taps preferred one
├─ Emotion:        Confident (if familiar), uncertain (if new)
├─ Pain Point:     May not know which doctor to choose
├─ Solution:       Show specialization, ratings, reviews
├─ Duration:       10-30 seconds
└─ Success:        Doctor selected, moves to next screen

┌─────────────────────────────────────────────────────────────┐
│ STAGE 2: CONFIGURATION                                      │
└─────────────────────────────────────────────────────────────┘

Step 3: Choose booking type
├─ User Action:    Reads options, selects Fast-Track
├─ Emotion:        Decisive (wants convenience)
├─ Pain Point:     Price concern (Rp 50.000)
├─ Solution:       Clear value proposition, benefits list
├─ Duration:       10-20 seconds
└─ Success:        Understands difference, commits to fast-track

Step 4: Select date
├─ User Action:    Views calendar, picks available date
├─ Emotion:        Focused, planning
├─ Pain Point:     Limited availability, date conflicts
├─ Solution:       Show current month + next, highlight available
├─ Duration:       15-40 seconds
└─ Success:        Date selected that fits schedule

Step 5: Select time slot
├─ User Action:    Reviews available times, picks one
├─ Emotion:        Relieved (found good time), frustrated (limited)
├─ Pain Point:     Preferred time not available
├─ Solution:       Group by time of day, show duration
├─ Duration:       10-30 seconds
└─ Success:        Time slot selected

┌─────────────────────────────────────────────────────────────┐
│ STAGE 3: INFORMATION & COMMITMENT                           │
└─────────────────────────────────────────────────────────────┘

Step 6: Fill patient info
├─ User Action:    Enters name, phone, optional email/notes
├─ Emotion:        Routine, slightly impatient
├─ Pain Point:     Too many fields, unclear requirements
├─ Solution:       Minimal required fields, inline validation
├─ Duration:       30-60 seconds
└─ Success:        Form completed without errors

Step 7: Select payment method
├─ User Action:    Chooses preferred payment (QRIS, bank, card)
├─ Emotion:        Cautious (security), wanting convenience
├─ Pain Point:     Unfamiliar payment method, security concerns
├─ Solution:       Trusted logos, security badge, clear instructions
├─ Duration:       10-20 seconds
└─ Success:        Payment method selected

Step 8: Complete payment
├─ User Action:    Scans QR / transfers / enters card details
├─ Emotion:        Focused, slightly anxious (will it work?)
├─ Pain Point:     Payment failure, slow processing
├─ Solution:       Real-time status, clear instructions, timeout handling
├─ Duration:       30-120 seconds
└─ Success:        Payment confirmed

┌─────────────────────────────────────────────────────────────┐
│ STAGE 4: CONFIRMATION & FOLLOW-UP                           │
└─────────────────────────────────────────────────────────────┘

Step 9: View confirmation
├─ User Action:    Reads booking details, saves info
├─ Emotion:        Relieved, satisfied, accomplished
├─ Touchpoint:     Confirmation screen + WhatsApp message
├─ Duration:       20-60 seconds
└─ Success:        Booking number saved, next steps clear

Step 10: Receive reminders
├─ User Action:    Receives WhatsApp H-1 and H-0
├─ Emotion:        Grateful (won't forget), prepared
├─ Touchpoint:     WhatsApp notifications
├─ Duration:       N/A (automated)
└─ Success:        Patient remembers appointment

Step 11: Attend appointment
├─ User Action:    Arrives at clinic, shows booking number
├─ Emotion:        Confident, timely
├─ Touchpoint:     Clinic check-in
├─ Duration:       2-5 minutes (check-in)
└─ Success:        Fast-tracked, minimal wait

TOTAL JOURNEY TIME: 2-5 minutes (booking)
                    + payment time (varies)

SATISFACTION DRIVERS:
✓ Speed and simplicity
✓ Clear pricing and value
✓ Flexible payment options
✓ Instant confirmation
✓ Helpful reminders
✓ Reduced waiting time at clinic
```

---

### Journey 2: Regular Booking (Alternative Path)

```
User Goal: Reserve appointment without specific time, pay at clinic

Similar to Fast-Track until Step 3, then:

Step 3: Choose booking type
├─ User Action:    Selects "Reservasi Biasa"
├─ Emotion:        Budget-conscious, flexible
├─ Motivation:     Free, no payment needed
└─ Success:        Selected regular booking

Step 4: Select date only
├─ User Action:    Picks date (no time selection needed)
├─ Duration:       10-30 seconds
└─ Success:        Date selected

Step 5: Fill patient info
├─ Same as Fast-Track Step 6
├─ Duration:       30-60 seconds
└─ Success:        Info submitted

Step 6: View confirmation
├─ User Action:    Sees reservation confirmed (not time-specific)
├─ Emotion:        Satisfied (free), slightly uncertain (what time?)
├─ Message:        "Datang sebelum 12:00, antri seperti walk-in"
└─ Success:        Understands expectations

TOTAL JOURNEY TIME: 1-3 minutes

SATISFACTION DRIVERS:
✓ No payment required
✓ Even faster booking
✓ Still gets reminder
✓ Flexibility

POTENTIAL FRICTION:
⚠ Uncertainty about wait time
⚠ May still wait long at clinic
```

---

## Interaction Patterns

### Pattern 1: Progressive Disclosure

**Principle**: Show only what's needed at each step, reveal details progressively.

**Implementation**:

```
Doctor Selection Screen:
├─ Initially show:  Doctor list (name, specialty, rating)
├─ On selection:    Transition to booking type
└─ Hidden:          All subsequent forms

Booking Type Screen:
├─ Initially show:  Both options, benefits list
├─ On selection:    Enable CTA, highlight chosen card
└─ Hidden:          Date picker (until proceed)

Date Selection Screen:
├─ Initially show:  Current month calendar
├─ On month change: Fetch + show new month's availability
├─ On date select:  Enable CTA
└─ Hidden:          Time slots (until proceed)

Benefits:
✓ Reduces cognitive load
✓ Prevents overwhelm
✓ Maintains focus on current task
✓ Improves mobile scrolling experience
```

### Pattern 2: Immediate Feedback

**Principle**: Provide instant visual/haptic feedback for all interactions.

**Interactions Requiring Feedback**:

```
┌─────────────────────┬──────────────────┬───────────────────┐
│ Interaction         │ Visual Feedback  │ Additional        │
├─────────────────────┼──────────────────┼───────────────────┤
│ Tap doctor card     │ Scale + shadow   │ Haptic (light)    │
│ Select booking type │ Border + bg color│ Haptic (medium)   │
│ Select date         │ Background color │ Haptic (light)    │
│ Select time slot    │ Fill color       │ Haptic (light)    │
│ Input validation    │ Checkmark/error  │ None              │
│ Submit form         │ Button spinner   │ Disable form      │
│ Payment success     │ Animated check   │ Haptic (success)  │
│ Copy booking number │ Checkmark toast  │ System clipboard  │
└─────────────────────┴──────────────────┴───────────────────┘

Timing:
- Visual feedback: < 100ms (instant perception)
- Haptic feedback: Concurrent with visual
- State change: < 200ms (perceived as instant)
- Animations: 200-300ms (noticeable but quick)
```

### Pattern 3: Persistent Context

**Principle**: Always show what user has selected so far.

**Implementation**:

```
Breadcrumb Info Card (appears from Step 2 onwards):
┌─────────────────────────────────────────────┐
│ Dr. Ahmad Suharto                           │ ← Always visible
│ Fast-Track • 15 Okt • 09:00                │ ← Grows as selections made
└─────────────────────────────────────────────┘

Progressive content:
Step 1: [Nothing shown yet]
Step 2: "Dr. Ahmad Suharto"
Step 3: "Dr. Ahmad • Fast-Track"
Step 4: "Dr. Ahmad • Fast-Track • 15 Okt"
Step 5: "Dr. Ahmad • Fast-Track • 15 Okt • 09:00"

Position:
- Mobile: Sticky below header
- Desktop: Sidebar or top of content

Benefits:
✓ Prevents disorientation
✓ Allows verification at any point
✓ Builds confidence
✓ Reduces anxiety about selections
```

### Pattern 4: Optimistic UI Updates

**Principle**: Update UI immediately, roll back if server fails.

**Use Cases**:

```javascript
// Time slot selection
onSlotClick(slot) {
  // 1. Optimistically update UI
  setSelectedSlot(slot);
  enableCTA();

  // 2. Verify with server (in background)
  verifySlotAvailability(slot)
    .then(available => {
      if (!available) {
        // Roll back
        setSelectedSlot(null);
        disableCTA();
        showToast('Slot baru saja terisi, silakan pilih lain', 'warning');
      }
    });
}

// Form submission
onFormSubmit(data) {
  // 1. Optimistically show loading
  setLoading(true);

  // 2. Submit to server
  createBooking(data)
    .then(booking => {
      // Success: navigate to confirmation
      navigateToConfirmation(booking);
    })
    .catch(error => {
      // Roll back
      setLoading(false);
      showError(error.message);
    });
}

Benefits:
✓ Perceived performance improvement
✓ Instant response to user actions
✓ Smoother experience
✓ No "waiting" feeling
```

### Pattern 5: Graceful Degradation

**Principle**: Core functionality works even if enhancements fail.

**Layers of Functionality**:

```
Layer 1 (Essential):
✓ View doctors
✓ Select date
✓ Submit booking
✓ View confirmation
→ Works with: Basic HTML forms, no JS

Layer 2 (Enhanced):
✓ Interactive calendar
✓ Real-time validation
✓ Dynamic availability
✓ Progress indicator
→ Requires: JavaScript, modern browser

Layer 3 (Optimal):
✓ Animations
✓ Haptic feedback
✓ Auto-save progress
✓ Real-time slot updates
→ Requires: Latest browsers, APIs

Fallback Strategies:
┌─────────────────────┬──────────────────────────────┐
│ Feature Failed      │ Fallback                     │
├─────────────────────┼──────────────────────────────┤
│ JS not loaded       │ Basic form submission        │
│ API slow/timeout    │ Show retry, offline message  │
│ Payment gateway down│ Offer alternative methods    │
│ WhatsApp API failed │ Show booking number, manual  │
│ Calendar not working│ Text input for date          │
└─────────────────────┴──────────────────────────────┘
```

### Pattern 6: Smart Defaults

**Principle**: Pre-select sensible options to reduce user effort.

**Default Behaviors**:

```
Doctor Selection:
- Sort by: Rating (highest first)
- Alternative: Most booked (if available)
- Reason: Users likely want best/popular doctors

Booking Type:
- Default: No selection (force choice)
- Alternative A/B test: Pre-select Regular (free option)
- Reason: Ensure informed decision

Date Selection:
- Initial month: Current month
- Highlight: Today (if available)
- Auto-select: None (user must choose)
- Reason: Prevent accidental bookings

Time Selection:
- Sort by: Chronological (earliest first)
- Highlight: Next available slot
- Auto-select: None
- Reason: User preference varies

Payment Method:
- Default: No selection
- Alternative: Pre-select most popular (QRIS in Indonesia)
- Reason: Faster for majority, but must be conscious choice
```

### Pattern 7: Error Prevention

**Principle**: Prevent errors before they happen.

**Prevention Strategies**:

```
Input Constraints:
┌──────────────────┬─────────────────────────────────┐
│ Field            │ Prevention                      │
├──────────────────┼─────────────────────────────────┤
│ Name             │ Limit to letters, spaces        │
│ Phone            │ Type="tel", pattern validation  │
│ Email            │ Type="email", format check      │
│ Date             │ Disable past dates, unavailable │
│ Time             │ Hide booked slots               │
│ Payment amount   │ Read-only, auto-calculated      │
└──────────────────┴─────────────────────────────────┘

UI Constraints:
- Disable CTA until valid selection
- Gray out unavailable options
- Prevent double-submission (button disable)
- Prevent booking overlapping times
- Validate while typing (debounced)

Logical Constraints:
- Can't select time before selecting date
- Can't pay without selecting method
- Can't proceed without required fields
- Can't book past dates
- Can't double-book same slot

Confirmations:
- Confirm before leaving incomplete booking
- Confirm before canceling payment
- Confirm before closing during processing
```

### Pattern 8: Forgiving Interactions

**Principle**: Allow users to easily undo or change selections.

**Undo Mechanisms**:

```
Back Button (every screen):
├─ Function:    Returns to previous screen
├─ Data:        Preserves previous selections
├─ Confirm:     Only if significant progress made
└─ Keyboard:    ESC key (desktop)

Change Selection (same screen):
├─ Doctor:      Can select different doctor anytime
├─ Date:        Can select different date anytime
├─ Time:        Can select different time anytime
├─ Booking type: Can switch between fast-track/regular
└─ Payment:     Can choose different method (before paying)

Edit After Submission (future enhancement):
├─ Reschedule:  Via link in WhatsApp message
├─ Cancel:      Via link or contact clinic
└─ Limitation:  Based on clinic policy (e.g., 24h notice)

Auto-save Progress (advanced):
├─ Save state:  Every selection to localStorage
├─ Restore:     On page reload or return
├─ Expire:      After 24 hours
└─ Clear:       On successful booking
```

---

## State Management

### Application State Architecture

```javascript
// Global booking state
const bookingState = {
  // Selection state
  selectedDoctor: null,
  bookingType: null,      // 'fast-track' | 'regular'
  selectedDate: null,
  selectedTime: null,
  patientInfo: {},
  paymentMethod: null,

  // UI state
  currentStep: 1,
  totalSteps: 4,          // 4 for regular, 5 for fast-track
  isLoading: false,
  errors: {},

  // Data state
  doctors: [],
  availability: {},
  timeSlots: [],

  // Payment state
  paymentIntentId: null,
  paymentStatus: 'idle',  // 'idle' | 'pending' | 'success' | 'failed'

  // Confirmation state
  bookingId: null,
  bookingNumber: null,
  confirmationData: null
}
```

### State Transitions

```
STATE FLOW DIAGRAM:

[IDLE]
  ↓ (user lands)
[SELECTING_DOCTOR]
  ↓ (doctor selected)
[SELECTING_TYPE]
  ↓ (type selected)
[SELECTING_DATE]
  ↓ (date selected)
[SELECTING_TIME] ← (skip if regular)
  ↓ (time selected / skipped)
[ENTERING_INFO]
  ↓ (info submitted)
[SELECTING_PAYMENT] ← (skip if regular)
  ↓ (payment method selected)
[PROCESSING_PAYMENT] ← (skip if regular)
  ↓ (payment success / regular booking created)
[CONFIRMED]

ERROR STATES (can occur at any point):
- [LOADING_ERROR]: Data fetch failed
- [VALIDATION_ERROR]: Form validation failed
- [PAYMENT_ERROR]: Payment processing failed
- [NETWORK_ERROR]: Connection lost
```

### State Persistence

```javascript
// Save to localStorage on each state change
saveBookingProgress(state) {
  const persistentState = {
    selectedDoctor: state.selectedDoctor,
    bookingType: state.bookingType,
    selectedDate: state.selectedDate,
    selectedTime: state.selectedTime,
    patientInfo: state.patientInfo,
    savedAt: new Date().toISOString(),
    expiresAt: addHours(new Date(), 24).toISOString()
  };

  localStorage.setItem('bookingProgress', JSON.stringify(persistentState));
}

// Restore on page load
restoreBookingProgress() {
  const saved = localStorage.getItem('bookingProgress');

  if (!saved) return null;

  const state = JSON.parse(saved);

  // Check if expired
  if (new Date(state.expiresAt) < new Date()) {
    localStorage.removeItem('bookingProgress');
    return null;
  }

  // Prompt user to continue or start fresh
  return state;
}

// Clear on successful booking
clearBookingProgress() {
  localStorage.removeItem('bookingProgress');
}
```

---

## Error Handling Patterns

### Error Classification

```
┌─────────────────┬────────────────┬──────────────────┬──────────────┐
│ Error Type      │ Severity       │ User Action      │ Auto Retry   │
├─────────────────┼────────────────┼──────────────────┼──────────────┤
│ Validation      │ Low            │ Fix input        │ No           │
│ Network timeout │ Medium         │ Retry            │ Yes (3x)     │
│ API error 500   │ High           │ Retry later      │ Yes (1x)     │
│ Payment failed  │ High           │ Change method    │ No           │
│ Slot taken      │ Medium         │ Choose another   │ No           │
│ Session expired │ Medium         │ Restart booking  │ No           │
└─────────────────┴────────────────┴──────────────────┴──────────────┘
```

### Error Messaging Patterns

**Formula**: [What happened] + [Why it happened] + [What to do]

```javascript
// Good Examples:

// Validation error
"Nomor WhatsApp tidak valid. Pastikan nomor dimulai dengan 8 (setelah +62). Contoh: 81234567890"
└─ What: Invalid      └─ Why: Format wrong    └─ What to do: Format example

// Network error
"Tidak dapat memuat data. Koneksi internet terputus. Periksa koneksi Anda dan coba lagi."
└─ What: Can't load   └─ Why: No connection   └─ What to do: Check & retry

// Slot taken error
"Slot ini baru saja dipesan pasien lain. Pilih waktu lain yang tersedia."
└─ What: Slot taken   └─ Why: Someone booked  └─ What to do: Choose another

// Payment failed
"Pembayaran gagal. Saldo e-wallet tidak mencukupi. Isi saldo atau gunakan metode pembayaran lain."
└─ What: Failed       └─ Why: Insufficient    └─ What to do: Top up or change

// Bad Examples (avoid):
❌ "Error"                    → Too vague
❌ "Invalid input"           → Doesn't explain which field or why
❌ "Try again"               → Doesn't explain what happened
❌ "Error code: 500"         → Technical, unhelpful
```

### Error UI Patterns

**Inline Error (Form Fields)**
```
┌─────────────────────────────────┐
│ Nomor WhatsApp *                │ ← Label (normal)
├─────────────────────────────────┤
│ +62 | 123                       │ ← Input (red border)
│      └─ [Error icon]            │
├─────────────────────────────────┤
│ ⚠ Nomor terlalu pendek (min 10) │ ← Error message (red text)
└─────────────────────────────────┘

Behavior:
- Show on blur (after user leaves field)
- Hide when user starts typing (give second chance)
- Re-validate on blur again
- Prevent submission if errors exist
```

**Toast Notification (Transient Errors)**
```
┌──────────────────────────────────────────┐
│ ⚠ Slot baru saja terisi. Pilih lain.   │ ← Warning toast
└──────────────────────────────────────────┘
                 ↑
        Auto-dismiss in 3s

Usage:
- Slot conflicts
- Network issues (transient)
- Success confirmations
- Information updates
```

**Modal Error (Blocking Errors)**
```
┌─────────────────────────────────────────┐
│                [X Close]                │
│                                         │
│         [Error Icon]                    │
│                                         │
│    Pembayaran Gagal                     │
│                                         │
│    Saldo e-wallet tidak mencukupi.      │
│    Silakan isi saldo atau pilih         │
│    metode pembayaran lain.              │
│                                         │
│  [Isi Saldo]    [Pilih Metode Lain]    │
└─────────────────────────────────────────┘

Usage:
- Payment failures
- Critical API errors
- Session expiration
- Must be acknowledged
```

**Empty State (No Data Errors)**
```
┌─────────────────────────────────────────┐
│          [Calendar X Icon]              │
│                                         │
│     Tidak Ada Slot Tersedia             │
│                                         │
│     Semua waktu pada tanggal ini        │
│     sudah penuh. Silakan pilih          │
│     tanggal lain.                       │
│                                         │
│       [Pilih Tanggal Lain]              │
└─────────────────────────────────────────┘

Usage:
- No available slots
- No doctors found
- Search returns empty
- Encourage next action
```

### Retry Strategies

```javascript
// Exponential backoff for API calls
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response.json();
      }

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }

      // Retry on 5xx errors (server errors)
      lastError = new Error(`Server error: ${response.status}`);

    } catch (error) {
      lastError = error;
    }

    // Wait before retrying (exponential backoff)
    if (i < maxRetries - 1) {
      const delay = Math.min(1000 * Math.pow(2, i), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Usage
try {
  const data = await fetchWithRetry('/api/doctors');
} catch (error) {
  showError('Gagal memuat data dokter. Silakan coba lagi.');
}
```

---

## Performance Optimization

### Loading Strategies

**Critical Rendering Path**
```
Priority 1 (Immediate):
├─ HTML structure
├─ Critical CSS (above-fold styles)
├─ Logo and branding
└─ Doctor list (first screen)

Priority 2 (Fast):
├─ JavaScript for interactions
├─ Font files (with fallback)
├─ Icons
└─ Secondary styles

Priority 3 (Lazy):
├─ Doctor avatars (lazy load)
├─ Payment gateway scripts (on demand)
├─ Analytics
└─ Non-critical images
```

**Code Splitting**
```javascript
// Route-based splitting
const DoctorSelection = lazy(() => import('./screens/DoctorSelection'));
const BookingType = lazy(() => import('./screens/BookingType'));
const DateSelection = lazy(() => import('./screens/DateSelection'));
const TimeSelection = lazy(() => import('./screens/TimeSelection'));
const PatientInfo = lazy(() => import('./screens/PatientInfo'));
const Payment = lazy(() => import('./screens/Payment'));
const Confirmation = lazy(() => import('./screens/Confirmation'));

// Component-based splitting
const PaymentGateway = lazy(() => import('./components/PaymentGateway'));
const Calendar = lazy(() => import('./components/Calendar'));

// Load on interaction
const loadPaymentGateway = () => import('./components/PaymentGateway');

<button onClick={() => loadPaymentGateway().then(/* ... */)}>
  Bayar
</button>
```

**Data Fetching Optimization**
```javascript
// Prefetch next screen's data
onDoctorSelect(doctor) {
  // Update UI immediately
  setSelectedDoctor(doctor);

  // Prefetch availability in background
  prefetch(`/api/doctors/${doctor.id}/availability`);

  // Navigate to next screen
  navigate('/booking-type');
}

// Parallel data fetching
async function loadDateSelectionData(doctorId, type) {
  const [availability, holidays, doctorSchedule] = await Promise.all([
    fetch(`/api/doctors/${doctorId}/availability?type=${type}`),
    fetch('/api/holidays'),
    fetch(`/api/doctors/${doctorId}/schedule`)
  ]);

  return { availability, holidays, doctorSchedule };
}

// Debounced search (if implemented)
const searchDoctors = debounce((query) => {
  fetch(`/api/doctors?search=${query}`)
    .then(results => setSearchResults(results));
}, 300);
```

**Caching Strategy**
```javascript
// In-memory cache for session
const cache = new Map();

async function fetchDoctor(id) {
  if (cache.has(`doctor-${id}`)) {
    return cache.get(`doctor-${id}`);
  }

  const doctor = await fetch(`/api/doctors/${id}`).then(r => r.json());
  cache.set(`doctor-${id}`, doctor);

  return doctor;
}

// HTTP cache headers (server-side)
// Doctors list: Cache for 5 minutes
Cache-Control: public, max-age=300

// Availability: Cache for 1 minute (dynamic)
Cache-Control: public, max-age=60

// Booking confirmation: No cache (sensitive)
Cache-Control: no-store
```

### Perceived Performance

**Skeleton Screens**
```
Show skeleton immediately while loading:

Doctor List Skeleton:
┌─────────────────────────────────┐
│ [●●●] ▬▬▬▬▬▬▬▬▬              │
│       ▬▬▬▬▬▬                  │
│       ▬▬▬▬▬                   │
├─────────────────────────────────┤
│ [●●●] ▬▬▬▬▬▬▬▬▬              │
│       ▬▬▬▬▬▬                  │
└─────────────────────────────────┘

Benefit: User sees progress immediately
Duration: 200-500ms (feels instant)
```

**Optimistic UI**
```javascript
// Show selection immediately, verify later
function selectTimeSlot(slot) {
  // 1. Update UI instantly
  setSelectedSlot(slot);
  enableCTA();

  // 2. Verify in background
  verifyAvailability(slot)
    .catch(() => {
      // Roll back only if verification fails
      setSelectedSlot(null);
      disableCTA();
      showToast('Slot tidak tersedia');
    });
}
```

**Progressive Enhancement**
```
Layer 1: Content loads (HTML)
└─ Duration: 0-500ms

Layer 2: Styles applied (CSS)
└─ Duration: 500-800ms

Layer 3: Interactions enabled (JS)
└─ Duration: 800-1200ms

Layer 4: Enhancements loaded (animations, etc)
└─ Duration: 1200ms+

User can start using app at Layer 3 (< 1.2s)
```

---

## Accessibility Patterns

### Keyboard Navigation

**Tab Order**
```
Doctor Selection Screen:
1. Skip to main content (hidden until focused)
2. Logo/brand (if clickable)
3. Search input (if present)
4. Doctor card 1
5. Doctor card 2
6. Doctor card 3
...

Booking Type Screen:
1. Back button
2. Fast-track radio card
3. Regular radio card
4. Info link (if present)
5. Continue button

Form Screen:
1. Back button
2. Name input
3. Phone prefix (skip if disabled)
4. Phone number input
5. Email input (if present)
6. Notes textarea (if present)
7. Consent checkbox
8. Privacy link
9. Continue button
```

**Keyboard Shortcuts**
```
Global:
- Tab:          Next element
- Shift + Tab:  Previous element
- Enter/Space:  Activate button, select option
- Escape:       Close modal, cancel action

Calendar:
- Arrow keys:   Navigate dates
- Enter/Space:  Select date
- Home:         First day of week
- End:          Last day of week
- Page Up:      Previous month
- Page Down:    Next month

Radio groups:
- Arrow keys:   Navigate options
- Space:        Select option
- Tab:          Exit group

Form:
- Enter:        Submit form (if on input)
- Tab:          Next field
```

### Screen Reader Support

**Semantic HTML**
```html
<!-- Use semantic elements -->
<header>
  <h1>Pilih Dokter Anda</h1>
</header>

<main>
  <form aria-label="Formulir pemesanan janji temu">
    <fieldset>
      <legend>Informasi Pasien</legend>
      <!-- fields -->
    </fieldset>
  </form>
</main>

<!-- Not div soup -->
<div class="header">
  <div class="title">Pilih Dokter Anda</div>
</div>
```

**ARIA Labels**
```html
<!-- Doctor card -->
<button
  role="button"
  aria-label="Pilih Dr. Ahmad Suharto, Dokter Gigi, Rating 4.8 dari 5"
  aria-pressed="false"
>
  <!-- card content -->
</button>

<!-- Radio card -->
<div
  role="radio"
  aria-checked="true"
  aria-labelledby="fast-track-label"
  aria-describedby="fast-track-benefits"
  tabindex="0"
>
  <span id="fast-track-label">Fast-Track</span>
  <ul id="fast-track-benefits">
    <li>Pilih jam pasti</li>
    ...
  </ul>
</div>

<!-- Form input -->
<label for="patient-name">
  Nama Lengkap
  <span aria-label="wajib diisi">*</span>
</label>
<input
  id="patient-name"
  type="text"
  required
  aria-required="true"
  aria-invalid="false"
  aria-describedby="name-error name-helper"
/>
<span id="name-helper">Masukkan nama lengkap sesuai identitas</span>
<span id="name-error" role="alert"><!-- error message --></span>
```

**Live Regions**
```html
<!-- Announce loading states -->
<div role="status" aria-live="polite" aria-atomic="true">
  <span class="sr-only">Memuat ketersediaan dokter...</span>
</div>

<!-- Announce errors -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  Nomor WhatsApp tidak valid
</div>

<!-- Announce success -->
<div role="status" aria-live="polite">
  Booking berhasil dibuat
</div>
```

### Focus Management

**Focus Indicators**
```css
/* Visible focus ring */
*:focus {
  outline: 3px solid #008577;
  outline-offset: 2px;
}

/* Custom focus for buttons */
button:focus-visible {
  box-shadow: 0 0 0 3px rgba(0, 133, 119, 0.3);
  outline: none;
}

/* Don't hide focus on click (accessibility) */
/* Use :focus-visible to show only on keyboard focus */
```

**Focus Trapping (Modals)**
```javascript
function trapFocus(modalElement) {
  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modalElement.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab: going backwards
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: going forwards
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Focus first element when modal opens
  firstElement.focus();
}
```

**Focus Restoration**
```javascript
// Save focus before opening modal
const previousFocus = document.activeElement;

openModal();

// Restore focus when modal closes
closeModal();
previousFocus.focus();
```

### Color & Contrast

**Contrast Requirements**
```
WCAG AA Standards:

Normal text (< 18px):        4.5:1 minimum
Large text (≥ 18px):         3:0:1 minimum
UI components:               3:0:1 minimum

Our Implementation:
Body text (#4A4A4A on #FFFFFF):    9.4:1 ✓✓
Headings (#1A1A1A on #FFFFFF):     16.7:1 ✓✓
Primary button (#FFFFFF on #008577): 4.8:1 ✓
Links (#008577 on #FFFFFF):        4.5:1 ✓
Error text (#EF4444 on #FFFFFF):   4.6:1 ✓
```

**Non-Color Indicators**
```
Don't rely on color alone:

❌ Bad:
- Red for error (color only)
- Green for available dates (color only)

✓ Good:
- Red + error icon + error message
- Green + checkmark + "Available" label
- Unavailable dates: gray + strikethrough + disabled state
```

---

## Mobile-Specific Patterns

### Touch Targets

**Minimum Sizes**
```
Interactive elements:  48px × 48px (WCAG AAA)
Comfortable:           56px × 56px
Spacing:               8px minimum between targets

Examples:
- Buttons:             48px height
- Radio buttons:       24px visible, 48px touch area
- Calendar dates:      40px mobile, 48px tablet
- Icon buttons:        48px × 48px
- List items:          56px minimum height
```

### Gesture Support

**Common Gestures**
```
Swipe:
- Not implemented in MVP (avoid conflicts)
- Future: Swipe between screens

Pinch-to-zoom:
- Allowed on images (confirmation screen)
- Disabled on form inputs (prevents accidental zoom)

Pull-to-refresh:
- Not implemented (no refresh needed)
- Future: Refresh availability data

Long-press:
- Copy booking number (alternative to copy button)
- Context menu for links
```

### Keyboard Avoidance

**Problem**: Mobile keyboard covers bottom content/CTA

**Solutions**:
```javascript
// 1. Detect keyboard open
window.addEventListener('resize', () => {
  const keyboardOpen = window.innerHeight < initialHeight;

  if (keyboardOpen) {
    // Move CTA to top or scroll to input
    scrollActiveInputIntoView();

    // Or hide fixed CTA temporarily
    hideFixedCTA();
  }
});

// 2. Scroll input into view with padding
function scrollActiveInputIntoView() {
  const activeElement = document.activeElement;

  if (activeElement && activeElement.tagName === 'INPUT') {
    activeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',  // Center in viewport
      inline: 'nearest'
    });
  }
}

// 3. Use viewport units carefully
.fixed-cta {
  /* Don't use: */
  bottom: 0;  /* Gets covered by keyboard */

  /* Use: */
  position: sticky;
  bottom: env(safe-area-inset-bottom);  /* Respects keyboard */
}
```

### Safe Area Insets (iPhone X+)

```css
/* Respect notch and home indicator */
.header {
  padding-top: env(safe-area-inset-top);
}

.fixed-cta {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

/* In HTML */
<meta name="viewport" content="viewport-fit=cover">
```

### Haptic Feedback

```javascript
// Vibration API (where supported)
function hapticFeedback(type = 'light') {
  if (!navigator.vibrate) return;

  const patterns = {
    light:   [10],
    medium:  [20],
    heavy:   [30],
    success: [10, 50, 10],
    error:   [50, 100, 50]
  };

  navigator.vibrate(patterns[type]);
}

// Usage
onSlotSelect() {
  hapticFeedback('light');
  selectSlot();
}

onBookingSuccess() {
  hapticFeedback('success');
  showConfirmation();
}
```

---

## Edge Cases & Scenarios

### Scenario 1: Slow Network

```
Problem: User on 3G connection, page loads slowly

Solution:
1. Show skeleton screens immediately
2. Load critical content first (doctor list)
3. Defer non-critical (images, animations)
4. Show offline indicator if disconnected
5. Cache previously loaded data

UI:
┌─────────────────────────────────────┐
│ ⚠ Koneksi lambat                   │ ← Warning banner
│   Kami mengoptimalkan pengalaman... │
└─────────────────────────────────────┘

Code:
if (connection.effectiveType === '3g' || connection.effectiveType === '2g') {
  // Load low-res images
  // Disable animations
  // Increase timeout thresholds
}
```

### Scenario 2: Race Condition (Slot Booking)

```
Problem: Two users trying to book same slot simultaneously

Solution:
1. Optimistic UI (show selected immediately)
2. Backend lock on slot when selected (30s temp reservation)
3. Backend atomic booking transaction
4. Frontend polling for slot status
5. Rollback UI if conflict detected

Timeline:
00:00 - User A selects 09:00 slot → UI updates, temp reserve
00:02 - User B selects 09:00 slot → Temp reserve fails (locked by A)
00:02 - User B sees: "Slot baru saja dipesan, pilih lain"
00:15 - User A completes payment → Slot confirmed
00:30 - If User A doesn't complete → Temp reservation expires

Database:
UPDATE time_slots
SET status = 'booked', booked_by = 'user_a'
WHERE slot_id = 123
  AND status = 'available'  -- Atomic check
RETURNING *;

If returns 0 rows → Conflict, already booked
```

### Scenario 3: Payment Timeout

```
Problem: User scans QRIS but doesn't complete payment in time

Solution:
1. Show countdown timer (10 minutes)
2. Poll payment status every 3 seconds
3. On timeout:
   - Close modal
   - Show timeout message
   - Offer to retry or extend time
4. Save booking as "pending" (don't lose data)
5. Allow user to resume payment

UI Flow:
[Payment Modal]
  ↓ (10 minutes pass)
[Timeout Modal]
  "Waktu pembayaran habis"
  [Perpanjang Waktu] [Pilih Metode Lain]
  ↓ (user clicks extend)
[New QR Code] (fresh 10 minutes)

Backend:
// Mark booking as "pending_payment_expired"
// Allow re-activation with new payment intent
// Clean up expired bookings after 24 hours
```

### Scenario 4: Doctor Suddenly Unavailable

```
Problem: Doctor goes on emergency leave after user selects them

Solution:
1. Real-time availability updates (WebSocket or polling)
2. Notify user if doctor becomes unavailable during booking
3. Offer alternatives (reschedule or different doctor)
4. Don't lose user's progress

UI:
┌─────────────────────────────────────┐
│ ⚠ Dr. Ahmad tiba-tiba tidak tersedia│
│                                     │
│ Maaf, dokter berhalangan hadir.     │
│ Silakan pilih dokter lain atau      │
│ tanggal lain.                       │
│                                     │
│ [Pilih Dokter Lain] [Pilih Tanggal Lain]│
└─────────────────────────────────────┘

Admin Panel:
// Admin marks doctor unavailable
// System:
// - Removes all future availability
// - Notifies users with pending bookings
// - Offers rebooking options
```

### Scenario 5: Duplicate Booking Attempt

```
Problem: User accidentally submits form twice (double-click)

Solution:
1. Disable submit button immediately on first click
2. Show loading state
3. Backend idempotency key (prevent duplicate processing)
4. Check for existing recent booking before creating new

Code:
let isSubmitting = false;

async function handleSubmit() {
  if (isSubmitting) return;  // Prevent double-submit

  isSubmitting = true;
  disableButton();

  try {
    // Generate idempotency key
    const idempotencyKey = generateKey(patientInfo, selectedSlot);

    // Send with request
    const booking = await createBooking({
      ...bookingData,
      idempotencyKey
    });

    // Success
    navigateToConfirmation(booking);

  } catch (error) {
    showError(error);
  } finally {
    isSubmitting = false;
    enableButton();
  }
}

// Backend checks:
// If idempotency key exists in last 5 minutes:
//   - Return existing booking (don't create duplicate)
// Else:
//   - Create new booking with idempotency key
```

### Scenario 6: Browser Back Button

```
Problem: User clicks browser back button, loses progress

Solution:
1. Preserve state in URL (query params or hash)
2. Save progress to localStorage
3. Restore state when returning
4. Warn before leaving if unsaved changes

Code:
// Update URL on each step
history.pushState({ step: 2, doctor: 'dr-123' }, '', '/booking?step=2&doctor=dr-123');

// Listen for back button
window.addEventListener('popstate', (event) => {
  if (event.state) {
    // Restore state from URL/localStorage
    restoreStep(event.state.step);
  }
});

// Warn before leaving
window.addEventListener('beforeunload', (event) => {
  if (hasUnsavedProgress()) {
    event.preventDefault();
    event.returnValue = 'Yakin ingin meninggalkan halaman? Booking Anda belum selesai.';
  }
});
```

### Scenario 7: Session Expired

```
Problem: User takes too long, session expires (if implementing sessions)

Solution:
1. Set reasonable session timeout (30 minutes)
2. Warn user before expiration (5 min warning)
3. Allow session extension
4. Preserve booking data across sessions (localStorage)
5. Allow guest booking continuation

UI:
┌─────────────────────────────────────┐
│ ⏰ Sesi Akan Berakhir               │
│                                     │
│ Sesi Anda akan berakhir dalam      │
│ 5 menit. Perpanjang untuk melanjutkan? │
│                                     │
│ [Perpanjang Sesi] [Lanjutkan Nanti]│
└─────────────────────────────────────┘

On expiration:
// Save progress
saveBookingProgress();

// Show message
"Sesi berakhir. Data Anda tersimpan, lanjutkan kapan saja dalam 24 jam."

// On return:
"Lanjutkan booking sebelumnya?"
[Ya, Lanjutkan] [Mulai Baru]
```

### Scenario 8: Accessibility - Screen Reader User

```
Problem: Blind user navigating with screen reader

Solution:
1. Logical tab order
2. Clear ARIA labels
3. Announce dynamic changes
4. Keyboard-only navigation support
5. Clear instructions

Experience:
1. User hears: "Pilih Dokter Anda. Mulai dengan memilih dokter yang ingin Anda temui"
2. Tabs to first doctor card
3. Hears: "Tombol. Pilih Dr. Ahmad Suharto, Dokter Gigi, Rating 4.8 dari 5"
4. Presses Enter
5. Hears: "Loading. Memuat opsi pemesanan"
6. Page loads
7. Hears: "Pilih Jenis Pemesanan. Fast-Track atau Reservasi Biasa"
8. Tabs to radio cards, hears full descriptions
9. Selects with Space
10. Hears: "Fast-Track dipilih. Manfaat: Pilih jam pasti, prioritas dilayani, skip antrian, pembayaran online. Biaya Rp 50.000"

All form fields have clear labels, errors announced, success confirmed audibly.
```

---

This comprehensive interaction patterns documentation covers all major UX flows, error scenarios, accessibility considerations, and mobile-specific patterns for the patient booking interface. The next document will detail accessibility implementation and responsive design specifications.
