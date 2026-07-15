/**
 * ARES EDU PLATFORM — Knowledge Visualization
 * Skill Tree, Knowledge Graph, Career Graph, Dependency Graph, Relationship Explorer.
 * Uses Mermaid for rendering. Interactive and extensible.
 */
import React, { useState } from "react";
import Link from "@docusaurus/Link";
import type { KnowledgeNode, KnowledgeEdge } from "@site/src/types/learning-core";

// ============================================================
// Skill Tree Visualization
// ============================================================

interface SkillTreeNode {
  id: string;
  name: string;
  proficiency: "locked" | "awareness" | "basic" | "intermediate" | "advanced" | "expert";
  children?: SkillTreeNode[];
}

interface SkillTreeProps {
  skills: SkillTreeNode[];
  title?: string;
}

const proficiencyColors: Record<string, string> = {
  locked: "#94a3b8",
  awareness: "#f59e0b",
  basic: "#3b82f6",
  intermediate: "#10b981",
  advanced: "#8b5cf6",
  expert: "#ef4444",
};

export function SkillTree({ skills, title = "Skill Tree" }: SkillTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const renderNode = (node: SkillTreeNode, depth: number = 0) => (
    <div key={node.id} style={{ marginLeft: depth * 24 }}>
      <div
        onClick={() => node.children && toggle(node.id)}
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.375rem 0.5rem", borderRadius: "var(--aep-radius-sm)",
          cursor: node.children ? "pointer" : "default",
          background: "var(--aep-surface-alt)", marginBottom: "0.25rem",
          borderLeft: `3px solid ${proficiencyColors[node.proficiency]}`,
          transition: "background var(--aep-transition)",
        }}
      >
        {node.children && <span style={{ width: 16, textAlign: "center" }}>{expanded.has(node.id) ? "▾" : "▸"}</span>}
        <span style={{ flex: 1, fontWeight: 500, fontSize: "0.875rem" }}>{node.name}</span>
        <span style={{
          fontSize: "0.7rem", padding: "0.125rem 0.5rem", borderRadius: "var(--aep-radius-full)",
          background: `${proficiencyColors[node.proficiency]}20`, color: proficiencyColors[node.proficiency],
          fontWeight: 600, textTransform: "capitalize",
        }}>
          {node.proficiency}
        </span>
      </div>
      {node.children && expanded.has(node.id) && node.children.map((c) => renderNode(c, depth + 1))}
    </div>
  );

  return (
    <div style={{ padding: "var(--aep-space)" }}>
      <h3 style={{ marginBottom: "var(--aep-space)" }}>{title}</h3>
      {skills.map((s) => renderNode(s))}
    </div>
  );
}

// ============================================================
// Dependency Graph (using Mermaid)
// ============================================================

interface DependencyGraphProps {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  title?: string;
  direction?: "TB" | "LR" | "RL" | "BT";
}

export function DependencyGraph({ nodes, edges, title, direction = "TB" }: DependencyGraphProps) {
  const mermaidDef = `${direction === "LR" ? "graph LR" : "graph TB"}
${nodes.map((n, i) => `  ${n.id}["${n.label}"]`).join("\n")}
${edges.map((e) => `  ${e.from} -->|${e.relationship}| ${e.to}`).join("\n")}`;

  return (
    <div className="docusaurus-mermaid-container">
      {title && <h3 style={{ marginBottom: "var(--aep-space)" }}>{title}</h3>}
      <pre className="mermaid">{mermaidDef}</pre>
    </div>
  );
}

// ============================================================
// Relationship Explorer
// ============================================================

interface RelationshipExplorerProps {
  title: string;
  items: Array<{ from: string; relationship: string; to: string; toHref?: string }>;
}

export function RelationshipExplorer({ title, items }: RelationshipExplorerProps) {
  return (
    <div style={{ padding: "var(--aep-space)" }}>
      <h3 style={{ marginBottom: "var(--aep-space-sm)" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
            <span style={{ fontWeight: 600 }}>{item.from}</span>
            <span className="aep-badge aep-badge--info" style={{ fontSize: "0.65rem" }}>{item.relationship}</span>
            {item.toHref ? <Link to={item.toHref} style={{ color: "var(--aep-primary)" }}>{item.to}</Link> : <span>{item.to}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Career Graph
// ============================================================

interface CareerGraphProps {
  roles: Array<{
    id: string;
    title: string;
    level: string;
    progressPercent: number;
    current: boolean;
  }>;
}

export function CareerGraph({ roles }: CareerGraphProps) {
  return (
    <div style={{ padding: "var(--aep-space)" }}>
      <h3 style={{ marginBottom: "var(--aep-space)" }}>Career Progression</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {roles.map((role, i) => (
          <React.Fragment key={role.id}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--aep-space)" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: role.current ? "var(--aep-primary)" : "var(--aep-surface-hover)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: role.current ? "#fff" : "var(--aep-text-muted)",
                fontWeight: 700, fontSize: "0.75rem", flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{role.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--aep-text-muted)" }}>{role.level}</div>
                <div className="aep-progress" style={{ marginTop: "0.25rem", height: 3 }}>
                  <div className="aep-progress-bar" style={{ width: `${role.progressPercent}%` }} />
                </div>
              </div>
            </div>
            {i < roles.length - 1 && (
              <div style={{ width: 2, height: 12, background: "var(--aep-border)", marginLeft: 19 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
