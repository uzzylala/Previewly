import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import type { ClientReturn, QueryParams } from "next-sanity";

import { client } from "./client";
import { draftClient } from "./draft-client";

type FetchOptions<Q extends string> = {
  query: Q;
  params?: QueryParams;
  /** Cache tags; publishing a matching document revalidates every query carrying the tag. */
  tags: string[];
};

/**
 * The single way the site reads Sanity.
 *
 * Published content is cached indefinitely and invalidated on demand by tag (see
 * app/api/revalidate), never on a timer. In Draft Mode, Next.js re-executes this
 * function on every request and never stores the result, so the draft branch always
 * reads live, unpublished content and can't leak into the published cache.
 */
export async function sanityFetch<const Q extends string>({
  query,
  params = {},
  tags,
}: FetchOptions<Q>): Promise<ClientReturn<Q>> {
  "use cache";
  cacheLife("max");
  cacheTag(...tags);

  const { isEnabled: isDraft } = await draftMode();
  return (isDraft ? draftClient : client).fetch(query, params);
}
