# Screen-to-Component Mapping - JanjiTemu System

## Overview
This document provides a detailed breakdown of which shadcn/ui components are needed for each screen in the application.

---

## PATIENT BOOKING INTERFACE (Mobile-First)

### Screen 1: Booking Home / Doctor Selection
**URL:** `/booking`

**Components Used:**
- [x] **Card** - Container for clinic information header
  - CardHeader - Clinic name and logo
  - CardContent - Clinic address and hours
- [x] **Select** - Doctor selection dropdown
  - SelectTrigger - "Select a Doctor" button
  - SelectContent - Dropdown panel
  - SelectItem - Each doctor option
- [x] **Avatar** - Doctor profile photos in dropdown
  - AvatarImage - Doctor photo
  - AvatarFallback - Initials if no photo
- [x] **Badge** - Doctor specialization tags
- [x] **Button** - "Continue" action
- [x] **Alert** - Welcome message or important notice

**Custom Components:**
- `DoctorSelectionCard` - Enhanced doctor card with photo, name, specialization, and availability indicator

**State:**
- Selected doctor ID
- Available doctors list

---

### Screen 2: Date Selection
**URL:** `/booking?step=2`

**Components Used:**
- [x] **Card** - Selected doctor summary at top
- [x] **Popover** - Date picker overlay
  - PopoverTrigger - "Select Date" button
  - PopoverContent - Calendar container
- [x] **Calendar** - Date selection interface
  - Single selection mode
  - Disabled past dates
  - Disabled dates outside doctor schedule
  - Highlighted available dates
- [x] **Button** - "Back", "Continue"
- [x] **Badge** - Available/Unavailable date indicators
- [x] **Alert** - Availability warnings (e.g., "Limited slots on this date")

**Custom Components:**
- `AvailabilityCalendar` - Calendar with custom date styling based on slot availability

**State:**
- Selected date
- Doctor's available dates
- Slot count per date

---

### Screen 3: Booking Type Selection
**URL:** `/booking?step=3`

**Components Used:**
- [x] **Card** - Booking summary (doctor + date)
- [x] **RadioGroup** - Booking type options
  - RadioGroupItem - "Fast-Track (Select Time Slot)" option
  - RadioGroupItem - "Regular Reservation (No Time)" option
- [x] **Label** - Radio option labels
- [x] **Card** - Information card for each option
  - CardHeader - Option title
  - CardContent - Option description and price
- [x] **Badge** - "Recommended" or "Popular" badges
- [x] **Button** - "Back", "Continue"
- [x] **Alert** - Information about booking types

**State:**
- Selected booking type

---

### Screen 4: Time Slot Selection (Only if Fast-Track)
**URL:** `/booking?step=4`

**Components Used:**
- [x] **Card** - Booking summary (doctor + date + type)
- [x] **ScrollArea** - Scrollable time slot list
- [x] **RadioGroup** - Time slot selection
  - RadioGroupItem - Each available time slot
- [x] **Badge** - Slot status indicators
  - "Available" (green)
  - "Almost Full" (yellow)
  - "Full" (red, disabled)
- [x] **Button** - "Back", "Continue"
- [x] **Label** - Time slot labels
- [x] **Alert** - Time zone information

**Custom Components:**
- `TimeSlotPicker` - Grid/list of time slots with visual availability indicators

**State:**
- Selected time slot
- Available time slots
- Booked slot count per time

---

### Screen 5: Patient Information Form
**URL:** `/booking?step=5`

**Components Used:**
- [x] **Card** - Booking summary (doctor + date + time)
- [x] **Form** - Form wrapper with validation
- [x] **FormField** - Each form field wrapper
- [x] **FormLabel** - Field labels
- [x] **FormControl** - Input wrapper
- [x] **FormMessage** - Validation error messages
- [x] **FormDescription** - Field help text
- [x] **Input** - Text inputs
  - Name (type="text")
  - Phone/WhatsApp (type="tel")
  - Email (type="email", optional)
- [x] **Textarea** - Patient notes/complaints (optional)
- [x] **Checkbox** - WhatsApp notification consent
- [x] **Button** - "Back", "Continue"
- [x] **Alert** - Privacy notice

