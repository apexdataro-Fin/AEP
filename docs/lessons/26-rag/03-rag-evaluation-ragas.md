---
sidebar_position: 3
title: "تقييم RAG"
description: "RAG Evaluation — RAGAS، Faithfulness، Relevance — قياس جودة نظام RAG."
---

# تقييم RAG

> "بدون تقييم، RAG هو صندوق أسود. RAGAS يفتحه."

## 🎯 أهداف التعلم

- RAGAS metrics: Faithfulness, Relevance, Context Precision
- بناء مجموعة اختبار
- تحسين النظام بناءً على المقاييس

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Advanced

---

## 🏗️ RAGAS Metrics

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

results = evaluate(
    dataset=test_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision]
)
print(results)
# {'faithfulness': 0.85, 'answer_relevancy': 0.78, 'context_precision': 0.82}
```

| Metric | ماذا يقيس | هدف |
|--------|----------|-----|
| **Faithfulness** | هل الإجابة مبنية على السياق؟ | > 0.80 |
| **Answer Relevancy** | هل الإجابة مرتبطة بالسؤال؟ | > 0.75 |
| **Context Precision** | هل السياق المسترجع دقيق؟ | > 0.80 |
| **Context Recall** | هل استرجعنا كل السياق المطلوب؟ | > 0.70 |

### تحسين RAG

إذا كانت Faithfulness منخفضة → المشكلة في الـ LLM (يختلق معلومات)
إذا كانت Context Precision منخفضة → المشكلة في الـ Retriever

---

[← Advanced RAG Patterns](./02-advanced-rag-patterns) | [→ Production Scaling](./04-rag-production-scaling) | [🏠 الرئيسية](/)
