---
sidebar_position: 2
title: "CI/CD المتقدم"
description: "استراتيجيات النشر: Blue-Green، Canary، Feature Flags، والتراجع الآمن."
---

# CI/CD المتقدم

> **"النشر البسيط سهل. النشر الآمن — هذا هو الفن."**

## استراتيجيات النشر

| الاستراتيجية | كيف تعمل | الأنسب لـ |
|---|---|---|
| **Rolling** | استبدل النسخ واحدة تلو الأخرى | النشر العادي اليومي |
| **Blue-Green** | بيئتان — بدل الحركة فوراً | تراجع فوري مضمون |
| **Canary** | ١٠٪ من المستخدمين للجديد | اختبار حقيقي في الإنتاج |

## Blue-Green Deployment

```yaml
# نشر Blue-Green على Kubernetes
# الخطوة ١: نشر Green (الجديد) بجانب Blue (الحالي)
kubectl apply -f deployment-green.yaml

# الخطوة ٢: اختبر Green
curl https://green.api.cloudnova.com/health

# الخطوة ٣: بدل الحركة
kubectl patch service api-svc -p '{"spec":{"selector":{"version":"green"}}}'

# الخطوة ٤: إذا فشل — أعد selector لـ blue فوراً
```

## Canary Deployment مع Istio

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
spec:
  http:
  - route:
    - destination:
        host: api
        subset: v2
      weight: 10    # ١٠٪ فقط للجديد
    - destination:
        host: api
        subset: v1
      weight: 90
```

## Feature Flags — نشر بدون نشر

```python
if feature_flag("new-checkout"):
    process_new_checkout()
else:
    process_old_checkout()
# الكود منشور للجميع — الميزة مفعلة لـ ٥٪ فقط
```

---

[← الدرس السابق](cicd-pipelines) | [العودة للوحدة](index.md) | [🏠 الرئيسية](/)
