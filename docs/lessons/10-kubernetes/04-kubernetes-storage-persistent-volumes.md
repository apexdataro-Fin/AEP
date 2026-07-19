---
sidebar_position: 4
title: "تخزين Kubernetes"
description: "Persistent Volumes، PVC، Storage Classes، CSI Drivers — تخزين البيانات في Kubernetes."
---

# تخزين Kubernetes

> "بدون Persistent Volumes، بياناتك تختفي مع كل restart."

## 🎯 أهداف التعلم

- PV و PVC: النموذج الكامل
- Storage Classes للتخزين الديناميكي
- Azure Disk و Azure Files في AKS
- النسخ الاحتياطي للبيانات

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

---

## 🏗️ PV & PVC

```yaml
# PersistentVolume — المُخزّن الفعلي
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
spec:
  capacity:
    storage: 100Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  azureDisk:
    kind: Managed
    diskName: postgres-disk
    diskURI: /subscriptions/.../disks/postgres-disk
---
# PersistentVolumeClaim — طلب التخزين
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
```

### Storage Class — تلقائي

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azure-disk-premium
provisioner: disk.csi.azure.com
parameters:
  skuname: Premium_LRS
  kind: Managed
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

📌 مع Storage Class، لا تحتاج PV! الـ PVC ينشئ القرص تلقائياً.

---

## 🛠️ تدريب

انشر PostgreSQL مع:
1. PVC بـ 50Gi
2. Storage Class `managed-premium`
3. اختبر: احذف الـ pod وتأكد من بقاء البيانات

---

[← K8s Security](./03-kubernetes-security-rbac-pod-security) | [→ Operators & CRDs](./05-kubernetes-operators-crds) | [🏠 الرئيسية](/)
