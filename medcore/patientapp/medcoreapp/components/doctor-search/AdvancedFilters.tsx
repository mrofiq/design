"use client";

import React, { useState } from 'react';
import {
  Filter,
  X,
  MapPin,
  Star,
  Banknote,
  Calendar,
  Stethoscope,
  Building2,
  Globe,
  CreditCard,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SearchFilters } from '@/types/doctor';
import useDoctorSearchStore from '@/stores/doctorSearchStore';
import {
  mockSpecializations,
  mockLanguages,
  mockInsuranceProviders
} from '@/data/mockDoctors';

interface AdvancedFiltersProps {
  className?: string;
  trigger?: React.ReactNode;
}

const INDONESIAN_CITIES = [
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Medan',
  'Bekasi',
  'Tangerang',
  'Depok',
  'Semarang',
  'Palembang',
  'Makassar',
  'Batam',
  'Bogor',
  'Pekanbaru',
  'Bandar Lampung',
  'Malang'
];

const CLINIC_TYPES = [
  { id: 'hospital', name: 'Rumah Sakit', nameId: 'Rumah Sakit' },
  { id: 'clinic', name: 'Klinik', nameId: 'Klinik' },
  { id: 'practice', name: 'Praktek Pribadi', nameId: 'Praktek Pribadi' }
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevansi' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'price_low', label: 'Harga Terendah' },
  { value: 'price_high', label: 'Harga Tertinggi' },
  { value: 'experience', label: 'Pengalaman' },
  { value: 'distance', label: 'Jarak Terdekat' }
];

