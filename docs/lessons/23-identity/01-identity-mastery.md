---
sidebar_position: 1
title: "إدارة الهوية المتقدمة"
description: "Microsoft Entra ID، OAuth2، OIDC، RBAC، Conditional Access، وأمن الهوية الشامل."
---

# إدارة الهوية المتقدمة (Identity)

> "الهوية هي المحيط الأمني الجديد. عندما تسقط الهوية، يسقط كل شيء."

## 🎯 أهداف التعلم

- إتقان Microsoft Entra ID (Azure AD سابقاً)
- فهم OAuth 2.0 و OpenID Connect
- تطبيق Conditional Access و MFA
- إدارة الهويات للخدمات (Managed Identities)
- بناء استراتيجية Zero Trust للهوية

---

## 📖 الطبقة الأساسية: الهوية في السحابة

### نموذج Zero Trust

```
"لا تثق أبداً، تحقق دائماً"

المبادئ الأساسية:
├── تحقق بشكل صريح (Verify Explicitly)
│   ├── المصادقة (من أنت؟)
│   └── التفويض (ماذا تستطيع؟)
│
├── استخدام أقل صلاحية (Least Privilege)
│   ├── Just-in-Time Access
│   └── أدوار محدودة زمنياً
│
└── افترض الاختراق (Assume Breach)
    ├── Segmentation (تقسيم الشبكة)
    ├── Encryption (تشفير كل شيء)
    └── Monitoring (مراقبة كل شيء)
```

### Authentication vs Authorization

```
┌──────────────────────────────────────────────┐
│           Authentication (AuthN)             │
│           "من أنت؟"                          │
├──────────────────────────────────────────────┤
│  Password │ MFA │ FIDO2 │ Certificate        │
│  شيء تعرفه │ شيء تملكه │ شيء تكونه            │
└──────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────┐
│           Authorization (AuthZ)              │
│           "ماذا تستطيع أن تفعل؟"              │
├──────────────────────────────────────────────┤
│  RBAC │ ABAC │ Claims │ Scopes │ Policies   │
└──────────────────────────────────────────────┘
```

---

## 🧱 الطبقة المهنية: OAuth 2.0 و OpenID Connect

### تدفق Authorization Code مع PKCE

```
المستخدم ──► تطبيقك ──► Entra ID ──► تطبيقك ──► المستخدم

1. توجيه المستخدم لتسجيل الدخول:
   GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
     client_id=xxx&
     response_type=code&
     redirect_uri=https://app.cloudnova.com/callback&
     scope=openid profile email&
     code_challenge=abc123&
     code_challenge_method=S256

2. المستخدم يسجل الدخول + MFA

3. Entra ID يعيد Authorization Code

4. استبدال code بـ tokens:
   POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
     grant_type=authorization_code&
     code=xxx&
     code_verifier=xyz789

5. الرد:
   {
     "access_token": "eyJ0eXAiOi...",
     "id_token": "eyJ0eXAiOi...",
     "refresh_token": "eyJ0eXAiOi...",
     "expires_in": 3600
   }

6. استخدام access_token للوصول للـ API
```

### Claims في JWT

```json
{
  "id_token": {
    "header": {
      "typ": "JWT",
      "alg": "RS256",
      "kid": "abc123"
    },
    "payload": {
      "iss": "https://login.microsoftonline.com/{tenant}/v2.0",
      "sub": "a1b2c3d4-...",
      "aud": "api://cloudnova-api",
      "exp": 1680000000,
      "iat": 1679996400,
      "name": "Ahmed Hassan",
      "preferred_username": "ahmed@cloudnova.com",
      "roles": ["Engineer", "Contributor"],
      "tid": "tenant-id",
      "oid": "object-id"
    },
    "signature": "..."
  }
}
```

---

## 🏗️ الطبقة الإنتاجية: Conditional Access

### سياسات Conditional Access

```
قاعدة: الوصول إلى Azure Portal
├── IF:
│   ├── User: All Users
│   ├── App: Azure Portal
│   └── Location: Outside Finland
├── THEN:
│   ├── Grant: Require MFA
│   └── Session: Sign-in frequency = 1 hour
└── تستثني: Break-glass accounts

قاعدة: منع المصادقة القديمة
├── IF:
│   ├── User: All Users
│   └── Client App: Legacy Authentication (POP, IMAP, SMTP)
├── THEN:
│   └── Block
```

```bash
# إنشاء Conditional Access Policy
az rest --method POST \
  --url "https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies" \
  --body '{
    "displayName": "Require MFA for admins",
    "state": "enabled",
    "conditions": {
      "userRiskLevels": [],
      "signInRiskLevels": ["medium","high"],
      "clientAppTypes": ["all"],
      "applications": {
        "includeApplications": ["All"]
      },
      "users": {
        "includeRoles": ["62e90394-69f5-4237-9190-012177145e10"]
      },
      "locations": {
        "includeLocations": ["AllTrusted"]
      }
    },
    "grantControls": {
      "operator": "OR",
      "builtInControls": ["mfa"],
      "authenticationStrength@odata.bind": null
    }
  }'
```

