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
# دعوة مستخدم من مؤسسة أخرى
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
        "allApplications": {
          "accessStatus": "allowed"
        }
      }
    }
  }
}
```

---

[← Zero Trust](./03-zero-trust-architecture) | [→ Azure AI Services](../../24-azure-ai/01-azure-ai-services) | [🏠 الرئيسية](/)
