import Link from "next/link";

const primaryLinks = [
  { label: "Overview", href: "/" },
  { label: "Story Feed", href: "#story-feed" },
  { label: "NOTAM Signals", href: "#notam-signals" },
  { label: "Aircraft", href: "#aircraft-tracker" },
  { label: "Event Log", href: "#event-log" }
];

const utilityLinks = [
  { label: "Settings", href: "/settings" },
  { label: "Export PDF", href: "/api/export/pdf" }
];

export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/55 md:flex md:flex-col">
      <div className="border-b border-slate-800/80 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.16em] text-soft">shadcn dashboard</p>
        <h2 className="mt-1 font-heading text-lg font-semibold">Airspace Ops</h2>
      </div>

      <nav className="flex-1 space-y-6 p-4">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-soft">Main</p>
          <ul className="space-y-1">
            {primaryLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800/70"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-soft">Actions</p>
          <ul className="space-y-1">
            {utilityLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800/70"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
