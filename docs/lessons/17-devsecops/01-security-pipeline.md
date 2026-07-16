---
sidebar_position: 1
title: "DevSecOps Pipeline"
description: "Shift-left security: SAST, DAST, SCA, container scanning in CI/CD."
---

# DevSecOps Pipeline

Shift-left security: SAST, DAST, SCA, container scanning in CI/CD.

## What You Will Learn

This module covers key concepts, patterns, and real-world scenarios to build production-ready cloud engineering skills.

## Security Pipeline Stages

| Stage      | Tool             | What it catches      |
| ---------- | ---------------- | -------------------- |
| Pre-commit | detect-secrets   | Hardcoded secrets    |
| SAST       | CodeQL, Semgrep  | Code vulnerabilities |
| SCA        | Dependabot, Snyk | Vulnerable deps      |
| Container  | Trivy, Aqua      | Image CVEs           |
| IaC        | Checkov, tfsec   | Misconfigurations    |

## Shift-Left Principle

Finding a vulnerability in production costs 100x more than finding it during development. Move security checks as early as possible in the pipeline.

## CloudNova Exercise

Apply what you learned to a real production scenario at CloudNova, your virtual cloud engineering company.

---

[← Back to Module](index.md) | [🏠 Home](/)
