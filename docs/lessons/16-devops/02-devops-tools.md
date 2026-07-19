---
sidebar_position: 2
title: "أدوات DevOps"
description: "Ansible, Terraform, HashiCorp Vault, Packer, Vagrant - صندوق أدوات مهندس DevOps المحترف."
---

# أدوات DevOps المتقدمة

> "الأداة المناسبة للمهمة المناسبة. لا تعشق الأداة، اعشق النتيجة."

## 🎯 أهداف التعلم

- أتمتة التهيئة باستخدام Ansible
- إدارة الأسرار المركزية بـ HashiCorp Vault
- بناء صور آلات افتراضية بـ Packer
- بيئات تطوير قابلة للتكرار بـ Vagrant
- اختيار الأداة المناسبة لكل موقف

---

## ١. Ansible: أتمتة بلا Agents

### 🔹 لماذا Ansible؟

- **بدون Agents**: SSH فقط. لا حاجة لتثبيت شيء على الخوادم.
- **YAML**: سهل القراءة والكتابة.
- **Idempotent**: تشغيل playbook مرة أو ١٠٠ مرة يعطي نفس النتيجة.
- **مجتمع ضخم**: آلاف الـ modules الجاهزة.

### 🔹 Playbook احترافي

```yaml
# playbooks/provision-web-server.yml
---
- name: تهيئة خادم الويب
  hosts: web_servers
  become: yes
  vars:
    app_version: "2.1.0"
    node_version: "18.18.0"

  pre_tasks:
    - name: تحديث الحزم
      apt:
        update_cache: yes
        cache_valid_time: 3600
      when: ansible_os_family == "Debian"

  tasks:
    # ١. تثبيت Node.js
    - name: تثبيت Node.js
      ansible.builtin.apt:
        name: "nodejs={{ node_version }}"
        state: present

    # ٢. إنشاء مستخدم التطبيق
    - name: إنشاء مستخدم التطبيق
      ansible.builtin.user:
        name: appuser
        shell: /bin/bash
        create_home: yes
        system: no

    # ٣. نشر التطبيق
    - name: نشر التطبيق
      ansible.builtin.git:
        repo: "https://github.com/CloudNova/web-app.git"
        dest: "/opt/web-app"
        version: "{{ app_version }}"
        force: yes
      notify: restart web-app

    # ٤. تثبيت الاعتماديات
    - name: تثبيت npm packages
      ansible.builtin.command:
        cmd: npm ci --production
        chdir: /opt/web-app
      changed_when: false

    # ٥. تكوين systemd
    - name: إنشاء systemd service
      ansible.builtin.template:
        src: templates/web-app.service.j2
        dest: /etc/systemd/system/web-app.service
        mode: "0644"
      notify: restart web-app

    # ٦. تشغيل الخدمة
    - name: تشغيل الخدمة
      ansible.builtin.systemd:
        name: web-app
        state: started
        enabled: yes
        daemon_reload: yes

    # ٧. تكوين جدار الحماية
    - name: فتح port 80
      ansible.builtin.ufw:
        rule: allow
        port: "80"
        proto: tcp

  handlers:
    - name: restart web-app
      ansible.builtin.systemd:
        name: web-app
        state: restarted
```

### 🔹 المخزن (Inventory)

```yaml
# inventory/production.yml
all:
  children:
    web_servers:
      hosts:
        web-01.cloudnova.internal:
          ansible_host: 10.0.1.10
          ansible_user: ubuntu
        web-02.cloudnova.internal:
          ansible_host: 10.0.1.11
          ansible_user: ubuntu
    db_servers:
      hosts:
        db-01.cloudnova.internal:
          ansible_host: 10.0.2.10
          ansible_user: ubuntu
  vars:
    ansible_ssh_private_key_file: ~/.ssh/cloudnova.pem
    ansible_python_interpreter: /usr/bin/python3
```

### 🔹 أوامر أساسية

```bash
# تشغيل playbook
ansible-playbook -i inventory/production.yml playbooks/provision-web-server.yml

# فحص الاتصال بكل الخوادم
ansible all -i inventory/production.yml -m ping

# تشغيل playbook على مجموعة محددة
ansible-playbook -i inventory/production.yml playbooks/update.yml --limit web_servers

# وضع check (لا تغييرات فعلية)
ansible-playbook -i inventory/production.yml playbooks/provision.yml --check

# عرض الحقائق عن الخوادم
ansible web_servers -i inventory/production.yml -m setup
```

---

## ٢. HashiCorp Vault: إدارة الأسرار

### 🔹 المشكلة

أين تخزن كلمات المرور، شهادات SSL، مفاتيح API؟ ليس في Git. ليس في ملفات `.env` على الخادم. ليس في Slack!

### 🔹 الحل: Vault

```bash
# تشغيل Vault محلياً للتطوير
vault server -dev

# في نافذة أخرى
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='hvs.xxx'

# كتابة سر
vault kv put secret/cloudnova/database \
  username=admin \
  password=SuperSecretProduction123

# قراءة سر
vault kv get secret/cloudnova/database
# === Data ===
# Key         Value
# ---         -----
# username    admin
# password    SuperSecretProduction123

# قراءة قيمة واحدة
vault kv get -field=password secret/cloudnova/database
```

