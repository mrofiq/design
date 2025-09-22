import {
  AppointmentType,
  TimeSlot,
  DailySchedule,
  DoctorSchedule,
  WeeklyScheduleTemplate,
  IndonesianHoliday,
  TimeZone,
  INDONESIAN_TIME_ZONES,
  AvailabilityStatus,
  TimeRange,
} from '@/types/appointment';
import { allMockDoctors } from './mockDoctors';

// Indonesian Appointment Types
export const mockAppointmentTypes: AppointmentType[] = [
  {
    id: 'consultation',
    name: 'General Consultation',
    nameId: 'Konsultasi Umum',
    duration: 30,
    description: 'Standard medical consultation for general health concerns',
    descriptionId: 'Konsultasi medis standar untuk masalah kesehatan umum',
    icon: '🩺',
    color: '#3B82F6',
    price: { min: 150000, max: 300000, currency: 'IDR' },
    allowsOnline: true,
  },
  {
    id: 'follow-up',
    name: 'Follow-up Visit',
    nameId: 'Kunjungan Kontrol',
    duration: 15,
    description: 'Follow-up appointment for ongoing treatment monitoring',
    descriptionId: 'Janji temu lanjutan untuk pemantauan pengobatan',
    icon: '📋',
    color: '#10B981',
    price: { min: 100000, max: 200000, currency: 'IDR' },
    allowsOnline: true,
  },
  {
    id: 'procedure',
    name: 'Medical Procedure',
    nameId: 'Prosedur Medis',
    duration: 60,
    description: 'Medical procedures and minor surgeries',
    descriptionId: 'Prosedur medis dan operasi kecil',
    icon: '🔬',
    color: '#F59E0B',
    price: { min: 500000, max: 2000000, currency: 'IDR' },
    requiresPreparation: true,
  },
  {
    id: 'specialist-consultation',
    name: 'Specialist Consultation',
    nameId: 'Konsultasi Spesialis',
    duration: 45,
    description: 'Specialized medical consultation with expert doctors',
    descriptionId: 'Konsultasi medis khusus dengan dokter ahli',
    icon: '👨‍⚕️',
    color: '#8B5CF6',
    price: { min: 300000, max: 600000, currency: 'IDR' },
    allowsOnline: true,
  },
  {
    id: 'telemedicine',
    name: 'Telemedicine',
    nameId: 'Telemedicine',
    duration: 20,
    description: 'Online medical consultation via video call',
    descriptionId: 'Konsultasi medis online melalui video call',
    icon: '💻',
    color: '#06B6D4',
    price: { min: 75000, max: 150000, currency: 'IDR' },
    allowsOnline: true,
  },
  {
    id: 'emergency',
    name: 'Emergency Consultation',
    nameId: 'Konsultasi Darurat',
    duration: 45,
    description: 'Urgent medical consultation for emergency cases',
    descriptionId: 'Konsultasi medis mendesak untuk kasus darurat',
    icon: '🚨',
    color: '#EF4444',
    price: { min: 400000, max: 800000, currency: 'IDR' },
    isEmergency: true,
  },
  {
    id: 'health-checkup',
    name: 'Health Checkup',
    nameId: 'Medical Check Up',
    duration: 90,
    description: 'Comprehensive health screening and checkup',
    descriptionId: 'Pemeriksaan dan skrining kesehatan komprehensif',
    icon: '🏥',
    color: '#84CC16',
    price: { min: 800000, max: 1500000, currency: 'IDR' },
    requiresPreparation: true,
  },
  {
    id: 'vaccination',
    name: 'Vaccination',
    nameId: 'Vaksinasi',
    duration: 20,
    description: 'Immunization and vaccination services',
    descriptionId: 'Layanan imunisasi dan vaksinasi',
    icon: '💉',
    color: '#22C55E',
    price: { min: 200000, max: 500000, currency: 'IDR' },
  },
];

