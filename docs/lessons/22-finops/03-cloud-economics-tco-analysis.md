---
sidebar_position: 3
title: "اقتصاديات السحابة"
description: "Cloud Economics — TCO Analysis، ROI، CAPEX vs OPEX."
---

# اقتصاديات السحابة

> "السحابة ليست دائماً أرخص. لكنها دائماً أكثر مرونة."

## 🎯 أهداف التعلم

- حساب TCO (Total Cost of Ownership)
- CAPEX vs OPEX
- Business Case للانتقال إلى السحابة
- قياس ROI

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🏗️ CAPEX vs OPEX

|             | On-Prem (CAPEX) | Cloud (OPEX)      |
| ----------- | --------------- | ----------------- |
| **الدفع**   | مقدماً          | شهرياً            |
| **التوسع**  | شراء أجهزة      | نقرة زر           |
| **الصيانة** | فريق كامل       | مزود السحابة      |
| **المخاطر** | أجهلة معطلة     | فاتورة غير متوقعة |

### TCO Calculator

```python
on_prem = {
    "servers": 50000,
    "networking": 15000,
    "storage": 20000,
    "power_cooling": 8000,
    "staff": 120000,
    "annual_total": 163000
}
cloud = {
    "compute_monthly": 2000,
    "storage_monthly": 500,
    "networking_monthly": 200,
    "backup_monthly": 300,
    "annual_total": 36000
}
print(f"On-Prem: ${on_prem['annual_total']:,}/year")
print(f"Cloud: ${cloud['annual_total']:,}/year")
print(f"Savings: ${on_prem['annual_total'] - cloud['annual_total']:,}/year")
```

---

## 🏛️ طبقة الإنتاج

### متى السحابة ليست الحل؟

- أحمال ثابتة 24/7 لمدة 5+ سنوات
- بيانات بمتطلبات سيادة صارمة
- تطبيقات legacy لا تدعم virtualization

### سيناريو CloudNova: Business Case للـ CTO

```
التكلفة الحالية (On-Prem): $163,000/سنة
التكلفة المقترحة (Azure): $36,000/سنة
التوفير: $127,000/سنة
ROI: 3 أشهر
```

**تمت الموافقة.**

---

## 🎨 CAPEX vs OPEX للشركات

| الشركة الناشئة              | المؤسسة الكبيرة                |
| --------------------------- | ------------------------------ |
| تفضل OPEX (لا cash upfront) | قد تفضل CAPEX (استهلاك الأصول) |
| مرونة = بقاء                | استقرار = أولوية               |

---

## 🛠️ تدريبات

### تمرين: احسب TCO لتطبيقك الحالي

### تحدي: اكتب business case من صفحة واحدة للانتقال إلى Azure

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما الفرق بين CAPEX و OPEX؟
2. كيف تحسب TCO؟
3. متى تكون on-prem أفضل من cloud؟

### 🃏 بطاقات

| السؤال | الإجابة                            |
| ------ | ---------------------------------- |
| CAPEX  | Capital Expenditure — دفع مقدماً   |
| OPEX   | Operational Expenditure — دفع شهري |
| TCO    | Total Cost of Ownership            |

---

## 🎤 مقابلة

1. **"كيف تقنع CFO بالانتقال إلى cloud؟"** → TCO analysis + ROI timeline
2. **"متى تبقى على on-prem؟"** → أحمال ثابتة طويلة الأجل

---

## 🏛️ سيناريو CloudNova: معركة الـ Business Case

**منال** Cloud Architect في CloudNova. مجلس الإدارة قال: "أثبتوا أن cloud أوفر من on-prem."

**المهمة:** Business case من صفحة واحدة تثبت أن Azure يوفر 78% من التكاليف.

### منهجية TCO خطوة بخطوة

