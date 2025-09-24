// Online Training Companion - TypeScript Type Definitions
// This file contains all the TypeScript interfaces and types used in the application

// ===========================
// User and Authentication Types
// ===========================

export interface User {
  id: string;
  role: 'participant' | 'trainer' | 'admin';
  name: string;
  email: string;
  avatar_url?: string;
  certificate_url?: string;
  created_at: string;
  last_active: string;
}

export interface TrainerProfile extends User {
  role: 'trainer';
  bio?: string;
  expertise: string[];
  rating: number;
  sessions_conducted: number;
}

// ===========================
// Training Session Types
// ===========================

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  trainer_id: string;
  trainer?: TrainerProfile;
  agenda: AgendaItem[];
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  mode: SessionMode;
  status: SessionStatus;
  max_participants: number;
  current_participants: number;
  materials: SessionMaterial[];
  settings: SessionSettings;
  created_at: string;
  updated_at: string;
}

export type SessionMode = 'pre-training' | 'in-training' | 'post-training';
export type SessionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  start_time: string; // Relative to session start, e.g., "00:15"
  end_time: string;
  completed: boolean;
  order: number;
}

export interface SessionMaterial {
  id: string;
  title: string;
  description?: string;
  type: MaterialType;
  url: string;
  file_size?: number;
  download_count: number;
  created_at: string;
}

export type MaterialType = 'pdf' | 'code' | 'link' | 'video' | 'image';

export interface SessionSettings {
  allow_questions: boolean;
  require_login: boolean;
  auto_record: boolean;
  enable_chat: boolean;
  max_questions_per_user: number;
  question_moderation: boolean;
  feedback_enabled: boolean;
  certificate_template?: string;
}

// ===========================
// Slide and Content Types
// ===========================

export interface Slide {
  id: string;
  session_id: string;
  slide_number: number;
  title: string;
  content?: string;
  asset_url?: string;
  notes: SlideNote[];
  code_examples: CodeExample[];
  duration_seconds?: number;
  created_at: string;
  updated_at: string;
}

export interface SlideNote {
  id: string;
  user_id: string;
  slide_id: string;
  content: string;
  private: boolean;
  created_at: string;
  updated_at: string;
}

export interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
  downloadable: boolean;
}

// ===========================
// Q&A System Types
// ===========================

export interface Question {
  id: string;
  session_id: string;
  slide_id?: string;
  text: string;
  created_at: string;
  created_by_user_id: string;
  anonymized_handle: string;
  upvote_count: number;
  upvoted: boolean; // Current user's upvote status
  status: QuestionStatus;
  answered_by?: string;
  answered_at?: string;
  visibility: QuestionVisibility;
  pinned: boolean;
  moderation_flag?: ModerationFlag;
  metadata: Record<string, any>;
  deleted: boolean;
}

export type QuestionStatus = 'unanswered' | 'in_discussion' | 'answered' | 'dismissed';
export type QuestionVisibility = 'public' | 'private';
export type ModerationFlag = 'spam' | 'inappropriate' | 'off-topic' | 'duplicate';

export interface QuestionUpvote {
  id: string;
  question_id: string;
  user_id: string;
  created_at: string;
}

export interface QASystemState {
  questions: Question[];
  currentSort: 'upvotes' | 'newest';
  isLoading: boolean;
  error?: string;
}

// ===========================
// Feedback and Analytics Types
// ===========================

export interface Expectation {
  id: string;
  user_id: string;
  session_id: string;
  text: string;
  timestamp: string;
  fulfilled?: boolean; // Set post-session
}

export interface FeedbackResponse {
  id: string;
  user_id: string;
  session_id: string;
  rating: number; // 1-5 stars
  comment?: string;
  feedback_type: 'session' | 'slide' | 'trainer';
  target_id?: string; // slide_id or trainer_id
  timestamp: string;
  helpful_count: number;
}

export interface SessionFeedback {
  session_id: string;
  total_responses: number;
  average_rating: number;
  rating_distribution: Record<number, number>;
  common_themes: string[];
  improvement_suggestions: string[];
}

export interface RealtimeFeedback {
  like: number;
  dislike: number;
  rocket: number;
  slide_id: string;
  timestamp: string;
}

