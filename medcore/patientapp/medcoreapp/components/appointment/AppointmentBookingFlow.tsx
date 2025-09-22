'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Star,
  Phone,
  Video,
  Building,
} from 'lucide-react';
import {
  AppointmentType,
  TimeSlot,
  BookingFormData,
  BookingValidation,
} from '@/types/appointment';
import { Doctor } from '@/types/doctor';
import AppointmentCalendar from './AppointmentCalendar';
import TimeSlotPicker from './TimeSlotPicker';
import AppointmentTypeSelector from './AppointmentTypeSelector';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

type BookingStep = 'doctor' | 'type' | 'date' | 'time' | 'details' | 'confirmation';

interface AppointmentBookingFlowProps {
  doctor: Doctor;
  clinicId?: string;
  initialStep?: BookingStep;
  onComplete?: (bookingData: BookingFormData) => void;
  onCancel?: () => void;
  locale?: 'en' | 'id';
  className?: string;
}

const AppointmentBookingFlow: React.FC<AppointmentBookingFlowProps> = ({
  doctor,
  clinicId,
  initialStep = 'type',
  onComplete,
  onCancel,
  locale = 'id',
  className,
}) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(initialStep);
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({
    isFirstVisit: true,
  });
  const [validation, setValidation] = useState<BookingValidation>({
    isValid: true,
    errors: [],
    warnings: [],
  });

  // Get clinic info
  const clinic = doctor.clinics.find(c => c.id === clinicId) || doctor.clinics[0];

  // Step configuration
  const steps: { id: BookingStep; title: string; titleId: string }[] = [
    { id: 'doctor', title: 'Select Doctor', titleId: 'Pilih Dokter' },
    { id: 'type', title: 'Appointment Type', titleId: 'Jenis Konsultasi' },
    { id: 'date', title: 'Select Date', titleId: 'Pilih Tanggal' },
    { id: 'time', title: 'Select Time', titleId: 'Pilih Waktu' },
    { id: 'details', title: 'Details', titleId: 'Detail' },
    { id: 'confirmation', title: 'Confirmation', titleId: 'Konfirmasi' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    setCurrentStep(steps[nextIndex].id);
  }, [currentStepIndex, steps]);

  const goToPreviousStep = useCallback(() => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(steps[prevIndex].id);
  }, [currentStepIndex, steps]);

  const goToStep = useCallback((step: BookingStep) => {
    setCurrentStep(step);
  }, []);

  // Data handlers
  const updateBookingData = useCallback((data: Partial<BookingFormData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  }, []);

  const handleAppointmentTypeSelect = useCallback((type: AppointmentType) => {
    updateBookingData({ appointmentTypeId: type.id });
    goToNextStep();
  }, [updateBookingData, goToNextStep]);

  const handleDateSelect = useCallback((date: string) => {
    updateBookingData({ date });
    goToNextStep();
  }, [updateBookingData, goToNextStep]);

  const handleTimeSlotSelect = useCallback((timeSlot: TimeSlot) => {
    updateBookingData({ timeSlot });
    goToNextStep();
  }, [updateBookingData, goToNextStep]);

  const handleFormSubmit = useCallback((formData: Partial<BookingFormData>) => {
    updateBookingData(formData);
    goToNextStep();
  }, [updateBookingData, goToNextStep]);

  const handleBookingComplete = useCallback(() => {
    if (onComplete && bookingData) {
      onComplete(bookingData as BookingFormData);
    }
  }, [onComplete, bookingData]);

  // Validation
  const validateCurrentStep = useCallback((): boolean => {
    const errors: BookingValidation['errors'] = [];
    const warnings: BookingValidation['warnings'] = [];

    switch (currentStep) {
      case 'type':
        if (!bookingData.appointmentTypeId) {
          errors.push({
            field: 'appointmentTypeId',
            message: 'Please select an appointment type',
            messageId: 'Silakan pilih jenis konsultasi',
          });
        }
        break;
      case 'date':
        if (!bookingData.date) {
          errors.push({
            field: 'date',
            message: 'Please select a date',
            messageId: 'Silakan pilih tanggal',
          });
        }
        break;
      case 'time':
        if (!bookingData.timeSlot) {
          errors.push({
            field: 'timeSlot',
            message: 'Please select a time slot',
            messageId: 'Silakan pilih waktu',
          });
        }
        break;
      case 'details':
        if (!bookingData.patientNotes && bookingData.isFirstVisit) {
          warnings.push({
            field: 'patientNotes',
            message: 'Consider adding notes about your symptoms',
            messageId: 'Pertimbangkan untuk menambahkan catatan tentang gejala Anda',
          });
        }
        break;
    }

    const validation = {
      isValid: errors.length === 0,
      errors,
      warnings,
    };

    setValidation(validation);
    return validation.isValid;
  }, [currentStep, bookingData]);

  // Check if next step is available
  const canProceed = useCallback((): boolean => {
    return validateCurrentStep();
  }, [validateCurrentStep]);

  // Format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'doctor':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.photo} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{doctor.name}</h3>
                    <p className="text-muted-foreground">
                      {doctor.specializations[0]?.nameId || doctor.specializations[0]?.name}
                    </p>

                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{doctor.rating.overall}</span>
                        <span className="text-sm text-muted-foreground">
                          ({doctor.rating.reviewCount} {locale === 'id' ? 'ulasan' : 'reviews'})
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span className="text-sm">{clinic?.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 mt-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {clinic?.address}, {clinic?.city}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'type':
        return (
          <AppointmentTypeSelector
            selectedTypeId={bookingData.appointmentTypeId}
            onTypeSelect={handleAppointmentTypeSelect}
            doctorSpecialization={doctor.specializations[0]?.id}
            clinicType={clinic?.type}
            locale={locale}
            compact
          />
        );

      case 'date':
        return (
          <AppointmentCalendar
            doctorId={doctor.id}
            clinicId={clinicId}
            selectedDate={bookingData.date}
            onDateSelect={handleDateSelect}
            locale={locale}
            compact
          />
        );

      case 'time':
        return bookingData.date ? (
          <TimeSlotPicker
            date={bookingData.date}
            doctorId={doctor.id}
            clinicId={clinicId}
            appointmentTypeId={bookingData.appointmentTypeId}
            selectedSlot={bookingData.timeSlot}
            onSlotSelect={handleTimeSlotSelect}
            locale={locale}
          />
        ) : null;

      case 'details':
        return (
          <BookingForm
            doctor={doctor}
            clinic={clinic}
            bookingData={bookingData}
            onSubmit={handleFormSubmit}
            locale={locale}
          />
        );

      case 'confirmation':
        return (
          <BookingConfirmation
            doctor={doctor}
            clinic={clinic}
            bookingData={bookingData as BookingFormData}
            onConfirm={handleBookingComplete}
            onEdit={goToPreviousStep}
            locale={locale}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('max-w-4xl mx-auto space-y-6', className)}>
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {locale === 'id' ? 'Buat Janji Temu' : 'Book Appointment'}
            </CardTitle>

            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                {locale === 'id' ? 'Batal' : 'Cancel'}
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {locale === 'id' ? 'Langkah' : 'Step'} {currentStepIndex + 1} {locale === 'id' ? 'dari' : 'of'} {steps.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex flex-col items-center space-y-1 cursor-pointer',
                  index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                )}
                onClick={() => index <= currentStepIndex && goToStep(step.id)}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                  index < currentStepIndex && 'bg-primary text-primary-foreground',
                  index === currentStepIndex && 'bg-primary/20 text-primary border-2 border-primary',
                  index > currentStepIndex && 'bg-muted text-muted-foreground'
                )}>
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs text-center hidden sm:block">
                  {locale === 'id' ? step.titleId : step.title}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Booking Summary (Mobile) */}
      {(bookingData.appointmentTypeId || bookingData.date || bookingData.timeSlot) && (
        <Card className="sm:hidden">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">
              {locale === 'id' ? 'Ringkasan Booking' : 'Booking Summary'}
            </h3>
            <div className="space-y-2 text-sm">
              {bookingData.appointmentTypeId && (
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {locale === 'id' ? 'Jenis' : 'Type'}
                  </Badge>
                  <span>{bookingData.appointmentTypeId}</span>
                </div>
              )}
              {bookingData.date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(bookingData.date), 'EEEE, dd MMMM yyyy', {
                      locale: locale === 'id' ? idLocale : undefined,
                    })}
                  </span>
                </div>
              )}
              {bookingData.timeSlot && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {bookingData.timeSlot.startTime} - {bookingData.timeSlot.endTime}
                  </span>
                  <span className="text-green-600 font-medium">
                    {formatPrice(bookingData.timeSlot.price)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Step Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === 'id'
                  ? steps[currentStepIndex]?.titleId
                  : steps[currentStepIndex]?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary & Actions */}
        <div className="space-y-6">
          {/* Booking Summary (Desktop) */}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle className="text-base">
                {locale === 'id' ? 'Ringkasan Booking' : 'Booking Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={doctor.photo} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{doctor.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {doctor.specializations[0]?.nameId || doctor.specializations[0]?.name}
                    </p>
                  </div>
                </div>

                <Separator />

                {bookingData.appointmentTypeId && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {locale === 'id' ? 'Jenis Konsultasi' : 'Appointment Type'}
                      </Badge>
                    </div>
                    <p className="text-sm">{bookingData.appointmentTypeId}</p>
                  </div>
                )}

                {bookingData.date && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {locale === 'id' ? 'Tanggal' : 'Date'}
                      </span>
                    </div>
                    <p className="text-sm">
                      {format(new Date(bookingData.date), 'EEEE, dd MMMM yyyy', {
                        locale: locale === 'id' ? idLocale : undefined,
                      })}
                    </p>
                  </div>
                )}

                {bookingData.timeSlot && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {locale === 'id' ? 'Waktu' : 'Time'}
                      </span>
                    </div>
                    <p className="text-sm">
                      {bookingData.timeSlot.startTime} - {bookingData.timeSlot.endTime}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      {formatPrice(bookingData.timeSlot.price)}
                    </p>
                  </div>
                )}

                {clinic && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {locale === 'id' ? 'Lokasi' : 'Location'}
                      </span>
                    </div>
                    <p className="text-sm">{clinic.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {clinic.address}, {clinic.city}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validation Messages */}
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <Card>
              <CardContent className="p-4">
                {validation.errors.map((error, index) => (
                  <div key={index} className="flex items-center space-x-2 text-red-600 text-sm mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{locale === 'id' ? error.messageId : error.message}</span>
                  </div>
                ))}
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="flex items-center space-x-2 text-yellow-600 text-sm mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{locale === 'id' ? warning.messageId : warning.message}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{locale === 'id' ? 'Sebelumnya' : 'Previous'}</span>
            </Button>

            <Button
              onClick={currentStep === 'confirmation' ? handleBookingComplete : goToNextStep}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>
                {currentStep === 'confirmation'
                  ? (locale === 'id' ? 'Konfirmasi Booking' : 'Confirm Booking')
                  : (locale === 'id' ? 'Selanjutnya' : 'Next')
                }
              </span>
              {currentStep !== 'confirmation' && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBookingFlow;