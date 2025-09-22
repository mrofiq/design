'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MoreVertical,
  Edit,
  X,
  RefreshCw,
  Download,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar as CalendarIcon,
  Video,
  Stethoscope,
  Building,
  Star,
  MessageSquare,
  FileText,
  ExternalLink,
  Navigation,
  Bell,
} from 'lucide-react';
import { AppointmentBooking, AppointmentType } from '@/types/appointment';
import { Doctor } from '@/types/doctor';
import { format, isAfter, isBefore, isToday, addDays, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface BookingManagementProps {
  onReschedule?: (booking: AppointmentBooking) => void;
  onCancel?: (booking: AppointmentBooking) => void;
  onViewDetails?: (booking: AppointmentBooking) => void;
  onBookNew?: () => void;
  locale?: 'en' | 'id';
  className?: string;
}

// Mock booking data
const mockBookings: (AppointmentBooking & { doctor: Doctor; appointmentType: AppointmentType })[] = [
  {
    id: 'APT-001',
    patientId: 'patient-123',
    doctorId: 'doc-001',
    clinicId: 'clinic-001',
    appointmentTypeId: 'general',
    scheduledDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    scheduledTime: '09:00',
    duration: 30,
    status: 'confirmed',
    bookingTime: new Date().toISOString(),
    price: 150000,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    notes: 'Sakit kepala berulang',
    urgency: 'medium',
    isFirstVisit: false,
    remindersSent: [],
    doctor: {
      id: 'doc-001',
      name: 'Dr. Sarah Wijaya, Sp.PD',
      specializations: [{ id: 'internal', name: 'Penyakit Dalam' }],
      profileImage: '/doctors/sarah.jpg',
      rating: 4.8,
      reviewCount: 124,
      experience: 8,
      clinics: [{
        id: 'clinic-001',
        name: 'RS Siloam Kebon Jeruk',
        address: 'Jl. Perjuangan No. 8, Jakarta Barat',
        phone: '+62 21 5674 8900',
        distance: '2.5 km',
      }],
      languages: ['id', 'en'],
      fees: { min: 150000, max: 200000 },
      isAvailable: true,
      nextAvailable: '2024-01-15T09:00:00Z',
    },
    appointmentType: {
      id: 'general',
      name: 'General Consultation',
      nameId: 'Konsultasi Umum',
      duration: 30,
      description: 'General medical consultation',
      descriptionId: 'Konsultasi medis umum',
      icon: 'stethoscope',
      color: 'blue',
      price: { min: 150000, max: 200000, currency: 'IDR' },
    },
  },
  {
    id: 'APT-002',
    patientId: 'patient-123',
    doctorId: 'doc-002',
    clinicId: 'clinic-002',
    appointmentTypeId: 'telemedicine',
    scheduledDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    scheduledTime: '14:30',
    duration: 20,
    status: 'confirmed',
    bookingTime: new Date().toISOString(),
    price: 75000,
    paymentStatus: 'pending',
    paymentMethod: 'ewallet',
    notes: 'Kontrol rutin diabetes',
    urgency: 'low',
    isFirstVisit: false,
    remindersSent: [],
    doctor: {
      id: 'doc-002',
      name: 'Dr. Ahmad Rahman, Sp.JP',
      specializations: [{ id: 'cardiology', name: 'Kardiologi' }],
      profileImage: '/doctors/ahmad.jpg',
      rating: 4.9,
      reviewCount: 89,
      experience: 12,
      clinics: [{
        id: 'clinic-002',
        name: 'Klinik Jantung Sehat',
        address: 'Jl. Sudirman No. 45, Jakarta Pusat',
        phone: '+62 21 5234 5678',
        distance: '5.2 km',
      }],
      languages: ['id', 'en'],
      fees: { min: 200000, max: 300000 },
      isAvailable: true,
      nextAvailable: '2024-01-16T08:00:00Z',
    },
    appointmentType: {
      id: 'telemedicine',
      name: 'Telemedicine',
      nameId: 'Telemedicine',
      duration: 20,
      description: 'Online video consultation',
      descriptionId: 'Konsultasi video online',
      icon: 'video',
      color: 'green',
      price: { min: 75000, max: 100000, currency: 'IDR' },
      allowsOnline: true,
    },
  },
  {
    id: 'APT-003',
    patientId: 'patient-123',
    doctorId: 'doc-003',
    clinicId: 'clinic-003',
    appointmentTypeId: 'follow-up',
    scheduledDate: format(addDays(new Date(), -3), 'yyyy-MM-dd'),
    scheduledTime: '11:15',
    duration: 15,
    status: 'completed',
    bookingTime: new Date().toISOString(),
    price: 100000,
    paymentStatus: 'paid',
    paymentMethod: 'insurance',
    notes: 'Follow-up pemeriksaan lab',
    urgency: 'low',
    isFirstVisit: false,
    remindersSent: [],
    doctor: {
      id: 'doc-003',
      name: 'Dr. Maya Sari, Sp.A',
      specializations: [{ id: 'pediatrics', name: 'Anak' }],
      profileImage: '/doctors/maya.jpg',
      rating: 4.7,
      reviewCount: 156,
      experience: 6,
      clinics: [{
        id: 'clinic-003',
        name: 'Klinik Anak Ceria',
        address: 'Jl. Kemang Raya No. 12, Jakarta Selatan',
        phone: '+62 21 7890 1234',
        distance: '3.8 km',
      }],
      languages: ['id'],
      fees: { min: 180000, max: 250000 },
      isAvailable: true,
      nextAvailable: '2024-01-17T10:00:00Z',
    },
    appointmentType: {
      id: 'follow-up',
      name: 'Follow-up Visit',
      nameId: 'Kunjungan Ulang',
      duration: 15,
      description: 'Follow-up consultation',
      descriptionId: 'Konsultasi lanjutan',
      icon: 'refresh',
      color: 'orange',
      price: { min: 100000, max: 150000, currency: 'IDR' },
    },
  },
];

const BookingManagement: React.FC<BookingManagementProps> = ({
  onReschedule,
  onCancel,
  onViewDetails,
  onBookNew,
  locale = 'id',
  className,
}) => {
  const [bookings, setBookings] = useState(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<AppointmentBooking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date and time
  const formatDateTime = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    return {
      date: format(appointmentDate, 'dd MMM yyyy', { locale: idLocale }),
      time: format(appointmentDate, 'HH:mm'),
      day: format(appointmentDate, 'EEEE', { locale: idLocale }),
      relative: isToday(appointmentDate)
        ? (locale === 'id' ? 'Hari ini' : 'Today')
        : format(appointmentDate, 'dd MMM', { locale: idLocale }),
    };
  };

  // Get status badge
  const getStatusBadge = (status: AppointmentBooking['status']) => {
    const statusConfig = {
      pending: {
        variant: 'secondary' as const,
        text: locale === 'id' ? 'Menunggu' : 'Pending',
        icon: AlertCircle,
      },
      confirmed: {
        variant: 'default' as const,
        text: locale === 'id' ? 'Dikonfirmasi' : 'Confirmed',
        icon: CheckCircle,
      },
      completed: {
        variant: 'default' as const,
        text: locale === 'id' ? 'Selesai' : 'Completed',
        icon: CheckCircle,
      },
      cancelled: {
        variant: 'destructive' as const,
        text: locale === 'id' ? 'Dibatalkan' : 'Cancelled',
        icon: X,
      },
      'no-show': {
        variant: 'destructive' as const,
        text: locale === 'id' ? 'Tidak Hadir' : 'No Show',
        icon: AlertCircle,
      },
      rescheduled: {
        variant: 'secondary' as const,
        text: locale === 'id' ? 'Dijadwal Ulang' : 'Rescheduled',
        icon: RefreshCw,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  // Filter bookings based on tab and filters
  useEffect(() => {
    let filtered = bookings;

    // Filter by tab
    const now = new Date();
    switch (activeTab) {
      case 'upcoming':
        filtered = filtered.filter(booking => {
          const appointmentDate = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`);
          return isAfter(appointmentDate, now) && !['cancelled', 'no-show'].includes(booking.status);
        });
        break;
      case 'past':
        filtered = filtered.filter(booking => {
          const appointmentDate = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`);
          return isBefore(appointmentDate, now) || booking.status === 'completed';
        });
        break;
      case 'cancelled':
        filtered = filtered.filter(booking => ['cancelled', 'no-show'].includes(booking.status));
        break;
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
      const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

    setFilteredBookings(filtered);
  }, [bookings, activeTab, searchQuery, sortOrder, statusFilter]);

  // Handle reschedule
  const handleReschedule = (booking: AppointmentBooking) => {
    setSelectedBooking(booking);
    if (onReschedule) {
      onReschedule(booking);
    } else {
      setShowRescheduleDialog(true);
    }
  };

  // Handle cancel
  const handleCancel = (booking: AppointmentBooking) => {
    setSelectedBooking(booking);
    if (onCancel) {
      onCancel(booking);
    } else {
      setShowCancelDialog(true);
    }
  };

  // Confirm cancellation
  const confirmCancellation = () => {
    if (selectedBooking) {
      setBookings(prev =>
        prev.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      );
      setShowCancelDialog(false);
      setSelectedBooking(null);
    }
  };

  // Get tab counts
  const getTabCounts = () => {
    const now = new Date();
    return {
      upcoming: bookings.filter(booking => {
        const appointmentDate = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`);
        return isAfter(appointmentDate, now) && !['cancelled', 'no-show'].includes(booking.status);
      }).length,
      past: bookings.filter(booking => {
        const appointmentDate = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`);
        return isBefore(appointmentDate, now) || booking.status === 'completed';
      }).length,
      cancelled: bookings.filter(booking => ['cancelled', 'no-show'].includes(booking.status)).length,
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl">
              {locale === 'id' ? 'Kelola Janji Temu' : 'Manage Appointments'}
            </CardTitle>
            <Button onClick={onBookNew}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              {locale === 'id' ? 'Buat Janji Baru' : 'Book New Appointment'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={locale === 'id' ? 'Cari berdasarkan dokter, keluhan, atau ID...' : 'Search by doctor, complaint, or ID...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{locale === 'id' ? 'Semua Status' : 'All Status'}</SelectItem>
                  <SelectItem value="confirmed">{locale === 'id' ? 'Dikonfirmasi' : 'Confirmed'}</SelectItem>
                  <SelectItem value="pending">{locale === 'id' ? 'Menunggu' : 'Pending'}</SelectItem>
                  <SelectItem value="completed">{locale === 'id' ? 'Selesai' : 'Completed'}</SelectItem>
                  <SelectItem value="cancelled">{locale === 'id' ? 'Dibatalkan' : 'Cancelled'}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {locale === 'id' ? 'Mendatang' : 'Upcoming'}
            {tabCounts.upcoming > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {tabCounts.upcoming}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {locale === 'id' ? 'Sebelumnya' : 'Past'}
            {tabCounts.past > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {tabCounts.past}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            {locale === 'id' ? 'Dibatalkan' : 'Cancelled'}
            {tabCounts.cancelled > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {tabCounts.cancelled}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Appointments */}
        <TabsContent value="upcoming" className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {locale === 'id' ? 'Tidak Ada Janji Temu Mendatang' : 'No Upcoming Appointments'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {locale === 'id'
                    ? 'Anda belum memiliki janji temu yang terjadwal.'
                    : 'You have no scheduled appointments.'
                  }
                </p>
                <Button onClick={onBookNew}>
                  {locale === 'id' ? 'Buat Janji Baru' : 'Book New Appointment'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const { date, time, day, relative } = formatDateTime(booking.scheduledDate, booking.scheduledTime);
              const isUrgent = isToday(new Date(`${booking.scheduledDate}T${booking.scheduledTime}`));

              return (
                <Card key={booking.id} className={cn(
                  'transition-all hover:shadow-md',
                  isUrgent && 'border-orange-200 bg-orange-50'
                )}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Doctor and Status */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={booking.doctor.profileImage} alt={booking.doctor.name} />
                              <AvatarFallback>
                                {booking.doctor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{booking.doctor.name}</h3>
                              <p className="text-gray-600">
                                {booking.doctor.specializations.map(s => s.name).join(', ')}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-600">{booking.doctor.rating}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(booking.status)}
                            {isUrgent && (
                              <Badge variant="outline" className="border-orange-500 text-orange-700">
                                {locale === 'id' ? 'Hari Ini' : 'Today'}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="font-medium">{relative}</p>
                              <p className="text-gray-600">{day}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="font-medium">{time}</p>
                              <p className="text-gray-600">
                                {booking.duration} {locale === 'id' ? 'menit' : 'minutes'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {booking.appointmentType.allowsOnline ? (
                              <Video className="h-4 w-4 text-purple-600" />
                            ) : (
                              <Building className="h-4 w-4 text-orange-600" />
                            )}
                            <div>
                              <p className="font-medium">
                                {locale === 'id' ? booking.appointmentType.nameId : booking.appointmentType.name}
                              </p>
                              <p className="text-gray-600">
                                {booking.appointmentType.allowsOnline
                                  ? (locale === 'id' ? 'Online' : 'Online')
                                  : booking.doctor.clinics[0]?.name
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Complaint/Notes */}
                        {booking.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">
                                {locale === 'id' ? 'Keluhan: ' : 'Complaint: '}
                              </span>
                              {booking.notes}
                            </p>
                          </div>
                        )}

                        {/* Payment Info */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                {locale === 'id' ? 'Biaya:' : 'Fee:'}
                              </span>
                              <span className="font-medium">{formatCurrency(booking.price)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                {locale === 'id' ? 'Pembayaran:' : 'Payment:'}
                              </span>
                              <Badge
                                variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}
                              >
                                {booking.paymentStatus === 'paid'
                                  ? (locale === 'id' ? 'Lunas' : 'Paid')
                                  : (locale === 'id' ? 'Belum Bayar' : 'Pending')
                                }
                              </Badge>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {booking.appointmentType.allowsOnline && (
                              <Button variant="outline" size="sm">
                                <Video className="h-4 w-4 mr-1" />
                                {locale === 'id' ? 'Join' : 'Join'}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetails?.(booking)}
                            >
                              <Info className="h-4 w-4 mr-1" />
                              {locale === 'id' ? 'Detail' : 'Details'}
                            </Button>
                            {booking.status === 'confirmed' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReschedule(booking)}
                                >
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                  {locale === 'id' ? 'Reschedule' : 'Reschedule'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancel(booking)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  {locale === 'id' ? 'Batal' : 'Cancel'}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Past Appointments */}
        <TabsContent value="past" className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {locale === 'id' ? 'Tidak Ada Riwayat Janji Temu' : 'No Past Appointments'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'id'
                    ? 'Anda belum memiliki riwayat janji temu.'
                    : 'You have no appointment history.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const { date, time } = formatDateTime(booking.scheduledDate, booking.scheduledTime);

              return (
                <Card key={booking.id} className="opacity-90">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={booking.doctor.profileImage} alt={booking.doctor.name} />
                              <AvatarFallback>
                                {booking.doctor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{booking.doctor.name}</h3>
                              <p className="text-sm text-gray-600">
                                {booking.doctor.specializations.map(s => s.name).join(', ')}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            <span>
                              {locale === 'id' ? booking.appointmentType.nameId : booking.appointmentType.name}
                            </span>
                          </div>
                        </div>

                        {booking.notes && (
                          <p className="text-sm text-gray-700">{booking.notes}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm font-medium">{formatCurrency(booking.price)}</span>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => onViewDetails?.(booking)}>
                              <FileText className="h-4 w-4 mr-1" />
                              {locale === 'id' ? 'Lihat Detail' : 'View Details'}
                            </Button>
                            {booking.status === 'completed' && (
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {locale === 'id' ? 'Beri Ulasan' : 'Write Review'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Cancelled Appointments */}
        <TabsContent value="cancelled" className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {locale === 'id' ? 'Tidak Ada Janji Temu yang Dibatalkan' : 'No Cancelled Appointments'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'id'
                    ? 'Anda tidak memiliki janji temu yang dibatalkan.'
                    : 'You have no cancelled appointments.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const { date, time } = formatDateTime(booking.scheduledDate, booking.scheduledTime);

              return (
                <Card key={booking.id} className="opacity-75 border-red-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={booking.doctor.profileImage} alt={booking.doctor.name} />
                              <AvatarFallback>
                                {booking.doctor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{booking.doctor.name}</h3>
                              <p className="text-sm text-gray-600">
                                {booking.doctor.specializations.map(s => s.name).join(', ')}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{time}</span>
                          </div>
                        </div>

                        {booking.cancellationReason && (
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-red-700">
                              <span className="font-medium">
                                {locale === 'id' ? 'Alasan pembatalan: ' : 'Cancellation reason: '}
                              </span>
                              {booking.cancellationReason}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-gray-500">{formatCurrency(booking.price)}</span>
                          <Button variant="outline" size="sm" onClick={() => onViewDetails?.(booking)}>
                            <FileText className="h-4 w-4 mr-1" />
                            {locale === 'id' ? 'Lihat Detail' : 'View Details'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {locale === 'id' ? 'Batalkan Janji Temu' : 'Cancel Appointment'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              {locale === 'id'
                ? 'Apakah Anda yakin ingin membatalkan janji temu ini?'
                : 'Are you sure you want to cancel this appointment?'
              }
            </p>
            {selectedBooking && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">{selectedBooking.doctor.name}</p>
                <p className="text-sm text-gray-600">
                  {formatDateTime(selectedBooking.scheduledDate, selectedBooking.scheduledTime).date} •{' '}
                  {formatDateTime(selectedBooking.scheduledDate, selectedBooking.scheduledTime).time}
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                {locale === 'id' ? 'Batal' : 'Cancel'}
              </Button>
              <Button variant="destructive" onClick={confirmCancellation}>
                {locale === 'id' ? 'Ya, Batalkan' : 'Yes, Cancel'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;