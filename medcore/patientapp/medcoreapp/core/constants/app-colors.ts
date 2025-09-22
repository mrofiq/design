/**
 * Medical App Color Palette
 * Based on the specification design system
 */

// Primary Colors
export const PRIMARY_COLORS = {
  primary: '#0066FF',      // Bright blue
  primaryLight: '#4D94FF', // Light blue
  primaryDark: '#0052CC',  // Dark blue
} as const

// Secondary Colors
export const SECONDARY_COLORS = {
  secondary: '#00D4AA',    // Mint green
  accent: '#FF6B6B',       // Coral red
} as const

// Neutral Colors
export const NEUTRAL_COLORS = {
  background: '#FAFBFC',   // Off-white
  surface: '#FFFFFF',      // Pure white
  textPrimary: '#1A1A2E',  // Deep navy
  textSecondary: '#6B7280', // Cool gray
  divider: '#E5E7EB',      // Light gray
} as const

// Semantic Colors
export const SEMANTIC_COLORS = {
  success: '#10B981',      // Green
  warning: '#F59E0B',      // Amber
  error: '#EF4444',        // Red
  info: '#3B82F6',         // Blue
} as const

// Complete color palette
export const APP_COLORS = {
  ...PRIMARY_COLORS,
  ...SECONDARY_COLORS,
  ...NEUTRAL_COLORS,
  ...SEMANTIC_COLORS,

  // Medical specific colors
  medical: {
    primary: PRIMARY_COLORS.primary,
    secondary: SECONDARY_COLORS.secondary,
    accent: SECONDARY_COLORS.accent,
    surface: NEUTRAL_COLORS.surface,
    background: NEUTRAL_COLORS.background,
    text: {
      primary: NEUTRAL_COLORS.textPrimary,
      secondary: NEUTRAL_COLORS.textSecondary,
    },
    divider: NEUTRAL_COLORS.divider,
  }
} as const

// Color utilities
export const getAppointmentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'scheduled':
      return SEMANTIC_COLORS.success
    case 'pending':
    case 'waiting':
      return SEMANTIC_COLORS.warning
    case 'cancelled':
    case 'missed':
      return SEMANTIC_COLORS.error
    case 'completed':
      return SEMANTIC_COLORS.info
    case 'in_progress':
    case 'consultation_in_progress':
      return PRIMARY_COLORS.primary
    default:
      return NEUTRAL_COLORS.textSecondary
  }
}

export type AppColors = typeof APP_COLORS