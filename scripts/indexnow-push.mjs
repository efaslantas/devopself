#!/usr/bin/env node
/**
 * Push URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Usage:
 *   node scripts/indexnow-push.mjs              # push key URLs (homepage + new article + locales)
 *   node scripts/indexnow-push.mjs --all        # push every URL from sitemap.xml
 *   node scripts/indexnow-push.mjs URL1 URL2    # push specific URLs
 *
 * The IndexNow API requires a key file at https://devopself.com/<KEY>.txt
 * containing the key, which lives in public/<KEY>.txt.
 */
import fs from "fs";
import path from "path";

const KEY = "f006bb04217449d682d3b87d5dff4ee6";
const HOST = "devopself.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const args = process.argv.slice(2);

let urls;
if (args.includes("--all")) {
  const sitemap = path.join(process.cwd(), "out", "sitemap.xml");
  if (!fs.existsSync(sitemap)) {
    console.error("sitemap.xml not found — run `npm run build` first");
    process.exit(1);
  }
  const xml = fs.readFileSync(sitemap, "utf-8");
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} else if (args.length > 0) {
  urls = args;
} else {
  // Default: high-priority URLs after AdSense rejection recovery
  urls = [
    `https://${HOST}/`,
    `https://${HOST}/tr/`,
    `https://${HOST}/en/`,
    `https://${HOST}/ru/`,
    `https://${HOST}/tr/about/`,
    `https://${HOST}/tr/contact/`,
    `https://${HOST}/tr/privacy/`,
    `https://${HOST}/tr/terms/`,
    `https://${HOST}/tr/cookies/`,
    `https://${HOST}/tr/disclaimer/`,
    `https://${HOST}/tr/blog/`,
    `https://${HOST}/tr/blog/mac-mini-m4-homelab-ai-lab-deneyimi/`,
    `https://${HOST}/tr/tools/`,
  ];
}

console.log(`Pushing ${urls.length} URL(s) to IndexNow...`);

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
};

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

const text = await res.text();
console.log(`HTTP ${res.status} ${res.statusText}`);
if (text) console.log(text);

// 200 = OK, 202 = accepted but key validation pending,
// 422 = invalid URLs / forbidden, 403 = key file not found at keyLocation
if (res.status === 200 || res.status === 202) {
  console.log(`✓ Pushed ${urls.length} URLs`);
} else {
  console.error(`✗ Failed (status ${res.status})`);
  process.exit(1);
}
