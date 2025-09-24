# Patient Booking Web Frontend Guide

A focused implementation guide for building the MedCore patient booking system as a mobile-first HTML prototype.

## Quick Start Overview

**Goal**: Build a time-range booking system (Morning/Afternoon/Evening) with no minute slots.
**Core Flow**: Search doctors → Pick day → Select time range → Book → Confirm

---

## 1. HTML Structure & Semantic Markup

### Base HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#0066FF">
    <title>MedCore Booking</title>
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <!-- Main container -->
        <main class="main-container" role="main">
            <!-- Content sections go here -->
        </main>

        <!-- Loading overlay -->
        <div id="loading-overlay" class="loading-overlay hidden" aria-hidden="true">
            <div class="spinner"></div>
        </div>

        <!-- Toast container -->
        <div id="toast-container" class="toast-container" aria-live="polite"></div>
    </div>

    <script src="app.js"></script>
</body>
</html>
```

### Search Section

```html
<section class="search-section">
    <div class="search-container">
        <label for="doctor-search" class="sr-only">Search for doctors</label>
        <input
            type="search"
            id="doctor-search"
            class="search-input"
            placeholder="Search doctors or specialization"
            autocomplete="off"
            role="searchbox"
            aria-describedby="search-hint">
        <span id="search-hint" class="sr-only">Start typing to search for doctors</span>
    </div>
</section>
```

### Doctor Results

```html
<section class="doctor-results" aria-label="Doctor search results">
    <div class="doctor-list" role="list">
        <!-- Doctor cards populated by JS -->
    </div>

    <!-- Empty state -->
    <div class="empty-state hidden" role="status">
        <p>No matches. Try a different name or specialty.</p>
    </div>
</section>
```

### Doctor Detail & Booking

```html
<section class="doctor-detail hidden">
    <header class="doctor-header">
        <button class="back-btn" aria-label="Go back to search">←</button>
        <div class="doctor-info">
            <img class="doctor-avatar" alt="">
            <div>
                <h1 class="doctor-name"></h1>
                <p class="doctor-specialty"></p>
                <p class="clinic-name"></p>
            </div>
        </div>
    </header>

    <!-- Day picker -->
    <div class="day-picker">
        <h2>Select Date</h2>
        <div class="day-chips" role="radiogroup" aria-label="Available dates">
            <!-- Day chips populated by JS -->
        </div>
    </div>

    <!-- Time ranges -->
    <div class="time-ranges">
        <h2>Available Times</h2>
        <div class="range-chips" role="radiogroup" aria-label="Available time slots">
            <!-- Range chips populated by JS -->
        </div>

        <!-- No availability state -->
        <div class="no-availability hidden" role="status">
            <p>Not available this day.</p>
        </div>
    </div>
</section>
```

### Booking Bottom Sheet

```html
<div class="bottom-sheet hidden" id="booking-sheet" role="dialog" aria-labelledby="booking-title">
    <div class="sheet-overlay" aria-hidden="true"></div>
    <form class="sheet-content" id="booking-form">
        <div class="sheet-handle" aria-hidden="true"></div>

        <h2 id="booking-title">Book Appointment</h2>

        <div class="form-group">
            <label for="patient-name">Full Name *</label>
            <input type="text" id="patient-name" name="name" required
                   autocomplete="name" aria-describedby="name-error">
            <span class="error-message" id="name-error" role="alert"></span>
        </div>

        <div class="form-group">
            <label for="patient-phone">Phone Number *</label>
            <input type="tel" id="patient-phone" name="phone" required
                   autocomplete="tel" aria-describedby="phone-error">
            <span class="error-message" id="phone-error" role="alert"></span>
        </div>

        <div class="form-group">
            <label for="visit-reason">Reason for Visit (Optional)</label>
            <textarea id="visit-reason" name="reason" rows="3"
                     placeholder="Brief description..."></textarea>
        </div>

        <button type="submit" class="btn-primary btn-full">
            Confirm Booking
        </button>
    </form>
