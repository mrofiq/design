/**
 * QUEUE MANAGEMENT
 * Real-time queue simulation and management functions
 */

// ============================================
// MOCK QUEUE DATA
// ============================================

const MOCK_NAMES = [
  'John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Johnson', 'Michael Brown',
  'Sarah Davis', 'David Lee', 'Emma Martinez', 'James Garcia', 'Lisa Anderson',
  'Robert Taylor', 'Maria Rodriguez', 'William Thomas', 'Jennifer White', 'Richard Moore'
];

const MOCK_PHONES = [
  '0812-3456-7890', '0813-2345-6789', '0814-3456-7890', '0815-4567-8901', '0816-5678-9012',
  '0817-6789-0123', '0818-7890-1234', '0819-8901-2345', '0821-9012-3456', '0822-0123-4567',
  '0823-1234-5678', '0852-2345-6789', '0853-3456-7890', '0856-4567-8901', '0857-5678-9012'
];

let queueData = [];
let queueIdCounter = 1;

/**
 * Generate mock queue data
 * @param {number} count - Number of queues to generate
 * @returns {Array} Array of queue objects
 */
function generateMockQueues(count = 15) {
  const queues = [];
  const now = new Date();

  const statuses = ['waiting', 'waiting', 'waiting', 'waiting', 'called', 'waiting'];

  for (let i = 0; i < count; i++) {
    const timeOffset = i * 2; // 2 minutes apart
    const timestamp = new Date(now.getTime() - timeOffset * 60000);

    queues.push({
      id: queueIdCounter++,
      no: i + 1,
      nama: MOCK_NAMES[i % MOCK_NAMES.length],
      hp: MOCK_PHONES[i % MOCK_PHONES.length],
      jumlah: Math.floor(Math.random() * 6) + 1,
      waktu: formatTime(timestamp),
      timestamp: timestamp,
      status: statuses[i % statuses.length]
    });
  }

  return queues;
}

// Initialize with mock data
queueData = generateMockQueues(15);

// ============================================
// QUEUE RENDERING
// ============================================

/**
 * Render queue table
 * @param {Array} queues - Array of queue objects
 * @param {HTMLElement} container - Container element
 */
function renderQueueTable(queues, container) {
  if (!container) return;

  // Check if mobile
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    renderQueueCards(queues, container);
  } else {
    renderQueueTableDesktop(queues, container);
  }
}

/**
 * Render queue table (desktop)
 * @param {Array} queues - Array of queue objects
 * @param {HTMLElement} container - Container element
 */
function renderQueueTableDesktop(queues, container) {
  const tableHTML = `
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="sortable" data-sort="no">No <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="nama">Nama <span class="sort-icon">↕</span></th>
            <th>Nomor HP</th>
            <th class="sortable" data-sort="jumlah">Jumlah <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="waktu">Waktu <span class="sort-icon">↕</span></th>
            <th class="sortable" data-sort="status">Status <span class="sort-icon">↕</span></th>
            <th class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${queues.map(queue => `
            <tr data-queue-id="${queue.id}" class="queue-row">
              <td><strong>#${String(queue.no).padStart(3, '0')}</strong></td>
              <td>${queue.nama}</td>
              <td>${queue.hp}</td>
              <td>👥 ${queue.jumlah} orang</td>
              <td>🕒 ${queue.waktu} WIB</td>
              <td>${getStatusBadge(queue.status)}</td>
              <td class="text-center">
                <div class="dropdown-wrapper" style="position: relative; display: inline-block;">
                  <button class="btn btn-ghost btn-icon btn-sm" onclick="toggleQueueActions(${queue.id})" aria-label="Actions">
                    ⋮
                  </button>
                  <div class="dropdown-menu hidden" id="actions-${queue.id}">
                    ${getActionButtons(queue)}
                  </div>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = tableHTML;

  // Add sort listeners
  container.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const sortBy = th.dataset.sort;
      sortTable(sortBy);
    });
  });
}

/**
 * Render queue cards (mobile)
 * @param {Array} queues - Array of queue objects
 * @param {HTMLElement} container - Container element
 */
function renderQueueCards(queues, container) {
  const cardsHTML = `
    <div class="queue-cards" style="display: flex; flex-direction: column; gap: 16px;">
      ${queues.map(queue => `
        <div class="card" data-queue-id="${queue.id}">
          <div class="card-content" style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <strong style="font-size: 18px;">#${String(queue.no).padStart(3, '0')}</strong>
              ${getStatusBadge(queue.status)}
            </div>

            <h5 style="margin-bottom: 8px;">${queue.nama}</h5>

            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: var(--color-neutral-600); margin-bottom: 16px;">
              <div>📞 ${queue.hp}</div>
              <div>👥 ${queue.jumlah} orang</div>
              <div>🕒 ${queue.waktu} WIB</div>
            </div>

            <div style="display: flex; gap: 8px;">
              ${getActionButtonsMobile(queue)}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = cardsHTML;
}

/**
 * Get status badge HTML
 * @param {string} status - Queue status
 * @returns {string} Badge HTML
 */
function getStatusBadge(status) {
  const badges = {
    waiting: '<span class="badge badge-waiting">🟡 Menunggu</span>',
    called: '<span class="badge badge-called">🟢 Dipanggil</span>',
    completed: '<span class="badge badge-completed">✓ Selesai</span>'
  };

  return badges[status] || badges.waiting;
}

/**
 * Get action buttons for dropdown
 * @param {Object} queue - Queue object
 * @returns {string} Action buttons HTML
 */
function getActionButtons(queue) {
  let buttons = '';

  if (queue.status === 'waiting') {
    buttons += `<button class="btn btn-sm" style="width: 100%; justify-content: flex-start; background: var(--color-info); color: white;" onclick="callQueue(${queue.id})">🔔 Panggil</button>`;
  }

  if (queue.status === 'called') {
    buttons += `<button class="btn btn-success btn-sm" style="width: 100%; justify-content: flex-start;" onclick="completeQueue(${queue.id})">✓ Selesai</button>`;
  }

  if (queue.status !== 'completed') {
    buttons += `<button class="btn btn-destructive btn-sm" style="width: 100%; justify-content: flex-start; margin-top: 4px;" onclick="cancelQueue(${queue.id})">✗ Batalkan</button>`;
  }

  return buttons;
}

/**
 * Get action buttons for mobile cards
 * @param {Object} queue - Queue object
 * @returns {string} Action buttons HTML
 */
function getActionButtonsMobile(queue) {
  let buttons = '';

  if (queue.status === 'waiting') {
    buttons += `<button class="btn btn-sm" style="flex: 1; background: var(--color-info); color: white;" onclick="callQueue(${queue.id})">Panggil</button>`;
  }

  if (queue.status === 'called') {
    buttons += `<button class="btn btn-success btn-sm" style="flex: 1;" onclick="completeQueue(${queue.id})">Selesai</button>`;
  }

  if (queue.status !== 'completed') {
    buttons += `<button class="btn btn-destructive btn-sm" style="flex: 1;" onclick="cancelQueue(${queue.id})">Batalkan</button>`;
  }

  return buttons;
}

// ============================================
// QUEUE ACTIONS
// ============================================

/**
 * Toggle dropdown actions
 * @param {number} queueId - Queue ID
 */
function toggleQueueActions(queueId) {
  const dropdown = document.getElementById(`actions-${queueId}`);
  if (!dropdown) return;

  // Close other dropdowns
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu.id !== `actions-${queueId}`) {
      menu.classList.add('hidden');
    }
  });

  dropdown.classList.toggle('hidden');

  // Position dropdown
  dropdown.style.cssText = `
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 4px;
    background: white;
    border: 1px solid var(--color-neutral-200);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: 8px;
    min-width: 150px;
    z-index: 1000;
  `;
}

/**
 * Call queue (change status to called)
 * @param {number} queueId - Queue ID
 */
