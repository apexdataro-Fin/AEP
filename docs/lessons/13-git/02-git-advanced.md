---
sidebar_position: 2
title: "Git المتقدم: إصلاح الكوارث وإدارة التاريخ"
description: "rebase, bisect, reflog, hooks, submodules - أدوات Git التي يحتاجها كل مهندس محترف."
---

# Git المتقدم: إصلاح الكوارث وإدارة التاريخ

> "Git لا ينسى شيئاً أبداً. reflog هو آلة الزمن الخاصة بك."

## 🎯 أهداف التعلم

- إعادة كتابة التاريخ بأمان باستخدام `rebase`
- العثور على الأخطاء باستخدام `git bisect`
- استعادة العمل المفقود عبر `reflog`
- أتمتة سير العمل بـ `Git Hooks`
- إدارة المشاريع الكبيرة بـ `submodules` و `subtree`

---

## ١. إعادة كتابة التاريخ بـ Rebase

### 🔹 الأساسيات: لماذا Rebase؟

لديك فرع `feature/auth` متفرع من `main` منذ أسبوع. خلال هذا الأسبوع، تقدم `main` بـ ٢٠ commit جديدة. تريد دمج تغييراتك دون commit merge زائد.

```bash
# السيناريو: أنت في feature/auth
git fetch origin
git rebase origin/main

# ما يحدث:
# 1. Git يُخزّن commits الخاصة بك مؤقتاً
# 2. يُحرك الفرع ليبدأ من آخر main
# 3. يُعيد تطبيق commits الخاصة بك واحدة تلو الأخرى
```

### 🔹 Interactive Rebase: تنظيم التاريخ

```bash
# دمج آخر ٤ commits في commit واحد
git rebase -i HEAD~4

# داخل المحرر:
pick a1b2c3d إضافة نظام المصادقة
squash e4f5g6h تصحيح: إصلاح خطأ إملائي    # يُدمج مع السابق
squash i7j8k9l تحسين: إعادة تسمية متغير    # يُدمج مع السابق
pick m0n1o2p إضافة Middleware الحماية

# النتيجة: ٤ commits أصبحت ٢ فقط - تاريخ نظيف
```

### 🔹 حل التعارضات أثناء Rebase بذكاء

```bash
# Git يتوقف عند تعارض
git status
# CONFLICT in src/auth/login.ts

# الخيار ١: استخدام أداة دمج مرئية
git mergetool

# الخيار ٢: حل يدوي
# افتح الملف وابحث عن <<<<<<< و >>>>>>>
git add src/auth/login.ts
git rebase --continue

# الخيار ٣: تخطي هذا الـ commit
git rebase --skip

# الخيار ٤: إلغاء الـ rebase بالكامل والعودة
git rebase --abort
```

### ⚠️ القاعدة الذهبية

> **لا تستخدم Rebase أبداً على فروع تم دفعها وتعاون عليها آخرون.**

`rebase` يُعيد كتابة التاريخ. إذا دفعتَ فرعاً وعمل عليه زملاؤك ثم أعدتَ rebase ودفعتَ بالقوة (`--force`)، ستُدمّر تاريخهم.

---

## ٢. العثور على الأخطاء بـ Git Bisect

### 🔹 المشهد الواقعي

أنت مهندس في CloudNova. آخر release كان يعمل. اليوم، اكتشفتَ أن endpoint الـ `/api/billing` يعيد 500. المشكلة: بين آخر release والآن، هناك ١٢٠ commit. كيف تجد الـ commit المُخطئ؟

```bash
# ١. ابدأ عملية bisect
git bisect start

# ٢. علّم commit جيد (كان يعمل)
git bisect good v2.4.0

# ٣. علّم commit سيء (لا يعمل)
git bisect bad HEAD

# ٤. Git ينتقل تلقائياً لمنتصف المسافة
# → اختبر التطبيق الآن
# هل يعمل؟ git bisect good
# لا يعمل؟ git bisect bad

# ٥. كرّر. بعد ~٧ خطوات (log₂(120)) ستجد الـ commit المُخطئ

# ٦. أنهِ الجلسة
git bisect reset
```

### 🔹 أتمتة Bisect

