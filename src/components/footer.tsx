import Link from "next/link";
import { Terminal, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-[#00f0ff]/15 bg-[#05080f]/90 backdrop-blur-md">
      {/* Neon divider glow */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#00f0ff]/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-1 text-lg font-black">
              <Terminal className="h-4 w-4 text-[#00f0ff] drop-shadow-[0_0_6px_#00f0ff]" />
              <span className="holo-text">Dev</span>
              <span className="text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff]">Op</span>
              <span className="text-white">Self</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              DevOps, AI ve Software araçlarını keşfet, karşılaştır ve doğru tooling kararını ver.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="rounded-lg border border-[#00f0ff]/10 bg-[#00f0ff]/5 p-2 text-slate-500 transition-all duration-300 hover:border-[#00f0ff]/30 hover:text-[#00f0ff] hover:shadow-[0_0_12px_#00f0ff20]"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-lg border border-[#bf5af2]/10 bg-[#bf5af2]/5 p-2 text-slate-500 transition-all duration-300 hover:border-[#bf5af2]/30 hover:text-[#bf5af2] hover:shadow-[0_0_12px_#bf5af220]"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-lg border border-[#ff2d55]/10 bg-[#ff2d55]/5 p-2 text-slate-500 transition-all duration-300 hover:border-[#ff2d55]/30 hover:text-[#ff2d55] hover:shadow-[0_0_12px_#ff2d5520]"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#00f0ff] drop-shadow-[0_0_4px_#00f0ff60]">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/tools" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">Tool Karşılaştırma</Link></li>
              <li><Link href="/blog" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">Blog</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#00f0ff]">Kategoriler</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#bf5af2] drop-shadow-[0_0_4px_#bf5af260]">Kategoriler</h4>
            <ul className="space-y-2">
              <li><Link href="/categories" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#bf5af2]">AI in DevOps</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#bf5af2]">DevSecOps</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#bf5af2]">Platform Engineering</Link></li>
              <li><Link href="/categories" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#bf5af2]">Observability</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-[#ff2d55] drop-shadow-[0_0_4px_#ff2d5560]">Şirket</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#ff2d55]">Hakkımızda</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-500 transition-colors duration-300 hover:text-[#ff2d55]">İletişim</Link></li>
            </ul>
          </div>
        </div>

        {/* Terminal-style copyright */}
        <div className="mt-10 border-t border-[#00f0ff]/10 pt-6 text-center">
          <p className="font-mono text-xs text-slate-600">
            <span className="text-[#00f0ff]/50">$</span> echo &copy; 2026 DevOpSelf <span className="text-slate-700">|</span> DevOps ecosystem discovery &amp; comparison platform <span className="inline-block h-3.5 w-1.5 animate-pulse bg-[#00f0ff]/40" />
          </p>
        </div>
      </div>
    </footer>
  );
}
