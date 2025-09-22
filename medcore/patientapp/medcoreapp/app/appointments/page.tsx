'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Plus,
  User,
  Clock,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Stethoscope,
} from 'lucide-react';

// Import appointment components
import {
  EnhancedAppointmentBookingFlow,
  BookingManagement,
  RescheduleDialog,
  CancelAppointmentDialog,
} from '@/components/appointment';

// Import stores and types
import { useAppointmentBookingStore } from '@/stores/appointmentBookingStore';
import { AppointmentBooking, TimeSlot } from '@/types/appointment';
import { Doctor } from '@/types/doctor';

// Mock authentication - replace with actual auth
const mockAuthUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+62812345678',
  isAuthenticated: true,
};

interface AppointmentsPageProps {
  locale?: 'en' | 'id';
}

const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  locale = 'id',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query parameters
  const action = searchParams?.get('action') || 'manage'; // 'book', 'manage'
  const doctorId = searchParams?.get('doctorId');
  const clinicId = searchParams?.get('clinicId');

  // Local state
  const [activeTab, setActiveTab] = useState(action);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AppointmentBooking | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store
  const { resetFlow } = useAppointmentBookingStore();

  // Check authentication
  useEffect(() => {
    if (!mockAuthUser.isAuthenticated) {
      router.push('/auth/login?redirect=/appointments');
      return;
    }
  }, [router]);

  // Load doctor data if doctorId is provided
  useEffect(() => {
    if (doctorId && action === 'book') {
      // Mock doctor loading - replace with actual API call
      const mockDoctor: Doctor = {
        id: doctorId,
        name: 'Dr. Sarah Wijaya, Sp.PD',
        specializations: [{ id: 'internal', name: 'Penyakit Dalam' }],
        profileImage: '/doctors/sarah.jpg',
        rating: 4.8,
        reviewCount: 124,
        experience: 8,
        clinics: [{
          id: clinicId || 'clinic-001',
          name: 'RS Siloam Kebon Jeruk',
          address: 'Jl. Perjuangan No. 8, Jakarta Barat',
          phone: '+62 21 5674 8900',
          email: 'info@siloam-kebon-jeruk.com',
          distance: '2.5 km',
        }],
        languages: ['id', 'en'],
        fees: { min: 150000, max: 200000 },
        isAvailable: true,
        nextAvailable: '2024-01-15T09:00:00Z',
        email: 'sarah.wijaya@siloam.com',
      };

      setSelectedDoctor(mockDoctor);
    }
  }, [doctorId, clinicId, action]);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setError(null);

    // Update URL without page reload
    const params = new URLSearchParams(searchParams?.toString());
    params.set('action', tab);
    router.replace(`/appointments?${params.toString()}`);
  };

  // Handle booking completion
  const handleBookingComplete = () => {
    setActiveTab('manage');
    const params = new URLSearchParams(searchParams?.toString());
    params.set('action', 'manage');
    router.replace(`/appointments?${params.toString()}`);
  };

  // Handle booking cancellation
  const handleBookingCancel = () => {
    router.push('/dashboard');
  };

  // Handle reschedule request
  const handleRescheduleRequest = (booking: AppointmentBooking) => {
    setSelectedBooking(booking);

    // Find doctor for this booking - in real app, fetch from API
    const mockDoctor: Doctor = {
      id: booking.doctorId,
      name: 'Dr. Sarah Wijaya, Sp.PD',
      specializations: [{ id: 'internal', name: 'Penyakit Dalam' }],
      profileImage: '/doctors/sarah.jpg',
      rating: 4.8,
      reviewCount: 124,
      experience: 8,
      clinics: [{
        id: booking.clinicId,
        name: 'RS Siloam Kebon Jeruk',
        address: 'Jl. Perjuangan No. 8, Jakarta Barat',
        phone: '+62 21 5674 8900',
        email: 'info@siloam-kebon-jeruk.com',
        distance: '2.5 km',
      }],
      languages: ['id', 'en'],
      fees: { min: 150000, max: 200000 },
      isAvailable: true,
      nextAvailable: '2024-01-15T09:00:00Z',
      email: 'sarah.wijaya@siloam.com',
    };

    setSelectedDoctor(mockDoctor);
    setShowRescheduleDialog(true);
  };

  // Handle cancel request
  const handleCancelRequest = (booking: AppointmentBooking) => {
    setSelectedBooking(booking);

    // Find doctor for this booking
    const mockDoctor: Doctor = {
      id: booking.doctorId,
      name: 'Dr. Sarah Wijaya, Sp.PD',
      specializations: [{ id: 'internal', name: 'Penyakit Dalam' }],
      profileImage: '/doctors/sarah.jpg',
      rating: 4.8,
      reviewCount: 124,
      experience: 8,
      clinics: [{
        id: booking.clinicId,
        name: 'RS Siloam Kebon Jeruk',
        address: 'Jl. Perjuangan No. 8, Jakarta Barat',
        phone: '+62 21 5674 8900',
        email: 'info@siloam-kebon-jeruk.com',
        distance: '2.5 km',
      }],
      languages: ['id', 'en'],
      fees: { min: 150000, max: 200000 },
      isAvailable: true,
      nextAvailable: '2024-01-15T09:00:00Z',
      email: 'sarah.wijaya@siloam.com',
    };

    setSelectedDoctor(mockDoctor);
    setShowCancelDialog(true);
  };

  // Handle view booking details
  const handleViewDetails = (booking: AppointmentBooking) => {
    router.push(`/appointments/${booking.id}`);
  };

  // Handle start new booking
  const handleStartNewBooking = () => {
    resetFlow();
    setActiveTab('book');
    const params = new URLSearchParams();
    params.set('action', 'book');
    router.replace(`/appointments?${params.toString()}`);
  };

  // Handle reschedule confirmation
  const handleRescheduleConfirm = async (newDate: string, newTimeSlot: TimeSlot) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual reschedule API
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Rescheduling appointment:', {
        bookingId: selectedBooking?.id,
        newDate,
        newTimeSlot,
      });

      // Success
      setShowRescheduleDialog(false);
      setSelectedBooking(null);
      setSelectedDoctor(null);

      // Show success message or refresh bookings
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reschedule appointment');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirm = async (reason: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual cancel API
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Cancelling appointment:', {
        bookingId: selectedBooking?.id,
        reason,
      });

      // Success
      setShowCancelDialog(false);
      setSelectedBooking(null);
      setSelectedDoctor(null);

      // Show success message or refresh bookings
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mockAuthUser.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-300 rounded mx-auto mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {locale === 'id' ? 'Janji Temu' : 'Appointments'}
          </h1>
          <p className="text-gray-600">
            {locale === 'id'
              ? 'Kelola janji temu kesehatan Anda dengan mudah'
              : 'Manage your healthcare appointments easily'
            }
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {locale === 'id' ? 'Kelola Janji Temu' : 'Manage Appointments'}
            </TabsTrigger>
            <TabsTrigger value="book" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {locale === 'id' ? 'Buat Janji Baru' : 'Book New Appointment'}
            </TabsTrigger>
          </TabsList>

          {/* Manage Appointments Tab */}
          <TabsContent value="manage" className="mt-6">
            <BookingManagement
              onReschedule={handleRescheduleRequest}
              onCancel={handleCancelRequest}
              onViewDetails={handleViewDetails}
              onBookNew={handleStartNewBooking}
              locale={locale}
            />
          </TabsContent>

          {/* Book New Appointment Tab */}
          <TabsContent value="book" className="mt-6">
            <EnhancedAppointmentBookingFlow
              doctor={selectedDoctor}
              clinicId={clinicId}
              initialStep={selectedDoctor ? 'appointment-type' : 'doctor-selection'}
              onComplete={handleBookingComplete}
              onCancel={handleBookingCancel}
              locale={locale}
            />
          </TabsContent>
        </Tabs>

        {/* Reschedule Dialog */}
        {showRescheduleDialog && selectedBooking && selectedDoctor && (
          <RescheduleDialog
            open={showRescheduleDialog}
            onOpenChange={setShowRescheduleDialog}
            booking={selectedBooking}
            doctor={selectedDoctor}
            onConfirm={handleRescheduleConfirm}
            locale={locale}
          />
        )}

        {/* Cancel Dialog */}
        {showCancelDialog && selectedBooking && selectedDoctor && (
          <CancelAppointmentDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
            booking={selectedBooking}
            doctor={selectedDoctor}
            onConfirm={handleCancelConfirm}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;