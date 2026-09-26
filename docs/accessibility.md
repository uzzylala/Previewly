# Accessibility pass (Phase 5, Part B)

Target: WCAG 2.2 AA. Every result below was measured, first on the pre-fix build and then after the fixes, on a production build and on the deployed site.

## Method

| Check | How |
| --- | --- |
| Automated | axe-core 4.x through Chrome, rule tags `wcag2a wcag2aa wcag21a wcag21aa wcag22aa best-practice`, after scrolling the page so reveal-on-scroll content is visible |
| Pages | 11 page types x 3 locales (33 minus 3 combinations that don't exist): home, home with the FAQ expanded, CMS page, fallback page (fr, ar), blog index, blog index page 2 (en, fr), index with a typed search, index with no results, post, fallback post (fr, ar), 404. Plus the draft bar in each locale (draft mode, Presentation flow). 33 audits in all |
| Keyboard | Scripted real key events (Tab, Shift+Tab, Arrow keys, Home/End, Enter, Space) in en and ar: tab order, focus indicators, the FAQ, the language switcher, blog search, tag chips and pagination |
| Reflow | 320 CSS px wide (WCAG 1.4.10) on 10 representative pages, including Arabic |
| Screen reader | **No real screen reader was run** (no NVDA, JAWS, VoiceOver or Narrator was available to this pass). Instead: Chrome's accessibility tree, the structure those tools read, was dumped for `/ar`, `/ar/blog` and `/fr/pricing` (landmarks, heading outline, accessible names, nested `lang`). Treat that as a proxy and do a real Arabic screen reader pass (NVDA + Firefox, VoiceOver + Safari) before calling this done |

### Screen reader attempt (not completed)

I tried to run a portable NVDA 2026.2 with a silent synthesiser and read what it sent to speech from its debug log. NVDA started and logged speech correctly, but driving the browser needs real OS-level keystrokes, and the automation could not reliably bring the test browser to the foreground on this desktop. The one trial's keystrokes landed in another application's window instead (an image editor), so I stopped, removed the NVDA copy and made no further attempts rather than send keys to windows I can't see. **A manual NVDA (Firefox) and VoiceOver (Safari) pass on /ar, /ar/blog and /fr/pricing is still needed.** Things worth listening for: the untranslated-language option reading "(Not translated yet: shows the English version)", the English fallback body switching voice via `lang="en"`, the search status ("3 posts") and the pagination status ("7 posts · Page 2 of 2").

## Before and after

| | Before | After |
| --- | --- | --- |
| axe violations, 33 audits | 15 nodes, 4 rules | **0** (re-run after the Part C font and weight changes: still 0) |
| Skip link | none | first Tab stop, "Skip to content", translated, targets `<main id="content">` |
| Pagination announced | no: the live region only changed when the result *count* changed | yes: "7 posts · Page 2 of 2" |
| Focus ring on dark grounds (CTA band, draft bar) | proof blue on ink, about 2.1:1 | paper on ink |
| 320px reflow | 4 failures (Arabic header overflowed by 9px) | 0 |

### Violations found, and the fix for each

| Rule | Where | Fix |
| --- | --- | --- |
| `page-has-heading-one` (moderate), 5 pages | CMS pages whose first block is rich text have no `h1` (about page in all locales, plus the fr/ar fallback of pricing) | `LocalizedPage` renders the page title as a visually hidden `h1` when the page has no hero block |
| `color-contrast` (serious), 4 nodes | The disabled "Previous"/"Next" placeholder on the blog index (`text-ink-soft/50`, 2.29:1) | A disabled control is now `invisible` (space kept, out of the a11y tree) instead of low-contrast text |
| `color-contrast` (serious), 2 nodes | Draft bar helper text, `text-paper/85` on the proofreader red (4.17:1) | Full-strength `text-paper` |
| `region` (moderate), 4 pages | The fallback notice sat outside every landmark | Moved inside `<main>` |

### Found by the keyboard and reflow checks (axe does not test these)

- No skip link: added (see above).
- Pagination and page changes were silent to screen readers: fixed with the status message above.
- Arabic header overflowed at 320px: the header wraps now, with tighter gaps on small screens.
- Focus indicator contrast on ink and draft-red backgrounds: `:where(.bg-ink, .bg-mark) :focus-visible` uses paper.

## What was checked and already correct

- **Tab order** follows the DOM and the visual order in both directions (in Arabic the header reads wordmark, nav, switcher from the right).
- **Visible focus** on every stop, none without an indicator.
- **FAQ**: Up/Down move between questions and wrap, Home/End jump, Enter and Space toggle, "Expand all" works, closed answers are `inert` (skipped by Tab and by screen readers). Identical in Arabic.
- **Language switcher**: real links, Enter follows them, `lang`/`hreflang` on each, the current language has `aria-current`, and an untranslated language announces "(Not translated yet: shows the English version)" through visually hidden text.
- **Blog search**: labelled `search` landmark, typing updates a `role=status` region ("3 posts"), the Search button and tag chips (with `aria-current`) and pagination (with `aria-current="page"`) all work by keyboard.
- **Structure** (accessibility tree): banner, two labelled navigations, main, contentinfo, a search landmark on the blog; one `h1` per page, no skipped levels; no unnamed links, buttons, inputs or images; the fallback body carries `lang="en" dir="ltr"` so a screen reader switches voice for it.
- **Language**: `<html lang dir>` per locale; the wordmark is `lang="en" translate="no"`.

## Known gaps

- No real screen reader run (see Method).
- After a language switch the browser lands on the top of the new page, which is standard for a full navigation, but focus is not moved to the main landmark.
- Automated tools find roughly a third of real issues. Cognitive load, reading level and the Arabic translations' phrasing were not reviewed by a native speaker.
