import type { Metadata } from "next";
import { Target, Eye, Lightbulb } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { locales, type Locale, getDictionary } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: dict.about.pageTitle };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const cards = [
    { icon: Target, title: dict.about.mission, desc: dict.about.missionDesc, color: "#00f0ff" },
    { icon: Eye, title: dict.about.vision, desc: dict.about.visionDesc, color: "#67e8f9" },
    { icon: Lightbulb, title: dict.about.values, desc: dict.about.valuesDesc, color: "#00f0ff" },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="glitch mb-6 text-4xl font-black text-white" data-text={dict.about.pageTitle}>{dict.about.pageTitle}</h1>

      <div className="holo-card mb-12 rounded-2xl p-8 text-lg leading-relaxed text-slate-400">
        <p className="mb-4">
          {dict.about.intro1}
        </p>
        <p>
          {dict.about.intro2}
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
