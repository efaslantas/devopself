import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Eye,
  Lightbulb,
  Search,
  Wrench,
  ShieldCheck,
  RefreshCw,
  Mail,
  ArrowRight,
  Github,
} from "lucide-react";
import { locales, type Locale, getDictionary } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.about.pageTitle,
    description: dict.about.intro1,
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const values = [
    { icon: Target, title: dict.about.mission, desc: dict.about.missionDesc, color: "#00f0ff" },
    { icon: Eye, title: dict.about.vision, desc: dict.about.visionDesc, color: "#67e8f9" },
    { icon: Lightbulb, title: dict.about.values, desc: dict.about.valuesDesc, color: "#00f0ff" },
  ];

  const editorialSteps = [
    { icon: Search, title: dict.about.editorial1Title, desc: dict.about.editorial1Desc },
    { icon: Wrench, title: dict.about.editorial2Title, desc: dict.about.editorial2Desc },
    { icon: ShieldCheck, title: dict.about.editorial3Title, desc: dict.about.editorial3Desc },
    { icon: RefreshCw, title: dict.about.editorial4Title, desc: dict.about.editorial4Desc },
  ];

  const stats = [
    { value: dict.about.statArticlesVal, label: dict.about.statArticles },
    { value: dict.about.statToolsVal, label: dict.about.statTools },
    { value: dict.about.statCategoriesVal, label: dict.about.statCategories },
    { value: dict.about.statLanguagesVal, label: dict.about.statLanguages },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/15 bg-[#00f0ff]/5 px-3 py-1">
        <span className="h-2 w-2 rounded-full bg-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]" />
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#00f0ff]">
          {dict.about.badge}
        </span>
      </div>

      <h1
        className="glitch mb-6 text-4xl sm:text-5xl font-black text-white"
        data-text={dict.about.pageTitle}
      >
        {dict.about.pageTitle}
      </h1>

      <div className="holo-card mb-12 rounded-2xl p-8 text-lg leading-relaxed text-slate-300">
        <p className="mb-4">{dict.about.intro1}</p>
        <p className="text-slate-400">{dict.about.intro2}</p>
      </div>

      <div className="mb-16 grid gap-4 sm:grid-cols-3">
        {values.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:scale-[1.01]"
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

      <section className="mb-16">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">
          {dict.about.statsTitle}
        </p>
        <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-white">
          {dict.about.statsTitle}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="holo-card rounded-2xl p-6 text-center"
            >
              <div className="font-mono text-3xl font-black text-[#00f0ff] drop-shadow-[0_0_8px_#00f0ff60]">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">
          {dict.about.founderTitle}
        </p>
        <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-white">
          {dict.about.founderTitle}
        </h2>
        <div className="holo-card rounded-2xl p-8">
          <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-white/5 pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 font-mono text-lg font-bold text-[#00f0ff]">
              EFA
            </div>
            <div>
              <div className="text-lg font-bold text-white">{dict.about.founderName}</div>
              <div className="font-mono text-xs text-slate-500">{dict.about.founderRole}</div>
            </div>
            <Link
              href="https://github.com/efaslantas"
              target="_blank"
              rel="noopener"
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#00f0ff]/15 bg-[#00f0ff]/5 px-3 py-1.5 text-xs text-[#00f0ff] transition-all hover:border-[#00f0ff]/40"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </Link>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>{dict.about.founderBio1}</p>
            <p>{dict.about.founderBio2}</p>
            <p className="text-slate-400">{dict.about.founderBio3}</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[3px] text-[#00f0ff]">
          {dict.about.editorialSubtitle}
        </p>
        <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-white">
          {dict.about.editorialTitle}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {editorialSteps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[#00f0ff]/20 bg-[#00f0ff]/5">
                <s.icon className="h-4 w-4 text-[#00f0ff]" />
              </div>
              <div className="mb-1 font-mono text-[10px] text-[#00f0ff]/60">
                0{i + 1}
              </div>
              <h3 className="mb-1.5 font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="holo-card rounded-2xl p-8 sm:p-10 text-center">
        <Mail className="mx-auto mb-4 h-8 w-8 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 8px #00f0ff60)" }} />
        <h2 className="mb-2 text-xl sm:text-2xl font-bold text-white">
          {dict.about.contactCtaTitle}
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-sm text-slate-400">
          {dict.about.contactCtaDesc}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-2 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-5 py-2.5 text-sm font-semibold text-[#00f0ff] shadow-lg shadow-[#00f0ff]/10 transition-all hover:bg-[#00f0ff]/20"
        >
          {dict.about.contactCtaBtn} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
