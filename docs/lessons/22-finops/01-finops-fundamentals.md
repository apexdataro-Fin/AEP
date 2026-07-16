---
sidebar_position: 1
title: "أساسيات FinOps"
description: "إدارة التكاليف السحابية: الميزانيات، التوفير، Reserved Instances، والقضاء على الهدر."
---

# أساسيات FinOps

> "كل دولار في السحابة يجب أن يكون له مبرر. FinOps هو فن تحقيق أقصى قيمة بأقل تكلفة."

## 🎯 أهداف التعلم

- فهم ثقافة FinOps: الإعلام، التحسين، التشغيل
- تحديد الهدر وإزالته من البيئة السحابية
- تطبيق Reserved Instances و Savings Plans
- بناء تقارير التكاليف والتوعية
- إنشاء سياسات حوكمة التكاليف

---

## 📖 الطبقة الأساسية: فلسفة FinOps

### دورة FinOps

```
        ┌──────────────────────────┐
        │      الإعلام (Inform)    │
        │   الرؤية + التخصيص       │
        │   من ينفق؟ على ماذا؟     │
        └──────────┬───────────────┘
                   │
        ┌──────────▼───────────────┐
        │      التحسين (Optimize)  │
        │   تقليل الاستهلاك        │
        │   استخدام أفضل للخصومات   │
        └──────────┬───────────────┘
                   │
        ┌──────────▼───────────────┐
        │     التشغيل (Operate)    │
        │   أتمتة السياسات         │
        │   قياس مستمر              │
        └──────────────────────────┘
```

### أنواع الهدر السحابي

| الهدر                    | مثال                   | التكلفة المقدرة |
| ------------------------ | ---------------------- | --------------- |
| **موارد غير مستخدمة**    | VM تعمل بدون حركة مرور | 30-40%          |
| **أحجام مبالغ فيها**     | D8s لخدمة تحتاج D2s    | 15-25%          |
| **Snapshots قديمة**      | نسخ احتياطية من 2024   | 5-10%           |
| **IPs غير مرتبطة**       | Public IPs بدون VM     | $4/IP/شهر       |
| **Load Balancers خاملة** | ALB بدون targets       | $20/LB/شهر      |
| **Logs لا نهائية**       | 90 يوماً لـ debug logs | 10-20%          |

---

## 🧱 الطبقة المهنية: تحليل التكاليف

### هيكل التكاليف في Azure

```bash
# عرض التكاليف حسب الخدمة
az consumption usage list \
  --start-date "2026-06-01" \
  --end-date "2026-06-30" \
  --query "sort_by([].{Service:consumedService,Cost:pretaxCost},&Cost)" \
  --output table

# الناتج:
# Service                    Cost
# ────────────────────────   ──────────
# Microsoft.Compute          $12,450.00
# Microsoft.Sql              $4,200.00
# Microsoft.Storage          $890.00
# Microsoft.Network          $650.00
# Microsoft.ContainerService $3,100.00
```

### تخصيص التكاليف (Cost Allocation)

```bash
# تطبيق Tags للتتبع
az tag create --name CostCenter
az tag create --name Environment
az tag create --name Project

# تخصيص التكاليف لكل فريق
az group update \
  --name cloudnova-api-prod-rg \
  --set tags.CostCenter=Engineering \
         tags.Project=CloudNova \
         tags.Environment=Production \
         tags.CreatedBy=terraform
```

### تحليل مفصل

```kusto
// KQL في Azure Cost Management
// التكاليف حسب الـ resource group
ResourceCosts
| where TimeGenerated between (datetime(2026-06-01) .. datetime(2026-06-30))
| summarize TotalCost = sum(Cost) by ResourceGroup
| order by TotalCost desc

// زيادة غير طبيعية في التكاليف
ResourceCosts
| where TimeGenerated > ago(30d)
| summarize DailyCost = sum(Cost) by bin(TimeGenerated, 1d)
| serialize
| extend PreviousDayCost = prev(DailyCost, 1)
| extend Increase = iff(PreviousDayCost > 0,
    (DailyCost - PreviousDayCost) / PreviousDayCost * 100, 0)
| where Increase > 20
```

