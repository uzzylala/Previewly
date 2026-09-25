import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Instrument_Sans, Noto_Naskh_Arabic } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { DraftModePreview } from "@/components/preview/draft-mode-preview";
import { MotionProvider } from "@/components/ui/motion-provider";
import { currentLocale } from "@/i18n/current";
import { localeMeta, locales } from "@/i18n/locales";
import { siteUrl } from "@/lib/site";

import "./globals.css";

// Newsreader is only ever set at its regular weight, so it is self-hosted as a single-weight
// file that keeps the optical-size axis (the high-contrast cut at display sizes). The Google
// loader only honours `axes` for the full 200-800 weight range, which is 272 KB for the pair
// against 120 KB here. Latin subset, downloaded from Google Fonts (SIL Open Font License).
//
// The italics are separate families with preload off: the upright faces are what the hero
// needs to paint, and every preloaded byte competes with the LCP image (and is wasted on the
// Arabic pages, which have no italics). The italic files load when an italic glyph is drawn.
const newsreader = localFont({
  variable: "--font-newsreader",
  src: [{ path: "../fonts/newsreader-normal.woff2", weight: "400", style: "normal" }],
  display: "swap",
});

const newsreaderItalic = localFont({
  variable: "--font-newsreader-italic",
  src: [{ path: "../fonts/newsreader-italic.woff2", weight: "400", style: "italic" }],
  display: "swap",
  preload: false,
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

// Body-copy <em> gets a true italic rather than a synthesised slant; not preloaded (see above).
const instrumentSansItalic = Instrument_Sans({
  variable: "--font-instrument-sans-italic",
  subsets: ["latin"],
  style: "italic",
  preload: false,
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
  const site = await getTranslations({ locale, namespace: "Site" });

  return (
    <html
      lang={locale}
      dir={localeMeta[locale].dir}
      className={`${newsreader.variable} ${newsreaderItalic.variable} ${instrumentSans.variable} ${instrumentSansItalic.variable} ${notoNaskhArabic.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <MotionProvider>
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-xs focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
            >
              {site("skipToContent")}
            </a>
            <DraftModePreview />
            {children}
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
