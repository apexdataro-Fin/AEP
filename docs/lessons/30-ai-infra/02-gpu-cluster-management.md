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

## 🏛️ سيناريو CloudNova: عنقود GPU بـ $280,000

**تركي** مهندس AI Infrastructure. CloudNova اشترت 4 عقد A100 ($70,000 لكل عقدة). بعد 3 أشهر:

- متوسط استخدام GPU: 35% فقط!
- بعض الـ pods تستهلك GPU كاملة للتدريب ليلاً
- نهاراً: الـ GPUs شبه خاملة
- التكلفة الضائعة: ~$15,000/شهر

**الحل — جدولة ذكية + GPU Sharing:**

```python
# 1. GPU Time-Sharing مع جدولة ذكية
apiVersion: v1
kind: ResourceQuota
metadata:
  name: gpu-quota
  namespace: ai-workloads
spec:
  hard:
    requests.nvidia.com/gpu: "4"
---
# 2. MIG (Multi-Instance GPU) لتقسيم A100
# تقسيم A100 80GB إلى أقسام أصغر
nvidia-smi mig -cgi 19,19,19,19 -C
# النتيجة: 4 أقسام × 10GB لكل منها
# يمكن تشغيل 4 مهام تدريب صغيرة بدلاً من مهمة واحدة كبيرة

# 3. Priority Classes للجدولة
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: training-high-priority
value: 1000
globalDefault: false
description: "تدريب نماذج الإنتاج - أولوية عالية"
---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: experiment-low-priority
value: 100
globalDefault: false
description: "تجارب علماء البيانات - أولوية منخفضة"

# 4. Node Autoscaler مع GPU
# إضافة عقد GPU فقط عند الحاجة
az aks nodepool update \
  --resource-group cloudnova-ai \
  --cluster-name cloudnova-aks \
  --name gpunp \
  --enable-cluster-autoscaler \
  --min-count 0 \
  --max-count 8 \
  --scale-down-mode Deallocate  # توفير أكبر
```

**النتائج:**

- GPU utilization: 35% → 78% ✅
- التكلفة الشهرية: $24,000 → $12,000 (بسبب scale-to-zero ليلاً للعقد الزائدة)
- مهام التدريب: 12 مهمة/يوم → 28 مهمة/يوم (بسبب MIG)

---

## 🎨 طبقة المعماري: مقارنة استراتيجيات GPU

| الاستراتيجية                    | التكلفة | Utilization | التعقيد | متى؟              |
| ------------------------------- | ------- | ----------- | ------- | ----------------- |
| **Dedicated GPU per pod**       | عالية   | 30-50%      | منخفض   | مهام كبيرة مستمرة |
| **Time-slicing**                | متوسطة  | 50-70%      | متوسط   | مهام متقطعة       |
| **MIG**                         | منخفضة  | 70-85%      | عالي    | مهام متعددة صغيرة |
| **Multi-Process Service (MPS)** | منخفضة  | 60-80%      | عالي    | مهام CUDA متوازية |
| **Node Autoscaler**             | الأمثل  | 80-95%      | متوسط   | أحمال متغيرة      |

### مصفوفة قرار: أي GPU لـ Azure؟

| المهمة                      | GPU الموصى بها           | السبب          |
| --------------------------- | ------------------------ | -------------- |
| **تدريب نموذج كبير (70B+)** | ND96asr A100 v4 (8×A100) | أقصى قوة       |
| **Fine-tuning (7B-13B)**    | NC24ads A100 v4 (1×A100) | توازن سعر/أداء |
| **Inference (LLM)**         | NCasT4_v3 (T4)           | كافية، رخيصة   |
| **تجارب صغيرة**             | NC4as_T4_v3 (¼ T4)       | أرخص خيار      |
| **Spot/Preemptible**        | أي GPU نوع Spot          | توفير 80%      |

---

## 🛠️ تدريبات عملية

### تمرين 1: GPU Monitoring

```bash
# مراقبة GPU utilization
watch -n 1 nvidia-smi

# في Kubernetes
kubectl describe nodes | grep -A 5 "nvidia.com/gpu"

# Prometheus metrics
# DCGM Exporter يعرض:
# - DCGM_FI_DEV_GPU_UTIL: نسبة استخدام GPU
# - DCGM_FI_DEV_MEM_COPY_UTIL: نسبة استخدام الذاكرة
# - DCGM_FI_DEV_POWER_USAGE: استهلاك الطاقة
```

### تمرين 2: جدولة ذكية

