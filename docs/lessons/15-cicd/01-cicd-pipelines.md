---
sidebar_position: 1
title: "CI/CD من الصفر"
description: "ابنِ خط أنابيب CI/CD كامل: GitHub Actions، اختبارات آلية، نشر تلقائي، واستراتيجيات النشر."
---

# CI/CD من الصفر

> **"كل دقيقة تقضيها في النشر اليدوي هي دقيقة لا تُحل فيها مشاكل حقيقية. أتمتة كل شيء."**

## ما هو CI/CD؟

| الحرف  | المعنى                         | السؤال الذي يجيب عليه                    |
| ------ | ------------------------------ | ---------------------------------------- |
| **CI** | Continuous Integration         | "هل الكود يشتغل؟" (بناء + اختبار تلقائي) |
| **CD** | Continuous Delivery/Deployment | "كيف نوصله للمستخدمين؟" (نشر تلقائي)     |

## مراحل خط الأنابيب

```mermaid
graph LR
    A[Git Push] --> B[Build]
    B --> C[Test]
    C --> D[Scan]
    D --> E[Deploy Staging]
    E --> F[Test Staging]
    F --> G[Deploy Production]
    G --> H[Monitor]
```

## أول Pipeline على GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run tests
        run: pytest --cov=. --cov-report=xml

      - name: Lint
        run: ruff check .

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v3
        with:
          app-name: cloudnova-api
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
```

## استراتيجيات النشر

| الاستراتيجية   | كيف تعمل                         | متى تستخدم                |
| -------------- | -------------------------------- | ------------------------- |
| **Rolling**    | استبدل النسخ واحدة تلو الأخرى    | النشر العادي              |
| **Blue-Green** | بيئتان — بدّل الحركة فوراً       | تراجع فوري مضمون          |
| **Canary**     | ١٠٪ من المستخدمين للإصدار الجديد | اختبار في الإنتاج الحقيقي |

```yaml
# Kubernetes Rolling Update
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1 # نسخة إضافية أثناء التحديث
    maxUnavailable: 0 # لا تفقد أي نسخة
```

## مبادئ الـ Pipeline الجيد

1. **تغذية راجعة سريعة.** الاختبارات تستغرق دقائق لا ساعات
2. **بنى مرة واحدة.** لا تبنِ لكل بيئة
3. **قابلية التراجع.** كل نشر يمكن عكسه
4. **أمان مدمج.** افحص قبل النشر، لا بعده

## سيناريو CloudNova: Pipeline فاشل في الإنتاج

> **الموقف:** كل شيء يمر في staging. لكن أول نشر إنتاجي — انهيار كامل.

**التحقيق:**

1. الـ staging يستخدم قاعدة بيانات صغيرة (١٠ سجلات). الإنتاج (١٠ ملايين).
2. Migration يستغرق ٤٥ دقيقة. الـ health check يفشل بعد ٣٠ ثانية.
3. Pipeline يتراجع تلقائياً — لكن الـ migration لم يتراجع.

**الدروس:**

```yaml
# أضف timeout أطول
- name: Run migrations
  run: python manage.py migrate
  timeout-minutes: 60   # كان ٥ دقائق فقط

# أضف health check أذكى
readinessProbe:
  httpGet:
    path: /health?deep=true   # فحص عميق — وليس سطحياً
  initialDelaySeconds: 30
  periodSeconds: 15
  failureThreshold: 10        # اسمح بـ ١٠ محاولات
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
