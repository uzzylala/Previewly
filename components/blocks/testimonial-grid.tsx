import { Reveal } from "@/components/ui/reveal";
import { SanityImage } from "@/components/ui/sanity-image";
import { SectionHeader } from "@/components/ui/section-header";

import type { BlockProps } from "./types";

type Testimonial = NonNullable<BlockProps<"testimonialGrid">["testimonials"]>[number];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Attribution({ name, role, avatar }: Testimonial) {
  // Reduced version: a quote with no name gets no attribution line at all.
  if (!name) return null;

  const hasAvatar = Boolean(avatar?.asset);
  return (
    <figcaption className="flex items-center gap-3">
      {hasAvatar ? (
        <SanityImage image={avatar} sizes="40px" className="size-10 rounded-full object-cover" />
      ) : (
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full bg-paper-deep font-display text-base text-ink-soft"
        >
          {initials(name)}
        </span>
      )}
      <span className="flex flex-col text-sm">
        <span className="font-medium text-ink">{name}</span>
        {role && <span className="text-ink-soft">{role}</span>}
      </span>
    </figcaption>
  );
}

export function TestimonialGrid({ eyebrow, heading, testimonials }: BlockProps<"testimonialGrid">) {
  const valid = (testimonials ?? []).filter((t) => t.quote?.trim());
  // Hides itself: a testimonial section with no quotes has nothing to say.
  if (valid.length === 0) return null;

  const columns =
    valid.length === 1 ? "" : valid.length % 2 === 0 && valid.length < 6 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="mx-auto flex max-w-page flex-col gap-12 px-gutter py-module">
      <SectionHeader eyebrow={eyebrow} heading={heading} />
      <ul className={`grid gap-x-10 gap-y-12 ${columns}`}>
        {valid.map((testimonial, i) => (
          <Reveal as="li" key={testimonial._key} delay={(i % 3) * 0.08}>
            <figure className="flex h-full flex-col justify-between gap-8 border-t border-rule pt-6">
              <blockquote
                className={`font-display tracking-tight text-ink ${valid.length === 1 ? "max-w-[34ch] text-3xl" : "text-xl"}`}
              >
                <p>
                  <span aria-hidden className="text-proof">“</span>
                  {testimonial.quote}
                  <span aria-hidden className="text-proof">”</span>
                </p>
              </blockquote>
              <Attribution {...testimonial} />
            </figure>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
