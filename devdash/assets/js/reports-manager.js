/**
 * DevDash Team Reports Manager
 * Handles manager-specific report review, approval, and management functionality
 */

class ReportsManager {
    constructor() {
        this.reports = [];
        this.filteredReports = [];
        this.selectedReports = new Set();
        this.currentPage = 1;
        this.pageSize = 10;
        this.filters = {
            status: 'all',
            member: 'all',
            date: '',
            search: ''
        };
        this.sortBy = 'date';
        this.sortOrder = 'desc';
        this.isLoading = false;
        this.teamMembers = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTeamMembers();
        this.loadReports();
        this.initializeFilters();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Search and filter controls
        const searchInput = document.getElementById('report-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.filters.search = e.target.value;
                this.applyFilters();
            }, 300));
        }

        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.applyFilters();
            });
        }

        const memberFilter = document.getElementById('member-filter');
        if (memberFilter) {
            memberFilter.addEventListener('change', (e) => {
                this.filters.member = e.target.value;
                this.applyFilters();
            });
        }

        const dateFilter = document.getElementById('date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.filters.date = e.target.value;
                this.applyFilters();
            });
        }

        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Selection controls
        const selectAllCheckbox = document.getElementById('select-all-reports');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                this.toggleSelectAll(e.target.checked);
            });
        }

        // Bulk actions
        const bulkApproveBtn = document.querySelector('.bulk-approve-btn');
        if (bulkApproveBtn) {
            bulkApproveBtn.addEventListener('click', () => {
                this.confirmBulkAction('approve');
            });
        }

        const bulkRejectBtn = document.querySelector('.bulk-reject-btn');
        if (bulkRejectBtn) {
            bulkRejectBtn.addEventListener('click', () => {
                this.confirmBulkAction('reject');
            });
        }

        // Export functionality
        const exportBtn = document.getElementById('export-reports-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                this.showExportOptions(e);
            });
        }

        // Modal controls
        const closeModalBtn = document.getElementById('close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Bulk confirmation modal
        const bulkCancelBtn = document.getElementById('bulk-cancel-btn');
        const bulkConfirmBtn = document.getElementById('bulk-confirm-btn');
        
        if (bulkCancelBtn) {
            bulkCancelBtn.addEventListener('click', () => {
                this.closeBulkConfirmModal();
            });
        }

        if (bulkConfirmBtn) {
            bulkConfirmBtn.addEventListener('click', () => {
                this.executeBulkAction();
            });
        }

        // Pagination
        const prevBtn = document.getElementById('reports-prev-btn');
        const nextBtn = document.getElementById('reports-next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.goToPrevPage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.goToNextPage();
            });
        }

        // Notifications
        const notificationsBtn = document.getElementById('notifications-btn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleNotificationPanel();
            });
        }

        // Close modals and panels on outside click
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });

        // Auto-refresh reports
        this.setupAutoRefresh();
    }

    async loadTeamMembers() {
        try {
            // In production, this would be an API call
            this.teamMembers = [
                { id: '1', name: 'Alice Johnson', initials: 'AJ', avatar: 'blue', role: 'Senior Developer' },
                { id: '2', name: 'Bob Wilson', initials: 'BW', avatar: 'green', role: 'Frontend Developer' },
                { id: '3', name: 'Carol Martinez', initials: 'CM', avatar: 'purple', role: 'Backend Developer' },
                { id: '4', name: 'David Chen', initials: 'DC', avatar: 'yellow', role: 'DevOps Engineer' },
                { id: '5', name: 'Emma Davis', initials: 'ED', avatar: 'pink', role: 'Full Stack Developer' },
                { id: '6', name: 'Frank Miller', initials: 'FM', avatar: 'red', role: 'QA Engineer' },
                { id: '7', name: 'Grace Liu', initials: 'GL', avatar: 'indigo', role: 'UI/UX Developer' },
                { id: '8', name: 'Henry Kim', initials: 'HK', avatar: 'gray', role: 'Mobile Developer' }
            ];

            this.populateMemberFilter();
        } catch (error) {
            console.error('Failed to load team members:', error);
        }
    }

    populateMemberFilter() {
        const memberFilter = document.getElementById('member-filter');
        if (!memberFilter) return;

        // Clear existing options except "All Members"
        memberFilter.innerHTML = '<option value="all">All Members</option>';

        // Add team member options
        this.teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            memberFilter.appendChild(option);
        });
    }

    async loadReports() {
        try {
            this.showLoading();
            
            // Generate sample reports data - in production, this would be an API call
            this.reports = await this.generateSampleReports();
            
            this.applyFilters();
            this.updateCounts();
            this.updateNotifications();
            
        } catch (error) {
            console.error('Failed to load reports:', error);
            this.showNotification('Failed to load team reports', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async generateSampleReports() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const reports = [];
        const statuses = ['pending', 'approved', 'rejected'];
        const priorities = ['high', 'medium', 'low'];

        // Generate reports for the last 30 days
        for (let i = 0; i < 45; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Skip weekends for some realism
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            // Generate 1-3 reports per day
            const reportsPerDay = Math.floor(Math.random() * 3) + 1;
            
            for (let j = 0; j < reportsPerDay; j++) {
                const member = this.teamMembers[Math.floor(Math.random() * this.teamMembers.length)];
                const status = i < 7 ? (Math.random() > 0.3 ? 'pending' : 'approved') : 
                              statuses[Math.floor(Math.random() * statuses.length)];
                
                const report = {
                    id: `report-${Date.now()}-${i}-${j}`,
                    memberId: member.id,
                    memberName: member.name,
                    memberInitials: member.initials,
                    memberAvatar: member.avatar,
                    memberRole: member.role,
                    date: date.toISOString().split('T')[0],
                    submittedAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
                    status: status,
                    priority: priorities[Math.floor(Math.random() * priorities.length)],
                    
                    // Report content
                    tasksCompleted: Math.floor(Math.random() * 8) + 1,
                    hoursWorked: (Math.random() * 4 + 6).toFixed(1),
                    accomplishments: this.generateAccomplishments(),
                    challenges: Math.random() > 0.7 ? this.generateChallenges() : '',
                    tomorrowPlans: this.generateTomorrowPlans(),
                    
                    // Metadata
                    commitCount: Math.floor(Math.random() * 15) + 2,
                    mergeRequests: Math.floor(Math.random() * 3),
                    codeReviews: Math.floor(Math.random() * 5),
                    
                    // Manager feedback
                    comments: status !== 'pending' ? this.generateComments(status) : [],
                    approvedBy: status === 'approved' ? 'Manager' : null,
                    approvedAt: status === 'approved' ? new Date(date.getTime() + 24 * 60 * 60 * 1000) : null,
                    rejectedBy: status === 'rejected' ? 'Manager' : null,
                    rejectedAt: status === 'rejected' ? new Date(date.getTime() + 24 * 60 * 60 * 1000) : null,
                    rejectionReason: status === 'rejected' ? this.generateRejectionReason() : null
                };

                reports.push(report);
            }
        }

        return reports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    generateAccomplishments() {
        const accomplishments = [
            "Completed user authentication module with JWT integration",
            "Fixed critical performance issue in database queries",
            "Implemented responsive design for mobile dashboard",
            "Added comprehensive unit tests for payment processing",
            "Optimized API response times by 40% through caching",
            "Reviewed and merged 3 pull requests from team members",
            "Updated documentation for new API endpoints",
            "Resolved 5 high-priority bugs in production",
            "Implemented new search functionality with advanced filters",
            "Conducted code review session with junior developers"
        ];
        
        const count = Math.floor(Math.random() * 3) + 1;
        const selected = [];
        
        for (let i = 0; i < count; i++) {
            const item = accomplishments[Math.floor(Math.random() * accomplishments.length)];
            if (!selected.includes(item)) {
                selected.push(item);
            }
        }
        
        return selected.join('\n\n');
    }

    generateChallenges() {
        const challenges = [
            "Encountered integration issues with third-party payment gateway",
            "Database migration took longer than expected due to data corruption",
            "Difficulty coordinating with external API team for schema changes",
            "Performance bottlenecks in legacy code requiring refactoring",
            "Complex merge conflicts requiring careful resolution",
            "Testing environment instability affecting deployment schedule",
            "Unclear requirements leading to multiple implementation iterations"
        ];
        
        return challenges[Math.floor(Math.random() * challenges.length)];
    }

    generateTomorrowPlans() {
        const plans = [
            "Continue work on user dashboard improvements",
            "Begin implementation of notification system",
            "Code review for team members' pull requests",
            "Investigate and fix reported performance issues",
            "Update API documentation and conduct team training",
            "Complete integration testing for new features",
            "Refactor legacy authentication module",
            "Implement monitoring and logging improvements"
        ];
        
        const count = Math.floor(Math.random() * 2) + 1;
        const selected = [];
        
        for (let i = 0; i < count; i++) {
            const item = plans[Math.floor(Math.random() * plans.length)];
            if (!selected.includes(item)) {
                selected.push(item);
            }
        }
        
        return selected.join('\n\n');
    }

    generateComments(status) {
        if (status === 'approved') {
            const approvalComments = [
                "Great work on the authentication module! The implementation looks solid.",
                "Excellent progress on the dashboard. The responsive design is particularly well done.",
                "Good job resolving those critical bugs. The fixes look comprehensive.",
                "Nice work on the performance optimizations. The 40% improvement is impressive.",
                "Well done on the API documentation. It's clear and comprehensive."
            ];
            
            return [{
                id: 'comment-1',
                author: 'Manager',
                content: approvalComments[Math.floor(Math.random() * approvalComments.length)],
                timestamp: new Date(),
                type: 'approval'
            }];
        } else if (status === 'rejected') {
            const rejectionComments = [
                "Please provide more details about the testing approach for the new features.",
                "The reported hours don't align with the accomplishments listed. Please clarify.",
                "Need more information about the challenges faced and how they were addressed.",
                "The plans for tomorrow seem too ambitious given the current workload.",
                "Please include more specific metrics about the performance improvements."
            ];
            
            return [{
                id: 'comment-1',
                author: 'Manager',
                content: rejectionComments[Math.floor(Math.random() * rejectionComments.length)],
                timestamp: new Date(),
                type: 'rejection'
            }];
        }
        
        return [];
    }

    generateRejectionReason() {
        const reasons = [
            "Insufficient detail in accomplishments",
            "Hours reported don't match work completed",
            "Missing information about challenges",
            "Plans for tomorrow are not specific enough",
            "Need clarification on technical approach"
        ];
        
        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    applyFilters() {
        let filtered = [...this.reports];

        // Apply status filter
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(report => report.status === this.filters.status);
        }

        // Apply member filter
        if (this.filters.member !== 'all') {
            filtered = filtered.filter(report => report.memberId === this.filters.member);
        }

        // Apply date filter
        if (this.filters.date) {
            filtered = filtered.filter(report => report.date === this.filters.date);
        }

        // Apply search filter
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(report => 
                report.memberName.toLowerCase().includes(searchTerm) ||
                report.accomplishments.toLowerCase().includes(searchTerm) ||
                report.challenges.toLowerCase().includes(searchTerm) ||
                report.tomorrowPlans.toLowerCase().includes(searchTerm)
            );
        }

        this.filteredReports = filtered;
        this.currentPage = 1; // Reset to first page
        this.clearSelection();
        this.renderReports();
        this.updatePagination();
    }

    clearFilters() {
        this.filters = {
            status: 'all',
            member: 'all',
            date: '',
            search: ''
        };

        // Reset form controls
        const controls = [
            { id: 'report-search', value: '' },
            { id: 'status-filter', value: 'all' },
            { id: 'member-filter', value: 'all' },
            { id: 'date-filter', value: '' }
        ];

        controls.forEach(control => {
            const element = document.getElementById(control.id);
            if (element) {
                element.value = control.value;
            }
        });

        this.applyFilters();
    }

    renderReports() {
        const container = document.getElementById('reports-container');
        const loading = document.getElementById('reports-loading');
        const empty = document.getElementById('reports-empty');
        
        if (!container) return;

        // Hide loading and empty states
        if (loading) loading.classList.add('hidden');
        if (empty) empty.classList.add('hidden');

        if (this.filteredReports.length === 0) {
            if (empty) empty.classList.remove('hidden');
            return;
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredReports.length);
        const currentPageReports = this.filteredReports.slice(startIndex, endIndex);

        // Render reports
        container.innerHTML = currentPageReports.map(report => this.renderReportItem(report)).join('');

        // Add event listeners to report items
        currentPageReports.forEach(report => {
            this.addReportEventListeners(report);
        });
    }

    renderReportItem(report) {
        const formattedDate = new Date(report.submittedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const priorityClass = `priority-${report.priority}`;
        const avatarClass = `avatar-${report.memberAvatar}`;
        
        return `
            <div class="report-item ${report.status}" data-report-id="${report.id}">
                <div class="flex items-start space-x-4">
                    <!-- Selection Checkbox -->
                    <div class="flex-shrink-0 pt-1">
                        <input type="checkbox" class="report-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                               data-report-id="${report.id}">
                    </div>
                    
                    <!-- Member Avatar -->
                    <div class="team-member-avatar ${avatarClass}">
                        ${report.memberInitials}
                    </div>
                    
                    <!-- Report Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">${report.memberName}</h3>
                                <p class="text-sm text-gray-500">${report.memberRole}</p>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="status-badge ${report.status}">${report.status}</span>
                                <span class="text-sm text-gray-500">${formattedDate}</span>
                            </div>
                        </div>
                        
                        <!-- Report Preview -->
                        <div class="report-content-preview mb-3">
                            ${report.accomplishments.substring(0, 150)}${report.accomplishments.length > 150 ? '...' : ''}
                        </div>
                        
                        <!-- Report Stats -->
                        <div class="report-stats">
                            <div class="stat">
                                <i class="fas fa-tasks"></i>
                                <span>${report.tasksCompleted} tasks</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-clock"></i>
                                <span>${report.hoursWorked}h</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-code-branch"></i>
                                <span>${report.commitCount} commits</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-merge"></i>
                                <span>${report.mergeRequests} MRs</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="report-actions">
                        <button class="view-report-btn p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50" 
                                data-report-id="${report.id}" title="View details">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${report.status === 'pending' ? `
                            <button class="approve-report-btn p-2 text-gray-600 hover:text-green-600 rounded-full hover:bg-green-50" 
                                    data-report-id="${report.id}" title="Approve">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="reject-report-btn p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50" 
                                    data-report-id="${report.id}" title="Reject">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Priority Indicator -->
                <div class="priority-indicator ${priorityClass}"></div>
            </div>
        `;
    }

    addReportEventListeners(report) {
        // Checkbox selection
        const checkbox = document.querySelector(`[data-report-id="${report.id}"].report-checkbox`);
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedReports.add(report.id);
                } else {
                    this.selectedReports.delete(report.id);
                }
                this.updateSelectionUI();
            });
        }

        // View report details
        const viewBtn = document.querySelector(`.view-report-btn[data-report-id="${report.id}"]`);
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                this.showReportDetail(report);
            });
        }

        // Quick approve
        const approveBtn = document.querySelector(`.approve-report-btn[data-report-id="${report.id}"]`);
        if (approveBtn) {
            approveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.approveReport(report.id);
            });
        }

        // Quick reject
        const rejectBtn = document.querySelector(`.reject-report-btn[data-report-id="${report.id}"]`);
        if (rejectBtn) {
            rejectBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.rejectReport(report.id);
            });
        }

        // Click on report item to view details
        const reportItem = document.querySelector(`.report-item[data-report-id="${report.id}"]`);
        if (reportItem) {
            reportItem.addEventListener('click', (e) => {
                // Don't trigger if clicking on buttons or checkboxes
                if (e.target.closest('button') || e.target.closest('input')) {
                    return;
                }
                this.showReportDetail(report);
            });
        }
    }

    showReportDetail(report) {
        const modal = document.getElementById('report-detail-modal');
        const modalContent = document.getElementById('modal-content');
        
        if (!modal || !modalContent) return;

        modalContent.innerHTML = this.renderReportDetail(report);
        modal.classList.remove('hidden');
        
        // Add event listeners for modal actions
        this.addModalEventListeners(report);
        
        // Focus management for accessibility
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    renderReportDetail(report) {
        const formattedSubmissionDate = new Date(report.submittedAt).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="modal-content">
                <!-- Report Header -->
                <div class="flex items-start justify-between mb-6">
                    <div class="flex items-center space-x-4">
                        <div class="team-member-avatar avatar-${report.memberAvatar}">
                            ${report.memberInitials}
                        </div>
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900">${report.memberName}</h2>
                            <p class="text-gray-600">${report.memberRole}</p>
                            <p class="text-sm text-gray-500">Submitted on ${formattedSubmissionDate}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="status-badge ${report.status}">${report.status}</span>
                        <div class="priority-indicator priority-${report.priority} relative"></div>
                    </div>
                </div>

                <!-- Report Metrics -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-gray-900">${report.tasksCompleted}</div>
                        <div class="text-sm text-gray-600">Tasks Completed</div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-gray-900">${report.hoursWorked}</div>
                        <div class="text-sm text-gray-600">Hours Worked</div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-gray-900">${report.commitCount}</div>
                        <div class="text-sm text-gray-600">Commits</div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-gray-900">${report.codeReviews}</div>
                        <div class="text-sm text-gray-600">Code Reviews</div>
                    </div>
                </div>

                <!-- Report Content -->
                <div class="space-y-6">
                    <!-- Accomplishments -->
                    <div class="report-detail-section">
                        <label class="report-detail-label">Key Accomplishments</label>
                        <div class="report-detail-content">${report.accomplishments}</div>
                    </div>

                    <!-- Challenges -->
                    ${report.challenges ? `
                        <div class="report-detail-section">
                            <label class="report-detail-label">Challenges & Blockers</label>
                            <div class="report-detail-content">${report.challenges}</div>
                        </div>
                    ` : ''}

                    <!-- Tomorrow's Plans -->
                    <div class="report-detail-section">
                        <label class="report-detail-label">Plans for Tomorrow</label>
                        <div class="report-detail-content">${report.tomorrowPlans}</div>
                    </div>

                    <!-- Manager Comments -->
                    ${report.comments.length > 0 || report.status === 'pending' ? `
                        <div class="report-detail-section">
                            <label class="report-detail-label">Manager Feedback</label>
                            <div class="comment-thread">
                                ${report.comments.map(comment => `
                                    <div class="comment">
                                        <div class="comment-header">
                                            <span class="comment-author">${comment.author}</span>
                                            <span class="comment-time">${new Date(comment.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div class="comment-content">${comment.content}</div>
                                    </div>
                                `).join('')}
                                
                                ${report.status === 'pending' ? `
                                    <div class="mt-4">
                                        <textarea id="new-comment" rows="3" 
                                                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                  placeholder="Add a comment for the team member..."></textarea>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Modal Actions -->
                <div class="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
                    <div class="text-sm text-gray-500">
                        Report for ${new Date(report.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                    
                    <div class="flex space-x-3">
                        ${report.status === 'pending' ? `
                            <button id="modal-reject-btn" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" 
                                    data-report-id="${report.id}">
                                <i class="fas fa-times mr-2"></i>
                                Reject Report
                            </button>
                            <button id="modal-approve-btn" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" 
                                    data-report-id="${report.id}">
                                <i class="fas fa-check mr-2"></i>
                                Approve Report
                            </button>
                        ` : `
                            <span class="text-sm text-gray-500">
                                ${report.status === 'approved' ? 'Approved' : 'Rejected'} by ${report.approvedBy || report.rejectedBy} 
                                on ${new Date(report.approvedAt || report.rejectedAt).toLocaleDateString()}
                            </span>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    addModalEventListeners(report) {
        const approveBtn = document.getElementById('modal-approve-btn');
        const rejectBtn = document.getElementById('modal-reject-btn');
        
        if (approveBtn) {
            approveBtn.addEventListener('click', () => {
                const comment = document.getElementById('new-comment')?.value || '';
                this.approveReportWithComment(report.id, comment);
                this.closeModal();
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                const comment = document.getElementById('new-comment')?.value || '';
                this.rejectReportWithComment(report.id, comment);
                this.closeModal();
            });
        }
    }

    async approveReport(reportId, comment = '') {
        try {
            // Find and update the report
            const reportIndex = this.reports.findIndex(r => r.id === reportId);
            if (reportIndex === -1) return;

            this.reports[reportIndex].status = 'approved';
            this.reports[reportIndex].approvedBy = 'Manager';
            this.reports[reportIndex].approvedAt = new Date();
            
            if (comment) {
                this.reports[reportIndex].comments.push({
                    id: `comment-${Date.now()}`,
                    author: 'Manager',
                    content: comment,
                    timestamp: new Date(),
                    type: 'approval'
                });
            }

            // In production, this would be an API call
            await this.simulateApiCall();

            this.showNotification('Report approved successfully', 'success');
            this.selectedReports.delete(reportId);
            this.applyFilters();
            this.updateCounts();

        } catch (error) {
            console.error('Failed to approve report:', error);
            this.showNotification('Failed to approve report', 'error');
        }
    }

    async rejectReport(reportId, comment = '', reason = '') {
        try {
            // Find and update the report
            const reportIndex = this.reports.findIndex(r => r.id === reportId);
            if (reportIndex === -1) return;

            this.reports[reportIndex].status = 'rejected';
            this.reports[reportIndex].rejectedBy = 'Manager';
            this.reports[reportIndex].rejectedAt = new Date();
            this.reports[reportIndex].rejectionReason = reason || 'Additional information required';
            
            if (comment) {
                this.reports[reportIndex].comments.push({
                    id: `comment-${Date.now()}`,
                    author: 'Manager',
                    content: comment,
                    timestamp: new Date(),
                    type: 'rejection'
                });
            }

            // In production, this would be an API call
            await this.simulateApiCall();

            this.showNotification('Report rejected', 'warning');
            this.selectedReports.delete(reportId);
            this.applyFilters();
            this.updateCounts();

        } catch (error) {
            console.error('Failed to reject report:', error);
            this.showNotification('Failed to reject report', 'error');
        }
    }

    approveReportWithComment(reportId, comment) {
        this.approveReport(reportId, comment);
    }

    rejectReportWithComment(reportId, comment) {
        this.rejectReport(reportId, comment);
    }

    // Bulk actions
    confirmBulkAction(action) {
        if (this.selectedReports.size === 0) {
            this.showNotification('No reports selected', 'warning');
            return;
        }

        const modal = document.getElementById('bulk-confirm-modal');
        const title = document.getElementById('bulk-modal-title');
        const message = document.getElementById('bulk-confirm-message');
        const icon = document.getElementById('bulk-confirm-icon');
        const confirmBtn = document.getElementById('bulk-confirm-btn');

        if (!modal || !title || !message || !icon || !confirmBtn) return;

        // Set up modal content based on action
        if (action === 'approve') {
            title.textContent = 'Approve Selected Reports';
            message.textContent = `Are you sure you want to approve ${this.selectedReports.size} selected report${this.selectedReports.size > 1 ? 's' : ''}?`;
            icon.className = 'fas fa-check-circle text-4xl text-green-500 mb-4';
            confirmBtn.className = 'px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700';
            confirmBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Approve Reports';
        } else if (action === 'reject') {
            title.textContent = 'Reject Selected Reports';
            message.textContent = `Are you sure you want to reject ${this.selectedReports.size} selected report${this.selectedReports.size > 1 ? 's' : ''}?`;
            icon.className = 'fas fa-times-circle text-4xl text-red-500 mb-4';
            confirmBtn.className = 'px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700';
            confirmBtn.innerHTML = '<i class="fas fa-times mr-2"></i>Reject Reports';
        }

        this.pendingBulkAction = action;
        modal.classList.remove('hidden');
    }

    async executeBulkAction() {
        const action = this.pendingBulkAction;
        const selectedIds = Array.from(this.selectedReports);

        this.closeBulkConfirmModal();

        try {
            // Process reports in batches to avoid overwhelming the UI
            const batchSize = 5;
            const batches = [];
            
            for (let i = 0; i < selectedIds.length; i += batchSize) {
                batches.push(selectedIds.slice(i, i + batchSize));
            }

            let processedCount = 0;
            
            for (const batch of batches) {
                const promises = batch.map(reportId => {
                    if (action === 'approve') {
                        return this.approveReport(reportId);
                    } else {
                        return this.rejectReport(reportId);
                    }
                });

                await Promise.all(promises);
                processedCount += batch.length;

                // Show progress for large operations
                if (selectedIds.length > 10) {
                    this.showNotification(`Processed ${processedCount} of ${selectedIds.length} reports...`, 'info');
                }
            }

            const actionText = action === 'approve' ? 'approved' : 'rejected';
            this.showNotification(`Successfully ${actionText} ${selectedIds.length} report${selectedIds.length > 1 ? 's' : ''}`, 'success');

        } catch (error) {
            console.error(`Failed to execute bulk ${action}:`, error);
            this.showNotification(`Failed to ${action} selected reports`, 'error');
        }
    }

    // Selection management
    toggleSelectAll(checked) {
        const visibleReports = this.getCurrentPageReports();
        
        if (checked) {
            visibleReports.forEach(report => {
                if (report.status === 'pending') { // Only select pending reports
                    this.selectedReports.add(report.id);
                }
            });
        } else {
            this.selectedReports.clear();
        }

        this.updateSelectionUI();
    }

    getCurrentPageReports() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredReports.length);
        return this.filteredReports.slice(startIndex, endIndex);
    }

    updateSelectionUI() {
        // Update checkboxes
        document.querySelectorAll('.report-checkbox').forEach(checkbox => {
            const reportId = checkbox.dataset.reportId;
            checkbox.checked = this.selectedReports.has(reportId);
        });

        // Update select all checkbox
        const selectAllCheckbox = document.getElementById('select-all-reports');
        if (selectAllCheckbox) {
            const visiblePendingReports = this.getCurrentPageReports().filter(r => r.status === 'pending');
            const selectedVisibleCount = visiblePendingReports.filter(r => this.selectedReports.has(r.id)).length;
            
            if (selectedVisibleCount === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (selectedVisibleCount === visiblePendingReports.length) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }

        // Update selection count and bulk actions
        const selectedCount = document.getElementById('selected-count');
        const bulkActionsPanel = document.getElementById('bulk-actions-panel');
        
        if (selectedCount) {
            selectedCount.textContent = `${this.selectedReports.size} selected`;
        }

        if (bulkActionsPanel) {
            if (this.selectedReports.size > 0) {
                bulkActionsPanel.classList.remove('hidden');
            } else {
                bulkActionsPanel.classList.add('hidden');
            }
        }

        // Update bulk actions button in header
        const bulkActionsBtn = document.getElementById('bulk-actions-btn');
        if (bulkActionsBtn) {
            bulkActionsBtn.disabled = this.selectedReports.size === 0;
        }
    }

    clearSelection() {
        this.selectedReports.clear();
        this.updateSelectionUI();
    }

    // Pagination
    goToPrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderReports();
            this.updatePagination();
            this.clearSelection();
        }
    }

    goToNextPage() {
        const totalPages = Math.ceil(this.filteredReports.length / this.pageSize);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderReports();
            this.updatePagination();
            this.clearSelection();
        }
    }

    updatePagination() {
        const pagination = document.getElementById('reports-pagination');
        const prevBtn = document.getElementById('reports-prev-btn');
        const nextBtn = document.getElementById('reports-next-btn');
        const startEl = document.getElementById('reports-start');
        const endEl = document.getElementById('reports-end');
        const totalEl = document.getElementById('reports-total');

        if (!pagination) return;

        const totalReports = this.filteredReports.length;
        const totalPages = Math.ceil(totalReports / this.pageSize);

        if (totalReports === 0) {
            pagination.classList.add('hidden');
            return;
        }

        pagination.classList.remove('hidden');

        const startIndex = (this.currentPage - 1) * this.pageSize + 1;
        const endIndex = Math.min(this.currentPage * this.pageSize, totalReports);

        if (startEl) startEl.textContent = startIndex;
        if (endEl) endEl.textContent = endIndex;
        if (totalEl) totalEl.textContent = totalReports;

        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
    }

    // Counts and stats
    updateCounts() {
        const totalReports = this.reports.length;
        const pendingReports = this.reports.filter(r => r.status === 'pending');
        const approvedToday = this.reports.filter(r => {
            const today = new Date().toISOString().split('T')[0];
            return r.status === 'approved' && r.approvedAt && 
                   new Date(r.approvedAt).toISOString().split('T')[0] === today;
        });

        // Update header counts
        const totalBadge = document.getElementById('total-reports-badge');
        const pendingCount = document.getElementById('pending-count');
        const approvedTodayCount = document.getElementById('approved-today-count');

        if (totalBadge) {
            totalBadge.textContent = `${totalReports} report${totalReports !== 1 ? 's' : ''}`;
        }

        if (pendingCount) {
            pendingCount.textContent = pendingReports.length;
        }

        if (approvedTodayCount) {
            approvedTodayCount.textContent = approvedToday.length;
        }

        // Update sidebar badge
        const sidebarBadge = document.getElementById('pending-reports-badge');
        if (sidebarBadge) {
            if (pendingReports.length > 0) {
                sidebarBadge.textContent = pendingReports.length;
                sidebarBadge.classList.remove('hidden');
            } else {
                sidebarBadge.classList.add('hidden');
            }
        }
    }

    // Notifications
    updateNotifications() {
        const pendingReports = this.reports.filter(r => r.status === 'pending');
        const overduePending = pendingReports.filter(r => {
            const submittedTime = new Date(r.submittedAt);
            const now = new Date();
            const hoursSinceSubmission = (now - submittedTime) / (1000 * 60 * 60);
            return hoursSinceSubmission > 24; // Consider overdue after 24 hours
        });

        // Update notification badge
        const notificationBadge = document.getElementById('notification-badge');
        if (notificationBadge) {
            const notificationCount = pendingReports.length + overduePending.length;
            if (notificationCount > 0) {
                notificationBadge.textContent = notificationCount;
                notificationBadge.classList.remove('hidden');
            } else {
                notificationBadge.classList.add('hidden');
            }
        }

        // Update bulk approve button in header
        const bulkApproveHeaderBtn = document.getElementById('bulk-approve-btn');
        if (bulkApproveHeaderBtn) {
            if (pendingReports.length > 0) {
                bulkApproveHeaderBtn.classList.remove('hidden');
                bulkApproveHeaderBtn.title = `${pendingReports.length} reports pending approval`;
            } else {
                bulkApproveHeaderBtn.classList.add('hidden');
            }
        }
    }

    toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (!panel) return;

        if (panel.classList.contains('hidden')) {
            this.loadNotifications();
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    loadNotifications() {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        const pendingReports = this.reports.filter(r => r.status === 'pending');
        const overduePending = pendingReports.filter(r => {
            const submittedTime = new Date(r.submittedAt);
            const now = new Date();
            const hoursSinceSubmission = (now - submittedTime) / (1000 * 60 * 60);
            return hoursSinceSubmission > 24;
        });

        const notifications = [];

        // Add overdue notifications
        overduePending.forEach(report => {
            notifications.push({
                id: `overdue-${report.id}`,
                type: 'overdue',
                title: `Overdue Report Review`,
                subtitle: `${report.memberName}'s report requires attention`,
                time: this.formatTimeAgo(report.submittedAt),
                icon: 'report',
                unread: true,
                reportId: report.id
            });
        });

        // Add recent pending notifications
        pendingReports.slice(0, 5).forEach(report => {
            if (!overduePending.includes(report)) {
                notifications.push({
                    id: `pending-${report.id}`,
                    type: 'pending',
                    title: `New Report Submitted`,
                    subtitle: `${report.memberName} submitted today's report`,
                    time: this.formatTimeAgo(report.submittedAt),
                    icon: 'report',
                    unread: true,
                    reportId: report.id
                });
            }
        });

        if (notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="p-4 text-center text-gray-500">
                    <i class="fas fa-check-circle text-2xl mb-2 text-green-500"></i>
                    <p>All caught up!</p>
                    <p class="text-sm">No pending notifications.</p>
                </div>
            `;
        } else {
            notificationsList.innerHTML = notifications.map(notification => `
                <div class="notification-item ${notification.unread ? 'unread' : ''}" data-notification-id="${notification.id}">
                    <div class="notification-content">
                        <div class="notification-icon ${notification.icon}">
                            <i class="fas ${notification.type === 'overdue' ? 'fa-exclamation-triangle' : 'fa-clipboard-check'}"></i>
                        </div>
                        <div class="notification-text">
                            <div class="notification-title">${notification.title}</div>
                            <div class="notification-subtitle">${notification.subtitle}</div>
                            <div class="notification-time">${notification.time}</div>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click handlers for notifications
            notifications.forEach(notification => {
                const element = document.querySelector(`[data-notification-id="${notification.id}"]`);
                if (element && notification.reportId) {
                    element.addEventListener('click', () => {
                        const report = this.reports.find(r => r.id === notification.reportId);
                        if (report) {
                            this.showReportDetail(report);
                            this.toggleNotificationPanel(); // Close notification panel
                        }
                    });
                }
            });
        }
    }

    // Export functionality
    showExportOptions(event) {
        event.preventDefault();
        
        const exportBtn = event.target.closest('button');
        const existingDropdown = document.getElementById('export-dropdown');
        
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }

        const dropdown = document.createElement('div');
        dropdown.id = 'export-dropdown';
        dropdown.className = 'export-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.right = '0';
        dropdown.style.marginTop = '0.25rem';

        dropdown.innerHTML = `
            <button class="export-option" data-format="csv">
                <i class="fas fa-file-csv"></i>
                Export as CSV
            </button>
            <button class="export-option" data-format="pdf">
                <i class="fas fa-file-pdf"></i>
                Export as PDF
            </button>
            <button class="export-option" data-format="excel">
                <i class="fas fa-file-excel"></i>
                Export as Excel
            </button>
        `;

        exportBtn.style.position = 'relative';
        exportBtn.appendChild(dropdown);

        // Add click handlers for export options
        dropdown.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const format = option.dataset.format;
                this.exportReports(format);
                dropdown.remove();
            });
        });
    }

    exportReports(format) {
        const reportsToExport = this.selectedReports.size > 0 ? 
            this.reports.filter(r => this.selectedReports.has(r.id)) :
            this.filteredReports;

        if (reportsToExport.length === 0) {
            this.showNotification('No reports to export', 'warning');
            return;
        }

        this.showNotification(`Exporting ${reportsToExport.length} reports as ${format.toUpperCase()}...`, 'info');

        // Simulate export process
        setTimeout(() => {
            switch (format) {
                case 'csv':
                    this.exportAsCSV(reportsToExport);
                    break;
                case 'pdf':
                    this.exportAsPDF(reportsToExport);
                    break;
                case 'excel':
                    this.exportAsExcel(reportsToExport);
                    break;
            }
            this.showNotification(`Export completed successfully`, 'success');
        }, 2000);
    }

    exportAsCSV(reports) {
        const headers = ['Date', 'Employee', 'Role', 'Status', 'Tasks Completed', 'Hours Worked', 'Accomplishments', 'Challenges', 'Tomorrow Plans'];
        const csvContent = [
            headers.join(','),
            ...reports.map(report => [
                report.date,
                `"${report.memberName}"`,
                `"${report.memberRole}"`,
                report.status,
                report.tasksCompleted,
                report.hoursWorked,
                `"${report.accomplishments.replace(/"/g, '""')}"`,
                `"${report.challenges.replace(/"/g, '""')}"`,
                `"${report.tomorrowPlans.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        this.downloadFile(csvContent, 'team-reports.csv', 'text/csv');
    }

    exportAsPDF(reports) {
        // In a real application, you would use a PDF library like jsPDF
        const content = `Team Reports Export\n\nGenerated: ${new Date().toLocaleString()}\nTotal Reports: ${reports.length}\n\n${reports.map(report => 
            `${report.memberName} - ${report.date}\nStatus: ${report.status}\nTasks: ${report.tasksCompleted}\nHours: ${report.hoursWorked}\nAccomplishments: ${report.accomplishments}\n\n`
        ).join('')}`;
        
        this.downloadFile(content, 'team-reports.txt', 'text/plain');
    }

    exportAsExcel(reports) {
        // In a real application, you would use a library like SheetJS
        this.exportAsCSV(reports); // Fallback to CSV for demo
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Modal management
    closeModal() {
        const modal = document.getElementById('report-detail-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    closeBulkConfirmModal() {
        const modal = document.getElementById('bulk-confirm-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // UI helpers
    showLoading() {
        const loading = document.getElementById('reports-loading');
        const empty = document.getElementById('reports-empty');
        const container = document.getElementById('reports-container');
        
        if (loading) loading.classList.remove('hidden');
        if (empty) empty.classList.add('hidden');
        if (container) {
            container.innerHTML = '';
        }
    }

    hideLoading() {
        const loading = document.getElementById('reports-loading');
        if (loading) loading.classList.add('hidden');
    }

    handleOutsideClick(event) {
        // Close export dropdown
        const exportDropdown = document.getElementById('export-dropdown');
        if (exportDropdown && !event.target.closest('#export-reports-btn') && !event.target.closest('#export-dropdown')) {
            exportDropdown.remove();
        }

        // Close notification panel
        const notificationPanel = document.getElementById('notification-panel');
        if (notificationPanel && !notificationPanel.classList.contains('hidden') && 
            !event.target.closest('#notifications-btn') && !event.target.closest('#notification-panel')) {
            notificationPanel.classList.add('hidden');
        }

        // Close modals on outside click
        if (event.target.id === 'report-detail-modal') {
            this.closeModal();
        }

        if (event.target.id === 'bulk-confirm-modal') {
            this.closeBulkConfirmModal();
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    this.closeBulkConfirmModal();
                    break;
                case 'r':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.loadReports();
                    }
                    break;
                case 'a':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        const selectAllCheckbox = document.getElementById('select-all-reports');
                        if (selectAllCheckbox) {
                            selectAllCheckbox.checked = !selectAllCheckbox.checked;
                            this.toggleSelectAll(selectAllCheckbox.checked);
                        }
                    }
                    break;
            }
        });
    }

    setupAutoRefresh() {
        // Refresh reports every 5 minutes
        setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.loadReports();
            }
        }, 5 * 60 * 1000);
    }

    initializeFilters() {
        // Set default date to today
        const dateFilter = document.getElementById('date-filter');
        if (dateFilter) {
            dateFilter.max = new Date().toISOString().split('T')[0];
        }
    }

    initializeView() {
        // Called when navigating to team reports view
        this.loadReports();
    }

    // Utility functions
    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return `${days}d ago`;
        }
    }

    async simulateApiCall(delay = 500) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    showNotification(message, type = 'info') {
        if (window.navigationManager) {
            window.navigationManager.showNotification(message, type);
        }
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize reports manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize for managers
    setTimeout(() => {
        if (window.navigationManager && window.navigationManager.userRole === 'manager') {
            window.reportsManager = new ReportsManager();
        }
    }, 100); // Small delay to ensure navigation manager is initialized
});