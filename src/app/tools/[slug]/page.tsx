import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, Check, X, ExternalLink } from "lucide-react";
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
      <Link href="/tools" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Tüm Karşılaştırmalar
      </Link>

      <h1 className="mb-4 text-4xl font-black text-white">{tool.name}</h1>
      <p className="mb-8 text-lg text-slate-400">{tool.description}</p>

      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span className="text-xl font-bold text-white">{tool.score}</span>
          <span className="text-sm text-slate-500">/10</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-sm text-slate-300">
          {tool.category}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-400">
          {tool.pricing}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-emerald-400">
            <Check className="h-5 w-5" /> Avantajlar
          </h3>
          <ul className="space-y-2">
            {tool.pros.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-6">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-red-400">
            <X className="h-5 w-5" /> Dezavantajlar
          </h3>
          <ul className="space-y-2">
            {tool.cons.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-slate-300">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <p className="mb-4 text-slate-400">Detaylı karşılaştırma yakında yayınlanacak.</p>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Resmi Siteyi Ziyaret Et <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
