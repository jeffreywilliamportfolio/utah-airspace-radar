import { StoryItem, EventLogEntry } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function ChangesCard({
  stories,
  eventLog
}: {
  stories: StoryItem[];
  eventLog: EventLogEntry[];
}) {
  const newest = stories.slice(0, 5);
  const latestEvent = eventLog[0];

  return (
    <Card className="h-full p-4">
      <h2 className="mb-3 text-lg font-semibold">What Changed Since Last Sweep</h2>
      <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-3">
        <p className="text-xs text-soft">Most recent pipeline event</p>
        <p className="mt-1 text-sm text-slate-100">
          {latestEvent?.message ?? "No recorded ingestion yet."}
        </p>
      </div>
      <div className="mt-3">
        <p className="mb-2 text-xs text-soft">Newest sources</p>
        <ul className="space-y-1 text-xs">
          {newest.map((story) => (
            <li
              key={story.id}
              className="truncate rounded border border-slate-700/60 bg-slate-900/70 px-2 py-1"
            >
              {story.title}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
