import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3, GitBranch, Brain, Layers, Terminal, Code, Server, Lock, Activity, Database, Cpu, Globe, ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { BlogCard } from "@/components/blog-card";
import { Newsletter } from "@/components/newsletter";
import { AdSlot } from "@/components/ad-slot";
import { tools, blogPosts, categories } from "@/lib/data";

const features = [
  { icon: Brain, title: "AI-Powered Insights", desc: "Yapay zeka destekli tool önerileri ve karşılaştırma analizleri.", color: "text-[#00f0ff]" },
  { icon: BarChart3, title: "Detaylı Karşılaştırma", desc: "Yan yana feature comparison tabloları ile doğru tool'u seç.", color: "text-[#67e8f9]" },
  { icon: Shield, title: "Security-First", desc: "DevSecOps odaklı incelemeler ve güvenlik skorları.", color: "text-[#00f0ff]" },
  { icon: Zap, title: "Performans Analizi", desc: "Benchmark sonuçları ve gerçek dünya performans verileri.", color: "text-[#67e8f9]" },
  { icon: GitBranch, title: "Pipeline Rehberleri", desc: "CI/CD pipeline tasarım şablonları ve best practice'ler.", color: "text-[#00f0ff]" },
  { icon: Layers, title: "Stack Önerileri", desc: "Use-case bazlı teknoloji stack önerileri ve mimari rehberler.", color: "text-[#67e8f9]" },
];

