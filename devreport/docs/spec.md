# Developer Report Dashboard - Phoenix Technical Specification

## 1. System Architecture Overview

### 1.1 Phoenix Application Structure

```
devreport/
├── config/
│   ├── config.exs           # Base configuration
│   ├── dev.exs              # Development environment
│   ├── prod.exs             # Production environment
│   └── runtime.exs          # Runtime configuration
├── lib/
│   ├── devreport/           # Core business logic (Contexts)
│   │   ├── accounts/        # User management context
│   │   ├── webhooks/        # Webhook processing context
│   │   ├── points/          # Points calculation context
│   │   ├── reports/         # Daily reports context
│   │   ├── gamification/    # Achievements & leaderboards
│   │   └── notifications/   # Email & push notifications
│   ├── devreport_web/       # Web layer
│   │   ├── controllers/     # REST API controllers
│   │   ├── live/            # LiveView modules
│   │   ├── components/      # Reusable UI components
│   │   ├── channels/        # WebSocket channels
│   │   └── plugs/           # Custom plugs
│   └── devreport.ex         # Application entry point
├── priv/
│   ├── repo/migrations/     # Database migrations
│   └── static/              # Static assets
└── test/
```

### 1.2 Core Contexts and Boundaries

**Bounded Contexts (DDD Pattern):**

1. **Accounts Context** - User management, authentication, teams, roles
2. **Webhooks Context** - Event ingestion, validation, processing
3. **Points Context** - Score calculation, ledger management, team aggregation
4. **Reports Context** - Daily report submission, validation, approval
5. **Gamification Context** - Achievements, leaderboards, badges, streaks
6. **Notifications Context** - Email reminders, in-app notifications

**Context Communication:**
- Events via Phoenix.PubSub for loose coupling
- Direct function calls for transactional operations
- Broadway pipelines for async event processing

### 1.3 LiveView vs Controller Strategy

**Use LiveView for:**
- Developer dashboard (real-time points updates)
- Team lead dashboard (live team member status)
- Leaderboards (real-time ranking changes)
- Report submission form (live validation)
- Admin panels (system monitoring)

**Use Controllers for:**
- Webhook endpoints (external system integration)
- REST API endpoints (mobile/third-party integration)
- Authentication callbacks (OAuth flow)
- File downloads/exports (CSV, PDF)

### 1.4 Database Design with Ecto Schemas

**Primary Database:** PostgreSQL 14+ with pgcrypto, uuid-ossp extensions

**Key Design Decisions:**
- UUIDs for primary keys (security, distributed systems)
- JSONB for flexible event data storage
- Materialized views for leaderboard performance
- Partitioning for events table (by month)
- Composite indexes for common queries

---

## 2. Authentication - Microsoft Azure AD SSO

### 2.1 OAuth2/OIDC Implementation Approach

**Authentication Flow:**
```
User → Phoenix App → Azure AD Login → Callback →
Session Creation → Dashboard Redirect
```

**Technical Implementation:**
1. User clicks "Sign in with Microsoft"
2. Phoenix redirects to Azure AD OAuth endpoint
3. User authenticates with Microsoft credentials
4. Azure AD redirects back with authorization code
5. Phoenix exchanges code for access token
6. Phoenix fetches user profile from Microsoft Graph API
7. Create/update local user record
8. Issue Phoenix session token
9. Store refresh token for Graph API access

### 2.2 Libraries and Dependencies

```elixir
# mix.exs
defp deps do
  [
    # Authentication
    {:ueberauth, "~> 0.10"},
    {:ueberauth_microsoft, "~> 0.18"},

    # Token management
    {:guardian, "~> 2.3"},
    {:guardian_phoenix, "~> 2.0"},

    # HTTP client for Microsoft Graph
    {:tesla, "~> 1.7"},
    {:finch, "~> 0.16"},
    {:jason, "~> 1.4"}
  ]
end
```

**Ueberauth Configuration:**

```elixir
# config/config.exs
config :ueberauth, Ueberauth,
  providers: [
    microsoft: {Ueberauth.Strategy.Microsoft, [
      default_scope: "openid email profile User.Read",
      tenant: System.get_env("AZURE_TENANT_ID")
    ]}
  ]

config :ueberauth, Ueberauth.Strategy.Microsoft.OAuth,
  client_id: System.get_env("AZURE_CLIENT_ID"),
  client_secret: System.get_env("AZURE_CLIENT_SECRET")
```

### 2.3 Session Management Strategy

**Guardian JWT Configuration:**

```elixir
# lib/devreport/guardian.ex
defmodule Devreport.Guardian do
  use Guardian, otp_app: :devreport

  def subject_for_token(%{id: id}, _claims), do: {:ok, to_string(id)}
  def resource_from_claims(%{"sub" => id}), do: {:ok, Accounts.get_user!(id)}
end

# config/config.exs
config :devreport, Devreport.Guardian,
  issuer: "devreport",
  secret_key: System.get_env("GUARDIAN_SECRET_KEY"),
  ttl: {8, :hours},
  verify_issuer: true,
  token_verify_module: Guardian.Token.Jwt.Verify
```

**Session Storage:**
- Primary sessions: Phoenix signed cookies (encrypted)
- API tokens: Guardian JWT stored in Authorization header
- Refresh tokens: Encrypted in PostgreSQL with expiry
- Session timeout: 8 hours (configurable)
- Remember me: 30-day refresh token

**Security Measures:**
```elixir
# lib/devreport_web/plugs/auth_pipeline.ex
defmodule DevreportWeb.AuthPipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :devreport,
    module: Devreport.Guardian,
    error_handler: DevreportWeb.AuthErrorHandler

  plug Guardian.Plug.VerifySession, claims: %{"typ" => "access"}
  plug Guardian.Plug.VerifyHeader, claims: %{"typ" => "access"}
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource, allow_blank: true
  plug DevreportWeb.Plugs.RateLimiter
  plug DevreportWeb.Plugs.SessionTimeout
end
```

---

## 3. Webhook Processing System

### 3.1 GenServer-based Webhook Receivers

**Architecture Pattern:**
- Webhook Controller receives HTTP POST
- Validates signature/token immediately
- Publishes event to Broadway pipeline
- Returns 200 OK quickly (<100ms)
- Broadway processes event asynchronously

```elixir
# lib/devreport_web/controllers/webhook_controller.ex
defmodule DevreportWeb.WebhookController do
  use DevreportWeb, :controller

  plug :verify_webhook_signature when action in [:gitlab, :openproject, :sonarqube]
  plug :rate_limit, [max_requests: 1000, window: 60_000]

  def gitlab(conn, params) do
    with {:ok, event} <- Webhooks.parse_gitlab_event(params),
         :ok <- Webhooks.validate_event(event),
         :ok <- Webhooks.publish_event("gitlab", event) do
      send_resp(conn, 200, "OK")
    else
      {:error, reason} ->
        send_resp(conn, 422, Jason.encode!(%{error: reason}))
    end
  end

  def openproject(conn, params) do
    # Similar implementation
  end

  def sonarqube(conn, params) do
    # Similar implementation
  end

  defp verify_webhook_signature(conn, _opts) do
    # Verify HMAC signature from webhook
  end
end
```

### 3.2 Event Processing with Broadway/GenStage

**Broadway Pipeline Configuration:**

