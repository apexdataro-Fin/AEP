---
sidebar_position: 1
title: "خط أنابيب DevSecOps"
description: "دمج الأمان في CI/CD: SAST، DAST، SCA، فحص الحاويات، وأتمتة الأمان من اليوم الأول."
---

# خط أنابيب DevSecOps

> "الأمان ليس مرحلة بعد التطوير. الأمان يبدأ من أول commit."

## 🎯 أهداف التعلم

- فهم نموذج "Shift Left" في الأمان
- إتقان أدوات SAST و DAST و SCA
- بناء pipeline أمان كامل مع GitHub Actions
- فحص الحاويات والاعتماديات تلقائياً
- تطبيق سياسات الأمان كـ Code

---

## 📖 الطبقة الأساسية: لماذا DevSecOps؟

### المشكلة التقليدية

```
الفريق الأمني (قبل أسبوع من الإطلاق):
"وجدنا 47 ثغرة في التطبيق! لا يمكننا الإطلاق!"

فريق التطوير:
"لكننا انتهينا من التطوير منذ شهر!"

النتيجة: تأخير الإطلاق + توتر بين الفرق
```

### الحل: Shift Left Security

```
التطوير ────────► CI/CD ────────► الإنتاج
   │                │                │
   │  SAST          │  DAST          │  Monitoring
   │  SCA           │  Container     │  WAF
   │  Secrets       │  IaC Scan      │  SIEM
   │  Pre-commit    │  Policy Check  │  Threat Detection
   ▼                ▼                ▼
الأمان في كل مرحلة — ليس فقط في النهاية
```

---

## 🧱 الطبقة المهنية: أنواع فحص الأمان

### SAST — Static Application Security Testing

فحص الكود المصدري دون تنفيذه.

```yaml
# GitHub Actions: SAST مع Semgrep
security-sast:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: Semgrep SAST Scan
      uses: semgrep/semgrep-action@v1
      with:
        config: p/default
        generateSarif: "1"
      env:
        SEMGREP_RULES: >-
          p/python
          p/dockerfile
          p/terraform
          p/javascript

    - name: Upload SARIF
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: semgrep.sarif
```

**ما يكتشفه SAST:**

- SQL Injection
- XSS
- Hardcoded Secrets
- unsafe functions (`eval`, `exec`)
- Race conditions

### SCA — Software Composition Analysis

فحص المكتبات والاعتماديات الخارجية.

```yaml
# GitHub Actions: SCA مع Dependabot + OWASP
security-sca:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4

    - name: OWASP Dependency Check
      uses: dependency-check/Dependency-Check_Action@main
      with:
        project: cloudnova-api
        path: .
        format: HTML
        args: >
          --failOnCVSS 7
          --suppression suppressions.xml

    - name: pip-audit
      run: |
        pip install pip-audit
        pip-audit --strict
```

### DAST — Dynamic Application Security Testing

فحص التطبيق أثناء تشغيله (مثل المهاجم الحقيقي).

```yaml
# GitHub Actions: DAST مع OWASP ZAP
security-dast:
  runs-on: ubuntu-latest
  needs: [deploy-staging]
  steps:
    - name: ZAP Baseline Scan
      uses: zaproxy/action-baseline@v0.12.0
      with:
        target: https://staging.cloudnova.com
        rules_file_name: .zap/rules.tsv
        cmd_options: "-a -j -m 5"
```

### Container Scanning

```yaml
security-containers:
  runs-on: ubuntu-latest
  steps:
    - name: Trivy Scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: cloudnova.azurecr.io/api:${{ github.sha }}
        format: sarif
        severity: HIGH,CRITICAL
        exit-code: 1
        ignore-unfixed: true

    - name: Dockle Lint
      uses: hands-lab/dockle-action@v1
      with:
        image: cloudnova.azurecr.io/api:${{ github.sha }}
```

---

## 🏗️ الطبقة الإنتاجية: Pipeline أمني كامل

```yaml
name: Security Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 6 * * 1" # كل اثنين صباحاً

jobs:
  # 1. Secrets Detection
  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}

  # 2. SAST
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Semgrep
        uses: semgrep/semgrep-action@v1
        with:
          config: p/default

  # 3. SCA
  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Dependency Review
        uses: actions/dependency-review-action@v4

  # 4. IaC Scan
  iac-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: terraform/
          framework: terraform
          soft_fail: false

  # 5. Container Scan
  container-scan:
    needs: [build]
    runs-on: ubuntu-latest
    steps:
      - name: Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ vars.REGISTRY }}/api:${{ github.sha }}
          severity: CRITICAL,HIGH
          exit-code: 1

  # 6. DAST (فقط على staging)
  dast:
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: ZAP Scan
        uses: zaproxy/action-full-scan@v0.12.0
        with:
          target: https://staging.cloudnova.com
```

---

## 🎨 الطبقة المعمارية: Security as Code

### Open Policy Agent (OPA)

