---
sidebar_position: 1
title: "قواعد بيانات المتجهات"
description: "Vector Databases: Pinecone، Weaviate، Milvus — البحث بالتشابه، الفهرسة، والـ embeddings."
---

# قواعد بيانات المتجهات (Vector Databases)

> "البيانات غير المهيكلة هي 80% من بيانات العالم. Vector DBs تحولها إلى ذهب قابل للبحث."

## 🎯 أهداف التعلم

- فهم ما هي embeddings وكيف تعمل
- إتقان البحث بالتشابه (similarity search)
- بناء فهارس المتجهات (ANN, HNSW)
- استخدام Azure AI Search للـ vector search
- تصميم RAG pipeline كامل

---

## 📖 الطبقة الأساسية: لماذا Vector DB؟

### المشكلة

```
البحث التقليدي:
  البحث عن: "cloud computing pricing"
  النتيجة: وثائق تحتوي "cloud" و "computing" و "pricing" ✓

  البحث عن: "how much does it cost to run apps on azure"
  النتيجة: ❌ لا تحتوي "cloud" أو "pricing"!
  لكنها تعني نفس الشيء!

البحث بالمتجهات:
  البحث عن: "how much does it cost to run apps on azure"
  النتيجة: ✓ وثائق عن Azure pricing — لأن المعنى متقارب!
```

### كيف تعمل Embeddings

```
"القطة حيوان" ──► embedding model ──► [0.23, -0.45, 0.78, ..., 0.12]
                                            (1536 رقم)

"القط حيوان أليف" ──► [0.22, -0.43, 0.79, ..., 0.11]
                         المسافة: 0.02 (قريب جداً!)

"Azure هي سحابة" ──► [-0.89, 0.12, -0.34, ..., 0.67]
                         المسافة: 1.45 (بعيد)
```

### أنواع المسافات

```python
import numpy as np

a = np.array([0.23, -0.45, 0.78])
b = np.array([0.22, -0.43, 0.79])

# Cosine Similarity (الأكثر شيوعاً)
cosine_sim = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
# الناتج: 0.9998 (قريب جداً — قيمة بين -1 و 1)

# Euclidean Distance
euclidean_dist = np.linalg.norm(a - b)
# الناتج: 0.02 (صغير = قريب)

# Dot Product
dot_product = np.dot(a, b)
# يستخدم في بعض الأنظمة
```

---

## 🧱 الطبقة المهنية: بناء Vector Index

### HNSW — Hierarchical Navigable Small World

```
HNSW Index:
الطبقة 3:  ●────●      (نقاط بعيدة — تنقل سريع)
الطبقة 2:  ●──●──●──●   (متوسط)
الطبقة 1:  ●─●─●─●─●─● (تفاصيل)
الطبقة 0:  ●●●●●●●●●●●● (كل النقاط)

البحث:
1. ابدأ من الطبقة العليا
2. اقفز لأقرب نقطة في كل طبقة
3. في الطبقة السفلى، ابحث محلياً
4. تعقيد: O(log N)
```

### بناء index مع FAISS

```python
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# 1. تحميل نموذج الـ embedding
model = SentenceTransformer("intfloat/multilingual-e5-large")

# 2. إنشاء embeddings
documents = [
    "Virtual Machines on Azure",
    "Azure App Service for web apps",
    "Kubernetes on AKS",
    "AWS EC2 instances",
    "Linux administration guide"
]
embeddings = model.encode(documents)  # shape: (5, 1024)

# 3. بناء index
dimension = embeddings.shape[1]
index = faiss.IndexHNSWFlat(dimension, 32)  # 32 = connections per node
index.add(embeddings.astype(np.float32))

# 4. البحث
query = "how to deploy web applications"
query_vector = model.encode([query])

distances, indices = index.search(query_vector.astype(np.float32), k=3)

print("أقرب ٣ نتائج:")
for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
    print(f"{i+1}. {documents[idx]} (distance: {dist:.3f})")
# الناتج:
# 1. Azure App Service for web apps (distance: 0.823)
# 2. Virtual Machines on Azure (distance: 0.756)
# 3. Kubernetes on AKS (distance: 0.612)
```

---

## 🏗️ الطبقة الإنتاجية: Azure AI Search مع Vectors

```python
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex, SimpleField, SearchFieldDataType,
    SearchableField, VectorSearch, HnswAlgorithmConfiguration,
    VectorSearchProfile
)

# إنشاء index مع vector search
index = SearchIndex(
    name="knowledge-base-vectors",
    fields=[
        SimpleField(name="id", type=SearchFieldDataType.String, key=True),
        SearchableField(name="content", type=SearchFieldDataType.String),
        SearchField(
            name="content_vector",
            type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
            vector_search_dimensions=1536,  # ada-002 = 1536
            vector_search_profile_name="my-vector-profile"
        )
    ],
    vector_search=VectorSearch(
        algorithms=[
            HnswAlgorithmConfiguration(
                name="my-hnsw",
                parameters={"m": 4, "efConstruction": 400}
            )
        ],
        profiles=[
            VectorSearchProfile(
                name="my-vector-profile",
                algorithm_configuration_name="my-hnsw"
            )
        ]
    )
)

# Hybrid Search (نصي + متجهي)
from azure.search.documents.models import VectorizedQuery

def hybrid_search(query_text: str, top_k: int = 5):
    query_vector = get_embedding(query_text)

    results = search_client.search(
        search_text=query_text,  # بحث نصي
        vector_queries=[
            VectorizedQuery(   # بحث متجهي
                vector=query_vector,
                fields="content_vector",
                k_nearest_neighbors=top_k
            )
        ],
        select=["id", "content"],
        top=top_k
    )

    return [doc for doc in results]
```

