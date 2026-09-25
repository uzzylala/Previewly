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

## Internationalisation

Live at https://previewly-wheat.vercel.app. Locales: English (default), French, Arabic (RTL).

- **Content model:** one `page` document per language, linked by a `translation.metadata` document (`@sanity/document-internationalization`). Each language publishes independently and can have its own localised slug (`/en/about`, `/fr/a-propos`, `/ar/من-نحن`). Slug uniqueness is per language, so every locale can have a `home`.
- **Routing:** every URL carries its locale (`/en`, `/fr`, `/ar`). `/` is the only unprefixed URL. `proxy.ts` sends it to the `NEXT_LOCALE` cookie's locale (set by the language switcher), else the best `Accept-Language` match, else English, with a **307**: the destination differs per visitor, so it must never be cached as permanent.
- **Fallback:** a missing translation serves the default-locale page inside the visitor's own chrome, with a small "not yet translated" notice (otherwise a French visitor gets English copy and can't tell a missing translation from a bug). The English body is wrapped in `lang="en" dir="ltr"`. Fallback pages are `noindex, follow` with **no canonical and no hreflang**. A canonical pointing at the English page would combine "drop this page" (noindex) with "merge it into that one" (canonical), which are contradictory signals; noindex alone is unambiguous, and the fallback is never advertised as a translation.
- **Fallback redirect:** if `/fr/pricing` is serving English and a French version is later published as `/fr/tarifs`, `/fr/pricing` redirects (307, since the translation can be unpublished) to it.
- **SEO:** hreflang and `x-default` list only real, published, indexable translations (`x-default` is the English version). The sitemap has one entry per real page with its alternates. URLs are percent-encoded, so Arabic slugs are valid.
- **RTL:** logical CSS properties only (`ms-`, `ps-`, `border-s`, `text-start`); the arrow icon flips, the wordmark, crop marks and digits do not. Arabic uses Noto Naskh Arabic (display) and IBM Plex Sans Arabic (text), with no letter-spacing and taller leading.
- **UI strings:** `messages/{en,fr,ar}.json` through next-intl. Dates and numbers use `Intl` via next-intl (UTC), plurals use ICU (Arabic has six forms).
- **Revalidation:** tags are `page:<locale>:<slug>`. Publishing the French version refreshes only that page. Siblings (their switcher and hreflang) and fallback URLs refresh only when a page's existence changes (first publish, rename, unpublish, noindex flip) or a `translation.metadata` document changes. The Sanity webhook must cover `page`, `post` and `translation.metadata`, and must use API version **v2025-02-19 or later**: on the default v2021-03-25 the projection is silently ignored and the raw document is delivered, which makes every edit look like a structural change. The projection is documented in `app/api/revalidate/route.ts`.
- **Test page:** the English-only `pricing` page exists to exercise the fallback. Its Studio note says so; it is not real content.

## Blog

Posts are a second localised document type (`post`), modelled exactly like pages: one document per language, a localised slug, tags and cover alt text, linked by `translation.metadata`. Routes: `/<locale>/blog` (index) and `/<locale>/blog/<slug>`.

- **Index, tags, pagination:** the page is static; `?q=`, `?tag=` and `?page=` are read at request time inside a Suspense boundary, and the post list itself is one cached fetch per language (tag `posts:<locale>`). The index lists only posts that exist in that language; an untranslated post is still reachable at its fallback URL (with the notice) from the language switcher.
- **Search is client-side filtering, not a GROQ query per keystroke.** The compact list for one language (no bodies) is already in the page, so results update within a frame with no network request and no API quota, and the fold in `lib/blog-search.ts` handles Arabic (diacritics, tatweel, alef/ya/ta-marbuta variants) and Latin accents, which GROQ's `match` does not. The server renders the same filter for the URL, so the page is complete without JavaScript and every state is a shareable link. Limit: it scales to hundreds of posts per language. Beyond a couple of thousand, move to server-side search (GROQ `text::query` or a search service) and keep the same URL shape.
- **Metadata:** per post and locale, Open Graph (`article`, `og:locale` plus alternates, 1200x630 cover crop from the Sanity CDN honouring hotspot) and Twitter card. Fallback posts follow the page rules: `noindex, follow`, no canonical, no hreflang.
- **Revalidation:** tags `post:<locale>:<slug>` and `posts:<locale>`; publishing a French post refreshes that post and the French index only.

## Decisions and findings worth knowing

- **Latin digits in Arabic.** Dates and numbers keep Latin digits in `/ar` ("24 سبتمبر 2026", "4 مقالات") by choice: they read consistently next to the Latin-script brand, codes and URLs. The month names and plural forms are Arabic. The numbering system is pinned to `latn` in `i18n/request.ts` and on the blog's number formatting, so it can't drift with a runtime's ICU default. To switch to Arabic-Indic digits, change `latn` to `arab` there.
- **Blog index SEO.** `/blog` and `?page=N` are indexable with a self-referencing canonical (page N is not a duplicate of page 1). `?tag=` views are also indexable with a self-referencing canonical: a tag is a small, stable topic listing, a useful landing page; noindex would discard that. `?q=` search results are `noindex, follow`: an unbounded space of thin near-duplicates. hreflang is declared only on the bare index, because tags are translated and a filtered view has no equivalent in another language.
- **Webhook API version (an earlier "pass" was luck).** During Phase 4 I updated the Sanity webhook through the management API and re-ran the live check, which passed: publishing French refreshed French. It passed by luck. The webhook was on API version v2021-03-25, which silently ignores the projection and delivers the raw document, so `slug` arrived as an object and the route treated every edit as a structural change, refreshing sibling languages too. The first live blog test exposed it: editing one French post also refreshed the English and Arabic indexes. I found the cause in Sanity's webhook delivery log (`GET /hooks/projects/<id>/<hook>/messages` shows each payload, and `/attempts` shows the route's response, which listed a tag `post:fr:[object Object]`). Fix: set the webhook to API version v2025-02-19 (payload became the documented projection) and re-verified pages and posts, where a plain edit now refreshes only its own language. Guard: `tagVersion` in `app/api/revalidate/route.ts` ignores any non-string slug, so an unprojected payload can never produce a nonsense tag.

## Draft preview and revalidation

**Preview:** an editor opens Presentation in the Studio, which mints a one-hour secret tied to their session and loads it through `/api/draft-mode/enable`. That route validates the secret against the dataset server-side, sets Next's signed Draft Mode cookie, and redirects — but only to a same-origin path: the requested path is run through `safeRedirectPath` (`lib/safe-redirect.ts`) before the library ever sees it, so the route can't be turned into an open redirect. In Draft Mode, `sanityFetch` (`sanity/lib/fetch.ts`) switches to a server-only client holding a **Viewer**-role token and bypasses the cache entirely, so edits appear on the next request. A "Viewing a draft" bar (mark red) with an Exit preview control renders from the same production components. Visitors without a valid, unexpired secret always get the published page; a forged or tampered draft cookie is rejected the same way.

**Revalidation:** publishing in the Studio calls a Sanity GROQ webhook to `/api/revalidate`. The route verifies the webhook's HMAC-SHA256 signature (`next-sanity/webhook`'s `parseBody`) before touching anything; an unsigned or wrongly signed request gets 401. A valid publish revalidates only `page:<locale>:<slug>` for the changed page (see Internationalisation) plus `page-list` for the sitemap — not the whole site.

**Free plan:** confirmed nothing here needs a paid feature. Draft Mode, the Presentation tool, Visual Editing and GROQ webhooks (2 included) are all on Sanity's Free plan; the Viewer and Administrator token roles used here are too. Only Content Releases/scheduled publishing and private datasets are Growth-only, and this project uses neither.

## Design direction: "Proof"

The site borrows from the printer's proof, which is what a preview is. It uses cool paper (`#F1F2EC`), ink navy (`#131A2B`) and a single proof-blue accent (`#2447C9`). Proofreader's red (`#B8341E`) is reserved for draft state. Headings are set in Newsreader, body text in Instrument Sans, on a 1.25 type scale. Hairline rules and crop marks stand in for cards and shadows.
