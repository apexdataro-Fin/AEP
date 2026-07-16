---
sidebar_position: 1
title: "أساسيات المراقبة الشاملة"
description: "Observability: Metrics، Logs، Traces — الثالوث الذهبي لفهم أنظمتك من الداخل."
---

# أساسيات المراقبة الشاملة (Observability)

> "Monitoring يخبرك أن هناك مشكلة. Observability يخبرك لماذا."

## 🎯 أهداف التعلم

- فهم الأركان الثلاثة: Metrics, Logs, Traces
- إتقان OpenTelemetry للتطبيقات
- استخدام Loki للتجميع المركزي للسجلات
- تتبع الطلبات عبر الخدمات مع Tempo/Jaeger
- بناء ثقافة Observability في الفريق

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

معاً = الصورة الكاملة!
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

## 🧱 الطبقة المهنية: السجلات المركزية

### Grafana Loki

```yaml
# Loki + Promtail Architecture
┌──────────┐  ┌──────────┐  ┌──────────┐
│  App 1   │  │  App 2   │  │  App 3   │
│ stdout   │  │ stdout   │  │ stdout   │
└────┬─────┘  └────┬─────┘  └────┬─────┘
│             │             │
▼             ▼             ▼
┌────────────────────────────────────────┐
│           Promtail Agent               │
│  (يجمع السجلات ويضيف labels)           │
└────────────────┬───────────────────────┘
│ push
▼
┌────────────────────────────────────────┐
│              Loki                      │
│  (تخزين + فهرسة + استعلام)            │
└────────────────┬───────────────────────┘
│ LogQL
▼
┌────────────────────────────────────────┐
│             Grafana                    │
│  (استعلام + visualization)            │
└────────────────────────────────────────┘
```

### LogQL — لغة استعلام Loki

```logql
# كل الأخطاء في آخر ساعة
{job="api", env="production"} |= "ERROR"

# أخطاء مع استثناءات
{job="api"} |~ "panic|fatal|timeout"

# تحليل: أكثر 10 endpoints خطأً
topk(10,
  sum by (endpoint) (
    count_over_time({job="api"} |= "ERROR" [1h])
  )
)

# تتبع طلب محدد عبر كل الخدمات
{trace_id="abc123456"}

# سجلات بطيئة (>1 ثانية)
{job="api"}
| json
| duration > 1s
| line_format "{{.method}} {{.path}} {{.duration}}s"
```

### Structured Logging

```python
import structlog
import sys

# إعداد structured logging
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

# استخدام
logger.info("order_created",
    order_id="ORD-12345",
    customer_id="CUST-789",
    amount=150.00,
    items=3)
```

---

## 🏗️ الطبقة الإنتاجية: تتبع الطلبات

### Distributed Tracing مع OpenTelemetry

```python
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

# إعداد OpenTelemetry
provider = TracerProvider()
processor = BatchSpanProcessor(
    OTLPSpanExporter(endpoint="http://tempo:4317")
)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

# تلقيم FastAPI + HTTP client
FastAPIInstrumentor.instrument_app(app)
HTTPXClientInstrumentor().instrument()

tracer = trace.get_tracer(__name__)

@app.post("/orders")
async def create_order(order: OrderCreate):
    with tracer.start_as_current_span("create_order") as span:
        span.set_attribute("order.customer_id", order.customer_id)
        span.set_attribute("order.items_count", len(order.items))

        # التحقق من المخزون
        with tracer.start_as_current_span("check_inventory"):
            inventory = await inventory_service.check(order.items)

        # معالجة الدفع
        with tracer.start_as_current_span("process_payment"):
            payment = await payment_service.charge(order.total)

        # حفظ الطلب
        with tracer.start_as_current_span("save_order"):
            result = await db.orders.insert(order)

        span.set_attribute("order.id", str(result.id))
        return result
```

### Trace كامل عبر الخدمات

```
طلب: POST /orders
├── API Gateway: 2ms
└── Order Service:
    ├── Validate Order: 3ms
    ├── Check Inventory: 45ms ────► Inventory Service
    │   └── PostgreSQL Query: 40ms
    ├── Process Payment: 230ms ───► Payment Service
    │   └── Stripe API Call: 220ms
    └── Send Email: 15ms ──────────► Notification Service
        └── SendGrid API: 12ms

Total: 295ms
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

التكامل:
- من Trace تستطيع القفز إلى Logs المرتبطة ✓
- من Logs تستطيع رؤية Metrics المتعلقة ✓
- من Metric anomaly تستطيع فتح Trace للتحقيق ✓
```

