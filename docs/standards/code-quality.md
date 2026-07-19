---
displayed_sidebar: devSidebar
sidebar_position: 4
title: Code Quality
slug: /standards/code-quality
description: Code quality standards, review criteria, and quality gates
ai_metadata:
  category: standards
  difficulty: intermediate
  estimated_time_minutes: 10
  prerequisites: [style-guide, naming-conventions]
  tags: [code-quality, review, automation]
---
displayed_sidebar: devSidebar

# Code Quality

## Quality Gates

Every change must pass these automated gates before merge:

```mermaid
graph LR
    A[Commit] --> B[Prettier Check]
    B --> C[ESLint]
    C --> D[TypeScript Check]
    D --> E[Content Validation]
    E --> F[Build Check]
    F --> G[Merge Ready]
```

## Automated Checks

### TypeScript (`npm run typecheck`)

```typescript
// ❌ Fails typecheck
function getLesson(id) {
  // Implicit 'any'
  return lessons.find((l) => (l.id = id)); // Assignment, not comparison
}

// ✅ Passes typecheck
function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
```

### ESLint (`npm run lint`)

Enforces:

- No unused variables
- No implicit `any` types
- Consistent import ordering
- Proper React hooks usage
- No direct state mutation

### Content Validation (`node scripts/validate-content.js`)

Checks:

- Required frontmatter fields present
- Valid difficulty levels
- Unique slugs
- Valid cross-references

## Code Review Checklist

Reviewers must verify:

- [ ] Code follows the [Style Guide](/docs/standards/style-guide)
- [ ] Naming follows [Naming Conventions](/docs/standards/naming-conventions)
- [ ] Types are explicit and correct
- [ ] No commented-out code
- [ ] No console.log (unless intentional)
- [ ] Error cases are handled
- [ ] Accessibility attributes are present on interactive elements
- [ ] Component is responsive (test on mobile viewport)
- [ ] Dark mode renders correctly

## Complexity Guidelines

| Metric                      | Limit       |
| --------------------------- | ----------- |
| **Function length**         | ≤ 50 lines  |
| **Component length**        | ≤ 200 lines |
| **File length**             | ≤ 500 lines |
| **Cyclomatic complexity**   | ≤ 10        |
| **Nesting depth**           | ≤ 4 levels  |
| **Parameters per function** | ≤ 4         |
