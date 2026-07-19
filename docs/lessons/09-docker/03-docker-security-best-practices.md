---
sidebar_position: 3
title: "أفضل ممارسات أمن Docker"
description: "Docker Security — non-root، read-only، seccomp، AppArmor، تأمين الحاويات من اليوم الأول."
---

# أفضل ممارسات أمن Docker

> "حاوية Docker الافتراضية ليست آمنة. الأمن يحتاج إلى جهد واعٍ."

## 🎯 أهداف التعلم

- تشغيل الحاويات كـ non-root user
- استخدام read-only root filesystem
- تطبيق seccomp و AppArmor profiles
- فحص الصور ومنع الثغرات

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

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

### Docker Security Scan

```bash
# مع Docker Scout
docker scout quickview cloudnova-api:latest
docker scout recommendations cloudnova-api:latest
docker scout cves cloudnova-api:latest
```

---

## 🛠️ تدريب

خذ Dockerfile موجوداً وحسّن أمنه:
1. أضف non-root user
2. شغّل Trivy واصلح HIGH/CRITICAL
3. اختبر بـ `--read-only`

---

[← Docker Compose](./02-docker-compose-production) | [→ Docker in CI/CD](./04-docker-in-ci-cd) | [🏠 الرئيسية](/)
