import Link from "next/link";
import { Terminal, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#060912]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-1 text-lg font-black">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-indigo-400">Dev</span>
              <span className="text-emerald-400">Op</span>
              <span className="text-white">Self</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              DevOps, AI ve Software araçlarını keşfet, karşılaştır ve doğru tooling kararını ver.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-lg border border-white/[0.06] p-2 text-slate-500 transition-colors hover:border-white/[0.12] hover:text-white" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg border border-white/[0.06] p-2 text-slate-500 transition-colors hover:border-white/[0.12] hover:text-white" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg border border-white/[0.06] p-2 text-slate-500 transition-colors hover:border-white/[0.12] hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/tools" className="text-sm text-slate-500 hover:text-slate-300">Tool Karşılaştırma</Link></li>
              <li><Link href="/blog" className="text-sm text-slate-500 hover:text-slate-300">Blog</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-500 hover:text-slate-300">Kategoriler</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Kategoriler</h4>
            <ul className="space-y-2">
              <li><Link href="/categories" className="text-sm text-slate-500 hover:text-slate-300">AI in DevOps</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-500 hover:text-slate-300">DevSecOps</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-500 hover:text-slate-300">Platform Engineering</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-500 hover:text-slate-300">Observability</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Şirket</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-slate-500 hover:text-slate-300">Hakkımızda</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 hover:text-slate-300">İletişim</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.04] pt-6 text-center text-xs text-slate-600">
          &copy; 2026 DevOpSelf. DevOps ecosystem discovery &amp; comparison platform.
        </div>
      </div>
    </footer>
  );
}
