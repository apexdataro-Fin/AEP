---
sidebar_position: 3
title: "أمن Kubernetes المتقدم"
description: "RBAC، Pod Security، Network Policies، OPA Gatekeeper — تأمين الكلاستر."
---

# أمن Kubernetes المتقدم

> "كلاستر Kubernetes الافتراضي مفتوح للجميع. أول مهمة بعد التثبيت: إغلاق الأبواب."

## 🎯 أهداف التعلم

- RBAC: Roles, RoleBindings, ServiceAccounts
- Pod Security Standards (PSS)
- Network Policies
- OPA/Gatekeeper للسياسات المخصصة

## ⏱️ الوقت المقدر: 45 دقيقة | المستوى: Advanced

---

## 🏗️ RBAC

```yaml
# Role: صلاحيات محدودة لقراءة pods في namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: development
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
---
# RoleBinding: ربط الـ Role بمستخدم
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  namespace: development
  name: read-pods-binding
subjects:
- kind: User
  name: alice@cloudnova.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### ServiceAccount للأتمتة

```bash
kubectl create serviceaccount cicd-deployer -n production
kubectl create rolebinding cicd-deployer-binding \
  --role=deployer --serviceaccount=production:cicd-deployer
kubectl create token cicd-deployer -n production
```

### Pod Security Standards

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### Network Policy — عزل الـ Pods

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

---

## 🏛️ سيناريو CloudNova

اكتشفنا أن أحد الـ pods في `development` namespace كان لديه **cluster-admin** صلاحيات! السبب: ServiceAccount استُخدم مع RoleBinding خاطئ.

**الحل**:
1. `kubectl auth can-i --list` لكل namespace
2. OPA Gatekeeper يمنع أي RoleBinding لـ cluster-admin

---

## 🛠️ تدريب

1. أنشئ Role يسمح فقط بقراءة ConfigMaps
2. طبق Network Policy تمنع كل الـ ingress ما عدا من `frontend`

---

[← K8s Networking](./02-kubernetes-networking) | [→ K8s Storage](./04-kubernetes-storage-persistent-volumes) | [🏠 الرئيسية](/)
