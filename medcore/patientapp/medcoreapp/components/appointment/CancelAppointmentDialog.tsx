'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  X,
  AlertTriangle,
  Info,
  DollarSign,
  Loader2,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { AppointmentBooking } from '@/types/appointment';
import { Doctor } from '@/types/doctor';
import { format, isBefore } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: AppointmentBooking;
  doctor: Doctor;
  onConfirm: (reason: string) => Promise<void>;
  locale?: 'en' | 'id';
}

const CancelAppointmentDialog: React.FC<CancelAppointmentDialogProps> = ({
  open,
  onOpenChange,
  booking,
  doctor,
  onConfirm,
  locale = 'id',
}) => {
  const [step, setStep] = useState<'reason' | 'confirm'>('reason');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [acceptPolicy, setAcceptPolicy] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setStep('reason');
      setSelectedReason('');
      setCustomReason('');
      setAcceptPolicy(false);
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
  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: format(dateObj, 'EEEE, dd MMMM yyyy', { locale: idLocale }),
      time: format(dateObj, 'HH:mm'),
      short: format(dateObj, 'dd MMM yyyy', { locale: idLocale }),
    };
  };

  // Check cancellation policy
  const getCancellationInfo = () => {
    if (booking.cancellationPolicy) {
      const allowedUntil = new Date(booking.cancellationPolicy.allowedUntil);
      const now = new Date();
      const canCancel = isBefore(now, allowedUntil);
      const feePercentage = booking.cancellationPolicy.feePercentage;
      const feeAmount = (booking.price * feePercentage) / 100;
      const refundAmount = booking.price - feeAmount;

      return {
        canCancel,
        feePercentage,
        feeAmount,
        refundAmount,
        allowedUntil: format(allowedUntil, 'dd MMM yyyy HH:mm', { locale: idLocale }),
      };
    }

    // Default policy: can cancel up to 2 hours before, no fee
    const appointmentTime = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`);
    const twoHoursBefore = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000);
    const now = new Date();
    const canCancel = isBefore(now, twoHoursBefore);

    return {
      canCancel,
      feePercentage: 0,
      feeAmount: 0,
      refundAmount: booking.price,
      allowedUntil: format(twoHoursBefore, 'dd MMM yyyy HH:mm', { locale: idLocale }),
    };
  };

  const cancellationInfo = getCancellationInfo();

  // Cancellation reasons
  const cancellationReasons = [
    {
      id: 'scheduling-conflict',
      text: locale === 'id' ? 'Konflik jadwal' : 'Scheduling conflict',
    },
    {
      id: 'feeling-better',
      text: locale === 'id' ? 'Sudah merasa lebih baik' : 'Feeling better',
    },
    {
      id: 'emergency',
      text: locale === 'id' ? 'Kondisi darurat' : 'Emergency situation',
    },
    {
      id: 'transportation',
      text: locale === 'id' ? 'Masalah transportasi' : 'Transportation issues',
    },
    {
      id: 'financial',
      text: locale === 'id' ? 'Kendala finansial' : 'Financial constraints',
    },
    {
      id: 'doctor-preference',
      text: locale === 'id' ? 'Ingin ganti dokter' : 'Want to change doctor',
    },
    {
      id: 'personal',
      text: locale === 'id' ? 'Alasan pribadi' : 'Personal reasons',
    },
    {
      id: 'other',
      text: locale === 'id' ? 'Lainnya' : 'Other',
    },
  ];

  // Handle reason selection
  const handleReasonSelect = () => {
    if (!selectedReason) {
      setError(locale === 'id' ? 'Pilih alasan pembatalan' : 'Please select a cancellation reason');
      return;
    }

    if (selectedReason === 'other' && !customReason.trim()) {
      setError(locale === 'id' ? 'Masukkan alasan lainnya' : 'Please provide other reason');
      return;
    }

    setError(null);
    setStep('confirm');
  };

  // Handle confirm cancellation
  const handleConfirmCancellation = async () => {
    if (!acceptPolicy) {
      setError(locale === 'id' ? 'Setujui kebijakan pembatalan' : 'Please accept the cancellation policy');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const reason = selectedReason === 'other' ? customReason :
        cancellationReasons.find(r => r.id === selectedReason)?.text || selectedReason;

      await onConfirm(reason);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to reason selection
  const goBack = () => {
    setStep('reason');
  };

  const { date, time, short } = formatDateTime(booking.scheduledDate, booking.scheduledTime);

  if (!cancellationInfo.canCancel) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              {locale === 'id' ? 'Tidak Dapat Dibatalkan' : 'Cannot Cancel'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {locale === 'id'
                  ? `Janji temu tidak dapat dibatalkan. Batas waktu pembatalan adalah ${cancellationInfo.allowedUntil}.`
                  : `Appointment cannot be cancelled. Cancellation deadline was ${cancellationInfo.allowedUntil}.`
                }
              </AlertDescription>
            </Alert>
            <div className="space-y-2 text-sm">
              <p className="font-medium">
                {locale === 'id' ? 'Opsi lain:' : 'Alternative options:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>
                  {locale === 'id'
                    ? 'Hubungi klinik langsung untuk pembatalan darurat'
                    : 'Contact clinic directly for emergency cancellation'
                  }
                </li>
                <li>
                  {locale === 'id'
                    ? 'Jadwal ulang janji temu jika masih memungkinkan'
                    : 'Reschedule appointment if still possible'
                  }
                </li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            {locale === 'id' ? 'Batalkan Janji Temu' : 'Cancel Appointment'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                <AvatarFallback>
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="text-sm text-gray-600">
                  {doctor.specializations.map(s => s.name).join(', ')}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{short}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{time}</span>
                  </div>
                  <Badge variant="outline">ID: {booking.id}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === 'reason' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {locale === 'id' ? 'Alasan Pembatalan' : 'Cancellation Reason'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'id'
                    ? 'Mohon pilih alasan pembatalan untuk membantu kami meningkatkan layanan.'
                    : 'Please select a reason for cancellation to help us improve our service.'
                  }
                </p>
              </div>

              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cancellationReasons.map((reason) => (
                    <div key={reason.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason.id} id={reason.id} />
                      <Label htmlFor={reason.id} className="text-sm">
                        {reason.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {selectedReason === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="customReason">
                    {locale === 'id' ? 'Alasan lainnya' : 'Other reason'}
                  </Label>
                  <Textarea
                    id="customReason"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder={
                      locale === 'id'
                        ? 'Jelaskan alasan pembatalan Anda...'
                        : 'Explain your cancellation reason...'
                    }
                    rows={3}
                  />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {locale === 'id' ? 'Konfirmasi Pembatalan' : 'Confirm Cancellation'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {locale === 'id'
                    ? 'Tinjau detail pembatalan dan kebijakan refund.'
                    : 'Review cancellation details and refund policy.'
                  }
                </p>
              </div>

              {/* Cancellation Summary */}
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">
                        {locale === 'id' ? 'Alasan Pembatalan' : 'Cancellation Reason'}
                      </p>
                      <p className="text-yellow-700">
                        {selectedReason === 'other'
                          ? customReason
                          : cancellationReasons.find(r => r.id === selectedReason)?.text
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Refund Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm space-y-2">
                      <p className="font-medium text-blue-800">
                        {locale === 'id' ? 'Informasi Refund' : 'Refund Information'}
                      </p>
                      <div className="space-y-1 text-blue-700">
                        <div className="flex justify-between">
                          <span>{locale === 'id' ? 'Biaya konsultasi:' : 'Consultation fee:'}</span>
                          <span>{formatCurrency(booking.price)}</span>
                        </div>
                        {cancellationInfo.feeAmount > 0 && (
                          <div className="flex justify-between">
                            <span>{locale === 'id' ? 'Biaya pembatalan:' : 'Cancellation fee:'}</span>
                            <span>-{formatCurrency(cancellationInfo.feeAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium border-t border-blue-300 pt-1">
                          <span>{locale === 'id' ? 'Total refund:' : 'Total refund:'}</span>
                          <span>{formatCurrency(cancellationInfo.refundAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Policy Acceptance */}
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="acceptPolicy"
                    checked={acceptPolicy}
                    onCheckedChange={setAcceptPolicy}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="acceptPolicy" className="font-medium">
                      {locale === 'id'
                        ? 'Saya menyetujui kebijakan pembatalan'
                        : 'I agree to the cancellation policy'
                      }
                    </Label>
                    <p className="text-sm text-gray-600">
                      {locale === 'id'
                        ? 'Dengan menyetujui, Anda memahami bahwa pembatalan ini tidak dapat dibatalkan dan refund akan diproses sesuai kebijakan.'
                        : 'By agreeing, you understand that this cancellation cannot be undone and refunds will be processed according to policy.'
                      }
                    </p>
                  </div>
                </div>

                {/* Processing Time Info */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {locale === 'id'
                      ? 'Refund akan diproses dalam 3-5 hari kerja ke metode pembayaran asal.'
                      : 'Refund will be processed within 3-5 business days to the original payment method.'
                    }
                  </AlertDescription>
                </Alert>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={step === 'reason' ? () => onOpenChange(false) : goBack}
              disabled={isSubmitting}
            >
              {step === 'reason'
                ? (locale === 'id' ? 'Batal' : 'Cancel')
                : (locale === 'id' ? 'Kembali' : 'Back')
              }
            </Button>

            {step === 'reason' && (
              <Button onClick={handleReasonSelect} disabled={!selectedReason}>
                {locale === 'id' ? 'Lanjutkan' : 'Continue'}
              </Button>
            )}

            {step === 'confirm' && (
              <Button
                variant="destructive"
                onClick={handleConfirmCancellation}
                disabled={isSubmitting || !acceptPolicy}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {locale === 'id' ? 'Memproses...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    {locale === 'id' ? 'Konfirmasi Pembatalan' : 'Confirm Cancellation'}
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

export default CancelAppointmentDialog;