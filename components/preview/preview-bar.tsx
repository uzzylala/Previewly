"use client";

import { VisualEditing, type VisualEditingProps } from "next-sanity/visual-editing";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { exitPreview } from "./actions";

/**
 * The draft indicator. Proofreader's red is reserved for exactly this state, so the bar
 * reads as a correction layer over the real page. Exit is a form posting to a server
 * action rather than a link: links are prefetched, which would leave preview on its own.
 */
export function PreviewBar() {
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
          <span className="font-medium tracking-label uppercase">Viewing a draft</span>
          <span className="hidden text-paper/85 sm:inline">Unpublished changes are visible only in preview.</span>
        </p>
        <form action={exitPreview}>
          <input type="hidden" name="returnTo" value={returnTo} />
          <button
            type="submit"
            className="rounded-xs border border-paper/70 px-3 py-1 font-medium transition-colors duration-200 hover:bg-paper hover:text-mark focus-visible:outline-paper motion-reduce:transition-none"
          >
            Exit preview
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
