// ============================================
// Owner Dashboard - Interactive JavaScript
// ============================================

// Sample Data
const sampleData = {
  dashboard: {
    todayBookings: 24,
    todayRevenue: 1200000,
    todayCommission: 240000,
    pendingConfirmations: 3,
    monthNoShowRate: 8.5,
    activeDoctors: 5,
    trends: {
      bookings: 12,
      revenue: 15
    },
    bookingTrends: {
      '7days': [
        { date: '2025-09-27', fastTrack: 15, regular: 5 },
        { date: '2025-09-28', fastTrack: 18, regular: 6 },
        { date: '2025-09-29', fastTrack: 12, regular: 4 },
        { date: '2025-09-30', fastTrack: 20, regular: 7 },
        { date: '2025-10-01', fastTrack: 22, regular: 8 },
        { date: '2025-10-02', fastTrack: 17, regular: 6 },
        { date: '2025-10-03', fastTrack: 19, regular: 7 }
      ]
    }
  },
  revenue: {
    total: 8500000,
    fastTrackTotal: 7000000,
    commission: 1700000,
    doctorEarnings: 6800000,
    byDoctor: [
      { id: 1, name: 'Dr. Ahmad Surya', bookings: 42, fastTrack: 30, regular: 12, revenue: 1500000, commission: 300000, noShowRate: 9.5, rating: 4.7 },
      { id: 2, name: 'Dr. Siti Nurhaliza', bookings: 38, fastTrack: 28, regular: 10, revenue: 1300000, commission: 260000, noShowRate: 7.8, rating: 4.8 },
      { id: 3, name: 'Dr. Budi Santoso', bookings: 35, fastTrack: 25, regular: 10, revenue: 1200000, commission: 240000, noShowRate: 11.4, rating: 4.5 },
      { id: 4, name: 'Dr. Rina Kusuma', bookings: 32, fastTrack: 22, regular: 10, revenue: 1100000, commission: 220000, noShowRate: 6.2, rating: 4.9 },
      { id: 5, name: 'Dr. Andi Wijaya', bookings: 28, fastTrack: 18, regular: 10, revenue: 950000, commission: 190000, noShowRate: 14.3, rating: 4.3 }
    ],
    dailyTrend: [
      { date: '2025-09-03', revenue: 250000 },
      { date: '2025-09-04', revenue: 280000 },
      { date: '2025-09-05', revenue: 310000 },
      { date: '2025-09-06', revenue: 290000 },
      { date: '2025-09-07', revenue: 320000 },
      { date: '2025-09-08', revenue: 270000 },
      { date: '2025-09-09', revenue: 300000 }
    ]
  },
  users: [
    { id: 1, name: 'Admin User 1', username: 'admin1', email: 'admin1@clinic.com', role: 'admin', status: 'active', lastLogin: '2025-10-03 09:30' },
    { id: 2, name: 'Admin User 2', username: 'admin2', email: 'admin2@clinic.com', role: 'admin', status: 'active', lastLogin: '2025-10-02 14:15' },
    { id: 3, name: 'Owner Account', username: 'owner', email: 'owner@clinic.com', role: 'owner', status: 'active', lastLogin: '2025-10-03 10:00' }
  ]
};

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount).replace('IDR', 'Rp');
}

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short'
  });
}

// Count Up Animation
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }

    if (element.dataset.format === 'currency') {
      element.textContent = formatCurrency(current);
    } else if (element.dataset.format === 'percent') {
      element.textContent = current.toFixed(1) + '%';
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Initialize count-up animations on page load
function initCountUpAnimations() {
  const statValues = document.querySelectorAll('.stat-value[data-value]');
  statValues.forEach(element => {
    const targetValue = parseFloat(element.dataset.value);
    animateValue(element, 0, targetValue, 1000);
  });
}

// Export Dropdown
function initExportDropdown() {
  const dropdowns = document.querySelectorAll('.export-dropdown');

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.export-trigger');
    const menu = dropdown.querySelector('.export-menu');

    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          menu.classList.remove('active');
        }
      });

      // Handle export options
      const options = menu.querySelectorAll('.export-option');
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          const format = e.currentTarget.dataset.format;
          handleExport(format);
          menu.classList.remove('active');
        });
      });
    }
  });
}

