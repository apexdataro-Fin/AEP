---
sidebar_position: 2
title: "Terraform: الوحدات وبيئات العمل"
description: "Modules، Workspaces، Terragrunt، وهيكلة المشاريع الكبيرة."
---

# Terraform: الوحدات وبيئات العمل

> **"عندما يتجاوز مشروعك ١٠ موارد — حان وقت الـ Modules."**

## لماذا Modules؟

```hcl
# بدون Modules: تكرار × ٣ (dev, staging, prod)
# مع Modules: اكتب مرة، استخدم ٣ مرات

module "web_server_dev" {
  source     = "./modules/web-server"
  environment = "dev"
  vm_count    = 1
  vm_size     = "Standard_B1s"
}

module "web_server_prod" {
  source     = "./modules/web-server"
  environment = "prod"
  vm_count    = 3
  vm_size     = "Standard_B2s"
}
```

## هيكلة المشروع الكبير

```
terraform/
├── modules/
│   ├── networking/    # VNet, Subnets, NSG
│   ├── compute/       # VMs, Scale Sets
│   └── database/      # Azure SQL, Cosmos DB
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── prod/
└── global/
    ├── dns/
    └── monitoring/
```

## Workspaces

```bash
terraform workspace new dev
terraform workspace new prod

terraform workspace select dev
terraform apply     # يطبق على بيئة dev فقط

terraform workspace select prod
terraform apply     # يطبق على بيئة prod فقط
```

---

[← الدرس السابق](terraform-fundamentals) | [العودة للوحدة](index.md) | [🏠 الرئيسية](/)
