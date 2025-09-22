'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Country, PhoneNumberData, PhoneInputProps } from '@/types/auth';
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  findCountryByCode,
  searchCountries,
  validatePhoneNumber,
  formatPhoneNumber,
  getInternationalPhoneNumber
} from '@/lib/countries';

/**
 * PhoneInput Component
 *
 * A comprehensive phone number input with country selector
 * Features:
 * - Country flag and dial code selector
 * - Real-time validation
 * - Auto-formatting based on country
 * - Mobile-optimized touch interface
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Support for 25+ countries
 */

interface PhoneInputState {
  selectedCountry: Country;
  phoneNumber: string;
  formattedNumber: string;
  isValid: boolean;
  isFocused: boolean;
  showCountrySelector: boolean;
  searchQuery: string;
}

export function PhoneInput({
  onSuccess,
  onError,
  className,
  disabled = false,
  loading = false,
  defaultCountry = 'ID',
  placeholder,
  onCountryChange,
  onValidationChange,
  ...props
}: PhoneInputProps) {
  const [state, setState] = useState<PhoneInputState>({
    selectedCountry: findCountryByCode(defaultCountry) || DEFAULT_COUNTRY,
    phoneNumber: '',
    formattedNumber: '',
    isValid: false,
    isFocused: false,
    showCountrySelector: false,
    searchQuery: ''
  });

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update validation when phone number or country changes
  useEffect(() => {
    const isValid = validatePhoneNumber(state.phoneNumber, state.selectedCountry);
    const formattedNumber = formatPhoneNumber(state.phoneNumber, state.selectedCountry);

    setState(prev => ({ ...prev, isValid, formattedNumber }));

    // Notify parent components
    onValidationChange?.(isValid);

    if (isValid) {
      const phoneData: PhoneNumberData = {
        countryCode: state.selectedCountry.code,
        dialCode: state.selectedCountry.dialCode,
        phoneNumber: state.phoneNumber,
        formattedNumber: getInternationalPhoneNumber(state.phoneNumber, state.selectedCountry),
        isValid: true
      };

      onSuccess?.(phoneData as any);
    }
  }, [state.phoneNumber, state.selectedCountry, onValidationChange, onSuccess]);

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setState(prev => ({
      ...prev,
      selectedCountry: country,
      showCountrySelector: false,
      searchQuery: '',
      // Re-validate phone number with new country
      isValid: validatePhoneNumber(prev.phoneNumber, country)
    }));

    onCountryChange?.(country);

    // Focus back to phone input
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };

  // Handle phone number input
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits, spaces, dashes, parentheses, and plus signs
    const sanitizedValue = value.replace(/[^\d\s\-\(\)\+]/g, '');

    setState(prev => ({ ...prev, phoneNumber: sanitizedValue }));
  };

  // Handle input focus
  const handleFocus = () => {
    setState(prev => ({ ...prev, isFocused: true }));
  };

  // Handle input blur
  const handleBlur = () => {
    setState(prev => ({ ...prev, isFocused: false }));
  };

  // Filter countries based on search
  const filteredCountries = searchCountries(state.searchQuery);

  // Get placeholder text
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (state.selectedCountry.phoneMask) {
      return state.selectedCountry.phoneMask.replace(/\+\d+\s?/, '').replace(/x/g, '•');
    }
    return 'Enter phone number';
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      <Label htmlFor="phone-input" className="text-sm font-medium text-gray-700">
        Phone Number
      </Label>

      <div className="relative">
        {/* Phone input container */}
        <div
          className={cn(
            'flex rounded-lg border transition-colors duration-200',
            state.isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-300',
            !state.isValid && state.phoneNumber && 'border-red-500 ring-2 ring-red-500/20',
            disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
            'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'
          )}
        >
          {/* Country selector */}
          <Popover
            open={state.showCountrySelector}
            onOpenChange={(open) => setState(prev => ({ ...prev, showCountrySelector: open }))}
          >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={state.showCountrySelector}
                aria-label={`Select country. Currently selected: ${state.selectedCountry.name}`}
                disabled={disabled || loading}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 h-auto min-h-[44px]',
                  'border-0 rounded-l-lg rounded-r-none',
                  'hover:bg-gray-50 focus:bg-gray-50',
                  'border-r border-gray-300'
                )}
              >
                <span className="text-lg" role="img" aria-label={`${state.selectedCountry.name} flag`}>
                  {state.selectedCountry.flag}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {state.selectedCountry.dialCode}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[280px] p-0" align="start">
              <Command>
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput
                    ref={searchInputRef}
                    placeholder="Search countries..."
                    value={state.searchQuery}
                    onValueChange={(value) => setState(prev => ({ ...prev, searchQuery: value }))}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <CommandList>
                  <CommandEmpty>No countries found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px]">
                      {filteredCountries.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={`${country.name} ${country.dialCode} ${country.code}`}
                          onSelect={() => handleCountrySelect(country)}
                          className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-lg" role="img" aria-label={`${country.name} flag`}>
                            {country.flag}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{country.name}</div>
                            <div className="text-xs text-gray-500">{country.dialCode}</div>
                          </div>
                          {state.selectedCountry.code === country.code && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Phone number input */}
          <Input
            ref={phoneInputRef}
            id="phone-input"
            type="tel"
            inputMode="numeric"
            value={state.phoneNumber}
            onChange={handlePhoneNumberChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={getPlaceholder()}
            disabled={disabled || loading}
            className={cn(
              'flex-1 border-0 rounded-l-none rounded-r-lg min-h-[44px]',
              'focus:ring-0 focus:border-0 focus-visible:ring-0',
              'text-base', // Prevent zoom on iOS
              state.phoneNumber && !state.isValid && 'text-red-600'
            )}
            aria-describedby={
              state.phoneNumber && !state.isValid ? 'phone-error' : 'phone-help'
            }
            aria-invalid={state.phoneNumber ? !state.isValid : undefined}
            autoComplete="tel"
            {...props}
          />
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Helper text and validation */}
      <div className="space-y-1">
        {state.phoneNumber && !state.isValid && (
          <p id="phone-error" className="text-sm text-red-600 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
            </span>
            Please enter a valid phone number for {state.selectedCountry.name}
          </p>
        )}

        {state.phoneNumber && state.isValid && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            </span>
            {state.formattedNumber}
          </p>
        )}

        {!state.phoneNumber && (
          <p id="phone-help" className="text-sm text-gray-500">
            Enter your phone number to receive verification code
          </p>
        )}
      </div>
    </div>
  );
}

export default PhoneInput;