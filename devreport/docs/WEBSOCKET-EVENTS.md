# WebSocket Event Reference Guide

## Event Payload Specifications

This document provides the complete specification for all WebSocket events supported by the Developer Report Dashboard real-time system.

---

## 1. event.created

**Description**: Fired when a new activity event is created (commit, merge, review, etc.)

**Direction**: Server → Client

**Payload**:
```json
{
  "type": "event.created",
  "timestamp": "2025-10-03T10:30:00Z",
  "event": {
    "id": "evt_123456",
    "type": "commit",
    "title": "Code committed",
    "description": "Pushed 3 commits to feature/user-auth branch",
    "points": 6,
    "timestamp": "2025-10-03T10:30:00Z",
    "metadata": {
      "commits": 3,
      "branch": "feature/user-auth",
      "repository": "backend-api"
    }
  },
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john.doe@company.com"
  },
  "global": false
}
```

**Event Types**:
- `commit` - Code commit
- `merge` - Pull/Merge request merged
- `review` - Code review performed
- `task_completed` - Task completed
- `time_logged` - Time logged
- `issue_resolved` - Issue resolved
- `quality_gate_passed` - Quality gate passed
- `quality_gate_failed` - Quality gate failed

**UI Actions**:
- Add event to timeline
- Show toast notification (if points ≥ 10)
- Update points display
- Animate timeline item entrance

---

## 2. points.updated

**Description**: Fired when a user's points balance changes

**Direction**: Server → Client

**Payload**:
```json
{
  "type": "points.updated",
  "timestamp": "2025-10-03T10:30:00Z",
  "userId": "user_123",
  "points": 10,
  "change": 10,
  "reason": "Merge request merged",
  "balance": 1050,
  "previousBalance": 1040,
  "eventId": "evt_123456"
}
```

**Fields**:
- `points`: Total points value (for backwards compatibility)
- `change`: Points delta (+/-)
- `reason`: Human-readable reason for change
- `balance`: New total balance
- `previousBalance`: Previous balance
- `eventId`: Related event ID (optional)

**UI Actions**:
- Update points display with animation
- Show floating +/- points animation
- Update progress bars
- Update daily goal progress
- Animate number transitions

---

## 3. report.approved

**Description**: Fired when a report is approved by a team lead

**Direction**: Server → Client

**Payload**:
```json
{
  "type": "report.approved",
  "timestamp": "2025-10-03T10:30:00Z",
  "reportId": "rpt_123456",
  "report": {
    "id": "rpt_123456",
    "userId": "user_123",
    "date": "2025-10-02",
    "title": "Daily Report - October 2, 2025"
  },
  "approvedBy": {
    "id": "lead_789",
    "name": "Jane Smith",
    "role": "team_lead"
  },
  "approvedAt": "2025-10-03T10:30:00Z",
  "comment": "Great work on the authentication feature!"
}
```

**UI Actions**:
- Update report status badge to "approved"
- Show success toast notification
- Update report card metadata
- Add approval timestamp and approver name
- Highlight approved report

---

## 4. report.changes_requested

**Description**: Fired when a team lead requests changes to a report

**Direction**: Server → Client

**Payload**:
```json
{
  "type": "report.changes_requested",
  "timestamp": "2025-10-03T10:30:00Z",
  "reportId": "rpt_123456",
  "report": {
    "id": "rpt_123456",
    "userId": "user_123",
    "date": "2025-10-02",
    "title": "Daily Report - October 2, 2025"
  },
  "feedback": "Please add more details about the authentication implementation and testing approach.",
  "requestedBy": {
    "id": "lead_789",
    "name": "Jane Smith",
    "role": "team_lead"
  },
  "requestedAt": "2025-10-03T10:30:00Z",
  "priority": "normal"
}
```

**Priority Levels**:
- `low` - Minor suggestions
- `normal` - Standard feedback
- `high` - Important changes required

**UI Actions**:
- Update report status to "changes_requested"
- Show warning toast notification
- Display feedback in report card
- Add feedback section with requester info
- Highlight report requiring attention

---

## 5. leaderboard.updated

**Description**: Fired when leaderboard rankings change

**Direction**: Server → Client

**Payload**:
```json
{
  "type": "leaderboard.updated",
  "timestamp": "2025-10-03T10:30:00Z",
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_456",
      "name": "Alice Johnson",
      "email": "alice@company.com",
      "points": 1250,
      "trend": 0,
      "previousRank": 1,
      "avatar": "https://cdn.example.com/avatars/user_456.jpg"
    },
    {
      "rank": 2,
      "userId": "user_123",
      "name": "John Doe",
      "email": "john@company.com",
      "points": 1050,
      "trend": 1,
      "previousRank": 3,
      "avatar": "https://cdn.example.com/avatars/user_123.jpg"
    }
  ],
  "type": "individual",
  "period": "weekly",
  "lastUpdated": "2025-10-03T10:30:00Z"
}
```

