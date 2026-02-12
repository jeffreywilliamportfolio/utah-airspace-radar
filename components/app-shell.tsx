"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardData } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard-header";
import { DesktopGrid } from "@/components/desktop-grid";
import { MobileStack } from "@/components/mobile-stack";

type ViewMode = "desktop" | "mobile";

export function AppShell({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");

  const refreshMs = useMemo(() => {
    const raw = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS ?? 90000);
    return Number.isFinite(raw) ? raw : 90000;
  }, []);

  useEffect(() => {
    const update = () =>
      setViewMode(window.matchMedia("(max-width: 960px)").matches ? "mobile" : "desktop");

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const next = (await response.json()) as DashboardData;
      setData(next);
    }, refreshMs);

    return () => clearInterval(timer);
  }, [refreshMs]);

  return (
    <main className="mx-auto min-h-screen max-w-[1280px] p-4 md:p-6">
      <DashboardHeader generatedAt={data.generatedAt} />
      {viewMode === "desktop" ? (
        <DesktopGrid data={data} />
      ) : (
        <MobileStack data={data} />
      )}
    </main>
  );
}
