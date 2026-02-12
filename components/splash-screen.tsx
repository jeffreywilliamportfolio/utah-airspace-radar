"use client";

export function SplashScreen() {
  return (
    <div className="splash-screen fixed inset-0 z-50 flex items-center justify-center bg-surface">
      <div className="text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-soft">Utah Airspace</p>
        <h1 className="font-heading text-3xl font-semibold text-slate-100 md:text-4xl">
          Monitor
        </h1>
        <div className="mx-auto mt-5 h-1 w-20 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
