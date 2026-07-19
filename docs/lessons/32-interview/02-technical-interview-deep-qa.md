---
sidebar_position: 2
title: "المقابلة التقنية المتعمقة"
description: "Technical Interview Deep Q&A — أسئلة وأجوبة Azure, Kubernetes, Terraform."
---

# المقابلة التقنية المتعمقة

> "التحضير الجيد يحول المقابلة من استجواب إلى محادثة."

## 🎯 أهداف التعلم

- أسئلة Azure المتقدمة
- أسئلة Kubernetes
- أسئلة Terraform & IaC
- أسئلة System Design

## ⏱️ الوقت المقدر: 45 دقيقة | المستوى: Advanced

---

## 🏗️ Azure Questions

**س: كيف تصمم High Availability في Azure؟**
- Availability Zones (3 zones)
- Load Balancer + VM Scale Sets
- Azure SQL Geo-Replication
- Front Door للـ global failover
- RTO: < 5 دقائق، RPO: < دقيقة

**س: كيف تؤمن Azure Subscription؟**
- Azure AD + MFA
- Management Groups + Policies
- Network Segmentation + NSG
- Key Vault + Managed Identity
- Sentinel + Defender for Cloud

### Kubernetes Questions

**س: كيف تتعامل مع CrashLoopBackOff؟**
1. `kubectl logs <pod> --previous`
2. `kubectl describe pod` وفحص Events
3. تحقق من ConfigMaps و Secrets
4. تأكد من صحة الـ image

### Terraform Questions

**س: ماذا تفعل لو فسد ملف state؟**
1. استرجع من backup (storage account versioning)
2. `terraform state pull` من backend صحيحة
3. `terraform import` للموارد المفقودة
4. امنع ذلك مستقبلاً: state locking + versioning

---

## 🏛️ CloudNova: مقابلة حقيقية — ماذا يسألون فعلاً

**ماجد** Senior Cloud Engineer. أجرى 50+ مقابلة تقنية في CloudNova. هذه الأسئلة الحقيقية التي يسألها:

### الجولة 1: الأساسيات (30 دقيقة)

**س: صف Azure Virtual Network من الداخل.**
> System routes table. Service endpoints vs Private Endpoints. NSG rules evaluation order. VNet peering مع transitive routing limitation. Custom route tables لـ NVA. BGP مع ExpressRoute.

**س: كيف تعمل Kubernetes Service؟**
> kube-proxy يشاهد API server. عند إنشاء Service: يخصص ClusterIP (iptables/IPVS rules). endpoint controller يملأ Endpoints. kube-proxy يكتب iptables rules: `KUBE-SERVICES → KUBE-SVC-XXXX → KUBE-SEP-YYYY (DNAT to Pod IP)`.

### الجولة 2: سيناريو عملي (45 دقيقة)

**السيناريو:** "لديك AKS cluster فجأة لا يستجيب. debugging steps؟"
> 1. `kubectl get nodes` — هل الـ control plane يعمل؟
> 2. `kubectl describe node` — أي taints, conditions, resource pressure؟
> 3. `kubectl top nodes` — استهلاك الموارد
> 4. Azure Monitor → node metrics
> 5. Node SSH: `journalctl -u kubelet`, `docker ps`, `dmesg`
> 6. Check Azure: NSG blocking, VM running, disk full

### الجولة 3: System Design (60 دقيقة)

**صمم منصة CI/CD لـ 100 فريق.**

### الجولة 4: Behavioral + Leadership

**"احكِ عن مرة فشل deployment واجهته."**

---

## 🎨 أشهر 20 سؤالاً تقنياً مع نماذج إجابات

### Azure

**1. Availability Set vs Availability Zone — أيهما تختار؟**
- Availability Set: حماية داخل datacenter واحد (fault + update domains)
- Availability Zone: حماية عبر datacenters (مباني منفصلة). SLA 99.99% vs 99.95%
- القاعدة: Zone > Set إذا متوفر في regionك

**2. متى تستخدم Application Gateway بدل Front Door؟**
- App Gateway: إقليمي (regional)، WAF، SSL termination، cookie-based affinity
- Front Door: عالمي (global)، CDN، anycast، URL-based routing
- استخدمهما معاً: Front Door عالمي → App Gateway إقليمي

**3. كيف تنقل 10TB إلى Azure بأسرع وقت؟**
- < 1TB: AzCopy عبر الشبكة
- 1-10TB: Azure Data Box (قرص صلب يُشحن)
- > 10TB: Azure Data Box Heavy أو ExpressRoute

### Kubernetes

**4. CrashLoopBackOff — debugging كامل:**
```bash
kubectl logs <pod> --previous    # سجلات المحاولة السابقة
kubectl describe pod <pod>       # Events, exit code
kubectl exec -it <pod> -- sh     # تفقد داخلي (إذا شغّال)
kubectl get events --sort-by=.metadata.creationTimestamp
```
الأسباب: OOMKilled (ذاكرة)، ImagePullBackOff، ConfigMap ناقص، command/args خطأ

**5. PVC stuck in Pending:**
- StorageClass موجود؟ `kubectl get sc`
- Provisioner يدعم الـ cloud؟ (azure-disk, azure-file)
- AccessMode متوافق مع الـ PV؟
- الـ PV موجود ومتاح؟

### Terraform

**6. State file تالف — حل عملي:**
```bash
# 1. استرجع من backup
az storage blob download \
  --account-name tfstatecloudnova \
  --container-name tfstate \
  --name prod.terraform.tfstate \
  --file terraform.tfstate

# 2. أو terraform state pull من backend سليم
terraform state pull > terraform.tfstate

# 3. أو import يدوي للموارد
terraform import azurerm_resource_group.rg /subscriptions/.../resourceGroups/rg-name
```

---

## 🛠️ محاكاة مقابلة (30 دقيقة)

### الجولة التقنية — Azure
1. صمم شبكة Azure لـ 3 بيئات (dev, staging, prod)
2. كيف تؤمن AKS cluster؟
3. قارن بين Azure SQL و Cosmos DB

### الجولة التقنية — DevOps
4. صمم CI/CD pipeline مع zero-downtime deployment
5. كيف تدير secrets في Kubernetes؟
6. ما DORA metrics ولماذا تهم؟

### الجولة العملية — Live Coding
7. اكتب Terraform module لـ AKS
8. اكتب Dockerfile آمناً
9. اكتب GitHub Actions workflow

### الجولة السلوكية
10. STAR: مشروع معقد قُدته
11. صراع مع زميل — كيف حللته
12. قرار تقني ندمت عليه

---

## 📝 تقييم

### ✅ Knowledge Checks
1. ما الفرق بين Azure Front Door و Application Gateway؟
2. كيف تصلح CrashLoopBackOff؟
3. ماذا تفعل إذا فسد ملف Terraform state؟
4. كيف تنقل بيانات ضخمة إلى Azure؟
5. ما الـ 4 metrics في DORA؟

### 🧠 Quiz
**س1:** أفضل approach لنقل 50TB إلى Azure:
- أ) AzCopy
- ب) Data Box Heavy ✅
- ج) USB
- د) FTP

**س2:** PVC stuck في Pending — أول فحص:
- أ) StorageClass موجود؟ ✅
- ب) إعادة تشغيل الـ pod
- ج) حذف الـ PVC
- د) لا شيء

**س3:** Private Endpoint في Azure:
- أ) endpoint عام
- ب) IP خاص في VNet للوصول لخدمات Azure ✅
- ج) VPN
- د) CDN

### 🗣️ Active Recall
1. أجب عن 5 أسئلة Kubernetes بصوت عالٍ
2. ارسم معماري شبكة Azure لـ enterprise
3. اشرح Terraform state locking
4. مارس whiteboard design لمدة 10 دقائق

### 🎓 Feynman Exercise
> اشرح Kubernetes Service لغير تقني: "مثل receptionist فندق. الزائر لا يعرف رقم الغرفة، بل يسأل receptionist باسم النزيل. receptionist يحول الزائر للغرفة الصحيحة حتى لو تغيرت."

### 🃏 بطاقات تعلم
| السؤال | الإجابة |
|--------|---------|
| CrashLoopBackOff debugging؟ | logs + describe + events + ssh |
| Terraform state تالف؟ | backup restore أو import |
| Availability Set vs Zone؟ | Zone = مباني منفصلة، SLA أعلى |
| AKS security؟ | Private cluster + RBAC + Network Policy + Azure AD |
| أفضل Data Transfer كبير؟ | Data Box للكميات الضخمة |

---

## 🎤 نموذج إجابة STAR

**السؤال:** "احكِ عن مرة فشل deployment."

**S (Situation):** "في CloudNova، كنت مسؤولاً عن deployment منصة payment-critical. يوم الجمعة 4pm بالطبع."

**T (Task):** "نشر AKS upgrade من 1.27 إلى 1.28 مع migration من PodSecurityPolicy إلى Pod Security Admission."

**A (Action):** "اختبرت في staging أسبوعاً كاملاً. لكن الـ production load كشف bug في network plugin. أثر على 30% من الـ pods. عملت rollback خلال 4 دقائق باستخدام GitOps revert. حللت root cause: CNI plugin version غير متوافق. أصلحت و retested ونشرت بنجاح الأسبوع التالي."

**R (Result):** "تعلمت: لا تنشر تغييرين كبيرين معاً. حسّنت runbook من 4 دقائق rollback إلى 90 ثانية. شاركت الـ post-mortem مع كامل القسم."

---

## 📚 المراجع
| النوع | الرابط |
|--------|--------|
| **درس ذو صلة** | [Interview Preparation](./01-interview-preparation) |
| **درس ذو صلة** | [System Design](./03-system-design-masterclass) |
| **مرجع** | [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/) |
| **مرجع** | [Kubernetes Troubleshooting](https://kubernetes.io/docs/tasks/debug/) |

---

[← Interview Preparation](./01-interview-preparation) | [→ System Design](./03-system-design-masterclass) | [🏠 الرئيسية](/)
