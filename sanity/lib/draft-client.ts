import "server-only";

import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

/**
 * The only client that can read drafts. It holds a Viewer-role token, so this module is
 * server-only: importing it from a client component fails the build rather than
 * shipping the token to the browser.
 */
export const draftClient = client.withConfig({
  token,
  perspective: "drafts",
  useCdn: false,
  stega: false,
});

export function assertDraftToken() {
  if (!token) {
    throw new Error("Missing SANITY_API_READ_TOKEN: draft preview needs a Viewer token. See .env.example.");
  }
}
