---
sidebar_position: 1
title: "CI/CD — من الكود إلى الإنتاج"
description: "GitHub Actions، Azure DevOps، استراتيجيات النشر، إدارة الأسرار، الحماية البيئية، والتراجع الآمن."
---

# CI/CD — من الكود إلى الإنتاج

> **"كل دقيقة تقضيها في النشر اليدوي هي دقيقة لا تُصلح فيها مشاكل حقيقية. أتمتة كل شيء — لكن بأمان."**

## 🎯 أهداف التعلم

بعد إكمال هذا الدرس، ستكون قادراً على:

- بناء Pipeline كامل من commit إلى إنتاج بثقة
- اختيار استراتيجية النشر المناسبة (Rolling, Blue-Green, Canary)
- إدارة الأسرار بأمان في CI/CD
- حماية بيئة الإنتاج من النشرات الخاطئة
- التراجع بأمان عند فشل النشر

---

## ١. ما هو CI/CD؟ — بعمق

| الحرف  | المعنى                 | السؤال                 | المثال من CloudNova                  |
| ------ | ---------------------- | ---------------------- | ------------------------------------ |
| **CI** | Continuous Integration | "هل الكود يشتغل معاً؟" | Build + Test تلقائي عند كل PR        |
| **CD** | Continuous Delivery    | "هل هو جاهز للنشر؟"    | نشر تلقائي لـ staging، إنتاج بموافقة |
| **CD** | Continuous Deployment  | "هل نُشر للمستخدمين؟"  | نشر تلقائي بالكامل للإنتاج           |

### 🟢 التفسير البسيط

تخيل خط إنتاج في مصنع. كل قطعة تمر بمراحل: فحص، تركيب، اختبار، تغليف، شحن. لو فشلت في أي مرحلة — تتوقف. هذا هو CI/CD للكود: خط إنتاج آلي للبرمجيات.

---

## ٢. مراحل الـ Pipeline الكاملة

```mermaid
graph LR
    A[Git Push] --> B[Build]
    B --> C[Unit Tests]
    C --> D[SAST Scan]
    D --> E[Container Build]
    E --> F[Container Scan]
    F --> G[Deploy Staging]
    G --> H[Integration Tests]
    H --> I{Approve?}
    I -->|Yes| J[Canary 10%]
    J --> K[Monitor 5min]
    K --> L{Metrics OK?}
    L -->|Yes| M[Deploy 100%]
    L -->|No| N[Rollback]
    I -->|No| O[Notify]
    M --> P[Smoke Tests]
```

---

## ٣. استراتيجيات النشر — متى تستخدم ماذا؟

### Rolling Deployment

```yaml
# Kubernetes: استبدل Pods واحدة تلو الأخرى
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 2 # أنشئ ٢ Pods جديدة قبل حذف القديمة
    maxUnavailable: 1 # لا تفقد أكثر من Pod واحد أثناء النشر
```

**متى تستخدم:** أغلب النشرات اليومية. آمن، تدريجي، بسيط.

### Blue-Green Deployment

```mermaid
graph LR
    A[Blue - الإصدار الحالي v1] --> B[Green - الإصدار الجديد v2]
    B --> C{اختبار Green}
    C -->|نجح| D[بدل الحركة لـ Green]
    C -->|فشل| E[احذف Green]
    D --> F[Blue يصبح inactive]
```

**متى تستخدم:** عندما تحتاج تراجعاً فورياً (instant rollback). تكلفة مضاعفة (ضعف الموارد).

### Canary Deployment

```yaml
# Istio VirtualService: ١٠٪ من الحركة للإصدار الجديد
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
spec:
  http:
    - route:
        - destination:
            host: api
            subset: v1
          weight: 90 # ٩٠٪ للإصدار الحالي
        - destination:
            host: api
            subset: v2
          weight: 10 # ١٠٪ للإصدار الجديد
```

**متى تستخدم:** نشرات عالية المخاطر. اختبر في الإنتاج الحقيقي بحذر.

### متى تستخدم كل استراتيجية؟

| السيناريو                 | الاستراتيجية | لماذا؟                      |
| ------------------------- | ------------ | --------------------------- |
| تحديث يومي بسيط           | Rolling      | سريع، بسيط، آمن             |
| تغيير كبير في معمارية API | Canary       | اختبر على ٥٪ أولاً          |
| ترقية قاعدة بيانات        | Blue-Green   | تراجع فوري لو فشلت          |
| تغيير ConfigMap فقط       | Rolling      | بسيط، تأثير منخفض           |
| يوم الجمعة ٤ مساءً        | لا تنشر!     | لا أحد يريد استدعاء weekend |

---

## ٤. إدارة الأسرار في CI/CD

### ❌ ما لا تفعله أبداً

```yaml
# ❌❌❌ خطر مميت
env:
  DATABASE_URL: "postgres://user:SuperSecret123@prod-db:5432/cloudnova"
  AZURE_CLIENT_SECRET: "abc123..."
  # ← هذه الأسرار الآن في تاريخ git + مرئية في سجلات GitHub Actions!
```

### ✅ الطريقة الآمنة

```yaml
# ✅ استخدم GitHub Secrets
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}

steps:
  - name: Deploy
    run: |
      # السر موجود فقط في الذاكرة أثناء التنفيذ
      az login --service-principal \
        -u ${{ secrets.AZURE_CLIENT_ID }} \
        -p ${{ secrets.AZURE_CLIENT_SECRET }}
```

### 🟣 المستوى المتقدم: Workload Identity Federation

```yaml
# الأفضل: لا أسرار على الإطلاق!
# GitHub Actions ↔ Azure بدون secrets
- name: Azure Login (OIDC)
  uses: azure/login@v2
  with:
    client-id: ${{ secrets.AZURE_CLIENT_ID }}
    tenant-id: ${{ secrets.AZURE_TENANT_ID }}
    # لا client-secret! المصادقة عبر OpenID Connect
```

---

## ٥. حماية بيئة الإنتاج

### Environment Protection Rules

```yaml
# في GitHub:
# Settings → Environments → production
# Protection rules:

# ١. Required reviewers
#    - على الأقل ٢ من كبار المهندسين يوافقون

# ٢. Wait timer
#    - انتظر ٥ دقائق قبل النشر (للتفكير)

# ٣. Deployment branches
#    - فقط من main (وليس من أي فرع)

# ٤. Restricted secrets
#    - أسرار الإنتاج لا تظهر إلا لـ production environment
```

### 🚨 قصة CloudNova: لماذا تحتاج حماية البيئة؟

> **الموقف:** مهندس جديد يعمل على `feature/new-login`. بالخطأ، عدّل GitHub Actions workflow ليشير إلى production بدل staging. Pipeline اشتغل ونشر كود غير مكتمل للإنتاج. ٤ دقائق تعطل.

**كيف نمنع التكرار:**

```yaml
# ١. افصل production secrets
#    staging secrets ≠ production secrets
#    حتى لو تسرب staging — لا يصل للإنتاج

# ٢. environment: production يحمي
jobs:
  deploy-prod:
    environment: production # ← هذا الكلمة تحمي
    # الآن: Required reviewers + Wait timer + Branch protection

# ٣. deployment protection rule
#    أي deployment لـ production يحتاج موافقة من Lead Engineer
```

---

## ٦. التراجع الآمن (Rollback)

### ماذا تفعل عندما يفشل النشر؟

```bash
# 🚨 النشر فشل — ٣٠٪ من المستخدمين يرون errors

# الخطوة ١: تراجع فوراً (Rolling deployment)
kubectl rollout undo deployment/api
# يعود لآخر نسخة ناجحة — أقل من ٣٠ ثانية

# الخطوة ٢: تأكد
kubectl rollout status deployment/api
curl -s https://api.cloudnova.com/health | grep "ok"

# الخطوة ٣: حقق لاحقاً
kubectl logs deployment/api --tail=100
kubectl describe deployment api
```

### 🟣 استراتيجية التراجع الذكي

```yaml
# Kubernetes deployment مع تراجع تلقائي
apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3
  revisionHistoryLimit: 5 # احتفظ بآخر ٥ نسخ للتراجع
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 0 # لا تفقد أي Pod
  template:
    spec:
      containers:
        - name: api
          image: ghcr.io/cloudnova/api:v2.4.1
          readinessProbe: # تأكد قبل استقبال الحركة
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 3
            failureThreshold: 3 # بعد ٣ فشل ← أوقف النشر
```

---

## ٧. GitHub Actions — Pipeline كامل

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup & Test
        run: |
          pip install -r requirements.txt
          ruff check .
          pytest --cov=. --cov-report=xml

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SAST Scan
        uses: github/codeql-action/analyze@v3
      - name: Secret Scan
        run: pip install detect-secrets && detect-secrets scan --all-files
      - name: IaC Scan
        uses: bridgecrewio/checkov-action@master
        with:
          directory: terraform/

  build:
    needs: [test, security]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Push
        run: |
          docker build -t $REGISTRY/$IMAGE_NAME:${{ github.sha }} .
          echo ${{ secrets.GITHUB_TOKEN }} | docker login $REGISTRY -u ${{ github.actor }} --password-stdin
          docker push $REGISTRY/$IMAGE_NAME:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production # ← حماية البيئة
    steps:
      - name: Deploy
        run: |
          kubectl set image deployment/api api=$REGISTRY/$IMAGE_NAME:${{ github.sha }}
          kubectl rollout status deployment/api --timeout=5m
      - name: Smoke Test
        run: curl -f https://api.cloudnova.com/health
