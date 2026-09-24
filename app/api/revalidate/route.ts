import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

import { cacheTags } from "@/sanity/lib/tags";

/**
 * Shape of the Sanity GROQ webhook projection (configured on the webhook itself):
 *   { _type, "slug": after().slug.current, "previousSlug": before().slug.current }
 * previousSlug lets a renamed page's old URL drop out of the cache too.
 */
type WebhookPayload = { _type?: string; slug?: string | null; previousSlug?: string | null };

/**
 * Called by Sanity on publish (create, update, delete). The request must carry a valid
 * HMAC-SHA256 signature over its raw body made with SANITY_REVALIDATE_SECRET; anything
 * else is rejected before any cache is touched.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ message: "Revalidation is not configured" }, { status: 500 });
  }

  // parseBody verifies the signature, then waits briefly for Content Lake consistency
  // so the refetch that follows can't read the pre-publish version.
  const { isValidSignature, body } = await parseBody<WebhookPayload>(request, secret);
  // null means "no signature header"; only an explicit true is trusted.
  if (isValidSignature !== true) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }
  if (!body?._type) {
    return Response.json({ message: "Missing document type" }, { status: 400 });
  }

  const tags = new Set<string>();
  if (body._type === "page") {
    for (const slug of [body.slug, body.previousSlug]) {
      if (slug) tags.add(cacheTags.page(slug));
    }
    tags.add(cacheTags.pageList);
  }

  // expire: 0, not "max": the next visitor gets the new content, rather than one more
  // stale response while it regenerates in the background.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: [...tags], now: Date.now() });
}
