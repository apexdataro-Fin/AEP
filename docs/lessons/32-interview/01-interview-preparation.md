---
sidebar_position: 1
title: "التحضير للمقابلة"
description: "التحضير الكامل لمقابلة Cloud Engineer: الأسئلة التقنية، System Design، Behavioral، والتفاوض."
---

# التحضير للمقابلة (Interview Preparation)

> "التحضير للمقابلة ليس حفظ إجابات. إنه فهم كيف تفكر وتحل المشكلات."

## 🎯 أهداف التعلم

- إتقان الأسئلة التقنية (Azure, K8s, Terraform, Networking)
- التحضير لـ System Design Interview
- الإجابة عن الأسئلة السلوكية بـ STAR
- التفاوض على الراتب والمزايا
- بناء خطة تحضير 4 أسابيع

---

## 📖 الطبقة الأساسية: هيكل المقابلة

```mermaid
graph LR
    A[HR Screen<br/>15-30 دقيقة] --> B[Technical Screen<br/>45-60 دقيقة]
    B --> C[System Design<br/>60 دقيقة]
    C --> D[Behavioral<br/>45 دقيقة]
    D --> E[Final Round<br/>مع المدير]
    E --> F[Offer 🎉]
```

### HR Screen — البوابة الأولى

```
الهدف: التحقق من توافقك الثقافي والأساسي
المدة: 15-30 دقيقة
الأسئلة:
├── "لماذا تريد تغيير العمل؟"
├── "ما هو راتبك المتوقع؟"
├── "ما هي خبرتك مع السحابة؟"
└── "هل لديك شهادات؟"

نصيحة: لا تذكر راتباً محدداً. قل:
"أنا مرن وأبحث عن فرصة تناسب مهاراتي.
ما هو النطاق المخصص لهذا المنصب؟"
```

### Technical Screen — الامتحان الحقيقي

```
الهدف: تقييم مهاراتك التقنية العميقة
المدة: 45-60 دقيقة
الشكل:
├── Live Coding أحياناً
├── أسئلة نظرية + سيناريوهات
└── مناقشة خبراتك السابقة

أهم 5 مواضيع:
1. Kubernetes (architecture, troubleshooting, networking)
2. Terraform (state, modules, drift, CI/CD integration)
3. Azure (networking, identity, compute, governance)
4. CI/CD (pipeline design, security scanning, GitOps)
5. Linux & Networking (troubleshooting, performance)
```

---

## 🧱 الطبقة المهنية: أسئلة تقنية حاسمة

### س 1: كيف تشخص CrashLoopBackOff في Kubernetes؟

```
القصة الكاملة:

في CloudNova، استيقظت 3AM على تنبيه:
"Production API pods in CrashLoopBackOff"

الخطوات:
1️⃣ kubectl get pods -n production | grep CrashLoop
   → cloudnova-api-7d8f9-abc12   0/1   CrashLoopBackOff   8 (2m ago)   15m

2️⃣ kubectl describe pod cloudnova-api-7d8f9-abc12 -n production
   → State: Waiting — Reason: CrashLoopBackOff
   → Last State: Terminated — Reason: Error — Exit Code: 1
   → Events: "Back-off restarting failed container"

3️⃣ kubectl logs cloudnova-api-7d8f9-abc12 --previous -n production
   → FATAL: Cannot connect to database at db.cloudnova.internal:5432
   → سبب الموت: DNS resolution failure

4️⃣ الأسباب المحتملة:
   ├── OOMKilled → dmesg | grep -i kill
   ├── ConfigMap/Secret مفقود → kubectl get cm,secret
   ├── Image Pull → kubectl describe pod | grep -i image
   ├── Readiness Probe فاشل → تحقق من endpoint
   └── Dependency غير متاح → قاعدة البيانات نائمة!

5️⃣ الإصلاح:
   ├── مؤقت: delete pod → سحب صورة جديدة
   ├── جذري: أضف initContainer ينتظر DB
   └── دائم: أضف retry logic في الكود
```

### س 2: كيف تصمم Disaster Recovery في Azure؟

```
RPO (Recovery Point Objective) = كم بيانات قد تخسر (بالوقت)
RTO (Recovery Time Objective) = كم وقت للاستعادة

| الاستراتيجية | RPO | RTO | التكلفة | متى تستخدم |
|------------|-----|-----|--------|-----------|
| Backup Only | 24h | 4-8h | $ | غير حرج |
| Pilot Light | 1h | 1-2h | $$ | مهم لكن يتحمل تأخير |
| Warm Standby | 5min | 15min | $$$ | تطبيقات critical |
| Active-Active | 0 | 0 | $$$$ | Banking, Healthcare |

في CloudNova:
├── Production API: Warm Standby (RPO=5min, RTO=15min)
│   ├── Azure Site Recovery + Geo-redundant SQL
│   └── Traffic Manager failover
├── Dev/Staging: Backup Only (RPO=24h, RTO=4h)
└── AI Training: لا حاجة لـ DR (stateless + Spot VMs)
```

