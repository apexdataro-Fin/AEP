---
displayed_sidebar: devSidebar
sidebar_position: 5
title: Workflows
slug: /development/workflows
description: Common development workflows and best practices
ai_metadata:
  category: development
  difficulty: intermediate
  estimated_time_minutes: 10
  prerequisites: [environment-setup]
  tags: [workflows, git, branching]
---
displayed_sidebar: devSidebar

# Development Workflows

## Branching Strategy

```
main          ──●────────●────────●────────●── (production)
                 \        \        \        \
feature/xxx      ●──●──●   \        \        \
                            \        \        \
fix/yyy                      ●──●      \        \
                                        \        \
docs/zzz                                 ●──●──●
```

### Branch Types

| Prefix      | Purpose          | Example                      |
| ----------- | ---------------- | ---------------------------- |
| `feature/`  | New features     | `feature/add-search-filter`  |
| `fix/`      | Bug fixes        | `fix/broken-mermaid-diagram` |
| `docs/`     | Documentation    | `docs/update-architecture`   |
| `chore/`    | Maintenance      | `chore/update-dependencies`  |
| `refactor/` | Code refactoring | `refactor/sidebar-component` |

## Creating a New Lesson

```bash
# 1. Create a branch
git checkout -b feature/new-kubernetes-lesson

# 2. Use the template
cp templates/lesson-template.mdx lessons/kubernetes/intro-to-pods.mdx

# 3. Edit the content
# Follow the Content Standards guide

# 4. Validate
npm run validate
node scripts/validate-content.js

# 5. Commit and push
git add lessons/kubernetes/
git commit -m "feat: add Intro to Kubernetes Pods lesson"
git push origin feature/new-kubernetes-lesson

# 6. Open a Pull Request
gh pr create --title "feat: Intro to Kubernetes Pods" --body "Description of the lesson"
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Examples:

- `feat(lessons): add Kubernetes Pods introduction`
- `fix(search): resolve broken search on mobile`
- `docs(architecture): update system design diagram`
- `chore(deps): upgrade Docusaurus to 3.10.3`
