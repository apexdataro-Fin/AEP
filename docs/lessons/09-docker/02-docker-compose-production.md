---
sidebar_position: 2
title: "Docker في الإنتاج"
description: "docker-compose للإنتاج، إدارة الأسرار، Health Checks، والمراقبة."
---

# Docker في الإنتاج

> **"docker run رائع للتطوير. للإنتاج، تحتاج docker-compose مُحسّناً."**

## docker-compose إنتاجي

```yaml
version: "3.8"
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@db:5432/cloudnova
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "1.0"
        reservations:
          memory: 256M
          cpus: "0.5"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## إدارة الأسرار

```bash
# لا تضع كلمات مرور في docker-compose.yml!
# استخدم Docker Secrets أو ملف .env خارج Git

# .env (في .gitignore)
DB_PASSWORD=SuperSecret123
REDIS_PASSWORD=RedisSecret456

# في docker-compose.yml:
# environment:
#   - DB_PASSWORD=${DB_PASSWORD}
```

## سيناريو CloudNova: الذاكرة تلتهم

> **الموقف:** حاوية API تستهلك ٢GB RAM وتُقتل بواسطة OOM Killer.

```yaml
# أضف حدوداً
deploy:
  resources:
    limits:
      memory: 512M    # أقصى حد
      cpus: "1.0"
    reservations:
      memory: 256M    # الحد الأدنى المضمون
```

---

[← الدرس السابق](docker-mastery) | [العودة للوحدة](index.md) | [🏠 الرئيسية](/)
