---
sidebar_position: 3
title: "فحص الأمان في CI/CD"
description: "SAST، DAST، SCA — دمج فحص الأمان في خط أنابيب CI/CD."
---

# فحص الأمان في CI/CD

> "لا تنتظر penetration test سنوياً. افحص الأمان مع كل commit."

## 🎯 أهداف التعلم

- دمج SAST (Static Analysis) في CI/CD
- دمج DAST (Dynamic Analysis) للـ APIs
- SCA (Software Composition Analysis) للتبعيات
- فشل البناء عند اكتشاف ثغرات عالية

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ أدوات الفحص

| النوع | الأداة | ماذا تفحص |
|-------|--------|-----------|
| **SAST** | SonarQube, Semgrep, CodeQL | كود المصدر |
| **SCA** | Snyk, Dependabot, Trivy | المكتبات والتبعيات |
| **DAST** | OWASP ZAP, Burp Suite | التطبيق الحي |
| **Container** | Trivy, Aqua, Snyk | صور الحاويات |

### SAST مع Semgrep

```yaml
- name: Semgrep SAST
  uses: semgrep/semgrep-action@v1
  with:
    config: p/owasp-top-ten
    fail-on: error
```

### OWASP ZAP DAST

```yaml
- name: DAST Scan
  run: |
    docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable zap-baseline.py \
      -t https://staging.cloudnova.com \
      -r zap-report.html
```

### فحص التبعيات

```yaml
- name: SCA - Snyk
  uses: snyk/actions/python@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    command: test
    args: --severity-threshold=high
```

---

## 🛠️ تدريب

أضف 3 مراحل أمان إلى CI/CD Pipeline:
1. SAST يفحص الكود
2. SCA يفحص التبعيات
3. يفشل البناء عند أي HIGH أو CRITICAL

---

[← Advanced Deployment](./02-advanced-deployment) | [→ DORA Metrics](./04-cicd-metrics-dora) | [🏠 الرئيسية](/)
