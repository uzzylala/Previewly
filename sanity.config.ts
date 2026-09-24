"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { defineDocuments, defineLocations, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

const pagePath = (slug: string | undefined) => (!slug || slug === "home" ? "/" : `/${slug}`);

export default defineConfig({
  name: "previewly",
  title: "Previewly",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool(),
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
          { route: "/", filter: `_type == "page" && slug.current == "home"` },
          { route: "/:slug", filter: `_type == "page" && slug.current == $slug` },
        ]),
        // ...and which URLs a document appears on.
        locations: {
          page: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [{ title: doc?.title || "Untitled page", href: pagePath(doc?.slug) }],
            }),
          }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
