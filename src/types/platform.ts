/**
 * ARES EDU PLATFORM (AEP) — Platform Experience Types
 *
 * Domain-agnostic types for the reusable Learning Operating System.
 * No subject-specific types. Supports any educational domain.
 */

// ============================================================
// Domain & Content Architecture
// ============================================================

export type EducationDomain =
  | "cloud-engineering"
  | "cybersecurity"
  | "software-engineering"
  | "ai-engineering"
  | "data-engineering"
  | "platform-engineering"
  | "networking"
  | "linux"
  | "python"
  | "web-development"
  | "mobile-development"
  | "game-development"
  | "electronics"
  | "embedded-systems"
  | "robotics"
  | "digital-marketing"
  | "business"
  | "languages"
  | "mathematics"
  | "science"
  | string; // extensible

export type ContentCategory =
  | "book"
  | "course"
  | "learning-path"
  | "bootcamp"
  | "documentation"
  | "reference-library"
  | "interactive-lab"
  | "certification"
  | "career-track"
  | "knowledge-base"
  | "university"
  | "training-program"
  | "professional-academy"
  | "project"
  | "lab";

export type ContentStatus = "draft" | "review" | "published" | "deprecated" | "archived";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert" | "master";

// ============================================================
// User & Profile
// ============================================================

export interface UserProfile {
  id: string;
  displayName: string;
  avatar?: string;
  joinedAt: string;
  preferences: UserPreferences;
  learningGoals: LearningGoal[];
  enrolledContent: string[];
}

export interface LearningGoal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  completed: boolean;
  category: "certification" | "skill" | "project" | "career" | "custom";
}

export interface UserPreferences {
  // content IDs
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  fontSize: "small" | "medium" | "large" | "x-large";
  readingWidth: "narrow" | "medium" | "wide" | "full";
  reduceMotion: boolean;
  reduceAnimations: boolean;
  highContrast: boolean;
  dyslexiaFriendlyFont: boolean;
  learningMode: "self-paced" | "structured" | "bootcamp";
  aiPreferences: AIPreferences;
  notificationPreferences: NotificationPreferences;
}

// ============================================================
// Platform Configuration (Multi-Domain, Multi-Content)
// ============================================================

export interface PlatformConfig {
  name: string;
  version: string;
  domains: EducationDomain[];
  supportedCategories: ContentCategory[];
  features: PlatformFeature[];
  extensions: PlatformExtension[];
  customModules: CustomModule[];
}

