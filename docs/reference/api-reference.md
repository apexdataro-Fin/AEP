---
displayed_sidebar: devSidebar
sidebar_position: 6
title: API Reference
slug: /reference/api-reference
description: API reference for the Cloud Engineering Learning OS
ai_metadata:
  category: reference
  difficulty: advanced
  estimated_time_minutes: 10
  prerequisites: [architecture-overview]
  tags: [api, reference, specification]
---

displayed_sidebar: devSidebar

# API Reference

## Overview

The Cloud Engineering Learning OS is primarily a **static site** in Phase 1. Future phases will introduce API endpoints.

## Current Capabilities

### Static Content API

All content is available as static HTML with structured metadata in frontmatter.

```
GET /curriculum/           → HTML listing curriculum paths
GET /lessons/              → HTML listing all lessons
GET /projects/             → HTML listing all projects
GET /search-index.json     → JSON search index for client-side search
GET /metadata/taxonomy.json → JSON taxonomy definitions
```

### PWA

```
GET /manifest.json         → Web App Manifest
GET /sw.js                 → Service Worker
```

## Future API (Phase 3+)

### REST API

```
GET    /api/v1/lessons                   → List all lessons
GET    /api/v1/lessons/:slug             → Get lesson by slug
GET    /api/v1/lessons/:slug/progress    → Get user progress
PUT    /api/v1/lessons/:slug/progress    → Update user progress

GET    /api/v1/search?q=<query>          → Search content

GET    /api/v1/knowledge-graph           → Get full knowledge graph
GET    /api/v1/knowledge-graph/:nodeId   → Get node and relations
```

### WebSocket API

```
WS /api/v1/labs/:id/terminal             → Interactive lab terminal
WS /api/v1/collaboration/:sessionId      → Real-time collaboration
```

## API Specifications

Full OpenAPI 3.1 specification is available at `api/openapi.yaml`.