```elixir
# lib/devreport/webhooks/event_processor.ex
defmodule Devreport.Webhooks.EventProcessor do
  use Broadway

  alias Broadway.Message
  alias Devreport.{Webhooks, Points, Repo}

  def start_link(_opts) do
    Broadway.start_link(__MODULE__,
      name: __MODULE__,
      producer: [
        module: {BroadwayRabbitMQ.Producer,
          queue: "webhook_events",
          connection: [
            username: System.get_env("RABBITMQ_USER"),
            password: System.get_env("RABBITMQ_PASS")
          ],
          qos: [prefetch_count: 50]
        },
        concurrency: 2
      ],
      processors: [
        default: [
          concurrency: 10,
          min_demand: 5,
          max_demand: 20
        ]
      ],
      batchers: [
        default: [
          batch_size: 100,
          batch_timeout: 2000,
          concurrency: 5
        ]
      ]
    )
  end

  @impl true
  def handle_message(_, %Message{data: data} = message, _context) do
    event = Jason.decode!(data)

    with {:ok, processed_event} <- Webhooks.process_event(event),
         {:ok, points} <- Points.calculate_points(processed_event),
         {:ok, _} <- Points.credit_user(points) do

      # Publish to PubSub for real-time updates
      Phoenix.PubSub.broadcast(
        Devreport.PubSub,
        "user:#{processed_event.user_id}",
        {:new_event, processed_event}
      )

      message
    else
      {:error, reason} ->
        Message.failed(message, reason)
    end
  end

  @impl true
  def handle_batch(:default, messages, _batch_info, _context) do
    # Bulk insert events to database
    events = Enum.map(messages, fn msg -> msg.data end)
    Repo.insert_all(Webhooks.Event, events)

    messages
  end
end
```

**Alternative: GenStage with PostgreSQL Queue:**

```elixir
# For simpler deployments without RabbitMQ
defmodule Devreport.Webhooks.QueueProducer do
  use GenStage

  def init(_opts) do
    schedule_poll()
    {:producer, %{}}
  end

  def handle_demand(demand, state) when demand > 0 do
    events = Webhooks.fetch_pending_events(limit: demand)
    {:noreply, events, state}
  end

  defp schedule_poll do
    Process.send_after(self(), :poll, 1000)
  end

  def handle_info(:poll, state) do
    GenStage.cast(self(), :check_demand)
    schedule_poll()
    {:noreply, [], state}
  end
end
```

### 3.3 Points Calculation Engine Design

**Points Calculation Strategy:**

```elixir
# lib/devreport/points/calculator.ex
defmodule Devreport.Points.Calculator do
  alias Devreport.Webhooks.Event

  @points_config %{
    gitlab: %{
      "push" => %{base: 2, per_commit: 1, max: 10},
      "merge_request_created" => 5,
      "merge_request_merged" => 10,
      "code_review" => 3,
      "issue_closed" => 5,
      "pipeline_success" => 2,
      "pipeline_failure" => -3
    },
    openproject: %{
      "task_completed" => 10,
      "task_created" => 3,
      "time_logged" => %{per_hour: 2},
      "comment_added" => 1
    },
    sonarqube: %{
      "quality_gate_passed" => 15,
      "quality_gate_failed" => -10,
      "coverage_increased" => %{threshold: 5, points: 10},
      "coverage_decreased" => %{threshold: 5, points: -5},
      "critical_bug" => -15,
      "vulnerability_fixed" => 20
    }
  }

  def calculate(%Event{service: service, event_type: event_type, event_data: data}) do
    config = get_in(@points_config, [service, event_type])

    points = case config do
      value when is_integer(value) -> value
      %{base: base} = cfg -> calculate_dynamic(cfg, data)
      %{per_hour: rate} -> calculate_time_based(rate, data)
      %{threshold: threshold} = cfg -> calculate_threshold(cfg, data)
      nil -> 0
    end

    {:ok, points}
  end

  defp calculate_dynamic(%{base: base, per_commit: rate, max: max}, data) do
    commits = Map.get(data, "total_commits_count", 0)
    min(base + (commits * rate), max)
  end

  defp calculate_time_based(rate, %{"hours_logged" => hours}) do
    round(hours * rate)
  end

  defp calculate_threshold(%{threshold: threshold, points: points}, data) do
    change = Map.get(data, "coverage_change", 0)
    if abs(change) >= threshold, do: points, else: 0
  end
end
```

**Points Ledger Management:**

```elixir
# lib/devreport/points.ex
defmodule Devreport.Points do
  import Ecto.Query
  alias Devreport.{Repo, Points.Ledger, Accounts.User}

  def credit_user(%{user_id: user_id, points: points, reason: reason, event_id: event_id}) do
    Repo.transaction(fn ->
      # Get current balance
      current_balance = get_user_balance(user_id)

      # Create ledger entry
      ledger_entry = %Ledger{
        user_id: user_id,
        points_change: points,
        reason: reason,
        event_id: event_id,
        balance_after: current_balance + points,
        timestamp: DateTime.utc_now()
      }

      {:ok, entry} = Repo.insert(ledger_entry)

      # Update user's cached balance
      update_user_balance(user_id, points)

      # Update team aggregate
      update_team_score(user_id, points)

      entry
    end)
  end

  def get_user_balance(user_id) do
    query = from l in Ledger,
      where: l.user_id == ^user_id,
      select: coalesce(sum(l.points_change), 0)

    Repo.one(query) || 0
  end

  defp update_team_score(user_id, points_change) do
    # Publish event for team score recalculation
    Phoenix.PubSub.broadcast(
      Devreport.PubSub,
      "team_scores",
      {:recalculate, user_id, points_change}
    )
  end
end
```

---

## 4. Real-time Features

### 4.1 LiveView for Dashboards

**Developer Dashboard LiveView:**

```elixir
# lib/devreport_web/live/dashboard_live.ex
defmodule DevreportWeb.DashboardLive do
  use DevreportWeb, :live_view

  alias Devreport.{Points, Webhooks, Reports, Gamification}

  @impl true
  def mount(_params, %{"user_id" => user_id} = _session, socket) do
    if connected?(socket) do
      # Subscribe to user-specific events
      Phoenix.PubSub.subscribe(Devreport.PubSub, "user:#{user_id}")
      Phoenix.PubSub.subscribe(Devreport.PubSub, "leaderboard")

      # Schedule periodic updates
      :timer.send_interval(60_000, self(), :update_stats)
    end

    socket =
      socket
      |> assign(:user_id, user_id)
      |> assign_async(:points, fn -> load_points(user_id) end)
      |> assign_async(:recent_events, fn -> load_events(user_id) end)
      |> assign_async(:achievements, fn -> load_achievements(user_id) end)
      |> assign(:report_submitted, Reports.submitted_today?(user_id))

    {:ok, socket}
  end

  @impl true
  def handle_info({:new_event, event}, socket) do
    # Real-time event received
    socket =
      socket
      |> update(:recent_events, fn events -> [event | events] |> Enum.take(10) end)
      |> update(:points, &(&1 + event.points))
      |> put_flash(:info, "New activity: +#{event.points} points!")

    {:noreply, socket}
  end

  @impl true
  def handle_info(:update_stats, socket) do
    # Periodic refresh
    {:noreply, update(socket, :points, &Points.get_user_balance(socket.assigns.user_id))}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="dashboard-container">
      <.async_result :let={points} assign={@points}>
        <:loading>Loading points...</:loading>
        <:failed :let={_reason}>Failed to load points</:failed>

        <div class="points-card">
          <h2>Your Points</h2>
          <div class="points-value"><%= points %></div>
          <.live_component module={PointsTrendComponent} id="trend" user_id={@user_id} />
        </div>
      </.async_result>

      <.live_component
        module={EventsFeedComponent}
        id="events-feed"
        events={@recent_events.result || []}
      />

      <.live_component
        module={ReportFormComponent}
        id="report-form"
        user_id={@user_id}
        submitted={@report_submitted}
      />
    </div>
    """
  end

  defp load_points(user_id) do
    {:ok, Points.get_user_balance(user_id)}
  end

  defp load_events(user_id) do
    {:ok, Webhooks.get_user_events(user_id, limit: 10)}
  end

  defp load_achievements(user_id) do
    {:ok, Gamification.get_user_achievements(user_id)}
  end
end
```

