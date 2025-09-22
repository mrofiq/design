import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
  AppointmentType,
  TimeSlot,
  BookingFormData,
  AppointmentBooking,
  BookingValidation,
  DoctorSchedule,
  AvailabilityStatus,
} from '@/types/appointment';
import { Doctor } from '@/types/doctor';

// Booking flow step types
export type BookingStep =
  | 'doctor-selection'
  | 'appointment-type'
  | 'date-selection'
  | 'time-selection'
  | 'patient-information'
  | 'insurance-verification'
  | 'booking-confirmation'
  | 'booking-success';

// Patient information from enhanced form
export interface PatientInformation {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    phoneNumber: string;
    email?: string;
    address: string;
    idNumber?: string;
  };
  medicalInfo: {
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
    pastSurgeries?: Array<{
      procedure: string;
      date: string;
      hospital: string;
    }>;
    familyHistory?: string[];
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
    address?: string;
  };
  appointmentInfo: {
    chiefComplaint: string;
    symptoms?: string[];
    symptomDuration?: string;
    painLevel?: number;
    isFirstVisit: boolean;
    lastVisitDate?: string;
    referralSource?: string;
    preferredLanguage: 'id' | 'en';
    specialRequests?: string;
  };
  consents: {
    treatmentConsent: boolean;
    dataProcessingConsent: boolean;
    communicationConsent: boolean;
    marketingConsent: boolean;
  };
}

// Insurance verification data
export interface InsuranceInformation {
  hasInsurance: boolean;
  insuranceDetails?: {
    providerId: string;
    providerName?: string;
    policyNumber: string;
    policyHolderName: string;
    policyHolderRelation: 'self' | 'spouse' | 'parent' | 'child' | 'other';
    membershipNumber?: string;
    groupNumber?: string;
    coverageType: 'individual' | 'family' | 'corporate';
    validUntil: string;
    copayAmount?: number;
    deductibleAmount?: number;
    maxCoverage?: number;
    preAuthRequired: boolean;
    emergencyContact?: string;
  };
  paymentMethod: 'insurance' | 'cash' | 'card' | 'ewallet';
  cardDetails?: {
    cardNumber?: string;
    cardHolderName?: string;
    expiryDate?: string;
    cvv?: string;
  };
  ewalletDetails?: {
    provider?: string;
    phoneNumber?: string;
  };
  estimatedCost?: number;
  coverageAmount?: number;
  patientPayment?: number;
  verificationStatus?: 'idle' | 'verifying' | 'verified' | 'failed';
  verificationResult?: any;
}

// Complete booking state
export interface BookingState {
  // Current flow state
  currentStep: BookingStep;
  completedSteps: BookingStep[];
  isSubmitting: boolean;
  error: string | null;

  // Selection data
  selectedDoctor: Doctor | null;
  selectedClinicId: string | null;
  selectedAppointmentType: AppointmentType | null;
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;

  // Form data
  patientInformation: PatientInformation | null;
  insuranceInformation: InsuranceInformation | null;
  bookingFormData: Partial<BookingFormData>;

  // Schedule data
  doctorSchedules: Record<string, DoctorSchedule>;
  availabilities: Record<string, AvailabilityStatus[]>;

  // Final booking result
  confirmedBooking: AppointmentBooking | null;

  // Validation
  validation: BookingValidation;

  // Settings
  locale: 'en' | 'id';
  autoSave: boolean;
}

