// Appointment Booking Components
export { default as AppointmentCalendar } from './AppointmentCalendar';
export { default as TimeSlotPicker } from './TimeSlotPicker';
export { default as DoctorScheduleViewer } from './DoctorScheduleViewer';
export { default as AppointmentTypeSelector } from './AppointmentTypeSelector';
export { default as AppointmentBookingFlow } from './AppointmentBookingFlow';
export { default as BookingForm } from './BookingForm';
export { default as BookingConfirmation } from './BookingConfirmation';
export { default as CalendarExport } from './CalendarExport';

// Enhanced Booking Flow Components
export { default as EnhancedAppointmentBookingFlow } from './EnhancedAppointmentBookingFlow';
export { default as PatientInformationForm } from './PatientInformationForm';
export { default as InsuranceVerification } from './InsuranceVerification';
export { default as EnhancedBookingConfirmation } from './EnhancedBookingConfirmation';
export { default as BookingSuccess } from './BookingSuccess';
export { default as BookingManagement } from './BookingManagement';
export { default as RescheduleDialog } from './RescheduleDialog';
export { default as CancelAppointmentDialog } from './CancelAppointmentDialog';

// Re-export types for convenience
export type {
  AppointmentType,
  TimeSlot,
  DailySchedule,
  DoctorSchedule,
  WeeklyScheduleTemplate,
  TimeRange,
  AppointmentBooking,
  BookingFormData,
  CalendarDate,
  CalendarView,
  AvailabilityStatus,
  CalendarExportData,
  IndonesianHoliday,
  BookingValidation,
  CalendarNavigation,
  TouchGestureConfig,
} from '@/types/appointment';

// Re-export mock data
export {
  mockAppointmentTypes,
  mockDoctorSchedules,
  indonesianHolidays,
  weeklyScheduleTemplates,
  scheduleHelpers,
} from '@/data/mockSchedules';