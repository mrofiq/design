# Quick Start Guide - Waiting List SaaS (Owner Interface)

## 🚀 Getting Started in 60 Seconds

### 1. Open the Prototype

**Option A: Start from Landing Page**
```
Open: /home/rofiq/Projects/design/waitinglist/owner/index.html
```

**Option B: Jump to Specific Page**
```
Registration:        register.html
OTP Verification:    verify.html
Email Verification:  verify-email.html
Empty Dashboard:     dashboard.html
Active Dashboard:    dashboard-active.html (⭐ BEST TO START HERE)
Settings (Theme):    settings.html
```

### 2. Recommended Demo Flow

#### **Quick Demo (2 minutes):**
1. Open `dashboard-active.html` in browser
2. See 15 active queues with real-time simulation
3. Press **Spacebar** to call next queue
4. Use search to filter queues
5. Click ⋮ on any row to see actions

#### **Full Demo (5 minutes):**
1. Start at `index.html` (landing page)
2. Click "Daftar Gratis" → `register.html`
3. Fill form:
   - Restaurant: "Restoran Sedap"
   - Choose "Nomor HP" tab
   - Phone: 812-3456-7890
   - Check terms → Click "Daftar Sekarang"
4. On `verify.html`, enter OTP: **123456**
5. Redirected to `dashboard.html` (empty state)
6. Click "Daftar Antrian" in navbar → `dashboard-active.html`
7. Interact with queue table
8. Click "⚙️" → `settings.html`
9. Change theme color → Click "Save Theme"

---

## 🎮 Demo Controls & Shortcuts

### verify.html (OTP Page)
- Enter OTP: **123456** (correct)
- Any other 6 digits = error (shake animation)

### verify-email.html
- **Ctrl+V** = Simulate successful verification
- **Ctrl+E** = Simulate expired link

