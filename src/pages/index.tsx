import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

const modules = [
  { num: "01", name: "Engineering Foundations", slug: "01-foundations", emoji: "🧠" },
  { num: "02", name: "Linux Mastery", slug: "02-linux", emoji: "🐧" },
  { num: "03", name: "Networking Deep Dive", slug: "03-networking", emoji: "🌐" },
  { num: "04", name: "Security & IAM", slug: "04-security", emoji: "🔒" },
  { num: "05", name: "Python for Cloud", slug: "05-python", emoji: "🐍" },
  { num: "06", name: "Cloud Fundamentals", slug: "06-cloud-fundamentals", emoji: "☁️" },
  { num: "07", name: "Azure Core Services", slug: "07-azure-core", emoji: "🟦" },
  { num: "08", name: "Containers", slug: "08-containers", emoji: "📦" },
  { num: "09", name: "Docker", slug: "09-docker", emoji: "🐳" },
  { num: "10", name: "Kubernetes", slug: "10-kubernetes", emoji: "☸️" },
  { num: "11", name: "Helm", slug: "11-helm", emoji: "⛵" },
  { num: "12", name: "Terraform", slug: "12-terraform", emoji: "🏗️" },
  { num: "13", name: "Git", slug: "13-git", emoji: "🔀" },
  { num: "14", name: "GitHub", slug: "14-github", emoji: "🐙" },
  { num: "15", name: "CI/CD", slug: "15-cicd", emoji: "🔄" },
  { num: "16", name: "DevOps", slug: "16-devops", emoji: "♾️" },
  { num: "17", name: "DevSecOps", slug: "17-devsecops", emoji: "🛡️" },
  { num: "18", name: "GitOps", slug: "18-gitops", emoji: "🚀" },
  { num: "19", name: "Platform Engineering", slug: "19-platform", emoji: "⚙️" },
  { num: "20", name: "Monitoring", slug: "20-monitoring", emoji: "📊" },
  { num: "21", name: "Observability", slug: "21-observability", emoji: "🔍" },
  { num: "22", name: "FinOps", slug: "22-finops", emoji: "💰" },
  { num: "23", name: "Identity", slug: "23-identity", emoji: "🪪" },
  { num: "24", name: "Azure AI", slug: "24-azure-ai", emoji: "🤖" },
  { num: "25", name: "Vector Databases", slug: "25-vector-db", emoji: "🧬" },
  { num: "26", name: "RAG Architecture", slug: "26-rag", emoji: "🧩" },
  { num: "27", name: "AI Agents", slug: "27-ai-agents", emoji: "🕴️" },
  { num: "28", name: "MLOps", slug: "28-mlops", emoji: "📈" },
  { num: "29", name: "LLMOps", slug: "29-llmops", emoji: "💬" },
  { num: "30", name: "AI Infrastructure", slug: "30-ai-infra", emoji: "🖥️" },
  { num: "31", name: "Portfolio Building", slug: "31-portfolio", emoji: "💼" },
  { num: "32", name: "Interview Preparation", slug: "32-interview", emoji: "🎤" },
  { num: "33", name: "Career Paths", slug: "33-career", emoji: "🎯" },
];

const simulators = [
  { icon: "💻", name: "Linux Terminal", path: "/simulators" },
  { icon: "☁️", name: "Azure Portal", path: "/simulators" },
  { icon: "🛠", name: "Terraform", path: "/simulators" },
  { icon: "🐳", name: "Docker", path: "/simulators" },
  { icon: "☸️", name: "Kubernetes", path: "/simulators" },
  { icon: "🌐", name: "Networking", path: "/simulators" },
  { icon: "🏗", name: "Architecture", path: "/simulators" },
  { icon: "🤖", name: "AI Playground", path: "/simulators" },
];

const certs = [
  { code: "AZ-900", name: "Azure Fundamentals", exams: "Exam AZ-900" },
  { code: "AZ-104", name: "Azure Administrator", exams: "Exam AZ-104" },
  { code: "AZ-400", name: "Azure DevOps Expert", exams: "Exam AZ-400" },
  { code: "AI-102", name: "Azure AI Engineer", exams: "Exam AI-102" },
];

