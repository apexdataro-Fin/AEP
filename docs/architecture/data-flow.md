---
displayed_sidebar: devSidebar
sidebar_position: 3
title: Data Flow
slug: /architecture/data-flow
description: Data flow architecture of the Cloud Engineering Learning OS
ai_metadata:
  category: architecture
  difficulty: intermediate
  estimated_time_minutes: 10
  prerequisites: [system-design]
  tags: [data-flow, build-pipeline, runtime]
---

displayed_sidebar: devSidebar

# Data Flow

## Content Pipeline

```mermaid
sequenceDiagram
    participant Author
    participant Git
    participant CI
    participant Builder
    participant CDN
    participant Browser

    Author->>Git: Push MDX content
    Git->>CI: Trigger build
    CI->>Builder: npm run build
    Builder->>Builder: Parse MDX → HTML
    Builder->>Builder: Render Mermaid → SVG
    Builder->>Builder: Generate search index
    Builder->>Builder: Bundle JS/CSS assets
    Builder->>CDN: Deploy to GitHub Pages
    CDN->>Browser: Serve static assets
    Browser->>Browser: Hydrate React app
    Browser->>Browser: Load search index (lazy)
```

## Runtime Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant SW[Service Worker]
    participant Cache[Cache Storage]
    participant Index[Search Index]

    User->>Browser: Visit page
    Browser->>SW: Check for cached assets
    SW->>Cache: Look up URL
    alt Cache Hit
        Cache-->>SW: Return cached response
        SW-->>Browser: Serve from cache
    else Cache Miss
        SW->>Browser: Fallback to network
        Browser->>Browser: Fetch from CDN
        Browser->>SW: Cache for offline
    end

    User->>Browser: Search query
    Browser->>Index: Load index (if not loaded)
    Index-->>Browser: Return results
    Browser-->>User: Display search results
```

## Build Artifacts

| Artifact           | Location                  | Purpose                |
| ------------------ | ------------------------- | ---------------------- |
| Static HTML        | `build/`                  | SEO, fast initial load |
| JavaScript bundles | `build/assets/js/`        | Interactive features   |
| CSS bundles        | `build/assets/css/`       | Styling                |
| Search index       | `build/search-index.json` | Client-side search     |
| Service worker     | `build/sw.js`             | PWA offline support    |
| Web manifest       | `build/manifest.json`     | PWA installation       |
| Mermaid SVGs       | Inline in HTML            | Diagrams               |
| Optimized images   | `build/assets/images/`    | Responsive images      |