### 4.2 Phoenix Channels for Updates

**Leaderboard Channel:**

```elixir
# lib/devreport_web/channels/leaderboard_channel.ex
defmodule DevreportWeb.LeaderboardChannel do
  use DevreportWeb, :channel

  alias Devreport.Gamification

  @impl true
  def join("leaderboard:team:" <> team_id, _payload, socket) do
    if authorized?(socket, team_id) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    push(socket, "leaderboard", %{
      rankings: Gamification.get_team_leaderboard(socket.assigns.team_id)
    })
    {:noreply, socket}
  end

  @impl true
  def handle_in("refresh", _payload, socket) do
    {:reply, {:ok, get_leaderboard(socket)}, socket}
  end

  defp authorized?(socket, team_id) do
    socket.assigns.user.team_id == team_id
  end

  defp get_leaderboard(socket) do
    Gamification.get_team_leaderboard(socket.assigns.team_id)
  end
end
```

### 4.3 PubSub Architecture

**Event Broadcasting Strategy:**

```elixir
# lib/devreport/pub_sub/broadcaster.ex
defmodule Devreport.PubSub.Broadcaster do
  alias Phoenix.PubSub

  @pubsub Devreport.PubSub

  # User-specific events
  def broadcast_user_event(user_id, event) do
    PubSub.broadcast(@pubsub, "user:#{user_id}", {:new_event, event})
  end

  # Team-wide events
  def broadcast_team_event(team_id, event) do
    PubSub.broadcast(@pubsub, "team:#{team_id}", {:team_event, event})
  end

  # Leaderboard updates (with throttling)
  def broadcast_leaderboard_update(scope, data) do
    PubSub.broadcast(@pubsub, "leaderboard:#{scope}", {:leaderboard_update, data})
  end

  # System-wide announcements
  def broadcast_system_message(message) do
    PubSub.broadcast(@pubsub, "system", {:announcement, message})
  end
end
```

---

## 5. Daily Reporting System

### 5.1 Report Submission Workflow

```elixir
# lib/devreport/reports.ex
defmodule Devreport.Reports do
  import Ecto.Query
  alias Devreport.{Repo, Reports.Report, Webhooks, Points}

  def submit_report(attrs, user_id) do
    with {:ok, validated} <- validate_submission(attrs, user_id),
         {:ok, report} <- create_report(validated, user_id),
         {:ok, _} <- award_submission_points(user_id),
         {:ok, _} <- process_recognitions(report) do

      # Broadcast report submission
      Phoenix.PubSub.broadcast(
        Devreport.PubSub,
        "team:#{report.team_id}",
        {:report_submitted, report}
      )

      {:ok, report}
    end
  end

  defp validate_submission(attrs, user_id) do
    with :ok <- check_submission_window(),
         :ok <- check_not_already_submitted(user_id),
         :ok <- validate_minimum_events(user_id),
         :ok <- validate_content(attrs) do
      {:ok, attrs}
    end
  end

  defp check_submission_window do
    now = DateTime.utc_now()
    hour = now.hour

    if hour >= 15 and hour < 24 do
      :ok
    else
      {:error, "Reports can only be submitted between 3 PM and midnight"}
    end
  end

  defp validate_minimum_events(user_id) do
    today = Date.utc_today()
    count = Webhooks.count_user_events_for_date(user_id, today)

    if count >= 3 do
      :ok
    else
      {:error, "Minimum 3 tracked events required for report submission"}
    end
  end

  defp validate_content(%{incidents: incidents}) do
    if String.length(incidents) >= 50 do
      :ok
    else
      {:error, "Incidents description must be at least 50 characters"}
    end
  end

  defp award_submission_points(user_id) do
    now = DateTime.utc_now()

    # Early bird bonus (before 5 PM)
    bonus = if now.hour < 17, do: 5, else: 0
    base_points = 10

    Points.credit_user(%{
      user_id: user_id,
      points: base_points + bonus,
      reason: "Daily report submission",
      event_id: nil
    })
  end

  defp process_recognitions(%{recognitions: recognitions} = report) do
    Enum.each(recognitions, fn recognition ->
      # Award points to recognized user
      Points.credit_user(%{
        user_id: recognition.user_id,
        points: 5,
        reason: "Team recognition from #{report.user_id}",
        event_id: nil
      })

      # Track for achievements
      Gamification.record_recognition(recognition)
    end)

    {:ok, report}
  end
end
```

### 5.2 Scheduled Jobs with Oban

**Oban Configuration:**

```elixir
# config/config.exs
config :devreport, Oban,
  repo: Devreport.Repo,
  plugins: [
    {Oban.Plugins.Pruner, max_age: 90 * 24 * 60 * 60},
    {Oban.Plugins.Cron,
      crontab: [
        {"0 15 * * *", Devreport.Workers.ReportReminderWorker, args: %{type: "first"}},
        {"0 20 * * *", Devreport.Workers.ReportReminderWorker, args: %{type: "second"}},
        {"0 0 * * *", Devreport.Workers.MissedReportPenaltyWorker},
        {"0 1 * * *", Devreport.Workers.LeaderboardSnapshotWorker},
        {"0 2 * * SUN", Devreport.Workers.WeeklySummaryWorker}
      ]
    }
  ],
  queues: [
    default: 10,
    webhooks: 50,
    notifications: 20,
    reports: 5
  ]
```

**Report Reminder Worker:**

```elixir
# lib/devreport/workers/report_reminder_worker.ex
defmodule Devreport.Workers.ReportReminderWorker do
  use Oban.Worker, queue: :notifications, max_attempts: 3

  alias Devreport.{Accounts, Reports, Notifications}

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"type" => reminder_type}}) do
    today = Date.utc_today()

    # Get users who haven't submitted today's report
    users_without_report =
      Accounts.list_active_users()
      |> Enum.reject(&Reports.submitted_today?(&1.id))

    Enum.each(users_without_report, fn user ->
      case reminder_type do
        "first" ->
          Notifications.send_first_reminder(user, today)
        "second" ->
          Notifications.send_second_reminder(user, today)
      end
    end)

    :ok
  end
end
```

**Missed Report Penalty Worker:**

```elixir
# lib/devreport/workers/missed_report_penalty_worker.ex
defmodule Devreport.Workers.MissedReportPenaltyWorker do
  use Oban.Worker, queue: :reports

  alias Devreport.{Accounts, Reports, Points}

  @impl Oban.Worker
  def perform(%Oban.Job{}) do
    yesterday = Date.add(Date.utc_today(), -1)

    # Skip weekends (configurable)
    if Date.day_of_week(yesterday) in [6, 7] do
      :ok
    else
      apply_penalties(yesterday)
    end
  end

  defp apply_penalties(date) do
    Accounts.list_active_users()
    |> Enum.reject(&Reports.submitted_for_date?(&1.id, date))
    |> Enum.each(fn user ->
      Points.credit_user(%{
        user_id: user.id,
        points: -20,
        reason: "Missed daily report for #{date}",
        event_id: nil
      })

      Notifications.send_penalty_notification(user, date)
    end)

    :ok
  end
end
```

### 5.3 Email Notifications

**Email Configuration with Swoosh:**

```elixir
# mix.exs dependencies
{:swoosh, "~> 1.14"},
{:finch, "~> 0.16"},
{:gen_smtp, "~> 1.2"}

# config/config.exs
config :devreport, Devreport.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  relay: System.get_env("SMTP_RELAY"),
  username: System.get_env("SMTP_USERNAME"),
  password: System.get_env("SMTP_PASSWORD"),
  ssl: true,
  auth: :always,
  port: 465
```

**Email Templates:**

