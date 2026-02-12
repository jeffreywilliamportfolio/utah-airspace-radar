import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard-service";
import { buildDashboardPdf } from "@/lib/pdf";

export const runtime = "nodejs";

export async function GET() {
  const data = await getDashboardData();
  const buffer = await buildDashboardPdf(data);
  const body = new Uint8Array(buffer);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="utah-airspace-${Date.now()}.pdf"`
    }
  });
}
