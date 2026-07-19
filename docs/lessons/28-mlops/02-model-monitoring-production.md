---
sidebar_position: 2
title: "مراقبة النماذج في الإنتاج"
description: "Model Monitoring — Data Drift، Concept Drift، Model Decay."
---

# مراقبة النماذج في الإنتاج

> "النموذج الذي لا يُراقب سيفشل. إنها مسألة وقت فقط."

## 🎯 أهداف التعلم

- Data Drift vs Concept Drift
- PSI (Population Stability Index)
- Model Decay detection
- إعادة التدريب التلقائي

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Advanced

---

## 🏗️ Data Drift Detection

```python
from scipy.stats import ks_2samp

def detect_drift(reference, current, threshold=0.05):
    stat, p_value = ks_2samp(reference, current)
    if p_value < threshold:
        print(f"DRIFT DETECTED! P-value: {p_value:.4f}")
    return p_value
```

### PSI

```python
def calculate_psi(expected, actual, bins=10):
    psi = 0
    for i in range(bins):
        if actual[i] == 0 or expected[i] == 0:
            continue
        psi += (actual[i] - expected[i]) * np.log(actual[i] / expected[i])
    # PSI < 0.1: لا drift
    # 0.1 < PSI < 0.2: drift متوسط
    # PSI > 0.2: drift كبير
    return psi
```

---

[← MLOps Fundamentals](./01-mlops-fundamentals) | [→ Experiment Tracking](./03-ml-experiment-tracking) | [🏠 الرئيسية](/)
