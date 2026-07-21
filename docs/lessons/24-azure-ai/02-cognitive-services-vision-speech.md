---
sidebar_position: 2
title: "Cognitive Services الرؤية والصوت"
description: "Azure Vision، Speech، Language — خدمات الذكاء الاصطناعي الجاهزة."
---

# Cognitive Services الرؤية والصوت

> "لست بحاجة لتدريب نماذج. Azure Cognitive Services تمنحك الذكاء الجاهز."

## 🎯 أهداف التعلم

- Computer Vision API
- Face API
- Speech-to-Text و Text-to-Speech
- Translator

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🏗️ Computer Vision

```python
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes

client = ComputerVisionClient(endpoint, credentials)

analysis = client.analyze_image(url, visual_features=[
    VisualFeatureTypes.description,
    VisualFeatureTypes.tags,
    VisualFeatureTypes.objects
])

for tag in analysis.tags:
    print(f"{tag.name}: {tag.confidence:.2%}")
```

### Speech Services

```python
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(subscription=key, region="westeurope")

# Speech-to-Text
recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config)
result = recognizer.recognize_once()
print(result.text)

# Text-to-Speech
synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)
synthesizer.speak_text_async("مرحباً بكم في CloudNova")
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

نظام OCR لاستخراج البيانات من 10,000 فاتورة. Azure Form Recognizer استخرج 95% بدقة بدون تدريب أي نموذج.

### Cognitive Services vs Custom Models

|             | Cognitive Services | Custom Model    |
| ----------- | ------------------ | --------------- |
| **الوقت**   | دقائق              | أسابيع          |
| **الدقة**   | جيدة (80-95%)      | ممتازة (95-99%) |
| **التكلفة** | لكل استدعاء        | تدريب + hosting |

---

## 🎨 خدمات Azure AI

| الخدمة       | الاستخدام                                 |
| ------------ | ----------------------------------------- |
| **Vision**   | OCR, object detection, face recognition   |
| **Speech**   | STT, TTS, translation                     |
| **Language** | Sentiment, entity extraction, translation |
| **Decision** | Content moderation, anomaly detection     |

---

## 🛠️ تدريبات

### تمرين: حلل صورة مع Computer Vision API

### تحدي: ابنِ تطبيق STT يحول الصوت إلى نص ويترجمه

---

## 📝 تقييم

### ✅ فحص المعرفة

1. متى تستخدم Cognitive Services بدلاً من تدريب نموذج مخصص؟
2. ما الفرق بين Vision و Form Recognizer؟
3. كيف تترجم نصاً إلى العربية؟

### 🃏 بطاقات

| السؤال          | الإجابة                         |
| --------------- | ------------------------------- |
| Computer Vision | تحليل الصور: tags, objects, OCR |
| Speech Services | تحويل الصوت إلى نص والعكس       |
| Form Recognizer | استخراج بيانات من المستندات     |

---

## 🎤 مقابلة

1. **"كيف تبني نظام OCR بدون تدريب نموذج؟"** → Azure Form Recognizer
2. **"متى تنتقل من Cognitive Services إلى نموذج مخصص؟"** → عندما تحتاج دقة أعلى من 95%

---

[← Azure AI Services](./01-azure-ai-services) | [→ ML Studio](./03-azure-machine-learning-studio) | [🏠 الرئيسية](/)
