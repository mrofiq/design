# Patient Booking Flow - Wireframes & Component Specifications

---

## Flow Overview

```
1. Landing / Doctor Selection
   ↓
2. Booking Type Selection (Fast-Track vs Regular)
   ↓
3. Date Selection (Calendar)
   ↓
4. Time Slot Selection (Fast-Track only)
   ↓
5. Patient Information Form
   ↓
6. Payment Method Selection (Fast-Track only)
   ↓
7. Confirmation Screen
```

**Total Steps**: 5-7 screens depending on booking type
**Average Completion Time**: < 2 minutes (per PRD requirement)

---

## Screen 1: Landing / Doctor Selection

### Layout Structure (Mobile)

```
┌─────────────────────────────────────┐
│  [Logo]    JanjiTemu                │ ← Header (sticky)
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Pilih Dokter Anda                 │ ← H1, 28px
│  Mulai dengan memilih dokter yang  │ ← Body, 15px
│  ingin Anda temui                  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ [Search icon] Cari dokter... │ │ ← Search input (optional MVP)
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  [Avatar]  Dr. Ahmad Suharto  │ │ ← Doctor card
│  │            Dokter Gigi        │ │
│  │            ⭐ 4.8 (120 ulasan)│ │
│  │  [Chevron Right →]            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  [Avatar]  Dr. Siti Nurhaliza │ │
│  │            Dokter Umum        │ │
│  │            ⭐ 4.9 (85 ulasan) │ │
│  │  [Chevron Right →]            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  [Avatar]  Dr. Budi Santoso   │ │
│  │            Anak               │ │
│  │            ⭐ 4.7 (95 ulasan) │ │
│  │  [Chevron Right →]            │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Component Specifications

**Doctor Card**
```
Type:          Selectable card (clickable entire area)
Height:        Auto (min 88px)
Padding:       16px
Border Radius: 12px
Shadow:        shadow-sm
Border:        1px solid #F7F7F7

Layout:
  ├─ Avatar (left): 56px × 56px, border-radius 50%
  ├─ Content (center-left, flex-grow)
  │   ├─ Doctor Name: 18px Semibold, #1A1A1A
  │   ├─ Specialization: 14px Regular, #757575, margin-top 2px
  │   └─ Rating: 14px Regular, #4A4A4A, margin-top 4px
  │       ├─ Star icon: 16px, #F59E0B (warning color)
  │       └─ Text: "4.8 (120 ulasan)"
  └─ Icon (right): Chevron right, 20px, #757575

Hover/Focus State:
  Shadow:        shadow-md
  Transform:     translateX(4px)
  Border:        1px solid #008577

Active State:
  Background:    #E6F5F3
  Border:        1px solid #008577

Accessibility:
  - Role: button
  - Tab index: 0
  - Aria-label: "Pilih Dr. [Name], [Specialization]"
  - Keyboard: Enter/Space to select
```

**Search Input (Optional for MVP)**
```
Height:        48px
Padding:       12px 16px 12px 44px (left space for icon)
Icon:          Search icon, 20px, #757575, absolute left 12px
Placeholder:   "Cari dokter..."
Border:        1px solid #D1D1D1
Border Radius: 8px
Background:    #FFFFFF

Focus State:
  Border:      #008577
  Box-shadow:  focus-ring
```

**Page Header**
```
Height:        64px
Background:    #FFFFFF
Border-bottom: 1px solid #F7F7F7
Padding:       16px
Shadow:        shadow-sm (when scrolled)

Content:
  ├─ Logo/Brand: 32px height, left aligned
  └─ Title: "JanjiTemu", 18px Semibold (optional)

Sticky:        Position fixed, z-index 100
```

### Interaction Flow

1. User lands on page, sees list of available doctors
2. Optional: User types in search to filter doctors (future enhancement)
3. User taps/clicks doctor card
4. Card animates (subtle scale/translate), shows loading state briefly
5. Transitions to next screen (Booking Type Selection)

### Loading State
```
When card is clicked:
  - Disable all other cards (opacity 0.5)
  - Show spinner on clicked card (replace chevron)
  - Prevent double-tap
  - 300ms minimum before transition (perceived performance)
```

### Empty State
```
Icon:          Stethoscope icon, 64px, #D1D1D1
Heading:       "Tidak ada dokter tersedia"
Description:   "Saat ini tidak ada dokter yang dapat menerima pasien.
                Silakan hubungi klinik untuk informasi lebih lanjut."
CTA:           "Hubungi Klinik" button (secondary)
```

### Responsive Behavior

**Tablet (768px+)**
```
- Two-column grid for doctor cards
- Wider search input (max 400px)
- Increased card padding to 20px
```

**Desktop (1024px+)**
```
- Three-column grid for doctor cards
- Container max-width: 960px, centered
- Hover effects more prominent
```

---

## Screen 2: Booking Type Selection

### Layout Structure (Mobile)

```
┌─────────────────────────────────────┐
│  [← Back]  Pilih Jenis Booking      │ ← Header with back button
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │ ← Progress indicator
│  │  ●━━○━━○━━○  Step 1 dari 4   │ │
│  └───────────────────────────────┘ │
│                                     │
│  Dr. Ahmad Suharto                 │ ← Selected doctor (sticky info)
│  Dokter Gigi                       │
│                                     │
│  Pilih Jenis Pemesanan             │ ← H2, 24px
│  Pilih apakah Anda ingin antrian   │
│  cepat atau reservasi biasa        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ○ Fast-Track (Antrian Cepat) │ │ ← Radio card (not selected)
│  │                               │ │
│  │ ✓ Pilih jam pasti             │ │
│  │ ✓ Prioritas dilayani          │ │
│  │ ✓ Skip antrian                │ │
│  │ ✓ Pembayaran online           │ │
│  │                               │ │
│  │ Rp 50.000                     │ │ ← Price badge
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ● Reservasi Biasa             │ │ ← Radio card (selected)
│  │                               │ │
│  │ • Tidak perlu pilih jam       │ │
│  │ • Antri seperti walk-in       │ │
│  │ • Bayar di tempat             │ │
│  │ • Gratis                      │ │
│  │                               │ │
│  │ GRATIS                        │ │ ← Free badge
│  └───────────────────────────────┘ │
│                                     │
│  ⓘ Tip: Fast-track cocok untuk    │ ← Info callout
│  Anda yang tidak ingin menunggu    │
│  lama di klinik                    │
│                                     │
└─────────────────────────────────────┘
│  [Lanjutkan]                       │ ← Bottom CTA (fixed)
└─────────────────────────────────────┘
```

### Component Specifications

**Progress Indicator**
```
Type:          Stepper dots
Layout:        Horizontal, center aligned
Spacing:       16px between dots

Dot (Completed):
  Size:        12px diameter
  Color:       #008577
  Border:      none

Dot (Current):
  Size:        12px diameter
  Color:       #008577
  Border:      2px solid #008577
  Inner:       4px diameter white circle

Dot (Upcoming):
  Size:        12px diameter
  Color:       #D1D1D1
  Border:      none

Line (Between dots):
  Height:      2px
  Width:       32px
  Color:       #008577 (completed), #D1D1D1 (upcoming)

Text:
  Font:        13px Regular
  Color:       #757575
  Position:    Below dots, 8px gap
  Text:        "Step [current] dari [total]"
```

**Doctor Info Card (Sticky)**
```
Type:          Info display (non-interactive)
Background:    #E6F5F3
Padding:       12px 16px
Border Radius: 8px
Margin-bottom: 24px
Border-left:   4px solid #008577

Layout:
  ├─ Doctor Name: 16px Semibold, #1A1A1A
  └─ Specialization: 14px Regular, #4A4A4A

Position:      Sticky top 64px (below header)
```

**Radio Card**
```
Type:          Selectable card with radio button
Padding:       20px
Border Radius: 12px
Border:        2px solid transparent
Background:    #FFFFFF
Shadow:        shadow-sm
Min-height:    180px

