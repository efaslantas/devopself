import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, Check, X, ExternalLink } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { tools } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  return { title: tool?.name || "Tool Karşılaştırma" };
}

export default async function ToolDetail({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return <div className="py-40 text-center text-slate-400">Bulunamadı.</div>;

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <Link href="/tools" className="mb-8 inline-flex items-center gap-2 text-sm text-[#00f0ff]/70 hover:text-[#00f0ff]">
        <ArrowLeft className="h-4 w-4" /> Tüm Karşılaştırmalar
      </Link>

      <h1 className="glitch mb-4 text-4xl font-black text-white" data-text={tool.name}>{tool.name}</h1>
      <p className="mb-8 text-lg text-slate-400">{tool.description}</p>

      <div className="mb-8 flex flex-wrap gap-4">
        <div className="neon-border flex items-center gap-2 rounded-xl bg-[#05080f]/80 px-4 py-2">
          <Star className="h-5 w-5 fill-[#00f0ff] text-[#00f0ff]" />
          <span className="text-xl font-bold text-[#00f0ff]" style={{ textShadow: "0 0 20px #00f0ff40" }}>{tool.score}</span>
          <span className="text-sm text-slate-500">/10</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#67e8f9]/20 bg-[#67e8f9]/5 px-4 py-2 text-sm text-[#67e8f9]">
          {tool.category}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#00f0ff]/10 px-4 py-2 text-sm font-semibold text-[#00f0ff]">
          {tool.pricing}
        </div>
      </div>

      {/* Ad: Between header and content */}
      <div className="mb-8">
        <AdSlot size="banner" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#00f0ff]/20 bg-[#00f0ff]/[0.03] p-6 backdrop-blur-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-[#00f0ff]" style={{ textShadow: "0 0 10px #00f0ff40" }}>
            <Check className="h-5 w-5" /> Avantajlar
          </h3>
          <ul className="space-y-2">
            {tool.pros.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00f0ff]" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[#94a3b8]/20 bg-[#94a3b8]/[0.03] p-6 backdrop-blur-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-[#94a3b8]" style={{ textShadow: "0 0 10px #94a3b840" }}>
            <X className="h-5 w-5" /> Dezavantajlar
          </h3>
          <ul className="space-y-2">
            {tool.cons.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-slate-300">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[#94a3b8]" /> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ad: After pros/cons */}
      <div className="my-8">
        <AdSlot size="sidebar" />
      </div>

      <div className="holo-card rounded-2xl p-8 text-center">
        <p className="mb-4 text-slate-400">Detaylı karşılaştırma yakında yayınlanacak.</p>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="neon-border inline-flex items-center gap-2 rounded-xl bg-[#00f0ff]/10 px-6 py-3 text-sm font-semibold text-[#00f0ff] transition-all hover:bg-[#00f0ff]/20 hover:shadow-lg hover:shadow-[#00f0ff]/20"
        >
          Resmi Siteyi Ziyaret Et <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
