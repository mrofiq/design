# Dashboard Dokter - Enhanced Tablet Medical Application

Aplikasi tablet untuk sistem manajemen rekam medis digital yang dirancang khusus untuk dokter dan praktik medis di Indonesia.

## 📋 Overview

Dashboard Dokter adalah aplikasi web berbasis tablet yang memungkinkan dokter mengelola praktik medis secara digital dengan fitur-fitur modern seperti:

- **Dashboard Utama**: View jadwal harian dengan informasi lengkap pasien
- **Enhanced Patient Data**: Tanggal lahir, jenis kelamin, metode pembayaran, alamat
- **ICD-10 Autocomplete**: Pencarian diagnosis cepat dengan kode ICD-10 standar internasional
- **Auto Clinical Pathway**: Template jalur pengobatan otomatis berdasarkan diagnosis dan metode pembayaran
- **Voice Input**: Speech-to-text untuk input diagnosis yang cepat
- **Touch-Optimized**: Desain khusus untuk penggunaan tablet dengan touch targets yang optimal

## 🆕 New Features v2.0

### 1. Enhanced Patient Information
- **Tanggal Lahir**: Format Indonesia dengan kalkulasi usia otomatis
- **Jenis Kelamin**: Display dengan icon yang appropriate  
- **Metode Pembayaran**: Badge dengan warna berbeda (BPJS/Asuransi Swasta/Umum)
- **Contact Info**: Nomor telepon dan alamat lengkap

### 2. ICD-10 Autocomplete System
- **Real-time Search**: Ketik kode atau nama penyakit
- **15+ Common Diagnoses**: Database penyakit umum Indonesia
- **Smart Matching**: Search berdasarkan kode ICD atau nama Indonesia
- **Quick Selection**: Click to auto-fill diagnosis

### 3. Auto Clinical Pathway
- **Payment-Based**: Otomatis detect metode pembayaran pasien
- **Diagnosis-Specific**: Template berbeda untuk setiap diagnosis
- **Service Packages**: Detail layanan yang included/excluded
- **Compliance**: Sesuai aturan BPJS dan asuransi swasta Indonesia

### 4. Enhanced Database
```json
{
  "patientData": {
    "personalInfo": "Birth date, gender, payment method, contact",
    "medicalHistory": "ICD-coded diagnoses with timeline",
    "medications": "Current prescriptions with dosage",
    "allergies": "Detailed allergy information"
  }
}
```

## 🎨 Design System

### Color Palette
- **Medical Blue**: `#2E86AB` - Primary color untuk trust dan professionalism
- **Success Green**: `#06D6A0` - Untuk completed actions dan status positif
- **Warning Orange**: `#F18701` - Untuk attention needed dan status menunggu
- **Error Red**: `#F72585` - Untuk critical alerts dan error states

### Typography
- **Headers**: Roboto Bold (24-32px)
- **Body Text**: Roboto Regular (16-18px)
- **Medical Data**: Roboto Mono (14px) untuk consistency data medis

### Layout
- **Tablet Landscape**: Split-screen design (70% content, 30% tools)
- **Touch-First**: Minimum 44px touch targets
- **Responsive**: Optimized untuk berbagai ukuran tablet (768px - 1024px)

## 🔧 Technical Stack

- **HTML5** dengan semantic markup
- **TailwindCSS** untuk rapid styling dan responsive design
- **Vanilla JavaScript** untuk interaksi dan business logic
- **CSS Custom Properties** untuk design system consistency
- **Web Speech API** untuk voice input functionality
- **Font Awesome** untuk medical icons

## 📱 Supported Devices

