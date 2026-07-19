---
sidebar_position: 2
title: "إدارة عناقيد GPU"
description: "GPU Cluster Management — Azure ND-series، Kubernetes مع GPU، جدولة المهام."
---

# إدارة عناقيد GPU

> "GPU بـ $30,000 ليس لعبة. أدرها بحكمة."

## 🎯 أهداف التعلم

- نشر Kubernetes مع GPU nodes
- جدولة المهام على GPU
- GPU sharing و MIG
- مراقبة استخدام GPU

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Advanced

---

## 🏗️ AKS مع GPU

```bash
az aks nodepool add \
  --resource-group cloudnova-ai \
  --cluster-name cloudnova-aks \
  --name gpunp \
  --node-count 2 \
  --node-vm-size Standard_NC24ads_A100_v4 \
  --node-taints "sku=gpu:NoSchedule"
```

### GPU Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: training-job
spec:
  containers:
  - name: trainer
    image: pytorch/pytorch:2.0.1-cuda11.7
    resources:
      limits:
        nvidia.com/gpu: 1
    command: ["python", "train.py"]
  tolerations:
  - key: "sku"
    operator: "Equal"
    value: "gpu"
    effect: "NoSchedule"
```

### GPU Sharing (MIG)

```bash
nvidia-smi mig -cgi 19,19,19,19 -C
# A100 40GB → 4 أقسام 10GB لكل منها
```

---

[← AI Infrastructure](./01-ai-infrastructure) | [→ Model Serving](./03-model-serving-inference) | [🏠 الرئيسية](/)
