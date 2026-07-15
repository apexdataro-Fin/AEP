import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>🚀 ALP-001 — Cloud Engineering</span>
          <Heading as="h1" className={styles.heroTitle}>
            The Operating System for<br />
            <span className={styles.heroHighlight}>Your Cloud Engineering Career</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            From zero to production cloud engineer. An interactive, open-source
            learning platform with 33 modules, 10 projects, 40 labs, and a
            simulated career at CloudNova Technologies.
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/curriculum">
              Start Learning Free →
            </Link>
            <Link className="button button--secondary button--lg" to="/reference/roadmap">
              View Full Roadmap
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>33</span>
              <span className={styles.heroStatLabel}>Modules</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>600h</span>
              <span className={styles.heroStatLabel}>Of Content</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>10</span>
              <span className={styles.heroStatLabel}>Projects</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>40</span>
              <span className={styles.heroStatLabel}>Labs</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>4</span>
              <span className={styles.heroStatLabel}>Certifications</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.heroVisual}>
        <pre className={styles.heroDiagram}>
{`┌─────────────────────────────────────┐
│        CloudNova Platform            │
│  ┌─────────┐  ┌─────────┐           │
│  │  Azure   │  │   AKS   │           │
│  │ Landing  │◄─┤ Cluster │           │
│  │  Zone    │  │         │           │
│  └────┬─────┘  └────┬────┘           │
│       │             │                │
│  ┌────▼─────────────▼────┐           │
│  │     Observability      │           │
│  │  Prometheus • Grafana  │           │
│  │  Loki • Tempo • Alert  │           │
│  └────────────────────────┘           │
│         ▲            ▲               │
│  ┌──────┴──┐  ┌──────┴──┐           │
│  │ GitOps   │  │   AI     │           │
│  │ ArgoCD   │  │Inference │           │
│  └─────────┘  └─────────┘           │
└─────────────────────────────────────┘`}
        </pre>
      </div>
    </header>
  );
}

function FeatureGrid() {
  const features = [
    {
      icon: "📚",
      title: "Complete Learning Path",
      description: "33 modules from Linux basics to AI infrastructure. Every lesson includes Active Recall, Feynman explanations, and hands-on exercises.",
    },
    {
      icon: "🏗️",
      title: "10 Connected Projects",
      description: "Build one production cloud platform across 10 cumulative projects — from a single Linux server to a full AI inference platform.",
    },
    {
      icon: "🏢",
      title: "Career Mode at CloudNova",
      description: "Work at a simulated cloud company. Handle tickets, lead incidents, get promoted from Junior to Principal Engineer.",
    },
    {
      icon: "🤖",
      title: "AI-Ready Learning",
      description: "Every lesson integrates AI prompts for tutoring, quizzes, flashcards, code review, and mock interviews.",
    },
    {
      icon: "🎓",
      title: "Certification Aligned",
      description: "AZ-900, AZ-104, AZ-400, AI-102 — every lesson maps to specific certification objectives.",
    },
    {
      icon: "🌙",
      title: "Beautiful Experience",
      description: "Dark mode, RTL support, responsive design, focus mode, and accessibility built in from day one.",
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Everything You Need to Become a Cloud Engineer
        </Heading>
        <p className={styles.sectionSubtitle}>
          Not just tutorials — a complete learning operating system
        </p>
        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningPathPreview() {
  const modules = [
    { num: "01", name: "Engineering Foundations", difficulty: "beginner", hours: "15h" },
    { num: "02", name: "Linux Mastery", difficulty: "beginner", hours: "40h" },
    { num: "06", name: "Cloud Fundamentals (AZ-900)", difficulty: "beginner", hours: "20h" },
    { num: "07", name: "Azure Core Services (AZ-104)", difficulty: "intermediate", hours: "45h" },
    { num: "10", name: "Kubernetes Mastery", difficulty: "advanced", hours: "60h" },
    { num: "12", name: "Terraform & IaC", difficulty: "advanced", hours: "40h" },
    { num: "18", name: "GitOps & ArgoCD", difficulty: "advanced", hours: "20h" },
    { num: "30", name: "AI Infrastructure", difficulty: "expert", hours: "25h" },
  ];

  return (
    <section className={styles.pathSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Your Learning Journey
        </Heading>
        <p className={styles.sectionSubtitle}>
          Beginner to Principal — one connected path
        </p>
        <div className={styles.pathList}>
          {modules.map((m, i) => (
            <div key={i} className={styles.pathItem}>
              <span className={styles.pathNum}>{m.num}</span>
              <div className={styles.pathInfo}>
                <span className={styles.pathName}>{m.name}</span>
                <span className={styles.pathMeta}>
                  <span className={`badge badge--${m.difficulty === 'beginner' ? 'success' : m.difficulty === 'intermediate' ? 'info' : m.difficulty === 'advanced' ? 'warning' : 'danger'}`}>
                    {m.difficulty}
                  </span>
                  <span> · {m.hours}</span>
                </span>
              </div>
            </div>
          ))}
          <div className={styles.pathMore}>
            <span>+ 25 more modules</span>
            <Link to="/curriculum">View full curriculum →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <Heading as="h2" style={{ marginBottom: "1rem", color: "#fff" }}>
          Ready to Start Your Cloud Engineering Journey?
        </Heading>
        <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: 500, margin: "0 auto 2rem" }}>
          Join CloudNova Technologies as a Junior Cloud Engineer. Your first
          server awaits.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="button button--secondary button--lg" to="/curriculum">
            Start Learning Free →
          </Link>
          <Link
            className="button button--outline button--lg"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
            href="https://github.com/apexdataro-Fin/AEP"
          >
            ⭐ Star on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Cloud Engineering Learning OS"
      description="An open-source, interactive platform for mastering cloud engineering — from fundamentals to advanced cloud architecture, DevOps, and SRE."
    >
      <HomepageHeader />
      <main>
        <FeatureGrid />
        <LearningPathPreview />
        <CTASection />
      </main>
    </Layout>
  );
}
