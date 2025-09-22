'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Key,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import {
  PasswordResetRequest,
  PasswordResetVerification,
  BaseAuthComponentProps,
  AuthError,
  AuthErrorCode
} from '@/types/auth';
import { authService } from '../services/authService';
import PhoneInput from './PhoneInput';

/**
 * PasswordReset Component
 *
 * A comprehensive password reset flow with multiple recovery methods
 * Features:
 * - Email and phone-based password reset
 * - Multi-step reset process
 * - Token verification
 * - Password strength validation
 * - Mobile-optimized interface
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Progress indicators
 * - Security recommendations
 */

// Validation schemas
const requestSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional(),
  phoneNumber: z.string().min(1, 'Phone number is required').optional(),
  countryCode: z.string().optional()
}).refine(
  (data) => data.email || (data.phoneNumber && data.countryCode),
  { message: 'Please provide either email or phone number' }
);

const resetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: z.string()
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
);

interface PasswordResetProps extends BaseAuthComponentProps {
  onResetComplete?: () => void;
  onBackPress?: () => void;
  initialStep?: 'request' | 'verify' | 'reset';
  initialToken?: string;
}

interface ResetState {
  step: 'request' | 'verify' | 'reset' | 'complete';
  method: 'email' | 'phone';
  isSubmitting: boolean;
  error: string | null;
  requestData: PasswordResetRequest | null;
  resetToken: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
}

const INITIAL_STATE: ResetState = {
  step: 'request',
  method: 'email',
  isSubmitting: false,
  error: null,
  requestData: null,
  resetToken: null,
  showPassword: false,
  showConfirmPassword: false
};

