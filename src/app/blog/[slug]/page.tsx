import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Newsletter } from "@/components/newsletter";
import { blogPosts } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  return { title: post?.title || "Blog" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return <div className="py-40 text-center text-slate-400">Bulunamadı.</div>;

  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Tüm Yazılar
      </Link>

      <span className="mb-4 inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
        {post.category}
      </span>

      <h1 className="mb-4 text-4xl font-black leading-tight text-white">{post.title}</h1>

      <div className="mb-8 flex items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {post.readTime}
        </span>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-slate-300">
        <p className="text-lg leading-relaxed">{post.excerpt}</p>
        <hr className="my-6 border-white/[0.06]" />
        <p className="text-slate-400">
          Bu yazı yakında tam haliyle yayınlanacak. Bültenimize abone olarak yayınlandığında haberdar olabilirsiniz.
        </p>
      </div>

      <div className="mt-12">
        <Newsletter />
      </div>
    </article>
  );
}
