---
sidebar_position: 1
title: "Linux المتقدم"
description: "أتمتة المهام، إدارة المستخدمين والمجموعات، جدولة المهام cron، ومراقبة النظام."
---

# Linux المتقدم

> **"بعد الأساسيات، حان وقت الأتمتة الحقيقية. حول مهامك اليومية إلى سكريبتات."**

## إدارة المستخدمين والمجموعات

```bash
# إنشاء مستخدم جديد (لأي عضو جديد في فريق CloudNova)
sudo useradd -m -s /bin/bash ahmed
sudo passwd ahmed

# إضافته للمجموعات المناسبة
sudo usermod -aG docker,dev ahmed   # يصلح لـ Docker والتطوير

# التحقق
id ahmed
groups ahmed

# حذف مستخدم (عند مغادرة الفريق)
sudo userdel -r ahmed               # الراية -r تحذف مجلده الشخصي أيضاً
```

## جدولة المهام — cron

```bash
# تحرير المهام المجدولة
crontab -e

# الصيغة: دقيقة ساعة يوم_الشهر شهر يوم_الأسبوع الأمر
# ┌──────── دقيقة (0-59)
# │ ┌──────── ساعة (0-23)
# │ │ ┌──────── يوم الشهر (1-31)
# │ │ │ ┌──────── شهر (1-12)
# │ │ │ │ ┌──────── يوم الأسبوع (0-7, 0=الأحد)
# │ │ │ │ │
# * * * * * الأمر

# أمثلة:
0 2 * * * /backup/db.sh              # نسخ احتياطي يومياً ٢ صباحاً
*/5 * * * * /scripts/health-check.sh # فحص صحة كل ٥ دقائق
0 20 * * 5 /scripts/weekly-report.sh # تقرير أسبوعي الجمعة ٨ مساءً
```

## سكريبت النسخ الاحتياطي التلقائي

```bash
#!/bin/bash
# /backup/db.sh — نسخ احتياطي يومي لقاعدة بيانات CloudNova
BACKUP_DIR="/backup/postgres"
DB_NAME="cloudnova"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

# نسخ احتياطي
pg_dump -U backup_user "$DB_NAME" | gzip > "$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

# نجاح؟
if [ $? -eq 0 ]; then
    echo "✅ Backup created: ${DB_NAME}_${TIMESTAMP}.sql.gz"
else
    echo "❌ Backup FAILED at $TIMESTAMP" >&2
    exit 1
fi

# حذف النسخ القديمة (أكثر من ٧ أيام)
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "🗑 Cleaned backups older than $RETENTION_DAYS days"
```

## مراقبة متقدمة

```bash
# ماذا يستهلك المعالج؟
htop          # نسخة محسنة من top
ps aux --sort=-%cpu | head -5   # أكثر ٥ عمليات استهلاكاً للمعالج

# ماذا يستهلك الذاكرة؟
free -h       # نظرة عامة
ps aux --sort=-%mem | head -5   # أكثر ٥ عمليات استهلاكاً للذاكرة

# ماذا يستهلك القرص؟
df -h                    # نظرة عامة
du -sh /var/log/*        # أحجام مجلدات السجلات
ncdu /                   # مستكشف تفاعلي (ثبته: apt install ncdu)
```

## سكريبت CloudNova: تنظيف السجلات

```bash
#!/bin/bash
# /scripts/log-cleanup.sh
# يحذف السجلات الأقدم من ٣٠ يوماً — يمنع امتلاء القرص

LOG_DIR="/var/log/cloudnova"
MAX_DAYS=30

find "$LOG_DIR" -name "*.log" -mtime +$MAX_DAYS -exec gzip {} \;
find "$LOG_DIR" -name "*.gz" -mtime +$MAX_DAYS -delete

echo "$(date): Cleaned logs older than $MAX_DAYS days"
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
