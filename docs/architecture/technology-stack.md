---
displayed_sidebar: devSidebar
sidebar_position: 4
title: Technology Stack
slug: /architecture/technology-stack
description: Complete technology stack of the Cloud Engineering Learning OS
ai_metadata:
  category: architecture
  difficulty: beginner
  estimated_time_minutes: 10
  prerequisites: [architecture-overview]
  tags: [technology, stack, dependencies]
---
displayed_sidebar: devSidebar

# Technology Stack

## Core Stack

| Category            | Technology | Version | Purpose                   |
| ------------------- | ---------- | ------- | ------------------------- |
| **Framework**       | React      | 19.x    | UI component library      |
| **Language**        | TypeScript | 6.x     | Type-safe development     |
| **SSG**             | Docusaurus | 3.10.x  | Static site generation    |
| **Content**         | MDX        | 3.x     | Markdown + JSX components |
| **Package Manager** | npm        | 10.x    | Dependency management     |

## Plugins & Extensions

| Plugin                                | Purpose                        |
| ------------------------------------- | ------------------------------ |
| `@docusaurus/preset-classic`          | Standard doc/blog/page presets |
| `@docusaurus/plugin-pwa`              | Progressive Web App support    |
| `@docusaurus/theme-mermaid`           | Mermaid diagram rendering      |
| `@docusaurus/plugin-ideal-image`      | Responsive image optimization  |
| `@easyops-cn/docusaurus-search-local` | Client-side full-text search   |
| `@docusaurus/faster`                  | Build performance optimization |

## Development Tools

| Tool               | Purpose                       |
| ------------------ | ----------------------------- |
| **ESLint**         | JavaScript/TypeScript linting |
| **Prettier**       | Code formatting               |
| **Git**            | Version control               |
| **GitHub Actions** | CI/CD pipeline                |
| **GitHub Pages**   | Hosting and deployment        |

## Browser Support

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | Last 3 versions |
| Firefox | Last 3 versions |
| Safari  | Last 5 versions |
| Edge    | Last 3 versions |

## Future Technology Additions

These technologies are planned for future phases:

| Phase   | Technology    | Purpose                       |
| ------- | ------------- | ----------------------------- |
| Phase 2 | WebAssembly   | Cloud simulators              |
| Phase 2 | IndexedDB     | Offline data storage          |
| Phase 3 | WebRTC        | Peer-to-peer collaboration    |
| Phase 3 | Web Workers   | Background processing         |
| Phase 4 | TensorFlow.js | Client-side ML for AI tutor   |
| Phase 5 | Neo4j         | Knowledge graph database      |
| Phase 5 | GraphQL       | API layer for dynamic content |
