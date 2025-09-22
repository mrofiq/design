'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  Info,
} from 'lucide-react';
import { AppointmentBooking, TimeSlot } from '@/types/appointment';
import { Doctor } from '@/types/doctor';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import AppointmentCalendar from './AppointmentCalendar';
import TimeSlotPicker from './TimeSlotPicker';

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: AppointmentBooking;
  doctor: Doctor;
  onConfirm: (newDate: string, newTimeSlot: TimeSlot) => Promise<void>;
  locale?: 'en' | 'id';
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
  open,
  onOpenChange,
  booking,
  doctor,
  onConfirm,
  locale = 'id',
}) => {
  const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setStep('date');
      setSelectedDate('');
      setSelectedTimeSlot(null);
      setError(null);
    }
  }, [open]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date and time
  const formatDateTime = (date: string, time?: string) => {
    const dateObj = time ? new Date(`${date}T${time}`) : new Date(date);
    return {
      date: format(dateObj, 'EEEE, dd MMMM yyyy', { locale: idLocale }),
      time: time ? format(new Date(`${date}T${time}`), 'HH:mm') : '',
      short: format(dateObj, 'dd MMM yyyy', { locale: idLocale }),
    };
  };

  // Check if reschedule is allowed
  const canReschedule = () => {
    const originalDateTime = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`);
    const now = new Date();
    const twoHoursBefore = new Date(originalDateTime.getTime() - 2 * 60 * 60 * 1000);

    return isAfter(now, twoHoursBefore);
  };

  // Check cancellation policy
  const getCancellationInfo = () => {
    if (booking.cancellationPolicy) {
      const allowedUntil = new Date(booking.cancellationPolicy.allowedUntil);
      const now = new Date();
      const canCancel = isBefore(now, allowedUntil);
      const feePercentage = booking.cancellationPolicy.feePercentage;

      return {
        canCancel,
        feePercentage,
        allowedUntil: format(allowedUntil, 'dd MMM yyyy HH:mm', { locale: idLocale }),
      };
    }

    return {
      canCancel: canReschedule(),
      feePercentage: 0,
      allowedUntil: '',
    };
  };

  const cancellationInfo = getCancellationInfo();

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setStep('time');
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setStep('confirm');
  };

  // Handle confirm reschedule
  const handleConfirmReschedule = async () => {
    if (!selectedDate || !selectedTimeSlot) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirm(selectedDate, selectedTimeSlot);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reschedule appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to previous step
  const goBack = () => {
    switch (step) {
      case 'time':
        setStep('date');
        setSelectedTimeSlot(null);
        break;
      case 'confirm':
        setStep('time');
        break;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 'date':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {locale === 'id' ? 'Pilih Tanggal Baru' : 'Select New Date'}
              </h3>
              <p className="text-gray-600">
                {locale === 'id'
                  ? 'Pilih tanggal yang tersedia untuk dijadwal ulang'
                  : 'Choose an available date for rescheduling'
                }
              </p>
            </div>

            <AppointmentCalendar
              doctorId={doctor.id}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              minDate={addDays(new Date(), 1)} // At least tomorrow
              locale={locale}
            />
          </div>
        );

      case 'time':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {locale === 'id' ? 'Pilih Waktu Baru' : 'Select New Time'}
              </h3>
              <p className="text-gray-600">
                {formatDateTime(selectedDate).date}
              </p>
            </div>

            <TimeSlotPicker
              date={selectedDate}
              doctorId={doctor.id}
              appointmentTypeId={booking.appointmentTypeId}
              selectedSlot={selectedTimeSlot}
              onSlotSelect={handleTimeSlotSelect}
              locale={locale}
            />
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {locale === 'id' ? 'Konfirmasi Perubahan Jadwal' : 'Confirm Schedule Change'}
              </h3>
              <p className="text-gray-600">
                {locale === 'id'
                  ? 'Tinjau perubahan jadwal janji temu Anda'
                  : 'Review your appointment schedule changes'
                }
              </p>
            </div>

            {/* Original vs New Appointment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3 text-gray-700">
                  {locale === 'id' ? 'Jadwal Sebelumnya' : 'Previous Schedule'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDateTime(booking.scheduledDate).short}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{booking.scheduledTime}</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-blue-600" />
              </div>

              {/* New */}
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium mb-3 text-blue-700">
                  {locale === 'id' ? 'Jadwal Baru' : 'New Schedule'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>{formatDateTime(selectedDate).short}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{selectedTimeSlot?.startTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                <AvatarFallback>
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{doctor.name}</h4>
                <p className="text-sm text-gray-600">
                  {doctor.specializations.map(s => s.name).join(', ')}
                </p>
              </div>
            </div>

            {/* Fees Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">
                    {locale === 'id' ? 'Informasi Biaya' : 'Fee Information'}
                  </p>
                  <p className="text-yellow-700">
                    {cancellationInfo.feePercentage > 0
                      ? (locale === 'id'
                          ? `Biaya perubahan jadwal: ${cancellationInfo.feePercentage}% dari biaya konsultasi (${formatCurrency(booking.price * cancellationInfo.feePercentage / 100)})`
                          : `Reschedule fee: ${cancellationInfo.feePercentage}% of consultation fee (${formatCurrency(booking.price * cancellationInfo.feePercentage / 100)})`
                        )
                      : (locale === 'id'
                          ? 'Tidak ada biaya tambahan untuk perubahan jadwal ini'
                          : 'No additional fee for this schedule change'
                        )
                    }
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        );
    }
  };

  if (!cancellationInfo.canCancel) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {locale === 'id' ? 'Tidak Dapat Dijadwal Ulang' : 'Cannot Reschedule'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {locale === 'id'
                  ? `Janji temu tidak dapat dijadwal ulang. Batas waktu perubahan jadwal adalah ${cancellationInfo.allowedUntil}.`
                  : `Appointment cannot be rescheduled. Reschedule deadline was ${cancellationInfo.allowedUntil}.`
                }
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>
                {locale === 'id' ? 'Tutup' : 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            {locale === 'id' ? 'Jadwal Ulang Janji Temu' : 'Reschedule Appointment'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-4">
            {['date', 'time', 'confirm'].map((stepName, index) => {
              const isActive = step === stepName;
              const isCompleted = ['date', 'time', 'confirm'].indexOf(step) > index;

              return (
                <React.Fragment key={stepName}>
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      isCompleted || isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 2 && (
                    <div
                      className={cn(
                        'w-8 h-0.5',
                        ['date', 'time', 'confirm'].indexOf(step) > index
                          ? 'bg-blue-600'
                          : 'bg-gray-200'
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Original appointment info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-gray-700">
              {locale === 'id' ? 'Janji Temu Saat Ini' : 'Current Appointment'}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(booking.scheduledDate).short}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{booking.scheduledTime}</span>
              </div>
              <Badge variant="outline">ID: {booking.id}</Badge>
            </div>
          </div>

          {/* Step content */}
          {renderStepContent()}

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={step === 'date' ? () => onOpenChange(false) : goBack}
              disabled={isSubmitting}
            >
              {step === 'date'
                ? (locale === 'id' ? 'Batal' : 'Cancel')
                : (locale === 'id' ? 'Kembali' : 'Back')
              }
            </Button>

            {step === 'confirm' && (
              <Button
                onClick={handleConfirmReschedule}
                disabled={isSubmitting || !selectedDate || !selectedTimeSlot}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {locale === 'id' ? 'Memproses...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {locale === 'id' ? 'Konfirmasi Perubahan' : 'Confirm Changes'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;