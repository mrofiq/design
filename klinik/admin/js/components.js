// Interactive Components - Klinik Admin Dashboard

// ============================================
// MODAL COMPONENT
// ============================================

const Modal = {
  current: null,

  open(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.current = modal;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

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

    // Callback after open
    if (options.onOpen) {
      options.onOpen();
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.style.display = 'none';
    document.body.style.overflow = '';
    this.current = null;
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = '';
    this.current = null;
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
window.Confirm = Confirm;
