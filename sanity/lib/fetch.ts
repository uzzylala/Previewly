import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { ClientReturn, QueryParams } from "next-sanity";

import { client } from "./client";

type FetchOptions<Q extends string> = {
  query: Q;
  params?: QueryParams;
  /** Cache tags; publishing a matching document revalidates every query carrying the tag. */
  tags: string[];
};

/**
 * Cached Sanity read. Content only changes when an editor publishes, so results are
 * kept indefinitely and invalidated on demand by tag rather than on a timer.
 */
export async function sanityFetch<const Q extends string>({
  query,
  params = {},
  tags,
}: FetchOptions<Q>): Promise<ClientReturn<Q>> {
  "use cache";
  cacheLife("max");
  cacheTag(...tags);

  return client.fetch(query, params);
}
