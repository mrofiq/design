/**
 * Accessibility Enhancement Script
 * Provides additional accessibility features and improvements
 */

// Accessibility state
const AccessibilityState = {
  focusTrapActive: false,
  focusTrapElements: [],
  lastFocusedElement: null,
  announcements: [],
  keyboardNavigation: {
    roving: false,
    currentIndex: 0,
    elements: []
  }
};

/**
 * Initialize accessibility enhancements
 */
function initializeAccessibilityEnhancements() {
  setupFocusManagement();
  setupKeyboardNavigation();
  setupScreenReaderEnhancements();
  setupMotionPreferences();
  setupHighContrastDetection();
  setupFocusIndicators();
  setupSkipLinks();

  console.log('Accessibility enhancements initialized');
}

/**
 * Set up focus management for modals and panels
 */
function setupFocusManagement() {
  // Monitor for modals opening/closing
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
        const element = mutation.target;
        const isHidden = element.getAttribute('aria-hidden') === 'true';

        if (element.classList.contains('modal') || element.classList.contains('accessibility-panel')) {
          if (!isHidden) {
            trapFocus(element);
          } else {
            releaseFocus();
          }
        }
      }
    });
  });

  // Observe modals and panels
  const modals = document.querySelectorAll('.modal, .accessibility-panel');
  modals.forEach(modal => {
    observer.observe(modal, { attributes: true, attributeFilter: ['aria-hidden'] });
  });
}

/**
 * Trap focus within a container
 */
function trapFocus(container) {
  AccessibilityState.lastFocusedElement = document.activeElement;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  AccessibilityState.focusTrapElements = Array.from(focusableElements);
  AccessibilityState.focusTrapActive = true;

  // Focus first element
  if (AccessibilityState.focusTrapElements.length > 0) {
    AccessibilityState.focusTrapElements[0].focus();
  }

  // Add event listener for tab trapping
  document.addEventListener('keydown', handleFocusTrap);
}

/**
 * Release focus trap
 */
function releaseFocus() {
  AccessibilityState.focusTrapActive = false;
  AccessibilityState.focusTrapElements = [];

  // Remove event listener
  document.removeEventListener('keydown', handleFocusTrap);

  // Return focus to previous element
  if (AccessibilityState.lastFocusedElement) {
    AccessibilityState.lastFocusedElement.focus();
    AccessibilityState.lastFocusedElement = null;
  }
}

/**
 * Handle focus trap keyboard navigation
 */
function handleFocusTrap(e) {
  if (!AccessibilityState.focusTrapActive || e.key !== 'Tab') return;

  const elements = AccessibilityState.focusTrapElements;
  const currentIndex = elements.indexOf(document.activeElement);

  if (e.shiftKey) {
    // Shift + Tab (backward)
    if (currentIndex <= 0) {
      e.preventDefault();
      elements[elements.length - 1].focus();
    }
  } else {
    // Tab (forward)
    if (currentIndex >= elements.length - 1) {
      e.preventDefault();
      elements[0].focus();
    }
  }
}

/**
 * Set up keyboard navigation enhancements
 */
function setupKeyboardNavigation() {
  // Roving tabindex for question list
  setupRovingTabindex('.qa-list', '.question-item .upvote-btn');

  // Arrow key navigation for rating stars
  setupArrowKeyNavigation('.rating-stars', 'input[type="radio"]');

  // Keyboard shortcuts help
  document.addEventListener('keydown', (e) => {
    // F1 or ? to show help
    if (e.key === 'F1' || (e.key === '?' && !isInputElement(e.target))) {
      e.preventDefault();
      showHelpModal();
    }

    // Alt + A for accessibility panel
    if (e.altKey && e.key === 'a') {
      e.preventDefault();
      toggleAccessibilityPanel();
    }

    // Alt + T for theme toggle
    if (e.altKey && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

/**
 * Set up roving tabindex navigation
 */
function setupRovingTabindex(containerSelector, itemSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.addEventListener('keydown', (e) => {
    const items = Array.from(container.querySelectorAll(itemSelector));
    const currentIndex = items.indexOf(document.activeElement);

    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    // Update tabindex
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === newIndex ? '0' : '-1');
    });

    items[newIndex].focus();
  });

  // Initialize tabindex
  const items = container.querySelectorAll(itemSelector);
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
  });
}

/**
 * Set up arrow key navigation for radio groups
 */
function setupArrowKeyNavigation(containerSelector, itemSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.addEventListener('keydown', (e) => {
    const items = Array.from(container.querySelectorAll(itemSelector));
    const currentIndex = items.indexOf(document.activeElement);

    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      default:
        return;
    }

    items[newIndex].checked = true;
    items[newIndex].focus();
    items[newIndex].dispatchEvent(new Event('change', { bubbles: true }));
  });
}

