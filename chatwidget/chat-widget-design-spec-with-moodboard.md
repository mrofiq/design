# 📱💻 Chat Widget Design Spec

## 1. Layout Behavior

-   **Mobile (default)**
    -   Full screen width.\
    -   Header with title and optional back button.\
    -   Chat area fills remaining viewport.\
    -   Bottom input fixed above keyboard.
-   **Desktop (≥ 768px)**
    -   Chat widget floats **centered**.\
    -   Fixed width: **420px** (typical chat-app width).\
    -   Max height: **80vh** with scrollable content.\
    -   Rounded corners (`rounded-2xl`) + subtle shadow (`shadow-xl`).\
    -   Background: soft neutral (`bg-white dark:bg-neutral-900`).

------------------------------------------------------------------------

## 2. Components

### Header

-   Height: `h-14`.\
-   Content: app name or conversation title.\
-   Optional avatar or back button (on mobile only).\
-   Styles:
    `flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-700`.

### Chat Messages

-   **Message bubbles**
    -   Incoming: left-aligned, light gray background
        (`bg-neutral-100`).\
    -   Outgoing: right-aligned, brand-colored
        (`bg-blue-500 text-white`).\
    -   Max width: `max-w-[75%]`.\
    -   Rounded corners: `rounded-2xl px-3 py-2`.\
-   **Timestamps**
    -   Tiny text below bubble (`text-xs text-neutral-400`).\
-   **Grouping**
    -   Consecutive messages from same sender grouped with minimal gap.

### Input Area

-   Fixed at bottom.\
-   Layout:
    -   Text input expands
        (`flex-1 bg-neutral-100 rounded-full px-4 py-2`).\
    -   Send button: circular, primary color, icon inside.\
-   Styles:
    `flex items-center gap-2 p-3 border-t border-neutral-200 dark:border-neutral-700`.

------------------------------------------------------------------------

## 3. Interaction States

-   **Send button**
    -   Default: subtle color, hover highlight on desktop.\
    -   Disabled state when input empty (`opacity-50`).\
-   **Message animation**
    -   Fade + slide-in (`transition ease-out duration-200`).\
-   **Scroll behavior**
    -   Auto-scroll to latest message on new send.

------------------------------------------------------------------------

## 4. Responsive Rules (Tailwind)

``` html
<div class="fixed inset-0 flex items-center justify-center">
  <div class="w-full h-full md:w-[420px] md:h-[80vh] md:rounded-2xl md:shadow-xl overflow-hidden bg-white dark:bg-neutral-900 flex flex-col">
    <!-- Header -->
    <div class="h-14 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-700">
      <h1 class="font-semibold text-lg">Chat</h1>
    </div>
    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <!-- Example message -->
      <div class="flex">
        <div class="bg-neutral-100 rounded-2xl px-3 py-2 max-w-[75%]">Hello 👋</div> </div>
      <div class="flex justify-end">
        <div class="bg-blue-500 text-white rounded-2xl px-3 py-2 max-w-[75%]">Hi there!</div>
      </div>
    </div>
    <!-- Input -->
    <div class="flex items-center gap-2 p-3 border-t border-neutral-200 dark:border-neutral-700">
      <input type="text" placeholder="Type a message..." class="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-full px-4 py-2 text-sm focus:outline-none"/>
      <button class="bg-blue-500 text-white rounded-full p-3 disabled:opacity-50">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
        </svg>
      </button>
    </div>
  </div>
</div>
```

------------------------------------------------------------------------

## 5. Micro UX Enhancements

-   **Typing indicator**: Three animated dots (`...`) bubble when other
    user typing.\
-   **Empty state**: Friendly message + illustration (on first open).\
-   **Read receipts**: Small checkmark on sent messages.

------------------------------------------------------------------------

## 🎨 Mood Board (Inspiration)

### Color Palette

-   **Primary:** #2563EB (Blue 600) → outgoing messages, buttons\
-   **Secondary:** #F3F4F6 (Gray 100) → incoming bubbles, input
    background\
-   **Dark Mode Base:** #111827 (Gray 900)\
-   **Accent:** #10B981 (Emerald 500) → online status, highlights

### Typography

-   **Font:** Inter / SF Pro Rounded\
-   **Weights:** 400 (body), 600 (headers), 700 (emphasis)\
-   **Style:** Clean, geometric, modern.

### Inspiration Links

-   [Chat UI exploration on
    Dribbble](https://dribbble.com/shots/20496847-Chat-App-UI)\
-   [Minimalist message
    bubbles](https://dribbble.com/shots/17166777-Chat-Concept)\
-   [Clean widget design from 21stdev](https://21stdev.com/ui)

### Mockup Style Guide

-   **Spacing:** generous padding (min 12--16px).\
-   **Rounded Corners:** consistent `2xl`.\
-   **Shadows:** soft but noticeable (`shadow-xl`).\
-   **Animations:** subtle ease-out transitions for bubbles + buttons.
