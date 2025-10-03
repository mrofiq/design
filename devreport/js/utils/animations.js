/**
 * Animation Utilities
 * Provides entrance/exit animations, transitions, and Intersection Observer wrapper
 */

/**
 * Animation Presets
 * Common animation configurations
 */
export const AnimationPresets = {
  // Entrance animations
  fadeIn: {
    keyframes: [
      { opacity: 0 },
      { opacity: 1 }
    ],
    options: {
      duration: 400,
      easing: 'ease-out',
      fill: 'both'
    }
  },

  fadeInUp: {
    keyframes: [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    options: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both'
    }
  },

  fadeInDown: {
    keyframes: [
      { opacity: 0, transform: 'translateY(-20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    options: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both'
    }
  },

  fadeInLeft: {
    keyframes: [
      { opacity: 0, transform: 'translateX(-20px)' },
      { opacity: 1, transform: 'translateX(0)' }
    ],
    options: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both'
    }
  },

  fadeInRight: {
    keyframes: [
      { opacity: 0, transform: 'translateX(20px)' },
      { opacity: 1, transform: 'translateX(0)' }
    ],
    options: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both'
    }
  },

  slideUp: {
    keyframes: [
      { transform: 'translateY(100%)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ],
    options: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both'
    }
  },

  slideDown: {
    keyframes: [
      { transform: 'translateY(-100%)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ],
    options: {
      duration: 500,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both'
    }
  },

  scaleIn: {
    keyframes: [
      { transform: 'scale(0.9)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    options: {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'both'
    }
  },

  zoomIn: {
    keyframes: [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    options: {
      duration: 500,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      fill: 'both'
    }
  },

  // Exit animations
  fadeOut: {
    keyframes: [
      { opacity: 1 },
      { opacity: 0 }
    ],
    options: {
      duration: 300,
      easing: 'ease-in',
      fill: 'both'
    }
  },

  fadeOutUp: {
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-20px)' }
    ],
    options: {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
      fill: 'both'
    }
  },

  fadeOutDown: {
    keyframes: [
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(20px)' }
    ],
    options: {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
      fill: 'both'
    }
  },

  scaleOut: {
    keyframes: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.9)', opacity: 0 }
    ],
    options: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
      fill: 'both'
    }
  },

  zoomOut: {
    keyframes: [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0)', opacity: 0 }
    ],
    options: {
      duration: 400,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      fill: 'both'
    }
  },

  // Special animations
  bounce: {
    keyframes: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0)' },
      { transform: 'translateY(-5px)' },
      { transform: 'translateY(0)' }
    ],
    options: {
      duration: 600,
      easing: 'ease-in-out',
      fill: 'both'
    }
  },

  shake: {
    keyframes: [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(-10px)' },
      { transform: 'translateX(10px)' },
      { transform: 'translateX(0)' }
    ],
    options: {
      duration: 500,
      easing: 'ease-in-out',
      fill: 'both'
    }
  },

  pulse: {
    keyframes: [
      { transform: 'scale(1)' },
      { transform: 'scale(1.05)' },
      { transform: 'scale(1)' }
    ],
    options: {
      duration: 600,
      easing: 'ease-in-out',
      fill: 'both'
    }
  },

  rotate: {
    keyframes: [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(360deg)' }
    ],
    options: {
      duration: 800,
      easing: 'ease-in-out',
      fill: 'both'
    }
  }
};

/**
 * Animate Element
 * Applies animation to an element using Web Animations API
 */
export function animate(element, preset, options = {}) {
  if (typeof preset === 'string') {
    preset = AnimationPresets[preset];
  }

  if (!preset) {
    console.warn('Animation preset not found');
    return null;
  }

  const mergedOptions = {
    ...preset.options,
    ...options
  };

  return element.animate(preset.keyframes, mergedOptions);
}

/**
 * Animate Multiple Elements
 * Animates multiple elements with staggered delay
 */
export function animateStaggered(elements, preset, options = {}) {
  const staggerDelay = options.staggerDelay || 100;
  const animations = [];

  elements.forEach((element, index) => {
    const delay = index * staggerDelay;
    const animation = animate(element, preset, {
      ...options,
      delay
    });
    animations.push(animation);
  });

  return animations;
}

/**
 * Entrance Animation Controller
 * Manages entrance animations for elements
 */
export class EntranceAnimations {
  static fadeIn(element, options = {}) {
    return animate(element, 'fadeIn', options);
  }

  static fadeInUp(element, options = {}) {
    return animate(element, 'fadeInUp', options);
  }

  static fadeInDown(element, options = {}) {
    return animate(element, 'fadeInDown', options);
  }

  static fadeInLeft(element, options = {}) {
    return animate(element, 'fadeInLeft', options);
  }

  static fadeInRight(element, options = {}) {
    return animate(element, 'fadeInRight', options);
  }

  static slideUp(element, options = {}) {
    return animate(element, 'slideUp', options);
  }

  static slideDown(element, options = {}) {
    return animate(element, 'slideDown', options);
  }

  static scaleIn(element, options = {}) {
    return animate(element, 'scaleIn', options);
  }

  static zoomIn(element, options = {}) {
    return animate(element, 'zoomIn', options);
  }
}

/**
 * Exit Animation Controller
 * Manages exit animations for elements
 */
export class ExitAnimations {
  static fadeOut(element, options = {}) {
    return animate(element, 'fadeOut', options);
  }

