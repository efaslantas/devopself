"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Terminal } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/tools", label: "Tool Karşılaştırma" },
    { href: "/blog", label: "Blog" },
    { href: "/categories", label: "Kategoriler" },
    { href: "/about", label: "Hakkımızda" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080b14]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 text-xl font-black tracking-tight">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <span className="text-indigo-400">Dev</span>
            <span className="text-emerald-400">Op</span>
            <span className="text-white">Self</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
            <button className="rounded-lg bg-white/[0.04] p-2 text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-white" aria-label="Ara">
              <Search className="h-4 w-4" />
            </button>
            <Link href="/contact" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20">
              İletişim
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="rounded-lg p-2 text-slate-400 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/[0.06] bg-[#080b14]/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white">
                {l.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 block rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-sm font-semibold text-white">
              İletişim
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
