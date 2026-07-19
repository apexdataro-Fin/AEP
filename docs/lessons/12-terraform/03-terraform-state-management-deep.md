---
sidebar_position: 3
title: "إدارة حالة Terraform بعمق"
description: "Terraform State، backend، locking، State Management — إدارة حالة Terraform بأمان."
---

# إدارة حالة Terraform بعمق

> "ملف `terraform.tfstate` هو أغلى ملف في البنية التحتية. عامله كذلك."

## 🎯 أهداف التعلم

- فهم state management في Terraform
- تكوين Azure Storage backend
- State locking لمنع التعارضات
- استيراد موارد موجودة (terraform import)

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Advanced

---

## 🏗️ Backend Configuration

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "cloudnova-tfstate"
    storage_account_name = "cloudnovatfstate"
    container_name       = "tfstate"
    key                  = "production.terraform.tfstate"
  }
}
```

### State Locking

Azure Storage يوفر locking تلقائياً عبر blob leases. إذا حاول شخصان تشغيل `terraform apply` في نفس الوقت، الثاني ينتظر أو يفشل:

```bash
terraform apply
# Acquiring state lock. This may take a few moments...
# Error: Error acquiring the state lock
# Someone else is already running terraform!
```

### Workspaces

```bash
terraform workspace new dev
terraform workspace new staging
terraform workspace select production
terraform workspace list
#   default
#   dev
#   staging
# * production
```

### Import — استيراد موارد موجودة

```bash
# استيراد VM موجودة إلى Terraform
terraform import azurerm_linux_virtual_machine.web_server \
  /subscriptions/xxx/resourceGroups/cloudnova/providers/Microsoft.Compute/virtualMachines/web01
```

---

## 🛠️ تدريب

1. نقل state محلي إلى Azure backend
2. جرب state locking بفتح terminal ثانٍ
3. استورد VM موجودة يدوياً

---

[← Terraform Modules](./02-terraform-modules) | [→ Terraform CI/CD](./04-terraform-cicd-atlantis) | [🏠 الرئيسية](/)
