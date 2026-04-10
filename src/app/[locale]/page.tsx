"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search, Sparkles, Star, Users, Zap, Shield, BookOpen } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { BlogCard } from "@/components/blog-card";
import { Newsletter } from "@/components/newsletter";
import { getTools, getBlogPosts, getCategories } from "@/lib/data";
import trDict from "@/lib/dictionaries/tr.json";
import enDict from "@/lib/dictionaries/en.json";
import ruDict from "@/lib/dictionaries/ru.json";

const dicts = { tr: trDict, en: enDict, ru: ruDict };

const marqueeTools = [
  "Kubernetes", "Terraform", "Docker", "ArgoCD", "Prometheus", "Grafana",
  "Jenkins", "GitLab", "Datadog", "Vault", "Ansible", "Pulumi",
  "Trivy", "Snyk", "Flux", "Helm", "Copilot", "Cursor",
];

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "tr";
  const dict = dicts[locale as keyof typeof dicts] || trDict;

  const allTools = useMemo(() => getTools(locale), [locale]);
  const allBlogPosts = useMemo(() => getBlogPosts(locale), [locale]);
  const allCategories = useMemo(() => getCategories(locale), [locale]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter tools based on search + category
  const filteredTools = useMemo(() => {
    let result = allTools;
    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result.slice(0, 12);
  }, [allTools, search, activeCategory]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleMouse = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-glow hidden lg:block" />

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-[#00f0ff]/[0.04] blur-[200px]" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#67e8f9]/[0.03] blur-[180px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/15 bg-[#00f0ff]/5 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00f0ff] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00f0ff]" />
            </span>
            <span className="font-mono text-[11px] text-[#00f0ff]">{dict.home.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            {dict.home.title}{" "}
            <span className="holo-text">{dict.home.titleHighlight}</span>
          </h1>

          <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            {dict.home.description}
          </p>

          {/* SEARCH BOX */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00f0ff]/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={locale === "en" ? "Search tools..." : locale === "ru" ? "Поиск инструментов..." : "Araç ara..."}
                className="w-full rounded-xl border border-[#00f0ff]/20 bg-[#0a0f1c]/80 backdrop-blur-sm pl-12 pr-4 py-4 text-base text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00f0ff]/50 focus:shadow-[0_0_30px_#00f0ff20] transition-all"
              />
            </div>
          </div>

          {/* SOCIAL PROOF BAR */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#00f0ff] text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]" />
                ))}
              </div>
              <span className="font-mono text-[#00f0ff]">5.0</span>
              <span className="text-slate-600">/</span>
              <span>{locale === "en" ? "Community rated" : locale === "ru" ? "Оценено сообществом" : "Topluluk değerlendirmesi"}</span>
            </div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#00f0ff]" />
              <span className="font-mono text-white">65+</span>
              <span>{locale === "en" ? "tools reviewed" : locale === "ru" ? "инструментов" : "araç incelendi"}</span>
            </div>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#00f0ff]" />
              <span className="font-mono text-white">25+</span>
              <span>{locale === "en" ? "guides" : locale === "ru" ? "руководств" : "rehber"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TOOL MARQUEE ═══════ */}
      <div className="border-y border-white/[0.04] bg-white/[0.01] py-4 overflow-hidden">
        <div className="marquee">
          <div className="marquee-inner">
            {[...marqueeTools, ...marqueeTools].map((t, i) => (
              <span key={i} className="text-xs font-mono text-slate-600 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#00f0ff]/40" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ TOOL SHOWCASE WITH FILTER ═══════ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">
              {dict.home.popularTitle}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              {dict.home.popularSubtitle}
            </h2>
            <p className="mt-3 text-slate-400">{dict.home.popularDesc}</p>
          </div>

          {/* Category filter pills */}
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-[#00f0ff] text-[#05080f] shadow-[0_0_20px_#00f0ff40]"
                  : "border border-white/10 text-slate-400 hover:border-[#00f0ff]/30 hover:text-[#00f0ff]"
              }`}
            >
              {dict.tools.all} ({allTools.length})
            </button>
            {allCategories.slice(0, 6).map((cat) => {
              const count = allTools.filter((t) => t.category === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === cat.slug
                      ? "bg-[#00f0ff] text-[#05080f] shadow-[0_0_20px_#00f0ff40]"
                      : "border border-white/10 text-slate-400 hover:border-[#00f0ff]/30 hover:text-[#00f0ff]"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Tool grid */}
          {filteredTools.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-500">
                {locale === "en" ? "No tools found." : locale === "ru" ? "Инструменты не найдены." : dict.tools.emptyState}
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/tools`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00f0ff] hover:text-white transition-colors"
            >
              {dict.home.viewAll} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS (compact) ═══════ */}
      <section className="border-t border-white/[0.04] bg-white/[0.01] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">
              {dict.home.howTitle}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{dict.home.howSubtitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", icon: Search, title: dict.home.step1Title, desc: dict.home.step1Desc },
              { num: "02", icon: Sparkles, title: dict.home.step2Title, desc: dict.home.step2Desc },
              { num: "03", icon: Zap, title: dict.home.step3Title, desc: dict.home.step3Desc },
            ].map((s) => (
              <div key={s.num} className="holo-card rounded-2xl p-6 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#00f0ff]/20 bg-[#00f0ff]/5">
                  <s.icon className="h-5 w-5 text-[#00f0ff]" />
                </div>
                <div className="font-mono text-xs text-[#00f0ff]/60 mb-1">{s.num}</div>
                <h3 className="font-bold text-white mb-1">{s.title}</h3>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ LATEST BLOG ═══════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">
                {dict.home.blogTitle}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{dict.home.blogSubtitle}</h2>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-[#00f0ff] hover:text-white transition-colors"
            >
              {dict.home.viewAll} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allBlogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="border-t border-white/[0.04] bg-white/[0.01] py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Newsletter locale={locale} />
        </div>
      </section>
    </>
  );
}
