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
inspec exec cis_azure.rb -t azure:// --input subscription_id=$SUBSCRIPTION_ID
```

### Azure Policy للامتثال المستمر

```json
{
  "properties": {
    "displayName": "Audit VMs without managed disks",
    "policyRule": {
      "if": {
        "field": "type",
        "equals": "Microsoft.Compute/virtualMachines"
      },
      "then": {
        "effect": "audit"
      }
    }
  }
}
```

---

[← Secrets Management](./03-secrets-management-vault) | [→ GitOps Fundamentals](../../18-gitops/01-gitops-fundamentals) | [🏠 الرئيسية](/)
