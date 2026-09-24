import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";

import { DraftModePreview } from "@/components/preview/draft-mode-preview";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MotionProvider } from "@/components/ui/motion-provider";
import { siteUrl } from "@/lib/site";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Italic is loaded so body-copy <em> gets a true italic rather than a synthesised slant.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Previewly", template: "%s · Previewly" },
  description: "Draft in your CMS, preview in the real site design, publish with confidence.",
};

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${instrumentSans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <DraftModePreview />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