```bash
# ابدأ bisect
git bisect start HEAD v2.4.0

# أخبر Git أن الـ commit الحالي سيء
git bisect bad

# استخدم سكريبت آلي
git bisect run python3 -c "
import requests
r = requests.get('http://localhost:3000/api/billing')
assert r.status_code == 200, f'Failed: {r.status_code}'
"

# بعد ثوانٍ، Git يُخبرك بأول commit مُخطئ:
# "a1b2c3d is the first bad commit"
```

### 📖 قصة من الحياة الواقعية

في CloudNova، تعطلت الفوترة فجأة. ١٢٠ commit. استخدم المهندس `git bisect` مع سكريبت يختبر الـ API. خلال ٣٠ ثانية، وجد أن المشكلة كانت في commit غيّر تنسيق التاريخ من `YYYY-MM-DD` إلى `DD/MM/YYYY`. الإصلاح استغرق دقيقة واحدة.

---

## ٣. آلة الزمن: Git Reflog

### 🔹 كارثة: حذفتُ فرعاً بالخطأ!

```bash
# قمت بحذف الفرع
git branch -D feature/payment-v2

# ذعر... كل العمل اختفى!

# الحل: Reflog
git reflog

# الناتج:
# a1b2c3d HEAD@{0}: checkout: moving from feature/payment-v2 to main
# d4e5f6g HEAD@{1}: commit: إكمال بوابة الدفع
# h7i8j9k HEAD@{2}: commit: إضافة Stripe Integration

# آخر commit كان قبل الحذف: d4e5f6g
git checkout -b feature/payment-v2 d4e5f6g

# تم! كل العمل عاد.
```

### 🔹 Rebase كارثي؟ Reflog ينقذك

```bash
# حاولت rebase وفشلت وأفسدت التاريخ
git reflog
# ابحث عن HEAD@{X} قبل الـ rebase

# عد بالزمن إلى ما قبل الكارثة
git reset --hard HEAD@{5}
```

### ⏰ مدة بقاء Reflog

```bash
# افتراضياً ٩٠ يوماً للـ commits التي كانت في branches
# ٣٠ يوماً للـ commits غير المرتبطة بأي فرع
git config gc.reflogExpire "180 days"
```

---

## ٤. Git Hooks: أتمتة الجودة

### 🔹 أمثلة عملية

```bash
# 📁 .git/hooks/

# pre-commit: منع الأخطاء قبل commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# فحص الـ lint قبل السماح بالـ commit
npx eslint src/ --max-warnings 0
if [ $? -ne 0 ]; then
    echo "❌ ESLint فشل. أصلح الأخطاء أولاً."
    exit 1
fi
echo "✅ ESLint ناجح"
EOF
chmod +x .git/hooks/pre-commit

# commit-msg: فرض نمط موحد للرسائل
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/bash
# فرض Conventional Commits
PATTERN="^(feat|fix|docs|style|refactor|test|chore|ci|perf)(\(.+\))?: .{10,}"
if ! grep -qE "$PATTERN" "$1"; then
    echo "❌ استخدم Conventional Commits:"
    echo "   feat: إضافة نظام X"
    echo "   fix: إصلاح مشكلة Y"
    exit 1
fi
EOF
chmod +x .git/hooks/commit-msg

# pre-push: منع push الفروع الخطيرة
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    echo "❌ ممنوع الدفع مباشرة إلى $BRANCH. استخدم Pull Request."
    exit 1
fi
EOF
chmod +x .git/hooks/pre-push
```

### 🔹 مشاركة Hooks مع الفريق

Hooks لا تُدفع مع الـ repo. استخدم `husky` أو `lefthook`:

```bash
npm install --save-dev husky
npx husky init
echo "npx eslint src/ --max-warnings 0" > .husky/pre-commit
git add .husky/pre-commit
```

---

## ٥. Git Submodules: إدارة المشاريع الضخمة

### 🔹 المشكلة: Infrastructure as Code موزع

في CloudNova، لديك ٣ مستودعات: `infra-core`، `infra-monitoring`، `infra-networking`. تريد استخدامها معاً في مشروع `infra-azure` دون نسخ الكود.

```bash
# إضافة submodule
git submodule add https://github.com/CloudNova/infra-core.git modules/core
git submodule add https://github.com/CloudNova/infra-monitoring.git modules/monitoring

# النتيجة: ملف .gitmodules يُسجل العلاقات
cat .gitmodules
# [submodule "modules/core"]
#     path = modules/core
#     url = https://github.com/CloudNova/infra-core.git

# استنساخ المشروع مع submodules
git clone --recurse-submodules https://github.com/CloudNova/infra-azure.git

# تحديث submodules لآخر إصدار
git submodule update --remote --recursive
```

### ⚠️ تحذير: Submodules صعبة

- كل مطور يجب أن يتذكر `git submodule update --init --recursive`
- التبديل بين commits في الـ main repo لا يُغيّر الـ submodules تلقائياً
- **البديل الحديث**: استخدم monorepo مع أدوات مثل Turborepo أو Nx

---

## ٦. أوامر متقدمة إضافية

### Git Stash المتقدم

```bash
# حفظ العمل الحالي برسالة
git stash push -m "عمل على بوابة الدفع - غير مكتمل"

# عرض كل المخبآت
git stash list
# stash@{0}: On feature/payment: عمل على بوابة الدفع - غير مكتمل
# stash@{1}: On main: إصلاح طارئ - CVE-2024

# استعادة stash معين دون حذفه
git stash apply stash@{0}

# استعادة stash لفرع جديد
git stash branch feature/payment-recovery stash@{0}
```

### Git Worktree: العمل على فرعين معاً

```bash
# تريد العمل على feature جديد دون إزعاج branchك الحالي
git worktree add ../project-hotfix hotfix/critical-bug

# الآن لديك:
# ~/project/         ← فرعك الأصلي
# ~/project-hotfix/  ← فرع الـ hotfix في نافذة منفصلة

# بعد الانتهاء
git worktree remove ../project-hotfix
```

### Git Blame المتقدم

```bash
# من غيّر هذا السطر ومتى؟
git blame src/auth/login.ts -L 45,60

# تجاهل commits تنسيقية (formatting)
git blame --ignore-revs-file .git-blame-ignore-revs src/auth/login.ts

# ملف .git-blame-ignore-revs يحتوي commit hashes للتنسيقات
# أضفها بـ: git config blame.ignoreRevsFile .git-blame-ignore-revs
```

---

## 🏢 سيناريو CloudNova: يوم كارثة Git

الموقف: سلمى، مهندسة مبتدئة، نفّذت `git push --force` على `main` عن طريق الخطأ. ٣ أيام من العمل اختفت.

### ما حدث

```bash
# ١. أحدهم فحص reflog على الـ remote (إذا كان GitHub، في Events API)
git reflog show origin/main

# ٢. استعادة آخر commit صحيح
git push origin <commit-hash>:refs/heads/main

# ٣. الحماية للمستقبل
# في GitHub Settings → Branches → Add rule:
# ✓ Require pull request reviews before merging
# ✓ Block force pushes
```

### الدرس المستفاد

1. **لا تستخدم force push أبداً على الفروع المشتركة**
2. **فعّل branch protection rules فوراً**
3. **reflog صديقك في الكوارث**
4. **خذ نسخة احتياطية قبل أي عملية خطيرة:** `git branch backup-$(date +%Y%m%d)`

---

## 🧠 Active Recall

1. ما الفرق بين `merge` و `rebase`؟ ومتى تختار كل منهما؟
2. كيف تجد commit مُخطئ بين ٥٠٠ commit خلال ١٠ خطوات؟
3. حذفتَ فرعاً بالخطأ. كيف تستعيده؟
4. لماذا `push --force` خطير على الفروع المشتركة؟
5. كيف تفرض Conventional Commits على فريقك تلقائياً؟

---

## 📝 تمرين Feynman

اشرح `git rebase --interactive` لزميل جديد كما لو كنت تشرح له كيف ينظف غرفته: اجمع الأشياء المتشابهة (squash)، تخلّص من الزائد (drop)، أعد الترتيب (reorder)، ونظّف المكان قبل أن يراه الضيوف (push).

---

## 🃏 بطاقات تعليمية

