/**
 * ARES EDU PLATFORM — Navigation Bar
 * Global navigation with breadcrumbs, quick nav, search trigger.
 */
import React, { useState, useCallback } from "react";
import Link from "@docusaurus/Link";
import type { BreadcrumbItem, NavigationItem, RecentlyVisitedItem } from "@site/src/types/platform";

interface NavigationBarProps {
  breadcrumbs?: BreadcrumbItem[];
  recentItems?: RecentlyVisitedItem[];
  onSearchOpen?: () => void;
}

const navItems: NavigationItem[] = [
  {
    id: "learn",
    label: "Learn",
    href: "/curriculum",
    icon: "📚",
    children: [
      { id: "books", label: "Books", href: "/books", icon: "📖" },
      { id: "courses", label: "Courses", href: "/courses", icon: "🎓" },
      { id: "paths", label: "Learning Paths", href: "/paths", icon: "🗺️" },
      { id: "bootcamps", label: "Bootcamps", href: "/bootcamps", icon: "🚀" },
    ],
  },
  {
    id: "practice",
    label: "Practice",
    href: "/labs",
    icon: "🧪",
    children: [
      { id: "labs", label: "Labs", href: "/labs", icon: "🧪" },
      { id: "projects", label: "Projects", href: "/projects", icon: "🛠️" },
      { id: "simulators", label: "Simulators", href: "/simulators", icon: "⚡" },
    ],
  },
  {
    id: "grow",
    label: "Grow",
    href: "/career",
    icon: "📈",
    children: [
      { id: "career", label: "Career Tracks", href: "/career", icon: "👔" },
      { id: "certifications", label: "Certifications", href: "/certifications", icon: "📜" },
      { id: "skills", label: "Skill Tree", href: "/skills", icon: "🎯" },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    href: "/reference",
    icon: "📖",
    children: [
      { id: "glossary", label: "Glossary", href: "/glossary", icon: "📕" },
      { id: "technologies", label: "Technologies", href: "/technologies", icon: "💻" },
      { id: "kb", label: "Knowledge Base", href: "/knowledge-base", icon: "🧠" },
    ],
  },
  { id: "docs", label: "Docs", href: "/architecture", icon: "📋" },
];

export default function NavigationBar({
  breadcrumbs,
  recentItems,
  onSearchOpen,
}: NavigationBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMouseEnter = useCallback((id: string) => setOpenDropdown(id), []);
  const handleMouseLeave = useCallback(() => setOpenDropdown(null), []);

  return (
    <nav className="aep-navbar" role="navigation" aria-label="Main navigation">
      <div className="aep-navbar-inner">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="aep-breadcrumbs">
            <ol
              style={{
                display: "flex",
                listStyle: "none",
                padding: 0,
                margin: 0,
                gap: "0.5rem",
                flexWrap: "wrap",
                fontSize: "0.8rem",
              }}
            >
              {breadcrumbs.map((crumb, i) => (
                <li
                  key={crumb.href}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  {i > 0 && <span style={{ color: "var(--aep-text-muted)" }}>/</span>}
                  {crumb.isCurrent ? (
                    <span style={{ color: "var(--aep-text-primary)", fontWeight: 600 }}>
                      {crumb.label}
                    </span>
                  ) : (
                    <Link to={crumb.href} style={{ color: "var(--aep-text-secondary)" }}>
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Main Nav Items */}
        <div className="aep-nav-items" role="menubar">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="aep-nav-item"
              role="none"
              onMouseEnter={() => item.children && handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={item.href}
                className="aep-nav-link"
                role="menuitem"
                aria-haspopup={item.children ? "true" : undefined}
                aria-expanded={item.children ? openDropdown === item.id : undefined}
              >
                <span className="aep-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
              {item.children && openDropdown === item.id && (
                <div className="aep-nav-dropdown" role="menu">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={child.href}
                      className="aep-nav-dropdown-item"
                      role="menuitem"
                    >
                      <span>{child.icon}</span>
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="aep-nav-actions">
          <button
            className="aep-btn aep-btn--ghost aep-btn--icon"
            onClick={onSearchOpen}
            aria-label="Open search"
            title="Search (⌘K)"
          >
            🔍
          </button>
          <Link
            to="/dashboard"
            className="aep-btn aep-btn--ghost aep-btn--icon"
            aria-label="Dashboard"
          >
            📊
          </Link>
        </div>
      </div>

      <style>{`
        .aep-navbar {
          background: var(--aep-surface);
          border-bottom: 1px solid var(--aep-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .aep-navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--aep-space-lg);
          height: var(--aep-navbar-height);
        }
        .aep-nav-items {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .aep-nav-item {
          position: relative;
        }
        .aep-nav-link {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--aep-radius);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--aep-text-secondary);
          text-decoration: none;
          transition: all var(--aep-transition);
        }
        .aep-nav-link:hover {
          background: var(--aep-surface-hover);
          color: var(--aep-text-primary);
        }
        .aep-nav-icon { font-size: 1rem; }
        .aep-nav-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--aep-surface);
          border: 1px solid var(--aep-border);
          border-radius: var(--aep-radius);
          box-shadow: var(--aep-shadow-lg);
          min-width: 200px;
          padding: 0.375rem;
          z-index: 200;
          animation: aepFadeIn 0.15s ease;
        }
        @keyframes aepFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .aep-nav-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--aep-radius-sm);
          font-size: 0.875rem;
          color: var(--aep-text-secondary);
          text-decoration: none;
          transition: background var(--aep-transition);
        }
        .aep-nav-dropdown-item:hover {
          background: var(--aep-surface-hover);
          color: var(--aep-text-primary);
        }
        .aep-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .aep-breadcrumbs {
          display: flex;
          align-items: center;
        }
        @media (max-width: 768px) {
          .aep-nav-items { display: none; }
          .aep-breadcrumbs { display: none; }
        }
      `}</style>
    </nav>
  );
}
