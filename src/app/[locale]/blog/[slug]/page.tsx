import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, Share2, BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import { Newsletter } from "@/components/newsletter";
import { AdSlot } from "@/components/ad-slot";
import { BlogCard } from "@/components/blog-card";
import { blogPosts, getBlogPosts } from "@/lib/data";
import { getAllMarkdownPosts, getMarkdownPostBySlug, renderMarkdown } from "@/lib/markdown";
import { locales, type Locale, getDictionary, dateLocales } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const staticSlugs = blogPosts.map((p) => p.slug);
  const mdSlugs = getAllMarkdownPosts().map((p) => p.slug);
  const allSlugs = [...new Set([...staticSlugs, ...mdSlugs])];
  return locales.flatMap((locale) =>
    allSlugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mdPost = getMarkdownPostBySlug(slug);
  if (mdPost) return { title: mdPost.title, description: mdPost.excerpt };
  const post = blogPosts.find((p) => p.slug === slug);
  return { title: post?.title || "Blog", description: post?.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as Locale);
  const dtLocale = dateLocales[locale as Locale] || "tr-TR";

  // Get all posts for "related" section
  const localizedBlogPosts = getBlogPosts(locale);
  const allMdPosts = getAllMarkdownPosts();
  const allPosts = [
    ...allMdPosts.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, date: p.date, readTime: p.readTime, featured: p.featured })),
    ...localizedBlogPosts,
  ];

  // Try markdown first
  const mdPost = getMarkdownPostBySlug(slug);
  if (mdPost) {
    const htmlContent = await renderMarkdown(mdPost.content);
    const related = allPosts.filter((p) => p.category === mdPost.category && p.slug !== slug).slice(0, 3);

    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href={`/${locale}`} className="hover:text-[#00f0ff]">{dict.common.home}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/${locale}/blog`} className="hover:text-[#00f0ff]">{dict.common.breadcrumbBlog}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-300 truncate max-w-[200px]">{mdPost.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <article className="lg:col-span-2">
            <span className="neon-border mb-4 inline-block rounded-full bg-[#00f0ff]/10 px-3 py-1 text-xs font-semibold text-[#00f0ff]">
              {mdPost.category}
            </span>

            <h1 className="mb-4 text-3xl sm:text-4xl font-black leading-tight text-white">{mdPost.title}</h1>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#00f0ff]/50" />
                {new Date(mdPost.date).toLocaleDateString(dtLocale, { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#00f0ff]/50" />
                {mdPost.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-[#00f0ff]/50" />
                {dict.blog.article}
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

            <AdSlot size="leaderboard" className="mb-8" />

            {/* Article body */}
            <div
              className="prose prose-invert max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[#00f0ff]/10
                prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-[#00f0ff] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-code:text-[#00f0ff] prose-code:bg-[#00f0ff]/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#0a0f1a] prose-pre:border prose-pre:border-[#00f0ff]/10 prose-pre:rounded-xl prose-pre:shadow-lg
                prose-li:text-slate-300 prose-li:marker:text-[#00f0ff]/40
                prose-ul:my-4 prose-ol:my-4
                prose-hr:border-[#00f0ff]/10
                prose-blockquote:border-l-[#00f0ff]/30 prose-blockquote:bg-[#00f0ff]/[0.02] prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:text-slate-400
                prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <div className="my-10"><AdSlot size="banner" /></div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Table of contents placeholder */}
            <div className="holo-card rounded-2xl p-5 sticky top-24">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#00f0ff]" /> {dict.blog.inThisPost}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{mdPost.excerpt}</p>

              <div className="border-t border-white/5 pt-4">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-3">{dict.blog.category}</h4>
                <Link href={`/${locale}/categories`} className="flex items-center gap-2 text-sm text-[#00f0ff] hover:text-white">
                  {mdPost.category} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-3">{dict.blog.tags}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {mdPost.tags.map((tag) => (
                    <span key={tag} className="rounded bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-500">{tag}</span>
                  ))}
                </div>
              </div>

              <AdSlot size="sidebar" className="mt-5" />
            </div>
          </aside>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{dict.blog.relatedPosts}</h2>
              <Link href={`/${locale}/blog`} className="text-sm text-[#00f0ff] hover:text-white flex items-center gap-1">
                {dict.home.viewAll} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (<BlogCard key={p.slug} post={p} locale={locale} />))}
            </div>
          </div>
        )}

        <div className="mt-12"><Newsletter /></div>
      </div>
    );
  }

  // Fallback: static post (excerpt only)
  const post = localizedBlogPosts.find((p) => p.slug === slug);
  if (!post) return <div className="py-40 text-center text-slate-400">{dict.common.notFound}</div>;

  const related = allPosts.filter((p) => p.category === post.category && p.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link href={`/${locale}`} className="hover:text-[#00f0ff]">{dict.common.home}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${locale}/blog`} className="hover:text-[#00f0ff]">{dict.common.breadcrumbBlog}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300 truncate max-w-[200px]">{post.title}</span>
      </div>

      <article className="mx-auto max-w-3xl">
        <span className="neon-border mb-4 inline-block rounded-full bg-[#00f0ff]/10 px-3 py-1 text-xs font-semibold text-[#00f0ff]">
          {post.category}
        </span>
        <h1 className="mb-4 text-4xl font-black leading-tight text-white">{post.title}</h1>
        <div className="mb-8 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-[#00f0ff]/50" />{new Date(post.date).toLocaleDateString(dtLocale, { day: "numeric", month: "long", year: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-[#00f0ff]/50" />{post.readTime}</span>
        </div>

        <div className="holo-card rounded-2xl p-8 text-slate-300">
          <p className="text-lg leading-relaxed mb-6">{post.excerpt}</p>
          <div className="rounded-xl border border-[#00f0ff]/10 bg-[#00f0ff]/[0.03] p-4 text-center">
            <p className="text-sm text-slate-400">{dict.blog.comingSoon}</p>
            <p className="mt-1 text-xs text-[#00f0ff]/50">{dict.blog.subscribeNote}</p>
          </div>
        </div>

        <div className="my-8"><AdSlot size="banner" /></div>
      </article>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">{dict.blog.relatedPosts}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (<BlogCard key={p.slug} post={p} locale={locale} />))}
          </div>
        </div>
      )}

      <div className="mt-12"><Newsletter /></div>
    </div>
  );
}
