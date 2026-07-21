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
```

### Matrix Strategy

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        python-version: ["3.10", "3.11", "3.12"]
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

في GitHub Settings → Environments → production: Required reviewers: 2, Wait timer: 5 min, Deployment branches: main only.

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

قبل reusable workflows: 15 ملف workflow مكرر بـ 3000 سطر. بعدها: ملف template واحد + 15 invocation.

### Composite Actions

```yaml
# .github/actions/terraform-plan/action.yml
name: Terraform Plan
inputs:
  working_directory:
    required: true
runs:
  using: composite
  steps:
    - uses: hashicorp/setup-terraform@v2
    - run: |
        cd ${{ inputs.working_directory }}
        terraform init
        terraform plan
      shell: bash
```

---

## 🛠️ تدريبات

### تمرين: أنشئ reusable workflow للنشر

### تحدي: ابنِ composite action لـ Terraform

---

## 📝 تقييم

### ✅ فحص المعرفة

1. لماذا reusable workflows أفضل من النسخ؟
2. ما فائدة Matrix Strategy؟
3. كيف تمنع النشر للإنتاج بدون مراجعة؟

### 🃏 بطاقات

| السؤال            | الإجابة                                    |
| ----------------- | ------------------------------------------ |
| Reusable Workflow | workflow يُستدعى من workflows أخرى         |
| Matrix            | تشغيل نفس الـ job على إصدارات/أنظمة متعددة |
| Environment       | بيئة معزولة مع approval gates              |

---

## 🎤 مقابلة

1. **"كيف تنظم CI/CD لـ 20 خدمة؟"** → Reusable workflows + Matrix + Environments
2. **"كيف تمنع نشر كود غير مراجع للإنتاج؟"** → Environment protection rules + required reviewers

---

[← GitHub Workflows](./01-github-workflows) | [→ GitHub Security](./03-github-security-codeql-dependabot) | [🏠 الرئيسية](/)
