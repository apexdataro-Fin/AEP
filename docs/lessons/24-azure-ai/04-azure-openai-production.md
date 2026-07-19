---
sidebar_position: 4
title: "Azure OpenAI في الإنتاج"
description: "Azure OpenAI — GPT-4, Content Safety, Prompt Engineering, إنتاج."
---

# Azure OpenAI في الإنتاج

> "Azure OpenAI يمنحك GPT-4 مع أمان وخصوصية Azure."

## 🎯 أهداف التعلم

- نشر Azure OpenAI
- Content Safety filters
- Prompt Engineering
- Rate Limiting و Quotas

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Azure OpenAI

```python
from openai import AzureOpenAI

client = AzureOpenAI(
    api_key="xxx",
    api_version="2024-02-15-preview",
    azure_endpoint="https://cloudnova-aoai.openai.azure.com"
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "أنت مساعد Cloud Engineer."},
        {"role": "user", "content": "اشرح Kubernetes Deployment"}
    ],
    temperature=0.7,
    max_tokens=2000
)
```

### Content Safety

Content filters مدمجة: hate speech, violence, self-harm. قابلة للتخصيص.

### Best Practices

- Managed Identity للمصادقة
- سجّل كل الـ prompts للتدقيق
- Rate Limiting إجباري
- لا بيانات حساسة

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

نظام chatbot لدعم العملاء يستخدم GPT-4 عبر Azure OpenAI. Content Safety يمنع الـ jailbreak attempts تلقائياً.

### Prompt Engineering

```python
system_prompt = """أنت مساعد تقني لـ CloudNova.
قواعد:
1. أجب بالعربية فقط
2. لا تشارك معلومات حساسة
3. إذا كنت غير متأكد، قل 'لا أعرف'"""
```

---

## 🎨 Azure OpenAI vs OpenAI Direct

| | Azure OpenAI | OpenAI Direct |
|---|-------------|-------------|
| **البيانات** | تبقى في Azure tenant | تذهب لـ OpenAI |
| **Content Safety** | ✅ مدمج | محدود |
| **RBAC** | ✅ Azure AD | API key فقط |
| **SLA** | 99.9% | لا SLA |

---

## 🛠️ تدريبات

### تمرين: أنشئ Azure OpenAI deployment
### تحدي: ابنِ chatbot مع content safety

---

## 📝 تقييم

### ✅ فحص المعرفة
1. لماذا Azure OpenAI أفضل من OpenAI direct؟
2. كيف تحمي من prompt injection؟
3. ما فائدة Content Safety؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| Azure OpenAI | GPT-4 مُدار مع أمان Azure |
| Content Safety | فلترة المحتوى تلقائياً |
| Prompt Engineering | تصميم تعليمات النموذج |

---

## 🎤 مقابلة
1. **"Azure OpenAI vs OpenAI direct؟"** → Azure: أمان، خصوصية، SLA
2. **"كيف تمنع jailbreak؟"** → Content Safety + system prompt + rate limiting

---

[← ML Studio](./03-azure-machine-learning-studio) | [→ Vector Databases](../../25-vector-db/01-vector-databases) | [🏠 الرئيسية](/)
