"use client";

import { useEffect } from "react";

/**
 * The last resort: it renders only when the root layout itself fails, so there is no
 * next-intl provider, no fonts and no Tailwind here. It stays self-contained (inline styles
 * in the design's colours) and picks its language from the URL's locale prefix.
 */
const copy = {
  en: { dir: "ltr", title: "Something went wrong.", body: "The page failed to load, and it isn't you. Try again, or head back to the homepage.", retry: "Try again", home: "Back to the homepage" },
  fr: { dir: "ltr", title: "Une erreur s'est produite.", body: "La page n'a pas pu se charger, et ce n'est pas votre faute. Réessayez, ou retournez à l'accueil.", retry: "Réessayer", home: "Retour à l'accueil" },
  ar: { dir: "rtl", title: "حدث خطأ ما.", body: "تعذّر تحميل الصفحة، والخطأ ليس منك. حاول مرة أخرى، أو عد إلى الصفحة الرئيسية.", retry: "حاول مجددًا", home: "العودة إلى الصفحة الرئيسية" },
} as const;

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  const prefix = typeof window === "undefined" ? "en" : window.location.pathname.split("/")[1];
  const locale = prefix === "fr" || prefix === "ar" ? prefix : "en";
  const c = copy[locale];

  return (
    <html lang={locale} dir={c.dir}>
      <body style={{ margin: 0, background: "#f1f2ec", color: "#131a2b", fontFamily: "system-ui, sans-serif" }}>
        <main role="alert" style={{ maxWidth: "40rem", margin: "0 auto", padding: "6rem 1.5rem" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: "2.4rem", lineHeight: 1.3, margin: "0 0 1rem" }}>{c.title}</h1>
          <p style={{ color: "#4a5163", fontSize: "1.125rem", lineHeight: 1.7, margin: "0 0 2rem" }}>{c.body}</p>
          <button
            type="button"
            onClick={reset}
            style={{ background: "#131a2b", color: "#f1f2ec", border: 0, borderRadius: 2, padding: "0.75rem 1.25rem", fontSize: "1rem", fontWeight: 500, cursor: "pointer", marginInlineEnd: "1.5rem" }}
          >
            {c.retry}
          </button>
          <a href={`/${locale}`} style={{ color: "#131a2b", fontSize: "1rem", fontWeight: 500 }}>
            {c.home}
          </a>
        </main>
      </body>
    </html>
  );
}
