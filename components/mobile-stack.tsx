import { DashboardData } from "@/lib/types";
import { StoryCard } from "@/components/story-card";
import { NotamCard } from "@/components/notam-card";
import { MapCard } from "@/components/map-card";
import { ChangesCard } from "@/components/changes-card";
import { AnomalyRadarCard } from "@/components/anomaly-radar-card";
import { EventLogCard } from "@/components/event-log-card";
import { AudioCard } from "@/components/audio-card";

export function MobileStack({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-4">
      <StoryCard stories={data.stories} />
      <NotamCard notams={data.notams} />
      <MapCard aircraft={data.aircraft} />
      <ChangesCard stories={data.stories} eventLog={data.eventLog} />
      <AnomalyRadarCard
        stories={data.stories}
        eventLog={data.eventLog}
        notams={data.notams}
      />
      <EventLogCard eventLog={data.eventLog} />
      <AudioCard />
    </div>
  );
}
