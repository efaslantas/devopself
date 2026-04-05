import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { AdSlot } from "@/components/ad-slot";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  const featured = blogPosts.filter((p) => p.featured);
  const rest = blogPosts.filter((p) => !p.featured);

  return (
    <>
      <section className="border-b border-[#00f0ff]/10">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <h1 className="neon-glow text-4xl font-black">Blog</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            DevOps, AI, platform engineering ve daha fazlası hakkında derinlemesine yazılar.
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-[#00f0ff]" style={{ textShadow: "0 0 15px #00f0ff40" }}>Öne Çıkan Yazılar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Ad: Between sections */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-[#00f0ff]" style={{ textShadow: "0 0 15px #00f0ff40" }}>Tüm Yazılar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Ad: Bottom */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" />
      </div>
    </>
  );
}
