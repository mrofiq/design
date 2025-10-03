# Developer Report Dashboard - Visual Reference Guide
## Quick Visual Implementation Reference

---

## Page Layouts

### 1. Login Page Layout (Desktop 1280px+)

```
┌────────────────────────────────────────────────────────────────────┐
│                        LOGIN PAGE                                   │
├────────────────────────┬───────────────────────────────────────────┤
│                        │                                            │
│   BRANDING PANEL       │        LOGIN FORM PANEL                   │
│   (50% width)          │        (50% width)                        │
│                        │                                            │
│   ┌─────────────┐      │        ┌──────────────────┐              │
│   │    LOGO     │      │        │  Welcome Back    │              │
│   └─────────────┘      │        └──────────────────┘              │
│                        │                                            │
│   Developer Report     │        Sign in to continue                │
│   Dashboard            │                                            │
│                        │        ┌────────────────────────────────┐ │
│   Track productivity,  │        │  [MS Logo] Sign in with        │ │
│   earn points, and     │        │           Microsoft            │ │
│   celebrate with       │        └────────────────────────────────┘ │
│   your team            │                                            │
│                        │                ---- or ----                │
│   ✓ Real-time tracking │                                            │
│   ✓ Gamification       │        Email Address *                    │
│   ✓ Team insights      │        ┌────────────────────────────────┐ │
│                        │        │ name@company.com               │ │
│                        │        └────────────────────────────────┘ │
│                        │                                            │
│                        │        ┌────────────────────────────────┐ │
│                        │        │        Continue                │ │
│                        │        └────────────────────────────────┘ │
│                        │                                            │
│                        │        Don't have access?                 │
│                        │        Contact Administrator              │
│                        │                                            │
│                        │        By signing in, you agree to our    │
│                        │        Terms of Service and Privacy Policy│
└────────────────────────┴───────────────────────────────────────────┘
```

