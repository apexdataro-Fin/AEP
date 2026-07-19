---
sidebar_position: 2
title: "شبكات Kubernetes المتقدمة"
description: "CNI plugins, Ingress Controllers, Service Mesh, Network Policies، وتشخيص مشاكل الشبكات."
---

# شبكات Kubernetes المتقدمة

> "في Kubernetes، كل Pod يستطيع التحدث مع كل Pod. السؤال: هل ينبغي له ذلك؟"

## 🎯 أهداف التعلم

- فهم نماذج الشبكات في Kubernetes
- اختيار CNI Plugin المناسب
- تكوين Ingress للـ HTTP/HTTPS
- تطبيق Network Policies للأمان
- تشخيص مشاكل الشبكات بكفاءة
- فهم Service Mesh و mTLS

---

## ١. نموذج الشبكات في Kubernetes

### 🔹 القواعد الأساسية

1. **كل Pod له IP خاص**: لا NAT بين Pods
2. **كل Pod يستطيع التواصل مع كل Pod**: بدون ترجمة عناوين
3. **كل Node تستطيع التواصل مع كل Pod**: والعكس

### 🔹 كيف يعمل؟

```
Node 1                              Node 2
┌─────────────────────────┐    ┌─────────────────────────┐
│ Pod A: 10.244.1.5       │    │ Pod B: 10.244.2.7       │
│         ↓                │    │                          │
│   veth0 ←→ cbr0 (bridge) │    │   veth0 ←→ cbr0 (bridge)│
│         ↓                │    │         ↑                │
│  CNI Plugin (Flannel)    │───→│  CNI Plugin (Flannel)    │
│         ↓                │    │         ↑                │
│      eth0: 192.168.1.10  │    │      eth0: 192.168.1.11 │
└─────────────────────────┘    └─────────────────────────┘

المسار: Pod A → veth0 → cbr0 → Flannel (VXLAN) → eth0
       → شبكة فعلية → eth0 → Flannel → cbr0 → veth0 → Pod B
```

---

## ٢. CNI Plugins: مقارنة

| Plugin          | النموذج         | المميزات                    | متى تستخدمه              |
| --------------- | --------------- | --------------------------- | ------------------------ |
| **Flannel**     | VXLAN / host-gw | بسيط، خفيف                  | بداية سريعة، بيئات صغيرة |
| **Calico**      | BGP / IPIP      | Network Policies، أداء عالي | إنتاج، أمان مطلوب        |
| **Cilium**      | eBPF            | مراقبة، أمان L7، أداء       | متقدم، Cloud Native      |
| **Azure CNI**   | Azure VNet      | IPs حقيقية من VNet          | تكامل مباشر مع Azure     |
| **AWS VPC CNI** | AWS VPC         | IPs حقيقية من VPC           | تكامل مباشر مع AWS       |

### 🔹 Azure CNI: تكامل عميق

```yaml
# عند استخدام Azure CNI:
# - كل Pod يحصل على IP حقيقي من Azure VNet
# - Security Groups تعمل على مستوى Pod
# - Azure Load Balancer يتكامل مباشرة

# لكن: تخطيط عناوين IP مهم جداً!
# VNet بـ /16 = 65536 عنوان
# cluster بـ 50 nodes × 30 pods = 1500 pod + 50 node = 1550 عنوان
# → مساحة كافية
```

---

## ٣. Services: أنواع وتطبيقات

### 🔹 مقارنة أنواع Services

```yaml
# ١. ClusterIP (افتراضي) — داخلي فقط
apiVersion: v1
kind: Service
metadata:
  name: api-internal
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 3000
      targetPort: 3000

---
# ٢. NodePort — يفتح port على كل Node
apiVersion: v1
kind: Service
metadata:
  name: api-nodeport
spec:
  type: NodePort
  selector:
    app: api
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30080 # بين 30000-32767


# curl http://<أي-node-ip>:30080

---
# ٣. LoadBalancer — يُنشئ Load Balancer سحابي
apiVersion: v1
kind: Service
metadata:
  name: api-public
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-sku: "standard"
spec:
  type: LoadBalancer
  selector:
    app: api
  ports:
    - port: 443
      targetPort: 3000
```

### 🔹 ExternalName Service

```yaml
# ربط خدمة خارجية كأنها داخل Kubernetes
apiVersion: v1
kind: Service
metadata:
  name: external-database
spec:
  type: ExternalName
  externalName: db.cloudnova.database.windows.net

# الآن: external-database.default.svc.cluster.local → Azure SQL
```

---

## ٤. Ingress: البوابة الذكية

### 🔹 Ingress vs LoadBalancer

| الميزة           | LoadBalancer   | Ingress                   |
| ---------------- | -------------- | ------------------------- |
| **التوجيه**      | Port-based فقط | Path/Host-based           |
| **SSL/TLS**      | على LB         | موحد في Ingress           |
| **التكلفة**      | LB لكل خدمة    | Ingress واحد للكل         |
| **قواعد متقدمة** | لا             | نعم (rate limiting, auth) |

### 🔹 تكوين Ingress احترافي

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cloudnova-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-burst: "50"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.cloudnova.io
        - app.cloudnova.io
      secretName: cloudnova-tls
  rules:
    - host: api.cloudnova.io
      http:
        paths:
          - path: /v1
            pathType: Prefix
            backend:
              service:
                name: api-v1
                port:
                  number: 3000
          - path: /v2
            pathType: Prefix
            backend:
              service:
                name: api-v2
                port:
                  number: 3000
    - host: app.cloudnova.io
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80
```

### 🔹 Cert-Manager: شهادات SSL تلقائية

```yaml
# ClusterIssuer: LetsEncrypt
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: ops@cloudnova.io
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
      - http01:
          ingress:
            class: nginx
```

---

## ٥. Network Policies: Zero Trust

### 🔹 مبدأ: Deny All ثم اسمح

```yaml
# ١. امنع كل الحركة في Namespace الإنتاج
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress

---
# ٢. اسمح لـ API بالتواصل مع Database فقط
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-to-db
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - protocol: TCP
          port: 5432
    # DNS ضروري لكل Pods
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

---
# ٣. اسمح للـ Ingress Controller بالوصول لـ API
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-to-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
```

---

## ٦. تشخيص مشاكل الشبكات

### 🔹 أدوات التشخيص

```bash
# ١. إنشاء Pod للتشخيص
kubectl run debug --rm -it --image=nicolaka/netshoot -- bash

# داخل الـ Pod:

# فحص DNS
nslookup api.default.svc.cluster.local
dig api.default.svc.cluster.local

# فحص الاتصال
curl http://api:3000/healthz
telnet postgres 5432

# فحص المسار
traceroute api.default.svc.cluster.local

# فحص الشهادات
openssl s_client -connect api.cloudnova.io:443 -servername api.cloudnova.io
```

### 🔹 مشاكل شائعة وحلولها

| المشكلة                            | السبب المحتمل                | التشخيص                           |
| ---------------------------------- | ---------------------------- | --------------------------------- |
| `curl: (6) Could not resolve host` | DNS معطل                     | `nslookup kubernetes.default`     |
| `curl: (7) Failed to connect`      | لا Network Policy تسمح       | `kubectl get networkpolicies`     |
| `curl: (28) Connection timeout`    | Pod لا يستمع على port الصحيح | `kubectl logs <pod>`              |
| `curl: (35) SSL error`             | شهادة غير صالحة              | `kubectl describe certificate`    |
| Service لا تعمل                    | selector لا يتطابق           | `kubectl get endpoints <service>` |

### 🔹 سيناريو: Service لا تعمل

```bash
# خطوة ١: هل الـ Service موجودة؟
kubectl get svc api
# NAME   TYPE        CLUSTER-IP     PORT(S)
# api    ClusterIP   10.0.100.50    3000/TCP

# خطوة ٢: هل لديها Endpoints؟
kubectl get endpoints api
# NAME   ENDPOINTS        AGE
# api    <none>           5m     ← مشكلة! لا Endpoints

# خطوة ٣: هل selector يتطابق؟
kubectl describe svc api
# Selector: app=api,version=v1

kubectl get pods -l app=api,version=v1
# No resources found            ← السبب!

# الحل:
kubectl get pods -l app=api --show-labels
# NAME                    LABELS
# api-7d9f8c-abc          app=api,version=v2  ← الإصدار v2!

# إما نعدل الـ Service:
kubectl patch svc api -p '{"spec":{"selector":{"version":"v2"}}}'
# أو نضيف label للـ Pod
```

---

## ٧. Service Mesh: المستوى التالي

### 🔹 لماذا Service Mesh؟

| بدون Service Mesh          | مع Service Mesh                     |
| -------------------------- | ----------------------------------- |
| TLS بين الخدمات يدوي       | **mTLS تلقائي**                     |
| لا مراقبة للحركة           | **تتبع موزع (Distributed Tracing)** |
| Retry في كود التطبيق       | **Retry على مستوى الـ Mesh**        |
| Circuit Breaking يدوي      | **Circuit Breaking مدمج**           |
| لا Canary Deployments سهلة | **Traffic Splitting سهل**           |

### 🔹 Istio / Linkerd

```yaml
# مثال: Traffic Splitting مع Istio
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
            x-canary:
              exact: "true"
      route:
        - destination:
            host: api
            subset: v2
          weight: 100
    - route:
        - destination:
            host: api
            subset: v1
          weight: 90
        - destination:
            host: api
            subset: v2
          weight: 10 # 10% إلى الإصدار الجديد
```

---

## 🏢 سيناريو CloudNova: انقطاع غامض

### الموقف

الساعة ٣ فجراً. `api` لا يستطيع الاتصال بـ `postgres`. لكن `postgres` يعمل! كل الـ Pods `Running`. الـ Service موجودة.

### التشخيص

```bash
# ١. فحص Endpoints
kubectl get endpoints postgres -n production
# 10.244.2.15:5432  ✓ موجود

# ٢. فحص من داخل Pod
kubectl exec -it api-xxx -n production -- sh
$ telnet postgres 5432
# Trying 10.0.100.100...
# ... يتوقف ولا يستجيب  ← المشكلة!

$ nslookup postgres
# Server: 10.0.0.10
# Address: 10.0.0.10#53
# Name: postgres.production.svc.cluster.local
# Address: 10.0.100.100  ✓ DNS صحيح

# ٣. Network Policy؟
kubectl get networkpolicy -n production
# NAME               POD-SELECTOR   AGE
# deny-all           <none>         30d
# allow-api-to-db    app=api        30d

# ٤. فحص تفاصيل policy
kubectl describe networkpolicy allow-api-to-db -n production
# PodSelector: app=api
#   Egress:
#     To: podSelector: app=postgres
#     Ports: 5432/TCP

# ٥. هل الـ api Pod عليه label app=api؟
kubectl get pods api-xxx -n production --show-labels
# NAME       LABELS
# api-xxx    app=api-v2,tier=backend  ← app=api-v2 وليس app=api!

# السبب: deployment حُدّث وتغير label!
```

### الحل

```bash
# الحل السريع:
kubectl label pod api-xxx -n production app=api --overwrite

# الحل الدائم:
kubectl edit deployment api -n production
# أعد label: app=api

# أو تحديث Network Policy لتشمل app=api-v2 أيضاً
```

---

## 🧠 Active Recall

1. ما الفرق بين ClusterIP و NodePort و LoadBalancer؟
2. متى تحتاج Ingress بدلاً من LoadBalancer؟
3. كيف تمنع Pod من الوصول للإنترنت؟
4. ماذا يعني `kubectl get endpoints api` يعرض `<none>`؟
5. كيف تشخّص "Connection timeout" بين خدمتين؟

---

## 📝 تمرين Feynman

اشرح Service و Ingress: Service مثل **رقم الغرفة** في فندق (داخلي، لا يتغير). Ingress مثل **الاستقبال** في بهو الفندق: يستقبل كل الضيوف (الحركة الخارجية) ويوجههم للغرفة الصحيحة بناءً على طلبهم (`/api` → غرفة ٣٠٠٠، `/app` → غرفة ٨٠).

---

## 🃏 بطاقات تعليمية

| السؤال                 | الإجابة                        |
| ---------------------- | ------------------------------ |
| نوع Service الافتراضي  | `ClusterIP`                    |
| أمر فحص DNS داخل Pod   | `nslookup <service>`           |
| أمر عرض Endpoints      | `kubectl get endpoints`        |
| أداة تشخيص شبكات شاملة | `nicolaka/netshoot`            |
| TLS تلقائي بين الخدمات | `Service Mesh (Istio/Linkerd)` |

---

## 🎯 أسئلة مقابلة

### س: Service لا تعمل. كيف تشخّصها؟

1. `kubectl get svc,ep` — هل الـ Endpoints موجودة؟
2. `kubectl describe svc` — هل selector يتطابق مع Pod labels؟
3. `kubectl exec -it pod -- curl svc:port` — اختبار من الداخل
4. `kubectl get networkpolicies` — هل هناك سياسة تمنع؟
5. `kubectl logs <pod>` — هل التطبيق يستمع حقاً؟

---

<div align="center">

**[→ Helm Fundamentals](../11-helm/01-helm-fundamentals)

---

## 🏛️ طبقة الإنتاج: الشبكات تحت الضغط

### kube-proxy — كيف يعمل الـ Service Routing

```bash
# kube-proxy iptables mode — القواعد تولد عشوائياً (statistical)
kubectl exec -it debug-pod -- iptables -t nat -L KUBE-SERVICES -n | grep api
# 3 Pods = 3 قواعد iptables، كل منها باحتمال 33.3%
```

### Cilium eBPF — مستقبل شبكات K8s

بدلاً من iptables (بطيء مع 1000+ services)، Cilium يستخدم eBPF:
- يبرمج kernel مباشرة — أسرع 10x
- Hubble UI للتتبع المباشر بين الخدمات
- L7 Network Policies (HTTP method, path, headers)

### 🚨 سيناريو CloudNova: DNS لا يستجيب

> CoreDNS pods ماتت. لا DNS = لا Service Discovery = كل شيء ميت.

```bash
kubectl get pods -n kube-system | grep coredns
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=20
# level=fatal msg="Failed to read Corefile"
kubectl rollout restart deployment/coredns -n kube-system
```

---

## 🎨 طبقة المعماري

### CNI Selection Matrix

| المعيار | Flannel | Calico | Cilium | Azure CNI |
|---------|---------|--------|--------|-----------|
| البساطة | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| NetworkPolicy | ❌ | ✅✅ | ✅✅✅ (L7) | ✅ (NSG) |
| الأداء | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| المراقبة | ❌ | محدود | Hubble UI | Azure Monitor |
| التكلفة | مجاني | مجاني | مجاني | IP exhaustion risk |

### Service Mesh Decision

- **Istio**: الأقوى. Envoy sidecar، mTLS، circuit breaking. للـ enterprises.
- **Linkerd**: الأبسط. Rust proxy خفيف. للفرق الصغيرة.
- **Cilium Service Mesh**: بدون sidecar! eBPF في kernel.

---

## 🛠️ تدريبات

### تمرين ١: NetworkPolicy (سهل)
> أنشئ namespace `isolated`. امنع كل الـ ingress/egress. ثم اسمح فقط لـ pod معين بالوصول للإنترنت.

### تمرين ٢: تشخيص انقطاع (متوسط)
> `api` لا يصل لـ `postgres`. ارجع للخطوات في سيناريو CloudNova ونفذها.

### تحدي: Service Mesh (متقدم)
> ثبت Istio. انشر تطبيقين. راقب الـ mTLS و distributed tracing.

### 📝 تقييم

**س١:** لماذا prefer Ingress over LoadBalancer؟
<details><summary>الإجابة</summary>Ingress واحد = LB واحد = تكلفة أقل. Path-based routing. TLS termination موحد.</details>

**س٢:** كيف تمنع Pod من الاتصال بأي شيء خارج namespace؟
<details><summary>الإجابة</summary>NetworkPolicy مع `podSelector: {}` و `policyTypes: [Egress]` بدون أي `to` rules.</details>

**س٣:** ما فائدة Service Mesh؟
<details><summary>الإجابة</summary>mTLS تلقائي، distributed tracing، retry/circuit breaking، traffic splitting للـ canary deployments.</details>

### 🧠 استدعاء نشط
1. ارسم مسار الحزمة من Pod A → Service → Pod B.
2. متى تختار Calico ومتى Cilium؟
3. كيف تشخص DNS failure في K8s؟

### 🎤 مقابلة

**"صمم شبكة K8s لمؤسسة مالية."**
→ Cilium (L7 policies + eBPF performance). mTLS مع Istio. NetworkPolicies deny-all لكل namespace. Private AKS + Azure CNI.

---

[← K8s Architecture](./01-kubernetes-architecture) | [→ Helm](../11-helm/01-helm-fundamentals) | [🏠 الرئيسية](/)
**

</div>
