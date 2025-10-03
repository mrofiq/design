/**
 * Registration Form Logic
 * Visitor Interface - Waiting List SaaS Platform
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    let formData = {
        name: '',
        phone: '',
        partySize: null
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================

    const form = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const partySizeInput = document.getElementById('partySize');
    const partySizeButtons = document.querySelectorAll('.party-btn');
    const submitButton = document.getElementById('submitBtn');

    // ============================================
    // PARTY SIZE SELECTION
    // ============================================

    /**
     * Handle party size button click
     */
    function handlePartySizeClick(event) {
        const button = event.currentTarget;
        const size = button.dataset.size;

        // Don't handle 6+ here, it opens modal
        if (size === '6+') {
            return;
        }

        // Update active state
        partySizeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update form data
        formData.partySize = parseInt(size);
        partySizeInput.value = size;

        // Clear error
        clearFieldValidation(partySizeInput);
    }

    /**
     * Open party size modal
     */
    window.openPartySizeModal = function() {
        const modal = document.getElementById('partySizeModal');
        const customInput = document.getElementById('customPartySize');

        // Reset to 6
        customInput.value = 6;

        // Show modal
        modal.classList.remove('hidden');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    };

    /**
     * Close party size modal
     */
    window.closePartySizeModal = function() {
        const modal = document.getElementById('partySizeModal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    /**
     * Increment party size
     */
    window.incrementPartySize = function() {
        const input = document.getElementById('customPartySize');
        const current = parseInt(input.value);
        const max = parseInt(input.max);

        if (current < max) {
            input.value = current + 1;
        }
    };

    /**
     * Decrement party size
     */
    window.decrementPartySize = function() {
        const input = document.getElementById('customPartySize');
        const current = parseInt(input.value);
        const min = parseInt(input.min);

        if (current > min) {
            input.value = current - 1;
        }
    };

    /**
     * Confirm custom party size
     */
    window.confirmPartySize = function() {
        const customInput = document.getElementById('customPartySize');
        const size = parseInt(customInput.value);

        // Validate range
        if (size < 6 || size > 20) {
            alert('Jumlah orang harus antara 6-20');
            return;
        }

        // Update form data
        formData.partySize = size;
        partySizeInput.value = size;

        // Update 6+ button to show selected value
        const sixPlusBtn = document.querySelector('[data-size="6+"]');
        partySizeButtons.forEach(btn => btn.classList.remove('active'));
        sixPlusBtn.classList.add('active');
        sixPlusBtn.textContent = size;

        // Clear error
        clearFieldValidation(partySizeInput);

        // Close modal
        closePartySizeModal();
    };

    // ============================================
    // FORM VALIDATION
    // ============================================

    /**
     * Validate name field
     */
    function validateName() {
        const value = nameInput.value.trim();

        if (!value) {
            showFieldError(nameInput, 'Nama wajib diisi');
            return false;
        }

        if (value.length < 2) {
            showFieldError(nameInput, 'Nama minimal 2 karakter');
            return false;
        }

        showFieldSuccess(nameInput);
        return true;
    }

    /**
     * Validate phone field
     */
    function validatePhone() {
        const value = phoneInput.value.trim();

        if (!value) {
            showFieldError(phoneInput, 'Nomor HP wajib diisi');
            return false;
        }

        if (!validatePhoneNumber(value)) {
            showFieldError(phoneInput, 'Format nomor HP tidak valid. Contoh: 081234567890');
            return false;
        }

        showFieldSuccess(phoneInput);
        return true;
    }

    /**
     * Validate party size
     */
    function validatePartySize() {
        if (!formData.partySize) {
            showFieldError(partySizeInput, 'Silakan pilih jumlah orang');
            return false;
        }

        clearFieldValidation(partySizeInput);
        return true;
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        const nameValid = validateName();
        const phoneValid = validatePhone();
        const partySizeValid = validatePartySize();

        return nameValid && phoneValid && partySizeValid;
    }

    // ============================================
    // INPUT HANDLERS
    // ============================================

    /**
     * Handle name input
     */
    nameInput.addEventListener('input', (e) => {
        // Auto-capitalize
        const cursorPos = e.target.selectionStart;
        e.target.value = capitalizeWords(e.target.value);
        e.target.setSelectionRange(cursorPos, cursorPos);

        formData.name = e.target.value;
    });

    /**
     * Handle name blur
     */
    nameInput.addEventListener('blur', () => {
        validateName();
    });

    /**
     * Handle phone input
     */
    phoneInput.addEventListener('input', (e) => {
        // Remove non-digits
        let value = e.target.value.replace(/\D/g, '');

        // Limit length
        if (value.length > 13) {
            value = value.slice(0, 13);
        }

        e.target.value = value;
        formData.phone = value;
    });

    /**
     * Handle phone blur - format with hyphens
     */
    phoneInput.addEventListener('blur', (e) => {
        if (e.target.value) {
            e.target.value = formatPhoneNumber(e.target.value);
        }
        validatePhone();
    });

    /**
     * Handle phone focus - remove formatting
     */
    phoneInput.addEventListener('focus', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // ============================================
    // FORM SUBMISSION
    // ============================================

    /**
     * Handle form submission
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            // Shake form
            shakeElement(form);

            // Scroll to first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                scrollToElement(firstError);
                firstError.focus();
            }

            return;
        }

        // Get clean data
        const data = {
            name: formData.name.trim(),
            phone: formData.phone.replace(/\D/g, ''),
            partySize: formData.partySize
        };

        // Show loading state
        setButtonLoading(submitButton, true);

        try {
            // Simulate API call
            await submitRegistration(data);

            // Show success state
            submitButton.textContent = 'Berhasil!';
            submitButton.style.background = 'var(--color-success)';

            // Store session data
            const sessionId = generateSessionId();
            const queueNumber = Math.floor(Math.random() * 100) + 1;

            setSession('queueData', {
                sessionId,
                queueNumber: String(queueNumber).padStart(3, '0'),
                name: data.name,
                phone: data.phone,
                partySize: data.partySize,
                timestamp: new Date().toISOString()
            });

            // Redirect to status page
            setTimeout(() => {
                window.location.href = 'status.html';
            }, 500);

        } catch (error) {
            console.error('Registration error:', error);

            // Show error
            alert('Gagal mendaftar. Silakan coba lagi.');

            // Reset button
            setButtonLoading(submitButton, false);
        }
    });

    /**
     * Submit registration to API
     */
    async function submitRegistration(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 90% success rate for demo
                if (Math.random() > 0.1) {
                    resolve({
                        success: true,
                        sessionId: generateSessionId(),
                        queueNumber: Math.floor(Math.random() * 100) + 1
                    });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize page
     */
    function init() {
        // Add party size button listeners
        partySizeButtons.forEach(button => {
            if (button.dataset.size !== '6+') {
                button.addEventListener('click', handlePartySizeClick);
            }
        });

        // Auto-focus name input
        nameInput.focus();

        // Request notification permission
        requestNotificationPermission();

        // Check if coming from QR scan
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            console.warn('No token found - direct access');
        }

        // Update queue info (simulate real-time data)
        updateQueueInfo();
    }

    /**
     * Update queue info display
     */
    function updateQueueInfo() {
        // In real app, this would fetch from API
        const currentQueue = Math.floor(Math.random() * 20) + 5;
        const estimatedWait = currentQueue * 2;

        const queueText = document.querySelector('.info-text:first-child strong');
        const waitText = document.querySelector('.info-text:last-child strong');

        if (queueText) {
            queueText.textContent = `${currentQueue} orang`;
        }

        if (waitText) {
            waitText.textContent = `~${estimatedWait} menit`;
        }
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    /**
     * Handle keyboard shortcuts
     */
    document.addEventListener('keydown', (e) => {
        // Escape key closes modal
        if (e.key === 'Escape') {
            const modal = document.getElementById('partySizeModal');
            if (modal && !modal.classList.contains('hidden')) {
                closePartySizeModal();
            }
        }

        // Number keys (1-5) select party size
        if (e.key >= '1' && e.key <= '5' && !e.target.matches('input')) {
            const button = document.querySelector(`[data-size="${e.key}"]`);
            if (button) {
                button.click();
            }
        }
    });

    // ============================================
    // START APPLICATION
    // ============================================

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
