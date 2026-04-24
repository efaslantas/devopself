import Link from "next/link";
import { Info } from "lucide-react";

interface AffiliateDisclosureProps {
  title: string;
  body: string;
  termsLabel: string;
  locale: string;
}

export function AffiliateDisclosure({
  title,
  body,
  termsLabel,
  locale,
}: AffiliateDisclosureProps) {
  return (
    <aside className="my-8 rounded-xl border border-[#94a3b8]/10 bg-[#94a3b8]/[0.03] p-5 text-sm">
      <div className="mb-2 flex items-center gap-2">
        <Info className="h-4 w-4 text-[#94a3b8]" />
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-slate-400">
          {title}
        </span>
      </div>
      <p className="leading-relaxed text-slate-400">
        {body}{" "}
        <Link
          href={`/${locale}/terms`}
          className="text-[#00f0ff] hover:underline"
        >
          {termsLabel}
        </Link>
      </p>
    </aside>
  );
}