**State:**
- Form values (name, phone, email, notes)
- Validation errors
- WhatsApp consent

---

### Screen 6: Payment Method Selection (Only if Fast-Track)
**URL:** `/booking?step=6`

**Components Used:**
- [x] **Card** - Complete booking summary
- [x] **RadioGroup** - Payment method options
  - RadioGroupItem - QRIS
  - RadioGroupItem - Bank Transfer
  - RadioGroupItem - Credit Card
- [x] **Label** - Payment option labels
- [x] **Card** - Payment method info cards
  - CardHeader - Method name and logo
  - CardContent - Method description
- [x] **Badge** - "Instant" or "Verify within 10 min" badges
- [x] **Button** - "Back", "Proceed to Payment"
- [x] **Alert** - Payment time limit warning

**State:**
- Selected payment method

---

### Screen 7: Payment Instructions
**URL:** `/booking/payment?id=xxx`

**Components Used:**
- [x] **Dialog** - Payment instruction modal
  - DialogHeader - Payment method title
  - DialogTitle - "Complete Your Payment"
  - DialogDescription - Instructions summary
  - DialogContent - Main content area
  - DialogFooter - Action buttons
- [x] **Card** - Payment details card
  - CardContent - QR code / bank details / card form
- [x] **Alert** - Important payment instructions
- [x] **Button** - "I've Paid", "Change Method", "Cancel Booking"
- [x] **Progress** - Payment verification progress
- [x] **Badge** - Payment status indicator
- [x] **Separator** - Content dividers

**Custom Components:**
- `PaymentInstructionCard` - Method-specific payment UI
  - QRIS: QR code display with copy button
  - Bank Transfer: Account details with copy buttons
  - Credit Card: Payment form or gateway redirect

**State:**
- Payment status
- Transaction ID
- Countdown timer

---

### Screen 8: Booking Confirmation
**URL:** `/booking/confirmation?id=xxx`

**Components Used:**
- [x] **Dialog** - Confirmation modal (or full page)
  - DialogHeader - Success icon/animation
  - DialogTitle - "Booking Confirmed!"
  - DialogDescription - Next steps
  - DialogContent - Booking details
  - DialogFooter - Action buttons
- [x] **Card** - Booking details card
  - CardHeader - Doctor info with avatar
  - CardTitle - Doctor name
  - CardDescription - Specialization
  - CardContent - Appointment details
  - CardFooter - Booking ID
- [x] **Avatar** - Doctor photo
- [x] **Badge** - Booking type, payment status
- [x] **Separator** - Content sections
- [x] **Alert** - WhatsApp reminder information
- [x] **Button** - "Close", "Add to Calendar", "Share"

**Custom Components:**
- `BookingSummaryCard` - Comprehensive booking summary with QR code

**State:**
- Booking confirmation data
- QR code for check-in

---

## ADMIN DASHBOARD (Desktop-Optimized)

### Screen 9: Admin Login
**URL:** `/admin/login`

**Components Used:**
- [x] **Card** - Centered login card
  - CardHeader - Logo and title
  - CardTitle - "Admin Login"
  - CardDescription - Welcome message
  - CardContent - Login form
  - CardFooter - Error messages or links
- [x] **Form** - Login form wrapper
- [x] **FormField** - Username and password fields
- [x] **Input** - Text inputs
  - Username (type="text")
  - Password (type="password")
- [x] **Button** - "Login"
- [x] **Alert** - Error messages (wrong credentials)
- [x] **Checkbox** - "Remember me" (optional)

**State:**
- Username, password
- Login error
- Loading state

---

### Screen 10: Dashboard Overview
**URL:** `/admin/dashboard`

**Layout Components:**
- [x] **NavigationMenu** - Desktop sidebar navigation (hidden on mobile)
- [x] **Sheet** - Mobile navigation drawer
  - SheetTrigger - Hamburger menu button
  - SheetContent - Navigation menu items
- [x] **Separator** - Menu section dividers
- [x] **Avatar** - User profile in header
- [x] **DropdownMenu** - User profile menu
  - DropdownMenuTrigger - Avatar/name button
  - DropdownMenuContent - Menu panel
  - DropdownMenuItem - Profile, Settings, Logout
  - DropdownMenuSeparator - Menu dividers

