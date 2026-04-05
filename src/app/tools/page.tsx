import type { Metadata } from "next";
import { ToolCard } from "@/components/tool-card";
import { Newsletter } from "@/components/newsletter";
import { AdSlot } from "@/components/ad-slot";
import { tools } from "@/lib/data";

export const metadata: Metadata = { title: "Tool Karşılaştırma" };

export default function ToolsPage() {
  const half = Math.ceil(tools.length / 2);

  return (
    <>
      <section className="border-b border-[#00f0ff]/10">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <h1 className="neon-glow text-4xl font-black">Tool Karşılaştırmaları</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            DevOps, AI ve Software araçlarının detaylı, bağımsız ve tarafsız karşılaştırmaları.
          </p>
        </div>
      </section>

      {/* Ad: Top banner */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, half).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>

        {/* Ad: Between cards */}
        <div className="py-8">
          <AdSlot size="banner" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.slice(half).map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      <section className="border-t border-[#00f0ff]/10">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
