// Interactive Components - Klinik Admin Dashboard

// ============================================
// MODAL COMPONENT
// ============================================

const Modal = {
  current: null,
  focusableElements: null,
  firstFocusable: null,
  lastFocusable: null,

  open(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.current = modal;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Setup focus trap
    this.setupFocusTrap(modal);

    // Close on overlay click
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close(modalId);
        }
      });
    }

    // Close on close button click
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close(modalId));
    }

    // Close on Escape key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.close(modalId);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Focus first element
    setTimeout(() => {
      if (this.firstFocusable) {
        this.firstFocusable.focus();
      }
    }, 100);

    // Callback after open
    if (options.onOpen) {
      options.onOpen();
    }
  },

  setupFocusTrap(modal) {
    // Get all focusable elements
    const dialog = modal.querySelector('.modal-dialog');
    if (!dialog) return;

    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.focusableElements = dialog.querySelectorAll(focusableSelectors);

    if (this.focusableElements.length === 0) return;

    this.firstFocusable = this.focusableElements[0];
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

    // Handle Tab key to trap focus
    const trapFocus = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    };

    dialog.addEventListener('keydown', trapFocus);
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';
    this.current = null;
    this.focusableElements = null;
    this.firstFocusable = null;
    this.lastFocusable = null;
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = '';
    this.current = null;
    this.focusableElements = null;
    this.firstFocusable = null;
    this.lastFocusable = null;
  }
};

// ============================================
// TABLE SORTING
// ============================================

const TableSort = {
  init(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const headers = table.querySelectorAll('th.sortable');
    headers.forEach((header, index) => {
      header.addEventListener('click', () => {
        this.sort(table, index);
      });
    });
  },

  sort(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelectorAll('th')[columnIndex];

    // Determine sort direction
    const currentDirection = header.dataset.sortDirection || 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    // Clear all sort indicators
    table.querySelectorAll('th').forEach(th => {
      th.dataset.sortDirection = '';
      th.classList.remove('sort-asc', 'sort-desc');
    });

    // Set new sort direction
    header.dataset.sortDirection = newDirection;
    header.classList.add(`sort-${newDirection}`);

    // Sort rows
    rows.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent.trim();
      const bValue = b.cells[columnIndex].textContent.trim();

      // Try to parse as number
      const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
      const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // String comparison
      return newDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
  }
};

// ============================================
// PAGINATION
// ============================================

const Pagination = {
  init(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const defaults = {
      currentPage: 1,
      totalPages: 10,
      perPage: 20,
      totalItems: 200,
      onPageChange: (page) => console.log('Page changed to:', page)
    };

    const config = { ...defaults, ...options };
    this.render(container, config);
  },

  render(container, config) {
    const { currentPage, totalPages, totalItems, perPage, onPageChange } = config;

    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, totalItems);

    let html = `
      <div class="pagination">
        <div class="page-numbers">
          <button class="page-button" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
    `;

    // Page numbers
    const pageNumbers = this.getPageNumbers(currentPage, totalPages);
    pageNumbers.forEach(page => {
      if (page === '...') {
        html += '<span>...</span>';
      } else {
        html += `
          <button class="page-number ${page === currentPage ? 'active' : ''}" data-page="${page}">
            ${page}
          </button>
        `;
      }
    });

    html += `
          <button class="page-button" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <span class="page-info">Showing ${startItem}-${endItem} of ${totalItems}</span>
      </div>
    `;

    container.innerHTML = html;

    // Add event listeners
    container.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (page >= 1 && page <= totalPages) {
          onPageChange(page);
        }
      });
    });
  },

  getPageNumbers(current, total) {
    const pages = [];
    const delta = 2;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > delta + 2) {
        pages.push('...');
      }

      const start = Math.max(2, current - delta);
      const end = Math.min(total - 1, current + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - delta - 1) {
        pages.push('...');
      }

      pages.push(total);
    }

    return pages;
  }
};

// ============================================
// FILTER PANEL
// ============================================

const FilterPanel = {
  init(formId, onApply) {
    const form = document.getElementById(formId);
    if (!form) return;

    const applyBtn = form.querySelector('.filter-apply');
    const resetBtn = form.querySelector('.filter-reset');

    if (applyBtn) {
      applyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const filters = this.getValues(form);
        onApply(filters);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        form.reset();
        const filters = this.getValues(form);
        onApply(filters);
      });
    }
  },

  getValues(form) {
    const formData = new FormData(form);
    const filters = {};

    for (let [key, value] of formData.entries()) {
      if (value) {
        if (filters[key]) {
          // Handle multiple values (checkboxes)
          if (Array.isArray(filters[key])) {
            filters[key].push(value);
          } else {
            filters[key] = [filters[key], value];
          }
        } else {
          filters[key] = value;
        }
      }
    }

    return filters;
  }
};

// ============================================
// SEARCH WITH DEBOUNCE
// ============================================

