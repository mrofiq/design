/**
 * THEME CUSTOMIZATION
 * Color palette generation and theme management
 */

// ============================================
// COLOR CONVERSION UTILITIES
// ============================================

/**
 * Convert HEX to RGB
 * @param {string} hex - HEX color code
 * @returns {Object} RGB object {r, g, b}
 */
function hexToRGB(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to HEX
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} HEX color code
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert HEX to HSL
 * @param {string} hex - HEX color code
 * @returns {Object} HSL object {h, s, l}
 */
function hexToHSL(hex) {
  const rgb = hexToRGB(hex);
  if (!rgb) return null;

  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to HEX
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} HEX color code
 */
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

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
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

// ============================================
// PALETTE GENERATION
// ============================================

/**
 * Generate 10-shade palette from base color
 * @param {string} hexColor - Base HEX color (600 shade)
 * @returns {Object} Palette with shades 50-900
 */
function generatePalette(hexColor) {
  const hsl = hexToHSL(hexColor);
  if (!hsl) return null;

  const { h, s } = hsl;

  // Lightness values for each shade
  const lightnessMap = {
    50: 97,
    100: 93,
    200: 86,
    300: 73,
    400: 58,
    500: 48,
    600: 42, // Base color
    700: 35,
    800: 27,
    900: 20
  };

  // Saturation adjustments for more vibrant palette
  const saturationMap = {
    50: s * 0.6,
    100: s * 0.75,
    200: s * 0.85,
    300: s * 0.9,
    400: s * 0.95,
    500: s,
    600: s, // Base color
    700: s * 1.05,
    800: s * 1.1,
    900: s * 1.15
  };

  const palette = {};

  for (const [shade, lightness] of Object.entries(lightnessMap)) {
    const adjustedSaturation = Math.min(saturationMap[shade], 100);
    palette[shade] = hslToHex(h, adjustedSaturation, lightness);
  }

  return palette;
}

// ============================================
// WCAG CONTRAST CHECKING
// ============================================

/**
 * Get relative luminance of a color
 * @param {string} hex - HEX color code
 * @returns {number} Relative luminance
 */
function getRelativeLuminance(hex) {
  const rgb = hexToRGB(hex);
  if (!rgb) return 0;

  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} fg - Foreground HEX color
 * @param {string} bg - Background HEX color
 * @returns {number} Contrast ratio
 */
function calculateContrastRatio(fg, bg) {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check WCAG contrast compliance
 * @param {string} fg - Foreground HEX color
 * @param {string} bg - Background HEX color
 * @returns {Object} Compliance result
 */
function checkContrast(fg, bg) {
  const ratio = calculateContrastRatio(fg, bg);

  let level = 'Fail';
  let pass = false;

  if (ratio >= 7) {
    level = 'AAA';
    pass = true;
  } else if (ratio >= 4.5) {
    level = 'AA';
    pass = true;
  }

  return {
    ratio: ratio.toFixed(2),
    level,
    pass
  };
}

/**
 * Validate theme accessibility
 * @param {string} primaryColor - Primary HEX color
 * @returns {Object} Accessibility validation results
 */
function validateThemeAccessibility(primaryColor) {
  const checks = {
    whiteOnPrimary: checkContrast('#FFFFFF', primaryColor),
    blackOnLight: checkContrast('#000000', '#FAFAF9'),
    primaryOnWhite: checkContrast(primaryColor, '#FFFFFF')
  };

  const allPass = Object.values(checks).every(check => check.pass);
  const minLevel = Object.values(checks).reduce((min, check) => {
    if (check.level === 'Fail') return 'Fail';
    if (min === 'Fail') return 'Fail';
    if (check.level === 'AA' || min === 'AA') return 'AA';
    return 'AAA';
  }, 'AAA');

  return {
    checks,
    overall: {
      pass: allPass,
      level: minLevel
    }
  };
}

// ============================================
// THEME APPLICATION
// ============================================

/**
 * Apply theme to page
 * @param {string} primaryColor - Primary HEX color
 */
function applyTheme(primaryColor) {
  const palette = generatePalette(primaryColor);
  if (!palette) return;

  const root = document.documentElement;

  // Apply palette to CSS custom properties
  for (const [shade, color] of Object.entries(palette)) {
    root.style.setProperty(`--color-primary-${shade}`, color);
  }

  // Update meta theme color
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    document.head.appendChild(metaTheme);
  }
  metaTheme.content = palette[600];
}

/**
 * Get current theme
 * @returns {Object} Current theme settings
 */
function getCurrentTheme() {
  const root = document.documentElement;
  const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary-600').trim();

  return {
    primaryColor: primaryColor || '#D97706'
  };
}

/**
 * Save theme to localStorage
 * @param {Object} theme - Theme settings
 */
function saveTheme(theme) {
  try {
    localStorage.setItem('app-theme', JSON.stringify(theme));
    return true;
  } catch (error) {
    console.error('Failed to save theme:', error);
    return false;
  }
}

/**
 * Load theme from localStorage
 * @returns {Object|null} Saved theme or null
 */
function loadTheme() {
  try {
    const saved = localStorage.getItem('app-theme');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load theme:', error);
    return null;
  }
}

/**
 * Reset to default theme
 */
function resetTheme() {
  const defaultColor = '#D97706';
  applyTheme(defaultColor);
  saveTheme({ primaryColor: defaultColor });
}

// ============================================
// COLOR PICKER INITIALIZATION
// ============================================

/**
 * Initialize color picker
 * @param {string} inputId - Input element ID
 * @param {Function} onChange - Callback when color changes
 */
function initColorPicker(inputId, onChange) {
  const input = document.getElementById(inputId);
  if (!input) return;

  // Validate HEX input
  input.addEventListener('input', (e) => {
    let value = e.target.value.trim();

    // Add # if missing
    if (value && !value.startsWith('#')) {
      value = '#' + value;
      input.value = value;
    }

    // Validate HEX format
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      input.classList.remove('error');
      input.classList.add('success');

      if (onChange) {
        onChange(value.toUpperCase());
      }
    } else if (value.length === 7) {
      input.classList.add('error');
      input.classList.remove('success');
    } else {
      input.classList.remove('error', 'success');
    }
  });

  // Format on blur
  input.addEventListener('blur', (e) => {
    const value = e.target.value.trim().toUpperCase();
    if (/^#[0-9A-F]{6}$/.test(value)) {
      input.value = value;
    }
  });
}

/**
 * Update live preview
 * @param {string} color - HEX color to preview
 */
function updatePreview(color) {
  const previewElements = {
    primaryButton: document.getElementById('preview-primary-btn'),
    secondaryButton: document.getElementById('preview-secondary-btn'),
    queueNumber: document.getElementById('preview-queue-number'),
    statusBadge: document.getElementById('preview-status-badge'),
    link: document.getElementById('preview-link')
  };

  // Update primary button
  if (previewElements.primaryButton) {
    previewElements.primaryButton.style.backgroundColor = color;
  }

  // Update secondary button
  if (previewElements.secondaryButton) {
    previewElements.secondaryButton.style.borderColor = color;
    previewElements.secondaryButton.style.color = color;
  }

  // Update queue number
  if (previewElements.queueNumber) {
    previewElements.queueNumber.style.color = color;
  }

  // Update link
  if (previewElements.link) {
    previewElements.link.style.color = color;
  }
}

// ============================================
// PRESET COLORS
// ============================================

const PRESET_COLORS = [
  { name: 'Orange', color: '#D97706', emoji: '🟠' },
  { name: 'Red', color: '#DC2626', emoji: '🔴' },
  { name: 'Rose', color: '#E11D48', emoji: '🌹' },
  { name: 'Amber', color: '#F59E0B', emoji: '🟡' },
  { name: 'Emerald', color: '#10B981', emoji: '🟢' },
  { name: 'Blue', color: '#2563EB', emoji: '🔵' },
  { name: 'Purple', color: '#9333EA', emoji: '🟣' },
  { name: 'Pink', color: '#EC4899', emoji: '🩷' }
];

/**
 * Get suggested alternative color
 * @param {string} color - Original color
 * @returns {string} Suggested alternative
 */
function getSuggestedAlternative(color) {
  const hsl = hexToHSL(color);
  if (!hsl) return '#D97706';

  // Make it darker for better contrast
  const darkerL = Math.max(hsl.l - 20, 30);
  return hslToHex(hsl.h, hsl.s, darkerL);
}

// Auto-load theme on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = loadTheme();
    if (savedTheme && savedTheme.primaryColor) {
      applyTheme(savedTheme.primaryColor);
    }
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    hexToRGB,
    rgbToHex,
    hexToHSL,
    hslToHex,
    generatePalette,
    getRelativeLuminance,
    calculateContrastRatio,
    checkContrast,
    validateThemeAccessibility,
    applyTheme,
    getCurrentTheme,
    saveTheme,
    loadTheme,
    resetTheme,
    initColorPicker,
    updatePreview,
    getSuggestedAlternative,
    PRESET_COLORS
  };
}
