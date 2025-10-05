# Clinic Appointment Booking System - Component Requirements

## Feature Name
**JanjiTemu** - Multi-Interface Clinic Appointment Booking System with Patient Portal, Admin Dashboard, and Owner Analytics

---

## Executive Summary

This document outlines the shadcn/ui component requirements for a comprehensive clinic appointment booking system supporting three distinct user interfaces:
1. **Patient Booking Interface** (Mobile-First, Guest Access)
2. **Admin Dashboard** (Desktop-Optimized, Authenticated)
3. **Owner Dashboard** (Desktop-Optimized, Authenticated, Enhanced Analytics)

---

## Components Required

### Core Form Components

#### 1. **Form** (`form`, `form-field`, `form-label`, `form-control`, `form-description`, `form-message`)
- **Purpose**: Base form infrastructure for all data collection
- **Use Cases**:
  - Patient booking form (name, phone, email)
  - Admin login form
  - Clinic profile management
  - Doctor information CRUD forms
  - Schedule configuration forms
- **Validation**: React Hook Form + Zod schema validation
- **Priority**: **CRITICAL - MVP**

#### 2. **Input** (`input`)
- **Purpose**: Text input fields for various data collection
- **Use Cases**:
  - Patient name, phone, email
  - Admin username/password
  - Clinic name, address, contact
  - Doctor name, specialization
  - Search/filter inputs
- **Variants Needed**: text, email, tel, password, search
- **Priority**: **CRITICAL - MVP**

#### 3. **Textarea** (`textarea`)
- **Purpose**: Multi-line text input
- **Use Cases**:
  - Patient complaint/notes (optional)
  - Clinic description/service info
  - Doctor bio
  - Booking notes/remarks
- **Priority**: **HIGH - MVP**

#### 4. **Select** (`select`, `select-trigger`, `select-content`, `select-item`, `select-group`)
- **Purpose**: Dropdown selection for single-choice options
- **Use Cases**:
  - Doctor selection (primary booking flow)
  - Status filter in booking list
  - Date range selection for reports
  - Clinic specialization selection
- **Priority**: **CRITICAL - MVP**

#### 5. **Radio Group** (`radio-group`, `radio-group-item`)
- **Purpose**: Mutually exclusive options
- **Use Cases**:
  - Booking type selection: "Fast-Track (Paid)" vs "Regular Reservation"
  - Payment method selection: QRIS, Bank Transfer, Credit Card
  - Report time period: Daily, Weekly, Monthly
- **Priority**: **CRITICAL - MVP**

#### 6. **Checkbox** (`checkbox`)
- **Purpose**: Boolean selections and multi-select options
- **Use Cases**:
  - Terms & conditions acceptance
  - WhatsApp notification consent
  - Working days selection for doctor schedule
  - Multi-select filters in booking list
- **Priority**: **HIGH - MVP**

#### 7. **Label** (`label`)
- **Purpose**: Accessible form field labels
- **Use Cases**: All form inputs across the system
- **Priority**: **CRITICAL - MVP**

---

### Navigation & Layout Components

#### 8. **Button** (`button`)
- **Purpose**: Primary interaction element
- **Use Cases**:
  - "Book Appointment" submission
  - "Login" authentication
  - CRUD actions (Add Doctor, Edit Schedule, Delete)
  - "Change Status" booking updates
  - "Export Report" data download
- **Variants Needed**: default, destructive, outline, secondary, ghost, link
- **Sizes Needed**: default, sm, lg, icon
- **Priority**: **CRITICAL - MVP**

#### 9. **Navigation Menu** (`navigation-menu`)
- **Purpose**: Desktop dashboard navigation
- **Use Cases**:
  - Admin sidebar menu (Profile, Doctors, Schedule, Bookings)
  - Owner sidebar menu (All admin features + Reports, Analytics)
  - Mobile responsive menu toggle
- **Priority**: **CRITICAL - MVP**

#### 10. **Tabs** (`tabs`, `tabs-list`, `tabs-trigger`, `tabs-content`)
- **Purpose**: Content organization within pages
- **Use Cases**:
  - Booking list views: "All", "Today", "Upcoming", "Completed"
  - Doctor management: "Active Doctors", "Inactive", "Schedule"
  - Owner reports: "Revenue", "Commission", "Statistics"
  - Clinic profile sections: "Basic Info", "Services", "Hours"
- **Priority**: **HIGH - MVP**

#### 11. **Sheet** (`sheet`, `sheet-trigger`, `sheet-content`)
- **Purpose**: Sliding panel for mobile navigation and forms
- **Use Cases**:
  - Mobile admin menu sidebar
  - Quick booking detail view
  - Mobile filter panel
  - Quick doctor profile edit
- **Priority**: **HIGH - MVP**

#### 12. **Separator** (`separator`)
- **Purpose**: Visual content division
- **Use Cases**:
  - Section dividers in forms
  - Menu item separators
  - Dashboard card separators
- **Priority**: **MEDIUM - MVP**

---

### Date & Time Components

#### 13. **Calendar** (`calendar`)
- **Purpose**: Date selection interface
- **Use Cases**:
  - Patient booking date selection (primary flow)
  - Admin schedule configuration
  - Date range picker for reports
  - Doctor leave/holiday marking
  - Booking list date filter
- **Features Needed**:
  - Disabled dates (outside doctor schedule)
  - Highlighted available dates
  - Multi-date selection (for holiday marking)
  - Min/max date constraints
- **Priority**: **CRITICAL - MVP**

#### 14. **Popover** (`popover`, `popover-trigger`, `popover-content`)
- **Purpose**: Contextual date picker and additional info display
- **Use Cases**:
  - Date picker overlay (wrapping Calendar component)
  - Time slot selection overlay
  - Quick action menus
  - Doctor availability info popup
- **Priority**: **CRITICAL - MVP**

---

### Data Display Components

#### 15. **Table** (`table`, `table-header`, `table-body`, `table-row`, `table-head`, `table-cell`, `table-caption`)
- **Purpose**: Structured data display
- **Use Cases**:
  - Booking list (ID, Patient, Doctor, Date/Time, Type, Status, Actions)
  - Doctor list (Name, Specialization, Active Days, Actions)
  - Revenue report (Doctor, Bookings, Revenue, Commission)
  - Patient data in booking details
- **Features Needed**:
  - Sortable columns
  - Filtering
  - Pagination
  - Row selection
  - Action buttons per row
