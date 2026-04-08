import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Newsletter } from "@/components/newsletter";
import { AdSlot } from "@/components/ad-slot";
import { blogPosts } from "@/lib/data";
import { getAllMarkdownPosts, getMarkdownPostBySlug, renderMarkdown } from "@/lib/markdown";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const staticSlugs = blogPosts.map((p) => ({ slug: p.slug }));
  const mdSlugs = getAllMarkdownPosts().map((p) => ({ slug: p.slug }));
  return [...staticSlugs, ...mdSlugs];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mdPost = getMarkdownPostBySlug(slug);
  if (mdPost) return { title: mdPost.title, description: mdPost.excerpt };
  const post = blogPosts.find((p) => p.slug === slug);
  return { title: post?.title || "Blog", description: post?.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Try markdown first
  const mdPost = getMarkdownPostBySlug(slug);
  if (mdPost) {
    const htmlContent = await renderMarkdown(mdPost.content);
    return (
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-[#00f0ff]/70 hover:text-[#00f0ff]">
          <ArrowLeft className="h-4 w-4" /> Tüm Yazılar
        </Link>

        <span className="neon-border mb-4 inline-block rounded-full bg-[#00f0ff]/10 px-3 py-1 text-xs font-semibold text-[#00f0ff]">
          {mdPost.category}
        </span>

        <h1 className="mb-4 text-3xl sm:text-4xl font-black leading-tight text-white">{mdPost.title}</h1>

        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-[#00f0ff]/50" />
            {new Date(mdPost.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-[#00f0ff]/50" />
            {mdPost.readTime}
          </span>
        </div>

        {mdPost.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {mdPost.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-md border border-[#00f0ff]/10 bg-[#00f0ff]/5 px-2 py-0.5 font-mono text-xs text-slate-400">
                <Tag className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mb-8"><AdSlot size="leaderboard" /></div>

        {/* Rendered markdown content */}
        <div
          className="prose prose-invert max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-[#00f0ff]
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-[#00f0ff] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-[#00f0ff] prose-code:bg-[#00f0ff]/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-[#0a0f1a] prose-pre:border prose-pre:border-[#00f0ff]/10 prose-pre:rounded-xl
            prose-li:text-slate-300
            prose-hr:border-[#00f0ff]/10
            prose-blockquote:border-[#00f0ff]/30 prose-blockquote:text-slate-400
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="my-10"><AdSlot size="banner" /></div>

        <div className="mt-12">
          <Newsletter />
        </div>
      </article>
    );
  }

  // Fallback to static blog post
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return <div className="py-40 text-center text-slate-400">Bulunamadı.</div>;

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-[#00f0ff]/70 hover:text-[#00f0ff]">
        <ArrowLeft className="h-4 w-4" /> Tüm Yazılar
      </Link>

      <span className="neon-border mb-4 inline-block rounded-full bg-[#00f0ff]/10 px-3 py-1 text-xs font-semibold text-[#00f0ff]">
        {post.category}
      </span>

      <h1 className="mb-4 text-4xl font-black leading-tight text-white">{post.title}</h1>

      <div className="mb-8 flex items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-[#00f0ff]/50" />
          {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-[#00f0ff]/50" />
          {post.readTime}
        </span>
      </div>

      <div className="holo-card rounded-2xl p-8 text-slate-300">
        <p className="text-lg leading-relaxed">{post.excerpt}</p>
        <hr className="my-6 border-[#00f0ff]/10" />
        <p className="text-slate-400">
          Bu yazı yakında tam haliyle yayınlanacak. Bültenimize abone olarak yayınlandığında haberdar olabilirsiniz.
        </p>
      </div>

      <div className="my-8"><AdSlot size="banner" /></div>

      <div className="mt-12">
        <Newsletter />
      </div>
    </article>
  );
}
