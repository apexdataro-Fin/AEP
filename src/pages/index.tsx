import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lessonsCompleted: number;
  labsCompleted: number;
  projectsCompleted: number;
  studyMinutes: number;
  currentModule: string;
  currentLesson: string;
  lessonProgress: number;
  careerRole: string;
  careerProgress: number;
  dailyGoal: number;
  dailyGoalProgress: number;
}

const defaultStats: UserStats = {
  xp: 2450,
  level: 4,
  streak: 12,
  lessonsCompleted: 18,
  labsCompleted: 7,
  projectsCompleted: 2,
  studyMinutes: 840,
  currentModule: "Module 03 — Linux Mastery",
  currentLesson: "File Permissions & ACLs",
  lessonProgress: 65,
  careerRole: "Junior Cloud Engineer",
  careerProgress: 42,
  dailyGoal: 1,
  dailyGoalProgress: 0,
};

function useUserStats(): UserStats {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ares_stats");
      if (saved) {
        try {
          setStats({ ...defaultStats, ...JSON.parse(saved) });
        } catch {
          setStats(defaultStats);
        }
      }
    }
  }, []);
  return stats;
}

function ProgressRing({ progress, size = 56, stroke = 6 }: { progress: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div className={styles.progressRing} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className={styles.progressRingTrack}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className={styles.progressRingFill}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={styles.progressRingText}>{progress}%</span>
    </div>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
        {sub && <span className={styles.statSub}>{sub}</span>}
      </div>
    </div>
  );
}

function ContinueLearning({ stats }: { stats: UserStats }) {
  return (
    <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
      <div className={styles.cardHeader}>
        <span className={styles.sectionBadge}>Continue Learning</span>
        <span className={styles.eta}>⏱ 25 min remaining</span>
      </div>
      <Heading as="h2" className={styles.cardTitle}>
        {stats.currentModule}
      </Heading>
      <p className={styles.cardLesson}>{stats.currentLesson}</p>
      <div className={styles.progressRow}>
        <ProgressRing progress={stats.lessonProgress} />
        <div className={styles.progressInfo}>
          <span className={styles.progressPercent}>{stats.lessonProgress}% complete</span>
          <span className={styles.progressMeta}>Next: User & Group Management</span>
        </div>
      </div>
      <div className={styles.cardActions}>
        <Link className={styles.primaryButton} to="/docs/curriculum">
          Resume Lesson →
        </Link>
        <Link className={styles.secondaryButton} to="/courses">
          Browse Curriculum
        </Link>
      </div>
    </div>
  );
}

function GamificationPanel({ stats }: { stats: UserStats }) {
  return (
    <div className={styles.bentoCard}>
      <div className={styles.cardHeader}>
        <span className={styles.sectionBadge}>Your Progress</span>
      </div>
      <div className={styles.gamificationGrid}>
        <StatCard icon="⚡" label="Total XP" value={stats.xp.toLocaleString()} sub={`Level ${stats.level}`} />
        <StatCard icon="🔥" label="Day Streak" value={stats.streak.toString()} sub="Keep it up!" />
        <StatCard icon="📚" label="Lessons" value={stats.lessonsCompleted.toString()} sub="completed" />
        <StatCard icon="🧪" label="Labs" value={stats.labsCompleted.toString()} sub="completed" />
        <StatCard icon="🏗️" label="Projects" value={stats.projectsCompleted.toString()} sub="delivered" />
        <StatCard icon="⏱" label="Study Time" value={`${Math.round(stats.studyMinutes / 60)}h`} sub="total" />
      </div>
    </div>
  );
}

function CareerCard({ stats }: { stats: UserStats }) {
  return (
    <div className={styles.bentoCard}>
      <div className={styles.cardHeader}>
        <span className={styles.sectionBadge}>CloudNova Career</span>
        <span className={styles.statusDot}>● Active Mission</span>
      </div>
      <div className={styles.careerIdentity}>
        <div className={styles.careerAvatar}>👤</div>
        <div>
          <Heading as="h3" className={styles.careerRole}>
            {stats.careerRole}
          </Heading>
          <span className={styles.careerManager}>Manager: Sarah Chen</span>
        </div>
      </div>
      <div className={styles.ticketCard}>
        <span className={styles.ticketId}>TICKET-284</span>
        <p>Investigate high latency on the customer API gateway.</p>
      </div>
      <div className={styles.careerProgressRow}>
        <span>Promotion progress</span>
        <span className={styles.careerPercent}>{stats.careerProgress}%</span>
      </div>
      <div className={styles.academyProgress}>
        <div style={{ width: `${stats.careerProgress}%` }} />
      </div>
      <Link className={styles.linkButton} to="/career">
        Open Sprint Board →
      </Link>
    </div>
  );
}

function DailyGoal({ stats }: { stats: UserStats }) {
  return (
    <div className={styles.bentoCard}>
      <div className={styles.cardHeader}>
        <span className={styles.sectionBadge}>Daily Goal</span>
      </div>
      <div className={styles.dailyGoalVisual}>
        <div className={styles.dailyGoalRing}>
          <span>{stats.dailyGoalProgress}/{stats.dailyGoal}</span>
        </div>
        <div className={styles.dailyGoalText}>
          <strong>Complete 1 lesson</strong>
          <span>You're just getting started today.</span>
        </div>
      </div>
      <Link className={styles.primaryButton} to="/docs/curriculum">
        Start Today's Session
      </Link>
    </div>
  );
}

