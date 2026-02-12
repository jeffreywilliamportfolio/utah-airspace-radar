import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { runIngestionPipeline } from "@/lib/ingestion/pipeline";

export const runtime = "nodejs";

function isAuthorized(request: Request): boolean {
  if (!env.CRON_SECRET) {
    return true;
  }

  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const secretFromQuery = url.searchParams.get("secret");
  return (
    authHeader === `Bearer ${env.CRON_SECRET}` || secretFromQuery === env.CRON_SECRET
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await runIngestionPipeline();
  return NextResponse.json({ ok: true, ranAt: new Date().toISOString() });
}
