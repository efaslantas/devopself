"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3, GitBranch, Brain, Layers, Terminal, Code, Server, Lock, Activity, Database, Cpu, Globe, ChevronRight, Sparkles, ArrowUpRight, Users, TrendingUp, Search } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { BlogCard } from "@/components/blog-card";
import { Newsletter } from "@/components/newsletter";
import { AdSlot } from "@/components/ad-slot";
import { tools, blogPosts, categories } from "@/lib/data";

const features = [
  { icon: Brain, title: "AI-Powered Insights", desc: "Yapay zeka destekli tool \u00f6nerileri ve kar\u015f\u0131la\u015ft\u0131rma analizleri." },
  { icon: BarChart3, title: "Detayl\u0131 Kar\u015f\u0131la\u015ft\u0131rma", desc: "Yan yana feature comparison tablolar\u0131 ile do\u011fru tool'u se\u00e7." },
  { icon: Shield, title: "Security-First", desc: "DevSecOps odakl\u0131 incelemeler ve g\u00fcvenlik skorlar\u0131." },
  { icon: Zap, title: "Performans Analizi", desc: "Benchmark sonu\u00e7lar\u0131 ve ger\u00e7ek d\u00fcnya performans verileri." },
  { icon: GitBranch, title: "Pipeline Rehberleri", desc: "CI/CD pipeline tasar\u0131m \u015fablonlar\u0131 ve best practice'ler." },
  { icon: Layers, title: "Stack \u00d6nerileri", desc: "Use-case bazl\u0131 teknoloji stack \u00f6nerileri ve mimari rehberler." },
];

