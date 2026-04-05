import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/data";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="holo-card group flex flex-col rounded-2xl border border-[#00f0ff]/10 bg-[#0a0f1c]/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#bf5af2]/30 hover:shadow-[0_0_30px_#bf5af215]"
    >
      <span className="mb-3 inline-block self-start rounded-full border border-[#bf5af2]/30 bg-[#bf5af2]/10 px-3 py-1 text-xs font-semibold text-[#bf5af2]">
        {post.category}
      </span>

      <h3 className="mb-2 text-lg font-bold text-white transition-colors duration-300 group-hover:text-[#bf5af2] group-hover:drop-shadow-[0_0_8px_#bf5af260]">
        {post.title}
      </h3>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#00f0ff]/50" />
            {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#00f0ff]/50" />
            {post.readTime}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-[#00f0ff] transition-all duration-300 group-hover:gap-2 group-hover:drop-shadow-[0_0_8px_#00f0ff]">
          Oku <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
