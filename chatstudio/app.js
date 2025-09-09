// ChatStudio Main Application
class ChatStudio {
    constructor() {
        this.mockBackend = new MockBackend();
        this.currentSession = null;
        this.sessions = this.loadSessions();
        this.isStreaming = false;
        this.debugMode = false;
        this.theme = localStorage.getItem('chatstudio-theme') || 'light';
        
        this.initializeApp();
        this.bindEvents();
        this.createNewSession();
        this.updateUI();
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
    }

    bindEvents() {
        // Message input and sending
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.sendMessage();
            }
            this.updateCharCount();
        });
        
        messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResize(messageInput);
        });
        
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Session controls
        document.getElementById('newSessionBtn').addEventListener('click', () => this.createNewSession());
        document.getElementById('saveSessionBtn').addEventListener('click', () => this.saveCurrentSession());
        document.getElementById('resetSessionBtn').addEventListener('click', () => this.resetCurrentSession());
        document.getElementById('clearChatBtn').addEventListener('click', () => this.clearChat());
        document.getElementById('exportChatBtn').addEventListener('click', () => this.exportChat());

        // Mock backend settings
        document.getElementById('responseType').addEventListener('change', (e) => {
            this.mockBackend.updateSettings({ responseType: e.target.value });
        });
        
        document.getElementById('streamingSpeed').addEventListener('input', (e) => {
            const speed = parseInt(e.target.value);
            this.mockBackend.updateSettings({ streamingSpeed: speed });
            document.querySelector('.range-value').textContent = `${speed}ms`;
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

        // Emoji button (placeholder for now)
        document.getElementById('emojiBtn').addEventListener('click', () => {
            this.insertEmoji('😊');
        });

        // Code button
        document.getElementById('codeBtn').addEventListener('click', () => {
            this.insertCodeBlock();
        });

        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
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
            const confirmMessage = `You have unsaved changes in the current session.\n\nDo you want to:\n- Save current session first, then load "${session.name}"?\n- Discard changes and load "${session.name}"?\n- Cancel and stay in current session?`;
            
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
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message || this.isStreaming) return;

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
        messageEl.className = `message ${type} ${animate ? 'fade-in' : ''}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'user' ? 'U' : 'AI';
        
        const content_div = document.createElement('div');
        content_div.className = 'message-content';
        
        if (type === 'assistant' && typeof marked !== 'undefined') {
            content_div.innerHTML = marked.parse(content);
        } else {
            content_div.textContent = content;
        }
        
        const timeEl = document.createElement('div');
        timeEl.className = 'message-time';
        timeEl.textContent = new Date(timestamp || Date.now()).toLocaleTimeString();
        
        messageEl.appendChild(avatar);
        messageEl.appendChild(content_div);
        content_div.appendChild(timeEl);
        
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
        counter.textContent = `${input.value.length}/4000`;
        
        // Update send button state
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.disabled = !input.value.trim() || this.isStreaming;
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = newHeight + 'px';
    }

    updateSessionInfo() {
        if (!this.currentSession) return;
        
        document.getElementById('currentSessionName').textContent = this.currentSession.name;
        const messageCount = this.currentSession.messages.length;
        document.querySelector('.message-count').textContent = `${messageCount} message${messageCount !== 1 ? 's' : ''}`;
    }

    updateSessionList() {
        const container = document.getElementById('sessionList');
        
        if (this.sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-sessions">
                    <span class="empty-icon">📝</span>
                    <p>No saved sessions yet</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.sessions.map(session => `
            <div class="session-item ${this.currentSession && session.id === this.currentSession.id ? 'active' : ''}" 
                 data-session-id="${session.id}"
                 onclick="chatStudio.loadSession('${session.id}')">
                <div class="session-name">${session.name}</div>
                <div class="session-meta">
                    <span>${session.messages.length} messages</span>
                    <span>${new Date(session.updatedAt).toLocaleDateString()}</span>
                </div>
                <div class="session-preview">${session.messages[0]?.content.substring(0, 50) || 'No messages'}...</div>
                <div class="session-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="chatStudio.loadSession('${session.id}')" title="Load Session">📂</button>
                    <button class="btn-icon" onclick="event.stopPropagation(); chatStudio.deleteSession('${session.id}')" title="Delete Session">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    updateConnectionStatus() {
        const status = this.mockBackend.getConnectionStatus();
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (status.connected) {
            statusDot.classList.add('connected');
            statusText.textContent = `Mock Backend Ready (${Math.round(status.latency)}ms)`;
        } else {
            statusDot.classList.remove('connected');
            statusText.textContent = 'Connection Issues';
        }
    }

    updateStats() {
        const messageCount = this.currentSession ? this.currentSession.messages.length : 0;
        document.getElementById('messageCount').textContent = messageCount;
        
        const avgResponse = this.getAverageResponseTime();
        document.getElementById('avgResponse').textContent = `${avgResponse}ms`;
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
        document.getElementById('errorCount').textContent = errorCount;
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
        document.querySelectorAll('.modal').forEach(modal => {
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

    updateDebugOutput() {
        const output = document.getElementById('debugOutput');
        const history = this.mockBackend.getConversationHistory();
        const sessionData = {
            currentSession: this.currentSession,
            conversationHistory: history,
            settings: this.mockBackend.settings,
            connectionStatus: this.mockBackend.getConnectionStatus(),
            stats: {
                totalSessions: this.sessions.length,
                currentMessages: this.currentSession ? this.currentSession.messages.length : 0,
                averageResponseTime: this.getAverageResponseTime(),
                errorCount: localStorage.getItem('chatstudio-error-count') || '0'
            }
        };
        
        output.textContent = JSON.stringify(sessionData, null, 2);
    }

    // Theme Management
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('chatstudio-theme', this.theme);
        
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.textContent = this.theme === 'light' ? '🌙 Dark' : '☀️ Light';
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
        }
    }

    clearMessagesUI() {
        const container = document.getElementById('messagesContainer');
        container.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🚀</div>
                <h3>Welcome to ChatStudio</h3>
                <p>Start testing your chat backend by sending a message below</p>
            </div>
        `;
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
            settings: this.mockBackend.settings
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

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="btn-close" onclick="this.parentElement.remove()">✕</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
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
        
        // Load error count
        const errorCount = localStorage.getItem('chatstudio-error-count') || '0';
        document.getElementById('errorCount').textContent = errorCount;
        
        // Update theme toggle text
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.textContent = this.theme === 'light' ? '🌙 Dark' : '☀️ Light';
    }
}

// CSS for notifications (add to styles.css or include inline)
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    font-size: 14px;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification-info { background: linear-gradient(135deg, var(--primary-500), var(--primary-600)); }
.notification-success { background: linear-gradient(135deg, var(--success-500), var(--success-600)); }
.notification-warning { background: linear-gradient(135deg, var(--warning-500), var(--warning-600)); }
.notification-error { background: linear-gradient(135deg, var(--error-500), var(--error-600)); }

.notification .btn-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    font-size: 12px;
}

@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;

// Add notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize ChatStudio when DOM is ready
let chatStudio;
document.addEventListener('DOMContentLoaded', () => {
    chatStudio = new ChatStudio();
});

// Export for global access
window.ChatStudio = ChatStudio;