import { PortableText } from "next-sanity";
import { getFormatter, getTranslations } from "next-intl/server";

import { richTextComponents } from "@/components/blocks/rich-text";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { Reveal } from "@/components/ui/reveal";
import { SanityImage } from "@/components/ui/sanity-image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locales";
import { blogQueryString } from "@/lib/blog-search";
import type { Post } from "@/sanity/lib/posts";

/**
 * One post. `displayLocale` is the language the article is written in: for a fallback that
 * is the default locale, so the byline and date read in the language of the body, and its
 * tags are plain text (they don't exist as filters in the visitor's own language).
 */
export async function PostView({
  post,
  displayLocale,
  isFallback,
}: {
  post: Post;
  displayLocale: Locale;
  isFallback: boolean;
}) {
  const t = await getTranslations({ locale: displayLocale, namespace: "Blog" });
  const format = await getFormatter({ locale: displayLocale });
  const published = post.publishedAt ? new Date(post.publishedAt) : null;
  const tags = post.tags ?? [];

  return (
    <article className="mx-auto max-w-page px-gutter py-section">
      <header className="flex max-w-[52rem] flex-col items-start gap-6">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-proof underline decoration-1 underline-offset-4 hover:decoration-2"
        >
          <ArrowIcon direction="back" />
          {t("back")}
        </Link>
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium tracking-label text-proof uppercase">
            {tags.map((tag) => (
              <li key={tag}>
                {isFallback ? (
                  tag
                ) : (
                  <Link href={`/blog${blogQueryString({ q: "", tag, page: 1 })}`} className="hover:underline">
                    {tag}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="max-w-measure text-xl text-ink-soft">{post.excerpt}</p>}
        <p className="flex flex-wrap items-baseline gap-x-4 text-sm text-ink-soft">
          {post.author && <span>{t("by", { author: post.author })}</span>}
          {published && (
            <span>
              {t("published")}{" "}
              <time dateTime={post.publishedAt ?? undefined}>{format.dateTime(published, "long")}</time>
            </span>
          )}
        </p>
      </header>

      {post.coverImage?.asset && (
        <Reveal className="my-14">
          <figure className="crop-marks mx-6 md:mx-0">
            <SanityImage
              image={post.coverImage}
              sizes="(min-width: 76rem) 72rem, calc(100vw - 5.5rem)"
              className="aspect-video h-auto w-full bg-paper-deep object-cover"
              preload
            />
          </figure>
        </Reveal>
      )}

      {post.body && post.body.length > 0 && (
        <div className="mt-12 flex max-w-measure flex-col gap-5 text-lg text-ink-soft">
          <PortableText value={post.body} components={richTextComponents} />
        </div>
      )}
    </article>
  );
}
