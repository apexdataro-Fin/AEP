---
sidebar_position: 1
title: "البنية التحتية للذكاء الاصطناعي"
description: "GPU clusters، CUDA، networking، التخزين — البنية التحتية التي تشغل نماذج AI."
---

# البنية التحتية للذكاء الاصطناعي (AI Infrastructure)

> "أفضل نموذج AI بدون بنية تحتية قوية = سيارة فيراري في طريق ترابي."

## 🎯 أهداف التعلم

- فهم متطلبات البنية التحتية لـ AI workloads
- اختيار GPU المناسب لكل حالة استخدام
- تصميم Storage للتخزين فائق السرعة
- بناء شبكات منخفضة الـ latency للـ distributed training
- إدارة AI infra عبر Terraform

---

## 📖 الطبقة الأساسية: لماذا AI Infra مختلف

```
تطبيق ويب عادي:
├── CPU: 2-4 vCPU كافية
├── RAM: 8-16GB
├── Disk: 50GB SSD
└── Network: 1 Gbps

AI Training (GPT-scale):
├── GPU: 8x NVIDIA A100 (80GB)
├── RAM: 1-2 TB system RAM
├── Disk: 10+ TB NVMe
├── Network: InfiniBand 400 Gbps
└── Inter-GPU: NVLink 600 GB/s
```

### مقارنة GPU Options

| GPU            | VRAM    | الأداء | السعر/ساعة | متى تستخدم           |
| -------------- | ------- | ------ | ---------- | -------------------- |
| **T4**         | 16GB    | ★★★    | ~$0.50     | Inference خفيف       |
| **A10**        | 24GB    | ★★★★   | ~$1.00     | Inference متوسط      |
| **A100**       | 40/80GB | ★★★★★  | ~$3.50     | Training + Inference |
| **H100**       | 80GB    | ★★★★★+ | ~$5.00     | Large-scale Training |
| **NC A100 v4** | 80GB x4 | ★★★★★+ | ~$14.00    | Distributed Training |

---

## 🧱 الطبقة المهنية: إدارة GPU في Azure

### Terraform للـ GPU Cluster

```hcl
# AKS Cluster مع GPU Node Pool
resource "azurerm_kubernetes_cluster_node_pool" "gpu" {
  name                  = "gpunp"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size              = "Standard_NC24ads_A100_v4"
  node_count           = 2
  node_labels = {
    "accelerator" = "nvidia-a100"
    "workload"    = "ai-training"
  }
  node_taints = [
    "nvidia.com/gpu=true:NoSchedule"
  ]

  enable_auto_scaling  = true
  min_count           = 0
  max_count           = 8

  tags = {
    Workload = "AI-Training"
    CostCenter = "AI-Team"
  }
}

# NVIDIA Device Plugin
resource "kubernetes_daemonset" "nvidia_plugin" {
  metadata {
    name      = "nvidia-device-plugin"
    namespace = "kube-system"
  }
  spec {
    template {
      spec {
        container {
          name  = "nvidia-device-plugin"
          image = "nvcr.io/nvidia/k8s-device-plugin:v0.15.0"
          volume_mount {
            name       = "device-plugin"
            mount_path = "/var/lib/kubelet/device-plugins"
          }
        }
        volume {
          name = "device-plugin"
          host_path {
            path = "/var/lib/kubelet/device-plugins"
          }
        }
        toleration {
          key    = "nvidia.com/gpu"
          effect = "NoSchedule"
        }
      }
    }
  }
}
```

### تشغيل GPU Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: training-job
spec:
  tolerations:
    - key: "nvidia.com/gpu"
      operator: "Exists"
      effect: "NoSchedule"
  containers:
    - name: trainer
      image: pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime
      resources:
        limits:
          nvidia.com/gpu: 2 # طلب 2 GPU
          memory: 128Gi
          cpu: 16
      command:
        - torchrun
        - --nproc_per_node=2
        - train.py
      volumeMounts:
        - name: training-data
          mountPath: /data
        - name: checkpoints
          mountPath: /checkpoints
  volumes:
    - name: training-data
      persistentVolumeClaim:
        claimName: azure-premium-nvme
    - name: checkpoints
      persistentVolumeClaim:
        claimName: azure-files-premium
```

---

## 🏗️ الطبقة الإنتاجية: تخزين AI

### Storage Tiers للـ AI

```
AI Storage Architecture:

الطبقة 1: Hot Tier — NVMe SSD (للتدريب النشط)
├── Azure Ultra Disk: 2GB/s, 160K IOPS
├── استخدام: datasets النشطة، checkpoints
└── التكلفة: عالية

الطبقة 2: Warm Tier — Premium SSD (للـ inference)
├── Azure Premium SSD: 250MB/s, 5K IOPS
├── استخدام: نماذج جاهزة، بيانات متكررة
└── التكلفة: متوسطة

الطبقة 3: Cold Tier — Blob Storage (للبيانات التاريخية)
├── Azure Blob Cool: رخيص
├── استخدام: datasets قديمة، نماذج منتهية
└── التكلفة: منخفضة جداً

الطبقة 4: Archive Tier — (للنسخ الاحتياطي)
├── Azure Blob Archive: أرخص خيار
├── استخدام: نسخ احتياطية، data retention
└── التكلفة: أقل ما يمكن
```

### Kubernetes PVC للـ AI

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: training-data-ultra
spec:
  accessModes:
    - ReadWriteMany # للـ distributed training
  resources:
    requests:
      storage: 2Ti
  storageClassName: ultra-disk

---
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ultra-disk
provisioner: disk.csi.azure.com
parameters:
  skuname: UltraSSD_LRS
  cachingMode: None
  diskIopsReadWrite: "160000"
  diskMbpsReadWrite: "2000"
reclaimPolicy: Retain
allowVolumeExpansion: true
```