Default State:
  Border:      2px solid #D1D1D1

Selected State:
  Border:      2px solid #008577
  Background:  #E6F5F3
  Shadow:      shadow-md

Layout:
  ├─ Header (flex row, space-between)
  │   ├─ Radio button (left): 24px, with label
  │   └─ Price badge (right): See badge spec
  ├─ Features list (margin-top 16px)
  │   └─ Each feature: 15px Regular, #4A4A4A
  │       ├─ Icon: Checkmark (✓) or bullet (•), 16px
  │       └─ Text: Aligned left, 8px gap from icon

Features List Styling:
  - Line height: 1.6
  - Spacing: 8px between items
  - Checkmark color: #008577 (fast-track)
  - Bullet color: #757575 (regular)

Accessibility:
  - Role: radio
  - Aria-checked: true/false
  - Tab index: 0 (current), -1 (others in group)
  - Keyboard: Arrow keys to navigate, Space to select
  - Label wraps entire card
```

**Price Badge**
```
Fast-Track Badge:
  Background:    #008577
  Text:          #FFFFFF
  Padding:       6px 12px
  Border Radius: 6px
  Font:          14px Semibold

Free Badge:
  Background:    #00A68F
  Text:          #FFFFFF
  Padding:       6px 12px
  Border Radius: 6px
  Font:          14px Semibold
```

**Info Callout**
```
Background:    #FEF3C7 (light yellow)
Border-left:   4px solid #F59E0B
Padding:       12px 16px
Border Radius: 8px
Margin-top:    24px

Layout:
  ├─ Icon (left): Info icon (ⓘ), 20px, #F59E0B
  └─ Text (right): 14px Regular, #4A4A4A
      Gap: 12px between icon and text
```

**Bottom CTA (Fixed)**
```
Position:      Fixed bottom
Background:    #FFFFFF
Border-top:    1px solid #F7F7F7
Padding:       16px
Shadow:        shadow-lg (upward)
Width:         100%
Z-index:       50

Button:
  Type:        Primary button
  Text:        "Lanjutkan"
  Width:       100%
  Height:      48px

  Disabled State (no selection):
    Background:  #D1D1D1
    Text:        #757575
    Cursor:      not-allowed
```

### Interaction Flow

1. User arrives from doctor selection, progress shows step 1 of 4-5
2. User sees both booking type options
3. Default: Nothing selected (CTA disabled) OR Regular selected (based on A/B test)
4. User taps a radio card
   - Card expands slightly (scale 1.02)
   - Border changes to primary green
   - Background changes to light green
   - Previous selection deselects with animation
   - CTA enables
5. User taps "Lanjutkan"
   - If Fast-Track: Goes to Date Selection
   - If Regular: Goes to Date Selection (but skips Time Selection later)

### Validation

- Require selection before enabling CTA
- No inline validation needed (radio is always valid once selected)

### Responsive Behavior

**Tablet/Desktop**
```
- Radio cards side by side (2 columns)
- Bottom CTA returns to inline (not fixed)
- Increased padding on cards (24px)
```

---

## Screen 3: Date Selection (Calendar)

### Layout Structure (Mobile)

```
┌─────────────────────────────────────┐
│  [← Back]  Pilih Tanggal            │
│                                     │
├─────────────────────────────────────┤
│  ●━━●━━○━━○  Step 2 dari 4         │
│                                     │
│  Dr. Ahmad Suharto • Fast-Track    │ ← Breadcrumb info
│                                     │
│  Pilih Tanggal                     │ ← H2
│  Klik tanggal yang Anda inginkan   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ [◀]  Oktober 2025    [▶]     │ │ ← Month navigator
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Min Sen Sel Rab Kam Jum Sab  │ │ ← Calendar grid
│  │                              │ │
│  │      1   2   3   4   5   6   │ │
│  │  7   8   9  [10] 11  12  13  │ │ ← 10 is today
│  │ 14  15  16  17  18  19  20  │ │
│  │ 21  22  23  24  25  26  27  │ │
│  │ 28  29  30  31               │ │
│  │                              │ │
│  └───────────────────────────────┘ │
│                                     │
│  Keterangan:                       │
│  • [Green] Tersedia                │
│  • [Gray] Tidak tersedia           │
│  • [Border] Hari ini               │
│  • [Disabled] Past dates           │
│                                     │
└─────────────────────────────────────┘
│  [Lanjutkan]  ← Disabled until     │
│                 date selected       │
└─────────────────────────────────────┘
```

### Component Specifications

**Breadcrumb Info**
```
Same as Doctor Info Card but with additional info:
  Layout:
    ├─ Doctor Name: 16px Semibold
    ├─ Separator: "•", 16px Regular, #757575
    └─ Booking Type: 16px Regular, #008577 (fast-track)
                                  #4A4A4A (regular)
```

**Month Navigator**
```
Type:          Header bar
Height:        56px
Background:    #FFFFFF
Border:        1px solid #D1D1D1
Border Radius: 8px
Padding:       12px 16px
Margin-bottom: 16px

Layout (flex row, space-between):
  ├─ Previous button: Chevron left icon
  ├─ Month/Year label: 18px Semibold, centered
  └─ Next button: Chevron right icon

Button Specs:
  Size:        32px × 32px (touch target 48px)
  Icon:        20px chevron
  Color:       #4A4A4A

  Hover:       Background #F7F7F7, border-radius 6px
  Active:      Background #E6F5F3
  Disabled:    Color #D1D1D1, cursor not-allowed

Accessibility:
  - Aria-label: "Bulan sebelumnya" / "Bulan berikutnya"
  - Disabled when reaching date limits (e.g., past dates)
```

**Calendar Grid**
```
Type:          Grid 7 columns (days of week)
Gap:           4px (mobile), 8px (tablet+)
Padding:       16px
Background:    #FFFFFF
Border:        1px solid #D1D1D1
Border Radius: 8px

Day Header:
  Font:        13px Semibold
  Color:       #757575
  Text-align:  center
  Padding:     8px 0
  Text:        "Min", "Sen", "Sel", etc. (abbreviated)

Day Cell:
  Size:        40px × 40px (mobile)
              48px × 48px (tablet+)
  Border-radius: 8px
  Font:        15px Regular
  Text-align:  center
  Cursor:      pointer

  Today (but not selected):
    Border:    2px solid #008577
    Color:     #008577
    Font:      Semibold

  Available Date:
    Color:     #1A1A1A
    Background: #FFFFFF

    Hover:
      Background: #E6F5F3
      Transform:  scale(1.1)

    Active:
      Background: #008577
      Color:      #FFFFFF

  Selected Date:
    Background: #008577
    Color:      #FFFFFF
    Font:       Semibold
    Shadow:     shadow-md

  Unavailable/Past Date:
    Color:      #D1D1D1
    Background: #F7F7F7
    Cursor:     not-allowed
    Text-decoration: line-through (past dates)

  Outside Current Month:
    Color:      #D1D1D1
    Font:       Regular
    Pointer-events: none

Accessibility:
  - Role: grid
  - Aria-label: "Kalender untuk memilih tanggal"
  - Each day: role="gridcell"
  - Keyboard: Arrow keys navigate, Enter/Space select
  - Aria-disabled: true (for unavailable dates)
  - Aria-selected: true (for selected date)
```

**Legend**
```
Type:          Horizontal list
Margin-top:    16px
Font:          13px Regular
Color:         #4A4A4A
Gap:           16px (between items)

