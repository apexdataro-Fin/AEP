import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import certStyles from "./certifications.module.css";

const certifications = [
  {
    code: "AZ-900",
    name: "Azure Fundamentals",
    level: "Beginner",
    progress: 80,
    color: "#7c5e4a",
    description: "Cloud concepts, Azure architecture, compute, networking, storage, and pricing.",
    topics: ["Cloud Concepts", "Azure Architecture", "Compute", "Networking", "Storage", "Security", "Pricing"],
    exam: "40-60 questions · 60 min · $99 USD",
  },
  {
    code: "AZ-104",
    name: "Azure Administrator",
    level: "Intermediate",
    progress: 35,
    color: "#4a7a9e",
    description: "Manage Azure identities, governance, storage, compute, and virtual networks.",
    topics: ["Identity", "Governance", "Storage", "Compute", "Virtual Networks", "Monitoring", "Backup"],
    exam: "40-60 questions · 120 min · $165 USD",
  },
  {
    code: "AZ-400",
    name: "Azure DevOps Engineer",
    level: "Advanced",
    progress: 10,
    color: "#5a8f6e",
    description: "DevOps practices, CI/CD, infrastructure as code, and monitoring strategies.",
    topics: ["CI/CD", "Infrastructure as Code", "Source Control", "Containers", "Monitoring", "Security"],
    exam: "40-60 questions · 120 min · $165 USD",
  },
  {
    code: "AI-102",
    name: "Azure AI Engineer",
    level: "Advanced",
    progress: 5,
    color: "#b06b6b",
    description: "Design and implement AI solutions using Azure AI services and OpenAI.",
    topics: ["Azure OpenAI", "Computer Vision", "Speech", "Language", "Knowledge Mining", "Responsible AI"],
    exam: "40-60 questions · 120 min · $165 USD",
  },
];

export default function CertificationsPage(): ReactNode {
  return (
    <Layout title="Certifications" description="Track your Azure certification journey.">
      <main className={certStyles.page}>
        <div className="container">
          <header className={certStyles.header}>
            <span className={certStyles.badge}>Certification Journey</span>
            <Heading as="h1" className={certStyles.title}>
              Azure Certifications
            </Heading>
            <p className={certStyles.subtitle}>
              Map your learning to real Microsoft Azure exams and track readiness.
            </p>
          </header>

          <div className={certStyles.grid}>
            {certifications.map((cert) => (
              <div key={cert.code} className={certStyles.card}>
                <div className={certStyles.cardHeader}>
                  <span className={certStyles.code}>{cert.code}</span>
                  <span className={certStyles.level}>{cert.level}</span>
                </div>
                <Heading as="h2" className={certStyles.cardTitle}>
                  {cert.name}
                </Heading>
                <p className={certStyles.cardDesc}>{cert.description}</p>
                <div className={certStyles.topics}>
                  {cert.topics.map((topic) => (
                    <span key={topic} className={certStyles.topic}>
                      {topic}
                    </span>
                  ))}
                </div>
                <div className={certStyles.progressRow}>
                  <div className={certStyles.progressBar} style={{ background: `${cert.color}20` }}>
                    <div style={{ width: `${cert.progress}%`, background: cert.color }} />
                  </div>
                  <span className={certStyles.progressText}>{cert.progress}%</span>
                </div>
                <div className={certStyles.exam}>{cert.exam}</div>
                <Link className={styles.primaryButton} to="/docs/certifications">
                  View Study Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
