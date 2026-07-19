---
sidebar_position: 1
title: "أساسيات المراقبة"
description: "مراقبة البنية التحتية والتطبيقات: Prometheus، Grafana، AlertManager، وأفضل الممارسات الإنتاجية."
---

# أساسيات المراقبة (Monitoring)

> "لا يمكنك إصلاح ما لا تراه. المراقبة هي عيناك على البنية التحتية."

## 🎯 أهداف التعلم

- فهم الفرق بين Monitoring و Observability
- إتقان Prometheus: metrics، PromQL، recording rules
- بناء لوحات Grafana احترافية
- إعداد تنبيهات ذكية مع AlertManager
- تطبيق أفضل ممارسات المراقبة الإنتاجية

---

## 📖 الطبقة الأساسية: لماذا المراقبة؟

### مستويات المراقبة الأربعة

```
المستوى 1: هل النظام يعمل؟ (UP/DOWN)
  └── Ping, HTTP check, TCP port check

المستوى 2: هل يعمل بشكل صحيح؟ (Functional)
  └── HTTP status codes, error rates

المستوى 3: هل يعمل بكفاءة؟ (Performance)
  └── Latency, throughput, resource usage

المستوى 4: هل يخدم العمل؟ (Business)
  └── Orders/min, user signups, revenue impact
```

### Monitoring vs Observability

|              | Monitoring           | Observability           |
| ------------ | -------------------- | ----------------------- |
| **السؤال**   | "هل النظام معطّل؟"   | "لماذا النظام بطيء؟"    |
| **البيانات** | Metrics محددة مسبقاً | Logs + Metrics + Traces |
| **النهج**    | Reactive (تفاعلي)    | Proactive (استباقي)     |
| **الأدوات**  | Prometheus, Nagios   | Grafana, Jaeger, Loki   |

---

## 🧱 الطبقة المهنية: Prometheus بعمق

### معمارية Prometheus

```
┌──────────────────────────────────────────────┐
│               Prometheus Server              │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Retrieval   │──│  TSDB (Time Series)  │  │
│  │  (Scraping)  │  │                      │  │
│  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │  PromQL      │──│  AlertManager        │  │
│  │  Engine      │  │  (تنبيهات)            │  │
│  └──────────────┘  └──────────────────────┘  │
└──────────────────────────────────────────────┘
          │  scrape كل 15-60 ثانية
          ▼
┌──────────────────────────────────────────────┐
│               Targets / Exporters            │
│  ├── Node Exporter (خادم)                    │
│  ├── App /metrics endpoints                  │
│  ├── Blackbox Exporter (probes)              │
│  └── Service Discovery (K8s, Consul)         │
└──────────────────────────────────────────────┘
```

### أنواع Metrics

| النوع         | الوصف           | مثال                                    |
| ------------- | --------------- | --------------------------------------- |
| **Counter**   | قيمة تزيد فقط   | عدد الطلبات، عدد الأخطاء                |
| **Gauge**     | قيمة تصعد وتهبط | استخدام الذاكرة، عدد المستخدمين النشطين |
| **Histogram** | توزيع القيم     | زمن استجابة الطلبات                     |
| **Summary**   | ملخص إحصائي     | percentiles (p50, p95, p99)             |

### PromQL — لغة استعلام Prometheus

```promql
# معدل الطلبات في آخر 5 دقائق
rate(http_requests_total[5m])

# نسبة الأخطاء
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m])) * 100

# 95th percentile لزمن الاستجابة
histogram_quantile(0.95,
  sum(rate(http_request_duration_seconds_bucket[5m]))
  by (le))

# توقع نمو القرص (4 ساعات)
predict_linear(disk_free_bytes[1h], 4*3600) < 0

# استخدام CPU كنسبة مئوية
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

### تسجيل Metrics للتطبيق

```python
from prometheus_client import Counter, Histogram, generate_latest
import time

# تعريف metrics
REQUESTS = Counter("http_requests_total", "Total requests",
    ["method", "endpoint", "status"])
DURATION = Histogram("http_request_duration_seconds",
    "Request duration", ["method", "endpoint"])

@app.middleware("http")
async def metrics_middleware(request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start

    REQUESTS.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    DURATION.labels(
        method=request.method,
        endpoint=request.url.path
    ).observe(duration)

    return response

@app.get("/metrics")
async def metrics():
    return Response(content=generate_latest(),
                    media_type="text/plain")
```

---

## 🏗️ الطبقة الإنتاجية: تنبيهات ذكية

### AlertManager — قواعد التنبيه

```yaml
groups:
  - name: cloudnova-critical
    rules:
      # تنبيه: الخدمة معطلة
      - alert: ServiceDown
        expr: up == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "{{ $labels.job }} معطل"
          description: "الخدمة {{ $labels.instance }} لا تستجيب منذ دقيقتين"

      # تنبيه: ارتفاع نسبة الأخطاء
      - alert: HighErrorRate
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m]))
          /
          sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "نسبة الأخطاء > 5%"

      # تنبيه: القرص سيمتلئ
      - alert: DiskWillFill
        expr: predict_linear(node_filesystem_free_bytes[1h], 4*3600) < 0
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "القرص سيمتلئ خلال 4 ساعات"

      # تنبيه: شهادة SSL ستنتهي
      - alert: SSLCertExpiring
        expr: probe_ssl_earliest_cert_expiry - time() < 86400 * 7
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "شهادة SSL ستنتهي خلال 7 أيام"
```

### AlertManager Routing

```yaml
route:
  receiver: slack-general
  routes:
    - match:
        severity: critical
      receiver: pagerduty-oncall
      continue: true
    - match:
        severity: warning
      receiver: slack-platform
    - match_re:
        service: database|redis
      receiver: slack-dba

receivers:
  - name: slack-general
    slack_configs:
      - channel: "#alerts"
        title: "{{ .GroupLabels.alertname }}"
        text: "{{ .CommonAnnotations.description }}"

  - name: pagerduty-oncall
    pagerduty_configs:
      - routing_key: "{{ .PD_ROUTING_KEY }}"
        severity: critical

  - name: slack-dba
    slack_configs:
      - channel: "#dba-team"
```

---

## 🎨 الطبقة المعمارية: Grafana

### لوحة قيادة الخدمة (RED Method)

```
RED Dashboard لكل خدمة:

┌─────────────────────────────────────────────┐
│ Rate (عدد الطلبات)                          │
│ ████████████████████████  1200 req/s        │
├─────────────────────────────────────────────┤
│ Errors (نسبة الأخطاء)                        │
│ ██░░░░░░░░░░░░░░░░░░░░░░  0.2%             │
├─────────────────────────────────────────────┤
│ Duration (زمن الاستجابة)                     │
│ p50: 45ms  p95: 120ms  p99: 340ms          │
└─────────────────────────────────────────────┘
```

```json
{
  "dashboard": {
    "title": "CloudNova API - RED Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{job='api'}[5m]))"
          }
        ]
      },
      {
        "title": "Error Rate %",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{job='api',status=~'5..'}[5m])) / sum(rate(http_requests_total{job='api'}[5m])) * 100"
          }
        ]
      },
      {
        "title": "Latency p95",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job='api'}[5m])) by (le))"
          }
        ]
      }
    ]
  }
}
```

### USE Method (للموارد)

| Resource    | Utilization | Saturation       | Errors            |
| ----------- | ----------- | ---------------- | ----------------- |
| **CPU**     | % usage     | run queue length | hardware errors   |
| **Memory**  | % used      | swap usage       | OOM kills         |
| **Disk**    | % used      | I/O queue        | read/write errors |
| **Network** | bandwidth   | dropped packets  | interface errors  |

---

## 🏥 سيناريو CloudNova: حادثة إنتاجية

```
📋 تنبيه: HighErrorRate
المستوى: critical
الوقت: 14:32

التنبيه:
sum(rate(http_requests_total{status=~"5.."}[5m])) = 47%

خطة التشخيص:

1. فتح Grafana Dashboard:
   ├── أي endpoint به أخطاء؟
   ├── هل تغير شيء في الـ deployment؟
   └── هل تأثرت قاعدة البيانات؟