### dashboard-active.html
- **Spacebar** = Call next waiting queue
- **Ctrl+/** = Show keyboard shortcuts help
- **Ctrl+S** = Focus search input
- Real-time: New queue arrives every 10 seconds

### settings.html (Theme Tab)
- Click preset swatches to change color instantly
- Enter HEX code manually (e.g., #2563EB)
- Click palette shades to copy HEX

---

## 📱 Test Responsive Design

### Desktop View (Default)
- Table layout for queues
- 3-column stats grid
- Side-by-side layout for settings

### Mobile View (< 768px)
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select iPhone or Android device
4. See:
   - Hamburger menu in navbar
   - Vertical card layout for queues
   - Single column stats
   - Smaller OTP boxes (48×48px)

### Test Different Sizes
- iPhone SE (375px) - Smallest mobile
- iPad (768px) - Tablet breakpoint
- Desktop (1200px) - Default
- Large desktop (1920px) - Max width

---

## 🎨 Test Theme Customization

### Quick Color Test
1. Open `settings.html`
2. Click "Tema" tab
3. Click any preset swatch:
   - 🟠 Orange (default)
   - 🔴 Red
   - 🔵 Blue
   - 🟢 Emerald
   - 🟣 Purple
4. Watch live preview update
5. Click "✓ Save Theme"
6. Navigate to `dashboard-active.html`
7. See theme applied everywhere

### Custom Color Test
1. Enter HEX in input: `#FF4500` (orange red)
2. See palette generate automatically
3. Check accessibility validation
4. If fails, see warning modal
5. Save or reset to default

### Color Persistence
1. Change theme and save
2. Close browser tab
3. Reopen any page
4. Theme should be restored from localStorage

---

## 🧪 Test Key Features

### Registration Form
- [x] Try 2-character name → Error
- [x] Try 101-character name → Error
- [x] Phone with 9 digits → Error
- [x] Invalid email format → Error
- [x] Submit without checking terms → Button disabled
- [x] Valid form → Button enabled, loading state

### OTP Input
- [x] Type 6 digits individually
- [x] Press Backspace in middle box
- [x] Press Arrow Left/Right
- [x] Paste "123456" from clipboard
- [x] Type wrong OTP → Shake animation
- [x] Wait for timer to hit 0 → Resend button enabled

### Queue Management
- [x] Search "John" → Filters instantly (300ms debounce)
- [x] Click "No" column header → Sort ascending/descending
- [x] Click ⋮ on row → Dropdown opens
- [x] Click outside dropdown → Closes
- [x] Click "Panggil" → Status changes to "Dipanggil"
- [x] Click "Selesai" → Confirmation dialog
- [x] Click "Batalkan" → Warning dialog
- [x] Wait 10 seconds → New queue arrives (yellow flash)
- [x] Press Spacebar → Calls first waiting queue

### Copy QR Link
- [x] Go to `dashboard.html`
- [x] Click "📋 Copy Link" button
- [x] See button change to "✓ Tersalin!"
- [x] Toast notification appears
- [x] Paste in notepad → Link copied correctly

### Welcome Banner
- [x] See blue gradient banner at top
- [x] Click "×" to dismiss
- [x] Refresh page → Banner gone (stored in localStorage)
- [x] Clear localStorage → Banner returns

---

## 🐛 Testing Edge Cases

### Empty States
- `dashboard.html` shows clipboard icon when no queues

### Loading States
- All buttons show spinner when processing
- Submit buttons disable during loading

### Error States
- Form validation errors show inline with red text
- OTP shake animation on wrong code
- Toast notifications for failures

### Success States
- Green checkmark animations
- Success badges
- Toast notifications for confirmations

### Mobile Interactions
- Touch targets are 44×44px minimum
- Swipe-to-dismiss toasts
- Card tap/click responses
- Dropdown touch interactions

---

## 📊 Sample Data Included

### Queue Data (dashboard-active.html)
- 15 pre-generated queues
- Mix of statuses: Menunggu, Dipanggil
- Names: John Doe, Jane Smith, Bob Wilson, etc.
- Party sizes: 1-6 people
- Time stamps: 2-minute intervals

### Restaurant Data
- Name: "Restoran Sedap" (from localStorage)
- Can be changed in registration flow

### Theme Data
- Default: Orange (#D97706)
- 8 preset colors available
- Saved in localStorage as JSON

---

## 💾 localStorage Keys

View in DevTools → Application → Local Storage:

```javascript
// Registration data
'registration-data': {
  restaurantName: "Restoran Sedap",
  verificationType: "phone",
  phone: "8123456789",
  timestamp: "2025-01-03T..."
}

// Theme settings
'app-theme': {
  primaryColor: "#D97706"
}

// UI preferences
'welcome-banner-dismissed': true
'notification-sound': true
```

To reset everything: `localStorage.clear()` in console

---

## 🎯 Key Components to Showcase

### 1. Real-time Queue Simulation
**Location:** `dashboard-active.html`
- Auto-generates new queue every 10 seconds
- Yellow flash animation on arrival
- Stats auto-update
- Notification sound plays (if enabled)

### 2. Theme Customization
**Location:** `settings.html` → Tema tab
- 10-shade palette generation
- WCAG contrast validation
- Live preview updates
- Accessibility warnings

### 3. OTP Input Component
**Location:** `verify.html`
- Auto-advance typing
- Paste support
- Keyboard navigation
- Error animations

### 4. Responsive Table
**Location:** `dashboard-active.html`
- Desktop: Full table with 7 columns
- Mobile: Vertical cards
- Sortable columns
- Action dropdowns

### 5. Search & Filter
**Location:** `dashboard-active.html`
- 300ms debounce
- Real-time filtering
- Result count display
- Highlights matches

---

## 🔧 Troubleshooting

### Issue: Theme not saving
**Solution:** Check browser console for localStorage errors. Try different browser.

### Issue: Real-time simulation not working
**Solution:** Check browser console for errors. Ensure JavaScript is enabled.

### Issue: Styles not loading
**Solution:** Verify CSS files exist in `/css/` folder. Check file paths in HTML.

### Issue: Fonts not loading
**Solution:** Check internet connection. Fonts load from Google Fonts CDN.

### Issue: Animations choppy
**Solution:** Try different browser. Chrome/Edge recommended for best performance.

### Issue: Mobile view not showing
**Solution:** Actually resize browser window or use DevTools device mode.

---

## 📁 File Structure Quick Reference

```
owner/
├── index.html              ← Start here (landing)
├── register.html           ← Registration form
├── verify.html             ← OTP (use code: 123456)
├── verify-email.html       ← Email verify (Ctrl+V)
├── dashboard.html          ← Empty state
├── dashboard-active.html   ← ⭐ Main demo (15 queues)
├── settings.html           ← Theme customization
├── css/
│   ├── main.css           ← Variables, base styles
│   ├── components.css     ← Buttons, cards, forms
│   └── animations.css     ← Keyframes, transitions
└── js/
    ├── utils.js           ← Toast, validation, helpers
    ├── otp-input.js       ← OTP component class
    ├── theme.js           ← Color, palette, WCAG
    └── queue.js           ← Queue management, simulation
```

---

## 🎬 5-Minute Demo Script

**For client presentation:**

1. **[0:00-0:30] Landing Page**
   - Open `index.html`
   - Scroll through features
   - "Let's register a restaurant"

2. **[0:30-1:00] Registration**
   - Click "Daftar Gratis"
   - Fill: "Cafe Demo" + phone
   - Show validation (try short name)
   - Submit successfully

3. **[1:00-1:30] OTP Verification**
   - Show 6-box input
   - Type "123456" smoothly
   - Show auto-advance
   - Success animation

4. **[1:30-2:00] Empty Dashboard**
   - Welcome banner
   - QR Display Link card
   - Click Copy Link → Success
   - Show empty state

5. **[2:00-3:30] Active Dashboard**
   - Navigate to Daftar Antrian
   - 15 queues visible
   - Demo search: "John"
   - Sort by clicking column
   - Click ⋮ → Call queue
   - Press Spacebar to call next
   - Wait for new queue (or mention simulation)

6. **[3:30-4:30] Theme Customization**
   - Click Settings ⚙️
   - Click Tema tab
   - Select Blue preset
   - Show live preview update
   - Show accessibility check
   - Save theme

7. **[4:30-5:00] Mobile Responsive**
   - Open DevTools
   - Toggle device mode
   - Select iPhone
   - Show mobile card view
   - Show hamburger menu
   - "Fully responsive for tablets and phones"

**Closing:** "This is a fully functional prototype with 6 pages, 4 JavaScript modules, real-time updates, and complete theme customization. Ready for backend integration."

---

## ✅ Final Checklist Before Demo

- [ ] All files in `/owner/` directory
- [ ] Open `dashboard-active.html` in browser
- [ ] Check browser console for errors (should be none)
- [ ] Verify real-time simulation is running
- [ ] Test quick actions (Spacebar, search, sort)
- [ ] Test theme change in settings
- [ ] Test mobile view in DevTools
- [ ] Clear localStorage if needed: `localStorage.clear()`
- [ ] Have OTP code ready: **123456**
- [ ] Know demo controls: Ctrl+V, Ctrl+E, Spacebar

---

## 🚀 Ready to Go!

Everything is set up and ready to demonstrate. Start with `dashboard-active.html` for the quickest wow factor, or go through the full flow for a complete experience.

**Enjoy exploring the prototype! 🎉**
