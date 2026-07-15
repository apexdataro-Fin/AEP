"""
Celery configuration for AEP project.
"""
import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "aep_project.settings")

app = Celery("aep")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
