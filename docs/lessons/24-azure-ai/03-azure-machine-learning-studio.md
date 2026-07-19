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
from azure.ai.ml.entities import Model, ManagedOnlineEndpoint

endpoint = ManagedOnlineEndpoint(
    name="churn-predictor",
    auth_mode="key"
)
ml_client.online_endpoints.begin_create_or_update(endpoint)
```

---

[← Cognitive Services](./02-cognitive-services-vision-speech) | [→ Azure OpenAI Production](./04-azure-openai-production) | [🏠 الرئيسية](/)
