---
sidebar_position: 1
title: Development Overview
slug: /development
description: Development guide for the Cloud Engineering Learning OS
ai_metadata:
  category: development
  difficulty: intermediate
  estimated_time_minutes: 10
  prerequisites: [architecture-overview]
  tags: [development, setup, contribution]
---

# Development Overview

Welcome to the development guide. This section covers everything you need to contribute to the Cloud Engineering Learning OS.

## Prerequisites

- **Node.js** ≥ 20.0
- **npm** ≥ 10.0
- **Git** ≥ 2.40
- A code editor (VS Code recommended)

## Quick Start

```bash
git clone https://github.com/apexdataro-Fin/AEP.git
cd AEP
npm install
npm run dev
```

The development server starts at `http://localhost:3000` with hot reload enabled.

## Development Workflow

```mermaid
graph LR
    A[Pick an Issue] --> B[Create Branch]
    B --> C[Make Changes]
    C --> D[Run Tests]
    D --> E[Open PR]
    E --> F[Code Review]
    F --> G[Merge]
    G --> H[Deploy]
```

## Available Scripts

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Start development server       |
| `npm run build`        | Build for production           |
| `npm run serve`        | Serve production build locally |
| `npm run typecheck`    | Run TypeScript type checking   |
| `npm run lint`         | Run ESLint                     |
| `npm run lint:fix`     | Auto-fix lint issues           |
| `npm run format`       | Format code with Prettier      |
| `npm run format:check` | Check formatting               |
| `npm run validate`     | Typecheck + format check       |
| `npm run clear`        | Clear Docusaurus cache         |

## Next Steps

- [Getting Started](/docs/development/getting-started) — First-time setup
- [Environment Setup](/docs/development/environment-setup) — Configure your tools
- [Project Structure](/docs/development/project-structure) — Understand the codebase
- [Workflows](/docs/development/workflows) — Common development workflows
- [Testing](/docs/development/testing) — Write and run tests
- [Deployment](/docs/development/deployment) — Deploy to production
