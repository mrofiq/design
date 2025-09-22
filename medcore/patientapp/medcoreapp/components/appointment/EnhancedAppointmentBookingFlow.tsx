'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Calendar,
  Clock,
  CreditCard,
  Shield,
  Stethoscope,
  MapPin,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

// Import components
import AppointmentTypeSelector from './AppointmentTypeSelector';
import AppointmentCalendar from './AppointmentCalendar';
import TimeSlotPicker from './TimeSlotPicker';
import PatientInformationForm from './PatientInformationForm';
import InsuranceVerification from './InsuranceVerification';
import EnhancedBookingConfirmation from './EnhancedBookingConfirmation';
import BookingSuccess from './BookingSuccess';

// Import store
import {
  useAppointmentBookingStore,
  useBookingFlow,
  useBookingSelection,
  useBookingForms,
  useBookingSubmission,
  BookingStep,
} from '@/stores/appointmentBookingStore';

// Import types
import { Doctor } from '@/types/doctor';
import { AppointmentType, TimeSlot } from '@/types/appointment';

interface EnhancedAppointmentBookingFlowProps {
  doctor?: Doctor;
  clinicId?: string;
  initialStep?: BookingStep;
  onComplete?: () => void;
  onCancel?: () => void;
  locale?: 'en' | 'id';
  className?: string;
}