**Content Components:**
- [x] **Card** - Metric cards (4x grid)
  - CardHeader - Metric title
  - CardTitle - Large number
  - CardDescription - Comparison or subtitle
  - CardContent - Optional chart/icon
- [x] **Badge** - Status indicators
- [x] **Button** - Quick actions
- [x] **Tabs** - Content organization (optional)
- [x] **Alert** - Important notifications

**Custom Components:**
- `DashboardLayout` - Reusable layout with sidebar + header
- `MetricCard` - Styled card for KPIs with trend indicators

**State:**
- Dashboard metrics
- User info
- Navigation state

---

### Screen 11: Clinic Profile Management
**URL:** `/admin/clinic`

**Components Used:**
- [x] **Tabs** - Section tabs
  - TabsList - Tab buttons
  - TabsTrigger - "Basic Info", "Services", "Hours"
  - TabsContent - Tab panels
- [x] **Card** - Section containers
- [x] **Form** - Profile form
- [x] **FormField** - Each input field
- [x] **Input** - Text inputs (name, address, phone, email)
- [x] **Textarea** - Services description, about text
- [x] **Button** - "Save Changes", "Cancel", "Upload Logo"
- [x] **Alert** - Save success/error messages
- [x] **Separator** - Section dividers
- [x] **Label** - Form labels
- [x] **Toast** - Save confirmation notifications

**Custom Components:**
- `OperatingHoursEditor` - Weekly schedule grid with time inputs

**State:**
- Clinic profile data
- Form dirty state
- Save status

---

### Screen 12: Doctors Management
**URL:** `/admin/doctors`

**Components Used:**
- [x] **Button** - "Add Doctor" (primary action in header)
- [x] **Input** - Search doctors input (with search icon)
- [x] **Select** - Filter by specialization or status
- [x] **Table** - Doctors list table
  - TableHeader - Column headers
  - TableHead - "Photo", "Name", "Specialization", "Status", "Actions"
  - TableBody - Doctor rows
  - TableRow - Each doctor
  - TableCell - Cell content
- [x] **Avatar** - Doctor photos in table
- [x] **Badge** - Status indicators ("Active", "Inactive")
- [x] **DropdownMenu** - Row actions menu
  - DropdownMenuTrigger - Three dots button
  - DropdownMenuItem - "Edit", "View Schedule", "Deactivate"
  - DropdownMenuSeparator - Menu dividers
- [x] **Dialog** - Add/Edit doctor form
  - DialogHeader, DialogTitle, DialogContent, DialogFooter
- [x] **Form** - Doctor form
- [x] **Input** - Name, specialization inputs
- [x] **Textarea** - Bio input
- [x] **Toggle** - Active status toggle
- [x] **AlertDialog** - Delete confirmation
- [x] **Toast** - Success/error notifications

**Custom Components:**
- `DoctorForm` - Reusable form for add/edit
- `DoctorAvatar` - Avatar with upload capability

**State:**
- Doctors list
- Selected doctor (for edit)
- Dialog open/close state
- Search/filter values

---

### Screen 13: Schedule Management
**URL:** `/admin/schedule`

**Components Used:**
- [x] **Select** - Doctor filter dropdown
- [x] **Card** - Schedule container
  - CardHeader - Doctor info with avatar
  - CardTitle - Doctor name
  - CardContent - Schedule interface
- [x] **Avatar** - Doctor photo in header
- [x] **Button** - "Add Schedule", "Edit", "Delete"
- [x] **Tabs** - Days of week tabs
  - TabsList - Mon-Sun tabs
  - TabsTrigger - Each day
  - TabsContent - Day's schedule
- [x] **ScrollArea** - Scrollable time blocks
- [x] **Card** - Schedule block cards (nested)
  - CardContent - Time range
- [x] **Badge** - Time labels
- [x] **Calendar** - Holiday marking calendar
  - Multi-select mode for holidays
- [x] **Dialog** - Add/Edit schedule form
  - DialogHeader, DialogTitle, DialogContent, DialogFooter
