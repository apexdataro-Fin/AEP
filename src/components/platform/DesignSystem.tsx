/**
 * ARES EDU PLATFORM — Design System Components
 * Reusable UI components: Cards, Badges, Progress, Timeline, etc.
 * All domain-agnostic. Used across the entire platform.
 */
import React, { type ReactNode } from "react";
import Link from "@docusaurus/Link";

// ============================================================
// Card Components
// ============================================================

interface CardProps {
  title: string;
  subtitle?: string;
  href?: string;
  variant?:
    | "default"
    | "featured"
    | "book"
    | "course"
    | "project"
    | "lab"
    | "certification"
    | "career"
    | "knowledge"
    | "technology";
  meta?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  href,
  variant = "default",
  meta,
  children,
  footer,
  className = "",
}: CardProps) {
  const content = (
    <div
      className={`aep-card aep-card--${variant} ${href ? "aep-card--interactive" : ""} ${className}`}
    >
      <div className="aep-card-header">
        <h3 className="aep-card-title">{title}</h3>
        {meta && <div className="aep-card-meta">{meta}</div>}
      </div>
      {subtitle && <p className="aep-card-body">{subtitle}</p>}
      {children && <div style={{ marginTop: "var(--aep-space)" }}>{children}</div>}
      {footer && <div className="aep-card-footer">{footer}</div>}
    </div>
  );
  return href ? (
    <Link to={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      {content}
    </Link>
  ) : (
    content
  );
}

// ============================================================
// Badge & Tag
// ============================================================

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
  icon?: string;
}

export function Badge({ label, variant = "primary", icon }: BadgeProps) {
  return (
    <span className={`aep-badge aep-badge--${variant}`}>
      {icon}
      {icon && " "}
      {label}
    </span>
  );
}

export function Tag({ label }: { label: string }) {
  return <span className="aep-tag">{label}</span>;
}

// ============================================================
// Progress Bar
// ============================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "primary" | "success" | "warning" | "danger";
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "var(--aep-font-size-xs)",
            marginBottom: "0.25rem",
          }}
        >
          <span>{pct}%</span>
        </div>
      )}
      <div className={`aep-progress`} style={size === "sm" ? { height: 4 } : undefined}>
        <div
          className={`aep-progress-bar aep-progress-bar--${variant}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// ============================================================
// Streak Display
// ============================================================

interface StreakDisplayProps {
  current: number;
  longest: number;
  atRisk: boolean;
}

export function StreakDisplay({ current, longest, atRisk }: StreakDisplayProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ fontSize: "1.5rem" }}>🔥</span>
      <div>
        <strong>
          {current} day{current !== 1 ? "s" : ""}
        </strong>
        <div className="aep-text-xs aep-text-muted">
          Longest: {longest} | {atRisk ? "⚠️ At risk!" : "✅ Safe"}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// XP & Level Display
// ============================================================

interface XPDisplayProps {
  level: number;
  title: string;
  xp: number;
  xpToNext: number;
}

export function XPDisplay({ level, title, xp, xpToNext }: XPDisplayProps) {
  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}
      >
        <span style={{ fontSize: "1.5rem" }}>⭐</span>
        <div>
          <strong>Level {level}</strong> — {title}
        </div>
      </div>
      <ProgressBar value={xp} max={xp + xpToNext} variant="primary" showLabel={false} size="sm" />
      <div className="aep-text-xs aep-text-muted" style={{ marginTop: "0.25rem" }}>
        {xp} / {xp + xpToNext} XP
      </div>
    </div>
  );
}

// ============================================================
// Timeline
// ============================================================

interface TimelineProps {
  items: Array<{ title: string; description: string; timestamp: string; completed?: boolean }>;
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="aep-timeline">
      {items.map((item, i) => (
        <div
          key={i}
          className={`aep-timeline-item ${item.completed ? "aep-timeline-item--completed" : ""}`}
        >
          <div style={{ fontWeight: 600, fontSize: "var(--aep-font-size-sm)" }}>{item.title}</div>
          <div className="aep-text-sm aep-text-muted">{item.description}</div>
          <div className="aep-text-xs aep-text-muted">{item.timestamp}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Achievement Card
// ============================================================

interface AchievementCardProps {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  rarity: string;
  xpReward: number;
}

export function AchievementCard({
  name,
  description,
  icon,
  earned,
  rarity,
  xpReward,
}: AchievementCardProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--aep-space)",
        padding: "var(--aep-space)",
        background: earned ? "var(--aep-surface-raised)" : "var(--aep-surface-alt)",
        borderRadius: "var(--aep-radius)",
        opacity: earned ? 1 : 0.5,
      }}
    >
      <span style={{ fontSize: "2rem" }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: "var(--aep-font-size-sm)" }}>{name}</div>
        <div className="aep-text-xs aep-text-muted">{description}</div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
          <Badge label={rarity} variant={earned ? "success" : "warning"} />
          <span className="aep-text-xs aep-text-muted">+{xpReward} XP</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Daily Mission Card
// ============================================================

interface DailyMissionCardProps {
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export function DailyMissionCard({
  title,
  description,
  xpReward,
  completed,
}: DailyMissionCardProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--aep-space-sm) var(--aep-space)",
        background: completed ? "rgba(16,185,129,0.08)" : "var(--aep-surface-alt)",
        borderRadius: "var(--aep-radius)",
        border: completed ? "1px solid var(--aep-accent)" : "1px solid transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>{completed ? "✅" : "⬜"}</span>
        <div>
          <div
            style={{
              fontWeight: 500,
              fontSize: "var(--aep-font-size-sm)",
              textDecoration: completed ? "line-through" : "none",
            }}
          >
            {title}
          </div>
          <div className="aep-text-xs aep-text-muted">{description}</div>
        </div>
      </div>
      <Badge label={`+${xpReward} XP`} variant={completed ? "success" : "primary"} />
    </div>
  );
}

// ============================================================
// Section Header
// ============================================================

interface SectionHeaderProps {
  title: string;
  action?: { label: string; href: string };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "var(--aep-space)",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "var(--aep-font-size-xl)", fontWeight: 700 }}>{title}</h2>
      {action && (
        <Link to={action.href} className="aep-btn aep-btn--ghost aep-btn--sm">
          {action.label} →
        </Link>
      )}
    </div>
  );
}
