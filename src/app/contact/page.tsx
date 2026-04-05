"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Check } from "lucide-react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="mb-3 text-4xl font-black text-white">İletişim</h1>
      <p className="mb-10 text-lg text-slate-400">
        Soru, öneri veya iş birliği için bize ulaşın.
      </p>

      {sent ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-8 text-center">
          <Check className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
          <h3 className="mb-2 text-xl font-bold text-white">Mesajınız Alındı!</h3>
          <p className="text-slate-400">En kısa sürede size döneceğiz.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="space-y-5"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-300">İsim</label>
            <input
              id="name" type="text" required
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">E-posta</label>
            <input
              id="email" type="email" required
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              placeholder="örnek@email.com"
            />
          </div>
          <div>
            <label htmlFor="msg" className="mb-1.5 block text-sm font-medium text-slate-300">Mesaj</label>
            <textarea
              id="msg" rows={5} required
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              placeholder="Mesajınızı yazın..."
            />
          </div>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500">
            <Send className="h-4 w-4" /> Gönder
          </button>
        </form>
      )}
    </section>
  );
}