```

---

## 🧠 أسئلة للمراجعة النشطة

1. ما الفرق بين Continuous Delivery و Continuous Deployment؟
2. متى تستخدم Canary Deployment بدلاً من Rolling؟
3. كيف تحمي أسرار الإنتاج في CI/CD؟
4. ما هي Environment Protection Rules ولماذا هي مهمة؟
5. كم ثانية يستغرق `kubectl rollout undo` للتراجع؟

## ✍️ تمرين Feynman

اشرح Canary Deployment لشخص غير تقني باستخدام تشبيه "تذوق الحساء قبل تقديمه للضيوف".

## 🎴 بطاقات مراجعة

| السؤال                                | الإجابة                                |
| ------------------------------------- | -------------------------------------- |
| أمر للتراجع عن آخر نشر Kubernetes     | `kubectl rollout undo deployment/name` |
| استراتيجية نشر للتراجع الفوري         | Blue-Green                             |
| استراتيجية نشر للاختبار في الإنتاج    | Canary                                 |
| كيفية إخفاء الأسرار في GitHub Actions | `${{ secrets.NAME }}`                  |

## 🎤 أسئلة مقابلة العمل

1. **"كيف تنشر تغييراً خطيراً دون المخاطرة بكل المستخدمين؟"** ← Canary deployment + monitoring + auto-rollback
2. **"ما الفرق بين GitHub Actions و Azure DevOps؟"** ← اشرح نقاط القوة والضعف
3. **"كيف تضمن أن نشر الإنتاج لا يحدث بدون موافقة؟"** ← Environment protection + branch rules + required reviewers

---

---

## 🏛️ طبقة الإنتاج: Pipeline في المؤسسة

### متى يفشل CI/CD؟

| السبب            | المثال                          | الوقاية                |
| ---------------- | ------------------------------- | ---------------------- |
| **Flaky tests**  | test ينجح أحياناً ويفشل أحياناً | quarantine + fix       |
| **Secret leak**  | `echo $SECRET` في log           | GitHub push protection |
| **Drift**        | شخص عدّل شيئاً يدوياً في K8s    | GitOps + selfHeal      |
| **Deploy storm** | 5 deployments متزامنة           | queue + rolling        |

### 🚨 سيناريو: نشر فاشل يوم الجمعة

> الجمعة 4pm — deploy يفشل. 30% errors.

```bash
kubectl rollout undo deployment/api  # 15 seconds
kubectl rollout status deployment/api
curl -f https://api.cloudnova.com/health
# ✅ Back to normal. Never deploy on Friday.
```

---

## 🎨 طبقة المعماري

### GitHub Actions vs Azure DevOps vs GitLab CI

| المعيار         | GitHub Actions      | Azure DevOps   | GitLab CI     |
| --------------- | ------------------- | -------------- | ------------- |
| **التكلفة**     | 2000 min/month free | 1800 min/month | 400 min/month |
| **OIDC**        | ✅                  | ✅             | ✅            |
| **YAML**        | ✅                  | ✅             | ✅            |
| **Ecosystem**   | 20K+ actions        | محدود          | جيد           |
| **Self-hosted** | ✅                  | ✅             | ✅            |

### متى لا تؤتمت النشر بالكامل؟

- **تطبيقات حرجة جداً** (medical, financial) — manual approval إجباري
- **Compliance requirements** — بعض الصناعات تمنع النشر التلقائي

---

## 🛠️ تدريبات

### تمرين ١: Pipeline بسيط (سهل)

> ابنِ GitHub Actions: lint → test → build.

### تمرين ٢: حماية البيئة (متوسط)

> أنشئ production environment مع required reviewer.

### تحدي: Canary Pipeline (متقدم)

> Pipeline ينشر 10%، يختبر 5 دقائق، ثم 100%.

### 📝 تقييم

**س١:** CI vs CD؟
<details><summary>الإجابة</summary>CI = build + test تلقائي. CD = deploy تلقائي.</details>

**س٢:** متى Canary أفضل من Rolling؟
<details><summary>الإجابة</summary>تغييرات عالية المخاطر — اختبر على 5% أولاً.</details>

**س٣:** كيف تحمي production secrets؟
<details><summary>الإجابة</summary>GitHub Secrets + Environment protection + OIDC.</details>

### 🎤 مقابلة

**"صمم CI/CD لـ 20 microservice."**
→ Reusable workflows. Matrix builds. Path filtering. Deployment environments.

---

[← العودة للموديول](01-cicd-pipelines) | [→ Advanced Deployment](./02-advanced-deployment) | [🏠 الرئيسية](/)
