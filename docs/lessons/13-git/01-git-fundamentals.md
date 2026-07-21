---
sidebar_position: 1
title: "Git من الصفر إلى الإتقان"
description: "كل ما يحتاجه مهندس السحابة عن Git: branching، merging، rebasing، hooks، bisect، وسير العمل مع IaC."
---

# Git من الصفر إلى الإتقان

> **"Git ليس مجرد `commit` و `push`. إنه آلة زمن لمشروعك. تعلم كيف تسافر عبر تاريخ الكود وتصحح الكوارث قبل أن تحدث."**

## 🎯 أهداف التعلم

بعد إكمال هذا الدرس، ستكون قادراً على:

- إدارة سير العمل اليومي باحترافية
- الخروج من أي كارثة Git (merge conflicts, detached HEAD, lost commits)
- كتابة رسائل Commit احترافية ومراجعة Pull Requests بفعالية
- استخدام Git hooks لأتمتة الجودة
- تطبيق Git مع Infrastructure as Code بأمان

---

## ١. مفاهيم Git الأساسية

```mermaid
graph LR
    WD[Working Directory] -->|git add| Staging[Staging Area]
    Staging -->|git commit| Local[Local Repo]
    Local -->|git push| Remote[Remote Repo]
    Remote -->|git pull| WD
```

| المفهوم               | المعنى               | تشبيه                |
| --------------------- | -------------------- | -------------------- |
| **Working Directory** | ملفاتك الحالية       | مكتبك                |
| **Staging Area**      | ما جهّزته للـ commit | صندوق التجهيز        |
| **Commit**            | لقطة محفوظة          | صورة فوتوغرافية      |
| **Branch**            | خط تطوير منفصل       | غرفة جانبية          |
| **Remote**            | نسخة على الخادم      | نسخة احتياطية سحابية |

---

## ٢. دورة العمل اليومية — كاملة

```bash
# ١. ابدأ يومك — تأكد أنك على أحدث نسخة
git checkout main
git pull origin main

# ٢. اعمل على مهمة في فرع منفصل
git checkout -b feature/add-monitoring-alerts

# ٣. اعمل على الملفات... ثم تفقد حالتك
git status
git diff                          # ماذا تغير بالضبط؟

# ٤. جهّز وcommit بذكاء
git add monitoring.tf             # ملف محدد — أفضل من git add .
git commit -m "Add Prometheus alert for API p99 latency > 500ms"

# ٥. ادفع للـ remote
git push origin feature/add-monitoring-alerts

# ٦. افتح Pull Request على GitHub
```

---

## ٣. استراتيجية التفرع — Git Flow للفرق

```
main ─────●─────────●─────────●─────── (إنتاج — نظيف دائماً)
           \       /         /
staging ────●─────●─────────●───────── (اختبار ما قبل الإنتاج)
             \   /
feature/xxx ──●────────────────────── (مكان العمل الآمن)
```

### القواعد الذهبية الخمس

1. **main مقدس.** لا تدفع إليه مباشرة أبداً. أبداً.
2. **فرع لكل مهمة.** `feature/add-alerts`، `fix/login-bug`، `docs/api-guide`
3. **PR إجباري.** حتى لو كنت الوحيد — للمراجعة الذاتية والتاريخ
4. **Commit صغير ومركز.** "Add monitoring" ← سيء. "Add Prometheus alert for API p99 latency > 500ms triggering PagerDuty" ← ممتاز
5. **Commit متكرر.** ١٠ commits صغيرة > ١ commit ضخم

---

## ٤. التعامل مع الكوارث — دليل النجاة

### 🚨 الكارثة ١: "Commit للفرع الخطأ!"

```bash
# أنت في main، عملت commit، وكان يجب أن تكون في feature/new-api
git log --oneline -3
# abc1234 (HEAD -> main) Add new API endpoint  ← هذا في المكان الخطأ!

# الحل: انقل الـ commit للفرع الصحيح
git branch feature/new-api              # أنشئ الفرع (يحتفظ بالـ commit)
git reset --hard HEAD~1                 # تراجع main خطوة (الملفات تبقى في الفرع)
git checkout feature/new-api            # انتقل للفرع — commitك هنا!
```

### 🚨 الكارثة ٢: "Merge conflict من الجحيم"

