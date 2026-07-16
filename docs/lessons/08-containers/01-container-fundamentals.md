---
sidebar_position: 1
title: "Container Fundamentals"
description: "Containers vs VMs, images, layers, registries, and security."
---

# Container Fundamentals

Containers vs VMs, images, layers, registries, and security.

## What You Will Learn

This module covers key concepts, hands-on exercises, and real CloudNova scenarios to build your production engineering skills.

## Containers vs VMs

| Feature   | VM             | Container     |
| --------- | -------------- | ------------- |
| Boot time | Minutes        | Milliseconds  |
| Size      | GBs            | MBs           |
| Isolation | Full OS per VM | Process-level |
| Density   | 10s per host   | 100s per host |

## Container Image Layers

```dockerfile
FROM ubuntu:22.04          # Layer 1: Base OS
RUN apt-get update          # Layer 2: Packages
COPY app.py /app/           # Layer 3: Application
CMD ["python", "app.py"]  # Layer 4: Config
```

Each layer is cached. Only changed layers rebuild.

## CloudNova Exercise

Apply what you learned: review the key concepts above and identify how they apply to a real production cloud environment.

---

[← Back to Module](index.md) | [🏠 Home](/)