// Indonesian Holidays 2024-2025
export const indonesianHolidays: IndonesianHoliday[] = [
  {
    date: '2024-01-01',
    name: 'New Year\'s Day',
    nameId: 'Tahun Baru Masehi',
    type: 'national',
    isFixed: true,
    affectsSchedule: true,
  },
  {
    date: '2024-02-10',
    name: 'Chinese New Year',
    nameId: 'Tahun Baru Imlek',
    type: 'national',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-03-11',
    name: 'Isra and Mi\'raj',
    nameId: 'Isra Mi\'raj',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-03-29',
    name: 'Good Friday',
    nameId: 'Wafat Isa Al Masih',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-04-10',
    name: 'Eid al-Fitr',
    nameId: 'Hari Raya Idul Fitri',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-04-11',
    name: 'Eid al-Fitr (Day 2)',
    nameId: 'Hari Raya Idul Fitri (Hari 2)',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-05-01',
    name: 'Labour Day',
    nameId: 'Hari Buruh',
    type: 'national',
    isFixed: true,
    affectsSchedule: true,
  },
  {
    date: '2024-05-09',
    name: 'Ascension of Jesus Christ',
    nameId: 'Kenaikan Isa Al Masih',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-05-23',
    name: 'Vesak Day',
    nameId: 'Hari Raya Waisak',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-06-01',
    name: 'Pancasila Day',
    nameId: 'Hari Lahir Pancasila',
    type: 'national',
    isFixed: true,
    affectsSchedule: true,
  },
  {
    date: '2024-06-17',
    name: 'Eid al-Adha',
    nameId: 'Hari Raya Idul Adha',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-07-07',
    name: 'Islamic New Year',
    nameId: 'Tahun Baru Hijriah',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-08-17',
    name: 'Independence Day',
    nameId: 'Hari Kemerdekaan RI',
    type: 'national',
    isFixed: true,
    affectsSchedule: true,
  },
  {
    date: '2024-09-16',
    name: 'Maulid Nabi Muhammad',
    nameId: 'Maulid Nabi Muhammad SAW',
    type: 'religious',
    isFixed: false,
    affectsSchedule: true,
  },
  {
    date: '2024-12-25',
    name: 'Christmas Day',
    nameId: 'Hari Raya Natal',
    type: 'religious',
    isFixed: true,
    affectsSchedule: true,
  },
  // 2025 holidays
  {
    date: '2025-01-01',
    name: 'New Year\'s Day',
    nameId: 'Tahun Baru Masehi',
    type: 'national',
    isFixed: true,
    affectsSchedule: true,
  },
  {
    date: '2025-01-29',
    name: 'Chinese New Year',
    nameId: 'Tahun Baru Imlek',
    type: 'national',
    isFixed: false,
    affectsSchedule: true,
  },
];

// Utility function to check if a date is a holiday
const isHoliday = (date: string): IndonesianHoliday | null => {
  return indonesianHolidays.find(holiday => holiday.date === date) || null;
};

// Weekly schedule templates for different doctor types
export const weeklyScheduleTemplates: Record<string, WeeklyScheduleTemplate> = {
  // General Practitioner - Regular hours
  general: {
    isWorkingDay: true,
    workingHours: { start: '08:00', end: '17:00' },
    breakTimes: [
      { start: '12:00', end: '13:00', name: 'Lunch Break' },
    ],
    slotDuration: 15,
    appointmentTypes: ['consultation', 'follow-up', 'telemedicine', 'vaccination'],
  },

  // Specialist - Extended hours
  specialist: {
    isWorkingDay: true,
    workingHours: { start: '09:00', end: '18:00' },
    breakTimes: [
      { start: '12:30', end: '13:30', name: 'Lunch Break' },
      { start: '15:00', end: '15:15', name: 'Afternoon Break' },
    ],
    slotDuration: 30,
    appointmentTypes: ['specialist-consultation', 'follow-up', 'procedure', 'telemedicine'],
  },

  // Emergency - 24/7 with shifts
  emergency: {
    isWorkingDay: true,
    workingHours: { start: '00:00', end: '23:59' },
    breakTimes: [],
    slotDuration: 30,
    appointmentTypes: ['emergency', 'consultation', 'procedure'],
  },

  // Part-time - Limited hours
  partTime: {
    isWorkingDay: true,
    workingHours: { start: '14:00', end: '20:00' },
    breakTimes: [
      { start: '17:00', end: '17:30', name: 'Prayer Break' },
    ],
    slotDuration: 20,
    appointmentTypes: ['consultation', 'telemedicine', 'follow-up'],
  },

  // Weekend only
  weekend: {
    isWorkingDay: false,
    workingHours: { start: '08:00', end: '15:00' },
    breakTimes: [
      { start: '11:30', end: '12:00', name: 'Break' },
    ],
    slotDuration: 30,
    appointmentTypes: ['consultation', 'telemedicine'],
  },
};

