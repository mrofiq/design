/**
 * Queue Status Page Logic
 * Visitor Interface - Waiting List SaaS Platform
 */

(function() {
    'use strict';

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    let queueData = null;
    let websocket = null;
    let updateInterval = null;
    let isCalled = false;

    // ============================================
    // DOM ELEMENTS
    // ============================================

    const queueNumberDisplay = document.getElementById('queueNumber');
    const queueAheadDisplay = document.getElementById('queueAhead');
    const waitTimeDisplay = document.getElementById('waitTime');
    const lastUpdatedDisplay = document.getElementById('lastUpdated');
    const connectionDot = document.getElementById('connectionDot');
    const connectionText = document.getElementById('connectionText');

    const waitingState = document.getElementById('waitingState');
    const calledState = document.getElementById('calledState');

    // ============================================
    // WEBSOCKET CONNECTION
    // ============================================

    /**
     * Initialize WebSocket connection
     */
    function initWebSocket() {
        // Use mock WebSocket for demo
        websocket = new MockWebSocket('wss://api.example.com/queue');

        websocket.addEventListener('open', handleWebSocketOpen);
        websocket.addEventListener('message', handleWebSocketMessage);
        websocket.addEventListener('close', handleWebSocketClose);
        websocket.addEventListener('error', handleWebSocketError);
    }

    /**
     * Handle WebSocket open
     */
    function handleWebSocketOpen() {
        console.log('WebSocket connected');
        updateConnectionStatus('connected');

        // Join queue room
        websocket.send(JSON.stringify({
            type: 'join',
            room: `queue:${queueData.sessionId}`
        }));

        // Start demo updates
        startDemoUpdates();
    }

    /**
     * Handle WebSocket message
     */
    function handleWebSocketMessage(event) {
        try {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case 'queue:updated':
                    handleQueueUpdate(message.payload);
                    break;

                case 'queue:called':
                    handleQueueCalled(message.payload);
                    break;

                case 'queue:cancelled':
                    handleQueueCancelled(message.payload);
                    break;

                default:
                    console.log('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    }

    /**
     * Handle WebSocket close
     */
    function handleWebSocketClose() {
        console.log('WebSocket disconnected');
        updateConnectionStatus('disconnected');

        // Try to reconnect after 5 seconds
        setTimeout(() => {
            updateConnectionStatus('reconnecting');
            initWebSocket();
        }, 5000);
    }

    /**
     * Handle WebSocket error
     */
    function handleWebSocketError(error) {
        console.error('WebSocket error:', error);
        updateConnectionStatus('disconnected');
    }

    /**
     * Update connection status indicator
     */
    function updateConnectionStatus(status) {
        connectionDot.className = 'connection-dot';

        switch (status) {
            case 'connected':
                connectionDot.classList.add('connected');
                connectionText.textContent = 'Terhubung';
                break;

            case 'reconnecting':
                connectionDot.classList.add('reconnecting');
                connectionText.textContent = 'Menghubungkan...';
                break;

            case 'disconnected':
                connectionDot.classList.add('disconnected');
                connectionText.textContent = 'Terputus';
                break;
        }
    }

    // ============================================
    // QUEUE UPDATE HANDLERS
    // ============================================

    /**
     * Handle queue position update
     */
    function handleQueueUpdate(data) {
        const { queueAhead, estimatedWait } = data;

        // Animate queue ahead number change
        animateNumberChange(queueAheadDisplay, queueAhead);

        // Animate wait time change
        animateNumberChange(waitTimeDisplay, estimatedWait);

        // Update wait time card color based on time
        updateWaitTimeColor(estimatedWait);

        // Update last updated time
        updateLastUpdatedTime();
    }

    /**
     * Handle queue called
     */
    function handleQueueCalled(data) {
        if (isCalled) return;
        isCalled = true;

        console.log('Queue called!');

        // Play notification sound
        playNotificationSound();

        // Vibrate
        vibrate([200, 100, 200, 100, 200]);

        // Show browser notification if page not focused
        if (document.hidden) {
            showNotification('Giliran Anda - Restoran Bahagia', {
                body: `Antrian ${queueData.queueNumber} dipanggil. Silakan datang ke restoran.`,
                requireInteraction: true
            });
        }

        // Show called state
        showCalledState();
    }

    /**
     * Handle queue cancelled
     */
    function handleQueueCancelled(data) {
        alert('Antrian Anda telah dibatalkan oleh restoran.');
        clearSession();
        window.location.href = 'index.html';
    }

    /**
     * Show called state
     */
    function showCalledState() {
        // Update queue number in called state
        const calledQueueNumber = document.getElementById('calledQueueNumber');
        calledQueueNumber.textContent = queueData.queueNumber;

        // Switch states
        waitingState.classList.add('hidden');
        calledState.classList.remove('hidden');

        // Change page theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#F59E0B');
        }
    }

    /**
     * Acknowledge call
     */
    window.acknowledgeCall = function() {
        // Send acknowledgment to server
        if (websocket && websocket.readyState === 1) {
            websocket.send(JSON.stringify({
                type: 'acknowledge',
                sessionId: queueData.sessionId
            }));
        }

        // Update UI
        const acknowledgeBtn = document.querySelector('.btn-acknowledge');
        acknowledgeBtn.textContent = 'Menuju Restoran...';
        acknowledgeBtn.style.background = 'var(--color-success)';
        acknowledgeBtn.disabled = true;

        // Clear session after a delay
        setTimeout(() => {
            clearSession();
            // In real app, might redirect to feedback page
        }, 2000);
    };

    // ============================================
    // CANCEL QUEUE
    // ============================================

    /**
     * Show cancel confirmation dialog
     */
    window.showCancelDialog = function() {
        const dialog = document.getElementById('cancelDialog');
        const queueNumberSpan = document.getElementById('cancelQueueNumber');

        queueNumberSpan.textContent = '#' + queueData.queueNumber;

        dialog.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    /**
     * Close cancel dialog
     */
    window.closeCancelDialog = function() {
        const dialog = document.getElementById('cancelDialog');
        dialog.classList.add('hidden');
        document.body.style.overflow = '';
    };

    /**
     * Confirm cancellation
     */
    window.confirmCancel = async function() {
        closeCancelDialog();

        try {
            // Send cancel request
            if (websocket && websocket.readyState === 1) {
                websocket.send(JSON.stringify({
                    type: 'cancel',
                    sessionId: queueData.sessionId
                }));
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Redirect to cancelled page
            window.location.href = 'cancelled.html';

        } catch (error) {
            console.error('Cancel error:', error);
            alert('Gagal membatalkan antrian. Silakan coba lagi.');
        }
    };

    // ============================================
    // UI UPDATES
    // ============================================

    /**
     * Animate number change
     */
    function animateNumberChange(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;

        if (currentValue === newValue) return;

        // Add transition animation
        element.style.transition = 'all 0.3s ease-out';
        element.style.transform = 'scale(1.1)';
        element.style.color = 'var(--color-success)';

        // Update value
        element.textContent = newValue;

        // Reset animation
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    }

    /**
     * Update wait time card color
     */
    function updateWaitTimeColor(minutes) {
        const card = waitTimeDisplay.closest('.wait-time-card');

        if (minutes < 5) {
            card.style.background = 'var(--color-success)';
            card.style.borderColor = 'var(--color-success)';
            waitTimeDisplay.style.color = 'white';
        } else if (minutes < 15) {
            card.style.background = 'var(--color-primary-100)';
            card.style.borderColor = 'var(--color-primary-600)';
            waitTimeDisplay.style.color = 'var(--color-primary-700)';
        } else {
            card.style.background = 'var(--color-warning-100)';
            card.style.borderColor = 'var(--color-warning-600)';
            waitTimeDisplay.style.color = 'var(--color-warning-700)';
        }
    }

    /**
     * Update last updated time
     */
    function updateLastUpdatedTime() {
        lastUpdatedDisplay.textContent = getCurrentTime();
    }

    // ============================================
    // DEMO SIMULATION
    // ============================================

    /**
     * Start demo queue updates
     */
    function startDemoUpdates() {
        let queueAhead = 12;
        let updateCount = 0;

        // Update every 10 seconds
        updateInterval = setInterval(() => {
            updateCount++;

            // Decrease queue ahead
            if (queueAhead > 0 && Math.random() > 0.3) {
                queueAhead--;
            }

            // Calculate wait time
            const estimatedWait = Math.max(queueAhead * 1.5, 2);

            // Send update via WebSocket
            if (websocket) {
                websocket.simulateMessage('queue:updated', {
                    queueAhead,
                    estimatedWait: Math.round(estimatedWait)
                });
            }

            // After 30 seconds, simulate being called
            if (updateCount >= 3 && !isCalled) {
                setTimeout(() => {
                    if (websocket && !isCalled) {
                        websocket.simulateMessage('queue:called', {
                            queueNumber: queueData.queueNumber
                        });
                    }
                }, 5000);
            }

        }, 10000);
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize page
     */
    function init() {
        // Load queue data from session
        queueData = getSession('queueData');

        if (!queueData) {
            // No session data - redirect to home
            alert('Sesi tidak ditemukan. Silakan scan QR code kembali.');
            window.location.href = 'index.html';
            return;
        }

        // Display queue number
        queueNumberDisplay.textContent = '#' + queueData.queueNumber;

        // Initialize WebSocket
        initWebSocket();

        // Update last updated time
        updateLastUpdatedTime();

        // Request notification permission
        requestNotificationPermission();

        // Prevent sleep on mobile
        requestWakeLock();

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            if (websocket) {
                websocket.close();
            }
            if (updateInterval) {
                clearInterval(updateInterval);
            }
            releaseWakeLock();
        });
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    /**
     * Handle keyboard shortcuts
     */
    document.addEventListener('keydown', (e) => {
        // Escape key closes dialog
        if (e.key === 'Escape') {
            const dialog = document.getElementById('cancelDialog');
            if (dialog && !dialog.classList.contains('hidden')) {
                closeCancelDialog();
            }
        }
    });

    // ============================================
    // PULL TO REFRESH
    // ============================================

    let startY = 0;
    let isPulling = false;

    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].pageY;
            isPulling = true;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!isPulling) return;

        const currentY = e.touches[0].pageY;
        const pullDistance = currentY - startY;

        if (pullDistance > 100) {
            // Trigger refresh
            console.log('Pull to refresh triggered');
            // In real app, would refresh data
        }
    });

    document.addEventListener('touchend', () => {
        isPulling = false;
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