```elixir
# lib/devreport/notifications/emails.ex
defmodule Devreport.Notifications.Emails do
  import Swoosh.Email

  def report_reminder(user, reminder_type) do
    new()
    |> to({user.name, user.email})
    |> from({"DevReport System", "noreply@devreport.com"})
    |> subject(subject_for_reminder(reminder_type))
    |> html_body(render_reminder_email(user, reminder_type))
    |> text_body(render_text_reminder(user, reminder_type))
  end

  defp subject_for_reminder("first"), do: "Reminder: Submit your daily report"
  defp subject_for_reminder("second"), do: "⚠️ Last chance: Report due in 4 hours"

  defp render_reminder_email(user, type) do
    """
    <html>
      <body>
        <h2>Hi #{user.name},</h2>
        <p>#{message_for_type(type)}</p>
        <p>
          <a href="#{dashboard_url()}" style="...">
            Submit Report Now
          </a>
        </p>
      </body>
    </html>
    """
  end

  defp message_for_type("first") do
    "This is a friendly reminder to submit your daily report before midnight."
  end

  defp message_for_type("second") do
    "You haven't submitted your report yet. Please submit before midnight to avoid penalty."
  end
end
```

---

## 6. Database Schema (Ecto Schemas)

### 6.1 Core Schema Definitions

**Users Schema:**

```elixir
# lib/devreport/accounts/user.ex
defmodule Devreport.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "users" do
    field :email, :string
    field :name, :string
    field :employee_id, :string
    field :azure_id, :string
    field :role, Ecto.Enum, values: [:developer, :team_lead, :admin]
    field :status, Ecto.Enum, values: [:invited, :active, :inactive]
    field :points_balance, :integer, default: 0
    field :last_login_at, :utc_datetime
    field :settings, :map, default: %{}

    belongs_to :team, Devreport.Accounts.Team
    belongs_to :department, Devreport.Accounts.Department

    has_many :events, Devreport.Webhooks.Event
    has_many :reports, Devreport.Reports.Report
    has_many :ledger_entries, Devreport.Points.Ledger
    has_many :achievements, Devreport.Gamification.UserAchievement

    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :name, :employee_id, :role, :status, :team_id])
    |> validate_required([:email, :name, :role])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
    |> unique_constraint(:employee_id)
  end
end
```

**Events Schema:**

```elixir
# lib/devreport/webhooks/event.ex
defmodule Devreport.Webhooks.Event do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "events" do
    field :service, Ecto.Enum, values: [:gitlab, :openproject, :sonarqube]
    field :event_type, :string
    field :event_data, :map
    field :points_awarded, :integer
    field :processed_at, :utc_datetime
    field :external_id, :string

    belongs_to :user, Devreport.Accounts.User

    timestamps(updated_at: false)
  end

  def changeset(event, attrs) do
    event
    |> cast(attrs, [:service, :event_type, :event_data, :user_id, :external_id])
    |> validate_required([:service, :event_type, :user_id])
    |> unique_constraint([:service, :external_id])
  end
end
```

**Reports Schema:**

```elixir
# lib/devreport/reports/report.ex
defmodule Devreport.Reports.Report do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "reports" do
    field :report_date, :date
    field :work_completed, :string
    field :incidents, :string
    field :help_needed, :string
    field :tomorrow_priorities, {:array, :string}
    field :status, Ecto.Enum, values: [:draft, :submitted, :approved, :rejected]
    field :submitted_at, :utc_datetime
    field :reviewed_at, :utc_datetime

    belongs_to :user, Devreport.Accounts.User
    belongs_to :team, Devreport.Accounts.Team
    belongs_to :reviewed_by, Devreport.Accounts.User

    has_many :recognitions, Devreport.Reports.Recognition
    many_to_many :events, Devreport.Webhooks.Event,
      join_through: "report_events"

    timestamps()
  end

  def changeset(report, attrs) do
    report
    |> cast(attrs, [:report_date, :work_completed, :incidents,
                    :help_needed, :tomorrow_priorities, :status])
    |> validate_required([:report_date, :work_completed, :incidents])
    |> validate_length(:incidents, min: 50)
    |> unique_constraint([:user_id, :report_date])
  end
end
```

**Points Ledger Schema:**

```elixir
# lib/devreport/points/ledger.ex
defmodule Devreport.Points.Ledger do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "points_ledger" do
    field :points_change, :integer
    field :reason, :string
    field :balance_after, :integer
    field :timestamp, :utc_datetime
    field :metadata, :map, default: %{}

    belongs_to :user, Devreport.Accounts.User
    belongs_to :event, Devreport.Webhooks.Event

    timestamps(updated_at: false)
  end

  def changeset(ledger, attrs) do
    ledger
    |> cast(attrs, [:user_id, :points_change, :reason, :event_id, :metadata])
    |> validate_required([:user_id, :points_change, :reason])
  end
end
```

**Teams Schema:**

```elixir
# lib/devreport/accounts/team.ex
defmodule Devreport.Accounts.Team do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "teams" do
    field :name, :string
    field :points_aggregate, :integer, default: 0

    belongs_to :lead, Devreport.Accounts.User
    belongs_to :department, Devreport.Accounts.Department

    has_many :members, Devreport.Accounts.User
    has_many :reports, Devreport.Reports.Report

    timestamps()
  end

  def changeset(team, attrs) do
    team
    |> cast(attrs, [:name, :lead_id, :department_id])
    |> validate_required([:name])
  end
end
```

### 6.2 Migrations

**Users Table Migration:**

```elixir
# priv/repo/migrations/20240101000001_create_users.exs
defmodule Devreport.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS citext", ""

    create table(:users, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :email, :citext, null: false
      add :name, :string, null: false
      add :employee_id, :string
      add :azure_id, :string
      add :role, :string, null: false, default: "developer"
      add :status, :string, null: false, default: "invited"
      add :points_balance, :integer, default: 0
      add :last_login_at, :utc_datetime
      add :settings, :map, default: %{}

      add :team_id, references(:teams, type: :binary_id, on_delete: :nilify_all)
      add :department_id, references(:departments, type: :binary_id, on_delete: :nilify_all)

      timestamps()
    end

    create unique_index(:users, [:email])
    create unique_index(:users, [:employee_id])
    create unique_index(:users, [:azure_id])
    create index(:users, [:team_id])
    create index(:users, [:department_id])
    create index(:users, [:status])
  end
end
```

**Events Table Migration (Partitioned):**

```elixir
# priv/repo/migrations/20240101000002_create_events.exs
defmodule Devreport.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def up do
    create table(:events, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :service, :string, null: false
      add :event_type, :string, null: false
      add :event_data, :map, null: false
      add :points_awarded, :integer
      add :processed_at, :utc_datetime
      add :external_id, :string
      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all)
      add :inserted_at, :utc_datetime, null: false
    end

    create index(:events, [:user_id])
    create index(:events, [:service])
    create index(:events, [:inserted_at])
    create index(:events, [:processed_at])
    create unique_index(:events, [:service, :external_id])

    # Composite index for common queries
    create index(:events, [:user_id, :inserted_at])
    create index(:events, [:user_id, :service, :inserted_at])
  end

  def down do
    drop table(:events)
  end
end
```

**Points Ledger Migration:**

```elixir
# priv/repo/migrations/20240101000003_create_points_ledger.exs
defmodule Devreport.Repo.Migrations.CreatePointsLedger do
  use Ecto.Migration

  def change do
    create table(:points_ledger, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :points_change, :integer, null: false
      add :reason, :string, null: false
      add :balance_after, :integer, null: false
      add :timestamp, :utc_datetime, null: false
      add :metadata, :map, default: %{}

      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false
      add :event_id, references(:events, type: :binary_id, on_delete: :nilify_all)

      timestamps(updated_at: false)
    end

    create index(:points_ledger, [:user_id])
    create index(:points_ledger, [:timestamp])
    create index(:points_ledger, [:user_id, :timestamp])
  end
end
```

### 6.3 Indexes and Performance Optimization

**Materialized View for Leaderboards:**

