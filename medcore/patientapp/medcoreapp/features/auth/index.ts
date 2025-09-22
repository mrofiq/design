/**
 * Authentication Module Export Index
 *
 * Centralized exports for the complete authentication module
 * of the Patient Appointment Booking app
 */

// =================
// Type Definitions
// =================
export type * from '@/types/auth';

// =================
// Components
// =================

// Core authentication components
export { default as LoginForm } from './components/LoginForm';
export { default as RegistrationForm } from './components/RegistrationForm';
export { default as OTPVerification } from './components/OTPVerification';
export { default as PhoneInput } from './components/PhoneInput';
export { default as PasswordReset } from './components/PasswordReset';
export { default as ProfileCompletion } from './components/ProfileCompletion';

// Layout and guard components
export { default as AuthLayout, AuthContainer, AuthSteps } from './components/AuthLayout';
export { default as AuthGuard, ProtectedRoute, PublicRoute } from './components/AuthGuard';

// =================
// Services
// =================
export { authService } from './services/authService';

// =================
// Store & State Management
// =================
export {
  useAuthStore,
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useSession
} from './stores/authStore';

// =================
// Utilities
// =================
export {
  COUNTRIES,
  DEFAULT_COUNTRY,
  findCountryByCode,
  findCountryByDialCode,
  searchCountries,
  validatePhoneNumber,
  formatPhoneNumber,
  getInternationalPhoneNumber
} from '@/lib/countries';

// =================
// Configuration & Constants
// =================

/**
 * Authentication module configuration
 */
export const AUTH_CONFIG = {
  // Session timeout (15 minutes)
  SESSION_TIMEOUT: 15 * 60 * 1000,

  // OTP configuration
  OTP_LENGTH: 6,
  OTP_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  OTP_RESEND_DELAY: 30, // 30 seconds
  OTP_MAX_ATTEMPTS: 3,

  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  },

  // Phone number validation
  PHONE_MIN_LENGTH: 7,
  PHONE_MAX_LENGTH: 15,

  // Biometric settings
  BIOMETRIC_TIMEOUT: 30000, // 30 seconds

  // UI settings
  TOUCH_TARGET_SIZE: 44, // 44px minimum for mobile
  ANIMATION_DURATION: 300, // 300ms

  // Accessibility
  ARIA_LIVE_REGIONS: true,
  HIGH_CONTRAST_SUPPORT: true,
  SCREEN_READER_SUPPORT: true
} as const;

/**
 * Authentication error codes and messages
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  INVALID_OTP: 'INVALID_OTP',
  OTP_EXPIRED: 'OTP_EXPIRED',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  PHONE_NOT_VERIFIED: 'PHONE_NOT_VERIFIED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  BIOMETRIC_NOT_AVAILABLE: 'BIOMETRIC_NOT_AVAILABLE',
  BIOMETRIC_FAILED: 'BIOMETRIC_FAILED',
  INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
  SOCIAL_AUTH_FAILED: 'SOCIAL_AUTH_FAILED',
  TERMS_NOT_ACCEPTED: 'TERMS_NOT_ACCEPTED'
} as const;

/**
 * Authentication routes
 */
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  OTP_VERIFY: '/auth/verify-otp',
  PASSWORD_RESET: '/auth/reset-password',
  COMPLETE_PROFILE: '/auth/complete-profile',
  VERIFY_EMAIL: '/auth/verify-email',
  VERIFY_PHONE: '/auth/verify-phone'
} as const;

/**
 * Social authentication providers
 */
export const SOCIAL_PROVIDERS = {
  GOOGLE: {
    id: 'google',
    name: 'Google',
    color: '#4285F4',
    icon: 'google'
  },
  FACEBOOK: {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    icon: 'facebook'
  }
} as const;

/**
 * Medical data constants
 */
