/**
 * DevDash Configuration
 * Environment-specific settings and API endpoints
 */

const CONFIG = {
    // Environment configuration
    environment: 'development', // 'development' | 'staging' | 'production'
    
    // API Configuration
    api: {
        baseUrl: 'http://localhost:3000/api/v1',
        timeout: 10000, // 10 seconds
        retryAttempts: 3,
        retryDelay: 1000,
        endpoints: {
            // Authentication
            login: '/auth/login',
            logout: '/auth/logout',
            refresh: '/auth/refresh',
            profile: '/auth/profile',
            
            // GitLab Integration
            gitlab: {
                metrics: '/integrations/gitlab/metrics',
                commits: '/integrations/gitlab/commits',
                mergeRequests: '/integrations/gitlab/merge-requests',
                reviews: '/integrations/gitlab/reviews',
                activity: '/integrations/gitlab/activity'
            },
            
            // OpenProject Integration
            openproject: {
                metrics: '/integrations/openproject/metrics',
                tasks: '/integrations/openproject/tasks',
                projects: '/integrations/openproject/projects',
                workpackages: '/integrations/openproject/workpackages'
            },
            
            // SonarQube Integration
            sonarqube: {
                metrics: '/integrations/sonarqube/metrics',
                issues: '/integrations/sonarqube/issues',
                coverage: '/integrations/sonarqube/coverage',
                quality: '/integrations/sonarqube/quality-gates'
            },
            
            // Dashboard Data
            dashboard: {
                metrics: '/dashboard/metrics',
                activity: '/dashboard/activity',
                reports: '/dashboard/reports'
            },
            
            // Team Management (Manager role)
            team: {
                members: '/team/members',
                performance: '/team/performance',
                analytics: '/team/analytics'
            },
            
            // Daily Reports
            reports: {
                daily: '/reports/daily',
                submit: '/reports/daily/submit',
                history: '/reports/history',
                
                // Manager Report Management
                team: '/reports/team',
                pending: '/reports/team/pending',
                approve: '/reports/approve',
                reject: '/reports/reject',
                bulkApprove: '/reports/bulk-approve',
                bulkReject: '/reports/bulk-reject',
                comments: '/reports/comments',
                export: '/reports/export',
                analytics: '/reports/analytics'
            }
        }
    },
    
    // Integration Settings
    integrations: {
        gitlab: {
            enabled: true,
            baseUrl: 'https://gitlab.company.com',
            refreshInterval: 300000, // 5 minutes
            defaultBranch: 'main'
        },
        
        openproject: {
            enabled: true,
            baseUrl: 'https://openproject.company.com',
            refreshInterval: 600000, // 10 minutes
            defaultProject: null
        },
        
        sonarqube: {
            enabled: true,
            baseUrl: 'https://sonarqube.company.com',
            refreshInterval: 900000, // 15 minutes
            defaultProject: null
        }
    },
    
    // Dashboard Settings
    dashboard: {
        refreshInterval: 300000, // 5 minutes
        maxCacheAge: 3600000, // 1 hour
        animationDuration: 300,
        chartAnimationDuration: 1000,
        notificationDuration: 3000,
        maxNotifications: 5,
        dateRangeOptions: [
            { value: 7, label: 'Last 7 days' },
            { value: 30, label: 'Last 30 days' },
            { value: 90, label: 'Last 90 days' }
        ]
    },
    
    // User Interface Settings
    ui: {
        theme: {
            default: 'light',
            options: ['light', 'dark', 'auto']
        },
        
        sidebar: {
            defaultCollapsed: false,
            mobileBreakpoint: 768
        },
        
        tables: {
            defaultPageSize: 25,
            maxPageSize: 100
        },
        
        charts: {
            defaultColors: [
                '#2563eb', '#10b981', '#f59e0b', '#ef4444', 
                '#06b6d4', '#8b5cf6', '#f97316', '#84cc16'
            ],
            animation: true,
            responsiveBreakpoints: {
                mobile: 640,
                tablet: 768,
                desktop: 1024
            }
        }
    },
    
    // Performance Settings
    performance: {
        lazyLoadThreshold: 100, // px before viewport
        imageOptimization: true,
        enableServiceWorker: true,
        cacheStrategy: 'networkFirst', // 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate'
        preloadCriticalResources: true,
        
        // Bundle splitting
        chunkSizes: {
            maxChunkSize: 244 * 1024, // 244KB
            maxAsyncChunkSize: 244 * 1024
        }
    },
    
    // Security Settings
    security: {
        tokenRefreshThreshold: 300000, // 5 minutes before expiry
        maxTokenAge: 3600000, // 1 hour
        csrfToken: true,
        contentSecurityPolicy: {
            enabled: true,
            reportOnly: false
        },
        
        // Rate limiting
        rateLimits: {
            api: {
                requests: 100,
                window: 60000 // 1 minute
            },
            
            login: {
                attempts: 5,
                lockout: 900000 // 15 minutes
            }
        }
    },
    
    // Analytics and Monitoring
    analytics: {
        enabled: true,
        provider: 'internal', // 'internal' | 'google' | 'mixpanel' | 'amplitude'
        
        events: {
            pageView: true,
            userInteraction: true,
            performance: true,
            errors: true
        },
        
        // Performance monitoring
        vitals: {
            lcp: { threshold: 2500 }, // Largest Contentful Paint
            fid: { threshold: 100 },  // First Input Delay
            cls: { threshold: 0.1 }   // Cumulative Layout Shift
        }
    },
    
    // Accessibility Settings
    accessibility: {
        announcePageChanges: true,
        focusManagement: true,
        highContrastMode: false,
        reducedMotion: false,
        
        // ARIA settings
        liveRegions: true,
        roleEnhancements: true,
        keyboardNavigation: true
    },
    
    // Offline Settings
    offline: {
        enabled: true,
        strategy: 'essential', // 'aggressive' | 'essential' | 'minimal'
        
        cacheResources: [
            '/',
            '/assets/css/dashboard.css',
            '/assets/js/dashboard.js',
            '/assets/js/navigation.js',
            '/assets/js/charts.js'
        ],
        
        syncStrategies: {
            reports: 'background', // 'immediate' | 'background' | 'manual'
            metrics: 'background',
            preferences: 'immediate'
        }
    },
    
    // Development Settings
    development: {
        enableDebugMode: true,
        mockApiDelay: 500,
        enablePerformanceLogging: true,
        enableAccessibilityTesting: true,
        
        // Hot reload
        hotReload: {
            enabled: true,
            port: 3001
        },
        
        // Developer tools
        devTools: {
            redux: false,
            performance: true,
            accessibility: true
        }
    },
    
    // Feature Flags
    features: {
        darkMode: false,
        realTimeUpdates: false,
        advancedAnalytics: false,
        teamCollaboration: false,
        mobileApp: false,
        pushNotifications: false,
        
        // Beta features
        beta: {
            aiInsights: false,
            predictiveAnalytics: false,
            customDashboards: false
        }
    },
    
    // Notification Settings
    notifications: {
        enabled: true,
        types: {
            success: { duration: 3000, position: 'top-right' },
            error: { duration: 5000, position: 'top-right' },
            warning: { duration: 4000, position: 'top-right' },
            info: { duration: 3000, position: 'top-right' }
        },
        
        // Push notifications (when implemented)
        push: {
            enabled: false,
            vapidPublicKey: null
        }
    },
    
    // Export/Import Settings
    dataExport: {
        formats: ['json', 'csv', 'pdf'],
        maxRecords: 10000,
        includeCharts: true,
        
        // Scheduled exports
        scheduled: {
            enabled: false,
            frequency: 'weekly', // 'daily' | 'weekly' | 'monthly'
            recipients: []
        }
    }
};

