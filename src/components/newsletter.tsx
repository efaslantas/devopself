"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import trDict from "@/lib/dictionaries/tr.json";
import enDict from "@/lib/dictionaries/en.json";
import ruDict from "@/lib/dictionaries/ru.json";

const dicts = { tr: trDict, en: enDict, ru: ruDict };

const NEWSLETTER_EMAIL = "emreferitaslantas@gmail.com";

export function Newsletter({ locale = "tr" }: { locale?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const dict = dicts[locale as keyof typeof dicts] || trDict;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subject = "Newsletter subscription — DevOpSelf";
    const body = `DevOpSelf bültenine abone olmak istiyorum.\n\nE-posta: ${email}`;
    window.location.href = `mailto:${NEWSLETTER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <section className="holo-card relative overflow-hidden rounded-2xl border border-[#00f0ff]/15 bg-[#0a0f1c]/80 p-8 backdrop-blur-sm sm:p-12">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-[#00f0ff]/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 right-0 h-32 w-64 rounded-full bg-[#67e8f9]/8 blur-3xl" />
      <div className="scanline pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#00f0ff]/20 bg-[#00f0ff]/10 shadow-[0_0_20px_#00f0ff15]">
          <Mail className="h-6 w-6 text-[#00f0ff] drop-shadow-[0_0_6px_#00f0ff]" />
        </div>
        <h3 className="neon-glow mb-2 text-2xl font-bold text-[#00f0ff]">{dict.newsletter.title}</h3>
        <p className="mb-6 text-sm text-slate-400">{dict.newsletter.description}</p>
        {submitted ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#00f0ff]/20 bg-[#00f0ff]/10 p-4 text-[#00f0ff] shadow-[0_0_20px_#00f0ff15]">
            <Check className="h-5 w-5 drop-shadow-[0_0_4px_#00f0ff]" />
            <span className="font-semibold">{dict.newsletter.success}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md overflow-hidden rounded-xl border border-[#00f0ff]/15 bg-[#05080f]/60 backdrop-blur-sm transition-all duration-300 focus-within:border-[#00f0ff]/40 focus-within:shadow-[0_0_20px_#00f0ff15]">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={dict.newsletter.placeholder} required className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none" />
            <button type="submit" className="neon-border bg-[#00f0ff]/15 px-6 py-3 text-sm font-semibold text-[#00f0ff] transition-all duration-300 hover:bg-[#00f0ff]/25 hover:shadow-[0_0_20px_#00f0ff30]">{dict.newsletter.subscribe}</button>
          </form>
        )}
      </div>
    </section>
  );
}
