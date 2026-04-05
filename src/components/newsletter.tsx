"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#111827] to-[#0f172a] p-8 sm:p-12">
      {/* Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
          <Mail className="h-6 w-6 text-indigo-400" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">Haftalık DevOps Bülteni</h3>
        <p className="mb-6 text-sm text-slate-400">
          Yeni tool incelemeleri, karşılaştırmalar ve DevOps trendleri haftada bir kutuna gelsin.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 p-4 text-emerald-400">
            <Check className="h-5 w-5" />
            <span className="font-semibold">Kayıt başarılı! Erken erişim listesine eklendiniz.</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="mx-auto flex max-w-md overflow-hidden rounded-xl border border-white/[0.08] bg-black/30"
          >
            <input
              type="email"
              placeholder="E-posta adresiniz"
              required
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Abone Ol
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
