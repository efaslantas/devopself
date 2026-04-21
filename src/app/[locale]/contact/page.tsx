"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Mail, Send, Check, Clock, MapPin, Github } from "lucide-react";
import trDict from "@/lib/dictionaries/tr.json";
import enDict from "@/lib/dictionaries/en.json";
import ruDict from "@/lib/dictionaries/ru.json";

const dicts = { tr: trDict, en: enDict, ru: ruDict };

const CONTACT_EMAIL = "emreferitaslantas@gmail.com";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const locale = usePathname().split("/")[1] || "tr";
  const dict = dicts[locale as keyof typeof dicts] || trDict;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = form.subject || "DevOpSelf contact";
    const body = `${form.message}\n\n---\n${form.name}\n${form.email}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <h1
        className="glitch mb-3 text-4xl font-black text-white"
        data-text={dict.contact.pageTitle}
      >
        {dict.contact.pageTitle}
      </h1>
      <p className="mb-10 max-w-2xl text-base text-slate-400">{dict.contact.subtitle}</p>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Contact info column */}
        <aside className="lg:col-span-2 space-y-4">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="holo-card group flex items-start gap-3 rounded-2xl p-5 transition-all hover:border-[#00f0ff]/30"
          >
            <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00f0ff]" />
            <div className="min-w-0">
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">
                {dict.contact.directEmailLabel}
              </div>
              <div className="break-all font-mono text-sm text-[#00f0ff] group-hover:underline">
                {CONTACT_EMAIL}
              </div>
            </div>
          </a>

          <div className="holo-card flex items-start gap-3 rounded-2xl p-5">
            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#67e8f9]" />
            <div>
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">
                {dict.contact.responseTimeLabel}
              </div>
              <div className="text-sm text-slate-300">
                {dict.contact.responseTimeValue}
              </div>
            </div>
          </div>

          <div className="holo-card flex items-start gap-3 rounded-2xl p-5">
            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#94a3b8]" />
            <div>
              <div className="mb-1 text-xs font-mono uppercase tracking-wider text-slate-500">
                {dict.contact.locationLabel}
              </div>
              <div className="text-sm text-slate-300">{dict.contact.locationValue}</div>
            </div>
          </div>

          <Link
            href="https://github.com/efaslantas"
            target="_blank"
            rel="noopener"
            className="holo-card group flex items-center gap-3 rounded-2xl p-5 transition-all hover:border-[#00f0ff]/30"
          >
            <Github className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-[#00f0ff]" />
            <div className="font-mono text-sm text-slate-300 group-hover:text-[#00f0ff]">
              github.com/efaslantas
            </div>
          </Link>
        </aside>

        {/* Form column */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="rounded-2xl border border-[#00f0ff]/20 bg-[#00f0ff]/[0.05] p-8 text-center backdrop-blur-sm">
              <Check
                className="mx-auto mb-4 h-12 w-12 text-[#00f0ff]"
                style={{ filter: "drop-shadow(0 0 12px #00f0ff60)" }}
              />
              <h3 className="mb-2 text-xl font-bold text-white">
                {dict.contact.successTitle}
              </h3>
              <p className="text-slate-400">{dict.contact.successDesc}</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-2 text-sm font-semibold text-[#00f0ff] transition-all hover:bg-[#00f0ff]/20"
              >
                <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="holo-card space-y-5 rounded-2xl p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    {dict.contact.nameLabel}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50"
                    placeholder={dict.contact.namePlaceholder}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    {dict.contact.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50"
                    placeholder={dict.contact.emailPlaceholder}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  {dict.contact.subjectLabel}
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50"
                  placeholder={dict.contact.subjectPlaceholder}
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  {dict.contact.messageLabel}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50"
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
              <p className="text-center text-xs text-slate-500">
                {dict.contact.formDisclaimer}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
