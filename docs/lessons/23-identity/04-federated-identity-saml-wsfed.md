---
sidebar_position: 4
title: "الهوية الموحدة (Federation)"
description: "Federated Identity — SAML، WS-Fed، OIDC — ربط الهويات عبر المؤسسات."
---

# الهوية الموحدة (Federation)

> "لا تجعل المستخدمين يتذكرون كلمة مرور أخرى. وحّد هوياتهم."

## 🎯 أهداف التعلم

- فهم Federation protocols (SAML, OIDC, WS-Fed)
- تكوين Azure AD B2B
- Cross-tenant access
- المصادقة بين المؤسسات

## ⏱️ الوقت المقدر: 30 دقيقة | المستوى: Advanced

---

## 🏗️ SAML vs OIDC vs WS-Fed

| | SAML 2.0 | OpenID Connect | WS-Federation |
|---|---------|---------------|--------------|
| **التنسيق** | XML | JSON | XML |
| **الاستخدام** | Enterprise SSO | Modern Apps | Legacy Microsoft |
| **التعقيد** | عالي | منخفض | عالي |

### Azure AD B2B

```bash
az ad user invite \
  --invited-user-email partner@othercompany.com \
  --invited-user-display-name "Partner User" \
  --send-invitation-message true
```

### Cross-Tenant Access

```json
{
  "Inbound": {
    "B2BCollaboration": {
      "applications": {
        "allApplications": { "accessStatus": "allowed" }
      }
    }
  }
}
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

CloudNova تتعاقد مع شركة استشارية. بدلاً من إنشاء 50 حساب جديد في Azure AD، B2B يسمح للمستشارين باستخدام حسابات شركتهم.

### OIDC vs SAML: متى تستخدم ماذا؟

| السيناريو | البروتوكول |
|-----------|-----------|
| تطبيق ويب حديث (SPA) | OIDC |
| تطبيق Enterprise قديم | SAML |
| تكامل مع AD FS | WS-Fed |
| Google/Facebook login | OIDC |

---

## 🛠️ تدريبات

### تمرين: ادعُ مستخدم خارجي عبر B2B
### تحدي: كوّن Cross-Tenant Access بين tenantين

---

## 📝 تقييم

### ✅ فحص المعرفة
1. متى تستخدم SAML بدلاً من OIDC؟
2. ما فائدة Azure AD B2B؟
3. كيف تدير وصول شركاء خارجيين؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| SAML | بروتوكول SSO قديم (XML-based) |
| OIDC | بروتوكول حديث (JSON, JWT) |
| B2B | Business-to-Business — وصول شركاء |

---

## 🎤 مقابلة
1. **"كيف تمنح شركة خارجية وصولاً لموارد Azure؟"** → Azure AD B2B + Cross-Tenant Access
2. **"SAML vs OIDC؟"** → SAML: قديم، Enterprise. OIDC: حديث، Mobile/SPA

---

[← Zero Trust](./03-zero-trust-architecture) | [→ Azure AI Services](../../24-azure-ai/01-azure-ai-services) | [🏠 الرئيسية](/)
