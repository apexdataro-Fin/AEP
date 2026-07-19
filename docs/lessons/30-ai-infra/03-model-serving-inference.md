---
sidebar_position: 3
title: "خدمة الاستدلال"
description: "Model Serving — vLLM، Triton Inference Server، نشر نماذج LLM."
---

# خدمة الاستدلال

> "خدمة النموذج أهم من تدريبه. ما فائدة أفضل نموذج إذا كان بطيئاً؟"

## 🎯 أهداف التعلم

- vLLM للاستدلال السريع
- Triton Inference Server
- Continuous Batching
- نشر نماذج مفتوحة المصدر

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Advanced

---

## 🏗️ vLLM

```bash
pip install vllm

vllm serve meta-llama/Llama-3-8B \
  --host 0.0.0.0 \
  --port 8000 \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.95
```

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")
response = client.chat.completions.create(
    model="meta-llama/Llama-3-8B",
    messages=[{"role": "user", "content": "ما هو Kubernetes؟"}]
)
```

### Continuous Batching

| Batch Type | Throughput | Latency |
|-----------|-----------|---------|
| Static Batching | متوسط | عالي |
| **Continuous Batching** | عالي جداً | منخفض |

vLLM يحزم الطلبات ديناميكياً: بمجرد انتهاء طلب، يدخل طلب جديد مكانه فوراً.

---

[← GPU Clusters](./02-gpu-cluster-management) | [→ Portfolio](../../31-portfolio/01-portfolio-building) | [🏠 الرئيسية](/)
