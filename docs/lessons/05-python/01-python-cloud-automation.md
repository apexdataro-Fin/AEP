---
sidebar_position: 1
title: "بايثون لأتمتة السحابة"
description: "اكتب سكريبتات Python لأتمتة مهام Azure: إدارة الموارد، المصادقة الآمنة، ومعالجة البيانات."
---

# بايثون لأتمتة السحابة

> **"Python هي اللغة العالمية لأتمتة السحابة. كل مهندس سحابة يحتاجها."**

## لماذا Python؟

| الميزة | لماذا تهم مهندس السحابة |
|---|---|
| **سهلة القراءة** | تقرأ الكود بعد ٦ أشهر وتفهمه |
| **مكتبات لكل شيء** | Azure SDK, AWS boto3, GCP SDK |
| **مجتمع ضخم** | أي مشكلة — أحد حلها قبلك |
| **متعددة الاستخدامات** | أتمتة، معالجة بيانات، AI |

## المصادقة — لا تضع مفاتيح في الكود

```python
from azure.identity import DefaultAzureCredential

# أبداً لا تفعل هذا:
# api_key = "sk-abc123..."  ← خطر!

# افعل هذا:
credential = DefaultAzureCredential()
# يحاول: متغيرات البيئة ← Managed Identity ← Azure CLI ← Interactive
```

## إدارة الموارد

```python
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.resource import ResourceManagementClient

# قائمة بكل الخوادم في كل الاشتراكات
compute = ComputeManagementClient(credential, subscription_id)

for vm in compute.virtual_machines.list_all():
    print(f"{vm.name:30s} | {vm.provisioning_state:15s} | {vm.location}")
```

## سيناريو CloudNova: تقرير الموارد غير الموسومة

```python
#!/usr/bin/env python3
"""تقرير الموارد التي تفتقد cost-center tag — CloudNova"""

from azure.mgmt.resource import ResourceManagementClient

credential = DefaultAzureCredential()
resource = ResourceManagementClient(credential, subscription_id)

untagged = []
for res in resource.resources.list():
    tags = res.tags or {}
    if "cost-center" not in tags:
        untagged.append({
            "name": res.name,
            "type": res.type,
            "resource_group": res.id.split("/")[4]
        })

print(f"❌ موارد بدون cost-center tag: {len(untagged)}")
for r in untagged[:10]:  # أول ١٠
    print(f"  - {r['name']} ({r['type']})")
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
