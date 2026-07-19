---
sidebar_position: 2
title: "Azure SDK for Python"
description: "azure-sdk-for-python، azure-identity، azure-mgmt-compute — إدارة Azure برمجياً."

# Azure SDK for Python

> "كل شيء في Azure له API. إذا كان بإمكانك كتابة Python، يمكنك أتمتة Azure بالكامل."

## 🎯 أهداف التعلم

- المصادقة باستخدام DefaultAzureCredential
- إدارة VMs، Storage، Networking عبر Python
- أتمتة النشر مع Azure SDK
- استخدام Azure CLI vs SDK: متى تستخدم ماذا؟

## ⏱️ الوقت المقدر: 45 دقيقة | المستوى: Intermediate

---

## 🧠 الطبقة البسيطة

تخيل أن Azure Portal هو جهاز تحكم عن بُعد. كل نقرة في الـ portal ترسل API call. الـ Python SDK يتيح لك إرسال هذه الـ API calls من الكود — مما يعني يمكنك أتمتة أي شيء!

---

## ١. المصادقة

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.resource import ResourceManagementClient

# DefaultAzureCredential يحاول:
# 1. Managed Identity (إذا كنت على Azure)
# 2. Azure CLI credentials
# 3. VS Code credentials
# 4. Interactive browser login
credential = DefaultAzureCredential()
subscription_id = "your-subscription-id"

compute_client = ComputeManagementClient(credential, subscription_id)
```

### أفضل ممارسات المصادقة

| البيئة | أفضل طريقة |
|--------|-----------|
| **Development** | `az login` + DefaultAzureCredential |
| **CI/CD** | Service Principal + Environment Variables |
| **Production (Azure)** | Managed Identity |
| **Production (خارج Azure)** | Certificate-based auth |

---

## ٢. إدارة Virtual Machines

```python
# إنشاء VM
async_vm = compute_client.virtual_machines.begin_create_or_update(
    resource_group_name="cloudnova-prod",
    vm_name="web-server-01",
    parameters={
        "location": "westeurope",
        "hardware_profile": {"vm_size": "Standard_B2s"},
        "storage_profile": {
            "image_reference": {
                "publisher": "Canonical",
                "offer": "UbuntuServer",
                "sku": "22.04-LTS",
                "version": "latest"
            }
        },
        "os_profile": {
            "computer_name": "web01",
            "admin_username": "cloudnova",
            "linux_configuration": {
                "disable_password_authentication": True,
                "ssh": {"public_keys": [{
                    "path": "/home/cloudnova/.ssh/authorized_keys",
                    "key_data": "ssh-rsa AAA..."
                }]}
            }
        },
        "network_profile": {
            "network_interfaces": [{"id": "/subscriptions/.../nic/web01-nic"}]
        }
    }
)
vm = async_vm.result()
print(f"✅ VM created: {vm.name} | Size: {vm.hardware_profile.vm_size}")
```

### قائمة بكل الموارد

```python
resource_client = ResourceManagementClient(credential, subscription_id)

for resource in resource_client.resources.list():
    print(f"{resource.name:40} | {resource.type:60} | {resource.location}")
```

### Storage Account Management

```python
from azure.mgmt.storage import StorageManagementClient
from azure.storage.blob import BlobServiceClient

storage_client = StorageManagementClient(credential, subscription_id)

# إنشاء Storage Account بأمان
storage_client.storage_accounts.begin_create(
    "cloudnova-prod",
    "cloudnovadiag",
    {
        "sku": {"name": "Standard_LRS"},
        "kind": "StorageV2",
        "location": "westeurope",
        "enable_https_traffic_only": True,
        "minimum_tls_version": "TLS1_2",
        "allow_blob_public_access": False  # أمان!
    }
)

# رفع ملف إلى Blob
blob_service = BlobServiceClient(
    account_url="https://cloudnovadiag.blob.core.windows.net",
    credential=credential
)
container = blob_service.get_container_client("logs")
with open("app.log", "rb") as f:
    container.upload_blob("2026/app.log", f, overwrite=True)
