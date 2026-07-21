---
sidebar_position: 1
title: "أساسيات Helm"
description: "مدير الحزم لـ Kubernetes: Charts، Templates، Values، Hooks، واستراتيجيات النشر الإنتاجية."
---

# أساسيات Helm

> "Helm هو لـ Kubernetes مثل apt لـ Ubuntu. لا تنشر يدوياً ما يمكنك توحيده."

## 🎯 أهداف التعلم

- فهم معمارية Helm (Helm v3 بدون Tiller)
- إتقان كتابة Charts قابلة لإعادة الاستخدام
- فهم Go Templates في Helm
- إتقان Hooks، Tests، و Lifecycle
- بناء Helm Chart إنتاجي لـ CloudNova

---

## 📖 الطبقة الأساسية: ما هو Helm؟

### المشكلة بدون Helm

```bash
# دون Helm — نشر Nginx في Kubernetes:
kubectl create deployment nginx --image=nginx:1.25
kubectl create service clusterip nginx --tcp=80:80
kubectl create configmap nginx-config --from-file=nginx.conf
kubectl create secret tls nginx-tls --cert=cert.pem --key=key.pem
# ... 20 أمراً آخر ...
```

مع Helm:

```bash
helm install my-nginx bitnami/nginx \
  --set service.type=LoadBalancer \
  --set replicaCount=3
```

### معمارية Helm v3

```
┌─────────────────────────────────┐
│         Helm Client             │
│  (helm install/upgrade/...)     │
├─────────────────────────────────┤
│  Chart (YAML templates)         │
│  Values (تكوين المستخدم)        │
│  Release (حالة التثبيت)         │
├─────────────────────────────────┤
│  Kubernetes API Server          │
│  ├── Secrets (تخزين الإصدارات)  │
│  └── Resources (الموارد الفعلية)│
└─────────────────────────────────┘
```

**ملاحظة مهمة:** Helm v3 أزال Tiller! Helm client يتحدث مباشرة مع Kubernetes API.

---

## 🧱 الطبقة المهنية: هيكل الـ Chart

```
my-chart/
├── Chart.yaml          # بيانات الـ chart (اسم، نسخة، وصف)
├── values.yaml         # القيم الافتراضية
├── values.schema.json  # التحقق من صحة القيم (اختياري)
├── charts/             # اعتماديات (subcharts)
├── templates/          # قوالب Kubernetes
│   ├── NOTES.txt       # رسالة بعد التثبيت
│   ├── _helpers.tpl    # دوال مساعدة
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── serviceaccount.yaml
│   └── tests/
│       └── test-connection.yaml
└── .helmignore
```

### Chart.yaml

```yaml
apiVersion: v2
name: cloudnova-api
description: CloudNova API Service Helm Chart
type: application
version: 1.2.3 # إصدار الـ chart
appVersion: "3.4.1" # إصدار التطبيق
kubeVersion: ">=1.25.0"

maintainers:
  - name: CloudNova Platform Team
    email: platform@cloudnova.com

dependencies:
  - name: postgresql
    version: 14.x.x
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
  - name: redis
    version: 18.x.x
    repository: https://charts.bitnami.com/bitnami
    condition: redis.enabled
```

---

## 🏗️ الطبقة الإنتاجية: كتابة Templates احترافية

### _helpers.tpl — الدوال المساعدة

```yaml
{{/* _helpers.tpl */}}

{{/* إنشاء اسم كامل للمورد */}}
{{- define "cloudnova-api.fullname" -}}
{{- .Release.Name }}-{{ .Chart.Name | trunc 63 }}
{{- end }}

{{/* اختيار صورة الحاوية الصحيحة */}}
{{- define "cloudnova-api.image" -}}
{{- $registry := .Values.image.registry -}}
{{- $tag := .Values.image.tag | default .Chart.AppVersion -}}
{{- printf "%s/%s:%s" $registry .Values.image.repository $tag }}
{{- end }}

{{/* Labels موحدة */}}
{{- define "cloudnova-api.labels" -}}
app.kubernetes.io/name: {{ include "cloudnova-api.fullname" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
app.kubernetes.io/part-of: cloudnova
{{- end }}

{{/* Service Account */}}
{{- define "cloudnova-api.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
  {{ include "cloudnova-api.fullname" . }}
{{- else -}}
  {{ .Values.serviceAccount.name | default "default" }}
{{- end }}
{{- end }}
```

### deployment.yaml — إنتاجي

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "cloudnova-api.fullname" . }}
  labels: {{- include "cloudnova-api.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  strategy:
    type: {{ .Values.strategy.type }}
    {{- if eq .Values.strategy.type "RollingUpdate" }}
    rollingUpdate:
      maxSurge: {{ .Values.strategy.rollingUpdate.maxSurge }}
      maxUnavailable: {{ .Values.strategy.rollingUpdate.maxUnavailable }}
    {{- end }}
  selector:
    matchLabels: {{- include "cloudnova-api.labels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
        prometheus.io/scrape: "true"
        prometheus.io/port: {{ .Values.service.port | quote }}
      labels: {{- include "cloudnova-api.labels" . | nindent 8 }}
    spec:
      serviceAccountName: {{ include "cloudnova-api.serviceAccountName" . }}
      {{- with .Values.imagePullSecrets }}
      imagePullSecrets: {{- toYaml . | nindent 8 }}
      {{- end }}
      securityContext:
        fsGroup: 1000
        runAsNonRoot: true
      containers:
        - name: {{ .Chart.Name }}
          securityContext:
            readOnlyRootFilesystem: true
            allowPrivilegeEscalation: false
            capabilities:
              drop: ["ALL"]
          image: {{ include "cloudnova-api.image" . }}
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
              protocol: TCP
          {{- with .Values.env }}
          env: {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- if .Values.secrets }}
          envFrom:
            - secretRef:
                name: {{ include "cloudnova-api.fullname" . }}-secrets
          {{- end }}
          resources: {{- toYaml .Values.resources | nindent 12 }}
          {{- with .Values.probes }}
          livenessProbe: {{- toYaml .liveness | nindent 12 }}
          readinessProbe: {{- toYaml .readiness | nindent 12 }}
          {{- end }}
          volumeMounts:
            - name: config
              mountPath: /etc/config
              readOnly: true
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: config
          configMap:
            name: {{ include "cloudnova-api.fullname" . }}-config
        - name: tmp
          emptyDir:
            medium: Memory
            sizeLimit: 128Mi
```

### values.yaml — قيم افتراضية واضحة

```yaml
# ============================================
# CloudNova API Service — Helm Values
# ============================================

# --- Deployment Settings ---
replicaCount: 3
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0

# --- Container Image ---
image:
  registry: cloudnova.azurecr.io
  repository: api
  tag: "" # يترك فارغاً لاستخدام appVersion من Chart.yaml
  pullPolicy: IfNotPresent

imagePullSecrets:
  - name: acr-pull-secret

# --- Networking ---
service:
  type: ClusterIP
  port: 8080
  targetPort: 8080

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: api.cloudnova.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: api-tls
      hosts:
        - api.cloudnova.com

# --- Scaling ---
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

# --- Resources ---
resources:
  requests:
    cpu: 250m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 512Mi

# --- Probes ---
probes:
  liveness:
    httpGet:
      path: /health
      port: http
    initialDelaySeconds: 30
    periodSeconds: 10
  readiness:
    httpGet:
      path: /ready
      port: http
    initialDelaySeconds: 5
    periodSeconds: 5

# --- Environment ---
env:
  - name: LOG_LEVEL
    value: info
  - name: ENVIRONMENT
    value: production

secrets: true # سينشئ secretRef للأسرار

# --- Dependencies ---
postgresql:
  enabled: true
  auth:
    database: cloudnova
    username: app
    existingSecret: cloudnova-db-secret

redis:
  enabled: true
  architecture: replication
  auth:
    enabled: true
    existingSecret: cloudnova-redis-secret
```

---

## 🎨 الطبقة المعمارية: Hooks و Lifecycle

### Helm Hooks — تنفيذ أوامر في مراحل محددة

```yaml
# templates/hooks/db-migration.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: {{ include "cloudnova-api.fullname" . }}-db-migration
  annotations:
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "5"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migration
          image: {{ include "cloudnova-api.image" . }}
          command: ["python", "manage.py", "migrate"]
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: {{ include "cloudnova-api.fullname" . }}-secrets
                  key: database-url
```

| Hook           | متى يعمل؟         | مثال استخدام           |
| -------------- | ----------------- | ---------------------- |
| `pre-install`  | قبل إنشاء الموارد | التحقق من الصلاحيات    |
| `post-install` | بعد التثبيت       | رسالة ترحيب، اختبار    |
| `pre-delete`   | قبل الحذف         | نسخ احتياطي            |
| `post-delete`  | بعد الحذف         | تنظيف الموارد الخارجية |
| `pre-upgrade`  | قبل الترقية       | ترحيل قاعدة البيانات   |
| `pre-rollback` | قبل التراجع       | استعادة البيانات       |
| `test`         | عند `helm test`   | اختبار التثبيت         |

### Tests — التحقق من صحة التثبيت

```yaml
# templates/tests/test-api.yaml
apiVersion: v1
kind: Pod
metadata:
  name: {{ include "cloudnova-api.fullname" . }}-test
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: test
      image: curlimages/curl:8.4.0
      command: ["curl"]
      args:
        - -f
        - http://{{ include "cloudnova-api.fullname" . }}:{{ .Values.service.port }}/health
  restartPolicy: Never
```

---

## 🏥 سيناريو CloudNova: نشر بيئة كاملة بـ Helm

```
📋 التذكرة: HYD-1345
النوع: مهمة نشر
الأولوية: عالية

الوصف:
نشر بيئة CloudNova كاملة في AKS باستخدام Helm.

المكونات:
- API Service (Deployment + Service + Ingress + HPA)
- PostgreSQL (Bitnami subchart)
- Redis (Bitnami subchart)
- ConfigMaps + Secrets

├── 1. helm dependency update     # تحميل subcharts
├── 2. helm lint ./cloudnova-api  # التحقق من الصحة
├── 3. helm template --debug     # معاينة الناتج
├── 4. helm install staging ./cloudnova-api \
│        -f values.yaml \
│        -f values-staging.yaml
├── 5. helm test staging          # اختبار
├── 6. helm upgrade staging ...   # ترقية (إذا لزم)
└── 7. helm rollback staging 1    # تراجع إذا فشل
```

---

## ⚡ الإنتاج وما بعده

### استراتيجيات متعددة البيئات

```
charts/
├── cloudnova-api/
│   ├── values.yaml              # القيم الافتراضية
│   ├── values-dev.yaml          # تجاوزات التطوير
│   ├── values-staging.yaml      # تجاوزات ما قبل الإنتاج
│   └── values-prod.yaml         # تجاوزات الإنتاج
```

```bash
helm install api-dev ./cloudnova-api \
  -f values.yaml \
  -f values-dev.yaml \
  --namespace dev

helm install api-prod ./cloudnova-api \
  -f values.yaml \
  -f values-prod.yaml \
  --namespace production
```

### أفضل ممارسات Helm

| الممارسة                 | لماذا؟                      |
| ------------------------ | --------------------------- |
| `helm lint` قبل كل تثبيت | اكتشاف أخطاء الـ templates  |
| `helm template --debug`  | معاينة الناتج قبل التطبيق   |
| `helm diff upgrade`      | رؤية التغييرات قبل التطبيق  |
| `helm history`           | تتبع الإصدارات              |
| تجنب `latest` tag        | إصدارات محددة قابلة للتكرار |
| Labels قياسية            | `app.kubernetes.io/*`       |
| `NOTES.txt` مفيدة        | تعليمات بعد التثبيت         |

---

## 🧠 التذكّر النشط

1. ما التغيير الأساسي في Helm v3 مقارنة بـ v2؟
2. كيف تمرر قيم مختلفة لكل بيئة (dev/staging/prod)؟
3. ما الفرق بين `pre-install` و `pre-upgrade` hook؟
4. كيف تتحقق من أن Chart يعمل قبل نشره؟
5. متى تستخدم subchart ومتى تستخدم اعتمادية خارجية؟

## 📝 بطاقات تعليمية

- **Chart**: حزمة تحتوي كل ما يلزم لنشر تطبيق في Kubernetes
- **Release**: نسخة مشغّلة من Chart في Kubernetes
- **Values**: تكوين يمرر إلى Templates لتوليد Kubernetes manifests
- **Hook**: عملية تنفذ في مرحلة محددة من دورة حياة Release
- **Repository**: مكان لتخزين Charts (مثل OCI Registry أو Helm Repo)

## 🎤 أسئلة المقابلة

1. **"لماذا أزال Helm v3 Tiller؟"**
   - أمان: Tiller يحتاج صلاحيات cluster-admin
   - بساطة: Helm client يتحدث مباشرة مع Kubernetes API
   - إصدارات: كل إصدار Release يخزن كـ Secret في نفس namespace

2. **"كيف تدير الأسرار في Helm Charts؟"**
   - لا تخزن الأسرار في values.yaml!
   - External Secrets Operator / Sealed Secrets
   - `existingSecret` — يشير لـ Secret موجود مسبقاً
   - Azure Key Vault Provider لـ AKS

3. **"ما الفرق بين `helm upgrade --install` و `helm install`؟"**
   - `install`: يثبت فقط إذا لم يكن Release موجوداً
   - `upgrade --install`: يثبت إذا لم يكن موجوداً، أو يرقّي إذا كان موجوداً (مفيد لـ CI/CD)

---

---

## 🏛️ طبقة الإنتاج: Helm في المؤسسة

### Helm + Argo CD = GitOps

```yaml
# Argo CD Application — ينشر Helm Chart تلقائياً من Git
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cloudnova-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/CloudNova/helm-charts
    targetRevision: main
    path: charts/cloudnova-api
    helm:
      valueFiles:
        - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true # drift detection
    syncOptions:
      - CreateNamespace=true
```

### Helm Secrets مع External Secrets Operator

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: cloudnova-db-secret
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: azure-keyvault
    kind: ClusterSecretStore
  target:
    name: cloudnova-db-secret
  data:
    - secretKey: password
      remoteRef:
        key: database-password
```

### متى لا تستخدم Helm؟

- **Kustomize أفضل**: إذا كنت تعدل manifests قليلة فقط ولا تريد templates
- **Argo CD مباشر**: إذا كنت تنشر raw manifests من Git
- **Pulumi/CDK**: إذا كنت تفضل لغات برمجة على YAML templates

---

## 🛠️ تدريبات

### تمرين ١: Helm Chart من الصفر (سهل)

> `helm create my-app` ثم عدل templates لتناسب تطبيق Python.

### تمرين ٢: Hook للـ migrations (متوسط)

> أضف Job hook لترحيل قاعدة البيانات قبل upgrade.

### تحدي: Library Chart (متقدم)

> ابنِ Library Chart يحتوي _helpers.tpl فقط. استخدمه في 3 تطبيقات مختلفة.

### 📝 تقييم

**س١:** لماذا أزال Helm v3 Tiller؟

<details><summary>الإجابة</summary>Tiller يحتاج cluster-admin permissions = خطر أمني. Helm v3 يتصل مباشرة بـ K8s API ويخزن releases كـ Secrets داخل namespace التطبيق.</details>

**س٢:** ما الفرق بين `helm install` و `helm upgrade --install`؟

<details><summary>الإجابة</summary>install يفشل إذا الـ release موجود. upgrade --install يثبّت إذا لم يوجد أو يرقّي إذا وجد. الأفضل لـ CI/CD.</details>

**س٣:** كيف تدير secrets في Helm؟

<details><summary>الإجابة</summary>External Secrets Operator، Sealed Secrets، أو `existingSecret`. ولا تخزّن secrets أبداً في values.yaml.</details>

### 🧠 استدعاء نشط

1. ارسم دورة حياة Helm release: install → upgrade → rollback → uninstall.
2. كيف تبني Chart يدعم 3 بيئات (dev/staging/prod)؟
3. ما فائدة `helm.sh/hook` annotations؟

### 🎤 مقابلة

**"كيف تصمم Helm Charts لـ 30 microservice؟"**
→ Library chart لـ _helpers.tpl المشترك. Chart لكل خدمة. Umbrella chart للتثبيت الكامل. Argo CD للـ GitOps.

**"كيف تتعامل مع Helm drift؟"**
→ `helm diff upgrade` قبل التطبيق. Argo CD selfHeal للتصحيح التلقائي.

---

## 📚 مراجع

- [Kubernetes Architecture](../10-kubernetes/01-kubernetes-architecture) — الأساس
- [GitOps Fundamentals](../18-gitops/01-gitops-fundamentals) — Argo CD + Helm
- 📖 [Helm Documentation](https://helm.sh/docs/)

---

[← العودة للموديول](./01-helm-fundamentals) | [→ Terraform Fundamentals](../12-terraform/01-terraform-fundamentals) | [🏠 الرئيسية](/)
