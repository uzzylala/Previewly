import { ActionLink } from "@/components/ui/action-link";
import { Reveal } from "@/components/ui/reveal";

import type { BlockProps } from "./types";

export function Cta({ heading, body, actions }: BlockProps<"cta">) {
  const links = (actions ?? []).filter(
    (action): action is typeof action & { label: string; href: string } =>
      Boolean(action.label && action.href),
  );
  // Hides itself: a call to action needs both a reason (heading) and somewhere to go.
  if (!heading?.trim() || links.length === 0) return null;

  return (
    <section className="py-module">
      <div className="bg-ink text-paper">
        <Reveal className="mx-auto grid max-w-page items-end gap-10 px-gutter py-section md:grid-cols-12">
          <div className="flex flex-col gap-5 md:col-span-8">
            <h2 className="max-w-[18ch] font-display text-4xl tracking-tight md:text-5xl">{heading}</h2>
            {body && <p className="max-w-measure text-lg text-paper/75">{body}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:col-span-4 md:justify-end">
            {links.map((link, i) => (
              <ActionLink
                key={link._key}
                href={link.href}
                tone="inverse"
                variant={i === 0 ? "primary" : "secondary"}
              >
                {link.label}
              </ActionLink>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
