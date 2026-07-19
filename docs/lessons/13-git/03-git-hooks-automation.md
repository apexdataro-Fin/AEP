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

## 🛠️ تدريب

1. أنشئ pre-commit hook يفحص عن `.env` files
2. أنشئ commit-msg hook يرفض commits أطول من 72 حرفاً في السطر الأول

---

[← Git Advanced](./02-git-advanced) | [→ GitHub Workflows](../../14-github/01-github-workflows) | [🏠 الرئيسية](/)