</div>
```

### Confirmation Screen

```html
<section class="confirmation hidden" role="status" aria-live="polite">
    <div class="success-icon">✓</div>
    <h1>Booking Confirmed!</h1>

    <div class="booking-summary">
        <h2>Appointment Details</h2>
        <dl class="appointment-info">
            <dt>Doctor</dt>
            <dd class="doctor-info"></dd>

            <dt>Date & Time</dt>
            <dd class="datetime-info"></dd>

            <dt>Ticket Code</dt>
            <dd class="ticket-code"></dd>
        </dl>
    </div>

    <div class="arrival-guidance">
        <h3>Important</h3>
        <p>Arrive within the first 30 minutes of your window. Show your ticket code at reception.</p>
    </div>

    <div class="actions">
        <button class="btn-secondary">Add to Calendar</button>
        <button class="btn-primary">Book Another</button>
    </div>
</section>
```

---

## 2. CSS Design System

### CSS Custom Properties (Design Tokens)

```css
:root {
    /* Colors */
    --color-primary: #0066FF;
    --color-primary-dark: #0052CC;
    --color-success: #10B981;
    --color-error: #EF4444;
    --color-warning: #F59E0B;

    --color-text: #111827;
    --color-text-secondary: #6B7280;
    --color-text-muted: #9CA3AF;

    --color-bg: #FFFFFF;
    --color-bg-secondary: #F9FAFB;
    --color-bg-elevated: #FFFFFF;
    --color-border: #E5E7EB;
    --color-border-light: #F3F4F6;

    /* Typography */
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-size-xs: 0.75rem;    /* 12px */
    --font-size-sm: 0.875rem;   /* 14px */
    --font-size-base: 1rem;     /* 16px */
    --font-size-lg: 1.125rem;   /* 18px */
    --font-size-xl: 1.25rem;    /* 20px */
    --font-size-2xl: 1.5rem;    /* 24px */
    --font-size-3xl: 2rem;      /* 32px */

    /* Spacing */
    --space-xs: 0.25rem;   /* 4px */
    --space-sm: 0.5rem;    /* 8px */
    --space-md: 1rem;      /* 16px */
    --space-lg: 1.5rem;    /* 24px */
    --space-xl: 2rem;      /* 32px */
    --space-2xl: 3rem;     /* 48px */

    /* Layout */
    --container-max-width: 400px;
    --touch-target-min: 48px;
    --border-radius-sm: 8px;
    --border-radius-md: 12px;
    --border-radius-lg: 16px;
    --border-radius-full: 9999px;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

    /* Animation */
    --duration-fast: 150ms;
    --duration-normal: 200ms;
    --duration-slow: 300ms;
    --easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Base Styles

```css
* {
    box-sizing: border-box;
}

body {
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    line-height: 1.5;
    color: var(--color-text);
    background: var(--color-bg);
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.main-container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: var(--space-md);
    min-height: 100vh;
}

/* Screen reader only */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.hidden {
    display: none !important;
}
```

### Component Styles

```css
/* Search Input */
.search-container {
    position: sticky;
    top: var(--space-md);
    z-index: 10;
    margin-bottom: var(--space-lg);
}

.search-input {
    width: 100%;
    padding: var(--space-md);
    font-size: var(--font-size-base);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-lg);
    background: var(--color-bg-elevated);
    box-shadow: var(--shadow-sm);
    transition: border-color var(--duration-fast) var(--easing);
}

.search-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(0 102 255 / 0.1);
}

/* Doctor Cards */
.doctor-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.doctor-card {
    display: flex;
    align-items: center;
    padding: var(--space-lg);
    background: var(--color-bg-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
    min-height: var(--touch-target-min);
}

.doctor-card:hover,
.doctor-card:focus {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.doctor-card:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
}

.doctor-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius-full);
    background: var(--color-bg-secondary);
    margin-right: var(--space-md);
    object-fit: cover;
}

.doctor-name {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: 0 0 var(--space-xs) 0;
}

.doctor-specialty,
.clinic-name {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
}

.next-available {
    margin-left: auto;
    font-size: var(--font-size-xs);
    padding: var(--space-xs) var(--space-sm);
    background: var(--color-success);
    color: white;
    border-radius: var(--border-radius-full);
}

/* Day Picker */
.day-picker {
    margin: var(--space-xl) 0;
}

.day-chips {
    display: flex;
    gap: var(--space-sm);
    overflow-x: auto;
    padding: var(--space-sm) 0;
    -webkit-overflow-scrolling: touch;
}

.day-chip {
    flex: 0 0 auto;
    min-width: 80px;
    padding: var(--space-md) var(--space-sm);
    text-align: center;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    background: var(--color-bg);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
    min-height: var(--touch-target-min);
}

.day-chip.selected {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.day-chip.today {
    border-color: var(--color-primary);
    border-width: 2px;
}

.day-chip:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Range Chips */
.range-chips {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.range-chip {
    padding: var(--space-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    background: var(--color-bg);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
    min-height: var(--touch-target-min);
}

.range-chip:hover:not(:disabled) {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
}

.range-chip.selected {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.range-chip:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.range-time {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--space-xs);
}

.range-availability {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

.range-chip.selected .range-availability {
    color: rgba(255, 255, 255, 0.8);
}

.range-availability.limited {
    color: var(--color-warning);
}

.range-availability.full {
    color: var(--color-error);
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-md) var(--space-lg);
    font-size: var(--font-size-base);
    font-weight: 600;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing);
    min-height: var(--touch-target-min);
    text-decoration: none;
}

.btn-primary {
    background: var(--color-primary);
    color: white;
}

.btn-primary:hover {
    background: var(--color-primary-dark);
}

.btn-secondary {
    background: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
}

.btn-secondary:hover {
    background: var(--color-primary);
    color: white;
}

.btn-full {
    width: 100%;
}

/* Bottom Sheet */
.bottom-sheet {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    opacity: 0;
    visibility: hidden;
    transition: all var(--duration-normal) var(--easing);
}

.bottom-sheet.visible {
    opacity: 1;
    visibility: visible;
}

.sheet-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
}

.sheet-content {
    position: relative;
    width: 100%;
    max-width: var(--container-max-width);
    margin: 0 auto;
    background: white;
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    padding: var(--space-lg);
    transform: translateY(100%);
    transition: transform var(--duration-normal) var(--easing);
}

.bottom-sheet.visible .sheet-content {
    transform: translateY(0);
}

.sheet-handle {
    width: 32px;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    margin: 0 auto var(--space-lg);
}

/* Form Elements */
.form-group {
    margin-bottom: var(--space-lg);
}

.form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: var(--space-sm);
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-base);
    transition: border-color var(--duration-fast) var(--easing);
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(0 102 255 / 0.1);
}

.error-message {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--color-error);
    margin-top: var(--space-xs);
}

/* Loading & Toast */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.toast-container {
    position: fixed;
    top: var(--space-lg);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1500;
}

.toast {
    padding: var(--space-md) var(--space-lg);
    background: var(--color-text);
    color: white;
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    opacity: 0;
    transform: translateY(-10px);
    transition: all var(--duration-fast) var(--easing);
}

.toast.show {
    opacity: 1;
    transform: translateY(0);
}

.toast.error {
    background: var(--color-error);
}

.toast.success {
    background: var(--color-success);
}
```

### Responsive Design

```css
/* Mobile-first responsive breakpoints */
@media (min-width: 768px) {
    .main-container {
        padding: var(--space-lg);
    }

    .doctor-card {
        padding: var(--space-xl);
    }

    .range-chips {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-lg);
    }
}

@media (min-width: 1024px) {
    :root {
        --container-max-width: 600px;
    }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    :root {
        --color-border: #000000;
        --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.2);
        --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3);
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 3. JavaScript Implementation

### App Structure

```javascript
class MedCoreApp {
    constructor() {
        this.state = {
            currentView: 'search',
            doctors: [],
            selectedDoctor: null,
            selectedDate: null,
            selectedRange: null,
            bookingData: {
                name: '',
                phone: '',
                reason: ''
            },
            loading: false
        };

        this.API_BASE = 'https://api.medcore.example.com';
        this.debounceTimer = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPWA();
        this.showView('search');
    }

    // Event binding
    bindEvents() {
        // Search
        const searchInput = document.getElementById('doctor-search');
        searchInput.addEventListener('input', (e) => {
            this.debounceSearch(e.target.value);
        });

        // Bottom sheet
        const bookingSheet = document.getElementById('booking-sheet');
        const overlay = bookingSheet.querySelector('.sheet-overlay');
        overlay.addEventListener('click', () => {
            this.hideBookingSheet();
        });

        // Form submission
        const bookingForm = document.getElementById('booking-form');
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBookingSubmit();
        });

        // Back navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('back-btn')) {
                this.goBack();
            }
        });
    }

    // Search functionality
    debounceSearch(query) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.searchDoctors(query);
        }, 300);
    }

    async searchDoctors(query) {
        if (query.length < 2) {
            this.renderDoctors([]);
            return;
        }

        try {
            this.setLoading(true);
            const response = await fetch(`${this.API_BASE}/doctors?query=${encodeURIComponent(query)}`);
            const doctors = await response.json();

            this.state.doctors = doctors;
            this.renderDoctors(doctors);
        } catch (error) {
            this.showToast('Failed to search doctors. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // Render doctors
    renderDoctors(doctors) {
        const container = document.querySelector('.doctor-list');
        const emptyState = document.querySelector('.empty-state');

        if (doctors.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        container.innerHTML = doctors.map(doctor => `
            <article class="doctor-card"
                     role="button"
                     tabindex="0"
                     data-doctor-id="${doctor.id}"
                     onclick="app.selectDoctor('${doctor.id}')"
                     onkeydown="app.handleCardKeydown(event, '${doctor.id}')">
                <img class="doctor-avatar"
                     src="${doctor.avatarUrl || '/placeholder-doctor.png'}"
                     alt="Dr. ${doctor.name}">
                <div class="doctor-details">
                    <h3 class="doctor-name">${doctor.name}</h3>
                    <p class="doctor-specialty">${doctor.specialization}</p>
                    <p class="clinic-name">${doctor.clinic}</p>
                </div>
                <span class="next-available">Next: Mon AM</span>
            </article>
        `).join('');
    }

    // Handle card keyboard navigation
    handleCardKeydown(event, doctorId) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.selectDoctor(doctorId);
        }
    }

    // Doctor selection
    async selectDoctor(doctorId) {
        const doctor = this.state.doctors.find(d => d.id === doctorId);
        if (!doctor) return;

        this.state.selectedDoctor = doctor;
        this.showView('doctor-detail');

        // Load availability for next 14 days
        await this.loadDoctorAvailability(doctorId);
    }

    async loadDoctorAvailability(doctorId) {
        try {
            this.setLoading(true);

            // Generate next 14 days
            const dates = this.getNext14Days();

            // For demo, we'll load today's availability
            const today = dates[0];
            const response = await fetch(`${this.API_BASE}/doctors/${doctorId}/availability?date=${today.date}`);
            const availability = await response.json();

            this.renderDayPicker(dates);
            this.renderAvailability(availability, today.date);

        } catch (error) {
            this.showToast('Failed to load availability.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    getNext14Days() {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            days.push({
                date: date.toISOString().split('T')[0],
                dayName: date.toLocaleDateString('en', { weekday: 'short' }),
                dayNumber: date.getDate(),
                isToday: i === 0
            });
        }

        return days;
    }

    renderDayPicker(dates) {
        const container = document.querySelector('.day-chips');

        container.innerHTML = dates.map(day => `
            <button class="day-chip ${day.isToday ? 'today' : ''}"
                    data-date="${day.date}"
                    onclick="app.selectDate('${day.date}')"
                    role="radio"
                    aria-checked="false">
                <div class="day-name">${day.dayName}</div>
                <div class="day-number">${day.dayNumber}</div>
            </button>
        `).join('');

        // Select today by default
        if (dates.length > 0) {
            this.selectDate(dates[0].date);
        }
    }

    async selectDate(date) {
        // Update UI
        document.querySelectorAll('.day-chip').forEach(chip => {
            chip.classList.remove('selected');
            chip.setAttribute('aria-checked', 'false');
        });

        const selectedChip = document.querySelector(`[data-date="${date}"]`);
        selectedChip.classList.add('selected');
        selectedChip.setAttribute('aria-checked', 'true');

        this.state.selectedDate = date;

        // Load availability for selected date
        try {
            this.setLoading(true);
            const response = await fetch(`${this.API_BASE}/doctors/${this.state.selectedDoctor.id}/availability?date=${date}`);
            const availability = await response.json();

            this.renderAvailability(availability, date);
        } catch (error) {
            this.showToast('Failed to load availability.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    renderAvailability(availability, date) {
        const container = document.querySelector('.range-chips');
        const noAvailability = document.querySelector('.no-availability');

        if (!availability.ranges || availability.ranges.length === 0) {
            container.innerHTML = '';
            noAvailability.classList.remove('hidden');
            return;
        }

        noAvailability.classList.add('hidden');

        container.innerHTML = availability.ranges.map(range => {
            let availabilityClass = '';
            let availabilityText = `Spots: ${range.remaining}`;

            if (range.remaining === 0) {
                availabilityClass = 'full';
                availabilityText = 'Full';
            } else if (range.remaining < 3) {
                availabilityClass = 'limited';
                availabilityText = 'Limited';
            }

            return `
                <button class="range-chip"
                        data-range-id="${range.id}"
                        onclick="app.selectRange('${range.id}')"
                        ${range.remaining === 0 ? 'disabled' : ''}
                        role="radio"
                        aria-checked="false">
                    <div class="range-time">${range.label} (${range.start}–${range.end})</div>
                    <div class="range-availability ${availabilityClass}">• ${availabilityText}</div>
                </button>
            `;
        }).join('');
    }

    selectRange(rangeId) {
        const availability = this.getCurrentAvailability();
        const range = availability.ranges.find(r => r.id === rangeId);

        if (!range || range.remaining === 0) return;

        // Update UI
        document.querySelectorAll('.range-chip').forEach(chip => {
            chip.classList.remove('selected');
            chip.setAttribute('aria-checked', 'false');
        });

        const selectedChip = document.querySelector(`[data-range-id="${rangeId}"]`);
        selectedChip.classList.add('selected');
        selectedChip.setAttribute('aria-checked', 'true');

        this.state.selectedRange = range;
        this.showBookingSheet();
    }

    // Bottom sheet management
    showBookingSheet() {
        const sheet = document.getElementById('booking-sheet');
        sheet.classList.remove('hidden');

        // Trigger animation
        requestAnimationFrame(() => {
            sheet.classList.add('visible');
        });

        // Focus first input
        setTimeout(() => {
            document.getElementById('patient-name').focus();
        }, 300);
    }

    hideBookingSheet() {
        const sheet = document.getElementById('booking-sheet');
        sheet.classList.remove('visible');

        setTimeout(() => {
            sheet.classList.add('hidden');
        }, 200);
    }

    // Form handling
    async handleBookingSubmit() {
        const formData = new FormData(document.getElementById('booking-form'));
        const bookingData = {
            name: formData.get('name').trim(),
            phone: formData.get('phone').trim(),
            reason: formData.get('reason').trim()
        };

        // Validation
        if (!this.validateBookingData(bookingData)) {
            return;
        }

        try {
            this.setLoading(true);

            const response = await fetch(`${this.API_BASE}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorId: this.state.selectedDoctor.id,
                    date: this.state.selectedDate,
                    rangeId: this.state.selectedRange.id,
                    patient: {
                        name: bookingData.name,
                        phone: bookingData.phone
                    },
                    reason: bookingData.reason || null
                })
            });

            if (!response.ok) {
                throw new Error('Booking failed');
            }

            const appointment = await response.json();

            this.hideBookingSheet();
            this.showConfirmation(appointment);

        } catch (error) {
            this.showToast('Booking failed. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    validateBookingData(data) {
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });

        // Name validation
        if (!data.name || data.name.length < 2) {
            this.showFieldError('name-error', 'Please enter a valid name');
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            this.showFieldError('phone-error', 'Please enter a valid phone number');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = message;

        // Add error styling to input
        const input = errorElement.previousElementSibling;
        input.style.borderColor = 'var(--color-error)';

        // Remove error styling on focus
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--color-primary)';
            errorElement.textContent = '';
        }, { once: true });
    }

    // Confirmation screen
    showConfirmation(appointment) {
        this.showView('confirmation');

        // Populate confirmation details
        document.querySelector('.confirmation .doctor-info').textContent =
            `${this.state.selectedDoctor.name} - ${this.state.selectedDoctor.specialization}`;

        document.querySelector('.confirmation .datetime-info').innerHTML = `
            ${this.formatDate(appointment.date)}<br>
            ${appointment.rangeLabel} (${appointment.window.start}–${appointment.window.end})
        `;

        document.querySelector('.confirmation .ticket-code').textContent = appointment.ticket;

        // Success animation
        this.animateSuccess();
    }

    animateSuccess() {
        const icon = document.querySelector('.success-icon');
        icon.style.transform = 'scale(0)';

        setTimeout(() => {
            icon.style.transform = 'scale(1)';
            icon.style.transition = 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 100);

        // Haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    // Utility methods
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.search-section, .doctor-results, .doctor-detail, .confirmation')
            .forEach(section => section.classList.add('hidden'));

        // Show target view
        switch (viewName) {
            case 'search':
                document.querySelector('.search-section').classList.remove('hidden');
                document.querySelector('.doctor-results').classList.remove('hidden');
                break;
            case 'doctor-detail':
                document.querySelector('.doctor-detail').classList.remove('hidden');
                break;
            case 'confirmation':
                document.querySelector('.confirmation').classList.remove('hidden');
                break;
        }

        this.state.currentView = viewName;
    }

    goBack() {
        switch (this.state.currentView) {
            case 'doctor-detail':
                this.showView('search');
                break;
            case 'confirmation':
                this.showView('search');
                // Reset state
                this.state.selectedDoctor = null;
                this.state.selectedDate = null;
                this.state.selectedRange = null;
                break;
        }
    }

    setLoading(isLoading) {
        const overlay = document.getElementById('loading-overlay');
        if (isLoading) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
        this.state.loading = isLoading;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                container.removeChild(toast);
            }, 150);
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getCurrentAvailability() {
        // In a real app, this would come from state or API
        // For demo purposes, return mock data
        return {
            ranges: [
                { id: 'am', label: 'Morning', start: '09:00', end: '12:00', remaining: 6 },
                { id: 'pm', label: 'Afternoon', start: '13:00', end: '16:00', remaining: 2 }
            ]
        };
    }

    // PWA setup
    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }

        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            // Show install button if needed
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MedCoreApp();
});
```

### Form Validation & OTP

```javascript
class OTPManager {
    constructor() {
        this.currentPhone = null;
        this.otpTimer = null;
    }

    async sendOTP(phoneNumber) {
        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneNumber })
            });

            if (response.ok) {
                this.currentPhone = phoneNumber;
                this.startOTPTimer();
                return true;
            }

            throw new Error('Failed to send OTP');
        } catch (error) {
            console.error('OTP send error:', error);
            return false;
        }
    }

    async verifyOTP(code) {
        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: this.currentPhone,
                    code: code
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                return true;
            }

            throw new Error('Invalid OTP');
        } catch (error) {
            console.error('OTP verification error:', error);
            return false;
        }
    }

    startOTPTimer() {
        let seconds = 60;
        const button = document.getElementById('resend-otp');

        this.otpTimer = setInterval(() => {
            if (seconds > 0) {
                button.textContent = `Resend OTP (${seconds}s)`;
                button.disabled = true;
                seconds--;
            } else {
                button.textContent = 'Resend OTP';
                button.disabled = false;
                clearInterval(this.otpTimer);
            }
        }, 1000);
    }
}
```

---

## 4. Mobile-First Responsive Design

### Viewport Configuration

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no">
```

### Touch-Optimized CSS

```css
/* Touch targets - minimum 48px */
button, .clickable {
    min-height: var(--touch-target-min);
    min-width: var(--touch-target-min);
}

/* Prevent text selection on touch */
.touch-action {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
}

/* Smooth scrolling */
.scrollable {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
}

/* Prevent zoom on input focus */
input, select, textarea {
    font-size: max(16px, 1rem);
}
```

### Safe Area Support

```css
/* iPhone notch support */
.main-container {
    padding-top: max(var(--space-md), env(safe-area-inset-top));
    padding-bottom: max(var(--space-md), env(safe-area-inset-bottom));
    padding-left: max(var(--space-md), env(safe-area-inset-left));
    padding-right: max(var(--space-md), env(safe-area-inset-right));
}

/* Bottom sheet safe area */
.sheet-content {
    padding-bottom: max(var(--space-lg), env(safe-area-inset-bottom));
}
```

---

## 5. Accessibility Implementation

### ARIA Labels and Roles

```html
<!-- Search with proper labeling -->
<div role="search">
    <label for="doctor-search" class="sr-only">Search for doctors</label>
    <input type="search"
           id="doctor-search"
           role="searchbox"
           aria-describedby="search-instructions"
           autocomplete="off">
    <div id="search-instructions" class="sr-only">
        Type at least 2 characters to search
    </div>
</div>

<!-- Radio groups for selection -->
<div role="radiogroup" aria-labelledby="date-picker-label">
    <h2 id="date-picker-label">Select Date</h2>
    <button role="radio" aria-checked="false">Today</button>
    <button role="radio" aria-checked="false">Tomorrow</button>
</div>

<!-- Form validation with live regions -->
<div class="form-group">
    <label for="patient-name">Full Name *</label>
    <input type="text"
           id="patient-name"
           required
           aria-describedby="name-error">
    <div id="name-error"
         role="alert"
         aria-live="polite"
         class="error-message"></div>
</div>
```

### Keyboard Navigation

```javascript
class AccessibilityManager {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    }

    setupKeyboardNavigation() {
        // Trap focus in modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.bottom-sheet.visible');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }

            // Escape key closes modal
            if (e.key === 'Escape') {
                const modal = document.querySelector('.bottom-sheet.visible');
                if (modal) {
                    this.closeModal();
                }
            }
        });

        // Arrow key navigation for chips
        document.addEventListener('keydown', (e) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                this.handleArrowNavigation(e);
            }
        });
    }

    trapFocus(event, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, input, textarea, select, a[href]'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    handleArrowNavigation(event) {
        const activeElement = document.activeElement;

        // Navigate through chips
        if (activeElement.classList.contains('day-chip') ||
            activeElement.classList.contains('range-chip')) {

            const siblings = [...activeElement.parentElement.children];
            const currentIndex = siblings.indexOf(activeElement);

            let nextIndex = currentIndex;

            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextIndex = Math.max(0, currentIndex - 1);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    nextIndex = Math.min(siblings.length - 1, currentIndex + 1);
                    break;
            }

            if (nextIndex !== currentIndex) {
                event.preventDefault();
                siblings[nextIndex].focus();
            }
        }
    }

    setupFocusManagement() {
        // Store focus before modal opens
        let lastFocusedElement;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('bottom-sheet')) {
                        if (target.classList.contains('visible')) {
                            lastFocusedElement = document.activeElement;
                            setTimeout(() => {
                                const firstInput = target.querySelector('input');
                                firstInput?.focus();
                            }, 100);
                        } else {
                            lastFocusedElement?.focus();
                        }
                    }
                }
            });
        });

        const bottomSheet = document.getElementById('booking-sheet');
        observer.observe(bottomSheet, { attributes: true });
    }
}
```

### Screen Reader Announcements

```javascript
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Usage examples:
// announceToScreenReader('Search results updated');
// announceToScreenReader('Booking confirmed successfully');
// announceToScreenReader('Error: Please check your phone number');
```

---

## 6. Animations and Micro-Interactions

### CSS Animations

```css
/* Ripple effect for buttons */
.ripple {
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
}

