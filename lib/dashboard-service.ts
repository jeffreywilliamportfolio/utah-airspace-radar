import { prisma } from "@/lib/db";
import { getFallbackDashboardData } from "@/lib/sample-data";
import { DashboardData } from "@/lib/types";

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [stories, eventLog, notams, aircraft] = await Promise.all([
      prisma.story.findMany({
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 30,
        include: { citations: true }
      }),
      prisma.eventLogItem.findMany({
        orderBy: { createdAt: "desc" },
        take: 40
      }),
      prisma.notamItem.findMany({
        orderBy: { createdAt: "desc" },
        take: 20
      }),
      prisma.aircraftSnapshot.findMany({
        orderBy: { seenAt: "desc" },
        take: 120
      })
    ]);

    return {
      generatedAt: new Date().toISOString(),
      stories: stories.map((story) => ({
        id: story.id,
        title: story.title,
        summary: story.summary,
        sourceUrl: story.sourceUrl,
        imageUrl: story.imageUrl,
        publishedAt: story.publishedAt.toISOString(),
        category: story.category,
        citations: story.citations.map((citation) => ({
          label: citation.label,
          url: citation.url
        }))
      })),
      eventLog: eventLog.map((event) => ({
        id: event.id,
        type: event.type,
        message: event.message,
        createdAt: event.createdAt.toISOString(),
        metadata: toRecord(event.metadata)
      })),
      notams: notams.map((notam) => ({
        id: notam.id,
        title: notam.title,
        body: notam.body,
        sourceUrl: notam.sourceUrl,
        effectiveFrom: notam.effectiveFrom?.toISOString() ?? null,
        effectiveTo: notam.effectiveTo?.toISOString() ?? null
      })),
      aircraft: aircraft.map((item) => ({
        id: item.id,
        callsign: item.callsign,
        latitude: item.latitude,
        longitude: item.longitude,
        altitude: item.altitude,
        heading: item.heading,
        seenAt: item.seenAt.toISOString()
      })),
      sources: ["Brave Search API", "OpenSky", "OpenAI Agents"]
    };
  } catch {
    return getFallbackDashboardData();
  }
}

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}
