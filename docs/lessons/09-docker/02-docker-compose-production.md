---
sidebar_position: 2
title: "Docker Compose للإنتاج"
description: "تشغيل تطبيقات متعددة الخدمات، إدارة الشبكات، الأحجام، والأسرار في بيئات الإنتاج."
---

# Docker Compose للإنتاج

> "Docker Compose ليس فقط للتطوير. مع الإعداد الصحيح، يشغّل تطبيقات إنتاجية كاملة."

## 🎯 أهداف التعلم

- كتابة `docker-compose.yml` احترافي للإنتاج
- إدارة الشبكات الداخلية والخارجية
- استخدام volumes للبيانات المستمرة
- ضبط Health Checks و Resource Limits
- نشر تطبيق متعدد الخدمات بأمان

---

## ١. من التطوير إلى الإنتاج

### 🔹 ما يختلف في الإنتاج

| العنصر            | التطوير             | الإنتاج                               |
| ----------------- | ------------------- | ------------------------------------- |
| **إعادة التشغيل** | `restart: no`       | `restart: always` أو `unless-stopped` |
| **الموارد**       | غير محدودة          | CPU/Memory Limits                     |
| **Ports**         | مكشوفة للجميع       | فقط ما هو ضروري                       |
| **Volumes**       | `.:/app` bind mount | named volumes أو external storage     |
| **Health Checks** | غير موجودة غالباً   | ضرورية لكل خدمة                       |
| **Secrets**       | في .env             | Docker Secrets أو Vault               |
| **Logging**       | stdout فقط          | JSON-file مع rotation                 |

---

## ٢. ملف docker-compose.yml احترافي

### 🔹 الهيكل الكامل

```yaml
# docker-compose.prod.yml
version: "3.9"

# ============ الأسرار ============
secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    file: ./secrets/api_key.txt
  jwt_secret:
    external: true # يُنشأ يدوياً: echo "secret" | docker secret create jwt_secret -

# ============ الشبكات ============
networks:
  frontend:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: br-frontend
  backend:
    driver: bridge
    internal: true # لا وصول للإنترنت من هذه الشبكة
  monitoring:
    driver: bridge

# ============ الأحجام ============
volumes:
  postgres_data:
    driver: local
    driver_opts:
      type: none
      device: /data/postgres
      o: bind
  redis_data:
    driver: local
  prometheus_data:
    driver: local

# ============ الخدمات ============
services:
  # ---------- Nginx Reverse Proxy ----------
  nginx:
    image: nginx:1.25-alpine
    container_name: cloudnova-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - static_volume:/app/static:ro
    networks:
      - frontend
    depends_on:
      api:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
        reservations:
          cpus: "0.25"
          memory: 128M

  # ---------- API ----------
  api:
    build:
      context: .
      dockerfile: Dockerfile.prod
      args:
        NODE_ENV: production
    image: cloudnova/api:${API_VERSION:-latest}
    container_name: cloudnova-api
    restart: always
    expose:
      - "3000" # مكشوف للشبكات الداخلية فقط، ليس للمضيف
    volumes:
      - static_volume:/app/public
      - /var/run/docker.sock:/var/run/docker.sock:ro # لمراقبة الحاويات
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - REDIS_URL=redis://redis:6379
      - LOG_LEVEL=info
    secrets:
      - db_password
      - api_key
      - jwt_secret
    networks:
      - frontend
      - backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/healthz"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 30s
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "10"
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 1G
        reservations:
          cpus: "1.0"
          memory: 512M
      replicas: 2 # تشغيل نسختين (Docker Swarm أو Compose v3.9+)

  # ---------- Worker ----------
  worker:
    image: cloudnova/api:${API_VERSION:-latest}
    container_name: cloudnova-worker
    restart: always
    command: ["node", "worker.js"]
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - DB_HOST=postgres
    secrets:
      - db_password
    networks:
      - backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M

  # ---------- PostgreSQL ----------
  postgres:
    image: postgres:16-alpine
    container_name: cloudnova-postgres
    restart: always
    expose:
      - "5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d:ro
    environment:
      - POSTGRES_USER=cloudnova
      - POSTGRES_DB=cloudnova
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U cloudnova -d cloudnova"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 20s
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 2G
        reservations:
          cpus: "1.0"
          memory: 1G

  # ---------- Redis ----------
  redis:
    image: redis:7-alpine
    container_name: cloudnova-redis
    restart: always
    expose:
      - "6379"
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf:ro
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

  # ---------- Prometheus ----------
  prometheus:
    image: prom/prometheus:v2.50.0
    container_name: cloudnova-prometheus
    restart: always
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.retention.time=30d"
      - "--web.enable-admin-api"
    networks:
      - monitoring
    ports:
      - "127.0.0.1:9090:9090" # مقيد بـ localhost فقط

  # ---------- Grafana ----------
  grafana:
    image: grafana/grafana:10.4.0
    container_name: cloudnova-grafana
    restart: always
    environment:
      - GF_SECURITY_ADMIN_PASSWORD_FILE=/run/secrets/grafana_password
      - GF_INSTALL_PLUGINS=grafana-clock-panel
    volumes:
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./grafana/datasources:/etc/grafana/provisioning/datasources:ro
    networks:
      - monitoring
      - frontend
    depends_on:
      - prometheus

volumes:
  static_volume:
  postgres_data:
  redis_data:
  prometheus_data:
```

