---
sidebar_position: 3
title: "Backstage Developer Portal"
description: "Backstage by Spotify — Developer Portal، Service Catalog، TechDocs."
---

# Backstage Developer Portal

> "Backstage هو Spotify for Developers. مكان واحد لكل شيء."

## 🎯 أهداف التعلم

- فهم Backstage architecture
- Service Catalog
- Software Templates (scaffolding)
- TechDocs

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Backstage Components

```yaml
# catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: cloudnova-api
  description: CloudNova REST API
  annotations:
    github.com/project-slug: cloudnova/api
    backstage.io/techdocs-ref: dir:.
spec:
  type: service
  lifecycle: production
  owner: platform-team
  providesApis:
    - cloudnova-api
```

### Software Template

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: nodejs-service
spec:
  parameters:
    - title: Service Details
      properties:
        name: { type: string }
        description: { type: string }
  steps:
    - id: fetch-base
      action: fetch:template
    - id: publish
      action: publish:github
      input:
        repoUrl: github.com?owner=cloudnova&repo={{ parameters.name }}
    - id: register
      action: catalog:register
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

قبل Backstage: المطورون يسألون "أين API docs؟ من يملك هذه الخدمة؟ كيف أنشر خدمة جديدة؟"

بعد Backstage: Service Catalog يجيب على كل الأسئلة. Software Template ينشئ خدمة جديدة في 3 دقائق.

### Backstage Plugins

| Plugin | الفائدة |
|--------|---------|
| **GitHub** | ربط الـ repos بـ catalog |
| **Kubernetes** | عرض pods, deployments |
| **PagerDuty** | عرض on-call schedule |
| **TechDocs** | وثائق لكل خدمة |

---

## 🛠️ تدريبات

### تمرين: أنشئ catalog-info.yaml لخدمتك
### تحدي: ابنِ Software Template لـ Node.js service

---

## 📝 تقييم

### ✅ فحص المعرفة
1. ما فائدة Service Catalog؟
2. كيف يختصر Software Template وقت الـ onboarding؟
3. ما هو TechDocs؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| Backstage | Developer Portal من Spotify |
| Service Catalog | سجل مركزي لكل الخدمات |
| Software Template | قالب لإنشاء خدمات جديدة تلقائياً |

---

## 🎤 مقابلة
1. **"لماذا Backstage وليس confluence pages؟"** → Backstage متصل بالـ code حي ومحدث تلقائياً
2. **"كيف تقيس نجاح Backstage؟"** → Time to 10th PR, Developer NPS, onboarding time

---

[← Internal Developer Platform](./02-internal-developer-platform) | [→ Monitoring](../../20-monitoring/01-monitoring-fundamentals) | [🏠 الرئيسية](/)
