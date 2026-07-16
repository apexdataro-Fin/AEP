---
sidebar_position: 1
title: "معمارية RAG"
description: "Retrieval-Augmented Generation: بناء أنظمة RAG إنتاجية مع Azure AI Search و OpenAI."
---

# معمارية RAG

> "RAG ليس مجرد استدعاء API. إنه هندسة كاملة من الـ chunking إلى الـ evaluation."

## 🎯 أهداف التعلم

- فهم معمارية RAG الكاملة
- إتقان استراتيجيات الـ chunking
- بناء RAG pipeline إنتاجي
- تقييم جودة RAG
- تحسين RAG (Advanced RAG)

---

## 📖 الطبقة الأساسية: RAG متقدم

### Naive RAG vs Advanced RAG

```
Naive RAG:
User Query → Embed → Vector Search → Top-K → Prompt → LLM Answer

Advanced RAG:
User Query → Query Rewriting → Multi-Query Expansion
    │              │
    ▼              ▼
  Embedding    Hybrid Search (Vector + Keyword)
    │              │
    ▼              ▼
  Vector Search ← Metadata Filtering
    │
    ▼
  Re-ranking (Cohere / Cross-encoder)
    │
    ▼
  Context Compression ← Summarization
    │
    ▼
  Prompt Assembly ← System Prompt + Few-shot
    │
    ▼
  LLM → Answer + Citations
```

### Query Transformation

```python
def expand_query(query: str) -> list[str]:
    """توسيع الاستعلام لتحسين الاسترجاع"""

    # 1. HyDE — generate hypothetical document
    hypo_doc = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"Write a technical document answering: {query}"
        }],
        max_tokens=200
    )
    # نبحث بـ hypothetical document (أقرب للوثائق الحقيقية)

    # 2. Multi-query — عدة صيغ للسؤال
    variations = client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "user",
            "content": f"""Generate 3 different search queries
            for finding information about: {query}
            Each query should be in Arabic or English."""
        }]
    )

    return [query, hypo_doc.choices[0].message.content] + extract_queries(variations)
```

---

## 🧱 الطبقة المهنية: استراتيجيات Chunking

### أنواع الـ Chunking

```python
# 1. Fixed-size Chunking
def fixed_chunk(text: str, chunk_size: int = 1000, overlap: int = 200):
    """تقسيم ثابت الحجم مع تداخل"""
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start = end - overlap  # التداخل
    return chunks

# 2. Semantic Chunking (الأفضل)
def semantic_chunk(text: str, max_chunk_size: int = 1500):
    """تقسيم دلالي — على حدود الجمل والفقرات"""
    from langchain.text_splitter import RecursiveCharacterTextSplitter

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=max_chunk_size,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", "! ", "? ", "، ", " ", ""]
    )
    return splitter.split_text(text)

# 3. Document-aware Chunking
def document_chunk(document: dict):
    """تقسيم مع الحفاظ على هيكل الوثيقة"""
    chunks = []
    base_metadata = {
        "source": document["title"],
        "category": document["category"],
        "section": None
    }

    for section in document.get("sections", []):
        metadata = {**base_metadata, "section": section["heading"]}
        chunks.append({
            "content": f"# {section['heading']}\n{section['content']}",
            "metadata": metadata
        })

    return chunks
```

### مقارنة استراتيجيات Chunking

| الاستراتيجية     | الميزة             | العيب              | متى تستخدم     |
| ---------------- | ------------------ | ------------------ | -------------- |
| **Fixed-size**   | بسيط وسريع         | يقطع الجمل         | نماذج أولية    |
| **Recursive**    | يحترم حدود الجمل   | قد يكون غير متجانس | إنتاج (الأفضل) |
| **Semantic**     | مجموعات مترابطة    | معقد، بطيء         | محتوى تقني     |
| **Hierarchical** | هيكل الوثيقة محفوظ | كبير (overhead)    | وثائق طويلة    |

---

## 🏗️ الطبقة الإنتاجية: RAG Pipeline كامل

```python
class RAGPipeline:
    """RAG Pipeline إنتاجي"""

    def __init__(self):
        self.embedding_model = "text-embedding-ada-002"
        self.llm_model = "gpt-4"

    def retrieve(self, query: str, filters: dict = None, top_k: int = 5):
        """المرحلة 1: Retrieval"""

        # Query transformation
        queries = expand_query(query)

        all_results = []
        for q in queries:
            vector = get_embedding(q)

            # Vector search مع metadata filter
            search_options = {
                "vector_queries": [VectorizedQuery(
                    vector=vector,
                    fields="content_vector",
                    k_nearest_neighbors=top_k
                )],
                "select": ["content", "title", "section", "category"],
                "top": top_k
            }

            if filters:
                search_options["filter"] = build_filter(filters)

            results = search_client.search(None, **search_options)
            all_results.extend([r for r in results])

        # إزالة التكرارات
        unique_results = deduplicate(all_results)

        # Re-ranking مع cross-encoder
        reranked = self.rerank(query, unique_results)

        return reranked[:top_k]

    def rerank(self, query: str, documents: list) -> list:
        """إعادة ترتيب النتائج"""
        from sentence_transformers import CrossEncoder

        model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        pairs = [(query, doc["content"]) for doc in documents]
        scores = model.predict(pairs)

        # ترتيب حسب score
        scored = list(zip(documents, scores))
        scored.sort(key=lambda x: x[1], reverse=True)
        return [doc for doc, _ in scored]

    def generate(self, query: str, documents: list) -> dict:
        """المرحلة 2: Generation"""

        # بناء context مع citations
        context_parts = []
        for i, doc in enumerate(documents):
            context_parts.append(
                f"[{i+1}] المصدر: {doc['title']} "
                f"(قسم: {doc.get('section', 'غير محدد')})\n"
                f"{doc['content']}"
            )
        context = "\n\n---\n\n".join(context_parts)

        prompt = f"""أنت مساعد CloudNova التقني.
أجب عن السؤال بناءً على المصادر المقدمة فقط.
إذا لم تجد الإجابة، قل: "لا توجد معلومات كافية."
استشهد برقم المصدر [1]، [2]، إلخ.

المصادر:
{context}

السؤال: {query}

الإجابة:"""

        response = client.chat.completions.create(
            model=self.llm_model,
            messages=[
                {"role": "system", "content": "أنت مساعد تقني دقيق وموثوق."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )

        return {
            "answer": response.choices[0].message.content,
            "sources": [{"title": d["title"], "section": d.get("section", "")}
                       for d in documents],
            "tokens_used": response.usage.total_tokens
        }

    def query(self, question: str, filters: dict = None) -> dict:
        """واجهة RAG الكاملة"""
        documents = self.retrieve(question, filters)
        return self.generate(question, documents)
```

