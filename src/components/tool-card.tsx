import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Tool } from "@/lib/data";

const pricingStyles: Record<string, string> = {
  free: "border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]",
  freemium: "border-[#67e8f9]/30 bg-[#67e8f9]/10 text-[#67e8f9]",
  paid: "border-[#94a3b8]/30 bg-[#94a3b8]/10 text-[#94a3b8]",
  "open-source": "border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]",
};

const pricingLabels: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "Open Source",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const scoreColor = "text-[#00f0ff] drop-shadow-[0_0_6px_#00f0ff]";

  const scoreBarColor = "bg-[#00f0ff]";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="holo-card group relative flex flex-col rounded-2xl border border-[#00f0ff]/10 bg-[#0a0f1c]/80 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#00f0ff]/30 hover:shadow-[0_0_30px_#00f0ff15]"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-[#00f0ff] group-hover:drop-shadow-[0_0_8px_#00f0ff60]">
          {tool.name}
        </h3>
        <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold ${pricingStyles[tool.pricing]}`}>
          {pricingLabels[tool.pricing]}
        </span>
      </div>

      {/* Score - neon indicator */}
      <div className="mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 fill-[#00f0ff] text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]" />
        <span className={`text-sm font-bold ${scoreColor}`}>{tool.score}</span>
        <span className="text-xs text-slate-600">/10</span>
        {/* Score bar */}
        <div className="ml-auto h-1 w-16 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full ${scoreBarColor} shadow-[0_0_6px_currentColor]`}
            style={{ width: `${tool.score * 10}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">
        {tool.description}
      </p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[#00f0ff]/10 bg-[#00f0ff]/5 px-2 py-0.5 font-mono text-xs text-slate-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1 text-sm font-semibold text-[#00f0ff] transition-all duration-300 group-hover:gap-2 group-hover:drop-shadow-[0_0_8px_#00f0ff]">
        Karşılaştırmayı Gör <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
