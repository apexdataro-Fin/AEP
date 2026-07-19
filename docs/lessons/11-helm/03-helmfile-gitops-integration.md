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

  - name: cloudnova-frontend
    namespace: production
    chart: cloudnova/frontend
    version: 2.1.0

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
helmfile -e prod diff     # معاينة التغييرات
helmfile -e prod destroy  # حذف كل شيء
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
```

---

## 🛠️ تدريب

1. أنشئ `helmfile.yaml` يدير 3 إصدارات (frontend, api, database)
2. اربطه بـ Argo CD للنشر التلقائي

---

[← Chart Best Practices](./02-helm-chart-best-practices) | [→ Terraform Fundamentals](../../12-terraform/01-terraform-fundamentals) | [🏠 الرئيسية](/)
