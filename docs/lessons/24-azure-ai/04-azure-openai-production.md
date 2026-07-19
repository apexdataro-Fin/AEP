---
sidebar_position: 4
title: "Azure OpenAI في الإنتاج"
description: "Azure OpenAI — GPT-4, Content Safety, Prompt Engineering, إنتاج."

# Azure OpenAI في الإنتاج

> "Azure OpenAI يمنحك GPT-4 مع أمان وخصوصية Azure."

## 🎯 أهداف التعلم

- نشر Azure OpenAI
- Content Safety filters
- Prompt Engineering
- Rate Limiting و Quotas

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Azure OpenAI

```python
from openai import AzureOpenAI

client = AzureOpenAI(
    api_key="xxx",
    api_version="2024-02-15-preview",
    azure_endpoint="https://cloudnova-aoai.openai.azure.com"
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "أنت مساعد Cloud Engineer."},
        {"role": "user", "content": "اشرح Kubernetes Deployment"}
    ],
    temperature=0.7,
    max_tokens=2000
)
```

### Content Safety

Azure OpenAI يحتوي على content filters مدمجة. يمكنك تخصيصها لمراقبة:
- Hate speech
- Sexual content
- Violence
- Self-harm

### Best Practices

- استخدم Managed Identity للمصادقة
- سجّل كل الـ prompts للتدقيق
- استخدم Rate Limiting
- لا ترسل بيانات حساسة

---

[← ML Studio](./03-azure-machine-learning-studio) | [→ Vector Databases](../../25-vector-db/01-vector-databases) | [🏠 الرئيسية](/)
