'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Download,
  Share,
  RefreshCw,
  X,
  Video,
  Building,
  Star,
  Stethoscope,
  FileText,
  Navigation,
  AlertCircle,
  CheckCircle,
  Info,
  Edit,
  QrCode,
  Copy,
} from 'lucide-react';
import { AppointmentBooking, AppointmentType } from '@/types/appointment';
import { Doctor } from '@/types/doctor';
import { format, addMinutes, isAfter, isBefore } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CalendarExport } from '@/components/appointment';

interface AppointmentDetailPageProps {
  params: { id: string };
}

// Mock appointment data - replace with actual API
const mockAppointmentWithDetails = {
  id: 'APT-001',
  patientId: 'patient-123',
  doctorId: 'doc-001',
  clinicId: 'clinic-001',
  appointmentTypeId: 'general',
  scheduledDate: '2024-01-17',
  scheduledTime: '09:00',
  duration: 30,
  status: 'confirmed' as const,
  bookingTime: '2024-01-15T10:30:00Z',
  price: 150000,
  paymentStatus: 'paid' as const,
  paymentMethod: 'card' as const,
  notes: 'Sakit kepala berulang sudah 3 hari, disertai mual dan pusing',
  symptoms: ['headache', 'nausea', 'dizziness'],
  urgency: 'medium' as const,
  isFirstVisit: false,
  remindersSent: [
    {
      type: 'email' as const,
      sentAt: '2024-01-16T08:00:00Z',
      scheduled: true,
    },
    {
      type: 'sms' as const,
      sentAt: '2024-01-16T20:00:00Z',
      scheduled: true,
    },
  ],
  cancellationPolicy: {
    allowedUntil: '2024-01-17T07:00:00Z',
    feePercentage: 0,
  },
  doctor: {
    id: 'doc-001',
    name: 'Dr. Sarah Wijaya, Sp.PD',
    specializations: [{ id: 'internal', name: 'Penyakit Dalam' }],
    profileImage: '/doctors/sarah.jpg',
    rating: 4.8,
    reviewCount: 124,
    experience: 8,
    clinics: [{
      id: 'clinic-001',
      name: 'RS Siloam Kebon Jeruk',
      address: 'Jl. Perjuangan No. 8, Jakarta Barat',
      phone: '+62 21 5674 8900',
      email: 'info@siloam-kebon-jeruk.com',
      distance: '2.5 km',
      operatingHours: {
        weekdays: '08:00 - 17:00',
        saturday: '08:00 - 14:00',
        sunday: 'Tutup',
      },
    }],
    languages: ['id', 'en'],
    fees: { min: 150000, max: 200000 },
    isAvailable: true,
    nextAvailable: '2024-01-18T09:00:00Z',
    email: 'sarah.wijaya@siloam.com',
    bio: 'Dokter spesialis penyakit dalam dengan pengalaman 8 tahun dalam menangani berbagai kondisi medis internal.',
  },
  appointmentType: {
    id: 'general',
    name: 'General Consultation',
    nameId: 'Konsultasi Umum',
    duration: 30,
    description: 'General medical consultation',
    descriptionId: 'Konsultasi medis umum untuk pemeriksaan dan diagnosa',
    icon: 'stethoscope',
    color: 'blue',
    price: { min: 150000, max: 200000, currency: 'IDR' as const },
    requiresPreparation: false,
    isEmergency: false,
    allowsOnline: false,
  },
};

