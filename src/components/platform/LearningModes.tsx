/**
 * ARES EDU PLATFORM — Learning Modes
 * Focus Mode, Reading Mode, Study Mode, Distraction Free, Print, Mobile.
 */
import React, { useEffect, type ReactNode } from "react";
import type { LearningMode } from "@site/src/types/platform";

interface LearningModeWrapperProps {
  mode: LearningMode;
  children: ReactNode;
  onModeChange?: (mode: LearningMode) => void;
}

const modeLabels: Record<LearningMode, string> = {
  focus: "🎯 Focus Mode",
  reading: "📖 Reading Mode",
  study: "📚 Study Mode",
  "distraction-free": "🧘 Distraction Free",
  print: "🖨️ Print",
  mobile: "📱 Mobile",
};

export default function LearningModeWrapper({ mode, children, onModeChange }: LearningModeWrapperProps) {
  useEffect(() => {
    const cls = `aep-mode--${mode}`;
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [mode]);

  const cycleMode = () => {
    const modes: LearningMode[] = ["reading", "focus", "distraction-free", "study"];
    const idx = modes.indexOf(mode);
    onModeChange?.(modes[(idx + 1) % modes.length]);
  };

  return (
    <div>
      {/* Learning Mode Bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.375rem var(--aep-space)", background: "var(--aep-surface-alt)",
        borderBottom: "1px solid var(--aep-border)", fontSize: "var(--aep-font-size-xs)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <span style={{ color: "var(--aep-text-muted)" }}>{modeLabels[mode]}</span>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {(["reading", "focus", "distraction-free", "study"] as LearningMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange?.(m)}
              className="aep-btn aep-btn--ghost aep-btn--sm"
              style={{ fontWeight: mode === m ? 700 : 400, color: mode === m ? "var(--aep-primary)" : undefined }}
              aria-pressed={mode === m}
              title={modeLabels[m]}
            >
              {m === "reading" ? "📖" : m === "focus" ? "🎯" : m === "study" ? "📚" : "🧘"}
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
