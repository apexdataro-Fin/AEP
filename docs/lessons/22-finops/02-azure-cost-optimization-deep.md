---
sidebar_position: 2
title: "تحسين تكلفة Azure"
description: "Azure Cost Optimization — Reserved Instances، Savings Plans، Right-sizing، Spot VMs."
---

# تحسين تكلفة Azure

> "فاتورة Azure لا تنخفض بالتمني. تنخفض بالهندسة."

## 🎯 أهداف التعلم

- Reserved Instances و Savings Plans
- Right-sizing التلقائي
- Spot VMs للأحمال غير الحرجة
- Auto-shutdown للبيئات غير الإنتاجية

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ استراتيجيات التوفير

| الاستراتيجية             | التوفير | التعقيد |
| ------------------------ | ------- | ------- |
| **Reserved Instances**   | 72%     | منخفض   |
| **Savings Plans**        | 65%     | منخفض   |
| **Spot VMs**             | 90%     | عالي    |
| **Auto-shutdown**        | 60%     | منخفض   |
| **Right-sizing**         | 30%     | متوسط   |
| **Azure Hybrid Benefit** | 40%     | منخفض   |

### Reserved Instances

```bash
az reservations reservation purchase \
  --reservation-order-id "cloudnova-ri-2026" \
  --applied-scope-type "Single" \
  --billing-scope "/subscriptions/xxx" \
  --reserved-resource-type "VirtualMachines" \
  --sku "Standard_D2s_v3" \
  --quantity 5 \
  --term "P3Y"
# التوفير: 72%!
```

### Auto-Shutdown

```bash
az vm auto-shutdown \
  --resource-group cloudnova-dev \
  --name dev-server-01 \
  --time 1900 \
  --timezone "Asia/Riyadh"
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

**فاتورة $15,000 الشهر الماضي.** التحقيق:

1. 3 VMs `Standard_D8s_v3` تستخدم 15% CPU فقط → Right-size إلى `D2s_v3`: توفير $600/شهر
2. Dev environment تعمل 24/7 → Auto-shutdown: توفير $400/شهر
3. اشترِ Reserved Instances لـ 5 VMs إنتاج: توفير $2000/شهر

**الإجمالي**: من $15,000 إلى $12,000!

### Azure Advisor

```bash
az advisor recommendation list --query "[?category=='Cost']" -o table
```

---

## 🎨 Reserved vs Savings Plans

|             | Reserved Instances | Savings Plans |
| ----------- | ------------------ | ------------- |
| **المرونة** | VM محدد            | أي compute    |
| **التوفير** | حتى 72%            | حتى 65%       |
| **الإلغاء** | محدود              | لا يمكن       |

---

## 🛠️ تدريبات

### تمرين: شغّل Azure Advisor وطبق توصياته

### تحدي: احسب توفير 6 أشهر من right-sizing

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما الفرق بين Reserved Instances و Savings Plans؟
2. متى تستخدم Spot VMs؟
3. كيف تخفض فاتورة التطوير؟

### 🃏 بطاقات

| السؤال            | الإجابة                              |
| ----------------- | ------------------------------------ |
| Reserved Instance | شراء VM لمدة 1-3 سنوات بتخفيض        |
| Spot VM           | VM بتخفيض 90% لكن Azure قد يستردها   |
| Right-sizing      | تغيير حجم VM ليناسب الاستخدام الفعلي |

---

## 🎤 مقابلة

1. **"كيف خفضت فاتورة Azure في شركتك؟"** → RI + Right-sizing + Auto-shutdown + Spot
2. **"Reserved Instances vs Savings Plans؟"** → RI لـ VM محدد. SP لأي compute

---

[← FinOps Fundamentals](./01-finops-fundamentals) | [→ Cloud Economics](./03-cloud-economics-tco-analysis) | [🏠 الرئيسية](/)