---

## ٣. أوامر الإنتاج الأساسية

```bash
# تشغيل الإنتاج
docker compose -f docker-compose.prod.yml up -d

# تحديث خدمة واحدة (zero-downtime إذا كان replicas > 1)
docker compose -f docker-compose.prod.yml up -d --no-deps --build api

# عرض السجلات
docker compose -f docker-compose.prod.yml logs -f --tail=100 api worker

# إيقاف آمن (انتظار انتهاء الطلبات)
docker compose -f docker-compose.prod.yml stop

# إعادة تشغيل خدمة معينة
docker compose -f docker-compose.prod.yml restart nginx

# تنظيف كامل
docker compose -f docker-compose.prod.yml down -v
```

---

## ٤. Health Checks: نبض الخدمة

### 🔹 أنواع الفحوصات

```yaml
# فحص HTTP
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/healthz"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 30s # وقت الإحماء قبل بدء الفحص

# فحص TCP
healthcheck:
  test: ["CMD-SHELL", "echo > /dev/tcp/localhost/5432"]
  interval: 10s

# فحص أمر داخلي
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 10s

# فحص PostgreSQL
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB"]
  interval: 10s
```

### 🔹 Endpoint صحي للـ API

```javascript
// src/health.js
const express = require("express");
const router = express.Router();

router.get("/healthz", async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    diskSpace: checkDiskSpace(),
    memory: checkMemory(),
  };

  const healthy = Object.values(checks).every((c) => c.status === "ok");
  const statusCode = healthy ? 200 : 503;

  res.status(statusCode).json({
    status: healthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    checks,
    uptime: process.uptime(),
  });
});

async function checkDatabase() {
  try {
    await db.raw("SELECT 1");
    return { status: "ok", latency: 12 };
  } catch (e) {
    return { status: "error", message: e.message };
  }
}

module.exports = router;
```

---

## ٥. Resource Limits: لا تدع حاوية تستهلك كل شيء

### 🔹 الفرق بين Limits و Reservations

| الخاصية          | المعنى                              |
| ---------------- | ----------------------------------- |
| **limits**       | الحد الأقصى الذي لا تتجاوزه الحاوية |
| **reservations** | الحد الأدنى المضمون للحاوية         |

```yaml
deploy:
  resources:
    limits:
      cpus: "2.0" # أقصى استخدام Coreين
      memory: 1G # أقصى ذاكرة 1GB
    reservations:
      cpus: "1.0" # مضمون Core واحد
      memory: 512M # مضمون 512MB
```

### 🔹 كيف تعرف الحد المناسب؟

```bash
# مراقبة الاستخدام الفعلي
docker stats cloudnova-api

# الناتج:
# CONTAINER         CPU %     MEM USAGE / LIMIT    MEM %
# cloudnova-api     12.5%     380MiB / 1GiB        37.1%

# إذا MEM USAGE قريب من LIMIT → ارفع limit
# إذا MEM % منخفض جداً → اخفض limit
```

---

## ٦. Logging للإنتاج

### 🔹 Docker Logging Drivers