---

## 🎨 الطبقة المعمارية: Distributed Training

### استراتيجيات التدريب الموزع

```
Data Parallel (الأكثر شيوعاً):
┌─────────┐  ┌─────────┐  ┌─────────┐
│  GPU 0  │  │  GPU 1  │  │  GPU N  │
│ Batch 1 │  │ Batch 2 │  │ Batch N │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                  │
          ┌───────▼───────┐
          │  All-Reduce   │
          │  (Sync Gradients)
          └───────────────┘

Model Parallel (للنماذج الضخمة):
┌─────────┐  ┌─────────┐  ┌─────────┐
│  GPU 0  │──│  GPU 1  │──│  GPU N  │
│ Layers  │  │ Layers  │  │ Layers  │
│  0-11   │  │ 12-23   │  │ 24-35   │
└─────────┘  └─────────┘  └─────────┘
```

### NCCL Performance Tuning

```python
# إعدادات NCCL للـ distributed training
import os

# التواصل بين GPUs
os.environ["NCCL_DEBUG"] = "INFO"
os.environ["NCCL_SOCKET_IFNAME"] = "eth0"
os.environ["NCCL_IB_DISABLE"] = "0"  # تفعيل InfiniBand
os.environ["NCCL_IB_GID_INDEX"] = "3"
os.environ["NCCL_NET_GDR_LEVEL"] = "5"  # GPUDirect RDMA

# لتحسين الأداء
os.environ["NCCL_NSOCKS_PERTHREAD"] = "4"
os.environ["NCCL_SOCKET_NTHREADS"] = "2"
```

---

## 🏥 سيناريو CloudNova: AI Infra Design

```
📋 المشروع: AI-010
العنوان: بنية تحتية لتدريب نموذج رؤية حاسوبية

المتطلبات:
├── تدريب أسبوعي على 10M صورة
├── Inference 24/7 (1000 req/s)
├── ميزانية: $30,000/شهر
└── وقت التدريب < 4 ساعات

التصميم:

1. Training Cluster (يعمل 8 ساعات أسبوعياً):
   ├── 4x NC96ads_A100_v4 (4 GPUs each)
   ├── Ultra Disk 4TB (shared)
   ├── InfiniBand networking
   └── التكلفة: ~$15,000/شهر

2. Inference Cluster (يعمل دائماً):
   ├── 2x Standard_NC8as_T4_v3 (T4 GPUs)
   ├── Azure ML Managed Endpoint
   ├── Auto-scaling 2-10 nodes
   └── التكلفة: ~$3,000/شهر

3. Storage:
   ├── Hot: Ultra Disk 4TB ($1,200)
   ├── Warm: Premium SSD 2TB ($300)
   └── Cold: Blob Storage 50TB ($500)

الإجمالي: ~$20,000/شهر (تحت الميزانية)
```

---

## ⚡ الإنتاج وما بعده

### مراقبة GPU

```bash
# مقاييس GPU في Prometheus
dcgm-exporter:
  metrics:
    - DCGM_FI_DEV_GPU_UTIL       # استخدام GPU %
    - DCGM_FI_DEV_MEM_COPY_UTIL  # استخدام ذاكرة GPU %
    - DCGM_FI_DEV_GPU_TEMP       # حرارة GPU
    - DCGM_FI_DEV_POWER_USAGE    # استهلاك الطاقة

# تنبيهات
groups:
  - name: gpu-alerts
    rules:
      - alert: GPUOverheating
        expr: DCGM_FI_DEV_GPU_TEMP > 80
        annotations:
          summary: "GPU {{ $labels.gpu }} temperature > 80°C"
```

---

## 🧠 التذكّر النشط

1. متى تختار T4 vs A100 vs H100؟
2. ما الفرق بين Data Parallel و Model Parallel؟
3. لماذا InfiniBand مهم للـ distributed training؟
4. كيف تصمم Storage tiers للـ AI؟
5. كيف تدير تكاليف GPU في Azure؟

## 📝 بطاقات تعليمية

- **CUDA**: منصة NVIDIA للحوسبة المتوازية على GPU
- **NVLink**: اتصال مباشر فائق السرعة بين GPUs
- **InfiniBand**: شبكة فائقة السرعة للـ distributed computing
- **GPUDirect RDMA**: نقل البيانات مباشرة بين GPU والذاكرة دون المرور بـ CPU
- **Spot VMs**: VMs مخفضة السعر (80% أقل) لكنها قابلة للاسترداد

## 🎤 أسئلة المقابلة

1. **"كيف تختار GPU للـ inference؟"**
   - حجم النموذج: A100 للـ LLMs الكبيرة، T4 للنماذج الصغيرة
   - عدد الطلبات: A100 للـ batch inference
   - التكلفة: Spot VMs للـ batch jobs

2. **"كيف تدير تكاليف AI Infrastructure؟"**
   - Reserved Instances للـ inference (توفير 40-60%)
   - Spot VMs للتدريب (توفير 80%)
   - Auto-shutdown ليلاً
   - Right-sizing بناءً على metrics

3. **"ما هي اختناقات AI Infrastructure؟"**
   - GPU memory (OOM errors)
   - I/O bottleneck (الـ GPU ينتظر البيانات)
   - Network bottleneck (للـ distributed training)
   - Storage throughput

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
