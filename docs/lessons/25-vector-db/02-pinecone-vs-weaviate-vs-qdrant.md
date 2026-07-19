---
sidebar_position: 2
title: "مقارنة قواعد البيانات المتجهة"
description: "Pinecone vs Weaviate vs Qdrant vs Milvus — مقارنة شاملة لاختيار Vector DB."
---

# مقارنة قواعد البيانات المتجهة

> "اختيار Vector DB يعتمد على ثلاثة أشياء: السرعة، التكلفة، التكامل."

## 🎯 أهداف التعلم

- مقارنة Pinecone, Weaviate, Qdrant, Milvus
- معايير الاختيار
- نماذج التسعير

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🏗️ مقارنة

| | Pinecone | Weaviate | Qdrant | Milvus |
|---|---------|----------|--------|--------|
| **Managed** | ✅ فقط | ✅ Cloud + Self-hosted | ✅ Cloud + Self-hosted | ✅ Zilliz Cloud |
| **Open Source** | ❌ | ✅ | ✅ | ✅ |
| **Filtering** | ✅ Metadata | ✅ GraphQL | ✅ Payload | ✅ Scalar |
| **Hybrid Search** | ❌ | ✅ BM25 + Vector | ❌ | ✅ |
| **التسعير** | $$$ | $$ | $ | مجاني (self-hosted) |
| **الأفضل لـ** | سهولة البدء | Hybrid search | أداء عالي | حجم كبير |

### متى تختار ماذا؟

- **Pinecone**: إذا كنت تبدأ بسرعة ولا تريد إدارة أي شيء
- **Weaviate**: إذا كنت تحتاج Hybrid Search (关键词 + vector)
- **Qdrant**: إذا كنت تحتاج أداء عالي وتكلفة منخفضة
- **Milvus**: إذا كان عندك مليارات الـ vectors

---

[← Vector Databases](./01-vector-databases) | [→ Hybrid Search](./03-hybrid-search-patterns) | [🏠 الرئيسية](/)
