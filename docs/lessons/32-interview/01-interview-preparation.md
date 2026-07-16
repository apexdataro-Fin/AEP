---
sidebar_position: 1
title: "التحضير للمقابلة"
description: "التحضير الكامل لمقابلة Cloud Engineer: الأسئلة التقنية، System Design، وBehavioral."
---

# التحضير للمقابلة (Interview Preparation)

> "التحضير للمقابلة ليس حفظ إجابات. إنه فهم كيف تفكر وتحل المشكلات."

## 🎯 أهداف التعلم

- إتقان الأسئلة التقنية (Azure, K8s, Terraform, Networking)
- التحضير لـ System Design Interview
- الإجابة عن الأسئلة السلوكية باحتراف
- فهم هيكل المقابلة التقنية
- بناء استراتيجية تحضير فعالة

---

## 📖 الطبقة الأساسية: هيكل المقابلة

### مراحل المقابلة الخمس

```
المرحلة 1: HR Screen (30 دقيقة)
├── "احكِ لنا عن نفسك"
├── لماذا تريد العمل معنا؟
└── التوقعات الوظيفية

المرحلة 2: Technical Screen (60 دقيقة)
├── أسئلة Azure/K8s/Terraform
├── سيناريو: حل مشكلة إنتاجية
└── Live coding (bash, python, أو terraform)

المرحلة 3: System Design (60 دقيقة)
├── تصميم بنية تحتية لحالة واقعية
├── "صمم منصة لـ 1M مستخدم"
└── مناقشة trade-offs

المرحلة 4: Behavioral (45 دقيقة)
├── "حدثني عن وقت تعاملت مع Incident"
├── "كيف تتعامل مع disagreement؟"
└── STAR method

المرحلة 5: Final Round (مع المدير)
├── أسئلة leadership
├── رؤيتك المستقبلية
└── أسئلتك أنت لهم
```

---

## 🧱 الطبقة المهنية: الأسئلة التقنية

### Azure

**Q: كيف تختار بين Azure App Service و AKS؟**

```
App Service:
├── تطبيقات بسيطة، HTTP-based
├── لا تحتاج تخصيصات كبيرة
├── أسرع وأرخص
└── Auto-scaling مدمج

AKS:
├── Microservices معقدة
├── تحتاج تحكم كامل
├── Sidecar containers
└── Service Mesh

قاعدة:
إذا استطعت حلها بـ App Service، استخدمه.
فقط استخدم AKS عندما تحتاج مرونة Kubernetes.
```

**Q: كيف تنفذ Disaster Recovery في Azure؟**

```
RPO (Recovery Point Objective): كم بيانات قد نخسر؟
RTO (Recovery Time Objective): كم وقت للاستعادة؟

الاستراتيجيات:
├── Backup: Azure Backup لـ VMs + Databases
│   └── RPO: 24h, RTO: 4h, Cost: $
│
├── Pilot Light: الحد الأدنى يعمل في المنطقة الثانية
│   └── RPO: 1h, RTO: 1h, Cost: $$
│
├── Warm Standby: نسخة مصغرة جاهزة
│   └── RPO: 5min, RTO: 15min, Cost: $$$
│
└── Active-Active: بيئتان تعملان معاً
    └── RPO: 0, RTO: 0, Cost: $$$$
```

### Kubernetes

**Q: ماذا يحدث عندما تكتب `kubectl apply -f deployment.yaml`؟**

```
1. kubectl ←→ API Server (Authentication + Authorization)
2. API Server ←→ etcd (تخزين desired state)
3. Deployment Controller يرى deployment جديد
4. Deployment Controller ينشئ ReplicaSet
5. ReplicaSet Controller ينشئ Pods
6. Scheduler يختار nodes للـ Pods
7. Kubelet على الـ node يسحب الصورة ويشغل الحاوية
```

**Q: كيف تشخص Pod في CrashLoopBackOff؟**

