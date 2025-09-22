'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  ArrowRight,
  Fingerprint,
  Lock,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import {
  LoginCredentials,
  LoginFormProps,
  AuthError,
  AuthErrorCode,
  SocialLoginResponse,
  BiometricCapability
} from '@/types/auth';
import PhoneInput from './PhoneInput';

/**
 * LoginForm Component
 *
 * A comprehensive login form with multiple authentication methods
 * Features:
 * - Phone and email login options
 * - Google and Facebook social authentication
 * - Biometric authentication support
 * - Remember me functionality
 * - Forgot password link
 * - Mobile-optimized interface (44px touch targets)
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Loading states and error handling
 */

// Validation schemas
const phoneLoginSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  rememberMe: z.boolean().optional()
});

const emailLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

interface LoginState {
  isSubmitting: boolean;
  error: string | null;
  loginType: 'phone' | 'email';
  showPassword: boolean;
  biometricCapability: BiometricCapability | null;
  showBiometric: boolean;
}

const INITIAL_STATE: LoginState = {
  isSubmitting: false,
  error: null,
  loginType: 'phone',
  showPassword: false,
  biometricCapability: null,
  showBiometric: false
};

export function LoginForm({
  defaultType = 'phone',
  showSocialLogin = true,
  showRegisterLink = true,
  onSuccess,
  onError,
  className,
  disabled = false,
  loading = false,
  ...props
}: LoginFormProps) {
  const [state, setState] = useState<LoginState>({
    ...INITIAL_STATE,
    loginType: defaultType
  });

  // Phone login form
  const phoneForm = useForm({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phoneNumber: '',
      countryCode: 'ID',
      rememberMe: false
    }
  });

  // Email login form
  const emailForm = useForm({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  // Check biometric capability on mount
  useEffect(() => {
    checkBiometricCapability();
  }, []);

  // Check biometric authentication capability
  const checkBiometricCapability = async () => {
    try {
      // Mock biometric capability check
      const mockCapability: BiometricCapability = {
        isAvailable: true,
        hasEnrolledFingerprints: true,
        hasFaceID: false,
        supportedTypes: ['fingerprint']
      };

      setState(prev => ({
        ...prev,
        biometricCapability: mockCapability,
        showBiometric: mockCapability.isAvailable && (mockCapability.hasEnrolledFingerprints || mockCapability.hasFaceID)
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        biometricCapability: null,
        showBiometric: false
      }));
    }
  };

  // Handle phone login
  const handlePhoneLogin = async (data: any) => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const credentials: LoginCredentials = {
        type: 'phone',
        identifier: data.phoneNumber,
        countryCode: data.countryCode
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock phone login - redirect to OTP verification
      toast({
        title: 'Verification Code Sent',
        description: 'Please check your phone for the verification code.',
        variant: 'default'
      });

      onSuccess?.(credentials as any);

    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Failed to send verification code. Please try again.',
        timestamp: new Date(),
        recoverable: true
      };

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: authError.message
      }));

      onError?.(authError);
    }
  };

  // Handle email login
  const handleEmailLogin = async (data: any) => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const credentials: LoginCredentials = {
        type: 'email',
        identifier: data.email,
        password: data.password
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock email login validation
      if (data.email === 'demo@medcore.com' && data.password === 'password123') {
        setState(prev => ({ ...prev, isSubmitting: false }));

        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
          variant: 'default'
        });

        onSuccess?.(credentials as any);
      } else {
        const authError: AuthError = {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: 'Invalid email or password. Please try again.',
          timestamp: new Date(),
          recoverable: true
        };

        setState(prev => ({
          ...prev,
          isSubmitting: false,
          error: authError.message
        }));

        onError?.(authError);
      }

    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Login failed. Please check your connection and try again.',
        timestamp: new Date(),
        recoverable: true
      };

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: authError.message
      }));

      onError?.(authError);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponse: SocialLoginResponse = {
        provider,
        providerUserId: `${provider}_123456`,
        email: `user@${provider === 'google' ? 'gmail.com' : 'facebook.com'}`,
        name: 'John Doe',
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
        accessToken: `mock_${provider}_token_123456`
      };

      setState(prev => ({ ...prev, isSubmitting: false }));

      toast({
        title: 'Login Successful',
        description: `Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}`,
        variant: 'default'
      });

      onSuccess?.(mockResponse as any);

    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.SOCIAL_AUTH_FAILED,
        message: `${provider === 'google' ? 'Google' : 'Facebook'} login failed. Please try again.`,
        timestamp: new Date(),
        recoverable: true
      };

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: authError.message
      }));

      onError?.(authError);
    }
  };

  // Handle biometric login
  const handleBiometricLogin = async () => {
    if (!state.biometricCapability?.isAvailable) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock biometric success
      setState(prev => ({ ...prev, isSubmitting: false }));

      toast({
        title: 'Biometric Authentication Successful',
        description: 'Welcome back!',
        variant: 'default'
      });

      onSuccess?.({ type: 'biometric' } as any);

    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.BIOMETRIC_FAILED,
        message: 'Biometric authentication failed. Please try again or use another method.',
        timestamp: new Date(),
        recoverable: true
      };

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: authError.message
      }));

      onError?.(authError);
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Sign in to your MedCore account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error message */}
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          )}

          {/* Biometric login */}
          {state.showBiometric && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleBiometricLogin}
                disabled={state.isSubmitting || disabled}
                className="w-full h-12 border-blue-200 hover:bg-blue-50"
              >
                <Fingerprint className="h-5 w-5 mr-2 text-blue-600" />
                <span className="text-blue-600">Use Fingerprint</span>
              </Button>
              <div className="flex items-center gap-4 my-4">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-500">OR</span>
                <Separator className="flex-1" />
              </div>
            </div>
          )}

          {/* Login tabs */}
          <Tabs value={state.loginType} onValueChange={(value) => setState(prev => ({ ...prev, loginType: value as 'phone' | 'email' }))}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
            </TabsList>

            {/* Phone login */}
            <TabsContent value="phone" className="space-y-4 mt-6">
              <form onSubmit={phoneForm.handleSubmit(handlePhoneLogin)} className="space-y-4">
                <PhoneInput
                  defaultCountry={phoneForm.watch('countryCode')}
                  onSuccess={(phoneData) => {
                    phoneForm.setValue('phoneNumber', phoneData.phoneNumber);
                    phoneForm.setValue('countryCode', phoneData.countryCode);
                  }}
                  onValidationChange={(isValid) => {
                    if (!isValid) {
                      phoneForm.setError('phoneNumber', { message: 'Please enter a valid phone number' });
                    } else {
                      phoneForm.clearErrors('phoneNumber');
                    }
                  }}
                />
                {phoneForm.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-600">{phoneForm.formState.errors.phoneNumber.message}</p>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="phone-remember"
                    checked={phoneForm.watch('rememberMe')}
                    onCheckedChange={(checked) => phoneForm.setValue('rememberMe', checked as boolean)}
                  />
                  <Label htmlFor="phone-remember" className="text-sm text-gray-600">
                    Remember this device
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={state.isSubmitting || disabled}
                  className="w-full h-12 text-base font-medium"
                >
                  {state.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Sending Code...</span>
                    </div>
                  ) : (
                    <>
                      Continue with Phone
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Email login */}
            <TabsContent value="email" className="space-y-4 mt-6">
              <form onSubmit={emailForm.handleSubmit(handleEmailLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    {...emailForm.register('email')}
                    className="h-12"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-600">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={state.showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      {...emailForm.register('password')}
                      className="h-12 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      aria-label={state.showPassword ? 'Hide password' : 'Show password'}
                    >
                      {state.showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {emailForm.formState.errors.password && (
                    <p className="text-sm text-red-600">{emailForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-remember"
                      checked={emailForm.watch('rememberMe')}
                      onCheckedChange={(checked) => emailForm.setValue('rememberMe', checked as boolean)}
                    />
                    <Label htmlFor="email-remember" className="text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto"
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={state.isSubmitting || disabled}
                  className="w-full h-12 text-base font-medium"
                >
                  {state.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Demo: use <span className="font-mono bg-gray-100 px-1 rounded">demo@medcore.com</span> / <span className="font-mono bg-gray-100 px-1 rounded">password123</span>
                </p>
              </form>
            </TabsContent>
          </Tabs>

          {/* Social login */}
          {showSocialLogin && (
            <>
              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-500">OR CONTINUE WITH</span>
                <Separator className="flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  disabled={state.isSubmitting || disabled}
                  className="h-12 border-gray-300 hover:bg-gray-50"
                >
                  <div className="w-5 h-5 mr-2">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={state.isSubmitting || disabled}
                  className="h-12 border-gray-300 hover:bg-gray-50"
                >
                  <div className="w-5 h-5 mr-2">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  Facebook
                </Button>
              </div>
            </>
          )}

          {/* Register link */}
          {showRegisterLink && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                >
                  Create Account
                </Button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;