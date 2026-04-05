"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Check } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="glitch mb-3 text-4xl font-black text-white" data-text="İletişim">İletişim</h1>
      <p className="mb-10 text-lg text-slate-400">
        Soru, öneri veya iş birliği için bize ulaşın.
      </p>

      {sent ? (
        <div className="rounded-2xl border border-[#30d158]/20 bg-[#30d158]/[0.05] p-8 text-center backdrop-blur-sm">
          <Check className="mx-auto mb-4 h-12 w-12 text-[#30d158]" style={{ filter: "drop-shadow(0 0 12px #30d15860)" }} />
          <h3 className="mb-2 text-xl font-bold text-white">Mesajınız Alındı!</h3>
          <p className="text-slate-400">En kısa sürede size döneceğiz.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="holo-card space-y-5 rounded-2xl p-8"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">İsim</label>
            <input
              id="name" type="text" required
              className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50 focus:shadow-[0_0_15px_#00f0ff20]"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">E-posta</label>
            <input
              id="email" type="email" required
              className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50 focus:shadow-[0_0_15px_#00f0ff20]"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label htmlFor="msg" className="mb-1.5 block text-sm font-medium text-slate-300">Mesaj</label>
            <textarea
              id="msg" rows={5} required
              className="w-full rounded-xl border border-[#00f0ff]/10 bg-[#05080f]/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all focus:border-[#00f0ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00f0ff]/50 focus:shadow-[0_0_15px_#00f0ff20]"
              placeholder="Mesajınızı yazın..."
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00f0ff]/10 py-3.5 text-sm font-semibold text-[#00f0ff] shadow-lg shadow-[#00f0ff]/10 transition-all hover:bg-[#00f0ff]/20 hover:shadow-xl hover:shadow-[#00f0ff]/20"
            style={{ border: "1px solid #00f0ff30" }}
          >
            <Send className="h-4 w-4" /> Gönder
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
