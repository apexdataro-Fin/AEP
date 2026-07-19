---
sidebar_position: 3
title: "أمن GitHub"
description: "CodeQL، Dependabot، Secret Scanning — تأمين مستودعات GitHub."
---

# أمن GitHub

> "GitHub ليس فقط لاستضافة الكود. إنه خط دفاعك الأول."

## 🎯 أهداف التعلم

- CodeQL لتحليل الكود الثابت
- Dependabot للتحديثات الأمنية
- Secret Scanning لمنع التسريبات
- Security Policy و Advisory

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🏗️ CodeQL

```yaml
name: CodeQL Analysis
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # أسبوعياً
jobs:
  analyze:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        language: ['python', 'javascript']
    steps:
      - uses: actions/checkout@v3
      - uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}
      - uses: github/codeql-action/analyze@v2
```

### Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
```

### Secret Scanning

GitHub يفحص commits تلقائياً عن:
- Azure Storage Keys
- GitHub Tokens
- AWS Access Keys
- وغيرها من 200+ patterns

---

[← GitHub Actions Advanced](./02-github-actions-advanced) | [→ CI/CD Pipelines](../../15-cicd/01-cicd-pipelines) | [🏠 الرئيسية](/)
