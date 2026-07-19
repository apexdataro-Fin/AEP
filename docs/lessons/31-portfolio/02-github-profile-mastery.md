---
sidebar_position: 2
title: "إتقان GitHub Profile"
description: "GitHub Profile — تحويل حسابك إلى محفظة احترافية."
---

# إتقان GitHub Profile

> "GitHub Profile هو سيرتك الذاتية الحقيقية في 2026."

## 🎯 أهداف التعلم

- إنشاء README احترافي
- Pinned repositories
- GitHub Actions للأتمتة
- المساهمات والمشاريع

## ⏱️ الوقت المقدر: 25 دقيقة | المستوى: Junior

---

## 🏗️ README Profile

```markdown
# مرحباً، أنا [اسمك] 👋

### Cloud & DevOps Engineer | Azure | Kubernetes

- 🔭 أعمل على: CloudNova Platform
- 🌱 أتعلم: AI Infrastructure
- 💬 اسألني عن: Azure, Terraform, Kubernetes
- 📫 تواصل معي: [LinkedIn]

## 🛠️ التقنيات
![Azure](https://img.shields.io/badge/Azure-Expert-0078D4)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Advanced-326CE5)
![Terraform](https://img.shields.io/badge/Terraform-Expert-7B42BC)
```

### GitHub Actions للملف الشخصي

```yaml
name: Update Profile Stats
on:
  schedule: [{cron: "0 0 * * *"}]
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: anuraghazra/github-readme-stats@master
```

---

[← Portfolio Building](./01-portfolio-building) | [→ Technical Blogging](./03-technical-blogging-speaking) | [🏠 الرئيسية](/)