### 🔹 Dynamic Secrets: قواعد البيانات

```bash
# بدلاً من كلمة مرور ثابتة، Vault يُنشئ مستخدمين مؤقتين

# ١. تفعيل محرك قواعد البيانات
vault secrets enable database

# ٢. تكوين الاتصال بـ PostgreSQL
vault write database/config/cloudnova-db \
  plugin_name=postgresql-database-plugin \
  allowed_roles="readonly,readwrite" \
  connection_url="postgresql://{{username}}:{{password}}@db.internal:5432/cloudnova" \
  username="vaultadmin" \
  password="vaultadminpassword"

# ٣. إنشاء دور للقراءة فقط
vault write database/roles/readonly \
  db_name=cloudnova-db \
  creation_statements="CREATE USER \"{{name}}\" WITH PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\";" \
  default_ttl="1h" \
  max_ttl="24h"

# ٤. الحصول على بيانات اعتماد مؤقتة
vault read database/creds/readonly
# username: v-root-readonly-xyz...
# password: A1b2C3d4...
# lease_duration: 1h  ← تنتهي صلاحيتها تلقائياً بعد ساعة!
```

### 🔹 في CI/CD

```yaml
# GitHub Actions + Vault (OIDC)
- name: Get secrets from Vault
  uses: hashicorp/vault-action@v2
  with:
    url: https://vault.cloudnova.internal
    method: jwt
    role: github-actions
    secrets: |
      secret/data/cloudnova/production db_username | DB_USERNAME ;
      secret/data/cloudnova/production db_password | DB_PASSWORD
```

---

## ٣. Packer: بناء صور آلات

### 🔹 لماذا Packer؟

بدلاً من تهيئة كل VM بـ Ansible (يستغرق ١٠ دقائق)، ابني صورة جاهزة مرة واحدة (تستغرق دقيقة واحدة للنشر).

```hcl
# cloudnova-web.pkr.hcl
packer {
  required_plugins {
    azure = {
      version = ">= 2.0.0"
      source  = "github.com/hashicorp/azure"
    }
  }
}

source "azure-arm" "web" {
  # Azure settings
  subscription_id                   = var.subscription_id
  tenant_id                         = var.tenant_id
  client_id                         = var.client_id
  client_secret                     = var.client_secret

  # VM settings
  managed_image_name                = "cloudnova-web-${formatdate("YYYYMMDD", timestamp())}"
  managed_image_resource_group_name = "rg-cloudnova-images"
  location                          = "West Europe"
  vm_size                           = "Standard_DS2_v2"
  os_type                           = "Linux"

  # Source image
  image_publisher = "Canonical"
  image_offer     = "0001-com-ubuntu-server-jammy"
  image_sku       = "22_04-lts"
}

build {
  sources = ["source.azure-arm.web"]

  # ١. تحديث الحزم
  provisioner "shell" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt-get install -y nodejs nginx"
    ]
  }

  # ٢. نسخ ملفات التطبيق
  provisioner "file" {
    source      = "../web-app/dist/"
    destination = "/opt/web-app/"
  }

  # ٣. تشغيل Ansible
  provisioner "ansible" {
    playbook_file = "../ansible/playbooks/web-server.yml"
    extra_arguments = ["--extra-vars", "env=prod"]
  }

  # ٤. تنظيف قبل التعميم
  provisioner "shell" {
    inline = [
      "sudo waagent -deprovision+user -force",
      "sudo cloud-init clean --logs"
    ]
  }
}
```

```bash
# بناء الصورة
packer build cloudnova-web.pkr.hcl

# الآن استخدم managed_image_id في Terraform:
# source_image_id = "/subscriptions/.../images/cloudnova-web-20260716"
```

---

## ٤. مقارنة: أي أداة لأي مهمة؟

### 🔹 خريطة القرار

| المهمة                          | الأداة المناسبة          | لماذا؟                      |
| ------------------------------- | ------------------------ | --------------------------- |
| **بنية تحتية** (VMs, شبكات)     | Terraform                | Declarative، State، Modules |
| **تهيئة الخوادم** (تثبيت برامج) | Ansible                  | لا Agents، YAML سهل         |
| **صور VMs** (Golden Images)     | Packer                   | بناء مرة، نشر مرات          |
| **بيئات تطوير**                 | Vagrant                  | بيئة متطابقة للفريق كله     |
| **أسرار**                       | Vault                    | Dynamic Secrets، Audit      |
| **CI/CD**                       | GitHub Actions / Jenkins | أتمتة pipeline              |
| **مراقبة**                      | Prometheus + Grafana     | Metrics، تنبيهات            |
| **حاويات**                      | Docker + Kubernetes      | عزل، توسع                   |

### 🔹 سير العمل المتكامل

