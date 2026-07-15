/**
 * ARES EDU PLATFORM — Smart Search
 * Search overlay with filters for domains, content types, difficulties.
 * Uses Docusaurus local search underneath with enhanced filtering UI.
 */
import React, { useState, useCallback, useRef, useEffect } from "react";
import type { SearchFilters, SearchResult, EducationDomain, ContentCategory, Difficulty } from "@site/src/types/platform";

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchHistory?: string[];
  onSearch?: (query: string) => void;
}

const domains: EducationDomain[] = [
  "cloud-engineering", "cybersecurity", "software-engineering", "ai-engineering",
  "data-engineering", "platform-engineering", "networking", "linux", "python",
];

const contentTypes: ContentCategory[] = [
  "book", "course", "learning-path", "bootcamp", "documentation",
  "interactive-lab", "certification", "career-track", "knowledge-base",
];

const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced", "expert", "master"];

export default function SmartSearch({ isOpen, onClose, searchHistory = [], onSearch }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<{ domains: Set<string>; types: Set<string>; diffs: Set<string> }>({
    domains: new Set(), types: new Set(), diffs: new Set(),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); isOpen ? onClose() : onSearch?.(""); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, onSearch]);

  const toggleFilter = (set: Set<string>, value: string) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      onClose();
    }
  }, [query, onSearch, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.5)", display: "flex",
        alignItems: "flex-start", justifyContent: "center",
        paddingTop: "10vh",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div style={{
        background: "var(--aep-surface)", borderRadius: "var(--aep-radius-xl)",
        boxShadow: "var(--aep-shadow-xl)", width: "100%", maxWidth: 640,
        maxHeight: "80vh", overflow: "auto",
      }}>
        {/* Search Input */}
        <form onSubmit={handleSubmit} style={{ padding: "var(--aep-space-lg)", borderBottom: "1px solid var(--aep-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.25rem" }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all books, courses, labs, projects..."
              style={{
                flex: 1, border: "none", outline: "none", fontSize: "1.125rem",
                background: "transparent", color: "var(--aep-text-primary)",
              }}
              aria-label="Search query"
            />
            <button onClick={onClose} className="aep-btn aep-btn--ghost aep-btn--icon" type="button" aria-label="Close search">
              ✕
            </button>
          </div>
        </form>

        {/* Filters */}
        <div style={{ padding: "var(--aep-space)", borderBottom: "1px solid var(--aep-border)" }}>
          <div className="aep-text-xs aep-text-muted" style={{ marginBottom: "0.5rem" }}>Filter by:</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="aep-text-xs" style={{ fontWeight: 600 }}>Domain:</span>
            {domains.slice(0, 6).map((d) => (
              <button key={d} onClick={() => setFilters((f) => ({ ...f, domains: toggleFilter(f.domains, d) }))}
                className={`aep-tag`}
                style={{ cursor: "pointer", background: filters.domains.has(d) ? "var(--aep-primary-bg)" : undefined, borderColor: filters.domains.has(d) ? "var(--aep-primary)" : undefined }}
              >
                {d.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Search History */}
        {query === "" && searchHistory.length > 0 && (
          <div style={{ padding: "var(--aep-space)" }}>
            <div className="aep-text-xs aep-text-muted" style={{ marginBottom: "0.25rem" }}>Recent searches</div>
            {searchHistory.slice(0, 5).map((h, i) => (
              <button key={i} onClick={() => { setQuery(h); onSearch?.(h); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "0.375rem var(--aep-space)", background: "transparent", border: "none", cursor: "pointer", color: "var(--aep-text-secondary)", fontSize: "0.875rem", borderRadius: "var(--aep-radius-sm)" }}>
                🕐 {h}
              </button>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div style={{ padding: "var(--aep-space)", borderTop: "1px solid var(--aep-border)" }}>
          <div className="aep-text-xs aep-text-muted" style={{ marginBottom: "0.5rem" }}>Quick search:</div>
          <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
            {["books", "courses", "projects", "labs", "certifications", "glossary"].map((t) => (
              <button key={t} onClick={() => { setQuery(t); onSearch?.(t); }} className="aep-btn aep-btn--secondary aep-btn--sm">{t}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