---

## 🏗️ الطبقة الإنتاجية: استراتيجيات التوفير

### 1. Reserved Instances + Savings Plans

```
VM D4s v3:
├── Pay-as-you-go: $210/شهر
├── 1-year Reserved: $140/شهر (توفير 33%)
└── 3-year Reserved: $96/شهر  (توفير 54%)

Savings Plan (Compute):
├── Hourly commit: $10/hr
├── Flexible across VM families
└── Automatic optimization
```

```bash
# شراء Reservation
az reservations reservation order purchase \
  --reservation-order-id "vm-reservation-2026" \
  --sku "Standard_D4s_v3" \
  --location westeurope \
  --term P1Y \
  --quantity 5 \
  --billing-scope "/subscriptions/12345" \
  --applied-scope-type Shared
```

### 2. Auto-shutdown لبيئات التطوير

```bash
# إيقاف تلقائي ليلاً
az vm auto-shutdown \
  --resource-group dev-weu-rg \
  --name dev-server-01 \
  --time 2100 \
  --timezone "Europe/Helsinki"

# سياسة Azure: إيقاف VMs غير المنتجة
az policy definition create \
  --name "auto-shutdown-dev-vms" \
  --rules '{
    "if": {
      "allOf": [
        {"field": "type", "equals": "Microsoft.Compute/virtualMachines"},
        {"field": "tags[Environment]", "equals": "Development"}
      ]
    },
    "then": {
      "effect": "deployIfNotExists",
      "details": {
        "type": "Microsoft.DevTestLab/schedules",
        "existenceCondition": {
          "field": "Microsoft.DevTestLab/schedules/status",
          "equals": "Enabled"
        }
      }
    }
  }'
```

### 3. Right-Sizing

```bash
# تحليل استخدام الموارد لآخر 30 يوماً
az monitor metrics list \
  --resource /subscriptions/.../virtualMachines/web-01 \
  --metric "Percentage CPU" \
  --aggregation Average \
  --interval PT1H \
  --start-time 2026-06-01T00:00:00Z \
  --end-time 2026-06-30T23:59:59Z \
  --query "value[0].timeseries[0].data[?average < 10]"
```

| الحجم الحالي             | الاستخدام   | الحجم المقترح            | التوفير |
| ------------------------ | ----------- | ------------------------ | ------- |
| Standard_D8s_v3 (8 vCPU) | 12% CPU avg | Standard_D2s_v3 (2 vCPU) | 75%     |
| Standard_E16s_v3 (128GB) | 18GB used   | Standard_E4s_v3 (32GB)   | 75%     |

---

## 🎨 الطبقة المعمارية: حوكمة التكاليف

### Azure Policy للتكاليف

```json
{
  "properties": {
    "displayName": "منع أحجام VMs الكبيرة",
    "policyRule": {
      "if": {
        "allOf": [
          { "field": "type", "equals": "Microsoft.Compute/virtualMachines" },
          {
            "field": "Microsoft.Compute/virtualMachines/sku.name",
            "in": ["Standard_M128s", "Standard_E96s_v5"]
          }
        ]
      },
      "then": { "effect": "deny" }
    }
  }
}
```

### هيكل الميزانيات

```
Cloud Budget: $48,000/شهر
├── Production: $35,000 (73%)
│   ├── Compute (AKS + VMs): $18,000
│   ├── Databases: $10,000
│   ├── Networking: $4,000
│   └── Storage + Backup: $3,000
│
├── Staging: $8,000 (17%)
│   ├── Compute: $5,000
│   └── Databases: $3,000
│
└── Development: $5,000 (10%)
    ├── Compute: $4,000
    └── Everything else: $1,000
```

