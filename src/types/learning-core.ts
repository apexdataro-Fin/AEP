/**
 * Cloud Engineering Learning OS — Learning Core Type Definitions
 * 
 * These types mirror the JSON schemas and metadata specifications.
 * Every future lesson, lab, project, and simulator uses these types.
 */

// ============================================================
// Content Types
// ============================================================

export type ContentType =
  | "lesson"
  | "mini-lesson"
  | "lab"
  | "project"
  | "simulator"
  | "certification-lesson"
  | "career-lesson"
  | "interview-lesson"
  | "architecture-review"
  | "production-incident"
  | "decision-lab"
  | "troubleshooting-guide"
  | "reference"
  | "glossary-entry"
  | "cheat-sheet"
  | "technology-overview";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert" | "architect";

export type ContentStatus = "draft" | "review" | "published" | "deprecated" | "archived";

export type ProficiencyLevel = "awareness" | "basic" | "intermediate" | "advanced" | "expert";

export type BloomLevel = "remember" | "understand" | "apply" | "analyze" | "evaluate" | "create";

export type LearningCategory = "knowledge" | "skill" | "attitude" | "behavior";

// ============================================================
// Learning Levels (Five Explanation Layers)
// ============================================================

export type LearningLevel = "simple" | "core" | "professional" | "production" | "architect";

export interface LearningLevelConfig {
  id: LearningLevel;
  label: string;
  icon: string;
  order: number;
  description: string;
  targetAudience: string[];
  characteristics: {
    vocabulary: string;
    detail: string;
    analogies: string;
    prerequisites: string;
    maxConceptsPerLesson: number;
    typicalReadingTimeMultiplier: number;
  };
}

// ============================================================
// Technology & Skill Refs
// ============================================================

export interface TechnologyRef {
  name: string;
  version?: string;
  category?: string;
  proficiencyRequired?: ProficiencyLevel;
  required?: boolean;
}

export interface SkillRef {
  id: string;
  name: string;
  proficiency: ProficiencyLevel;
}

export interface ContentRef {
  slug: string;
  title: string;
  type: ContentType;
}

// ============================================================
// Certification
// ============================================================

export type CertificationCode = "AZ-900" | "AZ-104" | "AZ-400" | "AI-102" | "AZ-500" | "DP-900" | "SC-900";

export interface CertificationMapping {
  code: CertificationCode;
  objectiveId: string;
  weight: number; // 1-5
}

export interface CertificationObjective {
  id: string;
  description: string;
}

export interface CertificationDomain {
  id: string;
  name: string;
  weightPercent: number;
  objectives: CertificationObjective[];
}

export interface Certification {
  code: CertificationCode;
  name: string;
  provider: string;
  level: "fundamentals" | "associate" | "expert" | "specialty";
  description: string;
  prerequisiteCertifications?: CertificationCode[];
  examDurationMinutes: number;
  questionCount: string;
  passingScore: number;
  costUsd: number;
  domains: CertificationDomain[];
}

// ============================================================
// Career
// ============================================================

export type CareerLevel = "junior" | "mid" | "senior" | "lead" | "principal";

export interface CareerRelevance {
  role: string;
  level: CareerLevel;
  importance: number; // 1-5
}

export interface CareerRole {
  id: string;
  label: string;
  experienceYears: string;
  description: string;
  salaryBenchmark: string;
  certifications: CertificationCode[];
  expectedSkills: Record<string, ProficiencyLevel>;
  dailyActivities: string[];
  ticketTypes: string[];
}

// ============================================================
// Skill Tree
// ============================================================

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  parentSkills: string[];
  childSkills: string[];
  unlockedSkills: string[];
  recommendedOrder: number;
  careerMapping: Partial<Record<CareerLevel, ProficiencyLevel>>;
  certificationMapping: Record<CertificationCode, string>;
  technologyMapping: string[];
  estimatedHours: number;
}

// ============================================================
// Knowledge Graph
// ============================================================

export type NodeType =
  | "lesson" | "lab" | "project" | "simulator" | "skill"
  | "technology" | "certification" | "career_role" | "concept"
  | "interview_topic" | "architecture_pattern" | "incident_type" | "cloud_service";

export type RelationshipType =
  | "prerequisite_of" | "teaches" | "tests" | "implements"
  | "prepares_for" | "relates_to" | "part_of" | "maps_to"
  | "required_for" | "uses" | "builds_on" | "similar_to";

export interface KnowledgeNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  relationship: RelationshipType;
}

// ============================================================
// Learning Objectives
// ============================================================

export interface LearningObjective {
  id: string;
  description: string;
  category: LearningCategory;
  bloomLevel: BloomLevel;
}

// ============================================================
// Active Recall & Review
// ============================================================

