"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { locales, localeNames, localeFlags, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // Replace current locale in path
  function getLocalePath(targetLocale: string) {
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-[#00f0ff]/10 bg-[#00f0ff]/5 px-2.5 py-1.5 text-sm text-slate-400 transition-all duration-300 hover:border-[#00f0ff]/30 hover:text-[#00f0ff] hover:shadow-[0_0_12px_#00f0ff20]"
        aria-label="Dil Secimi"
      >
        <Globe className="h-4 w-4" />
        <span>{localeFlags[locale as Locale]}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-[#00f0ff]/15 bg-[#0a0f1c]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,240,255,0.1)]">
          {locales.map((l) => (
            <Link
              key={l}
              href={getLocalePath(l)}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-200 ${
                l === locale
                  ? "bg-[#00f0ff]/10 text-[#00f0ff]"
                  : "text-slate-400 hover:bg-[#00f0ff]/5 hover:text-[#00f0ff]"
              }`}
            >
              <span>{localeFlags[l]}</span>
              <span>{localeNames[l]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
