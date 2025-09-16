/**
 * Online Training Companion - Main JavaScript
 * Handles navigation, theme switching, and core functionality
 */

// Application state
const AppState = {
  currentScreen: 'landing-screen',
  theme: 'light',
  fontSize: 'normal',
  contrast: 'normal',
  motionReduced: false,
  sessionData: null,
  currentSlide: 1,
  totalSlides: 25
};

// DOM Elements
const Elements = {
  // Core elements
  app: null,
  loadingScreen: null,
  screens: [],

  // Navigation elements
  themeToggle: null,
  accessibilityMenu: null,
  accessibilityPanel: null,

  // Forms
  sessionAccessForm: null,
  expectationsForm: null,
  feedbackForm: null,

  // Modals
  helpModal: null,
  helpBtn: null,

  // Demo buttons
  demoButtons: [],

  // Slide controls
  prevSlideBtn: null,
  nextSlideBtn: null,
  slideCounter: null,
  currentSlideElement: null,

  // Feedback elements
  feedbackButtons: [],

  // Q&A elements
  qaForm: null,
  qaInput: null,
  qaSendBtn: null,
  qaList: null,
  qaSort: null,
  qaLiveRegion: null,

  // Notes
  slideNotes: null,

  // Character counters
  characterCounters: []
};

/**
 * Initialize the application
 */
function initializeApp() {
  // Cache DOM elements
  cacheElements();

  // Set up event listeners
  setupEventListeners();

  // Initialize features
  initializeTheme();
  initializeAccessibility();
  initializeNavigation();
  initializeForms();
  initializeSlideViewer();
  initializeFeedback();
  initializeNotes();

  // Check for media queries
  checkMediaQueries();

  // Hide loading screen
  hideLoadingScreen();

  console.log('Online Training Companion initialized');
}

/**
 * Cache DOM elements for performance
 */
function cacheElements() {
  // Core elements
  Elements.app = document.getElementById('app');
  Elements.loadingScreen = document.getElementById('loading-screen');
  Elements.screens = Array.from(document.querySelectorAll('.screen'));

  // Navigation
  Elements.themeToggle = document.getElementById('theme-toggle');
  Elements.accessibilityMenu = document.getElementById('accessibility-menu');
  Elements.accessibilityPanel = document.getElementById('accessibility-panel');

  // Forms
  Elements.sessionAccessForm = document.getElementById('session-access-form');
  Elements.expectationsForm = document.getElementById('expectations-form');
  Elements.feedbackForm = document.getElementById('feedback-form');

  // Modals
  Elements.helpModal = document.getElementById('help-modal');
  Elements.helpBtn = document.getElementById('help-btn');

  // Demo buttons
  Elements.demoButtons = Array.from(document.querySelectorAll('[data-mode]'));

  // Slide controls
  Elements.prevSlideBtn = document.getElementById('prev-slide');
  Elements.nextSlideBtn = document.getElementById('next-slide');
  Elements.slideCounter = document.querySelector('.slide-counter');
  Elements.currentSlideElement = document.getElementById('current-slide');

  // Feedback
  Elements.feedbackButtons = Array.from(document.querySelectorAll('.feedback-btn'));

  // Q&A
  Elements.qaForm = document.getElementById('qa-form');
  Elements.qaInput = document.getElementById('qa-ask-input');
  Elements.qaSendBtn = document.getElementById('qa-send-btn');
  Elements.qaList = document.getElementById('qa-list');
  Elements.qaSort = document.getElementById('qa-sort');
  Elements.qaLiveRegion = document.getElementById('qa-live');

  // Notes
  Elements.slideNotes = document.getElementById('slide-notes');

  // Character counters
  Elements.characterCounters = Array.from(document.querySelectorAll('.character-count'));
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Theme toggle
  if (Elements.themeToggle) {
    Elements.themeToggle.addEventListener('click', toggleTheme);
  }

  // Accessibility menu
  if (Elements.accessibilityMenu) {
    Elements.accessibilityMenu.addEventListener('click', toggleAccessibilityPanel);
  }

  // Demo buttons
  Elements.demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.target.getAttribute('data-mode');
      switchToScreen(mode);
    });
  });

  // Forms
  if (Elements.sessionAccessForm) {
    Elements.sessionAccessForm.addEventListener('submit', handleSessionAccess);
  }

  if (Elements.expectationsForm) {
    Elements.expectationsForm.addEventListener('submit', handleExpectationsSubmit);
  }

  if (Elements.feedbackForm) {
    Elements.feedbackForm.addEventListener('submit', handleFeedbackSubmit);
  }

  // Slide navigation
  if (Elements.prevSlideBtn) {
    Elements.prevSlideBtn.addEventListener('click', previousSlide);
  }

  if (Elements.nextSlideBtn) {
    Elements.nextSlideBtn.addEventListener('click', nextSlide);
  }

  // Feedback buttons
  Elements.feedbackButtons.forEach(btn => {
    btn.addEventListener('click', handleFeedbackReaction);
  });

  // Q&A form
  if (Elements.qaForm) {
    Elements.qaForm.addEventListener('submit', handleQASubmit);
  }

  // Q&A input keyboard shortcuts
  if (Elements.qaInput) {
    Elements.qaInput.addEventListener('keydown', handleQAKeyboard);
    Elements.qaInput.addEventListener('input', updateCharacterCount);
  }

  // Q&A sort
  if (Elements.qaSort) {
    Elements.qaSort.addEventListener('change', handleQASort);
  }

  // Help modal
  if (Elements.helpBtn) {
    Elements.helpBtn.addEventListener('click', showHelpModal);
  }

  // Modal close buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close') || e.target.classList.contains('panel-close')) {
      closeModal(e.target.closest('.modal, .accessibility-panel'));
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', handleGlobalKeyboard);

  // Notes auto-save
  if (Elements.slideNotes) {
    Elements.slideNotes.addEventListener('input', debounce(saveNotes, 1000));
  }

  // Character count updates
  document.addEventListener('input', (e) => {
    if (e.target.hasAttribute('maxlength')) {
      updateCharacterCount(e);
    }
  });

  // Accessibility controls
  setupAccessibilityControls();

  // Window events
  window.addEventListener('resize', debounce(checkMediaQueries, 250));
}