---

## 🏥 سيناريو CloudNova: أزمة تكاليف

```
📋 التذكرة: FINOPS-2026-003
العنوان: التكاليف تضاعفت هذا الشهر!

التحقيق:

1. فتح Cost Management:
   ├──上月: $42,000
   ├── هذا الشهر: $78,000
   └── زيادة: 85%!

2. تحليل السبب الجذري:
   ├── فريق AI نشر 5 VMs مع GPU (NC96ads_A100_v4)
   │   └── $4,500/VM/شهر = $22,500 إضافي
   ├── Log Analytics workspace يجمع 500GB/يوم
   │   └── $3,000 إضافي
   └── 12 Public IP غير مستخدمة
       └── $48 إضافي

3. الإجراءات التصحيحية:
   ├── ✅ Spot VMs للـ AI workloads (توفير 80%)
   ├── ✅ تقليل retention للـ logs (30 يوم بدل 90)
   ├── ✅ حذف IPs غير المستخدمة
   ├── ✅ Auto-shutdown لـ VMs التطوير
   └── ✅ ميزانية أسبوعية مع alert عند 80%

4. النتيجة:
   التكاليف عادت إلى $45,000/شهر
```

---

## ⚡ الإنتاج وما بعده

### قائمة تدقيق FinOps

```
□ هل كل VM لديها Tag (CostCenter, Environment)؟
□ هل Reserved Instances تغطي 70%+ من VMs الإنتاج؟
□ هل بيئات التطوير تنطفئ ليلاً؟
□ هل الـ Logs retention مناسب (وليس 90 يوم لكل شيء)؟
□ هل هناك ميزانية شهرية مع alert؟
□ هل الـ Storage lifecycle policy تنقل البيانات القديمة لـ Cool/Archive؟
□ هل Snapshots أقدم من 30 يوماً تُحذف؟
□ هل Public IPs غير المستخدمة تُزال؟
□ هل الـ Load Balancers لديها targets؟
```

---

## 🧠 التذكّر النشط

1. ما الفرق بين Reserved Instance و Savings Plan؟
2. كيف تحسب التوفير من Right-sizing VM؟
3. لماذا Tags ضرورية لـ FinOps؟
4. كيف ترد على مدير يقول "التطوير يحتاج نفس موارد الإنتاج"؟
5. ما هي أكبر 3 مصادر للهدر السحابي؟

## 📝 بطاقات تعليمية

- **FinOps**: ممارسة إدارة التكاليف السحابية بتعاون مالي وتقني
- **Reserved Instance**: التزام لمدة سنة أو 3 سنوات مقابل خصم 30-60%
- **Spot VM**: VM بسعر مخفض (80%) لكن Azure قد تستردها في أي وقت
- **Chargeback**: تحميل كل فريق تكلفة موارده الفعلية
- **Showback**: إظهار التكاليف لكل فريق دون محاسبتهم فعلياً

## 🎤 أسئلة المقابلة

1. **"كيف تقنع فريق التطوير بتقليل استخدام الموارد؟"**
   - أظهر لهم فاتورتهم الشهرية
   - اربط التكاليف بالميزات (cost per feature)
   - وفر أدوات Self-service لمراقبة تكاليفهم
   - اجعل التوفير جزءاً من OKRs

2. **"متى تختار Reserved Instance ومتى Savings Plan؟"**
   - RI: لحمل ثابت ومحدد (مثلاً: 5 VMs D4s للإنتاج)
   - Savings Plan: لحمل متغير (compute فقط، أكثر مرونة)

3. **"كيف تتعامل مع Shadow IT في السحابة؟"**
   - Azure Policy لمنع الموارد غير المصرحة
   - تقارير شهرية للإدارة
   - منصة Self-service سهلة (حتى لا يلجأوا لـ Shadow IT)

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