// Environment-specific overrides
if (CONFIG.environment === 'production') {
    CONFIG.api.baseUrl = 'https://api.devdash.com/v1';
    CONFIG.development.enableDebugMode = false;
    CONFIG.development.mockApiDelay = 0;
    CONFIG.analytics.enabled = true;
    CONFIG.performance.enableServiceWorker = true;
} else if (CONFIG.environment === 'staging') {
    CONFIG.api.baseUrl = 'https://staging-api.devdash.com/v1';
    CONFIG.development.enableDebugMode = true;
    CONFIG.analytics.enabled = false;
}

// Browser feature detection and fallbacks
const BROWSER_SUPPORT = {
    intersectionObserver: 'IntersectionObserver' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webWorkers: typeof Worker !== 'undefined',
    localStorage: typeof Storage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    promises: typeof Promise !== 'undefined',
    es6Modules: 'noModule' in HTMLScriptElement.prototype,
    
    // Chart.js requirements
    canvas: !!document.createElement('canvas').getContext,
    
    // CSS features
    cssGrid: CSS.supports('display', 'grid'),
    cssCustomProperties: CSS.supports('color', 'var(--fake-var)'),
    
    // Modern JavaScript features
    asyncAwait: (function() {
        try {
            return (function() {}).constructor('return async function(){}')().constructor === (async function(){}).constructor;
        } catch (e) {
            return false;
        }
    })()
};

// Apply feature detection to config
if (!BROWSER_SUPPORT.intersectionObserver) {
    CONFIG.performance.lazyLoadThreshold = 0; // Disable lazy loading
}

if (!BROWSER_SUPPORT.serviceWorker) {
    CONFIG.performance.enableServiceWorker = false;
    CONFIG.offline.enabled = false;
}

if (!BROWSER_SUPPORT.localStorage) {
    CONFIG.dashboard.maxCacheAge = 0; // Disable caching
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, BROWSER_SUPPORT };
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.BROWSER_SUPPORT = BROWSER_SUPPORT;
}

// Configuration validation (development only)
if (CONFIG.development.enableDebugMode) {
    console.group('🔧 DevDash Configuration');
    console.log('Environment:', CONFIG.environment);
    console.log('API Base URL:', CONFIG.api.baseUrl);
    console.log('Features Enabled:', Object.entries(CONFIG.features).filter(([, enabled]) => enabled));
    console.log('Browser Support:', BROWSER_SUPPORT);
    console.groupEnd();
}