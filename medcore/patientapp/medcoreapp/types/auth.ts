/**
 * Authentication module TypeScript interfaces and types
 * Comprehensive type definitions for the Patient Appointment Booking app authentication system
 */

// =================
// Core Auth Types
// =================

export interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  fullName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  profilePicture?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Medical Information (optional)
  bloodGroup?: BloodGroup;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  emergencyContact: EmergencyContact;

  // Authentication providers
  providers: AuthProvider[];

  // App preferences
  language: 'en' | 'id';
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  countryCode: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type AuthProvider = 'phone' | 'google' | 'facebook' | 'email';

// =================
// Authentication Session
// =================

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  isActive: boolean;
  deviceId: string;
  lastActivity: Date;
}

export interface SessionState {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// =================
// Login Types
// =================

export interface LoginCredentials {
  type: 'phone' | 'email';
  identifier: string; // phone number or email
  countryCode?: string; // for phone login
  password?: string; // for email login
}

export interface SocialLoginProvider {
  type: 'google' | 'facebook';
  clientId: string;
  scope: string[];
}

export interface SocialLoginResponse {
  provider: AuthProvider;
  providerUserId: string;
  email?: string;
  name: string;
  profilePicture?: string;
  accessToken: string;
}

// =================
// OTP Types
// =================

export interface OTPRequest {
  phoneNumber: string;
  countryCode: string;
  purpose: 'login' | 'registration' | 'password_reset' | 'phone_verification';
}

export interface OTPVerification {
  phoneNumber: string;
  countryCode: string;
  code: string;
  purpose: 'login' | 'registration' | 'password_reset' | 'phone_verification';
}

export interface OTPSession {
  id: string;
  phoneNumber: string;
  countryCode: string;
  purpose: 'login' | 'registration' | 'password_reset' | 'phone_verification';
  expiresAt: Date;
  attemptsRemaining: number;
  canResendAt: Date;
  isVerified: boolean;
}

// =================
// Registration Types
// =================

export interface RegistrationStep1 {
  fullName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
}

export interface RegistrationStep2 {
  phoneNumber: string;
  countryCode: string;
  email?: string;
}

export interface RegistrationStep3 {
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactCountryCode: string;
}

export interface RegistrationStep4 {
  // Optional medical information
  bloodGroup?: BloodGroup;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
}

export interface RegistrationData extends
  RegistrationStep1,
  RegistrationStep2,
  RegistrationStep3,
  RegistrationStep4 {

  // Additional settings
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  allowMarketingEmails: boolean;
  language: 'en' | 'id';
}

// =================
// Form Validation
// =================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isValid: boolean;
  touchedFields: Set<keyof T>;
}

// =================
// Password Reset
// =================

export interface PasswordResetRequest {
  identifier: string; // email or phone
  type: 'email' | 'phone';
  countryCode?: string; // for phone
}

export interface PasswordResetVerification {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// =================
// Country/Phone Types
// =================

export interface Country {
  code: string; // ISO 3166-1 alpha-2 (e.g., 'ID', 'US')
  name: string;
  dialCode: string; // e.g., '+62', '+1'
  flag: string; // emoji flag
  phoneLength?: number; // expected phone number length
  phoneMask?: string; // formatting mask
}

export interface PhoneNumberData {
  countryCode: string;
  dialCode: string;
  phoneNumber: string;
  formattedNumber: string; // formatted with country code
  isValid: boolean;
}

// =================
// Biometric Types
// =================

export interface BiometricCapability {
  isAvailable: boolean;
  hasEnrolledFingerprints: boolean;
  hasFaceID: boolean;
  supportedTypes: BiometricType[];
}

export type BiometricType = 'fingerprint' | 'face' | 'voice' | 'iris';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: BiometricType;
}

// =================
// Authentication Guards
// =================

export interface AuthGuardConfig {
  requireAuthentication: boolean;
  requireEmailVerification?: boolean;
  requirePhoneVerification?: boolean;
  requireProfileCompletion?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

// =================
// API Response Types
// =================

export interface AuthApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface LoginResponse {
  user: User;
  session: AuthSession;
  isNewUser: boolean;
  requiresProfileCompletion: boolean;
}

export interface RegistrationResponse {
  user: User;
  session: AuthSession;
  verificationRequired: {
    email: boolean;
    phone: boolean;
  };
}

// =================
// Mock Data Types
// =================

export interface MockUser extends User {
  mockPassword?: string; // for testing
  mockOTPCode?: string; // for testing
}

export interface MockAuthConfig {
  enableOTPAutoRead: boolean;
  simulateNetworkDelay: boolean;
  networkDelayMs: number;
  failureRate: number; // 0-1 probability of random failures
  enableBiometric: boolean;
}

// =================
// Error Types
// =================

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_OTP = 'INVALID_OTP',
  OTP_EXPIRED = 'OTP_EXPIRED',
  TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  PHONE_NOT_VERIFIED = 'PHONE_NOT_VERIFIED',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  BIOMETRIC_NOT_AVAILABLE = 'BIOMETRIC_NOT_AVAILABLE',
  BIOMETRIC_FAILED = 'BIOMETRIC_FAILED',
  INVALID_PHONE_NUMBER = 'INVALID_PHONE_NUMBER',
  SOCIAL_AUTH_FAILED = 'SOCIAL_AUTH_FAILED',
  TERMS_NOT_ACCEPTED = 'TERMS_NOT_ACCEPTED'
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: any;
  timestamp: Date;
  recoverable: boolean;
  retryAfter?: number; // seconds
}

// =================
// Navigation Types
// =================

export interface AuthNavigationProps {
  from?: string; // return URL after successful auth
  step?: number; // for multi-step flows
  data?: any; // passing data between steps
}

// =================
// Component Props
// =================

export interface BaseAuthComponentProps {
  onSuccess?: (user: User) => void;
  onError?: (error: AuthError) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface LoginFormProps extends BaseAuthComponentProps {
  defaultType?: 'phone' | 'email';
  showSocialLogin?: boolean;
  showRegisterLink?: boolean;
}

export interface OTPInputProps extends BaseAuthComponentProps {
  length?: number;
  autoSubmit?: boolean;
  autoFocus?: boolean;
  resendDelay?: number; // seconds
  onResend?: () => Promise<void>;
}

export interface PhoneInputProps extends BaseAuthComponentProps {
  defaultCountry?: string;
  placeholder?: string;
  onCountryChange?: (country: Country) => void;
  onValidationChange?: (isValid: boolean) => void;
}

// =================
// Utility Types
// =================

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;