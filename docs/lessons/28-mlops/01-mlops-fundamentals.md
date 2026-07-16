---
sidebar_position: 1
title: "أساسيات MLOps"
description: "MLOps: دورة حياة التعلم الآلي، Azure ML Pipelines، CI/CD للنماذج، المراقبة والإصدار."
---

# أساسيات MLOps

> "بناء النموذج هو 20% من العمل. تشغيله ومراقبته في الإنتاج هو الـ 80%."

## 🎯 أهداف التعلم

- فهم دورة حياة MLOps الكاملة
- بناء Azure ML Pipelines
- أتمتة تدريب ونشر النماذج
- مراقبة أداء النماذج في الإنتاج
- إدارة إصدارات النماذج والبيانات

---

## 📖 الطبقة الأساسية: MLOps vs DevOps

```
DevOps:
Code → Build → Test → Deploy → Monitor → Repeat

MLOps:
Data → Train → Validate → Deploy → Monitor → Retrain
  ↑                                              │
  └──────────────────────────────────────────────┘

الفرق الجوهري:
├── DevOps: الكود + التكوين فقط
└── MLOps: الكود + البيانات + النموذج + الـ pipeline
```

### مكونات MLOps

| المكون                     | الوصف                   | مثال أدوات                   |
| -------------------------- | ----------------------- | ---------------------------- |
| **Data Versioning**        | تتبع إصدارات البيانات   | DVC, Delta Lake              |
| **Experiment Tracking**    | تسجيل التجارب والمقاييس | MLflow, Azure ML             |
| **Pipeline Orchestration** | أتمتة سير العمل         | Azure ML Pipelines, Kubeflow |
| **Model Registry**         | سجل النماذج المعتمدة    | Azure ML Registry, MLflow    |
| **Model Serving**          | تشغيل النموذج كخدمة     | AKS, Azure ML Endpoints      |
| **Monitoring**             | مراقبة الأداء والتدهور  | Azure Monitor, Evidently     |

---

## 🧱 الطبقة المهنية: Azure ML Pipelines

### Training Pipeline

```python
from azure.ai.ml import MLClient, command, Input
from azure.ai.ml.entities import Environment, BuildContext
from azure.identity import DefaultAzureCredential

ml_client = MLClient(
    DefaultAzureCredential(),
    subscription_id,
    resource_group,
    workspace_name
)

# 1. بيئة التدريب
env = Environment(
    name="training-env",
    build=BuildContext(path="./docker/training")
)

# 2. خطوة إعداد البيانات
data_prep = command(
    name="prepare_data",
    display_name="Data Preparation",
    code="./src/data",
    command="python prepare.py --raw-data ${{inputs.raw}} --output ${{outputs.prepared}}",
    environment=env,
    inputs={
        "raw": Input(type="uri_folder", path="azureml:raw-data:latest")
    },
    outputs={
        "prepared": Output(type="uri_folder", mode="rw_mount")
    }
)

# 3. خطوة التدريب
train = command(
    name="train_model",
    display_name="Model Training",
    code="./src/training",
    command="python train.py --data ${{inputs.data}} --model ${{outputs.model}}",
    environment=env,
    compute="gpu-cluster",
    inputs={
        "data": data_prep.outputs.prepared
    },
    outputs={
        "model": Output(type="uri_folder", mode="rw_mount")
    }
)

# 4. خطوة التقييم
evaluate = command(
    name="evaluate_model",
    display_name="Model Evaluation",
    code="./src/evaluation",
    command="python evaluate.py --model ${{inputs.model}} --data ${{inputs.test_data}} --results ${{outputs.results}}",
    environment=env,
    inputs={
        "model": train.outputs.model,
        "test_data": Input(type="uri_folder", path="azureml:test-data:latest")
    },
    outputs={
        "results": Output(type="uri_folder", mode="rw_mount")
    }
)

# 5. خطوة التسجيل (إذا نجح التقييم)
register = command(
    name="register_model",
    display_name="Register Model",
    code="./src/registration",
    command="python register.py --model ${{inputs.model}} --metrics ${{inputs.metrics}}",
    environment=env,
    inputs={
        "model": train.outputs.model,
        "metrics": evaluate.outputs.results
    }
)

# تجميع الـ Pipeline
from azure.ai.ml.dsl import pipeline

@pipeline()
def training_pipeline(raw_data):
    prepared = data_prep(raw=raw_data)
    model = train(data=prepared.outputs.prepared)
    results = evaluate(model=model.outputs.model, test_data=raw_data)
    registration = register(model=model.outputs.model, metrics=results.outputs.results)
    return {"model": model.outputs.model, "metrics": results.outputs.results}

# تشغيل الـ Pipeline
pipeline_job = training_pipeline(
    raw_data=Input(type="uri_folder", path="azureml:raw-data@latest")
)
ml_client.jobs.create_or_update(pipeline_job)
```

---

## 🏗️ الطبقة الإنتاجية: نشر النموذج

### Managed Online Endpoint

```python
from azure.ai.ml.entities import (
    ManagedOnlineEndpoint,
    ManagedOnlineDeployment,
    Model,
    CodeConfiguration
)

# 1. إنشاء Endpoint
endpoint = ManagedOnlineEndpoint(
    name="cloudnova-recommender",
    auth_mode="key",
    description="CloudNova Recommendation Engine"
)
ml_client.online_endpoints.begin_create_or_update(endpoint)

# 2. نشر كنموذج (Blue/Green)
model = Model(path="azureml:recommender-model:1")

blue_deployment = ManagedOnlineDeployment(
    name="blue",
    endpoint_name="cloudnova-recommender",
    model=model,
    instance_type="Standard_DS3_v2",
    instance_count=2,
    code_configuration=CodeConfiguration(
        code="./src/scoring",
        scoring_script="score.py"
    ),
    environment="recommender-env:1"
)
ml_client.online_deployments.begin_create_or_update(blue_deployment)

# 3. توجيه الحركة
endpoint.traffic = {"blue": 100}
ml_client.online_endpoints.begin_create_or_update(endpoint)
```