/**
 * Initialize theme system
 */
function initializeTheme() {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('training-companion-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  AppState.theme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(AppState.theme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('training-companion-theme')) {
      AppState.theme = e.matches ? 'dark' : 'light';
      applyTheme(AppState.theme);
    }
  });
}

/**
 * Apply theme to the document
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  if (Elements.themeToggle) {
    Elements.themeToggle.setAttribute('aria-pressed', theme === 'dark');
  }

  // Update theme icon
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
  applyTheme(AppState.theme);
  localStorage.setItem('training-companion-theme', AppState.theme);
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
  // Check for saved accessibility preferences
  AppState.fontSize = localStorage.getItem('training-companion-font-size') || 'normal';
  AppState.contrast = localStorage.getItem('training-companion-contrast') || 'normal';
  AppState.motionReduced = localStorage.getItem('training-companion-motion') === 'reduced';

  // Apply saved preferences
  applyAccessibilitySettings();

  // Check for prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    AppState.motionReduced = true;
    applyAccessibilitySettings();
  }
}

/**
 * Apply accessibility settings
 */
function applyAccessibilitySettings() {
  document.documentElement.setAttribute('data-font-size', AppState.fontSize);
  document.documentElement.setAttribute('data-contrast', AppState.contrast);

  if (AppState.motionReduced) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
  }
}

/**
 * Set up accessibility control panel
 */
