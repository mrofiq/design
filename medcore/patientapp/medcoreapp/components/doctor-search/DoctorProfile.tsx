"use client";

import React, { useState } from 'react';
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
  Banknote,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Award,
  GraduationCap,
  Building2,
  Heart,
  Users,
  ChevronLeft,
  Share2,
  Bookmark,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Doctor } from '@/types/doctor';

interface DoctorProfileProps {
  doctor: Doctor;
  isOpen?: boolean;
  onClose?: () => void;
  onBookAppointment?: (doctor: Doctor) => void;
  className?: string;
}

export function DoctorProfile({
  doctor,
  isOpen = false,
  onClose,
  onBookAppointment,
  className
}: DoctorProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: doctor.name,
        text: `Booking konsultasi dengan ${doctor.name}`,
        url: window.location.href,
      });
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const content = (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-start justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBookmark}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Doctor Photo */}
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-white/20">
              <AvatarImage src={doctor.photo} alt={doctor.name} />
              <AvatarFallback className="bg-white/20 text-white text-lg">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            {doctor.isAvailableToday && (
              <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold truncate">{doctor.name}</h1>
              {doctor.isVerified && (
                <BadgeCheck className="h-6 w-6 text-blue-300 flex-shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {doctor.specializations.slice(0, 2).map((spec) => (
                <Badge
                  key={spec.id}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <span className="mr-1">{spec.icon}</span>
                  {spec.nameId || spec.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Stethoscope className="h-4 w-4 text-blue-200" />
                <span>{doctor.experienceYears} tahun</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-300" />
                <span className="font-medium">{doctor.rating.overall}</span>
                <span className="text-blue-200">({doctor.rating.reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {doctor.isAvailableToday ? (
              <Badge className="bg-green-500 text-white">
                <div className="h-2 w-2 bg-white rounded-full mr-2"></div>
                Tersedia Hari Ini
              </Badge>
            ) : (
              <Badge variant="outline" className="border-white/30 text-white">
                <Clock className="h-3 w-3 mr-1" />
                Booking Besok
              </Badge>
            )}
            <div className="text-sm text-blue-200">
              Respon {doctor.responseTime}
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold">
              {formatPrice(doctor.consultationFees.min, doctor.consultationFees.max)}
            </div>
            <div className="text-xs text-blue-200">Biaya konsultasi</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 sticky top-0 z-10">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="experience">Pengalaman</TabsTrigger>
            <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            <TabsTrigger value="schedule">Jadwal</TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6">
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Tentang Dokter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {doctor.bioId || doctor.bio}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-medium">Pendekatan Pengobatan</h4>
                    <p className="text-sm text-muted-foreground">
                      {doctor.treatmentApproachId || doctor.treatmentApproach}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Lokasi Praktik</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.clinics[0]?.name}, {doctor.clinics[0]?.city}
                        </p>
                        {doctor.clinics.length > 1 && (
                          <p className="text-xs text-blue-600">
                            +{doctor.clinics.length - 1} lokasi lainnya
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Bahasa</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.languages.map(lang => lang.nativeName).join(', ')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insurance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Asuransi yang Diterima
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {doctor.insuranceAccepted.map((insurance) => (
                      <Badge
                        key={insurance.id}
                        variant="outline"
                        className="border-green-200 text-green-700"
                      >
                        {insurance.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Clinic Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Klinik & Rumah Sakit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {doctor.clinics.map((clinic) => (
                    <div key={clinic.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{clinic.name}</h4>
                          <p className="text-sm text-muted-foreground">{clinic.address}</p>
                          <p className="text-sm text-muted-foreground">{clinic.city}, {clinic.province}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {clinic.type === 'hospital' ? 'Rumah Sakit' : 'Klinik'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {clinic.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {clinic.operatingHours.monday}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6 mt-0">
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Pendidikan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {doctor.education.map((edu, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year} • {edu.location}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Sertifikasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {doctor.certifications.map((cert, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-muted-foreground">{cert.issuer}</p>
                        <p className="text-sm text-muted-foreground">
                          {cert.year} {cert.expiryYear && `• Berlaku hingga ${cert.expiryYear}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              {doctor.achievements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Pencapaian
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {doctor.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 mt-0">
              {/* Rating Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Rating & Ulasan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Overall Rating */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {doctor.rating.overall}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-5 w-5",
                              star <= Math.round(doctor.rating.overall)
                                ? "fill-current text-yellow-400"
                                : "text-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground">
                        Dari {doctor.rating.reviewCount} ulasan
                      </p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-20">Komunikasi</span>
                        <Progress value={doctor.rating.breakdown.communication * 20} className="flex-1" />
                        <span className="text-sm font-medium w-8">{doctor.rating.breakdown.communication}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-20">Profesional</span>
                        <Progress value={doctor.rating.breakdown.professionalism * 20} className="flex-1" />
                        <span className="text-sm font-medium w-8">{doctor.rating.breakdown.professionalism}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-20">Waktu Tunggu</span>
                        <Progress value={doctor.rating.breakdown.waitTime * 20} className="flex-1" />
                        <span className="text-sm font-medium w-8">{doctor.rating.breakdown.waitTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-20">Penjelasan</span>
                        <Progress value={doctor.rating.breakdown.explanation * 20} className="flex-1" />
                        <span className="text-sm font-medium w-8">{doctor.rating.breakdown.explanation}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ulasan Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mock reviews for demo */}
                  {[
                    {
                      name: 'Sari W.',
                      rating: 5,
                      date: '2 hari lalu',
                      comment: 'Dokter sangat profesional dan sabar menjelaskan kondisi saya. Pelayanan excellent!'
                    },
                    {
                      name: 'Budi S.',
                      rating: 4,
                      date: '1 minggu lalu',
                      comment: 'Pengalaman yang baik. Dokter komunikatif dan diagnosis tepat.'
                    },
                    {
                      name: 'Maya R.',
                      rating: 5,
                      date: '2 minggu lalu',
                      comment: 'Recommended! Dokter ramah dan treatment sangat membantu.'
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-3 w-3",
                                  star <= review.rating
                                    ? "fill-current text-yellow-400"
                                    : "text-gray-200"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Jadwal Tersedia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Pilih tanggal dan waktu konsultasi yang Anda inginkan
                    </p>
                    <Button onClick={handleBooking} size="lg">
                      Lihat Jadwal & Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t p-4 bg-white">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={!doctor.isNewPatientAccepting}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat Dokter
          </Button>
          <Button
            onClick={handleBooking}
            className="flex-1"
            disabled={!doctor.isNewPatientAccepting}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {doctor.isNewPatientAccepting ? 'Booking Sekarang' : 'Penuh'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        {content}
      </DialogContent>
    </Dialog>
  );
}