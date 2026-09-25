import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

import { isLocale, locales } from "@/i18n/locales";
import { client } from "@/sanity/lib/client";
import { DOCS_BY_ID_QUERY, SIBLINGS_OF_DOC_QUERY } from "@/sanity/lib/queries";
import { cacheTags } from "@/sanity/lib/tags";

/**
 * Shape of the Sanity GROQ webhook projection (configured on the webhook itself, for
 * documents of type "page", "post" and "translation.metadata"):
 *
 *   {
 *     _type, _id,
 *     "language": after().language,         "slug": after().slug.current,
 *     "noindex": after().noindex,
 *     "previousLanguage": before().language, "previousSlug": before().slug.current,
 *     "previousNoindex": before().noindex,
 *     "translationIds": coalesce(after().translations[].value._ref, []) + coalesce(before().translations[].value._ref, [])
 *   }
 *
 * The before/after pair lets a renamed, moved or deleted page's old URL drop out of the
 * cache too.
 */
type WebhookPayload = {
  _type?: string;
  _id?: string;
  language?: string | null;
  slug?: string | null;
  noindex?: boolean | null;
  previousLanguage?: string | null;
  previousSlug?: string | null;
  previousNoindex?: boolean | null;
  translationIds?: string[] | null;
};

type Version = { type?: string | null; language: string | null; slug: string | null };

/**
 * Adds the tags for one document version, ignoring anything that isn't a real locale/slug.
 * A post also refreshes its language's blog index, which lists it.
 */
function tagVersion(tags: Set<string>, kind: string, { language, slug }: Version) {
  if (!slug || !language || !isLocale(language)) return;
  if (kind === "post") {
    tags.add(cacheTags.post(language, slug));
    tags.add(cacheTags.posts(language));
  } else {
    tags.add(cacheTags.page(language, slug));
  }
}

/**
 * Called by Sanity on publish (create, update, delete). The request must carry a valid
 * HMAC-SHA256 signature over its raw body made with SANITY_REVALIDATE_SECRET; anything
 * else is rejected before any cache is touched.
 *
 * Revalidation is per language, so publishing the French page refreshes /fr/<slug> and
 * nothing else. Pages that merely *depend* on a page's existence (its siblings' language
 * switcher and hreflang, and fallbacks that show it) are refreshed only when that
 * existence changes: a first publish, a rename, an unpublish, a noindex flip, or a change
 * to which translations are linked. A plain content edit touches its own page alone
 * (fallback renders carry the default-language page's tag, so editing English still
 * refreshes the pages that show it as a fallback).
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

  if (body._type === "page" || body._type === "post") {
    const kind = body._type;
    if (!body.language && !body.previousLanguage) {
      // A webhook still on the pre-i18n projection: we can't tell which language changed,
      // so refresh the slug in every language rather than serve any of them stale.
      for (const locale of locales) {
        for (const slug of [body.slug, body.previousSlug]) tagVersion(tags, kind, { language: locale, slug: slug ?? null });
      }
    } else {
      tagVersion(tags, kind, { language: body.language ?? null, slug: body.slug ?? null });
      tagVersion(tags, kind, { language: body.previousLanguage ?? null, slug: body.previousSlug ?? null });

      const existenceChanged =
        (body.language ?? null) !== (body.previousLanguage ?? null) ||
        (body.slug ?? null) !== (body.previousSlug ?? null) ||
        (body.noindex === true) !== (body.previousNoindex === true);

      if (existenceChanged && body._id) {
        const siblings = await client.fetch(SIBLINGS_OF_DOC_QUERY, { id: body._id });
        for (const sibling of siblings ?? []) if (sibling) tagVersion(tags, sibling.type ?? kind, sibling);
      }
    }
    tags.add(cacheTags.pageList);
  } else if (body._type === "translation.metadata") {
    // Linking or unlinking translations changes every sibling's switcher and hreflang.
    const ids = body.translationIds ?? [];
    const versions = ids.length ? await client.fetch(DOCS_BY_ID_QUERY, { ids }) : [];
    for (const version of versions) tagVersion(tags, version._type, version);
    tags.add(cacheTags.pageList);
  }

  // expire: 0, not "max": the next visitor gets the new content, rather than one more
  // stale response while it regenerates in the background.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: [...tags], now: Date.now() });
}
