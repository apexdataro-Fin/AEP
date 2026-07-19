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
- لا features جديدة حتى يعود الاستقرار
```

### Toil Automation

```python
# قبل الأتمتة: 3 ساعات أسبوعياً
def manual_certificate_renewal():
    ssh_to_server()
    copy_new_cert()
    restart_nginx()
    verify_https()
    # ... 3 hours

# بعد الأتمتة: 0 دقائق
# Let's Encrypt + Certbot auto-renewal + cron job
```

---

## 🎤 مقابلة

1. "ما الفرق بين SRE و DevOps؟"
2. "اشرح Error Budget لمدير غير تقني"

---

[← DevOps Tools](./02-devops-tools) | [→ DevSecOps Pipeline](../../17-devsecops/01-security-pipeline) | [🏠 الرئيسية](/)
