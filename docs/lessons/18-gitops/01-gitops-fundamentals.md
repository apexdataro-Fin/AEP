---
sidebar_position: 1
title: "GitOps Fundamentals"
description: "Declarative deployments with ArgoCD, Flux, and pull-based GitOps."
---

# GitOps Fundamentals

Declarative deployments with ArgoCD, Flux, and pull-based GitOps.

## What You Will Learn

This module covers key concepts, patterns, and real-world scenarios to build production-ready cloud engineering skills.

## What is GitOps?

Git is the single source of truth. The desired state lives in Git. A controller (ArgoCD/Flux) continuously reconciles the cluster to match Git.

```yaml
# Application manifest in Git
apiVersion: argoproj.io/v1alpha1
kind: Application
spec:
  source:
    repoURL: https://github.com/cloudnova/infra
    path: k8s/overlays/prod
  destination:
    server: https://kubernetes.default.svc
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Push vs Pull

- **Push:** CI/CD pushes changes to cluster (traditional)
- **Pull:** Cluster pulls desired state from Git (GitOps)

## CloudNova Exercise

Apply what you learned to a real production scenario at CloudNova, your virtual cloud engineering company.

---

[← Back to Module](index.md) | [🏠 Home](/)
