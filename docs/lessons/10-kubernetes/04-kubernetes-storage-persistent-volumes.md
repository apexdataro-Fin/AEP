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

## 🧠 الطبقة البسيطة

تخيل أن الـ pod مثل مكتب مؤقت في مساحة عمل مشتركة. كل يوم تحضر، تجد مكتباً جديداً. بدون تخزين دائم، أوراقك تختفي كل ليلة. **Persistent Volume** هو خزانتك الشخصية: تبقى بغض النظر عن المكتب الذي تجلس عليه.

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

### استخدام في Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: postgres-pod
spec:
  containers:
    - name: postgres
      image: postgres:16
      volumeMounts:
        - mountPath: /var/lib/postgresql/data
          name: pgdata
  volumes:
    - name: pgdata
      persistentVolumeClaim:
        claimName: postgres-pvc
```

---

## 🏛️ طبقة الإنتاج

### سيناريو CloudNova: فقدان بيانات

حذف أحدهم PVC بالخطأ مع `reclaimPolicy: Delete`. اختفت 500GB من بيانات الإنتاج!

**الحل الدائم**:

1. `reclaimPolicy: Retain` في الإنتاج
2. Snapshots دورية
3. Backup إلى Azure Blob

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: postgres-snapshot-20260719
spec:
  volumeSnapshotClassName: azure-disk-snapshot
  source:
    persistentVolumeClaimName: postgres-pvc
```

### Access Modes

| Mode              | الوصف               | مثال          |
| ----------------- | ------------------- | ------------- |
| **ReadWriteOnce** | Pod واحد يقرأ ويكتب | PostgreSQL    |
| **ReadOnlyMany**  | عدة pods تقرأ فقط   | static assets |
| **ReadWriteMany** | عدة pods تقرأ وتكتب | Azure Files   |

---

## 🎨 طبقة المعماري

### Azure Disk vs Azure Files

|                 | Azure Disk     | Azure Files  |
| --------------- | -------------- | ------------ |
| **Access Mode** | RWO            | RWX          |
| **Performance** | عالي (SSD)     | متوسط        |
| **الاستخدام**   | قواعد البيانات | ملفات مشتركة |
| **Max Size**    | 32TB           | 100TB        |

---

## 🛠️ تدريبات

### تمرين: انشر PostgreSQL مع PVC

### تحدي: اختبر الحذف والاسترجاع

احذف pod وتحقق من بقاء البيانات. ثم احذف PVC مع `reclaimPolicy: Retain` ولاحظ أن القرص يبقى.

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما الفرق بين PV و PVC؟
2. متى تستخدم ReadWriteMany؟
3. كيف تحمي البيانات من الحذف غير المقصود؟

### 🃏 بطاقات

| السؤال         | الإجابة                            |
| -------------- | ---------------------------------- |
| PV             | Persistent Volume — التخزين الفعلي |
| PVC            | طلب تخزين من pod                   |
| StorageClass   | إنشاء تلقائي لـ PV                 |
| VolumeSnapshot | نسخة لحظية من volume               |

---

## 🎤 مقابلة

1. **"كيف تخزن بيانات دائمة في Kubernetes؟"** → PVC + StorageClass
2. **"كيف تنسخ بيانات PostgreSQL احتياطياً في K8s؟"** → VolumeSnapshots + Azure Backup

---

## 📚 مراجع

| النوع     | الرابط                                                     |
| --------- | ---------------------------------------------------------- |
| درس مرتبط | [K8s Security](./03-kubernetes-security-rbac-pod-security) |
| درس مرتبط | [Operators & CRDs](./05-kubernetes-operators-crds)         |
| شهادة     | CKA                                                        |

---

[← K8s Security](./03-kubernetes-security-rbac-pod-security) | [→ Operators & CRDs](./05-kubernetes-operators-crds) | [🏠 الرئيسية](/)
