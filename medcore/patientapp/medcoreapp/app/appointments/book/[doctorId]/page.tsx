'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import AppointmentBookingFlow from '@/components/appointment/AppointmentBookingFlow';
import { Doctor } from '@/types/doctor';
import { BookingFormData } from '@/types/appointment';
import { allMockDoctors } from '@/data/mockDoctors';

export default function BookAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const doctorId = params.doctorId as string;
  const clinicId = searchParams.get('clinicId') || undefined;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load doctor data
  useEffect(() => {
    const loadDoctor = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        const foundDoctor = allMockDoctors.find(d => d.id === doctorId);

        if (!foundDoctor) {
          setError('Doctor not found');
          return;
        }

        setDoctor(foundDoctor);
      } catch (err) {
        setError('Failed to load doctor information');
        console.error('Error loading doctor:', err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      loadDoctor();
    }
  }, [doctorId]);

  // Handle booking completion
  const handleBookingComplete = async (bookingData: BookingFormData) => {
    try {
      // In a real app, this would submit to an API
      console.log('Booking completed:', { doctorId, clinicId, bookingData });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to confirmation page
      router.push(`/appointments/confirmation?id=${Date.now()}`);
    } catch (err) {
      console.error('Failed to complete booking:', err);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12">
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span>Memuat informasi dokter...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h2 className="text-xl font-semibold mb-2">Tidak Dapat Memuat Halaman</h2>
                <p className="text-muted-foreground mb-4">
                  {error || 'Dokter tidak ditemukan'}
                </p>
                <Button onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
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
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>

              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold">Booking Janji Temu</h1>
                <p className="text-sm text-muted-foreground">
                  Dengan {doctor.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{doctor.name}</p>
                <p className="text-xs text-muted-foreground">
                  {doctor.specializations[0]?.nameId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AppointmentBookingFlow
          doctor={doctor}
          clinicId={clinicId}
          onComplete={handleBookingComplete}
          onCancel={handleCancel}
          locale="id"
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Butuh bantuan? Hubungi customer service kami di{' '}
              <a href="tel:+6221-1234-5678" className="text-primary hover:underline">
                +62 21-1234-5678
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}