/**
 * Set up screen reader enhancements
 */
function setupScreenReaderEnhancements() {
  // Create live region for dynamic announcements
  createLiveRegion();

  // Enhance form errors with better announcements
  enhanceFormErrors();

  // Add descriptive labels to complex interfaces
  enhanceComplexInterfaces();

  // Monitor for dynamic content changes
  monitorDynamicContent();
}

/**
 * Create live region for announcements
 */
function createLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.id = 'accessibility-live-region';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message, priority = 'polite') {
  const liveRegion = document.getElementById('accessibility-live-region');
  if (!liveRegion) return;

  // Clear previous message
  liveRegion.textContent = '';

  // Set priority
  liveRegion.setAttribute('aria-live', priority);

  // Add message after a brief delay to ensure it's announced
  setTimeout(() => {
    liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }, 100);
}

/**
 * Enhance form errors with better screen reader support
 */
function enhanceFormErrors() {
  // Monitor for form validation
  document.addEventListener('invalid', (e) => {
    const field = e.target;
    const errorMessage = field.validationMessage;

    // Announce error
    announceToScreenReader(`Error in ${field.name || 'form field'}: ${errorMessage}`, 'assertive');
  }, true);

  // Enhance custom form errors
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('field-error')) {
          announceToScreenReader(`Error: ${node.textContent}`, 'assertive');
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

/**
 * Enhance complex interfaces with better descriptions
 */
function enhanceComplexInterfaces() {
  // Add descriptions to slide viewer
  const slideViewer = document.querySelector('.slide-viewer');
  if (slideViewer) {
    slideViewer.setAttribute('aria-description', 'Interactive slide presentation area with navigation controls');
  }

  // Add descriptions to Q&A section
  const qaSection = document.querySelector('.qa-section');
  if (qaSection) {
    qaSection.setAttribute('aria-description', 'Anonymous question and answer board where you can ask questions and upvote others');
  }

  // Add descriptions to feedback buttons
  const feedbackButtons = document.querySelectorAll('.feedback-btn');
  feedbackButtons.forEach(btn => {
    const reaction = btn.getAttribute('data-reaction');
    btn.setAttribute('aria-description', `Send ${reaction} feedback for the current slide`);
  });

  // Enhance code blocks with copy functionality
  const codeBlocks = document.querySelectorAll('.code-block');
  codeBlocks.forEach(block => {
    block.setAttribute('role', 'region');
    block.setAttribute('aria-label', 'Code example with copy functionality');
  });
}

/**
 * Monitor dynamic content changes
 */
function monitorDynamicContent() {
  // Monitor for new questions in Q&A
  const qaList = document.getElementById('qa-list');
  if (qaList) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('question-item')) {
            // Don't announce optimistic questions
            const isOptimistic = node.querySelector('.question-text')?.textContent.includes('...');
            if (!isOptimistic) {
              announceToScreenReader('New question added to the board');
            }
          }
        });
      });
    });

    observer.observe(qaList, { childList: true });
  }

  // Monitor for slide changes
  const slideCounter = document.querySelector('.slide-counter');
  if (slideCounter) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const newText = slideCounter.textContent;
          if (newText && newText.includes('/')) {
            announceToScreenReader(`Slide changed to ${newText}`);
          }
        }
      });
    });

    observer.observe(slideCounter, { childList: true, characterData: true, subtree: true });
  }
}

/**
 * Set up motion preferences detection
 */
