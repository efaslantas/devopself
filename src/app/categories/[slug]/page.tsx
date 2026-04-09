import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { BlogCard } from "@/components/blog-card";
import { AdSlot } from "@/components/ad-slot";
import { Newsletter } from "@/components/newsletter";
import { categories, tools, blogPosts } from "@/lib/data";
import { getAllMarkdownPosts } from "@/lib/markdown";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  return {
    title: cat ? `${cat.name} - Kategori` : "Kategori",
    description: cat?.description,
  };
}

export default async function CategoryDetail({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return <div className="py-40 text-center text-slate-400">Bulunamadı.</div>;

  const catTools = tools.filter((t) => t.category === slug);

  // Merge markdown + static blog posts for this category
  const mdPosts = getAllMarkdownPosts().map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt,
    category: p.category, date: p.date, readTime: p.readTime, featured: p.featured,
  }));
  const allBlog = [...mdPosts, ...blogPosts];
  const catPosts = allBlog.filter((p) =>
    p.category === cat.name || p.category === slug || p.category.toLowerCase().includes(slug.replace("-", " "))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-[#00f0ff]">Ana Sayfa</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/categories" className="hover:text-[#00f0ff]">Kategoriler</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300">{cat.name}</span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="neon-glow text-3xl sm:text-4xl font-black text-white mb-3">{cat.name}</h1>
        <p className="text-lg text-slate-400 max-w-2xl">{cat.description}</p>
        <div className="mt-4 flex gap-3 text-sm">
          <span className="rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-3 py-1 font-mono text-xs text-[#00f0ff]">
            {catTools.length} araç
          </span>
          <span className="rounded-full border border-[#67e8f9]/20 bg-[#67e8f9]/5 px-3 py-1 font-mono text-xs text-[#67e8f9]">
            {catPosts.length} yazı
          </span>
        </div>
      </div>

      <AdSlot size="leaderboard" className="mb-10" />

      {/* Tools */}
      {catTools.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">{cat.name} Araçları</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catTools.map((t) => (<ToolCard key={t.slug} tool={t} />))}
          </div>
        </section>
      )}

      <AdSlot size="banner" className="mb-10" />

      {/* Blog posts */}
      {catPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">{cat.name} Yazıları</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catPosts.map((p) => (<BlogCard key={p.slug} post={p} />))}
          </div>
        </section>
      )}

      {catTools.length === 0 && catPosts.length === 0 && (
        <div className="holo-card rounded-2xl p-8 text-center mb-12">
          <p className="text-slate-400">Bu kategoride henüz içerik bulunmuyor. Yakında eklenecek!</p>
        </div>
      )}

      <Newsletter />
    </div>
  );
}
