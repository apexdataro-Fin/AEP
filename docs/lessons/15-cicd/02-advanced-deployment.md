---
sidebar_position: 2
title: "استراتيجيات النشر المتقدمة"
description: "Blue-Green، Canary، Rolling Updates، A/B Testing، وكيف تختار الاستراتيجية المناسبة."
---

# استراتيجيات النشر المتقدمة

> "النشر ليس زراً تضغطه. النشر استراتيجية تختارها."

## 🎯 أهداف التعلم

- Blue-Green Deployment مع تبديل فوري
- Canary Deployment مع توجيه تدريجي
- Rolling Updates مع Zero Downtime
- A/B Testing لقياس التأثير
- اختيار الاستراتيجية المناسبة لكل موقف

---

## ١. لماذا استراتيجية النشر مهمة؟

### 🔹 تكلفة الخطأ

```bash
# نشر تقليدي (سيء):
kubectl apply -f deployment.yaml  # كل الـ Pods تُستبدل دفعة واحدة
# → 30 ثانية من downtime
# → 5000 مستخدم يرون خطأ
# → 100 طلب فاتورة فشل
# → التكلفة: ~5000 يورو

# مع استراتيجية صحيحة:
# → 0 downtime
# → 0 طلبات فاشلة
```

### 🔹 خريطة الاختيار

| الاستراتيجية       | Downtime | وقت الرجوع | المخاطرة    | تعقيد البنية      |
| ------------------ | -------- | ---------- | ----------- | ----------------- |
| **Rolling Update** | صفر      | دقائق      | منخفضة      | لا شيء إضافي      |
| **Blue-Green**     | صفر      | ثوانٍ      | منخفضة جداً | بيئتان متطابقتان  |
| **Canary**         | صفر      | فوري       | الأدنى      | Traffic Splitting |
| **A/B Testing**    | صفر      | فوري       | منخفضة      | ميزات تجريبية     |

---

## ٢. Rolling Updates

### 🔹 الآلية

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2 # يمكن إضافة Podين زيادة مؤقتاً
      maxUnavailable: 1 # Pod واحد كحد أقصى غير متاح
  template:
    spec:
      containers:
        - name: api
          image: cloudnova/api:v2.1.0
```

### 🔹 كيف يعمل خطوة بخطوة

```
البداية: 5 Pods v1.0  [A] [B] [C] [D] [E]

الخطوة ١: إنشاء Pod جديد v2.0        [F]  (+1 maxSurge)
الخطوة ٢: حذف Pod قديم                [B] [C] [D] [E] [F]  (5 Pods)
الخطوة ٣: إنشاء Pod جديد              [B] [C] [D] [E] [F] [G]
الخطوة ٤: حذف Pod قديم                [C] [D] [E] [F] [G]
...
النهاية: 5 Pods v2.0  [F] [G] [H] [I] [J]
```

### 🔹 Readiness Gates: لا ترسل حركة قبل الاستعداد

```yaml
spec:
  containers:
    - name: api
      readinessProbe:
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 15 # انتظر ١٥ ثانية قبل أول فحص
        periodSeconds: 5
        failureThreshold: 3 # ٣ فشل متتالية = غير جاهز
        successThreshold: 2 # ٢ نجاح متتالية = جاهز


# الـ Endpoint (/ready) يجب أن يُرجع 200 فقط بعد:
# - اكتمال تحميل الـ Config
# - نجاح اتصال قاعدة البيانات
# - اكتمال Warm-up الـ Cache
```

### 🔹 مثال: Ready Endpoint

```javascript
// ready.js
let isReady = false;

async function initialize() {
  // تسخين الاتصالات
  await db.authenticate();
  await redis.ping();

  // تحميل التكوين
  await configService.load();

  // إحماء الكاش
  await cacheService.warmup(["popular", "recent"]);

  isReady = true;
  console.log("✅ Pod ready to serve traffic");
}

app.get("/ready", (req, res) => {
  if (isReady) return res.sendStatus(200);
  res.sendStatus(503);
});

initialize();
```

---

## ٣. Blue-Green Deployment

### 🔹 الفكرة

```
Blue (حالي)     → إنتاج، يخدم الزوار
Green (جديد)    → مُجهز، قيد الاختبار

بعد التأكد من Green:
Blue ← Green → التبديل فوري
Blue القديم يبقى للرجوع السريع
```

### 🔹 تنفيذ مع Kubernetes Services

```yaml
# ١. نشر الإصدارين
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-blue
  labels:
    app: api
    version: blue
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: api
        version: blue
    spec:
      containers:
        - name: api
          image: cloudnova/api:v2.0.0
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-green
  labels:
    app: api
    version: green
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: api
        version: green
    spec:
      containers:
        - name: api
          image: cloudnova/api:v2.1.0

---
# ٢. Service تشير لـ Blue حالياً
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
    version: blue # ← غيّر إلى green للتبديل
  ports:
    - port: 3000
```

### 🔹 التبديل

```bash
# اختبار Green أولاً
kubectl port-forward deployment/api-green 3001:3000
curl http://localhost:3001/healthz  # ✓ يعمل
curl http://localhost:3001/api/test  # ✓ يستجيب بشكل صحيح

# تبديل فوري
kubectl patch svc api -p '{"spec":{"selector":{"version":"green"}}}'

# في ثانية واحدة، كل الحركة تذهب لـ Green!

# إذا حدث خطأ، رجوع فوري:
kubectl patch svc api -p '{"spec":{"selector":{"version":"blue"}}}'
```

---

## ٤. Canary Deployment

### 🔹 الفكرة

```
10% → v2 (Canary)
90% → v1 (Stable)

إذا نجح الـ Canary:
25% → 50% → 75% → 100%
```

### 🔹 تنفيذ مع Istio

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: api-canary
spec:
  hosts:
    - api
  http:
    - match:
        - headers:
            x-canary-user: # مستخدمين محددين في Canary
              exact: "true"
      route:
        - destination:
            host: api
            subset: v2
    - route:
        - destination:
            host: api
            subset: v1
          weight: 90 # ٩٠٪ إلى الإصدار المستقر
        - destination:
            host: api
            subset: v2
          weight: 10 # ١٠٪ إلى الإصدار التجريبي
```

### 🔹 تنفيذ بسيط مع Ingress Nginx

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-canary
spec:
  selector:
    app: api
    version: canary
  ports:
    - port: 3000

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"
spec:
  rules:
    - host: api.cloudnova.io
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-canary
                port:
                  number: 3000
```

### 🔹 مراقبة Canary

```bash
# مقاييس أساسية للمقارنة بين v1 و v2:
# - معدل الأخطاء (يجب أن يكون متساوياً أو أقل)
# - زمن الاستجابة (p50, p95, p99)
# - استخدام الذاكرة/المعالج
# - معدل الإكمال (للعمليات التجارية)

# Prometheus Query لمقارنة الأخطاء:
# rate(http_requests_total{status=~"5.."}[5m]) by (version)
```

---

## ٥. A/B Testing

### 🔹 الفرق بين Canary و A/B

|                | Canary            | A/B Testing        |
| -------------- | ----------------- | ------------------ |
| **الهدف**      | تقليل مخاطر النشر | قياس تأثير الميزات |
| **النسخ**      | نسخة واحدة مختلفة | قد تكون عدة نسخ    |
| **المستخدمين** | عشوائي            | مجموعات محددة      |
| **القياس**     | أخطاء، أداء       | تحويل، تفاعل       |
| **المدة**      | ساعات             | أيام/أسابيع        |

### 🔹 تنفيذ A/B

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: api-ab
spec:
  hosts:
    - api
  http:
    # مجموعة A: تصميم جديد
    - match:
        - headers:
            cookie:
              regex: ".*ui_version=new.*"
      route:
        - destination:
            host: api
            subset: v2-new-ui
    # مجموعة B: تصميم قديم
    - route:
        - destination:
            host: api
            subset: v1-current
```

---

## ٦. Feature Flags: نشر بدون إعادة نشر

### 🔹 لماذا؟

```yaml
# بدلاً من إعادة النشر لتشغيل/إيقاف ميزة:

# سيء:
git commit -m "تعطيل ميزة الدفع"
git push
kubectl rollout restart deployment/api

# جيد:
curl -X POST https://api.cloudnova.io/admin/features \
  -d '{"feature":"new-payment-gateway","enabled":false}'

# فوري! بدون إعادة نشر!
```

### 🔹 تطبيق Feature Flag

```javascript
// featureFlags.js
const flags = {
  "new-payment-gateway": {
    enabled: true,
    rollout: 0.1, // 10% من المستخدمين
    targetGroups: ["beta-testers"],
  },
  "dark-mode": {
    enabled: true,
    rollout: 1.0, // 100% من المستخدمين
  },
};

function isEnabled(feature, user) {
  const flag = flags[feature];
  if (!flag || !flag.enabled) return false;

  // Selective rollout
  if (flag.rollout < 1.0) {
    if (flag.targetGroups?.includes(user.group)) return true;
    return hash(user.id) % 100 < flag.rollout * 100;
  }

  return true;
}
```

---

## 🏢 سيناريو CloudNova: كارثة Canary

### الموقف

نشرت CloudNova إصداراً جديداً من API الفوترة. استخدمت Canary 10%. بعد ٣٠ دقيقة:

```bash
# تنبيه من Grafana
# ✗ 500 Error Rate: 2.3% (v2) vs 0.01% (v1)
# ✗ P99 Latency: 4200ms (v2) vs 200ms (v1)
# ✗ Memory: 780MB (v2) vs 320MB (v1)

# الخسارة: 30 دقيقة × 10% حركة = ~50 فاتورة فاشلة
```

### ما حدث

