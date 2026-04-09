import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevOpSelf - DevOps, AI & Software Tool Karşılaştırma Platformu",
    template: "%s | DevOpSelf",
  },
  description: "DevOps, AI ve Software araçlarını keşfet, karşılaştır ve doğru tooling kararını ver. 65+ tool, 10 kategori, bağımsız incelemeler. CI/CD, Monitoring, IaC, Container, Security ve daha fazlası.",
  keywords: ["devops", "devops tools", "ai tools", "ci/cd", "kubernetes", "terraform", "docker", "monitoring", "devsecops", "tool karşılaştırma", "devops araçları"],
  authors: [{ name: "DevOpSelf", url: "https://devopself.com" }],
  creator: "DevOpSelf",
  publisher: "DevOpSelf",
  metadataBase: new URL("https://devopself.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "DevOpSelf - DevOps, AI & Software Tool Karşılaştırma Platformu",
    description: "65+ DevOps, AI ve Software aracını keşfet, karşılaştır. Bağımsız incelemeler, detaylı analizler.",
    url: "https://devopself.com",
    siteName: "DevOpSelf",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOpSelf - DevOps Tool Karşılaştırma Platformu",
    description: "65+ DevOps, AI ve Software aracını keşfet ve karşılaştır.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: "17-xZ6tkDRDu56aFVDIBxhoHaFo7JNtpjPVMf1IaO3Y",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <head>
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1080501458617699" crossOrigin="anonymous"></script>

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DevOpSelf",
              url: "https://devopself.com",
              description: "DevOps, AI ve Software tool karşılaştırma platformu",
              sameAs: [],
            }),
          }}
        />

        {/* Structured Data - WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DevOpSelf",
              url: "https://devopself.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://devopself.com/tools/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="scanline min-h-screen bg-[#05080f] antialiased">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-TS2QNVMM3N" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TS2QNVMM3N');`}
        </Script>

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
