# Makmur - Design System (Calm Theme)

> Generated from PRD.md MVP Phase 1 features
> Style: Soft UI Evolution | Mood: Calming, Spiritual, Peaceful

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#0F766E` (teal-700) | Primary brand, headings, nav links |
| `primary-light` | `#14B8A6` (teal-500) | Hover states, secondary actions |
| `primary-soft` | `#99F6E4` (teal-200) | Subtle highlights, badges |
| `accent` | `#D4A574` | Warm gold — Islamic geometric accents, decorative |
| `accent-light` | `#F5E6D3` | Warm gold backgrounds, subtle warmth |
| `cta` | `#047857` (emerald-700) | CTA buttons, success states |
| `cta-hover` | `#065F46` (emerald-800) | CTA hover state |
| `background` | `#F0FDFA` (teal-50) | Page background |
| `surface` | `#FFFFFF` | Card backgrounds |
| `surface-alt` | `#F0F9FF` | Alternate section backgrounds |
| `text-primary` | `#0F172A` (slate-900) | Headings, primary text |
| `text-body` | `#334155` (slate-700) | Body text |
| `text-muted` | `#64748B` (slate-500) | Secondary text, captions |
| `border` | `#E2E8F0` (slate-200) | Card borders, dividers |

### Rationale
- **Teal**: Evokes calm, trust, and spiritual tranquility — aligns with mosque serenity
- **Warm Gold**: References Islamic geometric art and architecture (dome accents, arabesque)
- **Emerald Green**: Culturally significant in Islam, signals growth and life
- **No purple**: Avoided overly generic SaaS palette in favor of spiritually resonant tones

---

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Heading (H1) | Lora | 700 | 48px / 3rem |
| Heading (H2) | Lora | 600 | 36px / 2.25rem |
| Heading (H3) | Lora | 600 | 24px / 1.5rem |
| Body | Raleway | 400 | 16px / 1rem |
| Body large | Raleway | 400 | 18px / 1.125rem |
| Caption | Raleway | 500 | 14px / 0.875rem |
| Button | Raleway | 600 | 16px / 1rem |

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');
```

**Tailwind Config:**
```js
fontFamily: {
  serif: ['Lora', 'serif'],
  sans: ['Raleway', 'sans-serif'],
}
```

### Rationale
- **Lora**: Organic curves convey warmth and calm — perfect for spiritual/wellness context
- **Raleway**: Elegant simplicity for body text, high readability at all sizes
- **Line height**: 1.6 for body text, 1.2 for headings

---

## Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `section-padding` | `py-20 lg:py-28` | Vertical section spacing |
| `container` | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Content container |
| `card-radius` | `rounded-2xl` (16px) | Card border radius |
| `button-radius` | `rounded-xl` (12px) | Button border radius |
| `navbar-radius` | `rounded-2xl` (16px) | Floating navbar |

---

## Shadows (Soft UI Evolution)

```css
/* Card shadow — subtle depth */
--shadow-card: 0 2px 8px rgba(15, 118, 110, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);

/* Card hover shadow — lifted */
--shadow-card-hover: 0 8px 24px rgba(15, 118, 110, 0.10), 0 2px 6px rgba(0, 0, 0, 0.04);

/* Navbar shadow */
--shadow-navbar: 0 4px 16px rgba(0, 0, 0, 0.06);

/* Button shadow */
--shadow-button: 0 2px 8px rgba(4, 120, 87, 0.25);
```

---

## Effects & Animations

| Effect | Value | Usage |
|--------|-------|-------|
| Hover transition | `transition-all duration-200 ease-out` | Cards, buttons |
| Card hover | `hover:shadow-lg hover:-translate-y-1` | Feature cards |
| Button hover | `hover:bg-emerald-800 hover:shadow-lg` | CTA buttons |
| Fade in | `opacity-0 → opacity-100, 400ms` | Section reveals |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` | Disable transforms |

---

## Icon System

- **Icon set**: Lucide Icons (SVG inline)
- **Size**: `w-6 h-6` (24x24) for UI, `w-8 h-8` (32x32) for feature cards
- **Color**: Inherit from parent or use `text-teal-600`
- **No emojis** as UI icons

---

## Component Patterns

### Floating Navbar
```
fixed top-4 left-4 right-4 z-50
bg-white/90 backdrop-blur-md
rounded-2xl shadow-navbar
px-6 py-3
```

### Feature Card
```
bg-white rounded-2xl p-8
shadow-card hover:shadow-card-hover
transition-all duration-200 ease-out
hover:-translate-y-1 cursor-pointer
border border-slate-100
```

### CTA Button (Primary)
```
bg-emerald-700 text-white
px-8 py-4 rounded-xl
font-semibold text-base
hover:bg-emerald-800
shadow-button hover:shadow-lg
transition-all duration-200
cursor-pointer
```

### CTA Button (Secondary)
```
bg-white text-teal-700
border-2 border-teal-200
px-8 py-4 rounded-xl
font-semibold text-base
hover:border-teal-400 hover:bg-teal-50
transition-all duration-200
cursor-pointer
```

---

## Landing Page Sections

1. **Navbar** — Floating glass, logo + links + CTA
2. **Hero** — "Makmurkan Masjid Anda" + subtitle + dual CTA + mosque visual
3. **Features** — 4 MVP features (TV Prayer, TV Announcement, Prayer Times, Mosque Finder)
4. **TV Display Preview** — Showcase Smart TV display feature
5. **How It Works** — 3-step onboarding flow for mosques
6. **Stats / Social Proof** — Mosques, jamaah, cities counters
7. **Final CTA** — Download / Register call to action
8. **Footer** — Links, branding, social

---

## Anti-Patterns (AVOID)

- Bright neon colors
- Harsh/fast animations
- Dark mode (keep it light and calming)
- Emojis as UI icons
- Purple/generic SaaS palettes
- Layout shift on hover (no scale transforms on cards)
- Low contrast text on light backgrounds

---

## Accessibility

- Color contrast: 4.5:1 minimum for all text
- Focus rings: `focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`
- Touch targets: minimum 44x44px
- Alt text on all meaningful images
- `prefers-reduced-motion` respected
- Semantic HTML (nav, main, section, footer)
