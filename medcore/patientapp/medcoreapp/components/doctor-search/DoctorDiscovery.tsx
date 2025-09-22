"use client";

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Stethoscope, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DoctorSearchBar } from './DoctorSearchBar';
import { AdvancedFilters } from './AdvancedFilters';
import { SearchResults } from './SearchResults';
import { DoctorProfile } from './DoctorProfile';
import { LoadingStates } from './LoadingStates';
import { Doctor } from '@/types/doctor';
import useDoctorSearchStore from '@/stores/doctorSearchStore';
import { mockSpecializations } from '@/data/mockDoctors';

interface DoctorDiscoveryProps {
  onBookingClick?: (doctor: Doctor) => void;
  className?: string;
  initialQuery?: string;
  showHeader?: boolean;
  showQuickFilters?: boolean;
  showPopularSpecializations?: boolean;
}

export function DoctorDiscovery({
  onBookingClick,
  className,
  initialQuery = '',
  showHeader = true,
  showQuickFilters = true,
  showPopularSpecializations = true
}: DoctorDiscoveryProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const {
    query,
    results,
    isSearching,
    setQuery,
    setFilters,
    popularSearches,
    selectedDoctor: storeSelectedDoctor,
    clearSelectedDoctor
  } = useDoctorSearchStore();

  // Initialize with query if provided
  useEffect(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery);
    }
  }, [initialQuery, query, setQuery]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsProfileOpen(true);
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
    setSelectedDoctor(null);
    clearSelectedDoctor();
  };

  const handleBookingClick = (doctor: Doctor) => {
    onBookingClick?.(doctor);
  };

  const handleQuickSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const handleSpecializationClick = (specializationId: string) => {
    setFilters({ specializations: [specializationId] });
  };

  const quickFilters = [
    {
      label: 'Tersedia Hari Ini',
      action: () => setFilters({ availableToday: true }),
      icon: '🟢'
    },
    {
      label: 'Dokter Umum',
      action: () => handleSpecializationClick('general-practitioner'),
      icon: '🩺'
    },
    {
      label: 'BPJS',
      action: () => setFilters({ insuranceProviders: ['bpjs'] }),
      icon: '💳'
    },
    {
      label: 'Jakarta',
      action: () => setFilters({ locations: ['Jakarta'] }),
      icon: '📍'
    }
  ];

  return (
    <div className={cn("min-h-screen bg-gray-50/50", className)}>
      {/* Header Section */}
      {showHeader && (
        <div className="bg-white border-b">
          <div className="container max-w-6xl mx-auto px-4 py-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Temukan Dokter Terbaik
              </h1>
              <p className="text-lg text-muted-foreground">
                Cari dan booking konsultasi dengan dokter spesialis terpercaya
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6">
              <DoctorSearchBar
                value={query}
                placeholder="Cari dokter, spesialisasi, atau rumah sakit..."
                className="w-full"
              />
            </div>

            {/* Quick Filters */}
            {showQuickFilters && !query && (
              <div className="flex flex-wrap justify-center gap-3">
                {quickFilters.map((filter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={filter.action}
                    className="rounded-full border-muted hover:bg-muted/50"
                  >
                    <span className="mr-2">{filter.icon}</span>
                    {filter.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Popular Specializations - Show when no search */}
        {showPopularSpecializations && !query && !results && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Spesialisasi Populer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mockSpecializations.slice(0, 8).map((spec) => (
                    <Button
                      key={spec.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                      onClick={() => handleSpecializationClick(spec.id)}
                    >
                      <span className="text-2xl">{spec.icon}</span>
                      <span className="text-sm font-medium text-center">
                        {spec.nameId || spec.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Cards - Show when no search */}
        {!query && !results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1000+</p>
                    <p className="text-sm text-muted-foreground">Dokter Terdaftar</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">50+</p>
                    <p className="text-sm text-muted-foreground">Kota di Indonesia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">95%</p>
                    <p className="text-sm text-muted-foreground">Kepuasan Pasien</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Popular Searches - Show when no search */}
        {!query && !results && popularSearches.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Pencarian Populer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.slice(0, 8).map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSearch(search.query)}
                      className="rounded-full border-muted hover:bg-muted/50"
                    >
                      {search.query}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {search.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Results */}
        <SearchResults
          onDoctorSelect={handleDoctorSelect}
          onBookingClick={handleBookingClick}
        />

        {/* Doctor Profile Modal */}
        <DoctorProfile
          doctor={selectedDoctor || storeSelectedDoctor!}
          isOpen={isProfileOpen || !!storeSelectedDoctor}
          onClose={handleProfileClose}
          onBookAppointment={handleBookingClick}
        />
      </div>
    </div>
  );
}

// Compact version for embedding in other pages
export function DoctorDiscoveryCompact({
  onBookingClick,
  className,
  maxResults = 6
}: {
  onBookingClick?: (doctor: Doctor) => void;
  className?: string;
  maxResults?: number;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Cari Dokter</h2>
        <Button variant="outline" size="sm">
          Lihat Semua
        </Button>
      </div>

      <DoctorSearchBar
        placeholder="Cari dokter atau spesialisasi..."
        className="w-full"
      />

      <SearchResults
        onBookingClick={onBookingClick}
        className="max-h-96 overflow-y-auto"
      />
    </div>
  );
}

// Widget version for dashboard
export function DoctorSearchWidget({
  onBookingClick,
  className
}: {
  onBookingClick?: (doctor: Doctor) => void;
  className?: string;
}) {
  const { setQuery, setFilters } = useDoctorSearchStore();

  const quickActions = [
    {
      label: 'Dokter Terdekat',
      action: () => setFilters({ locationRadius: 5 }),
      icon: '📍'
    },
    {
      label: 'Tersedia Sekarang',
      action: () => setFilters({ availableToday: true }),
      icon: '🟢'
    },
    {
      label: 'BPJS',
      action: () => setFilters({ insuranceProviders: ['bpjs'] }),
      icon: '💳'
    }
  ];

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Booking Dokter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DoctorSearchBar
          placeholder="Cari dokter..."
          className="w-full"
        />

        <div className="grid grid-cols-1 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.action}
              className="justify-start"
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}