/**
 * Shared Utilities and Helper Functions
 * Visitor Interface - Waiting List SaaS Platform
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format phone number with hyphens
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format: 0812-3456-7890
    if (cleaned.length >= 10) {
        return cleaned.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
    }

    return cleaned;
}

/**
 * Validate Indonesian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function validatePhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const pattern = /^08[0-9]{8,11}$/;
    return pattern.test(cleaned);
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Get current time in HH:MM format
 * @returns {string} Current time
 */
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Get relative time string
 * @param {Date} date - Date to compare
 * @returns {string} Relative time string
 */
function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) {
        return 'Beberapa detik yang lalu';
    } else if (diffMins < 60) {
        return `${diffMins} menit yang lalu`;
    } else {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

/**
 * Generate session ID
 * @returns {string} Session ID
 */
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Store data in session storage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function setSession(key, value) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Session storage error:', e);
    }
}

/**
 * Get data from session storage
 * @param {string} key - Storage key
 * @returns {*} Stored value
 */
function getSession(key) {
    try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Session storage error:', e);
        return null;
    }
}

/**
 * Clear session storage
 */
function clearSession() {
    try {
        sessionStorage.clear();
    } catch (e) {
        console.error('Session storage error:', e);
    }
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

/**
 * Request notification permission
 */
async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (e) {
            console.error('Notification permission error:', e);
            return false;
        }
    }
    return Notification.permission === 'granted';
}

/**
 * Show browser notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 */
function showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            const notification = new Notification(title, {
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                vibrate: [200, 100, 200],
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } catch (e) {
            console.error('Notification error:', e);
        }
    }
}

/**
 * Play notification sound
 */
function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=');
        audio.play().catch(e => console.error('Audio play error:', e));
    } catch (e) {
        console.error('Audio error:', e);
    }
}

/**
 * Trigger vibration
 * @param {Array} pattern - Vibration pattern
 */
function vibrate(pattern = [200, 100, 200]) {
    if ('vibrate' in navigator) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.error('Vibration error:', e);
        }
    }
}

// ============================================
// WEBSOCKET SIMULATION
// ============================================

class MockWebSocket {
    constructor(url) {
        this.url = url;
        this.readyState = 0; // CONNECTING
        this.listeners = {};

        // Simulate connection
        setTimeout(() => {
            this.readyState = 1; // OPEN
            this.trigger('open');
        }, 500);
    }

    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    removeEventListener(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    send(data) {
        console.log('WebSocket send:', data);
    }

    close() {
        this.readyState = 3; // CLOSED
        this.trigger('close');
    }

    trigger(event, data = {}) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                callback({ data: JSON.stringify(data) });
            });
        }
    }

    // Simulate receiving messages
    simulateMessage(type, payload) {
        this.trigger('message', { type, payload });
    }
}

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validate form field
 * @param {HTMLInputElement} input - Input element
 * @returns {Object} Validation result
 */
function validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.required;

    // Required check
    if (required && !value) {
        return {
            valid: false,
            message: `${input.labels[0]?.textContent || 'Field'} wajib diisi`
        };
    }

    // Type-specific validation
    if (type === 'tel' && value) {
        if (!validatePhoneNumber(value)) {
            return {
                valid: false,
                message: 'Format nomor HP tidak valid. Contoh: 081234567890'
            };
        }
    }

    // Minlength check
    if (input.minLength && value.length < input.minLength) {
        return {
            valid: false,
            message: `Minimal ${input.minLength} karakter`
        };
    }

    // Pattern check
    if (input.pattern && value) {
        const pattern = new RegExp(input.pattern);
        if (!pattern.test(value)) {
            return {
                valid: false,
                message: 'Format tidak valid'
            };
        }
    }

    return { valid: true };
}

/**
 * Show field error
 * @param {HTMLInputElement} input - Input element
 * @param {string} message - Error message
 */
function showFieldError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');

    const errorElement = document.getElementById(input.id + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

/**
 * Show field success
 * @param {HTMLInputElement} input - Input element
 */
function showFieldSuccess(input) {
    input.classList.remove('error');
    input.classList.add('success');

    const errorElement = document.getElementById(input.id + 'Error');
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

/**
 * Clear field validation
 * @param {HTMLInputElement} input - Input element
 */
function clearFieldValidation(input) {
    input.classList.remove('error', 'success');

    const errorElement = document.getElementById(input.id + 'Error');
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

// ============================================
// ANIMATION HELPERS
// ============================================

/**
 * Shake element animation
 * @param {HTMLElement} element - Element to shake
 */
function shakeElement(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'shake 0.3s ease-in-out';
    }, 10);

    setTimeout(() => {
        element.style.animation = '';
    }, 310);
}

/**
 * Smooth scroll to element
 * @param {HTMLElement} element - Element to scroll to
 */
function scrollToElement(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// ============================================
// LOADING STATES
// ============================================

/**
 * Set button loading state
 * @param {HTMLButtonElement} button - Button element
 * @param {boolean} loading - Loading state
 */
function setButtonLoading(button, loading) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto;"></span>';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

// ============================================
// WAKE LOCK (for QR display)
// ============================================

let wakeLock = null;

/**
 * Request screen wake lock
 */
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock active');

            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock released');
            });
        }
    } catch (err) {
        console.error('Wake Lock error:', err);
    }
}

/**
 * Release wake lock
 */
async function releaseWakeLock() {
    if (wakeLock) {
        try {
            await wakeLock.release();
            wakeLock = null;
        } catch (err) {
            console.error('Wake Lock release error:', err);
        }
    }
}

// ============================================
// PAGE VISIBILITY
// ============================================

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
        // Could pause some updates here
    } else {
        console.log('Page visible');
        // Resume updates
        if (wakeLock && wakeLock.released) {
            requestWakeLock();
        }
    }
});

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

/**
 * Log page load performance
 */
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }
    }
});

// ============================================
// EXPORT FOR MODULE SYSTEMS
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPhoneNumber,
        validatePhoneNumber,
        capitalizeWords,
        getCurrentTime,
        getRelativeTime,
        generateSessionId,
        setSession,
        getSession,
        clearSession,
        requestNotificationPermission,
        showNotification,
        playNotificationSound,
        vibrate,
        MockWebSocket,
        validateField,
        showFieldError,
        showFieldSuccess,
        clearFieldValidation,
        shakeElement,
        scrollToElement,
        setButtonLoading,
        requestWakeLock,
        releaseWakeLock
    };
}
