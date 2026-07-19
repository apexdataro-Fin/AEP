---
sidebar_position: 3
title: "اقتصاديات السحابة"
description: "Cloud Economics — TCO Analysis، ROI، CAPEX vs OPEX."
---

# اقتصاديات السحابة

> "السحابة ليست دائماً أرخص. لكنها دائماً أكثر مرونة."

## 🎯 أهداف التعلم

- حساب TCO (Total Cost of Ownership)
- CAPEX vs OPEX
- Business Case للانتقال إلى السحابة
- قياس ROI

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🏗️ CAPEX vs OPEX

| | On-Prem (CAPEX) | Cloud (OPEX) |
|---|----------------|-------------|
| **الدفع** | مقدماً | شهرياً |
| **التوسع** | شراء أجهزة | نقرة زر |
| **الصيانة** | فريق كامل | مزود السحابة |
| **المخاطر** | أجهلة معطلة | فاتورة غير متوقعة |

### TCO Calculator

```python
# تبسيط حساب TCO
on_prem = {
    "servers": 50000,      # 5 servers x $10K
    "networking": 15000,
    "storage": 20000,
    "power_cooling": 8000, # سنوياً
    "staff": 120000,       # سنوياً
    "annual_total": 163000
}

cloud = {
    "compute_monthly": 2000,
    "storage_monthly": 500,
    "networking_monthly": 200,
    "backup_monthly": 300,
    "annual_total": 36000  # 3000 * 12
}

print(f"On-Prem: ${on_prem['annual_total']:,}/year")
print(f"Cloud:   ${cloud['annual_total']:,}/year")
print(f"Savings: ${on_prem['annual_total'] - cloud['annual_total']:,}/year")
```

### متى السحابة ليست الحل؟

- أحمال ثابتة 24/7 لمدة 5+ سنوات (اشترِ أجهزة)
- بيانات بمتطلبات سيادة صارمة
- تطبيقات legacy لا تدعم virtualization

---

[← Azure Cost Optimization](./02-azure-cost-optimization-deep) | [→ Identity Mastery](../../23-identity/01-identity-mastery) | [🏠 الرئيسية](/)