const SearchInput = {
  init(inputId, onSearch, delay = 300) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const debouncedSearch = Utils.debounce((value) => {
      onSearch(value);
    }, delay);

    input.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
  }
};

// ============================================
// FORM VALIDATION
// ============================================

const FormValidator = {
  validate(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    const fields = form.querySelectorAll('[required]');

    fields.forEach(field => {
      const error = this.validateField(field);
      if (error) {
        this.showError(field, error);
        isValid = false;
      } else {
        this.clearError(field);
      }
    });

    return isValid;
  },

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;

    if (!value) {
      return `${field.labels[0]?.textContent || 'This field'} is required`;
    }

    if (type === 'email' && !Utils.isValidEmail(value)) {
      return 'Please enter a valid email address';
    }

    if (type === 'tel' && !Utils.isValidPhone(value)) {
      return 'Please enter a valid phone number';
    }

    if (field.minLength && value.length < field.minLength) {
      return `Minimum ${field.minLength} characters required`;
    }

    return null;
  },

  showError(field, message) {
    this.clearError(field);

    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;

    field.parentElement.appendChild(error);
    field.style.borderColor = 'var(--error-500)';
  },

  clearError(field) {
    const error = field.parentElement.querySelector('.field-error');
    if (error) {
      error.remove();
    }
    field.style.borderColor = '';
  },

  init(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Validate on blur
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('blur', () => {
        const error = this.validateField(field);
        if (error) {
          this.showError(field, error);
        } else {
          this.clearError(field);
        }
      });

      // Clear error on input
      field.addEventListener('input', () => {
        this.clearError(field);
      });
    });

    // Validate on submit
    form.addEventListener('submit', (e) => {
      if (!this.validate(formId)) {
        e.preventDefault();
      }
    });
  }
};

// ============================================
// TOGGLE PASSWORD VISIBILITY
// ============================================

const PasswordToggle = {
  init() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.input-with-icon').querySelector('input');
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;

        // Update icon
        const icon = btn.querySelector('svg use');
        if (icon) {
          const iconName = type === 'password' ? 'eye' : 'eye-off';
          icon.setAttribute('href', `#icon-${iconName}`);
        }
      });
    });
  }
};

// ============================================
// FILE UPLOAD PREVIEW
// ============================================

const FileUpload = {
  init(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    if (!input || !preview) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
};

// ============================================
// STAT CARD ANIMATION
// ============================================

const StatAnimation = {
  init() {
    document.querySelectorAll('.stat-value').forEach(el => {
      const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
      this.animateValue(el, 0, target, 800);
    });
  },

  animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.round(current);
    }, 16);
  }
};

// ============================================
// SCHEDULE CALENDAR
// ============================================

const ScheduleCalendar = {
  currentDate: new Date(),
  selectedDoctor: null,

  init(options = {}) {
    this.options = options;
    this.render();

    // Navigation
    document.getElementById('prevWeek')?.addEventListener('click', () => {
      this.changeWeek(-1);
    });

    document.getElementById('nextWeek')?.addEventListener('click', () => {
      this.changeWeek(1);
    });

    // Doctor selector
    document.getElementById('doctorSelect')?.addEventListener('change', (e) => {
      this.selectedDoctor = e.target.value;
      this.render();
    });
  },

  changeWeek(direction) {
    this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
    this.render();
  },

  render() {
    const container = document.getElementById('scheduleGrid');
    if (!container) return;

    // Get week dates
    const weekDates = this.getWeekDates(this.currentDate);

    // Update header
    const headerTitle = document.getElementById('weekTitle');
    if (headerTitle) {
      const startDate = Utils.formatDate(weekDates[0], 'short');
      const endDate = Utils.formatDate(weekDates[6], 'short');
      headerTitle.textContent = `Week of ${startDate} - ${endDate}`;
    }

    // Generate calendar grid
    // This would be populated with actual appointment data from API
    // For prototype, we'll show the structure

    if (this.options.onRender) {
      this.options.onRender(weekDates);
    }
  },

  getWeekDates(date) {
    const week = [];
    const monday = new Date(date);
    monday.setDate(date.getDate() - date.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }

    return week;
  }
};

// ============================================
// CONFIRMATION DIALOG
// ============================================

const Confirm = {
  show(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-dialog" style="max-width: 400px;">
        <div class="modal-header">
          <h3 class="modal-title">Confirm Action</h3>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="button-secondary confirm-cancel">Cancel</button>
          <button class="button-primary confirm-ok">Confirm</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.style.display = 'flex';

    const okBtn = overlay.querySelector('.confirm-ok');
    const cancelBtn = overlay.querySelector('.confirm-cancel');

    const cleanup = () => {
      overlay.remove();
    };

    okBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      cleanup();
    });

    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      cleanup();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        if (onCancel) onCancel();
        cleanup();
      }
    });
  }
};

// ============================================
// BOOKING DETAIL MODAL
// ============================================

