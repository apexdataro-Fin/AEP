---
sidebar_position: 1
title: "Helm Fundamentals"
description: "Kubernetes package management with Helm: charts, values, repositories."
---

# Helm Fundamentals

Kubernetes package management with Helm: charts, values, repositories.

## What You Will Learn

This module covers key concepts, hands-on exercises, and real CloudNova scenarios to build your production engineering skills.

## What is Helm?

Helm is the package manager for Kubernetes. It bundles K8s manifests into reusable **charts**.

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-nginx bitnami/nginx
helm list
helm upgrade my-nginx bitnami/nginx --set replicaCount=5
helm rollback my-nginx 1
```

## Chart Structure

```
mychart/
├── Chart.yaml       # Chart metadata
├── values.yaml      # Default configuration
├── templates/       # K8s manifests with Go templating
│   ├── deployment.yaml
│   └── service.yaml
└── charts/          # Sub-charts (dependencies)
```

## CloudNova Exercise

Apply what you learned: review the key concepts above and identify how they apply to a real production cloud environment.

---

[← Back to Module](index.md) | [🏠 Home](/)