### 2. Developer Dashboard Layout (Desktop 1280px+)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  TOP HEADER (64px height)                                     [Search] [🔔] [👤] │
├──────────┬────────────────────────────────────────────────────────────────────────┤
│          │  MAIN CONTENT AREA                                                     │
│ SIDEBAR  │  ┌──────────────────────────────────────────────────────────────────┐ │
│ (280px)  │  │  Welcome back, John Doe                   [View Reports] [Submit] │ │
│          │  │  Here's what's happening with your productivity today            │ │
│  ┌────┐  │  └──────────────────────────────────────────────────────────────────┘ │
│  │Logo│  │                                                                        │
│  └────┘  │  ┌─────────┬─────────┬─────────┬─────────┐ TOP STATS (4 columns)    │
│          │  │ Points  │ Streak  │  Rank   │  Level  │                           │
│ [📊] Dash│  │ 1,245   │ 15 days │   #3    │ Senior  │                           │
│ [📝] Repo│  │ +125    │  🔥     │ of 12   │ ████▒▒▒ │                           │
│ [🏆] Lead│  └─────────┴─────────┴─────────┴─────────┘                           │
│ [⚡] Achie│                                                                       │
│          │  ┌───────────────────────────────┬────────────────────────────┐      │
│ ─────────│  │  LEFT (66%)                   │  RIGHT SIDEBAR (33%)       │      │
│          │  │                               │                            │      │
│ Team Lead│  │  📅 TODAY'S ACTIVITY          │  🏆 ACHIEVEMENTS            │      │
│          │  │  ┌─────────────────────────┐  │  ┌──────┬──────┬──────┐   │      │
│ [👥] Team│  │  │ ✅ Merge Request Merged │  │  │ 🌅  │ 🤝  │ 🔒  │   │      │
│ [✔] Appro│  │  │ Feature/auth → main     │  │  │ Early│ Team │ Qual │   │      │
│          │  │  │ +10 pts  2min ago       │  │  │ Bird │Player│ Champ│   │      │
│ ─────────│  │  └─────────────────────────┘  │  └──────┴──────┴──────┘   │      │
│          │  │                               │  🔽 View All               │      │
│ Admin    │  │  ┌─────────────────────────┐  │                            │      │
│ [⚙] Users│  │  │ 👁 Code Review Done     │  │  📊 TEAM LEADERBOARD       │      │
│ [🔧] Sett│  │  │ PR #234 optimization    │  │  ┌──────────────────────┐ │      │
│          │  │  │ +3 pts  15min ago       │  │  │ 1. Sarah W    1,450  │ │      │
│          │  │  └─────────────────────────┘  │  │ 2. Mike J     1,320  │ │      │
│          │  │                               │  │ 3. You        1,245 ★│ │      │
│ [👤]     │  │  ┌─────────────────────────┐  │  │ 4. Jane D     1,180  │ │      │
│ John Doe │  │  │ ✅ Task Completed       │  │  └──────────────────────┘ │      │
│          │  │  │ Auth middleware         │  │  🔽 View Full Board        │      │
│          │  │  │ +10 pts  1hr ago        │  │                            │      │
│          │  │  └─────────────────────────┘  │  📈 THIS WEEK              │      │
│          │  │                               │  ┌──────────────────────┐ │      │
│          │  │  ─────────────────────────    │  │ Reports: 5/5 ████████│ │      │
│          │  │                               │  │ Commits: 23   ███████▒│ │      │
│          │  │  📝 DAILY REPORT              │  │ Reviews: 8    █████▒▒▒│ │      │
│          │  │  ┌─────────────────────────┐  │  │ Tasks: 12     ████████│ │      │
│          │  │  │ Activity Summary:       │  │  └──────────────────────┘ │      │
│          │  │  │ 8 events | 38 pts       │  │                            │      │
│          │  │  │                         │  │                            │      │
│          │  │  │ Work Completed: *       │  │                            │      │
│          │  │  │ ┌─────────────────────┐ │  │                            │      │
│          │  │  │ │                     │ │  │                            │      │
│          │  │  │ └─────────────────────┘ │  │                            │      │
│          │  │  │                         │  │                            │      │
│          │  │  │ Incidents: *            │  │                            │      │
│          │  │  │ ┌─────────────────────┐ │  │                            │      │
│          │  │  │ │                     │ │  │                            │      │
│          │  │  │ └─────────────────────┘ │  │                            │      │
│          │  │  │                         │  │                            │      │
│          │  │  │ [Save Draft] [Submit] │  │                            │      │
│          │  │  └─────────────────────────┘  │                            │      │
│          │  └───────────────────────────────┴────────────────────────────┘      │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

