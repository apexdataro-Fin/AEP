---
displayed_sidebar: devSidebar
sidebar_position: 3
title: Naming Conventions
slug: /standards/naming-conventions
description: Naming conventions for files, variables, and content
ai_metadata:
  category: standards
  difficulty: beginner
  estimated_time_minutes: 10
  prerequisites: []
  tags: [naming, conventions, files]
---
displayed_sidebar: devSidebar

# Naming Conventions

## Files and Directories

| Type                    | Convention                 | Example                                   |
| ----------------------- | -------------------------- | ----------------------------------------- |
| **Directories**         | `kebab-case`               | `knowledge-graph/`, `project-structure/`  |
| **TypeScript files**    | `kebab-case.ts`            | `use-search-index.ts`, `lesson-card.tsx`  |
| **React components**    | `PascalCase.tsx`           | `LessonCard.tsx`, `SearchBar.tsx`         |
| **Markdown/MDX docs**   | `kebab-case.md` / `.mdx`   | `getting-started.md`, `system-design.mdx` |
| **JSON schemas**        | `kebab-case.schema.json`   | `lesson.schema.json`                      |
| **Configuration files** | `dot.case` or `kebab-case` | `.prettierrc`, `docusaurus.config.ts`     |
| **Test files**          | `*.test.ts` / `*.spec.ts`  | `lesson-card.test.tsx`                    |

## Code Naming

### TypeScript / JavaScript

```typescript
// ✅ Good
const lessonCount = 42; // camelCase for variables
const MAX_LESSONS = 100; // UPPER_SNAKE_CASE for constants
function getLessonBySlug() {} // camelCase for functions
interface LessonMetadata {} // PascalCase for types/interfaces
type Difficulty = "beginner"; // PascalCase for type aliases
enum ContentType {} // PascalCase for enums
const LESSON_API_URL = "..."; // UPPER_SNAKE_CASE for env/globals

// ❌ Bad
const lesson_count = 42; // No snake_case
const maxLessons = 100; // Not clear it's a constant
function GetLessonBySlug() {} // No PascalCase functions
interface lessonMetadata {} // No camelCase interfaces
```

### CSS Classes

```css
/* ✅ Good: BEM-like, descriptive */
.lesson-card {
}
.lesson-card__title {
}
.lesson-card--featured {
}
.search-bar {
}
.search-bar__input {
}

/* ❌ Bad: Abbreviations, generic */
.lc {
}
.title {
}
.featured {
}
```

## Content Naming

### Slugs (URL paths)

```
✅ Good:
  /lessons/kubernetes/intro-to-pods
  /architecture/system-design
  /career/cloud-engineer-path

❌ Bad:
  /lessons/k8s/lesson-1
  /arch/sys-design
  /career/path-1
```

### Document Titles

```
✅ Good:
  Getting Started with Kubernetes
  System Design Overview
  Cloud Security Best Practices

❌ Bad:
  k8s intro
  Sys Design
  Security Stuff
```

## Abbreviations

These abbreviations are acceptable in code (not in user-facing content):

| Abbreviation    | Meaning                |
| --------------- | ---------------------- |
| `idx`           | index                  |
| `cfg`           | config / configuration |
| `ctx`           | context                |
| `prev` / `next` | previous / next        |
| `err`           | error                  |
| `req` / `res`   | request / response     |