```bash
# 1. فحص حالة الـ Pod
kubectl describe pod <name>

# 2. فحص السجلات
kubectl logs <pod> --previous  # آخر محاولة فاشلة

# 3. الدخول للـ Pod (إذا كان يعمل)
kubectl exec -it <pod> -- /bin/sh

# 4. فحص الأحداث
kubectl get events --sort-by=.metadata.creationTimestamp

# أسباب شائعة:
├── خطأ في الأمر (command/args)
├── صورة غير موجودة (ImagePullBackOff)
├── OOM (Out of Memory)
├── ConfigMap/Secret غير موجود
└── Probes فاشلة (readiness/liveness)
```

### Terraform

**Q: كيف تدير Terraform State في فريق؟**

```
✅ Remote State مع Azure Storage:
   - Backend: azurerm
   - State locking: تلقائي (lease)
   - Encryption: at rest (TLS)

❌ Local State:
   - لا تشاركه أبداً
   - خطر конфлт عند عمل عدة أشخاص
   - أسرار في الـ state (غير آمن)

مثال:

terraform {
  backend "azurerm" {
    storage_account_name = "terraformstate"
    container_name       = "state"
    key                  = "production.terraform.tfstate"
  }
}

مع CI/CD:
- State file في Azure Storage
- OIDC بدلاً من secrets
- Plan → Manual Approval → Apply
```

---

## 🏗️ الطبقة الإنتاجية: System Design

### إطار الإجابة

```
1. Clarify (اسأل أسئلة توضيحية!)
   ├── كم مستخدم؟
   ├── ما الـ latency المطلوب؟
   ├── ما الميزانية؟
   └── هل هناك قيود أمنية؟

2. High-Level Design (ارسم!)
   ├── Components: Load Balancer → Web → API → DB
   ├── Data flow
   └── External services

3. Deep Dive
   ├── أي جزء هو bottleneck؟
   ├── كيف تتعامل مع failure؟
   └── كيف تراقب النظام؟

4. Trade-offs
   ├── Consistency vs Availability
   ├── Cost vs Performance
   └── Simplicity vs Flexibility
```

### مثال: صمم منصة SaaS

```
المتطلبات: منصة SaaS لـ 100K مستخدم

التصميم:

1. Frontend:
   ├── Azure Front Door (global load balancing)
   ├── Static website + CDN
   └── WAF للحماية

2. Backend:
   ├── Azure API Management (gateway)
   ├── AKS (microservices)
   └── Azure Functions (background jobs)

3. Data:
   ├── Azure SQL (user data, transactions)
   ├── Cosmos DB (sessions, high-throughput)
   ├── Redis Cache (hot data)
   └── Blob Storage (files, backups)

4. Security:
   ├── Azure AD B2C (authentication)
   ├── Key Vault (secrets)
   └── Private Endpoints

5. Observability:
   ├── Application Insights
   ├── Log Analytics
   └── Grafana dashboards

التكلفة المقدرة: $12,000 - $18,000/شهر
SLA: 99.95%
```

---

## 🎨 الطبقة المعمارية: STAR Method

### STAR = Situation, Task, Action, Result

```
سؤال: "حدثني عن وقت تعاملت مع Incident صعب"

❌ إجابة ضعيفة:
"مرة حصلت مشكلة في السيرفر وأصلحتها"
(غامضة، لا تفاصيل، لا تظهر مهاراتك)

✅ إجابة قوية (STAR):

S: "في CloudNova، تعطلت خدمة الدفع في Black Friday"
   (حدد السياق)

T: "كنت المسؤول عن استعادة الخدمة بأسرع وقت"
   (مسؤوليتك)

A: "شخصت المشكلة في الـ connection pool،
    زدت الـ max connections مؤقتاً،
    ثم أصلحت الكود لمنع التكرار"
   (ماذا فعلت أنت تحديداً)

R: "استعدنا الخدمة في 12 دقيقة،
    وتجنبنا خسارة $50,000"
   (نتيجة قابلة للقياس!)
```

### بنك الأسئلة السلوكية

