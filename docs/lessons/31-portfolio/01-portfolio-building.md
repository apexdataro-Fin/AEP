---
sidebar_position: 1
title: "بناء المحفظة الاحترافية"
description: "كيف تبني Portfolio يميزك عن 99% من المتقدمين — مشاريع حقيقية، GitHub، و storytelling."
---

# بناء المحفظة الاحترافية (Portfolio)

> "GitHub هو سيرتك الذاتية في 2026. اجعله يتحدث عنك."

## 🎯 أهداف التعلم

- تصميم Portfolio يحكي قصة نموك
- اختيار المشاريع المناسبة لكل مستوى
- كتابة README مقنعة لكل مشروع
- ربط المشاريع بقصة CloudNova
- عرض المهارات بالأدلة وليس بالكلام

---

## 📖 الطبقة الأساسية: لماذا Portfolio أهم من السيرة الذاتية؟

```
سيرة ذاتية تقول:
"أعرف Kubernetes"
→ أي أحد يستطيع كتابة هذا

Portfolio يقول:
"هذا Kubernetes cluster بنيته لـ CloudNova
مع Argo CD + Prometheus + Istio.
الكود هنا: github.com/yourname/cloudnova-platform"
→ هذا دليل لا يُدحض
```

### هيكل الـ Portfolio

```
github.com/yourname/
├── cloudnova-platform/        ← المشروع الرئيسي
│   ├── terraform/             ← Infrastructure as Code
│   ├── kubernetes/            ← K8s manifests
│   ├── .github/workflows/    ← CI/CD
│   └── README.md             ← Architecture + Diagrams
│
├── cloudnova-monitoring/     ← Observability
│   ├── prometheus/
│   ├── grafana/dashboards/
│   └── alertmanager/
│
├── cloudnova-cli/            ← Automation tool
│   ├── cloudnova/
│   └── README.md
│
└── cloudnova-docs/           ← Documentation
    ├── runbooks/
    └── postmortems/
```

---

## 🧱 الطبقة المهنية: مشاريع لكل مستوى

### Junior Cloud Engineer — 3 مشاريع أساسية

```
المشروع 1: Static Website on Azure
├── GitHub Actions تنشر لـ Azure Storage Static Website
├── Terraform للـ infrastructure
└── يثبت: Git, CI/CD, Azure basics

المشروع 2: Dockerized API
├── Python FastAPI في Docker
├── Docker Compose للتطوير المحلي
├── نشر على Azure App Service
└── يثبت: Docker, Python, App Service

المشروع 3: Infrastructure Monitoring
├── Prometheus + Grafana
├── Node Exporter لـ metrics
├── AlertManager للتنبيهات
└── يثبت: Monitoring, Linux
```

### Cloud Engineer — مشروعان متوسطان

```
المشروع 4: Kubernetes Platform
├── AKS Cluster عبر Terraform
├── Helm Charts للخدمات
├── Argo CD لـ GitOps
├── Istio Service Mesh
└── يثبت: K8s, Helm, GitOps, Service Mesh

المشروع 5: Cloud Cost Optimizer
├── Python tool تفحص الموارد غير المستخدمة
├── CLI interface مع Rich
├── تقرير أسبوعي تلقائي
├── GitHub Actions تشغل الـ tool أسبوعياً
└── يثبت: Python, FinOps, Automation
```

### Senior — مشروع متقدم

```
المشروع 6: CloudNova Platform (المشروع الجامع)
├── كل المشاريع السابقة تتكامل
├── Architecture Diagram (Mermaid/C4)
├── Infrastructure as Code كامل
├── CI/CD لجميع الخدمات
└── Post-mortem لـ incidents حقيقية

هذا المشروع = مقابلة العمل!
```

---

## 🏗️ الطبقة الإنتاجية: README احترافي

### تشريح README ممتاز

````markdown
# CloudNova Platform