// Action types
export interface BookingActions {
  // Flow navigation
  setCurrentStep: (step: BookingStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  markStepCompleted: (step: BookingStep) => void;
  resetFlow: () => void;

  // Doctor selection
  selectDoctor: (doctor: Doctor, clinicId?: string) => void;
  clearDoctorSelection: () => void;

  // Appointment type selection
  selectAppointmentType: (appointmentType: AppointmentType) => void;
  clearAppointmentType: () => void;

  // Date and time selection
  selectDate: (date: string) => void;
  selectTimeSlot: (timeSlot: TimeSlot) => void;
  clearDateTimeSelection: () => void;

  // Patient information
  updatePatientInformation: (patientInfo: Partial<PatientInformation>) => void;
  clearPatientInformation: () => void;

  // Insurance verification
  updateInsuranceInformation: (insuranceInfo: Partial<InsuranceInformation>) => void;
  clearInsuranceInformation: () => void;

  // Legacy booking form data (for compatibility)
  updateBookingFormData: (data: Partial<BookingFormData>) => void;

  // Schedule management
  setDoctorSchedule: (doctorId: string, schedule: DoctorSchedule) => void;
  setAvailabilities: (doctorId: string, availabilities: AvailabilityStatus[]) => void;
  loadScheduleData: (doctorId: string, startDate: string, endDate: string) => Promise<void>;

  // Validation
  validateCurrentStep: () => BookingValidation;
  validateCompleteBooking: () => BookingValidation;
  setValidation: (validation: BookingValidation) => void;

  // Booking submission
  submitBooking: () => Promise<AppointmentBooking>;
  setConfirmedBooking: (booking: AppointmentBooking) => void;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Settings
  setLocale: (locale: 'en' | 'id') => void;
  toggleAutoSave: () => void;

  // Persistence
  saveToStorage: () => void;
  loadFromStorage: () => void;
  clearStorage: () => void;
}

// Step flow configuration
const STEP_FLOW: BookingStep[] = [
  'doctor-selection',
  'appointment-type',
  'date-selection',
  'time-selection',
  'patient-information',
  'insurance-verification',
  'booking-confirmation',
  'booking-success',
];

// Initial state
const initialState: BookingState = {
  currentStep: 'doctor-selection',
  completedSteps: [],
  isSubmitting: false,
  error: null,

  selectedDoctor: null,
  selectedClinicId: null,
  selectedAppointmentType: null,
  selectedDate: null,
  selectedTimeSlot: null,

  patientInformation: null,
  insuranceInformation: null,
  bookingFormData: {},

  doctorSchedules: {},
  availabilities: {},

  confirmedBooking: null,

  validation: {
    isValid: true,
    errors: [],
    warnings: [],
  },

  locale: 'id',
  autoSave: true,
};

// Create the store
export const useAppointmentBookingStore = create<BookingState & BookingActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Flow navigation
        setCurrentStep: (step) => {
          set({ currentStep: step }, false, 'setCurrentStep');
        },

        goToNextStep: () => {
          const { currentStep } = get();
          const currentIndex = STEP_FLOW.indexOf(currentStep);
          if (currentIndex < STEP_FLOW.length - 1) {
            const nextStep = STEP_FLOW[currentIndex + 1];
            set({ currentStep: nextStep }, false, 'goToNextStep');
          }
        },

        goToPreviousStep: () => {
          const { currentStep } = get();
          const currentIndex = STEP_FLOW.indexOf(currentStep);
          if (currentIndex > 0) {
            const previousStep = STEP_FLOW[currentIndex - 1];
            set({ currentStep: previousStep }, false, 'goToPreviousStep');
          }
        },

        markStepCompleted: (step) => {
          set((state) => ({
            completedSteps: [...new Set([...state.completedSteps, step])]
          }), false, 'markStepCompleted');
        },

        resetFlow: () => {
          set(initialState, false, 'resetFlow');
        },

        // Doctor selection
        selectDoctor: (doctor, clinicId) => {
          set({
            selectedDoctor: doctor,
            selectedClinicId: clinicId || doctor.clinics[0]?.id || null,
          }, false, 'selectDoctor');
          get().markStepCompleted('doctor-selection');
        },

        clearDoctorSelection: () => {
          set({
            selectedDoctor: null,
            selectedClinicId: null,
          }, false, 'clearDoctorSelection');
        },

        // Appointment type selection
        selectAppointmentType: (appointmentType) => {
          set({ selectedAppointmentType: appointmentType }, false, 'selectAppointmentType');
          get().markStepCompleted('appointment-type');
        },

