# Patient Appointment Booking - UI/UX Implementation Guide

> Complete guide for implementing the Flutter Web PWA based on MVP specifications

---

## 1. Design System Specifications

### 1.1 Color Palette

```dart
class AppColors {
  // Primary Colors
  static const Color primary = Color(0xFF0066FF);
  static const Color primaryLight = Color(0xFF4D94FF);
  static const Color primaryDark = Color(0xFF0052CC);

  // Semantic Colors
  static const Color success = Color(0xFF10B981);
  static const Color successLight = Color(0xFF34D399);
  static const Color error = Color(0xFFEF4444);
  static const Color errorLight = Color(0xFFFCA5A5);
  static const Color warning = Color(0xFFF59E0B);

  // Neutral Colors
  static const Color neutral900 = Color(0xFF111827);
  static const Color neutral800 = Color(0xFF1F2937);
  static const Color neutral700 = Color(0xFF374151);
  static const Color neutral600 = Color(0xFF4B5563);
  static const Color neutral500 = Color(0xFF6B7280);
  static const Color neutral400 = Color(0xFF9CA3AF);
  static const Color neutral300 = Color(0xFFD1D5DB);
  static const Color neutral200 = Color(0xFFE5E7EB);
  static const Color neutral100 = Color(0xFFF3F4F6);
  static const Color neutral50 = Color(0xFFF9FAFB);

  // Background Colors
  static const Color background = Color(0xFFFFFFFF);
  static const Color surface = Color(0xFFF9FAFB);
  static const Color surfaceElevated = Color(0xFFFFFFFF);
}
```

### 1.2 Typography System

```dart
class AppTextStyles {
  static const String fontFamily = 'Inter';

  // Headlines
  static const TextStyle h1 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 32,
    fontWeight: FontWeight.w700,
    height: 1.25,
    letterSpacing: -0.02,
  );

  static const TextStyle h2 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 1.33,
    letterSpacing: -0.01,
  );

  static const TextStyle h3 = TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );

  // Body Text
  static const TextStyle bodyLarge = TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.5,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.43,
  );

  static const TextStyle bodySmall = TextStyle(
    fontFamily: fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.33,
  );

  // Labels & Captions
  static const TextStyle labelLarge = TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.43,
  );

  static const TextStyle labelMedium = TextStyle(
    fontFamily: fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.33,
  );

  static const TextStyle caption = TextStyle(
    fontFamily: fontFamily,
    fontSize: 11,
    fontWeight: FontWeight.w400,
    height: 1.27,
    color: AppColors.neutral500,
  );
}
```

### 1.3 Spacing System

```dart
class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double xxl = 24.0;
  static const double xxxl = 32.0;
  static const double huge = 48.0;
}
```

### 1.4 Elevation & Shadows

```dart
class AppElevation {
  static const List<BoxShadow> card = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.04),
      blurRadius: 8,
      offset: Offset(0, 2),
    ),
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.02),
      blurRadius: 2,
      offset: Offset(0, 1),
    ),
  ];

  static const List<BoxShadow> cardPressed = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.08),
      blurRadius: 16,
      offset: Offset(0, 4),
    ),
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.04),
      blurRadius: 4,
      offset: Offset(0, 2),
    ),
  ];

  static const List<BoxShadow> bottomSheet = [
    BoxShadow(
      color: Color.fromRGBO(0, 0, 0, 0.12),
      blurRadius: 24,
      offset: Offset(0, -8),
    ),
  ];
}
```

### 1.5 Border Radius

```dart
class AppBorderRadius {
  static const double sm = 6.0;
  static const double md = 8.0;
  static const double lg = 12.0;
  static const double xl = 16.0;
  static const double xxl = 20.0;
  static const double pill = 24.0;
}
```

---

## 2. Component Specifications

### 2.1 Search Bar Component

**Specifications:**
- Sticky positioning at top of screen
- 300ms debounce on input
- Minimum height: 48px
- Clear button when text present

```dart
class SearchBar extends StatefulWidget {
  final String hintText;
  final ValueChanged<String> onChanged;
  final TextEditingController? controller;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: AppColors.neutral100,
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        border: Border.all(color: AppColors.neutral200),
      ),
      child: TextField(
        decoration: InputDecoration(
          hintText: hintText,
          prefixIcon: Icon(Icons.search, color: AppColors.neutral500),
          suffixIcon: // Clear button when text present
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
    );
  }
}
```

**Behavior:**
- Focus state: Blue border, elevated shadow
- Active typing: Show clear button
- Empty state: Hide clear button
- Debounce search queries by 300ms

### 2.2 Doctor Card Component

**Specifications:**
- Card elevation: 2dp default, 4dp on press
- Minimum touch target: 48px height
- Avatar: 48x48px circular
- Next available pill: Dynamic color based on availability

