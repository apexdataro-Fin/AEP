#!/usr/bin/env node

/**
 * AI Index Generation Script
 *
 * Generates a consolidated JSON index of all content metadata
 * for AI consumption (RAG pipelines, LLM context, etc.).
 *
 * Usage: node scripts/generate-ai-index.js
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_DIRS = ["docs", "curriculum", "lessons", "projects", "labs", "career", "certifications"];
const OUTPUT_FILE = path.join(__dirname, "..", "build", "ai-index.json");

function extractMetadata(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...extractMetadata(fullPath));
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      try {
        const content = fs.readFileSync(fullPath, "utf8");
        const { data: frontmatter, content: body } = matter(content);

        results.push({
          path: fullPath,
          title: frontmatter.title || entry.name,
          slug: frontmatter.slug || "",
          description: frontmatter.description || "",
          keywords: frontmatter.keywords || [],
          ai_metadata: frontmatter.ai_metadata || {},
          content_length: body.length,
        });
      } catch (err) {
        console.error(`Error processing ${fullPath}: ${err.message}`);
      }
    }
  }

  return results;
}

function generate() {
  console.log("🔍 Building AI content index...\n");

  const index = [];
  for (const dir of CONTENT_DIRS) {
    const items = extractMetadata(dir);
    index.push(...items);
    console.log(`   ${dir}/: ${items.length} files`);
  }

  // Sort by slug for consistency
  index.sort((a, b) => a.slug.localeCompare(b.slug));

  const output = {
    version: "1.0.0",
    generated: new Date().toISOString(),
    total_files: index.length,
    files: index,
    categories: [...new Set(index.map((f) => f.ai_metadata.category).filter(Boolean))],
    difficulty_distribution: {
      beginner: index.filter((f) => f.ai_metadata.difficulty === "beginner").length,
      intermediate: index.filter((f) => f.ai_metadata.difficulty === "intermediate").length,
      advanced: index.filter((f) => f.ai_metadata.difficulty === "advanced").length,
    },
  };

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n✅ AI index generated: ${OUTPUT_FILE}`);
  console.log(`   ${index.length} files indexed`);
}

generate();
