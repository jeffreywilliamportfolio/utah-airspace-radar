import Link from "next/link";
import { Card } from "@/components/ui/card";

const colorTokens = [
  { name: "surface", swatch: "bg-surface" },
  { name: "panel", swatch: "bg-panel" },
  { name: "accent", swatch: "bg-accent" },
  { name: "soft text", swatch: "bg-soft" }
];

export default function SettingsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl p-4 md:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-soft">Preferences</p>
          <h1 className="font-heading text-3xl font-semibold">Settings</h1>
        </div>
        <Link
          href="/"
          className="rounded-md border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200"
        >
          Back to Dashboard
        </Link>
      </header>

      <Card className="space-y-6 p-5">
        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold">Display</h2>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-accent" />
              Auto-refresh dashboard cards
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-accent" />
              Enable motion transitions
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-accent" />
              Compact card spacing
            </label>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-heading text-lg font-semibold">Design Tokens</h2>
          <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="rounded-md border border-slate-700/70 p-2">
                <div className={`mb-2 h-7 rounded ${token.swatch}`} />
                <p className="text-soft">{token.name}</p>
              </div>
            ))}
          </div>
        </section>
      </Card>
    </main>
  );
}
