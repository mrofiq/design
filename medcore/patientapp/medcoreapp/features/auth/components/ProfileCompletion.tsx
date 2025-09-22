'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Phone,
  Users,
  Heart,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Mail,
  UserCheck,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import {
  User as UserType,
  BloodGroup,
  BaseAuthComponentProps
} from '@/types/auth';
import { useAuthStore, useUser } from '../stores/authStore';
import PhoneInput from './PhoneInput';

/**
 * ProfileCompletion Component
 *
 * A comprehensive profile completion form for new users
 * Features:
 * - Multi-step completion process
 * - Pre-filled data from social login
 * - Required and optional fields
 * - Medical information collection
 * - Emergency contact setup
 * - Progress tracking
 * - Data validation
 * - Mobile-optimized interface
 * - Accessibility compliant (WCAG 2.1 AA)
 */

// Validation schema
const profileSchema = z.object({
  // Personal Information (required)
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Please enter a valid date of birth'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select your gender'
  }),

  // Contact Information
  phoneNumber: z.string().min(1, 'Phone number is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),

  // Emergency Contact (required)
  emergencyContactName: z.string()
    .min(2, 'Emergency contact name is required'),
  emergencyContactRelationship: z.string()
    .min(1, 'Please specify the relationship'),
  emergencyContactPhone: z.string()
    .min(1, 'Emergency contact phone is required'),
  emergencyContactCountryCode: z.string()
    .min(1, 'Country code is required'),

  // Medical Information (optional)
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const).optional(),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),

  // Preferences
  language: z.enum(['en', 'id']),
  allowMarketingEmails: z.boolean().optional()
});

interface ProfileCompletionProps extends BaseAuthComponentProps {
  onProfileComplete?: (user: UserType) => void;
  onSkip?: () => void;
  allowSkip?: boolean;
  requiredFields?: string[];
}

interface CompletionState {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  canSkip: boolean;
}

const INITIAL_STATE: CompletionState = {
  currentStep: 1,
  totalSteps: 4,
  isSubmitting: false,
  canSkip: false
};

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const RELATIONSHIPS = [
  'Parent', 'Spouse', 'Sibling', 'Child', 'Relative', 'Friend', 'Partner', 'Guardian', 'Other'
];

const COMMON_ALLERGIES = [
  'Penicillin', 'Aspirin', 'Ibuprofen', 'Codeine', 'Morphine', 'Latex', 'Peanuts',
  'Shellfish', 'Eggs', 'Milk', 'Soy', 'Wheat', 'Tree nuts', 'Fish', 'Dust mites',
  'Pollen', 'Pet dander', 'Mold', 'Insect stings'
];

const COMMON_CONDITIONS = [
  'Diabetes', 'Hypertension', 'Heart disease', 'Asthma', 'Arthritis', 'Depression',
  'Anxiety', 'Migraine', 'Epilepsy', 'Thyroid disorder', 'Kidney disease',
  'Liver disease', 'Cancer', 'Osteoporosis', 'COPD'
];