```python
# حساب TCO شامل
def calculate_tco():
    # === On-Premises (5-year Total) ===
    on_prem = {
        # Hardware (amortized over 5 years)
        "servers": 250_000,      # 10 servers × $25,000
        "networking": 75_000,    # Switches, firewalls, load balancers
        "storage": 125_000,      # SAN, backup arrays

        # Annual costs × 5 years
        "power_cooling": 8_000 * 5,    # $40,000
        "datacenter_lease": 12_000 * 5, # $60,000
        "maintenance": 15_000 * 5,      # $75,000 (hardware support)

        # Staff (annual)
        "sysadmin_salary": 110_000 * 5,  # 1 FTE × 5 yrs = $550,000
        "network_engineer": 95_000 * 5,    # 1 FTE × 5 yrs = $475,000

        # Hidden costs
        "training": 20_000,
        "security_audits": 45_000,
        "disaster_recovery_site": 180_000,
        "overtime_incidents": 35_000,
    }

    on_prem_total = sum(on_prem.values())

    # === Azure (Annual) ===
    cloud = {
        # Compute — 3-year Reserved Instances save 72%
        "compute_monthly": 2_200,       # Azure VMs (RI pricing)
        "aks_monthly": 0,                # AKS control plane = free

        # Storage
        "managed_disks_monthly": 450,
        "blob_storage_monthly": 180,
        "backup_monthly": 220,

        # Network
        "bandwidth_monthly": 350,
        "azure_firewall_monthly": 910,

        # Platform Services (managed = no staff needed)
        "azure_sql_monthly": 500,         # Managed SQL — zero DBA!
        "app_service_monthly": 200,
        "key_vault_monthly": 3,

        # Monitoring & Security
        "azure_monitor_monthly": 380,
        "defender_monthly": 600,
        "sentinel_monthly": 450,
    }

    cloud_annual = sum(cloud.values()) * 12
    cloud_total = cloud_annual * 5  # 5-year projection

    print(f"📊 TCO Analysis: On-Prem vs Azure\n")
    print(f"On-Premises (5yr): ${on_prem_total:,.0f}")
    print(f"Azure (5yr):      ${cloud_total:,.0f}")
    print(f"Savings:          ${on_prem_total - cloud_total:,.0f}")
    print(f"Reduction:        {(1 - cloud_total/on_prem_total)*100:.0f}%")

    # ROI — متى نسترجع الاستثمار؟
    migration_cost = 85_000  # استشارات + تدريب + أدوات هجرة
    monthly_savings = (on_prem_total/60) - (cloud_annual/12)
    roi_months = migration_cost / monthly_savings
    print(f"ROI: {roi_months:.0f} months")

calculate_tco()
```

**النتيجة: Azure يوفر 78% — ROI في 3.5 أشهر فقط.**

---

## 🎨 طبقة المعماري: CAPEX vs OPEX Deep Dive

### Financial Impact Matrix

| البعد                | On-Prem (CAPEX)       | Cloud (OPEX)            | الأفضل لـ      |
| -------------------- | --------------------- | ----------------------- | -------------- |
| **Cash flow**        | كبير مقدماً           | شهري متوقع              | Startups: OPEX |
| **Tax treatment**    | استهلاك على 5-7 سنوات | مصروف سنوي              | حسب الدولة     |
| **Scalability**      | شراء أجهزة جديدة      | نقرة زر                 | Cloud          |
| **Predictability**   | تكلفة ثابتة           | متغيرة (risk!)          | On-Prem        |
| **Innovation speed** | شهور لشراء hardware   | دقائق لتجربة خدمة جديدة | Cloud          |
| **Vendor lock-in**   | لا يوجد               | خطر                     | On-Prem        |
| **Security**         | أنت مسؤول عن كل شيء   | Shared responsibility   | حسب maturity   |

### متى تكون On-Prem أفضل؟ — شجرة قرار

```python
def decide_cloud_vs_onprem(workload):
    score = 0

    # العوامل التي ترجح On-Prem
    if workload.utilization > 90 and workload.pattern == "steady":
        score -= 2  # Cloud excels with variable workloads
    if workload.data_sovereignty == "strict":
        score -= 3  # بعض القوانين تمنع cloud
    if workload.latency_sla_ms < 5:
        score -= 1  # Edge computing may be needed
    if workload.contract_term_years >= 5:
        score -= 2  # Long commitment favors owned hardware

    # العوامل التي ترجح Cloud
    if workload.expected_growth > 100:  # %
        score += 3  # Cloud scales instantly
    if workload.team_size < 10:
        score += 2  # Small team can't manage datacenter
    if workload.needs_global_deployment:
        score += 3  # Cloud has 60+ regions
    if workload.startup_mode:
        score += 2  # No upfront capital

    if score > 0:
        return "Cloud ☁️"
    elif score < 0:
        return "On-Premises 🏢"
    else:
        return "Hybrid 🔄 — sensitive data on-prem, burst to cloud"
```

### Anti-Patterns

