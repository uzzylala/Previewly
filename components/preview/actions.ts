"use server";

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { safeRedirectPath } from "@/lib/safe-redirect";

/** Leaves preview and returns to the published version of the same page. */
export async function exitPreview(formData: FormData) {
  (await draftMode()).disable();
  redirect(safeRedirectPath(formData.get("returnTo")?.toString()));
}
