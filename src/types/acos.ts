/**
 * ARES Content Operating System (ACOS) — TypeScript Type Definitions
 * Phase 4: Complete type system for the ARES Content Operating System.
 * Domain-agnostic — supports any educational subject.
 */

// =============================================================================
// ALP — ARES Learning Package
// =============================================================================

export interface ALPManifest {
  schema_version: string;
  alp: ALPMetadata;
  dependencies?: ALPDependency[];
  modules: ALPModule[];
  extensions?: ALPExtension[];
}

export interface ALPMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  domain: ALPDomain;
  type: ALPType;
  authors: AuthorRef[];
  organization?: OrganizationRef;
  license: ContentLicense;
  languages: LanguageCode[];
  keywords: string[];
  icon?: string;
  website?: string;
  repository?: string;
  created_at: string;
  updated_at: string;
  status: ContentStatus;
  min_platform_version: string;
}

export type ALPType =
  | "book"
  | "course"
  | "learning_path"
  | "academy"
  | "bootcamp"
  | "reference_library"
  | "knowledge_base"
  | "certification_track"
  | "documentation"
  | "micro_course"
  | "learning_collection";

export type ALPDomain =
  | "cloud_engineering"
  | "cybersecurity"
  | "software_engineering"
  | "ai_engineering"
  | "data_engineering"
  | "platform_engineering"
  | "networking"
  | "linux"
  | "python"
  | "web_development"
  | "mobile_development"
  | "game_development"
  | "electronics"
  | "embedded_systems"
  | "robotics"
  | "digital_marketing"
  | "business"
  | "languages"
  | "mathematics"
  | "science"
  | "custom";

export type LanguageCode =
  | "ar" | "en" | "fi" | "ku" | "es" | "fr" | "de" | "zh"
  | "ja" | "ko" | "pt" | "ru" | "hi" | "tr" | "it";

export interface ALPDependency {
  alp_id: string;
  version: string;
  required: boolean;
}

export interface ALPModule {
  id: string;
  name: string;
  type: ALPModuleType;
  entries: string[];
  config?: Record<string, unknown>;
}

export type ALPModuleType =
  | "content"
  | "questions"
  | "assessments"
  | "labs"
  | "simulators"
  | "media"
  | "translations"
  | "knowledge_graph"
  | "career"
  | "certification";

export interface ALPExtension {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
}

export interface AuthorRef {
  id: string;
  name: string;
  role: AuthorRole;
  email?: string;
  url?: string;
}

export type AuthorRole =
  | "author"
  | "co_author"
  | "editor"
  | "reviewer"
  | "contributor"
  | "translator"
  | "maintainer"
  | "curator";

export interface OrganizationRef {
  id: string;
  name: string;
  type: OrganizationType;
  url?: string;
}

export type OrganizationType =
  | "academy"
  | "publisher"
  | "company"
  | "community"
  | "certification_body";

export type ContentLicense =
  | "CC BY 4.0"
  | "CC BY-SA 4.0"
  | "CC BY-NC 4.0"
  | "CC BY-NC-SA 4.0"
  | "CC0"
  | "MIT"
  | "Apache 2.0"
  | "Proprietary"
  | "All Rights Reserved"
  | "Custom";

export type ContentStatus =
  | "draft"
  | "review"
  | "published"
  | "archived"
  | "deprecated";

// =============================================================================
// Book Engine
// =============================================================================

export interface BookStructure {
  book: BookMetadata;
  volumes?: Volume[];
  parts?: Part[];
  chapters?: Chapter[];
  appendices?: Appendix[];
  glossary?: GlossaryEntry[];
  references?: Reference[];
  index?: IndexEntry[];
}

export interface BookMetadata {
  id: string;
  title: string;
  subtitle?: string;
  edition?: string;
  isbn?: string;
  authors: AuthorRef[];
  publisher?: OrganizationRef;
  language: LanguageCode;
  description: string;
  cover_image?: string;
  topics: string[];
  difficulty: DifficultyLevel;
  estimated_hours: number;
  version: string;
  version_history?: VersionRecord[];
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  license: ContentLicense;
  translations?: TranslationRef[];
}

export interface Volume {
  id: string;
  number: number;
  title: string;
  description?: string;
  parts: string[];
}

export interface Part {
  id: string;
  number: number;
  title: string;
  description?: string;
  volume_id?: string;
  chapters: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description?: string;
  part_id?: string;
  sections: Section[];
  learning_objectives: string[];
  estimated_time: number;
  difficulty: DifficultyLevel;
}

