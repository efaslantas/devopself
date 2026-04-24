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
    title: dict.legal.disclaimer.title,
    description: dict.legal.disclaimer.intro,
    alternates: buildAlternates(locale as Locale, "disclaimer"),
  };
}

export default async function DisclaimerPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <LegalPage
      locale={locale}
      title={dict.legal.disclaimer.title}
      intro={dict.legal.disclaimer.intro}
      sections={dict.legal.disclaimer.sections}
      lastUpdatedLabel={dict.legal.lastUpdated}
      effectiveDate={dict.legal.effectiveDate}
      contactPrompt={dict.legal.contactPrompt}
      contactEmail={dict.legal.contactEmail}
    />
  );
}
