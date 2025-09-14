# Patient Journey Monitoring — Mobile UI Design (Smartphone)

**Author:** Product Manager specialist (design brief)
**Target device:** Smartphone (iOS/Android)
**Artboards / Safe sizes:** iPhone 14 (375 × 812 pt), common Android baseline (360 × 800 dp)
**Date:** 2025-09-12

---

## 1. Executive summary

A compact, high-visibility smartphone app that displays the *entire patient journey* (admission → triage → treatment → labs → imaging → discharge) with real-time vital/event streaming, prioritized alerts, location & queue status, and lightweight clinical handover tools. The design favors rapid decision-making for nurses and clinicians on the floor while providing managers with quick analytics.

**MVP focus:** visibility + timely alerts + concise timeline. Later phases: rich analytics, on-device ML triage, family access, patient-facing views.

---

## 2. Goals & success metrics

* Reduce mean time-to-acknowledge for critical alerts by 40%.
* Reduce patient wait-time in polyclinic/ER by 20% via live queue visibility.
* 95% of clinicians can find patient status within 3 taps.

KPIs: alert ACK time, task completion time, retention (DAU/WAU among clinicians), number of escalations avoided.

---

## 3. Primary personas

* **Floor Nurse (primary):** needs quick glanceable patient states, acknowledge alerts, update tasks.
* **Attending Doctor:** reviews timeline, vitals trend, approves orders.
* **Clinical Coordinator / Charge Nurse:** triage board, queue & bed occupancy view.
* **Patient / Family (future):** high-level journey & ETA.

---

## 4. Core user flows

1. Open Dashboard → see top-priority patients & critical alerts.
2. Tap patient → open Patient Timeline (chronological) → view vitals, events, orders.
3. Acknowledge or escalate alert → add note → mark task done.
4. Navigate to Map / RTLS → see location & nearby staff.
5. Use Search → find patient by MRN/name/room.

Design principle: shortest path for high-frequency tasks (≤3 taps).

---

## 5. Information architecture (mobile)

**Bottom navigation (primary, 5 items max):**

* Dashboard (default)
* Patients (search + list)
* Map (RTLS / floor plan)
* Tasks / Alerts
* More (messages, settings)

**Top-level screens:**

* Dashboard (filter by ward/role)
* Patient Detail (timeline, vitals, notes, images)
* Live Vitals (chart + history + export)
* Map / RTLS
* Alerts center
* Handover Notes
* Admin/Analytics (role gated)

---

## 6. Key screens & wireframes (text sketches)

> Note: open the artboard at 375×812 pt or 360×800 dp for best fidelity.

### A. Dashboard — "single pane of glass"

* Top: Search bar (tap to full-screen search)
* Filter chips: Ward, Severity, My Patients
* Quick stats row (horizontal): Occupancy, Critical, Waiting
* Patient list (card per patient): left avatar/room, center name + timeline snippet, right status badge (Stable/Monitor/Critical), last update timestamp
* Bottom-right: Floating Action Button (FAB) for 'New note / quick alert'

Height / spacing:

* Top nav height: 56 pt
* List item height: 72–84 pt
* Padding: 16 pt

### B. Patient Detail — Timeline focused

* Header: patient name, MRN, room, primary clinician
* Tabs: Timeline | Vitals | Orders | Images
* Timeline: vertical list, grouped by date/hour, each event card shows icon, actor, time, short text, actions (ack, comment, view)
* Timeline quick-filter: Medication, Vitals, Movement

### C. Live Vitals

* Large trend chart (last X hours) with scrubber
* Latest vitals (HR, SpO2, BP, RR, Temp) shown as tiles with small sparklines
* Streaming indicator & connection status
* Action buttons: Export snapshot, Alarm history, Acknowledge

### D. Alerts / Tasks

* Tabbed: Critical | Warnings | Info
* Each alert: severity stripe color, timestamp, source, quick-actions: Acknowledge, Assign, Escalate
* Bulk ACK and filters by location

### E. Map / RTLS

* Floor selector (dropdown), zoomable floor plan with patient pins and staff pins
* Tap pin → quick card (room, name, ETA, last seen)
* Toggle: Show only critical / my patients

