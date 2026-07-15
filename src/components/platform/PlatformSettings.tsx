/**
 * ARES EDU PLATFORM — Settings
 * Theme, language, font size, reading width, animation, accessibility,
 * learning preferences, AI preferences, notification preferences.
 */
import React, { useState } from "react";
import type { UserPreferences, LearningMode, AIPreferences, NotificationPreferences } from "@site/src/types/platform";

interface SettingsProps {
  preferences: UserPreferences;
  onUpdate: (prefs: UserPreferences) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlatformSettings({ preferences, onUpdate, isOpen, onClose }: SettingsProps) {
  if (!isOpen) return null;

  const update = (patch: Partial<UserPreferences>) => onUpdate({ ...preferences, ...patch });

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "var(--aep-surface)", borderRadius: "var(--aep-radius-xl)",
        boxShadow: "var(--aep-shadow-xl)", width: "100%", maxWidth: 560,
        maxHeight: "80vh", overflow: "auto",
      }}>
        <div style={{ padding: "var(--aep-space-lg)", borderBottom: "1px solid var(--aep-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "var(--aep-font-size-xl)" }}>⚙️ Settings</h2>
          <button onClick={onClose} className="aep-btn aep-btn--ghost aep-btn--icon">✕</button>
        </div>

        <div style={{ padding: "var(--aep-space-lg)", display: "flex", flexDirection: "column", gap: "var(--aep-space-lg)" }}>
          {/* Theme */}
          <SettingGroup label="Appearance">
            <SettingRow label="Theme">
              <Select value={preferences.theme} onChange={(v) => update({ theme: v as UserPreferences["theme"] })} options={[
                { value: "system", label: "🌓 System" },
                { value: "light", label: "☀️ Light" },
                { value: "dark", label: "🌙 Dark" },
              ]} />
            </SettingRow>
            <SettingRow label="Font Size">
              <Select value={preferences.fontSize} onChange={(v) => update({ fontSize: v as UserPreferences["fontSize"] })} options={[
                { value: "small", label: "Small" }, { value: "medium", label: "Medium" },
                { value: "large", label: "Large" }, { value: "x-large", label: "X-Large" },
              ]} />
            </SettingRow>
            <SettingRow label="Reading Width">
              <Select value={preferences.readingWidth} onChange={(v) => update({ readingWidth: v as UserPreferences["readingWidth"] })} options={[
                { value: "narrow", label: "Narrow" }, { value: "medium", label: "Medium" },
                { value: "wide", label: "Wide" }, { value: "full", label: "Full" },
              ]} />
            </SettingRow>
            <SettingRow label="Reduce Motion"><Toggle checked={preferences.reduceMotion} onChange={(v) => update({ reduceMotion: v })} /></SettingRow>
            <SettingRow label="High Contrast"><Toggle checked={preferences.highContrast} onChange={(v) => update({ highContrast: v })} /></SettingRow>
            <SettingRow label="Dyslexia Friendly Font"><Toggle checked={preferences.dyslexiaFriendlyFont} onChange={(v) => update({ dyslexiaFriendlyFont: v })} /></SettingRow>
          </SettingGroup>

          {/* Learning */}
          <SettingGroup label="Learning Preferences">
            <SettingRow label="Learning Mode">
              <Select value={preferences.learningMode} onChange={(v) => update({ learningMode: v as "self-paced" | "structured" | "bootcamp" })} options={[
                { value: "self-paced", label: "🚶 Self-Paced" },
                { value: "structured", label: "📋 Structured" },
                { value: "bootcamp", label: "🚀 Bootcamp" },
              ]} />
            </SettingRow>
          </SettingGroup>

          {/* AI */}
          <SettingGroup label="AI Preferences">
            <SettingRow label="AI Features"><Toggle checked={preferences.aiPreferences.enabled} onChange={(v) => update({ aiPreferences: { ...preferences.aiPreferences, enabled: v } })} /></SettingRow>
            <SettingRow label="Auto-Suggest"><Toggle checked={preferences.aiPreferences.autoSuggest} onChange={(v) => update({ aiPreferences: { ...preferences.aiPreferences, autoSuggest: v } })} /></SettingRow>
            <SettingRow label="Difficulty Adaptation"><Toggle checked={preferences.aiPreferences.difficultyAdaptation} onChange={(v) => update({ aiPreferences: { ...preferences.aiPreferences, difficultyAdaptation: v } })} /></SettingRow>
          </SettingGroup>

          {/* Notifications */}
          <SettingGroup label="Notifications">
            <SettingRow label="Review Reminders"><Toggle checked={preferences.notificationPreferences.reviewReminders} onChange={(v) => update({ notificationPreferences: { ...preferences.notificationPreferences, reviewReminders: v } })} /></SettingRow>
            <SettingRow label="Streak Alerts"><Toggle checked={preferences.notificationPreferences.streakAlerts} onChange={(v) => update({ notificationPreferences: { ...preferences.notificationPreferences, streakAlerts: v } })} /></SettingRow>
            <SettingRow label="Achievements"><Toggle checked={preferences.notificationPreferences.achievementAlerts} onChange={(v) => update({ notificationPreferences: { ...preferences.notificationPreferences, achievementAlerts: v } })} /></SettingRow>
            <SettingRow label="Weekly Report"><Toggle checked={preferences.notificationPreferences.weeklyReport} onChange={(v) => update({ notificationPreferences: { ...preferences.notificationPreferences, weeklyReport: v } })} /></SettingRow>
          </SettingGroup>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Settings helpers
// ============================================================

function SettingGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: "0.813rem", color: "var(--aep-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>{children}</div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.25rem 0" }}>
      <span style={{ fontSize: "0.875rem" }}>{label}</span>
      {children}
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{
      padding: "0.375rem 0.75rem", borderRadius: "var(--aep-radius)", border: "1px solid var(--aep-border)",
      background: "var(--aep-surface-alt)", color: "var(--aep-text-primary)", fontSize: "0.875rem",
    }}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 24, borderRadius: 12, border: "none",
        background: checked ? "var(--aep-primary)" : "var(--aep-surface-hover)",
        position: "relative", cursor: "pointer", transition: "background var(--aep-transition)",
      }}
      aria-checked={checked}
      role="switch"
    >
      <span style={{
        position: "absolute", top: 2, left: checked ? 18 : 2,
        width: 20, height: 20, borderRadius: "50%",
        background: "#fff", transition: "left var(--aep-transition)",
      }} />
    </button>
  );
}
