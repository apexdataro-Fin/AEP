---
sidebar_position: 1
title: "Python for Cloud Automation"
description: "Write Python scripts to manage Azure resources, handle authentication, and process cloud data."
---

# Python for Cloud Automation

Python is the universal language of cloud automation. Every cloud engineer needs it.

## What You Will Learn

- Use Azure SDK for Python to manage resources
- Handle authentication securely (no hardcoded keys!)
- Process JSON, CSV, and API responses
- Implement retry logic for cloud API failures

## Authentication — Never Hardcode Keys

```python
from azure.identity import DefaultAzureCredential

# Best practice: uses environment vars, managed identity, or CLI login
credential = DefaultAzureCredential()
```

The credential chain tries: Environment variables → Managed Identity → Azure CLI → Interactive

## List All VMs

```python
from azure.mgmt.compute import ComputeManagementClient

compute = ComputeManagementClient(credential, subscription_id)

for vm in compute.virtual_machines.list_all():
    print(f"{vm.name}: {vm.provisioning_state} - {vm.location}")
```

## Error Handling for Cloud APIs

```python
from azure.core.exceptions import HttpResponseError
import time

def retry_on_throttle(func, max_retries=3):
    for attempt in range(max_retries):
        try:
            return func()
        except HttpResponseError as e:
            if e.status_code == 429:  # Too Many Requests
                retry_after = int(e.response.headers.get("Retry-After", 30))
                print(f"Rate limited. Waiting {retry_after}s...")
                time.sleep(retry_after)
            else:
                raise
```

## CloudNova Exercise

Write a script that:

1. Lists all VMs across all subscriptions
2. Identifies VMs without a `cost-center` tag
3. Outputs a CSV report: `name, resource_group, subscription, status`

---

[← Back to Module](index.md) | [🏠 Home](/)