```elixir
# priv/repo/migrations/20240101000010_create_leaderboard_views.exs
defmodule Devreport.Repo.Migrations.CreateLeaderboardViews do
  use Ecto.Migration

  def up do
    execute """
    CREATE MATERIALIZED VIEW user_leaderboard AS
    SELECT
      u.id,
      u.name,
      u.team_id,
      u.points_balance,
      COUNT(DISTINCT r.id) as report_streak,
      COUNT(DISTINCT e.id) as total_events,
      RANK() OVER (ORDER BY u.points_balance DESC) as rank
    FROM users u
    LEFT JOIN reports r ON r.user_id = u.id
      AND r.report_date >= CURRENT_DATE - INTERVAL '30 days'
    LEFT JOIN events e ON e.user_id = u.id
      AND e.inserted_at >= CURRENT_DATE - INTERVAL '30 days'
    WHERE u.status = 'active'
    GROUP BY u.id, u.name, u.team_id, u.points_balance
    """

    create unique_index(:user_leaderboard, [:id])
    create index(:user_leaderboard, [:team_id])
    create index(:user_leaderboard, [:rank])

    # Refresh materialized view every hour
    execute """
    CREATE OR REPLACE FUNCTION refresh_leaderboard()
    RETURNS void AS $$
    BEGIN
      REFRESH MATERIALIZED VIEW CONCURRENTLY user_leaderboard;
    END;
    $$ LANGUAGE plpgsql;
    """
  end

  def down do
    execute "DROP MATERIALIZED VIEW IF EXISTS user_leaderboard"
    execute "DROP FUNCTION IF EXISTS refresh_leaderboard()"
  end
end
```

---

## 7. Frontend Architecture

### 7.1 LiveView Components

**Points Card Component:**

```elixir
# lib/devreport_web/components/points_card.ex
defmodule DevreportWeb.PointsCard do
  use DevreportWeb, :live_component

  alias Devreport.Points

  @impl true
  def update(assigns, socket) do
    socket =
      socket
      |> assign(assigns)
      |> assign_new(:trend, fn -> calculate_trend(assigns.user_id) end)

    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-700">Your Points</h3>
        <.badge color={badge_color(@trend)}>
          <%= trend_text(@trend) %>
        </.badge>
      </div>

      <div class="text-4xl font-bold text-indigo-600 mb-2">
        <%= @points %>
      </div>

      <div class="flex items-center text-sm text-gray-500">
        <.icon name="hero-arrow-trending-up" class="w-4 h-4 mr-1" />
        <span><%= @trend %>% vs last week</span>
      </div>

      <div class="mt-4">
        <.sparkline data={@points_history} color="indigo" />
      </div>
    </div>
    """
  end

  defp calculate_trend(user_id) do
    this_week = Points.get_week_points(user_id, 0)
    last_week = Points.get_week_points(user_id, -1)

    if last_week > 0 do
      round((this_week - last_week) / last_week * 100)
    else
      0
    end
  end

  defp badge_color(trend) when trend > 0, do: "green"
  defp badge_color(trend) when trend < 0, do: "red"
  defp badge_color(_), do: "gray"

  defp trend_text(trend) when trend > 0, do: "+#{trend}%"
  defp trend_text(trend), do: "#{trend}%"
end
```

**Report Form Component:**

```elixir
# lib/devreport_web/components/report_form.ex
defmodule DevreportWeb.ReportForm do
  use DevreportWeb, :live_component

  alias Devreport.Reports

  @impl true
  def update(assigns, socket) do
    changeset = Reports.change_report(%Reports.Report{})

    socket =
      socket
      |> assign(assigns)
      |> assign(:form, to_form(changeset))
      |> assign(:auto_populated_events, load_today_events(assigns.user_id))

    {:ok, socket}
  end

  @impl true
  def handle_event("validate", %{"report" => params}, socket) do
    changeset =
      %Reports.Report{}
      |> Reports.change_report(params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :form, to_form(changeset))}
  end

  @impl true
  def handle_event("submit", %{"report" => params}, socket) do
    case Reports.submit_report(params, socket.assigns.user_id) do
      {:ok, report} ->
        socket =
          socket
          |> put_flash(:info, "Report submitted successfully! +10 points")
          |> push_navigate(to: ~p"/dashboard")

        {:noreply, socket}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, :form, to_form(changeset))}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="max-w-4xl mx-auto">
      <.form
        for={@form}
        phx-change="validate"
        phx-submit="submit"
        phx-target={@myself}
      >
        <div class="space-y-6">
          <!-- Auto-populated events -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold mb-2">Today's Activity</h4>
            <ul class="space-y-2">
              <%= for event <- @auto_populated_events do %>
                <li class="flex items-center text-sm">
                  <.icon name={event_icon(event.service)} class="w-4 h-4 mr-2" />
                  <span><%= event.event_type %> - <%= event.description %></span>
                  <span class="ml-auto text-green-600">+<%= event.points %></span>
                </li>
              <% end %>
            </ul>
          </div>

          <!-- Work completed -->
          <.input
            field={@form[:work_completed]}
            type="textarea"
            label="Work Completed"
            rows="4"
            required
          />

          <!-- Incidents -->
          <.input
            field={@form[:incidents]}
            type="textarea"
            label="Incidents/Blockers (min 50 characters)"
            rows="4"
            required
            phx-debounce="300"
          />
          <p class="text-sm text-gray-500">
            <%= String.length(@form[:incidents].value || "") %> / 50 characters
          </p>

          <!-- Help needed -->
          <.input
            field={@form[:help_needed]}
            type="textarea"
            label="Help Needed (optional)"
            rows="2"
          />

          <!-- Tomorrow's priorities -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tomorrow's Priorities
            </label>
            <.inputs_for :let={priority} field={@form[:tomorrow_priorities]}>
              <.input field={priority} type="text" placeholder="Enter priority..." />
            </.inputs_for>
            <button
              type="button"
              phx-click="add_priority"
              phx-target={@myself}
              class="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
            >
              + Add another priority
            </button>
          </div>

          <!-- Submit button -->
          <div class="flex justify-end">
            <.button
              type="submit"
              disabled={!@form.source.valid?}
              class="px-6 py-2"
            >
              Submit Report
            </.button>
          </div>
        </div>
      </.form>
    </div>
    """
  end

  defp load_today_events(user_id) do
    Devreport.Webhooks.get_user_events_for_date(user_id, Date.utc_today())
  end

  defp event_icon("gitlab"), do: "hero-code-bracket"
  defp event_icon("openproject"), do: "hero-clipboard-document-check"
  defp event_icon("sonarqube"), do: "hero-shield-check"
end
```

### 7.2 Tailwind CSS Configuration

```javascript
// assets/tailwind.config.js
module.exports = {
  content: [
    './js/**/*.js',
    '../lib/*_web.ex',
    '../lib/*_web/**/*.*ex'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

### 7.3 JavaScript Interop (Alpine.js)

```javascript
// assets/js/app.js
import "phoenix_html"
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"
import Alpine from 'alpinejs'

// Alpine.js components
window.Alpine = Alpine

Alpine.data('leaderboard', () => ({
  filter: 'all',
  timeframe: 'weekly',

  init() {
    this.$watch('filter', value => {
      this.$dispatch('filter-changed', {filter: value})
    })
  }
}))

Alpine.data('notifications', () => ({
  unread: 0,
  messages: [],

  addNotification(message) {
    this.messages.unshift(message)
    this.unread++
  },

  markAsRead() {
    this.unread = 0
  }
}))

Alpine.start()

// LiveView hooks
let Hooks = {}

