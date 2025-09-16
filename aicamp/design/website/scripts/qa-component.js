/**
 * Q&A Component - Semi-Public Anonymous Q&A Implementation
 * Follows exact specifications from PRD lines 133-292
 */

// Q&A State Management
const QAState = {
  questions: [
    {
      id: 'q_01F8Z0ABC',
      session_id: 's_123',
      slide_id: 'slide-3',
      text: 'How do we handle async operations in useEffect?',
      created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      created_by_user_id: 'user_12',
      anonymized_handle: 'Participant #12',
      upvote_count: 3,
      status: 'unanswered',
      answered_by: null,
      answered_at: null,
      visibility: 'public',
      pinned: false,
      moderation_flag: null,
      metadata: {},
      deleted: false,
      user_upvoted: false
    },
    {
      id: 'q_01F8Z0XYZ',
      session_id: 's_123',
      slide_id: 'slide-2',
      text: "What's the difference between useState and useReducer?",
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      created_by_user_id: 'user_07',
      anonymized_handle: 'Participant #7',
      upvote_count: 7,
      status: 'answered',
      answered_by: 'trainer_01',
      answered_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      visibility: 'public',
      pinned: false,
      moderation_flag: null,
      metadata: {},
      deleted: false,
      user_upvoted: true
    }
  ],
  currentUserId: 'user_current',
  currentUserHandle: 'Participant #27',
  sortBy: 'top', // 'top' or 'new'
  rateLimited: false,
  rateLimitReset: null
};

// Q&A DOM Elements
const QAElements = {
  form: null,
  input: null,
  sendBtn: null,
  list: null,
  sort: null,
  liveRegion: null,
  characterCount: null
};

/**
 * Initialize Q&A component
 */
function initializeQA() {
  // Cache DOM elements
  cacheQAElements();

  // Set up event listeners
  setupQAEventListeners();

  // Render initial questions
  renderQuestions();

  // Set up real-time updates (simulated)
  setupRealTimeUpdates();

  console.log('Q&A component initialized');
}

/**
 * Cache Q&A DOM elements
 */
function cacheQAElements() {
  QAElements.form = document.getElementById('qa-form');
  QAElements.input = document.getElementById('qa-ask-input');
  QAElements.sendBtn = document.getElementById('qa-send-btn');
  QAElements.list = document.getElementById('qa-list');
  QAElements.sort = document.getElementById('qa-sort');
  QAElements.liveRegion = document.getElementById('qa-live');
  QAElements.characterCount = document.querySelector('#qa-ask-input + .qa-input-footer .character-count');
}

/**
 * Set up Q&A event listeners
 */
function setupQAEventListeners() {
  // Form submission
  if (QAElements.form) {
    QAElements.form.addEventListener('submit', handleQASubmit);
  }

  // Input keyboard shortcuts
  if (QAElements.input) {
    QAElements.input.addEventListener('keydown', handleQAKeyboard);
    QAElements.input.addEventListener('input', updateQACharacterCount);
  }

  // Sort change
  if (QAElements.sort) {
    QAElements.sort.addEventListener('change', handleQASort);
  }

  // Question list delegation for upvote buttons
  if (QAElements.list) {
    QAElements.list.addEventListener('click', handleQuestionListClick);
    QAElements.list.addEventListener('keydown', handleQuestionListKeyboard);
  }
}

/**
 * Handle Q&A form submission
 */
function handleQASubmit(e) {
  e.preventDefault();

  if (!QAElements.input) return;

  const questionText = QAElements.input.value.trim();

  // Validation
  if (!questionText) {
    announceQAMessage('Please enter a question before sending.');
    QAElements.input.focus();
    return;
  }

  if (questionText.length > 1000) {
    announceQAMessage('Question is too long. Please keep it under 1000 characters.');
    return;
  }

  // Rate limiting check
  if (QAState.rateLimited) {
    const timeLeft = Math.ceil((QAState.rateLimitReset - Date.now()) / 1000);
    announceQAMessage(`Please wait ${timeLeft}s before posting another question.`);
    return;
  }

  // Create optimistic question
  const tempQuestion = createOptimisticQuestion(questionText);

  // Add to state and render
  QAState.questions.unshift(tempQuestion);
  renderQuestions();

  // Clear form
  QAElements.input.value = '';
  updateQACharacterCount({ target: QAElements.input });

  // Simulate API call
  submitQuestion(tempQuestion);

  // Announce success
  announceQAMessage('Your question has been submitted.');

  // Set rate limit (30 seconds)
  setRateLimit(30);
}

