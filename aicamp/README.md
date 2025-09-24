# Online Training Companion - HTML Prototype

A comprehensive, responsive web application prototype for live training sessions built with modern web technologies, shadcn/ui design patterns, and WCAG 3.0 AA accessibility standards.

## 🚀 Live Demo

Open `index.html` in a modern web browser to explore the prototype. The application supports all three training modes and includes a fully functional Q&A system with sample data.

## ✨ Features

### 🎯 Core Functionality
- **Three Training Modes**: Pre-training, In-training, and Post-training
- **Responsive Design**: Optimized for desktop (≥1280px), tablet (≥768px), and mobile (<768px)
- **Real-time Q&A System**: Anonymous questions with upvoting and moderation
- **Interactive Slide Viewer**: Navigation controls with synchronized content
- **Personal Notes**: Auto-saving note-taking system
- **Certificate Generation**: Professional completion certificates
- **Feedback System**: Star ratings and detailed feedback forms

### 🎨 Design System
- **shadcn/ui Components**: Production-ready UI components with proper TypeScript types
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Dark/Light Mode**: System-aware theme switching
- **Compact Design**: Optimized for content density following webguide.md specifications
- **Professional Aesthetics**: Clean, minimal interface suitable for corporate environments

### ♿ Accessibility
- **WCAG 3.0 AA Compliance**: Comprehensive accessibility support
- **Keyboard Navigation**: Full keyboard support with logical focus management
- **Screen Reader Optimized**: Proper ARIA labels and live regions
- **High Contrast**: 4.5:1 minimum contrast ratios
- **Touch Targets**: 44x44px minimum touch targets
- **Reduced Motion**: Respects user motion preferences

### 📱 Responsive Features
- **Mobile-First Approach**: Progressive enhancement for larger screens
- **Collapsible Panels**: Smart space utilization on smaller screens
- **Touch Optimized**: Gesture-friendly interactions
- **Adaptive Navigation**: Context-aware navigation patterns

## 🛠 Technical Architecture

### Technologies Used
- **HTML5**: Semantic markup with proper document structure
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Vanilla JavaScript**: Modern ES6+ features for interactivity
- **TypeScript**: Comprehensive type definitions for development
- **Lucide Icons**: Beautiful, consistent iconography
- **CSS Custom Properties**: Theme-aware styling system

### File Structure
```
├── index.html          # Main application file
├── components.js       # shadcn/ui-inspired component utilities
├── types.ts           # TypeScript interface definitions
├── README.md          # This documentation
└── webguide.md        # Design system specifications
└── online_training_companion_prd.md  # Product requirements
```

### Component Architecture
The prototype follows shadcn/ui patterns with:
- **Composable Components**: Modular, reusable UI building blocks
- **Utility Functions**: Helper functions for common operations
- **Event-Driven Architecture**: Clean separation of concerns
- **Type-Safe Development**: Comprehensive TypeScript definitions

## 🎮 Usage Guide

### Navigation
- **Mode Switching**: Use sidebar navigation (desktop) or top tabs (mobile)
- **Keyboard Shortcuts**:
  - `Alt + 1/2/3`: Switch between training modes
  - `Ctrl/Cmd + K`: Focus Q&A input
  - `Ctrl/Cmd + N`: Focus personal notes
  - `Ctrl/Cmd + D`: Toggle dark mode

### Pre-Training Mode
- View session agenda and trainer information
- Submit learning expectations
- Download pre-training materials
- Monitor countdown to session start

### In-Training Mode
- Navigate through slides with arrow controls
- Submit reactions (👍👎🚀) for real-time feedback
- Ask questions anonymously in Q&A system
- Take personal notes that auto-save
- Copy code examples to clipboard

### Post-Training Mode
- Download completion certificate
- Submit detailed feedback with star ratings
- Discover recommended follow-up sessions

### Q&A System
- **Submit Questions**: Type and submit anonymous questions
- **Upvote System**: Vote on relevant questions to prioritize them
- **Sorting Options**: View questions by most upvoted or newest
- **Real-time Updates**: See new questions and votes immediately
- **Moderation Ready**: Support for trainer moderation controls

## 🎨 Design System Implementation

### Color Palette
```css
/* Light Mode */
--primary-500: #3b82f6    /* Primary brand color */
--neutral-50: #fafafa     /* Background light */
--neutral-900: #171717    /* Text high contrast */

/* Dark Mode */
--dark-bg-primary: #0a0a0a     /* True black for OLED */
--dark-text-primary: #fafafa   /* High contrast white */
```

### Typography Scale
```css
--text-xs: 0.75rem     /* 12px - Helper text */
--text-sm: 0.875rem    /* 14px - Body secondary */
--text-base: 1rem      /* 16px - Body primary */
--text-lg: 1.125rem    /* 18px - Subheadings */
--text-xl: 1.25rem     /* 20px - Section headers */
--text-2xl: 1.5rem     /* 24px - Page titles */
```

### Spacing System
```css
--space-2: 0.5rem      /* 8px - Component padding */
--space-3: 0.75rem     /* 12px - Small gaps */
--space-4: 1rem        /* 16px - Standard spacing */
--space-6: 1.5rem      /* 24px - Card padding */
```

### Responsive Breakpoints
```css
--mobile: 320px        /* Minimum support */
--tablet: 768px        /* Tablet portrait */
--desktop: 1280px      /* Desktop minimum */
--wide: 1440px         /* Wide desktop */
```

## ♿ Accessibility Features

### Screen Reader Support
- Semantic HTML5 structure
- Proper heading hierarchy (h1-h6)
- Descriptive ARIA labels
- Live regions for dynamic content
- Alternative text for images

### Keyboard Navigation
- Logical tab order throughout the interface
- Focus indicators with 2px borders and high contrast
- Skip links to main content
- Roving tabindex for complex widgets
- Escape key handling for modals

### Visual Accessibility
- 4.5:1 contrast ratio for normal text
- 3:1 contrast ratio for large text
- Color-independent information conveyance
- Scalable text up to 200% without horizontal scrolling
- Reduced motion support with `prefers-reduced-motion`

## 🔧 Customization

### Theming
The prototype supports extensive theming through CSS custom properties:

```css
:root {
  /* Brand colors */
  --brand-primary: var(--primary-500);
  --brand-secondary: var(--neutral-600);

  /* Border radius personality */
  --brand-radius: 8px;

  /* Shadow style */
  --brand-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
```

### Component Variants
All components support multiple variants:
- **Buttons**: default, destructive, outline, secondary, ghost, link
- **Badges**: default, secondary, destructive, outline
- **Cards**: default, elevated, outlined

### Feature Flags
Enable/disable features through JavaScript configuration:
```javascript
const features = {
  qaSystem: true,
  realTimeSync: true,
  certificates: true,
  analytics: false
};
```

## 📊 Performance Considerations

### Optimization Strategies
- **CSS-in-HTML**: Critical styles inlined for fast initial render
- **Lazy Loading**: Components and features loaded on demand
- **Image Optimization**: WebP format with fallbacks
- **Font Loading**: System fonts prioritized for performance
- **Bundle Size**: Minimal dependencies, vanilla JavaScript

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Optimized with efficient CSS and fonts
- **FID (First Input Delay)**: Responsive interactions with minimal JavaScript
- **CLS (Cumulative Layout Shift)**: Stable layouts with proper sizing

## 🧪 Browser Support

### Modern Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Fallbacks and Polyfills
- Clipboard API with execCommand fallback
- CSS Grid with Flexbox fallback
- Modern JavaScript with babel transpilation ready

## 🚀 Production Deployment

### Build Process
1. **HTML Minification**: Remove whitespace and comments
2. **CSS Optimization**: Purge unused Tailwind classes
3. **JavaScript Bundling**: Combine and minify scripts
4. **Asset Optimization**: Compress images and fonts
5. **CDN Ready**: Static assets optimized for global distribution

### Environment Configuration
```javascript
const config = {
  apiBaseUrl: process.env.API_BASE_URL,
  wsBaseUrl: process.env.WS_BASE_URL,
  environment: process.env.NODE_ENV
};
```

## 📱 Mobile Considerations

### Touch Interactions
- **44x44px minimum touch targets**
- **8px minimum spacing** between touch targets
- **Swipe gestures** for slide navigation
- **Pull-to-refresh** for real-time updates

### Mobile-Specific Features
- **Bottom navigation** for primary actions
- **Collapsible panels** to maximize content area
- **Optimized keyboards** for different input types
- **Viewport meta tag** for proper scaling

## 🔒 Security Considerations

### Client-Side Security
- **XSS Prevention**: Proper content escaping and sanitization
- **CSRF Protection**: Token-based request validation
- **Content Security Policy**: Strict CSP headers
- **Secure Storage**: Proper handling of sensitive data

### Privacy Features
- **Anonymous Q&A**: No personally identifiable information stored
- **Local Storage**: User preferences stored locally
- **Data Minimization**: Only necessary data collected
- **GDPR Compliance**: Right to data deletion support

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Open `index.html` in a modern browser
3. Make changes to HTML, CSS, or JavaScript
4. Test across different devices and browsers

### Code Standards
- **HTML**: Semantic markup with proper accessibility attributes
- **CSS**: Utility-first with custom properties for theming
- **JavaScript**: ES6+ with comprehensive error handling
- **TypeScript**: Strict mode with comprehensive type coverage

## 📄 License

This prototype is created for demonstration purposes and follows industry best practices for web accessibility, performance, and user experience.

---

*Built with ❤️ using modern web technologies and accessibility-first design principles.*