const BookingModal = {
  currentBookingId: null,
  originalStatus: null,
  originalNotes: '',
  hasChanges: false,

  // Mock data - in production, this would come from API
  getMockBookingData(bookingId) {
    const mockData = {
      'BK20251003001': {
        id: 'BK20251003001',
        patient: {
          name: 'Budi Santoso',
          phone: '0812-3456-7890',
          email: 'budi@example.com',
          complaint: 'Sakit kepala berkepanjangan'
        },
        appointment: {
          doctor: 'Dr. Ahmad Surya',
          specialization: 'Dokter Umum',
          date: 'Senin, 3 Oktober 2025',
          time: '10:00 WIB',
          type: 'fast-track'
        },
        payment: {
          amount: 50000,
          method: 'QRIS',
          status: 'paid',
          paidAt: '2025-10-03T09:45:00'
        },
        status: 'paid',
        createdAt: '2025-10-03T09:30:00',
        notes: '',
        notifications: [
          { type: 'Confirmation (WhatsApp)', status: 'sent', timestamp: '2025-10-03T09:31:00' },
          { type: 'H-1 Reminder', status: 'pending', timestamp: null },
          { type: 'H-0 Reminder', status: 'pending', timestamp: null }
        ]
      },
      'BK20251003002': {
        id: 'BK20251003002',
        patient: {
          name: 'Siti Aminah',
          phone: '0813-9876-5432',
          email: 'siti@example.com',
          complaint: 'Demam tinggi'
        },
        appointment: {
          doctor: 'Dr. Ahmad Surya',
          specialization: 'Dokter Umum',
          date: 'Senin, 3 Oktober 2025',
          time: '11:00 WIB',
          type: 'regular'
        },
        payment: null,
        status: 'confirmed',
        createdAt: '2025-10-03T10:15:00',
        notes: '',
        notifications: [
          { type: 'Confirmation (WhatsApp)', status: 'sent', timestamp: '2025-10-03T10:16:00' }
        ]
      },
      'BK20251003003': {
        id: 'BK20251003003',
        patient: {
          name: 'Rudi Hartono',
          phone: '0821-1122-3344',
          email: 'rudi@example.com',
          complaint: 'Batuk dan pilek'
        },
        appointment: {
          doctor: 'Dr. Sarah Wijaya',
          specialization: 'Dokter Spesialis Paru',
          date: 'Senin, 3 Oktober 2025',
          time: '13:00 WIB',
          type: 'fast-track'
        },
        payment: {
          amount: 50000,
          method: 'QRIS',
          status: 'paid',
          paidAt: '2025-10-03T12:30:00'
        },
        status: 'paid',
        createdAt: '2025-10-03T12:25:00',
        notes: 'Pasien memiliki riwayat asma',
        notifications: [
          { type: 'Confirmation (WhatsApp)', status: 'sent', timestamp: '2025-10-03T12:31:00' },
          { type: 'Payment Confirmation', status: 'sent', timestamp: '2025-10-03T12:31:00' }
        ]
      }
    };
    return mockData[bookingId];
  },

  async open(bookingId) {
    this.currentBookingId = bookingId;

    // In production, fetch data from API
    // const data = await API.get(`/bookings/${bookingId}`);
    const data = this.getMockBookingData(bookingId);

    if (!data) {
      Toast.error('Booking not found');
      return;
    }

    this.populateModal(data);

    // Store original values for change detection
    this.originalStatus = data.status;
    this.originalNotes = data.notes || '';
    this.hasChanges = false;

    // Open modal
    Modal.open('bookingDetailModal');

    // Setup event listeners
    this.setupEventListeners();
  },

  populateModal(data) {
    // Booking Number
    document.getElementById('modalBookingNumber').textContent = data.id;

    // Patient Information
    document.getElementById('patientName').textContent = data.patient.name;
    document.getElementById('patientPhone').textContent = data.patient.phone;
    document.getElementById('patientEmail').textContent = data.patient.email;
    document.getElementById('patientComplaint').textContent = data.patient.complaint;

    // Appointment Details
    document.getElementById('doctorName').textContent = data.appointment.doctor;
    document.getElementById('doctorSpecialization').textContent = data.appointment.specialization;
    document.getElementById('appointmentDate').textContent = data.appointment.date;
    document.getElementById('appointmentTime').textContent = data.appointment.time;

    const typeHtml = data.appointment.type === 'fast-track'
      ? '<span class="badge fast-track">Fast-Track</span>'
      : '<span class="badge regular">Regular</span>';
    document.getElementById('appointmentType').innerHTML = typeHtml;

    // Payment Information (only for Fast-Track)
    const paymentSection = document.getElementById('paymentSection');
    if (data.payment) {
      paymentSection.style.display = 'block';
      document.getElementById('paymentAmount').textContent = Utils.formatCurrency(data.payment.amount);
      document.getElementById('paymentMethod').textContent = data.payment.method;

      const statusHtml = `<span class="badge ${data.payment.status}">${this.capitalize(data.payment.status)}</span>`;
      document.getElementById('paymentStatus').innerHTML = statusHtml;
      document.getElementById('paymentTimestamp').textContent = Utils.formatDateTime(data.payment.paidAt);
    } else {
      paymentSection.style.display = 'none';
    }

    // Booking Status
    const statusHtml = `<span class="badge ${data.status}">${this.capitalize(data.status)}</span>`;
    document.getElementById('currentStatus').innerHTML = statusHtml;
    document.getElementById('createdTimestamp').textContent = Utils.formatDateTime(data.createdAt);

    // Set dropdown to current status
    const statusDropdown = document.getElementById('statusDropdown');
    statusDropdown.value = data.status;

    // Admin Notes
    const notesTextarea = document.getElementById('adminNotes');
    notesTextarea.value = data.notes || '';
    document.getElementById('notesCharCount').textContent = (data.notes || '').length;

    // Notifications
    this.populateNotifications(data.notifications);
  },

  populateNotifications(notifications) {
    const container = document.getElementById('notificationsList');

    if (!notifications || notifications.length === 0) {
      container.innerHTML = '<div class="detail-value" style="color: var(--text-tertiary);">No notifications sent yet</div>';
      return;
    }

    const notificationsHtml = notifications.map(notif => {
      let iconHtml, statusClass, timestampText;

      if (notif.status === 'sent') {
        iconHtml = `
          <svg class="notification-icon sent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        `;
        statusClass = 'sent';
        timestampText = `Sent: ${Utils.formatDateTime(notif.timestamp)}`;
      } else if (notif.status === 'pending') {
        iconHtml = `
          <svg class="notification-icon pending" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        `;
        statusClass = 'pending';
        timestampText = 'Pending';
      } else {
        iconHtml = `
          <svg class="notification-icon failed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        `;
        statusClass = 'failed';
        timestampText = 'Failed';
      }

      const retryButton = notif.status === 'failed'
        ? `<button class="button-secondary retry-button" onclick="BookingModal.retryNotification('${notif.type}')">Retry</button>`
        : '';

      return `
        <div class="notification-item">
          ${iconHtml}
          <div class="notification-content">
            <div class="notification-type">${notif.type}</div>
            <div class="notification-timestamp">${timestampText}</div>
            ${notif.error ? `<div class="notification-error">${notif.error}</div>` : ''}
          </div>
          ${retryButton}
        </div>
      `;
    }).join('');

    container.innerHTML = notificationsHtml;
  },

  setupEventListeners() {
    // Copy booking number
    const copyBtn = document.getElementById('copyBookingNumber');
    copyBtn.onclick = () => {
      const bookingNumber = document.getElementById('modalBookingNumber').textContent;
      Utils.copyToClipboard(bookingNumber);
    };

    // Status dropdown change
    const statusDropdown = document.getElementById('statusDropdown');
    statusDropdown.onchange = () => {
      this.checkForChanges();
    };

    // Admin notes change
    const notesTextarea = document.getElementById('adminNotes');
    notesTextarea.oninput = (e) => {
      const charCount = e.target.value.length;
      document.getElementById('notesCharCount').textContent = charCount;
      this.checkForChanges();
    };

    // Close button
    const closeBtn = document.getElementById('modalCloseButton');
    closeBtn.onclick = () => {
      if (this.hasChanges) {
        Confirm.show(
          'You have unsaved changes. Are you sure you want to close?',
          () => Modal.close('bookingDetailModal'),
          null
        );
      } else {
        Modal.close('bookingDetailModal');
      }
    };

    // Save changes button
    const saveBtn = document.getElementById('saveChangesButton');
    saveBtn.onclick = () => this.saveChanges();
  },

  checkForChanges() {
    const currentStatus = document.getElementById('statusDropdown').value;
    const currentNotes = document.getElementById('adminNotes').value;

    this.hasChanges = (currentStatus !== this.originalStatus) || (currentNotes !== this.originalNotes);

    // Enable/disable save button
    const saveBtn = document.getElementById('saveChangesButton');
    saveBtn.disabled = !this.hasChanges;
  },

  saveChanges() {
    const newStatus = document.getElementById('statusDropdown').value;
    const newNotes = document.getElementById('adminNotes').value;

    // Confirm status change if different
    if (newStatus !== this.originalStatus) {
      Confirm.show(
        `Are you sure you want to change the status to "${this.capitalize(newStatus)}"?`,
        () => this.performSave(newStatus, newNotes),
        null
      );
    } else {
      this.performSave(newStatus, newNotes);
    }
  },

  async performSave(status, notes) {
    try {
      Loading.show('.modal-dialog');

      // In production, send to API
      // await API.patch(`/bookings/${this.currentBookingId}`, { status, notes });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update original values
      this.originalStatus = status;
      this.originalNotes = notes;
      this.hasChanges = false;

      // Update save button state
      document.getElementById('saveChangesButton').disabled = true;

      // Update current status badge
      const statusHtml = `<span class="badge ${status}">${this.capitalize(status)}</span>`;
      document.getElementById('currentStatus').innerHTML = statusHtml;

      Toast.success('Changes saved successfully');
      Loading.hide('.modal-dialog');

      // Optionally close modal and refresh table
      setTimeout(() => {
        Modal.close('bookingDetailModal');
        // In production, refresh the bookings table
        // window.location.reload();
      }, 1000);

    } catch (error) {
      Loading.hide('.modal-dialog');
      Toast.error('Failed to save changes');
      console.error('Save error:', error);
    }
  },

  retryNotification(type) {
    Toast.info(`Retrying notification: ${type}...`);
    // In production, call API to retry notification
    // API.post(`/bookings/${this.currentBookingId}/notifications/retry`, { type });
  },

  capitalize(str) {
    return str.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
};

// ============================================
// EDIT SCHEDULE MODAL
// ============================================

const EditScheduleModal = {
  currentDoctorId: null,
  originalSchedule: {},

  // Mock schedule data
  getMockScheduleData(doctorId) {
    const mockData = {
      '1': {
        doctorName: 'Dr. Ahmad Surya',
        schedule: {
          monday: { active: true, start: '09:00', end: '15:00', duration: 30 },
          tuesday: { active: true, start: '09:00', end: '15:00', duration: 30 },
          wednesday: { active: true, start: '09:00', end: '15:00', duration: 30 },
          thursday: { active: true, start: '09:00', end: '15:00', duration: 30 },
          friday: { active: true, start: '09:00', end: '15:00', duration: 30 },
          saturday: { active: false, start: '09:00', end: '15:00', duration: 30 },
          sunday: { active: false, start: '09:00', end: '15:00', duration: 30 }
        }
      },
      '2': {
        doctorName: 'Dr. Sarah Wijaya',
        schedule: {
          monday: { active: true, start: '08:00', end: '14:00', duration: 30 },
          tuesday: { active: true, start: '08:00', end: '14:00', duration: 30 },
          wednesday: { active: true, start: '08:00', end: '14:00', duration: 30 },
          thursday: { active: true, start: '08:00', end: '14:00', duration: 30 },
          friday: { active: true, start: '08:00', end: '14:00', duration: 30 },
          saturday: { active: true, start: '09:00', end: '12:00', duration: 30 },
          sunday: { active: false, start: '09:00', end: '15:00', duration: 30 }
        }
      }
    };
    return mockData[doctorId];
  },

  open(doctorId) {
    this.currentDoctorId = doctorId || document.getElementById('doctorSelect')?.value || '1';

    // Load schedule data
    const data = this.getMockScheduleData(this.currentDoctorId);
    if (!data) {
      Toast.error('Schedule data not found');
      return;
    }

    // Update doctor name
    document.getElementById('scheduleModalDoctorName').textContent = data.doctorName;

    // Load schedule for each day
    this.loadSchedule(data.schedule);

    // Store original schedule for change detection
    this.originalSchedule = JSON.parse(JSON.stringify(data.schedule));

    // Open modal
    Modal.open('editScheduleModal');

    // Setup event listeners
    this.setupEventListeners();
  },

  loadSchedule(schedule) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
      const dayData = schedule[day];
      const checkbox = document.querySelector(`input[type="checkbox"][data-day="${day}"]`);
      const startSelect = document.querySelector(`select[data-field="start"][data-day="${day}"]`);
      const endSelect = document.querySelector(`select[data-field="end"][data-day="${day}"]`);
      const durationSelect = document.querySelector(`select[data-field="duration"][data-day="${day}"]`);
      const daySection = checkbox.closest('.schedule-day-section');

      // Set checkbox state
      checkbox.checked = dayData.active;

      // Set field values
      startSelect.value = dayData.start;
      endSelect.value = dayData.end;
      durationSelect.value = dayData.duration;

      // Update disabled state
      this.updateDayState(day, dayData.active);
    });
  },

  setupEventListeners() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    // Day checkbox toggles
    days.forEach(day => {
      const checkbox = document.querySelector(`input[type="checkbox"][data-day="${day}"]`);
      checkbox.addEventListener('change', (e) => {
        this.updateDayState(day, e.target.checked);
      });
    });

    // Copy to all days button
    const copyBtn = document.getElementById('copyToAllDaysBtn');
    copyBtn.onclick = () => this.copyToAllDays();

    // Save button
    const saveBtn = document.getElementById('saveScheduleBtn');
    saveBtn.onclick = () => this.saveSchedule();

    // Cancel button
    const cancelBtn = document.getElementById('cancelScheduleBtn');
    cancelBtn.onclick = () => Modal.close('editScheduleModal');
  },

  updateDayState(day, active) {
    const startSelect = document.querySelector(`select[data-field="start"][data-day="${day}"]`);
    const endSelect = document.querySelector(`select[data-field="end"][data-day="${day}"]`);
    const durationSelect = document.querySelector(`select[data-field="duration"][data-day="${day}"]`);
    const daySection = startSelect.closest('.schedule-day-section');

    if (active) {
      startSelect.disabled = false;
      endSelect.disabled = false;
      durationSelect.disabled = false;
      daySection.classList.remove('disabled');
    } else {
      startSelect.disabled = true;
      endSelect.disabled = true;
      durationSelect.disabled = true;
      daySection.classList.add('disabled');
    }
  },

  copyToAllDays() {
    // Get Monday's values
    const mondayCheckbox = document.querySelector('input[type="checkbox"][data-day="monday"]');
    const mondayStart = document.querySelector('select[data-field="start"][data-day="monday"]').value;
    const mondayEnd = document.querySelector('select[data-field="end"][data-day="monday"]').value;
    const mondayDuration = document.querySelector('select[data-field="duration"][data-day="monday"]').value;
    const mondayActive = mondayCheckbox.checked;

    const days = ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(day => {
      const checkbox = document.querySelector(`input[type="checkbox"][data-day="${day}"]`);
      const startSelect = document.querySelector(`select[data-field="start"][data-day="${day}"]`);
      const endSelect = document.querySelector(`select[data-field="end"][data-day="${day}"]`);
      const durationSelect = document.querySelector(`select[data-field="duration"][data-day="${day}"]`);

      checkbox.checked = mondayActive;
      startSelect.value = mondayStart;
      endSelect.value = mondayEnd;
      durationSelect.value = mondayDuration;

      this.updateDayState(day, mondayActive);
    });

    Toast.success('Monday\'s schedule copied to all other days');
  },

  async saveSchedule() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const schedule = {};

    // Collect schedule data
    days.forEach(day => {
      const checkbox = document.querySelector(`input[type="checkbox"][data-day="${day}"]`);
      const startSelect = document.querySelector(`select[data-field="start"][data-day="${day}"]`);
      const endSelect = document.querySelector(`select[data-field="end"][data-day="${day}"]`);
      const durationSelect = document.querySelector(`select[data-field="duration"][data-day="${day}"]`);

      schedule[day] = {
        active: checkbox.checked,
        start: startSelect.value,
        end: endSelect.value,
        duration: parseInt(durationSelect.value)
      };
    });

    // Validate schedule
    const activeDay = Object.values(schedule).some(day => day.active);
    if (!activeDay) {
      Toast.error('At least one day must be active');
      return;
    }

    try {
      Loading.show('.modal-dialog');

      // In production, send to API
      // await API.patch(`/doctors/${this.currentDoctorId}/schedule`, { schedule });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      Toast.success('Schedule saved successfully');
      Loading.hide('.modal-dialog');

      // Close modal and refresh calendar
      setTimeout(() => {
        Modal.close('editScheduleModal');
        // Trigger calendar refresh if needed
        if (window.ScheduleCalendar && window.ScheduleCalendar.render) {
          window.ScheduleCalendar.render();
        }
      }, 500);

    } catch (error) {
      Loading.hide('.modal-dialog');
      Toast.error('Failed to save schedule');
      console.error('Save error:', error);
    }
  }
};

