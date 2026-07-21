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
    - cron: "0 0 * * 0" # أسبوعياً
jobs:
  analyze:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        language: ["python", "javascript"]
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

GitHub يفحص commits تلقائياً عن: Azure Storage Keys, GitHub Tokens, AWS Access Keys, وغيرها من 200+ patterns.

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

CodeQL اكتشف SQL injection vulnerability في API جديد. تم إصلاحه قبل merge إلى main.

**الدرس**: CodeQL التقط ثغرة كان يمكن أن تكلفنا تسريب بيانات.

### Push Protection

GitHub يمنع push إذا اكتشف secret:

```
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - Secret detected: Azure Storage Account Key
```

---

## 🎨 Dependabot vs Renovate

|                       | Dependabot | Renovate |
| --------------------- | ---------- | -------- |
| **مدمج مع GitHub**    | ✅         | ❌       |
| **Grouped PRs**       | محدود      | ✅       |
| **Custom scheduling** | أساسي      | متقدم    |
| **السعر**             | مجاني      | مجاني    |

---

## 🛠️ تدريبات

### تمرين: فعّل CodeQL على repo

### تمرين: أضف Dependabot للتحديثات الأسبوعية

### تحدي: اكتب Security Policy (SECURITY.md)

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما الفرق بين CodeQL و Dependabot؟
2. كيف يمنع GitHub دفع secrets؟
3. لماذا Push Protection مهم؟

### 🃏 بطاقات

| السؤال          | الإجابة                 |
| --------------- | ----------------------- |
| CodeQL          | تحليل ثابت للكود (SAST) |
| Dependabot      | تحديث تلقائي للتبعيات   |
| Secret Scanning | فحص commits عن secrets  |

---

## 🎤 مقابلة

1. **"كيف تؤمن مستودع GitHub؟"** → CodeQL + Dependabot + Secret Scanning + branch protection
2. **"ماذا تفعل إذا اكتشفت secret في commit قديم؟"** → تدوير المفتاح فوراً + `git filter-branch` لإزالته

---

[← GitHub Actions Advanced](./02-github-actions-advanced) | [→ CI/CD Pipelines](../../15-cicd/01-cicd-pipelines) | [🏠 الرئيسية](/)
