---
sidebar_position: 3
title: "إتقان Bash Scripting"
description: "كتابة سكريبتات Bash إنتاجية: error handling، logging، traps، ومعالجة الملفات بأمان."
---

# إتقان Bash Scripting

> "كل مهندس سحابة يحتاج Bash. ليس لكل شيء — لكن عندما تحتاجه، لا بديل عنه."

## 🎯 أهداف التعلم
- كتابة سكريبتات Bash إنتاجية باحترافية
- error handling مع `set -euo pipefail`
- logging احترافي وتدوير الملفات
- traps للتنظيف عند الخروج
- معالجة JSON مع `jq`

---

## ١. الأساسيات — من البسيط للإنتاجي

```bash
#!/bin/bash
set -euo pipefail  # الخطأ الأول = توقف. المتغيرات غير المعرفة = خطأ.

# logging function
log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"; }

# trap للتنظيف
cleanup() { log "Cleaning up..."; rm -f /tmp/lockfile; }
trap cleanup EXIT

# lockfile لمنع التزامن
exec 200>/tmp/lockfile
flock -n 200 || { log "Another instance running"; exit 1; }

log "Starting backup..."
```

---

## ٢. سيناريو CloudNova: نسخ احتياطي لقواعد البيانات

```bash
#!/bin/bash
# backup-all-dbs.sh — نسخ احتياطي متوازي
set -euo pipefail

DBS=("cloudnova" "analytics" "logs")
BACKUP_DIR="/backup/postgres/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

backup_db() {
    local db=$1
    log "Backing up $db..."
    pg_dump -U backup "$db" | gzip > "$BACKUP_DIR/${db}.sql.gz"
    log "$db: $(du -h "$BACKUP_DIR/${db}.sql.gz" | cut -f1)"
}

export -f backup_db
export BACKUP_DIR
printf '%s\n' "${DBS[@]}" | xargs -P 3 -I {} bash -c 'backup_db "$@"' _ {}
log "All databases backed up to $BACKUP_DIR"
```

---

## 🛠️ تدريبات
**تمرين:** اكتب سكريبت تنظيف لـ Docker images الأقدم من 7 أيام.
**تحدي:** سكريبت فحص صحة لـ 10 endpoints مع Slack alert.

### 📝 تقييم
**س١:** `set -euo pipefail`؟ → توقف عند أي خطأ.
**س٢:** `trap`؟ → ينفذ أمر عند exit/error.
**س٣:** `flock`؟ → يمنع تشغيل نسختين من نفس السكريبت.

### 🎤 مقابلة
**"Bash vs Python للـ automation؟"**
→ Bash: < 100 سطر، عمليات shell. Python: منطق معقد، APIs.

---

[← Linux Advanced](./02-linux-advanced) | [→ Linux Security](./04-linux-security-hardening) | [🏠 الرئيسية](/)
