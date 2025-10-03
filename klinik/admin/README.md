# Klinik Sehat - Admin Dashboard Prototype

Complete HTML/CSS/JavaScript prototype for the clinic admin dashboard.

## Overview

This is a fully functional HTML prototype implementing the admin dashboard for Klinik Sehat's appointment booking system. The prototype follows the specifications in `/webspec-admin.md` and features a modern banking app aesthetic with a cyan/turquoise theme.

## Project Structure

```
admin/
├── index.html                 # Entry point (auto-redirects)
├── login.html                 # Admin authentication page
├── dashboard.html             # Main dashboard with stats & today's bookings
├── bookings.html             # Bookings list with filters & pagination
├── doctors.html              # Doctor cards grid
├── doctor-form.html          # Create/edit doctor form
├── schedule.html             # Schedule management calendar
├── clinic-profile.html       # Clinic settings & profile
├── css/
│   ├── tokens.css            # Design tokens (colors, typography, spacing)
│   ├── components.css        # Reusable components (sidebar, tables, modals, forms)
│   └── pages.css             # Page-specific layouts & responsive styles
├── js/
│   ├── main.js               # Core utilities (Auth, API, Toast, Utils)
│   └── components.js         # Interactive components (Modal, TableSort, Pagination)
└── assets/                   # Placeholder for images/icons
```

## Features Implemented

### Design System
- ✅ Modern banking app aesthetic with cyan/turquoise theme
- ✅ Comprehensive design tokens (colors, typography, spacing, shadows)
- ✅ Consistent component styling across all pages
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth transitions and animations

### Components

#### 1. **Sidebar Navigation**
- Fixed sidebar with logo and clinic name
- Active state indicators with cyan accent
- Badge notifications for pending items
- User profile section with avatar
- Logout button
- Mobile: Collapsible with hamburger menu and overlay

#### 2. **Data Tables**
- Sortable columns
- Pagination with page numbers
- Row hover states
- Fast-track booking indicators (cyan left border)
- Action buttons (view, edit)
- Empty state handling
- Responsive: Horizontal scroll on mobile

#### 3. **Stat Cards**
- Gradient icon backgrounds
- Animated value counters
- Trend indicators (up/down/neutral)
- Responsive grid layout

#### 4. **Filter Panel**
- Date range pickers
- Dropdown selectors
- Checkbox groups
- Apply/Reset actions
- Collapsible on mobile

#### 5. **Modals**
- Overlay with backdrop blur
- Slide-up animation
- Close on ESC key or backdrop click
- Focus trap
- Mobile: Bottom sheet variant

#### 6. **Forms**
- Validation with real-time feedback
- File upload with image preview
- Toggle switches
- Rich text areas
- Inline error messages
- Accessible labels and hints

#### 7. **Schedule Calendar**
- Weekly grid view
- Booked slots with patient info
- Blocked/exception slots
- Navigation (prev/next week)
- Doctor selector
- Click to view appointment details

### Pages

#### 1. **Login Page** (`login.html`)
- Clean centered card layout
- Username/email input
- Password with visibility toggle
- Remember me checkbox
- Error message display
- Security notice
- Gradient background
- Mock authentication (accepts any credentials for demo)

#### 2. **Dashboard** (`dashboard.html`)
- 4 stat cards with metrics:
  - Total Bookings Today
  - Pending Confirmations
  - Completed Today
  - Revenue Today
- Today's bookings table (first 5 bookings)
- Quick action buttons
- Animated stat counters

#### 3. **Bookings List** (`bookings.html`)
- Search input with debounce
- Advanced filter panel:
  - Date range
  - Doctor selector
  - Status checkboxes (Pending, Confirmed, Paid, etc.)
- Full bookings table with all columns
- Sortable headers
- Pagination (20 items per page)
- Sample booking data

#### 4. **Doctors List** (`doctors.html`)
- Card grid layout (responsive)
- Doctor avatar placeholders with initials
- Status badges (Active/Inactive)
- Specialization display
- Booking stats
- Edit button per card
- Empty state for no doctors

#### 5. **Doctor Form** (`doctor-form.html`)
- Multi-section form:
  - Basic Information (name, specialization, photo, bio)
  - Contact Information (phone, email)
  - Settings (consultation fee, active status)
