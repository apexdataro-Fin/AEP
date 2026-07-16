---
sidebar_position: 1
title: "Python لأتمتة السحابة"
description: "أتمتة Azure مع Python SDK، كتابة أدوات CLI، والتعامل مع APIs السحابية."
---

# Python لأتمتة السحابة

> "Python هي سكين الجيش السويسري لمهندس السحابة. من السكربتات السريعة إلى أدوات الإنتاج."

## 🎯 أهداف التعلم

- إتقان Azure Python SDK
- كتابة أدوات CLI احترافية
- أتمتة مهام السحابة المتكررة
- التعامل مع REST APIs
- كتابة اختبارات لأدوات الأتمتة

---

## 📖 الطبقة الأساسية: لماذا Python لمهندس السحابة؟

```
Python + Cloud Engineering:

├── أتمتة متكررة
│   ├── تنظيف الموارد غير المستخدمة
│   ├── نسخ احتياطي تلقائي
│   └── تقارير دورية
│
├── Integration
│   ├── ربط خدمات متعددة
│   ├── Webhooks ومعالجة الأحداث
│   └── ETL (استخراج وتحويل وتحميل البيانات)
│
├── Infrastructure as Code
│   ├── Pulumi (Python)
│   ├── CDK for Terraform (Python)
│   └── Custom automation scripts
│
└── Observability
    ├── Custom metrics exporters
    ├── Log parsing
    └── Alert automation
```

---

## 🧱 الطبقة المهنية: Azure Python SDK

### إدارة الموارد

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient
from azure.mgmt.resource import ResourceManagementClient
from datetime import datetime, timedelta, timezone

credential = DefaultAzureCredential()
subscription_id = "your-subscription-id"

# 1.Resource Groups
resource_client = ResourceManagementClient(credential, subscription_id)

def create_rg(name: str, location: str, tags: dict):
    return resource_client.resource_groups.create_or_update(
        name,
        {
            "location": location,
            "tags": tags
        }
    )

# 2. Virtual Machines
compute_client = ComputeManagementClient(credential, subscription_id)

def list_vms():
    """قائمة بكل VMs في الاشتراك"""
    vms = []
    for vm in compute_client.virtual_machines.list_all():
        vms.append({
            "name": vm.name,
            "location": vm.location,
            "size": vm.hardware_profile.vm_size,
            "os": vm.storage_profile.os_disk.os_type
        })
    return vms

def stop_idle_vms(rg_name: str, max_cpu_percent: float = 5.0):
    """إيقاف VMs التي استهلاكها منخفض"""
    # هذه تحتاج Azure Monitor metrics
    pass

# 3. البحث عن الموارد غير المستخدمة
def find_unused_disks():
    """إيجاد Managed Disks غير مرتبطة بأي VM"""
    unused = []
    for disk in compute_client.disks.list():
        if disk.managed_by is None:
            unused.append({
                "name": disk.name,
                "size_gb": disk.disk_size_gb,
                "created": disk.time_created
            })
    return unused
```

### المسح الدوري والتنظيف

```python
import schedule
import time

def cleanup_job():
    """مهمة تنظيف أسبوعية"""

    print(f"[{datetime.now()}] Starting cleanup...")

    # 1. حذف Snapshots أقدم من 30 يوماً
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    for snapshot in compute_client.snapshots.list():
        if snapshot.time_created < thirty_days_ago:
            compute_client.snapshots.begin_delete(
                snapshot.resource_group,
                snapshot.name
            )
            print(f"Deleted old snapshot: {snapshot.name}")

    # 2. إزالة Public IPs غير المرتبطة
    network_client = NetworkManagementClient(credential, subscription_id)
    for ip in network_client.public_ip_addresses.list_all():
        if ip.ip_configuration is None:
            network_client.public_ip_addresses.begin_delete(
                resource_group_name_from_id(ip.id),
                ip.name
            )
            print(f"Deleted orphan IP: {ip.name}")

    print(f"[{datetime.now()}] Cleanup complete!")

# جدولة أسبوعية
schedule.every().sunday.at("03:00").do(cleanup_job)

while True:
    schedule.run_pending()
    time.sleep(60)