function setupMotionPreferences() {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleMotionChange(e) {
    if (e.matches) {
      document.documentElement.classList.add('reduce-motion');
      reduceMotion();
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }

  motionQuery.addEventListener('change', handleMotionChange);
  handleMotionChange(motionQuery);
}

/**
 * Reduce motion in animations
 */
function reduceMotion() {
  // Disable smooth scrolling
  document.documentElement.style.scrollBehavior = 'auto';

  // Reduce animation durations
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Set up high contrast detection
 */
function setupHighContrastDetection() {
  const contrastQuery = window.matchMedia('(prefers-contrast: high)');

  function handleContrastChange(e) {
    if (e.matches) {
      document.documentElement.classList.add('high-contrast-preferred');
      enhanceContrast();
    } else {
      document.documentElement.classList.remove('high-contrast-preferred');
    }
  }

  contrastQuery.addEventListener('change', handleContrastChange);
  handleContrastChange(contrastQuery);
}

/**
 * Enhance contrast for better visibility
 */
function enhanceContrast() {
  const style = document.createElement('style');
  style.textContent = `
    .high-contrast-preferred {
      --color-border: #000000;
      --color-text-secondary: #000000;
    }

    .high-contrast-preferred .btn {
      border-width: 2px;
    }

    .high-contrast-preferred .form-input:focus,
    .high-contrast-preferred .form-textarea:focus {
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.5);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Set up enhanced focus indicators
 */
function setupFocusIndicators() {
  // Track if user is using keyboard
  let keyboardUser = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      keyboardUser = true;
      document.documentElement.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    keyboardUser = false;
    document.documentElement.classList.remove('keyboard-navigation');
  });

  // Enhance focus for keyboard users
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-navigation :focus {
      outline: 3px solid var(--color-primary);
      outline-offset: 2px;
    }

    .keyboard-navigation .btn:focus {
      outline: 3px solid var(--color-primary);
      outline-offset: 2px;
    }

    .keyboard-navigation .question-item:focus-within {
      outline: 2px solid var(--color-primary);
      outline-offset: 1px;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Set up skip links functionality
 */
function setupSkipLinks() {
  const skipLinks = document.querySelectorAll('.skip-link');

  skipLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Check if element is an input element
 */
function isInputElement(element) {
  const inputElements = ['INPUT', 'TEXTAREA', 'SELECT'];
  return inputElements.includes(element.tagName) || element.contentEditable === 'true';
}

/**
 * Add accessibility testing helpers
 */
function addAccessibilityTestingHelpers() {
  // Only in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Add landmark navigation
    addLandmarkNavigation();

    // Add heading navigation
    addHeadingNavigation();

    // Add accessibility audit button
    addAccessibilityAuditButton();
  }
}

/**
 * Add landmark navigation for testing
 */
function addLandmarkNavigation() {
  const landmarks = document.querySelectorAll('[role], main, nav, header, footer, aside, section');

  window.navigateToLandmark = (index) => {
    if (landmarks[index]) {
      landmarks[index].focus();
      landmarks[index].scrollIntoView({ behavior: 'smooth' });
      announceToScreenReader(`Navigated to ${landmarks[index].tagName.toLowerCase()} landmark`);
    }
  };

  console.log('Landmark navigation available. Use navigateToLandmark(index) to test.');
}

/**
 * Add heading navigation for testing
 */
function addHeadingNavigation() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  window.navigateToHeading = (index) => {
    if (headings[index]) {
      headings[index].focus();
      headings[index].scrollIntoView({ behavior: 'smooth' });
      announceToScreenReader(`Navigated to ${headings[index].tagName.toLowerCase()}: ${headings[index].textContent}`);
    }
  };

  console.log('Heading navigation available. Use navigateToHeading(index) to test.');
}

/**
 * Add accessibility audit button for testing
 */
function addAccessibilityAuditButton() {
  const auditBtn = document.createElement('button');
  auditBtn.textContent = 'Run A11y Audit';
  auditBtn.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 10000;
    background: #ff0000;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    font-size: 12px;
  `;

  auditBtn.addEventListener('click', runBasicAccessibilityAudit);
  document.body.appendChild(auditBtn);
}

/**
 * Run basic accessibility audit
 */
function runBasicAccessibilityAudit() {
  const issues = [];

  // Check for missing alt text
  const images = document.querySelectorAll('img:not([alt])');
  if (images.length > 0) {
    issues.push(`${images.length} images missing alt text`);
  }

  // Check for missing labels
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  const unlabeledInputs = Array.from(inputs).filter(input => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    return !label;
  });
  if (unlabeledInputs.length > 0) {
    issues.push(`${unlabeledInputs.length} inputs missing labels`);
  }

  // Check for missing headings
  const h1s = document.querySelectorAll('h1');
  if (h1s.length === 0) {
    issues.push('No h1 heading found');
  }

  // Check for insufficient color contrast (basic check)
  const lowContrastElements = document.querySelectorAll('.color-text-muted');
  if (lowContrastElements.length > 0) {
    issues.push(`${lowContrastElements.length} elements may have low contrast`);
  }

  // Report results
  if (issues.length === 0) {
    console.log('✅ No obvious accessibility issues found');
    announceToScreenReader('Accessibility audit completed. No issues found.');
  } else {
    console.warn('⚠️ Accessibility issues found:', issues);
    announceToScreenReader(`Accessibility audit completed. ${issues.length} issues found. Check console for details.`);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeAccessibilityEnhancements();
    addAccessibilityTestingHelpers();
  });
} else {
  initializeAccessibilityEnhancements();
  addAccessibilityTestingHelpers();
}

// Export functions for use in other scripts
window.announceToScreenReader = announceToScreenReader;
window.AccessibilityHelpers = {
  trapFocus,
  releaseFocus,
  announceToScreenReader,
  runBasicAccessibilityAudit
};