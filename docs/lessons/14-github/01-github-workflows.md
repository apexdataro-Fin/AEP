---
sidebar_position: 1
title: "GitHub للمحترفين"
description: "Pull Requests, Issues, Projects, Actions، ومراجعة الكود الفعّالة."
---

# GitHub للمحترفين

> **"GitHub ليس مجرد مكان لتخزين الكود. إنه منصة تعاون كاملة."**

## Pull Request — قلب التعاون

```bash
git checkout -b feature/add-alerts
# ... عدّل الكود ...
git add .
git commit -m "Add Prometheus alert for API latency"
git push origin feature/add-alerts
# افتح PR على GitHub ← راجع ← ناقش ← ادمج
```

## وصف PR الجيد

```markdown
## ماذا؟
- إضافة تنبيه Prometheus لزمن استجابة API

## لماذا؟
- اكتشفنا بطئاً في API الأسبوع الماضي ولم ننتبه إلا بعد شكوى عميل

## كيف اختبرت؟
- [x] الخطة لا تغير أي موارد
- [x] اختبرت التنبيه محلياً (curl للمقياس)
- [x] طبقت في staging — التنبيه اشتغل

## مرتبط بـ
- Fixes #142 (حادثة API الأسبوع الماضي)
```

## مراجعة الكود الفعّالة

| ✅ افعل | ❌ لا تفعل |
|---|---|
| راجع المنطق والأمان والأداء | دقق في التنسيق (هذه مهمة الأتمتة!) |
| اسأل أسئلة، اقترح بدائل | افرض تغييرات بدون شرح |
| راجع خلال ٢٤ ساعة | اترك PRs لأيام |
| امدح الحلول الجيدة | انتقد فقط |

## Issues — تتبع العمل

```yaml
# .github/ISSUE_TEMPLATE/bug.yml
name: تقرير خطأ
body:
  - type: input
    attributes:
      label: البيئة
      description: dev/staging/prod؟
  - type: textarea
    attributes:
      label: السلوك المتوقع
  - type: textarea
    attributes:
      label: السلوك الفعلي
```

## سيناريو CloudNova: مراجعة PR تنقذ الإنتاج

> **الموقف:** PR لإضافة `terraform apply` تلقائي. المراجع لاحظ:

```hcl
resource "azurerm_postgresql_database" "main" {
  name = "cloudnova-db-v2"  # ← تغير الاسم!
}
```

**ما اكتشفه المراجع:** تغيير الاسم = Terraform سيحذف قاعدة البيانات القديمة وينشئ جديدة. دون ترحيل البيانات!

**التعليق:** "تغيير الاسم سيحذف قاعدة البيانات. هل أعددت ترحيلاً للبيانات؟"

**النتيجة:** منع كارثة. هذا هو هدف مراجعة الكود.

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
