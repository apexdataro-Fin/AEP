import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { SimulatorTabs, LinuxTerminalSimulator, DockerPracticeSimulator, KubernetesScenarioSimulator } from "../components/shared/SimulatorEngine";
import simStyles from "./simulators.module.css";

const additionalSimulators = [
  {
    icon: "🌐",
    name: "Networking Lab",
    desc: "تدرب على CIDR، DNS، Subnetting، و troubleshooting الشبكات.",
    status: "قريباً",
  },
  {
    icon: "🏗",
    name: "Architecture Builder",
    desc: "صمم معماريات سحابية بالسحب والإفلات — قريباً.",
    status: "قريباً",
  },
  {
    icon: "🚨",
    name: "Incident Response",
    desc: "استجب لحوادث الإنتاج وقد war rooms افتراضية.",
    status: "قريباً",
  },
];

export default function SimulatorsPage(): ReactNode {
  return (
    <Layout title="Simulators" description="Launch interactive cloud engineering simulators.">
      <main className={simStyles.page}>
        <div className="container">
          <header className={simStyles.header}>
            <span className={simStyles.badge}>Simulators</span>
            <Heading as="h1" className={simStyles.title}>
              🕹️ مختبرات تفاعلية
            </Heading>
            <p className={simStyles.subtitle}>
              تعلم بالممارسة في بيئات آمنة داخل المتصفح. لا حاجة لتثبيت أي شيء.
            </p>
          </header>

          {/* ===== Active Simulators ===== */}
          <section style={{ marginBottom: "3rem" }}>
            <Heading as="h2" style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--celos-text-primary)" }}>
              🟢 المحاكيات النشطة
            </Heading>
            <SimulatorTabs />
          </section>

          {/* ===== Coming Soon ===== */}
          <section>
            <Heading as="h2" style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--celos-text-primary)" }}>
              🔜 قريباً
            </Heading>
            <div className={simStyles.grid}>
              {additionalSimulators.map((sim) => (
                <div key={sim.name} className={simStyles.card} style={{ opacity: 0.7 }}>
                  <div className={simStyles.icon}>{sim.icon}</div>
                  <Heading as="h3" className={simStyles.cardTitle}>
                    {sim.name}
                  </Heading>
                  <p className={simStyles.cardDesc}>{sim.desc}</p>
                  <div className={simStyles.cardFooter}>
                    <span className={simStyles.status} style={{ background: "rgba(198, 156, 62, 0.1)", color: "var(--celos-accent-yellow, #c69c3e)" }}>
                      {sim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
