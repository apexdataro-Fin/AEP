---
sidebar_position: 1
title: "هندسة المنصات"
description: "بناء منصة داخلية للمطورين: Backstage، IDP، الخدمة الذاتية، والمعايير الذهبية."
---

# هندسة المنصات (Platform Engineering)

> "لا تعطِ المطورين أدوات مبعثرة. ابنِ لهم منصة واحدة تحتوي كل ما يحتاجونه."

## 🎯 أهداف التعلم

- فهم نموذج Internal Developer Platform (IDP)
- بناء بوابة خدمة ذاتية مع Backstage
- تصميم Golden Paths للمطورين
- قياس نجاح المنصة (DORA metrics)
- تطبيق Platform as a Product

---

## 📖 الطبقة الأساسية: لماذا هندسة المنصات؟

### تطور DevOps إلى Platform Engineering

```
DevOps التقليدي:
"كل فريق يدير كل شيء"
→ كل فريق يخترع عجلته الخاصة
→ 10 فرق = 10 طرق مختلفة للنشر

Platform Engineering:
"المنصة توفر كل شيء جاهز"
→ المنصة توفر Golden Paths
→ الفرق تختار المسار المناسب
→ 10 فرق = طريق واحد موحد للنشر
```

### مكونات المنصة الداخلية

```
Internal Developer Platform (IDP):
┌────────────────────────────────────────────────────┐
│                  Developer Portal                  │
│         (Backstage / Port / custom)                │
├────────────────────────────────────────────────────┤
│  Scaffolding │ CI/CD │ Monitoring │ Secrets │ Docs │
├────────────────────────────────────────────────────┤
│  Kubernetes │ Terraform │ Helm │ Argo CD │ Vault  │
├────────────────────────────────────────────────────┤
│              Cloud Infrastructure                  │
│        (Azure / AWS / GCP)                        │
└────────────────────────────────────────────────────┘
```

---

## 🧱 الطبقة المهنية: بناء منصة مع Backstage

### Backstage — مدخل المطور

```yaml
# catalog-info.yaml — تعريف خدمة في Backstage
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: cloudnova-api
  description: CloudNova Core API Service
  annotations:
    github.com/project-slug: cloudnova/api
    backstage.io/techdocs-ref: dir:.
  tags:
    - python
    - fastapi
    - microservice
  links:
    - url: https://api.cloudnova.com/docs
      title: API Documentation
      icon: docs
spec:
  type: service
  lifecycle: production
  owner: platform-team
  system: cloudnova-core
  providesApis:
    - cloudnova-api
  dependsOn:
    - resource:postgres-db
    - resource:redis-cache
```

### Software Templates — الخدمة الذاتية

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: python-microservice
  title: Python Microservice
  description: قالب لإنشاء خدمة Python مع Docker + K8s + CI/CD
spec:
  owner: platform-team
  type: service
  parameters:
    - title: معلومات الخدمة
      required:
        - name
        - owner
      properties:
        name:
          title: اسم الخدمة
          type: string
          pattern: "^[a-z][a-z0-9-]*$"
        description:
          title: وصف الخدمة
          type: string
        port:
          title: المنفذ
          type: number
          default: 8080

  steps:
    - id: fetch-base
      name: Fetch Base
      action: fetch:template
      input:
        url: https://github.com/cloudnova/templates/python-service
        values:
          name: ${{ parameters.name }}
          description: ${{ parameters.description }}

    - id: publish
      name: Publish to GitHub
      action: publish:github
      input:
        repoUrl: github.com?owner=cloudnova&repo=${{ parameters.name }}

    - id: register
      name: Register in Catalog
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps.publish.output.repoContentsUrl }}
```

---

## 🏗️ الطبقة الإنتاجية: Golden Paths

### ما هو Golden Path؟

```
المطور يريد إنشاء خدمة جديدة:

المسار الذهبي (Golden Path):
1. يفتح Backstage
2. يختار "Create New Service"
3. يملأ نموذج (اسم، لغة، نوع)
4. يضغط "Create"
5. يحصل على:
   ✅ Repository جاهز
   ✅ CI/CD pipeline
   ✅ Docker + K8s manifests
   ✅ Monitoring dashboards
   ✅ Secrets management
   ✅ Documentation scaffold
```

### هيكل الـ Golden Path

```
templates/
├── python-service/
│   ├── template.yaml
│   ├── skeleton/
│   │   ├── Dockerfile
│   │   ├── k8s/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── kustomization.yaml
│   │   ├── .github/
│   │   │   └── workflows/
│   │   │       ├── ci.yaml
│   │   │       └── cd.yaml
│   │   ├── terraform/
│   │   │   └── main.tf
│   │   ├── .pre-commit-config.yaml
│   │   └── README.md
│   └── docs/
│       └── index.md
├── go-service/
│   └── ...
└── static-website/
    └── ...
