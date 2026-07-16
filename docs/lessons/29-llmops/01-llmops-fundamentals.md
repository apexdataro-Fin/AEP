---
sidebar_position: 1
title: "أساسيات LLMOps"
description: "LLMOps: إدارة نماذج اللغة الكبيرة، التقييم، التوليف، والمراقبة لنماذج مثل GPT-4."
---

# أساسيات LLMOps

> "LLMOps ليس مجرد MLOps مع LLMs. تحديات جديدة: التكلفة، الـ latency، وجودة المخرجات غير الحتمية."

## 🎯 أهداف التعلم

- فهم كيف يختلف LLMOps عن MLOps التقليدي
- إتقان Prompt Management وإصداراته
- تقييم جودة نماذج LLM في الإنتاج
- إدارة التكاليف والـ rate limits
- بناء CI/CD لـ LLM applications

---

## 📖 الطبقة الأساسية: LLMOps vs MLOps

```
MLOps (نموذج تقليدي):
├── Accuracy, Precision, Recall (مقاييس واضحة)
├── تدريب → تقييم → نشر
├── مخرجات حتمية (نفس المدخل = نفس المخرج)
└── الـ model هو الأهم

LLMOps (نماذج اللغة):
├── جودة النص، Faithfulness، Relevance (مقاييس غير واضحة)
├── Prompt → Evaluate → Deploy → Monitor → Iterate
├── مخرجات غير حتمية (نفس المدخل ≠ نفس المخرج)
└── الـ prompt + context أهم من الـ model أحياناً
```

### تحديات LLMOps الفريدة

| التحدي          | MLOps التقليدي          | LLMOps                          |
| --------------- | ----------------------- | ------------------------------- |
| **التقييم**     | مقاييس رياضية واضحة     | تقييم بشري + آلي                |
| **الـ latency** | < 10ms غالباً           | 500ms - 5s                      |
| **التكلفة**     | تكلفة التدريب مرة واحدة | تكلفة لكل استدعاء               |
| **التحكم**      | تتحكم في النموذج كاملاً | تستخدم API (نموذج طرف ثالث)     |
| **النسخة**      | Model version           | Model + Prompt + Config version |

---

## 🧱 الطبقة المهنية: Prompt Management

### إصدار الـ Prompts

```python
# prompts/v2.1.0.yaml
version: "2.1.0"
model: gpt-4
temperature: 0.3
max_tokens: 1000

system: |
  أنت مساعد تقني لـ CloudNova.
  مسؤولياتك:
  - الإجابة عن أسئلة Azure والخدمات السحابية
  - المساعدة في حل المشكلات التقنية
  - التوصية بأفضل الممارسات

  قواعد:
  - كن دقيقاً وموجزاً
  - إذا كنت غير متأكد، قل أنك غير متأكد
  - استشهد بالمصادر عندما يكون ذلك ممكناً

few_shot_examples:
  - user: "كيف أنشر تطبيق Python؟"
    assistant: |
      3 طرق رئيسية لنشر تطبيق Python على Azure:
      1. **App Service** (الأسهل) — لتطبيقات الويب
      2. **Azure Functions** (للـ serverless)
      3. **AKS** (للتحكم الكامل)

      أيها يناسب حالتك؟
```

### Prompt Testing

```python
class PromptTester:
    """اختبار الـ prompts بشكل منهجي"""

    def __init__(self, client, prompt_config):
        self.client = client
        self.config = prompt_config

    def test_single(self, test_case: dict) -> dict:
        """اختبار حالة واحدة"""
        response = self.client.chat.completions.create(
            model=self.config["model"],
            temperature=self.config["temperature"],
            max_tokens=self.config["max_tokens"],
            messages=[
                {"role": "system", "content": self.config["system"]},
                {"role": "user", "content": test_case["input"]}
            ]
        )
        return {
            "input": test_case["input"],
            "expected": test_case["expected_output"],
            "actual": response.choices[0].message.content,
            "tokens": response.usage.total_tokens,
            "latency_ms": response.response_ms
        }

    def evaluate_batch(self, test_cases: list) -> dict:
        """تقييم مجموعة اختبارات"""
        results = [self.test_single(tc) for tc in test_cases]

        return {
            "total_tests": len(results),
            "avg_tokens": np.mean([r["tokens"] for r in results]),
            "avg_latency": np.mean([r["latency_ms"] for r in results]),
            "cost_estimate": sum([r["tokens"] for r in results]) * 0.00003,
            "results": results
        }
```

---

## 🏗️ الطبقة الإنتاجية: CI/CD للـ LLM Apps

```yaml
name: LLM App CI/CD

on:
  push:
    paths:
      - "prompts/**"
      - "src/**"

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Eval Suite
        run: python -m pytest tests/eval/
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Check Quality Gates
        run: |
          python -c "
          import json
          with open('eval_results.json') as f:
              results = json.load(f)
          assert results['faithfulness'] >= 0.85, 'Faithfulness too low'
          assert results['latency_p95'] <= 3.0, 'Latency too high'
          print('✅ Quality gates passed')
          "

  deploy-staging:
    needs: evaluate
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: |
          az ml online-deployment update \
            --name staging \
            --endpoint cloudnova-llm

  integration-test:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Smoke Test
        run: python tests/smoke_test.py --endpoint staging

  deploy-production:
    needs: integration-test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Blue/Green Deploy
        run: |
          python deploy.py \
            --strategy canary \
            --canary-percent 10 \
            --observation-period 30m
```