```dart
class DoctorCard extends StatelessWidget {
  final Doctor doctor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shadowColor: AppColors.neutral900.withOpacity(0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        child: Padding(
          padding: EdgeInsets.all(AppSpacing.lg),
          child: Row(
            children: [
              // Avatar (48x48)
              CircleAvatar(
                radius: 24,
                backgroundImage: NetworkImage(doctor.avatarUrl),
              ),
              SizedBox(width: AppSpacing.lg),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(doctor.name, style: AppTextStyles.labelLarge),
                    SizedBox(height: 2),
                    Text(doctor.specialization, style: AppTextStyles.bodySmall),
                    Text(doctor.clinic, style: AppTextStyles.caption),
                  ],
                ),
              ),

              // Next available pill
              Container(
                padding: EdgeInsets.symmetric(
                  horizontal: AppSpacing.sm,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: AppColors.success.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppBorderRadius.pill),
                ),
                child: Text(
                  'Next: Tue AM',
                  style: AppTextStyles.labelMedium.copyWith(
                    color: AppColors.success,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### 2.3 Day Picker Component

**Specifications:**
- Horizontal scrollable chip list
- 14 days from today
- Chip states: today (outlined), selected (filled), disabled (no ranges)

```dart
class DayPicker extends StatefulWidget {
  final DateTime selectedDate;
  final ValueChanged<DateTime> onDateSelected;
  final Set<DateTime> disabledDates;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: AppSpacing.lg),
        itemCount: 14,
        itemBuilder: (context, index) {
          final date = DateTime.now().add(Duration(days: index));
          final isToday = index == 0;
          final isSelected = date.day == selectedDate.day;
          final isDisabled = disabledDates.contains(date);

          return Padding(
            padding: EdgeInsets.only(right: AppSpacing.sm),
            child: DayChip(
              date: date,
              isToday: isToday,
              isSelected: isSelected,
              isDisabled: isDisabled,
              onTap: () => onDateSelected(date),
            ),
          );
        },
      ),
    );
  }
}

