---
sidebar_position: 1
title: "Docker من الصفر إلى الإتقان"
description: "دليل Docker الكامل: Dockerfiles، Multi-stage Builds، docker-compose، Volumes، Networks، الأمان، وسيناريوهات الإنتاج."
---

# Docker من الصفر إلى الإتقان

> **"الحاويات غيّرت طريقة نشر البرمجيات. Docker جعلها في متناول الجميع. أتقنها ولن تخاف من 'الشغال عندي' مرة أخرى."**

## لماذا Docker؟

قبل Docker: "التطبيق شغال على جهازي — مش عارف ليه مش شغال على الخادم."
بعد Docker: الصورة واحدة. تشتغل في أي مكان. **بالضبط نفس البيئة.**

| المشكلة            | قبل Docker                                | بعد Docker               |
| ------------------ | ----------------------------------------- | ------------------------ |
| **بيئات مختلفة**   | "عندي Python 3.12، الخادم 3.9"            | الصورة تحمل كل شيء       |
| **تبعيات متضاربة** | "App A يحتاج Postgres 14، App B يحتاج 16" | كل حاوية معزولة          |
| **النشر**          | ٣٠ خطوة يدوية                             | `docker run`             |
| **التوسع**         | تثبيت على كل خادم                         | `docker run` على أي خادم |
| **التراجع**        | "كيف أرجع للإصدار السابق؟"                | `docker run old-image`   |

## المفاهيم الأساسية

| المفهوم        | المعنى                        | تشبيه واقعي                  |
| -------------- | ----------------------------- | ---------------------------- |
| **Dockerfile** | ملف نصي يصف كيفية بناء الصورة | وصفة الطبخ                   |
| **Image**      | قالب للقراءة فقط              | الوجبة الجاهزة المجمدة       |
| **Container**  | نسخة مشغّلة من الصورة         | الوجبة المسخنة الجاهزة للأكل |
| **Registry**   | مستودع لتخزين الصور           | السوبرماركت                  |
| **Volume**     | تخزين دائم للحاوية            | الثلاجة — تحفظ بعد الطبخ     |
| **Network**    | اتصال بين الحاويات            | طاولة الطعام                 |

## Dockerfile — من البسيط إلى المتقدم

### Dockerfile بسيط

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "app.py"]
```

```bash
docker build -t cloudnova-api:v1 .
docker run -d -p 8080:8080 --name api cloudnova-api:v1
curl http://localhost:8080/health
```

### Dockerfile إنتاجي — Multi-Stage Build

المشكلة: الصورة البسيطة حجمها ~٩٠٠MB. لماذا؟ كل أدوات البناء (compilers, headers) موجودة في الصورة النهائية.

الحل: Multi-stage build — ابْنِ في مرحلة، وشغّل في مرحلة أخف:

```dockerfile
# ===== المرحلة ١: البناء =====
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ===== المرحلة ٢: التشغيل =====
FROM python:3.12-slim
WORKDIR /app

# انسخ فقط المكتبات المثبتة من مرحلة البناء
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY . .

# أمان — لا تشغل كـ root
RUN useradd --create-home appuser
USER appuser

# فحص صحة
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080
CMD ["python", "app.py"]
```

النتيجة: صورة بحجم ~١٥٠MB بدلاً من ٩٠٠MB. **توفير ٨٣٪!**

## Docker Compose — تطبيقات متعددة الحاويات

```yaml
# docker-compose.yml — CloudNova API كاملة
version: "3.8"
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:${DB_PASSWORD}@db:5432/cloudnova
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "1.0"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: cloudnova
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: cloudnova
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cloudnova"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data
    restart: unless-stopped

volumes:
  pgdata:
  redisdata:
```

## Volumes — التخزين الدائم

```bash
# Bind Mount — للتطوير (ملفاتك المحلية داخل الحاوية)
docker run -v $(pwd)/app:/app -p 8080:8080 cloudnova-api

# Named Volume — للإنتاج (Docker يديره)
docker volume create pgdata
docker run -v pgdata:/var/lib/postgresql/data postgres:16

# tmpfs — للبيانات المؤقتة (في الذاكرة — أسرع)
docker run --tmpfs /tmp:rw,size=100M cloudnova-api
```

## Networks — اتصال الحاويات

```bash
# شبكة مخصصة
docker network create cloudnova-net

# شغّل الحاويات على نفس الشبكة
docker run -d --name db --network cloudnova-net postgres:16
docker run -d --name api --network cloudnova-net -p 8080:8080 cloudnova-api

# الآن api يصل لـ db باسم "db" فقط:
# postgresql://user:pass@db:5432/cloudnova
```

## أوامر يومية — ورقة الغش

| الأمر                                   | الغرض           |
| --------------------------------------- | --------------- |
| `docker build -t name:tag .`            | بناء صورة       |
| `docker run -d --name x -p 8080:80 img` | تشغيل حاوية     |
| `docker ps`                             | الحاويات النشطة |
| `docker ps -a`                          | كل الحاويات     |
| `docker logs -f container`              | سجلات مباشرة    |
| `docker exec -it container bash`        | ادخل الحاوية    |
| `docker inspect container`              | تفاصيل كاملة    |
| `docker stats`                          | استهلاك الموارد |
| `docker system prune -a`                | تنظيف كل شيء    |
| `docker image ls`                       | الصور المحلية   |
| `docker compose up -d`                  | تشغيل compose   |
| `docker compose down -v`                | إيقاف وتنظيف    |

## أمان Docker — ٥ قواعد ذهبية

1. **لا تشغّل كـ root.** `USER 1000` في نهاية Dockerfile
2. **صورة أساسية موثوقة.** استخدم `-slim` أو `-alpine` الرسمية
3. **لا تضع أسراراً في الصورة.** استخدم BuildKit secrets أو env vars
4. **افحص الصور بانتظام.** `docker scan` أو Trivy
5. **قلل مساحة الهجوم.** صورة أصغر = fewer packages = fewer CVEs

```bash
# فحص أمني
docker scan cloudnova-api:v1
# أو
trivy image cloudnova-api:v1
```

## سيناريو CloudNova: تحقيق في حادثة

> **الموقف:** الحاوية تعمل محلياً لكنها تخرج بعد ٣٠ ثانية في Azure.

### خطة التشخيص:

```bash
# ١. هل الحاوية شغالة؟
docker ps -a | grep api
# STATUS: Exited (1) 30 seconds ago

# ٢. شوف السجلات
docker logs api --tail 50
# FATAL: could not connect to database
# Connection refused at db:5432

# ٣. هل الشبكة صحيحة؟
docker network ls
# api على network: bridge (الافتراضية)
# db على network: cloudnova-net
# ← شبكتان مختلفتان! لا يمكنهما الاتصال

# ٤. الحل: نفس الشبكة
docker network connect cloudnova-net api
docker restart api

# ٥. راقب
docker logs -f api
# ✅ Connected to database successfully
```

### الدرس المستفاد:

```yaml
# استخدم docker-compose — يدير الشبكات تلقائياً
services:
  api:
    networks:
      - cloudnova-net
  db:
    networks:
      - cloudnova-net

networks:
  cloudnova-net:
    driver: bridge
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
