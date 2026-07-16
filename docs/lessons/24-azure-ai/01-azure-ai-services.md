---
sidebar_position: 1
title: "الذكاء الاصطناعي على Azure"
description: "خدمات Azure AI: OpenAI، Cognitive Services، Azure ML، والبحث الذكي."
---

# الذكاء الاصطناعي على Azure

> **"الذكاء الاصطناعي ليس مستقبلاً — إنه الآن. و Azure يوفر البنية التحتية له."**

## محفظة Azure AI

| الخدمة                     | الاستخدام                   |
| -------------------------- | --------------------------- |
| **Azure OpenAI**           | نماذج GPT، المتجهات، DALL-E |
| **Cognitive Services**     | رؤية، نطق، لغة، قرار        |
| **Azure Machine Learning** | تدريب ونشر نماذج ML         |
| **AI Search**              | بحث دلالي، RAG              |

## Azure OpenAI — مثال عملي

```python
from openai import AzureOpenAI
import os

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_KEY"],
    api_version="2024-02-01"
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "أنت مساعد تقني خبير."},
        {"role": "user", "content": "اشرح Kubernetes في فقرة واحدة."}
    ]
)
print(response.choices[0].message.content)
```

## سيناريو CloudNova: تلخيص تذاكر الدعم

> **الموقف:** ١٠٠٠ تذكرة دعم يومياً. المهندسون يقضون ٣٠٪ من وقتهم في قراءة التذاكر.

**الحل:**

1. مرر التذكرة لـ GPT-4 مع prompt: "لخص هذه التذكرة في جملتين."
2. صنفها: `category: networking|database|auth`
3. حدد الأولوية: `priority: low|medium|high|critical`

**النتيجة:** توفير ٢٥٪ من وقت المهندسين = تذاكر تُحل أسرع.

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
