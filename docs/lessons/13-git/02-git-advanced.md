---
sidebar_position: 2
title: "Git المتقدم"
description: "Rebase، Cherry-pick، Bisect، Hooks — تقنيات Git للمحترفين."
---

# Git المتقدم

> **"عندما تعرف rebase و bisect — أنت في مستوى مختلف."**

## Rebase — إعادة كتابة التاريخ

```bash
# بدلاً من merge (الذي يخلق commit إضافي):
git checkout feature/alerts
git rebase main
# ينقل فرعك لآخر main — تاريخ أنظف

# Interactive Rebase — دمج commits
git rebase -i HEAD~3
# pick abc1234 Add alerting
# squash def5678 Fix typo
# squash ghi9012 Fix spacing
# ← يصبحون commit واحداً
```

## Bisect — البحث الثنائي عن الخطأ

```bash
# "التطبيق كان يشتغل أمس. اليوم لا. أي commit السبب؟"
git bisect start
git bisect bad HEAD        # الإصدار الحالي معطوب
git bisect good v2.0.0     # الإصدار القديم سليم
# Git يختار commit في المنتصف — اختبره
# git bisect good   ← هذا commit سليم
# git bisect bad    ← هذا commit معطوب
# ... يستمر حتى يحدد commit الخطأ بالضبط
```

## Git Hooks

```bash
# .git/hooks/pre-commit
#!/bin/bash
# امنع commit إذا كان فيه secrets
if detect-secrets scan --all-files | grep -q "CRITICAL"; then
    echo "❌ Secrets detected! Cannot commit."
    exit 1
fi
```

---

[← الدرس السابق](git-fundamentals) | [العودة للوحدة](index.md) | [🏠 الرئيسية](/)
