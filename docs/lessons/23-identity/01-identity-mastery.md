---
sidebar_position: 1
title: "Identity & Access Mastery"
description: "Azure AD, RBAC, PIM, managed identities, conditional access, MFA."
---

# Identity & Access Mastery

Azure AD, RBAC, PIM, managed identities, conditional access, MFA.

## What You Will Learn

This module covers key concepts, patterns, and real-world scenarios to build production-ready cloud engineering skills.

## Identity Hierarchy

```
Tenant (Azure AD)
├── Management Groups
│   ├── Subscriptions
│   │   ├── Resource Groups
│   │   │   └── Resources (RBAC applied here)
```

## PIM — Just-in-Time Access

Instead of permanent admin, use Privileged Identity Management:

- Request elevation when needed
- Auto-approved for 4 hours
- All elevations are logged and audited

## Managed Identities

No passwords. No keys. Azure handles rotation automatically.

- **System-assigned:** Tied to a specific resource
- **User-assigned:** Can be shared across resources

## CloudNova Exercise

Apply what you learned to a real production scenario at CloudNova, your virtual cloud engineering company.

---

[← Back to Module](index.md) | [🏠 Home](/)
