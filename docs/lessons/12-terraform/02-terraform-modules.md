---
sidebar_position: 2
title: "Terraform Modules & Workspaces"
description: "بناء وحدات قابلة لإعادة الاستخدام، إدارة بيئات متعددة، وأفضل ممارسات الإنتاج."
---

# Terraform Modules & Workspaces

> "الـ Module الجيد مثل دالة برمجية جيدة: يفعل شيئاً واحداً، ويفعله جيداً."

## 🎯 أهداف التعلم

- بناء Module احترافي قابل لإعادة الاستخدام
- إدارة بيئات dev/staging/prod باستخدام Workspaces
- فهم Terraform Registry ومشاركة الوحدات
- التعامل مع Secrets بأمان
- استراتيجيات State للإنتاج

---

## ١. لماذا Modules؟

### 🔹 المشكلة

لديك ٣ بيئات (dev, staging, prod) وكل منها يحتاج:

- Virtual Network
- Subnet
- AKS Cluster
- PostgreSQL Database

بدون Modules، ستنسخ ~٢٠٠ سطر من الكود ٣ مرات. مع Modules:

```hcl
# بدلاً من ٦٠٠ سطر، تكتب:
module "networking" {
  source = "./modules/networking"
  environment = "production"
  cidr_block   = "10.0.0.0/16"
}

module "aks" {
  source = "./modules/aks"
  environment = "production"
  node_count  = 5
  vm_size     = "Standard_D4s_v5"
}
```

---

## ٢. بناء Module احترافي

### 🔹 هيكل الـ Module

```
modules/aks/
├── main.tf          # الموارد الأساسية
├── variables.tf     # المتغيرات المُدخلة
├── outputs.tf       # المخرجات
├── versions.tf      # إصدارات providers
└── README.md        # توثيق الوحدة
```

### 🔹 main.tf: الموارد

```hcl
# modules/aks/main.tf
resource "azurerm_kubernetes_cluster" "this" {
  name                = "${var.environment}-${var.cluster_name}"
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = "${var.environment}-${var.cluster_name}"

  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = var.vm_size
    vnet_subnet_id = var.subnet_id
  }

  identity {
    type = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.aks.id]
  }

  # 🔒 الأمان: RBAC مع Azure AD
  azure_active_directory_role_based_access_control {
    managed            = true
    tenant_id          = var.tenant_id
    admin_group_object_ids = var.admin_group_ids
  }

  # 📊 المراقبة
  oms_agent {
    log_analytics_workspace_id = var.log_analytics_workspace_id
  }

  tags = var.tags
}
```

### 🔹 variables.tf: المتغيرات

```hcl
# modules/aks/variables.tf
variable "environment" {
  description = "اسم البيئة (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "يجب أن تكون البيئة dev, staging, أو prod"
  }
}

variable "cluster_name" {
  description = "اسم الكلستر"
  type        = string
  default     = "aks-cluster"
}

variable "node_count" {
  description = "عدد العقد"
  type        = number
  default     = 2

  validation {
    condition     = var.node_count >= 1 && var.node_count <= 100
    error_message = "عدد العقد يجب أن يكون بين 1 و 100"
  }
}

variable "vm_size" {
  description = "حجم الآلة الافتراضية"
  type        = string
  default     = "Standard_D2s_v5"
}

variable "subnet_id" {
  description = "معرف الـ Subnet"
  type        = string
  # لا قيمة افتراضية - إجباري
}

variable "admin_group_ids" {
  description = "مجموعات Azure AD المسموح لها بالوصول"
  type        = list(string)
  default     = []
  sensitive   = false
}

variable "log_analytics_workspace_id" {
  description = "معرف Log Analytics للمراقبة"
  type        = string
  default     = null
}

variable "tags" {
  description = "وسوم الموارد"
  type        = map(string)
  default     = {}
}

variable "location" {
  description = "منطقة Azure"
  type        = string
}

variable "resource_group_name" {
  description = "اسم Resource Group"
  type        = string
}

variable "tenant_id" {
  description = "معرف Azure AD Tenant"
  type        = string
}
```

### 🔹 outputs.tf: المخرجات

```hcl
# modules/aks/outputs.tf
output "cluster_id" {
  description = "معرف AKS Cluster"
  value       = azurerm_kubernetes_cluster.this.id
}

output "cluster_name" {
  description = "اسم الكلستر"
  value       = azurerm_kubernetes_cluster.this.name
}

output "kube_config" {
  description = "kubeconfig للاتصال بالكلستر"
  value       = azurerm_kubernetes_cluster.this.kube_config_raw
  sensitive   = true
}

output "fqdn" {
  description = "FQDN للـ API Server"
  value       = azurerm_kubernetes_cluster.this.fqdn
}

output "node_resource_group" {
  description = "Resource Group الخاصة بالعقد"
  value       = azurerm_kubernetes_cluster.this.node_resource_group
}
```

### 🔹 versions.tf

```hcl
# modules/aks/versions.tf
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}
```

