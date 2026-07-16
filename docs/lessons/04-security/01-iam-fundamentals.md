---
sidebar_position: 1
title: "IAM & Security Fundamentals"
description: "Master Identity and Access Management: authentication, authorization, RBAC, managed identities, and the principle of least privilege."
---

# IAM & Security Fundamentals

Master Identity and Access Management: authentication, authorization, RBAC, managed identities, and the principle of least privilege.

## What You Will Learn

This module covers key concepts, hands-on exercises, and real CloudNova scenarios to build your production engineering skills.

## Authentication vs Authorization

| Concept        | Meaning                                         |
| -------------- | ----------------------------------------------- |
| Authentication | Who are you? (login, MFA, certificates)         |
| Authorization  | What can you do? (roles, permissions, policies) |

## Principle of Least Privilege

Give only the permissions needed, nothing more. No one has admin by default.

## RBAC in Azure

```bash
az role assignment create --assignee user@cloudnova.com \
  --role "Contributor" --resource-group prod-rg
```

## Managed Identities

Instead of passwords and keys, use managed identities:

```python
from azure.identity import ManagedIdentityCredential
credential = ManagedIdentityCredential()
```

## CloudNova Scenario

A developer accidentally deleted a production database. Root cause: they had Contributor role on the entire subscription. Fix: scope their access to specific resource groups with Reader + custom role.

## CloudNova Exercise

Apply what you learned: review the key concepts above and identify how they apply to a real production cloud environment.

---

[← Back to Module](index.md) | [🏠 Home](/)