### 3. Team Lead Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  TOP HEADER                                            [Export] [Settings]      │
├──────────┬────────────────────────────────────────────────────────────────────────┤
│          │  Team Dashboard - Engineering Team Alpha (12 members)                 │
│ SIDEBAR  │                                                                        │
│          │  ┌────────┬────────┬────────┬────────┐ TEAM METRICS                  │
│  [📊]    │  │Team Avg│Complian│Pending │  Mood  │                               │
│  Dashboard│  │1,284pts│  96%   │   8    │  😊   │                               │
│          │  └────────┴────────┴────────┴────────┘                               │
│  [📝]    │                                                                        │
│  Reports │  ┌─────────────────────┬────────────────┬──────────────────┐         │
│          │  │ LEFT (42%)          │ CENTER (33%)   │ RIGHT (25%)      │         │
│  [🏆]    │  │ APPROVAL QUEUE      │ PERFORMANCE    │ ALERTS           │         │
│  Leaders │  │                     │                │                  │         │
│          │  │ [Pending] [Approved]│ 📊 Performance │ ⚠ ALERTS (3)    │         │
│  ────── │  │ [Flagged]           │ ┌────────────┐ │                  │         │
│          │  │                     │ │ Line Chart │ │ 🔴 Missing Rpts │         │
│  [👥]    │  │ 👤 John Smith      │ │ ▁▂▃▅▆█     │ │ 2 members       │         │
│  My Team │  │ Senior Dev         │ │            │ │ [Remind]        │         │
│          │  │ Submitted 2hr ago  │ └────────────┘ │                  │         │
│  [✔]     │  │ ┌────────────────┐ │                │ ⚠ Critical Block│         │
│  Approvals│  │ │Events: 12      │ │ 📊 Points Dist │ Mike: Prod issue│         │
│          │  │ │Points: +45     │ │ ┌────────────┐ │ [View]          │         │
│  ─────── │  │ │Tasks: 5        │ │ │ Pie Chart  │ │                  │         │
│          │  │ └────────────────┘ │ │ ●45% GitLab│ │ ℹ Quality Gates │         │
│  [⚙]     │  │                    │ │ ●30% OpenP │ │ 3 failures today│         │
│  Settings│  │ Work: Implemented │ │ ●15% Sonar │ │ [Review]        │         │
│          │  │ auth API endpoints│ │ ●10% Report│ │                  │         │
│          │  │ ...                │ └────────────┘ │ QUICK ACTIONS   │         │
│          │  │                    │                │                  │         │
│          │  │ ✅ Min activity   │ 👥 TEAM PERF   │ 📢 Announce     │         │
│          │  │ ✅ Word count OK  │ ┌────────────┐ │ 📅 Schedule 1:1 │         │
│          │  │ ⚠ Late submission │ │1. Sarah W  │ │ 📊 Export Report│         │
│          │  │                    │ │2. Mike J   │ │ ⚙ Point Rules   │         │
│          │  │ [View] [Approve]  │ │3. You      │ │                  │         │
│          │  │ [Request Changes] │ │...         │ │ RECOGNITION     │         │
│          │  │                    │ └────────────┘ │                  │         │
│          │  │ 👤 Mike Johnson   │                │ John → Sarah    │         │
│          │  │ Junior Dev        │                │ "Helped debug..." │         │
│          │  │ FLAGGED 🚩        │                │ 2hr ago         │         │
│          │  │ ┌────────────────┐ │                │                  │         │
│          │  │ │⚠ Issues:       │ │                │                  │         │
│          │  │ │• Only 2 events │ │                │                  │         │
│          │  │ │• Too brief     │ │                │                  │         │
│          │  │ └────────────────┘ │                │                  │         │
│          │  │ [Reject] [Contact]│                │                  │         │
│          │  └─────────────────────┴────────────────┴──────────────────┘         │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

