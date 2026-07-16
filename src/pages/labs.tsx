import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import labsStyles from "./labs.module.css";

const labs = [
  {
    id: "L01",
    name: "Linux File System",
    type: "Guided",
    duration: "30 min",
    difficulty: "Beginner",
  },
  {
    id: "L02",
    name: "User & Group Management",
    type: "Guided",
    duration: "45 min",
    difficulty: "Beginner",
  },
  {
    id: "L03",
    name: "Network Troubleshooting",
    type: "Challenge",
    duration: "60 min",
    difficulty: "Intermediate",
  },
  {
    id: "L04",
    name: "Azure VM Deployment",
    type: "Guided",
    duration: "90 min",
    difficulty: "Intermediate",
  },
  {
    id: "L05",
    name: "Docker Containerization",
    type: "Hands-on",
    duration: "75 min",
    difficulty: "Intermediate",
  },
  {
    id: "L06",
    name: "Kubernetes Deployment",
    type: "Hands-on",
    duration: "120 min",
    difficulty: "Advanced",
  },
  {
    id: "L07",
    name: "Terraform Infrastructure",
    type: "Guided",
    duration: "90 min",
    difficulty: "Intermediate",
  },
  {
    id: "L08",
    name: "CI/CD Pipeline",
    type: "Project",
    duration: "180 min",
    difficulty: "Advanced",
  },
];

export default function LabsPage(): ReactNode {
  return (
    <Layout title="Labs" description="Hands-on cloud engineering labs.">
      <main className={labsStyles.page}>
        <div className="container">
          <header className={labsStyles.header}>
            <span className={labsStyles.badge}>Hands-on</span>
            <Heading as="h1" className={labsStyles.title}>
              Cloud Engineering Labs
            </Heading>
            <p className={labsStyles.subtitle}>
              40 guided, challenge, and production labs to build real skills.
            </p>
          </header>

          <div className={labsStyles.grid}>
            {labs.map((lab) => (
              <div key={lab.id} className={labsStyles.card}>
                <div className={labsStyles.cardHeader}>
                  <span className={labsStyles.id}>{lab.id}</span>
                  <span className={labsStyles.type}>{lab.type}</span>
                </div>
                <Heading as="h3" className={labsStyles.cardTitle}>
                  {lab.name}
                </Heading>
                <div className={labsStyles.meta}>
                  <span>⏱ {lab.duration}</span>
                  <span>•</span>
                  <span>{lab.difficulty}</span>
                </div>
                <Link className={styles.primaryButton} to="/docs/labs">
                  Start Lab
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
