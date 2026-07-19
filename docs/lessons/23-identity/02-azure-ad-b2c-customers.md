---
sidebar_position: 2
title: "Azure AD B2C"
description: "Azure AD B2C — إدارة هوية العملاء، تدفقات المستخدم، تخصيص UI."
---

# Azure AD B2C

> "عملاؤك ليسوا موظفين. يحتاجون تجربة هوية مختلفة تماماً."

## 🎯 أهداف التعلم

- الفرق بين Azure AD و Azure AD B2C
- تدفقات المستخدم (User Flows)
- تخصيص واجهة تسجيل الدخول
- Identity Experience Framework

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Intermediate

---

## 🏗️ Azure AD vs B2C

| | Azure AD | Azure AD B2C |
|---|----------|-------------|
| **المستخدمون** | موظفين | عملاء |
| **الهويات** | Microsoft, Org | Google, Facebook, Email |
| **التسعير** | لكل مستخدم | لكل MAU |
| **التخصيص** | محدود | كامل (HTML/CSS) |

### User Flow مخصص

```xml
<UserFlow Id="B2C_1_signupsignin">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" />
    <InputClaim ClaimTypeReferenceId="displayName" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="objectId" />
    <OutputClaim ClaimTypeReferenceId="email" />
    <OutputClaim ClaimTypeReferenceId="displayName" />
  </OutputClaims>
</UserFlow>
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

CloudNova تحتاج بوابة عملاء (وليس موظفين). B2C يوفر: Google login, Facebook login, Email signup. كلها جاهزة بدون كود.

### تخصيص UI

```html
<!-- صفحة تسجيل مخصصة -->
<div class="cloudnova-login">
  <img src="logo.svg" />
  <div id="api"></div>  <!-- Azure B2C يحقن هنا -->
</div>
```

---

## 🎨 B2C vs Auth0 vs Okta

| | Azure AD B2C | Auth0 | Okta |
|---|------------|-------|------|
| **السعر** | ~$0.003/MAU | $$ | $$$ |
| **Azure integration** | ✅ ممتاز | جيد | متوسط |
| **Custom policies** | ✅ | ✅ | ✅ |

---

## 🛠️ تدريبات

### تمرين: أنشئ B2C tenant و user flow
### تحدي: خصص صفحة تسجيل الدخول بـ HTML/CSS

---

## 📝 تقييم

### ✅ فحص المعرفة
1. متى تستخدم B2C بدلاً من Azure AD؟
2. ما هو User Flow؟
3. كيف تخصص صفحة تسجيل الدخول؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| B2C | Business-to-Consumer — هوية للعملاء |
| User Flow | مسار تسجيل/دخول محدد مسبقاً |
| MAU | Monthly Active Users — أساس التسعير |

---

[← Identity Mastery](./01-identity-mastery) | [→ Zero Trust](./03-zero-trust-architecture) | [🏠 الرئيسية](/)
