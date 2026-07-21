---
displayed_sidebar: devSidebar
sidebar_position: 2
title: Getting Started
slug: /development/getting-started
description: First-time setup guide for contributors
ai_metadata:
  category: development
  difficulty: beginner
  estimated_time_minutes: 15
  prerequisites: []
  tags: [getting-started, setup, first-time]
---

displayed_sidebar: devSidebar

# Getting Started

## Prerequisites Installation

### Node.js & npm

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
nvm use 22

# Verify
node --version  # Should be ≥ 20.0
npm --version   # Should be ≥ 10.0
```

### Git

```bash
git --version  # Should be ≥ 2.40

# Configure if needed
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Clone & Install

```bash
# Clone the repository
git clone https://github.com/apexdataro-Fin/AEP.git
cd AEP

# Install dependencies
npm install

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verify Your Setup

```bash
# Run all validation checks
npm run validate

# Expected output:
# ✓ TypeScript compilation passes
# ✓ All files are properly formatted
```

## Editor Setup (VS Code)

Recommended extensions:

- **ESLint** — Linting integration
- **Prettier** — Format on save
- **MDX** — Syntax highlighting for `.mdx` files
- **Mermaid Preview** — Preview diagrams in-editor

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## Common Issues

| Issue                     | Solution                                             |
| ------------------------- | ---------------------------------------------------- |
| `node: command not found` | Install Node.js via nvm                              |
| `npm install` fails       | Delete `node_modules` and `package-lock.json`, retry |
| Port 3000 in use          | `npx kill-port 3000` then retry                      |
| Build errors              | Run `npm run clear` then `npm run build`             |
