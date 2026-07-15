/**
 * ARES EDU PLATFORM — Dashboard
 * Complete learning dashboard: continue learning, progress, streak,
 * achievements, reviews, missions, recommendations.
 */
import React from "react";
import Link from "@docusaurus/Link";
import {
  Card,
  ProgressBar,
  StreakDisplay,
  XPDisplay,
  DailyMissionCard,
  AchievementCard,
  SectionHeader,
} from "./DesignSystem";
import type {
  ContinueLearningItem,
  ActivityItem,
  Achievement,
  DailyMission,
  WeeklyMission,
  ReviewItem,
  RecommendationItem,
  StreakData,
  XPSystem,
  Badge,
} from "@site/src/types/platform";

interface DashboardProps {
  continueLearning: ContinueLearningItem[];
  recentActivity: ActivityItem[];
  achievements: Achievement[];
  progress: {
    totalLessonsCompleted: number;
    totalTimeSpentMinutes: number;
    completionRate: number;
  };
  streak: StreakData;
  xp: XPSystem;
  dailyMissions: DailyMission[];
  weeklyMissions: WeeklyMission[];
  reviews: ReviewItem[];
  recommendations?: RecommendationItem[];
  bookmarks?: ContinueLearningItem[];
}

export default function Dashboard({
  continueLearning = [],
  recentActivity = [],
  achievements = [],
  progress,
  streak,
  xp,
  dailyMissions = [],
  weeklyMissions = [],
  reviews = [],
  recommendations = [],
  bookmarks = [],
}: DashboardProps) {
  return (
    <div
      style={{
        maxWidth: "var(--aep-content-wide)",
        margin: "0 auto",
        padding: "var(--aep-space-xl)",
      }}
    >
      {/* Welcome Header */}
      <div style={{ marginBottom: "var(--aep-space-xl)" }}>
        <h1 style={{ margin: 0, fontSize: "var(--aep-font-size-3xl)", fontWeight: 800 }}>
          Your Dashboard
        </h1>
        <p className="aep-text-muted" style={{ marginTop: "0.25rem" }}>
          Track your learning journey across all domains
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="aep-grid aep-grid--4" style={{ marginBottom: "var(--aep-space-xl)" }}>
        <Card title="Streak" variant="featured">
          <StreakDisplay current={streak.current} longest={streak.longest} atRisk={streak.atRisk} />
        </Card>
        <Card title="XP & Level" variant="featured">
          <XPDisplay
            level={xp.currentLevel}
            title={xp.levelTitle}
            xp={xp.totalXP}
            xpToNext={xp.xpToNextLevel}
          />
        </Card>
        <Card title="Progress">
          <div className="aep-text-2xl" style={{ fontWeight: 800, fontSize: "1.5rem" }}>
            {progress.totalLessonsCompleted}
          </div>
          <div className="aep-text-xs aep-text-muted">lessons completed</div>
          <ProgressBar value={progress.completionRate} variant="success" size="sm" />
        </Card>
        <Card title="Time Spent">
          <div className="aep-text-2xl" style={{ fontWeight: 800, fontSize: "1.5rem" }}>
            {Math.round(progress.totalTimeSpentMinutes / 60)}h
          </div>
          <div className="aep-text-xs aep-text-muted">total learning time</div>
        </Card>
      </div>

      <div className="aep-grid aep-grid--2" style={{ marginBottom: "var(--aep-space-xl)" }}>
        {/* Continue Learning */}
        <div>
          <SectionHeader
            title="Continue Learning"
            action={{ label: "View all", href: "/continue" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--aep-space-sm)" }}>
            {continueLearning.map((item) => (
              <Link
                key={item.contentId}
                to={item.contentId}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    padding: "var(--aep-space)",
                    background: "var(--aep-surface-alt)",
                    borderRadius: "var(--aep-radius)",
                    border: "1px solid var(--aep-border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.title}</span>
                    <span className="aep-badge aep-badge--info">{item.progressPercent}%</span>
                  </div>
                  <ProgressBar
                    value={item.progressPercent}
                    variant="primary"
                    size="sm"
                    showLabel={false}
                  />
                  <div className="aep-text-xs aep-text-muted" style={{ marginTop: "0.25rem" }}>
                    ~{item.estimatedRemainingMinutes} min remaining
                  </div>
                </div>
              </Link>
            ))}
            {continueLearning.length === 0 && (
              <p className="aep-text-muted aep-text-sm">Start learning to see your progress!</p>
            )}
          </div>
        </div>

        {/* Daily & Weekly Missions */}
        <div>
          <SectionHeader title="Today's Missions" />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {dailyMissions.map((m) => (
              <DailyMissionCard key={m.id} {...m} />
            ))}
            {dailyMissions.length === 0 && (
              <p className="aep-text-muted aep-text-sm">New missions tomorrow!</p>
            )}
          </div>
          <div style={{ marginTop: "var(--aep-space-lg)" }}>
            <SectionHeader title="Weekly Goals" />
            {weeklyMissions.map((m) => (
              <div key={m.id} style={{ marginBottom: "0.5rem" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}
                >
                  <span>{m.title}</span>
                  <span>
                    {m.current}/{m.target}
                  </span>
                </div>
                <ProgressBar
                  value={m.current}
                  max={m.target}
                  variant="success"
                  size="sm"
                  showLabel={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <SectionHeader
        title="Achievements"
        action={{ label: "All achievements", href: "/achievements" }}
      />
      <div className="aep-grid aep-grid--3" style={{ marginBottom: "var(--aep-space-xl)" }}>
        {achievements.slice(0, 6).map((a) => (
          <AchievementCard key={a.id} {...a} />
        ))}
      </div>

      {/* Upcoming Reviews */}
      {reviews.length > 0 && (
        <>
          <SectionHeader title="Upcoming Reviews" />
          <div className="aep-grid aep-grid--2" style={{ marginBottom: "var(--aep-space-xl)" }}>
            {reviews.map((r) => (
              <Card
                key={r.contentId}
                title={r.title}
                subtitle={`Due in ${r.dueInDays} day${r.dueInDays !== 1 ? "s" : ""} · ${r.domain}`}
                variant="knowledge"
                href={r.contentId}
                footer={
                  <ProgressBar
                    value={r.retentionEstimate * 100}
                    variant={r.retentionEstimate < 0.5 ? "danger" : "warning"}
                    size="sm"
                    showLabel
                  />
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Recent Activity */}
      <SectionHeader title="Recent Activity" />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {recentActivity.map((a) => (
          <div
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <span>
              {a.type === "lesson_completed"
                ? "✅"
                : a.type === "achievement_earned"
                  ? "🏆"
                  : a.type === "project_completed"
                    ? "🛠️"
                    : "📝"}
            </span>
            <span>{a.title}</span>
            <span className="aep-text-xs aep-text-muted" style={{ marginLeft: "auto" }}>
              {new Date(a.timestamp).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
