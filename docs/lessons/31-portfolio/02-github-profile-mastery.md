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
  schedule: [{ cron: "0 0 * * *" }]
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: anuraghazra/github-readme-stats@master
```

---

## 🏛️ CloudNova: عندما GitHub Profile يفتح الأبواب

**نواف** مهندس Cloud في CloudNova. مدير التوظيف في شركة كبرى وجده عبر GitHub trending. القصة:

1. **GitHub Profile README** جذاب: وصف واضح، badges احترافية، stats حية
2. **Pinned repos**: Terraform module لـ AKS اجتاز 500+ star
3. **المساهمات**: 1,200+ contribution في آخر سنة
4. **المشاريع**: 3 مشاريع كاملة مع README و diagrams و CI/CD

المدير قال: "لم أقرأ سيرته الذاتية حتى. GitHub Profile كان كافياً."

**كيف تبني هذا الملف:**

````markdown
# 👋 مرحباً، أنا [اسمك]

### Cloud & DevOps Engineer | Azure | Kubernetes | Terraform

```python
# About Me
class CloudEngineer:
    def __init__(self):
        self.name = "[اسمك]"
        self.role = "Cloud & DevOps Engineer"
        self.location = "Riyadh, Saudi Arabia 🇸🇦"
        self.certifications = ["AZ-104", "AZ-400", "CKA"]
        self.current_project = "CloudNova Platform Migration"

    def say_hi(self):
        print("شغوف ببناء بنية تحتية سحابية موثوقة!")
```
````

## 🚀 المشاريع المميزة

| المشروع                       | الوصف                       | التقنيات          | النجوم  |
| ----------------------------- | --------------------------- | ----------------- | ------- |
| [terraform-azurerm-aks](link) | Production-ready AKS module | Terraform, Azure  | ⭐ 120+ |
| [cloud-cost-optimizer](link)  | Azure cost analysis tool    | Python, Azure SDK | ⭐ 85+  |
| [k8s-security-scanner](link)  | Kubernetes security scanner | Go, OPA           | ⭐ 60+  |

## 📊 إحصائيات GitHub

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=[username]&show_icons=true&theme=tokyonight)
![Top Langs](https://github-readme-stats.vercel.app/api/top-langs/?username=[username]&layout=compact&theme=tokyonight)

````

---

## 🎨 طبقة المعماري: عناصر GitHub Profile القوي

| العنصر | الأهمية | مثال |
|--------|---------|------|
| **README Profile** | ⭐⭐⭐⭐⭐ | انطباع أولي في 3 ثوانٍ |
| **Pinned Repos** | ⭐⭐⭐⭐⭐ | أفضل 6 مشاريع |
| **Contribution Graph** | ⭐⭐⭐⭐ | دليل الاستمرارية |
| **Badges/Shields** | ⭐⭐⭐⭐ | شهادات وتقنيات |
| **Live Stats** | ⭐⭐⭐ | نشاط حي |
| **Organizations** | ⭐⭐⭐⭐ | تعاون مع فرق |
| **Sponsors** | ⭐⭐ | مصداقية إضافية |

### قائمة تدقيق GitHub Profile

- [ ] صورة شخصية احترافية
- [ ] README profile بـ 3 لغات (عربي + إنجليزي + Python)
- [ ] 6 pinned repos مكتملة (README, CI/CD, tests)
- [ ] 500+ contributions سنوياً
- [ ] GitHub Actions pipeline مرئي
- [ ] مساهمات في Open Source (issue/pull request)
- [ ] badges للشهادات
- [ ] رابط LinkedIn ومدونة

---

## 🛠️ تدريبات عملية

### تمرين 1: إنشاء GitHub Profile README
```bash
# 1. إنشاء repo بنفس اسم المستخدم
# 2. إضافة README.md
# 3. تخصيص بالمعلومات الشخصية
mkdir -p ~/github/[username]
cd ~/github/[username]
git init
echo "# 👋 مرحباً" > README.md
git add README.md
git commit -m "✨ Initial profile"
git remote add origin https://github.com/[username]/[username].git
git push -u origin main
````

### تمرين 2: إضافة GitHub Actions Stats

```yaml
# .github/workflows/update-stats.yml
name: Update GitHub Stats
on:
  schedule:
    - cron: "0 0 * * *" # يومياً
  workflow_dispatch:

jobs:
  update-readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anuraghazra/github-readme-stats@master
        with:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          SHOW_ICONS: true
          THEME: tokyonight
```

