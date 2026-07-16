---
sidebar_position: 1
title: "المراقبة والملاحظة"
description: "السجلات، المقاييس، التتبع: الأركان الثلاثة مع OpenTelemetry."
---

# المراقبة والملاحظة

> **"المراقبة تخبرك أن هناك مشكلة. الملاحظة تخبرك لماذا."**

## المراقبة ≠ الملاحظة

| الجانب       | المراقبة           | الملاحظة               |
| ------------ | ------------------ | ---------------------- |
| تعرف مسبقاً  | ✅ "هل CPU > 80%؟" | ❌ لا تعرف ما تبحث عنه |
| تكتشف جديداً | ❌ ما تعرفه فقط    | ✅ "لماذا API بطيء؟"   |
| أسئلة محددة  | ✅                 | ❌                     |
| استكشاف حر   | ❌                 | ✅                     |

## الأركان الثلاثة

| الركن                | السؤال    | الأداة        |
| -------------------- | --------- | ------------- |
| **السجلات Logs**     | ماذا حدث؟ | Loki, Elastic |
| **المقاييس Metrics** | كم؟       | Prometheus    |
| **التتبع Traces**    | أين حدث؟  | Tempo, Jaeger |

## OpenTelemetry عملياً

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.exporter.otlp import OTLPSpanExporter

# إعداد
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# تتبع طلب
with tracer.start_as_current_span("process_order") as span:
    span.set_attribute("order.id", "12345")
    span.set_attribute("order.value", 99.99)
    # ... كل ما يحدث هنا يُتتبع تلقائياً
```

## سيناريو CloudNova: اكتشاف عنق الزجاجة

> **الموقف:** عميل: "تأكيد الطلب يستغرق ٨ ثوانٍ."

**مع Trace:** API GW (50ms) → Orders (100ms) → **Inventory (7.4s!)** → Payment (200ms)

**السبب:** استعلام يمسح جدولاً كاملاً. **الحل:** فهرس — 7.4s → 80ms.

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