function setupAccessibilityControls() {
  const fontSizeControl = document.getElementById('font-size-control');
  const contrastControl = document.getElementById('contrast-control');
  const motionControl = document.getElementById('motion-control');

  if (fontSizeControl) {
    fontSizeControl.value = AppState.fontSize;
    fontSizeControl.addEventListener('change', (e) => {
      AppState.fontSize = e.target.value;
      applyAccessibilitySettings();
      localStorage.setItem('training-companion-font-size', AppState.fontSize);
    });
  }

  if (contrastControl) {
    contrastControl.value = AppState.contrast;
    contrastControl.addEventListener('change', (e) => {
      AppState.contrast = e.target.value;
      applyAccessibilitySettings();
      localStorage.setItem('training-companion-contrast', AppState.contrast);
    });
  }

  if (motionControl) {
    motionControl.checked = AppState.motionReduced;
    motionControl.addEventListener('change', (e) => {
      AppState.motionReduced = e.target.checked;
      applyAccessibilitySettings();
      localStorage.setItem('training-companion-motion', AppState.motionReduced ? 'reduced' : 'normal');
    });
  }
}

/**
 * Toggle accessibility panel
 */
function toggleAccessibilityPanel() {
  const isOpen = Elements.accessibilityPanel.getAttribute('aria-hidden') !== 'true';

  if (isOpen) {
    closeModal(Elements.accessibilityPanel);
  } else {
    showModal(Elements.accessibilityPanel);
    Elements.accessibilityMenu.setAttribute('aria-expanded', 'true');
  }
}

/**
 * Initialize navigation system
 */
function initializeNavigation() {
  // Set initial screen
  switchToScreen('landing-screen');
}

/**
 * Switch to a different screen
 */
function switchToScreen(screenId) {
  // Handle demo mode mapping
  const screenMap = {
    'pre-training': 'pre-training-screen',
    'in-training': 'in-training-screen',
    'post-training': 'post-training-screen',
    'trainer': 'trainer-screen'
  };

  const targetScreen = screenMap[screenId] || screenId;

  // Hide all screens
  Elements.screens.forEach(screen => {
    screen.classList.remove('active');
  });

  // Show target screen
  const screen = document.getElementById(targetScreen);
  if (screen) {
    screen.classList.add('active');
    AppState.currentScreen = targetScreen;

    // Update page title
    updatePageTitle(targetScreen);

    // Initialize screen-specific features
    initializeScreenFeatures(targetScreen);

    // Announce screen change to screen readers
    announceToScreenReader(`Switched to ${getScreenTitle(targetScreen)} screen`);
  }
}

/**
 * Get screen title for announcements
 */
function getScreenTitle(screenId) {
  const titles = {
    'landing-screen': 'Landing',
    'pre-training-screen': 'Pre-training',
    'in-training-screen': 'Training session',
    'post-training-screen': 'Training completion',
    'trainer-screen': 'Trainer dashboard'
  };

  return titles[screenId] || 'Unknown';
}

/**
 * Update page title based on current screen
 */
function updatePageTitle(screenId) {
  const baseTitle = 'Online Training Companion';
  const screenTitle = getScreenTitle(screenId);

  if (screenTitle !== 'Unknown') {
    document.title = `${screenTitle} - ${baseTitle}`;
  } else {
    document.title = baseTitle;
  }
}

/**
 * Initialize features specific to each screen
 */
function initializeScreenFeatures(screenId) {
  switch (screenId) {
    case 'pre-training-screen':
      initializeCountdown();
      break;
    case 'in-training-screen':
      initializeQA();
      loadSlideNotes();
      break;
    case 'post-training-screen':
      initializeRatingStars();
      break;
    case 'trainer-screen':
      initializeTrainerDashboard();
      break;
  }
}

/**
 * Initialize forms
 */
function initializeForms() {
  // Set up form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Validate form inputs
 */
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required]');

  inputs.forEach(input => {
    if (!input.value.trim()) {
      showFieldError(input, 'This field is required');
      isValid = false;
    } else {
      clearFieldError(input);
    }
  });

  return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
  clearFieldError(field);

  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.textContent = message;
  errorElement.setAttribute('role', 'alert');

  field.parentNode.appendChild(errorElement);
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', errorElement.id);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');
}

/**
 * Handle session access form submission
 */
function handleSessionAccess(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const sessionCode = formData.get('sessionCode');
  const participantName = formData.get('participantName');

  // Simulate session validation
  AppState.sessionData = {
    sessionCode,
    participantName,
    sessionTitle: 'Advanced React Development',
    trainerName: 'Dr. Sarah Johnson'
  };

  // Switch to pre-training screen
  switchToScreen('pre-training-screen');

  announceToScreenReader('Successfully joined the training session');
}

