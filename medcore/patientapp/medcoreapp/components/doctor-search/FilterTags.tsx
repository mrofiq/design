"use client";

import React from 'react';
import { X, MapPin, Star, Banknote, Calendar, Stethoscope, Globe, CreditCard, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useDoctorSearchStore from '@/stores/doctorSearchStore';
import {
  mockSpecializations,
  mockLanguages,
  mockInsuranceProviders
} from '@/data/mockDoctors';

interface FilterTagsProps {
  className?: string;
}

const CLINIC_TYPES = [
  { id: 'hospital', name: 'Rumah Sakit', nameId: 'Rumah Sakit' },
  { id: 'clinic', name: 'Klinik', nameId: 'Klinik' },
  { id: 'practice', name: 'Praktek Pribadi', nameId: 'Praktek Pribadi' }
];

export function FilterTags({ className }: FilterTagsProps) {
  const { filters, setFilters, resetFilters } = useDoctorSearchStore();

  const hasActiveFilters = () => {
    return (
      (filters.specializations && filters.specializations.length > 0) ||
      (filters.locations && filters.locations.length > 0) ||
      (filters.languages && filters.languages.length > 0) ||
      (filters.insuranceProviders && filters.insuranceProviders.length > 0) ||
      (filters.clinicType && filters.clinicType.length > 0) ||
      filters.minRating ||
      filters.priceRange ||
      filters.availableToday ||
      filters.availableThisWeek ||
      filters.acceptingNewPatients
    );
  };

  if (!hasActiveFilters()) {
    return null;
  }

  const removeSpecialization = (specId: string) => {
    const updated = filters.specializations?.filter(id => id !== specId) || [];
    setFilters({ specializations: updated });
  };

  const removeLocation = (city: string) => {
    const updated = filters.locations?.filter(c => c !== city) || [];
    setFilters({ locations: updated });
  };

  const removeLanguage = (langCode: string) => {
    const updated = filters.languages?.filter(code => code !== langCode) || [];
    setFilters({ languages: updated });
  };

  const removeInsurance = (insuranceId: string) => {
    const updated = filters.insuranceProviders?.filter(id => id !== insuranceId) || [];
    setFilters({ insuranceProviders: updated });
  };

  const removeClinicType = (type: string) => {
    const updated = filters.clinicType?.filter(t => t !== type) || [];
    setFilters({ clinicType: updated });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}jt`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}rb`;
    }
    return price.toString();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Filter Aktif</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Hapus Semua
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Specializations */}
        {filters.specializations?.map((specId) => {
          const spec = mockSpecializations.find(s => s.id === specId);
          return (
            <Badge
              key={specId}
              variant="secondary"
              className="flex items-center gap-1 pr-1 bg-blue-50 text-blue-800 border-blue-200"
            >
              <Stethoscope className="h-3 w-3" />
              <span className="flex items-center gap-1">
                {spec?.icon && <span>{spec.icon}</span>}
                {spec?.nameId || spec?.name || specId}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSpecialization(specId)}
                className="h-4 w-4 p-0 hover:bg-blue-200 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}

        {/* Locations */}
        {filters.locations?.map((city) => (
          <Badge
            key={city}
            variant="secondary"
            className="flex items-center gap-1 pr-1 bg-green-50 text-green-800 border-green-200"
          >
            <MapPin className="h-3 w-3" />
            {city}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeLocation(city)}
              className="h-4 w-4 p-0 hover:bg-green-200 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {/* Languages */}
        {filters.languages?.map((langCode) => {
          const lang = mockLanguages.find(l => l.code === langCode);
          return (
            <Badge
              key={langCode}
              variant="secondary"
              className="flex items-center gap-1 pr-1 bg-purple-50 text-purple-800 border-purple-200"
            >
              <Globe className="h-3 w-3" />
              {lang?.nativeName || lang?.name || langCode}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(langCode)}
                className="h-4 w-4 p-0 hover:bg-purple-200 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}

        {/* Insurance Providers */}
        {filters.insuranceProviders?.map((insuranceId) => {
          const insurance = mockInsuranceProviders.find(i => i.id === insuranceId);
          return (
            <Badge
              key={insuranceId}
              variant="secondary"
              className="flex items-center gap-1 pr-1 bg-orange-50 text-orange-800 border-orange-200"
            >
              <CreditCard className="h-3 w-3" />
              {insurance?.name || insuranceId}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeInsurance(insuranceId)}
                className="h-4 w-4 p-0 hover:bg-orange-200 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}

        {/* Clinic Types */}
        {filters.clinicType?.map((type) => {
          const clinicType = CLINIC_TYPES.find(ct => ct.id === type);
          return (
            <Badge
              key={type}
              variant="secondary"
              className="flex items-center gap-1 pr-1 bg-indigo-50 text-indigo-800 border-indigo-200"
            >
              <Building2 className="h-3 w-3" />
              {clinicType?.nameId || type}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeClinicType(type)}
                className="h-4 w-4 p-0 hover:bg-indigo-200 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}

        {/* Rating Filter */}
        {filters.minRating && filters.minRating > 0 && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 pr-1 bg-yellow-50 text-yellow-800 border-yellow-200"
          >
            <Star className="h-3 w-3" />
            Rating ≥ {filters.minRating.toFixed(1)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ minRating: undefined })}
              className="h-4 w-4 p-0 hover:bg-yellow-200 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {/* Price Range Filter */}
        {filters.priceRange && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 pr-1 bg-emerald-50 text-emerald-800 border-emerald-200"
          >
            <Banknote className="h-3 w-3" />
            Rp {formatPrice(filters.priceRange.min)} - {formatPrice(filters.priceRange.max)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ priceRange: undefined })}
              className="h-4 w-4 p-0 hover:bg-emerald-200 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {/* Quick Filters */}
        {filters.availableToday && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 pr-1 bg-green-50 text-green-800 border-green-200"
          >
            <Calendar className="h-3 w-3" />
            Tersedia Hari Ini
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ availableToday: false })}
              className="h-4 w-4 p-0 hover:bg-green-200 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {filters.availableThisWeek && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 pr-1 bg-blue-50 text-blue-800 border-blue-200"
          >
            <Calendar className="h-3 w-3" />
            Tersedia Minggu Ini
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ availableThisWeek: false })}
              className="h-4 w-4 p-0 hover:bg-blue-200 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {filters.acceptingNewPatients && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 pr-1 bg-teal-50 text-teal-800 border-teal-200"
          >
            <Calendar className="h-3 w-3" />
            Menerima Pasien Baru
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ acceptingNewPatients: false })}
              className="h-4 w-4 p-0 hover:bg-teal-200 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {/* Location Radius */}
        {filters.locationRadius && filters.locationRadius !== 10 && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 pr-1 bg-gray-50 text-gray-800 border-gray-200"
          >
            <MapPin className="h-3 w-3" />
            Radius {filters.locationRadius} km
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ locationRadius: 10 })}
              className="h-4 w-4 p-0 hover:bg-gray-200 ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
}