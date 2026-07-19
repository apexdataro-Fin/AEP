---
sidebar_position: 2
title: "مجموعات أمن الشبكة والجدران النارية"
description: "NSG، ASG، Service Tags، Firewall Policies — أمن الشبكات في Azure وفي البيئات المحلية."
---

# مجموعات أمن الشبكة والجدران النارية

> "الأمن ليس منتجاً تشتريه، إنه ممارسة تطبقها على كل طبقة."

## 🎯 أهداف التعلم

- إتقان Azure NSG و ASG
- فهم Service Tags و Application Security Groups
- تكوين Azure Firewall Policies
- تصميم Hub-Spoke network security
- استكشاف الثغرات الأمنية في الشبكة

## ⏱️ الوقت المقدر: 45 دقيقة | المستوى: Intermediate

---

## 🧠 الطبقة البسيطة

تخيل فندقاً كبيراً. كل طابق له مفتاح مختلف. النزلاء في الطابق 5 لا يمكنهم دخول الطابق 10. هذا هو **Network Segmentation**: عزل الموارد الشبكية عن بعضها.

---

## 🏗️ الطبقة الأساسية

### Application Security Groups (ASG)

بدلاً من إدارة الـ IP addresses يدوياً، استخدم **ASG** لتجميع الخوادم:

```bash
# إنشاء ASG لخوادم الويب
az network asg create \
  --resource-group cloudnova \
  --name WebServers \
  --location westeurope

# ربط VM بالـ ASG
az network nic ip-config update \
  --resource-group cloudnova \
  --nic-name web1-nic \
  --name ipconfig1 \
  --application-security-groups WebServers

# NSG يستخدم ASG بدلاً من IP
az network nsg rule create \
  --nsg-name app-tier-nsg \
  --name AllowFromWebTier \
  --priority 100 \
  --source-asgs WebServers \
  --destination-port-ranges 8080 \
  --access Allow
```

### Azure Firewall — Enterprise Grade

| الميزة | NSG | Azure Firewall |
|--------|-----|---------------|
| **النطاق** | Subnet/NIC | VNet بالكامل |
| **FQDN Filtering** | ❌ | ✅ |
| **Threat Intelligence** | ❌ | ✅ |
| **TLS Inspection** | ❌ | Premium tier |
| **التكلفة** | مجاني | ~$900/شهر |

```bash
# إنشاء Azure Firewall في Hub VNet
az network firewall create \
  --name cloudnova-fw \
  --resource-group cloudnova-hub \
  --location westeurope

# Network Rule: السماح بـ DNS فقط
az network firewall network-rule create \
  --firewall-name cloudnova-fw \
  --collection-name AllowDNS \
  --name AllowDNS \
  --protocols UDP \
  --source-addresses 10.0.0.0/8 \
  --destination-addresses 168.63.129.16 \
  --destination-ports 53
```

---

## 🏛️ طبقة الإنتاج

### سيناريو CloudNova: ثغرة في الشبكة

أثناء penetration test ربع سنوي، اكتشف الفريق:
1. **الثغرة**: port 3389 (RDP) مفتوح من الإنترنت
2. **السبب**: أحد المطورين فتحه للتجربة ونسي إغلاقه
3. **الإصلاح**: Azure Policy يمنع فتح RDP من الإنترنت + Just-in-Time VM Access
4. **الدرس**: لا تثق أبداً في الإعدادات اليدوية

### Azure Policy للشبكات

```json
{
  "policyRule": {
    "if": {
      "allOf": [
        { "field": "type", "equals": "Microsoft.Network/networkSecurityGroups/securityRules" },
        { "field": "Microsoft.Network/networkSecurityGroups/securityRules/destinationPortRange", "equals": "3389" },
        { "field": "Microsoft.Network/networkSecurityGroups/securityRules/sourceAddressPrefix", "equals": "Internet" }
      ]
    },
    "then": { "effect": "Deny" }
  }
}
```

---

## 🛠️ تدريبات

### تمرين: تدقيق الشبكة

```bash
# سكربت Python لفحص NSGs المفتوحة للإنترنت
cat > audit_nsg.py << 'EOF'
import subprocess, json

result = subprocess.run(
    ['az', 'network', 'nsg', 'rule', 'list', '--nsg-name', 'web-tier-nsg', '-g', 'cloudnova', '-o', 'json'],
    capture_output=True, text=True
)
rules = json.loads(result.stdout)
for rule in rules:
    if rule.get('sourceAddressPrefix') == 'Internet' and rule.get('access') == 'Allow':
        print(f"⚠️  قاعدة مفتوحة: {rule['name']} → port {rule.get('destinationPortRange')}")
EOF
python3 audit_nsg.py
```

---

[← Security Fundamentals](./01-iam-fundamentals) | [→ Encryption & TLS](./03-encryption-tls-pki) | [🏠 الرئيسية](/)