const AppointmentDetailPage: React.FC<AppointmentDetailPageProps> = ({
  params,
}) => {
  const router = useRouter();
  const [appointment, setAppointment] = useState<typeof mockAppointmentWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [locale] = useState<'en' | 'id'>('id');

  // Load appointment data
  useEffect(() => {
    const loadAppointment = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (params.id === 'APT-001') {
          setAppointment(mockAppointmentWithDetails);
        } else {
          throw new Error('Appointment not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load appointment');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointment();
  }, [params.id]);

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
      dayName: format(dateObj, 'EEEE', { locale: idLocale }),
    };
  };

  // Get status badge
  const getStatusBadge = (status: AppointmentBooking['status']) => {
    const statusConfig = {
      pending: {
        variant: 'secondary' as const,
        text: locale === 'id' ? 'Menunggu' : 'Pending',
        icon: AlertCircle,
        color: 'text-yellow-600',
      },
      confirmed: {
        variant: 'default' as const,
        text: locale === 'id' ? 'Dikonfirmasi' : 'Confirmed',
        icon: CheckCircle,
        color: 'text-green-600',
      },
      completed: {
        variant: 'default' as const,
        text: locale === 'id' ? 'Selesai' : 'Completed',
        icon: CheckCircle,
        color: 'text-blue-600',
      },
      cancelled: {
        variant: 'destructive' as const,
        text: locale === 'id' ? 'Dibatalkan' : 'Cancelled',
        icon: X,
        color: 'text-red-600',
      },
      'no-show': {
        variant: 'destructive' as const,
        text: locale === 'id' ? 'Tidak Hadir' : 'No Show',
        icon: AlertCircle,
        color: 'text-red-600',
      },
      rescheduled: {
        variant: 'secondary' as const,
        text: locale === 'id' ? 'Dijadwal Ulang' : 'Rescheduled',
        icon: RefreshCw,
        color: 'text-orange-600',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  // Copy appointment ID
  const copyAppointmentId = () => {
    if (appointment) {
      navigator.clipboard.writeText(appointment.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check if appointment can be rescheduled/cancelled
  const canModify = () => {
    if (!appointment) return false;
    if (appointment.status !== 'confirmed') return false;

    const appointmentDateTime = new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}`);
    const now = new Date();
    const twoHoursBefore = new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000);

    return isBefore(now, twoHoursBefore);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-300 rounded-lg"></div>
                <div className="h-48 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-300 rounded-lg"></div>
                <div className="h-48 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {locale === 'id' ? 'Janji Temu Tidak Ditemukan' : 'Appointment Not Found'}
              </h2>
              <p className="text-gray-600 mb-4">
                {error || (locale === 'id' ? 'Janji temu yang Anda cari tidak ditemukan.' : 'The appointment you are looking for was not found.')}
              </p>
              <Button onClick={() => router.push('/appointments')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {locale === 'id' ? 'Kembali ke Daftar Janji Temu' : 'Back to Appointments'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { date, time, dayName } = formatDateTime(appointment.scheduledDate, appointment.scheduledTime);
  const endTime = format(addMinutes(new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}`), appointment.duration), 'HH:mm');
  const clinic = appointment.doctor.clinics[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {locale === 'id' ? 'Detail Janji Temu' : 'Appointment Details'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-600">ID: {appointment.id}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1"
                onClick={copyAppointmentId}
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {locale === 'id' ? 'Ringkasan Janji Temu' : 'Appointment Overview'}
                  </CardTitle>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={appointment.doctor.profileImage} alt={appointment.doctor.name} />
                    <AvatarFallback>
                      {appointment.doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{appointment.doctor.name}</h3>
                    <p className="text-gray-600">
                      {appointment.doctor.specializations.map(s => s.name).join(', ')}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{appointment.doctor.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{appointment.doctor.reviewCount} {locale === 'id' ? 'ulasan' : 'reviews'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="h-4 w-4" />
                        <span>{appointment.doctor.experience} {locale === 'id' ? 'tahun pengalaman' : 'years experience'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{date}</p>
                        <p className="text-sm text-gray-600">{dayName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{time} - {endTime}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.duration} {locale === 'id' ? 'menit' : 'minutes'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">
                          {locale === 'id' ? appointment.appointmentType.nameId : appointment.appointmentType.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {locale === 'id' ? appointment.appointmentType.descriptionId : appointment.appointmentType.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <p className="font-medium">{clinic.name}</p>
                        <p className="text-sm text-gray-600">{clinic.address}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
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

                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                      <div>
                        <p className="font-medium">{formatCurrency(appointment.price)}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.paymentStatus === 'paid'
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

            {/* Chief Complaint & Symptoms */}
            {appointment.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === 'id' ? 'Keluhan dan Gejala' : 'Chief Complaint & Symptoms'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">
                      {locale === 'id' ? 'Keluhan Utama' : 'Chief Complaint'}
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {appointment.notes}
                    </p>
                  </div>

                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        {locale === 'id' ? 'Gejala yang Dialami' : 'Symptoms'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {appointment.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">
                        {locale === 'id' ? 'Tingkat Urgensi:' : 'Urgency Level:'}
                      </span>
                      <Badge
                        variant={appointment.urgency === 'high' ? 'destructive' :
                                appointment.urgency === 'medium' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {appointment.urgency === 'high' ? (locale === 'id' ? 'Tinggi' : 'High') :
                         appointment.urgency === 'medium' ? (locale === 'id' ? 'Sedang' : 'Medium') :
                         (locale === 'id' ? 'Rendah' : 'Low')}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        {locale === 'id' ? 'Jenis Kunjungan:' : 'Visit Type:'}
                      </span>
                      <span className="ml-2">
                        {appointment.isFirstVisit
                          ? (locale === 'id' ? 'Kunjungan Pertama' : 'First Visit')
                          : (locale === 'id' ? 'Kunjungan Ulang' : 'Follow-up Visit')
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Doctor Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'id' ? 'Informasi Dokter' : 'Doctor Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{appointment.doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {appointment.doctor.languages.includes('id') ? 'Bahasa Indonesia' : ''}
                        {appointment.doctor.languages.includes('id') && appointment.doctor.languages.includes('en') ? ', ' : ''}
                        {appointment.doctor.languages.includes('en') ? 'English' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-600">
                        {locale === 'id' ? 'Biaya Konsultasi:' : 'Consultation Fee:'}
                      </span>
                      <span className="ml-2">
                        {formatCurrency(appointment.doctor.fees.min)} - {formatCurrency(appointment.doctor.fees.max)}
                      </span>
                    </div>
                  </div>
                </div>

                {appointment.doctor.bio && (
                  <div>
                    <h4 className="font-medium mb-2">
                      {locale === 'id' ? 'Profil Dokter' : 'Doctor Profile'}
                    </h4>
                    <p className="text-sm text-gray-700">{appointment.doctor.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'id' ? 'Aksi Cepat' : 'Quick Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canModify() && appointment.status === 'confirmed' && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push(`/appointments?action=book&reschedule=${appointment.id}`)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {locale === 'id' ? 'Reschedule' : 'Reschedule'}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push(`/appointments?action=manage&cancel=${appointment.id}`)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {locale === 'id' ? 'Batalkan' : 'Cancel'}
                    </Button>

                    <Separator />
                  </>
                )}

                <CalendarExport
                  appointment={{
                    title: `${locale === 'id' ? 'Konsultasi dengan' : 'Consultation with'} ${appointment.doctor.name}`,
                    description: `${appointment.notes || ''}\n\n${locale === 'id' ? 'Lokasi:' : 'Location:'} ${clinic.name}\n${clinic.address}`,
                    startTime: new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}`).toISOString(),
                    endTime: addMinutes(new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}`), appointment.duration).toISOString(),
                    location: `${clinic.name}, ${clinic.address}`,
                    attendees: [appointment.doctor.email],
                    reminders: [
                      { method: 'popup', minutes: 60 },
                      { method: 'popup', minutes: 15 },
                    ],
                  }}
                  locale={locale}
                />

                <Button variant="outline" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  {locale === 'id' ? 'Bagikan' : 'Share'}
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  {locale === 'id' ? 'Unduh PDF' : 'Download PDF'}
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Navigation className="h-4 w-4 mr-2" />
                  {locale === 'id' ? 'Petunjuk Arah' : 'Directions'}
                </Button>
              </CardContent>
            </Card>

            {/* Clinic Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'id' ? 'Informasi Klinik' : 'Clinic Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>{clinic.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span>{clinic.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>{clinic.address}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    {locale === 'id' ? 'Jam Operasional' : 'Operating Hours'}
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>{locale === 'id' ? 'Senin - Jumat:' : 'Monday - Friday:'}</span>
                      <span>{clinic.operatingHours?.weekdays || '08:00 - 17:00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{locale === 'id' ? 'Sabtu:' : 'Saturday:'}</span>
                      <span>{clinic.operatingHours?.saturday || '08:00 - 14:00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{locale === 'id' ? 'Minggu:' : 'Sunday:'}</span>
                      <span>{clinic.operatingHours?.sunday || 'Tutup'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reminders */}
            {appointment.remindersSent.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    {locale === 'id' ? 'Pengingat Terkirim' : 'Reminders Sent'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {appointment.remindersSent.map((reminder, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="capitalize">{reminder.type}</span>
                        <span className="text-gray-600">
                          {format(new Date(reminder.sentAt), 'dd MMM HH:mm', { locale: idLocale })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;