---
sidebar_position: 3
title: "أنماط البحث الهجين"
description: "Hybrid Search — دمج Vector Search مع BM25 للبحث الدلالي والمفتاحي."
---

# أنماط البحث الهجين

> "البحث الدلالي وحده لا يكفي. Hybrid Search يجمع أفضل ما في العالمين."

## 🎯 أهداف التعلم

- دمج Vector Search مع BM25
- Reciprocal Rank Fusion (RRF)
- تحسين نتائج البحث

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Advanced

---

## 🏗️ Hybrid Search

```python
# Weaviate Hybrid Search
response = client.query.get("Document", ["content", "title"]) \
    .with_hybrid(query="كيفية تكوين Kubernetes Ingress", alpha=0.5) \
    .with_limit(10) \
    .do()

# alpha=0: BM25 فقط (keyword)
# alpha=1: Vector فقط (semantic)
# alpha=0.5: مزيج متوازن
```

### Reciprocal Rank Fusion

```python
def reciprocal_rank_fusion(results_list, k=60):
    scores = {}
    for results in results_list:
        for rank, (doc_id, _) in enumerate(results, 1):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + rank)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
```

---

[← Vector DB Comparison](./02-pinecone-vs-weaviate-vs-qdrant) | [→ RAG Architecture](../../26-rag/01-rag-architecture) | [🏠 الرئيسية](/)
