# Component spec overview

-   Components included:
    1.  `QABar` --- Ask input + submit
    2.  `QuestionList` --- scrollable list of `QuestionItem`
    3.  `QuestionItem` --- text, upvote, status, pin, answer badge
    4.  `UpvoteButton` --- accessible toggle
    5.  `TrainerQAPanel` --- trainer-only controls (mark answered, pin,
        reveal)
    6.  `QALiveRegion` --- ARIA live region for announcements

# Conventions

-   Tailwind utility classes shown as examples (you can map to your
    design system tokens).
-   Component `id` attributes use kebab-case (e.g., `qa-ask-input`).
-   Real-time updates emit/consume socket events: `question.created`,
    `question.upvoted`, `question.updated`, `question.deleted`,
    `question.highlight`.
-   All interactive elements must be reachable via keyboard and have
    visible focus outlines.
-   Default anonymity: participants never see `created_by_user_id`.
    Trainer may reveal via explicit action; reveal logged.

------------------------------------------------------------------------

# 1. `QABar` (Ask a Question input)

**Purpose:** allow participant to post an anonymous question tied
optionally to current slide.

## HTML structure (example)

``` html
<form id="qa-bar" class="flex gap-2 items-start" aria-label="Ask a question" onsubmit="handleSubmit(event)">
  <label for="qa-ask-input" class="sr-only">Ask a question (anonymous)</label>

  <textarea id="qa-ask-input"
    class="flex-1 min-h-[48px] resize-none rounded-md p-3 border focus:outline-none focus:ring-2 focus:ring-offset-1"
    placeholder="Ask anonymously — e.g. “Can you show the full API example?”"
    maxlength="1000"
    aria-describedby="qa-hint qa-error"
    aria-required="true"
    ></textarea>

  <div class="flex flex-col items-end gap-2">
    <button type="submit" id="qa-send-btn" class="inline-flex items-center px-3 py-2 rounded-md shadow-sm"
      aria-label="Send question" >
      Ask
    </button>

    <div id="qa-hint" class="text-xs text-muted">Anonymous by default. Upvoteable by others.</div>
  </div>
</form>
```

## Accessibility

-   `role="form"` implied by `<form>`. `aria-label` given for screen
    readers.
-   `textarea` has `aria-describedby` linking to `qa-hint` and
    `qa-error`.
-   Use `sr-only` label for visible-less label.
-   Provide character counter visually or via `aria-live` when
    approaching limit.

## Keyboard shortcuts & interactions

-   Focusable with `Tab`.\
-   Shortcut: `?` opens global quick help; **Shift + /** opens the Ask
    input (optional).\
-   `Enter` inside `textarea` inserts newline; `Ctrl + Enter` or
    `Meta + Enter` submits form. Announce submission result in
    `QALiveRegion`.

## Client-side validation

-   Trim whitespace. If empty -\> show inline error: `#qa-error` with
    `role="alert"`.
-   Rate-limit: show toast `You can send another question in Xs` when
    throttled.

## Events

-   On submit: emit `question.create.request` with payload
    `{ text, slide_id?, tempClientId }` then optimistic-add and await
    server response.
-   If moderation flagged, UI shows `Your question is pending review`.

------------------------------------------------------------------------

# 2. `QuestionList` (container)

**Purpose:** list of `QuestionItem` sorted by most-upvoted (default) or
newest.

## HTML structure

``` html
<section id="qa-list" aria-label="Questions board" role="region" aria-live="polite" tabindex="0" class="max-h-[360px] overflow-auto">
  <!-- QuestionItem elements go here -->
</section>
```

## Accessibility

-   `role="region"` + `aria-label` so screen readers can jump to the
    board.
-   `aria-live="polite"` notifies screen readers of updates (use
    sparingly; prefer localized live region for specific events).
-   Each `QuestionItem` should be focusable (`tabindex="0"`) for
    keyboard navigation.

## Keyboard interactions

-   Arrow Up / Arrow Down: move focus between question items.\
-   `Home`/`End` to jump to first/last.\
-   `u` key while a `QuestionItem` is focused toggles upvote
    (configurable).

## Sorting options

-   UI control (select or segmented) with accessible label:
    `Sort by: Most upvoted / Newest`. `aria-controls="qa-list"`.

------------------------------------------------------------------------

# 3. `QuestionItem` (single question)

**Purpose:** display question text, upvote count, status, and any
trainer actions visible to trainer.

## HTML structure

``` html
<article id="q-{id}" class="qa-item flex gap-3 p-3 rounded-md hover:bg-surface" tabindex="0" role="article" aria-labelledby="q-{id}-text">
  <div class="flex-shrink-0 self-start">
    <button class="upvote-btn inline-flex items-center" id="q-{id}-upvote" aria-pressed="false" aria-label="Upvote question">
      <span class="sr-only">Upvote question</span>
      <svg ...></svg>
      <span id="q-{id}-upvote-count" aria-hidden="true">12</span>
    </button>
  </div>

  <div class="flex-1">
    <p id="q-{id}-text" class="text-sm leading-snug">Can you show the full example for the API call?</p>
    <div class="flex items-center gap-2 mt-2 text-xs">
      <span id="q-{id}-status" class="status-chip rounded px-2 py-1 bg-muted">Unanswered</span>
      <span class="sr-only">Submitted</span>
      <span class="q-meta" aria-hidden="true"> · slide 3 · 2m ago</span>
    </div>
  </div>

  <!-- Trainer action controls visible only to trainer (aria-hidden for participants) -->
  <div class="trainer-controls" aria-hidden="true">
    <button class="btn-pin" aria-label="Pin question">Pin</button>
    <button class="btn-answer" aria-label="Mark answered">Mark Answered</button>
    <button class="btn-reveal" aria-label="Reveal poster">Reveal</button>
  </div>
</article>
```

## Accessibility & semantics

-   `article` role appropriate for individual content.
-   `aria-labelledby` points to the question text for screen readers.
-   Upvote button `aria-pressed` toggles true/false and `aria-live` not
    required; update count directly.
-   Status chip should use `role="status"` only if you want screen
    reader announcements when changed (use sparingly).

## Visual states

-   `Unanswered` (default)
-   `In discussion` (trainer pins/highlights) --- show animated pulse or
    subtle glow
-   `Answered` --- subdued color, show answered badge and optional
    trainer reply text underneath
-   `Dismissed` --- optionally show with textual reason and lower
    opacity

## Focus behavior

-   When trainer pins a question, if pinned overlay opens on slide, move
    focus to pinned overlay and set `aria-hidden="true"` on background
    to avoid two focuses.

------------------------------------------------------------------------

# 4. `UpvoteButton`

**Purpose:** accessible, single-upvote-per-user control.

## HTML

``` html
<button id="q-{id}-upvote" class="upvote-btn" aria-pressed="false" aria-label="Upvote this question (X votes)">
  <svg ... aria-hidden="true"></svg>
  <span id="q-{id}-upvote-count">3</span>
</button>
```

## Behavior & constraints

-   Single upvote per user: `POST /questions/{id}/upvote`. Support
    idempotency.
-   Optimistic UI: increment `upvote_count` locally and set
    `aria-pressed="true"` immediately; disable button while request
    pending.
-   If request fails, revert and show toast
    `Could not record vote — try again`.
-   If user un-upvotes (if allowed): call delete endpoint; update UI.

## Accessibility

-   `aria-pressed` shows state (true when user has upvoted).
-   `aria-live="polite"` on a nearby small text when upvote crosses
    thresholds (optional).
-   Keyboard activation: `Space` or `Enter` toggles upvote.

------------------------------------------------------------------------

# 5. `TrainerQAPanel`

**Purpose:** trainer moderation + rapid actions.

## HTML (simplified)

``` html
<aside id="trainer-qa-panel" role="region" aria-label="Trainer Q&A panel" class="w-80 p-4">
  <header class="flex items-center justify-between">
    <h3>Q&A</h3>
    <div>
      <label for="qa-sort" class="sr-only">Sort questions</label>
      <select id="qa-sort" class="text-sm">
        <option value="top">Most upvoted</option>
        <option value="new">Newest</option>
      </select>
    </div>
  </header>

  <div id="trainer-qa-list" class="mt-3 space-y-2">
    <!-- QuestionItem entries with extra trainer controls -->
  </div>
</aside>
```

## Trainer actions (buttons & behaviors)

-   **Mark Answered**: `PATCH /questions/{id}`
    `{status: 'answered', answered_by: trainerId}` -\> updates UI:
    status chip changes to "Answered" and `answered_at`.
    -   Accessibility: after marking answered, announce
        `aria-live="polite"` message --- "Question marked answered".
-   **Pin / Highlight**: sets `pinned=true` and emits
    `question.highlight` event to session -\> front-end overlays pinned
    question on slide; focus moves to overlay.
-   **Dismiss**: soft-delete or set `status='dismissed'`.
-   **Reveal Poster**: *must* show modal
    `Are you sure? Reveal will show participant identity and will be logged`
    with `Confirm`/`Cancel`. If confirmed, log action server-side and
    show identity in trainer UI only.
    -   UI: show revealed handle in trainer panel only. Participants see
        no change.

## Keyboard shortcuts for trainer

-   When `trainer-qa-panel` focused:
    -   `A` marks focused question as Answered
    -   `P` pins focused question
    -   `D` dismisses focused question
    -   `R` reveals poster (open confirmation modal)

(These are optional and must be configurable/announced in trainer help)

------------------------------------------------------------------------

# 6. `QALiveRegion` (Announcements)

**Purpose:** central place to announce new high-priority events (first
question created, question answered, pinned).

## HTML

``` html
<div id="qa-live" aria-live="polite" aria-atomic="true" class="sr-only"></div>
```

## Usage patterns

-   Announce new top question only for first time or when relevant:
    `New top question: "..."` to avoid overwhelming.
-   Announce status changes only if they affect the current user: e.g.,
    original poster: `Your question has been answered.`

------------------------------------------------------------------------

# 7. ARIA & Accessibility details (summary)

-   Use `aria-label` or `aria-labelledby` for all interactive regions.
-   Live regions:
    -   `QALiveRegion` (`aria-live="polite"`) for targeted
        announcements.
    -   Avoid putting entire `QuestionList` as `aria-live`; prefer
        targeted announcements when user-submitted actions finalize.
-   Keyboard navigation:
    -   Ensure tab order: Ask input → Send button → Sort control →
        Question list.
    -   Arrow keys navigate between question items (manage roving
        tabindex pattern).
    -   Provide `Skip to questions` link for screen reader users.
-   Focus management:
    -   On submit, return focus to `qa-send-btn` (or to newly created
        question).
    -   When trainer pins a question and a pinned overlay opens, move
        focus into overlay and set `inert`/`aria-hidden` for the rest.
-   Contrast, sizes, hit targets:
    -   Buttons minimum 44x44px target per WCAG/Fitts.
    -   4.5:1 contrast for text, 3:1 for large UI components.
-   Screen reader copy:
    -   Upvote button: `aria-label="Upvote question — 3 votes"`.
    -   Status: `role="status"` only if you intend to announce
        automatically.

------------------------------------------------------------------------

# 8. Client events, payloads & handling

Use these canonical event names & payload shapes.

### Outbound (client → server)

-   `question.create`

    ``` json
    { "tempClientId": "tmp-123", "text": "text", "slide_id":"slide-3" }
    ```

-   `question.upvote`

    ``` json
    { "question_id": "q_01F8", "user_id": "u_33" }
    ```

-   `question.unupvote`

    ``` json
    { "question_id": "q_01F8", "user_id": "u_33" }
    ```

-   `question.action` (trainer)

    ``` json
    { "question_id":"q_01F8", "action":"mark_answered", "trainer_id":"t_10" }
    ```

### Inbound (server → client) (socket events)

-   `question.created`

    ``` json
    { "id":"q_01F8", "text":"...", "upvote_count":0, "status":"unanswered", "anonymized_handle":"Participant #12", "created_at":"..." }
    ```

-   `question.upvoted`

    ``` json
    { "question_id":"q_01F8", "upvote_count": 4 }
    ```

-   `question.updated`

    ``` json
    { "question_id":"q_01F8", "status":"answered","pinned":true, "answered_by":"t_10" }
    ```

-   `question.highlight`

    ``` json
    { "question_id":"q_01F8", "slide_id":"slide-3", "pinned":true }
    ```

Client must reconcile optimistic updates with authoritative server
events.

------------------------------------------------------------------------

# 9. Error states & UX copy

-   **Empty submission**: inline error under textarea --- `role="alert"`
    text: "Please enter a question before sending."
-   **Rate limit**: toast or inline: "Please wait 22s before posting
    another question."
-   **Profanity/moderation**: show message: "Your question has been
    submitted and is pending moderator review."
-   **Upvote failure**: non-modal toast: "Couldn't register your vote.
    Try again."

All messages should be localized; include error codes in responses.

------------------------------------------------------------------------

# 10. Unit / E2E test checklist (QA pointers)

-   Submit question: appears immediately in list (optimistic),
    reconciles with server id.
-   Upvote: press/space toggles and `aria-pressed` updates.
-   Keyboard arrow navigation between question items works.
-   Screen reader reads: question text, status, and upvote count when
    focused.
-   Trainer reveal modal logs action and reveals identity only in
    trainer panel.
-   Pin highlights overlay on slide and focus is moved to overlay.
-   Moderated question is hidden/flagged appropriately.

------------------------------------------------------------------------

# 11. Sample CSS/Tailwind tokens (for designers)

-   Container: `bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm`
-   Buttons: base
    `inline-flex items-center justify-center px-3 py-2 rounded-md`
-   Upvote active: `bg-accent/10 ring-2 ring-accent`
-   Status chip:
    `text-xs font-medium px-2 py-1 rounded-full bg-gray-100`

------------------------------------------------------------------------

# 12. Data model quick reference (fields used by UI)

-   `id`, `text`, `created_at`, `slide_id`, `status`, `upvote_count`,
    `pinned`, `anonymized_handle`, `answered_by`, `answered_at`,
    `moderation_flag`.

------------------------------------------------------------------------
