"use client";

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DoctorCard } from './DoctorCard';
import { AdvancedFilters } from './AdvancedFilters';
import { FilterTags } from './FilterTags';
import { Doctor } from '@/types/doctor';
import useDoctorSearchStore from '@/stores/doctorSearchStore';

interface SearchResultsProps {
  onDoctorSelect?: (doctor: Doctor) => void;
  onBookingClick?: (doctor: Doctor) => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevansi' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'price_low', label: 'Harga Terendah' },
  { value: 'price_high', label: 'Harga Tertinggi' },
  { value: 'experience', label: 'Pengalaman' },
  { value: 'distance', label: 'Jarak Terdekat' }
];

export function SearchResults({
  onDoctorSelect,
  onBookingClick,
  className
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const {
    query,
    filters,
    results,
    isSearching,
    setFilters,
    searchDoctors,
    selectDoctor,
  } = useDoctorSearchStore();

  const handleDoctorClick = (doctor: Doctor) => {
    selectDoctor(doctor);
    onDoctorSelect?.(doctor);
  };

  const handleBookingClick = (doctor: Doctor) => {
    onBookingClick?.(doctor);
  };

  const handleRetry = () => {
    searchDoctors();
  };

  const handleSortChange = (value: string) => {
    setFilters({ sortBy: value as any });
    setPage(1);
  };

  // Loading State
  if (isSearching && !results) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No Query State
  if (!query && !results) {
    return (
      <div className={cn("text-center py-12", className)}>
        <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Cari Dokter atau Spesialis
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Mulai dengan mengetik nama dokter, spesialisasi, atau lokasi yang Anda cari
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Dokter Jantung', 'Dokter Anak', 'Spesialis Mata', 'BPJS Jakarta'].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => {
                const store = useDoctorSearchStore.getState();
                store.setQuery(suggestion);
              }}
              className="rounded-full"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // No Results State
  if (results && results.doctors.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        <FilterTags />

        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak Ada Dokter Ditemukan
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau filter yang Anda gunakan
          </p>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => useDoctorSearchStore.getState().resetFilters()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const store = useDoctorSearchStore.getState();
                  store.setQuery('');
                }}
              >
                Hapus Pencarian
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Saran pencarian:</p>
              <div className="flex flex-wrap justify-center gap-1">
                {['Dokter Umum', 'Jakarta', 'BPJS', 'Spesialis Jantung'].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const store = useDoctorSearchStore.getState();
                      store.setQuery(suggestion);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  // Calculate pagination
  const totalItems = results.doctors.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDoctors = results.doctors.slice(startIndex, endIndex);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter Tags */}
      <FilterTags />

      {/* Search Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {isSearching ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Mencari dokter...
              </div>
            ) : (
              <span>
                Menampilkan {startIndex + 1}-{Math.min(endIndex, totalItems)} dari {totalItems} dokter
                {query && (
                  <span className="font-medium"> untuk "{query}"</span>
                )}
              </span>
            )}
          </div>

          {totalItems > 0 && (
            <Badge variant="secondary" className="font-normal">
              {totalItems} hasil
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Selection */}
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-9 w-9 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-9 w-9 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <AdvancedFilters />
        </div>
      </div>

      {/* Search Results Grid/List */}
      <div
        className={cn(
          "gap-6",
          viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col space-y-4"
        )}
      >
        {currentDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onViewProfile={handleDoctorClick}
            onBookAppointment={handleBookingClick}
            variant={viewMode === 'list' ? 'detailed' : 'default'}
            className={cn(
              "hover:shadow-lg transition-shadow duration-200",
              viewMode === 'list' && "max-w-none"
            )}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Sebelumnya
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      )}

      {/* Load More for Mobile */}
      {totalPages > 1 && (
        <div className="sm:hidden">
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="w-full"
          >
            {page === totalPages ? 'Semua dokter telah dimuat' : 'Muat Lebih Banyak'}
          </Button>
        </div>
      )}
    </div>
  );
}