import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";
import coursesStyles from "./courses.module.css";

const modules = [
  {
    num: "01",
    name: "أسس الهندسة",
    slug: "01-foundations",
    emoji: "🧠",
    lessons: 3,
    desc: "العقلية الهندسية، المسار الوظيفي، الكتابة التقنية",
  },
  {
    num: "02",
    name: "Linux",
    slug: "02-linux",
    emoji: "🐧",
    lessons: 5,
    desc: "الأساسيات، المتقدم، bash scripting، الحماية، استكشاف الأخطاء",
  },
  {
    num: "03",
    name: "الشبكات",
    slug: "03-networking",
    emoji: "🌐",
    lessons: 4,
    desc: "الأساسيات، DNS، موازنة الحمل، الجدران النارية",
  },
  {
    num: "04",
    name: "الأمان",
    slug: "04-security",
    emoji: "🔒",
    lessons: 4,
    desc: "IAM، مجموعات الأمان، TLS/PKI، عمليات الأمان",
  },
  {
    num: "05",
    name: "Python",
    slug: "05-python",
    emoji: "🐍",
    lessons: 3,
    desc: "أتمتة السحابة، Azure SDK، الاختبارات و CI/CD",
  },
  {
    num: "06",
    name: "أساسيات السحابة",
    slug: "06-cloud-fundamentals",
    emoji: "☁️",
    lessons: 3,
    desc: "مفاهيم السحابة، نماذج الخدمة، استراتيجية متعددة السحابة",
  },
  {
    num: "07",
    name: "Azure الأساسية",
    slug: "07-azure-core",
    emoji: "🟦",
    lessons: 5,
    desc: "الأساسيات، المعمارية، الشبكات، التخزين، الحوكمة",
  },
  {
    num: "08",
    name: "الحاويات",
    slug: "08-containers",
    emoji: "📦",
    lessons: 3,
    desc: "الأساسيات، فحص الأمان، مقارنة منصات التنسيق",
  },
  {
    num: "09",
    name: "Docker",
    slug: "09-docker",
    emoji: "🐳",
    lessons: 4,
    desc: "الإتقان، compose للإنتاج، ممارسات الأمان، CI/CD",
  },
  {
    num: "10",
    name: "Kubernetes",
    slug: "10-kubernetes",
    emoji: "☸️",
    lessons: 6,
    desc: "المعمارية، الشبكات، الأمان، التخزين، Operators، استكشاف الأخطاء",
  },
  {
    num: "11",
    name: "Helm",
    slug: "11-helm",
    emoji: "⛵",
    lessons: 3,
    desc: "الأساسيات، أفضل الممارسات، Helmfile و GitOps",
  },
  {
    num: "12",
    name: "Terraform",
    slug: "12-terraform",
    emoji: "🏗️",
    lessons: 5,
    desc: "الأساسيات، الوحدات، إدارة الحالة، CI/CD، مزود Azure",
  },
  {
    num: "13",
    name: "Git",
    slug: "13-git",
    emoji: "🔀",
    lessons: 3,
    desc: "الأساسيات، المتقدم، Git Hooks والأتمتة",
  },
  {
    num: "14",
    name: "GitHub",
    slug: "14-github",
    emoji: "🐙",
    lessons: 3,
    desc: "سير العمل، Actions المتقدم، الأمان CodeQL",
  },
  {
    num: "15",
    name: "CI/CD",
    slug: "15-cicd",
    emoji: "🔄",
    lessons: 4,
    desc: "خطوط الأنابيب، النشر المتقدم، فحص الأمان، مقاييس DORA",
  },
  {
    num: "16",
    name: "DevOps",
    slug: "16-devops",
    emoji: "♾️",
    lessons: 3,
    desc: "الثقافة، الأدوات، تقاطع SRE و DevOps",
  },
  {
    num: "17",
    name: "DevSecOps",
    slug: "17-devsecops",
    emoji: "🛡️",
    lessons: 4,
    desc: "خط الأمان، أمان الحاويات، إدارة الأسرار، الامتثال",
  },
  {
    num: "18",
    name: "GitOps",
    slug: "18-gitops",
    emoji: "🚀",
    lessons: 3,
    desc: "الأساسيات، Argo CD، Flux CD",
  },
  {
    num: "19",
    name: "هندسة المنصات",
    slug: "19-platform",
    emoji: "⚙️",
    lessons: 3,
    desc: "الهندسة، منصة المطور الداخلية، Backstage",
  },
  {
    num: "20",
    name: "المراقبة",
    slug: "20-monitoring",
    emoji: "📊",
    lessons: 3,
    desc: "الأساسيات، Prometheus المتقدم، Grafana",
  },
  {
    num: "21",
    name: "الملاحظة",
    slug: "21-observability",
    emoji: "🔍",
    lessons: 3,
    desc: "الأساسيات، التتبع الموزع، OpenTelemetry",
  },
  {
    num: "22",
    name: "FinOps",
    slug: "22-finops",
    emoji: "💰",
    lessons: 3,
    desc: "الأساسيات، تحسين تكلفة Azure، اقتصاديات السحابة",
  },
  {
    num: "23",
    name: "الهوية",
    slug: "23-identity",
    emoji: "🪪",
    lessons: 4,
    desc: "الإتقان، Azure AD B2C، Zero Trust، الهوية الموحدة",
  },
  {
    num: "24",
    name: "Azure AI",
    slug: "24-azure-ai",
    emoji: "🤖",
    lessons: 4,
    desc: "الخدمات، Cognitive Services، ML Studio، OpenAI",
  },
  {
    num: "25",
    name: "قواعد المتجهات",
    slug: "25-vector-db",
    emoji: "🧬",
    lessons: 3,
    desc: "الأساسيات، مقارنة المنصات، البحث الهجين",
  },
  {
    num: "26",
    name: "RAG",
    slug: "26-rag",
    emoji: "🧩",
    lessons: 4,
    desc: "المعمارية، الأنماط المتقدمة، التقييم، توسيع الإنتاج",
  },
  {
    num: "27",
    name: "وكلاء AI",
    slug: "27-ai-agents",
    emoji: "🕴️",
    lessons: 4,
    desc: "الأساسيات، الأنظمة المتعددة، مقارنة الأطر، الأمان",
  },
  {
    num: "28",
    name: "MLOps",
    slug: "28-mlops",
    emoji: "📈",
    lessons: 3,
    desc: "الأساسيات، مراقبة النماذج، تتبع التجارب",
  },
  {
    num: "29",
    name: "LLMOps",
    slug: "29-llmops",
    emoji: "💬",
    lessons: 3,
    desc: "الأساسيات، تقييم النماذج، تحسين التكلفة",
  },
  {
    num: "30",
    name: "AI Infra",
    slug: "30-ai-infra",
    emoji: "🖥️",
    lessons: 3,
    desc: "الأساسيات، عناقيد GPU، خدمة الاستدلال",
  },
  {
    num: "31",
    name: "المحفظة",
    slug: "31-portfolio",
    emoji: "💼",
    lessons: 3,
    desc: "بناء المحفظة، GitHub Profile، التدوين التقني",
  },
  {
    num: "32",
    name: "المقابلات",
    slug: "32-interview",
    emoji: "🎤",
    lessons: 4,
    desc: "التحضير، الأسئلة التقنية، System Design، التفاوض",
  },
  {
    num: "33",
    name: "المسار الوظيفي",
    slug: "33-career",
    emoji: "🎯",
    lessons: 4,
    desc: "المسارات، السيرة الذاتية، الشبكات، العمل الحر",
  },
];

