import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import rehypeSanitize from "rehype-sanitize";

const postsDir = path.join(process.cwd(), "src/content/posts");

export const DEFAULT_AUTHOR = "Emre Ferit Aslantaş";
export const DEFAULT_AUTHOR_ROLE = "DevOps & Platform Engineer";
export const DEFAULT_AUTHOR_GITHUB = "https://github.com/efaslantas";

export interface MarkdownPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  updated: string | null;
  readTime: string;
  featured: boolean;
  tags: string[];
  author: string;
  authorRole: string;
  content: string; // HTML rendered content
}

function mapPost(slug: string, data: Record<string, unknown>, content: string): MarkdownPost {
  return {
    slug,
    title: (data.title as string) || slug,
    excerpt: (data.excerpt as string) || "",
    category: (data.category as string) || "Genel",
    date: (data.date as string) || "2026-01-01",
    updated: (data.updated as string) || null,
    readTime: (data.readTime as string) || "5 dk",
    featured: (data.featured as boolean) || false,
    tags: (data.tags as string[]) || [],
    author: (data.author as string) || DEFAULT_AUTHOR,
    authorRole: (data.authorRole as string) || DEFAULT_AUTHOR_ROLE,
    content,
  };
}

export function getAllMarkdownPosts(): MarkdownPost[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const filePath = path.join(postsDir, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      return mapPost(slug, data, content);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getMarkdownPostBySlug(slug: string): MarkdownPost | null {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  return mapPost(slug, data, content);
}

export async function renderMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: false })
    .process(content);

  // Sanitize HTML output to prevent XSS
  const { unified } = await import("unified");
  const rehypeParse = (await import("rehype-parse")).default;
  const rehypeStringify = (await import("rehype-stringify")).default;

  const sanitized = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(result.toString());

  return sanitized.toString();
}