### س 3: كيف تبني CI/CD Pipeline احترافي؟

```yaml
# .github/workflows/production.yml — CloudNova Production Pipeline
name: Production Deploy
on:
  push:
    branches: [main]
    paths: ["src/**", "infra/**"]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trivy Security Scan
        run: |
          trivy fs --severity HIGH,CRITICAL --exit-code 1 .
          trivy config --severity HIGH,CRITICAL .

  build-and-test:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t cloudnova-api:${{ github.sha }} .
      - run: |
          docker run cloudnova-api:${{ github.sha }} pytest
          docker run cloudnova-api:${{ github.sha }} bandit -r src/

  terraform-plan:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - run: terraform init && terraform plan -out=tfplan
      - uses: actions/upload-artifact@v4
        with: { name: tfplan, path: tfplan }

  deploy-staging:
    needs: terraform-plan
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: terraform apply tfplan
      - run: |
          curl -f https://staging.cloudnova.com/health || exit 1

  deploy-production:
    needs: deploy-staging
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: terraform apply tfplan
      - name: Smoke Test
        run: |
          curl -f https://api.cloudnova.com/health
          curl -f https://api.cloudnova.com/api/v1/version
```

### س 4: كيف تتعامل مع Incident إنتاجي؟

```
سير العمل في CloudNova:

🟢 Detection (0-1min)
├── Prometheus AlertManager ينبه
├── "API latency > 2s for 5 minutes"
└── PagerDuty يشغّل on-call

🟡 Triage (1-5min)
├── فتح قناة #incident-2026-0719 في Slack
├── تعيين Incident Commander (أنت!)
└── إعلان: "SEV-2: API degradation، نحقق"

🟠 Investigation (5-30min)
├── Grafana: latency spike بدأ 14:32 UTC
├── K9s: pods تستهلك 95% memory
├── السبب: deployment جديد غيّر JVM heap settings
├── الخطأ: -Xmx512m بدلاً من -Xmx2048m

🔴 Mitigation (فوراً)
├── Rollback deployment → kubectl rollout undo deployment/api
├── الانتظار 2 دقيقة
└── التحقق: latency عاد لـ 200ms ✅

📝 Postmortem (خلال 48 ساعة)
├── ماذا حدث؟ JVM OOM بسبب تغيير memory limits
├── لماذا؟ تغيير في Helm chart بدون مراجعة
├── كيف نمنع التكرار؟
│   ├── Add OPA policy: min memory 2Gi for production
│   ├── Add canary deployment with 10% traffic
│   └── Add load test to CI/CD pipeline
└── Action items assigned + due dates
```

---

## 🏗️ الطبقة الإنتاجية: System Design

### إطار الإجابة المكون من 4 خطوات

```
1️⃣ Clarify (اسأل أسئلة!)
   ├── "كم مستخدم؟"
   ├── "ما هو الـ SLA المطلوب؟"
   ├── "هل هناك قيود ميزانية؟"
   └── "Global أو Regional؟"

2️⃣ High-Level Design
   ├── ارسم المكونات الرئيسية
   ├── Frontend → CDN → API Gateway → Microservices
   └── Data: SQL + Cache + Blob

3️⃣ Deep Dive
   ├── "أي جزء هو bottleneck؟"
   ├── "كيف نتعامل مع الـ failures؟"
   └── "ما هي trade-offs؟"

4️⃣ Wrap Up
   ├── "التكلفة التقديرية: $X/شهر"
   ├── "SLA المتوقع: 99.95%"
   └── "التحسينات المستقبلية: ..."
```

### مثال: صمم منصة SaaS لـ 100K مستخدم نشط

```
المتطلبات:
├── 100,000 مستخدم نشط شهرياً
├── 10,000 طلب/دقيقة في الذروة
├── 99.95% SLA
└── بيانات حساسة (SOC2 + GDPR)

التصميم:

Frontend:
├── Azure Front Door + CDN
├── Static Web App (React)
└── WAF للحماية

API Layer:
├── Azure API Management (rate limiting, auth)
├── AKS Cluster (3 nodes, auto-scale to 10)
│   ├── User Service (2 pods)
│   ├── Payment Service (3 pods — critical)
│   └── Notification Service (1 pod)
└── Azure Functions (webhooks, async tasks)

Data Layer:
├── Azure SQL (Business Critical, Geo-redundant)
│   ├── Primary: East US
│   └── Secondary: West Europe (read replicas)
├── Cosmos DB (user sessions, real-time data)
├── Redis Cache (Azure Cache for Redis, Premium)
└── Blob Storage (user uploads, backups)

Security:
├── Entra ID B2C (customer identity)
├── Key Vault (secrets + certificates)
├── Private Endpoints (no public exposure)
├── Azure Policy + Defender for Cloud
└── SIEM: Sentinel

Monitoring:
├── Application Insights + Log Analytics
├── Prometheus + Grafana (cluster metrics)
├── Uptime Robot (external monitoring)
└── PagerDuty (alerting)

التكلفة التقديرية: $18,000 - 24,000/شهر
SLA: 99.95% (4.3 ساعة downtime مسموح/سنة)
```

