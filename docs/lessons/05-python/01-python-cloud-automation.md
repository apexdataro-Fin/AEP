---
sidebar_position: 1
title: "Python لأتمتة السحابة"
description: "أتمتة Azure بـ Python: SDK، المصادقة، معالجة البيانات، والـ retry logic."
---

# Python لأتمتة السحابة

> **"Python هي سكين الجيش السويسري لمهندس السحابة. أتمتة، تحليل، تكامل — كلها ببضعة أسطر."**

## لماذا Python؟

| الميزة                  | لماذا تهمك                      |
| ----------------------- | ------------------------------- |
| **Azure SDK أول-class** | كل خدمة Azure لها SDK في Python |
| **مكتبات غنية**         | requests, pandas, pytest, rich  |
| **سهولة القراءة**       | تقرأ كودك بعد عام وتفهمه        |
| **مجتمع ضخم**           | أي مشكلة — أحد حلها قبلك        |

## المصادقة الآمنة — لا مفاتيح في الكود

```python
from azure.identity import DefaultAzureCredential

# سلسلة المحاولات:
# ١. متغيرات البيئة (AZURE_CLIENT_ID...)
# ٢. Managed Identity (على VM أو App Service)
# ٣. Azure CLI (az login)
# ٤. Interactive browser login

credential = DefaultAzureCredential()
# ✅ آمن — لا كلمات مرور في الكود
```

## إدارة الموارد

```python
from azure.mgmt.compute import ComputeManagementClient

compute = ComputeManagementClient(credential, subscription_id)

# قائمة بكل VMs بدون cost-center tag
untagged = []
for vm in compute.virtual_machines.list_all():
    tags = vm.tags or {}
    if "cost-center" not in tags:
        untagged.append({
            "name": vm.name,
            "resource_group": vm.id.split("/")[4],
            "location": vm.location,
            "size": vm.hardware_profile.vm_size,
        })

# تصدير لتقرير CSV
import csv
with open("untagged_vms.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "resource_group", "location", "size"])
    writer.writeheader()
    writer.writerows(untagged)

print(f"❌ {len(untagged)} VMs without cost-center tag")
```

## Retry Logic — التعامل مع فشل API

```python
from azure.core.exceptions import HttpResponseError, ServiceRequestError
import time

def with_retry(func, max_retries=3, backoff=2):
    """يعيد المحاولة مع انتظار أسي للفشل العابر"""
    for attempt in range(max_retries):
        try:
            return func()
        except ServiceRequestError:  # مشكلة شبكة
            if attempt < max_retries - 1:
                wait = backoff ** attempt
                print(f"⚠️ Network error, retrying in {wait}s...")
                time.sleep(wait)
            else:
                raise
        except HttpResponseError as e:
            if e.status_code == 429:  # Rate limited
                retry_after = int(e.response.headers.get("Retry-After", 30))
                print(f"⏳ Rate limited, waiting {retry_after}s...")
                time.sleep(retry_after)
            else:
                raise  # خطأ غير متوقع — لا تعيد المحاولة
```

## سيناريو CloudNova: تنظيف تلقائي

> **الموقف:** ١٥٠+ من الموارد المهملة في Azure — أقراص، IPs، لقطات.

```python
# سكريبت تنظيف شهري
orphaned_disks = []
for disk in compute.disks.list():
    if disk.managed_by is None:  # غير متصل بأي VM
        orphaned_disks.append(disk.name)

print(f"🗑 {len(orphaned_disks)} orphaned disks to delete")
# وفر ~$٤٠٠/شهر بمجرد تنظيف الموارد المهملة
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
