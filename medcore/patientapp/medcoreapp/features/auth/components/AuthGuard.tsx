'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuthStore, useIsAuthenticated, useAuthLoading, useUser } from '../stores/authStore';
import { AuthGuardConfig } from '@/types/auth';

/**
 * AuthGuard Component
 *
 * A comprehensive authentication guard component that protects routes and components
 * Features:
 * - Route protection based on authentication status
 * - Email/phone verification requirements
 * - Profile completion requirements
 * - Role-based access control
 * - Loading states with progress indicators
 * - Redirect functionality
 * - Graceful error handling
 * - Mobile-optimized interface
 */

interface AuthGuardProps {
  children: ReactNode;
  config?: Partial<AuthGuardConfig>;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
  redirectTo?: string;
  showProgress?: boolean;
  className?: string;
}

const DEFAULT_CONFIG: AuthGuardConfig = {
  requireAuthentication: true,
  requireEmailVerification: false,
  requirePhoneVerification: false,
  requireProfileCompletion: false,
  redirectTo: '/auth/login',
  allowedRoles: undefined
};

export function AuthGuard({
  children,
  config = {},
  fallback,
  loadingComponent,
  redirectTo,
  showProgress = true,
  className,
  ...props
}: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const user = useUser();
  const { validateSession } = useAuthStore();

  const [isValidating, setIsValidating] = useState(true);
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const guardConfig = { ...DEFAULT_CONFIG, ...config };
  const finalRedirectTo = redirectTo || guardConfig.redirectTo;

  // Validate session on mount
  useEffect(() => {
    const performValidation = async () => {
      setIsValidating(true);
      setValidationProgress(0);
      setValidationError(null);

      try {
        // Step 1: Validate session (25%)
        setValidationProgress(25);
        const isValidSession = await validateSession();

        if (!isValidSession && guardConfig.requireAuthentication) {
          setValidationProgress(100);
          setIsValidating(false);
          return;
        }

        // Step 2: Check authentication requirement (50%)
        setValidationProgress(50);
        if (guardConfig.requireAuthentication && !isAuthenticated) {
          setValidationProgress(100);
          setIsValidating(false);
          return;
        }

        // Step 3: Check verification requirements (75%)
        setValidationProgress(75);
        if (user && guardConfig.requireEmailVerification && !user.isEmailVerified) {
          setValidationProgress(100);
          setIsValidating(false);
          return;
        }

        if (user && guardConfig.requirePhoneVerification && !user.isPhoneVerified) {
          setValidationProgress(100);
          setIsValidating(false);
          return;
        }

        // Step 4: Check profile completion (100%)
        setValidationProgress(100);
        if (user && guardConfig.requireProfileCompletion) {
          const isProfileComplete = checkProfileCompletion(user);
          if (!isProfileComplete) {
            setIsValidating(false);
            return;
          }
        }

        // All validations passed
        setIsValidating(false);

      } catch (error) {
        setValidationError('Session validation failed. Please try again.');
        setValidationProgress(100);
        setIsValidating(false);
      }
    };

    performValidation();
  }, [isAuthenticated, user, validateSession, guardConfig]);

  // Check if profile is complete
  const checkProfileCompletion = (user: any): boolean => {
    return !!(
      user.fullName &&
      user.dateOfBirth &&
      user.gender &&
      user.phoneNumber &&
      user.emergencyContact?.name &&
      user.emergencyContact?.phoneNumber
    );
  };

  // Check if user has required roles
  const hasRequiredRole = (user: any, allowedRoles?: string[]): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!user.roles) return false;

    return allowedRoles.some(role => user.roles.includes(role));
  };

  // Handle redirect
  const handleRedirect = (reason: string, redirectPath?: string) => {
    const targetPath = redirectPath || finalRedirectTo;

    if (targetPath) {
      // Add return URL for post-auth redirect
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      const redirectUrl = `${targetPath}?returnUrl=${returnUrl}&reason=${encodeURIComponent(reason)}`;
      router.push(redirectUrl);
    }
  };

  // Retry validation
  const retryValidation = () => {
    setValidationError(null);
    setIsValidating(true);
    validateSession();
  };

  // Render loading state
  const renderLoading = () => {
    if (loadingComponent) {
      return loadingComponent;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Verifying Access
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Please wait while we verify your authentication...
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {showProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Validation Progress</span>
                  <span>{validationProgress}%</span>
                </div>
                <Progress value={validationProgress} className="h-2" />
              </div>
            )}

            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </div>
            </div>

            {validationError && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-600">{validationError}</p>
                  </div>
                </div>

                <Button
                  onClick={retryValidation}
                  variant="outline"
                  className="w-full"
                  disabled={isValidating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render unauthorized state
  const renderUnauthorized = (reason: string, redirectPath?: string) => {
    if (fallback) {
      return fallback;
    }

    const handleLoginRedirect = () => {
      handleRedirect(reason, redirectPath);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Access Required
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {reason}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={handleLoginRedirect}
              className="w-full h-12 text-base font-medium"
            >
              Continue to Sign In
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                You'll be redirected back here after signing in
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Show loading state while validating
  if (isValidating || isLoading) {
    return renderLoading();
  }

  // Check authentication requirement
  if (guardConfig.requireAuthentication && !isAuthenticated) {
    return renderUnauthorized(
      'Please sign in to access this page.',
      '/auth/login'
    );
  }

  // Check if user exists (should exist if authenticated)
  if (guardConfig.requireAuthentication && !user) {
    return renderUnauthorized(
      'User session is invalid. Please sign in again.',
      '/auth/login'
    );
  }

  // Check email verification requirement
  if (user && guardConfig.requireEmailVerification && !user.isEmailVerified) {
    return renderUnauthorized(
      'Please verify your email address to continue.',
      '/auth/verify-email'
    );
  }

  // Check phone verification requirement
  if (user && guardConfig.requirePhoneVerification && !user.isPhoneVerified) {
    return renderUnauthorized(
      'Please verify your phone number to continue.',
      '/auth/verify-phone'
    );
  }

  // Check profile completion requirement
  if (user && guardConfig.requireProfileCompletion && !checkProfileCompletion(user)) {
    return renderUnauthorized(
      'Please complete your profile to continue.',
      '/auth/complete-profile'
    );
  }

  // Check role-based access
  if (user && guardConfig.allowedRoles && !hasRequiredRole(user, guardConfig.allowedRoles)) {
    return renderUnauthorized(
      'You do not have permission to access this page.',
      '/dashboard'
    );
  }

  // All checks passed, render children
  return <>{children}</>;
}

/**
 * ProtectedRoute Component
 *
 * A simplified wrapper for route protection
 */
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
  requireProfileCompletion?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireVerification = false,
  requireProfileCompletion = false,
  allowedRoles,
  redirectTo,
  ...props
}: ProtectedRouteProps) {
  const config: AuthGuardConfig = {
    requireAuthentication: requireAuth,
    requireEmailVerification: requireVerification,
    requirePhoneVerification: requireVerification,
    requireProfileCompletion,
    allowedRoles,
    redirectTo
  };

  return (
    <AuthGuard config={config} {...props}>
      {children}
    </AuthGuard>
  );
}

/**
 * PublicRoute Component
 *
 * Routes that should redirect authenticated users away
 */
interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = '/dashboard' }: PublicRouteProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, don't render children (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  // Not authenticated, render children
  return <>{children}</>;
}

export default AuthGuard;