---

## 🎨 الطبقة المعمارية: STAR Method

### STAR = Situation → Task → Action → Result

```
س: "حدثني عن وقت تعاملت مع Incident صعب"

❌ إجابة ضعيفة:
"مرة تعطل السيرفر وأصلحته."
(لا تفاصيل، لا أرقام، لا تأثير)

✅ إجابة قوية:
S: "في CloudNova، يوم Black Friday الساعة 10 صباحاً،
   تعطلت خدمة الدفع affecting 15,000 مستخدم."

T: "كنت الـ Incident Commander.
   الهدف: استعادة الخدمة قبل خسارة أكثر من $50K."

A: "1. فتحت War Room ووزعت المهام
   2. شخصت المشكلة: connection pool exhaustion
      (PostgreSQL maxed at 100 connections)
   3. حل مؤقت: زدت max_connections لـ 500
   4. حل دائم: أضفت PgBouncer connection pooling
   5. أضفت alert عند 70% connection usage"

R: "✅ استعدنا الخدمة في 12 دقيقة
   ✅ تجنبنا خسارة $50,000+
   ✅ منعنا تكرار المشكلة بـ PgBouncer
   ✅ أضفنا load test لـ Black Friday مسبقاً"

⚠️ كل قصة STAR تحتاج:
├── أرقام (وقت، مال، مستخدمون)
├── دورك المحدد (أنا فعلت — ليس نحن)
└── نتيجة قابلة للقياس
```

### 5 قصص STAR جاهزة

```
1. قيادة Incident: Black Friday outage (أعلاه)
2. تحسين أداء: "خفضت latency من 2s لـ 200ms
   بإضافة Redis cache و database indexing"
3. أتمتة: "حوّلت deployment من 4 ساعات يدوي
   لـ 12 دقيقة آلياً بـ CI/CD pipeline"
4. توفير تكاليف: "خفضت فاتورة Azure 35%
   ($168K سنوياً) عبر RI + Spot VMs"
5. بناء فريق: "قمت بتدريب 5 Junior Engineers
   على Kubernetes و Terraform في 3 أشهر"
```

---

## ⚡ الإنتاج وما بعده: التفاوض

```
📊 البحث (قبل المقابلة):
├── Levels.fyi — رواتب حقيقية
├── Glassdoor — نطاق الشركة تحديداً
├── Blind — ثقافة الشركة ومزاياها
├── LinkedIn — خلفية الموظفين الحاليين
└── اعرف 3 أرقام:
    ├── الرقم الحلم: $180K
    ├── الرقم المقبول: $160K
    └── الحد الأدنى: $145K

🎯 أثناء التفاوض:
├── لا تذكر راتبك الحالي أبداً!
├── إذا سألوك: "ما راتبك الحالي؟"
│   → "أركز على القيمة التي سأقدمها.
│      ما هو النطاق لهذا المنصب؟"
├── فاوض على الحزمة كاملة:
│   ├── الراتب الأساسي (Base)
│   ├── الأسهم (RSUs/Options)
│   ├── البونص السنوي (10-20%)
│   ├── Sign-on bonus
│   ├── العمل عن بُعد
│   ├── ميزانية التدريب
│   └── الإجازات
└── الجملة السحرية:
    "بناءً على أبحاثي لسوق ومهاراتي في
     Kubernetes و Terraform و Azure،
     أتوقع نطاق X-Y. هل هذا ضمن ميزانيتكم؟"

❌ أخطاء قاتلة:
├── قبول العرض الأول فوراً (يترك 10-20%!)
├── التفاوض على الراتب فقط وتجاهل الأسهم
├── ذكر رقم منخفض أولاً
├── التهديد بعروض وهمية
└── التفاوض قبل الحصول على العرض الرسمي

💰 مقارنة عروض (مثال حقيقي):

| البند | العرض أ | العرض ب |
|-------|---------|---------|
| الراتب | $160K | $150K |
| أسهم/سنة | $20K | $40K |
| بونص | 10% | 15% |
| Remote | Hybrid | Full |
| الإجمالي | $196K | $212K |

→ العرض ب أفضل رغم راتب أقل!
```

