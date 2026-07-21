---
sidebar_position: 1
title: "أساسيات المراقبة الشاملة"
description: "Observability: Metrics، Logs، Traces — الثالوث الذهبي، SLOs/SLIs، RED/USE Methods، وتصميم التنبيهات الذكية."
---

# أساسيات المراقبة الشاملة (Observability)

> "Monitoring يخبرك أن هناك مشكلة. Observability يخبرك لماذا، أين، وكيف تصلحها."

## 🎯 أهداف التعلم

- إتقان الأركان الثلاثة: Metrics, Logs, Traces
- تصميم SLOs/SLIs لقياس موثوقية الخدمة
- استخدام RED و USE Methods
- بناء تنبيهات ذكية (لا noisy alerts!)
- تطبيق OpenTelemetry في بيئة إنتاجية

---

## 📖 الطبقة الأساسية: الأركان الثلاثة

### الثالوث الذهبي

```
┌─────────────────────────────────────────────┐
│                Observability                │
├─────────────────────────────────────────────┤
│  Metrics     │   Logs       │   Traces      │
│  (ماذا؟)     │  (لماذا؟)    │  (أين؟)       │
├─────────────────────────────────────────────┤
│  أرقام       │  أحداث       │  رحلات        │
│  CPU 82%     │  ERROR: DB   │  API → DB     │
│  RPS 1200    │  timeout     │  → Cache miss  │
│  p95 340ms   │              │  → 340ms total │
└─────────────────────────────────────────────┘
```

### السيناريو: لماذا نحتاج الثلاثة معاً؟

```
تأخر في استجابة API:
Metric: p95 latency ارتفع من 50ms إلى 2s
  └── نعرف أن هناك مشكلة — لكن أين؟

Trace: الطلب يستغرق 2s في استعلام قاعدة البيانات
  └── نعرف أين المشكلة — لكن لماذا؟

Log: "slow query detected: missing index on users.email"
  └── نعرف السبب — index مفقود!

الثلاثة معاً = تشخيص كامل في ثوانٍ
```

---

## 🧱 الطبقة المهنية: SLOs و SLIs — قياس الموثوقية

### المفهوم

```
SLI (Service Level Indicator) = ماذا نقيس؟
├── Availability: 99.9% من الطلبات ناجحة
├── Latency: p95 < 200ms
└── Error Rate: < 0.1%

SLO (Service Level Objective) = الهدف
├── "99.9% availability في آخر 28 يوماً"

Error Budget = 100% - SLO
├── 100% - 99.9% = 0.1% أخطاء مسموحة
└── إذا استهلكنا الـ error budget → نوقف الميزات الجديدة ونصلح
```

### مثال عملي

```yaml
# slo.yaml — تعريف SLO في Git
apiVersion: monitoring/v1
kind: SLO
metadata:
  name: cloudnova-api-availability
spec:
  service: cloudnova-api
  indicator:
    type: availability
    goodEvents: "rate(http_requests_total{status=~'2..|3..'}[5m])"
    totalEvents: "rate(http_requests_total[5m])"
  objective: 99.9
  window: 28d
  alerting:
    - name: burn-rate-1h
      threshold: 14.4 # يستهلك error budget خلال ساعة
    - name: burn-rate-6h
      threshold: 6
```

---

## 🏗️ الطبقة الإنتاجية: RED و USE Methods

### RED Method (لـ Services)

```
Rate      — كم طلب في الثانية؟
Errors    — كم خطأ؟
Duration  — كم تستغرق الطلبات؟

مثال:
Rate: 1200 req/s
Errors: 0.1% = 1.2 errors/s
Duration: p50=45ms, p95=200ms, p99=500ms

إذا p99 قفز من 200ms إلى 2s:
→ مشكلة في قاعدة البيانات؟ شبكة؟
```

### USE Method (لـ Resources)

```
Utilization  — كم % من المورد مستخدم؟
Saturation   — هل هناك طوابير انتظار؟
Errors       — هل هناك أخطاء في المورد؟

مثال:
CPU Utilization: 85%
CPU Saturation: run queue length = 8 (مرتفع!)
Memory Errors: 0 OOM kills

إذا Saturation مرتفع مع Utilization طبيعي:
→ bottleneck في I/O أو locks
```

---

## 🎨 الطبقة المعمارية: Grafana LGTM Stack

### LGTM = Loki + Grafana + Tempo + Mimir

```
Grafana LGTM Stack:

┌─────────────────────────────────────────────┐
│              Grafana (Unified UI)           │
├─────────────────────────────────────────────┤
│  Metrics    │  Logs    │  Traces   │  Alerts│
│  (Mimir)    │  (Loki)  │  (Tempo)  │        │
└─────────────────────────────────────────────┘

التكامل السحري:
- من Trace → اقفز لـ Logs المرتبطة (Tempo → Loki) ✓
- من Log → شاهد Metric anomaly المرتبط ✓
- من Alert → افتح Trace للتحقيق ✓
```

### LogQL — لغة استعلام Loki

```logql
# كل الأخطاء في آخر ساعة
{job="api", env="production"} |= "ERROR"

# أخطاء مع استثناءات panic/fatal
{job="api"} |~ "panic|fatal|timeout"

# أكثر 10 endpoints خطأً
topk(10,
  sum by (endpoint) (
    count_over_time({job="api"} |= "ERROR" [1h])
  )
)

# تتبع طلب محدد عبر trace_id
{trace_id="abc123456"}

# سجلات بطيئة مع بارسينج JSON
{job="api"}
| json
| duration > 1s
| line_format "{{.method}} {{.path}} {{.duration}}s"
```

