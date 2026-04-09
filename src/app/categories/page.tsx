import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Shield, Layers, Users, GitBranch, Activity, ArrowRight, Server, Cloud, Code, Database } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { categories, tools } from "@/lib/data";

export const metadata: Metadata = { title: "Kategoriler" };

const iconMap: Record<string, typeof Brain> = {
  brain: Brain, shield: Shield, layers: Layers, users: Users,
  "git-branch": GitBranch, activity: Activity, server: Server,
  cloud: Cloud, code: Code, database: Database,
};

export default function CategoriesPage() {
  return (
    <>
      <section className="border-b border-[#00f0ff]/10">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <h1 className="neon-glow text-4xl font-black">Kategoriler</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            İlgi alanına göre DevOps, AI ve software içeriklerini keşfet.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Layers;
            const toolCount = tools.filter((t) => t.category === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group rounded-2xl border border-[#00f0ff]/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-[#00f0ff]/25 hover:shadow-[0_0_30px_#00f0ff08]"
              >
                <Icon className="mb-4 h-8 w-8 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 8px #00f0ff60)" }} />
                <h3 className="mb-2 text-xl font-bold text-white group-hover:text-[#00f0ff] transition-colors">{cat.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[#00f0ff]/10 px-2.5 py-1 text-xs font-semibold text-[#00f0ff]">
                    {toolCount} araç
                  </span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-[#00f0ff] transition-all group-hover:gap-2">
                    Keşfet <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>
    </>
  );
}
