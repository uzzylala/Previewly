# Previewly

A marketing site (homepage, blog, product pages) whose content lives entirely in Sanity, with real draft previews rendered in the production design, on-demand revalidation and full internationalisation. No custom backend: the CMS is the data layer.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Motion · Sanity (embedded Studio) · next-intl

## Getting started

```bash
cp .env.example .env.local   # fill in project ID, dataset and an Editor token
npm install
npm run seed                 # creates the demo homepage in your dataset
npm run dev                  # site on :3000, Studio on :3000/studio
```

| Script              | What it does                                                    |
| ------------------- | --------------------------------------------------------------- |
| `npm run typegen`   | Extracts the Sanity schema and regenerates typed GROQ results   |
| `npm run typecheck` | `tsc --noEmit`                                                  |
| `npm run seed`      | Idempotently writes demo content (fixed IDs, `createOrReplace`) |

## How it fits together

- **Content model** (`sanity/schemaTypes`): a `page` document holds an ordered `blocks` array. Each block type is an object schema in `blocks/`.
- **Block rendering** (`components/blocks/`): `BlockRenderer` looks each block up in `registry.ts`. The registry uses `satisfies` against the TypeGen block union, so a schema block with no component, or with mismatched props, fails the build. Unknown `_type`s render nothing (with a dev warning). Each block is isolated: server-render exceptions are caught per block, and a client error boundary contains runtime failures. Blocks with missing required content either hide or render a reduced version, never broken UI.
- **Data fetching** (`sanity/lib/fetch.ts`): every read goes through `sanityFetch`, a `'use cache'` function with `cacheLife('max')` and cache tags. Pages are static until an editor publishes; there is no time-based refetching.
- **Types**: GROQ queries use `defineQuery`, and Sanity TypeGen produces `sanity/types.ts`. Fields stay nullable on purpose: draft content can be half-filled, so components must cope with missing data.
- **Images** (`components/ui/sanity-image.tsx`): a custom `next/image` loader maps `srcset` widths straight to Sanity CDN transforms. Intrinsic dimensions (post-crop) prevent layout shift, and Sanity's LQIP provides the blur-up placeholder.
- **Design tokens** (`app/(site)/globals.css`): Tailwind's default palette, radii and type scale are cleared, so only the design system's tokens exist as utilities.

### Adding a block type

1. Add a schema file in `sanity/schemaTypes/blocks/` and list it in `blocks/index.ts`.
2. Run `npm run typegen`.
3. Add a component in `components/blocks/` taking `BlockProps<"yourType">`, and add one entry to `registry.ts`.

If the block holds images or references, also add a projection for it in `PAGE_QUERY`. Plain fields are picked up by the `...` spread.

## Design direction: "Proof"

The site borrows from the printer's proof, which is what a preview is. It uses cool paper (`#F1F2EC`), ink navy (`#131A2B`) and a single proof-blue accent (`#2447C9`). Proofreader's red (`#B8341E`) is reserved for draft state. Headings are set in Newsreader, body text in Instrument Sans, on a 1.25 type scale. Hairline rules and crop marks stand in for cards and shadows.
