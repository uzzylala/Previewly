"use client";

import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { defineDocuments, defineLocations, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { locales, localeMeta } from "./i18n/locales";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

/** Where a page lives on the site: /<language> for a homepage, /<language>/<slug> otherwise. */
const pagePath = (language: string | undefined, slug: string | undefined) => {
  const prefix = `/${language ?? "en"}`;
  return !slug || slug === "home" ? prefix : `${prefix}/${encodeURIComponent(slug)}`;
};

export default defineConfig({
  name: "previewly",
  title: "Previewly",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool(),
    // One document per language, linked by a translation.metadata document. Adds the
    // "Translations" menu to a page, and keeps each language's draft/publish independent.
    documentInternationalization({
      supportedLanguages: locales.map((id) => ({ id, title: localeMeta[id].title })),
      schemaTypes: ["page", "post"],
    }),
    // Live preview of drafts in the real site. The Studio mints a short-lived secret from
    // the editor's session; /api/draft-mode/enable validates it server-side.
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      resolve: {
        // Which document the Studio opens for a given URL...
        mainDocuments: defineDocuments([
          {
            route: "/:language",
            filter: `_type == "page" && slug.current == "home" && language == $language`,
          },
          {
            route: "/:language/blog/:slug",
            filter: `_type == "post" && slug.current == $slug && language == $language`,
          },
          {
            route: "/:language/:slug",
            filter: `_type == "page" && slug.current == $slug && language == $language`,
          },
        ]),
        // ...and which URLs a document appears on.
        locations: {
          post: defineLocations({
            select: { title: "title", slug: "slug.current", language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: `${doc?.title || "Untitled post"}${doc?.language ? ` (${doc.language.toUpperCase()})` : ""}`,
                  href: doc?.slug
                    ? `/${doc.language ?? "en"}/blog/${encodeURIComponent(doc.slug)}`
                    : `/${doc?.language ?? "en"}/blog`,
                },
                { title: "Blog index", href: `/${doc?.language ?? "en"}/blog` },
              ],
            }),
          }),
          page: defineLocations({
            select: { title: "title", slug: "slug.current", language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: `${doc?.title || "Untitled page"}${doc?.language ? ` (${doc.language.toUpperCase()})` : ""}`,
                  href: pagePath(doc?.language, doc?.slug),
                },
              ],
            }),
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
