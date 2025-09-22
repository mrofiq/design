'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, MessageSquare, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { OTPInputProps, OTPSession, AuthError, AuthErrorCode } from '@/types/auth';

/**
 * OTPVerification Component
 *
 * A comprehensive OTP verification component with auto-advance functionality
 * Features:
 * - 6-digit OTP input with auto-advance
 * - Resend mechanism with countdown timer
 * - Auto-read capability simulation
 * - Loading states and error handling
 * - Mobile-optimized interface (44px touch targets)
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Smooth animations and micro-interactions
 */

interface OTPVerificationProps extends OTPInputProps {
  phoneNumber: string;
  countryCode: string;
  dialCode: string;
  purpose: 'login' | 'registration' | 'password_reset' | 'phone_verification';
  onBackPress?: () => void;
  onVerificationSuccess?: (session: OTPSession) => void;
  onVerificationError?: (error: AuthError) => void;
}

interface OTPState {
  code: string;
  isSubmitting: boolean;
  error: string | null;
  resendCooldown: number;
  attemptsRemaining: number;
  isAutoReading: boolean;
  showResendButton: boolean;
}

const INITIAL_STATE: OTPState = {
  code: '',
  isSubmitting: false,
  error: null,
  resendCooldown: 0,
  attemptsRemaining: 3,
  isAutoReading: false,
  showResendButton: false
};

