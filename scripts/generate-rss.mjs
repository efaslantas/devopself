#!/usr/bin/env node
/**
 * Generate RSS 2.0 + Atom feeds from /content/posts markdown files.
 * Writes to out/feed.xml (RSS) and out/atom.xml (Atom) per locale.
 *
 * Runs as part of `postbuild` — so the feeds exist inside the static export
 * that the FTP deploy pushes to production.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SITE_URL = "https://devopself.com";
const SITE_TITLE = "DevOpSelf";
const SITE_DESC = "DevOps, AI & software ecosystem discovery and comparison platform.";
const DEFAULT_AUTHOR_EMAIL = "emreferitaslantas@gmail.com";
const DEFAULT_AUTHOR_NAME = "Emre Ferit Aslantaş";
const LOCALES = ["tr", "en", "ru"];

const postsDir = path.join(process.cwd(), "src/content/posts");
const outDir = path.join(process.cwd(), "out");

if (!fs.existsSync(postsDir)) {
  console.error("posts dir not found:", postsDir);
  process.exit(1);
}
if (!fs.existsSync(outDir)) {
  console.error("out dir not found — run `next build` first:", outDir);
  process.exit(1);
}

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&"']/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case '"': return "&quot;";
      case "'": return "&apos;";
    }
  });
}

function toRfc822(date) {
  return new Date(date).toUTCString();
}
function toIso(date) {
  return new Date(date).toISOString();
}

const posts = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".md"))
  .map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(postsDir, filename), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || "",
      date: data.date || "2026-01-01",
      updated: data.updated || data.date || "2026-01-01",
      category: data.category || "General",
      tags: data.tags || [],
      author: data.author || DEFAULT_AUTHOR_NAME,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const latestBuild = new Date().toUTCString();

for (const locale of LOCALES) {
  // ── RSS 2.0 ──
  const rssItems = posts
    .map((p) => {
      const link = `${SITE_URL}/${locale}/blog/${p.slug}/`;
      const categories = [p.category, ...p.tags]
        .map((c) => `    <category>${escapeXml(c)}</category>`)
        .join("\n");
      return `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <description>${escapeXml(p.excerpt)}</description>
    <author>${DEFAULT_AUTHOR_EMAIL} (${escapeXml(p.author)})</author>
    <pubDate>${toRfc822(p.date)}</pubDate>
${categories}
  </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${SITE_TITLE} — ${locale.toUpperCase()}</title>
  <link>${SITE_URL}/${locale}/</link>
  <description>${escapeXml(SITE_DESC)}</description>
  <language>${locale}</language>
  <lastBuildDate>${latestBuild}</lastBuildDate>
  <atom:link href="${SITE_URL}/${locale}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems}
</channel>
</rss>
`;

  // ── Atom ──
  const atomEntries = posts
    .map((p) => {
      const link = `${SITE_URL}/${locale}/blog/${p.slug}/`;
      return `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${link}" />
    <id>${link}</id>
    <updated>${toIso(p.updated)}</updated>
    <published>${toIso(p.date)}</published>
    <author><name>${escapeXml(p.author)}</name></author>
    <summary>${escapeXml(p.excerpt)}</summary>
    <category term="${escapeXml(p.category)}" />
  </entry>`;
    })
    .join("\n");

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}">
  <title>${SITE_TITLE} — ${locale.toUpperCase()}</title>
  <link href="${SITE_URL}/${locale}/atom.xml" rel="self" />
  <link href="${SITE_URL}/${locale}/" />
  <id>${SITE_URL}/${locale}/</id>
  <updated>${toIso(new Date())}</updated>
  <subtitle>${escapeXml(SITE_DESC)}</subtitle>
${atomEntries}
</feed>
`;

  const localeOutDir = path.join(outDir, locale);
  if (!fs.existsSync(localeOutDir)) fs.mkdirSync(localeOutDir, { recursive: true });
  fs.writeFileSync(path.join(localeOutDir, "feed.xml"), rss);
  fs.writeFileSync(path.join(localeOutDir, "atom.xml"), atom);
}

// Also write a default / root feed pointing to the Turkish one (primary audience)
const defaultRss = fs.readFileSync(path.join(outDir, "tr", "feed.xml"), "utf-8");
fs.writeFileSync(path.join(outDir, "feed.xml"), defaultRss);

console.log(
  `RSS + Atom feeds generated for ${LOCALES.length} locales (${posts.length} posts each).`
);