### Structured Logging في Python

```python
import structlog

structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
)

logger = structlog.get_logger()

# استخدام مع trace_id
logger.info("order_created",
    order_id="ORD-12345",
    trace_id="0af7651916cd43dd8448eb211c80319c",
    customer_id="CUST-789",
    amount=150.00)
```

---

## ⚡ الإنتاج وما بعده: تنبيهات ذكية

### قواعد التنبيه الذهبية

```yaml
# ١. لا تنبه على symptoms — نبه على SLO burn rate
groups:
  - name: slo-alerts
    rules:
      # Burn rate سريع: error budget يستهلك خلال ساعة
      - alert: HighErrorBurnRate
        expr: |
          rate(http_errors_total[1h]) 
          / rate(http_requests_total[1h]) 
          > 14.4 * 0.001
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Error budget burning fast"
          description: "Service {{ $labels.service }} will exhaust budget in ~1h"

      # Burn rate بطيء: error budget يستهلك خلال 3 أيام
      - alert: LowErrorBurnRate
        expr: |
          rate(http_errors_total[6h]) 
          / rate(http_requests_total[6h]) 
          > 1 * 0.001
        for: 5m
        labels:
          severity: warning
```

### Anti-Patterns في التنبيهات

```
❌ لا تفعل:
├── صفحة (page) لكل مشكلة صغيرة
├── تنبيهات بدون runbook
├── تنبيهات على symptoms مثل "CPU > 80%"
└── فريق on-call يتجاهل التنبيهات (alert fatigue)

✅ افعل:
├── صفحة فقط إذا SLO مهدد
├── كل تنبيه له runbook واضح
├── نبه على SLO burn rate — ليس على metrics مباشرة
└── Ticket للتحذيرات، Page للـ critical
```

---

## 🚨 سيناريو CloudNova: تشخيص مشكلة غامضة

> **الموقف:** بعض المستخدمين يرون أخطاء 500. لا أحد يعرف السبب.

```
قبل Observability:
├── البحث في سجلات 12 خدمة = 3 ساعات
└── لم نجد السبب!

بعد تثبيت LGTM Stack:

١. Grafana Dashboard:
   ├── Error rate: 2% (SLO = 0.1%) ← SLO محروق!

٢. Tempo Traces:
   ├── 80% من الطلبات البطيئة تمر عبر inventory-service
   └── Span: "check_inventory" = 3.2s!

٣. Loki Logs:
   {service="inventory"} |= "ERROR"
   → "connection pool exhausted after 200ms"
   → max_connections = 5 فقط!

الحل: max_connections = 20 → error rate يعود لـ 0.05%

وقت التشخيص: من 3 ساعات → 4 دقائق
```

---

## 🧠 التذكّر النشط

1. ما الفرق بين SLI و SLO و SLA؟
2. كيف تحدد burn rate المناسب للتنبيه؟
3. متى تستخدم RED Method ومتى USE Method؟
4. كيف تربط Metrics بـ Logs بـ Traces في جلسة تحقيق واحدة؟
5. لماذا التنبيه على CPU > 80% يعتبر anti-pattern؟

## ✍️ تمرين Feynman

اشرح Observability لمدير مطعم: "Metrics = كم طبق تم تحضيره في الساعة. Logs = ماذا كتب الطاهي في دفتر الملاحظات. Traces = متابعة طبق واحد من الطلب حتى التقديم. SLO = وعدنا للزبون: الطلب جاهز في 15 دقيقة."

## 🎤 أسئلة المقابلة

1. **"كيف تختلف Observability عن Monitoring؟"**
   - Monitoring: تعرف ما ستراقبه مسبقاً (known unknowns)
   - Observability: تستطيع استكشاف ما لا تعرفه (unknown unknowns)
   - Observability = Monitoring + استكشاف + ربط البيانات + SLOs

2. **"كيف تصمم نظام تنبيهات لإنتاج؟"**
   - نبه على SLO burn rate — ليس على metrics
   - Critical → Page (حريق). Warning → Ticket (دخان)
   - كل alert له runbook + dashboard link
   - اختبر التنبيهات شهرياً (chaos engineering)

3. **"كيف تتعامل مع Alert Fatigue؟"**
   - قلل عدد التنبيهات — نبه فقط إذا SLO مهدد
   - حسّن signal-to-noise ratio
   - أضف aggregation: لا تنبه 50 مرة لنفس المشكلة
   - استخدم escalation policies ذكية

---

## 🏛️ طبقة الإنتاج: LGTM Stack

### Loki + Grafana + Tempo + Mimir = Observability Stack

- Metrics (Mimir) + Logs (Loki) + Traces (Tempo) في UI واحد
- من Trace → اقفز لـ Logs المرتبطة

### 🚨 CloudNova: تشخيص 4 دقائق

> قبل LGTM: 3 ساعات لتشخيص error. بعد: 4 دقائق.

---

## 🛠️ تدريبات

**تمرين ١:** Structured logging. **تمرين ٢:** SLO dashboard.

### 📝 تقييم

**س١:** SLI vs SLO vs SLA؟ → SLI: ماذا نقيس. SLO: الهدف. SLA: الوعد للعميل.
**س٢:** Burn rate = ؟ → سرعة استهلاك error budget.
**س٣:** Observability vs Monitoring؟ → Monitoring: known. Observability: unknown unknowns.

### 🎤 مقابلة

**"كيف تصمم observability stack؟"** → LGTM + OpenTelemetry + SLO-based alerting.

---

[← العودة للموديول](./01-observability-essentials) | [→ FinOps](../22-finops/01-finops-fundamentals) | [🏠 الرئيسية](/)
