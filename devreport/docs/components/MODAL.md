# Modal Component Documentation

## Overview

The Modal component provides accessible, animated dialog windows with comprehensive keyboard support, focus management, and stacking capabilities.

## Features

- **Accessibility**: Full ARIA support, focus trap, keyboard navigation
- **Animations**: Smooth fade-in/slide-down transitions
- **Sizes**: Five size options (sm, md, lg, xl, full)
- **Variants**: Confirmation dialogs, alert dialogs (success, warning, error, info)
- **Stacking**: Multiple modals support with proper z-index management
- **Focus Management**: Automatic focus trap and restoration
- **Keyboard Support**: ESC to close, Tab for focus navigation
- **Body Scroll Lock**: Prevents background scrolling when modal is open
- **Responsive**: Mobile-friendly with proper viewport handling
- **Customizable**: Flexible content API with header, body, and footer sections

## Files

- **CSS**: `/css/components/modals.css`
- **JavaScript**: `/js/components/Modal.js`
- **Examples**: `/examples/modal-examples.html`

## Basic Usage

### 1. Include Files

```html
<!-- CSS -->
<link rel="stylesheet" href="css/design-tokens.css">
<link rel="stylesheet" href="css/components/modals.css">

<!-- JavaScript -->
<script src="js/components/Modal.js"></script>
```

### 2. Create and Open Modal

```javascript
// Create modal instance
const modal = new Modal({
  size: 'md',
  closeOnBackdrop: true,
  closeOnEscape: true
});

// Set content
modal.setContent({
  title: 'Modal Title',
  subtitle: 'Optional subtitle',
  body: '<p>Modal content goes here.</p>',
  footer: '<button class="btn btn-primary" data-modal-close>Close</button>',
  showClose: true
});

// Open modal
modal.open();
```

## Constructor Options

```javascript
const modal = new Modal({
  id: 'modal-1',                    // Unique ID (auto-generated if not provided)
  size: 'md',                        // Size: 'sm', 'md', 'lg', 'xl', 'full'
  variant: null,                     // Variant: null, 'confirm', 'alert-success', etc.
  closeOnBackdrop: true,             // Close when clicking backdrop
  closeOnEscape: true,               // Close when pressing ESC key
  preventBodyScroll: true,           // Lock body scroll when open
  onOpen: (modal) => {},             // Callback when modal opens
  onClose: (modal) => {},            // Callback when modal closes
  onBeforeClose: async (modal) => {} // Callback before close (can prevent)
});
```

## API Methods

### `setContent(content)`

Set modal content using object or HTML string/element.

**Object format:**
```javascript
modal.setContent({
  title: 'Modal Title',
  subtitle: 'Optional subtitle',
  body: '<p>Body content</p>',
  footer: '<button>Action</button>',
  showClose: true
});
```

**HTML string:**
```javascript
modal.setContent('<div class="modal-header">...</div>');
```

**HTML element:**
```javascript
const element = document.createElement('div');
element.innerHTML = '...';
modal.setContent(element);
```

### `open()`

Open the modal.

```javascript
modal.open();
```

### `close()`

Close the modal.

```javascript
modal.close();
```

### `destroy()`

Destroy the modal and clean up event listeners.

```javascript
modal.destroy();
```

## Modal Sizes

### Small (`sm`) - 320px
Compact modals for simple confirmations or alerts.

```javascript
const modal = new Modal({ size: 'sm' });
```

### Medium (`md`) - 500px (Default)
Standard modal size for most use cases.

```javascript
const modal = new Modal({ size: 'md' });
```

### Large (`lg`) - 800px
Larger modals for forms or detailed content.

```javascript
const modal = new Modal({ size: 'lg' });
```

### Extra Large (`xl`) - 1140px
Very large modals for complex interfaces or dashboards.

```javascript
const modal = new Modal({ size: 'xl' });
```

### Full Screen (`full`)
Full viewport modals with margin.

```javascript
const modal = new Modal({ size: 'full' });
```

## Modal Variants

### Confirmation Dialog

```javascript
const modal = new Modal({ variant: 'confirm' });
modal.setContent({
  title: 'Confirm Action',
  body: 'Are you sure?',
  footer: `
    <button class="btn btn-secondary" data-modal-close>Cancel</button>
    <button class="btn btn-primary">Confirm</button>
  `
});
```

### Alert Dialogs

**Success:**
```javascript
const modal = new Modal({ variant: 'alert-success' });
```

**Warning:**
```javascript
const modal = new Modal({ variant: 'alert-warning' });
```

**Error:**
```javascript
const modal = new Modal({ variant: 'alert-error' });
```

**Info:**
```javascript
const modal = new Modal({ variant: 'alert-info' });
```

## Helper Functions

The `ModalHelpers` utility provides convenient methods for common modal patterns.

### Confirmation Dialog

```javascript
const confirmed = await ModalHelpers.confirm({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmText: 'Yes, Proceed',
  cancelText: 'Cancel',
  size: 'sm'
});

if (confirmed) {
  // User clicked confirm
} else {
  // User clicked cancel or closed modal
}
```

### Alert Dialogs

**Success:**
```javascript
await ModalHelpers.success('Operation completed successfully!', 'Success');
```

**Warning:**
```javascript
await ModalHelpers.warning('Please review your changes.', 'Warning');
```

**Error:**
```javascript
await ModalHelpers.error('An error occurred.', 'Error');
```

**Info:**
```javascript
await ModalHelpers.info('For your information.', 'Information');
```

### Generic Alert

```javascript
await ModalHelpers.alert({
  type: 'success',        // 'success', 'warning', 'error', 'info'
  title: 'Alert Title',
  message: 'Alert message',
  okText: 'OK',
  size: 'sm'
});
```

## Advanced Features

### Prevent Close

Prevent modal from closing using `onBeforeClose` callback:

```javascript
const modal = new Modal({
  onBeforeClose: async (modal) => {
    const confirmed = await ModalHelpers.confirm({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to close?'
    });
    return confirmed; // Return false to prevent closing
  }
});
```

### Modal Stacking

Open multiple modals on top of each other:

```javascript
// First modal
const modal1 = new Modal({ size: 'md' });
modal1.setContent({ title: 'First Modal', body: '...' });
modal1.open();

// Second modal (stacks on top)
const modal2 = new Modal({ size: 'sm' });
modal2.setContent({ title: 'Second Modal', body: '...' });
modal2.open();
```

### Custom Close Handling

Handle close events with callbacks:

```javascript
const modal = new Modal({
  onClose: (modal) => {
    console.log('Modal closed');
    // Clean up or perform actions after close
  }
});
```

### Form Modal

Create a modal with a form:

```javascript
const modal = new Modal({
  size: 'md',
  closeOnBackdrop: false // Prevent accidental close
});

modal.setContent({
  title: 'Edit Profile',
  body: `
    <form id="profileForm">
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" required>
      </div>
    </form>
  `,
  footer: `
    <button class="btn btn-secondary" data-modal-close>Cancel</button>
    <button class="btn btn-primary" onclick="submitForm()">Save</button>
  `
});

modal.open();
```

## Accessibility Features

### ARIA Attributes

The modal automatically includes:
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby` (references modal title)

### Focus Management

- **Focus Trap**: Tab/Shift+Tab cycles through focusable elements within modal
- **Initial Focus**: First focusable element receives focus on open
- **Focus Restoration**: Focus returns to previously focused element on close

### Keyboard Support

- **ESC**: Close modal (if `closeOnEscape` is true)
- **Tab**: Move to next focusable element
- **Shift+Tab**: Move to previous focusable element

### Screen Reader Support

- Modal title is announced when opened
- Close button has `aria-label="Close modal"`
- Proper semantic HTML structure

## CSS Classes

### Modal Structure

```html
<div class="modal-backdrop">
  <div class="modal modal-md">
    <div class="modal-header">
      <div>
        <h2 class="modal-title">Title</h2>
        <p class="modal-subtitle">Subtitle</p>
      </div>
      <button class="modal-close" data-modal-close>
        <span class="modal-close-text">Close</span>
      </button>
    </div>
    <div class="modal-body">
      <!-- Content -->
    </div>
    <div class="modal-footer">
      <!-- Footer buttons -->
    </div>
  </div>
</div>
```

### Size Classes

- `.modal-sm` - Small modal (320px)
- `.modal-md` - Medium modal (500px)
- `.modal-lg` - Large modal (800px)
- `.modal-xl` - Extra large modal (1140px)
- `.modal-full` - Full screen modal

### Variant Classes

- `.modal-confirm` - Confirmation dialog
- `.modal-alert-success` - Success alert
- `.modal-alert-warning` - Warning alert
- `.modal-alert-error` - Error alert
- `.modal-alert-info` - Info alert

### Footer Alignment Classes

- `.modal-footer-start` - Align buttons to left
- `.modal-footer-center` - Center buttons
- `.modal-footer-between` - Space between buttons

## CSS Custom Properties

The modal uses design tokens from `/css/design-tokens.css`:

```css
/* Z-index */
--z-index-modal-backdrop: 1040;
--z-index-modal: 1050;

/* Spacing */
--spacing-6: 1.5rem;

/* Border radius */
--radius-lg: 12px;

/* Shadows */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Transitions */
--duration-normal: 300ms;
--duration-fast: 200ms;
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: 12+
- Android Chrome: Latest

## Performance

- **Animations**: GPU-accelerated transforms
- **Focus Management**: Efficient DOM queries with caching
- **Event Listeners**: Properly cleaned up on destroy
- **Body Scroll Lock**: Calculates scrollbar width to prevent layout shift

## Best Practices

1. **Always provide a title** for screen reader users
2. **Use appropriate size** for content (don't use xl for simple messages)
3. **Include close button** or allow ESC/backdrop close for good UX
4. **Validate forms** before closing modal
5. **Use confirmation dialogs** for destructive actions
6. **Keep modals focused** on single tasks
7. **Clean up** modal instances when done (`.destroy()`)
8. **Use ModalHelpers** for simple alerts and confirmations

## Examples

See `/examples/modal-examples.html` for interactive examples of:
- Basic modals in all sizes
- Confirmation dialogs
- Alert dialogs
- Form modals
- Scrollable content
- Stacked modals
- Custom content

## Troubleshooting

### Modal doesn't open
- Check that CSS and JS files are loaded
- Ensure `modal.open()` is called
- Check browser console for errors

### Focus trap not working
- Ensure modal has focusable elements
- Check that modal is the top-most modal
- Verify `handleFocusTrap` is properly bound

### Body scroll not locked
- Check `preventBodyScroll` option is true
- Ensure `body.modal-open` class is added
- Verify scrollbar width calculation

### Animations not working
- Check CSS file is loaded
- Verify design tokens are available
- Check for `prefers-reduced-motion` setting

## Support

For issues or questions, refer to the main project documentation or create an issue in the project repository.

## Version History

- **1.0** (2025-10-02): Initial release with full accessibility support