**Leaderboard Types**:
- `individual` - Individual developer rankings
- `team` - Team rankings
- `department` - Department rankings

**Period Types**:
- `daily` - Current day
- `weekly` - Current week
- `monthly` - Current month
- `quarterly` - Current quarter
- `yearly` - Current year
- `all_time` - All-time rankings

**Trend Values**:
- Positive number: Moved up N positions
- Negative number: Moved down N positions
- Zero: No change in position

**UI Actions**:
- Update leaderboard table
- Highlight current user row
- Show rank change notifications
- Animate rank changes
- Update trend indicators

---

## 6. notification

**Description**: Generic system notification for various events

**Direction**: Server → Client

**Payload**:
```json
{
  "type": "notification",
  "timestamp": "2025-10-03T10:30:00Z",
  "notificationType": "warning",
  "title": "Report Reminder",
  "message": "Your daily report is due in 1 hour",
  "priority": "high",
  "action": {
    "label": "Submit Now",
    "url": "/dashboard#report",
    "type": "navigate"
  },
  "dismissible": true,
  "expiresAt": "2025-10-03T17:00:00Z",
  "metadata": {
    "reportDate": "2025-10-03",
    "deadline": "2025-10-03T17:00:00Z"
  }
}
```

**Notification Types**:
- `success` - Success message (green)
- `error` - Error message (red)
- `warning` - Warning message (yellow)
- `info` - Informational message (blue)

**Priority Levels**:
- `low` - Non-urgent notification
- `normal` - Standard notification
- `high` - Important notification (plays sound, longer duration)

**Action Types**:
- `navigate` - Navigate to URL
- `callback` - Execute JavaScript callback
- `dismiss` - Just dismiss notification

**UI Actions**:
- Show toast notification
- Apply notification type styling
- Set duration based on priority (high: 10s, normal: 5s)
- Add action button if provided
- Play sound for high priority

---

## 7. achievement.unlocked

**Description**: Fired when a user unlocks an achievement/badge

**Direction**: Server → Client

**Payload**:
```json
{
  "type": "achievement.unlocked",
  "timestamp": "2025-10-03T10:30:00Z",
  "achievement": {
    "id": "early_bird",
    "name": "Early Bird",
    "description": "Submit report before 5 PM for 5 consecutive days",
    "icon": "🌅",
    "category": "reporting",
    "rarity": "uncommon",
    "points": 50,
    "unlockedAt": "2025-10-03T10:30:00Z",
    "progress": {
      "current": 5,
      "required": 5,
      "percentage": 100
    }
  },
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@company.com"
  },
  "isFirstUnlock": true,
  "totalAchievements": 12,
  "unlockedAchievements": 5
}
```

**Achievement Categories**:
- `reporting` - Report-related achievements
- `productivity` - Productivity achievements
- `quality` - Code quality achievements
- `collaboration` - Team collaboration achievements
- `milestone` - Milestone achievements

**Rarity Levels**:
- `common` - Easy to achieve
- `uncommon` - Moderately difficult
- `rare` - Difficult to achieve
- `epic` - Very difficult to achieve
- `legendary` - Extremely rare

**UI Actions**:
- Show achievement modal with animation
- Play achievement sound
- Show congratulations toast
- Update achievements display
- Mark achievement as unlocked
- Add achievement to user profile

---

## System Events

### ping (Client → Server)

**Description**: Heartbeat message to keep connection alive

**Payload**:
```json
{
  "type": "ping",
  "timestamp": 1696323000000
}
```

### pong (Server → Client)

**Description**: Heartbeat response

**Payload**:
```json
{
  "type": "pong",
  "timestamp": 1696323000000
}
```

### subscribe (Client → Server)

**Description**: Subscribe to specific event channels

**Payload**:
```json
{
  "type": "subscribe",
  "channels": [
    "user:user_123",
    "team:team_456",
    "global"
  ]
}
```

### unsubscribe (Client → Server)

**Description**: Unsubscribe from event channels

**Payload**:
```json
{
  "type": "unsubscribe",
  "channels": [
    "team:team_456"
  ]
}
```

### error (Server → Client)

**Description**: Error message from server

**Payload**:
```json
{
  "type": "error",
  "timestamp": "2025-10-03T10:30:00Z",
  "code": "INVALID_TOKEN",
  "message": "Authentication token is invalid or expired",
  "details": {
    "reason": "Token expired at 2025-10-03T10:00:00Z"
  }
}
```

