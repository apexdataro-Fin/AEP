import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Cloud Engineering Learning OS",
  tagline: "The Operating System for Your Cloud Engineering Career",
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
          editUrl: "https://github.com/apexdataro-Fin/AEP/edit/main/",
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          routeBasePath: "/",
          path: "docs",
        },
        blog: false,
        pages: {
          path: "src/pages",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-pwa",
      {
        debug: false,
        offlineModeActivationStrategies: [
          "appInstalled",
          "standalone",
          "queryString",
        ],
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
      { name: "keywords", content: "cloud engineering, devops, sre, learning, platform, aws, azure, gcp, kubernetes, terraform" },
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
      title: "Cloud Engineering OS",
      logo: {
        alt: "Cloud Engineering Learning OS",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      hideOnScroll: false,
      items: [
        {
          to: "/curriculum",
          label: "Curriculum",
          position: "left",
          sidebarId: "curriculumSidebar",
        },
        {
          to: "/lessons",
          label: "Lessons",
          position: "left",
          sidebarId: "lessonsSidebar",
        },
        {
          to: "/projects",
          label: "Projects",
          position: "left",
          sidebarId: "projectsSidebar",
        },
        {
          to: "/labs",
          label: "Labs",
          position: "left",
          sidebarId: "labsSidebar",
        },
        {
          to: "/career",
          label: "Career",
          position: "left",
          sidebarId: "careerSidebar",
        },
        {
          to: "/certifications",
          label: "Certifications",
          position: "left",
          sidebarId: "certificationsSidebar",
        },
        {
          href: "https://github.com/apexdataro-Fin/AEP",
          label: "GitHub",
          position: "right",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Learn",
          items: [
            { label: "Curriculum", to: "/curriculum" },
            { label: "Lessons", to: "/lessons" },
            { label: "Projects", to: "/projects" },
            { label: "Labs", to: "/labs" },
          ],
        },
        {
          title: "Grow",
          items: [
            { label: "Career Paths", to: "/career" },
            { label: "Certifications", to: "/certifications" },
            { label: "Knowledge Graph", to: "/guides/knowledge-graph-guide" },
          ],
        },
        {
          title: "Develop",
          items: [
            { label: "Architecture", to: "/architecture" },
            { label: "Development Guide", to: "/development" },
            { label: "API Reference", to: "/reference/api-reference" },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/apexdataro-Fin/AEP",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cloud Engineering Learning OS. Built with Docusaurus.`,
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