```

---

## 🏗️ الطبقة الإنتاجية: أدوات CLI احترافية

### هيكل أداة CLI

```
cloudnova-cli/
├── cloudnova/
│   ├── __init__.py
│   ├── main.py          # نقطة الدخول
│   ├── commands/
│   │   ├── __init__.py
│   │   ├── deploy.py    # نشر الموارد
│   │   ├── cleanup.py   # تنظيف
│   │   ├── report.py    # تقارير
│   │   └── diagnose.py  # تشخيص
│   ├── core/
│   │   ├── __init__.py
│   │   ├── azure_client.py
│   │   └── config.py
│   └── utils/
│       ├── __init__.py
│       ├── logging_config.py
│       └── validators.py
├── tests/
├── setup.py
└── requirements.txt
```

### CLI مع click

```python
import click
from azure.identity import DefaultAzureCredential
from rich.console import Console
from rich.table import Table
from rich.progress import Progress

console = Console()

@click.group()
@click.option("--subscription", envvar="AZURE_SUBSCRIPTION_ID", required=True)
@click.pass_context
def cli(ctx, subscription):
    """CloudNova CLI - أداة إدارة السحابة"""
    ctx.ensure_object(dict)
    ctx.obj["subscription"] = subscription
    ctx.obj["credential"] = DefaultAzureCredential()

@cli.command()
@click.option("--resource-group", "-g", required=True)
@click.option("--output", "-o", type=click.Choice(["table", "json"]), default="table")
@click.pass_context
def list_vms(ctx, resource_group, output):
    """قائمة بكل الآلات الافتراضية"""
    credential = ctx.obj["credential"]
    subscription = ctx.obj["subscription"]

    compute_client = ComputeManagementClient(credential, subscription)
    vms = compute_client.virtual_machines.list(resource_group)

    if output == "table":
        table = Table(title=f"VMs in {resource_group}")
        table.add_column("Name", style="cyan")
        table.add_column("Size", style="green")
        table.add_column("OS", style="yellow")
        table.add_column("State", style="magenta")

        for vm in vms:
            table.add_row(
                vm.name,
                vm.hardware_profile.vm_size,
                vm.storage_profile.os_disk.os_type,
                "Running"  # تحتاج Instance View للحالة الحقيقية
            )
        console.print(table)
    else:
        import json
        click.echo(json.dumps([{"name": vm.name} for vm in vms], indent=2))

@cli.command()
@click.argument("environment", type=click.Choice(["dev", "staging", "prod"]))
@click.option("--dry-run", is_flag=True, help="معاينة دون تنفيذ")
@click.pass_context
def cleanup(ctx, environment, dry_run):
    """تنظيف الموارد غير المستخدمة"""
    console.print(f"[bold yellow]تنظيف بيئة: {environment}[/bold yellow]")

    if dry_run:
        console.print("[dim]وضع المعاينة - لن يتم حذف أي شيء[/dim]")

    with Progress() as progress:
        task = progress.add_task("[cyan]جاري المسح...", total=100)

        # البحث عن الموارد غير المستخدمة
        progress.update(task, advance=50)
        unused_resources = find_unused_resources(environment)

        progress.update(task, advance=50)

    if unused_resources:
        console.print(f"[red]تم العثور على {len(unused_resources)} موارد غير مستخدمة[/red]")
        for res in unused_resources:
            console.print(f"  • {res['type']}: {res['name']}")
    else:
        console.print("[green]لا توجد موارد غير مستخدمة ✓[/green]")

if __name__ == "__main__":
    cli()
```

---

## 🎨 الطبقة المعمارية: أنماط متقدمة

### Retry مع exponential backoff

```python
import time
from functools import wraps
from azure.core.exceptions import ServiceRequestError