- **Priority**: **CRITICAL - MVP**

#### 16. **Card** (`card`, `card-header`, `card-title`, `card-description`, `card-content`, `card-footer`)
- **Purpose**: Grouped content containers
- **Use Cases**:
  - Doctor selection cards (photo, name, specialization)
  - Dashboard metric cards (Total Bookings, Revenue, No-Show Rate)
  - Clinic profile display
  - Booking confirmation card
  - Quick stats cards (Owner dashboard)
- **Priority**: **CRITICAL - MVP**

#### 17. **Badge** (`badge`)
- **Purpose**: Status indicators and labels
- **Use Cases**:
  - Booking status: "Pending", "Confirmed", "Paid", "Completed", "Cancelled"
  - Booking type: "Fast-Track", "Regular"
  - Payment status: "Paid", "Unpaid"
  - Doctor status: "Available", "On Leave"
  - New notifications indicator
- **Variants Needed**: default, secondary, destructive, outline, success
- **Priority**: **HIGH - MVP**

#### 18. **Avatar** (`avatar`, `avatar-image`, `avatar-fallback`)
- **Purpose**: User/doctor profile images
- **Use Cases**:
  - Doctor profile photos (booking selection)
  - Admin user profile (header)
  - Booking list doctor avatars
- **Priority**: **MEDIUM - MVP**

#### 19. **Accordion** (`accordion`, `accordion-item`, `accordion-trigger`, `accordion-content`)
- **Purpose**: Collapsible content sections
- **Use Cases**:
  - FAQ section on booking page
  - Clinic services list
  - Detailed booking information
  - Doctor schedule weekly view
- **Priority**: **MEDIUM - MVP**

---

### Feedback & Notification Components

#### 20. **Dialog** (`dialog`, `dialog-trigger`, `dialog-content`, `dialog-header`, `dialog-title`, `dialog-description`, `dialog-footer`)
- **Purpose**: Modal dialogs for critical actions and confirmations
- **Use Cases**:
  - Booking confirmation summary
  - Delete confirmation (doctor, booking)
  - Payment instruction modal (QRIS QR code, bank details)
  - Status change confirmation
  - Logout confirmation
  - Error messages
- **Priority**: **CRITICAL - MVP**

#### 21. **Alert Dialog** (`alert-dialog`, `alert-dialog-trigger`, `alert-dialog-content`, `alert-dialog-header`, `alert-dialog-footer`, `alert-dialog-action`, `alert-dialog-cancel`)
- **Purpose**: Destructive action confirmations
- **Use Cases**:
  - Cancel booking confirmation
  - Delete doctor confirmation
  - Clear schedule confirmation
  - Account deletion
- **Priority**: **HIGH - MVP**

#### 22. **Toast** (`toast`, `toaster`)
- **Purpose**: Non-intrusive notifications
- **Use Cases**:
  - Booking success: "Appointment booked successfully!"
  - Form validation errors
  - Save confirmations
  - Payment status updates
  - Auto-save indicators
  - Error notifications
- **Variants Needed**: default, success, error, warning, info
- **Priority**: **CRITICAL - MVP**

#### 23. **Alert** (`alert`, `alert-title`, `alert-description`)
- **Purpose**: Important inline messages
- **Use Cases**:
  - Payment instruction display
  - Slot availability warnings: "Only 2 slots remaining today"
  - System announcements
  - Validation error summaries
  - WhatsApp notification consent notice
- **Variants Needed**: default, destructive, warning, info
- **Priority**: **HIGH - MVP**

#### 24. **Progress** (`progress`)
- **Purpose**: Loading and progress indication
- **Use Cases**:
  - Multi-step booking form progress
  - Payment processing indicator
  - Data export progress
  - Report generation
- **Priority**: **MEDIUM - MVP**

#### 25. **Skeleton** (`skeleton`)
- **Purpose**: Loading state placeholders
- **Use Cases**:
  - Calendar loading
  - Doctor list loading
  - Booking table loading
  - Dashboard metrics loading
- **Priority**: **MEDIUM - MVP**

---

### Specialized Components

#### 26. **Scroll Area** (`scroll-area`)
- **Purpose**: Styled scrollable containers
- **Use Cases**:
  - Time slot selection list (vertical scroll)
  - Booking list on mobile
  - Notification panel
  - Doctor list in booking flow
- **Priority**: **MEDIUM - MVP**

#### 27. **Toggle** (`toggle`, `toggle-group`)
- **Purpose**: On/off state controls
- **Use Cases**:
  - Doctor availability toggle (Active/Inactive)
  - Notification preferences
  - View mode switchers (Grid/List)
  - Working hours enable/disable per day
- **Priority**: **MEDIUM - MVP**

#### 28. **Dropdown Menu** (`dropdown-menu`, `dropdown-menu-trigger`, `dropdown-menu-content`, `dropdown-menu-item`, `dropdown-menu-separator`, `dropdown-menu-label`)
- **Purpose**: Contextual action menus
- **Use Cases**:
  - Booking row actions: "View Details", "Change Status", "Cancel"
  - User profile menu: "Profile", "Settings", "Logout"
  - Doctor row actions: "Edit", "View Schedule", "Deactivate"
  - Bulk actions menu
  - Export options
- **Priority**: **HIGH - MVP**

#### 29. **Command** (`command`, `command-input`, `command-list`, `command-item`, `command-group`)
- **Purpose**: Command palette / searchable command interface
- **Use Cases**:
  - Quick booking search (by patient name/phone)
  - Doctor quick search
  - Navigation shortcuts (Admin panel)
  - Multi-filter interface
- **Priority**: **LOW - Post-MVP**

#### 30. **Context Menu** (`context-menu`)
- **Purpose**: Right-click contextual menus
- **Use Cases**:
  - Table row right-click actions
  - Calendar date right-click options
  - Quick booking status updates
- **Priority**: **LOW - Post-MVP**

#### 31. **Hover Card** (`hover-card`, `hover-card-trigger`, `hover-card-content`)
- **Purpose**: Preview information on hover
- **Use Cases**:
  - Doctor profile preview (before selection)
  - Booking details preview in table
  - Patient info preview
  - Schedule availability preview
- **Priority**: **LOW - Post-MVP**

#### 32. **Tooltip** (`tooltip`, `tooltip-trigger`, `tooltip-content`, `tooltip-provider`)
- **Purpose**: Helpful hints and explanations
- **Use Cases**:
  - Icon button explanations
  - Status badge meanings
  - Form field help text
  - Feature guidance for first-time users
