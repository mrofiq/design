/**
 * Developer Report Dashboard - WebSocket Manager
 * Version: 1.0
 * Last Updated: 2025-10-03
 *
 * Manages WebSocket connections with:
 * - Connection lifecycle (connect, disconnect, reconnect)
 * - Auto-reconnect with exponential backoff
 * - Heartbeat/ping mechanism
 * - Event subscription system
 * - Message queue for offline messages
 * - Connection status events
 */

class WebSocketManager {
  constructor(options = {}) {
    // Configuration
    this.url = options.url || this.getWebSocketUrl();
    this.protocols = options.protocols || [];
    this.autoConnect = options.autoConnect !== false;
    this.reconnectEnabled = options.reconnectEnabled !== false;
    this.maxReconnectAttempts = options.maxReconnectAttempts || Infinity;
    this.reconnectInterval = options.reconnectInterval || 1000; // Initial reconnect interval
    this.maxReconnectInterval = options.maxReconnectInterval || 30000; // Max 30 seconds
    this.heartbeatInterval = options.heartbeatInterval || 30000; // 30 seconds
    this.heartbeatTimeout = options.heartbeatTimeout || 5000; // 5 seconds
    this.debug = options.debug || false;

    // State
    this.ws = null;
    this.connectionState = 'disconnected'; // disconnected, connecting, connected, reconnecting
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.heartbeatTimeoutTimer = null;
    this.messageQueue = [];
    this.maxQueueSize = options.maxQueueSize || 100;

    // Event listeners
    this.listeners = {
      open: [],
      close: [],
      error: [],
      message: [],
      reconnecting: [],
      reconnected: [],
      stateChange: []
    };

    // Message handlers by event type
    this.eventHandlers = new Map();

    // Auto-connect if enabled
    if (this.autoConnect) {
      this.connect();
    }
  }

  /**
   * Get WebSocket URL from current page URL
   * @returns {string} WebSocket URL
   */
  getWebSocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  /**
   * Connect to WebSocket server
   * @returns {Promise} Resolves when connected
   */
  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      this.log('Already connected or connecting');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.log(`Connecting to ${this.url}...`);
        this.setConnectionState('connecting');

        // Create WebSocket connection
        this.ws = new WebSocket(this.url, this.protocols);

        // Set up event handlers
        this.ws.onopen = (event) => {
          this.handleOpen(event);
          resolve();
        };

        this.ws.onclose = (event) => {
          this.handleClose(event);
        };

        this.ws.onerror = (event) => {
          this.handleError(event);
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

      } catch (error) {
        this.log('Connection error:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   * @param {number} code - Close code
   * @param {string} reason - Close reason
   */
  disconnect(code = 1000, reason = 'Client disconnect') {
    this.reconnectEnabled = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.log('Disconnecting...');
      this.ws.close(code, reason);
    }
  }

  /**
   * Reconnect to WebSocket server
   */
  reconnect() {
    if (this.connectionState === 'connecting' || this.connectionState === 'reconnecting') {
      return;
    }

    if (!this.reconnectEnabled) {
      this.log('Reconnect is disabled');
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.log('Max reconnect attempts reached');
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    // Calculate exponential backoff delay
    const delay = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts),
      this.maxReconnectInterval
    );

    this.reconnectAttempts++;
    this.setConnectionState('reconnecting');

    this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`);
    this.emit('reconnecting', { attempt: this.reconnectAttempts, delay });

    this.reconnectTimer = setTimeout(() => {
      this.connect()
        .then(() => {
          this.reconnectAttempts = 0;
          this.emit('reconnected');
        })
        .catch(() => {
          this.reconnect();
        });
    }, delay);
  }

  /**
   * Send message to server
   * @param {string|Object} data - Data to send
   * @returns {boolean} Whether message was sent
   */
  send(data) {
    if (!this.isConnected()) {
      this.log('Not connected, queueing message');
      this.queueMessage(data);
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      this.log('Sent:', data);
      return true;
    } catch (error) {
      this.log('Send error:', error);
      this.queueMessage(data);
      return false;
    }
  }

  /**
   * Queue message for later sending
   * @param {*} data - Data to queue
   */
  queueMessage(data) {
    if (this.messageQueue.length >= this.maxQueueSize) {
      this.log('Message queue full, removing oldest message');
      this.messageQueue.shift();
    }
    this.messageQueue.push(data);
  }

  /**
   * Send queued messages
   */
  sendQueuedMessages() {
    if (this.messageQueue.length === 0) return;

    this.log(`Sending ${this.messageQueue.length} queued messages`);

    const queue = [...this.messageQueue];
    this.messageQueue = [];

    queue.forEach(data => {
      if (!this.send(data)) {
        // If send fails, message will be re-queued
        break;
      }
    });
  }

  /**
   * Subscribe to event type
   * @param {string} eventType - Event type to subscribe to
   * @param {Function} handler - Handler function
   */
  subscribe(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType).push(handler);
    this.log(`Subscribed to event: ${eventType}`);
  }

  /**
   * Unsubscribe from event type
   * @param {string} eventType - Event type to unsubscribe from
   * @param {Function} handler - Handler function to remove
   */
  unsubscribe(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) return;

    const handlers = this.eventHandlers.get(eventType);
    const index = handlers.indexOf(handler);

    if (index !== -1) {
      handlers.splice(index, 1);
      this.log(`Unsubscribed from event: ${eventType}`);
    }

    if (handlers.length === 0) {
      this.eventHandlers.delete(eventType);
    }
  }

  /**
   * Start heartbeat mechanism
   */
  startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.log('Sending heartbeat');
        this.send({ type: 'ping', timestamp: Date.now() });

        // Set timeout to check for pong response
        this.heartbeatTimeoutTimer = setTimeout(() => {
          this.log('Heartbeat timeout, connection may be dead');
          this.ws.close(4000, 'Heartbeat timeout');
        }, this.heartbeatTimeout);
      }
    }, this.heartbeatInterval);
  }

  /**
   * Stop heartbeat mechanism
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  /**
   * Handle WebSocket open event
   * @param {Event} event - Open event
   */
  handleOpen(event) {
    this.log('Connected');
    this.setConnectionState('connected');
    this.reconnectAttempts = 0;

    // Start heartbeat
    this.startHeartbeat();

    // Send queued messages
    this.sendQueuedMessages();

    // Emit open event
    this.emit('open', event);
  }

  /**
   * Handle WebSocket close event
   * @param {CloseEvent} event - Close event
   */
  handleClose(event) {
    this.log(`Disconnected (code: ${event.code}, reason: ${event.reason})`);
    this.setConnectionState('disconnected');

    // Stop heartbeat
    this.stopHeartbeat();

    // Emit close event
    this.emit('close', event);

    // Attempt reconnection if enabled and not a normal closure
    if (this.reconnectEnabled && event.code !== 1000) {
      this.reconnect();
    }
  }

  /**
   * Handle WebSocket error event
   * @param {Event} event - Error event
   */
  handleError(event) {
    this.log('Error:', event);
    this.emit('error', event);
  }

  /**
   * Handle WebSocket message event
   * @param {MessageEvent} event - Message event
   */
  handleMessage(event) {
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      this.log('Received:', data);

      // Handle pong response
      if (data.type === 'pong') {
        if (this.heartbeatTimeoutTimer) {
          clearTimeout(this.heartbeatTimeoutTimer);
          this.heartbeatTimeoutTimer = null;
        }
        return;
      }

      // Emit message event
      this.emit('message', data);

      // Handle event-specific handlers
      if (data.type && this.eventHandlers.has(data.type)) {
        const handlers = this.eventHandlers.get(data.type);
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            this.log('Handler error:', error);
          }
        });
      }

    } catch (error) {
      this.log('Message parse error:', error);
    }
  }

  /**
   * Set connection state
   * @param {string} state - New state
   */
  setConnectionState(state) {
    const oldState = this.connectionState;
    this.connectionState = state;
    this.log(`State: ${oldState} -> ${state}`);
    this.emit('stateChange', { from: oldState, to: state });
  }

  /**
   * Check if connected
   * @returns {boolean} Whether connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Check if connecting
   * @returns {boolean} Whether connecting
   */
  isConnecting() {
    return this.ws && this.ws.readyState === WebSocket.CONNECTING;
  }

  /**
   * Get connection state
   * @returns {string} Connection state
   */
  getConnectionState() {
    return this.connectionState;
  }

  /**
   * Get ready state
   * @returns {number} WebSocket ready state
   */
  getReadyState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  /**
   * Register event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * Unregister event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback);
      if (index !== -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          this.log('Listener error:', error);
        }
      });
    }
  }

  /**
   * Clear message queue
   */
  clearQueue() {
    this.messageQueue = [];
  }

  /**
   * Get message queue
   * @returns {Array} Message queue
   */
  getQueue() {
    return [...this.messageQueue];
  }

  /**
   * Get queue size
   * @returns {number} Queue size
   */
  getQueueSize() {
    return this.messageQueue.length;
  }

  /**
   * Enable reconnection
   */
  enableReconnect() {
    this.reconnectEnabled = true;
  }

  /**
   * Disable reconnection
   */
  disableReconnect() {
    this.reconnectEnabled = false;
  }

  /**
   * Reset reconnect attempts
   */
  resetReconnectAttempts() {
    this.reconnectAttempts = 0;
  }

  /**
   * Logging utility
   * @param  {...any} args - Arguments to log
   */
  log(...args) {
    if (this.debug) {
      console.log('[WebSocket]', ...args);
    }
  }

  /**
   * Destroy WebSocket manager
   */
  destroy() {
    this.disconnect();
    this.clearQueue();
    this.listeners = {};
    this.eventHandlers.clear();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebSocketManager;
}

// Make available globally
if (typeof window !== 'undefined') {
  window.WebSocketManager = WebSocketManager;
}
