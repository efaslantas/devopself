import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3, GitBranch, Brain, Layers } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { BlogCard } from "@/components/blog-card";
import { Newsletter } from "@/components/newsletter";
import { AdSlot } from "@/components/ad-slot";
import { tools, blogPosts, categories } from "@/lib/data";

const features = [
  { icon: Brain, title: "AI-Powered Insights", desc: "Yapay zeka destekli tool önerileri ve karşılaştırma analizleri.", color: "text-[#bf5af2]" },
  { icon: BarChart3, title: "Detaylı Karşılaştırma", desc: "Yan yana feature comparison tabloları ile doğru tool'u seç.", color: "text-[#00f0ff]" },
  { icon: Shield, title: "Security-First", desc: "DevSecOps odaklı incelemeler ve güvenlik skorları.", color: "text-[#30d158]" },
  { icon: Zap, title: "Performans Analizi", desc: "Benchmark sonuçları ve gerçek dünya performans verileri.", color: "text-[#ff2d55]" },
  { icon: GitBranch, title: "Pipeline Rehberleri", desc: "CI/CD pipeline tasarım şablonları ve best practice'ler.", color: "text-[#00f0ff]" },
  { icon: Layers, title: "Stack Önerileri", desc: "Use-case bazlı teknoloji stack önerileri ve mimari rehberler.", color: "text-[#bf5af2]" },
];

const neonColors = ["#00f0ff", "#bf5af2", "#ff2d55", "#30d158", "#00f0ff", "#bf5af2"];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Floating orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/4 h-[400px] w-[400px] rounded-full bg-[#00f0ff]/[0.07] blur-[150px]" />
          <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-[#bf5af2]/[0.08] blur-[130px]" />
          <div className="absolute -bottom-20 left-1/2 h-[300px] w-[300px] rounded-full bg-[#ff2d55]/[0.06] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/10 px-4 py-1.5 text-xs font-semibold text-[#00f0ff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#30d158] animate-pulse" />
              Yeni Tool İncelemeleri Eklendi
            </div>

            <h1 className="glitch text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl" data-text="DevOpSelf">
              DevOpSelf
            </h1>

            <p className="holo-text mt-4 text-2xl font-bold sm:text-3xl">
              AI ile Akıllı ve Güvenli DevOps
            </p>

            <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
              DevOps, AI ve Software araçlarını keşfet, karşılaştır ve ekibin için
              en doğru tooling kararını ver. 80+ tool, 12 kategori, bağımsız incelemeler.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/tools"
                className="neon-border flex items-center gap-2 rounded-xl bg-[#00f0ff]/10 px-6 py-3.5 text-sm font-semibold text-[#00f0ff] shadow-lg shadow-[#00f0ff]/20 transition-all hover:bg-[#00f0ff]/20 hover:shadow-xl hover:shadow-[#00f0ff]/30"
              >
                Tool Karşılaştırmalarına Göz At
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 rounded-xl border border-[#bf5af2]/20 bg-[#bf5af2]/5 px-6 py-3.5 text-sm font-semibold text-[#bf5af2] transition-all hover:bg-[#bf5af2]/10 hover:text-white"
              >
                Blog Yazıları
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { num: "80+", label: "Tool İnceleme", color: "#00f0ff" },
              { num: "12", label: "Kategori", color: "#bf5af2" },
              { num: "30+", label: "Karşılaştırma", color: "#ff2d55" },
              { num: "Free", label: "Erişim", color: "#30d158" },
            ].map((s) => (
              <div key={s.label} className="holo-card rounded-xl p-4 text-center">
                <div className="text-2xl font-black" style={{ color: s.color, textShadow: `0 0 20px ${s.color}40` }}>{s.num}</div>
                <div className="mt-1 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad: Leaderboard */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" />
      </div>

      {/* Features */}
      <section className="border-t border-[#00f0ff]/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="neon-glow text-3xl font-bold">Neden DevOpSelf?</h2>
            <p className="mt-3 text-slate-400">DevOps tool seçimini kolaylaştıran kapsamlı bir kaynak merkezi.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="holo-card group rounded-2xl p-6 transition-all hover:scale-[1.02]">
                <f.icon className={`mb-4 h-8 w-8 ${f.color} drop-shadow-lg`} />
                <h3 className="mb-2 text-base font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad: Banner */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>

      {/* Popular Tool Comparisons */}
      <section className="border-t border-[#00f0ff]/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="neon-glow text-3xl font-bold">Popüler Karşılaştırmalar</h2>
              <p className="mt-2 text-slate-400">En çok okunan tool karşılaştırmaları.</p>
            </div>
            <Link href="/tools" className="hidden items-center gap-1 text-sm font-semibold text-[#00f0ff] hover:text-white sm:flex">
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/tools" className="inline-flex items-center gap-1 text-sm font-semibold text-[#00f0ff]">
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-[#bf5af2]/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="neon-glow text-3xl font-bold">Kategoriler</h2>
            <p className="mt-2 text-slate-400">İlgi alanına göre içerik keşfet.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/categories`}
                className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:scale-[1.02]"
                style={{ borderColor: `${neonColors[i % neonColors.length]}15` }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-white group-hover:text-[#00f0ff]">{cat.name}</h3>
                  <span
                    className="rounded-lg px-2 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: `${neonColors[i % neonColors.length]}15`, color: neonColors[i % neonColors.length] }}
                  >
                    {cat.count} yazı
                  </span>
                </div>
                <p className="text-sm text-slate-400">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ad: Banner before newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>

      {/* Blog */}
      <section className="border-t border-[#00f0ff]/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="neon-glow text-3xl font-bold">Son Yazılar</h2>
              <p className="mt-2 text-slate-400">DevOps, AI ve platform engineering hakkında güncel yazılar.</p>
            </div>
            <Link href="/blog" className="hidden items-center gap-1 text-sm font-semibold text-[#00f0ff] hover:text-white sm:flex">
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-[#bf5af2]/10">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
