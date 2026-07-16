---
sidebar_position: 1
title: "إدارة الهوية والوصول"
description: "Azure AD، RBAC، PIM، Conditional Access، والهوية كحد أمان جديد."
---

# إدارة الهوية والوصول

> **"الهوية هي محيط الأمان الجديد. لم تعد جدران الحماية كافية."**

## التسلسل الهرمي

```
Tenant (Azure AD — مؤسستك)
├── Management Groups (اختياري)
│   ├── Subscriptions (الفوترة)
│   │   ├── Resource Groups (منطقية)
│   │   │   └── Resources (RBAC هنا)
```

## RBAC عملياً

```bash
# خطأ شائع — صلاحية واسعة جداً
az role assignment create \
  --assignee ahmed@cloudnova.com \
  --role "Contributor" \
  --scope /subscriptions/xxx    # ❌ الاشتراك كله!

# الصحيح — تحديد النطاق
az role assignment create \
  --assignee ahmed@cloudnova.com \
  --role "Contributor" \
  --scope /subscriptions/xxx/resourceGroups/app-prod-rg  # ✅ محدد
```

## PIM — Just-in-Time Access

```bash
# بدلاً من صلاحية دائمة مدمرة:
# ١. المستخدم يطلب تفعيل الدور (مع تبرير)
# ٢. مدير يوافق (أو تلقائي إذا كانت السياسة تسمح)
# ٣. الصلاحية تفعّل لمدة ٤ ساعات
# ٤. تنتهي تلقائياً
# ٥. كل شيء مسجّل ومدقق
```

## Conditional Access

```yaml
قواعد الوصول المشروط:
  - إذا: تسجيل دخول من دولة غير معروفة
    إذن: طلب MFA
  - إذا: جهاز غير مسجل في Intune
    إذن: منع الوصول
  - إذا: دور Global Admin
    إذن: MFA دائماً + جهاز مسجل
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
