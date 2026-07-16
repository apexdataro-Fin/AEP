---
sidebar_position: 1
title: "Terraform — البنية التحتية ككود"
description: "كل شيء عن Terraform: HCL، Providers، State، Modules، Workspaces، وسيناريوهات الإنتاج الحقيقية."
---

# Terraform — البنية التحتية ككود

> **"لا تنشئ موارد سحابية بالنقر في البوابة. اكتبها ككود. كل شيء يُبنى بنقرة واحدة ويمكن إعادة بنائه في أي وقت."**

## لماذا Infrastructure as Code؟

| المشكلة | بدون IaC | مع Terraform |
|---|---|---|
| **إعادة البناء** | ساعات من النقر اليدوي | `terraform apply` |
| **معرفة ما في الإنتاج** | "أعتقد أن لدينا ٤ خوادم..." | ملفات `.tf` = الحقيقة |
| **مراجعة التغييرات** | "ماذا غيرت بالأمس؟" | Git history |
| **بيئات متعددة** | كل بيئة مختلفة | نفس الكود، متغيرات مختلفة |
| **التعافي من الكوارث** | أسابيع | ساعات |

## أول ملف Terraform — بناء شبكة

```hcl
# main.tf
terraform {
  required_version = ">= 1.5"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
  # لا تضع مفاتيح هنا! استخدم:
  # export ARM_CLIENT_ID=...
  # export ARM_CLIENT_SECRET=...
  # export ARM_TENANT_ID=...
}

resource "azurerm_resource_group" "main" {
  name     = "cloudnova-prod-rg"
  location = "West Europe"
}

resource "azurerm_virtual_network" "main" {
  name                = "cloudnova-vnet"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "app" {
  name                 = "app-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "db" {
  name                 = "db-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

# مخرجات — لاستخدامها في ملفات أخرى
output "vnet_id" {
  value = azurerm_virtual_network.main.id
}

output "app_subnet_id" {
  value = azurerm_subnet.app.id
}
```

## الدورة الأساسية — الأوامر الأربعة

```bash
terraform init      # يحمّل الـ Providers، يجهّز الـ Backend
terraform fmt       # ينسق الملفات — دائماً قبل commit
terraform validate  # يتحقق من صحة التركيب
terraform plan      # يعرض ما سيتغير — لا تغيير حقيقي
terraform apply     # ينفذ التغييرات

# بعد الانتهاء
terraform destroy   # يحذف كل شيء — استخدمه بحذر!
```

### ماذا يحدث في كل خطوة؟

| الأمر | ماذا يفعل | كم يستغرق |
|---|---|---|
| `init` | يحمّل azurerm provider (~100MB)، يجهّز backend | ١٠-٣٠ ثانية |
| `plan` | يقارن `.tf` بالحالة الفعلية في Azure | ٣٠-١٢٠ ثانية |
| `apply` | يستدعي Azure API لإنشاء/تعديل/حذف الموارد | ١-١٥ دقيقة |

## إدارة الحالة — أهم درس

```hcl
# ⚠️ لا ترفع terraform.tfstate لـ Git أبداً!

# الحل: Azure Storage Backend
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstatecloudnova"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
```

### ماذا يخزن الـ State؟

- كل Resource ID (حتى يعرف ماذا يدير)
- كل Attribute (حتى يعرف ماذا تغير)
- التبعيات بين الموارد
- **أحياناً أسرار** (لهذا لا يُرفع لـ Git!)

## المتغيرات — Don't Repeat Yourself

```hcl
# variables.tf
variable "environment" {
  description = "بيئة النشر"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "يجب أن تكون dev أو staging أو prod"
  }
}

variable "vm_count" {
  type    = number
  default = 1
}

variable "vm_size" {
  type = map(string)
  default = {
    dev     = "Standard_B1s"
    staging = "Standard_B2s"
    prod    = "Standard_B2ms"
  }
}

# استخدمها
resource "azurerm_linux_virtual_machine" "web" {
  count = var.vm_count
  name  = "web-${var.environment}-${count.index}"
  size  = var.vm_size[var.environment]
  # ...
}
```

```bash
# قيم من ملف
terraform apply -var-file="prod.tfvars"

# قيم من سطر الأوامر
terraform apply -var="environment=prod" -var="vm_count=3"

# قيم من متغيرات البيئة
export TF_VAR_environment=prod
terraform apply
```

## الوحدات — Modules

```hcl
# modules/web-server/main.tf
resource "azurerm_linux_virtual_machine" "main" {
  count               = var.instance_count
  name                = "${var.name}-${count.index}"
  resource_group_name = var.resource_group_name
  location            = var.location
  size                = var.vm_size
  # ...
}

# استخدم الوحدة ٣ مرات
module "web_dev" {
  source          = "./modules/web-server"
  name            = "web-dev"
  instance_count  = 1
  vm_size         = "Standard_B1s"
  environment     = "dev"
}

module "web_prod" {
  source          = "./modules/web-server"
  name            = "web-prod"
  instance_count  = 3
  vm_size         = "Standard_B2ms"
  environment     = "prod"
}
```

## سيناريو CloudNova: كارثة State

> **الموقف:** `terraform apply` يريد **حذف** قاعدة بيانات الإنتاج!

```bash
Plan: 2 to add, 0 to change, 1 to destroy.
# azurerm_postgresql_database.main must be replaced
```

**لماذا؟** شخص عدّل `name` في الملف. Terraform لا يعرف أن "قاعدة البيانات تغير اسمها". يرى: "احذف القديم، أنشئ جديد".

**الحلول:**

1. **أعد الاسم القديم فوراً.**
2. استخدم `terraform state mv` لنقل المورد القديم للاسم الجديد
3. أضف حماية للموارد الحرجة:

```hcl
resource "azurerm_postgresql_database" "main" {
  name = "cloudnova-db"
  # ...
  lifecycle {
    prevent_destroy = true   # ⚠️ ارفض الحذف
  }
}
```

## نصائح الإنتاج

1. **State في Azure Storage دائماً.** مع قفل `lease` لمنع التزامن
2. **Plan قبل كل Apply.** وراجع الخطة بعناية
3. **لا تستخدم Terraform لإدارة الأسرار.** استخدم Key Vault مع data source
4. **فصل State.** كل بيئة لها state خاص بها
5. **CI/CD للـ Terraform.** لا تشغل apply من جهازك الشخصي
6. **Sentinel/OPA Policies.** امنع إنشاء موارد غير مسموحة

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
