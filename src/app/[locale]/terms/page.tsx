import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { locales, type Locale, getDictionary } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.legal.terms.title,
    description: dict.legal.terms.intro,
    alternates: { canonical: `/${locale}/terms` },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <LegalPage
      locale={locale}
      title={dict.legal.terms.title}
      intro={dict.legal.terms.intro}
      sections={dict.legal.terms.sections}
      lastUpdatedLabel={dict.legal.lastUpdated}
      effectiveDate={dict.legal.effectiveDate}
      contactPrompt={dict.legal.contactPrompt}
      contactEmail={dict.legal.contactEmail}
    />
  );
}
