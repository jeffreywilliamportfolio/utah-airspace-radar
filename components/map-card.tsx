import { AircraftPoint } from "@/lib/types";
import { Card } from "@/components/ui/card";

const SLC_CENTER = { lat: 40.7899, lon: -111.9791 };

export function MapCard({ aircraft }: { aircraft: AircraftPoint[] }) {
  return (
    <Card className="h-full p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Aircraft Around KSLC</h2>
        <span className="text-xs text-soft">{aircraft.length} tracked</span>
      </div>
      <div className="rounded-lg border border-slate-700/60 bg-slate-950/70 p-2">
        <svg viewBox="0 0 300 180" className="h-40 w-full">
          <rect width="300" height="180" fill="#020617" />
          <circle cx="150" cy="90" r="5" fill="#93c5fd" />
          {aircraft.slice(0, 40).map((item) => {
            const x = 150 + (item.longitude - SLC_CENTER.lon) * 180;
            const y = 90 - (item.latitude - SLC_CENTER.lat) * 180;
            return (
              <g key={item.id}>
                <circle cx={x} cy={y} r="3" fill="#22d3ee" />
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="mt-3 space-y-1 overflow-auto text-xs text-slate-300">
        {aircraft.slice(0, 6).map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <span>{item.callsign || "Unknown"}</span>
            <span>
              {item.altitude ? `${Math.round(item.altitude)} m` : "No altitude"}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
