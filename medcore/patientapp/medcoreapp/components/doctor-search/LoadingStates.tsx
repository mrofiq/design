"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingStatesProps {
  variant?: 'search' | 'cards' | 'profile' | 'filters';
  count?: number;
  className?: string;
}

export function LoadingStates({
  variant = 'cards',
  count = 6,
  className
}: LoadingStatesProps) {

  if (variant === 'search') {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Search Bar Loading */}
        <div className="relative">
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </div>

        {/* Search Suggestions Loading */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'filters') {
    return (
      <div className={cn("space-y-4", className)}>
        {/* Filter Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-lg">
          <div className="flex gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-48 bg-white/20" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 bg-white/20 rounded-full" />
                <Skeleton className="h-6 w-20 bg-white/20 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-16 bg-white/20" />
                <Skeleton className="h-4 w-20 bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-20" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Default: cards variant
  return (
    <div className={cn(
      "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <DoctorCardSkeleton key={index} />
      ))}
    </div>
  );
}

function DoctorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 pb-4">
        {/* Header Section */}
        <div className="flex gap-4 mb-4">
          {/* Doctor Photo */}
          <div className="relative flex-shrink-0">
            <Skeleton className="h-20 w-20 rounded-full" />
            {/* Online indicator */}
            <Skeleton className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full" />
          </div>

          {/* Doctor Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-32" />

                {/* Specializations */}
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                {/* Experience */}
                <Skeleton className="h-4 w-28" />
              </div>

              {/* Available Status */}
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className="h-4 w-4" />
                  ))}
                </div>
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Location */}
            <Skeleton className="h-4 w-40" />
          </div>
        </div>

        {/* Separator */}
        <div className="my-4">
          <Skeleton className="h-px w-full" />
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact variant for list view
export function DoctorCardCompactSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Doctor Avatar */}
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

          {/* Doctor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Search results loading
export function SearchResultsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Results header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Filter tags */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-20 rounded-full" />
        ))}
      </div>

      {/* Doctor cards grid */}
      <LoadingStates variant="cards" count={8} />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-8" />
          ))}
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}