---

## 7. Component & layout system (tokens)

**Spacing scale:** 4, 8, 12, 16, 20, 24, 32
**Touch target:** ≥44–48 pt/dp
**List item:** 16 px padding left/right; 12 vertical padding; avatar 40 px
**FAB:** 56×56 pt, bottom-right -16 inset
**Bottom nav:** 56 pt height

**Typography (suggested):**

* Title / Header: 20–22 pt / semibold
* Section heading: 16–18 pt / medium
* Body: 14 pt / regular
* Caption: 12 pt / regular

**Icon sizes:** 24 pt (action), 20 pt (secondary), 16 pt (tiny)

---

## 8. Visual language & color palette (accessible)

**Primary:** #0A84FF (blue)
**Success:** #0BB13B
**Danger:** #FF3B30
**Warning:** #FF9500
**Background:** #FFFFFF
**Surface / cards:** #F7F7FA
**Text primary:** #111827

**Accessibility notes:** confirm contrast ratio ≥4.5:1 for body text; use patterned stripe or icon to mark severity in addition to color for colorblind users.

---

## 9. Micro-interactions & feedback

* Haptic + quick toast when alert acknowledged.
* Swipe-left on patient card → Quick actions (Message, Transfer, Call).
* Long-press patient → Mark as 'My patient'.
* Real-time reconnection indicator in Vitals view (green/yellow/red dot).

---

## 10. Data model examples (JSON)

**Patient list item**

```json
{
  "mrn": "123456",
  "name": "Ahmad, R",
  "room": "ER-12",
  "status": "critical",
  "last_update": "2025-09-12T13:54:22Z",
  "brief": "Sepsis alert; on vasopressors"
}
```

**Timeline event**

```json
{
  "event_id": "ev_987",
  "mrn": "123456",
  "type": "vitals",
  "time": "2025-09-12T13:50:00Z",
  "actor": "Monitor-ICU-01",
  "payload": {"hr": 130, "spo2": 88}
}
```

**Alert object**

```json
{
  "alert_id": "a_34",
  "mrn": "123456",
  "severity": "critical",
  "source": "vitals_procedure",
  "message": "SpO2 < 90% for 30s",
  "created_at": "2025-09-12T13:50:45Z",
  "acknowledged_by": null
}
```

---

## 11. Real-time update architecture — tradeoffs & recommendations

The choice of "call" mechanism for delivering patient updates and alerts heavily affects latency, battery, server costs, reliability, and complexity. Below are common options with pros/cons and recommended usage.

### 1) **WebSocket / MQTT over WebSocket**

* **Pros:** full-duplex low-latency streaming, good for live vitals/waveforms and two-way messages (acknowledge, commands). MQTT has small payloads, QoS levels.
* **Cons:** slightly more complex to scale (need server broker), mobile reconnection logic, keep-alive pings can affect battery.
* **Best for:** high-frequency vitals, ECG waveform streaming, real-time collaboration.
* **Recommendation:** Use MQTT over websockets (with TLS) if you expect many devices streaming high-frequency telemetry; else WebSocket for general events.

### 2) **Server-Sent Events (SSE)**

* **Pros:** simple to implement server→client events, automatic reconnection (some libs), one-way streaming is efficient.
* **Cons:** no native two-way messaging; not supported well in older mobile webviews; unstable over mobile networks.
* **Best for:** server-driven event feeds where client rarely sends messages.

### 3) **Long Polling / Short Polling**

* **Pros:** simplest server and client; works anywhere.
* **Cons:** inefficient, higher latency for near-real-time needs or high volume.
* **Best for:** low-frequency updates (every several minutes) and fallback when websockets fail.

### 4) **Push Notifications (APNs / FCM)**

* **Pros:** reliable for background notifications and re-engagement, low battery impact.
* **Cons:** payload size limited, not guaranteed immediate delivery, sometimes delayed by OS.
* **Best for:** urgent background alerts when app is in background or device locked (e.g., code blue page to on-call physician).

### 5) **gRPC (HTTP/2) or gRPC-web**