- **Priority**: **MEDIUM - MVP**

---

## Component Hierarchy

### 1. Patient Booking Interface (Mobile-First)

```
App
└── BookingPage
    ├── Header (Clinic Info)
    │   └── Card
    │       ├── CardHeader
    │       └── CardContent
    │
    ├── BookingForm (Multi-Step)
    │   ├── Form (React Hook Form Provider)
    │   │
    │   ├── Step 1: Doctor Selection
    │   │   ├── Label ("Select Doctor")
    │   │   ├── Select (Doctor Dropdown)
    │   │   │   ├── SelectTrigger
    │   │   │   └── SelectContent
    │   │   │       └── SelectItem (foreach doctor)
    │   │   │           ├── Avatar (Doctor Photo)
    │   │   │           └── Text (Name + Specialization)
    │   │   └── Card (Selected Doctor Info)
    │   │
    │   ├── Step 2: Date Selection
    │   │   ├── Label ("Select Date")
    │   │   ├── Popover
    │   │   │   ├── PopoverTrigger (Button w/ Calendar Icon)
    │   │   │   └── PopoverContent
    │   │   │       └── Calendar (Available dates highlighted)
    │   │   └── Alert (Availability warning if needed)
    │   │
    │   ├── Step 3: Booking Type Selection
    │   │   ├── Label ("Choose Booking Type")
    │   │   └── RadioGroup
    │   │       ├── RadioGroupItem ("Fast-Track - Select Time")
    │   │       └── RadioGroupItem ("Regular - No Time Selection")
    │   │
    │   ├── Step 4: Time Selection (if Fast-Track)
    │   │   ├── Label ("Select Time")
    │   │   ├── ScrollArea (Time slots list)
    │   │   │   └── RadioGroup (Time slot options)
    │   │   └── Badge (Slots remaining indicator)
    │   │
    │   ├── Step 5: Patient Information
    │   │   ├── FormField (Name)
    │   │   │   ├── FormLabel
    │   │   │   ├── FormControl (Input)
    │   │   │   └── FormMessage
    │   │   ├── FormField (Phone/WhatsApp)
    │   │   ├── FormField (Email - optional)
    │   │   ├── FormField (Notes - optional, Textarea)
    │   │   └── Checkbox (WhatsApp consent)
    │   │
    │   ├── Step 6: Payment Method (if Fast-Track)
    │   │   ├── Label ("Select Payment Method")
    │   │   └── RadioGroup
    │   │       ├── RadioGroupItem (QRIS)
    │   │       ├── RadioGroupItem (Bank Transfer)
    │   │       └── RadioGroupItem (Credit Card)
    │   │
    │   ├── Progress (Booking progress indicator)
    │   │
    │   └── Button ("Confirm Booking")
    │
    ├── Dialog (Payment Instructions)
    │   ├── DialogHeader
    │   │   └── DialogTitle ("Complete Payment")
    │   ├── DialogContent
    │   │   ├── Alert (Instructions)
    │   │   ├── Card (QRIS QR Code / Bank Details)
    │   │   └── Progress (Payment verification)
    │   └── DialogFooter
    │       └── Button ("I've Paid")
    │
    └── Dialog (Booking Confirmation)
        ├── DialogHeader
        │   └── DialogTitle ("Booking Confirmed!")
        ├── DialogContent
        │   ├── Card (Booking Summary)
        │   │   ├── CardHeader
        │   │   │   └── CardTitle (Doctor Name + Badge "Fast-Track")
        │   │   └── CardContent
        │   │       ├── Text (Date & Time)
        │   │       ├── Text (Booking ID)
        │   │       ├── Separator
        │   │       └── Alert (WhatsApp reminder info)
        │   └── Button ("View Booking Details")
        └── DialogFooter
            └── Button ("Close")
```

---

### 2. Admin Dashboard (Desktop-Optimized)