---

## 🗓️ خطة تحضير 4 أسابيع

```
📅 الأسبوع 1: الأساسيات التقنية
├── يوم 1-2: Linux + Networking (TCP/UDP, DNS, TLS, troubleshooting)
├── يوم 3-4: Azure Core (Compute, Networking, Storage, Identity)
├── يوم 5: Python + Bash scripting
├── يوم 6-7: مراجعة + أسئلة mock

📅 الأسبوع 2: الأدوات المتقدمة
├── يوم 1-2: Docker (multi-stage, security, compose)
├── يوم 3-4: Kubernetes (architecture, networking, RBAC, troubleshooting)
├── يوم 5: Terraform (state, modules, drift, CI/CD)
├── يوم 6-7: CI/CD + GitOps (GitHub Actions, ArgoCD, Flux)

📅 الأسبوع 3: System Design
├── يوم 1: Design URL Shortener
├── يوم 2: Design Chat System
├── يوم 3: Design Video Streaming
├── يوم 4: Design Rate Limiter
├── يوم 5: Design Monitoring System
├── يوم 6-7: مراجعة + Mock System Design interviews

📅 الأسبوع 4: Behavioral + Final Prep
├── يوم 1-2: كتابة 10 قصص STAR
├── يوم 3: Mock Behavioral interview
├── يوم 4: البحث عن الشركات المستهدفة
├── يوم 5: أسئلة "هل لديك أي سؤال؟"
├── يوم 6: راحة واسترخاء
└── يوم 7: المقابلة! 🎯
```

---

## 🎯 أسئلة ذكية تسألها أنت

```
"هذه الأسئلة تبين أنك مهندس محترف، وليس مجرد مرشح."

1. "كيف يبدو يوم مهندس سحابة في فريقكم؟"
   → يفهم توقعات العمل اليومية

2. "ما أكبر تحدٍّ تقني تواجهونه حالياً؟"
   → يبين اهتمامك بالمشكلات الحقيقية

3. "كيف تقيسون نجاح المهندس هنا؟"
   → يفهم معايير التقييم والترقية

4. "كيف تبدو عملية on-call؟"
   → يبين استعدادك للمسؤولية

5. "ما هي خارطة الطريق التقنية للسنة القادمة؟"
   → يبين اهتمامك بالمستقبل

6. "كيف تدعمون التعلم والتطوير المهني؟"
   → يقيس استثمار الشركة فيك

7. "ما الذي يميز أفضل المهندسين هنا؟"
   → يكشف القيم المخفية للشركة
```

---

## 🧠 التذكّر النشط

1. ما هي مراحل المقابلة الخمس؟ اشرح هدف كل مرحلة
2. كيف تشخص CrashLoopBackOff في 5 خطوات؟
3. ما هو إطار System Design المكون من 4 خطوات؟
4. أعط مثالاً كاملاً لقصة STAR عن Incident
5. كيف تتفاوض على الراتب دون ذكر راتبك الحالي؟
6. ما أهم 3 أسئلة تسألها أنت في المقابلة؟
7. كيف تصمم DR لـ RPO=5min و RTO=15min؟
8. ما هو هيكل CI/CD pipeline الإنتاجي الكامل؟

## ✍️ تمرين Feynman

"اشرح Kubernetes لمطور Junior في 3 دقائق."
(Feynman = ابسط المفهوم لشخص غير تقني تماماً، ثم راجع ما لم تستطع شرحه ببساطة)

## 🎤 أسئلة المقابلة الإضافية

1. **"Terraform state تالف في S3/Azure Storage. ماذا تفعل؟"**
   - لا panic! state backups موجودة
   - استخدم `terraform state pull` من backup
   - إذا فشل: `terraform import` للموارد الموجودة
   - الوقاية: enable state locking + versioning

2. **"latency ارتفع من 200ms لـ 3s. ماذا تفعل؟"**
   - هل لكل الـ endpoints أم لواحد؟
   - Database slow queries؟ Application GC pauses؟
   - Network latency؟ Istio sidecar memory؟
   - الـ APM (Application Insights/Datadog) يكشف السبب

3. **"كيف تؤمّن Kubernetes cluster؟"**
   - RBAC + least privilege
   - Network Policies (deny all, allow specific)
   - Pod Security Standards (restricted)
   - OPA/Gatekeeper policies
   - Private cluster + Azure AD integration
   - Trivy scanning in CI/CD
   - Secrets: External Secrets Operator → Key Vault

---

[🏠 العودة للرئيسية](/) | [📚 جميع الدروس](/docs/lessons)