.ripple:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.ripple:active:before {
    width: 300px;
    height: 300px;
}

/* Skeleton loading */
@keyframes shimmer {
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: calc(200px + 100%) 0;
    }
}

.skeleton {
    background: linear-gradient(90deg,
        var(--color-bg-secondary) 25%,
        rgba(255,255,255,0.5) 50%,
        var(--color-bg-secondary) 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
}

/* Success checkmark animation */
@keyframes checkmark {
    0% {
        height: 0;
        width: 0;
        opacity: 1;
    }
    20% {
        height: 0;
        width: 7px;
        opacity: 1;
    }
    40% {
        height: 16px;
        width: 7px;
        opacity: 1;
    }
    100% {
        height: 16px;
        width: 7px;
        opacity: 1;
    }
}

.success-icon::after {
    content: '';
    position: absolute;
    left: 12px;
    top: 6px;
    width: 7px;
    height: 16px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    animation: checkmark 0.3s ease-in-out;
}

/* Count animation */
.count-animate {
    transition: transform 0.2s ease-out;
}

.count-animate.updating {
    transform: scale(1.1);
}
```

### JavaScript Animations

```javascript
class AnimationManager {
    // Ripple effect
    static addRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Count update animation
    static animateCount(element, newValue) {
        element.classList.add('updating');

        setTimeout(() => {
            element.textContent = newValue;
            element.classList.remove('updating');
        }, 100);
    }

    // Shake animation for errors
    static shake(element) {
        element.style.animation = 'shake 0.5s ease-in-out';

        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Slide up animation
    static slideUp(element) {
        element.style.transform = 'translateY(100%)';
        element.style.transition = 'transform 0.3s ease-out';

        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
        });
    }
}

