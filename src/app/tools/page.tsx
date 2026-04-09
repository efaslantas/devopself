"use client";

import { useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { Newsletter } from "@/components/newsletter";
import { AdSlot } from "@/components/ad-slot";
import { tools, categories } from "@/lib/data";

export default function ToolsPage() {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? tools : tools.filter((t) => t.category === active);

  return (
    <>
      <section className="border-b border-[#00f0ff]/10">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:px-8">
          <h1 className="neon-glow text-4xl font-black">Tool Karşılaştırma</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            {filtered.length} aracın detaylı, bağımsız ve tarafsız karşılaştırmaları.
          </p>

          {/* Category filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActive("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${active === "all" ? "bg-[#00f0ff] text-[#05080f] shadow-[0_0_15px_#00f0ff40]" : "border border-white/10 text-slate-400 hover:border-[#00f0ff]/30 hover:text-[#00f0ff]"}`}
            >
              Tümü ({tools.length})
            </button>
            {categories.map((cat) => {
              const count = tools.filter((t) => t.category === cat.slug).length;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActive(cat.slug)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${active === cat.slug ? "bg-[#00f0ff] text-[#05080f] shadow-[0_0_15px_#00f0ff40]" : "border border-white/10 text-slate-400 hover:border-[#00f0ff]/30 hover:text-[#00f0ff]"}`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (<ToolCard key={t.slug} tool={t} />))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-500">Bu kategoride araç bulunamadı.</div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdSlot size="banner" />
      </div>

      <section className="border-t border-[#00f0ff]/10">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