def retry_with_backoff(max_retries=3, base_delay=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except ServiceRequestError as e:
                    if attempt == max_retries - 1:
                        raise
                    delay = base_delay * (2 ** attempt)
                    print(f"Retry {attempt+1}/{max_retries} in {delay}s...")
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

@retry_with_backoff(max_retries=3)
def create_vm_with_retry(params):
    return compute_client.virtual_machines.begin_create_or_update(**params)
```

### Pagination helper

```python
def list_all_paginated(paginator, max_results=None):
    """استخراج كل العناصر من paginated response"""
    results = []
    for item in paginator:
        results.append(item)
        if max_results and len(results) >= max_results:
            break
    return results

# استخدام
all_vms = list_all_paginated(
    compute_client.virtual_machines.list_all()
)
```

---

## 🏥 سيناريو CloudNova: أتمتة تقرير أسبوعي

```python
def generate_weekly_report():
    """توليد تقرير أسبوعي تلقائي"""

    report = {
        "week": datetime.now().isocalendar()[1],
        "generated_at": datetime.now().isoformat(),
        "resources": {},
        "costs": {},
        "recommendations": []
    }

    # 1. إحصاء الموارد
    report["resources"] = {
        "vms": count_vms(),
        "databases": count_databases(),
        "storage_accounts": count_storage_accounts(),
        "aks_clusters": count_aks_clusters()
    }

    # 2. التكاليف الأسبوعية
    report["costs"] = get_weekly_costs()

    # 3. توصيات التوفير
    if find_unused_disks():
        report["recommendations"].append(
            "⚠️ توجد Managed Disks غير مستخدمة — احذفها لتوفير التكاليف"
        )

    if find_underutilized_vms(threshold_cpu=10):
        report["recommendations"].append(
            "💡 توجد VMs باستهلاك أقل من 10% —可以考虑 right-sizing"
        )

    # 4. إرسال التقرير
    send_to_teams(report)
    save_to_storage(report, f"reports/weekly-{report['week']}.json")

    return report
```

---

## ⚡ الإنتاج وما بعده

### أفضل ممارسات Python للسحابة

| الممارسة             | مثال                                                          |
| -------------------- | ------------------------------------------------------------- |
| **Type hints**       | `def get_vm(name: str) -> VirtualMachine:`                    |
| **Async/await**      | `async for vm in compute_client.virtual_machines.list_all():` |
| **Logging**          | `logging.getLogger(__name__)` وليس `print()`                  |
| **خطأ لطيف**         | `try/except` مع رسائل واضحة للمستخدم                          |
| **Config من البيئة** | `os.getenv("AZURE_SUBSCRIPTION_ID")`                          |
| **اختبارات**         | `pytest` مع `unittest.mock` لـ Azure SDK                      |

---

## 🧠 التذكّر النشط

1. كيف تتعامل مع pagination في Azure Python SDK؟
2. لماذا نستخدم `DefaultAzureCredential` بدلاً من hardcoded keys؟
3. كيف تبني CLI أداة احترافية لفريقك؟
4. متى تستخدم async/await في أتمتة السحابة؟
5. كيف تختبر كوداً يتعامل مع Azure APIs؟

## 📝 بطاقات تعليمية

- **DefaultAzureCredential**: سلسلة اعتماد تحاول عدة طرق (Managed Identity → Environment → CLI → VS Code)
- **Pagination**: آلية Azure لتقسيم النتائج الكبيرة إلى صفحات
- **Click/Typer**: مكتبات Python لبناء CLI
- **Rich**: مكتبة لتنسيق مخرجات الطرفية (جداول، ألوان، progress bars)
- **Mock**: محاكاة Azure APIs في الاختبارات دون اتصال حقيقي

## 🎤 أسئلة المقابلة

1. **"كيف تؤمّن أداة CLI تتصل بـ Azure؟"**
   - `DefaultAzureCredential` — لا hardcoded secrets
   - Managed Identity في Azure
   - Environment variables للتطوير المحلي
   - Azure CLI credential كحل أخير

2. **"كيف تبني أداة أتمتة قابلة للتوسع؟"**
   - Plugin architecture
   - Configuration-driven (YAML config)
   - Events/hooks system
   - Logging + metrics مدمجة

3. **"متى تستخدم Python ومتى تستخدم Bash؟"**
   - Bash: سكربتات بسيطة (< 50 سطر)، عمليات shell
   - Python: منطق معقد، API calls، error handling، testing

---

[← العودة إلى الموديول](../index.md) | [🏠 الرئيسية](/)
