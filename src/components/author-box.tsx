import Link from "next/link";
import { Github, ArrowRight } from "lucide-react";

interface AuthorBoxProps {
  name: string;
  role: string;
  bio: string;
  githubUrl?: string;
  aboutLabel: string;
  locale: string;
  ctaLabel?: string;
}

export function AuthorBox({
  name,
  role,
  bio,
  githubUrl,
  aboutLabel,
  locale,
  ctaLabel,
}: AuthorBoxProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();

  return (
    <aside className="holo-card my-12 rounded-2xl p-6 sm:p-7">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-[#00f0ff]/70">
        {aboutLabel}
      </div>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 font-mono text-sm font-bold text-[#00f0ff]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-white">{name}</div>
          <div className="mb-3 font-mono text-xs text-slate-500">{role}</div>
          <p className="text-sm leading-relaxed text-slate-400">{bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-3 py-1.5 text-xs font-semibold text-[#00f0ff] transition-all hover:border-[#00f0ff]/40"
            >
              {ctaLabel || "→"} <ArrowRight className="h-3 w-3" />
            </Link>
            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-400 transition-all hover:border-[#00f0ff]/30 hover:text-[#00f0ff]"
              >
                <Github className="h-3 w-3" /> GitHub
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
