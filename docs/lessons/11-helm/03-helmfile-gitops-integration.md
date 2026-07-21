---
sidebar_position: 3
title: "Helmfile وتكامل GitOps"
description: "Helmfile، Argo CD + Helm، إدارة الإصدارات المتعددة — Helm على نطاق المؤسسة."
---

# Helmfile وتكامل GitOps

> "Helm + Helmfile + GitOps = بيئة إنتاج لا تخذلك أبداً."

## 🎯 أهداف التعلم

- إدارة Charts متعددة مع Helmfile
- تكامل Helm مع Argo CD
- استراتيجيات الترقية (rolling, blue-green)
- إدارة البيئات (dev, staging, production)

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Helmfile

```yaml
# helmfile.yaml
repositories:
  - name: ingress-nginx
    url: https://kubernetes.github.io/ingress-nginx
  - name: cloudnova
    url: https://charts.cloudnova.com

releases:
  - name: ingress-nginx
    namespace: ingress
    chart: ingress-nginx/ingress-nginx
    version: 4.8.0
    values:
      - ./environments/{{ .Environment.Name }}/ingress-values.yaml

  - name: cloudnova-api
    namespace: production
    chart: cloudnova/api
    version: 1.5.0
    values:
      - ./environments/{{ .Environment.Name }}/api-values.yaml

environments:
  dev:
    values:
      - environments/dev/defaults.yaml
  prod:
    values:
      - environments/prod/defaults.yaml
```

```bash
helmfile -e prod apply    # نشر كل شيء في production
helmfile -e prod diff     # معاينة التغييرات قبل النشر
helmfile -e prod lint     # فحص الـ charts
```

### مع Argo CD

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cloudnova-stack
spec:
  source:
    repoURL: https://github.com/cloudnova/infra
    path: helmfile
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

**نشر 12 خدمة معاً**: Helmfile يضمن الترتيب الصحيح:

1. ingress-nginx (أولاً)
2. cert-manager
3. databases
4. APIs
5. frontends

```yaml
# التحكم في ترتيب النشر
releases:
  - name: ingress-nginx
    ...
  - name: databases
    needs: [ingress-nginx]  # انتظر حتى ينتهي ingress-nginx
```

### Rollback سريع

```bash
helmfile -e prod rollback
```

---

## 🎨 Helmfile vs Argo CD

|                    | Helmfile  | Argo CD       |
| ------------------ | --------- | ------------- |
| **التحكم**         | CLI مباشر | GitOps تلقائي |
| **Diff preview**   | ✅        | ✅            |
| **Automatic sync** | ❌        | ✅            |
| **UI**             | ❌        | ✅            |

**الأفضل**: Helmfile للمهام اليدوية + Argo CD للنشر التلقائي.

---

## 🛠️ تدريبات

### تمرين: أنشئ helmfile لـ 3 تطبيقات

### تحدي: اربط helmfile مع Argo CD

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما فائدة `helmfile diff`؟
2. كيف تتحكم في ترتيب النشر؟
3. متى تستخدم Argo CD بدلاً من Helmfile؟

### 🃏 بطاقات

| السؤال          | الإجابة                             |
| --------------- | ----------------------------------- |
| Helmfile        | إدارة عدة Helm releases من ملف واحد |
| `needs`         | انتظر release آخر قبل النشر         |
| `helmfile diff` | معاينة التغييرات قبل تطبيقها        |

---

## 🎤 مقابلة

1. **"كيف تنشر 20 خدمة معاً؟"** → Helmfile + Argo CD
2. **"ماذا تفعل إذا فشل نشر release واحد؟"** → `helmfile apply --skip-needs=false` + rollback

---

[← Chart Best Practices](./02-helm-chart-best-practices) | [→ Terraform Fundamentals](../../12-terraform/01-terraform-fundamentals) | [🏠 الرئيسية](/)