// Add shake keyframe
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);
```

---

## 7. PWA Configuration

### Service Worker (sw.js)

```javascript
const CACHE_NAME = 'medcore-v1.0.0';
const urlsToCache = [
    '/',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/offline.html'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // Return offline page for navigation requests
                    if (event.request.destination === 'document') {
                        return caches.match('/offline.html');
                    }
                });
            })
    );
});
```

### Web App Manifest (manifest.json)

```json
{
    "name": "MedCore Booking",
    "short_name": "MedCore",
    "description": "Book medical appointments easily",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#0066FF",
    "background_color": "#FFFFFF",
    "orientation": "portrait-primary",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "categories": ["medical", "health", "lifestyle"],
    "screenshots": [
        {
            "src": "/screenshot1.png",
            "sizes": "640x1136",
            "type": "image/png"
        }
    ]
}
```

---

## Quick Implementation Checklist

### 1. Setup (5 min)
- [ ] Create HTML structure with semantic markup
- [ ] Add CSS custom properties for design tokens
- [ ] Initialize JavaScript app class

### 2. Core Features (30 min)
- [ ] Implement search functionality with debouncing
- [ ] Build doctor card components
- [ ] Create day picker with accessibility
- [ ] Add time range selection
- [ ] Build booking form with validation

### 3. UX Polish (20 min)
- [ ] Add loading states and skeletons
- [ ] Implement error handling and toasts
- [ ] Add micro-animations and haptic feedback
- [ ] Test keyboard navigation

### 4. Mobile Optimization (15 min)
- [ ] Test touch targets (min 48px)
- [ ] Verify safe area handling
- [ ] Add PWA manifest and service worker
- [ ] Test on mobile devices

### 5. Accessibility (15 min)
- [ ] Verify ARIA labels and roles
- [ ] Test screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Validate keyboard navigation

**Total Implementation Time: ~85 minutes for MVP**

This guide provides everything needed to build a functional, accessible, and mobile-first patient booking prototype following the MVP specification.