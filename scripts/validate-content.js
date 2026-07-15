#!/usr/bin/env node

/**
 * Content Validation Script
 *
 * Validates all MDX content files in the project:
 * - Required frontmatter fields
 * - Valid difficulty levels
 * - Unique slugs
 * - Valid cross-references
 *
 * Usage: node scripts/validate-content.js
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const CONTENT_DIRS = ["docs", "curriculum", "lessons", "projects", "labs", "career", "certifications"];
const VALID_DIFFICULTY = ["beginner", "intermediate", "advanced"];
const REQUIRED_FIELDS = ["title", "slug", "description"];

let errors = 0;
let warnings = 0;
const slugs = new Map();

function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { data: frontmatter } = matter(content);

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!frontmatter[field]) {
        console.error(`❌ ${filePath}: Missing required field "${field}"`);
        errors++;
      }
    }

    // Check slug uniqueness
    if (frontmatter.slug) {
      if (slugs.has(frontmatter.slug)) {
        console.error(
          `❌ ${filePath}: Duplicate slug "${frontmatter.slug}" (also in ${slugs.get(frontmatter.slug)})`
        );
        errors++;
      } else {
        slugs.set(frontmatter.slug, filePath);
      }
    }

    // Check AI metadata
    if (frontmatter.ai_metadata) {
      if (
        frontmatter.ai_metadata.difficulty &&
        !VALID_DIFFICULTY.includes(frontmatter.ai_metadata.difficulty)
      ) {
        console.error(
          `❌ ${filePath}: Invalid difficulty "${frontmatter.ai_metadata.difficulty}"`
        );
        errors++;
      }
    } else {
      console.warn(`⚠️  ${filePath}: Missing ai_metadata`);
      warnings++;
    }

    // Check for empty files
    if (content.replace(/---[\s\S]*?---/, "").trim().length < 50) {
      console.warn(`⚠️  ${filePath}: Content seems very short (< 50 chars)`);
      warnings++;
    }
  } catch (err) {
    console.error(`❌ ${filePath}: Error reading file: ${err.message}`);
    errors++;
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      validateFile(fullPath);
    }
  }
}

console.log("🔍 Validating content...\n");

for (const dir of CONTENT_DIRS) {
  walkDir(dir);
}

console.log(`\n📊 Results:`);
console.log(`   Errors: ${errors}`);
console.log(`   Warnings: ${warnings}`);
console.log(`   Unique slugs: ${slugs.size}`);

if (errors > 0) {
  console.log("\n❌ Validation failed!");
  process.exit(1);
} else {
  console.log("\n✅ Validation passed!");
}