// Generate time slots for a given day
const generateTimeSlots = (
  schedule: WeeklyScheduleTemplate,
  date: string,
  doctorId: string
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startTime = schedule.workingHours.start;
  const endTime = schedule.workingHours.end;
  const slotDuration = schedule.slotDuration;

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  // Generate slots
  for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += slotDuration) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    const slotStartTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    const slotEndMinutes = currentMinutes + slotDuration;
    const endHour = Math.floor(slotEndMinutes / 60);
    const endMinute = slotEndMinutes % 60;
    const slotEndTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    // Check if slot is during break time
    const isDuringBreak = schedule.breakTimes.some(breakTime => {
      const [breakStartHour, breakStartMinute] = breakTime.start.split(':').map(Number);
      const [breakEndHour, breakEndMinute] = breakTime.end.split(':').map(Number);
      const breakStartMinutes = breakStartHour * 60 + breakStartMinute;
      const breakEndMinutes = breakEndHour * 60 + breakEndMinute;

      return currentMinutes >= breakStartMinutes && currentMinutes < breakEndMinutes;
    });

    if (isDuringBreak) continue;

    // Determine availability (random for demo)
    const isAvailable = Math.random() > 0.3; // 70% chance of being available

    // Determine price based on time and appointment type
    const basePrice = schedule.appointmentTypes.includes('specialist-consultation') ? 300000 : 150000;
    const timeMultiplier = hour >= 18 || hour < 8 ? 1.3 : 1; // Evening/early morning premium
    const price = Math.floor(basePrice * timeMultiplier);

    slots.push({
      id: `${doctorId}-${date}-${slotStartTime}`,
      startTime: slotStartTime,
      endTime: slotEndTime,
      duration: slotDuration,
      available: isAvailable,
      price,
      appointmentTypeId: schedule.appointmentTypes[Math.floor(Math.random() * schedule.appointmentTypes.length)],
    });
  }

  return slots;
};

// Generate daily schedule for a specific date
const generateDailySchedule = (
  date: string,
  doctorId: string,
  template: WeeklyScheduleTemplate
): DailySchedule => {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  const holiday = isHoliday(date);

  const isWorkingDay = template.isWorkingDay && !holiday;

  return {
    date,
    dayOfWeek,
    isWorkingDay,
    isHoliday: !!holiday,
    holidayName: holiday?.nameId,
    workingHours: template.workingHours,
    breakTimes: template.breakTimes,
    timeSlots: isWorkingDay ? generateTimeSlots(template, date, doctorId) : [],
    specialNote: holiday ? `Closed for ${holiday.nameId}` : undefined,
    specialNoteId: holiday ? `Tutup untuk ${holiday.nameId}` : undefined,
  };
};

// Generate doctor schedules for the next 60 days
const generateDoctorSchedule = (doctorId: string): DoctorSchedule => {
  const today = new Date();
  const dailySchedules: Record<string, DailySchedule> = {};

  // Determine doctor type based on specialization
  const doctor = allMockDoctors.find(d => d.id === doctorId);
  let scheduleType = 'general';

  if (doctor?.specializations[0]?.category === 'specialist') {
    scheduleType = 'specialist';
  } else if (doctor?.specializations[0]?.id === 'emergency-medicine') {
    scheduleType = 'emergency';
  }

  // Generate schedules for next 60 days
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    // Use different templates for different days
    let template = weeklyScheduleTemplates[scheduleType];

    // Some doctors work weekends, some don't
    if (dayOfWeek === 0) { // Sunday
      if (Math.random() > 0.7) { // 30% chance of working Sunday
        template = weeklyScheduleTemplates.weekend;
      } else {
        template = { ...template, isWorkingDay: false };
      }
    } else if (dayOfWeek === 6) { // Saturday
      if (Math.random() > 0.5) { // 50% chance of working Saturday
        template = weeklyScheduleTemplates.weekend;
      } else {
        template = { ...template, isWorkingDay: false };
      }
    }

    dailySchedules[dateStr] = generateDailySchedule(dateStr, doctorId, template);
  }

  return {
    doctorId,
    clinicId: doctor?.clinics[0]?.id || 'default-clinic',
    timezone: 'WIB', // Most Indonesian hospitals use WIB
    dailySchedules,
    recurringSchedule: {
      monday: weeklyScheduleTemplates[scheduleType],
      tuesday: weeklyScheduleTemplates[scheduleType],
      wednesday: weeklyScheduleTemplates[scheduleType],
      thursday: weeklyScheduleTemplates[scheduleType],
      friday: weeklyScheduleTemplates[scheduleType],
      saturday: Math.random() > 0.5 ? weeklyScheduleTemplates.weekend : undefined,
      sunday: Math.random() > 0.7 ? weeklyScheduleTemplates.weekend : undefined,
    },
    exceptions: [],
    lastUpdated: new Date().toISOString(),
  };
};