```

---

## 🏛️ طبقة الإنتاج

### سيناريو CloudNova: سكربت Inventory

```python
#!/usr/bin/env python3
"""Azure Resource Inventory — يصدر كل الموارد إلى CSV"""
import csv
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

credential = DefaultAzureCredential()
client = ResourceManagementClient(credential, "your-sub-id")

with open("azure_inventory.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Name", "Type", "Location", "Resource Group"])
    
    for resource in client.resources.list():
        writer.writerow([
            resource.name,
            resource.type,
            resource.location,
            resource.id.split('/')[4]  # resource group
        ])

print(f"✅ Inventory exported: azure_inventory.csv")
```

### سيناريو CloudNova: تنظيف الموارد القديمة

```python
from datetime import datetime, timedelta, timezone

cutoff = datetime.now(timezone.utc) - timedelta(days=30)

for resource in client.resources.list(filter="tagName eq 'expires'"):
    expires = datetime.fromisoformat(resource.tags.get('expires', ''))
    if expires < cutoff:
        print(f"🗑️ Deleting expired resource: {resource.name}")
        client.resources.begin_delete_by_id(resource.id, "2024-03-01")
```

---

## 🎨 طبقة المعماري: CLI vs SDK vs REST

| | Azure CLI | Python SDK | REST API |
|---|----------|-----------|---------|
| **السرعة** | فوري | سريع | الأسرع |
| **Readability** | ممتاز | جيد | ضعيف |
| **Error Handling** | Bash محدود | try/except | HTTP codes |
| **أفضل لـ** | سكريبتات سريعة | أتمتة معقدة | Performance critical |

### قاعدة القرار

- **أقل من 50 سطراً + عمليات shell كثيرة** → Azure CLI (Bash)
- **منطق معقد + error handling + testing** → Python SDK
- **Performance critical + bulk operations** → Azure REST API

---

## 🛠️ تدريبات

### تمرين 1: سكربت Inventory كامل

اجمع معلومات عن كل الموارد في اشتراك Azure واصدرها كـ CSV.

### تمرين 2: سكربت تنظيف تلقائي

اسكربت يحذف Resource Groups أقدم من 30 يوماً (ما عدا production!)

### تحدي: أتمتة النشر

انشر بيئة كاملة: VNet + Subnet + NSG + VM + Storage Account + SQL Database دفعة واحدة عبر Python.

---

## 📝 تقييم

### ✅ فحص المعرفة
1. ما فائدة DefaultAzureCredential؟
2. كيف تختلف المصادقة في production عن development؟
3. متى تستخدم CLI vs SDK؟
4. كيف تتعامل مع errors في Azure SDK؟

### 🃏 بطاقات

| السؤال | الإجابة |
|--------|---------|
| DefaultAzureCredential | يحاول عدة طرق مصادقة تلقائياً |
| Managed Identity | أفضل طريقة لـ production على Azure |
| `begin_create_or_update` | عملية async — استخدم `.result()` للانتظار |

---

## 🎤 مقابلة

1. **"متى تستخدم Azure CLI vs Python SDK؟"**
   → CLI: سريع، بسيط. SDK: منطق معقد، error handling، testing.

2. **"كيف تدير secrets في كود الأتمتة؟"**
   → Managed Identity + Key Vault. لا secrets في الكود أبداً!

---

## 📚 مراجع

| النوع | الرابط |
|-------|--------|
| درس مرتبط | [Python Cloud Automation](./01-python-cloud-automation) |
| درس مرتبط | [Python Testing & CI/CD](./03-python-testing-cicd) |
| دليل | [Azure SDK for Python Docs](https://learn.microsoft.com/python/api/overview/azure/) |

---

[← Python Cloud Automation](./01-python-cloud-automation) | [→ Python Testing & CI/CD](./03-python-testing-cicd) | [🏠 الرئيسية](/)