const EnhancedAppointmentBookingFlow: React.FC<EnhancedAppointmentBookingFlowProps> = ({
  doctor: initialDoctor,
  clinicId: initialClinicId,
  initialStep = 'appointment-type',
  onComplete,
  onCancel,
  locale = 'id',
  className,
}) => {
  // Store hooks
  const { currentStep, completedSteps, setCurrentStep, goToNextStep, goToPreviousStep, resetFlow } = useBookingFlow();
  const {
    selectedDoctor,
    selectedClinicId,
    selectedAppointmentType,
    selectedDate,
    selectedTimeSlot,
    selectDoctor,
    selectAppointmentType,
    selectDate,
    selectTimeSlot,
  } = useBookingSelection();
  const {
    patientInformation,
    insuranceInformation,
    updatePatientInformation,
    updateInsuranceInformation,
  } = useBookingForms();
  const {
    isSubmitting,
    error,
    confirmedBooking,
    validation,
    submitBooking,
    validateCurrentStep,
    setError,
    clearError,
  } = useBookingSubmission();

  // Set locale in store
  const { setLocale } = useAppointmentBookingStore();

  // Local state
  const [isValidating, setIsValidating] = useState(false);

  // Initialize doctor if provided
  useEffect(() => {
    if (initialDoctor && !selectedDoctor) {
      selectDoctor(initialDoctor, initialClinicId);
    }
  }, [initialDoctor, initialClinicId, selectedDoctor, selectDoctor]);

  // Set locale
  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  // Set initial step
  useEffect(() => {
    if (initialStep && currentStep === 'doctor-selection') {
      setCurrentStep(initialStep);
    }
  }, [initialStep, currentStep, setCurrentStep]);

  // Step configuration
  const stepConfig = {
    'doctor-selection': {
      title: locale === 'id' ? 'Pilih Dokter' : 'Select Doctor',
      icon: User,
      description: locale === 'id' ? 'Pilih dokter yang ingin Anda konsultasikan' : 'Choose the doctor you want to consult',
    },
    'appointment-type': {
      title: locale === 'id' ? 'Jenis Konsultasi' : 'Appointment Type',
      icon: Stethoscope,
      description: locale === 'id' ? 'Pilih jenis konsultasi yang sesuai' : 'Choose the appropriate consultation type',
    },
    'date-selection': {
      title: locale === 'id' ? 'Pilih Tanggal' : 'Select Date',
      icon: Calendar,
      description: locale === 'id' ? 'Pilih tanggal yang tersedia' : 'Choose an available date',
    },
    'time-selection': {
      title: locale === 'id' ? 'Pilih Waktu' : 'Select Time',
      icon: Clock,
      description: locale === 'id' ? 'Pilih slot waktu yang tersedia' : 'Choose an available time slot',
    },
    'patient-information': {
      title: locale === 'id' ? 'Informasi Pasien' : 'Patient Information',
      icon: User,
      description: locale === 'id' ? 'Lengkapi informasi pribadi dan medis' : 'Complete personal and medical information',
    },
    'insurance-verification': {
      title: locale === 'id' ? 'Asuransi & Pembayaran' : 'Insurance & Payment',
      icon: Shield,
      description: locale === 'id' ? 'Verifikasi asuransi dan pilih metode pembayaran' : 'Verify insurance and choose payment method',
    },
    'booking-confirmation': {
      title: locale === 'id' ? 'Konfirmasi' : 'Confirmation',
      icon: CheckCircle,
      description: locale === 'id' ? 'Tinjau dan konfirmasi booking Anda' : 'Review and confirm your booking',
    },
    'booking-success': {
      title: locale === 'id' ? 'Berhasil' : 'Success',
      icon: CheckCircle,
      description: locale === 'id' ? 'Booking berhasil dibuat' : 'Booking successfully created',
    },
  };

  // Get all steps for progress calculation
  const allSteps: BookingStep[] = [
    'doctor-selection',
    'appointment-type',
    'date-selection',
    'time-selection',
    'patient-information',
    'insurance-verification',
    'booking-confirmation',
    'booking-success',
  ];

  // Skip doctor selection if already provided
  const effectiveSteps = initialDoctor
    ? allSteps.filter(step => step !== 'doctor-selection')
    : allSteps;

  const currentStepIndex = effectiveSteps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / effectiveSteps.length) * 100;

  // Navigation handlers
  const handleNext = async () => {
    setIsValidating(true);
    clearError();

    try {
      // Validate current step
      const stepValidation = validateCurrentStep();
      if (!stepValidation.isValid) {
        setError(stepValidation.errors[0]?.message || 'Validation failed');
        return;
      }

      // Special handling for certain steps
      switch (currentStep) {
        case 'booking-confirmation':
          // Submit booking instead of going to next step
          await submitBooking();
          break;
        default:
          goToNextStep();
          break;
      }
    } catch (err) {
      console.error('Step navigation error:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleBack = () => {
    clearError();
    goToPreviousStep();
  };

  const handleStepEdit = (step: string) => {
    clearError();
    setCurrentStep(step as BookingStep);
  };

  // Get clinic info
  const clinic = selectedDoctor?.clinics.find(c => c.id === selectedClinicId) || selectedDoctor?.clinics[0];

  // Check if current step can proceed
  const canProceed = () => {
    switch (currentStep) {
      case 'doctor-selection':
        return !!selectedDoctor;
      case 'appointment-type':
        return !!selectedAppointmentType;
      case 'date-selection':
        return !!selectedDate;
      case 'time-selection':
        return !!selectedTimeSlot;
      case 'patient-information':
        return !!patientInformation;
      case 'insurance-verification':
        return !!insuranceInformation;
      case 'booking-confirmation':
        return true; // Always can proceed if reached this step
      default:
        return false;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'doctor-selection':
        // This step is typically handled by doctor discovery
        return (
          <Card>
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {locale === 'id' ? 'Pilih Dokter' : 'Select Doctor'}
              </h3>
              <p className="text-gray-600">
                {locale === 'id'
                  ? 'Silakan pilih dokter dari halaman pencarian dokter'
                  : 'Please select a doctor from the doctor search page'
                }
              </p>
            </CardContent>
          </Card>
        );

      case 'appointment-type':
        return (
          <AppointmentTypeSelector
            onSelect={selectAppointmentType}
            selectedType={selectedAppointmentType}
            doctor={selectedDoctor}
            locale={locale}
          />
        );

      case 'date-selection':
        return selectedDoctor ? (
          <AppointmentCalendar
            doctorId={selectedDoctor.id}
            clinicId={selectedClinicId}
            selectedDate={selectedDate}
            onDateSelect={selectDate}
            locale={locale}
          />
        ) : null;

      case 'time-selection':
        return selectedDoctor && selectedDate ? (
          <TimeSlotPicker
            date={selectedDate}
            doctorId={selectedDoctor.id}
            clinicId={selectedClinicId}
            appointmentTypeId={selectedAppointmentType?.id}
            selectedSlot={selectedTimeSlot}
            onSlotSelect={selectTimeSlot}
            locale={locale}
          />
        ) : null;

      case 'patient-information':
        return (
          <PatientInformationForm
            onSubmit={updatePatientInformation}
            onBack={handleBack}
            initialData={patientInformation}
            locale={locale}
          />
        );

      case 'insurance-verification':
        return selectedAppointmentType ? (
          <InsuranceVerification
            onSubmit={updateInsuranceInformation}
            onBack={handleBack}
            initialData={insuranceInformation}
            consultationFee={selectedAppointmentType.price.min}
            locale={locale}
          />
        ) : null;

      case 'booking-confirmation':
        return selectedDoctor && selectedAppointmentType && selectedDate && selectedTimeSlot ? (
          <EnhancedBookingConfirmation
            doctor={selectedDoctor}
            clinic={clinic}
            bookingData={{
              appointmentTypeId: selectedAppointmentType.id,
              date: selectedDate,
              timeSlot: selectedTimeSlot,
              patientNotes: patientInformation?.appointmentInfo?.chiefComplaint,
              symptoms: patientInformation?.appointmentInfo?.symptoms,
              isFirstVisit: patientInformation?.appointmentInfo?.isFirstVisit || true,
            }}
            patientData={patientInformation}
            insuranceData={insuranceInformation}
            onConfirm={handleNext}
            onEdit={handleStepEdit}
            onBack={handleBack}
            locale={locale}
          />
        ) : null;

      case 'booking-success':
        return confirmedBooking && selectedDoctor ? (
          <BookingSuccess
            booking={confirmedBooking}
            doctor={selectedDoctor}
            clinic={clinic}
            onGoHome={() => {
              resetFlow();
              onComplete?.();
            }}
            onViewBookings={() => {
              // Navigate to booking management
              console.log('Navigate to booking management');
            }}
            locale={locale}
          />
        ) : null;

      default:
        return (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {locale === 'id' ? 'Langkah Tidak Dikenal' : 'Unknown Step'}
              </h3>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-6', className)}>
      {/* Progress Header */}
      {currentStep !== 'booking-success' && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-xl">
                  {stepConfig[currentStep]?.title}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {stepConfig[currentStep]?.description}
                </p>
              </div>
              <Badge variant="secondary">
                {currentStepIndex + 1} / {effectiveSteps.length}
              </Badge>
            </div>

            <Progress value={progress} className="h-2" />

            {/* Step indicators */}
            <div className="flex items-center justify-between mt-4">
              {effectiveSteps.map((step, index) => {
                const StepIcon = stepConfig[step]?.icon || CheckCircle;
                const isCompleted = completedSteps.includes(step);
                const isCurrent = step === currentStep;
                const isPast = index < currentStepIndex;

                return (
                  <div
                    key={step}
                    className={cn(
                      'flex flex-col items-center text-center',
                      'transition-all duration-200',
                      isCurrent && 'scale-110',
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                        'transition-all duration-200',
                        isCompleted || isCurrent
                          ? 'bg-blue-600 text-white'
                          : isPast
                          ? 'bg-gray-300 text-gray-600'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium hidden sm:block',
                        isCurrent ? 'text-blue-600' : 'text-gray-500'
                      )}
                    >
                      {stepConfig[step]?.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== 'booking-success' && currentStep !== 'patient-information' && currentStep !== 'insurance-verification' && currentStep !== 'booking-confirmation' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={onCancel || handleBack}
                disabled={isSubmitting || isValidating}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentStepIndex === 0
                  ? (locale === 'id' ? 'Batal' : 'Cancel')
                  : (locale === 'id' ? 'Kembali' : 'Back')
                }
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting || isValidating}
                className="min-w-32"
              >
                {isSubmitting || isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {locale === 'id' ? 'Memproses...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {currentStep === 'booking-confirmation'
                      ? (locale === 'id' ? 'Konfirmasi Booking' : 'Confirm Booking')
                      : (locale === 'id' ? 'Lanjutkan' : 'Continue')
                    }
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAppointmentBookingFlow;