import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Tool } from "@/lib/data";

const pricingStyles: Record<string, string> = {
  free: "bg-emerald-500/10 text-emerald-400",
  freemium: "bg-indigo-500/10 text-indigo-400",
  paid: "bg-purple-500/10 text-purple-400",
  "open-source": "bg-cyan-500/10 text-cyan-400",
};

const pricingLabels: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open Source",
};

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-[#111827] p-6 transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#161f32] hover:shadow-xl hover:shadow-indigo-500/5"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
          {tool.name}
        </h3>
        <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${pricingStyles[tool.pricing]}`}>
          {pricingLabels[tool.pricing]}
        </span>
      </div>

      {/* Score */}
      <div className="mb-3 flex items-center gap-1.5">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        <span className="text-sm font-bold text-white">{tool.score}</span>
        <span className="text-xs text-slate-500">/10</span>
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">
        {tool.description}
      </p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-xs text-slate-500">
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1 text-sm font-semibold text-indigo-400 transition-all group-hover:gap-2">
        Karşılaştırmayı Gör <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