---

## 🎨 الطبقة المعمارية: هويات الخدمات

### Managed Identities

```python
# System-assigned Managed Identity
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

# DefaultAzureCredential يجرب:
# 1. Environment variables
# 2. Managed Identity (في Azure)
# 3. Azure CLI credentials
# 4. VS Code credentials
credential = DefaultAzureCredential()

# بدون أي كلمة سر!
secret_client = SecretClient(
    vault_url="https://cloudnova-kv.vault.azure.net",
    credential=credential
)

secret = secret_client.get_secret("database-password")
```

### Workload Identity في Kubernetes

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cloudnova-api
  namespace: production
  annotations:
    azure.workload.identity/client-id: "1234-5678-abcd"

---
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      serviceAccountName: cloudnova-api
      containers:
        - name: api
          env:
            - name: AZURE_CLIENT_ID
              value: "1234-5678-abcd"
```

---

## 🏥 سيناريو CloudNova: اختراق حساب

```
📋 تنبيه: Risky Sign-in
المستخدم: sarah@cloudnova.com
الموقع: Russia (غير معتاد)
الجهاز: Unknown
الوقت: 02:00 بتوقيت هلسنكي

استجابة تلقائية من Conditional Access:
├── User Risk: High
├── MFA required ✓
├── ❌ فشل MFA
└── Access blocked + تنبيه للفريق الأمني

التحقيق:
├── الساعة 02:05: فريق الأمن يراجع الحادثة
├── الساعة 02:10: تأكيد اختراق كلمة السر
├── الساعة 02:12:
│   ├── تعطيل الحساب
│   ├── إلغاء جميع sessions
│   ├── إلغاء جميع refresh tokens
│   └── تدوير جميع الأسرار المرتبطة
└── الساعة 02:30: تقرير أولي للإدارة

الوقاية للمستقبل:
├── ✅ Passwordless (FIDO2 security keys)
├── ✅ Risk-based Conditional Access
└── ✅ User training (phishing awareness)
```

---

## ⚡ الإنتاج وما بعده

### قائمة تدقيق الهوية

```
□ هل MFA مفعل لجميع المستخدمين (بدون استثناءات)؟
□ هل legacy authentication معطلة؟
□ هل Conditional Access يمنع الدخول من دول عالية المخاطر؟
□ هل Break-glass accounts موجودة ومراقبة؟
□ هل جميع الخدمات تستخدم Managed Identities (بدون كلمات سر)؟
□ هل Service Principals لها صلاحيات محدودة؟
□ هل هناك مراجعة دورية للصلاحيات (Access Reviews)؟
□ هل PIM مفعل للأدوار الإدارية؟
□ هل جميع الـ tokens قصيرة العمر (< 1 ساعة)؟
```

---

## 🧠 التذكّر النشط

1. ما الفرق بين OAuth 2.0 و OpenID Connect؟
2. كيف يعمل Managed Identity في Azure؟
3. ما الفرق بين System-assigned و User-assigned Managed Identity؟
4. كيف تمنع هجوماً باستخدام كلمة سر مسربة؟
5. لماذا Conditional Access أهم من مجرد MFA؟

## 📝 بطاقات تعليمية

- **Entra ID**: خدمة إدارة الهوية في Azure (سابقاً Azure AD)
- **OAuth 2.0**: بروتوكول تفويض (Authorization) — يمنح وصولاً محدوداً
- **OIDC**: طبقة مصادقة فوق OAuth 2.0 — تتحقق من الهوية
- **Managed Identity**: هوية للخدمات في Azure بدون كلمات سر
- **PIM**: Privileged Identity Management — صلاحيات إدارية مؤقتة

## 🎤 أسئلة المقابلة

1. **"ما الفرق بين OAuth و SAML؟"**
   - OAuth 2.0/OIDC: حديث، JSON/JWT، للتطبيقات الحديثة
   - SAML: قديم، XML، للتطبيقات المؤسسية
   - OIDC أبسط وأسرع من SAML

2. **"كيف تؤمن API في Kubernetes؟"**
   - Workload Identity بدلاً من secrets
   - OAuth2 Proxy أمام الـ API
   - Istio مع mTLS بين الخدمات
   - Network Policies للعزل

3. **"كيف تطبق Zero Trust عملياً؟"**
   - لا IP whitelisting — استخدم Identity بدلاً من Network
   - Conditional Access لكل طلب
   - Micro-segmentation
   - Continuous verification (وليس login مرة واحدة)

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
