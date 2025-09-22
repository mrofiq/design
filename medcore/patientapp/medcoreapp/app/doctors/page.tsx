"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { DoctorDiscovery } from '@/components/doctor-search';
import { Doctor } from '@/types/doctor';

export default function DoctorsPage() {
  const router = useRouter();

  const handleBookingClick = (doctor: Doctor) => {
    // Navigate to appointment booking page
    console.log('Booking appointment with:', doctor.name);
    router.push(`/appointments/book/${doctor.id}`);
  };

  return (
    <DoctorDiscovery
      onBookingClick={handleBookingClick}
      showHeader={true}
      showQuickFilters={true}
      showPopularSpecializations={true}
    />
  );
}