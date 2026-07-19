---
sidebar_position: 5
title: "Terraform Azure Provider بعمق"
description: "azurerm provider — كل ما تحتاجه لإدارة Azure بـ Terraform."

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

### أفضل الممارسات

- استخدم `for_each` بدلاً من `count` للتكرار
- استخدم `lifecycle` blocks لمنع destructive changes
- اختبر الترقيات في بيئة منفصلة أولاً

```hcl
resource "azurerm_key_vault" "main" {
  lifecycle {
    prevent_destroy = true  # ❌ لا تحذف أبداً!
  }
}
```

---

[← Terraform CI/CD](./04-terraform-cicd-atlantis) | [→ Git Fundamentals](../../13-git/01-git-fundamentals) | [🏠 الرئيسية](/)