- [x] **Form** - Schedule form
- [x] **Checkbox** - Working days checkboxes (7x for each day)
- [x] **Input** - Start time, end time (type="time")
- [x] **Select** - Slot duration dropdown
- [x] **Popover** - Date picker for holidays
- [x] **Separator** - Section dividers
- [x] **AlertDialog** - Delete schedule confirmation
- [x] **Toast** - Save/delete notifications

**Custom Components:**
- `ScheduleCalendarView` - Weekly calendar grid view
- `TimeBlockEditor` - Drag-and-drop time block interface
- `HolidayManager` - Calendar with multi-date selection

**State:**
- Selected doctor
- Doctor schedules
- Holidays list
- Form state

---

### Screen 14: Bookings Management
**URL:** `/admin/bookings`

**Filter Bar Components:**
- [x] **Input** - Search by patient name/phone (with search icon)
- [x] **Popover** - Date range picker
  - PopoverTrigger - Date range button
  - PopoverContent - Calendar
- [x] **Calendar** - Date range selection (range mode)
- [x] **Select** - Filter dropdowns (3x)
  - Doctor filter
  - Status filter
  - Type filter (All/Fast-Track/Regular)
- [x] **Button** - "Clear Filters", "Export"

**Tabs Components:**
- [x] **Tabs** - Booking views
  - TabsList - Tab buttons
  - TabsTrigger - "All", "Today", "Upcoming", "Completed"
  - TabsContent - Table for each view

**Table Components:**
- [x] **Table** - Bookings table
  - TableHeader - Column headers
  - TableHead - "Select", "ID", "Patient", "Doctor", "Date & Time", "Type", "Payment", "Status", "Actions"
  - TableBody - Booking rows
  - TableRow - Each booking
  - TableCell - Cell content
- [x] **Checkbox** - Row selection (bulk actions)
- [x] **Avatar** - Doctor photos in table
- [x] **Badge** - Multiple badges per row
  - Booking type badge
  - Payment status badge
  - Booking status badge
- [x] **DropdownMenu** - Row actions
  - DropdownMenuTrigger - Three dots button
  - DropdownMenuItem - "View Details", "Change Status", "Contact Patient", "Cancel"
  - DropdownMenuSeparator - Dividers

**Dialog Components:**
- [x] **Dialog** - Booking details dialog
  - DialogHeader - Title and current status badge
  - DialogTitle - "Booking Details"
  - DialogContent - Multiple cards with info
  - DialogFooter - Action buttons
- [x] **Card** - Information cards (nested in dialog)
  - Patient Information card
  - Appointment Information card
  - Payment Information card (if applicable)
- [x] **Separator** - Section dividers in dialog
- [x] **Select** - Status update dropdown
- [x] **Textarea** - Status notes input
- [x] **Button** - "Update Status", "Close", "Print"
- [x] **AlertDialog** - Cancel booking confirmation
- [x] **Sheet** - Mobile booking details (alternative to Dialog)
- [x] **Toast** - Status update notifications

**Additional Components:**
- [x] **Tooltip** - Info tooltips on column headers
- [x] **Skeleton** - Loading states for table

**Custom Components:**
- `FilterBar` - Reusable filter component
- `BookingDetailsDialog` - Comprehensive booking view
- `StatusUpdateForm` - Status change interface

**State:**
- Bookings list
- Filters (date range, doctor, status, type, search)
- Selected bookings (for bulk actions)
- Selected booking (for details view)
- Sorting/pagination state

---

## OWNER DASHBOARD (Enhanced Analytics)

### Screen 15: Financial Reports
**URL:** `/owner/reports`

**Filter Bar Components:**
- [x] **Popover** - Date range picker
- [x] **Calendar** - Date range selection
- [x] **Select** - Report type dropdown
- [x] **Button** - "Export"
- [x] **DropdownMenu** - Export format options
  - DropdownMenuItem - "Export PDF", "Export CSV", "Export Excel"

**Tabs Components:**
- [x] **Tabs** - Report tabs
  - TabsList - Tab buttons
  - TabsTrigger - "Revenue", "Commission", "Statistics"
  - TabsContent - Report content