        clearAppointmentType: () => {
          set({ selectedAppointmentType: null }, false, 'clearAppointmentType');
        },

        // Date and time selection
        selectDate: (date) => {
          set({ selectedDate: date, selectedTimeSlot: null }, false, 'selectDate');
          get().markStepCompleted('date-selection');
        },

        selectTimeSlot: (timeSlot) => {
          set({ selectedTimeSlot: timeSlot }, false, 'selectTimeSlot');
          get().markStepCompleted('time-selection');
        },

        clearDateTimeSelection: () => {
          set({
            selectedDate: null,
            selectedTimeSlot: null,
          }, false, 'clearDateTimeSelection');
        },

        // Patient information
        updatePatientInformation: (patientInfo) => {
          set((state) => ({
            patientInformation: {
              ...state.patientInformation,
              ...patientInfo,
            } as PatientInformation,
          }), false, 'updatePatientInformation');
          get().markStepCompleted('patient-information');
        },

        clearPatientInformation: () => {
          set({ patientInformation: null }, false, 'clearPatientInformation');
        },

        // Insurance verification
        updateInsuranceInformation: (insuranceInfo) => {
          set((state) => ({
            insuranceInformation: {
              ...state.insuranceInformation,
              ...insuranceInfo,
            } as InsuranceInformation,
          }), false, 'updateInsuranceInformation');
          get().markStepCompleted('insurance-verification');
        },

        clearInsuranceInformation: () => {
          set({ insuranceInformation: null }, false, 'clearInsuranceInformation');
        },

        // Legacy booking form data
        updateBookingFormData: (data) => {
          set((state) => ({
            bookingFormData: {
              ...state.bookingFormData,
              ...data,
            },
          }), false, 'updateBookingFormData');
        },

        // Schedule management
        setDoctorSchedule: (doctorId, schedule) => {
          set((state) => ({
            doctorSchedules: {
              ...state.doctorSchedules,
              [doctorId]: schedule,
            },
          }), false, 'setDoctorSchedule');
        },

        setAvailabilities: (doctorId, availabilities) => {
          set((state) => ({
            availabilities: {
              ...state.availabilities,
              [doctorId]: availabilities,
            },
          }), false, 'setAvailabilities');
        },

        loadScheduleData: async (doctorId, startDate, endDate) => {
          try {
            // Mock API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock schedule data
            const mockSchedule = {
              doctorId,
              clinicId: get().selectedClinicId || '',
              timezone: 'WIB' as const,
              dailySchedules: {},
              recurringSchedule: {},
              exceptions: [],
              lastUpdated: new Date().toISOString(),
            };

            const mockAvailabilities = [
              {
                date: startDate,
                status: 'available' as const,
                availableSlots: 8,
                totalSlots: 10,
                workingHours: { start: '09:00', end: '17:00' },
                breakTimes: [{ start: '12:00', end: '13:00', name: 'Lunch' }],
              },
            ];

            get().setDoctorSchedule(doctorId, mockSchedule);
            get().setAvailabilities(doctorId, mockAvailabilities);
          } catch (error) {
            get().setError('Failed to load schedule data');
          }
        },

