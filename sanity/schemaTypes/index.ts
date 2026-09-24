import type { SchemaTypeDefinition } from "sanity";

import { blockTypes } from "./blocks";
import { page } from "./documents/page";
import { link } from "./objects/link";

export const schemaTypes: SchemaTypeDefinition[] = [page, link, ...blockTypes];
