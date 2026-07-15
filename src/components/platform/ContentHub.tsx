/**
 * ARES EDU PLATFORM — Content Hub
 * Reusable libraries: Books, Courses, Projects, Labs, Knowledge Base,
 * Reference Center, Technology Library, Career Center, Certification Center.
 */
import React from "react";
import Link from "@docusaurus/Link";
import { Card, SectionHeader, Badge, ProgressBar } from "./DesignSystem";
import type { ContentCategory, EducationDomain, Difficulty } from "@site/src/types/platform";

// ============================================================
// Content Hub Layout
// ============================================================

interface ContentHubProps {
  title: string;
  description?: string;
  categories: HubCategory[];
  featured?: HubItem[];
  recent?: HubItem[];
}

interface HubCategory {
  id: string;
  label: string;
  icon: string;
  href: string;
  count: number;
}

interface HubItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  category: ContentCategory;
  domain: EducationDomain;
  difficulty: Difficulty;
  progress?: number;
  rating?: number;
  tags?: string[];
}

export function ContentHub({ title, description, categories, featured, recent }: ContentHubProps) {
  return (
    <div style={{ maxWidth: "var(--aep-content-wide)", margin: "0 auto", padding: "var(--aep-space-xl)" }}>
      <h1 style={{ marginBottom: "0.5rem", fontSize: "var(--aep-font-size-3xl)", fontWeight: 800 }}>{title}</h1>
      {description && <p className="aep-text-muted" style={{ marginBottom: "var(--aep-space-xl)" }}>{description}</p>}

      {/* Category Grid */}
      <div className="aep-grid aep-grid--auto" style={{ marginBottom: "var(--aep-space-xl)" }}>
        {categories.map((cat) => (
          <Link key={cat.id} to={cat.href} style={{ textDecoration: "none" }}>
            <div style={{
              padding: "var(--aep-space-lg)", background: "var(--aep-surface-alt)",
              borderRadius: "var(--aep-radius-lg)", border: "1px solid var(--aep-border)",
              textAlign: "center", transition: "all var(--aep-transition)",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{cat.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "var(--aep-font-size)", color: "var(--aep-text-primary)" }}>{cat.label}</div>
              <div className="aep-text-xs aep-text-muted">{cat.count} items</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured */}
      {featured && featured.length > 0 && (
        <>
          <SectionHeader title="Featured" />
          <div className="aep-grid aep-grid--auto" style={{ marginBottom: "var(--aep-space-xl)" }}>
            {featured.map((item) => <HubCard key={item.id} item={item} featured />)}
          </div>
        </>
      )}

      {/* Recent */}
      {recent && recent.length > 0 && (
        <>
          <SectionHeader title="Recently Added" />
          <div className="aep-grid aep-grid--auto">
            {recent.map((item) => <HubCard key={item.id} item={item} />)}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// Hub Card
// ============================================================

function HubCard({ item, featured = false }: { item: HubItem; featured?: boolean }) {
  const catVariant = item.category === "book" ? "book" : 
    item.category === "course" ? "course" :
    item.category === "project" || item.category === "interactive-lab" ? "project" :
    item.category === "certification" ? "certification" :
    item.category === "career-track" ? "career" : "default";

  return (
    <Card
      title={item.title}
      subtitle={item.subtitle}
      href={item.href}
      variant={featured ? "featured" : catVariant}
      meta={<Badge label={item.difficulty} variant="info" />}
      footer={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <span className="aep-text-xs aep-text-muted">{item.domain?.replace(/-/g, " ")}</span>
          {item.progress !== undefined && <ProgressBar value={item.progress} size="sm" showLabel={false} />}
        </div>
      }
    />
  );
}

// ============================================================
// Specific Library Components
// ============================================================

export function BooksLibrary({ items }: { items: HubItem[] }) {
  return <ContentHub title="Books Library" description="Explore books across all domains" 
    categories={[{ id: "all", label: "All Books", icon: "📚", href: "/books", count: items.length }]}
    featured={items.filter((_, i) => i < 3)} recent={items} />;
}

export function CoursesLibrary({ items }: { items: HubItem[] }) {
  return <ContentHub title="Courses Library" description="Structured courses and learning paths"
    categories={[{ id: "all", label: "All Courses", icon: "🎓", href: "/courses", count: items.length }]}
    featured={items.filter((_, i) => i < 3)} recent={items} />;
}

export function ProjectsLibrary({ items }: { items: HubItem[] }) {
  return <ContentHub title="Projects Library" description="Hands-on projects to build your portfolio"
    categories={[{ id: "all", label: "All Projects", icon: "🛠️", href: "/projects", count: items.length }]}
    featured={items.filter((_, i) => i < 3)} recent={items} />;
}

export function LabsLibrary({ items }: { items: HubItem[] }) {
  return <ContentHub title="Labs Library" description="Interactive labs for hands-on practice"
    categories={[{ id: "all", label: "All Labs", icon: "🧪", href: "/labs", count: items.length }]}
    featured={items.filter((_, i) => i < 3)} recent={items} />;
}

export function KnowledgeBase({ items }: { items: HubItem[] }) {
  return <ContentHub title="Knowledge Base" description="Reference materials, glossaries, and technology overviews"
    categories={[
      { id: "glossary", label: "Glossary", icon: "📕", href: "/glossary", count: 0 },
      { id: "technologies", label: "Technologies", icon: "💻", href: "/technologies", count: 0 },
      { id: "cheatsheets", label: "Cheat Sheets", icon: "📝", href: "/cheat-sheets", count: 0 },
    ]}
    recent={items} />;
}

export function CareerCenter({ items }: { items: HubItem[] }) {
  return <ContentHub title="Career Center" description="Career tracks, interview prep, and certification guides"
    categories={[
      { id: "tracks", label: "Career Tracks", icon: "👔", href: "/career", count: 0 },
      { id: "interviews", label: "Interview Prep", icon: "💬", href: "/career/interviews", count: 0 },
      { id: "certifications", label: "Certifications", icon: "📜", href: "/certifications", count: 0 },
    ]}
    recent={items} />;
}

export function CertificationCenter({ items }: { items: HubItem[] }) {
  return <ContentHub title="Certification Center" description="Prepare for cloud, security, and AI certifications"
    categories={[
      { id: "microsoft", label: "Microsoft", icon: "🔷", href: "/certifications/microsoft", count: 0 },
      { id: "aws", label: "AWS", icon: "🟧", href: "/certifications/aws", count: 0 },
      { id: "gcp", label: "GCP", icon: "🔴", href: "/certifications/gcp", count: 0 },
      { id: "cncf", label: "CNCF", icon: "🟦", href: "/certifications/cncf", count: 0 },
    ]}
    recent={items} />;
}