class DayChip extends StatelessWidget {
  // Implementation with proper states and animations
  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: Duration(milliseconds: 200),
      width: 64,
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary :
               isDisabled ? AppColors.neutral100 : Colors.transparent,
        borderRadius: BorderRadius.circular(AppBorderRadius.lg),
        border: isToday && !isSelected
          ? Border.all(color: AppColors.primary, width: 2)
          : null,
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isDisabled ? null : onTap,
          borderRadius: BorderRadius.circular(AppBorderRadius.lg),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                DateFormat('E').format(date),
                style: AppTextStyles.bodySmall.copyWith(
                  color: _getTextColor(),
                ),
              ),
              Text(
                date.day.toString(),
                style: AppTextStyles.labelLarge.copyWith(
                  color: _getTextColor(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### 2.4 Range Chips Component

**Specifications:**
- Large tappable area (minimum 56px height)
- Two-line content with availability info
- States: Available, Limited (<3), Full (disabled)
- Scale animation on tap (100-150ms)

```dart
class TimeRangeChips extends StatelessWidget {
  final List<TimeRange> ranges;
  final TimeRange? selectedRange;
  final ValueChanged<TimeRange> onRangeSelected;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: ranges.map((range) =>
        Padding(
          padding: EdgeInsets.only(bottom: AppSpacing.sm),
          child: TimeRangeChip(
            range: range,
            isSelected: range.id == selectedRange?.id,
            onTap: () => onRangeSelected(range),
          ),
        ),
      ).toList(),
    );
  }
}

class TimeRangeChip extends StatefulWidget {
  final TimeRange range;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  _TimeRangeChipState createState() => _TimeRangeChipState();
}

class _TimeRangeChipState extends State<TimeRangeChip>
    with SingleTickerProviderStateMixin {
  late AnimationController _scaleController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      duration: Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _scaleController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Container(
            width: double.infinity,
            constraints: BoxConstraints(minHeight: 56),
            decoration: BoxDecoration(
              color: widget.isSelected ? AppColors.primary : AppColors.surface,
              borderRadius: BorderRadius.circular(AppBorderRadius.lg),
              border: Border.all(
                color: widget.isSelected
                  ? AppColors.primary
                  : AppColors.neutral200,
                width: widget.isSelected ? 2 : 1,
              ),
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: widget.range.remaining > 0 ? _handleTap : null,
                onTapDown: (_) => _scaleController.forward(),
                onTapUp: (_) => _scaleController.reverse(),
                onTapCancel: () => _scaleController.reverse(),
                borderRadius: BorderRadius.circular(AppBorderRadius.lg),
                child: Padding(
                  padding: EdgeInsets.all(AppSpacing.lg),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${widget.range.label} (${widget.range.start}–${widget.range.end})',
                              style: AppTextStyles.labelLarge.copyWith(
                                color: widget.isSelected
                                  ? Colors.white
                                  : AppColors.neutral900,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              _getAvailabilityText(),
                              style: AppTextStyles.bodySmall.copyWith(
                                color: widget.isSelected
                                  ? Colors.white.withOpacity(0.8)
                                  : _getAvailabilityColor(),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Icon(
                        widget.range.remaining > 0
                          ? Icons.arrow_forward_ios
                          : Icons.block,
                        size: 16,
                        color: widget.isSelected
                          ? Colors.white
                          : AppColors.neutral400,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  void _handleTap() {
    HapticFeedback.lightImpact();
    widget.onTap();
  }

  String _getAvailabilityText() {
    final remaining = widget.range.remaining;
    if (remaining == 0) return 'Full';
    if (remaining < 3) return 'Limited spots';
    return '• Spots: $remaining';
  }

  Color _getAvailabilityColor() {
    final remaining = widget.range.remaining;
    if (remaining == 0) return AppColors.error;
    if (remaining < 3) return AppColors.warning;
    return AppColors.success;
  }
}
```

### 2.5 Booking Bottom Sheet

**Specifications:**
- Slides up from bottom
- Keyboard-safe (resizes with keyboard)
- 3 input fields: Name (required), Phone (required), Reason (optional)
- Full-width CTA button
- Haptic feedback on CTA

```dart
class BookingBottomSheet extends StatefulWidget {
  final TimeRange selectedRange;
  final DateTime selectedDate;
  final VoidCallback onConfirm;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppBorderRadius.xxl),
        ),
        boxShadow: AppElevation.bottomSheet,
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: EdgeInsets.all(AppSpacing.xxl),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Handle bar
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.neutral300,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              SizedBox(height: AppSpacing.xl),

              // Header
              Text(
                'Book Appointment',
                style: AppTextStyles.h3,
                textAlign: TextAlign.center,
              ),
              SizedBox(height: AppSpacing.sm),

              // Selected range info
              Container(
                padding: EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.neutral50,
                  borderRadius: BorderRadius.circular(AppBorderRadius.md),
                ),
                child: Row(
                  children: [
                    Icon(Icons.access_time,
                         size: 20,
                         color: AppColors.neutral600),
                    SizedBox(width: AppSpacing.sm),
                    Text(
                      '${DateFormat('EEE, MMM d').format(selectedDate)} • ${selectedRange.label}',
                      style: AppTextStyles.labelMedium,
                    ),
                  ],
                ),
              ),
              SizedBox(height: AppSpacing.xxl),

              // Form fields
              AppTextField(
                label: 'Full Name',
                required: true,
                textInputAction: TextInputAction.next,
              ),
              SizedBox(height: AppSpacing.lg),

              AppTextField(
                label: 'Phone Number',
                required: true,
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
              ),
              SizedBox(height: AppSpacing.lg),

              AppTextField(
                label: 'Reason for Visit',
                required: false,
                maxLines: 3,
                textInputAction: TextInputAction.done,
              ),
              SizedBox(height: AppSpacing.xxxl),

              // CTA Button
              AppButton(
                text: 'Confirm Booking',
                onPressed: _handleConfirm,
                isFullWidth: true,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _handleConfirm() {
    HapticFeedback.lightImpact();
    onConfirm();
  }
}
```

### 2.6 Confirmation Card

**Specifications:**
- Success checkmark animation (300ms)
- Date, time range, clinic info
- Ticket code prominently displayed
- Add to Calendar button
- Clinic address with map deep link

```dart
class ConfirmationCard extends StatefulWidget {
  final Appointment appointment;

  @override
  _ConfirmationCardState createState() => _ConfirmationCardState();
}

class _ConfirmationCardState extends State<ConfirmationCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _checkController;
  late Animation<double> _checkAnimation;

  @override
  void initState() {
    super.initState();
    _checkController = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    _checkAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _checkController,
      curve: Curves.easeInOut,
    ));

    // Start animation
    _checkController.forward();
    HapticFeedback.lightImpact();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppBorderRadius.xl),
      ),
      child: Padding(
        padding: EdgeInsets.all(AppSpacing.xxl),
        child: Column(
          children: [
            // Success checkmark
            AnimatedBuilder(
              animation: _checkAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _checkAnimation.value,
                  child: Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: AppColors.success,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.check,
                      color: Colors.white,
                      size: 32,
                    ),
                  ),
                );
              },
            ),
            SizedBox(height: AppSpacing.xxl),

            Text(
              'Appointment Confirmed!',
              style: AppTextStyles.h2.copyWith(
                color: AppColors.success,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: AppSpacing.xl),

            // Ticket code
            Container(
              padding: EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: AppColors.neutral100,
                borderRadius: BorderRadius.circular(AppBorderRadius.lg),
                border: Border.all(color: AppColors.neutral200),
              ),
              child: Column(
                children: [
                  Text(
                    'Ticket Code',
                    style: AppTextStyles.labelMedium.copyWith(
                      color: AppColors.neutral600,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    widget.appointment.ticket,
                    style: AppTextStyles.h2.copyWith(
                      fontWeight: FontWeight.w700,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: AppSpacing.xl),

            // Appointment details
            _buildDetailRow('Date', DateFormat('EEE, MMM d, y').format(widget.appointment.date)),
            _buildDetailRow('Time', '${widget.appointment.rangeLabel} (${widget.appointment.window.start}–${widget.appointment.window.end})'),
            _buildDetailRow('Doctor', widget.appointment.doctor.name),
            _buildDetailRow('Clinic', widget.appointment.clinic.name),

            SizedBox(height: AppSpacing.xl),

            // Arrival guidance
            Container(
              padding: EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppBorderRadius.md),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: AppColors.primary),
                  SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Text(
                      'Arrive within the first 30 minutes of your window',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: AppSpacing.xl),

            // Action buttons
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Add to Calendar',
                    onPressed: _addToCalendar,
                    variant: ButtonVariant.secondary,
                  ),
                ),
                SizedBox(width: AppSpacing.lg),
                Expanded(
                  child: AppButton(
                    text: 'Get Directions',
                    onPressed: _openMaps,
                    variant: ButtonVariant.primary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 3. User Flow & Interaction Patterns

### 3.1 Main User Flow

```
Landing → Search → Doctor List → Doctor Detail → Day Selection →
Time Range Selection → Booking Form → OTP Verification → Confirmation
```

#### Detailed Interaction Patterns:

1. **Landing Screen**
   - Prominent search bar with "Find doctor" placeholder
   - Auto-focus on search bar when screen loads
   - Popular specialties as quick filter chips below search

2. **Search & Discovery**
   - 300ms debounce on search input
   - Loading skeleton while searching
   - Results appear with smooth fade-in animation
   - Empty state with helpful suggestions

3. **Doctor Selection**
   - Cards with ripple effect on tap
   - Next available day prominently displayed
   - Smooth navigation to detail screen

4. **Date & Time Selection**
   - Horizontal day picker with today highlighted
   - Auto-select today on first visit
   - Time range chips update with smooth animation when date changes
   - Availability counters update with odometer-style animation

5. **Booking Process**
   - Bottom sheet slides up smoothly (300ms duration)
   - Form validation on blur
   - Phone number formatting as user types
   - OTP flow in modal overlay
   - Success state with checkmark animation

### 3.2 Edge Case Handling

#### Range Becomes Unavailable
```dart
// When user selects a range that becomes full during booking
void _handleRangeUnavailable() {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Text('This time slot just filled up. Please choose another.'),
      backgroundColor: AppColors.warning,
      behavior: SnackBarBehavior.floating,
      action: SnackBarAction(
        label: 'Refresh',
        onPressed: _refreshAvailability,
        textColor: Colors.white,
      ),
    ),
  );
  _refreshAvailability();
}
```

#### Network Error Recovery
```dart
class NetworkErrorWidget extends StatelessWidget {
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(AppSpacing.xxl),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.wifi_off, size: 48, color: AppColors.neutral400),
          SizedBox(height: AppSpacing.lg),
          Text(
            'Connection issues',
            style: AppTextStyles.h3.copyWith(color: AppColors.neutral700),
          ),
          SizedBox(height: AppSpacing.sm),
          Text(
            'Please check your internet and try again',
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.neutral500),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: AppSpacing.xl),
          AppButton(
            text: 'Try Again',
            onPressed: onRetry,
            icon: Icons.refresh,
          ),
        ],
      ),
    );
  }
}
```

---

## 4. Accessibility Requirements

### 4.1 Touch Targets
- Minimum 48dp touch targets for all interactive elements
- Adequate spacing between touch targets (8dp minimum)
- Larger touch targets for primary actions (56dp+)

### 4.2 Text & Contrast
- Minimum font size: 14sp for body text
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Support for system font scaling up to 200%

### 4.3 Semantic Markup
```dart
// Example implementation
Semantics(
  label: 'Search for doctors',
  hint: 'Enter doctor name or specialization',
  textField: true,
  child: TextField(
    decoration: InputDecoration(
      hintText: 'Find doctor',
    ),
  ),
)