### Score Script

```python
# score.py
import json
import joblib
import numpy as np
from azureml.core.model import Model

def init():
    """تحميل النموذج عند بدء الخدمة"""
    global model
    model_path = Model.get_model_path("recommender-model")
    model = joblib.load(model_path)

def run(raw_data):
    """معالجة طلب واحد"""
    try:
        data = json.loads(raw_data)
        features = np.array(data["features"]).reshape(1, -1)
        prediction = model.predict(features)
        return {"prediction": prediction.tolist()[0], "status": "success"}
    except Exception as e:
        return {"error": str(e), "status": "error"}
```

---

## 🎨 الطبقة المعمارية: Model Monitoring

### اكتشاف Data Drift

```python
from azure.ai.ml.entities import DataDriftDetector, FeatureAttributionDriftDetector

# مراقبة الانحراف في البيانات
drift_monitor = DataDriftDetector(
    name="recommender-drift-monitor",
    target_data=Input(type="uri_folder", path="azureml:production-data:latest"),
    baseline_data=Input(type="uri_folder", path="azureml:training-data:latest"),
    compute="cpu-cluster",
    frequency="Week",
    feature_list=["age", "income", "purchase_history"]
)
```

### Model Performance Monitoring

```python
# متابعة أداء النموذج في الإنتاج
def monitor_model_performance():
    metrics = {
        "accuracy": calculate_accuracy(recent_predictions, ground_truth),
        "latency_p95": np.percentile(latencies, 95),
        "requests_per_minute": len(recent_predictions) / minutes,
        "drift_score": calculate_drift(recent_data, training_data)
    }

    # تنبيه عند التدهور
    if metrics["accuracy"] < 0.85:
        send_alert("⚠️ دقة النموذج انخفضت تحت 85%")
        trigger_retraining()

    if metrics["drift_score"] > 0.3:
        send_alert("⚠️ انحراف في البيانات يتجاوز 30%")
```

---

## 🏥 سيناريو CloudNova: MLOps Production

```
مشكلة: نموذج التسعير أصبح غير دقيق بعد 6 أشهر

قبل MLOps:
├── اكتشاف المشكلة: بعد شكوى عميل (شهرين!)
├── إعادة التدريب: يدوية، أسبوع
└── النشر: يدوي، يوم

بعد MLOps:
├── Azure ML Pipeline أسبوعي:
│   ├── جمع بيانات الإنتاج
│   ├── مقارنة مع بيانات التدريب (drift detection)
│   ├── إعادة تدريب تلقائي إذا drift > 20%
│   └── تقييم النموذج الجديد
│
├── إذا النموذج الجديد أفضل:
│   ├── تسجيل في Model Registry
│   ├── نشر تلقائي كـ Green deployment
│   ├── 10% حركة → مراقبة → 100%
│   └── إشعار للفريق

النتيجة: من شهرين إلى ساعتين!
```

---

## ⚡ الإنتاج وما بعده

### MLOps Maturity Levels

| المستوى              | الوصف                             | متى تكفي    |
| -------------------- | --------------------------------- | ----------- |
| **0: يدوي**          | كل شيء يدوي                       | نماذج أولية |
| **1: أتمتة التدريب** | Pipeline تدريب تلقائي             | فريق واحد   |
| **2: CI/CD للنماذج** | نشر تلقائي + اختبارات             | مؤسسة       |
| **3: مراقبة كاملة**  | Drift detection + auto-retraining | إنتاج       |

---

## 🧠 التذكّر النشط

1. ما الفرق بين DevOps و MLOps؟
2. كيف تبني Azure ML Pipeline من 4 خطوات؟
3. ما هو Data Drift وكيف تكتشفه؟
4. كيف تنشر نموذجاً بـ Blue/Green deployment؟
5. متى تعيد تدريب النموذج تلقائياً؟

## 📝 بطاقات تعليمية

- **ML Pipeline**: سير عمل آلي للـ ML (بيانات → تدريب → تقييم → نشر)
- **Model Registry**: سجل مركزي للنماذج وإصداراتها
- **Data Drift**: تغير توزيع البيانات في الإنتاج مقارنة ببيانات التدريب
- **Online Endpoint**: REST API للنموذج مع auto-scaling
- **Feature Store**: مستودع مركزي للميزات (features) المستخدمة في النماذج

## 🎤 أسئلة المقابلة

1. **"كيف تتعامل مع Model Drift؟"**
   - مراقبة مستمرة للمقاييس
   - عتبات للتنبيه (مثلاً: accuracy < 85%)
   - إعادة تدريب تلقائي
   - A/B testing للنموذج الجديد

2. **"Batch vs Online Inference — متى تستخدم كل منهما؟"**
   - Batch: توقعات دورية، latency غير مهم (تقارير يومية)
   - Online: توقعات فورية، < 100ms (توصيات مباشرة)

3. **"كيف تؤمّن Model Endpoint؟"**
   - API key أو Azure AD token
   - Network isolation (Private Endpoint)
   - Rate limiting
   - Input validation

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
