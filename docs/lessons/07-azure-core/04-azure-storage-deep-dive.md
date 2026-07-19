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
  "rules": [{
    "name": "moveToCool",
    "enabled": true,
    "type": "Lifecycle",
    "definition": {
      "filters": { "blobTypes": ["blockBlob"], "prefixMatch": ["logs/"] },
      "actions": {
        "baseBlob": {
          "tierToCool": { "daysAfterModificationGreaterThan": 30 },
          "tierToArchive": { "daysAfterModificationGreaterThan": 90 },
          "delete": { "daysAfterModificationGreaterThan": 365 }
        }
      }
    }
  }]
}
```

### تأمين Storage Account

```bash
az storage account update --name cloudnovadiag --allow-blob-public-access false
az storage account update --name cloudnovadiag --min-tls-version TLS1_2
az storage account network-rule add --account-name cloudnovadiag --subnet /subscriptions/.../app-subnet
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

**المشكلة**: فاتورة التخزين تضاعفت 3 مرات.

**التحقيق**: logs من 6 أشهر في Hot tier. 500GB = $20/شهر بدلاً من $5 في Cool.

**الحل**: Lifecycle Management ينقل السجلات تلقائياً بعد 30 يوماً.

### استراتيجية النسخ الاحتياطي

```bash
# Soft delete للحماية من الحذف غير المقصود
az storage account blob-service-properties update \
  --account-name cloudnovadiag \
  --enable-delete-retention true \
  --delete-retention-days 7

# Versioning
az storage account blob-service-properties update \
  --account-name cloudnovadiag \
  --enable-versioning true

# Backup to another region
az storage account create --name cloudnovadiagdr --location northeurope ...
az storage blob copy start-batch --destination-container logs \
  --account-name cloudnovadiagdr --source-account-name cloudnovadiag
```

---

## 🎨 طبقة المعماري

### متى تستخدم ماذا؟

| الحاجة | الخدمة |
|--------|--------|
| ملفات للتطبيقات (REST) | Blob Storage |
| SMB share للـ VMs | Azure Files |
| NoSQL بسيط | Table Storage |
| Queue للـ microservices | Queue Storage / Service Bus |
| قرص لـ VM | Managed Disks |

---

## 🛠️ تدريبات

### تمرين 1: Lifecycle Policy
اكتب policy تنقل logs إلى Cool بعد 14 يوماً وإلى Archive بعد 90 يوماً.

### تمرين 2: تدقيق أمان
افحص Storage Account وتأكد من: TLS ≥ 1.2، public access = false، soft delete = enabled.

---

## 📝 تقييم

### ✅ فحص المعرفة
1. متى تستخدم Hot vs Cool vs Archive tier؟
2. كيف تحمي Storage Account من الحذف غير المقصود؟
3. ما الفرق بين Blob و Files؟
4. كيف تخفض تكاليف التخزين؟

### 🃏 بطاقات

| السؤال | الإجابة |
|--------|---------|
| Blob Storage | تخزين كائنات (صور، ملفات، logs) |
| Lifecycle Management | نقل/حذف البيانات تلقائياً حسب العمر |
| Soft Delete | استرجاع البيانات المحذوفة خلال فترة محددة |
| Hot Tier | بيانات نشطة، وصول فوري، تكلفة عالية |

---

## 🎤 مقابلة

1. **"متى تستخدم Blob vs Files vs Disk؟"**
   → Blob: REST access. Files: SMB/NFS. Disk: VM attached.

2. **"كيف تصمم استراتيجية نسخ احتياطي في Azure؟"**
   → Soft delete + Versioning + Geo-replication + Lifecycle management

---

## 📚 مراجع

| النوع | الرابط |
|-------|--------|
| درس مرتبط | [VNet Peering](./03-azure-networking-vnet-peering) |
| درس مرتبط | [Governance](./05-azure-governance-management-groups) |
| شهادة | AZ-104 (Storage) |

---

[← VNet Peering](./03-azure-networking-vnet-peering) | [→ Governance](./05-azure-governance-management-groups) | [🏠 الرئيسية](/)