function PhaseHeader({
  phase,
  title,
  description,
  color,
}: {
  phase: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        borderRight: `4px solid ${color}`,
        borderRadius: "0 0.75rem 0.75rem 0",
        padding: "1rem 1.25rem",
        marginBottom: "1rem",
        marginTop: "2rem",
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {phase}
      </span>
      <h3
        style={{
          margin: "0.25rem 0 0.25rem",
          fontSize: "1.15rem",
          color: "var(--aep-text-primary)",
        }}
      >
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--aep-text-secondary)" }}>
        {description}
      </p>
    </div>
  );
}

export default function CoursesPage(): ReactNode {
  const phases = [
    {
      range: [0, 7],
      phase: "المرحلة ١ — الأساسيات",
      title: "بناء الأساس",
      description: "من الصفر إلى فهم عميق لأنظمة التشغيل والشبكات والأمان والبرمجة",
      color: "#8B6F4E",
    },
    {
      range: [7, 12],
      phase: "المرحلة ٢ — السحابة",
      title: "الانتقال إلى السحابة",
      description: "من الحاويات إلى Kubernetes ومن البنية التحتية ككود إلى النشر الآلي",
      color: "#4A7A9E",
    },
    {
      range: [12, 19],
      phase: "المرحلة ٣ — DevOps",
      title: "الهندسة الحديثة",
      description: "CI/CD، DevOps، DevSecOps، GitOps، وهندسة المنصات",
      color: "#5A8F6E",
    },
    {
      range: [19, 24],
      phase: "المرحلة ٤ — التشغيل",
      title: "تشغيل الإنتاج",
      description: "المراقبة، الملاحظة، FinOps، الهوية، وخدمات Azure AI",
      color: "#9E7A4A",
    },
    {
      range: [24, 31],
      phase: "المرحلة ٥ — الذكاء الاصطناعي",
      title: "AI & MLOps",
      description: "قواعد المتجهات، RAG، وكلاء AI، MLOps، LLMOps، وبنية AI التحتية",
      color: "#8B5A8B",
    },
    {
      range: [31, 33],
      phase: "المرحلة ٦ — الانطلاق",
      title: "الجاهزية المهنية",
      description: "بناء المحفظة، التحضير للمقابلات، والمسارات الوظيفية",
      color: "#C67A3A",
    },
  ];

  let phaseIdx = 0;
  const modulePhases: number[] = [];
  for (let i = 0; i < modules.length; i++) {
    while (phaseIdx < phases.length - 1 && phases[phaseIdx + 1].range[0] <= i) phaseIdx++;
    modulePhases.push(phaseIdx);
  }

  return (
    <Layout
      title="المسار التعليمي"
      description="المسار الكامل لتعلم هندسة السحابة — 33 وحدة، 119 درساً"
    >
      <main className={coursesStyles.page}>
        <div
          className="container"
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" }}
        >
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                background: "var(--aep-primary)",
                color: "#fff",
                padding: "0.25rem 1rem",
                borderRadius: "2rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              ALP-001 • Cloud Engineering
            </span>
            <Heading
              as="h1"
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--aep-text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              🗺️ المسار التعليمي الكامل
            </Heading>
            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--aep-text-secondary)",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              33 وحدة · 119 درساً · 10 مشاريع · 40 مختبراً · 600+ ساعة تعلم
            </p>
          </header>

          {/* Phase sections with module grids */}
          {phases.map((phase, pi) => (
            <div key={pi}>
              <PhaseHeader
                phase={phase.phase}
                title={phase.title}
                description={phase.description}
                color={phase.color}
              />
              <div
                className={coursesStyles.moduleGrid}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                {modules.map((m, i) => {
                  if (modulePhases[i] !== pi) return null;
                  return (
                    <Link
                      key={m.num}
                      to={`/docs/lessons/${m.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.85rem 1rem",
                        borderRadius: "0.75rem",
                        background: "var(--aep-surface-raised)",
                        border: "1px solid var(--aep-border)",
                        textDecoration: "none",
                        transition: "all 0.2s",
                      }}
                      className={coursesStyles.moduleCardHover}
                    >
                      <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{m.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.15rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: "var(--aep-text-muted)",
                              background: "var(--aep-surface-alt)",
                              padding: "0.1rem 0.4rem",
                              borderRadius: "0.25rem",
                            }}
                          >
                            {m.num}
                          </span>
                          <strong style={{ fontSize: "0.9rem", color: "var(--aep-text-primary)" }}>
                            {m.name}
                          </strong>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.75rem",
                            color: "var(--aep-text-muted)",
                            lineHeight: 1.4,
                          }}
                        >
                          {m.desc}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--aep-text-muted)",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {m.lessons} دروس
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Bottom CTA */}
          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              padding: "2rem",
              background: "linear-gradient(135deg, var(--aep-primary)15, var(--aep-surface))",
              borderRadius: "1rem",
              border: "1px solid var(--aep-border)",
            }}
          >
            <Heading
              as="h2"
              style={{
                fontSize: "1.4rem",
                color: "var(--aep-text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              🚀 هل أنت مستعد للبدء؟
            </Heading>
            <p style={{ color: "var(--aep-text-secondary)", marginBottom: "1.5rem" }}>
              ابدأ من الوحدة الأولى وتقدم خطوة بخطوة حتى تصبح مهندس سحابة محترف.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link className={styles.primaryButton} to="/docs/lessons/01-foundations">
                ابدأ من البداية ←
              </Link>
              <Link className={styles.secondaryButton} to="/academy">
                تصفح الأكاديميات
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