// Time range chip accessibility
Semantics(
  label: 'Morning appointment slot, 9 AM to 12 PM',
  hint: '6 spots available',
  button: true,
  enabled: range.remaining > 0,
  child: TimeRangeChip(range: range),
)
```

### 4.4 Screen Reader Support
- All images have descriptive alt text
- Form fields have proper labels
- Error messages are announced
- Loading states are announced
- Success confirmations are announced

### 4.5 Keyboard Navigation
- Tab order follows logical flow
- Focus indicators are clearly visible
- All functionality available via keyboard
- Skip links for screen reader users

```dart
class AccessibleButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Focus(
      child: Builder(
        builder: (context) {
          final hasFocus = Focus.of(context).hasFocus;
          return Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppBorderRadius.lg),
              border: hasFocus
                ? Border.all(color: AppColors.primary, width: 3)
                : null,
            ),
            child: Material(
              // Button implementation
            ),
          );
        },
      ),
    );
  }
}
```

---

## 5. Mobile-First Responsive Design

### 5.1 Breakpoint System

```dart
class AppBreakpoints {
  static const double mobile = 0;
  static const double mobileLarge = 428;
  static const double tablet = 768;
  static const double desktop = 1024;
  static const double desktopLarge = 1440;
}

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? mobileLarge;
  final Widget? tablet;
  final Widget? desktop;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= AppBreakpoints.desktop) {
          return desktop ?? tablet ?? mobileLarge ?? mobile;
        }
        if (constraints.maxWidth >= AppBreakpoints.tablet) {
          return tablet ?? mobileLarge ?? mobile;
        }
        if (constraints.maxWidth >= AppBreakpoints.mobileLarge) {
          return mobileLarge ?? mobile;
        }
        return mobile;
      },
    );
  }
}
```

### 5.2 Layout Adaptations

#### Mobile (320-428px)
- Single column layout
- Full-width components
- Bottom navigation
- Bottom sheets for modals
- Sticky search bar

#### Mobile Large (428-768px)
- Same as mobile but with increased padding
- Larger touch targets
- More spacing between elements

#### Tablet (768-1024px)
- Two-column layout for doctor list
- Side panel for booking form instead of bottom sheet
- Larger day picker with more visible dates

#### Desktop (1024px+)
- Three-column layout
- Fixed sidebar navigation
- Modal dialogs instead of bottom sheets
- Hover states for all interactive elements

### 5.3 Touch Gestures

```dart
class GestureHandler extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      onLongPress: _handleLongPress,
      onPanStart: _handlePanStart,
      onPanUpdate: _handlePanUpdate,
      onPanEnd: _handlePanEnd,
      child: child,
    );
  }

  void _handleTap() {
    HapticFeedback.lightImpact();
    // Handle tap
  }

  void _handleLongPress() {
    HapticFeedback.mediumImpact();
    // Show context menu or additional options
  }
}
```

---

## 6. Animation & Micro-Interactions

### 6.1 Core Animations

#### Scale Animations (Touch Feedback)
```dart
class ScaleAnimation extends StatefulWidget {
  final Widget child;
  final VoidCallback onTap;

  @override
  _ScaleAnimationState createState() => _ScaleAnimationState();
}

class _ScaleAnimationState extends State<ScaleAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) {
        _controller.forward();
        HapticFeedback.lightImpact();
      },
      onTapUp: (_) {
        _controller.reverse();
        widget.onTap();
      },
      onTapCancel: () => _controller.reverse(),
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: widget.child,
          );
        },
      ),
    );
  }
}
```

#### Slide Transitions
```dart
class SlideUpTransition extends StatelessWidget {
  final Widget child;
  final Animation<Offset> animation;

  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: animation,
      child: child,
    );
  }
}

// Usage in page transitions
Route _createRoute(Widget page) {
  return PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => page,
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      const begin = Offset(0.0, 1.0);
      const end = Offset.zero;
      const curve = Curves.easeInOutCubic;

      var tween = Tween(begin: begin, end: end).chain(
        CurveTween(curve: curve),
      );

      return SlideTransition(
        position: animation.drive(tween),
        child: child,
      );
    },
    transitionDuration: Duration(milliseconds: 300),
  );
}
```

#### Availability Counter Animation (Odometer Effect)
```dart
class AnimatedCounter extends StatefulWidget {
  final int value;
  final Duration duration;

  @override
  _AnimatedCounterState createState() => _AnimatedCounterState();
}

class _AnimatedCounterState extends State<AnimatedCounter>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<int> _animation;
  int _previousValue = 0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    );
    _animation = IntTween(
      begin: _previousValue,
      end: widget.value,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
  }

  @override
  void didUpdateWidget(AnimatedCounter oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _previousValue = oldWidget.value;
      _animation = IntTween(
        begin: _previousValue,
        end: widget.value,
      ).animate(CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
      ));
      _controller.forward(from: 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Text(
          _animation.value.toString(),
          style: AppTextStyles.labelMedium,
        );
      },
    );
  }
}
```

### 6.2 Loading States

#### Skeleton Loading
```dart
class SkeletonLoading extends StatefulWidget {
  final double width;
  final double height;
  final BorderRadius borderRadius;

  @override
  _SkeletonLoadingState createState() => _SkeletonLoadingState();
}

class _SkeletonLoadingState extends State<SkeletonLoading>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 1200),
      vsync: this,
    )..repeat();
    _animation = Tween<double>(
      begin: -1.0,
      end: 2.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      decoration: BoxDecoration(
        borderRadius: widget.borderRadius,
        color: AppColors.neutral200,
      ),
      child: ClipRRect(
        borderRadius: widget.borderRadius,
        child: AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return Transform.translate(
              offset: Offset(_animation.value * widget.width, 0),
              child: Container(
                width: widget.width,
                height: widget.height,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.transparent,
                      AppColors.neutral100,
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
```

### 6.3 Success Animations

#### Checkmark Draw Animation
```dart
class CheckmarkAnimation extends StatefulWidget {
  final bool isComplete;
  final Color color;
  final double size;

  @override
  _CheckmarkAnimationState createState() => _CheckmarkAnimationState();
}

class _CheckmarkAnimationState extends State<CheckmarkAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _pathAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 300),
      vsync: this,
    );
    _pathAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    if (widget.isComplete) {
      _controller.forward();
    }
  }

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(widget.size, widget.size),
      painter: CheckmarkPainter(
        progress: _pathAnimation.value,
        color: widget.color,
      ),
    );
  }
}
```

---

## 7. State Management Considerations

### 7.1 Riverpod Provider Structure

```dart
// Search providers
final searchQueryProvider = StateProvider<String>((ref) => '');

final doctorSearchProvider = FutureProvider<List<Doctor>>((ref) async {
  final query = ref.watch(searchQueryProvider);
  if (query.isEmpty) return [];

  // Debounce implementation
  await Future.delayed(Duration(milliseconds: 300));
  return ref.read(apiServiceProvider).searchDoctors(query);
});

// Selection state
final selectedDoctorProvider = StateProvider<Doctor?>((ref) => null);
final selectedDateProvider = StateProvider<DateTime>((ref) => DateTime.now());
final selectedRangeProvider = StateProvider<TimeRange?>((ref) => null);

// Availability provider
final availabilityProvider = FutureProvider.family<List<TimeRange>, String>((ref, doctorId) async {
  final date = ref.watch(selectedDateProvider);
  return ref.read(apiServiceProvider).getAvailability(doctorId, date);
});

// Booking form state
final bookingFormProvider = StateNotifierProvider<BookingFormNotifier, BookingFormState>((ref) {
  return BookingFormNotifier();
});

class BookingFormState {
  final String name;
  final String phone;
  final String reason;
  final bool isValid;
  final Map<String, String> errors;

  BookingFormState({
    this.name = '',
    this.phone = '',
    this.reason = '',
    this.isValid = false,
    this.errors = const {},
  });
}

class BookingFormNotifier extends StateNotifier<BookingFormState> {
  BookingFormNotifier() : super(BookingFormState());

  void updateName(String name) {
    state = state.copyWith(name: name);
    _validate();
  }

  void updatePhone(String phone) {
    state = state.copyWith(phone: phone);
    _validate();
  }

  void updateReason(String reason) {
    state = state.copyWith(reason: reason);
  }

  void _validate() {
    final errors = <String, String>{};

    if (state.name.trim().length < 2) {
      errors['name'] = 'Name must be at least 2 characters';
    }

    if (!RegExp(r'^\+62[0-9]{9,13}$').hasMatch(state.phone)) {
      errors['phone'] = 'Please enter a valid Indonesian phone number';
    }

    state = state.copyWith(
      errors: errors,
      isValid: errors.isEmpty,
    );
  }
}
```

### 7.2 Loading States Management

```dart
final loadingProvider = StateNotifierProvider<LoadingNotifier, Map<String, bool>>((ref) {
  return LoadingNotifier();
});

class LoadingNotifier extends StateNotifier<Map<String, bool>> {
  LoadingNotifier() : super({});

  void setLoading(String key, bool isLoading) {
    state = {...state, key: isLoading};
  }

  bool isLoading(String key) => state[key] ?? false;
}

// Usage in widgets
class DoctorListView extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final doctors = ref.watch(doctorSearchProvider);
    final isLoading = ref.watch(loadingProvider).isLoading('searchDoctors');

    return doctors.when(
      loading: () => SkeletonGrid(),
      error: (error, stack) => ErrorWidget(onRetry: () {
        ref.refresh(doctorSearchProvider);
      }),
      data: (doctors) => DoctorGrid(doctors: doctors),
    );
  }
}
```

---

## 8. Error Handling & Edge Cases

### 8.1 Network Error Handling

```dart
class NetworkErrorHandler {
  static void handleError(dynamic error, WidgetRef ref, BuildContext context) {
    if (error is SocketException) {
      _showNetworkError(context);
    } else if (error is TimeoutException) {
      _showTimeoutError(context);
    } else if (error is HttpException) {
      _showServerError(context, error.message);
    } else {
      _showGenericError(context);
    }
  }

  static void _showNetworkError(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(Icons.wifi_off, color: Colors.white),
            SizedBox(width: 12),
            Text('No internet connection'),
          ],
        ),
        backgroundColor: AppColors.error,
        action: SnackBarAction(
          label: 'Retry',
          textColor: Colors.white,
          onPressed: () {
            // Trigger retry
          },
        ),
      ),
    );
  }
}
```

### 8.2 Form Validation

```dart
class FormValidator {
  static String? validateName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!RegExp(r'^[a-zA-Z\s]+$').hasMatch(value)) {
      return 'Name can only contain letters and spaces';
    }
    return null;
  }

  static String? validatePhone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Phone number is required';
    }

    // Format: +62XXXXXXXXX (Indonesian)
    if (!RegExp(r'^\+62[0-9]{9,13}$').hasMatch(value)) {
      return 'Please enter a valid Indonesian phone number (+62XXXXXXXXX)';
    }
    return null;
  }
}

class AppTextField extends StatefulWidget {
  final String label;
  final bool required;
  final String? Function(String?)? validator;
  final TextInputType keyboardType;
  final TextInputAction textInputAction;
  final int maxLines;

  @override
  _AppTextFieldState createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  final _controller = TextEditingController();
  String? _errorText;
  bool _hasBeenFocused = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: TextSpan(
            text: widget.label,
            style: AppTextStyles.labelMedium.copyWith(
              color: AppColors.neutral700,
            ),
            children: widget.required ? [
              TextSpan(
                text: ' *',
                style: TextStyle(color: AppColors.error),
              ),
            ] : null,
          ),
        ),
        SizedBox(height: 6),
        TextFormField(
          controller: _controller,
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          maxLines: widget.maxLines,
          onChanged: _onChanged,
          onTap: () => _hasBeenFocused = true,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppBorderRadius.md),
              borderSide: BorderSide(color: AppColors.neutral300),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppBorderRadius.md),
              borderSide: BorderSide(color: AppColors.primary, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppBorderRadius.md),
              borderSide: BorderSide(color: AppColors.error, width: 2),
            ),
            contentPadding: EdgeInsets.all(AppSpacing.lg),
            errorText: _errorText,
          ),
        ),
      ],
    );
  }

  void _onChanged(String value) {
    if (!_hasBeenFocused) return;

    setState(() {
      _errorText = widget.validator?.call(value);
    });
  }
}
```

### 8.3 Empty States

```dart
class EmptyStateWidget extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final String? buttonText;
  final VoidCallback? onButtonPressed;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(AppSpacing.xxxl),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.neutral100,
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              size: 40,
              color: AppColors.neutral400,
            ),
          ),
          SizedBox(height: AppSpacing.xl),
          Text(
            title,
            style: AppTextStyles.h3.copyWith(
              color: AppColors.neutral700,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: AppSpacing.sm),
          Text(
            subtitle,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.neutral500,
            ),
            textAlign: TextAlign.center,
          ),
          if (buttonText != null && onButtonPressed != null) ...[
            SizedBox(height: AppSpacing.xl),
            AppButton(
              text: buttonText!,
              onPressed: onButtonPressed,
              variant: ButtonVariant.secondary,
            ),
          ],
        ],
      ),
    );
  }
}

// Specific empty states
class NoDoctorsFound extends StatelessWidget {
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return EmptyStateWidget(
      icon: Icons.search_off,
      title: 'No doctors found',
      subtitle: 'Try adjusting your search terms or browse all specializations',
      buttonText: 'Browse All',
      onButtonPressed: onRetry,
    );
  }
}

class NoAvailableSlots extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return EmptyStateWidget(
      icon: Icons.event_busy,
      title: 'No available slots',
      subtitle: 'This doctor is not available on the selected date. Try another date.',
    );
  }
}
```

### 8.4 Capacity Race Condition Handling

```dart
class BookingService {
  Future<Appointment> createAppointment({
    required String doctorId,
    required DateTime date,
    required String rangeId,
    required PatientInfo patient,
    String? reason,
  }) async {
    try {
      final response = await _apiClient.post('/appointments', {
        'doctorId': doctorId,
        'date': date.toIso8601String().split('T').first,
        'rangeId': rangeId,
        'patient': patient.toJson(),
        'reason': reason,
      });

      return Appointment.fromJson(response.data);
    } on DioError catch (e) {
      if (e.response?.statusCode == 409) {
        // Range is full
        throw BookingConflictException(
          'This time slot is no longer available. Please choose another slot.',
        );
      } else if (e.response?.statusCode == 429) {
        // Rate limiting (duplicate booking protection)
        throw BookingRateLimitException(
          'Please wait a moment before trying to book again.',
        );
      }
      rethrow;
    }
  }
}

// Usage in UI
class BookingFormWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppButton(
      text: 'Confirm Booking',
      onPressed: () async {
        try {
          ref.read(loadingProvider.notifier).setLoading('booking', true);

          final appointment = await ref.read(bookingServiceProvider).createAppointment(
            doctorId: selectedDoctor.id,
            date: selectedDate,
            rangeId: selectedRange.id,
            patient: patient,
          );

          // Success - navigate to confirmation
          Navigator.of(context).push(_createRoute(ConfirmationScreen(appointment)));

        } on BookingConflictException catch (e) {
          _showConflictError(context, e.message);
          // Refresh availability
          ref.refresh(availabilityProvider(selectedDoctor.id));

        } on BookingRateLimitException catch (e) {
          _showRateLimitError(context, e.message);

        } catch (e) {
          _showGenericError(context);

        } finally {
          ref.read(loadingProvider.notifier).setLoading('booking', false);
        }
      },
    );
  }

  void _showConflictError(BuildContext context, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Slot Unavailable'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Choose Another Slot'),
          ),
        ],
      ),
    );
  }
}
```

---

## 9. Performance Optimization

### 9.1 Image Optimization

```dart
class OptimizedImage extends StatelessWidget {
  final String imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget? placeholder;
  final Widget? errorWidget;

  @override
  Widget build(BuildContext context) {
    return CachedNetworkImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      fit: fit,
      placeholder: (context, url) => placeholder ?? SkeletonLoading(
        width: width ?? 48,
        height: height ?? 48,
        borderRadius: BorderRadius.circular(24),
      ),
      errorWidget: (context, url, error) => errorWidget ?? Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: AppColors.neutral100,
          shape: BoxShape.circle,
        ),
        child: Icon(
          Icons.person,
          color: AppColors.neutral400,
          size: (width ?? 48) * 0.5,
        ),
      ),
      memCacheWidth: (width?.toInt() ?? 48) * 2, // 2x for retina
      memCacheHeight: (height?.toInt() ?? 48) * 2,
    );
  }
}
```

### 9.2 List Optimization

```dart
class OptimizedDoctorList extends StatelessWidget {
  final List<Doctor> doctors;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      // Use ListView.builder for large lists
      physics: BouncingScrollPhysics(),
      padding: EdgeInsets.all(AppSpacing.lg),
      itemCount: doctors.length,
      separatorBuilder: (context, index) => SizedBox(height: AppSpacing.sm),
      itemBuilder: (context, index) {
        final doctor = doctors[index];
        return DoctorCard(
          key: ValueKey(doctor.id), // Important for performance
          doctor: doctor,
          onTap: () => _navigateToDetail(context, doctor),
        );
      },
    );
  }
}
```

---

## 10. Testing Considerations

### 10.1 Widget Testing Examples

```dart
// Test for TimeRangeChip component
testWidgets('TimeRangeChip shows correct availability info', (tester) async {
  final range = TimeRange(
    id: 'am',
    label: 'Morning',
    start: '09:00',
    end: '12:00',
    remaining: 5,
  );

  await tester.pumpWidget(
    MaterialApp(
      home: Scaffold(
        body: TimeRangeChip(
          range: range,
          isSelected: false,
          onTap: () {},
        ),
      ),
    ),
  );

  expect(find.text('Morning (09:00–12:00)'), findsOneWidget);
  expect(find.text('• Spots: 5'), findsOneWidget);

  // Test tap functionality
  await tester.tap(find.byType(TimeRangeChip));
  await tester.pump();

  // Verify haptic feedback would be called
  // (requires mocking HapticFeedback.lightImpact)
});

// Test for booking form validation
testWidgets('BookingForm validates required fields', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      child: MaterialApp(
        home: BookingBottomSheet(
          selectedRange: mockRange,
          selectedDate: DateTime.now(),
          onConfirm: () {},
        ),
      ),
    ),
  );

  // Try to submit without filling required fields
  await tester.tap(find.text('Confirm Booking'));
  await tester.pump();

  // Should show validation errors
  expect(find.text('Name is required'), findsOneWidget);
  expect(find.text('Phone number is required'), findsOneWidget);
});
```

### 10.2 Integration Testing

```dart
// Test complete booking flow
void main() {
  group('Booking Flow Integration Tests', () {
    testWidgets('Complete happy path booking', (tester) async {
      await tester.pumpWidget(MyApp());

      // Search for doctor
      await tester.enterText(find.byType(TextField), 'Dr. Smith');
      await tester.pump(Duration(milliseconds: 300)); // Wait for debounce

      // Select doctor
      await tester.tap(find.byType(DoctorCard).first);
      await tester.pumpAndSettle();

      // Select date
      await tester.tap(find.text('Tomorrow'));
      await tester.pump();

      // Select time range
      await tester.tap(find.byType(TimeRangeChip).first);
      await tester.pumpAndSettle();

      // Fill booking form
      await tester.enterText(find.byLabelText('Full Name'), 'John Doe');
      await tester.enterText(find.byLabelText('Phone Number'), '+628123456789');

      // Submit booking
      await tester.tap(find.text('Confirm Booking'));
      await tester.pumpAndSettle();

      // Should navigate to confirmation screen
      expect(find.text('Appointment Confirmed!'), findsOneWidget);
    });
  });
}
```

---

## 11. Implementation Checklist

### 11.1 Core Components
- [ ] Search bar with debounce
- [ ] Doctor cards with proper touch feedback
- [ ] Day picker with 14-day range
- [ ] Time range chips with availability states
- [ ] Booking bottom sheet with form validation
- [ ] Confirmation screen with success animation
- [ ] Loading skeletons for all components
- [ ] Error states and retry mechanisms

### 11.2 Accessibility
- [ ] All touch targets minimum 48dp
- [ ] Text minimum 14sp with proper contrast
- [ ] Screen reader labels for all interactive elements
- [ ] Keyboard navigation support
- [ ] Focus indicators
- [ ] Error announcements
- [ ] Success confirmations announced

### 11.3 Responsive Design
- [ ] Mobile-first approach (320px+)
- [ ] Tablet adaptations (768px+)
- [ ] Desktop optimizations (1024px+)
- [ ] Touch gesture support
- [ ] Proper spacing at all breakpoints

### 11.4 Performance
- [ ] Image optimization and caching
- [ ] List virtualization for large datasets
- [ ] Proper key usage for list items
- [ ] Memory-efficient animations
- [ ] Network request optimization

### 11.5 Error Handling
- [ ] Network error recovery
- [ ] Form validation with proper feedback
- [ ] Capacity conflict handling
- [ ] Empty state management
- [ ] Loading state indicators

### 11.6 State Management
- [ ] Proper provider structure with Riverpod
- [ ] Form state management
- [ ] Loading state tracking
- [ ] Error state handling
- [ ] Cache invalidation strategies

---

## 12. Launch Readiness

Before launching the Flutter Web PWA, ensure:

1. **Performance meets targets:**
   - TTFB < 1.5s on 4G
   - Interactive < 3s
   - Lighthouse PWA score > 90

2. **Accessibility compliance:**
   - WCAG 2.1 AA compliance
   - Screen reader testing completed
   - Keyboard navigation verified

3. **Cross-browser testing:**
   - Chrome, Firefox, Safari, Edge
   - iOS Safari, Chrome Mobile
   - Various screen sizes tested

4. **Error handling verified:**
   - Network offline scenarios
   - Server error responses
   - Edge cases covered

5. **Analytics implementation:**
   - Search events tracking
   - Booking funnel tracking
   - Error event logging
   - Performance monitoring

---

This comprehensive guide provides all necessary specifications for implementing the patient appointment booking Flutter Web PWA. Each component includes detailed implementation examples, accessibility considerations, and performance optimizations to ensure a high-quality user experience that meets the MVP requirements.