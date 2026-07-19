---
sidebar_position: 2
title: "GitHub Actions متقدم"
description: "Reusable workflows، composite actions، matrices، environments — أتمتة متقدمة في GitHub."
---

# GitHub Actions متقدم

> "GitHub Actions البسيط للـ POC. الـ المتقدم للإنتاج."

## 🎯 أهداف التعلم

- Reusable Workflows
- Composite Actions
- Matrix Strategies للـ multi-platform
- Environments & Approval Gates

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Reusable Workflows

```yaml
# .github/workflows/deploy-template.yml
name: Reusable Deploy
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      AZURE_CREDENTIALS:
        required: true
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - uses: actions/checkout@v3
      - uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - run: |
          echo "Deploying to ${{ inputs.environment }}"
```

```yaml
# استخدام reusable workflow
jobs:
  deploy-dev:
    uses: ./.github/workflows/deploy-template.yml
    with:
      environment: development
    secrets:
      AZURE_CREDENTIALS: ${{ secrets.AZURE_CREDENTIALS }}
  deploy-prod:
    uses: ./.github/workflows/deploy-template.yml
    with:
      environment: production
    secrets:
      AZURE_CREDENTIALS: ${{ secrets.AZURE_CREDENTIALS_PROD }}
```

### Matrix Strategy

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        python-version: ['3.10', '3.11', '3.12']
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - run: pytest
```

### Environments & Approval

```yaml
deploy-production:
  needs: [test, build]
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://cloudnova.com
```

في GitHub Settings → Environments → production:
- ✅ Required reviewers: 2 people
- ✅ Wait timer: 5 minutes
- ✅ Deployment branches: main only

---

[← GitHub Workflows](./01-github-workflows) | [→ GitHub Security](./03-github-security-codeql-dependabot) | [🏠 الرئيسية](/)
