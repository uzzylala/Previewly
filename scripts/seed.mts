/**
 * Seeds demo content into the Sanity dataset. Idempotent: documents use fixed IDs and
 * `createOrReplace`, and Sanity deduplicates asset uploads by content hash.
 *
 *   npm run seed  (scripts/seed.mts)
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";

import { createClient } from "@sanity/client";

const { NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_EDITORIAL_TOKEN } =
  process.env;

if (!NEXT_PUBLIC_SANITY_PROJECT_ID || !NEXT_PUBLIC_SANITY_DATASET || !SANITY_API_EDITORIAL_TOKEN) {
  console.error("Missing Sanity env vars. Copy .env.example to .env.local and fill it in.");
  process.exit(1);
}

const client = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: NEXT_PUBLIC_SANITY_DATASET,
  token: SANITY_API_EDITORIAL_TOKEN,
  apiVersion: "2025-09-01",
  useCdn: false,
});

async function uploadImage(file: string) {
  const path = join(import.meta.dirname, "assets", file);
  const asset = await client.assets.upload("image", createReadStream(path), {
    filename: basename(path),
  });
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: asset._id } };
}

async function main() {
  const heroImage = await uploadImage("hero-proof.png");

  await client.createOrReplace({
    _id: "page-home",
    _type: "page",
    title: "Previewly",
    slug: { _type: "slug", current: "home" },
    description:
      "Editors write in the CMS and read their draft in the real site design before anything goes live.",
    blocks: [
      {
        _key: "hero-main",
        _type: "hero",
        eyebrow: "Content preview",
        heading: "See the page before the world does.",
        emphasis: "before",
        body: "Editors write in the CMS and read their draft in the real site design, fonts, images and all, before anything goes live.",
        actions: [
          { _key: "primary", _type: "link", label: "Start a draft", href: "/studio" },
          { _key: "secondary", _type: "link", label: "How previews work", href: "#how-it-works" },
        ],
        image: {
          ...heroImage,
          alt: "Two page proofs on a desk: the Previewly homepage marked up in red ink with a Draft stamp, and its Arabic translation behind it.",
        },
      },
    ],
  });

  console.log("Seeded: page-home");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
