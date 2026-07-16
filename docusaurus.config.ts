import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkBidiIsolate from "./plugins/remark-bidi-isolate/index.mjs";

const config: Config = {
  title: "ARES EDU PLATFORM",
  tagline: "The Reusable Learning Operating System",
  favicon: "img/favicon.svg",

  future: {
    v4: true,
  },

  // GitHub Pages: https://apexdataro-fin.github.io/AEP/
  url: "https://apexdataro-fin.github.io",
  baseUrl: "/AEP/",
  trailingSlash: false,
  organizationName: "apexdataro-Fin",
  projectName: "AEP",

  onBrokenLinks: "warn",
  onBrokenAnchors: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
    mdx1Compat: {
      comments: false,
      admonitions: false,
      headingIds: false,
    },
  },

  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: undefined,
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
          routeBasePath: "docs",
          path: "docs",
          beforeDefaultRemarkPlugins: [remarkBidiIsolate],
        },
        blog: false,
        pages: {
          path: "src/pages",
        },
        theme: {
          customCss: ["./src/css/custom.css", "./src/css/platform.css"],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-pwa",
      {
        debug: false,
        offlineModeActivationStrategies: ["appInstalled", "standalone", "queryString"],
        pwaHead: [
          {
            tagName: "link",
            rel: "icon",
            href: "/AEP/img/favicon.svg",
          },
          {
            tagName: "link",
            rel: "manifest",
            href: "/AEP/manifest.json",
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "#0ea5e9",
          },
        ],
      },
    ],
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        indexDocs: true,
        indexPages: true,
      },
    ],
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 85,
        max: 1200,
        min: 640,
        steps: 3,
        disableInDev: false,
      },
    ],
  ],

  themeConfig: {
    metadata: [
      { name: "author", content: "Cloud Engineering Learning OS" },
      {
        name: "description",
        content:
          "An interactive learning platform for mastering cloud engineering — from fundamentals to advanced cloud architecture, DevOps, and SRE.",
      },
      {
        name: "keywords",
        content:
          "cloud engineering, devops, sre, learning, platform, aws, azure, gcp, kubernetes, terraform",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],

    image: "img/social-card.png",
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
      disableSwitch: false,
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },

    mermaid: {
      theme: { light: "neutral", dark: "dark" },
      options: {
        maxTextSize: 50000,
      },
    },

    navbar: {
      title: "ARES EDU",
      logo: {
        alt: "ARES EDU PLATFORM — Home",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
        href: "/",
      },
      hideOnScroll: false,
      items: [
        {
          to: "/",
          label: "🏠 Home",
          position: "left",
          exact: true,
        },
        {
          to: "/docs/lessons",
          label: "📚 Lessons",
          position: "left",
        },
        {
          to: "/academy",
          label: "Academies",
          position: "left",
        },
        {
          to: "/courses",
          label: "Courses",
          position: "left",
        },
        {
          to: "/projects",
          label: "Projects",
          position: "left",
        },
        {
          to: "/labs",
          label: "Labs",
          position: "left",
        },
        {
          to: "/simulators",
          label: "Simulators",
          position: "left",
        },
        {
          to: "/career",
          label: "Career",
          position: "left",
        },
        {
          to: "/certifications",
          label: "Certifications",
          position: "left",
        },
        {
          type: "dropdown",
          label: "More",
          position: "left",
          items: [
            { label: "Knowledge Graph", to: "/docs/guides/knowledge-graph-guide" },
            { label: "AI Assistant", to: "/docs/guides/ai-integration" },
            { label: "Settings", to: "/docs/development/environment-setup" },
          ],
        },
        {
          type: "dropdown",
          label: "Developer",
          position: "right",
          items: [
            { label: "Architecture", to: "/docs/architecture" },
            { label: "Development Guide", to: "/docs/development" },
            { label: "API Reference", to: "/docs/reference/api-reference" },
            { label: "GitHub", href: "https://github.com/apexdataro-Fin/AEP" },
          ],
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Learn",
          items: [
            { label: "Dashboard", to: "/" },
            { label: "Academies", to: "/academy" },
            { label: "Courses", to: "/courses" },
            { label: "Projects", to: "/projects" },
            { label: "Labs", to: "/labs" },
            { label: "Simulators", to: "/simulators" },
          ],
        },
        {
          title: "Grow",
          items: [
            { label: "Career", to: "/career" },
            { label: "Certifications", to: "/certifications" },
            { label: "Knowledge Graph", to: "/docs/guides/knowledge-graph-guide" },
          ],
        },
        {
          title: "Develop",
          items: [
            { label: "Architecture", to: "/docs/architecture" },
            { label: "Development Guide", to: "/docs/development" },
            { label: "API Reference", to: "/docs/reference/api-reference" },
          ],
        },
        {
          title: "Community",
          items: [{ label: "GitHub", href: "https://github.com/apexdataro-Fin/AEP" }],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ARES EDU PLATFORM. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "yaml",
        "json",
        "docker",
        "python",
        "go",
        "rust",
        "hcl",

        "protobuf",
      ],
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },

    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;
