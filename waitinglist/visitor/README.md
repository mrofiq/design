# Visitor Interface - Waiting List SaaS Platform

HTML Prototype for the visitor/customer queue management interface.

## Overview

This is a fully functional HTML/CSS/JavaScript prototype demonstrating the complete visitor journey from QR code scanning to queue completion. The prototype uses the warm orange color theme and follows mobile-first design principles.

## Features

### 1. QR Token Validation (`index.html`)
- **Loading State**: Animated spinner while validating QR code
- **Success**: Automatic redirect to registration form
- **Error Handling**:
  - Invalid QR code detection
  - Expired token notification (30-second validity)
  - User-friendly error messages with retry options

### 2. Registration Form (`register.html`)
- **Form Fields**:
  - Name input with auto-capitalization
  - Phone number input with validation (Indonesian format: 08xxxxxxxxxx)
  - Auto-formatting on blur (adds hyphens)
  - Numeric keyboard on mobile devices
- **Party Size Selector**:
  - Touch-friendly button grid (1-5)
  - "6+" button opens modal with stepper control
  - Supports up to 20 people
  - Visual feedback on selection
- **Real-time Validation**:
  - On-blur field validation
  - Error messages with specific guidance
  - Success indicators (green borders)
  - Submit button disabled until form is valid
- **Queue Information Display**:
  - Current queue count
  - Estimated wait time
  - Updates in real-time (simulated)

### 3. Queue Status Page (`status.html`)
- **Waiting State**:
  - Large queue number display (#042 format)
  - Queue ahead counter with animation
  - Estimated wait time with color-coded feedback
  - Status indicator (Menunggu/Dipanggil)
  - Cancel button with confirmation dialog
  - Last updated timestamp
  - Connection status indicator
- **Called State**:
  - Full-screen alert with gradient background
  - Animated bell icons (ringing effect)
  - "GILIRAN ANDA!" message in large text
  - Instructions to approach host
  - Acknowledgment button
  - Sound notification (simulated)
  - Vibration pattern (mobile)
  - Browser notification support
- **Real-time Updates**:
  - WebSocket simulation (mock implementation)
  - Queue position updates every 10 seconds
  - Smooth number transitions
  - Auto-triggers "called" state after ~30 seconds (demo)

### 4. Cancellation Confirmation (`cancelled.html`)
- Success message with checkmark icon
- Queue number confirmation
- Thank you message
- Close button to exit flow

## Technical Stack

- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Custom properties (CSS variables), flexbox, grid, animations
- **Vanilla JavaScript**: No frameworks, ES6+ features
- **Web APIs**:
  - Notification API (browser notifications)
  - Vibration API (haptic feedback)
  - Wake Lock API (keep screen awake)
  - Session Storage (state persistence)
  - Web Audio API (notification sounds)

## Design System

### Color Palette (Warm Orange Theme)
```css
Primary: #D97706 (amber-600)
Hover: #B45309 (amber-700)
Light: #FED7AA (amber-200)
Success: #10B981 (emerald-600)
Error: #EF4444 (red-500)
Warning: #F59E0B (amber-500)
```

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Base Size**: 16px
- **Line Height**: 1.5

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

## File Structure

```
visitor/
├── index.html          # QR validation page
├── register.html       # Registration form
├── status.html         # Queue status monitoring
├── cancelled.html      # Cancellation confirmation
├── styles.css          # Shared styles with warm orange theme
├── script.js           # Shared utilities and helpers
├── register.js         # Registration form logic
├── status.js           # Status page with real-time updates
├── manifest.json       # PWA manifest
└── README.md          # This file
```

## Setup & Usage

### Local Development

1. **No build process required** - pure HTML/CSS/JS
2. Open any HTML file directly in a browser
3. For best experience, use a modern browser (Chrome, Firefox, Safari, Edge)
4. Mobile testing: Use browser DevTools responsive mode or actual device

### Testing User Flows

#### Full Journey Testing:
1. Open `index.html`
2. Wait for validation (auto-redirects after 1 second)
3. Fill registration form:
   - Name: "John Doe"
   - Phone: "081234567890"
   - Party size: Click "2" or any number
4. Click "Daftar Antrian"
5. Watch status page with real-time updates
6. Wait ~30 seconds to see "called" state
7. Click "Saya Sudah Datang" to acknowledge

#### Test Validation Errors:
1. Open `register.html`
2. Try submitting empty form (see validation)
3. Enter invalid phone: "1234" (see error)
4. Enter short name: "A" (see error)
5. Fix errors and submit successfully

#### Test Cancellation:
1. Open `status.html` (after registration)
2. Click "Batalkan Antrian"
3. Confirm in dialog
4. See success message in `cancelled.html`

### State Simulation

The prototype simulates various states for demonstration:

- **QR Validation**: Random success/invalid/expired (70%/20%/10%)
- **Registration**: 90% success rate
- **Queue Updates**: Decrements every 10 seconds
- **Called State**: Triggers after 30 seconds
- **WebSocket**: Mock implementation with realistic behavior

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 13+)
- **Mobile**: Optimized for touch interfaces

### PWA Features

