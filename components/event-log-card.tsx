import { formatDistanceToNowStrict } from "date-fns";
import { EventLogEntry } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function EventLogCard({ eventLog }: { eventLog: EventLogEntry[] }) {
  return (
    <Card className="h-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Event Log</h2>
        <span className="text-xs text-soft">{eventLog.length} events</span>
      </div>
      {eventLog.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-700/70 bg-slate-900/50 px-4 text-center">
          <span aria-hidden className="mb-2 text-lg text-soft">
            ◌
          </span>
          <p className="text-sm font-medium text-slate-200">No recent events</p>
          <p className="mt-1 text-xs text-soft">Pipeline events appear here after ingest.</p>
        </div>
      ) : (
        <ul className="space-y-2 overflow-auto pr-1 text-xs">
          {eventLog.slice(0, 14).map((event) => (
            <li
              key={event.id}
              className="rounded-lg border border-slate-700/60 bg-slate-900/70 p-2"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="rounded bg-slate-700/80 px-1.5 py-0.5 text-[10px] uppercase text-slate-200">
                  {event.type}
                </span>
                <time className="text-xs text-soft">
                  {formatDistanceToNowStrict(new Date(event.createdAt), {
                    addSuffix: true
                  })}
                </time>
              </div>
              <p className="text-slate-200">{event.message}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
