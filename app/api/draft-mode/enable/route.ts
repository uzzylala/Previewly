import { defineEnableDraftMode } from "next-sanity/draft-mode";
import type { NextRequest } from "next/server";

import { safeRedirectPath } from "@/lib/safe-redirect";
import { assertDraftToken, draftClient } from "@/sanity/lib/draft-client";

const PATHNAME_PARAM = "sanity-preview-pathname";

const { GET: enableDraftMode } = defineEnableDraftMode({ client: draftClient });

/**
 * Entered from the Studio's Presentation tool with a short-lived secret the Studio
 * minted from the editor's own session. next-sanity validates that secret server-side
 * against the dataset (401 if missing, guessed or expired), sets the signed Draft Mode
 * cookie, and redirects to the requested page.
 *
 * The redirect target is untrusted input. It's reduced to a same-origin path before the
 * library ever sees it, so this route can't be used as an open redirect.
 */
export async function GET(request: NextRequest) {
  assertDraftToken();

  const url = new URL(request.url);
  const requested = url.searchParams.get(PATHNAME_PARAM);
  if (requested !== null) {
    url.searchParams.set(PATHNAME_PARAM, safeRedirectPath(requested, url.origin));
  }

  return enableDraftMode(new Request(url, request));
}
