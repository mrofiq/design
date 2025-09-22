import { Doctor } from './doctor';

// Indonesian Time Zone constants
export const INDONESIAN_TIME_ZONES = {
  WIB: 'Asia/Jakarta',     // Western Indonesian Time (UTC+7)
  WITA: 'Asia/Makassar',   // Central Indonesian Time (UTC+8)
  WIT: 'Asia/Jayapura',    // Eastern Indonesian Time (UTC+9)
} as const;

export type TimeZone = keyof typeof INDONESIAN_TIME_ZONES;

// Appointment Type Definitions
export interface AppointmentType {
  id: string;
  name: string;
  nameId: string; // Indonesian translation
  duration: number; // minutes
  description: string;
  descriptionId: string;
  icon: string;
  color: string;
  price: {
    min: number;
    max: number;
    currency: 'IDR';
  };
  requiresPreparation?: boolean;
  isEmergency?: boolean;
  allowsOnline?: boolean;
}

// Time Slot Definitions
export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  duration: number;  // minutes
  available: boolean;
  price: number;
  appointmentTypeId?: string;
  isBreakTime?: boolean;
  isBlocked?: boolean;
  blockedReason?: string;
  bookedBy?: string; // patient ID if booked
}

// Daily Schedule
export interface DailySchedule {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6 (0 = Sunday)
  isWorkingDay: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  workingHours: {
    start: string; // HH:MM
    end: string;   // HH:MM
  };
  breakTimes: Array<{
    start: string; // HH:MM
    end: string;   // HH:MM
    name: string;  // e.g., "Lunch Break", "Prayer Time"
  }>;
  timeSlots: TimeSlot[];
  blockedPeriods?: Array<{
    start: string;
    end: string;
    reason: string;
  }>;
  specialNote?: string;
  specialNoteId?: string; // Indonesian translation
}

// Doctor Schedule
export interface DoctorSchedule {
  doctorId: string;
  clinicId: string;
  timezone: TimeZone;
  dailySchedules: Record<string, DailySchedule>; // date -> DailySchedule
  recurringSchedule: {
    monday?: WeeklyScheduleTemplate;
    tuesday?: WeeklyScheduleTemplate;
    wednesday?: WeeklyScheduleTemplate;
    thursday?: WeeklyScheduleTemplate;
    friday?: WeeklyScheduleTemplate;
    saturday?: WeeklyScheduleTemplate;
    sunday?: WeeklyScheduleTemplate;
  };
  exceptions: Array<{
    date: string;
    type: 'blocked' | 'modified' | 'holiday';
    reason: string;
    alternativeSchedule?: Partial<DailySchedule>;
  }>;
  lastUpdated: string;
}

// Weekly Schedule Template
export interface WeeklyScheduleTemplate {
  isWorkingDay: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  breakTimes: Array<{
    start: string;
    end: string;
    name: string;
  }>;
  slotDuration: number; // minutes
  appointmentTypes: string[]; // appointment type IDs allowed
}

// Appointment Booking
export interface AppointmentBooking {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  appointmentTypeId: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  duration: number; // minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show' | 'rescheduled';
  bookingTime: string; // ISO string
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'ewallet';
  insuranceProvider?: string;
  notes?: string;
  symptoms?: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  isFirstVisit: boolean;
  isFollowUp?: boolean;
  previousAppointmentId?: string;
  remindersSent: Array<{
    type: 'sms' | 'email' | 'push';
    sentAt: string;
    scheduled: boolean;
  }>;
  cancellationReason?: string;
  cancellationPolicy?: {
    allowedUntil: string; // ISO string
    feePercentage: number;
  };
  reschedulingHistory?: Array<{
    fromDate: string;
    fromTime: string;
    toDate: string;
    toTime: string;
    reason: string;
    timestamp: string;
  }>;
}

// Calendar View Types
export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarDate {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  dayOfWeek: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  availability: 'available' | 'busy' | 'blocked' | 'unavailable';
  appointmentCount: number;
  slotsAvailable: number;
  slotsTotal: number;
  hasUrgentSlots: boolean;
  earliestAvailableTime?: string;
  latestAvailableTime?: string;
}

// Availability Status
export interface AvailabilityStatus {
  date: string;
  status: 'available' | 'busy' | 'blocked' | 'unavailable';
  availableSlots: number;
  totalSlots: number;
  nextAvailableTime?: string;
  workingHours?: {
    start: string;
    end: string;
  };
  breakTimes?: Array<{
    start: string;
    end: string;
    name: string;
  }>;
}

// Time Range for slot grouping
export interface TimeRange {
  id: string;
  name: string;
  nameId: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  slots: TimeSlot[];
  availableCount: number;
  totalCount: number;
  icon?: string;
  description?: string;
}

// Search and Filter Types
export interface AppointmentSearchFilters {
  date?: string;
  timeRange?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  appointmentType?: string;
  maxPrice?: number;
  insuranceAccepted?: boolean;
  availableOnly?: boolean;
  urgentOnly?: boolean;
  onlineAvailable?: boolean;
}

