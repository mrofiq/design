# QR Display Screen - HTML Prototype

> **Waiting List SaaS Platform**
> Restaurant entrance display for customer queue registration via QR code scanning

---

## 📋 Overview

This is a fully functional HTML prototype of the QR Display screen that will be placed at restaurant entrances. Customers scan the displayed QR code with their phones to register for the waiting queue.

**Key Features:**
- ✅ Dynamic QR code generation
- ✅ Auto-refresh every 30 seconds
- ✅ Responsive design (landscape & portrait)
- ✅ Wake lock to prevent screen sleep
- ✅ Error handling and retry logic
- ✅ Connection status monitoring
- ✅ Kiosk mode support
- ✅ Warm orange theme from design tokens

---

## 🚀 Quick Start

### Option 1: Direct Browser Access

Simply open the `index.html` file in your browser:

```bash
# Navigate to the display folder
cd /home/rofiq/Projects/design/waitinglist/display/

# Open in browser (Linux)
xdg-open index.html

# Or drag and drop index.html into your browser
```

### Option 2: Local Server (Recommended)

For testing features like Wake Lock API, use a local server:

```bash
# Using Python 3
cd /home/rofiq/Projects/design/waitinglist/display/
python3 -m http.server 8080

# Using Node.js (npx http-server)
npx http-server . -p 8080

# Using PHP
php -S localhost:8080
```

Then open: http://localhost:8080

---

## 📁 File Structure

```
display/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with warm orange theme
├── script.js           # QR generation, auto-refresh, wake lock
└── README.md           # This file
```

---

## 🎨 Design Specifications

### Color Theme (Warm Orange)

The prototype uses the warm orange color palette as specified:

- **Primary Orange**: `#D97706` - Main accent color
- **Light Shades**: `#FFFBEB`, `#FEF3C7`, `#FDE68A` - Backgrounds
- **Dark Shades**: `#B45309`, `#92400E`, `#78350F` - Text/borders
- **Neutral Stone**: `#FAFAF9` to `#1C1917` - Grays and backgrounds

### Typography