/**
 * Handle Q&A keyboard shortcuts
 */
function handleQAKeyboard(e) {
  // Ctrl/Cmd + Enter to submit
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    handleQASubmit(e);
  }
  // Regular Enter just inserts newline (default behavior)
}

/**
 * Handle Q&A sort change
 */
function handleQASort(e) {
  QAState.sortBy = e.target.value;
  renderQuestions();
  announceQAMessage(`Questions sorted by ${QAState.sortBy === 'top' ? 'most upvoted' : 'newest'}`);
}

/**
 * Handle clicks in question list (event delegation)
 */
function handleQuestionListClick(e) {
  const upvoteBtn = e.target.closest('.upvote-btn');
  if (upvoteBtn) {
    handleUpvoteClick(upvoteBtn);
  }
}

/**
 * Handle keyboard navigation in question list
 */
function handleQuestionListKeyboard(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const upvoteBtn = e.target.closest('.upvote-btn');
    if (upvoteBtn) {
      e.preventDefault();
      handleUpvoteClick(upvoteBtn);
    }
  }

  // Arrow key navigation between questions
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const currentQuestion = e.target.closest('.question-item');
    if (currentQuestion) {
      const questions = Array.from(QAElements.list.querySelectorAll('.question-item'));
      const currentIndex = questions.indexOf(currentQuestion);

      let nextIndex;
      if (e.key === 'ArrowDown') {
        nextIndex = Math.min(currentIndex + 1, questions.length - 1);
      } else {
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      const nextUpvoteBtn = questions[nextIndex]?.querySelector('.upvote-btn');
      if (nextUpvoteBtn) {
        e.preventDefault();
        nextUpvoteBtn.focus();
      }
    }
  }

  // Home/End navigation
  if (e.key === 'Home') {
    const firstUpvoteBtn = QAElements.list.querySelector('.upvote-btn');
    if (firstUpvoteBtn) {
      e.preventDefault();
      firstUpvoteBtn.focus();
    }
  }

  if (e.key === 'End') {
    const upvoteBtns = QAElements.list.querySelectorAll('.upvote-btn');
    const lastUpvoteBtn = upvoteBtns[upvoteBtns.length - 1];
    if (lastUpvoteBtn) {
      e.preventDefault();
      lastUpvoteBtn.focus();
    }
  }
}

/**
 * Handle upvote button click
 */
function handleUpvoteClick(button) {
  const questionId = button.getAttribute('data-question-id');
  const question = QAState.questions.find(q => q.id === questionId);

  if (!question) return;

  const wasUpvoted = question.user_upvoted;
  const newUpvoted = !wasUpvoted;

  // Optimistic update
  question.user_upvoted = newUpvoted;
  question.upvote_count += newUpvoted ? 1 : -1;

  // Update UI immediately
  updateUpvoteButton(button, newUpvoted, question.upvote_count);

  // Simulate API call
  submitUpvote(questionId, newUpvoted);

  // Announce change
  const action = newUpvoted ? 'upvoted' : 'removed upvote from';
  announceQAMessage(`Question ${action}`);
}

/**
 * Update character count for Q&A input
 */
function updateQACharacterCount(e) {
  if (!QAElements.characterCount) return;

  const input = e.target;
  const currentLength = input.value.length;
  const maxLength = 1000;

  QAElements.characterCount.textContent = `${currentLength}/${maxLength}`;

  // Add warning styling if approaching limit
  if (currentLength > maxLength * 0.9) {
    QAElements.characterCount.classList.add('warning');
  } else {
    QAElements.characterCount.classList.remove('warning');
  }
}

/**
 * Create optimistic question for immediate UI update
 */
