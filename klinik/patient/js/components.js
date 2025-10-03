// Reusable component rendering functions

// Toast notification component
class Toast {
  static show(message, type = 'success', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">
        ${this.getIcon(type)}
      </div>
      <div class="toast-content">
        <h4 class="toast-title">${this.getTitle(type)}</h4>
        <p class="toast-message">${message}</p>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
      <div class="toast-progress"></div>
    `;

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    // Progress bar
    const progress = toast.querySelector('.toast-progress');
    progress.style.animation = `toast-progress ${duration}ms linear`;
  }

  static getIcon(type) {
    const icons = {
      success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
      warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    };
    return icons[type] || icons.info;
  }

  static getTitle(type) {
    const titles = {
      success: 'Berhasil!',
      error: 'Error!',
      info: 'Informasi',
      warning: 'Peringatan!'
    };
    return titles[type] || 'Pemberitahuan';
  }
}

// Loading spinner component
function showLoading(container, text = 'Memuat...') {
  container.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p class="loading-text">${text}</p>
    </div>
  `;
}

// Doctor card component
function renderDoctorCard(doctor, isSelected) {
  return `
    <div class="doctor-card ${isSelected ? 'selected' : ''}" data-doctor-id="${doctor.id}" onclick="selectDoctor('${doctor.id}')">
      ${isSelected ? '<div class="selected-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' : ''}
      <div class="doctor-card-content">
        <img src="${doctor.photo}" alt="${doctor.name}" class="doctor-avatar" loading="lazy" />
        <div class="doctor-info">
          <h3 class="doctor-name">${doctor.name}</h3>
          <p class="doctor-specialization">${doctor.specialization}</p>
        </div>
      </div>
    </div>
  `;
}

// Calendar component
function renderCalendar(year, month, availability, selectedDate) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  let html = `
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="nav-button" onclick="changeMonth(-1)" aria-label="Bulan sebelumnya">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h3 class="month-year">${monthNames[month]} ${year}</h3>
        <button class="nav-button" onclick="changeMonth(1)" aria-label="Bulan berikutnya">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <div class="calendar-grid">
        <div class="calendar-day-name">Min</div>
        <div class="calendar-day-name">Sen</div>
        <div class="calendar-day-name">Sel</div>
        <div class="calendar-day-name">Rab</div>
        <div class="calendar-day-name">Kam</div>
        <div class="calendar-day-name">Jum</div>
        <div class="calendar-day-name">Sab</div>
  `;

  // Add empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += '<div class="calendar-date-cell empty"></div>';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    currentDate.setHours(0, 0, 0, 0);
    const dateStr = currentDate.toISOString().split('T')[0];

    const isPast = currentDate < today;
    const isToday = currentDate.getTime() === today.getTime();
    const isSelected = dateStr === selectedDate;

    const availabilityInfo = availability.find(a => a.date === dateStr);
    const isAvailable = availabilityInfo && availabilityInfo.available && !isPast;

    let classes = 'calendar-date-cell';
    if (isPast) classes += ' past';
    if (isToday) classes += ' today';
    if (isSelected) classes += ' selected';
    if (!isAvailable && !isPast) classes += ' unavailable';

    const ariaLabel = `${day} ${monthNames[month]} ${year}${isToday ? ', Hari ini' : ''}${isAvailable ? ', Tersedia' : ', Tidak tersedia'}`;

    html += `
      <button
        class="${classes}"
        ${!isAvailable ? 'disabled' : ''}
        onclick="selectDate('${dateStr}')"
        aria-label="${ariaLabel}"
        ${!isAvailable ? 'aria-disabled="true"' : ''}
      >
        <span class="date-number">${day}</span>
        ${isToday ? '<span class="today-indicator"></span>' : ''}
      </button>
    `;
  }

  html += `
      </div>
    </div>
  `;

  return html;
}

