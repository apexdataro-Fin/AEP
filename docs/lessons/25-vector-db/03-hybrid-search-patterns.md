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

# alpha=0: BM25 فقط. alpha=1: Vector فقط. alpha=0.5: مزيج.
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

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

بحث "Kubernetes" يرجع نتائج عن K8s deployment وليس عن kubernetes the word فقط. Hybrid Search يدمج: BM25 يجد الصفحات التي تحتوي "Kubernetes" حرفياً. Vector search يجد الصفحات عن تنسيق الحاويات حتى لو لم تذكر "Kubernetes".

### alpha tuning

| alpha | النتيجة |
|-------|---------|
| 0.0 | نتائج keyword فقط |
| 0.3 | تركيز على keyword مع semantic bonus |
| 0.7 | تركيز على semantic |
| 1.0 | نتائج semantic فقط |

---

## 🛠️ تدريبات

### تمرين: جرب hybrid search مع alpha مختلفة
### تحدي: طبّق RRF على نتائج من محركين بحث مختلفين

---

## 📝 تقييم

### ✅ فحص المعرفة
1. لماذا hybrid search أفضل من vector فقط؟
2. كيف يعمل RRF؟
3. كيف تختار قيمة alpha؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| Hybrid Search | دمج keyword + vector search |
| RRF | Reciprocal Rank Fusion — دمج ترتيب النتائج |
| alpha | وزن التوازن بين keyword و vector |

---

## 🎤 مقابلة
1. **"كيف تحسن نتائج البحث في تطبيق RAG؟"** → Hybrid Search + RRF + alpha tuning
2. **"متى يكون vector search وحده غير كافٍ؟"** → عندما يبحث المستخدم عن مصطلح دقيق (keyword)

---

[← Vector DB Comparison](./02-pinecone-vs-weaviate-vs-qdrant) | [→ RAG Architecture](../../26-rag/01-rag-architecture) | [🏠 الرئيسية](/)