| السؤال                      | الإجابة                                        |
| --------------------------- | ---------------------------------------------- |
| أمر لعرض آخر ١٠ عمليات Git  | `git reflog -10`                               |
| أمر لدمج آخر ٣ commits      | `git rebase -i HEAD~3` ثم `squash`             |
| أمر للعثور على commit مُخطئ | `git bisect start` ثم `good`/`bad`             |
| أمر لإنشاء مساحة عمل منفصلة | `git worktree add <path> <branch>`             |
| استعادة commit محذوف        | `git checkout -b recovered <hash-from-reflog>` |

---

## 🎯 أسئلة مقابلة

### س: حدث push --force على main بالخطأ. ماذا تفعل؟

**الإجابة المثالية:**

1. لا داعي للذعر — Git لا يحذف commits فوراً
2. `git reflog show origin/main` للعثور على آخر commit صحيح
3. `git push origin <hash>:refs/heads/main` لإعادته
4. فعّل branch protection rules فوراً
5. أبلغ الفريق واشرح ما حدث بشفافية

### س: متى تفضل rebase على merge؟

- **Rebase**: للفروع الشخصية، تاريخ نظيف، قبل فتح PR
- **Merge**: للفروع المشتركة، الحفاظ على السياق الكامل، دمج PR
- القاعدة: "rebase فروعك، merge فروع الفريق"

---

## 📚 روابط

- [Pro Git Book - Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
- [Atlassian Git Rebase Guide](https://www.atlassian.com/git/tutorials/rewriting-history)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

<div align="center">

**[→ GitHub Workflows](../14-github/01-github-workflows)

---

## 🏛️ طبقة الإنتاج: Git في المؤسسات

### Monorepo مع Git

```bash
# هيكل Monorepo
monorepo/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── shared/
│   └── config/
├── infrastructure/
│   └── terraform/
└── .github/
    └── CODEOWNERS

# CODEOWNERS للـ monorepo
apps/api/     @cloudnova/api-team
apps/web/     @cloudnova/web-team
infrastructure/ @cloudnova/platform-team
.github/      @cloudnova/devops-team
```

### Git LFS للملفات الكبيرة

```bash
# النماذج والصور الكبيرة لا ترفع مباشرة لـ Git
git lfs track "*.bin" "*.h5" "*.tar.gz"
git add .gitattributes
git commit -m "Configure Git LFS for model files"
```

---

## 🛠️ تدريبات

### تمرين ١: Squash commits (سهل)

> ادمج آخر 5 commits في commit واحد مع رسالة واضحة.

### تمرين ٢: bisect آلي (متوسط)

> اكتب script يختبر endpoint. استخدمه مع `git bisect run`.

### تحدي: كارثة محاكاة (متقدم)

> أحدهم force push على main. استعد الحالة. فعّل branch protection.

### 📝 تقييم

**س١:** كيف تدمج آخر 3 commits في واحد؟

<details><summary>الإجابة</summary>`git rebase -i HEAD~3` ثم `squash` للـ commits 2 و 3.</details>

**س٢:** ما فائدة `git worktree`؟

<details><summary>الإجابة</summary>العمل على فرعين في نفس الوقت بدون clone جديد. مثالي لـ hotfix أثناء العمل على feature.</details>

**س٣:** كيف تمنع force push على main؟

<details><summary>الإجابة</summary>Branch protection rules في GitHub: "Block force pushes" + "Require PR before merging".</details>

### 🎤 مقابلة

**"كيف تجد bug في 200 commit خلال 8 خطوات؟"**
→ `git bisect`. إنه binary search — log₂(200) ≈ 8 خطوات. زد script آلي مع `bisect run` لتسريع العملية.

**"ماذا تفعل إذا أفسدت history بـ rebase؟"**
→ `git reflog` يعرض كل العمليات. `git reset --hard HEAD@{N}` للعودة لما قبل الـ rebase.

---

## 📚 مراجع

- [Git Fundamentals](./01-git-fundamentals)
- [GitHub Workflows](../14-github/01-github-workflows)
- 📖 [Pro Git Book](https://git-scm.com/book/en/v2)

---

[← Git Fundamentals](./01-git-fundamentals) | [🏠 الرئيسية](/)
**

</div>
