import Link from "next/link";
import { Home, Search, BookOpen, Wrench, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <html lang="tr" className="dark">
      <body className="scanline min-h-screen bg-[#05080f] antialiased">
        <div className="grid-bg pointer-events-none fixed inset-0 z-0" />
        <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-4 py-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-[#00f0ff]" />
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-[#00f0ff]">
              404 · Page Not Found
            </span>
          </div>

          <h1 className="glitch mb-4 text-7xl sm:text-9xl font-black text-white" data-text="404">
            404
          </h1>

          <p className="mb-2 text-xl sm:text-2xl font-bold text-white">
            Aradığınız sayfa bulunamadı
          </p>
          <p className="mb-10 max-w-xl text-sm text-slate-400 leading-relaxed">
            URL yanlış yazılmış olabilir, sayfa kaldırılmış olabilir ya da hiç var
            olmamış olabilir. Aşağıdaki bağlantılarla arayışınıza devam edebilirsiniz.
          </p>

          <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
            <Link
              href="/tr"
              className="holo-card group flex items-center gap-3 rounded-2xl p-5 text-left transition-all hover:border-[#00f0ff]/30"
            >
              <Home className="h-5 w-5 flex-shrink-0 text-[#00f0ff]" />
              <div>
                <div className="font-bold text-white">Ana Sayfa</div>
                <div className="text-xs text-slate-500">DevOpSelf'in başlangıç noktası</div>
              </div>
            </Link>
            <Link
              href="/tr/tools"
              className="holo-card group flex items-center gap-3 rounded-2xl p-5 text-left transition-all hover:border-[#00f0ff]/30"
            >
              <Wrench className="h-5 w-5 flex-shrink-0 text-[#67e8f9]" />
              <div>
                <div className="font-bold text-white">Araçlar</div>
                <div className="text-xs text-slate-500">65+ DevOps & AI aracı</div>
              </div>
            </Link>
            <Link
              href="/tr/blog"
              className="holo-card group flex items-center gap-3 rounded-2xl p-5 text-left transition-all hover:border-[#00f0ff]/30"
            >
              <BookOpen className="h-5 w-5 flex-shrink-0 text-[#00f0ff]" />
              <div>
                <div className="font-bold text-white">Blog</div>
                <div className="text-xs text-slate-500">DevOps rehberleri ve karşılaştırmalar</div>
              </div>
            </Link>
            <Link
              href="/tr/categories"
              className="holo-card group flex items-center gap-3 rounded-2xl p-5 text-left transition-all hover:border-[#00f0ff]/30"
            >
              <Search className="h-5 w-5 flex-shrink-0 text-[#94a3b8]" />
              <div>
                <div className="font-bold text-white">Kategoriler</div>
                <div className="text-xs text-slate-500">Konuya göre keşif</div>
              </div>
            </Link>
          </div>

          <p className="mt-10 font-mono text-xs text-slate-600">
            <span className="text-[#00f0ff]/50">$</span> echo "lost in the cluster"
            <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-[#00f0ff]/40" />
          </p>
        </main>
      </body>
    </html>
  );
}
