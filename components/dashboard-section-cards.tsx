import { DashboardData } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function DashboardSectionCards({ data }: { data: DashboardData }) {
  const ingestionEvents = data.eventLog.filter((entry) => entry.type === "INGESTION").length;
  const highestAltitude = data.aircraft.reduce((max, aircraft) => {
    if (aircraft.altitude == null) {
      return max;
    }
    return Math.max(max, aircraft.altitude);
  }, 0);

  const cards = [
    {
      title: "Stories",
      value: String(data.stories.length),
      subtitle: "Tracked in latest sweep",
      trend: data.stories.length > 0 ? "Active feed" : "Awaiting feed"
    },
    {
      title: "NOTAMs",
      value: String(data.notams.length),
      subtitle: "Current advisory records",
      trend: data.notams.length > 0 ? "Monitoring changes" : "No active alerts"
    },
    {
      title: "Aircraft",
      value: String(data.aircraft.length),
      subtitle: "Live telemetry points",
      trend: highestAltitude > 0 ? `Peak ${Math.round(highestAltitude)} m` : "No altitude data"
    },
    {
      title: "Ingestion",
      value: String(ingestionEvents),
      subtitle: "Pipeline events captured",
      trend: ingestionEvents > 0 ? "Feed healthy" : "No recent events"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="p-4">
          <p className="text-xs uppercase tracking-wide text-soft">{card.title}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{card.value}</p>
          <p className="mt-1 text-xs text-soft">{card.subtitle}</p>
          <p className="mt-3 text-xs font-medium text-slate-200">{card.trend}</p>
        </Card>
      ))}
    </div>
  );
}
