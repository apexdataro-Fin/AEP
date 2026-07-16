---
sidebar_position: 1
title: "الأمن في السحابة"
description: "IAM، RBAC، مبدأ الامتياز الأدنى، الهوية المُدارة، وأمن الشبكات."
---

# الأمن في السحابة

> **"الأمان ليس مرحلة أخيرة. إنه جزء من كل خطوة، من أول سطر كود إلى آخر نشر."**

## المصادقة مقابل الصلاحية

| المفهوم | السؤال | مثال |
|---|---|---|
| **Authentication — المصادقة** | من أنت؟ | تسجيل الدخول، MFA، كلمة المرور |
| **Authorization — الصلاحية** | ماذا تستطيع أن تفعل؟ | الأدوار، الأذونات |

ببساطة: المصادقة = إثبات هويتك. الصلاحية = ما سُمح لك به بعد إثبات هويتك.

## مبدأ الامتياز الأدنى

> **لا تُعطِ أحداً أكثر مما يحتاج. أبداً.**

```bash
# خطأ: إعطاء Contributor للجميع
az role assignment create --assignee user@cloudnova.com \
  --role "Contributor" --scope /subscriptions/xxx

# صحيح: تحديد النطاق بالضبط
az role assignment create --assignee user@cloudnova.com \
  --role "Contributor" --scope /subscriptions/xxx/resourceGroups/app-rg
```

## RBAC في Azure

| الدور | ماذا يسمح | لمن؟ |
|---|---|---|
| **Owner** | كل شيء (بما فيها إدارة الصلاحيات) | قادة الفريق فقط |
| **Contributor** | إنشاء وتعديل الموارد | المطورين |
| **Reader** | عرض فقط | المدققين، المتدربين |
| **User Access Admin** | إدارة الصلاحيات | مسؤولي الأمن |

## الهوية المُدارة — Managed Identity

```python
# بدلاً من:
# password = "SuperSecret123!"  ← خطر! لا تفعل هذا أبداً

# استخدم Managed Identity:
from azure.identity import ManagedIdentityCredential
credential = ManagedIdentityCredential()
# لا كلمة مرور. لا مفتاح. Azure يدير كل شيء.
```

المزايا:
- لا كلمات مرور للتسريب
- لا مفاتيح للتجديد اليدوي
- Azure يدير التدوير تلقائياً
- تدقيق كامل — كل استخدام مُسجّل

## PIM — الوصول المؤقت

بدلاً من صلاحيات دائمة: اطلب الصلاحية عند الحاجة.

```bash
# مهندس يحتاج صلاحية Contributor لمدة ٤ ساعات
# يطلب عبر Azure Portal > PIM > Activate
# النظام: موافقة تلقائية؟ يحتاج موافقة مدير؟
# بعد ٤ ساعات — الصلاحية تنتهي تلقائياً
# كل شيء مُسجّل ومدقق
```

## سيناريو CloudNova: حذف قاعدة بيانات الإنتاج

> **الموقف:** مطور جديد حذف قاعدة بيانات الإنتاج بالخطأ. التحقيق يكشف: كان لديه صلاحية Contributor على كامل الاشتراك.

**كيف نمنع التكرار؟**

1. **تقسيم الاشتراكات:** prod منفصل تماماً عن dev
2. **RBAC دقيق:** صلاحيات على مستوى Resource Group، لا Subscription
3. **Resource Lock:** `CanNotDelete` على الموارد الحرجة
4. **PIM:** صلاحيات الإنتاج مؤقتة فقط
5. **Azure Policy:** منع حذف قواعد البيانات بدون موافقة

```bash
# Resource Lock — خط الدفاع الأخير
az lock create --name "prod-db-lock" \
  --lock-type CanNotDelete \
  --resource-group prod-rg \
  --resource-name cloudnova-db
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