| الخطأ                           | المشكلة                  | التصحيح                                |
| ------------------------------- | ------------------------ | -------------------------------------- |
| Lift-and-shift بدون refactoring | Cloud = أغلى من on-prem  | Refactor للـ PaaS/managed services     |
| تجاهل Reserved Instances        | تدفع 3x أكثر للـ compute | 3-year RI يوفر 72%                     |
| Cloud = أوفر دائماً             | بعض الأحمال أفضل on-prem | TCO analysis لكل workload              |
| إهمال تكلفة الهجرة              | الهجرة تكلف وقت ومال     | ضمّن تكلفة الهجرة في الـ business case |

---

## 🛠️ تدريبات موسعة

### تمرين 1: Azure TCO Calculator

```bash
# استخدم Azure TCO Calculator
# https://azure.microsoft.com/pricing/tco/calculator/

# أو احسب يدوياً
az costmanagement query \
  --scope "subscriptions/xxx" \
  --timeframe "MonthToDate" \
  --type "ActualCost" \
  --dataset '{"granularity":"Daily","aggregation":{"totalCost":{"name":"PreTaxCost","function":"Sum"}}}'
```

### تمرين 2: Business Case Template

```markdown
# Business Case: الهجرة إلى Azure

## Executive Summary

- Current annual IT spend: $505,000
- Proposed Azure annual spend: $112,320
- Annual savings: $392,680 (78%)
- Migration cost: $85,000
- ROI: 3.5 months

## Current State (On-Prem)

- 10 physical servers (aged 4 years, due for refresh)
- 2 FTE for infrastructure management
- 99.5% availability (3 unplanned outages/year)

## Proposed State (Azure)

- Azure VMs (Reserved Instances, 3-year)
- Azure Kubernetes Service (managed)
- Azure SQL Database (managed)
- 0.5 FTE for cloud management
- 99.95% availability (SLA)

## Risks & Mitigations

| Risk            | Mitigation                                 |
| --------------- | ------------------------------------------ |
| Cost overrun    | Azure Budgets + alerts + FinOps governance |
| Migration delay | Phased approach (dev → staging → prod)     |
| Skill gap       | Azure training + Microsoft ESI benefits    |
```

### تحدي: Multi-Cloud vs Single Cloud Economics

```python
def compare_multi_vs_single_cloud():
    # AWS vs Azure vs GCP pricing (مثال: 100 vCPUs, 1TB RAM, 10TB storage)
    providers = {
        "AWS": {"compute": 12500, "storage": 2300, "network": 1800, "managed_services": 4200},
        "Azure": {"compute": 11200, "storage": 2100, "network": 1600, "managed_services": 3800},
        "GCP": {"compute": 10800, "storage": 2200, "network": 1700, "managed_services": 3500},
    }

    # Strategy 1: Cheapest provider only (GCP)
    single = sum(providers["GCP"].values())

    # Strategy 2: Best-of-breed multi-cloud
    multi = (
        providers["Azure"]["managed_services"] +  # Azure best for managed services
        providers["GCP"]["compute"] +             # GCP cheapest compute
        providers["AWS"]["network"]                # AWS best network pricing
    ) + 3000  # Multi-cloud premium (management, egress, training)

    print(f"Single Cloud (GCP): ${single:,}/month")
    print(f"Multi-Cloud: ${multi:,}/month")
    print(f"Difference: ${multi - single:,}/month")
    print(f"Multi-cloud premium: {(multi/single - 1)*100:.1f}%")
```

---

## 📝 تقييم شامل

### ✅ فحص المعرفة (5)

1. ما الفرق بين CAPEX و OPEX؟
2. كيف تحسب TCO للسحابة مقابل on-prem؟
3. متى تكون on-prem أفضل من cloud؟
4. ما فائدة Reserved Instances في تحليل التكلفة؟
5. كيف تحتسب تكلفة الموظفين في TCO؟

### 📝 اختبار (3)

1. **شركة لديها 50 خادماً تستخدم 24/7 بنسبة 95%. هل تنتقل للسحابة؟**
   

<details><summary>الإجابة</summary>على الأرجح لا. استخدام عال + ثابت = on-prem أرخص مع Reserved Instances. لكن احسب TCO أولاً — قد توفر المنصات المدارة (managed DB) تكاليف staff كبيرة.</details>



2. **كيف تقنع CFO الذي يخشى cloud costs غير المتوقعة؟**
   

<details><summary>الإجابة</summary>Azure Budgets + alerts, Reserved Instances للتكاليف الثابتة, FinOps governance, show TCO analysis with worst-case scenario, reference customers who saved money.</details>



