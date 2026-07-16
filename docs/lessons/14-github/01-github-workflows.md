---
sidebar_position: 1
title: "سير عمل GitHub"
description: "GitHub Actions، الحماية المتقدمة للفروع، CODEOWNERS، وإدارة المشاريع الاحترافية."
---

# سير عمل GitHub الاحترافي

> "GitHub ليس مجرد Git عن بعد. إنه منصة التعاون الهندسي الكاملة."

## 🎯 أهداف التعلم

- إتقان GitHub Actions من الصفر للإنتاج
- حماية الفروع ومنع الدمج بدون مراجعة
- إدارة المشاريع الكبيرة مع CODEOWNERS
- استخدامGitHub Packages و Container Registry
- أتمتة كل شيء من Issues إلى Releases

---

## 📖 الطبقة الأساسية: GitHub Actions

### تشريح Workflow

```yaml
name: CI Pipeline # اسم الـ workflow

on: # المحفّزات
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 6 * * 1" # كل اثنين

env: # متغيرات بيئة
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs: # الوظائف
  build: # اسم الوظيفة
    runs-on: ubuntu-latest # نظام التشغيل
    strategy: # مصفوفة
      matrix:
        python-version: ["3.11", "3.12"]

    steps: # الخطوات
      - uses: actions/checkout@v4 # استنساخ الكود

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run tests
        run: pytest --junitxml=results.xml

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.python-version }}
          path: results.xml
```

### Reusable Workflows

```yaml
# .github/workflows/_deploy.yml
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
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      - run: |
          terraform init
          terraform apply -auto-approve \
            -var="environment=${{ inputs.environment }}"

# استخدام reusable workflow:
# .github/workflows/deploy-prod.yml
jobs:
  deploy:
    uses: ./.github/workflows/_deploy.yml
    with:
      environment: production
    secrets:
      AZURE_CREDENTIALS: ${{ secrets.AZURE_PROD_CREDS }}
```

---

## 🧱 الطبقة المهنية: حماية الفروع

### Branch Protection Rules

```yaml
# إعدادات الحماية: Settings > Branches > Add Rule

Branch: main

□ Require a pull request before merging
  □ Require approvals: 2
  □ Dismiss stale reviews

□ Require status checks to pass
  □ build (3.11)
  □ build (3.12)
  □ lint
  □ security-sast
  □ security-sca

□ Require conversation resolution

□ Require branches to be up to date

□ Require signed commits

□ Do not allow bypassing
```

### CODEOWNERS

```
# CODEOWNERS — من يجب أن يراجع ماذا

# الإعدادات العامة (الفريق الأساسي)
* @cloudnova/core-team

# Terraform (فريق البنية التحتية)
/terraform/ @cloudnova/platform-team
*.tf @cloudnova/platform-team

# Kubernetes
/kubernetes/ @cloudnova/platform-team
*.yaml @cloudnova/platform-team

# Security (فريق الأمان + مراجعة إلزامية)
/.github/workflows/security* @cloudnova/security-team
/.zap/ @cloudnova/security-team

# Documentation
/docs/ @cloudnova/tech-writers

# Database migrations
**/migrations/ @cloudnova/dba-team
```

---

## 🏗️ الطبقة الإنتاجية: GitHub Container Registry

```yaml
name: Build and Publish Container

on:
  push:
    tags:
      - "v*"

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=semver,pattern={{version}}
            type=sha,prefix=,format=short
            type=raw,value=latest

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 🎨 الطبقة المعمارية: Dependabot + Renovate

```yaml
# .github/dependabot.yml
version: 2
updates:
  # Python
  - package-ecosystem: pip
    directory: /
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 10
    reviewers:
      - "cloudnova/platform-team"
    labels:
      - dependencies
      - python

  # Docker
  - package-ecosystem: docker
    directory: /
    schedule:
      interval: daily
    labels:
      - dependencies
      - docker

  # GitHub Actions
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
    labels:
      - dependencies
      - ci
```

---

## 🏥 سيناريو CloudNova: إدارة حادثة في GitHub

```
📋 الحادثة: Bug في الإنتاج

1. إنشاء Issue:
   ├── العنوان: "Memory leak in API v2.1.0"
   ├── Labels: bug, P1, production
   ├── Assignee: @ahmed (on-call engineer)
   └── Project: CloudNova Sprint 26

2. إنشاء Branch:
   git checkout -b fix/memory-leak-api

3. إصلاح + Commit:
   git commit -m "fix: resolve memory leak in connection pool

   - Close idle connections after 300s
   - Add connection pool metrics
   - Fixes #456"

4. فتح PR:
   ├── وصف مفصل مع screenshots
   ├── Linked Issue: #456
   ├── Reviewers: @platform-team
   └── Checks: ✅ build ✅ tests ✅ security

5. مراجعة:
   ├── @sarah reviews code
   ├── @omar approves (CODEOWNERS)
   └── ✅ 2 approvals

6. دمج:
   ├── Squash & Merge
   └── Auto-delete branch

7. ✅ Issue #456 يُغلق تلقائياً
8. 🏷️ Release v2.1.1 يُنشأ تلقائياً
```

---

## ⚡ الإنتاج وما بعده

### أفضل ممارسات GitHub

| الممارسة                 | التنفيذ                                |
| ------------------------ | -------------------------------------- |
| **Conventional Commits** | `feat:`, `fix:`, `docs:`, `chore:`     |
| **PR Templates**         | `.github/PULL_REQUEST_TEMPLATE.md`     |
| **Issue Templates**      | `.github/ISSUE_TEMPLATE/bug_report.md` |
| **Protected Branches**   | main + production branches             |
| **CODEOWNERS**           | مراجعة إلزامية من الفريق المناسب       |
| **Secret Scanning**      | تفعيل push protection                  |
| **Actions Permissions**  | تقييد الأذونات (ليس `write-all`)       |

---

## 🧠 التذكّر النشط

1. ما الفرق بين `GITHUB_TOKEN` و Personal Access Token؟
2. كيف تحمي فرع main من الدمج المباشر؟
3. متى تستخدم reusable workflows؟
4. كيف يدير Dependabot تحديثات الاعتماديات تلقائياً؟
5. ما فائدة CODEOWNERS في المشاريع الكبيرة؟

## 📝 بطاقات تعليمية

- **Actions**: نظام CI/CD مدمج في GitHub
- **Runner**: الخادم الذي ينفذ الـ workflow
- **Artifact**: ملفات ناتجة من workflow (مثل: نتائج الاختبارات)
- **Environment**: بيئة نشر مع أسرار وحماية خاصة
- **Matrix**: تشغيل نفس الوظيفة بإعدادات متعددة (مثلاً: Python 3.11 و 3.12)

## 🎤 أسئلة المقابلة

1. **"كيف تفرض مراجعة الكود قبل الدمج؟"**
   - Branch protection rules
   - CODEOWNERS
   - Status checks
   - Required approvals (2 على الأقل)

2. **"كيف تدير الأسرار في GitHub Actions؟"**
   - Repository/Environment secrets
   - OIDC للتواصل مع Azure/AWS (بدون secrets)
   - Secret scanning لمنع التسريب
   - لا hardcoded secrets أبداً

3. **"ما الفرق بين GitHub Actions و Jenkins؟"**
   - Actions: مدمج، YAML، hosted runners، أبسط
   - Jenkins: مستقل، Groovy، self-hosted، أقدم وأكثر مرونة

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