function createOptimisticQuestion(text) {
  return {
    id: `temp_${Date.now()}`,
    session_id: 's_123',
    slide_id: `slide-${AppState.currentSlide}`,
    text: text,
    created_at: new Date().toISOString(),
    created_by_user_id: QAState.currentUserId,
    anonymized_handle: QAState.currentUserHandle,
    upvote_count: 0,
    status: 'unanswered',
    answered_by: null,
    answered_at: null,
    visibility: 'public',
    pinned: false,
    moderation_flag: null,
    metadata: { optimistic: true },
    deleted: false,
    user_upvoted: false
  };
}

/**
 * Render all questions
 */
function renderQuestions() {
  if (!QAElements.list) return;

  // Sort questions
  const sortedQuestions = [...QAState.questions]
    .filter(q => !q.deleted && q.visibility === 'public')
    .sort((a, b) => {
      if (QAState.sortBy === 'top') {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.upvote_count - a.upvote_count;
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  // Clear list
  QAElements.list.innerHTML = '';

  // Render questions
  if (sortedQuestions.length === 0) {
    QAElements.list.innerHTML = `
      <div class="qa-empty">
        <p>No questions yet. Be the first to ask!</p>
      </div>
    `;
  } else {
    sortedQuestions.forEach(question => {
      const questionElement = createQuestionElement(question);
      QAElements.list.appendChild(questionElement);
    });
  }
}

/**
 * Create question element
 */
function createQuestionElement(question) {
  const article = document.createElement('article');
  article.className = `question-item ${question.status}`;
  article.setAttribute('aria-labelledby', `question-text-${question.id}`);

  if (question.pinned) {
    article.classList.add('pinned');
  }

  const timeAgo = formatTimeAgo(question.created_at);
  const statusLabel = getStatusLabel(question.status);
  const statusClass = `status-${question.status}`;

  // Check if this is the current user's question
  const isOwnQuestion = question.created_by_user_id === QAState.currentUserId;
  const authorLabel = isOwnQuestion ? 'Your question' : question.anonymized_handle;

  article.innerHTML = `
    <div class="question-content">
      <div id="question-text-${question.id}" class="question-text">${escapeHtml(question.text)}</div>
      <div class="question-meta">
        <span class="question-author">${authorLabel}</span>
        <span class="question-time" title="${new Date(question.created_at).toLocaleString()}">${timeAgo}</span>
        <span class="question-status ${statusClass}">${statusLabel}</span>
        ${question.pinned ? '<span class="question-pinned" aria-label="Pinned question">📌</span>' : ''}
      </div>
    </div>
    <div class="question-actions">
      <button
        class="upvote-btn"
        data-question-id="${question.id}"
        aria-pressed="${question.user_upvoted}"
        aria-label="${question.user_upvoted ? 'Remove upvote from this question' : 'Upvote this question'}"
        tabindex="0"
      >
        <span class="upvote-icon" aria-hidden="true">↑</span>
        <span class="upvote-count">${question.upvote_count}</span>
      </button>
    </div>
  `;

  return article;
}

/**
 * Update upvote button state
 */
function updateUpvoteButton(button, isUpvoted, count) {
  button.setAttribute('aria-pressed', isUpvoted);
  button.setAttribute('aria-label', isUpvoted ? 'Remove upvote from this question' : 'Upvote this question');

  const countElement = button.querySelector('.upvote-count');
  if (countElement) {
    countElement.textContent = count;
  }

  // Update visual state
  if (isUpvoted) {
    button.classList.add('upvoted');
  } else {
    button.classList.remove('upvoted');
  }
}

/**
 * Get status label for display
 */
function getStatusLabel(status) {
  const labels = {
    'unanswered': 'Unanswered',
    'in_discussion': 'In Discussion',
    'answered': 'Answered',
    'dismissed': 'Dismissed'
  };
  return labels[status] || 'Unknown';
}

/**
 * Format time ago
 */
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Set rate limit
 */
function setRateLimit(seconds) {
  QAState.rateLimited = true;
  QAState.rateLimitReset = Date.now() + (seconds * 1000);

  setTimeout(() => {
    QAState.rateLimited = false;
    QAState.rateLimitReset = null;
  }, seconds * 1000);
}

/**
 * Announce message to Q&A live region
 */
function announceQAMessage(message) {
  if (QAElements.liveRegion) {
    QAElements.liveRegion.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      QAElements.liveRegion.textContent = '';
    }, 1000);
  }
}

/**
 * Simulate API call to submit question
 */
function submitQuestion(question) {
  // Simulate network delay
  setTimeout(() => {
    // Update optimistic question with server response
    const serverQuestion = {
      ...question,
      id: `q_${Date.now()}`, // Replace temp ID with server ID
      metadata: {} // Remove optimistic flag
    };

    // Find and replace the optimistic question
    const index = QAState.questions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      QAState.questions[index] = serverQuestion;
      renderQuestions();
    }

    console.log('Question submitted to server:', serverQuestion);
  }, 500);
}