/**
 * Handle expectations form submission
 */
function handleExpectationsSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const expectations = formData.get('expectations');

  // Save expectations (simulate API call)
  console.log('Expectations submitted:', expectations);

  // Show success message
  showToast('Your expectations have been submitted successfully!');

  // Clear form
  e.target.reset();
}

/**
 * Handle feedback form submission
 */
function handleFeedbackSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const rating = formData.get('rating');
  const comments = formData.get('comments');

  // Save feedback (simulate API call)
  console.log('Feedback submitted:', { rating, comments });

  // Show success message
  showToast('Thank you for your feedback!');

  // Clear form
  e.target.reset();
}

/**
 * Initialize slide viewer
 */
function initializeSlideViewer() {
  updateSlideCounter();
  updateSlideNavigation();
}

/**
 * Navigate to previous slide
 */
function previousSlide() {
  if (AppState.currentSlide > 1) {
    AppState.currentSlide--;
    updateSlideDisplay();
    announceToScreenReader(`Slide ${AppState.currentSlide} of ${AppState.totalSlides}`);
  }
}

/**
 * Navigate to next slide
 */
function nextSlide() {
  if (AppState.currentSlide < AppState.totalSlides) {
    AppState.currentSlide++;
    updateSlideDisplay();
    announceToScreenReader(`Slide ${AppState.currentSlide} of ${AppState.totalSlides}`);
  }
}

/**
 * Update slide display
 */
function updateSlideDisplay() {
  updateSlideCounter();
  updateSlideNavigation();
  loadSlideNotes();

  // Simulate slide content loading
  if (Elements.currentSlideElement) {
    Elements.currentSlideElement.setAttribute('aria-label', `Slide ${AppState.currentSlide} content`);
  }
}

/**
 * Update slide counter
 */
function updateSlideCounter() {
  if (Elements.slideCounter) {
    Elements.slideCounter.textContent = `${AppState.currentSlide} / ${AppState.totalSlides}`;
    Elements.slideCounter.setAttribute('aria-label', `Slide ${AppState.currentSlide} of ${AppState.totalSlides}`);
  }
}

/**
 * Update slide navigation buttons
 */
function updateSlideNavigation() {
  if (Elements.prevSlideBtn) {
    Elements.prevSlideBtn.disabled = AppState.currentSlide <= 1;
  }

  if (Elements.nextSlideBtn) {
    Elements.nextSlideBtn.disabled = AppState.currentSlide >= AppState.totalSlides;
  }
}

/**
 * Initialize feedback system
 */
function initializeFeedback() {
  // Feedback buttons are already set up in event listeners
}

/**
 * Handle feedback reaction
 */
function handleFeedbackReaction(e) {
  const button = e.currentTarget;
  const reaction = button.getAttribute('data-reaction');
  const isPressed = button.getAttribute('aria-pressed') === 'true';

  // Toggle button state
  button.setAttribute('aria-pressed', !isPressed);

  // Update UI
  if (!isPressed) {
    button.classList.add('active');
    announceToScreenReader(`${reaction} feedback sent`);
  } else {
    button.classList.remove('active');
    announceToScreenReader(`${reaction} feedback removed`);
  }

  // Send feedback (simulate API call)
  console.log('Feedback reaction:', { reaction, active: !isPressed, slide: AppState.currentSlide });
}

/**
 * Initialize notes system
 */
function initializeNotes() {
  loadSlideNotes();
}

/**
 * Load notes for current slide
 */
function loadSlideNotes() {
  if (!Elements.slideNotes) return;

  const savedNotes = localStorage.getItem(`slide-notes-${AppState.currentSlide}`);
  Elements.slideNotes.value = savedNotes || '';
}

/**
 * Save notes for current slide
 */
function saveNotes() {
  if (!Elements.slideNotes) return;

  const notes = Elements.slideNotes.value;
  localStorage.setItem(`slide-notes-${AppState.currentSlide}`, notes);

  // Show subtle indication that notes were saved
  console.log('Notes saved for slide', AppState.currentSlide);
}

