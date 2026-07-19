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
- لوحة معلومات DORA

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🏗️ مقاييس DORA الأربعة

| المقياس | Elite | High | Medium | Low |
|---------|-------|------|--------|-----|
| **Deployment Frequency** | On-demand | يومي | أسبوعي | شهري |
| **Lead Time for Changes** | < 1 ساعة | يوم | أسبوع | شهر |
| **MTTR** | < 1 ساعة | يوم | أسبوع | شهر |
| **Change Failure Rate** | 0-5% | 5-10% | 10-15% | >15% |

### حساب Deployment Frequency

```bash
# من GitHub API
gh api repos/cloudnova/api/deployments --jq 'length'
```

### قياس MTTR

```python
from datetime import datetime

def calculate_mttr(incidents):
    total_minutes = 0
    for inc in incidents:
        start = datetime.fromisoformat(inc['started_at'])
        resolved = datetime.fromisoformat(inc['resolved_at'])
        total_minutes += (resolved - start).total_seconds() / 60
    return total_minutes / len(incidents)

# CloudNova MTTR
incidents = get_pagerduty_incidents('2026-07')
mttr = calculate_mttr(incidents)
print(f"MTTR: {mttr:.1f} minutes")
```

---

## 🛠️ تدريب

1. اجمع Deployment Frequency من GitHub Actions logs
2. احسب MTTR من Azure Monitor alerts
3. صنّف CloudNova حسب DORA

---

[← Security Scanning](./03-cicd-security-scanning) | [→ DevOps Culture](../../16-devops/01-devops-culture) | [🏠 الرئيسية](/)
