# DevDaily - HTML Prototype

A complete, production-quality HTML prototype for the DevDaily developer performance tracking platform, following Mercury Design principles.

## 📁 Project Structure

```
website/
├── index.html                 # Developer Dashboard (Main page)
├── daily-report.html          # Daily Report submission
├── my-progress.html          # Personal analytics & charts
├── leaderboard.html          # Rankings (Individual & Team)
├── login.html                # Authentication page
├── team-management.html      # Manager view for team oversight
├── css/
│   ├── main.css              # Design tokens + base styles
│   ├── components.css        # All UI components
│   └── animations.css        # Micro-interactions & animations
├── js/
│   ├── main.js               # Core functionality
│   ├── charts.js             # Chart implementations
│   └── animations.js         # Animation logic
└── assets/                   # (Icons/images if needed)
```

## 🎨 Design System

### Mercury Design Principles
- **Clean Typography**: System fonts with precise hierarchy
- **Compact Information Density**: Efficient vertical space usage
- **Subtle Visual Depth**: Minimal shadows (rgba(0,0,0,0.08))
- **Professional Palette**: Neutral grays with purposeful accents
- **Generous White Space**: Strategic spacing for readability

### Color Palette

**Primary:**
- Primary Blue: `#5B5BD6`
- Primary Dark: `#4A4AC4`

**Semantic:**
- Success Green: `#16A34A`
- Warning Orange: `#EA580C`
- Error Red: `#DC2626`
- Info Purple: `#7C3AED`

**Neutrals:**
- 0-900 scale from `#FFFFFF` to `#171717`

### Typography
- Font Family: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto"`
- Font Sizes: 11px - 40px (compact scale)
- Line Heights: 1.25 - 1.625 (compact)

### Spacing
- 0.5x scale from 2px to 64px
- Common: 4px, 8px, 12px, 16px, 24px, 32px

## 🚀 Getting Started

### Quick Start
1. Open `index.html` in a modern web browser
2. Navigate between pages using the sidebar
3. All pages are fully functional (within static HTML limitations)

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Chart.js CDN (loaded via script tag in my-progress.html)
- No build process required

## 📄 Pages Overview

### 1. Developer Dashboard (`index.html`)
**Purpose:** Main overview of daily activity and performance

**Features:**
- Real-time activity feed with auto-scrolling
- Point summary cards with count-up animations
- Daily report status indicator
- Countdown timer for report deadline
- AI insights panel
- Quick stats with progress bars

**Highlights:**
- Perfect implementation of Mercury design
- GPU-accelerated animations
- Responsive grid layout
- Interactive stat cards

### 2. Daily Report (`daily-report.html`)
**Purpose:** Submit and manage daily activity reports

**Features:**
- Auto-loaded activities section (checkboxes)
- Incident reporting with AI category suggestions
- Help request with urgency detection
- Thanks to teammates multi-select
- AI-generated summary with edit capability
- Auto-save indicator (every 30s)
- Submit with loading → success → confetti animation

**Highlights:**
- Real-time form validation
- Simulated AI features
- Confetti on successful submission
- Deadline countdown with urgent state

### 3. My Progress (`my-progress.html`)
**Purpose:** Personal analytics and performance tracking

**Features:**
- Sprint & quarterly point cards
- 30-day point trend line chart (Chart.js)
- Activity heatmap (GitHub-style, 90 days)
- Key metrics with progress bars
- AI recommendations panel

**Highlights:**
- Chart.js integration
- Interactive heatmap
- Animated progress bars
- Scroll-triggered animations

### 4. Leaderboard (`leaderboard.html`)
**Purpose:** Rankings and competitive tracking

**Features:**
- Individual/Team toggle tabs
- Period selector (Daily/Quarterly/Yearly)
- Ranked table with medals (🥇🥈🥉)
- Trend indicators (↑↓→)
- Activity levels (High/Med/Low badges)
- Current user row highlighting
- Team on-time percentage

**Highlights:**
- Smooth tab transitions
- Dynamic period switching
- Highlighted user row
- Medal emoji for top 3

### 5. Login (`login.html`)
**Purpose:** Authentication and registration

**Features:**
- Email/password form with validation
- Real-time email validation
- Password toggle (show/hide)
- Remember me checkbox
- Microsoft SSO button
- Forgot password link
- Register modal with password strength meter
- Success animations

**Highlights:**
- Beautiful gradient background
- Centered card layout
- Password strength indicator (Weak/Medium/Strong)
- Real-time validation feedback
- Smooth modal animations

### 6. Team Management (`team-management.html`)
**Purpose:** Manager view for team oversight

**Features:**
- Team members grid with cards
- Member stats (points, reports, on-time %)
- Add member modal with search
- Daily reports review list
- Report detail modal
- Manager notes with auto-save
- Approve button with animation

**Highlights:**
- Status badges (Active/Needs Attention)
- Pending reports counter
- Tab-based navigation
- Approval workflow simulation

