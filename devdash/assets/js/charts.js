/**
 * DevDash Chart Management
 * Handles data visualization using Chart.js
 */

class ChartManager {
    constructor() {
        this.charts = {};
        this.defaultColors = {
            primary: '#2563eb',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4',
            secondary: '#64748b'
        };
        
        this.init();
    }

    init() {
        this.setupChartDefaults();
        this.initializeDashboardCharts();
        this.setupEventListeners();
    }

    setupChartDefaults() {
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#6b7280';
        
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.padding = 20;
        
        Chart.defaults.elements.bar.borderRadius = 4;
        Chart.defaults.elements.line.borderWidth = 2;
        Chart.defaults.elements.point.borderWidth = 0;
        Chart.defaults.elements.point.radius = 4;
        Chart.defaults.elements.point.hoverRadius = 6;
    }

    setupEventListeners() {
        // Listen for date range changes
        window.addEventListener('dateRangeChanged', (event) => {
            this.updateChartsForDateRange(event.detail.days);
        });

        // Handle window resize for responsive charts
        window.addEventListener('resize', () => {
            this.resizeCharts();
        });
    }

    initializeDashboardCharts() {
        this.createActivityChart();
        this.createTaskChart();
    }

    createActivityChart() {
        const ctx = document.getElementById('activityChart');
        if (!ctx) return;

        // Sample data - in real app, this would come from API
        const data = this.generateActivityData();

        this.charts.activity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Commits',
                        data: data.commits,
                        borderColor: this.defaultColors.primary,
                        backgroundColor: this.hexToRgba(this.defaultColors.primary, 0.1),
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Tasks Completed',
                        data: data.tasks,
                        borderColor: this.defaultColors.success,
                        backgroundColor: this.hexToRgba(this.defaultColors.success, 0.1),
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Code Reviews',
                        data: data.reviews,
                        borderColor: this.defaultColors.warning,
                        backgroundColor: this.hexToRgba(this.defaultColors.warning, 0.1),
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        usePointStyle: true
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        border: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createTaskChart() {
        const ctx = document.getElementById('taskChart');
        if (!ctx) return;

        const data = this.generateTaskData();

        this.charts.tasks = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        this.defaultColors.success,
                        this.defaultColors.info,
                        this.defaultColors.secondary,
                        this.defaultColors.error
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    
                                    return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].backgroundColor[i],
                                        pointStyle: 'rect',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const label = context.label;
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} tasks (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    createGitLabChart() {
        const ctx = document.getElementById('gitlabChart');
        if (!ctx) return;

        const data = this.generateGitLabData();

        this.charts.gitlab = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Commits',
                        data: data.commits,
                        backgroundColor: this.hexToRgba('#fc6d26', 0.8),
                        borderColor: '#fc6d26',
                        borderWidth: 1
                    },
                    {
                        label: 'Merge Requests',
                        data: data.mergeRequests,
                        backgroundColor: this.hexToRgba('#fca326', 0.8),
                        borderColor: '#fca326',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    createSonarQubeChart() {
        const ctx = document.getElementById('sonarChart');
        if (!ctx) return;

        const data = this.generateSonarQubeData();

        this.charts.sonar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Bugs', 'Vulnerabilities', 'Code Smells', 'Coverage', 'Duplications', 'Maintainability'],
                datasets: [{
                    label: 'Quality Score',
                    data: data.scores,
                    backgroundColor: this.hexToRgba('#4e9bcd', 0.2),
                    borderColor: '#4e9bcd',
                    borderWidth: 2,
                    pointBackgroundColor: '#4e9bcd',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#4e9bcd'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    createTeamPerformanceChart() {
        const ctx = document.getElementById('teamChart');
        if (!ctx) return;

        const data = this.generateTeamData();

        this.charts.team = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.developers,
                datasets: [
                    {
                        label: 'Tasks Completed',
                        data: data.tasksCompleted,
                        backgroundColor: this.defaultColors.success,
                        borderRadius: 4
                    },
                    {
                        label: 'Code Quality Score',
                        data: data.qualityScores,
                        backgroundColor: this.defaultColors.info,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });
    }

    // Data generation methods (would be replaced with API calls in production)
    generateActivityData() {
        const days = 7;
        const labels = [];
        const commits = [];
        const tasks = [];
        const reviews = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            commits.push(Math.floor(Math.random() * 15) + 2);
            tasks.push(Math.floor(Math.random() * 8) + 1);
            reviews.push(Math.floor(Math.random() * 5) + 1);
        }

        return { labels, commits, tasks, reviews };
    }

    generateTaskData() {
        return {
            values: [24, 8, 12, 3]
        };
    }

    generateGitLabData() {
        const days = 7;
        const labels = [];
        const commits = [];
        const mergeRequests = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            commits.push(Math.floor(Math.random() * 20) + 5);
            mergeRequests.push(Math.floor(Math.random() * 5) + 1);
        }

        return { labels, commits, mergeRequests };
    }

    generateSonarQubeData() {
        return {
            scores: [95, 88, 92, 85, 90, 87] // Quality scores for each metric
        };
    }

    generateTeamData() {
        return {
            developers: ['John D.', 'Jane S.', 'Bob W.', 'Alice J.', 'Mike R.'],
            tasksCompleted: [24, 18, 21, 19, 16],
            qualityScores: [95, 92, 88, 90, 87]
        };
    }

    // Utility methods
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    updateChartsForDateRange(days) {
        // Update charts based on new date range
        if (this.charts.activity) {
            const newData = this.generateActivityDataForRange(days);
            this.charts.activity.data.labels = newData.labels;
            this.charts.activity.data.datasets[0].data = newData.commits;
            this.charts.activity.data.datasets[1].data = newData.tasks;
            this.charts.activity.data.datasets[2].data = newData.reviews;
            this.charts.activity.update('active');
        }

        // Update other charts as needed
        Object.keys(this.charts).forEach(chartKey => {
            if (chartKey !== 'activity' && this.charts[chartKey]) {
                this.charts[chartKey].update('active');
            }
        });
    }

    generateActivityDataForRange(days) {
        const labels = [];
        const commits = [];
        const tasks = [];
        const reviews = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            if (days <= 7) {
                labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            } else if (days <= 30) {
                labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            } else {
                labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
            }
            
            commits.push(Math.floor(Math.random() * 15) + 2);
            tasks.push(Math.floor(Math.random() * 8) + 1);
            reviews.push(Math.floor(Math.random() * 5) + 1);
        }

        return { labels, commits, tasks, reviews };
    }

    resizeCharts() {
        Object.keys(this.charts).forEach(chartKey => {
            if (this.charts[chartKey]) {
                this.charts[chartKey].resize();
            }
        });
    }

    destroyChart(chartName) {
        if (this.charts[chartName]) {
            this.charts[chartName].destroy();
            delete this.charts[chartName];
        }
    }

    destroyAllCharts() {
        Object.keys(this.charts).forEach(chartKey => {
            this.destroyChart(chartKey);
        });
    }

    // Animation helpers
    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.round(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }

    // Progressive data loading for performance
    async loadChartData(chartType, timeRange = 7) {
        try {
            // In production, this would make API calls
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            
            switch (chartType) {
                case 'activity':
                    return this.generateActivityDataForRange(timeRange);
                case 'tasks':
                    return this.generateTaskData();
                case 'gitlab':
                    return this.generateGitLabData();
                case 'sonar':
                    return this.generateSonarQubeData();
                case 'team':
                    return this.generateTeamData();
                default:
                    return null;
            }
        } catch (error) {
            console.error(`Failed to load chart data for ${chartType}:`, error);
            return null;
        }
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chartManager = new ChartManager();
});