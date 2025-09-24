// shadcn/ui-inspired Components and Utilities
// This file contains reusable component classes and utilities

// Utility function for conditional classes (cn utility)
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Badge component utility
function createBadge(content, variant = 'default') {
    const variants = {
        default: 'bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900',
        secondary: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50',
        destructive: 'bg-red-500 text-white dark:bg-red-900 dark:text-red-50',
        outline: 'border border-neutral-200 dark:border-neutral-800'
    };

    const badge = document.createElement('span');
    badge.className = cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant]
    );
    badge.textContent = content;
    return badge;
}

// Button component utility
function createButton(content, variant = 'default', size = 'default') {
    const variants = {
        default: 'bg-primary-500 text-white hover:bg-primary-600',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700',
        ghost: 'text-neutral-900 hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-800',
        link: 'text-primary-500 underline-offset-4 hover:underline'
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
    };

    const button = document.createElement('button');
    button.className = cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size]
    );

    if (typeof content === 'string') {
        button.textContent = content;
    } else {
        button.appendChild(content);
    }

    return button;
}

// Card component utilities
function createCard() {
    const card = document.createElement('div');
    card.className = 'rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50';
    return card;
}

function createCardHeader() {
    const header = document.createElement('div');
    header.className = 'flex flex-col space-y-1.5 p-6';
    return header;
}

function createCardTitle(content) {
    const title = document.createElement('h3');
    title.className = 'text-2xl font-semibold leading-none tracking-tight';
    title.textContent = content;
    return title;
}

function createCardDescription(content) {
    const description = document.createElement('p');
    description.className = 'text-sm text-neutral-500 dark:text-neutral-400';
    description.textContent = content;
    return description;
}

function createCardContent() {
    const content = document.createElement('div');
    content.className = 'p-6 pt-0';
    return content;
}

function createCardFooter() {
    const footer = document.createElement('div');
    footer.className = 'flex items-center p-6 pt-0';
    return footer;
}

// Avatar component utility
function createAvatar(src, fallback, size = 'default') {
    const sizes = {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const avatarContainer = document.createElement('span');
    avatarContainer.className = cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizes[size]
    );

    if (src) {
        const img = document.createElement('img');
        img.className = 'aspect-square h-full w-full';
        img.src = src;
        img.alt = 'Avatar';
        avatarContainer.appendChild(img);
    } else {
        const fallbackElement = document.createElement('span');
        fallbackElement.className = 'flex h-full w-full items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800';
        fallbackElement.textContent = fallback;
        avatarContainer.appendChild(fallbackElement);
    }

    return avatarContainer;
}

// Progress component utility
function createProgress(value = 0, max = 100) {
    const container = document.createElement('div');
    container.className = 'relative h-4 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800';

    const indicator = document.createElement('div');
    indicator.className = 'h-full w-full flex-1 bg-primary-500 transition-all';
    indicator.style.transform = `translateX(-${100 - (value / max) * 100}%)`;

    container.appendChild(indicator);
    return container;
}

