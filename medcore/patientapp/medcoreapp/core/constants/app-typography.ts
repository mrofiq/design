/**
 * Medical App Typography System
 * Based on the specification typography requirements
 */

// Font Family Configuration
export const FONT_FAMILIES = {
  primary: 'Inter, system-ui, sans-serif',
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: 'JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const

// Font Weights
export const FONT_WEIGHTS = {
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
} as const

// Font Sizes (in pixels, converted to rem in CSS)
export const FONT_SIZES = {
  xs: 12,    // 0.75rem
  sm: 14,    // 0.875rem
  base: 16,  // 1rem
  lg: 18,    // 1.125rem
  xl: 20,    // 1.25rem
  '2xl': 24, // 1.5rem
  '3xl': 28, // 1.75rem
  '4xl': 32, // 2rem
  '5xl': 36, // 2.25rem
  '6xl': 48, // 3rem
} as const

// Line Heights
export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.2,
  snug: 1.3,
  normal: 1.4,
  relaxed: 1.5,
  loose: 1.6,
} as const

// Letter Spacing
export const LETTER_SPACING = {
  tighter: '-0.5px',
  tight: '-0.3px',
  normal: '0px',
  wide: '0.15px',
  wider: '0.25px',
  widest: '0.4px',
  button: '0.75px',
} as const

// Typography Scale based on specification
export const TYPOGRAPHY_SCALE = {
  // Heading Styles
  h1: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.extraLight,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tighter,
    fontFamily: FONT_FAMILIES.primary,
  },

  h2: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.light,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACING.tight,
    fontFamily: FONT_FAMILIES.primary,
  },

  h3: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
    fontFamily: FONT_FAMILIES.primary,
  },

  h4: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
    fontFamily: FONT_FAMILIES.primary,
  },

  // Body Styles
  bodyLarge: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.light,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.wide,
    fontFamily: FONT_FAMILIES.primary,
  },

  bodyMedium: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.wider,
    fontFamily: FONT_FAMILIES.primary,
  },

  bodySmall: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wider,
    fontFamily: FONT_FAMILIES.primary,
  },

  // Caption & Labels
  caption: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.widest,
    fontFamily: FONT_FAMILIES.primary,
  },

  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wider,
    fontFamily: FONT_FAMILIES.primary,
  },

  // Interactive Elements
  button: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACING.button,
    fontFamily: FONT_FAMILIES.primary,
  },

  buttonLarge: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACING.button,
    fontFamily: FONT_FAMILIES.primary,
  },

  link: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
    fontFamily: FONT_FAMILIES.primary,
  },

  // Medical App Specific
  medicalId: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.mono,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wide,
    fontFamily: FONT_FAMILIES.mono,
  },

  appointmentTime: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
    fontFamily: FONT_FAMILIES.primary,
  },

  doctorName: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semiBold,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACING.normal,
    fontFamily: FONT_FAMILIES.primary,
  },

  specialization: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.wide,
    fontFamily: FONT_FAMILIES.primary,
  },

  price: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
    fontFamily: FONT_FAMILIES.primary,
  },
} as const

// Responsive Typography Scale
export const RESPONSIVE_TYPOGRAPHY = {
  // Mobile-first approach
  mobile: {
    h1: { ...TYPOGRAPHY_SCALE.h1, fontSize: FONT_SIZES['3xl'] },
    h2: { ...TYPOGRAPHY_SCALE.h2, fontSize: FONT_SIZES.xl },
    h3: { ...TYPOGRAPHY_SCALE.h3, fontSize: FONT_SIZES.lg },
    h4: { ...TYPOGRAPHY_SCALE.h4, fontSize: FONT_SIZES.base },
  },

  tablet: {
    h1: { ...TYPOGRAPHY_SCALE.h1, fontSize: FONT_SIZES['4xl'] },
    h2: { ...TYPOGRAPHY_SCALE.h2, fontSize: FONT_SIZES['2xl'] },
    h3: { ...TYPOGRAPHY_SCALE.h3, fontSize: FONT_SIZES.xl },
    h4: { ...TYPOGRAPHY_SCALE.h4, fontSize: FONT_SIZES.lg },
  },

  desktop: {
    h1: { ...TYPOGRAPHY_SCALE.h1, fontSize: FONT_SIZES['5xl'] },
    h2: { ...TYPOGRAPHY_SCALE.h2, fontSize: FONT_SIZES['3xl'] },
    h3: { ...TYPOGRAPHY_SCALE.h3, fontSize: FONT_SIZES['2xl'] },
    h4: { ...TYPOGRAPHY_SCALE.h4, fontSize: FONT_SIZES.xl },
  },
} as const

// Text Style Utilities
export const TEXT_STYLES = {
  // Utility classes for common text styling
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  multilineTruncate: (lines: number) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),

  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: LETTER_SPACING.widest,
  },

  lowercase: {
    textTransform: 'lowercase',
  },

  capitalize: {
    textTransform: 'capitalize',
  },

  noSelect: {
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },

  selectAll: {
    userSelect: 'all',
    WebkitUserSelect: 'all',
  },
} as const

// Medical App Text Hierarchy
export const MEDICAL_TEXT_HIERARCHY = {
  // Primary information hierarchy
  primary: {
    title: TYPOGRAPHY_SCALE.h2,
    subtitle: TYPOGRAPHY_SCALE.h3,
    body: TYPOGRAPHY_SCALE.bodyLarge,
    caption: TYPOGRAPHY_SCALE.caption,
  },

  // Secondary information hierarchy
  secondary: {
    title: TYPOGRAPHY_SCALE.h3,
    subtitle: TYPOGRAPHY_SCALE.h4,
    body: TYPOGRAPHY_SCALE.bodyMedium,
    caption: TYPOGRAPHY_SCALE.bodySmall,
  },

  // Card information hierarchy
  card: {
    title: TYPOGRAPHY_SCALE.doctorName,
    subtitle: TYPOGRAPHY_SCALE.specialization,
    body: TYPOGRAPHY_SCALE.bodyMedium,
    caption: TYPOGRAPHY_SCALE.caption,
  },

  // Form information hierarchy
  form: {
    title: TYPOGRAPHY_SCALE.h3,
    label: TYPOGRAPHY_SCALE.label,
    input: TYPOGRAPHY_SCALE.bodyMedium,
    help: TYPOGRAPHY_SCALE.caption,
    error: TYPOGRAPHY_SCALE.bodySmall,
  },
} as const

export type TypographyScale = typeof TYPOGRAPHY_SCALE
export type TextStyles = typeof TEXT_STYLES
export type MedicalTextHierarchy = typeof MEDICAL_TEXT_HIERARCHY