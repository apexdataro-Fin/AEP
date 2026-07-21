---
sidebar_position: 2
title: "أمن الحاويات و Kubernetes"
description: "تأمين الصور، فحص الثغرات، Pod Security، Network Policies، وأسرار Kubernetes."
---

# أمن الحاويات و Kubernetes

> "الحاوية غير الآمنة في الإنتاج مثل باب مفتوح في بنك."

## 🎯 أهداف التعلم

- فحص صور Docker بحثاً عن ثغرات
- تطبيق Pod Security Standards
- استخدام Network Policies لعزل الحركة
- إدارة Secrets في Kubernetes بأمان
- تأمين سلسلة التوريد (Supply Chain Security)

---

## ١. لماذا أمن الحاويات مختلف؟

### 🔹 المخاطر الفريدة للحاويات

| الخطر               | الوصف                          | المثال                          |
| ------------------- | ------------------------------ | ------------------------------- |
| **صورة غير موثوقة** | استخدام صورة من مصدر غير معروف | `docker pull randomuser/webapp` |
| **ثغرات قديمة**     | صورة قاعدة لم تُحدّث منذ أشهر  | `node:16-alpine3.14`            |
| **صلاحيات زائدة**   | حاوية تعمل بـ root بدون سبب    | `USER root`                     |
| **أسرار مكشوفة**    | كلمة مرور في Dockerfile        | `ENV DB_PASSWORD=secret123`     |
| **هروب الحاوية**    | مهاجم يخرج من الحاوية للمُضيف  | CVE في runc                     |

---

## ٢. فحص صور Docker

### 🔹 Trivy: فحص الثغرات

```bash
# تثبيت Trivy
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh

# فحص صورة محلية
trivy image cloudnova/api:latest

# الناتج النموذجي:
# ============ cloudnova/api:latest ============
# Total: 24 (UNKNOWN: 0, LOW: 3, MEDIUM: 12, HIGH: 6, CRITICAL: 3)
#
# ┌──────────────┬──────────────┬──────────┬────────┬──────────────────┐
# │   Library    │ Vulnerability│ Severity │ Status │ Installed Version │
# ├──────────────┼──────────────┼──────────┼────────┼──────────────────┤
# │ libssl1.1    │ CVE-2024-... │ CRITICAL │ fixed  │ 1.1.1t           │
# │ libcrypto1.1 │ CVE-2024-... │ HIGH     │ fixed  │ 1.1.1t           │
# │ curl         │ CVE-2024-... │ HIGH     │ fixed  │ 7.88.1           │
# └──────────────┴──────────────┴──────────┴────────┴──────────────────┘

# فحص حسب مستوى الخطورة (فشل إذا وجد CRITICAL)
trivy image --severity CRITICAL --exit-code 1 cloudnova/api:latest
```

### 🔹 في CI/CD Pipeline

```yaml
# .github/workflows/security.yml
name: Container Security Scan
on:
  push:
    branches: [main]
  pull_request:

jobs:
  trivy-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t cloudnova/api:${{ github.sha }} .
      - name: Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: cloudnova/api:${{ github.sha }}
          format: sarif
          output: trivy-results.sarif
          severity: CRITICAL,HIGH
          exit-code: 1 # يفشل pipeline إذا وجد ثغرات
      - name: Upload SARIF results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: trivy-results.sarif
```

### 🔹 Docker Scout

```bash
# فحص سريع داخل Docker Desktop / Docker CLI
docker scout quickview cloudnova/api:latest
docker scout recommendations cloudnova/api:latest
docker scout cves cloudnova/api:latest
```

---

## ٣. كتابة Dockerfile آمن

### 🔹 قبل (غير آمن)

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
USER root                    # ❌ صلاحيات زائدة
CMD ["node", "server.js"]
```

### 🔹 بعد (آمن)

```dockerfile
# ١. استخدم صورة محددة ودقيقة
FROM node:18.18.0-alpine3.18@sha256:abc123...

# ٢. أنشئ مستخدم غير root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# ٣. انسخ ملفات التبعيات أولاً (للاستفادة من cache)
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# ٤. انسخ الكود وغير المالكية
COPY --chown=appuser:appgroup . .

# ٥. لا تعمل كـ root أبداً
USER appuser

