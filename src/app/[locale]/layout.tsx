import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { locales, type Locale, getDictionary } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const ogLocale = locale === "tr" ? "tr_TR" : locale === "ru" ? "ru_RU" : "en_US";

  return {
    title: {
      default: dict.meta.siteTitle,
      template: "%s | DevOpSelf",
    },
    description: dict.meta.siteDescription,
    keywords: ["devops", "devops tools", "ai tools", "ci/cd", "kubernetes", "terraform", "docker", "monitoring", "devsecops", "tool karşılaştırma", "devops araçları"],
    authors: [{ name: "DevOpSelf", url: "https://devopself.com" }],
    creator: "DevOpSelf",
    publisher: "DevOpSelf",
    metadataBase: new URL("https://devopself.com"),
    alternates: { canonical: "/" },
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      url: "https://devopself.com",
      siteName: "DevOpSelf",
      type: "website",
      locale: ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteTitle,
      description: dict.meta.ogDescription,
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
}

export default async function LocaleLayout({ params, children }: Props) {
  const { locale } = await params;

  return (
    <html lang={locale} className="dark">
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
          <Navbar locale={locale} />
          <main className="pt-16">{children}</main>
          <Footer locale={locale} />
        </div>
      </body>
    </html>
  );
}