```yaml
# Pod بجدولة ذكية على GPU
apiVersion: v1
kind: Pod
metadata:
  name: training-job-priority
  labels:
    priority: high
    team: ai-platform
spec:
  priorityClassName: training-high-priority
  nodeSelector:
    accelerator: nvidia-a100
  containers:
    - name: trainer
      image: pytorch/pytorch:2.2.0-cuda12.1
      resources:
        requests:
          nvidia.com/gpu: "1"
        limits:
          nvidia.com/gpu: "1"
          memory: "128Gi"
          cpu: "16"
      env:
        - name: CUDA_VISIBLE_DEVICES
          value: "0"
```

### تحدي: GPU Cluster Cost Optimizer

```python
# التحدي: ابنِ أداة تحلل استخدام GPU وتوصي:
# 1. أي pods تستهلك GPU بدون داعٍ
# 2. متى تشغل spot instances
# 3. متى تقسم GPU بـ MIG
# 4. جدول زمني للتوفير الأمثل
```

---

## 📝 تقييم

### ✅ Knowledge Checks

1. ما MIG وما فائدته؟
2. متى تستخدم Spot VMs للـ GPU؟
3. كيف تراقب GPU utilization في Kubernetes؟
4. ما الفرق بين T4 و A100؟
5. كيف توفر تكلفة GPU 50%؟

### 🧠 Quiz

**س1:** MIG يسمح بـ:

- أ) تقسيم GPU الواحدة إلى أقسام مستقلة ✅
- ب) دمج عدة GPUs
- ج) تسريع GPU
- د) كل ما سبق

**س2:** Spot VMs للـ GPU توفر:

- أ) 20%
- ب) 50%
- ج) حتى 80% ✅
- د) لا شيء

**س3:** nvidia-smi يُستخدم لـ:

- أ) مراقبة حالة GPU ✅
- ب) تدريب النماذج
- ج) نشر التطبيقات
- د) إدارة Kubernetes

### 🗣️ Active Recall

1. ارسم معماري GPU Cluster في AKS
2. قارن بين MIG و MPS
3. كيف تصمم GPU scheduling strategy؟
4. متى يكون dedicated GPU أفضل من shared؟

### 🎓 Feynman Exercise

> اشرح MIG لمدير: "مثل تقسيم شقة كبيرة إلى 4 استوديوهات. بدلاً من أن يسكن شخص واحد (مهمة تدريب كبيرة)، يمكن 4 أشخاص مختلفين (4 مهام صغيرة) استخدام نفس المساحة بكفاءة."

### 🃏 بطاقات تعلم

| السؤال             | الإجابة                                  |
| ------------------ | ---------------------------------------- |
| ما MIG؟            | Multi-Instance GPU — تقسيم GPU إلى أقسام |
| A100 vs T4؟        | A100 = تدريب ثقيل، T4 = inference        |
| ما Spot VM؟        | VM مؤقتة بتكلفة أقل 80%                  |
| ما DCGM؟           | أداة NVIDIA لمراقبة GPU                  |
| كم GPU في ND96asr؟ | 8 × A100                                 |

---

## 🎤 أسئلة المقابلة

**س1 (تقني):** "كيف تدير GPU Cluster في Kubernetes؟"

> NVIDIA Device Plugin + GPU Operator. Node Pools منفصلة للـ GPU مع taints/tolerations. MIG للـ A100 لتقسيم GPU الواحدة. Priority Classes: الإنتاج > التجارب. Cluster Autoscaler مع scale-to-zero. DCGM Exporter + Prometheus للمراقبة.

**س2 (System Design):** "صمم GPU Cluster لـ 50 عالم بيانات."

> 4 عقد A100 (للتدريب الثقيل) + 8 عقد T4 (للتجارب والـ inference). MIG على A100 للتقسيم. Priority scheduling. Spot instances للمهام غير الحرجة. Budget: $40K/شهر مع optimizations.

**س3 (سلوكي):** "كيف تقنع الإدارة بشراء GPUs بـ $280K؟"

> أحسب ROI: بدون GPUs، التدريب يستغرق 14 يوماً. مع GPUs: 8 ساعات. الفارق: 13 يوماً من وقت علماء البيانات. بالإضافة: تجارب أكثر = نماذج أفضل = منتج أفضل. الـ $280K تسترد خلال 6 أشهر.

---

## 📚 المراجع

| النوع          | الرابط                                                                               |
| -------------- | ------------------------------------------------------------------------------------ |
| **درس ذو صلة** | [AI Infrastructure](./01-ai-infrastructure)                                          |
| **درس ذو صلة** | [Model Serving](./03-model-serving-inference)                                        |
| **أداة**       | [NVIDIA GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/) |
| **مرجع**       | [Azure ND-series](https://learn.microsoft.com/azure/virtual-machines/nd-series)      |

---

[← AI Infrastructure](./01-ai-infrastructure) | [→ Model Serving](./03-model-serving-inference) | [🏠 الرئيسية](/)