```
App (Authenticated)
├── LoginPage
│   └── Card (Centered)
│       ├── CardHeader
│       │   └── CardTitle ("Admin Login")
│       ├── CardContent
│       │   └── Form
│       │       ├── FormField (Username - Input)
│       │       ├── FormField (Password - Input type="password")
│       │       └── Button ("Login")
│       └── CardFooter
│           └── Alert (Error messages)
│
└── AdminDashboard
    ├── DashboardLayout
    │   ├── Sidebar Navigation
    │   │   ├── NavigationMenu
    │   │   │   ├── MenuItem ("Dashboard")
    │   │   │   ├── MenuItem ("Clinic Profile")
    │   │   │   ├── MenuItem ("Doctors")
    │   │   │   ├── MenuItem ("Schedule")
    │   │   │   └── MenuItem ("Bookings")
    │   │   └── Separator
    │   │
    │   ├── Header
    │   │   ├── Sheet (Mobile menu trigger)
    │   │   └── DropdownMenu (User profile)
    │   │       ├── DropdownMenuTrigger (Avatar + Name)
    │   │       └── DropdownMenuContent
    │   │           ├── DropdownMenuItem ("Profile")
    │   │           ├── DropdownMenuItem ("Settings")
    │   │           ├── DropdownMenuSeparator
    │   │           └── DropdownMenuItem ("Logout")
    │   │
    │   └── MainContent
    │
    ├── DashboardPage
    │   ├── PageHeader
    │   │   └── H1 ("Dashboard Overview")
    │   └── StatsGrid
    │       ├── Card (Total Bookings Today)
    │       │   ├── CardHeader
    │       │   │   └── CardTitle
    │       │   └── CardContent
    │       │       └── Text (Large number)
    │       ├── Card (Pending Bookings)
    │       ├── Card (Fast-Track Bookings)
    │       └── Card (Today's Revenue - if Owner role)
    │
    ├── ClinicProfilePage
    │   ├── PageHeader
    │   │   └── H1 ("Clinic Profile")
    │   └── Tabs
    │       ├── TabsList
    │       │   ├── TabsTrigger ("Basic Info")
    │       │   ├── TabsTrigger ("Services")
    │       │   └── TabsTrigger ("Operating Hours")
    │       ├── TabsContent ("Basic Info")
    │       │   └── Card
    │       │       └── Form
    │       │           ├── FormField (Clinic Name - Input)
    │       │           ├── FormField (Address - Textarea)
    │       │           ├── FormField (Phone - Input)
    │       │           ├── FormField (Email - Input)
    │       │           └── Button ("Save Changes")
    │       ├── TabsContent ("Services")
    │       │   └── Card
    │       │       └── Textarea (Services description)
    │       └── TabsContent ("Operating Hours")
    │           └── Card
    │               └── Form (Weekly schedule)
    │                   └── [7x] FormField (Day + Time range)
    │
    ├── DoctorsPage
    │   ├── PageHeader
    │   │   ├── H1 ("Doctors Management")
    │   │   └── Button ("Add Doctor")
    │   ├── DoctorsList
    │   │   └── Table
    │   │       ├── TableHeader
    │   │       │   ├── TableHead ("Photo")
    │   │       │   ├── TableHead ("Name")
    │   │       │   ├── TableHead ("Specialization")
    │   │       │   ├── TableHead ("Status")
    │   │       │   └── TableHead ("Actions")
    │   │       └── TableBody
    │   │           └── TableRow (foreach doctor)
    │   │               ├── TableCell (Avatar)
    │   │               ├── TableCell (Name)
    │   │               ├── TableCell (Specialization)
    │   │               ├── TableCell (Badge - Active/Inactive)
    │   │               └── TableCell
    │   │                   └── DropdownMenu (Actions)
    │   │                       ├── DropdownMenuItem ("Edit")
    │   │                       ├── DropdownMenuItem ("View Schedule")
    │   │                       ├── DropdownMenuSeparator
    │   │                       └── DropdownMenuItem ("Deactivate")
    │   │
    │   └── Dialog (Add/Edit Doctor)
    │       ├── DialogHeader
    │       │   └── DialogTitle ("Add New Doctor")
    │       ├── DialogContent
    │       │   └── Form
    │       │       ├── FormField (Photo Upload - Input file)
    │       │       ├── FormField (Name - Input)
    │       │       ├── FormField (Specialization - Input)
    │       │       ├── FormField (Bio - Textarea)
    │       │       └── Toggle (Active status)
    │       └── DialogFooter
    │           ├── Button ("Cancel" variant="outline")
    │           └── Button ("Save Doctor")
    │
    ├── SchedulePage
    │   ├── PageHeader
    │   │   ├── H1 ("Doctor Schedules")
    │   │   └── Select (Doctor filter)
    │   ├── ScheduleCalendar
    │   │   └── Card
    │   │       ├── CardHeader
    │   │       │   ├── CardTitle (Doctor Name + Avatar)
    │   │       │   └── Button ("Add Schedule")
    │   │       └── CardContent
    │   │           ├── Tabs (Week view)
    │   │           │   ├── TabsList (Days of week)
    │   │           │   └── TabsContent (foreach day)
    │   │           │       └── ScrollArea (Time slots)
    │   │           │           ├── Card (foreach schedule block)
    │   │           │           │   ├── Badge (Time range)
    │   │           │           │   └── Button ("Edit", "Delete")
    │   │           │           └── Button ("Add Time Block")
    │   │           └── Calendar (Holiday marking)
    │   │
    │   └── Dialog (Add/Edit Schedule)
    │       ├── DialogHeader
    │       │   └── DialogTitle ("Edit Schedule")
    │       ├── DialogContent
    │       │   └── Form
    │       │       ├── Select (Doctor)
    │       │       ├── Checkbox Group (Working days)
    │       │       ├── FormField (Start Time - Input time)
    │       │       ├── FormField (End Time - Input time)
    │       │       ├── FormField (Slot Duration - Select "15/30/45/60 min")
    │       │       ├── Separator
    │       │       ├── Label ("Mark Holidays")
    │       │       └── Popover
    │       │           └── Calendar (Multi-select dates)
    │       └── DialogFooter
    │           ├── Button ("Cancel")
    │           └── Button ("Save Schedule")
    │
    └── BookingsPage
        ├── PageHeader
        │   ├── H1 ("Bookings Management")
        │   └── FilterBar
        │       ├── Popover (Date range picker)
        │       │   └── Calendar (range selection)
        │       ├── Select (Doctor filter)
        │       ├── Select (Status filter)
        │       ├── Select (Type filter: All/Fast-Track/Regular)
        │       └── Input (Search by name/phone)
        │
        ├── Tabs (Booking views)
        │   ├── TabsList
        │   │   ├── TabsTrigger ("All")
        │   │   ├── TabsTrigger ("Today")
        │   │   ├── TabsTrigger ("Upcoming")
        │   │   └── TabsTrigger ("Completed")
        │   │
        │   └── TabsContent
        │       └── BookingsTable
        │           └── Table
        │               ├── TableHeader
        │               │   ├── TableHead (Checkbox - Select all)
        │               │   ├── TableHead ("Booking ID")
        │               │   ├── TableHead ("Patient Name")
        │               │   ├── TableHead ("Doctor")
        │               │   ├── TableHead ("Date & Time")
        │               │   ├── TableHead ("Type")
        │               │   ├── TableHead ("Payment Status")
        │               │   ├── TableHead ("Status")
        │               │   └── TableHead ("Actions")
        │               └── TableBody
        │                   └── TableRow (foreach booking)
        │                       ├── TableCell (Checkbox)
        │                       ├── TableCell (ID)
        │                       ├── TableCell (Patient Name)
        │                       ├── TableCell (Doctor Avatar + Name)
        │                       ├── TableCell (Date & Time)
        │                       ├── TableCell (Badge - Fast-Track/Regular)
        │                       ├── TableCell (Badge - Paid/Unpaid)
        │                       ├── TableCell (Badge - Status)
        │                       └── TableCell
        │                           └── DropdownMenu
        │                               ├── DropdownMenuItem ("View Details")
        │                               ├── DropdownMenuItem ("Change Status")
        │                               ├── DropdownMenuItem ("Contact Patient")
        │                               ├── DropdownMenuSeparator
        │                               └── DropdownMenuItem ("Cancel Booking")
        │
        └── Dialog (Booking Details)
            ├── DialogHeader
            │   ├── DialogTitle ("Booking Details")
            │   └── Badge (Current Status)
            ├── DialogContent
            │   ├── Card (Patient Information)
            │   │   ├── CardHeader
            │   │   │   └── CardTitle ("Patient Information")
            │   │   └── CardContent
            │   │       ├── Text (Name)
            │   │       ├── Text (Phone)
            │   │       ├── Text (Email)
            │   │       └── Textarea (Notes - readonly)
            │   ├── Separator
            │   ├── Card (Appointment Information)
            │   │   ├── CardHeader
            │   │   │   └── CardTitle ("Appointment Details")
            │   │   └── CardContent
            │   │       ├── Avatar + Text (Doctor)
            │   │       ├── Text (Date & Time)
            │   │       ├── Badge (Type)
            │   │       └── Badge (Payment Status)
            │   ├── Separator
            │   ├── Card (Payment Information - if applicable)
            │   │   ├── CardHeader
            │   │   │   └── CardTitle ("Payment Information")
            │   │   └── CardContent
            │   │       ├── Text (Method)
            │   │       ├── Text (Amount)
            │   │       └── Text (Transaction ID)
            │   ├── Separator
            │   └── StatusUpdateSection
            │       ├── Label ("Update Status")
            │       ├── Select (New status)
            │       ├── Textarea (Notes - optional)
            │       └── Button ("Update Status")
            └── DialogFooter
                ├── Button ("Close")
                └── Button ("Print" variant="outline")
```