**Revenue Tab Components:**
- [x] **Card** - Metric cards (4x grid)
  - CardHeader - Metric title
  - CardTitle - Large number
  - CardDescription - Comparison with previous period
  - CardContent - Trend indicator
- [x] **Badge** - Trend badges (up/down)
- [x] **Table** - Revenue by doctor table
  - TableHeader - Column headers
  - TableHead - "Doctor", "Total Bookings", "Fast-Track Count", "Total Revenue", "Commission", "Doctor Earnings"
  - TableBody - Doctor rows
  - TableRow - Each doctor
  - TableCell - Cell content (formatted numbers)
- [x] **Avatar** - Doctor photos in table
- [x] **Separator** - Section dividers
- [x] **Progress** - Optional progress bars for targets

**Commission Tab Components:**
- [x] **Card** - Commission settings card
- [x] **Form** - Commission rate form
- [x] **Input** - Commission percentage input
- [x] **Button** - "Save Settings"
- [x] **Card** - Commission breakdown card
- [x] **Accordion** - Doctor commission details
  - AccordionItem - Each doctor
  - AccordionTrigger - Doctor name + total commission
  - AccordionContent - Monthly breakdown table
- [x] **Table** - Monthly breakdown (nested in accordion)
- [x] **Badge** - Month labels

**Statistics Tab Components:**
- [x] **Card** - Stat cards (4x grid)
  - Total Bookings This Month
  - Fast-Track vs Regular %
  - No-Show Rate
  - Average Satisfaction (if available)
- [x] **Card** - Chart container (for future chart integration)
- [x] **Alert** - Data insights or recommendations

**Custom Components:**
- `RevenueMetricsGrid` - Dashboard-style metrics
- `CommissionTable` - Formatted financial table
- `TrendIndicator` - Up/down arrow with percentage

**State:**
- Date range
- Report data
- Commission settings
- Export status

---

### Screen 16: Analytics Dashboard
**URL:** `/owner/analytics`

**Components Used:**
- [x] **Select** - Time period selector (Day/Week/Month/Year)
- [x] **Card** - Quick stat cards (4x grid)
  - Today's Bookings
  - Today's Revenue
  - Pending Confirmations
  - Active Doctors
- [x] **Card** - Chart cards (4x grid)
  - Booking Rate Trend
  - Revenue Trend
  - Doctor Performance
  - Peak Hours
- [x] **Accordion** - Detailed insights sections
  - AccordionItem - "Patient Insights"
  - AccordionItem - "Doctor Insights"
  - AccordionItem - "Payment Insights"
  - AccordionContent - Tables with detailed data
- [x] **Table** - Insight tables (nested in accordion)
- [x] **Badge** - Metric indicators
- [x] **Button** - "Export Full Report", "Refresh Data"
- [x] **Separator** - Section dividers
- [x] **Skeleton** - Loading states for charts

**Custom Components:**
- `AnalyticsCard` - Card wrapper for charts
- `MetricComparison` - Current vs previous period comparison
- Chart components (Recharts integration):
  - `BookingTrendChart` - Line chart
  - `RevenueTrendChart` - Area chart
  - `DoctorPerformanceChart` - Bar chart
  - `PeakHoursChart` - Heatmap or bar chart

**State:**
- Time period
- Analytics data
- Chart data
- Loading states

---

## COMPONENT USAGE SUMMARY

### By Frequency (Most to Least Used)