```rego
# policy/container.rego
package main

# منع containers بدون resource limits
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  not container.resources.limits
  msg := sprintf("%s: container %s missing resource limits",
    [input.metadata.name, container.name])
}

# منع containers بـ root
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  not container.securityContext.runAsNonRoot
  msg := sprintf("%s: container %s must run as non-root",
    [input.metadata.name, container.name])
}

# منع أحدث tag
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  endswith(container.image, ":latest")
  msg := "latest tag is forbidden"
}
```

### SBOM — Software Bill of Materials

```bash
# إنشاء قائمة كاملة بكل الاعتماديات
syft cloudnova.azurecr.io/api:v1.2.3 \
  --output spdx-json \
  --file sbom.json

# التوقيع باستخدام Cosign
cosign sign \
  --key azure-kv://cloudnova-kv.vault.azure.net/keys/cosign \
  cloudnova.azurecr.io/api:v1.2.3
```

---

## 🏥 سيناريو CloudNova: حادثة أمنية

```
📋  تنبيه أمني: SEC-2026-0042
المستوى: P1 - حرج
الوقت: 03:14 صباحاً

الحدث:
Dependabot اكتشف ثغرة Log4Shell في إحدى خدمات CloudNova.
المكتبة المصابة: log4j-core 2.14.1
الخطورة: CVSS 10.0

خطوات الاستجابة:
1. ✅ فتح تحقيق فوري
2. ✅ تحديد الخدمات المتأثرة (3 خدمات)
3. ✅ ترقية log4j إلى 2.17.1
4. ✅ فحص السجلات للكشف عن استغلال سابق
5. ✅ تدوير جميع الأسرار
6. ✅ تحديث WAF rules
7. 📋 تقرير ما بعد الحادثة
```

---

## ⚡ الإنتاج وما بعده

### أفضل ممارسات DevSecOps

| الممارسة               | التنفيذ                             |
| ---------------------- | ----------------------------------- |
| **Pre-commit hooks**   | talisman, git-secrets, pre-commit   |
| **Branch protection**  | require PR + status checks + review |
| **Secret rotation**    | تلقائي كل 90 يوماً                  |
| **Immutable tags**     | image digest بدلاً من `:latest`     |
| **Dependency pinning** | أقفال إصدارات محددة                 |
| **Network policies**   | Kubernetes NetworkPolicy            |
| **Runtime security**   | Falco لرصد السلوك المشبوه           |

---

## 🧠 التذكّر النشط

1. ما الفرق بين SAST و DAST؟ متى تستخدم كل منهما؟
2. لماذا فحص SCA مهم حتى لو كنت تكتب كوداً آمناً؟
3. كيف تمنع تسرب الأسرار إلى Git؟
4. ما هو SBOM ولماذا أصبح مطلباً في المؤسسات؟
5. كيف تستجيب لثغرة Log4Shell في بيئتك؟

## 🗣️ تمرين فاينمان

اشرح DevSecOps لمدير غير تقني:

"تخيل أنك تبني منزلاً. الطريقة القديمة: تبني المنزل كاملاً، ثم تستدعي خبير الأمان ليفحصه. المشكلة: قد تكتشف أن الأساس غير آمن وتحتاج هدم كل شيء! DevSecOps هو وجود المهندس الأمني معك من أول يوم، يفحص كل طوبة قبل وضعها."

## 🎤 أسئلة المقابلة

1. **"كيف تطبق Shift Left Security في مؤسسة؟"**
   - Pre-commit hooks لاكتشاف الأسرار
   - SAST في كل PR
   - Security Champions في كل فريق
   - Threat modeling قبل بدء التطوير

2. **"ما الفرق بين SAST و DAST و IAST؟"**
   - SAST: فحص الكود بدون تشغيل (مبكر، لكن false positives)
   - DAST: فحص التطبيق المشغّل (حقيقي، لكن متأخر)
   - IAST: يجمع الاثنين — فحص أثناء الاختبارات

3. **"كيف تحمي سلسلة التوريد (Supply Chain)؟"**
   - SBOM لكل artifact
   - توقيع الصور (Cosign/Sigstore)
   - فحص الاعتماديات (Dependabot/Renovate)
   - SLSA Framework للمصادقة على سلامة الـ build

---

## 🏛️ طبقة الإنتاج: Security Champions + Incident Response

### Security Champions Program

- كل فريق = Security Champion واحد
- تدريب أمني شهري + threat model review

### 🚨 CloudNova: Log4Shell

> Dependabot اكتشف Log4Shell (CVSS 10.0). 3 ساعات discovery → fix.

---

## 🛠️ تدريبات

**تمرين ١:** فعّل Semgrep. **تمرين ٢:** OPA policy. **تحدي:** SBOM + signing.

### 📝 تقييم

**س١:** SAST vs DAST؟ → SAST: static code. DAST: running app.
**س٢:** SCA = ؟ → تحليل مكتبات الطرف الثالث.
**س٣:** Shift Left = ؟ → الأمان من أول commit.

### 🎤 مقابلة

**"كيف تدمج الأمان في CI/CD؟"** → Pre-commit hooks + SAST + SCA + Container scan + DAST + IaC.

---

[← العودة للموديول](./01-security-pipeline) | [→ Container Security](./02-container-security) | [🏠 الرئيسية](/)
