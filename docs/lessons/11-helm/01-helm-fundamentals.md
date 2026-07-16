---
sidebar_position: 1
title: "Helm — إدارة حزم Kubernetes"
description: "Helm: charts، values، repositories، والنشر المتقدم."
---

# Helm — إدارة حزم Kubernetes

> **"Helm هو pip/npm لـ Kubernetes. بدلاً من ١٠ ملفات YAML — Chart واحد."**

## لماذا Helm؟

```bash
# بدون Helm: ٥ أوامر لنشر تطبيق بسيط
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f ingress.yaml

# مع Helm: أمر واحد
helm install my-api ./chart --set replicaCount=3
```

## هيكل الـ Chart

```
mychart/
├── Chart.yaml       # بيانات الـ chart
├── values.yaml      # القيم الافتراضية
├── templates/       # قوالب Kubernetes (مع Go templating)
│   ├── deployment.yaml
│   ├── service.yaml
│   └── _helpers.tpl
└── charts/          # Charts فرعية
```

## أوامر أساسية

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-nginx bitnami/nginx
helm upgrade my-nginx bitnami/nginx --set replicaCount=5
helm rollback my-nginx 1
helm uninstall my-nginx
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