---

## 🎨 الطبقة المعمارية: مقارنة Vector DBs

|                   | Azure AI Search | Pinecone | Weaviate          | Milvus            | pgvector        |
| ----------------- | --------------- | -------- | ----------------- | ----------------- | --------------- |
| **النوع**         | Managed         | SaaS     | Self-hosted/Cloud | Self-hosted/Cloud | Extension       |
| **Hybrid Search** | ✓ ممتاز         | محدود    | ✓                 | ✓                 | ✓ (مع tsvector) |
| **التكلفة**       | $$$             | $$       | $/$$              | $                 | مجاني (مع PG)   |
| **سهولة**         | ★★★★★           | ★★★★★    | ★★★               | ★★                | ★★★★            |
| **متى تستخدم**    | Azure shop      | MVP سريع | مرونة             | Scale كبير        | تطبيقات PG      |

---

## 🏥 سيناريو CloudNova: محرك بحث ذكي

```python
def build_knowledge_base(documents: list[dict]):
    """بناء قاعدة معرفة CloudNova"""

    for doc in documents:
        # 1. تقسيم النص (chunking)
        chunks = split_text(doc["content"], chunk_size=1000, overlap=200)

        for i, chunk in enumerate(chunks):
            # 2. إنشاء embedding
            vector = get_embedding(chunk)

            # 3. تخزين في Azure AI Search
            search_client.upload_documents([{
                "id": f"{doc['id']}-chunk-{i}",
                "content": chunk,
                "title": doc["title"],
                "category": doc["category"],
                "content_vector": vector,
                "last_updated": datetime.utcnow().isoformat()
            }])

def smart_search(query: str) -> dict:
    """بحث ذكي مع RAG"""

    # 1. Semantic search
    vector = get_embedding(query)
    results = list(search_client.search(
        search_text=query,
        vector_queries=[VectorizedQuery(vector=vector, fields="content_vector", k=5)],
        query_type="semantic",
        semantic_configuration_name="default",
        select=["content", "title", "category"]
    ))

    # 2. تجميع السياق
    context = "\n\n---\n\n".join([r["content"] for r in results])

    # 3. توليد الإجابة
    prompt = f"""بناءً على المصادر التالية، أجب عن السؤال:
{context}

السؤال: {query}

قدم إجابة دقيقة مع الاستشهاد بالمصادر."""

    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": [{"title": r["title"], "category": r["category"]} for r in results]
    }
```

---

## ⚡ الإنتاج وما بعده

### اعتبارات الإنتاج

| الجانب          | الممارسة                           |
| --------------- | ---------------------------------- |
| **Chunking**    | 500-1500 tokens مع 10-20% overlap  |
| **Re-indexing** | عند تحديث الوثائق                  |
| **Filtering**   | تصفية بالـ metadata قبل البحث      |
| **Monitoring**  | تتبع latency و recall rate         |
| **Cost**        | Embeddings: ~$0.0001 لكل 1K tokens |

---

## 🧠 التذكّر النشط

1. ما الفرق بين cosine similarity و Euclidean distance؟
2. كيف يعمل HNSW index؟
3. متى تستخدم hybrid search بدلاً من vector-only؟
4. كيف تختار chunk size المناسب؟
5. ما الفرق بين dense و sparse vectors؟

## 📝 بطاقات تعليمية

- **Embedding**: تمثيل متجهي (vector) للنص يحمل معناه
- **ANN**: Approximate Nearest Neighbor — بحث تقريبي عن أقرب الجيران
- **HNSW**: خوارزمية فهرسة متجهات سريعة
- **Chunking**: تقسيم النصوص الطويلة إلى قطع صغيرة للفهرسة
- **Cosine Similarity**: قياس الزاوية بين متجهين (القيمة بين -1 و 1)

## 🎤 أسئلة المقابلة

1. **"كيف تختار Vector Database؟"**
   - المقياس: كم مليون vector؟ (pgvector < 10M, Milvus > 100M)
   - الميزانية: managed vs self-hosted
   - الميزات: هل تحتاج hybrid search؟ filtering؟
   - التكامل: Azure AI Search إذا كنت في Azure

2. **"كيف تتعامل مع تحديث الـ embeddings؟"**
   - لا تعيد indexing لكل شيء
   - أعد embedding للوثائق المتغيرة فقط
   - استخدم timestamp لتتبع التغييرات
   - فكر في استراتيجية: delete + re-insert vs upsert

3. **"كيف تقيس جودة الـ vector search؟"**
   - Recall@k: كم من النتائج الصحيحة في top-k
   - MRR: Mean Reciprocal Rank — موقع أول نتيجة صحيحة
   - Latency: p95, p99

---

[← العودة للموديول](./01-vector-databases) | [🏠 الرئيسية](/)
