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
      
      - name: Terraform Plan
        uses: hashicorp/setup-terraform@v2
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

Atlantis يستمع لـ GitHub webhooks وينفذ `plan` و `apply` تلقائياً:

```
# PR Comment:
atlantis plan
# Atlantis يرد:
# Plan: 5 to add, 2 to change, 1 to destroy

atlantis apply
# Atlantis ينفذ ويرد:
# Apply complete! Resources: 5 added, 2 changed, 1 destroyed.
```

---

## 🛠️ تدريب

ابنِ GitHub Actions workflow:
1. `terraform fmt` و `validate` عند كل PR
2. `terraform plan` مع output في PR comment
3. `terraform apply` فقط عند merge إلى main

---

[← State Management](./03-terraform-state-management-deep) | [→ Azure Provider Deep](./05-terraform-azure-provider-deep) | [🏠 الرئيسية](/)
