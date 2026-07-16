---
sidebar_position: 1
title: "أساسيات الحاويات"
description: "فهم الحاويات من الداخل: namespaces، cgroups، OCI، وبناء الحاويات بكفاءة للمهندس السحابي."
---

# أساسيات الحاويات (Containers)

> "الحاوية ليست VM صغيرة. الحاوية هي عملية محاطة بجدار خفيف."

## 🎯 أهداف التعلم

- فهم الفرق الجوهري بين الحاويات والآلات الافتراضية
- فهم namespaces و cgroups (آلية عمل الحاويات)
- إتقان بناء صور Docker بكفاءة (multi-stage builds)
- فهم نموذج OCI والحاويات في Kubernetes
- تطبيق أنماط الحاويات الإنتاجية

---

## 📖 الطبقة الأساسية: لماذا الحاويات؟

### المشكلة قبل الحاويات

```
المطور: "الكود يشتغل على جهازي!"
DevOps: "لا يشتغل على السيرفر..."
المطور: "نفس نظام التشغيل، نفس النسخة..."
DevOps: "لكن نسخة Python مختلفة..."
```

الحاويات تحل هذه المشكلة بتغليف التطبيق **مع كل اعتمادياته** في وحدة واحدة قابلة للنقل.

### الحاوية vs الآلة الافتراضية

```
Virtual Machine (VM):
┌──────────────────────────────────┐
│ App A     │ App B    │
│ Bins/Libs │ Bins/Libs│
│ Guest OS  │ Guest OS │
├──────────────────────────────────┤
│ Hypervisor                      │
├──────────────────────────────────┤
│ Host OS                         │
│ Hardware                        │
└──────────────────────────────────┘

Container:
┌──────────────────────────────────┐
│ App A     │ App B    │
│ Bins/Libs │ Bins/Libs│
├──────────────────────────────────┤
│ Container Runtime (Docker)      │
├──────────────────────────────────┤
│ Host OS                         │
│ Hardware                        │
└──────────────────────────────────┘
```

| الفرق        | VM                    | Container             |
| ------------ | --------------------- | --------------------- |
| نظام التشغيل | نظام كامل لكل VM      | يشارك Host OS kernel  |
| الحجم        | GBs                   | MBs                   |
| التشغيل      | دقائق                 | ثوانٍ                 |
| العزل        | قوي جداً (hypervisor) | خفيف (namespaces)     |
| الكثافة      | 10-20 VM/server       | 100+ container/server |

---

## 🧱 الطبقة المهنية: ما بداخل الحاوية

### Linux Namespaces — كيف ترى الحاوية "عالمها الخاص"

| namespace  | ماذا يعزل             | مثال                            |
| ---------- | --------------------- | ------------------------------- |
| **PID**    | قائمة العمليات        | `ps aux` يرى فقط عمليات الحاوية |
| **NET**    | واجهات الشبكة         | للحاوية IP خاص و routing table  |
| **MNT**    | نظام الملفات          | `/` يرى فقط ملفات الحاوية       |
| **UTS**    | اسم المضيف            | hostname مختلف عن الـ host      |
| **IPC**    | التواصل بين العمليات  | shared memory معزول             |
| **USER**   | المستخدمين والمجموعات | root في الحاوية ≠ root في host  |
| **CGROUP** | حدود الموارد          | CPU/RAM مخصص للحاوية            |

### Cgroups — حدود الموارد

```bash
# رؤية cgroups مباشرة
docker run --memory=512m --cpus=2 nginx

# داخل host:
cat /sys/fs/cgroup/memory/docker/<container-id>/memory.limit_in_bytes
# الناتج: 536870912 (512MB)

# منع حاوية من استهلاك كل الذاكرة
docker run \
  --memory=1g \
  --memory-swap=1g \
  --cpus=2 \
  --pids-limit=100 \
  my-app
```

### طبقات الصورة (Image Layers)

```dockerfile
# كل أمر يبني طبقة جديدة
FROM ubuntu:22.04                    # Layer 1: 77MB
RUN apt-get update && apt-get install -y python3  # Layer 2: 150MB
RUN pip install flask                 # Layer 3: 5MB
COPY app.py /app/                    # Layer 4: 1KB
CMD ["python3", "/app/app.py"]       # Layer 5 (metadata only)
```

**سبب أهمية الطبقات:**

- الصور تشترك في الطبقات → توفير مساحة
- التغيير في طبقة يعيد بناء ما بعدها فقط
- النقل أسرع (ننقل الطبقات الجديدة فقط)

---

## 🏗️ الطبقة الإنتاجية: بناء صور احترافية

### Multi-Stage Builds — الحجم مهم

```dockerfile
# ====== مرحلة البناء ======
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# ====== مرحلة الإنتاج ======
FROM nginx:1.25-alpine
# لا npm! لا node_modules! لا كود مصدري!
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

**قبل multi-stage:** 950MB
**بعد multi-stage:** 12MB
هذا فرق 98% في الحجم!

### أفضل ممارسات Dockerfile — القائمة النهائية

```dockerfile
# 1. استخدم صورة أساسية محددة
FROM python:3.12-slim-bookworm  # ✅ محدد
# FROM python:latest           # ❌ غير محدد

# 2. استخدم مستخدم غير root
RUN useradd --create-home --shell /bin/bash appuser
USER appuser

# 3. انسخ ملفات الاعتماديات أولاً (للاستفادة من التخزين المؤقت)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# 4. دمج أوامر RUN
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl \
      ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 5. HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# 6. لا تستخدم root
