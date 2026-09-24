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

  try {
    return await enableDraftMode(new Request(url, request));
  } catch (error) {
    // next-sanity/preview-url-secret only catches its own URL-parsing errors; a Sanity
    // API failure while checking the secret (wrong/expired token, project unreachable)
    // propagates as an uncaught rejection and would otherwise surface as a bare 500.
    // Never log the token itself -- only whether one is configured, and its length.
    const token = process.env.SANITY_API_READ_TOKEN;
    console.error("[draft-mode/enable] Failed to validate the preview secret against Sanity.", {
      tokenConfigured: Boolean(token),
      tokenLength: token?.length ?? 0,
      error,
    });
    return Response.json(
      { message: "Could not validate the preview link. Check SANITY_API_READ_TOKEN." },
      { status: 500 },
    );
  }
}
