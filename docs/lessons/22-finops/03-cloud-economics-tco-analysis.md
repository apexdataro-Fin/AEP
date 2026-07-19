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
on_prem = {
    "servers": 50000,
    "networking": 15000,
    "storage": 20000,
    "power_cooling": 8000,
    "staff": 120000,
    "annual_total": 163000
}
cloud = {
    "compute_monthly": 2000,
    "storage_monthly": 500,
    "networking_monthly": 200,
    "backup_monthly": 300,
    "annual_total": 36000
}
print(f"On-Prem: ${on_prem['annual_total']:,}/year")
print(f"Cloud: ${cloud['annual_total']:,}/year")
print(f"Savings: ${on_prem['annual_total'] - cloud['annual_total']:,}/year")
```

---

## 🏛️ طبقة الإنتاج

### متى السحابة ليست الحل؟

- أحمال ثابتة 24/7 لمدة 5+ سنوات
- بيانات بمتطلبات سيادة صارمة
- تطبيقات legacy لا تدعم virtualization

### سيناريو CloudNova: Business Case للـ CTO

```
التكلفة الحالية (On-Prem): $163,000/سنة
التكلفة المقترحة (Azure): $36,000/سنة
التوفير: $127,000/سنة
ROI: 3 أشهر
```

**تمت الموافقة.**

---

## 🎨 CAPEX vs OPEX للشركات

| الشركة الناشئة | المؤسسة الكبيرة |
|---------------|---------------|
| تفضل OPEX (لا cash upfront) | قد تفضل CAPEX (استهلاك الأصول) |
| مرونة = بقاء | استقرار = أولوية |

---

## 🛠️ تدريبات

### تمرين: احسب TCO لتطبيقك الحالي
### تحدي: اكتب business case من صفحة واحدة للانتقال إلى Azure

---

## 📝 تقييم

### ✅ فحص المعرفة
1. ما الفرق بين CAPEX و OPEX؟
2. كيف تحسب TCO؟
3. متى تكون on-prem أفضل من cloud؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| CAPEX | Capital Expenditure — دفع مقدماً |
| OPEX | Operational Expenditure — دفع شهري |
| TCO | Total Cost of Ownership |

---

## 🎤 مقابلة
1. **"كيف تقنع CFO بالانتقال إلى cloud؟"** → TCO analysis + ROI timeline
2. **"متى تبقى على on-prem؟"** → أحمال ثابتة طويلة الأجل

---

[← Azure Cost Optimization](./02-azure-cost-optimization-deep) | [→ Identity Mastery](../../23-identity/01-identity-mastery) | [🏠 الرئيسية](/)
