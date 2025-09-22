'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  User,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  Shield,
  Heart,
  Users,
  CreditCard,
  Info,
} from 'lucide-react';
import { BookingFormData } from '@/types/appointment';
import { Doctor, Clinic } from '@/types/doctor';

const bookingFormSchema = z.object({
  patientNotes: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
  isFirstVisit: z.boolean(),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    phone: z.string().min(1, 'Emergency contact phone is required'),
    relationship: z.string().min(1, 'Relationship is required'),
  }).optional(),
  insuranceInfo: z.object({
    providerId: z.string().min(1, 'Insurance provider is required'),
    policyNumber: z.string().min(1, 'Policy number is required'),
    isVerified: z.boolean(),
  }).optional(),
  preferredLanguage: z.string().optional(),
  specialRequests: z.array(z.string()).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  doctor: Doctor;
  clinic?: Clinic;
  bookingData: Partial<BookingFormData>;
  onSubmit: (data: Partial<BookingFormData>) => void;
  locale?: 'en' | 'id';
  className?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  doctor,
  clinic,
  bookingData,
  onSubmit,
  locale = 'id',
  className,
}) => {
  const [useInsurance, setUseInsurance] = useState(false);
  const [needEmergencyContact, setNeedEmergencyContact] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientNotes: bookingData.patientNotes || '',
      symptoms: bookingData.symptoms || [],
      isFirstVisit: bookingData.isFirstVisit ?? true,
      preferredLanguage: bookingData.preferredLanguage || 'id',
      specialRequests: bookingData.specialRequests || [],
    },
  });

  // Common symptoms for different specializations
  const getCommonSymptoms = () => {
    const specialization = doctor.specializations[0]?.id;

    switch (specialization) {
      case 'cardiology':
        return [
          { id: 'chest-pain', name: 'Chest Pain', nameId: 'Nyeri Dada' },
          { id: 'shortness-breath', name: 'Shortness of Breath', nameId: 'Sesak Napas' },
          { id: 'palpitations', name: 'Palpitations', nameId: 'Jantung Berdebar' },
          { id: 'fatigue', name: 'Fatigue', nameId: 'Kelelahan' },
        ];
      case 'pediatrics':
        return [
          { id: 'fever', name: 'Fever', nameId: 'Demam' },
          { id: 'cough', name: 'Cough', nameId: 'Batuk' },
          { id: 'stomach-ache', name: 'Stomach Ache', nameId: 'Sakit Perut' },
          { id: 'rash', name: 'Rash', nameId: 'Ruam' },
        ];
      case 'general-practitioner':
        return [
          { id: 'fever', name: 'Fever', nameId: 'Demam' },
          { id: 'headache', name: 'Headache', nameId: 'Sakit Kepala' },
          { id: 'cough', name: 'Cough', nameId: 'Batuk' },
          { id: 'sore-throat', name: 'Sore Throat', nameId: 'Sakit Tenggorokan' },
          { id: 'fatigue', name: 'Fatigue', nameId: 'Kelelahan' },
        ];
      default:
        return [
          { id: 'pain', name: 'Pain', nameId: 'Nyeri' },
          { id: 'discomfort', name: 'Discomfort', nameId: 'Ketidaknyamanan' },
          { id: 'other', name: 'Other', nameId: 'Lainnya' },
        ];
    }
  };

  const commonSymptoms = getCommonSymptoms();

  // Special requests options
  const specialRequestsOptions = [
    { id: 'wheelchair-access', name: 'Wheelchair Access', nameId: 'Akses Kursi Roda' },
    { id: 'interpreter', name: 'Interpreter Needed', nameId: 'Butuh Penerjemah' },
    { id: 'privacy-room', name: 'Private Room', nameId: 'Ruangan Privat' },
    { id: 'same-gender-doctor', name: 'Same Gender Doctor', nameId: 'Dokter Sesama Jenis' },
  ];

  const handleFormSubmit = (values: BookingFormValues) => {
    onSubmit(values);
  };

  const toggleSymptom = (symptomId: string) => {
    const currentSymptoms = form.getValues('symptoms') || [];
    const updatedSymptoms = currentSymptoms.includes(symptomId)
      ? currentSymptoms.filter(s => s !== symptomId)
      : [...currentSymptoms, symptomId];

    form.setValue('symptoms', updatedSymptoms);
  };

  const toggleSpecialRequest = (requestId: string) => {
    const currentRequests = form.getValues('specialRequests') || [];
    const updatedRequests = currentRequests.includes(requestId)
      ? currentRequests.filter(r => r !== requestId)
      : [...currentRequests, requestId];

    form.setValue('specialRequests', updatedRequests);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>{locale === 'id' ? 'Informasi Pasien' : 'Patient Information'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* First Visit */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {locale === 'id' ? 'Jenis Kunjungan' : 'Visit Type'}
              </Label>
              <RadioGroup
                value={form.watch('isFirstVisit') ? 'first' : 'follow-up'}
                onValueChange={(value) => form.setValue('isFirstVisit', value === 'first')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="first" id="first-visit" />
                  <Label htmlFor="first-visit" className="text-sm">
                    {locale === 'id' ? 'Kunjungan Pertama' : 'First Visit'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="follow-up" id="follow-up" />
                  <Label htmlFor="follow-up" className="text-sm">
                    {locale === 'id' ? 'Kontrol/Follow-up' : 'Follow-up Visit'}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Preferred Language */}
            <div className="space-y-2">
              <Label htmlFor="language">
                {locale === 'id' ? 'Bahasa yang Diinginkan' : 'Preferred Language'}
              </Label>
              <Select
                value={form.watch('preferredLanguage')}
                onValueChange={(value) => form.setValue('preferredLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={locale === 'id' ? 'Pilih bahasa' : 'Select language'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="local">{locale === 'id' ? 'Bahasa Daerah' : 'Local Language'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms & Chief Complaint */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>{locale === 'id' ? 'Keluhan & Gejala' : 'Symptoms & Chief Complaint'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Common Symptoms */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {locale === 'id' ? 'Gejala yang Dialami' : 'Current Symptoms'}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {commonSymptoms.map((symptom) => (
                  <Button
                    key={symptom.id}
                    type="button"
                    variant={form.watch('symptoms')?.includes(symptom.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleSymptom(symptom.id)}
                    className="justify-start h-auto p-3"
                  >
                    <span className="text-sm">
                      {locale === 'id' ? symptom.nameId : symptom.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                {locale === 'id' ? 'Catatan Tambahan' : 'Additional Notes'}
              </Label>
              <Textarea
                id="notes"
                placeholder={
                  locale === 'id'
                    ? 'Jelaskan keluhan Anda secara detail...'
                    : 'Describe your symptoms in detail...'
                }
                {...form.register('patientNotes')}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {locale === 'id'
                  ? 'Informasi ini membantu dokter mempersiapkan konsultasi yang lebih baik'
                  : 'This information helps the doctor prepare for a better consultation'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>{locale === 'id' ? 'Informasi Asuransi' : 'Insurance Information'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="use-insurance"
                checked={useInsurance}
                onCheckedChange={setUseInsurance}
              />
              <Label htmlFor="use-insurance" className="text-sm">
                {locale === 'id' ? 'Gunakan asuransi untuk pembayaran' : 'Use insurance for payment'}
              </Label>
            </div>

            {useInsurance && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurance-provider">
                      {locale === 'id' ? 'Penyedia Asuransi' : 'Insurance Provider'}
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={locale === 'id' ? 'Pilih asuransi' : 'Select insurance'} />
                      </SelectTrigger>
                      <SelectContent>
                        {doctor.insuranceAccepted?.map((insurance) => (
                          <SelectItem key={insurance.id} value={insurance.id}>
                            {insurance.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policy-number">
                      {locale === 'id' ? 'Nomor Polis' : 'Policy Number'}
                    </Label>
                    <Input
                      id="policy-number"
                      placeholder={locale === 'id' ? 'Masukkan nomor polis' : 'Enter policy number'}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <Info className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    {locale === 'id'
                      ? 'Pastikan asuransi Anda masih aktif dan mencakup layanan ini'
                      : 'Make sure your insurance is active and covers this service'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>{locale === 'id' ? 'Kontak Darurat' : 'Emergency Contact'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergency-contact"
                checked={needEmergencyContact}
                onCheckedChange={setNeedEmergencyContact}
              />
              <Label htmlFor="emergency-contact" className="text-sm">
                {locale === 'id' ? 'Tambahkan kontak darurat' : 'Add emergency contact'}
              </Label>
            </div>

            {needEmergencyContact && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-name">
                      {locale === 'id' ? 'Nama Lengkap' : 'Full Name'}
                    </Label>
                    <Input
                      id="emergency-name"
                      placeholder={locale === 'id' ? 'Nama kontak darurat' : 'Emergency contact name'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency-phone">
                      {locale === 'id' ? 'Nomor Telepon' : 'Phone Number'}
                    </Label>
                    <Input
                      id="emergency-phone"
                      placeholder={locale === 'id' ? 'Nomor telepon' : 'Phone number'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">
                    {locale === 'id' ? 'Hubungan' : 'Relationship'}
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={locale === 'id' ? 'Pilih hubungan' : 'Select relationship'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">{locale === 'id' ? 'Pasangan' : 'Spouse'}</SelectItem>
                      <SelectItem value="parent">{locale === 'id' ? 'Orang Tua' : 'Parent'}</SelectItem>
                      <SelectItem value="child">{locale === 'id' ? 'Anak' : 'Child'}</SelectItem>
                      <SelectItem value="sibling">{locale === 'id' ? 'Saudara' : 'Sibling'}</SelectItem>
                      <SelectItem value="friend">{locale === 'id' ? 'Teman' : 'Friend'}</SelectItem>
                      <SelectItem value="other">{locale === 'id' ? 'Lainnya' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Special Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{locale === 'id' ? 'Permintaan Khusus' : 'Special Requests'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {specialRequestsOptions.map((request) => (
                <Button
                  key={request.id}
                  type="button"
                  variant={form.watch('specialRequests')?.includes(request.id) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleSpecialRequest(request.id)}
                  className="justify-start h-auto p-3"
                >
                  <span className="text-sm">
                    {locale === 'id' ? request.nameId : request.name}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg">
          {locale === 'id' ? 'Lanjutkan ke Konfirmasi' : 'Continue to Confirmation'}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;