Hooks.PointsAnimation = {
  mounted() {
    this.handleEvent("points-update", ({points}) => {
      this.animatePoints(points)
    })
  },

  animatePoints(newPoints) {
    const element = this.el
    const currentPoints = parseInt(element.textContent)
    const increment = (newPoints - currentPoints) / 20
    let current = currentPoints

    const timer = setInterval(() => {
      current += increment
      element.textContent = Math.round(current)

      if (Math.abs(current - newPoints) < 1) {
        element.textContent = newPoints
        clearInterval(timer)
      }
    }, 50)
  }
}

Hooks.Chart = {
  mounted() {
    this.initChart()
  },

  updated() {
    this.updateChart()
  },

  initChart() {
    // Chart.js initialization
    const ctx = this.el.getContext('2d')
    const data = JSON.parse(this.el.dataset.chartData)

    this.chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  },

  updateChart() {
    const data = JSON.parse(this.el.dataset.chartData)
    this.chart.data = data
    this.chart.update()
  }
}

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {
  params: {_csrf_token: csrfToken},
  hooks: Hooks,
  dom: {
    onBeforeElUpdated(from, to) {
      if (from._x_dataStack) {
        window.Alpine.clone(from, to)
      }
    }
  }
})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", info => topbar.show())
window.addEventListener("phx:page-loading-stop", info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation
window.liveSocket = liveSocket
```

---

## 8. Background Jobs & Scheduling

### 8.1 Oban Workers Overview

**Worker Types:**

1. **Report Reminders** - Send emails at 3 PM and 8 PM
2. **Missed Report Penalties** - Apply -20 points at midnight
3. **Leaderboard Snapshots** - Daily archival at 1 AM
4. **Weekly Summaries** - Send team performance emails Sunday 2 AM
5. **Points Aggregation** - Recalculate team scores hourly
6. **Achievement Checks** - Evaluate achievement criteria every 6 hours
7. **Data Cleanup** - Archive old events after 90 days

### 8.2 Achievement Processing Worker

```elixir
# lib/devreport/workers/achievement_processor_worker.ex
defmodule Devreport.Workers.AchievementProcessorWorker do
  use Oban.Worker, queue: :default, max_attempts: 2

  alias Devreport.Gamification

  @impl Oban.Worker
  def perform(%Oban.Job{}) do
    # Check all achievement criteria for all users
    achievements = [
      &check_early_bird/1,
      &check_team_player/1,
      &check_quality_champion/1,
      &check_productivity_star/1,
      &check_streak_master/1
    ]

    Devreport.Accounts.list_active_users()
    |> Enum.each(fn user ->
      Enum.each(achievements, fn check_fn ->
        case check_fn.(user) do
          {:ok, achievement} ->
            Gamification.award_achievement(user, achievement)
          _ ->
            :ok
        end
      end)
    end)

    :ok
  end

  defp check_early_bird(user) do
    # Check if user submitted before 5 PM for 5 consecutive days
    reports = Devreport.Reports.get_recent_reports(user.id, 5)

    if length(reports) == 5 and Enum.all?(reports, &submitted_early?/1) do
      {:ok, :early_bird}
    else
      :skip
    end
  end

  defp submitted_early?(report) do
    report.submitted_at.hour < 17
  end

  defp check_team_player(user) do
    recognition_count = Devreport.Reports.count_recognitions_received(user.id)

    if recognition_count >= 10 do
      {:ok, :team_player}
    else
      :skip
    end
  end

  defp check_quality_champion(user) do
    # Check for 0 quality gate failures in 30 days
    failures = Devreport.Webhooks.count_quality_failures(user.id, days: 30)

    if failures == 0 do
      {:ok, :quality_champion}
    else
      :skip
    end
  end

  defp check_productivity_star(user) do
    # Check if user is in top 10% this month
    rank_percentile = Devreport.Gamification.get_user_percentile(user.id)

    if rank_percentile <= 10 do
      {:ok, :productivity_star}
    else
      :skip
    end
  end

  defp check_streak_master(user) do
    streak = Devreport.Reports.get_submission_streak(user.id)

    cond do
      streak >= 90 -> {:ok, :streak_master_gold}
      streak >= 30 -> {:ok, :streak_master_silver}
      streak >= 7 -> {:ok, :streak_master_bronze}
      true -> :skip
    end
  end
end
```

### 8.3 Team Score Aggregation Worker

```elixir
# lib/devreport/workers/team_score_aggregation_worker.ex
defmodule Devreport.Workers.TeamScoreAggregationWorker do
  use Oban.Worker, queue: :default, max_attempts: 3

  alias Devreport.{Repo, Accounts, Points}
  import Ecto.Query

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"team_id" => team_id}}) do
    aggregate_team_score(team_id)
  end

  @impl Oban.Worker
  def perform(%Oban.Job{}) do
    # Run for all teams
    Accounts.list_teams()
    |> Enum.each(&aggregate_team_score/1)

    :ok
  end

  defp aggregate_team_score(team_id) when is_binary(team_id) do
    team = Accounts.get_team!(team_id)
    aggregate_team_score(team)
  end

  defp aggregate_team_score(team) do
    # Calculate average points of active team members
    query = from u in Accounts.User,
      where: u.team_id == ^team.id and u.status == :active,
      select: %{
        avg_points: avg(u.points_balance),
        total_points: sum(u.points_balance),
        member_count: count(u.id)
      }

    stats = Repo.one(query)

    # Update team aggregate
    team
    |> Ecto.Changeset.change(%{
      points_aggregate: round(stats.avg_points || 0)
    })
    |> Repo.update()

    # Award/penalize team lead
    apply_leader_bonus(team, stats)

    :ok
  end

  defp apply_leader_bonus(team, stats) do
    target_avg = 100  # Configurable target
    avg_points = stats.avg_points || 0
    performance_ratio = avg_points / target_avg

    cond do
      performance_ratio >= 0.8 ->
        # Team performing well, award leader 10% bonus
        bonus = round(avg_points * 0.1)
        Points.credit_user(%{
          user_id: team.lead_id,
          points: bonus,
          reason: "Team leadership bonus - team at #{round(performance_ratio * 100)}% of target",
          event_id: nil
        })

      performance_ratio < 0.6 ->
        # Team underperforming, penalize leader 5%
        penalty = round(avg_points * 0.05)
        Points.credit_user(%{
          user_id: team.lead_id,
          points: -penalty,
          reason: "Team leadership penalty - team at #{round(performance_ratio * 100)}% of target",
          event_id: nil
        })

      true ->
        :ok  # Performance within acceptable range
    end
  end
