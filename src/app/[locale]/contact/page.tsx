"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, MessageSquare, Send, Check } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import trDict from "@/lib/dictionaries/tr.json";
import enDict from "@/lib/dictionaries/en.json";
import ruDict from "@/lib/dictionaries/ru.json";

const dicts = { tr: trDict, en: enDict, ru: ruDict };

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const locale = usePathname().split("/")[1] || "tr";
  const dict = dicts[locale as keyof typeof dicts] || trDict;

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="glitch mb-3 text-4xl font-black text-white" data-text={dict.contact.pageTitle}>{dict.contact.pageTitle}</h1>
      <p className="mb-10 text-lg text-slate-400">
        {dict.contact.subtitle}
      </p>

      {sent ? (
        <div className="rounded-2xl border border-[#00f0ff]/20 bg-[#00f0ff]/[0.05] p-8 text-center backdrop-blur-sm">
          <Check className="mx-auto mb-4 h-12 w-12 text-[#00f0ff]" style={{ filter: "drop-shadow(0 0 12px #00f0ff60)" }} />
          <h3 className="mb-2 text-xl font-bold text-white">{dict.contact.successTitle}</h3>
          <p className="text-slate-400">{dict.contact.successDesc}</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="holo-card space-y-5 rounded-2xl p-8"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">{dict.contact.nameLabel}</label>
            <input
              id="name" type="text" required
              className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50 focus:shadow-[0_0_15px_#00f0ff20]"
              placeholder={dict.contact.namePlaceholder}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">{dict.contact.emailLabel}</label>
            <input
              id="email" type="email" required
              className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50 focus:shadow-[0_0_15px_#00f0ff20]"
              placeholder={dict.contact.emailPlaceholder}
            />
          </div>
          <div>
            <label htmlFor="msg" className="mb-1.5 block text-sm font-medium text-slate-300">{dict.contact.messageLabel}</label>
            <textarea
              id="msg" rows={5} required
              className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50 focus:shadow-[0_0_15px_#00f0ff20]"
              placeholder={dict.contact.messagePlaceholder}
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00f0ff]/10 py-3.5 text-sm font-semibold text-[#00f0ff] shadow-lg shadow-[#00f0ff]/10 transition-all hover:bg-[#00f0ff]/20 hover:shadow-xl hover:shadow-[#00f0ff]/20"
            style={{ border: "1px solid #00f0ff30" }}
          >
            <Send className="h-4 w-4" /> {dict.contact.send}
          </button>
        </form>
      )}

      {/* Ad */}
      <div className="mt-12">
        <AdSlot size="banner" />
      </div>
    </section>
  );
}
