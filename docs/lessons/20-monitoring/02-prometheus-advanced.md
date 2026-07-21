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
  - job_name: "federate"
    honor_labels: true
    metrics_path: "/federate"
    params:
      match[]:
        - '{job="api"}'
    static_configs:
      - targets:
          - "prometheus-us.azure.cloudnova.com:9090"
          - "prometheus-eu.azure.cloudnova.com:9090"
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

**Alert: HighErrorRate triggered 2AM**

```bash
# تشخيص سريع عبر PromQL في Grafana
# 1. أي endpoint يسبب الأخطاء؟
sum(rate(http_requests_total{status=~"5.."}[5m])) by (endpoint)

# 2. هل هي مشكلة في DB؟
rate(db_connection_errors_total[5m])

# 3. هل هناك deployment حديث؟
changes(kube_deployment_status_observed_generation[30m])
```

**النتيجة**: Deployment حديث غيّر connection string. Rollback خلال دقيقتين.

### Alert Design Best Practices

1. **لا alert على كل شيء** — فقط ما يحتاج استيقاظ 3AM
2. **Runbook URL** — كل alert معه رابط runbook
3. **pages vs tickets** — Critical → PagerDuty. Warning → Jira ticket

---

## 🎨 Recording Rules vs Ad-hoc Queries

|               | Recording Rules      | Ad-hoc Queries  |
| ------------- | -------------------- | --------------- |
| **السرعة**    | فورية (pre-computed) | تحسب عند الطلب  |
| **الاستخدام** | Dashboards, alerts   | استكشاف الأخطاء |
| **التكلفة**   | RAM/CPU إضافي        | لا شيء          |

---

## 🛠️ تدريبات

### تمرين: اكتب PromQL query يحسب P99 latency لكل endpoint

### تحدي: صمم alert rule مع runbook

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما فائدة Recording Rules؟
2. كيف تصمم alert جيد؟
3. متى تستخدم Federation؟

### 🃏 بطاقات

| السؤال         | الإجابة                                   |
| -------------- | ----------------------------------------- |
| PromQL         | لغة استعلام Prometheus                    |
| Recording Rule | Pre-computed metric لتسريع الـ dashboards |
| AlertManager   | إدارة وتوجيه التنبيهات                    |

---

## 🎤 مقابلة

1. **"كيف تراقب 1000 خدمة؟"** → Federation + Recording Rules + Thanos/Cortex
2. **"كيف تصمم alert لا يسبب fatigue؟"** → threshold مناسب + runbook + pages فقط للحالات الحرجة

---

[← Monitoring Fundamentals](./01-monitoring-fundamentals) | [→ Grafana](./03-grafana-dashboards-alerting) | [🏠 الرئيسية](/)