export interface Section {
  id: string;
  title: string;
  lessons: string[];
  order: number;
}

export interface Appendix {
  id: string;
  title: string;
  label: string;
  content: string;
  order: number;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  related_terms?: string[];
  domain?: string;
  acronym?: string;
  pronunciation?: string;
}

export interface Reference {
  id: string;
  title: string;
  authors: string;
  url?: string;
  type: ReferenceType;
  year?: number;
  publisher?: string;
}

export type ReferenceType =
  | "book"
  | "article"
  | "website"
  | "documentation"
  | "whitepaper"
  | "rfc"
  | "video"
  | "course";

export interface IndexEntry {
  term: string;
  references: string[];
  sub_entries?: IndexEntry[];
}

export interface VersionRecord {
  version: string;
  date: string;
  author: string;
  changes: string[];
}

export interface TranslationRef {
  language: LanguageCode;
  translator: string;
  status: ContentStatus;
  url?: string;
}

export type DifficultyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

// =============================================================================
// Course Engine
// =============================================================================

export interface CourseStructure {
  course: CourseMetadata;
  modules: CourseModule[];
  prerequisites?: string[];
  certificate?: CertificateTemplate;
}

export interface CourseMetadata {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  authors: AuthorRef[];
  organization?: OrganizationRef;
  language: LanguageCode;
  topics: string[];
  difficulty: DifficultyLevel;
  estimated_hours: number;
  learning_outcomes: string[];
  skills_acquired: string[];
  prerequisites?: string[];
  modules_count: number;
  projects_count: number;
  labs_count: number;
  has_certificate: boolean;
  status: ContentStatus;
  version: string;
  created_at: string;
  updated_at: string;
  license: ContentLicense;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  units: CourseUnit[];
  assessment?: AssessmentRef;
}

export interface CourseUnit {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: string[];
  quiz?: string;
  lab?: string;
  estimated_time: number;
}

export interface AssessmentRef {
  type: AssessmentType;
  id: string;
  weight: number;
  required: boolean;
}

export type AssessmentType =
  | "quiz"
  | "assignment"
  | "project"
  | "lab"
  | "exam"
  | "final_exam";

export interface CertificateTemplate {
  id: string;
  name: string;
  template: string;
  requirements: {
    min_score: number;
    complete_all_modules: boolean;
    pass_final_exam: boolean;
  };
}

// =============================================================================
// Content Management
// =============================================================================

export interface ContentVersion {
  id: string;
  content_id: string;
  version: string;
  author: AuthorRef;
  changes: string;
  diff?: string;
  created_at: string;
  status: ContentStatus;
}

export interface ContentRevision {
  id: string;
  content_id: string;
  version: string;
  previous_version: string;
  author: AuthorRef;
  reviewer?: AuthorRef;
  changes: string[];
  review_notes?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  resolved_at?: string;
}

export interface ContentAuditLog {
  id: string;
  content_id: string;
  action: string;
  actor: AuthorRef;
  previous_state?: Record<string, unknown>;
  new_state?: Record<string, unknown>;
  timestamp: string;
  ip_address?: string;
}

// =============================================================================
// Localization Engine
// =============================================================================

export interface LocalizationConfig {
  source_language: LanguageCode;
  target_languages: LanguageCode[];
  fallback_language: LanguageCode;
  rtl_languages: LanguageCode[];
  translation_memory: boolean;
  machine_translation: boolean;
  human_review_required: boolean;
}

export interface TranslationEntry {
  id: string;
  content_id: string;
  source_language: LanguageCode;
  target_language: LanguageCode;
  translator: AuthorRef;
  status: ContentStatus;
  completeness: number;
  created_at: string;
  updated_at: string;
}

export interface LocalizedContent {
  id: string;
  content_id: string;
  language: LanguageCode;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  translator: AuthorRef;
  reviewer?: AuthorRef;
  status: ContentStatus;
}

// =============================================================================
// Media Engine
// =============================================================================

export interface MediaAsset {
  id: string;
  type: MediaType;
  url: string;
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
  file_size?: number;
  mime_type: string;
  variants?: MediaVariant[];
  metadata?: MediaMetadata;
}

export type MediaType =
  | "image"
  | "svg"
  | "icon"
  | "mermaid"
  | "video"
  | "audio"
  | "pdf"
  | "download"
  | "interactive";

export interface MediaVariant {
  id: string;
  type: string;
  url: string;
  width?: number;
  height?: number;
  file_size?: number;
}

