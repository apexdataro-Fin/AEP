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
# تخزين secret
az keyvault secret set \
  --vault-name cloudnova-kv \
  --name "DB-PASSWORD" \
  --value "SuperSecret123!"

# استخدام secret في Terraform (لا secrets في الكود!)
data "azurerm_key_vault_secret" "db_password" {
  name         = "DB-PASSWORD"
  key_vault_id = data.azurerm_key_vault.main.id
}
```

### External Secrets Operator لـ Kubernetes

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

الآن Kubernetes Secret يُزامن تلقائياً من Key Vault!

### تدوير الأسرار

```bash
# Key Vault يدعم auto-rotation للشهادات
az keyvault certificate policy create \
  --vault-name cloudnova-kv \
  --name api-cert \
  --action-type AutoRenew \
  --validity-in-months 12 \
  --renew-before-expiry 30
```

---

## 🏛️ CloudNova Incident

نسي أحد المطورين Connection String في `appsettings.json` ودفعه إلى GitHub public repo. في غضون 3 دقائق، bots اكتشفوه واستخدموه لاستخراج بيانات.

**بعد الحادثة**:
- Azure Key Vault لكل الأسرار
- GitHub Secret Scanning مفعّل
- No secrets ever in code

---

[← Container Security](./02-container-security) | [→ Compliance as Code](./04-compliance-as-code) | [🏠 الرئيسية](/)