# ٦. فعّل الحماية في runtime
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
```

### 🔹 .dockerignore: لا تنسخ أسرارك

```dockerignore
# .dockerignore
.env
.env.*
.git
.gitignore
**/node_modules/
**/__pycache__/
*.log
.DS_Store
terraform/
*.pem
*.key
id_rsa*
credentials.json
```

---

## ٤. Kubernetes Pod Security

### 🔹 Pod Security Standards (PSS)

| المستوى        | الوصف                           | مثال                            |
| -------------- | ------------------------------- | ------------------------------- |
| **Privileged** | غير مقيد                        | أدوات المراقبة على مستوى النظام |
| **Baseline**   | يمنع الممارسات الخطيرة المعروفة | حاويات عادية بدون صلاحيات خاصة  |
| **Restricted** | الأكثر تشدداً                   | تطبيقات الويب في الإنتاج        |

### 🔹 تطبيق Restricted على Namespace

```yaml
# namespace-security.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/enforce-version: latest
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### 🔹 ما تمنعه Restricted

```yaml
# ❌ هذا الـ Pod سيُرفض
apiVersion: v1
kind: Pod
metadata:
  name: bad-pod
  namespace: production
spec:
  containers:
    - name: app
      image: nginx
      securityContext:
        privileged: true # ❌ ممنوع
        runAsUser: 0 # ❌ root ممنوع
        allowPrivilegeEscalation: true # ❌ ممنوع
      volumeMounts:
        - name: host
          mountPath: /host
  volumes:
    - name: host
      hostPath: # ❌ hostPath ممنوع
        path: /
```

### 🔹 Pod آمن للإنتاج

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-api
  namespace: production
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: api
      image: cloudnova/api:v2.1.0
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
          # لا تضيف capabilities إلا للضرورة القصوى
        runAsUser: 1000
      resources:
        requests:
          cpu: 100m
          memory: 128Mi
        limits:
          cpu: 500m
          memory: 256Mi
      livenessProbe:
        httpGet:
          path: /healthz
          port: 3000
        initialDelaySeconds: 10
        periodSeconds: 15
      readinessProbe:
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 10
```

---

## ٥. Network Policies: جدار ناري للحاويات

### 🔹 مبدأ Zero Trust

```yaml
# ١. امنع كل الحركة أولاً
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: production
spec:
  podSelector: {} # كل الـ Pods
  policyTypes:
    - Ingress
    - Egress
  ingress: [] # لا حركة داخلة
  egress: [] # لا حركة خارجة
---
# ٢. اسمح فقط بما يحتاجه التطبيق
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-policy
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - protocol: TCP
          port: 6379
    # DNS ضروري
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
        - podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
```

### 🔹 تشبيه واقعي

Network Policy مثل **جواز السفر**: كل Pod له تأشيرة محددة. API مسموح له بدخول Frontend (عبر port 3000) والخروج إلى Database (عبر port 5432). أي محاولة خارج هذه التأشيرات تُرفض.

---

## ٦. إدارة Secrets في Kubernetes

### 🔹 ❌ الطريقة الخاطئة

```yaml
# أسرار في Git! كارثة أمنية
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
stringData:
  username: admin
  password: SuperSecret123!
```

### 🔹 ✅ الطريقة الصحيحة: External Secrets Operator

```bash
# تثبيت External Secrets Operator
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets
```

```yaml
# SecretStore: الاتصال بـ Azure Key Vault
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: azure-keyvault
  namespace: production
spec:
  provider:
    azurekv:
      tenantId: "tenant-id"
      vaultUrl: "https://kv-cloudnova.vault.azure.net/"
      authSecretRef:
        clientId:
          name: azure-secret
          key: client-id
        clientSecret:
          name: azure-secret
          key: client-secret
---
# ExternalSecret: جلب الأسرار
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
  namespace: production
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: azure-keyvault
    kind: SecretStore
  target:
    name: db-credentials
  data:
    - secretKey: username
      remoteRef:
        key: database-username
    - secretKey: password
      remoteRef:
        key: database-password
```

---

## ٧. سلسلة توريد الحاويات (Supply Chain Security)

### 🔹 SLSA Framework

| المستوى | الوصف                     | الممارسة                         |
| ------- | ------------------------- | -------------------------------- |
| **L1**  | توثيق البناء              | Provenance attestation           |
| **L2**  | حماية ضد العبث            | بناء موقّع، مُضيف معزول          |
| **L3**  | مقاومة للتهديدات المتقدمة | بناء قابل للتكرار، مراجعة المصدر |
| **L4**  | أعلى حماية                | مراجعة بشرية، عزل كامل           |

### 🔹 توقيع الصور بـ Cosign

```bash
# تثبيت Cosign
# https://github.com/sigstore/cosign

# توليد مفتاح
cosign generate-key-pair

# توقيع الصورة
cosign sign --key cosign.key cloudnova/api:v2.1.0

# التحقق قبل النشر
cosign verify --key cosign.pub cloudnova/api:v2.1.0

# في Kubernetes: منع الصور غير الموقعة
# يتطلب Sigstore Policy Controller
```

### 🔹 بوالص OPA/Gatekeeper

```yaml
# منع الصور من Registries غير موثوقة
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sAllowedRepos
metadata:
  name: allow-only-trusted-registries
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Pod"]
  parameters:
    repos:
      - "cloudnova.azurecr.io/" # مسموح
      - "docker.io/library/" # مسموح بحذر
    # أي Registry آخر → ممنوع
```

---

## 🏢 سيناريو CloudNova: هجوم سلسلة التوريد

### الموقف

استخدم فريق CloudNova صورة `nginx:latest` من Docker Hub. بعد شهر، اكتُشفت ثغرة حرجة في الصورة المُستخدمة. المهاجم استطاع الوصول إلى الشبكة الداخلية.

### كيف تعاملوا مع الموقف

```bash
# ١. فحص فوري لكل الصور
kubectl get pods --all-namespaces -o json | \
  jq -r '.items[].spec.containers[].image' | sort -u | \
  xargs -I {} trivy image --severity CRITICAL {}

# ٢. عزل الـ Namespace المصاب
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: quarantine
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
  ingress: []
  egress: []
EOF

# ٣. استبدال الصور المُصابة
kubectl set image deployment/api api=cloudnova.azurecr.io/api:v2.1.1

# ٤. الوقاية للمستقبل
# - تثبيت الصور بأرقام إصدار محددة (never :latest)
# - فحص آلي في CI/CD لكل push
# - مراقبة مستمرة للثغرات
# - توقيع كل الصور بـ Cosign
```

---

## 🧠 Active Recall

1. لماذا `USER root` خطر في Dockerfile؟
2. كيف تمنع Pod من الوصول إلى الإنترنت في Kubernetes؟
3. ما الفرق بين Secret و ExternalSecret؟
4. لماذا `:latest` خطر في الإنتاج؟
5. كيف تفحص صور Docker بحثاً عن ثغرات في CI/CD؟

---

## 📝 تمرين Feynman

اشرح Network Policy لمدير غير تقني: تخيّل مبنى سكني. كل Pod شقة. Network Policy هي نظام الأمان: أنت (API) تستطيع فتح بابك لساعي البريد (Frontend) عبر باب محدد (port 3000). لكن لا تستطيع دخول شقة الجيران (Database) إلا إذا كان لديك مفتاح مصرح به (egress rule). أي شخص آخر يُحاول الدخول، يُرفض.

---

## 🃏 بطاقات تعليمية

| السؤال                     | الإجابة                   |
| -------------------------- | ------------------------- |
| أداة فحص ثغرات الصور       | `trivy image <image>`     |
| مستوى الأمان الأعلى في K8s | `restricted`              |
| منع `privileged: true`     | Pod Security Standards    |
| إدارة Secrets من Azure KV  | External Secrets Operator |
| توقيع صور Docker           | `cosign sign`             |

---

## 🎯 أسئلة مقابلة

### س: كيف تؤمن Kubernetes Cluster في الإنتاج؟

1. **Pod Security**: enforce `restricted`
2. **Network Policies**: Zero Trust، اسمح فقط بالضروري
3. **Secrets**: External Secrets Operator، لا Secrets في Git
4. **Images**: فحص بـ Trivy، توقيع بـ Cosign، لا `:latest`
5. **RBAC**: أقل الصلاحيات الممكنة
6. **Audit Logging**: سجل كل شيء
7. **Node Security**: تحديثات دورية، CIS Benchmark

---

<div align="center">

**[→ GitOps](../18-gitops/01-gitops-fundamentals)

---

## 🏛️ طبقة الإنتاج: Container Security في المؤسسة

### Supply Chain Security (SLSA)

```bash
# SLSA Level 3: Provenance + Signing
cosign sign --key vault://... cloudnova.azurecr.io/api:v2.1.0
cosign verify --key vault://... cloudnova.azurecr.io/api:v2.1.0
```

### 🚨 CloudNova: صورة مخترقة

> مهاجم دفع صورة للـ registry. Trivy scan في CI اكتشف malware ومنع النشر.

---

## 🛠️ تدريبات

**تمرين ١:** Trivy scan. **تمرين ٢:** Pod Security Standards. **تحدي:** cosign signing.

### 📝 تقييم

**س١:** Pod Security levels؟ → Privileged, Baseline, Restricted.
**س٢:** Trivy = ؟ → فحص ثغرات في صور الحاويات.
**س٣:** Supply chain security؟ → SBOM + signing + provenance.

### 🎤 مقابلة

**"كيف تؤمن حاويات Kubernetes؟"** → Pod Security + NetworkPolicies + Trivy + cosign.

---

[← Security Pipeline](./01-security-pipeline) | [🏠 الرئيسية](/)
**

</div>
