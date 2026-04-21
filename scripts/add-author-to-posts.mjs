#!/usr/bin/env node
/**
 * Adds `author`, `authorRole`, `updated` fields to frontmatter of every .md
 * post under src/content/posts — idempotent (skips if already present).
 */
import fs from "fs";
import path from "path";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");
const AUTHOR = "Emre Ferit Aslantaş";
const ROLE = "DevOps & Platform Engineer";
const UPDATED = "2026-04-22";

if (!fs.existsSync(POSTS_DIR)) {
  console.error("posts dir not found:", POSTS_DIR);
  process.exit(1);
}

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

let modified = 0;
for (const filename of files) {
  const fullPath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf-8");

  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    console.warn(`skip (no frontmatter): ${filename}`);
    continue;
  }

  let fm = match[1];
  const body = match[2];

  const hasAuthor = /^author:\s/m.test(fm);
  const hasRole = /^authorRole:\s/m.test(fm);
  const hasUpdated = /^updated:\s/m.test(fm);

  if (hasAuthor && hasRole && hasUpdated) continue;

  const additions = [];
  if (!hasAuthor) additions.push(`author: "${AUTHOR}"`);
  if (!hasRole) additions.push(`authorRole: "${ROLE}"`);
  if (!hasUpdated) additions.push(`updated: "${UPDATED}"`);

  fm = `${fm.trimEnd()}\n${additions.join("\n")}`;

  const next = `---\n${fm}\n---\n${body}`;
  fs.writeFileSync(fullPath, next, "utf-8");
  modified++;
  console.log(`✓ ${filename}`);
}

console.log(`\n${modified}/${files.length} files updated.`);