```javascript
// الكود المُشكل في v2
async function processBilling(invoice) {
  // ❌ N+1 Query: استعلام لكل عنصر
  const items = await getInvoiceItems(invoice.id);
  for (const item of items) {
    const product = await getProduct(item.productId); // 500 استعلام!
  }
}

// الإصلاح في v3
async function processBilling(invoice) {
  const items = await getInvoiceItems(invoice.id);
  const productIds = items.map((i) => i.productId);
  const products = await getProducts(productIds); // استعلام واحد
  // ...
}
```

### الدرس المستفاد

1. **راقب Canary بدقة أول ٣٠ دقيقة**
2. **فعّل تنبيهات تلقائية للرجوع**
3. **اختبر تحت حمل إنتاجي قبل النشر**

---

## ٧. Pipeline للنشر الآمن

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production
on:
  workflow_dispatch:
    inputs:
      strategy:
        description: "استراتيجية النشر"
        required: true
        type: choice
        options: [rolling, blue-green, canary]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # ١. فحوصات ما قبل النشر
      - name: Smoke tests on staging
        run: npm run test:smoke -- --env=staging

      # ٢. نشر حسب الاستراتيجية
      - name: Canary 10%
        if: inputs.strategy == 'canary'
        run: |
          kubectl apply -f k8s/canary-10.yaml
          sleep 600  # انتظر ١٠ دقائق

      - name: Verify Canary
        if: inputs.strategy == 'canary'
        run: ./scripts/verify-canary.sh
        # يفشل إذا: error_rate > 1% أو p99 > 2x

      - name: Canary 50%
        if: inputs.strategy == 'canary'
        run: kubectl apply -f k8s/canary-50.yaml

      - name: Full rollout
        run: kubectl apply -f k8s/deployment.yaml

      # ٣. مراقبة ما بعد النشر
      - name: Post-deploy monitoring
        run: ./scripts/monitor-deploy.sh --duration=30m
```

---

## 🧠 Active Recall

1. ما الفرق بين Rolling Update و Blue-Green؟
2. متى تختار Canary بدلاً من Blue-Green؟
3. كيف تفحص Canary قبل زيادة النسبة؟
4. ما فائدة Readiness Probe في النشر التدريجي؟
5. كيف ترجع فوراً إذا فشل النشر الجديد؟

---

## 📝 تمرين Feynman

اشرح Canary Deployment: تخيّل أنك طبّاخ في مطعم يُقدّم وصفة جديدة. بدلاً من تغيير القائمة كاملة (وخسارة كل الزبائن إذا لم تعجبهم)، تُقدّم الطبق الجديد لـ ١٠٪ من الزبائن وتطلب رأيهم. إذا أعجبهم، تزيد النسبة. إذا اشتكوا، تعود للوصفة القديمة فوراً.

---

## 🃏 بطاقات تعليمية

| السؤال                          | الإجابة           |
| ------------------------------- | ----------------- |
| نشر بدون downtime               | `RollingUpdate`   |
| بيئتان متطابقتان للتبديل الفوري | `Blue-Green`      |
| نسبة صغيرة من الحركة            | `Canary`          |
| أداة Traffic Splitting          | `Istio / Linkerd` |
| تفعيل/تعطيل ميزة بدون نشر       | `Feature Flags`   |

---

## 🎯 أسئلة مقابلة

### س: كيف تنشر إصداراً جديداً بدون أي downtime؟

1. **Rolling Update**: Readiness Probes + PodDisruptionBudget
2. **Blue-Green**: بيئة موازية + Service selector switch
3. **Canary**: 1% → 10% → 50% → 100% مع مراقبة مستمرة
4. **السر**: أتمتة الرجوع. أي خطأ = `kubectl rollout undo` تلقائي

---

<div align="center">

**[→ DevOps Culture](../16-devops/01-devops-culture)

---

## 🏛️ طبقة الإنتاج

### Auto-Rollback — لا تنتظر البشر

```yaml
# Argo Rollouts مع auto-rollback
analysis:
  templates:
    - templateName: error-rate-check
  args:
    - name: threshold
      value: "0.02" # 2% errors = rollback فوري
```

### 🚨 CloudNova: N+1 query في Canary

> v2 فيه N+1 query. Canary 10% = 50 فاتورة فاشلة. Auto-rollback أنقذ.

---

## 🛠️ تدريبات

**تمرين ١:** نفذ Blue-Green مع Service selector switch.
**تمرين ٢:** Canary deployment مع Istio.
**تحدي:** Argo Rollouts مع automated analysis.

### 📝 تقييم

**س١:** Rolling vs Blue-Green؟
→ Rolling: تدريجي على نفس الـ pods. Blue-Green: بيئتان كاملتان.

**س٢:** Canary vs A/B Testing؟
→ Canary: تقليل مخاطر النشر. A/B: قياس تأثير الميزات.

**س٣:** Readiness Probe فائدته؟
→ يمنع إرسال حركة لـ Pod غير جاهز.

### 🎤 مقابلة

**"كيف تنشر بدون downtime؟"**
→ RollingUpdate + maxUnavailable: 0 + readinessProbes.

---

[← CI/CD Pipelines](./01-cicd-pipelines) | [🏠 الرئيسية](/)
**

</div>
