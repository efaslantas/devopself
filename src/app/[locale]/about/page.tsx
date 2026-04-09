import type { Metadata } from "next";
import { Target, Eye, Lightbulb } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = { title: "Hakkımızda" };

const cards = [
  { icon: Target, title: "Misyon", desc: "DevOps tool seçim sürecini veriye dayalı, tarafsız ve erişilebilir kılmak.", color: "#00f0ff" },
  { icon: Eye, title: "Vizyon", desc: "Dünyanın en kapsamlı DevOps ve AI tool karşılaştırma platformu olmak.", color: "#67e8f9" },
  { icon: Lightbulb, title: "Değerler", desc: "Tarafsızlık, şeffaflık, topluluk odaklılık ve sürekli öğrenme.", color: "#00f0ff" },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="glitch mb-6 text-4xl font-black text-white" data-text="Hakkımızda">Hakkımızda</h1>

      <div className="holo-card mb-12 rounded-2xl p-8 text-lg leading-relaxed text-slate-400">
        <p className="mb-4">
          DevOpSelf, DevOps, AI ve software engineering dünyasındaki araçları keşfetmeyi, karşılaştırmayı
          ve doğru tooling kararlarını vermeyi kolaylaştıran bağımsız bir platformdur.
        </p>
        <p>
          Amacımız, developer ve operasyon ekiplerinin kendi kendine yetebileceği, doğru bilgiye hızla
          ulaşabileceği bir kaynak merkezi oluşturmaktır. &quot;DevOp<em className="text-[#00f0ff]">Self</em>&quot; ismi de bu
          felsefeden geliyor: kendi kendine yeten DevOps.
        </p>
      </div>

      {/* Ad */}
      <div className="mb-12">
        <AdSlot size="banner" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:scale-[1.02]"
            style={{ borderColor: `${item.color}20`, boxShadow: `inset 0 1px 0 ${item.color}10` }}
          >
            <item.icon
              className="mb-4 h-8 w-8"
              style={{ color: item.color, filter: `drop-shadow(0 0 8px ${item.color}60)` }}
            />
            <h3 className="mb-2 font-bold text-white">{item.title}</h3>
            <p className="text-sm text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Ad */}
      <div className="mt-12">
        <AdSlot size="sidebar" />
      </div>
    </section>
  );
}
