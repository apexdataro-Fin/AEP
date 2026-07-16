---
sidebar_position: 2
title: "أمن الحاويات و Kubernetes"
description: "Pod Security، Network Policies، RBAC، Secrets Management في Kubernetes."
---

# أمن الحاويات و Kubernetes

> **"الـ Cluster الافتراضي ليس آمناً. الأمان يُبنى طبقة طبقة."**

## طبقات أمان Kubernetes

| الطبقة      | التقنية                   | ماذا تحمي              |
| ----------- | ------------------------- | ---------------------- |
| **الصورة**  | Trivy, Aqua               | ثغرات في صور الحاويات  |
| **الـ Pod** | Pod Security Standards    | صلاحيات الحاوية        |
| **الشبكة**  | Network Policies          | الاتصالات بين الخدمات  |
| **الوصول**  | RBAC                      | من يفعل ماذا           |
| **الأسرار** | External Secrets Operator | كلمات المرور والمفاتيح |

## Pod Security

```yaml
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 1000
  containers:
    - name: api
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
```

## RBAC

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: prod
  name: developer
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list"]
# لا يمكنه: delete, create, exec إلى pods
```

---

[← الدرس السابق](security-pipeline) | [العودة للوحدة](index.md) | [🏠 الرئيسية](/)
