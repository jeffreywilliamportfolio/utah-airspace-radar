import { subMinutes } from "date-fns";
import { DashboardData } from "@/lib/types";

export function getFallbackDashboardData(): DashboardData {
  const now = new Date();

  return {
    generatedAt: now.toISOString(),
    stories: [
      {
        id: "demo-1",
        title: "Utah test range activity windows update",
        summary:
          "Regional outlets report temporary activity windows in restricted corridors with no change to regular civil routes into KSLC.",
        sourceUrl: "https://www.faa.gov",
        imageUrl: null,
        publishedAt: subMinutes(now, 11).toISOString(),
        category: "Airspace Ops",
        citations: [{ label: "FAA", url: "https://www.faa.gov" }]
      },
      {
        id: "demo-2",
        title: "Weather pattern could affect arrival sequencing",
        summary:
          "A frontal shift may increase vectoring and spacing during peak periods. Monitoring for updates across local aviation channels.",
        sourceUrl: "https://www.weather.gov",
        imageUrl: null,
        publishedAt: subMinutes(now, 23).toISOString(),
        category: "Weather",
        citations: [{ label: "NWS", url: "https://www.weather.gov" }]
      }
    ],
    eventLog: [
      {
        id: "evt-1",
        type: "INGESTION",
        message: "Initial dashboard bootstrapped with fallback data.",
        createdAt: subMinutes(now, 2).toISOString(),
        metadata: { status: "fallback" }
      }
    ],
    notams: [
      {
        id: "notam-1",
        title: "KSLC runway condition advisory",
        body: "Reference-only placeholder until Brave-based NOTAM ingestion runs.",
        sourceUrl: "https://www.faa.gov/air_traffic/publications/notices/",
        effectiveFrom: subMinutes(now, 30).toISOString(),
        effectiveTo: null
      }
    ],
    aircraft: [
      {
        id: "ac-1",
        callsign: "DAL123",
        latitude: 40.79,
        longitude: -111.97,
        altitude: 10200,
        heading: 130,
        seenAt: subMinutes(now, 1).toISOString()
      },
      {
        id: "ac-2",
        callsign: "SWA887",
        latitude: 40.73,
        longitude: -111.86,
        altitude: 6500,
        heading: 265,
        seenAt: subMinutes(now, 1).toISOString()
      }
    ],
    sources: ["fallback"]
  };
}