1. **Button** - Used in ALL screens (32+ instances)
2. **Card** - Used in ALL screens (40+ instances)
3. **Badge** - Used in 14 screens
4. **Form + FormField** - Used in 10 screens
5. **Input** - Used in 10 screens
6. **Dialog** - Used in 9 screens
7. **Table** - Used in 5 screens (admin-heavy)
8. **Select** - Used in 10 screens
9. **RadioGroup** - Used in 4 screens (booking flow)
10. **Avatar** - Used in 8 screens
11. **Tabs** - Used in 6 screens
12. **Alert** - Used in 11 screens
13. **Toast** - Used globally (error/success notifications)
14. **Calendar** - Used in 4 screens
15. **Popover** - Used in 5 screens
16. **DropdownMenu** - Used in 5 screens
17. **Checkbox** - Used in 4 screens
18. **Textarea** - Used in 5 screens
19. **Separator** - Used in 12 screens
20. **Label** - Used in 10 screens
21. **Sheet** - Used in 3 screens (mobile responsive)
22. **NavigationMenu** - Used in 1 layout (admin/owner)
23. **Progress** - Used in 3 screens
24. **AlertDialog** - Used in 4 screens
25. **ScrollArea** - Used in 3 screens
26. **Toggle** - Used in 2 screens
27. **Accordion** - Used in 3 screens
28. **Skeleton** - Used in 4 screens (loading states)
29. **Tooltip** - Used in 3 screens (optional)
30. **HoverCard** - Used in 1 screen (optional)
31. **Command** - Not used in MVP (post-MVP)
32. **ContextMenu** - Not used in MVP (post-MVP)

---

## INSTALLATION PRIORITY ORDER

### Phase 1: Critical (Required for booking flow)
```bash
npx shadcn-ui@latest add form input select radio-group button calendar popover card badge dialog toast progress label
```

### Phase 2: High (Required for admin)
```bash
npx shadcn-ui@latest add table navigation-menu sheet tabs dropdown-menu avatar alert alert-dialog separator
```

### Phase 3: Medium (Polish and UX)
```bash
npx shadcn-ui@latest add textarea checkbox scroll-area toggle accordion skeleton
```

### Phase 4: Optional (Post-MVP)
```bash
npx shadcn-ui@latest add tooltip hover-card command context-menu
```

---

## MOBILE vs DESKTOP COMPONENT USAGE

### Mobile-Only Components
- **Sheet** - Mobile navigation drawer
- **ScrollArea** - Touch-scrollable areas
- **Progress** - Mobile stepper indicator

### Desktop-Only Components
- **NavigationMenu** - Desktop sidebar (hidden on mobile)
- **HoverCard** - Hover interactions (not applicable on touch devices)
- **Tooltip** - Hover tooltips (use differently on mobile)

### Responsive Components (Different Behavior)
- **Dialog** ↔ **Sheet** - Desktop modal vs mobile drawer
- **Table** - Desktop full table vs mobile horizontal scroll
- **DropdownMenu** - Desktop popover vs mobile bottom sheet
- **Card** - Desktop grid layout vs mobile stacked

---

## COMPONENT COMBINATIONS (Common Patterns)

### Pattern 1: Form with Dialog
```
Dialog
  DialogContent
    Form
      FormField + Input/Select/Textarea
    DialogFooter
      Button (Cancel, Submit)
```
**Used in:** Add Doctor, Edit Schedule, Status Update

### Pattern 2: Table with Actions
```
Table
  TableBody
    TableRow
      TableCell (Data)
      TableCell (DropdownMenu with actions)
```
**Used in:** Doctors List, Bookings List, Reports

### Pattern 3: Tabbed Content with Cards
```
Tabs
  TabsList
  TabsContent
    Card (Multiple cards in grid)
```
**Used in:** Dashboard, Clinic Profile, Reports

### Pattern 4: Filter Bar
```
Div (Filter Bar)
  Input (Search)
  Select (Filters)
  Popover (Date Picker)
  Button (Clear/Apply)
```
**Used in:** Bookings List, Reports

### Pattern 5: Multi-Step Form
```
Form
  Progress (Step indicator)
  Step 1: FormField components
  Step 2: FormField components
  ...
  Button (Back, Next)
```
**Used in:** Patient Booking Flow

---

## CONCLUSION

This mapping provides a complete screen-by-screen breakdown of all shadcn/ui components needed for the JanjiTemu clinic appointment system. Use this as a reference during development to ensure all necessary components are installed and implemented correctly.

**Total Screens:** 16
**Total shadcn Components Used:** 32
**Critical Components (MVP Blockers):** 13
**High Priority Components:** 11
**Medium/Low Priority:** 8

Refer to the main requirements document (`requirements.md`) for detailed implementation guidance, validation schemas, and accessibility requirements.
