import { format } from "date-fns";

export function DashboardHeader({ generatedAt }: { generatedAt: string }) {
  return (
    <header className="mb-4 rounded-xl border border-slate-700/70 bg-panel/85 p-4 shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Utah Airspace Monitor</h1>
          <p className="text-sm text-soft">
            Realtime story intelligence for Utah, KSLC, and public airspace signals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/export/pdf"
            className="rounded-md bg-accent px-3 py-2 text-xs font-semibold text-slate-900"
          >
            Save Snapshot PDF
          </a>
          <span className="rounded-md border border-slate-600 px-3 py-2 text-xs text-soft">
            Updated {format(new Date(generatedAt), "MMM d, HH:mm:ss")}
          </span>
        </div>
      </div>
    </header>
  );
}
