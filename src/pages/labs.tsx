import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import { LabSelector } from "../components/shared/InteractiveLab";
import labsStyles from "./labs.module.css";

export default function LabsPage(): ReactNode {
  return (
    <Layout title="Labs" description="Hands-on cloud engineering interactive labs.">
      <main className={labsStyles.page}>
        <div className="container">
          <header className={labsStyles.header}>
            <span className={labsStyles.badge}>Hands-on</span>
            <Heading as="h1" className={labsStyles.title}>
              🧪 مختبرات تفاعلية
            </Heading>
            <p className={labsStyles.subtitle}>
              مختبرات عملية خطوة بخطوة. اختر مختبراً وابدأ التعلم فوراً.
            </p>
          </header>

          <LabSelector />
        </div>
      </main>
    </Layout>
  );
}
