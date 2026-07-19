---
sidebar_position: 3
title: "Backstage Developer Portal"
description: "Backstage by Spotify — Developer Portal، Service Catalog، TechDocs."
---

# Backstage Developer Portal

> "Backstage هو Spotify for Developers. مكان واحد لكل شيء."

## 🎯 أهداف التعلم

- فهم Backstage architecture
- Service Catalog
- Software Templates (scaffolding)
- TechDocs

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Backstage Components

```yaml
# catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: cloudnova-api
  description: CloudNova REST API
  annotations:
    github.com/project-slug: cloudnova/api
    backstage.io/techdocs-ref: dir:.
spec:
  type: service
  lifecycle: production
  owner: platform-team
  providesApis:
    - cloudnova-api
```

### Software Template

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: nodejs-service
spec:
  parameters:
    - title: Service Details
      properties:
        name:
          type: string
        description:
          type: string
  steps:
    - id: fetch-base
      action: fetch:template
      input:
        url: ./template
    - id: publish
      action: publish:github
      input:
        repoUrl: github.com?owner=cloudnova&repo={{ parameters.name }}
    - id: register
      action: catalog:register
      input:
        catalogInfoPath: /catalog-info.yaml
```

---

[← Internal Developer Platform](./02-internal-developer-platform) | [→ Monitoring](../../20-monitoring/01-monitoring-fundamentals) | [🏠 الرئيسية](/)
