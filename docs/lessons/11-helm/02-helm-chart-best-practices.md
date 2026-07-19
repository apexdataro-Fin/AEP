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

## 🛠️ تدريب

1. أنشئ Chart library للـ labels و annotations المشتركة
2. أضف Helm test يتحقق من صحة الـ deployment

---

[← Helm Fundamentals](./01-helm-fundamentals) | [→ Helmfile & GitOps](./03-helmfile-gitops-integration) | [🏠 الرئيسية](/)
