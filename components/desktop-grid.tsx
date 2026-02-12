"use client";

import { DashboardData } from "@/lib/types";
import { StoryCard } from "@/components/story-card";
import { NotamCard } from "@/components/notam-card";
import { EventLogCard } from "@/components/event-log-card";
import { MapCard } from "@/components/map-card";
import { AudioCard } from "@/components/audio-card";
import { AnomalyRadarCard } from "@/components/anomaly-radar-card";
import { ChangesCard } from "@/components/changes-card";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardSectionCards } from "@/components/dashboard-section-cards";

export function DesktopGrid({ data }: { data: DashboardData }) {
  return (
    <section className="flex min-h-[calc(100vh-7.5rem)] overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/45 shadow-soft">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <DashboardSectionCards data={data} />

            <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
              <section id="story-feed" className="min-h-[520px]">
                <StoryCard stories={data.stories} />
              </section>
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <div id="notam-signals" className="min-h-[250px]">
                  <NotamCard notams={data.notams} />
                </div>
                <div id="aircraft-tracker" className="min-h-[250px]">
                  <MapCard aircraft={data.aircraft} />
                </div>
              </section>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <section id="event-log" className="min-h-[280px]">
                <EventLogCard eventLog={data.eventLog} />
              </section>
              <section className="min-h-[280px]">
                <AudioCard />
              </section>
              <section className="min-h-[280px]">
                <AnomalyRadarCard
                  stories={data.stories}
                  eventLog={data.eventLog}
                  notams={data.notams}
                />
              </section>
              <section className="min-h-[280px]">
                <ChangesCard stories={data.stories} eventLog={data.eventLog} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