export interface AppointmentSearchResult {
  doctor: Doctor;
  availableDates: string[];
  nextAvailableSlot?: {
    date: string;
    time: string;
    appointmentType: AppointmentType;
    price: number;
  };
  totalAvailableSlots: number;
  averageWaitTime: number; // days
  responseTime: string;
}

// Booking Form Data
export interface BookingFormData {
  appointmentTypeId: string;
  date: string;
  timeSlot: TimeSlot;
  patientNotes?: string;
  symptoms?: string[];
  isFirstVisit: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  insuranceInfo?: {
    providerId: string;
    policyNumber: string;
    isVerified: boolean;
  };
  preferredLanguage?: string;
  specialRequests?: string[];
}

// Calendar Export Types
export interface CalendarExportData {
  title: string;
  description: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  location: string;
  attendees?: string[];
  reminders?: Array<{
    method: 'popup' | 'email';
    minutes: number;
  }>;
  url?: string;
}

// Notification Types
export interface AppointmentNotification {
  id: string;
  appointmentId: string;
  type: 'reminder' | 'confirmation' | 'cancellation' | 'rescheduling';
  method: 'sms' | 'email' | 'push' | 'whatsapp';
  scheduledTime: string; // ISO string
  content: string;
  contentId: string; // Indonesian translation
  sent: boolean;
  sentAt?: string;
  delivered?: boolean;
  deliveredAt?: string;
}

// Indonesian Holidays
export interface IndonesianHoliday {
  date: string; // YYYY-MM-DD
  name: string;
  nameId: string;
  type: 'national' | 'religious' | 'regional';
  isFixed: boolean; // true for fixed dates, false for calculated dates
  affectsSchedule: boolean;
}

// Booking Validation
export interface BookingValidation {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    messageId: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    messageId: string;
  }>;
}

// Calendar Navigation
export interface CalendarNavigation {
  currentDate: Date;
  viewDate: Date; // The date being viewed (may be different from current)
  view: CalendarView;
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// Touch Gesture Types for mobile
export interface TouchGestureConfig {
  enableSwipe: boolean;
  enablePinch: boolean;
  swipeThreshold: number; // pixels
  pinchThreshold: number;
  longPressDelay: number; // milliseconds
}

// Component Props Types
export interface CalendarComponentProps {
  doctorId: string;
  clinicId?: string;
  selectedDate?: string;
  selectedTimeSlot?: TimeSlot;
  view?: CalendarView;
  minDate?: Date;
  maxDate?: Date;
  onDateSelect: (date: string) => void;
  onTimeSlotSelect: (slot: TimeSlot) => void;
  onViewChange?: (view: CalendarView) => void;
  showUnavailable?: boolean;
  highlightToday?: boolean;
  touchGestures?: TouchGestureConfig;
  locale?: 'en' | 'id';
  timezone?: TimeZone;
}

export interface TimeSlotPickerProps {
  date: string;
  doctorId: string;
  clinicId?: string;
  appointmentTypeId?: string;
  selectedSlot?: TimeSlot;
  onSlotSelect: (slot: TimeSlot) => void;
  view?: 'grid' | 'list';
  onViewChange?: (view: 'grid' | 'list') => void;
  minTouchSize?: number; // minimum touch target size in pixels
  showPrices?: boolean;
  showDuration?: boolean;
  groupByTimeRange?: boolean;
  locale?: 'en' | 'id';
}

// Store/State Types
export interface AppointmentState {
  selectedDoctor?: Doctor;
  selectedDate?: string;
  selectedTimeSlot?: TimeSlot;
  selectedAppointmentType?: AppointmentType;
  bookingFormData?: Partial<BookingFormData>;
  calendarView: CalendarView;
  currentMonth: Date;
  loading: boolean;
  error?: string;
  schedules: Record<string, DoctorSchedule>; // doctorId -> schedule
  availabilities: Record<string, AvailabilityStatus[]>; // doctorId -> availability
  filters: AppointmentSearchFilters;
}

export interface AppointmentActions {
  selectDoctor: (doctor: Doctor) => void;
  selectDate: (date: string) => void;
  selectTimeSlot: (slot: TimeSlot) => void;
  selectAppointmentType: (type: AppointmentType) => void;
  updateBookingForm: (data: Partial<BookingFormData>) => void;
  setCalendarView: (view: CalendarView) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  loadSchedule: (doctorId: string, clinicId?: string) => Promise<void>;
  loadAvailability: (doctorId: string, startDate: string, endDate: string) => Promise<void>;
  validateBooking: () => BookingValidation;
  submitBooking: () => Promise<AppointmentBooking>;
  clearSelection: () => void;
  setFilters: (filters: Partial<AppointmentSearchFilters>) => void;
}

// API Response Types
export interface ScheduleResponse {
  success: boolean;
  data: DoctorSchedule;
  error?: string;
}

export interface AvailabilityResponse {
  success: boolean;
  data: AvailabilityStatus[];
  error?: string;
}

export interface BookingResponse {
  success: boolean;
  data?: AppointmentBooking;
  error?: string;
  validationErrors?: BookingValidation;
}

export default {};