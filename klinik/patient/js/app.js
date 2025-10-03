// Main application state and logic

const AppState = {
  currentStep: 1,
  selectedDoctor: null,
  selectedDate: null,
  selectedBookingType: null,
  selectedTime: null,
  selectedPaymentMethod: null,
  patientInfo: {
    name: '',
    phone: '',
    email: '',
    complaint: ''
  },
  bookingId: null,
  bookingNumber: null,
  paymentId: null,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  availability: [],
  timeSlots: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadDoctors();
  setupEventListeners();
  restoreState();
});

// Restore state from sessionStorage
function restoreState() {
  const saved = sessionStorage.getItem('bookingState');
  if (saved) {
    Object.assign(AppState, JSON.parse(saved));
    if (AppState.currentStep > 1) {
      // Restore UI based on saved state
      updateProgressStepper();
    }
  }
}

// Save state to sessionStorage
function saveState() {
  sessionStorage.setItem('bookingState', JSON.stringify(AppState));
}

// Load doctors
async function loadDoctors() {
  const container = document.getElementById('doctor-list');
  showLoading(container, 'Memuat daftar dokter...');

  await simulateAPIDelay(800);

  container.innerHTML = SAMPLE_DATA.doctors.map(doctor =>
    renderDoctorCard(doctor, AppState.selectedDoctor?.id === doctor.id)
  ).join('');
}

// Select doctor
function selectDoctor(doctorId) {
  AppState.selectedDoctor = SAMPLE_DATA.doctors.find(d => d.id === doctorId);
  AppState.availability = SAMPLE_DATA.generateAvailability(doctorId);
  saveState();

  // Update UI
  document.querySelectorAll('.doctor-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.doctorId === doctorId);
  });

  // Enable continue button
  document.getElementById('btn-continue-step1').disabled = false;
}

// Continue from step 1
async function continueFromStep1() {
  if (!AppState.selectedDoctor) return;

  AppState.currentStep = 2;
  saveState();
  updateProgressStepper();

  // Show step 2
  document.getElementById('step-2').classList.remove('hidden');
  scrollToElement('step-2');

  // Render calendar
  renderCalendarView();
}

// Render calendar
function renderCalendarView() {
  const container = document.getElementById('calendar-container');
  container.innerHTML = renderCalendar(
    AppState.currentYear,
    AppState.currentMonth,
    AppState.availability,
    AppState.selectedDate
  );
}

// Change month
function changeMonth(delta) {
  AppState.currentMonth += delta;

  if (AppState.currentMonth > 11) {
    AppState.currentMonth = 0;
    AppState.currentYear++;
  } else if (AppState.currentMonth < 0) {
    AppState.currentMonth = 11;
    AppState.currentYear--;
  }

  renderCalendarView();
}

// Select date
function selectDate(dateStr) {
  AppState.selectedDate = dateStr;
  saveState();

  renderCalendarView();

  // Show selected date
  document.getElementById('selected-date-display').innerHTML = `
    <div class="selected-date-info">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      <span>Tanggal dipilih: <strong>${formatDate(dateStr)}</strong></span>
    </div>
  `;

  document.getElementById('btn-continue-step2').disabled = false;
}

// Continue from step 2
function continueFromStep2() {
  if (!AppState.selectedDate) return;

  AppState.currentStep = 3;
  saveState();
  updateProgressStepper();

  document.getElementById('step-3').classList.remove('hidden');
  scrollToElement('step-3');

  // Render booking type options
  document.getElementById('booking-types-container').innerHTML = `
    ${renderBookingTypeCard('fast_track', AppState.selectedBookingType === 'fast_track')}
    ${renderBookingTypeCard('regular', AppState.selectedBookingType === 'regular')}
  `;
}

