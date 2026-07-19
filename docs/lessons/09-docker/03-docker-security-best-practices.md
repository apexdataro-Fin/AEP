---
sidebar_position: 3
title: "أفضل ممارسات أمن Docker"
description: "Docker Security — non-root، read-only، seccomp، AppArmor، تأمين الحاويات من اليوم الأول."

# أفضل ممارسات أمن Docker

> "حاوية Docker الافتراضية ليست آمنة. الأمن يحتاج إلى جهد واعٍ."

## 🎯 أهداف التعلم

- تشغيل الحاويات كـ non-root user
- استخدام read-only root filesystem
- تطبيق seccomp و AppArmor profiles
- فحص الصور ومنع الثغرات

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

---

## 🧠 الطبقة البسيطة

تخيل أن Docker container مثل شقة مفروشة. افتراضياً، لديك "مفتاح رئيسي" (root). أي مخترق يدخل الشقة يجد المفتاح الرئيسي ويمكنه فتح كل الأبواب. الحل: non-root user = مفتاح يفتح باب شقتك فقط.

---

## 🏗️ Non-Root User

```dockerfile
# ❌ سيء - root user
FROM node:20
COPY . /app
CMD ["node", "server.js"]

# ✅ جيد - non-root user
FROM node:20
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
WORKDIR /app
COPY --chown=appuser:appgroup . .
USER appuser
CMD ["node", "server.js"]
```

### Read-Only Filesystem

```bash
docker run \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100M \
  --tmpfs /var/run:rw,noexec,nosuid \
  nginx:latest
```

### Drop Capabilities

```bash
docker run \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  --security-opt=no-new-privileges:true \
  nginx:latest
```

### Docker Scout

```bash
docker scout quickview cloudnova-api:latest
docker scout recommendations cloudnova-api:latest
docker scout cves cloudnova-api:latest
```

---

## 🏛️ طبقة الإنتاج: Docker Bench Security

```bash
docker run --rm --net host --pid host --userns host --cap-add audit_control \
  -v /etc:/etc -v /usr/bin/docker:/usr/bin/docker \
  docker/docker-bench-security
```

### سيناريو CloudNova: حاوية مخترقة

اكتشفنا حاوية API تعمل كـ root. عند اختراقها عبر ثغرة في الـ app، استطاع المخترق:
1. قراءة `/etc/shadow`
2. تثبيت برامج ضارة
3. الوصول إلى host network

**الإصلاح**: non-root user + read-only + `--cap-drop=ALL`

---

## 🎨 طبقة المعماري: Docker Security Checklist

| # | الفحص | الأمر |
|---|-------|-------|
| 1 | Non-root user | `docker inspect --format '{{.Config.User}}' container` |
| 2 | Read-only root | `docker inspect --format '{{.HostConfig.ReadonlyRootfs}}'` |
| 3 | No privileged mode | `--privileged=false` (الافتراضي) |
| 4 | Dropped capabilities | `--cap-drop=ALL` |
| 5 | No host network | لا تستخدم `--network host` |

---

## 🛠️ تدريبات

### تمرين: حسّن Dockerfile
خذ Dockerfile موجوداً وأضف non-root user + read-only.

### تحدي: تدقيق أمني
شغّل Docker Bench Security على خادم الإنتاج وأصلح كل WARN.

---

## 📝 تقييم

### ✅ فحص المعرفة
1. لماذا non-root user مهم؟
2. ماذا يفعل `--read-only`؟
3. ما الفرق بين `--cap-drop=ALL` و `--privileged`؟
4. كيف تفحص صورة Docker قبل النشر؟

### 🃏 بطاقات

| السؤال | الإجابة |
|--------|---------|
| Non-root | تشغيل الحاوية كمستخدم عادي |
| `--read-only` | جذر read-only للقراءة فقط |
| `--cap-drop=ALL` | إزالة كل صلاحيات Linux |
| Docker Scout | أداة فحص صور مدمجة مع Docker |

---

## 🎤 مقابلة

1. **"كيف تؤمن حاوية Docker؟"**
   → Non-root + Read-only + Cap drop + Trivy scan + minimal base image
2. **"ما هو Docker Bench Security؟"**
   → أداة تفحص الـ Docker daemon configuration حسب CIS benchmark

---

## 📚 مراجع

| النوع | الرابط |
|-------|--------|
| درس مرتبط | [Docker in CI/CD](./04-docker-in-ci-cd) |
| درس مرتبط | [Container Security](../../08-containers/02-container-security-scanning) |
| أداة | [Docker Bench Security](https://github.com/docker/docker-bench-security) |

---

[← Docker Compose](./02-docker-compose-production) | [→ Docker in CI/CD](./04-docker-in-ci-cd) | [🏠 الرئيسية](/)
