/**
 * Seeds demo content into the Sanity dataset. Idempotent: documents use fixed IDs and
 * `createOrReplace`, and Sanity deduplicates asset uploads by content hash.
 *
 *   npm run seed
 *
 * The homepage deliberately includes broken content (marked FIXTURE below) so the
 * block renderer's fallbacks stay visible and testable.
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

// --- Portable Text helpers -------------------------------------------------------------

type Span = string | { text: string; marks: string[] };
type MarkDef = { _key: string; _type: "link"; href: string };

let keySeq = 0;
const key = (prefix: string) => `${prefix}${++keySeq}`;

function block(
  style: "normal" | "h2" | "h3" | "blockquote",
  spans: Span[],
  opts: { listItem?: "bullet" | "number"; markDefs?: MarkDef[] } = {},
) {
  return {
    _type: "block",
    _key: key("b"),
    style,
    ...(opts.listItem ? { listItem: opts.listItem, level: 1 } : {}),
    markDefs: opts.markDefs ?? [],
    children: spans.map((span) => ({
      _type: "span",
      _key: key("s"),
      text: typeof span === "string" ? span : span.text,
      marks: typeof span === "string" ? [] : span.marks,
    })),
  };
}

const link = (_key: string, label: string, href: string) => ({
  _type: "link" as const,
  _key,
  label,
  href,
});

// --- Content ---------------------------------------------------------------------------

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
          link("primary", "Start a draft", "/studio"),
          link("secondary", "How previews work", "#how-it-works"),
        ],
        image: {
          ...heroImage,
          alt: "Two page proofs on a desk: the Previewly homepage marked up in red ink with a Draft stamp, and its Arabic translation behind it.",
        },
      },
      {
        _key: "how-it-works",
        _type: "richText",
        eyebrow: "How it works",
        anchor: "how-it-works",
        body: [
          block("h2", ["A preview is a proof, not a guess."]),
          block("normal", [
            "Most CMS previews show your words in a grey form. Previewly renders them in the ",
            { text: "actual", marks: ["em"] },
            " site: the same components, fonts and image crops your readers will get, only with the draft swapped in.",
          ]),
          block("normal", ["Getting from draft to live takes three steps:"]),
          block("normal", ["Write and save your changes in the Studio. Nothing is public yet."], { listItem: "number" }),
          block("normal", [
            "Open the preview link. It is signed, so only people you share it with can see the draft.",
          ], { listItem: "number" }),
          block("normal", ["Publish. The live page updates within seconds, with no redeploy."], {
            listItem: "number",
          }),
          block("blockquote", ["If it looks right in the preview, it will look right in production."]),
          block(
            "normal",
            [
              "Ready to try it? ",
              { text: "Open the Studio", marks: ["studioLink"] },
              " and edit this very page.",
            ],
            { markDefs: [{ _key: "studioLink", _type: "link", href: "/studio" }] },
          ),
        ],
      },
      {
        _key: "testimonials",
        _type: "testimonialGrid",
        eyebrow: "From editors",
        heading: "Teams stopped publishing just to check their work.",
        testimonials: [
          {
            _key: "t1",
            _type: "testimonial",
            quote: "We used to push to staging to proofread. Now the preview is the page, and review takes minutes.",
            name: "Mara Okafor",
            role: "Head of Content, Tessellate",
          },
          {
            _key: "t2",
            _type: "testimonial",
            quote: "Arabic and French launches went out the same morning as English, and nobody had to file a ticket.",
            name: "Yusuf Haddad",
            role: "Localization Lead, Norland",
          },
          {
            _key: "t3",
            _type: "testimonial",
            quote: "Our designers finally trust the CMS. What editors see is exactly what ships.",
            name: "Ines Albrecht",
            role: "Design Director, Fieldnote",
          },
          // FIXTURE: no name. Renders the quote without an attribution line.
          {
            _key: "t4-no-name",
            _type: "testimonial",
            quote: "The draft banner alone saved us from two embarrassing launches.",
          },
        ],
      },
      // FIXTURE (malformed): required testimonials are empty. The block hides itself.
      {
        _key: "fixture-empty-testimonials",
        _type: "testimonialGrid",
        heading: "More from our customers",
        testimonials: [],
      },
      // FIXTURE (unknown type): not in this build's schema. Skipped, with a dev warning.
      {
        _key: "fixture-unknown-type",
        _type: "pricingTable",
        heading: "Plans",
        plans: [{ _key: "p1", name: "Studio", price: 0 }],
      },
      {
        _key: "faq",
        _type: "faq",
        eyebrow: "Questions",
        heading: "What editors ask before switching.",
        anchor: "faq",
        items: [
          {
            _key: "q1",
            _type: "faqItem",
            question: "Who can open a preview link?",
            answer:
              "Only someone holding a valid, signed link. Visitors without one always get the published page, even at the same URL.",
          },
          {
            _key: "q2",
            _type: "faqItem",
            question: "How quickly does a published change go live?",
            answer:
              "Within a few seconds. Publishing sends a webhook that refreshes only the pages that use the changed content.\n\nThere is no redeploy and no long cache to wait out.",
          },
          {
            _key: "q3",
            _type: "faqItem",
            question: "What happens if a translation is missing?",
            answer:
              "The block falls back to the default language instead of rendering empty, so a half-translated page never looks broken.",
          },
          // FIXTURE: question without an answer. This item is dropped; the rest render.
          { _key: "q4-no-answer", _type: "faqItem", question: "Can I schedule a publish?" },
          {
            _key: "q5",
            _type: "faqItem",
            question: "Does preview use different components?",
            answer:
              "No. Draft and published content go through exactly the same components, which is the whole point.",
          },
        ],
      },
      // FIXTURE (malformed): required heading is empty. The block hides itself.
      {
        _key: "fixture-cta-no-heading",
        _type: "cta",
        heading: "",
        actions: [link("a", "Orphaned button", "/studio")],
      },
      {
        _key: "cta-main",
        _type: "cta",
        heading: "Proof your next page before it ships.",
        body: "Open the Studio, change anything on this page, and preview it in the real design.",
        actions: [link("primary", "Open the Studio", "/studio"), link("secondary", "Read the FAQ", "#faq")],
      },
    ],
  });

  console.log("Seeded: page-home");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
