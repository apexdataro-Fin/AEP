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

## 🧠 الطبقة البسيطة

تخيل أن الـ `terraform.tfstate` هو خريطة مدينتك. Terraform يقارن الخريطة بالواقع كل مرة. إذا ضاعت الخريطة، لا يعرف ماذا يدير. إذا استخدم شخصان نفس الخريطة في نفس الوقت، تحدث كارثة.

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

Azure Storage يوفر locking تلقائياً عبر blob leases:

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
```

### Import — استيراد موارد موجودة

```bash
terraform import azurerm_linux_virtual_machine.web_server \
  /subscriptions/xxx/resourceGroups/cloudnova/providers/Microsoft.Compute/virtualMachines/web01
```

---

## 🏛️ طبقة الإنتاج

### سيناريو CloudNova: State Corrupted

أحدهم شغّل `terraform apply` من جهازه المحلي بينما CI/CD كان يعمل. النتيجة: state فسدت.

**الإصلاح**:

1. استرجاع state من backup (storage account versioning)
2. `terraform refresh` لمزامنة state مع الواقع
3. تفعيل state locking

### حماية state

```bash
# Soft delete للـ storage account
az storage account blob-service-properties update \
  --account-name cloudnovatfstate \
  --enable-versioning true \
  --enable-delete-retention true \
  --delete-retention-days 7
```

---

## 🎨 طبقة المعماري

### Workspaces vs Separate Backends

|               | Workspaces             | Separate Backends |
| ------------- | ---------------------- | ----------------- |
| **العزل**     | ضعيف (نفس الـ storage) | قوي               |
| **التعقيد**   | منخفض                  | متوسط             |
| **الأفضل لـ** | بيئات متشابهة          | بيئات مختلفة جداً |

---

## 🛠️ تدريبات

### تمرين: نقل state محلي إلى Azure backend

### تمرين: جرب state locking

### تحدي: استورد VM موجودة يدوياً

---

## 📝 تقييم

### ✅ فحص المعرفة

1. لماذا state locking مهم؟
2. كيف تسترجع state من backup؟
3. متى تستخدم `terraform import`؟

### 🃏 بطاقات

| السؤال     | الإجابة                                        |
| ---------- | ---------------------------------------------- |
| tfstate    | ملف يحتوي حالة البنية التحتية                  |
| Backend    | مكان تخزين الـ state (Azure Storage, S3, etc.) |
| State Lock | منع التزامن على نفس الـ state                  |

---

## 🎤 مقابلة

1. **"ماذا تفعل لو فسدت state؟"** → استرجاع من backup + `terraform refresh`
2. **"كيف تمنع تعارضات state؟"** → Remote backend + locking + CI/CD فقط

---

[← Terraform Modules](./02-terraform-modules) | [→ Terraform CI/CD](./04-terraform-cicd-atlantis) | [🏠 الرئيسية](/)
