/**
 * Medical App Types
 * Core type definitions for the patient appointment booking system
 */

// Base types
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// User and Authentication types
export interface User extends BaseEntity {
  email: string
  fullName: string
  phoneNumber: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  emergencyContact?: {
    name: string
    phoneNumber: string
    relationship: string
  }
  medicalId?: string
  profilePicture?: string
  preferences: UserPreferences
  medicalInfo?: MedicalInfo
}

export interface UserPreferences {
  language: 'en' | 'id'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    appointmentReminders: boolean
    journeyUpdates: boolean
    promotions: boolean
  }
  privacy: {
    shareDataForResearch: boolean
    shareDataWithProviders: boolean
  }
}

export interface MedicalInfo {
  bloodGroup?: string
  allergies: string[]
  chronicConditions: string[]
  currentMedications: string[]
  insuranceProvider?: string
  insuranceNumber?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Doctor and medical provider types
export interface Doctor extends BaseEntity {
  name: string
  nameLocalized: Record<string, string>
  specialization: string
  specializationLocalized: Record<string, string>
  subSpecialties: string[]
  experience: number // years
  languages: string[]
  rating: number
  reviewCount: number
  consultationFee: number
  imageUrl: string
  about?: string
  education: Education[]
  certifications: Certification[]
  clinics: Clinic[]
  availability: AvailabilitySchedule
}

export interface Education {
  degree: string
  institution: string
  year: number
  country: string
}

export interface Certification {
  name: string
  issuer: string
  year: number
  expiryYear?: number
}

export interface Clinic extends BaseEntity {
  name: string
  address: string
  city: string
  coordinates: {
    latitude: number
    longitude: number
  }
  phoneNumber: string
  email?: string
  facilities: string[]
  operatingHours: OperatingHours
  insuranceProviders: string[]
}

export interface OperatingHours {
  [key: string]: {
    open: string
    close: string
    breaks?: Array<{
      start: string
      end: string
    }>
  }
}

// Appointment and scheduling types
export interface Appointment extends BaseEntity {
  patientId: string
  doctorId: string
  clinicId: string
  scheduledDateTime: Date
  duration: number // minutes
  status: AppointmentStatus
  type: AppointmentType
  reasonForVisit: string
  symptoms?: string[]
  specialRequirements?: string
  notes?: string
  prescription?: Prescription[]
  diagnosis?: string
  followUpRequired?: boolean
  followUpDate?: Date
  billing: BillingDetails
  journey: PatientJourney
}

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled'

export type AppointmentType =
  | 'consultation'
  | 'follow_up'
  | 'checkup'
  | 'vaccination'
  | 'procedure'
  | 'emergency'

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  duration: number
  available: boolean
  type: 'consultation' | 'procedure' | 'emergency'
  doctorId: string
  clinicId: string
  date: Date
}

export interface AvailabilitySchedule {
  [date: string]: {
    slots: TimeSlot[]
    breaks: Array<{
      start: string
      end: string
      reason?: string
    }>
  }
}

// Patient journey and tracking types
export interface PatientJourney {
  appointmentId: string
  currentStage: JourneyStage
  stages: JourneyStageDetails[]
  estimatedCompletionTime?: Date
  actualCompletionTime?: Date
  notes: string[]
}

export type JourneyStage =
  | 'appointment_confirmed'
  | 'check_in_reminder'
  | 'arrived_at_clinic'
  | 'with_nurse'
  | 'waiting_for_doctor'
  | 'consultation_in_progress'
  | 'consultation_completed'
  | 'at_pharmacy'
  | 'payment_pending'
  | 'visit_completed'

export interface JourneyStageDetails {
  stage: JourneyStage
  status: 'pending' | 'current' | 'completed' | 'skipped'
  timestamp?: Date
  estimatedTime?: number // minutes
  actualTime?: number // minutes
  notes?: string
  queuePosition?: number
}

// Payment and billing types
export interface BillingDetails {
  appointmentId: string
  consultationFee: number
  additionalProcedures: BillingItem[]
  subtotal: number
  taxes: number
  discounts: number
  insuranceCoverage: number
  totalPayable: number
  currency: string
  status: PaymentStatus
  paymentMethod?: PaymentMethod
  transactionId?: string
  receipt?: Receipt
}

