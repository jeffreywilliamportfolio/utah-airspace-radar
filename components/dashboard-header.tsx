import { format } from "date-fns";

export function DashboardHeader({ generatedAt }: { generatedAt: string }) {
  return (
    <header className="mb-4 flex h-14 shrink-0 items-center rounded-xl border border-slate-800/80 bg-slate-950/55 px-4 md:mb-5 lg:h-16 lg:px-6">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-soft">Dashboard</p>
          <h1 className="truncate font-heading text-lg font-semibold md:text-xl">
            Utah Airspace Monitor
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/settings"
            className="rounded-md border border-slate-600/90 px-3 py-2 text-xs font-medium text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Settings
          </a>
          <a
            href="/api/export/pdf"
            className="rounded-md bg-accent px-3 py-2 text-xs font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Save Snapshot PDF
          </a>
          <span className="rounded-md border border-slate-600/90 px-3 py-2 text-xs text-soft">
            Updated {format(new Date(generatedAt), "MMM d, HH:mm:ss")}
          </span>
        </div>
      </div>
    </header>
  );
}
