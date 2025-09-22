import {
  Doctor,
  Specialization,
  Language,
  InsuranceProvider,
  Clinic,
  INDONESIAN_SPECIALIZATIONS,
  INDONESIAN_CITIES,
  INDONESIAN_INSURANCE_PROVIDERS
} from '@/types/doctor';

// Mock Languages
export const mockLanguages: Language[] = [
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

// Mock Specializations
export const mockSpecializations: Specialization[] = [
  {
    id: 'general-practitioner',
    name: 'General Practitioner',
    nameId: 'Dokter Umum',
    icon: '🩺',
    category: 'general',
  },
  {
    id: 'internal-medicine',
    name: 'Internal Medicine',
    nameId: 'Penyakit Dalam',
    icon: '🫀',
    category: 'specialist',
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    nameId: 'Kardiologi',
    icon: '❤️',
    category: 'specialist',
  },
  {
    id: 'neurology',
    name: 'Neurology',
    nameId: 'Neurologi',
    icon: '🧠',
    category: 'specialist',
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    nameId: 'Ortopedi',
    icon: '🦴',
    category: 'specialist',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    nameId: 'Anak',
    icon: '👶',
    category: 'pediatric',
  },
  {
    id: 'obstetrics-gynecology',
    name: 'Obstetrics & Gynecology',
    nameId: 'Kandungan',
    icon: '🤱',
    category: 'specialist',
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    nameId: 'Kulit dan Kelamin',
    icon: '🧴',
    category: 'specialist',
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    nameId: 'Psikiatri',
    icon: '🧘',
    category: 'specialist',
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    nameId: 'Mata',
    icon: '👁️',
    category: 'specialist',
  },
  {
    id: 'ent',
    name: 'ENT (Ear, Nose, Throat)',
    nameId: 'THT',
    icon: '👂',
    category: 'specialist',
  },
  {
    id: 'urology',
    name: 'Urology',
    nameId: 'Urologi',
    icon: '🫘',
    category: 'specialist',
  },
  {
    id: 'emergency-medicine',
    name: 'Emergency Medicine',
    nameId: 'Gawat Darurat',
    icon: '🚨',
    category: 'emergency',
  },
  {
    id: 'anesthesiology',
    name: 'Anesthesiology',
    nameId: 'Anestesi',
    icon: '💉',
    category: 'specialist',
  },
  {
    id: 'radiology',
    name: 'Radiology',
    nameId: 'Radiologi',
    icon: '📸',
    category: 'specialist',
  },
];

// Mock Insurance Providers
export const mockInsuranceProviders: InsuranceProvider[] = [
  {
    id: 'bpjs',
    name: 'BPJS Kesehatan',
    logo: '/insurance/bpjs.png',
    coverage: 'comprehensive',
  },
  {
    id: 'prudential',
    name: 'Prudential',
    logo: '/insurance/prudential.png',
    coverage: 'premium',
  },
  {
    id: 'aia',
    name: 'AIA',
    logo: '/insurance/aia.png',
    coverage: 'premium',
  },
  {
    id: 'allianz',
    name: 'Allianz',
    logo: '/insurance/allianz.png',
    coverage: 'comprehensive',
  },
  {
    id: 'cigna',
    name: 'Cigna',
    logo: '/insurance/cigna.png',
    coverage: 'premium',
  },
  {
    id: 'great-eastern',
    name: 'Great Eastern',
    logo: '/insurance/great-eastern.png',
    coverage: 'basic',
  },
  {
    id: 'mandiri-inhealth',
    name: 'Mandiri Inhealth',
    logo: '/insurance/mandiri.png',
    coverage: 'comprehensive',
  },
];

// Mock Clinics
export const mockClinics: Clinic[] = [
  {
    id: 'rscm-jakarta',
    name: 'RS Cipto Mangunkusumo (RSCM)',
    address: 'Jl. Diponegoro No.71, Kenari, Senen',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    coordinates: { latitude: -6.1854, longitude: 106.8310 },
    phone: '+62-21-3155688',
    type: 'hospital',
    facilities: ['Emergency Room', 'ICU', 'Operating Theater', 'Laboratory', 'Radiology', 'Pharmacy'],
    operatingHours: {
      monday: '24 Hours',
      tuesday: '24 Hours',
      wednesday: '24 Hours',
      thursday: '24 Hours',
      friday: '24 Hours',
      saturday: '24 Hours',
      sunday: '24 Hours',
    },
  },
  {
    id: 'rs-fatmawati',
    name: 'RS Fatmawati',
    address: 'Jl. RS Fatmawati Raya No.80-82, Cilandak Barat',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    coordinates: { latitude: -6.2919, longitude: 106.7956 },
    phone: '+62-21-7501524',
    type: 'hospital',
    facilities: ['Emergency Room', 'ICU', 'Operating Theater', 'Laboratory', 'Radiology'],
    operatingHours: {
      monday: '24 Hours',
      tuesday: '24 Hours',
      wednesday: '24 Hours',
      thursday: '24 Hours',
      friday: '24 Hours',
      saturday: '24 Hours',
      sunday: '24 Hours',
    },
  },
  {
    id: 'siloam-kebon-jeruk',
    name: 'Siloam Hospitals Kebon Jeruk',
    address: 'Jl. Perjuangan No.8, Kebon Jeruk',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    coordinates: { latitude: -6.1891, longitude: 106.7661 },
    phone: '+62-21-25675777',
    type: 'hospital',
    facilities: ['Emergency Room', 'ICU', 'Operating Theater', 'Laboratory', 'Radiology', 'Pharmacy', 'Cafeteria'],
    operatingHours: {
      monday: '24 Hours',
      tuesday: '24 Hours',
      wednesday: '24 Hours',
      thursday: '24 Hours',
      friday: '24 Hours',
      saturday: '24 Hours',
      sunday: '24 Hours',
    },
  },
  {
    id: 'rs-premier-surabaya',
    name: 'RS Premier Surabaya',
    address: 'Jl. Nginden Intan Timur No.1, Surabaya',
    city: 'Surabaya',
    province: 'Jawa Timur',
    coordinates: { latitude: -7.2469, longitude: 112.7378 },
    phone: '+62-31-5993388',
    type: 'hospital',
    facilities: ['Emergency Room', 'ICU', 'Operating Theater', 'Laboratory', 'Radiology'],
    operatingHours: {
      monday: '24 Hours',
      tuesday: '24 Hours',
      wednesday: '24 Hours',
      thursday: '24 Hours',
      friday: '24 Hours',
      saturday: '24 Hours',
      sunday: '24 Hours',
    },
  },
  {
    id: 'klinik-pratama-sehat',
    name: 'Klinik Pratama Sehat',
    address: 'Jl. Sudirman No.45, Bandung',
    city: 'Bandung',
    province: 'Jawa Barat',
    coordinates: { latitude: -6.9175, longitude: 107.6191 },
    phone: '+62-22-4567890',
    type: 'clinic',
    facilities: ['General Practice', 'Laboratory', 'Pharmacy'],
    operatingHours: {
      monday: '08:00 - 20:00',
      tuesday: '08:00 - 20:00',
      wednesday: '08:00 - 20:00',
      thursday: '08:00 - 20:00',
      friday: '08:00 - 20:00',
      saturday: '08:00 - 15:00',
      sunday: 'Closed',
    },
  },
];

// Generate schedule slots for next 30 days
const generateScheduleSlots = (doctorId: string) => {
  const slots = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Skip Sundays for some doctors
    if (date.getDay() === 0 && Math.random() > 0.3) continue;

    const dateStr = date.toISOString().split('T')[0];

    // Morning slots
    for (let hour = 8; hour < 12; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        date: dateStr,
        time,
        available: Math.random() > 0.4,
        price: Math.floor(Math.random() * 200000) + 100000, // 100k - 300k IDR
      });
    }

    // Afternoon slots
    for (let hour = 14; hour < 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        date: dateStr,
        time,
        available: Math.random() > 0.3,
        price: Math.floor(Math.random() * 200000) + 150000, // 150k - 350k IDR
      });
    }
  }

  return slots;
};

