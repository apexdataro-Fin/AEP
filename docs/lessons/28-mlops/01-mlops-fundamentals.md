---
sidebar_position: 1
title: "أساسيات MLOps"
description: "MLOps: دورة حياة التعلم الآلي، Azure ML Pipelines، CI/CD للنماذج، Feature Store، A/B Testing، والمراقبة."
---

# أساسيات MLOps

> "بناء النموذج هو 20% من العمل. تشغيله ومراقبته في الإنتاج هو الـ 80%."

## 🎯 أهداف التعلم

- فهم دورة حياة MLOps الكاملة
- بناء Azure ML Pipelines الآلي
- إدارة Feature Store و Model Registry
- تطبيق A/B Testing و Canary Deployment
- اكتشاف Model Drift وإعادة التدريب التلقائي

---

## 📖 الطبقة الأساسية: MLOps vs DevOps

| البعد | DevOps | MLOps |
|-------|--------|-------|
| **المكونات** | Code + Config | Code + Data + Model + Pipeline |
| **التقييم** | Tests pass/fail | Accuracy, Precision, Drift |
| **النسخة** | Git commit | Git + Data version + Model version |
| **المراقبة** | CPU, Memory, Errors | + Data Drift, Model Drift, Bias |

---

## 🧱 الطبقة المهنية: Azure ML Pipeline

```python
from azure.ai.ml import MLClient, command, Input
from azure.ai.ml.dsl import pipeline

@pipeline()
def training_pipeline(raw_data):
    # ١. إعداد البيانات
    prepared = command(
        name="prepare_data",
        command="python prepare.py --raw ${{inputs.raw}}"
    )(raw=raw_data)
    
    # ٢. تدريب
    model = command(
        name="train",
        command="python train.py --data ${{inputs.data}}",
        compute="gpu-cluster"
    )(data=prepared.outputs.output)
    
    # ٣. تقييم
    results = command(
        name="evaluate",
        command="python evaluate.py --model ${{inputs.model}}"
    )(model=model.outputs.output)
    
    return {"model": model.outputs.output, "metrics": results.outputs.output}

# تشغيل
pipeline_job = training_pipeline(raw_data=Input(path="azureml:raw-data@latest"))
ml_client.jobs.create_or_update(pipeline_job)
```

---

## 🏗️ الطبقة الإنتاجية: Feature Store

```python
from azure.ai.ml.entities import FeatureSet, FeatureStore

# تخزين الميزات مركزيًا - تشارك بين كل النماذج
feature_store = FeatureStore(name="cloudnova_features")

feature_set = FeatureSet(
    name="customer_features",
    version="1",
    entities=["customer_id"],
    source=AzureSqlSource(
        path="customer_features_table",
        timestamp_column="updated_at"
    )
)
ml_client.feature_sets.create_or_update(feature_set)

# في الـ training pipeline:
features = ml_client.feature_sets.get("customer_features", version="1")
```

---

## 🎨 الطبقة المعمارية: A/B Testing

```python
# نشر نموذجين جنباً إلى جنب
blue = ManagedOnlineDeployment(name="blue", model="model:v1", traffic=90)
green = ManagedOnlineDeployment(name="green", model="model:v2", traffic=10)

endpoint.traffic = {"blue": 90, "green": 10}
ml_client.online_endpoints.begin_create_or_update(endpoint)

# بعد 24 ساعة من المراقبة:
metrics = compare_models("blue", "green")
if metrics["green_accuracy"] > metrics["blue_accuracy"]:
    # تحويل 100% للـ green
    endpoint.traffic = {"green": 100}
```

---

## ⚡ الإنتاج وما بعده: Model Drift Detection

```python
def monitor_drift():
    # حساب drift بين بيانات التدريب والإنتاج
    drift_score = calculate_psi(training_data, production_data)
    
    if drift_score > 0.2:  # PSI > 0.2 = drift كبير
        send_alert(f"⚠️ Drift detected: {drift_score:.2f}")
        trigger_retraining()

def calculate_psi(expected, actual) -> float:
    """Population Stability Index"""
    # PSI < 0.1: لا drift
    # PSI 0.1-0.2: drift متوسط
    # PSI > 0.2: drift كبير — إعادة تدريب!
    return np.sum((actual - expected) * np.log(actual / expected))
```

---

## 🚨 سيناريو CloudNova: Model Decay

```
المشكلة: نموذج التسعير أصبح غير دقيق بعد 6 أشهر

قبل MLOps:
├── اكتشاف المشكلة: شكوى عميل (شهرين!)
└── إعادة التدريب: أسبوع يدوي

بعد MLOps:
├── Azure ML Pipeline أسبوعي
├── Drift detection تلقائي
├── إعادة تدريب إذا drift > 20%
├── A/B testing للنموذج الجديد
└── نشر تلقائي إذا أفضل

من شهرين → ساعتين!
```

---

## 🧠 التذكّر النشط

1. ما الفرق بين DevOps و MLOps؟ (5 فروق)
2. كيف يختلف Model Drift عن Data Drift؟
3. لماذا Feature Store مهم في المؤسسات الكبيرة؟
4. كيف تنشر نموذجاً جديداً بدون توقف الخدمة؟
5. متى تعيد تدريب النموذج تلقائياً؟

## 🎤 أسئلة المقابلة

1. **"كيف تتعامل مع Model Drift؟"**
   - مراقبة مستمرة (PSI, KS-test, accuracy)
   - عتبات تنبيه (drift > 0.2)
   - إعادة تدريب تلقائي
   - A/B testing للنموذج الجديد قبل التبديل

2. **"Batch vs Online Inference؟"**
   - Batch: توقعات دورية، latency غير مهم
   - Online: توقعات فورية، < 100ms

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
