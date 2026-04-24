export const locales = ["tr", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export type Dictionary = typeof import("@/lib/dictionaries/tr.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  tr: () => import("@/lib/dictionaries/tr.json").then((m) => m.default),
  en: () => import("@/lib/dictionaries/en.json").then((m) => m.default),
  ru: () => import("@/lib/dictionaries/ru.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
};

export const localeFlags: Record<Locale, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
  ru: "🇷🇺",
};

export const dateLocales: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
  ru: "ru-RU",
};

export const SITE_URL = "https://devopself.com";

/**
 * Build hreflang alternates + canonical for a given locale-aware path.
 *
 * @param locale - current locale
 * @param subPath - path AFTER the locale prefix, e.g. "blog", "tools/jenkins".
 *                 Leave empty for the locale root.
 */
export function buildAlternates(locale: Locale, subPath: string = "") {
  const clean = subPath.replace(/^\/+|\/+$/g, "");
  const suffix = clean ? `/${clean}` : "";
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `/${l}${suffix}`;
  }
  // x-default — prefer Turkish (primary audience)
  languages["x-default"] = `/${defaultLocale}${suffix}`;
  return {
    canonical: `/${locale}${suffix}`,
    languages,
  };
}
