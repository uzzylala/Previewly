import { createClient } from "@sanity/client";
import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret";
import { writeFileSync } from "node:fs";
const c = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, token: process.env.SANITY_API_EDITORIAL_TOKEN, apiVersion: "2025-09-01", useCdn: false });
const out = [];
for (const locale of ["en", "fr", "ar"]) out.push({ locale, secret: (await createPreviewSecret(c, "a11y", "http://localhost:3000/studio")).secret });
writeFileSync("C:/Users/UZEZI/AppData/Local/Temp/claude/c--Users-UZEZI-Desktop-react-resume-previewly/71b776a3-5cb9-43ac-bffd-630ab286c357/scratchpad/secrets.json", JSON.stringify(out)); process.exit(0);