### تحدي: مشروع Open Source كامل

```markdown
# التحدي: أنشئ repo يستحق pinning:

# 1. Terraform module لـ Azure (مع examples كاملة)

# 2. README احترافي: وصف، استخدام، architecture diagram

# 3. CI/CD مع GitHub Actions (tests, lint, docs)

# 4. Contributing guide

# 5. License

# 6. Badges (build, coverage, license)

# الهدف: 50+ star في 3 أشهر
```

---

## 📝 تقييم

### ✅ Knowledge Checks

1. لماذا GitHub Profile أهم من السيرة الذاتية أحياناً؟
2. ما أفضل 3 عناصر في GitHub Profile؟
3. كيف تجعل repo يستحق pinning؟
4. ما فائدة GitHub Actions في الملف الشخصي؟
5. كيف تبني contribution graph قوي؟

### 🧠 Quiz

**س1:** أفضل pinned repo:

- أ) fork بسيط
- ب) مشروع كامل مع README, CI/CD, tests ✅
- ج) repo فارغ
- د) أي شيء

**س2:** Contribution graph الأخضر يدل على:

- أ) خبرة
- ب) استمرارية وانضباط ✅
- ج) لا شيء
- د) لون مفضل

**س3:** GitHub Actions في profile:

- أ) تبين أنك تعرف CI/CD ✅
- ب) غير مفيدة
- ج) تبطئ GitHub
- د) محظورة

### 🗣️ Active Recall

1. صف GitHub Profile مثالي لـ Cloud Engineer
2. ارسم خطة لبناء 6 pinned repos في 6 أشهر
3. كيف تختار مشاريع Open Source للمساهمة؟
4. ما الفرق بين fork و original project في الـ profile؟

### 🎓 Feynman Exercise

> اشرح GitHub Profile لغير تقني: "مثل معرض أعمال مهندس. الزائر يرى أفضل 6 مشاريع، شهاداته، ومدى نشاطه خلال السنة. مثل portfolio مصور."

### 🃏 بطاقات تعلم

| السؤال                          | الإجابة                                         |
| ------------------------------- | ----------------------------------------------- |
| ماذا يحتاج GitHub Profile قوي؟  | README احترافي + 6 pinned repos + contributions |
| ما أفضل pinned repo؟            | مشروع كامل مع docs, CI/CD, tests                |
| كم contribution سنوياً؟         | +500 minimum                                    |
| ما github-readme-stats؟         | بطاقات إحصائية حية للملف الشخصي                 |
| لماذا Open Source contribution؟ | إثبات العمل الجماعي + visibility                |

---

## 🎤 أسئلة المقابلة

**س1 (سلوكي):** "أرني GitHub Profile الخاص بك."

> افتح profile وناقش: 1) أفضل 3 pinned repos: ماذا بنيت، التقنيات، التحديات. 2) مساهمات Open Source: أي مشاريع، ماذا أضفت. 3) Contribution graph: دليل الالتزام. 4) CI/CD pipelines: أتمتة المشاريع.

**س2 (تقني):** "كيف تدير مشاريعك على GitHub؟"

> GitHub Projects للـ kanban. Issues + labels للتنظيم. GitHub Actions للـ CI/CD. Branch protection rules. Semantic versioning + changelog. code owners للمراجعة.

**س3:** "لماذا مشروع X يستحق pinning؟"

> أناقش: حجم المشروع، التقنيات المستخدمة، المشكلة التي يحلها، feedback المجتمع، الدروس المستفادة. ليس الـ stars هو المهم، بل complexity وحجم التأثير.

---

## 📚 المراجع

| النوع          | الرابط                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| **درس ذو صلة** | [Portfolio Building](./01-portfolio-building)                                                                    |
| **درس ذو صلة** | [Technical Blogging](./03-technical-blogging-speaking)                                                           |
| **أداة**       | [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats)                                        |
| **مرجع**       | [GitHub Profile README](https://docs.github.com/account-and-profile/setting-up-and-managing-your-github-profile) |

---

[← Portfolio Building](./01-portfolio-building) | [→ Technical Blogging](./03-technical-blogging-speaking) | [🏠 الرئيسية](/)