```yaml
# JSON File مع rotation (للمشاريع الصغيرة)
logging:
  driver: "json-file"
  options:
    max-size: "100m"
    max-file: "10"
    compress: "true"

# Fluentd/Loki (للمشاريع الكبيرة)
logging:
  driver: "fluentd"
  options:
    fluentd-address: "localhost:24224"
    tag: "docker.{{.Name}}"
    labels: "environment,service"
```

---

## ٧. النسخ الاحتياطي والاستعادة

### 🔹 نسخ احتياطي لقواعد البيانات

```bash
#!/bin/bash
# backup.sh - يُشغّل يومياً عبر cron

BACKUP_DIR="/backups/postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CONTAINER="cloudnova-postgres"

mkdir -p "$BACKUP_DIR"

docker exec "$CONTAINER" pg_dump -U cloudnova cloudnova | \
  gzip > "$BACKUP_DIR/cloudnova_$TIMESTAMP.sql.gz"

# احذف النسخ الأقدم من ٣٠ يوماً
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup completed: cloudnova_$TIMESTAMP.sql.gz"
```

### 🔹 استعادة

```bash
gunzip -c /backups/postgres/cloudnova_20260716_030000.sql.gz | \
  docker exec -i cloudnova-postgres psql -U cloudnova cloudnova
```

---

## 🏢 سيناريو CloudNova: هجرة من Docker Compose إلى Kubernetes

### الموقف

بدأت CloudNova بـ Docker Compose في الإنتاج (جهاز VM واحد). الآن تريد الانتقال إلى Kubernetes للتوسع.

### خطة الهجرة التدريجية

```bash
# المرحلة ١: تحويل compose إلى Kubernetes manifests
kompose convert -f docker-compose.prod.yml -o k8s/

# المرحلة ٢: تشغيل جنباً إلى جنب
# - اترك compose على VM الحالي
# - شغّل Kubernetes Cluster جديد
# - استخدم load balancer لتوجيه 10% من الحركة لـ K8s

# المرحلة ٣: زيادة النسبة تدريجياً
# 10% → 25% → 50% → 100%

# المرحلة ٤: إيقاف compose بعد التأكد
docker compose -f docker-compose.prod.yml down
```

---

## 🧠 Active Recall

1. لماذا `restart: always` ضروري في الإنتاج؟
2. ما الفرق بين `expose` و `ports`؟
3. كيف تضمن عدم توقف الخدمة عند نفاد الذاكرة؟
4. لماذا `depends_on` مع `condition: service_healthy` أفضل من `depends_on` العادي؟
5. كيف تأخذ نسخة احتياطية لقاعدة بيانات PostgreSQL في Docker؟

---

## 📝 تمرين Feynman

اشرح Docker Compose لصديق: تخيّل أوركسترا. Docker Compose هو **قائد الأوركسترا**. بدلاً من أن تقول "أيها الكمان، ابدأ. أيها البيانو، توقف."، تكتب نوتة موسيقية واحدة (docker-compose.yml) وفيها متى يبدأ كل عازف، كيف يتواصلون، وماذا يفعلون إذا تعطل أحدهم (restart, healthcheck). القائد ينفذ كل شيء بنقرة واحدة.

---

## 🃏 بطاقات تعليمية

| السؤال                           | الإجابة                                     |
| -------------------------------- | ------------------------------------------- |
| أمر تشغيل compose في الخلفية     | `docker compose up -d`                      |
| أمر إيقاف compose مع حذف volumes | `docker compose down -v`                    |
| تقييد الذاكرة بـ 512MB           | `deploy.resources.limits.memory: 512M`      |
| فحص HTTP صحي                     | `test: ["CMD", "curl", "-f", "http://..."]` |
| شبكة داخلية بدون إنترنت          | `internal: true`                            |
| استخدام secret في compose        | `secrets: [secret_name]`                    |

---

## 🎯 أسئلة مقابلة

### س: ما الفرق بين Docker Compose و Kubernetes؟

| الميزة              | Docker Compose       | Kubernetes              |
| ------------------- | -------------------- | ----------------------- |
| **التعقيد**         | بسيط، YAML واحد      | معقد، موارد متعددة      |
| **التوسع**          | جهاز واحد (أو Swarm) | متعدد الأجهزة           |
| **الاستخدام**       | تطوير، إنتاج صغير    | إنتاج كبير، مؤسسات      |
| **Self-healing**    | محدود (restart)      | كامل (replicas, probes) |
| **Rolling updates** | لا                   | نعم، مدمج               |

