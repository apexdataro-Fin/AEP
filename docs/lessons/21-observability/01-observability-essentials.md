---
sidebar_position: 1
title: "الملاحظة Observability"
description: "السجلات، المقاييس، التتبع — الأركان الثلاثة للملاحظة مع OpenTelemetry."
---

# الملاحظة Observability

> **"المراقبة تخبرك أن هناك مشكلة. الملاحظة تخبرك لماذا."**

## الفرق بين المراقبة والملاحظة

| المراقبة                | الملاحظة                   |
| ----------------------- | -------------------------- |
| تعرف مسبقاً ما تبحث عنه | تكتشف ما لم تكن تعرفه      |
| "هل CPU > 80%؟"         | "لماذا المستخدمون بطيئون؟" |
| لوحات معلومات ثابتة     | استكشاف ديناميكي           |
| تنبيهات محددة مسبقاً    | أسئلة مفتوحة               |

## الأركان الثلاثة

| الركن                | السؤال    | الأداة        |
| -------------------- | --------- | ------------- |
| **السجلات Logs**     | ماذا حدث؟ | Elastic, Loki |
| **المقاييس Metrics** | كم؟       | Prometheus    |
| **التتبع Traces**    | أين حدث؟  | Jaeger, Tempo |

## OpenTelemetry

المعيار المفتوح لجمع بيانات المراقبة. بائع محايد — يعمل مع أي منصة.

```python
from opentelemetry import trace
from opentelemetry.exporter.otlp import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider

# إعداد
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# استخدام
with tracer.start_as_current_span("process_order") as span:
    span.set_attribute("order.id", "12345")
    span.set_attribute("order.value", 99.99)
    # ... منطق التطبيق هنا — يُتتبع تلقائياً
```

## سيناريو CloudNova: لماذا الطلب بطيء؟

> **الموقف:** عميل يشتكي: "تأكيد الطلب يستغرق ٨ ثوانٍ."

**بدون Observability:** تخمين. "ربما قاعدة البيانات؟" "ربما الشبكة؟"

**مع Observability (Trace):**

- API Gateway: ٥٠ms ✅
- خدمة الطلبات: ١٠٠ms ✅
- التحقق من المخزون: ٧.٤ ثوانٍ ❌ ← هنا المشكلة
- معالج الدفع: ٢٠٠ms ✅

**السبب:** استعلام قاعدة البيانات في خدمة المخزون يمسح جدولاً كاملاً بدل استخدام فهرس.

**الحل:** أضف فهرساً — الوقت ينخفض من ٧.٤ ثوانٍ إلى ٨٠ms.

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
