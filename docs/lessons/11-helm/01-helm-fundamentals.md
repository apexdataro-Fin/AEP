---
sidebar_position: 1
title: "Helm — مدير حزم Kubernetes"
description: "Helm: charts، values، repositories، hooks، والاختبارات — نشر متقدم على Kubernetes."
---

# Helm — مدير حزم Kubernetes

> **"Helm هو pip/npm لـ Kubernetes. بدلاً من ١٠ ملفات YAML — Chart واحد. لكنه أكثر من ذلك بكثير."**

## لماذا Helm؟

```bash
# بدون Helm: ٥+ أوامر
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f ingress.yaml

# مع Helm:
helm install my-api ./chart --set replicaCount=3 --set environment=prod
```

## هيكل الـ Chart

```
mychart/
├── Chart.yaml          # بيانات التعريف (اسم، إصدار، وصف)
├── values.yaml         # القيم الافتراضية
├── values-prod.yaml    # قيم بيئة الإنتاج
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── _helpers.tpl    # دوال مساعدة (Go templating)
│   └── NOTES.txt       # رسالة بعد التثبيت
└── charts/             # تبعيات (Subcharts)
```

## Go Templating في Helm

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-{{ .Chart.Name }}
  labels:
    app: {{ .Values.app.name }}
    environment: {{ .Values.environment }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        {{- if .Values.resources }}
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
        {{- end }}
```

## Hooks — تنفيذ إجراءات قبل/بعد النشر

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}-db-migrate"
  annotations:
    "helm.sh/hook": pre-upgrade       # ينفذ قبل الترقية
    "helm.sh/hook-weight": "5"        # ترتيب التنفيذ
    "helm.sh/hook-delete-policy": hook-succeeded  # يحذف بعد النجاح
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: cloudnova/migrate:{{ .Values.image.tag }}
        command: ["python", "manage.py", "migrate"]
      restartPolicy: Never
```

## أوامر أساسية

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm search repo nginx
helm install my-nginx bitnami/nginx --set replicaCount=3
helm upgrade my-nginx bitnami/nginx --values values-prod.yaml
helm rollback my-nginx 1
helm history my-nginx
helm uninstall my-nginx
helm lint ./mychart                     # تحقق من صحة الـ chart
helm template ./mychart                 # عرض الناتج دون تطبيق
```

## سيناريو CloudNova: ترقية آمنة

> **الموقف:** نشر `v3` من الـ API. ظهر خطأ في الإنتاج.

```bash
# ١. شوف تاريخ النشرات
helm history cloudnova-api
# 1  v1  deployed
# 2  v2  deployed
# 3  v3  failed     ← هذه هي!

# ٢. تراجع فوراً
helm rollback cloudnova-api 2

# ٣. الإصدار v2 عاد للعمل — نصحح v3 ونعيد المحاولة
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
