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

## 🧠 الطبقة البسيطة

تخيل أن بناء صورة Docker مثل خبز كعكة. في كل مرة تريد كعكة، لا تبدأ من الصفر — تستخدم وصفة (Dockerfile)، ومكونات (layers)، وفرن (CI/CD runner). الأتمتة تعني أن الكعكة تُخبز تلقائياً كلما غيرت الوصفة.

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

بهذا الترتيب: إذا تغير الكود فقط (وليس الـ dependencies)، الـ `npm ci` يستخدم cache فلا يُعاد تنفيذه. البناء من 5 دقائق إلى 30 ثانية!

---

## 🏛️ طبقة الإنتاج: Pipeline كامل

```yaml
name: Full Docker Pipeline
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm test

  build-scan:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v4
        with:
          load: true
          tags: cloudnova-api:${{ github.sha }}
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: cloudnova-api:${{ github.sha }}
          exit-code: "1"
          severity: CRITICAL,HIGH

  push:
    needs: build-scan
    runs-on: ubuntu-latest
    steps:
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: cloudnova.azurecr.io/api:${{ github.sha }}

  deploy:
    needs: push
    runs-on: ubuntu-latest
    steps:
      - run: az webapp config container set --name cloudnova-api --docker-custom-image cloudnova.azurecr.io/api:${{ github.sha }}
```

---

## 🎨 Layer Caching Deep Dive

```dockerfile
# الترتيب الصحيح (الأقل تغييراً أولاً):
FROM node:20-alpine                    # Layer 1: نادراً يتغير
RUN apk add --no-cache tini            # Layer 2: نادراً
WORKDIR /app                           # Layer 3: نادراً
COPY package*.json ./                  # Layer 4: يتغير مع dependencies
RUN npm ci                             # Layer 5: يتغير مع dependencies
COPY . .                               # Layer 6: يتغير مع كل commit
RUN npm run build                      # Layer 7: يتغير مع الكود
```

**القاعدة**: رتب الـ COPY من الأقل تغييراً إلى الأكثر تغييراً.

---

## 🛠️ تدريبات

### تمرين: Pipeline كامل

ابنِ GitHub Actions workflow:

1. يبني صورة Docker
2. يفحصها بـ Trivy
3. يدفعها إلى ACR
4. ينشرها إلى App Service

### تحدي: Multi-Architecture Build

ابنِ صور Docker لـ amd64 و arm64 معاً باستخدام `docker buildx`.

---

## 📝 تقييم

### ✅ فحص المعرفة

1. لماذا Multi-Stage Build مهم؟
2. كيف يعمل Layer Caching؟
3. ما فائدة `COPY package.json` قبل `COPY . .`؟
4. كيف تفحص الصورة قبل نشرها؟

### 🃏 بطاقات

| السؤال                    | الإجابة                           |
| ------------------------- | --------------------------------- |
| Multi-Stage Build         | فصل build عن runtime لصورة أصغر   |
| Layer Cache               | إعادة استخدام layers غير المتغيرة |
| GitHub Container Registry | `ghcr.io` — سجل صور GitHub        |
| ACR                       | Azure Container Registry          |

---

## 🎤 مقابلة

1. **"كيف تختصر وقت بناء Docker image من 10 دقائق إلى دقيقة؟"**
   → Layer caching + Multi-stage + `.dockerignore` + BuildKit

2. **"صمم CI/CD pipeline لصور Docker"**
   → Test → Build → Scan (Trivy) → Push → Deploy

---

## 📚 مراجع

| النوع     | الرابط                                                 |
| --------- | ------------------------------------------------------ |
| درس مرتبط | [Docker Security](./03-docker-security-best-practices) |
| درس مرتبط | [CI/CD Pipelines](../../15-cicd/01-cicd-pipelines)     |
| أداة      | [Docker Buildx](https://docs.docker.com/buildx/)       |

---

[← Docker Security](./03-docker-security-best-practices) | [→ Kubernetes Architecture](../../10-kubernetes/01-kubernetes-architecture) | [🏠 الرئيسية](/)
