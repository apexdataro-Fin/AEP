---
sidebar_position: 2
title: Mermaid Guide
slug: /guides/mermaid-guide
description: Complete guide to creating Mermaid diagrams for the platform
ai_metadata:
  category: guides
  difficulty: beginner
  estimated_time_minutes: 15
  prerequisites: [documentation-standards]
  tags: [mermaid, diagrams, visualization]
---

# Mermaid Guide

[Mermaid](https://mermaid.js.org/) is a JavaScript-based diagramming tool that renders text definitions into SVG diagrams. It's built into Docusaurus via `@docusaurus/theme-mermaid`.

## Why Mermaid?

- **Version-controlled** — Diagrams are plain text, diffable in Git
- **Build-time rendered** — No runtime JavaScript cost for diagrams
- **Accessible** — SVG output works with screen readers
- **Consistent** — Applies the site's theme (light/dark) automatically

## Creating a Diagram

Wrap your Mermaid code in a fenced code block with the `mermaid` language identifier:

````markdown
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
```
````

## Diagram Types

### Flowchart

```mermaid
graph LR
    A[User] --> B[Load Balancer]
    B --> C[Web Server 1]
    B --> D[Web Server 2]
    C --> E[Database]
    D --> E
```

### Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    participant D as Database

    C->>S: Request
    S->>D: Query
    D-->>S: Result
    S-->>C: Response
```

### Class Diagram

```mermaid
classDiagram
    class CloudResource {
        +String id
        +String name
        +String region
        +provision()
        +destroy()
    }
    class ComputeInstance {
        +String instanceType
        +int vCPUs
        +start()
        +stop()
    }
    CloudResource <|-- ComputeInstance
```

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> Provisioning
    Provisioning --> Running
    Running --> Stopped
    Stopped --> Running
    Running --> Terminated
    Stopped --> Terminated
    Terminated --> [*]
```

### ER Diagram

```mermaid
erDiagram
    USER ||--o{ ENROLLMENT : has
    COURSE ||--o{ LESSON : contains
    COURSE ||--o{ ENROLLMENT : has
    LESSON ||--o{ EXERCISE : includes
```

## Best Practices

### Do
- ✅ Keep diagrams focused on one concept
- ✅ Use descriptive labels on nodes and edges
- ✅ Add a caption above the diagram explaining what it shows
- ✅ Use consistent direction (LR for sequences, TB for hierarchies)
- ✅ Add comments for complex diagrams

### Don't
- ❌ Create diagrams with more than 15-20 nodes
- ❌ Use Mermaid for simple lists (use Markdown lists instead)
- ❌ Rely on color alone to convey meaning
- ❌ Leave unlabeled arrows or nodes

## Testing Diagrams

During development (`npm run dev`), diagrams render live. If a diagram fails to render:

1. Check for syntax errors in the Mermaid code
2. Ensure the `mermaid` language identifier is correct
3. Run `npm run build` to see build-time errors