export interface MediaMetadata {
  title?: string;
  description?: string;
  author?: string;
  license?: ContentLicense;
  source_url?: string;
  created_at?: string;
}

// =============================================================================
// Interactive Block Engine
// =============================================================================

export interface InteractiveBlock {
  id: string;
  type: InteractiveBlockType;
  title?: string;
  content: Record<string, unknown>;
  config?: InteractiveBlockConfig;
}

export type InteractiveBlockType =
  | "quiz"
  | "exercise"
  | "decision_tree"
  | "interactive_table"
  | "code_block"
  | "terminal_block"
  | "architecture_block"
  | "expandable_section"
  | "flashcard"
  | "ai_block"
  | "production_note"
  | "warning"
  | "tip"
  | "callout"
  | "knowledge_link"
  | "mermaid_block"
  | "simulator_placeholder";

export interface InteractiveBlockConfig {
  collapsible?: boolean;
  default_open?: boolean;
  show_label?: boolean;
  language?: string;
  theme?: string;
  read_only?: boolean;
  executable?: boolean;
  ai_enabled?: boolean;
}

// =============================================================================
// Question Engine
// =============================================================================

export interface Question {
  id: string;
  type: QuestionType;
  stem: string;
  difficulty: DifficultyLevel;
  topics: string[];
  skills: string[];
  technologies?: string[];
  explanation?: string;
  hints?: string[];
  metadata: QuestionMetadata;
  content: Record<string, unknown>;
}

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "fill_in_blank"
  | "matching"
  | "ordering"
  | "short_answer"
  | "essay"
  | "code_question"
  | "diagram_question"
  | "scenario"
  | "flashcard"
  | "decision_scenario";

export interface QuestionMetadata {
  id: string;
  created_at: string;
  updated_at: string;
  author: AuthorRef;
  version: string;
  usage_count: number;
  success_rate?: number;
  avg_time_seconds?: number;
  discrimination_index?: number;
  tags: string[];
  certification_map?: string[];
}

export interface QuestionBank {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  taxonomy: {
    topics: string[];
    skills: string[];
    technologies: string[];
    difficulty: DifficultyLevel[];
    certification_id?: string;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  config: QuizConfig;
}

export interface QuizConfig {
  time_limit?: number;
  pass_score: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  allow_retry: boolean;
  show_answers: "immediately" | "after_quiz" | "never";
  max_attempts?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  review_algorithm: "sm2" | "leitner" | "custom";
  daily_new_cards: number;
  max_reviews_per_day: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  difficulty: DifficultyLevel;
  tags: string[];
  review_history?: ReviewRecord[];
}

export interface InterviewQuestionBank {
  id: string;
  roles: CareerLevel[];
  categories: {
    behavioral: Question[];
    technical: Question[];
    system_design: Question[];
    architecture: Question[];
    coding: Question[];
    scenario: Question[];
    leadership: Question[];
  };
}

export type CareerLevel =
  | "junior"
  | "mid"
  | "senior"
  | "staff"
  | "principal";

// =============================================================================
// Assessment Engine
// =============================================================================

export interface Assessment {
  id: string;
  type: AssessmentType;
  title: string;
  description: string;
  config: AssessmentConfig;
  questions?: Question[];
  rubric?: Rubric;
}

export interface AssessmentConfig {
  scored: boolean;
  time_limit?: number;
  pass_score?: number;
  attempts?: number;
  shuffle: boolean;
  feedback: "immediate" | "after_submission" | "after_deadline" | "never";
  proctored?: boolean;
  adaptive?: boolean;
}

export interface Rubric {
  type: "holistic" | "analytic" | "checklist";
  criteria: RubricCriterion[];
}

export interface RubricCriterion {
  name: string;
  max_points: number;
  descriptors: Record<string, string>;
}

export interface Submission {
  id: string;
  assessment_id: string;
  learner_id: string;
  answers: Record<string, unknown>;
  score?: number;
  graded_by?: "auto" | "instructor" | "ai" | "peer";
  feedback?: string;
  submitted_at: string;
  graded_at?: string;
}

// =============================================================================
// Export / Import Engines
// =============================================================================

export interface ExportConfig {
  format: ExportFormat;
  scope: ExportScope;
  content_ids: string[];
  options: Record<string, unknown>;
  output_path?: string;
}

export type ExportFormat =
  | "markdown"
  | "mdx"
  | "html"
  | "pdf"
  | "epub"
  | "json"
  | "offline_package"
  | "print_version"
  | "csv"
  | "yaml"
  | "slides";

export type ExportScope =
  | "single_lesson"
  | "chapter"
  | "module"
  | "course"
  | "book"
  | "learning_path"
  | "question_bank"
  | "glossary"
  | "knowledge_graph"
  | "custom_selection";

export interface ImportConfig {
  format: ImportFormat;
  source: ImportSource;
  mapping?: Record<string, string>;
  options: Record<string, unknown>;
}

export type ImportFormat =
  | "markdown"
  | "mdx"
  | "json"
  | "yaml"
  | "csv"
  | "api"
  | "git"
  | "notion"
  | "google_docs"
  | "docx"
  | "openapi";

export interface ImportSource {
  type: "file" | "directory" | "url" | "repository" | "api";
  path: string;
  credentials?: Record<string, string>;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  failed: number;
  errors?: ImportError[];
  warnings?: string[];
}

export interface ImportError {
  item: string;
  stage: string;
  message: string;
  details?: string;
}

// =============================================================================
// Content Search
// =============================================================================

export interface SearchQuery {
  query: string;
  scope?: SearchScope;
  facets?: SearchFacet[];
  filters?: SearchFilter[];
  sort?: SearchSort;
  page?: number;
  page_size?: number;
  semantic?: boolean;
}

export type SearchScope =
  | "global"
  | "book_scope"
  | "course_scope"
  | "knowledge_scope"
  | "question_scope"
  | "career_scope";

export interface SearchFacet {
  name: string;
  value: string;
}

export interface SearchFilter {
  field: string;
  operator: "eq" | "neq" | "in" | "gt" | "lt" | "contains";
  value: string | string[] | number;
}

export interface SearchSort {
  field: "relevance" | "title" | "date" | "popularity" | "difficulty";
  direction: "asc" | "desc";
}

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  content_type: string;
  url: string;
  relevance: number;
  breadcrumbs: string[];
  facets: Record<string, string>;
  highlights: string[];
}

