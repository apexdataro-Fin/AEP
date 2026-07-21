---
sidebar_position: 3
title: "الكتابة التقنية للمهندسين"
description: "كيف تكتب وثائق، Runbooks، Postmortems، و RFCs تغير مسار فريقك."
---

# الكتابة التقنية للمهندسين

> "الكود الجيد يشرح نفسه للكمبيوتر. التوثيق الجيد يشرح الكود للبشر."

## 🎯 أهداف التعلم

- كتابة Runbooks تنقذ الفريق 3AM
- كتابة Postmortems تمنع تكرار الكوارث
- كتابة RFCs تقنع الـ stakeholders
- كتابة README يختصر onboarding من أيام لساعات

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Junior

---

## ١. لماذا الكتابة أهم مهارة بعد الكود؟

```
مهندس يكتب كوداً ممتازاً + لا يوثقه = كود سيصبح عديم الفائدة بعد 6 أشهر
مهندس يكتب كوداً جيداً + يوثقه جيداً = كود سيستخدم لسنوات

الكتابة = تضخيم تأثيرك الهندسي 10x
```

الكتابة التقنية ليست "شيئاً إضافياً" تفعله عندما تجد وقتاً. إنها جزء من وظيفتك. المهندس الذي لا يكتب وثائق يترك ديوناً تقنية أسوأ من الكود السيئ — لأن الكود السيئ يمكن تصحيحه، أما الغياب التام للتوثيق فلا يمكن إصلاحه.

---

## ٢. Runbook — يختصر 3 ساعات تشخيص إلى 10 دقائق

### هيكل Runbook قياسي

```markdown
# Runbook: [اسم المشكلة]

## 🚨 متى تشغّل هذا الـ runbook؟

- Alert: [اسم الـ alert + الحد]
- Dashboard: [رابط Grafana]

## 🔍 التشخيص (الخطوات السريعة)

1. [الفحص الأول]
2. [الفحص الثاني]

## 🛠️ الإصلاحات حسب السيناريو

### سيناريو A: [السبب]

kubectl [الأمر]

### سيناريو B: [السبب]

terraform [الأمر]

## ⚠️ متى تستدعي المساعدة؟

- [شرط التصعيد]
- [رقم هاتف on-call]
```

### مثال حقيقي: API Latency Spike

````markdown
# Runbook: API Latency Spike

## 🚨 متى تشغّل هذا الـ runbook؟

- Alert: `HighLatency` (p99 > 2s لمدة 5 دقائق)
- Dashboard: Grafana → API RED → Latency panel

## 🔍 التشخيص (5 دقائق)

1. `kubectl top pods -n production | grep api` — أي pod يستهلك موارد؟
2. `kubectl logs -l app=api --tail=100 | grep ERROR`
3. هل DB connection pool ممتلئ؟
   - `kubectl exec -it deploy/api -- sh -c "netstat -an | grep 5432 | wc -l"`
4. هل Redis cache hit rate منخفض؟
   - Grafana → Redis Dashboard → Cache Hit Rate

## 🛠️ الإصلاحات حسب السيناريو

### سيناريو A: DB Connection Pool Exhausted

```bash
kubectl scale deployment api --replicas=4
```
````

### سيناريو B: Memory Leak

```bash
kubectl rollout undo deployment/api
```

### سيناريو C: زيادة حركة طبيعية

```bash
kubectl scale deployment api --replicas=8
```

## ⚠️ متى تستدعي المساعدة؟

- إذا استمر latency > 2s بعد 15 دقيقة
- إذا failed requests > 1%
- اتصل بـ SRE on-call: +966-xxx

````

---

## ٣. Postmortem — التعلم من الفشل

### قواعد الـ Postmortem

1. **Blameless**: لا تبحث عن مذنب. ابحث عن تحسين النظام
2. **5 Why's**: اسأل "لماذا؟" 5 مرات للوصول للسبب الجذري
3. **Action Items**: كل Postmortem يجب أن ينتج إجراءات محددة

