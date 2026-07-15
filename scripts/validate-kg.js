#!/usr/bin/env node

/**
 * Knowledge Graph Validation Script
 *
 * Validates the knowledge graph:
 * - All referenced node IDs exist
 * - No orphaned edges
 * - Relationship types are valid
 *
 * Usage: node scripts/validate-kg.js
 */

const fs = require("fs");
const path = require("path");

const KG_FILE = path.join(__dirname, "..", "knowledge-graph", "graph.json");

const VALID_RELATIONSHIPS = [
  "prerequisite_of",
  "implemented_by",
  "part_of",
  "related_to",
  "certified_by",
];

function validate() {
  if (!fs.existsSync(KG_FILE)) {
    console.log("No knowledge graph file found. Skipping.");
    return;
  }

  const graph = JSON.parse(fs.readFileSync(KG_FILE, "utf8"));
  const nodeIds = new Set(graph.nodes.map((n) => n.id));
  let errors = 0;

  console.log(`🔍 Validating knowledge graph...`);
  console.log(`   Nodes: ${graph.nodes.length}`);
  console.log(`   Edges: ${graph.edges.length}\n`);

  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from)) {
      console.error(`❌ Edge references unknown node "${edge.from}"`);
      errors++;
    }
    if (!nodeIds.has(edge.to)) {
      console.error(`❌ Edge references unknown node "${edge.to}"`);
      errors++;
    }
    if (!VALID_RELATIONSHIPS.includes(edge.relationship)) {
      console.error(`❌ Invalid relationship type "${edge.relationship}"`);
      errors++;
    }
  }

  // Check for orphaned nodes (no edges)
  const connectedNodes = new Set();
  for (const edge of graph.edges) {
    connectedNodes.add(edge.from);
    connectedNodes.add(edge.to);
  }
  for (const node of graph.nodes) {
    if (!connectedNodes.has(node.id)) {
      console.warn(`⚠️  Orphaned node: "${node.id}" (${node.label})`);
    }
  }

  console.log(`\n📊 Results: ${errors} errors`);
  if (errors > 0) {
    console.log("❌ Validation failed!");
    process.exit(1);
  } else {
    console.log("✅ Validation passed!");
  }
}

validate();
