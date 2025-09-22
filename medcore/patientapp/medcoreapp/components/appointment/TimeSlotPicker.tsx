'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Clock,
  Grid3X3,
  List,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Timer,
  Zap,
} from 'lucide-react';
import {
  TimeSlot,
  TimeRange,
  TimeSlotPickerProps,
  AppointmentType,
} from '@/types/appointment';
import {
  mockDoctorSchedules,
  mockAppointmentTypes,
  scheduleHelpers,
} from '@/data/mockSchedules';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface TimeSlotPickerComponentProps extends TimeSlotPickerProps {
  className?: string;
  showAppointmentTypes?: boolean;
}

const TimeSlotPicker: React.FC<TimeSlotPickerComponentProps> = ({
  date,
  doctorId,
  clinicId,
  appointmentTypeId,
  selectedSlot,
  onSlotSelect,
  view = 'grid',
  onViewChange,
  minTouchSize = 44,
  showPrices = true,
  showDuration = true,
  groupByTimeRange = true,
  locale = 'id',
  className,
  showAppointmentTypes = false,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(view);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string | undefined>(
    appointmentTypeId
  );

  // Get doctor schedule for the selected date
  const doctorSchedule = mockDoctorSchedules[doctorId];
  const dailySchedule = doctorSchedule?.dailySchedules[date];

  // Filter slots by appointment type if specified
  const availableSlots = useMemo(() => {
    if (!dailySchedule) return [];

    let slots = dailySchedule.timeSlots.filter(slot => slot.available);

    if (selectedAppointmentType) {
      const appointmentType = mockAppointmentTypes.find(
        type => type.id === selectedAppointmentType
      );
      if (appointmentType) {
        // Filter slots that can accommodate the appointment duration
        slots = slots.filter(slot => slot.duration >= appointmentType.duration);
      }
    }

    return slots;
  }, [dailySchedule, selectedAppointmentType]);

  // Group slots by time ranges
  const timeRanges = useMemo(() => {
    if (!groupByTimeRange) return [];
    return scheduleHelpers.generateTimeRanges(availableSlots);
  }, [availableSlots, groupByTimeRange]);

  // Get appointment type info
  const getAppointmentType = (typeId?: string): AppointmentType | undefined => {
    return mockAppointmentTypes.find(type => type.id === typeId);
  };

  // Format price in IDR
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format time
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';

    if (locale === 'id') {
      return `${hours}:${minutes}`;
    }
    return `${hour12}:${minutes} ${period}`;
  };

  // Get slot urgency indicator
  const getSlotUrgency = (slot: TimeSlot) => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    if (hour >= 18 || hour <= 6) return 'high'; // Evening/night slots
    if (hour >= 7 && hour <= 9) return 'medium'; // Early morning
    return 'low';
  };

  // Handle view change
  const handleViewChange = (newView: 'grid' | 'list') => {
    setViewMode(newView);
    onViewChange?.(newView);
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    onSlotSelect(slot);
  };

  // Handle appointment type selection
  const handleAppointmentTypeSelect = (typeId: string) => {
    setSelectedAppointmentType(typeId);
  };

  // Render slot button
  const renderSlotButton = (slot: TimeSlot, compact = false) => {
    const isSelected = selectedSlot?.id === slot.id;
    const appointmentType = getAppointmentType(slot.appointmentTypeId);
    const urgency = getSlotUrgency(slot);

    return (
      <Button
        key={slot.id}
        variant={isSelected ? 'default' : 'outline'}
        onClick={() => handleSlotSelect(slot)}
        className={cn(
          'transition-all duration-200 relative overflow-hidden',
          compact ? 'h-auto p-2' : 'h-auto p-3',
          `min-h-[${minTouchSize}px] min-w-[${minTouchSize}px]`,
          'flex flex-col items-start justify-between',
          isSelected && 'ring-2 ring-primary ring-offset-2',
          urgency === 'high' && !isSelected && 'border-orange-300 bg-orange-50 hover:bg-orange-100',
          urgency === 'medium' && !isSelected && 'border-blue-300 bg-blue-50 hover:bg-blue-100'
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-1">
            <Clock className={cn('h-3 w-3', compact && 'h-3 w-3')} />
            <span className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
              {formatTime(slot.startTime)}
            </span>
          </div>

          {urgency === 'high' && (
            <Zap className="h-3 w-3 text-orange-500" />
          )}
        </div>

        <div className="flex flex-col items-start w-full mt-1 space-y-1">
          {showDuration && appointmentType && (
            <div className="flex items-center space-x-1">
              <Timer className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {appointmentType.duration}
                {locale === 'id' ? ' menit' : ' min'}
              </span>
            </div>
          )}

          {showPrices && (
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className={cn('text-xs font-medium', compact && 'text-xs')}>
                {formatPrice(slot.price)}
              </span>
            </div>
          )}

          {appointmentType && (
            <Badge variant="secondary" className="text-xs h-5">
              {locale === 'id' ? appointmentType.nameId : appointmentType.name}
            </Badge>
          )}
        </div>

        {isSelected && (
          <div className="absolute top-1 right-1">
            <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </Button>
    );
  };

  // Render time range section
  const renderTimeRange = (timeRange: TimeRange) => {
    return (
      <div key={timeRange.id} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{timeRange.icon}</span>
            <div>
              <h4 className="font-medium">
                {locale === 'id' ? timeRange.nameId : timeRange.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatTime(timeRange.startTime)} - {formatTime(timeRange.endTime)}
              </p>
            </div>
          </div>

          <Badge variant="outline" className="ml-2">
            {timeRange.availableCount}/{timeRange.totalCount}
            {locale === 'id' ? ' tersedia' : ' available'}
          </Badge>
        </div>

        <div className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 gap-2'
            : 'space-y-2'
        )}>
          {timeRange.slots.map(slot => renderSlotButton(slot, viewMode === 'list'))}
        </div>
      </div>
    );
  };

  if (!dailySchedule) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{locale === 'id' ? 'Jadwal tidak tersedia' : 'No schedule available'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dailySchedule.isWorkingDay) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <h3 className="font-medium mb-1">
              {locale === 'id' ? 'Tidak Ada Praktik' : 'Not Available'}
            </h3>
            <p className="text-sm">
              {dailySchedule.isHoliday && dailySchedule.holidayName
                ? `${locale === 'id' ? 'Libur:' : 'Holiday:'} ${dailySchedule.holidayName}`
                : locale === 'id'
                ? 'Dokter tidak praktik pada hari ini'
                : 'Doctor is not available on this day'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <h3 className="font-medium mb-1">
              {locale === 'id' ? 'Jadwal Penuh' : 'Fully Booked'}
            </h3>
            <p className="text-sm">
              {locale === 'id'
                ? 'Semua slot sudah dipesan untuk hari ini'
                : 'All time slots are booked for this day'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {locale === 'id' ? 'Pilih Waktu' : 'Select Time'}
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('grid')}
              className="px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('list')}
              className="px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>
            {format(new Date(date), 'EEEE, dd MMMM yyyy', {
              locale: locale === 'id' ? idLocale : undefined,
            })}
          </span>
          <Separator orientation="vertical" className="h-4" />
          <span>
            {availableSlots.length}
            {locale === 'id' ? ' slot tersedia' : ' slots available'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Appointment Type Selector */}
        {showAppointmentTypes && (
          <div className="space-y-3">
            <h4 className="font-medium">
              {locale === 'id' ? 'Jenis Konsultasi' : 'Appointment Type'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {mockAppointmentTypes
                .filter(type =>
                  !type.isEmergency &&
                  (type.allowsOnline !== false || !clinicId)
                )
                .map(type => (
                  <Button
                    key={type.id}
                    variant={selectedAppointmentType === type.id ? 'default' : 'outline'}
                    onClick={() => handleAppointmentTypeSelect(type.id)}
                    className="h-auto p-3 flex flex-col items-start"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <span className="text-lg">{type.icon}</span>
                      <span className="font-medium text-sm">
                        {locale === 'id' ? type.nameId : type.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full mt-1">
                      <span className="text-xs text-muted-foreground">
                        {type.duration} {locale === 'id' ? 'menit' : 'min'}
                      </span>
                      <span className="text-xs font-medium">
                        {formatPrice(type.price.min)}+
                      </span>
                    </div>
                  </Button>
                ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Time Slots */}
        <ScrollArea className="h-96">
          <div className="space-y-6">
            {groupByTimeRange ? (
              timeRanges.map(timeRange => renderTimeRange(timeRange))
            ) : (
              <div className="space-y-3">
                <h4 className="font-medium">
                  {locale === 'id' ? 'Slot Waktu Tersedia' : 'Available Time Slots'}
                </h4>
                <div className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 gap-2'
                    : 'space-y-2'
                )}>
                  {availableSlots.map(slot => renderSlotButton(slot, viewMode === 'list'))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Working Hours Info */}
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {locale === 'id' ? 'Jam Praktik:' : 'Working Hours:'}
            </span>
            <span>
              {formatTime(dailySchedule.workingHours.start)} - {formatTime(dailySchedule.workingHours.end)}
            </span>
          </div>

          {dailySchedule.breakTimes.length > 0 && (
            <div className="flex items-center space-x-2 text-sm mt-1">
              <span className="font-medium">
                {locale === 'id' ? 'Istirahat:' : 'Break Times:'}
              </span>
              <span className="text-muted-foreground">
                {dailySchedule.breakTimes
                  .map(
                    breakTime => `${formatTime(breakTime.start)}-${formatTime(breakTime.end)}`
                  )
                  .join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Selected Slot Info */}
        {selectedSlot && (
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {locale === 'id' ? 'Slot Terpilih' : 'Selected Slot'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(selectedSlot.price)}</div>
                {showDuration && (
                  <div className="text-sm text-muted-foreground">
                    {selectedSlot.duration} {locale === 'id' ? 'menit' : 'minutes'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotPicker;