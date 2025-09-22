/**
 * DevDash Main Dashboard Controller
 * Handles dashboard functionality, data management, and user interactions
 */

class DashboardManager {
    constructor() {
        this.apiBase = '/api/v1'; // Would be configured based on environment
        this.refreshInterval = 300000; // 5 minutes
        this.refreshTimer = null;
        this.isOnline = navigator.onLine;
        this.cachedData = new Map();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeDashboard();
        this.setupAutoRefresh();
        this.setupOfflineHandling();
        this.initializeFormHandlers();
    }

    setupEventListeners() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });

        // Online/offline detection
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleConnectionChange();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleConnectionChange();
        });

        // Page visibility change (pause/resume updates)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoRefresh();
            } else {
                this.resumeAutoRefresh();
            }
        });

        // Notification clicks
        const notificationBtn = document.querySelector('[aria-label="Notifications"]');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleNotificationPanel();
            });
        }
    }

    async initializeDashboard() {
        try {
            this.showLoading();
            
            // Load user data
            await this.loadUserProfile();
            
            // Load dashboard metrics
            await this.loadDashboardMetrics();
            
            // Initialize components
            this.initializeMetricCards();
            this.initializeActivityFeed();
            
            this.hideLoading();
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            this.handleError('Failed to load dashboard', error);
        }
    }

    async loadUserProfile() {
        try {
            // In production, this would be an API call
            const userData = {
                name: 'John Developer',
                role: 'developer',
                initials: 'JD',
                email: 'john@company.com',
                avatar: null,
                preferences: {
                    theme: 'light',
                    notifications: true,
                    autoRefresh: true
                }
            };

            this.updateUserInterface(userData);
            
            // Store in cache
            this.cachedData.set('userProfile', userData);
            
        } catch (error) {
            throw new Error('Failed to load user profile: ' + error.message);
        }
    }

    updateUserInterface(userData) {
        // Update user display
        const nameEl = document.getElementById('user-name');
        const roleEl = document.getElementById('user-role');
        const initialsEl = document.getElementById('user-initials');

        if (nameEl) nameEl.textContent = userData.name;
        if (roleEl) roleEl.textContent = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
        if (initialsEl) initialsEl.textContent = userData.initials;

        // Set user role in navigation
        if (window.navigationManager) {
            window.navigationManager.setUserRole(userData.role);
        }
    }

    async loadDashboardMetrics() {
        try {
            // Parallel loading of different metric types
            const [gitlabMetrics, openprojectMetrics, sonarMetrics] = await Promise.all([
                this.loadGitLabMetrics(),
                this.loadOpenProjectMetrics(),
                this.loadSonarQubeMetrics()
            ]);

            // Update metric cards
            this.updateMetricCard('commits', {
                value: gitlabMetrics.commitsToday,
                change: gitlabMetrics.commitChange,
                trend: gitlabMetrics.commitTrend
            });

            this.updateMetricCard('tasks', {
                value: openprojectMetrics.openTasks,
                change: openprojectMetrics.overdueCount,
                trend: 'warning'
            });

            this.updateMetricCard('quality', {
                value: sonarMetrics.qualityGrade,
                change: sonarMetrics.issuesResolved,
                trend: 'positive'
            });

            this.updateMetricCard('reviews', {
                value: gitlabMetrics.reviewsCompleted,
                change: gitlabMetrics.avgResponseTime,
                trend: 'neutral'
            });

        } catch (error) {
            throw new Error('Failed to load dashboard metrics: ' + error.message);
        }
    }

    async loadGitLabMetrics() {
        // Simulate API call with realistic data
        await this.simulateNetworkDelay();
        
        return {
            commitsToday: 12,
            commitChange: 20,
            commitTrend: 'positive',
            reviewsCompleted: 5,
            avgResponseTime: '2h',
            mergeRequests: {
                open: 3,
                merged: 15,
                draft: 2
            },
            codeReviewStats: {
                reviewed: 8,
                approvalRate: 94
            }
        };
    }

    async loadOpenProjectMetrics() {
        await this.simulateNetworkDelay();
        
        return {
            openTasks: 8,
            completedTasks: 24,
            inProgressTasks: 3,
            overdueCount: 2,
            tasksThisWeek: 12,
            avgCompletionTime: '2.5 days'
        };
    }

    async loadSonarQubeMetrics() {
        await this.simulateNetworkDelay();
        
        return {
            qualityGrade: 'A',
            issuesResolved: 0,
            bugs: 0,
            codeSmells: 3,
            coverage: 85,
            securityHotspots: 0,
            technicalDebt: '2h 30m'
        };
    }

    updateMetricCard(cardType, data) {
        const cardSelector = `.metric-card:has([class*="${cardType}"])`;
        const card = document.querySelector(cardSelector);
        
        if (!card) return;

        const valueEl = card.querySelector('.text-2xl');
        const changeEl = card.querySelector('[class*="text-"][class*="flex"]');
        
        if (valueEl) {
            // Animate value change
            this.animateValue(valueEl, data.value);
        }
        
        if (changeEl && data.change !== undefined) {
            this.updateChangeIndicator(changeEl, data.change, data.trend);
        }
    }

    updateChangeIndicator(element, change, trend) {
        const icon = element.querySelector('i');
        const text = element.querySelector('span');
        
        // Reset classes
        element.className = 'text-sm flex items-center mt-1';
        
        switch (trend) {
            case 'positive':
                element.classList.add('text-green-600');
                if (icon) icon.className = 'fas fa-arrow-up mr-1';
                if (text) text.textContent = `+${change}% from yesterday`;
                break;
            case 'negative':
                element.classList.add('text-red-600');
                if (icon) icon.className = 'fas fa-arrow-down mr-1';
                if (text) text.textContent = `-${change}% from yesterday`;
                break;
            case 'warning':
                element.classList.add('text-yellow-600');
                if (icon) icon.className = 'fas fa-exclamation-triangle mr-1';
                if (text) text.textContent = `${change} overdue`;
                break;
            default:
                element.classList.add('text-blue-600');
                if (icon) icon.className = 'fas fa-clock mr-1';
                if (text) text.textContent = `Avg: ${change} response`;
                break;
        }
    }

    initializeMetricCards() {
        const metricCards = document.querySelectorAll('.metric-card');
        
        metricCards.forEach((card, index) => {
            // Add hover effects and click handlers
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
            
            // Add click navigation to detailed views
            card.addEventListener('click', () => {
                this.navigateToMetricDetail(card);
            });
            
            // Animate cards on load
            setTimeout(() => {
                card.classList.add('animate-fade-in');
            }, index * 100);
        });
    }

    navigateToMetricDetail(card) {
        // Determine which view to navigate to based on card content
        const icon = card.querySelector('i[class*="fa-"]');
        if (!icon) return;
        
        if (icon.classList.contains('fa-git-alt')) {
            window.navigationManager?.navigateToView('gitlab-metrics');
        } else if (icon.classList.contains('fa-tasks')) {
            window.navigationManager?.navigateToView('openproject');
        } else if (icon.classList.contains('fa-code')) {
            window.navigationManager?.navigateToView('sonarqube');
        } else if (icon.classList.contains('fa-code-branch')) {
            window.navigationManager?.navigateToView('gitlab-metrics');
        }
    }

    async initializeActivityFeed() {
        try {
            const activities = await this.loadRecentActivities();
            this.renderActivityFeed(activities);
        } catch (error) {
            console.error('Failed to load activity feed:', error);
        }
    }

    async loadRecentActivities() {
        await this.simulateNetworkDelay();
        
        return [
            {
                id: 1,
                type: 'gitlab',
                action: 'merged',
                title: 'Merged pull request #247',
                description: 'Feature: Add user authentication module',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                metadata: {
                    additions: 234,
                    deletions: 45
                }
            },
            {
                id: 2,
                type: 'openproject',
                action: 'completed',
                title: 'Completed task #1234',
                description: 'Implement user dashboard layout',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            },
            {
                id: 3,
                type: 'sonar',
                action: 'fixed',
                title: 'Fixed SonarQube issue',
                description: 'Security hotspot: SQL injection vulnerability',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
            }
        ];
    }

    renderActivityFeed(activities) {
        const feedContainer = document.querySelector('.divide-y.divide-gray-200');
        if (!feedContainer) return;
        
        feedContainer.innerHTML = '';
        
        activities.forEach(activity => {
            const activityEl = this.createActivityElement(activity);
            feedContainer.appendChild(activityEl);
        });
    }

    createActivityElement(activity) {
        const activityDiv = document.createElement('div');
        activityDiv.className = 'p-6 flex items-start space-x-4 activity-item';
        
        const iconClass = this.getActivityIconClass(activity.type, activity.action);
        const timeAgo = this.formatTimeAgo(activity.timestamp);
        
        activityDiv.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="${iconClass}" aria-hidden="true"></i>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">${activity.title}</p>
                <p class="text-sm text-gray-600">${activity.description}</p>
                <p class="text-xs text-gray-500 mt-1">${timeAgo}</p>
            </div>
        `;
        
        return activityDiv;
    }

    getActivityIconClass(type, action) {
        const iconMap = {
            'gitlab': {
                'merged': 'fas fa-code-branch',
                'opened': 'fas fa-plus',
                'reviewed': 'fas fa-eye'
            },
            'openproject': {
                'completed': 'fas fa-check',
                'started': 'fas fa-play',
                'updated': 'fas fa-edit'
            },
            'sonar': {
                'fixed': 'fas fa-bug',
                'resolved': 'fas fa-check-circle',
                'detected': 'fas fa-exclamation-triangle'
            }
        };
        
        return iconMap[type]?.[action] || 'fas fa-info-circle';
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            return `${days} day${days !== 1 ? 's' : ''} ago`;
        }
    }

    initializeFormHandlers() {
        const dailyReportForm = document.getElementById('daily-report-form');
        if (dailyReportForm) {
            dailyReportForm.addEventListener('submit', (e) => {
                this.handleDailyReportSubmission(e);
            });
        }
    }

    async handleDailyReportSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const reportData = {
            tasksCompleted: formData.get('tasksCompleted'),
            hoursWorked: formData.get('hoursWorked'),
            accomplishments: formData.get('accomplishments'),
            challenges: formData.get('challenges'),
            tomorrowPlans: formData.get('tomorrowPlans'),
            date: new Date().toISOString().split('T')[0]
        };
        
        try {
            this.showFormLoading(form);
            await this.submitDailyReport(reportData);
            this.showNotification('Daily report submitted successfully!', 'success');
            form.reset();
        } catch (error) {
            console.error('Failed to submit daily report:', error);
            this.showNotification('Failed to submit daily report', 'error');
        } finally {
            this.hideFormLoading(form);
        }
    }

    async submitDailyReport(data) {
        // Simulate API submission
        await this.simulateNetworkDelay(1000);
        
        // Store in local storage for demo
        const reports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
        reports.unshift({ ...data, id: Date.now() });
        localStorage.setItem('dailyReports', JSON.stringify(reports.slice(0, 30))); // Keep last 30
        
        return { success: true };
    }

    setupAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        this.refreshTimer = setInterval(() => {
            if (this.isOnline && !document.hidden) {
                this.refreshDashboardData();
            }
        }, this.refreshInterval);
    }

    pauseAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    resumeAutoRefresh() {
        this.setupAutoRefresh();
        // Immediate refresh when resuming
        if (this.isOnline) {
            this.refreshDashboardData();
        }
    }

    async refreshDashboardData() {
        try {
            // Refresh metrics silently
            await this.loadDashboardMetrics();
            
            // Update activity feed
            const activities = await this.loadRecentActivities();
            this.renderActivityFeed(activities);
            
            // Update charts if visible
            if (window.chartManager) {
                const currentRange = document.getElementById('date-range')?.value || '7';
                window.chartManager.updateChartsForDateRange(parseInt(currentRange));
            }
            
        } catch (error) {
            console.error('Failed to refresh dashboard:', error);
            // Don't show error notification for silent refresh failures
        }
    }

    setupOfflineHandling() {
        // Show offline indicator when appropriate
        if (!this.isOnline) {
            this.showOfflineIndicator();
        }
    }

    handleConnectionChange() {
        if (this.isOnline) {
            this.hideOfflineIndicator();
            this.resumeAutoRefresh();
            this.showNotification('Connection restored', 'success');
        } else {
            this.showOfflineIndicator();
            this.pauseAutoRefresh();
            this.showNotification('Working offline', 'warning');
        }
    }

    showOfflineIndicator() {
        let indicator = document.getElementById('offline-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 text-sm z-50';
            indicator.innerHTML = '<i class="fas fa-wifi-slash mr-2"></i>Working offline - some features may be limited';
            document.body.prepend(indicator);
        }
    }

    hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    toggleNotificationPanel() {
        // Implementation for notification panel toggle
        console.log('Toggle notifications panel');
    }

    // Utility methods
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Submitting...';
        }
    }

    hideFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Submit Report';
        }
    }

    showNotification(message, type = 'info') {
        if (window.navigationManager) {
            window.navigationManager.showNotification(message, type);
        }
    }

    animateValue(element, targetValue) {
        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.round(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    async simulateNetworkDelay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleGlobalError(error) {
        console.error('Global error:', error);
        
        // Don't spam notifications for network errors during offline state
        if (!this.isOnline && error.message?.includes('fetch')) {
            return;
        }
        
        this.showNotification('An unexpected error occurred', 'error');
    }

    handleError(message, error) {
        console.error(message, error);
        this.showNotification(message, 'error');
        this.hideLoading();
    }

    // Public API for external interaction
    getMetricData(metricType) {
        return this.cachedData.get(`metrics_${metricType}`);
    }

    refreshMetric(metricType) {
        switch (metricType) {
            case 'gitlab':
                return this.loadGitLabMetrics();
            case 'openproject':
                return this.loadOpenProjectMetrics();
            case 'sonar':
                return this.loadSonarQubeMetrics();
            default:
                return this.loadDashboardMetrics();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});