**Error Codes**:
- `INVALID_TOKEN` - Authentication token invalid
- `UNAUTHORIZED` - User not authorized
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error
- `INVALID_MESSAGE` - Malformed message

---

## Channel Naming Convention

### User Channel
Format: `user:{userId}`
Example: `user:user_123`

**Events**:
- User-specific events
- Points updates
- Report status changes
- Notifications
- Achievements

### Team Channel
Format: `team:{teamId}`
Example: `team:team_456`

**Events**:
- Team-wide notifications
- Team leaderboard updates
- Team member activities
- Team achievements

### Department Channel
Format: `department:{departmentId}`
Example: `department:dept_789`

**Events**:
- Department announcements
- Department leaderboard
- Cross-team notifications

### Global Channel
Format: `global`

**Events**:
- System-wide announcements
- Maintenance notifications
- Platform updates

---

## Message Size Limits

- Maximum message size: 64 KB
- Maximum queue size: 100 messages
- Maximum event history: 1000 events per user
- Maximum concurrent connections per user: 5

---

## Rate Limiting

### Client → Server
- Ping messages: 1 per 30 seconds
- Regular messages: 100 per minute
- Subscription changes: 10 per minute

### Server → Client
- Events: Unlimited (server-controlled)
- Notifications: 60 per minute
- Leaderboard updates: 1 per 10 seconds

---

## Connection States

### WebSocket Ready States
```javascript
0 - CONNECTING  // Connection is being established
1 - OPEN        // Connection is open and ready
2 - CLOSING     // Connection is closing
3 - CLOSED      // Connection is closed
```

### Application States
```javascript
'disconnected'  // Not connected
'connecting'    // Attempting to connect
'connected'     // Successfully connected
'reconnecting'  // Reconnection in progress
```

---

## Error Handling

### Connection Errors
```json
{
  "type": "error",
  "code": "CONNECTION_FAILED",
  "message": "Failed to establish WebSocket connection",
  "retryable": true,
  "retryAfter": 5000
}
```

### Message Errors
```json
{
  "type": "error",
  "code": "INVALID_MESSAGE",
  "message": "Message format is invalid",
  "details": {
    "field": "type",
    "reason": "Required field missing"
  }
}
```

### Authentication Errors
```json
{
  "type": "error",
  "code": "AUTH_FAILED",
  "message": "Authentication failed",
  "action": "reconnect"
}
```

---

## Best Practices

### Client Implementation

1. **Always validate incoming messages**
```javascript
wsManager.subscribe('event.created', (data) => {
  if (!data.event || !data.user) {
    console.error('Invalid event.created payload');
    return;
  }
  // Process valid event
});
```

2. **Handle connection states gracefully**
```javascript
wsManager.on('stateChange', ({ from, to }) => {
  if (to === 'disconnected') {
    showOfflineIndicator();
  } else if (to === 'connected') {
    hideOfflineIndicator();
    syncPendingChanges();
  }
});
```

3. **Queue messages when offline**
```javascript
if (!wsManager.isConnected()) {
  // Message will be queued automatically
  wsManager.send(message);
}
```

4. **Debounce frequent updates**
```javascript
const debouncedUpdate = debounce((data) => {
  updateUI(data);
}, 300);

rtManager.on('points.updated', debouncedUpdate);
```

### Server Implementation

1. **Validate user permissions**
```javascript
function canReceiveEvent(user, event) {
  return event.userId === user.id ||
         event.global ||
         user.teamId === event.teamId;
}
```

2. **Rate limit per user**
```javascript
const rateLimiter = new RateLimiter({
  points: 100,
  duration: 60000 // 100 requests per minute
});
```

3. **Batch updates when possible**
```javascript
const updates = [];
// Collect updates...
sendBatch('leaderboard.updated', updates);
```

---

## Testing

### Mock Events for Testing

```javascript
// Mock event.created
{
  type: 'event.created',
  event: {
    id: 'test_evt_1',
    type: 'commit',
    title: 'Test commit',
    points: 2,
    timestamp: new Date().toISOString()
  },
  user: { id: 'test_user', name: 'Test User' }
}

// Mock points.updated
{
  type: 'points.updated',
  userId: 'test_user',
  change: 10,
  balance: 100,
  reason: 'Test points'
}
```

---

## References

- [WebSocket API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [RFC 6455 - The WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
- [PRD Section 4.4 - Real-time Requirements](/home/rofiq/Projects/design/devreport/docs/prd.md)

---

**Version**: 1.0
**Last Updated**: 2025-10-03
**Maintained By**: Development Team
