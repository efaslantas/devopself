import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevOpSelf - AI ile Akıllı ve Güvenli DevOps",
    template: "%s | DevOpSelf",
  },
  description: "DevOps, AI ve Software araçlarını keşfet, karşılaştır ve doğru tooling kararını ver. CI/CD, Monitoring, IaC, Container, Security ve daha fazlası.",
  keywords: ["devops", "ai", "tools", "ci/cd", "monitoring", "kubernetes", "terraform", "devsecops"],
  openGraph: {
    title: "DevOpSelf - AI ile Akıllı ve Güvenli DevOps",
    description: "DevOps araçlarını keşfet, karşılaştır ve doğru tooling kararını ver.",
    url: "https://devopself.com",
    siteName: "DevOpSelf",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <body className="scanline min-h-screen bg-[#05080f] antialiased">
        <div className="grid-bg pointer-events-none fixed inset-0 z-0" />
        <div className="relative z-10">
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
