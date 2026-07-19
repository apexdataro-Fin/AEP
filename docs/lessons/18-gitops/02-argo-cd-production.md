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
# Application فردية
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
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "2"  # بعد wave 1
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

حذف أحدهم Deployment بالخطأ. Argo CD اكتشف الـ drift وأعاد إنشائه تلقائياً خلال 3 دقائق (selfHeal).

```bash
argocd app diff cloudnova-api   # معاينة الاختلافات
argocd app sync cloudnova-api    # مزامنة يدوية
argocd app history cloudnova-api # سجل النشر
```

### Health Checks

```yaml
spec:
  syncPolicy:
    automated:
      selfHeal: true
    syncOptions:
    - PruneLast=true          # لا تحذف الموارد القديمة حتى ينتهي النشر
    - CreateNamespace=true
```

---

## 🎨 Argo CD vs Flux

| | Argo CD | Flux |
|---|---------|------|
| **UI** | ✅ ممتاز | ❌ CLI فقط |
| **Image Automation** | ❌ | ✅ مدمج |
| **Multi-tenancy** | ✅ | متوسط |

---

## 🛠️ تدريبات

### تمرين: ثبّت Argo CD على AKS
### تحدي: أنشئ App of Apps لـ 3 تطبيقات وجرب auto-healing

---

## 📝 تقييم

### ✅ فحص المعرفة
1. ما هو App of Apps pattern؟
2. كيف يعمل selfHeal؟
3. متى تستخدم sync waves؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| Argo CD | GitOps operator لـ Kubernetes |
| selfHeal | إصلاح تلقائي للـ drift |
| Sync Wave | ترتيب نشر التطبيقات |

---

## 🎤 مقابلة
1. **"كيف تنشر 30 خدمة مع Argo CD؟"** → App of Apps + sync waves
2. **"ماذا يحدث إذا حذف Deployment يدوياً؟"** → Argo CD يعيد إنشائه (selfHeal)

---

[← GitOps Fundamentals](01-gitops-fundamentals) | [→ Flux CD](03-flux-cd-production) | [🏠 الرئيسية](/)
