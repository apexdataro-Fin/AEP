import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import simStyles from "./simulators.module.css";

const simulators = [
  { icon: "💻", name: "Linux Terminal", desc: "Practice shell commands, permissions, and scripting in a safe terminal.", status: "Ready" },
  { icon: "☁️", name: "Azure Portal", desc: "Navigate Azure services, deploy resources, and manage subscriptions.", status: "Ready" },
  { icon: "🛠", name: "Terraform", desc: "Write and apply infrastructure-as-code configurations.", status: "Ready" },
  { icon: "🐳", name: "Docker", desc: "Build, run, and manage containers and images.", status: "Ready" },
  { icon: "☸️", name: "Kubernetes", desc: "Deploy and manage pods, services, and deployments.", status: "Ready" },
  { icon: "🌐", name: "Networking", desc: "Troubleshoot CIDR, DNS, load balancing, and routing.", status: "Ready" },
  { icon: "🏗", name: "Architecture Builder", desc: "Design cloud architectures with drag-and-drop components.", status: "Beta" },
  { icon: "🚨", name: "Incident Simulator", desc: "Respond to production incidents and lead war rooms.", status: "Beta" },
  { icon: "🤖", name: "AI Playground", desc: "Experiment with prompts, embeddings, and AI workflows.", status: "Beta" },
];

export default function SimulatorsPage(): ReactNode {
  return (
    <Layout title="Simulators" description="Launch interactive cloud engineering simulators.">
      <main className={simStyles.page}>
        <div className="container">
          <header className={simStyles.header}>
            <span className={simStyles.badge}>Simulators</span>
            <Heading as="h1" className={simStyles.title}>
              Interactive Labs
            </Heading>
            <p className={simStyles.subtitle}>
              Learn by doing in safe, browser-based environments.
            </p>
          </header>

          <div className={simStyles.grid}>
            {simulators.map((sim) => (
              <div key={sim.name} className={simStyles.card}>
                <div className={simStyles.icon}>{sim.icon}</div>
                <Heading as="h3" className={simStyles.cardTitle}>
                  {sim.name}
                </Heading>
                <p className={simStyles.cardDesc}>{sim.desc}</p>
                <div className={simStyles.cardFooter}>
                  <span className={simStyles.status}>{sim.status}</span>
                  <Link className={styles.linkButton} to="#">
                    Launch →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
