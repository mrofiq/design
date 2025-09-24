# MedCore Booking - HTML Prototype

A mobile-first Progressive Web App for patient appointment booking with time-range selection (Morning/Afternoon/Evening) instead of minute-by-minute slots.

## 🚀 Quick Start

1. **Serve the files using a local server:**
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (if you have http-server installed)
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

2. **Open in browser:**
   ```
   http://localhost:8000
   ```

3. **Test on mobile:**
   - Use browser dev tools mobile emulation
   - Or access from mobile device on same network

## 📱 Features Implemented

### ✅ Core Functionality
- **Doctor Search**: Debounced search (300ms) by name/specialization
- **Date Selection**: 14-day rolling date picker with today highlight
- **Time Range Booking**: Morning/Afternoon/Evening slots with availability
- **Form Validation**: Real-time validation with accessible error messages
- **Booking Confirmation**: Success animation with ticket code generation
- **Mock Data**: Pre-loaded with sample doctors and availability

### ✅ Progressive Web App
- **Service Worker**: Offline caching and background sync
- **Web App Manifest**: Installable PWA with proper icons
- **Offline Support**: Fallback page with retry functionality
- **Push Notification Ready**: Framework for future appointment reminders

### ✅ Mobile-First Design
- **Touch Optimized**: Minimum 48px touch targets
- **Safe Area Support**: iPhone notch/dynamic island compatibility
- **Responsive Layout**: Adapts from 320px to 1024px+ screens
- **Gesture Friendly**: Swipe dismissal for bottom sheets

### ✅ Accessibility (WCAG 2.1 AA)
- **Screen Reader Support**: ARIA labels, roles, and live regions
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Focus Trapping**: Modal focus containment with escape key support
- **Color Contrast**: High contrast ratios throughout
- **Reduced Motion**: Respects `prefers-reduced-motion`

### ✅ User Experience
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: Toast notifications and inline validation
- **Haptic Feedback**: Vibration on supported devices
- **Animations**: Micro-interactions with proper timing
- **Toast Messages**: Accessible notifications with auto-dismiss

## 🎨 Design System

### Colors
- **Primary**: `#0066FF` (Brand blue)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)

### Typography
- **Font**: Inter with system font fallbacks
- **Sizes**: 12px to 32px with consistent scale
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Scale**: xs(4px), sm(8px), md(16px), lg(24px), xl(32px), 2xl(48px)

### Breakpoints
- **Mobile**: 320px - 767px (default)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔧 Technical Implementation

### HTML Structure
- Semantic markup with proper ARIA labels
- Progressive enhancement approach
- Screen reader optimized content structure

### CSS Architecture
- CSS Custom Properties for theming
- Mobile-first responsive design
- BEM-like naming conventions
- Utility classes for common patterns

### JavaScript Features
- ES6+ modern JavaScript
- Class-based architecture
- Event delegation and debouncing
- Local state management
- Mock API integration ready

## 🧪 Testing the Prototype

### Desktop Testing
1. Open in Chrome/Firefox/Safari
2. Use DevTools mobile emulation
3. Test keyboard navigation (Tab, Arrow keys, Enter, Esc)
4. Test screen reader with browser extensions

### Mobile Testing
1. Access from mobile device on same network
2. Test touch interactions and gestures
3. Try installing as PWA (Add to Home Screen)
4. Test offline functionality (disable network)

### Accessibility Testing
1. Navigate using only keyboard
2. Test with screen reader (NVDA, JAWS, VoiceOver)
3. Check color contrast in high contrast mode
4. Verify focus indicators are visible

## 📋 Demo Flow

1. **Search**: Type "Dr" to see sample doctors
2. **Select**: Choose "Dr. Sarah Wilson"
3. **Date**: Select tomorrow's date
4. **Time**: Choose "Morning" slot
5. **Book**: Fill form with:
   - Name: "John Doe"
   - Phone: "+1234567890"
   - Reason: "Regular checkup"
6. **Confirm**: See success screen with ticket code
7. **PWA**: Try "Add to Home Screen" in mobile browser

## 🚀 Production Considerations

### API Integration
- Replace mock data with real API endpoints
- Add authentication/OTP verification
- Implement proper error handling
- Add retry mechanisms

### Performance
- Optimize images and fonts
- Implement code splitting
- Add performance monitoring
- Enable HTTP/2 server push

### Security
- Add HTTPS enforcement
- Implement CSP headers
- Sanitize user inputs
- Add rate limiting

### Monitoring
- Add analytics tracking
- Implement error reporting
- Monitor Core Web Vitals
- Track conversion funnel

## 📁 File Structure

```
booking/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS with design system
├── app.js             # JavaScript application logic
├── manifest.json      # PWA manifest
├── sw.js             # Service worker for offline support
├── offline.html      # Offline fallback page
└── README.md         # This documentation
```

## 🔄 Future Enhancements

- [ ] Real-time availability updates
- [ ] Payment integration (QRIS)
- [ ] Push notifications
- [ ] Calendar integration
- [ ] Multi-language support
- [ ] Advanced filtering
- [ ] Provider dashboard
- [ ] Analytics dashboard

## 🐛 Known Limitations

- Mock data only (no real API integration)
- No persistent storage (refreshing resets state)
- Limited error scenarios
- Simplified validation rules
- No real-time updates

## 📧 Next Steps

1. **Backend Integration**: Connect to real API endpoints
2. **Authentication**: Implement phone OTP verification
3. **Payment**: Add QRIS payment flow
4. **Testing**: Add automated testing suite
5. **Deployment**: Set up staging and production environments

---

**Built following the MVP specification with mobile-first, accessible, and user-friendly design principles.**