- File upload with preview
- Toggle switch for active status
- Form validation
- Cancel/Save actions

#### 6. **Schedule Management** (`schedule.html`)
- Doctor selector dropdown
- View toggle (Week/Month)
- Weekly calendar grid:
  - Time slots (rows)
  - Days of week (columns)
  - Booked appointments with patient names
  - Blocked/exception slots
- Week navigation (prev/next)
- Add Exception button
- Edit Schedule button

#### 7. **Clinic Profile** (`clinic-profile.html`)
- Clinic information form:
  - Basic info (name, address, phone, email)
  - Operating hours (day-by-day with time pickers)
  - Settings (timezone, commission percentage)
- Copy to all days feature
- Form validation
- Save/Cancel actions

#### 8. **Index** (`index.html`)
- Auto-redirect entry point
- Redirects to dashboard if authenticated
- Redirects to login if not authenticated
- Loading spinner

### JavaScript Utilities

#### Authentication (`Auth`)
- `isAuthenticated()` - Check auth status
- `getToken()` - Get stored token
- `getUser()` - Get user info
- `setAuth(token, user, remember)` - Store credentials
- `logout()` - Clear auth and redirect
- `requireAuth()` - Protect pages

#### API (`API`)
- `get(endpoint)` - GET request
- `post(endpoint, data)` - POST request
- `patch(endpoint, data)` - PATCH request
- `delete(endpoint)` - DELETE request
- Auto token injection
- 401 handling (auto logout)

#### Toast Notifications (`Toast`)
- `success(message)` - Green toast
- `error(message)` - Red toast
- `warning(message)` - Yellow toast
- `info(message)` - Blue toast
- Auto-dismiss after 3 seconds

#### Utilities (`Utils`)
- `formatCurrency(amount)` - Format to IDR
- `formatDate(dateString, format)` - Format dates
- `formatDateTime(dateString)` - Format date + time
- `debounce(func, wait)` - Debounce function
- `copyToClipboard(text)` - Copy with toast
- `getInitials(name)` - Get initials from name
- `isValidEmail(email)` - Email validation
- `isValidPhone(phone)` - Phone validation (Indonesian)

#### Components (`Modal`, `TableSort`, `Pagination`, etc.)
- `Modal.open(id)` / `Modal.close(id)` - Modal management
- `TableSort.init(tableId)` - Enable table sorting
- `Pagination.init(containerId, options)` - Render pagination
- `FilterPanel.init(formId, onApply)` - Handle filters
- `SearchInput.init(inputId, onSearch)` - Debounced search
- `FormValidator.validate(formId)` - Form validation
- `PasswordToggle.init()` - Password visibility toggle
- `FileUpload.init(inputId, previewId)` - Image preview
- `StatAnimation.init()` - Animate stat counters
- `ScheduleCalendar.init(options)` - Calendar widget
- `Confirm.show(message, onConfirm)` - Confirmation dialog

### Styling Features

#### Design Tokens
- **Colors**: Primary (cyan), neutral palette, semantic colors
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: 8px-based scale
- **Border Radius**: sm (8px) to 3xl (24px)
- **Shadows**: 5 elevation levels
- **Transitions**: Fast (150ms), base (200ms), slow (300ms)

#### Responsive Breakpoints
- **Mobile**: < 768px
  - Collapsible sidebar with overlay
  - Stacked layouts
  - Card-based tables (horizontal scroll)
  - Full-width forms
- **Tablet**: 768px - 1023px
  - Icon-only sidebar option
  - 2-column grids
  - Compact views
- **Desktop**: 1024px+
  - Full sidebar always visible
  - Multi-column layouts
  - Hover states active

#### Accessibility
- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states
- Screen reader friendly
- Proper form labels and hints

## How to Use

### 1. **Open the Prototype**

Simply open `index.html` in a modern web browser. It will automatically redirect to:
- `login.html` if not authenticated
- `dashboard.html` if authenticated

### 2. **Login**

On the login page:
- Enter any username/email (demo accepts all)
- Enter any password (demo accepts all)
- Optionally check "Remember me"
- Click "Login"

The demo uses mock authentication and stores session in localStorage/sessionStorage.

