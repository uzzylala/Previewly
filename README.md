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

### Two layers against malformed content

Each layer covers content the other can't reach.

- **Studio validation stops editors from creating malformed content.** Required fields, length limits and URL rules run in the Studio, and Publish stays disabled until a document is valid.
- **Frontend fallbacks handle malformed content that bypasses validation.** Validation only runs in the Studio. Content can still arrive broken through:
  - API writes, such as imports, scripts and the seed, which skip validation entirely.
  - Schema changes, where a field becomes required after documents already exist without it.
  - Older documents written under earlier rules.
  - Unfinished drafts, which previews render before anyone has tried to publish.

  Every block therefore either hides itself or renders a reduced version, and never crashes the page.

The homepage passes validation, so editors can always publish it. The deliberately broken fixtures live on [`/fixtures`](http://localhost:3000/fixtures) instead. That page is marked `noindex`, is left out of the sitemap, and is read-only in the Studio. It keeps every fallback exercised without blocking real editing. To check the dataset the same way the Studio does:

```bash
SANITY_AUTH_TOKEN=<token> npx sanity documents validate -y
```

Only `page-fixtures` should report errors.

### Adding a block type

1. Add a schema file in `sanity/schemaTypes/blocks/` and list it in `blocks/index.ts`.
2. Run `npm run typegen`.
3. Add a component in `components/blocks/` taking `BlockProps<"yourType">`, and add one entry to `registry.ts`.

If the block holds images or references, also add a projection for it in `PAGE_QUERY`. Plain fields are picked up by the `...` spread.

## Draft preview and revalidation

**Preview:** an editor opens Presentation in the Studio, which mints a one-hour secret tied to their session and loads it through `/api/draft-mode/enable`. That route validates the secret against the dataset server-side, sets Next's signed Draft Mode cookie, and redirects — but only to a same-origin path: the requested path is run through `safeRedirectPath` (`lib/safe-redirect.ts`) before the library ever sees it, so the route can't be turned into an open redirect. In Draft Mode, `sanityFetch` (`sanity/lib/fetch.ts`) switches to a server-only client holding a **Viewer**-role token and bypasses the cache entirely, so edits appear on the next request. A "Viewing a draft" bar (mark red) with an Exit preview control renders from the same production components. Visitors without a valid, unexpired secret always get the published page; a forged or tampered draft cookie is rejected the same way.

**Revalidation:** publishing in the Studio calls a Sanity GROQ webhook to `/api/revalidate`. The route verifies the webhook's HMAC-SHA256 signature (`next-sanity/webhook`'s `parseBody`) before touching anything; an unsigned or wrongly signed request gets 401. A valid publish revalidates only `page:<slug>` for the changed page (and its previous slug, if renamed) plus `page-list` for the sitemap — not the whole site.

**Free plan:** confirmed nothing here needs a paid feature. Draft Mode, the Presentation tool, Visual Editing and GROQ webhooks (2 included) are all on Sanity's Free plan; the Viewer and Administrator token roles used here are too. Only Content Releases/scheduled publishing and private datasets are Growth-only, and this project uses neither.

## Design direction: "Proof"

The site borrows from the printer's proof, which is what a preview is. It uses cool paper (`#F1F2EC`), ink navy (`#131A2B`) and a single proof-blue accent (`#2447C9`). Proofreader's red (`#B8341E`) is reserved for draft state. Headings are set in Newsreader, body text in Instrument Sans, on a 1.25 type scale. Hairline rules and crop marks stand in for cards and shadows.
