'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Video,
  Stethoscope,
  FileText,
  Zap,
  Heart,
  Shield,
  Users,
  Info,
  Star,
  Calendar,
} from 'lucide-react';
import { AppointmentType } from '@/types/appointment';
import { mockAppointmentTypes } from '@/data/mockSchedules';

interface AppointmentTypeSelectorProps {
  selectedTypeId?: string;
  onTypeSelect: (type: AppointmentType) => void;
  doctorSpecialization?: string;
  clinicType?: 'hospital' | 'clinic';
  isOnlineAvailable?: boolean;
  showPrices?: boolean;
  showDescriptions?: boolean;
  locale?: 'en' | 'id';
  className?: string;
  compact?: boolean;
  filterBySpecialization?: boolean;
}

const AppointmentTypeSelector: React.FC<AppointmentTypeSelectorProps> = ({
  selectedTypeId,
  onTypeSelect,
  doctorSpecialization,
  clinicType = 'clinic',
  isOnlineAvailable = true,
  showPrices = true,
  showDescriptions = true,
  locale = 'id',
  className,
  compact = false,
  filterBySpecialization = false,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter appointment types based on context
  const availableTypes = mockAppointmentTypes.filter(type => {
    // Filter emergency types for non-hospital settings
    if (type.isEmergency && clinicType !== 'hospital') {
      return false;
    }

    // Filter online types if not available
    if (type.allowsOnline && !isOnlineAvailable) {
      return false;
    }

    // Filter by specialization if needed
    if (filterBySpecialization && doctorSpecialization) {
      // This would be a more complex mapping in a real app
      const specialistTypes = ['specialist-consultation', 'procedure', 'health-checkup'];
      const generalTypes = ['consultation', 'follow-up', 'telemedicine', 'vaccination'];

      if (doctorSpecialization === 'general-practitioner') {
        return generalTypes.includes(type.id);
      } else {
        return specialistTypes.includes(type.id) || generalTypes.includes(type.id);
      }
    }

    return true;
  });

  // Group types by category
  const groupedTypes = {
    consultation: availableTypes.filter(type =>
      ['consultation', 'specialist-consultation', 'telemedicine'].includes(type.id)
    ),
    followUp: availableTypes.filter(type =>
      ['follow-up'].includes(type.id)
    ),
    procedure: availableTypes.filter(type =>
      ['procedure', 'health-checkup', 'vaccination'].includes(type.id)
    ),
    emergency: availableTypes.filter(type =>
      type.isEmergency
    ),
  };

  // Format price
  const formatPrice = (min: number, max: number): string => {
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    if (min === max) {
      return formatter.format(min);
    }
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  // Get type icon with proper styling
  const getTypeIcon = (type: AppointmentType) => {
    const iconMap: Record<string, React.ReactNode> = {
      'consultation': <Stethoscope className="h-5 w-5" />,
      'follow-up': <FileText className="h-5 w-5" />,
      'procedure': <Heart className="h-5 w-5" />,
      'specialist-consultation': <Star className="h-5 w-5" />,
      'telemedicine': <Video className="h-5 w-5" />,
      'emergency': <Zap className="h-5 w-5" />,
      'health-checkup': <Shield className="h-5 w-5" />,
      'vaccination': <Shield className="h-5 w-5" />,
    };

    return iconMap[type.id] || <span className="text-lg">{type.icon}</span>;
  };

  // Get priority badge
  const getPriorityBadge = (type: AppointmentType) => {
    if (type.isEmergency) {
      return (
        <Badge variant="destructive" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          {locale === 'id' ? 'Darurat' : 'Emergency'}
        </Badge>
      );
    }

    if (type.id === 'telemedicine') {
      return (
        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
          <Video className="h-3 w-3 mr-1" />
          {locale === 'id' ? 'Online' : 'Online'}
        </Badge>
      );
    }

    if (type.requiresPreparation) {
      return (
        <Badge variant="outline" className="text-xs">
          <Info className="h-3 w-3 mr-1" />
          {locale === 'id' ? 'Perlu Persiapan' : 'Preparation Required'}
        </Badge>
      );
    }

    return null;
  };

  // Render type card
  const renderTypeCard = (type: AppointmentType, isCompact = false) => {
    const isSelected = selectedTypeId === type.id;

    return (
      <Card
        key={type.id}
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          'min-h-[44px]', // Touch-friendly minimum height
          isSelected && 'ring-2 ring-primary ring-offset-2 bg-primary/5',
          type.isEmergency && 'border-red-200 hover:border-red-300',
          isCompact ? 'p-2' : 'p-4'
        )}
        onClick={() => onTypeSelect(type)}
      >
        <CardContent className={cn('p-0', !isCompact && 'space-y-3')}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                'flex items-center justify-center rounded-lg p-2',
                type.isEmergency ? 'bg-red-100' : 'bg-gray-100'
              )} style={{ backgroundColor: `${type.color}20` }}>
                {getTypeIcon(type)}
              </div>

              <div className="flex-1">
                <h3 className={cn(
                  'font-semibold',
                  isCompact ? 'text-sm' : 'text-base'
                )}>
                  {locale === 'id' ? type.nameId : type.name}
                </h3>

                {!isCompact && showDescriptions && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {locale === 'id' ? type.descriptionId : type.description}
                  </p>
                )}

                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {type.duration} {locale === 'id' ? 'menit' : 'minutes'}
                    </span>
                  </div>

                  {showPrices && (
                    <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                      <DollarSign className="h-3 w-3" />
                      <span>{formatPrice(type.price.min, type.price.max)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {isSelected && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
              {getPriorityBadge(type)}
            </div>
          </div>

          {/* Additional info for selected type */}
          {isSelected && !isCompact && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    {locale === 'id' ? 'Durasi:' : 'Duration:'}
                  </span>
                  <span className="ml-2">{type.duration} {locale === 'id' ? 'menit' : 'minutes'}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    {locale === 'id' ? 'Biaya:' : 'Fee:'}
                  </span>
                  <span className="ml-2">{formatPrice(type.price.min, type.price.max)}</span>
                </div>
                {type.allowsOnline && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      {locale === 'id' ? 'Online:' : 'Online:'}
                    </span>
                    <span className="ml-2 text-green-600">
                      {locale === 'id' ? 'Tersedia' : 'Available'}
                    </span>
                  </div>
                )}
                {type.requiresPreparation && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      {locale === 'id' ? 'Persiapan:' : 'Preparation:'}
                    </span>
                    <span className="ml-2 text-orange-600">
                      {locale === 'id' ? 'Diperlukan' : 'Required'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render category section
  const renderCategorySection = (
    title: string,
    titleId: string,
    types: AppointmentType[],
    icon: React.ReactNode
  ) => {
    if (types.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-semibold text-lg">
            {locale === 'id' ? titleId : title}
          </h3>
          <Badge variant="outline" className="ml-auto">
            {types.length}
          </Badge>
        </div>

        <div className={cn(
          viewMode === 'grid'
            ? 'grid gap-3'
            : 'space-y-3',
          viewMode === 'grid' && !compact && 'grid-cols-1 lg:grid-cols-2'
        )}>
          {types.map(type => renderTypeCard(type, viewMode === 'list' || compact))}
        </div>
      </div>
    );
  };

  if (availableTypes.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <h3 className="font-medium mb-1">
              {locale === 'id' ? 'Tidak Ada Jenis Konsultasi' : 'No Appointment Types Available'}
            </h3>
            <p className="text-sm">
              {locale === 'id'
                ? 'Tidak ada jenis konsultasi yang tersedia untuk dokter ini'
                : 'No appointment types are available for this doctor'}
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
          <CardTitle className={cn('text-lg font-semibold', compact && 'text-base')}>
            {locale === 'id' ? 'Pilih Jenis Konsultasi' : 'Select Appointment Type'}
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <span className="text-xs">{locale === 'id' ? 'Kartu' : 'Cards'}</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <span className="text-xs">{locale === 'id' ? 'Daftar' : 'List'}</span>
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {locale === 'id'
            ? 'Pilih jenis konsultasi yang sesuai dengan kebutuhan Anda'
            : 'Choose the type of consultation that fits your needs'}
        </p>
      </CardHeader>

      <CardContent>
        <ScrollArea className={cn('space-y-6', compact ? 'h-64' : 'h-96')}>
          <div className="space-y-6">
            {/* Emergency Services */}
            {renderCategorySection(
              'Emergency Services',
              'Layanan Darurat',
              groupedTypes.emergency,
              <Zap className="h-5 w-5 text-red-500" />
            )}

            {groupedTypes.emergency.length > 0 && <Separator />}

            {/* Consultations */}
            {renderCategorySection(
              'Consultations',
              'Konsultasi',
              groupedTypes.consultation,
              <Stethoscope className="h-5 w-5 text-blue-500" />
            )}

            {groupedTypes.consultation.length > 0 && <Separator />}

            {/* Follow-up */}
            {renderCategorySection(
              'Follow-up Visits',
              'Kunjungan Kontrol',
              groupedTypes.followUp,
              <FileText className="h-5 w-5 text-green-500" />
            )}

            {groupedTypes.followUp.length > 0 && <Separator />}

            {/* Procedures */}
            {renderCategorySection(
              'Procedures & Checkups',
              'Prosedur & Pemeriksaan',
              groupedTypes.procedure,
              <Heart className="h-5 w-5 text-purple-500" />
            )}
          </div>
        </ScrollArea>

        {/* Information Footer */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                {locale === 'id' ? 'Informasi Penting:' : 'Important Information:'}
              </p>
              <ul className="space-y-1 text-xs">
                <li>
                  {locale === 'id'
                    ? '• Harga dapat berubah tergantung kondisi dan tindakan yang diperlukan'
                    : '• Prices may vary depending on conditions and required procedures'}
                </li>
                <li>
                  {locale === 'id'
                    ? '• Konsultasi online tersedia untuk jenis tertentu'
                    : '• Online consultations are available for certain types'}
                </li>
                <li>
                  {locale === 'id'
                    ? '• Beberapa jenis memerlukan persiapan khusus sebelum kedatangan'
                    : '• Some types require special preparation before arrival'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentTypeSelector;