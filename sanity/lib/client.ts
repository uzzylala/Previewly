import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Freshness comes from tag-based revalidation, so read from the live API rather than
  // the CDN: a webhook-triggered refetch must never see a stale CDN edge.
  useCdn: false,
  perspective: "published",
});
