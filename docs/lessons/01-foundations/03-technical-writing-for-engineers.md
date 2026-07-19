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

---

## ١. لماذا الكتابة أهم مهارة بعد الكود؟

```
مهندس يكتب كوداً ممتازاً + لا يوثقه = كود سيصبح عديم الفائدة بعد 6 أشهر
مهندس يكتب كوداً جيداً + يوثقه جيداً = كود سيستخدم لسنوات

الكتابة = تضخيم تأثيرك الهندسي 10x
```

### Runbook — يختصر 3 ساعات تشخيص إلى 10 دقائق

```markdown
# Runbook: API Latency Spike

## 🚨 متى تشغّل هذا الـ runbook؟
- Alert: `HighLatency` (p99 > 2s لمدة 5 دقائق)
- Dashboard: Grafana → API RED → Latency panel

## 🔍 التشخيص (5 دقائق)
1. `kubectl top pods -n production | grep api` — أي pod يستهلك موارد؟
2. `kubectl logs -l app=api --tail=100 | grep ERROR`
3. هل DB connection pool ممتلئ؟
4. هل Redis cache hit rate منخفض؟

## 🛠️ الإصلاحات حسب السيناريو
### سيناريو A: DB Connection Pool Exhausted
kubectl scale deployment api --replicas=4
### سيناريو B: Memory Leak
kubectl rollout undo deployment/api
### سيناريو C: زيادة حركة طبيعية
kubectl scale deployment api --replicas=8

## ⚠️ متى تستدعي المساعدة؟
- إذا استمر latency > 2s بعد 15 دقيقة
- إذا failed requests > 1%
```

---

## ٢. Postmortem — التعلم من الفشل

### هيكل الـ Postmortem

```markdown
# Postmortem: تعطل بوابة الدفع — 15 يوليو

## 📊 ملخص
- المدة: 47 دقيقة | التأثير: 234 طلب فشل | السبب: TLS منتهية

## ⏱️ الجدول الزمني
14:13 — أول 502 error | 14:35 — اكتشاف TLS | 14:50 — عودة الخدمة

## 🔍 5 Why's
1. TLS expired → auto-renewal معطل → خطأ تكوين → لا alert → افترضنا Key Vault يديرها

## ✅ إجراءات
| # | الإجراء | المسؤول | الموعد |
|---|---------|---------|--------|
| 1 | تفعيل auto-renewal | DevOps | فوراً |
| 2 | Alert قبل 30 يوم | SRE | هذا الأسبوع |
```

---

## ٣. تمرين Feynman

اشرح Kubernetes لشخص غير تقني: "تخيل فندقاً. الـ Pods = غرف. الـ Service = رقم الهاتف الموحد. الـ Deployment = مدير الفندق الذي يضمن وجود غرف كافية."

## 🎴 بطاقات

| السؤال | الإجابة |
|--------|---------|
| Runbook | دليل خطوة بخطوة للاستجابة لحادثة |
| Postmortem | تحليل بعد الحادثة للتعلم لا للوم |
| RFC | Request for Comments — اقتراح تقني |

## 🎤 مقابلة

**"كيف توثق نظاماً معقداً؟"**
→ README + Architecture Diagram + Runbooks + API docs + Code comments.

---

[← Cloud Career Mindset](./02-cloud-career-mindset) | [→ Linux Essentials](../02-linux/01-linux-essentials) | [🏠 الرئيسية](/)
