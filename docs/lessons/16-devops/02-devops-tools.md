---
sidebar_position: 2
title: "أدوات DevOps"
description: "Terraform، Ansible، Packer — مجموعة أدوات DevOps المتكاملة."
---

# أدوات DevOps

> **"الأدوات ليست DevOps. لكن الأدوات الصحيحة تجعل DevOps ممكناً."**

## مجموعة الأدوات المتكاملة

| الأداة | الغرض | بديل |
|---|---|---|
| **Terraform** | بنية تحتية ككود | Pulumi, Bicep |
| **Ansible** | إدارة التكوين | Chef, Puppet, Salt |
| **Packer** | بناء صور الآلات | Dockerfiles (للحاويات) |
| **Vault** | إدارة الأسرار | Azure Key Vault, AWS Secrets Manager |
| **Consul** | اكتشاف الخدمات | Kubernetes DNS, Istio |

## Ansible — إدارة التكوين

```yaml
# playbook.yml — تثبيت Nginx على ١٠٠ خادم
- hosts: webservers
  become: yes
  tasks:
    - name: تثبيت Nginx
      apt:
        name: nginx
        state: latest

    - name: نسخ ملف الإعدادات
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: restart nginx

  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
```

## HashiCorp Vault — إدارة الأسرار

```bash
# تخزين سر
vault kv put secret/cloudnova/db password=SuperSecret123

# استرجاعه في CI/CD
export DB_PASSWORD=$(vault kv get -field=password secret/cloudnova/db)

# تجديد تلقائي
vault write azure/config/rotate-root
```

---

[← الدرس السابق](devops-culture) | [العودة للوحدة](index.md) | [🏠 الرئيسية](/)
