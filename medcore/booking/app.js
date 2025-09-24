class MedCoreApp {
    constructor() {
        this.state = {
            currentView: 'home',
            language: 'en', // Default language
            doctors: [],
            campaigns: [],
            upcomingAppointment: null,
            selectedDoctor: null,
            selectedDate: null,
            selectedRange: null,
            bookingData: {
                name: '',
                phone: '',
                reason: ''
            },
            loading: false,
            availability: {},
            carouselIndex: 0,
            carouselTimer: null
        };

        this.API_BASE = 'https://api.medcore.example.com';
        this.debounceTimer = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPWA();
        this.initializeLanguage();
        this.showView('home');
        this.loadMockData();
    }

    // Initialize language from localStorage or default to English
    initializeLanguage() {
        const savedLanguage = localStorage.getItem('medcore_language');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
            this.state.language = savedLanguage;
        }
        this.updateLanguageUI();
    }

    // Load mock data for demo
    loadMockData() {
        // Mock campaigns data
        this.state.campaigns = [
            {
                id: 'camp_001',
                title: 'Free Health Checkup',
                subtitle: 'Complete health screening this month',
                imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop',
                ctaText: 'Book Now',
                ctaUrl: '/promo/health-checkup',
                priority: 1
            },
            {
                id: 'camp_002',
                title: 'Vaccination Drive',
                subtitle: 'Protect yourself and your family',
                imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
                ctaText: 'Get Vaccinated',
                ctaUrl: '/promo/vaccination',
                priority: 2
            },
            {
                id: 'camp_003',
                title: 'Heart Health Week',
                subtitle: 'Cardiology consultation at 50% off',
                imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=200&fit=crop',
                ctaText: 'Learn More',
                ctaUrl: '/promo/heart-health',
                priority: 3
            },
            {
                id: 'camp_004',
                title: 'Pediatric Care',
                subtitle: 'Expert care for your little ones',
                imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=200&fit=crop',
                ctaText: 'Book Appointment',
                ctaUrl: '/doctors/pediatrician',
                priority: 4
            }
        ];

        // Mock upcoming appointment (simulate having one)
        this.state.upcomingAppointment = {
            id: 'apt_upcoming',
            doctor: 'Dr. Sarah Wilson',
            specialty: 'General Practitioner',
            date: this.getTomorrowDate(),
            rangeLabel: 'Morning',
            window: { start: '09:00', end: '12:00' },
            ticket: 'MC-A7F2'
        };

        // Mock doctors data
        this.state.doctors = [
            {
                id: 'doc_001',
                name: 'Dr. Sarah Wilson',
                specialization: 'General Practitioner',
                clinic: 'HealthCare Center',
                avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
            },
            {
                id: 'doc_002',
                name: 'Dr. Michael Chen',
                specialization: 'Cardiologist',
                clinic: 'Heart Specialist Clinic',
                avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face'
            },
            {
                id: 'doc_003',
                name: 'Dr. Emily Rodriguez',
                specialization: 'Pediatrician',
                clinic: 'Children\'s Medical Center',
                avatarUrl: 'https://images.unsplash.com/photo-1594824020872-52c294bb526c?w=100&h=100&fit=crop&crop=face'
            }
        ];

        // Mock availability data
        this.state.availability = {
            'doc_001': {
                ranges: [
                    { id: 'am', label: 'Morning', start: '09:00', end: '12:00', remaining: 6 },
                    { id: 'pm', label: 'Afternoon', start: '13:00', end: '16:00', remaining: 2 },
                    { id: 'ev', label: 'Evening', start: '17:00', end: '19:00', remaining: 0 }
                ]
            },
            'doc_002': {
                ranges: [
                    { id: 'am', label: 'Morning', start: '08:00', end: '11:00', remaining: 3 },
                    { id: 'pm', label: 'Afternoon', start: '14:00', end: '17:00', remaining: 8 }
                ]
            },
            'doc_003': {
                ranges: [
                    { id: 'am', label: 'Morning', start: '09:00', end: '12:00', remaining: 1 },
                    { id: 'pm', label: 'Afternoon', start: '13:00', end: '15:00', remaining: 5 },
                    { id: 'ev', label: 'Evening', start: '16:00', end: '18:00', remaining: 4 }
                ]
            }
        };

        // Initialize home page after loading mock data
        this.initializeHomePage();
    }

    // Initialize home page components
    initializeHomePage() {
        this.renderCampaignCarousel();
        this.renderUpcomingAppointment();
        this.renderDoctorsPreview();
        this.startCarouselAutoPlay();
    }

    // Get tomorrow's date
    getTomorrowDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    // Language translations
    getTranslations() {
        return {
            en: {
                clinicTagline: "serving with all our heart",
                upcomingAppointment: "Upcoming Appointment",
                viewDetails: "View Details",
                ourDoctors: "Our Doctors",
                viewAll: "View All",
                searchPlaceholder: "Search doctors or specialization",
                noMatches: "No matches. Try a different name or specialty.",
                notAvailableThisDay: "Not available this day.",
                selectDate: "Select Date",
                availableTimes: "Available Times",
                bookAppointment: "Book Appointment",
                fullName: "Full Name",
                phoneNumber: "Phone Number",
                reasonForVisit: "Reason for Visit (Optional)",
                briefDescription: "Brief description...",
                confirmBooking: "Confirm Booking",
                bookingConfirmed: "Booking Confirmed!",
                appointmentDetails: "Appointment Details",
                doctor: "Doctor",
                dateTime: "Date & Time",
                ticketCode: "Ticket Code",
                important: "Important",
                arrivalGuidance: "Arrive within the first 30 minutes of your window. Show your ticket code at reception.",
                addToCalendar: "Add to Calendar",
                bookAnother: "Book Another",
                morning: "Morning",
                afternoon: "Afternoon",
                evening: "Evening",
                spots: "Spots",
                limited: "Limited",
                full: "Full",
                available: "Available",
                generalPractitioner: "General Practitioner",
                cardiologist: "Cardiologist",
                pediatrician: "Pediatrician"
            },
            id: {
                clinicTagline: "melayani dengan sepenuh hati",
                upcomingAppointment: "Jadwal Mendatang",
                viewDetails: "Lihat Detail",
                ourDoctors: "Dokter Kami",
                viewAll: "Lihat Semua",
                searchPlaceholder: "Cari dokter atau spesialisasi",
                noMatches: "Tidak ada hasil. Coba nama atau spesialisasi lain.",
                notAvailableThisDay: "Tidak tersedia hari ini.",
                selectDate: "Pilih Tanggal",
                availableTimes: "Waktu Tersedia",
                bookAppointment: "Buat Janji",
                fullName: "Nama Lengkap",
                phoneNumber: "Nomor Telepon",
                reasonForVisit: "Alasan Kunjungan (Opsional)",
                briefDescription: "Deskripsi singkat...",
                confirmBooking: "Konfirmasi Booking",
                bookingConfirmed: "Booking Dikonfirmasi!",
                appointmentDetails: "Detail Janji",
                doctor: "Dokter",
                dateTime: "Tanggal & Waktu",
                ticketCode: "Kode Tiket",
                important: "Penting",
                arrivalGuidance: "Tiba dalam 30 menit pertama dari waktu yang ditentukan. Tunjukkan kode tiket di resepsionis.",
                addToCalendar: "Tambah ke Kalender",
                bookAnother: "Buat Lagi",
                morning: "Pagi",
                afternoon: "Siang",
                evening: "Sore",
                spots: "Slot",
                limited: "Terbatas",
                full: "Penuh",
                available: "Tersedia",
                generalPractitioner: "Dokter Umum",
                cardiologist: "Spesialis Jantung",
                pediatrician: "Dokter Anak"
            }
        };
    }

    // Get translation for current language
    t(key) {
        const translations = this.getTranslations();
        return translations[this.state.language][key] || translations.en[key] || key;
    }

    // Change language
    changeLanguage(language) {
        if (language !== 'en' && language !== 'id') return;

        this.state.language = language;
        localStorage.setItem('medcore_language', language);
        this.updateLanguageUI();
        this.updateContent();

        // Show success message
        const message = language === 'id' ? 'Bahasa berhasil diubah' : 'Language changed successfully';
        this.showToast(message, 'success');
    }

    // Update language UI (button states)
    updateLanguageUI() {
        document.querySelectorAll('.language-btn').forEach(btn => {
            if (btn.dataset.lang === this.state.language) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Update content based on selected language
    updateContent() {
        // Update clinic tagline
        const tagline = document.querySelector('.clinic-tagline');
        if (tagline) {
            tagline.textContent = this.t('clinicTagline');
        }

        // Update placeholders and text content
        const searchInput = document.getElementById('doctor-search');
        if (searchInput) {
            searchInput.placeholder = this.t('searchPlaceholder');
        }

        // Update section headers
        const upcomingHeader = document.querySelector('.upcoming-appointment h2');
        if (upcomingHeader) {
            upcomingHeader.textContent = this.t('upcomingAppointment');
        }

        const doctorsHeader = document.querySelector('.section-header h2');
        if (doctorsHeader) {
            doctorsHeader.textContent = this.t('ourDoctors');
        }

        const viewAllBtn = document.querySelector('.view-all-btn');
        if (viewAllBtn) {
            viewAllBtn.textContent = this.t('viewAll');
        }

        // Update form labels if visible
        this.updateFormLabels();

        // Re-render content with translations
        if (this.state.currentView === 'home') {
            this.renderUpcomingAppointment();
            this.renderDoctorsPreview();
        }
    }

    // Update form labels
    updateFormLabels() {
        const labels = {
            'patient-name': this.t('fullName'),
            'patient-phone': this.t('phoneNumber'),
            'visit-reason': this.t('reasonForVisit')
        };

        Object.entries(labels).forEach(([id, text]) => {
            const input = document.getElementById(id);
            if (input) {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.textContent = text + (id === 'visit-reason' ? '' : ' *');
                }
                if (id === 'visit-reason') {
                    input.placeholder = this.t('briefDescription');
                }
            }
        });

        const confirmBtn = document.querySelector('#booking-form .btn-primary');
        if (confirmBtn) {
            confirmBtn.textContent = this.t('confirmBooking');
        }
    }

    // Render campaign carousel
    renderCampaignCarousel() {
        const slidesContainer = document.getElementById('carousel-slides');
        const dotsContainer = document.getElementById('carousel-dots');

        if (!slidesContainer || !dotsContainer) return;

        // Render slides
        slidesContainer.innerHTML = this.state.campaigns.map(campaign => `
            <div class="carousel-slide" style="background-image: url('${campaign.imageUrl}')">
                <div class="slide-content">
                    <h3 class="slide-title">${campaign.title}</h3>
                    <p class="slide-subtitle">${campaign.subtitle}</p>
                    <a href="${campaign.ctaUrl}" class="slide-cta" onclick="event.preventDefault(); app.handleCampaignClick('${campaign.id}')">${campaign.ctaText}</a>
                </div>
            </div>
        `).join('');

        // Render dots
        dotsContainer.innerHTML = this.state.campaigns.map((_, index) => `
            <button class="carousel-dot ${index === 0 ? 'active' : ''}"
                    onclick="app.goToSlide(${index})"
                    role="tab"
                    aria-selected="${index === 0 ? 'true' : 'false'}"
                    aria-label="Go to slide ${index + 1}"></button>
        `).join('');

        // Set initial width for dynamic number of slides
        const slideCount = this.state.campaigns.length;
        slidesContainer.style.width = `${slideCount * 100}%`;

        // Update slide flex basis
        document.querySelectorAll('.carousel-slide').forEach(slide => {
            slide.style.flex = `0 0 ${100 / slideCount}%`;
        });
    }

    // Handle campaign click
    handleCampaignClick(campaignId) {
        const campaign = this.state.campaigns.find(c => c.id === campaignId);
        if (campaign) {
            this.showToast(`Opening ${campaign.title}`, 'info');
            // In a real app, this would navigate to the campaign page
        }
    }

    // Start carousel auto-play
    startCarouselAutoPlay() {
        this.stopCarouselAutoPlay(); // Clear any existing timer

        this.state.carouselTimer = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5 seconds as per spec
    }

    // Stop carousel auto-play
    stopCarouselAutoPlay() {
        if (this.state.carouselTimer) {
            clearInterval(this.state.carouselTimer);
            this.state.carouselTimer = null;
        }
    }

    // Go to specific slide
    goToSlide(index) {
        this.state.carouselIndex = index;
        this.updateCarouselPosition();
        this.updateCarouselDots();

        // Restart auto-play timer
        this.startCarouselAutoPlay();
    }

    // Next slide
    nextSlide() {
        this.state.carouselIndex = (this.state.carouselIndex + 1) % this.state.campaigns.length;
        this.updateCarouselPosition();
        this.updateCarouselDots();
    }

    // Previous slide
    prevSlide() {
        this.state.carouselIndex = this.state.carouselIndex === 0
            ? this.state.campaigns.length - 1
            : this.state.carouselIndex - 1;
        this.updateCarouselPosition();
        this.updateCarouselDots();

        // Restart auto-play timer
        this.startCarouselAutoPlay();
    }

    // Update carousel position
    updateCarouselPosition() {
        const slidesContainer = document.getElementById('carousel-slides');
        if (slidesContainer) {
            const translateX = -((this.state.carouselIndex * 100) / this.state.campaigns.length);
            slidesContainer.style.transform = `translateX(${translateX}%)`;
        }
    }

    // Update carousel dots
    updateCarouselDots() {
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            if (index === this.state.carouselIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    }

    // Render upcoming appointment
    renderUpcomingAppointment() {
        const container = document.getElementById('upcoming-appointment');
        if (!container) return;

        if (!this.state.upcomingAppointment) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');
        const appointment = this.state.upcomingAppointment;
        const appointmentDate = new Date(appointment.date);

        const contentDiv = container.querySelector('.appointment-content');
        contentDiv.innerHTML = `
            <div class="appointment-date">
                <div class="appointment-day">${appointmentDate.getDate()}</div>
                <div class="appointment-month">${appointmentDate.toLocaleDateString('en', { month: 'short' })}</div>
            </div>
            <div class="appointment-details">
                <div class="appointment-doctor">${appointment.doctor}</div>
                <div class="appointment-specialty">${appointment.specialty}</div>
                <div class="appointment-time">
                    <strong>${appointment.rangeLabel}</strong> (${appointment.window.start}–${appointment.window.end})
                </div>
            </div>
        `;
    }

    // Render doctors preview
    renderDoctorsPreview() {
        const container = document.querySelector('.doctors-preview-list');
        if (!container) return;

        // Show only first 3 doctors
        const previewDoctors = this.state.doctors.slice(0, 3);

        container.innerHTML = previewDoctors.map(doctor => {
            // Translate specialization
            let translatedSpecialty = doctor.specialization;
            if (doctor.specialization === 'General Practitioner') {
                translatedSpecialty = this.t('generalPractitioner');
            } else if (doctor.specialization === 'Cardiologist') {
                translatedSpecialty = this.t('cardiologist');
            } else if (doctor.specialization === 'Pediatrician') {
                translatedSpecialty = this.t('pediatrician');
            }

            return `
                <article class="doctor-preview-card"
                         role="button"
                         tabindex="0"
                         data-doctor-id="${doctor.id}"
                         onclick="app.selectDoctor('${doctor.id}')"
                         onkeydown="app.handleCardKeydown(event, '${doctor.id}')">
                    <img class="doctor-avatar"
                         src="${doctor.avatarUrl || 'https://via.placeholder.com/48/E5E7EB/6B7280?text=Dr'}"
                         alt="Dr. ${doctor.name}"
                         onerror="this.src='https://via.placeholder.com/48/E5E7EB/6B7280?text=Dr'">
                    <div class="doctor-details">
                        <h3 class="doctor-name">${doctor.name}</h3>
                        <p class="doctor-specialty">${translatedSpecialty}</p>
                    </div>
                    <span class="next-available">${this.t('available')}</span>
                </article>
            `;
        }).join('');
    }

    // Handle WhatsApp contact
    openWhatsApp() {
        const whatsappURL = 'https://wa.me/6233123332';
        const message = this.state.language === 'id'
            ? 'Halo, saya ingin bertanya tentang layanan Klinik Sehat.'
            : 'Hello, I would like to inquire about Klinik Sehat services.';

        const fullURL = `${whatsappURL}?text=${encodeURIComponent(message)}`;

        // Track WhatsApp click
        this.announceToScreenReader(
            this.state.language === 'id'
                ? 'Membuka WhatsApp untuk menghubungi klinik'
                : 'Opening WhatsApp to contact clinic'
        );

        // Open WhatsApp
        window.open(fullURL, '_blank', 'noopener');
    }

    // Show all doctors (navigate to search/doctor list)
    showAllDoctors() {
        this.showView('search');
        this.renderDoctors(this.state.doctors);
    }

    // Event binding
    bindEvents() {
        // Search
        const searchInput = document.getElementById('doctor-search');
        searchInput.addEventListener('input', (e) => {
            this.debounceSearch(e.target.value);
        });

        // Bottom sheet
        const bookingSheet = document.getElementById('booking-sheet');
        const overlay = bookingSheet.querySelector('.sheet-overlay');
        overlay.addEventListener('click', () => {
            this.hideBookingSheet();
        });

        // Form submission
        const bookingForm = document.getElementById('booking-form');
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBookingSubmit();
        });

        // Back navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('back-btn')) {
                this.goBack();
            }
        });

        // Carousel navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('carousel-next')) {
                this.nextSlide();
            } else if (e.target.classList.contains('carousel-prev')) {
                this.prevSlide();
            }
        });

        // Pause carousel on hover
        const carousel = document.querySelector('.campaign-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.stopCarouselAutoPlay();
            });

            carousel.addEventListener('mouseleave', () => {
                this.startCarouselAutoPlay();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Prevent zoom on iOS
        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
        });
    }

    // Handle keyboard navigation
    handleKeyNavigation(e) {
        // Escape key closes modal
        if (e.key === 'Escape') {
            const modal = document.querySelector('.bottom-sheet.visible');
            if (modal) {
                this.hideBookingSheet();
            }
        }

        // Tab trapping in modal
        if (e.key === 'Tab') {
            const modal = document.querySelector('.bottom-sheet.visible');
            if (modal) {
                this.trapFocus(e, modal);
            }
        }

        // Arrow key navigation
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            this.handleArrowNavigation(e);
        }

        // Enter/Space for buttons
        if ((e.key === 'Enter' || e.key === ' ') &&
            (e.target.classList.contains('doctor-card') ||
             e.target.classList.contains('day-chip') ||
             e.target.classList.contains('range-chip'))) {
            e.preventDefault();
            e.target.click();
        }
    }

    trapFocus(event, modal) {
        const focusableElements = modal.querySelectorAll(
            'button, input, textarea, select, a[href]'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    handleArrowNavigation(event) {
        const activeElement = document.activeElement;

        if (activeElement.classList.contains('day-chip') ||
            activeElement.classList.contains('range-chip')) {

            const siblings = [...activeElement.parentElement.children];
            const currentIndex = siblings.indexOf(activeElement);
            let nextIndex = currentIndex;

            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextIndex = Math.max(0, currentIndex - 1);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    nextIndex = Math.min(siblings.length - 1, currentIndex + 1);
                    break;
            }

            if (nextIndex !== currentIndex) {
                event.preventDefault();
                siblings[nextIndex].focus();
            }
        }
    }

    // Search functionality
    debounceSearch(query) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.searchDoctors(query);
        }, 300);
    }

    async searchDoctors(query) {
        if (query.length < 2) {
            this.renderDoctors([]);
            return;
        }

        try {
            this.setLoading(true);

            // Simulate API delay
            await this.delay(500);

            // Filter mock data
            const filtered = this.state.doctors.filter(doctor =>
                doctor.name.toLowerCase().includes(query.toLowerCase()) ||
                doctor.specialization.toLowerCase().includes(query.toLowerCase()) ||
                doctor.clinic.toLowerCase().includes(query.toLowerCase())
            );

            this.renderDoctors(filtered);
            this.announceToScreenReader(`Found ${filtered.length} doctors`);
        } catch (error) {
            this.showToast('Failed to search doctors. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    // Render doctors
    renderDoctors(doctors) {
        const container = document.querySelector('.doctor-list');
        const emptyState = document.querySelector('.empty-state');

        if (doctors.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        container.innerHTML = doctors.map(doctor => `
            <article class="doctor-card"
                     role="button"
                     tabindex="0"
                     data-doctor-id="${doctor.id}"
                     onclick="app.selectDoctor('${doctor.id}')"
                     onkeydown="app.handleCardKeydown(event, '${doctor.id}')">
                <img class="doctor-avatar"
                     src="${doctor.avatarUrl || 'https://via.placeholder.com/48/E5E7EB/6B7280?text=Dr'}"
                     alt="Dr. ${doctor.name}"
                     onerror="this.src='https://via.placeholder.com/48/E5E7EB/6B7280?text=Dr'">
                <div class="doctor-details">
                    <h3 class="doctor-name">${doctor.name}</h3>
                    <p class="doctor-specialty">${doctor.specialization}</p>
                    <p class="clinic-name">${doctor.clinic}</p>
                </div>
                <span class="next-available">Next: Today</span>
            </article>
        `).join('');
    }

    // Handle card keyboard navigation
    handleCardKeydown(event, doctorId) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.selectDoctor(doctorId);
        }
    }

    // Doctor selection
    async selectDoctor(doctorId) {
        const doctor = this.state.doctors.find(d => d.id === doctorId);
        if (!doctor) return;

        this.state.selectedDoctor = doctor;
        this.showView('doctor-detail');

        // Update doctor info in header
        document.querySelector('.doctor-detail .doctor-avatar').src =
            doctor.avatarUrl || 'https://via.placeholder.com/48/E5E7EB/6B7280?text=Dr';
        document.querySelector('.doctor-detail .doctor-name').textContent = doctor.name;
        document.querySelector('.doctor-detail .doctor-specialty').textContent = doctor.specialization;
        document.querySelector('.doctor-detail .clinic-name').textContent = doctor.clinic;

        // Load availability
        await this.loadDoctorAvailability(doctorId);
    }

    async loadDoctorAvailability(doctorId) {
        try {
            this.setLoading(true);

            // Generate next 14 days
            const dates = this.getNext14Days();
            this.renderDayPicker(dates);

            // Simulate API delay
            await this.delay(300);

            // Select today by default
            if (dates.length > 0) {
                this.selectDate(dates[0].date);
            }

        } catch (error) {
            this.showToast('Failed to load availability.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    getNext14Days() {
        const days = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            days.push({
                date: date.toISOString().split('T')[0],
                dayName: date.toLocaleDateString('en', { weekday: 'short' }),
                dayNumber: date.getDate(),
                isToday: i === 0
            });
        }

        return days;
    }

    renderDayPicker(dates) {
        const container = document.querySelector('.day-chips');

        container.innerHTML = dates.map(day => `
            <button class="day-chip ${day.isToday ? 'today' : ''}"
                    data-date="${day.date}"
                    onclick="app.selectDate('${day.date}')"
                    role="radio"
                    aria-checked="false"
                    tabindex="-1">
                <div class="day-name">${day.dayName}</div>
                <div class="day-number">${day.dayNumber}</div>
            </button>
        `).join('');

        // Set first chip as focusable
        const firstChip = container.querySelector('.day-chip');
        if (firstChip) {
            firstChip.tabIndex = 0;
        }
    }

    async selectDate(date) {
        // Update UI
        document.querySelectorAll('.day-chip').forEach((chip, index) => {
            chip.classList.remove('selected');
            chip.setAttribute('aria-checked', 'false');
            chip.tabIndex = -1;
        });

        const selectedChip = document.querySelector(`[data-date="${date}"]`);
        selectedChip.classList.add('selected');
        selectedChip.setAttribute('aria-checked', 'true');
        selectedChip.tabIndex = 0;

        this.state.selectedDate = date;

        // Load availability for selected date
        try {
            this.setLoading(true);

            // Simulate API delay
            await this.delay(300);

            const availability = this.state.availability[this.state.selectedDoctor.id];
            this.renderAvailability(availability, date);

            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });
            this.announceToScreenReader(`Selected ${formattedDate}. ${availability.ranges.length} time slots available.`);

        } catch (error) {
            this.showToast('Failed to load availability.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    renderAvailability(availability, date) {
        const container = document.querySelector('.range-chips');
        const noAvailability = document.querySelector('.no-availability');

        if (!availability.ranges || availability.ranges.length === 0) {
            container.innerHTML = '';
            noAvailability.classList.remove('hidden');
            return;
        }

        noAvailability.classList.add('hidden');

        container.innerHTML = availability.ranges.map((range, index) => {
            let availabilityClass = '';
            let availabilityText = `Spots: ${range.remaining}`;

            if (range.remaining === 0) {
                availabilityClass = 'full';
                availabilityText = 'Full';
            } else if (range.remaining < 3) {
                availabilityClass = 'limited';
                availabilityText = 'Limited';
            }

            return `
                <button class="range-chip"
                        data-range-id="${range.id}"
                        onclick="app.selectRange('${range.id}')"
                        ${range.remaining === 0 ? 'disabled' : ''}
                        role="radio"
                        aria-checked="false"
                        tabindex="${index === 0 ? '0' : '-1'}">
                    <div class="range-time">${range.label} (${range.start}–${range.end})</div>
                    <div class="range-availability ${availabilityClass}">• ${availabilityText}</div>
                </button>
            `;
        }).join('');
    }

    selectRange(rangeId) {
        const availability = this.state.availability[this.state.selectedDoctor.id];
        const range = availability.ranges.find(r => r.id === rangeId);

        if (!range || range.remaining === 0) return;

        // Update UI
        document.querySelectorAll('.range-chip').forEach(chip => {
            chip.classList.remove('selected');
            chip.setAttribute('aria-checked', 'false');
            chip.tabIndex = -1;
        });

        const selectedChip = document.querySelector(`[data-range-id="${rangeId}"]`);
        selectedChip.classList.add('selected');
        selectedChip.setAttribute('aria-checked', 'true');
        selectedChip.tabIndex = 0;

        this.state.selectedRange = range;
        this.showBookingSheet();

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    // Bottom sheet management
    showBookingSheet() {
        const sheet = document.getElementById('booking-sheet');
        sheet.classList.remove('hidden');

        // Trigger animation
        requestAnimationFrame(() => {
            sheet.classList.add('visible');
        });

        // Focus first input after animation
        setTimeout(() => {
            const firstInput = document.getElementById('patient-name');
            firstInput.focus();
        }, 300);

        // Store current focus for restoration
        this.lastFocusedElement = document.activeElement;
    }

    hideBookingSheet() {
        const sheet = document.getElementById('booking-sheet');
        sheet.classList.remove('visible');

        setTimeout(() => {
            sheet.classList.add('hidden');
            // Restore focus
            if (this.lastFocusedElement) {
                this.lastFocusedElement.focus();
            }
        }, 200);
    }

    // Form handling
    async handleBookingSubmit() {
        const formData = new FormData(document.getElementById('booking-form'));
        const bookingData = {
            name: formData.get('name').trim(),
            phone: formData.get('phone').trim(),
            reason: formData.get('reason').trim()
        };

        // Validation
        if (!this.validateBookingData(bookingData)) {
            return;
        }

        try {
            this.setLoading(true);

            // Simulate API delay
            await this.delay(1500);

            // Mock API response
            const appointment = {
                id: 'apt_' + Math.random().toString(36).substr(2, 9),
                doctorId: this.state.selectedDoctor.id,
                patient: {
                    name: bookingData.name,
                    phone: bookingData.phone
                },
                date: this.state.selectedDate,
                rangeId: this.state.selectedRange.id,
                rangeLabel: this.state.selectedRange.label,
                window: {
                    start: this.state.selectedRange.start,
                    end: this.state.selectedRange.end
                },
                status: 'confirmed',
                ticket: 'MC-' + Math.random().toString(36).substr(2, 4).toUpperCase()
            };

            this.hideBookingSheet();
            this.showConfirmation(appointment);

            // Update availability
            this.state.availability[this.state.selectedDoctor.id].ranges
                .find(r => r.id === this.state.selectedRange.id).remaining--;

        } catch (error) {
            this.showToast('Booking failed. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    validateBookingData(data) {
        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });

        // Clear error styling
        document.querySelectorAll('.form-group input').forEach(input => {
            input.style.borderColor = '';
        });

        // Name validation
        if (!data.name || data.name.length < 2) {
            this.showFieldError('name-error', 'Please enter a valid name');
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!data.phone || !phoneRegex.test(data.phone.replace(/\s+/g, ''))) {
            this.showFieldError('phone-error', 'Please enter a valid phone number');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = message;

        // Add error styling to input
        const input = errorElement.previousElementSibling;
        input.style.borderColor = 'var(--color-error)';

        // Shake animation
        this.shakeElement(input);

        // Remove error styling on focus
        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--color-primary)';
            errorElement.textContent = '';
        }, { once: true });
    }

    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Confirmation screen
    showConfirmation(appointment) {
        this.showView('confirmation');

        // Populate confirmation details
        document.querySelector('.confirmation .doctor-info').textContent =
            `${this.state.selectedDoctor.name} - ${this.state.selectedDoctor.specialization}`;

        document.querySelector('.confirmation .datetime-info').innerHTML = `
            ${this.formatDate(appointment.date)}<br>
            ${appointment.rangeLabel} (${appointment.window.start}–${appointment.window.end})
        `;

        document.querySelector('.confirmation .ticket-code').textContent = appointment.ticket;

        // Success animation
        this.animateSuccess();

        // Announce to screen readers
        this.announceToScreenReader(`Booking confirmed for ${appointment.rangeLabel} on ${this.formatDate(appointment.date)}. Your ticket code is ${appointment.ticket}.`);
    }

    animateSuccess() {
        const icon = document.querySelector('.success-icon');
        icon.style.transform = 'scale(0)';

        setTimeout(() => {
            icon.style.transform = 'scale(1)';
            icon.style.transition = 'transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 100);

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    // Utility methods
    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.home-section, .search-section, .doctor-results, .doctor-detail, .confirmation')
            .forEach(section => section.classList.add('hidden'));

        // Show target view
        switch (viewName) {
            case 'home':
                document.querySelector('.home-section').classList.remove('hidden');
                // Restart carousel if returning to home
                if (this.state.currentView !== 'home') {
                    this.startCarouselAutoPlay();
                }
                break;
            case 'search':
                document.querySelector('.search-section').classList.remove('hidden');
                document.querySelector('.doctor-results').classList.remove('hidden');
                // Stop carousel when leaving home
                this.stopCarouselAutoPlay();
                document.getElementById('doctor-search').focus();
                break;
            case 'doctor-detail':
                document.querySelector('.doctor-detail').classList.remove('hidden');
                // Stop carousel when leaving home
                this.stopCarouselAutoPlay();
                break;
            case 'confirmation':
                document.querySelector('.confirmation').classList.remove('hidden');
                // Stop carousel when leaving home
                this.stopCarouselAutoPlay();
                break;
        }

        this.state.currentView = viewName;
    }

    goBack() {
        switch (this.state.currentView) {
            case 'search':
                this.showView('home');
                break;
            case 'doctor-detail':
                this.showView('search');
                break;
            case 'confirmation':
                this.showView('home');
                // Reset state
                this.state.selectedDoctor = null;
                this.state.selectedDate = null;
                this.state.selectedRange = null;
                // Clear form
                document.getElementById('booking-form').reset();
                break;
        }
    }

    setLoading(isLoading) {
        const overlay = document.getElementById('loading-overlay');
        if (isLoading) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
        this.state.loading = isLoading;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 150);
        }, 3000);

        // Announce to screen readers
        this.announceToScreenReader(message);
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // PWA setup
    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }

        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
        });

        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
        });
    }
}

// Add shake keyframes
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MedCoreApp();
});