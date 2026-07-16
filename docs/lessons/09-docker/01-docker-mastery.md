---
sidebar_position: 1
title: "Docker من الصفر إلى الإنتاج"
description: "اكتب Dockerfiles إنتاجية، ابنِ صوراً صغيرة الحجم، واستخدم docker-compose لإدارة التطبيقات متعددة الحاويات."
---

# Docker من الصفر إلى الإنتاج

> **"الحاويات غيّرت طريقة نشر البرمجيات. Docker جعلها في متناول الجميع. أتقنها."**

## لماذا Docker؟

قبل Docker: "الشغال عندي مش شغال عندك." كل بيئة مختلفة — إصدارات مكتبات، أنظمة تشغيل، إعدادات.

بعد Docker: الصورة واحدة. تشتغل في جهازك، في الخادم، في السحابة. **بالضبط نفس الشيء.**

## المفاهيم الأساسية

| المفهوم        | المعنى                         | تشبيه                           |
| -------------- | ------------------------------ | ------------------------------- |
| **Image**      | قالب القراءة فقط               | وصفة الطبخ                      |
| **Container**  | نسخة مشغّلة من الصورة          | الطبق الجاهز                    |
| **Dockerfile** | ملف بناء الصورة                | خطوات الوصفة                    |
| **Registry**   | مستودع الصور (Docker Hub, ACR) | كتاب الطبخ                      |
| **Volume**     | تخزين دائم للحاوية             | الثلاجة — تحفظ الطعام بعد الطبخ |
| **Network**    | اتصال بين الحاويات             | طاولة الطعام — تجمع الأطباق     |

## أول Dockerfile لك

```dockerfile
# Dockerfile — وصفة بناء تطبيق Python
FROM python:3.12-slim        # ابدأ من صورة Python الرسمية (خفيفة)
WORKDIR /app                  # مجلد العمل داخل الحاوية
COPY requirements.txt .       # انسخ ملف المتطلبات أولاً (للاستفادة من الكاش)
RUN pip install --no-cache-dir -r requirements.txt
COPY . .                      # انسخ باقي الكود
EXPOSE 8080                   # المنفذ الذي يستمع عليه التطبيق
CMD ["python", "app.py"]      # أمر التشغيل
```

```bash
docker build -t cloudnova-api:v1 .    # ابنِ الصورة
docker run -d -p 8080:8080 cloudnova-api:v1  # شغّلها
docker ps                              # تأكد إنها شغالة
curl http://localhost:8080/health      # اختبرها
```

## البناء متعدد المراحل — Multi-Stage Builds

المشكلة: صورة Python العادية حجمها ١ جيجابايت. لماذا؟ كل أدوات البناء موجودة في الصورة النهائية.

الحل: ابْنِ في مرحلة، وشغّل في مرحلة أخرى:

```dockerfile
# === المرحلة ١: البناء ===
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target /deps

# === المرحلة ٢: التشغيل (صورة أخف بكثير) ===
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /deps /usr/local/lib/python3.12/site-packages
COPY . .
USER 1000                     # لا تشغّل كـ root!
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1
CMD ["python", "app.py"]
```

النتيجة: صورة بحجم ١٥٠ ميجابايت بدل ١ جيجابايت. فرق ٨٥٪!

## docker-compose — تطبيقات متعددة الحاويات

```yaml
# docker-compose.yml — CloudNova API كاملة
version: "3.8"
services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/cloudnova
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: ${DB_PASSWORD} # من متغيرات البيئة — آمن!
      POSTGRES_DB: cloudnova
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d cloudnova"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

```bash
docker-compose up -d        # شغّل الكل
docker-compose ps            # تأكد من الحالة
docker-compose logs -f api   # سجلات الـ API مباشرة
docker-compose down -v       # أوقف كل شيء ونظّف
```

## أوامر تحتاجها يومياً

| الأمر                            | الغرض                           |
| -------------------------------- | ------------------------------- |
| `docker build -t name .`         | بناء صورة                       |
| `docker run -d -p 8080:80 name`  | تشغيل حاوية                     |
| `docker ps`                      | الحاويات الشغالة                |
| `docker ps -a`                   | كل الحاويات (بما فيها المتوقفة) |
| `docker logs -f container`       | سجلات الحاوية مباشرة            |
| `docker exec -it container bash` | ادخل الحاوية                    |
| `docker system prune -a`         | نظف كل شيء غير مستخدم           |
| `docker image ls`                | الصور المخزنة محلياً            |
| `docker-compose up -d`           | شغّل docker-compose             |
| `docker-compose logs -f`         | سجلات كل الخدمات                |

## سيناريو CloudNova: الحاوية تشتغل محلياً لكنها تموت في الإنتاج

> **الموقف:** `docker run cloudnova-api` يشتغل على جهازك. نفس الصورة في Azure تخرج بعد ٣٠ ثانية.

### خطة التشخيص:

```bash
# 1. شوف سجلات الحاوية الميتة
docker logs cloudnova-api --tail 50
# "FATAL: database "cloudnova" does not exist"

# 2. افحص متغيرات البيئة
docker inspect cloudnova-api | jq '.[0].Config.Env'
# DATABASE_URL يشير إلى localhost — خطأ!
# في Azure، قاعدة البيانات في حاوية منفصلة

# 3. الحل: docker-compose مع depends_on و healthcheck
# (استخدم docker-compose.yml أعلاه)

# 4. تأكد من إعادة التشغيل التلقائي
docker run -d --restart=unless-stopped cloudnova-api
```

## نصائح إنتاجية

1. **لا تضع أسراراً في الصورة.** استخدم `--build-arg` أو متغيرات بيئة وقت التشغيل
2. **الصورة الأصغر = أسرع في النشر وأقل ثغرات.** استخدم `-slim` أو `-alpine`
3. **مستخدم غير root دائماً.** `USER 1000` في نهاية Dockerfile
4. **HEALTHCHECK ضروري.** بدونه، Docker لا يعرف إذا تطبيقك حيّ أو ميت
5. **نظف بانتظام.** `docker system prune -a` كل أسبوع

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
