"use client";

import { Responsive, WidthProvider, type Layouts } from "react-grid-layout";
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

const ResponsiveGrid = WidthProvider(Responsive);

const layouts: Layouts = {
  xxl: [
    { i: "stories", x: 0, y: 0, w: 8, h: 9 },
    { i: "notams", x: 8, y: 0, w: 8, h: 5 },
    { i: "map", x: 8, y: 5, w: 8, h: 5 },
    { i: "events", x: 0, y: 9, w: 5, h: 7 },
    { i: "audio", x: 5, y: 9, w: 3, h: 4 },
    { i: "anomaly", x: 8, y: 10, w: 4, h: 3 },
    { i: "changes", x: 12, y: 10, w: 4, h: 4 }
  ],
  xl: [
    { i: "stories", x: 0, y: 0, w: 7, h: 9 },
    { i: "notams", x: 7, y: 0, w: 7, h: 5 },
    { i: "map", x: 7, y: 5, w: 7, h: 5 },
    { i: "events", x: 0, y: 9, w: 4, h: 7 },
    { i: "audio", x: 4, y: 9, w: 3, h: 4 },
    { i: "anomaly", x: 7, y: 10, w: 4, h: 3 },
    { i: "changes", x: 11, y: 10, w: 3, h: 4 }
  ],
  lg: [
    { i: "stories", x: 0, y: 0, w: 6, h: 8 },
    { i: "notams", x: 6, y: 0, w: 6, h: 6 },
    { i: "map", x: 6, y: 6, w: 6, h: 6 },
    { i: "events", x: 0, y: 8, w: 4, h: 7 },
    { i: "audio", x: 4, y: 8, w: 4, h: 5 },
    { i: "anomaly", x: 8, y: 12, w: 4, h: 3 },
    { i: "changes", x: 4, y: 13, w: 4, h: 2 }
  ],
  md: [
    { i: "stories", x: 0, y: 0, w: 10, h: 8 },
    { i: "notams", x: 0, y: 8, w: 5, h: 6 },
    { i: "map", x: 5, y: 8, w: 5, h: 6 },
    { i: "events", x: 0, y: 14, w: 5, h: 7 },
    { i: "audio", x: 5, y: 14, w: 5, h: 5 },
    { i: "anomaly", x: 0, y: 21, w: 5, h: 3 },
    { i: "changes", x: 5, y: 21, w: 5, h: 3 }
  ]
};

export function DesktopGrid({ data }: { data: DashboardData }) {
  return (
    <ResponsiveGrid
      className="layout"
      layouts={layouts}
      breakpoints={{ xxl: 1900, xl: 1450, lg: 1200, md: 960, sm: 0 }}
      cols={{ xxl: 16, xl: 14, lg: 12, md: 10, sm: 1 }}
      rowHeight={52}
      margin={[14, 14]}
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
