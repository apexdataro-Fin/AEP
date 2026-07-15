---
sidebar_position: 3
title: Environment Setup
slug: /development/environment-setup
description: Development environment configuration guide
ai_metadata:
  category: development
  difficulty: beginner
  estimated_time_minutes: 10
  prerequisites: [getting-started]
  tags: [environment, tools, configuration]
---

# Environment Setup

## Recommended Tools

| Tool | Purpose | Install |
|---|---|---|
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |
| **nvm** | Node version manager | `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh \| bash` |
| **GitHub CLI** | PR management | `brew install gh` (macOS) or [cli.github.com](https://cli.github.com/) |

## VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.exclude": {
    "**/.docusaurus": true,
    "**/build": true,
    "**/node_modules": true
  },
  "search.exclude": {
    "**/.docusaurus": true,
    "**/build": true,
    "**/node_modules": true
  }
}
```

## ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "browser": true,
    "es2024": true
  }
}
```

## Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

## Git Configuration

```bash
# Line endings
git config --global core.autocrlf input

# Push behavior
git config --global push.default simple

# Default branch
git config --global init.defaultBranch main
```
