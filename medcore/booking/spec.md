# Patient Appointment Booking (Time Range) – MVP Specification (MVP)

> Goal: simplify booking to **date + time range** (e.g., Morning/Afternoon/Evening) with no minute-by-minute slots. Ship the smallest lovable flow for private practices and clinics.

---

## 1) Executive Summary

* **Product**: Mobile-first PWA for patients to book a doctor’s appointment by **choosing a day and a time range**. The system assigns the exact consult order within that range on arrival.
* **Primary users**: Patients (public), Providers (doctors/clinic admins).
* **Core outcome**: Reduce phone/WhatsApp chaos; standardize bookings; improve show-up rate with a simple arrival window.

### Tech (kept minimal)

* **Frontend**: Flutter Web (PWA), Riverpod for state.
* **Auth**: Phone OTP (Firebase Auth).
* **Backend**: REST JSON.
* **Payment (optional in MVP)**: QRIS (single provider).

---

## 2) MVP Scope (Nothing More)

1. **Clinic branding header**: logo + "Klinik Sehat" + tagline + WhatsApp hotline + language switcher (EN/ID).
2. **Home landing page**: campaign carousel + upcoming appointment card + clinic doctors preview.
3. Doctor discovery (basic): search by name/specialization.
4. Day picker (rolling 14 days).
5. Time-range availability (0–3 ranges per day): **Morning / Afternoon / Evening** (labels + configurable time window).
6. Booking form (minimum fields): Full name, Phone (for OTP), Reason (short text, optional).
7. Confirmation screen: date + chosen range + arrival guidance.
8. Manage booking: View booking, cancel.
9. (Optional toggle) Pay via QRIS after confirmation.

**Out of MVP**: minute slots, calendars with month view, full multilingual UI (only EN/ID switcher), ratings/reviews, patient journey tracking, complex payments (cards/VA), document uploads, care dashboards, advanced filters, animations beyond micro feedback.

---

## 3) Experience & Flows

### 3.1 Patient Flow (Happy Path)

1. **Home Landing** → clinic header (logo + name + hotline + language selector) + campaign carousel (3-5 slides) + upcoming appointment card (if any) + clinic doctors list with "View All" link.
2. **Search/Doctor List** → minimal search bar + "Find doctor" + cards show name, specialization, clinic, next available day tag.
3. **Doctor Detail** → day picker (Today + next 13), below it **Time Range chips** per selected day:

   * Chip states: Available (count), Limited (<3 left), Full (disabled).
   * Example label: `Morning (09:00–12:00) • 6 spots`.
4. **Select Range** → **Booking Sheet** slides up: Name, Phone, Reason (optional). CTA: “Confirm booking”.
5. **OTP Verify** (if not already verified) → 6-digit OTP.
6. **Confirmation** → Success check, summary (date, range), arrival tip: “Arrive within first 30 minutes of your window.”
7. (**Optional**) **Pay with QRIS** → single screen with dynamic QR and success state.

### 3.2 Edge/Recovery

* If range capacity is taken between select & confirm → show toast “Just filled. Pick another range” + refresh chips.
* If OTP fails → inline error with auto-focus.
* Poor network → retry banner and local optimistic UI for chip refresh.

---

## 4) Availability Model (Time Range, No Slots)

* Clinic defines up to **3 labeled ranges** per day:

  * `id`, `label` (e.g., Morning), `start`, `end`, `capacity` (integer), `buffer_mins` (optional), `notes` (optional).
* Availability response returns **remaining capacity** per range (integer). No minute slots.
* Booking reduces range capacity by 1 (atomic).
* Providers may **overbook tolerance** per range (e.g., +1) — default 0.

### Patient Guidance

* Confirmation always displays the chosen **window** (e.g., 09:00–12:00) and “estimated service order on arrival”.

---

## 5) UI/UX – Minimal, Crisp, Touch-First

### 5.1 Components

* **Clinic Header**: logo (left) + clinic name "Klinik Sehat" + tagline "melayani dengan sepenuh hati" + WhatsApp hotline (+6233123332) + language selector (EN/ID).
* **Campaign Carousel**: horizontal swipeable cards (3-5 slides), auto-play 5s, dot indicators.
* **Upcoming Appointment Card**: shows next appointment with date, doctor, time range, "View Details" link.
* **Clinic Doctors Section**: 2-3 doctor cards preview with "View All Doctors" button.
* **Search Bar** (sticky on top): debounce 300ms.
* **Doctor Card**: avatar, name, specialization, clinic name, small pill: `Next: Tue AM`.
* **Day Picker**: horizontal chip list (14 items). States: today (outlined), selected (filled), disabled (no ranges available).
* **Range Chips**: large tappable chips with two-line content:

  * Line 1: `Morning (09:00–12:00)`
  * Line 2 (caption): availability `• Spots: 6` or `Limited` (<3) or `Full`.
* **Booking Bottom Sheet**: 3 fields, one CTA. Keyboard-safe, haptic on CTA.
* **Confirmation Card**: date, range, clinic address (map deep link), Add to Calendar.
* **Ticket Code**: short code (e.g., `MC-7F21`), used at front desk.

### 5.2 Micro-interactions

