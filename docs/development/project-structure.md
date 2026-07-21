---
displayed_sidebar: devSidebar
sidebar_position: 4
title: Project Structure
slug: /development/project-structure
description: Complete project directory structure and file descriptions
ai_metadata:
  category: development
  difficulty: beginner
  estimated_time_minutes: 15
  prerequisites: [getting-started]
  tags: [structure, organization, directories]
---

displayed_sidebar: devSidebar

# Project Structure

```
AEP/
│
├── .github/                        # GitHub configuration
│   └── workflows/                  # CI/CD workflows
│       ├── deploy.yml              # Deploy to GitHub Pages
│       └── validate.yml            # PR validation checks
│
├── api/                            # API specifications
│   └── openapi.yaml                # OpenAPI 3.1 specification
│
├── automation/                     # Automation scripts
│   └── generate-search-index.js    # Search index generation
│
├── career/                         # Career path documentation
│   └── _category_.json             # Docusaurus category metadata
│
├── certifications/                 # Certification prep materials
│   └── _category_.json
│
├── curriculum/                     # Learning curriculum
│   └── _category_.json
│
├── docs/                           # Core documentation (MDX)
│   ├── intro.md                    # Landing page
│   ├── architecture/               # System architecture
│   │   ├── overview.md
│   │   ├── system-design.md
│   │   ├── data-flow.md
│   │   ├── technology-stack.md
│   │   └── security-model.md
│   ├── development/                # Development guides
│   │   ├── overview.md
│   │   ├── getting-started.md
│   │   ├── environment-setup.md
│   │   ├── project-structure.md
│   │   ├── workflows.md
│   │   ├── testing.md
│   │   └── deployment.md
│   ├── standards/                  # Coding & content standards
│   │   ├── overview.md
│   │   ├── style-guide.md
│   │   ├── naming-conventions.md
│   │   ├── code-quality.md
│   │   ├── documentation-standards.md
│   │   ├── content-standards.md
│   │   └── metadata-guide.md
│   ├── guides/                     # How-to guides
│   │   ├── overview.md
│   │   ├── mermaid-guide.md
│   │   ├── ai-integration.md
│   │   ├── contributing.md
│   │   └── knowledge-graph-guide.md
│   └── reference/                  # Reference material
│       ├── overview.md
│       ├── glossary.md
│       ├── roadmap.md
│       ├── changelog.md
│       ├── quality-standards.md
│       └── api-reference.md
│
├── examples/                       # Example content
│   └── lesson-template.mdx         # Template for new lessons
│
├── knowledge-graph/                # Knowledge graph definitions
│
├── labs/                           # Interactive lab exercises
│
├── lessons/                        # Lesson content
│
├── metadata/                       # AI-friendly content metadata
│   ├── content-schema.json
│   └── taxonomy.json
│
├── projects/                       # Hands-on projects
│
├── public/                         # Public web assets
│   ├── manifest.json               # PWA manifest
│   └── robots.txt                  # Search engine rules
│
├── schemas/                        # JSON Schema definitions
│   ├── lesson.schema.json
│   ├── project.schema.json
│   ├── lab.schema.json
│   └── metadata.schema.json
│
├── scripts/                        # Build & utility scripts
│   ├── validate-content.js         # Content validation
│   └── generate-sitemap.js         # Sitemap generation
│
├── simulators/                     # Cloud simulators
│
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── HomepageFeatures/       # Homepage feature cards
│   │   ├── interactive/            # Interactive components
│   │   ├── layout/                 # Layout components
│   │   └── shared/                 # Shared/reusable components
│   ├── css/
│   │   └── custom.css              # Global styles
│   ├── data/                       # Static data files
│   ├── hooks/                      # Custom React hooks
│   ├── pages/                      # Custom pages
│   │   ├── index.tsx               # Homepage
│   │   └── index.module.css        # Homepage styles
│   ├── services/                   # Service modules
│   ├── styles/                     # Additional styles
│   ├── theme/                      # Theme customizations
│   ├── types/                      # TypeScript type definitions
│   └── utils/                      # Utility functions
│
├── static/                         # Static assets
│   ├── img/                        # Images
│   │   ├── diagrams/               # Diagram source files
│   │   └── icons/                  # Icon assets
│   └── fonts/                      # Font files
│
├── templates/                      # Content templates
│   ├── lesson-template.mdx
│   ├── project-template.mdx
│   ├── lab-template.mdx
│   └── concept-template.mdx
│
├── tests/                          # Test suites
│
├── .gitignore                      # Git ignore rules
├── .prettierrc                     # Prettier configuration
├── docusaurus.config.ts            # Docusaurus configuration
├── package.json                    # Dependencies & scripts
├── package-lock.json               # Locked dependency versions
├── README.md                       # Project README
├── sidebars.ts                     # Sidebar definitions
└── tsconfig.json                   # TypeScript configuration
```

## Key Conventions

1. **Documentation** lives in `docs/` with subdirectories by topic
2. **Content modules** (curriculum, lessons, projects, labs) each have their own top-level directory
3. **Source code** is restricted to `src/` — React components, hooks, utilities
4. **Static assets** go in `static/` — served at the root path
5. **Templates** and **schemas** are in their own top-level directories for easy discovery