---

## 🎨 الطبقة المعمارية: تقييم RAG

### RAGAS — RAG Assessment

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall,
    answer_correctness
)

def evaluate_rag_pipeline(test_questions: list, ground_truth: list):
    """تقييم شامل لـ RAG"""

    results = []
    for q, truth in zip(test_questions, ground_truth):
        result = pipeline.query(q)
        results.append({
            "question": q,
            "answer": result["answer"],
            "ground_truth": truth,
            "contexts": [s["title"] for s in result["sources"]]
        })

    scores = evaluate(
        dataset=results,
        metrics=[
            faithfulness,       # هل الإجابة مبنية على المصادر؟
            answer_relevancy,   # هل الإجابة ذات صلة؟
            context_precision,  # دقة المصادر المسترجعة
            context_recall,     # هل استرجعنا كل ما يلزم؟
            answer_correctness  # صحة الإجابة
        ]
    )

    return scores
```

### مقاييس الجودة

| المقياس               | ماذا يقيس                         | الهدف  |
| --------------------- | --------------------------------- | ------ |
| **Faithfulness**      | هل الإجابة مستندة للمصادر؟        | > 0.90 |
| **Answer Relevancy**  | هل الإجابة تجيب السؤال؟           | > 0.85 |
| **Context Precision** | هل المصادر ذات صلة؟               | > 0.80 |
| **Context Recall**    | هل استرجعنا كل المعلومات اللازمة؟ | > 0.85 |
| **Latency**           | زمن الاستجابة                     | < 2s   |

---

## 🏥 سيناريو CloudNova: RAG للإنتاج

```
📋 المشروع: AI-005
العنوان: نظام أسئلة وأجوبة ذكي لدعم العملاء

المتطلبات:
├── زمن استجابة < 2 ثانية
├── Faithfulness > 0.90
├── دعم العربية والإنجليزية
└── استشهاد بالمصادر

المعمارية النهائية:

1. Ingestion Pipeline:
   ├── Azure Functions — معالجة الوثائق
   ├── Semantic chunking (1000 tokens, 200 overlap)
   ├── Multilingual embeddings (text-embedding-3-large)
   └── Azure AI Search (HNSW + Semantic)

2. Query Pipeline:
   ├── Query classification (عربي/إنجليزي)
   ├── Multi-query expansion (3 queries)
   ├── Hybrid search (vector + keyword)
   ├── Cross-encoder re-ranking
   └── GPT-4 generation with citations

3. Monitoring:
   ├── Faithfulness tracking
   ├── User feedback loop (👍/👎)
   ├── Latency dashboards
   └── Weekly evaluation with RAGAS
```

---

## ⚡ الإنتاج وما بعده

### RAG Optimization Tips

| التحسين                | التأثير           |
| ---------------------- | ----------------- |
| **Better chunking**    | +10-20% recall    |
| **Query expansion**    | +5-15% recall     |
| **Re-ranking**         | +10-25% precision |
| **Metadata filtering** | +10-30% relevance |
| **Prompt engineering** | +5-15% quality    |

---

## 🧠 التذكّر النشط

1. ما الفرق بين Naive RAG و Advanced RAG؟
2. لماذا chunking أهم مما تظن؟
3. كيف توسع الاستعلام لتحسين الاسترجاع؟
4. كيف تقيم جودة RAG؟
5. ما هو cross-encoder re-ranking؟

## 📝 بطاقات تعليمية

- **Naive RAG**: بحث بسيط + توليد (أساسي)
- **Advanced RAG**: Query expansion + re-ranking + filtering
- **Re-ranking**: إعادة ترتيب النتائج باستخدام نموذج أقوى
- **RAGAS**: إطار تقييم لأنظمة RAG
- **Faithfulness**: مقياس: هل الإجابة تستند للمصادر فعلاً؟

## 🎤 أسئلة المقابلة

1. **"كيف تحسن RAG ليعمل مع المستندات الطويلة؟"**
   - Hierarchical chunking (document → sections → chunks)
   - Summarization للقطع الطويلة
   - Map-reduce approach: لخص كل chunk ثم أجمع

2. **"كيف تتعامل مع أسئلة خارج نطاق المعرفة؟"**
   - Threshold للـ similarity score
   - "لا أعرف" عندما تكون المصادر غير كافية
   - توجيه المستخدم لطرح سؤال مختلف

3. **"ما الفرق بين RAG و Fine-tuning؟"**
   - RAG: المعرفة خارجية، تحديث سهل، أرخص
   - Fine-tuning: المعرفة في النموذج، أداء أعلى، أغلى
   - الأفضل: RAG + Fine-tuning معاً

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
