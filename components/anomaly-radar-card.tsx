import { StoryItem, EventLogEntry, NotamItem } from "@/lib/types";
import { Card } from "@/components/ui/card";

type Signal = {
  id: string;
  label: string;
  score: number;
};

export function AnomalyRadarCard({
  stories,
  eventLog,
  notams
}: {
  stories: StoryItem[];
  eventLog: EventLogEntry[];
  notams: NotamItem[];
}) {
  const signals = buildSignals(stories, eventLog, notams);

  return (
    <Card className="h-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Anomaly Radar</h2>
        <span className="text-xs text-soft">Experimental</span>
      </div>
      <ul className="space-y-2">
        {signals.map((signal) => (
          <li
            key={signal.id}
            className="rounded-lg border border-violet-500/40 bg-violet-950/20 p-2"
          >
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>{signal.label}</span>
              <span>{signal.score}/100</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-slate-800">
              <div
                className="h-full bg-violet-400"
                style={{ width: `${signal.score}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function buildSignals(
  stories: StoryItem[],
  eventLog: EventLogEntry[],
  notams: NotamItem[]
): Signal[] {
  const restrictedHits = stories.filter((story) =>
    /restricted|temporary flight restriction|military|range/i.test(
      `${story.title} ${story.summary}`
    )
  ).length;
  const runwayHits = notams.filter((notam) =>
    /runway|taxiway|closure|braking/i.test(`${notam.title} ${notam.body}`)
  ).length;
  const ingestionHits = eventLog.filter((event) => event.type === "INGESTION").length;

  return [
    {
      id: "restricted",
      label: "Restricted-airspace chatter",
      score: Math.min(100, 20 + restrictedHits * 18)
    },
    {
      id: "runway",
      label: "Runway/ops disruption trend",
      score: Math.min(100, 10 + runwayHits * 20)
    },
    {
      id: "cadence",
      label: "Ingestion volatility",
      score: Math.min(100, 30 + ingestionHits * 7)
    }
  ];
}