- **Font Family**: Inter (loaded from Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Sizes**: Responsive from 0.75rem to 4.5rem

### Responsive Breakpoints

| Breakpoint | Description | QR Size |
|------------|-------------|---------|
| > 1200px | Large Display (TV/Monitor) | 600×600px |
| 1024-1200px | Landscape Tablet | 400×400px |
| 768-1023px | Portrait Tablet | 500×500px |
| 480-767px | Small Tablet | 350×350px |
| < 480px | Mobile | 280×280px |

---

## ⚙️ Features & Functionality

### 1. QR Code Generation

- **Library**: [qrcode.js](https://davidshimjs.github.io/qrcodejs/) via CDN
- **Error Correction**: High (30% redundancy)
- **Format**: Canvas element converted to data URL
- **Content**: `https://app.example.com/join/{token}`

**Token Format:**
```
{restaurantId}-{timestamp}-{randomString}
Example: demo-restaurant-123-1696348800000-x7k9m2n
```

### 2. Auto-Refresh

- **Interval**: Every 30 seconds
- **Animation**: Smooth fade transition (500ms)
- **Indicator**:
  - Small refresh icon in footer
  - Temporary message below QR code
  - Spinning animation during refresh

### 3. Wake Lock (Screen Always On)

**Primary Method:** Wake Lock API
```javascript
navigator.wakeLock.request('screen')
```

**Fallback:** Silent video loop (for iOS/older browsers)
- Plays a 1-second silent video on repeat
- Prevents screen from sleeping

### 4. Loading States

#### Initial Load
- Restaurant logo placeholder
- Spinner animation
- "Memuat QR code..." message

#### Error State
- Warning icon (⚠️)
- "QR code gagal dimuat" message
- "Coba Lagi" retry button
- Auto-retry with exponential backoff

#### Success State
- QR code displayed in bordered container
- Pulse glow animation on container
- Instructions below QR code

### 5. Connection Monitoring

- **Online**: Green dot indicator, auto-refresh enabled
- **Offline**: Red dot indicator, auto-refresh paused
- **Reconnect**: Automatic resume of auto-refresh

### 6. Kiosk Mode

Enable fullscreen kiosk mode via URL parameter:

```
index.html?kiosk=true
```

**Features:**
- Auto-enters fullscreen after 1 second
- Right-click disabled
- Clean display without browser UI

---

## 🎯 Usage Instructions

### For Restaurant Staff

1. **Setup Display Device**
   - Use tablet, TV browser, or monitor
   - Connect to reliable WiFi
   - Ensure screen brightness is adequate

2. **Open QR Display**
   - Navigate to: `https://app.example.com/qr-display/{restaurant-id}`
   - Or for kiosk mode: `...?kiosk=true`

3. **Position Display**
   - Place at entrance or waiting area
   - Height: Eye level (~150cm from ground)
   - Ensure good lighting
   - Test scanability from 2-3 meters

4. **Verify Functionality**
   - QR code should be visible and crisp
   - Auto-refresh indicator should show "Auto" badge
   - Connection status should show green dot

### For Customers

1. **Scan QR Code**
   - Use phone camera or QR scanner app
   - Stand 1-3 meters from display
   - Wait for focus and scan

2. **Follow Link**
   - Opens registration page
   - Fill in required information
   - Receive queue number

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `R` | Manual refresh QR code |
| `F11` | Toggle fullscreen (browser default) |
| `ESC` | Exit fullscreen (browser default) |

---

## 🧪 Testing Checklist

### Visual Testing

- [ ] QR code displays correctly on load
- [ ] Auto-refresh animation is smooth
- [ ] Pulse glow effect is visible but not distracting
- [ ] Text is readable from 2-3 meters
- [ ] Loading state appears on initial load
- [ ] Error state shows when QR fails
- [ ] All fonts load correctly (Inter)

### Functional Testing

- [ ] QR code refreshes every 30 seconds
- [ ] Wake lock prevents screen sleep (test for 5+ minutes)
- [ ] Manual refresh works (press R key)
- [ ] Retry logic works on error
- [ ] Connection status updates on offline/online
- [ ] Kiosk mode enters fullscreen
- [ ] Responsive design works on different screens

### Device Testing

- [ ] iPad (portrait and landscape)
- [ ] Android tablet
- [ ] Large TV screen (via browser/Chromecast)
- [ ] Desktop browser (Chrome, Firefox, Safari, Edge)
- [ ] Small 7-8 inch tablets

### Performance Testing

- [ ] Initial load time < 1.5 seconds
- [ ] QR generation < 500ms
- [ ] Memory usage stable over 24 hours
- [ ] No memory leaks on repeated refreshes
- [ ] CPU usage minimal when idle

---

## 🐛 Troubleshooting

### QR Code Not Loading

**Symptoms:** Shows loading spinner indefinitely or error state

**Solutions:**
1. Check browser console for errors (F12)
2. Ensure qrcode.js library loaded from CDN
3. Verify internet connection
4. Try manual refresh (R key)
5. Clear browser cache and reload

### Screen Keeps Turning Off

**Symptoms:** Display sleeps after a few minutes

**Solutions:**
1. Check if Wake Lock API is supported:
   ```javascript
   console.log('wakeLock' in navigator);
   ```
2. Enable "Stay Awake" in device settings:
   - Android: Developer options → Stay awake
   - iPad: Settings → Display → Auto-Lock → Never
3. Use kiosk mode parameter: `?kiosk=true`

### QR Code Not Scannable

**Symptoms:** Phones can't scan the QR code

**Solutions:**
1. Increase screen brightness
2. Clean screen surface
3. Ensure adequate ambient lighting (not backlit)
4. Check distance (optimal: 1-2 meters)
5. Verify QR size is adequate for screen
6. Test with different phones/cameras

### Auto-Refresh Not Working

**Symptoms:** QR code doesn't refresh after 30 seconds

**Solutions:**
1. Check connection status indicator (green dot)
2. Open console and look for interval logs
3. Verify `CONFIG.enableAutoRefresh` is true
4. Check if page is visible (not in background tab)
5. Test manual refresh (R key) to verify generation works

---

## 🔧 Configuration

Edit `script.js` to customize settings:

```javascript
const CONFIG = {
  qrRefreshInterval: 30000,        // 30 seconds (in milliseconds)
  qrSize: 400,                      // Base QR size (responsive)
  qrErrorCorrectionLevel: 'H',      // L, M, Q, H
  restaurantId: 'demo-restaurant-123',
  enableWakeLock: true,             // Keep screen awake
  enableAutoRefresh: true,          // Auto-refresh QR
  demoMode: true                    // Use mock data
};
```

---

## 🚀 Production Deployment

### 1. Update API Integration

Replace demo token generation with real API calls:

```javascript
// In script.js, update generateQRCode() function
async function generateQRCode() {
  // Call backend API
  const response = await fetch(`${CONFIG.apiBaseUrl}/api/qr/generate/${CONFIG.restaurantId}`);
  const data = await response.json();

  // Use real token from API
  const qrUrl = data.qrUrl;
  const token = data.token;

  // Generate QR code with real URL
  // ... rest of the code
}
```

### 2. Extract Restaurant Info from URL

```javascript
// Get restaurant ID from URL path
const pathParts = window.location.pathname.split('/');
const restaurantId = pathParts[pathParts.length - 1];

// Fetch restaurant details
const restaurantData = await fetch(`${CONFIG.apiBaseUrl}/api/restaurant/${restaurantId}`);
const { name, logo, tagline } = await restaurantData.json();

// Update display
document.querySelector('.restaurant-name').textContent = name;
document.querySelector('.restaurant-tagline').textContent = tagline;
```

### 3. Add Real Logo

Replace logo placeholder with actual restaurant logo:

```javascript
// In HTML, replace .logo-placeholder with:
<img src="${restaurant.logoUrl}" alt="${restaurant.name}" class="restaurant-logo">
```

### 4. Configure CDN/Hosting

- Host assets on CDN for faster loading
- Use WebP images for logos
- Minify CSS and JavaScript
- Enable gzip/brotli compression
- Set proper cache headers

### 5. Security Considerations

- Use HTTPS only (enforce)
- Implement token encryption (JWT)
- Set token expiry (30-60 seconds)
- Validate tokens on backend
- Rate limit QR generation API
- Add CORS restrictions

---

## 📊 Analytics & Monitoring

### Track Key Metrics

```javascript
// Add analytics tracking
function trackQRScan() {
  // Google Analytics, Mixpanel, etc.
  gtag('event', 'qr_displayed', {
    restaurant_id: CONFIG.restaurantId,
    timestamp: Date.now()
  });
}

// Track errors
function trackQRError(error) {
  console.error('QR Error:', error);
  // Send to error tracking service (Sentry, etc.)
}
```

### Monitor Display Health

- QR generation success rate
- Screen uptime
- Auto-refresh failures
- Wake lock status
- Connection drops

---

## 🎨 Customization Guide

### Change Theme Color

Update color variables in `styles.css`:

```css
:root {
  /* Change primary color from orange to blue */
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  /* ... update all shades */
}
```

### Modify QR Refresh Interval

```javascript
// In script.js
const CONFIG = {
  qrRefreshInterval: 60000, // Change to 60 seconds
  // ...
};
```

### Add Custom Instructions

Edit the instructions in `index.html`:

```html
<div class="instruction-step">
  <div class="step-number">4</div>
  <p class="step-text">Your custom instruction here</p>
</div>
```

### Enable Dark Mode (Future)

Add dark mode toggle:

```css
[data-theme="dark"] {
  --color-bg-primary: var(--color-neutral-900);
  --color-text-primary: var(--color-neutral-50);
  /* ... rest of dark theme variables */
}
```

---

## 📚 Libraries & Dependencies

| Library | Version | Purpose | CDN Link |
|---------|---------|---------|----------|
| **qrcode.js** | 1.0.0 | QR code generation | https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js |
| **Inter Font** | Latest | Typography | https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700 |

**No additional dependencies required** - Vanilla JavaScript only!

---

## 🌐 Browser Support

| Browser | Version | Support Level | Notes |
|---------|---------|---------------|-------|
| Chrome | 87+ | ✅ Full | Wake Lock supported |
| Firefox | 96+ | ✅ Full | Wake Lock supported |
| Safari | 16.4+ | ✅ Full | Wake Lock supported (iOS 16.4+) |
| Edge | 87+ | ✅ Full | Wake Lock supported |
| Opera | 73+ | ✅ Full | Wake Lock supported |
| Samsung Internet | 15+ | ⚠️ Partial | Use fallback wake lock |
| Safari < 16.4 | < 16.4 | ⚠️ Partial | Use video fallback |

**Progressive Enhancement:**
- Wake Lock API with video fallback
- Service Worker support (future)
- Graceful degradation on older browsers

---

## 🔮 Future Enhancements

### Phase 2 Features

- [ ] Live queue count display
- [ ] Current wait time estimate
- [ ] Multi-language support (EN/ID toggle)
- [ ] Custom branding per restaurant
- [ ] Background video/image support
- [ ] Voice announcement for accessibility
- [ ] NFC tap-to-register alternative

### Premium Features

- [ ] Custom theme colors via dashboard
- [ ] Logo upload and customization
- [ ] Promotional messages/announcements
- [ ] Multiple display management
- [ ] Remote control from dashboard
- [ ] Display analytics and health monitoring

---

## 🤝 Support & Contact

**For Issues or Questions:**
- Check browser console for errors (F12 → Console)
- Review troubleshooting section above
- Test in different browsers
- Verify internet connection

**Debug Mode:**

Open browser console and use:

```javascript
// Check current state
console.log(window.qrDisplay.state);

// Check configuration
console.log(window.qrDisplay.config);

// Manual refresh
window.qrDisplay.refreshQRCode();

// Enter fullscreen
window.qrDisplay.enterFullscreen();

// Generate test token
window.qrDisplay.generateToken();
```

---

## 📝 License & Credits

**Waiting List SaaS Platform**
QR Display Screen Prototype
Version 1.0 - October 2025

**Design System:**
- Color Theme: Warm Orange & Stone
- Typography: Inter Font Family
- Component Library: shadcn/ui conventions

**Third-Party Libraries:**
- qrcode.js by David Shim (MIT License)
- Inter Font by Rasmus Andersson (OFL)

---

## 🎉 Ready to Use!

This prototype is **fully functional** and ready for demonstration:

1. **Open `index.html`** in any modern browser
2. **Watch** the QR code generate and auto-refresh
3. **Scan** with your phone (opens demo URL)
4. **Test** different screen sizes and orientations
5. **Try** kiosk mode: `index.html?kiosk=true`

**Perfect for:**
- Client demonstrations
- Design reviews
- User testing sessions
- Stakeholder presentations
- Development reference

---

**Built with ❤️ for restaurant waiting list management**
