import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { locales, type Locale, getDictionary, buildAlternates } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.legal.cookies.title,
    description: dict.legal.cookies.intro,
    alternates: buildAlternates(locale as Locale, "cookies"),
  };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <LegalPage
      locale={locale}
      title={dict.legal.cookies.title}
      intro={dict.legal.cookies.intro}
      sections={dict.legal.cookies.sections}
      lastUpdatedLabel={dict.legal.lastUpdated}
      effectiveDate={dict.legal.effectiveDate}
      contactPrompt={dict.legal.contactPrompt}
      contactEmail={dict.legal.contactEmail}
    />
  );
}
