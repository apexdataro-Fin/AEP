---
sidebar_position: 6
title: Content Standards
slug: /standards/content-standards
description: Standards for creating educational content in the platform
ai_metadata:
  category: standards
  difficulty: intermediate
  estimated_time_minutes: 15
  prerequisites: [documentation-standards]
  tags: [content, education, quality]
---

# Content Standards

## Content Types

The platform supports multiple content types, each with its own structure:

| Type          | Directory     | Purpose                                |
| ------------- | ------------- | -------------------------------------- |
| **Lesson**    | `lessons/`    | Single topic, ~15-45 minute read       |
| **Project**   | `projects/`   | Hands-on project, ~2-8 hours           |
| **Lab**       | `labs/`       | Guided exercise, ~30-90 minutes        |
| **Concept**   | `curriculum/` | Theoretical foundation, ~10-20 minutes |
| **Simulator** | `simulators/` | Interactive simulation                 |

## Lesson Structure

Every lesson must follow this structure:

```mdx
---
# Frontmatter (see Metadata Guide)
---

# Lesson Title

## Learning Objectives

- Objective 1 (measurable, action-oriented)
- Objective 2
- Objective 3

## Prerequisites

- What the learner should know before starting
- Link to prerequisite lessons

## Introduction

Context and motivation. Why does this topic matter?

## Core Content

The main body of the lesson. Use:

- Clear headings for each sub-topic
- Diagrams to explain complex concepts
- Code examples for technical topics
- Real-world scenarios for context

## Hands-On Exercise

A practical exercise to reinforce learning.

## Key Takeaways

- Takeaway 1
- Takeaway 2
- Takeaway 3

## Check Your Understanding

Brief quiz or reflection questions.

## Next Steps

- [Next Lesson](/lessons/next-topic)
- [Related Project](/projects/related-project)
```

## Quality Requirements

### Content Must Be:

1. **Accurate** — Technically correct and up-to-date
2. **Accessible** — Understandable to the target audience
3. **Actionable** — Includes exercises and next steps
4. **Illustrated** — Diagrams, code blocks, examples
5. **Connected** — Links to prerequisites and next topics

### Content Must NOT:

- ❌ Contain marketing or promotional material
- ❌ Use paywalled external resources as required reading
- ❌ Include personal opinions presented as fact
- ❌ Skip defining technical terms
- ❌ Assume knowledge without listing it as a prerequisite

## Difficulty Levels

| Level            | Audience               | Characteristics                                           |
| ---------------- | ---------------------- | --------------------------------------------------------- |
| **Beginner**     | New to cloud computing | Explain all terms, provide context, use analogies         |
| **Intermediate** | Some cloud experience  | Assume basic concepts, focus on practical skills          |
| **Advanced**     | Professional engineers | Deep technical detail, architecture decisions, trade-offs |
