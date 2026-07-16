---
sidebar_position: 1
title: "RAG Architecture"
description: "Retrieval-Augmented Generation: chunking, embeddings, retrieval, and generation."
---

# RAG Architecture

Retrieval-Augmented Generation: chunking, embeddings, retrieval, and generation.

## What You Will Learn

This module covers key concepts, patterns, and real-world scenarios to build production-ready skills.

## RAG Pipeline

```mermaid
graph LR
    Q[User Query] --> E[Embed Query]
    E --> VS[Vector Search]
    VS --> D[(Documents)]
    D --> P[Prompt: Context + Query]
    P --> LLM[LLM Generation]
    LLM --> R[Response]
```

## Key RAG Decisions

| Decision          | Options                                   |
| ----------------- | ----------------------------------------- |
| Chunking          | Fixed-size, semantic, recursive           |
| Embedding model   | text-embedding-3-small, ada-002           |
| Retrieval         | Top-k, similarity threshold, hybrid       |
| Generation prompt | System prompt, few-shot, chain-of-thought |

## CloudNova Exercise

Apply what you learned to a real production scenario at CloudNova.

---

[← Back to Module](index.md) | [🏠 Home](/)
