import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { safeRedirectPath } from "@/lib/safe-redirect";

/** Used by the Presentation tool when it leaves preview; `?redirect=` is sanitised. */
export async function GET(request: NextRequest) {
  (await draftMode()).disable();
  redirect(safeRedirectPath(request.nextUrl.searchParams.get("redirect"), request.nextUrl.origin));
}