end
```

---

## 9. API Design

### 9.1 REST API Endpoints

**Router Configuration:**

```elixir
# lib/devreport_web/router.ex
defmodule DevreportWeb.Router do
  use DevreportWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {DevreportWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug DevreportWeb.Plugs.RateLimiter
  end

  pipeline :api_auth do
    plug Guardian.Plug.Pipeline,
      module: Devreport.Guardian,
      error_handler: DevreportWeb.AuthErrorHandler
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.EnsureAuthenticated
    plug Guardian.Plug.LoadResource
  end

  # Public routes
  scope "/", DevreportWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Authentication routes
  scope "/auth", DevreportWeb do
    pipe_through :browser

    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
    delete "/logout", AuthController, :delete
  end

  # Protected LiveView routes
  scope "/", DevreportWeb do
    pipe_through [:browser, :require_authenticated_user]

    live_session :authenticated,
      on_mount: [{DevreportWeb.UserAuth, :ensure_authenticated}] do

      live "/dashboard", DashboardLive
      live "/reports", ReportLive.Index
      live "/reports/:id", ReportLive.Show
      live "/leaderboard", LeaderboardLive
      live "/profile", ProfileLive

      # Team lead routes
      live "/team", TeamLive.Dashboard
      live "/team/members/:id", TeamLive.MemberDetail

      # Admin routes
      live "/admin", AdminLive.Dashboard
      live "/admin/users", AdminLive.Users
      live "/admin/webhooks", AdminLive.Webhooks
    end
  end

  # Webhook endpoints
  scope "/webhooks", DevreportWeb do
    pipe_through :api

    post "/gitlab", WebhookController, :gitlab
    post "/openproject", WebhookController, :openproject
    post "/sonarqube", WebhookController, :sonarqube
  end

  # REST API endpoints
  scope "/api", DevreportWeb.API do
    pipe_through [:api, :api_auth]

    # Users
    get "/users/me", UserController, :show_current
    put "/users/me", UserController, :update

    # Points
    get "/points", PointsController, :index
    get "/points/history", PointsController, :history

    # Reports
    resources "/reports", ReportController, only: [:index, :show, :create]

    # Leaderboard
    get "/leaderboard/:scope", LeaderboardController, :show

    # Events
    get "/events", EventController, :index
  end

  # Admin API
  scope "/api/admin", DevreportWeb.API.Admin do
    pipe_through [:api, :api_auth, :require_admin]

    resources "/users", UserController
    post "/users/invite", UserController, :invite
    get "/statistics", StatisticsController, :index
  end
end
```

### 9.2 API Controllers

**Points Controller:**

```elixir
# lib/devreport_web/controllers/api/points_controller.ex
defmodule DevreportWeb.API.PointsController do
  use DevreportWeb, :controller

  alias Devreport.Points

  action_fallback DevreportWeb.FallbackController

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)

    points_data = %{
      current_balance: Points.get_user_balance(user.id),
      weekly_points: Points.get_week_points(user.id, 0),
      monthly_points: Points.get_month_points(user.id, 0),
      rank: Points.get_user_rank(user.id)
    }

    render(conn, :index, points: points_data)
  end

  def history(conn, %{"days" => days}) do
    user = Guardian.Plug.current_resource(conn)
    days = String.to_integer(days)

    history = Points.get_points_history(user.id, days: days)

    render(conn, :history, history: history)
  end
end
```

**Leaderboard Controller:**

```elixir
# lib/devreport_web/controllers/api/leaderboard_controller.ex
defmodule DevreportWeb.API.LeaderboardController do
  use DevreportWeb, :controller

  alias Devreport.Gamification

  action_fallback DevreportWeb.FallbackController

  def show(conn, %{"scope" => scope}) do
    user = Guardian.Plug.current_resource(conn)

    leaderboard = case scope do
      "individual" ->
        Gamification.get_individual_leaderboard(limit: 100)

      "team" ->
        Gamification.get_team_leaderboard(limit: 50)

      "my_team" ->
        Gamification.get_team_leaderboard(user.team_id)

      _ ->
        {:error, :invalid_scope}
    end

    case leaderboard do
      {:error, reason} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: reason})

      data ->
        render(conn, :show, leaderboard: data)
    end
  end
end
```

### 9.3 JSON Views

```elixir
# lib/devreport_web/controllers/api/points_json.ex
defmodule DevreportWeb.API.PointsJSON do
  def index(%{points: points}) do
    %{
      data: %{
        current_balance: points.current_balance,
        weekly_points: points.weekly_points,
        monthly_points: points.monthly_points,
        rank: points.rank
      }
    }
  end

  def history(%{history: history}) do
    %{
      data: Enum.map(history, fn entry ->
        %{
          date: entry.date,
          points_change: entry.points_change,
          balance: entry.balance,
          reason: entry.reason
        }
      end)
    }
  end
end
```

---

## 10. Performance & Deployment

### 10.1 Caching Strategy

**Multi-layer Caching:**

```elixir
# lib/devreport/cache.ex
defmodule Devreport.Cache do
  @moduledoc """
  Multi-layer caching with Nebulex
  """

  use Nebulex.Cache,
    otp_app: :devreport,
    adapter: Nebulex.Adapters.Multilevel

  defmodule L1 do
    use Nebulex.Cache,
      otp_app: :devreport,
      adapter: Nebulex.Adapters.Local
  end

  defmodule L2 do
    use Nebulex.Cache,
      otp_app: :devreport,
      adapter: NebulexRedisAdapter
  end
end

# config/config.exs
config :devreport, Devreport.Cache,
  model: :inclusive,
  levels: [
    {Devreport.Cache.L1, gc_interval: :timer.hours(12), max_size: 100_000},
    {Devreport.Cache.L2, []},
  ]

config :devreport, Devreport.Cache.L2,
  conn_opts: [
    host: System.get_env("REDIS_HOST", "localhost"),
    port: String.to_integer(System.get_env("REDIS_PORT", "6379"))
  ]
```

**Cache Usage:**

```elixir
# lib/devreport/gamification.ex
defmodule Devreport.Gamification do
  alias Devreport.Cache

  def get_individual_leaderboard(opts \\ []) do
    limit = Keyword.get(opts, :limit, 100)
    cache_key = "leaderboard:individual:#{limit}"

    Cache.get(cache_key) || fetch_and_cache_leaderboard(cache_key, limit)
  end

  defp fetch_and_cache_leaderboard(cache_key, limit) do
    leaderboard = query_leaderboard(limit)

    # Cache for 5 minutes
    Cache.put(cache_key, leaderboard, ttl: :timer.minutes(5))

    leaderboard
  end

  def invalidate_leaderboard_cache do
    Cache.delete_all("leaderboard:*")
  end
end
```

### 10.2 Database Connection Pooling

```elixir
# config/config.exs
config :devreport, Devreport.Repo,
  pool_size: String.to_integer(System.get_env("POOL_SIZE", "10")),
  queue_target: 5000,
  queue_interval: 1000

# config/prod.exs
config :devreport, Devreport.Repo,
  pool_size: 20,
  queue_target: 5000,
  queue_interval: 1000,
  timeout: 60_000,
  connect_timeout: 15_000
```

### 10.3 Docker Deployment

**Dockerfile:**

```dockerfile
# Build stage
FROM hexpm/elixir:1.16.0-erlang-26.2.1-alpine-3.19.0 AS build

# Install build dependencies
RUN apk add --no-cache build-base git nodejs npm

WORKDIR /app

# Install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Set build ENV
ENV MIX_ENV=prod

# Install mix dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV

# Build assets
COPY assets/package.json assets/package-lock.json ./assets/
RUN npm --prefix ./assets ci --progress=false --no-audit --loglevel=error

COPY priv priv
COPY assets assets
RUN npm run --prefix ./assets deploy
RUN mix phx.digest

# Compile application
COPY config config
COPY lib lib
RUN mix compile

# Build release
COPY rel rel
RUN mix release

# Runtime stage
FROM alpine:3.19.0 AS app

RUN apk add --no-cache libstdc++ openssl ncurses-libs

WORKDIR /app

# Copy release from build stage
COPY --from=build /app/_build/prod/rel/devreport ./

RUN chown -R nobody:nobody /app
USER nobody:nobody

ENV HOME=/app
ENV MIX_ENV=prod

# Database setup
RUN mix ecto.setup

EXPOSE 4000

