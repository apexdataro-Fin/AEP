---
sidebar_position: 6
title: Testing
slug: /development/testing
description: Testing strategy and practices for the Cloud Engineering Learning OS
ai_metadata:
  category: development
  difficulty: intermediate
  estimated_time_minutes: 15
  prerequisites: [workflows]
  tags: [testing, quality, validation]
---

# Testing

## Testing Strategy

The Cloud Engineering Learning OS employs a **layered testing approach**:

```mermaid
graph TB
    A[Static Analysis] --> B[Unit Tests]
    B --> C[Integration Tests]
    C --> D[E2E Tests]
    D --> E[Visual Regression]

    A1[ESLint] -.-> A
    A2[Prettier] -.-> A
    A3[TypeScript] -.-> A

    style A fill:#e8f5e9
    style B fill:#e3f2fd
    style C fill:#fff3e0
    style D fill:#fce4ec
    style E fill:#f3e5f5
```

## Static Analysis

Run before every commit:

```bash
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint for code quality
npm run format:check # Prettier format validation
npm run validate    # All three at once
```

## Content Validation

```bash
node scripts/validate-content.js
```

Checks:
- All MDX files have required frontmatter
- Links are not broken
- Images have alt text
- Metadata schema compliance

## Build Verification

```bash
npm run build       # Production build
npm run serve       # Serve and visually inspect
```

The build will:
- Catch broken links (`onBrokenLinks: "warn"`)
- Validate Mermaid diagrams
- Check TypeScript compilation
- Generate search index

## Manual Testing Checklist

Before opening a PR:

- [ ] `npm run validate` passes
- [ ] `npm run build` succeeds
- [ ] `npm run serve` renders correctly
- [ ] Dark mode toggle works
- [ ] Search returns relevant results
- [ ] Navigation works on mobile viewport
- [ ] All links resolve to valid pages
- [ ] Mermaid diagrams render correctly
- [ ] PWA install prompt appears
- [ ] Page loads with JavaScript disabled

## Future Test Infrastructure

| Phase | Addition |
|---|---|
| Phase 2 | Jest + React Testing Library for unit tests |
| Phase 3 | Playwright for E2E testing |
| Phase 4 | Percy/Chromatic for visual regression |
| Phase 5 | Load testing for interactive components |