### هيكل الـ Postmortem

```markdown
# Postmortem: [عنوان الحادثة]

## 📊 ملخص
- المدة: [X دقيقة] | التأثير: [X مستخدم/طلب] | السبب: [موجز]

## ⏱️ الجدول الزمني
| الوقت | الحدث |
|--------|-------|
| 14:13 | أول alert |
| 14:15 | بدء التحقيق |
| 14:35 | اكتشاف السبب |
| 14:50 | عودة الخدمة |

## 🔍 5 Why's
1. لماذا تعطلت الخدمة؟ → TLS certificate expired
2. لماذا expired؟ → auto-renewal كان معطلاً
3. لماذا كان معطلاً؟ → خطأ في Terraform config
4. لماذا لم نكتشفه مبكراً؟ → لا alert قبل الانتهاء
5. لماذا لا alert؟ → لم نعتبر الشهادات شيئاً يحتاج monitoring

## ✅ إجراءات
| # | الإجراء | المسؤول | الموعد |
|---|---------|---------|--------|
| 1 | تفعيل auto-renewal | DevOps | فوراً |
| 2 | Alert قبل 30 يوم | SRE | هذا الأسبوع |
| 3 | مراجعة كل الشهادات | Security | الجمعة |
````

### مثال حقيقي: تعطل بوابة الدفع — 15 يوليو

```markdown
# Postmortem: تعطل بوابة الدفع — 15 يوليو

## 📊 ملخص

- المدة: 47 دقيقة | التأثير: 234 طلب فشل | السبب: TLS منتهية

## ⏱️ الجدول الزمني

14:13 — أول 502 error | 14:35 — اكتشاف TLS | 14:50 — عودة الخدمة
14:15 — بدء التحقيق | 14:40 — تجديد الشهادة | 15:00 — اجتماع الطوارئ

## 🔍 5 Why's

1. TLS expired → auto-renewal معطل → خطأ تكوين → لا alert → افترضنا Key Vault يديرها

## ✅ إجراءات

| #   | الإجراء                            | المسؤول  | الموعد      |
| --- | ---------------------------------- | -------- | ----------- |
| 1   | تفعيل auto-renewal                 | DevOps   | فوراً       |
| 2   | Alert قبل 30 يوم                   | SRE      | هذا الأسبوع |
| 3   | Audit كل الشهادات                  | Security | الجمعة      |
| 4   | إضافة TLS monitoring لـ Prometheus | Platform | أسبوعين     |
```

---

## ٤. RFC — Request for Comments

### متى تكتب RFC؟

- تغيير معماري كبير
- إضافة تقنية جديدة للـ stack
- تغيير workflow الفريق

### هيكل RFC

```markdown
# RFC: [العنوان]

## Status: [Draft | Proposed | Accepted | Rejected]

## Motivation

لماذا هذا التغيير ضروري؟

## Proposed Solution

ماذا نقترح بالضبط؟

## Alternatives Considered

ماذا أيضاً فكرنا فيه؟ ولماذا رفضناه؟

## Migration Plan

كيف ننتقل من الوضع الحالي للمقترح؟

## Open Questions

ما الذي لم نقرره بعد؟
```

### مثال: الانتقال من Jenkins إلى GitHub Actions

```markdown
# RFC: الانتقال من Jenkins إلى GitHub Actions

## Motivation

- Jenkins server يكلف $150/شهر
- الصيانة تستهلك 5 ساعات أسبوعياً
- GitHub Actions مجاني للـ public repos ومتكامل

## Proposed Solution

- نقل 20 pipeline إلى GitHub Actions خلال 4 أسابيع
- إيقاف Jenkins server

## Migration Plan

Week 1-2: CI pipelines (test, build)
Week 3: CD pipelines (deploy)
Week 4: مراجعة وإيقاف Jenkins

## Open Questions