// ============================================
// ADD EXCEPTION MODAL
// ============================================

const AddExceptionModal = {
  currentDoctorId: null,

  open(doctorId) {
    this.currentDoctorId = doctorId || document.getElementById('doctorSelect')?.value || '1';

    // Get doctor name from select
    const doctorSelect = document.getElementById('doctorSelect');
    const doctorName = doctorSelect?.options[doctorSelect.selectedIndex]?.text || 'Dr. Ahmad Surya';

    document.getElementById('exceptionModalDoctorName').textContent = doctorName;

    // Reset form
    this.resetForm();

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('exceptionDate').min = today;

    // Open modal
    Modal.open('addExceptionModal');

    // Setup event listeners
    this.setupEventListeners();
  },

  resetForm() {
    // Reset radio buttons
    document.querySelector('input[name="exceptionType"][value="holiday"]').checked = true;

    // Reset date
    document.getElementById('exceptionDate').value = '';

    // Reset full day checkbox
    document.getElementById('fullDayCheckbox').checked = true;

    // Hide time fields
    document.getElementById('timeFieldsContainer').style.display = 'none';

    // Reset time fields
    document.getElementById('exceptionStartTime').value = '';
    document.getElementById('exceptionEndTime').value = '';

    // Reset reason
    document.getElementById('exceptionReason').value = '';
    document.getElementById('reasonCharCount').textContent = '0';
  },

  setupEventListeners() {
    // Full day checkbox toggle
    const fullDayCheckbox = document.getElementById('fullDayCheckbox');
    fullDayCheckbox.addEventListener('change', (e) => {
      const timeFields = document.getElementById('timeFieldsContainer');
      if (e.target.checked) {
        timeFields.style.display = 'none';
        document.getElementById('exceptionStartTime').value = '';
        document.getElementById('exceptionEndTime').value = '';
      } else {
        timeFields.style.display = 'block';
      }
    });

    // Reason character count
    const reasonTextarea = document.getElementById('exceptionReason');
    reasonTextarea.addEventListener('input', (e) => {
      document.getElementById('reasonCharCount').textContent = e.target.value.length;
    });

    // Add exception button
    const addBtn = document.getElementById('addExceptionBtn');
    addBtn.onclick = () => this.addException();

    // Cancel button
    const cancelBtn = document.getElementById('cancelExceptionBtn');
    cancelBtn.onclick = () => Modal.close('addExceptionModal');
  },

  async addException() {
    // Get form values
    const type = document.querySelector('input[name="exceptionType"]:checked').value;
    const date = document.getElementById('exceptionDate').value;
    const fullDay = document.getElementById('fullDayCheckbox').checked;
    const startTime = document.getElementById('exceptionStartTime').value;
    const endTime = document.getElementById('exceptionEndTime').value;
    const reason = document.getElementById('exceptionReason').value.trim();

    // Validation
    if (!date) {
      Toast.error('Please select a date');
      return;
    }

    // Prevent past dates
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Toast.error('Cannot add exception for past dates');
      return;
    }

    if (!fullDay && (!startTime || !endTime)) {
      Toast.error('Please specify start and end time');
      return;
    }

    if (!fullDay && startTime >= endTime) {
      Toast.error('End time must be after start time');
      return;
    }

    if (!reason) {
      Toast.error('Please provide a reason');
      return;
    }

    const exceptionData = {
      doctorId: this.currentDoctorId,
      type,
      date,
      fullDay,
      startTime: fullDay ? null : startTime,
      endTime: fullDay ? null : endTime,
      reason
    };

    try {
      Loading.show('.modal-dialog');

      // In production, send to API
      // await API.post('/schedule/exceptions', exceptionData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const typeLabel = type === 'holiday' ? 'Holiday' : type === 'leave' ? 'Leave' : 'Block Time';
      Toast.success(`${typeLabel} exception added successfully`);
      Loading.hide('.modal-dialog');

      // Close modal and refresh calendar
      setTimeout(() => {
        Modal.close('addExceptionModal');
        // Trigger calendar refresh if needed
        if (window.ScheduleCalendar && window.ScheduleCalendar.render) {
          window.ScheduleCalendar.render();
        }
      }, 500);

    } catch (error) {
      Loading.hide('.modal-dialog');
      Toast.error('Failed to add exception');
      console.error('Add exception error:', error);
    }
  }
};

