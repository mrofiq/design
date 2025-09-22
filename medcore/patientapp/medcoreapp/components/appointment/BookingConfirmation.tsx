'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  Edit,
  Download,
  Share,
  AlertTriangle,
  Star,
  Building,
  Shield,
  Heart,
  FileText,
  DollarSign,
} from 'lucide-react';
import { BookingFormData } from '@/types/appointment';
import { Doctor, Clinic } from '@/types/doctor';
import { mockAppointmentTypes } from '@/data/mockSchedules';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface BookingConfirmationProps {
  doctor: Doctor;
  clinic?: Clinic;
  bookingData: BookingFormData;
  onConfirm: () => void;
  onEdit: () => void;
  locale?: 'en' | 'id';
  className?: string;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  doctor,
  clinic,
  bookingData,
  onConfirm,
  onEdit,
  locale = 'id',
  className,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  // Get appointment type details
  const appointmentType = mockAppointmentTypes.find(
    type => type.id === bookingData.appointmentTypeId
  );

  // Format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format time
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    if (locale === 'id') {
      return `${hours}:${minutes}`;
    }
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${period}`;
  };

  // Handle confirmation
  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onConfirm();
    setIsConfirming(false);
  };

  // Calculate estimated duration
  const getEstimatedDuration = () => {
    if (!bookingData.timeSlot || !appointmentType) return null;

    const duration = Math.max(bookingData.timeSlot.duration, appointmentType.duration);
    return duration;
  };

  const estimatedDuration = getEstimatedDuration();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Confirmation Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-900">
                {locale === 'id' ? 'Konfirmasi Booking' : 'Booking Confirmation'}
              </h2>
              <p className="text-sm text-green-700">
                {locale === 'id'
                  ? 'Periksa kembali detail janji temu Anda sebelum konfirmasi'
                  : 'Please review your appointment details before confirming'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor & Clinic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{locale === 'id' ? 'Dokter & Klinik' : 'Doctor & Clinic'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                {locale === 'id'
                  ? doctor.specializations[0]?.nameId
                  : doctor.specializations[0]?.name}
              </p>

              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{doctor.rating.overall}</span>
                  <span className="text-sm text-muted-foreground">
                    ({doctor.rating.reviewCount} {locale === 'id' ? 'ulasan' : 'reviews'})
                  </span>
                </div>

                <Badge variant="secondary">
                  {doctor.experienceYears} {locale === 'id' ? 'tahun' : 'years'}
                </Badge>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              {locale === 'id' ? 'Ubah' : 'Edit'}
            </Button>
          </div>

          {clinic && (
            <>
              <Separator />
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <h4 className="font-medium">{clinic.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {clinic.address}, {clinic.city}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="h-3 w-3" />
                    <span className="text-xs">{clinic.phone}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{locale === 'id' ? 'Detail Janji Temu' : 'Appointment Details'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Appointment Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{appointmentType?.icon}</div>
              <div>
                <h4 className="font-medium">
                  {locale === 'id' ? appointmentType?.nameId : appointmentType?.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {locale === 'id' ? appointmentType?.descriptionId : appointmentType?.description}
                </p>
              </div>
            </div>
            <Badge variant="outline">
              {estimatedDuration} {locale === 'id' ? 'menit' : 'minutes'}
            </Badge>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{locale === 'id' ? 'Tanggal' : 'Date'}</span>
              </div>
              <p className="text-lg">
                {format(new Date(bookingData.date), 'EEEE', {
                  locale: locale === 'id' ? idLocale : undefined,
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(bookingData.date), 'dd MMMM yyyy', {
                  locale: locale === 'id' ? idLocale : undefined,
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{locale === 'id' ? 'Waktu' : 'Time'}</span>
              </div>
              <p className="text-lg">
                {formatTime(bookingData.timeSlot.startTime)}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatTime(bookingData.timeSlot.startTime)} - {formatTime(bookingData.timeSlot.endTime)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Cost */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">{locale === 'id' ? 'Biaya Konsultasi' : 'Consultation Fee'}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                {formatPrice(bookingData.timeSlot.price)}
              </p>
              <p className="text-xs text-muted-foreground">
                {locale === 'id' ? 'Belum termasuk tindakan' : 'Excluding procedures'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>{locale === 'id' ? 'Informasi Pasien' : 'Patient Information'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">{locale === 'id' ? 'Jenis Kunjungan:' : 'Visit Type:'}</span>
              <p className="text-sm">
                {bookingData.isFirstVisit
                  ? (locale === 'id' ? 'Kunjungan Pertama' : 'First Visit')
                  : (locale === 'id' ? 'Kontrol/Follow-up' : 'Follow-up Visit')}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium">{locale === 'id' ? 'Bahasa:' : 'Language:'}</span>
              <p className="text-sm">
                {bookingData.preferredLanguage === 'id' ? 'Bahasa Indonesia' : 'English'}
              </p>
            </div>
          </div>

          {bookingData.symptoms && bookingData.symptoms.length > 0 && (
            <>
              <Separator />
              <div>
                <span className="text-sm font-medium">{locale === 'id' ? 'Gejala:' : 'Symptoms:'}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {bookingData.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {bookingData.patientNotes && (
            <>
              <Separator />
              <div>
                <span className="text-sm font-medium">{locale === 'id' ? 'Catatan:' : 'Notes:'}</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {bookingData.patientNotes}
                </p>
              </div>
            </>
          )}

          {bookingData.specialRequests && bookingData.specialRequests.length > 0 && (
            <>
              <Separator />
              <div>
                <span className="text-sm font-medium">{locale === 'id' ? 'Permintaan Khusus:' : 'Special Requests:'}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {bookingData.specialRequests.map((request, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {request}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Insurance Information */}
      {bookingData.insuranceInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>{locale === 'id' ? 'Informasi Asuransi' : 'Insurance Information'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{locale === 'id' ? 'Penyedia:' : 'Provider:'}</span>
                <span className="text-sm">{bookingData.insuranceInfo.providerId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{locale === 'id' ? 'Nomor Polis:' : 'Policy Number:'}</span>
                <span className="text-sm">{bookingData.insuranceInfo.policyNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{locale === 'id' ? 'Status:' : 'Status:'}</span>
                <Badge variant={bookingData.insuranceInfo.isVerified ? 'default' : 'secondary'}>
                  {bookingData.insuranceInfo.isVerified
                    ? (locale === 'id' ? 'Terverifikasi' : 'Verified')
                    : (locale === 'id' ? 'Belum Terverifikasi' : 'Not Verified')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contact */}
      {bookingData.emergencyContact && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>{locale === 'id' ? 'Kontak Darurat' : 'Emergency Contact'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{locale === 'id' ? 'Nama:' : 'Name:'}</span>
                <span className="text-sm">{bookingData.emergencyContact.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{locale === 'id' ? 'Telepon:' : 'Phone:'}</span>
                <span className="text-sm">{bookingData.emergencyContact.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{locale === 'id' ? 'Hubungan:' : 'Relationship:'}</span>
                <span className="text-sm">{bookingData.emergencyContact.relationship}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Information */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">
              {locale === 'id' ? 'Informasi Penting:' : 'Important Information:'}
            </p>
            <ul className="text-sm space-y-1">
              <li>
                {locale === 'id'
                  ? '• Harap datang 15 menit sebelum waktu janji temu'
                  : '• Please arrive 15 minutes before your appointment time'}
              </li>
              <li>
                {locale === 'id'
                  ? '• Bawa kartu identitas dan kartu asuransi (jika ada)'
                  : '• Bring your ID card and insurance card (if applicable)'}
              </li>
              <li>
                {locale === 'id'
                  ? '• Pembatalan dapat dilakukan maksimal 2 jam sebelum janji temu'
                  : '• Cancellation can be done up to 2 hours before the appointment'}
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3">
        <Button
          onClick={handleConfirm}
          disabled={isConfirming}
          size="lg"
          className="w-full"
        >
          {isConfirming
            ? (locale === 'id' ? 'Memproses...' : 'Processing...')
            : (locale === 'id' ? 'Konfirmasi Booking' : 'Confirm Booking')}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            {locale === 'id' ? 'Edit Detail' : 'Edit Details'}
          </Button>

          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            {locale === 'id' ? 'Bagikan' : 'Share'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;