- ماذا عن self-hosted runners للأحمال الثقيلة؟
```

---

## 🏛️ طبقة الإنتاج: التوثيق على نطاق المؤسسة

### Documentation as Code

```yaml
# .github/workflows/docs.yml
name: Publish Docs
on:
  push:
    branches: [main]
    paths: ["docs/**"]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run build-docs
      - run: npm run deploy-docs
```

### معايير الجودة

| المعيار               | الوصف                                 |
| --------------------- | ------------------------------------- |
| **كل PR معه docs**    | لا تقبل PR بدون تحديث الوثائق         |
| **Docs Review**       | شخص آخر يراجع الوثائق كما يراجع الكود |
| **Link Checker**      | CI يفحص الروابط المكسورة              |
| **Readability Score** | استهدف مستوى قراءة 8th grade          |

---

## 🛠️ تدريبات

### تمرين 1: اكتب Runbook لتطبيقك

خذ تطبيقاً تعمل عليه واكتب Runbook يغطي:

- 3 سيناريوهات فشل محتملة
- خطوات تشخيص واضحة
- متى تستدعي المساعدة

### تمرين 2: حلل Postmortem حقيقي

ابحث عن Postmortem عام (GitHub, Cloudflare, AWS) وحلل:

- ما الـ 5 Why's؟
- هل الإجراءات كافية؟

### تحدي: اكتب RFC لتغيير في فريقك

اختر مشكلة حقيقية في سير عملك واكتب RFC مختصراً.

---

## 📝 تقييم

### ✅ فحص المعرفة (5)

1. ما الفرق بين Runbook و Postmortem؟
2. لماذا الـ 5 Why's مهمة في الـ Postmortem؟
3. متى تكتب RFC؟
4. ما مكونات README الجيد؟
5. لماذا Blameless Postmortem مهم؟

### 📝 اختبار (3)

1. **Runbook يجب أن يكون مفصلاً جداً أم بسيطاً؟**
   - بسيطاً. الهدف: شخص مرهق 3AM يستطيع اتباعه

2. **هل يجب أن يتضمن Postmortem أسماء المخطئين؟**
   - أبداً. Blameless. ركز على system improvement

3. **RFC: ماذا لو كان هناك اعتراضات كثيرة؟**
   - هذا طبيعي! الغرض من RFC هو اكتشاف الاعتراضات مبكراً

### 🃏 بطاقات (5)

| السؤال     | الإجابة                                     |
| ---------- | ------------------------------------------- |
| Runbook    | دليل خطوة بخطوة للاستجابة لحادثة            |
| Postmortem | تحليل بعد الحادثة للتعلم لا للوم            |
| RFC        | Request for Comments — اقتراح تقني للمناقشة |
| 5 Why's    | اسأل "لماذا" 5 مرات للوصول للسبب الجذري     |
| Blameless  | لا تبحث عن مذنب. ابحث عن تحسين النظام       |

---

## 🎤 مقابلة

### 1. "كيف توثق نظاماً معقداً؟"

→ README + Architecture Diagram (Mermaid) + Runbooks + API docs (OpenAPI) + Code comments

### 2. STAR: "احكِ عن وقت أنقذ فيه توثيقك الموقف"

→ Situation: On-call 2AM. نظام دفع معطل. Task: إصلاح سريع. Action: وجدت Runbook من زميل سابق، اتبعت الخطوات. Result: عدنا خلال 8 دقائق. لولا التوثيق كنت سأستغرق ساعة.

---

## 📚 مراجع

| النوع     | الرابط                                          |
| --------- | ----------------------------------------------- |
| درس مرتبط | [Engineering Mindset](./01-engineering-mindset) |
| كتاب      | "The Staff Engineer's Path" — Tanya Reilly      |
| أداة      | [Mermaid](https://mermaid.js.org) للـ diagrams  |
| أداة      | [Vale](https://vale.sh) لفحص أسلوب الكتابة      |

---

[← Cloud Career Mindset](./02-cloud-career-mindset) | [→ Linux Essentials](../02-linux/01-linux-essentials) | [🏠 الرئيسية](/)
