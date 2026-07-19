---
sidebar_position: 1
title: "أساسيات LLMOps"
description: "LLMOps: إدارة نماذج اللغة الكبيرة، التقييم، Prompt Management، Semantic Cache، Guardrails، والمراقبة."
---

# أساسيات LLMOps

> "LLMOps ليس مجرد MLOps مع LLMs. تحديات جديدة: التكلفة، الـ latency، وجودة المخرجات غير الحتمية."

## 🎯 أهداف التعلم

- فهم كيف يختلف LLMOps عن MLOps التقليدي
- إتقان Prompt Management وإصداراته
- بناء Semantic Cache لتقليل التكاليف
- تقييم جودة LLM في الإنتاج
- تطبيق Guardrails و Content Safety

---

## 📖 الطبقة الأساسية: LLMOps vs MLOps

| التحدي | MLOps التقليدي | LLMOps |
|--------|---------------|--------|
| **التقييم** | Accuracy, Precision | Faithfulness, Relevance |
| **الـ latency** | < 10ms | 500ms - 5s |
| **التكلفة** | تدريب مرة واحدة | كل استدعاء يكلف |
| **التحكم** | النموذج كله ملكك | API طرف ثالث |

---

## 🧱 الطبقة المهنية: Semantic Cache

```python
import hashlib
from redis import Redis
import numpy as np

class SemanticCache:
    """تخزين الأسئلة المتشابهة لتوفير 50-70% من التكاليف"""
    
    def __init__(self, redis_url: str, similarity_threshold: float = 0.92):
        self.redis = Redis.from_url(redis_url)
        self.threshold = similarity_threshold
    
    def get(self, query: str) -> str | None:
        """ابحث عن إجابة مخزنة لسؤال مشابه"""
        query_vector = self.embed(query)
        
        # البحث في Redis عن أقرب سؤال
        cached = self.redis.ft("idx:queries").search(
            query=query_vector.tobytes(),
            query_params={"vec": query_vector.tobytes()}
        )
        
        if cached.docs and cached.docs[0].score > self.threshold:
            return cached.docs[0].answer
        return None
    
    def set(self, query: str, answer: str):
        """خزّن السؤال وإجابته"""
        self.redis.hset(f"cache:{hashlib.md5(query.encode()).hexdigest()}", mapping={
            "query": query, "answer": answer, "vector": self.embed(query).tobytes()
        })

# الاستخدام:
cache = SemanticCache(redis_url="redis://cache:6379")
cached = cache.get("كيف أنشر تطبيق Python على Azure؟")
if cached:
    return cached  # توفير 100% من تكلفة LLM!
```

---

## 🏗️ الطبقة الإنتاجية: Prompt Management

```yaml
# prompts/v2.1.0.yaml — إصدار الـ Prompt كما الكود
version: "2.1.0"
model: gpt-4
temperature: 0.3
system: |
  أنت مساعد Azure تقني لـ CloudNova.
  قواعد: دقيق، موجز، لا تخمن.

few_shot:
  - q: "كيف أنشر Python؟"
    a: "3 طرق: App Service، Functions، AKS. أيهم يناسبك؟"
```

```python
# اختبار الـ prompts قبل النشر
def test_prompt(prompt_config: dict, eval_dataset: list) -> dict:
    results = []
    for case in eval_dataset:
        r = llm.chat(prompt_config["system"], case["input"])
        results.append({
            "faithfulness": evaluate_faithfulness(r, case["expected"]),
            "latency": r.response_ms,
            "cost": r.usage.total_tokens * 0.00003
        })
    return aggregate(results)
```

---

## 🎨 الطبقة المعمارية: Guardrails

```python
from guardrails import Guard
from guardrails.hub import ToxicLanguage, SecretsPresent

agent_guard = Guard().use_many(
    ToxicLanguage(on_fail="exception"),
    SecretsPresent(on_fail="exception"),
    ValidLength(min=5, max=2000, on_fail="fix"),
)

@agent_guard
def agent_respond(query: str) -> str:
    return agent.run(query)  # يمر عبر guardrails تلقائياً
```

---

## 🚨 سيناريو CloudNova: خفض تكاليف LLM

```
المشكلة: $450/يوم على GPT-4!

الحلول:
١. Semantic Cache → توفير 60% للأسئلة المتكررة
٢. Router: GPT-3.5 للبسيط، GPT-4 للمعقد → توفير 30%
٣. Prompt Optimization → تقليل tokens 40%
٤. Streaming: إرسال الـ tokens تدريجياً
٥. Batch processing ليلاً

النتيجة: $85/يوم (توفير 81%)
```

---

## 🧠 التذكّر النشط

1. كيف يختلف LLMOps عن MLOps؟ (5 فروق)
2. كيف تبني Semantic Cache لتوفير التكاليف؟
3. كيف تختبر Prompt قبل نشره؟
4. متى تستخدم GPT-4 ومتى GPT-3.5؟
5. كيف تمنع hallucinations؟

## 🎤 أسئلة المقابلة

1. **"كيف تخفض تكلفة LLM 80% بدون التضحية بالجودة؟"**
   - Semantic Cache: 50-70% توفير
   - Router: نموذج بسيط للأسئلة السهلة
   - Prompt compression
   - Batch processing

2. **"Prompt Engineering vs Fine-tuning؟"**
   - Prompt: سريع، رخيص، محدود
   - Fine-tuning: أفضل جودة، أغلى، للسلوك الثابت
   - الأفضل: Prompt أولاً، Fine-tune إذا لم يكفِ

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
