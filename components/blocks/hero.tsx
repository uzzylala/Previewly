import { ActionLink } from "@/components/ui/action-link";
import { SanityImage } from "@/components/ui/sanity-image";
import { Stagger, StaggerItem, StaggerWords } from "@/components/ui/stagger";

import type { BlockProps } from "./types";

/** Splits the heading around the first occurrence of the emphasised words, if present. */
function headingSegments(heading: string, emphasis: string | undefined) {
  const at = emphasis ? heading.indexOf(emphasis) : -1;
  if (!emphasis || at === -1) return [{ text: heading }];
  return [
    { text: heading.slice(0, at) },
    { text: emphasis, em: true },
    { text: heading.slice(at + emphasis.length) },
  ].filter((segment) => segment.text.length > 0);
}

export function Hero({ eyebrow, heading, emphasis, body, actions, image }: BlockProps<"hero">) {
  // Drop half-filled actions (e.g. a label typed before the URL) rather than render dead links.
  const links = (actions ?? []).filter(
    (action): action is typeof action & { label: string; href: string } =>
      Boolean(action.label && action.href),
  );
  const hasImage = Boolean(image?.asset);

  // Hides itself only when empty; without an image it renders a reduced, text-only layout.
  if (!heading && !body && !hasImage) return null;

  return (
    <section className="mx-auto max-w-page px-gutter py-section">
      <div className="grid items-center gap-x-12 gap-y-16 md:grid-cols-12">
        <Stagger
          className={`flex flex-col items-start gap-6 ${hasImage ? "md:col-span-7" : "md:col-span-10"}`}
        >
          {eyebrow && (
            <StaggerItem>
              <p className="text-xs font-medium tracking-label text-proof uppercase">{eyebrow}</p>
            </StaggerItem>
          )}
          {heading && (
            <StaggerWords
              segments={headingSegments(heading, emphasis)}
              className="max-w-[16ch] font-display text-display font-normal"
              emClassName="display-emphasis"
            />
          )}
          {body && (
            <StaggerItem>
              <p className="max-w-measure text-lg text-ink-soft">{body}</p>
            </StaggerItem>
          )}
          {links.length > 0 && (
            <StaggerItem className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3">
              {links.map((link, i) => (
                <ActionLink key={link._key} href={link.href} variant={i === 0 ? "primary" : "secondary"}>
                  {link.label}
                </ActionLink>
              ))}
            </StaggerItem>
          )}
        </Stagger>

        {hasImage && (
          <Stagger className="md:col-span-5">
            <StaggerItem>
              <figure className="crop-marks mx-6 md:mx-0">
                <SanityImage
                  image={image}
                  sizes="(min-width: 76rem) 30rem, (min-width: 768px) 40vw, calc(100vw - 5.5rem)"
                  className="h-auto w-full bg-paper-deep"
                  preload
                />
              </figure>
            </StaggerItem>
          </Stagger>
        )}
      </div>
    </section>
  );
}