/**
 * Initialize countdown timer
 */
function initializeCountdown() {
  const countdownElement = document.getElementById('countdown-time');
  if (!countdownElement) return;

  // Simulate countdown (starts from 15:30)
  let totalSeconds = 15 * 60 + 30;

  const updateCountdown = () => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      clearInterval(countdownInterval);
      countdownElement.textContent = 'Starting...';
      announceToScreenReader('Training session is starting');
    }
  };

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * Initialize rating stars
 */
function initializeRatingStars() {
  const ratingInputs = document.querySelectorAll('input[name="rating"]');

  ratingInputs.forEach((input, index) => {
    input.addEventListener('change', () => {
      announceToScreenReader(`${input.value} stars selected`);
    });
  });
}

/**
 * Initialize trainer dashboard
 */
function initializeTrainerDashboard() {
  console.log('Trainer dashboard initialized');
  // Add trainer-specific functionality here
}

/**
 * Global keyboard event handler
 */
function handleGlobalKeyboard(e) {
  // Escape key closes modals
  if (e.key === 'Escape') {
    const openModal = document.querySelector('.modal:not([aria-hidden="true"]), .accessibility-panel:not([aria-hidden="true"])');
    if (openModal) {
      closeModal(openModal);
    }
  }

  // Keyboard shortcuts for slide navigation
  if (AppState.currentScreen === 'in-training-screen') {
    if (e.key === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      previousSlide();
    } else if (e.key === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      nextSlide();
    }
  }
}

/**
 * Show modal
 */
function showModal(modal) {
  modal.setAttribute('aria-hidden', 'false');

  // Focus management
  const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocusable) {
    firstFocusable.focus();
  }
}

/**
 * Close modal
 */
function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');

  // Reset accessibility menu state if closing accessibility panel
  if (modal.id === 'accessibility-panel' && Elements.accessibilityMenu) {
    Elements.accessibilityMenu.setAttribute('aria-expanded', 'false');
  }
}

/**
 * Show help modal
 */
function showHelpModal() {
  if (Elements.helpModal) {
    showModal(Elements.helpModal);
  }
}

/**
 * Update character count for textareas
 */
function updateCharacterCount(e) {
  const input = e.target;
  const maxLength = input.getAttribute('maxlength');
  const currentLength = input.value.length;

  // Find the character count element
  const counterElement = input.parentNode.querySelector('.character-count') ||
                        input.closest('.form-group').querySelector('.character-count');

  if (counterElement && maxLength) {
    counterElement.textContent = `${currentLength}/${maxLength} characters`;

    // Add warning class if approaching limit
    if (currentLength > maxLength * 0.9) {
      counterElement.classList.add('warning');
    } else {
      counterElement.classList.remove('warning');
    }
  }
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
  if (Elements.loadingScreen) {
    Elements.loadingScreen.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Check media queries and update UI accordingly
 */
function checkMediaQueries() {
  // Check for mobile/tablet/desktop breakpoints and adjust UI if needed
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;
  const isDesktop = window.innerWidth >= 1280;

  // Add responsive classes to body
  document.body.classList.toggle('is-mobile', isMobile);
  document.body.classList.toggle('is-tablet', isTablet);
  document.body.classList.toggle('is-desktop', isDesktop);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-${type === 'success' ? 'success' : 'danger'});
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    z-index: var(--z-toast);
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
  if (Elements.qaLiveRegion) {
    Elements.qaLiveRegion.textContent = message;

    // Clear after a short delay
    setTimeout(() => {
      Elements.qaLiveRegion.textContent = '';
    }, 1000);
  }
}

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Copy code to clipboard
 */
function copyCode(button) {
  const codeBlock = button.closest('.code-block').querySelector('code');
  const text = codeBlock.textContent;

  navigator.clipboard.writeText(text).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);

    announceToScreenReader('Code copied to clipboard');
  }).catch(() => {
    showToast('Failed to copy code', 'error');
  });
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}