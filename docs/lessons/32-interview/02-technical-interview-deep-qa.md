---
sidebar_position: 2
title: "المقابلة التقنية المتعمقة"
description: "Technical Interview Deep Q&A — أسئلة وأجوبة Azure, Kubernetes, Terraform."
---

# المقابلة التقنية المتعمقة

> "التحضير الجيد يحول المقابلة من استجواب إلى محادثة."

## 🎯 أهداف التعلم

- أسئلة Azure المتقدمة
- أسئلة Kubernetes
- أسئلة Terraform & IaC
- أسئلة System Design

## ⏱️ الوقت المقدر: 45 دقيقة | المستوى: Advanced

---

## 🏗️ Azure Questions

**س: كيف تصمم High Availability في Azure؟**
- Availability Zones (3 zones)
- Load Balancer + VM Scale Sets
- Azure SQL Geo-Replication
- Front Door للـ global failover
- RTO: < 5 دقائق، RPO: < دقيقة

**س: كيف تؤمن Azure Subscription؟**
- Azure AD + MFA
- Management Groups + Policies
- Network Segmentation + NSG
- Key Vault + Managed Identity
- Sentinel + Defender for Cloud

### Kubernetes Questions

**س: كيف تتعامل مع CrashLoopBackOff؟**
1. `kubectl logs <pod> --previous`
2. `kubectl describe pod` وفحص Events
3. تحقق من ConfigMaps و Secrets
4. تأكد من صحة الـ image

### Terraform Questions

**س: ماذا تفعل لو فسد ملف state؟**
1. استرجع من backup (storage account versioning)
2. `terraform state pull` من backend صحيحة
3. `terraform import` للموارد المفقودة
4. امنع ذلك مستقبلاً: state locking + versioning

---

[← Interview Preparation](./01-interview-preparation) | [→ System Design](./03-system-design-masterclass) | [🏠 الرئيسية](/)
