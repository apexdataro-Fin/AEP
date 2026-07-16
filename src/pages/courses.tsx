import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import coursesStyles from "./courses.module.css";

const modules = [
  { num: "01", name: "Engineering Foundations", status: "completed", lessons: 6 },
  { num: "02", name: "Linux Mastery", status: "in-progress", lessons: 8 },
  { num: "03", name: "Networking Deep Dive", status: "locked", lessons: 8 },
  { num: "04", name: "Security & IAM", status: "locked", lessons: 7 },
  { num: "05", name: "Python for Cloud", status: "locked", lessons: 6 },
  { num: "06", name: "Cloud Fundamentals", status: "locked", lessons: 8 },
  { num: "07", name: "Azure Core Services", status: "locked", lessons: 10 },
  { num: "08", name: "Container Fundamentals", status: "locked", lessons: 4 },
  { num: "09", name: "Docker in Production", status: "locked", lessons: 4 },
  { num: "10", name: "Kubernetes Mastery", status: "locked", lessons: 10 },
  { num: "11", name: "Helm & Package Management", status: "locked", lessons: 3 },
  { num: "12", name: "Terraform & IaC", status: "locked", lessons: 3 },
  { num: "13", name: "Git Professional", status: "locked", lessons: 5 },
  { num: "14", name: "GitHub & Collaboration", status: "locked", lessons: 4 },
  { num: "15", name: "CI/CD Pipelines", status: "locked", lessons: 5 },
  { num: "16", name: "DevOps Engineering", status: "locked", lessons: 4 },
  { num: "17", name: "DevSecOps", status: "locked", lessons: 4 },
  { num: "18", name: "GitOps & ArgoCD", status: "locked", lessons: 4 },
  { num: "19", name: "Platform Engineering", status: "locked", lessons: 3 },
  { num: "20", name: "Monitoring & Alerting", status: "locked", lessons: 2 },
  { num: "21", name: "Observability", status: "locked", lessons: 1 },
  { num: "22", name: "FinOps & Cost", status: "locked", lessons: 1 },
  { num: "23", name: "Identity & Access", status: "locked", lessons: 1 },
  { num: "24", name: "Azure AI Services", status: "locked", lessons: 1 },
  { num: "25", name: "Vector Databases", status: "locked", lessons: 1 },
  { num: "26", name: "RAG", status: "locked", lessons: 1 },
  { num: "27", name: "AI Agents", status: "locked", lessons: 1 },
  { num: "28", name: "MLOps", status: "locked", lessons: 1 },
  { num: "29", name: "LLMOps", status: "locked", lessons: 1 },
  { num: "30", name: "AI Infrastructure", status: "locked", lessons: 1 },
  { num: "31", name: "Portfolio Engineering", status: "locked", lessons: 1 },
  { num: "32", name: "Interview Preparation", status: "locked", lessons: 1 },
  { num: "33", name: "Career Launch", status: "locked", lessons: 1 },
];

export default function CoursesPage(): ReactNode {
  return (
    <Layout title="Courses" description="Browse the Cloud Engineering learning path.">
      <main className={coursesStyles.page}>
        <div className="container">
          <header className={coursesStyles.header}>
            <span className={coursesStyles.badge}>Learning Path</span>
            <Heading as="h1" className={coursesStyles.title}>
              Cloud Engineering Foundation
            </Heading>
            <p className={coursesStyles.subtitle}>
              33 modules · 121 lessons · 10 projects · 40 labs · 600 hours
            </p>
          </header>

          <div className={coursesStyles.progressSummary}>
            <div className={coursesStyles.summaryCard}>
              <span className={coursesStyles.summaryValue}>2/33</span>
              <span className={coursesStyles.summaryLabel}>Modules Started</span>
            </div>
            <div className={coursesStyles.summaryCard}>
              <span className={coursesStyles.summaryValue}>18/121</span>
              <span className={coursesStyles.summaryLabel}>Lessons Completed</span>
            </div>
            <div className={coursesStyles.summaryCard}>
              <span className={coursesStyles.summaryValue}>14%</span>
              <span className={coursesStyles.summaryLabel}>Path Progress</span>
            </div>
          </div>

          <div className={coursesStyles.moduleList}>
            {modules.map((m) => (
              <div key={m.num} className={`${coursesStyles.moduleCard} ${coursesStyles[m.status]}`}>
                <div className={coursesStyles.moduleNum}>{m.num}</div>
                <div className={coursesStyles.moduleInfo}>
                  <Heading as="h3" className={coursesStyles.moduleName}>
                    {m.name}
                  </Heading>
                  <span className={coursesStyles.moduleMeta}>{m.lessons} lessons</span>
                </div>
                <span className={coursesStyles.moduleStatus}>
                  {m.status === "completed" ? "✓ Completed" : m.status === "in-progress" ? "In Progress" : "Locked"}
                </span>
                <Link className={styles.secondaryButton} to={`/docs/curriculum`}>
                  {m.status === "locked" ? "Preview" : "Continue"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
