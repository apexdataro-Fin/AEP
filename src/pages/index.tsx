import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.hero__title}>
          {siteConfig.title}
        </Heading>
        <p className={styles.hero__subtitle}>
          {siteConfig.tagline} — An open-source, interactive platform for mastering
          cloud engineering from fundamentals to advanced architecture, DevOps, and
          Site Reliability Engineering.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/architecture">
            Explore the platform →
          </Link>
          <Link
            className="button button--outline button--lg"
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}
            href="https://github.com/apexdataro-Fin/AEP"
          >
            GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function CTASection() {
  return (
    <section
      style={{
        padding: "4rem 0",
        textAlign: "center",
        background: "var(--celos-surface-alt)",
      }}
    >
      <div className="container">
        <Heading as="h2" style={{ marginBottom: "1rem" }}>
          Ready to Start Your Cloud Engineering Journey?
        </Heading>
        <p style={{ color: "var(--celos-text-secondary)", maxWidth: 500, margin: "0 auto 2rem" }}>
          Whether you're just starting out or preparing for advanced certifications,
          the Cloud Engineering Learning OS has a path for you.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link className="button button--primary button--lg" to="/curriculum">
            Start Learning
          </Link>
          <Link className="button button--secondary button--lg" to="/reference/roadmap">
            View Roadmap
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
      title={siteConfig.title}
      description="An open-source, interactive platform for mastering cloud engineering — from fundamentals to advanced cloud architecture, DevOps, and SRE."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CTASection />
      </main>
    </Layout>
  );
}
