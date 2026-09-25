/**
 * Search, tag filtering and pagination for the blog index. Pure functions, shared by the
 * server (which renders the initial state, so the page works without JavaScript and
 * shareable URLs like ?tag=i18n&page=2 are complete) and the client (which re-runs them on
 * every keystroke, so results update instantly with no network request).
 */

export const PAGE_SIZE = 4;

export type BlogQuery = { q: string; tag: string; page: number };

type Searchable = {
  title: string | null;
  excerpt: string | null;
  author: string | null;
  tags: string[] | null;
};

/**
 * Folds text so that visually-equivalent spellings match: case, Latin accents, Arabic
 * diacritics (harakat), tatweel, and the alef / ya / ta-marbuta variants that writers use
 * interchangeably. "الاسعار" finds "الأسعار", and "apercu" finds "Aperçu".
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ٰٟۖ-ۭ]/g, "")
    .replace(/ـ/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

/** Posts matching the tag (exactly) and every word of the query (as a substring). */
export function filterPosts<T extends Searchable>(posts: T[], { q, tag }: Pick<BlogQuery, "q" | "tag">): T[] {
  const words = normalizeText(q).split(" ").filter(Boolean);
  const wantedTag = tag ? normalizeText(tag) : "";

  return posts.filter((post) => {
    const tags = post.tags ?? [];
    if (wantedTag && !tags.some((t) => normalizeText(t) === wantedTag)) return false;
    if (words.length === 0) return true;
    const haystack = normalizeText([post.title, post.excerpt, post.author, ...tags].filter(Boolean).join(" "));
    return words.every((word) => haystack.includes(word));
  });
}

export function paginate<T>(items: T[], page: number): { items: T[]; page: number; pageCount: number } {
  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);
  return { items: items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), page: current, pageCount };
}

type RawParams = { q?: string | string[]; tag?: string | string[]; page?: string | string[] };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

/** Reads ?q=&tag=&page= (from the router or location.search) into a clean query. */
export function parseBlogQuery(params: RawParams | URLSearchParams): BlogQuery {
  const get = (key: keyof RawParams) => (params instanceof URLSearchParams ? (params.get(key) ?? "") : first(params[key]));
  const page = Number.parseInt(get("page"), 10);
  return { q: get("q").slice(0, 100), tag: get("tag").slice(0, 60), page: Number.isFinite(page) && page > 0 ? page : 1 };
}

/** A relative query string ("?tag=x&page=2"), leaving out defaults so URLs stay clean. */
export function blogQueryString({ q, tag, page }: BlogQuery): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tag) params.set("tag", tag);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

/** Tags of a language's posts with how many posts use each, most-used first. */
export function tagCounts(posts: { tags: string[] | null }[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of new Set(post.tags ?? [])) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
