---
sidebar_position: 1
title: "CI/CD Pipelines"
description: "Automate build, test, and deployment with CI/CD pipelines."
---

# CI/CD Pipelines

Automate build, test, and deployment with CI/CD pipelines.

## What You Will Learn

This module covers key concepts, hands-on exercises, and real CloudNova scenarios to build your production engineering skills.

## CI/CD Pipeline Stages

```yaml
name: Build and Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
      - run: npm run build
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production..."
```

## Pipeline Principles

1. **Fast feedback** — tests run in seconds, not hours
2. **Immutable artifacts** — build once, deploy anywhere
3. **Rollback capability** — every deployment can be reversed
4. **Security gates** — scan before deploy, not after

## CloudNova Exercise

Apply what you learned: review the key concepts above and identify how they apply to a real production cloud environment.

---

[← Back to Module](index.md) | [🏠 Home](/)