### 4. Admin Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  System Administration                         [System Settings] [Backup Data] │
├──────────┬────────────────────────────────────────────────────────────────────────┤
│          │  Manage users, configure integrations, and monitor system health      │
│ SIDEBAR  │                                                                        │
│          │  ┌──────────┬──────────┬──────────┬──────────┐ SYSTEM HEALTH         │
│  [📊]    │  │ Status   │ Active   │ Webhook  │ Storage  │                       │
│  Dashboard│  │ ● Online │  247     │  98.5%   │ 245 GB   │                       │
│          │  │ 99.98%   │ +12 month│  Health  │ ████▒▒   │                       │
│  [📝]    │  └──────────┴──────────┴──────────┴──────────┘                       │
│  Reports │                                                                        │
│          │  ┌──────────────────────────────────────────────────────────────────┐ │
│  [🏆]    │  │ TABBED INTERFACE                                                 │ │
│  Leaders │  │ [Users 247] [Webhooks] [Points] [Logs] [Analytics]              │ │
│          │  ├──────────────────────────────────────────────────────────────────┤ │
│  ────── │  │                                                                  │ │
│          │  │ User Management                          [Search] [Invite User] │ │
│  [⚙]     │  │                                                                  │ │
│  System  │  │ Filter: [All] [Developers 185] [Team Leads 45] [Admins 17]    │ │
│          │  │ Status: [All] [Active 230] [Invited 12] [Inactive 5]           │ │
│  [👥]    │  │                                                                  │ │
│  Users   │  │ ┌──┬──────────────┬─────────┬──────────┬────────┬──────┬─────┐ │ │
│          │  │ │☐│ User         │ Role    │ Team     │ Status │Points│ ... │ │ │
│  [🔌]    │  │ ├──┼──────────────┼─────────┼──────────┼────────┼──────┼─────┤ │ │
│  Webhooks│  │ │☐│👤 Sarah W    │Team Lead│Eng Alpha │🟢Active│1,450 │ ⋮   │ │ │
│          │  │ │☐│sarah@co.com  │         │          │        │      │     │ │ │
│  [🎯]    │  │ ├──┼──────────────┼─────────┼──────────┼────────┼──────┼─────┤ │ │
│  Points  │  │ │☐│👤 Mike J     │Developer│Eng Alpha │🟢Active│1,320 │ ⋮   │ │ │
│          │  │ │☐│mike@co.com   │         │          │        │      │     │ │ │
│  [📊]    │  │ ├──┼──────────────┼─────────┼──────────┼────────┼──────┼─────┤ │ │
│  Analytics│  │ │☐│👤 Jane D     │Developer│Eng Beta  │🟢Active│1,180 │ ⋮   │ │ │
│          │  │ │☐│jane@co.com   │         │          │        │      │     │ │ │
│          │  │ ├──┼──────────────┼─────────┼──────────┼────────┼──────┼─────┤ │ │
│          │  │ │☐│👤 Tom S      │Developer│Eng Alpha │🟡Invite│  0   │ ⋮   │ │ │
│          │  │ │☐│tom@co.com    │         │          │d       │      │     │ │ │
│          │  │ └──┴──────────────┴─────────┴──────────┴────────┴──────┴─────┘ │ │
│          │  │                                                                  │ │
│          │  │ Showing 1-20 of 247    [◀] [1] [2] [3] ... [13] [▶]   Show:[20]│ │
│          │  └──────────────────────────────────────────────────────────────────┘ │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## Component Visualizations

### Button States

```
PRIMARY BUTTON STATES:

┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  Submit Report  │      │  Submit Report  │      │  Submit Report  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
    Default                  :hover                   :active
    #2196F3                  #1E88E5                  #1976D2
    Shadow: sm               Shadow: md               Shadow: sm
                            translateY(-2px)          translateY(0)

┌─────────────────┐      ┌─────────────────┐
│  ⟳ Submitting...│      │  Submit Report  │
└─────────────────┘      └─────────────────┘
    :loading                 :disabled
    opacity: 1               #E0E0E0
    spinner                  cursor: not-allowed
```

### Input Field States

```
TEXT INPUT STATES:

Default:
┌────────────────────────────────────────────┐
│ name@company.com                           │
└────────────────────────────────────────────┘
Border: 1px solid #EEEEEE

:hover
┌────────────────────────────────────────────┐
│ name@company.com                           │
└────────────────────────────────────────────┘
Border: 1px solid #BDBDBD

:focus
┌────────────────────────────────────────────┐
│ name@company.com                    │
└────────────────────────────────────────────┘
Border: 2px solid #2196F3
Shadow: 0 0 0 3px rgba(33, 150, 243, 0.2)

:error
┌────────────────────────────────────────────┐
│ invalid-email                              │
└────────────────────────────────────────────┘
❌ Please enter a valid email address
Border: 2px solid #F44336
Background: #FFEBEE

:success
┌────────────────────────────────────────────┐
│ valid@company.com                          │
└────────────────────────────────────────────┘
✓ Looks good!
Border: 2px solid #4CAF50
```

### Card Component

```
STAT CARD:

┌─────────────────────────────────────────┐
│ ┌───┐                                   │
│ │ 🏆│  Total Points                     │
│ └───┘                                   │
│       1,245                             │
│       ▲ +125 this week                  │
└─────────────────────────────────────────┘
  Padding: 24px
  Background: linear-gradient(...)
  Border-radius: 12px
  Shadow: 0 1px 3px rgba(0,0,0,0.1)

APPROVAL CARD:

┌─────────────────────────────────────────┐
│ 👤 John Smith          [⚠ Pending]      │
│    Senior Developer • 2hr ago           │
├─────────────────────────────────────────┤
│ Events: 12 | Points: +45 | Tasks: 5     │
├─────────────────────────────────────────┤
│ Work Completed:                         │
│ Implemented user authentication API...  │
│                                         │
│ Blockers:                               │
│ Waiting for QA environment access...    │
├─────────────────────────────────────────┤
│ ✓ Min activity met                      │
│ ✓ Word count OK                         │
│ ⚠ Late submission                       │
├─────────────────────────────────────────┤
│ [View Full] [Approve] [Request Changes] │
└─────────────────────────────────────────┘
```

### Modal Dialog

```
MODAL OVERLAY (full screen, rgba(0,0,0,0.5)):

    ┌─────────────────────────────────────────┐
    │ Confirm Action                      [×] │
    ├─────────────────────────────────────────┤
    │                                         │
    │ Are you sure you want to delete this    │
    │ report? This action cannot be undone.   │
    │                                         │
    ├─────────────────────────────────────────┤
    │                    [Cancel] [Confirm]   │
    └─────────────────────────────────────────┘
    Max-width: 600px
    Border-radius: 12px
    Shadow: 0 25px 50px rgba(0,0,0,0.25)
    Animation: scaleIn 0.3s ease-out
```

### Toast Notification

```
TOAST (top-right corner):

┌───────────────────────────────────────────┐
│ ✓  Success                            [×] │
│    Report submitted successfully!         │
└───────────────────────────────────────────┘
  Position: fixed; top: 24px; right: 24px
  Background: white
  Border-left: 4px solid #4CAF50
  Shadow: 0 10px 15px rgba(0,0,0,0.1)
  Animation: slideInRight 0.3s ease-out
  Auto-dismiss: 5 seconds

ERROR TOAST:

┌───────────────────────────────────────────┐
│ ❌ Error                              [×] │
│    Failed to submit. Please try again.    │
└───────────────────────────────────────────┘
  Border-left: 4px solid #F44336
```

### Timeline/Activity Feed

```
TIMELINE:

  ● ─── ✅ Merge Request Merged
  │     Feature/user-auth → main
  │     +10 pts • 2 minutes ago
  │     GitLab
  │
  ● ─── 👁 Code Review Completed
  │     PR #234 - API optimization
  │     +3 pts • 15 minutes ago
  │     GitLab
  │
  ● ─── ✅ Task Completed
  │     Implement auth middleware
  │     +10 pts • 1 hour ago
  │     OpenProject
  │
  ● ─── ✅ Quality Gate Passed
        Code analysis: 0 critical issues
        +15 pts • 2 hours ago
        SonarQube

  Marker colors:
  ● Success: #4CAF50
  ● Info: #03A9F4
  ● Warning: #FFC107
  ● Error: #F44336
```

### Progress Bar

```
PROGRESS BAR:

Label Text (14px, #616161)
┌────────────────────────────────────────┐
│████████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
└────────────────────────────────────────┘
65% of goal
Height: 8px
Border-radius: 9999px
Background: #EEEEEE
Fill: #2196F3

WITH ANIMATION:

@keyframes progressFill {
  from { width: 0; }
  to { width: 65%; }
}

STRIPED (for loading):

┌────────────────────────────────────────┐
│▓░▓░▓░▓░▓░▓░▓░▓░▓░▓░░░░░░░░░░░░░░░░░░░│
└────────────────────────────────────────┘
Animation: progressStripes 1s linear infinite
```