```bash
# تعارض في ١٥ ملفاً. لا تهلع.
git merge --abort                       # تراجع — ابدأ من جديد بنفس هادئة

# استراتيجية أفضل: Rebase أولاً
git checkout feature/my-big-change
git rebase main                         # طبق تغييراتك فوق أحدث main

# تعارض؟ تعامل معه ملفاً ملفاً:
git status                              # أي الملفات المتعارضة؟
# both modified: src/api/handlers.py

# افتح الملف، ابحث عن <<<<<<< و >>>>>>>
# احذف علامات التعارض واختر الكود الصحيح
git add src/api/handlers.py
git rebase --continue

# لو تعقدت الأمور:
git rebase --abort                      # تراجع عن الـ rebase كله
```

### 🚨 الكارثة ٣: "حذفت commit بالخطأ!"

```bash
# git reflog — سجل كل شيء. حتى الـ commits "المحذوفة".
git reflog
# abc1234 HEAD@{0}: commit: Add important feature
# def5678 HEAD@{1}: commit: Some previous work

# استرجع الـ commit:
git cherry-pick abc1234
# أو
git reset --hard abc1234
```

### 🚨 الكارثة ٤: "ملف سري في الـ commit!"

```bash
# لا يكفي حذف الملف وعمل commit جديد — الملف موجود في التاريخ!
# الحل: BFG Repo-Cleaner أو git filter-branch

# ١. أزل الملف من كل التاريخ
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# ٢. دوّر كل الأسرار فوراً (لأنها أصبحت مخترقة)
# ٣. ادفع بالقوة (بعد تنسيق مع الفريق!)
git push origin --force --all
```

---

## ٥. Git Hooks — أتمتة الجودة

### Pre-commit Hook: امنع الأسرار من الدخول

```bash
#!/bin/bash
# .git/hooks/pre-commit
# يمنع commit أي ملف يحتوي على كلمة مرور أو مفتاح سري

PATTERNS=(
    'password\s*=\s*["'"'"'][^"'"'"']+["'"'"']'
    'secret\s*=\s*["'"'"'][^"'"'"']+["'"'"']'
    '-----BEGIN RSA PRIVATE KEY-----'
    'AKIA[0-9A-Z]{16}'  # AWS Access Key
)

for pattern in "${PATTERNS[@]}"; do
    if git diff --cached --name-only | xargs grep -lE "$pattern" 2>/dev/null; then
        echo "🚨 Commit مرفوض: تم العثور على أسرار!"
        echo "الملفات المخالفة:"
        git diff --cached --name-only | xargs grep -lE "$pattern"
        exit 1
    fi
done

echo "✅ فحص الأسرار: نظيف"
```

### Commit-msg Hook: فرض تنسيق الرسائل

```bash
#!/bin/bash
# .git/hooks/commit-msg
# يفرض صيغة: type(scope): description

COMMIT_MSG=$(cat "$1")
PATTERN="^(feat|fix|docs|refactor|test|chore|ci)(\([a-z-]+\))?: .{10,}"

if ! echo "$COMMIT_MSG" | grep -qE "$PATTERN"; then
    echo "🚨 صيغة commit غير صالحة!"
    echo "الصيغة المطلوبة: type(scope): description"
    echo "الأنواع: feat, fix, docs, refactor, test, chore, ci"
    echo "مثال: feat(api): Add Prometheus metrics endpoint"
    exit 1
fi
```

---

## ٦. Git Bisect — المحقق العبقري

> **"وجدت bug لكن لا تعرف أي commit سببه؟ bisect هو صديقك."**

```bash
# المشكلة: API يرد 500 — كان يعمل قبل أسبوع
# بين آخر نسخة جيدة وأول نسخة سيئة — ٥٠ commit

git bisect start
git bisect bad HEAD                    # النسخة الحالية سيئة
git bisect good abc1234                # آخر نسخة جيدة (منذ أسبوع)

# Git يقسم الـ ٥٠ commit نصفين. اختبر:
curl https://api.cloudnova.com/health
# → 200 OK ← هذا commit جيد

git bisect good                        # أخبر Git أنه جيد

# Git ينتقل لمنتصف النصف الثاني. اختبر:
curl https://api.cloudnova.com/health
# → 500 ← هذا commit سيئ

git bisect bad                         # أخبر Git

# يستمر التقسيم... بعد ~٦ خطوات:
# def5678 is the first bad commit
# commit def5678
# Author: Ahmed
# Date:   Wed Jul 10 14:22:31 2024
#
#     refactor: change database connection pool

git bisect reset                       # اختم التحقيق
# الآن تعرف بالضبط أي commit سبب المشكلة!
```

