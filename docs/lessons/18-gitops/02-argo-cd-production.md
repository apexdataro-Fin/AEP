---
sidebar_position: 2
title: "Argo CD في الإنتاج"
description: "Argo CD — النشر المستمر مع GitOps، App of Apps، Sync Policies."
---

# Argo CD في الإنتاج

> "GitOps بدون Argo CD مثل سيارة بدون محرك."

## 🎯 أهداف التعلم

- تثبيت وتكوين Argo CD
- App of Apps Pattern
- Sync Policies و Auto-Healing
- إدارة البيئات المتعددة

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Advanced

---

## 🏗️ App of Apps Pattern

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/cloudnova/infra
    path: argocd/apps
  destination:
    server: https://kubernetes.default.svc
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

```yaml
# argocd/apps/api-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cloudnova-api
spec:
  source:
    repoURL: https://github.com/cloudnova/infra
    path: helm/api
    targetRevision: main
  destination:
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true  # إصلاح تلقائي
```

### Sync Waves

```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "1"  # ينشر أولاً
---
# Wave 2: ينشر بعد wave 1
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "2"
```

---

## 🛠️ تدريب

1. ثبّت Argo CD على AKS
2. أنشئ App of Apps لـ 3 تطبيقات
3. جرب auto-healing بحذف deployment يدوياً

---

[← GitOps Fundamentals](01-gitops-fundamentals) | [→ Flux CD](03-flux-cd-production) | [🏠 الرئيسية](/)