function CertificationProgress() {
  const certs = [
    { code: "AZ-900", name: "Azure Fundamentals", progress: 80, color: "#7c5e4a" },
    { code: "AZ-104", name: "Azure Administrator", progress: 35, color: "#4a7a9e" },
    { code: "AZ-400", name: "Azure DevOps", progress: 10, color: "#5a8f6e" },
    { code: "AI-102", name: "Azure AI Engineer", progress: 5, color: "#b06b6b" },
  ];
  return (
    <div className={styles.bentoCard}>
      <div className={styles.cardHeader}>
        <span className={styles.sectionBadge}>Certification Journey</span>
      </div>
      <div className={styles.certList}>
        {certs.map((cert) => (
          <div key={cert.code} className={styles.certItem}>
            <div className={styles.certInfo}>
              <span className={styles.certCode}>{cert.code}</span>
              <span className={styles.certName}>{cert.name}</span>
            </div>
            <div className={styles.certProgress} style={{ background: `${cert.color}20` }}>
              <div style={{ width: `${cert.progress}%`, background: cert.color }} />
            </div>
            <span className={styles.certPercent}>{cert.progress}%</span>
          </div>
        ))}
      </div>
      <Link className={styles.linkButton} to="/certifications">
        View Exam Roadmap →
      </Link>
    </div>
  );
}

function SimulatorLaunchpad() {
  const sims = [
    { icon: "💻", name: "Linux Terminal", path: "/simulators" },
    { icon: "☁️", name: "Azure Portal", path: "/simulators" },
    { icon: "🛠", name: "Terraform", path: "/simulators" },
    { icon: "🐳", name: "Docker", path: "/simulators" },
    { icon: "☸️", name: "Kubernetes", path: "/simulators" },
    { icon: "🌐", name: "Networking", path: "/simulators" },
    { icon: "🏗", name: "Architecture", path: "/simulators" },
    { icon: "🤖", name: "AI Playground", path: "/simulators" },
  ];
  return (
    <div className={`${styles.bentoCard} ${styles.bentoWide}`}>
      <div className={styles.cardHeader}>
        <span className={styles.sectionBadge}>Simulator Launchpad</span>
        <span className={styles.eta}>Practice in safe environments</span>
      </div>
      <div className={styles.simGrid}>
        {sims.map((sim) => (
          <Link key={sim.name} className={styles.simButton} to={sim.path}>
            <span className={styles.simIcon}>{sim.icon}</span>
            <span className={styles.simName}>{sim.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function RoadmapPreview() {
  const modules = [
    { num: "01", name: "Engineering Foundations", status: "completed" },
    { num: "02", name: "Linux Mastery", status: "in-progress" },
    { num: "03", name: "Networking Deep Dive", status: "locked" },
    { num: "04", name: "Security & IAM", status: "locked" },
    { num: "05", name: "Python for Cloud", status: "locked" },
    { num: "06", name: "Cloud Fundamentals", status: "locked" },
  ];
  return (
    <div className={`${styles.bentoCard} ${styles.bentoWide}`}>
      <div className={styles.cardHeader}>
        <span className={styles.sectionBadge}>Learning Roadmap</span>
        <Link className={styles.linkButton} to="/courses">
          Full Roadmap →
        </Link>
      </div>
      <div className={styles.roadmapTrack}>
        {modules.map((m) => (
          <div key={m.num} className={`${styles.roadmapNode} ${styles[m.status]}`}>
            <div className={styles.roadmapDot}>{m.status === "completed" ? "✓" : m.num}</div>
            <span className={styles.roadmapName}>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { icon: "✅", text: "Completed 'File Permissions & ACLs'", time: "2h ago" },
    { icon: "🏅", text: "Earned badge: Linux Apprentice", time: "Yesterday" },
    { icon: "🧪", text: "Finished lab: User & Group Management", time: "2 days ago" },
  ];
  return (
    <div className={styles.bentoCard}>
      <div className={styles.cardHeader}>
        <span className={styles.sectionBadge}>Recent Activity</span>
      </div>
      <ul className={styles.activityList}>
        {activities.map((a, i) => (
          <li key={i} className={styles.activityItem}>
            <span className={styles.activityIcon}>{a.icon}</span>
            <div>
              <span className={styles.activityText}>{a.text}</span>
              <span className={styles.activityTime}>{a.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const stats = useUserStats();

  return (
    <Layout
      title="Dashboard"
      description="Your ARES EDU PLATFORM learner dashboard — continue your cloud engineering journey."
    >
      <main className={styles.dashboardPage}>
        <div className="container">
          <header className={styles.dashboardHeader}>
            <div>
              <span className={styles.welcomeBadge}>Welcome back, Engineer</span>
              <Heading as="h1" className={styles.dashboardTitle}>
                Your Cloud Engineering Academy
              </Heading>
              <p className={styles.dashboardSubtitle}>
                Continue where you left off, track your career at CloudNova, and launch simulators.
              </p>
            </div>
            <div className={styles.headerActions}>
              <Link className={styles.secondaryButton} to="/docs/curriculum">
                Browse Curriculum
              </Link>
            </div>
          </header>

          <section className={styles.bentoGrid}>
            <ContinueLearning stats={stats} />
            <GamificationPanel stats={stats} />
            <CareerCard stats={stats} />
            <DailyGoal stats={stats} />
            <CertificationProgress />
            <RecentActivity />
          </section>

          <RoadmapPreview />
          <SimulatorLaunchpad />
        </div>
      </main>
    </Layout>
  );
}
