/**
 * Medical App Constants - Index
 * Exports all application constants for easy importing
 */

export * from './app-colors'
export * from './app-animations'
export * from './app-typography'

// App Configuration Constants
export const APP_CONFIG = {
  name: 'MedCore Patient App',
  version: '1.0.0',
  supportedLocales: ['en', 'id'] as const,
  defaultLocale: 'id' as const,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.medcore.app',
  storageKeys: {
    authToken: 'medcore_auth_token',
    refreshToken: 'medcore_refresh_token',
    userPreferences: 'medcore_user_preferences',
    language: 'medcore_language',
    appointments: 'medcore_appointments',
    favorites: 'medcore_favorite_doctors',
  },
} as const

// API Configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      refresh: '/auth/refresh',
      logout: '/auth/logout',
      verifyOtp: '/auth/verify-otp',
      resendOtp: '/auth/resend-otp',
    },
    doctors: {
      list: '/doctors',
      search: '/doctors/search',
      profile: '/doctors/:id',
      schedule: '/doctors/:id/schedule',
      reviews: '/doctors/:id/reviews',
    },
    appointments: {
      list: '/appointments',
      create: '/appointments',
      get: '/appointments/:id',
      update: '/appointments/:id',
      cancel: '/appointments/:id/cancel',
      reschedule: '/appointments/:id/reschedule',
    },
    payments: {
      methods: '/payments/methods',
      process: '/payments/process',
      status: '/payments/:id/status',
      receipt: '/payments/:id/receipt',
    },
    user: {
      profile: '/user/profile',
      preferences: '/user/preferences',
      medicalHistory: '/user/medical-history',
      carePlan: '/user/care-plan',
    },
  },
} as const

// Breakpoints for responsive design
export const BREAKPOINTS = {
  xs: 320,   // Small mobile
  sm: 375,   // Standard mobile
  md: 425,   // Large mobile
  lg: 768,   // Small tablet
  xl: 1024,  // Large tablet
  '2xl': 1440, // Desktop
} as const

// Touch Target Sizes (following iOS and Android guidelines)
export const TOUCH_TARGETS = {
  minimum: 44,    // 44px minimum for accessibility
  comfortable: 48, // 48px for comfortable interaction
  large: 56,      // 56px for primary actions
} as const

// Z-Index Scale
export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  toast: 1080,
  tooltip: 1090,
} as const

// Medical App Specific Constants
export const MEDICAL_CONFIG = {
  // Appointment configuration
  appointment: {
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
    defaultSlotDuration: 30, // minutes
    availableSlotDurations: [15, 30, 45, 60] as const,
    cancellationDeadlineHours: 24,
    rescheduleDeadlineHours: 4,
  },

  // Journey tracking stages
  journeyStages: [
    'appointment_confirmed',
    'check_in_reminder',
    'arrived_at_clinic',
    'with_nurse',
    'waiting_for_doctor',
    'consultation_in_progress',
    'consultation_completed',
    'at_pharmacy',
    'payment_pending',
    'visit_completed',
  ] as const,

  // Payment configuration
  payment: {
    timeout: 600000, // 10 minutes
    methods: ['card', 'qris', 'virtual_account'] as const,
    supportedBanks: ['bca', 'mandiri', 'bni', 'bri', 'cimb'] as const,
  },

  // Search configuration
  search: {
    debounceDelay: 300, // milliseconds
    minSearchLength: 2,
    maxResults: 20,
    defaultFilters: {
      radius: 10, // km
      rating: 4.0,
      availableToday: false,
    },
  },

  // Cache configuration
  cache: {
    doctorList: 300000,      // 5 minutes
    doctorProfile: 600000,   // 10 minutes
    appointments: 60000,     // 1 minute
    userProfile: 1800000,    // 30 minutes
  },
} as const

// Validation Rules
export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    indonesia: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
    minLength: 10,
    maxLength: 15,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  otp: {
    length: 6,
    pattern: /^\d{6}$/,
    expiryMinutes: 5,
  },
} as const

// Feature Flags
export const FEATURE_FLAGS = {
  enableBiometricAuth: true,
  enableVideoConsultation: false,
  enableTelemedicine: false,
  enableHealthRecords: true,
  enablePrescriptionDelivery: false,
  enableInsuranceClaims: true,
  enableRealTimeTracking: true,
  enablePushNotifications: true,
  enableOfflineMode: true,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Connection lost. Please check your internet.',
  authentication: 'Authentication failed. Please try again.',
  authorization: 'You do not have permission to access this resource.',
  validation: 'Please check your input and try again.',
  server: 'Server error. Please try again later.',
  timeout: 'Request timeout. Please try again.',
  notFound: 'The requested resource was not found.',
  conflict: 'A conflict occurred. Please refresh and try again.',
  rateLimit: 'Too many requests. Please wait a moment and try again.',
  unknown: 'An unexpected error occurred. Please try again.',
} as const

export type AppConfig = typeof APP_CONFIG
export type ApiConfig = typeof API_CONFIG
export type MedicalConfig = typeof MEDICAL_CONFIG
export type ValidationRules = typeof VALIDATION_RULES
export type FeatureFlags = typeof FEATURE_FLAGS