---

### 3. Owner Dashboard (Enhanced Analytics)

```
OwnerDashboard (extends AdminDashboard)
└── Additional Pages/Sections

    ├── ReportsPage
    │   ├── PageHeader
    │   │   ├── H1 ("Financial Reports")
    │   │   └── FilterBar
    │   │       ├── Popover (Date range)
    │   │       │   └── Calendar
    │   │       ├── Select (Report type)
    │   │       └── Button ("Export" + DropdownMenu)
    │   │
    │   └── Tabs
    │       ├── TabsList
    │       │   ├── TabsTrigger ("Revenue")
    │       │   ├── TabsTrigger ("Commission")
    │       │   └── TabsTrigger ("Statistics")
    │       │
    │       ├── TabsContent ("Revenue")
    │       │   ├── StatsGrid
    │       │   │   ├── Card (Total Revenue)
    │       │   │   ├── Card (Fast-Track Revenue)
    │       │   │   ├── Card (Clinic Commission)
    │       │   │   └── Card (Average per Booking)
    │       │   └── Table (Revenue by Doctor)
    │       │       ├── TableHeader
    │       │       │   ├── TableHead ("Doctor")
    │       │       │   ├── TableHead ("Total Bookings")
    │       │       │   ├── TableHead ("Fast-Track Count")
    │       │       │   ├── TableHead ("Total Revenue")
    │       │       │   ├── TableHead ("Commission (20%)")
    │       │       │   └── TableHead ("Doctor Earnings")
    │       │       └── TableBody
    │       │           └── TableRow (foreach doctor)
    │       │               ├── TableCell (Avatar + Name)
    │       │               ├── TableCell (Booking count)
    │       │               ├── TableCell (Fast-Track count)
    │       │               ├── TableCell (Total revenue)
    │       │               ├── TableCell (Commission amount)
    │       │               └── TableCell (Doctor earnings)
    │       │
    │       ├── TabsContent ("Commission")
    │       │   ├── Card (Commission Settings)
    │       │   │   └── Form
    │       │   │       ├── FormField (Commission % - Input)
    │       │   │       └── Button ("Save")
    │       │   └── Card (Commission Breakdown)
    │       │       └── Accordion
    │       │           └── AccordionItem (foreach doctor)
    │       │               ├── AccordionTrigger (Doctor name + Total commission)
    │       │               └── AccordionContent
    │       │                   └── Table (Monthly breakdown)
    │       │
    │       └── TabsContent ("Statistics")
    │           ├── StatsGrid
    │           │   ├── Card (Total Bookings This Month)
    │           │   ├── Card (Fast-Track vs Regular %)
    │           │   ├── Card (No-Show Rate)
    │           │   └── Card (Average Satisfaction)
    │           └── Card (Booking Trends - Chart placeholder)
    │
    └── AnalyticsPage
        ├── PageHeader
        │   ├── H1 ("Analytics Dashboard")
        │   └── Select (Time period: Day/Week/Month/Year)
        │
        ├── QuickStats
        │   ├── Card (Today's Bookings)
        │   ├── Card (Today's Revenue)
        │   ├── Card (Pending Confirmations)
        │   └── Card (Active Doctors)
        │
        ├── PerformanceMetrics
        │   ├── Card (Booking Rate Trend - Chart)
        │   ├── Card (Revenue Trend - Chart)
        │   ├── Card (Doctor Performance - Chart)
        │   └── Card (Peak Hours - Chart)
        │
        └── DetailedInsights
            ├── Accordion
            │   ├── AccordionItem ("Patient Insights")
            │   │   └── Table (Top patients, repeat bookings)
            │   ├── AccordionItem ("Doctor Insights")
            │   │   └── Table (Doctor rankings, availability utilization)
            │   └── AccordionItem ("Payment Insights")
            │       └── Table (Payment method preferences, success rates)
            └── Button ("Export Full Report")
```

---

## Implementation Notes

### State Management
- **Patient Booking**: Use React Hook Form for multi-step form state
- **Admin Dashboard**: Consider Zustand or Context API for global state (user auth, filters)
- **Owner Dashboard**: Same as Admin + additional analytics state
- **Real-time Updates**: Implement socket.io or polling for calendar availability

### Validation Rules

#### Patient Booking Form
```typescript
const bookingSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.date().min(new Date(), "Cannot book past dates"),
  bookingType: z.enum(["fast-track", "regular"]),
  timeSlot: z.string().optional(), // Required if fast-track
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientPhone: z.string().regex(/^(\+62|0)[0-9]{9,12}$/, "Invalid Indonesian phone number"),
  patientEmail: z.string().email().optional(),
  patientNotes: z.string().max(500).optional(),
  whatsappConsent: z.boolean().refine(val => val === true, "WhatsApp consent required"),
  paymentMethod: z.enum(["qris", "bank_transfer", "credit_card"]).optional(), // Required if fast-track
})
```

#### Doctor Form
```typescript
const doctorSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  specialization: z.string().min(2, "Specialization required"),
  bio: z.string().max(500).optional(),
  photo: z.string().url().optional(),
  isActive: z.boolean().default(true),
})
```

#### Schedule Form
```typescript
const scheduleSchema = z.object({
  doctorId: z.string().min(1, "Select a doctor"),
  workingDays: z.array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])).min(1, "Select at least one day"),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  slotDuration: z.enum(["15", "30", "45", "60"]),
  holidays: z.array(z.date()).optional(),
})
```