const marqueeTools = ["Kubernetes", "Terraform", "Docker", "ArgoCD", "Prometheus", "Grafana", "Jenkins", "GitLab", "Datadog", "Vault", "Ansible", "Pulumi", "Trivy", "Snyk", "Flux", "Helm"];

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cursor glow follower
    const handleMouse = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", handleMouse);

    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Cursor glow */}
      <div ref={cursorRef} className="cursor-glow hidden lg:block" />

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-[#00f0ff]/[0.04] blur-[200px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#67e8f9]/[0.03] blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-7xl w-full px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left 3 cols */}
            <div className="lg:col-span-3">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/15 bg-[#00f0ff]/5 px-4 py-1.5">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00f0ff] opacity-40" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f0ff]" /></span>
                <span className="font-mono text-[11px] text-[#00f0ff]">v2.0 &mdash; 80+ tool eklendi</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
                DevOps Tool&apos;lar\u0131n\u0131<br/>
                <span className="holo-text">Ke\u015ffet &amp; Kar\u015f\u0131la\u015ft\u0131r</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
                CI/CD, monitoring, IaC, container, security &mdash; t\u00fcm DevOps ekosistemini tek platformda incele. Ba\u011f\u0131ms\u0131z, tarafs\u0131z, \u00fccretsiz.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/tools" className="group flex items-center gap-2 rounded-xl bg-[#00f0ff] px-5 py-3 text-sm font-bold text-[#05080f] transition-all hover:shadow-[0_0_30px_#00f0ff40]">
                  Kar\u015f\u0131la\u015ft\u0131rmalar\u0131 G\u00f6r <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/blog" className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5">
                  <Sparkles className="h-4 w-4 text-[#00f0ff]" /> Blog
                </Link>
              </div>

              {/* Mini stats inline */}
              <div className="mt-10 flex gap-8">
                {[{ n: "80+", l: "Tool" }, { n: "12", l: "Kategori" }, { n: "30+", l: "Kar\u015f\u0131la\u015ft\u0131rma" }].map((s) => (
                  <div key={s.l}>
                    <div className="text-2xl font-black text-white counter">{s.n}</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 2 cols: Interactive terminal */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="holo-card rounded-2xl p-1 float">
                <div className="rounded-xl bg-[#060a15] p-5 font-mono text-xs">
                  {/* Terminal bar */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                    <div className="flex gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00f0ff]/30" /><div className="w-2 h-2 rounded-full bg-white/10" /><div className="w-2 h-2 rounded-full bg-white/10" /></div>
                    <span className="text-slate-600 ml-2">devopself ~ tools</span>
                  </div>
                  {/* Command */}
                  <div className="text-slate-500">
                    <span className="text-[#00f0ff]">$</span> devopself compare --tools &quot;k8s,docker-swarm&quot;
                  </div>
                  <div className="mt-3 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 space-y-2">
                    <div className="flex justify-between"><span className="text-slate-500">Kubernetes</span><span className="text-[#00f0ff]">9.0/10</span></div>
                    <div className="h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-[#00f0ff]/50 w-[90%]" /></div>
                    <div className="flex justify-between mt-2"><span className="text-slate-500">Docker Swarm</span><span className="text-[#67e8f9]">7.2/10</span></div>
                    <div className="h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-[#67e8f9]/50 w-[72%]" /></div>
                  </div>
                  <div className="mt-3 text-slate-600">
                    <span className="text-[#00f0ff]">$</span> devopself recommend --use-case &quot;microservices&quot;
                  </div>
                  <div className="mt-1 text-[#00f0ff]/60">&gt; \u00d6neri: Kubernetes + ArgoCD + Prometheus</div>
                  <div className="mt-2 text-slate-600"><span className="text-[#00f0ff]">$</span> <span className="typing-cursor">_</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[3px] text-slate-600">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-[#00f0ff]/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ═══════ TOOL MARQUEE ═══════ */}
      <div className="border-y border-white/[0.03] bg-white/[0.01] py-4 overflow-hidden">
        <div className="marquee">
          <div className="marquee-inner">
            {[...marqueeTools, ...marqueeTools].map((t, i) => (
              <span key={i} className="text-xs font-mono text-slate-600 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#00f0ff]/30" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><AdSlot size="leaderboard" /></div>

      {/* ═══════ FEATURES ═══════ */}
      <section className="border-t border-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="reveal mx-auto mb-16 max-w-xl text-center">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">Neden DevOpSelf?</p>
            <h2 className="text-3xl font-bold text-white">Do\u011fru Tool&apos;u Se\u00e7menin<br/><span className="text-slate-500">En H\u0131zl\u0131 Yolu</span></h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.title} className="reveal holo-card group rounded-2xl p-6 transition-all hover:scale-[1.02]" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/10 group-hover:shadow-[0_0_20px_#00f0ff15] transition-shadow">
                  <f.icon className="h-5 w-5 text-[#00f0ff]" />
                </div>
                <h3 className="mb-1 text-sm font-bold text-white">{f.title}</h3>
                <p className="text-xs leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="border-t border-white/[0.03] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="reveal mx-auto mb-16 max-w-xl text-center">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">Nas\u0131l \u00c7al\u0131\u015f\u0131r?</p>
            <h2 className="text-3xl font-bold text-white">3 Ad\u0131mda Do\u011fru Arac\u0131 Bul</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", icon: Search, title: "Ke\u015ffet", desc: "12 kategoride 80+ tool\u2019u incele ve filtrele." },
              { num: "02", icon: BarChart3, title: "Kar\u015f\u0131la\u015ft\u0131r", desc: "Yan yana pros/cons, fiyat ve performans analizi." },
              { num: "03", icon: Zap, title: "Karar Ver", desc: "Ba\u011f\u0131ms\u0131z skorlar ve topluluk de\u011ferlendirmeleri." },
            ].map((s, i) => (
              <div key={s.num} className="reveal relative" style={{ transitionDelay: `${i * 150}ms` }}>
                {/* Connecting line */}
                {i < 2 && <div className="hidden md:block absolute top-12 -right-3 w-6 h-[1px] bg-gradient-to-r from-[#00f0ff]/20 to-transparent" />}
                <div className="holo-card rounded-2xl p-8">
                  <span className="font-mono text-5xl font-black text-white/[0.04]">{s.num}</span>
                  <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00f0ff]/5 border border-[#00f0ff]/10">
                    <s.icon className="h-5 w-5 text-[#00f0ff]" />
                  </div>
                  <h3 className="mt-4 font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><AdSlot size="banner" /></div>

      {/* ═══════ POPULAR COMPARISONS ═══════ */}
      <section className="border-t border-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="reveal mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">Pop\u00fcler</p>
              <h2 className="text-3xl font-bold text-white">Tool Kar\u015f\u0131la\u015ft\u0131rmalar\u0131</h2>
            </div>
            <Link href="/tools" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#00f0ff] hover:text-white transition-colors">
              T\u00fcm\u00fcn\u00fc G\u00f6r <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.slice(0, 6).map((tool, i) => (
              <div key={tool.slug} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORIES + STACK ═══════ */}
      <section className="border-t border-white/[0.03] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Stack diagram */}
            <div className="reveal">
              <div className="holo-card rounded-2xl p-6">
                <div className="font-mono text-[10px] text-[#00f0ff]/40 uppercase tracking-wider mb-5">DevOps Stack Layers</div>
                {[
                  { layer: "Application", items: ["Frontend", "API", "Workers"], w: "100%" },
                  { layer: "Platform", items: ["K8s", "Mesh", "Gateway"], w: "90%" },
                  { layer: "Infra", items: ["Cloud", "IaC", "Network"], w: "80%" },
                  { layer: "Security", items: ["IAM", "Secrets", "Scan"], w: "70%" },
                  { layer: "Observe", items: ["Metrics", "Logs", "Traces"], w: "60%" },
                ].map((row) => (
                  <div key={row.layer} className="mb-2 flex items-center gap-3" style={{ width: row.w, marginLeft: "auto", marginRight: "auto" }}>
                    <div className="w-16 shrink-0 text-right font-mono text-[9px] text-slate-600">{row.layer}</div>
                    <div className="flex flex-1 gap-1">
                      {row.items.map((item) => (
                        <div key={item} className="flex-1 rounded border border-[#00f0ff]/8 bg-[#00f0ff]/[0.02] px-1.5 py-1 text-center font-mono text-[9px] text-slate-500">{item}</div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mt-3 flex items-center gap-2 font-mono text-[9px] text-slate-600">
                  <div className="h-px flex-1 bg-[#00f0ff]/10" /><span>CI/CD Pipeline</span><div className="h-px flex-1 bg-[#00f0ff]/10" />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="reveal">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">Kategoriler</p>
              <h2 className="text-2xl font-bold text-white mb-6">\u0130lgi Alan\u0131na G\u00f6re Ke\u015ffet</h2>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link key={cat.slug} href="/categories" className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 transition-all hover:border-[#00f0ff]/15 hover:bg-white/[0.03]">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate">{cat.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate">{cat.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="rounded bg-[#00f0ff]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#00f0ff]">{cat.count}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-[#00f0ff] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><AdSlot size="banner" /></div>

      {/* ═══════ BLOG ═══════ */}
      <section className="border-t border-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="reveal mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">Blog</p>
              <h2 className="text-3xl font-bold text-white">Son Yaz\u0131lar</h2>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#00f0ff] hover:text-white transition-colors">
              T\u00fcm\u00fcn\u00fc G\u00f6r <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, i) => (
              <div key={post.slug} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="border-t border-white/[0.03] bg-white/[0.01]">
        <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="reveal">
            <Newsletter />
          </div>
        </div>
      </section>
    </>
  );
}
