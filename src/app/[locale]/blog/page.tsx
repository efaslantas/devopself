import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { AdSlot } from "@/components/ad-slot";
import { blogPosts } from "@/lib/data";
import { getAllMarkdownPosts } from "@/lib/markdown";
import { locales } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  // Combine static + markdown posts
  const mdPosts = getAllMarkdownPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    date: p.date,
    readTime: p.readTime,
    featured: p.featured,
  }));

  const allPosts = [...mdPosts, ...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featured = allPosts.filter((p) => p.featured);
  const rest = allPosts.filter((p) => !p.featured);

  return (
    <>
      <section className="border-b border-[#00f0ff]/10">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <h1 className="neon-glow text-4xl font-black">Blog</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            DevOps, AI, platform engineering ve daha fazlası hakkında derinlemesine yazılar.
          </p>
          <p className="mt-2 text-sm text-[#00f0ff]/50 font-mono">
            {allPosts.length} makale yayında
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-[#00f0ff]" style={{ textShadow: "0 0 15px #00f0ff40" }}>Öne Çıkan Yazılar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-[#00f0ff]" style={{ textShadow: "0 0 15px #00f0ff40" }}>Tüm Yazılar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" />
      </div>
    </>
  );
}
