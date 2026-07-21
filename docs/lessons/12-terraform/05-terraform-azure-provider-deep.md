---
sidebar_position: 5
title: "Terraform Azure Provider بعمق"
description: "azurerm provider — كل ما تحتاجه لإدارة Azure بـ Terraform."
---

# Terraform Azure Provider بعمق

> "Terraform + Azure = بنية تحتية غير قابلة للكسر."

## 🎯 أهداف التعلم

- إتقان `azurerm` provider
- المصادقة مع Managed Identity
- الموارد المتقدمة: AKS، Front Door، Private Link
- ترقية provider versions بأمان

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Advanced

---

## 🏗️ المصادقة

```hcl
provider "azurerm" {
  features {}
  # المصادقة عبر Managed Identity (الأفضل)
  # لا secrets في الكود!
}
```

### AKS Cluster كامل

```hcl
resource "azurerm_kubernetes_cluster" "main" {
  name                = "cloudnova-aks"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "cloudnova"
  kubernetes_version  = "1.29"

  default_node_pool {
    name       = "default"
    node_count = 3
    vm_size    = "Standard_D2s_v3"
    vnet_subnet_id = azurerm_subnet.aks.id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    network_policy = "calico"
  }

  azure_active_directory_role_based_access_control {
    managed            = true
    azure_rbac_enabled = true
  }
}
```

### for_each vs count

```hcl
# ✅ for_each — آمن، لا يتغير عند إضافة عناصر
resource "azurerm_subnet" "subnets" {
  for_each = {
    web  = "10.0.1.0/24"
    app  = "10.0.2.0/24"
    data = "10.0.3.0/24"
  }
  name                 = each.key
  address_prefixes     = [each.value]
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_vnet.main.name
}
```

### Lifecycle Blocks

```hcl
resource "azurerm_key_vault" "main" {
  lifecycle {
    prevent_destroy = true  # ❌ لا تحذف أبداً!
  }
}

resource "azurerm_kubernetes_cluster" "main" {
  lifecycle {
    ignore_changes = [
      default_node_pool[0].node_count  # AKS autoscaler يدير هذا
    ]
  }
}
```

---

## 🏛️ طبقة الإنتاج

### سيناريو CloudNova: ترقية Provider

ترقية `azurerm` من 3.x إلى 4.x تطلبت:

1. قراءة changelog
2. `terraform plan` في بيئة staging
3. إصلاح deprecated resources
4. تطبيق في production

**الدرس**: ترقية provider ليست trivial. اختبرها أولاً.

### Terraform مع Managed Identity

```hcl
provider "azurerm" {
  features {}
  use_msi = true
  subscription_id = var.subscription_id
  tenant_id       = var.tenant_id
}
```

---

## 🛠️ تدريبات

### تمرين: حول `count` إلى `for_each`

### تحدي: أضف `lifecycle` blocks لمنع destructive changes

---

## 📝 تقييم

### ✅ فحص المعرفة

1. لماذا `for_each` أفضل من `count`؟
2. متى تستخدم `prevent_destroy`؟
3. كيف تصادق Terraform مع Azure؟

### 🃏 بطاقات

| السؤال            | الإجابة                            |
| ----------------- | ---------------------------------- |
| `for_each`        | تكرار آمن — لا يتغير ترتيب العناصر |
| `prevent_destroy` | يمنع حذف المورد                    |
| Managed Identity  | أفضل طريقة للمصادقة على Azure      |

---

## 🎤 مقابلة

1. **"كيف تنظم Terraform code لمؤسسة؟"** → Modules + for_each + lifecycle + CI/CD
2. **"كيف تدير 50 Azure subscription بـ Terraform؟"** → `provider` aliases + separate state files

---

## 📚 مراجع

| النوع     | الرابط                                          |
| --------- | ----------------------------------------------- |
| درس مرتبط | [Terraform CI/CD](./04-terraform-cicd-atlantis) |
| شهادة     | Terraform Associate                             |

---

[← Terraform CI/CD](./04-terraform-cicd-atlantis) | [→ Git Fundamentals](../../13-git/01-git-fundamentals) | [🏠 الرئيسية](/)
