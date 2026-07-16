---
sidebar_position: 1
title: "Vector Databases"
description: "Embeddings, similarity search, Pinecone, pgvector, and Azure AI Search."
---

# Vector Databases

Embeddings, similarity search, Pinecone, pgvector, and Azure AI Search.

## What You Will Learn

This module covers key concepts, patterns, and real-world scenarios to build production-ready skills.

## What are Vector Databases?

Vector databases store data as mathematical vectors (embeddings) and enable semantic similarity search — finding content by meaning, not keywords.

## How Embeddings Work

```
"Kubernetes is a container orchestrator" → [0.12, -0.45, 0.78, ...]  (1536 dimensions)
"Docker runs containers"              → [0.11, -0.43, 0.75, ...]  (very close!)
"I like pizza"                        → [-0.67, 0.23, -0.12, ...] (far away)
```

| Database        | Type           | Best For                |
| --------------- | -------------- | ----------------------- |
| Pinecone        | Managed        | Production RAG          |
| pgvector        | PostgreSQL ext | Existing Postgres users |
| Chroma          | Open source    | Prototyping             |
| Azure AI Search | Managed        | Azure-native RAG        |

## CloudNova Exercise

Apply what you learned to a real production scenario at CloudNova.

---

[← Back to Module](index.md) | [🏠 Home](/)
