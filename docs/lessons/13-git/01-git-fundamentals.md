---
sidebar_position: 1
title: "Git Fundamentals"
description: "Version control mastery: branching, merging, rebasing, and Git workflows."
---

# Git Fundamentals

Version control mastery: branching, merging, rebasing, and Git workflows.

## What You Will Learn

This module covers key concepts, hands-on exercises, and real CloudNova scenarios to build your production engineering skills.

## Essential Commands

```bash
git init                     # Start a repo
git clone <url>               # Copy a repo
git add .                     # Stage changes
git commit -m "message"      # Commit
git push origin main          # Push to remote
git pull origin main          # Pull latest
```

## Branching Strategy

```bash
git checkout -b feature/add-monitoring
git add monitoring.sh
git commit -m "Add health check script"
git push origin feature/add-monitoring
# Create PR, review, merge to main
git checkout main
git pull origin main
```

| Command               | Purpose               |
| --------------------- | --------------------- |
| git status            | See what changed      |
| git log --oneline     | Commit history        |
| git diff              | See actual changes    |
| git stash             | Temporarily save work |
| git revert `<commit>` | Undo a commit safely  |

## CloudNova Exercise

Apply what you learned: review the key concepts above and identify how they apply to a real production cloud environment.

---

[← Back to Module](index.md) | [🏠 Home](/)
