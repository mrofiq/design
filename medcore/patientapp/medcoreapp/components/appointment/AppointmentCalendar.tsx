'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
} from 'lucide-react';
import {
  CalendarDate,
  CalendarView,
  CalendarComponentProps,
  AvailabilityStatus,
  CalendarNavigation,
} from '@/types/appointment';
import { mockDoctorSchedules, indonesianHolidays, scheduleHelpers } from '@/data/mockSchedules';
import { format, addDays, addMonths, subMonths, startOfMonth, endOfMonth, isSameDay, isToday } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface AppointmentCalendarProps extends CalendarComponentProps {
  className?: string;
  compact?: boolean;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  doctorId,
  clinicId,
  selectedDate,
  selectedTimeSlot,
  view = 'month',
  minDate = new Date(),
  maxDate = addMonths(new Date(), 3),
  onDateSelect,
  onTimeSlotSelect,
  onViewChange,
  showUnavailable = true,
  highlightToday = true,
  touchGestures,
  locale = 'id',
  timezone = 'WIB',
  className,
  compact = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>(view);
  const [availabilities, setAvailabilities] = useState<Record<string, AvailabilityStatus>>({});
  const [loading, setLoading] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // Get doctor schedule
  const doctorSchedule = mockDoctorSchedules[doctorId];

  // Load availability data for current month
  useEffect(() => {
    const loadAvailability = async () => {
      setLoading(true);
      try {
        const startDate = startOfMonth(currentMonth).toISOString().split('T')[0];
        const endDate = endOfMonth(currentMonth).toISOString().split('T')[0];

        const availabilityData = scheduleHelpers.generateAvailabilityStatus(
          doctorId,
          startDate,
          endDate
        );

        const availabilityMap: Record<string, AvailabilityStatus> = {};
        availabilityData.forEach(avail => {
          availabilityMap[avail.date] = avail;
        });

        setAvailabilities(availabilityMap);
      } catch (error) {
        console.error('Failed to load availability:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [doctorId, currentMonth]);

  // Generate calendar dates for the current view
  const calendarDates = useMemo((): CalendarDate[] => {
    const dates: CalendarDate[] = [];
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    // Add previous month's trailing dates
    const startDay = start.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = addDays(start, -i - 1);
      dates.push(createCalendarDate(date, false));
    }

    // Add current month's dates
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(createCalendarDate(new Date(date), true));
    }

    // Add next month's leading dates to complete the grid
    const remainingDays = 42 - dates.length; // 6 weeks * 7 days
    for (let i = 0; i < remainingDays; i++) {
      const date = addDays(end, i + 1);
      dates.push(createCalendarDate(date, false));
    }

    return dates;
  }, [currentMonth, availabilities]);

  // Create calendar date object
  const createCalendarDate = (date: Date, isCurrentMonth: boolean): CalendarDate => {
    const dateStr = date.toISOString().split('T')[0];
    const availability = availabilities[dateStr];
    const holiday = indonesianHolidays.find(h => h.date === dateStr);

    return {
      date: dateStr,
      dayOfMonth: date.getDate(),
      dayOfWeek: date.getDay(),
      isCurrentMonth,
      isToday: isToday(date),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isHoliday: !!holiday,
      holidayName: holiday?.nameId,
      availability: availability?.status || 'unavailable',
      appointmentCount: 0,
      slotsAvailable: availability?.availableSlots || 0,
      slotsTotal: availability?.totalSlots || 0,
      hasUrgentSlots: false,
      earliestAvailableTime: availability?.nextAvailableTime,
    };
  };

  // Navigation functions
  const navigateToPrevious = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const navigateToNext = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const navigateToToday = () => {
    setCurrentMonth(new Date());
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!touchGestures?.enableSwipe) return;

    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchGestures?.enableSwipe || !touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = Math.abs(touch.clientY - touchStart.y);

    const threshold = touchGestures.swipeThreshold || 50;

    // Only process horizontal swipes
    if (Math.abs(deltaX) > threshold && deltaY < threshold) {
      if (deltaX > 0) {
        navigateToPrevious();
      } else {
        navigateToNext();
      }
    }

    setTouchStart(null);
  };

  // Date selection handler
  const handleDateSelect = (calendarDate: CalendarDate) => {
    if (!calendarDate.isCurrentMonth) return;
    if (calendarDate.availability === 'unavailable' && !showUnavailable) return;

    const date = new Date(calendarDate.date);
    if (date < minDate || date > maxDate) return;

    onDateSelect(calendarDate.date);
  };

  // Get availability indicator
  const getAvailabilityIndicator = (calendarDate: CalendarDate) => {
    const { availability, slotsAvailable, slotsTotal, isHoliday } = calendarDate;

    if (isHoliday) {
      return (
        <div className="flex items-center justify-center w-2 h-2 rounded-full bg-orange-500" />
      );
    }

    switch (availability) {
      case 'available':
        return (
          <div className="flex items-center justify-center w-2 h-2 rounded-full bg-green-500" />
        );
      case 'busy':
        return (
          <div className="flex items-center justify-center w-2 h-2 rounded-full bg-yellow-500" />
        );
      case 'blocked':
        return (
          <div className="flex items-center justify-center w-2 h-2 rounded-full bg-red-500" />
        );
      default:
        return (
          <div className="flex items-center justify-center w-2 h-2 rounded-full bg-gray-300" />
        );
    }
  };

  // Get availability text
  const getAvailabilityText = (calendarDate: CalendarDate) => {
    const { availability, slotsAvailable, isHoliday, holidayName } = calendarDate;

    if (isHoliday && holidayName) {
      return locale === 'id' ? holidayName : calendarDate.holidayName;
    }

    switch (availability) {
      case 'available':
        return locale === 'id'
          ? `${slotsAvailable} slot tersedia`
          : `${slotsAvailable} slots available`;
      case 'busy':
        return locale === 'id' ? 'Penuh' : 'Fully booked';
      case 'blocked':
        return locale === 'id' ? 'Tidak tersedia' : 'Unavailable';
      default:
        return locale === 'id' ? 'Tutup' : 'Closed';
    }
  };

  const navigation: CalendarNavigation = {
    currentDate: new Date(),
    viewDate: currentMonth,
    view: calendarView,
    canGoToPrevious: startOfMonth(subMonths(currentMonth, 1)) >= startOfMonth(minDate),
    canGoToNext: startOfMonth(addMonths(currentMonth, 1)) <= startOfMonth(maxDate),
    minDate,
    maxDate,
  };

  if (loading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">
              {locale === 'id' ? 'Memuat kalender...' : 'Loading calendar...'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn('text-lg font-semibold', compact && 'text-base')}>
            {locale === 'id' ? 'Pilih Tanggal' : 'Select Date'}
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToToday}
              className="px-3"
            >
              {locale === 'id' ? 'Hari Ini' : 'Today'}
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={navigateToPrevious}
            disabled={!navigation.canGoToPrevious}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h3 className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy', {
              locale: locale === 'id' ? idLocale : undefined
            })}
          </h3>

          <Button
            variant="ghost"
            size="icon"
            onClick={navigateToNext}
            disabled={!navigation.canGoToNext}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs mt-3">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>{locale === 'id' ? 'Tersedia' : 'Available'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>{locale === 'id' ? 'Penuh' : 'Busy'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>{locale === 'id' ? 'Tutup' : 'Closed'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>{locale === 'id' ? 'Libur' : 'Holiday'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className="px-4 pb-4"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, index) => (
            <div
              key={day}
              className="flex items-center justify-center h-8 text-xs font-medium text-muted-foreground"
            >
              {locale === 'id' ? day : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}
            </div>
          ))}

          {/* Calendar dates */}
          {calendarDates.map((calendarDate, index) => {
            const isSelected = selectedDate === calendarDate.date;
            const isDisabled = !calendarDate.isCurrentMonth ||
              calendarDate.availability === 'unavailable' ||
              new Date(calendarDate.date) < minDate ||
              new Date(calendarDate.date) > maxDate;

            return (
              <Button
                key={`${calendarDate.date}-${index}`}
                variant={isSelected ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleDateSelect(calendarDate)}
                disabled={isDisabled}
                className={cn(
                  'h-12 p-1 flex flex-col items-center justify-center relative transition-all',
                  'min-h-[44px]', // Touch-friendly minimum size
                  !calendarDate.isCurrentMonth && 'text-muted-foreground/50',
                  calendarDate.isToday && highlightToday && 'ring-2 ring-primary ring-offset-2',
                  calendarDate.isWeekend && 'text-red-600',
                  isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  !isSelected && calendarDate.availability === 'available' && 'hover:bg-green-50',
                  !isSelected && calendarDate.availability === 'busy' && 'hover:bg-yellow-50',
                  compact && 'h-10 min-h-[40px]'
                )}
              >
                <span className={cn('text-sm font-medium', compact && 'text-xs')}>
                  {calendarDate.dayOfMonth}
                </span>

                {calendarDate.isCurrentMonth && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    {getAvailabilityIndicator(calendarDate)}
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Selected date info */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {format(new Date(selectedDate), 'EEEE, dd MMMM yyyy', {
                    locale: locale === 'id' ? idLocale : undefined,
                  })}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {getAvailabilityText(calendarDates.find(d => d.date === selectedDate)!)}
                </p>
              </div>

              {calendarDates.find(d => d.date === selectedDate)?.slotsAvailable > 0 && (
                <Badge variant="secondary" className="ml-2">
                  <Clock className="w-3 h-3 mr-1" />
                  {calendarDates.find(d => d.date === selectedDate)?.slotsAvailable}
                  {locale === 'id' ? ' slot' : ' slots'}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCalendar;