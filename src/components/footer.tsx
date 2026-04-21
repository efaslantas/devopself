import Link from "next/link";
import { Github, Mail } from "lucide-react";
import trDict from "@/lib/dictionaries/tr.json";
import enDict from "@/lib/dictionaries/en.json";
import ruDict from "@/lib/dictionaries/ru.json";

const dicts = { tr: trDict, en: enDict, ru: ruDict };

const SOCIAL_LINKS = [
  { href: "https://github.com/efaslantas", icon: Github, label: "GitHub" },
  { href: "mailto:emreferitaslantas@gmail.com", icon: Mail, label: "Email" },
];

export function Footer({ locale }: { locale: string }) {
  const dict = dicts[locale as keyof typeof dicts] || trDict;

  return (
    <footer className="relative border-t border-[#00f0ff]/15 bg-[#05080f]/90 backdrop-blur-md">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#00f0ff]/5 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 text-lg font-black">
              <img src="/logo.jpg" alt="DevOpSelf" className="h-7 w-7 rounded-lg object-cover" style={{ filter: "drop-shadow(0 0 6px #00f0ff60)" }} />
              <span className="holo-text">Dev</span>
              <span className="text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]">Op</span>
              <span className="text-white">Self</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">{dict.footer.description}</p>
            <div className="mt-4 flex gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener" : undefined}
                  className="rounded-lg border border-[#00f0ff]/10 bg-[#00f0ff]/5 p-2 text-slate-500 transition-all duration-300 hover:border-[#00f0ff]/30 hover:text-[#00f0ff] hover:shadow-[0_0_12px_#00f0ff20]"
                  aria-label={s.label}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff60]">{dict.footer.platform}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/tools`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.nav.tools}</Link></li>
              <li><Link href={`/${locale}/blog`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.nav.blog}</Link></li>
              <li><Link href={`/${locale}/categories`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.nav.categories}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#67e8f9] drop-shadow-[0_0_4px_#67e8f960]">{dict.footer.categories}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/categories/ai-ml`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#67e8f9]">AI &amp; ML Tools</Link></li>
              <li><Link href={`/${locale}/categories/security`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#67e8f9]">DevSecOps</Link></li>
              <li><Link href={`/${locale}/categories/container`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#67e8f9]">Platform Engineering</Link></li>
              <li><Link href={`/${locale}/categories/monitoring`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#67e8f9]">Observability</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#94a3b8] drop-shadow-[0_0_4px_#94a3b860]">{dict.footer.company}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/about`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.nav.about}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.nav.contact}</Link></li>
            </ul>
            <h4 className="mt-5 mb-3 text-sm font-semibold text-[#94a3b8] drop-shadow-[0_0_4px_#94a3b860]">{dict.footer.legal}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/privacy`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.legal.privacy.title}</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.legal.terms.title}</Link></li>
              <li><Link href={`/${locale}/cookies`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.legal.cookies.title}</Link></li>
              <li><Link href={`/${locale}/disclaimer`} className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">{dict.legal.disclaimer.title}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[#00f0ff]/10 pt-6 text-center">
          <p className="font-mono text-xs text-slate-600">
            <span className="text-[#00f0ff]/50">$</span> echo &copy; 2026 DevOpSelf <span className="text-slate-700">|</span> {dict.footer.copyright} <span className="inline-block h-3.5 w-1.5 animate-pulse bg-[#00f0ff]/40" />
          </p>
        </div>
      </div>
    </footer>
  );
}