export interface ActiveRecallItem {
  question: string;
  answer: string;
  hint?: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ReviewSchedule {
  intervalsDays: number[];
  priority: "low" | "normal" | "high" | "critical";
  retentionTarget: number;
}

export interface ProgressData {
  lessonsCompleted: number;
  labsCompleted: number;
  projectsCompleted: number;
  totalTimeSpentMinutes: number;
  currentStreakDays: number;
  longestStreakDays: number;
  skillsAcquired: SkillRef[];
  certificationsProgress: Array<{ code: CertificationCode; completionPercent: number }>;
  reviewDueCount: number;
  weakTopics: string[];
}

// ============================================================
// Complete Content Metadata
// ============================================================

export interface ContentMetadata {
  id: string;
  title: string;
  slug: string;
  contentType: ContentType;
  summary: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: {
    minutes?: number;
    hours?: number;
    display: string;
  };
  status: ContentStatus;
  author?: string;
  version?: string;
  lastUpdated?: string;
  technologies: TechnologyRef[];
  skills: SkillRef[];
  learningLevels: {
    hasSimple: boolean;
    hasCore: boolean;
    hasProfessional: boolean;
    hasProduction: boolean;
    hasArchitect: boolean;
  };
  prerequisites: ContentRef[];
  dependsOn: ContentRef[];
  relatedLessons: ContentRef[];
  relatedProjects: ContentRef[];
  relatedLabs: ContentRef[];
  relatedSimulators: ContentRef[];
  certifications: CertificationMapping[];
  careerRelevance: CareerRelevance[];
  knowledgeNodes: string[];
  learningObjectives: LearningObjective[];
  activeRecall: ActiveRecallItem[];
  feynmanPoints: string[];
  reviewSchedule: ReviewSchedule;
  tags: string[];
  searchKeywords: string[];
  interviewTopics: string[];
  productionTopics: string[];
  securityTopics: string[];
  costTopics: string[];
  aiTopics: string[];
}

// ============================================================
// Project Engine Types
// ============================================================

export type ProjectType = "guided" | "challenge" | "capstone" | "production";
export type ArtifactType = "code" | "config" | "diagram" | "document" | "demo";

export interface Deliverable {
  id: string;
  description: string;
  artifactType: ArtifactType;
}

export interface AcceptanceCriterion {
  id: string;
  criterion: string;
  verificationMethod: "manual" | "automated" | "peer_review";
}

export interface GradingRubric {
  criterion: string;
  weight: number;
  levels: string[];
}

// ============================================================
// Lab Engine Types
// ============================================================

export type LabType =
  | "guided" | "challenge" | "production" | "debugging"
  | "architecture" | "security" | "cost_optimization" | "ai_lab";

export interface LabScenario {
  context: string;
  role: string;
  objectives: string[];
}

export interface LabTask {
  id: string;
  title: string;
  description: string;
  timeEstimateMinutes: number;
  hints: Array<{ trigger: string; hint: string }>;
  verification: { method: string; expectedOutput: string };
  solution: string;
}

// ============================================================
// Simulator Engine Types
// ============================================================

export type SimulatorType =
  | "linux_terminal" | "azure_portal" | "terraform" | "docker"
  | "kubernetes" | "networking" | "cidr" | "iam" | "monitoring"
  | "cloud_cost" | "architecture_builder" | "incident_response";

export interface SimulatorConfig {
  type: SimulatorType;
  scenario: string;
  initialState: Record<string, unknown>;
  completionCriteria: string[];
}

// ============================================================
// AI Integration Types
// ============================================================

export type AIBlockType =
  | "ai_summary" | "ai_explanation" | "ai_quiz" | "ai_flashcards"
  | "ai_interview" | "ai_code_review" | "ai_architecture_review"
  | "ai_recommendations" | "ai_revision" | "ai_difficulty_adaptation";

export interface AIBlockProps {
  type: AIBlockType;
  context?: Record<string, unknown>;
  topic?: string;
  count?: number;
  difficulty?: Difficulty;
  level?: LearningLevel;
}

// ============================================================
// Component Library Types
// ============================================================

export type ComponentType =
  | "Info" | "Warning" | "Tip" | "BestPractice"
  | "ProductionNote" | "ArchitectureNote" | "SecurityNote" | "CostNote"
  | "InterviewQuestion" | "Challenge" | "Exercise" | "Quiz"
  | "Definition" | "Example" | "Analogy" | "CheatSheet"
  | "CommonMistake" | "Debugging" | "DecisionPoint"
  | "AIPrompt" | "AIExplanation" | "AIQuiz" | "AIFlashcards"
  | "MermaidBlock" | "SimulatorPlaceholder";
