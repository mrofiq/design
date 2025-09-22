/**
 * DevDash Navigation System
 * Handles routing, view management, and responsive navigation
 */

class NavigationManager {
    constructor() {
        this.currentView = 'dashboard';
        this.userRole = 'developer'; // Will be set from backend
        this.views = {};
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.loadUserRole();
        this.initializeViews();
        this.handleInitialRoute();
    }

    setupEventListeners() {
        // Navigation link clicks
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href !== '#logout') {
                    const viewName = href.substring(1); // Remove #
                    this.navigateToView(viewName);
                }
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                this.navigateToView(e.state.view, false);
            }
        });

        // Logout handler
        const logoutLink = document.querySelector('a[href="#logout"]');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Date range selector
        const dateRangeSelect = document.getElementById('date-range');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                this.handleDateRangeChange(e.target.value);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.createElement('div');
        
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-30 hidden';
        overlay.id = 'mobile-overlay';
        document.body.appendChild(overlay);

        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking overlay
            overlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-overlay');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (sidebar.classList.contains('open')) {
            this.closeMobileMenu();
        } else {
            sidebar.classList.add('open');
            overlay.classList.remove('hidden');
            toggle.setAttribute('aria-expanded', 'true');
            
            // Focus first nav item for accessibility
            const firstNavLink = sidebar.querySelector('.nav-link');
            if (firstNavLink) {
                firstNavLink.focus();
            }
        }
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-overlay');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
    }

    loadUserRole() {
        // In real app, this would come from authentication
        // For demo, check localStorage or default to developer
        const savedRole = localStorage.getItem('userRole') || 'developer';
        this.setUserRole(savedRole);
    }

    setUserRole(role) {
        this.userRole = role;
        const managerElements = document.querySelectorAll('.manager-only');
        
        if (role === 'manager') {
            managerElements.forEach(el => el.classList.remove('hidden'));
        } else {
            managerElements.forEach(el => el.classList.add('hidden'));
        }

        // Update user role display
        const roleElement = document.getElementById('user-role');
        if (roleElement) {
            roleElement.textContent = role.charAt(0).toUpperCase() + role.slice(1);
        }
    }

    initializeViews() {
        const viewElements = document.querySelectorAll('.view');
        viewElements.forEach(viewEl => {
            const viewId = viewEl.id.replace('-view', '');
            this.views[viewId] = {
                element: viewEl,
                loaded: viewId === 'dashboard', // Dashboard is pre-loaded
                data: null
            };
        });
    }

    handleInitialRoute() {
        const hash = window.location.hash.substring(1);
        if (hash && this.views[hash]) {
            this.navigateToView(hash, false);
        } else {
            this.navigateToView('dashboard', false);
        }
    }

    async navigateToView(viewName, pushState = true) {
        if (this.isLoading || viewName === this.currentView) {
            return;
        }

        // Check if user has permission to access this view
        if (!this.canAccessView(viewName)) {
            this.showNotification('Access denied to this view', 'error');
            return;
        }

        this.showLoading();
        
        try {
            // Hide current view
            const currentViewEl = document.getElementById(`${this.currentView}-view`);
            if (currentViewEl) {
                currentViewEl.classList.remove('active');
            }

            // Update navigation active state
            this.updateNavigationState(viewName);

            // Load view if not already loaded
            if (!this.views[viewName].loaded) {
                await this.loadView(viewName);
            }

            // Show new view
            const newViewEl = document.getElementById(`${viewName}-view`);
            if (newViewEl) {
                newViewEl.classList.add('active');
            }

            // Update page title and subtitle
            this.updatePageTitle(viewName);

            // Update browser history
            if (pushState) {
                history.pushState({ view: viewName }, '', `#${viewName}`);
            }

            this.currentView = viewName;
            this.closeMobileMenu(); // Close mobile menu after navigation

        } catch (error) {
            console.error('Navigation error:', error);
            this.showNotification('Failed to load view', 'error');
        } finally {
            this.hideLoading();
        }
    }

    canAccessView(viewName) {
        const managerOnlyViews = ['team-reports', 'team-overview', 'analytics'];
        if (managerOnlyViews.includes(viewName) && this.userRole !== 'manager') {
            return false;
        }
        return true;
    }

    updateNavigationState(activeView) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        const activeLink = document.querySelector(`.nav-link[href="#${activeView}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    async loadView(viewName) {
        // Simulate loading view content
        // In real app, this would fetch data from API
        
        const viewEl = document.getElementById(`${viewName}-view`);
        if (!viewEl) return;

        switch (viewName) {
            case 'gitlab-metrics':
                viewEl.innerHTML = await this.loadGitLabMetricsView();
                break;
            case 'openproject':
                viewEl.innerHTML = await this.loadOpenProjectView();
                break;
            case 'sonarqube':
                viewEl.innerHTML = await this.loadSonarQubeView();
                break;
            case 'team-reports':
                if (this.userRole === 'manager') {
                    // Team reports view is handled by reports-manager.js
                    // Initialize the reports manager if not already done
                    if (window.reportsManager) {
                        window.reportsManager.initializeView();
                    }
                }
                break;
            case 'team-overview':
                if (this.userRole === 'manager') {
                    viewEl.innerHTML = await this.loadTeamOverviewView();
                }
                break;
            case 'analytics':
                if (this.userRole === 'manager') {
                    viewEl.innerHTML = await this.loadAnalyticsView();
                }
                break;
            case 'settings':
                viewEl.innerHTML = await this.loadSettingsView();
                break;
            default:
                break;
        }

        this.views[viewName].loaded = true;
    }

    updatePageTitle(viewName) {
        const titleElement = document.getElementById('page-title');
        const subtitleElement = document.getElementById('page-subtitle');
        
        const titleMap = {
            'dashboard': {
                title: 'Dashboard',
                subtitle: 'Overview of your development metrics'
            },
            'daily-reports': {
                title: 'Daily Reports',
                subtitle: 'Submit and view daily progress reports'
            },
            'team-reports': {
                title: 'Team Reports',
                subtitle: 'Review and manage team member daily reports'
            },
            'gitlab-metrics': {
                title: 'GitLab Activity',
                subtitle: 'Commits, merge requests, and code reviews'
            },
            'openproject': {
                title: 'OpenProject Tasks',
                subtitle: 'Task completion and project progress'
            },
            'sonarqube': {
                title: 'Code Quality',
                subtitle: 'SonarQube issues and quality metrics'
            },
            'team-overview': {
                title: 'Team Overview',
                subtitle: 'Team performance and collaboration metrics'
            },
            'analytics': {
                title: 'Analytics',
                subtitle: 'Detailed performance analytics and insights'
            },
            'settings': {
                title: 'Settings',
                subtitle: 'Application preferences and configuration'
            }
        };

        const viewInfo = titleMap[viewName] || { title: 'DevDash', subtitle: '' };
        
        if (titleElement) titleElement.textContent = viewInfo.title;
        if (subtitleElement) subtitleElement.textContent = viewInfo.subtitle;
        
        // Update document title
        document.title = `${viewInfo.title} - DevDash`;
    }

    handleDateRangeChange(days) {
        // Dispatch event for components to listen to
        window.dispatchEvent(new CustomEvent('dateRangeChanged', {
            detail: { days: parseInt(days) }
        }));
    }

    handleKeyboardNavigation(e) {
        // Alt + number keys for quick navigation
        if (e.altKey && e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            const navLinks = document.querySelectorAll('.nav-link:not(.hidden)');
            const index = parseInt(e.key) - 1;
            if (navLinks[index]) {
                const href = navLinks[index].getAttribute('href');
                if (href && href !== '#logout') {
                    const viewName = href.substring(1);
                    this.navigateToView(viewName);
                }
            }
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear user data
            localStorage.removeItem('userRole');
            localStorage.removeItem('userToken');
            
            // Redirect to login page
            window.location.href = '/login.html';
        }
    }

    showLoading() {
        this.isLoading = true;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        this.isLoading = false;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // View loaders - these would typically fetch from APIs
    async loadGitLabMetricsView() {
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold mb-4">Commit Activity</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Today</span>
                                <span class="font-semibold">12 commits</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">This Week</span>
                                <span class="font-semibold">47 commits</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">This Month</span>
                                <span class="font-semibold">156 commits</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold mb-4">Merge Requests</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Open</span>
                                <span class="font-semibold text-blue-600">3</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Merged</span>
                                <span class="font-semibold text-green-600">15</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Draft</span>
                                <span class="font-semibold text-yellow-600">2</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold mb-4">Code Reviews</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Reviewed</span>
                                <span class="font-semibold">8</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Avg Response</span>
                                <span class="font-semibold">2.5h</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Approval Rate</span>
                                <span class="font-semibold text-green-600">94%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div class="space-y-4">
                        <div class="border-l-4 border-green-500 pl-4">
                            <p class="font-medium">Merged MR #247: Add user authentication</p>
                            <p class="text-sm text-gray-600">2 hours ago • +234 -45 lines</p>
                        </div>
                        <div class="border-l-4 border-blue-500 pl-4">
                            <p class="font-medium">Opened MR #248: Fix responsive layout issues</p>
                            <p class="text-sm text-gray-600">4 hours ago • +89 -23 lines</p>
                        </div>
                        <div class="border-l-4 border-yellow-500 pl-4">
                            <p class="font-medium">Reviewed MR #245: Update dependency versions</p>
                            <p class="text-sm text-gray-600">6 hours ago • Approved with suggestions</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadOpenProjectView() {
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-gray-900">8</div>
                            <div class="text-sm text-gray-600">Open Tasks</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">24</div>
                            <div class="text-sm text-gray-600">Completed</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-600">3</div>
                            <div class="text-sm text-gray-600">In Progress</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-red-600">2</div>
                            <div class="text-sm text-gray-600">Overdue</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">Task List</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Due Date</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Implement user dashboard</td>
                                    <td><span class="badge info">In Progress</span></td>
                                    <td><span class="badge warning">High</span></td>
                                    <td>2024-03-15</td>
                                    <td>75%</td>
                                </tr>
                                <tr>
                                    <td>Fix authentication bug</td>
                                    <td><span class="badge error">Overdue</span></td>
                                    <td><span class="badge error">Critical</span></td>
                                    <td>2024-03-10</td>
                                    <td>90%</td>
                                </tr>
                                <tr>
                                    <td>Update documentation</td>
                                    <td><span class="badge">Open</span></td>
                                    <td><span class="badge info">Medium</span></td>
                                    <td>2024-03-20</td>
                                    <td>0%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    async loadSonarQubeView() {
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-green-600">A</div>
                                <div class="text-sm text-gray-600">Quality Gate</div>
                            </div>
                            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-gray-900">0</div>
                                <div class="text-sm text-gray-600">Bugs</div>
                            </div>
                            <i class="fas fa-bug text-gray-400 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-yellow-600">3</div>
                                <div class="text-sm text-gray-600">Code Smells</div>
                            </div>
                            <i class="fas fa-exclamation-triangle text-yellow-600 text-2xl"></i>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="text-2xl font-bold text-blue-600">85%</div>
                                <div class="text-sm text-gray-600">Coverage</div>
                            </div>
                            <i class="fas fa-shield-alt text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold mb-4">Recent Issues Resolved</h3>
                        <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                                <div class="bg-green-100 p-2 rounded-full">
                                    <i class="fas fa-check text-green-600 text-sm"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-sm">SQL Injection vulnerability</p>
                                    <p class="text-xs text-gray-600">Security hotspot resolved</p>
                                    <p class="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-3">
                                <div class="bg-green-100 p-2 rounded-full">
                                    <i class="fas fa-check text-green-600 text-sm"></i>
                                </div>
                                <div>
                                    <p class="font-medium text-sm">Unused import statement</p>
                                    <p class="text-xs text-gray-600">Code smell fixed</p>
                                    <p class="text-xs text-gray-500">5 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h3 class="text-lg font-semibold mb-4">Quality Metrics</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Maintainability Rating</span>
                                <span class="font-semibold text-green-600">A</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Reliability Rating</span>
                                <span class="font-semibold text-green-600">A</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Security Rating</span>
                                <span class="font-semibold text-green-600">A</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-sm text-gray-600">Technical Debt</span>
                                <span class="font-semibold">2h 30m</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadTeamOverviewView() {
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-gray-900">8</div>
                            <div class="text-sm text-gray-600">Team Members</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-green-600">94%</div>
                            <div class="text-sm text-gray-600">Avg Performance</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-blue-600">156</div>
                            <div class="text-sm text-gray-600">Tasks Completed</div>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div class="text-center">
                            <div class="text-2xl font-bold text-yellow-600">12</div>
                            <div class="text-sm text-gray-600">Active Projects</div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">Team Performance</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Developer</th>
                                    <th>Tasks</th>
                                    <th>Commits</th>
                                    <th>Code Quality</th>
                                    <th>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>John Developer</td>
                                    <td>24 completed</td>
                                    <td>156 commits</td>
                                    <td><span class="badge success">A</span></td>
                                    <td><span class="badge success">Excellent</span></td>
                                </tr>
                                <tr>
                                    <td>Jane Smith</td>
                                    <td>18 completed</td>
                                    <td>98 commits</td>
                                    <td><span class="badge success">A</span></td>
                                    <td><span class="badge success">Good</span></td>
                                </tr>
                                <tr>
                                    <td>Bob Wilson</td>
                                    <td>21 completed</td>
                                    <td>134 commits</td>
                                    <td><span class="badge warning">B</span></td>
                                    <td><span class="badge info">Good</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    async loadAnalyticsView() {
        return `
            <div class="space-y-6">
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold mb-4">Advanced Analytics</h3>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-medium mb-2">Team Productivity Trends</h4>
                            <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
                                <span class="text-gray-500">Productivity Chart</span>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-medium mb-2">Code Quality Distribution</h4>
                            <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
                                <span class="text-gray-500">Quality Chart</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadSettingsView() {
        return `
            <div class="max-w-4xl mx-auto space-y-6">
                <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 class="text-lg font-semibold mb-6">User Preferences</h3>
                    <form class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Theme
                                </label>
                                <select class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    <option>Light</option>
                                    <option>Dark</option>
                                    <option>Auto</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Time Zone
                                </label>
                                <select class="w-full border border-gray-300 rounded-md px-3 py-2">
                                    <option>UTC</option>
                                    <option>America/New_York</option>
                                    <option>Europe/London</option>
                                    <option>Asia/Tokyo</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" class="mr-2" checked>
                                <span class="text-sm text-gray-700">Enable email notifications</span>
                            </label>
                        </div>
                        
                        <div class="flex justify-end">
                            <button type="submit" class="btn btn-primary">
                                Save Settings
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});