'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  Info,
  Loader2,
  ArrowLeft,
  ArrowRight,
  QrCode,
  Copy,
  ExternalLink,
  Stethoscope,
  Activity,
  Users,
} from 'lucide-react';
import { BookingFormData } from '@/types/appointment';
import { Doctor, Clinic } from '@/types/doctor';
import { mockAppointmentTypes } from '@/data/mockSchedules';
import { format, addMinutes } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface EnhancedBookingConfirmationProps {
  doctor: Doctor;
  clinic?: Clinic;
  bookingData: BookingFormData;
  patientData?: any; // From PatientInformationForm
  insuranceData?: any; // From InsuranceVerification
  onConfirm: () => void;
  onEdit: (step: string) => void;
  onBack?: () => void;
  locale?: 'en' | 'id';
  className?: string;
}

const EnhancedBookingConfirmation: React.FC<EnhancedBookingConfirmationProps> = ({
  doctor,
  clinic,
  bookingData,
  patientData,
  insuranceData,
  onConfirm,
  onEdit,
  onBack,
  locale = 'id',
  className,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedCancellation, setAcceptedCancellation] = useState(false);

  // Get appointment type details
  const appointmentType = mockAppointmentTypes.find(
    type => type.id === bookingData.appointmentTypeId
  );

  // Calculate appointment end time
  const getAppointmentEndTime = () => {
    if (!bookingData.timeSlot || !appointmentType) return '';

    const [hours, minutes] = bookingData.timeSlot.startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = addMinutes(startDate, appointmentType.duration);
    return format(endDate, 'HH:mm');
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'EEEE, dd MMMM yyyy', { locale: idLocale });
  };

  // Handle confirmation
  const handleConfirm = async () => {
    if (!acceptedTerms || !acceptedCancellation) return;

    setIsConfirming(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      onConfirm();
    } catch (error) {
      console.error('Booking confirmation failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    const basePrice = appointmentType?.price.min || 0;
    const insuranceCoverage = insuranceData?.coverageAmount || 0;
    return basePrice - insuranceCoverage;
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {locale === 'id' ? 'Konfirmasi Janji Temu' : 'Appointment Confirmation'}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doctor & Clinic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'id' ? 'Informasi Dokter & Klinik' : 'Doctor & Clinic Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                  <AvatarFallback>
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-gray-600">
                      {doctor.specializations.map(s => s.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{doctor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{doctor.reviewCount} {locale === 'id' ? 'ulasan' : 'reviews'}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit('doctor')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {locale === 'id' ? 'Ubah' : 'Edit'}
                </Button>
              </div>

              {clinic && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-500 mt-1" />
                    <div>
                      <h4 className="font-medium">{clinic.name}</h4>
                      <p className="text-sm text-gray-600">{clinic.address}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{clinic.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{clinic.distance}</span>
                        </div>
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
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {locale === 'id' ? 'Detail Janji Temu' : 'Appointment Details'}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit('appointment')}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {locale === 'id' ? 'Ubah' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {locale === 'id' ? appointmentType?.nameId : appointmentType?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointmentType?.duration} {locale === 'id' ? 'menit' : 'minutes'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">{formatDate(bookingData.date)}</p>
                      <p className="text-sm text-gray-600">
                        {bookingData.timeSlot?.startTime} - {getAppointmentEndTime()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">
                        {formatCurrency(appointmentType?.price.min || 0)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {locale === 'id' ? 'Biaya konsultasi' : 'Consultation fee'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">
                        {bookingData.isFirstVisit
                          ? (locale === 'id' ? 'Kunjungan Pertama' : 'First Visit')
                          : (locale === 'id' ? 'Kunjungan Ulang' : 'Follow-up Visit')
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {bookingData.patientNotes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">
                      {locale === 'id' ? 'Keluhan' : 'Chief Complaint'}
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {bookingData.patientNotes}
                    </p>
                  </div>
                </>
              )}

              {bookingData.symptoms && bookingData.symptoms.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">
                    {locale === 'id' ? 'Gejala' : 'Symptoms'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="secondary">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Information */}
          {patientData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {locale === 'id' ? 'Informasi Pasien' : 'Patient Information'}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit('patient')}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {locale === 'id' ? 'Ubah' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{patientData.personalInfo?.fullName}</p>
                        <p className="text-sm text-gray-600">
                          {patientData.personalInfo?.gender === 'male'
                            ? (locale === 'id' ? 'Laki-laki' : 'Male')
                            : (locale === 'id' ? 'Perempuan' : 'Female')
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{patientData.personalInfo?.phoneNumber}</span>
                    </div>

                    {patientData.personalInfo?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{patientData.personalInfo?.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{patientData.emergencyContact?.name}</p>
                        <p className="text-sm text-gray-600">
                          {patientData.emergencyContact?.relationship} • {patientData.emergencyContact?.phoneNumber}
                        </p>
                      </div>
                    </div>

                    {patientData.medicalInfo?.bloodType !== 'unknown' && (
                      <div className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{locale === 'id' ? 'Golongan Darah:' : 'Blood Type:'} {patientData.medicalInfo?.bloodType}</span>
                      </div>
                    )}
                  </div>
                </div>

                {patientData.medicalInfo?.allergies && patientData.medicalInfo.allergies.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">
                      {locale === 'id' ? 'Alergi' : 'Allergies'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {patientData.medicalInfo.allergies.map((allergy: string, index: number) => (
                        <Badge key={index} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Insurance & Payment */}
          {insuranceData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {locale === 'id' ? 'Asuransi & Pembayaran' : 'Insurance & Payment'}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit('insurance')}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {locale === 'id' ? 'Ubah' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {insuranceData.hasInsurance && (
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {insuranceData.insuranceDetails?.providerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {locale === 'id' ? 'Polis:' : 'Policy:'} {insuranceData.insuranceDetails?.policyNumber}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">
                      {insuranceData.paymentMethod === 'insurance' && (locale === 'id' ? 'Asuransi' : 'Insurance')}
                      {insuranceData.paymentMethod === 'cash' && (locale === 'id' ? 'Tunai' : 'Cash')}
                      {insuranceData.paymentMethod === 'card' && (locale === 'id' ? 'Kartu Kredit/Debit' : 'Credit/Debit Card')}
                      {insuranceData.paymentMethod === 'ewallet' && 'E-Wallet'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {locale === 'id' ? 'Metode pembayaran' : 'Payment method'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'id' ? 'Syarat dan Ketentuan' : 'Terms and Conditions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                />
                <div className="space-y-1">
                  <Label htmlFor="terms" className="font-medium">
                    {locale === 'id'
                      ? 'Saya menyetujui syarat dan ketentuan layanan'
                      : 'I agree to the terms and conditions of service'
                    }
                  </Label>
                  <p className="text-sm text-gray-600">
                    {locale === 'id'
                      ? 'Dengan menyetujui, Anda setuju untuk mengikuti kebijakan klinik dan menerima perawatan sesuai standar medis.'
                      : 'By agreeing, you consent to follow clinic policies and receive treatment according to medical standards.'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="cancellation"
                  checked={acceptedCancellation}
                  onCheckedChange={setAcceptedCancellation}
                />
                <div className="space-y-1">
                  <Label htmlFor="cancellation" className="font-medium">
                    {locale === 'id'
                      ? 'Saya memahami kebijakan pembatalan'
                      : 'I understand the cancellation policy'
                    }
                  </Label>
                  <p className="text-sm text-gray-600">
                    {locale === 'id'
                      ? 'Pembatalan dapat dilakukan hingga 2 jam sebelum jadwal janji temu tanpa dikenakan biaya.'
                      : 'Cancellations can be made up to 2 hours before the appointment without charge.'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'id' ? 'Ringkasan Biaya' : 'Cost Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{locale === 'id' ? 'Biaya Konsultasi' : 'Consultation Fee'}</span>
                  <span>{formatCurrency(appointmentType?.price.min || 0)}</span>
                </div>

                {insuranceData?.coverageAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{locale === 'id' ? 'Ditanggung Asuransi' : 'Insurance Coverage'}</span>
                    <span>-{formatCurrency(insuranceData.coverageAmount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>{locale === 'id' ? 'Total Pembayaran' : 'Total Payment'}</span>
                  <span>{formatCurrency(calculateTotalCost())}</span>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {locale === 'id'
                    ? 'Biaya sudah termasuk konsultasi dan administrasi. Biaya tambahan akan diinformasikan jika diperlukan.'
                    : 'Fee includes consultation and administration. Additional costs will be informed if required.'
                  }
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'id' ? 'Aksi Cepat' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                {locale === 'id' ? 'Unduh Ringkasan' : 'Download Summary'}
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Share className="h-4 w-4 mr-2" />
                {locale === 'id' ? 'Bagikan' : 'Share'}
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                {locale === 'id' ? 'Tambah ke Kalender' : 'Add to Calendar'}
              </Button>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'id' ? 'Informasi Penting' : 'Important Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <p>
                  {locale === 'id'
                    ? 'Harap datang 15 menit sebelum jadwal untuk registrasi.'
                    : 'Please arrive 15 minutes early for registration.'
                  }
                </p>
              </div>

              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-green-600 mt-0.5" />
                <p>
                  {locale === 'id'
                    ? 'Bawa kartu identitas dan kartu asuransi (jika ada).'
                    : 'Bring ID card and insurance card (if applicable).'
                  }
                </p>
              </div>

              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <p>
                  {locale === 'id'
                    ? 'Hubungi klinik jika ada perubahan kondisi darurat.'
                    : 'Contact clinic if there are emergency condition changes.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onBack} disabled={!onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {locale === 'id' ? 'Kembali' : 'Back'}
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={!acceptedTerms || !acceptedCancellation || isConfirming}
              className="min-w-40"
              size="lg"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {locale === 'id' ? 'Memproses...' : 'Processing...'}
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {locale === 'id' ? 'Konfirmasi Booking' : 'Confirm Booking'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBookingConfirmation;