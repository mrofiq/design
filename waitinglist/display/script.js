/**
 * QR Display Screen - JavaScript
 * Waiting List SaaS Platform
 * Features: QR Generation, Auto-refresh, Wake Lock, Real-time Updates
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // QR Code settings
  qrRefreshInterval: 30000, // 30 seconds
  qrSize: 400, // Base size (responsive)
  qrErrorCorrectionLevel: 'H', // High error correction (30%)

  // Restaurant settings (normally from URL params)
  restaurantId: 'demo-restaurant-123',
  restaurantName: 'Restoran Bahagia',
  restaurantTagline: 'Fine Dining Restaurant',

  // API endpoints (demo mode uses mock data)
  apiBaseUrl: 'https://api.example.com',

  // Display settings
  enableWakeLock: true,
  enableAutoRefresh: true,

  // Demo mode (for prototype)
  demoMode: true
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
  currentToken: null,
  qrCodeInstance: null,
  refreshInterval: null,
  wakeLock: null,
  isOnline: true,
  isRefreshing: false,
  retryCount: 0,
  maxRetries: 3
};

// ============================================
// QR CODE GENERATION
// ============================================

/**
 * Generate a new QR code token
 * In production, this would come from the backend API
 */
function generateToken() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${CONFIG.restaurantId}-${timestamp}-${randomString}`;
}

/**
 * Create QR code URL
 */
function createQRUrl(token) {
  if (CONFIG.demoMode) {
    return `https://app.example.com/join/${token}`;
  }
  return `${CONFIG.apiBaseUrl}/join/${token}`;
}

/**
 * Generate and display QR code
 */
async function generateQRCode() {
  try {
    // Generate new token
    const token = generateToken();
    state.currentToken = token;

    // Create URL for QR code
    const qrUrl = createQRUrl(token);

    // Clear existing QR code
    const qrContainer = document.getElementById('qr-code');
    qrContainer.innerHTML = '';

    // Generate new QR code
    const qrCode = new QRCode(qrContainer, {
      text: qrUrl,
      width: CONFIG.qrSize,
      height: CONFIG.qrSize,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H // High error correction
    });

    state.qrCodeInstance = qrCode;
    state.retryCount = 0;

    console.log('QR Code generated:', qrUrl);

    return true;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return false;
  }
}

/**
 * Refresh QR code with animation
 */
async function refreshQRCode() {
  if (state.isRefreshing) return;

  state.isRefreshing = true;

  // Show refresh animation
  const qrContainer = document.querySelector('.qr-container');
  const refreshIndicator = document.getElementById('refresh-indicator');
  const autoRefreshBadge = document.getElementById('auto-refresh-badge');

  qrContainer.classList.add('refreshing');
  refreshIndicator.classList.add('active');
  autoRefreshBadge.classList.add('spinning');

  // Wait for animation
  await new Promise(resolve => setTimeout(resolve, 250));

  // Generate new QR code
  const success = await generateQRCode();

  // Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, 250));

  // Remove animations
  qrContainer.classList.remove('refreshing');

  setTimeout(() => {
    refreshIndicator.classList.remove('active');
    autoRefreshBadge.classList.remove('spinning');
  }, 1000);

  state.isRefreshing = false;

  if (!success) {
    handleQRError();
  }
}

// ============================================
// AUTO-REFRESH MANAGEMENT
// ============================================

/**
 * Start auto-refresh interval
 */
function startAutoRefresh() {
  if (!CONFIG.enableAutoRefresh) return;

  // Clear existing interval
  if (state.refreshInterval) {
    clearInterval(state.refreshInterval);
  }

  // Set new interval
  state.refreshInterval = setInterval(() => {
    refreshQRCode();
  }, CONFIG.qrRefreshInterval);

  console.log(`Auto-refresh started: every ${CONFIG.qrRefreshInterval / 1000}s`);
}

/**
 * Stop auto-refresh interval
 */
function stopAutoRefresh() {
  if (state.refreshInterval) {
    clearInterval(state.refreshInterval);
    state.refreshInterval = null;
  }

  const badge = document.getElementById('auto-refresh-badge');
  badge.classList.add('inactive');

  console.log('Auto-refresh stopped');
}

// ============================================
// WAKE LOCK (Keep Screen Awake)
// ============================================

/**
 * Request wake lock to keep screen on
 */
async function requestWakeLock() {
  if (!CONFIG.enableWakeLock) return;

  try {
    if ('wakeLock' in navigator) {
      state.wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock activated');

      // Re-request wake lock when visibility changes
      state.wakeLock.addEventListener('release', () => {
        console.log('Wake Lock released');
      });
    } else {
      console.warn('Wake Lock API not supported');
      // Fallback: use video method for iOS
      createWakeLockFallback();
    }
  } catch (err) {
    console.error('Wake Lock error:', err);
    createWakeLockFallback();
  }
}

/**
 * Fallback wake lock method (silent video)
 */
function createWakeLockFallback() {
  // Create a tiny silent video that loops
  const video = document.createElement('video');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('loop', '');
  video.style.display = 'none';

  // Create a 1-second silent video data URL
  video.src = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1MiByMjg1NCBlOWE1OTAzIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNyAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTMgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAA';

  document.body.appendChild(video);
  video.play().catch(() => {
    console.warn('Fallback wake lock failed');
  });
}

/**
 * Handle visibility change
 */
function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    requestWakeLock();
  }
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Show error state
 */
function showErrorState() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('main-display').style.display = 'none';
  document.getElementById('error-state').style.display = 'flex';

  stopAutoRefresh();
}

/**
 * Show main display
 */
function showMainDisplay() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'none';
  document.getElementById('main-display').style.display = 'flex';
}

/**
 * Handle QR generation error
 */
function handleQRError() {
  state.retryCount++;

  if (state.retryCount >= state.maxRetries) {
    console.error('Max retries reached, showing error state');
    showErrorState();
  } else {
    console.log(`Retry ${state.retryCount}/${state.maxRetries}`);
    setTimeout(() => {
      generateQRCode();
    }, 2000 * state.retryCount); // Exponential backoff
  }
}

/**
 * Retry loading QR code
 */
window.retryLoadQR = function() {
  state.retryCount = 0;
  document.getElementById('error-state').style.display = 'none';
  document.getElementById('loading-state').style.display = 'flex';

  setTimeout(() => {
    initializeDisplay();
  }, 500);
};

// ============================================
// CONNECTION STATUS
// ============================================

/**
 * Update connection status indicator
 */
function updateConnectionStatus(isOnline) {
  state.isOnline = isOnline;

  const statusDot = document.querySelector('.status-dot');
  const connectionStatus = document.getElementById('connection-status');

  if (isOnline) {
    statusDot.classList.remove('offline');
    statusDot.classList.add('online');
    connectionStatus.setAttribute('title', 'Terhubung');
  } else {
    statusDot.classList.remove('online');
    statusDot.classList.add('offline');
    connectionStatus.setAttribute('title', 'Terputus');
  }
}

/**
 * Handle online/offline events
 */
function setupConnectionMonitoring() {
  window.addEventListener('online', () => {
    console.log('Connection restored');
    updateConnectionStatus(true);

    // Restart auto-refresh
    if (CONFIG.enableAutoRefresh) {
      startAutoRefresh();
      refreshQRCode();
    }
  });

  window.addEventListener('offline', () => {
    console.log('Connection lost');
    updateConnectionStatus(false);
    stopAutoRefresh();
  });

  // Initial status
  updateConnectionStatus(navigator.onLine);
}

// ============================================
// RESPONSIVE QR SIZE
// ============================================

/**
 * Adjust QR code size based on screen size
 */
function adjustQRSize() {
  const width = window.innerWidth;
  const qrContainer = document.getElementById('qr-code');

  let size = CONFIG.qrSize;

  if (width >= 1200) {
    size = 600; // Large display
  } else if (width >= 1024) {
    size = 400; // Landscape tablet
  } else if (width >= 768) {
    size = 500; // Portrait tablet
  } else if (width >= 480) {
    size = 350; // Small tablet
  } else {
    size = 280; // Mobile
  }

  qrContainer.style.width = `${size}px`;
  qrContainer.style.height = `${size}px`;

  CONFIG.qrSize = size;
}

// ============================================
// FULLSCREEN MODE
// ============================================

/**
 * Enter fullscreen mode
 */
function enterFullscreen() {
  const elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

/**
 * Check for kiosk mode parameter
 */
function checkKioskMode() {
  const urlParams = new URLSearchParams(window.location.search);
  const kioskMode = urlParams.get('kiosk') === 'true';

  if (kioskMode) {
    // Auto-enter fullscreen after 1 second
    setTimeout(() => {
      enterFullscreen();
    }, 1000);

    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // F11 - Toggle fullscreen (allow default behavior)
    // R - Manual refresh
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      refreshQRCode();
    }

    // ESC - Exit fullscreen (allow default behavior)
  });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the display
 */
async function initializeDisplay() {
  console.log('Initializing QR Display...');

  // Adjust QR size
  adjustQRSize();

  // Generate initial QR code
  const success = await generateQRCode();

  if (!success) {
    handleQRError();
    return;
  }

  // Show main display
  setTimeout(() => {
    showMainDisplay();
  }, 500);

  // Start auto-refresh
  startAutoRefresh();

  // Request wake lock
  requestWakeLock();

  // Setup connection monitoring
  setupConnectionMonitoring();

  // Check for kiosk mode
  checkKioskMode();

  // Setup keyboard shortcuts
  setupKeyboardShortcuts();

  console.log('QR Display initialized successfully');
}

// ============================================
// EVENT LISTENERS
// ============================================

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDisplay);
} else {
  initializeDisplay();
}

// Handle visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// Handle resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    adjustQRSize();
    generateQRCode();
  }, 300);
});

// Handle page unload (release wake lock)
window.addEventListener('beforeunload', () => {
  if (state.wakeLock) {
    state.wakeLock.release();
  }

  stopAutoRefresh();
});

// ============================================
// DEMO MODE: Simulate connection changes
// ============================================

if (CONFIG.demoMode) {
  // Log demo mode status
  console.log('🎭 Running in DEMO MODE');
  console.log('📱 QR codes will be generated locally');
  console.log('🔄 Auto-refresh every 30 seconds');
  console.log('⌨️ Press R to manually refresh');
  console.log('🖥️ Add ?kiosk=true to URL for fullscreen mode');
}

// ============================================
// EXPORT FOR DEBUGGING
// ============================================

// Make some functions available globally for debugging
window.qrDisplay = {
  refreshQRCode,
  enterFullscreen,
  generateToken,
  state,
  config: CONFIG
};

console.log('💡 Debug commands available: window.qrDisplay');