---

---

## 🏛️ طبقة الإنتاج: ما بعد الملف الواحد

### Secrets Management متقدم

```bash
# Docker Secrets (Swarm فقط) — الأفضل لـ Compose
echo "my-db-password" | docker secret create db_password -

# للمشاريع بدون Swarm: HashiCorp Vault + envsubst
# ١. اسحب الـ secrets من Vault
vault kv get -format=json secret/cloudnova | \
  jq -r '.data.data | to_entries | map("export \(.key)=\(.value)") | .[]' > .env

# ٢. شغّل compose
source .env && docker compose -f docker-compose.prod.yml up -d
```

### Zero-Downtime Deployment مع Compose

```bash
# استراتيجية blue-green يدوية
# ١. شغّل البيئة الجديدة على port آخر
docker compose -p cloudnova-green -f docker-compose.prod.yml up -d
# ٢. اختبر البيئة الجديدة
curl http://localhost:8081/healthz
# ٣. بدّل Nginx لـ upstream الجديد
sed -i 's/blue:3000/green:3000/' nginx/nginx.conf
docker compose restart nginx
# ٤. أوقف البيئة القديمة بعد تأكيد النجاح
docker compose -p cloudnova-blue down
```

### Docker Compose vs Swarm vs Kubernetes

| المعيار | Compose | Swarm | Kubernetes |
|---------|---------|-------|------------|
| **التعقيد** | منخفض | متوسط | عالي |
| **النطاق** | جهاز واحد | عدة أجهزة | عدة clusters |
| **Auto-scaling** | ❌ | يدوي | ✅ مدمج |
| **Rolling updates** | ❌ | ✅ | ✅ |
| **الأفضل لـ** | تطوير، إنتاج صغير | إنتاج متوسط | إنتاج كبير |

---

## 🛠️ تدريبات

### تمرين ١: هجرة compose إلى swarm (سهل)
> حوّل `docker-compose.prod.yml` لـ Docker Swarm stack. أضف `deploy` blocks لـ 3 replicas و rolling updates.

### تمرين ٢: كارثة (متوسط)
> `docker compose up -d` يفشل: "port 5432 already in use". شخّص وأصلح.

### تحدي: أتمتة (متقدم)
> اكتب Makefile targets: `make deploy`, `make backup`, `make restore`, `make logs`, `make status`. كل target = compose command(s).

### 📝 تقييم (5 checks, 3 quiz)

**س١:** ما فائدة `internal: true` في network؟
<details><summary>الإجابة</summary>يمنع الحاويات على هذه الشبكة من الوصول للإنترنت. للـ backend networks مثل database — أمان إضافي.</details>

**س٢:** متى تستخدم `deploy.resources.reservations` vs `limits`؟
<details><summary>الإجابة</summary>reservations = الحد الأدنى المضمون. limits = السقف. مثال: api يحتاج 256MB على الأقل لكن قد يصل لـ 512MB في الذروة.</details>

**س٣:** كيف تنقل بيانات PostgreSQL من compose قديم لجديد؟
<details><summary>الإجابة</summary>`docker exec old-postgres pg_dump -U user db | docker exec -i new-postgres psql -U user db`</details>

### 🎤 مقابلة

**"كيف تختار بين Docker Compose و Kubernetes؟"**
→ Compose: فريق صغير، تطبيق 1-5 خدمات، جهاز واحد. K8s: فريق كبير، 10+ خدمات، scaling مطلوب.

**"كيف تتعامل مع secrets في Docker Compose بدون Swarm؟"**
→ ملف `.env` (محمي بـ `.gitignore`)، Vault agent sidecar، أو Azure Key Vault + envsubst.

---

## 📚 مراجع
- [Kubernetes Architecture](../10-kubernetes/01-kubernetes-architecture)
- [CI/CD Pipelines](../15-cicd/01-cicd-pipelines)
- 📖 [Docker Compose Specification](https://docs.docker.com/compose/compose-file/)

---

[← Docker Mastery](./01-docker-mastery) | [→ Kubernetes Architecture](../10-kubernetes/01-kubernetes-architecture) | [🏠 الرئيسية](/)