export interface BillingItem {
  id: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  category: 'consultation' | 'procedure' | 'medication' | 'laboratory' | 'other'
}

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled'

export interface PaymentMethod {
  type: 'card' | 'qris' | 'virtual_account' | 'cash'
  provider?: string
  accountNumber?: string
  expiryDate?: string
  holderName?: string
}

export interface Receipt {
  id: string
  appointmentId: string
  issueDate: Date
  items: BillingItem[]
  subtotal: number
  taxes: number
  total: number
  paymentMethod: PaymentMethod
  transactionId: string
}

// Prescription and medication types
export interface Prescription {
  id: string
  medicationName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  quantity: number
  refills: number
  prescribedBy: string
  prescribedDate: Date
}

// Search and filtering types
export interface SearchFilters {
  specialization?: string[]
  location?: {
    city?: string
    radius?: number // km
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  availability?: {
    date?: Date
    timeRange?: {
      start: string
      end: string
    }
    availableToday?: boolean
    availableThisWeek?: boolean
  }
  rating?: {
    minimum: number
  }
  consultationFee?: {
    minimum?: number
    maximum?: number
  }
  languages?: string[]
  insurance?: string[]
  gender?: 'male' | 'female'
  experience?: {
    minimum: number // years
  }
}

export interface SearchResults<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasNextPage: boolean
  filters: SearchFilters
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Care plan types
export interface CarePlan {
  patientId: string
  upcomingAppointments: Appointment[]
  recentAppointments: Appointment[]
  ongoingTreatments: Treatment[]
  medications: Prescription[]
  labResults: LabResult[]
  healthMetrics: HealthMetric[]
  recommendations: Recommendation[]
  lastUpdated: Date
}

export interface Treatment {
  id: string
  name: string
  description: string
  startDate: Date
  endDate?: Date
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  progress: number // percentage
  nextAppointment?: Date
  prescribedBy: string
}

export interface LabResult {
  id: string
  testName: string
  result: string
  normalRange: string
  status: 'normal' | 'abnormal' | 'critical'
  testDate: Date
  orderedBy: string
  comments?: string
}

export interface HealthMetric {
  id: string
  type: 'blood_pressure' | 'heart_rate' | 'weight' | 'temperature' | 'blood_sugar'
  value: number | string
  unit: string
  recordedDate: Date
  recordedBy?: string
  notes?: string
}

export interface Recommendation {
  id: string
  type: 'medication' | 'lifestyle' | 'follow_up' | 'screening'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: Date
  completed: boolean
  completedDate?: Date
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
  scheduledFor?: Date
  expiresAt?: Date
}

export type NotificationType =
  | 'appointment_reminder'
  | 'journey_update'
  | 'prescription_refill'
  | 'lab_result'
  | 'payment_due'
  | 'general'
  | 'emergency'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  timestamp: Date
  requestId: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// Form and validation types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'phone' | 'date' | 'select' | 'checkbox' | 'textarea'
  required: boolean
  validation?: ValidationRule[]
  options?: SelectOption[]
  placeholder?: string
  helpText?: string
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Error handling types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
  requestId?: string
  userMessage?: string
}

// Analytics and tracking types
export interface AnalyticsEvent {
  name: string
  category: 'user_action' | 'page_view' | 'form_submission' | 'error' | 'performance'
  properties?: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId: string
}

// Utility types
export type Locale = 'en' | 'id'
export type Currency = 'IDR' | 'USD'
export type DateFormat = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd'
export type TimeFormat = '12h' | '24h'

// Component prop types
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LayoutProps extends ComponentProps {
  title?: string
  description?: string
  showNavigation?: boolean
  showFooter?: boolean
}

// Store/State management types
export interface AppState {
  auth: AuthState
  user: User | null
  appointments: Appointment[]
  doctors: Doctor[]
  carePlan: CarePlan | null
  notifications: Notification[]
  preferences: UserPreferences
  loading: boolean
  error: AppError | null
}

export interface StoreAction<T = any> {
  type: string
  payload?: T
}

// Feature flags
export interface FeatureFlag {
  name: string
  enabled: boolean
  description: string
  rolloutPercentage?: number
  targetAudience?: string[]
}

export type FeatureFlags = Record<string, boolean>