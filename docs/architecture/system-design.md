---
sidebar_position: 2
title: System Design
slug: /architecture/system-design
description: Detailed system design of the Cloud Engineering Learning OS
ai_metadata:
  category: architecture
  difficulty: advanced
  estimated_time_minutes: 20
  prerequisites: [architecture-overview]
  tags: [system-design, architecture, components]
---

# System Design

## Component Architecture

```mermaid
graph LR
    subgraph "Core"
        A[Docusaurus Core]
        B[Plugin System]
        C[Theme System]
    end

    subgraph "Content Plugins"
        D[content-docs]
        E[content-pages]
        F[ideal-image]
    end

    subgraph "Custom Plugins"
        G[PWA Plugin]
        H[Local Search]
        I[Mermaid Theme]
    end

    subgraph "Custom Code"
        J[React Components]
        K[Custom Hooks]
        L[Utility Functions]
    end

    A --> B
    A --> C
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    C --> J
    J --> K
    J --> L
```

## Data Flow

### Build Time
1. Docusaurus scans `docs/`, `curriculum/`, `lessons/`, etc.
2. MDX files are parsed — frontmatter extracted, Markdown rendered
3. React components are rendered to static HTML
4. Mermaid diagrams are converted to SVG
5. Search index is generated from page content
6. Service worker and PWA manifest are bundled
7. Static assets are optimized and hashed

### Runtime (Client)
1. Initial HTML loads (fast, SEO-friendly)
2. React hydrates the page (interactive)
3. Service worker caches assets for offline use
4. Search index loads lazily on first search interaction
5. Dark mode preference is read from system or localStorage

## Directory Organization

```
docs/
├── intro.md                    # Landing page (/)
├── architecture/               # Architecture documentation
│   ├── overview.md             #   → /architecture
│   ├── system-design.md        #   → /architecture/system-design
│   ├── data-flow.md            #   → /architecture/data-flow
│   ├── technology-stack.md     #   → /architecture/technology-stack
│   └── security-model.md       #   → /architecture/security-model
├── development/                # Development documentation
│   ├── overview.md
│   ├── getting-started.md
│   ├── environment-setup.md
│   ├── project-structure.md
│   ├── workflows.md
│   ├── testing.md
│   └── deployment.md
├── standards/                  # Standards and conventions
│   ├── overview.md
│   ├── style-guide.md
│   ├── naming-conventions.md
│   ├── code-quality.md
│   ├── documentation-standards.md
│   ├── content-standards.md
│   └── metadata-guide.md
├── guides/                     # How-to guides
│   ├── overview.md
│   ├── mermaid-guide.md
│   ├── ai-integration.md
│   ├── contributing.md
│   └── knowledge-graph-guide.md
└── reference/                  # Reference material
    ├── overview.md
    ├── glossary.md
    ├── roadmap.md
    ├── changelog.md
    ├── quality-standards.md
    └── api-reference.md
```

## Content Schema

Every MDX document follows a standardized frontmatter schema:

```yaml
---
sidebar_position: number
title: string
slug: string
description: string
keywords: string[]
ai_metadata:
  category: string
  difficulty: beginner | intermediate | advanced
  estimated_time_minutes: number
  prerequisites: string[]
  tags: string[]
  learning_objectives: string[]
---
```
