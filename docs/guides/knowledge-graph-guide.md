---
sidebar_position: 5
title: Knowledge Graph Guide
slug: /guides/knowledge-graph-guide
description: Guide to the knowledge graph system for concept relationships
ai_metadata:
  category: guides
  difficulty: advanced
  estimated_time_minutes: 20
  prerequisites: [metadata-guide, ai-integration]
  tags: [knowledge-graph, concepts, relationships]
---

# Knowledge Graph Guide

## Overview

The knowledge graph represents the **relationships between concepts** in the platform. It enables:

- **Prerequisite mapping** — What must you learn before concept X?
- **Concept discovery** — What's related to what you just learned?
- **Gap analysis** — What concepts have no content yet?
- **AI reasoning** — AI systems can traverse the graph for recommendations

## Graph Structure

```mermaid
graph TB
    subgraph "Foundation"
        A[Cloud Computing]
        B[Networking]
        C[Operating Systems]
    end

    subgraph "Core"
        D[Compute]
        E[Storage]
        F[Databases]
        G[Security]
    end

    subgraph "Advanced"
        H[Containers]
        I[Kubernetes]
        J[Serverless]
        K[Observability]
    end

    A --> D
    A --> E
    A --> F
    B --> D
    B --> G
    C --> H
    D --> H
    D --> J
    H --> I
    E --> F
    F --> I
    G --> G
```

## Node Types

| Type            | Example                   | Description                |
| --------------- | ------------------------- | -------------------------- |
| `concept`       | "Load Balancing"          | Abstract idea or principle |
| `technology`    | "AWS ELB"                 | Specific tool or service   |
| `skill`         | "Configure an ALB"        | Practical ability          |
| `certification` | "AWS Solutions Architect" | Certification exam         |

## Relationship Types

| Relationship      | Direction      | Example                    |
| ----------------- | -------------- | -------------------------- |
| `prerequisite_of` | A → B          | Networking → VPC Design    |
| `implemented_by`  | Concept → Tech | Containers → Docker        |
| `part_of`         | Part → Whole   | EC2 → AWS Compute          |
| `related_to`      | A ↔ B          | Observability ↔ Monitoring |
| `certified_by`    | Skill → Cert   | Cloud Skills → AWS SA      |

## Adding to the Graph

Create a file in `knowledge-graph/domains/`:

```json
{
  "domain": "compute",
  "version": "1.0.0",
  "nodes": [
    {
      "id": "auto-scaling",
      "label": "Auto Scaling",
      "type": "concept",
      "description": "Automatically adjusting compute capacity based on demand",
      "difficulty": "intermediate",
      "content": ["/lessons/compute/auto-scaling-basics"]
    }
  ],
  "edges": [
    {
      "from": "compute-instances",
      "to": "auto-scaling",
      "relationship": "prerequisite_of"
    }
  ]
}
```

## Validation

```bash
node scripts/validate-kg.js
```

Checks:

- All referenced node IDs exist
- No orphaned edges
- Relationship types are valid
- Content links resolve to existing pages
