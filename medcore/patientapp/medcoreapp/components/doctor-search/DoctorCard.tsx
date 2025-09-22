"use client";

import React from 'react';
import Image from 'next/image';
import {
  Star,
  MapPin,
  Clock,
  MessageCircle,
  Calendar,
  BadgeCheck,
  User,
  Stethoscope,
  Banknote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Doctor } from '@/types/doctor';

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export function DoctorCard({
  doctor,
  onBookAppointment,
  onViewProfile,
  className,
  variant = 'default'
}: DoctorCardProps) {
  const formatPrice = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}jt`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 0)}rb`;
      }
      return num.toString();
    };

    if (min === max) {
      return `Rp ${formatNumber(min)}`;
    }
    return `Rp ${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const handleBooking = () => {
    onBookAppointment?.(doctor);
  };

  const handleViewProfile = () => {
    onViewProfile?.(doctor);
  };

  if (variant === 'compact') {
    return (
      <Card className={cn("hover:shadow-md transition-shadow duration-200", className)}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* Doctor Avatar */}
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={doctor.photo} alt={doctor.name} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            {/* Doctor Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {doctor.name}
                    </h3>
                    {doctor.isVerified && (
                      <BadgeCheck className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {doctor.specializations[0]?.nameId || doctor.specializations[0]?.name}
                  </p>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span className={cn("text-xs font-medium", getRatingColor(doctor.rating.overall))}>
                      {doctor.rating.overall}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({doctor.rating.reviewCount})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(doctor.consultationFees.min, doctor.consultationFees.max)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleBooking}
                  className="h-7 text-xs px-2 flex-shrink-0"
                  disabled={!doctor.isNewPatientAccepting}
                >
                  Booking
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-200 border-0 shadow-sm hover:shadow-blue-100/50",
      className
    )}>
      <CardContent className="p-6 pb-4">
        {/* Header Section */}
        <div className="flex gap-4 mb-4">
          {/* Doctor Photo */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-20 w-20 ring-2 ring-blue-50">
              <AvatarImage src={doctor.photo} alt={doctor.name} />
              <AvatarFallback className="bg-blue-50">
                <User className="h-8 w-8 text-blue-500" />
              </AvatarFallback>
            </Avatar>
            {doctor.isAvailableToday && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {doctor.name}
                  </h3>
                  {doctor.isVerified && (
                    <BadgeCheck className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  )}
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {doctor.specializations.slice(0, 2).map((spec, index) => (
                    <Badge
                      key={spec.id}
                      variant="secondary"
                      className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      <span className="mr-1">{spec.icon}</span>
                      {spec.nameId || spec.name}
                    </Badge>
                  ))}
                  {doctor.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{doctor.specializations.length - 2}
                    </Badge>
                  )}
                </div>

                {/* Experience */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <Stethoscope className="h-4 w-4" />
                  <span>{doctor.experienceYears} tahun pengalaman</span>
                </div>
              </div>

              {/* Available Status */}
              <div className="text-right flex-shrink-0">
                {doctor.isAvailableToday ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                    Tersedia Hari Ini
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Booking Besok
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= Math.round(doctor.rating.overall)
                          ? "fill-current text-yellow-400"
                          : "text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className={cn("font-semibold text-sm", getRatingColor(doctor.rating.overall))}>
                  {doctor.rating.overall}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({doctor.rating.reviewCount} ulasan)
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>Respon {doctor.responseTime}</span>
              </div>
            </div>

            {/* Location & Insurance */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">
                  {doctor.clinics[0]?.name}, {doctor.clinics[0]?.city}
                </span>
                {doctor.clinics.length > 1 && (
                  <span className="text-xs bg-gray-100 px-1 rounded">
                    +{doctor.clinics.length - 1}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Asuransi:</span>
                <div className="flex flex-wrap gap-1">
                  {doctor.insuranceAccepted.slice(0, 3).map((insurance) => (
                    <Badge
                      key={insurance.id}
                      variant="outline"
                      className="text-xs border-green-200 text-green-700"
                    >
                      {insurance.name}
                    </Badge>
                  ))}
                  {doctor.insuranceAccepted.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{doctor.insuranceAccepted.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Footer Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Banknote className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-700">
              {formatPrice(doctor.consultationFees.min, doctor.consultationFees.max)}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewProfile}
              className="hover:bg-blue-50 hover:border-blue-200"
            >
              Lihat Profil
            </Button>
            <Button
              size="sm"
              onClick={handleBooking}
              disabled={!doctor.isNewPatientAccepting}
              className="min-w-[100px]"
            >
              <Calendar className="h-4 w-4 mr-1" />
              {doctor.isNewPatientAccepting ? 'Booking' : 'Penuh'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}