* Campaign carousel → auto-advance 5s, swipe gesture, fade transition.
* Chip tap → 100–150ms scale ripple.
* Range availability update → count animates with odometer (fast 200ms).
* Success → checkmark draw (300ms) + light haptic.
* Error → subtle shake (120ms) + inline message.
* "View All Doctors" → smooth scroll to full doctor list section.

### 5.3 Empty & Loading

* Skeletons for campaign carousel, upcoming appointment, and doctor preview.
* Skeletons for doctor list and range chips.
* Empty doctor search → "No matches. Try a different name or specialty."
* Day has no ranges → show state card "Not available this day."
* No upcoming appointments → hide card or show "No upcoming appointments" message.

### 5.4 Accessibility

* 48px min touch targets, text min 14sp, label every input, semantic roles.

---

## 6) Data & API (MVP Only)

### 6.1 Data Structures (simplified)

```json
// Campaign (carousel)
{
  "id": "camp_001",
  "title": "Free Health Checkup",
  "subtitle": "This Month Only",
  "imageUrl": "...",
  "ctaText": "Book Now",
  "ctaUrl": "/promo/health-checkup",
  "priority": 1
}

// Doctor (list)
{
  "id": "doc_123",
  "name": "Dr. Sari",
  "specialization": "Pediatrician",
  "clinic": "Klinik Sehat",
  "avatarUrl": "…"
}

// Availability (per doctor per date)
{
  "doctorId": "doc_123",
  "date": "2025-09-23",
  "ranges": [
    { "id": "am", "label": "Morning", "start": "09:00", "end": "12:00", "remaining": 6 },
    { "id": "pm", "label": "Afternoon", "start": "13:00", "end": "16:00", "remaining": 2 }
  ]
}

// Appointment (created)
{
  "id": "apt_456",
  "doctorId": "doc_123",
  "patient": { "name": "Budi", "phone": "+62…" },
  "date": "2025-09-24",
  "rangeId": "am",
  "rangeLabel": "Morning",
  "window": { "start": "09:00", "end": "12:00" },
  "status": "confirmed",
  "ticket": "MC-7F21"
}
```

### 6.2 Endpoints

* `GET /campaigns` – returns active campaign slides for carousel.
* `GET /appointments/upcoming?phone=` – returns next appointment for logged user.
* `GET /doctors?limit=3` – returns clinic doctors preview for home page.
* `GET /doctors?query=` – basic search.
* `GET /doctors/{id}/availability?date=YYYY-MM-DD` – returns ranges with remaining counts.
* `POST /appointments` – body: doctorId, date, rangeId, patient {name, phone}, reason? → returns appointment.
* `GET /appointments/{id}` – fetch details.
* `DELETE /appointments/{id}` – cancel.
* (**Optional**) `POST /payments/qris` – appointmentId → returns QR payload + status polling id.

### 6.3 Rules

* Capacity decrement must be transactional.
* Double-book protection: unique constraint on (doctorId, date, rangeId, patient.phone) within 5 minutes.
* Phone must be OTP-verified prior to create.

---

## 7) Provider (Admin) Minimal Setup

* Define clinic: name, address, time zone.
* Define doctor: name, specialization, visibility toggle.
* Define **default daily ranges** with time windows + capacity.
* Per-date overrides (closed day / edited capacity).

(Everything else deferred.)

---

## 8) Payment (Optional Switch)

* Single method: **QRIS**.
* Flow: Confirmation → Pay button → show QR (5–10 min expiry) → poll → success tag on appointment.
* If expired/unpaid → appointment still **confirmed** (pay at clinic). Payment is not a blocker for MVP.

---

## 9) Non-Functional (MVP Bar)

* TTFB < 1.5s on 4G; interactive < 3s.
* 99.5% uptime target.
* Basic analytics: search → detail → range select → confirm events.
* Privacy: HTTPS everywhere, JWT for API, PII at rest encrypted.

---

## 10) Design System (Trimmed)

* **Colors**: Primary `#0066FF`, Success `#10B981`, Error `#EF4444`, Neutral greys.
* **Typography**: Inter; headings 20/24/32, body 14/16.
* **Elevation**: cards 2dp, on-press +2dp.
* **Chips**: 12px radius, filled (selected) vs outline (default), icons optional.
* **Buttons**: primary filled, secondary outline; full-width on mobile.

---

## 11) Testing

* Unit: capacity decrement, OTP flow.
* Widget: day picker & range chip states.
* Integration: create→fetch→cancel; QRIS happy path.

---

## 12) Cut List (Explicitly Not in MVP)

* Minute slots, queue position, journey tracking, multilingual UI, insurance, reviews, advanced filters, records upload, family accounts, VA/Card payments, push notifications, calendars month view.

---

## 13) Implementation Notes (Flutter)

* Riverpod providers: `doctorSearchProvider`, `availabilityProvider(doctorId,date)`, `bookingProvider` (mutable state for name/phone/reason/range), `otpProvider`.
* Debounce search: 300ms. Guard network with retry/backoff.
* Animations: use `AnimatedScale`, `AnimatedOpacity`, no heavy libraries. Haptic via `HapticFeedback.lightImpact()` on key actions.

---

## 14) Front Desk Playbook (Displayed on Confirmation)

* “Show your **Ticket Code** at reception.”
* “You’ll be seen **within** your chosen window.”
* Late policy copy (short, configurable).

---

**MVP ends here.**
