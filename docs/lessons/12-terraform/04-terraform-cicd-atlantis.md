---
sidebar_position: 4
title: "Terraform في CI/CD"
description: "Terraform CI/CD — GitHub Actions، Atlantis، automated plan/apply."
---

# Terraform في CI/CD

> "لا تشغّل Terraform من جهازك. الأتمتة هي الطريق الوحيد."

## 🎯 أهداف التعلم

- دمج Terraform في GitHub Actions
- استخدام Atlantis للـ collaborative Terraform
- Terraform Plan كـ PR comment
- منع التغييرات غير المراجعة

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ GitHub Actions + Terraform

```yaml
name: Terraform
on:
  pull_request:
    paths: ['infra/**']
jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: hashicorp/setup-terraform@v2
        with:
          terraform_wrapper: false
      - run: |
          cd infra
          terraform init
          terraform fmt -check
          terraform validate
          terraform plan -out=tfplan
      - name: Post Plan to PR
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const plan = fs.readFileSync('infra/tfplan.txt', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: '## Terraform Plan\n```\n' + plan + '\n```'
            });
```

### Atlantis — GitOps for Terraform

Atlantis يستمع لـ GitHub webhooks:

```
atlantis plan
# Atlantis: Plan: 5 to add, 2 to change, 1 to destroy

atlantis apply
# Atlantis: Apply complete!
```

---

## 🏛️ طبقة الإنتاج

### سيناريو CloudNova: Plan فاشل

فتح أحدهم PR لتغيير NSG. Terraform Plan أظهر: `Plan: 0 to add, 5 to change, 3 to destroy`.

الـ 3 destroy كانت VMs إنتاج! السبب: `count` index تغير.

**الدرس**: دائماً راجع Plan قبل merge. Terraform Plan كـ PR comment أنقذنا.

### Pipeline كامل

```yaml
# 1. Pull Request: plan + comment
# 2. Merge to main: apply تلقائي
# 3. Apply: workspace production فقط
```

---

## 🎨 Atlantis vs GitHub Actions

| | Atlantis | GitHub Actions |
|---|---------|---------------|
| **التفاعل** | PR comments | YAML triggers |
| **State Locking** | ✅ مدمج | يدوي |
| **Apply** | عبر PR comment | عند merge |

---

## 🛠️ تدريبات

### تمرين: ابنِ GitHub Actions مع Terraform Plan كـ PR comment
### تحدي: أضف `terraform apply` عند merge إلى main فقط

---

## 📝 تقييم

### ✅ فحص المعرفة
1. لماذا Terraform Plan مهم قبل merge؟
2. كيف تمنع تشغيل apply على PR؟
3. ما فائدة Atlantis؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| `terraform plan` | معاينة التغييرات قبل التطبيق |
| Atlantis | GitOps for Terraform — plan/apply من PR comments |
| PR comment | نشر خطة Terraform في تعليق على PR |

---

## 🎤 مقابلة
1. **"صمم CI/CD pipeline لـ Terraform"** → PR → plan comment → review → merge → apply
2. **"كيف تمنع تدمير موارد الإنتاج؟"** → `prevent_destroy` lifecycle + PR review + plan inspection

---

[← State Management](./03-terraform-state-management-deep) | [→ Azure Provider Deep](./05-terraform-azure-provider-deep) | [🏠 الرئيسية](/)
