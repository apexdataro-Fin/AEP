---
sidebar_position: 6
title: "استكشاف أخطاء Kubernetes"
description: "Kubernetes Troubleshooting — CrashLoopBackOff، OOMKilled، Pending pods، استكشاف أخطاء الإنتاج."
---

# استكشاف أخطاء Kubernetes

> "90% من مشاكل Kubernetes تتشابه. تعلم الـ 10% المتبقية."

## 🎯 أهداف التعلم

- تشخيص CrashLoopBackOff و OOMKilled
- استكشاف Pending pods
- قراءة Events و Logs بفعالية
- أدوات debugging: kubectl debug, stern, k9s

## ⏱️ الوقت المقدر: 45 دقيقة | المستوى: Advanced

---

## 🏗️ المشاكل الشائعة

### 1. CrashLoopBackOff

```bash
kubectl get pods
# NAME        READY   STATUS             RESTARTS
# api-7d5f    0/1     CrashLoopBackOff   15

kubectl logs api-7d5f --previous
kubectl describe pod api-7d5f | grep -A 10 "Events:"
```

**الأسباب الشائعة**:
- خطأ في الكود (application panic)
- ConfigMap/Secret غير موجود
- Database unreachable
- Port already in use

### 2. OOMKilled

```bash
kubectl describe pod api-7d5f | grep OOM
# State: Terminated, Reason: OOMKilled

# الحل: زيادة limits أو تحسين الكود
kubectl set resources deployment/api --limits=memory=512Mi
```

### 3. Pending Pods

```bash
kubectl describe pod api-7d5f | grep -A 5 "Events:"
# 0/3 nodes are available: 3 Insufficient cpu
```

**الحلول**: زيادة nodes أو تقليل requests أو Cluster Autoscaler.

### أدوات debugging

```bash
kubectl debug node/aks-agentpool-123 -it --image=ubuntu
kubectl run tmp-shell --rm -it --image=alpine -- sh
kubectl exec -it api-7d5f -- sh
kubectl get events --sort-by='.lastTimestamp' | tail -20
```

---

## 🏛️ سيناريو CloudNova

**2 صباحاً**: Production down. 500 errors.

1. `kubectl get pods`: 3 pods في CrashLoopBackOff
2. `kubectl logs api-xxx --previous`: `Error: connect ECONNREFUSED postgres-service:5432`
3. `kubectl get svc postgres-service`: لا يوجد! تم حذفه بالخطأ أثناء deployment
4. **الحل**: `helm rollback postgres 1`

الوقت الكلي: 4 دقائق. شكراً لـ Kubernetes!

---

[← Operators & CRDs](./05-kubernetes-operators-crds) | [→ Helm Fundamentals](../../11-helm/01-helm-fundamentals) | [🏠 الرئيسية](/)
