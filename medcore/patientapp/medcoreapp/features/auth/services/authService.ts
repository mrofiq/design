/**
 * Mock Authentication Service
 *
 * A comprehensive mock authentication service for the Patient Appointment Booking app
 * Simulates real authentication scenarios including:
 * - Phone and email authentication
 * - OTP verification
 * - Social login (Google, Facebook)
 * - Biometric authentication
 * - Session management
 * - User registration
 * - Password reset
 */

import {
  User,
  AuthSession,
  LoginCredentials,
  OTPRequest,
  OTPVerification,
  OTPSession,
  RegistrationData,
  SocialLoginResponse,
  BiometricAuthResult,
  AuthError,
  AuthErrorCode,
  MockUser,
  MockAuthConfig,
  LoginResponse,
  RegistrationResponse,
  PasswordResetRequest,
  PasswordResetVerification
} from '@/types/auth';

// Mock configuration
const MOCK_CONFIG: MockAuthConfig = {
  enableOTPAutoRead: true,
  simulateNetworkDelay: true,
  networkDelayMs: 1500,
  failureRate: 0.1, // 10% random failure rate
  enableBiometric: true
};

// Mock users database
const MOCK_USERS: MockUser[] = [
  {
    id: 'user_1',
    email: 'demo@medcore.com',
    phoneNumber: '81234567890',
    countryCode: 'ID',
    fullName: 'John Doe',
    dateOfBirth: new Date('1990-01-15'),
    gender: 'male',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    isEmailVerified: true,
    isPhoneVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Hypertension'],
    currentMedications: ['Lisinopril 10mg'],
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'spouse',
      phoneNumber: '81234567891',
      countryCode: 'ID'
    },
    providers: ['email', 'phone'],
    language: 'en',
    biometricEnabled: true,
    notificationsEnabled: true,
    mockPassword: 'password123',
    mockOTPCode: '123456'
  },
  {
    id: 'user_2',
    phoneNumber: '81234567892',
    countryCode: 'ID',
    fullName: 'Sarah Wilson',
    dateOfBirth: new Date('1985-07-22'),
    gender: 'female',
    isEmailVerified: false,
    isPhoneVerified: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    emergencyContact: {
      name: 'Michael Wilson',
      relationship: 'spouse',
      phoneNumber: '81234567893',
      countryCode: 'ID'
    },
    providers: ['phone'],
    language: 'id',
    biometricEnabled: false,
    notificationsEnabled: true,
    mockOTPCode: '654321'
  }
];

// Active OTP sessions
const OTP_SESSIONS = new Map<string, OTPSession>();

// Active auth sessions
const AUTH_SESSIONS = new Map<string, AuthSession>();

// Utility functions
const delay = (ms: number = MOCK_CONFIG.networkDelayMs) =>
  new Promise(resolve => setTimeout(resolve, ms));

const shouldSimulateFailure = () => Math.random() < MOCK_CONFIG.failureRate;

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateOTPSessionId = () => `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateAccessToken = () => `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

