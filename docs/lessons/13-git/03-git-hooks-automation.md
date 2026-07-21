---
sidebar_position: 3
title: "Git Hooks والأتمتة"
description: "Git Hooks، pre-commit، commit-msg، Husky — أتمتة الجودة قبل كل commit."
---

# Git Hooks والأتمتة

> "لماذا تصطاد الأخطاء في CI/CD بينما يمكنك منعها قبل الـ commit؟"

## 🎯 أهداف التعلم

- فهم Git Hooks (client-side و server-side)
- تكوين pre-commit hooks
- استخدام Husky للـ JavaScript/TypeScript
- كتابة hooks مخصصة لفحص الـ commits

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Intermediate

---

## 🧠 الطبقة البسيطة

تخيل أن Git hooks مثل فحص أمني في المطار. قبل أن تصعد إلى الطائرة (commit)، يمر المسافرون (الملفات) عبر فحص أمني. إذا وجدوا شيئاً ممنوعاً (secrets)، يُمنعون من الصعود.

---

## 🏗️ Git Hooks

```bash
ls .git/hooks/
# applypatch-msg.sample  pre-commit.sample  pre-push.sample
```

### Pre-commit: منع secrets

```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# فحص عن private keys و secrets
if git diff --cached | grep -E "-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----"; then
    echo "🚨 Private key detected! Commit rejected."
    exit 1
fi

# فحص عن connection strings
if git diff --cached | grep -E "AccountKey=.*;"; then
    echo "🚨 Storage Account Key detected! Commit rejected."
    exit 1
fi
EOF
chmod +x .git/hooks/pre-commit
```

### Commit-msg: فرض تنسيق

```bash
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/bash
COMMIT_MSG=$(cat "$1")
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|refactor|test|chore|ci): "; then
    echo "🚨 Commit message must follow: type: description"
    echo "   Example: feat: add user authentication"
    exit 1
fi
EOF
chmod +x .git/hooks/commit-msg
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

دفع أحد المطورين Azure Storage Key إلى GitHub. Git hook كان سيمنعه لكنه لم يكن مفعّلاً على جهازه.

**الحل**:

1. تثبيت pre-commit hooks عبر `pre-commit` framework (وليس hooks يدوية)
2. GitHub Secret Scanning كخط دفاع ثاني
3. تدوير المفاتيح فوراً

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: detect-private-key
      - id: check-yaml
      - id: check-merge-conflict
  - repo: https://github.com/zricethezav/gitleaks
    rev: v8.17.0
    hooks:
      - id: gitleaks
```

---

## 🎨 طبقة المعماري: Client vs Server Hooks

|              | Client-Side          | Server-Side               |
| ------------ | -------------------- | ------------------------- |
| **أين يعمل** | جهاز المطور          | GitHub/GitLab server      |
| **متى**      | قبل commit/push      | قبل/بعد push              |
| **يتجاوز؟**  | `--no-verify`        | لا يمكن تجاوزه            |
| **مثال**     | pre-commit, pre-push | pre-receive, post-receive |

**الأفضل**: Client-side للسرعة + Server-side للأمان (لا يمكن تجاوزه).

---

## 🛠️ تدريبات

### تمرين: أنشئ pre-commit hook يفحص عن `.env` files

### تمرين: أنشئ commit-msg hook يرفض commits أطول من 72 حرفاً

### تحدي: ثبت `pre-commit` framework مع gitleaks

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما الفرق بين client-side و server-side hooks؟
2. كيف تمنع دفع secrets إلى Git؟
3. لماذا `pre-commit` framework أفضل من hooks اليدوية؟

### 🃏 بطاقات

| السؤال        | الإجابة                    |
| ------------- | -------------------------- |
| pre-commit    | hook يعمل قبل commit       |
| gitleaks      | يفحص الكود عن secrets      |
| `--no-verify` | يتجاوز hooks — لا تستخدمه! |

---

## 🎤 مقابلة

1. **"كيف تمنع تسريب secrets في فريقك؟"** → pre-commit hooks + gitleaks + GitHub Secret Scanning
2. **"كيف تفرض تنسيق commit messages؟"** → commit-msg hook + conventional commits

---

[← Git Advanced](./02-git-advanced) | [→ GitHub Workflows](../../14-github/01-github-workflows) | [🏠 الرئيسية](/)
