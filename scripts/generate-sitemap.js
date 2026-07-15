#!/usr/bin/env node

/**
 * Sitemap Generation Script
 *
 * Generates an XML sitemap from the Docusaurus build output.
 * Run after `npm run build`.
 *
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require("fs");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "..", "build");
const BASE_URL = "https://apexdataro-fin.github.io/AEP";
const OUTPUT_FILE = path.join(BUILD_DIR, "sitemap.xml");

function getHtmlFiles(dir, baseDir = dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "assets") {
      results = results.concat(getHtmlFiles(fullPath, baseDir));
    } else if (entry.name.endsWith(".html")) {
      const relativePath = path.relative(baseDir, fullPath);
      const url = `${BASE_URL}/${relativePath
        .replace(/\\/g, "/")
        .replace(/index\.html$/, "")
        .replace(/\.html$/, "")}`;
      const stat = fs.statSync(fullPath);
      results.push({ url, lastmod: stat.mtime.toISOString() });
    }
  }

  return results;
}

function generate() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.log("Build directory not found. Run `npm run build` first.");
    process.exit(1);
  }

  const pages = getHtmlFiles(BUILD_DIR);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync(OUTPUT_FILE, xml);
  console.log(`✅ Sitemap generated: ${OUTPUT_FILE}`);
  console.log(`   ${pages.length} pages indexed`);
}

generate();
