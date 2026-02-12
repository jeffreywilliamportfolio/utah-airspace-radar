import { formatDistanceToNowStrict } from "date-fns";
import { StoryItem } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function StoryCard({ stories }: { stories: StoryItem[] }) {
  return (
    <Card className="h-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Story Feed</h2>
        <span className="text-xs text-soft">{stories.length} items</span>
      </div>
      {stories.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-700/70 bg-slate-900/50 px-4 text-center">
          <span aria-hidden className="mb-2 text-lg text-soft">
            ◌
          </span>
          <p className="text-sm font-medium text-slate-200">No stories in last sweep</p>
          <p className="mt-1 text-xs text-soft">Waiting for the next ingestion cycle.</p>
        </div>
      ) : (
        <div className="space-y-3 overflow-auto pr-1">
          {stories.slice(0, 10).map((story) => (
            <article
              key={story.id}
              className="rounded-lg border border-slate-700/60 bg-slate-900/60 p-3"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold">{story.title}</h3>
                <span className="shrink-0 rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase text-soft">
                  {story.category}
                </span>
              </div>
              <p className="text-xs text-slate-300">{story.summary}</p>
              <div className="mt-2 flex items-center justify-between">
                <time className="text-xs text-soft">
                  {formatDistanceToNowStrict(new Date(story.publishedAt), {
                    addSuffix: true
                  })}
                </time>
                <a
                  href={story.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  Source
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </Card>
  );
}