function ModuleCard({ m }: { m: (typeof modules)[0] }) {
  return (
    <Link className={styles.moduleCard} to={`/docs/lessons/${m.slug}`}>
      <span className={styles.moduleEmoji}>{m.emoji}</span>
      <span className={styles.moduleNum}>Module {m.num}</span>
      <span className={styles.moduleName}>{m.name}</span>
    </Link>
  );
}

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.heroBadge}>🚀 ALP-001 • أكاديمية هندسة السحابة</span>
        <Heading as="h1" className={styles.heroTitle}>
          منصة <span className={styles.heroHighlight}>آريس</span> التعليمية
        </Heading>
        <p className={styles.heroSubtitle}>
          أول أكاديمية عربية متكاملة لهندسة السحابة — ٣٣ وحدة، ١١٩ درساً، مشاريع حقيقية، ومختبرات
          تفاعلية. كل ما تحتاجه لتصبح مهندس سحابة محترفاً.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>٣٣</span>
            <span className={styles.heroStatLabel}>وحدة تعليمية</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>١١٩</span>
            <span className={styles.heroStatLabel}>درساً تفاعلياً</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>١٠</span>
            <span className={styles.heroStatLabel}>مشاريع حقيقية</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>٤</span>
            <span className={styles.heroStatLabel}>شهادات معتمدة</span>
          </div>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.heroPrimary} to="/docs/lessons">
            ابدأ التعلم الآن ←
          </Link>
          <Link className={styles.heroSecondary} to="/courses">
            تصفح المنهج الكامل
          </Link>
        </div>
      </div>
    </section>
  );
}

function ModuleGrid() {
  return (
    <section className={styles.modulesSection}>
      <div className={styles.sectionHeader}>
        <Heading as="h2">📚 المنهج التعليمي الكامل</Heading>
        <p>
          ٣٣ وحدة من الأساسيات إلى هندسة السحابة الإنتاجية. كل درس يحتوي على شرح، تمارين، سيناريوهات
          عملية، وتقييم.
        </p>
      </div>
      <div className={styles.moduleGrid}>
        {modules.map((m) => (
          <ModuleCard key={m.num} m={m} />
        ))}
      </div>
    </section>
  );
}

function SimulatorSection() {
  return (
    <section className={styles.simSection}>
      <div className={styles.sectionHeader}>
        <Heading as="h2">🧪 المحاكيات التفاعلية</Heading>
        <p>تدرب في بيئات آمنة ومعزولة قبل لمس البنية التحتية الحقيقية.</p>
      </div>
      <div className={styles.simGrid}>
        {simulators.map((s) => (
          <Link key={s.name} className={styles.simCard} to={s.path}>
            <span className={styles.simIcon}>{s.icon}</span>
            <span className={styles.simName}>{s.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CertSection() {
  return (
    <section className={styles.certSection}>
      <div className={styles.sectionHeader}>
        <Heading as="h2">🏆 خارطة الشهادات</Heading>
        <p>كل درس مرتبط بأهداف شهادات Microsoft Azure. تابع جاهزيتك للامتحان.</p>
      </div>
      <div className={styles.certGrid}>
        {certs.map((c) => (
          <Link key={c.code} className={styles.certCard} to="/certifications">
            <span className={styles.certCode}>{c.code}</span>
            <span className={styles.certName}>{c.name}</span>
            <span className={styles.certExam}>{c.exams}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickSection}>
      <div className={styles.sectionHeader}>
        <Heading as="h2">🚀 وصول سريع</Heading>
        <p>كل ما تحتاجه للبدء في رحلة هندسة السحابة</p>
      </div>
      <div className={styles.quickGrid}>
        <Link className={styles.quickCard} to="/docs/lessons">
          <span className={styles.quickIcon}>📖</span>
          <strong>تصفح جميع الدروس</strong>
          <span>١١٩ درساً عبر ٣٣ وحدة</span>
        </Link>
        <Link className={styles.quickCard} to="/projects">
          <span className={styles.quickIcon}>🏗️</span>
          <strong>مشاريع حقيقية</strong>
          <span>ابنِ بيئة سحابية إنتاجية</span>
        </Link>
        <Link className={styles.quickCard} to="/labs">
          <span className={styles.quickIcon}>🧪</span>
          <strong>مختبرات عملية</strong>
          <span>مختبرات موجهة وتحديات</span>
        </Link>
        <Link className={styles.quickCard} to="/career">
          <span className={styles.quickIcon}>💼</span>
          <strong>المسار المهني</strong>
          <span>كلاود نوفا — شركتك الافتراضية</span>
        </Link>
        <Link className={styles.quickCard} to="/certifications">
          <span className={styles.quickIcon}>🎯</span>
          <strong>الشهادات</strong>
          <span>AZ-900, AZ-104, AZ-400, AI-102</span>
        </Link>
        <Link className={styles.quickCard} to="/simulators">
          <span className={styles.quickIcon}>💻</span>
          <strong>المحاكيات</strong>
          <span>لينكس، تيرافورم، دوكر والمزيد</span>
        </Link>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Cloud Engineering Academy"
      description="ARES EDU PLATFORM — ALP-001 Cloud Engineering. The complete learning operating system for cloud engineers."
    >
      <main className={styles.page}>
        <HeroSection />
        <div className="container">
          <QuickLinks />
          <ModuleGrid />
          <CertSection />
          <SimulatorSection />
        </div>
      </main>
    </Layout>
  );
}