export function PasswordReset({
  onResetComplete,
  onBackPress,
  onSuccess,
  onError,
  className,
  disabled = false,
  loading = false,
  initialStep = 'request',
  initialToken,
  ...props
}: PasswordResetProps) {
  const [state, setState] = useState<ResetState>({
    ...INITIAL_STATE,
    step: initialStep,
    resetToken: initialToken || null
  });

  // Request form
  const requestForm = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      countryCode: 'ID'
    }
  });

  // Reset form
  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: initialToken || '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Calculate progress
  const getProgress = () => {
    switch (state.step) {
      case 'request': return 25;
      case 'verify': return 50;
      case 'reset': return 75;
      case 'complete': return 100;
      default: return 0;
    }
  };

  // Handle reset request
  const handleResetRequest = async (data: any) => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const request: PasswordResetRequest = {
        type: state.method,
        identifier: state.method === 'email' ? data.email : data.phoneNumber,
        countryCode: state.method === 'phone' ? data.countryCode : undefined
      };

      await authService.requestPasswordReset(request);

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        step: 'verify',
        requestData: request
      }));

      toast({
        title: 'Reset Instructions Sent',
        description: `Password reset instructions have been sent to your ${state.method}.`,
        variant: 'default'
      });

    } catch (error) {
      const authError = error as AuthError;
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: authError.message
      }));

      onError?.(authError);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (data: any) => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const verification: PasswordResetVerification = {
        token: data.token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      };

      await authService.verifyPasswordReset(verification);

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        step: 'complete'
      }));

      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been updated successfully.',
        variant: 'default'
      });

    } catch (error) {
      const authError = error as AuthError;
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: authError.message
      }));

      onError?.(authError);
    }
  };

  // Handle method change
  const handleMethodChange = (method: 'email' | 'phone') => {
    setState(prev => ({ ...prev, method }));
    requestForm.reset();
  };

  // Handle back navigation
  const handleBackPress = () => {
    if (state.step === 'request') {
      onBackPress?.();
    } else {
      setState(prev => ({ ...prev, step: 'request' }));
    }
  };

  // Get step configuration
  const getStepConfig = () => {
    switch (state.step) {
      case 'request':
        return {
          title: 'Reset Your Password',
          description: 'Choose how you\'d like to receive reset instructions',
          icon: Key
        };
      case 'verify':
        return {
          title: 'Check Your ' + (state.method === 'email' ? 'Email' : 'Phone'),
          description: 'Follow the instructions to reset your password',
          icon: state.method === 'email' ? Mail : Phone
        };
      case 'reset':
        return {
          title: 'Create New Password',
          description: 'Enter your new secure password',
          icon: Lock
        };
      case 'complete':
        return {
          title: 'Password Reset Complete',
          description: 'Your password has been successfully updated',
          icon: CheckCircle
        };
    }
  };

  const stepConfig = getStepConfig();

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-4">
          {/* Back button */}
          {(state.step === 'request' || onBackPress) && (
            <div className="flex justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackPress}
                disabled={state.isSubmitting || disabled}
                className="p-2 h-10 w-10"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>

          {/* Step header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <stepConfig.icon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {stepConfig.title}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                {stepConfig.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error message */}
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          )}

          {/* Step content */}
          {state.step === 'request' && (
            <div className="space-y-6">
              {/* Method selection */}
              <Tabs value={state.method} onValueChange={(value) => handleMethodChange(value as 'email' | 'phone')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </TabsTrigger>
                </TabsList>

                {/* Email reset */}
                <TabsContent value="email" className="space-y-4 mt-6">
                  <form onSubmit={requestForm.handleSubmit(handleResetRequest)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        {...requestForm.register('email')}
                        className="h-12"
                        disabled={state.isSubmitting || disabled}
                      />
                      {requestForm.formState.errors.email && (
                        <p className="text-sm text-red-600">{requestForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={state.isSubmitting || disabled}
                      className="w-full h-12 text-base font-medium"
                    >
                      {state.isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Sending Instructions...</span>
                        </div>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Reset Email
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Phone reset */}
                <TabsContent value="phone" className="space-y-4 mt-6">
                  <form onSubmit={requestForm.handleSubmit(handleResetRequest)} className="space-y-4">
                    <PhoneInput
                      defaultCountry={requestForm.watch('countryCode')}
                      onSuccess={(phoneData) => {
                        requestForm.setValue('phoneNumber', phoneData.phoneNumber);
                        requestForm.setValue('countryCode', phoneData.countryCode);
                      }}
                      onValidationChange={(isValid) => {
                        if (!isValid) {
                          requestForm.setError('phoneNumber', { message: 'Please enter a valid phone number' });
                        } else {
                          requestForm.clearErrors('phoneNumber');
                        }
                      }}
                    />
                    {requestForm.formState.errors.phoneNumber && (
                      <p className="text-sm text-red-600">{requestForm.formState.errors.phoneNumber.message}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={state.isSubmitting || disabled}
                      className="w-full h-12 text-base font-medium"
                    >
                      {state.isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Sending SMS...</span>
                        </div>
                      ) : (
                        <>
                          <Phone className="h-4 w-4 mr-2" />
                          Send Reset SMS
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {state.step === 'verify' && (
            <div className="space-y-4 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  We've sent password reset instructions to{' '}
                  <span className="font-medium">
                    {state.requestData?.identifier}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {state.method === 'email' ? (
                    'Check your email inbox and click the reset link to continue.'
                  ) : (
                    'Check your SMS messages and follow the instructions to reset your password.'
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  Don't see the message? Check your spam folder or try again.
                </p>
              </div>

              <Button
                onClick={() => setState(prev => ({ ...prev, step: 'reset' }))}
                variant="outline"
                className="w-full"
              >
                I Have the Reset Code
              </Button>

              <Button
                onClick={() => setState(prev => ({ ...prev, step: 'request' }))}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Try Different Method
              </Button>
            </div>
          )}

          {state.step === 'reset' && (
            <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
              {/* Reset token */}
              <div className="space-y-2">
                <Label htmlFor="token">Reset Code</Label>
                <Input
                  id="token"
                  placeholder="Enter the reset code"
                  {...resetForm.register('token')}
                  className="h-12"
                  disabled={state.isSubmitting || disabled}
                />
                {resetForm.formState.errors.token && (
                  <p className="text-sm text-red-600">{resetForm.formState.errors.token.message}</p>
                )}
              </div>

              {/* New password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={state.showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    {...resetForm.register('newPassword')}
                    className="h-12 pr-12"
                    disabled={state.isSubmitting || disabled}
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
                {resetForm.formState.errors.newPassword && (
                  <p className="text-sm text-red-600">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={state.showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    {...resetForm.register('confirmPassword')}
                    className="h-12 pr-12"
                    disabled={state.isSubmitting || disabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    aria-label={state.showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {state.showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Password requirements */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• At least 8 characters</li>
                  <li>• One uppercase letter</li>
                  <li>• One lowercase letter</li>
                  <li>• One number</li>
                  <li>• One special character (@$!%*?&)</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={state.isSubmitting || disabled}
                className="w-full h-12 text-base font-medium"
              >
                {state.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Updating Password...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          )}

          {state.step === 'complete' && (
            <div className="space-y-6 text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Password Updated Successfully
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Your password has been updated. You can now sign in with your new password.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    onResetComplete?.();
                    onSuccess?.();
                  }}
                  className="w-full h-12 text-base font-medium"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Continue to Sign In
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Security Tip:</strong> Keep your password secure and don't share it with anyone.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PasswordReset;