### تكامل Metrics + Logs + Traces

```yaml
# Grafana datasource مع exemplars
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    url: http://mimir:9009
    jsonData:
      exemplarTraceIdDestinations:
        - name: traceID
          datasourceUid: tempo

  - name: Tempo
    type: tempo
    url: http://tempo:3200
    jsonData:
      tracesToLogsV2:
        datasourceUid: loki
        tags: ["pod", "namespace"]
        mappedTags: [{ key: "service.name", value: "service" }]

  - name: Loki
    type: loki
    url: http://loki:3100
```

---

## 🏥 سيناريو CloudNova: تشخيص مشكلة غامضة

```
📋 التذكرة: INC-2026-078
العنوان: بعض المستخدمين يرون أخطاء 500 بشكل متقطع
الأولوية: P1

منصة المراقبة الحالية: لا يوجد Observability!

التشخيص (قبل Observability):
├── البحث في سجلات 12 خدمة = 3 ساعات
└── لم نجد السبب!

بعد تثبيت LGTM Stack:

1. فتح Grafana:
   ├── Metrics: Error rate 2% (طبيعي 0.1%)
   ├── Traces: 80% من الطلبات البطيئة تمر عبر inventory-service
   └── Logs (Loki): {service="inventory", level="error"}
       "connection pool exhausted after 200ms"

2. السبب:
   Connection pool في inventory-service:
   max_connections = 5
   لكن الحمل تضاعف!

3. الإصلاح:
   max_connections = 20
   timeout = 500ms

4. وقت التشخيص:
   قبل: 3 ساعات
   بعد: 4 دقائق
```

---

## ⚡ الإنتاج وما بعده

### أفضل ممارسات Observability

| الممارسة                  | التنفيذ                       |
| ------------------------- | ----------------------------- |
| **Structured Logging**    | JSON logs دائماً              |
| **Trace context في logs** | trace_id + span_id في كل log  |
| **Sampling ذكي**          | 100% للأخطاء، 10% للنجاح      |
| **Retention policies**    | Logs: 30 يوم، Metrics: 13 شهر |
| **Dashboards as Code**    | Grafana dashboards في Git     |

---

## 🧠 التذكّر النشط

1. ما الأركان الثلاثة لـ Observability؟ ماذا يجيب كل منها؟
2. كيف تربط Metrics بـ Logs بـ Traces؟
3. ما الفرق بين structured و unstructured logging؟
4. كيف تختار sampling rate للـ traces؟
5. لماذا OpenTelemetry مهم كمبادرة صناعية؟

## 📝 بطاقات تعليمية

- **Trace**: رحلة طلب واحد عبر الخدمات المختلفة
- **Span**: وحدة عمل واحدة داخل Trace (مثلاً: استعلام DB)
- **Exemplar**: ربط metric معين بـ trace محدد
- **OpenTelemetry**: معيار مفتوح لجمع metrics, logs, traces
- **Correlation ID**: معرف فريد يربط logs و traces معاً

## 🎤 أسئلة المقابلة

1. **"كيف تختلف Observability عن Monitoring؟"**
   - Monitoring: تعرف ما ستراقبه مسبقاً (known unknowns)
   - Observability: تستطيع استكشاف ما لا تعرفه (unknown unknowns)
   - Observability = Monitoring + استكشاف + ربط البيانات

2. **"كيف تتعامل مع كميات ضخمة من الـ traces؟"**
   - Head-based sampling: قرار العينة عند بداية الطلب
   - Tail-based sampling: قرار العينة بعد اكتمال الطلب (يحتفظ بالبطيء/الخاطئ)
   - Adaptive sampling: تعديل تلقائي للنسبة

3. **"كيف تختار بين Elasticsearch و Loki للسجلات؟"**
   - Loki: أخف، أرخص، يتكامل مع Grafana، مثالي لـ Kubernetes
   - Elastic: أقوى في البحث النصي، أقدم، أغلى

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