        // Validation
        validateCurrentStep: () => {
          const state = get();
          const validation: BookingValidation = {
            isValid: true,
            errors: [],
            warnings: [],
          };

          switch (state.currentStep) {
            case 'doctor-selection':
              if (!state.selectedDoctor) {
                validation.errors.push({
                  field: 'doctor',
                  message: 'Please select a doctor',
                  messageId: 'Pilih dokter terlebih dahulu',
                });
                validation.isValid = false;
              }
              break;

            case 'appointment-type':
              if (!state.selectedAppointmentType) {
                validation.errors.push({
                  field: 'appointmentType',
                  message: 'Please select appointment type',
                  messageId: 'Pilih jenis konsultasi',
                });
                validation.isValid = false;
              }
              break;

            case 'date-selection':
              if (!state.selectedDate) {
                validation.errors.push({
                  field: 'date',
                  message: 'Please select a date',
                  messageId: 'Pilih tanggal',
                });
                validation.isValid = false;
              }
              break;

            case 'time-selection':
              if (!state.selectedTimeSlot) {
                validation.errors.push({
                  field: 'timeSlot',
                  message: 'Please select a time slot',
                  messageId: 'Pilih waktu',
                });
                validation.isValid = false;
              }
              break;

            case 'patient-information':
              if (!state.patientInformation) {
                validation.errors.push({
                  field: 'patientInfo',
                  message: 'Please complete patient information',
                  messageId: 'Lengkapi informasi pasien',
                });
                validation.isValid = false;
              } else {
                const { personalInfo, emergencyContact, appointmentInfo, consents } = state.patientInformation;
                if (!personalInfo?.fullName || !personalInfo?.phoneNumber || !personalInfo?.address) {
                  validation.errors.push({
                    field: 'personalInfo',
                    message: 'Please complete personal information',
                    messageId: 'Lengkapi informasi pribadi',
                  });
                  validation.isValid = false;
                }
                if (!emergencyContact?.name || !emergencyContact?.phoneNumber) {
                  validation.errors.push({
                    field: 'emergencyContact',
                    message: 'Please provide emergency contact',
                    messageId: 'Berikan kontak darurat',
                  });
                  validation.isValid = false;
                }
                if (!appointmentInfo?.chiefComplaint) {
                  validation.errors.push({
                    field: 'chiefComplaint',
                    message: 'Please describe your chief complaint',
                    messageId: 'Jelaskan keluhan utama',
                  });
                  validation.isValid = false;
                }
                if (!consents?.treatmentConsent || !consents?.dataProcessingConsent) {
                  validation.errors.push({
                    field: 'consents',
                    message: 'Please accept required consents',
                    messageId: 'Setujui persetujuan yang diperlukan',
                  });
                  validation.isValid = false;
                }
              }
              break;

            case 'insurance-verification':
              if (!state.insuranceInformation?.paymentMethod) {
                validation.errors.push({
                  field: 'paymentMethod',
                  message: 'Please select payment method',
                  messageId: 'Pilih metode pembayaran',
                });
                validation.isValid = false;
              }
              break;
          }

          set({ validation }, false, 'validateCurrentStep');
          return validation;
        },

        validateCompleteBooking: () => {
          const state = get();
          const validation: BookingValidation = {
            isValid: true,
            errors: [],
            warnings: [],
          };

          // Validate all required fields
          if (!state.selectedDoctor || !state.selectedAppointmentType ||
              !state.selectedDate || !state.selectedTimeSlot ||
              !state.patientInformation || !state.insuranceInformation) {
            validation.isValid = false;
            validation.errors.push({
              field: 'general',
              message: 'Please complete all required steps',
              messageId: 'Lengkapi semua langkah yang diperlukan',
            });
          }

          set({ validation }, false, 'validateCompleteBooking');
          return validation;
        },

        setValidation: (validation) => {
          set({ validation }, false, 'setValidation');
        },

