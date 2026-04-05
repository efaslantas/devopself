import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3, GitBranch, Brain, Layers } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { BlogCard } from "@/components/blog-card";
import { Newsletter } from "@/components/newsletter";
import { tools, blogPosts, categories } from "@/lib/data";

const features = [
  { icon: Brain, title: "AI-Powered Insights", desc: "Yapay zeka destekli tool önerileri ve karşılaştırma analizleri.", color: "text-purple-400" },
  { icon: BarChart3, title: "Detaylı Karşılaştırma", desc: "Yan yana feature comparison tabloları ile doğru tool'u seç.", color: "text-indigo-400" },
  { icon: Shield, title: "Security-First", desc: "DevSecOps odaklı incelemeler ve güvenlik skorları.", color: "text-emerald-400" },
  { icon: Zap, title: "Performans Analizi", desc: "Benchmark sonuçları ve gerçek dünya performans verileri.", color: "text-amber-400" },
  { icon: GitBranch, title: "Pipeline Rehberleri", desc: "CI/CD pipeline tasarım şablonları ve best practice'ler.", color: "text-cyan-400" },
  { icon: Layers, title: "Stack Önerileri", desc: "Use-case bazlı teknoloji stack önerileri ve mimari rehberler.", color: "text-rose-400" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.07] blur-[120px]" />
          <div className="absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/[0.05] blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Yeni Tool İncelemeleri Eklendi
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              AI ile Akıllı ve{" "}
              <span className="gradient-text">Güvenli DevOps</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-400 sm:text-xl">
              DevOps, AI ve Software araçlarını keşfet, karşılaştır ve ekibin için
              en doğru tooling kararını ver. 80+ tool, 12 kategori, bağımsız incelemeler.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/tools"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Tool Karşılaştırmalarına Göz At
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/[0.06] hover:text-white"
              >
                Blog Yazıları
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { num: "80+", label: "Tool İnceleme" },
              { num: "12", label: "Kategori" },
              { num: "30+", label: "Karşılaştırma" },
              { num: "Free", label: "Erişim" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 text-center">
                <div className="text-2xl font-black text-white">{s.num}</div>
                <div className="mt-1 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/[0.04] bg-[#0a0e17]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white">Neden DevOpSelf?</h2>
            <p className="mt-3 text-slate-400">DevOps tool seçimini kolaylaştıran kapsamlı bir kaynak merkezi.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 transition-all hover:border-white/[0.08] hover:bg-white/[0.03]">
                <f.icon className={`mb-4 h-8 w-8 ${f.color}`} />
                <h3 className="mb-2 text-base font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tool Comparisons */}
      <section className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Popüler Karşılaştırmalar</h2>
              <p className="mt-2 text-slate-400">En çok okunan tool karşılaştırmaları.</p>
            </div>
            <Link href="/tools" className="hidden items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 sm:flex">
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/tools" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400">
              Tümünü Gör <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-white/[0.04] bg-[#0a0e17]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Kategoriler</h2>
            <p className="mt-2 text-slate-400">İlgi alanına göre içerik keşfet.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories`}
                className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 transition-all hover:border-indigo-500/20 hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-white group-hover:text-indigo-300">{cat.name}</h3>
                  <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400">{cat.count} yazı</span>
                </div>
                <p className="text-sm text-slate-400">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Son Yazılar</h2>
              <p className="mt-2 text-slate-400">DevOps, AI ve platform engineering hakkında güncel yazılar.</p>
            </div>
            <Link href="/blog" className="hidden items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 sm:flex">
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
      <section className="border-t border-white/[0.04] bg-[#0a0e17]">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
