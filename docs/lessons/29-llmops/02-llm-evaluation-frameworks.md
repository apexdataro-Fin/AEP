---
sidebar_position: 2
title: "تقييم نماذج اللغة"
description: "LLM Evaluation — BLEU، ROUGE، RLHF، Human Eval."
---

# تقييم نماذج اللغة

> "كيف تعرف أن نموذجك أفضل؟ بالتقييم المنهجي."

## 🎯 أهداف التعلم

- BLEU و ROUGE للتقييم التلقائي
- RLHF (Human Feedback)
- LLM-as-Judge
- A/B Testing للنماذج

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Advanced

---

## 🏗️ BLEU Score

```python
from nltk.translate.bleu_score import sentence_bleu

reference = [["Kubernetes", "هو", "منصة", "تنسيق", "حاويات"]]
candidate = ["Kubernetes", "هو", "نظام", "إدارة", "حاويات"]
score = sentence_bleu(reference, candidate)
print(f"BLEU: {score:.2f}")
```

### LLM-as-Judge

```python
def evaluate_with_llm(response, reference, criteria):
    prompt = f"""
    قيّم هذه الإجابة حسب المعايير: {criteria}
    الإجابة: {response}
    الإجابة المرجعية: {reference}
    أعطِ تقييماً من 1-10 مع تبرير.
    """
    return llm_judge(prompt)
```

### A/B Testing

```python
# 50% من الزوار → النموذج A، 50% → النموذج B
model = "A" if random.random() < 0.5 else "B"
response = get_response(model, query)
track_metric(model, user_satisfaction(response))
```

---

[← LLMOps Fundamentals](./01-llmops-fundamentals) | [→ Cost Optimization](./03-llm-cost-optimization-advanced) | [🏠 الرئيسية](/)