        // Booking submission
        submitBooking: async () => {
          const state = get();
          set({ isSubmitting: true, error: null }, false, 'submitBooking:start');

          try {
            // Validate before submission
            const validation = get().validateCompleteBooking();
            if (!validation.isValid) {
              throw new Error('Validation failed');
            }

            // Mock API submission
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Create booking object
            const booking: AppointmentBooking = {
              id: `APT-${Date.now()}`,
              patientId: 'patient-123', // Would come from auth
              doctorId: state.selectedDoctor!.id,
              clinicId: state.selectedClinicId!,
              appointmentTypeId: state.selectedAppointmentType!.id,
              scheduledDate: state.selectedDate!,
              scheduledTime: state.selectedTimeSlot!.startTime,
              duration: state.selectedAppointmentType!.duration,
              status: 'confirmed',
              bookingTime: new Date().toISOString(),
              price: state.selectedAppointmentType!.price.min,
              paymentStatus: state.insuranceInformation?.paymentMethod === 'cash' ? 'pending' : 'paid',
              paymentMethod: state.insuranceInformation?.paymentMethod || 'cash',
              insuranceProvider: state.insuranceInformation?.insuranceDetails?.providerName,
              notes: state.patientInformation?.appointmentInfo?.chiefComplaint,
              symptoms: state.patientInformation?.appointmentInfo?.symptoms,
              urgency: 'medium',
              isFirstVisit: state.patientInformation?.appointmentInfo?.isFirstVisit || true,
              remindersSent: [],
              cancellationPolicy: {
                allowedUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours before
                feePercentage: 0,
              },
            };

            set({
              confirmedBooking: booking,
              currentStep: 'booking-success',
              isSubmitting: false,
            }, false, 'submitBooking:success');

            get().markStepCompleted('booking-confirmation');
            return booking;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Booking submission failed',
              isSubmitting: false,
            }, false, 'submitBooking:error');
            throw error;
          }
        },

        setConfirmedBooking: (booking) => {
          set({ confirmedBooking: booking }, false, 'setConfirmedBooking');
        },

        // Error handling
        setError: (error) => {
          set({ error }, false, 'setError');
        },

        clearError: () => {
          set({ error: null }, false, 'clearError');
        },

        // Settings
        setLocale: (locale) => {
          set({ locale }, false, 'setLocale');
        },

        toggleAutoSave: () => {
          set((state) => ({ autoSave: !state.autoSave }), false, 'toggleAutoSave');
        },

        // Persistence
        saveToStorage: () => {
          // Auto-save is handled by persist middleware
        },

        loadFromStorage: () => {
          // Auto-load is handled by persist middleware
        },

        clearStorage: () => {
          set(initialState, false, 'clearStorage');
        },
      }),
      {
        name: 'appointment-booking-store',
        partialize: (state) => ({
          // Only persist non-sensitive data
          selectedDoctor: state.selectedDoctor,
          selectedClinicId: state.selectedClinicId,
          selectedAppointmentType: state.selectedAppointmentType,
          selectedDate: state.selectedDate,
          selectedTimeSlot: state.selectedTimeSlot,
          patientInformation: state.patientInformation,
          // Don't persist insurance details for security
          locale: state.locale,
          autoSave: state.autoSave,
        }),
      }
    ),
    {
      name: 'appointment-booking-store',
    }
  )
);

// Selector hooks for specific parts of the state
export const useBookingFlow = () => {
  const store = useAppointmentBookingStore();
  return {
    currentStep: store.currentStep,
    completedSteps: store.completedSteps,
    setCurrentStep: store.setCurrentStep,
    goToNextStep: store.goToNextStep,
    goToPreviousStep: store.goToPreviousStep,
    resetFlow: store.resetFlow,
  };
};

export const useBookingSelection = () => {
  const store = useAppointmentBookingStore();
  return {
    selectedDoctor: store.selectedDoctor,
    selectedClinicId: store.selectedClinicId,
    selectedAppointmentType: store.selectedAppointmentType,
    selectedDate: store.selectedDate,
    selectedTimeSlot: store.selectedTimeSlot,
    selectDoctor: store.selectDoctor,
    selectAppointmentType: store.selectAppointmentType,
    selectDate: store.selectDate,
    selectTimeSlot: store.selectTimeSlot,
  };
};

export const useBookingForms = () => {
  const store = useAppointmentBookingStore();
  return {
    patientInformation: store.patientInformation,
    insuranceInformation: store.insuranceInformation,
    updatePatientInformation: store.updatePatientInformation,
    updateInsuranceInformation: store.updateInsuranceInformation,
  };
};

export const useBookingSubmission = () => {
  const store = useAppointmentBookingStore();
  return {
    isSubmitting: store.isSubmitting,
    error: store.error,
    confirmedBooking: store.confirmedBooking,
    validation: store.validation,
    submitBooking: store.submitBooking,
    validateCurrentStep: store.validateCurrentStep,
    validateCompleteBooking: store.validateCompleteBooking,
    setError: store.setError,
    clearError: store.clearError,
  };
};