# 🚀 Quick Demo Guide

## How to View the Prototype (3 Easy Steps)

### Method 1: Direct Open (Fastest)
1. Navigate to: `/home/rofiq/Projects/design/klinik/patient/`
2. Double-click `index.html`
3. Your default browser will open the prototype!

### Method 2: Terminal Command
```bash
cd /home/rofiq/Projects/design/klinik/patient
xdg-open index.html  # Linux
# or
open index.html      # macOS
# or
start index.html     # Windows
```

### Method 3: Local Server (Best for Development)
```bash
cd /home/rofiq/Projects/design/klinik/patient
python3 -m http.server 8080
```
Then open: http://localhost:8080

---

## 🎯 Demo Walkthrough (5 Minutes)

### Scenario 1: Fast-Track Booking (Paid)
**Goal**: Book a paid appointment with specific time

1. **Doctor Selection**
   - Click on "Dr. Ahmad Surya" card
   - Notice the card highlight and checkmark animation
   - Click "Lanjut" button

2. **Date Selection**
   - Click on any green (available) date
   - Try clicking gray dates to see they're disabled
   - Notice the selected date displayed below calendar
   - Click "Lanjut"

3. **Booking Type**
   - Click "Fast-Track" card (left side)
   - Watch the time slots appear with animation
   - Select "10:00" time slot
   - Notice gradient background on selected slot
   - Click "Lanjut"

4. **Patient Information**
   - Enter name: `Budi Santoso`
   - Enter phone: `081234567890`
   - Enter email (optional): `budi@example.com`
   - Click "Lanjut"

5. **Payment**
   - Click "QRIS" payment method
   - QR code appears with timer
   - Click "Simulasi Pembayaran Berhasil" button
   - Watch confetti animation! 🎉

6. **Confirmation**
   - View booking details
   - Copy booking number
   - Download calendar file (.ics)

---

### Scenario 2: Regular Booking (Free)
**Goal**: Make a free reservation without specific time

1. Select doctor → Select date (same as above)
2. Click "Reservasi Biasa" card
3. Notice: "No time selection needed" info box
4. Fill patient details
5. Direct to confirmation (no payment)

---

## 🔍 Features to Test

### Visual & Interactive
- [ ] **Responsive Design**: Resize browser window (mobile ↔ desktop)
- [ ] **Hover Effects**: Move mouse over cards and buttons
- [ ] **Loading States**: Watch skeleton loaders during transitions
- [ ] **Animations**: Notice smooth transitions between steps
- [ ] **Toast Notifications**: Copy booking number to see toast

### Functionality
- [ ] **Back Navigation**: Use ← buttons to go back
- [ ] **Form Validation**: Submit invalid phone number (try "123")
- [ ] **Calendar Navigation**: Change months with arrows
- [ ] **State Persistence**: Refresh page mid-booking (state saved!)
- [ ] **Payment Methods**: Try all 3 payment options

### Accessibility
- [ ] **Keyboard Navigation**: Use Tab key to navigate
- [ ] **Focus Indicators**: Notice cyan outlines on focus
- [ ] **Screen Reader**: Enable screen reader (if available)

---

## 📱 Device Testing

### Desktop (Chrome DevTools)
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Try these devices:
   - iPhone 12 Pro (390x844)
   - iPad Pro (1024x1366)
   - Laptop (1440x900)

### Actual Mobile Device
1. Start local server (Method 3 above)
2. Find your computer's IP: `ip addr show` (Linux)
3. On phone, open: `http://YOUR_IP:8080`

---

## 🎨 Design Highlights to Notice

1. **Modern Banking Aesthetic**
   - Cyan/turquoise primary color (#00CED1)
   - Soft rounded corners (20px cards)
   - Subtle shadows and gradients

2. **Micro-interactions**
   - Card scale on hover
   - Button lift effect
   - Progress stepper animation
   - Checkmark drawing animation

3. **Typography**
   - Inter font (clean, modern)
   - Clear hierarchy (headings, body, labels)
   - Proper contrast for readability

4. **Spacing**
   - 8px grid system
   - Consistent padding and margins
   - Balanced white space

---

## 🐛 Troubleshooting

### Problem: Page doesn't load
- **Solution**: Check browser console (F12) for errors
- Ensure all files are in correct directories

### Problem: Animations not smooth
- **Solution**: Close other browser tabs, check CPU usage
- Try disabling browser extensions

### Problem: State not persisting
- **Solution**: Check if cookies/storage enabled
- Not in incognito mode (session storage works differently)

### Problem: Responsive layout broken
- **Solution**: Hard refresh (Ctrl+Shift+R)
- Clear browser cache

---

## 📊 Prototype Specifications

| Metric | Value |
|--------|-------|
| Total Pages | 2 (index + confirmation) |
| Total Files | 6 (2 HTML, 1 CSS, 3 JS) |
| Lines of Code | ~2,800+ lines |
| Sample Doctors | 4 doctors with photos |
| Availability Window | Next 14 days |
| Time Slots per Day | ~16 slots (9:00-17:00) |
| Payment Methods | 3 (QRIS, Bank, Card) |
| Load Time | < 3 seconds on 3G |

---

## 💡 Pro Tips

1. **Best Experience**: Use Chrome or Firefox on desktop
2. **Mobile Testing**: Safari on iOS, Chrome on Android
3. **Network Simulation**: DevTools → Network → "Slow 3G"
4. **State Inspection**: DevTools → Application → Session Storage
5. **Screenshot**: Use DevTools device toolbar for mockups

---

## 🎯 What to Show Stakeholders

### For Product Managers
- Complete user flow (doctor → payment → confirmation)
- Fast-Track vs Regular booking options
- Form validation and error handling
- Mobile responsiveness

### For Designers
- Design system implementation (colors, spacing, typography)
- Micro-interactions and animations
- Accessibility features (focus states, contrast)
- Responsive breakpoints

### For Developers
- Code structure and organization
- State management (session storage)
- Component reusability
- API integration points (see `// In real app...` comments)

### For Business Stakeholders
- User-friendly booking process (< 2 minutes)
- Payment flow simulation
- Professional appearance
- Mobile-first approach

---

## 📸 Screenshot Checklist

Capture these screens for documentation:
1. Landing page with doctor cards
2. Calendar with selected date
3. Booking type selection (both cards)
4. Time slot grid (Fast-Track)
5. Patient information form
6. Payment method selection
7. QR code display
8. Confirmation page
9. Mobile view (vertical)
10. Tablet view (side-by-side)

---

## 🚀 Next Steps After Demo

1. **Gather Feedback**: Note what stakeholders like/dislike
2. **Iterate Design**: Make adjustments based on feedback
3. **Plan Backend**: Review API integration points
4. **Set Up Dev Environment**: Prepare for React/Next.js version
5. **Create Backlog**: Convert feedback to development tasks

---

**Enjoy the demo! 🎉**

For questions: Check README.md for detailed documentation
