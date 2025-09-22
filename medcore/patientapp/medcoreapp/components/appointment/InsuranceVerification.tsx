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
import { cn } from '@/lib/utils';
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Info,
  CreditCard,
  Phone,
  Building,
  FileText,
  Clock,
  Loader2,
  RefreshCw,
  X,
  Camera,
  Upload,
  Eye,
  Download,
} from 'lucide-react';

// Insurance verification schema
const insuranceVerificationSchema = z.object({
  hasInsurance: z.boolean(),
  insuranceDetails: z.object({
    providerId: z.string().min(1, 'Pilih penyedia asuransi'),
    providerName: z.string().optional(),
    policyNumber: z.string().min(1, 'Nomor polis wajib diisi'),
    policyHolderName: z.string().min(1, 'Nama pemegang polis wajib diisi'),
    policyHolderRelation: z.enum(['self', 'spouse', 'parent', 'child', 'other']),
    membershipNumber: z.string().optional(),
    groupNumber: z.string().optional(),
    coverageType: z.enum(['individual', 'family', 'corporate']),
    validUntil: z.string().min(1, 'Tanggal berlaku wajib diisi'),
    copayAmount: z.number().optional(),
    deductibleAmount: z.number().optional(),
    maxCoverage: z.number().optional(),
    preAuthRequired: z.boolean().default(false),
    emergencyContact: z.string().optional(),
  }).optional(),
  paymentMethod: z.enum(['insurance', 'cash', 'card', 'ewallet'], {
    required_error: 'Metode pembayaran wajib dipilih',
  }),
  cardDetails: z.object({
    cardNumber: z.string().optional(),
    cardHolderName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
  }).optional(),
  ewalletDetails: z.object({
    provider: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).optional(),
  estimatedCost: z.number().optional(),
  coverageAmount: z.number().optional(),
  patientPayment: z.number().optional(),
});

type InsuranceVerificationData = z.infer<typeof insuranceVerificationSchema>;

interface InsuranceVerificationProps {
  onSubmit: (data: InsuranceVerificationData) => void;
  onBack?: () => void;
  initialData?: Partial<InsuranceVerificationData>;
  consultationFee: number;
  locale?: 'en' | 'id';
  className?: string;
}

// Indonesian insurance providers
const indonesianInsuranceProviders = [
  {
    id: 'bpjs-kesehatan',
    name: 'BPJS Kesehatan',
    type: 'government',
    coverage: 90,
    preAuthRequired: false,
    logo: '/insurances/bpjs.png',
  },
  {
    id: 'bpjs-ketenagakerjaan',
    name: 'BPJS Ketenagakerjaan',
    type: 'government',
    coverage: 80,
    preAuthRequired: false,
    logo: '/insurances/bpjs-tk.png',
  },
  {
    id: 'prudential',
    name: 'Prudential Indonesia',
    type: 'private',
    coverage: 85,
    preAuthRequired: true,
    logo: '/insurances/prudential.png',
  },
  {
    id: 'allianz',
    name: 'Allianz Indonesia',
    type: 'private',
    coverage: 90,
    preAuthRequired: true,
    logo: '/insurances/allianz.png',
  },
  {
    id: 'axa-mandiri',
    name: 'AXA Mandiri',
    type: 'private',
    coverage: 80,
    preAuthRequired: true,
    logo: '/insurances/axa.png',
  },
  {
    id: 'cigna',
    name: 'Cigna Indonesia',
    type: 'private',
    coverage: 95,
    preAuthRequired: true,
    logo: '/insurances/cigna.png',
  },
  {
    id: 'great-eastern',
    name: 'Great Eastern Indonesia',
    type: 'private',
    coverage: 85,
    preAuthRequired: true,
    logo: '/insurances/great-eastern.png',
  },
  {
    id: 'zurich',
    name: 'Zurich Topas Life',
    type: 'private',
    coverage: 88,
    preAuthRequired: true,
    logo: '/insurances/zurich.png',
  },
];

const InsuranceVerification: React.FC<InsuranceVerificationProps> = ({
  onSubmit,
  onBack,
  initialData,
  consultationFee,
  locale = 'id',
  className,
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showCardInput, setShowCardInput] = useState(false);

  const form = useForm<InsuranceVerificationData>({
    resolver: zodResolver(insuranceVerificationSchema),
    defaultValues: {
      hasInsurance: initialData?.hasInsurance ?? false,
      paymentMethod: initialData?.paymentMethod ?? 'cash',
      insuranceDetails: {
        providerId: '',
        policyNumber: '',
        policyHolderName: '',
        policyHolderRelation: 'self',
        coverageType: 'individual',
        validUntil: '',
        copayAmount: 0,
        deductibleAmount: 0,
        preAuthRequired: false,
        ...initialData?.insuranceDetails,
      },
      cardDetails: {
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: '',
        ...initialData?.cardDetails,
      },
      ewalletDetails: {
        provider: '',
        phoneNumber: '',
        ...initialData?.ewalletDetails,
      },
      estimatedCost: consultationFee,
      coverageAmount: 0,
      patientPayment: consultationFee,
    },
  });

  const { watch, setValue, formState: { errors } } = form;
  const watchedData = watch();

  // Mock insurance verification
  const verifyInsurance = async (providerId: string, policyNumber: string) => {
    setIsVerifying(true);
    setVerificationStatus('verifying');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    const provider = indonesianInsuranceProviders.find(p => p.id === providerId);

    // Mock verification result
    const isValid = Math.random() > 0.2; // 80% success rate for demo

    if (isValid && provider) {
      const coveragePercentage = provider.coverage / 100;
      const coverageAmount = Math.min(consultationFee * coveragePercentage, consultationFee);
      const patientPayment = consultationFee - coverageAmount;

      const result = {
        isValid: true,
        provider: provider.name,
        coveragePercentage: provider.coverage,
        coverageAmount,
        patientPayment,
        preAuthRequired: provider.preAuthRequired,
        benefitDetails: {
          outpatientLimit: 50000000, // 50 million IDR
          usedAmount: 5000000, // 5 million IDR
          remainingAmount: 45000000, // 45 million IDR
        },
        copayAmount: provider.type === 'government' ? 10000 : 50000,
        deductibleAmount: provider.type === 'government' ? 0 : 100000,
      };

      setVerificationResult(result);
      setVerificationStatus('verified');

      // Update form values
      setValue('coverageAmount', coverageAmount);
      setValue('patientPayment', patientPayment);
      setValue('insuranceDetails.copayAmount', result.copayAmount);
      setValue('insuranceDetails.deductibleAmount', result.deductibleAmount);
      setValue('insuranceDetails.preAuthRequired', result.preAuthRequired);
    } else {
      setVerificationResult({
        isValid: false,
        error: locale === 'id'
          ? 'Polis tidak ditemukan atau sudah tidak aktif'
          : 'Policy not found or inactive',
      });
      setVerificationStatus('failed');
    }

    setIsVerifying(false);
  };

  // Handle provider selection
  useEffect(() => {
    const providerId = watchedData.insuranceDetails?.providerId;
    if (providerId) {
      const provider = indonesianInsuranceProviders.find(p => p.id === providerId);
      setSelectedProvider(provider);
      setValue('insuranceDetails.providerName', provider?.name);
    }
  }, [watchedData.insuranceDetails?.providerId]);

  // Handle payment method change
  useEffect(() => {
    const paymentMethod = watchedData.paymentMethod;
    setShowCardInput(paymentMethod === 'card');

    if (paymentMethod !== 'insurance') {
      setValue('coverageAmount', 0);
      setValue('patientPayment', consultationFee);
    }
  }, [watchedData.paymentMethod, consultationFee]);

  // Calculate costs
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleVerifyInsurance = () => {
    const { providerId, policyNumber } = watchedData.insuranceDetails || {};
    if (providerId && policyNumber) {
      verifyInsurance(providerId, policyNumber);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {locale === 'id' ? 'Verifikasi Asuransi & Pembayaran' : 'Insurance Verification & Payment'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Insurance Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="hasInsurance"
              checked={watchedData.hasInsurance}
              onCheckedChange={(checked) => setValue('hasInsurance', !!checked)}
            />
            <Label htmlFor="hasInsurance" className="text-base font-medium">
              {locale === 'id' ? 'Saya memiliki asuransi kesehatan' : 'I have health insurance'}
            </Label>
          </div>

          {watchedData.hasInsurance && (
            <Card className="p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{locale === 'id' ? 'Pilih Penyedia Asuransi' : 'Select Insurance Provider'}</Label>
                  <Select
                    value={watchedData.insuranceDetails?.providerId}
                    onValueChange={(value) => setValue('insuranceDetails.providerId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={locale === 'id' ? 'Pilih asuransi' : 'Select insurance'} />
                    </SelectTrigger>
                    <SelectContent>
                      {indonesianInsuranceProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <div className="flex items-center gap-2">
                            <span>{provider.name}</span>
                            <Badge variant={provider.type === 'government' ? 'default' : 'secondary'}>
                              {provider.type === 'government' ? 'Pemerintah' : 'Swasta'}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.insuranceDetails?.providerId && (
                    <p className="text-sm text-red-600">{errors.insuranceDetails.providerId.message}</p>
                  )}
                </div>

                {selectedProvider && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">{selectedProvider.name}</p>
                        <p className="text-sm">
                          {locale === 'id' ? 'Cakupan: ' : 'Coverage: '}{selectedProvider.coverage}%
                        </p>
                        {selectedProvider.preAuthRequired && (
                          <p className="text-sm text-orange-600">
                            {locale === 'id'
                              ? 'Memerlukan pre-autorisasi untuk klaim'
                              : 'Requires pre-authorization for claims'
                            }
                          </p>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">
                      {locale === 'id' ? 'Nomor Polis' : 'Policy Number'} *
                    </Label>
                    <Input
                      id="policyNumber"
                      {...form.register('insuranceDetails.policyNumber')}
                      placeholder={locale === 'id' ? 'Masukkan nomor polis' : 'Enter policy number'}
                    />
                    {errors.insuranceDetails?.policyNumber && (
                      <p className="text-sm text-red-600">{errors.insuranceDetails.policyNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyHolderName">
                      {locale === 'id' ? 'Nama Pemegang Polis' : 'Policy Holder Name'} *
                    </Label>
                    <Input
                      id="policyHolderName"
                      {...form.register('insuranceDetails.policyHolderName')}
                      placeholder={locale === 'id' ? 'Nama sesuai polis' : 'Name as per policy'}
                    />
                    {errors.insuranceDetails?.policyHolderName && (
                      <p className="text-sm text-red-600">{errors.insuranceDetails.policyHolderName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{locale === 'id' ? 'Hubungan dengan Pemegang Polis' : 'Relation to Policy Holder'}</Label>
                    <Select
                      value={watchedData.insuranceDetails?.policyHolderRelation}
                      onValueChange={(value) => setValue('insuranceDetails.policyHolderRelation', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">{locale === 'id' ? 'Diri Sendiri' : 'Self'}</SelectItem>
                        <SelectItem value="spouse">{locale === 'id' ? 'Pasangan' : 'Spouse'}</SelectItem>
                        <SelectItem value="parent">{locale === 'id' ? 'Orang Tua' : 'Parent'}</SelectItem>
                        <SelectItem value="child">{locale === 'id' ? 'Anak' : 'Child'}</SelectItem>
                        <SelectItem value="other">{locale === 'id' ? 'Lainnya' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validUntil">
                      {locale === 'id' ? 'Berlaku Hingga' : 'Valid Until'} *
                    </Label>
                    <Input
                      id="validUntil"
                      type="date"
                      {...form.register('insuranceDetails.validUntil')}
                    />
                    {errors.insuranceDetails?.validUntil && (
                      <p className="text-sm text-red-600">{errors.insuranceDetails.validUntil.message}</p>
                    )}
                  </div>
                </div>

                {/* Verification Button */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={handleVerifyInsurance}
                    disabled={!watchedData.insuranceDetails?.providerId || !watchedData.insuranceDetails?.policyNumber || isVerifying}
                    className="min-w-40"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {locale === 'id' ? 'Memverifikasi...' : 'Verifying...'}
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        {locale === 'id' ? 'Verifikasi Asuransi' : 'Verify Insurance'}
                      </>
                    )}
                  </Button>
                </div>

                {/* Verification Result */}
                {verificationStatus === 'verified' && verificationResult?.isValid && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium text-green-800">
                          {locale === 'id' ? 'Asuransi Terverifikasi' : 'Insurance Verified'}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">
                              {locale === 'id' ? 'Cakupan:' : 'Coverage:'}
                            </p>
                            <p className="font-medium">{verificationResult.coveragePercentage}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              {locale === 'id' ? 'Jumlah Ditanggung:' : 'Covered Amount:'}
                            </p>
                            <p className="font-medium">{formatCurrency(verificationResult.coverageAmount)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              {locale === 'id' ? 'Pembayaran Anda:' : 'Your Payment:'}
                            </p>
                            <p className="font-medium">{formatCurrency(verificationResult.patientPayment)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              {locale === 'id' ? 'Sisa Limit:' : 'Remaining Limit:'}
                            </p>
                            <p className="font-medium">{formatCurrency(verificationResult.benefitDetails.remainingAmount)}</p>
                          </div>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {verificationStatus === 'failed' && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium text-red-800">
                          {locale === 'id' ? 'Verifikasi Gagal' : 'Verification Failed'}
                        </p>
                        <p className="text-red-700">{verificationResult?.error}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleVerifyInsurance}
                          className="mt-2"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          {locale === 'id' ? 'Coba Lagi' : 'Try Again'}
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>
          )}
        </div>

        <Separator />

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {locale === 'id' ? 'Metode Pembayaran' : 'Payment Method'}
          </h3>

          <RadioGroup
            value={watchedData.paymentMethod}
            onValueChange={(value) => setValue('paymentMethod', value as any)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchedData.hasInsurance && verificationStatus === 'verified' && verificationResult?.isValid && (
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="insurance" id="insurance" />
                    <Label htmlFor="insurance" className="flex-1">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>{locale === 'id' ? 'Gunakan Asuransi' : 'Use Insurance'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {locale === 'id' ? 'Bayar ' : 'Pay '}{formatCurrency(verificationResult.patientPayment)}
                      </p>
                    </Label>
                  </div>
                </Card>
              )}

              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{locale === 'id' ? 'Tunai' : 'Cash'}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {locale === 'id' ? 'Bayar di tempat' : 'Pay at location'}
                    </p>
                  </Label>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{locale === 'id' ? 'Kartu Kredit/Debit' : 'Credit/Debit Card'}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {locale === 'id' ? 'Pembayaran online aman' : 'Secure online payment'}
                    </p>
                  </Label>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ewallet" id="ewallet" />
                  <Label htmlFor="ewallet" className="flex-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{locale === 'id' ? 'E-Wallet' : 'E-Wallet'}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      GoPay, OVO, DANA, LinkAja
                    </p>
                  </Label>
                </div>
              </Card>
            </div>
          </RadioGroup>
          {errors.paymentMethod && (
            <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
          )}
        </div>

        {/* Card Details */}
        {showCardInput && (
          <Card className="p-4">
            <h4 className="font-medium mb-4">
              {locale === 'id' ? 'Detail Kartu' : 'Card Details'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="cardNumber">
                  {locale === 'id' ? 'Nomor Kartu' : 'Card Number'}
                </Label>
                <Input
                  id="cardNumber"
                  {...form.register('cardDetails.cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolderName">
                  {locale === 'id' ? 'Nama Pemegang Kartu' : 'Card Holder Name'}
                </Label>
                <Input
                  id="cardHolderName"
                  {...form.register('cardDetails.cardHolderName')}
                  placeholder={locale === 'id' ? 'Nama sesuai kartu' : 'Name as on card'}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">
                    {locale === 'id' ? 'Berlaku Hingga' : 'Expiry Date'}
                  </Label>
                  <Input
                    id="expiryDate"
                    {...form.register('cardDetails.expiryDate')}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    {...form.register('cardDetails.cvv')}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* E-Wallet Details */}
        {watchedData.paymentMethod === 'ewallet' && (
          <Card className="p-4">
            <h4 className="font-medium mb-4">
              {locale === 'id' ? 'Detail E-Wallet' : 'E-Wallet Details'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{locale === 'id' ? 'Pilih E-Wallet' : 'Select E-Wallet'}</Label>
                <Select
                  value={watchedData.ewalletDetails?.provider}
                  onValueChange={(value) => setValue('ewalletDetails.provider', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'id' ? 'Pilih e-wallet' : 'Select e-wallet'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gopay">GoPay</SelectItem>
                    <SelectItem value="ovo">OVO</SelectItem>
                    <SelectItem value="dana">DANA</SelectItem>
                    <SelectItem value="linkaja">LinkAja</SelectItem>
                    <SelectItem value="shopeepay">ShopeePay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ewalletPhone">
                  {locale === 'id' ? 'Nomor Telepon' : 'Phone Number'}
                </Label>
                <Input
                  id="ewalletPhone"
                  type="tel"
                  {...form.register('ewalletDetails.phoneNumber')}
                  placeholder="+62812345678"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Cost Summary */}
        <Card className="p-4 bg-gray-50">
          <h4 className="font-medium mb-4">
            {locale === 'id' ? 'Ringkasan Biaya' : 'Cost Summary'}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{locale === 'id' ? 'Biaya Konsultasi:' : 'Consultation Fee:'}</span>
              <span>{formatCurrency(consultationFee)}</span>
            </div>

            {watchedData.hasInsurance && verificationStatus === 'verified' && verificationResult?.isValid && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>{locale === 'id' ? 'Ditanggung Asuransi:' : 'Insurance Coverage:'}</span>
                  <span>-{formatCurrency(verificationResult.coverageAmount)}</span>
                </div>
                {verificationResult.copayAmount > 0 && (
                  <div className="flex justify-between">
                    <span>{locale === 'id' ? 'Copay:' : 'Copay:'}</span>
                    <span>{formatCurrency(verificationResult.copayAmount)}</span>
                  </div>
                )}
              </>
            )}

            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>{locale === 'id' ? 'Total Pembayaran:' : 'Total Payment:'}</span>
              <span>{formatCurrency(watchedData.patientPayment || consultationFee)}</span>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onBack} disabled={!onBack}>
            {locale === 'id' ? 'Kembali' : 'Back'}
          </Button>

          <Button onClick={handleSubmit}>
            {locale === 'id' ? 'Lanjutkan' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceVerification;