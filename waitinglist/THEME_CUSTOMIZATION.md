# Theme Customization System
## Waiting List SaaS Platform - Brand Customization Specification

---

## 1. Overview

**Purpose:** Enable restaurant admins to customize the application's color palette to match their brand identity while maintaining accessibility and visual consistency.

**Target Users:** Restaurant owners/admins with Premium subscription

**Scope:**
- Primary color customization
- Auto-generated color palette (50-900 shades)
- Real-time preview
- Accessibility validation
- Persistent theme storage

---

## 2. User Experience Flow

```
Dashboard → Settings → Theme Tab → Choose Color → Preview → Validate → Save
```

### 2.1 Entry Points

**Primary:**
- Settings page → Theme Customization tab

**Secondary:**
- Onboarding wizard (first-time setup)
- Quick theme picker in dashboard header (dropdown)
- Email/notification with upgrade prompt

---

## 3. UI Specifications

### 3.1 Theme Customization Tab (`/settings?tab=theme`)

#### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│ Settings > Theme                                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─────────────────────┐   ┌─────────────────────┐ │
│ │ Primary Color       │   │ Live Preview        │ │
│ │                     │   │                     │ │
│ │ [Color Picker]      │   │ ┌─────────────────┐ │ │
│ │ #D97706             │   │ │ Preview Card    │ │ │
│ │                     │   │ │                 │ │ │
│ │ Presets:            │   │ │ [Button]        │ │ │
│ │ 🟠🔴🌹🟡🟢🔵       │   │ │                 │ │ │
│ │                     │   │ │ Text Preview    │ │ │
│ │ Accessibility:      │   │ └─────────────────┘ │ │
│ │ ✓ AA Compliant      │   │                     │ │
│ │ Contrast: 7.2:1     │   │                     │ │
│ │                     │   │                     │ │
│ │ [Reset] [Save]      │   │                     │ │
│ └─────────────────────┘   └─────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 3.1.1 Color Picker Section

**Primary Color Selector:**
- **Component:** Custom color input + visual picker
- **Default Value:** `#D97706` (warm orange)
- **Format:** HEX color code (`#RRGGBB`)
- **Input Features:**
  - Visual color wheel/picker
  - HEX input field (manual entry)
  - RGB sliders (optional advanced mode)
  - HSL sliders (optional advanced mode)
  - Recent colors history (last 5)
  - Eyedropper tool (browser support permitting)

**Visual Design:**
- Large color preview square: 120px × 120px
- Border: 2px solid current color
- Border radius: 12px
- Shadow: Medium
- Click to open advanced picker modal

**HEX Input:**
- Type: Text input
- Label: "Primary Color (HEX)"
- Placeholder: "#D97706"
- Validation:
  - Must be valid hex (#RRGGBB or #RGB)
  - Auto-prepend # if missing
  - Convert 3-digit to 6-digit format
  - Real-time validation feedback
- Error message: "Invalid color format. Use #RRGGBB"

#### 3.1.2 Color Swatch Presets

**Preset Palettes:**

Display 6-8 pre-selected warm color options as quick-select swatches.

```
┌────────────────────────────────────┐
│ Quick Presets:                     │
│                                    │
│ 🟠 Orange   🔴 Red      🌹 Rose    │
│ #D97706     #DC2626    #E11D48     │
│                                    │
│ 🟡 Amber    🟢 Emerald  🔵 Blue    │
│ #F59E0B     #10B981    #2563EB     │
│                                    │
│ 🟣 Purple   🩷 Pink                │
│ #9333EA     #EC4899                │
└────────────────────────────────────┘
```

**Swatch Design:**
- Size: 64px × 64px (touch-friendly)
- Border radius: 12px
- Border: 2px solid transparent
- Selected: Border 3px solid with accent
- Hover: Scale(1.05) + shadow
- Label: Color name + HEX below
- Font: 12px, Medium

**Preset Colors:**
1. **Warm Orange** (Default): `#D97706`
2. **Red**: `#DC2626`
3. **Rose**: `#E11D48`
4. **Amber**: `#F59E0B`
5. **Yellow**: `#EAB308`
6. **Emerald**: `#10B981`
7. **Blue**: `#2563EB`
8. **Purple**: `#9333EA`

**Interaction:**
- Click swatch → Apply color immediately to picker
- Update preview in real-time
- Highlight selected swatch

#### 3.1.3 Auto-Generated Palette Display

Show all generated shades (50-900) in a visual grid:

```
┌─────────────────────────────────────────┐
│ Generated Palette Shades:               │
│                                         │
│ 50   100  200  300  400  500  600  ... │
│ [▀] [▀] [▀] [▀] [▀] [▀] [●] ...       │
│                                         │
│ ● = Your selected color (600 shade)    │
└─────────────────────────────────────────┘
```

**Shade Grid:**
- Each shade: 48px × 48px
- Border radius: 8px
- Hover: Show HEX tooltip
- Click: Copy HEX to clipboard
- Visual indicator for primary (600 shade)

#### 3.1.4 Accessibility Validation

**Contrast Ratio Check:**

Display real-time WCAG compliance for common text/background combinations:

```
┌──────────────────────────────────────┐
│ Accessibility Check:                 │
│                                      │
│ ✓ White text on Primary: 7.2:1 (AAA)│
│ ✓ Black text on Light BG: 12.5:1    │
│ ⚠ Primary text on White: 4.1:1 (AA) │
│ ✗ Light text on White: 1.8:1 (FAIL) │
│                                      │
│ Overall: AA Compliant ✓              │
└──────────────────────────────────────┘
```

**Validation Rules:**
- **AAA:** Contrast ratio ≥ 7:1 (preferred)
- **AA:** Contrast ratio ≥ 4.5:1 (minimum for body text)
- **AA Large:** Contrast ratio ≥ 3:1 (for headings 18px+)
- **FAIL:** Contrast ratio < 3:1 (not allowed)

**Visual Indicators:**
- ✓ Green checkmark: Passes AAA or AA
- ⚠ Yellow warning: Passes AA but not AAA
- ✗ Red X: Fails minimum standards

**Validation Behavior:**
- Real-time checking on color change
- Block save if critical elements fail (e.g., primary button text)
- Show warning for non-critical failures
- Suggest alternative shades if fails

**Auto-Adjustment Suggestion:**
If selected color fails critical contrasts:
```
┌─────────────────────────────────────┐
│ ⚠ Accessibility Warning             │
│                                     │
│ Your color (#FFEB3B) has low        │
│ contrast for button text.           │
│                                     │
│ Suggested alternatives:             │
│ • Darker: #F59E0B (AA compliant)   │
│ • Lighter: #FCD34D (with dark text)│
│                                     │
│ [Use Suggestion] [Keep Anyway]      │
└─────────────────────────────────────┘
```

#### 3.1.5 Live Preview Panel

**Preview Components:**

Show real-time preview of how the new color appears in the app:

```
┌─────────────────────────────────┐
│ Live Preview                    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Header                      │ │
│ │ [Primary Button]            │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ #042 (Queue Number)         │ │
│ │ ● Menunggu (Status Badge)   │ │
│ │ [Panggil] (Action Button)   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Link Text Example           │ │
│ │ Hover State Example         │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Preview Elements:**
1. Primary button (with hover state)
2. Queue number display
3. Status badges (waiting, called)
4. Action buttons
5. Links and hover states
6. Form inputs with focus state
7. Cards and borders

**Preview Mode:**
- Live updates: Changes apply immediately
- Toggle dark mode preview (if supported)
- Responsive preview (mobile/desktop)
- Full-screen preview option

#### 3.1.6 Action Buttons

**Reset Button:**
- Style: Secondary/outline
- Text: "Reset to Default"
- Icon: ↺ (refresh icon)
- Action: Restore default warm orange (#D97706)
- Confirmation: Optional if unsaved changes
- Position: Bottom left

**Save Button:**
- Style: Primary (uses current selected color)
- Text: "Save Theme"
- Icon: ✓ (checkmark)
- Action: Persist theme to database
- Loading state: "Saving..."
- Disabled: If validation fails critical checks
- Position: Bottom right

**Button Behavior:**
```javascript
// Pseudo-code
if (contrastCheckFails(criticalElements)) {
  saveButton.disabled = true;
  showError("Cannot save: Accessibility requirements not met");
} else if (contrastCheckWarnings()) {
  showWarning("Some elements may have lower contrast");
  saveButton.enabled = true;
} else {
  saveButton.enabled = true;
}
```

---

## 4. Color Generation Algorithm

### 4.1 Palette Generation

**Input:** Single HEX color (e.g., `#D97706`)

**Output:** 10 shades (50, 100, 200, ..., 900)

**Algorithm:**

```typescript
interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;  // Original color
  700: string;
  800: string;
  900: string;
}

function generatePalette(hexColor: string): ColorPalette {
  // Convert HEX to HSL
  const hsl = hexToHSL(hexColor);

  // Define lightness targets for each shade
  const lightnessMap = {
    50: 98,   // Lightest
    100: 95,
    200: 90,
    300: 80,
    400: 70,
    500: 60,
    600: 50,  // Original (baseline)
    700: 40,
    800: 30,
    900: 20,  // Darkest
  };

  const palette: ColorPalette = {};

  for (const [shade, targetLightness] of Object.entries(lightnessMap)) {
    // Adjust lightness while keeping hue and saturation
    const adjustedHSL = {
      h: hsl.h,
      s: hsl.s * (shade === '50' ? 0.7 : 1), // Reduce saturation for lightest
      l: targetLightness,
    };

    palette[shade] = hslToHex(adjustedHSL);
  }

  return palette;
}

// Helper: Convert HEX to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / delta + 2) / 6;
    } else {
      h = ((r - g) / delta + 4) / 6;
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

// Helper: Convert HSL to HEX
function hslToHex(hsl: { h: number; s: number; l: number }): string {
  const { h, s, l } = hsl;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
```

### 4.2 Contrast Ratio Calculation

**WCAG Formula:**

```typescript
function calculateContrastRatio(foreground: string, background: string): number {
  const luminance1 = getRelativeLuminance(foreground);
  const luminance2 = getRelativeLuminance(background);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hex: string): number {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

function checkContrast(foreground: string, background: string) {
  const ratio = calculateContrastRatio(foreground, background);

  if (ratio >= 7) {
    return { level: 'AAA', ratio, pass: true };
  } else if (ratio >= 4.5) {
    return { level: 'AA', ratio, pass: true };
  } else if (ratio >= 3) {
    return { level: 'AA Large', ratio, pass: false }; // Only for 18px+ text
  } else {
    return { level: 'Fail', ratio, pass: false };
  }
}
```

**Critical Contrast Checks:**
```typescript
const criticalChecks = [
  { fg: primary600, bg: '#FFFFFF', element: 'Primary button text' },
  { fg: '#FFFFFF', bg: primary600, element: 'Button background' },
  { fg: primary700, bg: neutral50, element: 'Links on light background' },
  { fg: neutral800, bg: '#FFFFFF', element: 'Body text' },
];

criticalChecks.forEach(check => {
  const result = checkContrast(check.fg, check.bg);
  if (!result.pass) {
    errors.push(`${check.element} fails contrast (${result.ratio.toFixed(1)}:1)`);
  }
});
```

---

## 5. Data Model & Storage

### 5.1 Database Schema

**Table: `restaurants`**

Add column for theme settings:

```sql
ALTER TABLE restaurants
ADD COLUMN theme_settings JSONB DEFAULT '{
  "primary_color": "#D97706",
  "auto_palette": true,
  "custom_shades": {},
  "dark_mode": false
}'::jsonb;
```

**JSONB Structure:**
```json
{
  "primary_color": "#D97706",
  "auto_palette": true,
  "custom_shades": {
    "50": "#FFFBEB",
    "100": "#FEF3C7",
    "200": "#FDE68A",
    "300": "#FCD34D",
    "400": "#FBBF24",
    "500": "#F59E0B",
    "600": "#D97706",
    "700": "#B45309",
    "800": "#92400E",
    "900": "#78350F"
  },
  "dark_mode": false,
  "created_at": "2025-10-03T10:00:00Z",
  "updated_at": "2025-10-03T10:00:00Z"
}
```

**Fields:**
- `primary_color`: HEX color selected by user
- `auto_palette`: Boolean (true = auto-generate shades, false = use custom shades)
- `custom_shades`: Object with 50-900 shades (optional, for advanced users)
- `dark_mode`: Boolean (future feature)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### 5.2 API Endpoints

**GET `/api/restaurant/theme`**

Get current theme settings:

```typescript
// Request
GET /api/restaurant/theme
Authorization: Bearer {token}

// Response (200 OK)
{
  "primary_color": "#D97706",
  "palette": {
    "50": "#FFFBEB",
    "100": "#FEF3C7",
    // ... all shades
    "900": "#78350F"
  },
  "auto_palette": true,
  "dark_mode": false,
  "updated_at": "2025-10-03T10:00:00Z"
}
```

**PUT `/api/restaurant/theme`**

Update theme settings:

```typescript
// Request
PUT /api/restaurant/theme
Authorization: Bearer {token}
Content-Type: application/json

{
  "primary_color": "#DC2626",
  "auto_palette": true
}

// Response (200 OK)
{
  "success": true,
  "primary_color": "#DC2626",
  "palette": {
    // ... auto-generated palette
  },
  "message": "Theme updated successfully"
}

// Error Response (400 Bad Request)
{
  "success": false,
  "error": "Invalid color format",
  "details": "Color must be in #RRGGBB format"
}

// Error Response (422 Unprocessable Entity)
{
  "success": false,
  "error": "Accessibility validation failed",
  "details": [
    "Primary button text contrast too low: 2.1:1 (minimum 4.5:1)"
  ]
}
```

**POST `/api/restaurant/theme/reset`**

Reset to default theme:

```typescript
// Request
POST /api/restaurant/theme/reset
Authorization: Bearer {token}

// Response (200 OK)
{
  "success": true,
  "primary_color": "#D97706",
  "message": "Theme reset to default"
}
```

**POST `/api/restaurant/theme/validate`**

Validate color before saving (optional pre-check):

```typescript
// Request
POST /api/restaurant/theme/validate
Authorization: Bearer {token}
Content-Type: application/json

{
  "primary_color": "#FFEB3B"
}

// Response (200 OK)
{
  "valid": false,
  "warnings": [
    "Button text contrast: 3.2:1 (below 4.5:1 minimum)"
  ],
  "suggestions": [
    {
      "color": "#F59E0B",
      "reason": "Darker shade with better contrast (7.1:1)"
    }
  ]
}
```

---

## 6. Frontend Implementation

### 6.1 React Component Structure

**Component Hierarchy:**
```
ThemeCustomizationTab
├── ColorPicker
│   ├── HexInput
│   ├── VisualPicker (modal)
│   └── RecentColors
├── PresetSwatches
│   └── SwatchButton (×8)
├── PaletteDisplay
│   └── ShadeGrid
├── AccessibilityValidator
│   └── ContrastCheck (×4)
├── LivePreview
│   ├── PreviewButton
│   ├── PreviewBadge
│   └── PreviewCard
└── ActionButtons
    ├── ResetButton
    └── SaveButton
```

### 6.2 State Management

**Using React Query + Zustand:**

```typescript
// stores/themeStore.ts
import create from 'zustand';

interface ThemeState {
  primaryColor: string;
  palette: ColorPalette;
  isDirty: boolean;
  setPrimaryColor: (color: string) => void;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: '#D97706',
  palette: {},
  isDirty: false,
  setPrimaryColor: (color) => {
    const palette = generatePalette(color);
    set({ primaryColor: color, palette, isDirty: true });
  },
  resetTheme: () => set({
    primaryColor: '#D97706',
    palette: generatePalette('#D97706'),
    isDirty: false
  }),
}));

// hooks/useTheme.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';

export function useTheme() {
  const queryClient = useQueryClient();

  // Fetch current theme
  const { data, isLoading } = useQuery('theme', fetchTheme);

  // Update theme
  const mutation = useMutation(updateTheme, {
    onSuccess: () => {
      queryClient.invalidateQueries('theme');
      toast.success('Theme saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save theme');
    },
  });

  return {
    theme: data,
    isLoading,
    updateTheme: mutation.mutate,
    isUpdating: mutation.isLoading,
  };
}
```

### 6.3 CSS Variable Injection

**Dynamic CSS Variables:**

```typescript
// utils/applyTheme.ts
export function applyTheme(primaryColor: string) {
  const palette = generatePalette(primaryColor);

  // Update CSS custom properties
  document.documentElement.style.setProperty('--color-primary-50', palette[50]);
  document.documentElement.style.setProperty('--color-primary-100', palette[100]);
  // ... all shades
  document.documentElement.style.setProperty('--color-primary-900', palette[900]);

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', primaryColor);
  }
}

// Usage in component
useEffect(() => {
  if (theme?.primary_color) {
    applyTheme(theme.primary_color);
  }
}, [theme]);
```

### 6.4 Persistence & Sync

**Local Storage Cache:**
```typescript
// Cache theme in localStorage for instant load
function cacheTheme(theme: ThemeSettings) {
  localStorage.setItem('restaurant_theme', JSON.stringify(theme));
}

function getCachedTheme(): ThemeSettings | null {
  const cached = localStorage.getItem('restaurant_theme');
  return cached ? JSON.parse(cached) : null;
}

// Apply cached theme immediately on load
const cachedTheme = getCachedTheme();
if (cachedTheme) {
  applyTheme(cachedTheme.primary_color);
}
```

---

## 7. Accessibility Requirements

### 7.1 WCAG Compliance

**Minimum Requirements:**
- All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Primary actions (buttons) must meet AAA when possible (7:1)
- Focus indicators must be clearly visible (3:1 contrast with background)

**Validation Points:**
1. **Primary button:** White text on primary color background
2. **Secondary button:** Primary color text on white background
3. **Status badges:** Text on colored badge backgrounds
4. **Links:** Primary color on white/light backgrounds
5. **Form inputs:** Border color visibility

### 7.2 User Guidance

**Accessibility Helper:**
```
┌────────────────────────────────────┐
│ 💡 Tip: Choosing Accessible Colors │
│                                    │
│ • Darker colors work better for    │
│   buttons with white text          │
│ • Lighter colors may need dark     │
│   text for visibility              │
│ • Test your color with the         │
│   preview panel                    │
└────────────────────────────────────┘
```

---

## 8. Testing & Validation

### 8.1 Unit Tests

```typescript
describe('Color Generation', () => {
  it('should generate 10 shades from primary color', () => {
    const palette = generatePalette('#D97706');
    expect(Object.keys(palette)).toHaveLength(10);
    expect(palette[600]).toBe('#D97706');
  });

  it('should maintain hue across shades', () => {
    const palette = generatePalette('#D97706');
    const hue = hexToHSL('#D97706').h;

    Object.values(palette).forEach(shade => {
      const shadeHue = hexToHSL(shade).h;
      expect(Math.abs(shadeHue - hue)).toBeLessThan(5); // ±5° tolerance
    });
  });
});

describe('Contrast Validation', () => {
  it('should pass AAA for high contrast', () => {
    const result = checkContrast('#000000', '#FFFFFF');
    expect(result.level).toBe('AAA');
    expect(result.pass).toBe(true);
  });

  it('should fail for low contrast', () => {
    const result = checkContrast('#FFEB3B', '#FFFFFF');
    expect(result.pass).toBe(false);
  });
});
```

### 8.2 Integration Tests

```typescript
describe('Theme Customization Flow', () => {
  it('should save theme and update UI', async () => {
    // 1. Select color
    const colorPicker = screen.getByLabelText('Primary Color');
    fireEvent.change(colorPicker, { target: { value: '#DC2626' } });

    // 2. Verify preview updates
    const previewButton = screen.getByTestId('preview-button');
    expect(previewButton).toHaveStyle({ backgroundColor: '#DC2626' });

    // 3. Save theme
    const saveButton = screen.getByText('Save Theme');
    fireEvent.click(saveButton);

    // 4. Verify API call
    await waitFor(() => {
      expect(mockUpdateTheme).toHaveBeenCalledWith({
        primary_color: '#DC2626',
        auto_palette: true,
      });
    });
  });
});
```

### 8.3 Manual Testing Checklist

**Functional:**
- [ ] Color picker opens and closes correctly
- [ ] HEX input validates format
- [ ] Preset swatches apply colors
- [ ] Palette auto-generates with correct shades
- [ ] Accessibility checks update in real-time
- [ ] Live preview reflects changes immediately
- [ ] Save persists to database
- [ ] Reset restores default color
- [ ] Page refresh loads saved theme

**Visual:**
- [ ] All UI elements use new color consistently
- [ ] Hover states use correct shade
- [ ] Focus states are visible
- [ ] Badges use appropriate background shades
- [ ] Text remains readable on all backgrounds

**Accessibility:**
- [ ] All text meets minimum contrast
- [ ] Save button disabled if validation fails
- [ ] Warnings shown for borderline contrasts
- [ ] Screen reader announces color changes

**Cross-Browser:**
- [ ] Chrome (desktop & mobile)
- [ ] Safari (iOS & macOS)
- [ ] Firefox
- [ ] Edge

---

## 9. Migration & Rollout

### 9.1 Database Migration

```sql
-- Migration: Add theme_settings column
-- Up
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS theme_settings JSONB
DEFAULT '{
  "primary_color": "#D97706",
  "auto_palette": true,
  "custom_shades": {},
  "dark_mode": false
}'::jsonb;

-- Add index for JSON queries
CREATE INDEX idx_restaurants_theme_primary
ON restaurants ((theme_settings->>'primary_color'));

-- Down
ALTER TABLE restaurants DROP COLUMN IF EXISTS theme_settings;
DROP INDEX IF EXISTS idx_restaurants_theme_primary;
```

### 9.2 Feature Flag

```typescript
// Feature flag for gradual rollout
const THEME_CUSTOMIZATION_ENABLED = process.env.FEATURE_THEME_CUSTOMIZATION === 'true';

// Component
{THEME_CUSTOMIZATION_ENABLED && (
  <Tab value="theme">
    <ThemeCustomizationTab />
  </Tab>
)}
```

### 9.3 Premium Feature Gating

```typescript
// Restrict to Premium plan
function ThemeCustomizationTab() {
  const { subscription } = useAuth();

  if (subscription.plan !== 'premium') {
    return (
      <UpgradePrompt
        feature="Theme Customization"
        description="Customize your brand colors to match your restaurant's identity."
        cta="Upgrade to Premium"
      />
    );
  }

  return <ThemeEditor />;
}
```

---

## 10. Future Enhancements (Phase 2)

**Advanced Customization:**
- [ ] Dark mode support
- [ ] Custom font selection (from safe list)
- [ ] Background image upload
- [ ] Logo customization (size, position)
- [ ] Custom CSS injection (advanced users)
- [ ] Multi-theme support (switch between presets)
- [ ] Seasonal themes (auto-switch by date)
- [ ] A/B testing different themes

**Developer Features:**
- [ ] Theme export/import (JSON)
- [ ] Theme marketplace (share/download themes)
- [ ] API for programmatic theme updates
- [ ] Webhook for theme changes

---

**Document Version:** 1.0
**Last Updated:** October 3, 2025
**Status:** Ready for Implementation
