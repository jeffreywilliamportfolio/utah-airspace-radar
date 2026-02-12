"use client";

import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import { DashboardData } from "@/lib/types";
import { StoryCard } from "@/components/story-card";
import { NotamCard } from "@/components/notam-card";
import { EventLogCard } from "@/components/event-log-card";
import { MapCard } from "@/components/map-card";
import { AudioCard } from "@/components/audio-card";
import { AnomalyRadarCard } from "@/components/anomaly-radar-card";
import { ChangesCard } from "@/components/changes-card";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGrid = WidthProvider(GridLayout);

const layout: Layout[] = [
  { i: "stories", x: 0, y: 0, w: 6, h: 8 },
  { i: "notams", x: 6, y: 0, w: 6, h: 6 },
  { i: "map", x: 6, y: 6, w: 6, h: 6 },
  { i: "events", x: 0, y: 8, w: 4, h: 7 },
  { i: "audio", x: 4, y: 8, w: 4, h: 5 },
  { i: "anomaly", x: 8, y: 12, w: 4, h: 3 },
  { i: "changes", x: 4, y: 13, w: 4, h: 2 }
];

export function DesktopGrid({ data }: { data: DashboardData }) {
  return (
    <ResponsiveGrid
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={48}
      width={1200}
      margin={[12, 12]}
      isResizable
      isDraggable
    >
      <div key="stories">
        <StoryCard stories={data.stories} />
      </div>
      <div key="notams">
        <NotamCard notams={data.notams} />
      </div>
      <div key="map">
        <MapCard aircraft={data.aircraft} />
      </div>
      <div key="events">
        <EventLogCard eventLog={data.eventLog} />
      </div>
      <div key="audio">
        <AudioCard />
      </div>
      <div key="anomaly">
        <AnomalyRadarCard
          stories={data.stories}
          eventLog={data.eventLog}
          notams={data.notams}
        />
      </div>
      <div key="changes">
        <ChangesCard stories={data.stories} eventLog={data.eventLog} />
      </div>
    </ResponsiveGrid>
  );
}
