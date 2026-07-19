---
sidebar_position: 2
title: "Azure SDK for Python"
description: "azure-sdk-for-python، azure-identity، azure-mgmt-compute — إدارة Azure برمجياً."
---

# Azure SDK for Python

> "كل شيء في Azure له API. إذا كان بإمكانك كتابة Python، يمكنك أتمتة Azure بالكامل."

## 🎯 أهداف التعلم

- المصادقة باستخدام DefaultAzureCredential
- إدارة VMs، Storage، Networking عبر Python
- أتمتة النشر مع Azure SDK
- استخدام Azure CLI vs SDK: متى تستخدم ماذا؟

## ⏱️ الوقت المقدر: 45 دقيقة | المستوى: Intermediate

---

## 🏗️ الطبقة الأساسية

### المصادقة

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.resource import ResourceManagementClient

credential = DefaultAzureCredential()  # يحاول: Managed Identity > CLI > VS Code > Interactive
subscription_id = "your-subscription-id"

compute_client = ComputeManagementClient(credential, subscription_id)
```

### إدارة Virtual Machines

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
                "ssh": {
                    "public_keys": [{"path": "/home/cloudnova/.ssh/authorized_keys", "key_data": "ssh-rsa AAA..."}]
                }
            }
        },
        "network_profile": {
            "network_interfaces": [{"id": "/subscriptions/.../nic/web01-nic"}]
        }
    }
)
vm = async_vm.result()
print(f"VM created: {vm.name}")
```

### قائمة بكل الموارد في اشتراك

```python
from azure.mgmt.resource import ResourceManagementClient

resource_client = ResourceManagementClient(credential, subscription_id)

for resource in resource_client.resources.list():
    print(f"{resource.name:40} | {resource.type:60} | {resource.location}")
```

### Storage Account Management

```python
from azure.mgmt.storage import StorageManagementClient
from azure.storage.blob import BlobServiceClient

storage_client = StorageManagementClient(credential, subscription_id)

# إنشاء Storage Account
storage_client.storage_accounts.begin_create(
    "cloudnova-prod",
    "cloudnovadiag",
    {
        "sku": {"name": "Standard_LRS"},
        "kind": "StorageV2",
        "location": "westeurope",
        "enable_https_traffic_only": True,
        "minimum_tls_version": "TLS1_2"
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

## 🛠️ تدريبات

### تمرين: سكربت Inventory كامل

اكتب سكربت يجمع معلومات عن كل الموارد في اشتراك Azure ويصدرها كـ CSV.

### تحدي: أتمتة النشر

أنشئ سكربت ينشر بيئة كاملة: VNet + Subnet + NSG + VM + Storage Account + SQL Database دفعة واحدة.

---

## 🎤 مقابلة

1. **"متى تستخدم Azure CLI vs Python SDK؟"**
2. **"كيف تدير secrets في كود الأتمتة؟"**

---

[← Python Cloud Automation](./01-python-cloud-automation) | [→ Python Testing & CI/CD](./03-python-testing-cicd) | [🏠 الرئيسية](/)
