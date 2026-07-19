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
        "targets": [
          {
            "expr": "rate(http_requests_total{job='api'}[5m])"
          }
        ],
        "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 }
      },
      {
        "title": "Error Rate %",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~'5..'}[5m])) / sum(rate(http_requests_total[5m])) * 100"
          }
        ],
        "fieldConfig": {
          "thresholds": {
            "steps": [
              { "value": 0, "color": "green" },
              { "value": 5, "color": "red" }
            ]
          }
        }
      }
    ],
    "templating": {
      "list": [
        {
          "name": "environment",
          "query": "production, staging, development",
          "type": "custom"
        }
      ]
    }
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
    noDataState: NoData
    execErrState: Error
    for: 5m
    annotations:
      summary: API P99 latency > 2s
```

---

[← Prometheus Advanced](./02-prometheus-advanced) | [→ Observability](../../21-observability/01-observability-essentials) | [🏠 الرئيسية](/)
