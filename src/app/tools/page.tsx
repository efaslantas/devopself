import type { Metadata } from "next";
import { ToolCard } from "@/components/tool-card";
import { Newsletter } from "@/components/newsletter";
import { tools } from "@/lib/data";

export const metadata: Metadata = { title: "Tool Karşılaştırma" };

export default function ToolsPage() {
  return (
    <>
      <section className="border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-white">Tool Karşılaştırmaları</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            DevOps, AI ve Software araçlarının detaylı, bağımsız ve tarafsız karşılaştırmaları.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
      <section className="border-t border-white/[0.04] bg-[#0a0e17]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
