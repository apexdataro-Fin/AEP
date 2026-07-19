---
sidebar_position: 4
title: "تأمين Linux"
description: "تأمين خوادم Linux: auditd، SELinux/AppArmor، fail2ban، CIS Benchmark، وأفضل الممارسات."
---

# تأمين Linux للإنتاج

> "خادم Linux غير مؤمن على الإنترنت = باب مفتوح. اغلقه قبل أن يدخل أحد."

## 🎯 أهداف التعلم
- تطبيق CIS Benchmark hardening
- تفعيل SELinux/AppArmor
- إعداد fail2ban و auditd
- تأمين SSH والخدمات
- اكتشاف التسلل والاستجابة

---

## ١. CIS Benchmark — المعيار الذهبي

```bash
# فحص الامتثال
wget https://github.com/aquasecurity/trivy/releases/latest/download/trivy_$(uname -s)_amd64.deb
sudo dpkg -i trivy_*.deb
trivy fs --security-checks vuln,config --severity HIGH,CRITICAL /

# 👈 سيعرض كل الثغرات والمخالفات لأفضل الممارسات
```

## ٢. fail2ban — حماية من brute force

```bash
sudo apt install fail2ban -y
# /etc/fail2ban/jail.local
[sshd]
enabled = true
maxretry = 3
bantime = 3600  # ساعة حظر
findtime = 600   # خلال 10 دقائق

sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

## ٣. auditd — تتبع كل شيء

```bash
sudo auditctl -w /etc/passwd -p wa -k identity
sudo auditctl -w /etc/ssh/sshd_config -p wa -k ssh_config
sudo ausearch -k identity --raw | aureport -f -i
```

## 🛠️ تدريبات
**تمرين:** شغّل Trivy على خادم وأصلح HIGH findings.
**تحدي:** أنشئ fail2ban jail مخصص لتطبيقك.

### 📝 تقييم
**س١:** CIS Benchmark؟ → معيار لأفضل ممارسات الأمان.
**س٢:** fail2ban؟ → يحظر IPs بعد محاولات فاشلة.
**س٣:** auditd؟ → يسجل أحداث النظام للتحقيق.

---

[← Bash Scripting](./03-bash-scripting-mastery) | [→ Troubleshooting](./05-linux-troubleshooting-production) | [🏠 الرئيسية](/)