[![CI](https://github.com/yourname/cloudnova-platform/actions/workflows/ci.yml/badge.svg)](https://...)
[![Terraform](https://img.shields.io/badge/Terraform-1.7-7B42BC?logo=terraform)](https://...)

> Production-grade cloud platform for CloudNova.
> Built with Azure, Kubernetes, and GitOps.

## 🏗️ Architecture

![Architecture](docs/architecture.png)

## 🚀 Quick Start

```bash
git clone https://github.com/yourname/cloudnova-platform
cd cloudnova-platform/terraform
terraform init && terraform apply
```
````

## 📊 Project Structure

```
├── terraform/     # Infrastructure as Code
├── kubernetes/    # Manifests + Helm Charts
├── .github/       # CI/CD workflows
└── docs/          # Architecture decisions
```

## 🛠️ Tech Stack

| Category       | Technology                    |
| -------------- | ----------------------------- |
| Cloud          | Azure (AKS, App Service, SQL) |
| Infrastructure | Terraform                     |
| Container      | Docker, Kubernetes            |
| CI/CD          | GitHub Actions, Argo CD       |
| Monitoring     | Prometheus, Grafana, Loki     |
| Security       | Trivy, OPA, Azure Key Vault   |

## 📈 Key Achievements

- **99.9% uptime** over 12 months
- **40% cost reduction** via FinOps automation
- **10min deploy** vs 4 hours (manual)
- **0 critical incidents** in last 6 months

## 🧠 What I Learned

- GitOps is transformative for platform teams
- Observability is not optional in production
- FinOps must be part of architecture, not afterthought

## 📝 Blog Posts

- [How We Reduced Cloud Costs by 40%](link)
- [GitOps at CloudNova: Lessons Learned](link)

````

---

## 🎨 الطبقة المعمارية: Mermaid Diagrams

### C4 Architecture Diagram

```mermaid
C4Context
  title System Context for CloudNova Platform

  Person(user, "User", "CloudNova customer")
  System(platform, "CloudNova Platform", "Core platform")
  System_Ext(payment, "Payment Gateway", "Stripe")
  System_Ext(email, "Email Service", "SendGrid")

  Rel(user, platform, "Uses")
  Rel(platform, payment, "Processes payments via")
  Rel(platform, email, "Sends notifications via")
````

---

## 🏥 سيناريو CloudNova: بناء Portfolio

```
📋 الخطة: Portfolio Development Sprint

الأسبوع 1: تنظيف GitHub
├── حذف repositories غير المكتملة
├── تثبيت أفضل 4 مشاريع (Pinned)
└── Profile README احترافي

الأسبوع 2: CloudNova Platform
├── Architecture diagram (Mermaid)
├── Terraform code
└── README شامل

الأسبوع 3: Automation + CI/CD
├── CloudNova CLI (Python tool)
├── GitHub Actions workflows
└── Tests + badges

الأسبوع 4: Documentation
├── Runbooks
├── Post-mortem لـ 3 حوادث
└── Blog post: "My Cloud Engineering Journey"

النتيجة النهائية:
✅ Portfolio يحكي قصة نمو مهندس سحابة
✅ 4 مشاريع منظمة واحترافية
✅ أدلة على المهارات — ليس مجرد كلام
```

---

## ⚡ الإنتاج وما بعده

### قائمة تدقيق الـ Portfolio

```
□ هل أفضل 4 مشاريع Pinned؟
□ هل كل مشروع له README واضح يحتوي:
  □ وصف (ماذا يفعل؟)
  □ Quick Start (كيف تشغله؟)
  □ Architecture Diagram
  □ Tech Stack
  □ Screenshots
□ هل الكود نظيف ومنظم؟
□ هل هناك Tests؟
□ هل الـ CI/CD يعمل (badge خضراء)؟
□ هل GitHub Profile مكتمل (صورة، bio، links)؟
```

---

## 🧠 التذكّر النشط

1. لماذا Portfolio أهم من السيرة الذاتية لمهندس السحابة؟
2. ما الفرق بين مشروع Junior و Senior؟
3. كيف تكتب README يجذب الانتباه؟
4. كم مشروعاً يجب أن يكون Pinned في GitHub؟
5. كيف تروي قصة نموك عبر المشاريع؟

## 📝 بطاقات تعليمية

- **Pinned Repos**: أول 6 مشاريع تظهر في GitHub Profile
- **README.md**: واجهة مشروعك — أول ما يراه الزائر
- **Architecture Diagram**: رسم يوضح مكونات النظام وعلاقاتها
- **CI/CD Badge**: شارة خضراء = الكود يبني وينشر بنجاح
- **Post-mortem**: تحليل حادثة إنتاجية للتعلم منها

## 🎤 أسئلة المقابلة

1. **"أرني مشروعك المفضل على GitHub"**
   - اختر مشروعاً معقداً يظهر مهاراتك
   - اشرح: المشكلة ← الحل ← النتيجة ← الدرس
   - كن مستعداً للحديث عن تفاصيل تقنية

2. **"كيف تصمم README لمشروع؟"**
   - Quick Start أولاً (أهم شيء!)
   - Architecture diagram ثانياً
   - Tech stack + Achievements
   - What I Learned (قصة شخصية)

3. **"ما الفرق بين مشروع toy ومشروع production؟"**
   - Production: Tests, CI/CD, Monitoring, Documentation
   - Toy: يعمل على جهازك فقط
   - اجعل مشروعك production-grade!

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