```
1. Conflict:
   "احكِ لي عن disagreement مع زميل"

2. Failure:
   "ما أكبر خطأ تقني ارتكبته؟"

3. Leadership (حتى لو Junior!):
   "كيف تقنع فريقاً بفكرة تقنية؟"

4. Learning:
   "كيف تتابع التطورات التقنية؟"

5. Priority:
   "لديك 3 مشاكل في وقت واحد — ماذا تفعل؟"

لكل سؤال: جهز قصة حقيقية بـ STAR
```

---

## 🏥 سيناريو CloudNova: محاكاة مقابلة

```
المتقدم: أنت
المحاور: CTO CloudNova

المحاور: "صمم لي Disaster Recovery لـ CloudNova"

أنت: "قبل التصميم، دعني أسأل:
  - ما RPO/RTO المطلوبين؟
  - ما الميزانية؟
  - هل كل الخدمات تحتاج DR أم الحرجة فقط؟"

المحاور: "RTO ساعة، RPO 5 دقائق، للخدمات الحرجة فقط"

أنت: "حسناً، سأستخدم Warm Standby:

1. Infrastructure:
   ├── Terraform modules موحدة للمنطقتين
   ├── West Europe (primary) + North Europe (DR)
   └── Azure Site Recovery لـ VMs

2. Database:
   ├── Azure SQL: Active Geo-Replication
   └── Failover Group للـ automatic failover

3. Storage:
   ├── Storage Account: RA-GRS
   └── بيانات المستخدم منسوخة تلقائياً

4. Networking:
   ├── Azure Front Door: global load balancing
   └── Traffic Manager: failover على مستوى DNS

5. Testing:
   ├── DR drill شهرياً
   └── Runbook موثق بالتفصيل

التكلفة: ~60% من production ($21,000 إضافي)"

المحاور: "جيد! والآن: كيف تختبر الـ DR فعلاً؟"
...
```

---

## ⚡ الإنتاج وما بعده

### خطة تحضير 4 أسابيع

```
الأسبوع 1: التقني
├── Azure: مراجعة الخدمات الأساسية + AZ-104
├── Kubernetes: معماري + troubleshooting
└── يومياً: 3 أسئلة تقنية

الأسبوع 2: الأدوات
├── Terraform: state, modules, workspaces
├── Docker: multi-stage, security
└── CI/CD: GitHub Actions, GitOps

الأسبوع 3: System Design
├── صمم 5 أنظمة مختلفة
├── تدرب على الرسم (Mermaid, Excalidraw)
└── ناقش trade-offs

الأسبوع 4: Behavioral
├── جهز 10 قصص بـ STAR
├── Mock interviews مع صديق
└── أسئلة لتسألها أنت للشركة
```

---

## 🧠 التذكّر النشط

1. ما هي مراحل المقابلة الخمس؟
2. كيف تجيب عن سؤال System Design؟
3. ما هي طريقة STAR؟
4. كيف تشخص CrashLoopBackOff في Kubernetes؟
5. ما الفرق بين RPO و RTO؟

## 📝 بطاقات تعليمية

- **STAR**: Situation, Task, Action, Result — إطار الإجابة السلوكية
- **System Design**: تصميم نظام من الصفر — أهم جزء في المقابلة
- **RPO**: Recovery Point Objective — كم بيانات قد نخسر
- **RTO**: Recovery Time Objective — كم وقت للاستعادة
- **Trade-off**: مقايضة بين خيارين (لا يوجد حل مثالي!)

## 🎤 أسئلة لتسألها أنت

```
1. "كيف يبدو يوم مهندس سحابة في فريقكم؟"
   (تفهم الثقافة والعمل الفعلي)

2. "ما أكبر تحدٍّ تقني تواجهونه حالياً؟"
   (تظهر اهتمامك بالمشاكل الحقيقية)

3. "كيف تقيسون نجاح مهندس السحابة هنا؟"
   (تفهم التوقعات وفرص النمو)
```

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
