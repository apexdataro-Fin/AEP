---
sidebar_position: 4
title: "Docker في CI/CD"
description: "بناء ودفع صور Docker في GitHub Actions و Azure DevOps — أتمتة دورة حياة الحاويات."
---

# Docker في CI/CD

> "إذا كنت تبني صور Docker يدوياً في 2026، فأنت تفعلها بشكل خاطئ."

## 🎯 أهداف التعلم

- بناء صور Docker في GitHub Actions
- Multi-stage builds للصور الصغيرة
- Layer caching لتسريع البناء
- دفع الصور إلى ACR

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ GitHub Actions Pipeline

```yaml
name: Build and Push Docker Image
on:
  push:
    branches: [main]
jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to ACR
        uses: azure/docker-login@v1
        with:
          login-server: cloudnova.azurecr.io
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
      
      - name: Build and Push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            cloudnova.azurecr.io/api:latest
            cloudnova.azurecr.io/api:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Multi-Stage Build

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY . .
RUN npm run build

# Stage 2: Run (صورة صغيرة جداً)
FROM node:20-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**النتيجة**: صورة من 900MB إلى 120MB!

### Layer Caching

```dockerfile
# COPY package.json أولاً — إذا لم يتغير، تستخدم cache
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
```

---

## 🛠️ تدريب

ابنِ GitHub Actions workflow:
1. يبني صورة Docker
2. يفحصها بـ Trivy
3. يدفعها إلى ACR
4. ينشرها إلى App Service

---

[← Docker Security](./03-docker-security-best-practices) | [→ Kubernetes Architecture](../../10-kubernetes/01-kubernetes-architecture) | [🏠 الرئيسية](/)