/**
 * Simulate API call to submit upvote
 */
function submitUpvote(questionId, isUpvoted) {
  // Simulate network delay
  setTimeout(() => {
    console.log('Upvote submitted to server:', { questionId, isUpvoted });

    // In a real implementation, handle potential errors here
    // and revert optimistic updates if necessary
  }, 200);
}

/**
 * Simulate real-time updates
 */
function setupRealTimeUpdates() {
  // Simulate receiving a new question every 30 seconds
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance
      simulateNewQuestion();
    }
  }, 30000);

  // Simulate question status updates
  setInterval(() => {
    if (Math.random() > 0.8) { // 20% chance
      simulateStatusUpdate();
    }
  }, 45000);
}

/**
 * Simulate receiving a new question from another participant
 */
function simulateNewQuestion() {
  const sampleQuestions = [
    'Can you explain the useCallback hook?',
    'How does React handle component re-renders?',
    'What are the best practices for state management?',
    'When should we use useReducer instead of useState?',
    'How do we optimize performance in React apps?'
  ];

  const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
  const participantNumber = Math.floor(Math.random() * 50) + 1;

  const newQuestion = {
    id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    session_id: 's_123',
    slide_id: `slide-${AppState.currentSlide}`,
    text: randomQuestion,
    created_at: new Date().toISOString(),
    created_by_user_id: `user_${participantNumber}`,
    anonymized_handle: `Participant #${participantNumber}`,
    upvote_count: 0,
    status: 'unanswered',
    answered_by: null,
    answered_at: null,
    visibility: 'public',
    pinned: false,
    moderation_flag: null,
    metadata: {},
    deleted: false,
    user_upvoted: false
  };

  QAState.questions.unshift(newQuestion);
  renderQuestions();

  announceQAMessage('New question received from another participant');
}

/**
 * Simulate question status update (e.g., answered by trainer)
 */
function simulateStatusUpdate() {
  const unansweredQuestions = QAState.questions.filter(q => q.status === 'unanswered');

  if (unansweredQuestions.length > 0) {
    const questionToUpdate = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];

    questionToUpdate.status = 'answered';
    questionToUpdate.answered_by = 'trainer_01';
    questionToUpdate.answered_at = new Date().toISOString();

    renderQuestions();

    // Announce if it's the current user's question
    if (questionToUpdate.created_by_user_id === QAState.currentUserId) {
      announceQAMessage('Your question has been answered');
    }
  }
}

// CSS for upvoted state
const style = document.createElement('style');
style.textContent = `
  .upvote-btn.upvoted {
    background-color: var(--color-primary);
    color: var(--color-white);
    border-color: var(--color-primary);
  }

  .question-item.pinned {
    border-left: 4px solid var(--color-warning);
    background-color: var(--color-warning);
    background-color: rgba(217, 119, 6, 0.1);
  }

  .question-pinned {
    font-size: var(--font-size-sm);
    color: var(--color-warning);
  }

  .character-count.warning {
    color: var(--color-warning);
    font-weight: var(--font-weight-semibold);
  }

  .qa-empty {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--color-text-muted);
  }

  .field-error {
    color: var(--color-danger);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

document.head.appendChild(style);

// Export for use in main.js
window.initializeQA = initializeQA;