'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Clock,
  Calendar,
  MapPin,
  Coffee,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Sunset,
  Users,
  Phone,
  Video,
  Stethoscope,
  Building,
} from 'lucide-react';
import {
  DoctorSchedule,
  DailySchedule,
  TimeSlot,
  WeeklyScheduleTemplate,
  TimeRange,
} from '@/types/appointment';
import {
  mockDoctorSchedules,
  mockAppointmentTypes,
  scheduleHelpers,
} from '@/data/mockSchedules';
import { Doctor } from '@/types/doctor';
import { allMockDoctors } from '@/data/mockDoctors';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface DoctorScheduleViewerProps {
  doctorId: string;
  clinicId?: string;
  view?: 'weekly' | 'daily';
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onSlotSelect?: (slot: TimeSlot) => void;
  locale?: 'en' | 'id';
  className?: string;
  showUnavailable?: boolean;
  compact?: boolean;
}

const DoctorScheduleViewer: React.FC<DoctorScheduleViewerProps> = ({
  doctorId,
  clinicId,
  view = 'weekly',
  selectedDate = new Date(),
  onDateSelect,
  onSlotSelect,
  locale = 'id',
  className,
  showUnavailable = false,
  compact = false,
}) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));
  const [selectedView, setSelectedView] = useState<'weekly' | 'daily'>(view);

  // Get doctor data
  const doctor = allMockDoctors.find(d => d.id === doctorId);
  const doctorSchedule = mockDoctorSchedules[doctorId];

  // Get clinic info
  const clinic = doctor?.clinics.find(c => c.id === clinicId) || doctor?.clinics[0];

  // Generate week dates
  const weekDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(currentWeek, i));
    }
    return dates;
  }, [currentWeek]);

  // Format time for display
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

  // Get time of day icon
  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return <Sun className="h-4 w-4" />;
    if (hour >= 12 && hour < 18) return <Sunset className="h-4 w-4" />;
    return <Moon className="h-4 w-4" />;
  };

  // Get availability status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get appointment type info
  const getAppointmentTypeInfo = (typeId: string) => {
    return mockAppointmentTypes.find(type => type.id === typeId);
  };

  // Render daily schedule summary
  const renderDailyScheduleSummary = (date: Date, dailySchedule?: DailySchedule) => {
    const dateStr = date.toISOString().split('T')[0];
    const isSelected = selectedDate &&
      selectedDate.toISOString().split('T')[0] === dateStr;

    if (!dailySchedule) {
      return (
        <Card
          key={dateStr}
          className={cn(
            'cursor-pointer transition-all',
            isSelected && 'ring-2 ring-primary ring-offset-2',
            compact ? 'p-2' : 'p-3'
          )}
          onClick={() => onDateSelect?.(date)}
        >
          <div className="text-center">
            <div className="font-medium text-sm">
              {format(date, 'EEE', { locale: locale === 'id' ? idLocale : undefined })}
            </div>
            <div className="text-lg font-bold">
              {format(date, 'dd')}
            </div>
            <div className="text-xs text-muted-foreground">
              {locale === 'id' ? 'Tidak ada data' : 'No data'}
            </div>
          </div>
        </Card>
      );
    }

    const availableSlots = dailySchedule.timeSlots.filter(slot => slot.available).length;
    const totalSlots = dailySchedule.timeSlots.length;

    return (
      <Card
        key={dateStr}
        className={cn(
          'cursor-pointer transition-all hover:shadow-md',
          isSelected && 'ring-2 ring-primary ring-offset-2',
          !dailySchedule.isWorkingDay && 'opacity-60',
          compact ? 'p-2' : 'p-3'
        )}
        onClick={() => onDateSelect?.(date)}
      >
        <div className="text-center space-y-1">
          <div className="font-medium text-sm">
            {format(date, 'EEE', { locale: locale === 'id' ? idLocale : undefined })}
          </div>
          <div className="text-lg font-bold">
            {format(date, 'dd')}
          </div>

          {dailySchedule.isHoliday ? (
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
              {locale === 'id' ? 'Libur' : 'Holiday'}
            </Badge>
          ) : !dailySchedule.isWorkingDay ? (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
              {locale === 'id' ? 'Tutup' : 'Closed'}
            </Badge>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-1 text-xs">
                <Clock className="h-3 w-3" />
                <span>
                  {formatTime(dailySchedule.workingHours.start)} -
                  {formatTime(dailySchedule.workingHours.end)}
                </span>
              </div>

              {totalSlots > 0 && (
                <div className="flex items-center justify-center space-x-1">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    availableSlots > 0 ? 'bg-green-500' : 'bg-red-500'
                  )} />
                  <span className="text-xs">
                    {availableSlots}/{totalSlots}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  };

  // Render detailed daily schedule
  const renderDetailedDailySchedule = (date: Date, dailySchedule?: DailySchedule) => {
    if (!dailySchedule) {
      return (
        <div className="text-center text-muted-foreground py-8">
          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>{locale === 'id' ? 'Jadwal tidak tersedia' : 'Schedule not available'}</p>
        </div>
      );
    }

    if (!dailySchedule.isWorkingDay) {
      return (
        <div className="text-center text-muted-foreground py-8">
          <XCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <h3 className="font-medium mb-1">
            {dailySchedule.isHoliday
              ? (locale === 'id' ? 'Hari Libur' : 'Holiday')
              : (locale === 'id' ? 'Tidak Praktik' : 'Not Available')
            }
          </h3>
          {dailySchedule.holidayName && (
            <p className="text-sm">{dailySchedule.holidayName}</p>
          )}
        </div>
      );
    }

    const timeRanges = scheduleHelpers.generateTimeRanges(dailySchedule.timeSlots);

    return (
      <div className="space-y-6">
        {/* Working Hours */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">
                {locale === 'id' ? 'Jam Praktik' : 'Working Hours'}
              </span>
            </div>
            <div className="text-sm text-blue-800">
              {formatTime(dailySchedule.workingHours.start)} - {formatTime(dailySchedule.workingHours.end)}
            </div>

            {dailySchedule.breakTimes.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center space-x-1 text-sm text-blue-700 mb-1">
                  <Coffee className="h-3 w-3" />
                  <span>{locale === 'id' ? 'Waktu Istirahat:' : 'Break Times:'}</span>
                </div>
                {dailySchedule.breakTimes.map((breakTime, index) => (
                  <div key={index} className="text-xs text-blue-600 ml-4">
                    {formatTime(breakTime.start)} - {formatTime(breakTime.end)} ({breakTime.name})
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Ranges */}
        {timeRanges.map(timeRange => (
          <Card key={timeRange.id}>
            <CardHeader className="pb-3">
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
                <Badge variant="outline">
                  {timeRange.availableCount}/{timeRange.totalCount}
                  {locale === 'id' ? ' tersedia' : ' available'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeRange.slots.map(slot => {
                  const appointmentType = getAppointmentTypeInfo(slot.appointmentTypeId || '');

                  return (
                    <Button
                      key={slot.id}
                      variant={slot.available ? 'outline' : 'ghost'}
                      onClick={() => slot.available && onSlotSelect?.(slot)}
                      disabled={!slot.available}
                      className={cn(
                        'h-auto p-3 flex flex-col items-start min-h-[44px]',
                        slot.available && 'hover:bg-green-50 hover:border-green-300',
                        !slot.available && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div className="flex items-center space-x-1 w-full">
                        {getTimeIcon(slot.startTime)}
                        <span className="font-medium text-sm">
                          {formatTime(slot.startTime)}
                        </span>
                        {slot.available ? (
                          <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500 ml-auto" />
                        )}
                      </div>

                      <div className="flex flex-col items-start w-full mt-1 space-y-1">
                        <div className="text-xs text-muted-foreground">
                          {slot.duration} {locale === 'id' ? 'menit' : 'min'}
                        </div>

                        {appointmentType && (
                          <Badge variant="secondary" className="text-xs h-4">
                            {appointmentType.icon} {locale === 'id' ? appointmentType.nameId : appointmentType.name}
                          </Badge>
                        )}

                        <div className="text-xs font-medium text-green-600">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          }).format(slot.price)}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (!doctor || !doctorSchedule) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>{locale === 'id' ? 'Jadwal dokter tidak ditemukan' : 'Doctor schedule not found'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={cn('text-lg font-semibold', compact && 'text-base')}>
              {locale === 'id' ? 'Jadwal Praktik' : 'Practice Schedule'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {doctor.name}
              {clinic && (
                <>
                  {' • '}
                  <span className="inline-flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {clinic.name}
                  </span>
                </>
              )}
            </p>
          </div>

          <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as 'weekly' | 'daily')}>
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="weekly" className="text-xs">
                {locale === 'id' ? 'Mingguan' : 'Weekly'}
              </TabsTrigger>
              <TabsTrigger value="daily" className="text-xs">
                {locale === 'id' ? 'Harian' : 'Daily'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as 'weekly' | 'daily')}>
          <TabsContent value="weekly" className="space-y-4">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              >
                {locale === 'id' ? 'Minggu Sebelumnya' : 'Previous Week'}
              </Button>

              <h3 className="font-medium">
                {format(currentWeek, 'dd MMM', { locale: locale === 'id' ? idLocale : undefined })} -
                {format(addDays(currentWeek, 6), 'dd MMM yyyy', { locale: locale === 'id' ? idLocale : undefined })}
              </h3>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              >
                {locale === 'id' ? 'Minggu Berikutnya' : 'Next Week'}
              </Button>
            </div>

            {/* Weekly Overview */}
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map(date => {
                const dateStr = date.toISOString().split('T')[0];
                const dailySchedule = doctorSchedule.dailySchedules[dateStr];
                return renderDailyScheduleSummary(date, dailySchedule);
              })}
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            {/* Date Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDateSelect?.(addDays(selectedDate, -1))}
              >
                {locale === 'id' ? 'Hari Sebelumnya' : 'Previous Day'}
              </Button>

              <h3 className="font-medium">
                {format(selectedDate, 'EEEE, dd MMMM yyyy', {
                  locale: locale === 'id' ? idLocale : undefined,
                })}
              </h3>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDateSelect?.(addDays(selectedDate, 1))}
              >
                {locale === 'id' ? 'Hari Berikutnya' : 'Next Day'}
              </Button>
            </div>

            {/* Daily Schedule Details */}
            <ScrollArea className="h-96">
              {renderDetailedDailySchedule(
                selectedDate,
                doctorSchedule.dailySchedules[selectedDate.toISOString().split('T')[0]]
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DoctorScheduleViewer;