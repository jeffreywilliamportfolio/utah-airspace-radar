import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { runIngestionPipeline } from "@/lib/ingestion/pipeline";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!env.INGEST_SECRET) {
    return NextResponse.json(
      { error: "INGEST_SECRET is not configured" },
      { status: 503 }
    );
  }

  const secret = request.headers.get("x-ingest-secret");
  if (secret !== env.INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await runIngestionPipeline();
  return NextResponse.json({ ok: true });
}