### Badge Component

```
BADGE VARIANTS:

┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ SUCCESS │  │ WARNING │  │  ERROR  │  │  INFO   │
└─────────┘  └─────────┘  └─────────┘  └─────────┘
  #C8E6C9      #FFECB3      #FFCDD2      #B3E5FC
  #388E3C      #F57C00      #D32F2F      #0277BD

DOT BADGE:

┌─────────────┐
│ ● Pending   │
└─────────────┘
  6px circle + 8px gap

COUNT BADGE (on icon):

┌────┐
│ 🔔8│
└────┘
  Position: absolute; top: -4px; right: -4px
  Min-width: 20px; height: 20px
  Border-radius: 9999px
  Background: #F44336; Color: white
```

### Avatar Component

```
AVATAR SIZES:

xs    sm    md    lg    xl
┌─┐  ┌──┐  ┌───┐ ┌────┐ ┌─────┐
│ │  │  │  │   │ │    │ │     │
└─┘  └──┘  └───┘ └────┘ └─────┘
24px 32px  40px  56px   80px

WITH STATUS INDICATOR:

┌───┐
│   │●  ← Online (green)
└───┘
     ● ← Offline (gray)
     ● ← Busy (red)

Status dot: 12px circle, bottom-right
Border: 2px white
```

### Dropdown Menu

```
DROPDOWN (closed):

┌──────────────┐
│ Options  ▾   │
└──────────────┘

DROPDOWN (open):

┌──────────────┐
│ Options  ▾   │
└──────────────┘
  ┌──────────────────┐
  │ Edit User        │
  │ Change Role      │
  │ Reset Password   │
  ├──────────────────┤
  │ Deactivate       │ ← danger
  └──────────────────┘
  Position: absolute
  Top: calc(100% + 8px)
  Min-width: 200px
  Shadow: 0 10px 15px rgba(0,0,0,0.1)
  Animation: fadeIn + translateY
```

---

## Responsive Breakpoints

```
MOBILE (<640px):
┌────────────────┐
│   HEADER (56px)│
│   [☰] Logo [🔔]│
├────────────────┤
│                │
│   Full Width   │
│   Single Col   │
│                │
│   Stats Stack  │
│   Vertically   │
│                │
└────────────────┘
Sidebar: off-canvas
Padding: 16px

TABLET (768px-1023px):
┌────────────────────────┐
│ HEADER (56px)          │
├──────┬─────────────────┤
│ SIDE │ MAIN (fluid)    │
│ 240px│                 │
│      │ 2-col grid      │
│      │                 │
└──────┴─────────────────┘
Sidebar: collapsible
Padding: 24px

DESKTOP (1280px+):
┌──────────────────────────────┐
│ HEADER (64px)                │
├──────┬───────────────────────┤
│ SIDE │ MAIN (max 1536px)     │
│ 280px│                       │
│      │ 3-col grid            │
│      │                       │
└──────┴───────────────────────┘
Sidebar: always visible
Padding: 32px
```

---

## Animation Timings

```
TIMING REFERENCE:

Instant     Fast       Normal     Slow       Slower
100ms       200ms      300ms      500ms      700ms
───────     ────────   ─────────  ──────────  ───────────
Checkbox    Button     Modal      Toast       Page
Toggle      Hover      Open       Slide       Transition
                       Card Lift  Menu
                                  Dropdown

EASING FUNCTIONS:

ease-out        Most common for UI
cubic-bezier(0, 0, 0.2, 1)
────────────────────────────
Entry animations, hover states

ease-in         For exits
cubic-bezier(0.4, 0, 1, 1)
────────────────────────────
Closing modals, removing items

ease-in-out     For position changes
cubic-bezier(0.4, 0, 0.2, 1)
────────────────────────────
Slides, transitions

bounce          For celebrations
cubic-bezier(0.68, -0.55, 0.265, 1.55)
────────────────────────────────────────
Badge unlocks, achievements
```