export const MEDICAL_DATA = {
  BLOOD_GROUPS: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const,

  COMMON_ALLERGIES: [
    'Penicillin', 'Aspirin', 'Ibuprofen', 'Codeine', 'Morphine', 'Latex', 'Peanuts',
    'Shellfish', 'Eggs', 'Milk', 'Soy', 'Wheat', 'Tree nuts', 'Fish', 'Dust mites',
    'Pollen', 'Pet dander', 'Mold', 'Insect stings'
  ] as const,

  COMMON_CONDITIONS: [
    'Diabetes', 'Hypertension', 'Heart disease', 'Asthma', 'Arthritis', 'Depression',
    'Anxiety', 'Migraine', 'Epilepsy', 'Thyroid disorder', 'Kidney disease',
    'Liver disease', 'Cancer', 'Osteoporosis', 'COPD'
  ] as const,

  RELATIONSHIPS: [
    'Parent', 'Spouse', 'Sibling', 'Child', 'Relative', 'Friend', 'Partner', 'Guardian', 'Other'
  ] as const
} as const;

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }
] as const;

// =================
// Helper Functions
// =================

/**
 * Get error message for auth error code
 */
export function getAuthErrorMessage(errorCode: string, t?: (key: string) => string): string {
  const defaultMessages: Record<string, string> = {
    [AUTH_ERRORS.INVALID_CREDENTIALS]: 'Invalid credentials. Please try again.',
    [AUTH_ERRORS.USER_NOT_FOUND]: 'User not found.',
    [AUTH_ERRORS.USER_ALREADY_EXISTS]: 'User already exists.',
    [AUTH_ERRORS.INVALID_OTP]: 'Invalid verification code.',
    [AUTH_ERRORS.OTP_EXPIRED]: 'Verification code has expired.',
    [AUTH_ERRORS.TOO_MANY_ATTEMPTS]: 'Too many failed attempts.',
    [AUTH_ERRORS.NETWORK_ERROR]: 'Network error. Please try again.',
    [AUTH_ERRORS.SESSION_EXPIRED]: 'Session has expired. Please sign in again.',
    [AUTH_ERRORS.INVALID_TOKEN]: 'Invalid token.',
    [AUTH_ERRORS.PHONE_NOT_VERIFIED]: 'Phone number not verified.',
    [AUTH_ERRORS.EMAIL_NOT_VERIFIED]: 'Email address not verified.',
    [AUTH_ERRORS.BIOMETRIC_NOT_AVAILABLE]: 'Biometric authentication not available.',
    [AUTH_ERRORS.BIOMETRIC_FAILED]: 'Biometric authentication failed.',
    [AUTH_ERRORS.INVALID_PHONE_NUMBER]: 'Invalid phone number.',
    [AUTH_ERRORS.SOCIAL_AUTH_FAILED]: 'Social authentication failed.',
    [AUTH_ERRORS.TERMS_NOT_ACCEPTED]: 'Terms of service must be accepted.'
  };

  if (t) {
    // Use translation function if provided
    return t(`auth.errors.${errorCode}`) || defaultMessages[errorCode] || 'An error occurred.';
  }

  return defaultMessages[errorCode] || 'An error occurred.';
}

/**
 * Check if device supports biometric authentication
 */
export async function checkBiometricSupport(): Promise<boolean> {
  try {
    // This would use Web Authentication API or platform-specific APIs
    // For demo purposes, we'll simulate support
    return typeof window !== 'undefined' && 'navigator' in window;
  } catch {
    return false;
  }
}

/**
 * Format authentication provider name
 */
export function formatProviderName(provider: string): string {
  const providers: Record<string, string> = {
    google: 'Google',
    facebook: 'Facebook',
    phone: 'Phone',
    email: 'Email',
    biometric: 'Biometric'
  };

  return providers[provider] || provider;
}

/**
 * Get country by user's locale
 */
export function getCountryByLocale(locale: string): string {
  const localeCountryMap: Record<string, string> = {
    'en-US': 'US',
    'en-GB': 'GB',
    'id-ID': 'ID',
    'en': 'US',
    'id': 'ID'
  };

  return localeCountryMap[locale] || 'ID'; // Default to Indonesia
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    score += 1;
  } else {
    feedback.push(`Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters`);
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add an uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add a lowercase letter');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add a number');
  }

  if (/[@$!%*?&]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add a special character (@$!%*?&)');
  }

  return {
    isValid: score >= 5,
    score,
    feedback
  };
}