// Mock Doctors Data
export const mockDoctors: Doctor[] = [
  {
    id: 'dr-ahmad-sutanto',
    name: 'Dr. Ahmad Sutanto, Sp.JP',
    photo: '/doctors/ahmad-sutanto.jpg',
    title: 'Dr.',
    specializations: [mockSpecializations.find(s => s.id === 'cardiology')!],
    licenseNumber: 'STR.1234567890',
    experienceYears: 15,
    education: [
      {
        degree: 'Sp.JP (Kardiologi)',
        institution: 'Universitas Indonesia',
        year: 2012,
        location: 'Jakarta, Indonesia',
      },
      {
        degree: 'Dokter Umum',
        institution: 'Universitas Gadjah Mada',
        year: 2008,
        location: 'Yogyakarta, Indonesia',
      },
    ],
    certifications: [
      {
        name: 'Fellow of the Indonesian Society of Cardiology',
        issuer: 'PERKI',
        year: 2015,
      },
      {
        name: 'Advanced Cardiac Life Support (ACLS)',
        issuer: 'American Heart Association',
        year: 2020,
        expiryYear: 2025,
      },
    ],
    languages: [mockLanguages[0], mockLanguages[1]], // Indonesian, English
    clinics: [mockClinics[0], mockClinics[2]], // RSCM, Siloam
    consultationFees: {
      min: 200000,
      max: 400000,
      currency: 'IDR',
    },
    insuranceAccepted: [
      mockInsuranceProviders[0], // BPJS
      mockInsuranceProviders[1], // Prudential
      mockInsuranceProviders[3], // Allianz
    ],
    rating: {
      overall: 4.8,
      reviewCount: 156,
      breakdown: {
        communication: 4.9,
        professionalism: 4.8,
        waitTime: 4.6,
        explanation: 4.9,
      },
    },
    availability: generateScheduleSlots('dr-ahmad-sutanto'),
    bio: 'Dr. Ahmad Sutanto is a highly experienced cardiologist with over 15 years of practice. He specializes in interventional cardiology and has performed thousands of cardiac procedures.',
    bioId: 'Dr. Ahmad Sutanto adalah ahli jantung berpengalaman dengan lebih dari 15 tahun praktik. Beliau mengkhususkan diri pada kardiologi intervensi dan telah melakukan ribuan prosedur jantung.',
    achievements: [
      'Best Cardiologist Award 2022 - Indonesian Medical Association',
      'Over 1000 successful cardiac interventions',
      'Published 25+ papers in international journals',
    ],
    treatmentApproach: 'Patient-centered care with emphasis on preventive cardiology and minimally invasive procedures.',
    treatmentApproachId: 'Perawatan berpusat pada pasien dengan penekanan pada kardiologi preventif dan prosedur invasif minimal.',
    isVerified: true,
    isAvailableToday: true,
    isNewPatientAccepting: true,
    responseTime: 'within 2 hours',
    metadata: {
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-09-22T00:00:00Z',
      viewCount: 1250,
      bookingCount: 89,
    },
  },
  {
    id: 'dr-siti-rahayu',
    name: 'Dr. Siti Rahayu, Sp.A',
    photo: '/doctors/siti-rahayu.jpg',
    title: 'Dr.',
    specializations: [mockSpecializations.find(s => s.id === 'pediatrics')!],
    licenseNumber: 'STR.2345678901',
    experienceYears: 12,
    education: [
      {
        degree: 'Sp.A (Ilmu Kesehatan Anak)',
        institution: 'Universitas Indonesia',
        year: 2015,
        location: 'Jakarta, Indonesia',
      },
      {
        degree: 'Dokter Umum',
        institution: 'Universitas Diponegoro',
        year: 2011,
        location: 'Semarang, Indonesia',
      },
    ],
    certifications: [
      {
        name: 'Pediatric Advanced Life Support (PALS)',
        issuer: 'American Heart Association',
        year: 2021,
        expiryYear: 2026,
      },
      {
        name: 'Certified Lactation Consultant',
        issuer: 'International Board of Lactation Consultant Examiners',
        year: 2018,
      },
    ],
    languages: [mockLanguages[0], mockLanguages[1], mockLanguages[3]], // Indonesian, English, Chinese
    clinics: [mockClinics[1]], // RS Fatmawati
    consultationFees: {
      min: 150000,
      max: 300000,
      currency: 'IDR',
    },
    insuranceAccepted: [
      mockInsuranceProviders[0], // BPJS
      mockInsuranceProviders[2], // AIA
      mockInsuranceProviders[4], // Cigna
    ],
    rating: {
      overall: 4.9,
      reviewCount: 203,
      breakdown: {
        communication: 5.0,
        professionalism: 4.9,
        waitTime: 4.7,
        explanation: 4.9,
      },
    },
    availability: generateScheduleSlots('dr-siti-rahayu'),
    bio: 'Dr. Siti Rahayu is a dedicated pediatrician with special interest in child development and nutrition. She is known for her gentle approach with children.',
    bioId: 'Dr. Siti Rahayu adalah dokter anak yang berdedikasi dengan minat khusus pada perkembangan dan nutrisi anak. Beliau dikenal dengan pendekatan yang lembut kepada anak-anak.',
    achievements: [
      'Outstanding Pediatrician Award 2023 - Ministry of Health',
      'Certified in Child Development Assessment',
      'Active member of Indonesian Pediatric Society',
    ],
    treatmentApproach: 'Holistic child care focusing on growth, development, and family-centered treatment.',
    treatmentApproachId: 'Perawatan anak holistik yang berfokus pada pertumbuhan, perkembangan, dan pengobatan berpusat pada keluarga.',
    isVerified: true,
    isAvailableToday: true,
    isNewPatientAccepting: true,
    responseTime: 'within 1 hour',
    metadata: {
      createdAt: '2023-03-10T00:00:00Z',
      updatedAt: '2024-09-22T00:00:00Z',
      viewCount: 980,
      bookingCount: 156,
    },
  },
  {
    id: 'dr-budi-santoso',
    name: 'Dr. Budi Santoso, M.Kes',
    photo: '/doctors/budi-santoso.jpg',
    title: 'Dr.',
    specializations: [mockSpecializations.find(s => s.id === 'general-practitioner')!],
    licenseNumber: 'STR.3456789012',
    experienceYears: 8,
    education: [
      {
        degree: 'M.Kes (Kesehatan Masyarakat)',
        institution: 'Universitas Airlangga',
        year: 2018,
        location: 'Surabaya, Indonesia',
      },
      {
        degree: 'Dokter Umum',
        institution: 'Universitas Brawijaya',
        year: 2016,
        location: 'Malang, Indonesia',
      },
    ],
    certifications: [
      {
        name: 'Basic Life Support (BLS)',
        issuer: 'Indonesian Medical Association',
        year: 2022,
        expiryYear: 2025,
      },
    ],
    languages: [mockLanguages[0], mockLanguages[1]], // Indonesian, English
    clinics: [mockClinics[4]], // Klinik Pratama Sehat
    consultationFees: {
      min: 80000,
      max: 150000,
      currency: 'IDR',
    },
    insuranceAccepted: [
      mockInsuranceProviders[0], // BPJS
      mockInsuranceProviders[5], // Great Eastern
    ],
    rating: {
      overall: 4.6,
      reviewCount: 87,
      breakdown: {
        communication: 4.7,
        professionalism: 4.6,
        waitTime: 4.5,
        explanation: 4.7,
      },
    },
    availability: generateScheduleSlots('dr-budi-santoso'),
    bio: 'Dr. Budi Santoso is a general practitioner with expertise in preventive medicine and community health.',
    bioId: 'Dr. Budi Santoso adalah dokter umum dengan keahlian dalam kedokteran preventif dan kesehatan masyarakat.',
    achievements: [
      'Community Health Excellence Award 2022',
      'Active in rural health programs',
    ],
    treatmentApproach: 'Comprehensive primary care with focus on disease prevention and health promotion.',
    treatmentApproachId: 'Perawatan primer komprehensif dengan fokus pada pencegahan penyakit dan promosi kesehatan.',
    isVerified: true,
    isAvailableToday: false,
    isNewPatientAccepting: true,
    responseTime: 'same day',
    metadata: {
      createdAt: '2023-06-20T00:00:00Z',
      updatedAt: '2024-09-22T00:00:00Z',
      viewCount: 445,
      bookingCount: 67,
    },
  },
  {
    id: 'dr-maria-christina',
    name: 'Dr. Maria Christina, Sp.OG',
    photo: '/doctors/maria-christina.jpg',
    title: 'Dr.',
    specializations: [mockSpecializations.find(s => s.id === 'obstetrics-gynecology')!],
    licenseNumber: 'STR.4567890123',
    experienceYears: 18,
    education: [
      {
        degree: 'Sp.OG (Obstetri dan Ginekologi)',
        institution: 'Universitas Indonesia',
        year: 2010,
        location: 'Jakarta, Indonesia',
      },
      {
        degree: 'Dokter Umum',
        institution: 'Universitas Katolik Indonesia Atma Jaya',
        year: 2006,
        location: 'Jakarta, Indonesia',
      },
    ],
    certifications: [
      {
        name: 'Fellowship in Maternal-Fetal Medicine',
        issuer: 'POGI',
        year: 2013,
      },
      {
        name: 'Laparoscopic Surgery Certification',
        issuer: 'Indonesian Association of Laparoscopic Surgery',
        year: 2015,
      },
    ],
    languages: [mockLanguages[0], mockLanguages[1]], // Indonesian, English
    clinics: [mockClinics[0], mockClinics[2]], // RSCM, Siloam
    consultationFees: {
      min: 250000,
      max: 500000,
      currency: 'IDR',
    },
    insuranceAccepted: [
      mockInsuranceProviders[0], // BPJS
      mockInsuranceProviders[1], // Prudential
      mockInsuranceProviders[2], // AIA
      mockInsuranceProviders[3], // Allianz
    ],
    rating: {
      overall: 4.9,
      reviewCount: 234,
      breakdown: {
        communication: 4.9,
        professionalism: 5.0,
        waitTime: 4.7,
        explanation: 4.9,
      },
    },
    availability: generateScheduleSlots('dr-maria-christina'),
    bio: 'Dr. Maria Christina is a senior obstetrician-gynecologist with extensive experience in high-risk pregnancies and minimally invasive surgery.',
    bioId: 'Dr. Maria Christina adalah dokter spesialis kandungan senior dengan pengalaman luas dalam kehamilan risiko tinggi dan operasi invasif minimal.',
    achievements: [
      'Excellence in Women\'s Health Award 2023',
      'Over 2000 successful deliveries',
      'Pioneer in laparoscopic gynecologic surgery in Indonesia',
    ],
    treatmentApproach: 'Evidence-based women\'s healthcare with emphasis on patient education and shared decision-making.',
    treatmentApproachId: 'Layanan kesehatan wanita berbasis bukti dengan penekanan pada edukasi pasien dan pengambilan keputusan bersama.',
    isVerified: true,
    isAvailableToday: true,
    isNewPatientAccepting: true,
    responseTime: 'within 3 hours',
    metadata: {
      createdAt: '2023-02-05T00:00:00Z',
      updatedAt: '2024-09-22T00:00:00Z',
      viewCount: 1580,
      bookingCount: 178,
    },
  },
  {
    id: 'prof-dr-hendro-wijaya',
    name: 'Prof. Dr. Hendro Wijaya, Sp.S',
    photo: '/doctors/hendro-wijaya.jpg',
    title: 'Prof. Dr.',
    specializations: [mockSpecializations.find(s => s.id === 'neurology')!],
    licenseNumber: 'STR.5678901234',
    experienceYears: 25,
    education: [
      {
        degree: 'Professor of Neurology',
        institution: 'Universitas Indonesia',
        year: 2018,
        location: 'Jakarta, Indonesia',
      },
      {
        degree: 'Sp.S (Neurologi)',
        institution: 'Universitas Indonesia',
        year: 2005,
        location: 'Jakarta, Indonesia',
      },
      {
        degree: 'Dokter Umum',
        institution: 'Universitas Indonesia',
        year: 1999,
        location: 'Jakarta, Indonesia',
      },
    ],
    certifications: [
      {
        name: 'Board Certification in Neurology',
        issuer: 'Indonesian Neurological Association',
        year: 2005,
      },
      {
        name: 'Fellowship in Stroke Medicine',
        issuer: 'International Stroke Society',
        year: 2008,
      },
    ],
    languages: [mockLanguages[0], mockLanguages[1]], // Indonesian, English
    clinics: [mockClinics[0]], // RSCM
    consultationFees: {
      min: 400000,
      max: 750000,
      currency: 'IDR',
    },
    insuranceAccepted: [
      mockInsuranceProviders[1], // Prudential
      mockInsuranceProviders[2], // AIA
      mockInsuranceProviders[3], // Allianz
    ],
    rating: {
      overall: 4.9,
      reviewCount: 89,
      breakdown: {
        communication: 4.8,
        professionalism: 5.0,
        waitTime: 4.6,
        explanation: 5.0,
      },
    },
    availability: generateScheduleSlots('prof-dr-hendro-wijaya'),
    bio: 'Prof. Dr. Hendro Wijaya is a renowned neurologist and professor with expertise in stroke medicine and neurodegenerative diseases.',
    bioId: 'Prof. Dr. Hendro Wijaya adalah ahli saraf dan profesor terkemuka dengan keahlian dalam kedokteran stroke dan penyakit neurodegeneratif.',
    achievements: [
      'National Excellence in Neurology Award 2022',
      'Author of 100+ scientific publications',
      'International speaker on stroke management',
      'Head of Neurology Department at RSCM',
    ],
    treatmentApproach: 'Advanced neurological care combining latest research with personalized treatment plans.',
    treatmentApproachId: 'Perawatan neurologi canggih yang menggabungkan penelitian terbaru dengan rencana pengobatan yang dipersonalisasi.',
    isVerified: true,
    isAvailableToday: false,
    isNewPatientAccepting: false,
    responseTime: 'within 1 week',
    metadata: {
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-09-22T00:00:00Z',
      viewCount: 2100,
      bookingCount: 45,
    },
  },
];

