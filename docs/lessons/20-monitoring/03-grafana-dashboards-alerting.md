---
sidebar_position: 3
title: "Grafana Dashboards والتنبيهات"
description: "Grafana — إنشاء Dashboards احترافية، تنبيهات، Unified Alerting."
---

# Grafana Dashboards والتنبيهات

> "Grafana يحول الأرقام إلى قصص. والقصص تنقذ الإنتاج."

## 🎯 أهداف التعلم

- إنشاء Dashboards احترافية
- Grafana Unified Alerting
- Templating و Variables
- Provisioning dashboards as code

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Dashboard as Code

```json
{
  "dashboard": {
    "title": "CloudNova API Overview",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{ "expr": "rate(http_requests_total{job='api'}[5m])" }],
        "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 }
      },
      {
        "title": "Error Rate %",
        "targets": [{ "expr": "sum(rate(http_requests_total{status=~'5..'}[5m])) / sum(rate(http_requests_total[5m])) * 100" }],
        "fieldConfig": {
          "thresholds": { "steps": [{ "value": 0, "color": "green" }, { "value": 5, "color": "red" }] }
        }
      }
    ],
    "templating": { "list": [{ "name": "environment", "query": "production, staging, development", "type": "custom" }] }
  }
}
```

### Unified Alerting

```yaml
apiVersion: 1
groups:
- orgId: 1
  name: api_alerts
  folder: API
  interval: 60s
  rules:
  - uid: api_high_latency
    title: API High Latency
    condition: C
    data:
    - refId: A
      datasourceUid: prometheus
      model:
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 2
    for: 5m
    annotations:
      summary: API P99 latency > 2s
```

---

## 🏛️ طبقة الإنتاج

### سيناريو CloudNova: Dashboard أنقذ Black Friday

فريق العمليات لاحظ latency spike على dashboard مباشرة قبل الـ sale. Scale up الـ cluster من 5 إلى 15 nodes في دقيقتين. بدون dashboard: كانوا سيكتشفون المشكلة بعد ساعة من شكاوى العملاء.

### Provisioning Dashboards

```yaml
apiVersion: 1
providers:
- name: 'default'
  folder: 'CloudNova'
  options:
    path: /etc/grafana/provisioning/dashboards
```

---

## 🎨 Grafana vs Azure Monitor

| | Grafana | Azure Monitor |
|---|---------|-------------|
| **مصادر البيانات** | أي مصدر | Azure فقط |
| **التخصيص** | كامل | محدود |
| **التكلفة** | مجاني (self-hosted) | مدفوع بالـ GB |

---

## 🛠️ تدريبات

### تمرين: أنشئ Dashboard مع metric واحدة
### تحدي: ابنِ Dashboard as Code واخزنها في Git

---

## 📝 تقييم

### ✅ فحص المعرفة
1. لماذا Dashboard as Code مهم؟
2. كيف تخصص Dashboard حسب البيئة؟
3. ما فائدة Unified Alerting؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| Dashboard as Code | تخزين dashboard في Git كـ JSON |
| Templating | متغيرات لتخصيص dashboard |
| Unified Alerting | نظام تنبيه واحد لكل مصادر البيانات |

---

## 🎤 مقابلة
1. **"كيف تدير dashboards عندك؟"** → Dashboard as Code في Git + CI/CD provisioning
2. **"ما الـ dashboard الأهم في رأيك؟"** → RED dashboard (Rate, Errors, Duration) لكل خدمة

---

[← Prometheus Advanced](./02-prometheus-advanced) | [→ Observability](../../21-observability/01-observability-essentials) | [🏠 الرئيسية](/)
