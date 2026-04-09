import fs from "fs";
import path from "path";

const SITE_URL = "https://devopself.com";
const today = new Date().toISOString().split("T")[0];

// Collect all HTML files from out/ directory
function getAllPages(dir, base = "") {
  const pages = [];
  if (!fs.existsSync(dir)) return pages;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Check if directory has index.html
      const indexPath = path.join(fullPath, "index.html");
      if (fs.existsSync(indexPath)) {
        const urlPath = path.join(base, item);
        pages.push(urlPath);
      }
      pages.push(...getAllPages(fullPath, path.join(base, item)));
    }
  }
  return pages;
}

const outDir = path.join(process.cwd(), "out");
const pages = getAllPages(outDir);

// Priority mapping
function getPriority(page) {
  if (page === "") return "1.0";
  if (page.startsWith("tools/") && page.split("/").length > 1) return "0.8";
  if (page.startsWith("blog/") && page.split("/").length > 1) return "0.8";
  if (page === "tools" || page === "blog" || page === "categories") return "0.9";
  return "0.6";
}

function getChangefreq(page) {
  if (page.startsWith("blog/")) return "weekly";
  if (page.startsWith("tools/")) return "monthly";
  return "weekly";
}

// Generate XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

for (const page of pages) {
  xml += `  <url>
    <loc>${SITE_URL}/${page}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${getChangefreq(page)}</changefreq>
    <priority>${getPriority(page)}</priority>
  </url>
`;
}

xml += `</urlset>`;

fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
console.log(`Sitemap generated: ${pages.length + 1} URLs`);
