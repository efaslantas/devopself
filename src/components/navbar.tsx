"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Terminal } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";

export function Navbar({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}/tools`, label: "Tool Karşılaştırma" },
    { href: `/${locale}/blog`, label: "Blog" },
    { href: `/${locale}/categories`, label: "Kategoriler" },
    { href: `/${locale}/about`, label: "Hakkımızda" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#00f0ff]/20 bg-[#05080f]/80 backdrop-blur-xl">
      {/* Scanline overlay */}
      <div className="scanline pointer-events-none absolute inset-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="group flex items-center gap-1.5 text-xl font-black tracking-tight">
            <Terminal className="h-5 w-5 text-[#00f0ff] drop-shadow-[0_0_6px_#00f0ff]" />
            <span className="holo-text" data-text="Dev">Dev</span>
            <span className="text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]">Op</span>
            <span className="text-white">Self</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-sm font-medium text-slate-400 transition-all duration-300 hover:text-[#00f0ff] hover:drop-shadow-[0_0_8px_#00f0ff]"
              >
                {l.label}
              </Link>
            ))}
            <button
              className="rounded-lg border border-[#00f0ff]/10 bg-[#00f0ff]/5 p-2 text-slate-400 transition-all duration-300 hover:border-[#00f0ff]/30 hover:text-[#00f0ff] hover:shadow-[0_0_12px_#00f0ff20]"
              aria-label="Ara"
            >
              <Search className="h-4 w-4" />
            </button>
            <LanguageSwitcher locale={locale} />
            <Link
              href={`/${locale}/contact`}
              className="neon-border rounded-lg bg-[#00f0ff]/10 px-4 py-2 text-sm font-semibold text-[#00f0ff] transition-all duration-300 hover:bg-[#00f0ff]/20 hover:shadow-[0_0_20px_#00f0ff30]"
            >
              İletişim
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-lg border border-[#00f0ff]/10 p-2 text-slate-400 transition-all duration-300 hover:border-[#00f0ff]/30 hover:text-[#00f0ff] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? (
              <X className="h-5 w-5 drop-shadow-[0_0_4px_#00f0ff]" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#00f0ff]/10 bg-[#05080f]/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-[#00f0ff]/5 hover:text-[#00f0ff]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-lg border border-[#00f0ff]/20 bg-[#00f0ff]/10 px-3 py-2.5 text-center text-sm font-semibold text-[#00f0ff]"
            >
              İletişim
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
