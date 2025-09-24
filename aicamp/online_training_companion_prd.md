# Online Training Companion — Product Requirements Document (PRD)
**Version:** v1.0  
**Owner:** Product Team  
**Date:** 2025-09-16

# Executive Summary
Online Training Companion is a responsive web companion for scheduled live training sessions. Participants join via a **smartlink** and experience three modes: **pre-training, in-training, and post-training**. The product reduces friction for participants, provides trainers with real-time controls, and captures feedback and certificates post-session. Accessibility-first, mobile-friendly, and designed for high engagement.

# Goals & Success Metrics
**Goals**
- Increase participant engagement and retention.
- Standardize training delivery across devices.
- Capture actionable feedback and issue attendance certificates.

**Success metrics**
- Pre-training expectation submission rate.
- In-training engagement rate (assets accessed, feedback clicks, Q&A participation).
- Post-training survey completion rate.
- Certificate download / share rate.
- Q&A-specific metrics: questions per session, avg upvotes per question, percent answered, time-to-first-answer.

# Users & Roles
- **Participant**: registered attendee who accesses the session via smartlink and interacts in the three modes.
- **Trainer**: delivers training, controls slide sync, manages assets and Q&A, reviews feedback and attendance.

# Product Scope & Modes
The system supports three primary modes per session:
1. **Pre-training** — participant orientation (agenda, expectations, downloads).
2. **In-training** — slide viewer, code/assets, feedback, semi-public anonymous Q&A, personal notes.
3. **Post-training** — certificate delivery, feedback survey, next-step recommendations.

Responsive across **desktop, tablet, smartphone**.

# Core Features
- Smartlink access (tokenized, low-friction).
- Pre-training expectation capture and material downloads.
- Slide viewer synchronized with trainer.
- Code and asset panel (copy/download).
- Lightweight feedback reactions (👍 / 👎 / 🚀).
- Semi-public anonymous Q&A with upvotes.
- Participant personal notes per slide.
- Automated attendance detection and PDF certificate generation.
- Post-session feedback survey and trainer analytics export.

# Access & Authentication
- **Smartlink** with unique token, optionally integrated with LMS (Moodle, Canvas).
- Session auto-detect mode based on schedule.
- Optional authenticated mode for trainers and admins.

# Information Architecture (IA)
- Landing (smartlink) → auto-mode routing (pre / in / post)
- Modules: Agenda, Slides, Code/Assets, Q&A, Notes, Certificate, Feedback
- Trainer Dashboard: Upload slides/assets, control slides, Q&A moderation, attendance & feedback exports

# Design & UX Requirements
- Responsive design breakpoints: Desktop (≥1280px), Tablet (≥768px), Mobile (<768px)
- Accessibility: WCAG 3.0 AA compliance; keyboard navigation, screen reader support
- Dark / Light mode toggle
- 44x44px minimum touch targets
- Micro-interactions: slide transitions, Q&A pin highlight animations
- Personalization: Organization accent colors; trainer profile; email templates for certificates

# Front-end Data Model (UI-facing)
Primary front-end entities:
- `User` { id, role, name, email, certificate_url }
- `TrainingSession` { id, title, trainer_id, agenda, start_time, end_time, mode }
- `Slide` { id, session_id, slide_number, asset_url, notes[] }
- `Expectation` { user_id, session_id, text, timestamp }
- `Feedback` { user_id, session_id, rating, comment, timestamp }
- `Certificate` { id, user_id, session_id, pdf_url, issued_date }

# Constraints & Assumptions
- Minimal friction for participants (smartlink preferred).
- Support for intermittent connectivity (client-side queueing and reconciliation).
- Data privacy and GDPR compliance for stored expectations and feedback.
- MVP excludes persistent chat and deep LMS sync beyond simple integrations (configurable later).

# Open Questions
- Should trainers configure branded certificates (logo, signature) in v1?
- Will deep LMS integrations (grade sync, rosters) be v1 or later?
- Should in-training include a full chat or remain Q&A-only for MVP?

# Key Screens & Wireframe Descriptions
Below are **textual keyframe descriptions** for designers and engineers.

## Pre-Training Screen (Participant)
**Purpose:** Capture expectations and orient participants.  
**Components & Layout**
1. Header: Training title, trainer name, trainer avatar.
2. Agenda section: list of topics and simple timeline.
3. Expectation input: prompt "What are your expectations?" + submit button.
4. Countdown timer to start.
5. Resources: "Download Pre-Material" button.
6. Footer: branding + accessibility toggle.

## In-Training Screen (Participant)
**Purpose:** Present slides, code/assets, personal notes, feedback, and Q&A.  
**Components & Layout**
1. Main slide viewer (center, auto-synced).
2. Navigation controls (prev/next, trainer-controlled if configured).
3. Code/asset panel with copy/download actions.
4. Quick feedback bar (👍 / 👎 / 🚀).
5. Notes area (per-slide, private).
6. Q&A section (semi-public, anonymous): ask input, question board with upvotes, status badges.
7. Floating help button.

