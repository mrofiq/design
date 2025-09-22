'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Download,
  Share,
  Home,
  ArrowRight,
  QrCode,
  Copy,
  ExternalLink,
  Bell,
  MessageSquare,
  Video,
  Building,
  FileText,
  CreditCard,
  Shield,
  Smartphone,
  Printer,
  Info,
  AlertTriangle,
  Star,
  Navigation,
  Car,
  Bus,
  Motorcycle,
} from 'lucide-react';
import { AppointmentBooking } from '@/types/appointment';
import { Doctor, Clinic } from '@/types/doctor';
import { format, addMinutes, differenceInDays, differenceInHours } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import CalendarExport from './CalendarExport';

interface BookingSuccessProps {
  booking: AppointmentBooking;
  doctor: Doctor;
  clinic?: Clinic;
  onGoHome: () => void;
  onViewBookings: () => void;
  onAddReminder?: () => void;
  locale?: 'en' | 'id';
  className?: string;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  booking,
  doctor,
  clinic,
  onGoHome,
  onViewBookings,
  onAddReminder,
  locale = 'id',
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

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
    const appointmentDate = new Date(`${date}T${time}`);
    return {
      date: format(appointmentDate, 'EEEE, dd MMMM yyyy', { locale: idLocale }),
      time: format(appointmentDate, 'HH:mm'),
      day: format(appointmentDate, 'EEEE', { locale: idLocale }),
    };
  };

  // Get time until appointment
  const getTimeUntilAppointment = () => {
    const appointmentDateTime = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`);
    const now = new Date();

    const days = differenceInDays(appointmentDateTime, now);
    const hours = differenceInHours(appointmentDateTime, now) % 24;

    if (days > 0) {
      return {
        value: days,
        unit: locale === 'id' ? 'hari' : 'days',
        urgent: days <= 1,
      };
    } else if (hours > 0) {
      return {
        value: hours,
        unit: locale === 'id' ? 'jam' : 'hours',
        urgent: hours <= 2,
      };
    } else {
      return {
        value: 0,
        unit: locale === 'id' ? 'segera' : 'soon',
        urgent: true,
      };
    }
  };

  // Copy booking ID
  const copyBookingId = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR code data
  const generateQRData = () => {
    return JSON.stringify({
      bookingId: booking.id,
      patientId: booking.patientId,
      doctorId: booking.doctorId,
      date: booking.scheduledDate,
      time: booking.scheduledTime,
      clinic: clinic?.name,
    });
  };

  const { date, time, day } = formatDateTime(booking.scheduledDate, booking.scheduledTime);
  const timeUntil = getTimeUntilAppointment();

  // Preparation checklist items
  const preparationItems = [
    {
      id: 'documents',
      title: locale === 'id' ? 'Siapkan Dokumen' : 'Prepare Documents',
      description: locale === 'id'
        ? 'KTP, kartu asuransi, dan rujukan (jika ada)'
        : 'ID card, insurance card, and referral (if any)',
      icon: FileText,
      completed: false,
    },
    {
      id: 'arrival',
      title: locale === 'id' ? 'Datang Tepat Waktu' : 'Arrive On Time',
      description: locale === 'id'
        ? 'Hadir 15 menit sebelum jadwal'
        : 'Arrive 15 minutes before schedule',
      icon: Clock,
      completed: false,
    },
    {
      id: 'payment',
      title: locale === 'id' ? 'Siapkan Pembayaran' : 'Prepare Payment',
      description: locale === 'id'
        ? 'Uang tunai atau kartu untuk pembayaran'
        : 'Cash or card for payment',
      icon: CreditCard,
      completed: false,
    },
    {
      id: 'questions',
      title: locale === 'id' ? 'Siapkan Pertanyaan' : 'Prepare Questions',
      description: locale === 'id'
        ? 'List keluhan dan pertanyaan untuk dokter'
        : 'List complaints and questions for doctor',
      icon: MessageSquare,
      completed: false,
    },
  ];

  return (
    <div className={cn('w-full max-w-4xl mx-auto space-y-6', className)}>
      {/* Success Header */}
      <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-800">
                {locale === 'id' ? 'Booking Berhasil!' : 'Booking Successful!'}
              </h1>
              <p className="text-green-700">
                {locale === 'id'
                  ? 'Janji temu Anda telah dikonfirmasi'
                  : 'Your appointment has been confirmed'
                }
              </p>
            </div>

            <Badge className="bg-green-600 text-white px-4 py-2">
              {locale === 'id' ? 'ID Booking:' : 'Booking ID:'} {booking.id}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-2 text-white hover:text-green-100"
                onClick={copyBookingId}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {locale === 'id' ? 'Ringkasan Janji Temu' : 'Appointment Summary'}
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
                      <User className="h-4 w-4" />
                      <span>{doctor.reviewCount} {locale === 'id' ? 'ulasan' : 'reviews'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{date}</p>
                      <p className="text-sm text-gray-600">{day}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">{time}</p>
                      <p className="text-sm text-gray-600">
                        {booking.duration} {locale === 'id' ? 'menit' : 'minutes'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {clinic && (
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <p className="font-medium">{clinic.name}</p>
                        <p className="text-sm text-gray-600">{clinic.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">{formatCurrency(booking.price)}</p>
                      <p className="text-sm text-gray-600">
                        {booking.paymentStatus === 'paid'
                          ? (locale === 'id' ? 'Sudah dibayar' : 'Paid')
                          : (locale === 'id' ? 'Belum dibayar' : 'Pending payment')
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Countdown Timer */}
          <Card className={cn(
            'border-2',
            timeUntil.urgent ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'
          )}>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className={cn(
                    'h-6 w-6',
                    timeUntil.urgent ? 'text-orange-600' : 'text-blue-600'
                  )} />
                  <h3 className="text-lg font-semibold">
                    {locale === 'id' ? 'Waktu Tersisa' : 'Time Remaining'}
                  </h3>
                </div>

                <div className="text-3xl font-bold">
                  <span className={cn(
                    timeUntil.urgent ? 'text-orange-600' : 'text-blue-600'
                  )}>
                    {timeUntil.value} {timeUntil.unit}
                  </span>
                </div>

                {timeUntil.urgent && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-700">
                      {locale === 'id'
                        ? 'Janji temu Anda sudah dekat. Pastikan Anda sudah siap!'
                        : 'Your appointment is coming soon. Make sure you are ready!'
                      }
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preparation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {locale === 'id' ? 'Checklist Persiapan' : 'Preparation Checklist'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {preparationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        className="rounded border-gray-300"
                      />
                    </div>
                    <Icon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                {locale === 'id' ? 'Aksi Cepat' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CalendarExport
                  appointment={{
                    title: `${locale === 'id' ? 'Konsultasi dengan' : 'Consultation with'} ${doctor.name}`,
                    description: `${booking.notes || ''}\n\n${locale === 'id' ? 'Lokasi:' : 'Location:'} ${clinic?.name}\n${clinic?.address}`,
                    startTime: new Date(`${booking.scheduledDate}T${booking.scheduledTime}`).toISOString(),
                    endTime: addMinutes(new Date(`${booking.scheduledDate}T${booking.scheduledTime}`), booking.duration).toISOString(),
                    location: `${clinic?.name}, ${clinic?.address}`,
                    attendees: [doctor.email || ''],
                    reminders: [
                      { method: 'popup', minutes: 60 },
                      { method: 'popup', minutes: 15 },
                    ],
                  }}
                  locale={locale}
                />

                <Button variant="outline" className="justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  {locale === 'id' ? 'Bagikan' : 'Share'}
                </Button>

                <Button variant="outline" className="justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  {locale === 'id' ? 'Unduh PDF' : 'Download PDF'}
                </Button>

                <Button variant="outline" className="justify-start" onClick={() => setShowQR(!showQR)}>
                  <QrCode className="h-4 w-4 mr-2" />
                  {locale === 'id' ? 'QR Code' : 'QR Code'}
                </Button>

                {onAddReminder && (
                  <Button variant="outline" className="justify-start" onClick={onAddReminder}>
                    <Bell className="h-4 w-4 mr-2" />
                    {locale === 'id' ? 'Atur Reminder' : 'Set Reminder'}
                  </Button>
                )}

                <Button variant="outline" className="justify-start">
                  <Navigation className="h-4 w-4 mr-2" />
                  {locale === 'id' ? 'Petunjuk Arah' : 'Directions'}
                </Button>
              </div>

              {showQR && (
                <div className="mt-4 p-4 border rounded-lg text-center">
                  <h4 className="font-medium mb-2">
                    {locale === 'id' ? 'QR Code Booking' : 'Booking QR Code'}
                  </h4>
                  <div className="inline-block p-4 bg-white border rounded-lg">
                    {/* Placeholder for QR code - in real implementation, use a QR code library */}
                    <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded">
                      <QrCode className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    {locale === 'id'
                      ? 'Tunjukkan QR code ini saat check-in'
                      : 'Show this QR code during check-in'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          {clinic && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'id' ? 'Informasi Kontak' : 'Contact Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{clinic.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{clinic.email || 'info@clinic.com'}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                  <span className="text-sm">{clinic.address}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    {locale === 'id' ? 'Jam Operasional' : 'Operating Hours'}
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>{locale === 'id' ? 'Senin - Jumat' : 'Monday - Friday'}</span>
                      <span>08:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{locale === 'id' ? 'Sabtu' : 'Saturday'}</span>
                      <span>08:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{locale === 'id' ? 'Minggu' : 'Sunday'}</span>
                      <span>{locale === 'id' ? 'Tutup' : 'Closed'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transportation Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {locale === 'id' ? 'Opsi Transportasi' : 'Transportation Options'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Car className="h-4 w-4 mr-2" />
                {locale === 'id' ? 'Mobil Pribadi' : 'Private Car'}
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Motorcycle className="h-4 w-4 mr-2" />
                {locale === 'id' ? 'Ojek Online' : 'Online Motorcycle'}
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Bus className="h-4 w-4 mr-2" />
                {locale === 'id' ? 'Transportasi Umum' : 'Public Transport'}
              </Button>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                {locale === 'id' ? 'Catatan Penting' : 'Important Notes'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <p>
                  {locale === 'id'
                    ? 'Pembatalan dapat dilakukan hingga 2 jam sebelum jadwal.'
                    : 'Cancellation allowed up to 2 hours before schedule.'
                  }
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                <p>
                  {locale === 'id'
                    ? 'Protokol kesehatan tetap diterapkan di klinik.'
                    : 'Health protocols are still enforced at the clinic.'
                  }
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <p>
                  {locale === 'id'
                    ? 'Keterlambatan lebih dari 15 menit dapat mempengaruhi jadwal.'
                    : 'Lateness of more than 15 minutes may affect schedule.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={onViewBookings} className="flex-1 sm:flex-none">
              <Calendar className="h-4 w-4 mr-2" />
              {locale === 'id' ? 'Lihat Semua Booking' : 'View All Bookings'}
            </Button>

            <Button onClick={onGoHome} className="flex-1 sm:flex-none">
              <Home className="h-4 w-4 mr-2" />
              {locale === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccess;