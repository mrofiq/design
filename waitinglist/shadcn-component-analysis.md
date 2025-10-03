# shadcn/ui Component Analysis
## Waiting List SaaS Platform - Complete Component Implementation Guide

**Document Version:** 1.0
**Last Updated:** October 3, 2025
**Purpose:** Comprehensive shadcn/ui component mapping, configuration, and installation guide

---

## Table of Contents

1. [Complete Component List](#1-complete-component-list)
2. [Component Configuration Requirements](#2-component-configuration-requirements)
3. [Missing Component Identification](#3-missing-component-identification)
4. [Implementation Priority](#4-implementation-priority)
5. [Component Dependencies](#5-component-dependencies)
6. [Installation Commands](#6-installation-commands)

---

## 1. Complete Component List

### 1.1 Owner/Admin Interface Components

| Component | Usage Context | Frequency |
|-----------|--------------|-----------|
| **Button** | Primary CTAs, action buttons, form submissions | High |
| **Card** | Feature cards, stats cards, form containers, QR link card | High |
| **Badge** | Status indicators, "Gratis", "Mudah", "Cepat" labels, "Premium" features | High |
| **Input** | Text inputs, email/phone fields, search bars | High |
| **Tabs** | Registration method (HP/Email), Settings sections | Medium |
| **Checkbox** | Terms acceptance, "Remember me" | Medium |
| **Label** | Form field labels | High |
| **Form** | Form wrappers with validation | High |
| **Alert** | Welcome banner, info messages, error messages | Medium |
| **Tooltip** | Helpful hints, onboarding guidance | Low |
| **Navigation** | Top navbar, mobile menu | High |
| **Table** | Queue management table | High |
| **DropdownMenu** | Action menus per queue, user menu | High |
| **Dialog** | Confirmation modals (cancel, complete queue) | Medium |
| **Toast** | Success/error notifications | High |
| **Separator** | Visual dividers in lists | Low |
| **Select** | Dropdowns for settings, filters | Medium |

### 1.2 Staff Interface Components

| Component | Usage Context | Frequency |
|-----------|--------------|-----------|
| **Card** | Login container, queue cards (mobile), stats display | High |
| **Input** | Login fields, search bar | High |
| **Button** | Login, "Call Next", action buttons | High |
| **Checkbox** | "Remember me" | Low |
| **Label** | Form labels | Medium |
| **Badge** | Status indicators (Waiting/Called/Completed), stats | High |
| **DropdownMenu** | Action menus, user menu, filters | High |
| **Dialog** | Confirmation dialogs (complete, cancel, no-show) | Medium |
| **Toast** | Real-time notifications | High |
| **Separator** | Visual dividers | Low |
| **DatePicker** | Date range for statistics, history filter | Medium |
| **Select** | Status filter, sort options, cancellation reasons | Medium |
| **Pagination** | History page navigation | Low |

### 1.3 Visitor/Customer Interface Components

| Component | Usage Context | Frequency |
|-----------|--------------|-----------|
| **Card** | Registration form, status display, error messages | High |
| **Input** | Name, phone number fields | High |
| **Button** | Number selector (party size), submit, cancel | High |
| **Label** | Form labels | Medium |
| **Form** | Registration form wrapper | High |
| **Alert** | Called notification, error messages, info boxes | High |
| **Badge** | Status indicator, queue position | Medium |
| **Progress** | Optional progress ring for wait time | Low |
| **Dialog** | Cancellation confirmation | Low |
| **Toast** | Quick notifications | Low |

### 1.4 QR Display Interface Components

| Component | Usage Context | Frequency |
|-----------|--------------|-----------|
| **Card** | QR code container | High |
| **Badge** | Status indicators (online/offline, auto-refresh) | Medium |
| **Alert** | Error messages (QR failed to load) | Low |
| **Button** | Refresh button (error state) | Low |

---

## 2. Component Configuration Requirements

### 2.1 Button Component

**Variants Required:**
```typescript
// Size variants
sizes: {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  xl: "h-14 px-10 text-lg", // For prominent CTAs
  icon: "h-10 w-10"
}

// Color variants
variants: {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  success: "bg-green-600 text-white hover:bg-green-700", // Custom for "Complete"
}
```

**Custom Styling:**
- Loading state with spinner
- Disabled state with cursor-not-allowed
- Scale animation on hover (1.02x)
- "Call Next" button: Extra large with pulse animation
- Keyboard shortcut support (spacebar for "Call Next")

**Composite Patterns:**
- Button group for party size selector (1-6+)
- Icon buttons for actions (edit, delete, more)
- Split buttons for primary action + dropdown

**Animation Requirements:**
- Hover: darken + slight scale
- Active: scale down (0.98)
- Loading: spinner rotation
- Success: brief checkmark animation

---

### 2.2 Card Component

**Variants Required:**
```typescript
variants: {
  default: "border bg-card text-card-foreground shadow-sm",
  elevated: "shadow-md hover:shadow-lg transition-shadow",
  interactive: "hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer",
  highlighted: "border-2 border-primary shadow-lg", // QR link card
}
```

**Custom Styling:**
- Gradient border for highlighted cards
- Pulsing glow animation for QR display card
- Zebra striping for alternating rows
- Left border accent (4px) for active/called queues

**Composite Patterns:**
- Card with header, body, footer sections
- Stats cards with icon, value, label
- Form cards with padding and rounded corners
- Queue cards (mobile view) with status badge

**Animation Requirements:**
- Hover: shadow increase, slight lift (translateY -4px)
- New queue: slide-in from top, yellow flash
- Queue complete: fade out and slide up

---

### 2.3 Input Component

**Variants Required:**
```typescript
types: {
  text: "default",
  email: "with email validation icon",
  tel: "with numeric keyboard on mobile",
  password: "with toggle show/hide button",
  search: "with search icon and clear button",
}

states: {
  default: "border-input",
  focus: "border-primary ring-2 ring-primary/20",
  error: "border-destructive ring-2 ring-destructive/20",
  success: "border-green-500 ring-2 ring-green-500/20",
  disabled: "bg-muted cursor-not-allowed",
}
```

**Custom Styling:**
- Character counter for text inputs
- Auto-format for phone numbers (hyphen insertion)
- Prefix support (+62 for phone)
- Icon positioning (left and right)
- Minimum touch target: 44×44px on mobile

**Composite Patterns:**
- Input with label and helper text
- Input with validation icons (checkmark/x)
- Input with inline button (search)
- OTP inputs: 6 individual boxes with auto-advance

**Animation Requirements:**
- Focus: blue glow effect
- Error: gentle shake animation
- Success: checkmark fade-in

---

### 2.4 Badge Component

**Variants Required:**
```typescript
variants: {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "border border-input",

  // Status-specific variants
  waiting: "bg-yellow-100 text-yellow-900 border-yellow-200",
  called: "bg-green-100 text-green-900 border-green-200",
  completed: "bg-gray-200 text-gray-700",

  // Info badges
  premium: "bg-purple-100 text-purple-900 border-purple-200",
  free: "bg-blue-100 text-blue-900",
}

sizes: {
  sm: "text-xs px-2 py-0.5",
  default: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
}
```

**Custom Styling:**
- Pill shape (border-radius: 16px)
- Optional icon support (emoji or icon component)
- Pulse animation for "called" status
- Number badges with circular background

**Animation Requirements:**
- Status change: color transition (300ms)
- Called status: pulsing glow effect
- Count increment: smooth number transition

---

### 2.5 Table Component

**Configuration:**
```typescript
features: {
  sortable: true, // Column headers with sort icons
  selectable: false, // Row selection (Phase 2)
  hoverable: true, // Row hover effects
  responsive: true, // Convert to cards on mobile
}

styling: {
  headerBackground: "bg-muted/50",
  rowHeight: "h-20", // Spacious for quick scanning
  alternateRows: true, // Zebra striping
  borderStyle: "border-b border-border",
}
```

**Custom Requirements:**
- Virtual scrolling for >50 rows
- Fixed header on scroll
- Responsive: Table → Card view on mobile
- Column resize support (Phase 2)
- Sticky first column (Phase 2)

**Composite Patterns:**
- Table with action column (dropdown menu)
- Table with status badges
- Table with search/filter header
- Table with pagination footer

**Animation Requirements:**
- Row hover: background change + shadow
- Row insert: slide-in from top
- Row remove: fade out + slide up
- Sort: smooth reordering

---

### 2.6 Dialog/Modal Component

**Variants Required:**
```typescript
sizes: {
  sm: "max-w-sm",
  default: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
}

types: {
  default: "Standard modal",
  alert: "Alert dialog with icon",
  confirm: "Confirmation with two actions",
}
```

**Custom Styling:**
- Semi-transparent dark overlay
- Center positioning
- Warning/destructive theme for cancel dialogs
- Success theme for complete dialogs
- Auto-focus on appropriate button

**Animation Requirements:**
- Open: fade + scale from center
- Close: fade out
- Shake on validation error

**Accessibility:**
- ESC key to close
- Enter to confirm (when appropriate)
- Focus trap within modal
- ARIA labels and roles

---

### 2.7 Toast/Notification Component

**Variants Required:**
```typescript
variants: {
  default: "bg-background border",
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  warning: "bg-orange-500 text-white",
  info: "bg-blue-600 text-white",
}

positions: {
  topRight: "top-4 right-4",
  topLeft: "top-4 left-4",
  bottomRight: "bottom-4 right-4", // Default for staff
  bottomLeft: "bottom-4 left-4",
  topCenter: "top-4 left-1/2 -translate-x-1/2",
}
```

**Configuration:**
- Duration: 3-5 seconds (dismissible)
- Max stack: 3 toasts
- Auto-dismiss with progress bar
- Click to dismiss
- Swipe to dismiss (mobile)

**Animation Requirements:**
- Enter: slide-in from right + fade
- Exit: slide-out + fade
- Stack management: shift existing toasts

---

### 2.8 Tabs Component

**Configuration:**
```typescript
variants: {
  default: "border-b",
  pills: "bg-muted rounded-md", // For settings pages
  underline: "border-b-2 border-primary", // Active indicator
}

behavior: {
  orientation: "horizontal" | "vertical",
  defaultValue: "tab1",
  activationMode: "automatic" | "manual",
}
```

**Usage Contexts:**
- Registration: HP vs Email verification
- Settings: Restaurant, System, Account
- Stats: Daily, Weekly, Monthly

**Animation Requirements:**
- Tab switch: smooth content transition (200ms)
- Active indicator: slide animation

---

### 2.9 Form Component

**Features Required:**
- React Hook Form integration
- Zod schema validation
- Real-time validation (on blur)
- Server-side validation handling
- Field error display
- Success indicators

**Composite Pattern:**
```jsx
<Form>
  <FormField>
    <FormLabel />
    <FormControl>
      <Input />
    </FormControl>
    <FormDescription />
    <FormMessage />
  </FormField>
</Form>
```

**Validation Behavior:**
- Inline error messages below fields
- Visual indicators: red/green borders
- Icon feedback: checkmark/x
- Scroll to first error on submit
- ARIA announcements for errors

---

### 2.10 Select/Dropdown Component

**Variants Required:**
```typescript
types: {
  single: "Single selection",
  multiple: "Multiple selection (Phase 2)",
  searchable: "With search input",
}

styling: {
  trigger: "border input styling",
  content: "shadow-lg max-h-96 overflow-auto",
  item: "hover:bg-accent cursor-pointer",
}
```

**Usage Contexts:**
- Settings: Time preferences, language
- Filters: Status filter, date range
- Party size: 6+ custom input
- Cancellation reasons dropdown

**Animation Requirements:**
- Dropdown open: fade + scale from trigger
- Item hover: background change
- Selection: checkmark animation

---

### 2.11 Alert Component

**Variants Required:**
```typescript
variants: {
  default: "bg-background border",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
  warning: "bg-orange-50 text-orange-900 border-orange-200",
  success: "bg-green-50 text-green-900 border-green-200",
  info: "bg-blue-50 text-blue-900 border-blue-200",
}

types: {
  static: "Non-dismissible",
  dismissible: "With close button",
}
```

**Usage Contexts:**
- Welcome banner (dismissible)
- Email verification instructions
- Offline warning banner
- Error messages
- Called notification (full-screen variant)

**Custom Variants:**
- Full-screen alert for visitor "called" state
- Gradient background with pulse animation
- Sound + vibration triggers

---

### 2.12 Navigation Component

**Configuration:**
```typescript
layouts: {
  desktop: "Horizontal navbar with menu items",
  mobile: "Drawer sidebar with hamburger",
}

components: {
  logo: "Left-aligned, 32px height",
  menuItems: "Text links with active state",
  userMenu: "Dropdown with avatar",
  actions: "Settings, logout buttons",
}
```

**Responsive Behavior:**
- Desktop (>1024px): Full horizontal nav
- Mobile (<1024px): Hamburger + drawer

**Active State:**
- Blue underline for current page
- Background highlight
- Icon + text combination

**Animation Requirements:**
- Mobile drawer: slide-in from left
- Dropdown menus: fade + scale

---

### 2.13 Date Picker Component

**Features Required:**
- Single date selection
- Date range selection
- Preset ranges (Today, Yesterday, Last 7 days, Last 30 days)
- Time zone awareness (WIB)
- Keyboard navigation
- Mobile-friendly calendar

**Usage Contexts:**
- Statistics page: Date range filter
- History page: Date filter
- Reports generation (Phase 2)

**Styling:**
- Calendar popup with shadow
- Selected dates highlighted
- Disabled dates (future) grayed out
- Range selection with connecting background

---

### 2.14 Pagination Component

**Configuration:**
```typescript
variants: {
  default: "Standard numbered pagination",
  simple: "Previous/Next only",
  compact: "Dots with page numbers",
}

features: {
  showPageNumbers: true,
  showPreviousNext: true,
  showFirstLast: true,
  itemsPerPageSelector: true,
}
```

**Usage Context:**
- History page: 50 items per page
- Long queue lists (fallback to virtual scroll)

---

### 2.15 Tooltip Component

**Configuration:**
```typescript
positions: {
  top: "default",
  bottom: "alternate",
  left: "for right-aligned elements",
  right: "for left-aligned elements",
}

triggers: {
  hover: "default",
  click: "for touch devices",
  focus: "for keyboard navigation",
}
```

**Usage Contexts:**
- Onboarding: "Click to copy link"
- Icon buttons: Action descriptions
- Stats: Detailed metric explanations
- Abbreviations: Full text on hover

**Styling:**
- Dark background, white text
- Arrow pointing to target
- Max-width: 250px
- Delay: 500ms on hover

---

### 2.16 Separator Component

**Variants:**
```typescript
orientations: {
  horizontal: "default",
  vertical: "for inline separators",
}

styles: {
  default: "border-border",
  dashed: "border-dashed",
  thick: "border-2",
}
```

**Usage Contexts:**
- Dividing sections in forms
- Between stats in stats bar
- Between menu items

---

### 2.17 Progress Component

**Variants Required:**
```typescript
types: {
  linear: "Progress bar",
  circular: "Ring progress (for visitor wait time)",
}

styles: {
  default: "bg-primary",
  success: "bg-green-600",
  warning: "bg-orange-500",
  error: "bg-red-600",
}
```

**Usage Contexts:**
- Visitor: Wait time progress ring (optional)
- File uploads (Phase 2)
- Multi-step forms progress indicator

---

## 3. Missing Component Identification

### 3.1 Components NOT in shadcn/ui (Need Custom Implementation)

#### 3.1.1 OTP Input Component
**Requirement:** 6-digit OTP verification (Owner registration)

**Features Needed:**
- 6 individual input boxes
- Auto-focus on page load
- Auto-advance to next box on input
- Auto-backspace on delete
- Paste support (auto-fill all boxes)
- Keyboard navigation (arrow keys)
- Monospace font, large size (32px)
- Error state: shake animation

**Implementation Approach:**
```typescript
// Build on shadcn Input component
// Create custom OTPInput component
// Use refs for focus management
// Use state for value management
// Add paste event handler
```

**Recommended Libraries:**
- react-otp-input (if time-constrained)
- Or custom build using shadcn Input as base

---

#### 3.1.2 Number Selector (Button Group)
**Requirement:** Party size selector (1-6+ buttons)

**Features Needed:**
- Horizontal button group
- Single selection (radio behavior)
- Touch-friendly (56×56px buttons)
- Active state styling
- "6+" button opens modal with stepper
- Responsive: wrap to 2 rows on mobile

**Implementation Approach:**
```typescript
// Use shadcn Button component
// Create custom ButtonGroup wrapper
// Add RadioGroup logic
// Create Stepper modal for 6+ selection
```

---

#### 3.1.3 QR Code Generator Component
**Requirement:** Dynamic QR code display

**Features Needed:**
- Generate QR from URL/token
- Auto-refresh every 30 seconds
- Smooth transition animation on refresh
- Error correction: High (30%)
- Customizable size
- PNG or SVG output

**Implementation Approach:**
```typescript
// Use qrcode.react library
// Wrap in shadcn Card component
// Add auto-refresh logic with useEffect
// Add fade transition on update
```

**Recommended Library:**
- qrcode.react (React component)
- qrcode-generator (if need server-side)

---

#### 3.1.4 Real-time Connection Status Indicator
**Requirement:** Show WebSocket connection status

**Features Needed:**
- Color-coded dot (green/yellow/red)
- Tooltip on hover
- Pulse animation when reconnecting
- Automatic reconnection handling

**Implementation Approach:**
```typescript
// Build using shadcn Badge component
// Add custom ConnectionStatus component
// Integrate with Socket.io client
// Add useWebSocket hook for state
```

---

#### 3.1.5 Empty State Component
**Requirement:** Display when no queues exist

**Features Needed:**
- Illustration/icon (200×200px)
- Heading and message
- Optional CTA button
- Centered layout
- Subtle floating animation

**Implementation Approach:**
```typescript
// Build using shadcn Card component
// Add custom EmptyState component
// Use react-icons or lucide-react for icons
// Add CSS animation for floating effect
```

---

#### 3.1.6 Stats Card Component
**Requirement:** KPI display cards

**Features Needed:**
- Large value (48px, bold)
- Label text
- Icon
- Comparison indicator (arrow up/down)
- Color coding (green/red for good/bad)
- Hover effect

**Implementation Approach:**
```typescript
// Build using shadcn Card component
// Create custom StatsCard wrapper
// Add icon support (lucide-react)
// Add trend calculation logic
```

---

#### 3.1.7 Screen Wake Lock Component
**Requirement:** Keep QR display screen awake

**Features Needed:**
- Use Wake Lock API
- Handle visibility changes
- Fallback for older browsers
- Silent video loop (iOS workaround)

**Implementation Approach:**
```typescript
// Create custom useWakeLock hook
// Handle browser compatibility
// Provide status indicator
```

**Browser API:**
```javascript
navigator.wakeLock.request('screen')
```

---

### 3.2 Third-Party Integrations Needed

#### 3.2.1 Chart Library
**Requirement:** Statistics visualization (Owner/Staff stats page)

**Recommended:**
- Recharts (React-friendly, composable)
- Or Chart.js (via react-chartjs-2)

**Charts Needed:**
- Line chart: Queue trends over time
- Bar chart: Queues per hour
- Pie chart: Cancellation reasons (Phase 2)

---

#### 3.2.2 Socket.io Client
**Requirement:** Real-time updates

**Implementation:**
```bash
npm install socket.io-client
```

**Features:**
- Auto-reconnection
- Room-based events
- Optimistic updates
- Connection status handling

---

#### 3.2.3 Form Validation
**Requirement:** Already specified (React Hook Form + Zod)

**Installation:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

---

#### 3.2.4 Date Handling
**Requirement:** Date formatting, timezone management

**Recommended:**
```bash
npm install date-fns
# Or
npm install dayjs
```

---

#### 3.2.5 Sound Notifications
**Requirement:** Visitor "called" notification sound

**Implementation:**
```typescript
// Use Web Audio API
const audio = new Audio('/notification.mp3');
audio.play();

// Or use react-use-audio-player
```

---

## 4. Implementation Priority

### 4.1 Critical (MVP - Must Have for Launch)

**Phase 1A: Core Authentication & Registration (Week 1-2)**
```bash
# Install order:
1. Form, Input, Label, Button, Checkbox
2. Card
3. Alert
4. Tabs
```

**Components:**
- Form (with validation)
- Input (text, email, tel, password)
- Button (primary, secondary, loading states)
- Card
- Label
- Checkbox
- Tabs (HP/Email verification)
- Alert (error messages)

**User Flows Enabled:**
- Owner registration
- Email/OTP verification
- Staff login

---

**Phase 1B: Dashboard & Queue Management (Week 2-3)**
```bash
# Install order:
1. Table
2. Badge
3. DropdownMenu
4. Dialog
5. Toast
6. Navigation
7. Separator
```

**Components:**
- Navigation (navbar)
- Table (queue list)
- Badge (status indicators)
- DropdownMenu (actions, filters)
- Dialog (confirmations)
- Toast (notifications)
- Separator

**User Flows Enabled:**
- Owner dashboard
- Staff queue management
- Real-time updates
- Call/complete/cancel actions

---

**Phase 1C: Visitor Registration & Status (Week 3-4)**
```bash
# Install order:
1. (Reuse Form, Input, Button, Card from Phase 1A)
2. Progress (optional)
```

**Components:**
- Form (registration)
- Button (party size selector - custom)
- Alert (called notification)
- Badge (status)
- Progress (wait time indicator - optional)

**Custom Components:**
- Number Selector (party size)
- Full-screen called alert

**User Flows Enabled:**
- QR code scan → register
- View queue status
- Receive call notification
- Cancel queue

---

**Phase 1D: QR Display (Week 4)**
```bash
# Install order:
1. (Reuse Card from Phase 1A)
2. Badge
```

**Components:**
- Card (QR container)
- Badge (status indicators)

**Custom Components:**
- QR Code Generator (using qrcode.react)
- Wake Lock handler

**User Flows Enabled:**
- Display QR code
- Auto-refresh QR
- Kiosk mode

---

### 4.2 Important (Phase 2 - Needed Soon)

**Phase 2A: Statistics & Analytics (Week 5-6)**
```bash
# Install order:
1. DatePicker (react-day-picker)
2. Select
3. Chart library (Recharts)
```

**Components:**
- DatePicker (date range)
- Select (filters)
- Card (KPI cards)

**Custom Components:**
- StatsCard
- Charts (line, bar)

**User Flows Enabled:**
- View statistics
- Filter by date
- Export reports (basic)

---

**Phase 2B: History & Search (Week 6)**
```bash
# Install order:
1. Pagination
2. (Reuse Input for search)
```

**Components:**
- Pagination
- Input (search)
- Table (history)

**User Flows Enabled:**
- View queue history
- Search past queues
- Filter by status

---

**Phase 2C: Settings & Preferences (Week 7)**
```bash
# Install order:
1. Select
2. (Reuse Tabs, Form, Input)
```

**Components:**
- Tabs (settings sections)
- Form (settings forms)
- Select (preferences)

**User Flows Enabled:**
- Update restaurant info
- Configure system settings
- Manage user preferences

---

### 4.3 Nice-to-Have (Phase 3 - Premium Features)

**Phase 3A: Multi-Restaurant Management (Week 8+)**
- Avatar component
- Command palette (quick actions)
- Combobox (restaurant switcher)

**Phase 3B: Advanced Features (Week 9+)**
- Slider (settings)
- Switch (toggles)
- Radio Group (preferences)
- Accordion (FAQ, help)
- Hover Card (rich tooltips)
- Context Menu (right-click actions)
- Calendar (full calendar view)

**Phase 3C: User Management (Premium)**
- Table with row selection
- Multi-select
- Drag and drop (reorder)
- Avatar group
- User role badges

---

## 5. Component Dependencies

### 5.1 Dependency Graph

```
Core Foundation (Install First):
├── Button
├── Card
├── Input
└── Label

Form Layer (Install Second):
├── Form (depends on: Label, Input, Button)
├── Checkbox
├── Select
└── Tabs

Feedback Layer (Install Third):
├── Alert
├── Toast
├── Dialog (depends on: Button)
└── Tooltip

Data Display (Install Fourth):
├── Table (depends on: Badge, DropdownMenu, Button)
├── Badge
└── Separator

Navigation (Install Fifth):
├── Navigation (depends on: Button, DropdownMenu)
└── DropdownMenu

Advanced (Install Last):
├── DatePicker (depends on: Button, Popover, Calendar)
├── Pagination (depends on: Button)
└── Progress
```

---

### 5.2 Shared Pattern Dependencies

**Form Validation Pattern:**
- Form component requires: react-hook-form, zod, @hookform/resolvers
- All form fields depend on Form component

**Real-time Updates Pattern:**
- Multiple components use WebSocket: Table, Badge, Toast
- Shared socket.io client instance
- Shared connection status indicator

**Responsive Pattern:**
- Table converts to Cards on mobile
- Navigation converts to Drawer on mobile
- Button sizes adjust based on breakpoints

**Animation Pattern:**
- Shared transition utilities
- Consistent easing functions
- Reusable animation keyframes

---

## 6. Installation Commands

### 6.1 shadcn/ui Initialization

```bash
# 1. Initialize shadcn/ui in your Next.js/React project
npx shadcn-ui@latest init

# Follow prompts:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind config: Yes
# - Import alias: @/components
```

---

### 6.2 Phase 1A: Core Components (Week 1-2)

```bash
# Authentication & Registration components
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add button
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add card
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add tabs

# Install form dependencies
npm install react-hook-form zod @hookform/resolvers
```

**Estimated Bundle Size:** ~25KB (gzipped)

---

### 6.3 Phase 1B: Dashboard Components (Week 2-3)

```bash
# Queue Management components
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add separator

# Navigation (requires dropdown-menu)
# Create custom navigation component using shadcn primitives

# Install real-time dependencies
npm install socket.io-client
```

**Estimated Bundle Size:** +30KB (gzipped)

---

### 6.4 Phase 1C: Visitor Components (Week 3-4)

```bash
# Visitor interface (reuses many components from Phase 1A)
# Only new component needed:
npx shadcn-ui@latest add progress

# Custom components to build:
# - NumberSelector (using Button component)
# - FullScreenAlert (using Alert component)
```

**Estimated Bundle Size:** +5KB (gzipped)

---

### 6.5 Phase 1D: QR Display (Week 4)

```bash
# QR Display components (reuses Card, Badge)

# Install QR code library
npm install qrcode.react

# No additional shadcn components needed
```

**Estimated Bundle Size:** +15KB (qrcode.react)

---

### 6.6 Phase 2A: Statistics Components (Week 5-6)

```bash
# Analytics components
npx shadcn-ui@latest add select
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add calendar

# Note: calendar is dependency for date-picker
# Build custom DateRangePicker using calendar + popover

# Install chart library
npm install recharts
# Or
npm install react-chartjs-2 chart.js

# Install date library
npm install date-fns
```

**Estimated Bundle Size:** +45KB (recharts)

---

### 6.7 Phase 2B: History & Search (Week 6)

```bash
# History page components
# Reuses: Table, Input, Badge from earlier phases

# Only new component:
# Build custom Pagination component or use a library
# shadcn doesn't have built-in pagination yet
```

---

### 6.8 Phase 3: Advanced Components (Week 8+)

```bash
# Premium/Advanced features
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add command
npx shadcn-ui@latest add combobox
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add hover-card
npx shadcn-ui@latest add context-menu
```

---

### 6.9 Complete Installation Script

**For Quick Setup (All MVP Components):**

```bash
#!/bin/bash
# install-shadcn-mvp.sh

# Initialize shadcn/ui (run once)
npx shadcn-ui@latest init

# Core components (Phase 1)
npx shadcn-ui@latest add form input label button checkbox card alert tabs

# Dashboard components (Phase 1)
npx shadcn-ui@latest add table badge dropdown-menu dialog toast separator

# Visitor components (Phase 1)
npx shadcn-ui@latest add progress

# Dependencies
npm install react-hook-form zod @hookform/resolvers socket.io-client qrcode.react date-fns

echo "MVP components installed successfully!"
```

**Make script executable:**
```bash
chmod +x install-shadcn-mvp.sh
./install-shadcn-mvp.sh
```

---

### 6.10 Component-by-Interface Installation

#### Owner/Admin Interface Only:
```bash
npx shadcn-ui@latest add form input label button checkbox card alert tabs
npx shadcn-ui@latest add table badge dropdown-menu dialog toast separator
npx shadcn-ui@latest add select

npm install react-hook-form zod @hookform/resolvers socket.io-client
```

#### Staff Interface Only:
```bash
npx shadcn-ui@latest add form input label button checkbox card badge
npx shadcn-ui@latest add dropdown-menu dialog toast separator select

npm install react-hook-form zod @hookform/resolvers socket.io-client date-fns
```

#### Visitor Interface Only:
```bash
npx shadcn-ui@latest add form input label button card alert badge progress

npm install react-hook-form zod @hookform/resolvers socket.io-client
```

#### QR Display Only:
```bash
npx shadcn-ui@latest add card badge alert

npm install qrcode.react
```

---

## 7. Configuration & Customization

### 7.1 Theme Configuration (tailwind.config.js)

```javascript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2563EB", // Blue for primary actions
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#64748B",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
        },
        // Status colors
        status: {
          waiting: "#FEF3C7",
          waitingText: "#92400E",
          called: "#D1FAE5",
          calledText: "#065F46",
          completed: "#E5E7EB",
          completedText: "#374151",
        }
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(37, 99, 235, 0.6)" },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "shake": "shake 0.3s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

### 7.2 Global CSS Variables (globals.css)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 217 91% 60%; /* #2563EB */
    --primary-foreground: 0 0% 100%;
    --secondary: 215 20% 65%;
    --secondary-foreground: 0 0% 100%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 217 91% 60%;
    --radius: 0.5rem;
  }
}
```

---

### 7.3 Custom Component Variants

**Button Variants Extension:**
```typescript
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium...",
  {
    variants: {
      variant: {
        // ... existing variants
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-orange-500 text-white hover:bg-orange-600",
      },
      size: {
        // ... existing sizes
        xl: "h-14 px-10 text-lg rounded-lg",
      }
    }
  }
)
```

---

## 8. Testing & Quality Assurance

### 8.1 Component Testing Checklist

**Per Component:**
- [ ] Renders correctly in all variants
- [ ] Responsive across breakpoints
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Focus management works
- [ ] Animations smooth (60fps)
- [ ] No console errors/warnings
- [ ] Props validation working

---

### 8.2 Integration Testing

**User Flows:**
- [ ] Complete registration flow (Owner)
- [ ] Login and queue management (Staff)
- [ ] Registration and status monitoring (Visitor)
- [ ] QR display and scanning

**Real-time Features:**
- [ ] New queue appears in staff dashboard
- [ ] Status updates reflect immediately
- [ ] Notifications trigger correctly
- [ ] Connection status accurate

---

### 8.3 Performance Benchmarks

**Bundle Size Targets:**
- Total (all components): < 150KB gzipped
- Initial load (critical path): < 50KB gzipped
- Code splitting by route

**Runtime Performance:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- Table rendering (50 rows): < 100ms
- Real-time update latency: < 500ms

---

## 9. Maintenance & Updates

### 9.1 Updating shadcn/ui Components

```bash
# Check for updates
npx shadcn-ui@latest diff

# Update specific component
npx shadcn-ui@latest add button --overwrite

# Update all components (be careful)
npx shadcn-ui@latest add --all --overwrite
```

---

### 9.2 Version Control

**Recommended Approach:**
- Commit shadcn components to your repo
- Track customizations separately
- Document all modifications
- Test thoroughly after updates

---

## 10. Summary & Quick Reference

### 10.1 MVP Component Count

| Interface | shadcn Components | Custom Components | Total |
|-----------|-------------------|-------------------|-------|
| Owner/Admin | 16 | 3 | 19 |
| Staff | 14 | 2 | 16 |
| Visitor | 10 | 2 | 12 |
| QR Display | 3 | 2 | 5 |

**Total Unique shadcn Components:** 19
**Total Custom Components:** 6

---

### 10.2 Essential Installation (One Command)

```bash
npx shadcn-ui@latest add form input label button checkbox card alert tabs table badge dropdown-menu dialog toast separator progress select && npm install react-hook-form zod @hookform/resolvers socket.io-client qrcode.react date-fns
```

---

### 10.3 Development Timeline

**Week 1-2:** Core authentication (Owner registration, Staff login)
**Week 2-3:** Queue management dashboard (Staff interface)
**Week 3-4:** Visitor registration and status
**Week 4:** QR display
**Week 5-6:** Statistics and analytics (Phase 2)
**Week 6+:** History, settings, premium features (Phase 2-3)

---

### 10.4 Key Takeaways

1. **shadcn/ui covers 85% of UI needs** - Only 6 custom components required
2. **Prioritize by user flow** - Install components in order of user journey
3. **Reuse extensively** - Same components across multiple interfaces
4. **Customize carefully** - Extend variants, don't fork components
5. **Test incrementally** - Validate each phase before moving forward

---

## Appendix A: Component Usage Matrix

| Component | Owner | Staff | Visitor | Display | Priority |
|-----------|-------|-------|---------|---------|----------|
| Button | ✓✓✓ | ✓✓✓ | ✓✓✓ | ✓ | Critical |
| Card | ✓✓✓ | ✓✓✓ | ✓✓✓ | ✓✓ | Critical |
| Input | ✓✓✓ | ✓✓ | ✓✓✓ | - | Critical |
| Form | ✓✓✓ | ✓✓ | ✓✓✓ | - | Critical |
| Badge | ✓✓ | ✓✓✓ | ✓✓ | ✓ | Critical |
| Table | ✓✓✓ | ✓✓✓ | - | - | Critical |
| Dialog | ✓✓ | ✓✓✓ | ✓ | - | Critical |
| Toast | ✓✓ | ✓✓✓ | ✓ | - | Critical |
| Alert | ✓✓ | ✓ | ✓✓✓ | ✓ | Critical |
| DropdownMenu | ✓✓✓ | ✓✓✓ | - | - | Critical |
| Label | ✓✓ | ✓✓ | ✓✓ | - | Critical |
| Tabs | ✓✓ | - | - | - | Critical |
| Checkbox | ✓ | ✓ | - | - | Critical |
| Select | ✓✓ | ✓✓ | - | - | Important |
| Separator | ✓ | ✓ | - | - | Important |
| Tooltip | ✓ | ✓ | - | - | Important |
| Progress | - | - | ✓ | - | Important |
| DatePicker | ✓ | ✓✓ | - | - | Important |
| Pagination | ✓ | ✓ | - | - | Nice-to-have |

**Legend:**
- ✓✓✓ = Heavy usage (>10 instances)
- ✓✓ = Medium usage (5-10 instances)
- ✓ = Light usage (<5 instances)
- \- = Not used

---

## Appendix B: Custom Component Specifications

### B.1 OTPInput Component

```typescript
interface OTPInputProps {
  length: number; // 6
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

// Usage
<OTPInput
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={handleVerify}
  error={hasError}
/>
```

### B.2 NumberSelector Component

```typescript
interface NumberSelectorProps {
  max: number; // 5
  value: number | null;
  onChange: (value: number) => void;
  allowCustom?: boolean; // For 6+
  customMax?: number; // 20
}

// Usage
<NumberSelector
  max={5}
  value={partySize}
  onChange={setPartySize}
  allowCustom={true}
  customMax={20}
/>
```

### B.3 QRCodeDisplay Component

```typescript
interface QRCodeDisplayProps {
  data: string; // URL to encode
  size: number; // 400-600px
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // Default: H
  refreshInterval?: number; // 30000ms
  onRefresh?: () => void;
}

// Usage
<QRCodeDisplay
  data={qrUrl}
  size={500}
  errorCorrectionLevel="H"
  refreshInterval={30000}
  onRefresh={handleRefresh}
/>
```

---

**End of Document**

---

**Next Steps:**
1. Review and approve component selections
2. Run installation script for Phase 1A
3. Set up component Storybook for design review
4. Begin implementing authentication flows
5. Schedule component review sessions with design team

**Questions? Issues?**
- Check shadcn/ui docs: https://ui.shadcn.com
- Review component examples in docs
- Test components in isolation before integration
- Consult with design team for customization needs
