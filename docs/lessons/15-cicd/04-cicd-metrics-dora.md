---
sidebar_position: 4
title: "مقاييس DORA"
description: "DORA Metrics — Deployment Frequency، Lead Time، MTTR، Change Failure Rate."
---

# مقاييس DORA

> "لا يمكنك تحسين ما لا تقيسه. DORA هي معيار الصناعة."

## 🎯 أهداف التعلم

- فهم مقاييس DORA الأربعة
- تصنيف Elite/High/Medium/Low
- جمع المقاييس من GitHub + Azure DevOps

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🏗️ مقاييس DORA الأربعة

| المقياس | Elite | High | Medium | Low |
|---------|-------|------|--------|-----|
| **Deployment Frequency** | On-demand | يومي | أسبوعي | شهري |
| **Lead Time for Changes** | < 1 ساعة | يوم | أسبوع | شهر |
| **MTTR** | < 1 ساعة | يوم | أسبوع | شهر |
| **Change Failure Rate** | 0-5% | 5-10% | 10-15% | >15% |

### CloudNova اليوم

| المقياس | القيمة | التصنيف |
|---------|--------|---------|
| Deployment Frequency | 12/يوم | Elite |
| Lead Time | 45 دقيقة | Elite |
| MTTR | 15 دقيقة | Elite |
| Change Failure Rate | 3% | Elite |

---

## 🏛️ طبقة الإنتاج: تتبع DORA

```python
def calculate_dora():
    deployments_this_week = len(get_github_deployments("cloudnova/api", days=7))
    mttr_minutes = avg_incident_duration("cloudnova", days=30)
    failure_rate = failed_deployments / total_deployments * 100
    
    print(f"Deployments/week: {deployments_this_week}")
    print(f"MTTR: {mttr_minutes:.1f} min")
    print(f"Failure Rate: {failure_rate:.1f}%")
```

---

## 🎨 استخدم DORA للتحسين

| المقياس ضعيف | ماذا تحسن |
|-------------|----------|
| Deployment Frequency منخفض | أتمتة CI/CD أكثر |
| Lead Time طويل | قلل حجم الـ PRs |
| MTTR عالي | حسن الـ monitoring والـ runbooks |
| Failure Rate عالي | أضف testing + canary deploys |

---

## 🛠️ تدريبات

### تمرين: احسب DORA metrics لفريقك
### تحدي: ابنِ Grafana dashboard لـ DORA

---

## 📝 تقييم

### ✅ فحص المعرفة
1. ما هي مقاييس DORA الأربعة؟
2. كيف تصنف فريقاً حسب DORA؟
3. كيف تحسن MTTR؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| DORA | DevOps Research & Assessment |
| Lead Time | من commit إلى production |
| MTTR | Mean Time to Recovery |

---

## 🎤 مقابلة
1. **"كيف تقيس أداء فريق DevOps؟"** → DORA metrics
2. **"كيف انتقلت من Medium إلى Elite؟"** → خطط تحسين لكل metric

---

[← Security Scanning](./03-cicd-security-scanning) | [→ DevOps Culture](../../16-devops/01-devops-culture) | [🏠 الرئيسية](/)
