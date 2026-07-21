---
displayed_sidebar: devSidebar
sidebar_position: 5
title: Documentation Standards
slug: /standards/documentation-standards
description: How to write and structure documentation for the platform
ai_metadata:
  category: standards
  difficulty: beginner
  estimated_time_minutes: 10
  prerequisites: [style-guide]
  tags: [documentation, writing, structure]
---

displayed_sidebar: devSidebar

# Documentation Standards

## Document Structure

Every documentation file should follow this structure:

```mdx
---
displayed_sidebar: devSidebar
# Required frontmatter (see Metadata Guide)
---

displayed_sidebar: devSidebar

# Title (H1 — exactly one per document)

Brief introduction paragraph explaining what this document covers.

## Section (H2)

Content with sub-sections as needed.

### Sub-section (H3)

Deeper detail.

## Related

- [Related Document 1](/path)
- [Related Document 2](/path)
```

## Writing Guidelines

### Be Concise

- Use short sentences (≤ 25 words)
- Use short paragraphs (≤ 5 sentences)
- Use bullet points for lists of 3+ items
- Delete unnecessary words

### Be Clear

- Define acronyms on first use: "Site Reliability Engineering (SRE)"
- Use consistent terminology throughout
- Avoid jargon without explanation
- Use concrete examples over abstract descriptions

### Be Structured

- One H1 per document
- Use H2 for major sections, H3 for sub-sections
- Never skip heading levels (don't go from H2 to H4)
- Start every code block with a language identifier

## Markdown Examples

### Code Blocks

````markdown
```typescript
// Always specify the language
interface CloudProvider {
  name: string;
  regions: string[];
  services: Service[];
}
```
````

### Admonitions (Callouts)

```markdown
:::info
Additional context or helpful information.
:::

:::tip
A recommended practice or time-saving tip.
:::

:::warning
Something to be careful about.
:::

:::danger
Something that could cause problems if not followed.
:::
```

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Value    | Value    | Value    |
```

### Links

```markdown
[Internal link](/path/to/doc) — Use absolute paths from the root
[External link](https://example.com) — Full URL for external resources
```

### Images

```markdown
![Descriptive alt text](./path/to/image.png)
```

Always include descriptive alt text for accessibility.

## Quality Checklist

Before submitting a document:

- [ ] Frontmatter is complete and valid
- [ ] One H1 title matches the frontmatter title
- [ ] No skipped heading levels
- [ ] All code blocks have language identifiers
- [ ] All links are valid (use relative paths)
- [ ] All images have alt text
- [ ] Acronyms are defined on first use
- [ ] No spelling or grammar errors
- [ ] Document is mobile-readable
