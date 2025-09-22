'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CalendarExport from '@/components/appointment/CalendarExport';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Download,
  Share2,
  Home,
  Star,
  Building,
  AlertTriangle,
} from 'lucide-react';
import { AppointmentBooking } from '@/types/appointment';
import { Doctor, Clinic } from '@/types/doctor';
import { allMockDoctors } from '@/data/mockDoctors';
import { mockAppointmentTypes } from '@/data/mockSchedules';
import { format, addMinutes } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function AppointmentConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const appointmentId = searchParams.get('id');

  const [appointment, setAppointment] = useState<AppointmentBooking | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load appointment data
  useEffect(() => {
    const loadAppointment = async () => {
      setLoading(true);
      try {
        if (!appointmentId) {
          setError('Appointment ID not found');
          return;
        }

        // In a real app, this would be an API call
        // For demo, we'll create a mock appointment
        const mockAppointment: AppointmentBooking = {
          id: appointmentId,
          patientId: 'patient-123',
          doctorId: 'dr-ahmad-sutanto',
          clinicId: 'rscm-jakarta',
          appointmentTypeId: 'consultation',
          scheduledDate: '2024-09-25',
          scheduledTime: '10:00',
          duration: 30,
          status: 'confirmed',
          bookingTime: new Date().toISOString(),
          price: 250000,
          paymentStatus: 'pending',
          paymentMethod: 'cash',
          notes: 'Keluhan nyeri dada ringan, ingin konsultasi preventif',
          symptoms: ['chest-pain', 'fatigue'],
          urgency: 'medium',
          isFirstVisit: true,
          remindersSent: [],
        };

        const foundDoctor = allMockDoctors.find(d => d.id === mockAppointment.doctorId);
        const foundClinic = foundDoctor?.clinics.find(c => c.id === mockAppointment.clinicId);

        if (!foundDoctor) {
          setError('Doctor not found');
          return;
        }

        setAppointment(mockAppointment);
        setDoctor(foundDoctor);
        setClinic(foundClinic);
      } catch (err) {
        setError('Failed to load appointment');
        console.error('Error loading appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentId]);

  // Get appointment type
  const appointmentType = appointment
    ? mockAppointmentTypes.find(type => type.id === appointment.appointmentTypeId)
    : null;

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
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12">
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span>Memuat konfirmasi janji temu...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !appointment || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h2 className="text-xl font-semibold mb-2">Tidak Dapat Memuat Konfirmasi</h2>
                <p className="text-muted-foreground mb-4">
                  {error || 'Data janji temu tidak ditemukan'}
                </p>
                <Button onClick={() => router.push('/appointments')}>
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h1 className="text-lg font-semibold">Booking Berhasil!</h1>
                <p className="text-sm text-muted-foreground">
                  Janji temu Anda telah dikonfirmasi
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => router.push('/appointments')}>
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Beranda</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-900">
                    Janji Temu Berhasil Dibuat!
                  </h2>
                  <p className="text-green-700 mt-1">
                    Booking ID: <span className="font-mono font-medium">#{appointment.id}</span>
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Konfirmasi telah dikirim melalui SMS dan email
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Doctor & Clinic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Detail Dokter & Klinik</span>
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
                        {doctor.specializations[0]?.nameId}
                      </p>

                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{doctor.rating.overall}</span>
                          <span className="text-sm text-muted-foreground">
                            ({doctor.rating.reviewCount} ulasan)
                          </span>
                        </div>

                        <Badge variant="secondary">
                          {doctor.experienceYears} tahun pengalaman
                        </Badge>
                      </div>
                    </div>
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
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span className="text-xs">{clinic.phone}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {clinic.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Appointment Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Jadwal Janji Temu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Appointment Type */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{appointmentType?.icon}</div>
                      <div>
                        <h4 className="font-medium">{appointmentType?.nameId}</h4>
                        <p className="text-sm text-muted-foreground">
                          {appointmentType?.descriptionId}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {appointment.duration} menit
                    </Badge>
                  </div>

                  <Separator />

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Tanggal</span>
                      </div>
                      <p className="text-lg">
                        {format(new Date(appointment.scheduledDate), 'EEEE', {
                          locale: idLocale,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.scheduledDate), 'dd MMMM yyyy', {
                          locale: idLocale,
                        })}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Waktu</span>
                      </div>
                      <p className="text-lg">
                        {formatTime(appointment.scheduledTime)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(appointment.scheduledTime)} -{' '}
                        {formatTime(
                          addMinutes(
                            new Date(`1970-01-01T${appointment.scheduledTime}`),
                            appointment.duration
                          ).toTimeString().slice(0, 5)
                        )}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Status & Payment */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Status Booking:</span>
                      <Badge variant="default" className="ml-2">
                        Dikonfirmasi
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Biaya Konsultasi</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatPrice(appointment.price)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Notes */}
              {(appointment.notes || appointment.symptoms) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Pasien</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {appointment.symptoms && appointment.symptoms.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Gejala yang Dilaporkan:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {appointment.symptoms.map((symptom, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {appointment.notes && (
                      <div>
                        <span className="text-sm font-medium">Catatan:</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    <div>
                      <span className="text-sm font-medium">Jenis Kunjungan:</span>
                      <Badge variant="outline" className="ml-2">
                        {appointment.isFirstVisit ? 'Kunjungan Pertama' : 'Kontrol'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Quick Actions */}
            <div className="space-y-6">
              {/* Calendar Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tambah ke Kalender</CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarExport
                    appointment={appointment}
                    doctor={doctor}
                    clinic={clinic}
                    locale="id"
                  />
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informasi Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge variant="secondary">
                      {appointment.paymentStatus === 'pending' ? 'Belum Bayar' : 'Lunas'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Metode:</span>
                    <span className="text-sm capitalize">
                      {appointment.paymentMethod === 'cash' ? 'Tunai' : appointment.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-sm font-bold">
                      {formatPrice(appointment.price)}
                    </span>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Pembayaran dapat dilakukan saat kedatangan di klinik
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Butuh Bantuan?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Customer Service</span>
                    </div>
                    <p className="text-sm font-medium">+62 21-1234-5678</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Email Support</span>
                    </div>
                    <p className="text-sm font-medium">support@medcore.app</p>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Hubungi Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Important Reminders */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Informasi Penting:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Harap datang 15 menit sebelum waktu janji temu</li>
                  <li>• Bawa kartu identitas dan kartu asuransi (jika ada)</li>
                  <li>• Untuk reschedule atau pembatalan, hubungi customer service minimal 2 jam sebelumnya</li>
                  <li>• Konfirmasi kedatangan akan dikirim melalui SMS 1 hari sebelum janji temu</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © 2024 MedCore Patient App. Semua hak dilindungi undang-undang.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}