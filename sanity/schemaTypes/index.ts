import type { SchemaTypeDefinition } from "sanity";

import { hero } from "./blocks/hero";
import { page } from "./documents/page";
import { link } from "./objects/link";

export const schemaTypes: SchemaTypeDefinition[] = [page, hero, link];