export interface PlatformFeature {
  id: string;
  name: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface PlatformExtension {
  id: string;
  name: string;
  type: "plugin" | "module" | "integration" | "theme";
  version: string;
  enabled: boolean;
  entryPoint?: string;
}

export interface CustomModule {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
}

// ============================================================
// Content Management (Multi-Book, Multi-Author, Multi-Org)
// ============================================================

export interface ContentProvider {
  id: string;
  name: string;
  type: "author" | "instructor" | "organization" | "academy" | "university";
  description?: string;
  logo?: string;
  website?: string;
  contentIds: string[];
  rating?: number;
  learnerCount?: number;
}

export interface BookMetadata {
  id: string;
  title: string;
  subtitle?: string;
  authors: ContentProvider[];
  publisher?: ContentProvider;
  edition?: string;
  isbn?: string;
  coverImage?: string;
  domain: EducationDomain;
  categories: ContentCategory[];
  difficulty: Difficulty;
  estimatedHours: number;
  chapters: number;
  publishedAt?: string;
  updatedAt?: string;
  version: string;
  language: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  status: ContentStatus;
}

export interface CourseMetadata {
  id: string;
  title: string;
  subtitle?: string;
  instructors: ContentProvider[];
  organization?: ContentProvider;
  domain: EducationDomain;
  categories: ContentCategory[];
  difficulty: Difficulty;
  estimatedHours: number;
  modules: number;
  lessons: number;
  projects: number;
  certification?: string;
  prerequisites: string[];
  publishedAt?: string;
  updatedAt?: string;
  language: string;
  tags: string[];
  rating?: number;
  learnerCount?: number;
  status: ContentStatus;
}

// ============================================================
// Navigation
// ============================================================

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  badge?: string;
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

export interface RecentlyVisitedItem {
  href: string;
  title: string;
  contentType: ContentCategory;
  visitedAt: string;
  domain: EducationDomain;
}

export interface BookmarkItem {
  id: string;
  href: string;
  title: string;
  contentType: ContentCategory;
  bookmarkedAt: string;
  domain: EducationDomain;
  tags: string[];
  notes?: string;
}

export interface FavoriteItem {
  id: string;
  href: string;
  title: string;
  contentType: ContentCategory;
  favoritedAt: string;
}

export interface PinnedItem {
  id: string;
  href: string;
  title: string;
  contentType: ContentCategory;
  pinnedAt: string;
}

// ============================================================
// Dashboard
// ============================================================

export interface DashboardData {
  continueLearning: ContinueLearningItem[];
  recentActivity: ActivityItem[];
  achievements: Achievement[];
  progress: LearningProgress;
  bookmarks: BookmarkItem[];
  recommendations: RecommendationItem[];
  dailyGoal: GoalProgress;
  weeklyGoal: GoalProgress;
  streak: StreakData;
  upcomingReviews: ReviewItem[];
  recentProjects: ProjectProgress[];
  certificationProgress: CertificationProgressItem[];
  careerProgress: CareerProgressItem[];
}

export interface ContinueLearningItem {
  contentId: string;
  title: string;
  contentType: ContentCategory;
  domain: EducationDomain;
  progressPercent: number;
  lastAccessedAt: string;
  estimatedRemainingMinutes: number;
}

export interface ActivityItem {
  id: string;
  type:
    | "lesson_completed"
    | "project_completed"
    | "lab_completed"
    | "achievement_earned"
    | "course_enrolled"
    | "bookmark_added"
    | "note_created";
  title: string;
  description?: string;
  timestamp: string;
}

export interface RecommendationItem {
  contentId: string;
  title: string;
  contentType: ContentCategory;
  domain: EducationDomain;
  reason: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  matchPercent: number;
}

// ============================================================
// Progress & Analytics
// ============================================================

export interface LearningProgress {
  totalLessonsCompleted: number;
  totalProjectsCompleted: number;
  totalLabsCompleted: number;
  totalTimeSpentMinutes: number;
  completionRate: number;
  averageScore: number;
  currentLevel: number;
  totalXP: number;
}

export interface GoalProgress {
  target: number;
  current: number;
  unit: "lessons" | "minutes" | "projects" | "labs";
  period: "day" | "week" | "month";
  completed: boolean;
}

export interface StreakData {
  current: number;
  longest: number;
  thisWeek: number[];
  lastActiveDate: string;
  atRisk: boolean;
}

export interface ReviewItem {
  contentId: string;
  title: string;
  domain: EducationDomain;
  dueInDays: number;
  priority: "low" | "normal" | "high" | "critical";
  retentionEstimate: number;
}

export interface ProjectProgress {
  projectId: string;
  title: string;
  status: "not_started" | "in_progress" | "completed" | "submitted";
  progressPercent: number;
  dueDate?: string;
}

export interface CertificationProgressItem {
  code: string;
  name: string;
  provider: string;
  progressPercent: number;
  estimatedReadyDate?: string;
}

export interface CareerProgressItem {
  role: string;
  level: string;
  progressPercent: number;
  skillsAcquired: number;
  skillsRequired: number;
  readinessScore: number;
}

// ============================================================
// XP & Gamification
// ============================================================

export interface XPSystem {
  totalXP: number;
  currentLevel: number;
  levelTitle: string;
  xpToNextLevel: number;
  xpForCurrentLevel: number;
  achievements: Achievement[];
  badges: Badge[];
  milestones: Milestone[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  xpReward: number;
  category: "learning" | "streak" | "mastery" | "community" | "challenge" | "milestone";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  earned: boolean;
  progress?: { current: number; target: number };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  category: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  earned: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  completedAt?: string;
  reward: { xp: number; badge?: string };
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  type: "complete_lesson" | "complete_lab" | "review_content" | "maintain_streak" | "custom";
}

export interface WeeklyMission {
  id: string;
  title: string;
  xpReward: number;
  current: number;
  target: number;
  completed: boolean;
}

// ============================================================
// Search
// ============================================================

export interface SearchResult {
  id: string;
  title: string;
  href: string;
  contentType: ContentCategory;
  domain: EducationDomain;
  excerpt: string;
  relevance: number;
  tags: string[];
  difficulty?: Difficulty;
  estimatedMinutes?: number;
  matchedField: "title" | "description" | "content" | "tags" | "metadata" | "skills";
}

export interface SearchFilters {
  query: string;
  domains?: EducationDomain[];
  contentTypes?: ContentCategory[];
  difficulties?: Difficulty[];
  tags?: string[];
  skills?: string[];
  technologies?: string[];
  certification?: string;
}

// ============================================================
// AI Experience
// ============================================================

export interface AIPreferences {
  enabled: boolean;
  autoSuggest: boolean;
  difficultyAdaptation: boolean;
  model: string;
  maxTokens: number;
}

export interface AITutorMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface AITutorSession {
  id: string;
  context: { contentId?: string; topic?: string; domain?: EducationDomain };
  messages: AITutorMessage[];
  startedAt: string;
}

export interface NotificationPreferences {
  reviewReminders: boolean;
  streakAlerts: boolean;
  achievementAlerts: boolean;
  recommendationAlerts: boolean;
  dailyGoalReminders: boolean;
  weeklyReport: boolean;
  emailDigest: boolean;
  pushNotifications: boolean;
}

// ============================================================
// Learning Experience Modes
// ============================================================

export type LearningMode = "focus" | "reading" | "study" | "distraction-free" | "print" | "mobile";

export interface LearningModeConfig {
  mode: LearningMode;
  hideNavbar: boolean;
  hideSidebar: boolean;
  hideFooter: boolean;
  fontSize: string;
  readingWidth: string;
  lineHeight: string;
  showProgress: boolean;
  showTimer: boolean;
  showNotes: boolean;
}

// ============================================================
// Productivity
// ============================================================

export interface UserNote {
  id: string;
  contentId: string;
  text: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
  tags: string[];
}

export interface UserHighlight {
  id: string;
  contentId: string;
  text: string;
  startOffset: number;
  endOffset: number;
  color: "yellow" | "green" | "blue" | "pink" | "orange";
  createdAt: string;
  note?: string;
}

export interface ReadingHistoryItem {
  contentId: string;
  title: string;
  contentType: ContentCategory;
  domain: EducationDomain;
  progressPercent: number;
  lastReadAt: string;
}

// ============================================================
// Settings
// ============================================================

export interface PlatformSettings {
  profile: UserProfile;
  theme: "light" | "dark" | "system";
  language: string;
  fontSize: "small" | "medium" | "large" | "x-large";
  readingWidth: "narrow" | "medium" | "wide" | "full";
  reduceMotion: boolean;
  highContrast: boolean;
  dyslexiaFriendlyFont: boolean;
  learningPreferences: {
    mode: "self-paced" | "structured" | "bootcamp";
    dailyGoalMinutes: number;
    weeklyGoalLessons: number;
    preferredDifficulty: Difficulty;
  };
  aiPreferences: AIPreferences;
  notificationPreferences: NotificationPreferences;
  accessibilityPreferences: {
    screenReaderOptimized: boolean;
    keyboardNavigationEnhanced: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
  };
}