export function OTPVerification({
  phoneNumber,
  countryCode,
  dialCode,
  purpose,
  length = 6,
  autoSubmit = true,
  autoFocus = true,
  resendDelay = 30,
  onBackPress,
  onVerificationSuccess,
  onVerificationError,
  onResend,
  onSuccess,
  onError,
  className,
  disabled = false,
  loading = false,
  ...props
}: OTPVerificationProps) {
  const [state, setState] = useState<OTPState>(INITIAL_STATE);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoReadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Formatted phone number for display
  const formattedPhone = `${dialCode} ${phoneNumber}`;

  // Purpose-specific messaging
  const purposeMessages = {
    login: {
      title: 'Verify Your Phone Number',
      description: 'Enter the verification code sent to your phone to sign in',
      successMessage: 'Phone number verified successfully!'
    },
    registration: {
      title: 'Complete Registration',
      description: 'Enter the verification code to complete your account setup',
      successMessage: 'Account created successfully!'
    },
    password_reset: {
      title: 'Reset Your Password',
      description: 'Enter the verification code to reset your password',
      successMessage: 'Verification successful! You can now reset your password.'
    },
    phone_verification: {
      title: 'Verify Phone Number',
      description: 'Enter the verification code to verify your phone number',
      successMessage: 'Phone number verified successfully!'
    }
  };

  const currentMessage = purposeMessages[purpose];

  // Start countdown timer
  const startResendCooldown = useCallback(() => {
    setState(prev => ({ ...prev, resendCooldown: resendDelay, showResendButton: false }));

    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.resendCooldown <= 1) {
          return { ...prev, resendCooldown: 0, showResendButton: true };
        }
        return { ...prev, resendCooldown: prev.resendCooldown - 1 };
      });
    }, 1000);
  }, [resendDelay]);

  // Simulate auto-read OTP functionality
  const simulateAutoRead = useCallback(() => {
    if (!autoSubmit) return;

    setState(prev => ({ ...prev, isAutoReading: true }));

    // Simulate auto-read delay (2-5 seconds)
    autoReadTimeoutRef.current = setTimeout(() => {
      // Mock OTP code - in real app, this would come from SMS auto-read
      const mockOTP = '123456';
      setState(prev => ({
        ...prev,
        code: mockOTP,
        isAutoReading: false
      }));

      // Auto-submit after a brief delay
      setTimeout(() => {
        handleSubmit(mockOTP);
      }, 500);
    }, Math.random() * 3000 + 2000); // 2-5 seconds
  }, [autoSubmit]);

  // Initialize component
  useEffect(() => {
    startResendCooldown();

    // Start auto-read simulation after component mounts
    if (autoSubmit) {
      setTimeout(simulateAutoRead, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (autoReadTimeoutRef.current) clearTimeout(autoReadTimeoutRef.current);
    };
  }, [startResendCooldown, simulateAutoRead, autoSubmit]);

  // Handle OTP code change
  const handleCodeChange = (value: string) => {
    setState(prev => ({
      ...prev,
      code: value,
      error: null,
      isAutoReading: false // Stop auto-read if user starts typing
    }));

    // Cancel auto-read if user starts typing
    if (autoReadTimeoutRef.current) {
      clearTimeout(autoReadTimeoutRef.current);
      autoReadTimeoutRef.current = null;
    }

    // Auto-submit when complete
    if (autoSubmit && value.length === length) {
      setTimeout(() => handleSubmit(value), 500);
    }
  };

  // Handle OTP submission
  const handleSubmit = async (code?: string) => {
    const otpCode = code || state.code;

    if (otpCode.length !== length) {
      setState(prev => ({
        ...prev,
        error: `Please enter all ${length} digits`
      }));
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation - in real app, this would be API validation
      const isValid = otpCode === '123456' || otpCode === '000000'; // Mock valid codes

      if (!isValid) {
        const newAttemptsRemaining = state.attemptsRemaining - 1;

        if (newAttemptsRemaining <= 0) {
          const error: AuthError = {
            code: AuthErrorCode.TOO_MANY_ATTEMPTS,
            message: 'Too many failed attempts. Please request a new code.',
            timestamp: new Date(),
            recoverable: true,
            retryAfter: 300 // 5 minutes
          };

          onVerificationError?.(error);
          onError?.(error);
          setState(prev => ({
            ...prev,
            isSubmitting: false,
            error: error.message,
            attemptsRemaining: 0
          }));
        } else {
          const error: AuthError = {
            code: AuthErrorCode.INVALID_OTP,
            message: `Invalid verification code. ${newAttemptsRemaining} attempts remaining.`,
            timestamp: new Date(),
            recoverable: true
          };

          onVerificationError?.(error);
          onError?.(error);
          setState(prev => ({
            ...prev,
            isSubmitting: false,
            error: error.message,
            code: '', // Clear the code
            attemptsRemaining: newAttemptsRemaining
          }));
        }
        return;
      }

      // Success
      const session: OTPSession = {
        id: `otp_${Date.now()}`,
        phoneNumber,
        countryCode,
        purpose,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        attemptsRemaining: 3,
        canResendAt: new Date(),
        isVerified: true
      };

      setState(prev => ({ ...prev, isSubmitting: false }));

      toast({
        title: 'Success',
        description: currentMessage.successMessage,
        variant: 'default'
      });

      onVerificationSuccess?.(session);
      onSuccess?.(session as any);

    } catch (error) {
      const authError: AuthError = {
        code: AuthErrorCode.NETWORK_ERROR,
        message: 'Network error. Please check your connection and try again.',
        timestamp: new Date(),
        recoverable: true
      };

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: authError.message
      }));

      onVerificationError?.(authError);
      onError?.(authError);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (!state.showResendButton) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Call custom resend handler or simulate API call
      if (onResend) {
        await onResend();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setState(prev => ({
        ...prev,
        isSubmitting: false,
        attemptsRemaining: 3,
        code: ''
      }));

      startResendCooldown();

      // Restart auto-read simulation
      if (autoSubmit) {
        setTimeout(simulateAutoRead, 1000);
      }

      toast({
        title: 'Code Sent',
        description: 'A new verification code has been sent to your phone.',
        variant: 'default'
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Failed to resend code. Please try again.'
      }));
    }
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Back button */}
          {onBackPress && (
            <div className="flex justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackPress}
                disabled={state.isSubmitting}
                className="p-2 h-10 w-10"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Header */}
          <div className="space-y-2">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {currentMessage.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentMessage.description}
            </CardDescription>
          </div>

          {/* Phone number display */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg py-3 px-4">
            <Smartphone className="h-4 w-4" />
            <span>Code sent to {formattedPhone}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Auto-read indicator */}
          {state.isAutoReading && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg py-2 px-4">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                <span>Auto-reading SMS...</span>
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="space-y-4">
            <Label htmlFor="otp-input" className="sr-only">
              Enter {length}-digit verification code
            </Label>

            <div className="flex justify-center">
              <InputOTP
                id="otp-input"
                maxLength={length}
                value={state.code}
                onChange={handleCodeChange}
                disabled={disabled || state.isSubmitting || state.attemptsRemaining <= 0}
                autoFocus={autoFocus}
                className="gap-2"
                {...props}
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length }, (_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className={cn(
                        'w-12 h-14 text-lg font-semibold',
                        'border-2 rounded-lg transition-all duration-200',
                        'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                        state.error && 'border-red-500 bg-red-50',
                        state.code[i] && !state.error && 'border-green-500 bg-green-50',
                        disabled && 'bg-gray-50 cursor-not-allowed opacity-60'
                      )}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error message */}
            {state.error && (
              <div className="text-center">
                <p className="text-sm text-red-600 bg-red-50 rounded-lg py-2 px-4">
                  {state.error}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            {/* Submit button */}
            {!autoSubmit && (
              <Button
                onClick={() => handleSubmit()}
                disabled={state.code.length !== length || state.isSubmitting || disabled}
                className="w-full h-12 text-base font-medium"
              >
                {state.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Code'
                )}
              </Button>
            )}

            {/* Resend button */}
            <div className="text-center">
              {state.showResendButton ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={state.isSubmitting}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-auto py-2"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Resend Code
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend code in {state.resendCooldown}s
                </p>
              )}
            </div>

            {/* Help text */}
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500">
                Didn't receive the code? Check your message inbox or try resending.
              </p>

              {state.attemptsRemaining > 0 && state.attemptsRemaining < 3 && (
                <p className="text-xs text-orange-600">
                  {state.attemptsRemaining} verification attempts remaining
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OTPVerification;