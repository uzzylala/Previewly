"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useMemo, useState, type FormEvent, type MouseEvent } from "react";

import { SanityImage } from "@/components/ui/sanity-image";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { Link } from "@/i18n/navigation";
import {
  blogQueryString,
  filterPosts,
  paginate,
  parseBlogQuery,
  tagCounts,
  type BlogQuery,
} from "@/lib/blog-search";
import { unprefixedPostPath } from "@/lib/urls";
import type { PostSummary } from "@/sanity/lib/posts";

/**
 * The blog index: search, tag filter and pagination over one language's posts.
 *
 * Search is client-side filtering, not a GROQ query per keystroke: the whole (compact) list
 * for the language is already here, so results update instantly with no network round
 * trip, cost no API requests, and work with Arabic/Latin folding that GROQ's match
 * operator doesn't do. The server renders the same filter for the URL's ?q=&tag=&page=, so
 * the page is complete without JavaScript and every state is a shareable link. Controls
 * are real links and a real GET form; JavaScript only makes them instant.
 */
export function BlogBrowser({ posts, initial }: { posts: PostSummary[]; initial: BlogQuery }) {
  const t = useTranslations("Blog");
  const format = useFormatter();
  const searchId = useId();
  const [query, setQuery] = useState<BlogQuery>(initial);

  // Back/forward: the URL is the source of truth for tag and page.
  useEffect(() => {
    const onPop = () => setQuery(parseBlogQuery(new URLSearchParams(window.location.search)));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const tags = useMemo(() => tagCounts(posts), [posts]);
  const filtered = useMemo(() => filterPosts(posts, query), [posts, query]);
  const { items, page, pageCount } = useMemo(() => paginate(filtered, query.page), [filtered, query.page]);

  const go = useCallback((next: BlogQuery, mode: "push" | "replace") => {
    setQuery(next);
    const url = `${window.location.pathname}${blogQueryString(next)}`;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  }, []);

  const onLinkClick = (event: MouseEvent, next: BlogQuery) => {
    // Let the browser handle new-tab clicks; intercept plain clicks for an instant update.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    go(next, "push");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    go({ ...query, page: 1 }, "replace");
  };

  const hasFilter = Boolean(query.q || query.tag);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <form role="search" method="get" onSubmit={onSubmit} className="flex flex-col gap-2">
          <label htmlFor={searchId} className="text-sm font-medium text-ink">
            {t("searchLabel")}
          </label>
          <div className="flex max-w-xl items-stretch gap-3">
            <input
              id={searchId}
              type="search"
              name="q"
              value={query.q}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              enterKeyHint="search"
              onChange={(event) => go({ ...query, q: event.target.value, page: 1 }, "replace")}
              className="min-h-11 w-full min-w-0 rounded-xs border border-ink-soft bg-paper px-4 text-base text-ink placeholder:text-ink-soft"
            />
            {query.tag && <input type="hidden" name="tag" value={query.tag} />}
            <button
              type="submit"
              className="min-h-11 shrink-0 rounded-xs bg-ink px-5 text-base font-medium text-paper transition-colors duration-200 hover:bg-proof motion-reduce:transition-none"
            >
              {t("search")}
            </button>
          </div>
        </form>

        {tags.length > 0 && (
          <nav aria-label={t("tagsLabel")}>
            <ul className="flex flex-wrap gap-2">
              <li>
                <TagLink
                  href={blogQueryString({ ...query, tag: "", page: 1 })}
                  active={!query.tag}
                  onClick={(event) => onLinkClick(event, { ...query, tag: "", page: 1 })}
                >
                  {t("allTags")}
                </TagLink>
              </li>
              {tags.map(({ tag, count }) => (
                <li key={tag}>
                  <TagLink
                    href={blogQueryString({ ...query, tag, page: 1 })}
                    active={query.tag === tag}
                    onClick={(event) => onLinkClick(event, { ...query, tag, page: 1 })}
                  >
                    {tag}
                    <span className="ms-1.5 text-ink-soft">{format.number(count, { numberingSystem: "latn" })}</span>
                  </TagLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <p role="status" className="text-sm text-ink-soft">
          {filtered.length > 0 ? t("results", { count: filtered.length }) : hasFilter ? t("noResults") : t("noPosts")}
        </p>
      </div>

      {items.length > 0 && (
        <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {items.map((post) => (
            <li key={post._id}>
              <article className="flex h-full flex-col gap-5 border-t border-ink pt-6">
                {post.coverImage?.asset && (
                  <Link href={unprefixedPostPath(post.slug ?? "")} tabIndex={-1} aria-hidden className="block">
                    <SanityImage
                      image={post.coverImage}
                      sizes="(min-width: 76rem) 36rem, (min-width: 768px) 45vw, calc(100vw - 2.5rem)"
                      className="aspect-video h-auto w-full bg-paper-deep object-cover"
                    />
                  </Link>
                )}
                <div className="flex flex-col gap-3">
                  <p className="flex flex-wrap items-baseline gap-x-3 text-xs font-medium tracking-label text-proof uppercase">
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), "long")}</time>
                    )}
                    {post.tags?.[0] && <span className="text-ink-soft">{post.tags[0]}</span>}
                  </p>
                  <h2 className="font-display text-2xl tracking-tight">
                    <Link
                      href={unprefixedPostPath(post.slug ?? "")}
                      className="transition-colors duration-200 hover:text-proof motion-reduce:transition-none"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && <p className="text-base text-ink-soft">{post.excerpt}</p>}
                  {post.author && <p className="text-sm text-ink-soft">{t("by", { author: post.author })}</p>}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label={t("pagination")} className="flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
          <PageLink
            disabled={page <= 1}
            href={blogQueryString({ ...query, page: page - 1 })}
            onClick={(event) => onLinkClick(event, { ...query, page: page - 1 })}
          >
            <ArrowIcon direction="back" />
            {t("previous")}
          </PageLink>
          <ol className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <a
                  href={blogQueryString({ ...query, page: n })}
                  onClick={(event) => onLinkClick(event, { ...query, page: n })}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={t("page", { page: n })}
                  className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xs px-2 text-base ${
                    n === page ? "font-semibold text-ink underline decoration-1 underline-offset-[6px]" : "text-ink-soft hover:text-proof"
                  }`}
                >
                  {format.number(n, { numberingSystem: "latn" })}
                </a>
              </li>
            ))}
          </ol>
          <PageLink
            disabled={page >= pageCount}
            href={blogQueryString({ ...query, page: page + 1 })}
            onClick={(event) => onLinkClick(event, { ...query, page: page + 1 })}
          >
            {t("next")}
            <ArrowIcon />
          </PageLink>
        </nav>
      )}
    </div>
  );
}

function TagLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: (event: MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`inline-flex min-h-11 items-center rounded-xs border px-3 text-sm transition-colors duration-200 motion-reduce:transition-none ${
        active ? "border-ink bg-ink text-paper" : "border-ink-soft text-ink hover:border-proof hover:text-proof"
      }`}
    >
      {children}
    </a>
  );
}

function PageLink({
  disabled,
  href,
  onClick,
  children,
}: {
  disabled: boolean;
  href: string;
  onClick: (event: MouseEvent) => void;
  children: React.ReactNode;
}) {
  const className = "inline-flex min-h-11 items-center gap-2 text-base font-medium";
  // A disabled link is not a link: it is removed from the tab order and the a11y tree's link list.
  return disabled ? (
    <span aria-hidden className={`${className} text-ink-soft/50`}>
      {children}
    </span>
  ) : (
    <a href={href} onClick={onClick} className={`${className} text-proof underline decoration-1 underline-offset-4 hover:decoration-2`}>
      {children}
    </a>
  );
}