---

## ٣. استخدام الـ Module في بيئات مختلفة

### 🔹 هيكل المشروع

```
environments/
├── dev/
│   ├── main.tf
│   └── terraform.tfvars
├── staging/
│   ├── main.tf
│   └── terraform.tfvars
└── prod/
    ├── main.tf
    └── terraform.tfvars
```

### 🔹 dev/main.tf

```hcl
# environments/dev/main.tf
module "aks_dev" {
  source = "../../modules/aks"

  environment = "dev"
  location    = "westeurope"
  resource_group_name = "rg-cloudnova-dev"
  node_count  = 1
  vm_size     = "Standard_B2s_v5"
  subnet_id   = module.networking.subnet_id
  admin_group_ids = ["group-devops-team"]
  tenant_id   = var.tenant_id
  tags = {
    Environment = "Development"
    CostCenter  = "Engineering"
    ManagedBy   = "Terraform"
  }
}
```

### 🔹 prod/main.tf

```hcl
# environments/prod/main.tf
module "aks_prod" {
  source = "../../modules/aks"

  environment = "prod"
  location    = "westeurope"
  resource_group_name = "rg-cloudnova-prod"
  node_count  = 5
  vm_size     = "Standard_D4s_v5"
  subnet_id   = module.networking.subnet_id
  admin_group_ids = ["group-sre-team"]
  tenant_id   = var.tenant_id
  log_analytics_workspace_id = module.monitoring.workspace_id
  tags = {
    Environment = "Production"
    CostCenter  = "Engineering"
    ManagedBy   = "Terraform"
    Criticality = "High"
  }
}
```

---

## ٤. Workspaces: بديل للـ Directory Structure

### 🔹 الطريقة الأولى: Directory Structure (موصى بها للإنتاج)

```
environments/dev/   → Terraform State منفصل
environments/prod/  → Terraform State منفصل
```

**المميزات**: عزل كامل، آمن، كل بيئة لها State مستقل.

### 🔹 الطريقة الثانية: Workspaces

```bash
# إنشاء workspace جديد
terraform workspace new dev
terraform workspace new prod

# التبديل بين البيئات
terraform workspace select dev
terraform plan

terraform workspace select prod
terraform plan
```

### 🔹 استخدام workspace في الكود

```hcl
# main.tf
locals {
  environment = terraform.workspace
  node_count = {
    dev     = 1
    staging = 2
    prod    = 5
  }
  vm_size = {
    dev     = "Standard_B2s_v5"
    staging = "Standard_D2s_v5"
    prod    = "Standard_D4s_v5"
  }
}

module "aks" {
  source     = "./modules/aks"
  environment = local.environment
  node_count  = local.node_count[local.environment]
  vm_size     = local.vm_size[local.environment]
  # ...
}
```

### ⚠️ متى تستخدم Workspaces؟

- ✅ مشاريع صغيرة أو متوسطة
- ✅ بيئات متشابهة تماماً
- ❌ إنتاج حقيقي (يُفضل State منفصل تماماً)

---

## ٥. Terraform Registry: استخدام ونشر

### 🔹 استخدام Module من Registry

```hcl
# بدلاً من كتابة VNet بنفسك
module "vnet" {
  source  = "Azure/vnet/azurerm"
  version = "4.1.0"

  resource_group_name = "rg-cloudnova"
  vnet_location       = "westeurope"
  address_space       = ["10.0.0.0/16"]
  subnet_prefixes     = ["10.0.1.0/24", "10.0.2.0/24"]
  subnet_names        = ["aks-subnet", "db-subnet"]
}
```

### 🔹 نشر Module خاص بمؤسستك

```hcl
# استخدم Git كمصدر
module "aks" {
  source = "git::https://github.com/CloudNova/terraform-azurerm-aks.git?ref=v2.1.0"
  # ...
}

# أو من Private Registry (Terraform Cloud/Enterprise)
module "aks" {
  source  = "app.terraform.io/CloudNova/aks/azurerm"
  version = "~> 2.0"
}
```

---

## ٦. التعامل مع Secrets بأمان

### 🔹 ❌ لا تفعل هذا أبداً

```hcl
# خطير جداً!
variable "db_password" {
  default = "SuperSecret123!"  # موجود في Git!
}
```

### 🔹 ✅ استخدم Azure Key Vault

```hcl
# ١. أنشئ Key Vault مسبقاً (أو في pipeline منفصل)
data "azurerm_key_vault" "shared" {
  name                = "kv-cloudnova-shared"
  resource_group_name = "rg-cloudnova-shared"
}

data "azurerm_key_vault_secret" "db_password" {
  name         = "database-password"
  key_vault_id = data.azurerm_key_vault.shared.id
}

# ٢. استخدم القيمة بدون كشفها
resource "azurerm_postgresql_server" "main" {
  administrator_login_password = data.azurerm_key_vault_secret.db_password.value
  # ...
}
```

### 🔹 في CI/CD Pipeline