2. فحص السجلات:
   Loki: {job="api"} |= "ERROR"

3. اكتشاف السبب:
   Migration job عدّل جدولاً دون قفل مناسب
   → Deadlocks في قاعدة البيانات

4. الإصلاح:
   ├── ترقية قاعدة البيانات
   ├── إضافة missing index
   └── تحسين الـ connection pool

5. Lessons Learned:
   ├── إضافة alert على deadlocks
   ├── Database migration checklist
   └── مراجعة connection pool settings
```

---

## ⚡ الإنتاج وما بعده

### أفضل ممارسات المراقبة

| الممارسة              | التنفيذ                                  |
| --------------------- | ---------------------------------------- |
| **RED للمستخدم**      | Rate, Errors, Duration لكل endpoint      |
| **USE للموارد**       | Utilization, Saturation, Errors لكل مورد |
| **تنبيه على الأعراض** | وليس على الأسباب                         |
| **Playbooks**         | لكل alert، توثيق خطوات الاستجابة         |
| **Silence الذكي**     | خلال maintenance windows                 |
| **مراجعة التنبيهات**  | شهرياً: هل التنبيه مفيد؟                 |

---

## 🧠 التذكّر النشط

1. ما الفرق بين Counter و Gauge و Histogram؟
2. كيف تكتب استعلام PromQL لنسبة الأخطاء؟
3. ما الفرق بين RED method و USE method؟
4. كيف توجه التنبيهات للفريق الصحيح في AlertManager؟
5. لماذا ننبه على الأعراض وليس الأسباب؟

## 📝 بطاقات تعليمية

- **Metric**: قياس كمي لحالة النظام (مثل: عدد الطلبات)
- **PromQL**: لغة استعلام Prometheus
- **AlertManager**: نظام توجيه التنبيهات (Slack, PagerDuty, Email)
- **Recording Rule**: حساب مسبق لـ query معقد لتسريع الأداء
- **Golden Signals**: Latency, Traffic, Errors, Saturation

## 🎤 أسئلة المقابلة

1. **"كيف تراقب تطبيق موزع (distributed)؟"**
   - Metrics: Prometheus مع federation
   - Logs: Loki أو ELK
   - Traces: Jaeger أو Tempo
   - Service Mesh: Istio يضيف observability تلقائياً

2. **"كيف تصمم نظام تنبيهات لا يسبب alert fatigue؟"**
   - تنبيه على الأعراض التي تؤثر على المستخدم
   - `for: 5m` لتجنب التنبيهات العابرة
   - مستويات severity واضحة
   - مراجعة وتنظيف التنبيهات شهرياً

3. **"ما الفرق بين blackbox و whitebox monitoring؟"**
   - Blackbox: فحص النظام من الخارج (هل يستجيب؟)
   - Whitebox: فحص النظام من الداخل (metrics, logs, traces)

---

## 🏛️ طبقة الإنتاج: Alert Design

### Anti-Alert Fatigue
- لا تنبه على symptoms (CPU > 80%). نبه على SLO burn rate.
- `for: 5m` لتجنب flapping.
- مراجعة شهرية للتنبيهات.

### 🚨 CloudNova: HighErrorRate
> p95 latency من 200ms → 3s. Metrics كشفت، Logs أكدت، fix في دقائق.

---

## 🛠️ تدريبات
**تمرين ١:** Prometheus + Grafana dashboard. **تمرين ٢:** AlertManager rules.

### 📝 تقييم
**س١:** RED = ؟ → Rate, Errors, Duration.
**س٢:** USE = ؟ → Utilization, Saturation, Errors.
**س٣:** Counter vs Gauge؟ → Counter يزيد فقط. Gauge يصعد ويهبط.

### 🎤 مقابلة
**"كيف تراقب distributed system؟"** → Metrics + Logs + Traces. RED+USE.

---

[← العودة للموديول](./01-monitoring-fundamentals) | [→ Observability](../21-observability/01-observability-essentials) | [🏠 الرئيسية](/)