export interface SearchResponse {
  query: string;
  total_results: number;
  page: number;
  page_size: number;
  results: SearchResult[];
  facets: SearchFacetGroup[];
  suggestions?: string[];
  took_ms: number;
}

export interface SearchFacetGroup {
  name: string;
  values: { value: string; count: number }[];
}

// =============================================================================
// Content Analytics
// =============================================================================

export interface ContentAnalytics {
  content_id: string;
  content_type: string;
  period: { start: string; end: string };
  usage: ContentUsageMetrics;
  completion: CompletionMetrics;
  difficulty: DifficultyMetrics;
  popularity: PopularityMetrics;
  search: SearchAnalytics;
}

export interface ContentUsageMetrics {
  views: number;
  unique_visitors: number;
  avg_time_seconds: number;
  bounce_rate: number;
  scroll_depth_pct: number;
  return_rate: number;
  shares: number;
  bookmarks: number;
  highlights: number;
  notes_count: number;
}

export interface CompletionMetrics {
  completion_rate: number;
  avg_completion_time_seconds: number;
  drop_off_points: { section: string; rate: number }[];
  skip_rate: number;
  revisit_rate: number;
}

export interface DifficultyMetrics {
  perceived_difficulty: number;
  quiz_pass_rate: number;
  avg_quiz_score: number;
  hint_usage_count: number;
  retry_rate: number;
  time_to_mastery_seconds: number;
}

export interface PopularityMetrics {
  views_rank: number;
  trending_score: number;
  rating_avg: number;
  rating_count: number;
  recommendation_clicks: number;
  search_impressions: number;
  search_clicks: number;
}

export interface SearchAnalytics {
  top_search_terms: { term: string; count: number }[];
  zero_result_searches: number;
  click_through_rate: number;
  avg_position: number;
}

// =============================================================================
// Author System
// =============================================================================

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  website?: string;
  social?: AuthorSocial;
  expertise: string[];
  certifications?: string[];
  years_experience?: number;
  languages: LanguageCode[];
  timezone: string;
  roles: AuthorRole[];
  organization_id?: string;
  joined_at: string;
}

export interface AuthorSocial {
  github?: string;
  linkedin?: string;
  twitter?: string;
  blog?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  description: string;
  logo?: string;
  website?: string;
  members: AuthorRef[];
  created_at: string;
}

export interface ReviewRecord {
  id: string;
  date: string;
  score: number;
  time_taken_seconds?: number;
}

// =============================================================================
// Utility Types
// =============================================================================

export type ISO8601 = string;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    took_ms: number;
    request_id: string;
  };
}
