---
sidebar_position: 1
title: "Terraform Fundamentals"
description: "Infrastructure as Code with Terraform: HCL syntax, providers, state management."
---

# Terraform Fundamentals

Infrastructure as Code with Terraform: HCL syntax, providers, state management.

## What You Will Learn

This module covers key concepts, hands-on exercises, and real CloudNova scenarios to build your production engineering skills.

## What is Terraform?

Terraform defines infrastructure as code using HashiCorp Configuration Language (HCL).

```hcl
resource "azurerm_resource_group" "main" {
  name     = "cloudnova-prod-rg"
  location = "West Europe"
}

resource "azurerm_virtual_network" "main" {
  name                = "cloudnova-vnet"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  address_space       = ["10.0.0.0/16"]
}
```

## State Management

Terraform stores infrastructure state in a **state file**. Never commit it to Git! Use remote backends:

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstatecloudnova"
    container_name       = "tfstate"
  }
}
```

## Workflow

```bash
terraform init      # Initialize, download providers
terraform plan      # Preview changes
terraform apply     # Apply changes
terraform destroy   # Remove everything
```

## CloudNova Exercise

Apply what you learned: review the key concepts above and identify how they apply to a real production cloud environment.

---

[← Back to Module](index.md) | [🏠 Home](/)
