import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import projectsStyles from "./projects.module.css";

const projects = [
  { id: "P1", name: "Linux Server", status: "completed", desc: "Provision and secure a Linux server." },
  { id: "P2", name: "Secure Server", status: "completed", desc: "Harden the server with SSH, firewalls, and users." },
  { id: "P3", name: "Python Automation", status: "in-progress", desc: "Automate cloud tasks with Python." },
  { id: "P4", name: "Azure Infrastructure", status: "locked", desc: "Deploy a scalable Azure landing zone." },
  { id: "P5", name: "Dockerized Services", status: "locked", desc: "Containerize applications with Docker." },
  { id: "P6", name: "Kubernetes Deployment", status: "locked", desc: "Deploy services on AKS." },
  { id: "P7", name: "GitOps Pipeline", status: "locked", desc: "Implement GitOps with ArgoCD." },
  { id: "P8", name: "Monitoring Stack", status: "locked", desc: "Add observability and alerting." },
  { id: "P9", name: "AI Infrastructure", status: "locked", desc: "Deploy ML inference and vector search." },
  { id: "P10", name: "Production Cloud Platform", status: "locked", desc: "Combine everything into one platform." },
];

export default function ProjectsPage(): ReactNode {
  return (
    <Layout title="Projects" description="Build one connected cloud platform across 10 cumulative projects.">
      <main className={projectsStyles.page}>
        <div className="container">
          <header className={projectsStyles.header}>
            <span className={projectsStyles.badge}>Portfolio</span>
            <Heading as="h1" className={projectsStyles.title}>
              Cloud Platform Portfolio
            </Heading>
            <p className={projectsStyles.subtitle}>
              10 cumulative projects that build one production-grade cloud environment at CloudNova.
            </p>
          </header>

          <div className={projectsStyles.timeline}>
            {projects.map((p, i) => (
              <div key={p.id} className={`${projectsStyles.timelineItem} ${projectsStyles[p.status]}`}>
                <div className={projectsStyles.timelineMarker}>{i + 1}</div>
                <div className={projectsStyles.timelineContent}>
                  <Heading as="h3" className={projectsStyles.projectName}>
                    {p.name}
                  </Heading>
                  <p className={projectsStyles.projectDesc}>{p.desc}</p>
                  <span className={projectsStyles.projectStatus}>
                    {p.status === "completed" ? "✓ Completed" : p.status === "in-progress" ? "In Progress" : "Locked"}
                  </span>
                </div>
                <Link className={styles.secondaryButton} to="/docs/projects">
                  {p.status === "locked" ? "Preview" : "Open"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