const generateRefreshToken = () => `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

/**
 * Mock Authentication Service Class
 */
export class MockAuthService {
  private static instance: MockAuthService;

  private constructor() {}

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  // Find user by phone number
  private findUserByPhone(phoneNumber: string, countryCode: string): MockUser | undefined {
    return MOCK_USERS.find(
      user => user.phoneNumber === phoneNumber && user.countryCode === countryCode
    );
  }

  // Find user by email
  private findUserByEmail(email: string): MockUser | undefined {
    return MOCK_USERS.find(user => user.email === email);
  }

  // Find user by ID
  private findUserById(id: string): MockUser | undefined {
    return MOCK_USERS.find(user => user.id === id);
  }

  // Create auth session
  private createAuthSession(user: User): AuthSession {
    const sessionId = generateSessionId();
    const session: AuthSession = {
      user,
      accessToken: generateAccessToken(),
      refreshToken: generateRefreshToken(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      isActive: true,
      deviceId: `device_${Math.random().toString(36).substr(2, 9)}`,
      lastActivity: new Date()
    };

    AUTH_SESSIONS.set(sessionId, session);
    return session;
  }

  // Request OTP
  async requestOTP(request: OTPRequest): Promise<OTPSession> {
    if (MOCK_CONFIG.simulateNetworkDelay) {
      await delay();
    }

    if (shouldSimulateFailure()) {
      throw new Error('Network error occurred');
    }

    // Check if user exists for login/password reset
    if (request.purpose === 'login' || request.purpose === 'password_reset') {
      const user = this.findUserByPhone(request.phoneNumber, request.countryCode);
      if (!user) {
        const error: AuthError = {
          code: AuthErrorCode.USER_NOT_FOUND,
          message: 'No account found with this phone number.',
          timestamp: new Date(),
          recoverable: false
        };
        throw error;
      }
    }

    // Create OTP session
    const sessionId = generateOTPSessionId();
    const otpSession: OTPSession = {
      id: sessionId,
      phoneNumber: request.phoneNumber,
      countryCode: request.countryCode,
      purpose: request.purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attemptsRemaining: 3,
      canResendAt: new Date(Date.now() + 30 * 1000), // 30 seconds
      isVerified: false
    };

    OTP_SESSIONS.set(sessionId, otpSession);

    // Simulate SMS sending delay
    await delay(500);

    return otpSession;
  }

  // Verify OTP
  async verifyOTP(verification: OTPVerification): Promise<OTPSession> {
    if (MOCK_CONFIG.simulateNetworkDelay) {
      await delay();
    }

    // Find OTP session
    const otpSession = Array.from(OTP_SESSIONS.values()).find(
      session =>
        session.phoneNumber === verification.phoneNumber &&
        session.countryCode === verification.countryCode &&
        session.purpose === verification.purpose &&
        !session.isVerified
    );

    if (!otpSession) {
      const error: AuthError = {
        code: AuthErrorCode.OTP_EXPIRED,
        message: 'OTP session not found or expired.',
        timestamp: new Date(),
        recoverable: true
      };
      throw error;
    }

    // Check if expired
    if (otpSession.expiresAt < new Date()) {
      const error: AuthError = {
        code: AuthErrorCode.OTP_EXPIRED,
        message: 'OTP has expired. Please request a new code.',
        timestamp: new Date(),
        recoverable: true
      };
      throw error;
    }

    // Check attempts remaining
    if (otpSession.attemptsRemaining <= 0) {
      const error: AuthError = {
        code: AuthErrorCode.TOO_MANY_ATTEMPTS,
        message: 'Too many failed attempts. Please request a new code.',
        timestamp: new Date(),
        recoverable: true,
        retryAfter: 300 // 5 minutes
      };
      throw error;
    }

    // Mock OTP validation (123456 or user-specific code)
    const user = this.findUserByPhone(verification.phoneNumber, verification.countryCode);
    const validCodes = ['123456', '000000', user?.mockOTPCode].filter(Boolean);

    if (!validCodes.includes(verification.code)) {
      otpSession.attemptsRemaining -= 1;
      OTP_SESSIONS.set(otpSession.id, otpSession);

      const error: AuthError = {
        code: AuthErrorCode.INVALID_OTP,
        message: `Invalid verification code. ${otpSession.attemptsRemaining} attempts remaining.`,
        timestamp: new Date(),
        recoverable: true
      };
      throw error;
    }

    // Mark as verified
    otpSession.isVerified = true;
    OTP_SESSIONS.set(otpSession.id, otpSession);

    return otpSession;
  }

  // Login with phone number
  async loginWithPhone(phoneNumber: string, countryCode: string): Promise<LoginResponse> {
    if (MOCK_CONFIG.simulateNetworkDelay) {
      await delay();
    }

    const user = this.findUserByPhone(phoneNumber, countryCode);
    if (!user) {
      const error: AuthError = {
        code: AuthErrorCode.USER_NOT_FOUND,
        message: 'No account found with this phone number.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    const session = this.createAuthSession(user);

    return {
      user,
      session,
      isNewUser: false,
      requiresProfileCompletion: !user.email || !user.emergencyContact
    };
  }

  // Login with email and password
  async loginWithEmail(email: string, password: string): Promise<LoginResponse> {
    if (MOCK_CONFIG.simulateNetworkDelay) {
      await delay();
    }

    const user = this.findUserByEmail(email);
    if (!user) {
      const error: AuthError = {
        code: AuthErrorCode.USER_NOT_FOUND,
        message: 'No account found with this email address.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    if (user.mockPassword !== password) {
      const error: AuthError = {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: 'Invalid email or password.',
        timestamp: new Date(),
        recoverable: true
      };
      throw error;
    }

    const session = this.createAuthSession(user);

    return {
      user,
      session,
      isNewUser: false,
      requiresProfileCompletion: !user.phoneNumber || !user.emergencyContact
    };
  }

  // Social login
  async socialLogin(socialResponse: SocialLoginResponse): Promise<LoginResponse> {
    if (MOCK_CONFIG.simulateNetworkDelay) {
      await delay();
    }

    // Check if user exists by email
    let user = socialResponse.email ? this.findUserByEmail(socialResponse.email) : undefined;

    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      const newUser: MockUser = {
        id: `user_${Date.now()}`,
        email: socialResponse.email,
        fullName: socialResponse.name,
        profilePicture: socialResponse.profilePicture,
        dateOfBirth: new Date('1990-01-01'), // Will need to be updated
        gender: 'other', // Will need to be updated
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        emergencyContact: {
          name: '',
          relationship: '',
          phoneNumber: '',
          countryCode: 'ID'
        },
        providers: [socialResponse.provider],
        language: 'en',
        biometricEnabled: false,
        notificationsEnabled: true
      };

      MOCK_USERS.push(newUser);
      user = newUser;
    } else {
      // Update providers if not already included
      if (!user.providers.includes(socialResponse.provider)) {
        user.providers.push(socialResponse.provider);
      }
    }

    const session = this.createAuthSession(user);

    return {
      user,
      session,
      isNewUser,
      requiresProfileCompletion: isNewUser || !user.phoneNumber || !user.emergencyContact.name
    };
  }

  // Register new user
  async register(registrationData: RegistrationData): Promise<RegistrationResponse> {
    if (MOCK_CONFIG.simulateNetworkDelay) {
      await delay();
    }

    // Check if user already exists
    if (registrationData.email && this.findUserByEmail(registrationData.email)) {
      const error: AuthError = {
        code: AuthErrorCode.USER_ALREADY_EXISTS,
        message: 'An account with this email already exists.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    if (this.findUserByPhone(registrationData.phoneNumber, registrationData.countryCode)) {
      const error: AuthError = {
        code: AuthErrorCode.USER_ALREADY_EXISTS,
        message: 'An account with this phone number already exists.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    // Create new user
    const newUser: MockUser = {
      id: `user_${Date.now()}`,
      email: registrationData.email,
      phoneNumber: registrationData.phoneNumber,
      countryCode: registrationData.countryCode,
      fullName: registrationData.fullName,
      dateOfBirth: registrationData.dateOfBirth,
      gender: registrationData.gender,
      isEmailVerified: !!registrationData.email,
      isPhoneVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      bloodGroup: registrationData.bloodGroup,
      allergies: registrationData.allergies,
      chronicConditions: registrationData.chronicConditions,
      currentMedications: registrationData.currentMedications,
      emergencyContact: registrationData.emergencyContact,
      providers: ['phone'],
      language: registrationData.language,
      biometricEnabled: false,
      notificationsEnabled: true,
      mockOTPCode: '123456'
    };

    MOCK_USERS.push(newUser);

    const session = this.createAuthSession(newUser);

    return {
      user: newUser,
      session,
      verificationRequired: {
        email: !!registrationData.email && !newUser.isEmailVerified,
        phone: !newUser.isPhoneVerified
      }
    };
  }

  // Biometric authentication
  async authenticateWithBiometric(): Promise<LoginResponse> {
    if (!MOCK_CONFIG.enableBiometric) {
      const error: AuthError = {
        code: AuthErrorCode.BIOMETRIC_NOT_AVAILABLE,
        message: 'Biometric authentication is not available.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    await delay(1500); // Simulate biometric prompt delay

    // Mock biometric success for demo user
    const user = MOCK_USERS[0]; // First user for demo
    if (!user.biometricEnabled) {
      const error: AuthError = {
        code: AuthErrorCode.BIOMETRIC_FAILED,
        message: 'Biometric authentication failed.',
        timestamp: new Date(),
        recoverable: true
      };
      throw error;
    }

    const session = this.createAuthSession(user);

    return {
      user,
      session,
      isNewUser: false,
      requiresProfileCompletion: false
    };
  }

  // Reset password request
  async requestPasswordReset(request: PasswordResetRequest): Promise<void> {
    if (MOCK_CONFIG.simulateNetworkDelay) {
      await delay();
    }

    let user: MockUser | undefined;

    if (request.type === 'email') {
      user = this.findUserByEmail(request.identifier);
    } else if (request.type === 'phone') {
      user = this.findUserByPhone(request.identifier, request.countryCode!);
    }

    if (!user) {
      // Don't reveal whether user exists for security
      return;
    }

    // Simulate sending reset instructions
    await delay(1000);
  }

  // Verify password reset
  async verifyPasswordReset(verification: PasswordResetVerification): Promise<void> {
    if (MOCK_CONFIG.simulateNetworkDelay) {
      await delay();
    }

    // Mock token validation
    if (verification.token !== 'mock_reset_token_123') {
      const error: AuthError = {
        code: AuthErrorCode.INVALID_TOKEN,
        message: 'Invalid or expired reset token.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    if (verification.newPassword !== verification.confirmPassword) {
      const error: AuthError = {
        code: AuthErrorCode.INVALID_CREDENTIALS,
        message: 'Passwords do not match.',
        timestamp: new Date(),
        recoverable: true
      };
      throw error;
    }

    // Simulate password update
    await delay(500);
  }

  // Validate session
  async validateSession(accessToken: string): Promise<AuthSession | null> {
    const session = Array.from(AUTH_SESSIONS.values()).find(
      s => s.accessToken === accessToken && s.isActive
    );

    if (!session) return null;

    // Check if expired
    if (session.expiresAt < new Date()) {
      session.isActive = false;
      return null;
    }

    // Update last activity
    session.lastActivity = new Date();

    return session;
  }

  // Refresh session
  async refreshSession(refreshToken: string): Promise<AuthSession> {
    const session = Array.from(AUTH_SESSIONS.values()).find(
      s => s.refreshToken === refreshToken && s.isActive
    );

    if (!session) {
      const error: AuthError = {
        code: AuthErrorCode.INVALID_TOKEN,
        message: 'Invalid refresh token.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    // Generate new tokens
    session.accessToken = generateAccessToken();
    session.refreshToken = generateRefreshToken();
    session.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    session.lastActivity = new Date();

    return session;
  }

  // Logout
  async logout(accessToken: string): Promise<void> {
    const session = Array.from(AUTH_SESSIONS.values()).find(
      s => s.accessToken === accessToken
    );

    if (session) {
      session.isActive = false;
    }
  }

  // Get current user
  async getCurrentUser(accessToken: string): Promise<User | null> {
    const session = await this.validateSession(accessToken);
    return session?.user || null;
  }

  // Update user profile
  async updateProfile(accessToken: string, updates: Partial<User>): Promise<User> {
    const session = await this.validateSession(accessToken);
    if (!session) {
      const error: AuthError = {
        code: AuthErrorCode.SESSION_EXPIRED,
        message: 'Session expired. Please login again.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    // Find user in mock database
    const userIndex = MOCK_USERS.findIndex(u => u.id === session.user.id);
    if (userIndex === -1) {
      const error: AuthError = {
        code: AuthErrorCode.USER_NOT_FOUND,
        message: 'User not found.',
        timestamp: new Date(),
        recoverable: false
      };
      throw error;
    }

    // Update user
    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...updates, updatedAt: new Date() };
    session.user = MOCK_USERS[userIndex];

    return MOCK_USERS[userIndex];
  }
}

// Export singleton instance
export const authService = MockAuthService.getInstance();