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

[← Identity Mastery](./01-identity-mastery) | [→ Zero Trust](./03-zero-trust-architecture) | [🏠 الرئيسية](/)
