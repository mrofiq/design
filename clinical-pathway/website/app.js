/**
 * Dashboard Dokter - Advanced JavaScript Interactions
 * Tablet Medical Application
 */

// ICD-10 Diagnosis Database
const ICD10_DATABASE = [
    { code: 'E11.9', name: 'Diabetes mellitus tipe 2 tanpa komplikasi' },
    { code: 'I10', name: 'Hipertensi esensial' },
    { code: 'K30', name: 'Dispepsia' },
    { code: 'J00', name: 'Nasofaringitis akut (common cold)' },
    { code: 'A09', name: 'Diare dan gastroenteritis' },
    { code: 'R50.9', name: 'Demam, tidak spesifik' },
    { code: 'M79.3', name: 'Panniculitis, tidak spesifik' },
    { code: 'J06.9', name: 'Infeksi saluran pernapasan atas akut' },
    { code: 'K59.1', name: 'Konstipasi' },
    { code: 'G43.9', name: 'Migrain, tidak spesifik' },
    { code: 'E78.5', name: 'Hiperlipidemia, tidak spesifik' },
    { code: 'M25.50', name: 'Nyeri sendi' },
    { code: 'R06.00', name: 'Dispnea, tidak spesifik' },
    { code: 'N39.0', name: 'Infeksi saluran kemih' },
    { code: 'H57.1', name: 'Mata kering' }
];

// Clinical Pathway Templates
const CLINICAL_PATHWAYS = {
    'BPJS': {
        'E11.9': { // Diabetes
            name: 'Diabetes Management - BPJS',
            services: ['Konsultasi', 'Tes HbA1c', 'Obat generik'],
            restrictions: ['Obat branded dikecualikan'],
            followUp: '3 bulan'
        },
        'I10': { // Hipertensi
            name: 'Hypertension Care - BPJS',
            services: ['Konsultasi', 'EKG', 'Obat antihipertensi generik'],
            restrictions: ['Maksimal 2 jenis obat'],
            followUp: '1 bulan'
        }
    },
    'Asuransi Swasta': {
        'E11.9': {
            name: 'Comprehensive Diabetes Care',
            services: ['Konsultasi spesialis', 'Tes lengkap', 'Obat branded', 'Konsultasi nutrisi'],
            restrictions: ['Sesuai limit polis'],
            followUp: '1 bulan'
        },
        'I10': {
            name: 'Premium Hypertension Management',
            services: ['Konsultasi', 'EKG', 'Echocardiogram', 'Obat premium'],
            restrictions: ['Sesuai benefit asuransi'],
            followUp: '2 minggu'
        }
    },
    'Umum': {
        'E11.9': {
            name: 'Basic Diabetes Care',
            services: ['Konsultasi', 'Tes gula darah', 'Obat sesuai pilihan'],
            restrictions: ['Bayar sesuai tarif'],
            followUp: '1 bulan'
        }
    }
};

// Enhanced Patient Database
const PATIENTS_DATABASE = {
    'P123456': {
        name: 'Ahmad Budi',
        age: 45,
        id: 'P123456',
        birthDate: '1978-03-15',
        gender: 'Laki-laki',
        paymentMethod: 'BPJS',
        phone: '+62812-3456-7890',
        address: 'Jl. Sudirman No. 123, Jakarta',
        medicalHistory: [
            {
                date: '2025-08-15',
                diagnosis: 'E11.9 - Diabetes mellitus tipe 2',
                vitals: 'TD: 140/90, GD: 180 mg/dL',
                treatment: 'Metformin 500mg 2x1'
            }
        ],
        allergies: ['Tidak ada'],
        currentMedications: ['Metformin 500mg']
    },
    'P789012': {
        name: 'Siti Nuraini',
        age: 38,
        id: 'P789012',
        birthDate: '1987-06-22',
        gender: 'Perempuan',
        paymentMethod: 'Asuransi Swasta',
        phone: '+62813-9876-5432',
        address: 'Jl. Kebon Jeruk No. 45, Jakarta',
        medicalHistory: [
            {
                date: '2025-09-10',
                diagnosis: 'K30 - Dispepsia',
                vitals: 'TD: 120/80, HR: 72',
                treatment: 'Omeprazole 20mg 1x1'
            }
        ],
        allergies: ['Penisilin'],
        currentMedications: ['Omeprazole 20mg']
    },
    'P456789': {
        name: 'Bambang Sutrisno',
        age: 52,
        id: 'P456789',
        birthDate: '1971-12-08',
        gender: 'Laki-laki',
        paymentMethod: 'Umum',
        phone: '+62814-5555-1234',
        address: 'Jl. Mangga Dua No. 78, Jakarta',
        medicalHistory: [
            {
                date: '2025-09-12',
                diagnosis: 'I10 - Hipertensi esensial',
                vitals: 'TD: 150/95, HR: 82',
                treatment: 'Amlodipine 5mg 1x1'
            }
        ],
        allergies: ['Sulfa'],
        currentMedications: ['Amlodipine 5mg']
    }
};

class DashboardDokter {
    constructor() {
        this.currentPatient = null;
        this.isVoiceRecording = false;
        this.selectedPathway = null;
        this.appointments = this.loadMockAppointments();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.setupAutoSave();
        this.setupNotifications();
        this.loadDashboardData();
    }

    setupEventListeners() {
        // Touch and gesture handling
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Keyboard shortcuts for accessibility
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Window resize for responsive adjustments
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));

        // Form validation
        document.addEventListener('input', this.handleFormInput.bind(this));
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'id-ID'; // Indonesian language for medical terms
            
            this.recognition.onstart = () => {
                this.showVoiceRecordingState(true);
            };
            
            this.recognition.onresult = (event) => {
                this.handleVoiceResult(event);
            };
            
            this.recognition.onerror = (event) => {
                this.handleVoiceError(event);
            };
            
            this.recognition.onend = () => {
                this.showVoiceRecordingState(false);
            };
        } else {
            console.warn('Speech Recognition API not supported');
        }
    }

    setupAutoSave() {
        // Auto-save consultation data every 30 seconds
        setInterval(() => {
            if (this.currentPatient) {
                this.saveConsultationData();
            }
        }, 30000);

        // Save on critical form changes
        const criticalFields = ['#diagnosis-input', '#treatment-notes'];
        criticalFields.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener('blur', () => this.saveConsultationData());
            }
        });
    }

    setupNotifications() {
        // Check for critical alerts every minute
        setInterval(() => {
            this.checkCriticalAlerts();
        }, 60000);

        // Lab results notification
        this.scheduleLabResultsCheck();
    }

    loadMockAppointments() {
        // Load appointments from the enhanced patient database
        return Object.keys(PATIENTS_DATABASE).map((patientId, index) => {
            const patient = PATIENTS_DATABASE[patientId];
            const times = ['09:00', '09:30', '10:00', '10:30', '11:00'];
            const types = ['check-up', 'follow-up', 'consultation'];
            const statuses = ['confirmed', 'waiting', 'available'];
            
            return {
                id: patientId,
                name: patient.name,
                time: times[index] || '11:30',
                type: types[index % 3],
                status: statuses[index % 3],
                age: patient.age,
                gender: patient.gender,
                paymentMethod: patient.paymentMethod,
                condition: patient.medicalHistory.length > 0 ? patient.medicalHistory[0].diagnosis : 'New Patient',
                lastVisit: patient.medicalHistory.length > 0 ? patient.medicalHistory[0].date : null
            };
        });
    }

    loadDashboardData() {
        // Simulate loading appointments and updating UI
        this.updateAppointmentsList();
        this.updateStatistics();
        this.checkUrgentNotifications();
    }

    updateAppointmentsList() {
        const appointmentsList = document.querySelector('#appointments-list');
        if (!appointmentsList) return;

        appointmentsList.innerHTML = '';
        
        this.appointments.forEach(appointment => {
            const appointmentCard = this.createAppointmentCard(appointment);
            appointmentsList.appendChild(appointmentCard);
        });
    }

    createAppointmentCard(appointment) {
        const card = document.createElement('div');
        card.className = 'appointment-card card-hover bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer fade-in';
        card.onclick = () => this.selectPatient(appointment.id, appointment.name, appointment);

        const statusColor = {
            'confirmed': 'success-green',
            'waiting': 'warning-orange',
            'available': 'gray-300'
        }[appointment.status];

        const statusText = {
            'confirmed': 'Terkonfirmasi',
            'waiting': 'Menunggu',
            'available': 'Tersedia'
        }[appointment.status];

        const paymentMethodBadge = {
            'BPJS': 'bg-blue-100 text-blue-800',
            'Asuransi Swasta': 'bg-green-100 text-green-800',
            'Umum': 'bg-gray-100 text-gray-800'
        }[appointment.paymentMethod] || 'bg-gray-100 text-gray-800';

        card.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                    <div class="w-3 h-3 bg-${statusColor} rounded-full status-dot status-${appointment.status}"></div>
                    <div>
                        <h3 class="font-semibold text-gray-800">${appointment.time} - ${appointment.name}</h3>
                        <p class="text-sm text-gray-600">${appointment.type} • ${appointment.age} tahun • ${appointment.gender}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="bg-${statusColor} text-white px-2 py-1 rounded text-xs font-medium">${statusText}</span>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </div>
            </div>
            <div class="flex items-center justify-between text-sm">
                <div class="flex items-center space-x-2">
                    <span class="${paymentMethodBadge} px-2 py-1 rounded text-xs font-medium">${appointment.paymentMethod}</span>
                    <span class="text-gray-500">ID: ${appointment.id}</span>
                </div>
                <span class="text-gray-500">${appointment.condition}</span>
            </div>
        `;

        return card;
    }

    selectPatient(patientId, patientName, appointmentData = null) {
        this.currentPatient = {
            id: patientId,
            name: patientName,
            data: appointmentData
        };

        // Update UI
        document.getElementById('patient-name').textContent = patientName;
        document.getElementById('patient-info').textContent = `ID: ${patientId} • Konsultasi dimulai ${new Date().toLocaleTimeString('id-ID')}`;
        
        // Load patient medical history
        this.loadPatientHistory(patientId);

        // Transition to consultation view
        this.showConsultationView();
        
        // Log activity for audit trail
        this.logActivity(`Started consultation for patient ${patientName} (${patientId})`);
    }

    loadPatientHistory(patientId) {
        // Simulate loading patient history from database
        const mockHistory = [
            {
                date: '2025-08-15',
                diagnosis: 'Diabetes Mellitus Type 2, Hipertensi',
                vitals: 'TD: 140/90, GD: 180 mg/dL',
                treatment: 'Metformin 500mg 2x1, Amlodipine 5mg 1x1'
            },
            {
                date: '2025-07-20',
                diagnosis: 'Kontrol rutin diabetes',
                vitals: 'TD: 130/85, HbA1c: 7.2%',
                treatment: 'Lanjut obat, diet rendah gula'
            }
        ];

        this.updateMedicalHistoryUI(mockHistory);
    }

    updateMedicalHistoryUI(history) {
        const historyContainer = document.querySelector('.medical-timeline');
        if (!historyContainer) return;

        historyContainer.innerHTML = '';
        
        history.forEach((record, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'timeline-item flex items-start space-x-3';
            
            const dotColor = index === 0 ? 'medical-blue' : 'success-green';
            const bgColor = index === 0 ? 'blue-50' : 'green-50';
            
            historyItem.innerHTML = `
                <div class="timeline-dot w-3 h-3 bg-${dotColor} rounded-full mt-2"></div>
                <div class="flex-1">
                    <div class="bg-${bgColor} p-3 rounded-lg">
                        <p class="font-semibold text-sm text-gray-800">${this.formatDate(record.date)}</p>
                        <p class="text-sm text-gray-700 mt-1">${record.diagnosis}</p>
                        <p class="text-xs text-gray-600 mt-2 medical-data">${record.vitals}</p>
                        ${record.treatment ? `<p class="text-xs text-gray-600 mt-1">${record.treatment}</p>` : ''}
                    </div>
                </div>
            `;
            
            historyContainer.appendChild(historyItem);
        });
    }

    showConsultationView() {
        document.getElementById('dashboard-view').classList.add('hidden');
        document.getElementById('consultation-view').classList.remove('hidden');
        document.getElementById('consultation-view').classList.add('slide-in');
        
        // Focus on diagnosis input for immediate use
        setTimeout(() => {
            const diagnosisInput = document.getElementById('diagnosis-input');
            if (diagnosisInput) diagnosisInput.focus();
        }, 300);
    }

    backToDashboard() {
        // Prompt to save if there are unsaved changes
        if (this.hasUnsavedChanges()) {
            if (!confirm('Ada perubahan yang belum disimpan. Yakin ingin kembali?')) {
                return;
            }
        }

        document.getElementById('consultation-view').classList.add('hidden');
        document.getElementById('dashboard-view').classList.remove('hidden');
        
        this.currentPatient = null;
        this.selectedPathway = null;
        this.clearConsultationForm();
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.showNotification('Voice recognition tidak tersedia pada browser ini', 'warning');
            return;
        }

        if (!this.isVoiceRecording) {
            this.recognition.start();
        } else {
            this.recognition.stop();
        }
    }

    handleVoiceResult(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            }
        }

        if (transcript) {
            const diagnosisInput = document.getElementById('diagnosis-input');
            if (diagnosisInput) {
                diagnosisInput.value = transcript;
                this.saveConsultationData();
            }
        }
    }

    handleVoiceError(event) {
        console.error('Voice recognition error:', event.error);
        this.showNotification('Error dalam voice recognition: ' + event.error, 'error');
    }

    showVoiceRecordingState(recording) {
        this.isVoiceRecording = recording;
        const voiceBtn = document.getElementById('voice-btn');
        const voiceStatus = document.getElementById('voice-status');
        
        if (recording) {
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            voiceBtn.classList.add('voice-pulse', 'bg-error-red');
            voiceBtn.classList.remove('bg-medical-blue');
            voiceStatus?.classList.remove('hidden');
        } else {
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            voiceBtn.classList.remove('voice-pulse', 'bg-error-red');
            voiceBtn.classList.add('bg-medical-blue');
            voiceStatus?.classList.add('hidden');
        }
    }

    selectPathway(pathwayType) {
        // Remove previous selection
        document.querySelectorAll('.pathway-option').forEach(option => {
            option.classList.remove('selected', 'border-medical-blue', 'bg-blue-50');
            const icon = option.querySelector('i');
            if (icon) {
                icon.classList.remove('text-medical-blue');
                icon.classList.add('text-gray-400');
            }
        });

        // Select new pathway
        const selectedOption = event.target.closest('.pathway-option');
        selectedOption.classList.add('selected', 'border-medical-blue', 'bg-blue-50');
        const icon = selectedOption.querySelector('i');
        if (icon) {
            icon.classList.remove('text-gray-400');
            icon.classList.add('text-medical-blue');
        }

        this.selectedPathway = pathwayType;
        this.saveConsultationData();
        
        // Show pathway-specific recommendations
        this.showPathwayRecommendations(pathwayType);
    }

    showPathwayRecommendations(pathwayType) {
        const recommendations = {
            'bpjs': 'Obat generik tersedia, lab dasar covered',
            'private': 'Full coverage, semua opsi treatment',
            'insurance': 'Extended coverage dengan pre-authorization'
        };

        this.showNotification(recommendations[pathwayType] || '', 'info');
    }

    saveConsultationData() {
        if (!this.currentPatient) return;

        const consultationData = {
            patientId: this.currentPatient.id,
            timestamp: new Date().toISOString(),
            diagnosis: document.getElementById('diagnosis-input')?.value || '',
            treatmentNotes: document.querySelector('#treatment-notes')?.value || '',
            pathway: this.selectedPathway,
            vitals: this.getCurrentVitals()
        };

        // Simulate saving to local storage (in production, this would be an API call)
        localStorage.setItem(`consultation_${this.currentPatient.id}_${Date.now()}`, JSON.stringify(consultationData));
        
        console.log('Auto-saved consultation data:', consultationData);
    }

    getCurrentVitals() {
        // In a real app, this would collect vital signs from connected devices
        return {
            bloodPressure: null,
            heartRate: null,
            temperature: null,
            weight: null
        };
    }

    hasUnsavedChanges() {
        const diagnosis = document.getElementById('diagnosis-input')?.value || '';
        const treatment = document.querySelector('#treatment-notes')?.value || '';
        return diagnosis.length > 0 || treatment.length > 0 || this.selectedPathway;
    }

    clearConsultationForm() {
        const diagnosisInput = document.getElementById('diagnosis-input');
        const treatmentNotes = document.querySelector('#treatment-notes');
        
        if (diagnosisInput) diagnosisInput.value = '';
        if (treatmentNotes) treatmentNotes.value = '';
        
        // Clear pathway selection
        document.querySelectorAll('.pathway-option').forEach(option => {
            option.classList.remove('selected', 'border-medical-blue', 'bg-blue-50');
        });
    }

    updateStatistics() {
        // Update dashboard statistics
        const stats = this.calculateDailyStats();
        
        const completedElement = document.querySelector('.stats-completed');
        const avgTimeElement = document.querySelector('.stats-avg-time');
        
        if (completedElement) completedElement.textContent = `${stats.completed}/${stats.total}`;
        if (avgTimeElement) avgTimeElement.textContent = `${stats.avgTime} min`;
    }

    calculateDailyStats() {
        const completed = this.appointments.filter(apt => apt.status === 'confirmed').length;
        const total = this.appointments.length;
        const avgTime = 25; // Mock average consultation time
        
        return { completed, total, avgTime };
    }

    checkCriticalAlerts() {
        // Simulate checking for critical lab results or urgent patient conditions
        const criticalAlerts = [
            {
                type: 'lab_critical',
                patient: 'Budi S.',
                message: 'Lab result critical value perlu review segera',
                urgency: 'high'
            }
        ];

        criticalAlerts.forEach(alert => {
            this.showNotification(alert.message, 'error', alert.urgency === 'high');
        });
    }

    scheduleLabResultsCheck() {
        // In real app, this would integrate with lab systems
        setTimeout(() => {
            this.showNotification('Lab results ready for 3 patients', 'info');
        }, 120000); // Check after 2 minutes
    }

    showNotification(message, type = 'info', persistent = false) {
        const notification = document.createElement('div');
        notification.className = `notification bg-white border-l-4 p-4 shadow-lg rounded-lg ${type === 'error' ? 'border-error-red' : type === 'warning' ? 'border-warning-orange' : type === 'success' ? 'border-success-green' : 'border-medical-blue'}`;
        
        notification.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex">
                    <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : type === 'warning' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} mt-1 mr-3 ${type === 'error' ? 'text-error-red' : type === 'warning' ? 'text-warning-orange' : type === 'success' ? 'text-success-green' : 'text-medical-blue'}"></i>
                    <p class="text-sm text-gray-700">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        if (!persistent) {
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
    }

    // ICD-10 Autocomplete functionality
    setupDiagnosisAutocomplete() {
        const diagnosisInput = document.getElementById('diagnosis-input');
        if (!diagnosisInput) return;

        // Create autocomplete container
        const autocompleteContainer = document.createElement('div');
        autocompleteContainer.id = 'diagnosis-autocomplete';
        autocompleteContainer.className = 'absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto hidden';
        diagnosisInput.parentNode.style.position = 'relative';
        diagnosisInput.parentNode.appendChild(autocompleteContainer);

        diagnosisInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) {
                autocompleteContainer.classList.add('hidden');
                return;
            }

            const matches = ICD10_DATABASE.filter(item => 
                item.code.toLowerCase().includes(query) || 
                item.name.toLowerCase().includes(query)
            ).slice(0, 10);

            if (matches.length > 0) {
                this.displayAutocompleteResults(matches, autocompleteContainer, diagnosisInput);
            } else {
                autocompleteContainer.classList.add('hidden');
            }
        });

        diagnosisInput.addEventListener('blur', () => {
            setTimeout(() => autocompleteContainer.classList.add('hidden'), 150);
        });
    }

    displayAutocompleteResults(matches, container, input) {
        container.innerHTML = '';
        container.classList.remove('hidden');

        matches.forEach(match => {
            const item = document.createElement('div');
            item.className = 'p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200';
            item.innerHTML = `
                <div class="font-semibold text-medical-blue">${match.code}</div>
                <div class="text-sm text-gray-700">${match.name}</div>
            `;

            item.addEventListener('click', () => {
                input.value = `${match.code} - ${match.name}`;
                container.classList.add('hidden');
                
                // Auto-update clinical pathway based on selected diagnosis
                this.updateClinicalPathwayOptions(match.code);
                
                // Trigger change event for other listeners
                input.dispatchEvent(new Event('change'));
            });

            container.appendChild(item);
        });
    }

    // Update clinical pathway based on payment method and diagnosis
    updateClinicalPathwayOptions(diagnosisCode) {
        if (!this.currentPatient) return;

        const paymentMethod = PATIENTS_DATABASE[this.currentPatient].paymentMethod;
        const pathwayContainer = document.querySelector('#clinical-pathways');
        
        if (!pathwayContainer) return;

        // Clear existing options
        pathwayContainer.innerHTML = '<h4 class="font-semibold mb-3 text-gray-800">Clinical Pathway:</h4>';

        // Get available pathways for this payment method and diagnosis
        const availablePathways = CLINICAL_PATHWAYS[paymentMethod];
        
        if (!availablePathways || !availablePathways[diagnosisCode]) {
            pathwayContainer.innerHTML += `
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p class="text-yellow-800">Tidak ada clinical pathway khusus untuk diagnosis ini dengan metode pembayaran ${paymentMethod}</p>
                    <p class="text-sm text-yellow-600 mt-2">Gunakan standard care pathway</p>
                </div>
            `;
            return;
        }

        const pathway = availablePathways[diagnosisCode];
        
        // Display the recommended pathway
        const pathwayCard = document.createElement('div');
        pathwayCard.className = 'bg-medical-blue-50 border-2 border-medical-blue-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md';
        pathwayCard.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <h5 class="font-bold text-medical-blue">${pathway.name}</h5>
                <span class="bg-medical-blue text-white px-2 py-1 rounded text-xs">Direkomendasikan</span>
            </div>
            <div class="space-y-2">
                <div>
                    <span class="font-semibold text-sm">Layanan:</span>
                    <ul class="list-disc list-inside text-sm text-gray-700 ml-4">
                        ${pathway.services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                </div>
                ${pathway.restrictions ? `
                <div>
                    <span class="font-semibold text-sm text-orange-600">Pembatasan:</span>
                    <ul class="list-disc list-inside text-sm text-orange-600 ml-4">
                        ${pathway.restrictions.map(restriction => `<li>${restriction}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                <div class="text-sm">
                    <span class="font-semibold">Follow-up:</span> ${pathway.followUp}
                </div>
            </div>
            <input type="radio" name="clinical-pathway" value="${diagnosisCode}" class="mt-3" checked>
        `;

        pathwayCard.addEventListener('click', () => {
            this.selectedPathway = pathway;
            pathwayCard.querySelector('input[type="radio"]').checked = true;
        });

        pathwayContainer.appendChild(pathwayCard);
        
        // Auto-select this pathway
        this.selectedPathway = pathway;
    }

    // Enhanced patient selection with more detailed info
    selectPatient(patientId, patientName) {
        const patientData = PATIENTS_DATABASE[patientId];
        if (!patientData) {
            this.showNotification('Data pasien tidak ditemukan', 'error');
            return;
        }

        this.currentPatient = patientId;
        
        // Update patient info display with enhanced data
        this.updatePatientInfoDisplay(patientData);
        
        // Load patient history
        this.loadEnhancedPatientHistory(patientId);
        
        // Setup diagnosis autocomplete
        setTimeout(() => this.setupDiagnosisAutocomplete(), 100);
        
        // Transition to consultation view
        this.showConsultationView();
        
        // Log activity
        this.logActivity(`Started consultation for patient ${patientName} (${patientId})`);
    }

    updatePatientInfoDisplay(patientData) {
        // Update patient header
        const patientHeader = document.querySelector('#patient-info');
        if (patientHeader) {
            patientHeader.innerHTML = `
                <div class="bg-white p-4 rounded-lg border border-gray-200">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">${patientData.name}</h3>
                            <p class="text-gray-600">ID: ${patientData.id}</p>
                        </div>
                        <div class="text-right">
                            <span class="bg-medical-blue text-white px-3 py-1 rounded-full text-sm">${patientData.paymentMethod}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span class="font-semibold text-gray-600">Usia:</span>
                            <p class="text-gray-800">${patientData.age} tahun</p>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-600">Tanggal Lahir:</span>
                            <p class="text-gray-800">${this.formatDate(patientData.birthDate)}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-600">Jenis Kelamin:</span>
                            <p class="text-gray-800">${patientData.gender}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-600">Telepon:</span>
                            <p class="text-gray-800">${patientData.phone}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <span class="font-semibold text-gray-600">Alamat:</span>
                        <p class="text-gray-800 text-sm">${patientData.address}</p>
                    </div>
                    <div class="mt-3">
                        <span class="font-semibold text-gray-600">Alergi:</span>
                        <p class="text-gray-800 text-sm">${patientData.allergies.join(', ')}</p>
                    </div>
                </div>
            `;
        }
    }

    loadEnhancedPatientHistory(patientId) {
        const patientData = PATIENTS_DATABASE[patientId];
        if (!patientData || !patientData.medicalHistory) return;

        this.updateMedicalHistoryUI(patientData.medicalHistory);
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        if (!this.touchStartX || !this.touchStartY) return;

        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;

        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;

        // Implement swipe gestures for navigation
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0 && this.currentPatient) {
                // Swipe right to go back to dashboard
                this.backToDashboard();
            }
        }
    }

    handleTouchEnd(e) {
        this.touchStartX = null;
        this.touchStartY = null;
    }

    handleKeyboardShortcuts(e) {
        // Keyboard shortcuts for accessibility and power users
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    this.saveConsultationData();
                    break;
                case 'r':
                    e.preventDefault();
                    this.toggleVoiceInput();
                    break;
                case 'Escape':
                    if (this.currentPatient) {
                        this.backToDashboard();
                    }
                    break;
            }
        }
    }

    handleResize() {
        // Adjust layout based on screen size changes
        this.adjustLayoutForScreenSize();
    }

    handleOrientationChange() {
        setTimeout(() => {
            this.adjustLayoutForScreenSize();
        }, 100);
    }

    adjustLayoutForScreenSize() {
        const isPortrait = window.innerHeight > window.innerWidth;
        document.body.classList.toggle('portrait-mode', isPortrait);
        
        if (isPortrait) {
            // Adjust for portrait tablet mode
            document.querySelectorAll('.split-screen').forEach(el => {
                el.classList.add('portrait-stack');
            });
        }
    }

    handleFormInput(e) {
        // Real-time form validation and auto-save triggers
        if (e.target.matches('#diagnosis-input') || e.target.matches('#treatment-notes')) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                this.saveConsultationData();
            }, 2000);
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    logActivity(activity) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            doctor: 'Dr. Ahmad Santoso',
            activity: activity,
            patient: this.currentPatient?.id || null
        };
        
        console.log('Activity logged:', logEntry);
        // In production, this would be sent to audit system
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DashboardDokter();
});

// Global functions for HTML event handlers (maintaining backward compatibility)
function selectPatient(patientId, patientName, appointmentData) {
    if (window.app) {
        window.app.selectPatient(patientId, patientName, appointmentData);
    }
}

function backToDashboard() {
    if (window.app) {
        window.app.backToDashboard();
    }
}

function toggleVoiceInput() {
    if (window.app) {
        window.app.toggleVoiceInput();
    }
}

function selectPathway(pathwayType) {
    if (window.app) {
        window.app.selectPathway(pathwayType);
    }
}