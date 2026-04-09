import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen } from "lucide-react";
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
  return { title: cat ? `${cat.name} Yazıları` : "Kategori", description: cat?.description };
}

export default async function CategoryDetail({ params }: Props) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return <div className="py-40 text-center text-slate-400">Bulunamadı.</div>;

  // Blog posts for this category
  const mdPosts = getAllMarkdownPosts().map((p) => ({
    slug: p.slug, title: p.title, excerpt: p.excerpt,
    category: p.category, date: p.date, readTime: p.readTime, featured: p.featured,
  }));
  const allBlog = [...mdPosts, ...blogPosts];
  const catPosts = allBlog.filter((p) =>
    p.category === cat.name || p.category === slug ||
    p.category.toLowerCase().includes(slug.replace("-", " ")) ||
    p.category.toLowerCase().replace(/[^a-z]/g, "").includes(slug.replace("-", ""))
  );

  // Related tool count for info
  const toolCount = tools.filter((t) => t.category === slug).length;

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
        <div className="mt-4 flex gap-3">
          <span className="rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-3 py-1 font-mono text-xs text-[#00f0ff]">
            <BookOpen className="inline h-3 w-3 mr-1" />{catPosts.length} yazı
          </span>
          {toolCount > 0 && (
            <Link href={`/tools`} className="rounded-full border border-[#67e8f9]/20 bg-[#67e8f9]/5 px-3 py-1 font-mono text-xs text-[#67e8f9] hover:bg-[#67e8f9]/10 transition-colors">
              {toolCount} araç →
            </Link>
          )}
        </div>
      </div>

      <AdSlot size="leaderboard" className="mb-10" />

      {/* Blog posts */}
      {catPosts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catPosts.map((p) => (<BlogCard key={p.slug} post={p} />))}
        </div>
      ) : (
        <div className="holo-card rounded-2xl p-8 text-center mb-12">
          <BookOpen className="mx-auto h-10 w-10 text-[#00f0ff]/30 mb-3" />
          <p className="text-slate-400 mb-2">Bu kategoride henüz yazı bulunmuyor.</p>
          <p className="text-xs text-slate-600">Yakında yeni içerikler eklenecek. Bültene abone olarak haberdar olun.</p>
        </div>
      )}

      <AdSlot size="banner" className="mt-10 mb-10" />

      <Newsletter />
    </div>
  );
}