// Generate all doctor schedules
export const mockDoctorSchedules: Record<string, DoctorSchedule> = {};
allMockDoctors.forEach(doctor => {
  mockDoctorSchedules[doctor.id] = generateDoctorSchedule(doctor.id);
});

// Generate availability status for a date range
export const generateAvailabilityStatus = (
  doctorId: string,
  startDate: string,
  endDate: string
): AvailabilityStatus[] => {
  const availabilities: AvailabilityStatus[] = [];
  const schedule = mockDoctorSchedules[doctorId];

  if (!schedule) return availabilities;

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const dailySchedule = schedule.dailySchedules[dateStr];

    if (!dailySchedule) continue;

    const availableSlots = dailySchedule.timeSlots.filter(slot => slot.available).length;
    const totalSlots = dailySchedule.timeSlots.length;

    let status: 'available' | 'busy' | 'blocked' | 'unavailable' = 'unavailable';
    if (!dailySchedule.isWorkingDay) {
      status = 'blocked';
    } else if (availableSlots === 0) {
      status = 'busy';
    } else if (availableSlots > 0) {
      status = 'available';
    }

    const nextAvailableSlot = dailySchedule.timeSlots.find(slot => slot.available);

    availabilities.push({
      date: dateStr,
      status,
      availableSlots,
      totalSlots,
      nextAvailableTime: nextAvailableSlot?.startTime,
      workingHours: dailySchedule.isWorkingDay ? dailySchedule.workingHours : undefined,
      breakTimes: dailySchedule.breakTimes,
    });
  }

  return availabilities;
};

// Generate time ranges for grouping slots
export const generateTimeRanges = (slots: TimeSlot[]): TimeRange[] => {
  const ranges: TimeRange[] = [
    {
      id: 'morning',
      name: 'Morning',
      nameId: 'Pagi',
      startTime: '06:00',
      endTime: '12:00',
      slots: [],
      availableCount: 0,
      totalCount: 0,
      icon: '🌅',
      description: 'Early morning appointments',
    },
    {
      id: 'afternoon',
      name: 'Afternoon',
      nameId: 'Siang',
      startTime: '12:00',
      endTime: '17:00',
      slots: [],
      availableCount: 0,
      totalCount: 0,
      icon: '☀️',
      description: 'Afternoon appointments',
    },
    {
      id: 'evening',
      name: 'Evening',
      nameId: 'Sore',
      startTime: '17:00',
      endTime: '21:00',
      slots: [],
      availableCount: 0,
      totalCount: 0,
      icon: '🌆',
      description: 'Evening appointments',
    },
    {
      id: 'night',
      name: 'Night',
      nameId: 'Malam',
      startTime: '21:00',
      endTime: '06:00',
      slots: [],
      availableCount: 0,
      totalCount: 0,
      icon: '🌙',
      description: 'Night appointments',
    },
  ];

  // Group slots into time ranges
  slots.forEach(slot => {
    const [hour] = slot.startTime.split(':').map(Number);

    let rangeId = 'morning';
    if (hour >= 12 && hour < 17) rangeId = 'afternoon';
    else if (hour >= 17 && hour < 21) rangeId = 'evening';
    else if (hour >= 21 || hour < 6) rangeId = 'night';

    const range = ranges.find(r => r.id === rangeId);
    if (range) {
      range.slots.push(slot);
      range.totalCount++;
      if (slot.available) range.availableCount++;
    }
  });

  // Filter out empty ranges
  return ranges.filter(range => range.totalCount > 0);
};

// Get popular time slots based on booking patterns
export const getPopularTimeSlots = (doctorId: string): string[] => {
  // Mock popular times based on general medical practice patterns
  const morningSlots = ['09:00', '10:00', '11:00'];
  const afternoonSlots = ['14:00', '15:00', '16:00'];
  const eveningSlots = ['18:00', '19:00'];

  return [...morningSlots, ...afternoonSlots, ...eveningSlots];
};

// Export helper functions
export const scheduleHelpers = {
  generateDailySchedule,
  generateTimeSlots,
  generateAvailabilityStatus,
  generateTimeRanges,
  getPopularTimeSlots,
  isHoliday,
};

export default {
  mockAppointmentTypes,
  mockDoctorSchedules,
  indonesianHolidays,
  weeklyScheduleTemplates,
  scheduleHelpers,
};