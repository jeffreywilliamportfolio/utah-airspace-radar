import { format } from "date-fns";
import { NotamItem } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function NotamCard({ notams }: { notams: NotamItem[] }) {
  return (
    <Card className="h-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">SLC NOTAM Signals</h2>
        <span className="text-xs text-soft">{notams.length} records</span>
      </div>
      <div className="space-y-3 overflow-auto pr-1">
        {notams.slice(0, 8).map((notam) => (
          <article
            key={notam.id}
            className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-3"
          >
            <h3 className="text-sm font-semibold text-amber-200">{notam.title}</h3>
            <p className="mt-1 text-xs text-amber-100/90">{notam.body}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-amber-100/80">
                {notam.effectiveFrom
                  ? format(new Date(notam.effectiveFrom), "MMM d, HH:mm")
                  : "Time unknown"}
              </span>
              <a
                href={notam.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-300 underline-offset-2 hover:underline"
              >
                Source
              </a>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
