---
sidebar_position: 1
title: "Terraform من الصفر إلى الإنتاج"
description: "البنية التحتية ككود: HCL، المزودات Providers، إدارة الحالة State، والوحدات Modules."
---

# Terraform من الصفر إلى الإنتاج

> **"لا تنشئ موارد سحابية بالنقر في البوابة. اكتبها ككود. كل شيء يُبنى بنقرة واحدة."**

## ما هو Terraform؟

Terraform هي أداة **البنية التحتية ككود (IaC)** من HashiCorp. تكتب ما تريد (خوادم، شبكات، قواعد بيانات) في ملفات `.tf`، وتنفذ `terraform apply` — ويبنيها لك.

### لماذا Terraform وليس النقر في البوابة؟

| الطريقة          | المشكلة                                     |
| ---------------- | ------------------------------------------- |
| النقر في البوابة | لا تاريخ، لا مراجعة، لا تكرار، لا أتمتة     |
| Azure CLI / ARM  | صعب القراءة، طويل، خاص بـ Azure فقط         |
| **Terraform**    | مقروء، قابل للمراجعة، متعدد السحابات، مؤتمت |

## أول ملف Terraform

```hcl
# main.tf
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

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

resource "azurerm_subnet" "app" {
  name                 = "app-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}
```

## الدورة الأساسية

```bash
terraform init      # حمّل المزودات، جهّز بيئة العمل
terraform plan      # ماذا سيتغير؟ (معاينة — لا تغيير حقيقي)
terraform apply     # نفّذ التغييرات
terraform destroy   # احذف كل شيء (استخدمه بحذر!)
```

### ماذا يفعل كل أمر بالضبط؟

| الأمر      | ماذا يفعل                            | متى تستخدمه                 |
| ---------- | ------------------------------------ | --------------------------- |
| `init`     | يحمّل المزودات، يجهّز الـ backend    | أول مرة، بعد تغيير المزودات |
| `plan`     | يقارن الملفات بالواقع ويعرض الفروقات | قبل كل `apply`              |
| `apply`    | ينفذ التغييرات على السحابة           | بعد مراجعة الخطة            |
| `fmt`      | ينسق الملفات                         | قبل commit                  |
| `validate` | يتأكد من صحة التركيب                 | في CI/CD                    |

## إدارة الحالة — State Management

Terraform يحفظ حالة بنيتك التحتية في ملف **terraform.tfstate**. هذا الملف هو سجل كل شيء أنشأه Terraform.

### ⚠️ لا ترفع state لـ Git أبداً!

الـ state يحتوي على:

- كل أسماء الموارد ومعرفاتها
- أسرار وبيانات حساسة أحياناً
- بيانات قد تتعارض بين أعضاء الفريق

الحل: **Remote Backend**

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "tfstatecloudnova"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
```

## المتغيرات — لا تكرر القيم

```hcl
# variables.tf
variable "environment" {
  description = "بيئة النشر"
  type        = string
  default     = "dev"
}

variable "vm_count" {
  description = "عدد الخوادم"
  type        = number
  default     = 2
}

# استخدمها في main.tf
resource "azurerm_linux_virtual_machine" "web" {
  count               = var.vm_count
  name                = "web-${var.environment}-${count.index}"
  resource_group_name = azurerm_resource_group.main.name
  # ...
}
```

## الوحدات — Modules

عندما يتكرر نمط — ضعه في Module:

```
modules/
└── web-server/
    ├── main.tf        # موارد الخادم
    ├── variables.tf   # مدخلات الوحدة
    └── outputs.tf     # مخرجات الوحدة
```

```hcl
# استخدم الوحدة
module "web_server" {
  source          = "./modules/web-server"
  environment     = "prod"
  instance_count  = 3
  vm_size         = "Standard_B2s"
}
```

## سيناريو CloudNova: حادثة Terraform

> **الموقف:** `terraform apply` يريد حذف قاعدة بيانات الإنتاج!

```bash
# ماذا ترى في الخطة:
Plan: 2 to add, 0 to change, 1 to destroy.

# تمعّن في التفاصيل:
# azurerm_postgresql_database.main must be replaced
```

**لماذا؟** شخص عدّل `name` في الملف. Terraform يرى "المورد تغيّر اسمه = يجب حذف القديم وإنشاء جديد."

**الحل:**

1. أعد الاسم كما كان
2. استخدم `terraform state mv` لنقل الحالة
3. فعّل `prevent_destroy = true` على الموارد الحرجة:

```hcl
lifecycle {
  prevent_destroy = true
}
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