// Select booking type
async function selectBookingType(type) {
  AppState.selectedBookingType = type;
  AppState.selectedTime = null;
  saveState();

  // Update UI
  document.querySelectorAll('.booking-card').forEach(card => {
    card.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');

  if (type === 'fast_track') {
    // Show time slots
    const container = document.getElementById('time-slots-container');
    container.classList.remove('hidden');
    container.innerHTML = '<div class="spinner-container"><div class="spinner"></div><p class="loading-text">Memuat slot waktu...</p></div>';

    await simulateAPIDelay(600);

    const availability = AppState.availability.find(a => a.date === AppState.selectedDate);
    AppState.timeSlots = availability ? availability.slots : [];

    container.innerHTML = `
      <h4 class="time-slots-title">Pilih Waktu</h4>
      <div class="time-slots-grid">
        ${renderTimeSlots(AppState.timeSlots, AppState.selectedTime)}
      </div>
    `;

    document.getElementById('btn-continue-step3').disabled = true;
  } else {
    // Regular booking - hide time slots
    document.getElementById('time-slots-container').classList.add('hidden');
    document.getElementById('btn-continue-step3').disabled = false;

    // Show info
    const container = document.getElementById('time-slots-container');
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="info-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <p>Anda akan mendapat nomor antrian saat tiba di klinik. Datang sebelum pukul 12:00.</p>
      </div>
    `;
  }
}

// Select time
function selectTime(time) {
  AppState.selectedTime = time;
  saveState();

  // Update UI
  const container = document.querySelector('.time-slots-grid');
  container.innerHTML = renderTimeSlots(AppState.timeSlots, AppState.selectedTime);

  document.getElementById('btn-continue-step3').disabled = false;
}

// Continue from step 3
function continueFromStep3() {
  if (!AppState.selectedBookingType) return;
  if (AppState.selectedBookingType === 'fast_track' && !AppState.selectedTime) return;

  AppState.currentStep = 4;
  saveState();
  updateProgressStepper();

  document.getElementById('step-4').classList.remove('hidden');
  scrollToElement('step-4');
}

// Setup form event listeners
function setupEventListeners() {
  // Phone number formatting
  const phoneInput = document.getElementById('patient-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 12) value = value.slice(0, 12);
      e.target.value = value;
    });

    phoneInput.addEventListener('blur', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });
  }

  // Form validation on submit
  const patientForm = document.getElementById('patient-form');
  if (patientForm) {
    patientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validatePatientForm()) {
        continueFromStep4();
      }
    });
  }
}

// Validate patient form
function validatePatientForm() {
  const name = document.getElementById('patient-name').value.trim();
  const phone = document.getElementById('patient-phone').value.trim();
  const email = document.getElementById('patient-email').value.trim();

  let isValid = true;

  // Clear previous errors
  document.querySelectorAll('.form-field').forEach(field => {
    field.classList.remove('error');
    const errorSpan = field.querySelector('.field-error');
    if (errorSpan) errorSpan.remove();
  });

  // Validate name
  if (name.length < 3) {
    showFieldError('patient-name', 'Nama harus minimal 3 karakter');
    isValid = false;
  }

  // Validate phone
  const phoneRegex = /^(\+62|0)8\d{8,11}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    showFieldError('patient-phone', 'Format: 08xxxxxxxxxx atau +628xxxxxxxxxx');
    isValid = false;
  }

  // Validate email (if provided)
  if (email && !isValidEmail(email)) {
    showFieldError('patient-email', 'Format email tidak valid');
    isValid = false;
  }

  if (isValid) {
    AppState.patientInfo = {
      name,
      phone: cleanPhone,
      email,
      complaint: document.getElementById('patient-complaint').value.trim()
    };
    saveState();
  }

  return isValid;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId).closest('.form-field');
  field.classList.add('error');

  const errorSpan = document.createElement('span');
  errorSpan.className = 'field-error';
  errorSpan.textContent = message;
  errorSpan.setAttribute('role', 'alert');

  field.appendChild(errorSpan);

  // Shake animation
  field.style.animation = 'shake 300ms';
  setTimeout(() => {
    field.style.animation = '';
  }, 300);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Continue from step 4
async function continueFromStep4() {
  if (AppState.selectedBookingType === 'regular') {
    // Submit booking directly for regular
    await submitBooking();
  } else {
    // Show payment step for fast-track
    AppState.currentStep = 5;
    saveState();
    updateProgressStepper();

    document.getElementById('step-5').classList.remove('hidden');
    scrollToElement('step-5');

    // Render payment methods
    document.getElementById('payment-methods-container').innerHTML = SAMPLE_DATA.paymentMethods.map(method =>
      renderPaymentMethod(method, AppState.selectedPaymentMethod?.id === method.id)
    ).join('');
  }
}

// Select payment method
async function selectPaymentMethod(methodId) {
  AppState.selectedPaymentMethod = SAMPLE_DATA.paymentMethods.find(m => m.id === methodId);
  saveState();

  // Update UI
  document.querySelectorAll('.payment-card').forEach(card => {
    card.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');

  const container = document.getElementById('payment-detail-area');
  container.innerHTML = '<div class="spinner-container"><div class="spinner"></div><p class="loading-text">Memuat pembayaran...</p></div>';

  await simulateAPIDelay(800);

  // Create payment based on method
  if (methodId === 'qris') {
    showQRISPayment(container);
  } else if (methodId === 'bank_transfer') {
    showBankTransferPayment(container);
  } else if (methodId === 'credit_card') {
    showCreditCardPayment(container);
  }
}

// Show QRIS payment
function showQRISPayment(container) {
  const qrCode = generateQRCode();

  container.innerHTML = `
    <div class="qr-code-display">
      <div class="qr-code-container">
        <img src="${qrCode}" alt="Scan QR code untuk pembayaran" class="qr-code" />
      </div>
      <div class="timer">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>Bayar dalam <strong id="payment-timer">10:00</strong></span>
      </div>
      <p class="instruction">Scan QR dengan aplikasi e-wallet Anda</p>
      <div class="polling-indicator">
        <span class="pulsing-dot"></span>
        Menunggu pembayaran...
      </div>
      <button class="btn-secondary" onclick="simulatePaymentSuccess()">Simulasi Pembayaran Berhasil</button>
    </div>
  `;

  startPaymentTimer(600); // 10 minutes
  startPaymentPolling();
}

// Show bank transfer payment
function showBankTransferPayment(container) {
  const vaNumber = generateVANumber('014');

  container.innerHTML = `
    <div class="bank-transfer-display">
      <h4>Transfer ke:</h4>
      <div class="va-number-container">
        <div class="bank-header">
          <div class="bank-logo">BCA</div>
        </div>
        <div class="va-number">
          <span class="va-label">Nomor Virtual Account</span>
          <div class="va-number-value">
            <span id="va-number-text">${vaNumber}</span>
            <button class="btn-copy" onclick="copyVANumber('${vaNumber}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy
            </button>
          </div>
        </div>
      </div>
      <div class="instructions">
        <h4>Instruksi Pembayaran:</h4>
        <ol>
          <li>Buka aplikasi mobile banking</li>
          <li>Transfer ke nomor VA di atas</li>
          <li>Konfirmasi otomatis setelah pembayaran terverifikasi</li>
        </ol>
        <p class="payment-deadline">Batas waktu: 23:59 hari ini</p>
      </div>
      <div class="polling-indicator">
        <span class="pulsing-dot"></span>
        Menunggu pembayaran...
      </div>
      <button class="btn-secondary" onclick="simulatePaymentSuccess()">Simulasi Pembayaran Berhasil</button>
    </div>
  `;

  startPaymentPolling();
}

// Show credit card payment
function showCreditCardPayment(container) {
  container.innerHTML = `
    <div class="credit-card-display">
      <div class="card-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
        <p>Anda akan dialihkan ke halaman pembayaran kartu kredit yang aman</p>
      </div>
      <button class="btn-primary" onclick="simulatePaymentSuccess()">
        Lanjut ke Pembayaran Kartu
      </button>
      <div class="secure-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Secured by Payment Gateway
      </div>
    </div>
  `;
}

// Copy VA number
function copyVANumber(vaNumber) {
  navigator.clipboard.writeText(vaNumber).then(() => {
    Toast.show('Nomor VA tersalin!', 'success', 2000);
  });
}

// Payment timer
let paymentTimerInterval;
function startPaymentTimer(seconds) {
  let remaining = seconds;

  paymentTimerInterval = setInterval(() => {
    remaining--;

    const minutes = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const display = `${minutes}:${secs.toString().padStart(2, '0')}`;

    const timerElement = document.getElementById('payment-timer');
    if (timerElement) {
      timerElement.textContent = display;
    }

    if (remaining <= 0) {
      clearInterval(paymentTimerInterval);
      Toast.show('Pembayaran expired, silakan booking ulang', 'error');
      // In real app, cancel booking and redirect
    }
  }, 1000);
}

// Payment polling
let paymentPollingInterval;
function startPaymentPolling() {
  // Simulate polling every 3 seconds
  paymentPollingInterval = setInterval(() => {
    // In real app, check API for payment status
    console.log('Polling payment status...');
  }, 3000);
}

function stopPaymentPolling() {
  if (paymentPollingInterval) {
    clearInterval(paymentPollingInterval);
  }
  if (paymentTimerInterval) {
    clearInterval(paymentTimerInterval);
  }
}

// Simulate payment success
async function simulatePaymentSuccess() {
  stopPaymentPolling();

  // Show success state
  const container = document.getElementById('payment-detail-area');
  container.innerHTML = `
    <div class="payment-success">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      <h3>Pembayaran Berhasil!</h3>
      <p>Mengalihkan ke halaman konfirmasi...</p>
    </div>
  `;

  triggerConfetti();
  await simulateAPIDelay(2000);

  await submitBooking();
}

// Submit booking
async function submitBooking() {
  const bookingData = {
    doctor_id: AppState.selectedDoctor.id,
    booking_type: AppState.selectedBookingType,
    booking_date: AppState.selectedDate,
    booking_time: AppState.selectedTime,
    patient_name: AppState.patientInfo.name,
    patient_phone: AppState.patientInfo.phone,
    patient_email: AppState.patientInfo.email,
    patient_complaint: AppState.patientInfo.complaint
  };

  console.log('Submitting booking:', bookingData);

  // Simulate API call
  await simulateAPIDelay(1000);

  // Generate booking details
  AppState.bookingId = 'book-' + Date.now();
  AppState.bookingNumber = generateBookingNumber();

  saveState();

  // Redirect to confirmation
  window.location.href = `confirmation.html?id=${AppState.bookingId}`;
}

// Update progress stepper
function updateProgressStepper() {
  const stepper = document.getElementById('progress-stepper');
  if (stepper) {
    stepper.innerHTML = renderProgressStepper(AppState.currentStep);
  }
}

// Back navigation
function goBack(fromStep) {
  if (fromStep > 1) {
    AppState.currentStep = fromStep - 1;
    saveState();
    updateProgressStepper();

    // Hide current step
    document.getElementById(`step-${fromStep}`).classList.add('hidden');

    // Scroll to previous step
    scrollToElement(`step-${fromStep - 1}`);
  }
}