### Accessibility Requirements

1. **Keyboard Navigation**
   - All interactive elements must be keyboard accessible
   - Focus indicators visible on all focusable elements
   - Tab order follows logical flow
   - Escape key closes modals/dialogs

2. **Screen Reader Support**
   - Proper ARIA labels on all form fields
   - Status announcements for booking confirmations
   - Table headers properly associated
   - Loading states announced

3. **Color & Contrast**
   - WCAG AA compliance minimum (4.5:1 for normal text)
   - Status badges use both color AND icons/text
   - Error messages use red + icon
   - Success messages use green + icon

4. **Mobile Accessibility**
   - Touch targets minimum 48x48px
   - Sufficient spacing between interactive elements
   - Pinch-to-zoom enabled
   - Landscape and portrait support

5. **Form Accessibility**
   - Clear error messages
   - Inline validation feedback
   - Required field indicators
   - Helpful placeholder text (not replacing labels)

---

## Data Flow Patterns

### Patient Booking Flow
```
1. User selects doctor → Fetch doctor's available dates
2. User selects date → Fetch available time slots (if fast-track)
3. User fills form → Client-side validation
4. If fast-track → Payment gateway integration
5. Payment callback → Update booking status
6. Trigger WhatsApp notification (H-1, H-0)
7. Display confirmation
```

### Admin Booking Management Flow
```
1. Load bookings table → Server-side filtering/pagination
2. Apply filters → Debounced API call
3. Status update → Optimistic UI update → API call → Revalidate
4. Real-time updates → WebSocket or polling for new bookings
```

### Owner Analytics Flow
```
1. Load dashboard → Parallel API calls for metrics
2. Date range change → Debounced refetch
3. Export report → Generate PDF/CSV server-side → Download
```

---

## Custom Components to Build

Beyond shadcn/ui base components, these custom components are needed:

### 1. **TimeSlotPicker**
- **Base**: RadioGroup + ScrollArea
- **Purpose**: Display available time slots with visual indicators
- **Features**:
  - Disabled slots (booked/outside schedule)
  - Highlighted selected slot
  - "Almost full" warning badges
  - Mobile-optimized grid layout

### 2. **DoctorSelectionCard**
- **Base**: Card + Avatar + Select
- **Purpose**: Rich doctor selection interface
- **Features**:
  - Doctor photo, name, specialization
  - Availability indicator
  - Bio preview (expandable)
  - Booking count indicator

### 3. **BookingSummaryCard**
- **Base**: Card + Badge
- **Purpose**: Display booking confirmation details
- **Features**:
  - QR code (for check-in)
  - Booking reference number
  - Countdown to appointment
  - Add to calendar button

### 4. **PaymentInstructionCard**
- **Base**: Card + Alert + Tabs
- **Purpose**: Display payment method instructions
- **Features**:
  - QRIS QR code display
  - Bank account details (copyable)
  - Credit card form integration
  - Payment timer countdown

### 5. **ScheduleCalendarView**
- **Base**: Calendar + Table + ToggleGroup
- **Purpose**: Weekly doctor schedule editor
- **Features**:
  - Drag-and-drop time blocks
  - Visual time slot grid
  - Conflict detection
  - Bulk operations

### 6. **RevenueMetricsGrid**
- **Base**: Card + Badge + Table
- **Purpose**: Owner financial dashboard
- **Features**:
  - Large number displays
  - Comparison with previous period
  - Trend indicators (up/down arrows)
  - Drill-down capability

### 7. **BookingStatusBadge**
- **Base**: Badge (custom styling)
- **Purpose**: Visual status indicators
- **Variants**:
  - Pending (yellow)
  - Confirmed (blue)
  - Paid (green)
  - Completed (gray)
  - Cancelled (red)
  - No-Show (orange)

### 8. **FilterBar**
- **Base**: Combination of Select, Popover, Input
- **Purpose**: Unified filtering interface
- **Features**:
  - Multi-filter support
  - Clear all filters button
  - Active filter count badge
  - Saved filter presets

### 9. **WhatsAppNotificationPreview**
- **Base**: Card + Alert
- **Purpose**: Preview WhatsApp notification content
- **Features**:
  - Message template preview
  - Variable interpolation
  - Send test notification
  - Delivery status indicator

### 10. **MobileBookingStepper**
- **Base**: Progress + Tabs (hidden)
- **Purpose**: Visual progress through booking steps
- **Features**:
  - Step indicators (1/5, 2/5, etc.)
  - Back/Next navigation
  - Step validation
  - Mobile-optimized layout

---

## Modal/Dialog Use Cases

### Critical Dialogs (Must Have - MVP)

1. **Booking Confirmation Dialog**
   - Triggers: After successful booking submission
   - Purpose: Display booking summary and confirmation
   - Actions: "Close", "Add to Calendar", "Share via WhatsApp"

2. **Payment Instructions Dialog**
   - Triggers: After fast-track booking type selection
   - Purpose: Display payment method options and instructions
   - Actions: "I've Paid", "Cancel", "Change Method"

3. **Status Update Dialog**
   - Triggers: Admin clicks "Change Status" in booking list
   - Purpose: Update booking status with notes
   - Actions: "Update", "Cancel"

4. **Delete Confirmation Dialog (Alert Dialog)**
   - Triggers: Admin attempts to delete doctor/booking
   - Purpose: Prevent accidental deletions
   - Actions: "Delete", "Cancel"

5. **Add/Edit Doctor Dialog**
   - Triggers: Admin clicks "Add Doctor" or "Edit" in doctor list
   - Purpose: CRUD operations for doctor data
   - Actions: "Save", "Cancel"

6. **Schedule Configuration Dialog**
   - Triggers: Admin clicks "Add Schedule" or edits existing schedule
   - Purpose: Set up doctor working hours and holidays
   - Actions: "Save Schedule", "Cancel"

7. **Login Session Expired Dialog**
   - Triggers: JWT token expiration detected
   - Purpose: Notify admin of session timeout
   - Actions: "Re-login", "Close"

### Secondary Dialogs (Nice to Have)

8. **Booking Details View (Sheet on Mobile, Dialog on Desktop)**
   - Triggers: Click on booking in list
   - Purpose: View full booking information
   - Actions: "Edit", "Cancel Booking", "Contact Patient", "Close"

