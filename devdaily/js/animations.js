/**
 * DevDaily - Animations JavaScript
 * Animation logic and micro-interactions
 */

// Count-up animation for numbers
function animateValue(element, start, end, duration = 600) {
  if (!element) return;

  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Animate all stat values on page
function animateStatValues() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  statValues.forEach(stat => {
    const target = parseInt(stat.dataset.target);
    const duration = parseInt(stat.dataset.duration) || 600;
    animateValue(stat, 0, target, duration);
  });
}

// Progress bar animation
function animateProgressBar(element, targetWidth, duration = 800) {
  if (!element) return;

  element.style.width = '0%';
  setTimeout(() => {
    element.style.transition = `width ${duration}ms ease-out`;
    element.style.width = targetWidth + '%';
  }, 100);
}

// Pulse animation for badges
function pulseBadge(element, count = 3) {
  if (!element) return;

  let pulses = 0;
  const interval = setInterval(() => {
    element.classList.add('pulsing');
    setTimeout(() => element.classList.remove('pulsing'), 500);
    pulses++;
    if (pulses >= count) clearInterval(interval);
  }, 600);
}

// Shake animation for errors
function shakeElement(element) {
  if (!element) return;

  element.classList.add('animate-shake');
  setTimeout(() => element.classList.remove('animate-shake'), 300);
}

// Slide in animation for new items
function slideInElement(element, direction = 'right') {
  if (!element) return;

  const animationClass = `animate-slide-in-${direction}`;
  element.classList.add(animationClass);

  element.addEventListener('animationend', () => {
    element.classList.remove(animationClass);
  }, { once: true });
}

// Fade in animation
function fadeIn(element, duration = 300) {
  if (!element) return;

  element.style.opacity = '0';
  element.style.display = 'block';

  setTimeout(() => {
    element.style.transition = `opacity ${duration}ms ease-out`;
    element.style.opacity = '1';
  }, 10);
}

// Fade out animation
function fadeOut(element, duration = 300) {
  if (!element) return;

  element.style.transition = `opacity ${duration}ms ease-out`;
  element.style.opacity = '0';

  setTimeout(() => {
    element.style.display = 'none';
  }, duration);
}

// Trophy bounce animation
function bounceTrophy(element) {
  if (!element) return;

  element.classList.add('trophy-bounce');
  setTimeout(() => element.classList.remove('trophy-bounce'), 800);
}

// Rank change animation
function animateRankChange(element, direction = 'up') {
  if (!element) return;

  element.classList.add(`rank-change`, direction);
  setTimeout(() => {
    element.classList.remove('rank-change', direction);
  }, 600);
}

// Confetti animation
function createConfetti(count = 50, duration = 3000) {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = [
    '#5B5BD6', // Primary
    '#16A34A', // Success
    '#EA580C', // Warning
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#3B82F6', // Blue
    '#10B981'  // Green
  ];

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (Math.random() * 1 + 2) + 's';

    // Random rotation
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(confetti);
  }

  setTimeout(() => {
    container.remove();
  }, duration);
}

// Loading button state
function setButtonLoading(button, loading = true) {
  if (!button) return;

  if (loading) {
    button.classList.add('loading');
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
    }
  }
}

// Success button state
function setButtonSuccess(button, text = 'Success!', duration = 2000) {
  if (!button) return;

  const originalClass = button.className;
  const originalText = button.innerHTML;

  button.className = 'btn btn-success';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    ${text}
  `;

  setTimeout(() => {
    button.className = originalClass;
    button.innerHTML = originalText;
  }, duration);
}

// Auto-save indicator animation
function showAutoSaveIndicator(containerSelector = '.autosave-indicator') {
  const indicator = document.querySelector(containerSelector);
  if (!indicator) return;

  indicator.classList.remove('hidden');
  indicator.classList.add('autosave-indicator');

  setTimeout(() => {
    indicator.classList.add('hidden');
  }, 2000);
}

// Skeleton loading animation
function showSkeleton(element, show = true) {
  if (!element) return;

  if (show) {
    element.classList.add('skeleton');
  } else {
    element.classList.remove('skeleton');
  }
}

// Points badge pop animation
function popPointsBadge(element) {
  if (!element) return;

  element.classList.add('animate-points-pop');
  setTimeout(() => element.classList.remove('animate-points-pop'), 300);
}

// Intersection Observer for scroll animations
function observeScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger specific animations based on class
        if (entry.target.classList.contains('stat-card')) {
          const value = entry.target.querySelector('.stat-value[data-target]');
          if (value && !value.classList.contains('animated')) {
            const target = parseInt(value.dataset.target);
            animateValue(value, 0, target, 600);
            value.classList.add('animated');
          }
        }

        if (entry.target.classList.contains('progress-bar')) {
          const width = entry.target.dataset.width || 75;
          animateProgressBar(entry.target, width);
        }
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe elements with animation triggers
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// Initialize scroll animations on page load
document.addEventListener('DOMContentLoaded', () => {
  observeScrollAnimations();
});

// Ripple effect on click
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');

  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
  ripple.classList.add('ripple');

  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', createRipple);
  });
});

// Smooth height transition
function animateHeight(element, targetHeight) {
  if (!element) return;

  const currentHeight = element.offsetHeight;
  element.style.height = currentHeight + 'px';

  setTimeout(() => {
    element.style.transition = 'height 300ms ease-out';
    element.style.height = targetHeight + 'px';
  }, 10);

  setTimeout(() => {
    element.style.height = '';
    element.style.transition = '';
  }, 310);
}

// Page transition effect
function pageTransition(callback) {
  document.body.classList.add('page-exit');

  setTimeout(() => {
    if (callback) callback();
    document.body.classList.remove('page-exit');
    document.body.classList.add('page-enter');

    setTimeout(() => {
      document.body.classList.remove('page-enter');
    }, 400);
  }, 400);
}

// Export animation functions
window.DevDailyAnimations = {
  animateValue,
  animateStatValues,
  animateProgressBar,
  pulseBadge,
  shakeElement,
  slideInElement,
  fadeIn,
  fadeOut,
  bounceTrophy,
  animateRankChange,
  createConfetti,
  setButtonLoading,
  setButtonSuccess,
  showAutoSaveIndicator,
  showSkeleton,
  popPointsBadge,
  createRipple,
  animateHeight,
  pageTransition
};
