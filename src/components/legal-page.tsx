import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";

type Section = { heading: string; body: string };

interface LegalPageProps {
  title: string;
  intro: string;
  sections: Section[];
  lastUpdatedLabel: string;
  effectiveDate: string;
  contactPrompt: string;
  contactEmail: string;
  locale: string;
}

function renderParagraph(line: string) {
  // Inline **bold** support
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, bi) => {
    const lines = block.split("\n");
    const isBulletList = lines.every((l) => l.trim().startsWith("- "));
    if (isBulletList) {
      return (
        <ul key={bi} className="list-disc space-y-2 pl-6 text-slate-400">
          {lines.map((l, li) => (
            <li key={li}>{renderParagraph(l.trim().replace(/^- /, ""))}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={bi} className="text-slate-400">
        {lines.map((l, li) => (
          <span key={li}>
            {renderParagraph(l)}
            {li < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  });
}

export function LegalPage({
  title,
  intro,
  sections,
  lastUpdatedLabel,
  effectiveDate,
  contactPrompt,
  contactEmail,
}: LegalPageProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/15 bg-[#00f0ff]/5 px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#00f0ff]" />
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#00f0ff]">
            Legal
          </span>
        </div>
        <h1
          className="glitch mb-4 text-4xl font-black text-white"
          data-text={title}
        >
          {title}
        </h1>
        <p className="font-mono text-xs text-slate-500">
          {lastUpdatedLabel}: <span className="text-[#00f0ff]">{effectiveDate}</span>
        </p>
      </div>

      <div className="holo-card mb-10 rounded-2xl p-6 text-base leading-relaxed text-slate-300">
        {intro}
      </div>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <article key={i} className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6">
            <h2 className="mb-3 text-lg font-bold text-white">{section.heading}</h2>
            <div className="space-y-3 leading-relaxed">{renderBody(section.body)}</div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-[#00f0ff]/15 bg-[#00f0ff]/[0.03] p-6">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#00f0ff]" />
          <div className="text-sm text-slate-300">
            <p className="mb-1">{contactPrompt}:</p>
            <Link
              href={`mailto:${contactEmail}`}
              className="font-mono text-[#00f0ff] hover:underline"
            >
              {contactEmail}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