3. **ما هي التكاليف الخفية للـ cloud؟**
   

<details><summary>الإجابة</summary>Egress bandwidth, unused resources (zombie VMs, unattached disks), Dev/Test environments left running, training, managed service charges, support plan.</details>



### 🧠 Active Recall (5)

- ارسم مقارنة CAPEX vs OPEX لشركة ناشئة وشركة كبيرة
- احسب ROI لهجرة تطبيق إلى Azure
- اشرح متى يكون multi-cloud اقتصادياً
- ما التكاليف الخفية في كلا النموذجين؟
- صف تجربة قدمت فيها business case ناجحاً

### 🎓 Feynman: Cloud Economics لغير التقني

"تخيل أنك تريد سيارة. CAPEX = شراء السيارة نقداً (مبلغ كبير مرة واحدة، ثم مصاريف صيانة سنوية). OPEX = استئجار السيارة شهرياً (مبلغ صغير، الصيانة مشمولة، تستبدلها بموديل أحدث متى أردت). السحابة هي نموذج الإيجار."

### 🃏 بطاقات (8)

| السؤال            | الإجابة                                          |
| ----------------- | ------------------------------------------------ |
| CAPEX             | Capital Expenditure — إنفاق رأسمالي (شراء أصول)  |
| OPEX              | Operational Expenditure — إنفاق تشغيلي (شهري)    |
| TCO               | Total Cost of Ownership — التكلفة الكلية للملكية |
| ROI               | Return on Investment — العائد على الاستثمار      |
| Reserved Instance | حجز سعة سحابية لمدة 1-3 سنوات بخصم يصل لـ 72%    |
| FinOps            | إدارة مالية للسحابة                              |
| Chargeback        | محاسبة الفرق/الأقسام على استهلاكهم السحابي       |
| Sustainability    | كفاءة الطاقة وتقليل البصمة الكربونية في السحابة  |

---

## 🎤 أسئلة المقابلة الموسعة

### تقني

1. **"كيف تبني FinOps culture في المؤسسة؟"**
   - Visibility: Azure Cost Management dashboards لكل فريق
   - Accountability: tagging strategy + chargeback
   - Optimization: RI coverage, right-sizing, idle resource cleanup
   - Governance: Azure Policy + budgets + alerts

2. **"عميل يدفع $50K/شهر على Azure. كيف تخفض 30%؟"**
   - Reserved Instances (3-year) = save 40-72%
   - Azure Hybrid Benefit = save 40% على Windows VMs
   - Right-size underutilized VMs (Azure Advisor)
   - Delete zombie resources (unattached disks, idle IPs)
   - Dev/Test subscription مع auto-shutdown nights/weekends

### System Design

**"صمم نظام FinOps لـ 50 فريقاً على Azure."**

- Tagging: mandatory tags (cost-center, environment, project)
- Budgets: per-team monthly budgets مع alerts عند 80%
- Dashboards: Power BI مع Azure Cost Management API
- Automation: Azure Functions لإيقاف الموارد idle
- Reporting: weekly cost reports per team
- Governance: Azure Policy لمنع expensive SKUs

### Behavioral (STAR)

**"كيف وفرت تكاليف cloud كبيرة؟"**

**S:** Cloud bill = $80K/شهر. CTO يريد خفض 25%.
**T:** تحليل cost drivers وتنفيذ optimizations.
**A:** (1) RI purchase saved $18K/month. (2) Right-sizing 200 VMs saved $8K. (3) Dev/Test auto-shutdown saved $4K. (4) Cleanup zombies saved $2K.
**R:** Bill dropped إلى $48K/شهر (40% saving = $384K/year). CTO very happy.

---

## 📚 المراجع

- [Azure TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
- [FinOps Foundation](https://www.finops.org/)
- [Azure Cost Management](https://learn.microsoft.com/azure/cost-management-billing/)
- الشهادات: AZ-900, AZ-104
- الدروس المرتبطة: [Azure Cost Optimization](./02-azure-cost-optimization-deep.md) | [FinOps Fundamentals](./01-finops-fundamentals.md) | [Platform Engineering](../../19-platform/01-platform-engineering.md)

---

[← Azure Cost Optimization](./02-azure-cost-optimization-deep) | [→ Identity Mastery](../../23-identity/01-identity-mastery) | [🏠 الرئيسية](/)
