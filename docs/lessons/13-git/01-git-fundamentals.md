---
sidebar_position: 1
title: "Git للمهندس السحابي"
description: "التحكم بالإصدارات للمحترفين: branching، merging، rebasing، وسير العمل مع Infrastructure as Code."
---

# Git للمهندس السحابي

> **"Git ليس مجرد `commit` و `push`. إنه نظام تتبع لكل تغيير في بنيتك التحتية. تعلمه بعمق."**

## مفاهيم أساسية

| المفهوم | المعنى | تشبيه |
|---|---|---|
| **Repository** | مجلد يتتبعه Git | خزانة الملفات |
| **Commit** | لقطة من الملفات في لحظة زمنية | صورة فوتوغرافية للمشروع |
| **Branch** | خط تطوير منفصل | نسخة من الملف للعمل عليها بأمان |
| **Remote** | نسخة من الـ repo على خادم | نسخة احتياطية على GitHub |
| **Merge** | دمج فرعين معاً | ضم نسختين في نسخة واحدة |
| **Pull Request** | طلب مراجعة قبل الدمج | طلب موافقة المدير |

## الأوامر اليومية — خريطة كاملة

```bash
# ===== البداية =====
git clone https://github.com/cloudnova/infra.git   # انسخ المشروع
git status                    # ماذا تغير؟
git diff                      # ما الفروقات بالضبط؟

# ===== دورة العمل اليومية =====
git pull origin main         # خذ آخر التحديثات
git checkout -b feature/add-alerts   # أنشئ فرعاً جديداً
# ... عدّل الملفات ...
git add monitoring.tf         # جهّز ملفاً للـ commit
git add .                     # أو جهّز كل الملفات
git commit -m "Add Prometheus alerts for API latency"
git push origin feature/add-alerts   # ارفع الفرع
# افتح Pull Request على GitHub ← راجع ← ادمج
```

## استراتيجية التفرع — Git Flow مبسط

```
main ─────●────────●────────●────── (إنتاج — دائماً نظيف)
           \      /        /
staging ───●────●────────●──────── (ما قبل الإنتاج)
             \  /
feature/xxx ──●─────────────────── (فرع العمل)
```

**القواعد الذهبية:**

1. **main نظيف دائماً.** لا تدفع إليه مباشرة أبداً
2. **فرع لكل مهمة.** `feature/add-alerts`، `fix/login-bug`
3. **Pull Request إجباري.** حتى لو كنت الوحيد في الفريق
4. **وصف commit واضح.** "Add alerts" ≠ "Add Prometheus alert for API p99 latency > 500ms"

## التعامل مع الأخطاء

```bash
# "يا إلهي! عملت commit للخطأ!"
git reset HEAD~1              # تراجع عن آخر commit (احتفظ بالتغييرات)
git reset --hard HEAD~1       # تراجع نهائي (احذف التغييرات)

# "نسيت أضيف ملفاً للـ commit"
git add forgotten-file.tf
git commit --amend --no-edit  # أضف الملف لآخر commit

# "أريد العودة لنسخة قديمة"
git log --oneline             # ابحث عن رقم الـ commit
git revert abc1234            # أنشئ commit جديداً يعكس التغييرات
```

## Git + Infrastructure as Code

بنيتك التحتية كود. تعامل معها تماماً مثل كود التطبيق:

### .gitignore لمشاريع Terraform

```bash
# .gitignore
**/.terraform/*       # مجلد المزودات — كبير لا يُرفع
*.tfstate             # ⚠️ لا ترفع state أبداً!
*.tfstate.*
*.tfvars              # قد تحتوي أسراراً
!example.tfvars       # إلا مثال القيم
.terraformrc          # بيانات اعتماد CLI
```

### PR Template لمشاريع IaC

```markdown
## ماذا يتغير؟
- إضافة Auto Scaling لخوادم الويب

## لماذا؟
- التعامل مع ارتفاع الحمل وقت الذروة (٩ صباحاً)

## خطة Terraform
<!-- الصق مخرجات terraform plan هنا -->
Plan: 3 to add, 1 to change, 0 to destroy.

## الاختبار
- [x] الخطة لا تحذف أي موارد
- [x] طبّقت في بيئة dev — الخوادم الجديدة تستجيب
- [x] دمرت الموارد الجديدة — لم يتبق شيء
```

## سيناريو CloudNova: كارثة merge

> **الموقف:** زميلك دمج PR يحذف `prevent_destroy = true` من قاعدة البيانات. `terraform apply` القادم سيحذف بيانات العملاء!

```bash
# ١. اعرف من عدّل ومتى
git log --oneline -- terraform/database.tf
# abc1234 Remove lifecycle block (محمد — أمس)

# ٢. شوف ماذا تغيّر بالضبط
git show abc1234

# ٣. اعكس التغيير
git revert abc1234
# أنشئ commit جديداً يعيد prevent_destroy

# ٤. ادفع فوراً
git push origin main

# ٥. ناقش مع محمد — لماذا أزال الحماية؟
# افتح issue للنقاش التقني
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