### 3. **Navigate**

Use the sidebar to navigate between pages:
- Dashboard - Overview and stats
- Bookings - Search and filter bookings
- Doctors - View and manage doctors
- Schedule - Manage doctor schedules
- Clinic Profile - Edit clinic settings

### 4. **Interact**

All interactive elements are functional:
- **Tables**: Click headers to sort, click rows to view details
- **Filters**: Apply filters to see console output
- **Search**: Type to search (debounced)
- **Pagination**: Navigate between pages
- **Forms**: Fill and submit (shows success toast)
- **Modals**: Open/close with animations
- **File Upload**: Select image to preview
- **Toggle Switches**: Click to toggle

### 5. **Logout**

Click the logout button in the sidebar footer to clear session and return to login.

## Sample Data

The prototype includes sample data for demonstration:

### Bookings
- BK20251003001 - Budi Santoso (Fast-Track, Paid)
- BK20251003002 - Siti Aminah (Regular, Confirmed)
- BK20251003003 - Rudi Hartono (Fast-Track, Paid)
- BK20251003004 - Dewi Lestari (Regular, Pending)
- BK20251003005 - Agus Setiawan (Regular, Completed)

### Doctors
- Dr. Ahmad Surya (Dokter Umum, Active)
- Dr. Sarah Wijaya (Dokter Umum, Active)
- Dr. Budi Prakoso (Spesialis Anak, Inactive)

### Statistics
- Total Bookings Today: 24 (+12% trend)
- Pending Confirmations: 5 (no change)
- Completed Today: 15 (+8% trend)
- Revenue Today: Rp 500.000 (+15% trend)

## Technical Notes

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features used
- CSS Grid and Flexbox layouts
- No build process required - pure HTML/CSS/JS

### No External Dependencies
- No jQuery or other libraries
- Pure vanilla JavaScript
- Custom CSS (no frameworks like Bootstrap)
- SVG icons inline (no icon fonts)

### Performance
- Minimal CSS (< 50KB total)
- Optimized animations (CSS transforms)
- Debounced search/filters
- Lazy loading ready structure

### State Management
- LocalStorage for persistent auth (Remember me)
- SessionStorage for temporary auth
- In-memory state for UI interactions
- Ready for API integration

## Customization

### Colors
Edit `css/tokens.css` to change the color scheme:
```css
--primary-500: #00CED1;  /* Change to your brand color */
--accent-500: #00E5E8;   /* Adjust accent color */
```

### Logo
Replace the SVG logo in the sidebar with your clinic's logo:
```html
<svg class="logo" viewBox="0 0 64 64">
  <!-- Your logo SVG code -->
</svg>
```

### Typography
Adjust font in `css/tokens.css`:
```css
--font-sans: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
```

### API Integration
Replace mock calls in JavaScript with real API calls:
```javascript
// In login.html
const response = await API.post('/admin/login', { username, password });

// In bookings.html
const bookings = await API.get('/admin/bookings?date=' + date);
```

## Next Steps

### For Development
1. **API Integration**: Replace mock data with real API calls
2. **WebSocket**: Add real-time booking updates
3. **Advanced Features**:
   - Bulk actions (multi-select bookings)
   - Export to CSV/PDF
   - Advanced analytics
   - Email/SMS notifications
4. **Testing**: Add unit tests and E2E tests
5. **Build Process**: Add bundler (Webpack/Vite) if needed

### For Production
1. **Authentication**: Implement JWT with refresh tokens
2. **Role-Based Access**: Owner vs Admin permissions
3. **Data Persistence**: Connect to database
4. **Error Handling**: Comprehensive error states
5. **Performance**: Code splitting, lazy loading
6. **Security**: CSRF protection, XSS prevention
7. **Monitoring**: Add analytics and error tracking

## Design Specifications

This prototype strictly follows the specifications defined in:
- `/home/rofiq/Projects/design/klinik/webspec-admin.md`

All measurements, colors, spacing, and components match the specification exactly.

## License

Internal use only - Klinik Sehat Admin Dashboard Prototype

## Support

For questions or issues, contact the development team.

---

**Version**: 1.0
**Last Updated**: 2025-10-03
**Status**: Production-ready HTML prototype
