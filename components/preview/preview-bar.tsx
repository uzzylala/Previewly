"use client";

import { VisualEditing, type VisualEditingProps } from "next-sanity/visual-editing";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * The draft indicator. Proofreader's red is reserved for exactly this state, so the bar
 * reads as a correction layer over the real page.
 *
 * Exit posts a plain GET form to the /api/draft-mode/disable route handler rather than
 * a Server Action. A form (unlike a <Link>) is never prefetched, so preview can't be
 * left on its own -- but more importantly, it forces a full page load. A Server Action's
 * redirect() is a *soft*, client-side transition, and when its target is the page the
 * editor is already on (which it usually is, since Exit returns to the same URL), the
 * router can serve its cached copy of that page instead of re-fetching -- leaving the
 * stale draft bar and draft content on screen even though the cookie is already cleared.
 * A real navigation has no such cache to be stale.
 */
export function PreviewBar() {
  const t = useTranslations("Preview");
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const returnTo = search ? `${pathname}?${search}` : pathname;

  return (
    <div
      role="status"
      className="sticky top-0 z-50 bg-mark text-paper"
    >
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-6 gap-y-2 px-gutter py-2.5 text-sm">
        <p className="flex items-center gap-3">
          <span aria-hidden className="size-2 rounded-full bg-paper" />
          <span className="font-medium tracking-label uppercase">{t("viewingDraft")}</span>
          <span className="hidden text-paper sm:inline">{t("unpublished")}</span>
        </p>
        <form method="GET" action="/api/draft-mode/disable">
          <input type="hidden" name="redirect" value={returnTo} />
          <button
            type="submit"
            className="rounded-xs border border-paper/70 px-3 py-1 font-medium transition-colors duration-200 hover:bg-paper hover:text-mark focus-visible:outline-paper motion-reduce:transition-none"
          >
            {t("exit")}
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Connects the page to the Studio's Presentation tool. When the editor changes a
 * document, the server components re-render with the new draft; there's no client-side
 * data layer to keep in sync.
 */
export function PreviewRefresh() {
  const router = useRouter();
  const refresh = useCallback<NonNullable<VisualEditingProps["refresh"]>>(
    (payload) => {
      if (payload.source === "manual" || payload.source === "mutation") {
        router.refresh();
        return Promise.resolve();
      }
      return false;
    },
    [router],
  );
  return <VisualEditing refresh={refresh} />;
}
