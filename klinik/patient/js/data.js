// Sample data for the prototype
const SAMPLE_DATA = {
  clinic: {
    name: "Klinik Sehat Pratama",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    phone: "021-12345678",
    logo: "images/logo.svg"
  },

  doctors: [
    {
      id: "doc-1",
      name: "Dr. Ahmad Surya",
      specialization: "Dokter Umum",
      photo: "https://i.pravatar.cc/150?img=12",
      bio: "Dokter umum dengan pengalaman 10 tahun",
      isActive: true
    },
    {
      id: "doc-2",
      name: "Dr. Siti Nurhaliza",
      specialization: "Dokter Gigi",
      photo: "https://i.pravatar.cc/150?img=5",
      bio: "Spesialis ortodonti dan konservasi gigi",
      isActive: true
    },
    {
      id: "doc-3",
      name: "Dr. Budi Santoso",
      specialization: "Dokter Anak",
      photo: "https://i.pravatar.cc/150?img=33",
      bio: "Spesialis kesehatan anak dan imunisasi",
      isActive: true
    },
    {
      id: "doc-4",
      name: "Dr. Maya Kusuma",
      specialization: "Dokter Kulit",
      photo: "https://i.pravatar.cc/150?img=9",
      bio: "Spesialis dermatologi dan kecantikan",
      isActive: true
    }
  ],

  // Generate availability for next 14 days
  generateAvailability: function(doctorId) {
    const availability = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip Sundays (day 0)
      if (date.getDay() === 0) continue;

      // Random unavailability
      const isAvailable = Math.random() > 0.2;

      availability.push({
        date: date.toISOString().split('T')[0],
        available: isAvailable,
        slots: isAvailable ? this.generateTimeSlots(date) : []
      });
    }

    return availability;
  },

  generateTimeSlots: function(date) {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Randomly make some slots unavailable
        const isAvailable = Math.random() > 0.3;
        const remaining = isAvailable ? Math.floor(Math.random() * 5) + 1 : 0;

        slots.push({
          time,
          available: isAvailable,
          remaining
        });
      }
    }

    return slots;
  },

  paymentMethods: [
    {
      id: "qris",
      name: "QRIS",
      type: "qris",
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%2300CED1' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='20' font-weight='bold'%3EQRIS%3C/text%3E%3C/svg%3E"
    },
    {
      id: "bank_transfer",
      name: "Transfer Bank",
      type: "bank_transfer",
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%233B82F6' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-weight='bold'%3EBANK%3C/text%3E%3C/svg%3E"
    },
    {
      id: "credit_card",
      name: "Kartu Kredit",
      type: "credit_card",
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23A855F7' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='18' font-weight='bold'%3ECARD%3C/text%3E%3C/svg%3E"
    }
  ],

  fastTrackPrice: 50000,

  banks: [
    { name: "BCA", code: "014", vaPrefix: "8800" },
    { name: "Mandiri", code: "008", vaPrefix: "8900" },
    { name: "BNI", code: "009", vaPrefix: "8810" }
  ]
};

// Generate unique booking number
function generateBookingNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK${year}${month}${day}${random}`;
}

// Generate QR code placeholder
function generateQRCode() {
  // Returns a placeholder QR code data URL
  const canvas = document.createElement('canvas');
  canvas.width = 248;
  canvas.height = 248;
  const ctx = canvas.getContext('2d');

  // Draw simple QR code pattern
  ctx.fillStyle = '#000';
  for (let i = 0; i < 248; i += 8) {
    for (let j = 0; j < 248; j += 8) {
      if (Math.random() > 0.5) {
        ctx.fillRect(i, j, 8, 8);
      }
    }
  }

  return canvas.toDataURL();
}

// Generate VA number
function generateVANumber(bankCode) {
  const bank = SAMPLE_DATA.banks.find(b => b.code === bankCode) || SAMPLE_DATA.banks[0];
  const random = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
  return bank.vaPrefix + random;
}

// Format currency (Indonesian Rupiah)
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date in Indonesian
function formatDate(dateString) {
  const date = new Date(dateString);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayName}, ${day} ${month} ${year}`;
}

// Format phone number
function formatPhoneNumber(phone) {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Format as 0812-3456-7890
  if (cleaned.length >= 10) {
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return cleaned;
}

// Simulate API delay
function simulateAPIDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