export function AdvancedFilters({ className, trigger }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    filters,
    setFilters,
    resetFilters,
    getAvailableFilters,
    results
  } = useDoctorSearchStore();

  const availableFilters = getAvailableFilters();
  const activeFilterCount = Object.values(filters).filter(value =>
    Array.isArray(value) ? value.length > 0 :
    value !== undefined && value !== '' && value !== false
  ).length - 1; // Subtract 1 for sortBy which is always present

  const handleSpecializationChange = (specializationId: string, checked: boolean) => {
    const current = filters.specializations || [];
    const updated = checked
      ? [...current, specializationId]
      : current.filter(id => id !== specializationId);

    setFilters({ specializations: updated });
  };

  const handleLocationChange = (city: string, checked: boolean) => {
    const current = filters.locations || [];
    const updated = checked
      ? [...current, city]
      : current.filter(c => c !== city);

    setFilters({ locations: updated });
  };

  const handleLanguageChange = (langCode: string, checked: boolean) => {
    const current = filters.languages || [];
    const updated = checked
      ? [...current, langCode]
      : current.filter(code => code !== langCode);

    setFilters({ languages: updated });
  };

  const handleInsuranceChange = (insuranceId: string, checked: boolean) => {
    const current = filters.insuranceProviders || [];
    const updated = checked
      ? [...current, insuranceId]
      : current.filter(id => id !== insuranceId);

    setFilters({ insuranceProviders: updated });
  };

  const handleClinicTypeChange = (type: string, checked: boolean) => {
    const current = filters.clinicType || [];
    const updated = checked
      ? [...current, type]
      : current.filter(t => t !== type);

    setFilters({ clinicType: updated });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters({
      priceRange: {
        min: value[0],
        max: value[1]
      }
    });
  };

  const handleRatingChange = (value: number[]) => {
    setFilters({ minRating: value[0] });
  };

  const handleLocationRadiusChange = (value: number[]) => {
    setFilters({ locationRadius: value[0] });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}jt`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}rb`;
    }
    return price.toString();
  };

  const handleReset = () => {
    resetFilters();
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className={cn("relative", className)}
    >
      <Filter className="h-4 w-4 mr-2" />
      Filter
      {activeFilterCount > 0 && (
        <Badge
          variant="destructive"
          className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || defaultTrigger}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Pencarian
          </SheetTitle>
          <SheetDescription>
            Sesuaikan pencarian untuk menemukan dokter yang tepat
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Urutkan Berdasarkan
            </Label>
            <RadioGroup
              value={filters.sortBy}
              onValueChange={(value) => setFilters({ sortBy: value as any })}
              className="grid grid-cols-2 gap-2"
            >
              {SORT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Accordion type="multiple" defaultValue={["specializations", "quick-filters"]} className="w-full">
            {/* Quick Filters */}
            <AccordionItem value="quick-filters">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Filter Cepat
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="available-today" className="text-sm">
                    Tersedia Hari Ini
                  </Label>
                  <Switch
                    id="available-today"
                    checked={filters.availableToday || false}
                    onCheckedChange={(checked) => setFilters({ availableToday: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="available-week" className="text-sm">
                    Tersedia Minggu Ini
                  </Label>
                  <Switch
                    id="available-week"
                    checked={filters.availableThisWeek || false}
                    onCheckedChange={(checked) => setFilters({ availableThisWeek: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="new-patients" className="text-sm">
                    Menerima Pasien Baru
                  </Label>
                  <Switch
                    id="new-patients"
                    checked={filters.acceptingNewPatients || false}
                    onCheckedChange={(checked) => setFilters({ acceptingNewPatients: checked })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Specializations */}
            <AccordionItem value="specializations">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Spesialisasi
                  {(filters.specializations?.length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.specializations?.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {mockSpecializations.map((spec) => {
                    const isSelected = filters.specializations?.includes(spec.id) || false;
                    const count = availableFilters.specializations.find(f => f.id === spec.id)?.count || 0;

                    return (
                      <div key={spec.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`spec-${spec.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSpecializationChange(spec.id, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`spec-${spec.id}`}
                          className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span>{spec.icon}</span>
                            {spec.nameId || spec.name}
                          </span>
                          {count > 0 && (
                            <span className="text-xs text-muted-foreground">({count})</span>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Location */}
            <AccordionItem value="location">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Lokasi
                  {(filters.locations?.length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.locations?.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Radius Pencarian</Label>
                  <div className="px-2">
                    <Slider
                      value={[filters.locationRadius || 10]}
                      onValueChange={handleLocationRadiusChange}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 km</span>
                      <span>{filters.locationRadius || 10} km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Kota</Label>
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {INDONESIAN_CITIES.map((city) => {
                      const isSelected = filters.locations?.includes(city) || false;
                      const count = availableFilters.locations.find(l => l.city === city)?.count || 0;

                      return (
                        <div key={city} className="flex items-center space-x-2">
                          <Checkbox
                            id={`city-${city}`}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleLocationChange(city, checked as boolean)
                            }
                          />
                          <Label
                            htmlFor={`city-${city}`}
                            className="flex-1 text-sm cursor-pointer flex items-center justify-between"
                          >
                            {city}
                            {count > 0 && (
                              <span className="text-xs text-muted-foreground">({count})</span>
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Rating & Price */}
            <AccordionItem value="rating-price">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Rating & Harga
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-2">
                {/* Rating */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rating Minimum</Label>
                  <div className="px-2">
                    <Slider
                      value={[filters.minRating || 0]}
                      onValueChange={handleRatingChange}
                      max={5}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Semua</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-400" />
                        <span>{(filters.minRating || 0).toFixed(1)}</span>
                      </div>
                      <span>5.0</span>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Rentang Harga</Label>
                  <div className="px-2">
                    <Slider
                      value={[
                        filters.priceRange?.min || availableFilters.priceRange.min,
                        filters.priceRange?.max || availableFilters.priceRange.max
                      ]}
                      onValueChange={handlePriceRangeChange}
                      max={availableFilters.priceRange.max}
                      min={availableFilters.priceRange.min}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Rp {formatPrice(availableFilters.priceRange.min)}</span>
                      <span>
                        Rp {formatPrice(filters.priceRange?.min || availableFilters.priceRange.min)} -
                        Rp {formatPrice(filters.priceRange?.max || availableFilters.priceRange.max)}
                      </span>
                      <span>Rp {formatPrice(availableFilters.priceRange.max)}</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Languages */}
            <AccordionItem value="languages">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Bahasa
                  {(filters.languages?.length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.languages?.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {mockLanguages.map((lang) => {
                  const isSelected = filters.languages?.includes(lang.code) || false;

                  return (
                    <div key={lang.code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang.code}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleLanguageChange(lang.code, checked as boolean)
                        }
                      />
                      <Label htmlFor={`lang-${lang.code}`} className="text-sm cursor-pointer">
                        {lang.nativeName} ({lang.name})
                      </Label>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>

            {/* Insurance */}
            <AccordionItem value="insurance">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Asuransi
                  {(filters.insuranceProviders?.length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.insuranceProviders?.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {mockInsuranceProviders.map((insurance) => {
                  const isSelected = filters.insuranceProviders?.includes(insurance.id) || false;

                  return (
                    <div key={insurance.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`insurance-${insurance.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleInsuranceChange(insurance.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`insurance-${insurance.id}`} className="text-sm cursor-pointer">
                        {insurance.name}
                      </Label>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>

            {/* Clinic Type */}
            <AccordionItem value="clinic-type">
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Jenis Klinik
                  {(filters.clinicType?.length || 0) > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.clinicType?.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {CLINIC_TYPES.map((type) => {
                  const isSelected = filters.clinicType?.includes(type.id) || false;

                  return (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`clinic-${type.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleClinicTypeChange(type.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`clinic-${type.id}`} className="text-sm cursor-pointer">
                        {type.nameId}
                      </Label>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Terapkan Filter
            {results && (
              <Badge variant="secondary" className="ml-2">
                {results.totalCount}
              </Badge>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}