---
sidebar_position: 1
title: "Azure Core Services"
description: "Explore Azure compute, storage, networking, and management services."
---

# Azure Core Services

Explore Azure compute, storage, networking, and management services.

## What You Will Learn

This module covers key concepts, hands-on exercises, and real CloudNova scenarios to build your production engineering skills.

## Core Services

| Service             | Category   | Use Case                  |
| ------------------- | ---------- | ------------------------- |
| Azure VM            | Compute    | Lift-and-shift workloads  |
| Azure App Service   | Compute    | Web apps, APIs            |
| Azure Functions     | Compute    | Serverless, event-driven  |
| Azure Blob Storage  | Storage    | Unstructured data         |
| Azure SQL Database  | Database   | Managed SQL Server        |
| Cosmos DB           | Database   | Global NoSQL              |
| Azure VNet          | Networking | Isolated private networks |
| Azure Load Balancer | Networking | Traffic distribution      |

## Azure CLI Essentials

```bash
az login
az group create --name prod-rg --location westeurope
az vm create --resource-group prod-rg --name web-01 \
  --image Ubuntu2204 --admin-username azureuser
az vm list --output table
```

## CloudNova Exercise

Apply what you learned: review the key concepts above and identify how they apply to a real production cloud environment.

---

[← Back to Module](index.md) | [🏠 Home](/)
