'use client';

import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Calendar,
  MapPin,
  Activity,
  Pill,
  Clock,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Enhanced Patient Information Schema
const patientInformationSchema = z.object({
  // Personal Information
  personalInfo: z.object({
    fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    dateOfBirth: z.string().min(1, 'Tanggal lahir wajib diisi'),
    gender: z.enum(['male', 'female'], { required_error: 'Jenis kelamin wajib dipilih' }),
    phoneNumber: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    email: z.string().email('Format email tidak valid').optional(),
    address: z.string().min(10, 'Alamat minimal 10 karakter'),
    idNumber: z.string().min(16, 'NIK harus 16 digit').optional(),
  }),

  // Medical Information
  medicalInfo: z.object({
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']).optional(),
    allergies: z.array(z.string()).optional(),
    chronicConditions: z.array(z.string()).optional(),
    currentMedications: z.array(z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
    })).optional(),
    pastSurgeries: z.array(z.object({
      procedure: z.string(),
      date: z.string(),
      hospital: z.string(),
    })).optional(),
    familyHistory: z.array(z.string()).optional(),
  }),

  // Emergency Contact
  emergencyContact: z.object({
    name: z.string().min(2, 'Nama kontak darurat minimal 2 karakter'),
    relationship: z.string().min(1, 'Hubungan wajib diisi'),
    phoneNumber: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    address: z.string().optional(),
  }),

  // Appointment Specific
  appointmentInfo: z.object({
    chiefComplaint: z.string().min(5, 'Keluhan utama minimal 5 karakter'),
    symptoms: z.array(z.string()).optional(),
    symptomDuration: z.string().optional(),
    painLevel: z.number().min(0).max(10).optional(),
    isFirstVisit: z.boolean(),
    lastVisitDate: z.string().optional(),
    referralSource: z.string().optional(),
    preferredLanguage: z.enum(['id', 'en']).default('id'),
    specialRequests: z.string().optional(),
  }),

  // Consent and Agreements
  consents: z.object({
    treatmentConsent: z.boolean().refine(val => val === true, 'Persetujuan pengobatan wajib diberikan'),
    dataProcessingConsent: z.boolean().refine(val => val === true, 'Persetujuan pemrosesan data wajib diberikan'),
    communicationConsent: z.boolean().default(true),
    marketingConsent: z.boolean().default(false),
  }),
});

type PatientInformationFormData = z.infer<typeof patientInformationSchema>;

interface PatientInformationFormProps {
  onSubmit: (data: PatientInformationFormData) => void;
  onBack?: () => void;
  initialData?: Partial<PatientInformationFormData>;
  locale?: 'en' | 'id';
  className?: string;
}