```
كود المصدر → GitHub Actions (Build + Test)
    ↓
Packer → بناء Golden Image مع التطبيق
    ↓
Terraform → نشر البنية التحتية + الصورة
    ↓
Ansible → تهيئة التكوينات النهائية
    ↓
Vault → توفير الأسرار ديناميكياً
    ↓
Prometheus → مراقبة كل شيء
```

---

## 🏢 سيناريو CloudNova: يوم في حياة مهندس DevOps

### ٨:٠٠ صباحاً — تنبيه

Prometheus يُرسل: "web-02 memory usage 95%"

### ٨:١٥ — تشخيص

```bash
# فحص سريع عبر Ansible
ansible web_servers -i inventory/production.yml -m shell -a "free -m"
# web-01: 512MB used / 2048MB total
# web-02: 1945MB used / 2048MB total ← مشكلة!
```

### ٨:٣٠ — إصلاح مؤقت

```bash
# توسيع الذاكرة عبر Terraform
terraform apply -var 'web_vm_size=Standard_DS3_v2'
```

### ٩:٠٠ — تحقيق الجذر

اتضح أن تسرب ذاكرة في الإصدار الجديد. الرجوع للإصدار السابق:

```bash
# Ansible rolling update للرجوع
ansible-playbook -i inventory/production.yml \
  deploy.yml --extra-vars "app_version=2.0.2"
```

### ٩:٣٠ — منع التكرار

إضافة memory alerts في Prometheus مع حد أدنى 80%:

```yaml
# prometheus/alerts/memory.yml
groups:
  - name: memory
    rules:
      - alert: HighMemoryUsage
        expr: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes < 0.2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "ذاكرة {{ $labels.instance }} أقل من 20%"
```

---

## 🧠 Active Recall

1. ما الفرق بين Terraform و Ansible؟ متى تستخدم كل منهما؟
2. كيف يُنشئ Vault كلمة مرور مؤقتة لقاعدة البيانات؟
3. لماذا Packer أفضل من تشغيل shell script على VM جديد؟
4. كيف تبني سير عمل متكامل بين Terraform + Ansible + Vault؟
5. متى تختار Docker Compose بدلاً من Kubernetes؟

---

## 📝 تمرين Feynman

اشرح HashiCorp Vault لمدير: تخيّل خزنة بنك. بدلاً من أن تعطي كل موظف مفتاح الخزنة (كلمة مرور ثابتة)، Vault يُصدر "بطاقة زيارة مؤقتة" (كلمة مرور تنتهي بعد ساعة). الموظف يدخل، يأخذ ما يحتاج، وتنتهي البطاقة. حتى لو سرق أحدهم البطاقة، لا يستخدمها بعد ساعة.

---

## 🃏 بطاقات تعليمية

| السؤال                        | الإجابة                    |
| ----------------------------- | -------------------------- |
| أداة تهيئة بدون Agents        | `Ansible`                  |
| محرك أسرار بـ Dynamic Secrets | `HashiCorp Vault`          |
| بناء Golden Images            | `Packer`                   |
| أمر فحص اتصال بـ Ansible      | `ansible all -m ping`      |
| قراءة سر من Vault             | `vault kv get secret/path` |

---

## 🎯 أسئلة مقابلة

### س: كيف تختار بين Ansible و Terraform؟

**الإجابة:**

- **Terraform**: للبنية التحتية (VMs, VNets, AKS). Declarative. State.
- **Ansible**: لتهيئة ما بداخل الـ VM (تثبيت برامج، تكوينات). Procedural.
- **معاً**: Terraform ينشئ الـ VM، Ansible يهيئه.
- **كقاعدة**: "Terraform يبني البيت. Ansible يفرشه."

---

<div align="center">

**[→ DevSecOps Pipeline](../17-devsecops/01-security-pipeline)

---

## 🏛️ طبقة الإنتاج

### Ansible + Terraform = ثنائي قوي

```bash
# Terraform ينشئ VM، Ansible يهيئه
terraform apply -auto-approve
ansible-playbook -i azure_rm.yml playbooks/provision.yml
```

### Vault في الإنتاج

```bash
vault operator init -key-shares=5 -key-threshold=3
vault operator unseal  # 3 مفاتيح من 5
```

---

## 🛠️ تدريبات

**تمرين ١:** Playbook لتثبيت Nginx + TLS.
**تمرين ٢:** Vault dynamic secrets لـ PostgreSQL.
**تحدي:** Packer image مع Ansible provisioner.

### 📝 تقييم

**س١:** Ansible vs Terraform؟
→ Terraform = بنية تحتية. Ansible = تهيئة.

**س٢:** Vault dynamic secrets = ؟
→ كلمات مرور مؤقتة تنتهي تلقائياً.

**س٣:** Packer = ؟
→ بناء صور VMs جاهزة مرة واحدة.

### 🎤 مقابلة
**"كيف تختار بين Ansible و Terraform؟"**
→ Terraform يبني البيت. Ansible يفرشه.

---

[← DevOps Culture](./01-devops-culture) | [🏠 الرئيسية](/)
**

</div>
