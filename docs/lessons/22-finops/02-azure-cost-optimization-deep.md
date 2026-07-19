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

| الاستراتيجية | التوفير | التعقيد |
|-------------|---------|---------|
| **Reserved Instances** | 72% | منخفض |
| **Savings Plans** | 65% | منخفض |
| **Spot VMs** | 90% | عالي |
| **Auto-shutdown** | 60% | منخفض |
| **Right-sizing** | 30% | متوسط |
| **Azure Hybrid Benefit** | 40% | منخفض |

### Reserved Instances

```bash
# شراء RI لمدة 3 سنوات
az reservations reservation purchase \
  --reservation-order-id "cloudnova-ri-2026" \
  --applied-scope-type "Single" \
  --billing-scope "/subscriptions/xxx" \
  --reserved-resource-type "VirtualMachines" \
  --sku "Standard_D2s_v3" \
  --quantity 5 \
  --term "P3Y"
# التوفير: 72% مقارنة بـ pay-as-you-go!
```

### Auto-Shutdown

```bash
az vm auto-shutdown \
  --resource-group cloudnova-dev \
  --name dev-server-01 \
  --time 1900 \
  --timezone "Asia/Riyadh"
```

### Spot VMs

```bash
az vm create \
  --name batch-processor \
  --priority Spot \
  --max-price -1 \
  --eviction-policy Deallocate
# التوفير: حتى 90%
# لكن: Azure قد يسترد الـ VM في أي وقت!
```

---

[← FinOps Fundamentals](./01-finops-fundamentals) | [→ Cloud Economics](./03-cloud-economics-tco-analysis) | [🏠 الرئيسية](/)
