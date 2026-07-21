---
sidebar_position: 3
title: "اختبار Python و CI/CD"
description: "pytest، unittest، mocking، GitHub Actions للـ Python — دمج الاختبارات في خط الأنابيب."

# اختبار Python و CI/CD

> "كود بدون اختبارات هو دَيْن تقني. ستسدده لاحقاً مع الفوائد."

## 🎯 أهداف التعلم

- كتابة unit tests فعالة مع pytest
- Mocking لموارد Azure
- دمج الاختبارات في GitHub Actions
- Code Coverage و Quality Gates

## ⏱️ الوقت المقدر: 40 دقيقة | المستوى: Intermediate

---

## ١. pytest — الأساسيات

```python
# test_azure_vm.py
import pytest
from unittest.mock import Mock, patch

def test_vm_size_validation():
    valid_skus = ["Standard_B1s", "Standard_B2s", "Standard_D2s_v3"]
    assert "Standard_B1s" in valid_skus
    assert "Standard_B2s" in valid_skus

def test_vm_name_length():
    """اسم الـ VM يجب أن يكون بين 1 و 15 حرفاً (Windows)"""
    vm_name = "web-server-01"
    assert 1 <= len(vm_name) <= 15

# Mocking Azure SDK calls
@patch('azure.mgmt.compute.ComputeManagementClient')
def test_create_vm(mock_compute):
    mock_compute.virtual_machines.begin_create_or_update.return_value.result.return_value.name = "test-vm"
    from my_azure_utils import create_vm
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

### Fixtures

```python
@pytest.fixture
def mock_compute_client():
    with patch('azure.mgmt.compute.ComputeManagementClient') as mock:
        yield mock

def test_list_vms(mock_compute_client):
    mock_compute_client.virtual_machines.list.return_value = [
        type('VM', (), {'name': 'web-01', 'location': 'westeurope'})(),
        type('VM', (), {'name': 'web-02', 'location': 'westeurope'})(),
    ]
    from my_azure_utils import get_vm_list
    vms = get_vm_list("cloudnova-prod")
    assert len(vms) == 2
```

---

## ٢. GitHub Actions للـ Python

```yaml
name: Python Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - run: pip install -r requirements.txt pytest pytest-cov
      - run: pytest tests/ --cov=src/ --cov-report=xml --cov-fail-under=80
      - uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage.xml
```

### Quality Gates (pre-commit)

```yaml
# pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.1.0
    hooks:
      - id: black
  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: check-ast
      - id: check-yaml
      - id: detect-private-key # لا تدفع مفاتيح خاصة!
```

---

## 🏛️ طبقة الإنتاج: سيناريو CloudNova

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

**الدرس**: هذا الاختبار منع كارثة — السكربت كان سيحذف RG الإنتاج!

### Integration Test مع Azure

```python
@pytest.mark.integration
def test_create_resource_group():
    """اختبار حقيقي على Azure (يُشغّل فقط في CI/CD)"""
    import os
    if not os.getenv("AZURE_INTEGRATION_TESTS"):
        pytest.skip("Set AZURE_INTEGRATION_TESTS=1 to run")

    from azure.identity import DefaultAzureCredential
    from azure.mgmt.resource import ResourceManagementClient

    credential = DefaultAzureCredential()
    client = ResourceManagementClient(credential, os.getenv("AZURE_SUBSCRIPTION_ID"))

    rg_name = f"test-rg-{int(time.time())}"
    client.resource_groups.create_or_update(rg_name, {"location": "westeurope"})

    # Cleanup
    client.resource_groups.begin_delete(rg_name)
```

---

## 🛠️ تدريبات

### تمرين 1: اكتب اختبارات لسكربت

خذ سكربت Azure من الدرس السابق واكتب له 5 اختبارات.

### تمرين 2: CI/CD Pipeline كامل

ابنِ GitHub Actions workflow:

- يشغّل الاختبارات عند كل push
- يتحقق من %80 coverage minimum
- يرفض merge إذا فشلت الاختبارات

### تحدي: اختبارات End-to-End

اكتب test يتحقق من أن نشر VM + NSG + Storage Account يعمل معاً بشكل صحيح.

---

## 📝 تقييم

### ✅ فحص المعرفة

1. ما الفرق بين unit test و integration test؟
2. لماذا نستخدم mocking مع Azure SDK؟
3. ما فائدة parametrized tests؟
4. كيف تمنع دفع secrets إلى GitHub؟

### 🃏 بطاقات

| السؤال     | الإجابة                       |
| ---------- | ----------------------------- |
| pytest     | إطار اختبارات Python          |
| Mock       | كائن وهمي يحاكي Azure SDK     |
| Coverage   | نسبة الكود المغطى بالاختبارات |
| pre-commit | فحص الكود قبل commit          |

---

## 🎤 مقابلة

1. **"كيف تختبر كوداً يتفاعل مع Azure؟"**
   → Unit tests مع mocking. Integration tests في بيئة منفصلة.

2. **"كيف تضمن جودة الكود في فريق؟"**
   → pre-commit hooks + CI/CD + code review + coverage minimum

---

## 📚 مراجع

| النوع     | الرابط                                             |
| --------- | -------------------------------------------------- |
| درس مرتبط | [Azure SDK Mastery](./02-python-azure-sdk-mastery) |
| درس مرتبط | [CI/CD Pipelines](../../15-cicd/01-cicd-pipelines) |
| دليل      | [pytest Docs](https://docs.pytest.org)             |

---

[← Azure SDK Mastery](./02-python-azure-sdk-mastery) | [→ Cloud Concepts](../../06-cloud-fundamentals/01-cloud-concepts) | [🏠 الرئيسية](/)
