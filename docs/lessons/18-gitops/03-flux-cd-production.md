---
sidebar_position: 3
title: "Flux CD في الإنتاج"
description: "Flux CD — GitOps with Flux، Helm Controller، Image Automation."
---

# Flux CD في الإنتاج

> "Flux هو GitOps الأصلي لـ Kubernetes. بسيط، قوي، ومباشر."

## 🎯 أهداف التعلم

- تثبيت Flux CD
- Helm Controller
- Image Automation (تحديث تلقائي للصور)
- Flux vs Argo CD

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Advanced

---

## 🏗️ تثبيت Flux

```bash
flux bootstrap github \
  --owner=cloudnova \
  --repository=infra \
  --branch=main \
  --path=./clusters/production
```

### HelmRelease

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2beta1
kind: HelmRelease
metadata:
  name: cloudnova-api
spec:
  interval: 5m
  chart:
    spec:
      chart: ./helm/api
      sourceRef:
        kind: GitRepository
        name: infra
  values:
    replicas: 3
```

### Image Automation

```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: api-policy
spec:
  imageRepositoryRef:
    name: api
  policy:
    semver:
      range: 1.5.x
```

Flux يحدث الصورة تلقائياً عند ظهور نسخة جديدة — ويدفع commit إلى Git!

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

دفع أحدهم Docker image جديدة إلى ACR. Flux اكتشفها، حدث الـ deployment تلقائياً، ودفع commit لتحديث الـ manifest في Git.

**الدرس**: Git هو المصدر الوحيد للحقيقة.

### Flux vs Argo CD

| | Argo CD | Flux |
|---|---------|------|
| **UI** | ✅ ممتاز | ❌ CLI فقط |
| **Image Automation** | ❌ | ✅ مدمج |
| **Push to Git** | ❌ | ✅ |

**التوصية**: Argo CD للـ UI + Flux لـ image automation.

---

## 🛠️ تدريبات

### تمرين: ثبّت Flux على cluster
### تحدي: فعّل image automation لتحديث الصور تلقائياً

---

## 📝 تقييم

### ✅ فحص المعرفة
1. كيف يختلف Flux عن Argo CD؟
2. ما فائدة Image Automation؟
3. لماذا Git هو "المصدر الوحيد للحقيقة"؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| Flux | GitOps operator مع image automation |
| HelmRelease | إدارة Helm عبر Flux |
| ImagePolicy | سياسة تحديث الصور تلقائياً |

---

## 🎤 مقابلة
1. **"Argo CD أم Flux؟"** → كلاهما! Argo CD للـ UI، Flux للـ automation
2. **"كيف تحدث images تلقائياً؟"** → Flux ImagePolicy + ImageRepository

---

[← Argo CD](./02-argo-cd-production) | [→ Platform Engineering](../../19-platform/01-platform-engineering) | [🏠 الرئيسية](/)