* **Pros:** efficient binary framing, bi-directional streaming possible, strong for internal microservices.
* **Cons:** mobile web limitations; gRPC needs proxies for browser compatibility.
* **Best for:** internal native apps where both client and server support gRPC.

### Recommendation (practical hybrid):

* **Foreground, active monitoring screens:** use WebSocket or MQTT for low-latency streaming.
* **Background / app closed alerts:** rely on FCM/APNs push notifications for critical alerts (with silent pushes for urgent data sync where allowed by policy).
* **Fallback:** implement polling with exponential backoff when WebSocket fails.

**Important trade-offs to highlight:** battery vs latency vs reliability vs server cost. Use topic-based subscriptions (room/patient list) to reduce payload; avoid open one-to-many push for entire hospital.

---

## 12. Offline, caching & sync

* Use a local DB (SQLite/Realm). Keep last known patient states & timeline for quick offline view.
* Queue local actions (ACK, notes) and attempt background sync when network available.
* Conflict resolution: last-writer-wins for non-critical notes, but for orders use server-side locking & optimistic UI with confirm.

---

## 13. Security & compliance

* TLS everywhere. End-to-end encryption for vitals if needed.
* Role-based access control (RBAC) + per-resource ACls.
* Audit logs for all ACKs and modifies.
* Data-at-rest encryption on device (Keychain/Keystore), secure deletion on logout.
* Local PHI minimization: cache only necessary fields, use tokenized identifiers where possible.

---

## 14. Integration & APIs (suggested endpoints)

* `GET /wards/{id}/patients` — list patients in ward
* `GET /patient/{mrn}` — patient summary
* `GET /patient/{mrn}/timeline?from=&to=` — events
* `WS /stream?topics=patient:123,ward:er` — subscribe to real-time topics
* `POST /alert/{alertId}/ack` — acknowledge

Authentication: OAuth2 with short-lived tokens + refresh; mutual TLS for device-level identity in high-security deployments.

---

## 15. Implementation choices & tradeoffs

**Native (Swift/Kotlin)**

* Pros: best performance, better low-level battery/network control, best push reliability.
* Cons: duplicate engineering across platforms.

**Cross-platform (React Native / Flutter)**

* Pros: faster feature parity, UI component reuse, single engineering team.
* Cons: slight latency in heavy-streaming UIs (waveforms) — but acceptable if most screens are data-driven charts.

**Recommendation:** Use React Native or Flutter for MVP to accelerate delivery; implement vitals streaming as a native module if high-frequency waveform rendering is required.

---

## 16. UX considerations & micro-copy examples

* Alert CTA: "Acknowledge & add note"
* Empty state: "No critical alerts — all patients stable"
* Error state: "Connection lost — showing last known data"

---

## 17. Accessibility checklist

* Support dynamic type (font scaling)
* Sufficient color contrast
* All actionable elements reachable via VoiceOver/TalkBack
* Large tap targets and clear focus states

---

## 18. MVP feature list (priority)

1. Patient list + Search + Filters (High)
2. Timeline view + limited event types (High)
3. Alerts center with ACK/Assign (High)
4. Live vitals tiles + sparklines (Medium)
5. Floor map RTLS (Medium)
6. Export / Snapshot PDF (Low)

---

## 19. Handoff & deliverables

* Figma file with components + tokens
* Design tokens JSON (colors, spacing, typography)
* Storybook for React Native components (optional)
* API contract document (OpenAPI spec)
* QA/test scenarios and user test script

---

## 20. Next steps & iteration ideas (forward-looking)

* Add on-device ML for anomaly detection (edge inference for arrhythmia).
* Family-facing simplified timeline with privacy controls.
* Predictive ETA for procedure completion using historical data.

---

## Appendix: Pixel / density guidelines

* iOS (pt) baseline: 375 × 812 (iPhone 14)
* Android baseline (mdpi / dp): 360 × 800
* Provide @1x / @2x / @3x assets for icons and images

---

*End of brief.*

If you want, I can now generate: (A) a Figma-ready component list & tokens, (B) React Native screen stubs, or (C) a clickable prototype script for testing nurses. Tell me which one to produce next.