// ============================================
// MONTH CALENDAR
// ============================================

const MonthCalendar = {
  currentDate: new Date(2025, 9, 15), // October 15, 2025 (month is 0-indexed)
  selectedDoctor: null,
  currentView: 'week', // 'week' or 'month'

  // Mock data for month view - date status
  getMockMonthData() {
    return {
      '2025-10-01': { booked: 2, available: 4 },
      '2025-10-02': { booked: 3, available: 3 },
      '2025-10-03': { booked: 5, available: 1 },
      '2025-10-06': { booked: 4, available: 2 },
      '2025-10-07': { booked: 3, available: 3 },
      '2025-10-08': { booked: 2, available: 4 },
      '2025-10-09': { booked: 1, available: 5 },
      '2025-10-10': { booked: 4, available: 2 },
      '2025-10-13': { booked: 3, available: 3 },
      '2025-10-14': { booked: 5, available: 1 },
      '2025-10-15': { booked: 6, available: 0 },
      '2025-10-16': { booked: 3, available: 3 },
      '2025-10-17': { booked: 2, available: 4 },
      '2025-10-18': { blocked: true },
      '2025-10-19': { blocked: true },
      '2025-10-20': { booked: 4, available: 2 },
      '2025-10-21': { booked: 3, available: 3 },
      '2025-10-22': { booked: 2, available: 4 },
      '2025-10-23': { booked: 5, available: 1 },
      '2025-10-24': { booked: 4, available: 2 },
      '2025-10-27': { booked: 3, available: 3 },
      '2025-10-28': { booked: 2, available: 4 },
      '2025-10-29': { booked: 4, available: 2 },
      '2025-10-30': { booked: 3, available: 3 },
      '2025-10-31': { booked: 1, available: 5 }
    };
  },

  init(options = {}) {
    this.options = options;
    this.setupViewToggle();
    this.setupNavigation();

    // Set initial doctor
    const doctorSelect = document.getElementById('doctorSelect');
    if (doctorSelect) {
      this.selectedDoctor = doctorSelect.value;
    }
  },

  setupViewToggle() {
    const toggleButtons = document.querySelectorAll('.view-toggle button');

    toggleButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const btnText = e.target.textContent.trim();

        // Update active state
        toggleButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Switch view
        if (btnText === 'Week View') {
          this.switchToWeekView();
        } else if (btnText === 'Month View') {
          this.switchToMonthView();
        }
      });
    });
  },

  setupNavigation() {
    // Month navigation
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.changeMonth(-1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.changeMonth(1));
    }
  },

  switchToWeekView() {
    this.currentView = 'week';
    document.getElementById('weekViewCalendar').style.display = 'block';
    document.getElementById('monthViewCalendar').style.display = 'none';
  },

  switchToMonthView() {
    this.currentView = 'month';
    document.getElementById('weekViewCalendar').style.display = 'none';
    document.getElementById('monthViewCalendar').style.display = 'block';
    this.render();
  },

  changeMonth(direction) {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    this.currentDate = newDate;
    this.render();
  },

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Update header
    this.updateHeader(year, month);

    // Generate calendar
    const container = document.getElementById('monthGrid');
    if (!container) return;

    container.innerHTML = this.generateCalendar(year, month);

    // Attach click handlers
    this.attachDateClickHandlers();
  },

  updateHeader(year, month) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const headerTitle = document.getElementById('monthTitle');
    if (headerTitle) {
      headerTitle.textContent = `${monthNames[month]} ${year}`;
    }
  },

  generateCalendar(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let html = '';

    // Day names header
    html += '<div class="month-header">';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
      html += `<div class="month-day-name">${day}</div>`;
    });
    html += '</div>';

    // Calendar grid
    html += '<div class="month-grid">';

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    let dayCount = 1;
    let nextMonthDay = 1;

    // Total cells: always show 6 weeks (42 cells)
    for (let i = 0; i < 42; i++) {
      let dateNumber, dateString, cellClass, isOtherMonth;

      if (i < firstDayOfMonth) {
        // Previous month dates
        dateNumber = daysInPrevMonth - firstDayOfMonth + i + 1;
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        dateString = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dateNumber).padStart(2, '0')}`;
        cellClass = 'date-cell other-month';
        isOtherMonth = true;
      } else if (dayCount <= daysInMonth) {
        // Current month dates
        dateNumber = dayCount;
        dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNumber).padStart(2, '0')}`;
        cellClass = 'date-cell';
        isOtherMonth = false;

        // Highlight current day
        if (isCurrentMonth && dateNumber === todayDate) {
          cellClass += ' current-day';
        }

        dayCount++;
      } else {
        // Next month dates
        dateNumber = nextMonthDay;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        dateString = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(dateNumber).padStart(2, '0')}`;
        cellClass = 'date-cell other-month';
        isOtherMonth = true;
        nextMonthDay++;
      }

      // Get status for this date
      const status = this.getDateStatus(dateString);
      const dotsHtml = this.generateStatusDots(status);

      html += `
        <div class="${cellClass}" data-date="${dateString}">
          <div class="date-number">${dateNumber}</div>
          <div class="status-dots-container">${dotsHtml}</div>
        </div>
      `;
    }

    html += '</div>';

    return html;
  },

  getDateStatus(dateString) {
    const monthData = this.getMockMonthData();
    return monthData[dateString] || { available: 0, booked: 0 };
  },

  generateStatusDots(status) {
    const dots = [];

    if (status.blocked) {
      dots.push('<div class="status-dot dot-blocked"></div>');
    } else {
      if (status.available > 0) {
        dots.push('<div class="status-dot dot-available"></div>');
      }
      if (status.booked > 0) {
        dots.push('<div class="status-dot dot-booked"></div>');
      }
    }

    return dots.join('');
  },

  attachDateClickHandlers() {
    const dateCells = document.querySelectorAll('.date-cell');

    dateCells.forEach(cell => {
      cell.addEventListener('click', (e) => {
        const dateString = cell.getAttribute('data-date');
        this.handleDateClick(dateString);
      });
    });
  },

  handleDateClick(dateString) {
    // Parse the date
    const [year, month, day] = dateString.split('-').map(Number);
    const clickedDate = new Date(year, month - 1, day);

    // Set the current date to the clicked date
    this.currentDate = clickedDate;

    // Switch to week view
    this.switchToWeekView();

    // Update week calendar to show the week containing this date
    if (window.ScheduleCalendar && window.ScheduleCalendar.currentDate) {
      window.ScheduleCalendar.currentDate = clickedDate;
      window.ScheduleCalendar.render();
    }

    // Update toggle buttons
    const toggleButtons = document.querySelectorAll('.view-toggle button');
    toggleButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.trim() === 'Week View') {
        btn.classList.add('active');
      }
    });
  }
};

// ============================================
// EXPORT
// ============================================

window.Modal = Modal;
window.TableSort = TableSort;
window.Pagination = Pagination;
window.FilterPanel = FilterPanel;
window.SearchInput = SearchInput;
window.FormValidator = FormValidator;
window.PasswordToggle = PasswordToggle;
window.FileUpload = FileUpload;
window.StatAnimation = StatAnimation;
window.ScheduleCalendar = ScheduleCalendar;
window.MonthCalendar = MonthCalendar;
window.Confirm = Confirm;
window.BookingModal = BookingModal;
window.EditScheduleModal = EditScheduleModal;
window.AddExceptionModal = AddExceptionModal;