// ===========================
// Certificate Types
// ===========================

export interface Certificate {
  id: string;
  user_id: string;
  session_id: string;
  pdf_url: string;
  issued_date: string;
  template_used: string;
  verification_code: string;
  metadata: CertificateMetadata;
}

export interface CertificateMetadata {
  participant_name: string;
  session_title: string;
  trainer_name: string;
  completion_date: string;
  session_duration: string;
  organization?: string;
  logo_url?: string;
}

// ===========================
// UI Component Types
// ===========================

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  dismissible: boolean;
  created_at: number;
}

export interface ModalState {
  isOpen: boolean;
  type?: 'confirmation' | 'info' | 'form';
  title?: string;
  content?: string;
  actions?: ModalAction[];
}

export interface ModalAction {
  label: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  action: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

// ===========================
// Theme and Styling Types
// ===========================

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontFamily: 'system' | 'custom';
  compactMode: boolean;
  reducedMotion: boolean;
}

export interface ResponsiveBreakpoint {
  mobile: number;    // 320px
  tablet: number;    // 768px
  desktop: number;   // 1280px
  wide: number;      // 1440px
}

// ===========================
// API Response Types
// ===========================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string; // Only in development
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_more: boolean;
}

// ===========================
// Real-time Events Types
// ===========================

export interface WebSocketEvent {
  type: EventType;
  data: any;
  timestamp: string;
  session_id: string;
  user_id?: string;
}

export type EventType =
  | 'question.created'
  | 'question.upvoted'
  | 'question.updated'
  | 'question.deleted'
  | 'slide.changed'
  | 'session.started'
  | 'session.ended'
  | 'user.joined'
  | 'user.left'
  | 'feedback.submitted'
  | 'system.announcement';

// ===========================
// Form Validation Types
// ===========================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{label: string; value: any}>;
  validation?: ValidationRule;
  disabled?: boolean;
  required?: boolean;
}

export interface FormErrors {
  [fieldName: string]: string;
}

// ===========================
// Accessibility Types
// ===========================

export interface AccessibilityConfig {
  announceRegion: HTMLElement | null;
  focusTrap: boolean;
  keyboardNavigation: boolean;
  screenReaderOptimizations: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface ARIAAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}

// ===========================
// Analytics and Metrics Types
// ===========================

export interface SessionMetrics {
  session_id: string;
  total_participants: number;
  peak_concurrent: number;
  average_session_rating: number;
  questions_submitted: number;
  questions_answered: number;
  engagement_rate: number;
  completion_rate: number;
  certificate_downloads: number;
  materials_downloaded: number;
  feedback_responses: number;
}

export interface UserEngagement {
  user_id: string;
  session_id: string;
  joined_at: string;
  left_at?: string;
  duration_seconds: number;
  questions_asked: number;
  questions_upvoted: number;
  slides_bookmarked: number;
  notes_taken: number;
  feedback_given: boolean;
  certificate_downloaded: boolean;
}

// ===========================
// Utility Types
// ===========================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ===========================
// Component Props Types
// ===========================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'outlined';
}

export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
}

export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  showValue?: boolean;
}

// ===========================
// Hook Return Types
// ===========================

export interface UseSessionReturn {
  session: TrainingSession | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseQAReturn {
  questions: Question[];
  loading: boolean;
  error: string | null;
  submitQuestion: (text: string) => Promise<void>;
  upvoteQuestion: (questionId: string) => Promise<void>;
  sortQuestions: (sort: 'upvotes' | 'newest') => void;
}

export interface UseThemeReturn {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  systemTheme: 'light' | 'dark';
}

// ===========================
// Configuration Types
// ===========================

export interface AppConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  maxFileSize: number;
  supportedFileTypes: string[];
  features: FeatureFlags;
  analytics: AnalyticsConfig;
  theme: ThemeConfig;
}

export interface FeatureFlags {
  qaSystem: boolean;
  realTimeSync: boolean;
  certificates: boolean;
  analytics: boolean;
  fileUpload: boolean;
  videoStreaming: boolean;
  breakoutRooms: boolean;
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  customEvents: boolean;
  userConsent: boolean;
}