9. **Export Report Dialog**
   - Triggers: Owner clicks "Export" in reports section
   - Purpose: Configure export parameters
   - Actions: "Export PDF", "Export CSV", "Cancel"

10. **WhatsApp Message Preview Dialog**
    - Triggers: Admin wants to test notification
    - Purpose: Preview and send test WhatsApp message
    - Actions: "Send Test", "Close"

---

## Toast/Notification Patterns

### Success Toasts
- **Booking Created**: "Appointment booked successfully! Check WhatsApp for confirmation."
- **Payment Confirmed**: "Payment received. Your appointment is confirmed!"
- **Doctor Added**: "Doctor [Name] added successfully."
- **Schedule Saved**: "Schedule updated for Dr. [Name]."
- **Status Updated**: "Booking status changed to [Status]."

### Error Toasts
- **Booking Failed**: "Failed to create booking. Please try again."
- **Slot Unavailable**: "This time slot is no longer available. Please choose another."
- **Payment Failed**: "Payment verification failed. Please check payment details."
- **Form Validation**: "Please fill all required fields correctly."
- **Network Error**: "Connection error. Please check your internet."

### Warning Toasts
- **Session Expiring**: "Your session will expire in 5 minutes."
- **Slot Almost Full**: "Only 2 slots remaining for this time."
- **Unsaved Changes**: "You have unsaved changes. Save before leaving?"

### Info Toasts
- **Auto-Save**: "Changes saved automatically."
- **Loading**: "Loading booking data..."
- **WhatsApp Sent**: "Reminder sent to patient via WhatsApp."

---

## Component Variations Needed

### Button Variants
- **default**: Primary actions (Submit, Save, Confirm)
- **destructive**: Delete, Cancel booking
- **outline**: Secondary actions (Cancel, Back)
- **secondary**: Tertiary actions (View Details)
- **ghost**: Icon buttons in tables
- **link**: Text links in cards

### Badge Variants
- **default**: General labels
- **secondary**: Less important info
- **destructive**: Cancelled, Failed status
- **outline**: Neutral info
- **success**: Completed, Paid, Confirmed (custom)
- **warning**: Pending, Almost Full (custom)

### Alert Variants
- **default**: General information
- **destructive**: Critical errors
- **warning**: Important notices (custom)
- **info**: Helpful tips (custom)

### Card Variants
- **default**: Standard content containers
- **elevated**: Important metrics (custom with shadow)
- **outlined**: Secondary information (custom)

---

## Implementation Priorities for MVP

### Phase 1: Core Booking Flow (Week 1-2)
**Priority: CRITICAL**

Components:
- Form, Input, Textarea, Label, Button
- Select, RadioGroup, Checkbox
- Calendar, Popover
- Card, Badge
- Dialog, Toast
- Progress

Pages:
- Patient booking interface (all steps)
- Basic booking confirmation

### Phase 2: Admin Foundation (Week 3-4)
**Priority: CRITICAL**

Components:
- Table (with sorting/filtering)
- NavigationMenu, Sheet
- DropdownMenu, Separator
- Avatar, Tooltip
- AlertDialog
- Tabs

Pages:
- Login page
- Dashboard layout with sidebar
- Bookings list page
- Basic doctor management

### Phase 3: Schedule Management (Week 5-6)
**Priority: HIGH**

Components:
- Calendar (advanced features)
- Toggle, ToggleGroup
- ScrollArea
- Accordion
- Alert

Pages:
- Schedule configuration page
- Doctor schedule editor
- Holiday management

### Phase 4: Owner Analytics (Week 7-8)
**Priority: HIGH**

Components:
- Enhanced Tables (with export)
- Advanced Cards (metrics)
- Additional Chart components (if needed)

Pages:
- Revenue reports
- Commission breakdown
- Analytics dashboard

### Phase 5: Polish & Enhancement (Week 9-10)
**Priority: MEDIUM**

Components:
- Skeleton (loading states)
- HoverCard
- Command (optional)
- ContextMenu (optional)

Features:
- Loading states throughout
- Error boundaries
- Accessibility audit
- Mobile responsiveness refinement
- Performance optimization

---

## Data Visualization Components

While shadcn/ui doesn't include chart components by default, integrate these libraries:

### Recommended: Recharts (pairs well with shadcn)
- **Bar Chart**: Revenue per doctor comparison
- **Line Chart**: Booking trends over time
- **Pie Chart**: Fast-track vs Regular booking distribution
- **Area Chart**: Revenue trend with projection

### Implementation Pattern
```typescript
// Wrap Recharts components with shadcn Card for consistency
<Card>
  <CardHeader>
    <CardTitle>Revenue Trends</CardTitle>
    <CardDescription>Monthly revenue comparison</CardDescription>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueData}>
        {/* Chart configuration */}
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

---

## Mobile-Specific Considerations

### Patient Booking Interface (Mobile-First)
1. **Full-screen experience**: No desktop sidebar, minimal header
2. **Large touch targets**: Minimum 48x48px for all interactive elements
3. **Step-by-step flow**: Single-column layout, one step visible at a time
4. **Bottom action buttons**: Submit/Next buttons at bottom for thumb reach
5. **Sheet for secondary actions**: Use Sheet component for menus and details

### Admin Dashboard (Mobile-Responsive)
1. **Sheet-based navigation**: Hamburger menu triggering Sheet with navigation
2. **Stacked cards**: Dashboard metrics stack vertically on mobile
3. **Horizontal scrolling tables**: Wrap tables in ScrollArea for mobile
4. **Bottom sheet actions**: Use Sheet for booking details on mobile
5. **Simplified filters**: Collapse filter bar into Sheet on mobile

---

## Testing Strategy

### Component Testing
- **Unit tests**: Each shadcn component wrapper with custom logic
- **Integration tests**: Multi-step booking flow
- **Accessibility tests**: axe-core for WCAG compliance

### User Flow Testing
1. **Patient booking flow** (mobile device simulation)
2. **Admin booking management** (desktop)
3. **Owner report generation** (desktop)
4. **Payment gateway integration** (sandbox)
5. **WhatsApp notification trigger** (test environment)

### Browser/Device Testing
- **Mobile**: iOS Safari, Chrome Android
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Tablet**: iPad Safari, Android tablets

---

## Performance Considerations

### Optimization Strategies
1. **Code splitting**: Lazy load admin/owner dashboards
2. **Virtual scrolling**: Use @tanstack/react-virtual for large booking tables
3. **Debounced search**: 300ms delay for search/filter inputs
4. **Optimistic updates**: Immediate UI feedback before API confirmation
5. **Image optimization**: Next.js Image for doctor photos
6. **Calendar optimization**: Only load 2 months of data at a time

### Bundle Size Management
- Import shadcn components individually (tree-shakeable)
- Use dynamic imports for heavy components (Calendar, Table)
- Compress images, use WebP format
- Minimize third-party dependencies

---

## Security Considerations

### Component-Level Security
1. **Form validation**: Client + server-side validation (never trust client)
2. **XSS prevention**: Sanitize user inputs in Textarea, Input
3. **CSRF tokens**: Include in all form submissions
4. **Rate limiting**: Implement on booking submission endpoint
5. **Payment data**: Never store credit card details client-side

### Authentication & Authorization
1. **JWT tokens**: Store in httpOnly cookies (not localStorage)
2. **Role-based UI**: Hide owner-only components from admin role
3. **Session timeout**: Dialog warning before auto-logout
4. **Protected routes**: Redirect to login if unauthenticated

---

## Internationalization (i18n) - Post-MVP

While not in MVP scope, prepare for:
- shadcn components support for RTL layouts
- All user-facing strings extracted to translation files
- Date/time formatting based on locale
- Currency formatting for financial reports
- WhatsApp message templates in multiple languages

---

## Deployment Checklist

### Pre-Deployment Component Audit
- [ ] All shadcn components installed: `npx shadcn-ui@latest add [component]`
- [ ] Custom components tested in isolation
- [ ] All forms validated (client + server)
- [ ] All dialogs have proper close handlers
- [ ] All toasts have appropriate durations
- [ ] Loading states implemented (Skeleton)
- [ ] Error boundaries around key sections
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Mobile responsiveness verified
- [ ] Dark mode support (optional, post-MVP)

---

## Component Dependencies Map

```
Core Dependencies (Must install first):
1. Form → react-hook-form, @hookform/resolvers, zod
2. Calendar → date-fns or dayjs
3. Popover → @radix-ui/react-popover
4. Dialog → @radix-ui/react-dialog
5. Toast → @radix-ui/react-toast

Secondary Dependencies:
6. Table → @tanstack/react-table (for sorting/filtering)
7. Select → @radix-ui/react-select
8. RadioGroup → @radix-ui/react-radio-group
9. Checkbox → @radix-ui/react-checkbox
10. NavigationMenu → @radix-ui/react-navigation-menu

Tertiary Dependencies:
11. Charts → recharts
12. File Upload → react-dropzone (for doctor photos)
13. Date Range → date-fns/locale (for Indonesian locale)
14. Virtual Scrolling → @tanstack/react-virtual (optional)
```

---

## Summary: MVP Component Checklist

**Total shadcn Components Required: 32**

### Critical Path (13 components) - Block MVP without these:
- [x] Form (+ related: FormField, FormLabel, etc.)
- [x] Input
- [x] Select
- [x] RadioGroup
- [x] Button
- [x] Calendar
- [x] Popover
- [x] Card
- [x] Badge
- [x] Dialog
- [x] Toast
- [x] Table
- [x] NavigationMenu

### High Priority (11 components) - Severely degraded UX without these:
- [x] Textarea
- [x] Checkbox
- [x] Label
- [x] Tabs
- [x] Sheet
- [x] AlertDialog
- [x] Alert
- [x] DropdownMenu
- [x] Avatar
- [x] Progress
- [x] Separator

### Medium Priority (5 components) - Can launch MVP without, but recommended:
- [ ] Tooltip
- [ ] Skeleton
- [ ] ScrollArea
- [ ] Toggle
- [ ] Accordion

### Low Priority (3 components) - Post-MVP enhancements:
- [ ] Command
- [ ] ContextMenu
- [ ] HoverCard

---

## Next Steps

1. **Initialize shadcn/ui in project**
   ```bash
   npx shadcn-ui@latest init
   ```

2. **Install Critical Path components first**
   ```bash
   npx shadcn-ui@latest add form input select radio-group button calendar popover card badge dialog toast table navigation-menu
   ```

3. **Set up form validation**
   ```bash
   npm install react-hook-form @hookform/resolvers zod
   ```

4. **Install High Priority components**
   ```bash
   npx shadcn-ui@latest add textarea checkbox label tabs sheet alert-dialog alert dropdown-menu avatar progress separator
   ```

5. **Begin Patient Booking Interface implementation**
   - Create multi-step form structure
   - Integrate Calendar for date selection
   - Build TimeSlotPicker custom component
   - Implement payment method RadioGroup

6. **Create design system documentation**
   - Document custom component variants
   - Define color palette for status badges
   - Establish spacing/sizing standards
   - Create component usage guidelines

---

## Questions for Stakeholders

Before implementation, clarify:

1. **Payment Gateway**: Which provider? (Midtrans, Xendit, other?)
2. **WhatsApp API**: Direct Business API or third-party (WATI, Twilio)?
3. **Branding**: Logo, color scheme, font preferences?
4. **Fast-Track Pricing**: Fixed fee or percentage of consultation?
5. **Commission Model**: Fixed 20% or configurable per doctor?
6. **Multi-clinic**: Single clinic only for MVP, or multi-tenant from start?
7. **Backup Notification**: SMS fallback if WhatsApp fails?
8. **Data Retention**: How long to keep historical booking data?
9. **Payment Verification**: Manual verification option if auto-callback fails?
10. **Doctor Photos**: Required or optional? Default avatar if not provided?

---

## Conclusion

This requirements document provides a comprehensive roadmap for implementing the JanjiTemu clinic appointment booking system using shadcn/ui components. The phased approach ensures a functional MVP can be delivered in 8-10 weeks, with clear priorities and implementation guidance.

**Key Takeaways:**
- **32 shadcn/ui components** identified across three interfaces
- **13 critical components** form the MVP foundation
- **Mobile-first patient experience** with desktop-optimized admin panels
- **10 custom components** to build on shadcn base components
- **Clear validation, accessibility, and security requirements**
- **Phased implementation plan** with realistic timelines

The component hierarchy diagrams, data flow patterns, and validation schemas provide developers with concrete implementation guidance, while the accessibility and performance considerations ensure a production-ready application.
