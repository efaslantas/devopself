import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Shield, Layers, Users, GitBranch, Activity, ArrowRight } from "lucide-react";
import { categories } from "@/lib/data";

export const metadata: Metadata = { title: "Kategoriler" };

const iconMap: Record<string, typeof Brain> = {
  brain: Brain, shield: Shield, layers: Layers, users: Users,
  "git-branch": GitBranch, activity: Activity,
};

export default function CategoriesPage() {
  return (
    <>
      <section className="border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white">Kategoriler</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            İlgi alanına göre DevOps, AI ve software içeriklerini keşfet.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Layers;
            return (
              <div key={cat.slug} className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 transition-all hover:border-indigo-500/20 hover:bg-white/[0.04]">
                <Icon className="mb-4 h-8 w-8 text-indigo-400" />
                <h3 className="mb-2 text-xl font-bold text-white">{cat.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-400">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">{cat.count} yazı</span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-indigo-400 group-hover:gap-2 transition-all">
                    Keşfet <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
