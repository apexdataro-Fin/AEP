---
sidebar_position: 3
title: "اختبار Python و CI/CD"
description: "pytest، unittest، mocking، GitHub Actions للـ Python — دمج الاختبارات في خط الأنابيب."
---

# اختبار Python و CI/CD

> "كود بدون اختبارات هو دَيْن تقني. ستسدده لاحقاً مع الفوائد."

## 🎯 أهداف التعلم

- كتابة unit tests فعالة مع pytest
- Mocking لموارد Azure
- دمج الاختبارات في GitHub Actions
- Code Coverage و Quality Gates

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

---

## 🏗️ الطبقة الأساسية

### pytest — الأساسيات

```python
# test_azure_vm.py
import pytest
from unittest.mock import Mock, patch
from azure.mgmt.compute import ComputeManagementClient

def test_vm_size_validation():
    """تأكد من أن الـ SKU صالح"""
    valid_skus = ["Standard_B1s", "Standard_B2s", "Standard_D2s_v3"]
    assert "Standard_B1s" in valid_skus
    assert "Standard_MegaLarge" not in valid_skus

def test_vm_name_length():
    """اسم الـ VM يجب أن يكون بين 1 و 15 حرفاً (Windows)"""
    vm_name = "web-server-01"
    assert 1 <= len(vm_name) <= 15

# Mocking Azure SDK calls
@patch('azure.mgmt.compute.ComputeManagementClient')
def test_create_vm(mock_compute):
    """اختبار إنشاء VM بدون استدعاء Azure الحقيقي"""
    mock_compute.virtual_machines.begin_create_or_update.return_value.result.return_value.name = "test-vm"
    
    result = create_vm("test-rg", "test-vm", "westeurope", "Standard_B1s")
    assert result.name == "test-vm"

# Parametrized tests
@pytest.mark.parametrize("sku,expected_cores", [
    ("Standard_B1s", 1),
    ("Standard_B2s", 2),
    ("Standard_D2s_v3", 2),
])
def test_sku_cores(sku, expected_cores):
    from my_azure_utils import get_vm_cores
    assert get_vm_cores(sku) == expected_cores
```

### GitHub Actions للـ Python

```yaml
name: Python Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt pytest pytest-cov
      - run: pytest tests/ --cov=src/ --cov-report=xml --cov-fail-under=80
      - uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage.xml
```

### Quality Gates

```python
# pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.1.0
    hooks:
      - id: black
        language_version: python3.11
  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
        args: [--max-line-length=100]
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: check-ast  # تأكد من صحة الـ syntax
      - id: check-yaml
      - id: detect-private-key  # لا تدفع مفاتيح خاصة!
```

---

## 🏛️ إنتاج: سيناريو CloudNova

في CloudNova، أحد السكربتات كان يحذف Resource Groups قديمة تلقائياً. كتبنا اختباراً مع mocking:

```python
def test_auto_cleanup_skips_production():
    """سكربت التنظيف يجب ألا يلمس RG الإنتاج أبداً"""
    with patch('my_azure_utils.list_resource_groups') as mock_list:
        mock_list.return_value = [
            {"name": "cloudnova-prod", "tags": {"env": "production"}},
            {"name": "cloudnova-dev-old", "tags": {"env": "development"}},
        ]
        to_delete = auto_cleanup(days_old=30)
        assert "cloudnova-prod" not in to_delete  # حماية!
        assert "cloudnova-dev-old" in to_delete
```

**الدرس**: اختبارات الجودة تنقذ من الكوارث. بدون هذا الاختبار، السكربت كان سيحذف الإنتاج!

---

## 🛠️ تدريبات

### تمرين: اكتب اختبارات لسكربت

خذ سكربت Azure من الدرس السابق واكتب له 5 اختبارات على الأقل.

### تحدي: CI/CD Pipeline كامل

ابنِ GitHub Actions workflow:
- يشغّل الاختبارات عند كل push
- يتحقق من %80 coverage minimum
- يرفض merge إذا فشلت الاختبارات
- يرسل notification إلى Microsoft Teams

---

[← Azure SDK Mastery](./02-python-azure-sdk-mastery) | [→ Cloud Concepts](../../06-cloud-fundamentals/01-cloud-concepts) | [🏠 الرئيسية](/)