```

---

## 🎨 الطبقة المعمارية: قياس نجاح المنصة

### DORA Metrics

| المقياس                   | الهدف (Elite)   | كيف نقيسه                     |
| ------------------------- | --------------- | ----------------------------- |
| **Deployment Frequency**  | عدة مرات يومياً | عدد deployments في Argo CD    |
| **Lead Time for Changes** | أقل من ساعة     | من commit إلى production      |
| **Change Failure Rate**   | 0-15%           | نسبة deployments المرتجعة     |
| **Time to Restore**       | أقل من ساعة     | من اكتشاف الحادثة إلى الإصلاح |

### لوحة قياس المنصة

```sql
-- قياس اعتماد المنصة
SELECT
  COUNT(DISTINCT repo) as services_using_platform,
  COUNT(DISTINCT team) as teams_onboarded,
  AVG(deploy_frequency_days) as avg_deploy_frequency
FROM platform_metrics
WHERE month = '2026-07';

-- قياس رضا المطورين
SELECT
  AVG(nps_score) as developer_nps,
  AVG(time_to_first_deploy_hours) as time_to_hello_world
FROM developer_survey
WHERE quarter = '2026-Q2';
```

---

## 🏥 سيناريو CloudNova: بناء المنصة

```
📋 التذكرة: HYD-1450
النوع: مبادرة منصة
الأولوية: عالية

المهمة:
CloudNova نمت من 3 خدمات إلى 47 خدمة.
الفرق تعاني من:
- كل فريق ينشر بطريقة مختلفة
- لا أحد يعرف من يملك أي خدمة
- 3 أسابيع لإنشاء خدمة جديدة من الصفر

الحل — بناء IDP:

المرحلة 1: Service Catalog
├── حصر جميع الخدمات
├── تعريف المالكين
└── Backstage catalog-info.yaml لكل خدمة

المرحلة 2: Golden Paths
├── قالب Python service
├── قالب Go service
├── قالب static website
└── CI/CD تلقائي لكل قالب

المرحلة 3: Developer Portal
├── TechDocs (توثيق تلقائي)
├── Scorecards (جودة الخدمات)
└── Plugins (Kubernetes, Argo CD, PagerDuty)

النتيجة بعد 3 أشهر:
✅ إنشاء خدمة جديدة: من 3 أسابيع إلى 4 ساعات
✅ وقت النشر: من ساعتين إلى 10 دقائق
✅ Developer NPS: من 12 إلى 67
```

---

## ⚡ الإنتاج وما بعده

### Platform as a Product

```
عامل المنصة كمنتج:

1. المستخدمون = المطورون
2. المنتج = المنصة
3. الميزات = Golden Paths + أدوات
4. القياس = DORA metrics + NPS
5. التحسين = حلقات تغذية راجعة مستمرة

مبادئ أساسية:
- لا تفرض، بل أقنع
- لا تبني ما لا يحتاجه أحد
- اجعل الطريق السهل هو الطريق الصحيح
- المنصة ليست مشروعاً، بل منتج مستمر
```

---

## 🧠 التذكّر النشط

1. ما الفرق بين DevOps و Platform Engineering؟
2. كيف تصمم Golden Path لا يحتاج المطور لقراءة توثيق؟
3. ما هي DORA Metrics الأربعة؟
4. كيف تقيس نجاح منصتك الداخلية؟
5. لماذا نعامل المنصة كمنتج وليس كمشروع؟

## 📝 بطاقات تعليمية

- **IDP**: Internal Developer Platform — منصة داخلية توحد تجربة المطورين
- **Golden Path**: مسار موصى به ومدعوم لتنفيذ مهمة (مثل إنشاء خدمة جديدة)
- **Scaffolding**: إنشاء مشروع جديد من قالب جاهز تلقائياً
- **Backstage**: إطار عمل مفتوح المصدر لبناء Developer Portals
- **Service Catalog**: سجل مركزي بكل الخدمات ومالكيها واعتمادياتها

## 🎤 أسئلة المقابلة

1. **"متى تحتاج المؤسسة لـ Platform Engineering؟"**
   - عندما يصبح عدد الفرق > 5
   - عندما تختلف طرق النشر بين الفرق
   - عندما cognitive load على المطورين مرتفع جداً
   - عندما تريد توحيد المعايير دون فرضها

2. **"كيف تقنع الإدارة بالاستثمار في منصة داخلية؟"**
   - احسب الوقت الضائع في المهام المتكررة
   - قارن تكلفة المنصة بتوفير الوقت
   - ابدأ صغيراً وأظهر النتائج
   - اعرض DORA metrics قبل وبعد

3. **"ما الفرق بين Backstage و Port و custom portal؟"**
   - Backstage: مفتوح المصدر، مجتمع كبير، إعداد معقد
   - Port: SaaS، سهل البدء، أقل مرونة
   - Custom: تحكم كامل، تكلفة بناء عالية

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
