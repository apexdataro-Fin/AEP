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

## 🧠 الطبقة البسيطة

تخيل فندقاً. كل نزيل (pod) له مفتاح غرفته فقط. لا يمكنه دخول الغرف الأخرى. RBAC هو نظام المفاتيح: من يستطيع فعل ماذا. Network Policy هي الجدران بين الغرف.

---

## 🏗️ RBAC

```yaml
# Role: صلاحيات محدودة لقراءة pods
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

### Network Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes: [Ingress, Egress]
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

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

اكتشفنا أن أحد الـ pods في `development` كان لديه **cluster-admin**! السبب: ServiceAccount خاطئ.

```bash
# تدقيق RBAC
kubectl auth can-i --list --as=system:serviceaccount:development:default
kubectl get clusterrolebindings -o json | jq '.items[] | select(.subjects[]?.kind=="ServiceAccount")'
```

**الحل**: OPA Gatekeeper يمنع أي RoleBinding لـ cluster-admin.

### OPA Gatekeeper

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRequiredLabels
metadata:
  name: require-team-label
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["team", "environment"]
```

---

## 🛠️ تدريبات

### تمرين: أنشئ Role يسمح فقط بقراءة ConfigMaps
### تحدي: طبق Network Policy تمنع كل ingress ما عدا من `frontend`

---

## 📝 تقييم

### ✅ فحص المعرفة
1. ما الفرق بين Role و ClusterRole؟
2. لماذا Network Policy مهمة؟
3. كيف تمنع pods من التشغيل كـ root؟

### 🃏 بطاقات

| السؤال | الإجابة |
|--------|---------|
| RBAC | Role-Based Access Control |
| PSS | Pod Security Standards |
| NetworkPolicy | يتحكم في اتصالات الـ pods |
| OPA | Open Policy Agent — سياسات مخصصة |

---

## 🎤 مقابلة

1. **"كيف تؤمن Kubernetes cluster؟"**
   → RBAC + PSS + Network Policies + OPA + audit logging
2. **"كيف تكتشف صلاحيات زائدة؟"**
   → `kubectl auth can-i --list` + OPA auditing

---

## 📚 مراجع

| النوع | الرابط |
|-------|--------|
| درس مرتبط | [K8s Storage](./04-kubernetes-storage-persistent-volumes) |
| شهادة | CKA / CKS |

---

[← K8s Networking](./02-kubernetes-networking) | [→ K8s Storage](./04-kubernetes-storage-persistent-volumes) | [🏠 الرئيسية](/)
