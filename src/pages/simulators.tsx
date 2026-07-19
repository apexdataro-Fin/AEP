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
    <Layout title="المحاكيات" description="محاكيات تفاعلية لهندسة السحابة داخل المتصفح.">
      <main className={simStyles.page}>
        <div className="container" style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" }}>
          <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ display: "inline-block", background: "var(--aep-primary)", color: "#fff", padding: "0.25rem 1rem", borderRadius: "2rem", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1rem" }}>
              محاكيات
            </span>
            <Heading as="h1" style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--aep-text-primary)", marginBottom: "0.5rem" }}>
              🕹️ مختبرات تفاعلية داخل المتصفح
            </Heading>
            <p style={{ fontSize: "1.05rem", color: "var(--aep-text-secondary)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              مارس الأوامر الحقيقية في بيئة آمنة. لا حاجة لتثبيت أي شيء.
            </p>
          </header>

          {/* ===== Active Simulators ===== */}
          <section style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span style={{ width: "10px", height: "10px", background: "#5A8F6E", borderRadius: "50%", display: "inline-block" }} />
              <Heading as="h2" style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--aep-text-primary)", margin: 0 }}>
                🟢 المحاكيات النشطة
              </Heading>
            </div>
            <SimulatorTabs />
          </section>

          {/* ===== Coming Soon ===== */}
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span style={{ width: "10px", height: "10px", background: "var(--aep-warning)", borderRadius: "50%", display: "inline-block" }} />
              <Heading as="h2" style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--aep-text-primary)", margin: 0 }}>
                🔜 قريباً
              </Heading>
            </div>
            <div className={simStyles.grid} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {additionalSimulators.map((sim) => (
                <div key={sim.name} style={{
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  background: "var(--aep-surface-raised)",
                  border: "1px solid var(--aep-border)",
                  opacity: 0.75,
                }}>
                  <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.75rem" }}>{sim.icon}</span>
                  <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", color: "var(--aep-text-primary)" }}>{sim.name}</h3>
                  <p style={{ margin: "0 0 0.75rem", fontSize: "0.85rem", color: "var(--aep-text-secondary)", lineHeight: 1.5 }}>{sim.desc}</p>
                  <span style={{
                    display: "inline-block",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: "rgba(198, 156, 62, 0.1)",
                    color: "var(--aep-warning)"
                  }}>
                    {sim.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div style={{
            textAlign: "center",
            marginTop: "3rem",
            padding: "2rem",
            background: "linear-gradient(135deg, var(--aep-primary)15, var(--aep-surface))",
            borderRadius: "1rem",
            border: "1px solid var(--aep-border)",
          }}>
            <h2 style={{ fontSize: "1.3rem", color: "var(--aep-text-primary)", marginBottom: "0.5rem" }}>
              💡 أفضل طريقة للتعلم هي الممارسة
            </h2>
            <p style={{ color: "var(--aep-text-secondary)", marginBottom: "1.25rem" }}>
              جرّب أوامر Linux و Docker و Kubernetes مباشرة في المتصفح.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
