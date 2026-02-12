"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DashboardData } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard-header";
import { DesktopGrid } from "@/components/desktop-grid";
import { MobileStack } from "@/components/mobile-stack";
import { SplashScreen } from "@/components/splash-screen";
import { LottieBackground } from "@/components/lottie-background";

type ViewMode = "desktop" | "mobile";
type SplashPhase = "visible" | "transitioning" | "hidden";

gsap.registerPlugin(useGSAP);

export function AppShell({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [splashPhase, setSplashPhase] = useState<SplashPhase>("visible");
  const scopeRef = useRef<HTMLDivElement>(null);

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
    if (typeof window === "undefined") {
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeoutMs = reduceMotion ? 120 : 850;
    const timer = window.setTimeout(() => setSplashPhase("transitioning"), timeoutMs);
    return () => window.clearTimeout(timer);
  }, []);

  useGSAP(
    () => {
      if (splashPhase !== "transitioning") {
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        gsap.set(".page-shell", { opacity: 1 });
        setSplashPhase("hidden");
        return;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => setSplashPhase("hidden")
      });
      timeline.to(".splash-screen", { opacity: 0, duration: 0.45 }, 0);
      timeline.fromTo(".page-shell", { opacity: 0 }, { opacity: 1, duration: 0.65 }, 0.2);
    },
    { scope: scopeRef, dependencies: [splashPhase] }
  );

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
    <div ref={scopeRef} className="relative min-h-screen">
      <LottieBackground />
      {splashPhase !== "hidden" ? <SplashScreen /> : null}
      <main className="page-shell relative z-10 mx-auto min-h-screen max-w-[1920px] p-4 md:p-6 2xl:max-w-[2280px]">
        <DashboardHeader generatedAt={data.generatedAt} />
        {viewMode === "desktop" ? (
          <DesktopGrid data={data} />
        ) : (
          <MobileStack data={data} />
        )}
      </main>
    </div>
  );
}
