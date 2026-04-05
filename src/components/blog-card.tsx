import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/data";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-white/[0.06] bg-[#111827] p-6 transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#161f32]"
    >
      <span className="mb-3 inline-block self-start rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
        {post.category}
      </span>

      <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-indigo-300">
        {post.title}
      </h3>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-indigo-400 transition-all group-hover:gap-2">
          Oku <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