---

## Color Usage Guide

```
TEXT HIERARCHY:

Primary Text (#212121)      Use for: Headings, important content
Secondary Text (#616161)    Use for: Body text, descriptions
Tertiary Text (#9E9E9E)     Use for: Metadata, timestamps
Disabled Text (#BDBDBD)     Use for: Disabled elements

BACKGROUNDS:

Page Background (#FAFAFA)   Main page background
Card Background (#FFFFFF)   Cards, modals, dropdowns
Hover Background (#F5F5F5)  Hover states, selected items
Input Background (#FFFFFF)  Form inputs

BORDERS:

Default Border (#EEEEEE)    Dividers, card borders
Hover Border (#BDBDBD)      Input hover states
Focus Border (#2196F3)      Active/focused inputs

SEMANTIC COLORS:

Success (#4CAF50)           Positive actions, completed tasks
Warning (#FFC107)           Pending items, cautions
Error (#F44336)             Errors, destructive actions
Info (#03A9F4)              Informational messages

INTERACTIVE STATES:

Primary Action (#2196F3)    Main CTAs, links
Primary Hover (#1E88E5)     Hover on primary
Primary Active (#1976D2)    Click/active state
```

---

## Spacing Guide

```
COMPONENT SPACING:

┌─────────────────────────┐
│ ← 24px padding →       │ Card padding
│  Content               │
│                        │
└─────────────────────────┘
     ↕ 16px gap             Between cards

┌────────────────────┐
│ ← 16px →          │      Input padding
│ [Text Input ]     │
└────────────────────┘

┌──────────┐
│← 12px →  │              Button padding
│ [Button] │              (height: 44px)
└──────────┘

STACK SPACING:

Element 1
  ↕ 4px                   Tight (labels)

Element 2
  ↕ 8px                   Base unit

Element 3
  ↕ 16px                  Component gap

Element 4
  ↕ 32px                  Section gap

Element 5
  ↕ 64px                  Major sections
```

---

## Icon Sizes

```
ICON SIZE REFERENCE:

xs    sm    md    lg    xl
12px  16px  20px  24px  32px
───   ────  ────  ────  ────
Tag   Button Text  Header Hero
      Icon   Icon  Icon   Icon

ICON USAGE:

16px → Buttons, inline text
20px → Input icons, navigation
24px → Headers, stat cards
32px → Hero sections, empty states
```

---

## Typography Scale

```
HEADING HIERARCHY:

H1: 36px / Bold / -0.025em / 1.25 line
────────────────────────────────────────
  Page Title

H2: 30px / Bold / 0 / 1.25
────────────────────────────────────────
  Section Title

H3: 24px / Semi-bold / 0 / 1.25
────────────────────────────────────────
  Card Title

H4: 20px / Semi-bold / 0 / 1.5
────────────────────────────────────────
  Subsection

BODY TEXT:

Large: 18px / Normal / 0 / 1.5
────────────────────────────────────────
  Intro text, emphasis

Base: 16px / Normal / 0 / 1.5
────────────────────────────────────────
  Body text, forms

Small: 14px / Normal / 0 / 1.5
────────────────────────────────────────
  Secondary info, metadata

UTILITY:

Caption: 12px / Normal / 0.025em / 1.5
UPPERCASE
────────────────────────────────────────
  Labels, tags, timestamps
```

---

This visual reference guide provides quick, at-a-glance specifications for implementing the Developer Report Dashboard. Refer to the complete specification documents for detailed CSS, HTML, and JavaScript implementation details.

**Related Documents:**
- Part 1: Design System & Components
- Part 2: Advanced Dashboards
- Part 3: User Flows & Accessibility
- Part 4: Error Handling & Real-time
- Index: Complete overview and quick reference
