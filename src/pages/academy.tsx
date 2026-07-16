import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import academyStyles from "./academy.module.css";

const academies = [
  {
    id: "alp-001",
    title: "Cloud Engineering",
    subtitle: "ALP-001",
    description:
      "From zero to production cloud engineer. Linux, networking, Azure, Docker, Kubernetes, Terraform, DevOps, and AI infrastructure.",
    modules: 33,
    lessons: 121,
    projects: 10,
    labs: 40,
    hours: 600,
    level: "All levels",
    path: "/",
    featured: true,
  },
  {
    id: "alp-002",
    title: "Cybersecurity",
    subtitle: "ALP-002",
    description:
      "Coming soon. Security fundamentals, threat modeling, incident response, and cloud security architecture.",
    modules: 0,
    lessons: 0,
    projects: 0,
    labs: 0,
    hours: 0,
    level: "Coming soon",
    path: "#",
    featured: false,
  },
  {
    id: "alp-003",
    title: "AI Engineering",
    subtitle: "ALP-003",
    description:
      "Coming soon. Machine learning operations, LLM deployment, vector databases, and AI infrastructure.",
    modules: 0,
    lessons: 0,
    projects: 0,
    labs: 0,
    hours: 0,
    level: "Coming soon",
    path: "#",
    featured: false,
  },
];

export default function AcademyPage(): ReactNode {
  return (
    <Layout title="Academies" description="Browse available ARES learning academies.">
      <main className={academyStyles.page}>
        <div className="container">
          <header className={academyStyles.header}>
            <span className={academyStyles.badge}>Academies</span>
            <Heading as="h1" className={academyStyles.title}>
              Choose Your Academy
            </Heading>
            <p className={academyStyles.subtitle}>
              Each academy is a complete learning operating system for a different domain.
            </p>
          </header>

          <div className={academyStyles.grid}>
            {academies.map((a) => (
              <div
                key={a.id}
                className={`${academyStyles.card} ${a.featured ? academyStyles.featured : ""}`}
              >
                <div className={academyStyles.cardHeader}>
                  <span className={academyStyles.id}>{a.id}</span>
                  {a.featured && <span className={academyStyles.activeBadge}>Active</span>}
                </div>
                <Heading as="h2" className={academyStyles.cardTitle}>
                  {a.title}
                </Heading>
                <p className={academyStyles.cardSubtitle}>{a.subtitle}</p>
                <p className={academyStyles.cardDesc}>{a.description}</p>
                <div className={academyStyles.stats}>
                  <span>{a.modules} modules</span>
                  <span>{a.lessons} lessons</span>
                  <span>{a.projects} projects</span>
                  <span>{a.labs} labs</span>
                  <span>{a.hours}h content</span>
                </div>
                <Link className={styles.primaryButton} to={a.path}>
                  {a.featured ? "Enter Academy" : "Notify Me"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
