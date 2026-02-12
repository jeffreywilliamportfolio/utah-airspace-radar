import { prisma } from "@/lib/db";
import { braveWebSearch } from "@/lib/brave";
import {
  summarizeStoriesWithAgent,
  type CandidateStory
} from "@/lib/agents/airspace-agent";
import { fetchBraveNotams } from "@/lib/notams";
import { fetchSlcAircraft } from "@/lib/map/opensky";

const STORY_QUERIES = [
  "Utah airspace incident",
  "Salt Lake City airport operations",
  "Utah restricted airspace update",
  "Hill AFB airspace public report",
  "FAA Utah advisory"
];

export async function runIngestionPipeline() {
  const ingestionRun = await prisma.ingestionRun.create({
    data: {
      status: "RUNNING",
      metadata: { storyQueries: STORY_QUERIES }
    }
  });

  try {
    const searchResults = await Promise.all(
      STORY_QUERIES.map((query) =>
        braveWebSearch({ query, count: 8, freshnessDays: 10 })
      )
    );

    const storiesByUrl = new Map<string, CandidateStory>();

    for (const result of searchResults.flat()) {
      if (!result.url) {
        continue;
      }
      storiesByUrl.set(result.url, {
        title: result.title,
        description: result.description,
        sourceUrl: result.url
      });
    }

    const candidates = Array.from(storiesByUrl.values()).slice(0, 25);
    const summaries = await summarizeStoriesWithAgent(candidates);
    const summaryByUrl = new Map(summaries.map((item) => [item.sourceUrl, item]));

    const notams = await fetchBraveNotams();
    const aircraft = await fetchSlcAircraft();

    for (const candidate of candidates) {
      const summary = summaryByUrl.get(candidate.sourceUrl);
      await prisma.story.upsert({
        where: { sourceUrl: candidate.sourceUrl },
        create: {
          title: candidate.title,
          summary: summary?.summary ?? candidate.description,
          sourceUrl: candidate.sourceUrl,
          publishedAt: new Date(),
          category: summary?.category ?? "General",
          ingestionRunId: ingestionRun.id,
          citations: {
            create: [{ label: "Source", url: candidate.sourceUrl }]
          }
        },
        update: {
          title: candidate.title,
          summary: summary?.summary ?? candidate.description,
          category: summary?.category ?? "General",
          ingestionRunId: ingestionRun.id
        }
      });
    }

    await prisma.notamItem.deleteMany();
    if (notams.length > 0) {
      await prisma.notamItem.createMany({
        data: notams.map((item) => ({
          title: item.title,
          body: item.body,
          sourceUrl: item.sourceUrl,
          ingestionRunId: ingestionRun.id
        }))
      });
    }

    await prisma.aircraftSnapshot.deleteMany();
    if (aircraft.length > 0) {
      await prisma.aircraftSnapshot.createMany({
        data: aircraft.map((item) => ({
          callsign: item.callsign,
          latitude: item.latitude,
          longitude: item.longitude,
          altitude: item.altitude,
          heading: item.heading,
          seenAt: new Date(item.seenAt),
          source: "OpenSky",
          ingestionRunId: ingestionRun.id
        }))
      });
    }

    await prisma.eventLogItem.create({
      data: {
        type: "INGESTION",
        message: `Processed ${candidates.length} stories, ${notams.length} NOTAM candidates, ${aircraft.length} aircraft points.`,
        metadata: {
          candidateCount: candidates.length,
          notamCount: notams.length,
          aircraftCount: aircraft.length
        },
        ingestionRunId: ingestionRun.id
      }
    });

    await prisma.ingestionRun.update({
      where: { id: ingestionRun.id },
      data: {
        status: "SUCCEEDED",
        finishedAt: new Date(),
        storyCount: candidates.length,
        notamCount: notams.length,
        aircraftCount: aircraft.length
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ingestion error";

    await prisma.eventLogItem
      .create({
        data: {
          type: "ERROR",
          message: `Ingestion failed: ${message}`,
          metadata: {},
          ingestionRunId: ingestionRun.id
        }
      })
      .catch(() => undefined);

    await prisma.ingestionRun
      .update({
        where: { id: ingestionRun.id },
        data: {
          status: "FAILED",
          finishedAt: new Date(),
          error: message
        }
      })
      .catch(() => undefined);

    throw error;
  }
}