function callQueue(queueId) {
  const queue = queueData.find(q => q.id === queueId);
  if (!queue) return;

  updateQueueStatus(queueId, 'called');
  refreshQueueDisplay();

  showToast(`Antrian #${String(queue.no).padStart(3, '0')} - ${queue.nama} dipanggil`, 'success');

  // Optional: Play notification sound
  if (getItem('notification-sound', true)) {
    playNotificationSound();
  }
}

/**
 * Complete queue (change status to completed)
 * @param {number} queueId - Queue ID
 */
function completeQueue(queueId) {
  const queue = queueData.find(q => q.id === queueId);
  if (!queue) return;

  // Show confirmation dialog
  showConfirmDialog(
    '✓ Selesaikan Antrian?',
    `Antrian untuk <strong>${queue.nama}</strong> (#${String(queue.no).padStart(3, '0')}) telah dilayani?`,
    () => {
      updateQueueStatus(queueId, 'completed');
      refreshQueueDisplay();
      showToast('Antrian selesai', 'success');
    }
  );
}

/**
 * Cancel queue
 * @param {number} queueId - Queue ID
 */
function cancelQueue(queueId) {
  const queue = queueData.find(q => q.id === queueId);
  if (!queue) return;

  // Show confirmation dialog
  showConfirmDialog(
    '⚠️ Batalkan Antrian?',
    `
      Apakah Anda yakin ingin membatalkan antrian untuk:<br><br>
      <strong>${queue.nama}</strong> (#${String(queue.no).padStart(3, '0')})<br>
      ${queue.jumlah} orang<br><br>
      Tindakan ini tidak dapat dibatalkan.
    `,
    () => {
      // Remove from queue
      queueData = queueData.filter(q => q.id !== queueId);
      refreshQueueDisplay();
      showToast('Antrian dibatalkan', 'info');
    },
    'destructive'
  );
}

/**
 * Update queue status
 * @param {number} queueId - Queue ID
 * @param {string} newStatus - New status
 */
function updateQueueStatus(queueId, newStatus) {
  const queue = queueData.find(q => q.id === queueId);
  if (!queue) return;

  queue.status = newStatus;

  // Animate row
  const row = document.querySelector(`[data-queue-id="${queueId}"]`);
  if (row) {
    row.style.animation = 'yellow-flash 500ms ease-out';
    setTimeout(() => {
      row.style.animation = '';
    }, 500);
  }
}

// ============================================
// TABLE OPERATIONS
// ============================================

let currentSort = { column: 'no', direction: 'asc' };

/**
 * Sort table by column
 * @param {string} column - Column to sort by
 */
function sortTable(column) {
  // Toggle direction if same column
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.direction = 'asc';
  }

  // Sort queue data
  queueData.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];

    // Handle different data types
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  refreshQueueDisplay();
}

/**
 * Search queues by name
 * @param {string} query - Search query
 * @returns {Array} Filtered queues
 */
function searchQueues(query) {
  if (!query || query.trim() === '') {
    return queueData;
  }

  const lowercaseQuery = query.toLowerCase().trim();

  return queueData.filter(queue =>
    queue.nama.toLowerCase().includes(lowercaseQuery) ||
    queue.hp.includes(lowercaseQuery)
  );
}

/**
 * Filter queues by status
 * @param {string} status - Status to filter by
 * @returns {Array} Filtered queues
 */
function filterByStatus(status) {
  if (!status || status === 'all') {
    return queueData;
  }

  return queueData.filter(queue => queue.status === status);
}

// ============================================
// STATISTICS
// ============================================

/**
 * Calculate queue statistics
 * @param {Array} queues - Array of queue objects
 * @returns {Object} Statistics object
 */
function calculateStats(queues = queueData) {
  const active = queues.filter(q => q.status === 'waiting' || q.status === 'called').length;
  const completed = queues.filter(q => q.status === 'completed').length;

  // Calculate average wait time
  const completedQueues = queues.filter(q => q.status === 'completed');
  let avgWait = 0;

  if (completedQueues.length > 0) {
    const totalWait = completedQueues.reduce((sum, q) => sum + 18, 0); // Mock: 18 minutes average
    avgWait = Math.round(totalWait / completedQueues.length);
  }

  return {
    active,
    completed,
    avgWait: avgWait > 0 ? `${avgWait}min` : '-'
  };
}

