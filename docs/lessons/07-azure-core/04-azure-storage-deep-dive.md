---
sidebar_position: 4
title: "تخزين Azure بعمق"
description: "Blob، Files، Disks، Queues، Tables — كل أنواع التخزين في Azure مع استخداماتها."
---

# تخزين Azure بعمق

> "البيانات هي النفط الجديد. والتخزين هو المستودع. اختر المستودع الخطأ، وستخسر ثروتك."

## 🎯 أهداف التعلم

- فهم كل أنواع Azure Storage واستخداماتها
- اختيار Tier التخزين المناسب (Hot/Cool/Archive)
- تكوين Lifecycle Management Policies
- تأمين Storage Accounts
- استكشاف مشاكل الأداء

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

---

## 🏗️ أنواع التخزين

| النوع | الاستخدام | مثال |
|-------|-----------|------|
| **Blob** | ملفات، صور، logs | صور المنتجات، سجلات التطبيق |
| **Files** | SMB/NFS shares | ملفات مشتركة بين VMs |
| **Queues** | مراسلة بين التطبيقات | مهام المعالجة الخلفية |
| **Tables** | NoSQL key-value | بيانات التهيئة |
| **Disks** | أقراص VM | نظام التشغيل والبيانات |

### اختيار Tier التخزين

| Tier | الوصول | التكلفة (لكل GB) | الاستخدام |
|------|--------|-----------------|-----------|
| **Hot** | فوري | $$$ | بيانات نشطة |
| **Cool** | فوري | $$ | 30 يوماً بدون وصول |
| **Cold** | فوري | $ | 90 يوماً بدون وصول |
| **Archive** | ساعات | ¢ | نسخ احتياطية قديمة |

### Lifecycle Management

```json
{
  "rules": [
    {
      "name": "moveToCool",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["logs/"]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 90 },
            "delete": { "daysAfterModificationGreaterThan": 365 }
          }
        }
      }
    }
  ]
}
```

```bash
az storage account management-policy create \
  --account-name cloudnovadiag \
  --resource-group cloudnova \
  --policy @lifecycle-policy.json
```

### تأمين Storage Account

```bash
# تعطيل anonymous access
az storage account update \
  --name cloudnovadiag \
  --allow-blob-public-access false

# تفعيل firewall لشبكة محددة فقط
az storage account network-rule add \
  --account-name cloudnovadiag \
  --subnet /subscriptions/.../app-subnet

# الحد الأدنى TLS 1.2
az storage account update \
  --name cloudnovadiag \
  --min-tls-version TLS1_2
```

---

## 🏛️ سيناريو CloudNova

**المشكلة**: فاتورة التخزين تضاعفت 3 مرات في شهر واحد.

**التحقيق**: اكتشفنا أن الـ logs من 6 أشهر لا تزال في Hot tier. 500GB من السجلات القديمة تكلف $20/شهر، بينما في Cool كانت ستكلف $5.

**الحل**: Lifecycle Management ينقل السجلات تلقائياً بعد 30 يوماً.

---

## 🎤 مقابلة

1. **"متى تستخدم Blob vs Files vs Disk؟"**
2. **"كيف تصمم استراتيجية نسخ احتياطي في Azure؟"**

---

[← VNet Peering](./03-azure-networking-vnet-peering) | [→ Governance](./05-azure-governance-management-groups) | [🏠 الرئيسية](/)