// Q&A Component Classes
class QASystem {
    constructor(container) {
        this.container = container;
        this.questions = [];
        this.currentSort = 'upvotes'; // 'upvotes' or 'newest'
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div class="p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 class="font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-2 mb-4">
                        <i data-lucide="message-square" class="w-4 h-4"></i>
                        Questions & Answers
                    </h3>

                    <!-- Ask Question Form -->
                    <div id="qa-bar" class="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg p-3 mb-4">
                        <form id="qa-form">
                            <label for="qa-ask-input" class="sr-only">Ask a question</label>
                            <textarea
                                id="qa-ask-input"
                                placeholder="Ask a question..."
                                maxlength="1000"
                                class="w-full min-h-[80px] max-h-[120px] border-none resize-vertical text-base leading-normal p-2 bg-transparent placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-700 dark:text-neutral-300 focus:ring-0 focus:outline-none"
                            ></textarea>
                            <div class="flex justify-between items-center mt-2">
                                <button
                                    id="qa-send-btn"
                                    type="submit"
                                    class="h-9 px-4 bg-primary-500 text-white rounded-md text-sm font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                                    disabled
                                >
                                    Ask Question
                                </button>
                                <span id="qa-char-count" class="text-xs text-neutral-500 dark:text-neutral-400">0/1000</span>
                            </div>
                        </form>
                    </div>

                    <!-- Sort Controls -->
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-neutral-500 dark:text-neutral-400">Sort by:</span>
                        <button id="sort-upvotes" class="sort-btn text-sm px-2 py-1 rounded bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                            Most upvoted
                        </button>
                        <button id="sort-newest" class="sort-btn text-sm px-2 py-1 rounded text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                            Newest
                        </button>
                    </div>
                </div>

                <!-- Questions List -->
                <section id="qa-list" role="region" aria-label="Questions board" aria-live="polite" class="p-4">
                    <div id="questions-container">
                        ${this.questions.length === 0 ? this.getEmptyState() : this.renderQuestions()}
                    </div>
                </section>
            </div>
        `;

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getEmptyState() {
        return `
            <div class="text-center py-8">
                <div class="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="message-square" class="w-6 h-6 text-neutral-400"></i>
                </div>
                <p class="text-neutral-500 dark:text-neutral-400">No questions yet. Be the first to ask!</p>
            </div>
        `;
    }

    renderQuestions() {
        const sortedQuestions = [...this.questions].sort((a, b) => {
            if (this.currentSort === 'upvotes') {
                return b.upvotes - a.upvotes;
            } else {
                return new Date(b.timestamp) - new Date(a.timestamp);
            }
        });

        return sortedQuestions.map(question => this.renderQuestion(question)).join('');
    }

    renderQuestion(question) {
        const statusColors = {
            unanswered: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
            in_discussion: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
            answered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
            dismissed: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
        };

        return `
            <article class="question-item bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 mb-3 relative"
                     data-question-id="${question.id}"
                     aria-labelledby="question-text-${question.id}">

                <div class="question-header flex items-center justify-between mb-2">
                    <span class="question-handle text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        ${question.anonymizedHandle}
                    </span>
                    <span class="question-status text-xs px-2 py-1 rounded-md font-medium ${statusColors[question.status]}">
                        ${this.formatStatus(question.status)}
                    </span>
                </div>

                <div id="question-text-${question.id}" class="question-text text-base leading-normal text-neutral-700 dark:text-neutral-300 mb-3">
                    ${question.text}
                </div>

                <div class="question-actions flex items-center gap-2">
                    <button
                        class="upvote-button flex items-center gap-1 px-3 py-2 border border-neutral-200 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 transition-all min-w-[44px] min-h-[44px] hover:bg-neutral-50 dark:hover:bg-neutral-700 ${question.upvoted ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:border-primary-500 dark:text-primary-300' : ''}"
                        aria-pressed="${question.upvoted}"
                        data-question-id="${question.id}"
                        aria-label="Upvote this question"
                    >
                        <i data-lucide="chevron-up" class="w-4 h-4"></i>
                        <span class="upvote-count text-sm font-medium">${question.upvotes}</span>
                    </button>

                    <span class="text-xs text-neutral-500 dark:text-neutral-400">
                        ${this.formatTime(question.timestamp)}
                    </span>

                    ${question.pinned ? '<i data-lucide="pin" class="w-4 h-4 text-primary-500" aria-label="Pinned question"></i>' : ''}
                </div>
            </article>
        `;
    }

    formatStatus(status) {
        const statusMap = {
            unanswered: 'Unanswered',
            in_discussion: 'In Discussion',
            answered: 'Answered',
            dismissed: 'Dismissed'
        };
        return statusMap[status] || status;
    }

    formatTime(timestamp) {
        const now = new Date();
        const questionTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - questionTime) / 60000);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;

        return questionTime.toLocaleDateString();
    }

    attachEventListeners() {
        // Form submission
        const form = this.container.querySelector('#qa-form');
        const input = this.container.querySelector('#qa-ask-input');
        const submitBtn = this.container.querySelector('#qa-send-btn');
        const charCount = this.container.querySelector('#qa-char-count');

        // Character counter and button state
        input.addEventListener('input', (e) => {
            const count = e.target.value.trim().length;
            charCount.textContent = `${e.target.value.length}/1000`;
            submitBtn.disabled = count === 0;

            if (e.target.value.length > 950) {
                charCount.classList.add('text-red-500');
            } else {
                charCount.classList.remove('text-red-500');
            }
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (text) {
                this.addQuestion(text);
                input.value = '';
                charCount.textContent = '0/1000';
                submitBtn.disabled = true;
            }
        });

        // Keyboard shortcuts
        input.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });

        // Sort buttons
        this.container.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const newSort = e.target.id === 'sort-upvotes' ? 'upvotes' : 'newest';
                if (newSort !== this.currentSort) {
                    this.currentSort = newSort;
                    this.updateSortButtons();
                    this.refreshQuestionsList();
                }
            });
        });

        // Upvote buttons (event delegation)
        this.container.addEventListener('click', (e) => {
            const upvoteBtn = e.target.closest('.upvote-button');
            if (upvoteBtn) {
                e.preventDefault();
                const questionId = upvoteBtn.dataset.questionId;
                this.toggleUpvote(questionId);
            }
        });
    }

    addQuestion(text) {
        const question = {
            id: 'q_' + Date.now() + Math.random().toString(36).substr(2, 9),
            text: text,
            timestamp: new Date().toISOString(),
            anonymizedHandle: `Participant #${Math.floor(Math.random() * 100) + 1}`,
            upvotes: 0,
            upvoted: false,
            status: 'unanswered',
            pinned: false,
            slide_id: 'current-slide'
        };