USER 1000
```

### .dockerignore — لا ترسل كل شيء

```
# .dockerignore
node_modules/
__pycache__/
*.pyc
.git/
.gitignore
.env
.env.local
Dockerfile
docker-compose.yml
.vscode/
.idea/
*.md
tests/
```

---

## 🎨 الطبقة المعمارية: OCI ومعايير الصناعة

### Open Container Initiative (OCI)

```
OCI Specifications:
├── Image Spec — كيف تُبنى الصورة وطبقاتها
│   ├── Image Manifest (فهرس الطبقات)
│   ├── Image Configuration (الإعدادات)
│   └── Layer Filesystems (الطبقات الفعلية)
│
└── Runtime Spec — كيف تُشغّل الحاوية
    ├── config.json (التكوين)
    └── rootfs (نظام الملفات)
```

**لماذا OCI مهم؟**

لأنه يعني أن صورتك تشتغل على **أي** runtime متوافق: Docker، containerd، CRI-O، Podman.

### العزل الأمني — مستويات مختلفة

```
مستوى العزل (من الأضعف إلى الأقوى):

1. Docker (default) — namespaces + cgroups فقط
2. Docker + seccomp + AppArmor
3. Docker + user namespaces + read-only rootfs
4. gVisor (userspace kernel) — طبقة إضافية
5. Kata Containers (VM خفيفة) — Hypervisor
```

**قاعدة ذهبية:** لا تثق أبداً بالكود الذي يشغله العميل في نفس الحاوية مع خدمتك.

---

## 🏥 سيناريو CloudNova: تحويل تطبيق إلى حاويات

```
📋 التذكرة: HYD-1301
النوع: مهمة بنية تحتية
الأولوية: عالية

الوصف:
تطبيق Python/Flask القديم يحتاج تحويله إلى Docker.
حالياً يأخذ 30 دقيقة لتثبيته على كل سيرفر.

المطلوب:
1. كتابة Dockerfile بـ multi-stage build
2. حجم الصورة النهائية أقل من 100MB
3. تشغيل بـ non-root user
4. HEALTHCHECK endpoint
5. docker-compose للتطوير المحلي
6. تجهيز pipeline test للصورة

الحل:

# 1. Dockerfile
# 2. docker-compose.yml:
version: "3.9"
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: cloudnova-api:latest
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=database
      - REDIS_HOST=cache
    depends_on:
      database:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      retries: 3

  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: cloudnova
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d cloudnova"]
      interval: 10s

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

---

## ⚡ الإنتاج وما بعده

### مشاكل شائعة وحلولها

| المشكلة               | السبب المحتمل        | الحل                              |
| --------------------- | -------------------- | --------------------------------- |
| الحاوية تخرج فوراً    | لا عملية foreground  | تأكد من CMD الصحيح                |
| "port already in use" | منفذ مستخدم على host | غيّر المنفذ أو أوقف العملية       |
| الحاوية لا ترى الشبكة | DNS/network issue    | جرب `--network host` للتشخيص      |
| Out of Memory         | cgroup memory limit  | زد `--memory` أو حلل التسريبات    |
| "permission denied"   | user/group mismatch  | استخدم `--user` أو صحح Dockerfile |

### أوامر تشخيصية أساسية

```bash
# ماذا يحدث داخل الحاوية؟
docker exec -it container-name /bin/sh

# استهلاك الموارد
docker stats --no-stream

# سجلات الحاوية
docker logs --tail=100 -f container-name

# ماذا تغير في الحاوية عن الصورة؟
docker diff container-name

# فحص الصورة — الطبقات والإعدادات
docker image inspect image-name
docker history image-name

# تنظيف الصور غير المستخدمة
docker image prune -a
docker system prune -a --volumes
```

---

## 🧠 التذكّر النشط

1. ما الفرق الأساسي بين الحاوية والآلة الافتراضية؟
2. كيف تستخدم namespaces لعزل PID و NETWORK؟
3. لماذا نستخدم multi-stage builds؟
4. ما هي أفضل ممارسة لتشغيل العمليات داخل الحاوية (user/root)؟
5. كيف تفحص حجم الصورة وطبقاتها؟

## 🗣️ تمرين فاينمان

اشرح الحاويات لشخص غير تقني:

"تخيل أنك تريد إرسال لعبة لأصدقائك. بدلاً من إرسال اللعبة مع تعليمات 'ثبّت DirectX، ثبّت Visual C++، اضبط الإعدادات'، ترسل لهم صندوقاً يحتوي اللعبة وكل ما تحتاجه جاهزة للتشغيل مباشرة. الصندوق هو الحاوية."

## 📝 بطاقات تعليمية

- **Image**: قالب للقراءة فقط يحتوي التطبيق واعتمادياته
- **Container**: نسخة مشغّلة من الصورة (طبقة قراءة/كتابة فوقها)
- **Dockerfile**: وصفة بناء الصورة
- **Registry**: مستودع لتخزين الصور (Docker Hub, ACR, ECR)
- **Layer**: طبقة في الصورة، تشترك فيها الحاويات لتوفير المساحة

## 🎤 أسئلة المقابلة

1. **"كيف تختار صورة أساسية للتطبيق؟"**
   - `alpine`: أصغر (5MB)، لكن musl libc قد يسبب مشاكل
   - `slim`: متوسطة، Debian-based، آمنة
   - `distroless`: فقط التطبيق + runtime (لا shell!)

2. **"كيف تؤمن حاوية Docker؟"**
   - non-root user
   - read-only root filesystem
   - drop capabilities (`--cap-drop=ALL`)
   - seccomp/AppArmor profiles
   - مسح الصور للثغرات (Trivy, Snyk)

3. **"ما الفرق بين CMD و ENTRYPOINT؟"**
   - CMD: افتراضي، يمكن تجاوزه
   - ENTRYPOINT: الأمر الرئيسي، لا يتجاوز بسهولة
   - معاً: ENTRYPOINT يحدد البرنامج، CMD يحدد المعاملات الافتراضية

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
