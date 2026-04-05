import type { Metadata } from "next";
import { Target, Eye, Lightbulb } from "lucide-react";

export const metadata: Metadata = { title: "Hakkımızda" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-black text-white">Hakkımızda</h1>

      <div className="mb-12 text-lg leading-relaxed text-slate-400">
        <p className="mb-4">
          DevOpSelf, DevOps, AI ve software engineering dünyasındaki araçları keşfetmeyi, karşılaştırmayı
          ve doğru tooling kararlarını vermeyi kolaylaştıran bağımsız bir platformdur.
        </p>
        <p>
          Amacımız, developer ve operasyon ekiplerinin kendi kendine yetebileceği, doğru bilgiye hızla
          ulaşabileceği bir kaynak merkezi oluşturmaktır. &quot;DevOp<em>Self</em>&quot; ismi de bu
          felsefeden geliyor: kendi kendine yeten DevOps.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Target, title: "Misyon", desc: "DevOps tool seçim sürecini veriye dayalı, tarafsız ve erişilebilir kılmak." },
          { icon: Eye, title: "Vizyon", desc: "Dünyanın en kapsamlı DevOps ve AI tool karşılaştırma platformu olmak." },
          { icon: Lightbulb, title: "Değerler", desc: "Tarafsızlık, şeffaflık, topluluk odaklılık ve sürekli öğrenme." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6">
            <item.icon className="mb-4 h-8 w-8 text-indigo-400" />
            <h3 className="mb-2 font-bold text-white">{item.title}</h3>
            <p className="text-sm text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
