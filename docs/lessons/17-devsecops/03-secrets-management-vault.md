---
sidebar_position: 3
title: "إدارة الأسرار"
description: "Azure Key Vault، HashiCorp Vault — إدارة الأسرار والشهادات في المؤسسة."
---

# إدارة الأسرار

> "Secret واحد في الكود = كارثة واحدة في الطريق."

## 🎯 أهداف التعلم

- إدارة الأسرار مع Azure Key Vault
- HashiCorp Vault للمؤسسات
- External Secrets Operator لـ Kubernetes
- تدوير الأسرار تلقائياً

## ⏱️ الوقت المقدر: 35 دقيقة | المستوى: Advanced

---

## 🏗️ Azure Key Vault

```bash
az keyvault secret set \
  --vault-name cloudnova-kv \
  --name "DB-PASSWORD" \
  --value "SuperSecret123!"

# استخدام secret في Terraform
data "azurerm_key_vault_secret" "db_password" {
  name         = "DB-PASSWORD"
  key_vault_id = data.azurerm_key_vault.main.id
}
```

### External Secrets Operator

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-credentials
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: azure-kv-store
    kind: SecretStore
  target:
    name: db-secret
  data:
  - secretKey: password
    remoteRef:
      key: DB-PASSWORD
```

### تدوير الأسرار

```bash
az keyvault certificate policy create \
  --vault-name cloudnova-kv \
  --name api-cert \
  --action-type AutoRenew \
  --validity-in-months 12 \
  --renew-before-expiry 30
```

---

## 🏛️ طبقة الإنتاج: CloudNova Incident

نسي أحد المطورين Connection String في `appsettings.json` ودفعه إلى GitHub public repo. في 3 دقائق، bots اكتشفوه واستخدموه.

**بعد الحادثة**: Key Vault لكل الأسرار + GitHub Secret Scanning + No secrets ever in code.

### HashiCorp Vault vs Key Vault

| | Azure Key Vault | HashiCorp Vault |
|---|----------------|-----------------|
| **النشر** | مُدار | Self-hosted |
| **التكلفة** | لكل عملية | مجاني + infra |
| **Dynamic Secrets** | محدود | ✅ متقدم |
| **الأفضل لـ** | Azure فقط | Multi-cloud |

---

## 🛠️ تدريبات

### تمرين: خزّن secret في Key Vault واستخدمه في Terraform
### تحدي: ثبت External Secrets Operator واربطه بـ Key Vault

---

## 📝 تقييم

### ✅ فحص المعرفة
1. لماذا لا نضع secrets في الكود؟
2. ما فائدة External Secrets Operator؟
3. كيف تدير شهادات TLS تلقائياً؟

### 🃏 بطاقات
| السؤال | الإجابة |
|--------|---------|
| Key Vault | خدمة إدارة الأسرار في Azure |
| ESO | External Secrets Operator — مزامنة secrets لـ K8s |
| Auto-Renew | تجديد تلقائي للشهادات قبل انتهائها |

---

## 🎤 مقابلة
1. **"كيف تدير secrets في Kubernetes؟"** → External Secrets Operator + Key Vault
2. **"ماذا تفعل إذا تسرب secret؟"** → تدويره فوراً + التحقيق + منع التكرار

---

[← Container Security](./02-container-security) | [→ Compliance as Code](./04-compliance-as-code) | [🏠 الرئيسية](/)
