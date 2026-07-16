---
sidebar_position: 1
title: "أساسيات الشبكات"
description: "افهم TCP/IP، DNS، HTTP، الشبكات الفرعية، وكيف تنتقل البيانات عبر الإنترنت."
---

# أساسيات الشبكات

> **"كل خدمة سحابية هي نقطة نهاية على الشبكة. افهم كيف تتحرك البيانات."**

## لماذا الشبكات مهمة لمهندس السحابة؟

السحابة = حواسيب + تخزين + **شبكات**. بدون فهم الشبكات:
- لا تستطيع تصميم VNet آمناً
- لا تفهم لماذا التطبيق بطيء
- لا تشخص مشاكل الاتصال بين الخدمات
- لا تؤمن بيئتك بشكل صحيح

## نموذج OSI — الطبقات السبع

| الطبقة | الاسم | البروتوكول | مثال سحابي |
|---|---|---|---|
| ٧ | التطبيق | HTTP, DNS, TLS | API Gateway, App Service |
| ٤ | النقل | TCP, UDP | Load Balancer |
| ٣ | الشبكة | IP, ICMP | VNet, Subnet, VPN |
| ٢ | ربط البيانات | Ethernet, MAC | NIC, NSG |

**لا تحفظ الطبقات عن ظهر قلب.** افهم ماذا تفعل كل طبقة ولماذا توجد. الطبقة ٧ هي ما يراه المستخدم. الطبقة ٣ هي كيف تصل البيانات. الطبقة ٢ هي الأسلاك والكروت.

## TCP vs UDP — متى تستخدم أيهما؟

| الميزة | TCP | UDP |
|---|---|---|
| الموثوقية | ✅ مضمون الوصول | ❌ غير مضمون |
| الاتصال | مهيأ للاتصال (Connection) | بدون اتصال |
| الترتيب | ✅ يصل بالترتيب | ❌ قد يصل معكوساً |
| السرعة | أبطأ | أسرع |
| الاستخدام | الويب، البريد، SSH | البث المباشر، الألعاب، DNS |

### تشبيه واقعي

- **TCP** مثل البريد المسجل: توقع على الاستلام. إذا ضاع الخطاب، يعيدون إرساله.
- **UDP** مثل الميكروفون في الملعب: الصوت يصل فوراً. إذا فقدت كلمة، لا تعيدها — تواصل.

## CIDR — تقسيم الشبكات

```
10.0.0.0/8   →  ١٦.٧ مليون عنوان
10.0.0.0/16  →  ٦٥,٥٣٦ عنواناً
10.0.0.0/24  →  ٢٥٦ عنواناً
10.0.0.0/28  →  ١٤ عنواناً صالحاً (Azure Gateway Subnet)
10.0.0.0/32  →  عنوان واحد
```

### كيف تحسب عدد العناوين؟

```
الصيغة: 2^(32 - CIDR)
مثال: /24 → 2^(32-24) = 2^8 = 256 عنواناً (ناقص ٢ = ٢٥٤ قابلة للاستخدام)
```

## DNS — دليل هاتف الإنترنت

```bash
nslookup google.com
# Server:  8.8.8.8
# Address: 142.250.185.78  ← هذا ما يحدث: اسم → رقم

dig google.com +short      # أداة أقوى للاستعلام
host google.com             # بسيطة وسريعة
```

### سيناريو: التطبيق لا يصل إلى قاعدة البيانات

```bash
# الخطأ: "could not translate host name db.cloudnova.com"

# ١. هل DNS يعمل؟
nslookup db.cloudnova.com
# ** server can't find db.cloudnova.com: NXDOMAIN ← غير موجود!

# ٢. جرب اسم آخر
nslookup google.com  # يعمل ← المشكلة في السجل الخاص بنا

# ٣. تحقق من سجلات DNS في Azure
az network dns record-set list -g dns-rg -z cloudnova.com
# لا يوجد سجل db! ← السبب: لم يُنشأ بعد

# ٤. الحل: أنشئ السجل
az network dns record-set a add-record \
  -g dns-rg -z cloudnova.com -n db -a 10.0.1.10
```

## أدوات تشخيص الشبكة

```bash
ping 10.0.1.10           # هل الجهاز موجود؟
traceroute google.com    # ما المسار؟
nslookup example.com     # ما عنوان IP؟
curl -I https://api.com  # رؤوس HTTP فقط
curl -v https://api.com   # تفاصيل الاتصال كاملة
telnet 10.0.1.10 5432    # هل المنفذ مفتوح؟ (PostgreSQL)
nc -zv 10.0.1.10 5432    # بديل حديث لـ telnet
```

## سيناريو CloudNova: 502 Bad Gateway

> **الموقف:** العملاء يرون `502 Bad Gateway`. التطبيق لا يستجيب.

```bash
# ١. هل الـ backend شغال؟
systemctl status backend-api
# inactive (dead) ← الخدمة متوقفة!

# ٢. لماذا توقفت؟
tail -100 /var/log/backend-api/error.log
# "FATAL: could not connect to database: Connection refused"

# ٣. هل قاعدة البيانات شغالة؟
systemctl status postgresql
# active (running) ← قاعدة البيانات شغالة!

# ٤. المشكلة في الشبكة بين التطبيق وقاعدة البيانات؟
telnet 10.0.1.10 5432
# Connection refused ← المنفذ مغلق!

# ٥. تحقق من مجموعة أمان الشبكة NSG
az network nsg rule list -g prod-rg --nsg-name backend-nsg
# لا توجد قاعدة تسمح بالمنفذ 5432!

# ٦. الحل: أضف قاعدة
az network nsg rule create -g prod-rg --nsg-name backend-nsg \
  --name AllowPostgres --priority 110 \
  --destination-port-ranges 5432 --access Allow
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