- **iPad** (9.7", 10.2", 10.9", 11", 12.9")
- **Android Tablets** (10" - 12" screen size)
- **Microsoft Surface** series
- **Chrome OS Tablets**

Optimized untuk landscape orientation dengan fallback untuk portrait mode.

## 🧪 Testing Guide

### Quick Test Instructions
1. **Open Application**: Launch `index.html` atau `demo-enhanced.html`
2. **Select Patient**: Klik pada appointment card dengan payment method yang berbeda
3. **Test ICD-10**: Ketik di field diagnosis:
   - `diabetes` atau `E11.9` → Diabetes mellitus tipe 2
   - `hipertensi` atau `I10` → Hipertensi esensial  
   - `dispepsia` atau `K30` → Dispepsia
4. **View Auto Pathway**: Perhatikan clinical pathway otomatis muncul
5. **Check Patient Data**: Lihat info lengkap: tanggal lahir, gender, payment method

### Test Scenarios
| Patient | Payment Method | Test Diagnosis | Expected Pathway |
|---------|---------------|----------------|------------------|
| Ahmad Budi | BPJS | E11.9 (Diabetes) | BPJS Standard + Generik |
| Siti Nuraini | Asuransi Swasta | I10 (Hipertensi) | Premium Care + Branded |
| Bambang Sutrisno | Umum | K30 (Dispepsia) | Basic Care + Choice |

### ICD-10 Database Coverage
```javascript
// 15 Common diagnoses included:
'E11.9' → 'Diabetes mellitus tipe 2 tanpa komplikasi'
'I10' → 'Hipertensi esensial'
'K30' → 'Dispepsia'
'J00' → 'Nasofaringitis akut (common cold)'
'A09' → 'Diare dan gastroenteritis'
// ... dan 10 lainnya
```

## 🚀 Features

### Core Features (MVP)
- ✅ Enhanced patient dashboard dengan payment method badges
- ✅ Patient medical record display dengan birth date & gender
- ✅ ICD-10 autocomplete diagnosis entry
- ✅ Auto clinical pathway berdasarkan payment method & diagnosis
- ✅ Voice input untuk speech-to-text  
- ✅ Medical history timeline view
- ✅ Treatment notes functionality
- ✅ Auto-save consultation data

### Enhanced Features  
- ✅ Real-time ICD-10 code search (15+ common diagnoses)
- ✅ Payment method detection dan pathway auto-selection
- ✅ Enhanced patient data structure (birth date, gender, contact)
- ✅ Touch gestures (swipe navigation)
- ✅ Keyboard shortcuts untuk power users
- ✅ Real-time notifications dan alerts
- ✅ Responsive design untuk multiple screen sizes
- ✅ Accessibility features (screen reader support, high contrast)

### Interactive Components
- **AppointmentCard**: Menampilkan info appointment dengan status dan hover effects
- **PatientSummary**: Quick view rekam medis dengan timeline visualization  
- **VoiceInput**: Component speech-to-text dengan visual feedback
- **ClinicalPathwaySelector**: Touch-friendly selection dengan payment method detection
- **MedicalHistoryTimeline**: Chronological view riwayat medis dengan color coding

## 🎯 User Flows

### 1. Morning Practice Preparation
```
Launch App → View Today's Appointments → Review Scheduled Operations → Check Patient Alerts → Ready for Practice
```

### 2. Patient Consultation
```
Select Patient from Queue → View Complete Medical History → Conduct Examination → Input Diagnosis (Voice/Type) → Select Clinical Pathway → Add Treatment Notes → Save & Next Patient
```

### 3. Clinical Pathway Selection
```
Patient Payment Method Detection → BPJS/Insurance/Private Options → Auto-suggest Based on Diagnosis → Confirm Selection → Generate Treatment Plan
```

## 🔐 Security & Privacy

- **Auto-lock**: Screen locks after 5 minutes inactivity
- **Data Protection**: Local storage dengan encryption untuk sensitive data
- **Audit Trail**: Complete logging semua akses data pasien
- **HIPAA Compliance**: Following patient privacy protection standards
- **Screen Recording Prevention**: Mencegah screenshot pada data sensitif

## ♿ Accessibility

### Visual Accessibility
- High contrast ratios (4.5:1 minimum)
- Scalable fonts (support up to 200% zoom)
- Color-blind friendly palette dengan pattern differentiation
- Focus indicators untuk keyboard navigation

### Motor Accessibility  
- Large touch targets (minimum 44px)
- Gesture alternatives untuk semua swipe actions
- Voice control untuk hands-free operation
- One-handed operation mode

### Cognitive Accessibility
- Consistent navigation patterns
- Clear error messages dengan recovery suggestions
- Progress indicators untuk multi-step processes
- Undo functionality untuk critical actions

## 🚀 Installation & Setup

1. **Clone atau download project**
```bash
git clone <repository-url>
cd dashboard-dokter
```

2. **Open di web server**
```bash
# Menggunakan Python built-in server
python -m http.server 8000

# Atau menggunakan Node.js
npx serve .

# Atau menggunakan PHP
php -S localhost:8000
```

3. **Akses aplikasi**
Buka browser dan navigasi ke `http://localhost:8000`

## 📁 File Structure

```
dashboard-dokter/
├── index.html          # Main HTML file dengan complete UI
├── styles.css          # Custom CSS untuk medical-specific styling
├── app.js              # JavaScript untuk interaksi dan business logic
├── README.md           # Dokumentasi project
└── assets/             # (Future: images, icons, fonts)
```

## 🎮 Usage Guide

### Dashboard Navigation
1. **View Today's Schedule**: Lihat daftar appointment hari ini dengan status real-time
2. **Select Patient**: Tap pada appointment card untuk memulai konsultasi
3. **Emergency Slots**: Gunakan slot kosong untuk walk-in patients

### Patient Consultation
1. **Review History**: Lihat riwayat medis di panel kiri
2. **Input Diagnosis**: Gunakan keyboard atau voice input untuk diagnosis
3. **Select Pathway**: Pilih jalur pengobatan berdasarkan pembayaran pasien
4. **Add Notes**: Tambahkan catatan pengobatan dan instruksi
5. **Save & Continue**: Auto-save aktif, manual save dengan Ctrl+S

### Voice Input
1. **Activate**: Tap microphone icon atau gunakan Ctrl+R
2. **Speak Clearly**: Bicara dengan jelas dalam Bahasa Indonesia
3. **Review**: Text akan muncul otomatis, review dan edit jika perlu

### Keyboard Shortcuts
- `Ctrl+S`: Save consultation data
- `Ctrl+R`: Toggle voice input
- `Escape`: Back to dashboard
- `Tab`: Navigate between form elements

## 📊 Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Auto-Save**: Data tersimpan otomatis setiap 30 detik
- **Offline Support**: Basic functionality available tanpa internet
- **Touch Optimization**: Gesture recognition dan haptic feedback
- **Memory Management**: Efficient data handling untuk long sessions

## 🔄 Browser Compatibility

### Fully Supported
- **Chrome**: 70+ (Android/Desktop)
- **Safari**: 12+ (iOS/macOS) 
- **Firefox**: 65+ (Android/Desktop)
- **Edge**: 79+ (Windows)

### Voice Recognition Support
- Chrome (WebKit Speech Recognition)
- Safari (limited, iOS 14.5+)
- Edge (Windows Speech Platform)

## 🐛 Known Limitations

1. **Voice Recognition**: Tidak tersedia di semua browser, fallback ke text input
2. **Offline Mode**: Terbatas pada data yang sudah di-cache
3. **Print Functionality**: Optimized untuk digital use, print styles basic
4. **Multi-Language**: Saat ini hanya mendukung Bahasa Indonesia

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Integration dengan Hospital Information System (HIS)
- [ ] Real-time lab result integration  
- [ ] Telemedicine video consultation
- [ ] Multi-doctor practice management
- [ ] Advanced reporting dan analytics

### Phase 3 Features
- [ ] AI-powered diagnosis suggestions
- [ ] Integration dengan wearable devices
- [ ] Predictive analytics untuk patient care
- [ ] Advanced voice processing dengan medical NLP

## 📞 Support & Contact

Untuk bantuan teknis atau pertanyaan mengenai implementasi:

- **Email**: support@dashboard-dokter.com
- **Documentation**: [Link to detailed docs]
- **Issue Tracking**: [GitHub Issues]

## 📄 License

Copyright (c) 2025 Dashboard Dokter. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: September 14, 2025  
**Minimum Screen Size**: 768px width  
**Recommended**: Tablet landscape mode dengan touch screen