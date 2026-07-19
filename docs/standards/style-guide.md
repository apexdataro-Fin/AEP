---
displayed_sidebar: devSidebar
sidebar_position: 2
title: Style Guide
slug: /standards/style-guide
description: Code style guide for the Cloud Engineering Learning OS
ai_metadata:
  category: standards
  difficulty: beginner
  estimated_time_minutes: 10
  prerequisites: []
  tags: [style, formatting, prettier]
---
displayed_sidebar: devSidebar

# Style Guide

## General Principles

- **Readability first** — Code is read far more than it is written
- **Consistency** — Follow existing patterns in the codebase
- **Simplicity** — Prefer simple solutions over clever ones
- **Explicitness** — Be explicit about types, imports, and intent

## TypeScript Style

```typescript
// ✅ Good: Explicit types, descriptive names
interface LessonMetadata {
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTimeMinutes: number;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours}h ${remaining}m` : `${hours}h`;
}

// ❌ Bad: Implicit types, abbreviations, magic values
function fmt(m) {
  return m >= 60 ? `${m / 60}h` : `${m}m`;
}
```

## React Component Style

```tsx
// ✅ Good: Functional components, typed props, semantic structure
interface LessonCardProps {
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  durationMinutes: number;
  href: string;
}

export function LessonCard({ title, difficulty, durationMinutes, href }: LessonCardProps) {
  return (
    <article className="lesson-card">
      <h3>
        <Link to={href}>{title}</Link>
      </h3>
      <span className="badge">{difficulty}</span>
      <time>{formatDuration(durationMinutes)}</time>
    </article>
  );
}
```

## CSS Style

```css
/* ✅ Good: Custom properties, logical grouping, descriptive names */
.lesson-card {
  --card-padding: 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: var(--card-padding);
  border: 1px solid var(--celos-border);
  border-radius: var(--ifm-global-radius);
  background: var(--celos-surface-alt);
  transition: box-shadow 0.2s ease;
}

.lesson-card:hover {
  box-shadow: var(--ifm-global-shadow-md);
}
```

## Formatting Rules

Formatting is handled automatically by **Prettier** with these settings:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

Run `npm run format` before committing to auto-fix formatting issues.