export function ProfileCompletion({
  onProfileComplete,
  onSkip,
  onSuccess,
  onError,
  className,
  disabled = false,
  loading = false,
  allowSkip = false,
  requiredFields = [],
  ...props
}: ProfileCompletionProps) {
  const [state, setState] = useState<CompletionState>(INITIAL_STATE);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const user = useUser();
  const { updateProfile } = useAuthStore();

  // Form with pre-filled data from user
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
      gender: user?.gender || undefined,
      phoneNumber: user?.phoneNumber || '',
      countryCode: user?.countryCode || 'ID',
      email: user?.email || '',
      emergencyContactName: user?.emergencyContact?.name || '',
      emergencyContactRelationship: user?.emergencyContact?.relationship || '',
      emergencyContactPhone: user?.emergencyContact?.phoneNumber || '',
      emergencyContactCountryCode: user?.emergencyContact?.countryCode || 'ID',
      bloodGroup: user?.bloodGroup,
      allergies: user?.allergies || [],
      chronicConditions: user?.chronicConditions || [],
      currentMedications: user?.currentMedications || [],
      language: user?.language || 'en',
      allowMarketingEmails: true
    }
  });

  // Calculate progress percentage
  const progressPercentage = (state.currentStep / state.totalSteps) * 100;

  // Step configurations
  const stepConfig = [
    {
      number: 1,
      title: 'Personal Information',
      description: 'Basic information about you',
      icon: User,
      required: true
    },
    {
      number: 2,
      title: 'Contact Details',
      description: 'How we can reach you',
      icon: Phone,
      required: true
    },
    {
      number: 3,
      title: 'Emergency Contact',
      description: 'Someone we can contact in emergencies',
      icon: Users,
      required: true
    },
    {
      number: 4,
      title: 'Medical Information',
      description: 'Optional medical details for better care',
      icon: Heart,
      required: false
    }
  ];

  const currentStepConfig = stepConfig[state.currentStep - 1];

  // Check if current step is valid
  const isCurrentStepValid = () => {
    const stepFields = getStepFields(state.currentStep);
    return stepFields.every(field => {
      const value = form.getValues(field as any);
      return value !== '' && value !== undefined;
    });
  };

  // Get fields for current step
  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['fullName', 'dateOfBirth', 'gender'];
      case 2:
        return ['phoneNumber', 'countryCode'];
      case 3:
        return ['emergencyContactName', 'emergencyContactRelationship', 'emergencyContactPhone', 'emergencyContactCountryCode'];
      case 4:
        return []; // Optional step
      default:
        return [];
    }
  };

  // Handle next step
  const handleNextStep = async () => {
    const stepFields = getStepFields(state.currentStep);
    const isValid = await form.trigger(stepFields as any);

    if (!isValid) return;

    if (state.currentStep < state.totalSteps) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        canSkip: state.currentStep + 1 === state.totalSteps && allowSkip
      }));
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (state.currentStep > 1) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
        canSkip: false
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const formData = form.getValues();

      // Prepare update data
      const updateData: Partial<UserType> = {
        fullName: formData.fullName,
        dateOfBirth: new Date(formData.dateOfBirth),
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        countryCode: formData.countryCode,
        email: formData.email || undefined,
        bloodGroup: formData.bloodGroup,
        allergies: selectedAllergies.length > 0 ? selectedAllergies : formData.allergies,
        chronicConditions: selectedConditions.length > 0 ? selectedConditions : formData.chronicConditions,
        currentMedications: formData.currentMedications,
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phoneNumber: formData.emergencyContactPhone,
          countryCode: formData.emergencyContactCountryCode
        },
        language: formData.language,
        updatedAt: new Date()
      };

      // Update profile
      const updatedUser = await updateProfile(updateData);

      setState(prev => ({ ...prev, isSubmitting: false }));

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been completed successfully.',
        variant: 'default'
      });

      onProfileComplete?.(updatedUser);
      onSuccess?.(updatedUser);

    } catch (error) {
      setState(prev => ({ ...prev, isSubmitting: false }));

      const errorMessage = 'Failed to update profile. Please try again.';
      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive'
      });

      onError?.(error as any);
    }
  };

  // Handle skip
  const handleSkip = () => {
    if (state.canSkip) {
      onSkip?.();
    }
  };

  // Handle allergy toggle
  const handleAllergyToggle = (allergy: string) => {
    const newAllergies = selectedAllergies.includes(allergy)
      ? selectedAllergies.filter(a => a !== allergy)
      : [...selectedAllergies, allergy];

    setSelectedAllergies(newAllergies);
    form.setValue('allergies', newAllergies);
  };

  // Handle condition toggle
  const handleConditionToggle = (condition: string) => {
    const newConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter(c => c !== condition)
      : [...selectedConditions, condition];

    setSelectedConditions(newConditions);
    form.setValue('chronicConditions', newConditions);
  };

  // Render step content
  const renderStepContent = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...form.register('fullName')}
                className="h-12"
                disabled={disabled}
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-red-600">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...form.register('dateOfBirth')}
                className="h-12"
                disabled={disabled}
              />
              {form.formState.errors.dateOfBirth && (
                <p className="text-sm text-red-600">{form.formState.errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <Label>Gender *</Label>
              <RadioGroup
                value={form.watch('gender')}
                onValueChange={(value) => form.setValue('gender', value)}
                className="grid grid-cols-3 gap-4"
                disabled={disabled}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="font-normal">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="font-normal">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="font-normal">Other</Label>
                </div>
              </RadioGroup>
              {form.formState.errors.gender && (
                <p className="text-sm text-red-600">{form.formState.errors.gender.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            {/* Phone Number */}
            <PhoneInput
              defaultCountry={form.watch('countryCode')}
              onSuccess={(phoneData) => {
                form.setValue('phoneNumber', phoneData.phoneNumber);
                form.setValue('countryCode', phoneData.countryCode);
              }}
              onValidationChange={(isValid) => {
                if (!isValid) {
                  form.setError('phoneNumber', { message: 'Please enter a valid phone number' });
                } else {
                  form.clearErrors('phoneNumber');
                }
              }}
              disabled={disabled}
            />
            {form.formState.errors.phoneNumber && (
              <p className="text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>
            )}

            {/* Email (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...form.register('email')}
                className="h-12"
                disabled={disabled}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
              <p className="text-xs text-gray-500">
                We'll use this for appointment confirmations and important updates
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Emergency contact information is required for safety purposes and will only be used in case of medical emergencies.
              </AlertDescription>
            </Alert>

            {/* Emergency Contact Name */}
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
              <Input
                id="emergencyContactName"
                placeholder="Full name of emergency contact"
                {...form.register('emergencyContactName')}
                className="h-12"
                disabled={disabled}
              />
              {form.formState.errors.emergencyContactName && (
                <p className="text-sm text-red-600">{form.formState.errors.emergencyContactName.message}</p>
              )}
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Select
                value={form.watch('emergencyContactRelationship')}
                onValueChange={(value) => form.setValue('emergencyContactRelationship', value)}
                disabled={disabled}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((relationship) => (
                    <SelectItem key={relationship} value={relationship.toLowerCase()}>
                      {relationship}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.emergencyContactRelationship && (
                <p className="text-sm text-red-600">{form.formState.errors.emergencyContactRelationship.message}</p>
              )}
            </div>

            {/* Emergency Contact Phone */}
            <PhoneInput
              defaultCountry={form.watch('emergencyContactCountryCode')}
              onSuccess={(phoneData) => {
                form.setValue('emergencyContactPhone', phoneData.phoneNumber);
                form.setValue('emergencyContactCountryCode', phoneData.countryCode);
              }}
              onValidationChange={(isValid) => {
                if (!isValid) {
                  form.setError('emergencyContactPhone', { message: 'Please enter a valid phone number' });
                } else {
                  form.clearErrors('emergencyContactPhone');
                }
              }}
              disabled={disabled}
            />
            {form.formState.errors.emergencyContactPhone && (
              <p className="text-sm text-red-600">{form.formState.errors.emergencyContactPhone.message}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                Medical information is optional but helps healthcare providers give you better care. All information is kept confidential.
              </AlertDescription>
            </Alert>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label>Blood Group (Optional)</Label>
              <Select
                value={form.watch('bloodGroup')}
                onValueChange={(value) => form.setValue('bloodGroup', value)}
                disabled={disabled}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((bloodGroup) => (
                    <SelectItem key={bloodGroup} value={bloodGroup}>
                      {bloodGroup}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Allergies */}
            <div className="space-y-3">
              <Label>Known Allergies (Optional)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {COMMON_ALLERGIES.slice(0, 8).map((allergy) => (
                  <label key={allergy} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={selectedAllergies.includes(allergy)}
                      onCheckedChange={() => handleAllergyToggle(allergy)}
                      disabled={disabled}
                    />
                    <span>{allergy}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-3">
              <Label>Chronic Conditions (Optional)</Label>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {COMMON_CONDITIONS.slice(0, 6).map((condition) => (
                  <label key={condition} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={selectedConditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                      disabled={disabled}
                    />
                    <span>{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications (Optional)</Label>
              <Textarea
                id="medications"
                placeholder="List any medications you're currently taking..."
                value={form.watch('currentMedications')?.join(', ') || ''}
                onChange={(e) => {
                  const medications = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                  form.setValue('currentMedications', medications);
                }}
                className="min-h-[80px]"
                disabled={disabled}
              />
            </div>

            {/* Marketing Emails */}
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <Checkbox
                  checked={form.watch('allowMarketingEmails')}
                  onCheckedChange={(checked) => form.setValue('allowMarketingEmails', checked)}
                  disabled={disabled}
                />
                <span className="text-sm">
                  I would like to receive health tips and promotional emails
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full max-w-lg mx-auto', className)}>
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-4">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {state.currentStep} of {state.totalSteps}</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step header */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <currentStepConfig.icon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {currentStepConfig.title}
                {currentStepConfig.required && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                {currentStepConfig.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step content */}
          {renderStepContent()}

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-4">
            {state.currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={state.isSubmitting || disabled}
                className="flex-1 h-12"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}

            {state.currentStep < state.totalSteps ? (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={disabled}
                className="flex-1 h-12"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <div className="flex gap-2 flex-1">
                {state.canSkip && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    disabled={state.isSubmitting || disabled}
                    className="flex-1 h-12"
                  >
                    Skip for Now
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={state.isSubmitting || disabled}
                  className="flex-1 h-12"
                >
                  {state.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>Completing...</span>
                    </div>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Complete Profile
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileCompletion;