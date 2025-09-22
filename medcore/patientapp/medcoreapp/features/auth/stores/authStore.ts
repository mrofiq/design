/**
 * Authentication Store
 *
 * Zustand store for managing authentication state and session management
 * Features:
 * - Session persistence with automatic refresh
 * - User state management
 * - Authentication actions
 * - Loading states
 * - Error handling
 * - Biometric authentication support
 * - Remember me functionality
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  User,
  AuthSession,
  SessionState,
  LoginCredentials,
  RegistrationData,
  SocialLoginResponse,
  AuthError,
  AuthErrorCode,
  LoginResponse,
  RegistrationResponse
} from '@/types/auth';
import { authService } from '../services/authService';

interface AuthStore extends SessionState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  loginWithPhone: (phoneNumber: string, countryCode: string) => Promise<LoginResponse>;
  loginWithEmail: (email: string, password: string) => Promise<LoginResponse>;
  socialLogin: (socialResponse: SocialLoginResponse) => Promise<LoginResponse>;
  biometricLogin: () => Promise<LoginResponse>;
  register: (data: RegistrationData) => Promise<RegistrationResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  clearError: () => void;

  // Session management
  validateSession: () => Promise<boolean>;
  setRememberMe: (remember: boolean) => void;
  isRememberMe: boolean;

  // Reset state
  reset: () => void;
}

const INITIAL_STATE: SessionState = {
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      isRememberMe: false,

      // Login with credentials
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          let response: LoginResponse;

          if (credentials.type === 'phone') {
            response = await authService.loginWithPhone(
              credentials.identifier,
              credentials.countryCode!
            );
          } else {
            response = await authService.loginWithEmail(
              credentials.identifier,
              credentials.password!
            );
          }

          set({
            session: response.session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Start session refresh timer
          scheduleSessionRefresh(response.session);

          return response;
        } catch (error) {
          const authError = error as AuthError;
          set({
            isLoading: false,
            isAuthenticated: false,
            error: authError.message
          });
          throw authError;
        }
      },

      // Phone login
      loginWithPhone: async (phoneNumber: string, countryCode: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.loginWithPhone(phoneNumber, countryCode);

          set({
            session: response.session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          scheduleSessionRefresh(response.session);
          return response;
        } catch (error) {
          const authError = error as AuthError;
          set({
            isLoading: false,
            isAuthenticated: false,
            error: authError.message
          });
          throw authError;
        }
      },

      // Email login
      loginWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.loginWithEmail(email, password);

          set({
            session: response.session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          scheduleSessionRefresh(response.session);
          return response;
        } catch (error) {
          const authError = error as AuthError;
          set({
            isLoading: false,
            isAuthenticated: false,
            error: authError.message
          });
          throw authError;
        }
      },

      // Social login
      socialLogin: async (socialResponse: SocialLoginResponse) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.socialLogin(socialResponse);

          set({
            session: response.session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          scheduleSessionRefresh(response.session);
          return response;
        } catch (error) {
          const authError = error as AuthError;
          set({
            isLoading: false,
            isAuthenticated: false,
            error: authError.message
          });
          throw authError;
        }
      },

      // Biometric login
      biometricLogin: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.authenticateWithBiometric();

          set({
            session: response.session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          scheduleSessionRefresh(response.session);
          return response;
        } catch (error) {
          const authError = error as AuthError;
          set({
            isLoading: false,
            isAuthenticated: false,
            error: authError.message
          });
          throw authError;
        }
      },

      // Register
      register: async (data: RegistrationData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(data);

          set({
            session: response.session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          scheduleSessionRefresh(response.session);
          return response;
        } catch (error) {
          const authError = error as AuthError;
          set({
            isLoading: false,
            isAuthenticated: false,
            error: authError.message
          });
          throw authError;
        }
      },

      // Logout
      logout: async () => {
        const { session } = get();
        set({ isLoading: true });

        try {
          if (session?.accessToken) {
            await authService.logout(session.accessToken);
          }

          set({
            ...INITIAL_STATE,
            isRememberMe: false
          });

          // Clear session refresh timer
          clearSessionRefreshTimer();

        } catch (error) {
          // Even if logout fails, clear local state
          set({
            ...INITIAL_STATE,
            isRememberMe: false,
            error: 'Logout failed, but you have been signed out locally.'
          });
        }
      },

      // Refresh session
      refreshSession: async () => {
        const { session } = get();
        if (!session?.refreshToken) return;

        try {
          const newSession = await authService.refreshSession(session.refreshToken);

          set({
            session: newSession,
            isAuthenticated: true,
            error: null
          });

          scheduleSessionRefresh(newSession);
        } catch (error) {
          // Session refresh failed, logout user
          const authError: AuthError = {
            code: AuthErrorCode.SESSION_EXPIRED,
            message: 'Your session has expired. Please sign in again.',
            timestamp: new Date(),
            recoverable: false
          };

          set({
            ...INITIAL_STATE,
            error: authError.message
          });

          clearSessionRefreshTimer();
        }
      },

      // Update profile
      updateProfile: async (updates: Partial<User>) => {
        const { session } = get();
        if (!session?.accessToken) {
          throw new Error('No active session');
        }

        set({ isLoading: true, error: null });

        try {
          const updatedUser = await authService.updateProfile(session.accessToken, updates);

          set({
            session: {
              ...session,
              user: updatedUser
            },
            isLoading: false,
            error: null
          });

          return updatedUser;
        } catch (error) {
          const authError = error as AuthError;
          set({
            isLoading: false,
            error: authError.message
          });
          throw authError;
        }
      },

      // Validate session
      validateSession: async () => {
        const { session } = get();
        if (!session?.accessToken) {
          return false;
        }

        try {
          const validSession = await authService.validateSession(session.accessToken);

          if (!validSession) {
            set({
              ...INITIAL_STATE,
              error: 'Session expired. Please sign in again.'
            });
            return false;
          }

          // Update session if different
          if (validSession.lastActivity !== session.lastActivity) {
            set({
              session: validSession,
              isAuthenticated: true
            });
          }

          return true;
        } catch (error) {
          set({
            ...INITIAL_STATE,
            error: 'Session validation failed.'
          });
          return false;
        }
      },

      // Set remember me
      setRememberMe: (remember: boolean) => {
        set({ isRememberMe: remember });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset store
      reset: () => {
        set({
          ...INITIAL_STATE,
          isRememberMe: false
        });
        clearSessionRefreshTimer();
      }
    }),
    {
      name: 'medcore-auth-storage',
      storage: createJSONStorage(() => localStorage),

      // Only persist certain fields
      partialize: (state) => ({
        session: state.isRememberMe ? state.session : null,
        isRememberMe: state.isRememberMe,
        isAuthenticated: state.isRememberMe ? state.isAuthenticated : false
      }),

      // Hydration
      onRehydrateStorage: () => (state) => {
        if (state?.session && state.isRememberMe) {
          // Validate session on rehydration
          state.validateSession();

          // Restart session refresh timer
          if (state.session) {
            scheduleSessionRefresh(state.session);
          }
        }
      }
    }
  )
);

// Session refresh timer management
let refreshTimer: NodeJS.Timeout | null = null;

const scheduleSessionRefresh = (session: AuthSession) => {
  clearSessionRefreshTimer();

  // Calculate refresh time (5 minutes before expiry)
  const refreshTime = session.expiresAt.getTime() - Date.now() - (5 * 60 * 1000);

  if (refreshTime > 0) {
    refreshTimer = setTimeout(() => {
      useAuthStore.getState().refreshSession();
    }, refreshTime);
  }
};

const clearSessionRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

// Selectors for easy access
export const useUser = () => useAuthStore(state => state.session?.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);
export const useSession = () => useAuthStore(state => state.session);