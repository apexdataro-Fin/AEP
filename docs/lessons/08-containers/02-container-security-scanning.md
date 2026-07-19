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

## 🏗️ Trivy — فحص الصور

```bash
trivy image nginx:latest
trivy image --severity HIGH,CRITICAL cloudnova-api:v1.2.3

# في CI/CD
trivy image --exit-code 1 --severity CRITICAL cloudnova-api:${{ github.sha }}
```

### GitHub Actions مع Trivy

```yaml
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'ghcr.io/cloudnova/api:${{ github.sha }}'
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
    exit-code: '1'
```

### توقيع الصور مع Cosign

```bash
cosign generate-key-pair
cosign sign --key cosign.key ghcr.io/cloudnova/api:v1.2.3
cosign verify --key cosign.pub ghcr.io/cloudnova/api:v1.2.3
```

---

## 🏛️ سيناريو CloudNova

اكتشف Trivy ثغرة CRITICAL في `log4j` داخل صورة Java قديمة. الفريق:
1. أوقف نشر الصورة فوراً (exit-code: 1)
2. حدث الـ base image
3. أعاد بناء الصورة وفحصها مرة أخرى
4. نشرها بعد التأكد من النظافة

---

## 🛠️ تدريب

1. شغّل Trivy على صورة `python:3.9` وحدد عدد الثغرات
2. ابنِ GitHub Actions workflow يرفض أي صورة فيها CRITICAL vulnerabilities

---

[← Container Fundamentals](./01-container-fundamentals) | [→ Orchestration Comparison](./03-container-orchestration-comparison) | [🏠 الرئيسية](/)
