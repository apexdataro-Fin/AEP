---
sidebar_position: 3
title: "تتبع التجارب"
description: "ML Experiment Tracking — MLflow، Weights & Biases — تنظيم وإدارة تجارب ML."
---

# تتبع التجارب

> "بدون experiment tracking، أنت تعيد نفس التجارب مراراً وتكراراً."

## 🎯 أهداف التعلم

- MLflow لتتبع التجارب
- تسجيل المعاملات والمقاييس
- Model Registry
- مقارنة التجارب

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🏗️ MLflow

```python
import mlflow

mlflow.set_experiment("customer-churn-prediction")

with mlflow.start_run():
    # تسجيل المعاملات
    mlflow.log_param("learning_rate", 0.01)
    mlflow.log_param("epochs", 50)
    mlflow.log_param("batch_size", 32)
    
    # تدريب النموذج
    model = train_model(lr=0.01, epochs=50)
    accuracy = evaluate(model)
    
    # تسجيل المقاييس
    mlflow.log_metric("accuracy", accuracy)
    
    # حفظ النموذج
    mlflow.sklearn.log_model(model, "model")
```

### Model Registry

```bash
# تسجيل أفضل نموذج في registry
mlflow models register-model \
  --model-uri "runs:/abc123/model" \
  --name "churn-predictor"

# ترقية إلى staging
mlflow models transition-stage \
  --name "churn-predictor" \
  --version 3 \
  --stage "Staging"
```

---

[← Model Monitoring](./02-model-monitoring-production) | [→ LLMOps](../../29-llmops/01-llmops-fundamentals) | [🏠 الرئيسية](/)