        // Optimistic UI update
        this.questions.unshift(question);
        this.refreshQuestionsList();

        // Show success animation
        const newQuestionEl = this.container.querySelector(`[data-question-id="${question.id}"]`);
        if (newQuestionEl) {
            newQuestionEl.classList.add('slide-in-up');
        }

        // Announce to screen readers
        this.announce('Your question has been submitted and will appear shortly.');

        // Simulate server response (in real app, this would be an API call)
        setTimeout(() => {
            this.announce('Your question is now visible to all participants.');
        }, 500);
    }

    toggleUpvote(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        // Optimistic update
        if (question.upvoted) {
            question.upvotes--;
            question.upvoted = false;
        } else {
            question.upvotes++;
            question.upvoted = true;
        }

        // Update the UI
        const upvoteBtn = this.container.querySelector(`[data-question-id="${questionId}"]`);
        if (upvoteBtn) {
            const button = upvoteBtn.querySelector('.upvote-button');
            const count = button.querySelector('.upvote-count');

            button.setAttribute('aria-pressed', question.upvoted);
            count.textContent = question.upvotes;

            if (question.upvoted) {
                button.classList.add('bg-primary-50', 'border-primary-500', 'text-primary-700');
                button.classList.add('dark:bg-primary-900/20', 'dark:border-primary-500', 'dark:text-primary-300');
                button.classList.add('pulse-once');
            } else {
                button.classList.remove('bg-primary-50', 'border-primary-500', 'text-primary-700');
                button.classList.remove('dark:bg-primary-900/20', 'dark:border-primary-500', 'dark:text-primary-300');
            }

            setTimeout(() => {
                button.classList.remove('pulse-once');
            }, 600);
        }

        // Re-sort if sorting by upvotes
        if (this.currentSort === 'upvotes') {
            setTimeout(() => this.refreshQuestionsList(), 100);
        }
    }

    updateSortButtons() {
        const upvotesBtn = this.container.querySelector('#sort-upvotes');
        const newestBtn = this.container.querySelector('#sort-newest');

        if (this.currentSort === 'upvotes') {
            upvotesBtn.className = 'sort-btn text-sm px-2 py-1 rounded bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300';
            newestBtn.className = 'sort-btn text-sm px-2 py-1 rounded text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800';
        } else {
            newestBtn.className = 'sort-btn text-sm px-2 py-1 rounded bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300';
            upvotesBtn.className = 'sort-btn text-sm px-2 py-1 rounded text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800';
        }
    }

    refreshQuestionsList() {
        const container = this.container.querySelector('#questions-container');
        container.innerHTML = this.questions.length === 0 ? this.getEmptyState() : this.renderQuestions();

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    announce(message) {
        const liveRegion = document.getElementById('qa-live');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 3000);
        }
    }

    // Add some sample questions for demonstration
    addSampleQuestions() {
        const sampleQuestions = [
            {
                id: 'q_sample_1',
                text: 'Can you show the full example for the HOC pattern with TypeScript?',
                timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
                anonymizedHandle: 'Participant #42',
                upvotes: 8,
                upvoted: false,
                status: 'answered',
                pinned: true,
                slide_id: 'slide-3'
            },
            {
                id: 'q_sample_2',
                text: 'How does this compare to the composition pattern in React?',
                timestamp: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
                anonymizedHandle: 'Participant #17',
                upvotes: 3,
                upvoted: true,
                status: 'in_discussion',
                pinned: false,
                slide_id: 'slide-3'
            },
            {
                id: 'q_sample_3',
                text: 'What are the performance implications of using HOCs extensively?',
                timestamp: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
                anonymizedHandle: 'Participant #8',
                upvotes: 1,
                upvoted: false,
                status: 'unanswered',
                pinned: false,
                slide_id: 'slide-3'
            }
        ];

        this.questions = sampleQuestions;
        this.refreshQuestionsList();
    }
}

// Export utilities for global use
window.ComponentUtils = {
    cn,
    createBadge,
    createButton,
    createCard,
    createCardHeader,
    createCardTitle,
    createCardDescription,
    createCardContent,
    createCardFooter,
    createAvatar,
    createProgress,
    QASystem
};