// Time slot pills
function renderTimeSlots(slots, selectedTime) {
  return slots.map(slot => {
    const isSelected = slot.time === selectedTime;
    const isAlmostFull = slot.available && slot.remaining === 1;

    let classes = 'time-slot';
    if (isSelected) classes += ' selected';
    if (!slot.available) classes += ' unavailable';
    if (isAlmostFull) classes += ' almost-full';

    return `
      <button
        class="${classes}"
        ${!slot.available ? 'disabled' : ''}
        onclick="selectTime('${slot.time}')"
        aria-label="Waktu ${slot.time}${slot.available ? ', tersedia' : ', penuh'}"
      >
        ${slot.time}
        ${isAlmostFull ? '<span class="slot-badge">Sisa 1</span>' : ''}
      </button>
    `;
  }).join('');
}

// Booking type cards
function renderBookingTypeCard(type, isSelected) {
  const isFastTrack = type === 'fast_track';

  return `
    <div class="booking-card ${isFastTrack ? 'fast-track' : 'regular'} ${isSelected ? 'selected' : ''}" onclick="selectBookingType('${type}')">
      ${isSelected ? '<div class="selected-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' : ''}
      <span class="badge ${isFastTrack ? 'priority' : 'free'}">${isFastTrack ? 'Priority' : 'Gratis'}</span>
      <h4 class="booking-type-title">${isFastTrack ? 'Fast-Track' : 'Reservasi Biasa'}</h4>
      <ul class="booking-features">
        ${isFastTrack ? `
          <li>✓ Jam pasti</li>
          <li>✓ Antrian terlewat</li>
          <li>✓ Prioritas layanan</li>
        ` : `
          <li>✓ Antrian biasa</li>
          <li>✓ Tanpa jam spesifik</li>
          <li>✓ Gratis booking</li>
        `}
      </ul>
      ${isFastTrack ? `<p class="price">${formatCurrency(SAMPLE_DATA.fastTrackPrice)}</p>` : ''}
    </div>
  `;
}

// Payment method cards
function renderPaymentMethod(method, isSelected) {
  return `
    <div class="payment-card ${isSelected ? 'selected' : ''}" onclick="selectPaymentMethod('${method.id}')">
      ${isSelected ? '<div class="selected-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>' : ''}
      <img src="${method.logo}" alt="${method.name}" class="payment-logo" />
      <span class="payment-label">${method.name}</span>
    </div>
  `;
}

// Progress stepper
function renderProgressStepper(currentStep) {
  const steps = [
    { num: 1, label: 'Pilih Dokter' },
    { num: 2, label: 'Pilih Tanggal' },
    { num: 3, label: 'Tipe Booking' },
    { num: 4, label: 'Isi Data' },
    { num: 5, label: 'Pembayaran' }
  ];

  return steps.map((step, index) => {
    let stepClass = 'step';
    if (step.num < currentStep) stepClass += ' completed';
    if (step.num === currentStep) stepClass += ' active';

    return `
      <div class="${stepClass}">
        <div class="step-indicator">
          ${step.num < currentStep ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : step.num}
        </div>
        <span class="step-label">${step.label}</span>
      </div>
      ${index < steps.length - 1 ? `<div class="step-connector ${step.num < currentStep ? 'active' : ''}"></div>` : ''}
    `;
  }).join('');
}

// Input field component
function renderInputField(config) {
  const { id, label, type = 'text', required = false, placeholder = '', value = '', error = '', pattern = '' } = config;

  return `
    <div class="form-field ${error ? 'error' : ''}">
      <label class="field-label" for="${id}">
        ${label} ${required ? '<span class="required">*</span>' : ''}
      </label>
      <input
        type="${type}"
        id="${id}"
        class="text-input"
        placeholder="${placeholder}"
        value="${value}"
        ${required ? 'required' : ''}
        ${pattern ? `pattern="${pattern}"` : ''}
        ${required ? 'aria-required="true"' : ''}
      />
      ${error ? `<span class="field-error" role="alert">${error}</span>` : ''}
    </div>
  `;
}

// Confetti animation
function triggerConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const colors = ['#00CED1', '#00E5E8', '#A855F7', '#10B981', '#EC4899'];

  const frame = () => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) return;

    const particleCount = 2;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 5000);
    }

    requestAnimationFrame(frame);
  };

  frame();
}

// Smooth scroll to element
function scrollToElement(elementId, offset = 80) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}
