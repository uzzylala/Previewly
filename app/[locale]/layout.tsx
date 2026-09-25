import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Instrument_Sans, Newsreader, Noto_Naskh_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { DraftModePreview } from "@/components/preview/draft-mode-preview";
import { MotionProvider } from "@/components/ui/motion-provider";
import { currentLocale } from "@/i18n/current";
import { localeMeta, locales } from "@/i18n/locales";
import { siteUrl } from "@/lib/site";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Italic is loaded so body-copy <em> gets a true italic rather than a synthesised slant
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// The approved Arabic pairing: Noto Naskh Arabic for display type (the counterpart of the
// Newsreader serif) and IBM Plex Sans Arabic for text (the counterpart of Instrument Sans).
// Their files are only fetched by pages that actually contain Arabic, since the browser
// downloads a font only when a glyph needs it; preload is off so other locales don't pay
// for a hint they will never use.
const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Site" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "Previewly", template: "%s · Previewly" },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await currentLocale();

  return (
    <html
      lang={locale}
      dir={localeMeta[locale].dir}
      className={`${newsreader.variable} ${instrumentSans.variable} ${notoNaskhArabic.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <MotionProvider>
            <DraftModePreview />
            {children}
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
