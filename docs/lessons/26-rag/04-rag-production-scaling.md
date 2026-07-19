---
sidebar_position: 4
title: "RAG في الإنتاج"
description: "RAG Production — Scaling، Caching، Monitoring، A/B Testing."
---

# RAG في الإنتاج

> "RAG في الـ notebook مختلف تماماً عن RAG في الإنتاج."

## 🎯 أهداف التعلم

- Scaling RAG لآلاف المستخدمين
- Semantic Caching
- Monitoring RAG performance
- A/B Testing الـ prompts

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Advanced

---

## 🏗️ Semantic Cache

```python
from redis import Redis
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
redis_client = Redis(host='cache.redis', port=6379)

def cached_rag(question):
    q_embedding = model.encode(question)
    
    # البحث في cache
    cached = redis_client.get(f"rag:{hash(q_embedding.tobytes())}")
    if cached:
        return json.loads(cached)
    
    # RAG عادي
    answer = rag_pipeline(question)
    redis_client.setex(f"rag:{hash(q_embedding.tobytes())}", 3600, json.dumps(answer))
    return answer
```

### Monitoring

```python
# تتبع كل استعلام
metrics = {
    "retrieval_latency_ms": [],
    "generation_latency_ms": [],
    "total_tokens": [],
    "cache_hit_rate": [],
}

def monitored_rag(question):
    start = time.time()
    docs = retrieve(question)
    metrics["retrieval_latency_ms"].append((time.time() - start) * 1000)
    
    start = time.time()
    answer = generate(question, docs)
    metrics["generation_latency_ms"].append((time.time() - start) * 1000)
    
    prometheus.push(metrics)
    return answer
```

---

[← RAG Evaluation](./03-rag-evaluation-ragas) | [→ AI Agents](../../27-ai-agents/01-ai-agents) | [🏠 الرئيسية](/)