## 🎭 Micro-Interactions

All animations follow specifications from webspec.md:

### Button Animations
- **Hover:** Lift (-1px translateY) + shadow (150ms ease-out)
- **Click:** Press down (0px translateY, 100ms)
- **Loading:** Spinner with disabled state
- **Success:** Checkmark animation + green background (400ms)

### Points & Achievements
- **Points pop:** Scale 0.8 → 1.15 → 1 (300ms bounce)
- **Trophy bounce:** Bounce with rotation (800ms)
- **Count-up:** Animate from 0 to target (600ms)

### Forms & Validation
- **Error shake:** Horizontal shake (-4px ↔ 4px, 300ms)
- **Success checkmark:** Slide in from right (200ms)
- **Auto-save:** Fade in/out indicator (2s)

### Page Transitions
- **Modal:** Backdrop fade + content scale (300ms)
- **Toast:** Slide in from right (400ms)
- **Tab switch:** Fade content (200ms)

### Special Effects
- **Confetti:** 50 pieces falling with rotation (3s)
- **Deadline warning:** Pulsing red border (800ms loop)
- **Rank change:** Bounce animation with arrow

## 🔧 JavaScript Functionality

### main.js
- Toast notification system
- Modal management
- Form validation (email, password)
- Local storage helpers
- Date/time formatting
- Tab system
- Dropdown menus
- Copy to clipboard
- Smooth scrolling

### animations.js
- Count-up numbers
- Progress bar animations
- Pulse, shake, slide effects
- Confetti generator
- Button states (loading, success)
- Skeleton loading
- Scroll animations (Intersection Observer)
- Ripple effect
- Page transitions

### charts.js
- Line chart for point trends (Chart.js)
- Activity heatmap (custom implementation)
- Mock data generators
- Responsive chart configuration

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+
- Large Desktop: 1280px+

### Mobile Optimizations
- Sidebar collapses to icons
- Grid columns stack vertically
- Touch-friendly button sizes (minimum 44px)
- Simplified navigation
- Optimized font sizes

## ♿ Accessibility

### Features
- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states (2px outline)
- Sufficient color contrast (WCAG AA)
- Screen reader friendly
- Reduced motion support (@prefers-reduced-motion)

### Keyboard Shortcuts
- `Tab` - Navigate between elements
- `Enter` - Activate buttons/links
- `Escape` - Close modals
- `Space` - Toggle checkboxes

## 🎯 Performance

### Optimizations
- GPU-accelerated animations (transform, opacity)
- Debounced input handlers
- Efficient CSS selectors
- Minimal JavaScript (no frameworks)
- CDN for Chart.js
- Lazy loading for images (data-src)
- CSS custom properties for theming

### Best Practices
- No inline styles
- External CSS/JS files
- Compressed SVG icons
- Minimal reflows/repaints
- RequestAnimationFrame for animations

## 🧪 Testing Checklist

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Device Testing
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (iPad, Surface)
- ✅ Mobile (iPhone, Android)

### Functionality Testing
- ✅ All links navigate correctly
- ✅ Forms validate input
- ✅ Modals open/close properly
- ✅ Toasts display and dismiss
- ✅ Animations run smoothly
- ✅ Charts render correctly
- ✅ Tabs switch content
- ✅ Countdown timer updates

## 📝 Mock Data

All pages use realistic mock data:

### Users
- Sarah Chen (Top performer)
- Mike Johnson (Consistent)
- John Doe (Current user)
- Emma Davis (Needs attention)
- Alex Wong, James Wilson, Lisa Anderson

### Activities
- Commits, PRs, code reviews
- Quality gate passes
- Task completions
- Point transactions

### Teams
- Backend Squad, Frontend Team
- DevOps Crew, API Squad
- Mobile Team

## 🔮 Future Enhancements

For production implementation:

1. **Backend Integration**
   - Replace mock data with API calls
   - Real authentication (JWT tokens)
   - WebSocket for live updates

2. **State Management**
   - Add Zustand or Redux
   - Persist user preferences
   - Offline support

3. **Advanced Features**
   - Real Chart.js data from API
   - Export reports to PDF
   - Notification preferences
   - Dark mode toggle
   - Internationalization (i18n)

4. **Performance**
   - Code splitting
   - Service worker caching
   - Image optimization
   - Bundle analysis

## 📚 Documentation Reference

- Design Specifications: `/home/rofiq/Projects/design/devdaily/webspec.md`
- Product Requirements: `/home/rofiq/Projects/design/devdaily/PRD.md`

## 🤝 Contributing

When making changes:

1. Follow Mercury design principles
2. Maintain consistent naming (BEM-style)
3. Test across browsers/devices
4. Ensure accessibility compliance
5. Keep animations under 400ms
6. Use CSS custom properties
7. Comment complex logic
8. Update this README

## 📄 License

Internal project for DevDaily platform prototype.

---

**Built with ❤️ following Mercury Design System**

*Production-ready HTML prototype • October 2025*