function handleExport(format) {
  showToast(`Exporting report as ${format.toUpperCase()}...`, 'info');

  // Simulate export process
  setTimeout(() => {
    showToast(`Report exported successfully as ${format.toUpperCase()}`, 'success');
  }, 1500);
}

// Date Range Picker
function initDateRangePicker() {
  const pickers = document.querySelectorAll('.date-range-picker');

  pickers.forEach(picker => {
    const buttons = picker.querySelectorAll('.preset-button');
    const customRange = picker.querySelector('.custom-range');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        if (button.dataset.preset === 'custom') {
          customRange?.classList.add('active');
        } else {
          customRange?.classList.remove('active');
          updateDateRange(button.dataset.preset);
        }
      });
    });
  });
}

function updateDateRange(preset) {
  console.log(`Date range updated to: ${preset}`);
  // In real app, this would fetch new data from API
}

// Chart Period Toggle
function initChartPeriodToggle() {
  const chartContainers = document.querySelectorAll('.chart-container');

  chartContainers.forEach(container => {
    const periodButtons = container.querySelectorAll('.chart-period');

    periodButtons.forEach(button => {
      button.addEventListener('click', () => {
        periodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const period = button.dataset.period;
        updateChartData(container, period);
      });
    });
  });
}

function updateChartData(container, period) {
  console.log(`Updating chart to ${period} period`);
  // In real app, this would update the chart with new data
}

// Chart.js Integration
function initCharts() {
  // Line Chart - Booking Trends
  const lineChartCanvas = document.getElementById('bookingTrendsChart');
  if (lineChartCanvas && typeof Chart !== 'undefined') {
    const ctx = lineChartCanvas.getContext('2d');
    const data = sampleData.dashboard.bookingTrends['7days'];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => formatDate(d.date)),
        datasets: [
          {
            label: 'Fast-Track',
            data: data.map(d => d.fastTrack),
            borderColor: '#00CED1',
            backgroundColor: 'rgba(0, 206, 209, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Regular',
            data: data.map(d => d.regular),
            borderColor: '#A855F7',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#FFFFFF',
            titleColor: '#0F172A',
            bodyColor: '#334155',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#EDF2F7',
              drawBorder: false
            },
            ticks: {
              color: '#94A3B8',
              font: { size: 12 }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94A3B8',
              font: { size: 12 }
            }
          }
        }
      }
    });
  }

  // Bar Chart - Revenue by Doctor
  const barChartCanvas = document.getElementById('revenueByDoctorChart');
  if (barChartCanvas && typeof Chart !== 'undefined') {
    const ctx = barChartCanvas.getContext('2d');
    const doctors = sampleData.revenue.byDoctor;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: doctors.map(d => d.name.replace('Dr. ', '')),
        datasets: [{
          label: 'Revenue',
          data: doctors.map(d => d.revenue),
          backgroundColor: 'rgba(0, 229, 232, 0.8)',
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#FFFFFF',
            titleColor: '#0F172A',
            bodyColor: '#334155',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                return formatCurrency(context.parsed.y);
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#EDF2F7',
              drawBorder: false
            },
            ticks: {
              color: '#94A3B8',
              font: { size: 12 },
              callback: function(value) {
                return formatCurrency(value);
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94A3B8',
              font: { size: 12 }
            }
          }
        }
      }
    });
  }

  // Donut Chart - Booking Types
  const donutChartCanvas = document.getElementById('bookingTypesChart');
  if (donutChartCanvas && typeof Chart !== 'undefined') {
    const ctx = donutChartCanvas.getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Fast-Track', 'Regular'],
        datasets: [{
          data: [89, 35],
          backgroundColor: ['#00CED1', '#A855F7'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#FFFFFF',
            titleColor: '#0F172A',
            bodyColor: '#334155',
            borderColor: '#E2E8F0',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(0);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  // Mini Line Chart - Revenue Trend
  const miniChartCanvas = document.getElementById('miniRevenueChart');
  if (miniChartCanvas && typeof Chart !== 'undefined') {
    const ctx = miniChartCanvas.getContext('2d');
    const data = sampleData.revenue.dailyTrend;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          data: data.map(d => d.revenue),
          borderColor: '#00CED1',
          backgroundColor: 'rgba(0, 206, 209, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true
          },
          x: {
            display: false
          }
        }
      }
    });
  }
}