---

## ٧. Rebase vs Merge

|                | Merge                       | Rebase                        |
| -------------- | --------------------------- | ----------------------------- |
| **التاريخ**    | يحافظ على التاريخ الحقيقي   | يعيد كتابة التاريخ (أنظف)     |
| **الرسم**      | فروع متشعبة                 | خط مستقيم                     |
| **التعاون**    | آمن — لا يغير تاريخ الآخرين | ⚠️ خطر إذا rebase فروع مشتركة |
| **متى تستخدم** | دمج feature ← main          | تحديث feature من main         |

```bash
# القاعدة الذهبية:
# ✅ rebase فرعك المحلي قبل فتح PR
git checkout feature/my-work
git rebase main

# ✅ merge عند دمج PR إلى main (عبر GitHub)
# ❌ لا تـ rebase فروعاً دفعتها وشاركتها مع آخرين!
```

---

## ٨. Git + Infrastructure as Code

### .gitignore لمشاريع Terraform

```bash
# .gitignore
**/.terraform/*           # الـ providers — كبير ولا يُرفع
*.tfstate                 # ⚠️ لا ترفع state أبداً!
*.tfstate.*
*.tfvars                  # قد تحتوي أسراراً
!example.tfvars           # إلا القالب
.terraformrc              # بيانات اعتماد
override.tf               # تجاوزات محلية
.terraform.lock.hcl       # نعم يُرفع! يضمن تناسق الـ providers
```

### قالب PR لـ Infrastructure as Code

```markdown
## 📋 ماذا يتغير؟

- إضافة Auto Scaling لخوادم الويب
- تغيير VM size من B2s إلى B2ms

## ❓ لماذا؟

- حمل الذروة (٩-١١ صباحاً) يستهلك ٩٠٪ CPU
- B2ms يوفر ٢x الذاكرة بنفس السعر التقريبي

## 📊 خطة Terraform
```

Plan: 3 to add, 1 to change, 0 to destroy.

```

## ✅ الاختبار
- [x] الخطة لا تحذف أي موارد
- [x] طبقت في staging — الخوادم الجديدة تستجيب
- [x] Auto scaling اختبر: زدت الحمل → ٣ خوادم جديدة

## 🔒 فحص الأمان
- [x] لا أسرار في الكود
- [x] لا تغيير في prevent_destroy
```

---

## 🧠 أسئلة للمراجعة النشطة

1. ما الفرق بين `git merge` و `git rebase`؟ متى تستخدم كل منهما؟
2. كيف تستعيد commit "محذوف"؟
3. اشرح git bisect — كيف يساعد في العثور على bug؟
4. لماذا يجب ألا ترفع ملف `.tfstate`؟

## ✍️ تمرين Feynman

اشرح Git branch لشخص يستخدم Google Docs فقط. كيف تقنعه أن "التفرع" ليس تعقيداً بل حرية؟

## 🎴 بطاقات مراجعة

| السؤال                        | الإجابة                       |
| ----------------------------- | ----------------------------- |
| أمر لعرض commits حتى المحذوفة | `git reflog`                  |
| أمر لاستعادة commit من reflog | `git cherry-pick <hash>`      |
| أمر لاكتشاف أي commit سبب bug | `git bisect`                  |
| الفرق بين tracked و untracked | tracked = أضفته لـ git سابقاً |

## 🎤 أسئلة مقابلة العمل

1. **"كيف تحل merge conflict معقداً؟"** ← abort ثم rebase تدريجي + التواصل مع المؤلف الأصلي
2. **"ما الفرق بين Git Flow و Trunk-Based Development؟"** ← Git Flow: فروع طويلة. Trunk-Based: دمج يومي للمخزن الرئيسي
3. **"كيف تمنع الأسرار من دخول git؟"** ← pre-commit hook + .gitignore + git-secrets scanner في CI

---

---

## 🏛️ طبقة الإنتاج: Git في المؤسسة

### Trunk-Based Development

```
main ─────●──●──●──●──●──●──●── (دائماً قابل للنشر)
           \  /
feature     ●──●  (عمرها < يومين)

القواعد:
├── فروع قصيرة العمر (ساعات لا أسابيع)
├── دمج للمخزن الرئيسي عدة مرات يومياً
├── Feature flags للميزات غير المكتملة
└── CI/CD يجب أن يمر قبل الدمج
```

### Git + Terraform: أفضل ممارسات

```bash
# .gitignore لمشاريع IaC
*.tfstate*
.terraform/
*.tfvars
!example.tfvars
.terraformrc
override.tf

# ما يُرفع:
# ✅ .terraform.lock.hcl — يضمن تناسق الـ provider versions
# ✅ modules/ — كود الـ modules
# ✅ environments/ — تكوينات البيئات
```

### 🚨 سيناريو CloudNova: Force Push كارثي

> مهندس دفع `git push --force` على main. 3 أيام من commits اختفت.

```bash
# لا panic. GitHub يحتفظ بالـ commits:
gh api /repos/CloudNova/infra/git/refs/heads/main
# آخر commit قبل force push كان abc1234

# استعد commit من الـ reflog الخاص بـ GitHub
git fetch origin abc1234:recovered-main
git push origin recovered-main:main --force

# الحماية للمستقبل:
# Settings → Branches → Add Rule → "Block force pushes"
```

---

## 🎨 طبقة المعماري: Git Flow vs Trunk-Based vs GitHub Flow

| الاستراتيجية    | الأفضل لـ                  | الفروع                                  | التعقيد     |
| --------------- | -------------------------- | --------------------------------------- | ----------- |
| **Git Flow**    | فرق كبيرة، releases مجدولة | main, develop, feature, release, hotfix | عالي        |
| **Trunk-Based** | CI/CD متقدم، نشر مستمر     | main فقط + فروع قصيرة                   | منخفض       |
| **GitHub Flow** | معظم الفرق الحديثة         | main + feature branches                 | منخفض-متوسط |

### متى تختار ماذا؟

- **Git Flow**: منتج بإصدارات (v1.0, v2.0) وفريق > 10
- **Trunk-Based**: فريق < 10 + CI/CD قوي + feature flags
- **GitHub Flow**: الحل الوسط — PR على main، نشر بعد الدمج

---

## 🛠️ تدريبات

### تمرين ١: كارثة محاكاة (سهل)

> `git reset --hard HEAD~3` بالخطأ. استعد الـ commits.

### تمرين ٢: تفعيل hooks (متوسط)

> فعّل pre-commit hook يمنع secrets + commit-msg يفرض Conventional Commits.

### تحدي: bisect (متقدم)

> استخدم bisect مع script للعثور على commit سبب فشل test.

### 📝 تقييم

**س١:** كيف تستعيد commit "محذوف"؟


<details><summary>الإجابة</summary>`git reflog` → ابحث عن commit hash → `git cherry-pick <hash>` أو `git checkout -b recovered <hash>`.</details>



**س٢:** لماذا لا ترفع `.tfstate`؟


<details><summary>الإجابة</summary>يحتوي resource IDs وأحياناً secrets. استخدم remote backend مع encryption.</details>



**س٣:** `merge` vs `rebase` — متى كل منهما؟


<details><summary>الإجابة</summary>merge = دمج PR لـ main (تاريخ حقيقي). rebase = تحديث feature branch من main (تاريخ نظيف).</details>



### 🧠 استدعاء نشط

1. ارسم مسار commit: Working Directory → Staging → Local → Remote.
2. كيف تمنع secrets من دخول Git؟ (3 طرق)
3. ما هي Conventional Commits؟ اذكر 5 أنواع.

### 🎤 مقابلة

**"كيف تصمم branching strategy لفريق 15 مهندساً؟"**
→ Git Flow مع: main (إنتاج)، develop (تطوير)، feature/* للعمل اليومي، release/* للإصدارات، hotfix/* للإصلاحات الطارئة. Branch protection على main + develop.

**"كيف تتعامل مع merge conflict كبير؟"**
→ `git merge --abort`. قسّم التغيير لـ commits أصغر. `git rebase main` خطوة خطوة. تواصل مع المؤلف الأصلي.

---

## 📚 مراجع

- [Git Advanced](./02-git-advanced) — rebase, bisect, reflog
- [GitHub Workflows](../14-github/01-github-workflows) — CI/CD
- 📖 [Pro Git Book](https://git-scm.com/book/en/v2)
- 📖 [Conventional Commits](https://www.conventionalcommits.org/)

---

[← العودة للموديول](01-git-fundamentals) | [→ Git Advanced](./02-git-advanced) | [🏠 الرئيسية](/)
