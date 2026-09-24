import { Reveal } from "./reveal";

type Props = { eyebrow?: string; heading?: string; id?: string };

/**
 * The editorial section opener: a hairline rule with the eyebrow set against it, then the
 * heading. Renders nothing when both are empty, so blocks can pass optional fields as-is.
 */
export function SectionHeader({ eyebrow, heading, id }: Props) {
  if (!eyebrow && !heading) return null;

  return (
    <Reveal className="flex flex-col gap-4 border-t border-ink pt-4">
      {eyebrow && (
        <p className="text-xs font-medium tracking-label text-proof uppercase">{eyebrow}</p>
      )}
      {heading && (
        <h2 id={id} className="max-w-[20ch] font-display text-3xl tracking-tight md:text-4xl">
          {heading}
        </h2>
      )}
    </Reveal>
  );
}