The manifest.json enables:
- Add to Home Screen prompt
- Standalone display mode
- Custom theme color (#D97706)
- Portrait orientation lock
- App shortcuts

To test PWA:
1. Serve files via HTTPS (required for PWA)
2. Open in Chrome on Android or Safari on iOS
3. See "Add to Home Screen" prompt
4. Install and launch as standalone app

## Key Features Implemented

### Accessibility
- ✅ Semantic HTML elements
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus indicators (3px outline)
- ✅ Touch targets ≥44×44px
- ✅ Screen reader friendly
- ✅ Color contrast WCAG AA compliant

### Performance
- ✅ Lightweight: ~50KB total (uncompressed)
- ✅ No external dependencies
- ✅ Optimized animations (60fps)
- ✅ Efficient DOM manipulation
- ✅ Lazy loading ready

### Responsive Design
- ✅ Mobile-first approach
- ✅ Breakpoint: 768px (desktop adjustments)
- ✅ Fluid typography
- ✅ Flexible layouts (grid & flexbox)
- ✅ Touch-optimized controls

### User Experience
- ✅ Loading states with spinners
- ✅ Success/error feedback
- ✅ Smooth transitions (200-300ms)
- ✅ Haptic feedback (vibration)
- ✅ Sound notifications
- ✅ Browser notifications
- ✅ Pull-to-refresh gesture
- ✅ Session persistence

## Demo Scenarios

### Scenario 1: Happy Path
```
QR Scan → Validate → Register → Wait → Called → Acknowledge
```
**Duration**: ~45 seconds (simulated)

### Scenario 2: Cancellation
```
QR Scan → Validate → Register → Wait → Cancel → Confirmation
```
**Duration**: ~15 seconds

### Scenario 3: Error Handling
```
QR Scan → Invalid Token → Retry → Validate → Register
```

## Testing Checklist

### Visual Testing
- [ ] All pages render correctly
- [ ] Colors match warm orange theme
- [ ] Fonts load properly (Inter)
- [ ] Icons/emojis display correctly
- [ ] Animations smooth and performant
- [ ] No layout shifts (CLS)

### Functional Testing
- [ ] QR validation shows all 3 states
- [ ] Registration form validates correctly
- [ ] Party size selector works (1-20)
- [ ] Phone formatting applies on blur
- [ ] Name auto-capitalizes
- [ ] Submit button enables/disables correctly
- [ ] Status page loads from session
- [ ] Queue number displays properly
- [ ] Real-time updates animate smoothly
- [ ] Called state triggers after delay
- [ ] Cancel dialog works
- [ ] Cancelled page shows confirmation

### Mobile Testing
- [ ] Touch targets are adequate
- [ ] Numeric keyboard shows for phone input
- [ ] No horizontal scroll
- [ ] Modals cover full viewport
- [ ] Buttons easy to tap
- [ ] Forms submit on Enter key
- [ ] Pull-to-refresh works

### Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (iOS & macOS)
- [ ] Edge
- [ ] No console errors

## Customization

### Change Restaurant Name
In `register.html` and `status.html`, update:
```html
<h1 class="restaurant-name">Restoran Bahagia</h1>
```

### Change Color Theme
In `styles.css`, update CSS custom properties:
```css
:root {
    --color-primary-600: #D97706; /* Change this */
    /* Or replace entire palette */
}
```

### Adjust Queue Simulation
In `status.js`, modify:
```javascript
// Update interval (default: 10 seconds)
updateInterval = setInterval(() => { ... }, 10000);

// Time until called (default: 30 seconds)
if (updateCount >= 3) { ... }
```

### Change Form Validation
In `register.js`, update validation functions:
```javascript
function validatePhone() {
    // Modify phone pattern
    const pattern = /^08[0-9]{8,11}$/;
}
```

## Known Limitations

1. **Mock Data**: All API calls are simulated
2. **No Backend**: No actual server integration
3. **Session Storage**: Data clears when browser/tab closes
4. **No Real-time**: WebSocket is mocked
5. **Demo Only**: Not production-ready

## Next Steps for Production

1. **Backend Integration**:
   - Replace mock API calls with real endpoints
   - Implement actual WebSocket server
   - Add authentication/session management

2. **Error Handling**:
   - Network error recovery
   - Offline mode with service worker
   - Retry logic for failed requests

3. **Security**:
   - HTTPS enforcement
   - Token encryption
   - Rate limiting
   - CORS configuration

4. **Performance**:
   - Minify CSS/JS
   - Image optimization
   - Service worker caching
   - CDN integration

5. **Analytics**:
   - User flow tracking
   - Error monitoring
   - Performance metrics
   - Conversion funnel

## Browser Notifications

To test notifications:
1. Allow notification permission when prompted
2. Navigate away from page or minimize browser
3. Wait for "called" state
4. See system notification appear

## Troubleshooting

### Issue: Notifications don't work
**Solution**: Grant notification permission in browser settings

### Issue: Vibration doesn't work
**Solution**: Test on actual mobile device (not supported in desktop browsers)

### Issue: Session data lost
**Solution**: Don't use incognito/private mode

### Issue: Animations choppy
**Solution**: Use modern browser, close other tabs, check hardware acceleration

### Issue: Phone formatting breaks
**Solution**: Clear input and re-enter, avoid pasting formatted numbers

## Credits

- **Design System**: Warm Orange theme based on Tailwind CSS Amber palette
- **Typography**: Inter font family by Rasmus Andersson
- **Icons**: Unicode emojis for cross-platform compatibility
- **Inspiration**: Modern queue management systems

## License

This is a prototype for demonstration purposes. Modify freely for your project.

---

**Version**: 1.0
**Last Updated**: October 3, 2025
**Status**: Demo/Prototype Ready
**Author**: Waiting List SaaS Platform Team
