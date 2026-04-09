import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, Check, X, ExternalLink, Tag, BarChart3, Shield, Zap, DollarSign, Users, ArrowRight } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ToolCard } from "@/components/tool-card";
import { Newsletter } from "@/components/newsletter";
import { tools, categories } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  return {
    title: tool ? `${tool.name} - Detayl\u0131 \u0130nceleme` : "Tool Kar\u015f\u0131la\u015ft\u0131rma",
    description: tool?.description,
  };
}

export default async function ToolDetail({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return <div className="py-40 text-center text-slate-400">Bulunamad\u0131.</div>;

  // Related tools from same category
  const related = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);

  // Score breakdown (simulated based on overall score)
  const scoreBreaks = [
    { label: "Kullan\u0131m Kolayl\u0131\u011f\u0131", score: Math.min(10, tool.score + (Math.random() > 0.5 ? 0.3 : -0.2)), icon: Zap },
    { label: "Dok\u00fcmantasyon", score: Math.min(10, tool.score + (Math.random() > 0.5 ? 0.2 : -0.3)), icon: BarChart3 },
    { label: "Topluluk", score: Math.min(10, tool.score + (Math.random() > 0.5 ? 0.4 : -0.5)), icon: Users },
    { label: "G\u00fcvenlik", score: Math.min(10, tool.score + (Math.random() > 0.5 ? 0.1 : -0.4)), icon: Shield },
    { label: "Fiyat/Performans", score: Math.min(10, tool.score + (Math.random() > 0.5 ? 0.5 : -0.1)), icon: DollarSign },
  ].map((s) => ({ ...s, score: Math.round(s.score * 10) / 10 }));

  const pricingInfo: Record<string, { label: string; desc: string }> = {
    free: { label: "Tamamen \u00dccretsiz", desc: "T\u00fcm \u00f6zellikler \u00fccretsiz kullan\u0131labilir." },
    freemium: { label: "Freemium", desc: "\u00dccretsiz plan mevcut, geli\u015fmi\u015f \u00f6zellikler i\u00e7in \u00f6deme gerekli." },
    paid: { label: "\u00dccretli", desc: "Kullan\u0131m i\u00e7in \u00f6deme plan\u0131 gerekli." },
    "open-source": { label: "A\u00e7\u0131k Kaynak", desc: "Kaynak kodu a\u00e7\u0131k, \u00fccretsiz kullan\u0131labilir ve katk\u0131da bulunulabilir." },
  };

  const pi = pricingInfo[tool.pricing] || pricingInfo.free;

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-[#00f0ff]">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-[#00f0ff]">Tool Kar\u015f\u0131la\u015ft\u0131rma</Link>
        <span>/</span>
        <span className="text-slate-300">{tool.name}</span>
      </div>

      {/* Header */}
      <div className="mb-10 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-3 py-1 font-mono text-xs text-[#00f0ff]">{tool.category}</span>
            <span className="rounded-full border border-[#67e8f9]/20 bg-[#67e8f9]/5 px-3 py-1 text-xs font-semibold text-[#67e8f9]">{pi.label}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">{tool.name}</h1>
          <p className="text-lg text-slate-400 leading-relaxed">{tool.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-md border border-[#00f0ff]/10 bg-[#00f0ff]/5 px-2.5 py-1 font-mono text-xs text-slate-400">
                <Tag className="h-3 w-3 text-[#00f0ff]/50" /> {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={tool.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#00f0ff] px-5 py-3 text-sm font-bold text-[#05080f] transition-all hover:shadow-[0_0_30px_#00f0ff40]">
              Resmi Siteyi Ziyaret Et <ExternalLink className="h-4 w-4" />
            </a>
            <Link href="/tools" className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">
              <ArrowLeft className="h-4 w-4" /> T\u00fcm Ara\u00e7lar
            </Link>
          </div>
        </div>

        {/* Score card */}
        <div className="holo-card rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-3">
              <span className="text-3xl font-black text-[#00f0ff]" style={{ textShadow: "0 0 30px #00f0ff50" }}>{tool.score}</span>
            </div>
            <div className="text-sm text-slate-400">Genel Puan <span className="text-slate-600">/ 10</span></div>
          </div>
          {/* Score bars */}
          <div className="space-y-3">
            {scoreBreaks.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400"><s.icon className="h-3 w-3 text-[#00f0ff]/50" />{s.label}</span>
                  <span className="font-mono text-xs text-[#00f0ff]">{s.score}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#00f0ff]/40 transition-all" style={{ width: `${s.score * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdSlot size="leaderboard" />

      {/* Pros / Cons */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="holo-card rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#00f0ff] mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00f0ff]/10"><Check className="h-4 w-4" /></div>
            Avantajlar
          </h2>
          <ul className="space-y-3">
            {tool.pros.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-lg bg-[#00f0ff]/[0.03] border border-[#00f0ff]/5 p-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00f0ff]" />
                <span className="text-sm text-slate-300">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="holo-card rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#94a3b8] mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#94a3b8]/10"><X className="h-4 w-4" /></div>
            Dezavantajlar
          </h2>
          <ul className="space-y-3">
            {tool.cons.map((c) => (
              <li key={c} className="flex items-start gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8]" />
                <span className="text-sm text-slate-300">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing info */}
      <div className="mt-10 holo-card rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
          <DollarSign className="h-5 w-5 text-[#00f0ff]" /> Fiyatland\u0131rma
        </h2>
        <div className="flex items-center gap-4 rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00f0ff]/15 bg-[#00f0ff]/5">
            <DollarSign className="h-6 w-6 text-[#00f0ff]" />
          </div>
          <div>
            <div className="font-bold text-white">{pi.label}</div>
            <div className="text-sm text-slate-400">{pi.desc}</div>
          </div>
        </div>
      </div>

      <div className="mt-10"><AdSlot size="banner" /></div>

      {/* Related tools */}
      {related.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Benzer Ara\u00e7lar</h2>
            <Link href="/tools" className="text-sm text-[#00f0ff] hover:text-white flex items-center gap-1">
              T\u00fcm\u00fcn\u00fc G\u00f6r <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (<ToolCard key={t.slug} tool={t} />))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div className="mt-12"><Newsletter /></div>
    </div>
  );
}
