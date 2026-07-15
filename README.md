# Cloud Engineering Learning OS 🚀

> **The Operating System for Your Cloud Engineering Career**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Docusaurus](https://img.shields.io/badge/powered%20by-Docusaurus-2e8555?logo=docusaurus)](https://docusaurus.io/)
[![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-222?logo=github)](https://pages.github.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-5a0fc8?logo=pwa)](https://web.dev/progressive-web-apps/)

An interactive, open-source **learning platform** for cloud engineering — from fundamentals to advanced cloud architecture, DevOps, and Site Reliability Engineering. Designed to be modular, future-proof, and AI-ready.

---

## ✨ Vision

This is **not** a traditional book or course. This is the foundation of a **Cloud Engineering Learning Operating System** — a platform that will evolve into:

- 📚 **Interactive Documentation Platform** — structured learning paths with diagrams and code
- ⚡ **Progressive Web App (PWA)** — install anywhere, work offline
- 🤖 **AI Learning Platform** — AI-friendly metadata, future AI tutor integration
- 🧪 **Interactive Cloud Labs** — hands-on sandboxes and simulators
- 📊 **Knowledge Graph** — connected concepts, prerequisites, and relationships
- 🎓 **Career & Certification Platform** — guided career paths, exam prep

---

## 🏗️ Architecture

This project is built on **[Docusaurus 3](https://docusaurus.io/)** — a modern static site generator optimized for documentation.

| Layer         | Technology                                           |
| ------------- | ---------------------------------------------------- |
| **Framework** | React 19 + TypeScript                                |
| **SSG**       | Docusaurus 3.10                                      |
| **Markdown**  | MDX 3 (Markdown + JSX)                               |
| **Diagrams**  | Mermaid.js                                           |
| **Search**    | Local search (`@easyops-cn/docusaurus-search-local`) |
| **PWA**       | `@docusaurus/plugin-pwa` (offline mode, installable) |
| **Styling**   | CSS Custom Properties + Infima                       |
| **Hosting**   | GitHub Pages                                         |
| **CI/CD**     | GitHub Actions                                       |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Serve production build locally
npm run serve
```

---

## 📁 Project Structure

```
AEP/
├── docs/                    # All documentation (Markdown/MDX)
│   ├── architecture/        # System architecture docs
│   ├── development/         # Developer guides
│   ├── standards/           # Style, naming, content standards
│   ├── guides/              # How-to guides (Mermaid, AI, contributing)
│   └── reference/           # Glossary, roadmap, changelog, API ref
├── curriculum/              # Learning curriculum (structured paths)
├── lessons/                 # Individual lessons
├── projects/                # Hands-on projects
├── labs/                    # Interactive lab exercises
├── simulators/              # Cloud simulators
├── career/                  # Career path guides
├── certifications/          # Certification prep materials
├── knowledge-graph/         # Concept relationships and metadata
├── metadata/                # AI-friendly content metadata
├── templates/               # Content and doc templates
├── schemas/                 # JSON Schema definitions
├── src/                     # React components, theme, hooks, utils
├── static/                  # Static assets (images, fonts, icons)
├── scripts/                 # Build and automation scripts
├── automation/              # GitHub Actions, CI/CD
├── examples/                # Example content and code
├── tests/                   # Test suites
├── public/                  # Public web assets (manifest, robots.txt)
└── api/                     # API specifications
```

---

## 🎨 Features

- ✅ **Dark Mode** — Automatic, respects system preference
- ✅ **PWA** — Installable, works offline
- ✅ **Full-Text Search** — Local search, no external service needed
- ✅ **Mermaid Diagrams** — Architecture diagrams, flowcharts, sequences
- ✅ **Responsive Design** — Mobile, tablet, desktop
- ✅ **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation
- ✅ **AI Metadata** — Structured metadata for AI consumption
- ✅ **TypeScript** — Full type safety
- ✅ **Modular Architecture** — Each feature area is independently maintainable

---

## 📖 Documentation

- [Architecture Overview](https://apexdataro-fin.github.io/AEP/architecture/overview)
- [Development Guide](https://apexdataro-fin.github.io/AEP/development/overview)
- [Style Guide](https://apexdataro-fin.github.io/AEP/standards/style-guide)
- [Mermaid Guide](https://apexdataro-fin.github.io/AEP/guides/mermaid-guide)
- [AI Integration Guide](https://apexdataro-fin.github.io/AEP/guides/ai-integration)
- [Contributing Guide](https://apexdataro-fin.github.io/AEP/guides/contributing)
- [Roadmap](https://apexdataro-fin.github.io/AEP/reference/roadmap)

---

## 🤝 Contributing

Contributions are welcome! See the [Contributing Guide](docs/guides/contributing.md) for details.

---

## 📄 License

MIT © Cloud Engineering Learning OS
