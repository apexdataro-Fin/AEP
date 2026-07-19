---
sidebar_position: 4
title: "الامتثال ككود"
description: "Compliance as Code — Azure Policy، InSpec، Chef Compliance."
---

# الامتثال ككود

> "الامتثال اليدوي كذبة. الأتمتة هي الطريق الوحيد."

## 🎯 أهداف التعلم

- كتابة سياسات الامتثال ككود
- InSpec للفحص الآلي
- Azure Policy للامتثال المستمر
- تقارير الامتثال التلقائية

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Advanced

---

## 🏗️ InSpec

```ruby
# compliance/cis_azure.rb
control 'azure-cis-1.1' do
  impact 1.0
  title 'Ensure MFA is enabled for all users'
  describe azure_generic_resource(id: '/providers/Microsoft.aad') do
    its('properties.mfaEnabled') { should eq true }
  end
end

control 'azure-cis-2.3' do
  impact 0.7
  title 'Ensure Storage Accounts use HTTPS only'
  azure_storage_accounts.names.each do |name|
    describe azure_storage_account(name: name) do
      its('properties.supportsHttpsTrafficOnly') { should be true }
    end
  end
end
```

```bash
inspec exec cis_azure.rb -t azure://
```

### Azure Policy للامتثال المستمر

```json
{
  "properties": {
    "displayName": "Audit VMs without managed disks",
    "policyRule": {
      "if": { "field": "type", "equals": "Microsoft.Compute/virtualMachines" },
      "then": { "effect": "audit" }
    }
  }
}
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

مدقق PCI-DSS يطلب تقرير compliance. بدلاً من أسبوعين من العمل اليدوي، `inspec exec` أنتج التقرير في 10 دقائق.

### Compliance Pipeline

```yaml
- name: Compliance Check
  run: |
    inspec exec cis_azure.rb -t azure:// --reporter json:compliance-report.json
    # فشل البناء إذا compliance < 80%
```

---

## 🎨 أدوات Compliance as Code

| الأداة | الاستخدام |
|--------|-----------|
| **InSpec** | فحص compliance للبنية التحتية |
| **Azure Policy** | compliance مستمر في Azure |
| **OPA** | سياسات مخصصة لـ Kubernetes |
| **Trivy** | فحص compliance + ثغرات للحاويات |

---

## 🛠️ تدريبات

### تمرين: اكتب InSpec test لـ Storage Account
### تحدي: ابنِ compliance pipeline مع InSpec في CI/CD

---

## 📝 تقييم

### ✅ فحص المعرفة
1. لماذا Compliance as Code أفضل من اليدوي؟
2. ما الفرق بين InSpec و Azure Policy؟
3. كيف تدمج compliance في CI/CD؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| InSpec | أداة فحص compliance للبنية التحتية |
| Compliance as Code | كتابة فحوصات compliance ككود |
| CIS | Center for Internet Security — معايير أمان |

---

## 🎤 مقابلة
1. **"كيف تثبت compliance لمدقق خارجي؟"** → InSpec report + Azure Policy compliance dashboard
2. **"كيف تمنع drift عن compliance؟"** → Azure Policy + CI/CD checks

---

[← Secrets Management](./03-secrets-management-vault) | [→ GitOps Fundamentals](../../18-gitops/01-gitops-fundamentals) | [🏠 الرئيسية](/)