// Add more doctors to reach 50+ total
const additionalDoctorNames = [
  'Dr. Andi Prasetyo, Sp.PD',
  'Dr. Lisa Wijayanti, Sp.M',
  'Dr. Rudi Hermawan, Sp.OT',
  'Dr. Dewi Sartika, Sp.KK',
  'Dr. Agus Suprapto, Sp.THT',
  'Dr. Rina Kusuma, Sp.Rad',
  'Dr. Bambang Sutrisno, Sp.An',
  'Dr. Novi Indriasari, Sp.Pk',
  'Dr. Hendra Kurnia, Sp.U',
  'Dr. Fitri Handayani, Sp.KJ',
  'Dr. Yusuf Rahman, Sp.B',
  'Dr. Sari Permata, Sp.PA',
  'Dr. Dedi Kurniawan, Sp.RM',
  'Dr. Mega Sari, Sp.GK',
  'Dr. Irwan Setiawan, Sp.EM',
];

// Generate additional doctors (keeping it shorter due to length constraints)
const generateAdditionalDoctor = (name: string, index: number): Doctor => {
  const specializationIndex = index % mockSpecializations.length;
  const clinicIndex = index % mockClinics.length;
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return {
    id,
    name,
    photo: `/doctors/${id}.jpg`,
    title: 'Dr.',
    specializations: [mockSpecializations[specializationIndex]],
    licenseNumber: `STR.${(6789012345 + index).toString()}`,
    experienceYears: Math.floor(Math.random() * 20) + 5,
    education: [
      {
        degree: 'Specialist Degree',
        institution: 'Indonesian University',
        year: 2015 + Math.floor(Math.random() * 8),
        location: 'Indonesia',
      },
    ],
    certifications: [],
    languages: [mockLanguages[0], mockLanguages[1]],
    clinics: [mockClinics[clinicIndex]],
    consultationFees: {
      min: Math.floor(Math.random() * 100000) + 100000,
      max: Math.floor(Math.random() * 200000) + 200000,
      currency: 'IDR',
    },
    insuranceAccepted: mockInsuranceProviders.slice(0, Math.floor(Math.random() * 4) + 1),
    rating: {
      overall: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 200) + 20,
      breakdown: {
        communication: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        professionalism: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        waitTime: Math.round((3.0 + Math.random() * 2.0) * 10) / 10,
        explanation: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      },
    },
    availability: generateScheduleSlots(id),
    bio: `${name} is an experienced medical professional with expertise in their field.`,
    bioId: `${name} adalah profesional medis berpengalaman dengan keahlian di bidangnya.`,
    achievements: [],
    treatmentApproach: 'Comprehensive medical care with patient-centered approach.',
    treatmentApproachId: 'Perawatan medis komprehensif dengan pendekatan berpusat pada pasien.',
    isVerified: Math.random() > 0.2,
    isAvailableToday: Math.random() > 0.4,
    isNewPatientAccepting: Math.random() > 0.3,
    responseTime: ['within 1 hour', 'within 2 hours', 'same day'][Math.floor(Math.random() * 3)],
    metadata: {
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-09-22T00:00:00Z',
      viewCount: Math.floor(Math.random() * 1000) + 100,
      bookingCount: Math.floor(Math.random() * 100) + 10,
    },
  };
};

// Generate all additional doctors
const allAdditionalDoctors = additionalDoctorNames.map((name, index) =>
  generateAdditionalDoctor(name, index)
);

// Export all doctors
export const allMockDoctors: Doctor[] = [...mockDoctors, ...allAdditionalDoctors];

// Export search suggestions
export const popularSearches = [
  'Dokter Jantung',
  'Dokter Anak',
  'Dokter Umum terdekat',
  'Spesialis Kandungan',
  'Dokter Mata',
  'BPJS',
  'Emergency',
  'Jakarta',
];

export const searchSuggestions = [
  ...mockSpecializations.map(s => s.name),
  ...mockSpecializations.map(s => s.nameId),
  ...INDONESIAN_CITIES,
  ...INDONESIAN_INSURANCE_PROVIDERS,
];