Each Legend Item:
  ├─ Color indicator: 12px × 12px square/circle
  ├─ Label: Text, 8px gap from indicator

  Available:     Green square (#008577)
  Unavailable:   Gray square (#D1D1D1)
  Today:         Green bordered square
  Past:          Gray strikethrough
```

### Data Requirements

**API Request** (on screen load)
```javascript
GET /api/doctors/{doctorId}/availability
Query params:
  - month: "2025-10"
  - type: "fast-track" | "regular"

Response:
{
  doctorId: "123",
  doctorName: "Dr. Ahmad Suharto",
  month: "2025-10",
  availableDates: [
    "2025-10-15",
    "2025-10-16",
    "2025-10-18",
    "2025-10-20",
    ...
  ],
  unavailableDates: [
    "2025-10-17",  // Holiday
    "2025-10-19",  // Doctor leave
    ...
  ]
}
```

**Client-Side Logic**
```javascript
// Determine date state
const getDateState = (date) => {
  const isToday = isSameDay(date, new Date());
  const isPast = isBefore(date, startOfToday());
  const isAvailable = availableDates.includes(formatDate(date));
  const isSelected = selectedDate && isSameDay(date, selectedDate);

  if (isPast) return 'past';
  if (isSelected) return 'selected';
  if (isToday && isAvailable) return 'today-available';
  if (isToday && !isAvailable) return 'today-unavailable';
  if (isAvailable) return 'available';
  return 'unavailable';
}
```

### Interaction Flow

1. User lands on date selection screen
2. Calendar loads showing current month
3. API fetches available dates for selected doctor/booking type
4. Calendar renders with dates colored based on availability
5. User taps an available date
   - Date cell animates (scale + color change)
   - Previously selected date (if any) deselects
   - CTA button enables
   - Haptic feedback (mobile devices)
6. User can change month with arrows
   - Calendar smoothly transitions (fade + slide)
   - New month's availability fetched
   - Loading state shown (skeleton)
7. User taps "Lanjutkan"
   - If Fast-Track: Goes to Time Slot Selection
   - If Regular: Goes directly to Patient Information Form

### Loading State

```
When changing months:
  - Show skeleton calendar
  - Disable navigation buttons
  - Show spinner in month label
  - Duration: 300-500ms

Skeleton Pattern:
  - Date cells: Gray circles (#F7F7F7)
  - Shimmer animation
```

### Error Handling

```
If availability fetch fails:
  - Show error message in calendar area
  - "Gagal memuat ketersediaan. Silakan coba lagi."
  - Retry button (secondary)
  - Allow user to go back
```

### Validation

- User must select a date before proceeding
- Only allow selection of available dates
- Prevent selection of past dates

### Responsive Behavior

**Tablet/Desktop**
```
- Larger day cells (48px → 56px)
- Increased gaps (8px → 12px)
- Month navigator with full month names
- Calendar centered, max-width 480px
```

---

## Screen 4: Time Slot Selection (Fast-Track Only)

### Layout Structure (Mobile)

```
┌─────────────────────────────────────┐
│  [← Back]  Pilih Waktu              │
│                                     │
├─────────────────────────────────────┤
│  ●━━●━━●━━○  Step 3 dari 4         │
│                                     │
│  Dr. Ahmad • Fast-Track • 15 Okt   │
│                                     │
│  Pilih Waktu                       │
│  Pilih jam yang tersedia untuk     │
│  15 Oktober 2025                   │
│                                     │
│  Pagi (08:00 - 12:00)              │ ← Time section header
│                                     │
│  [08:00] [08:30] [09:00] [09:30]  │ ← Time slot chips
│  [10:00] [10:30] [11:00] [11:30]  │
│                                     │
│  Siang (12:00 - 15:00)             │
│                                     │
│  [12:00] [12:30] [13:00] [13:30]  │
│  [14:00] [14:30]                   │
│                                     │
│  Sore (15:00 - 18:00)              │
│                                     │
│  [15:00] [15:30] [16:00] [16:30]  │
│  [17:00] [17:30]                   │
│                                     │
│  ⓘ Durasi konsultasi: 30 menit     │ ← Info
│                                     │
└─────────────────────────────────────┘
│  [Lanjutkan]                       │
└─────────────────────────────────────┘
```

### Component Specifications

**Time Section Header**
```
Font:          16px Semibold
Color:         #1A1A1A
Margin-top:    24px (first section: 0)
Margin-bottom: 12px
Border-bottom: 1px solid #E6E6E6
Padding-bottom: 8px
```

**Time Slot Chip**
```
Type:          Button chip (selectable)
Height:        44px
Min-width:     72px
Padding:       10px 16px
Border-radius: 8px
Font:          15px Medium
Display:       inline-block
Margin:        4px (creates grid with gaps)

Available State:
  Background:  #FFFFFF
  Border:      2px solid #D1D1D1
  Color:       #1A1A1A

  Hover:
    Border:    2px solid #008577
    Background: #E6F5F3

Selected State:
  Background:  #008577
  Border:      2px solid #008577
  Color:       #FFFFFF
  Shadow:      shadow-sm
  Transform:   scale(1.05)

Unavailable/Full State:
  Background:  #F7F7F7
  Border:      2px solid #E6E6E6
  Color:       #D1D1D1
  Cursor:      not-allowed
  Position:    relative

  After (strike-through):
    Content:   ""
    Position:  absolute
    Border-bottom: 2px solid #D1D1D1
    Width:     100%
    Transform: rotate(-15deg)

Accessibility:
  - Role: radio (part of radio group per section)
  - Aria-label: "Jam {time}, {available/penuh}"
  - Aria-checked: true/false
  - Keyboard: Tab between sections, Arrow keys within section
  - Aria-disabled: true (for full slots)
```

**Time Slot Container**
```
Display:       flex
Flex-wrap:     wrap
Gap:           8px
Margin-bottom: 24px (between sections)
Justify-content: flex-start
```

**Duration Info**
```
Background:    #E6F5F3
Border-left:   4px solid #008577
Padding:       12px 16px
Border-radius: 8px
Font:          14px Regular
Color:         #4A4A4A
Margin-top:    24px

Icon:          Clock icon, 16px, #008577, inline before text
```

### Data Requirements

**API Request**
```javascript
GET /api/doctors/{doctorId}/timeslots
Query params:
  - date: "2025-10-15"
  - type: "fast-track"

Response:
{
  doctorId: "123",
  date: "2025-10-15",
  duration: 30,  // minutes
  timeSlots: [
    {
      time: "08:00",
      available: true,
      section: "morning"  // morning, afternoon, evening
    },
    {
      time: "08:30",
      available: true,
      section: "morning"
    },
    {
      time: "09:00",
      available: false,  // already booked
      section: "morning"
    },
    ...
  ]
}
```

**Client-Side Grouping**
```javascript
const sections = {
  morning: {
    label: "Pagi",
    range: "08:00 - 12:00",
    slots: []
  },
  afternoon: {
    label: "Siang",
    range: "12:00 - 15:00",
    slots: []
  },
  evening: {
    label: "Sore",
    range: "15:00 - 18:00",
    slots: []
  }
}

// Group slots by section
timeSlots.forEach(slot => {
  sections[slot.section].slots.push(slot);
});

// Only render sections that have slots
Object.entries(sections).forEach(([key, section]) => {
  if (section.slots.length > 0) {
    renderSection(section);
  }
});
```

### Interaction Flow

1. User arrives from date selection
2. API fetches available time slots for selected date
3. Time slots render grouped by time of day
4. User taps an available slot
   - Chip changes to selected state
   - Previous selection deselects
   - CTA enables
   - Haptic feedback
5. User can change selection freely
6. User taps "Lanjutkan"
   - Goes to Patient Information Form

### Loading State

```
While fetching time slots:
  - Show skeleton chips in grid
  - 12 skeleton chips (placeholder)
  - Shimmer animation
  - Section headers visible
  - Navigation disabled
```

### Error Handling

```
If no slots available:
  Empty State:
    Icon:       Calendar X icon, 64px, #D1D1D1
    Heading:    "Tidak ada slot tersedia"
    Message:    "Semua waktu pada tanggal ini sudah penuh.
                 Silakan pilih tanggal lain."
    CTA:        "Pilih Tanggal Lain" (goes back to calendar)

If fetch fails:
  Error State:
    Icon:       Alert icon, 48px, #EF4444
    Heading:    "Gagal memuat waktu tersedia"
    Message:    "Silakan coba lagi atau pilih tanggal lain."
    CTA:        "Coba Lagi" (retry fetch)
                "Kembali" (go back to calendar)
```

### Validation

- User must select a time slot before proceeding
- Only allow selection of available slots
- Prevent double-booking (real-time validation)

### Real-Time Availability (Advanced)

```javascript
// WebSocket or polling for real-time updates
// If another user books a slot while user is viewing:

onSlotBooked(slotTime) {
  // Update slot to unavailable
  // Animate slot fading to gray
  // Show toast: "Slot {time} baru saja terisi"

  // If it was selected slot:
  if (selectedSlot === slotTime) {
    selectedSlot = null;
    disableCTA();
    showToast("Slot yang Anda pilih baru saja terisi. Silakan pilih slot lain.", "warning");
  }
}
```

### Responsive Behavior

**Tablet**
```
- 6 chips per row (instead of 4)
- Larger chips (80px min-width)
```

**Desktop**
```
- 8 chips per row
- Two-column layout: Calendar on left (sticky), time slots on right
- Increased chip size
```

---

## Screen 5: Patient Information Form

### Layout Structure (Mobile)

```
┌─────────────────────────────────────┐
│  [← Back]  Informasi Pasien         │
│                                     │
├─────────────────────────────────────┤
│  ●━━●━━●━━●  Step 4 dari 4         │
│                                     │
│  Dr. Ahmad • Fast • 15 Okt • 09:00 │
│                                     │
│  Informasi Pasien                  │
│  Isi data diri Anda untuk          │
│  konfirmasi janji temu             │
│                                     │
│  Nama Lengkap *                    │ ← Form fields
│  ┌───────────────────────────────┐ │
│  │ [Masukkan nama lengkap]       │ │
│  └───────────────────────────────┘ │
│                                     │
│  Nomor WhatsApp *                  │
│  ┌───────────────────────────────┐ │
│  │ [+62] [81234567890]           │ │
│  └───────────────────────────────┘ │
│  💬 Kami akan kirim konfirmasi     │
│     via WhatsApp                   │
│                                     │
│  Email (Opsional)                  │
│  ┌───────────────────────────────┐ │
│  │ [nama@email.com]              │ │
│  └───────────────────────────────┘ │
│                                     │
│  Keluhan / Catatan (Opsional)      │
│  ┌───────────────────────────────┐ │
│  │ [Ceritakan keluhan Anda...]   │ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ☑ Saya setuju menerima      │   │ ← Consent checkbox
│  │   notifikasi WhatsApp        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⓘ Data Anda aman dan hanya        │
│     digunakan untuk janji temu     │
│                                     │
└─────────────────────────────────────┘
│  [Lanjutkan]                       │
└─────────────────────────────────────┘
```

### Component Specifications

**Form Field (Text Input)**
```
Label:
  Font:        14px Medium
  Color:       #4A4A4A
  Margin-bottom: 8px
  Required indicator: Red asterisk (*), #EF4444

Input:
  Height:      48px
  Padding:     12px 16px
  Border:      1px solid #D1D1D1
  Border-radius: 8px
  Font:        15px Regular
  Background:  #FFFFFF

  Placeholder:
    Color:     #757575
    Font-style: normal

  Focus:
    Border:    1px solid #008577
    Box-shadow: focus-ring
    Outline:   none

  Error:
    Border:    1px solid #EF4444
    Box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)

  Disabled:
    Background: #F7F7F7
    Color:     #757575
    Cursor:    not-allowed

Helper Text (below input):
  Font:        13px Regular
  Color:       #757575
  Margin-top:  4px
  Line-height: 1.4

Error Message:
  Font:        13px Regular
  Color:       #EF4444
  Margin-top:  4px
  Icon:        Alert circle, 14px, inline

Success State:
  Border:      1px solid #00A68F
  Icon (right): Checkmark, 20px, #00A68F
```

**Phone Input (Special)**
```
Layout:        Two-part input (prefix + number)

Prefix Input:
  Width:       72px
  Padding:     12px 8px
  Border:      1px solid #D1D1D1
  Border-right: none
  Border-radius: 8px 0 0 8px
  Font:        15px Regular
  Background:  #F7F7F7
  Text-align:  center
  Value:       "+62" (fixed or dropdown)
  Disabled:    true (for MVP, Indonesia only)

Number Input:
  Flex:        1 (grows to fill)
  Padding:     12px 16px
  Border:      1px solid #D1D1D1
  Border-left: none
  Border-radius: 0 8px 8px 0
  Font:        15px Regular
  Type:        tel
  Pattern:     [0-9]*
  Inputmode:   numeric
  Placeholder: "81234567890"

Combined Focus:
  Both inputs: Border-color #008577
  Box-shadow:  focus-ring on container

Validation:
  - Minimum 10 digits
  - Maximum 13 digits
  - Numbers only
  - Must start with 8 (after +62)
```

**Textarea (Notes)**
```
Min-height:    96px (4 lines)
Max-height:    240px (10 lines)
Resize:        vertical
Padding:       12px 16px
Border:        1px solid #D1D1D1
Border-radius: 8px
Font:          15px Regular
Line-height:   1.5

Focus/Error/Disabled: Same as text input

Character Counter (optional):
  Position:    Bottom right
  Font:        12px Regular
  Color:       #757575
  Format:      "{current} / {max}"
```

**Consent Checkbox**
```
Container:
  Background:  #F7F7F7
  Padding:     16px
  Border:      1px solid #E6E6E6
  Border-radius: 8px
  Margin-top:  24px

Layout:
  Display:     flex
  Align-items: flex-start
  Gap:         12px

Checkbox:
  Size:        24px × 24px
  Flex-shrink: 0
  Margin-top:  2px (align with first line of text)

Label:
  Font:        14px Regular
  Color:       #4A4A4A
  Line-height: 1.5
  Flex:        1

Link (in label):
  Color:       #008577
  Text-decoration: underline

  Hover:
    Color:     #00A68F

Validation:
  Required:    true (for WhatsApp consent)
  Error:       Red border around container
  Error text:  Below container
```

**Privacy Notice**
```
Background:    #E6F5F3
Border-left:   4px solid #008577
Padding:       12px 16px
Border-radius: 8px
Font:          13px Regular
Color:         #4A4A4A
Margin-top:    16px

Icon:          Shield icon, 16px, #008577, inline
```

### Form Validation Rules

**Nama Lengkap**
```
Required:      true
Min length:    3 characters
Max length:    100 characters
Pattern:       Letters, spaces, hyphens, apostrophes
Error messages:
  - empty:     "Nama lengkap wajib diisi"
  - too short: "Nama terlalu pendek (minimal 3 karakter)"
  - invalid:   "Nama hanya boleh berisi huruf"
```

**Nomor WhatsApp**
```
Required:      true
Min length:    10 digits (after +62)
Max length:    13 digits
Pattern:       ^8[0-9]{9,12}$
Error messages:
  - empty:     "Nomor WhatsApp wajib diisi"
  - invalid:   "Nomor WhatsApp tidak valid (contoh: 81234567890)"
  - too short: "Nomor terlalu pendek"
  - too long:  "Nomor terlalu panjang"
```

**Email**
```
Required:      false
Pattern:       RFC 5322 email format
Error messages:
  - invalid:   "Format email tidak valid"
```

**Keluhan / Catatan**
```
Required:      false
Max length:    500 characters
```

**Consent Checkbox**
```
Required:      true (untuk WhatsApp)
Error messages:
  - unchecked: "Anda harus menyetujui notifikasi WhatsApp"
```

### Validation Behavior

**Inline Validation (On Blur)**
```javascript
onBlur(field) {
  // Validate field
  const error = validateField(field);

  if (error) {
    // Show error state
    showFieldError(field, error);
  } else {
    // Show success state (checkmark)
    showFieldSuccess(field);
  }
}
```

**Form-Level Validation (On Submit)**
```javascript
onSubmit(e) {
  e.preventDefault();

  // Validate all fields
  const errors = validateForm();

  if (errors.length > 0) {
    // Show all errors
    showErrors(errors);

    // Scroll to first error
    scrollToFirstError();

    // Disable submit button
    disableSubmit();

    // Focus first error field
    focusField(errors[0].field);

    return;
  }

  // All valid, proceed
  proceedToNextStep();
}
```

**Real-Time Validation (On Input)**
```javascript
// Only for specific fields (e.g., phone number)
onInput(field) {
  // Remove error state as user types
  if (hasError(field)) {
    clearError(field);
  }

  // For phone number: format as user types
  if (field === 'phone') {
    formatPhoneNumber();
  }
}
```

### Interaction Flow

1. User arrives from time selection (or date selection for regular booking)
2. Form fields are empty, CTA disabled
3. User fills in required fields
   - Each field validates on blur
   - Shows success checkmark when valid
   - Shows error message when invalid
4. User checks consent checkbox
5. CTA enables when all required fields valid and consent checked
6. User taps "Lanjutkan"
   - Final validation
   - If errors: Show errors, scroll to first, focus field
   - If valid:
     * For Fast-Track: Goes to Payment Method Selection
     * For Regular: Creates booking, shows Confirmation

### Loading State (On Submit)

```
When submitting:
  - Disable all form fields
  - Disable CTA button
  - Show spinner in CTA button
  - Button text: "Memproses..."
  - Prevent form interaction
```

### Error Handling

```
If booking creation fails (Regular):
  - Re-enable form
  - Show toast error: "Gagal membuat booking. Silakan coba lagi."
  - Allow user to retry
  - Keep form data intact
```

### Accessibility

- All form fields have associated labels
- Required fields marked with asterisk and aria-required
- Error messages linked to fields with aria-describedby
- Form has aria-label: "Formulir informasi pasien"
- Submit button disabled until form valid
- Clear focus indicators on all fields
- Error summary at top of form (if multiple errors)

### Responsive Behavior

**Tablet/Desktop**
```
- Two-column layout for name and phone
- Wider form fields
- Inline error messages (right side)
```

---

## Screen 6: Payment Method Selection (Fast-Track Only)

### Layout Structure (Mobile)

```
┌─────────────────────────────────────┐
│  [← Back]  Pembayaran               │
│                                     │
├─────────────────────────────────────┤
│  ●━━●━━●━━●━━●  Step 5 dari 5      │
│                                     │
│  Ringkasan Booking                 │ ← Summary card
│  ┌───────────────────────────────┐ │
│  │ Dr. Ahmad Suharto             │ │
│  │ Dokter Gigi                   │ │
│  │                               │ │
│  │ 📅 15 Oktober 2025            │ │
│  │ ⏰ 09:00 - 09:30 WIB          │ │
│  │                               │ │
│  │ 👤 Budi Santoso               │ │
│  │ 📱 +62 812-3456-7890          │ │
│  │                               │ │
│  │ ─────────────────────────     │ │
│  │ Fast-Track Fee:  Rp  50.000  │ │
│  │ Total:           Rp  50.000  │ │
│  └───────────────────────────────┘ │
│                                     │
│  Pilih Metode Pembayaran           │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ○ QRIS                        │ │ ← Payment method cards
│  │   [QRIS Logo]                 │ │
│  │   Scan dengan e-wallet        │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ○ Transfer Bank               │ │
│  │   [Bank Logo]                 │ │
│  │   Virtual Account             │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ○ Kartu Kredit/Debit          │ │
│  │   [Card Logo]                 │ │
│  │   Visa, Mastercard, JCB       │ │
│  └───────────────────────────────┘ │
│                                     │
│  🔒 Pembayaran aman & terenkripsi  │
│                                     │
└─────────────────────────────────────┘
│  [Bayar Rp 50.000]                 │
└─────────────────────────────────────┘
```

### Component Specifications

**Summary Card**
```
Type:          Info card (non-interactive)
Background:    #E6F5F3
Border:        1px solid #D1F0EB
Border-radius: 12px
Padding:       20px
Margin-bottom: 24px
Border-left:   4px solid #008577

Layout:
  ├─ Doctor Section
  │   ├─ Name: 18px Semibold, #1A1A1A
  │   └─ Specialization: 14px Regular, #4A4A4A, margin-top 2px
  ├─ Divider: 1px solid #D1F0EB, margin 12px vertical
  ├─ Details Section (each row)
  │   ├─ Icon: 16px, #757575
  │   ├─ Text: 15px Regular, #4A4A4A
  │   └─ Spacing: 8px between rows
  ├─ Divider (thicker): 2px solid #D1F0EB, margin 16px vertical
  └─ Price Section
      ├─ Fee row: 15px Regular, #4A4A4A
      └─ Total row: 18px Semibold, #1A1A1A, margin-top 8px

Price Alignment:
  - Labels: Left aligned
  - Amounts: Right aligned (flex row, space-between)
```

**Payment Method Card**
```
Type:          Selectable card with radio button
Height:        Auto (min 88px)
Padding:       16px
Border-radius: 12px
Border:        2px solid transparent
Background:    #FFFFFF
Shadow:        shadow-sm
Margin-bottom: 12px

Default State:
  Border:      2px solid #D1D1D1

Selected State:
  Border:      2px solid #008577
  Background:  #E6F5F3
  Shadow:      shadow-md

Layout (flex row, space-between, align-center):
  ├─ Left Section (flex column)
  │   ├─ Radio + Label (flex row, align-center)
  │   │   ├─ Radio: 24px
  │   │   └─ Label: 16px Semibold, #1A1A1A, 12px gap
  │   └─ Description: 14px Regular, #757575, margin-top 4px
  └─ Right Section (flex column, align-end)
      └─ Payment logo: Max height 32px, grayscale (unless selected)

Selected State (logo):
  Filter:      none (full color)

Accessibility:
  - Role: radio
  - Aria-checked: true/false
  - Tab index: 0 (current), -1 (others)
  - Keyboard: Arrow keys navigate, Space select
  - Label wraps entire card
```

**Security Notice**
```
Background:    #F7F7F7
Border:        1px solid #E6E6E6
Padding:       12px 16px
Border-radius: 8px
Font:          13px Regular
Color:         #4A4A4A
Text-align:    center
Margin-top:    24px

Icon:          Lock icon, 16px, #757575, inline before text
```

**Payment CTA Button**
```
Same as primary button, but:
  Text:        "Bayar {currency formatted amount}"
  Font:        16px Semibold
  Icon (optional): Lock icon before text

  Disabled:    When no payment method selected
```

### Payment Flow Variations

**QRIS Flow**
```
1. User selects QRIS
2. User taps "Bayar Rp 50.000"
3. Loading state (spinner)
4. API creates payment intent
5. Shows QRIS modal:
   ┌─────────────────────────────────┐
   │  [X Close]                      │
   │                                 │
   │  Scan QR Code                  │
   │                                 │
   │  ┌─────────────────┐           │
   │  │                 │           │
   │  │   [QR CODE]     │           │
   │  │                 │           │
   │  └─────────────────┘           │
   │                                 │
   │  Total: Rp 50.000              │
   │                                 │
   │  Scan dengan aplikasi:         │
   │  [GoPay] [OVO] [DANA] [etc]   │
   │                                 │
   │  ⏱ Selesaikan dalam 10:00      │ ← Countdown timer
   │                                 │
   │  Menunggu pembayaran...        │ ← Status
   │  [Spinner]                     │
   │                                 │
   │  [Saya Sudah Bayar]            │ ← Optional manual check
   │                                 │
   └─────────────────────────────────┘

6. Polling for payment status (every 3 seconds)
7. On success: Auto-close modal, go to confirmation
8. On timeout (10 min): Show error, allow retry
```

**Transfer Bank Flow**
```
1. User selects Transfer Bank
2. User taps "Bayar Rp 50.000"
3. Loading state
4. API creates Virtual Account
5. Shows VA modal:
   ┌─────────────────────────────────┐
   │  [X Close]                      │
   │                                 │
   │  Transfer ke Virtual Account   │
   │                                 │
   │  Bank BCA                      │
   │  ┌─────────────────────────┐   │
   │  │ 8012345678901234        │   │ ← VA number (copyable)
   │  │ [Copy Icon]             │   │
   │  └─────────────────────────┘   │
   │  ✓ Nomor berhasil disalin      │
   │                                 │
   │  Jumlah Transfer               │
   │  ┌─────────────────────────┐   │
   │  │ Rp 50.000               │   │ ← Amount (copyable)
   │  │ [Copy Icon]             │   │
   │  └─────────────────────────┘   │
   │                                 │
   │  Instruksi:                    │
   │  1. Buka m-banking Anda        │
   │  2. Pilih Transfer             │
   │  3. Masukkan nomor VA di atas  │
   │  4. Pastikan jumlah Rp 50.000  │
   │  5. Konfirmasi transfer        │
   │                                 │
   │  ⏱ Selesaikan dalam 60:00      │
   │                                 │
   │  [Saya Sudah Transfer]         │
   │                                 │
   └─────────────────────────────────┘

6. Polling for payment status
7. On success: Go to confirmation
8. On timeout: Show error, extend time or retry
```

**Kartu Kredit/Debit Flow**
```
1. User selects Kartu Kredit/Debit
2. User taps "Bayar Rp 50.000"
3. Loading state
4. Redirect to payment gateway (Midtrans Snap)
5. User completes payment on gateway
6. Redirect back to app
7. Show confirmation or error based on result
```

### Modal Specifications

**Payment Modal**
```
Type:          Full-screen modal (mobile) / centered modal (desktop)
Background:    #FFFFFF
Border-radius: 16px (desktop) / 0 (mobile)
Padding:       24px
Max-width:     480px (desktop)
Z-index:       1000

Overlay:
  Background:  rgba(0, 0, 0, 0.5)
  Backdrop-filter: blur(4px)

Close Button:
  Position:    Top right
  Size:        40px × 40px (touch target)
  Icon:        X icon, 24px
  Color:       #757575

  Hover:
    Background: #F7F7F7
    Border-radius: 6px

QR Code:
  Size:        280px × 280px (mobile)
              320px × 320px (desktop)
  Margin:      24px auto
  Border:      4px solid #008577
  Border-radius: 12px
  Padding:     16px
  Background:  #FFFFFF

Countdown Timer:
  Font:        16px Semibold
  Color:       #F59E0B (warning when < 2 min)
              #EF4444 (error when < 1 min)
  Format:      "MM:SS"
  Position:    Below QR code / VA info

Status Text:
  Font:        15px Regular
  Color:       #757575 (waiting)
              #00A68F (success)
              #EF4444 (error)
  Margin:      16px vertical

Spinner (waiting):
  Size:        32px
  Color:       #008577
  Position:    Below status text
```

**Copyable Field**
```
Layout:        Flex row, space-between
Background:    #F7F7F7
Border:        1px solid #D1D1D1
Border-radius: 8px
Padding:       12px 16px
Margin:        8px 0

Text:
  Font:        16px Monospace (for numbers)
  Color:       #1A1A1A
  Flex:        1

Copy Button:
  Type:        Icon button
  Size:        32px × 32px
  Icon:        Copy icon, 20px, #757575

  Hover:
    Background: #E6E6E6
    Border-radius: 4px

  After Copy (success):
    Icon:      Checkmark, #00A68F
    Animation: Scale pulse

Success Message:
  Font:        13px Regular
  Color:       #00A68F
  Position:    Below field
  Icon:        Checkmark, 14px
  Animation:   Fade in
```

**Instruction List**
```
Ordered list:
  Margin:      16px 0
  Padding-left: 24px

List item:
  Font:        14px Regular
  Color:       #4A4A4A
  Line-height: 1.6
  Margin:      8px 0

  Number:
    Font:      14px Semibold
    Color:     #008577
```

### Data Requirements

**API Request (Create Payment)**
```javascript
POST /api/bookings
Body:
{
  doctorId: "123",
  date: "2025-10-15",
  time: "09:00",
  type: "fast-track",
  patient: {
    name: "Budi Santoso",
    phone: "+6281234567890",
    email: "budi@email.com",
    notes: "Sakit gigi"
  },
  payment: {
    method: "qris", // "bank_transfer", "credit_card"
    amount: 50000,
    currency: "IDR"
  }
}

Response:
{
  bookingId: "BKG-20251015-001",
  status: "pending_payment",
  payment: {
    method: "qris",
    status: "pending",
    amount: 50000,
    qrCode: "data:image/png;base64,...",  // For QRIS
    vaNumber: "8012345678901234",         // For Bank Transfer
    bank: "BCA",                           // For Bank Transfer
    redirectUrl: "https://payment.com/...", // For Credit Card
    expiresAt: "2025-10-15T10:00:00Z"
  }
}
```

**Polling Payment Status**
```javascript
GET /api/bookings/{bookingId}/payment-status

Response:
{
  bookingId: "BKG-20251015-001",
  paymentStatus: "pending" | "success" | "failed" | "expired",
  paidAt: "2025-10-15T09:05:32Z" // if success
}

// Poll every 3 seconds while status is "pending"
// Stop polling when status changes or timeout reaches
```

### Interaction Flow

1. User arrives from patient info form
2. Summary shows all booking details
3. User selects payment method (radio card)
4. CTA enables
5. User taps "Bayar Rp 50.000"
6. Loading spinner in CTA
7. API creates payment intent
8. Based on method:
   - QRIS: Show QR code modal, poll status
   - Bank: Show VA modal, poll status
   - Card: Redirect to gateway, wait for callback
9. On payment success:
   - Close modal (if any)
   - Show success animation
   - Go to confirmation screen
10. On payment failure:
    - Show error in modal
    - Allow retry or choose different method

### Error Handling

```
Payment Creation Failed:
  - Show toast error
  - "Gagal membuat pembayaran. Silakan coba lagi."
  - Re-enable payment methods
  - Allow user to retry

Payment Timeout:
  - Close modal
  - Show timeout message
  - "Waktu pembayaran habis. Silakan coba lagi."
  - Option to retry same method or choose different

Payment Failed (rejected):
  - Show error in modal
  - "Pembayaran gagal. Silakan periksa saldo atau coba metode lain."
  - Button: "Coba Lagi" or "Pilih Metode Lain"

Network Error During Polling:
  - Continue retrying (exponential backoff)
  - Show message: "Memeriksa status pembayaran..."
  - Don't interrupt user
```

### Validation

- User must select payment method before CTA enables
- Prevent double-tap on payment button
- Lock payment method selection after payment initiated
- Handle race conditions (payment completed while user navigating away)

### Accessibility

- Modal traps focus (can't tab outside)
- Escape key closes modal (with confirmation if payment pending)
- Screen reader announces payment status changes
- All interactive elements keyboard accessible
- Clear labels for all payment options

### Responsive Behavior

**Desktop**
```
- Modal centered, max-width 480px
- Larger QR code (320px)
- Two-column summary (left: details, right: price)
```

---

## Screen 7: Confirmation Screen

### Layout Structure (Mobile)

```
┌─────────────────────────────────────┐
│  [Close]                            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │     [Success Checkmark]       │ │ ← Animated icon
│  │                               │ │
│  └───────────────────────────────┘ │
│                                     │
│  Booking Berhasil!                 │ ← H1, center
│                                     │
│  Janji temu Anda telah dikonfirmasi│
│  Kami telah mengirim detail ke     │
│  WhatsApp Anda                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Nomor Booking                 │ │ ← Booking card
│  │ BKG-20251015-001              │ │
│  │ [Copy]                        │ │
│  │                               │ │
│  │ ─────────────────────────     │ │
│  │                               │ │
│  │ Dr. Ahmad Suharto             │ │
│  │ Dokter Gigi                   │ │
│  │                               │ │
│  │ 📅 Selasa, 15 Oktober 2025    │ │
│  │ ⏰ 09:00 - 09:30 WIB          │ │
│  │ 📍 Klinik Sehat Sejahtera     │ │
│  │    Jl. Sudirman No. 123       │ │
│  │                               │ │
│  │ 👤 Budi Santoso               │ │
│  │ 📱 +62 812-3456-7890          │ │
│  │                               │ │
│  │ ─────────────────────────     │ │
│  │                               │ │
│  │ Status: ✓ Terbayar            │ │
│  │ Metode: QRIS                  │ │
│  │ Total: Rp 50.000              │ │
│  └───────────────────────────────┘ │
│                                     │
│  Langkah Selanjutnya:              │
│  ✓ Simpan nomor booking Anda       │
│  ✓ Cek WhatsApp untuk konfirmasi   │
│  ✓ Datang 10 menit sebelum jadwal  │
│  ✓ Tunjukkan nomor booking saat    │
│    check-in                        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ [WhatsApp Icon] Buka WhatsApp │ │ ← Action buttons
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ [Calendar Icon] Tambah ke     │ │
│  │ Kalender                      │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ [Map Icon] Lihat Lokasi       │ │
│  │ Klinik                        │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Buat Booking Lain]               │ ← Secondary CTA
│                                     │
└─────────────────────────────────────┘
```

### Component Specifications

**Success Animation**
```
Container:
  Size:        120px × 120px
  Margin:      32px auto 24px
  Position:    relative

Checkmark Icon:
  Size:        80px
  Color:       #00A68F
  Background:  #E6F5F3 (circle)
  Padding:     20px
  Border-radius: 50%

Animation Sequence:
  1. Circle scales in (0.5 → 1, 300ms, ease-out)
  2. Checkmark draws (stroke-dashoffset, 400ms, ease-in-out)
  3. Subtle bounce (scale 1 → 1.1 → 1, 200ms)
  4. Glow pulse (box-shadow, 800ms, ease-in-out, 2 iterations)

Confetti (optional):
  - Brief confetti burst from center
  - 8-12 particles
  - Primary green + accent colors
  - Duration: 1s, then fade out
```

**Success Heading**
```
Font:          28px Bold
Color:         #1A1A1A
Text-align:    center
Margin:        16px 0

Subtext:
  Font:        15px Regular
  Color:       #757575
  Text-align:  center
  Line-height: 1.6
  Margin:      8px 0
```

**Booking Card (Detailed)**
```
Background:    #FFFFFF
Border:        2px solid #00A68F
Border-radius: 16px
Padding:       24px
Shadow:        shadow-lg
Margin:        24px 0

Booking Number Section:
  Background:  #E6F5F3
  Border:      1px dashed #00A68F
  Border-radius: 8px
  Padding:     12px 16px
  Margin-bottom: 16px

  Layout (flex row, space-between):
    ├─ Left: "Nomor Booking", 13px Regular, #757575
    └─ Right: Copy button icon

  Number:
    Font:      20px Bold, Monospace
    Color:     #008577
    Margin-top: 4px
    Letter-spacing: 1px

  Copy Button:
    Size:      32px × 32px
    Icon:      Copy, 20px

    Success (after copy):
      Icon:    Checkmark, #00A68F
      Tooltip: "Tersalin!"

Divider:
  Height:      1px
  Background:  #E6E6E6
  Margin:      16px 0

Details Sections:
  Each row:
    Display:   flex
    Gap:       12px
    Margin:    12px 0

    Icon:      20px, #757575
    Text:      15px Regular, #4A4A4A

  Doctor Name:
    Font:      18px Semibold, #1A1A1A

  Specialization:
    Font:      14px Regular, #757575
    Margin-top: 2px

Status Row (bottom):
  Background:  #E6F5F3
  Border-radius: 8px
  Padding:     12px 16px
  Margin-top:  16px

  Status Paid:
    Icon:      Checkmark circle, 20px, #00A68F
    Text:      "Terbayar", 15px Semibold, #00A68F

  Status Pending (Regular booking):
    Icon:      Clock, 20px, #F59E0B
    Text:      "Menunggu Konfirmasi", 15px Semibold, #F59E0B

  Method & Amount:
    Font:      14px Regular, #4A4A4A
    Margin-top: 4px
```

**Next Steps Section**
```
Margin:        24px 0
Padding:       20px
Background:    #F7F7F7
Border-radius: 12px
Border-left:   4px solid #008577

Heading:
  Font:        16px Semibold
  Color:       #1A1A1A
  Margin-bottom: 12px

List Items:
  Display:     flex
  Gap:         12px
  Margin:      8px 0

  Icon:        Checkmark, 16px, #00A68F
  Text:        14px Regular, #4A4A4A
  Line-height: 1.6
```

**Action Buttons**
```
Type:          Secondary button (outlined)
Height:        48px
Width:         100%
Padding:       12px 16px
Border:        2px solid #008577
Border-radius: 8px
Background:    #FFFFFF
Margin-bottom: 12px

Layout (flex row, center, gap 12px):
  ├─ Icon: 24px, #008577
  └─ Text: 15px Medium, #008577

Hover:
  Background:  #E6F5F3

Specific Icons:
  - WhatsApp: WhatsApp logo icon
  - Calendar: Calendar plus icon
  - Map: Map pin icon
```

**New Booking CTA**
```
Type:          Ghost button
Height:        48px
Width:         100%
Padding:       12px 16px
Background:    transparent
Color:         #008577
Font:          15px Medium
Margin-top:    24px

Hover:
  Background:  #E6F5F3
```

### Data Requirements

**Confirmation Data (From Previous Screens)**
```javascript
{
  bookingId: "BKG-20251015-001",
  bookingNumber: "BKG-20251015-001",  // User-facing ID
  status: "confirmed" | "pending",

  doctor: {
    id: "123",
    name: "Dr. Ahmad Suharto",
    specialization: "Dokter Gigi",
    photo: "https://..."
  },

  clinic: {
    name: "Klinik Sehat Sejahtera",
    address: "Jl. Sudirman No. 123, Jakarta",
    phone: "+62211234567",
    coordinates: {
      lat: -6.2088,
      lng: 106.8456
    }
  },

  appointment: {
    date: "2025-10-15",
    time: "09:00",
    endTime: "09:30",
    type: "fast-track" | "regular"
  },

  patient: {
    name: "Budi Santoso",
    phone: "+6281234567890",
    email: "budi@email.com"
  },

  payment: {
    status: "paid" | "pending",
    method: "qris" | "bank_transfer" | "credit_card" | null,
    amount: 50000,
    currency: "IDR",
    paidAt: "2025-10-15T09:05:32Z"
  },

  createdAt: "2025-10-15T09:00:00Z"
}
```

### Interaction Flow

1. User arrives after successful payment (or booking creation for regular)
2. Success animation plays
3. All booking details displayed
4. User can:
   - Copy booking number
   - Open WhatsApp (deep link to app)
   - Add to calendar (download .ics file)
   - View location (Google Maps link)
   - Create new booking (restart flow)
   - Close (returns to home/landing)

### Action Button Behaviors

**Buka WhatsApp**
```javascript
onClick() {
  // Deep link to WhatsApp
  // Opens WhatsApp app if installed, web if not
  const phoneNumber = clinic.phone.replace('+', '');
  const message = `Halo, saya baru booking janji temu dengan nomor ${bookingNumber}`;
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
}
```

**Tambah ke Kalender**
```javascript
onClick() {
  // Generate ICS file
  const ics = generateICS({
    title: `Janji Temu - ${doctor.name}`,
    description: `Booking number: ${bookingNumber}\nKlinik: ${clinic.name}`,
    location: clinic.address,
    startTime: appointment.datetime,
    endTime: appointment.endTime,
    reminder: 60  // 1 hour before
  });

  // Download file
  downloadFile(ics, `booking-${bookingNumber}.ics`);
}
```

**Lihat Lokasi Klinik**
```javascript
onClick() {
  // Open Google Maps
  const { lat, lng } = clinic.coordinates;
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  window.open(url, '_blank');
}
```

**Buat Booking Lain**
```javascript
onClick() {
  // Confirm first
  if (confirm('Yakin ingin membuat booking baru?')) {
    // Reset flow
    resetBookingFlow();

    // Navigate to landing
    navigateTo('/');
  }
}
```

### Confirmation Notifications

**WhatsApp Message (Sent Automatically)**
```
Halo Budi Santoso,

Booking Anda berhasil dikonfirmasi! 🎉

📋 Nomor Booking: BKG-20251015-001

👨‍⚕️ Dokter: Dr. Ahmad Suharto (Dokter Gigi)
📅 Tanggal: Selasa, 15 Oktober 2025
⏰ Waktu: 09:00 - 09:30 WIB
📍 Lokasi: Klinik Sehat Sejahtera
   Jl. Sudirman No. 123, Jakarta

💳 Status Pembayaran: Lunas (Rp 50.000)

⏰ REMINDER:
Datang 10 menit sebelum jadwal dan tunjukkan nomor booking saat check-in.

Lokasi klinik:
[Link Google Maps]

Butuh bantuan? Hubungi kami:
📱 +62 21 1234 5567

Terima kasih! 😊
```

**Email Confirmation (If Provided)**
```
Subject: Konfirmasi Booking - BKG-20251015-001

[HTML Email with same details as WhatsApp + calendar attachment]
```

### Error Handling

```
If confirmation page accessed without booking data:
  - Redirect to home
  - Show message: "Booking tidak ditemukan"

If WhatsApp/Calendar/Maps actions fail:
  - Show toast error
  - "Tidak dapat membuka [app]. Silakan coba lagi."
  - Fallback options if available
```

### Accessibility

- Success animation respects prefers-reduced-motion
- All action buttons keyboard accessible
- Booking number copyable via keyboard
- Screen reader announces success status
- Clear focus indicators on all interactive elements

### Responsive Behavior

**Tablet/Desktop**
```
- Centered content, max-width 640px
- Larger success icon (160px)
- Two-column action buttons (2×2 grid)
- Side-by-side next steps
```

---

## Cross-Screen Components & Patterns

### Progress Stepper (Reusable)

Used on screens 2-6 to show booking progress.

**Component Structure**
```javascript
<ProgressStepper
  currentStep={2}
  totalSteps={4}
  steps={[
    { label: 'Jenis Booking', completed: true },
    { label: 'Pilih Tanggal', completed: false, current: true },
    { label: 'Pilih Waktu', completed: false },
    { label: 'Data Diri', completed: false }
  ]}
/>
```

**Responsive Variations**
```
Mobile (< 768px):
  - Dots only, no labels
  - Centered, 16px gaps
  - Current step text below: "Step 2 dari 4"

Tablet+ (≥ 768px):
  - Dots with labels below
  - Wider gaps (32px)
  - Full progress bar connecting dots
```

### Back Button (Header)

Appears on all screens except landing and confirmation.

**Behavior**
```javascript
onClick() {
  // Confirm if user has made selections
  if (hasUnsavedChanges) {
    showConfirmDialog({
      title: "Batalkan booking?",
      message: "Perubahan Anda akan hilang jika kembali.",
      confirmText: "Ya, Kembali",
      cancelText: "Lanjut Booking",
      onConfirm: () => navigateBack()
    });
  } else {
    navigateBack();
  }
}
```

### Bottom CTA (Fixed)

Used on screens with form/selection inputs.

**Show/Hide Logic**
```javascript
// Show fixed CTA when:
- Screen height > content height
- User scrolled down (CTA in viewport)

// Hide fixed CTA when:
- CTA inline version visible (desktop layouts)
- Keyboard open (mobile)
- Modal/overlay active
```

### Loading States (Global)

**Full Screen Loading**
```
Used when:
  - Initial screen load
  - Transitioning between major screens
  - Payment processing

UI:
  - Centered spinner (48px)
  - Logo above spinner
  - Loading text below: "Memuat..."
  - White background
  - Fade in/out transitions
```

**Inline Loading (Skeleton)**
```
Used when:
  - Fetching availability data
  - Loading time slots
  - Updating dynamic content

UI:
  - Skeleton shapes matching content
  - Shimmer animation
  - Preserve layout (no content shift)
```

**Button Loading**
```
Used when:
  - Submitting forms
  - Creating bookings
  - Processing payments

UI:
  - Disable button
  - Replace text with spinner + "Memproses..."
  - Prevent double-click
  - Show progress if multi-step
```

### Toast Notifications

**Component Structure**
{% raw %}
```javascript
<Toast
  type="success" | "error" | "warning" | "info"
  message="Slot berhasil dipilih"
  duration={3000}
  position="top-center" | "bottom-center"
  action={{ label: "Undo", onClick: () => {} }}  // optional
/>
```
{% endraw %}

**Styling**
```
Success:
  Background:  #00A68F
  Icon:        Checkmark circle

Error:
  Background:  #EF4444
  Icon:        X circle

Warning:
  Background:  #F59E0B
  Icon:        Alert triangle

Info:
  Background:  #3B82F6
  Icon:        Info circle

Common:
  Text:        #FFFFFF, 15px Medium
  Padding:     12px 20px
  Border-radius: 8px
  Shadow:      shadow-lg
  Icon size:   20px
  Max-width:   90vw (mobile), 400px (desktop)

  Animation:
    Enter:     Slide down + fade in (300ms)
    Exit:      Fade out (200ms)
```

### Confirm Dialog

**Component Structure**
```javascript
<ConfirmDialog
  title="Batalkan booking?"
  message="Perubahan Anda akan hilang jika kembali."
  confirmText="Ya, Kembali"
  cancelText="Lanjut Booking"
  confirmVariant="danger"  // "primary", "danger"
  onConfirm={() => {}}
  onCancel={() => {}}
/>
```

**Styling**
```
Modal:
  Max-width:   400px
  Padding:     24px
  Border-radius: 16px
  Background:  #FFFFFF
  Shadow:      shadow-lg

Title:
  Font:        20px Semibold
  Color:       #1A1A1A
  Margin-bottom: 12px

Message:
  Font:        15px Regular
  Color:       #4A4A4A
  Line-height: 1.6
  Margin-bottom: 24px

Buttons:
  Layout:      Flex row, gap 12px
  Width:       100% (each 50%)

  Cancel:      Secondary button
  Confirm:     Primary or danger button
```

---

This completes the detailed wireframes and component specifications for all 7 screens of the patient booking flow. Each screen includes layout structure, component specs, interaction flows, validation rules, error handling, and responsive behaviors following the Gusto-inspired design system.

Next document will cover the comprehensive interaction patterns and UX flow documentation.