const PatientInformationForm: React.FC<PatientInformationFormProps> = ({
  onSubmit,
  onBack,
  initialData,
  locale = 'id',
  className,
}) => {
  const [currentTab, setCurrentTab] = useState('personal');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [medications, setMedications] = useState(initialData?.medicalInfo?.currentMedications || []);
  const [surgeries, setSurgeries] = useState(initialData?.medicalInfo?.pastSurgeries || []);

  const form = useForm<PatientInformationFormData>({
    resolver: zodResolver(patientInformationSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        dateOfBirth: '',
        gender: undefined,
        phoneNumber: '',
        email: '',
        address: '',
        idNumber: '',
        ...initialData?.personalInfo,
      },
      medicalInfo: {
        bloodType: 'unknown',
        allergies: [],
        chronicConditions: [],
        currentMedications: medications,
        pastSurgeries: surgeries,
        familyHistory: [],
        ...initialData?.medicalInfo,
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: '',
        address: '',
        ...initialData?.emergencyContact,
      },
      appointmentInfo: {
        chiefComplaint: '',
        symptoms: [],
        symptomDuration: '',
        painLevel: 0,
        isFirstVisit: true,
        lastVisitDate: '',
        referralSource: '',
        preferredLanguage: 'id',
        specialRequests: '',
        ...initialData?.appointmentInfo,
      },
      consents: {
        treatmentConsent: false,
        dataProcessingConsent: false,
        communicationConsent: true,
        marketingConsent: false,
        ...initialData?.consents,
      },
    },
  });

  const { watch, setValue, formState: { errors, isValid } } = form;
  const watchedData = watch();

  // Tab sections configuration
  const tabSections = [
    {
      id: 'personal',
      title: locale === 'id' ? 'Informasi Pribadi' : 'Personal Information',
      icon: User,
      description: locale === 'id' ? 'Data diri dan kontak' : 'Personal and contact details',
    },
    {
      id: 'medical',
      title: locale === 'id' ? 'Informasi Medis' : 'Medical Information',
      icon: Heart,
      description: locale === 'id' ? 'Riwayat kesehatan dan obat' : 'Medical history and medications',
    },
    {
      id: 'emergency',
      title: locale === 'id' ? 'Kontak Darurat' : 'Emergency Contact',
      icon: Users,
      description: locale === 'id' ? 'Kontak yang dapat dihubungi' : 'Emergency contact person',
    },
    {
      id: 'appointment',
      title: locale === 'id' ? 'Keluhan' : 'Appointment Details',
      icon: FileText,
      description: locale === 'id' ? 'Keluhan dan gejala' : 'Symptoms and complaints',
    },
    {
      id: 'consent',
      title: locale === 'id' ? 'Persetujuan' : 'Consent',
      icon: Shield,
      description: locale === 'id' ? 'Persetujuan dan kebijakan' : 'Agreements and policies',
    },
  ];

  // Common allergies and conditions
  const commonAllergies = [
    { id: 'peanuts', name: locale === 'id' ? 'Kacang' : 'Peanuts' },
    { id: 'shellfish', name: locale === 'id' ? 'Kerang' : 'Shellfish' },
    { id: 'eggs', name: locale === 'id' ? 'Telur' : 'Eggs' },
    { id: 'milk', name: locale === 'id' ? 'Susu' : 'Milk' },
    { id: 'dust', name: locale === 'id' ? 'Debu' : 'Dust' },
    { id: 'pollen', name: locale === 'id' ? 'Serbuk sari' : 'Pollen' },
    { id: 'medications', name: locale === 'id' ? 'Obat-obatan' : 'Medications' },
  ];

  const commonConditions = [
    { id: 'diabetes', name: locale === 'id' ? 'Diabetes' : 'Diabetes' },
    { id: 'hypertension', name: locale === 'id' ? 'Hipertensi' : 'Hypertension' },
    { id: 'asthma', name: locale === 'id' ? 'Asma' : 'Asthma' },
    { id: 'heart-disease', name: locale === 'id' ? 'Penyakit Jantung' : 'Heart Disease' },
    { id: 'arthritis', name: locale === 'id' ? 'Arthritis' : 'Arthritis' },
    { id: 'depression', name: locale === 'id' ? 'Depresi' : 'Depression' },
    { id: 'anxiety', name: locale === 'id' ? 'Kecemasan' : 'Anxiety' },
  ];

  const commonSymptoms = [
    { id: 'fever', name: locale === 'id' ? 'Demam' : 'Fever' },
    { id: 'headache', name: locale === 'id' ? 'Sakit Kepala' : 'Headache' },
    { id: 'cough', name: locale === 'id' ? 'Batuk' : 'Cough' },
    { id: 'fatigue', name: locale === 'id' ? 'Kelelahan' : 'Fatigue' },
    { id: 'nausea', name: locale === 'id' ? 'Mual' : 'Nausea' },
    { id: 'dizziness', name: locale === 'id' ? 'Pusing' : 'Dizziness' },
    { id: 'chest-pain', name: locale === 'id' ? 'Nyeri Dada' : 'Chest Pain' },
    { id: 'shortness-breath', name: locale === 'id' ? 'Sesak Napas' : 'Shortness of Breath' },
  ];

  // Section validation
  const validateSection = (sectionId: string): boolean => {
    const data = watchedData;

    switch (sectionId) {
      case 'personal':
        return !!(data.personalInfo?.fullName &&
                 data.personalInfo?.dateOfBirth &&
                 data.personalInfo?.gender &&
                 data.personalInfo?.phoneNumber &&
                 data.personalInfo?.address);
      case 'medical':
        return true; // Optional section
      case 'emergency':
        return !!(data.emergencyContact?.name &&
                 data.emergencyContact?.relationship &&
                 data.emergencyContact?.phoneNumber);
      case 'appointment':
        return !!(data.appointmentInfo?.chiefComplaint);
      case 'consent':
        return !!(data.consents?.treatmentConsent && data.consents?.dataProcessingConsent);
      default:
        return false;
    }
  };

  // Update completed sections
  useEffect(() => {
    const completed = tabSections
      .filter(section => validateSection(section.id))
      .map(section => section.id);
    setCompletedSections(completed);
  }, [watchedData]);

  // Calculate completion percentage
  const completionPercentage = (completedSections.length / tabSections.length) * 100;

  // Add medication
  const addMedication = () => {
    const newMedication = { name: '', dosage: '', frequency: '' };
    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    setValue('medicalInfo.currentMedications', updatedMedications);
  };

  // Remove medication
  const removeMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
    setValue('medicalInfo.currentMedications', updatedMedications);
  };

  // Add surgery
  const addSurgery = () => {
    const newSurgery = { procedure: '', date: '', hospital: '' };
    const updatedSurgeries = [...surgeries, newSurgery];
    setSurgeries(updatedSurgeries);
    setValue('medicalInfo.pastSurgeries', updatedSurgeries);
  };

  // Remove surgery
  const removeSurgery = (index: number) => {
    const updatedSurgeries = surgeries.filter((_, i) => i !== index);
    setSurgeries(updatedSurgeries);
    setValue('medicalInfo.pastSurgeries', updatedSurgeries);
  };

  // Handle multi-select fields
  const toggleArrayField = (fieldPath: string, value: string) => {
    const currentValues = watchedData[fieldPath as keyof typeof watchedData] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setValue(fieldPath as any, newValues);
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {locale === 'id' ? 'Informasi Pasien' : 'Patient Information'}
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {Math.round(completionPercentage)}% {locale === 'id' ? 'Lengkap' : 'Complete'}
          </Badge>
        </div>
        <Progress value={completionPercentage} className="mt-2" />
      </CardHeader>

      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {tabSections.map((section) => {
              const Icon = section.icon;
              const isCompleted = completedSections.includes(section.id);
              const hasErrors = Object.keys(errors).some(key => key.startsWith(section.id));

              return (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3',
                    isCompleted && 'text-green-600',
                    hasErrors && 'text-red-600'
                  )}
                >
                  <div className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    {isCompleted && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                    {hasErrors && <AlertCircle className="h-3 w-3 text-red-600" />}
                  </div>
                  <span className="text-xs hidden sm:block">{section.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {locale === 'id' ? 'Informasi Pribadi' : 'Personal Information'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    {locale === 'id' ? 'Nama Lengkap' : 'Full Name'} *
                  </Label>
                  <Input
                    id="fullName"
                    {...form.register('personalInfo.fullName')}
                    placeholder={locale === 'id' ? 'Masukkan nama lengkap' : 'Enter full name'}
                  />
                  {errors.personalInfo?.fullName && (
                    <p className="text-sm text-red-600">{errors.personalInfo.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    {locale === 'id' ? 'Tanggal Lahir' : 'Date of Birth'} *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...form.register('personalInfo.dateOfBirth')}
                  />
                  {errors.personalInfo?.dateOfBirth && (
                    <p className="text-sm text-red-600">{errors.personalInfo.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>{locale === 'id' ? 'Jenis Kelamin' : 'Gender'} *</Label>
                  <RadioGroup
                    value={watchedData.personalInfo?.gender}
                    onValueChange={(value) => setValue('personalInfo.gender', value as 'male' | 'female')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">{locale === 'id' ? 'Laki-laki' : 'Male'}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">{locale === 'id' ? 'Perempuan' : 'Female'}</Label>
                    </div>
                  </RadioGroup>
                  {errors.personalInfo?.gender && (
                    <p className="text-sm text-red-600">{errors.personalInfo.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    {locale === 'id' ? 'Nomor Telepon' : 'Phone Number'} *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...form.register('personalInfo.phoneNumber')}
                    placeholder={locale === 'id' ? '+62812345678' : '+62812345678'}
                  />
                  {errors.personalInfo?.phoneNumber && (
                    <p className="text-sm text-red-600">{errors.personalInfo.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {locale === 'id' ? 'Email' : 'Email'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('personalInfo.email')}
                    placeholder={locale === 'id' ? 'nama@email.com' : 'name@email.com'}
                  />
                  {errors.personalInfo?.email && (
                    <p className="text-sm text-red-600">{errors.personalInfo.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">
                    {locale === 'id' ? 'NIK (Opsional)' : 'ID Number (Optional)'}
                  </Label>
                  <Input
                    id="idNumber"
                    {...form.register('personalInfo.idNumber')}
                    placeholder={locale === 'id' ? '16 digit NIK' : '16 digit ID number'}
                    maxLength={16}
                  />
                  {errors.personalInfo?.idNumber && (
                    <p className="text-sm text-red-600">{errors.personalInfo.idNumber.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  {locale === 'id' ? 'Alamat Lengkap' : 'Complete Address'} *
                </Label>
                <Textarea
                  id="address"
                  {...form.register('personalInfo.address')}
                  placeholder={locale === 'id' ? 'Jalan, nomor, kelurahan, kecamatan, kota, provinsi' : 'Street, number, district, city, province'}
                  rows={3}
                />
                {errors.personalInfo?.address && (
                  <p className="text-sm text-red-600">{errors.personalInfo.address.message}</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Medical Information Tab */}
          <TabsContent value="medical" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {locale === 'id' ? 'Informasi Medis' : 'Medical Information'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{locale === 'id' ? 'Golongan Darah' : 'Blood Type'}</Label>
                  <Select
                    value={watchedData.medicalInfo?.bloodType}
                    onValueChange={(value) => setValue('medicalInfo.bloodType', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={locale === 'id' ? 'Pilih golongan darah' : 'Select blood type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">{locale === 'id' ? 'Tidak Diketahui' : 'Unknown'}</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>{locale === 'id' ? 'Alergi' : 'Allergies'}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonAllergies.map((allergy) => (
                    <div key={allergy.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`allergy-${allergy.id}`}
                        checked={watchedData.medicalInfo?.allergies?.includes(allergy.id)}
                        onCheckedChange={() => toggleArrayField('medicalInfo.allergies', allergy.id)}
                      />
                      <Label htmlFor={`allergy-${allergy.id}`} className="text-sm">
                        {allergy.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>{locale === 'id' ? 'Kondisi Kronis' : 'Chronic Conditions'}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {commonConditions.map((condition) => (
                    <div key={condition.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${condition.id}`}
                        checked={watchedData.medicalInfo?.chronicConditions?.includes(condition.id)}
                        onCheckedChange={() => toggleArrayField('medicalInfo.chronicConditions', condition.id)}
                      />
                      <Label htmlFor={`condition-${condition.id}`} className="text-sm">
                        {condition.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{locale === 'id' ? 'Obat yang Sedang Dikonsumsi' : 'Current Medications'}</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                    <Plus className="h-4 w-4 mr-1" />
                    {locale === 'id' ? 'Tambah' : 'Add'}
                  </Button>
                </div>
                {medications.map((medication, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        placeholder={locale === 'id' ? 'Nama obat' : 'Medication name'}
                        value={medication.name}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[index].name = e.target.value;
                          setMedications(updated);
                          setValue('medicalInfo.currentMedications', updated);
                        }}
                      />
                      <Input
                        placeholder={locale === 'id' ? 'Dosis' : 'Dosage'}
                        value={medication.dosage}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[index].dosage = e.target.value;
                          setMedications(updated);
                          setValue('medicalInfo.currentMedications', updated);
                        }}
                      />
                      <Input
                        placeholder={locale === 'id' ? 'Frekuensi' : 'Frequency'}
                        value={medication.frequency}
                        onChange={(e) => {
                          const updated = [...medications];
                          updated[index].frequency = e.target.value;
                          setMedications(updated);
                          setValue('medicalInfo.currentMedications', updated);
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Emergency Contact Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {locale === 'id' ? 'Kontak Darurat' : 'Emergency Contact'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">
                    {locale === 'id' ? 'Nama Kontak Darurat' : 'Emergency Contact Name'} *
                  </Label>
                  <Input
                    id="emergencyName"
                    {...form.register('emergencyContact.name')}
                    placeholder={locale === 'id' ? 'Nama lengkap kontak darurat' : 'Full name of emergency contact'}
                  />
                  {errors.emergencyContact?.name && (
                    <p className="text-sm text-red-600">{errors.emergencyContact.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">
                    {locale === 'id' ? 'Hubungan' : 'Relationship'} *
                  </Label>
                  <Select
                    value={watchedData.emergencyContact?.relationship}
                    onValueChange={(value) => setValue('emergencyContact.relationship', value)}
                  >
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
                  {errors.emergencyContact?.relationship && (
                    <p className="text-sm text-red-600">{errors.emergencyContact.relationship.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">
                    {locale === 'id' ? 'Nomor Telepon' : 'Phone Number'} *
                  </Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    {...form.register('emergencyContact.phoneNumber')}
                    placeholder={locale === 'id' ? '+62812345678' : '+62812345678'}
                  />
                  {errors.emergencyContact?.phoneNumber && (
                    <p className="text-sm text-red-600">{errors.emergencyContact.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyAddress">
                    {locale === 'id' ? 'Alamat (Opsional)' : 'Address (Optional)'}
                  </Label>
                  <Input
                    id="emergencyAddress"
                    {...form.register('emergencyContact.address')}
                    placeholder={locale === 'id' ? 'Alamat kontak darurat' : 'Emergency contact address'}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Appointment Details Tab */}
          <TabsContent value="appointment" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {locale === 'id' ? 'Detail Keluhan' : 'Appointment Details'}
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chiefComplaint">
                    {locale === 'id' ? 'Keluhan Utama' : 'Chief Complaint'} *
                  </Label>
                  <Textarea
                    id="chiefComplaint"
                    {...form.register('appointmentInfo.chiefComplaint')}
                    placeholder={locale === 'id' ? 'Jelaskan keluhan utama Anda...' : 'Describe your main complaint...'}
                    rows={3}
                  />
                  {errors.appointmentInfo?.chiefComplaint && (
                    <p className="text-sm text-red-600">{errors.appointmentInfo.chiefComplaint.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>{locale === 'id' ? 'Gejala yang Dialami' : 'Symptoms'}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`symptom-${symptom.id}`}
                          checked={watchedData.appointmentInfo?.symptoms?.includes(symptom.id)}
                          onCheckedChange={() => toggleArrayField('appointmentInfo.symptoms', symptom.id)}
                        />
                        <Label htmlFor={`symptom-${symptom.id}`} className="text-sm">
                          {symptom.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptomDuration">
                      {locale === 'id' ? 'Durasi Gejala' : 'Symptom Duration'}
                    </Label>
                    <Select
                      value={watchedData.appointmentInfo?.symptomDuration}
                      onValueChange={(value) => setValue('appointmentInfo.symptomDuration', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={locale === 'id' ? 'Pilih durasi' : 'Select duration'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">{locale === 'id' ? 'Beberapa jam' : 'Few hours'}</SelectItem>
                        <SelectItem value="days">{locale === 'id' ? 'Beberapa hari' : 'Few days'}</SelectItem>
                        <SelectItem value="weeks">{locale === 'id' ? 'Beberapa minggu' : 'Few weeks'}</SelectItem>
                        <SelectItem value="months">{locale === 'id' ? 'Beberapa bulan' : 'Few months'}</SelectItem>
                        <SelectItem value="chronic">{locale === 'id' ? 'Kronis (>6 bulan)' : 'Chronic (>6 months)'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      {locale === 'id' ? 'Tingkat Nyeri (0-10)' : 'Pain Level (0-10)'}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">0</span>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={watchedData.appointmentInfo?.painLevel || 0}
                        onChange={(e) => setValue('appointmentInfo.painLevel', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm">10</span>
                      <Badge variant="outline" className="min-w-8">
                        {watchedData.appointmentInfo?.painLevel || 0}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{locale === 'id' ? 'Jenis Kunjungan' : 'Visit Type'}</Label>
                  <RadioGroup
                    value={watchedData.appointmentInfo?.isFirstVisit ? 'first' : 'follow-up'}
                    onValueChange={(value) => setValue('appointmentInfo.isFirstVisit', value === 'first')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="first" id="first" />
                      <Label htmlFor="first">{locale === 'id' ? 'Kunjungan Pertama' : 'First Visit'}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="follow-up" id="follow-up" />
                      <Label htmlFor="follow-up">{locale === 'id' ? 'Kunjungan Ulang' : 'Follow-up Visit'}</Label>
                    </div>
                  </RadioGroup>
                </div>

                {!watchedData.appointmentInfo?.isFirstVisit && (
                  <div className="space-y-2">
                    <Label htmlFor="lastVisitDate">
                      {locale === 'id' ? 'Tanggal Kunjungan Terakhir' : 'Last Visit Date'}
                    </Label>
                    <Input
                      id="lastVisitDate"
                      type="date"
                      {...form.register('appointmentInfo.lastVisitDate')}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">
                    {locale === 'id' ? 'Permintaan Khusus' : 'Special Requests'}
                  </Label>
                  <Textarea
                    id="specialRequests"
                    {...form.register('appointmentInfo.specialRequests')}
                    placeholder={locale === 'id' ? 'Permintaan khusus atau informasi tambahan...' : 'Special requests or additional information...'}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Consent Tab */}
          <TabsContent value="consent" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {locale === 'id' ? 'Persetujuan dan Kebijakan' : 'Consent and Policies'}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="treatmentConsent"
                    checked={watchedData.consents?.treatmentConsent}
                    onCheckedChange={(checked) => setValue('consents.treatmentConsent', !!checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="treatmentConsent" className="font-medium">
                      {locale === 'id' ? 'Persetujuan Pengobatan' : 'Treatment Consent'} *
                    </Label>
                    <p className="text-sm text-gray-600">
                      {locale === 'id'
                        ? 'Saya menyetujui untuk menerima perawatan medis yang diperlukan dan memahami risiko yang terkait.'
                        : 'I consent to receive necessary medical treatment and understand the associated risks.'
                      }
                    </p>
                  </div>
                </div>
                {errors.consents?.treatmentConsent && (
                  <p className="text-sm text-red-600 ml-6">{errors.consents.treatmentConsent.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="dataProcessingConsent"
                    checked={watchedData.consents?.dataProcessingConsent}
                    onCheckedChange={(checked) => setValue('consents.dataProcessingConsent', !!checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="dataProcessingConsent" className="font-medium">
                      {locale === 'id' ? 'Persetujuan Pemrosesan Data' : 'Data Processing Consent'} *
                    </Label>
                    <p className="text-sm text-gray-600">
                      {locale === 'id'
                        ? 'Saya menyetujui pemrosesan data pribadi saya untuk keperluan medis dan administrasi sesuai kebijakan privasi.'
                        : 'I consent to the processing of my personal data for medical and administrative purposes according to the privacy policy.'
                      }
                    </p>
                  </div>
                </div>
                {errors.consents?.dataProcessingConsent && (
                  <p className="text-sm text-red-600 ml-6">{errors.consents.dataProcessingConsent.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="communicationConsent"
                    checked={watchedData.consents?.communicationConsent}
                    onCheckedChange={(checked) => setValue('consents.communicationConsent', !!checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="communicationConsent" className="font-medium">
                      {locale === 'id' ? 'Persetujuan Komunikasi' : 'Communication Consent'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {locale === 'id'
                        ? 'Saya menyetujui untuk menerima komunikasi terkait janji temu, hasil, dan informasi medis.'
                        : 'I consent to receive communications regarding appointments, results, and medical information.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketingConsent"
                    checked={watchedData.consents?.marketingConsent}
                    onCheckedChange={(checked) => setValue('consents.marketingConsent', !!checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="marketingConsent" className="font-medium">
                      {locale === 'id' ? 'Persetujuan Pemasaran' : 'Marketing Consent'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {locale === 'id'
                        ? 'Saya menyetujui untuk menerima informasi promosi, tips kesehatan, dan penawaran khusus.'
                        : 'I consent to receive promotional information, health tips, and special offers.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {locale === 'id'
                    ? 'Dengan melanjutkan, Anda menyetujui syarat dan ketentuan layanan kami. Data Anda akan dijaga kerahasiaannya sesuai standar medis.'
                    : 'By proceeding, you agree to our terms and conditions of service. Your data will be kept confidential according to medical standards.'
                  }
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8 pt-4 border-t">
          <Button variant="outline" onClick={onBack} disabled={!onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'id' ? 'Kembali' : 'Back'}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {completedSections.length} / {tabSections.length} {locale === 'id' ? 'bagian lengkap' : 'sections complete'}
            </span>
            <Button
              onClick={handleSubmit}
              disabled={completedSections.length < 4} // Require personal, emergency, appointment, and consent
              className="min-w-24"
            >
              {locale === 'id' ? 'Lanjutkan' : 'Continue'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInformationForm;