---
sidebar_position: 5
title: "الحوكمة ومجموعات الإدارة"
description: "Management Groups، Azure Policy، Blueprints، Cost Management — حوكمة على نطاق المؤسسة."
---

# الحوكمة ومجموعات الإدارة

> "الحوكمة ليست بيروقراطية. إنها التأكد من أن 200 مهندس لا ينشئون 200 فوضى مختلفة."

## 🎯 أهداف التعلم

- هيكلة Management Groups
- كتابة Azure Policies مخصصة
- تفعيل Cost Management و Budgets
- Resource Locks لمنع الحذف

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

---

## 🏗️ Management Groups Hierarchy

```
Root Management Group
├── Production
│   ├── Applications
│   └── Data
├── Development
│   └── Sandbox
└── Testing
```

```bash
az account management-group create --name Production --display-name "Production Resources"
az account management-group subscription add --name Production --subscription "cloudnova-prod-sub"
```

### Azure Policy — قواعد إلزامية

```json
{
  "properties": {
    "displayName": "Allowed VM SKUs",
    "policyRule": {
      "if": {
        "allOf": [
          { "field": "type", "equals": "Microsoft.Compute/virtualMachines" },
          {
            "not": {
              "field": "Microsoft.Compute/virtualMachines/sku.name",
              "in": ["Standard_B1s", "Standard_B2s", "Standard_D2s_v3"]
            }
          }
        ]
      },
      "then": { "effect": "Deny" }
    }
  }
}
```

### Cost Management

```bash
az consumption budget create --budget-name monthly-budget --amount 5000 --time-grain Monthly --contact-emails ops@cloudnova.com
az consumption budget create --budget-name monthly-budget-80 --amount 4000 --threshold 80
```

### Resource Locks

```bash
az lock create --name CanNotDelete --lock-type CanNotDelete --resource-group cloudnova-prod
az lock create --name ReadOnly --lock-type ReadOnly --resource cloudnova-dns-zone
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

أحد المطورين أنشأ 5 VMs من SKU `Standard_E64s_v3` "للتجربة". الفاتورة: $12,500.

**بعد الحادثة**:

1. Azure Policy: يمنع أي VM أكبر من `Standard_D4s_v3`
2. Budget Alert: إشعار عند 50%
3. Resource Locks: `CanNotDelete` على الإنتاج
4. RBAC: المطورون لا يملكون `Contributor` في production

### Tagging Strategy

```bash
# إلزام tags عبر Azure Policy
az policy definition create --name require-tags --rules '{
  "if": {
    "field": "tags",
    "exists": "false"
  },
  "then": {
    "effect": "Deny"
  }
}'

# Tags إلزامية: Environment, CostCenter, Owner
```

### Monitoring Compliance

```bash
az policy state list --query "[?complianceState=='NonCompliant']" -o table
```

---

## 🎨 طبقة المعماري

### Policy Effects

| Effect                | متى تستخدمه                                  |
| --------------------- | -------------------------------------------- |
| **Deny**              | منع إنشاء موارد غير مسموحة                   |
| **Audit**             | تسجيل المخالفات بدون منع                     |
| **DeployIfNotExists** | نشر موارد تلقائياً (مثل diagnostic settings) |
| **Modify**            | تعديل خصائص الموارد (مثل إضافة tags)         |

---

## 🛠️ تدريبات

### تمرين: اكتب 3 Azure Policies

1. منع إنشاء موارد خارج West Europe
2. إلزام Storage Accounts بـ TLS 1.2
3. فرض tags: `Environment` و `CostCenter`

### تحدي: Cost Alert Automation

أنشئ Azure Function ترسل إشعار Slack عندما تقترب الفاتورة من الـ budget.

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما الفرق بين Management Group و Subscription؟
2. متى تستخدم `Deny` vs `Audit` effect في Policy؟
3. كيف تمنع حذف موارد الإنتاج؟
4. ما فائدة tagging؟
5. كيف تراقب compliance؟

### 🃏 بطاقات

| السؤال           | الإجابة                        |
| ---------------- | ------------------------------ |
| Management Group | حاوية لتنظيم الاشتراكات        |
| Azure Policy     | قواعد إلزامية تتحكم في الموارد |
| Resource Lock    | منع حذف أو تعديل الموارد       |
| Budget Alert     | إشعار عند تجاوز حد الإنفاق     |

---

## 🎤 مقابلة

1. **"كيف تحكم 50 اشتراك Azure؟"**
   → Management Groups + Policies + RBAC + Budgets + Monitoring

2. **"كيف تمنع فريق التطوير من إنشاء موارد باهظة؟"**
   → Azure Policy (Deny expensive SKUs) + Budget alerts

---

## 📚 مراجع

| النوع     | الرابط                                           |
| --------- | ------------------------------------------------ |
| درس مرتبط | [Azure Storage](./04-azure-storage-deep-dive)    |
| درس مرتبط | [FinOps](../../22-finops/01-finops-fundamentals) |
| شهادة     | AZ-104 (Governance)                              |

---

[← Storage Deep Dive](./04-azure-storage-deep-dive) | [→ Container Fundamentals](../../08-containers/01-container-fundamentals) | [🏠 الرئيسية](/)