// Toast Notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 16px 20px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-left: 4px solid ${getToastColor(type)};
    z-index: 10000;
    min-width: 300px;
    animation: slideInRight 300ms ease-out;
  `;

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="font-size: 14px; color: #334155; font-weight: 500;">${message}</div>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 300ms ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getToastColor(type) {
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };
  return colors[type] || colors.info;
}

// Password Strength Checker
function initPasswordStrength() {
  const passwordInput = document.getElementById('password');
  if (!passwordInput) return;

  passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    updatePasswordStrengthUI(strength);
  });
}

function calculatePasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;

  return { checks, score };
}

function updatePasswordStrengthUI(strength) {
  const { checks, score } = strength;

  // Update bar
  const strengthFill = document.querySelector('.strength-fill');
  if (strengthFill) {
    strengthFill.className = 'strength-fill';
    if (score <= 1) {
      strengthFill.classList.add('weak');
    } else if (score <= 3) {
      strengthFill.classList.add('medium');
    } else {
      strengthFill.classList.add('strong');
    }
  }

  // Update label
  const strengthLabel = document.querySelector('.strength-label');
  if (strengthLabel) {
    const labels = ['Weak', 'Weak', 'Medium', 'Medium', 'Strong'];
    strengthLabel.textContent = labels[score] || 'Weak';
    strengthLabel.style.color = score <= 1 ? '#EF4444' : score <= 3 ? '#F59E0B' : '#10B981';
  }

  // Update requirements
  updateRequirement('length', checks.length);
  updateRequirement('uppercase', checks.uppercase);
  updateRequirement('number', checks.number);
  updateRequirement('special', checks.special);
}

function updateRequirement(id, met) {
  const element = document.getElementById(`req-${id}`);
  if (element) {
    element.className = met ? 'met' : 'unmet';
    element.innerHTML = met
      ? `<svg style="width:14px;height:14px;display:inline-block;margin-right:4px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>${element.dataset.label}`
      : `<svg style="width:14px;height:14px;display:inline-block;margin-right:4px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>${element.dataset.label}`;
  }
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isValid = validateForm(form);
      if (isValid) {
        handleFormSubmit(form);
      }
    });
  });
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], select[required]');

  inputs.forEach(input => {
    if (!input.value.trim()) {
      showFieldError(input, 'This field is required');
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  // Email validation
  const emailInputs = form.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    if (input.value && !isValidEmail(input.value)) {
      showFieldError(input, 'Please enter a valid email');
      isValid = false;
    }
  });

  // Password confirmation
  const password = form.querySelector('#password');
  const confirmPassword = form.querySelector('#confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    showFieldError(confirmPassword, 'Passwords do not match');
    isValid = false;
  }

  return isValid;
}

function showFieldError(input, message) {
  input.classList.add('error');

  let errorElement = input.parentElement.querySelector('.form-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    input.parentElement.appendChild(errorElement);
  }
  errorElement.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errorElement = input.parentElement.querySelector('.form-error');
  if (errorElement) {
    errorElement.remove();
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleFormSubmit(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  console.log('Form submitted:', data);
  showToast('User created successfully!', 'success');

  setTimeout(() => {
    window.location.href = 'user-management.html';
  }, 1500);
}

// Delete User Confirmation
function initDeleteConfirmation() {
  const deleteButtons = document.querySelectorAll('[data-action="delete"]');

  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const userId = button.dataset.userId;
      const userName = button.dataset.userName;

      if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
        handleUserDelete(userId);
      }
    });
  });
}

function handleUserDelete(userId) {
  console.log('Deleting user:', userId);
  showToast('User deleted successfully', 'success');

  // Remove row from table
  setTimeout(() => {
    const row = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (row) {
      row.style.animation = 'fadeOut 300ms ease-out';
      setTimeout(() => row.remove(), 300);
    }
  }, 500);
}

// Navigation Active State
function setActiveNavigation() {
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPath.includes(href)) {
      item.classList.add('active');
    }
  });
}

// Initialize all functions on page load
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavigation();
  initCountUpAnimations();
  initExportDropdown();
  initDateRangePicker();
  initChartPeriodToggle();
  initPasswordStrength();
  initFormValidation();
  initDeleteConfirmation();

  // Initialize charts after a short delay to ensure DOM is ready
  setTimeout(() => {
    initCharts();
  }, 100);
});

// Add toast animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
