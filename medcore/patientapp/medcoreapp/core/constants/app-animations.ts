/**
 * Medical App Animation Constants
 * Based on the specification animation system
 */

// Animation Durations
export const ANIMATION_DURATIONS = {
  // Page transitions
  pageSlideAnimation: 300,
  pageFadeAnimation: 250,

  // Micro interactions
  buttonTap: 150,
  cardHover: 200,
  listItemStagger: 50,

  // Loading animations
  shimmerAnimation: 1500,
  pulseAnimation: 2000,

  // Component animations
  slideUp: 300,
  slideDown: 300,
  fadeIn: 250,
  scaleIn: 200,

  // Navigation animations
  pageTransition: 350,
  bottomSheetSlide: 300,
  tabSwitch: 400,

  // Medical specific
  languageToggle: 600,
  journeyProgress: 500,
  appointmentConfirmation: 800,
} as const

// Animation Curves/Easing
export const ANIMATION_CURVES = {
  smoothCurve: 'cubic-bezier(0.4, 0, 0.2, 1)', // easeOutCubic
  bouncyCurve: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // elasticOut
  sharpCurve: 'cubic-bezier(0.19, 1, 0.22, 1)', // easeOutExpo
  medicalCurve: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // easeOutQuad
} as const

// Animation Scale Values
export const ANIMATION_SCALES = {
  buttonTapScale: 0.95,
  cardHoverScale: 1.02,
  iconPulseScale: 1.1,
  successScale: 1.2,
} as const

// Animation Timing Functions
export const ANIMATION_TIMINGS = {
  // Entrance animations
  fadeIn: ANIMATION_DURATIONS.fadeIn,
  slideUp: ANIMATION_DURATIONS.slideUp,
  scaleIn: ANIMATION_DURATIONS.scaleIn,

  // Interactive animations
  buttonTap: ANIMATION_DURATIONS.buttonTap,
  cardHover: ANIMATION_DURATIONS.cardHover,
  toggleSwitch: 300,

  // Navigation animations
  pageTransition: ANIMATION_DURATIONS.pageTransition,
  bottomSheetSlide: ANIMATION_DURATIONS.bottomSheetSlide,
  tabSwitch: ANIMATION_DURATIONS.tabSwitch,

  // Loading animations
  shimmer: ANIMATION_DURATIONS.shimmerAnimation,
  pulse: ANIMATION_DURATIONS.pulseAnimation,
  spin: 1000,
} as const

// Stagger Animation Settings
export const STAGGER_CONFIG = {
  listItems: {
    delay: ANIMATION_DURATIONS.listItemStagger,
    duration: ANIMATION_DURATIONS.fadeIn,
  },
  doctorCards: {
    delay: 100,
    duration: ANIMATION_DURATIONS.slideUp,
  },
  journeySteps: {
    delay: 150,
    duration: ANIMATION_DURATIONS.scaleIn,
  },
} as const

// Framer Motion Variants
export const MOTION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATIONS.fadeIn / 1000 }
  },

  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: {
      duration: ANIMATION_DURATIONS.slideUp / 1000,
      ease: ANIMATION_CURVES.smoothCurve
    }
  },

  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: {
      duration: ANIMATION_DURATIONS.slideDown / 1000,
      ease: ANIMATION_CURVES.smoothCurve
    }
  },

  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: {
      duration: ANIMATION_DURATIONS.scaleIn / 1000,
      ease: ANIMATION_CURVES.bouncyCurve
    }
  },

  slideLeft: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: {
      duration: ANIMATION_DURATIONS.pageTransition / 1000,
      ease: ANIMATION_CURVES.smoothCurve
    }
  },

  bottomSheet: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: {
      duration: ANIMATION_DURATIONS.bottomSheetSlide / 1000,
      ease: ANIMATION_CURVES.sharpCurve
    }
  },

  languageFlip: {
    initial: { rotateY: 0 },
    animate: { rotateY: 180 },
    exit: { rotateY: 360 },
    transition: {
      duration: ANIMATION_DURATIONS.languageToggle / 1000,
      ease: ANIMATION_CURVES.medicalCurve
    }
  },

  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: STAGGER_CONFIG.listItems.delay / 1000,
        delayChildren: 0.1,
      }
    }
  },

  staggerItem: {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: STAGGER_CONFIG.listItems.duration / 1000,
        ease: ANIMATION_CURVES.smoothCurve
      }
    }
  }
} as const

// CSS Animation Classes
export const CSS_ANIMATIONS = {
  shimmer: 'animate-shimmer',
  pulse: 'animate-pulse-medical',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  fadeIn: 'animate-fade-in',
  scaleIn: 'animate-scale-in',
  spin: 'animate-spin',
} as const

// Animation Presets for common UI patterns
export const ANIMATION_PRESETS = {
  // Button interactions
  button: {
    tap: {
      scale: ANIMATION_SCALES.buttonTapScale,
      duration: ANIMATION_DURATIONS.buttonTap,
    },
    hover: {
      scale: 1.05,
      duration: ANIMATION_DURATIONS.cardHover,
    }
  },

  // Card interactions
  card: {
    hover: {
      scale: ANIMATION_SCALES.cardHoverScale,
      y: -2,
      duration: ANIMATION_DURATIONS.cardHover,
    },
    tap: {
      scale: 0.98,
      duration: ANIMATION_DURATIONS.buttonTap,
    }
  },

  // Loading states
  loading: {
    shimmer: {
      duration: ANIMATION_DURATIONS.shimmerAnimation,
      iterations: Infinity,
    },
    pulse: {
      scale: [1, ANIMATION_SCALES.iconPulseScale, 1],
      duration: ANIMATION_DURATIONS.pulseAnimation,
      iterations: Infinity,
    }
  },

  // Success animations
  success: {
    checkmark: {
      scale: [0, ANIMATION_SCALES.successScale, 1],
      duration: ANIMATION_DURATIONS.appointmentConfirmation,
    },
    confirmation: {
      y: [0, -10, 0],
      duration: ANIMATION_DURATIONS.appointmentConfirmation,
    }
  }
} as const

export type AnimationPresets = typeof ANIMATION_PRESETS
export type MotionVariants = typeof MOTION_VARIANTS