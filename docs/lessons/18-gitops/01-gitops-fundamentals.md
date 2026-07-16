---
sidebar_position: 1
title: "أساسيات GitOps"
description: "إدارة البنية التحتية والتطبيقات من خلال Git كمصدر وحيد للحقيقة: Argo CD، Flux، والنشر التلقائي."
---

# أساسيات GitOps

> "Git هو مصدر الحقيقة الوحيد. كل شيء في Git. كل تغيير يمر عبر Git."

## 🎯 أهداف التعلم

- فهم مبادئ GitOps الأربعة
- إتقان Argo CD للنشر المستمر
- بناء pipeline GitOps كامل
- إدارة بيئات متعددة عبر Git
- تطبيق استراتيجيات الترقية والتراجع

---

## 📖 الطبقة الأساسية: ما هو GitOps؟

### مبادئ GitOps الأربعة

| المبدأ                    | الوصف                                              |
| ------------------------- | -------------------------------------------------- |
| **مصدر وحيد للحقيقة**     | Git هو المرجع الوحيد لحالة النظام المطلوبة         |
| **التصريح (Declarative)** | كل شيء موصوف كـ YAML/JSON في Git                   |
| **عامل آلي (Agent)**      | أداة مثل Argo CD أو Flux تراقب Git وتطبق التغييرات |
| **التقارب المستمر**       | الـ agent يصحح أي انحراف بين Git والحالة الفعلية   |

### GitOps مقابل Push-based CI/CD

```
الطريقة التقليدية (Push):
Git ──► CI ──► Build ──► Push to Registry ──► Deploy Script ──► K8s
                                       ▲
                                  أسرار النشر هنا!

GitOps (Pull):
Git ──► CI ──► Build ──► Push to Registry ──► Update Git Repo
                                                      │
                                                      ▼
                                               Argo CD يراقب Git
                                                      │
                                                      ▼
                                               يسحب التغييرات إلى K8s
```

---

## 🧱 الطبقة المهنية: Argo CD عملياً

### تثبيت Argo CD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# الحصول على كلمة السر الأولية
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# Port forward للواجهة
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### Application — تعريف التطبيق

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cloudnova-api
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/cloudnova/infrastructure.git
    targetRevision: main
    path: kubernetes/overlays/production
    kustomize:
      images:
        - cloudnova.azurecr.io/api=cloudnova.azurecr.io/api:v1.2.3
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true # حذف الموارد المحذوفة من Git
      selfHeal: true # تصحيح التغييرات اليدوية
    syncOptions:
      - CreateNamespace=true
```

### App of Apps Pattern

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cloudnova-root
  namespace: argocd
spec:
  source:
    repoURL: https://github.com/cloudnova/infrastructure.git
    targetRevision: main
    path: argocd/apps/
    directory:
      recurse: true
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
```

---

## 🏗️ الطبقة الإنتاجية: تنظيم المستودع

### هيكل GitOps Repository

```
infrastructure/
├── argocd/
│   ├── apps/
│   │   ├── root.yaml
│   │   ├── cloudnova-api.yaml
│   │   ├── cloudnova-web.yaml
│   │   └── monitoring.yaml
│   └── projects/
│       └── cloudnova-project.yaml
├── kubernetes/
│   ├── base/
│   │   ├── api/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   └── kustomization.yaml
│   │   └── web/
│   │       └── ...
│   └── overlays/
│       ├── development/
│       │   ├── kustomization.yaml
│       │   └── patches/
│       │       └── replicas.yaml
│       ├── staging/
│       │   └── kustomization.yaml
│       └── production/
│           ├── kustomization.yaml
│           └── patches/
│               ├── replicas.yaml
│               ├── resources.yaml
│               └── ingress.yaml
└── terraform/
    ├── modules/
    └── environments/
        ├── dev/
        ├── staging/
        └── production/
```

### استراتيجية الفروع والبيئات

```
main ────────────────► Argo CD ───► production
  ▲
  │ merge PR ✓
  │
feature/* ──► CI tests ──► staging (preview)
```

---

## 🎨 الطبقة المعمارية: أنماط متقدمة

### Progressive Delivery مع Argo Rollouts

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: cloudnova-api
spec:
  replicas: 5
  strategy:
    canary:
      steps:
        - setWeight: 20 # 20% للنسخة الجديدة
        - pause:
            duration: 5m # انتظر 5 دقائق
        - setWeight: 50
        - pause:
            duration: 10m
        - setWeight: 100 # 100% للنسخة الجديدة
  selector:
    matchLabels:
      app: cloudnova-api
  template:
    # ... pod spec
```

### Secrets Management في GitOps

```
الخيارات (مرتبة من الأفضل):

1. External Secrets Operator (ESO)
   ├── يزامن الأسرار من Azure Key Vault إلى Kubernetes Secrets
   └── لا شيء حساس في Git!

2. Sealed Secrets
   ├── تشفير الأسرار قبل وضعها في Git
   └── فقط الـ controller في K8s يستطيع فك التشفير

3. SOPS + Age
   ├── تشفير الملفات باستخدام KMS (Azure Key Vault)
   └── Argo CD يتكامل مع SOPS تلقائياً
```

```yaml
# ExternalSecret مثال
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: cloudnova-api-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: azure-keyvault
    kind: ClusterSecretStore
  target:
    name: cloudnova-api-secrets
  data:
    - secretKey: database-url
      remoteRef:
        key: cloudnova-prod-db-url
    - secretKey: api-key
      remoteRef:
        key: cloudnova-api-key
```

---

## 🏥 سيناريو CloudNova: ترقية إنتاجية

```
📋 التذكرة: HYD-1401
النوع: ترقية إنتاج
الأولوية: عالية

السيناريو:
ترقية API إلى إصدار 2.0 مع تغييرات في قاعدة البيانات.

خطة GitOps:
1. إنشاء PR في مستودع infrastructure
   ├── تحديث image tag
   └── إضافة Job migration

2. Argo CD يكتشف التغيير
   ├── PreSync Hook: تشغيل migration job
   └── Sync: تطبيق Deployment الجديد

3. Argo Rollouts ينفذ Canary
   ├── 20% من الحركة للإصدار الجديد
   ├── مراقبة لمدة 10 دقائق
   └── 100% إذا كل شيء طبيعي

4. إذا فشل:
   ├── Argo CD يبلغ عن الانحراف
   ├── تراجع تلقائي عبر Argo Rollouts
   └── إشعار في Slack + إنشاء Incident
```

---

## ⚡ الإنتاج وما بعده

### مراقبة Argo CD

```bash
# حالة التطبيقات
argocd app list

# تفاصيل تطبيق
argocd app get cloudnova-api

# تاريخ المزامنة
argocd app history cloudnova-api

# تراجع يدوي
argocd app rollback cloudnova-api 3

# مزامنة فورية
argocd app sync cloudnova-api
```

### أفضل ممارسات GitOps

| الممارسة                | لماذا؟                        |
| ----------------------- | ----------------------------- |
| **تقسيم التطبيقات**     | تطبيق واحد = Application واحد |
| **App of Apps**         | إدارة مركزية للتطبيقات        |
| **Kustomize/Helm**      | تجنب تكرار YAML               |
| **مراجعة PR إلزامية**   | Git هو البوابة الوحيدة        |
| **عدم التعديل اليدوي**  | Argo CD سيصحح أي تغيير يدوي   |
| **إشعارات Slack/Teams** | معرفة حالة كل sync            |

---

## 🧠 التذكّر النشط

1. ما الفرق بين Push-based CD و Pull-based (GitOps)؟
2. كيف يدير Argo CD الأسرار بأمان؟
3. ما هو App of Apps Pattern ولماذا تستخدمه؟
4. كيف تنفذ Canary Deployment مع GitOps؟
5. ماذا يحدث إذا عدلت Deployment يدوياً في Kubernetes مع Argo CD؟

## 📝 بطاقات تعليمية

- **GitOps**: إدارة البنية التحتية والتطبيقات من Git باستخدام عامل آلي (Agent)
- **Argo CD**: أداة GitOps تسحب الحالة المطلوبة من Git وتطبقها في Kubernetes
- **Sync**: عملية جعل الحالة الفعلية تطابق الحالة المطلوبة في Git
- **Drift**: انحراف بين Git و K8s (شخص عدل شيئاً يدوياً!)
- **Prune**: حذف الموارد التي أزيلت من Git تلقائياً

## 🎤 أسئلة المقابلة

1. **"كيف تختلف GitOps عن CI/CD التقليدي؟"**
   - GitOps: الـ Agent في Kubernetes يسحب من Git (Pull)
   - التقليدي: CI/CD يدفع إلى Kubernetes (Push)
   - GitOps لا يحتاج أسرار نشر في CI/CD!

2. **"كيف تتعامل مع البيئات المتعددة في GitOps؟"**
   - Kustomize overlays: base مشترك + overlays لكل بيئة
   - فروع منفصلة لكل بيئة
   - Argo CD ApplicationSets للبيئات الديناميكية

3. **"كيف تضمن عدم وجود انحراف (Drift)؟"**
   - `selfHeal: true` في Argo CD
   - مراقبة مستمرة
   - عدم إعطاء صلاحيات التعديل اليدوي للمطورين

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
