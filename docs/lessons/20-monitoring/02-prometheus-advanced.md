---
sidebar_position: 2
title: "Prometheus متقدم"
description: "PromQL، Recording Rules، AlertManager، Federation — Prometheus على نطاق المؤسسة."
---

# Prometheus متقدم

> "Prometheus الأساسي سهل. المتقدم هو ما تحتاجه في الإنتاج."

## 🎯 أهداف التعلم

- كتابة PromQL queries متقدمة
- Recording Rules للأداء
- AlertManager configuration
- Prometheus Federation للتوسع

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Advanced

---

## 🏗️ PromQL متقدم

```promql
# معدل الطلبات لكل Pod (متوسط 5 دقائق)
rate(http_requests_total{job="api"}[5m])

# الـ 99th percentile latency
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# نسبة الأخطاء
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# توقع امتلاء القرص خلال 4 ساعات
predict_linear(node_filesystem_free_bytes[1h], 4 * 3600) < 0
```

### Recording Rules

```yaml
groups:
- name: api_rules
  interval: 30s
  rules:
  - record: job:http_requests_total:rate5m
    expr: rate(http_requests_total[5m])
  - record: job:http_errors:rate5m
    expr: rate(http_requests_total{status=~"5.."}[5m])
```

### AlertManager

```yaml
groups:
- name: api_alerts
  rules:
  - alert: HighErrorRate
    expr: job:http_errors:rate5m / job:http_requests_total:rate5m > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "API error rate > 5%"
      runbook: "https://wiki.cloudnova.com/runbooks/high-error-rate"
```

### Federation

```yaml
scrape_configs:
- job_name: 'federate'
  honor_labels: true
  metrics_path: '/federate'
  params:
    match[]:
      - '{job="api"}'
  static_configs:
    - targets:
      - 'prometheus-us.azure.cloudnova.com:9090'
      - 'prometheus-eu.azure.cloudnova.com:9090'
```

---

[← Monitoring Fundamentals](./01-monitoring-fundamentals) | [→ Grafana](./03-grafana-dashboards-alerting) | [🏠 الرئيسية](/)
