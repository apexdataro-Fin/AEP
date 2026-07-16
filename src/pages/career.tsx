import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import careerStyles from "./career.module.css";

const tickets = [
  { id: "T-284", title: "Investigate API gateway latency", priority: "High", status: "In Progress" },
  { id: "T-285", title: "Rotate expired TLS certificate", priority: "Critical", status: "Open" },
  { id: "T-283", title: "Review Terraform module PR", priority: "Medium", status: "Open" },
];

const incidents = [
  { id: "INC-042", title: "DDoS attack on public API", severity: "SEV0", status: "Resolved" },
  { id: "INC-043", title: "AKS node pool OOM", severity: "SEV2", status: "Mitigated" },
];

const meetings = [
  { title: "Daily Standup", time: "09:00 AM" },
  { title: "Architecture Review", time: "02:00 PM" },
  { title: "Sprint Planning", time: "Tomorrow 10:00 AM" },
];

export default function CareerPage(): ReactNode {
  return (
    <Layout title="Career" description="Your CloudNova engineering career.">
      <main className={careerStyles.page}>
        <div className="container">
          <header className={careerStyles.header}>
            <span className={careerStyles.badge}>CloudNova Technologies</span>
            <Heading as="h1" className={careerStyles.title}>
              Career Mode
            </Heading>
            <p className={careerStyles.subtitle}>
              Work as a Junior Cloud Engineer, handle tickets, respond to incidents, and earn promotions.
            </p>
          </header>

          <div className={careerStyles.profileCard}>
            <div className={careerStyles.avatar}>👤</div>
            <div className={careerStyles.profileInfo}>
              <Heading as="h2" className={careerStyles.role}>
                Junior Cloud Engineer
              </Heading>
              <span className={careerStyles.manager}>Manager: Sarah Chen</span>
              <span className={careerStyles.team}>Platform Team · Sprint 14</span>
            </div>
            <div className={careerStyles.promotion}>
              <span>Promotion Progress</span>
              <div className={careerStyles.progressBar}>
                <div style={{ width: "42%" }} />
              </div>
              <span>42%</span>
            </div>
          </div>

          <div className={careerStyles.grid}>
            <div className={careerStyles.card}>
              <Heading as="h3" className={careerStyles.cardTitle}>
                Active Tickets
              </Heading>
              <ul className={careerStyles.list}>
                {tickets.map((t) => (
                  <li key={t.id} className={careerStyles.listItem}>
                    <div>
                      <span className={careerStyles.itemId}>{t.id}</span>
                      <span className={careerStyles.itemTitle}>{t.title}</span>
                    </div>
                    <div className={careerStyles.itemMeta}>
                      <span className={`${careerStyles.priority} ${careerStyles[t.priority.toLowerCase()]}`}>
                        {t.priority}
                      </span>
                      <span>{t.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link className={styles.linkButton} to="#">
                View Sprint Board →
              </Link>
            </div>

            <div className={careerStyles.card}>
              <Heading as="h3" className={careerStyles.cardTitle}>
                Recent Incidents
              </Heading>
              <ul className={careerStyles.list}>
                {incidents.map((inc) => (
                  <li key={inc.id} className={careerStyles.listItem}>
                    <div>
                      <span className={careerStyles.itemId}>{inc.id}</span>
                      <span className={careerStyles.itemTitle}>{inc.title}</span>
                    </div>
                    <div className={careerStyles.itemMeta}>
                      <span className={`${careerStyles.severity} ${careerStyles[inc.severity.toLowerCase()]}`}>
                        {inc.severity}
                      </span>
                      <span>{inc.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link className={styles.linkButton} to="#">
                Incident History →
              </Link>
            </div>

            <div className={careerStyles.card}>
              <Heading as="h3" className={careerStyles.cardTitle}>
                Upcoming Meetings
              </Heading>
              <ul className={careerStyles.list}>
                {meetings.map((m) => (
                  <li key={m.title} className={careerStyles.listItem}>
                    <div>
                      <span className={careerStyles.itemTitle}>{m.title}</span>
                    </div>
                    <span className={careerStyles.itemMeta}>{m.time}</span>
                  </li>
                ))}
              </ul>
              <Link className={styles.linkButton} to="#">
                Calendar →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