---

## 🎨 الطبقة المعمارية: تقييم LLM

### مقاييس الجودة

```python
from deepeval import evaluate
from deepeval.metrics import (
    FaithfulnessMetric,
    AnswerRelevancyMetric,
    ContextualPrecisionMetric,
    HallucinationMetric,
    ToxicityMetric
)
from deepeval.test_case import LLMTestCase

# حالة اختبار
test_case = LLMTestCase(
    input="ما هو Azure Kubernetes Service؟",
    actual_output="AKS هي خدمة Kubernetes مُدارة من Microsoft...",
    expected_output="AKS هي خدمة Kubernetes مُدارة...",
    retrieval_context=[
        "Azure Kubernetes Service (AKS) simplifies deploying"
        " a managed Kubernetes cluster in Azure..."
    ]
)

# تقييم
metrics = [
    FaithfulnessMetric(threshold=0.8),
    AnswerRelevancyMetric(threshold=0.8),
    HallucinationMetric(threshold=0.1),
    ToxicityMetric(threshold=0.1)
]

results = evaluate([test_case], metrics)
print(f"Overall Score: {results.overall_score}")
```

### مقارنة النماذج

```python
def compare_models(prompt: str, models: list[str], test_cases: list):
    """مقارنة أداء نماذج مختلفة"""

    for model_name in models:
        client = AzureOpenAI(deployment_name=model_name)
        scores = []

        for test in test_cases:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": prompt + test["input"]}],
                temperature=0
            )

            # تقييم الجودة
            score = evaluate_response(response, test["expected"])
            scores.append(score)

        print(f"""
        {model_name}:
          Accuracy: {np.mean(scores):.2%}
          Avg Latency: {avg_latency:.0f}ms
          Avg Cost: ${avg_cost:.4f}/call
          Cost-Quality Ratio: {np.mean(scores)/avg_cost:.2f}
        """)

# مثال:
compare_models(
    prompt="أنت مساعد Azure...",
    models=["gpt-4", "gpt-35-turbo", "gpt-4o"],
    test_cases=[...]
)
```

---

## 🏥 سيناريو CloudNova: تحسين LLM App

```
📋 المشكلة: مساعد الدعم بطيء ومكلف

التحليل:
├── GPT-4 لكل الأسئلة (حتى البسيطة!)
├── استدعاء API لكل سؤال (لا caching!)
└── Prompt طويل جداً (> 3000 tokens)

التحسينات:

1. تصنيف الأسئلة:
   ├── أسئلة بسيطة → GPT-3.5 (أرخص 10x)
   └── أسئلة معقدة → GPT-4

2. Caching:
   ├── Redis cache للأسئلة المتكررة
   └── TTL: ساعة واحدة

3. Prompt Optimization:
   ├── تقليل الـ system prompt من 500 لـ 200 token
   ├── Dynamic few-shot (أمثلة حسب نوع السؤال)
   └── Chain-of-Thought للأسئلة المعقدة فقط

النتيجة:
├── التكلفة: من $450/يوم إلى $85/يوم (توفير 81%)
├── الـ latency: من 2.8s إلى 0.9s
└── الجودة: نفس المستوى!
```

---

## ⚡ الإنتاج وما بعده

### LLMOps Checklist

```
□ هل الـ prompts مخزنة في Git مع history؟
□ هل هناك eval pipeline قبل كل deployment؟
□ هل التكاليف مراقبة مع تنبيهات؟
□ هل هناك A/B testing للـ prompts الجديدة؟
□ هل الـ latency مراقب (p50, p95, p99)؟
□ هل هناك fallback عند فشل الـ LLM؟
□ هل المحتوى الضار ممنوع مع content filter؟
```

---

## 🧠 التذكّر النشط

1. كيف يختلف LLMOps عن MLOps التقليدي؟
2. كيف تقيم جودة LLM إحصائياً؟
3. متى تستخدم GPT-4 ومتى GPT-3.5؟
4. كيف تدير إصدارات الـ prompts؟
5. كيف تقلل تكاليف LLM في الإنتاج؟

## 📝 بطاقات تعليمية

- **LLMOps**: ممارسات إدارة LLMs في الإنتاج (أوسع من MLOps)
- **Prompt Versioning**: إدارة إصدارات الـ prompts كما ندير الكود
- **Hallucination**: توليد LLM لمعلومات غير صحيحة تبدو مقنعة
- **Few-shot**: إعطاء النموذج أمثلة قليلة في الـ prompt
- **Chain-of-Thought**: طلب من النموذج "التفكير خطوة بخطوة"

## 🎤 أسئلة المقابلة

1. **"كيف تختبر LLM Application؟"**
   - Unit tests: الـ prompt template + الأدوات
   - Integration tests: RAG pipeline كامل
   - Eval tests: Faithfulness, Relevancy, Hallucination
   - Human eval: مراجعة بشرية دورية

2. **"كيف تمنع الـ hallucinations؟"**
   - RAG مع مصادر موثوقة
   - Temperature منخفض (0.1-0.3)
   - "لا أعرف" كإجابة مقبولة
   - Grounding check قبل عرض الإجابة

3. **"ما الفرق بين Prompt Engineering و Fine-tuning؟"**
   - Prompt Engineering: تعديل النص المدخل (سريع، رخيص)
   - Fine-tuning: تعديل أوزان النموذج (أفضل جودة، أغلى)

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
