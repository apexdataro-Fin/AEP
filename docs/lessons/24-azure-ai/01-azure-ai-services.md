---
sidebar_position: 1
title: "Azure AI Services"
description: "Azure Cognitive Services, Azure Machine Learning, and AI infrastructure on Azure."
---

# Azure AI Services

Azure Cognitive Services, Azure Machine Learning, and AI infrastructure on Azure.

## What You Will Learn

This module covers key concepts, patterns, and real-world scenarios to build production-ready skills.

## Azure AI Portfolio

| Service            | Category      | Use Case                    |
| ------------------ | ------------- | --------------------------- |
| Azure OpenAI       | Generative AI | GPT models, embeddings      |
| Cognitive Services | Pre-built AI  | Vision, speech, language    |
| Azure ML           | ML Platform   | Training, deployment, MLOps |
| AI Search          | Search        | RAG, semantic search        |

## Azure OpenAI Quick Start

```python
from openai import AzureOpenAI
client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_KEY"],
    api_version="2024-02-01"
)
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Explain Kubernetes"}]
)
```

## CloudNova Exercise

Apply what you learned to a real production scenario at CloudNova.

---

[← Back to Module](index.md) | [🏠 Home](/)
