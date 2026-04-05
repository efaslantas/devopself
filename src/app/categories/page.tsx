import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Shield, Layers, Users, GitBranch, Activity, ArrowRight } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { categories } from "@/lib/data";

export const metadata: Metadata = { title: "Kategoriler" };

const iconMap: Record<string, typeof Brain> = {
  brain: Brain, shield: Shield, layers: Layers, users: Users,
  "git-branch": GitBranch, activity: Activity,
};

const neonAccents = ["#00f0ff", "#67e8f9", "#00f0ff", "#67e8f9", "#00f0ff", "#67e8f9"];

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

      {/* Ad: Top */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="leaderboard" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Layers;
            const accent = neonAccents[i % neonAccents.length];
            return (
              <div
                key={cat.slug}
                className="group rounded-2xl border bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:scale-[1.02]"
                style={{
                  borderColor: `${accent}20`,
                  boxShadow: `inset 0 1px 0 ${accent}10`,
                }}
              >
                <Icon className="mb-4 h-8 w-8" style={{ color: accent, filter: `drop-shadow(0 0 8px ${accent}60)` }} />
                <h3 className="mb-2 text-xl font-bold text-white">{cat.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                  >
                    {cat.count} yazı
                  </span>
                  <span
                    className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
                    style={{ color: accent }}
                  >
                    Keşfet <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ad: Bottom */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>
    </>
  );
}
