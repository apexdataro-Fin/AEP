---
sidebar_position: 3
title: "SRE و DevOps"
description: "SRE vs DevOps — Service Level Objectives، Error Budgets، Toil Automation."
---

# SRE و DevOps

> "DevOps فلسفة، SRE تطبيق. كلاهما تحتاج إليهما."

## 🎯 أهداف التعلم

- فهم SRE ومبادئه
- Service Level Objectives (SLOs)
- Error Budgets
- تقليل الـ Toil

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Advanced

---

## 🏗️ SRE vs DevOps

| | DevOps | SRE |
|---|--------|-----|
| **التركيز** | ثقافة + أتمتة | موثوقية + مقاييس |
| **يقيس** | DORA Metrics | SLOs, Error Budgets |
| **يقول** | "افعلها أسرع" | "اجعلها موثوقة" |
| **الأصل** | حركة ثقافية | Google Engineering |

### SLO و Error Budget

```yaml
# SLO: 99.95% uptime شهرياً
# Error Budget: 0.05% = 22 دقيقة شهرياً

# إذا استهلكت الـ error budget:
- أوقف deployments الجديدة
- ركز على الموثوقية
```

### Toil Automation

```python
# قبل: 3 ساعات أسبوعياً للشهادات
# بعد: Let's Encrypt + Certbot auto-renewal
```

---

## 🏛️ سيناريو CloudNova: Error Budget

استهلكنا 18 من 22 دقيقة error budget في أسبوعين. CTO أوقف deployments. فريق SRE قضى أسبوعاً في تحسين monitoring. رجعنا deployment بعد استعادة الموثوقية.

### SLO Design

| الخدمة | SLO | Error Budget/شهر |
|--------|-----|-----------------|
| API | 99.95% | 22 دقيقة |
| Database | 99.99% | 4.3 دقيقة |
| Frontend | 99.9% | 43 دقيقة |

---

## 🛠️ تدريبات

### تمرين: حدد SLO لخدمتك
### تحدي: احسب error budget الشهري

---

## 📝 تقييم

### ✅ فحص المعرفة
1. ما الفرق بين SLA و SLO؟
2. كيف تحسب error budget؟
3. متى توقف deployments؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| SLO | Service Level Objective — هدف الموثوقية |
| Error Budget | الوقت المسموح للـ downtime |
| Toil | عمل يدوي متكرر |

---

## 🎤 مقابلة
1. **"ما الفرق بين SRE و DevOps؟"** → DevOps: فلسفة. SRE: تطبيق مع مقاييس
2. **"اشرح Error Budget لمدير غير تقني"** → "مثل ميزانية. إذا صرفت كل الميزانية (downtime)، توقف عن الصرف (deployments)"

---

[← DevOps Tools](./02-devops-tools) | [→ DevSecOps Pipeline](../../17-devsecops/01-security-pipeline) | [🏠 الرئيسية](/)