## In-Training Screen (Trainer)
**Purpose:** Control presentation and moderate Q&A.  
**Components & Layout**
1. Toolbar: upload slides/assets, start/end session.
2. Current slide preview with navigation.
3. Feedback dashboard: aggregated reactions.
4. Participant list with online status.
5. Q&A Management Panel: list of questions, upvote counts, actions (mark answered, pin, dismiss, reveal).

## Post-Training Screen (Participant)
**Purpose:** Deliver certificate and collect feedback.  
**Components & Layout**
1. Completion banner with session name.
2. Certificate section: download PDF, share link.
3. Feedback survey: rating stars + comments.
4. Next steps: suggested follow-up sessions.

## Post-Training Screen (Trainer)
**Purpose:** Download attendance and review feedback analytics.  
**Components & Layout**
1. Summary header (title, date, duration).
2. Attendance export (CSV/XLS).
3. Feedback summary: avg rating, keyword list or word cloud.
4. Certificate status (generated/sent).
5. Next actions: schedule next session or review detailed report.

# Semi-Public Anonymous Q&A — Design & Rules
**Behavioral summary**
- Participants submit questions anonymously by default.
- All participants can view question text and upvote counts but **cannot** see poster identity.
- Original poster can see their own question status (e.g., "Your question — Answered").
- Trainer sees anonymized handles (e.g., "Participant #27") and can optionally reveal identity (must be logged).
- Upvotes determine priority; default sort is "most upvoted".

**Benefits**
- Lowers barrier to asking questions (anonymity).
- Shared learning as everyone sees the same questions.
- Trainer focuses on high-priority items via upvotes.

# Q&A — Data Model & Integration
## Question entity
Fields:
- `id` (uuid)
- `session_id` (string)
- `slide_id` (string | null)
- `text` (string, max 1000 chars)
- `created_at` (datetime, ISO8601)
- `created_by_user_id` (string, stored but not shown to participants)
- `anonymized_handle` (string, e.g. "Participant #12")
- `upvote_count` (int, default 0)
- `status` (enum: `unanswered`, `in_discussion`, `answered`, `dismissed`)
- `answered_by` (trainer id | null)
- `answered_at` (datetime | null)
- `visibility` (enum: `public`, `private`) — default `public`
- `pinned` (boolean)
- `moderation_flag` (enum | null)
- `metadata` (json)
- `deleted` (boolean, soft delete)

Validation & constraints:
- `text` required, trimmed, max length 1000
- rate-limit per user (e.g., 1 question per 30s; configurable)
- profanity/PII detection at ingest and moderation workflow

## QuestionUpvote entity
Tracks which users voted to prevent duplicates:
- `id`, `question_id`, `user_id`, `created_at`
- Unique `(question_id, user_id)`
- Transactionally update cached `Question.upvote_count`

# Q&A Lifecycle (UI states)
1. **Submitted** — optimistic display then reconciled with server; moderation checks possible.
2. **Visible** — appears on board; participants can upvote.
3. **Pinned/Highlighted** — trainer pins question; overlay on slide optionally shown.
4. **Answered** — trainer marks answered; status updates for all clients.
5. **Dismissed** — trainer flags off-topic; optional visibility change.
6. **Deleted** — soft-deleted, logged.

# Q&A — API Samples & Events
**REST endpoints**
- `POST /api/sessions/{session_id}/questions` — create question
- `GET /api/sessions/{session_id}/questions?sort=top|new&page=1`
- `POST /api/questions/{id}/upvote`
- `PATCH /api/questions/{id}` — update status/pin
- `POST /api/questions/{id}/report`

**Real-time socket events**
- Outbound client events: `question.create`, `question.upvote`, `question.unupvote`, `question.action`
- Inbound server events: `question.created`, `question.upvoted`, `question.updated`, `question.highlight`, `question.deleted`

**Sample JSON - create**
Request:
```json
{ "text": "Can you show the full example for the API call?", "slide_id": "slide-3" }
```
Response:
```json
{
  "id": "q_01F8Z0ABC",
  "session_id": "s_123",
  "slide_id": "slide-3",
  "text": "Can you show the full example for the API call?",
  "created_at": "2025-09-16T08:12:34Z",
  "anonymized_handle": "Participant #27",
  "upvote_count": 0,
  "status": "unanswered",
  "pinned": false,
  "visibility": "public"
}
```

# Real-time & Client Behavior
- Use session-scoped pub/sub for sockets (room per session).
- Optimistic UI for question create and upvote; reconcile on server events.
- Rate-limiting enforced client- and server-side.
- Profanity/moderation checks at ingest.
- Focus management & ARIA announcements for important transitions (e.g., "Your question has been answered").

# UI Component Specs (Exact)
This section provides front-end-ready component specs for the Q&A feature: HTML structure, ARIA attributes, keyboard shortcuts, events, optimistic behaviors, error states, and test checklist.

**Component list**
1. `QABar` — Ask input
2. `QuestionList` — container
3. `QuestionItem` — single question
4. `UpvoteButton` — accessible toggle
5. `TrainerQAPanel` — trainer-only moderation controls
6. `QALiveRegion` — announcement live region

(Full component specs follow.)

## 1. QABar (Ask input)
- Form with `textarea#qa-ask-input` (maxlength 1000).
- Submit button `#qa-send-btn`.
- Accessible label: `aria-label="Ask a question"`.
- Keyboard: `Ctrl+Enter` or `Meta+Enter` to submit. `Enter` inserts newline.
- Client emits `question.create` with `{ tempClientId, text, slide_id? }`.
- Rate-limit & profanity messages surfaced inline.

## 2. QuestionList
- Container `<section id="qa-list" role="region" aria-label="Questions board" aria-live="polite">`.
- Focusable items; roving tabindex for keyboard navigation.
- Sorting control (`Most upvoted / Newest`) with `aria-controls`.

## 3. QuestionItem
- `article` with `aria-labelledby` linking to text.
- Upvote button with `aria-pressed`.
- Status chip (`Unanswered`, `In discussion`, `Answered`, `Dismissed`).
- Trainer controls (pin, mark answered, reveal) `aria-hidden="true"` for participants.

## 4. UpvoteButton
- `button` with `aria-pressed` toggled.
- Optimistic UI; durable idempotent server calls.
- Keyboard: `Space`/`Enter`.

## 5. TrainerQAPanel
- Aside with list of questions and trainer-only actions.
- Actions: mark answered, pin/highlight, dismiss, reveal (with confirm modal).
- Keyboard shortcuts: `A` (mark answered), `P` (pin), `D` (dismiss), `R` (reveal).

## 6. QALiveRegion
- Hidden live region `<div id="qa-live" aria-live="polite" aria-atomic="true" class="sr-only"></div">`.
- Use for short targeted announcements (e.g., "Your question has been answered").

# Accessibility Summary
- `aria-label`/`aria-labelledby` for regions and controls.
- Live regions limited and specific to avoid overwhelming screen reader users.
- Roving tabindex for keyboard navigation between questions.
- Focus management for overlays and pinned highlights.
- Contrast, hit targets, accessible tooltips, and comprehensive localized copy.

# Error States & UX Copy
- Empty question submission: "Please enter a question before sending."
- Rate limit: "Please wait Xs before posting another question."
- Moderation: "Your question has been submitted and is pending moderator review."
- Upvote failure: "Couldn't register your vote. Try again."

# Unit / E2E Test Checklist
- Submit question optimistic UI and server reconciliation.
- Upvote behavior and `aria-pressed` updates.
- Keyboard navigation (Tab, Arrow Up/Down, Home/End).
- Screen reader announcements for important events.
- Trainer reveal modal logs action and restricts visibility to trainer UI.
- Pin highlighting overlays and focus management.
- Moderated questions hide or flag appropriately.

# Analytics & Reporting
- Track Q&A metrics: questions_submitted_per_session, avg_upvotes_per_question, percent_questions_answered, time_to_first_answer, q&a engagement rate.
- Session-level analytics: attendance, materials downloads, feedback scores, certificate downloads.

# Security, Privacy & Moderation
- Store `created_by_user_id` but do not reveal to participants.
- Reveal action is logged and limited to trainers/admins; configurable by org.
- Profanity/PII detection; reporting workflow to moderators.
- Retention policy configurable (e.g., 6 months), support for user data export/delete.

# API & Backend Considerations
- Endpoints for CRUD and upvote operations for Q&A.
- Socket infrastructure per session (WebSocket / SSE / WebRTC data channel).
- Transactional upvote handling (`QuestionUpvote`) for consistency.
- Rate-limits, idempotency keys, and audit logs for sensitive actions.

# Deliverables & Next Steps
- Hand off this PRD to design (Figma) and engineering (API/RT design).
- Implement MVP with Q&A, slides sync, asset downloads, certificate generation, and feedback survey.
- Optional: provide React component stubs and accessibility test scripts (available on request).

# Appendix — Component Spec (Full)
The full component-level HTML structures, ARIA attributes, keyboard mappings, client events, and payload shapes are included in the above sections (UI Component Specs). Use those exact IDs and patterns as a starting point for React/Tailwind implementation.

---

*Generated from a collaborative design session and refined for handoff (2025-09-16).*
