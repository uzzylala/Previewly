import { PortableText, type PortableTextComponents } from "next-sanity";

import { isInternalHref } from "@/components/ui/action-link";
import { SiteLink } from "@/components/ui/site-link";
import { Reveal } from "@/components/ui/reveal";

import type { BlockProps } from "./types";

/*
 * Logical properties (ps-, border-s) throughout so the same styles mirror correctly in RTL.
 * Emphasis is Instrument Sans' true italic; the italic serif is reserved for display type.
 */
export const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-8 font-display text-3xl tracking-tight text-ink first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="mt-4 text-xl font-semibold text-ink">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-2 border-s-2 border-proof ps-6 font-display text-2xl tracking-tight text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="flex list-disc flex-col gap-2 ps-6 marker:text-proof">{children}</ul>,
    number: ({ children }) => (
      <ol className="flex list-decimal flex-col gap-2 ps-6 marker:font-medium marker:text-proof">{children}</ol>
    ),
  },
  marks: {
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    link: ({ value, children }) => {
      const href = (value as { href?: string } | undefined)?.href;
      if (!href) return <>{children}</>;
      const className =
        "text-proof underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] hover:decoration-2";
      return isInternalHref(href) ? (
        <SiteLink href={href} className={className}>
          {children}
        </SiteLink>
      ) : (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
  // Anything the schema doesn't know about degrades to plain text instead of throwing.
  unknownBlockStyle: ({ children }) => <p>{children}</p>,
  unknownMark: ({ children }) => <>{children}</>,
  unknownType: () => null,
};

export function RichText({ eyebrow, body }: BlockProps<"richText">) {
  const hasText = (body ?? []).some((block) =>
    block.children?.some((span) => span.text?.trim()),
  );
  // Hides itself when there is no actual text (an empty editor still stores empty blocks).
  if (!body || !hasText) return null;

  return (
    <section className="mx-auto grid max-w-page gap-x-12 gap-y-6 px-gutter py-module md:grid-cols-12">
      {eyebrow && (
        <Reveal className="md:col-span-3">
          <p className="border-t border-ink pt-4 text-xs font-medium tracking-label text-proof uppercase">
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal
        className={`flex max-w-measure flex-col gap-5 text-lg text-ink-soft md:col-span-7 ${eyebrow ? "" : "md:col-start-4"}`}
      >
        <PortableText value={body} components={richTextComponents} />
      </Reveal>
    </section>
  );
}
