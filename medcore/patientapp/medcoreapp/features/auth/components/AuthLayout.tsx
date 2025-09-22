'use client';

import React, { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

/**
 * AuthLayout Component
 *
 * A responsive mobile-first layout for authentication pages
 * Features:
 * - Mobile-first responsive design (320px-768px)
 * - Touch-optimized interface (44px minimum touch targets)
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Smooth animations and transitions
 * - Background patterns and branding
 * - Language switcher integration
 * - Dark mode support (future)
 */

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
  showLanguageSwitcher?: boolean;
  showBranding?: boolean;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({
  children,
  className,
  showLanguageSwitcher = true,
  showBranding = true,
  title,
  subtitle,
  ...props
}: AuthLayoutProps) {
  const t = useTranslations('auth.common');

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50',
      'flex flex-col',
      'relative overflow-hidden',
      className
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 sm:p-6">
        {/* Logo/Branding */}
        {showBranding && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="currentColor"
              >
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">MedCore</h1>
              <p className="text-xs text-gray-600">Patient Care Platform</p>
            </div>
          </div>
        )}

        {/* Language Switcher */}
        {showLanguageSwitcher && (
          <LanguageSwitcher />
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        {/* Optional Title/Subtitle */}
        {(title || subtitle) && (
          <div className="text-center mb-6 sm:mb-8 max-w-md">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-600 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content Container */}
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <button className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-gray-900 transition-colors">
              Terms of Service
            </button>
            <button className="hover:text-gray-900 transition-colors">
              Help
            </button>
          </div>
          <p className="text-xs text-gray-500">
            © 2024 MedCore. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}

/**
 * Language Switcher Component
 */
function LanguageSwitcher() {
  // This would integrate with next-intl for language switching
  const [currentLanguage, setCurrentLanguage] = React.useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative">
      <button
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-white/70 backdrop-blur-sm border border-gray-200',
          'hover:bg-white/90 transition-all duration-200',
          'text-sm font-medium text-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
          'min-h-[44px]' // Touch target minimum
        )}
        aria-label="Switch language"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.name}</span>
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Language dropdown would go here */}
    </div>
  );
}

/**
 * Auth Container Component
 *
 * A specialized container for auth forms with consistent styling
 */
interface AuthContainerProps {
  children: ReactNode;
  className?: string;
}

export function AuthContainer({ children, className, ...props }: AuthContainerProps) {
  return (
    <Card className={cn(
      'border-0 shadow-xl',
      'bg-white/95 backdrop-blur-sm',
      'transition-all duration-300',
      'hover:shadow-2xl',
      className
    )}>
      {children}
    </Card>
  );
}

/**
 * Auth Steps Indicator Component
 */
interface AuthStepsProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    title: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export function AuthSteps({ currentStep, totalSteps, steps }: AuthStepsProps) {
  return (
    <div className="mb-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                key={stepNumber}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                  'transition-all duration-200',
                  isActive && 'bg-blue-600 text-white shadow-lg scale-110',
                  isCompleted && 'bg-green-500 text-white',
                  !isActive && !isCompleted && 'bg-gray-200 text-gray-600'
                )}
                aria-label={`Step ${stepNumber}: ${step.title}`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="text-center mt-3">
        <h3 className="text-sm font-medium text-gray-900">
          {steps[currentStep - 1]?.title}
        </h3>
        {steps[currentStep - 1]?.description && (
          <p className="text-xs text-gray-600 mt-1">
            {steps[currentStep - 1].description}
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthLayout;