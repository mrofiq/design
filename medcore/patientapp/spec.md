# Patient Appointment Booking Mobile Web App Specification

## 1. Executive Summary

### 1.1 Project Overview
A Flutter-based progressive web application (PWA) enabling patients to book medical appointments, manage their care journey, and complete payments online. The app provides an intuitive interface for finding doctors, viewing their availability, booking appointments, and tracking the entire outpatient journey.

### 1.2 Key Features
- Doctor discovery and schedule viewing
- Visual calendar-based appointment booking
- Multi-channel authentication (Google, Facebook, Phone)
- Personalized care plan dashboard
- Real-time patient journey tracking
- Integrated payment processing

### 1.3 Technology Stack
- **Frontend Framework:** Flutter Web (v3.x+)
- **State Management:** Riverpod 2.0+
- **Authentication:** Firebase Auth
- **Backend:** RESTful API / GraphQL
- **Payment Gateway:** Multiple payment providers integration
- **Deployment:** PWA-enabled, responsive web application
- **Internationalization:** Flutter Intl with ARB files
- **Animation Framework:** Flutter Animate + Rive for complex animations

## 2. Functional Requirements

### 2.1 Doctor Discovery Module

#### 2.1.1 Search & Filter
- **Search Functionality**
  - Search by doctor name
  - Search by specialization
  - Search by location/clinic
  - Auto-complete suggestions
  
- **Filter Options**
  - Specialization categories
  - Location radius
  - Language spoken
  - Insurance accepted
  - Rating threshold
  - Consultation fees range
  - Available today/this week toggle

#### 2.1.2 Doctor Profile Display
- Doctor photograph
- Full name and credentials
- Specializations and sub-specialties
- Years of experience
- Languages spoken
- Clinic/hospital affiliations
- Patient ratings and reviews count
- Consultation fees
- Insurance partners accepted

### 2.2 Schedule Viewing Module

#### 2.2.1 Weekly Schedule Display
- **Layout Requirements**
  - 7-day horizontal scrollable view
  - Current week displayed by default
  - Navigation arrows for previous/next weeks
  - Today indicator highlight
  
- **Time Slot Information**
  - Morning/Afternoon/Evening session divisions
  - Start and end times for each session
  - Break times clearly marked
  - Available slot count per session
  - Duration per consultation slot

#### 2.2.2 Calendar Integration
- **Visual Indicators**
  - Green markers for available dates
  - Red/Gray for unavailable dates
  - Yellow for limited availability
  - Special indicators for holidays
  
- **Calendar Features**
  - Month view with date selection
  - Swipe gestures for month navigation
  - Quick jump to current date
  - Maximum booking window (e.g., 30 days advance)

### 2.3 Appointment Booking Module

#### 2.3.1 Time Slot Selection
- **Multiple Time Range Handling**
  - Display all available time ranges
  - Show slot duration (15/30/45/60 minutes)
  - Available slots counter per range
  - Visual separation between ranges
  
- **Slot Selection UI**
  - Grid or list view toggle
  - Disabled state for booked slots
  - Selected slot highlight
  - Confirmation before proceeding

#### 2.3.2 Booking Information
- **Pre-booking Details**
  - Reason for visit (dropdown/text)
  - Symptoms checklist
  - First visit or follow-up selection
  - Previous medical records upload option
  - Special requirements field

### 2.4 Authentication Module

#### 2.4.1 Login Methods
- **Google Sign-In**
  - OAuth 2.0 implementation
  - Profile picture and name retrieval
  - Email verification status
  
- **Facebook Login**
  - Facebook SDK integration
  - Basic profile information access
  - Email permission request
  
- **Phone Number Authentication**
  - Country code selector
  - OTP generation and validation
  - SMS delivery with retry mechanism
  - Auto-read OTP capability

#### 2.4.2 User Registration
- **Required Information**
  - Full name
  - Date of birth
  - Gender
  - Contact number
  - Email address
  - Emergency contact
  
- **Optional Information**
  - Blood group
  - Allergies
  - Chronic conditions
  - Current medications

### 2.4 Authentication Module

#### 2.4.1 Login Methods
- **Google Sign-In**
  - OAuth 2.0 implementation
  - Profile picture and name retrieval
  - Email verification status
  
- **Facebook Login**
  - Facebook SDK integration
  - Basic profile information access
  - Email permission request
  
- **Phone Number Authentication**
  - Country code selector
  - OTP generation and validation
  - SMS delivery with retry mechanism
  - Auto-read OTP capability

#### 2.4.2 User Registration
- **Required Information**
  - Full name
  - Date of birth
  - Gender
  - Contact number
  - Email address
  - Emergency contact
  
- **Optional Information**
  - Blood group
  - Allergies
  - Chronic conditions
  - Current medications

### 2.5 Multilingual Support Module

#### 2.5.1 Language Toggle Feature
- **Language Options**
  - Bahasa Indonesia (default)
  - English
  - Language preference saved to user profile
  - Auto-detection based on device locale
  
- **Toggle UI Implementation**
  - Floating language switcher button
  - Smooth flip animation (0.6s duration)
  - Flag icons with language codes (ID/EN)
  - Confirmation dialog for language change
  - Instant UI refresh without page reload

#### 2.5.2 Content Localization
- **Localized Elements**
  - All UI text and labels
  - Date and time formats
  - Currency formatting (IDR)
  - Phone number formats
  - Error messages
  - Push notifications
  - Email templates
  
- **Dynamic Content Translation**
  - Doctor profiles (bilingual storage)
  - Medical specializations
  - Appointment statuses
  - Payment instructions
  - Terms and conditions

#### 2.5.3 Implementation Strategy
```dart
// Riverpod provider for language management
final languageProvider = StateNotifierProvider<LanguageNotifier, Locale>((ref) {
  return LanguageNotifier();
});

// Language switching with animation
AnimatedSwitcher(
  duration: Duration(milliseconds: 600),
  transitionBuilder: (child, animation) {
    return RotationTransition(
      turns: animation,
      child: child,
    );
  },
  child: LanguageToggle(),
)
```

### 2.6 Care Plan Dashboard

#### 2.5.1 Single Page Layout
- **Header Section**
  - Patient name and profile picture
  - Medical ID number
  - Quick actions toolbar
  
- **Upcoming Appointment Card**
  - Doctor name and photo
  - Appointment date and time
  - Clinic location with map link
  - Countdown timer
  - Reschedule/Cancel buttons
  - Add to calendar option
  
- **Appointment Preparation**
  - Required documents checklist
  - Pre-appointment instructions
  - Medication to stop/continue
  - Fasting requirements if any

### 2.6 Patient Journey Tracking

#### 2.6.1 Real-time Status Updates
- **Journey Stages**
  - Appointment confirmed
  - Check-in reminder (2 hours before)
  - Arrived at clinic
  - With nurse/vitals check
  - Waiting for doctor
  - Consultation in progress
  - Consultation completed
  - At pharmacy
  - Payment pending
  - Visit completed

#### 2.6.2 Information Updates
- **During Consultation**
  - Estimated wait time
  - Queue position
  - Doctor running late notifications
  
- **Post Consultation**
  - Diagnosis summary
  - Prescribed medications
  - Lab tests ordered
  - Follow-up appointment needed
  - Doctor's notes and instructions

### 2.7 Payment Module

#### 2.7.1 Payment Methods
- **Debit Card**
  - Card number input with validation
  - CVV and expiry date
  - 3D Secure authentication
  - Save card for future option
  
- **QRIS (Quick Response Indonesian Standard)**
  - Dynamic QR code generation
  - Payment confirmation polling
  - Timeout handling (5-10 minutes)
  - Multiple QRIS provider support
  
- **Virtual Account**
  - Bank selection dropdown
  - Virtual account number generation
  - Copy to clipboard functionality
  - Payment instruction display
  - Auto-verification upon payment

#### 2.7.2 Payment Flow
- **Billing Summary**
  - Consultation fees
  - Additional procedures
  - Medication costs
  - Lab test charges
  - Total amount with breakdown
  - Insurance coverage (if applicable)
  - Final payable amount

## 3. Non-Functional Requirements

### 3.1 Performance
- Page load time < 3 seconds on 4G
- Smooth scrolling and animations (60 fps)
- Offline capability for viewed data
- Image lazy loading
- API response caching

### 3.2 Security
- HTTPS enforcement
- JWT token-based authentication
- Biometric authentication support
- PCI DSS compliance for payments
- Data encryption at rest and in transit
- Session timeout after 15 minutes inactivity

### 3.3 Usability
- Mobile-first responsive design
- Support for screen sizes 320px to 768px width
- Touch-optimized UI elements (44px minimum touch target)
- Accessibility compliance (WCAG 2.1 Level AA)
- Multi-language support (Bahasa Indonesia, English)
- RTL layout support ready
- Reduced motion support for accessibility
- High contrast mode compatibility

### 3.4 Animation Performance
- All animations at 60 FPS minimum
- GPU acceleration for transforms
- Will-change CSS property optimization
- RequestAnimationFrame for JavaScript animations
- Debounced scroll events
- Virtual scrolling for long lists
- Lazy rendering of off-screen content
- Animation budget: max 3 concurrent animations

### 3.4 Compatibility
- **Browsers**
  - Chrome 90+
  - Safari 14+
  - Firefox 88+
  - Samsung Internet 14+
  
- **Operating Systems**
  - iOS 13+
  - Android 8+
  
- **Screen Resolutions**
  - Minimum: 320x568
  - Maximum: 768x1024

## 4. Technical Architecture

### 4.1 Frontend Architecture
```
lib/
├── core/
│   ├── constants/
│   │   ├── app_colors.dart
│   │   ├── app_animations.dart
│   │   └── app_typography.dart
│   ├── themes/
│   │   ├── light_theme.dart
│   │   └── animations_theme.dart
│   ├── localization/
│   │   ├── l10n/
│   │   ├── app_localizations.dart
│   │   └── language_controller.dart
│   ├── utils/
│   └── widgets/
│       ├── animated/
│       └── common/
├── features/
│   ├── authentication/
│   ├── doctor_search/
│   ├── appointment_booking/
│   ├── care_plan/
│   ├── patient_journey/
│   └── payment/
├── models/
├── services/
├── providers/
│   ├── auth_provider.dart
│   ├── appointment_provider.dart
│   ├── language_provider.dart
│   └── theme_provider.dart
└── main.dart
```

### 4.2 State Management with Riverpod
```dart
// Global providers structure
final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authServiceProvider));
});

final appointmentProvider = FutureProvider.family<Appointment, String>((ref, id) async {
  final service = ref.read(appointmentServiceProvider);
  return service.getAppointment(id);
});

final doctorListProvider = StateNotifierProvider<DoctorListNotifier, AsyncValue<List<Doctor>>>((ref) {
  return DoctorListNotifier(ref);
});

// Language provider with persistence
final languageProvider = StateNotifierProvider<LanguageNotifier, Locale>((ref) {
  return LanguageNotifier(ref.read(sharedPreferencesProvider));
});
```

### 4.3 Animation Architecture
```dart
// Micro animation controllers
class AnimationControllers {
  // Page transitions
  static const pageSlideAnimation = Duration(milliseconds: 300);
  static const pageFadeAnimation = Duration(milliseconds: 250);
  
  // Micro interactions
  static const buttonTapScale = 0.95;
  static const cardHoverElevation = 8.0;
  static const listItemStagger = Duration(milliseconds: 50);
  
  // Loading animations
  static const shimmerAnimation = Duration(seconds: 1.5);
  static const pulseAnimation = Duration(seconds: 2);
}
```

### 4.3 API Integration
- **Endpoints Required**
  - GET /doctors
  - GET /doctors/{id}/schedule
  - POST /appointments
  - GET /appointments/{id}
  - PUT /appointments/{id}/status
  - POST /payments
  - GET /user/care-plan

### 4.4 Data Models with Riverpod Integration
```dart
// Freezed models for immutability
@freezed
class Doctor with _$Doctor {
  const factory Doctor({
    required String id,
    required String name,
    required Map<String, String> nameLocalized, // {"en": "Dr. Smith", "id": "Dr. Smith"}
    required String specialization,
    required Map<String, String> specializationLocalized,
    required List<TimeSlot> availableSlots,
    required double rating,
    required String imageUrl,
    required List<String> languages,
  }) = _Doctor;
  
  factory Doctor.fromJson(Map<String, dynamic> json) => _$DoctorFromJson(json);
}

@freezed
class Appointment with _$Appointment {
  const factory Appointment({
    required String id,
    required String patientId,
    required String doctorId,
    required DateTime scheduledTime,
    required AppointmentStatus status,
    Map<String, dynamic>? metadata,
  }) = _Appointment;
  
  factory Appointment.fromJson(Map<String, dynamic> json) => _$AppointmentFromJson(json);
}

// Riverpod Providers
final doctorRepositoryProvider = Provider<DoctorRepository>((ref) {
  return DoctorRepository(ref.read(dioProvider));
});

final doctorSearchProvider = StateNotifierProvider<DoctorSearchNotifier, AsyncValue<List<Doctor>>>((ref) {
  return DoctorSearchNotifier(ref.read(doctorRepositoryProvider));
});

final selectedDoctorProvider = StateProvider<Doctor?>((ref) => null);

final doctorScheduleProvider = FutureProvider.family<Schedule, String>((ref, doctorId) async {
  final repository = ref.read(doctorRepositoryProvider);
  return repository.getSchedule(doctorId);
});

// Appointment providers with real-time updates
final appointmentStreamProvider = StreamProvider.family<Appointment, String>((ref, appointmentId) {
  final service = ref.read(appointmentServiceProvider);
  return service.watchAppointment(appointmentId);
});

// Language-aware providers
final localizedDoctorNameProvider = Provider.family<String, Doctor>((ref, doctor) {
  final locale = ref.watch(languageProvider);
  return doctor.nameLocalized[locale.languageCode] ?? doctor.name;
});
```

### 4.5 Riverpod State Management Patterns
```dart
// Search state management with debouncing
class DoctorSearchNotifier extends StateNotifier<AsyncValue<List<Doctor>>> {
  final DoctorRepository _repository;
  Timer? _debounceTimer;
  
  DoctorSearchNotifier(this._repository) : super(const AsyncValue.loading());
  
  void search(String query, {Map<String, dynamic>? filters}) {
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 300), () async {
      state = const AsyncValue.loading();
      state = await AsyncValue.guard(() async {
        return await _repository.searchDoctors(query, filters: filters);
      });
    });
  }
}

// Language switching with persistence
class LanguageNotifier extends StateNotifier<Locale> {
  final SharedPreferences _prefs;
  
  LanguageNotifier(this._prefs) : super(_getInitialLocale(_prefs));
  
  static Locale _getInitialLocale(SharedPreferences prefs) {
    final langCode = prefs.getString('language_code') ?? 'id';
    return Locale(langCode);
  }
  
  Future<void> setLanguage(String languageCode) async {
    state = Locale(languageCode);
    await _prefs.setString('language_code', languageCode);
    
    // Trigger UI rebuild with animation
    await Future.delayed(Duration(milliseconds: 300));
  }
}

// Appointment booking flow management
final bookingFlowProvider = StateNotifierProvider<BookingFlowNotifier, BookingFlowState>((ref) {
  return BookingFlowNotifier(ref);
});

class BookingFlowNotifier extends StateNotifier<BookingFlowState> {
  final Ref ref;
  
  BookingFlowNotifier(this.ref) : super(BookingFlowState.initial());
  
  void selectDoctor(Doctor doctor) {
    state = state.copyWith(
      selectedDoctor: doctor,
      currentStep: BookingStep.selectTime,
    );
  }
  
  void selectTimeSlot(TimeSlot slot) {
    state = state.copyWith(
      selectedSlot: slot,
      currentStep: BookingStep.confirmDetails,
    );
  }
  
  Future<void> confirmBooking() async {
    state = state.copyWith(isLoading: true);
    
    try {
      final appointment = await ref.read(appointmentServiceProvider).createAppointment(
        doctorId: state.selectedDoctor!.id,
        timeSlot: state.selectedSlot!,
        patientNotes: state.notes,
      );
      
      state = state.copyWith(
        completedAppointment: appointment,
        currentStep: BookingStep.completed,
        isLoading: false,
      );
      
      // Navigate to care plan
      ref.read(routerProvider).go('/care-plan');
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }
}
```