```yaml
# GitHub Actions
- name: Terraform Plan
  run: terraform plan
  env:
    ARM_CLIENT_ID: ${{ secrets.ARM_CLIENT_ID }}
    ARM_CLIENT_SECRET: ${{ secrets.ARM_CLIENT_SECRET }}
    ARM_SUBSCRIPTION_ID: ${{ secrets.ARM_SUBSCRIPTION_ID }}
    ARM_TENANT_ID: ${{ secrets.ARM_TENANT_ID }}
```

---

## ٧. State Management للإنتاج

### 🔹 استخدم Remote State

```hcl
# backend.tf
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "stcloudnovaterraform"
    container_name       = "tfstate"
    key                  = "production.terraform.tfstate"
  }
}
```

### 🔹 قفل الـ State (Locking)

Azure Storage Account يدعم القفل تلقائياً عبر Blob Leases. لن يتمكن شخصان من تعديل الـ State في نفس الوقت.

```bash
# إذا حاولت plan أثناء plan آخر:
# Error: Error acquiring the state lock
# state blob is already locked
```

### 🔹 استرجاع State سابق

```bash
# في Azure Portal → Storage Account → Container → Snapshots
# أو عبر Azure CLI
az storage blob list \
  --account-name stcloudnovaterraform \
  --container-name tfstate \
  --query "[?name=='production.terraform.tfstate'].{name:name, lastModified:properties.lastModified}" \
  --output table
```

---

## 🏢 سيناريو CloudNova: كارثة State

### الموقف

حذف أحد المهندسين Storage Account الـ State بالخطأ. كل البيئات ليس لها State الآن.

### كيف تعامل الفريق

```bash
# ١. استعادة الـ Storage Account من Soft Delete (موجود ١٤ يوماً)
az storage account restore \
  --name stcloudnovaterraform \
  --resource-group rg-terraform-state

# ٢. أو: Import الموارد الحالية
terraform import azurerm_resource_group.prod \
  /subscriptions/.../resourceGroups/rg-cloudnova-prod

# كرر import لكل مورد

# ٣. الوقاية: تفعيل Soft Delete + Backup
# في Azure Portal: Storage Account → Data Protection
# ✓ Enable soft delete for blobs
# ✓ Enable soft delete for containers
# ✓ Enable versioning
```

### الدرس المستفاد

1. **فعّل Soft Delete دائماً على Storage Account الـ State**
2. **خذ نسخة احتياطية دورية من الـ State**
3. **وثّق إجراءات استعادة الـ State**
4. **لا تضع State في نفس Resource Group مع الموارد**

---

## 🧠 Active Recall

1. كيف تبني Module قابلاً لإعادة الاستخدام لـ ٣ بيئات مختلفة؟
2. ما الفرق بين Directory Structure و Workspaces؟ ومتى تختار كل منهما؟
3. كيف تحمي Secrets في Terraform؟
4. ماذا تفعل إذا حُذف Storage Account الـ State؟
5. كيف تمنع شخصين من تعديل الـ State في نفس الوقت؟

---

## 📝 تمرين Feynman

اشرح Terraform Module لزميل جديد: تخيّل أنك تبني منازل. الـ Module هو "مخطط البيت القياسي". بدلاً من رسم المطبخ والحمام في كل مرة، تستخدم المخطط الجاهز وتُغيّر فقط التفاصيل (اللون، الحجم). البيئات (dev/prod) هي نفس المخطط لكن بأحجام مختلفة (بيت صغير للتجربة، قصر للإنتاج).

---

## 🃏 بطاقات تعليمية

| السؤال                    | الإجابة                                       |
| ------------------------- | --------------------------------------------- |
| أمر لإنشاء workspace جديد | `terraform workspace new <name>`              |
| أمر لاستيراد مورد موجود   | `terraform import <resource> <id>`            |
| متغير إجباري              | `variable "x" { type = string }` بدون default |
| مصدر Module من Git        | `source = "git::https://...?ref=v1.0"`        |
| مصدر Module من Registry   | `source = "Azure/aks/azurerm"`                |

---

## 🎯 أسئلة مقابلة

### س: كيف تدير Infrastructure as Code لـ ٣ بيئات؟

**الإجابة المثالية:**

1. Modules للكود المشترك
2. Directory Structure (environments/dev, staging, prod)
3. Remote State في Azure Storage Account منفصل
4. tfvars مختلفة لكل بيئة
5. CI/CD يمر عبر dev → staging → prod مع موافقات

### س: ما الفرق بين Terraform Module و Terraform Workspace؟

- **Module**: تغليف الكود لإعادة الاستخدام
- **Workspace**: عزل State لبيئات مختلفة (لكن ليس مكافئاً لـ State منفصل)
- في الإنتاج: استخدم State منفصل (backend مختلف) أبداً

---

<div align="center">

**[→ الدرس التالي: CI/CD Pipelines](/docs/lessons/cicd/cicd-pipelines)**

</div>
