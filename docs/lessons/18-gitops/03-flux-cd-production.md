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
  --path=./clusters/production \
  --personal
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
    image:
      tag: "1.5.2"
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

يقوم Flux بتحديث الصورة تلقائياً عندما تظهر نسخة جديدة!

### Argo CD vs Flux

| | Argo CD | Flux |
|---|---------|------|
| **UI** | ✅ ممتاز | ❌ CLI فقط |
| **Image Automation** | ❌ | ✅ مدمج |
| **Multi-tenancy** | ✅ | متوسط |
| **التثبيت** | سهل | سهل |

---

[← Argo CD](./02-argo-cd-production) | [→ Platform Engineering](../../19-platform/01-platform-engineering) | [🏠 الرئيسية](/)
