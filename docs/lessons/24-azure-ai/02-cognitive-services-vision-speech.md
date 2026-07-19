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

# تحليل صورة
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

[← Azure AI Services](./01-azure-ai-services) | [→ ML Studio](./03-azure-machine-learning-studio) | [🏠 الرئيسية](/)
