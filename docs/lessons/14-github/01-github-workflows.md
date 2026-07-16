---
sidebar_position: 1
title: "GitHub للمحترفين"
description: "Pull Requests، Issues، Actions، Projects، وأسرار مراجعة الكود الفعّالة."
---

# GitHub للمحترفين

> **"GitHub ليس مخزن كود فقط. إنه منصة تعاون كاملة."**

## Pull Request — قلب التعاون

```bash
git checkout -b feature/add-monitoring
# ... عدّل الكود ...
git add . && git commit -m "Add Prometheus alert for API latency"
git push origin feature/add-monitoring
# افتح PR على GitHub
```

### وصف PR احترافي

```markdown
## ماذا؟

- تنبيه جديد: API latency > 500ms

## لماذا؟

- اكتشفنا بطئاً الأسبوع الماضي وتأخرنا ٤٥ دقيقة في الاستجابة

## الاختبار

- [x] الخطة لا تغير موارد
- [x] اختبرت محلياً
- [x] طبقت في staging

## مرتبط بـ

- Fixes #142
```

## مراجعة الكود — افعل ولا تفعل

| ✅ افعل                 | ❌ لا تفعل                       |
| ----------------------- | -------------------------------- |
| راجع المنطق والأمان     | دقق في التنسيق (الأتمتة تفعلها!) |
| اسأل أسئلة، اقترح بدائل | افرض بدون شرح                    |
| راجع خلال ٢٤ ساعة       | اترك PRs أياماً                  |
| امدح الحلول الجيدة      | انتقد فقط                        |

## GitHub Actions

```yaml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
      - run: npm run lint
```

---

[← العودة للوحدة](index.md) | [🏠 الرئيسية](/)
