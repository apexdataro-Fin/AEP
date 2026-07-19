---
sidebar_position: 2
title: "أفضل ممارسات Helm Charts"
description: "Helm Chart Best Practices — مكتبات، تبعيات، اختبارات، إدارة القيم."
---

# أفضل ممارسات Helm Charts

> "الـ Helm Chart الجيد يفرق بين 'يعمل على جهازي' و 'يعمل في كل مكان'."

## 🎯 أهداف التعلم

- هيكلة Chart احترافية
- Library Charts للمكونات المشتركة
- Helm Unit Tests
- إدارة القيم لبيئات متعددة

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ هيكلة Chart احترافية

```
myapp/
├── Chart.yaml
├── values.yaml          # قيم افتراضية
├── values-dev.yaml      # قيم التطوير
├── values-staging.yaml  # قيم staging
├── values-prod.yaml     # قيم الإنتاج
├── templates/
│   ├── _helpers.tpl     # دوال مساعدة
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── serviceaccount.yaml
│   └── NOTES.txt
└── tests/
    └── test-connection.yaml
```

### النشر لبيئات مختلفة

```bash
helm upgrade --install myapp ./myapp -f values-prod.yaml -n production
helm upgrade --install myapp ./myapp -f values-dev.yaml -n development
```

### Library Charts

```yaml
# Chart.yaml للمكتبة
apiVersion: v2
name: cloudnova-lib
type: library
version: 1.0.0

# templates/_labels.tpl في المكتبة
{{- define "cloudnova-lib.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
```

### Helm Tests

```yaml
# templates/tests/test-connection.yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ .Release.Name }}-test"
  annotations:
    helm.sh/hook: test
spec:
  containers:
  - name: test
    image: busybox
    command: ['wget']
    args: ['{{ .Release.Name }}-service:{{ .Values.service.port }}']
  restartPolicy: Never
```

```bash
helm test myapp -n production
```

---

## 🏛️ طبقة الإنتاج

### سيناريو CloudNova: Chart سيء يكلف 3 ساعات

نشر أحدهم Chart بدون `resources.limits`. الـ pod استهلك كل ذاكرة الـ node. 3 pods أخرى تعطلت.

**الحل**:
```yaml
# values-prod.yaml — دائماً حدد limits
resources:
  limits:
    cpu: 1000m
    memory: 512Mi
  requests:
    cpu: 200m
    memory: 256Mi
```

### استراتيجيات الترقية

```yaml
# Rolling Update (افتراضي)
strategy:
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0  # صفر downtime!
```

---

## 🎨 طبقة المعماري: Chart Organization

| النمط | متى تستخدمه |
|-------|-----------|
| **Monochart** | تطبيق بسيط، خدمة واحدة |
| **Library + App** | عدة تطبيقات تشترك في templates |
| **Umbrella Chart** | عدة خدمات في Chart واحد |

---

## 🛠️ تدريبات

### تمرين: أنشئ Chart library
أنشئ library chart يحتوي على labels و annotations مشتركة.

### تحدي: Helm Test متقدم
اكتب Helm test يتحقق من اتصال الـ pod بقاعدة البيانات.

---

## 📝 تقييم

### ✅ فحص المعرفة
1. لماذا `resources.limits` ضرورية في الإنتاج؟
2. ما فائدة Library Charts؟
3. كيف تدير قيم مختلفة لكل بيئة؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| values-prod.yaml | قيم مخصصة لبيئة الإنتاج |
| Library Chart | Chart يحتوي templates قابلة لإعادة الاستخدام |
| `helm test` | تشغيل اختبارات التحقق بعد النشر |

---

## 🎤 مقابلة
1. **"كيف تنظم Helm Charts لمؤسسة؟"** → Library + App charts + Helmfile + Argo CD
2. **"كيف تضمن عدم وجود downtime أثناء الترقية؟"** → Rolling update + readiness probes + Helm hooks

---

## 📚 مراجع
| النوع | الرابط |
|-------|--------|
| درس مرتبط | [Helmfile & GitOps](./03-helmfile-gitops-integration) |
| شهادة | CKA |

---

[← Helm Fundamentals](./01-helm-fundamentals) | [→ Helmfile & GitOps](./03-helmfile-gitops-integration) | [🏠 الرئيسية](/)