const techIcons = [Terminal, Code, Server, Lock, Activity, Database, Cpu, Globe];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-[#00f0ff]/[0.06] blur-[180px]" />
          <div className="absolute top-1/3 right-1/5 h-[400px] w-[400px] rounded-full bg-[#67e8f9]/[0.04] blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-4 py-1.5 text-xs font-semibold text-[#00f0ff] font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                $ system --status operational
              </div>
              <h1 className="glitch text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[0.9]" data-text="DevOpSelf">DevOpSelf</h1>
              <p className="holo-text mt-4 text-xl font-bold sm:text-2xl">AI ile Akıllı ve Güvenli DevOps</p>
              <p className="mt-6 text-base leading-relaxed text-slate-400 max-w-lg">DevOps, AI ve Software araçlarını keşfet, karşılaştır ve ekibin için en doğru tooling kararını ver. 80+ tool, 12 kategori, bağımsız incelemeler.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/tools" className="neon-border flex items-center justify-center gap-2 rounded-xl bg-[#00f0ff]/10 px-6 py-3.5 text-sm font-semibold text-[#00f0ff] transition-all hover:bg-[#00f0ff]/20 hover:shadow-[0_0_30px_#00f0ff20]">
                  Tool Karşılaştırmalarına Göz At <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/blog" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5 hover:text-white">Blog Yazıları</Link>
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="hidden lg:block float">
              <div className="holo-card rounded-2xl p-1">
                <div className="rounded-xl bg-[#080c18] p-4">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /></div>
                    <span className="text-[10px] font-mono text-slate-600 ml-2">devopself-dashboard</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[{ label: "Uptime", val: "99.97%", bar: 99 },{ label: "Deploy/Day", val: "47", bar: 78 },{ label: "MTTR", val: "4.2m", bar: 85 }].map((m) => (
                      <div key={m.label} className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{m.label}</div>
                        <div className="text-lg font-bold text-white mt-1">{m.val}</div>
                        <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-[#00f0ff]/40" style={{ width: `${m.bar}%` }} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-3">CI/CD Pipeline</div>
                    <div className="flex items-center gap-2">
                      {["Build", "Test", "Scan", "Stage", "Deploy"].map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                          <div className={`rounded-md px-2.5 py-1 text-[10px] font-mono font-semibold border ${i < 4 ? "border-[#00f0ff]/20 bg-[#00f0ff]/5 text-[#00f0ff]" : "border-white/10 bg-white/5 text-slate-400 animate-pulse"}`}>{step}</div>
                          {i < 4 && <ChevronRight className="h-3 w-3 text-white/10" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 font-mono text-[10px]">
                    <div className="text-slate-600"><span className="text-[#00f0ff]/40">[00:12:34]</span> Container image built successfully</div>
                    <div className="text-slate-600"><span className="text-[#00f0ff]/40">[00:12:38]</span> Security scan: 0 vulnerabilities found</div>
                    <div className="text-slate-600"><span className="text-[#00f0ff]/40">[00:12:45]</span> Deployed to production <span className="text-[#00f0ff]">&#10003;</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[{ num: "80+", label: "Tool İnceleme" },{ num: "12", label: "Kategori" },{ num: "30+", label: "Karşılaştırma" },{ num: "Free", label: "Erişim" }].map((s) => (
              <div key={s.label} className="holo-card rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-[#00f0ff]" style={{ textShadow: "0 0 20px #00f0ff30" }}>{s.num}</div>
                <div className="mt-1 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><AdSlot size="leaderboard" /></div>

      {/* FEATURES + FLOATING ICONS */}
      <section className="border-t border-[#00f0ff]/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="neon-glow text-3xl font-bold">Neden DevOpSelf?</h2>
            <p className="mt-3 text-slate-400">DevOps tool seçimini kolaylaştıran kapsamlı bir kaynak merkezi.</p>
          </div>
          <div className="relative mb-12 flex justify-center">
            <div className="relative h-40 w-full max-w-xl">
              {techIcons.map((Icon, i) => {
                const pos = ["left-[5%] top-[20%]","left-[20%] top-[60%]","left-[35%] top-[10%]","left-[50%] top-[55%]","left-[62%] top-[15%]","left-[75%] top-[60%]","left-[85%] top-[25%]","left-[48%] top-[35%]"];
                return (<div key={i} className={`absolute ${pos[i]} rounded-xl border border-[#00f0ff]/10 bg-[#0a0f1a]/80 p-3 backdrop-blur-sm`} style={{ animation: `float ${5 + i * 0.7}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}><Icon className="h-5 w-5 text-[#00f0ff]/40" /></div>);
              })}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="15%" y1="35%" x2="30%" y2="70%" stroke="#00f0ff" strokeOpacity="0.06" strokeWidth="1" />
                <line x1="40%" y1="25%" x2="55%" y2="65%" stroke="#00f0ff" strokeOpacity="0.06" strokeWidth="1" />
                <line x1="55%" y1="65%" x2="70%" y2="30%" stroke="#00f0ff" strokeOpacity="0.06" strokeWidth="1" />
                <line x1="70%" y1="70%" x2="85%" y2="35%" stroke="#00f0ff" strokeOpacity="0.06" strokeWidth="1" />
              </svg>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="holo-card group rounded-2xl p-6 transition-all hover:scale-[1.02]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#00f0ff]/10 bg-[#00f0ff]/5">
                  <f.icon className={`h-6 w-6 ${f.color} drop-shadow-lg`} />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><AdSlot size="banner" /></div>

      {/* HOW IT WORKS */}
      <section className="border-t border-[#00f0ff]/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="neon-glow text-3xl font-bold">Nasıl Çalışır?</h2>
            <p className="mt-3 text-slate-400">3 adımda doğru DevOps tool&apos;unu bul.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[{ step: "01", title: "Keşfet", desc: "12 kategoride 80+ tool'u incele. Arama ve filtreleme ile ihtiyacına uygun araçları bul.", icon: Globe },{ step: "02", title: "Karşılaştır", desc: "Tool'ları yan yana karşılaştır. Pros/cons, fiyatlandırma ve performans analizlerini oku.", icon: BarChart3 },{ step: "03", title: "Karar Ver", desc: "Bağımsız inceleme ve topluluk değerlendirmeleri ile doğru tool'u seç.", icon: Zap }].map((s) => (
              <div key={s.step} className="holo-card group relative rounded-2xl p-8 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-[#00f0ff]/20 bg-[#05080f] px-4 py-1 font-mono text-xs font-bold text-[#00f0ff]">STEP {s.step}</div>
                <div className="mx-auto mb-4 mt-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#00f0ff]/10 bg-[#00f0ff]/5">
                  <s.icon className="h-7 w-7 text-[#00f0ff]" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR TOOLS */}
      <section className="border-t border-[#00f0ff]/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div><h2 className="neon-glow text-3xl font-bold">Popüler Karşılaştırmalar</h2><p className="mt-2 text-slate-400">En çok okunan tool karşılaştırmaları.</p></div>
            <Link href="/tools" className="hidden items-center gap-1 text-sm font-semibold text-[#00f0ff] hover:text-white sm:flex">Tümünü Gör <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.slice(0, 6).map((tool) => (<ToolCard key={tool.slug} tool={tool} />))}</div>
        </div>
      </section>

      {/* CATEGORIES + STACK DIAGRAM */}
      <section className="border-t border-[#00f0ff]/5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="holo-card rounded-2xl p-6">
              <div className="text-[10px] font-mono text-[#00f0ff]/50 uppercase tracking-wider mb-4">Typical DevOps Stack</div>
              <div className="space-y-3">
                {[{ layer: "Application", items: ["Frontend", "API", "Workers"] },{ layer: "Platform", items: ["Kubernetes", "Service Mesh", "API Gateway"] },{ layer: "Infrastructure", items: ["Cloud", "IaC", "Networking"] },{ layer: "Security", items: ["IAM", "Secrets", "Scanning"] },{ layer: "Observability", items: ["Metrics", "Logs", "Traces"] }].map((row) => (
                  <div key={row.layer} className="flex items-center gap-3">
                    <div className="w-24 shrink-0 text-right text-[10px] font-mono text-slate-500">{row.layer}</div>
                    <div className="flex flex-1 gap-2">{row.items.map((item) => (<div key={item} className="flex-1 rounded-md border border-[#00f0ff]/10 bg-[#00f0ff]/[0.03] px-2 py-1.5 text-center text-[10px] font-mono text-slate-400">{item}</div>))}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-slate-600">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent" />CI/CD Pipeline<div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent" />
              </div>
            </div>
            <div>
              <h2 className="neon-glow text-3xl font-bold">Kategoriler</h2>
              <p className="mt-3 mb-6 text-slate-400">İlgi alanına göre içerik keşfet.</p>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <Link key={cat.slug} href="/categories" className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all hover:border-[#00f0ff]/20 hover:bg-white/[0.04]">
                    <div><h3 className="font-bold text-white group-hover:text-[#00f0ff] transition-colors">{cat.name}</h3><p className="text-xs text-slate-500 mt-0.5">{cat.description}</p></div>
                    <div className="flex items-center gap-2 shrink-0 ml-4"><span className="rounded-md bg-[#00f0ff]/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#00f0ff]">{cat.count}</span><ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-[#00f0ff] transition-colors" /></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><AdSlot size="banner" /></div>

      {/* BLOG */}
      <section className="border-t border-[#00f0ff]/5">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div><h2 className="neon-glow text-3xl font-bold">Son Yazılar</h2><p className="mt-2 text-slate-400">DevOps, AI ve platform engineering hakkında güncel yazılar.</p></div>
            <Link href="/blog" className="hidden items-center gap-1 text-sm font-semibold text-[#00f0ff] hover:text-white sm:flex">Tümünü Gör <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{blogPosts.slice(0, 3).map((post) => (<BlogCard key={post.slug} post={post} />))}</div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-[#00f0ff]/5">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8"><Newsletter /></div>
      </section>
    </>
  );
}
