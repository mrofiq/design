// Modern ChatStudio Application - 2025 Edition
class ModernChatStudio {
    constructor() {
        console.log('ModernChatStudio constructor called');
        
        // Check if MockBackend exists
        if (typeof MockBackend === 'undefined') {
            console.error('MockBackend not found! Check if mock-backend.js is loaded.');
            return;
        }
        
        this.mockBackend = new MockBackend();
        this.currentSession = null;
        this.sessions = this.loadSessions();
        this.isStreaming = false;
        this.debugMode = false;
        this.theme = localStorage.getItem('chatstudio-theme') || 'dark';
        this.notifications = [];
        
        console.log('Initializing app...');
        this.initializeApp();
        this.bindEvents();
        this.createNewSession();
        this.updateUI();
        console.log('ModernChatStudio initialization complete');
    }

    initializeApp() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Initialize marked.js for markdown rendering
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                highlight: function(code, lang) {
                    if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (__) {}
                    }
                    return code;
                },
                breaks: true,
                gfm: true
            });
        }

        // Update connection status periodically
        this.updateConnectionStatus();
        setInterval(() => this.updateConnectionStatus(), 5000);
        
        // Initialize theme toggle icon
        this.updateThemeIcon();
        
        // Auto-dismiss notifications
        setInterval(() => this.cleanupNotifications(), 1000);
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Message input and sending
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (!messageInput || !sendBtn) {
            console.error('Critical elements not found:', { 
                messageInput: !!messageInput, 
                sendBtn: !!sendBtn 
            });
            return;
        }
        
        console.log('Found input elements, binding events...');
        
        messageInput.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.key, 'Shift:', e.shiftKey);
            if (e.key === 'Enter') {
                if (e.ctrlKey || e.metaKey) {
                    // Ctrl+Enter: Send message
                    console.log('Ctrl+Enter detected');
                    e.preventDefault();
                    this.sendMessage();
                } else if (!e.shiftKey) {
                    // Regular Enter: Send message (Shift+Enter for new line)
                    console.log('Regular Enter detected');
                    e.preventDefault();
                    this.sendMessage();
                }
                // Shift+Enter: Allow default behavior (new line)
            }
            this.updateCharCount();
        });
        
        messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResize(messageInput);
        });
        
        sendBtn.addEventListener('click', (e) => {
            console.log('Send button clicked');
            e.preventDefault();
            this.sendMessage();
        });
        
        console.log('Input events bound successfully');

        // Session controls
        document.getElementById('newSessionBtn').addEventListener('click', () => this.createNewSession());
        document.getElementById('saveSessionBtn').addEventListener('click', () => this.saveCurrentSession());
        document.getElementById('resetSessionBtn').addEventListener('click', () => this.resetCurrentSession());
        document.getElementById('clearChatBtn').addEventListener('click', () => this.clearChat());
        document.getElementById('exportChatBtn').addEventListener('click', () => this.exportChat());
        
        // Session list event delegation
        document.getElementById('sessionList').addEventListener('click', (e) => {
            const sessionItem = e.target.closest('.session-item');
            const sessionId = sessionItem?.dataset.sessionId;
            
            if (e.target.closest('.load-session-btn') && sessionId) {
                e.stopPropagation();
                this.loadSession(sessionId);
            } else if (e.target.closest('.delete-session-btn') && sessionId) {
                e.stopPropagation();
                this.deleteSession(sessionId);
            } else if (sessionItem && sessionId && !e.target.closest('.session-actions')) {
                this.loadSession(sessionId);
            }
        });
        
        // Notification event delegation
        document.getElementById('notificationContainer').addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.close-btn');
            if (closeBtn) {
                const notificationId = closeBtn.dataset.notificationId;
                if (notificationId) {
                    this.dismissNotification(notificationId);
                }
            }
        });

        // Mock backend settings
        document.getElementById('responseType').addEventListener('change', (e) => {
            this.mockBackend.updateSettings({ responseType: e.target.value });
        });
        
        document.getElementById('streamingSpeed').addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            this.mockBackend.updateSettings({ streamingSpeed: speed });
            e.target.nextElementSibling.textContent = `${speed}ms`;
        });
        
        document.getElementById('errorRate').addEventListener('input', (e) => {
            const rate = parseInt(e.target.value);
            this.mockBackend.updateSettings({ errorRate: rate });
            e.target.nextElementSibling.textContent = `${rate}%`;
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Settings modal
        document.getElementById('settingsBtn').addEventListener('click', () => this.openModal('settingsModal'));
        document.getElementById('closeSettings').addEventListener('click', () => this.closeModal('settingsModal'));
        document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
        document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());
        
        // Debug modal
        document.getElementById('debugToggle').addEventListener('click', () => this.toggleDebugModal());
        document.getElementById('closeDebug').addEventListener('click', () => this.closeModal('debugModal'));

        // File upload
        document.getElementById('imageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });
        
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });

        // Emoji and code buttons
        document.getElementById('emojiBtn').addEventListener('click', () => {
            this.insertEmoji('😊');
        });

        document.getElementById('codeBtn').addEventListener('click', () => {
            this.insertCodeBlock();
        });

        // Modal overlay clicks
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal(overlay.id);
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                document.getElementById('messageInput').focus();
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleDebugModal();
            }
        });

        // Debug tabs
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchDebugTab(tab.dataset.tab));
        });
    }

    // Session Management
    createNewSession() {
        // Check if current session has unsaved changes
        const hasUnsavedChanges = this.currentSession && 
            this.currentSession.messages.length > 0 && 
            !this.sessions.find(s => s.id === this.currentSession.id);

        if (hasUnsavedChanges) {
            if (!confirm('You have unsaved changes in the current session.\n\nStart a new session anyway? (Current session will be lost)')) {
                return;
            }
        }

        const sessionId = this.generateId();
        this.currentSession = {
            id: sessionId,
            name: `Session ${new Date().toLocaleTimeString()}`,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        this.clearMessagesUI();
        this.updateSessionInfo();
        this.updateStats();
        this.showNotification('New session created', 'info');
    }

    saveCurrentSession() {
        if (!this.currentSession || this.currentSession.messages.length === 0) {
            this.showNotification('No messages to save', 'warning');
            return;
        }

        this.currentSession.updatedAt = Date.now();
        
        // Check if session already exists
        const existingIndex = this.sessions.findIndex(s => s.id === this.currentSession.id);
        if (existingIndex >= 0) {
            this.sessions[existingIndex] = { ...this.currentSession };
        } else {
            this.sessions.unshift({ ...this.currentSession });
        }
        
        this.saveSessions();
        this.updateSessionList();
        this.showNotification('Session saved successfully', 'success');
    }

    loadSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return;

        // Check if current session has unsaved changes
        const hasUnsavedChanges = this.currentSession && 
            this.currentSession.messages.length > 0 && 
            !this.sessions.find(s => s.id === this.currentSession.id);

        if (hasUnsavedChanges) {
            if (!confirm(`Load "${session.name}"?\n\nThis will replace your current session.\n\nClick OK to continue or Cancel to stay.`)) {
                return;
            }
        }

        this.currentSession = { ...session };
        this.clearMessagesUI();
        
        // Restore messages
        session.messages.forEach(message => {
            this.addMessageToUI(message.content, message.type, false, message.timestamp);
        });
        
        this.updateSessionInfo();
        this.updateStats();
        this.updateSessionList();
        this.showNotification(`Loaded session: ${session.name}`, 'success');
    }

    deleteSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return;

        const messageCount = session.messages.length;
        const confirmMessage = `Delete "${session.name}"?\n\nThis session has ${messageCount} message${messageCount !== 1 ? 's' : ''} and cannot be recovered.\n\nAre you sure?`;
        
        if (!confirm(confirmMessage)) {
            return;
        }

        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        this.saveSessions();
        this.updateSessionList();
        
        if (this.currentSession && this.currentSession.id === sessionId) {
            this.createNewSession();
        }
        
        this.showNotification(`Deleted session: ${session.name}`, 'info');
    }

    resetCurrentSession() {
        if (confirm('Are you sure you want to reset the current session? All messages will be lost.')) {
            this.createNewSession();
            this.mockBackend.clearHistory();
            this.showNotification('Session reset', 'info');
        }
    }

    // Message Handling
    async sendMessage() {
        console.log('sendMessage() called');
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        console.log('Message to send:', message);
        console.log('Is streaming:', this.isStreaming);
        
        if (!message || this.isStreaming) {
            console.log('Message empty or streaming, returning');
            return;
        }

        input.value = '';
        this.updateCharCount();
        this.autoResize(input);

        // Add user message
        this.addMessageToSession(message, 'user');
        this.addMessageToUI(message, 'user', true);

        // Show typing indicator
        this.showTypingIndicator();

        try {
            this.isStreaming = true;
            const startTime = Date.now();
            
            await this.mockBackend.streamResponse(
                message,
                (chunk) => this.updateStreamingMessage(chunk),
                (finalText) => {
                    this.completeStreamingMessage(finalText);
                    this.addMessageToSession(finalText, 'assistant');
                    this.isStreaming = false;
                    this.hideTypingIndicator();
                    
                    // Update stats
                    const responseTime = Date.now() - startTime;
                    this.updateResponseTime(responseTime);
                    this.updateStats();
                },
                (error) => {
                    this.handleStreamError(error);
                    this.isStreaming = false;
                    this.hideTypingIndicator();
                }
            );
        } catch (error) {
            console.error('Send message error:', error);
            this.showNotification('Failed to send message', 'error');
            this.isStreaming = false;
            this.hideTypingIndicator();
        }
    }

    addMessageToSession(content, type) {
        if (!this.currentSession) return;
        
        this.currentSession.messages.push({
            content,
            type,
            timestamp: Date.now()
        });
        
        this.currentSession.updatedAt = Date.now();
    }

    addMessageToUI(content, type, animate = true, timestamp = null) {
        const container = document.getElementById('messagesContainer');
        const welcomeMsg = container.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = `message ${type} ${animate ? 'slide-up' : ''}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'user' ? 'U' : 'AI';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (type === 'assistant' && typeof marked !== 'undefined') {
            contentDiv.innerHTML = marked.parse(content);
        } else {
            contentDiv.textContent = content;
        }
        
        const timeEl = document.createElement('div');
        timeEl.className = 'message-time';
        timeEl.textContent = new Date(timestamp || Date.now()).toLocaleTimeString();
        
        messageEl.appendChild(avatar);
        messageEl.appendChild(contentDiv);
        contentDiv.appendChild(timeEl);
        
        container.appendChild(messageEl);
        this.scrollToBottom();
        
        return messageEl;
    }

    updateStreamingMessage(chunk) {
        let streamingMsg = document.querySelector('.message.streaming');
        
        if (!streamingMsg) {
            streamingMsg = this.addMessageToUI('', 'assistant', true);
            streamingMsg.classList.add('streaming');
        }
        
        const content = streamingMsg.querySelector('.message-content');
        if (typeof marked !== 'undefined') {
            content.innerHTML = marked.parse(chunk);
        } else {
            content.textContent = chunk;
        }
        
        this.scrollToBottom();
    }

    completeStreamingMessage(finalText) {
        const streamingMsg = document.querySelector('.message.streaming');
        if (streamingMsg) {
            streamingMsg.classList.remove('streaming');
            const content = streamingMsg.querySelector('.message-content');
            
            if (typeof marked !== 'undefined') {
                content.innerHTML = marked.parse(finalText);
            } else {
                content.textContent = finalText;
            }
            
            // Update timestamp
            const timeEl = streamingMsg.querySelector('.message-time');
            if (timeEl) {
                timeEl.textContent = new Date().toLocaleTimeString();
            }
        }
    }

    handleStreamError(error) {
        console.error('Stream error:', error);
        
        // Remove streaming message if exists
        const streamingMsg = document.querySelector('.message.streaming');
        if (streamingMsg) {
            streamingMsg.remove();
        }
        
        // Add error message
        this.addMessageToUI(`❌ Error: ${error.message}`, 'assistant', true);
        this.showNotification(error.message, 'error');
        
        // Update error count
        this.incrementErrorCount();
    }

    // UI Helper Methods
    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.classList.add('visible');
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.classList.remove('visible');
    }

    scrollToBottom() {
        const container = document.getElementById('messagesContainer');
        container.scrollTop = container.scrollHeight;
    }

    updateCharCount() {
        const input = document.getElementById('messageInput');
        const counter = document.querySelector('.char-count');
        if (counter) {
            counter.textContent = `${input.value.length}/4000`;
        }
        
        // Update send button state
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.disabled = !input.value.trim() || this.isStreaming;
        }
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = newHeight + 'px';
    }

    updateSessionInfo() {
        if (!this.currentSession) return;
        
        const nameEl = document.getElementById('currentSessionName');
        if (nameEl) {
            nameEl.textContent = this.currentSession.name;
        }
        
        const messageCount = this.currentSession.messages.length;
        const countEl = document.querySelector('.message-count');
        if (countEl) {
            countEl.textContent = `${messageCount} message${messageCount !== 1 ? 's' : ''}`;
        }
    }

    updateSessionList() {
        const container = document.getElementById('sessionList');
        
        if (this.sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-sessions">
                    <div class="empty-icon">
                        <i data-lucide="folder"></i>
                    </div>
                    <p>No saved sessions yet</p>
                    <span class="empty-hint">Save your first session to get started</span>
                </div>
            `;
            lucide.createIcons();
            return;
        }
        
        container.innerHTML = this.sessions.map(session => `
            <div class="session-item ${this.currentSession && session.id === this.currentSession.id ? 'active' : ''}" 
                 data-session-id="${session.id}">
                <div class="session-name">${session.name}</div>
                <div class="session-meta">
                    <span>${session.messages.length} messages</span>
                    <span>${new Date(session.updatedAt).toLocaleDateString()}</span>
                </div>
                <div class="session-preview">${session.messages[0]?.content.substring(0, 50) || 'No messages'}...</div>
                <div class="session-actions">
                    <button class="modern-btn icon-btn small load-session-btn" data-session-id="${session.id}" title="Load Session">
                        <i data-lucide="folder-open"></i>
                    </button>
                    <button class="modern-btn icon-btn small delete-session-btn" data-session-id="${session.id}" title="Delete Session">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        lucide.createIcons();
    }

    updateConnectionStatus() {
        const status = this.mockBackend.getConnectionStatus();
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        const latencyBadge = document.querySelector('.latency-badge');
        
        if (status.connected) {
            statusIndicator.classList.add('connected');
            if (statusText) statusText.textContent = 'Mock Backend Ready';
            if (latencyBadge) latencyBadge.textContent = `${Math.round(status.latency)}ms`;
        } else {
            statusIndicator.classList.remove('connected');
            if (statusText) statusText.textContent = 'Connection Issues';
            if (latencyBadge) latencyBadge.textContent = '---';
        }
    }

    updateStats() {
        const messageCount = this.currentSession ? this.currentSession.messages.length : 0;
        const messageCountEl = document.getElementById('messageCount');
        if (messageCountEl) {
            messageCountEl.textContent = messageCount;
        }
        
        const avgResponse = this.getAverageResponseTime();
        const avgResponseEl = document.getElementById('avgResponse');
        if (avgResponseEl) {
            avgResponseEl.textContent = `${avgResponse}ms`;
        }
        
        const errorCount = localStorage.getItem('chatstudio-error-count') || '0';
        const errorCountEl = document.getElementById('errorCount');
        if (errorCountEl) {
            errorCountEl.textContent = errorCount;
        }
    }

    updateResponseTime(time) {
        const responseTimes = JSON.parse(localStorage.getItem('chatstudio-response-times') || '[]');
        responseTimes.push(time);
        
        // Keep only last 10 response times
        if (responseTimes.length > 10) {
            responseTimes.shift();
        }
        
        localStorage.setItem('chatstudio-response-times', JSON.stringify(responseTimes));
    }

    getAverageResponseTime() {
        const responseTimes = JSON.parse(localStorage.getItem('chatstudio-response-times') || '[]');
        if (responseTimes.length === 0) return 0;
        
        const sum = responseTimes.reduce((a, b) => a + b, 0);
        return Math.round(sum / responseTimes.length);
    }

    incrementErrorCount() {
        const errorCount = parseInt(localStorage.getItem('chatstudio-error-count') || '0') + 1;
        localStorage.setItem('chatstudio-error-count', errorCount.toString());
        const errorCountEl = document.getElementById('errorCount');
        if (errorCountEl) {
            errorCountEl.textContent = errorCount;
        }
    }

    // Theme Management
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('chatstudio-theme', this.theme);
        this.updateThemeIcon();
        this.showNotification(`Switched to ${this.theme} theme`, 'info');
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }
        
        const icon = themeToggle.querySelector('i');
        if (!icon) {
            console.warn('Theme toggle icon not found');
            return;
        }
        
        if (this.theme === 'dark') {
            icon.setAttribute('data-lucide', 'sun');
        } else {
            icon.setAttribute('data-lucide', 'moon');
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('visible');
        
        if (modalId === 'debugModal') {
            this.updateDebugOutput();
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('visible');
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('visible');
        });
    }

    toggleDebugModal() {
        const modal = document.getElementById('debugModal');
        if (modal.classList.contains('visible')) {
            this.closeModal('debugModal');
        } else {
            this.openModal('debugModal');
        }
    }

    switchDebugTab(tabName) {
        // Update tab states
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update content based on selected tab
        this.updateDebugOutput(tabName);
    }

    updateDebugOutput(tab = 'messages') {
        const output = document.getElementById('debugOutput');
        let data;
        
        switch (tab) {
            case 'messages':
                data = {
                    currentSession: this.currentSession,
                    conversationHistory: this.mockBackend.getConversationHistory()
                };
                break;
            case 'settings':
                data = {
                    mockBackendSettings: this.mockBackend.settings,
                    theme: this.theme,
                    savedSessions: this.sessions.length,
                    localStorage: {
                        theme: localStorage.getItem('chatstudio-theme'),
                        errorCount: localStorage.getItem('chatstudio-error-count'),
                        responseTimes: localStorage.getItem('chatstudio-response-times')
                    }
                };
                break;
            case 'performance':
                data = {
                    connectionStatus: this.mockBackend.getConnectionStatus(),
                    stats: {
                        totalSessions: this.sessions.length,
                        currentMessages: this.currentSession ? this.currentSession.messages.length : 0,
                        averageResponseTime: this.getAverageResponseTime(),
                        errorCount: localStorage.getItem('chatstudio-error-count') || '0'
                    },
                    performance: {
                        memoryUsage: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown',
                        connection: navigator.connection ? navigator.connection.effectiveType : 'Unknown',
                        timestamp: new Date().toISOString()
                    }
                };
                break;
            default:
                data = { error: 'Unknown tab' };
        }
        
        if (output) {
            output.textContent = JSON.stringify(data, null, 2);
        }
    }

    // Settings Management
    saveSettings() {
        const themeSelect = document.getElementById('themeSelect');
        const autoSave = document.getElementById('autoSave');
        const soundEffects = document.getElementById('soundEffects');
        
        if (themeSelect && themeSelect.value !== this.theme) {
            this.theme = themeSelect.value;
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('chatstudio-theme', this.theme);
            this.updateThemeIcon();
        }
        
        localStorage.setItem('chatstudio-autosave', autoSave?.checked || false);
        localStorage.setItem('chatstudio-sound', soundEffects?.checked || false);
        
        this.closeModal('settingsModal');
        this.showNotification('Settings saved', 'success');
    }

    resetSettings() {
        if (confirm('Reset all settings to default values?')) {
            localStorage.removeItem('chatstudio-theme');
            localStorage.removeItem('chatstudio-autosave');
            localStorage.removeItem('chatstudio-sound');
            
            this.theme = 'dark';
            document.documentElement.setAttribute('data-theme', this.theme);
            this.updateThemeIcon();
            
            // Reset form values
            document.getElementById('themeSelect').value = 'dark';
            document.getElementById('autoSave').checked = true;
            document.getElementById('soundEffects').checked = false;
            
            this.showNotification('Settings reset to defaults', 'info');
        }
    }

    // File and Media Handling
    handleImageUpload(file) {
        if (!file) return;
        
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showNotification('Image size must be under 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.insertImageIntoMessage(imageUrl, file.name);
        };
        reader.readAsDataURL(file);
    }

    insertImageIntoMessage(imageUrl, fileName) {
        const input = document.getElementById('messageInput');
        const imageMarkdown = `\n![${fileName}](${imageUrl})\n`;
        
        const cursorPos = input.selectionStart;
        const textBefore = input.value.substring(0, cursorPos);
        const textAfter = input.value.substring(input.selectionEnd);
        
        input.value = textBefore + imageMarkdown + textAfter;
        input.focus();
        input.setSelectionRange(cursorPos + imageMarkdown.length, cursorPos + imageMarkdown.length);
        
        this.updateCharCount();
        this.autoResize(input);
    }

    insertEmoji(emoji) {
        const input = document.getElementById('messageInput');
        const cursorPos = input.selectionStart;
        const textBefore = input.value.substring(0, cursorPos);
        const textAfter = input.value.substring(input.selectionEnd);
        
        input.value = textBefore + emoji + textAfter;
        input.focus();
        input.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
        
        this.updateCharCount();
        this.autoResize(input);
    }

    insertCodeBlock() {
        const input = document.getElementById('messageInput');
        const codeBlock = '\n```javascript\n// Your code here\n```\n';
        
        const cursorPos = input.selectionStart;
        const textBefore = input.value.substring(0, cursorPos);
        const textAfter = input.value.substring(input.selectionEnd);
        
        input.value = textBefore + codeBlock + textAfter;
        input.focus();
        
        // Position cursor inside the code block
        const newPos = cursorPos + codeBlock.indexOf('// Your code here');
        input.setSelectionRange(newPos, newPos + 16); // Select "Your code here"
        
        this.updateCharCount();
        this.autoResize(input);
    }

    // Utility Methods
    clearChat() {
        if (confirm('Clear all messages from this session?')) {
            this.clearMessagesUI();
            if (this.currentSession) {
                this.currentSession.messages = [];
                this.updateSessionInfo();
                this.updateStats();
            }
            this.showNotification('Chat cleared', 'info');
        }
    }

    clearMessagesUI() {
        const container = document.getElementById('messagesContainer');
        container.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <i data-lucide="message-circle"></i>
                </div>
                <h3>Welcome to ChatStudio</h3>
                <p>Start testing your chat backend by sending a message below</p>
            </div>
        `;
        lucide.createIcons();
    }

    exportChat() {
        if (!this.currentSession || this.currentSession.messages.length === 0) {
            this.showNotification('No messages to export', 'warning');
            return;
        }

        const exportData = {
            sessionName: this.currentSession.name,
            createdAt: this.currentSession.createdAt,
            exportedAt: Date.now(),
            messages: this.currentSession.messages,
            settings: this.mockBackend.settings,
            version: '2025.1.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chatstudio-session-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Session exported successfully', 'success');
    }

    // Notification System
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        const id = this.generateId();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.id = id;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-btn" data-notification-id="${id}">
                <i data-lucide="x"></i>
            </button>
        `;

        container.appendChild(notification);
        lucide.createIcons();
        
        // Store notification with timestamp
        this.notifications.push({
            id,
            timestamp: Date.now(),
            duration
        });

        // Auto-dismiss after duration
        setTimeout(() => {
            this.dismissNotification(id);
        }, duration);
    }

    dismissNotification(id) {
        const notification = document.querySelector(`[data-id="${id}"]`);
        if (notification) {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
        
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    cleanupNotifications() {
        const now = Date.now();
        this.notifications.forEach(notification => {
            if (now - notification.timestamp > notification.duration + 1000) {
                this.dismissNotification(notification.id);
            }
        });
    }

    // Storage Methods
    loadSessions() {
        try {
            const sessions = localStorage.getItem('chatstudio-sessions');
            return sessions ? JSON.parse(sessions) : [];
        } catch (error) {
            console.error('Failed to load sessions:', error);
            return [];
        }
    }

    saveSessions() {
        try {
            localStorage.setItem('chatstudio-sessions', JSON.stringify(this.sessions));
        } catch (error) {
            console.error('Failed to save sessions:', error);
            this.showNotification('Failed to save session', 'error');
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    updateUI() {
        this.updateSessionList();
        this.updateStats();
        this.updateCharCount();
        this.updateThemeIcon();
        
        // Update setting values in sliders
        const streamingSpeed = document.getElementById('streamingSpeed');
        const errorRate = document.getElementById('errorRate');
        
        if (streamingSpeed) {
            streamingSpeed.nextElementSibling.textContent = `${streamingSpeed.value}ms`;
        }
        
        if (errorRate) {
            errorRate.nextElementSibling.textContent = `${errorRate.value}%`;
        }
    }
}

// CSS Animation for slide out
const slideOutCSS = `
@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}
`;

// Add slide out animation to head
const styleSheet = document.createElement('style');
styleSheet.textContent = slideOutCSS;
document.head.appendChild(styleSheet);

// Initialize ModernChatStudio when DOM is ready
let modernChatStudio;
document.addEventListener('DOMContentLoaded', () => {
    modernChatStudio = new ModernChatStudio();
    window.modernChatStudio = modernChatStudio;
});

// Export for global access
window.ModernChatStudio = ModernChatStudio;