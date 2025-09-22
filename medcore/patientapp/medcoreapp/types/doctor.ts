import { z } from 'zod';

// Base schemas for validation
export const specializationSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameId: z.string(), // Indonesian name
  icon: z.string(),
  category: z.enum(['general', 'specialist', 'emergency', 'pediatric', 'geriatric']),
});

export const languageSchema = z.object({
  code: z.string(),
  name: z.string(),
  nativeName: z.string(),
});

export const insuranceProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string(),
  coverage: z.enum(['basic', 'premium', 'comprehensive']),
});

export const clinicSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  phone: z.string(),
  type: z.enum(['clinic', 'hospital', 'polyclinic', 'health_center']),
  facilities: z.array(z.string()),
  operatingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
});

export const scheduleSlotSchema = z.object({
  date: z.string(),
  time: z.string(),
  available: z.boolean(),
  price: z.number(),
});

export const doctorRatingSchema = z.object({
  overall: z.number().min(1).max(5),
  reviewCount: z.number(),
  breakdown: z.object({
    communication: z.number().min(1).max(5),
    professionalism: z.number().min(1).max(5),
    waitTime: z.number().min(1).max(5),
    explanation: z.number().min(1).max(5),
  }),
});

export const doctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  photo: z.string(),
  title: z.string(), // Dr., Prof. Dr., etc.
  specializations: z.array(specializationSchema),
  licenseNumber: z.string(),
  experienceYears: z.number(),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.number(),
    location: z.string(),
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.number(),
    expiryYear: z.number().optional(),
  })),
  languages: z.array(languageSchema),
  clinics: z.array(clinicSchema),
  consultationFees: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string().default('IDR'),
  }),
  insuranceAccepted: z.array(insuranceProviderSchema),
  rating: doctorRatingSchema,
  availability: z.array(scheduleSlotSchema),
  bio: z.string(),
  bioId: z.string(), // Indonesian bio
  achievements: z.array(z.string()),
  treatmentApproach: z.string(),
  treatmentApproachId: z.string(), // Indonesian treatment approach
  isVerified: z.boolean(),
  isAvailableToday: z.boolean(),
  isNewPatientAccepting: z.boolean(),
  responseTime: z.string(), // "within 1 hour", "same day", etc.
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    viewCount: z.number(),
    bookingCount: z.number(),
  }),
});

// Search and filter schemas
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  locationRadius: z.number().min(1).max(50).optional(), // km
  languages: z.array(z.string()).optional(),
  insuranceProviders: z.array(z.string()).optional(),
  minRating: z.number().min(1).max(5).optional(),
  priceRange: z.object({
    min: z.number(),
    max: z.number(),
  }).optional(),
  availableToday: z.boolean().optional(),
  availableThisWeek: z.boolean().optional(),
  acceptingNewPatients: z.boolean().optional(),
  clinicType: z.array(z.enum(['clinic', 'hospital', 'polyclinic', 'health_center'])).optional(),
  sortBy: z.enum(['relevance', 'rating', 'price_low', 'price_high', 'experience', 'distance']).default('relevance'),
});

export const searchResultsSchema = z.object({
  doctors: z.array(doctorSchema),
  totalCount: z.number(),
  hasMore: z.boolean(),
  filters: z.object({
    specializations: z.array(z.object({
      id: z.string(),
      name: z.string(),
      count: z.number(),
    })),
    locations: z.array(z.object({
      city: z.string(),
      count: z.number(),
    })),
    priceRange: z.object({
      min: z.number(),
      max: z.number(),
    }),
  }),
});

// Search state management
export const searchStateSchema = z.object({
  isLoading: z.boolean(),
  isSearching: z.boolean(),
  query: z.string(),
  filters: searchFiltersSchema,
  results: searchResultsSchema.optional(),
  selectedDoctor: doctorSchema.optional(),
  searchHistory: z.array(z.string()),
  recentSearches: z.array(z.object({
    query: z.string(),
    timestamp: z.string(),
  })),
  popularSearches: z.array(z.object({
    query: z.string(),
    count: z.number(),
  })),
});

// Type exports
export type Specialization = z.infer<typeof specializationSchema>;
export type Language = z.infer<typeof languageSchema>;
export type InsuranceProvider = z.infer<typeof insuranceProviderSchema>;
export type Clinic = z.infer<typeof clinicSchema>;
export type ScheduleSlot = z.infer<typeof scheduleSlotSchema>;
export type DoctorRating = z.infer<typeof doctorRatingSchema>;
export type Doctor = z.infer<typeof doctorSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type SearchResults = z.infer<typeof searchResultsSchema>;
export type SearchState = z.infer<typeof searchStateSchema>;

// Additional utility types
export interface DoctorSearchProps {
  onDoctorSelect: (doctor: Doctor) => void;
  initialFilters?: Partial<SearchFilters>;
  maxResults?: number;
  showMap?: boolean;
}

export interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  onViewProfile: (doctor: Doctor) => void;
  showDistance?: boolean;
  distance?: number;
  compact?: boolean;
}

export interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableFilters: SearchResults['filters'];
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  recentSearches?: string[];
  isLoading?: boolean;
}

// Constants for Indonesian localization
export const INDONESIAN_SPECIALIZATIONS = {
  'general-practitioner': {
    en: 'General Practitioner',
    id: 'Dokter Umum',
  },
  'internal-medicine': {
    en: 'Internal Medicine',
    id: 'Penyakit Dalam',
  },
  'cardiology': {
    en: 'Cardiology',
    id: 'Kardiologi',
  },
  'neurology': {
    en: 'Neurology',
    id: 'Neurologi',
  },
  'orthopedics': {
    en: 'Orthopedics',
    id: 'Ortopedi',
  },
  'pediatrics': {
    en: 'Pediatrics',
    id: 'Anak',
  },
  'obstetrics-gynecology': {
    en: 'Obstetrics & Gynecology',
    id: 'Kandungan',
  },
  'dermatology': {
    en: 'Dermatology',
    id: 'Kulit dan Kelamin',
  },
  'psychiatry': {
    en: 'Psychiatry',
    id: 'Psikiatri',
  },
  'ophthalmology': {
    en: 'Ophthalmology',
    id: 'Mata',
  },
  'ent': {
    en: 'ENT (Ear, Nose, Throat)',
    id: 'THT',
  },
  'urology': {
    en: 'Urology',
    id: 'Urologi',
  },
} as const;

export const INDONESIAN_CITIES = [
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Medan',
  'Bekasi',
  'Tangerang',
  'Depok',
  'Semarang',
  'Palembang',
  'Makassar',
  'Batam',
  'Bogor',
  'Pekanbaru',
  'Bandar Lampung',
  'Malang',
  'Padang',
  'Denpasar',
  'Yogyakarta',
  'Samarinda',
  'Balikpapan',
] as const;

export const INDONESIAN_INSURANCE_PROVIDERS = [
  'BPJS Kesehatan',
  'Prudential',
  'AIA',
  'Allianz',
  'Cigna',
  'Great Eastern',
  'Mandiri Inhealth',
  'BNI Life',
  'Sinarmas',
  'Axa Mandiri',
] as const;