---
sidebar_position: 2
title: "أمن الحاويات وفحص الثغرات"
description: "Container Security، Trivy، Snyk، Aqua — فحص صور الحاويات وتأمينها في CI/CD."
---

# أمن الحاويات وفحص الثغرات

> "الحاوية غير المفحوصة هي قنبلة موقوتة في بيئة الإنتاج."

## 🎯 أهداف التعلم

- فحص صور الحاويات بحثاً عن الثغرات
- دمج الفحص في CI/CD pipeline
- توقيع الصور مع Cosign/Sigstore
- فهم SLSA Framework

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

---

## 🧠 الطبقة البسيطة

تخيل أنك تشتري سيارة مستعملة. قبل أن تقودها، تفحصها عند ميكانيكي. Trivy هو الميكانيكي: يفحص صورة الحاوية بحثاً عن "عيوب" (ثغرات) قبل أن تنشرها في الإنتاج.

---

## 🏗️ Trivy — فحص الصور

```bash
# فحص سريع
trivy image nginx:latest
trivy image --severity HIGH,CRITICAL cloudnova-api:v1.2.3

# فحص ملف نظام (وليس صورة فقط)
trivy fs --severity CRITICAL /

# في CI/CD — فشل البناء عند اكتشاف CRITICAL
trivy image --exit-code 1 --severity CRITICAL cloudnova-api:${{ github.sha }}
```

### GitHub Actions مع Trivy

```yaml
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: "ghcr.io/cloudnova/api:${{ github.sha }}"
    format: "sarif"
    output: "trivy-results.sarif"
    severity: "CRITICAL,HIGH"
    exit-code: "1"
```

### توقيع الصور مع Cosign

```bash
cosign generate-key-pair
cosign sign --key cosign.key ghcr.io/cloudnova/api:v1.2.3
cosign verify --key cosign.pub ghcr.io/cloudnova/api:v1.2.3
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

اكتشف Trivy ثغرة CRITICAL في `log4j` داخل صورة Java قديمة.

**الاستجابة**:

1. أوقف نشر الصورة فوراً (exit-code: 1 منع deployment)
2. حدث الـ base image إلى `eclipse-temurin:21-jre`
3. أعاد بناء الصورة وفحصها مرة أخرى
4. نشرها بعد التأكد من النظافة

**الدرس**: الفحص الآلي في CI/CD وفر علينا كارثة. بدون Trivy، كنا سننشر ثغرة log4j في الإنتاج.

### SLSA Framework

| Level      | المتطلبات                        |
| ---------- | -------------------------------- |
| **SLSA 1** | البناء مؤتمت                     |
| **SLSA 2** | استخدام أدوات تحكم بالنسخ        |
| **SLSA 3** | توقيع الصور + audit log          |
| **SLSA 4** | مراجعة مزدوجة + بيئة بناء معزولة |

---

## 🎨 طبقة المعماري

### Trivy vs Snyk vs Aqua

|                 | Trivy            | Snyk           | Aqua       |
| --------------- | ---------------- | -------------- | ---------- |
| **Open Source** | ✅               | ❌             | ❌         |
| **السعر**       | مجاني            | $$$            | $$$        |
| **CI/CD**       | GitHub Actions   | GitHub Actions | Pipeline   |
| **UI**          | CLI              | Dashboard      | Enterprise |
| **الأفضل لـ**   | فرق صغيرة-متوسطة | Enterprise     | Enterprise |

---

## 🛠️ تدريبات

### تمرين 1: فحص صورة

```bash
trivy image python:3.9
# كم ثغرة CRITICAL و HIGH وجدت؟
```

### تمرين 2: CI/CD Pipeline

ابنِ GitHub Actions workflow يرفض أي صورة فيها CRITICAL vulnerabilities.

### تحدي: توقيع الصور

وقع صورة Docker مع Cosign وتحقق من التوقيع قبل النشر.

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما فائدة Trivy في CI/CD؟
2. كيف تمنع نشر صورة مصابة بثغرات؟
3. ما هو SLSA Framework؟
4. لماذا توقيع الصور مهم؟
5. ما الفرق بين SCA و SAST في سياق الحاويات؟

### 🃏 بطاقات

| السؤال          | الإجابة                                    |
| --------------- | ------------------------------------------ |
| Trivy           | أداة مفتوحة المصدر لفحص ثغرات الحاويات     |
| Cosign          | توقيع صور الحاويات رقمياً                  |
| SLSA            | Supply-chain Levels for Software Artifacts |
| `--exit-code 1` | يفشل البناء عند اكتشاف ثغرات               |

---

## 🎤 مقابلة

1. **"كيف تؤمن سلسلة توريد الحاويات؟"**
   → Trivy scan + Cosign signing + SBOM + SLSA compliance
2. **"ماذا تفعل عند اكتشاف CVE في صورة إنتاج؟"**
   → تقييم الخطورة → تحديث base image → إعادة بناء → نشر

---

## 📚 مراجع

| النوع     | الرابط                                                               |
| --------- | -------------------------------------------------------------------- |
| درس مرتبط | [Orchestration Comparison](./03-container-orchestration-comparison)  |
| درس مرتبط | [Docker Security](../../09-docker/03-docker-security-best-practices) |
| أداة      | [Trivy](https://github.com/aquasecurity/trivy)                       |

---

[← Container Fundamentals](./01-container-fundamentals) | [→ Orchestration Comparison](./03-container-orchestration-comparison) | [🏠 الرئيسية](/)
