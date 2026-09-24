import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

import { FaqAccordion, type FaqEntry } from "./faq-accordion";
import type { BlockProps } from "./types";

export function Faq({ eyebrow, heading, items }: BlockProps<"faq">) {
  // Reduced version: questions missing either half are dropped individually.
  const entries: FaqEntry[] = (items ?? []).flatMap((item) => {
    const question = item.question?.trim();
    const paragraphs = (item.answer ?? "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    return question && paragraphs.length > 0 ? [{ key: item._key, question, paragraphs }] : [];
  });
  // Hides itself when no complete question remains.
  if (entries.length === 0) return null;

  return (
    <section className="mx-auto grid max-w-page gap-x-12 gap-y-10 px-gutter py-module md:grid-cols-12">
      <div className="md:col-span-4">
        <SectionHeader eyebrow={eyebrow} heading={heading} />
      </div>
      <Reveal className="md:col-span-8">
        <FaqAccordion entries={entries} />
      </Reveal>
    </section>
  );
}
