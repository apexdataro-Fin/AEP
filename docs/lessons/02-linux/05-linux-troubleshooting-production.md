---
sidebar_position: 5
title: "استكشاف أخطاء Linux"
description: "تحديد وحل مشاكل Linux في الإنتاج: CPU، ذاكرة، قرص، شبكة — strace، perf، tcpdump."
---

# استكشاف أخطاء Linux في الإنتاج

> "الخادم لا يستجيب. 500 مستخدم غاضب. مديرك يتصل. ماذا تفعل؟"

## 🎯 أهداف التعلم
- تشخيص CPU spikes، memory leaks، disk I/O bottlenecks
- استخدام strace و perf و tcpdump
- تحليل core dumps
- التعامل مع OOM Killer

---

## ١. بروتوكول التشخيص — أول 5 دقائق

```bash
# ١. النظرة الشاملة
uptime && free -h && df -h

# ٢. CPU — من المستهلك؟
top -bn1 | head -10

# ٣. Memory
ps aux --sort=-%mem | head -10

# ٤. Disk I/O
iostat -x 1 3

# ٥. Network
ss -s && netstat -i
```

## ٢. strace — ماذا يفعل الـ process فعلاً؟

```bash
strace -p $(pgrep nginx) -c  # إحصاء syscalls
strace -p $(pgrep api) -e trace=network  # network calls فقط
```

## ٣. tcpdump — ماذا يجري على الشبكة؟

```bash
tcpdump -i eth0 port 443 -w capture.pcap
tcpdump -r capture.pcap 'tcp[tcpflags] & (tcp-rst) != 0'
```

## ٤. OOM Killer

```bash
dmesg -T | grep -i "out of memory"
# الحل: ضاعف memory limit أو أصلح الـ leak
```

## 🚨 CloudNova: API latency 30s

```bash
# التشخيص: strace كشف أن 90% من الوقت في futex (lock contention)
# الحل: قلل عدد threads + أضف connection pooling
```

## 🛠️ تدريبات
**تمرين:** شخّص process يستهلك 100% CPU.
**تحدي:** حلل core dump لتطبيق crash.

## 📝 تقييم
**س١:** `strace` vs `perf`؟ → strace: syscalls. perf: performance profiling.
**س٢:** OOM Killer؟ → يقتل processes عندما تنفد الذاكرة.
**س٣:** `tcpdump`؟ → يلتقط حركة الشبكة للتحليل.

---

[← Linux Security](./04-linux-security-hardening) | [→ Networking](../03-networking/01-networking-fundamentals) | [🏠 الرئيسية](/)
