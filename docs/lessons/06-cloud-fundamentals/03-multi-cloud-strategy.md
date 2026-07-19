---
sidebar_position: 3
title: "استراتيجية السحابة المتعددة"
description: "Multi-Cloud، Hybrid Cloud — متى تستخدم أكثر من مزود؟ AWS، Azure، GCP معاً."
---

# استراتيجية السحابة المتعددة

> "لا تضع كل بيضك في سلة واحدة — ولا توزعها على 10 سلال بدون سبب."

## 🎯 أهداف التعلم

- فهم دوافع Multi-Cloud و Hybrid Cloud
- مقارنة AWS vs Azure vs GCP
- استراتيجيات تجنب Vendor Lock-in
- تصميم Hybrid Cloud مع Azure Arc

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

---

## 🏗️ AWS vs Azure vs GCP — مقارنة سريعة

| الخدمة | AWS | Azure | GCP |
|--------|-----|-------|-----|
| Compute | EC2 | Virtual Machines | Compute Engine |
| Kubernetes | EKS | AKS | GKE |
| Serverless | Lambda | Functions | Cloud Functions |
| CDN | CloudFront | Front Door | Cloud CDN |
| Database | RDS | SQL Database | Cloud SQL |
| AI/ML | SageMaker | AI Services | Vertex AI |

---

## 🧠 متى Multi-Cloud؟

### أسباب حقيقية:
1. **Resilience**: إذا تعطل Azure بالكامل (نادر لكن وارد)
2. **Regulatory**: بعض الدول تلزم بيانات معينة أن تكون في مزود محلي
3. **M&A**: استحوذت على شركة تستخدم AWS ولا تريد الترحيل فوراً
4. **Best-of-Breed**: GKE أفضل لـ Kubernetes، Azure أفضل لـ .NET

### أسباب سيئة:
- "كل المنافسين يستخدمون Multi-Cloud" ← ليس سبباً
- خوف غير مبرر من Vendor Lock-in

---

## 🏛️ Azure Arc — Hybrid & Multi-Cloud

```bash
# توصيل Kubernetes cluster خارج Azure بـ Azure Arc
az connectedk8s connect \
  --name onprem-cluster \
  --resource-group cloudnova-hybrid \
  --location westeurope

# الآن يمكنك إدارة هذا الكلاستر من Azure Portal
# ونشر Azure Policy عليه
```

---

## 🛠️ تدريب

اكتب مقارنة من صفحة واحدة: متى تستخدم AWS ومتى Azure ومتى GCP لكل سيناريو:
- شركة ناشئة في الرياض
- بنك أوروبي قديم
- تطبيق AI عالمي

---

[← Cloud Service Models](./02-cloud-service-models-deep) | [→ Azure Fundamentals](../../07-azure-core/01-azure-fundamentals) | [🏠 الرئيسية](/)
