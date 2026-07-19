---
sidebar_position: 5
title: "استكشاف أخطاء Linux في الإنتاج"
description: "استكشاف مشاكل Linux: CPU, memory, disk, network — منهجية وأدوات."
---

# استكشاف أخطاء Linux في الإنتاج

> "90% من مشاكل Linux تتشابه. تعلم الـ 10% المتبقية بسرعة."

## 🎯 أهداف التعلم

- تشخيص CPU spikes
- استكشاف memory leaks
- disk full scenarios
- Network troubleshooting
- أدوات: htop, iotop, netstat, lsof, strace

## ⏱️ الوقت المقدر: 45 دقيقة | المستوى: Advanced

---

## ١. منهجية التشخيص — USE Method

| المورد | Utilization | Saturation | Errors |
|--------|------------|------------|--------|
| **CPU** | `htop`, `mpstat` | run queue length | `dmesg \| grep error` |
| **Memory** | `free -h` | swap usage | OOM killer logs |
| **Disk** | `df -h`, `iostat` | I/O wait | `dmesg \| grep I/O` |
| **Network** | `iftop`, `nload` | dropped packets | `netstat -s \| grep error` |

---

## ٢. CPU — اكتشاف الـ spike

```bash
htop                          # مراقبة تفاعلية
mpstat 1 5                    # CPU stats كل ثانية
ps aux --sort=-%cpu | head -5 # أكثر 5 عمليات استهلاكاً
```

### سيناريو CloudNova: CPU 100%

```
1:30AM — alert: CPU usage > 95%
htop: process "python3 /opt/backup.py" يستهلك كل الـ CPUs
strace -p 12345: العملية عالقة في read() loop على socket مقطوع
الحل: kill -9 12345 + restart الخدمة
السبب الجذري: backup script لا timeout للاتصالات
```

---

## ٣. Memory — تسريب الذاكرة

```bash
free -h                      # نظرة عامة
smem -rs pss | head -10      # استخدام الذاكرة الفعلي لكل عملية
dmesg | grep -i "out of memory"  # سجلات OOM killer
```

```bash
# معرفة أين تذهب الذاكرة
cat /proc/meminfo | grep -E "^(MemTotal|MemFree|MemAvailable|Buffers|Cached)"
# MemAvailable = الذاكرة المتاحة فعلاً للتطبيقات
```

---

## ٤. Disk — ممتلئ تماماً

```bash
df -h                        # أي partitions ممتلئة؟
du -sh /* 2>/dev/null | sort -rh | head -10  # أكبر 10 مجلدات
ncdu /                       # أداة تفاعلية (apt install ncdu)
lsof +L1                     # ملفات محذوفة لكنها لا تزال مفتوحة
```

### سيناريو CloudNova: Disk Full

```
df -h: /dev/sda1 100% used
du -sh /*: /var/log = 45GB!
السبب: logrotate معطل. nginx access.log = 30GB
الحل الفوري:
  sudo truncate -s 0 /var/log/nginx/access.log
الحل الدائم:
  تفعيل logrotate + إرسال logs إلى Azure Monitor
```

---

## ٥. Network

```bash
ss -tlnp                    # ports المفتوحة
ss -s                       # إحصائيات
iftop -i eth0               # bandwidth live
mtr google.com              # traceroute + ping مستمر
tcpdump -i eth0 port 443 -c 100  # التقاط 100 packet
```

---

## 🏛️ سيناريو CloudNova: الجمعة السوداء

```
10:00AM — Black Friday sale يبدأ
10:05AM — error rate يرتفع
10:07AM — تشخيص:
  htop: CPU 100%, لكن 80% iowait
  iostat: disk utilization 100%
  السبب: PostgreSQL checkpoint يكتب 10GB للقرص
10:10AM — حل مؤقت: زيادة PostgreSQL shared_buffers
10:15AM — حل دائم: نقل PostgreSQL إلى Azure SQL Managed Instance
الدرس: الأقراص المحلية نقطة ضعف. استخدم managed disks أسرع.
```

---

## 🛠️ تدريبات

### تمرين 1: تشخيص CPU spike
شغّل `stress --cpu 4` على VM وشخص المشكلة.

### تمرين 2: محاكاة disk full
`dd if=/dev/zero of=/tmp/bigfile bs=1M count=1000` وشخص.

### تحدي: سكريبت تشخيص آلي
سكريبت Bash يفحص CPU/Memory/Disk/Network ويطبع تقريراً مختصراً.

---

## 📝 تقييم

### ✅ فحص المعرفة
1. ما هي USE Method؟
2. كيف تكتشف memory leak؟
3. ما الفرق بين `MemFree` و `MemAvailable`؟
4. ماذا يعني iowait عالي؟
5. كيف تكتشف ملفاً محذوفاً لكنه لا يزال مفتوحاً؟

### 🃏 بطاقات

| السؤال | الإجابة |
|--------|---------|
| USE | Utilization, Saturation, Errors |
| iowait | وقت انتظار CPU للـ disk I/O |
| OOM Killer | يقتل عمليات لتحرير ذاكرة |
| `lsof +L1` | ملفات محذوفة لا تزال مفتوحة |

---

## 🎤 مقابلة

1. "كيف شخصت آخر حادثة production؟"
2. "htop shows CPU 100% but load average < 1. What's happening?" — process stuck in uninterruptible sleep

---

## 📚 مراجع

| النوع | الرابط |
|-------|--------|
| درس مرتبط | [Linux Security](./04-linux-security-hardening) |
| كتاب | "Systems Performance" — Brendan Gregg |
| أداة | [netdata](https://www.netdata.cloud/) — مراقبة شاملة |

---

[← Linux Security](./04-linux-security-hardening) | [→ Networking Fundamentals](../../03-networking/01-networking-fundamentals) | [🏠 الرئيسية](/)
