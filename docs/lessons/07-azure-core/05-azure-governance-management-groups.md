---
sidebar_position: 5
title: "الحوكمة ومجموعات الإدارة"
description: "Management Groups، Azure Policy، Blueprints، Cost Management — حوكمة على نطاق المؤسسة."

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
# إنشاء Management Group
az account management-group create \
  --name Production \
  --display-name "Production Resources"

# نقل اشتراك إلى Management Group
az account management-group subscription add \
  --name Production \
  --subscription "cloudnova-prod-sub"
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
          { "not": { "field": "Microsoft.Compute/virtualMachines/sku.name", "in": ["Standard_B1s", "Standard_B2s", "Standard_D2s_v3"] } }
        ]
      },
      "then": { "effect": "Deny" }
    }
  }
}
```

```bash
az policy definition create --name allowed-vm-skus --rules policy.json
az policy assignment create --policy allowed-vm-skus --scope /providers/Microsoft.Management/managementGroups/Production
```

### Cost Management

```bash
# إنشاء Budget مع alert
az consumption budget create \
  --budget-name monthly-budget \
  --amount 5000 \
  --time-grain Monthly \
  --start-date 2026-01-01 \
  --end-date 2026-12-31 \
  --contact-emails ops@cloudnova.com

# إرسال alert عند 80%
az consumption budget create \
  --budget-name monthly-budget-80 \
  --amount 4000 \
  --threshold 80 \
  --contact-emails ops@cloudnova.com
```

---

## 🏛️ سيناريو CloudNova

أحد المطورين الجدد أنشأ 5 VMs من SKU `Standard_E64s_v3` "للتجربة". الفاتورة الشهرية: $2,500 × 5 = $12,500.

بعد الحادثة، طبقنا:
1. Azure Policy: يمنع إنشاء أي VM أكبر من `Standard_D4s_v3` بدون موافقة
2. Budget Alert: إشعار عند 50% من الميزانية الشهرية
3. Resource Locks: قفل `CanNotDelete` على موارد الإنتاج

---

## 🛠️ تدريب

اكتب 3 Azure Policies:
1. منع إنشاء موارد خارج West Europe
2. إلزام جميع الـ Storage Accounts بـ TLS 1.2
3. فرض tags: `Environment` و `CostCenter`

---

[← Storage Deep Dive](./04-azure-storage-deep-dive) | [→ Container Fundamentals](../../08-containers/01-container-fundamentals) | [🏠 الرئيسية](/)
