# Timeline Component - Developer Report Dashboard

## Overview

The Timeline component is a chronological activity feed designed to display developer activities such as commits, merges, task completions, code reviews, and quality checks. It provides real-time updates, filtering capabilities, and an intuitive interface for tracking project events.

## Files Created

### CSS
- **Location**: `/home/rofiq/Projects/design/devreport/css/components/timeline.css`
- **Size**: 704 lines, 15KB
- **Features**:
  - Vertical timeline with connecting line
  - Event type variants (commit, merge, task, review, quality, error)
  - Date grouping with sticky headers
  - Empty state design
  - Loading skeleton animations
  - Infinite scroll loader
  - Filter controls
  - Responsive design
  - Accessibility features
  - Print styles
  - Reduced motion support

### JavaScript
- **Location**: `/home/rofiq/Projects/design/devreport/js/components/Timeline.js`
- **Size**: 842 lines, 24KB
- **Features**:
  - Timeline component class
  - Dynamic event addition
  - Date-based event grouping
  - Relative time formatting ("2 hours ago")
  - Auto-updating timestamps
  - Infinite scroll support
  - Event type filtering
  - Click event handlers
  - Loading states
  - Accessibility support

### Example
- **Location**: `/home/rofiq/Projects/design/devreport/examples/timeline-example.html`
- **Includes**: Interactive demo with sample events and controls

## Component Features

### 1. Event Types

The timeline supports multiple event types, each with unique styling:

- **Commit** (info color) - Code commits pushed to repository
- **Merge** (primary color) - Pull request merges
- **Task** (success color) - Task completions and assignments
- **Review** (accent color) - Code reviews and approvals
- **Quality** (gold color) - Quality gate results and code analysis
- **Error** (error color) - Build failures and critical issues

### 2. Event Structure

Each event includes:
- **Icon**: Visual indicator of event type
- **Title**: Event description
- **Description**: Additional details (optional)
- **Timestamp**: Relative time display (auto-updates)
- **Points**: Score impact (positive/negative)
- **Meta Information**: Additional context (branch, user, etc.)

### 3. Date Grouping

Events are automatically grouped by date with:
- Sticky date headers
- "Today" and "Yesterday" badges
- Full date display for older events
- Smooth animations when scrolling

### 4. Filtering

Built-in filter controls allow users to:
- View all events
- Filter by specific event types
- See event counts per type
- Toggle multiple filters

### 5. Relative Time Display

Timestamps are displayed as:
- "just now" (< 1 minute)
- "5m ago" (< 1 hour)
- "2h ago" (< 24 hours)
- "3d ago" (< 1 week)
- "2w ago" (< 1 month)
- Full date (> 1 month)

Timestamps auto-update every minute by default.

### 6. Infinite Scroll

Optional infinite scroll feature:
- Loads more events as user scrolls
- Displays loading indicator
- Configurable items per page
- Callback for data fetching

### 7. Accessibility

- ARIA roles and labels
- Keyboard navigation support
- Focus visible states
- Screen reader optimized
- Reduced motion support

## Usage

### Basic Initialization

```javascript
const timeline = new Timeline('timelineContainer', {
  compact: false,
  enableFilters: true,
  groupByDate: true
});
```

### Configuration Options

```javascript
{
  // Visual options
  compact: false,                    // Use compact layout
  groupByDate: true,                 // Group events by date

  // Feature toggles
  enableFilters: true,               // Show filter controls
  enableInfiniteScroll: false,       // Enable infinite scroll

  // Behavior
  itemsPerPage: 20,                  // Items per page (infinite scroll)
  autoUpdateInterval: 60000,         // Timestamp update interval (ms)

  // Callbacks
  onEventClick: (event) => {},       // Event click handler
  onLoadMore: (page) => {}           // Load more events callback
}
```

### Adding Events

#### Single Event
```javascript
timeline.addEvent({
  id: 'evt-001',                     // Optional, auto-generated if not provided
  type: 'commit',                    // commit, merge, task, review, quality, error
  title: 'Pushed 3 commits to main',
  description: 'Updated authentication module',
  timestamp: new Date(),             // Date object or ISO string
  points: 6,                         // Score impact
  clickable: true,                   // Enable click handler
  meta: {                           // Optional metadata
    branch: 'main',
    user: 'John Doe'
  }
});
```

#### Multiple Events
```javascript
timeline.addEvents([
  {
    type: 'merge',
    title: 'Merged PR #123',
    timestamp: new Date(),
    points: 10
  },
  {
    type: 'task',
    title: 'Completed user profile',
    timestamp: new Date(),
    points: 10
  }
]);
```