  static fadeOutUp(element, options = {}) {
    return animate(element, 'fadeOutUp', options);
  }

  static fadeOutDown(element, options = {}) {
    return animate(element, 'fadeOutDown', options);
  }

  static scaleOut(element, options = {}) {
    return animate(element, 'scaleOut', options);
  }

  static zoomOut(element, options = {}) {
    return animate(element, 'zoomOut', options);
  }
}

/**
 * Transition Utilities
 * Helper functions for CSS transitions
 */
export class TransitionUtils {
  static setTransition(element, property, duration, easing = 'ease') {
    element.style.transition = `${property} ${duration}ms ${easing}`;
  }

  static clearTransition(element) {
    element.style.transition = '';
  }

  static onTransitionEnd(element, callback) {
    const handler = (event) => {
      if (event.target === element) {
        callback(event);
        element.removeEventListener('transitionend', handler);
      }
    };

    element.addEventListener('transitionend', handler);
  }
}

/**
 * Intersection Observer Wrapper
 * Simplified interface for scroll-based animations
 */
export class ScrollAnimations {
  constructor(options = {}) {
    this.options = {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px 0px -100px 0px',
      threshold: options.threshold || 0.1,
      animationClass: options.animationClass || 'animate-in',
      once: options.once !== false, // Default to true
    };

    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          root: this.options.root,
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold,
        }
      );
    }
  }

  handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = element.dataset.animation || 'fadeInUp';
        const delay = parseInt(element.dataset.delay || 0);
        const duration = parseInt(element.dataset.duration || 500);

        element.classList.add(this.options.animationClass);

        // Apply animation
        setTimeout(() => {
          animate(element, animation, { duration });
        }, delay);

        // Unobserve if once is true
        if (this.options.once) {
          observer.unobserve(element);
        }
      }
    });
  }

  observe(elements) {
    if (!this.observer) {
      console.warn('IntersectionObserver not supported');
      return;
    }

    if (elements instanceof NodeList || Array.isArray(elements)) {
      elements.forEach(el => this.observer.observe(el));
    } else {
      this.observer.observe(elements);
    }
  }

  unobserve(element) {
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

/**
 * Auto-initialize scroll animations on elements with data-animate attribute
 */
export function initScrollAnimations(selector = '[data-animate]', options = {}) {
  const elements = document.querySelectorAll(selector);
  const scrollAnimations = new ScrollAnimations(options);
  scrollAnimations.observe(elements);
  return scrollAnimations;
}

/**
 * Page Transition Manager
 * Handles smooth page transitions
 */
export class PageTransitions {
  constructor(options = {}) {
    this.options = {
      duration: options.duration || 300,
      enterAnimation: options.enterAnimation || 'fadeIn',
      exitAnimation: options.exitAnimation || 'fadeOut',
    };
  }

  async transitionOut(element) {
    const animation = animate(element, this.options.exitAnimation, {
      duration: this.options.duration
    });

    if (animation) {
      await animation.finished;
    }
  }

  async transitionIn(element) {
    const animation = animate(element, this.options.enterAnimation, {
      duration: this.options.duration
    });

    if (animation) {
      await animation.finished;
    }
  }

  async transition(oldElement, newElement) {
    await this.transitionOut(oldElement);
    oldElement.style.display = 'none';
    newElement.style.display = 'block';
    await this.transitionIn(newElement);
  }
}

/**
 * Loading Animation
 * Creates smooth loading transitions
 */
export class LoadingAnimation {
  static showLoader(container, options = {}) {
    const loader = document.createElement('div');
    loader.className = options.className || 'loader';
    loader.innerHTML = options.html || '<div class="spinner"></div>';

    container.appendChild(loader);
    animate(loader, 'fadeIn', { duration: 200 });

    return loader;
  }

  static async hideLoader(loader, options = {}) {
    const animation = animate(loader, 'fadeOut', { duration: 200 });
    if (animation) {
      await animation.finished;
    }
    loader.remove();
  }
}

/**
 * Micro-interactions
 * Small interactive animations
 */
export class MicroInteractions {
  static ripple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0.3;
      pointer-events: none;
    `;

    ripple.classList.add('ripple');
    element.appendChild(ripple);

    const animation = ripple.animate([
      { transform: 'scale(0)', opacity: 0.3 },
      { transform: 'scale(2)', opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    });

    animation.onfinish = () => ripple.remove();
  }

  static buttonPress(button) {
    const animation = button.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.95)' },
      { transform: 'scale(1)' }
    ], {
      duration: 150,
      easing: 'ease-out'
    });

    return animation;
  }

  static highlight(element) {
    return animate(element, 'pulse', { duration: 500 });
  }

  static shake(element) {
    return animate(element, 'shake', { duration: 500 });
  }
}

/**
 * Parallax Effect
 * Creates parallax scrolling effect
 */
export class ParallaxEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.speed = options.speed || 0.5;
    this.init();
  }

  init() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * this.speed;
    this.element.style.transform = `translateY(${rate}px)`;
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

// Export default collection
export default {
  AnimationPresets,
  animate,
  animateStaggered,
  EntranceAnimations,
  ExitAnimations,
  TransitionUtils,
  ScrollAnimations,
  initScrollAnimations,
  PageTransitions,
  LoadingAnimation,
  MicroInteractions,
  ParallaxEffect,
};