CMD ["bin/devreport", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=ecto://postgres:postgres@db:5432/devreport_prod
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - SECRET_KEY_BASE=${SECRET_KEY_BASE}
      - AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
      - AZURE_CLIENT_SECRET=${AZURE_CLIENT_SECRET}
      - AZURE_TENANT_ID=${AZURE_TENANT_ID}
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=devreport_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=admin
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
```

### 10.4 Environment Configuration

**Runtime Configuration:**

```elixir
# config/runtime.exs
import Config

if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      """

  config :devreport, Devreport.Repo,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
    ssl: true,
    ssl_opts: [
      verify: :verify_peer,
      cacertfile: System.get_env("DATABASE_CA_CERT")
    ]

  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      """

  config :devreport, DevreportWeb.Endpoint,
    http: [
      ip: {0, 0, 0, 0},
      port: String.to_integer(System.get_env("PORT") || "4000")
    ],
    secret_key_base: secret_key_base,
    url: [host: System.get_env("PHX_HOST"), port: 443, scheme: "https"],
    check_origin: [System.get_env("PHX_HOST")]

  # Azure AD configuration
  config :ueberauth, Ueberauth.Strategy.Microsoft.OAuth,
    client_id: System.fetch_env!("AZURE_CLIENT_ID"),
    client_secret: System.fetch_env!("AZURE_CLIENT_SECRET")

  # Email configuration
  config :devreport, Devreport.Mailer,
    adapter: Swoosh.Adapters.SMTP,
    relay: System.fetch_env!("SMTP_RELAY"),
    username: System.fetch_env!("SMTP_USERNAME"),
    password: System.fetch_env!("SMTP_PASSWORD")
end
```

---

## 11. Testing Strategy

### 11.1 Test Structure

```elixir
# test/support/fixtures/accounts_fixtures.ex
defmodule Devreport.AccountsFixtures do
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "user#{System.unique_integer()}@example.com",
        name: "Test User",
        role: :developer,
        status: :active
      })
      |> Devreport.Accounts.create_user()

    user
  end

  def team_fixture(attrs \\ %{}) do
    {:ok, team} =
      attrs
      |> Enum.into(%{
        name: "Team #{System.unique_integer()}"
      })
      |> Devreport.Accounts.create_team()

    team
  end
end

# test/devreport/points_test.exs
defmodule Devreport.PointsTest do
  use Devreport.DataCase

  alias Devreport.Points
  import Devreport.AccountsFixtures

  describe "credit_user/1" do
    test "credits points to user and updates balance" do
      user = user_fixture()

      assert {:ok, entry} = Points.credit_user(%{
        user_id: user.id,
        points: 10,
        reason: "Test credit",
        event_id: nil
      })

      assert entry.points_change == 10
      assert Points.get_user_balance(user.id) == 10
    end

    test "maintains accurate running balance" do
      user = user_fixture()

      Points.credit_user(%{user_id: user.id, points: 10, reason: "First"})
      Points.credit_user(%{user_id: user.id, points: 5, reason: "Second"})
      Points.credit_user(%{user_id: user.id, points: -3, reason: "Penalty"})

      assert Points.get_user_balance(user.id) == 12
    end
  end
end

# test/devreport_web/live/dashboard_live_test.exs
defmodule DevreportWeb.DashboardLiveTest do
  use DevreportWeb.ConnCase

  import Phoenix.LiveViewTest
  import Devreport.AccountsFixtures

  setup do
    user = user_fixture()
    %{user: user, conn: log_in_user(build_conn(), user)}
  end

  test "displays user dashboard", %{conn: conn, user: user} do
    {:ok, view, html} = live(conn, ~p"/dashboard")

    assert html =~ "Your Points"
    assert html =~ user.name
  end

  test "updates points in real-time", %{conn: conn, user: user} do
    {:ok, view, _html} = live(conn, ~p"/dashboard")

    # Simulate webhook event
    event = %{user_id: user.id, points: 10, event_type: "commit"}
    Phoenix.PubSub.broadcast(
      Devreport.PubSub,
      "user:#{user.id}",
      {:new_event, event}
    )

    assert render(view) =~ "+10 points"
  end
end
```

---

## 12. Security Considerations

### 12.1 Security Measures

**Rate Limiting Plug:**

```elixir
# lib/devreport_web/plugs/rate_limiter.ex
defmodule DevreportWeb.Plugs.RateLimiter do
  import Plug.Conn

  @max_requests 100
  @window_ms 60_000

  def init(opts), do: opts

  def call(conn, _opts) do
    key = get_rate_limit_key(conn)

    case check_rate_limit(key) do
      {:ok, _count} ->
        conn

      {:error, :rate_limit_exceeded} ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(429, Jason.encode!(%{error: "Rate limit exceeded"}))
        |> halt()
    end
  end

  defp get_rate_limit_key(conn) do
    case Guardian.Plug.current_resource(conn) do
      %{id: user_id} -> "rate_limit:user:#{user_id}"
      _ -> "rate_limit:ip:#{get_ip(conn)}"
    end
  end

  defp check_rate_limit(key) do
    # Using Redis with Hammer
    Hammer.check_rate(key, @window_ms, @max_requests)
  end

  defp get_ip(conn) do
    conn.remote_ip |> Tuple.to_list() |> Enum.join(".")
  end
end
```

### 12.2 Input Validation

```elixir
# lib/devreport/webhooks/validator.ex
defmodule Devreport.Webhooks.Validator do
  def verify_gitlab_signature(conn, payload) do
    signature = get_req_header(conn, "x-gitlab-token") |> List.first()
    expected = System.get_env("GITLAB_WEBHOOK_SECRET")

    if Plug.Crypto.secure_compare(signature, expected) do
      :ok
    else
      {:error, :invalid_signature}
    end
  end

  def verify_sonarqube_signature(conn, payload) do
    signature = get_req_header(conn, "x-sonar-webhook-hmac-sha256") |> List.first()
    secret = System.get_env("SONARQUBE_WEBHOOK_SECRET")

    expected = :crypto.mac(:hmac, :sha256, secret, payload) |> Base.encode16(case: :lower)

    if Plug.Crypto.secure_compare(signature, expected) do
      :ok
    else
      {:error, :invalid_signature}
    end
  end
end
```

---

## 13. Monitoring & Observability

### 13.1 Telemetry Configuration

```elixir
# lib/devreport/telemetry.ex
defmodule Devreport.Telemetry do
  use Supervisor
  import Telemetry.Metrics

  def start_link(arg) do
    Supervisor.start_link(__MODULE__, arg, name: __MODULE__)
  end

  def init(_arg) do
    children = [
      {:telemetry_poller, measurements: periodic_measurements(), period: 10_000},
      {TelemetryMetricsPrometheus, metrics: metrics()}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end

  defp metrics do
    [
      # Phoenix metrics
      summary("phoenix.endpoint.stop.duration",
        unit: {:native, :millisecond}
      ),
      summary("phoenix.router_dispatch.stop.duration",
        tags: [:route],
        unit: {:native, :millisecond}
      ),

      # Database metrics
      summary("devreport.repo.query.total_time",
        unit: {:native, :millisecond},
        description: "Total time for queries"
      ),

      # Custom metrics
      counter("devreport.webhooks.events.count",
        tags: [:service, :event_type]
      ),
      summary("devreport.points.calculation.duration",
        unit: {:native, :millisecond}
      ),
      last_value("devreport.reports.submitted.count",
        tags: [:date]
      )
    ]
  end

  defp periodic_measurements do
    [
      {Devreport.Metrics, :measure_active_users, []},
      {Devreport.Metrics, :measure_pending_events, []}
    ]
  end
end
```

---

## 14. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Phoenix application setup
- [ ] Database schema and migrations
- [ ] Azure AD authentication
- [ ] Basic user management
- [ ] LiveView dashboard skeleton

### Phase 2: Webhook System (Weeks 3-4)
- [ ] Webhook endpoint controllers
- [ ] Broadway event processing pipeline
- [ ] Points calculation engine
- [ ] Event storage and validation

### Phase 3: Core Features (Weeks 5-6)
- [ ] Daily report submission
- [ ] Oban workers for reminders
- [ ] Real-time dashboard updates
- [ ] Points ledger management

### Phase 4: Gamification (Week 7)
- [ ] Leaderboard implementation
- [ ] Achievement system
- [ ] Badge tracking
- [ ] Team score aggregation

### Phase 5: Polish & Deploy (Week 8)
- [ ] Email notifications
- [ ] Performance optimization
- [ ] Security audit
- [ ] Docker deployment
- [ ] Production launch

---

**End of Technical Specification**

*Phoenix Framework Version: 1.7+*
*Elixir Version: 1.16+*
*PostgreSQL Version: 14+*