### Event Click Handling

```javascript
const timeline = new Timeline('container', {
  onEventClick: (event) => {
    console.log('Event clicked:', event);
    // Open modal, navigate, or perform action
    showEventDetails(event);
  }
});
```

### Infinite Scroll

```javascript
const timeline = new Timeline('container', {
  enableInfiniteScroll: true,
  itemsPerPage: 20,
  onLoadMore: async (page) => {
    // Fetch more events from API
    const response = await fetch(`/api/events?page=${page}`);
    const data = await response.json();
    return data.events;
  }
});
```

### Filtering Events

Filters are automatically managed through the UI, but you can also:

```javascript
// Get events by type
const commits = timeline.getEventsByType('commit');

// Get events by date range
const events = timeline.getEventsByDateRange(
  '2025-10-01',
  '2025-10-03'
);

// Get event count
const commitCount = timeline.getEventCount('commit');
```

### Managing Timeline

```javascript
// Clear all events
timeline.clear();

// Stop auto-updates
timeline.stopTimeUpdates();

// Destroy timeline
timeline.destroy();
```

## Integration with Webhook Events

The Timeline component is designed to integrate seamlessly with webhook events from OpenProject, GitLab, and SonarQube.

### GitLab Webhook Integration

```javascript
// Simulate GitLab webhook event
function handleGitLabWebhook(payload) {
  const eventMap = {
    'push': 'commit',
    'merge_request': 'merge',
    'pipeline': payload.status === 'success' ? 'quality' : 'error'
  };

  timeline.addEvent({
    type: eventMap[payload.event_type],
    title: payload.title,
    description: payload.description,
    timestamp: new Date(payload.created_at),
    points: calculatePoints(payload),
    meta: {
      branch: payload.ref,
      user: payload.user_name,
      commits: payload.total_commits_count
    }
  });
}
```

### OpenProject Webhook Integration

```javascript
function handleOpenProjectWebhook(payload) {
  const eventType = payload.action === 'completed' ? 'task' : 'task';

  timeline.addEvent({
    type: eventType,
    title: `${payload.action}: ${payload.work_package.subject}`,
    description: payload.work_package.description,
    timestamp: new Date(payload.updated_at),
    points: payload.action === 'completed' ? 10 : 3,
    meta: {
      user: payload.user.name,
      project: payload.project.name
    }
  });
}
```

### SonarQube Webhook Integration

```javascript
function handleSonarQubeWebhook(payload) {
  const isPassed = payload.qualityGate.status === 'OK';

  timeline.addEvent({
    type: isPassed ? 'quality' : 'error',
    title: `Quality gate ${isPassed ? 'passed' : 'failed'}`,
    description: `Project: ${payload.project.name}`,
    timestamp: new Date(payload.analysedAt),
    points: isPassed ? 15 : -10,
    meta: {
      coverage: payload.coverage,
      bugs: payload.bugs
    }
  });
}
```

## CSS Classes Reference

### Container Classes
- `.timeline` - Main container
- `.timeline--compact` - Compact variant

### Date Grouping
- `.timeline__date-group` - Date group container
- `.timeline__date-header` - Sticky date header
- `.timeline__date-badge` - Date badge (Today, Yesterday)
- `.timeline__date-badge--today` - Today badge variant

### Timeline Item
- `.timeline__item` - Event item container
- `.timeline__item--clickable` - Clickable variant

### Icon
- `.timeline__icon` - Icon container
- `.timeline__icon--{type}` - Type variants (commit, merge, task, review, quality, error)
- `.timeline__icon-svg` - SVG icon

### Content
- `.timeline__content` - Content container
- `.timeline__content-header` - Header with title and timestamp
- `.timeline__content-title` - Event title
- `.timeline__content-timestamp` - Timestamp display
- `.timeline__content-description` - Event description
- `.timeline__content-meta` - Metadata container
- `.timeline__content-meta-item` - Individual meta item

### Points
- `.timeline__points` - Points badge
- `.timeline__points--positive` - Positive points
- `.timeline__points--negative` - Negative points

### States
- `.timeline__empty` - Empty state
- `.timeline__skeleton` - Loading skeleton
- `.timeline__loader` - Infinite scroll loader

### Filters
- `.timeline__filters` - Filter container
- `.timeline__filter-button` - Filter button
- `.timeline__filter-button--active` - Active filter
- `.timeline__filter-count` - Event count badge

## Design Tokens Used

The component uses design tokens from `/css/design-tokens.css`:

- **Colors**: Primary, success, error, info, accent, gray scale
- **Typography**: Font families, sizes, weights
- **Spacing**: 8px-based spacing system
- **Border Radius**: sm, md, lg, full
- **Shadows**: xs, sm, md, lg
- **Transitions**: Fast, normal, default
- **Z-index**: Sticky positioning

## Responsive Behavior

### Mobile (< 768px)
- Smaller icons (32px instead of 40px)
- Reduced padding
- Smaller fonts
- Vertical meta layout
- Optimized spacing

### Tablet (768px - 1024px)
- Default layout
- Full feature set

### Desktop (> 1024px)
- Full layout
- Optimal spacing
- All features enabled

## Accessibility Features

### ARIA Support
- `role="feed"` on timeline container
- `role="toolbar"` on filter controls
- `role="button"` on clickable items
- `aria-label` for screen readers
- `aria-pressed` for filter states

### Keyboard Navigation
- Tab navigation for clickable items
- Enter/Space to activate items
- Focus visible states
- Logical tab order

### Screen Readers
- Descriptive labels
- Status announcements
- Loading indicators
- Event descriptions

### Motion Preferences
- Respects `prefers-reduced-motion`
- Disables animations when requested
- Maintains functionality

## Performance Considerations

1. **Virtualization**: For large datasets (1000+ events), consider implementing virtual scrolling
2. **Lazy Loading**: Use infinite scroll for better initial load performance
3. **Debouncing**: Filter changes are immediate; consider debouncing for large datasets
4. **Memory Management**: Call `destroy()` when removing timeline from DOM
5. **Time Updates**: Configurable update interval to balance accuracy and performance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

### Real-time Event Stream

```javascript
// WebSocket connection for real-time events
const ws = new WebSocket('wss://api.example.com/events');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  timeline.addEvent({
    type: data.event_type,
    title: data.title,
    timestamp: new Date(data.timestamp),
    points: data.points
  });
};
```

### Filtered View

```javascript
// Show only positive events
const timeline = new Timeline('container');

// Add events with filtering
events.forEach(event => {
  if (event.points > 0) {
    timeline.addEvent(event);
  }
});
```

### Integration with Dashboard

```html
<div class="dashboard-section">
  <div class="card">
    <div class="card__header">
      <h2 class="card__header-title">Recent Activity</h2>
    </div>
    <div id="activityTimeline"></div>
  </div>
</div>

<script>
  const timeline = new Timeline('activityTimeline', {
    compact: true,
    enableFilters: false,
    groupByDate: true
  });

  // Fetch recent events
  fetchRecentActivity().then(events => {
    timeline.addEvents(events);
  });
</script>
```

## Testing

### Unit Tests (Example)

```javascript
describe('Timeline Component', () => {
  let timeline;

  beforeEach(() => {
    document.body.innerHTML = '<div id="timeline"></div>';
    timeline = new Timeline('timeline');
  });

  afterEach(() => {
    timeline.destroy();
  });

  test('should add event to timeline', () => {
    timeline.addEvent({
      type: 'commit',
      title: 'Test commit',
      points: 2
    });

    expect(timeline.events.length).toBe(1);
  });

  test('should filter events by type', () => {
    timeline.addEvents([
      { type: 'commit', title: 'Commit' },
      { type: 'merge', title: 'Merge' }
    ]);

    const commits = timeline.getEventsByType('commit');
    expect(commits.length).toBe(1);
  });

  test('should format relative time correctly', () => {
    const now = new Date();
    const time = timeline.formatRelativeTime(now);
    expect(time).toBe('just now');
  });
});
```

## Future Enhancements

1. **Virtual Scrolling**: For handling 10,000+ events efficiently
2. **Export Functionality**: Export timeline to PDF or CSV
3. **Search**: Search events by title or description
4. **Advanced Filters**: Date range, point range, user filters
5. **Themes**: Dark mode support
6. **Animations**: More sophisticated entry animations
7. **Grouping Options**: Group by user, project, or custom criteria
8. **Event Editing**: Inline editing of events
9. **Drag & Drop**: Reorder or categorize events
10. **Analytics**: Timeline analytics and insights

## Support

For questions or issues with the Timeline component:
- Check the example file: `/examples/timeline-example.html`
- Review the PRD: `/docs/prd.md`
- Inspect browser console for errors
- Ensure design tokens are loaded

## Version History

- **v1.0** (2025-10-03)
  - Initial release
  - Core timeline functionality
  - Event type support (6 types)
  - Date grouping
  - Filtering
  - Infinite scroll
  - Accessibility features
  - Responsive design
  - Loading states
  - Auto-updating timestamps
