/**
 * Country data for phone number input with country selector
 * Includes popular countries relevant to the Patient Appointment Booking app
 */

import { Country } from '../types/auth';

export const COUNTRIES: Country[] = [
  // Indonesia (primary market)
  {
    code: 'ID',
    name: 'Indonesia',
    dialCode: '+62',
    flag: '🇮🇩',
    phoneLength: 12,
    phoneMask: '+62 xxx-xxx-xxxx'
  },

  // Popular international countries
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    flag: '🇺🇸',
    phoneLength: 10,
    phoneMask: '+1 (xxx) xxx-xxxx'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
    flag: '🇬🇧',
    phoneLength: 10,
    phoneMask: '+44 xxxx xxxxxx'
  },
  {
    code: 'MY',
    name: 'Malaysia',
    dialCode: '+60',
    flag: '🇲🇾',
    phoneLength: 10,
    phoneMask: '+60 xx-xxx xxxx'
  },
  {
    code: 'SG',
    name: 'Singapore',
    dialCode: '+65',
    flag: '🇸🇬',
    phoneLength: 8,
    phoneMask: '+65 xxxx xxxx'
  },
  {
    code: 'TH',
    name: 'Thailand',
    dialCode: '+66',
    flag: '🇹🇭',
    phoneLength: 9,
    phoneMask: '+66 xx xxx xxxx'
  },
  {
    code: 'VN',
    name: 'Vietnam',
    dialCode: '+84',
    flag: '🇻🇳',
    phoneLength: 10,
    phoneMask: '+84 xxx xxx xxx'
  },
  {
    code: 'PH',
    name: 'Philippines',
    dialCode: '+63',
    flag: '🇵🇭',
    phoneLength: 10,
    phoneMask: '+63 xxx xxx xxxx'
  },
  {
    code: 'AU',
    name: 'Australia',
    dialCode: '+61',
    flag: '🇦🇺',
    phoneLength: 9,
    phoneMask: '+61 xxx xxx xxx'
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    flag: '🇨🇦',
    phoneLength: 10,
    phoneMask: '+1 (xxx) xxx-xxxx'
  },
  {
    code: 'JP',
    name: 'Japan',
    dialCode: '+81',
    flag: '🇯🇵',
    phoneLength: 11,
    phoneMask: '+81 xx-xxxx-xxxx'
  },
  {
    code: 'KR',
    name: 'South Korea',
    dialCode: '+82',
    flag: '🇰🇷',
    phoneLength: 11,
    phoneMask: '+82 xx-xxxx-xxxx'
  },
  {
    code: 'CN',
    name: 'China',
    dialCode: '+86',
    flag: '🇨🇳',
    phoneLength: 11,
    phoneMask: '+86 xxx xxxx xxxx'
  },
  {
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    phoneLength: 10,
    phoneMask: '+91 xxxxx xxxxx'
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
    flag: '🇦🇪',
    phoneLength: 9,
    phoneMask: '+971 xx xxx xxxx'
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    dialCode: '+966',
    flag: '🇸🇦',
    phoneLength: 9,
    phoneMask: '+966 xx xxx xxxx'
  },
  {
    code: 'EG',
    name: 'Egypt',
    dialCode: '+20',
    flag: '🇪🇬',
    phoneLength: 10,
    phoneMask: '+20 xxx xxx xxxx'
  },
  {
    code: 'TR',
    name: 'Turkey',
    dialCode: '+90',
    flag: '🇹🇷',
    phoneLength: 10,
    phoneMask: '+90 xxx xxx xxxx'
  },
  {
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    flag: '🇩🇪',
    phoneLength: 11,
    phoneMask: '+49 xxx xxxxxxxx'
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    flag: '🇫🇷',
    phoneLength: 10,
    phoneMask: '+33 x xx xx xx xx'
  },
  {
    code: 'IT',
    name: 'Italy',
    dialCode: '+39',
    flag: '🇮🇹',
    phoneLength: 10,
    phoneMask: '+39 xxx xxx xxxx'
  },
  {
    code: 'ES',
    name: 'Spain',
    dialCode: '+34',
    flag: '🇪🇸',
    phoneLength: 9,
    phoneMask: '+34 xxx xxx xxx'
  },
  {
    code: 'BR',
    name: 'Brazil',
    dialCode: '+55',
    flag: '🇧🇷',
    phoneLength: 11,
    phoneMask: '+55 xx xxxxx-xxxx'
  },
  {
    code: 'MX',
    name: 'Mexico',
    dialCode: '+52',
    flag: '🇲🇽',
    phoneLength: 10,
    phoneMask: '+52 xxx xxx xxxx'
  },
  {
    code: 'RU',
    name: 'Russia',
    dialCode: '+7',
    flag: '🇷🇺',
    phoneLength: 10,
    phoneMask: '+7 xxx xxx-xx-xx'
  }
];

// Default country (Indonesia for Indonesian market)
export const DEFAULT_COUNTRY = COUNTRIES[0];

// Country search and filtering utilities
export const findCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

export const findCountryByDialCode = (dialCode: string): Country | undefined => {
  return COUNTRIES.find(country => country.dialCode === dialCode);
};

export const searchCountries = (query: string): Country[] => {
  if (!query.trim()) return COUNTRIES;

  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(lowerQuery) ||
    country.code.toLowerCase().includes(lowerQuery) ||
    country.dialCode.includes(query)
  );
};

// Phone number validation
export const validatePhoneNumber = (phone: string, country: Country): boolean => {
  if (!phone || !country) return false;

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if the length matches expected length for the country
  if (country.phoneLength && digitsOnly.length !== country.phoneLength) {
    return false;
  }

  // Basic validation - should start with appropriate digits for the country
  switch (country.code) {
    case 'ID':
      // Indonesian mobile numbers start with 8 (after country code)
      return digitsOnly.startsWith('8') && digitsOnly.length >= 10 && digitsOnly.length <= 13;
    case 'US':
    case 'CA':
      // North American numbers should be 10 digits and not start with 0 or 1
      return digitsOnly.length === 10 && !digitsOnly.startsWith('0') && !digitsOnly.startsWith('1');
    case 'GB':
      // UK mobile numbers start with 7
      return digitsOnly.startsWith('7') && digitsOnly.length >= 10 && digitsOnly.length <= 11;
    default:
      // General validation - just check length
      return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }
};

// Format phone number with country-specific formatting
export const formatPhoneNumber = (phone: string, country: Country): string => {
  if (!phone || !country) return phone;

  const digitsOnly = phone.replace(/\D/g, '');
  if (!digitsOnly) return phone;

  // Apply country-specific formatting
  switch (country.code) {
    case 'ID':
      if (digitsOnly.length >= 10) {
        return `${country.dialCode} ${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      }
      break;
    case 'US':
    case 'CA':
      if (digitsOnly.length === 10) {
        return `${country.dialCode} (${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      }
      break;
    case 'GB':
      if (digitsOnly.length >= 10) {
        return `${country.dialCode} ${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4)}`;
      }
      break;
    default:
      // General formatting
      if (digitsOnly.length >= 8) {
        const mid = Math.ceil(digitsOnly.length / 2);
        return `${country.dialCode} ${digitsOnly.slice(0, mid)} ${digitsOnly.slice(mid)}`;
      }
  }

  // Fallback to just adding country code
  return `${country.dialCode} ${digitsOnly}`;
};

// Get full international phone number
export const getInternationalPhoneNumber = (phone: string, country: Country): string => {
  if (!phone || !country) return '';

  const digitsOnly = phone.replace(/\D/g, '');
  return `${country.dialCode}${digitsOnly}`;
};