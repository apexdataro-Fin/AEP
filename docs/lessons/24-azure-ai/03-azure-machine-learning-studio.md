---
sidebar_position: 3
title: "Azure Machine Learning"
description: "Azure ML Studio — تدريب ونشر نماذج التعلم الآلي."
---

# Azure Machine Learning

> "لست بحاجة لشراء GPU بـ $10,000. Azure ML يمنحك القوة الحاسوبية عند الطلب."

## 🎯 أهداف التعلم

- فهم Azure ML Workspace
- AutoML للتدريب التلقائي
- نشر النماذج كـ endpoints
- ML Pipelines

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Azure ML Workspace

```python
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

ml_client = MLClient(
    DefaultAzureCredential(),
    subscription_id="xxx",
    resource_group="cloudnova-ml",
    workspace_name="cloudnova-ml-ws"
)
```

### AutoML

```python
from azure.ai.ml import automl

classification_job = automl.classification(
    compute="gpu-cluster",
    experiment_name="customer-churn",
    training_data=train_data,
    target_column_name="churn",
    primary_metric="accuracy",
    n_cross_validations=5
)
ml_client.jobs.create_or_update(classification_job)
```

### نشر النموذج

```python
from azure.ai.ml.entities import ManagedOnlineEndpoint

endpoint = ManagedOnlineEndpoint(name="churn-predictor", auth_mode="key")
ml_client.online_endpoints.begin_create_or_update(endpoint)
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

تدريب نموذج customer churn على 5M سجل استغرق 4 ساعات على GPU cluster في Azure ML. النشر: دقيقتان كـ managed endpoint مع auto-scaling.

### ML Pipeline

```python
@dsl.pipeline(name="training-pipeline")
def pipeline():
    data_prep = data_prep_step()
    train = train_step(data=data_prep.outputs.processed_data)
    evaluate = eval_step(model=train.outputs.model)
    register = register_step(model=train.outputs.model) if evaluate.outputs.accuracy > 0.85 else None
```

---

## 🎨 Azure ML vs Databricks

|                       | Azure ML           | Databricks            |
| --------------------- | ------------------ | --------------------- |
| **التركيز**           | ML lifecycle كاملة | Data engineering + ML |
| **AutoML**            | ✅ مدمج            | محدود                 |
| **Managed endpoints** | ✅                 | ❌                    |
| **Spark**             | محدود              | ✅                    |

---

## 🛠️ تدريبات

### تمرين: أنشئ ML Workspace ودرب نموذجاً مع AutoML

### تحدي: انشر نموذجاً كـ managed endpoint

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما فائدة AutoML؟
2. كيف تنشر نموذجاً managed endpoint؟
3. متى تستخدم Azure ML بدلاً من Databricks؟

### 🃏 بطاقات

| السؤال           | الإجابة                       |
| ---------------- | ----------------------------- |
| Azure ML         | منصة ML مُدارة في Azure       |
| AutoML           | تدريب تلقائي — يجرب عدة نماذج |
| Managed Endpoint | نشر نموذج مع auto-scaling     |

---

## 🎤 مقابلة

1. **"كيف تدرب نموذجاً بدون كتابة كود؟"** → Azure AutoML
2. **"كيف تنتقل من notebook إلى production؟"** → ML Pipeline + Managed Endpoint

---

[← Cognitive Services](./02-cognitive-services-vision-speech) | [→ Azure OpenAI Production](./04-azure-openai-production) | [🏠 الرئيسية](/)