/**
 * Update stats display
 */
function updateStatsDisplay() {
  const stats = calculateStats();

  const activeEl = document.getElementById('stat-active');
  const completedEl = document.getElementById('stat-completed');
  const avgEl = document.getElementById('stat-avg');

  if (activeEl) activeEl.textContent = stats.active;
  if (completedEl) completedEl.textContent = stats.completed;
  if (avgEl) avgEl.textContent = stats.avgWait;
}

// ============================================
// REAL-TIME SIMULATION
// ============================================

let simulationInterval = null;

/**
 * Start real-time simulation
 */
function startSimulation() {
  if (simulationInterval) return;

  simulationInterval = setInterval(() => {
    simulateNewQueue();
  }, 10000); // Every 10 seconds
}

/**
 * Stop real-time simulation
 */
function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

/**
 * Simulate new queue arriving
 */
function simulateNewQueue() {
  const now = new Date();
  const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
  const randomPhone = MOCK_PHONES[Math.floor(Math.random() * MOCK_PHONES.length)];

  const newQueue = {
    id: queueIdCounter++,
    no: queueData.length + 1,
    nama: randomName,
    hp: randomPhone,
    jumlah: Math.floor(Math.random() * 6) + 1,
    waktu: formatTime(now),
    timestamp: now,
    status: 'waiting'
  };

  queueData.unshift(newQueue);
  refreshQueueDisplay();

  // Highlight new row
  setTimeout(() => {
    const row = document.querySelector(`[data-queue-id="${newQueue.id}"]`);
    if (row) {
      row.style.animation = 'yellow-flash 1s ease-out';
    }
  }, 100);

  // Play sound if enabled
  if (getItem('notification-sound', true)) {
    playNotificationSound();
  }

  showToast(`Antrian baru: ${randomName}`, 'info');
}

// ============================================
// DISPLAY REFRESH
// ============================================

/**
 * Refresh queue display
 */
function refreshQueueDisplay() {
  const container = document.getElementById('queue-container');
  if (container) {
    renderQueueTable(queueData, container);
  }

  updateStatsDisplay();
}

// ============================================
// CONFIRMATION DIALOG
// ============================================

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {Function} onConfirm - Callback on confirm
 * @param {string} type - Dialog type (default or destructive)
 */
function showConfirmDialog(title, message, onConfirm, type = 'default') {
  const dialog = document.createElement('div');
  dialog.className = 'modal-overlay';
  dialog.innerHTML = `
    <div class="modal" style="max-width: 400px;">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
      </div>
      <div class="modal-content">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="cancel-btn">Batal</button>
        <button class="btn ${type === 'destructive' ? 'btn-destructive' : 'btn-primary'}" id="confirm-btn">
          ${type === 'destructive' ? 'Ya, Batalkan' : 'Ya, Selesai'}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  const cancelBtn = dialog.querySelector('#cancel-btn');
  const confirmBtn = dialog.querySelector('#confirm-btn');

  const close = () => {
    dialog.style.animation = 'fade-out 300ms ease-out';
    setTimeout(() => dialog.remove(), 300);
  };

  cancelBtn.addEventListener('click', close);
  confirmBtn.addEventListener('click', () => {
    onConfirm();
    close();
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
}

// ============================================
// NOTIFICATION SOUND
// ============================================

/**
 * Play notification sound
 */
function playNotificationSound() {
  // Create audio context for beep sound
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Audio not supported');
  }
}

// Close dropdowns when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrapper')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden');
      });
    }
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    queueData,
    generateMockQueues,
    renderQueueTable,
    callQueue,
    completeQueue,
    cancelQueue,
    updateQueueStatus,
    sortTable,
    searchQueues,
    filterByStatus,
    calculateStats,
    startSimulation,
    stopSimulation,
    refreshQueueDisplay
  };
}