## 5. UI/UX Specifications

### 5.1 Modern Design System

#### 5.1.1 Color Palette
```dart
// Primary Colors
static const primary = Color(0xFF0066FF);      // Bright blue
static const primaryLight = Color(0xFF4D94FF);  // Light blue
static const primaryDark = Color(0xFF0052CC);   // Dark blue

// Secondary Colors  
static const secondary = Color(0xFF00D4AA);     // Mint green
static const accent = Color(0xFFFF6B6B);        // Coral red

// Neutral Colors
static const background = Color(0xFFFAFBFC);    // Off-white
static const surface = Color(0xFFFFFFFF);       // Pure white
static const textPrimary = Color(0xFF1A1A2E);   // Deep navy
static const textSecondary = Color(0xFF6B7280); // Cool gray
static const divider = Color(0xFFE5E7EB);       // Light gray

// Semantic Colors
static const success = Color(0xFF10B981);       // Green
static const warning = Color(0xFFF59E0B);       // Amber
static const error = Color(0xFFEF4444);         // Red
static const info = Color(0xFF3B82F6);          // Blue
```

#### 5.1.2 Typography System
```dart
// Font Family: Inter (Primary), SF Pro Display (iOS), Roboto (Android fallback)

// Heading Styles
static const h1 = TextStyle(
  fontFamily: 'Inter',
  fontSize: 32,
  fontWeight: FontWeight.w200,  // Extra light
  letterSpacing: -0.5,
  height: 1.2,
);

static const h2 = TextStyle(
  fontFamily: 'Inter',
  fontSize: 24,
  fontWeight: FontWeight.w300,  // Light
  letterSpacing: -0.3,
  height: 1.3,
);

static const h3 = TextStyle(
  fontFamily: 'Inter',
  fontSize: 20,
  fontWeight: FontWeight.w400,  // Regular
  letterSpacing: 0,
  height: 1.4,
);

// Body Styles
static const bodyLarge = TextStyle(
  fontFamily: 'Inter',
  fontSize: 16,
  fontWeight: FontWeight.w300,  // Light
  letterSpacing: 0.15,
  height: 1.5,
);

static const bodyMedium = TextStyle(
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: FontWeight.w400,  // Regular
  letterSpacing: 0.25,
  height: 1.5,
);

// Caption & Labels
static const caption = TextStyle(
  fontFamily: 'Inter',
  fontSize: 12,
  fontWeight: FontWeight.w400,
  letterSpacing: 0.4,
  height: 1.4,
);

static const button = TextStyle(
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: FontWeight.w500,  // Medium
  letterSpacing: 0.75,
);
```

### 5.2 Enhanced UX Design Principles

#### 5.2.1 Visual Hierarchy
- **Whitespace Usage**
  - Minimum 16px padding on mobile screens
  - 24px spacing between major sections
  - 40px margins for breathing room
  - Consistent 8px grid system

- **Card Design**
  - Subtle shadows (0 2px 8px rgba(0,0,0,0.08))
  - 12px border radius for modern feel
  - Hover elevation increase to 12px
  - Glass morphism effects for overlays

#### 5.2.2 Interactive Elements
- **Touch Targets**
  - Minimum 48x48px for all interactive elements
  - 8px spacing between adjacent buttons
  - Visual feedback within 100ms
  - Ripple effects on all tappable areas

- **Form Design**
  - Floating labels with smooth transitions
  - Real-time validation with inline hints
  - Auto-advance between OTP fields
  - Smart input type detection

### 5.3 Micro Animations Specification

#### 5.3.1 Page Transitions
```dart
// Slide and fade page route
class SlidePageRoute extends PageRouteBuilder {
  SlidePageRoute({required this.page})
    : super(
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionDuration: Duration(milliseconds: 300),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          const begin = Offset(1.0, 0.0);
          const end = Offset.zero;
          const curve = Curves.easeOutCubic;
          
          var tween = Tween(begin: begin, end: end).chain(
            CurveTween(curve: curve),
          );
          
          var offsetAnimation = animation.drive(tween);
          var fadeAnimation = animation.drive(
            Tween(begin: 0.0, end: 1.0).chain(CurveTween(curve: curve)),
          );
          
          return SlideTransition(
            position: offsetAnimation,
            child: FadeTransition(
              opacity: fadeAnimation,
              child: child,
            ),
          );
        },
      );
}
```

#### 5.3.2 Component Animations
- **Button Interactions**
  ```dart
  // Tap animation with scale and color change
  AnimatedContainer(
    duration: Duration(milliseconds: 150),
    curve: Curves.easeInOut,
    transform: Matrix4.identity()..scale(isPressed ? 0.95 : 1.0),
    decoration: BoxDecoration(
      color: isPressed ? primaryDark : primary,
      borderRadius: BorderRadius.circular(8),
      boxShadow: [
        BoxShadow(
          color: primary.withOpacity(isPressed ? 0.3 : 0.2),
          blurRadius: isPressed ? 8 : 12,
          offset: Offset(0, isPressed ? 2 : 4),
        ),
      ],
    ),
  )
  ```

- **Card Hover Effects**
  ```dart
  // Elevation and slight scale on hover
  MouseRegion(
    onEnter: (_) => setState(() => isHovered = true),
    onExit: (_) => setState(() => isHovered = false),
    child: AnimatedContainer(
      duration: Duration(milliseconds: 200),
      curve: Curves.easeOutCubic,
      transform: Matrix4.identity()
        ..translate(0, isHovered ? -2 : 0)
        ..scale(isHovered ? 1.02 : 1.0),
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isHovered ? 0.15 : 0.08),
            blurRadius: isHovered ? 20 : 10,
            offset: Offset(0, isHovered ? 8 : 4),
          ),
        ],
      ),
    ),
  )
  ```

#### 5.3.3 Loading States
- **Skeleton Loading**
  ```dart
  Shimmer.fromColors(
    baseColor: Colors.grey[300]!,
    highlightColor: Colors.grey[100]!,
    period: Duration(seconds: 1.5),
    child: Container(
      height: 20,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(4),
      ),
    ),
  )
  ```

- **Pull to Refresh**
  ```dart
  // Custom refresh indicator with medical theme
  CustomRefreshIndicator(
    onRefresh: () => Future.delayed(Duration(seconds: 2)),
    builder: (context, child, controller) {
      return AnimatedBuilder(
        animation: controller,
        builder: (context, _) {
          return Stack(
            children: [
              Transform.scale(
                scale: 1.0 + (controller.value * 0.1),
                child: child,
              ),
              Positioned(
                top: 35.0 * controller.value,
                left: 0,
                right: 0,
                child: Icon(
                  Icons.medical_services,
                  color: primary.withOpacity(controller.value),
                  size: 30,
                ),
              ),
            ],
          );
        },
      );
    },
  )
  ```

#### 5.3.4 Calendar Animations
- **Date Selection**
  ```dart
  // Ripple effect from selected date
  AnimatedContainer(
    duration: Duration(milliseconds: 300),
    curve: Curves.easeOutCubic,
    decoration: BoxDecoration(
      shape: BoxShape.circle,
      color: isSelected ? primary : transparent,
      border: Border.all(
        color: isToday ? primary : transparent,
        width: 2,
      ),
    ),
    child: AnimatedDefaultTextStyle(
      duration: Duration(milliseconds: 200),
      style: TextStyle(
        color: isSelected ? Colors.white : textPrimary,
        fontWeight: isSelected ? FontWeight.w500 : FontWeight.w300,
      ),
      child: Text(day.toString()),
    ),
  )
  ```

- **Month Transition**
  ```dart
  // Smooth slide animation between months
  PageTransitionSwitcher(
    duration: Duration(milliseconds: 400),
    transitionBuilder: (child, primaryAnimation, secondaryAnimation) {
      return SharedAxisTransition(
        animation: primaryAnimation,
        secondaryAnimation: secondaryAnimation,
        transitionType: SharedAxisTransitionType.horizontal,
        child: child,
      );
    },
    child: MonthView(key: ValueKey(currentMonth)),
  )
  ```

#### 5.3.5 Status Journey Animation
- **Progress Indicator**
  ```dart
  // Animated step progress with pulse effect
  AnimatedContainer(
    duration: Duration(milliseconds: 500),
    curve: Curves.easeInOut,
    child: Row(
      children: steps.map((step) {
        bool isActive = currentStep >= step.index;
        bool isCurrent = currentStep == step.index;
        
        return Expanded(
          child: Stack(
            children: [
              // Progress line
              LinearProgressIndicator(
                value: isActive ? 1.0 : 0.0,
                backgroundColor: divider,
                valueColor: AlwaysStoppedAnimation(primary),
              ),
              // Step circle with pulse
              if (isCurrent)
                AnimatedBuilder(
                  animation: _pulseAnimation,
                  builder: (context, child) {
                    return Container(
                      width: 40 + (_pulseAnimation.value * 10),
                      height: 40 + (_pulseAnimation.value * 10),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: primary.withOpacity(1 - _pulseAnimation.value),
                      ),
                    );
                  },
                ),
            ],
          ),
        );
      }).toList(),
    ),
  )
  ```

### 5.4 Language Toggle Animation
```dart
// 3D flip animation for language switch
class LanguageToggle extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentLang = ref.watch(languageProvider);
    
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: currentLang == 'en' ? 1 : 0),
      duration: Duration(milliseconds: 600),
      curve: Curves.easeInOutBack,
      builder: (context, value, child) {
        final isShowingFront = value < 0.5;
        return Transform(
          alignment: Alignment.center,
          transform: Matrix4.identity()
            ..setEntry(3, 2, 0.001)
            ..rotateY(value * pi),
          child: Container(
            width: 60,
            height: 32,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isShowingFront 
                  ? [Color(0xFFFF0000), Color(0xFFFFFFFF)] // Indonesian flag colors
                  : [Color(0xFF012169), Color(0xFFFFFFFF)], // British flag hint
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 8,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Center(
              child: Text(
                isShowingFront ? 'ID' : 'EN',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
```

### 5.5 Accessibility & Performance

#### 5.5.1 Animation Performance
- All animations run at 60 FPS
- Use `RepaintBoundary` for complex animations
- Implement `AutomaticKeepAliveClientMixin` for list items
- Lazy loading with visibility detection
- Debounce search inputs (300ms)

#### 5.5.2 Accessibility Features
- Respect `prefers-reduced-motion` settings
- Semantic labels for all interactive elements
- Focus management for keyboard navigation
- High contrast mode support
- Screen reader optimized content

### 5.6 Component Library

#### 5.6.1 Custom Components
- Glass morphism cards
- Neumorphic buttons (subtle)
- Custom date picker with availability overlay
- Animated bottom sheets
- Floating action menu with stagger animation
- Custom tab bar with sliding indicator
- Parallax scrolling headers
- Liquid swipe onboarding

### 5.7 Responsive Design & Breakpoints

#### 5.7.1 Adaptive Layouts
```dart
class ResponsiveBuilder extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  
  const ResponsiveBuilder({
    required this.mobile,
    this.tablet,
  });
  
  static bool isMobile(BuildContext context) => MediaQuery.of(context).size.width < 600;
  static bool isTablet(BuildContext context) => MediaQuery.of(context).size.width >= 600;
  
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= 600 && tablet != null) {
          return tablet!;
        }
        return mobile;
      },
    );
  }
}
```

#### 5.7.2 Screen Size Adaptations
- **Small Mobile (320-375px)**
  - Single column layouts
  - Stacked cards
  - Full-width buttons
  - Compact navigation

- **Standard Mobile (376-425px)**
  - Standard spacing
  - Optimal font sizes
  - 2-column grids where appropriate

- **Large Mobile/Small Tablet (426-768px)**
  - Increased padding
  - Side-by-side elements
  - Floating action buttons
  - Enhanced animations

### 5.8 Gesture-Based Interactions

#### 5.8.1 Touch Gestures
- **Swipe Actions**
  - Horizontal swipe to cancel appointments
  - Vertical swipe for pull-to-refresh
  - Swipe between calendar months
  - Swipe to reveal quick actions

- **Pinch & Zoom**
  - Calendar view zoom
  - Medical document viewing
  - Map interactions

- **Long Press Actions**
  - Quick appointment booking
  - Copy payment details
  - Doctor information preview

#### 5.8.2 Haptic Feedback
```dart
// Contextual haptic feedback
class HapticManager {
  static void light() => HapticFeedback.lightImpact();
  static void medium() => HapticFeedback.mediumImpact();
  static void heavy() => HapticFeedback.heavyImpact();
  static void selection() => HapticFeedback.selectionClick();
  
  // Usage patterns
  static void onButtonTap() => light();
  static void onToggle() => selection();
  static void onSuccess() => medium();
  static void onError() => heavy();
}
```

### 6.1 Unit Testing
- Model serialization/deserialization
- Date/time calculations
- Payment amount calculations
- Form validations

### 6.2 Widget Testing
- Navigation flows
- Form submissions
- Authentication flows
- Calendar interactions

### 6.3 Integration Testing
- End-to-end booking flow
- Payment processing
- Journey status updates
- Multi-provider authentication

### 6.4 User Acceptance Testing
- Doctor search and filter
- Appointment booking process
- Payment completion
- Journey tracking accuracy

## 7. Deployment & Monitoring

### 7.1 Deployment Strategy
- Progressive Web App configuration
- Service worker implementation
- App manifest configuration
- SSL certificate setup
- CDN integration for assets

### 7.2 Analytics & Monitoring
- User behavior tracking
- Conversion funnel analysis
- Error logging and reporting
- Performance metrics monitoring
- Payment success rate tracking

## 8. Future Enhancements

### 8.1 Phase 2 Features
- Video consultation booking
- Medical record management
- Prescription history
- Lab report viewing
- Medicine delivery integration
- Health insurance claim filing

### 8.2 Phase 3 Features
- AI-powered symptom checker
- Doctor recommendation engine
- Appointment reminders via WhatsApp
- Family member management
- Health monitoring integration
- Loyalty program

## 9. Success Metrics

### 9.1 Key Performance Indicators
- Monthly active users
- Appointment booking conversion rate
- Average time to book appointment
- Payment success rate
- User retention rate
- App performance score
- Customer satisfaction score

### 9.2 Business Metrics
- Total appointments booked
- Revenue per user
- Doctor utilization rate
- Payment method distribution
- Peak usage times
- Geographic distribution

## 10. Risk Management

### 10.1 Technical Risks
- Payment gateway downtime
- SMS delivery failures
- Third-party authentication issues
- Database performance degradation
- API rate limiting

### 10.2 Mitigation Strategies
- Multiple payment gateway fallbacks
- SMS provider redundancy
- Offline mode capabilities
- Caching strategies
- Load balancing implementation

## 11. Compliance & Regulations

### 11.1 Healthcare Compliance
- HIPAA compliance guidelines
- Patient data privacy regulations
- Medical record retention policies
- Consent management

### 11.2 Payment Compliance
- PCI DSS standards
- Local payment regulations
- Tax compliance
- Refund policies

## 12. Documentation Requirements

### 12.1 Technical Documentation
- API documentation
- Database schema
- Deployment guides
- Security protocols

### 12.2 User Documentation
- User manual
- FAQ section
- Video tutorials
- Troubleshooting guide

## 13. Micro Animation Library

### 13.1 Core Animation Utilities
```dart
// Custom animation controller wrapper
class MicroAnimationController {
  late AnimationController controller;
  late Animation<double> animation;
  
  MicroAnimationController({
    required TickerProvider vsync,
    Duration duration = const Duration(milliseconds: 300),
    Curve curve = Curves.easeOutCubic,
  }) {
    controller = AnimationController(
      duration: duration,
      vsync: vsync,
    );
    
    animation = CurvedAnimation(
      parent: controller,
      curve: curve,
    );
  }
  
  void forward() => controller.forward();
  void reverse() => controller.reverse();
  void dispose() => controller.dispose();
}

// Stagger animation helper
class StaggerAnimation {
  static List<Animation<double>> create({
    required AnimationController controller,
    required int itemCount,
    Duration interval = const Duration(milliseconds: 50),
  }) {
    final List<Animation<double>> animations = [];
    final intervalValue = interval.inMilliseconds / controller.duration!.inMilliseconds;
    
    for (int i = 0; i < itemCount; i++) {
      final start = i * intervalValue;
      final end = start + 0.5;
      
      animations.add(
        Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(
            parent: controller,
            curve: Interval(start.clamp(0, 1), end.clamp(0, 1)),
          ),
        ),
      );
    }
    
    return animations;
  }
}
```

### 13.2 Predefined Animation Presets
```dart
class AnimationPresets {
  // Entrance animations
  static const fadeIn = Duration(milliseconds: 250);
  static const slideUp = Duration(milliseconds: 300);
  static const scaleIn = Duration(milliseconds: 200);
  
  // Interactive animations
  static const buttonTap = Duration(milliseconds: 150);
  static const cardHover = Duration(milliseconds: 200);
  static const toggleSwitch = Duration(milliseconds: 300);
  
  // Navigation animations
  static const pageTransition = Duration(milliseconds: 350);
  static const bottomSheetSlide = Duration(milliseconds: 300);
  static const tabSwitch = Duration(milliseconds: 400);
  
  // Loading animations
  static const shimmer = Duration(milliseconds: 1500);
  static const pulse = Duration(seconds: 2);
  static const spin = Duration(seconds: 1);
  
  // Curves
  static const smoothCurve = Curves.easeOutCubic;
  static const bouncyCurve = Curves.elasticOut;
  static const sharpCurve = Curves.easeOutExpo;
}
```

### 13.3 Complex Animation Components
```dart
// Animated success checkmark
class SuccessAnimation extends StatefulWidget {
  @override
  _SuccessAnimationState createState() => _SuccessAnimationState();
}

class _SuccessAnimationState extends State<SuccessAnimation> 
    with TickerProviderStateMixin {
  late AnimationController _circleController;
  late AnimationController _checkController;
  late Animation<double> _circleAnimation;
  late Animation<double> _checkAnimation;
  
  @override
  void initState() {
    super.initState();
    
    _circleController = AnimationController(
      duration: Duration(milliseconds: 500),
      vsync: this,
    );
    
    _checkController = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    
    _circleAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _circleController,
      curve: Curves.easeOutBack,
    ));
    
    _checkAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _checkController,
      curve: Curves.easeOutBack,
    ));
    
    _circleController.forward().then((_) {
      _checkController.forward();
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([_circleAnimation, _checkAnimation]),
      builder: (context, child) {
        return CustomPaint(
          size: Size(100, 100),
          painter: SuccessPainter(
            circleProgress: _circleAnimation.value,
            checkProgress: _checkAnimation.value,
          ),
        );
      },
    );
  }
}

// Liquid page transition
class LiquidPageRoute extends PageRouteBuilder {
  final Widget page;
  
  LiquidPageRoute({required this.page})
    : super(
        pageBuilder: (context, animation, secondaryAnimation) => page,
        transitionDuration: Duration(milliseconds: 600),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return Stack(
            children: [
              SlideTransition(
                position: Tween<Offset>(
                  begin: Offset(1.0, 0.0),
                  end: Offset.zero,
                ).animate(CurvedAnimation(
                  parent: animation,
                  curve: Curves.easeInOutQuart,
                )),
                child: child,
              ),
              AnimatedBuilder(
                animation: animation,
                builder: (context, _) {
                  return ClipPath(
                    clipper: LiquidClipper(animation.value),
                    child: Container(
                      color: Theme.of(context).primaryColor.withOpacity(0.1),
                    ),
                  );
                },
              ),
            ],
          );
        },
      );
}
```

### 13.4 Performance Monitoring
```dart
class AnimationPerformanceMonitor {
  static void trackFPS(AnimationController controller) {
    if (kDebugMode) {
      controller.addListener(() {
        final fps = 1000 / SchedulerBinding.instance.currentFrameTimeStamp.inMilliseconds;
        if (fps < 55) {
          debugPrint('⚠️ Low FPS detected: ${fps.toStringAsFixed(1)}');
        }
      });
    }
  }
  
  static Widget withPerformanceOverlay({required Widget child}) {
    return Stack(
      children: [
        child,
        if (kDebugMode)
          Positioned(
            top: 50,
            right: 10,
            child: PerformanceOverlay.allEnabled(),
          ),
      ],
    );
  }
}
```

---

## Appendix A: Wireframe References
- Home screen with doctor search
- Doctor profile and schedule view
- Calendar with availability markers
- Time slot selection screen
- Login/Registration screens
- Care plan dashboard
- Patient journey tracker
- Payment screens
- Language toggle component
- Micro animation demonstrations

## Appendix B: API Response Examples
```json
// Doctor Schedule Response with Localization
{
  "doctorId": "doc_123",
  "doctor": {
    "nameLocalized": {
      "en": "Dr. John Smith",
      "id": "Dr. John Smith"
    },
    "specializationLocalized": {
      "en": "Cardiologist",
      "id": "Dokter Jantung"
    }
  },
  "schedule": {
    "2025-09-23": {
      "slots": [
        {
          "startTime": "09:00",
          "endTime": "09:30",
          "available": true,
          "type": "consultation"
        }
      ]
    }
  }
}

// Appointment Status Update
{
  "appointmentId": "apt_456",
  "status": "consultation_in_progress",
  "statusLocalized": {
    "en": "In Consultation",
    "id": "Sedang Konsultasi"
  },
  "estimatedEndTime": "2025-09-23T10:30:00Z",
  "queuePosition": null
}
```

## Appendix C: Animation Timing Guidelines
| Animation Type | Duration | Curve | Use Case |
|---------------|----------|--------|----------|
| Page transition | 300ms | easeOutCubic | Navigation between screens |
| Card hover | 200ms | easeOut | Interactive feedback |
| Button press | 150ms | easeInOut | Touch feedback |
| Shimmer | 1500ms | linear | Loading state |
| Language toggle | 600ms | easeInOutBack | Language switching |
| List stagger | 50ms/item | easeOut | List item appearance |
| Pull refresh | 400ms | easeOutCubic | Content refresh |
| Modal slide | 250ms | easeOutExpo | Bottom sheet appearance |
| Calendar month | 400ms | easeInOut | Month navigation |
| Status pulse | 2000ms | easeInOut | Current status indicator |

## Appendix D: Gesture Interactions
```dart
// Swipe to delete appointment
Dismissible(
  key: Key(appointment.id),
  direction: DismissDirection.endToStart,
  confirmDismiss: (direction) async {
    return await showDialog(
      context: context,
      builder: (context) => CancelConfirmationDialog(),
    );
  },
  background: Container(
    color: error,
    alignment: Alignment.centerRight,
    padding: EdgeInsets.only(right: 20),
    child: Icon(Icons.delete, color: Colors.white),
  ),
  child: AppointmentCard(appointment),
)

// Long press for quick actions
GestureDetector(
  onLongPress: () {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      builder: (context) => QuickActionsSheet(doctor),
    );
  },
  child: DoctorCard(doctor),
)

// Pinch to zoom calendar
InteractiveViewer(
  minScale: 0.8,
  maxScale: 2.0,
  child: CalendarView(),
)
```

## Appendix E: Localization Keys Sample
```yaml
# l10n/app_en.arb
{
  "@@locale": "en",
  "welcomeMessage": "Welcome back!",
  "findDoctor": "Find a Doctor",
  "bookAppointment": "Book Appointment",
  "selectTimeSlot": "Select Time Slot",
  "confirmBooking": "Confirm Booking",
  "paymentMethod": "Payment Method",
  "appointmentConfirmed": "Appointment Confirmed",
  "yourJourney": "Your Journey",
  "switchToIndonesian": "Switch to Indonesian"
}

# l10n/app_id.arb
{
  "@@locale": "id",
  "welcomeMessage": "Selamat datang kembali!",
  "findDoctor": "Cari Dokter",
  "bookAppointment": "Buat Janji",
  "selectTimeSlot": "Pilih Waktu",
  "confirmBooking": "Konfirmasi Pemesanan",
  "paymentMethod": "Metode Pembayaran",
  "appointmentConfirmed": "Janji Temu Dikonfirmasi",
  "yourJourney": "Perjalanan Anda",
  "switchToEnglish": "Beralih ke Inggris"
}
```

## Appendix F: Error Handling Matrix
| Error Type | User Message (EN) | User Message (ID) | Recovery Action |
|------------|------------------|-------------------|-----------------|
| Network Error | "Connection lost. Please check your internet." | "Koneksi terputus. Periksa internet Anda." | Retry with exponential backoff |
| Payment Failed | "Payment could not be processed. Please try again." | "Pembayaran tidak dapat diproses. Silakan coba lagi." | Show alternative payment methods |
| Slot Unavailable | "This slot was just booked. Please select another." | "Slot ini baru saja dipesan. Pilih yang lain." | Refresh available slots |
| Authentication Failed | "Login failed. Please try again." | "Login gagal. Silakan coba lagi." | Clear cache and re-authenticate |
| Session Timeout | "Your session has expired. Please login again." | "Sesi Anda telah berakhir. Silakan login kembali." | Navigate to login with return URL |
| Invalid OTP | "Incorrect code. Please try again." | "Kode salah. Silakan coba lagi." | Clear input and focus field |