---
displayed_sidebar: devSidebar
sidebar_position: 7
title: Metadata Guide
slug: /standards/metadata-guide
description: Guide to AI-friendly metadata for all content in the platform
ai_metadata:
  category: standards
  difficulty: intermediate
  estimated_time_minutes: 15
  prerequisites: [documentation-standards]
  tags: [metadata, ai, schema, frontmatter]
---

displayed_sidebar: devSidebar

# Metadata Guide

## Overview

Every content file in the platform includes **structured frontmatter** that makes it discoverable, searchable, and AI-consumable.

## Required Fields

```yaml
---
displayed_sidebar: devSidebar
sidebar_position: number # Position in sidebar navigation
title: string # Display title (H1)
slug: string # URL path (unique)
description: string # SEO description and AI summary (≤ 160 chars)
ai_metadata:
  category: string # Content category
  difficulty: string # beginner | intermediate | advanced
  estimated_time_minutes: number # Time to complete
  prerequisites: string[] # Slugs of prerequisite content
  tags: string[] # Search and classification tags
---
displayed_sidebar: devSidebar
```

## Optional Fields

```yaml
---
displayed_sidebar: devSidebar
keywords: string[] # Additional SEO keywords
image: string # Social card image path
ai_metadata:
  learning_objectives: string[] # Measurable learning goals
  related_content: string[] # Related content slugs
  version: string # Content version (semver)
  last_validated: string # ISO date of last accuracy review
  author: string # Content author
---
displayed_sidebar: devSidebar
```

## Category Taxonomy

```yaml
category:
  # Getting started
  - getting_started

  # Architecture
  - architecture

  # Development
  - development

  # Standards & Guides
  - standards
  - guides

  # Reference
  - reference

  # Cloud Domains
  - compute
  - networking
  - storage
  - security
  - databases
  - serverless
  - containers
  - kubernetes
  - ci_cd
  - observability
  - iac

  # Career
  - career
  - certifications
```

## Tag Guidelines

Tags should be:

- **Lowercase** with underscores for spaces
- **Singular** (use `container`, not `containers`)
- **Specific** (use `aws_lambda`, not just `aws`)
- **3-7 tags per piece of content**

Example tag taxonomy:

```yaml
tags:
  - aws
  - s3
  - storage
  - security
  - iam
  - beginner
```

## Frontmatter Validation

Run the content validation script to check frontmatter:

```bash
node scripts/validate-content.js
```

This validates:

- All required fields are present
- `difficulty` is a valid value
- `estimated_time_minutes` is a positive number
- `slug` is unique across the project
- `prerequisites` reference valid slugs
- `tags` follow naming conventions
